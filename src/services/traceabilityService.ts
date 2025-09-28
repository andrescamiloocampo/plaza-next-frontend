import { fetcher } from './api';

export const getOrderEfficiency = async (restaurantId: string) => {
  if (!restaurantId) return [];
  return fetcher(`/api/owner/efficiency?restaurantId=${restaurantId}`);
};

export const getEmployeePerformance = async (restaurantId: string, employeeId: string) => {
    if (!restaurantId || !employeeId) return null;
    return fetcher(`/api/owner/performance?restaurantId=${restaurantId}&employeeId=${employeeId}`);
};