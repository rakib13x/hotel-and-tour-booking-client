import PageHeader from "@/components/admin/PageHeader";
import EditCategoryForm from "@/DashboardComponents/Dashboard/Blogs/EditCategoryForm";

interface EditCategoryPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditCategoryPage({
  params,
}: EditCategoryPageProps) {
  const { id } = await params;
  return (
    <div className="space-y-6">
      <PageHeader
        title="Edit Category"
        description="Update category information"
      />
      <EditCategoryForm categoryId={id} />
    </div>
  );
}
