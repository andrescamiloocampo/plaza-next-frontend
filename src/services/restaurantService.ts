import { fetcher } from './api';

export const createRestaurant = async (restaurantData: any) => {
  return fetcher('/api/admin/create-restaurant', {
    method: 'POST',
    body: JSON.stringify(restaurantData),
  });
};

export const getRestaurants = async ({ pageParam = 1 }) => {
  const size = 8; // Items per page
  const data = await fetcher(`/api/client/restaurants?page=${pageParam}&size=${size}`);
  return {
    ...data,
    nextPage: data.hasNext ? pageParam + 1 : undefined,
  };
};