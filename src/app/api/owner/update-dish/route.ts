import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function PUT(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session || session.user?.role !== 'Propietario') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { dishId, restaurantId, price, description } = body;

    // The owner of the session should match the owner of the restaurant.
    // This validation should happen in the microservice, based on the auth token.

    const res = await fetch(`${process.env.PLAZA_MS_URL}/dish/${dishId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.accessToken}`
      },
      body: JSON.stringify({
        price,
        description,
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
    console.error('Error in update-dish proxy:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}