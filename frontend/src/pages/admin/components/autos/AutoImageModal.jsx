import { useEffect, useRef, useState } from "react";
import { autosService } from "../../../../services/api";
import Icon from "../../../../components/Icon";

function AutoImageModal({ auto, onCerrar, onGuardado }) {
  const [archivo, setArchivo] = useState(null);
  const [preview, setPreview] = useState(null);
  const [subiendo, setSubiendo] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef(null);
  const previewRef = useRef(null);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        onCerrar();
      }
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      if (previewRef.current) {
        URL.revokeObjectURL(previewRef.current);
      }
    };
  }, [onCerrar]);

  const handleArchivo = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (previewRef.current) {
      URL.revokeObjectURL(previewRef.current);
    }

    const nextPreview = URL.createObjectURL(file);
    previewRef.current = nextPreview;
    setArchivo(file);
    setPreview(nextPreview);
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
      <div
        className="bg-white rounded-xl shadow-xl w-full max-w-sm"
        role="dialog"
        aria-modal="true"
        aria-labelledby="imagen-modal-title"
      >
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h2 id="imagen-modal-title" className="font-bold text-gray-900">
            Subir imagen
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
        <div className="p-5 space-y-4">
          <p className="text-sm text-gray-500">
            {auto.marca} {auto.modelo} ({auto.anio})
          </p>

          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            aria-label="Seleccionar imagen"
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
                <span className="text-gray-400 mb-2">
                  <Icon
                    path="M3 7h4l2-2h6l2 2h4v12H3V7zm9 10a4 4 0 100-8 4 4 0 000 8z"
                    className="w-8 h-8"
                  />
                </span>
                <p className="text-sm text-gray-500">
                  Haz clic para seleccionar
                </p>
              </>
            )}
          </button>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            onChange={handleArchivo}
            className="hidden"
          />

          {error && (
            <p role="alert" className="text-sm text-red-600">
              {error}
            </p>
          )}

          <div className="flex gap-3">
            <button
              type="button"
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

export default AutoImageModal;
