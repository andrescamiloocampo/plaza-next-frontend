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
    const { orderId } = body;

    // The microservice should handle the logic of only allowing cancellation
    // for orders in "Pendiente" state.
    const res = await fetch(`${process.env.PLAZA_MS_URL}/order/cancel`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // 'Authorization': `Bearer ${session.accessToken}`
      },
      body: JSON.stringify({
        idOrder: orderId,
        idClient: session.user.id // Ensure client can only cancel their own orders
      }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      return NextResponse.json({ message: errorData.message || 'API Error' }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('Error in cancel-order proxy:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}