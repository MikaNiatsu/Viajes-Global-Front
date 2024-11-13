import { NextResponse } from 'next/server'

export async function POST() {
  localStorage.removeItem("auth_token");
  return NextResponse.json({ success: true })
}