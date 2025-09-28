import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import RestaurantList from "@/components/organisms/RestaurantList";

export default async function RestaurantsPage() {
  const session = await getServerSession();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Explore Restaurants</h1>
          <p>Choose a restaurant to see its menu and place an order.</p>
        </div>
        {/* You could add a sign-out button or link to user profile here */}
      </div>
      <RestaurantList />
    </div>
  );
}