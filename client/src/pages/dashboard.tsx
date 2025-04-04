import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { useWebSocketData } from "@/hooks/use-websocket-data";
import Sidebar from "@/components/ui/sidebar";
import StatsCard from "@/components/ui/stats-card";
import ChartContainer from "@/components/ui/chart-container";
import LowStockItem from "@/components/ui/low-stock-item";
import ProductItem from "@/components/ui/product-item";
import { formatCurrency } from "@/lib/formatters";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { 
  ArrowUpIcon, 
  LayoutDashboardIcon, 
  TrendingUpIcon, 
  BanknoteIcon, 
  ChartBar, 
  SearchIcon, 
  BellIcon 
} from "lucide-react";

type TimeRange = "week" | "month" | "year";

export default function Dashboard() {
  const [transactionTimeRange, setTransactionTimeRange] = useState<TimeRange>("week");
  const [categoryTimeRange, setCategoryTimeRange] = useState<TimeRange>("week");

  // Use WebSocket data when available (for real-time updates)
  const { 
    data: wsData, 
    loading: wsLoading, 
    error: wsError 
  } = useWebSocketData();

  // Fallback to regular REST API if WebSocket is not available
  const { data: salesStats, isLoading: isLoadingSales } = useQuery({
    queryKey: ['/api/stats/sales'],
    enabled: !wsData || !wsData.salesStats, // Only run if WebSocket data is not available
  });

  const { data: userStats, isLoading: isLoadingUsers } = useQuery({
    queryKey: ['/api/stats/users'],
    enabled: !wsData || !wsData.userStats,
  });

  const { data: productStats, isLoading: isLoadingProducts } = useQuery({
    queryKey: ['/api/stats/products'],
    enabled: !wsData || !wsData.productStats,
  });

  const { data: transactionStats, isLoading: isLoadingTransactions } = useQuery({
    queryKey: ['/api/stats/transactions'],
    enabled: !wsData || !wsData.transactionStats,
  });

  // Use WebSocket data or fallback to REST API data
  const salesData = wsData?.salesStats || salesStats;
  const userData = wsData?.userStats || userStats;
  const productsData = wsData?.productStats || productStats;
  const transactionsData = wsData?.transactionStats || transactionStats;
  
  // Determine loading state (either WS is loading or REST API is loading and WS data is not available)
  const isSalesLoading = wsLoading || (isLoadingSales && !wsData?.salesStats);
  const isUsersLoading = wsLoading || (isLoadingUsers && !wsData?.userStats);
  const isProductsLoading = wsLoading || (isLoadingProducts && !wsData?.productStats);
  const isTransactionsLoading = wsLoading || (isLoadingTransactions && !wsData?.transactionStats);

  // Chart colors
  const COLORS = ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#6B7280'];

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <Sidebar />

      <div className="flex-1 overflow-hidden">
        {/* Top navigation */}
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <h1 className="text-xl font-semibold text-gray-900">Dashboard Overview</h1>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-2">
                  <SearchIcon className="h-5 w-5 text-gray-400" />
                </span>
                <input 
                  type="text" 
                  placeholder="Search..." 
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <button className="p-2 text-gray-500 hover:text-gray-700">
                <span className="relative">
                  <BellIcon className="h-6 w-6" />
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs">3</span>
                </span>
              </button>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="p-4 sm:p-6 lg:p-8 overflow-y-auto h-[calc(100vh-70px)]">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-700">Sales Statistics</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
              <StatsCard
                title="Total Transactions"
                value={isSalesLoading ? "Loading..." : salesData?.totalTransactions.toLocaleString()}
                icon={<TrendingUpIcon className="h-8 w-8 text-primary" />}
                iconBgClass="bg-blue-50"
                borderClass="border-primary"
                trend={{ value: "8.2%", label: "from last month", direction: "up" }}
              />
              
              <StatsCard
                title="Total Revenue"
                value={isSalesLoading ? "Loading..." : formatCurrency(salesData?.totalRevenue)}
                icon={<BanknoteIcon className="h-8 w-8 text-secondary" />}
                iconBgClass="bg-green-50"
                borderClass="border-secondary"
                trend={{ value: "12.5%", label: "from last month", direction: "up" }}
              />
              
              <StatsCard
                title="Total Profit"
                value={isSalesLoading ? "Loading..." : formatCurrency(salesData?.totalProfit)}
                icon={<ChartBar className="h-8 w-8 text-warning" />}
                iconBgClass="bg-yellow-50"
                borderClass="border-warning"
                trend={{ value: "4.2%", label: "from last month", direction: "up" }}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Transaction History Chart */}
            <ChartContainer 
              title="Daily Transactions"
              actions={
                <div className="flex space-x-2">
                  <button 
                    className={`px-3 py-1 text-sm rounded ${transactionTimeRange === 'week' ? 'bg-blue-50 text-primary' : 'text-gray-500 hover:bg-gray-100'}`}
                    onClick={() => setTransactionTimeRange('week')}
                  >
                    Week
                  </button>
                  <button 
                    className={`px-3 py-1 text-sm rounded ${transactionTimeRange === 'month' ? 'bg-blue-50 text-primary' : 'text-gray-500 hover:bg-gray-100'}`}
                    onClick={() => setTransactionTimeRange('month')}
                  >
                    Month
                  </button>
                  <button 
                    className={`px-3 py-1 text-sm rounded ${transactionTimeRange === 'year' ? 'bg-blue-50 text-primary' : 'text-gray-500 hover:bg-gray-100'}`}
                    onClick={() => setTransactionTimeRange('year')}
                  >
                    Year
                  </button>
                </div>
              }
            >
              {isTransactionsLoading ? (
                <div className="h-80 flex items-center justify-center">
                  <p>Loading chart data...</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={320}>
                  <LineChart
                    data={transactionsData?.dailyTransactions}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(200, 200, 200, 0.3)" />
                    <XAxis 
                      dataKey="date" 
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(value) => {
                        const date = new Date(value);
                        return date.toLocaleDateString('en-US', { weekday: 'short' });
                      }}
                    />
                    <YAxis axisLine={false} tickLine={false} />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="count"
                      stroke="#3B82F6"
                      activeDot={{ r: 8 }}
                      strokeWidth={2}
                      name="Transactions"
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </ChartContainer>

            {/* Popular Categories Chart */}
            <ChartContainer 
              title="Best-Selling Categories"
              actions={
                <div>
                  <select 
                    className="text-sm border-gray-300 rounded-md"
                    value={categoryTimeRange}
                    onChange={(e) => setCategoryTimeRange(e.target.value as TimeRange)}
                  >
                    <option value="week">Last 7 Days</option>
                    <option value="month">Last 30 Days</option>
                    <option value="year">Last 90 Days</option>
                  </select>
                </div>
              }
            >
              {isTransactionsLoading ? (
                <div className="h-80 flex items-center justify-center">
                  <p>Loading chart data...</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={320}>
                  <PieChart>
                    <Pie
                      data={transactionsData?.categoryDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={120}
                      innerRadius={84}
                      fill="#8884d8"
                      dataKey="count"
                      nameKey="category"
                    >
                      {transactionsData?.categoryDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Legend 
                      layout="vertical" 
                      verticalAlign="middle" 
                      align="right"
                      wrapperStyle={{ paddingLeft: "10px" }}
                    />
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </ChartContainer>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* User Statistics */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">User Statistics</h3>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <p className="text-sm font-medium text-gray-500">Total Active Users</p>
                    <p className="text-sm font-medium text-gray-900">
                      {isUsersLoading ? "Loading..." : userData?.totalActiveUsers.toLocaleString()}
                    </p>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: "78%" }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <p className="text-sm font-medium text-gray-500">Average Balance</p>
                    <p className="text-sm font-medium text-gray-900">
                      {isUsersLoading ? "Loading..." : formatCurrency(userData?.averageBalance)}
                    </p>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-secondary h-2 rounded-full" style={{ width: "65%" }}></div>
                  </div>
                </div>
                <div className="pt-4 border-t">
                  <div className="flex items-center mb-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                    <p className="text-sm font-medium text-gray-700">New Users (Today)</p>
                    <p className="ml-auto text-sm font-medium text-gray-900">124</p>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                    <p className="text-sm font-medium text-gray-700">Active Users (Today)</p>
                    <p className="ml-auto text-sm font-medium text-gray-900">1,856</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Best Selling Products */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Best Selling Products</h3>
              <div className="space-y-4">
                {isProductsLoading ? (
                  <p>Loading best selling products...</p>
                ) : (
                  productsData?.bestSelling.map((item, index) => (
                    <ProductItem
                      key={item.product.id}
                      name={item.product.name}
                      units={item.soldQuantity}
                      percentage={index === 0 ? 95 : index === 1 ? 78 : index === 2 ? 60 : 45}
                    />
                  ))
                )}
              </div>
            </div>

            {/* Low Stock Products */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Low Stock Products</h3>
              <div className="space-y-4">
                {isProductsLoading ? (
                  <p>Loading low stock products...</p>
                ) : (
                  productsData?.lowStock.map(product => (
                    <LowStockItem
                      key={product.id}
                      name={product.name}
                      stock={product.stock}
                      status={product.stock <= 5 ? "critical" : "warning"}
                    />
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Most Profitable Products Table */}
          <div className="bg-white rounded-lg shadow mb-6">
            <div className="p-6 border-b">
              <h3 className="text-lg font-semibold text-gray-700">Most Profitable Products</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                    <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                    <th className="py-3 px-6 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                    <th className="py-3 px-6 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Profit Margin</th>
                    <th className="py-3 px-6 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total Sales</th>
                    <th className="py-3 px-6 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total Profit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {isProductsLoading ? (
                    <tr>
                      <td colSpan={6} className="py-4 px-6 text-center">Loading profitable products...</td>
                    </tr>
                  ) : (
                    productsData?.mostProfitable.map(item => (
                      <tr key={item.product.id} className="hover:bg-gray-50">
                        <td className="py-4 px-6 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 flex-shrink-0 bg-gray-100 rounded-md"></div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{item.product.name}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-500">{item.product.category}</td>
                        <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-900 text-right">{formatCurrency(item.product.sellingPrice)}</td>
                        <td className="py-4 px-6 whitespace-nowrap text-right text-sm">
                          <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full">{item.profitMargin.toFixed(1)}%</span>
                        </td>
                        <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-900 text-right">{item.totalSales} units</td>
                        <td className="py-4 px-6 whitespace-nowrap text-sm font-medium text-gray-900 text-right">{formatCurrency(item.totalProfit)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <div className="px-6 py-4 border-t">
              <button className="text-primary hover:text-primary-dark font-medium text-sm">View All Products</button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
