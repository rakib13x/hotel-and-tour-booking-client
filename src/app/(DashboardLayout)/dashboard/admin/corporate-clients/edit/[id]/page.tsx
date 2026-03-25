import PageHeader from "@/components/admin/PageHeader";
import EditCorporateClientForm from "@/DashboardComponents/Dashboard/CorporateClients/EditCorporateClientForm";

export default async function EditCorporateClientPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <div className="space-y-6">
      <PageHeader
        title="Edit Corporate Client"
        description="Update corporate client information"
      />
      <EditCorporateClientForm clientId={id} />
    </div>
  );
}
