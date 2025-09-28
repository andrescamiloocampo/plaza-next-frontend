import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, lastName, identityDocument, cellPhone, email, password } = body;

    const res = await fetch(`${process.env.USERS_MS_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        lastName,
        identityDocument,
        cellPhone,
        email,
        password,
      }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      // Forward the error from the microservice
      return NextResponse.json({ message: errorData.message || 'API Error' }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data, { status: 201 });

  } catch (error) {
    console.error('Error in client registration proxy:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}