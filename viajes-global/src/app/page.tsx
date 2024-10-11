"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { useAuth } from "@/hooks/useAuth";
// Mock data for destinations
const destinations = [
  { id: "caribe", name: "Playas del Caribe" },
  { id: "alpes", name: "Montañas de los Alpes" },
  { id: "europa", name: "Ciudades de Europa" },
  { id: "asia", name: "Maravillas de Asia" },
];

// Mock data for recommendations
const recommendations = [
  {
    id: 1,
    title: "Playas del Caribe",
    image: "https://picsum.photos/500/300",
  },
  {
    id: 2,
    title: "Montañas de los Alpes",
    image: "https://picsum.photos/500/300",
  },
  {
    id: 3,
    title: "Ciudades de Europa",
    image: "https://picsum.photos/500/300",
  },
  {
    id: 4,
    title: "Maravillas de Asia",
    image: "https://picsum.photos/500/300",
  },
  {
    id: 5,
    title: "Playas del Caribe",
    image: "https://picsum.photos/500/300",
  },
  {
    id: 6,
    title: "Montañas de los Alpes",
    image: "https://picsum.photos/500/300",
  },
  {
    id: 7,
    title: "Ciudades de Europa",
    image: "https://picsum.photos/500/300",
  },
];

// Mock data for offers
const offers = [
  {
    id: 1,
    title: "Escapada a París",
    description: "3 noches + vuelos desde $599",
    image: "https://picsum.photos/500/300",
  },
  {
    id: 2,
    title: "Aventura en Costa Rica",
    description: "7 noches todo incluido desde $899",
    image: "https://picsum.photos/500/300",
  },
  {
    id: 3,
    title: "Explora Tokio",
    description: "5 noches + tours desde $1299",
    image: "https://picsum.photos/500/300",
  },
];

export default function TravelStorePage() {
  const [destination, setDestination] = useState("");
  const [departureDate, setDepartureDate] = useState<Date>();
  const [returnDate, setReturnDate] = useState<Date>();
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const { isAuthenticated, isLoading, user } = useAuth();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Search:", {
      destination,
      departureDate,
      returnDate,
      adults,
      children,
    });
    // Implement search logic here
  };
  
  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 mb-10">
      {isAuthenticated && (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-8" role="alert">
          <p className="font-bold">Bienvenido, {user?.email}!</p>
          <p>Nos alegra verte de nuevo. ¿Listo para planear tu próximo viaje?</p>
        </div>
      )}

      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-4">Destinos recomendados</h2>
        <Carousel>
          <CarouselContent>
            {recommendations.map((rec) => (
              <CarouselItem key={rec.id} className="md:basis-1/2 lg:basis-1/3">
                <Card>
                  <CardContent className="p-0">
                    <Image
                      src={rec.image}
                      alt={rec.title}
                      className="w-full h-48 object-cover"
                      width={500}
                      height={300}
                    />
                    <div className="p-4">
                      <h3 className="font-semibold">{rec.title}</h3>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-4">Busca tu próximo viaje</h2>
        <form
          onSubmit={handleSearch}
          className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
        >
          <div>
            <Label htmlFor="destination">Destino</Label>
            <Select value={destination} onValueChange={setDestination}>
              <SelectTrigger id="destination">
                <SelectValue placeholder="Selecciona un destino" />
              </SelectTrigger>
              <SelectContent>
                {destinations.map((dest) => (
                  <SelectItem key={dest.id} value={dest.id}>
                    {dest.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="departureDate">Fecha de ida</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="departureDate"
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  {departureDate ? (
                    format(departureDate, "PP")
                  ) : (
                    <span>Selecciona una fecha</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={departureDate}
                  onSelect={setDepartureDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <div>
            <Label htmlFor="returnDate">Fecha de vuelta</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="returnDate"
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  {returnDate ? (
                    format(returnDate, "PP")
                  ) : (
                    <span>Selecciona una fecha</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={returnDate}
                  onSelect={setReturnDate}
                  disabled={(date) => date < (departureDate || new Date())}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <div>
            <Label htmlFor="adults">Adultos</Label>
            <Input
              id="adults"
              type="number"
              min="1"
              value={adults}
              onChange={(e) => setAdults(parseInt(e.target.value))}
            />
          </div>
          <div>
            <Label htmlFor="children">Niños</Label>
            <Input
              id="children"
              type="number"
              min="0"
              value={children}
              onChange={(e) => setChildren(parseInt(e.target.value))}
            />
          </div>
          <div className="flex items-end">
            <Button type="submit" className="w-full">
              Buscar
            </Button>
          </div>
        </form>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-4">Ofertas especiales</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {offers.map((offer) => (
            <Card key={offer.id}>
              <CardContent className="p-0">
                <Image
                  src={offer.image}
                  alt={offer.title}
                  className="w-full h-48 object-cover"
                  width={400}
                  height={200}
                />
                <div className="p-4">
                  <h3 className="font-semibold mb-2">{offer.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {offer.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-3xl font-bold mb-4">Información de interés</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-2">Consejos para viajeros</h3>
              <p className="text-sm text-muted-foreground">
                Descubre los mejores consejos para hacer tu viaje inolvidable y
                seguro.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-2">Destinos populares</h3>
              <p className="text-sm text-muted-foreground">
                Explora los lugares más visitados y planifica tu próxima
                aventura.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-2">Ofertas especiales</h3>
              <p className="text-sm text-muted-foreground">
                No te pierdas nuestras promociones exclusivas y ahorra en tu
                próximo viaje.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}