import { ReactNode } from "react";

interface ChartContainerProps {
  title: string;
  actions?: ReactNode;
  children: ReactNode;
}

export default function ChartContainer({
  title,
  actions,
  children,
}: ChartContainerProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
        {actions && <div>{actions}</div>}
      </div>
      <div className="h-80">{children}</div>
    </div>
  );
}
