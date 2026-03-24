"use client";

import { TeamMember } from "@/types/team";
import { motion } from "framer-motion";
import Image from "next/image";
import React from "react";

interface TeamSectionProps {
  teamMembers: TeamMember[];
  isLoading?: boolean;
  error?: any;
}

const TeamSection: React.FC<TeamSectionProps> = ({
  teamMembers,
  isLoading = false,
  error,
}): React.ReactElement => {
  const [isPaused, setIsPaused] = React.useState(false);

  const transformMemberForDisplay = (member: TeamMember) => ({
    id: member._id || "",
    name: member.name || "Team Member",
    role: member.designation || "Staff",
    imageUrl:
      member.image || "https://via.placeholder.com/400x400?text=Team+Member",
  });

  const displayTeam = (teamMembers || []).map(transformMemberForDisplay);

  // Loading state
  if (isLoading) {
    return (
      <section className="relative overflow-hidden py-2">
        <div className="relative z-10 mx-auto max-w-7xl px-4 text-center sm:px-6">
          <h2 className="mb-10 text-4xl font-bold text-gray-800 md:text-5xl lg:text-4xl">
            Meet the <span className="bg-clip-text text-purple-600">Team</span>
          </h2>
          <div className="flex items-center justify-center py-12">
            <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-purple-600"></div>
            <span className="ml-4 text-lg text-gray-600">
              Loading team members...
            </span>
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section className="relative overflow-hidden py-2">
        <div className="relative z-10 mx-auto max-w-7xl px-4 text-center sm:px-6">
          <h2 className="mb-10 text-4xl font-bold text-gray-800 md:text-5xl lg:text-4xl">
            Meet the <span className="bg-clip-text text-purple-600">Team</span>
          </h2>
          <p className="text-center text-lg text-red-500">
            Failed to load team members 😢
            <br />
            Please try again later!
          </p>
        </div>
      </section>
    );
  }

  // Empty state
  if (displayTeam.length === 0) {
    return (
      <section className="relative overflow-hidden py-2">
        <div className="relative z-10 mx-auto max-w-7xl px-4 text-center sm:px-6">
          <h2 className="mb-10 text-4xl font-bold text-gray-800 md:text-5xl lg:text-4xl">
            Meet the <span className="bg-clip-text text-purple-600">Team</span>
          </h2>
          <p className="text-center text-lg text-gray-500">
            Oops! No team members found 😢
            <br />
            Please check back later!
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="relative overflow-hidden py-2">
      <div className="relative z-10 mx-auto max-w-7xl px-4 text-center sm:px-6">
        <h2 className="mb-10 text-4xl font-bold text-gray-800 md:text-5xl lg:text-4xl">
          Meet the <span className="bg-clip-text text-purple-600">Team</span>
        </h2>

        {/* Highlighted Members */}
        <div className="mb-16 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {displayTeam.slice(0, 2).map((member, _i) => (
            <div
              key={member.id}
              className="group relative overflow-hidden rounded-2xl border border-purple-100 bg-gradient-to-br from-purple-50 via-white to-blue-50 shadow-md transition-all duration-500 hover:border-purple-300 hover:shadow-xl"
            >
              <div className="flex flex-col items-center gap-6 p-6 sm:flex-row sm:items-center sm:gap-8">
                {/* Image Container */}
                <div className="relative h-40 w-40 flex-shrink-0 overflow-hidden rounded-full border-4 border-purple-100 shadow-lg transition-all duration-500 group-hover:border-purple-300 sm:h-44 sm:w-44">
                  <Image
                    src={member.imageUrl}
                    alt={member.name}
                    fill
                    sizes="(max-width: 640px) 160px, 176px"
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  {/* Purple overlay on hover */}
                  <div className="absolute inset-0 bg-purple-600/0 transition-all duration-500 group-hover:bg-purple-600/10"></div>
                </div>

                {/* Content Container */}
                <div className="relative flex flex-1 flex-col justify-center text-center sm:text-left">
                  {/* Decorative corner element */}
                  <div className="absolute top-4 right-4 h-12 w-12 rounded-full bg-purple-50 opacity-50 transition-all duration-500 group-hover:scale-150 group-hover:opacity-100"></div>

                  <div className="relative z-10">
                    <h3 className="mb-3 text-2xl font-bold text-gray-800 transition-colors duration-300 group-hover:text-purple-600">
                      {member.name}
                    </h3>

                    <div className="mb-4 inline-block">
                      <p className="text-sm font-medium tracking-wide text-purple-600 uppercase">
                        {member.role}
                      </p>
                      <div className="mt-1.5 h-0.5 w-full bg-gradient-to-r from-purple-600 to-transparent"></div>
                    </div>

                    {/* Decorative quote or accent */}
                    <div className="flex items-center gap-2 text-gray-400">
                      <div className="h-px flex-1 bg-gray-200"></div>
                      <span className="text-xs">Team Member</span>
                      <div className="h-px flex-1 bg-gray-200"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Marquee for other members */}
        {displayTeam.length > 2 && (
          <div className="relative overflow-hidden py-6">
            <motion.div
              className="flex gap-6"
              animate={isPaused ? {} : { x: ["0%", "-50%"] }}
              transition={{ repeat: Infinity, duration: 40, ease: "linear" }}
            >
              {[...displayTeam.slice(2), ...displayTeam.slice(2)].map(
                (member, i) => (
                  <div
                    key={`${member.id}-${i}`}
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                    className="xs:w-56 group flex w-72 flex-shrink-0 flex-col items-center justify-center rounded-2xl border border-purple-100 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-4 shadow-lg transition-all duration-500 hover:border-purple-300 hover:shadow-xl sm:w-64 sm:p-6 md:w-72 lg:w-72"
                  >
                    <div className="xs:w-28 xs:h-28 relative mb-4 h-36 w-36 overflow-hidden rounded-full border-2 border-white shadow-lg sm:h-32 sm:w-32">
                      <Image
                        src={member.imageUrl}
                        alt={member.name}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    </div>
                    <h3 className="mb-1 text-lg font-bold text-gray-800 sm:text-base">
                      {member.name}
                    </h3>
                    <p className="text-sm font-medium text-purple-600">
                      {member.role}
                    </p>
                  </div>
                )
              )}
            </motion.div>

            {/* Gradient fades */}
            <div className="absolute top-0 left-0 z-20 h-full w-16 bg-gradient-to-r from-purple-50/90 to-transparent sm:w-12"></div>
            <div className="absolute top-0 right-0 z-20 h-full w-16 bg-gradient-to-l from-purple-50/90 to-transparent sm:w-12"></div>
          </div>
        )}
      </div>
    </section>
  );
};

export default TeamSection;
