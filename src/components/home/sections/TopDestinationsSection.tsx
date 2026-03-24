"use client";

import HeadingSection from "@/components/HeadingSection";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useGetPopularCountriesQuery } from "@/redux/api/features/country/countryApi";
import { motion } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

interface TopDestinationsSectionProps {
  className?: string;
}

export default function TopDestinationsSection({
  className = "",
}: TopDestinationsSectionProps) {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [desktopSlide, setDesktopSlide] = useState(0);

  // Fetch popular/top countries from API
  const {
    data: countriesData,
    isLoading,
    error,
  } = useGetPopularCountriesQuery({ limit: 20 });

  const countries = countriesData?.data || [];

  const handleCountryClick = useCallback(
    (countryId: string) => {
      router.push(`/package-details?country=${countryId}`);
    },
    [router]
  );

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % countries.length);
  }, [countries.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + countries.length) % countries.length);
  }, [countries.length]);

  // Desktop navigation functions
  const nextDesktopSlide = useCallback(() => {
    const maxSlide = Math.max(0, countries.length - 4);
    setDesktopSlide((prev) => Math.min(prev + 1, maxSlide));
  }, [countries.length]);

  const prevDesktopSlide = useCallback(() => {
    setDesktopSlide((prev) => Math.max(prev - 1, 0));
  }, []);

  // Check if desktop navigation should be shown
  const showDesktopNavigation = countries.length > 4;
  const maxSlide = Math.max(0, countries.length - 4);
  const canGoNext = desktopSlide < maxSlide;
  const canGoPrev = desktopSlide > 0;

  // Reset desktop slide when countries change
  useEffect(() => {
    setDesktopSlide(0);
  }, [countries.length]);

  // Loading state
  if (isLoading) {
    return (
      <section
        className={`bg-gradient-to-br from-slate-50 to-blue-50 py-12 sm:py-16 lg:py-20 ${className}`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <HeadingSection
            badgeText="explore"
            badgeIcon="✈️"
            title="Top Destinations"
            subtitle="Discover the world's most amazing destinations and start planning your next adventure."
          />
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8 xl:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-64 animate-pulse rounded-lg bg-gray-200 sm:h-72"
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
            badgeText="explore"
            badgeIcon="✈️"
            title="Top Destinations"
            subtitle="Discover the world's most amazing destinations and start planning your next adventure."
          />
          <div className="py-8 text-center">
            <p className="text-gray-600">
              Failed to load destinations. Please try again later.
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
          badgeText="explore"
          badgeIcon="✈️"
          title="Top Destinations"
          subtitle="Discover the world's most amazing destinations and start planning your next adventure."
        />

        {/* Mobile Navigation Buttons - Only visible on small screens */}
        <div className="mb-6 flex items-center justify-between sm:hidden">
          <Button
            size="lg"
            onClick={prevSlide}
            className="h-12 w-12 rounded-full bg-blue-500 p-0 text-white shadow-lg hover:bg-blue-600"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>

          <div className="flex space-x-2">
            {countries.map((_, index) => (
              <div
                key={index}
                className={`h-3 w-3 rounded-full transition-all ${
                  index === currentSlide ? "bg-primary w-8" : "bg-gray-300"
                }`}
              />
            ))}
          </div>

          <Button
            size="lg"
            onClick={nextSlide}
            className="h-12 w-12 rounded-full bg-blue-500 p-0 text-white shadow-lg hover:bg-blue-600"
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </div>

        {/* Desktop Navigation Buttons - Only visible when there are more than 4 countries */}
        {showDesktopNavigation && (
          <div className="mb-6 hidden items-center justify-end gap-3 sm:flex">
            <Button
              size="lg"
              onClick={prevDesktopSlide}
              disabled={!canGoPrev}
              className="h-12 w-12 rounded-full bg-blue-500 p-0 text-white shadow-2xl transition-transform hover:scale-105 hover:bg-blue-600 disabled:opacity-50"
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>

            <Button
              size="lg"
              onClick={nextDesktopSlide}
              disabled={!canGoNext}
              className="h-12 w-12 rounded-full bg-blue-500 p-0 text-white shadow-lg transition-transform hover:scale-105 hover:bg-blue-600 disabled:opacity-50"
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          </div>
        )}

        {/* Country Cards Grid */}
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
              {countries.map((country) => (
                <motion.div
                  key={country._id}
                  className="w-full flex-shrink-0 px-2"
                  onClick={() => handleCountryClick(country._id || "")}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card className="shadow-travel-lg relative h-64 cursor-pointer overflow-hidden border-0">
                    {/* Background Image */}
                    <div
                      className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                      style={{
                        backgroundImage: `url(${
                          country.imageUrl ||
                          "https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                        })`,
                      }}
                    >
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20"></div>
                    </div>

                    {/* Content Overlay */}
                    <CardContent className="absolute inset-0 z-10 flex flex-col justify-end p-4">
                      <div className="mb-4">
                        <h3 className="mb-2 bg-gradient-to-r from-yellow-400 to-purple-600 bg-clip-text text-xl leading-tight font-bold text-transparent">
                          {country.name}
                        </h3>

                        {/* Capital & Continent Info */}
                        <div className="space-y-1">
                          {(country as any).capital && (
                            <div className="flex items-center gap-2 text-sm text-white/90">
                              <MapPin className="h-3 w-3" />
                              <span>{(country as any).capital}</span>
                            </div>
                          )}
                          {(country as any).continent && (
                            <div className="inline-flex items-center rounded-full bg-white/20 px-2 py-1 text-xs font-medium text-white backdrop-blur-sm">
                              {(country as any).continent}
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Desktop Grid - Hidden on small screens */}
          <div className="hidden gap-6 sm:grid sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
            {countries
              .slice(desktopSlide, desktopSlide + 4)
              .map((country, index) => (
                <motion.div
                  key={country._id}
                  className="group cursor-pointer"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.6,
                    delay: 0.1 * (desktopSlide + index),
                  }}
                  onClick={() => handleCountryClick(country._id || "")}
                  whileHover={{ y: -10 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card className="hover-lift shadow-travel-lg relative h-64 overflow-hidden border-0 transition-all duration-500 group-hover:shadow-2xl sm:h-72">
                    {/* Background Image */}
                    <div
                      className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-700 group-hover:scale-110"
                      style={{
                        backgroundImage: `url(${
                          country.imageUrl ||
                          "https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                        })`,
                      }}
                    >
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20 transition-all duration-500 group-hover:from-black/70 group-hover:via-black/30 group-hover:to-black/10"></div>
                    </div>

                    {/* Content Overlay */}
                    <CardContent className="absolute inset-0 z-10 flex flex-col justify-end p-4 sm:p-6">
                      <div className="mb-4">
                        <h3 className="mb-2 bg-gradient-to-r from-yellow-400 to-purple-600 bg-clip-text text-lg leading-tight font-bold text-transparent sm:text-2xl lg:text-3xl">
                          {country.name}
                        </h3>

                        {/* Capital & Continent Info */}
                        <div className="space-y-2">
                          {(country as any).capital && (
                            <div className="flex items-center gap-2 text-sm text-white/90">
                              <MapPin className="h-4 w-4" />
                              <span>{(country as any).capital}</span>
                            </div>
                          )}
                          {(country as any).continent && (
                            <div className="inline-flex items-center rounded-full bg-white/20 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm sm:text-sm">
                              {(country as any).continent}
                            </div>
                          )}
                        </div>
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
