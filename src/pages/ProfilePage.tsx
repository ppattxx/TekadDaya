import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, MapPin, Phone, Mail, Package2, Heart, Settings, LogOut, Edit3, Camera, Shield, CreditCard, Bell, ArrowRight } from "lucide-react";
import { useAppStore, actions } from "../store/AppContext";

export default function ProfilePage() {
  const { state, dispatch } = useAppStore();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    if (!state.isAuthenticated) {
      navigate("/login");
    }
  }, [state.isAuthenticated, navigate]);

  const handleLogout = () => {
    dispatch(actions.setUser(null));
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const mockUserData = {
    name: state.user?.name || "John Doe",
    email: state.user?.email || "john.doe@example.com",
    phone: "+62 812-3456-7890",
    avatar: state.user?.avatar || null,
    address: "Jl. Sudirman No. 123, Jakarta Pusat, DKI Jakarta 10270",
    joinDate: "Bergabung sejak Januari 2024",
    totalOrders: 12,
    totalSpent: 2450000,
    membershipLevel: "Gold Member",
  };

  const recentOrders = [
    {
      id: "ORD-001",
      date: "2024-10-15",
      status: "delivered",
      total: 185000,
      items: 3,
    },
    {
      id: "ORD-002",
      date: "2024-10-10",
      status: "shipped",
      total: 95000,
      items: 1,
    },
    {
      id: "ORD-003",
      date: "2024-10-05",
      status: "processing",
      total: 245000,
      items: 5,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "text-green-600 bg-green-100";
      case "shipped":
        return "text-blue-600 bg-blue-100";
      case "processing":
        return "text-yellow-600 bg-yellow-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "delivered":
        return "Terkirim";
      case "shipped":
        return "Dikirim";
      case "processing":
        return "Diproses";
      default:
        return "Unknown";
    }
  };

  if (!state.isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white pt-16 sm:pt-20">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200/50 p-4 sm:p-6 mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
            <div className="relative mx-auto sm:mx-0">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-slate-200 rounded-full overflow-hidden">
                {mockUserData.avatar ? (
                  <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-slate-300 to-slate-400 rounded-full"></div>
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-amber-100">
                    <User className="h-8 w-8 sm:h-12 sm:w-12 text-amber-600" />
                  </div>
                )}
              </div>
              <button className="absolute bottom-0 right-0 bg-amber-600 text-white p-1.5 sm:p-2 rounded-full hover:bg-amber-700 transition-colors">
                <Camera className="h-3 w-3 sm:h-4 sm:w-4" />
              </button>
            </div>

            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900">{mockUserData.name}</h1>
              <p className="text-gray-600 flex items-center mt-1">
                <Mail className="h-4 w-4 mr-2" />
                {mockUserData.email}
              </p>
              <p className="text-gray-600 flex items-center mt-1">
                <Phone className="h-4 w-4 mr-2" />
                {mockUserData.phone}
              </p>
              <p className="text-sm text-gray-500 mt-2">{mockUserData.joinDate}</p>
              <div className="flex items-center mt-2">
                <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded-full">{mockUserData.membershipLevel}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-gray-900">{mockUserData.totalOrders}</p>
                <p className="text-sm text-gray-600">Pesanan</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">Rp{mockUserData.totalSpent.toLocaleString("id-ID")}</p>
                <p className="text-sm text-gray-600">Total Belanja</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab("overview")}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${activeTab === "overview" ? "bg-blue-50 text-blue-600" : "text-gray-700 hover:bg-gray-50"}`}
                >
                  <User className="h-5 w-5" />
                  <span>Ringkasan</span>
                </button>

                <button
                  onClick={() => setActiveTab("orders")}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${activeTab === "orders" ? "bg-blue-50 text-blue-600" : "text-gray-700 hover:bg-gray-50"}`}
                >
                  <Package2 className="h-5 w-5" />
                  <span>Pesanan Saya</span>
                </button>

                <button
                  onClick={() => setActiveTab("wishlist")}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${activeTab === "wishlist" ? "bg-blue-50 text-blue-600" : "text-gray-700 hover:bg-gray-50"}`}
                >
                  <Heart className="h-5 w-5" />
                  <span>Wishlist</span>
                </button>

                <button
                  onClick={() => setActiveTab("settings")}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${activeTab === "settings" ? "bg-blue-50 text-blue-600" : "text-gray-700 hover:bg-gray-50"}`}
                >
                  <Settings className="h-5 w-5" />
                  <span>Pengaturan</span>
                </button>

                <button onClick={handleLogout} className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left text-red-600 hover:bg-red-50 transition-colors">
                  <LogOut className="h-5 w-5" />
                  <span>Keluar</span>
                </button>
              </nav>
            </div>
          </div>

          <div className="lg:col-span-3">
            {activeTab === "overview" && (
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Aksi Cepat</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Link to="/orders" className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors">
                      <Package2 className="h-6 w-6 text-blue-600" />
                      <span className="font-medium text-gray-900">Lacak Pesanan</span>
                    </Link>

                    <Link to="/wishlist" className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors">
                      <Heart className="h-6 w-6 text-red-500" />
                      <span className="font-medium text-gray-900">Wishlist</span>
                    </Link>

                    <Link to="/addresses" className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors">
                      <MapPin className="h-6 w-6 text-green-600" />
                      <span className="font-medium text-gray-900">Alamat</span>
                    </Link>

                    <Link to="/payment-methods" className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors">
                      <CreditCard className="h-6 w-6 text-purple-600" />
                      <span className="font-medium text-gray-900">Pembayaran</span>
                    </Link>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-900">Pesanan Terbaru</h2>
                    <Link to="/orders" className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center">
                      Lihat Semua
                      <ArrowRight className="h-4 w-4 ml-1" />
                    </Link>
                  </div>

                  <div className="space-y-4">
                    {recentOrders.map((order) => (
                      <div key={order.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-900">#{order.id}</p>
                            <p className="text-sm text-gray-600">{order.date}</p>
                            <p className="text-sm text-gray-600">{order.items} item(s)</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-gray-900">Rp{order.total.toLocaleString("id-ID")}</p>
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>{getStatusText(order.status)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "orders" && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Riwayat Pesanan</h2>
                <div className="text-center py-12">
                  <Package2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Fitur riwayat pesanan sedang dalam pengembangan</p>
                </div>
              </div>
            )}

            {activeTab === "wishlist" && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Wishlist Saya</h2>
                <div className="text-center py-12">
                  <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Wishlist Anda masih kosong</p>
                  <Link to="/products" className="inline-flex items-center mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    Jelajahi Produk
                  </Link>
                </div>
              </div>
            )}

            {activeTab === "settings" && (
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-6">Pengaturan Akun</h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between py-3 border-b border-gray-200">
                      <div className="flex items-center space-x-3">
                        <Edit3 className="h-5 w-5 text-gray-400" />
                        <span className="text-gray-900">Edit Profil</span>
                      </div>
                      <ArrowRight className="h-4 w-4 text-gray-400" />
                    </div>

                    <div className="flex items-center justify-between py-3 border-b border-gray-200">
                      <div className="flex items-center space-x-3">
                        <Shield className="h-5 w-5 text-gray-400" />
                        <span className="text-gray-900">Keamanan</span>
                      </div>
                      <ArrowRight className="h-4 w-4 text-gray-400" />
                    </div>

                    <div className="flex items-center justify-between py-3 border-b border-gray-200">
                      <div className="flex items-center space-x-3">
                        <Bell className="h-5 w-5 text-gray-400" />
                        <span className="text-gray-900">Notifikasi</span>
                      </div>
                      <ArrowRight className="h-4 w-4 text-gray-400" />
                    </div>

                    <div className="flex items-center justify-between py-3">
                      <div className="flex items-center space-x-3">
                        <MapPin className="h-5 w-5 text-gray-400" />
                        <span className="text-gray-900">Alamat Pengiriman</span>
                      </div>
                      <ArrowRight className="h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
