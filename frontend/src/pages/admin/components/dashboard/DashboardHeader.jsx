import Icon from "../../../../components/Icon";

function DashboardHeader({ ultimaActualizacion, actualizando, onActualizar }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 font-serif mb-1">
          Dashboard
        </h1>
        <p className="text-gray-500 text-sm">Resumen general del sistema.</p>
        {ultimaActualizacion && (
          <p className="text-xs text-gray-400 mt-1">
            Actualizado: {ultimaActualizacion.toLocaleTimeString("es-ES")}
          </p>
        )}
      </div>

      <button
        onClick={onActualizar}
        disabled={actualizando}
        className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded border border-gray-300 text-gray-600 hover:border-amber-400 hover:text-amber-600 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
      >
        {actualizando ? (
          <span className="w-3.5 h-3.5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
        ) : (
          <Icon
            path="M4 4v5h.582m14.836 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0A8.003 8.003 0 015.163 13M15 15h-6"
            className="w-4 h-4"
          />
        )}
        {actualizando ? "Actualizando..." : "Actualizar"}
      </button>
    </div>
  );
}

export default DashboardHeader;
