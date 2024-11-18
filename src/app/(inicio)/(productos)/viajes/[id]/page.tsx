"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Vuelo as Flight } from "@/types/objects";
import {
  Loader2,
  Plane,
  Calendar,
  Clock,
  MapPin,
  DollarSign,
  Star,
  ArrowLeft,
  Info,
  Luggage,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { parseISO, format, isValid } from "date-fns";
import { es } from "date-fns/locale";

const formatDateFromString = (
  dateString: string | Date | undefined
): string => {
  if (!dateString) {
    console.log("Date is undefined or null:", dateString);
    return "Fecha no disponible";
  }

  try {
    const date =
      typeof dateString === "string" ? parseISO(dateString) : dateString;
    if (!isValid(date)) {
      console.log("Invalid date:", dateString);
      return "Fecha inválida";
    }
    return format(date, "dd 'de' MMMM 'de' yyyy, HH:mm 'hrs'", { locale: es });
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Fecha no disponible";
  }
};

export default function FlightDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [flight, setFlight] = useState<Flight | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFlightDetails = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_ENDPOINT}flights/${id}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch flight details");
        }
        const data: Flight = await response.json();
        setFlight(data);
      } catch (err) {
        setError(
          "Error al cargar los detalles del vuelo. Por favor, intenta de nuevo más tarde."
        );
        console.error("Error fetching flight details:", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchFlightDetails();
    }
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !flight) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-center text-red-500 text-xl mb-4">
          {error || "No se encontró el vuelo"}
        </p>
        <div className="text-center">
          <Button onClick={() => router.push("/viajes")} size="lg">
            <ArrowLeft className="mr-2 h-5 w-5" /> Volver a la lista de vuelos
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="relative h-64 md:h-96 overflow-hidden">
        <Image
          src={flight.images?.[0]?.url || "/placeholders/flight.jpg"}
          alt={flight.images?.[0]?.descripcion || `${flight.airline} flight`}
          layout="fill"
          objectFit="cover"
          className="brightness-75"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 p-6 text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-2">
            {flight.airline} - Vuelo {flight.flightId}
          </h1>
          <p className="text-xl md:text-2xl">
            {flight.origin} a {flight.destination}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="transition-opacity duration-300 ease-in-out">
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a la lista
          </Button>

          <Card className="w-full max-w-4xl mx-auto shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="text-3xl font-bold text-primary">
                  Detalles del Vuelo
                </span>
                <Plane className="h-10 w-10 text-primary" />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-6 w-6 text-primary" />
                    <div>
                      <p className="text-sm text-gray-500">Origen</p>
                      <p className="text-lg font-semibold">{flight.origin}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-6 w-6 text-primary" />
                    <div>
                      <p className="text-sm text-gray-500">Fecha de Salida</p>
                      <p className="text-lg font-semibold">
                        {formatDateFromString(flight.departureDate)}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-6 w-6 text-primary" />
                    <div>
                      <p className="text-sm text-gray-500">Destino</p>
                      <p className="text-lg font-semibold">
                        {flight.destination}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Clock className="h-6 w-6 text-primary" />
                    <div>
                      <p className="text-sm text-gray-500">
                        Fecha de Llegada (Estimada)
                      </p>
                      <p className="text-lg font-semibold">
                        {formatDateFromString(flight.arrivalDate)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-2xl font-semibold flex items-center">
                  <Info className="h-6 w-6 mr-2 text-primary" />
                  Información Adicional
                </h3>
                <p className="text-gray-700">
                  {flight.description ||
                    "No hay descripción disponible para este vuelo."}
                </p>
                <div className="flex flex-wrap gap-4">
                  <Badge variant="secondary" className="text-sm py-1 px-3">
                    <Luggage className="h-4 w-4 mr-2" />
                    Equipaje incluido
                  </Badge>
                  <Badge variant="secondary" className="text-sm py-1 px-3">
                    <Users className="h-4 w-4 mr-2" />
                    {flight.stock} asientos disponibles
                  </Badge>
                </div>
              </div>

              <Separator />

              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <Star className="h-6 w-6 text-yellow-400" />
                  <span className="text-2xl font-bold">
                    {flight.rating.toFixed(1)}
                  </span>
                  <span className="text-gray-500">/ 5</span>
                </div>
                <div className="text-4xl font-bold flex items-center text-primary">
                  <DollarSign className="h-8 w-8" />
                  {flight.price.toFixed(2)}
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full text-lg py-6 text-xl"
                size="lg"
                onClick={() => router.push(`/paquetes`)}
              >
                Reservar este vuelo
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
