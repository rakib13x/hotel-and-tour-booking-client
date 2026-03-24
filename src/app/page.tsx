import FaqSection from "@/components/home/faq/FaqSection";
import ConnectWithUs from "@/components/home/sections/ConnectWithUs";
import ExclusiveOffersSection from "@/components/home/sections/exclusiveOffersSection";
import HeroSection from "@/components/home/sections/heroSection/heroSection";
import TestimonialsSection from "@/components/home/sections/Testimonial";
import TopDestinationsSection from "@/components/home/sections/TopDestinationsSection";

export default function Home() {
  return (
    <>
      {/* Hero Section with Search */}
      <HeroSection />
      <TopDestinationsSection />
      <ExclusiveOffersSection />
      <TestimonialsSection />
      <FaqSection />
      <ConnectWithUs />
    </>
  );
}
