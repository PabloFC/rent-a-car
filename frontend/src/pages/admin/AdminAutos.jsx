import { useState, useEffect, useRef } from "react";
import { autosService } from "../../services/api";

// ── Modal Formulario ──────────────────────────────────────────────────────────

const FORM_VACIO = {
  marca: "",
  modelo: "",
  anio: "",
  precioPorDia: "",
  descripcion: "",
  disponible: true,
};

function AutoModal({ auto, onCerrar, onGuardado }) {
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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setGuardando(true);
    try {
      if (auto) {
        await autosService.actualizar(auto.id, {
          ...form,
          anio: Number(form.anio),
          precioPorDia: Number(form.precioPorDia),
        });
      } else {
        await autosService.crear({
          ...form,
          anio: Number(form.anio),
          precioPorDia: Number(form.precioPorDia),
        });
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
          <h2 className="font-bold text-gray-900 text-lg">
            {auto ? "Editar vehículo" : "Nuevo vehículo"}
          </h2>
          <button
            onClick={onCerrar}
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
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Marca *
              </label>
              <input
                name="marca"
                value={form.marca}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                placeholder="Toyota"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Modelo *
              </label>
              <input
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
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Año *
              </label>
              <input
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
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Precio/día (USD) *
              </label>
              <input
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
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Descripción
            </label>
            <textarea
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

// ── Modal Subir Imagen ────────────────────────────────────────────────────────

function ImagenModal({ auto, onCerrar, onGuardado }) {
  const [archivo, setArchivo] = useState(null);
  const [preview, setPreview] = useState(null);
  const [subiendo, setSubiendo] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef(null);

  const handleArchivo = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setArchivo(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubir = async () => {
    if (!archivo) return;
    setSubiendo(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("imagen", archivo);
      await autosService.subirImagen(auto.id, formData);
      onGuardado();
    } catch (err) {
      setError(err.response?.data?.error || "Error al subir la imagen.");
    } finally {
      setSubiendo(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-sm">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h2 className="font-bold text-gray-900">Subir imagen</h2>
          <button
            onClick={onCerrar}
            className="text-gray-400 hover:text-gray-600 text-xl leading-none"
          >
            ×
          </button>
        </div>
        <div className="p-5 space-y-4">
          <p className="text-sm text-gray-500">
            {auto.marca} {auto.modelo} ({auto.anio})
          </p>

          {/* Preview */}
          <div
            onClick={() => inputRef.current?.click()}
            className="h-40 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-amber-400 transition-colors overflow-hidden"
          >
            {preview ? (
              <img
                src={preview}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <>
                <span className="text-3xl mb-2">📸</span>
                <p className="text-sm text-gray-500">
                  Haz clic para seleccionar
                </p>
              </>
            )}
          </div>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            onChange={handleArchivo}
            className="hidden"
          />

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex gap-3">
            <button
              onClick={onCerrar}
              className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleSubir}
              disabled={!archivo || subiendo}
              className="flex-1 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 disabled:bg-amber-300 text-white rounded text-sm font-bold transition-colors"
            >
              {subiendo ? "Subiendo..." : "Subir"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Página Principal ──────────────────────────────────────────────────────────

function AdminAutos() {
  const [autos, setAutos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [modalForm, setModalForm] = useState(null); // null | "nuevo" | auto object
  const [modalImagen, setModalImagen] = useState(null); // null | auto object
  const [eliminando, setEliminando] = useState(null);

  const cargar = async () => {
    try {
      const data = await autosService.obtenerTodos();
      setAutos(data.autos);
    } catch {
      setError("No se pudieron cargar los vehículos.");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargar();
  }, []);

  const handleEliminar = async (auto) => {
    if (
      !window.confirm(
        `¿Eliminar ${auto.marca} ${auto.modelo}? Esta acción es irreversible.`,
      )
    )
      return;
    setEliminando(auto.id);
    try {
      await autosService.eliminar(auto.id);
      await cargar();
    } catch {
      alert("No se pudo eliminar el vehículo.");
    } finally {
      setEliminando(null);
    }
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-serif mb-1">
            Vehículos
          </h1>
          <p className="text-gray-500 text-sm">
            Gestiona el catálogo de autos.
          </p>
        </div>
        <button
          onClick={() => setModalForm("nuevo")}
          className="bg-amber-500 hover:bg-amber-600 text-white text-sm font-bold px-4 py-2.5 rounded transition-colors"
        >
          + Nuevo vehículo
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6 text-sm">
          {error}
        </div>
      )}

      {cargando ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
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
                            {auto.imagen ? (
                              <img
                                src={`/uploads/autos/${auto.imagen.replace("/uploads/autos/", "").replace("/uploads/", "")}`}
                                alt={`${auto.marca}`}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.target.style.display = "none";
                                }}
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-lg">
                                🚗
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
                        ${Number(auto.precioPorDia).toFixed(2)}
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
                            onClick={() => setModalImagen(auto)}
                            title="Subir imagen"
                            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          >
                            📸
                          </button>
                          <button
                            onClick={() => setModalForm(auto)}
                            title="Editar"
                            className="p-1.5 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded transition-colors"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => handleEliminar(auto)}
                            disabled={eliminando === auto.id}
                            title="Eliminar"
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors disabled:opacity-50"
                          >
                            🗑️
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
      )}

      {/* Modales */}
      {modalForm && (
        <AutoModal
          auto={modalForm === "nuevo" ? null : modalForm}
          onCerrar={() => setModalForm(null)}
          onGuardado={() => {
            setModalForm(null);
            cargar();
          }}
        />
      )}
      {modalImagen && (
        <ImagenModal
          auto={modalImagen}
          onCerrar={() => setModalImagen(null)}
          onGuardado={() => {
            setModalImagen(null);
            cargar();
          }}
        />
      )}
    </div>
  );
}

export default AdminAutos;
