import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import MenuList from "@/components/organisms/MenuList";
import Link from "next/link";

// This function can be used with SSG to fetch restaurant data
// For now, we'll just use the params directly.
export default async function RestaurantMenuPage({ params }: { params: { id: string } }) {
  const session = await getServerSession();

  if (!session) {
    redirect("/login");
  }

  // TODO: Fetch restaurant details using params.id
  const restaurantName = `Restaurant #${params.id.split('-')[1]}`;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link href="/restaurants" className="text-indigo-600 hover:text-indigo-800">&larr; Back to all restaurants</Link>
        <h1 className="text-3xl font-bold mt-2">Menu for {restaurantName}</h1>
        <p>Select your dishes and place an order.</p>
      </div>
      <MenuList restaurantId={params.id} />
    </div>
  );
}