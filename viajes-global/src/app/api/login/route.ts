import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET_KEY || 'empty-secret-key';

export async function POST(request: Request) {
  const body = await request.json();
  const { email, password } = body;

  // This is a mock authentication. In a real app, you'd check against a database.
  if (email === 'user@example.com' && password === 'password') {
    const token = jwt.sign({ userId: '123', email }, SECRET_KEY, { expiresIn: '1d' });
    return NextResponse.json({ success: true, token, user: { email } });
  } else {
    return NextResponse.json({ success: false }, { status: 401 });
  }
}