"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getOrdersByStatus, updateOrderStatus } from "@/services/orderService";

type OrderStatus = "Pendiente" | "En preparación" | "Listo" | "Entregado" | "Cancelado";

interface Order {
  id: string;
  clientName: string;
  status: OrderStatus;
  items: { name: string; quantity: number }[];
  assignedEmployeeId?: string;
}

const availableStatuses: OrderStatus[] = ["Pendiente", "En preparación", "Listo", "Entregado"];

export default function OrderList() {
  const queryClient = useQueryClient();
  const [filterStatus, setFilterStatus] = useState<OrderStatus>("Pendiente");
  const [pin, setPin] = useState("");
  const [pinOrderId, setPinOrderId] = useState<string | null>(null);

  const { data: orders = [], isLoading, error } = useQuery<Order[]>({
    queryKey: ['orders', filterStatus],
    queryFn: () => getOrdersByStatus(filterStatus),
  });

  const updateStatusMutation = useMutation({
    mutationFn: updateOrderStatus,
    onSuccess: () => {
      queryClient.invalidateQueries(['orders', filterStatus]);
      if (pinOrderId) {
        setPin("");
        setPinOrderId(null);
      }
    },
  });

  const handleUpdateStatus = (orderId: string, newStatus: OrderStatus, securityPin?: string) => {
    updateStatusMutation.mutate({ orderId, newStatus, securityPin });
  };

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Manage Orders</h2>

      {updateStatusMutation.isError && <p className="p-4 mb-4 text-red-700 bg-red-100 rounded-lg">{(updateStatusMutation.error as Error).message}</p>}

      <div className="mb-4">
        <label htmlFor="statusFilter" className="block text-sm font-medium text-gray-700">Filter by status:</label>
        <select
            id="statusFilter"
            name="statusFilter"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as OrderStatus)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        >
            {availableStatuses.map(status => <option key={status} value={status}>{status}</option>)}
        </select>
      </div>

      {isLoading ? <p>Loading orders...</p> : error ? <p className="text-red-500">{(error as Error).message}</p> : (
        <div className="space-y-4">
          {orders.length > 0 ? orders.map((order) => (
            <div key={order.id} className="p-4 border rounded-lg shadow-sm bg-white">
              <div className="flex justify-between items-start">
                  <div>
                      <h3 className="font-bold text-lg">Order #{order.id.substring(0,8)} - {order.clientName}</h3>
                      <p className="text-gray-600"><strong>Status:</strong> {order.status}</p>
                      <ul className="list-disc list-inside">
                          {order.items.map(item => <li key={item.name}>{item.name} (x{item.quantity})</li>)}
                      </ul>
                      {order.assignedEmployeeId && <p className="text-sm text-gray-500">Assigned to: {order.assignedEmployeeId.substring(0,8)}</p>}
                  </div>
                  <div className="flex flex-col space-y-2 items-end">
                      {order.status === "Pendiente" && (
                          <button onClick={() => handleUpdateStatus(order.id, "En preparación")} disabled={updateStatusMutation.isLoading} className="px-3 py-1 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 w-full text-center disabled:bg-gray-400">Assign & Prepare</button>
                      )}
                      {order.status === "En preparación" && (
                          <button onClick={() => handleUpdateStatus(order.id, "Listo")} disabled={updateStatusMutation.isLoading} className="px-3 py-1 text-sm font-medium text-white bg-green-500 rounded-md hover:bg-green-600 w-full text-center disabled:bg-gray-400">Mark as Ready</button>
                      )}
                      {order.status === "Listo" && (
                        pinOrderId === order.id ? (
                            <div className="flex flex-col items-end gap-2">
                                <input
                                    type="text"
                                    placeholder="Enter PIN"
                                    value={pin}
                                    onChange={(e) => setPin(e.target.value)}
                                    className="block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
                                />
                                <button onClick={() => handleUpdateStatus(order.id, "Entregado", pin)} disabled={updateStatusMutation.isLoading} className="px-3 py-1 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700 w-full text-center disabled:bg-gray-400">Confirm Delivery</button>
                            </div>
                        ) : (
                            <button onClick={() => setPinOrderId(order.id)} disabled={updateStatusMutation.isLoading} className="px-3 py-1 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700 w-full text-center disabled:bg-gray-400">Deliver</button>
                        )
                      )}
                  </div>
              </div>
            </div>
          )) : <p>No orders with status "{filterStatus}".</p>}
        </div>
      )}
    </div>
  );
}