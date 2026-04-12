import { DASHBOARD_STATUS_ITEMS } from "../../constants/dashboard";

function ReservationsStatusCard({ reservas }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
      <h2 className="font-semibold text-gray-900 mb-4">Estado de reservas</h2>
      <div className="space-y-3">
        {DASHBOARD_STATUS_ITEMS.map(({ key, label, color }) => {
          const val = reservas[key];
          const pct = reservas.total
            ? Math.round((val / reservas.total) * 100)
            : 0;

          return (
            <div key={key}>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">{label}</span>
                <span className="font-semibold text-gray-900">
                  {val}{" "}
                  <span className="text-gray-400 font-normal">({pct}%)</span>
                </span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${color}`}
                  style={{ width: `${pct}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ReservationsStatusCard;
