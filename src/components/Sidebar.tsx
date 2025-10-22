import { Link, useLocation } from "react-router-dom";
import { Home, Package2, Grid3X3, ShoppingCart, User, FileText, Settings } from "lucide-react";

const navigationItems = [
  { icon: Home, label: "Home", path: "/" },
  { icon: Package2, label: "Products", path: "/products" },
  { icon: Grid3X3, label: "Categories", path: "/categories" },
  { icon: ShoppingCart, label: "Cart", path: "/cart" },
  { icon: User, label: "Profile", path: "/profile" },
  { icon: FileText, label: "Orders", path: "/orders" },
  { icon: Settings, label: "Settings", path: "/settings" },
];

export function NavigationSidebar() {
  const location = useLocation();

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 shadow-sm z-40">
      <div className="flex flex-col h-full">
        <div className="flex items-center p-6 border-b border-gray-200">
          <img src="/src/assets/logo.png" alt="TekadDaya Logo" className="w-8 h-8 object-contain" />
          <span className="ml-3 text-xl font-bold text-gray-900">TekadDaya</span>
        </div>

        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${isActive ? "bg-blue-50 text-blue-700 border-blue-200" : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"}`}
                  >
                    <Icon className={`mr-3 h-5 w-5 ${isActive ? "text-blue-700" : "text-gray-400"}`} />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <User className="h-4 w-4 text-gray-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">Guest User</p>
              <p className="text-xs text-gray-500 truncate">Not logged in</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
