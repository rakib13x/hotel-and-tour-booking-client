import "@/styles/gallery.css";
import Image from "next/image";

export interface GalleryItem {
  id: number;
  count: number;
  image: string;
  title: string;
  description: string;
  link: string;
}

export default function GalleryCard({
  image,
  title,
  description,
  link: _link,
}: Omit<GalleryItem, "id">) {
  return (
    <div className="gallery-card relative transform rounded-lg border bg-white shadow-md transition duration-500 hover:scale-105 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800">
      {/* Image Container - Fixed Height */}
      <div className="gallery-card-image relative w-full overflow-hidden">
        <Image
          className="h-full w-full object-cover transition-transform duration-300 hover:scale-110"
          src={image}
          alt={title}
          loading="lazy"
          width={300}
          height={192}
          onError={(e) => {
            // Replace with placeholder image
            (e.target as HTMLImageElement).src =
              "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjE5MiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk0YTNiOCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlPC90ZXh0Pjwvc3ZnPg==";
          }}
        />
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity duration-300 hover:opacity-100" />
      </div>

      {/* Content Container - Flexible Height */}
      <div className="gallery-card-content p-4">
        <div className="flex-1">
          <h5 className="gallery-card-title mb-2 text-center text-lg font-semibold text-gray-900 dark:text-white">
            {title}
          </h5>
          {description && (
            <p className="gallery-card-description text-center text-sm text-gray-600 dark:text-gray-400">
              {description}
            </p>
          )}
        </div>

        {/* Optional: Add a subtle border at bottom */}
        <div className="mt-3 border-t border-gray-100 pt-2 dark:border-gray-700">
          <div className="flex items-center justify-center">
            <span className="text-xs text-gray-500 dark:text-gray-400">
              Click to explore
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
