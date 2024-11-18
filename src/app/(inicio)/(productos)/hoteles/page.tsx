"use client"

import { Suspense, useState, useEffect, useMemo } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Loader2 } from 'lucide-react'
import { Hotel } from '@/types/objects'
import  HotelCard  from '@/components/hotelCard'
function HotelSearch() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [hotels, setHotels] = useState<Hotel[]>([])
  const [sortBy, setSortBy] = useState<string>(searchParams.get('sortBy') || 'price')
  const [filterCity, setFilterCity] = useState<string>(searchParams.get('city') || 'all')
  const [maxPrice, setMaxPrice] = useState<number>(parseInt(searchParams.get('maxPrice') || '500'))
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchHotels = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_ENDPOINT}hotels/showAll`)
        if (!response.ok) {
          throw new Error('Failed to fetch hotels')
        }
        const data: Hotel[] = await response.json()
        setHotels(data)
      } catch (err) {
        setError('Error al cargar los hoteles. Por favor, intenta de nuevo más tarde.')
        console.error('Error fetching hotels:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchHotels()
  }, [])

  const filteredAndSortedHotels = useMemo(() => {
    let result = [...hotels]

    if (filterCity && filterCity !== 'all') {
      result = result.filter(hotel => hotel.city === filterCity)
    }

    result = result.filter(hotel => hotel.price_per_night <= maxPrice)

    result.sort((a, b) => {
      if (sortBy === 'price') {
        return a.price_per_night - b.price_per_night
      } else if (sortBy === 'rating') {
        return b.rating - a.rating
      }
      return 0
    })

    return result
  }, [hotels, filterCity, maxPrice, sortBy])

  useEffect(() => {
    const params = new URLSearchParams()
    if (sortBy) params.set('sortBy', sortBy)
    if (filterCity !== 'all') params.set('city', filterCity)
    if (maxPrice !== 500) params.set('maxPrice', maxPrice.toString())

    router.push(`/hoteles?${params.toString()}`)
  }, [sortBy, filterCity, maxPrice, router])

  const cities = useMemo(() => Array.from(new Set(hotels.map(hotel => hotel.city))), [hotels])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-center text-red-500">{error}</p>
      </div>
    )
  }

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
        {filteredAndSortedHotels.map(hotel => (
          <HotelCard key={hotel.hotel_id} hotel={hotel} />
        ))}
      </div>

      {filteredAndSortedHotels.length === 0 && (
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
