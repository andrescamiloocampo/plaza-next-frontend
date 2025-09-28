import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import OrderList from "@/components/organisms/OrderList";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function EmployeeDashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user?.role !== "Empleado") {
    redirect("/login");
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
            <h1 className="text-3xl font-bold">Employee Dashboard</h1>
            <p>Welcome, {session.user?.name}</p>
        </div>
        {/* You could add a sign-out button here */}
      </div>
      <OrderList />
    </div>
  );
}