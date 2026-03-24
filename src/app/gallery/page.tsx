"use client";

import GalleryCard, {
  GalleryItem,
} from "@/components/home/sections/GalleryCard";
import {
  useGetActiveGalleryCategoriesQuery,
  useGetAllGallerySubCategoriesQuery,
  useGetGalleryImagesBySubCategoryQuery,
  useGetGallerySubCategoriesByCategoryQuery,
} from "@/redux/api/features/gallery/publicGalleryApi";
import "@/styles/gallery.css";
import { ICategory, IImage, ISubCategory } from "@/types/schemas";
import {
  ArrowLeft,
  FolderOpen,
  Grid3X3,
  Image as ImageIcon,
  Loader2,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

type ViewState = "categories" | "subcategories" | "images";

export default function GalleryPage() {
  const [currentView, setCurrentView] = useState<ViewState>("categories");
  const [selectedCategory, setSelectedCategory] = useState<ICategory | null>(
    null
  );
  const [selectedSubCategory, setSelectedSubCategory] =
    useState<ISubCategory | null>(null);

  // Lightbox state
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // API hooks
  const { data: categoriesData, isLoading: categoriesLoading } =
    useGetActiveGalleryCategoriesQuery();
  const { data: allSubCategoriesData } = useGetAllGallerySubCategoriesQuery({}); // Get all subcategories for counting
  const { data: subCategoriesData, isLoading: subCategoriesLoading } =
    useGetGallerySubCategoriesByCategoryQuery(selectedCategory?._id || "", {
      skip: !selectedCategory?._id, // Skip if no category selected
    });
  const { data: imagesData, isLoading: imagesLoading } =
    useGetGalleryImagesBySubCategoryQuery(selectedSubCategory?._id || "", {
      skip: !selectedSubCategory?._id, // Skip if no subcategory selected
    });

  // Extract data from API responses
  const categories = Array.isArray(categoriesData?.data)
    ? categoriesData.data
    : [];
  const allSubCategories = Array.isArray(allSubCategoriesData?.data)
    ? allSubCategoriesData.data
    : [];
  const subCategories = Array.isArray(subCategoriesData?.data)
    ? subCategoriesData.data
    : [];
  const currentImages = Array.isArray(imagesData?.data) ? imagesData.data : [];

  // Handle category click
  const handleCategoryClick = (category: ICategory) => {
    setSelectedCategory(category);
    setCurrentView("subcategories");
  };

  // Handle subcategory click
  const handleSubCategoryClick = (subCategory: ISubCategory) => {
    setSelectedSubCategory(subCategory);
    setCurrentView("images");
  };

  // Handle back navigation
  const handleBack = () => {
    if (currentView === "images") {
      setCurrentView("subcategories");
      setSelectedSubCategory(null);
    } else if (currentView === "subcategories") {
      setCurrentView("categories");
      setSelectedCategory(null);
    }
  };

  // Handle image click to open lightbox
  const handleImageClick = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  // Convert categories to gallery items
  const categoryItems: GalleryItem[] = categories.map((category: ICategory) => {
    // Count subcategories for this category using allSubCategories
    const subCategoryCount = allSubCategories.filter(
      (sub: ISubCategory) => sub.categoryId === category._id
    ).length;

    return {
      id: parseInt(category._id?.slice(-6) || "0", 16) || Math.random(),
      count: subCategoryCount,
      image:
        category.image ||
        "https://tailwindflex.com/public/images/thumbnails/coming-soon-page/thumb_u.min.webp",
      title: category.name,
      description: `${subCategoryCount} ${subCategoryCount === 1 ? "subcategory" : "subcategories"} available`,
      link: "#",
    };
  });

  // Convert subcategories to gallery items
  const subCategoryItems: GalleryItem[] = subCategories.map(
    (subCategory: ISubCategory) => {
      // For now, we'll show 0 count since we need to make individual API calls
      // In a real app, you might want to get image counts from the backend
      const imageCount = 0; // This will be updated when we click on the subcategory
      return {
        id: parseInt(subCategory._id?.slice(-6) || "0", 16) || Math.random(),
        count: imageCount,
        image:
          subCategory.image ||
          "https://tailwindflex.com/public/images/thumbnails/coming-soon-page/thumb_u.min.webp",
        title: subCategory.name,
        description: "Click to view images",
        link: "#",
      };
    }
  );

  // Convert images to gallery items
  const imageItems: GalleryItem[] = currentImages.map((image: IImage) => ({
    id: parseInt(image._id?.slice(-6) || "0", 16) || Math.random(),
    count: 1,
    image: image.url,
    title: "Gallery Image",
    description: "Click to view full size",
    link: "#",
  }));

  // Get current items based on view
  const getCurrentItems = (): GalleryItem[] => {
    switch (currentView) {
      case "categories":
        return categoryItems;
      case "subcategories":
        return subCategoryItems;
      case "images":
        return imageItems;
      default:
        return [];
    }
  };

  // Get current title
  const getCurrentTitle = (): string => {
    switch (currentView) {
      case "categories":
        return "Gallery Categories";
      case "subcategories":
        return selectedCategory
          ? `${selectedCategory.name} - Subcategories`
          : "Subcategories";
      case "images":
        return selectedSubCategory
          ? `${selectedSubCategory.name} - Images`
          : "Images";
      default:
        return "Gallery";
    }
  };

  if (categoriesLoading) {
    return (
      <div className="my-8 flex h-full w-full items-center justify-center p-2 sm:my-12 dark:bg-gray-800">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
            Loading Gallery
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Please wait while we load the gallery categories...
          </p>
        </div>
      </div>
    );
  }

  const currentItems = getCurrentItems();

  // Determine grid class based on number of items
  const getGridClass = () => {
    const itemCount = currentItems.length;
    // Use center alignment for 3 or fewer items
    return itemCount <= 3 ? "gallery-grid-center" : "gallery-grid";
  };

  return (
    <div className="my-4 flex h-full w-full items-center justify-center dark:bg-gray-800">
      <div className="w-full max-w-6xl">
        {/* Header with navigation */}
        <div className="mb-4 space-y-2">
          {/* Breadcrumb Navigation */}
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <span className="flex items-center gap-2">
              <FolderOpen className="h-4 w-4" />
              Gallery
            </span>
            {currentView === "subcategories" && selectedCategory && (
              <>
                <span>/</span>
                <span className="text-blue-600 dark:text-blue-400">
                  {selectedCategory.name}
                </span>
              </>
            )}
            {currentView === "images" &&
              selectedCategory &&
              selectedSubCategory && (
                <>
                  <span>/</span>
                  <button
                    onClick={() => {
                      setCurrentView("subcategories");
                      setSelectedSubCategory(null);
                    }}
                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    {selectedCategory.name}
                  </button>
                  <span>/</span>
                  <span className="text-blue-600 dark:text-blue-400">
                    {selectedSubCategory.name}
                  </span>
                </>
              )}
          </div>

          {/* Main Header */}
          <div className="flex items-center gap-4">
            {currentView !== "categories" && (
              <button
                onClick={handleBack}
                className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 shadow-md transition-colors hover:bg-gray-50 dark:bg-gray-700 dark:hover:bg-gray-600"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </button>
            )}
            <div className="flex items-center gap-3">
              {currentView === "categories" && (
                <FolderOpen className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              )}
              {currentView === "subcategories" && (
                <Grid3X3 className="h-6 w-6 text-green-600 dark:text-green-400" />
              )}
              {currentView === "images" && (
                <ImageIcon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              )}
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {getCurrentTitle()}
              </h1>
            </div>
          </div>
        </div>

        {/* Loading state for subcategories and images */}
        {(currentView === "subcategories" && subCategoriesLoading) ||
        (currentView === "images" && imagesLoading) ? (
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700">
                <Loader2 className="h-6 w-6 animate-spin text-gray-600 dark:text-gray-400" />
              </div>
              <p className="text-gray-500 dark:text-gray-400">
                {currentView === "subcategories"
                  ? "Loading subcategories..."
                  : "Loading images..."}
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Categories Grid */}
            {currentView === "categories" && currentItems.length > 0 && (
              <div className={`${getGridClass()} p-4`}>
                {currentItems.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      const category = categories.find(
                        (cat: ICategory) => cat.name === item.title
                      );
                      if (category) {
                        handleCategoryClick(category);
                      }
                    }}
                    className="cursor-pointer transition-transform hover:scale-105"
                  >
                    <GalleryCard {...item} />
                  </div>
                ))}
              </div>
            )}

            {/* Subcategories Grid */}
            {currentView === "subcategories" && currentItems.length > 0 && (
              <div className={`${getGridClass()} p-4`}>
                {currentItems.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      const subCategory = subCategories.find(
                        (sub: ISubCategory) => sub.name === item.title
                      );
                      if (subCategory) handleSubCategoryClick(subCategory);
                    }}
                    className="cursor-pointer transition-transform hover:scale-105"
                  >
                    <GalleryCard {...item} />
                  </div>
                ))}
              </div>
            )}

            {/* Images Gallery Grid */}
            {currentView === "images" && currentImages.length > 0 && (
              <div className="grid grid-cols-2 gap-4 p-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5">
                {currentImages.map((image: IImage, index: number) => (
                  <div
                    key={image._id}
                    onClick={() => handleImageClick(index)}
                    className="aspect-[3/4] cursor-pointer overflow-hidden rounded-lg bg-gray-100 shadow-md transition-all hover:shadow-xl"
                  >
                    <Image
                      src={image.url}
                      alt={
                        (image as any).altText || `Gallery image ${index + 1}`
                      }
                      width={400}
                      height={500}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Empty state when no items */}
            {((currentView === "categories" && currentItems.length === 0) ||
              (currentView === "subcategories" && currentItems.length === 0) ||
              (currentView === "images" && currentImages.length === 0)) && (
              <div className="py-16 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700">
                  {currentView === "categories" && (
                    <FolderOpen className="h-8 w-8 text-gray-400" />
                  )}
                  {currentView === "subcategories" && (
                    <Grid3X3 className="h-8 w-8 text-gray-400" />
                  )}
                  {currentView === "images" && (
                    <ImageIcon className="h-8 w-8 text-gray-400" />
                  )}
                </div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                  {currentView === "categories"
                    ? "No Categories Available"
                    : currentView === "subcategories"
                      ? "No Subcategories Found"
                      : "No Images Found"}
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  {currentView === "categories"
                    ? "Gallery categories will appear here once they are added by administrators."
                    : currentView === "subcategories"
                      ? `No subcategories are available under "${selectedCategory?.name}".`
                      : `No images are available in "${selectedSubCategory?.name}".`}
                </p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Lightbox for full image view */}
      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        index={lightboxIndex}
        slides={currentImages.map((image: IImage) => ({
          src: image.url,
          alt: (image as any).altText || "Gallery image",
        }))}
      />
    </div>
  );
}
