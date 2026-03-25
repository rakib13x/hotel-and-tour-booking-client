"use client";
import CounterInput from "@/components/shared/CounterInput";
// import RadioGroup from "@/components/shared/RadioGroup";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { hajjUmrahSchema, HajjUmrahFormData } from "@/lib/validations/query";
import { useQuerySubmit } from "@/hooks/useQuery";
import { accommodationOptions, yesNoOptions } from "@/lib/optionsData";

export default function HajjUmrahForm() {
  const { loading, submitQuery } = useQuerySubmit();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<HajjUmrahFormData>({
    resolver: zodResolver(hajjUmrahSchema),
    defaultValues: {
      name: "",
      email: "",
      contactNumber: "",
      startingDate: "",
      returnDate: "",
      airlineTicketCategory: "",
      makkahNights: 0,
      madinaNights: 0,
      maleAdults: 0,
      femaleAdults: 0,
      children: 0,
      accommodationType: "",
      foodsIncluded: "",
      guideRequired: "",
      privateTransportation: "",
      specialRequirements: "",
    },
  });

  const formData = watch();

  const onSubmit = async (data: HajjUmrahFormData) => {
    try {
      await submitQuery(data, "hajj_umrah");
      reset();
    } catch (error) {
      }
  };

  return (
    <>
      <div className="lg:max-w-4xl md:max-w-2xl mx-auto p-2 rounded-md mb-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-purple-900 shadow-xl rounded-xl p-4 sm:p-6 lg:p-8 mt-8 sm:mt-12 lg:mt-24">
            <div className="mb-6 text-center">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">
                Hajj & Umrah Booking Form
              </h1>
              <p className="text-blue-100 text-sm sm:text-base">
                Fill out the details below to get your personalized quote
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
                {/* Basic Information */}
                <div className="px-3 mb-6">
                  <label className="block uppercase tracking-wider text-white text-xs sm:text-sm font-bold mb-2">
                    Name*
                  </label>
                  <input
                    type="text"
                    {...register("name")}
                    className="appearance-none block w-full bg-white text-gray-700 border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent"
                    placeholder="Enter your full name"
                  />
                  {errors.name && (
                    <p className="text-red-300 text-sm mt-1">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div className="px-3 mb-6">
                  <label className="block uppercase tracking-wider text-white text-xs sm:text-sm font-bold mb-2">
                    Email*
                  </label>
                  <input
                    type="email"
                    {...register("email")}
                    className="appearance-none block w-full bg-white text-gray-700 border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent"
                    placeholder="Enter your email"
                  />
                  {errors.email && (
                    <p className="text-red-300 text-sm mt-1">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div className="px-3 mb-6">
                  <label className="block uppercase tracking-wider text-white text-xs sm:text-sm font-bold mb-2">
                    Contact Number*
                  </label>
                  <input
                    type="tel"
                    {...register("contactNumber")}
                    className="appearance-none block w-full bg-white text-gray-700 border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent"
                    placeholder="Enter your phone number"
                  />
                  {errors.contactNumber && (
                    <p className="text-red-300 text-sm mt-1">
                      {errors.contactNumber.message}
                    </p>
                  )}
                </div>

                {/* Dates */}
                <div className="px-3 mb-6">
                  <label className="block uppercase tracking-wider text-white text-xs sm:text-sm font-bold mb-2">
                    Starting Date
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      {...register("startingDate")}
                      className="appearance-none bg-white border border-gray-300 text-gray-700 text-sm rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 block w-full px-4 py-2"
                    />
                  </div>
                  {errors.startingDate && (
                    <p className="text-red-300 text-sm mt-1">
                      {errors.startingDate.message}
                    </p>
                  )}
                </div>

                <div className="px-3 mb-6">
                  <label className="block uppercase tracking-wider text-white text-xs sm:text-sm font-bold mb-2">
                    Return Date
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      {...register("returnDate")}
                      className="bg-white border border-gray-300 text-gray-700 text-sm rounded-lg  focus:outline-none focus:ring-blue-500 focus:border-blue-500 block w-full px-4 py-2"
                    />
                  </div>
                  {errors.returnDate && (
                    <p className="text-red-300 text-sm mt-1">
                      {errors.returnDate.message}
                    </p>
                  )}
                </div>

                <div className="px-3 mb-6">
                  <label className="block uppercase tracking-wider text-white text-xs sm:text-sm font-bold mb-2">
                    Airline Ticket Category
                  </label>
                  <select
                    {...register("airlineTicketCategory")}
                    className="appearance-none block w-full bg-white text-gray-700 border border-gray-300 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent"
                  >
                    <option value="">Select an option</option>
                    <option value="economy">Economy</option>
                    <option value="business">Business</option>
                    <option value="first-class">First Class</option>
                  </select>
                  {errors.airlineTicketCategory && (
                    <p className="text-red-300 text-sm mt-1">
                      {errors.airlineTicketCategory.message}
                    </p>
                  )}
                </div>

                {/* Counter Fields */}
                <CounterInput
                  label="Nights Stay in Makkah"
                  field="makkahNights"
                  value={formData.makkahNights}
                  onChange={(newValue) => setValue("makkahNights", newValue)}
                />
                {errors.makkahNights && (
                  <div className="px-3 -mt-4 mb-2">
                    <p className="text-red-300 text-sm">
                      {errors.makkahNights.message}
                    </p>
                  </div>
                )}

                <CounterInput
                  label="Nights Stay in Madina"
                  field="madinaNights"
                  value={formData.madinaNights}
                  onChange={(newValue) => setValue("madinaNights", newValue)}
                />
                {errors.madinaNights && (
                  <div className="px-3 -mt-4 mb-2">
                    <p className="text-red-300 text-sm">
                      {errors.madinaNights.message}
                    </p>
                  </div>
                )}

                <CounterInput
                  label="How Many Male Adult(s)"
                  field="maleAdults"
                  value={formData.maleAdults}
                  onChange={(newValue) => setValue("maleAdults", newValue)}
                />
                {errors.maleAdults && (
                  <div className="px-3 -mt-4 mb-2">
                    <p className="text-red-300 text-sm">
                      {errors.maleAdults.message}
                    </p>
                  </div>
                )}

                <CounterInput
                  label="How Many Female Adult(s)"
                  field="femaleAdults"
                  value={formData.femaleAdults}
                  onChange={(newValue) => setValue("femaleAdults", newValue)}
                />
                {errors.femaleAdults && (
                  <div className="px-3 -mt-4 mb-2">
                    <p className="text-red-300 text-sm">
                      {errors.femaleAdults.message}
                    </p>
                  </div>
                )}

                <CounterInput
                  label="How Many Child(s)"
                  field="children"
                  value={formData.children}
                  onChange={(newValue) => setValue("children", newValue)}
                />
                {errors.children && (
                  <div className="px-3 -mt-4 mb-2">
                    <p className="text-red-300 text-sm">
                      {errors.children.message}
                    </p>
                  </div>
                )}

                {/* Radio Groups - Inline without RadioGroup component */}
                <div className="md:col-span-2 xl:col-span-3">
                  <div className="px-3 mb-6">
                    <label className="block uppercase tracking-wider text-white text-xs sm:text-sm font-bold mb-3">
                      Accommodation Type
                    </label>
                    <div className="flex item-center justify-start gap-5">
                      {accommodationOptions.map((option) => (
                        <label
                          key={option.value}
                          className="flex item-center justify-center bg-opacity-10 cursor-pointer hover:bg-opacity-20 transition-colors"
                        >
                          <input
                            type="radio"
                            {...register("accommodationType")}
                            value={option.value}
                            className="mr-2 mt-0.5 h-4 w-4 text-purple-500 focus:ring-purple-300 border-gray-300"
                          />
                          <span className="text-white text-sm">
                            {option.label}
                          </span>
                        </label>
                      ))}
                    </div>
                    {errors.accommodationType && (
                      <p className="text-red-300 text-sm mt-1">
                        {errors.accommodationType.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="px-3 mb-6">
                  <label className="block uppercase tracking-wider text-white text-xs sm:text-sm font-bold mb-3">
                    Foods Included
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {yesNoOptions.map((option) => (
                      <label
                        key={option.value}
                        className="flex items-center bg-opacity-10 cursor-pointer hover:bg-opacity-20 transition-colors"
                      >
                        <input
                          type="radio"
                          {...register("foodsIncluded")}
                          value={option.value}
                          className="mr-3 h-4 w-4 text-purple-500 focus:ring-purple-300 border-gray-300"
                        />
                        <span className="text-white text-sm">
                          {option.label}
                        </span>
                      </label>
                    ))}
                  </div>
                  {errors.foodsIncluded && (
                    <p className="text-red-300 text-sm mt-1">
                      {errors.foodsIncluded.message}
                    </p>
                  )}
                </div>

                <div className="px-3 mb-6">
                  <label className="block uppercase tracking-wider text-white text-xs sm:text-sm font-bold mb-3">
                    Guide Required
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {yesNoOptions.map((option) => (
                      <label
                        key={option.value}
                        className="flex items-center  bg-opacity-10  cursor-pointer hover:bg-opacity-20 transition-colors"
                      >
                        <input
                          type="radio"
                          {...register("guideRequired")}
                          value={option.value}
                          className="mr-3 h-4 w-4 text-purple-500 focus:ring-purple-300 border-gray-300"
                        />
                        <span className="text-white text-sm">
                          {option.label}
                        </span>
                      </label>
                    ))}
                  </div>
                  {errors.guideRequired && (
                    <p className="text-red-300 text-sm mt-1">
                      {errors.guideRequired.message}
                    </p>
                  )}
                </div>

                <div className="px-3 mb-6">
                  <label className="block uppercase tracking-wider text-white text-xs sm:text-sm font-bold mb-3">
                    Private Transportation
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {yesNoOptions.map((option) => (
                      <label
                        key={option.value}
                        className="flex items-center  bg-opacity-10  cursor-pointer hover:bg-opacity-20 transition-colors"
                      >
                        <input
                          type="radio"
                          {...register("privateTransportation")}
                          value={option.value}
                          className="mr-3 h-4 w-4 text-purple-500 focus:ring-purple-300 border-gray-300"
                        />
                        <span className="text-white text-sm">
                          {option.label}
                        </span>
                      </label>
                    ))}
                  </div>
                  {errors.privateTransportation && (
                    <p className="text-red-300 text-sm mt-1">
                      {errors.privateTransportation.message}
                    </p>
                  )}
                </div>

                {/* Special Requirements */}
                <div className="md:col-span-2 xl:col-span-3 px-3 mb-6">
                  <label className="block uppercase tracking-wider text-white text-xs sm:text-sm font-bold mb-2">
                    Any other special requirements
                  </label>
                  <textarea
                    rows={8}
                    {...register("specialRequirements")}
                    className="bg-white border border-gray-300 text-gray-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-4 resize-none focus:outline-none focus:ring-2 placeholder:text-lg"
                    placeholder="Please specify your requirements..."
                  />
                  {errors.specialRequirements && (
                    <p className="text-red-300 text-sm mt-1">
                      {errors.specialRequirements.message}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <div className="md:col-span-2 xl:col-span-3 px-3 mt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full sm:w-auto bg-purple-500 hover:bg-purple-600  text-white font-bold py-4 px-8 rounded-lg shadow-lg transform transition-all duration-200 hover:scale-105 focus:outline-none  disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? "Submitting..." : "Send Query"}
                  </button>
                  {/* <p className="text-blue-100 text-xs sm:text-sm mt-2">
                    We&apos;ll get back to you within 24 hours with a detailed
                    quote
                  </p> */}
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
