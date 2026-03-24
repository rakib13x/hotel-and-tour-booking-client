"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, Suspense } from "react";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

function BookingSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const bookingId = searchParams.get("bookingId");
  const transactionId = searchParams.get("transactionId");

  useEffect(() => {
    // Confetti effect or celebration animation can be added here
    }, [bookingId, transactionId]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <Card className="w-full max-w-lg border-t-4 border-green-500 shadow-xl">
        <CardContent className="p-8 text-center">
          <div className="mb-6 flex justify-center">
            <CheckCircle className="h-20 w-20 text-green-500" />
          </div>

          <h1 className="mb-3 text-3xl font-bold text-gray-800">
            Payment Successful! 🎉
          </h1>

          <p className="mb-6 text-lg text-gray-600">
            Your booking has been confirmed. We've sent a confirmation email to
            your inbox.
          </p>

          <div className="mb-8 space-y-3 rounded-lg bg-gray-50 p-6">
            <div className="flex justify-between border-b border-gray-200 pb-3">
              <span className="font-semibold text-gray-700">Booking ID:</span>
              <span className="font-mono text-sm text-gray-900">
                {bookingId || "N/A"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold text-gray-700">
                Transaction ID:
              </span>
              <span className="font-mono text-sm text-gray-900">
                {transactionId || "N/A"}
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <Button
              onClick={() => router.push("/")}
              className="w-full bg-blue-500 text-white hover:bg-blue-600"
            >
              Back to Home
            </Button>
            <Button
              onClick={() => router.push("/dashboard/user/bookings")}
              variant="outline"
              className="w-full"
            >
              View My Bookings
            </Button>
          </div>

          <p className="mt-6 text-sm text-gray-500">
            Need help? Contact our support team
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export default function BookingSuccessPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BookingSuccessContent />
    </Suspense>
  );
}

