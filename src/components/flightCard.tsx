"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Plane,
  Calendar,
  Clock,
  AlertTriangle,
  MapPin,
  DollarSign,
  Star,
} from "lucide-react";
import { Vuelo as Flight } from "@/types/objects";
import Image from "next/image";
import { parseISO, format, isValid } from "date-fns";
import { es } from "date-fns/locale";
import { useRouter } from "next/navigation";

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
    return format(date, "dd 'de' MMMM, HH:mm", { locale: es });
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Fecha no disponible";
  }
};

export default function FlightCard({ flight }: { flight: Flight }) {
  const router = useRouter();
  const [showError, setShowError] = useState(false);
  const [departureDate, setDepartureDate] = useState<string>("Cargando...");
  const [arrivalDate, setArrivalDate] = useState<string>("Cargando...");

  useEffect(() => {
    const formattedDeparture = formatDateFromString(flight?.departureDate);
    const formattedArrival = formatDateFromString(flight?.arrivalDate);

    setDepartureDate(formattedDeparture);
    setArrivalDate(formattedArrival);

    if (
      formattedDeparture === "Fecha no disponible" ||
      formattedArrival === "Fecha no disponible" ||
      formattedDeparture === "Fecha inválida" ||
      formattedArrival === "Fecha inválida"
    ) {
      setShowError(true);
    }
  }, [flight]);

  return (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between">
          <span className="text-lg font-bold">{flight?.airline}</span>
          <div className="flex items-center space-x-2">
            <Star className="h-5 w-5 text-yellow-400" />
            <span>{flight?.rating.toFixed(1)}</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="aspect-video relative rounded-md overflow-hidden">
          <Image
            src={flight?.images?.[0]?.url || "/placeholders/flight.jpg"}
            alt={
              flight?.images?.[0]?.descripcion || `${flight?.airline} flight`
            }
            layout="fill"
            objectFit="cover"
            className="rounded-md hover:opacity-90 transition-opacity duration-300"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <p className="flex items-center space-x-2 text-sm">
              <MapPin className="h-4 w-4 text-primary" />
              <span>{flight?.origin}</span>
            </p>
            <p className="flex items-center space-x-2 text-sm">
              <Calendar className="h-4 w-4 text-primary" />
              <span>{departureDate}</span>
            </p>
          </div>
          <div className="space-y-2">
            <p className="flex items-center space-x-2 text-sm">
              <MapPin className="h-4 w-4 text-primary" />
              <span>{flight?.destination}</span>
            </p>
            <p className="flex items-center space-x-2 text-sm">
              <Clock className="h-4 w-4 text-primary" />
              <span>{arrivalDate}</span>
            </p>
          </div>
        </div>
        {showError && (
          <div className="flex items-center space-x-2 text-yellow-500 text-sm">
            <AlertTriangle className="h-4 w-4" />
            <span>
              Hubo un problema al formatear las fechas. Por favor, verifique los
              datos del vuelo.
            </span>
          </div>
        )}
        <div className="flex justify-between items-center">
          <div className="text-2xl font-bold">
            <DollarSign className="inline h-5 w-5 text-primary" />
            {flight?.price.toFixed(2)}
          </div>
          <Plane className="h-6 w-6 text-primary" />
        </div>
      </CardContent>
      <CardFooter>
        <Button
          onClick={() => router.push(`/viajes/${flight?.flightId}`)}
          className="w-full"
        >
          Ver detalles
        </Button>
      </CardFooter>
    </Card>
  );
}
