"use client";
import CustomCheckbox from "@/components/CustomFormComponents/CustomCheckbox";
import CustomFileUploader from "@/components/CustomFormComponents/CustomFileUploader";
import CustomForm from "@/components/CustomFormComponents/CustomForm";
import CustomInput from "@/components/CustomFormComponents/CustomInput";
import CustomSelect from "@/components/CustomFormComponents/CustomSelect";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import React from "react";
import ItineraryEditor from "./ItineraryEditor";

export default function EditTourForm(): React.ReactElement {
  return (
    <CustomForm
      onSubmit={() => {}}
      className="grid grid-cols-1 gap-4 md:grid-cols-2"
      defaultValues={{}}
    >
      {/* Basic Info */}
      <div className="col-span-1">
        <CustomInput
          name="code"
          label="Tour Code"
          required
          placeholder="e.g., TOUR-001"
        />
      </div>
      <div className="col-span-1">
        <CustomInput
          name="title"
          label="Title"
          required
          placeholder="Tour title"
        />
      </div>
      <div className="col-span-1">
        <CustomSelect
          name="destination"
          label="Destination Country"
          options={[]}
          required
          disabled={false}
          placeholder="Select a country"
        />
      </div>

      {/* Duration */}
      <div className="col-span-1">
        <CustomInput
          type="number"
          name="days"
          label="Duration (Days)"
          required
          placeholder="10"
        />
      </div>
      <div className="col-span-1">
        <CustomInput
          type="number"
          name="nights"
          label="Duration (Nights)"
          required
          placeholder="9"
        />
      </div>

      {/* Category and Status */}
      <div className="col-span-1">
        <CustomSelect
          name="category"
          label="Tour Category *"
          options={[]}
          required
          disabled={false}
          placeholder="Select a category"
        />
      </div>
      <div className="col-span-1">
        <CustomSelect
          name="status"
          label="Status"
          options={[
            { label: "Draft", value: "DRAFT" },
            { label: "Published", value: "PUBLISHED" },
            { label: "Archived", value: "ARCHIVED" },
          ]}
          required
        />
      </div>

      {/* Tags and Highlights */}
      <div className="col-span-1">
        <CustomInput
          name="tags"
          label="Tags"
          placeholder="Adventure, Trekking, Himalayas"
        />
        <p className="mt-1 text-xs text-gray-500">Separate with comma (,)</p>
      </div>
      <div className="col-span-1">
        <CustomInput
          name="highlights"
          label="Highlights"
          placeholder="Mountain views, Local culture, Adventure activities"
        />
        <p className="mt-1 text-xs text-gray-500">Separate with comma (,)</p>
      </div>

      {/* Inclusion and Exclusion */}
      <div className="col-span-1">
        <CustomInput
          name="inclusion"
          label="Inclusion"
          placeholder="Accommodation, Meals, Transportation"
        />
        <p className="mt-1 text-xs text-gray-500">Separate with comma (,)</p>
      </div>
      <div className="col-span-1">
        <CustomInput
          name="exclusion"
          label="Exclusion"
          placeholder="Personal expenses, Insurance, Tips"
        />
        <p className="mt-1 text-xs text-gray-500">Separate with comma (,)</p>
      </div>

      <Separator className="col-span-1 mt-4 md:col-span-2" />

      {/* Pricing */}
      <div className="col-span-1 md:col-span-2">
        <h2 className="mb-4 text-xl font-bold">Pricing</h2>
      </div>
      <div className="col-span-1">
        <CustomInput
          type="number"
          name="basePrice"
          label="Base Price"
          required
          placeholder="50000"
        />
      </div>

      {/* Offer (Optional) */}
      <div className="col-span-1 md:col-span-2">
        <Separator className="my-4" />
        <h3 className="mb-3 text-lg font-semibold">Offer (Optional)</h3>
      </div>
      <div className="col-span-1">
        <CustomCheckbox name="offerActive" label="Enable Offer" />
      </div>
      <div className="col-span-1">
        <CustomSelect
          name="offerDiscountType"
          label="Discount Type"
          options={[
            { label: "Flat Amount", value: "flat" },
            { label: "Percentage", value: "percentage" },
          ]}
        />
      </div>
      <div className="col-span-1">
        <CustomInput
          type="number"
          name="offerFlatDiscount"
          label="Flat Discount Amount"
          placeholder="5000"
        />
        <p className="mt-1 text-xs text-gray-500">
          Used when Discount Type is &quot;Flat Amount&quot;
        </p>
      </div>
      <div className="col-span-1">
        <CustomInput
          type="number"
          name="offerDiscountPercentage"
          label="Discount Percentage"
          placeholder="20"
        />
        <p className="mt-1 text-xs text-gray-500">
          Used when Discount Type is &quot;Percentage&quot; (0-100)
        </p>
      </div>
      <div className="col-span-1 md:col-span-2">
        <CustomInput
          name="offerLabel"
          label="Offer Label"
          placeholder="e.g., Eid Special, Flash Sale"
        />
      </div>

      <Separator className="col-span-1 mt-4 md:col-span-2" />

      {/* Additional Details */}
      <div className="col-span-1 md:col-span-2">
        <h2 className="mb-4 text-xl font-bold">Additional Details</h2>
      </div>
      <div className="col-span-1 md:col-span-2">
        <CustomInput
          name="visaRequirements"
          label="Visa Requirements (Optional)"
          placeholder="Visa requirements and documentation needed"
        />
      </div>
      <div className="col-span-1 md:col-span-2">
        <CustomInput
          name="terms"
          label="Terms & Conditions (Optional)"
          placeholder="Terms and conditions for this tour"
        />
      </div>
      <div className="col-span-1 md:col-span-2">
        <CustomInput
          name="otherDetails"
          label="Other Details (Optional)"
          placeholder="Any other important details"
        />
      </div>

      <Separator className="col-span-1 mt-4 md:col-span-2" />

      {/* Itinerary Editor */}
      <ItineraryEditor itinerary={[]} onChange={() => {}} />

      <Separator className="col-span-1 mt-4 md:col-span-2" />

      {/* File Upload */}
      <div className="col-span-1 md:col-span-2">
        <h2 className="mb-4 text-xl font-bold">Images</h2>
      </div>
      <div className="col-span-1">
        <CustomFileUploader
          name="coverImage"
          label="Cover Image"
          accept={{ "image/*": [] }}
        />
      </div>
      <div className="col-span-1">
        <CustomFileUploader
          name="galleryImages"
          label="Gallery Images"
          multiple
          accept={{ "image/*": [] }}
        />
      </div>

      <div className="col-span-1 md:col-span-2">
        <Button type="submit" className="w-full">
          Update Tour
        </Button>
      </div>
    </CustomForm>
  );
}
