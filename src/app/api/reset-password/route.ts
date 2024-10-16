import { NextResponse } from "next/server";
import nodemailer from 'nodemailer';

function generateToken() {
  return Math.floor(100000 + Math.random() * 900000);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      console.error('Invalid email address:', email);
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }

    if (!process.env.EMAIL || !process.env.EMAIL_PASSWORD) {
      console.error('Missing email configuration');
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const token = generateToken();
    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "Reset Password",
      html: `<style>
          .container {
              background-color: #8B0A1A;
              padding: 20px;
              border-radius: 10px;
              color: white;
          }
          </style>
          <div class="container">
              <h2>Restablecer Contraseña</h2>
              <p>Estimado/a ${email},</p>
              <p>Has solicitado restablecer tu contraseña en Viajes Global.</p>
              <p>Tu código de restablecimiento es: <strong>${token}</strong></p>
              <p>Si no has solicitado restablecer tu contraseña, revisa el acceso de tu cuenta.</p>
              <p>Atentamente,</p>
              <p>Viajes Global</p>
          </div>`,
    };

    console.log('Attempting to send email to:', email);
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);
    return NextResponse.json({ token: token }, { status: 200 });
  } catch (error) {
    console.error('Error in POST handler:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}