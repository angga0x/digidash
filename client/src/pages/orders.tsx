import Sidebar from "@/components/ui/sidebar";

export default function Orders() {
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
          <p className="text-gray-600">Manage customer orders and transactions</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Order History</h2>
            <div className="flex space-x-2">
              <select className="border rounded p-2 text-sm">
                <option>All Status</option>
                <option>Completed</option>
                <option>Processing</option>
                <option>Pending</option>
                <option>Cancelled</option>
              </select>
              <input 
                type="text" 
                placeholder="Search orders..." 
                className="border rounded p-2 text-sm"
              />
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr className="border-b">
                  <th className="py-3 px-4 text-left">Order ID</th>
                  <th className="py-3 px-4 text-left">Customer</th>
                  <th className="py-3 px-4 text-left">Date</th>
                  <th className="py-3 px-4 text-left">Status</th>
                  <th className="py-3 px-4 text-left">Total</th>
                  <th className="py-3 px-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">#ORD-001</td>
                  <td className="py-3 px-4">John Smith</td>
                  <td className="py-3 px-4">Apr 2, 2023</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Completed</span>
                  </td>
                  <td className="py-3 px-4">$249.99</td>
                  <td className="py-3 px-4">
                    <button className="text-blue-600 hover:text-blue-900 mr-2">View</button>
                    <button className="text-gray-600 hover:text-gray-900">Invoice</button>
                  </td>
                </tr>
                <tr className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">#ORD-002</td>
                  <td className="py-3 px-4">Sarah Johnson</td>
                  <td className="py-3 px-4">Apr 1, 2023</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">Processing</span>
                  </td>
                  <td className="py-3 px-4">$129.50</td>
                  <td className="py-3 px-4">
                    <button className="text-blue-600 hover:text-blue-900 mr-2">View</button>
                    <button className="text-gray-600 hover:text-gray-900">Invoice</button>
                  </td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="py-3 px-4">#ORD-003</td>
                  <td className="py-3 px-4">Michael Brown</td>
                  <td className="py-3 px-4">Mar 30, 2023</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">Cancelled</span>
                  </td>
                  <td className="py-3 px-4">$75.25</td>
                  <td className="py-3 px-4">
                    <button className="text-blue-600 hover:text-blue-900 mr-2">View</button>
                    <button className="text-gray-600 hover:text-gray-900">Invoice</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div className="mt-4 flex justify-between items-center">
            <div className="text-sm text-gray-600">Showing 1-3 of 25 orders</div>
            <div className="flex space-x-2">
              <button className="px-3 py-1 border rounded bg-gray-100">Previous</button>
              <button className="px-3 py-1 border rounded bg-blue-600 text-white">Next</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}