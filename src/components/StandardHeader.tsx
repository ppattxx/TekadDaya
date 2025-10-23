import { Link } from "react-router-dom";
import { ShoppingCart, Search } from "lucide-react";
import { useAppStore } from "../store/AppContext";
import { useState } from "react";

export default function StandardHeader() {
  const { state } = useAppStore();
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 fixed top-0 left-0 right-0 z-50">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="flex items-center gap-4 h-16 lg:h-18 xl:h-20">
          <Link to="/" className="flex items-center space-x-2 lg:space-x-3 xl:space-x-4 flex-shrink-0">
            <img src="/src/assets/logo.png" alt="BeliBotol Logo" className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 xl:w-14 xl:h-14 object-contain" />
            <span className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold text-gray-900 hidden sm:block">BeliBotol</span>
            <span className="text-sm font-bold text-gray-900 sm:hidden">TD</span>
          </Link>

          <div className="flex-1 max-w-2xl mx-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 sm:h-5 sm:w-5" />
              <input
                type="text"
                placeholder="Cari produk..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 sm:py-2.5 text-sm sm:text-base border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
            <Link to="/cart" className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors">
              <ShoppingCart className="h-5 w-5 sm:h-6 sm:w-6" />
              {state.cart.itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center font-medium">{state.cart.itemCount > 99 ? "99+" : state.cart.itemCount}</span>
              )}
            </Link>

            <Link to="/login" className="px-3 py-2 sm:px-4 text-sm sm:text-base text-gray-600 hover:text-gray-900 font-medium transition-colors">
              Masuk
            </Link>

            <Link to="/register" className="px-3 py-2 sm:px-4 bg-blue-600 text-white text-sm sm:text-base rounded-lg hover:bg-blue-700 font-medium transition-colors">
              Daftar
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
