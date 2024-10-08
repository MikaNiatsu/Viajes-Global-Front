interface Cliente {
    id_cliente: number;
    correo: string;
    usuario: string;
    telefono: string;
    eleccion_push: boolean;
    eleccion_sms: boolean;
    eleccion_email: boolean;
  }
  
  interface Reserva {
    id_reserva: number;
    id_cliente: number;
    id_paquete: number;
    fecha_reserva: Date;
    estado_reserva: string;
    nombre: string;
    correo: string;
    celular: string;
  }
  
  interface PaqueteTuristico {
    id_paquete: number;
    id_hotel: number;
    id_vuelo: number;
    id_actividad: number;
    precio: number;
  }
  
  interface Hotel {
    id_hotel: number;
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
  
  interface Vuelo {
    id_vuelo: number;
    aerolinea: string;
    origen: string;
    destino: string;
    fecha_salida: Date;
    fecha_llegada: Date;
    precio: number;
  }
  
  interface Actividad {
    id_actividad: number;
    nombre: string;
    descripcion: string;
    precio: number;
    ubicacion: string;
    categoria: string;
  }