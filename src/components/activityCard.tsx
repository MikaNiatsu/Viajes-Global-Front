"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, DollarSign, Star, Tag } from "lucide-react";
import Image from "next/image";
import { Actividad } from "@/types/objects";
import { useRouter } from "next/navigation";

export default function ActivityCard({ activity }: { activity: Actividad }) {
  const router = useRouter();

  return (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>{activity.name}</span>
          <Tag className="h-6 w-6 text-primary" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div
          className="aspect-video relative mb-4 cursor-pointer"
          onClick={() => router.push(`/actividades/${activity.activity_id}`)}
        >
          <Image
            src={activity.images[0]?.url || "/placeholders/activities.jpg"}
            alt={activity.images[0]?.descripcion || "Activity image"}
            layout="fill"
            objectFit="cover"
            className="rounded-md hover:opacity-90 transition-opacity duration-300"
          />
        </div>
        <p className="flex items-center mb-2">
          <MapPin className="h-4 w-4 mr-2 text-primary" />
          {activity.location}
        </p>
        <p className="flex items-center mb-2">
          <Star className="h-4 w-4 mr-2 text-yellow-400" />
          {activity.rating.toFixed(1)}
        </p>
        <p className="text-sm mb-2 line-clamp-2">{activity.description}</p>
        <p className="text-sm mb-2">Categoría: {activity.category}</p>
        <p className="flex items-center font-bold text-lg">
          <DollarSign className="h-5 w-5 mr-1 text-primary" />
          {activity.price}
        </p>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full"
          disabled={activity.stock === 0}
          onClick={() => router.push(`/actividades/${activity.activity_id}`)}
        >
          {activity.stock > 0 ? "Ver detalles" : "Agotado"}
        </Button>
      </CardFooter>
    </Card>
  );
}
