"use client";

import { Suspense, useState, useEffect, useMemo, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Calendar, Loader2 } from "lucide-react";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Vuelo } from "@/types/objects";
import FlightCard from "@/components/flightCard";

function FlightSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [allFlights, setAllFlights] = useState<Vuelo[]>([]);
  const [sortBy, setSortBy] = useState<string>(
    searchParams.get("sortBy") || "price"
  );
  const [filterAirline, setFilterAirline] = useState<string>(
    searchParams.get("airline") || "all"
  );
  const [maxPrice, setMaxPrice] = useState<number>(
    parseInt(searchParams.get("maxPrice") || "1000")
  );
  const [fromLocation, setFromLocation] = useState<string>(
    searchParams.get("from") || "all"
  );
  const [toLocation, setToLocation] = useState<string>(
    searchParams.get("to") || "all"
  );
  const [departureDate, setDepartureDate] = useState<Date | undefined>(
    searchParams.get("date")
      ? new Date(searchParams.get("date") as string)
      : undefined
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFlights = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_ENDPOINT}flights/showAll`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch flights");
        }
        const data: Vuelo[] = await response.json();
        setAllFlights(data);
      } catch (err) {
        setError(
          "Error al cargar los vuelos. Por favor, intenta de nuevo más tarde."
        );
        console.error("Error fetching flights:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFlights();
  }, []);

  const filterAndSortFlights = useCallback(
    (flights: Vuelo[]) => {
      let result = [...flights];

      if (filterAirline && filterAirline !== "all") {
        result = result.filter((flight) => flight.airline === filterAirline);
      }

      result = result.filter((flight) => flight.price <= maxPrice);

      if (fromLocation && fromLocation !== "all") {
        result = result.filter((flight) =>
          flight.origin.toLowerCase().includes(fromLocation.toLowerCase())
        );
      }

      if (toLocation && toLocation !== "all") {
        result = result.filter((flight) =>
          flight.destination.toLowerCase().includes(toLocation.toLowerCase())
        );
      }

      if (departureDate) {
        result = result.filter(
          (flight) =>
            new Date(flight.departureDate).toDateString() ===
            departureDate.toDateString()
        );
      }

      result.sort((a, b) => {
        if (sortBy === "price") {
          return a.price - b.price;
        } else if (sortBy === "date") {
          return (
            new Date(a.departureDate).getTime() -
            new Date(b.departureDate).getTime()
          );
        } else if (sortBy === "rating") {
          return b.rating - a.rating;
        }
        return 0;
      });

      return result;
    },
    [filterAirline, maxPrice, fromLocation, toLocation, departureDate, sortBy]
  );

  const filteredAndSortedFlights = useMemo(
    () => filterAndSortFlights(allFlights),
    [allFlights, filterAndSortFlights]
  );

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (sortBy) params.set("sortBy", sortBy);
    if (filterAirline !== "all") params.set("airline", filterAirline);
    if (maxPrice !== 1000) params.set("maxPrice", maxPrice.toString());
    if (fromLocation !== "all") params.set("from", fromLocation);
    if (toLocation !== "all") params.set("to", toLocation);
    if (departureDate) params.set("date", departureDate.toISOString());

    router.push(`/viajes?${params.toString()}`, { scroll: false });
  }, [
    sortBy,
    filterAirline,
    maxPrice,
    fromLocation,
    toLocation,
    departureDate,
    router,
    searchParams,
  ]);

  const airlines = useMemo(
    () => Array.from(new Set(allFlights.map((flight) => flight.airline))),
    [allFlights]
  );

  const locations = useMemo(
    () =>
      Array.from(
        new Set(
          allFlights.flatMap((flight) => [flight.origin, flight.destination])
        )
      ),
    [allFlights]
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-center text-red-500">{error}</p>
      </div>
    );
  }

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
              <SelectItem value="date">Fecha de salida</SelectItem>
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
              {airlines.map((airline) => (
                <SelectItem key={airline} value={airline}>
                  {airline}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="maxPrice">Precio máximo: ${maxPrice}</Label>
          <Slider
            id="maxPrice"
            min={0}
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
              {locations.map((location) => (
                <SelectItem key={location} value={location}>
                  {location}
                </SelectItem>
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
              {locations.map((location) => (
                <SelectItem key={location} value={location}>
                  {location}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="departureDate">Fecha de salida</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
                id="departureDate"
              >
                <Calendar className="mr-2 h-4 w-4" />
                {departureDate ? (
                  format(departureDate, "PPP")
                ) : (
                  <span className="text-muted-foreground">
                    Seleccionar fecha
                  </span>
                )}
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
        {filteredAndSortedFlights.map((flight) => (
          <FlightCard key={flight.flightId} flight={flight} />
        ))}
      </div>

      {filteredAndSortedFlights.length === 0 && (
        <p className="text-center text-muted-foreground mt-8">
          No se encontraron vuelos que coincidan con los criterios de búsqueda.
        </p>
      )}
    </div>
  );
}

export default function FlightsPage() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <FlightSearch />
    </Suspense>
  );
}
