import Footer from "@/components/footer";
import "./globals.css";
import { Nunito } from "next/font/google";

export const metadata = {
  title: "Viajes Global",
  description: "Pagina de viajes",
};

const nunito = Nunito({
  weight: ["400", "700"],
  subsets: ["latin"],
  display: "swap",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={`${nunito.className} antialiased`}>
        <main className="mx-auto max-w-7xl">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
