import Icon from "../../../../components/Icon";
import { normalizarImagenPath } from "../../../../utils/helpers";

function AutosTable({
  autos,
  imagenesError,
  onImagenError,
  eliminando,
  onSubirImagen,
  onEditar,
  onPedirEliminar,
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-left">
              <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Vehículo
              </th>
              <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Año
              </th>
              <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Precio/día
              </th>
              <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Estado
              </th>
              <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {autos.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-5 py-10 text-center text-gray-400"
                >
                  No hay vehículos registrados.
                </td>
              </tr>
            ) : (
              autos.map((auto) => (
                <tr
                  key={auto.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-10 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                        {auto.imagen && !imagenesError[auto.id] ? (
                          <img
                            src={normalizarImagenPath(auto.imagen)}
                            alt={`${auto.marca} ${auto.modelo}`}
                            className="w-full h-full object-cover"
                            onError={() => onImagenError(auto.id)}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <Icon
                              path="M3 13l1-4a2 2 0 012-1.5h12a2 2 0 012 1.5l1 4M5 13h14M7 17a1 1 0 100-2 1 1 0 000 2zm10 0a1 1 0 100-2 1 1 0 000 2zM6 17h12"
                              className="w-5 h-5"
                            />
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">
                          {auto.marca} {auto.modelo}
                        </p>
                        <p className="text-xs text-gray-400 truncate max-w-xs">
                          {auto.descripcion || "Sin descripción"}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-gray-600">{auto.anio}</td>
                  <td className="px-5 py-3 font-semibold text-amber-600">
                    {Number(auto.precioPorDia).toFixed(2)}€
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                        auto.disponible
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {auto.disponible ? "Disponible" : "Ocupado"}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onSubirImagen(auto)}
                        aria-label={`Subir imagen de ${auto.marca} ${auto.modelo}`}
                        title="Subir imagen"
                        className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                      >
                        <Icon
                          path="M3 7h4l2-2h6l2 2h4v12H3V7zm9 10a4 4 0 100-8 4 4 0 000 8z"
                          className="w-4 h-4"
                        />
                      </button>
                      <button
                        onClick={() => onEditar(auto)}
                        aria-label={`Editar ${auto.marca} ${auto.modelo}`}
                        title="Editar"
                        className="p-1.5 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded transition-colors"
                      >
                        <Icon
                          path="M11 5h2m-7 11l-1 4 4-1 9-9a2.828 2.828 0 10-4-4l-9 9z"
                          className="w-4 h-4"
                        />
                      </button>
                      <button
                        onClick={() => onPedirEliminar(auto)}
                        disabled={eliminando === auto.id}
                        aria-label={`Eliminar ${auto.marca} ${auto.modelo}`}
                        title="Eliminar"
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors disabled:opacity-50"
                      >
                        <Icon
                          path="M6 7h12m-9 0V5h6v2m-8 0l1 12h6l1-12M10 11v5m4-5v5"
                          className="w-4 h-4"
                        />
                      </button>
                    </div>
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

export default AutosTable;
