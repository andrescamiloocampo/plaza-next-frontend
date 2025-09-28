import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session || session.user?.role !== 'Empleado') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status') || 'Pendiente';
  const page = searchParams.get('page') || '1';
  const size = searchParams.get('size') || '10';

  try {
    // The microservice needs to know which restaurant the employee belongs to.
    // This should ideally be part of the employee's session token or fetched separately.
    // Assuming the microservice can infer this from the authenticated user.
    const res = await fetch(`${process.env.PLAZA_MS_URL}/orders/list?status=${status}&page=${page}&size=${size}`, {
        headers: {
            // 'Authorization': `Bearer ${session.accessToken}`
        }
    });

    if (!res.ok) {
      const errorData = await res.json();
      return NextResponse.json({ message: errorData.message || 'API Error' }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data.content); // Assuming paginated response

  } catch (error) {
    console.error('Error in fetching employee orders proxy:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}