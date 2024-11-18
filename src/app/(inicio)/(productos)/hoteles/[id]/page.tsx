
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Building, MapPin, DollarSign, Star, Loader2, ArrowLeft, Bed, Wifi, Car, Coffee } from 'lucide-react'
import Image from 'next/image'
import { Hotel } from '@/types/objects'

export default function HotelDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [hotel, setHotel] = useState<Hotel | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchHotel = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_ENDPOINT}hotels/${params.id}`)
        if (!response.ok) {
          throw new Error('Failed to fetch hotel details')
        }
        const data: Hotel = await response.json()
        setHotel(data)
      } catch (err) {
        setError('Error al cargar los detalles del hotel. Por favor, intenta de nuevo más tarde.')
        console.error('Error fetching hotel:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchHotel()
  }, [params.id])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (error || !hotel) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Button 
          variant="ghost" 
          onClick={() => router.back()}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver
        </Button>
        <p className="text-center text-red-500">{error || 'Hotel no encontrado'}</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button 
        variant="ghost" 
        onClick={() => router.back()}
        className="mb-4"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Volver a la lista
      </Button>

      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span className="text-3xl">{hotel.name}</span>
            <Building className="h-8 w-8 text-primary" />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="aspect-video relative rounded-lg overflow-hidden">
              <Image
                src={hotel.images[0]?.url || '/placeholders/hotel.jpg'}
                alt={hotel.images[0]?.descripcion || 'Hotel image'}
                layout="fill"
                objectFit="cover"
                priority
              />
            </div>
            <div className="space-y-4">
              <div className="flex items-center">
                <MapPin className="h-5 w-5 mr-2 text-primary" />
                <span className="text-lg">{hotel.city}, {hotel.country}</span>
              </div>
              <div className="flex items-center">
                <Star className="h-5 w-5 mr-2 text-yellow-400" />
                <span className="text-lg">{hotel.rating.toFixed(1)} / 5.0</span>
              </div>
              <div className="flex items-center">
                <DollarSign className="h-5 w-5 mr-2 text-primary" />
                <span className="text-2xl font-bold">{hotel.price_per_night}</span>
                <span className="ml-2 text-muted-foreground">por noche</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Descripción</h3>
            <p className="text-muted-foreground">{hotel.description}</p>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Servicios</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center space-x-2">
                <Wifi className="h-5 w-5 text-primary" />
                <span>WiFi gratis</span>
              </div>
              <div className="flex items-center space-x-2">
                <Car className="h-5 w-5 text-primary" />
                <span>Estacionamiento</span>
              </div>
              <div className="flex items-center space-x-2">
                <Coffee className="h-5 w-5 text-primary" />
                <span>Desayuno</span>
              </div>
              <div className="flex items-center space-x-2">
                <Bed className="h-5 w-5 text-primary" />
                <span>Habitaciones premium</span>
              </div>
            </div>
          </div>

          {hotel.images.length > 1 && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Más imágenes</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {typeof hotel.images === 'object' && hotel.images.slice(1).map((image, index) => (
                  <div key={index} className="aspect-video relative rounded-lg overflow-hidden">
                    <Image
                      src={image.url}
                      alt={image.descripcion || `Hotel image ${index + 2}`}
                      layout="fill"
                      objectFit="cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between items-center">
          <p className="text-sm text-muted-foreground">
            {hotel.stock} habitaciones disponibles
          </p>
          <Button size="lg" disabled={hotel.stock === 0} onClick={() => router.push(`/paquetes`)}>
            {hotel.stock > 0 ? 'Reservar ahora' : 'Sin disponibilidad'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}