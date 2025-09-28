import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import MyOrders from "@/components/organisms/MyOrders";

export default async function MyOrdersPage() {
  const session = await getServerSession();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">My Orders</h1>
          <p>View your order history and track their status.</p>
        </div>
      </div>
      <MyOrders />
    </div>
  );
}