import axios from "axios";

const AUTH_STORAGE_KEY = "rentacar.auth.v1";
let tokenCache = null;

const parseJSON = (value) => {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
};

const readLegacyAuth = () => {
  const token = localStorage.getItem("token");
  const usuario = parseJSON(localStorage.getItem("usuario"));
  if (!token || !usuario) return null;
  return { token, usuario };
};

export const readAuthStorage = () => {
  const versioned = parseJSON(localStorage.getItem(AUTH_STORAGE_KEY));
  if (versioned?.token && versioned?.usuario) {
    tokenCache = versioned.token;
    return versioned;
  }

  const legacy = readLegacyAuth();
  if (legacy) {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(legacy));
    tokenCache = legacy.token;
    return legacy;
  }

  tokenCache = null;
  return null;
};

export const writeAuthStorage = (authData) => {
  tokenCache = authData?.token ?? null;
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authData));
  // Compatibilidad temporal con formato anterior.
  localStorage.setItem("token", authData.token);
  localStorage.setItem("usuario", JSON.stringify(authData.usuario));
};

export const clearAuthStorage = () => {
  tokenCache = null;
  localStorage.removeItem(AUTH_STORAGE_KEY);
  localStorage.removeItem("token");
  localStorage.removeItem("usuario");
};

// Configuración base de axios
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para añadir el token a todas las peticiones
api.interceptors.request.use(
  (config) => {
    const token = tokenCache ?? readAuthStorage()?.token;
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
      clearAuthStorage();
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
  obtenerTodos: async (params = {}) => {
    const response = await api.get("/autos", { params });
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

  subirImagen: async (id, formData) => {
    const response = await api.post(`/autos/${id}/imagen`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
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

  obtenerPorId: async (id) => {
    const response = await api.get(`/reservas/${id}`);
    return response.data;
  },

  cancelar: async (id) => {
    const response = await api.patch(`/reservas/${id}/cancelar`);
    return response.data;
  },
};

// Servicios de pagos
export const pagosService = {
  procesar: async (pagoData) => {
    const response = await api.post("/pagos", pagoData);
    return response.data;
  },

  obtenerPorReserva: async (reservaId) => {
    const response = await api.get(`/pagos/${reservaId}`);
    return response.data;
  },
};

// Servicios de administración
export const adminService = {
  obtenerStats: async () => {
    const response = await api.get("/admin/stats");
    return response.data;
  },

  listarReservas: async (estado) => {
    const params = estado ? `?estado=${estado}` : "";
    const response = await api.get(`/reservas${params}`);
    return response.data;
  },

  cambiarEstadoReserva: async (id, estado) => {
    const response = await api.patch(`/reservas/${id}/estado`, { estado });
    return response.data;
  },
};

export default api;
