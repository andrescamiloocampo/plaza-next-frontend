"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createDish } from "@/services/dishService";

export default function CreateDishForm() {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const restaurantId = session?.user?.restaurantId;

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    imageUrl: "",
    category: "",
  });
  const [validationError, setValidationError] = useState("");

  const mutation = useMutation({
    mutationFn: createDish,
    onSuccess: () => {
      queryClient.invalidateQueries(['dishes', restaurantId]);
      alert("Dish created successfully!");
      setFormData({
        name: "",
        price: "",
        description: "",
        imageUrl: "",
        category: "",
      });
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError("");

    if (!restaurantId) {
        setValidationError("Could not find your restaurant ID. Are you logged in correctly?");
        return;
    }

    const priceNumber = parseInt(formData.price, 10);
    if (isNaN(priceNumber) || priceNumber <= 0) {
      setValidationError("Price must be a positive number greater than 0.");
      return;
    }

    mutation.mutate({ ...formData, price: priceNumber, restaurantId });
  };

  if (!restaurantId) {
    return null; // Don't render the form if there's no restaurant ID
  }

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Create New Dish</h2>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
        {validationError && <p className="text-yellow-600">{validationError}</p>}
        {mutation.isError && <p className="text-red-500">{(mutation.error as Error).message}</p>}
        {mutation.isSuccess && <p className="text-green-500">Dish created successfully!</p>}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                <input type="text" name="name" id="name" required value={formData.name} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
            </div>
            <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price</label>
                <input type="number" name="price" id="price" required value={formData.price} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
            </div>
            <div className="md:col-span-2">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                <input type="text" name="description" id="description" required value={formData.description} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
            </div>
            <div className="md:col-span-2">
                <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">Image URL</label>
                <input type="url" name="imageUrl" id="imageUrl" required value={formData.imageUrl} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
            </div>
             <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
                <input type="text" name="category" id="category" required value={formData.category} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
            </div>
        </div>
        <div>
            <button type="submit" disabled={mutation.isLoading} className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-gray-400">
            {mutation.isLoading ? 'Creating...' : 'Create Dish'}
            </button>
        </div>
      </form>
    </div>
  );
}