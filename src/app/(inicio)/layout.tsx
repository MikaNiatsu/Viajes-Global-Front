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
    <html lang="es">
      <body className={`${nunito.className} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div>
            <Header />
          </div>
          <main className="mx-auto max-w-7xl">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
