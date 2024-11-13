"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import {
  Plane,
  Building,
  MapPin,
  Calendar,
  DollarSign,
  Star,
  Tag,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";

import { format } from "date-fns";
import Image from "next/image";
import { Progress } from "@/components/ui/progress";
import { Vuelo, Hotel, Actividad } from "@/types/objects";



const mockFlights: Vuelo[] = [
  {
    flight_id: 1,
    airline: "American Airlines",
    origin: "New York",
    destination: "London",
    departure_date: new Date("2023-07-15"),
    arrival_date: new Date("2023-07-16"),
    price: 450,
    images: [{ url: "/placeholder.svg", descripcion: "Avión" }],
    description: "Vuelo directo a Londres",
    rating: 4.5,
    stock: 50,
  },
  {
    flight_id: 2,
    airline: "Japan Airlines",
    origin: "Los Angeles",
    destination: "Tokyo",
    departure_date: new Date("2023-07-20"),
    arrival_date: new Date("2023-07-21"),
    price: 800,
    images: [{ url: "/placeholder.svg", descripcion: "Avión" }],
    description: "Vuelo directo a Tokio",
    rating: 4.7,
    stock: 30,
  },
  {
    flight_id: 3,
    airline: "Air France",
    origin: "Paris",
    destination: "Rome",
    departure_date: new Date("2023-07-18"),
    arrival_date: new Date("2023-07-18"),
    price: 200,
    images: [{ url: "/placeholder.svg", descripcion: "Avión" }],
    description: "Vuelo corto a Roma",
    rating: 4.2,
    stock: 80,
  },
];

const mockHotels: Hotel[] = [
  {
    hotel_id: 1,
    name: "Grand Hotel",
    address: "123 Main St",
    city: "London",
    country: "UK",
    price_per_night: 200,
    images: [{ url: "/placeholder.svg", descripcion: "Hotel exterior" }],
    description: "Lujoso hotel en el centro de la ciudad",
    rating: 4.5,
    stock: 10,
  },
  {
    hotel_id: 2,
    name: "Tokyo Towers",
    address: "456 Sakura Ave",
    city: "Tokyo",
    country: "Japan",
    price_per_night: 300,
    images: [{ url: "/placeholder.svg", descripcion: "Vista de la ciudad" }],
    description: "Hotel moderno con vistas espectaculares",
    rating: 4.7,
    stock: 5,
  },
  {
    hotel_id: 3,
    name: "Roma Retreat",
    address: "789 Via Roma",
    city: "Rome",
    country: "Italy",
    price_per_night: 250,
    images: [{ url: "/placeholder.svg", descripcion: "Hotel histórico" }],
    description: "Encantador hotel en el corazón de Roma",
    rating: 4.3,
    stock: 8,
  },
];

const mockActivities: Actividad[] = [
  {
    activity_id: 1,
    name: "Tour por Londres",
    description: "Explora los lugares más emblemáticos de Londres",
    price: 50,
    location: "London",
    category: "Tour",
    images: [{ url: "/placeholder.svg", descripcion: "Tour por Londres" }],
    rating: 4.5,
    stock: 20,
  },
  {
    activity_id: 2,
    name: "Ceremonia del té",
    description: "Experimenta la tradicional ceremonia del té japonesa",
    price: 80,
    location: "Tokyo",
    category: "Cultura",
    images: [{ url: "/placeholder.svg", descripcion: "Ceremonia del té" }],
    rating: 4.7,
    stock: 10,
  },
  {
    activity_id: 3,
    name: "Tour del Coliseo",
    description: "Visita guiada al icónico Coliseo romano",
    price: 70,
    location: "Rome",
    category: "Historia",
    images: [{ url: "/placeholder.svg", descripcion: "Coliseo" }],
    rating: 4.8,
    stock: 15,
  },
];

function PackageBuilder() {
  const [step, setStep] = useState(1);
  const [selectedFlight, setSelectedFlight] = useState<Vuelo | null>(null);
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);
  const [selectedActivities, setSelectedActivities] = useState<Actividad[]>([]);

  const [flights, setFlights] = useState<Vuelo[]>(mockFlights);
  const [hotels, setHotels] = useState<Hotel[]>(mockHotels);
  const [activities, setActivities] = useState<Actividad[]>(mockActivities);

  //const router = useRouter()
  const searchParams = useSearchParams();

  const [sortBy, setSortBy] = useState<string>(
    searchParams.get("sortBy") || "price"
  );
  const [maxPrice, setMaxPrice] = useState<number>(
    parseInt(searchParams.get("maxPrice") || "1000")
  );

  const handleNext = () => {
    setStep(step + 1);
  };

  const handlePrevious = () => {
    setStep(step - 1);
  };

  const handleFlightSelect = (flight: Vuelo) => {
    setSelectedFlight(flight);
    setHotels(mockHotels.filter((hotel) => hotel.city === flight.destination));
    handleNext();
  };

  const handleHotelSelect = (hotel: Hotel) => {
    setSelectedHotel(hotel);
    setActivities(
      mockActivities.filter((activity) => activity.location === hotel.city)
    );
    handleNext();
  };

  const handleActivityToggle = (activity: Actividad) => {
    setSelectedActivities((prevActivities) => {
      const activityIndex = prevActivities.findIndex(
        (a) => a.activity_id === activity.activity_id
      );
      if (activityIndex > -1) {
        return prevActivities.filter(
          (a) => a.activity_id !== activity.activity_id
        );
      } else {
        return [...prevActivities, activity];
      }
    });
  };

  const totalPrice =
    (selectedFlight?.price || 0) +
    (selectedHotel?.price_per_night || 0) * 3 + // Assuming 3 nights stay
    selectedActivities.reduce((sum, activity) => sum + activity.price, 0);

  const renderFilters = () => (
    <div className="space-y-6">
      <div>
        <Label htmlFor="sortBy">Ordenar por</Label>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger id="sortBy">
            <SelectValue placeholder="Seleccionar orden" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="price">Precio</SelectItem>
            <SelectItem value="rating">Calificación</SelectItem>
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
      {step === 1 && (
        <div>
          <Label htmlFor="fromLocation">Desde</Label>
          <Select value={selectedFlight?.origin || ""} onValueChange={() => {}}>
            <SelectTrigger id="fromLocation">
              <SelectValue placeholder="Seleccionar origen" />
            </SelectTrigger>
            <SelectContent>
              {Array.from(new Set(flights.map((f) => f.origin))).map(
                (origin) => (
                  <SelectItem key={origin} value={origin}>
                    {origin}
                  </SelectItem>
                )
              )}
            </SelectContent>
          </Select>
        </div>
      )}
      {step === 2 && (
        <div>
          <Label htmlFor="city">Ciudad</Label>
          <Select value={selectedHotel?.city || ""} onValueChange={() => {}}>
            <SelectTrigger id="city">
              <SelectValue placeholder="Seleccionar ciudad" />
            </SelectTrigger>
            <SelectContent>
              {Array.from(new Set(hotels.map((h) => h.city))).map((city) => (
                <SelectItem key={city} value={city}>
                  {city}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
      {step === 3 && (
        <div>
          <Label htmlFor="activityCategory">Categoría de actividad</Label>
          <Select value="" onValueChange={() => {}}>
            <SelectTrigger id="activityCategory">
              <SelectValue placeholder="Seleccionar categoría" />
            </SelectTrigger>
            <SelectContent>
              {Array.from(new Set(activities.map((a) => a.category))).map(
                (category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                )
              )}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );

  const renderProgressIndicator = () => (
    <div className="mb-8">
      <Progress value={(step / 4) * 100} className="mb-2" />
      <div className="flex justify-between">
        <span
          className={
            step >= 1 ? "text-primary font-bold" : "text-muted-foreground"
          }
        >
          Vuelo
        </span>
        <span
          className={
            step >= 2 ? "text-primary font-bold" : "text-muted-foreground"
          }
        >
          Hotel
        </span>
        <span
          className={
            step >= 3 ? "text-primary font-bold" : "text-muted-foreground"
          }
        >
          Actividades
        </span>
        <span
          className={
            step >= 4 ? "text-primary font-bold" : "text-muted-foreground"
          }
        >
          Resumen
        </span>
      </div>
    </div>
  );

  const renderFlightStep = () => (
    <div>
      <h2 className="text-2xl font-bold mb-4">Selecciona tu vuelo</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {flights.map((flight) => (
          <Card
            key={flight.flight_id}
            className={`cursor-pointer transition-all ${
              selectedFlight?.flight_id === flight.flight_id
                ? "ring-2 ring-primary"
                : ""
            }`}
            onClick={() => handleFlightSelect(flight)}
          >
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>
                  {flight.origin} a {flight.destination}
                </span>
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
          </Card>
        ))}
      </div>
    </div>
  );

  const renderHotelStep = () => (
    <div>
      <h2 className="text-2xl font-bold mb-4">Selecciona tu hotel</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {hotels.map((hotel) => (
          <Card
            key={hotel.hotel_id}
            className={`cursor-pointer transition-all ${
              selectedHotel?.hotel_id === hotel.hotel_id
                ? "ring-2 ring-primary"
                : ""
            }`}
            onClick={() => handleHotelSelect(hotel)}
          >
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>{hotel.name}</span>
                <Building className="h-6 w-6 text-primary" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-video relative mb-4">
                <Image
                  src={hotel.images[0].url}
                  alt={hotel.images[0].descripcion}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-md"
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
              <p className="text-sm mb-2">{hotel.description}</p>
              <p className="flex items-center font-bold text-lg">
                <DollarSign className="h-5 w-5 mr-1 text-primary" />
                {hotel.price_per_night} / noche
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderActivitiesStep = () => (
    <div>
      <h2 className="text-2xl font-bold mb-4">Selecciona tus actividades</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activities.map((activity) => (
          <Card
            key={activity.activity_id}
            className={`cursor-pointer transition-all ${
              selectedActivities.some(
                (a) => a.activity_id === activity.activity_id
              )
                ? "ring-2 ring-primary"
                : ""
            }`}
            onClick={() => handleActivityToggle(activity)}
          >
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>{activity.name}</span>
                <Tag className="h-6 w-6 text-primary" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-video relative mb-4">
                <Image
                  src={activity.images[0].url}
                  alt={activity.images[0].descripcion}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-md"
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
              <p className="text-sm mb-2">{activity.description}</p>
              <p className="text-sm mb-2">Categoría: {activity.category}</p>
              <p className="flex items-center font-bold text-lg">
                <DollarSign className="h-5 w-5 mr-1 text-primary" />
                {activity.price}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderSummary = () => (
    <div>
      <h2 className="text-2xl font-bold mb-4">Resumen del Paquete</h2>
      <Card>
        <CardHeader>
          <CardTitle>Tu Paquete de Viaje</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {selectedFlight && (
              <div>
                <h3 className="font-bold">Vuelo</h3>
                <p>
                  {selectedFlight.airline}: {selectedFlight.origin} a{" "}
                  {selectedFlight.destination}
                </p>
                <p>Fecha: {format(selectedFlight.departure_date, "PPP")}</p>
                <p>Precio: ${selectedFlight.price}</p>
              </div>
            )}
            {selectedHotel && (
              <div>
                <h3 className="font-bold">Hotel</h3>
                <p>
                  {selectedHotel.name} en {selectedHotel.city},{" "}
                  {selectedHotel.country}
                </p>
                <p>Precio por noche: ${selectedHotel.price_per_night}</p>
                <p>Total por 3 noches: ${selectedHotel.price_per_night * 3}</p>
              </div>
            )}
            {selectedActivities.length > 0 && (
              <div>
                <h3 className="font-bold">Actividades</h3>
                {selectedActivities.map((activity) => (
                  <p key={activity.activity_id}>
                    {activity.name}: ${activity.price}
                  </p>
                ))}
              </div>
            )}
            <div>
              <h3 className="font-bold">Precio Total</h3>
              <p>${totalPrice}</p>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full">Reservar Paquete</Button>
        </CardFooter>
      </Card>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Crea tu Paquete de Viaje</h1>

      {renderProgressIndicator()}

      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/4">{renderFilters()}</div>
        <div className="md:w-3/4">
          {step === 1 && renderFlightStep()}
          {step === 2 && renderHotelStep()}
          {step === 3 && renderActivitiesStep()}
          {step === 4 && renderSummary()}

          <div className="mt-8 flex justify-between">
            <Button onClick={handlePrevious} disabled={step === 1}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Anterior
            </Button>
            <Button onClick={handleNext} disabled={step === 4}>
              {step === 3 ? "Ver Resumen" : "Siguiente"}{" "}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PackagePage() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <PackageBuilder />
    </Suspense>
  );
}
