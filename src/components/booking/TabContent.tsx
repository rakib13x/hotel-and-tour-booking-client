import { Card, CardContent } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { TabsContent } from "@/components/ui/tabs";
import { TravelPackage } from "@/lib/packageData";
import {
  Calendar,
  Car,
  Check,
  ChevronDown,
  Clock,
  Hotel,
  Utensils,
  X,
} from "lucide-react";
import React from "react";

interface TabContentProps {
  activeTab: string;
  packageData: TravelPackage;
}

export const TabContent: React.FC<TabContentProps> = ({
  activeTab,
  packageData,
}) => {
  const renderItineraryContent = () => (
    <div className="space-y-3 sm:space-y-4">
      <div className="rounded-lg bg-gray-100 p-3 sm:p-4">
        <h3 className="text-sm font-semibold text-blue-600 sm:text-base md:text-lg">
          Please see below details:-
        </h3>
      </div>
      {packageData.itinerary.map((day, index) => (
        <Collapsible key={index} className="rounded-lg border">
          <CollapsibleTrigger className="flex w-full items-center justify-between p-3 hover:bg-gray-50 sm:p-4">
            <div className="flex flex-col gap-1">
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <span className="rounded-full bg-blue-500 px-2 py-0.5 text-xs font-semibold whitespace-nowrap text-white sm:px-3 sm:py-1 sm:text-sm">
                  Day {day.day}
                </span>
                <span className="text-sm font-medium sm:text-base">
                  {day.location}
                </span>
              </div>
              {day.title && (
                <span className="text-xs text-gray-600 sm:ml-16 sm:text-sm">
                  {day.title}
                </span>
              )}
            </div>
            <ChevronDown className="ml-2 h-4 w-4 flex-shrink-0" />
          </CollapsibleTrigger>
          <CollapsibleContent className="px-3 pb-3 sm:px-4 sm:pb-4">
            <div className="space-y-3 sm:space-y-4">
              {/* Time Range */}
              {(day.timeFrom || day.timeTo) && (
                <div className="rounded-lg bg-blue-50 p-2 sm:p-3">
                  <div className="flex items-center gap-2 text-xs text-blue-700 sm:text-sm">
                    <Clock className="h-3.5 w-3.5 flex-shrink-0 sm:h-4 sm:w-4" />
                    <span className="font-medium">
                      {day.timeFrom && day.timeTo
                        ? `${day.timeFrom} - ${day.timeTo}`
                        : day.timeFrom
                          ? `From ${day.timeFrom}`
                          : `Until ${day.timeTo}`}
                    </span>
                  </div>
                </div>
              )}

              {/* Description */}
              {day.description && (
                <div className="rounded-lg bg-gray-50 p-2 sm:p-3">
                  <p className="text-xs leading-relaxed text-gray-700 sm:text-sm">
                    {day.description}
                  </p>
                </div>
              )}

              <div>
                <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold sm:text-base">
                  <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  Activities
                </h4>
                <ul className="list-inside list-disc space-y-1 text-xs text-gray-600 sm:text-sm">
                  {day.activities.map((activity, idx) => (
                    <li key={idx}>{activity}</li>
                  ))}
                </ul>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-3">
                <div>
                  <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold sm:text-base">
                    <Hotel className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    Accommodation
                  </h4>
                  <p className="text-xs text-gray-600 sm:text-sm">
                    {day.accommodation || "Not specified"}
                  </p>
                </div>
                <div>
                  <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold sm:text-base">
                    <Utensils className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    Meals
                  </h4>
                  <p className="text-xs text-gray-600 sm:text-sm">
                    {day.meals.length > 0
                      ? day.meals.join(", ")
                      : "Not included"}
                  </p>
                </div>
                <div>
                  <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold sm:text-base">
                    <Car className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    Transportation
                  </h4>
                  <p className="text-xs text-gray-600 sm:text-sm">
                    {day.transportation}
                  </p>
                </div>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      ))}
    </div>
  );

  const renderInclusionExclusionContent = () => (
    <div className="space-y-4 sm:space-y-6">
      <div className="rounded-lg bg-gray-100 p-3 sm:p-4">
        <h3 className="text-sm font-semibold text-blue-600 sm:text-base md:text-lg">
          Please see below details:-
        </h3>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
        <Card>
          <CardContent className="p-4 sm:p-6">
            <h4 className="mb-3 flex items-center text-base font-semibold text-green-700 sm:text-lg md:text-xl">
              <Check className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
              Inclusion:
            </h4>
            <ul className="space-y-2">
              {packageData.inclusions.map((item, index) => (
                <li key={index} className="flex items-start gap-2">
                  <Check className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-green-500 sm:h-4 sm:w-4" />
                  <span className="text-xs sm:text-sm">{item}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 sm:p-6">
            <h4 className="mb-3 flex items-center text-base font-semibold text-red-700 sm:text-lg md:text-xl">
              <X className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
              Exclusion:
            </h4>
            <ul className="space-y-2">
              {packageData.exclusions.map((item, index) => (
                <li key={index} className="flex items-start gap-2">
                  <X className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-red-500 sm:h-4 sm:w-4" />
                  <span className="text-xs sm:text-sm">{item}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderTermsContent = () => (
    <div className="space-y-4 sm:space-y-6">
      <div className="rounded-lg bg-gray-100 p-3 sm:p-4">
        <h3 className="text-sm font-semibold text-blue-600 sm:text-base md:text-lg">
          Please see below details:-
        </h3>
      </div>
      <div className="rounded-lg border bg-white p-3 sm:p-4">
        <ul className="space-y-2 sm:space-y-3">
          {packageData.terms.map((term, index) => (
            <li key={index} className="text-xs text-gray-700 sm:text-sm">
              {term}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );

  const renderOtherDetailsContent = () => (
    <div className="space-y-4 sm:space-y-6">
      <div className="rounded-lg bg-gray-100 p-3 sm:p-4">
        <h3 className="text-sm font-semibold text-blue-600 sm:text-base md:text-lg">
          Please see below details:-
        </h3>
      </div>
      <div className="rounded-lg border bg-white p-3 sm:p-4">
        <p className="text-xs text-gray-700 sm:text-sm">
          {packageData.otherDetails.transportation.join(", ")}
        </p>
      </div>
    </div>
  );

  const renderVisaContent = () => (
    <div className="space-y-4 sm:space-y-6">
      <div className="rounded-lg bg-gray-100 p-3 sm:p-4">
        <h3 className="text-sm font-semibold text-blue-600 sm:text-base md:text-lg">
          Please see below details:-
        </h3>
      </div>
      <div className="rounded-lg border bg-white p-3 sm:p-4">
        <div className="px-4 py-8 text-center sm:py-12">
          <div className="mb-3 text-4xl sm:mb-4 sm:text-5xl md:text-6xl">
            ✅
          </div>
          <h3 className="mb-2 text-lg font-semibold sm:text-xl">
            No Visa Required
          </h3>
          <p className="text-sm text-gray-600 sm:text-base">
            You can travel to {packageData.country} without a visa. Just bring
            your valid passport!
          </p>
        </div>
      </div>
    </div>
  );

  const getContent = () => {
    switch (activeTab) {
      case "itinerary":
        return renderItineraryContent();
      case "inclusion":
        return renderInclusionExclusionContent();
      case "terms":
        return renderTermsContent();
      case "details":
        return renderOtherDetailsContent();
      case "visa":
        return renderVisaContent();
      default:
        return null;
    }
  };

  return (
    <TabsContent value={activeTab} className="p-3 sm:p-4 md:p-6">
      {getContent()}
    </TabsContent>
  );
};
