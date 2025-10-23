import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Search, ShoppingCart, User, Menu, X, Grid3X3, Package2, Heart, Bell } from "lucide-react";
import { useAppStore } from "../store/AppContext";
import { useScrolled } from "../hooks/useScrolled";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { state } = useAppStore();
  const navigate = useNavigate();
  const location = useLocation();
  const isScrolled = useScrolled(150);

  const isHomePage = location.pathname === "/" || location.pathname === "/homepage";

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  const navigationItems = [
    { name: "Kategori", href: "/categories", icon: Grid3X3 },
    { name: "Semua Produk", href: "/products", icon: Package2 },
  ];

  const isActiveLink = (href: string) => {
    if (href === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(href);
  };

  return (
    <nav className="bg-white/95 backdrop-blur-sm shadow-lg border-b border-slate-200/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 xl:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          <div className="flex items-center space-x-3 sm:space-x-8 flex-shrink-0">
            <Link to="/" className="flex items-center space-x-1.5 sm:space-x-3">
              <img
                src="/src/assets/logo.png"
                alt="BeliBotol Logo"
                className="h-6 w-6 sm:h-8 sm:w-8 object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
              <span className="text-base sm:text-xl font-bold text-gray-900 truncate">BeliBotol</span>
            </Link>

            <div className="hidden md:flex items-center space-x-1">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center space-x-2 px-3 lg:px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActiveLink(item.href) ? "text-amber-600 bg-amber-50 shadow-sm" : "text-slate-700 hover:text-amber-600 hover:bg-slate-50"
                    }`}
                  >
                    {Icon && <Icon className="h-4 w-4" />}
                    <span className="hidden lg:block">{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          <div className={`hidden sm:flex flex-1 max-w-lg mx-4 lg:mx-8 transition-all duration-300 ${isHomePage && !isScrolled ? "opacity-0 scale-95 pointer-events-none" : "opacity-100 scale-100"}`}>
            <form onSubmit={handleSearch} className="w-full">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-amber-400/20 to-amber-600/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity blur-sm"></div>
                <div className="relative">
                  <Search className="absolute left-3 lg:left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4 lg:h-5 lg:w-5" />
                  <input
                    type="text"
                    placeholder="Cari produk..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 lg:pl-12 pr-3 lg:pr-4 py-2 lg:py-3 border border-slate-200 rounded-full focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md text-slate-700 placeholder-slate-400 text-sm lg:text-base"
                  />
                </div>
              </div>
            </form>
          </div>

          <div className="flex items-center space-x-1 sm:space-x-2 lg:space-x-3 flex-shrink-0">
            {state.isAuthenticated && (
              <Link to="/wishlist" className="p-1.5 sm:p-2.5 text-slate-600 hover:text-red-500 transition-colors relative group">
                <Heart className="h-4 w-4 sm:h-5 sm:w-5" />
                <div className="absolute inset-0 bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity -z-10"></div>
              </Link>
            )}

            {state.isAuthenticated && (
              <button className="p-1.5 sm:p-2.5 text-slate-600 hover:text-slate-700 transition-colors relative group">
                <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="absolute top-0.5 sm:top-1 right-0.5 sm:right-1 h-1.5 w-1.5 sm:h-2 sm:w-2 bg-red-500 rounded-full"></span>
                <div className="absolute inset-0 bg-slate-50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity -z-10"></div>
              </button>
            )}

            <Link to="/cart" className="p-1.5 sm:p-2.5 text-slate-600 hover:text-slate-700 transition-colors relative group">
              <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5" />
              {state.cart.itemCount > 0 && (
                <span className="absolute -top-0.5 sm:-top-1 -right-0.5 sm:-right-1 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-[10px] sm:text-xs rounded-full h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center font-medium shadow-lg">
                  {state.cart.itemCount > 99 ? "99+" : state.cart.itemCount}
                </span>
              )}
              <div className="absolute inset-0 bg-slate-50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity -z-10"></div>
            </Link>

            <div className="relative">
              {state.isAuthenticated ? (
                <Link to="/profile" className="flex items-center space-x-1 sm:space-x-2 p-1.5 sm:p-2.5 text-slate-600 hover:text-slate-700 transition-colors group">
                  <User className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span className="hidden lg:block text-sm font-medium">{state.user?.name || "Profile"}</span>
                  <div className="absolute inset-0 bg-slate-50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity -z-10"></div>
                </Link>
              ) : (
                <div className="flex items-center space-x-1 sm:space-x-2 lg:space-x-3">
                  <Link to="/login" className="text-slate-600 hover:text-slate-700 text-xs sm:text-sm font-medium transition-colors px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg hover:bg-slate-50">
                    Masuk
                  </Link>
                  <Link
                    to="/register"
                    className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white px-3 sm:px-4 lg:px-6 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    <span className="hidden sm:block">Daftar</span>
                    <span className="sm:hidden">Daftar</span>
                  </Link>
                </div>
              )}
            </div>

            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden p-1.5 sm:p-2 text-gray-600 hover:text-gray-900 transition-colors ml-1">
              {isMobileMenuOpen ? <X className="h-4 w-4 sm:h-5 sm:w-5" /> : <Menu className="h-4 w-4 sm:h-5 sm:w-5" />}
            </button>
          </div>
        </div>

        <div className={`sm:hidden px-2 pb-3 transition-all duration-300 ${isHomePage && !isScrolled ? "opacity-0 scale-95 pointer-events-none" : "opacity-100 scale-100"}`}>
          <form onSubmit={handleSearch}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Cari produk..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-full focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none bg-white/80 backdrop-blur-sm shadow-sm text-slate-700 placeholder-slate-400 text-sm"
              />
            </div>
          </form>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white/95 backdrop-blur-sm border-t border-slate-200/50">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-base font-medium transition-all ${
                    isActiveLink(item.href) ? "text-amber-600 bg-amber-50 shadow-sm" : "text-slate-700 hover:text-amber-600 hover:bg-slate-50"
                  }`}
                >
                  {Icon && <Icon className="h-5 w-5" />}
                  <span>{item.name}</span>
                </Link>
              );
            })}

            {!state.isAuthenticated && (
              <div className="pt-4 mt-4 border-t border-slate-200/50 space-y-2">
                <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="block px-4 py-3 rounded-lg text-base font-medium text-slate-700 hover:text-slate-800 hover:bg-slate-50 transition-all">
                  Masuk
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-4 py-3 rounded-lg text-base font-medium text-white bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 transition-all shadow-lg"
                >
                  Daftar
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
