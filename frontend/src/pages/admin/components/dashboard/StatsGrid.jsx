import Icon from "../../../../components/Icon";
import { DASHBOARD_STAT_CARDS } from "../../constants/dashboard";

function StatCard({ label, value, sub, color, icon }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
      <div className="flex items-start justify-between mb-3">
        <span className="text-gray-500">
          <Icon path={icon} className="w-6 h-6" />
        </span>
        <span
          className={`text-xs font-semibold px-2 py-0.5 rounded-full ${color}`}
        >
          {sub}
        </span>
      </div>
      <p className="text-2xl font-bold text-gray-900 mb-1">{value}</p>
      <p className="text-sm text-gray-500">{label}</p>
    </div>
  );
}

function StatsGrid({ stats }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {DASHBOARD_STAT_CARDS.map((card) => (
        <StatCard
          key={card.key}
          icon={card.icon}
          label={card.label}
          value={card.getValue(stats)}
          sub={card.getSub(stats)}
          color={card.color}
        />
      ))}
    </div>
  );
}

export default StatsGrid;
