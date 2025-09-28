"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    name: "",
    lastName: "",
    identityDocument: "",
    cellPhone: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Basic Validations
    if (!/^\d+$/.test(formData.identityDocument)) {
      setError("Identity document must be numeric.");
      return;
    }
     if (!/^\+?\d{1,13}$/.test(formData.cellPhone)) {
        setError("Phone number is invalid. Max 13 chars and can start with +.");
        return;
    }

    try {
      const res = await fetch(`/api/register/client`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to create account.");
      }

      setSuccess("Account created successfully! Redirecting to login...");

      setTimeout(() => {
          router.push("/login");
      }, 2000);

    } catch (err: any) {
      setError(err.message);
      setSuccess("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
        {error && <p className="text-red-500">{error}</p>}
        {success && <p className="text-green-500">{success}</p>}
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
            <div className="md:col-span-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                <input type="email" name="email" id="email" required value={formData.email} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
            </div>
            <div className="md:col-span-2">
                <label htmlFor="password"  className="block text-sm font-medium text-gray-700">Password</label>
                <input type="password" name="password" id="password" required value={formData.password} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
            </div>
        </div>
        <div>
            <button type="submit" className="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
            Create Account
            </button>
        </div>
    </form>
  );
}