import { Link } from "react-router-dom";
import {
  DASHBOARD_RESERVA_ESTADO_BADGE,
  formatDashboardDate,
} from "../../constants/dashboard";

function LatestReservationsTable({ reservas }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <h2 className="font-semibold text-gray-900">Últimas reservas</h2>
        <Link
          to="/admin/reservas"
          className="text-xs text-amber-600 hover:underline font-medium"
        >
          Ver todas →
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-left">
              <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                #
              </th>
              <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Usuario
              </th>
              <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Vehículo
              </th>
              <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Fecha
              </th>
              <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Estado
              </th>
              <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Pago
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {reservas.map((reserva) => (
              <tr
                key={reserva.id}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="px-5 py-3 text-gray-400">#{reserva.id}</td>
                <td className="px-5 py-3">
                  <p className="font-medium text-gray-900">
                    {reserva.usuario.nombre}
                  </p>
                  <p className="text-xs text-gray-400">
                    {reserva.usuario.email}
                  </p>
                </td>
                <td className="px-5 py-3 text-gray-700">
                  {reserva.auto.marca} {reserva.auto.modelo}
                </td>
                <td className="px-5 py-3 text-gray-600">
                  {formatDashboardDate(reserva.creadoEn)}
                </td>
                <td className="px-5 py-3">
                  <span
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full ${DASHBOARD_RESERVA_ESTADO_BADGE[reserva.estado]}`}
                  >
                    {reserva.estado}
                  </span>
                </td>
                <td className="px-5 py-3">
                  {reserva.pago ? (
                    <span
                      className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                        reserva.pago.estado === "PAGADO"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {reserva.pago.estado}
                    </span>
                  ) : (
                    <span className="text-xs text-gray-400">Sin pago</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default LatestReservationsTable;
