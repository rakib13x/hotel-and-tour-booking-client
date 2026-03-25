import React from "react";

interface HeadingSectionProps {
  badgeText?: string;
  badgeIcon?: React.ReactNode;
  title: string;
  subtitle: string;
}

const HeadingSection: React.FC<HeadingSectionProps> = ({
  badgeText,
  badgeIcon,
  title,
  subtitle,
}) => {
  return (
    <div className="text-center mb-8 sm:mb-12 lg:mb-16">
      {badgeText && (
        <div className="inline-flex items-center px-3 py-2 sm:px-4 bg-orange-100 rounded-full mb-4 sm:mb-6">
          <span className="text-orange-600 text-xs sm:text-sm font-semibold tracking-wider uppercase flex items-center gap-1">
            {badgeIcon && <span>{badgeIcon}</span>}
            {badgeText}
          </span>
        </div>
      )}

      <h2 className="text-2xl sm:text-3xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent mb-3 sm:mb-4">
        {title}
      </h2>

      <p className="text-gray-600 text-sm sm:text-base lg:text-lg max-w-2xl mx-auto leading-relaxed px-2">
        {subtitle}
      </p>
    </div>
  );
};

export default HeadingSection;
