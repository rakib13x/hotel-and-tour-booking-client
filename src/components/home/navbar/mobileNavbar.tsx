"use client";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuthCheck } from "@/hooks/useAuthCheck";
import { useLogout } from "@/hooks/useLogout";
import { ChevronDown, LayoutDashboard, LogOut, Lock, Menu, User as UserIcon, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import logo from "../../../../public/logo/logo.jpg"
import { TUser } from "@/types";

interface MobileNavbarProps {
  isLoggedIn?: boolean;
  user?: TUser | null;
  userType?: "user" | "moderator" | "admin" | "super_admin";
  isScrolled?: boolean;
  navigationLinks: Array<{
    label: string;
    href: string;
    hasDropdown?: boolean;
  }>;
  queryDropdownItems: Array<{
    label: string;
    href: string;
  }>;
}

export default function MobileNavbar({
  isLoggedIn = false,
  user,
  userType,
  isScrolled = false,
  navigationLinks,
  queryDropdownItems,
}: MobileNavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isQueryDropdownOpen, setIsQueryDropdownOpen] = useState(false);
  const { handleLogout, isLoading } = useLogout();
  const { checkAuth } = useAuthCheck();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    setIsQueryDropdownOpen(false);
  };

  const toggleQueryDropdown = () => {
    setIsQueryDropdownOpen(!isQueryDropdownOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    setIsQueryDropdownOpen(false);
  };

  return (
    <>
      {/* Mobile Navbar Header */}
      <div
        className={`text-white transition-all duration-300 flex items-center justify-between ${
          isScrolled ? "bg-primary/95 backdrop-blur-sm" : "bg-primary"
        }`}
      >
        <Link href="/" className="group p-3">
          <Image
            src={logo}
            alt="Gateway Holidays Logo"
            width={65}
            height={65}
            className="object-contain transition-all duration-300"
            priority
            placeholder={isLoading ? "blur" : "empty"}
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
          />
        </Link>
        
        <div className="flex items-center gap-2 px-4 py-3">
          {/* Profile Dropdown directly on Mobile Navbar */}
          <div className="flex items-center">
            {isLoggedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="focus:outline-none">
                    <Avatar className="h-9 w-9 border-2 border-white transition-all hover:scale-105">
                      <AvatarImage src={user?.profileImg} alt={user?.name || "User"} />
                      <AvatarFallback className="bg-accent text-white text-xs">
                        {user?.name?.charAt(0).toUpperCase() || <UserIcon className="h-4 w-4" />}
                      </AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 mt-2 z-[60]">
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
                      className="cursor-pointer flex items-center w-full"
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
                <Avatar className="h-9 w-9 border-2 border-white transition-all hover:scale-105">
                  <AvatarFallback className="bg-accent text-white">
                    <UserIcon className="h-5 w-5" />
                  </AvatarFallback>
                </Avatar>
              </Link>
            )}
          </div>

          <button
            onClick={toggleMobileMenu}
            className="hover:text-accent p-2 text-white transition-colors ml-1"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={`bg-opacity-50 fixed inset-0 z-40 bg-black transition-opacity duration-300 ${
          isMobileMenuOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={closeMobileMenu}
      />

      {/* Mobile Menu Panel */}
      <div
        className={`fixed top-0 left-0 z-50 h-full w-80 max-w-[85vw] transform bg-white shadow-2xl transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          <div className="bg-primary flex items-center justify-between p-4 text-white">
            <h2 className="text-lg font-semibold">Menu</h2>
            <button
              onClick={closeMobileMenu}
              className="hover:text-accent p-1 text-white transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* User Profile Section in Mobile Menu */}
          {isLoggedIn && (
            <div className="border-b border-gray-100 p-6 bg-gray-50/50">
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12 border-2 border-primary/10">
                  <AvatarImage src={user?.profileImg || ""} alt={user?.name || "User"} />
                  <AvatarFallback className="bg-primary text-white">
                    {user?.name?.charAt(0).toUpperCase() || <UserIcon className="h-6 w-6" />}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-gray-900 line-clamp-1">{user?.name}</span>
                  <span className="text-xs text-gray-500 line-clamp-1">{user?.email}</span>
                </div>
              </div>
            </div>
          )}

          <nav className="flex-1 overflow-y-auto py-4">
            <div className="space-y-1">
              {navigationLinks.map((link) => (
                <div key={link.label}>
                  {link.hasDropdown ? (
                    <>
                      <button
                        onClick={toggleQueryDropdown}
                        className="hover:text-primary flex w-full items-center justify-between px-6 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-50"
                      >
                        <span>{link.label}</span>
                        <ChevronDown
                          className={`h-4 w-4 transition-transform duration-200 ${
                            isQueryDropdownOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      <div
                        className={`overflow-hidden bg-gray-50 transition-all duration-300 ${
                          isQueryDropdownOpen
                            ? "max-h-48 opacity-100"
                            : "max-h-0 opacity-0"
                        }`}
                      >
                        {queryDropdownItems.map((item) => (
                          <button
                            key={item.label}
                            onClick={() => {
                              closeMobileMenu();
                              if (
                                !checkAuth(
                                  `access ${item.label.toLowerCase()} query`,
                                  () => { window.location.href = "/login"; }
                                )
                              ) {
                                return;
                              }
                              window.location.href = item.href;
                            }}
                            className="hover:text-primary hover:border-accent block w-full border-l-2 border-transparent px-8 py-3 text-left text-sm text-gray-600 transition-colors hover:bg-gray-100"
                          >
                            {item.label}
                          </button>
                        ))}
                      </div>
                    </>
                  ) : (
                    <Link
                      href={link.href}
                      onClick={closeMobileMenu}
                      className="hover:text-primary hover:border-accent block border-l-2 border-transparent px-6 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-50"
                    >
                      {link.label}
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </nav>

          <div className="border-t border-gray-200 bg-gray-50 p-4">
            {isLoggedIn ? (
              <div className="space-y-2">
                <Link
                  href={
                    userType === "admin" || userType === "super_admin"
                      ? "/dashboard/admin"
                      : "/dashboard/user"
                  }
                  onClick={closeMobileMenu}
                >
                  <Button className="bg-primary hover:bg-primary/90 w-full text-white mb-3 flex items-center justify-center gap-2">
                    <LayoutDashboard className="h-4 w-4" />
                    {userType === "admin" || userType === "super_admin"
                      ? "Admin Panel"
                      : "Dashboard"}
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 w-full flex items-center justify-center gap-2"
                  onClick={handleLogout}
                  disabled={isLoading}
                >
                  {isLoading ? "Logging out..." : (
                    <>
                      <LogOut className="h-4 w-4" />
                      Logout
                    </>
                  )}
                </Button>
              </div>
            ) : (
              <Link href="/login" onClick={closeMobileMenu}>
                <Button className="bg-accent hover:bg-accent/90 w-full text-white">
                  <Lock className="mr-2 h-4 w-4" />
                  Customer Login
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
