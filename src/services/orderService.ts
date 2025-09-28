import { fetcher } from './api';

// --- Client Endpoints ---

export const placeOrder = async (orderData: { restaurantId: string, dishes: { idPlato: string, cantidad: number }[] }) => {
  return fetcher('/api/client/orders', {
    method: 'POST',
    body: JSON.stringify(orderData),
  });
};

export const getMyOrders = async () => {
  return fetcher('/api/client/my-orders');
};

export const cancelOrder = async (orderId: string) => {
  return fetcher('/api/client/cancel-order', {
    method: 'POST',
    body: JSON.stringify({ orderId }),
  });
};


// --- Employee Endpoints ---

export const getOrdersByStatus = async (status: string = 'Pendiente') => {
  return fetcher(`/api/employee/orders?status=${status}`);
};

export const updateOrderStatus = async (updateData: { orderId: string, newStatus: string, securityPin?: string }) => {
  return fetcher('/api/employee/update-order-status', {
    method: 'PATCH',
    body: JSON.stringify(updateData),
  });
};