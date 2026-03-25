"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ICustomTourQuery } from "@/redux/api/features/customTourQuery/customTourQueryApi";
import { ChevronLeft, ChevronRight, Mail, Phone, Trash2 } from "lucide-react";
import React from "react";

interface CustomTourQueriesTableProps {
  queries: ICustomTourQuery[];
  isLoading: boolean;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onStatusUpdate: (id: string, status: string) => void;
  onDelete: (id: string) => void;
}

export default function CustomTourQueriesTable({
  queries,
  isLoading,
  currentPage,
  totalPages,
  onPageChange,
  onStatusUpdate,
  onDelete,
}: CustomTourQueriesTableProps): React.ReactElement {
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "contacted":
        return "bg-blue-100 text-blue-800";
      case "closed":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <div className="rounded-lg bg-white p-8 shadow">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-blue-500"></div>
          <p className="text-gray-600">Loading queries...</p>
        </div>
      </div>
    );
  }

  if (queries.length === 0) {
    return (
      <div className="rounded-lg bg-white p-8 shadow">
        <div className="text-center">
          <p className="text-gray-600">No custom tour queries found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg bg-white shadow">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Contact Info</TableHead>
              <TableHead>Tour Details</TableHead>
              <TableHead>Travel Info</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Submitted At</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {queries.map((query) => (
              <TableRow key={query._id}>
                <TableCell className="font-medium">{query.name}</TableCell>
                <TableCell>
                  <div className="space-y-1 text-sm">
                    {query.email && (
                      <div className="flex items-center gap-1 text-gray-600">
                        <Mail className="h-3 w-3" />
                        <span>{query.email}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1 text-gray-600">
                      <Phone className="h-3 w-3" />
                      <span>{query.phone}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="max-w-xs">
                    <p className="truncate text-sm font-medium text-gray-900">
                      {query.tourTitle || "Not specified"}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1 text-sm text-gray-600">
                    {query.travelDate && (
                      <div>
                        <span className="font-medium">Date:</span>{" "}
                        {new Date(query.travelDate).toLocaleDateString()}
                      </div>
                    )}
                    <div>
                      <span className="font-medium">Persons:</span>{" "}
                      {query.persons || "N/A"}
                    </div>
                    {(query.numberOfAdults || query.numberOfChildren) && (
                      <div className="text-xs">
                        {query.numberOfAdults
                          ? `Adults: ${query.numberOfAdults}`
                          : ""}{" "}
                        {query.numberOfChildren
                          ? `Children: ${query.numberOfChildren}`
                          : ""}
                      </div>
                    )}
                    {query.needsVisa !== undefined && (
                      <div className="text-xs">
                        <span className="font-medium">Visa:</span>{" "}
                        {query.needsVisa ? "Yes" : "No"}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Select
                    value={query.status}
                    onValueChange={(value) =>
                      onStatusUpdate(query._id || "", value)
                    }
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue>
                        <Badge
                          className={getStatusBadgeColor(query.status)}
                          variant="outline"
                        >
                          {query.status}
                        </Badge>
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="contacted">Contacted</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell className="text-sm text-gray-600">
                  {formatDate(query.createdAt)}
                </TableCell>
                <TableCell>
                  <div className="flex justify-center gap-2">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => onDelete(query._id || "")}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t px-6 py-4">
          <div className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
