function FleetAvailabilityCard({ autos }) {
  const porcentaje = autos.total
    ? Math.round((autos.disponibles / autos.total) * 100)
    : 0;
  const dashValue = autos.total ? (autos.disponibles / autos.total) * 100 : 0;

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
      <h2 className="font-semibold text-gray-900 mb-4">
        Disponibilidad de flota
      </h2>
      <div className="flex items-center justify-center h-32">
        <div className="relative w-32 h-32">
          <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
            <circle
              cx="18"
              cy="18"
              r="15.9"
              fill="none"
              stroke="#f3f4f6"
              strokeWidth="3.5"
            />
            <circle
              cx="18"
              cy="18"
              r="15.9"
              fill="none"
              stroke="#f59e0b"
              strokeWidth="3.5"
              strokeDasharray={`${dashValue} 100`}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-gray-900">
              {porcentaje}%
            </span>
            <span className="text-xs text-gray-400">libres</span>
          </div>
        </div>
      </div>
      <div className="flex justify-around text-center mt-2 text-sm">
        <div>
          <p className="font-bold text-amber-500">{autos.disponibles}</p>
          <p className="text-gray-400 text-xs">Disponibles</p>
        </div>
        <div>
          <p className="font-bold text-gray-700">{autos.ocupados}</p>
          <p className="text-gray-400 text-xs">Ocupados</p>
        </div>
      </div>
    </div>
  );
}

export default FleetAvailabilityCard;
