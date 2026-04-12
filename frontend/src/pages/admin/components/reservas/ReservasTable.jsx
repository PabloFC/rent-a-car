const ESTADO_BADGE = {
  PENDIENTE: "bg-yellow-100 text-yellow-800",
  CONFIRMADA: "bg-green-100 text-green-800",
  CANCELADA: "bg-red-100 text-red-800",
  COMPLETADA: "bg-blue-100 text-blue-800",
};

const PAGO_BADGE = {
  PENDIENTE: "bg-gray-100 text-gray-500",
  PAGADO: "bg-emerald-100 text-emerald-700",
  RECHAZADO: "bg-red-100 text-red-600",
  REEMBOLSADO: "bg-purple-100 text-purple-700",
};

const formatFecha = (fecha) =>
  new Date(fecha).toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

function ReservasTable({
  reservas,
  estadosReserva,
  cambiando,
  onCambiarEstado,
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
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
                Período
              </th>
              <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Total
              </th>
              <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Pago
              </th>
              <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Estado
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {reservas.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-5 py-12 text-center text-gray-400"
                >
                  No hay reservas con este filtro.
                </td>
              </tr>
            ) : (
              reservas.map((reserva) => (
                <tr
                  key={reserva.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-5 py-3 text-gray-400 font-mono">
                    #{reserva.id}
                  </td>

                  <td className="px-5 py-3">
                    <p className="font-medium text-gray-900">
                      {reserva.usuario.nombre}
                    </p>
                    <p className="text-xs text-gray-400">
                      {reserva.usuario.email}
                    </p>
                  </td>

                  <td className="px-5 py-3">
                    <p className="font-medium text-gray-800">
                      {reserva.auto.marca} {reserva.auto.modelo}
                    </p>
                    <p className="text-xs text-gray-400">{reserva.auto.anio}</p>
                  </td>

                  <td className="px-5 py-3 text-gray-600 whitespace-nowrap">
                    <p>{formatFecha(reserva.fechaInicio)}</p>
                    <p className="text-xs text-gray-400">
                      → {formatFecha(reserva.fechaFin)}
                    </p>
                  </td>

                  <td className="px-5 py-3 font-bold text-amber-600">
                    {Number(reserva.montoTotal).toFixed(2)}€
                  </td>

                  <td className="px-5 py-3">
                    {reserva.pago ? (
                      <span
                        className={`text-xs font-medium px-2.5 py-1 rounded-full ${PAGO_BADGE[reserva.pago.estado]}`}
                      >
                        {reserva.pago.estado}
                      </span>
                    ) : (
                      <span className="text-xs text-gray-400">Sin pago</span>
                    )}
                  </td>

                  <td className="px-5 py-3">
                    {cambiando === reserva.id ? (
                      <div className="w-5 h-5 border-2 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <select
                        value={reserva.estado}
                        onChange={(e) =>
                          onCambiarEstado(reserva.id, e.target.value)
                        }
                        aria-label={`Cambiar estado de reserva ${reserva.id}`}
                        className={`text-xs font-semibold rounded-full px-2.5 py-1 border-0 cursor-pointer focus:ring-2 focus:ring-amber-500 ${ESTADO_BADGE[reserva.estado]}`}
                      >
                        {estadosReserva.map((estado) => (
                          <option key={estado} value={estado}>
                            {estado}
                          </option>
                        ))}
                      </select>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ReservasTable;
