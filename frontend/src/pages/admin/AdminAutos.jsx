import { useState, useEffect } from "react";
import { autosService } from "../../services/api";
import AutoFormModal from "./components/autos/AutoFormModal";
import AutoImageModal from "./components/autos/AutoImageModal";
import AutoDeleteConfirmModal from "./components/autos/AutoDeleteConfirmModal";
import AutosTable from "./components/autos/AutosTable";

function AdminAutos() {
  const [autos, setAutos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState(null);
  const [modalForm, setModalForm] = useState(null); // null | "nuevo" | auto object
  const [modalImagen, setModalImagen] = useState(null); // null | auto object
  const [confirmEliminar, setConfirmEliminar] = useState(null);
  const [eliminando, setEliminando] = useState(null);
  const [imagenesError, setImagenesError] = useState({});

  const cargar = async () => {
    try {
      const data = await autosService.obtenerTodos();
      setAutos(data.autos);
      setError("");
    } catch {
      setError("No se pudieron cargar los vehículos.");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargar();
  }, []);

  const handleEliminar = async () => {
    if (!confirmEliminar) return;

    const auto = confirmEliminar;
    setEliminando(auto.id);
    setConfirmEliminar(null);
    setMensaje(null);

    try {
      await autosService.eliminar(auto.id);
      await cargar();
      setMensaje({ tipo: "ok", texto: "Vehículo eliminado correctamente." });
    } catch {
      setMensaje({ tipo: "error", texto: "No se pudo eliminar el vehículo." });
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

      {mensaje && (
        <div
          role="status"
          className={`px-4 py-3 rounded mb-6 text-sm border ${
            mensaje.tipo === "ok"
              ? "bg-green-50 border-green-200 text-green-700"
              : "bg-red-50 border-red-200 text-red-700"
          }`}
        >
          {mensaje.texto}
        </div>
      )}

      {cargando ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <AutosTable
          autos={autos}
          imagenesError={imagenesError}
          onImagenError={(id) =>
            setImagenesError((prev) => ({
              ...prev,
              [id]: true,
            }))
          }
          eliminando={eliminando}
          onSubirImagen={setModalImagen}
          onEditar={setModalForm}
          onPedirEliminar={setConfirmEliminar}
        />
      )}

      {/* Modales */}
      {modalForm && (
        <AutoFormModal
          auto={modalForm === "nuevo" ? null : modalForm}
          onCerrar={() => setModalForm(null)}
          onGuardado={() => {
            setModalForm(null);
            cargar();
            setMensaje({
              tipo: "ok",
              texto: `Vehículo ${modalForm === "nuevo" ? "creado" : "actualizado"} correctamente.`,
            });
          }}
        />
      )}
      {modalImagen && (
        <AutoImageModal
          auto={modalImagen}
          onCerrar={() => setModalImagen(null)}
          onGuardado={() => {
            setModalImagen(null);
            cargar();
            setMensaje({ tipo: "ok", texto: "Imagen subida correctamente." });
          }}
        />
      )}
      <AutoDeleteConfirmModal
        auto={confirmEliminar}
        onCancelar={() => setConfirmEliminar(null)}
        onConfirmar={handleEliminar}
      />
    </div>
  );
}

export default AdminAutos;
