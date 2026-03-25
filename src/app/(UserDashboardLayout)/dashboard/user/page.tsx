"use client";

import PageHeader from "@/components/admin/PageHeader";
import StatsCard from "@/components/admin/StatsCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useGetMyBookingsQuery } from "@/redux/api/features/booking/bookingApi";
import { useGetMyQueriesQuery } from "@/redux/api/features/queries/queriesApi";
import { useGetMyVisaBookingQueriesQuery } from "@/redux/api/features/visaBookingQuery/visaBookingQueryApi";
import { useGetUserDashboardStatsQuery } from "@/redux/api/features/dashboard/dashboardApi";
import { useCurrentUser } from "@/redux/authSlice";
import {
  FileText,
  Loader2,
  MessageSquare,
  Package,
  Plane,
  User,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState, useEffect } from "react";
import { useSelector } from "react-redux";

export default function UserDashboard() {
  const authUser = useSelector(useCurrentUser);
  const token = useSelector((state: any) => state.auth?.token);
  
  // Check for token in cookies as fallback
  const [hasCookieToken, setHasCookieToken] = useState(false);
  useEffect(() => {
    const cookieToken = document.cookie
      .split("; ")
      .find((row) => row.startsWith("accessToken="))
      ?.split("=")[1];
    setHasCookieToken(!!cookieToken);
  }, []);

  // Fetch consolidated stats - skip if no token available
  const {
    data: statsResponse,
    isLoading: statsLoading,
    error: statsError,
  } = useGetUserDashboardStatsQuery(undefined, {
    skip: !token && !hasCookieToken,
  });

  // Fetch recent data for lists - skip if no token available
  const {
    data: bookingsResponse,
    isLoading: bookingsLoading,
  } = useGetMyBookingsQuery({ skip: !token && !hasCookieToken } as any);

  const {
    data: queriesResponse,
    isLoading: queriesLoading,
  } = useGetMyQueriesQuery({ skip: !token && !hasCookieToken } as any);

  const stats = useMemo(() => {
    const userStats = statsResponse?.data;
    const bookings = bookingsResponse?.data || [];
    const queries = queriesResponse?.data || [];

    return {
      bookings: {
        total: userStats?.bookings.total || 0,
        pending: userStats?.bookings.pending || 0,
        confirmed: userStats?.bookings.confirmed || 0,
      },
      queries: {
        total: userStats?.queries.total || 0,
      },
      visaQueries: {
        total: userStats?.visaQueries.total || 0,
        pending: userStats?.visaQueries.pending || 0,
      },
      recentBookings: bookings.slice(0, 5),
      recentQueries: queries.slice(0, 5),
    };
  }, [statsResponse, bookingsResponse, queriesResponse]);

  const isLoading = statsLoading || bookingsLoading || queriesLoading;
  const error = statsError;

  // Loading state
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-blue-500" />
          <p className="mt-4 text-gray-600">Loading dashboard statistics...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-red-500">Failed to load dashboard statistics</p>
          <p className="mt-2 text-gray-600">Please refresh the page</p>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmed":
      case "resolved":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-4 p-4 sm:space-y-6 sm:p-6 lg:space-y-8 lg:p-8">
      <PageHeader
        title="Dashboard"
        description={`Welcome back, ${authUser?.name || "User"}! Here's your account overview.`}
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4">
        <StatsCard
          title="Total Bookings"
          value={stats.bookings.total.toLocaleString()}
          icon={Package}
          trend="up"
          trendValue={stats.bookings.total}
        />
        <StatsCard
          title="Pending Visa Queries"
          value={stats.visaQueries.pending.toLocaleString()}
          icon={FileText}
          trend="up"
          trendValue={stats.visaQueries.pending}
        />
        <StatsCard
          title="Confirmed Bookings"
          value={stats.bookings.confirmed.toLocaleString()}
          icon={Plane}
          trend="up"
          trendValue={stats.bookings.confirmed}
        />
        <StatsCard
          title="Total Queries"
          value={stats.queries.total.toLocaleString()}
          icon={MessageSquare}
          trend="up"
          trendValue={stats.queries.total}
        />
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Manage your account and bookings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Link href="/dashboard/user/profile">
              <Button
                variant="outline"
                className="flex h-20 w-full flex-col gap-2"
              >
                <User className="h-6 w-6" />
                <span>Profile</span>
              </Button>
            </Link>

            <Link href="/dashboard/user/visa">
              <Button
                variant="outline"
                className="flex h-20 w-full flex-col gap-2"
              >
                <FileText className="h-6 w-6" />
                <span>Visa Info</span>
              </Button>
            </Link>

            <Link href="/dashboard/user/bookings">
              <Button
                variant="outline"
                className="flex h-20 w-full flex-col gap-2"
              >
                <Package className="h-6 w-6" />
                <span>Bookings</span>
              </Button>
            </Link>

            <Link href="/dashboard/user/queries">
              <Button
                variant="outline"
                className="flex h-20 w-full flex-col gap-2"
              >
                <MessageSquare className="h-6 w-6" />
                <span>Queries</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Bookings */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Bookings</CardTitle>
            <CardDescription>
              Your latest tour and package bookings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recentBookings.length > 0 ? (
                stats.recentBookings.map((booking: any) => (
                  <div
                    key={booking._id}
                    className="flex items-center justify-between rounded-lg border p-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg bg-blue-100 p-2">
                        <Plane className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">{booking.tourTitle}</p>
                        <p className="text-sm text-gray-600">
                          {booking.destination}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(booking.travelDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className={getStatusColor(booking.bookingStatus)}>
                        {booking.bookingStatus}
                      </Badge>
                      <p className="mt-1 text-sm font-medium">
                        ৳{booking.bookingFee.toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="py-4 text-center text-gray-500">
                  No bookings yet
                </p>
              )}
            </div>
            <div className="mt-4">
              <Link href="/dashboard/user/bookings">
                <Button variant="outline" className="w-full">
                  View All Bookings
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Recent Queries */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Queries</CardTitle>
            <CardDescription>Your latest support requests</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recentQueries.length > 0 ? (
                stats.recentQueries.map((query: any) => (
                  <div
                    key={query._id}
                    className="flex items-center justify-between rounded-lg border p-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg bg-green-100 p-2">
                        <MessageSquare className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium">
                          {query.formType === "hajj_umrah"
                            ? "Hajj & Umrah Query"
                            : "Package Tour Query"}
                        </p>
                        <p className="text-sm text-gray-600">
                          {new Date(query.startingDate).toLocaleDateString()} -{" "}
                          {new Date(query.returnDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <Badge className={getStatusColor(query.status)}>
                      {query.status}
                    </Badge>
                  </div>
                ))
              ) : (
                <p className="py-4 text-center text-gray-500">No queries yet</p>
              )}
            </div>
            <div className="mt-4">
              <Link href="/dashboard/user/queries">
                <Button variant="outline" className="w-full">
                  View All Queries
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
