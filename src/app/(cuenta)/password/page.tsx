"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";

export default function PasswordRecovery() {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pin, setPin] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [stage, setStage] = useState<
    "email" | "pin" | "newPassword" | "success"
  >("email");
  const [token, setToken] = useState<number | null>(null);
  const { toast } = useToast();
  const handleEmailSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const exists = await fetch(
        process.env.NEXT_PUBLIC_ENDPOINT + "clients/getByEmail",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: email,
        }
      ).then((res) => res.json());
      if (!exists) {
        console.log(exists);
        throw new Error("Correo electrónico no encontrado.");
      }
      const response = await fetch("/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (!email) {
        throw new Error("Por favor, introduce tu correo electrónico.");
      }
      if (!response.ok) {
        throw new Error("Correo electrónico no encontrado.");
      }
      setToken(data.token);
      //eslint-disable-next-line
      setStage("pin");
      toast({
        title: "Código enviado",
        description:
          "Se ha enviado un código de recuperación a tu correo electrónico.",
      });
      //eslint-disable-next-line
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePinSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const pinString = pin.join("");
    setIsLoading(true);
    try {
      console.log("PIN submitted:", pinString);
      console.log("Token:", token);
      if (token !== null && pinString !== token.toString()) {
        throw new Error("PIN incorrecto");
      }
      setStage("newPassword");
      toast({
        title: "Código verificado",
        description:
          "El código de recuperación ha sido verificado correctamente.",
      });
      //eslint-disable-next-line
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error.message || "No se pudo verificar el código de recuperación.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewPasswordSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      console.log("New password submitted");
      if (newPassword !== confirmPassword) {
        throw new Error("Las contraseñas no coinciden");
      }

      toast({
        title: "Contraseña actualizada",
        description: "Tu contraseña ha sido actualizada correctamente.",
      });
      try {
        const response = await fetch(
          process.env.NEXT_PUBLIC_ENDPOINT + "clients/updatePassword",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, newPassword }),
          }
        );
        const data = await response.json();
        if (response.ok && data === true) {
          toast({
            title: "Contraseña actualizada",
            description: "Tu contraseña ha sido actualizada correctamente.",
          });
        }
        //eslint-disable-next-line
      } catch (error: any) {
        toast({
          title: "Error",
          description: "No se pudo actualizar la contraseña.",
          variant: "destructive",
        });
      }
      // Reset the form and go back to the initial stage
      setEmail("");
      setPin(["", "", "", "", "", ""]);
      setNewPassword("");
      setConfirmPassword("");
      setStage("success");
      //eslint-disable-next-line
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "No se pudo actualizar la contraseña.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePinChange = (index: number, value: string) => {
    const newPin = [...pin];
    newPin[index] = value;
    setPin(newPin);

    // Move focus to the next input if a digit is entered
    if (value && index < 5) {
      const nextInput = document.getElementById(`pin-${index + 1}`);
      if (nextInput) {
        (nextInput as HTMLInputElement).focus();
      }
    }
  };

  return (
    <>
      {/* Mobile Layout */}
      <div className="md:hidden min-h-screen">
        <div className="p-4 space-y-6">
          <h1 className="text-2xl font-bold">Recuperación de contraseña</h1>

          {/* Email Stage */}
          {stage === "email" && (
            <div className="space-y-6">
              <p className="text-base text-muted-foreground">
                Ingresa el correo electrónico asociado a tu cuenta para recibir
                un código de recuperación.
              </p>
              <form onSubmit={handleEmailSubmit} className="space-y-6">
                <div className="space-y-3">
                  <Label htmlFor="email" className="text-base">
                    Correo electrónico
                  </Label>
                  <Input
                    id="email"
                    placeholder="tu@email.com"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-12 text-base"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full h-12 text-base"
                  disabled={isLoading || !email}
                >
                  {isLoading ? "Enviando..." : "Enviar código"}
                </Button>
              </form>
            </div>
          )}

          {/* PIN Stage */}
          {stage === "pin" && (
            <div className="space-y-6">
              <p className="text-base text-muted-foreground">
                Por favor, introduce el código de recuperación enviado por
                correo electrónico.
              </p>
              <form onSubmit={handlePinSubmit} className="space-y-6">
                <div className="space-y-3">
                  <Label htmlFor="pin-0" className="text-base">
                    Código de recuperación
                  </Label>
                  <div className="flex justify-between gap-2">
                    {pin.map((digit, index) => (
                      <Input
                        key={index}
                        id={`pin-${index}`}
                        type="text"
                        inputMode="numeric"
                        pattern="\d"
                        maxLength={1}
                        className="w-12 h-12 text-center text-lg"
                        value={digit}
                        onChange={(e) => handlePinChange(index, e.target.value)}
                        required
                      />
                    ))}
                  </div>
                </div>
                <Button
                  type="submit"
                  className="w-full h-12 text-base"
                  disabled={isLoading || pin.some((digit) => !digit)}
                >
                  {isLoading ? "Verificando..." : "Verificar código"}
                </Button>
                <Button
                  variant="link"
                  type="button"
                  onClick={() => console.log("pin")}
                  className="w-full text-base"
                >
                  Volver a Enviar código
                </Button>
              </form>
            </div>
          )}

          {/* New Password Stage */}
          {stage === "newPassword" && (
            <div className="space-y-6">
              <p className="text-base text-muted-foreground">
                Ingresa tu nueva contraseña.
              </p>
              <form onSubmit={handleNewPasswordSubmit} className="space-y-6">
                <div className="space-y-3">
                  <Label htmlFor="newPassword" className="text-base">
                    Nueva contraseña
                  </Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    className="h-12 text-base"
                  />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="confirmPassword" className="text-base">
                    Confirmar contraseña
                  </Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="h-12 text-base"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full h-12 text-base"
                  disabled={
                    isLoading || !newPassword || newPassword !== confirmPassword
                  }
                >
                  {isLoading ? "Actualizando..." : "Cambiar contraseña"}
                </Button>
              </form>
            </div>
          )}

          {/* Success Stage */}
          {stage === "success" && (
            <div className="space-y-6">
              <p className="text-base text-green-600">
                Tu contraseña ha sido cambiada con éxito, ¡ahora puedes iniciar
                sesión!
              </p>
            </div>
          )}
        </div>

        {/* Bottom Navigation - Mobile */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-sm border-t">
          <Link href="/ingreso">
            <Button variant="outline" className="w-full h-12 text-base">
              Iniciar sesión
            </Button>
          </Link>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:flex min-h-screen items-center justify-center p-4">
        <div className="w-full max-w-sm">
          <Card className="w-full shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl font-bold">
                Recuperación de contraseña
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Email Stage */}
              {stage === "email" && (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Ingresa el correo electrónico asociado a tu cuenta para
                    recibir un código de recuperación.
                  </p>
                  <form onSubmit={handleEmailSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Correo electrónico</Label>
                      <Input
                        id="email"
                        placeholder="tu@email.com"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isLoading || !email}
                    >
                      {isLoading ? "Enviando..." : "Enviar código"}
                    </Button>
                  </form>
                </div>
              )}

              {/* PIN Stage */}
              {stage === "pin" && (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Por favor, introduce el código de recuperación enviado por
                    correo electrónico.
                  </p>
                  <form onSubmit={handlePinSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="pin-0">Código de recuperación</Label>
                      <div className="flex justify-between gap-2">
                        {pin.map((digit, index) => (
                          <Input
                            key={index}
                            id={`pin-${index}`}
                            type="text"
                            inputMode="numeric"
                            pattern="\d"
                            maxLength={1}
                            className="w-10 text-center"
                            value={digit}
                            onChange={(e) =>
                              handlePinChange(index, e.target.value)
                            }
                            required
                          />
                        ))}
                      </div>
                    </div>
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isLoading || pin.some((digit) => !digit)}
                    >
                      {isLoading ? "Verificando..." : "Verificar código"}
                    </Button>
                    <Button
                      variant="link"
                      type="button"
                      onClick={() => console.log("pin")}
                    >
                      Volver a Enviar código
                    </Button>
                  </form>
                </div>
              )}

              {/* New Password Stage */}
              {stage === "newPassword" && (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Ingresa tu nueva contraseña.
                  </p>
                  <form
                    onSubmit={handleNewPasswordSubmit}
                    className="space-y-4"
                  >
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">Nueva contraseña</Label>
                      <Input
                        id="newPassword"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">
                        Confirmar contraseña
                      </Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={
                        isLoading ||
                        !newPassword ||
                        newPassword !== confirmPassword
                      }
                    >
                      {isLoading ? "Actualizando..." : "Cambiar contraseña"}
                    </Button>
                  </form>
                </div>
              )}

              {/* Success Stage */}
              {stage === "success" && (
                <div className="space-y-4">
                  <p className="text-sm text-green-600">
                    Tu contraseña ha sido cambiada con éxito, ¡ahora puedes
                    iniciar sesión!
                  </p>
                </div>
              )}

              <div className="relative mt-6">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
              </div>
              <div className="text-center mt-6">
                <Link
                  href="/ingreso"
                  className="text-sm text-muted-foreground hover:text-primary"
                >
                  Iniciar sesión
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <Toaster />
    </>
  );
}
