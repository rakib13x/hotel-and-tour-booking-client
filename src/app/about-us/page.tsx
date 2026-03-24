"use client";
/* eslint-disable react/no-unescaped-entities */
import PartnerSection from "@/components/about-us/PartnerSection";
import { useCompanyInfo } from "@/hooks/useCompanyInfo";
import { useGetCountriesWithToursQuery } from "@/redux/api/features/country/countryApi";
import { useGetGalleryPublicImagesQuery } from "@/redux/api/features/gallery/publicGalleryApi";
import { useGetReviewsQuery } from "@/redux/api/features/review/reviewApi";
import { useGetTeamMembersQuery } from "@/redux/api/features/team/teamApi";
import { Award, Clock, MapPin, Shield, Users } from "lucide-react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import "../../styles/newsletter-animations.css";

// Dynamic imports to prevent SSR issues

const TeamSection = dynamic(() => import("@/components/about-us/TeamSection"), {
  ssr: false,
  loading: () => <div className="py-20 text-center">Loading team...</div>,
});

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
}
const AboutUsPage = () => {
  // Router for navigation
  const router = useRouter();

  // Company info hook
  const { getYearsOfExperience, getSocialLinks } = useCompanyInfo();

  // Team API call
  const {
    data: teamResponse,
    isLoading: isLoadingTeam,
    error: teamError,
  } = useGetTeamMembersQuery();

  // Reviews API call for Happy Travelers count
  const { data: reviewsData } = useGetReviewsQuery();

  // Countries with tours API call for Destinations count (only countries with tours)
  const { data: countriesData } = useGetCountriesWithToursQuery();

  // Gallery API call for image carousel
  const { data: galleryData } = useGetGalleryPublicImagesQuery({
    page: 1,
    limit: 15,
  });

  // Extract team members from response
  const teamMembers = teamResponse?.data || [];

  // Get years of experience from company info
  const yearsOfExperience = getYearsOfExperience();

  // Get social links
  const socialLinks = getSocialLinks();

  // Calculate total reviews (Happy Travelers)
  const totalReviews =
    reviewsData?.pagination?.total || reviewsData?.data?.length || 0;

  // Calculate total countries with tours (Actual Destinations available)
  const totalCountries = countriesData?.data?.length || 0;

  // Get gallery images
  const galleryImages = galleryData?.data || [];

  // Carousel state for gallery images
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const [_particles, setParticles] = useState<Particle[]>([]);
  useEffect(() => {
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      speed: Math.random() * 2 + 1,
      opacity: Math.random() * 0.5 + 0.3,
    }));
    setParticles(newParticles);
  }, []);

  // Auto-slide carousel effect
  useEffect(() => {
    if (galleryImages.length === 0) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === galleryImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 4000); // Change image every 4 seconds

    return () => clearInterval(interval);
  }, [galleryImages]);

  // Handler for Watch Tour button
  const handleWatchTour = () => {
    const youtubeLink = socialLinks?.youtube;
    if (youtubeLink) {
      window.open(youtubeLink, "_blank");
    } else {
      alert("YouTube link not available. Please contact support.");
    }
  };

  // Handler for Find Out More button
  const handleFindOutMore = () => {
    router.push("/contact");
  };

  return (
    <div className="bg-gradient-to-br from-yellow-50 to-purple-50">
      {/* Hero Section */}
      <section id="home" className="relative overflow-hidden">
        <div className="container mx-auto px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-6 sm:gap-8 lg:grid-cols-2">
            <div className="order-2 space-y-4 sm:space-y-6 lg:order-1">
              <div>
                <h1 className="text-2xl leading-tight font-bold text-gray-900 sm:text-3xl lg:text-4xl">
                  We provide the
                  <span className="bg-gradient-to-r from-yellow-500 to-purple-600 bg-clip-text text-transparent">
                    {" "}
                    best tour{" "}
                  </span>
                  facilities
                </h1>
                <p className="mt-3 text-sm leading-relaxed text-gray-600 sm:mt-4 sm:text-base">
                  Experience unforgettable journeys with our premium travel
                  services. From visa assistance to luxury accommodations, we
                  handle everything for your perfect vacation.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  onClick={handleFindOutMore}
                  className="transform rounded-full bg-gradient-to-r from-yellow-500 to-yellow-600 px-5 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-lg sm:px-6 sm:py-3 sm:text-base"
                >
                  Find Out More
                </button>
                <button
                  onClick={handleWatchTour}
                  className="rounded-full border-2 border-purple-600 px-5 py-2.5 text-sm font-semibold text-purple-600 transition-all duration-300 hover:bg-purple-600 hover:text-white sm:px-6 sm:py-3 sm:text-base"
                >
                  Watch Tour
                </button>
              </div>
              <div className="rounded-xl border border-purple-100 bg-white p-3 shadow-lg sm:p-4">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex-1 text-center">
                    <div className="text-lg font-bold text-purple-600 sm:text-xl md:text-2xl">
                      {yearsOfExperience > 0 ? yearsOfExperience : "05"}
                    </div>
                    <div className="text-[10px] leading-tight text-gray-600 sm:text-xs">
                      Years of Experience
                    </div>
                  </div>
                  <div className="h-8 w-px bg-gray-200 sm:h-10"></div>
                  <div className="flex-1 text-center">
                    <div className="text-lg font-bold text-yellow-500 sm:text-xl md:text-2xl">
                      {totalReviews > 0 ? `${totalReviews}+` : "1000+"}
                    </div>
                    <div className="text-[10px] leading-tight text-gray-600 sm:text-xs">
                      Happy Travelers
                    </div>
                  </div>
                  <div className="h-8 w-px bg-gray-200 sm:h-10"></div>
                  <div className="flex-1 text-center">
                    <div className="text-lg font-bold text-purple-600 sm:text-xl md:text-2xl">
                      {totalCountries > 0 ? `${totalCountries}+` : "50+"}
                    </div>
                    <div className="text-[10px] leading-tight text-gray-600 sm:text-xs">
                      Destinations
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative order-1 lg:order-2">
              <div className="relative overflow-hidden rounded-xl bg-white p-3 shadow-xl sm:rounded-2xl sm:p-4">
                {galleryImages.length > 0 ? (
                  <div className="relative h-56 w-full sm:h-64 md:h-72 lg:h-80">
                    {galleryImages.map((image: any, index: number) => (
                      <div
                        key={image._id || index}
                        className={`absolute inset-0 transition-opacity duration-1000 ${
                          index === currentImageIndex
                            ? "opacity-100"
                            : "opacity-0"
                        }`}
                      >
                        <Image
                          src={image.imageUrl || image.url}
                          alt={image.title || `Gallery image ${index + 1}`}
                          className="h-56 w-full rounded-lg object-cover sm:h-64 sm:rounded-xl md:h-72 lg:h-80"
                          width={800}
                          height={320}
                          priority={index === 0}
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <Image
                    src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                    alt="Travel destination"
                    className="h-56 w-full rounded-lg object-cover sm:h-64 sm:rounded-xl md:h-72 lg:h-80"
                    width={800}
                    height={320}
                  />
                )}
                <div className="absolute -right-2 -bottom-2 rounded-full bg-yellow-500 p-2 text-white shadow-lg sm:-right-3 sm:-bottom-3 sm:p-3">
                  <MapPin size={20} className="sm:h-6 sm:w-6" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="services" className="py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center sm:mb-12 lg:mb-16">
            <h2 className="mb-3 text-2xl font-bold text-gray-900 sm:mb-4 sm:text-3xl lg:text-4xl">
              Why Choose{" "}
              <span className="text-purple-600">Gateway Holidays</span>
            </h2>
            <p className="text-base text-gray-600 sm:text-lg lg:text-xl">
              We ensure your journey is safe, memorable, and hassle-free
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
            {[
              {
                icon: (
                  <Shield className="h-10 w-10 text-yellow-500 sm:h-12 sm:w-12" />
                ),
                title: "Safety First Always",
                description:
                  "Your safety is our top priority with certified guides and secure transportation.",
              },
              {
                icon: (
                  <Award className="h-10 w-10 text-purple-600 sm:h-12 sm:w-12" />
                ),
                title: "Trusted Travel Guide",
                description:
                  "Experienced local guides with deep knowledge of destinations and culture.",
              },
              {
                icon: (
                  <Users className="h-10 w-10 text-yellow-500 sm:h-12 sm:w-12" />
                ),
                title: "Expertise And Experience",
                description: `Over ${yearsOfExperience > 0 ? yearsOfExperience : 5} years of excellence in providing unforgettable travel experiences.`,
              },
              {
                icon: (
                  <Clock className="h-10 w-10 text-purple-600 sm:h-12 sm:w-12" />
                ),
                title: "Time And Stress Savings",
                description:
                  "We handle all arrangements so you can focus on enjoying your vacation.",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="rounded-xl border border-purple-100 bg-gradient-to-br from-gray-50 to-white p-5 shadow-lg transition-all duration-300 hover:border-purple-300 hover:shadow-xl sm:rounded-2xl sm:p-6 lg:p-8"
              >
                <div className="mb-3 sm:mb-4">{feature.icon}</div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900 sm:mb-3 sm:text-xl">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600 sm:text-base">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="services" className="bg-white py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            {/* Main Grid */}
            <div className="grid gap-8 sm:gap-10 lg:grid-cols-2 lg:gap-12">
              {/* Left Column - Image with Overlay */}
              <div className="relative order-1 h-[400px] overflow-hidden rounded-lg shadow-xl sm:h-[500px] md:h-[600px] lg:h-[700px]">
                <Image
                  src="https://res.cloudinary.com/dj2sim7gr/image/upload/v1760078917/profile-images/f3qtlgavuao1if3mgihz.jpg"
                  alt="CEO - Shameem Shahani
"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
                  quality={100}
                  priority
                  className="object-cover"
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>

                {/* Name and Designation Overlay */}
                <div className="absolute right-0 bottom-0 left-0 p-4 sm:p-6 lg:p-8">
                  <h3 className="mb-1 text-2xl font-bold text-white sm:mb-2 sm:text-3xl md:text-4xl lg:text-5xl">
                    Mr. Shameem Shahani
                  </h3>
                  <p className="mb-0.5 text-lg font-semibold text-purple-400 sm:mb-1 sm:text-xl md:text-2xl">
                    Founder & CEO
                  </p>
                  <p className="text-base text-gray-200 sm:text-lg md:text-xl">
                    Gateway Holiday
                  </p>
                </div>
              </div>

              {/* Right Column - Content */}
              <div className="order-2 flex flex-col justify-center space-y-4 sm:space-y-6 lg:space-y-8">
                {/* Section Header */}
                <div>
                  <span className="mb-2 inline-block rounded-full bg-purple-600 px-3 py-1 text-xs font-semibold text-white sm:mb-3 sm:px-4 sm:text-sm">
                    Leadership
                  </span>
                  <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl md:text-4xl lg:text-5xl">
                    Our Honourable CEO
                  </h2>
                </div>

                {/* Description */}
                <div className="space-y-3 sm:space-y-4 lg:space-y-6">
                  <p className="text-sm leading-relaxed text-gray-700 sm:text-base lg:text-lg">
                    Meet our visionary leader who brings over two decades of
                    industry expertise and innovative thinking to drive our
                    company forward.
                  </p>
                  <p className="text-sm leading-relaxed text-gray-700 sm:text-base lg:text-lg">
                    With a proven track record of transforming businesses and
                    building high-performing teams, our CEO combines strategic
                    insight with hands-on leadership.
                  </p>
                  <p className="text-sm leading-relaxed text-gray-700 sm:text-base lg:text-lg">
                    Under their guidance, we continue to push boundaries and
                    deliver exceptional value to our clients worldwide, making
                    travel dreams a reality.
                  </p>
                  <p className="text-sm leading-relaxed font-semibold text-gray-800 italic sm:text-base lg:text-lg">
                    "Our mission is to create unforgettable travel experiences
                    that inspire, connect, and transform lives."
                  </p>
                  <p className="text-sm leading-relaxed text-gray-700 sm:text-base lg:text-lg">
                    We believe that travel is not just about visiting places,
                    it's about creating memories that last a lifetime. Our
                    commitment to excellence and customer satisfaction drives us
                    to go beyond expectations in everything we do. From
                    personalized itineraries to 24/7 support, we ensure that
                    every journey with us is seamless, enriching, and truly
                    unforgettable. Your dream destination is just a conversation
                    away.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="services" className="py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <PartnerSection />
        </div>
      </section>
      <section id="services" className="py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <TeamSection
            teamMembers={teamMembers}
            isLoading={isLoadingTeam}
            error={teamError}
          />
        </div>
      </section>
    </div>
  );
};

export default AboutUsPage;
