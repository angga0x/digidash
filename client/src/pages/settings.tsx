import Sidebar from "@/components/ui/sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export default function Settings() {
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600">Manage your store preferences and configuration</p>
        </div>
        
        <div className="bg-white rounded-lg shadow">
          <Tabs defaultValue="account">
            <div className="border-b px-6 py-3">
              <TabsList className="grid w-full md:w-auto md:inline-grid grid-cols-4 md:grid-cols-5 gap-2">
                <TabsTrigger value="account">Account</TabsTrigger>
                <TabsTrigger value="store">Store</TabsTrigger>
                <TabsTrigger value="payment">Payment</TabsTrigger>
                <TabsTrigger value="notification">Notifications</TabsTrigger>
                <TabsTrigger value="security" className="hidden md:block">Security</TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="account" className="p-6">
              <h2 className="text-xl font-semibold mb-4">Account Settings</h2>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" value="John Smith" className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" value="john@example.com" className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" value="+1 234-567-8901" className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="role">Role</Label>
                    <select id="role" className="mt-1 w-full p-2 border rounded-md">
                      <option>Administrator</option>
                      <option>Manager</option>
                      <option>Staff</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="bio">Bio</Label>
                  <textarea 
                    id="bio" 
                    className="mt-1 w-full p-2 border rounded-md h-24"
                    placeholder="Tell us about yourself"
                  ></textarea>
                </div>
                
                <Button className="bg-blue-600 hover:bg-blue-700">Save Changes</Button>
              </div>
            </TabsContent>
            
            <TabsContent value="store" className="p-6">
              <h2 className="text-xl font-semibold mb-4">Store Settings</h2>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="store-name">Store Name</Label>
                    <Input id="store-name" value="My Awesome Store" className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="store-url">Store URL</Label>
                    <Input id="store-url" value="https://mystore.com" className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="store-currency">Currency</Label>
                    <select id="store-currency" className="mt-1 w-full p-2 border rounded-md">
                      <option>USD ($)</option>
                      <option>EUR (€)</option>
                      <option>GBP (£)</option>
                      <option>JPY (¥)</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="timezone">Timezone</Label>
                    <select id="timezone" className="mt-1 w-full p-2 border rounded-md">
                      <option>Pacific Time (PT)</option>
                      <option>Mountain Time (MT)</option>
                      <option>Central Time (CT)</option>
                      <option>Eastern Time (ET)</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <Label>Store Logo</Label>
                  <div className="mt-1 flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gray-200 rounded-md flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <Button variant="outline">Upload New Logo</Button>
                  </div>
                </div>
                
                <Button className="bg-blue-600 hover:bg-blue-700">Save Changes</Button>
              </div>
            </TabsContent>
            
            <TabsContent value="payment" className="p-6">
              <h2 className="text-xl font-semibold mb-4">Payment Settings</h2>
              <div className="space-y-6">
                <div className="border rounded-md p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="bg-blue-100 p-2 rounded-md">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-medium">Credit Card</h3>
                        <p className="text-sm text-gray-500">Accept Visa, Mastercard, Amex</p>
                      </div>
                    </div>
                    <Switch checked={true} />
                  </div>
                </div>
                
                <div className="border rounded-md p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="bg-green-100 p-2 rounded-md">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-medium">PayPal</h3>
                        <p className="text-sm text-gray-500">Accept PayPal payments</p>
                      </div>
                    </div>
                    <Switch checked={false} />
                  </div>
                </div>
                
                <div className="border rounded-md p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="bg-purple-100 p-2 rounded-md">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-medium">Stripe</h3>
                        <p className="text-sm text-gray-500">Accept payments via Stripe</p>
                      </div>
                    </div>
                    <Switch checked={true} />
                  </div>
                </div>
                
                <Button className="bg-blue-600 hover:bg-blue-700">Save Changes</Button>
              </div>
            </TabsContent>
            
            <TabsContent value="notification" className="p-6">
              <h2 className="text-xl font-semibold mb-4">Notification Settings</h2>
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Order Confirmations</h3>
                      <p className="text-sm text-gray-500">Receive notifications when a new order is placed</p>
                    </div>
                    <Switch checked={true} />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Low Stock Alerts</h3>
                      <p className="text-sm text-gray-500">Get notified when products are running low</p>
                    </div>
                    <Switch checked={true} />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Customer Reviews</h3>
                      <p className="text-sm text-gray-500">Receive notifications for new product reviews</p>
                    </div>
                    <Switch checked={false} />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Marketing Updates</h3>
                      <p className="text-sm text-gray-500">Receive newsletters and promotional materials</p>
                    </div>
                    <Switch checked={false} />
                  </div>
                </div>
                
                <Button className="bg-blue-600 hover:bg-blue-700">Save Changes</Button>
              </div>
            </TabsContent>
            
            <TabsContent value="security" className="p-6">
              <h2 className="text-xl font-semibold mb-4">Security Settings</h2>
              <div className="space-y-6">
                <div className="space-y-3">
                  <h3 className="font-medium">Change Password</h3>
                  <div>
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input id="current-password" type="password" className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="new-password">New Password</Label>
                    <Input id="new-password" type="password" className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <Input id="confirm-password" type="password" className="mt-1" />
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h3 className="font-medium">Two-Factor Authentication</h3>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                    </div>
                    <Switch checked={false} />
                  </div>
                </div>
                
                <Button className="bg-blue-600 hover:bg-blue-700">Save Changes</Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}