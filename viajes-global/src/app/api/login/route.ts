import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET_KEY || 'empty-secret-key';

export async function POST(request: Request) {
  const body = await request.json();
  const { correo, contrasena } = body;

  if (correo === 'user@example.com' && contrasena === 'password') {
    const token = jwt.sign({ userId: '12', correo }, SECRET_KEY, { expiresIn: '1d' });
    return NextResponse.json({ success: true, token, user: { correo } });
  } else {
    return NextResponse.json({ success: false }, { status: 401 });
  }
}