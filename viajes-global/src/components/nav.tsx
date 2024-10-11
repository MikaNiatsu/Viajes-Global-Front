"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ShoppingCart, User, LogOut, Settings, Menu } from "lucide-react";
import { useRouter } from "next/navigation";
const productCategories = [
  { name: "Vuelos", href: "/productos/vuelos" },
  { name: "Hoteles", href: "/productos/hoteles" },
  { name: "Paquetes", href: "/productos/paquetes" },
  { name: "Actividades", href: "/productos/actividades" },
];

interface NavProps {
  isLoggedIn: boolean;
  userEmail?: string;
  onLogout: () => void;
}

export default function Nav({ isLoggedIn, userEmail, onLogout }: NavProps) {
  const pathname = usePathname();

  const router = useRouter();
  const refresh = () => {
    router.refresh();
  }
  const navItems = [
    { name: "Inicio", href: "/" },
    { name: "Ofertas", href: "/ofertas" },
    { name: "Contacto", href: "/contacto" },
  ];
  
  return (
    <header className="border-b sticky top-0 z-50 bg-background">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/" className="text-2xl font-bold mr-6">
            Viajes Global
          </Link>
          <nav className="hidden md:flex space-x-4">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  pathname === item.href
                    ? "text-primary"
                    : "text-muted-foreground"
                }`}
              >
                {item.name}
              </Link>
            ))}
            <DropdownMenu>
              <DropdownMenuTrigger className="text-sm font-medium transition-colors hover:text-primary">
                Productos
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {productCategories.map((category) => (
                  <DropdownMenuItem key={category.name}>
                    <Link href={category.href} className="w-full">
                      {category.name}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="icon">
            <ShoppingCart className="h-5 w-5" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                {isLoggedIn ? (
                  <Avatar>
                    <AvatarImage
                      src="/placeholder.svg?height=32&width=32"
                      alt="@usuario"
                    />
                    <AvatarFallback>{userEmail?.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                ) : (
                  <User className="h-5 w-5" />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {isLoggedIn ? (
                <>
                  <DropdownMenuItem disabled>
                    <User className="mr-2 h-4 w-4" />
                    <span>{userEmail}</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => console.log("Settings")}>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Ajustes</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={onLogout} onClick={refresh}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Cerrar sesión</span>
                  </DropdownMenuItem>
                </>
              ) : (
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <Link href="/ingreso">Iniciar sesión</Link>
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <nav className="flex flex-col space-y-4">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`text-sm font-medium transition-colors hover:text-primary ${
                      pathname === item.href
                        ? "text-primary"
                        : "text-muted-foreground"
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
                <DropdownMenu>
                  <DropdownMenuTrigger className="text-sm font-medium transition-colors hover:text-primary">
                    Productos
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {productCategories.map((category) => (
                      <DropdownMenuItem key={category.name}>
                        <Link href={category.href} className="w-full">
                          {category.name}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}