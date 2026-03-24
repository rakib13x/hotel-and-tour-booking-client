"use client";

import { useGetAllCompanyInfoQuery } from "@/redux/api/features/companyInfo/companyInfoApi";
import { useGetPolicyPageBySlugQuery } from "@/redux/api/features/policy/policyApi";
import { PolicySlug } from "@/types/policy";
import { Loader2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

// Define valid slugs based on your schema enum
const VALID_SLUGS: PolicySlug[] = ["terms", "privacy", "refund"];

export default function PolicyPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.["slug"] as string;

  // Check if slug is valid
  const isValidSlug = VALID_SLUGS.includes(slug as PolicySlug);

  // Fetch policy data from API
  const {
    data: policyResponse,
    isLoading,
    error,
  } = useGetPolicyPageBySlugQuery(slug, {
    skip: !isValidSlug,
  });

  // Fetch company info from API
  const { data: companyInfoResponse } = useGetAllCompanyInfoQuery();
  const companyInfo = (companyInfoResponse?.data as any)?.[0];

  const policy = policyResponse?.data;

  useEffect(() => {
    // Redirect to 404 if slug is invalid
    if (!isValidSlug) {
      router.push("/404");
    }
  }, [isValidSlug, router]);

  const getTitleBySlug = (slug: string) => {
    const titles = {
      terms: "Terms and Conditions",
      privacy: "Privacy Policy",
      refund: "Refund Policy",
    };
    return titles[slug as keyof typeof titles] || "Policy";
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-r from-gray-50 to-gray-100">
        <div className="text-center">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-purple-600" />
          <p className="mt-4 text-lg text-gray-600">Loading policy...</p>
        </div>
      </div>
    );
  }

  // Error or not found state
  if (error || !policy) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-r from-gray-50 to-gray-100">
        <div className="text-center">
          <h1 className="mb-4 text-4xl font-bold text-gray-800">
            Policy Not Found
          </h1>
          <p className="mb-6 text-lg text-gray-600">
            The policy you're looking for doesn't exist or hasn't been created
            yet.
          </p>
          <button
            onClick={() => router.push("/")}
            className="rounded-lg bg-purple-600 px-6 py-3 text-white hover:bg-purple-700"
          >
            Go to Homepage
          </button>
        </div>
      </div>
    );
  }

  // Render policy content
  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-50 to-gray-100 py-12">
      <div className="container mx-auto max-w-5xl px-6">
        <div className="rounded-lg bg-white p-8 shadow-xl">
          {/* Header */}
          <h1 className="mb-10 text-center text-4xl font-extrabold text-gray-800">
            <span className="text-purple-600">
              {getTitleBySlug(policy.slug)}
            </span>
          </h1>

          {/* Last Updated */}
          <div className="mb-8 text-center">
            <p className="text-gray-600">
              Last updated: {new Date(policy.updatedAt).toLocaleDateString()}
            </p>
          </div>

          {/* Divider */}
          <div className="my-6 border-b border-gray-300"></div>

          {/* Content - Render HTML */}
          <div
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: policy.content }}
          />

          {/* Contact Section */}
          {companyInfo && (
            <section className="mt-8">
              <div className="border-t border-gray-300 pt-8">
                <h2 className="mb-4 text-2xl font-bold text-gray-800">
                  Contact Us
                </h2>
                <p className="mb-4 text-gray-600">
                  If you have any questions about this policy, please contact
                  us:
                </p>
                <ul className="list-none space-y-2 pl-0 text-gray-600">
                  {companyInfo.email && companyInfo.email.length > 0 && (
                    <li>
                      <strong>Email:</strong>{" "}
                      {companyInfo.email.map((email: string, index: number) => (
                        <span key={email}>
                          <a
                            href={`mailto:${email}`}
                            className="text-black hover:underline"
                          >
                            {email}
                          </a>
                          {index < companyInfo.email.length - 1 && ", "}
                        </span>
                      ))}
                    </li>
                  )}
                  {companyInfo.phone && companyInfo.phone.length > 0 && (
                    <li>
                      <strong>Phone:</strong>{" "}
                      {companyInfo.phone.map((phone: string, index: number) => (
                        <span key={phone}>
                          <a
                            href={`tel:${phone}`}
                            className="text-black hover:underline"
                          >
                            {phone}
                          </a>
                          {index < companyInfo.phone.length - 1 && ", "}
                        </span>
                      ))}
                    </li>
                  )}
                  {companyInfo.address && (
                    <li>
                      <strong>Address:</strong> {companyInfo.address}
                    </li>
                  )}
                </ul>
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
