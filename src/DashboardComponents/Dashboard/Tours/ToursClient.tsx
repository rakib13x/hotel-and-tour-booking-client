"use client";

import ConfirmationDialog from "@/components/ui/confirmation-dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ITour,
  useDeleteTourMutation,
  useGetToursQuery,
  useUpdateTourMutation,
} from "@/redux/api/features/tour/tourApi";
// import { TQueryParam } from "@/types"; // Unused
import { Filter, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import TourDetailDialog from "./TourDetailDialog";
import ToursTable from "./ToursTable";

export default function ToursClient(): React.ReactElement {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedTour, setSelectedTour] = useState<ITour | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState<boolean>(false);
  const [tourToDelete, setTourToDelete] = useState<string | null>(null);

  // ✅ API Query Parameters (unused - kept for reference)
  // const queryParams: TQueryParam[] = [
  //   { name: "page", value: currentPage.toString() },
  //   { name: "limit", value: "10" },
  //   ...(searchTerm ? [{ name: "search", value: searchTerm }] : []),
  //   ...(statusFilter && statusFilter !== "all"
  //     ? [{ name: "status", value: statusFilter }]
  //     : []),
  // ];

  // ✅ API Calls
  const {
    data: toursData,
    isLoading,
    error,
  } = useGetToursQuery({
    page: currentPage,
    limit: 10,
    ...(searchTerm && { search: searchTerm }),
    ...(statusFilter !== "all" && { status: statusFilter }),
  });

  const [deleteTour, { isLoading: isDeleting }] = useDeleteTourMutation();
  const [updateTour, { isLoading: isUpdating }] = useUpdateTourMutation();

  // ✅ Extract data from API response
  const tours = Array.isArray(toursData?.data) ? toursData.data : [];
  const pagination = toursData?.pagination || {};

  // ✅ Pagination
  const totalPages = (pagination as any)?.totalPage || 1;

  // ✅ Handlers
  const handleView = (tour: ITour) => {
    setSelectedTour(tour);
  };

  const handleEdit = (tour: ITour) => {
    router.push(`/dashboard/admin/tours/edit-tour/${tour._id}`);
  };

  const handleStatusUpdate = async (id: string, status: string) => {
    try {
      const formData = new FormData();
      formData.append("status", status);

      await updateTour({ id, data: formData }).unwrap();
      toast.success(`Tour ${status.toLowerCase()} successfully!`);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update tour status");
    }
  };

  const handleDelete = (id: string) => {
    setTourToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!tourToDelete) return;

    try {
      await deleteTour(tourToDelete).unwrap();
      toast.success("Tour deleted successfully!");
      setDeleteConfirmOpen(false);
      setTourToDelete(null);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to delete tour");
    }
  };

  // Removed category update function - category is now managed via edit form

  // ✅ Reset page when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  // ✅ Error handling
  if (error) {
    return (
      <div className="py-8 text-center">
        <p className="text-red-500">Error loading tours. Please try again.</p>
      </div>
    );
  }

  return (
    <>
      {/* Stats Cards */}
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
        <div className="rounded-lg bg-white p-4 shadow">
          <h3 className="text-sm font-medium text-gray-500">Total Tours</h3>
          <p className="text-2xl font-bold">
            {(pagination as any)?.total || 0}
          </p>
        </div>
        <div className="rounded-lg bg-white p-4 shadow">
          <h3 className="text-sm font-medium text-gray-500">Published</h3>
          <p className="text-2xl font-bold">
            {tours.filter((tour) => tour.status === "PUBLISHED").length}
          </p>
        </div>
        <div className="rounded-lg bg-white p-4 shadow">
          <h3 className="text-sm font-medium text-gray-500">Draft</h3>
          <p className="text-2xl font-bold">
            {tours.filter((tour) => tour.status === "DRAFT").length}
          </p>
        </div>
        <div className="rounded-lg bg-white p-4 shadow">
          <h3 className="text-sm font-medium text-gray-500">Archived</h3>
          <p className="text-2xl font-bold">
            {tours.filter((tour) => tour.status === "ARCHIVED").length}
          </p>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
          <Input
            placeholder="Search tours by title or code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="DRAFT">Draft</SelectItem>
              <SelectItem value="PUBLISHED">Published</SelectItem>
              <SelectItem value="ARCHIVED">Archived</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Tours Table */}
      <ToursTable
        tours={tours}
        isLoading={isLoading || isDeleting || isUpdating}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        onView={handleView}
        onEdit={handleEdit}
        onStatusUpdate={handleStatusUpdate}
        onCategoryUpdate={() => {}} // Removed - category managed via edit form
        onDelete={handleDelete}
      />

      {/* Tour Detail Dialog */}
      {selectedTour && (
        <TourDetailDialog
          tour={selectedTour}
          onClose={() => setSelectedTour(null)}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        title="Delete Tour"
        description="Are you sure you want to delete this tour? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={confirmDelete}
        variant="destructive"
        isLoading={isDeleting}
      />
    </>
  );
}
