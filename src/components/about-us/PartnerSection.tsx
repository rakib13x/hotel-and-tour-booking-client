"use client";

import { useGetPublicCorporateClientsQuery } from "@/redux/api/corporateClientsApi";
import Image from "next/image";

interface CorporateClient {
  _id: string;
  name: string;
  logo: string;
}

const PartnerSection = () => {
  const {
    data: clientsData,
    isLoading,
    error,
  } = useGetPublicCorporateClientsQuery({});

  const clients: CorporateClient[] = clientsData?.data || [];

  if (isLoading) {
    return (
      <section className="overflow-hidden py-2">
        <div className="mx-auto mb-12 max-w-7xl px-4 text-center">
          <h2 className="mb-4 text-4xl font-bold text-gray-800">
            Our Corporate <span className="text-purple-600">Clients</span>
          </h2>
          <div className="mx-auto mt-6 h-1 w-24 rounded-full bg-purple-500"></div>
        </div>
        <div className="flex h-32 items-center justify-center">
          <div className="text-gray-500">Loading corporate clients...</div>
        </div>
      </section>
    );
  }

  if (error || clients.length === 0) {
    return null; // Don't show the section if there are no clients
  }

  return (
    <section className="overflow-hidden py-2">
      <div className="mx-auto mb-12 max-w-7xl px-4 text-center">
        <h2 className="mb-4 text-4xl font-bold text-gray-800">
          Our Corporate <span className="text-purple-600">Clients</span>
        </h2>
        <p className="mx-auto max-w-3xl text-gray-600">
          We collaborate with top industry leaders to deliver the best travel
          solutions
        </p>
        <div className="mx-auto mt-6 h-1 w-24 rounded-full bg-purple-500"></div>
      </div>

      <div className="relative w-full overflow-hidden">
        {/* Marquee row */}
        <div className="flex">
          <div className="animate-marquee flex py-4 whitespace-nowrap">
            {[...clients, ...clients].map(
              (client: CorporateClient, index: number) => (
                <div
                  key={`client-${client._id}-${index}`}
                  className="mx-8 inline-flex h-20 w-48 flex-shrink-0 items-center justify-center transition-transform duration-300 hover:scale-105"
                >
                  <div className="relative h-full w-full">
                    <Image
                      src={
                        client.logo ||
                        "https://via.placeholder.com/200x100?text=Logo"
                      }
                      alt={client.name || "Client logo"}
                      fill
                      className="object-contain"
                      sizes="(max-width: 768px) 100px, 200px"
                    />
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        @keyframes marquee-reverse {
          0% {
            transform: translateX(-50%);
          }
          100% {
            transform: translateX(0%);
          }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
        .animate-marquee-reverse {
          animation: marquee-reverse 30s linear infinite;
        }
        @media (max-width: 768px) {
          .animate-marquee,
          .animate-marquee-reverse {
            animation-duration: 20s;
          }
        }
      `}</style>
    </section>
  );
};

export default PartnerSection;
