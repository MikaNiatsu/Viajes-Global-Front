import Footer from "@/components/footer";
import Header from "@/components/header";
import "./globals.css";
import { Nunito } from "next/font/google";
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="min-h-screen">
      <body className={`${nunito.className} antialiased min-h-screen flex flex-col`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="w-full">
            <Header />
          </div>
          
          <main className="flex-1 w-full">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {children}
            </div>
          </main>
          <div className="w-full">
          <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
