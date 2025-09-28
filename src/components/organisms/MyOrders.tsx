"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getMyOrders, cancelOrder } from "@/services/orderService";

type OrderStatus = "Pendiente" | "En preparación" | "Listo" | "Entregado" | "Cancelado";

interface OrderLog {
  timestamp: string;
  status: OrderStatus;
  notes?: string;
}

interface Order {
  id: string;
  restaurantName: string;
  status: OrderStatus;
  items: { name: string; quantity: number }[];
  totalPrice: number;
  orderDate: string;
  logs: OrderLog[];
}

export default function MyOrders() {
  const queryClient = useQueryClient();

  const { data: orders = [], isLoading, error } = useQuery<Order[]>({
    queryKey: ['myOrders'],
    queryFn: getMyOrders,
  });

  const cancelMutation = useMutation({
    mutationFn: cancelOrder,
    onSuccess: () => {
      queryClient.invalidateQueries(['myOrders']);
      alert("Order cancelled successfully.");
    },
  });

  const handleCancelOrder = (orderId: string) => {
    const order = orders.find(o => o.id === orderId);
    if (order && order.status !== "Pendiente") {
        alert("Lo sentimos, tu pedido ya está en preparación y no puede cancelarse");
        return;
    }
    cancelMutation.mutate(orderId);
  };

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">My Orders</h2>
      {cancelMutation.isError && <p className="mb-4 text-center font-semibold text-red-600">{(cancelMutation.error as Error).message}</p>}

      {isLoading && <p>Loading your orders...</p>}
      {error instanceof Error && <p className="text-red-500">{error.message}</p>}

      {!isLoading && !error && (
        <div className="space-y-6">
          {orders.length > 0 ? (
            orders.map((order) => (
              <div key={order.id} className="p-4 border rounded-lg shadow-sm bg-white">
                <div className="flex flex-wrap justify-between items-start gap-4">
                    <div>
                        <h3 className="font-bold text-lg">Order at {order.restaurantName}</h3>
                        <p className="text-sm text-gray-500">Ordered on: {new Date(order.orderDate).toLocaleDateString()}</p>
                        <p className="font-semibold">Status: <span className="font-bold">{order.status}</span></p>
                        <p>Total: ${order.totalPrice.toFixed(2)}</p>
                    </div>
                    <div className="flex items-center">
                        {order.status === "Pendiente" && (
                            <button onClick={() => handleCancelOrder(order.id)} disabled={cancelMutation.isLoading} className="px-3 py-1 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 disabled:bg-gray-400">
                                {cancelMutation.isLoading ? 'Cancelling...' : 'Cancel Order'}
                            </button>
                        )}
                    </div>
                </div>
                <div className="mt-4 pt-4 border-t">
                    <h4 className="font-semibold">Order History (Traceability)</h4>
                    <ul className="mt-2 space-y-1 text-sm text-gray-600">
                        {order.logs.map(log => (
                            <li key={log.timestamp}>
                               <span className="font-medium">{new Date(log.timestamp).toLocaleString()}</span>: Status changed to <span className="font-semibold">{log.status}</span>.
                               {log.notes && <span className="text-xs italic"> ({log.notes})</span>}
                            </li>
                        ))}
                    </ul>
                </div>
              </div>
            ))
          ) : (
            <p>You haven't placed any orders yet.</p>
          )}
        </div>
      )}
    </div>
  );
}