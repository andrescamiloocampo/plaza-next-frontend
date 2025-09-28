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
  const employeeId = searchParams.get('employeeId');

  if (!restaurantId || !employeeId) {
    return NextResponse.json({ message: 'Restaurant ID and Employee ID are required' }, { status: 400 });
  }

  try {
    const res = await fetch(`${process.env.TRACEABILITY_MS_URL}/logs/orders/performance/${restaurantId}/${employeeId}`, {
      headers: {
        'Authorization': `Bearer ${session.accessToken}`
      }
    });

    if (!res.ok) {
      const errorData = await res.json();
      return NextResponse.json({ message: errorData.message || 'API Error' }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('Error in fetching performance proxy:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}