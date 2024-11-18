"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Hand } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useAuth } from "@/hooks/useAuth";
import TravelStorePageSkeleton from "@/components/mainSkeleton";

// Mock data for recommendations
const recommendations = [
  {
    id: 1,
    title: "Playas del Caribe",
    image: "https://picsum.photos/seed/caribe/800/600",
    description: "Relájate en las arenas blancas y aguas cristalinas",
  },
  {
    id: 2,
    title: "Montañas de los Alpes",
    image: "https://picsum.photos/seed/alpes/800/600",
    description: "Aventuras de invierno y vistas impresionantes",
  },
  {
    id: 3,
    title: "Ciudades de Europa",
    image: "https://picsum.photos/seed/europa/800/600",
    description: "Explora la rica historia y cultura europea",
  },
  {
    id: 4,
    title: "Maravillas de Asia",
    image: "https://picsum.photos/seed/asia/800/600",
    description: "Descubre templos antiguos y cocina exótica",
  },
  {
    id: 5,
    title: "Safaris en África",
    image: "https://picsum.photos/seed/africa/800/600",
    description: "Observa la vida salvaje en su hábitat natural",
  },
  {
    id: 6,
    title: "Islas del Pacífico",
    image: "https://picsum.photos/seed/pacifico/800/600",
    description: "Paraísos tropicales con playas de ensueño",
  },
  {
    id: 7,
    title: "Maravillas de Sudamérica",
    image: "https://picsum.photos/seed/sudamerica/800/600",
    description: "Desde la Amazonia hasta la Patagonia",
  },
];

// Mock data for offers
const offers = [
  {
    id: 1,
    title: "Escapada a París",
    description: "3 noches + vuelos desde $599",
    image: "https://picsum.photos/seed/paris/800/600",
  },
  {
    id: 2,
    title: "Aventura en Costa Rica",
    description: "7 noches todo incluido desde $899",
    image: "https://picsum.photos/seed/costarica/800/600",
  },
  {
    id: 3,
    title: "Explora Tokio",
    description: "5 noches + tours desde $1299",
    image: "https://picsum.photos/seed/tokio/800/600",
  },
];

export default function TravelStorePage() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    if (isInitialLoad) {
      const timer = setTimeout(() => setIsInitialLoad(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [isInitialLoad]);

  if (isLoading) {
    return <TravelStorePageSkeleton />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 mb-10">
      {isAuthenticated && (
        <div
          className="bg-gradient-to-r from-red-500 to-pink-600 text-white p-6 rounded-lg shadow-lg mb-8 animate-fade-in"
          role="alert"
        >
          <h2 className="text-2xl font-bold mb-2">¡Bienvenido, {user?.name}!</h2>
          <p className="text-lg">
            Nos alegra verte de nuevo. ¿Listo para descubrir tu próxima aventura?
          </p>
        </div>
      )}

      <section className="mb-16">
        <h2 className="text-4xl font-bold mb-6 text-center">Destinos que inspiran</h2>
        <Carousel className="w-full">
          <CarouselContent>
            {recommendations.map((rec) => (
              <CarouselItem key={rec.id} className="md:basis-1/2 lg:basis-1/3">
                <Card className="overflow-hidden transform transition duration-300 hover:scale-105">
                  <CardContent className="p-0 relative">
                    <Image
                      src={rec.image}
                      alt={rec.title}
                      className="w-full h-64 object-cover"
                      width={800}
                      height={600}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent p-6 flex flex-col justify-end">
                      <h3 className="font-bold text-2xl text-white mb-2">{rec.title}</h3>
                      <p className="text-white text-sm">{rec.description}</p>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>

          <div className="hidden md:block">
            <CarouselPrevious />
            <CarouselNext />
          </div>

          <div
            className={`md:hidden absolute inset-0 flex items-center justify-center pointer-events-none
            ${isInitialLoad ? "opacity-100" : "opacity-0"} 
            transition-opacity duration-500`}
          >
            <div className="bg-black/60 text-white px-6 py-3 rounded-lg flex items-center gap-2">
              <Hand className="w-6 h-6" />
              <span className="text-sm">Desliza para explorar</span>
            </div>
          </div>
        </Carousel>
      </section>

      <section className="mb-16">
        <h2 className="text-4xl font-bold mb-6 text-center">Ofertas irresistibles</h2>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {offers.map((offer) => (
            <Card key={offer.id} className="overflow-hidden transform transition duration-300 hover:scale-105">
              <CardContent className="p-0 relative">
                <Image
                  src={offer.image}
                  alt={offer.title}
                  className="w-full h-64 object-cover"
                  width={800}
                  height={600}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent p-6 flex flex-col justify-end">
                  <h3 className="font-bold text-2xl text-white mb-2">{offer.title}</h3>
                  <p className="text-white text-lg">{offer.description}</p>
                  <Button className="mt-4 w-full md:w-auto">Reservar ahora</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="mb-16">
        <h2 className="text-4xl font-bold mb-6 text-center">Información de interés</h2>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <Card className="bg-gradient-to-br from-green-400 to-blue-500 text-white">
            <CardContent className="p-6">
              <h3 className="font-bold text-2xl mb-3">Consejos para viajeros</h3>
              <p className="text-lg">
                Descubre los mejores consejos para hacer tu viaje inolvidable y seguro.
              </p>
              <Button variant="secondary" className="mt-4">Leer más</Button>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-purple-400 to-pink-500 text-white">
            <CardContent className="p-6">
              <h3 className="font-bold text-2xl mb-3">Destinos populares</h3>
              <p className="text-lg">
                Explora los lugares más visitados y planifica tu próxima aventura.
              </p>
              <Button variant="secondary" className="mt-4">Descubrir</Button>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-yellow-400 to-red-500 text-white">
            <CardContent className="p-6">
              <h3 className="font-bold text-2xl mb-3">Ofertas especiales</h3>
              <p className="text-lg">
                No te pierdas nuestras promociones exclusivas y ahorra en tu próximo viaje.
              </p>
              <Button variant="secondary" className="mt-4">Ver ofertas</Button>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="text-center">
        <h2 className="text-4xl font-bold mb-6">¿Listo para tu próxima aventura?</h2>
        <Button size="lg" className="text-lg px-8 py-6">Comienza a planear tu viaje</Button>
      </section>
    </div>
  );
}