import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const restaurantId = params.id;
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category') || 'All';
  const page = searchParams.get('page') || '1';
  const size = searchParams.get('size') || '10';

  if (!restaurantId) {
    return NextResponse.json({ message: 'Restaurant ID is required' }, { status: 400 });
  }

  try {
    // Construct the URL to the microservice
    let apiUrl = `${process.env.PLAZA_MS_URL}/dishes/list?idRestaurant=${restaurantId}&page=${page}&size=${size}`;
    if (category !== 'All') {
      apiUrl += `&category=${category}`;
    }

    const res = await fetch(apiUrl);

    if (!res.ok) {
      const errorData = await res.json();
      return NextResponse.json({ message: errorData.message || 'API Error' }, { status: res.status });
    }

    const data = await res.json();

    // The frontend expects a `dishes` and `categories` property.
    // The microservice response needs to be adapted.
    // For now, we'll assume the response is a list of dishes and we extract categories from it.
    const dishes = data.content || []; // Assuming paginated response
    const categories = Array.from(new Set(dishes.map((d: any) => d.category?.name))).filter(Boolean);

    return NextResponse.json({ dishes, categories });

  } catch (error) {
    console.error('Error in fetching menu proxy:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}