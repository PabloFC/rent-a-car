import DashboardHeader from "./components/dashboard/DashboardHeader";
import FleetAvailabilityCard from "./components/dashboard/FleetAvailabilityCard";
import LatestReservationsTable from "./components/dashboard/LatestReservationsTable";
import ReservationsStatusCard from "./components/dashboard/ReservationsStatusCard";
import StatsGrid from "./components/dashboard/StatsGrid";
import useAdminStats from "./hooks/useAdminStats";

function AdminDashboard() {
  const { stats, cargando, actualizando, error, ultimaActualizacion, cargar } =
    useAdminStats();

  if (cargando) {
    return (
      <div className="p-8 flex justify-center">
        <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <DashboardHeader
        ultimaActualizacion={ultimaActualizacion}
        actualizando={actualizando}
        onActualizar={() => cargar({ silencioso: true })}
      />

      <StatsGrid stats={stats} />

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <ReservationsStatusCard reservas={stats.reservas} />
        <FleetAvailabilityCard autos={stats.autos} />
      </div>

      <LatestReservationsTable reservas={stats.ultimasReservas} />
    </div>
  );
}

export default AdminDashboard;
