import {
  ExclusiveOffersSection,
  HeroSection,
  TopDestinationsSection,
} from "@/components/home";
import FaqSection from "@/components/home/faq/FaqSection";
import ConnectWithUs from "@/components/home/sections/ConnectWithUs";
import TestimonialsSection from "@/components/home/sections/Testimonial";

export default function Home() {
  return (
    <>
      {/* Hero Section with Search */}
      <HeroSection />

      {/* Package Cards by Category Section */}
      {/* <PackageCardsSection /> */}

      {/* Top Destinations Section */}
      <TopDestinationsSection />

      {/* Exclusive Offers Section */}
      <ExclusiveOffersSection />

      {/* Package Section */}
      {/* <PackageSection /> */}

      {/* Testimonial */}
      <TestimonialsSection />

      {/* FAQ Section */}
      <FaqSection />

      {/* Connect With Us Section */}
      <ConnectWithUs />

      {/* Newsletter Section */}
      {/* <NewsLetter /> */}
    </>
  );
}
