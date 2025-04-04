import Sidebar from "@/components/ui/sidebar";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { PieChart, Pie, Cell, Legend } from 'recharts';

// Sample data for charts
const monthlySales = [
  { name: 'Jan', sales: 4000 },
  { name: 'Feb', sales: 3000 },
  { name: 'Mar', sales: 5000 },
  { name: 'Apr', sales: 2780 },
  { name: 'May', sales: 1890 },
  { name: 'Jun', sales: 2390 },
];

const salesByCategory = [
  { name: 'Electronics', value: 400 },
  { name: 'Clothing', value: 300 },
  { name: 'Home Goods', value: 200 },
  { name: 'Accessories', value: 200 },
  { name: 'Other', value: 100 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export default function Reports() {
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Reports</h1>
          <p className="text-gray-600">Analyze your business performance</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Monthly Sales Chart */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Monthly Sales</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={monthlySales}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="sales" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          {/* Sales by Category Chart */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Sales by Category</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={salesByCategory}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {salesByCategory.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          {/* Top Selling Products */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Top Selling Products</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead>
                  <tr className="border-b">
                    <th className="py-3 px-4 text-left">Product</th>
                    <th className="py-3 px-4 text-left">Units Sold</th>
                    <th className="py-3 px-4 text-left">Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">Product One</td>
                    <td className="py-3 px-4">245</td>
                    <td className="py-3 px-4">$12,249.99</td>
                  </tr>
                  <tr className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">Product Two</td>
                    <td className="py-3 px-4">187</td>
                    <td className="py-3 px-4">$9,349.50</td>
                  </tr>
                  <tr className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">Product Three</td>
                    <td className="py-3 px-4">156</td>
                    <td className="py-3 px-4">$7,799.25</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="py-3 px-4">Product Four</td>
                    <td className="py-3 px-4">132</td>
                    <td className="py-3 px-4">$6,598.68</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          
          {/* Customer Metrics */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Customer Metrics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-gray-500 text-sm font-medium">New Customers</h3>
                <p className="text-2xl font-bold">127</p>
                <p className="text-green-600 text-sm">+12% from last month</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-gray-500 text-sm font-medium">Average Order Value</h3>
                <p className="text-2xl font-bold">$78.65</p>
                <p className="text-green-600 text-sm">+5% from last month</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-gray-500 text-sm font-medium">Returning Customers</h3>
                <p className="text-2xl font-bold">68%</p>
                <p className="text-green-600 text-sm">+3% from last month</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-gray-500 text-sm font-medium">Customer Satisfaction</h3>
                <p className="text-2xl font-bold">94%</p>
                <p className="text-green-600 text-sm">+1% from last month</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}