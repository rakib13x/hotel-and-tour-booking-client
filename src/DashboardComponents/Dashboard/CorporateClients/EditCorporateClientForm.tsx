"use client";

import CustomFileUploader from "@/components/CustomFormComponents/CustomFileUploader";
import CustomForm from "@/components/CustomFormComponents/CustomForm";
import CustomInput from "@/components/CustomFormComponents/CustomInput";
import { Button } from "@/components/ui/button";
import {
  useGetSingleCorporateClientQuery,
  useUpdateCorporateClientMutation,
} from "@/redux/api/corporateClientsApi";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { z } from "zod";

const corporateClientSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  logo: z.union([z.instanceof(File), z.string()]).optional().nullable(),
});

type CorporateClientFormData = z.infer<typeof corporateClientSchema>;

interface EditCorporateClientFormProps {
  clientId: string;
}

export default function EditCorporateClientForm({
  clientId,
}: EditCorporateClientFormProps) {
  const [updateClient, { isLoading }] = useUpdateCorporateClientMutation();
  const router = useRouter();

  const {
    data: clientData,
    isLoading: isLoadingClient,
    error,
  } = useGetSingleCorporateClientQuery(clientId);

  const onSubmit = async (data: CorporateClientFormData) => {
    try {
      const formData = new FormData();
      formData.append("name", data.name);

      // Get logo from form data (CustomFileUploader sets it via react-hook-form)
      if (data.logo && data.logo instanceof File) {
        formData.append("coverImage", data.logo);
      }

      await updateClient({ id: clientId, formData }).unwrap();
      toast.success("Corporate client updated successfully");
      router.push("/dashboard/admin/corporate-clients");
    } catch (err: unknown) {
      const errorMessage =
        err && typeof err === "object" && "data" in err
          ? (err as any).data?.message || "Failed to update corporate client"
          : "Failed to update corporate client";
      toast.error(errorMessage);
    }
  };

  if (isLoadingClient) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-lg">Loading client data...</div>
      </div>
    );
  }

  if (error || !clientData?.data) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-lg text-red-500">Error loading client data</div>
      </div>
    );
  }

  const client = clientData.data;
  const defaultValues = {
    name: client.name,
    logo: client.logo,
  };

  return (
    <div className="mx-auto max-w-2xl">
      <div className="rounded-lg bg-white p-6 shadow">
        <CustomForm
          onSubmit={onSubmit}
          resolver={zodResolver(corporateClientSchema)}
          defaultValues={defaultValues}
          hideSubmitUntilValid={true}
        >
          <div className="space-y-6">
            <div>
              <CustomInput
                name="name"
                label="Client Name *"
                placeholder="Enter client name"
                required
              />
            </div>

            <div>
              <CustomFileUploader
                name="logo"
                label="Client Logo"
                accept={{ "image/*": [] }}
                existingImages={client.logo}
              />
            </div>

            <div className="flex gap-4 pt-4">
              <Button type="submit" disabled={isLoading} className="flex-1">
                {isLoading ? "Updating..." : "Update Client"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  router.push("/dashboard/admin/corporate-clients")
                }
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </CustomForm>
      </div>
    </div>
  );
}
