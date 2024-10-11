import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET_KEY || 'empty-secret-key';

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json({ isAuthenticated: false }, { status: 401 });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    return NextResponse.json({ isAuthenticated: true, user: decoded });
  } catch (error) {
    return NextResponse.json({ isAuthenticated: false , error}, { status: 401 });
  }
}