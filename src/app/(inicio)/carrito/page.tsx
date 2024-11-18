"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Loader2,
  ShoppingCart,
  Trash2,
  CreditCard,
  Plane,
  Hotel,
  MapPin,
  Star,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";

interface ActivityEntity {
  activity_id: number;
  name: string;
  description: string;
  price: number;
  location: string;
  category: string;
  images: string;
  rating: number;
  stock: number;
}

interface FlightEntity {
  flightId: number;
  airline: string;
  origin: string;
  destination: string;
  departureDate: string;
  arrivalDate: string;
  price: number;
  images: string;
  description: string;
  rating: number;
  stock: number;
}

interface HotelEntity {
  hotel_id: number;
  name: string;
  address: string;
  city: string;
  country: string;
  price_per_night: number;
  images: string;
  description: string;
  rating: number;
  stock: number;
}

interface PackageEntity {
  package_id: number;
  price: number;
  hotelEntity: HotelEntity | null;
  flightEntity: FlightEntity | null;
  activityEntity: ActivityEntity | null;
}

interface Booking {
  booking_id: number;
  customer_id: number;
  booking_date: string;
  booking_status: string;
  name: string;
  email: string;
  phone: string;
  packageEntity: PackageEntity;
}

export default function EnhancedShoppingCart() {
  const { isAuthenticated, user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      setIsLoading(true);
      if (isAuthenticated && user) {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_ENDPOINT}bookings/getByCustomer/${user.customer_id}`
          );
          if (!response.ok) {
            throw new Error("Failed to fetch bookings");
          }
          const data: Booking[] = await response.json();
          setBookings(
            data.filter((booking) => booking.booking_status === "PENDING")
          );
        } catch (error) {
          console.error("Error fetching bookings:", error);
          toast({
            title: "Error",
            description:
              "No se pudieron cargar las reservas. Por favor, intenta de nuevo.",
            variant: "destructive",
          });
        }
      } else {
        const savedBooking = localStorage.getItem("savedBooking");
        if (savedBooking) {
          const parsedBooking = JSON.parse(savedBooking);
          if (
            parsedBooking.name &&
            parsedBooking.email &&
            parsedBooking.phone
          ) {
            setBookings([parsedBooking]);
          }
        }
      }
      setIsLoading(false);
    };

    fetchBookings();
  }, [isAuthenticated, user]);

  const handleRemoveBooking = async (bookingId: number) => {
    if (isAuthenticated) {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_ENDPOINT}bookings/${bookingId}`,
          {
            method: "DELETE",
          }
        );
        if (!response.ok) {
          throw new Error("Failed to delete booking");
        }
        setBookings(
          bookings.filter((booking) => booking.booking_id !== bookingId)
        );
        toast({
          title: "Reserva eliminada",
          description: "La reserva ha sido eliminada exitosamente.",
        });
      } catch (error) {
        console.error("Error deleting booking:", error);
        toast({
          title: "Error",
          description:
            "No se pudo eliminar la reserva. Por favor, intenta de nuevo.",
          variant: "destructive",
        });
      }
    } else {
      localStorage.removeItem("savedBooking");
      setBookings([]);
      toast({
        title: "Reserva eliminada",
        description: "La reserva guardada ha sido eliminada.",
      });
    }
  };

  const handlePayment = async (booking: Booking) => {
    try {
      const paymentData = {
        method: "paypal",
        amount: booking.packageEntity.price,
        currency: "USD",
        description:
          "Pago de reserva de paquete de viajes, id: " + booking.booking_id,
      };

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_ENDPOINT}payments/payment/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(paymentData),
        }
      );

      if (!response.ok) {
        const errorData = await response.text();
        console.error("Server response:", errorData);
        throw new Error(`Failed to create payment: ${response.status}`);
      }

      const data = await response.json();
      if (data.approvalUrl) {
        // Send message before redirecting
        await sendPaymentMessage(booking);
        window.location.href = data.approvalUrl;
      } else {
        throw new Error("No approval URL received");
      }
    } catch (error) {
      console.error("Error creating payment:", error);
      toast({
        title: "Error",
        description:
          "No se pudo procesar el pago. Por favor, intenta de nuevo.",
        variant: "destructive",
      });
    }
  };

  const sendPaymentMessage = async (booking: Booking) => {
    try {
      const messageData = {
        message: "Se realizo el pago de la reserva: " + booking.booking_id,
        messageHtml: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border-radius: 8px; border: 1px solid #e0e0e0;">
  <div style="text-align: center; padding: 20px 0;">
    <h1 style="color: #2C3E50; margin: 0; padding: 0;">¡Pago Confirmado!</h1>
  </div>
  
  <div style="background-color: #f8f9fa; border-radius: 8px; padding: 20px; margin: 20px 0;">
    <p style="color: #2C3E50; font-size: 16px; line-height: 1.6; margin: 0;">
      Nos complace informarle que hemos recibido correctamente el pago de su reserva:
    </p>
    
    <div style="background-color: #ffffff; border-radius: 6px; padding: 15px; margin: 15px 0; border: 1px solid #e0e0e0;">
      <h2 style="color: #2C3E50; margin: 0; font-size: 18px;">Número de Reserva:</h2>
      <p style="color: #3498DB; font-size: 24px; font-weight: bold; margin: 10px 0;">${booking.booking_id}</p>
    </div>
    
    <p style="color: #2C3E50; font-size: 16px; line-height: 1.6; margin: 20px 0 0 0;">
      Gracias por confiar en nuestros servicios. Le mantendremos informado sobre el estado de su reserva.
    </p>
  </div>
  
  <div style="text-align: center; padding: 20px 0; color: #7f8c8d; font-size: 14px; border-top: 1px solid #e0e0e0; margin-top: 20px;">
    <p style="margin: 10px 0;">Si tiene alguna pregunta, no dude en contactarnos.</p>
    <p style="margin: 5px 0;">© 2024 Tu Empresa. Todos los derechos reservados.</p>
  </div>
</div>`,
        to: user?.email,
        subject: "Pago realizado",
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
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    });
  };

  const renderStars = (rating: number) => {
    return Array(5)
      .fill(0)
      .map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${
            i < Math.round(rating)
              ? "text-yellow-400 fill-yellow-400"
              : "text-gray-300"
          }`}
        />
      ));
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
      <h1 className="text-3xl font-bold mb-8 flex items-center">
        <ShoppingCart className="mr-2" />
        Carrito de Reservas
      </h1>
      {bookings.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              No tienes reservas pendientes.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {bookings.map((booking) => (
            <Card key={booking.booking_id} className="overflow-hidden">
              <CardHeader className="bg-primary text-primary-foreground">
                <CardTitle className="flex justify-between items-center">
                  <span>Reserva #{booking.booking_id}</span>
                  <span className="text-sm font-normal">
                    Estado:{" "}
                    {booking.booking_status === "PENDING"
                      ? "Pendiente"
                      : booking.booking_status}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-2 text-lg">
                      Detalles de la Reserva
                    </h3>
                    <p>
                      <strong>Nombre:</strong> {booking.name}
                    </p>
                    <p>
                      <strong>Email:</strong> {booking.email}
                    </p>
                    <p>
                      <strong>Teléfono:</strong>{" "}
                      {booking.phone || "No proporcionado"}
                    </p>
                    <p>
                      <strong>Fecha de reserva:</strong>{" "}
                      {formatDate(booking.booking_date)}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2 text-lg">
                      Detalles del Paquete
                    </h3>
                    <p>
                      <strong>Precio Total:</strong> $
                      {booking.packageEntity.price.toFixed(2)}
                    </p>
                    {booking.packageEntity.flightEntity && (
                      <div className="mt-4">
                        <h4 className="font-semibold flex items-center">
                          <Plane className="mr-2" /> Vuelo
                        </h4>
                        <div className="flex items-start space-x-4">
                          <div>
                            <p>{booking.packageEntity.flightEntity.airline}</p>
                            <p>
                              {booking.packageEntity.flightEntity.origin} a{" "}
                              {booking.packageEntity.flightEntity.destination}
                            </p>
                            <p>
                              Salida:{" "}
                              {formatDate(
                                booking.packageEntity.flightEntity.departureDate
                              )}
                            </p>
                            <p>
                              Llegada:{" "}
                              {formatDate(
                                booking.packageEntity.flightEntity.arrivalDate
                              )}
                            </p>
                            <p>
                              Precio: $
                              {booking.packageEntity.flightEntity.price.toFixed(
                                2
                              )}
                            </p>
                            <div className="flex">
                              {renderStars(
                                booking.packageEntity.flightEntity.rating
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    {booking.packageEntity.hotelEntity && (
                      <div className="mt-4">
                        <h4 className="font-semibold flex items-center">
                          <Hotel className="mr-2" /> Hotel
                        </h4>
                        <div className="flex items-start space-x-4">
                          <div>
                            <p>{booking.packageEntity.hotelEntity.name}</p>
                            <p>{booking.packageEntity.hotelEntity.address}</p>
                            <p>
                              {booking.packageEntity.hotelEntity.city},{" "}
                              {booking.packageEntity.hotelEntity.country}
                            </p>
                            <p>
                              Precio por noche: $
                              {booking.packageEntity.hotelEntity.price_per_night.toFixed(
                                2
                              )}
                            </p>
                            <div className="flex">
                              {renderStars(
                                booking.packageEntity.hotelEntity.rating
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    {booking.packageEntity.activityEntity && (
                      <div className="mt-4">
                        <h4 className="font-semibold flex items-center">
                          <MapPin className="mr-2" /> Actividad
                        </h4>
                        <div className="flex items-start space-x-4">
                          <div>
                            <p>{booking.packageEntity.activityEntity.name}</p>
                            <p>
                              {booking.packageEntity.activityEntity.description}
                            </p>
                            <p>
                              Ubicación:{" "}
                              {booking.packageEntity.activityEntity.location}
                            </p>
                            <p>
                              Categoría:{" "}
                              {booking.packageEntity.activityEntity.category}
                            </p>
                            <p>
                              Precio: $
                              {booking.packageEntity.activityEntity.price.toFixed(
                                2
                              )}
                            </p>
                            <div className="flex">
                              {renderStars(
                                booking.packageEntity.activityEntity.rating
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="bg-muted">
                <div className="flex justify-between items-center w-full">
                  <Button
                    variant="destructive"
                    onClick={() => handleRemoveBooking(booking.booking_id)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Eliminar Reserva
                  </Button>
                  <Button
                    variant="default"
                    onClick={() => handlePayment(booking)}
                  >
                    <CreditCard className="mr-2 h-4 w-4" />
                    Pagar Ahora
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
      <Toaster />
    </div>
  );
}
