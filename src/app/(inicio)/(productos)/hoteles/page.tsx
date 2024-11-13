"use client"

import { Suspense } from 'react'
import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Building, MapPin, DollarSign, Star } from 'lucide-react'
import Image from 'next/image'
import { Hotel } from '@/types/objects'


const mockHotels: Hotel[] = [
  { hotel_id: 1, name: 'Grand Hotel', address: '123 Main St', city: 'New York', country: 'USA', price_per_night: 200, images: [{ url: '/placeholder.svg', descripcion: 'Hotel exterior' }], description: 'Lujoso hotel en el centro de la ciudad', rating: 4.5, stock: 10 },
  { hotel_id: 2, name: 'Beachside Resort', address: '456 Ocean Ave', city: 'Miami', country: 'USA', price_per_night: 300, images: [{ url: '/placeholder.svg', descripcion: 'Vista a la playa' }], description: 'Resort frente al mar con vistas espectaculares', rating: 4.7, stock: 5 },
  { hotel_id: 3, name: 'Mountain Lodge', address: '789 Pine Rd', city: 'Aspen', country: 'USA', price_per_night: 250, images: [{ url: '/placeholder.svg', descripcion: 'Lodge en la montaña' }], description: 'Acogedor lodge en las montañas', rating: 4.3, stock: 8 },
  { hotel_id: 4, name: 'City Center Inn', address: '101 Downtown Blvd', city: 'Chicago', country: 'USA', price_per_night: 150, images: [{ url: '/placeholder.svg', descripcion: 'Hotel en el centro' }], description: 'Hotel económico en el corazón de la ciudad', rating: 4.0, stock: 15 },
  { hotel_id: 5, name: 'Riverside Hotel', address: '202 River St', city: 'San Antonio', country: 'USA', price_per_night: 180, images: [{ url: '/placeholder.svg', descripcion: 'Hotel junto al río' }], description: 'Hotel con hermosas vistas al río', rating: 4.2, stock: 12 },
  { hotel_id: 6, name: 'Historic Inn', address: '303 Heritage Ln', city: 'Boston', country: 'USA', price_per_night: 220, images: [{ url: '/placeholder.svg', descripcion: 'Hotel histórico' }], description: 'Encantador hotel en un edificio histórico', rating: 4.6, stock: 7 },
]

function HotelSearch() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [hotels, setHotels] = useState<Hotel[]>(mockHotels)
  const [sortBy, setSortBy] = useState<string>(searchParams.get('sortBy') || 'price')
  const [filterCity, setFilterCity] = useState<string>(searchParams.get('city') || 'all')
  const [maxPrice, setMaxPrice] = useState<number>(parseInt(searchParams.get('maxPrice') || '500'))

  useEffect(() => {
    let filteredHotels = [...mockHotels]

    if (filterCity && filterCity !== 'all') {
      filteredHotels = filteredHotels.filter(hotel => hotel.city === filterCity)
    }

    filteredHotels = filteredHotels.filter(hotel => hotel.price_per_night <= maxPrice)

    filteredHotels.sort((a, b) => {
      if (sortBy === 'price') {
        return a.price_per_night - b.price_per_night
      } else if (sortBy === 'rating') {
        return b.rating - a.rating
      }
      return 0
    })

    setHotels(filteredHotels)

    const params = new URLSearchParams()
    if (sortBy) params.set('sortBy', sortBy)
    if (filterCity !== 'all') params.set('city', filterCity)
    if (maxPrice !== 500) params.set('maxPrice', maxPrice.toString())

    router.push(`/hoteles?${params.toString()}`)
  }, [sortBy, filterCity, maxPrice, router])

  const cities = Array.from(new Set(mockHotels.map(hotel => hotel.city)))

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Hoteles Disponibles</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div>
          <Label htmlFor="sortBy">Ordenar por</Label>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger id="sortBy">
              <SelectValue placeholder="Seleccionar orden" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="price">Precio</SelectItem>
              <SelectItem value="rating">Calificación</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="filterCity">Filtrar por ciudad</Label>
          <Select value={filterCity} onValueChange={setFilterCity}>
            <SelectTrigger id="filterCity">
              <SelectValue placeholder="Todas las ciudades" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las ciudades</SelectItem>
              {cities.map(city => (
                <SelectItem key={city} value={city}>{city}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="maxPrice">Precio máximo por noche: ${maxPrice}</Label>
          <Slider
            id="maxPrice"
            min={100}
            max={500}
            step={50}
            value={[maxPrice]}
            onValueChange={(value) => setMaxPrice(value[0])}
            className="mt-2"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {hotels.map(hotel => (
          <Card key={hotel.hotel_id}>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>{hotel.name}</span>
                <Building className="h-6 w-6 text-primary" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-video relative mb-4">
                <Image
                  src={hotel.images[0].url}
                  alt={hotel.images[0].descripcion}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-md"
                />
              </div>
              <p className="flex items-center mb-2">
                <MapPin className="h-4 w-4 mr-2 text-primary" />
                {hotel.city}, {hotel.country}
              </p>
              <p className="flex items-center mb-2">
                <Star className="h-4 w-4 mr-2 text-yellow-400" />
                {hotel.rating.toFixed(1)}
              </p>
              <p className="text-sm mb-2">{hotel.description}</p>
              <p className="flex items-center font-bold text-lg">
                <DollarSign className="h-5 w-5 mr-1 text-primary" />
                {hotel.price_per_night} / noche
              </p>
            </CardContent>
            <CardFooter>
              <Button className="w-full" disabled={hotel.stock === 0}>
                {hotel.stock > 0 ? 'Reservar ahora' : 'Agotado'}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {hotels.length === 0 && (
        <p className="text-center text-muted-foreground mt-8">No se encontraron hoteles que coincidan con los criterios de búsqueda.</p>
      )}
    </div>
  )
}

export default function HotelsPage() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <HotelSearch />
    </Suspense>
  )
}