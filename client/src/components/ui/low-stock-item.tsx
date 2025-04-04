import { AlertTriangleIcon } from "lucide-react";

interface LowStockItemProps {
  name: string;
  stock: number;
  status: "critical" | "warning";
}

export default function LowStockItem({ name, stock, status }: LowStockItemProps) {
  const getBgColor = () => status === "critical" ? "bg-red-50" : "bg-yellow-50";
  const getDotColor = () => status === "critical" ? "bg-red-100" : "bg-yellow-100";
  const getTextColor = () => status === "critical" ? "text-red-500" : "text-yellow-500";
  const getLabelColor = () => status === "critical" ? "text-red-600" : "text-yellow-600";
  const getMessage = () => status === "critical" ? "Reorder soon" : "Getting low";

  return (
    <div className={`flex items-center p-3 ${getBgColor()} rounded-lg`}>
      <div className={`w-8 h-8 ${getDotColor()} rounded-full flex items-center justify-center mr-3 flex-shrink-0`}>
        <AlertTriangleIcon className={`h-5 w-5 ${getTextColor()}`} />
      </div>
      <div className="flex-grow">
        <div className="flex justify-between items-center">
          <p className="text-sm font-medium text-gray-900">{name}</p>
          <p className={`text-sm font-bold ${getLabelColor()}`}>{stock} left</p>
        </div>
        <p className="text-xs text-gray-500 mt-1">{getMessage()}</p>
      </div>
    </div>
  );
}
