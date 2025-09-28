import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import CreateDishForm from "@/components/organisms/CreateDishForm";
import CreateEmployeeForm from "@/components/organisms/CreateEmployeeForm";
import DishList from "@/components/organisms/DishList";
import EfficiencyDashboard from "@/components/organisms/EfficiencyDashboard";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function OwnerDashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user?.role !== "Propietario") {
    redirect("/login");
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold">Owner Dashboard</h1>
      <p className="mb-8">Welcome, {session.user?.name}</p>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-1 space-y-8">
          <CreateDishForm />
          <CreateEmployeeForm />
        </div>
        <div className="xl:col-span-1">
          <DishList />
        </div>
        <div className="xl:col-span-1">
            <EfficiencyDashboard />
        </div>
      </div>
    </div>
  );
}