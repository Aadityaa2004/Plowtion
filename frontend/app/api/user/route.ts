import { NextResponse } from 'next/server';
import { auth } from '@/auth';

export async function GET() {
    const session = await auth();
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/${session.user.email}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    const data = await response.json();
    return NextResponse.json(data);
}

export async function POST(request: Request) {
    const session = await auth();
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/push-user`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email: session.user.email,
            name: session.user.name,
            image: session.user.image,
            ...body
        }),
    });

    const data = await response.json();
    return NextResponse.json(data);
} 