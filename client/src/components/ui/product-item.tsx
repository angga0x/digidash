import { BriefcaseIcon } from "lucide-react";

interface ProductItemProps {
  name: string;
  units: number;
  percentage: number;
}

export default function ProductItem({ name, units, percentage }: ProductItemProps) {
  return (
    <div className="flex">
      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
        <BriefcaseIcon className="h-6 w-6 text-gray-500" />
      </div>
      <div className="flex-grow">
        <div className="flex justify-between items-center">
          <p className="text-sm font-medium text-gray-900 truncate">{name}</p>
          <p className="text-sm font-medium text-gray-500">{units} units</p>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
          <div 
            className="bg-primary h-1.5 rounded-full" 
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}
