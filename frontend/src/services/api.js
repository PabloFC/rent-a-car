import axios from "axios";

// Configuración base de axios
const api = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para añadir el token a todas las peticiones
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Interceptor para manejar errores de respuesta
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado o inválido
      localStorage.removeItem("token");
      localStorage.removeItem("usuario");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

// Servicios de autenticación
export const authService = {
  login: async (email, password) => {
    const response = await api.post("/auth/login", { email, password });
    return response.data;
  },

  registro: async (nombre, email, password) => {
    const response = await api.post("/auth/registro", {
      nombre,
      email,
      password,
    });
    return response.data;
  },

  verificarToken: async () => {
    const response = await api.get("/auth/verificar");
    return response.data;
  },
};

// Servicios de autos
export const autosService = {
  obtenerTodos: async () => {
    const response = await api.get("/autos");
    return response.data;
  },

  obtenerPorId: async (id) => {
    const response = await api.get(`/autos/${id}`);
    return response.data;
  },

  crear: async (autoData) => {
    const response = await api.post("/autos", autoData);
    return response.data;
  },

  actualizar: async (id, autoData) => {
    const response = await api.put(`/autos/${id}`, autoData);
    return response.data;
  },

  eliminar: async (id) => {
    const response = await api.delete(`/autos/${id}`);
    return response.data;
  },
};

// Servicios de reservas
export const reservasService = {
  crear: async (reservaData) => {
    const response = await api.post("/reservas", reservaData);
    return response.data;
  },

  obtenerMisReservas: async () => {
    const response = await api.get("/reservas/mis-reservas");
    return response.data;
  },
};

export default api;
