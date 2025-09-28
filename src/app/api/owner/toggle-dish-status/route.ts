import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function PATCH(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session || session.user?.role !== 'Propietario') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { dishId, restaurantId, active } = body;

    // The microservice endpoint for this might be different, e.g., /dish/{id}/enable or /disable
    // Assuming a PATCH request to the dish ID can update its status.
    const res = await fetch(`${process.env.PLAZA_MS_URL}/dish/${dishId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.accessToken}`
      },
      body: JSON.stringify({
        active,
        idRestaurant: restaurantId // The microservice might need this for authZ
      }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      return NextResponse.json({ message: errorData.message || 'API Error' }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('Error in toggle-dish-status proxy:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}