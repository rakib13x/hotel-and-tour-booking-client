"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuthCheck } from "@/hooks/useAuthCheck";
import { useLogout } from "@/hooks/useLogout";
import { LayoutDashboard, LogOut, Lock, User as UserIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import MobileNavbar from "./mobileNavbar";
import Image from "next/image";
import logo from "../../../../public/logo/logo.jpg"
import { TUser } from "@/types";

interface MainNavbarProps {
  isLoggedIn?: boolean;
  user?: TUser | null;
  userType?: "user" | "moderator" | "admin" | "super_admin";
  isScrolled?: boolean;
  onDropdownToggle?: (isOpen: boolean) => void;
}

const navigationLinks = [
  { label: "Home", href: "/" },
  { label: "Query", href: "/query", hasDropdown: true },
  { label: "Package", href: "/package" },
  { label: "Visa", href: "/visa" },
  { label: "Gallery", href: "/gallery" },
  { label: "About Us", href: "/about-us" },
  { label: "Contact Us", href: "/contact-us" },
  { label: "Authorization", href: "/authorization" },
  { label: "News & Update", href: "/blog" },
];

const queryDropdownItems = [
  { label: "Umrah", href: "/query/umrah" },
  { label: "Package Tour", href: "/query/package-tour" },
];

export default function MainNavbar({
  isLoggedIn = false,
  user,
  userType,
  isScrolled = false,
  onDropdownToggle,
}: MainNavbarProps) {
  const [isQueryDropdownOpen, setIsQueryDropdownOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const { handleLogout, isLoading } = useLogout();
  const { checkAuth } = useAuthCheck();

  const handleGoogleLogin = () => {
    const API_URL = process.env["NEXT_PUBLIC_API_URL"]!;
    // Redirect to Google OAuth endpoint
    window.location.href = `${API_URL}/auth/google`;
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".dropdown-container")) {
        setIsQueryDropdownOpen(false);
        onDropdownToggle?.(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onDropdownToggle]);

  return (
    <>
      {/* Desktop Navbar */}
      <div
        className={`hidden text-white transition-all duration-300 lg:block ${
          isScrolled ? "bg-primary/95 backdrop-blur-sm" : "bg-primary"
        }`}
      >
        <div className="
         max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            {/* Navigation Links */}
            <nav className="flex flex-grow items-center space-x-8">
              <Link href="/" className="group">
            
            
              <Image
                src={logo}
                alt={
                   "Gateway Holidays Logo"
                }
                width={65}
                height={65}
                className="object-contain transition-all duration-300"
                priority
                placeholder={isLoading ? "blur" : "empty"}
                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                onError={(e) => {
                  // Fallback to default logo if image fails to load
                  const target = e.target as HTMLImageElement;
                  target.src = logo.src;
                }}
              />
            
          </Link>
              {navigationLinks.map((link) => (
                <div key={link.label} className="dropdown-container relative">
                  {link.hasDropdown ? (
                    <div
                      className="relative"
                      onMouseEnter={() => {
                        if (link.label === "Query") {
                          setIsQueryDropdownOpen(true);
                        }
                      }}
                      onMouseLeave={() => {
                        if (link.label === "Query") {
                          setIsQueryDropdownOpen(false);
                        }
                      }}
                    >
                      <button
                        className={`flex cursor-pointer items-center text-sm font-medium tracking-wide uppercase transition-colors ${
                          isScrolled
                            ? "hover:text-accent text-white"
                            : "hover:text-accent text-white drop-shadow-lg"
                        }`}
                      >
                        {link.label}
                        <svg
                          className={`ml-1 h-4 w-4 transition-transform duration-200 ${
                            isQueryDropdownOpen ? "rotate-180" : ""
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </button>

                      {/* Dropdown Menu */}
                      <div
                        className={`absolute top-full left-0 mt-2 w-48 rounded-lg border bg-white shadow-xl transition-all duration-300 ${
                          link.label === "Query" && isQueryDropdownOpen
                            ? "visible translate-y-0 opacity-100"
                            : "invisible -translate-y-2 opacity-0"
                        }`}
                        style={{ zIndex: 50 }}
                      >
                        <div className="py-2">
                          {queryDropdownItems.map((item) => (
                            <button
                              key={item.label}
                              onClick={() => {
                                setIsQueryDropdownOpen(false);
                                onDropdownToggle?.(false);
                                // Check auth before navigating
                                if (
                                  !checkAuth(
                                    `access ${item.label.toLowerCase()} query`,
                                    () => setIsLoginModalOpen(true)
                                  )
                                ) {
                                  return;
                                }
                                // Navigate to the page
                                window.location.href = item.href;
                              }}
                              className="hover:bg-accent block w-full px-4 py-3 text-left text-sm text-gray-700 transition-all duration-200 first:rounded-t-lg last:rounded-b-lg hover:text-white"
                            >
                              {item.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <Link
                      href={link.href}
                      className={`text-sm font-medium tracking-wide uppercase transition-colors ${
                        isScrolled
                          ? "hover:text-accent text-white"
                          : "hover:text-accent text-white drop-shadow-lg"
                      }`}
                    >
                      {link.label}
                    </Link>
                  )}
                </div>
              ))}
            </nav>

            {/* Login/Profile Buttons */}
            <div className="flex items-center gap-3">
              {isLoggedIn ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="focus:outline-none">
                      <Avatar className="h-10 w-10 border-2 border-white transition-all hover:scale-105">
                        <AvatarImage src={user?.profileImg} alt={user?.name || "User"} />
                        <AvatarFallback className="bg-accent text-white">
                          {user?.name?.charAt(0).toUpperCase() || <UserIcon className="h-5 w-5" />}
                        </AvatarFallback>
                      </Avatar>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 mt-1">
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user?.name}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user?.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link
                        href={
                          userType === "admin" || userType === "super_admin"
                            ? "/dashboard/admin"
                            : "/dashboard/user"
                        }
                        className="cursor-pointer flex items-center"
                      >
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        <span>
                          {userType === "admin" || userType === "super_admin"
                            ? "Admin Panel"
                            : "Dashboard"}
                        </span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
                      onClick={handleLogout}
                      disabled={isLoading}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>{isLoading ? "Logging out..." : "Logout"}</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link href="/login">
                  <Button
                    variant="outline"
                    size="sm"
                    className="hover:text-primary border-white bg-transparent text-white transition-all duration-300 hover:bg-white"
                  >
                    <Lock className="h-4 w-4" />
                    Login
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile/Tablet Navbar */}
      <div className="lg:hidden">
        <MobileNavbar
          isLoggedIn={isLoggedIn}
          user={user}
          userType={userType || "user"}
          isScrolled={isScrolled}
          navigationLinks={navigationLinks}
          queryDropdownItems={queryDropdownItems}
        />
      </div>
    </>
  );
}
