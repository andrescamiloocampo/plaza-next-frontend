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
    const { name, lastName, identityDocument, cellPhone, email, password, restaurantId } = body;

    // The microservice needs to validate that the authenticated owner
    // is the owner of the specified restaurantId.

    // TODO: The role ID for 'Empleado' might need to be fetched. Using a hardcoded value.
    const roleId = '3'; // Assuming '3' is the ID for the 'Empleado' role.

    const res = await fetch(`${process.env.USERS_MS_URL}/user/employee`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.accessToken}`
      },
      body: JSON.stringify({
        name,
        lastName,
        identityDocument,
        cellPhone,
        email,
        password,
        idRol: roleId,
        idRestaurant: restaurantId, // The microservice needs to associate the employee with a restaurant
      }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      return NextResponse.json({ message: errorData.message || 'API Error' }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data, { status: 201 });

  } catch (error) {
    console.error('Error in create-employee proxy:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}