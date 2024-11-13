"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import {
  User,
  Bell,
  Mail,
  Phone,
  Shield,
  Eye,
  EyeOff,
  Loader2,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Toaster } from "@/components/ui/toaster";

export default function ConfiguracionPage() {
  const { user, isAuthenticated, isLoading, updateUser, logout } = useAuth();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [pushNotifications, setPushNotifications] = useState(false);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/ingreso");
    } else if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
      setPhone(user.phone || "");
      fetchNotificationPreferences();
    }
  }, [isLoading, isAuthenticated, user, router]);

  const fetchNotificationPreferences = async () => {
    if (!user) return;
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_ENDPOINT}notifications/client/${user.customer_id}`
      );
      if (response.ok) {
        const data = await response.json();
        setEmailNotifications(data.email);
        setPushNotifications(data.push);
        setSmsNotifications(data.sms);
      } else {
        throw new Error("Failed to fetch notification preferences");
      }
    } catch (error) {
      console.error("Error fetching notification preferences:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar las preferencias de notificación.",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    if (!user) return;
    e.preventDefault();
    setIsUpdating(true);
    try {
      const updatedUser = {
        customer_id: user.customer_id,
        name,
        email,
        phone,
      };

      const updateResponse = await fetch(
        `${process.env.NEXT_PUBLIC_ENDPOINT}clients/update`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedUser),
        }
      );

      if (!updateResponse.ok) {
        throw new Error("Failed to update user data");
      }

      const notificationPreferences = {
        customer_id: user.customer_id,
        push: pushNotifications,
        sms: smsNotifications,
        email: emailNotifications,
      };

      const notificationResponse = await fetch(
        `${process.env.NEXT_PUBLIC_ENDPOINT}notifications/update`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(notificationPreferences),
        }
      );

      if (!notificationResponse.ok) {
        throw new Error("Failed to update notification preferences");
      }

      if (password) {
        if (password !== confirmPassword) {
          toast({
            title: "Error",
            description: "Las contraseñas no coinciden.",
            variant: "destructive",
          });
          setIsUpdating(false);
          return;
        }
        const passwordResponse = await fetch(
          process.env.NEXT_PUBLIC_ENDPOINT + "clients/updatePassword",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, newPassword: password }),
          }
        );
        if (!passwordResponse.ok) {
          throw new Error("Failed to update password");
        }
      }

      await updateUser({
        ...updatedUser,
        eleccion_email: emailNotifications,
        eleccion_push: pushNotifications,
        eleccion_sms: smsNotifications,
      });

      toast({
        title: "Configuración actualizada",
        description: "Tus preferencias han sido guardadas exitosamente, vuelve a iniciar sesión.",
      });
      setTimeout(() => {
        logout();
      }, 3000);
    } catch (error) {
      toast({
        title: "Error",
        description:
          "No se pudo actualizar la configuración. Por favor, intenta de nuevo.",
        variant: "destructive",
      });
      console.error("Error updating user:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading || !isAuthenticated) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <User className="h-6 w-6" />
            Configuración de Cuenta
          </CardTitle>
          <CardDescription>
            Actualiza tu información personal y preferencias de notificación
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="personal" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="personal">Información Personal</TabsTrigger>
              <TabsTrigger value="notifications">Notificaciones</TabsTrigger>
            </TabsList>
            <TabsContent value="personal">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium">
                    Nombre
                  </Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Correo Electrónico
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-medium">
                    Número de Teléfono
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full"
                    placeholder="+1 (123) 456-7890"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium">
                    Nueva Contraseña (dejar en blanco para no cambiar)
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="confirmPassword"
                    className="text-sm font-medium"
                  >
                    Confirmar Nueva Contraseña
                  </Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full"
                  />
                </div>
              </form>
            </TabsContent>
            <TabsContent value="notifications">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Preferencias de Notificación
                </h3>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Mail className="h-5 w-5 text-primary" />
                    <Label
                      htmlFor="emailNotifications"
                      className="text-sm font-medium"
                    >
                      Notificaciones por Email
                    </Label>
                  </div>
                  <Switch
                    id="emailNotifications"
                    checked={emailNotifications}
                    onCheckedChange={setEmailNotifications}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Bell className="h-5 w-5 text-primary" />
                    <Label
                      htmlFor="pushNotifications"
                      className="text-sm font-medium"
                    >
                      Notificaciones Push
                    </Label>
                  </div>
                  <Switch
                    id="pushNotifications"
                    checked={pushNotifications}
                    onCheckedChange={setPushNotifications}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Phone className="h-5 w-5 text-primary" />
                    <Label
                      htmlFor="smsNotifications"
                      className="text-sm font-medium"
                    >
                      Notificaciones SMS
                    </Label>
                  </div>
                  <Switch
                    id="smsNotifications"
                    checked={smsNotifications}
                    onCheckedChange={setSmsNotifications}
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => router.push("/")}>
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isUpdating}
            className="flex items-center gap-2"
          >
            {isUpdating ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Shield className="h-5 w-5" />
            )}
            {isUpdating ? "Guardando..." : "Guardar Cambios"}
          </Button>
        </CardFooter>
      </Card>
      <Toaster />
    </div>
  );
}
