import PageHeader from "@/components/admin/PageHeader";
import { Button } from "@/components/ui/button";
import CorporateClientsClient from "@/DashboardComponents/Dashboard/CorporateClients/CorporateClientsClient";
import Link from "next/link";

export default function CorporateClientsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageHeader
          title="Corporate Clients Management"
          description="Manage corporate client logos and information"
        />
        <div className="flex gap-2">
          <Link href={"/dashboard/admin/corporate-clients/add-client"}>
            <Button>Add new client</Button>
          </Link>
        </div>
      </div>
      {/* Client-side logic */}
      <CorporateClientsClient />
    </div>
  );
}
