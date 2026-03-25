"use client";

import { Button } from "@/components/ui/button";
import ConfirmationDialog from "@/components/ui/confirmation-dialog";
import { Input } from "@/components/ui/input";
import {
  useDeleteTourCategoryMutation,
  useGetTourCategoriesQuery,
} from "@/redux/api/features/tourCategory/tourCategoryApi";
import { Plus, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import TourCategoriesTable from "./TourCategoriesTable";

export default function TourCategoriesClient() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);
  const limit = 10;

  const { data, isLoading, error } = useGetTourCategoriesQuery({
    page,
    limit,
    ...(search && { search }),
  });

  const [deleteTourCategory, { isLoading: isDeleting }] =
    useDeleteTourCategoryMutation();

  const handleDelete = (id: string) => {
    setCategoryToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!categoryToDelete) return;

    try {
      await deleteTourCategory(categoryToDelete).unwrap();
      toast.success("Tour category deleted successfully");
      setDeleteDialogOpen(false);
      setCategoryToDelete(null);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to delete tour category");
    }
  };

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  if (error) {
    return (
      <div className="p-6">
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-red-800">Error loading tour categories</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Tour Categories</h1>
          <p className="text-muted-foreground mt-1">
            Manage your tour categories
          </p>
        </div>
        <Button
          onClick={() => router.push("/dashboard/admin/tour-categories/add")}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Category
        </Button>
      </div>

      {/* Search */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <Input
            placeholder="Search categories..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Table */}
      <TourCategoriesTable
        data={data?.data || []}
        isLoading={isLoading}
        {...(data?.pagination && { pagination: data.pagination })}
        currentPage={page}
        onPageChange={setPage}
        onDelete={handleDelete}
        isDeleting={isDeleting}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Tour Category"
        description="Are you sure you want to delete this tour category? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={confirmDelete}
        variant="destructive"
        isLoading={isDeleting}
      />
    </div>
  );
}
