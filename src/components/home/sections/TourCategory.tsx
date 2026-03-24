"use client";

import HeadingSection from "@/components/HeadingSection";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useGetActiveTourCategoriesQuery } from "@/redux/api/features/tourCategory/tourCategoryApi";
import { motion } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface PackageCardsSectionProps {
  className?: string;
}

export default function TourCategory({
  className = "",
}: PackageCardsSectionProps) {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [desktopSlide, setDesktopSlide] = useState(0);

  // Fetch tour categories from API
  const {
    data: tourCategoriesData,
    isLoading,
    error,
  } = useGetActiveTourCategoriesQuery();

  const tourCategories = tourCategoriesData?.data || [];

  const handleCategoryClick = (categoryId: string) => {
    router.push(`/package-details?category=${categoryId}`);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % tourCategories.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + tourCategories.length) % tourCategories.length
    );
  };

  // Desktop navigation functions
  const nextDesktopSlide = () => {
    const maxSlide = Math.max(0, tourCategories.length - 4);
    setDesktopSlide((prev) => Math.min(prev + 1, maxSlide));
  };

  const prevDesktopSlide = () => {
    setDesktopSlide((prev) => Math.max(prev - 1, 0));
  };

  // Check if desktop navigation should be shown
  const showDesktopNavigation = tourCategories.length > 4;
  const maxSlide = Math.max(0, tourCategories.length - 4);
  const canGoNext = desktopSlide < maxSlide;
  const canGoPrev = desktopSlide > 0;

  // Reset desktop slide when categories change
  useEffect(() => {
    setDesktopSlide(0);
  }, [tourCategories.length]);

  // Loading state
  if (isLoading) {
    return (
      <section
        className={`bg-gradient-to-br from-slate-50 to-blue-50 py-12 sm:py-16 lg:py-20 ${className}`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <HeadingSection
            badgeText=""
            badgeIcon=""
            title="Package Categories"
            subtitle="Choose your preferred travel style and explore amazing packages tailored to your preferences."
          />
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8 xl:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-80 animate-pulse rounded-lg bg-gray-200 sm:h-96"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section
        className={`bg-gradient-to-br from-slate-50 to-blue-50 py-12 sm:py-16 lg:py-20 ${className}`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <HeadingSection
            badgeText=""
            badgeIcon=""
            title="Package Categories"
            subtitle="Choose your preferred travel style and explore amazing packages tailored to your preferences."
          />
          <div className="py-8 text-center">
            <p className="text-gray-600">
              Failed to load tour categories. Please try again later.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      className={`bg-gradient-to-br from-slate-50 to-blue-50 py-12 sm:py-16 lg:py-20 ${className}`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <HeadingSection
          badgeText=""
          badgeIcon=""
          title="Tour Categories"
          subtitle="Choose your preferred tour category and explore amazing destinations tailored to your travel style."
        />

        {/* Mobile Navigation Buttons - Only visible on small screens */}
        <div className="mb-6 flex items-center justify-between sm:hidden">
          <Button
            variant="outline"
            size="sm"
            onClick={prevSlide}
            className="h-10 w-10 rounded-full p-0"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <div className="flex space-x-2">
            {tourCategories.map((_, index) => (
              <div
                key={index}
                className={`h-2 w-2 rounded-full transition-all ${
                  index === currentSlide ? "bg-primary w-6" : "bg-gray-300"
                }`}
              />
            ))}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={nextSlide}
            className="h-10 w-10 rounded-full p-0"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Desktop Navigation Buttons - Only visible when there are more than 4 categories */}
        {showDesktopNavigation && (
          <div className="mb-6 hidden items-center justify-end gap-2 sm:flex">
            <Button
              variant="outline"
              size="sm"
              onClick={prevDesktopSlide}
              disabled={!canGoPrev}
              className="h-8 w-8 rounded-full p-0 disabled:opacity-50"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={nextDesktopSlide}
              disabled={!canGoNext}
              className="h-8 w-8 rounded-full p-0 disabled:opacity-50"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Category Cards Grid */}
        <motion.div
          className="relative overflow-hidden sm:overflow-visible"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {/* Mobile Slider */}
          <div className="sm:hidden">
            <motion.div
              className="flex transition-transform duration-300 ease-in-out"
              style={{
                transform: `translateX(-${currentSlide * 100}%)`,
              }}
            >
              {tourCategories.map((category) => (
                <motion.div
                  key={category._id}
                  className="w-full flex-shrink-0 px-2"
                  onClick={() => handleCategoryClick(category._id)}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card className="shadow-travel-lg relative h-80 cursor-pointer overflow-hidden border-0">
                    {/* Background Image */}
                    <div
                      className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                      style={{
                        backgroundImage: `url(${category.img || "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=600&fit=crop"})`,
                      }}
                    >
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20"></div>
                    </div>

                    {/* Content Overlay */}
                    <CardContent className="absolute inset-0 z-10 flex flex-col justify-end p-4">
                      <div className="mb-4">
                        <h3 className="mb-2 bg-gradient-to-r from-yellow-400 to-purple-600 bg-clip-text text-xl leading-tight font-bold text-transparent">
                          {category.category_name}
                        </h3>
                        <p className="line-clamp-2 text-sm leading-relaxed text-white/90">
                          {category.description ||
                            "Explore amazing destinations and create unforgettable memories"}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Desktop Grid - Hidden on small screens */}
          <div className="hidden grid-cols-2 gap-6 sm:grid lg:grid-cols-3 lg:gap-8 xl:grid-cols-4">
            {tourCategories
              .slice(desktopSlide, desktopSlide + 4)
              .map((category, index) => (
                <motion.div
                  key={category._id}
                  className="group cursor-pointer"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.6,
                    delay: 0.1 * (desktopSlide + index),
                  }}
                  onClick={() => handleCategoryClick(category._id)}
                  whileHover={{ y: -10 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card className="hover-lift shadow-travel-lg relative h-80 overflow-hidden border-0 transition-all duration-500 group-hover:shadow-2xl sm:h-96">
                    {/* Background Image */}
                    <div
                      className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-700 group-hover:scale-110"
                      style={{
                        backgroundImage: `url(${category.img || "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=600&fit=crop"})`,
                      }}
                    >
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20 transition-all duration-500 group-hover:from-black/70 group-hover:via-black/30 group-hover:to-black/10"></div>
                    </div>

                    {/* Content Overlay */}
                    <CardContent className="absolute inset-0 z-10 flex flex-col justify-end p-4 sm:p-6">
                      <div className="mb-4">
                        <h3 className="mb-2 bg-gradient-to-r from-yellow-400 to-purple-600 bg-clip-text text-lg leading-tight font-bold text-transparent sm:text-2xl lg:text-3xl">
                          {category.category_name}
                        </h3>
                        <p className="line-clamp-2 text-sm leading-relaxed text-white/90 sm:text-base">
                          {category.description ||
                            "Explore amazing destinations and create unforgettable memories"}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
          </div>
        </motion.div>

        {/* View All Button */}
        <motion.div
          className="mt-8 text-center sm:mt-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Button
            variant="outline"
            size="lg"
            className="border-primary text-primary hover:bg-primary border-2 px-6 py-3 text-sm transition-all duration-300 hover:scale-105 hover:text-white sm:px-8 sm:py-4 sm:text-base"
            onClick={() => router.push("/package-details")}
          >
            <span className="hidden sm:inline">View All Countries</span>
            <span className="sm:hidden">View All</span>
            <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
