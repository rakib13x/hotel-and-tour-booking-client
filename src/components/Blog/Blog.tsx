"use client";

import React, { useMemo, useEffect, useState } from "react";
import Link from "next/link";
import {
  Search, Calendar, User, ChevronRight, TrendingUp, BookOpen,
  Briefcase, Code, Heart, Camera, ChevronLeft, X
} from "lucide-react";
import { useGetAllBlogsQuery } from "@/redux/api/blogApi";
import { TQueryParam } from "@/types";

// --- Your exact Blog interface ---
export interface Blog {
  _id: string;
  title: string;
  content: string;
  category: {
    _id: string;
    name: string;
  };
  coverImage: string;
  images: string[];
  tags: string[] | string;
  readTime: string;
  status: "draft" | "published" | "pending";
  createdAt: string;
  updatedAt: string;
  __v: number;
}

// --- Utility: strip HTML tags ---
const stripHtml = (html: string | undefined): string =>
  html ? html.replace(/<[^>]+>/g, "") : "";

// --- Generate slug from title and id (for pretty URLs) ---
const generateSlug = (title: string, id: string): string =>
  title
    ? title
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/--+/g, "-")
        .trim() + `-${id}`
    : id;

// --- Category icon map ---
const categoryIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  Leadership: Briefcase, Technology: Code, Lifestyle: Heart,
  Photography: Camera, Business: TrendingUp, Destinations: BookOpen,
  "Visa Guide": BookOpen, "Budget Travel": Heart,
  "Cultural Experiences": Camera, "Travel Tips": Briefcase,
};

interface BlogCardProps {
  blog: Blog & { slug: string };
  size?: "normal" | "large" | "medium" | "small";
}

// --- Blog Card component ---
const BlogCard: React.FC<BlogCardProps> = ({ blog, size = "normal" }) => (
  <article className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 group cursor-pointer h-full flex flex-col">
    <div className="relative overflow-hidden">
      <img
        src={blog.coverImage}
        alt={blog.title}
        className={`w-full object-cover transition-transform duration-500 group-hover:scale-110 ${
          size === "large"
            ? "h-64 sm:h-80"
            : size === "medium"
            ? "h-48 sm:h-56"
            : "h-40 sm:h-48"
        }`}
      />
      <div className="absolute top-3 left-3">
        <span className="px-3 py-1 bg-blue-600 text-white text-xs font-semibold rounded-full">
          {blog.category?.name || "Uncategorized"}
        </span>
      </div>
    </div>
    <div className="p-4 sm:p-5 flex flex-col flex-grow">
      <h4
        className={`font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-300 leading-tight ${
          size === "large"
            ? "text-xl sm:text-2xl"
            : size === "medium"
            ? "text-lg sm:text-xl"
            : "text-base sm:text-lg"
        }`}
      >
        {blog.title}
      </h4>
      <p className="text-gray-600 mb-3 line-clamp-2 text-sm sm:text-base flex-grow">
        {stripHtml(blog.content?.slice(0, 90) + "...")}
      </p>
      <div className="flex items-center justify-between text-xs sm:text-sm text-gray-500 mt-auto pt-3 border-t border-gray-100">
        <div className="flex items-center">
          <User className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
          <span className="truncate">Unknown</span>
        </div>
        <div className="flex items-center">
          <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
          <span>{blog.createdAt?.slice(0, 10)}</span>
        </div>
      </div>
    </div>
  </article>
);

// --- Main Blog component ---
export const Blog: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const queryParams: TQueryParam[] = [
    { name: "page", value: currentPage.toString() },
    { name: "limit", value: "100" },
    { name: "status", value: "published" },
  ];

  const { data: blogsData, isLoading, error } = useGetAllBlogsQuery(queryParams);

  // Add slug to each blog
  const allBlogs = useMemo<(Blog & { slug: string })[]>(() => {
    if (!Array.isArray(blogsData?.data)) return [];
    return blogsData.data.map((blog: Blog) => ({
      ...blog,
      slug: generateSlug(blog.title, blog._id),
    }));
  }, [blogsData?.data]);

  // Categories
  const categories = useMemo(
    () => [
      {
        name: "all",
        count: allBlogs.length,
        icon: BookOpen,
      },
      ...Array.from(new Set(allBlogs.map((b) => b.category?.name).filter(Boolean))).map(
        (cat) => ({
          name: cat as string,
          count: allBlogs.filter((b) => b.category?.name === cat).length,
          icon: categoryIcons[cat as string] || BookOpen,
        })
      ),
    ],
    [allBlogs]
  );

  // Filter blogs based on search/category
  const filteredBlogs = useMemo(() => {
    return allBlogs.filter((blog) => {
      const matchesSearch =
        searchQuery.trim() === "" ||
        blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        stripHtml(blog.content.toLowerCase()).includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === "all" || blog.category?.name === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [allBlogs, searchQuery, selectedCategory]);

  const sliderPosts = filteredBlogs.slice(0, 3).map((blog, idx) => ({
    id: blog._id || idx + 1,
    title: blog.title ?? "",
    excerpt: stripHtml(blog.content?.slice(0, 80) ?? ""),
    category: blog.category?.name ?? "Uncategorized",
    author: "Unknown",
    date: blog.createdAt?.slice(0, 10) ?? "",
    image: blog.coverImage ?? "",
    _id: blog._id,
    slug: blog.slug,
  }));

  const [currentSlide, setCurrentSlide] = useState<number>(0);
  useEffect(() => {
    if (!sliderPosts.length) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliderPosts.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [sliderPosts.length]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % sliderPosts.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + sliderPosts.length) % sliderPosts.length);

  const blogsPerPage = 12;
  const paginatedBlogs = filteredBlogs.slice(0, currentPage * blogsPerPage);
  const hasMore = filteredBlogs.length > paginatedBlogs.length;

  const currentSlidePost = sliderPosts[currentSlide];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-8 lg:pt-16 pb-12">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-block p-2 bg-blue-100 rounded-full mb-4">
            <BookOpen className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
            Discover Amazing
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent block sm:inline sm:ml-3">
              Stories
            </span>
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Explore insights, ideas, and inspiration from industry leaders
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-8 sm:mb-12">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              className="w-full pl-12 pr-4 py-3 sm:py-4 rounded-2xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none bg-white shadow-lg transition-all duration-300 text-sm sm:text-base"
            />
            {searchQuery && (
              <button
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                onClick={() => { setSearchQuery(""); setCurrentPage(1); }}
              ><X className="h-5 w-5" /></button>
            )}
          </div>
        </div>

        {/* Main Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 lg:gap-8">
          {/* Main Content */}
          <div className="xl:col-span-3 space-y-8 sm:space-y-12">
            {/* Slider */}
            {sliderPosts.length > 0 && currentSlidePost && (
              <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10"></div>
                <div className="relative h-80 sm:h-96 lg:h-[450px]">
                  {sliderPosts.map((slide, index) => (
                    <Link key={slide._id} href={`/blogs/${slide.slug}`}>
                      <div className={`absolute inset-0 transition-opacity duration-1000 ${
                        index === currentSlide ? "opacity-100" : "opacity-0"
                      }`}>
                        <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
                      </div>
                    </Link>
                  ))}
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 lg:p-12 z-20">
                  <div className="max-w-3xl">
                    <span className="inline-block px-4 py-2 bg-blue-600 text-white text-xs sm:text-sm font-semibold rounded-full mb-4">
                      {currentSlidePost.category}
                    </span>
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3 sm:mb-4 leading-tight">
                      {currentSlidePost.title}
                    </h2>
                    <p className="text-white/90 text-sm sm:text-base lg:text-lg mb-4 sm:mb-6 leading-relaxed">
                      {currentSlidePost.excerpt}
                    </p>
                    <div className="flex items-center text-white/80 text-xs sm:text-sm space-x-4">
                      <div className="flex items-center">
                        <User className="w-4 h-4 mr-2" />
                        <span>Unknown</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span>{currentSlidePost.date}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <button onClick={prevSlide} className="absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-white/20 backdrop-blur-sm hover:bg-white/40 text-white p-2 sm:p-3 rounded-full transition-all duration-300">
                  <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
                <button onClick={nextSlide} className="absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-white/20 backdrop-blur-sm hover:bg-white/40 text-white p-2 sm:p-3 rounded-full transition-all duration-300">
                  <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex space-x-2">
                  {sliderPosts.map((_, index) => (
                    <button key={index} onClick={() => setCurrentSlide(index)} className={`w-2 h-2 rounded-full transition-all duration-300 ${index === currentSlide ? "bg-white w-8" : "bg-white/50"}`} />
                  ))}
                </div>
              </div>
            )}

            {/* Featured Stories */}
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center">
                <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-blue-600" />
                Featured Stories
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {paginatedBlogs.slice(0, 2).map((post) => (
                  <Link key={post._id} href={`/blogs/${post.slug}`}>
                    <BlogCard blog={post} size="large" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Editor's Picks */}
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Editor's Picks</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {paginatedBlogs.slice(2, 5).map((post) => (
                  <Link key={post._id} href={`/blogs/${post.slug}`}>
                    <BlogCard blog={post} size="medium" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Latest Updates */}
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Latest Updates</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5">
                {paginatedBlogs.slice().sort((a, b) => {
                  const dateA = new Date(a.createdAt || 0);
                  const dateB = new Date(b.createdAt || 0);
                  return dateB.getTime() - dateA.getTime();
                }).slice(0, 4).map((post) => (
                  <Link key={post._id} href={`/blogs/${post.slug}`}>
                    <BlogCard blog={post} size="small" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Mixed Layout */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
              <div className="md:col-span-2">
                {paginatedBlogs[9] && (
                  <Link href={`/blogs/${paginatedBlogs[9].slug}`}>
                    <BlogCard blog={paginatedBlogs[9]} size="large" />
                  </Link>
                )}
              </div>
              <div className="space-y-4 sm:space-y-6">
                {paginatedBlogs.slice(10, 12).map((post) => (
                  <Link key={post._id} href={`/blogs/${post.slug}`}>
                    <BlogCard blog={post} size="small" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Load More */}
            {!isLoading && !error && hasMore && (
              <div className="mt-12 text-center">
                <button className="mb-10 rounded-full bg-purple-600 px-8 py-3 font-semibold text-white shadow-lg transition-colors duration-300 hover:bg-purple-700 hover:shadow-xl" onClick={() => setCurrentPage((prev) => prev + 1)}>
                  Load More Articles
                </button>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="xl:col-span-1 space-y-6">
            <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg xl:sticky xl:top-8">
              <h4 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center">
                <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 text-blue-600" />
                Categories
              </h4>
              <div className="space-y-1 sm:space-y-2">
                {categories.map((category) => {
                  const IconComponent = category.icon;
                  return (
                    <button key={category.name} onClick={() => { setSelectedCategory(category.name); setCurrentPage(1);}} className={`w-full flex items-center justify-between p-2 sm:p-3 rounded-lg transition-all duration-300 text-sm ${selectedCategory === category.name ? "bg-blue-600 text-white shadow-lg" : "hover:bg-gray-50 text-gray-700"}`}>
                      <div className="flex items-center">
                        <IconComponent className="w-3 h-3 sm:w-4 sm:h-4 mr-2 sm:mr-3" />
                        <span className="font-medium"> {category.name?.charAt(0)?.toUpperCase() + category.name?.slice(1) || ""}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-xs opacity-75 mr-1 sm:mr-2">({category.count})</span>
                        <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Loading/Error States */}
        {isLoading && (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 xl:grid-cols-3 mt-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse overflow-hidden rounded-xl bg-white shadow-lg">
                <div className="h-48 bg-gray-300"></div>
                <div className="p-6">
                  <div className="mb-2 h-4 rounded bg-gray-300"></div>
                  <div className="mb-4 h-4 w-3/4 rounded bg-gray-300"></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className="py-12 text-center">
            <p className="mb-4 text-lg text-red-500">Failed to load blogs</p>
            <p className="text-gray-600">Please try again later</p>
          </div>
        )}

        {!isLoading && !error && filteredBlogs.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-lg text-gray-600">
              {searchQuery || selectedCategory !== "all"
                ? "No blogs found matching your filters"
                : "No published blogs available"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};