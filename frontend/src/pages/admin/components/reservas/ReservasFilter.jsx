function ReservasFilter({ estados, filtro, onCambiarFiltro }) {
  return (
    <div className="flex gap-2 flex-wrap">
      <button
        onClick={() => onCambiarFiltro("")}
        aria-pressed={filtro === ""}
        className={`px-3 py-1.5 text-xs font-semibold rounded-full border transition-colors ${
          filtro === ""
            ? "bg-gray-900 text-white border-gray-900"
            : "bg-white text-gray-600 border-gray-300 hover:border-gray-500"
        }`}
      >
        Todas
      </button>

      {estados.map((estado) => (
        <button
          key={estado}
          onClick={() => onCambiarFiltro(estado)}
          aria-pressed={filtro === estado}
          className={`px-3 py-1.5 text-xs font-semibold rounded-full border transition-colors ${
            filtro === estado
              ? "bg-amber-500 text-white border-amber-500"
              : "bg-white text-gray-600 border-gray-300 hover:border-amber-400"
          }`}
        >
          {estado}
        </button>
      ))}
    </div>
  );
}

export default ReservasFilter;
