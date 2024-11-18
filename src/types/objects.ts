export interface Cliente {
    customer_id: number;
    email: string;
    name: string;
    phone: string | null;
    eleccion_email: boolean | null;
    eleccion_push: boolean | null;
    eleccion_sms: boolean | null;
}

export interface Hotel {
    hotel_id: number;
    name: string;
    address: string;
    city: string;
    country: string;
    price_per_night: number;
    images: {
        url: string;
        descripcion: string;
    }[];
    description: string | null;
    rating: number;
    stock: number;
}

export interface Vuelo {
    flightId: number;
    airline: string;
    origin: string;
    destination: string;
    departureDate: string;
    arrivalDate: string;
    price: number;
    images: {
        url: string;
        descripcion: string;
    }[];
    description: string | null;
    rating: number;
    stock: number;
}

export interface Actividad {
    activity_id: number;
    name: string;
    description: string | null;
    price: number;
    location: string | null;
    category: string;
    images: {
        url: string;
        descripcion: string;
    }[];
    rating: number;
    stock: number;
}

export interface PaqueteTuristico {
    package_id: number;
    hotel_id: number | null;
    flight_id: number | null;
    activity_id: number | null;
    price: number;
}

export interface Reserva {
    booking_id: number;
    customer_id: number | null;
    package_id: number;
    booking_date: Date;
    booking_status: string;
    name: string;
    email: string;
    phone: string;
}

