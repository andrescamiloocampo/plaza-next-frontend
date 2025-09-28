import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { restaurantId, dishes } = body;

    const res = await fetch(`${process.env.PLAZA_MS_URL}/order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // The microservice will need the client's auth token
        // to identify the user placing the order.
        // 'Authorization': `Bearer ${session.accessToken}`
      },
      body: JSON.stringify({
        idClient: session.user.id, // Pass the client's ID from the session
        idRestaurant: restaurantId,
        dishes: dishes,
      }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      return NextResponse.json({ message: errorData.message || 'API Error' }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data, { status: 201 });

  } catch (error) {
    console.error('Error in place-order proxy:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}