import { useState } from "react";
import { Link, useLocation } from "wouter";
import {
  LayoutDashboardIcon,
  PackageIcon,
  ClipboardListIcon, 
  UsersIcon,
  BarChart3Icon,
  SettingsIcon,
  MenuIcon
} from "lucide-react";

export default function Sidebar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [location] = useLocation();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Menu items configuration
  const menuItems = [
    { path: "/", label: "Dashboard", icon: LayoutDashboardIcon },
    { path: "/products", label: "Products", icon: PackageIcon },
    { path: "/orders", label: "Orders", icon: ClipboardListIcon },
    { path: "/customers", label: "Customers", icon: UsersIcon },
    { path: "/reports", label: "Reports", icon: BarChart3Icon },
    { path: "/settings", label: "Settings", icon: SettingsIcon },
  ];

  return (
    <div className="bg-[#1F2937] text-white md:w-64 w-full md:min-h-screen">
      <div className="p-4 flex items-center justify-between md:justify-start">
        <div className="flex items-center space-x-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#3B82F6]" viewBox="0 0 20 20" fill="currentColor">
            <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
          <h1 className="text-xl font-bold">SalesDash</h1>
        </div>
        <button className="md:hidden" onClick={toggleMobileMenu}>
          <MenuIcon className="h-6 w-6" />
        </button>
      </div>
      <div className={`${isMobileMenuOpen ? 'block' : 'hidden'} md:block`}>
        <nav className="py-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.path;
            return (
              <Link key={item.path} href={item.path}>
                <div 
                  className={`flex items-center px-4 py-3 cursor-pointer ${
                    isActive 
                      ? "bg-[#111827] text-white border-l-4 border-[#3B82F6]" 
                      : "text-gray-300 hover:bg-[#111827] hover:text-white"
                  }`}
                >
                  <Icon className="h-5 w-5 mr-3" />
                  {item.label}
                </div>
              </Link>
            );
          })}
        </nav>
        <div className="px-4 py-6 border-t border-[#374151]">
          <div className="flex items-center">
            <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="User Avatar" className="w-10 h-10 rounded-full mr-3" />
            <div>
              <p className="text-sm font-medium text-white">John Smith</p>
              <p className="text-xs text-gray-400">Admin</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
