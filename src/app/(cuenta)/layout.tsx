import "./globals.css";
import { Nunito } from "next/font/google";
import Link  from "next/link";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Viajes Global",
  description: "Pagina de viajes",
};

const nunito = Nunito({
  weight: ["400", "700"],
  subsets: ["latin"],
  display: "swap",
});


export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={`${nunito.className} antialiased`}>
        <main className="mx-auto max-w-7xl p-4 md:p-6 md:pt-16">
          <div className="flex items-center justify-center">
            <div className="w-full md:w-1/2 lg:w-1/3">
              {children}
            </div>
          </div>
          <div className="flex justify-center mt-4">
            <Link href="/">
              <Button>Volver</Button>
            </Link>
          </div>
        </main>
      </body>
    </html>
  );
}
