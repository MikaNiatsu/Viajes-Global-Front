"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  MapPin,
  DollarSign,
  Star,
  Tag,
  Loader2,
  ArrowLeft,
} from "lucide-react";
import Image from "next/image";
import { Actividad } from "@/types/objects";

export default function ActivityDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [activity, setActivity] = useState<Actividad | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchActivity = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_ENDPOINT}activities/${params.id}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch activity details");
        }
        const data: Actividad = await response.json();
        setActivity(data);
      } catch (err) {
        setError(
          "Error al cargar los detalles de la actividad. Por favor, intenta de nuevo más tarde."
        );
        console.error("Error fetching activity:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchActivity();
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error || !activity) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" onClick={() => router.back()} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver
        </Button>
        <p className="text-center text-red-500">
          {error || "Actividad no encontrada"}
        </p>
      </div>
    );
  }

  const activityImages = Array.isArray(activity.images) ? activity.images : [];

  return (
    <div className="container mx-auto px-4 py-8">
      <Button variant="ghost" onClick={() => router.back()} className="mb-4">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Volver a la lista
      </Button>

      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span className="text-3xl">{activity.name}</span>
            <Tag className="h-8 w-8 text-primary" />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="aspect-video relative rounded-lg overflow-hidden">
              <Image
                src={activityImages[0]?.url || "/placeholders/activities.jpg"}
                alt={activityImages[0]?.descripcion || "Activity image"}
                layout="fill"
                objectFit="cover"
                priority
              />
            </div>
            <div className="space-y-4">
              <div className="flex items-center">
                <MapPin className="h-5 w-5 mr-2 text-primary" />
                <span className="text-lg">{activity.location}</span>
              </div>
              <div className="flex items-center">
                <Star className="h-5 w-5 mr-2 text-yellow-400" />
                <span className="text-lg">
                  {activity.rating.toFixed(1)} / 5.0
                </span>
              </div>
              <div className="flex items-center">
                <DollarSign className="h-5 w-5 mr-2 text-primary" />
                <span className="text-2xl font-bold">{activity.price}</span>
                <span className="ml-2 text-muted-foreground">por persona</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Descripción</h3>
            <p className="text-muted-foreground">{activity.description}</p>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Categoría</h3>
            <p className="text-muted-foreground">{activity.category}</p>
          </div>

          {activityImages.length > 1 && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Más imágenes</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {activityImages.slice(1).map((image, index) => (
                  <div
                    key={index}
                    className="aspect-video relative rounded-lg overflow-hidden"
                  >
                    <Image
                      src={image.url}
                      alt={image.descripcion || `Activity image ${index + 2}`}
                      layout="fill"
                      objectFit="cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between items-center">
          <p className="text-sm text-muted-foreground">
            {activity.stock} cupos disponibles
          </p>
          <Button size="lg" disabled={activity.stock === 0} onClick={() => router.push(`/paquetes`)}>
            {activity.stock > 0 ? "Reservar ahora" : "Agotado"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
