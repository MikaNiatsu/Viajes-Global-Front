"use client"

import { Suspense } from 'react'
import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Plane, Calendar, DollarSign, Star } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { format } from "date-fns"
import Image from 'next/image'
import { Vuelo } from '@/types/objects'



const mockFlights: Vuelo[] = [
  { flight_id: 1, airline: 'American Airlines', origin: 'New York', destination: 'London', departure_date: new Date('2023-07-15'), arrival_date: new Date('2023-07-16'), price: 450, images: [{ url: '/placeholder.svg', descripcion: 'Avión' }], description: 'Vuelo directo a Londres', rating: 4.5, stock: 50 },
  { flight_id: 2, airline: 'Japan Airlines', origin: 'Los Angeles', destination: 'Tokyo', departure_date: new Date('2023-07-20'), arrival_date: new Date('2023-07-21'), price: 800, images: [{ url: '/placeholder.svg', descripcion: 'Avión' }], description: 'Vuelo directo a Tokio', rating: 4.7, stock: 30 },
  { flight_id: 3, airline: 'Air France', origin: 'Paris', destination: 'Rome', departure_date: new Date('2023-07-18'), arrival_date: new Date('2023-07-18'), price: 200, images: [{ url: '/placeholder.svg', descripcion: 'Avión' }], description: 'Vuelo corto a Roma', rating: 4.2, stock: 80 },
  { flight_id: 4, airline: 'Emirates', origin: 'Dubai', destination: 'Singapore', departure_date: new Date('2023-07-22'), arrival_date: new Date('2023-07-23'), price: 600, images: [{ url: '/placeholder.svg', descripcion: 'Avión' }], description: 'Vuelo de lujo a Singapur', rating: 4.8, stock: 40 },
  { flight_id: 5, airline: 'Qantas', origin: 'Sydney', destination: 'Hong Kong', departure_date: new Date('2023-07-25'), arrival_date: new Date('2023-07-26'), price: 550, images: [{ url: '/placeholder.svg', descripcion: 'Avión' }], description: 'Vuelo nocturno a Hong Kong', rating: 4.4, stock: 60 },
  { flight_id: 6, airline: 'British Airways', origin: 'London', destination: 'New York', departure_date: new Date('2023-07-17'), arrival_date: new Date('2023-07-17'), price: 480, images: [{ url: '/placeholder.svg', descripcion: 'Avión' }], description: 'Vuelo transatlántico a Nueva York', rating: 4.6, stock: 55 },
]

function FlightSearch() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [flights, setFlights] = useState<Vuelo[]>(mockFlights)
  const [sortBy, setSortBy] = useState<string>(searchParams.get('sortBy') || 'price')
  const [filterAirline, setFilterAirline] = useState<string>(searchParams.get('airline') || 'all')
  const [maxPrice, setMaxPrice] = useState<number>(parseInt(searchParams.get('maxPrice') || '1000'))
  const [fromLocation, setFromLocation] = useState<string>(searchParams.get('from') || 'all')
  const [toLocation, setToLocation] = useState<string>(searchParams.get('to') || 'all')
  const [departureDate, setDepartureDate] = useState<Date | undefined>(
    searchParams.get('date') ? new Date(searchParams.get('date') as string) : undefined
  )

  useEffect(() => {
    let filteredFlights = [...mockFlights]

    if (filterAirline && filterAirline !== 'all') {
      filteredFlights = filteredFlights.filter(flight => flight.airline === filterAirline)
    }

    filteredFlights = filteredFlights.filter(flight => flight.price <= maxPrice)

    if (fromLocation && fromLocation !== 'all') {
      filteredFlights = filteredFlights.filter(flight => flight.origin.toLowerCase().includes(fromLocation.toLowerCase()))
    }
    if (toLocation && toLocation !== 'all') {
      filteredFlights = filteredFlights.filter(flight => flight.destination.toLowerCase().includes(toLocation.toLowerCase()))
    }

    if (departureDate) {
      filteredFlights = filteredFlights.filter(flight => flight.departure_date.toDateString() === departureDate.toDateString())
    }

    filteredFlights.sort((a, b) => {
      if (sortBy === 'price') {
        return a.price - b.price
      } else if (sortBy === 'date') {
        return a.departure_date.getTime() - b.departure_date.getTime()
      } else if (sortBy === 'rating') {
        return b.rating - a.rating
      }
      return 0
    })

    setFlights(filteredFlights)

    const params = new URLSearchParams()
    if (sortBy) params.set('sortBy', sortBy)
    if (filterAirline !== 'all') params.set('airline', filterAirline)
    if (maxPrice !== 1000) params.set('maxPrice', maxPrice.toString())
    if (fromLocation !== 'all') params.set('from', fromLocation)
    if (toLocation !== 'all') params.set('to', toLocation)
    if (departureDate) params.set('date', departureDate.toISOString().split('T')[0])

    router.push(`/viajes?${params.toString()}`)
  }, [sortBy, filterAirline, maxPrice, fromLocation, toLocation, departureDate, router])

  const airlines = Array.from(new Set(mockFlights.map(flight => flight.airline)))
  const locations = Array.from(new Set(mockFlights.flatMap(flight => [flight.origin, flight.destination])))

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Vuelos Disponibles</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div>
          <Label htmlFor="sortBy">Ordenar por</Label>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger id="sortBy">
              <SelectValue placeholder="Seleccionar orden" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="price">Precio</SelectItem>
              <SelectItem value="date">Fecha</SelectItem>
              <SelectItem value="rating">Calificación</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="filterAirline">Filtrar por aerolínea</Label>
          <Select value={filterAirline} onValueChange={setFilterAirline}>
            <SelectTrigger id="filterAirline">
              <SelectValue placeholder="Todas las aerolíneas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las aerolíneas</SelectItem>
              {airlines.map(airline => (
                <SelectItem key={airline} value={airline}>{airline}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="maxPrice">Precio máximo: ${maxPrice}</Label>
          <Slider
            id="maxPrice"
            min={100}
            max={1000}
            step={50}
            value={[maxPrice]}
            onValueChange={(value) => setMaxPrice(value[0])}
            className="mt-2"
          />
        </div>

        <div>
          <Label htmlFor="fromLocation">Desde</Label>
          <Select value={fromLocation} onValueChange={setFromLocation}>
            <SelectTrigger id="fromLocation">
              <SelectValue placeholder="Seleccionar origen" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los orígenes</SelectItem>
              {locations.map(location => (
                <SelectItem key={location} value={location}>{location}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="toLocation">Hacia</Label>
          <Select value={toLocation} onValueChange={setToLocation}>
            <SelectTrigger id="toLocation">
              <SelectValue placeholder="Seleccionar destino" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los destinos</SelectItem>
              {locations.map(location => (
                <SelectItem key={location} value={location}>{location}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="departureDate">Fecha de salida</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={`w-full justify-start text-left font-normal ${!departureDate && "text-muted-foreground"}`}
              >
                <Calendar className="mr-2 h-4 w-4" />
                {departureDate ? format(departureDate, "PPP") : <span>Seleccionar fecha</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <CalendarComponent
                mode="single"
                selected={departureDate}
                onSelect={setDepartureDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {flights.map(flight => (
          <Card key={flight.flight_id}>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>{flight.origin} a {flight.destination}</span>
                <Plane className="h-6 w-6 text-primary" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-video relative mb-4">
                <Image
                  src={flight.images[0].url}
                  alt={flight.images[0].descripcion}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-md"
                />
              </div>
              <p className="text-muted-foreground mb-2">{flight.airline}</p>
              <p className="flex items-center mb-2">
                <Calendar className="h-4 w-4 mr-2 text-primary" />
                {format(flight.departure_date, "PPP")}
              </p>
              <p className="flex items-center mb-2">
                <Star className="h-4 w-4 mr-2 text-yellow-400" />
                {flight.rating.toFixed(1)}
              </p>
              <p className="text-sm mb-2">{flight.description}</p>
              <p className="flex items-center font-bold text-lg">
                <DollarSign className="h-5 w-5 mr-1 text-primary" />
                {flight.price}
              </p>
            </CardContent>
            <CardFooter>
              <Button className="w-full" disabled={flight.stock === 0}>
                {flight.stock > 0 ? 'Reservar ahora' : 'Agotado'}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {flights.length === 0 && (
        <p className="text-center text-muted-foreground mt-8">No se encontraron vuelos que coincidan con los criterios de búsqueda.</p>
      )}
    </div>
  )
}

export default function FlightsPage() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <FlightSearch />
    </Suspense>
  )
}