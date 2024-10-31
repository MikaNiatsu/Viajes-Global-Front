import "./globals.css";
import { Nunito } from "next/font/google";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeProvider } from "next-themes";

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
       <body className={`${nunito.className} antialiased bg-background min-h-screen`}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        {/* Mobile Layout */}
        <div className="md:hidden">
          <main className="min-h-screen">
            <div className="p-4 space-y-4">
              {children}
            </div>
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-sm border-t">
              <Link href="/">
                <Button variant="outline" className="w-full">
                  Volver
                </Button>
              </Link>
            </div>
          </main>
        </div>

        {/* Desktop Layout */}
        <div className="hidden md:block">
          <main className="min-h-screen flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-sm">
              {children}
              <div className="mt-4 flex justify-center">
                <Link href="/">
                  <Button variant="outline">Volver</Button>
                </Link>
              </div>
            </div>
          </main>
        </div>
      </ThemeProvider>
    </body>
    </html>
  );
}
