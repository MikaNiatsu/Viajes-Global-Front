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
  const [stage, setStage] = useState<"email" | "pin" | "newPassword" | "success">("email");
  const { toast } = useToast();

  const handleEmailSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // TODO: Implement email submission logic here
      console.log("Password reset requested for:", email);
      // Simulating API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      // Check if email is valid <--
      if (!email) {
        throw new Error("Por favor, introduce tu correo electrónico.");
      }
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
        description:
          error.message || "No se pudo enviar el código de recuperación.",
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
      // TODO: Implement PIN verification logic here
      console.log("PIN submitted:", pinString);
      // Simulating API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      if (pinString !== "123456") {
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
      // TODO: Implement new password submission logic here
      console.log("New password submitted");
      if (newPassword !== confirmPassword) {
        throw new Error("Las contraseñas no coinciden");
      }
      // Simulating API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast({
        title: "Contraseña actualizada",
        description: "Tu contraseña ha sido actualizada correctamente.",
      });
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
      <Card className="mx-auto w-[400px] mt-40 mb-32">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Recuperación de contraseña
          </CardTitle>
        </CardHeader>
        <CardContent>
          {stage === "email" && (
            <div className="grid gap-6">
              <p className="text-sm text-muted-foreground">
                Ingresa el correo electrónico asociado a tu cuenta para recibir
                un código de recuperación.
              </p>
              <form onSubmit={handleEmailSubmit} className="grid gap-4">
                <div className="grid gap-2">
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
          {stage === "pin" && (
            <div className="grid gap-6">
              <p className="text-sm text-muted-foreground">
                Por favor, introduce el código de recuperación enviado por
                correo electrónico.
              </p>
              <form onSubmit={handlePinSubmit} className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="pin-0">Código de recuperación</Label>
                  <div className="flex justify-between">
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
                        onChange={(e) => handlePinChange(index, e.target.value)}
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
                <Button variant={"link"} type="button" onClick={() => console.log("pin")}>
                  Volver a Enviar código
                </Button>
              </form>
            </div>
          )}
          {stage === "newPassword" && (
            <div className="grid gap-6">
              <p className="text-sm text-muted-foreground">
                Ingresa tu nueva contraseña.
              </p>
              <form onSubmit={handleNewPasswordSubmit} className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="newPassword">Nueva contraseña</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
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
                    isLoading || !newPassword || newPassword !== confirmPassword
                  }
                >
                  {isLoading ? "Actualizando..." : "Cambiar contraseña"}
                </Button>
              </form>
            </div>
          )}
          {stage === "success" && (
            <div className="grid gap-6">
              <p className="text-sm text-muted-foreground text-green-600">
                Tu contraseña ha sido cambiada con exito, ahora puedes iniciar sesion!
              </p>
            </div>
          )}
          <div className="relative mt-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
          </div>
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
      <Toaster />
    </>
  );
}
