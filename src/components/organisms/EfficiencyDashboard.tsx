"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getOrderEfficiency, getEmployeePerformance } from "@/services/traceabilityService";

interface OrderEfficiency {
  orderId: string;
  timeMinutes: number;
}

interface EmployeePerformance {
    employeeId: string;
    averageTimeMinutes: number;
}

export default function EfficiencyDashboard() {
  const [restaurantId, setRestaurantId] = useState("");
  const [employeeId, setEmployeeId] = useState("");

  const { data: efficiencyReport, isLoading: isLoadingEfficiency, error: errorEfficiency } = useQuery<OrderEfficiency[]>({
    queryKey: ['orderEfficiency', restaurantId],
    queryFn: () => getOrderEfficiency(restaurantId),
    enabled: !!restaurantId,
  });

  const { data: employeePerformance, isLoading: isLoadingPerformance, error: errorPerformance } = useQuery<EmployeePerformance>({
    queryKey: ['employeePerformance', restaurantId, employeeId],
    queryFn: () => getEmployeePerformance(restaurantId, employeeId),
    enabled: !!restaurantId && !!employeeId,
  });

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Efficiency Reports</h2>

      <div className="mb-6 p-4 border rounded-lg bg-white">
        <h3 className="text-xl font-semibold mb-2">Order Efficiency</h3>
        <div className="mb-4">
            <label htmlFor="restaurantIdForEfficiency" className="block text-sm font-medium text-gray-700">Enter Restaurant ID:</label>
            <input
                type="text"
                id="restaurantIdForEfficiency"
                value={restaurantId}
                onChange={(e) => setRestaurantId(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                placeholder="Enter Restaurant ID to see reports"
            />
        </div>

        {isLoadingEfficiency && <p>Loading efficiency report...</p>}
        {errorEfficiency instanceof Error && <p className="text-red-500">{errorEfficiency.message}</p>}

        {efficiencyReport && (
            <ul className="space-y-1">
                {efficiencyReport.map(report => (
                    <li key={report.orderId} className="text-sm">Order #{report.orderId.substring(0,8)}: <span className="font-semibold">{report.timeMinutes.toFixed(2)} minutes</span></li>
                ))}
            </ul>
        )}
      </div>

      <div className="p-4 border rounded-lg bg-white">
        <h3 className="text-xl font-semibold mb-2">Employee Performance Ranking</h3>
         <div className="mb-4 grid grid-cols-2 gap-4">
            <div>
                <label htmlFor="employeeIdForPerf" className="block text-sm font-medium text-gray-700">Enter Employee ID:</label>
                <input
                    type="text"
                    id="employeeIdForPerf"
                    value={employeeId}
                    onChange={(e) => setEmployeeId(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                    placeholder="Employee ID"
                    disabled={!restaurantId}
                />
            </div>
        </div>

        {isLoadingPerformance && <p>Loading employee performance...</p>}
        {errorPerformance instanceof Error && <p className="text-red-500">{errorPerformance.message}</p>}

        {employeePerformance && (
            <div>
                <p>Employee #{employeePerformance.employeeId.substring(0,8)} Average Time: <span className="font-semibold">{employeePerformance.averageTimeMinutes.toFixed(2)} minutes</span></p>
            </div>
        )}
      </div>
    </div>
  );
}