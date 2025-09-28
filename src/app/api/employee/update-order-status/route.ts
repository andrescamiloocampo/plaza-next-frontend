import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function PATCH(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session || session.user?.role !== 'Empleado') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { orderId, newStatus, securityPin } = body;

    // The microservice should have a single endpoint to handle status changes
    // or different endpoints for each state transition.
    // Assuming a single endpoint for simplicity.
    const res = await fetch(`${process.env.PLAZA_MS_URL}/order/${orderId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        // 'Authorization': `Bearer ${session.accessToken}`
      },
      body: JSON.stringify({
        status: newStatus,
        securityPin: securityPin, // Will be undefined if not provided
      }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      return NextResponse.json({ message: errorData.message || 'API Error' }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('Error in update-order-status proxy:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}