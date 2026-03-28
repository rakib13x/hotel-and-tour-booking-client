"use client";

import CustomFileUploader from "@/components/CustomFormComponents/CustomFileUploader";
import CustomForm from "@/components/CustomFormComponents/CustomForm";
import CustomInput from "@/components/CustomFormComponents/CustomInput";
import CustomTextarea from "@/components/CustomFormComponents/CustomTextarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  useCreateBannerMutation,
  useUpdateBannerMutation,
} from "@/redux/api/features/banner/bannerApi";
import { IBanner } from "@/types/schemas";
import { Loader2, Save, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "sonner";

// Form data type
type BannerFormData = {
  title: string;
  description: string;
  backgroundImage: File | null;
};

interface BannerFormProps {
  banner?: IBanner | undefined;
  onCancel: () => void;
}

export default function BannerForm({ banner, onCancel }: BannerFormProps) {
  const [existingImage, setExistingImage] = useState<string | null>(null);

  // RTK Query mutations
  const [createBanner, { isLoading: isCreating }] = useCreateBannerMutation();
  const [updateBanner, { isLoading: isUpdating }] = useUpdateBannerMutation();

  const isLoading = isCreating || isUpdating;

  // Initialize existing image when editing
  useEffect(() => {
    if (banner?.backgroundImage) {
      setExistingImage(banner.backgroundImage);
    }
  }, [banner]);

  // Handle form submission
  const handleSubmit = async (data: BannerFormData) => {
    // Enhanced validation
    if (!data.title.trim()) {
      toast.error("Please enter a banner title");
      return;
    }

    if (!data.description.trim()) {
      toast.error("Please enter a banner description");
      return;
    }

    if (!data.backgroundImage && !existingImage) {
      toast.error("Please select a background image");
      return;
    }

    // Validate title length
    if (data.title.trim().length < 3) {
      toast.error("Title must be at least 3 characters long");
      return;
    }

    if (data.title.trim().length > 100) {
      toast.error("Title must be less than 100 characters");
      return;
    }

    // Validate description length
    if (data.description.trim().length < 10) {
      toast.error("Description must be at least 10 characters long");
      return;
    }

    if (data.description.trim().length > 500) {
      toast.error("Description must be less than 500 characters");
      return;
    }

    try {
      const bannerData = {
        title: data.title.trim(),
        description: data.description.trim(),
        backgroundImage: existingImage || "", // Use existing image or empty string
      };

      if (banner) {
        // Update existing banner
        await updateBanner({
          id: banner._id!,
          bannerData,
          ...(data.backgroundImage && {
            imageFile: data.backgroundImage,
          }),
        }).unwrap();
        toast.success("Banner updated successfully");
      } else {
        // Create new banner
        await createBanner({
          bannerData,
          ...(data.backgroundImage && {
            imageFile: data.backgroundImage,
          }),
        }).unwrap();
        toast.success("Banner created successfully");
      }

      onCancel();
    } catch {
      toast.error(
        banner ? "Failed to update banner" : "Failed to create banner"
      );
    }
  };

  // Default values for form
  const defaultValues: BannerFormData = {
    title: banner?.title || "",
    description: banner?.description || "",
    backgroundImage: null,
  };

  return (
    <CustomForm
      onSubmit={handleSubmit}
      defaultValues={defaultValues}
      className="w-full space-y-6 rounded-xl bg-gray-50 p-6 shadow-lg md:p-10"
    >
      {/* Title Field */}
      <div className="space-y-2">
        <CustomInput
          name="title"
          label="Banner Title *"
          placeholder="Enter banner title (3-100 characters)"
          required
        />
        <p className="text-xs text-gray-500">
          Title should be between 3-100 characters
        </p>
      </div>

      {/* Description Field */}
      <div className="space-y-2">
        <CustomTextarea
          name="description"
          label="Banner Description *"
          placeholder="Enter banner description (10-500 characters)"
          rows={4}
          required
        />
        <p className="text-xs text-gray-500">
          Description should be between 10-500 characters
        </p>
      </div>

      {/* Background Image */}
      <div className="space-y-2">
        <CustomFileUploader
          name="backgroundImage"
          label="Background Image *"
          multiple={false}
          accept={{
            "image/*": [".jpeg", ".jpg", ".png", ".webp", ".gif"],
          }}
          required={!existingImage}
        />
        <p className="text-xs text-gray-500">
          {existingImage
            ? "Upload a new image to replace the current one"
            : "Please select a background image"}
        </p>
      </div>

      {/* Existing Image Display */}
      {existingImage && (
        <div className="space-y-2">
          <Label className="text-sm font-medium">Current Image</Label>
          <div className="group relative inline-block">
            <Image
              src={existingImage}
              alt="Existing image"
              width={200}
              height={150}
              className="h-32 w-48 rounded-lg object-cover"
            />
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="absolute top-2 right-2 opacity-0 transition-opacity group-hover:opacity-100"
              onClick={() => setExistingImage(null)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-end space-x-3 pt-6">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {banner ? "Updating..." : "Creating..."}
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              {banner ? "Update Banner" : "Create Banner"}
            </>
          )}
        </Button>
      </div>
    </CustomForm>
  );
}
