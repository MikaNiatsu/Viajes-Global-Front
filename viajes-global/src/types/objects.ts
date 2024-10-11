export interface Cliente {
    id: number;
    email: string;
    usuario: string;
    telefono: string;
    password: string;
    eleccion_push: boolean;
    eleccion_sms: boolean;
    eleccion_email: boolean;
    token: string;
}

export interface Hotel {
    id: number;
    nombre: string;
    direccion: string;
    ciudad: string;
    pais: string;
    precio_por_noche: number;
    imagen: {
        url: string;
        descripcion: string;
    };
}

export interface Vuelo {
    id: number;
    aerolinea: string;
    origen: string;
    destino: string;
    fecha_salida: Date;
    fecha_llegada: Date;
    precio: number;
}

export interface Actividad {
    id: number;
    nombre: string;
    descripcion: string;
    precio: number;
    ubicacion: string;
    categoria: string;
}

export interface PaqueteTuristico {
    id: number;
    id_hotel: number;
    id_vuelo: number;
    id_actividad: number;
    precio: number;
}

export interface Reserva {
    id: number;
    id_cliente: number;
    id_paquete: number;
    fecha_reserva: Date;
    estado_reserva: string;
    nombre: string;
    correo: string;
    celular: string;
}


