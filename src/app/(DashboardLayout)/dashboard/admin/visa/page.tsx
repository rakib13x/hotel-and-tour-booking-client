/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import PageHeader from "@/components/admin/PageHeader";
import DynamicRichTextEditor from "@/components/CustomFormComponents/DynamicRichTextEditor";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
import { useGetCountriesQuery } from "@/redux/api/features/country/countryApi";
import {
  useCreateVisaMutation,
  useDeleteVisaMutation,
  useGetAllVisasQuery,
  useUpdateVisaMutation,
} from "@/redux/api/features/visa/visaApi";
import {
  CreateVisaFormData,
  createVisaSchema,
  VISA_TYPES as VISA_TYPES_ENUM,
} from "@/schema/visaSchema";
import { ICountryVisa } from "@/types/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ChevronDown,
  DollarSign,
  Edit,
  Eye,
  FileText,
  Globe,
  Loader2,
  Plus,
  Save,
  Search,
  Shield,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

// Searchable Country Dropdown Component
const SearchableCountryDropdown = ({
  value,
  countryId,
  onValueChange,
  placeholder,
}: {
  value: string;
  countryId?: string;
  onValueChange: (countryName: string, countryId: string) => void;
  placeholder: string;
}) => {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  // Fetch countries from backend
  const { data: countriesResponse, isLoading: isLoadingCountries } =
    useGetCountriesQuery({
      page: 1,
      limit: 1000, // Get all countries
    });

  const countryOptions = countriesResponse?.data || [];

  const filteredCountries = countryOptions.filter((country) =>
    country.name.toLowerCase().includes(searchValue.toLowerCase()),
  );

  const selectedCountry = countryOptions.find(
    (country) => country._id === countryId || country.name === value,
  );

  return (
    <div className="relative">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            <span className="truncate">
              {selectedCountry ? selectedCountry.name : placeholder}
            </span>
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
          <div className="p-4">
            <div className="relative mb-3">
              <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
              <Input
                placeholder="Search countries..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="pl-10"
                autoFocus
              />
            </div>
            <div className="max-h-60 overflow-y-auto">
              {isLoadingCountries ? (
                <div className="py-4 text-center text-sm text-gray-500">
                  <Loader2 className="mx-auto mb-2 h-6 w-6 animate-spin" />
                  Loading countries...
                </div>
              ) : filteredCountries.length === 0 ? (
                <div className="py-4 text-center text-sm text-gray-500">
                  <Search className="mx-auto mb-2 h-6 w-6 text-gray-300" />
                  No countries found.
                </div>
              ) : (
                <div className="space-y-1 p-1">
                  {filteredCountries.map((country) => (
                    <button
                      key={country._id}
                      type="button"
                      onClick={() => {
                        onValueChange(country.name, country._id!);
                        setOpen(false);
                        setSearchValue("");
                      }}
                      className="flex w-full items-center rounded-lg px-3 py-2 text-left transition-colors hover:bg-gray-100"
                    >
                      {country.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

// Use visa types from schema (matches backend)
const VISA_TYPES = VISA_TYPES_ENUM;

export default function VisaPage() {
  // RTK Query hooks
  const { data: visasResponse, isLoading, error } = useGetAllVisasQuery({});
  const [createVisa, { isLoading: isCreating }] = useCreateVisaMutation();
  const [updateVisa, { isLoading: isUpdating }] = useUpdateVisaMutation();
  const [deleteVisa, { isLoading: isDeleting }] = useDeleteVisaMutation();

  const visas = visasResponse?.data || [];

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingVisa, setEditingVisa] = useState<ICountryVisa | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [visaToDelete, setVisaToDelete] = useState<ICountryVisa | null>(null);
  const [viewDetailsOpen, setViewDetailsOpen] = useState(false);
  const [selectedVisa, setSelectedVisa] = useState<ICountryVisa | null>(null);
  const [selectedCountryId, setSelectedCountryId] = useState<string>("");

  // React Hook Form setup
  const {
    register,
    handleSubmit: handleFormSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<CreateVisaFormData>({
    resolver: zodResolver(createVisaSchema),
    defaultValues: {
      countryName: "",
      visaTypes: [],
      processingFee: "",
      required_document: "",
    },
  });

  // Filter visas based on search term and status
  const filteredVisas = visas.filter((visa) => {
    const matchesSearch = visa.countryName
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && visa.isActive) ||
      (statusFilter === "inactive" && !visa.isActive);
    return matchesSearch && matchesStatus;
  });

  // Calculate stats
  const stats = {
    total: visas.length,
    active: visas.filter((v) => v.isActive).length,
    inactive: visas.filter((v) => !v.isActive).length,
    avgFee:
      visas.length > 0
        ? Math.round(
            visas.reduce((sum, v) => sum + (v.processingFee || 0), 0) /
              visas.length,
          )
        : 0,
  };

  const handleSubmit = async (data: CreateVisaFormData) => {
    try {
      const visaData: any = {
        visaTypes: data.visaTypes,
        isActive: true,
      };

      // Send countryId if available (for backend to use country reference)
      if (selectedCountryId) {
        visaData.countryId = selectedCountryId;
      } else {
        // Fallback to countryName if countryId not available
        visaData.countryName = data.countryName.trim();
      }

      if (data.processingFee) {
        visaData.processingFee = parseFloat(data.processingFee);
      }

      if (data.required_document) {
        visaData.required_document = data.required_document;
      }

      if (editingVisa) {
        // Update existing visa
        await updateVisa({
          id: editingVisa._id!,
          visaData,
        }).unwrap();
        toast.success("Visa information updated successfully");
      } else {
        // Create new visa
        await createVisa(visaData).unwrap();
        toast.success("Visa information created successfully");
      }

      // Only reset form and close dialog on success
      handleCloseDialog();
    } catch (error: any) {
      toast.error(
        error?.data?.message ||
          (editingVisa
            ? "Failed to update visa information"
            : "Failed to create visa information"),
      );
      // Don't reset form or close dialog on error - keep user's input
    }
  };

  const handleEdit = (visa: ICountryVisa) => {
    setEditingVisa(visa);
    setValue("countryName", visa.countryName);
    setValue("visaTypes", visa.visaTypes.length > 0 ? visa.visaTypes : []);
    setValue("processingFee", visa.processingFee?.toString() || "");
    setValue("required_document", visa.required_document || "");
    // Set countryId if available from populated country field
    if (
      visa.country &&
      typeof visa.country === "object" &&
      "_id" in visa.country
    ) {
      setSelectedCountryId(visa.country._id);
    } else if (visa.country && typeof visa.country === "string") {
      setSelectedCountryId(visa.country);
    } else {
      setSelectedCountryId("");
    }
    setIsDialogOpen(true);
  };

  const handleDeleteClick = (visa: ICountryVisa) => {
    setVisaToDelete(visa);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!visaToDelete) return;

    try {
      await deleteVisa(visaToDelete._id!).unwrap();
      toast.success("Visa information deleted successfully");
      setDeleteDialogOpen(false);
      setVisaToDelete(null);
    } catch {
      toast.error("Failed to delete visa information");
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setVisaToDelete(null);
  };

  const handleViewDetails = (visa: ICountryVisa) => {
    setSelectedVisa(visa);
    setViewDetailsOpen(true);
  };

  const handleAddNew = () => {
    setEditingVisa(null);
    setSelectedCountryId("");
    reset();
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingVisa(null);
    setSelectedCountryId("");
    reset();
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Visa Information"
          description="Manage visa requirements and processing information for different countries"
        />
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Visa Information"
          description="Manage visa requirements and processing information for different countries"
        />
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-red-500">
              Failed to load visa information. Please try again.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Visa Information"
        description="Manage visa requirements and processing information for different countries"
      />

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Countries
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-blue-500" />
              <div className="text-2xl font-bold">{stats.total}</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Visas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-green-500" />
              <div className="text-2xl font-bold">{stats.active}</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Inactive Visas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-gray-500" />
              <div className="text-2xl font-bold">{stats.inactive}</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Avg. Processing Fee
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-purple-500" />
              <div className="text-2xl font-bold">
                {stats.avgFee.toLocaleString()}
              </div>
            </div>
            <p className="mt-1 text-xs text-gray-500">BDT</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Card with Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
            <div>
              <CardTitle>Visa Information</CardTitle>
              <p className="mt-1 text-sm text-gray-500">
                Manage visa requirements for different countries
              </p>
            </div>
            <Dialog
              open={isDialogOpen}
              onOpenChange={(open) => {
                if (!open) {
                  // Only reset when manually closing (not on error)
                  handleCloseDialog();
                } else {
                  setIsDialogOpen(open);
                }
              }}
            >
              <DialogTrigger asChild>
                <Button onClick={handleAddNew}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Visa Info
                </Button>
              </DialogTrigger>
              <DialogContent className="max-h-[80vh] overflow-y-auto sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>
                    {editingVisa
                      ? "Edit Visa Information"
                      : "Add New Visa Information"}
                  </DialogTitle>
                </DialogHeader>
                <form
                  onSubmit={handleFormSubmit(handleSubmit)}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label htmlFor="countryName">
                      Select Country <span className="text-red-500">*</span>
                    </Label>
                    <SearchableCountryDropdown
                      value={watch("countryName")}
                      countryId={selectedCountryId}
                      onValueChange={(countryName, countryId) => {
                        setValue("countryName", countryName);
                        setSelectedCountryId(countryId);
                      }}
                      placeholder="Search and select a country"
                    />
                    {errors.countryName && (
                      <p className="text-sm text-red-500">
                        {errors.countryName.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>
                      Visa Types <span className="text-red-500">*</span>
                    </Label>
                    <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
                      {VISA_TYPES.map((visaType) => (
                        <div
                          key={visaType}
                          className="flex items-center space-x-2"
                        >
                          <input
                            type="checkbox"
                            id={visaType}
                            checked={
                              watch("visaTypes")?.includes(visaType) || false
                            }
                            onChange={(e) => {
                              const currentTypes = watch("visaTypes") || [];
                              if (e.target.checked) {
                                if (!currentTypes.includes(visaType)) {
                                  setValue("visaTypes", [
                                    ...currentTypes,
                                    visaType,
                                  ]);
                                }
                              } else {
                                setValue(
                                  "visaTypes",
                                  currentTypes.filter(
                                    (type) => type !== visaType,
                                  ),
                                );
                              }
                            }}
                            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <label
                            htmlFor={visaType}
                            className="cursor-pointer text-sm font-medium text-gray-700 capitalize"
                          >
                            {visaType}
                          </label>
                        </div>
                      ))}
                    </div>
                    {errors.visaTypes && (
                      <p className="text-sm text-red-500">
                        {errors.visaTypes.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="processingFee">
                      Processing Fee (BDT) (Optional)
                    </Label>
                    <Input
                      id="processingFee"
                      type="number"
                      placeholder="Enter processing fee"
                      {...register("processingFee")}
                      className={errors.processingFee ? "border-red-500" : ""}
                    />
                    {errors.processingFee && (
                      <p className="text-sm text-red-500">
                        {errors.processingFee.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="required_document">
                      Required Documents (Optional)
                    </Label>
                    <DynamicRichTextEditor
                      name="required_document"
                      label=""
                      content={watch("required_document") || ""}
                      onChangeHandler={(content) =>
                        setValue("required_document", content)
                      }
                    />
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleCloseDialog}
                      disabled={isCreating || isUpdating}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isCreating || isUpdating}>
                      {isCreating || isUpdating ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          {editingVisa ? "Updating..." : "Creating..."}
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          {editingVisa ? "Update" : "Add"} Visa Info
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="mb-6 flex flex-col space-y-4 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-4">
            <div className="relative flex-1">
              <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search countries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">#</TableHead>
                  <TableHead>Country</TableHead>
                  <TableHead>Visa Types</TableHead>
                  <TableHead>Processing Fee</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-32">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredVisas.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center">
                      <div className="py-8">
                        <Shield className="mx-auto mb-2 h-8 w-8 text-gray-400" />
                        <p className="text-sm text-gray-500">
                          {searchTerm || statusFilter !== "all"
                            ? "No visas found matching your filters"
                            : "No visa information available"}
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredVisas.map((visa, index) => (
                    <TableRow key={visa._id}>
                      <TableCell className="font-medium">{index + 1}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Globe className="h-4 w-4 text-blue-500" />
                          <span className="font-medium">
                            {visa.countryName}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {visa.visaTypes.map((type, idx) => (
                            <Badge
                              key={idx}
                              variant="outline"
                              className="text-xs"
                            >
                              {type}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        {visa.processingFee ? (
                          <span className="font-semibold text-green-600">
                            {visa.processingFee.toLocaleString()} BDT
                          </span>
                        ) : (
                          <span className="text-gray-400">N/A</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={visa.isActive ? "default" : "secondary"}
                        >
                          {visa.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewDetails(visa)}
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(visa)}
                            title="Edit"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteClick(visa)}
                            disabled={isDeleting}
                            title="Delete"
                          >
                            {isDeleting ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* View Details Dialog */}
      <Dialog open={viewDetailsOpen} onOpenChange={setViewDetailsOpen}>
        <DialogContent className="max-h-[80vh] overflow-y-auto sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-blue-500" />
              {selectedVisa?.countryName}
            </DialogTitle>
          </DialogHeader>
          {selectedVisa && (
            <div className="space-y-6">
              {/* Visa Types */}
              <div>
                <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <Shield className="h-4 w-4" />
                  Visa Types
                </h3>
                <div className="flex flex-wrap gap-2">
                  {selectedVisa.visaTypes.map((type, index) => (
                    <Badge key={index} variant="secondary" className="text-sm">
                      {type}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Processing Fee */}
              {selectedVisa.processingFee && (
                <div>
                  <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <DollarSign className="h-4 w-4" />
                    Processing Fee
                  </h3>
                  <p className="text-2xl font-bold text-green-600">
                    {selectedVisa.processingFee.toLocaleString()} BDT
                  </p>
                </div>
              )}

              {/* Required Documents */}
              {selectedVisa.required_document && (
                <div>
                  <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <FileText className="h-4 w-4" />
                    Required Documents
                  </h3>
                  <div
                    className="prose max-w-none rounded-lg border bg-gray-50 p-4 text-sm"
                    dangerouslySetInnerHTML={{
                      __html: selectedVisa.required_document,
                    }}
                  />
                </div>
              )}

              {/* Metadata */}
              <div className="rounded-lg border bg-gray-50 p-4">
                <h3 className="mb-3 text-sm font-semibold text-gray-700">
                  Information
                </h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Created:</span>
                    <span className="font-medium">
                      {new Date(selectedVisa.createdAt).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        },
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Last Updated:</span>
                    <span className="font-medium">
                      {new Date(selectedVisa.updatedAt).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        },
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Status:</span>
                    <Badge
                      variant={selectedVisa.isActive ? "default" : "secondary"}
                    >
                      {selectedVisa.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-2 border-t pt-4">
                <Button
                  variant="outline"
                  onClick={() => setViewDetailsOpen(false)}
                >
                  Close
                </Button>
                <Button
                  variant="default"
                  onClick={() => {
                    setViewDetailsOpen(false);
                    handleEdit(selectedVisa);
                  }}
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              visa information for <strong>{visaToDelete?.countryName}</strong>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleDeleteCancel}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
