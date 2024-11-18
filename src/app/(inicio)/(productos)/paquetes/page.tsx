'use client'

import { Suspense, useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import {
  MapPin,
  DollarSign,
  Star,
  ArrowRight,
  ArrowLeft,
  Loader2,
  Info,
  Plus,
  Minus,
  Calendar,
} from "lucide-react"
import { format } from "date-fns"
import Image from "next/image"
import { Progress } from "@/components/ui/progress"
import { Vuelo, Hotel, Actividad } from "@/types/objects"
import { es } from "date-fns/locale"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { toast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { useAuth } from "@/hooks/useAuth"
import { useRouter } from "next/navigation"

interface PackageDTO {
  price: number
  hotel_id: number | null
  flight_id: number | null
  activity_id: number | null
}

interface BookingDTO {
  customer_id: number
  booking_date: Date
  booking_status: string
  name: string
  email: string
  phone: string
  package_id: number
}

function PackageBuilder() {
  const router = useRouter()
  const { isAuthenticated, user } = useAuth()
  const [step, setStep] = useState(1)
  const [selectedFlight, setSelectedFlight] = useState<Vuelo | null>(null)
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null)
  const [selectedActivity, setSelectedActivity] = useState<Actividad | null>(null)
  const [flights, setFlights] = useState<Vuelo[]>([])
  const [hotels, setHotels] = useState<Hotel[]>([])
  const [activities, setActivities] = useState<Actividad[]>([])
  const [isLoading, setIsLoading] = useState(true)
  //eslint-disable-next-line
  const [error, setError] = useState<string | null>(null)
  const searchParams = useSearchParams()
  const [sortBy, setSortBy] = useState<string>(
    searchParams.get("sortBy") || "price"
  )
  const [maxPrice, setMaxPrice] = useState<number>(
    parseInt(searchParams.get("maxPrice") || "1000")
  )
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [customerName, setCustomerName] = useState("")
  const [customerEmail, setCustomerEmail] = useState("")
  const [customerPhone, setCustomerPhone] = useState("")

  useEffect(() => {
    if (isAuthenticated && user) {
      setCustomerName(user.name || "")
      setCustomerEmail(user.email || "")
      setCustomerPhone(user.phone || "")
    } else {
      // Load data from localStorage if not authenticated
      const savedBooking = localStorage.getItem('savedBooking')
      if (savedBooking) {
        const parsedBooking = JSON.parse(savedBooking)
        setCustomerName(parsedBooking.name || "")
        setCustomerEmail(parsedBooking.email || "")
        setCustomerPhone(parsedBooking.phone || "")
        setSelectedFlight(parsedBooking.selectedFlight || null)
        setSelectedHotel(parsedBooking.selectedHotel || null)
        setSelectedActivity(parsedBooking.selectedActivity || null)
      }
    }
  }, [isAuthenticated, user])

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const [flightsResponse, hotelsResponse, activitiesResponse] =
          await Promise.all([
            fetch(`${process.env.NEXT_PUBLIC_ENDPOINT}flights/showAll`),
            fetch(`${process.env.NEXT_PUBLIC_ENDPOINT}hotels/showAll`),
            fetch(`${process.env.NEXT_PUBLIC_ENDPOINT}activities/showAll`),
          ])

        if (
          !flightsResponse.ok ||
          !hotelsResponse.ok ||
          !activitiesResponse.ok
        ) {
          throw new Error("Failed to fetch data")
        }

        const flightsData: Vuelo[] = await flightsResponse.json()
        const hotelsData: Hotel[] = await hotelsResponse.json()
        const activitiesData: Actividad[] = await activitiesResponse.json()

        setFlights(flightsData)
        setHotels(hotelsData)
        setActivities(activitiesData)
      } catch (err) {
        setError(
          "Error al cargar los datos. Por favor, intenta de nuevo más tarde."
        )
        console.error("Error fetching data:", err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const createPackage = async (): Promise<number | null> => {
    if (!selectedFlight && !selectedHotel && !selectedActivity) {
      toast({
        title: "Error",
        description: "Por favor, selecciona al menos una cosa.",
        variant: "destructive",
      })
      return null
    }

    const totalPrice =
      (selectedFlight?.price || 0) +
      (selectedHotel?.price_per_night || 0) * 3 +
      (selectedActivity?.price || 0)

    const packageData: PackageDTO = {
      price: totalPrice,
      hotel_id: selectedHotel?.hotel_id || null,
      flight_id: selectedFlight?.flightId || null,
      activity_id: selectedActivity?.activity_id || null,
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_ENDPOINT}packages/createPackage`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(packageData),
        }
      )

      if (!response.ok) {
        throw new Error("Failed to create package")
      }

      const result = await response.json()
      return result as number
    } catch (error) {
      console.error("Error creating package:", error)
      toast({
        title: "Error",
        description:
          "Hubo un problema al crear el paquete. Por favor, intenta de nuevo.",
        variant: "destructive",
      })
      return null
    }
  }

  const handleBooking = async () => {
    if (!isAuthenticated) {
      // Save booking information to localStorage
      const bookingInfo = {
        name: customerName,
        email: customerEmail,
        phone: customerPhone,
        selectedFlight,
        selectedHotel,
        selectedActivity
      }
      localStorage.setItem('savedBooking', JSON.stringify(bookingInfo))
      toast({
        title: "Información guardada",
        description: "Tu selección ha sido guardada. Por favor, inicia sesión para completar la reserva.",
      })
      router.push("/")
      return
    }

    const packageId = await createPackage()
    if (!packageId) return
    console.log("Package ID:", packageId)
    const bookingData: BookingDTO = {
      customer_id: user?.customer_id || -1,
      booking_date: new Date(),
      booking_status: "PENDING",
      name: customerName,
      email: customerEmail,
      phone: customerPhone,
      package_id: packageId,
    }
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_ENDPOINT}bookings/createBooking`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(bookingData),
        }
      )

      if (!response.ok) {
        throw new Error("Failed to create booking")
      }
      await response.json()
      toast({
        title: "Reserva exitosa",
        description: `Tu reserva ha sido creada`,
      })
      localStorage.removeItem('savedBooking')
      sendBookingMessage()
      await new Promise((resolve) => setTimeout(resolve, 5000))
      router.push("/")
    } catch (error) {
      console.error("Error creating booking:", error)
      toast({
        title: "Error",
        description:
          "Hubo un problema al crear la reserva. Por favor, intenta de nuevo.",
        variant: "destructive",
      })
    }
  };

  const sendBookingMessage = async () => {
    try {
      const messageData = {
        message: "Se realizo la reserva",
        messageHtml: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border-radius: 8px; border: 1px solid #e0e0e0;">
  <div style="text-align: center; padding: 20px 0;">
    <h1 style="color: #2C3E50; margin: 0; padding: 0;">¡Reserva Confirmada!</h1>
  </div>
  
  <div style="background-color: #f8f9fa; border-radius: 8px; padding: 20px; margin: 20px 0;">
    <p style="color: #2C3E50; font-size: 16px; line-height: 1.6; margin: 0;">
      Nos complace informarle que hemos recibido correctamente su reserva:
    </p>
    
    <p style="color: #2C3E50; font-size: 16px; line-height: 1.6; margin: 20px 0 0 0;">
      Gracias por confiar en nuestros servicios. Le mantendremos informado sobre el estado de su reserva.
    </p>
  </div>
  
  <div style="text-align: center; padding: 20px 0; color: #7f8c8d; font-size: 14px; border-top: 1px solid #e0e0e0; margin-top: 20px;">
    <p style="margin: 10px 0;">Si tiene alguna pregunta, no dude en contactarnos.</p>
    <p style="margin: 5px 0;">© 2024 Viajes Global. Todos los derechos reservados.</p>
  </div>
</div>`,
        to: user?.email,
        subject: "Pago realizado",
        id: user?.customer_id,
      };

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_ENDPOINT}notifications/sendNotification`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(messageData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to send payment message");
      }

      console.log("Payment message sent successfully");
    } catch (error) {
      console.error("Error sending payment message:", error);
    }
  };
  const handleStepChange = (newStep: number) => {
    setStep(newStep);
  };

  const handleFlightSelect = (flight: Vuelo) => {
    setSelectedFlight(selectedFlight?.flightId === flight.flightId ? null : flight);
  };

  const handleHotelSelect = (hotel: Hotel) => {
    setSelectedHotel(selectedHotel?.hotel_id === hotel.hotel_id ? null : hotel);
  };

  const handleActivitySelect = (activity: Actividad) => {
    setSelectedActivity(selectedActivity?.activity_id === activity.activity_id ? null : activity);
  };

  const renderFilters = () => (
    <div className="space-y-6">
      <div className="mt-8 flex justify-between">
        <Button
          onClick={() => handleStepChange(step - 1)}
          disabled={step === 1}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Anterior
        </Button>
        <Button
          onClick={() => handleStepChange(step + 1)}
          disabled={step === 4}
        >
          {step === 3 ? "Ver Resumen" : "Siguiente"}{" "}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
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
        <>
          <div>
            <Label htmlFor="fromLocation">Desde</Label>
            <Select
              value={selectedFlight?.origin || ""}
              onValueChange={() => {}}
            >
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
          <div>
            <Label htmlFor="departureDate">Fecha de salida</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={`w-full justify-start text-left font-normal ${
                    !selectedDate && "text-muted-foreground"
                  }`}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {selectedDate ? (
                    format(selectedDate, "PPP", { locale: es })
                  ) : (
                    <span>Seleccionar fecha</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </>
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
        {["Vuelo", "Hotel", "Actividades", "Resumen"].map((label, index) => (
          <button
            key={label}
            className={`text-sm font-medium ${
              step >= index + 1 ? "text-primary" : "text-muted-foreground"
            } ${step === index + 1 ? "font-bold" : ""} focus:outline-none`}
            onClick={() => handleStepChange(index + 1)}
            disabled={index + 1 > step}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );

  const renderFlightStep = () => (
    <div>
      <h2 className="text-2xl font-bold mb-4">Selecciona tu vuelo</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {flights
          .filter(
            (flight) =>
              !selectedDate ||
              new Date(flight.departureDate).toDateString() ===
                selectedDate.toDateString()
          )
          .map((flight) => (
            <Card
              key={flight.flightId}
              className={`relative transition-all ${
                selectedFlight?.flightId === flight.flightId
                  ? "ring-2 ring-primary"
                  : ""
              }`}
            >
              <CardHeader>
                <CardTitle>{flight.airline}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-video relative mb-4">
                  <Image
                    src={flight.images[0]?.url || "/placeholders/flight.jpg"}
                    alt={flight.images[0]?.descripcion || "Flight image"}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-md"
                  />
                </div>
                <p className="flex items-center mb-2">
                  <MapPin className="h-4 w-4 mr-2 text-primary" />
                  {flight.origin} - &gt; {flight.destination}
                </p>
                <p className="flex items-center mb-2">
                  <Calendar className="h-4 w-4 mr-2 text-primary" />
                  {format(new Date(flight.departureDate), "PPP", {
                    locale: es,
                  })}
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
              <CardFooter className="flex justify-between items-center">
                <Link href={`/viajes/${flight.flightId}`} passHref>
                  <Button variant="outline">
                    <Info className="mr-2 h-4 w-4" />
                    Más detalles
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  className="rounded-full p-2"
                  onClick={() => handleFlightSelect(flight)}
                >
                  {selectedFlight?.flightId === flight.flightId ? (
                    <Minus className="h-5 w-5" />
                  ) : (
                    <Plus className="h-5 w-5" />
                  )}
                </Button>
              </CardFooter>
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
            className={`relative transition-all ${
              selectedHotel?.hotel_id === hotel.hotel_id
                ? "ring-2 ring-primary"
                : ""
            }`}
          >
            <CardHeader>
              <CardTitle>{hotel.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-video relative mb-4">
                <Image
                  src={hotel.images[0]?.url || "/placeholders/hotel.jpg"}
                  alt={hotel.images[0]?.descripcion || "Hotel image"}
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
            <CardFooter className="flex justify-between items-center">
              <Link href={`/hoteles/${hotel.hotel_id}`} passHref>
                <Button variant="outline">
                  <Info className="mr-2 h-4 w-4" />
                  Más detalles
                </Button>
              </Link>
              <Button
                variant="outline"
                className="rounded-full p-2"
                onClick={() => handleHotelSelect(hotel)}
              >
                {selectedHotel?.hotel_id === hotel.hotel_id ? (
                  <Minus className="h-5 w-5" />
                ) : (
                  <Plus className="h-5 w-5" />
                )}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderActivitiesStep = () => (
    <div>
      <h2 className="text-2xl font-bold mb-4">Selecciona una actividad</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activities.map((activity) => (
          <Card
            key={activity.activity_id}
            className={`relative transition-all ${
              selectedActivity?.activity_id === activity.activity_id
                ? "ring-2 ring-primary"
                : ""
            }`}
          >
            <CardHeader>
              <CardTitle>{activity.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-video relative mb-4">
                <Image
                  src={
                    activity.images[0]?.url || "/placeholders/activities.jpg"
                  }
                  alt={activity.images[0]?.descripcion || "Activity image"}
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
            <CardFooter className="flex justify-between items-center">
              <Link href={`/actividades/${activity.activity_id}`} passHref>
                <Button variant="outline">
                  <Info className="mr-2 h-4 w-4" />
                  Más detalles
                </Button>
              </Link>
              <Button
                variant="outline"
                className="rounded-full p-2"
                onClick={() => handleActivitySelect(activity)}
              >
                {selectedActivity?.activity_id === activity.activity_id ? (
                  <Minus className="h-5 w-5" />
                ) : (
                  <Plus className="h-5 w-5" />
                )}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderSummary = () => {
    const totalPrice =
      (selectedFlight?.price || 0) +
      (selectedHotel?.price_per_night || 0) * 3 +
      (selectedActivity?.price || 0);

    return (
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
                  <p>
                    Fecha:{" "}
                    {format(new Date(selectedFlight.departureDate), "PPP", {
                      locale: es,
                    })}
                  </p>
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
                  <p>
                    Total por 3 noches: ${selectedHotel.price_per_night * 3}
                  </p>
                </div>
              )}
              {selectedActivity && (
                <div>
                  <h3 className="font-bold">Actividad</h3>
                  <p>{selectedActivity.name}: ${selectedActivity.price}</p>
                </div>
              )}
              <div>
                <h3 className="font-bold">Precio Total</h3>
                <p>${totalPrice}</p>
              </div>
            </div>
            <div className="mt-6 space-y-4">
              <h3 className="font-bold">Información del Cliente</h3>
              <Input
                placeholder="Nombre completo"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
              />
              <Input
                type="email"
                placeholder="Correo electrónico"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
              />
              <Input
                placeholder="Teléfono"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={handleBooking}>
              Reservar Paquete
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Crea tu Paquete de Viaje</h1>

      {renderProgressIndicator()}

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-1/4">{renderFilters()}</div>
        <div className="lg:w-3/4">
          {step === 1 && renderFlightStep()}
          {step === 2 && renderHotelStep()}
          {step === 3 && renderActivitiesStep()}
          {step === 4 && renderSummary()}
        </div>
      </div>
      <Toaster />
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