"use client";

import { useState } from "react";
//import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";


export default function RegistroForm() {
  const [isLoading, setIsLoading] = useState(false);
  //const router = useRouter()

  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault();
    setIsLoading(true);

    const target = event.target as typeof event.target & {
      nombre: { value: string };
      email: { value: string };
      password: { value: string };
    };

    const nombre = target.nombre.value;
    const email = target.email.value;
    const password = target.password.value;

    // TODO: Implement actual registration logic here
    console.log("Registration attempt", { nombre, email, password });

    setTimeout(() => {
      setIsLoading(false);
      // TODO: Handle successful registration (e.g., redirect to login or dashboard)
      // router.push('/dashboard')
    }, 3000);
  }

  return (
    <div className="grid gap-6">
      <form onSubmit={onSubmit}>
        <div className="grid gap-4">
          <div className="grid gap-1">
            <Label htmlFor="nombre">Nombre completo</Label>
            <Input
              id="nombre"
              placeholder="Juan Pérez"
              type="text"
              autoCapitalize="words"
              autoComplete="name"
              autoCorrect="off"
              disabled={isLoading}
            />
          </div>
          <div className="grid gap-1">
            <Label htmlFor="email">Correo electrónico</Label>
            <Input
              id="email"
              placeholder="nombre@ejemplo.com"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={isLoading}
            />
          </div>
          <div className="grid gap-1">
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              placeholder="••••••••"
              type="password"
              autoCapitalize="none"
              autoComplete="new-password"
              autoCorrect="off"
              disabled={isLoading}
            />
          </div>
          <Button disabled={isLoading}>
            {isLoading ? "Creando cuenta..." : "Crear cuenta"}
          </Button>
        </div>
      </form>
    </div>
  );
}
