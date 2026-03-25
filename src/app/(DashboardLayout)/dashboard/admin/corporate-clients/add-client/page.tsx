import PageHeader from "@/components/admin/PageHeader";
import AddCorporateClientForm from "@/DashboardComponents/Dashboard/CorporateClients/AddCorporateClientForm";

export default function AddCorporateClientPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Add New Corporate Client"
        description="Add a new corporate client with logo and name"
      />
      <AddCorporateClientForm />
    </div>
  );
}
