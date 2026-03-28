"use client";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit, Eye, GripVertical, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import {
  useDeleteCorporateClientMutation,
  useGetCorporateClientsQuery,
  useReorderCorporateClientsMutation,
} from "../../../redux/api/corporateClientsApi";

interface ICorporateClient {
  _id: string;
  name: string;
  logo: string;
  order?: number;
  createdAt: string;
}

export default function CorporateClientsClient(): React.ReactElement {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [clientsOrder, setClientsOrder] = useState<ICorporateClient[]>([]);

  // Lightbox states
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [lightboxImages, setLightboxImages] = useState<
    { src: string; alt: string }[]
  >([]);

  // Fetch corporate clients
  const {
    data: clientsData,
    isLoading,
    error,
    refetch,
  } = useGetCorporateClientsQuery({});

  const [deleteClient] = useDeleteCorporateClientMutation();
  const [reorderClients, { isLoading: isReordering }] =
    useReorderCorporateClientsMutation();

  const clients = (clientsData?.data || []) as ICorporateClient[];

  // Update local order when API data changes
  useEffect(() => {
    if (clientsData?.data) {
      setClientsOrder(clientsData.data as ICorporateClient[]);
    }
  }, [clientsData?.data]);

  const handleViewImage = (client: ICorporateClient) => {
    setLightboxImages([
      {
        src: client.logo,
        alt: client.name,
      },
    ]);
    setLightboxIndex(0);
    setLightboxOpen(true);
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await deleteClient(id).unwrap();
      toast.success("Corporate client deleted successfully");
      refetch();
    } catch (err: unknown) {
      const errorMessage =
        err && typeof err === "object" && "data" in err
          ? (err as any).data?.message || "Failed to delete corporate client"
          : "Failed to delete corporate client";
      toast.error(errorMessage);
    } finally {
      setDeletingId(null);
    }
  };

  const handleDragStart = (e: React.DragEvent, clientId: string) => {
    const sortedClients = [...clientsOrder].sort(
      (a, b) => (a.order || 0) - (b.order || 0)
    );
    const index = sortedClients.findIndex((client) => client._id === clientId);
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = async (e: React.DragEvent, dropClientId: string) => {
    e.preventDefault();

    const sortedClients = [...clientsOrder].sort(
      (a, b) => (a.order || 0) - (b.order || 0)
    );
    const dropIndex = sortedClients.findIndex(
      (client) => client._id === dropClientId
    );

    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null);
      return;
    }

    // Create new order array
    const newOrder = [...sortedClients];
    const [removed] = newOrder.splice(draggedIndex, 1);

    if (removed) {
      newOrder.splice(dropIndex, 0, removed);

      // Optimistically update UI
      setClientsOrder(newOrder);

      try {
        const clientIds = newOrder
          .map((client) => client._id)
          .filter((id): id is string => !!id);

        if (clientIds.length === 0) {
          throw new Error("No valid client IDs found");
        }

        await reorderClients({ clientIds }).unwrap();
        toast.success("Corporate clients reordered successfully!");

        // Force refetch to get updated order from backend
        refetch();
      } catch (err: unknown) {
        const errorMessage =
          err && typeof err === "object" && "data" in err
            ? (err as any).data?.message || "Failed to reorder corporate clients"
            : "Failed to reorder corporate clients";
        toast.error(errorMessage);
        // Revert to original order on error
        setClientsOrder(clients);
      }
    }

    setDraggedIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-lg">Loading corporate clients...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-center">
          <p className="mb-4 text-red-500">Error loading corporate clients</p>
          <Button onClick={() => refetch()} variant="outline">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg bg-white shadow">
      <div className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            Corporate Clients
          </h3>
          <p className="text-sm text-gray-500">
            Drag rows to reorder • {clientsOrder.length} clients
          </p>
        </div>

        {clientsOrder.length === 0 ? (
          <div className="py-8 text-center">
            <p className="text-gray-500">No corporate clients found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">Order</TableHead>
                  <TableHead>Logo</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[...clientsOrder]
                  .sort((a, b) => (a.order || 0) - (b.order || 0))
                  .map((client, index) => (
                    <TableRow
                      key={client._id}
                      draggable={!isReordering}
                      onDragStart={(e) => handleDragStart(e, client._id)}
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, client._id)}
                      onDragEnd={handleDragEnd}
                      className={`cursor-move transition-colors ${
                        draggedIndex === index
                          ? "bg-blue-50 opacity-50"
                          : "hover:bg-gray-50"
                      } ${isReordering ? "pointer-events-none opacity-60" : ""}`}
                    >
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <GripVertical className="h-4 w-4 text-gray-400" />
                          <span className="text-sm font-medium text-gray-500">
                            {index + 1}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div
                          className="relative h-12 w-16 cursor-pointer"
                          onClick={() => handleViewImage(client)}
                          title="Click to view full image"
                        >
                          <Image
                            src={client.logo}
                            alt={client.name}
                            fill
                            sizes="64px"
                            className="object-contain"
                          />
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        {client.name}
                      </TableCell>
                      <TableCell>
                        {new Date(client.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewImage(client)}
                            title="View Logo"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Link
                            href={`/dashboard/admin/corporate-clients/edit/${client._id}`}
                          >
                            <Button variant="outline" size="sm" title="Edit">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(client._id)}
                            disabled={deletingId === client._id || isReordering}
                            className="text-red-600 hover:text-red-700"
                            title="Delete"
                          >
                            {deletingId === client._id ? (
                              <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-red-600"></div>
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* Lightbox for Full Screen Image View */}
      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        index={lightboxIndex}
        slides={lightboxImages}
        on={{
          view: ({ index }) => setLightboxIndex(index),
        }}
      />
    </div>
  );
}
