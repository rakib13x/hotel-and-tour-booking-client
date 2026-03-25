"use client";

import DataTable from "@/components/admin/DataTable";
import PageHeader from "@/components/admin/PageHeader";
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
import {
  AlertCircle,
  Calendar,
  CheckCircle,
  Clock,
  DollarSign,
  Download,
  Eye,
  Loader2,
  MapPin,
  Plane,
  Users,
  XCircle,
} from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export default function BookingsPage() {
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch user's bookings
  const { data: bookingsData, isLoading, error } = useGetMyBookingsQuery();

  // Show error state
  useEffect(() => {
    if (error) {
      toast.error("Failed to load bookings. Please try again.");
    }
  }, [error]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "refunded":
        return "bg-blue-100 text-blue-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return <CheckCircle className="h-4 w-4" />;
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "cancelled":
        return <XCircle className="h-4 w-4" />;
      case "completed":
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const tourColumns = [
    {
      header: "Tour",
      accessorKey: "tourTitle",
      cell: (row: any) => (
        <div className="flex items-center gap-2">
          <Plane className="text-muted-foreground h-4 w-4" />
          <div>
            <div className="font-medium">{row.tourTitle}</div>
            <div className="text-muted-foreground flex items-center gap-1 text-sm">
              <MapPin className="h-3 w-3" />
              {row.destination}
            </div>
          </div>
        </div>
      ),
    },
    {
      header: "Duration",
      accessorKey: "duration",
      cell: (row: any) => (
        <div className="flex items-center gap-2">
          <Calendar className="text-muted-foreground h-4 w-4" />
          <span>{row.duration} days</span>
        </div>
      ),
    },
    {
      header: "Travelers",
      accessorKey: "persons",
      cell: (row: any) => (
        <div className="flex items-center gap-2">
          <Users className="text-muted-foreground h-4 w-4" />
          <span>{row.persons}</span>
        </div>
      ),
    },
    {
      header: "Amount",
      accessorKey: "bookingFee",
      cell: (row: any) => (
        <div className="flex items-center gap-2">
          <DollarSign className="text-muted-foreground h-4 w-4" />
          <span className="font-medium">
            ৳{row.bookingFee.toLocaleString()}
          </span>
        </div>
      ),
    },
    {
      header: "Status",
      accessorKey: "bookingStatus",
      cell: (row: any) => (
        <Badge className={getStatusColor(row.bookingStatus)}>
          <div className="flex items-center gap-1">
            {getStatusIcon(row.bookingStatus)}
            {row.bookingStatus}
          </div>
        </Badge>
      ),
    },
    {
      header: "Actions",
      accessorKey: "actions",
      cell: (row: any) => (
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSelectedBooking(row)}
          >
            <Eye className="mr-1 h-4 w-4" />
            View
          </Button>
          {row.bookingStatus === "confirmed" && (
            <Button variant="outline" size="sm">
              <Download className="mr-1 h-4 w-4" />
              Invoice
            </Button>
          )}
        </div>
      ),
    },
  ];

  // Get bookings from API
  const allBookings = bookingsData?.data || [];

  // Filter data based on search term
  const filteredData = allBookings.filter((booking) => {
    const matchesSearch =
      booking.tourTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.bookingStatus.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.name.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

  // Calculate statistics
  const stats = {
    total: allBookings.length,
    confirmed: allBookings.filter((b) => b.bookingStatus === "confirmed")
      .length,
    pending: allBookings.filter((b) => b.bookingStatus === "pending").length,
    cancelled: allBookings.filter((b) => b.bookingStatus === "cancelled")
      .length,
    totalAmount: allBookings.reduce((sum, b) => sum + b.bookingFee, 0),
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <Loader2 className="text-primary mx-auto h-12 w-12 animate-spin" />
          <p className="mt-4 text-gray-600">Loading your bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Bookings"
        description="View and manage your tour and package bookings"
      />

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Bookings
            </CardTitle>
            <Plane className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-muted-foreground text-xs">All bookings</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Confirmed</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats.confirmed}
            </div>
            <p className="text-muted-foreground text-xs">Confirmed bookings</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {stats.pending}
            </div>
            <p className="text-muted-foreground text-xs">Pending bookings</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            <DollarSign className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              ৳{stats.totalAmount.toLocaleString()}
            </div>
            <p className="text-muted-foreground text-xs">All time spending</p>
          </CardContent>
        </Card>
      </div>

      {/* Bookings Table */}
      <Card>
        <CardHeader>
          <CardTitle>Booking History</CardTitle>
          <CardDescription>
            {allBookings.length === 0
              ? "You don't have any bookings yet. Book a tour to see it here!"
              : "View and manage your booking details"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            data={filteredData}
            columns={tourColumns}
            searchable={true}
            pagination={true}
            onSearch={setSearchTerm}
            currentPage={currentPage}
            totalPages={Math.ceil(filteredData.length / 10)}
            onPageChange={setCurrentPage}
          />
        </CardContent>
      </Card>

      {/* Booking Details Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl border border-white/20 bg-white/80 shadow-2xl backdrop-blur-md">
            <div className="p-6">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">
                  Booking Details
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedBooking(null)}
                  className="rounded-full hover:bg-white/30"
                >
                  <XCircle className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Name
                    </label>
                    <p className="text-gray-900">{selectedBooking.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Phone
                    </label>
                    <p className="text-gray-900">{selectedBooking.phone}</p>
                  </div>
                  <div className="col-span-2">
                    <label className="text-sm font-medium text-gray-700">
                      Tour Title
                    </label>
                    <p className="text-gray-900">{selectedBooking.tourTitle}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Destination
                    </label>
                    <p className="flex items-center gap-1 text-gray-900">
                      <MapPin className="h-4 w-4" />
                      {selectedBooking.destination}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Duration
                    </label>
                    <p className="flex items-center gap-1 text-gray-900">
                      <Calendar className="h-4 w-4" />
                      {selectedBooking.duration} days
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Travel Date
                    </label>
                    <p className="text-gray-900">
                      {new Date(
                        selectedBooking.travelDate
                      ).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Number of Persons
                    </label>
                    <p className="flex items-center gap-1 text-gray-900">
                      <Users className="h-4 w-4" />
                      {selectedBooking.persons}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Booking Fee
                    </label>
                    <p className="flex items-center gap-1 text-gray-900">
                      <DollarSign className="h-4 w-4" />৳
                      {selectedBooking.bookingFee.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Transaction ID
                    </label>
                    <p className="font-mono text-sm text-gray-900">
                      {selectedBooking.transactionId}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Booking Status
                    </label>
                    <Badge
                      className={getStatusColor(selectedBooking.bookingStatus)}
                    >
                      <div className="flex items-center gap-1">
                        {getStatusIcon(selectedBooking.bookingStatus)}
                        {selectedBooking.bookingStatus}
                      </div>
                    </Badge>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Payment Status
                    </label>
                    <Badge
                      className={getPaymentStatusColor(
                        selectedBooking.paymentStatus
                      )}
                    >
                      {selectedBooking.paymentStatus}
                    </Badge>
                  </div>
                  <div className="col-span-2">
                    <label className="text-sm font-medium text-gray-700">
                      Booking Date
                    </label>
                    <p className="text-gray-900">
                      {new Date(selectedBooking.createdAt).toLocaleString()}
                    </p>
                  </div>
                  {selectedBooking.message && (
                    <div className="col-span-2">
                      <label className="text-sm font-medium text-gray-700">
                        Message
                      </label>
                      <p className="text-gray-900">{selectedBooking.message}</p>
                    </div>
                  )}
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  {selectedBooking.bookingStatus === "confirmed" && (
                    <Button>
                      <Download className="mr-2 h-4 w-4" />
                      Download Invoice
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    onClick={() => setSelectedBooking(null)}
                  >
                    Close
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
