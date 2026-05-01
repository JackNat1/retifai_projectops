import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Briefcase, Map, Package, ShoppingCart, CheckSquare, Users, FileText } from 'lucide-react';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();

  const navItems = [
    { name: 'Projects', path: '/projects', icon: Briefcase },
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Areas', path: '/areas', icon: Map },
    { name: 'BOM', path: '/bom', icon: Package },
    { name: 'Procurement', path: '/procurement', icon: ShoppingCart },
    { name: 'Tasks', path: '/tasks', icon: CheckSquare },
    { name: 'Item Master', path: '/items', icon: Package },
    { name: 'Vendors', path: '/vendors', icon: Users },
    { name: 'Reports', path: '/reports', icon: FileText },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-blue-600">ProjectOps</h1>
        </div>
        <nav className="mt-6">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 ${
                  isActive ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600' : ''
                }`}
              >
                <Icon size={20} className="mr-3" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <header className="bg-white shadow-sm px-8 py-4">
          <h2 className="text-xl font-semibold text-gray-800">
            {navItems.find((item) => item.path === location.pathname)?.name || 'Welcome'}
          </h2>
        </header>
        <main className="p-8">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
