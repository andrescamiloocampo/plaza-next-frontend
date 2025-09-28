import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session || session.user?.role !== 'Propietario') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const restaurantId = searchParams.get('restaurantId');

  if (!restaurantId) {
    return NextResponse.json({ message: 'Restaurant ID is required' }, { status: 400 });
  }

  try {
    // This endpoint in plaza-ms should probably be paginated.
    // For now, fetching all dishes for the restaurant.
    const res = await fetch(`${process.env.PLAZA_MS_URL}/dishes?idRestaurant=${restaurantId}`, {
      headers: {
        'Authorization': `Bearer ${session.accessToken}`
      }
    });

    if (!res.ok) {
      const errorData = await res.json();
      return NextResponse.json({ message: errorData.message || 'API Error' }, { status: res.status });
    }

    const dishes = await res.json();
    return NextResponse.json(dishes);

  } catch (error) {
    console.error('Error in fetching dishes proxy:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}