"use client";

import {
  BookingSidebar,
  BookingTabs,
  PackageBanner,
  TabContent,
} from "@/components/booking";
import { mockPackages, TravelPackage } from "@/lib/packageData";
import { useGetAllCompanyInfoQuery } from "@/redux/api/features/companyInfo/companyInfoApi";
import { useGetTourByIdQuery } from "@/redux/api/features/tour/tourApi";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

function BookingDetailsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [packageData, setPackageData] = useState<TravelPackage | null>(null);
  const [activeTab, setActiveTab] = useState("itinerary");
  const tourId = searchParams?.get("id");

  // Fetch tour data from API
  const {
    data: tourData,
    isLoading,
    error,
  } = useGetTourByIdQuery(tourId || "", {
    skip: !tourId,
  });

  console.log("Tour Data:", tourData);

  // Fetch company info for contact details
  const { data: companyInfoData } = useGetAllCompanyInfoQuery();

  useEffect(() => {
    if (tourData?.data) {
      // Convert tour data to package format for existing components
      const tour = tourData.data;
      const destination =
        typeof tour.destination === "string" ? null : tour.destination;

      // Get company contact info
      const companyInfo = Array.isArray(companyInfoData?.data)
        ? companyInfoData?.data[0]
        : companyInfoData?.data;
      const contactPhone = companyInfo?.phone?.[0] || "+880 1234-567890";

      const convertedPackage = {
        id: tour._id || "",
        title: tour.title,
        bookingFee: (tour.basePrice * tour.bookingFeePercentage) / 100,
        destination: destination?.name || "Unknown",
        country: destination?.name || "Unknown",
        duration: tour.duration.days,
        nights: tour.duration.nights,
        price: tour.offer?.isActive
          ? tour.offer.discountType === "flat"
            ? tour.basePrice - (tour.offer.flatDiscount || 0)
            : tour.basePrice -
              (tour.basePrice * (tour.offer.discountPercentage || 0)) / 100
          : tour.basePrice,
        ...(tour.offer?.isActive && { originalPrice: tour.basePrice }),
        bookingFeePercentage: tour.bookingFeePercentage || 20,
        image:
          tour.coverImageUrl ||
          "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800",
        galleryImages: tour.galleryUrls || [],
        categoryName:
          typeof tour.category === "string"
            ? undefined
            : tour.category?.category_name,
        highlights: tour.highlights,
        attractions: tour.tags || [],
        category: "regular",
        isRecommended: false,
        rating: 4.5,
        reviewCount: 0,
        description: tour.highlights.join(". ") || "",
        itinerary: tour.itinerary.map((day) => ({
          day: day.dayNo,
          title: day.title,
          location: destination?.name || "",
          activities: day.blocks
            .map((block) => block.title || block.subtitle || "Activity")
            .filter(Boolean),
          accommodation:
            day.blocks.find((block) => block.type === "HOTEL")?.hotelName || "",
          meals: day.blocks
            .filter((block) => block.type === "MEAL")
            .flatMap((block) => {
              const meals = [];
              if (block.meals?.breakfast) meals.push("Breakfast");
              if (block.meals?.lunch) meals.push("Lunch");
              if (block.meals?.dinner) meals.push("Dinner");
              return meals;
            }),
          transportation:
            day.blocks
              .filter((block) => block.type === "TRANSFER")
              .map((block) => block.subtitle || "Transportation included")
              .join(", ") || "As per itinerary",
          timeFrom: day.blocks.find((block) => block.timeFrom)?.timeFrom,
          timeTo: day.blocks.find((block) => block.timeTo)?.timeTo,
          description: day.blocks
            .filter((block) => block.description)
            .map((block) => block.description)
            .join(" "),
        })),
        inclusions: tour.inclusion,
        exclusions: tour.exclusion,
        terms: tour.terms ? [tour.terms] : [],
        otherDetails: {
          transportation: tour.itinerary
            .flatMap((day) =>
              day.blocks
                .filter((block) => block.type === "TRANSFER")
                .map(
                  (block) => block.subtitle || block.title || "Transportation"
                )
            )
            .filter(Boolean),
          specialNotes: tour.otherDetails ? [tour.otherDetails] : [],
          contactInfo: contactPhone,
          emergencyContact: contactPhone,
        },
        visaRequirements: {
          required: !!tour.visaRequirements,
          documents: [],
          processingTime: "5-7 business days",
          applicationProcedure: tour.visaRequirements || "No visa required",
        },
        packageCode: tour.code,
        validFrom: new Date().toISOString().split("T")[0],
        validTo: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
      } as TravelPackage;
      setPackageData(convertedPackage);
    } else if (!isLoading && !tourId) {
      // Fallback to mock data if no tour ID
      const packageId = searchParams?.get("id");
      if (packageId) {
        const pkg = mockPackages.find((p) => p.id === packageId);
        if (pkg) {
          setPackageData(pkg);
        }
      }
    }
  }, [tourData, isLoading, tourId, searchParams, companyInfoData]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-blue-500"></div>
          <p className="text-gray-600">Loading package details...</p>
        </div>
      </div>
    );
  }

  if (error || (!packageData && !isLoading)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center">
          <p className="mb-4 text-gray-600">Package not found</p>
          <button
            onClick={() => router.push("/package-details")}
            className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          >
            Back to Packages
          </button>
        </div>
      </div>
    );
  }

  if (!packageData) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-blue-500"></div>
          <p className="text-gray-600">Loading package details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-3 py-4 sm:px-4 sm:py-6 md:py-8">
        <div className="mb-4 sm:mb-6 md:mb-8">
          <PackageBanner packageData={packageData} />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:gap-6 md:gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <BookingTabs activeTab={activeTab} onTabChange={setActiveTab}>
              <TabContent activeTab={activeTab} packageData={packageData} />
            </BookingTabs>
          </div>

          <div className="lg:col-span-1">
            <BookingSidebar packageData={packageData} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BookingDetailsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BookingDetailsContent />
    </Suspense>
  );
}
