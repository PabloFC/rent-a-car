import { useEffect, useState } from "react";
import { autosService } from "../../../../services/api";

const FORM_VACIO = {
  marca: "",
  modelo: "",
  anio: "",
  precioPorDia: "",
  descripcion: "",
  disponible: true,
};

function AutoFormModal({ auto, onCerrar, onGuardado }) {
  const [form, setForm] = useState(
    auto
      ? {
          ...auto,
          anio: String(auto.anio),
          precioPorDia: String(auto.precioPorDia),
        }
      : FORM_VACIO,
  );
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        onCerrar();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onCerrar]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  const validarFormulario = () => {
    const anio = Number(form.anio);
    const precio = Number(form.precioPorDia);

    if (!form.marca.trim() || !form.modelo.trim()) {
      return "Marca y modelo son obligatorios.";
    }
    if (!Number.isFinite(anio) || anio < 1990 || anio > 2030) {
      return "El año debe estar entre 1990 y 2030.";
    }
    if (!Number.isFinite(precio) || precio < 0 || precio > 10000) {
      return "El precio por día debe estar entre 0 y 10000.";
    }
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errorValidacion = validarFormulario();
    if (errorValidacion) {
      setError(errorValidacion);
      return;
    }

    const payload = {
      ...form,
      marca: form.marca.trim(),
      modelo: form.modelo.trim(),
      descripcion: (form.descripcion || "").trim(),
      anio: Number(form.anio),
      precioPorDia: Number(form.precioPorDia),
    };

    setError("");
    setGuardando(true);
    try {
      if (auto) {
        await autosService.actualizar(auto.id, payload);
      } else {
        await autosService.crear(payload);
      }
      onGuardado();
    } catch (err) {
      setError(err.response?.data?.error || "Error al guardar el vehículo.");
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h2 id="auto-modal-title" className="font-bold text-gray-900 text-lg">
            {auto ? "Editar vehículo" : "Nuevo vehículo"}
          </h2>
          <button
            type="button"
            onClick={onCerrar}
            aria-label="Cerrar modal"
            className="text-gray-400 hover:text-gray-600 text-xl leading-none"
          >
            ×
          </button>
        </div>

        {error && (
          <div className="mx-5 mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-2.5 rounded text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="marca"
                className="block text-sm font-semibold text-gray-700 mb-1.5"
              >
                Marca *
              </label>
              <input
                id="marca"
                name="marca"
                value={form.marca}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                placeholder="Toyota"
              />
            </div>
            <div>
              <label
                htmlFor="modelo"
                className="block text-sm font-semibold text-gray-700 mb-1.5"
              >
                Modelo *
              </label>
              <input
                id="modelo"
                name="modelo"
                value={form.modelo}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                placeholder="Corolla"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="anio"
                className="block text-sm font-semibold text-gray-700 mb-1.5"
              >
                Año *
              </label>
              <input
                id="anio"
                name="anio"
                type="number"
                value={form.anio}
                onChange={handleChange}
                required
                min="1990"
                max="2030"
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                placeholder="2024"
              />
            </div>
            <div>
              <label
                htmlFor="precioPorDia"
                className="block text-sm font-semibold text-gray-700 mb-1.5"
              >
                Precio/día (EUR) *
              </label>
              <input
                id="precioPorDia"
                name="precioPorDia"
                type="number"
                value={form.precioPorDia}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                placeholder="80.00"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="descripcion"
              className="block text-sm font-semibold text-gray-700 mb-1.5"
            >
              Descripción
            </label>
            <textarea
              id="descripcion"
              name="descripcion"
              value={form.descripcion || ""}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none"
              placeholder="Descripción del vehículo..."
            />
          </div>

          {auto && (
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="disponible"
                name="disponible"
                checked={form.disponible}
                onChange={handleChange}
                className="w-4 h-4 accent-amber-500"
              />
              <label
                htmlFor="disponible"
                className="text-sm font-medium text-gray-700 select-none"
              >
                Disponible para reserva
              </label>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onCerrar}
              className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={guardando}
              className="flex-1 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 disabled:bg-amber-300 text-white rounded text-sm font-bold transition-colors"
            >
              {guardando
                ? "Guardando..."
                : auto
                  ? "Guardar cambios"
                  : "Crear vehículo"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AutoFormModal;
