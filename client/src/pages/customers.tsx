import Sidebar from "@/components/ui/sidebar";

export default function Customers() {
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Customers</h1>
          <p className="text-gray-600">Manage your customer relationships</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Customer Directory</h2>
            <div className="flex space-x-2">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
                Add New Customer
              </button>
              <input 
                type="text" 
                placeholder="Search customers..." 
                className="border rounded p-2 text-sm"
              />
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr className="border-b">
                  <th className="py-3 px-4 text-left">ID</th>
                  <th className="py-3 px-4 text-left">Name</th>
                  <th className="py-3 px-4 text-left">Email</th>
                  <th className="py-3 px-4 text-left">Phone</th>
                  <th className="py-3 px-4 text-left">Total Orders</th>
                  <th className="py-3 px-4 text-left">Total Spent</th>
                  <th className="py-3 px-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">1</td>
                  <td className="py-3 px-4">John Smith</td>
                  <td className="py-3 px-4">john@example.com</td>
                  <td className="py-3 px-4">+1 234-567-8901</td>
                  <td className="py-3 px-4">12</td>
                  <td className="py-3 px-4">$1,249.99</td>
                  <td className="py-3 px-4">
                    <button className="text-blue-600 hover:text-blue-900 mr-2">View</button>
                    <button className="text-gray-600 hover:text-gray-900">Edit</button>
                  </td>
                </tr>
                <tr className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">2</td>
                  <td className="py-3 px-4">Sarah Johnson</td>
                  <td className="py-3 px-4">sarah@example.com</td>
                  <td className="py-3 px-4">+1 234-567-8902</td>
                  <td className="py-3 px-4">8</td>
                  <td className="py-3 px-4">$879.50</td>
                  <td className="py-3 px-4">
                    <button className="text-blue-600 hover:text-blue-900 mr-2">View</button>
                    <button className="text-gray-600 hover:text-gray-900">Edit</button>
                  </td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="py-3 px-4">3</td>
                  <td className="py-3 px-4">Michael Brown</td>
                  <td className="py-3 px-4">michael@example.com</td>
                  <td className="py-3 px-4">+1 234-567-8903</td>
                  <td className="py-3 px-4">3</td>
                  <td className="py-3 px-4">$375.25</td>
                  <td className="py-3 px-4">
                    <button className="text-blue-600 hover:text-blue-900 mr-2">View</button>
                    <button className="text-gray-600 hover:text-gray-900">Edit</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div className="mt-4 flex justify-between items-center">
            <div className="text-sm text-gray-600">Showing 1-3 of 18 customers</div>
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