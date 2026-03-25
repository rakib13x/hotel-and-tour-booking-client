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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertCircle,
  Calendar,
  CheckCircle,
  Clock,
  Eye,
  MessageSquare,
  Plus,
  Send,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

// Mock data - replace with actual API calls
const mockQueries = [
  {
    id: "1",
    subject: "Visa Processing Time",
    message:
      "I would like to know the processing time for US tourist visa application.",
    formType: "visa",
    status: "Resolved",
    createdAt: "2024-01-15",
    updatedAt: "2024-01-16",
    response:
      "US tourist visa processing time is typically 15-30 business days. Please ensure all documents are complete.",
  },
  {
    id: "2",
    subject: "Tour Cancellation Policy",
    message: "What is your cancellation policy for the Kashmir tour?",
    formType: "tour",
    status: "Pending",
    createdAt: "2024-01-20",
    updatedAt: "2024-01-20",
    response: null,
  },
  {
    id: "3",
    subject: "Package Customization",
    message:
      "Can I customize the Dubai package to include additional activities?",
    formType: "package",
    status: "Resolved",
    createdAt: "2024-01-10",
    updatedAt: "2024-01-12",
    response:
      "Yes, we can customize the Dubai package. Please contact our travel consultant for detailed options.",
  },
];

export default function QueriesPage() {
  const [selectedQuery, setSelectedQuery] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [showNewQueryForm, setShowNewQueryForm] = useState(false);

  // New query form state
  const [newQuery, setNewQuery] = useState({
    subject: "",
    message: "",
    formType: "general",
  });

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "resolved":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "closed":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "resolved":
        return <CheckCircle className="h-4 w-4" />;
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "closed":
        return <XCircle className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getFormTypeColor = (formType: string) => {
    switch (formType.toLowerCase()) {
      case "visa":
        return "bg-blue-100 text-blue-800";
      case "tour":
        return "bg-green-100 text-green-800";
      case "package":
        return "bg-purple-100 text-purple-800";
      case "general":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const columns = [
    {
      header: "Subject",
      accessorKey: "subject",
      cell: (row: any) => (
        <div className="flex items-center gap-2">
          <MessageSquare className="text-muted-foreground h-4 w-4" />
          <div>
            <div className="font-medium">{row.subject}</div>
            <div className="text-muted-foreground text-sm">
              {row.message.length > 50
                ? `${row.message.substring(0, 50)}...`
                : row.message}
            </div>
          </div>
        </div>
      ),
    },
    {
      header: "Type",
      accessorKey: "formType",
      cell: (row: any) => (
        <Badge className={getFormTypeColor(row.formType)}>
          {row.formType.charAt(0).toUpperCase() + row.formType.slice(1)}
        </Badge>
      ),
    },
    {
      header: "Date",
      accessorKey: "createdAt",
      cell: (row: any) => (
        <div className="flex items-center gap-2">
          <Calendar className="text-muted-foreground h-4 w-4" />
          <span>{new Date(row.createdAt).toLocaleDateString()}</span>
        </div>
      ),
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: (row: any) => (
        <Badge className={getStatusColor(row.status)}>
          <div className="flex items-center gap-1">
            {getStatusIcon(row.status)}
            {row.status}
          </div>
        </Badge>
      ),
    },
    {
      header: "Actions",
      accessorKey: "actions",
      cell: (row: any) => (
        <Button
          variant="outline"
          size="sm"
          onClick={() => setSelectedQuery(row)}
        >
          <Eye className="mr-1 h-4 w-4" />
          View
        </Button>
      ),
    },
  ];

  // Filter data based on search term
  const filteredData = mockQueries.filter(
    (query) =>
      query.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      query.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      query.formType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      query.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate statistics
  const stats = {
    total: mockQueries.length,
    resolved: mockQueries.filter((q) => q.status === "Resolved").length,
    pending: mockQueries.filter((q) => q.status === "Pending").length,
    closed: mockQueries.filter((q) => q.status === "Closed").length,
  };

  const handleNewQuerySubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newQuery.subject.trim() || !newQuery.message.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      // TODO: Implement API call to submit new query
      toast.success("Query submitted successfully");
      setNewQuery({ subject: "", message: "", formType: "general" });
      setShowNewQueryForm(false);
    } catch (error) {
      toast.error("Failed to submit query");
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setNewQuery((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Support Queries"
        description="View and manage your support requests"
      />

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Queries</CardTitle>
            <MessageSquare className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-muted-foreground text-xs">All time queries</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolved</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats.resolved}
            </div>
            <p className="text-muted-foreground text-xs">
              Successfully resolved
            </p>
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
            <p className="text-muted-foreground text-xs">Awaiting response</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Closed</CardTitle>
            <XCircle className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">
              {stats.closed}
            </div>
            <p className="text-muted-foreground text-xs">Closed queries</p>
          </CardContent>
        </Card>
      </div>

      {/* Queries Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Support Queries</CardTitle>
              <CardDescription>
                View and track your support requests
              </CardDescription>
            </div>
            <Button onClick={() => setShowNewQueryForm(true)}>
              <Plus className="mr-2 h-4 w-4" />
              New Query
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable
            data={filteredData}
            columns={columns}
            searchable={true}
            pagination={true}
            onSearch={setSearchTerm}
            currentPage={currentPage}
            totalPages={Math.ceil(filteredData.length / 10)}
            onPageChange={setCurrentPage}
          />
        </CardContent>
      </Card>

      {/* New Query Form Modal */}
      {showNewQueryForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl border border-white/20 bg-white/80 shadow-2xl backdrop-blur-md">
            <div className="p-6">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">
                  Submit New Query
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowNewQueryForm(false)}
                  className="rounded-full hover:bg-white/30"
                >
                  <XCircle className="h-4 w-4" />
                </Button>
              </div>

              <form onSubmit={handleNewQuerySubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject *</Label>
                  <Input
                    id="subject"
                    name="subject"
                    value={newQuery.subject}
                    onChange={handleInputChange}
                    placeholder="Enter query subject"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="formType">Query Type</Label>
                  <select
                    id="formType"
                    name="formType"
                    value={newQuery.formType}
                    onChange={handleInputChange}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="general">General</option>
                    <option value="visa">Visa</option>
                    <option value="tour">Tour</option>
                    <option value="package">Package</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message *</Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={newQuery.message}
                    onChange={handleInputChange}
                    placeholder="Describe your query in detail"
                    rows={5}
                    required
                  />
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowNewQueryForm(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">
                    <Send className="mr-2 h-4 w-4" />
                    Submit Query
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Query Details Modal */}
      {selectedQuery && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl border border-white/20 bg-white/80 shadow-2xl backdrop-blur-md">
            <div className="p-6">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">
                  Query Details
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedQuery(null)}
                  className="rounded-full hover:bg-white/30"
                >
                  <XCircle className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Subject
                    </label>
                    <p className="text-gray-900">{selectedQuery.subject}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Type
                    </label>
                    <Badge className={getFormTypeColor(selectedQuery.formType)}>
                      {selectedQuery.formType.charAt(0).toUpperCase() +
                        selectedQuery.formType.slice(1)}
                    </Badge>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Status
                    </label>
                    <Badge className={getStatusColor(selectedQuery.status)}>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(selectedQuery.status)}
                        {selectedQuery.status}
                      </div>
                    </Badge>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Created Date
                    </label>
                    <p className="flex items-center gap-1 text-gray-900">
                      <Calendar className="h-4 w-4" />
                      {new Date(selectedQuery.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Your Message
                  </label>
                  <div className="mt-2 rounded-lg bg-gray-50 p-4">
                    <p className="text-gray-900">{selectedQuery.message}</p>
                  </div>
                </div>

                {selectedQuery.response && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Response
                    </label>
                    <div className="mt-2 rounded-lg border border-green-200 bg-green-50 p-4">
                      <p className="text-gray-900">{selectedQuery.response}</p>
                    </div>
                  </div>
                )}

                <div className="flex justify-end gap-2 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setSelectedQuery(null)}
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
