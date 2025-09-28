"use client";

import { useState } from "react";
import Image from "next/image";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getMenu } from "@/services/dishService";
import { placeOrder } from "@/services/orderService";

interface Dish {
  id: string;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
  category: string;
}

interface CartItem extends Dish {
    quantity: number;
}

interface MenuListProps {
  restaurantId: string;
}

export default function MenuList({ restaurantId }: MenuListProps) {
  const queryClient = useQueryClient();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [cart, setCart] = useState<CartItem[]>([]);

  const { data: menuData, isLoading, error } = useQuery({
    queryKey: ['menu', restaurantId, selectedCategory],
    queryFn: () => getMenu(restaurantId, selectedCategory),
  });

  const orderMutation = useMutation({
    mutationFn: placeOrder,
    onSuccess: () => {
      alert("Order placed successfully! You can track it in 'My Orders'.");
      setCart([]);
      queryClient.invalidateQueries(['myOrders']); // Invalidate user's orders list
    },
  });

  const addToCart = (dish: Dish) => {
    setCart(prevCart => {
        const existingItem = prevCart.find(item => item.id === dish.id);
        if (existingItem) {
            return prevCart.map(item => item.id === dish.id ? { ...item, quantity: item.quantity + 1 } : item);
        }
        return [...prevCart, { ...dish, quantity: 1 }];
    });
  };

  const removeFromCart = (dishId: string) => {
     setCart(prevCart => {
        const existingItem = prevCart.find(item => item.id === dishId);
        if (existingItem && existingItem.quantity > 1) {
            return prevCart.map(item => item.id === dishId ? { ...item, quantity: item.quantity - 1 } : item);
        }
        return prevCart.filter(item => item.id !== dishId);
    });
  }

  const handlePlaceOrder = () => {
    if (cart.length === 0) return;
    orderMutation.mutate({
      restaurantId,
      dishes: cart.map(item => ({ idPlato: item.id, cantidad: item.quantity })),
    });
  };

  const menuDishes = menuData?.dishes || [];
  const categories = ["All", ...(menuData?.categories || [])];
  const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalCartPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Menu Items */}
        <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">Menu</h2>
                <select onChange={(e) => setSelectedCategory(e.target.value)} value={selectedCategory} className="border-gray-300 rounded-md" disabled={isLoading}>
                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
            </div>

            {isLoading && <p>Loading menu...</p>}
            {error instanceof Error && <p className="text-red-500">{error.message}</p>}

            {!isLoading && !error && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {menuDishes.length > 0 ? menuDishes.map(dish => (
                        <div key={dish.id} className="border rounded-lg shadow-sm overflow-hidden">
                            <Image src={dish.imageUrl} alt={dish.name} width={300} height={200} className="w-full h-40 object-cover bg-gray-200"/>
                            <div className="p-4">
                                <h3 className="font-bold">{dish.name}</h3>
                                <p className="text-sm text-gray-500">{dish.description}</p>
                                <div className="flex justify-between items-center mt-4">
                                    <span className="font-semibold">${dish.price.toFixed(2)}</span>
                                    <button onClick={() => addToCart(dish)} className="px-3 py-1 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700">Add to Order</button>
                                </div>
                            </div>
                        </div>
                    )) : <p>No dishes found for this category.</p>}
                </div>
            )}
        </div>

        {/* Cart/Order Summary */}
        <div className="lg:col-span-1">
            <div className="sticky top-8 border rounded-lg shadow-sm p-4 bg-white">
                <h2 className="text-2xl font-bold mb-4">Your Order</h2>
                {cart.length === 0 ? (
                    <p>Your cart is empty. Add some dishes from the menu!</p>
                ) : (
                    <>
                        <div className="space-y-2">
                            {cart.map(item => (
                                <div key={item.id} className="flex justify-between items-center text-sm">
                                    <div>
                                        <p className="font-semibold">{item.name}</p>
                                        <p className="text-gray-600">${item.price.toFixed(2)} x {item.quantity}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button onClick={() => removeFromCart(item.id)} className="w-6 h-6 bg-gray-200 rounded-full">-</button>
                                        <span>{item.quantity}</span>
                                        <button onClick={() => addToCart(item)} className="w-6 h-6 bg-gray-200 rounded-full">+</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <hr className="my-4"/>
                        <div className="flex justify-between font-bold text-lg">
                            <span>Total:</span>
                            <span>${totalCartPrice.toFixed(2)}</span>
                        </div>
                        <button onClick={handlePlaceOrder} disabled={cart.length === 0 || orderMutation.isLoading} className="mt-4 w-full px-4 py-2 font-medium text-white bg-green-600 rounded-md hover:bg-green-700 disabled:bg-gray-400">
                           {orderMutation.isLoading ? "Placing Order..." : `Place Order (${totalCartItems} items)`}
                        </button>
                        {orderMutation.isError && <p className="mt-4 text-center text-red-600">{(orderMutation.error as Error).message}</p>}
                    </>
                )}
            </div>
        </div>
    </div>
  );
}