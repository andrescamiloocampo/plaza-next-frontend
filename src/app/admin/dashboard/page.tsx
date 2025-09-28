import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import CreateOwnerForm from "@/components/organisms/CreateOwnerForm";
import CreateRestaurantForm from "@/components/organisms/CreateRestaurantForm";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user?.role !== "Administrador") {
    redirect("/login");
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      <p className="mb-8">Welcome, {session.user?.name}</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        <div>
          <CreateOwnerForm />
        </div>
        <div>
          <CreateRestaurantForm />
        </div>
      </div>
    </div>
  );
}