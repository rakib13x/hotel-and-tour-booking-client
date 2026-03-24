/* eslint-disable react/no-unescaped-entities */
"use client";

import { useCompanyInfo } from "@/hooks/useCompanyInfo";
import {
  Clock,
  Facebook,
  Globe,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Send,
  Twitter,
} from "lucide-react";

export default function ContactInfoSection() {
  // Get company info using custom hook
  const { companyInfo } = useCompanyInfo();

  // Function to open live chat (ScrollToTop contact menu)
  const openLiveChat = (e: React.MouseEvent<HTMLDivElement>) => {
    // Create ripple effect
    const ripple = document.createElement("span");
    const rect = e.currentTarget.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    ripple.classList.add("ripple-effect");

    const rippleContainer = e.currentTarget.querySelector(".ripple-container");
    if (rippleContainer) {
      rippleContainer.appendChild(ripple);

      setTimeout(() => {
        ripple.remove();
      }, 600);
    }

    // Dispatch custom event to open contact menu
    window.dispatchEvent(new Event("openContactMenu"));

    // Scroll down a bit so user can see the menu
    setTimeout(() => {
      window.scrollTo({
        top: Math.max(400, window.scrollY),
        behavior: "smooth",
      });
    }, 100);
  };

  // Default values for fallback
  const defaultContactMethods = [
    {
      icon: <Phone className="h-6 w-6" />,
      title: "Phone",
      primary: "+01873-073111",
      secondary: "+880 9876-543210",
      description: "Call us anytime",
      bgColor: "bg-purple-500",
      hoverColor: "hover:bg-purple-600",
      action: "tel:+8801234567890",
    },
    {
      icon: <Mail className="h-6 w-6" />,
      title: "Email",
      primary: "info@gatewayholidays.com",
      secondary: "support@gatewayholidays.com",
      description: "Send us a message",
      bgColor: "bg-yellow-500",
      hoverColor: "hover:bg-yellow-600",
      action: "mailto:info@gatewayholidays.com",
    },
    {
      icon: <MapPin className="h-6 w-6" />,
      title: "Office",
      primary: "House 123, Road 456",
      secondary: "Dhanmondi, Dhaka 1205",
      description: "Visit our office",
      bgColor: "bg-purple-600",
      hoverColor: "hover:bg-purple-700",
      action: "#",
    },
    {
      icon: <MessageCircle className="h-6 w-6" />,
      title: "Live Chat",
      primary: "24/7 Support",
      secondary: "Instant Response",
      description: "Chat with us now",
      bgColor: "bg-green-500",
      hoverColor: "hover:bg-green-600",
      action: "livechat",
    },
  ];

  const defaultBusinessHours = [
    { day: "Monday - Friday", time: "9:00 AM - 6:00 PM" },
    { day: "Saturday", time: "10:00 AM - 4:00 PM" },
    { day: "Sunday", time: "Closed" },
  ];

  const defaultSocialLinks = [
    { icon: <Facebook className="h-5 w-5" />, name: "Facebook", url: "#" },
    { icon: <Instagram className="h-5 w-5" />, name: "Instagram", url: "#" },
    { icon: <Twitter className="h-5 w-5" />, name: "Twitter", url: "#" },
    { icon: <Linkedin className="h-5 w-5" />, name: "LinkedIn", url: "#" },
  ];

  // Dynamic data from API or fallback to defaults
  const contactMethods = companyInfo
    ? [
        {
          icon: <Phone className="h-6 w-6" />,
          title: "Phone",
          primary: companyInfo.phone?.[0] || "+880 1234-567890",
          secondary: companyInfo.phone?.[1] || "+880 9876-543210",
          description: "Call us anytime",
          bgColor: "bg-purple-500",
          hoverColor: "hover:bg-purple-600",
          action: `tel:${companyInfo.phone?.[0] || "+8801234567890"}`,
        },
        {
          icon: <Mail className="h-6 w-6" />,
          title: "Email",
          primary: companyInfo.email?.[0] || "info@gatewayholidays.com",
          secondary: companyInfo.email?.[1] || "support@gatewayholidays.com",
          description: "Send us a message",
          bgColor: "bg-yellow-500",
          hoverColor: "hover:bg-yellow-600",
          action: `mailto:${companyInfo.email?.[0] || "info@gatewayholidays.com"}`,
        },
        {
          icon: <MapPin className="h-6 w-6" />,
          title: "Office",
          primary: companyInfo.address || "House 123, Road 456",
          secondary: companyInfo.companyName || "Gateway Holidays Ltd.",
          description: "Visit our office",
          bgColor: "bg-purple-600",
          hoverColor: "hover:bg-purple-700",
          action: companyInfo.googleMapUrl || "#",
        },
        {
          icon: <MessageCircle className="h-6 w-6" />,
          title: "Live Chat",
          primary: "24/7 Support",
          secondary: "Instant Response",
          description: "Chat with us now",
          bgColor: "bg-green-500",
          hoverColor: "hover:bg-green-600",
          action: "livechat",
        },
      ]
    : defaultContactMethods;

  const businessHours = companyInfo?.openingHours
    ? [
        { day: "General Hours", time: companyInfo.openingHours },
        ...(companyInfo.close
          ? [{ day: "Closed On", time: companyInfo.close }]
          : []),
      ]
    : (companyInfo as any)?.officeHours?.length
      ? (companyInfo as any).officeHours.map((hour: any) => ({
          day: hour.day,
          time: `${hour.open} - ${hour.close}`,
        }))
      : defaultBusinessHours;

  const socialLinks = companyInfo?.socialLinks
    ? [
        ...(companyInfo.socialLinks.facebook
          ? [
              {
                icon: <Facebook className="h-5 w-5" />,
                name: "Facebook",
                url: companyInfo.socialLinks.facebook,
              },
            ]
          : []),
        ...(companyInfo.socialLinks.instagram
          ? [
              {
                icon: <Instagram className="h-5 w-5" />,
                name: "Instagram",
                url: companyInfo.socialLinks.instagram,
              },
            ]
          : []),
        ...(companyInfo.socialLinks.twitter
          ? [
              {
                icon: <Twitter className="h-5 w-5" />,
                name: "Twitter",
                url: companyInfo.socialLinks.twitter,
              },
            ]
          : []),
        ...(companyInfo.socialLinks.linkedin
          ? [
              {
                icon: <Linkedin className="h-5 w-5" />,
                name: "LinkedIn",
                url: companyInfo.socialLinks.linkedin,
              },
            ]
          : []),
        ...(companyInfo.socialLinks.youtube
          ? [
              {
                icon: <Globe className="h-5 w-5" />,
                name: "YouTube",
                url: companyInfo.socialLinks.youtube,
              },
            ]
          : []),
        ...(companyInfo.socialLinks.tiktok
          ? [
              {
                icon: <MessageCircle className="h-5 w-5" />,
                name: "TikTok",
                url: companyInfo.socialLinks.tiktok,
              },
            ]
          : []),
      ]
    : defaultSocialLinks;

  return (
    <div className="py-16">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Header Section */}
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-4xl font-bold text-purple-800">
            Get In Touch
          </h2>
          <p className="mx-auto max-w-3xl text-xl text-gray-600">
            Contact us to plan your dream vacation. We're here to make your
            travel experience unforgettable and provide excellent service.
          </p>
          <div className="mx-auto mt-6 h-1 w-24 rounded-full bg-gradient-to-r from-purple-500 to-yellow-500"></div>
        </div>

        {/* Contact Methods Grid */}
        <div className="mb-16 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {contactMethods.map((method, index) => (
            <div
              key={index}
              onClick={(e) => {
                if (method.action === "livechat") {
                  openLiveChat(e);
                } else if (method.action !== "#") {
                  window.open(method.action, "_self");
                }
              }}
              className={`group relative transform cursor-pointer overflow-hidden rounded-2xl border border-purple-100 bg-white p-6 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl ${
                method.action === "livechat"
                  ? "hover:border-green-300 active:scale-95"
                  : ""
              }`}
            >
              {/* Ripple container for live chat */}
              {method.action === "livechat" && (
                <div className="ripple-container absolute inset-0" />
              )}

              {/* Glow effect for live chat on hover */}
              {method.action === "livechat" && (
                <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <div className="absolute inset-0 animate-pulse rounded-2xl bg-gradient-to-r from-green-400/20 to-blue-400/20" />
                </div>
              )}

              <div
                className={`${method.bgColor} ${method.hoverColor} relative z-10 mb-4 flex h-12 w-12 items-center justify-center rounded-full text-white transition-transform duration-300 group-hover:scale-110 ${
                  method.action === "livechat" ? "group-hover:rotate-12" : ""
                }`}
              >
                {method.icon}
              </div>
              <h3 className="relative z-10 mb-2 text-lg font-bold text-purple-800">
                {method.title}
              </h3>
              <p className="relative z-10 mb-1 font-medium text-purple-600">
                {method.primary}
              </p>
              <p className="relative z-10 mb-3 text-sm text-gray-500">
                {method.secondary}
              </p>
              <p className="relative z-10 mb-4 text-xs text-gray-400">
                {method.description}
              </p>
            </div>
          ))}
        </div>

        <style jsx>{`
          .ripple-effect {
            position: absolute;
            border-radius: 50%;
            background: rgba(34, 197, 94, 0.4);
            transform: scale(0);
            animation: ripple-animation 0.6s ease-out;
            pointer-events: none;
          }

          @keyframes ripple-animation {
            to {
              transform: scale(2);
              opacity: 0;
            }
          }
        `}</style>

        {/* Business Hours & Social Links */}
        <div className="mb-16 grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Business Hours */}
          <div className="rounded-2xl border border-yellow-100 bg-white p-8 shadow-lg">
            <div className="mb-6 flex items-center">
              <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-full bg-yellow-500 text-white">
                <Clock className="h-6 w-6" />
              </div>
              <h3 className="text-2xl font-bold text-purple-800">
                Office Hours
              </h3>
            </div>

            <div className="space-y-4">
              {businessHours.map((hour: any, index: number) => (
                <div
                  key={index}
                  className="flex items-center justify-between border-b border-gray-100 py-3 last:border-0"
                >
                  <span className="font-medium text-gray-700">{hour.day}</span>
                  <span className="font-semibold text-purple-600">
                    {hour.time}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-xl bg-purple-50 p-4">
              <p className="text-sm font-medium text-purple-700">
                <Clock className="mr-2 inline h-4 w-4" />
                Emergency Support: 24/7 Available
              </p>
            </div>
          </div>

          {/* Social Media & Quick Info */}
          <div className="rounded-2xl border border-purple-100 bg-white p-8 shadow-lg">
            <div className="mb-6 flex items-center">
              <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-full bg-purple-500 text-white">
                <Send className="h-6 w-6" />
              </div>
              <h3 className="text-2xl font-bold text-purple-800">
                Connect With Us
              </h3>
            </div>

            {/* Social Links */}
            <div className="mb-6">
              <p className="mb-4 text-gray-600">
                Follow us on social media for updates:
              </p>
              <div className="flex space-x-3">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.url}
                    className="flex h-12 w-12 transform items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-yellow-500 text-white shadow-lg transition-all duration-300 hover:scale-110 hover:from-purple-600 hover:to-yellow-600"
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Contact Info */}
            <div className="space-y-3">
              {companyInfo?.address && (
                <div className="flex items-center text-gray-600">
                  <MapPin className="mr-3 h-4 w-4 text-purple-500" />
                  <span>{companyInfo.address}</span>
                </div>
              )}
              {companyInfo?.description && (
                <div className="flex items-center text-gray-600">
                  <MessageCircle className="mr-3 h-4 w-4 text-purple-500" />
                  <span className="text-sm">{companyInfo.description}</span>
                </div>
              )}
            </div>

            {/* CTA Button */}
            {/* <button className="mt-6 w-full transform rounded-xl bg-gradient-to-r from-yellow-400 to-yellow-500 px-6 py-3 font-bold text-purple-900 shadow-lg transition-all duration-300 hover:scale-105 hover:from-yellow-500 hover:to-yellow-600">
              Book Consultation Now
            </button> */}
          </div>
        </div>
      </div>
    </div>
  );
}
