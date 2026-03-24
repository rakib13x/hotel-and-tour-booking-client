"use client";

import HeadingSection from "@/components/HeadingSection";
import { Button } from "@/components/ui/button";
import { useGetToursWithOffersQuery } from "@/redux/api/features/tour/tourApi";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

interface ExclusiveOffersSectionProps {
  className?: string;
}

// Helper function to calculate discounted price
const calculateDiscountedPrice = (
  basePrice: number,
  offer?: {
    isActive: boolean;
    discountType: "flat" | "percentage";
    flatDiscount?: number;
    discountPercentage?: number;
  }
): number => {
  if (!offer || !offer.isActive) return basePrice;

  if (offer.discountType === "flat" && offer.flatDiscount) {
    return Math.max(0, basePrice - offer.flatDiscount);
  }

  if (offer.discountType === "percentage" && offer.discountPercentage) {
    return Math.max(
      0,
      basePrice - (basePrice * offer.discountPercentage) / 100
    );
  }

  return basePrice;
};

export default function ExclusiveOffersSection({
  className = "",
}: ExclusiveOffersSectionProps) {
  const router = useRouter();

  // Fetch tours with active offers from API
  const { data, isLoading, error } = useGetToursWithOffersQuery({ limit: 20 });
  const offers = data?.data || [];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [slidesToShow, setSlidesToShow] = useState(4);

  // Create infinite carousel by duplicating offers - Memoized
  const infiniteOffers = useMemo(
    () => [...offers, ...offers, ...offers],
    [offers]
  );
  const totalSlides = offers.length;

  // Calculate slide width based on slides to show
  const slideWidth = 100 / slidesToShow;

  // Responsive slides calculation
  useEffect(() => {
    const updateSlidesToShow = () => {
      if (window.innerWidth < 640) {
        setSlidesToShow(1); // Mobile: 1 slide
      } else if (window.innerWidth < 1024) {
        setSlidesToShow(2); // Tablet: 2 slides
      } else if (window.innerWidth < 1280) {
        setSlidesToShow(3); // Small desktop: 3 slides
      } else {
        setSlidesToShow(4); // Large desktop: 4 slides
      }
    };

    updateSlidesToShow();
    window.addEventListener("resize", updateSlidesToShow);
    return () => window.removeEventListener("resize", updateSlidesToShow);
  }, []);

  // Update currentIndex when offers are loaded
  useEffect(() => {
    if (offers.length > 0) {
      setCurrentIndex(offers.length);
    }
  }, [offers.length]);

  // Handle seamless reset when reaching boundaries
  useEffect(() => {
    if (currentIndex >= totalSlides * 2 && totalSlides > 0) {
      // Reset to middle set without animation
      const timer = setTimeout(() => {
        setCurrentIndex(totalSlides);
      }, 800); // Wait for animation to complete
      return () => clearTimeout(timer);
    }
    if (currentIndex < totalSlides && totalSlides > 0) {
      // Reset to end of middle set without animation
      const timer = setTimeout(() => {
        setCurrentIndex(totalSlides * 2 - 1);
      }, 800); // Wait for animation to complete
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [currentIndex, totalSlides]);

  // Auto-rotate offers
  useEffect(() => {
    if (offers.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => prev + 1);
    }, 4000); // Change offer every 4 seconds

    return () => clearInterval(interval);
  }, [offers.length]);

  // Navigation functions
  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => prev + 1);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => prev - 1);
  }, []);

  // If no offers or still loading, show loading/empty state
  if (isLoading) {
    return (
      <section className={`bg-gray-50 py-12 md:py-20 ${className}`}>
        <div className="container mx-auto px-4">
          <HeadingSection
            badgeText="our popular offers"
            badgeIcon="🔥"
            title="Exclusive Offers"
            subtitle="Discover amazing deals and special packages designed just for you"
          />
          <div className="flex h-64 items-center justify-center">
            <div className="text-center">
              <div className="border-primary mx-auto h-12 w-12 animate-spin rounded-full border-b-2"></div>
              <p className="mt-4 text-gray-600">Loading exclusive offers...</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error || offers.length === 0) {
    return (
      <section className={`bg-gray-50 py-12 md:py-20 ${className}`}>
        <div className="container mx-auto px-4">
          <HeadingSection
            badgeText="our popular offers"
            badgeIcon="🔥"
            title="Exclusive Offers"
            subtitle="Discover amazing deals and special packages designed just for you"
          />
          <div className="flex h-64 items-center justify-center">
            <p className="text-gray-600">
              No exclusive offers available at the moment.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={`bg-gray-50 py-12 md:py-20 ${className}`}>
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <HeadingSection
          badgeText="our popular offers"
          badgeIcon="🔥"
          title="Exclusive Offers"
          subtitle="Discover amazing deals and special packages designed just for you"
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
            {offers.map((_, index) => {
              const activeDotIndex = currentIndex % totalSlides;
              return (
                <div
                  key={index}
                  className={`h-3 w-3 rounded-full transition-all ${
                    index === activeDotIndex ? "bg-primary w-8" : "bg-gray-300"
                  }`}
                />
              );
            })}
          </div>

          <Button
            size="lg"
            onClick={nextSlide}
            className="h-12 w-12 rounded-full bg-blue-500 p-0 text-white shadow-lg hover:bg-blue-600"
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </div>

        {/* Desktop Navigation Buttons - Only visible on large screens */}
        <div className="mb-6 hidden items-center justify-end gap-3 sm:flex">
          <Button
            size="lg"
            onClick={prevSlide}
            className="h-12 w-12 rounded-full bg-blue-500 p-0 text-white shadow-2xl transition-transform hover:scale-105 hover:bg-blue-600"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>

          <Button
            size="lg"
            onClick={nextSlide}
            className="h-12 w-12 rounded-full bg-blue-500 p-0 text-white shadow-lg transition-transform hover:scale-105 hover:bg-blue-600"
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </div>

        {/* Offers Carousel */}
        <div className="relative">
          {/* Mobile Offers Container */}
          <div className="overflow-hidden sm:hidden">
            <motion.div
              className="flex transition-transform duration-300 ease-in-out"
              style={{
                transform: `translateX(-${(currentIndex % totalSlides) * 100}%)`,
              }}
            >
              {offers.map((tour, index) => {
                const discountedPrice = calculateDiscountedPrice(
                  tour.basePrice,
                  tour.offer
                );
                const destination =
                  typeof tour.destination === "string"
                    ? null
                    : tour.destination;

                return (
                  <motion.div
                    key={`mobile-tour-${index}-${tour._id}`}
                    className="w-full flex-shrink-0 px-2"
                    whileTap={{ scale: 0.98 }}
                  >
                    <motion.div
                      className="hover-lift shadow-travel-lg group relative cursor-pointer overflow-hidden rounded-xl"
                      whileHover={{ scale: 1.02, y: -5 }}
                      transition={{ duration: 0.3 }}
                    >
                      {/* Background Image */}
                      <div
                        className="relative h-64 bg-gray-300 bg-cover bg-center bg-no-repeat"
                        style={{
                          backgroundImage: tour.coverImageUrl
                            ? `url(${tour.coverImageUrl})`
                            : undefined,
                        }}
                      >
                        {/* Offer Badge */}
                        {tour.offer?.label && (
                          <div className="bg-accent absolute top-4 left-4 z-10 rounded-full px-3 py-1 text-xs font-semibold text-white">
                            {tour.offer.label}
                          </div>
                        )}

                        {/* Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>

                        {/* Content */}
                        <div className="absolute inset-0 flex flex-col justify-end p-4 text-white">
                          {/* Title */}
                          <h3 className="group-hover:text-accent mb-2 text-lg leading-tight font-bold transition-colors duration-300">
                            {tour.title}
                          </h3>

                          {/* Subtitle - Destination & Duration */}
                          <h4 className="text-accent mb-3 text-sm leading-tight font-semibold">
                            {destination?.name || "Amazing Destination"} •{" "}
                            {tour.duration.days}D/{tour.duration.nights}N
                          </h4>

                          {/* Price */}
                          <div className="mb-3 text-sm font-bold">
                            <div className="flex items-center gap-2">
                              {tour.offer?.isActive && (
                                <span className="text-xs text-gray-300 line-through">
                                  ৳{tour.basePrice.toLocaleString()}
                                </span>
                              )}
                              <span className="text-white">
                                ৳{discountedPrice.toLocaleString()}
                              </span>
                            </div>
                          </div>

                          {/* CTA Button */}
                          <Button
                            variant="secondary"
                            size="sm"
                            className="w-full border-white/30 bg-white/20 text-xs text-white backdrop-blur-sm transition-all duration-300 group-hover:scale-105 hover:border-white/50 hover:bg-white/30"
                            onClick={(e) => {
                              e.stopPropagation();
                              router.push(`/booking-details?id=${tour._id}`);
                            }}
                          >
                            Book Now
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>

          {/* Desktop Offers Container */}
          <div className="hidden overflow-hidden sm:block">
            <div className="mx-8 overflow-hidden md:mx-12">
              <motion.div
                className="flex"
                animate={{ x: `-${currentIndex * slideWidth}%` }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
              >
                {infiniteOffers.map((tour, index) => {
                  const discountedPrice = calculateDiscountedPrice(
                    tour.basePrice,
                    tour.offer
                  );
                  const destination =
                    typeof tour.destination === "string"
                      ? null
                      : tour.destination;

                  return (
                    <motion.div
                      key={`tour-${index}-${tour._id}`}
                      className="flex-shrink-0 px-2 md:px-3"
                      style={{ width: `${slideWidth}%` }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                    >
                      <motion.div
                        className="hover-lift shadow-travel-lg group relative cursor-pointer overflow-hidden rounded-xl md:rounded-2xl"
                        whileHover={{ scale: 1.02, y: -5 }}
                        transition={{ duration: 0.3 }}
                      >
                        {/* Background Image */}
                        <div
                          className="relative h-64 bg-gray-300 bg-cover bg-center bg-no-repeat sm:h-72 md:h-80"
                          style={{
                            backgroundImage: tour.coverImageUrl
                              ? `url(${tour.coverImageUrl})`
                              : undefined,
                          }}
                        >
                          {/* Offer Badge */}
                          {tour.offer?.label && (
                            <div className="bg-accent absolute top-4 left-4 z-10 rounded-full px-3 py-1 text-xs font-semibold text-white md:text-sm">
                              {tour.offer.label}
                            </div>
                          )}

                          {/* Overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>

                          {/* Content */}
                          <div className="absolute inset-0 flex flex-col justify-end p-4 text-white md:p-6 lg:p-8">
                            {/* Title */}
                            {/* <h3 className="group-hover:text-accent mb-2 text-lg leading-tight font-bold transition-colors duration-300 sm:text-xl md:text-2xl">
                              {tour.title}
                            </h3> */}

                            {/* Subtitle - Destination & Duration */}
                            <h4 className="text-accent mb-3 text-sm leading-tight font-semibold sm:text-base md:mb-4 md:text-lg">
                              {destination?.name || "Amazing Destination"} •{" "}
                              {tour.duration.days}D/{tour.duration.nights}N
                            </h4>

                            {/* Features - Highlights */}
                            {/* <ul className="mb-4 space-y-1 md:mb-6 md:space-y-2">
                              {tour.highlights
                                .slice(0, 3)
                                .map((highlight, idx) => (
                                  <li
                                    key={idx}
                                    className="flex items-center text-xs leading-tight opacity-90 sm:text-sm"
                                  >
                                    <div className="bg-accent mr-2 h-1.5 w-1.5 flex-shrink-0 rounded-full md:mr-3 md:h-2 md:w-2"></div>
                                    <span className="line-clamp-1 break-words">
                                      {highlight}
                                    </span>
                                  </li>
                                ))}
                            </ul> */}

                            {/* Price */}
                            <div className="mb-3 text-sm font-bold sm:text-base md:mb-4 md:text-lg">
                              <div className="flex items-center gap-2">
                                {tour.offer?.isActive && (
                                  <span className="text-xs text-gray-300 line-through sm:text-sm">
                                    ৳{tour.basePrice.toLocaleString()}
                                  </span>
                                )}
                                <span className="text-white">
                                  ৳{discountedPrice.toLocaleString()}
                                </span>
                              </div>
                              {tour.offer?.isActive && (
                                <span className="text-accent text-xs">
                                  Save{" "}
                                  {tour.offer.discountType === "percentage"
                                    ? `${tour.offer.discountPercentage}%`
                                    : `৳${tour.offer.flatDiscount?.toLocaleString()}`}
                                </span>
                              )}
                            </div>

                            {/* CTA Button */}
                            <Button
                              variant="secondary"
                              size="sm"
                              className="w-full border-white/30 bg-white/20 text-xs text-white backdrop-blur-sm transition-all duration-300 group-hover:scale-105 hover:border-white/50 hover:bg-white/30 sm:text-sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                router.push(`/booking-details?id=${tour._id}`);
                              }}
                            >
                              Book Now
                            </Button>
                          </div>

                          {/* Hover Effect Overlay */}
                          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>

                          {/* Animated Elements */}
                          <div className="pointer-events-none absolute inset-0 opacity-20">
                            <div className="absolute top-2 right-2 h-12 w-12 animate-pulse rounded-full border-2 border-white md:top-4 md:right-4 md:h-20 md:w-20"></div>
                            <div className="absolute bottom-2 left-2 h-10 w-10 animate-pulse rounded-full border-2 border-white delay-1000 md:bottom-4 md:left-4 md:h-16 md:w-16"></div>
                          </div>
                        </div>
                      </motion.div>
                    </motion.div>
                  );
                })}
              </motion.div>
            </div>
          </div>
        </div>

        {/* View All Button */}
        <div className="mt-8 text-center md:mt-12">
          <Button
            variant="outline"
            size="lg"
            className="border-primary text-primary hover:bg-primary hover-lift px-4 text-sm transition-all duration-300 hover:text-white md:px-6 md:text-base"
          >
            View All Offers
            <ChevronRight className="ml-2 h-4 w-4 md:h-5 md:w-5" />
          </Button>
        </div>
      </div>
    </section>
  );
}
