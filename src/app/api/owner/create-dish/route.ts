import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session || session.user?.role !== 'Propietario') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { name, price, description, imageUrl, category, restaurantId } = body;

    // The microservice might expect a category ID instead of a name.
    // This logic might need to be more complex (e.g., fetching category ID first).
    // For now, assuming it accepts a string or has a default/lookup mechanism.

    const res = await fetch(`${process.env.PLAZA_MS_URL}/dish`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.accessToken}`
      },
      body: JSON.stringify({
        name,
        price,
        description,
        urlImagen: imageUrl,
        idCategoria: category, // Adjust if the microservice expects an ID
        idRestaurant: restaurantId,
      }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      return NextResponse.json({ message: errorData.message || 'API Error' }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data, { status: 201 });

  } catch (error) {
    console.error('Error in create-dish proxy:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}