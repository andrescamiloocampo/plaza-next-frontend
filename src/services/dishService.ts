import { fetcher } from './api';

export const createDish = async (dishData: any) => {
  return fetcher('/api/owner/create-dish', {
    method: 'POST',
    body: JSON.stringify(dishData),
  });
};

export const getDishesByRestaurant = async (restaurantId: string) => {
  if (!restaurantId) return []; // Don't fetch if no restaurant ID is provided
  return fetcher(`/api/owner/dishes?restaurantId=${restaurantId}`);
};

export const updateDish = async (dishData: { dishId: string, price: number, description: string }) => {
  return fetcher('/api/owner/update-dish', {
    method: 'PUT',
    body: JSON.stringify(dishData),
  });
};

export const toggleDishStatus = async (dishData: { dishId: string, active: boolean }) => {
  return fetcher('/api/owner/toggle-dish-status', {
    method: 'PATCH',
    body: JSON.stringify(dishData),
  });
};

export const getMenu = async (restaurantId: string, category: string = 'All') => {
    return fetcher(`/api/client/restaurants/${restaurantId}/menu?category=${category}`);
};