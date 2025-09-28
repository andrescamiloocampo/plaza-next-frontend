import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    // The microservice should provide an endpoint to get orders by clientId.
    // The client ID is available in session.user.id
    const res = await fetch(`${process.env.PLAZA_MS_URL}/orders/by-client/${session.user.id}`);

    if (!res.ok) {
      const errorData = await res.json();
      return NextResponse.json({ message: errorData.message || 'API Error' }, { status: res.status });
    }

    let orders = await res.json();

    // For each order, fetch its traceability log. This is a simplification.
    // In a real-world scenario, this might be inefficient (N+1 problem).
    // A better approach would be for the `plaza-ms` to include the logs or
    // have a dedicated endpoint in `traceability-ms` to fetch logs for multiple orders.
    const ordersWithLogs = await Promise.all(
      orders.map(async (order: any) => {
        const logRes = await fetch(`${process.env.TRACEABILITY_MS_URL}/logs/order/${order.id}`);
        const logs = logRes.ok ? await logRes.json() : [];
        return { ...order, logs };
      })
    );

    return NextResponse.json(ordersWithLogs);

  } catch (error) {
    console.error('Error in my-orders proxy:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}