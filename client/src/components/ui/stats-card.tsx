import { ReactNode } from "react";
import { ArrowUpIcon, ArrowDownIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number | undefined;
  icon: ReactNode;
  iconBgClass: string;
  borderClass: string;
  trend?: {
    value: string;
    label: string;
    direction: "up" | "down";
  };
}

export default function StatsCard({
  title,
  value,
  icon,
  iconBgClass,
  borderClass,
  trend,
}: StatsCardProps) {
  return (
    <div className={`bg-white rounded-lg shadow p-6 border-l-4 ${borderClass}`}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {trend && (
            <p
              className={`text-sm ${
                trend.direction === "up" ? "text-green-600" : "text-red-600"
              } mt-1 flex items-center`}
            >
              {trend.direction === "up" ? (
                <ArrowUpIcon className="h-4 w-4 mr-1" />
              ) : (
                <ArrowDownIcon className="h-4 w-4 mr-1" />
              )}
              <span>
                {trend.value} {trend.label}
              </span>
            </p>
          )}
        </div>
        <div className={`p-3 ${iconBgClass} rounded-full`}>{icon}</div>
      </div>
    </div>
  );
}
