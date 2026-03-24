"use client";
import React from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import countries from "@/data/countries.json";
import Breadcrumb from "@/components/home/sections/BreadCrumb";
import { toast } from "sonner";

interface CountryJsonData {
  id: number;
  countryName: { bn: string; en: string };
  visaTypes: {
    category: { bn: string; en: string };
    processingTypes: { bn: string; en: string }[];
  }[];
  processingFee: number;
  required_document: string;
}

const schema = z.object({
  country: z.string().nonempty("Country is required"),
  visa: z.string().nonempty("Visa type is required"),
  processingType: z.string().nonempty("Processing type is required"),
  email: z.string().email("Invalid email"),
  name: z.string().nonempty("Name is required"),
  phone: z.string().nonempty("Phone is required"),
  passport: z.string().nonempty("Passport number is required"),
});

type FormData = z.infer<typeof schema>;

const ApplicantDetails = () => {
  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      country: "",
      visa: "",
      processingType: "",
      email: "",
      name: "",
      phone: "",
      passport: "",
    },
  });

  const selectedCountry = watch("country");
  const selectedVisa = watch("visa");

  const currentCountry = countries.find(
    (c: CountryJsonData) =>
      c.countryName.en.toLowerCase() === selectedCountry.toLowerCase()
  );

  const currentVisa = currentCountry?.visaTypes.find(
    (visa) => visa.category.en.toLowerCase() === selectedVisa.toLowerCase()
  );

  const onSubmit = (data: FormData) => {
    toast.success("Form submitted successfully!"); // ✅ Sonner toast
    reset();
  };

  return (
    <>
      <Breadcrumb
        items={[{ label: "Home" }]}
        pageTitle="Applicant Details"
        backgroundImage="/path/to/your/bg.jpg"
      />
      <div className="max-w-2xl mx-auto p-4">
        <h1 className="text-center text-4xl font-bold mt-6">
          Applicant Details
        </h1>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col space-y-4 mt-6"
        >
          {/* Country Select */}
          <Controller
            name="country"
            control={control}
            render={({ field }) => (
              <div className="relative w-full md:w-auto">
                <select
                  {...field}
                  className="text-black px-6 py-3 text-xl text-center font-bold rounded border-3 border-black outline-none cursor-pointer appearance-none w-full"
                >
                  <option value="">Select Country</option>
                  {countries.map((c) => (
                    <option key={c.id} value={c.countryName.en}>
                      {c.countryName.en}
                    </option>
                  ))}
                </select>
                {errors.country && (
                  <p className="text-red-600 mt-1 text-sm">
                    {errors.country.message}
                  </p>
                )}
              </div>
            )}
          />

          {/* Visa Type Select */}
          <Controller
            name="visa"
            control={control}
            render={({ field }) => (
              <div className="relative w-full md:w-auto">
                <select
                  {...field}
                  disabled={!currentCountry}
                  className="text-black px-6 py-3 text-xl text-center font-bold rounded border-3 border-black outline-none cursor-pointer appearance-none w-full"
                >
                  <option value="">Select Visa Type</option>
                  {currentCountry?.visaTypes?.map((visa, idx) => (
                    <option key={idx} value={visa.category.en}>
                      {visa.category.en}
                    </option>
                  ))}
                </select>
                {errors.visa && (
                  <p className="text-red-600 mt-1 text-sm">
                    {errors.visa.message}
                  </p>
                )}
              </div>
            )}
          />

          {/* Processing Type Select */}
          <Controller
            name="processingType"
            control={control}
            render={({ field }) => (
              <div className="relative w-full md:w-auto">
                <select
                  {...field}
                  disabled={!currentVisa}
                  className="text-black px-6 py-3 text-xl text-center font-bold rounded border-3 border-black outline-none cursor-pointer appearance-none w-full"
                >
                  <option value="">Select Visa Processing Type</option>
                  {currentVisa?.processingTypes.map((type, idx) => (
                    <option key={idx} value={type.en}>
                      {type.en}
                    </option>
                  ))}
                </select>
                {errors.processingType && (
                  <p className="text-red-600 mt-1 text-sm">
                    {errors.processingType.message}
                  </p>
                )}
              </div>
            )}
          />

          {/* Email */}
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <div className="relative w-full md:w-auto">
                <input
                  {...field}
                  placeholder="Email"
                  className="text-black px-6 py-3 text-center text-xl font-bold rounded border-3 border-black outline-none cursor-pointer appearance-none w-full"
                />
                {errors.email && (
                  <p className="text-red-600 mt-1 text-sm">
                    {errors.email.message}
                  </p>
                )}
              </div>
            )}
          />

          {/* Name */}
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <div className="relative w-full md:w-auto">
                <input
                  {...field}
                  placeholder="Name"
                  className="text-black px-6 py-3 text-center text-xl font-bold rounded border-3 border-black outline-none cursor-pointer appearance-none w-full"
                />
                {errors.name && (
                  <p className="text-red-600 mt-1 text-sm">
                    {errors.name.message}
                  </p>
                )}
              </div>
            )}
          />

          {/* Phone */}
          <Controller
            name="phone"
            control={control}
            render={({ field }) => (
              <div className="relative w-full md:w-auto">
                <input
                  {...field}
                  placeholder="Phone No."
                  className="text-black px-6 py-3 text-center text-xl font-bold rounded border-3 border-black outline-none cursor-pointer appearance-none w-full"
                />
                {errors.phone && (
                  <p className="text-red-600 mt-1 text-sm">
                    {errors.phone.message}
                  </p>
                )}
              </div>
            )}
          />

          {/* Passport */}
          <Controller
            name="passport"
            control={control}
            render={({ field }) => (
              <div className="relative w-full md:w-auto">
                <input
                  {...field}
                  placeholder="Passport No."
                  className="text-black px-6 py-3 text-center text-xl font-bold rounded border-3 border-black outline-none cursor-pointer appearance-none w-full"
                />
                {errors.passport && (
                  <p className="text-red-600 mt-1 text-sm">
                    {errors.passport.message}
                  </p>
                )}
              </div>
            )}
          />

          {/* Submit Button */}
          <button
            type="submit"
            className="bg-purple-500 hover:bg-purple-600 px-8 py-3 rounded-lg text-xl font-bold text-white border-3 hover:text-black transition-all border-black disabled:opacity-50"
          >
            Submit
          </button>
        </form>
      </div>
    </>
  );
};

export default ApplicantDetails;
