import {
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback,
  useMemo,
} from "react";
import {
  authService,
  clearAuthStorage,
  readAuthStorage,
  writeAuthStorage,
} from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);

  const verificarSesion = useCallback(() => {
    const authData = readAuthStorage();
    if (authData?.usuario) {
      setUsuario(authData.usuario);
    }
    setCargando(false);
  }, []);

  useEffect(() => {
    verificarSesion();
  }, [verificarSesion]);

  const login = useCallback(async (email, password) => {
    try {
      const data = await authService.login(email, password);
      writeAuthStorage({ token: data.token, usuario: data.usuario });
      setUsuario(data.usuario);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || "Error al iniciar sesión",
      };
    }
  }, []);

  const registro = useCallback(async (nombre, email, password) => {
    try {
      const data = await authService.registro(nombre, email, password);
      writeAuthStorage({ token: data.token, usuario: data.usuario });
      setUsuario(data.usuario);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || "Error al registrarse",
      };
    }
  }, []);

  const logout = useCallback(() => {
    clearAuthStorage();
    setUsuario(null);
  }, []);

  const esAdmin = useCallback(() => usuario?.rol === "ADMIN", [usuario]);

  const value = useMemo(
    () => ({
      usuario,
      cargando,
      login,
      registro,
      logout,
      esAdmin,
      estaAutenticado: !!usuario,
    }),
    [usuario, cargando, login, registro, logout, esAdmin],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de AuthProvider");
  }
  return context;
};
