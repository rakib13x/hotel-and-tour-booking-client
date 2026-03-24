"use client";

import { useState } from "react";

export default function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitted(true);
      setIsLoading(false);
      setTimeout(() => {
        setIsSubmitted(false);
        setEmail("");
      }, 3000);
    }, 1500);
  };

  return (
    <div className="flex items-center justify-center p-4">
      {/* Main Container */}
      <div className="relative w-full max-w-6xl">
        {/* Decorative Background Elements */}
        <div className="absolute -top-10 -left-10 h-32 w-32 animate-pulse rounded-full bg-gradient-to-br from-orange-200 to-orange-300 opacity-20"></div>
        <div className="absolute -right-10 -bottom-10 h-40 w-40 animate-pulse rounded-full bg-gradient-to-br from-blue-200 to-blue-300 opacity-20 delay-1000"></div>

        {/* Newsletter Card */}
        <div className="hover:shadow-3xl relative transform rounded-2xl border border-gray-200 bg-white/80 p-6 shadow-2xl backdrop-blur-sm transition-all duration-500 md:p-12">
          {/* Floating Icons */}
          <div className="absolute -top-6 left-1/4 flex h-12 w-12 rotate-12 transform animate-bounce items-center justify-center rounded-full bg-gradient-to-r from-orange-400 to-orange-500">
            <svg
              className="h-6 w-6 text-white"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
            </svg>
          </div>

          <div className="absolute -top-4 right-1/4 flex h-10 w-10 -rotate-12 transform animate-bounce items-center justify-center rounded-full bg-gradient-to-r from-blue-400 to-blue-500 delay-500">
            <svg
              className="h-5 w-5 text-white"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                clipRule="evenodd"
              ></path>
            </svg>
          </div>

          {/* Content */}
          <div className="space-y-8 text-center">
            {/* Header */}
            <div className="space-y-4">
              <h1 className="text-2xl font-bold tracking-tight text-gray-800 md:text-3xl">
                Subscribe Our{" "}
                <span className="relative">
                  <span className="animate-pulse bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
                    NEWSLETTER
                  </span>
                  <div className="absolute right-0 -bottom-2 left-0 h-1 scale-x-0 transform animate-pulse rounded-full bg-gradient-to-r from-orange-400 to-orange-600 transition-transform duration-700 group-hover:scale-x-100"></div>
                </span>
              </h1>

              <p className="md:text-md animate-fade-in-up animation-delay-300 mx-auto max-w-2xl text-sm text-gray-600 opacity-0">
                Get the latest travel deals, destination guides, and insider
                tips delivered straight to your inbox
              </p>
            </div>

            {/* Newsletter Signup */}
            <div className="animate-fade-in-up animation-delay-600 relative mx-auto max-w-2xl opacity-0">
              <div className="relative flex flex-col gap-4 rounded-2xl border-2 border-gray-100 bg-gray-50 p-2 transition-all duration-300 focus-within:border-orange-300 hover:shadow-lg sm:flex-row">
                <div className="relative flex-1">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full bg-transparent px-6 py-4 text-lg text-gray-700 placeholder-gray-400 focus:outline-none"
                    disabled={isLoading || isSubmitted}
                  />
                  <div className="absolute inset-x-6 bottom-0 h-0.5 scale-x-0 transform bg-gradient-to-r from-orange-400 to-orange-600 transition-transform duration-300 focus-within:scale-x-100"></div>
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={isLoading || isSubmitted || !email}
                  className={`transform rounded-xl px-8 py-4 text-lg font-semibold transition-all duration-300 ${
                    isSubmitted
                      ? "bg-green-500 text-white"
                      : "bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700"
                  } ${
                    isLoading
                      ? "animate-pulse cursor-not-allowed"
                      : "cursor-pointer hover:scale-105 hover:shadow-lg active:scale-95"
                  } ${
                    !email && !isSubmitted
                      ? "cursor-not-allowed opacity-50"
                      : ""
                  }`}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                      <span>Sending...</span>
                    </div>
                  ) : isSubmitted ? (
                    <div className="flex items-center gap-2">
                      <svg
                        className="h-5 w-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                      <span>Subscribed!</span>
                    </div>
                  ) : (
                    "SUBMIT"
                  )}
                </button>
              </div>
            </div>

            {/* Success Message */}
            {isSubmitted && (
              <div className="animate-fade-in-up mx-auto max-w-md rounded-xl border border-green-200 bg-green-50 p-4">
                <p className="font-medium text-green-700">
                  🎉 Thank you! Check your email for amazing travel deals.
                </p>
              </div>
            )}

            {/* Additional Info */}
            <div className="animate-fade-in-up animation-delay-900 flex flex-wrap justify-center gap-8 pt-6 opacity-0">
              <div className="flex cursor-pointer items-center gap-2 text-gray-600 transition-colors duration-200 hover:text-orange-500">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-100">
                  <svg
                    className="h-4 w-4 text-orange-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </div>
                <span className="text-sm font-medium">Weekly Updates</span>
              </div>

              <div className="flex cursor-pointer items-center gap-2 text-gray-600 transition-colors duration-200 hover:text-orange-500">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-100">
                  <svg
                    className="h-4 w-4 text-orange-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </div>
                <span className="text-sm font-medium">Exclusive Deals</span>
              </div>

              <div className="flex cursor-pointer items-center gap-2 text-gray-600 transition-colors duration-200 hover:text-orange-500">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-100">
                  <svg
                    className="h-4 w-4 text-orange-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </div>
                <span className="text-sm font-medium">No Spam</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
        }

        .animation-delay-300 {
          animation-delay: 0.3s;
        }

        .animation-delay-600 {
          animation-delay: 0.6s;
        }

        .animation-delay-900 {
          animation-delay: 0.9s;
        }

        .delay-500 {
          animation-delay: 0.5s;
        }

        .delay-1000 {
          animation-delay: 1s;
        }
      `}</style>
    </div>
  );
}
