import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET_KEY || "empty-secret-key";

export async function POST(request: Request) {
  const body = await request.json();
  const { correo, contrasena } = body;

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_ENDPOINT}clients/login`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: correo, password: contrasena }),
    }
  );
  if (response.ok) {
    const data = await response.json();
    const token = jwt.sign({ user: data }, SECRET_KEY, {
      expiresIn: "1d",
    });

    return NextResponse.json({
      success: true,
      user: data,
      token,
    });
  }

  return NextResponse.json(
    {
      success: false,
      message: "Cliente o detalles no existen",
    },
    { status: 401 }
  );
}
