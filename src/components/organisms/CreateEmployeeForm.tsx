"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createEmployee } from "@/services/userService";

export default function CreateEmployeeForm() {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const restaurantId = session?.user?.restaurantId;

  const [formData, setFormData] = useState({
    name: "",
    lastName: "",
    identityDocument: "",
    cellPhone: "",
    email: "",
    password: "",
  });
  const [validationError, setValidationError] = useState("");

  const mutation = useMutation({
    mutationFn: createEmployee,
    onSuccess: () => {
      alert("Employee created successfully!");
      setFormData({
        name: "",
        lastName: "",
        identityDocument: "",
        cellPhone: "",
        email: "",
        password: "",
      });
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError("");

    if (!restaurantId) {
        setValidationError("Could not find your restaurant ID. Are you logged in correctly?");
        return;
    }
    if (!/^\d+$/.test(formData.identityDocument)) {
      setValidationError("Identity document must be numeric.");
      return;
    }
    if (!/^\+?\d{1,13}$/.test(formData.cellPhone)) {
      setValidationError("Phone number is invalid. Max 13 chars and can start with +.");
      return;
    }

    mutation.mutate({ ...formData, restaurantId });
  };

  if (!restaurantId) {
    return null;
  }

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Create New Employee</h2>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
        {validationError && <p className="text-yellow-600">{validationError}</p>}
        {mutation.isError && <p className="text-red-500">{(mutation.error as Error).message}</p>}
        {mutation.isSuccess && <p className="text-green-500">Employee created successfully!</p>}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
            <input type="text" name="name" id="name" required value={formData.name} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
            </div>
            <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Last Name</label>
            <input type="text" name="lastName" id="lastName" required value={formData.lastName} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
            </div>
            <div>
            <label htmlFor="identityDocument" className="block text-sm font-medium text-gray-700">Identity Document</label>
            <input type="text" name="identityDocument" id="identityDocument" required value={formData.identityDocument} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
            </div>
            <div>
            <label htmlFor="cellPhone" className="block text-sm font-medium text-gray-700">Cell Phone</label>
            <input type="text" name="cellPhone" id="cellPhone" required value={formData.cellPhone} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
            </div>
             <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input type="email" name="email" id="email" required value={formData.email} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
            </div>
            <div>
            <label htmlFor="password"  className="block text-sm font-medium text-gray-700">Password</label>
            <input type="password" name="password" id="password" required value={formData.password} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
            </div>
        </div>
        <div>
            <button type="submit" disabled={mutation.isLoading} className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-gray-400">
            {mutation.isLoading ? 'Creating...' : 'Create Employee'}
            </button>
        </div>
      </form>
    </div>
  );
}