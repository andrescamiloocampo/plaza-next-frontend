"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getDishesByRestaurant, updateDish, toggleDishStatus } from "@/services/dishService";

interface Dish {
  id: string;
  name: string;
  price: number;
  description: string;
  active: boolean;
  category: string;
}

export default function DishList() {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const restaurantId = session?.user?.restaurantId;
  const [editingDish, setEditingDish] = useState<Dish | null>(null);

  const { data: dishes = [], isLoading, error, isFetching } = useQuery<Dish[]>({
    queryKey: ['dishes', restaurantId],
    queryFn: () => getDishesByRestaurant(restaurantId!),
    enabled: !!restaurantId,
  });

  const updateMutation = useMutation({
    mutationFn: updateDish,
    onSuccess: () => {
      queryClient.invalidateQueries(['dishes', restaurantId]);
      setEditingDish(null);
    },
  });

  const toggleStatusMutation = useMutation({
    mutationFn: toggleDishStatus,
    onSuccess: () => {
      queryClient.invalidateQueries(['dishes', restaurantId]);
    },
  });

  const handleUpdateDish = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingDish) return;
    updateMutation.mutate({
      dishId: editingDish.id,
      price: editingDish.price,
      description: editingDish.description,
    });
  };

  const handleToggleActive = (dish: Dish) => {
    toggleStatusMutation.mutate({ dishId: dish.id, active: !dish.active });
  };

  if (!restaurantId) {
    return (
        <div className="mt-8 p-4 border rounded-lg bg-yellow-50 text-yellow-800">
            <h2 className="text-2xl font-bold mb-2">Manage Your Dishes</h2>
            <p>Your account is not associated with a restaurant. Please contact an administrator.</p>
        </div>
    );
  }

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Manage Your Dishes</h2>

      {isLoading && <p>Loading dishes...</p>}
      {error instanceof Error && <p className="text-red-500">{error.message}</p>}
      {isFetching && <p className="text-sm text-gray-500">Updating...</p>}

      <div className="space-y-4">
        {dishes.map((dish) => (
          <div key={dish.id} className="p-4 border rounded-lg shadow-sm bg-white">
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="font-bold text-lg">{dish.name} <span className={`text-sm font-medium px-2 py-1 rounded-full ${dish.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{dish.active ? 'Active' : 'Inactive'}</span></h3>
                    <p className="text-gray-600"><strong>Price:</strong> ${dish.price.toFixed(2)}</p>
                    <p className="text-gray-500">{dish.description}</p>
                    <p className="text-gray-500"><em>Category: {dish.category}</em></p>
                </div>
                <div className="flex space-x-2">
                    <button onClick={() => setEditingDish(dish)} className="px-3 py-1 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">Edit</button>
                    <button onClick={() => handleToggleActive(dish)} disabled={toggleStatusMutation.isLoading} className="px-3 py-1 text-sm font-medium text-white rounded-md disabled:bg-gray-400 ${dish.active ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-green-500 hover:bg-green-600'}`}>
                        {toggleStatusMutation.isLoading ? '...' : (dish.active ? 'Disable' : 'Enable')}
                    </button>
                </div>
            </div>
            {editingDish && editingDish.id === dish.id && (
                <form onSubmit={handleUpdateDish} className="mt-4 space-y-2">
                    {updateMutation.isError && <p className="text-red-500">{(updateMutation.error as Error).message}</p>}
                    <div className="flex gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Price</label>
                            <input type="number" value={editingDish.price} onChange={(e) => setEditingDish({...editingDish, price: parseFloat(e.target.value)})} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm" />
                        </div>
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700">Description</label>
                            <input type="text" value={editingDish.description} onChange={(e) => setEditingDish({...editingDish, description: e.target.value})} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm" />
                        </div>
                    </div>
                    <div className="flex justify-end gap-2">
                        <button type="button" onClick={() => setEditingDish(null)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300">Cancel</button>
                        <button type="submit" disabled={updateMutation.isLoading} className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:bg-gray-400">
                            {updateMutation.isLoading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            )}
          </div>
        ))}
        {dishes.length === 0 && restaurantId && !isLoading && <p>No dishes found for this restaurant.</p>}
      </div>
    </div>
  );
}