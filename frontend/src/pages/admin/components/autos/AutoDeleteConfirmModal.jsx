function AutoDeleteConfirmModal({ auto, onCancelar, onConfirmar }) {
  if (!auto) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div
        className="bg-white rounded-xl shadow-xl w-full max-w-md"
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-eliminar-title"
      >
        <div className="p-5 border-b border-gray-100">
          <h2
            id="confirm-eliminar-title"
            className="font-bold text-gray-900 text-lg"
          >
            Confirmar eliminación
          </h2>
          <p className="text-sm text-gray-600 mt-2">
            ¿Seguro que quieres eliminar {auto.marca} {auto.modelo}? Esta acción
            es irreversible.
          </p>
        </div>
        <div className="p-5 flex gap-3">
          <button
            type="button"
            onClick={onCancelar}
            className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirmar}
            className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded text-sm font-bold transition-colors"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}

export default AutoDeleteConfirmModal;
