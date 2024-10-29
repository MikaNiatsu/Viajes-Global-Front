'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { toast } from "@/hooks/use-toast"
import { User, Bell, Mail, Phone, Shield, Eye, EyeOff } from 'lucide-react'

export default function ConfiguracionPage() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [emailNotifications, setEmailNotifications] = useState(false)
  const [pushNotifications, setPushNotifications] = useState(false)
  const [smsNotifications, setSmsNotifications] = useState(false)

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login')
    } else if (user) {
      setName(user.usuario || '')
      setEmail(user.correo || '')
      setEmailNotifications(user.eleccion_email || false)
      setPushNotifications(user.eleccion_push || false)
      setSmsNotifications(user.eleccion_sms || false)
    }
  }, [isLoading, isAuthenticated, user, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const updatedUser = {
        ...user,
        nombre: name,
        correo: email,
        telefono: phone,
        notificaciones: {
          email: emailNotifications,
          push: pushNotifications,
          sms: smsNotifications
        }
      }
      if (password) {
        updatedUser.contrasena = password
      }
      //await updateUser(updatedUser)
      toast({
        title: "Configuración actualizada",
        description: "Tus preferencias han sido guardadas exitosamente.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo actualizar la configuración. Por favor, intenta de nuevo.",
        variant: "destructive",
      })
      console.error("Error updating user:", error)
    }
  }

  if (isLoading || !isAuthenticated) {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <User className="h-6 w-6" />
            Configuración de Cuenta
          </CardTitle>
          <CardDescription>Actualiza tu información personal y preferencias de notificación</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">Nombre</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">Correo Electrónico</Label>
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
              <Label htmlFor="phone" className="text-sm font-medium">Número de Teléfono</Label>
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
              <Label htmlFor="password" className="text-sm font-medium">Nueva Contraseña (dejar en blanco para no cambiar)</Label>
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
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Preferencias de Notificación
              </h3>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Mail className="h-5 w-5 text-primary" />
                  <Label htmlFor="emailNotifications" className="text-sm font-medium">Notificaciones por Email</Label>
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
                  <Label htmlFor="pushNotifications" className="text-sm font-medium">Notificaciones Push</Label>
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
                  <Label htmlFor="smsNotifications" className="text-sm font-medium">Notificaciones SMS</Label>
                </div>
                <Switch
                  id="smsNotifications"
                  checked={smsNotifications}
                  onCheckedChange={setSmsNotifications}
                />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => router.push('/')}>Cancelar</Button>
          <Button onClick={handleSubmit} className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Guardar Cambios
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}