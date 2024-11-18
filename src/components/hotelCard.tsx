"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building, MapPin, DollarSign, Star } from "lucide-react";
import Image from "next/image";
import { Hotel } from "@/types/objects";
import { useRouter } from "next/navigation";

export default function HotelCard({ hotel }: { hotel: Hotel }) {
  const router = useRouter();

  return (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>{hotel.name}</span>
          <Building className="h-6 w-6 text-primary" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div
          className="aspect-video relative mb-4 cursor-pointer"
          onClick={() => router.push(`/hoteles/${hotel.hotel_id}`)}
        >
          <Image
            src={hotel.images[0]?.url || "/placeholders/hotel.jpg"}
            alt={hotel.images[0]?.descripcion || "Hotel image"}
            layout="fill"
            objectFit="cover"
            className="rounded-md hover:opacity-90 transition-opacity duration-300"
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
        <p className="text-sm mb-2 line-clamp-2">{hotel.description}</p>
        <p className="flex items-center font-bold text-lg">
          <DollarSign className="h-5 w-5 mr-1 text-primary" />
          {hotel.price_per_night}
        </p>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full"
          disabled={hotel.stock === 0}
          onClick={() => router.push(`/hoteles/${hotel.hotel_id}`)}
        >
          {hotel.stock > 0 ? "Ver detalles" : "Sin disponibilidad"}
        </Button>
      </CardFooter>
    </Card>
  );
}
