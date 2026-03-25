"use client";

import CustomFileUploader from "@/components/CustomFormComponents/CustomFileUploader";
import CustomForm from "@/components/CustomFormComponents/CustomForm";
import CustomInput from "@/components/CustomFormComponents/CustomInput";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { z } from "zod";
import { useCreateCorporateClientMutation } from "../../../redux/api/corporateClientsApi";

const corporateClientSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  logo: z.any().optional(), // We'll handle logo validation in the component
});

type CorporateClientFormData = z.infer<typeof corporateClientSchema>;

export default function AddCorporateClientForm() {
  const [createClient, { isLoading }] = useCreateCorporateClientMutation();
  const router = useRouter();

  const onSubmit = async (data: CorporateClientFormData) => {
    try {
      const formData = new FormData();
      formData.append("name", data.name || "");

      // Get logo from form data (CustomFileUploader sets it via react-hook-form)
      if (data.logo && data.logo instanceof File) {
        formData.append("coverImage", data.logo);
      } else {
        toast.error("Please select a logo file");
        return;
      }

      for (let [key, value] of formData.entries()) {
      }

      await createClient(formData).unwrap();
      toast.success("Corporate client created successfully");
      router.push("/dashboard/admin/corporate-clients");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to create corporate client");
    }
  };

  const defaultValues = {
    name: "",
    logo: null,
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
                label="Client Logo *"
                accept={{ "image/*": [] }}
                required
              />
            </div>

            <div className="flex gap-4 pt-4">
              <Button type="submit" disabled={isLoading} className="flex-1">
                {isLoading ? "Creating..." : "Create Client"}
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
