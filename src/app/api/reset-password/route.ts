import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

function generateToken() {
  return Math.floor(100000 + Math.random() * 900000);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email || typeof email !== "string" || !email.includes("@")) {
      console.error("Invalid email address:", email);
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    if (!process.env.EMAIL || !process.env.EMAIL_PASSWORD) {
      console.error("Missing email configuration");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
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
    background-color: white;
    max-width: 600px;
    margin: 20px auto;
    padding: 25px;
    border-radius: 15px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.08);
    font-family: Arial, sans-serif;
    border: 2px solid #FFE4E6;
}

h2 {
    color: #FF6B7A;
    margin-bottom: 20px;
    text-align: center;
    font-size: 24px;
    font-weight: 600;
}

.header-icon {
    font-size: 28px;
    display: block;
    text-align: center;
    margin-bottom: 10px;
}

p {
    color: #4A5568;
    line-height: 1.5;
    margin-bottom: 12px;
    font-size: 15px;
}

.emoji-text {
    display: flex;
    align-items: start;
    gap: 8px;
    margin-bottom: 12px;
}

.emoji {
    font-size: 18px;
    margin-top: 2px;
}

.token-container {
    background-color: #FFF5F5;
    border: 1px dashed #FFB3B3;
    border-radius: 8px;
    padding: 15px;
    margin: 15px auto;
    width: fit-content;
    text-align: center;
}

.token {
    color: #FF4757;
    font-size: 20px;
    font-weight: bold;
    letter-spacing: 1px;
}

.signature {
    color: #FF6B7A;
    font-weight: bold;
    text-align: center;
    margin-top: 20px;
}

.divider {
    border-top: 1px dashed #FFE4E6;
    margin: 15px 0;
}

.footer-icon {
    font-size: 22px;
    text-align: center;
    margin-top: 15px;
}
</style>

<div class="container">
    <div class="header-icon">🔐</div>
    <h2>Restablecer Contraseña</h2>
    
    <div class="emoji-text">
        <span class="emoji">👋</span>
        <p>Estimado/a ${email},</p>
    </div>
    
    <div class="emoji-text">
        <span class="emoji">📝</span>
        <p>Has solicitado restablecer tu contraseña en Viajes Global.</p>
    </div>
    
    <div class="emoji-text">
        <span class="emoji">🔑</span>
        <p>Tu código de restablecimiento es:</p>
    </div>

    <div class="token-container">
        <span class="token">${token}</span>
    </div>
    
    <div class="emoji-text">
        <span class="emoji">⚠️</span>
        <p>Si no has solicitado restablecer tu contraseña, revisa el acceso de tu cuenta.</p>
    </div>
    
    <div class="divider"></div>
    
    
    <div class="emoji-text">
        <span class="emoji">✨</span>
        <p>Atentamente,</p>
    </div>
    
    <p class="signature">Viajes Global</p>
    
    <div class="footer-icon">✈️</div>
</div>`,
    };

    console.log("Attempting to send email to:", email);
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", info.messageId);
    return NextResponse.json({ token: token }, { status: 200 });
  } catch (error) {
    console.error("Error in POST handler:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
