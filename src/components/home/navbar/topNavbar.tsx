"use client"
import { useCompanyInfo } from "@/hooks/useCompanyInfo";
import { CompanyData, SocialIcon } from "@/types/company";
import { TUser } from "@/types";
import { Clock, PhoneCall } from "lucide-react";

interface TopNavbarProps {
  isLoggedIn?: boolean;
  user?: TUser | null;
  userType?: "user" | "moderator" | "admin" | "super_admin";
  isScrolled?: boolean;
  onDropdownToggle?: (isOpen: boolean) => void;
  companyData?: any;
}


export default function TopNavbar({
  isScrolled = false,
  companyData: _companyData, // Keep for backward compatibility but use hook internally
}: TopNavbarProps) {

  // Get company info using custom hook
  const { getOpeningHours, getPrimaryPhone, getSocialLinks } = useCompanyInfo();

  const socialLinksData = getSocialLinks();
  const socialIcons: SocialIcon[] = [
    {
      key: "facebook",
      label: "f",
      href: socialLinksData?.facebook || undefined,
    },
    {
      key: "twitter",
      label: "𝕏",
      href: socialLinksData?.twitter || undefined,
    },
    {
      key: "linkedin",
      label: "in",
      href: socialLinksData?.linkedin || undefined,
    },
    {
      key: "youtube",
      label: "YT",
      href: socialLinksData?.youtube || undefined,
    },
    {
      key: "instagram",
      label: "IG",
      href: socialLinksData?.instagram || undefined,
    },
    {
      key: "tiktok",
      label: "TT",
      href: socialLinksData?.tiktok || undefined,
    },
  ];

  return (
    <>
      <div
        className={`py-2.5 text-white transition-all duration-300 ${
          isScrolled ? "bg-slate-800/90 backdrop-blur-sm" : "bg-slate-800"
        }`}
        >
        <div className="max-w-7xl mx-auto">
          <div className="px-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between md:gap-0">
              {/* Left side - Social Media Icons */}
              <div className="flex items-center justify-center gap-4 md:justify-end">
                <div className="flex items-center gap-2 sm:gap-3">
                  {socialIcons.map(
                    (social) =>
                      social.href && (
                        <a
                          key={social.key}
                          href={social.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-600 text-sm transition-colors hover:bg-slate-700"
                        >
                          {social.label}
                        </a>
                      )
                  )}
                </div>
              </div>

              {/* Right side - Contact Info */}
              <div className="flex flex-wrap items-center justify-center gap-4 text-sm md:justify-start">
                <div className="flex items-center gap-2">
                  <Clock className="text-accent h-4 w-4 shrink-0" />
                  <span className="hidden sm:inline">
                    Opening Hours: {getOpeningHours()}
                  </span>
                  <span className="sm:hidden">{getOpeningHours()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <PhoneCall className="text-accent h-4 w-4 shrink-0" />
                  <span className="hidden sm:inline">{getPrimaryPhone()}</span>
                  <span className="sm:hidden">{getPrimaryPhone()}</span>
                </div>
              </div>
              </div>
          </div>
        </div>
      </div>
    </>
  );
}
