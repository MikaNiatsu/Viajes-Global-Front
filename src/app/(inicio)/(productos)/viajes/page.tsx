"use client"

import { Suspense } from 'react'
import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Plane, Calendar, DollarSign } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { format } from "date-fns"

interface Flight {
  id: string
  from: string
  to: string
  airline: string
  departureDate: string
  price: number
}

const mockFlights: Flight[] = [
  { id: '1', from: 'New York', to: 'London', airline: 'American Airlines', departureDate: '2023-07-15', price: 450 },
  { id: '2', from: 'Los Angeles', to: 'Tokyo', airline: 'Japan Airlines', departureDate: '2023-07-20', price: 800 },
  { id: '3', from: 'Paris', to: 'Rome', airline: 'Air France', departureDate: '2023-07-18', price: 200 },
  { id: '4', from: 'Dubai', to: 'Singapore', airline: 'Emirates', departureDate: '2023-07-22', price: 600 },
  { id: '5', from: 'Sydney', to: 'Hong Kong', airline: 'Qantas', departureDate: '2023-07-25', price: 550 },
  { id: '6', from: 'London', to: 'New York', airline: 'British Airways', departureDate: '2023-07-17', price: 480 },
]

function FlightSearch() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [flights, setFlights] = useState<Flight[]>(mockFlights)
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
      filteredFlights = filteredFlights.filter(flight => flight.from.toLowerCase().includes(fromLocation.toLowerCase()))
    }
    if (toLocation && toLocation !== 'all') {
      filteredFlights = filteredFlights.filter(flight => flight.to.toLowerCase().includes(toLocation.toLowerCase()))
    }

    if (departureDate) {
      filteredFlights = filteredFlights.filter(flight => new Date(flight.departureDate).toDateString() === departureDate.toDateString())
    }

    filteredFlights.sort((a, b) => {
      if (sortBy === 'price') {
        return a.price - b.price
      } else if (sortBy === 'date') {
        return new Date(a.departureDate).getTime() - new Date(b.departureDate).getTime()
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
  const locations = Array.from(new Set(mockFlights.flatMap(flight => [flight.from, flight.to])))

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
          <Card key={flight.id}>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>{flight.from} a {flight.to}</span>
                <Plane className="h-6 w-6 text-primary" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-2">{flight.airline}</p>
              <p className="flex items-center mb-2">
                <Calendar className="h-4 w-4 mr-2 text-primary" />
                {new Date(flight.departureDate).toLocaleDateString()}
              </p>
              <p className="flex items-center font-bold text-lg">
                <DollarSign className="h-5 w-5 mr-1 text-primary" />
                {flight.price}
              </p>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Reservar ahora</Button>
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

// Default export wrapped in Suspense
export default function FlightsPage() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <FlightSearch />
    </Suspense>
  )
}