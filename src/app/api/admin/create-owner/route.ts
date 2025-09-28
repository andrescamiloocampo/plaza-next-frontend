import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session || session.user?.role !== 'Administrador') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { name, lastName, identityDocument, cellPhone, birthDate, email, password } = body;

    // TODO: The role ID for 'Propietario' might need to be fetched. Using a hardcoded value.
    const roleId = '2'; // Assuming '2' is the ID for the 'Propietario' role.

    const res = await fetch(`${process.env.USERS_MS_URL}/user/owner`, {
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
        birthDate,
        email,
        password,
        idRol: roleId,
      }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      return NextResponse.json({ message: errorData.message || 'API Error' }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data, { status: 201 });

  } catch (error) {
    console.error('Error in create-owner proxy:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}