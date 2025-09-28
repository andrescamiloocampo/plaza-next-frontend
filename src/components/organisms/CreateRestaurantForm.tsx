"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { createRestaurant } from "@/services/restaurantService";

export default function CreateRestaurantForm() {
  const [formData, setFormData] = useState({
    name: "",
    nit: "",
    address: "",
    phone: "",
    logoUrl: "",
    ownerId: "",
  });
  const [validationError, setValidationError] = useState("");

  const mutation = useMutation({
    mutationFn: createRestaurant,
    onSuccess: () => {
      alert("Restaurant created successfully!");
      setFormData({
        name: "",
        nit: "",
        address: "",
        phone: "",
        logoUrl: "",
        ownerId: "",
      });
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError("");

    // Basic Validations
    if (!/^\d+$/.test(formData.nit)) {
      setValidationError("NIT must be numeric.");
      return;
    }
    if (!/^\+?\d{1,13}$/.test(formData.phone)) {
      setValidationError("Phone number is invalid. Max 13 chars and can start with +.");
      return;
    }
    if (/^\d+$/.test(formData.name)) {
      setValidationError("Restaurant name cannot be only numbers.");
      return;
    }
    if (!formData.ownerId) {
      setValidationError("Owner ID is required.");
      return;
    }

    mutation.mutate(formData);
  };

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Create New Restaurant</h2>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
        {validationError && <p className="text-yellow-600">{validationError}</p>}
        {mutation.isError && <p className="text-red-500">{(mutation.error as Error).message}</p>}
        {mutation.isSuccess && <p className="text-green-500">Restaurant created successfully!</p>}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
            <input type="text" name="name" id="name" required value={formData.name} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
            </div>
            <div>
            <label htmlFor="nit" className="block text-sm font-medium text-gray-700">NIT</label>
            <input type="text" name="nit" id="nit" required value={formData.nit} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
            </div>
            <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
            <input type="text" name="address" id="address" required value={formData.address} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
            </div>
            <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone</label>
            <input type="text" name="phone" id="phone" required value={formData.phone} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
            </div>
            <div>
            <label htmlFor="logoUrl" className="block text-sm font-medium text-gray-700">Logo URL</label>
            <input type="url" name="logoUrl" id="logoUrl" required value={formData.logoUrl} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
            </div>
            <div>
            <label htmlFor="ownerId" className="block text-sm font-medium text-gray-700">Owner ID</label>
            <input type="text" name="ownerId" id="ownerId" required value={formData.ownerId} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
            </div>
        </div>
        <div>
            <button type="submit" disabled={mutation.isLoading} className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-gray-400">
            {mutation.isLoading ? 'Creating...' : 'Create Restaurant'}
            </button>
        </div>
      </form>
    </div>
  );
}