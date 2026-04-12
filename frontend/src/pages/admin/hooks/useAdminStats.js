import { useCallback, useEffect, useState } from "react";
import { adminService } from "../../../services/api";

function useAdminStats() {
  const [stats, setStats] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [actualizando, setActualizando] = useState(false);
  const [error, setError] = useState("");
  const [ultimaActualizacion, setUltimaActualizacion] = useState(null);

  const cargar = useCallback(async ({ silencioso = false } = {}) => {
    if (silencioso) {
      setActualizando(true);
    } else {
      setCargando(true);
    }

    try {
      const data = await adminService.obtenerStats();
      setStats(data);
      setError("");
      setUltimaActualizacion(new Date());
    } catch {
      if (!silencioso) {
        setError("No se pudieron cargar las estadísticas.");
      }
    } finally {
      if (silencioso) {
        setActualizando(false);
      } else {
        setCargando(false);
      }
    }
  }, []);

  useEffect(() => {
    cargar();

    const intervalId = window.setInterval(() => {
      cargar({ silencioso: true });
    }, 30000);

    const onFocus = () => cargar({ silencioso: true });
    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        cargar({ silencioso: true });
      }
    };

    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      window.clearInterval(intervalId);
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [cargar]);

  return {
    stats,
    cargando,
    actualizando,
    error,
    ultimaActualizacion,
    cargar,
  };
}

export default useAdminStats;
