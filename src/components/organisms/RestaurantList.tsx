"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { getRestaurants } from "@/services/restaurantService";

interface Restaurant {
  id: string;
  name: string;
  urlLogo: string;
}

export default function RestaurantList() {
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading, error, isFetching } = useQuery({
    queryKey: ['restaurants', currentPage],
    queryFn: () => getRestaurants({ pageParam: currentPage }),
    keepPreviousData: true,
  });

  const restaurants = data?.content || [];
  const totalPages = data?.totalPages || 1;

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Available Restaurants</h2>

      {isLoading && <p>Loading restaurants...</p>}
      {error instanceof Error && <p className="text-red-500">{error.message}</p>}
      {isFetching && <p className="text-sm text-gray-500">Updating...</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {restaurants.map((restaurant: Restaurant) => (
          <Link href={`/restaurants/${restaurant.id}`} key={restaurant.id}>
            <div className="block border rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-200 ease-in-out overflow-hidden">
                <div className="relative h-40 w-full bg-gray-200">
                    <Image src={restaurant.urlLogo} alt={`${restaurant.name} logo`} layout="fill" objectFit="cover" />
                </div>
                <div className="p-4">
                    <h3 className="font-bold text-lg">{restaurant.name}</h3>
                </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="mt-8 flex justify-center items-center space-x-4">
        <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1 || isFetching}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md disabled:bg-gray-400"
        >
            Previous
        </button>
        <span>Page {currentPage} of {totalPages}</span>
        <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages || isFetching}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md disabled:bg-gray-400"
        >
            Next
        </button>
      </div>
    </div>
  );
}