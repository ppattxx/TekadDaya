import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, MapPin, Phone, Mail, Package2, Heart, Settings, LogOut, Edit3, Camera, Shield, CreditCard, Bell, ArrowRight } from "lucide-react";
import { useAppStore, actions } from "../store/AppContext";
import { authAPI, orderAPI } from "../services/api";

export default function ProfilePage() {
  const { state, dispatch } = useAppStore();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    if (!(state as any).isInitialized) {
      return;
    }

    if (!state.isAuthenticated) {
      navigate("/login");
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);

        try {
          const profileResponse = await authAPI.getProfile();

          if (profileResponse.status === "success" && profileResponse.data) {
            setProfile(profileResponse.data);
            dispatch(actions.setUser(profileResponse.data));
          }
        } catch (profileError: any) {
          if (profileError.response?.status === 401) {
            dispatch(actions.setUser(null));
            localStorage.removeItem("auth_token");
            localStorage.removeItem("user");
            navigate("/login");
            return;
          }

          setProfile(state.user);
        }

        try {
          const ordersResponse = await orderAPI.getOrders({ limit: 3 });

          if (ordersResponse.status === "success" && ordersResponse.data) {
            const ordersData = Array.isArray(ordersResponse.data) ? ordersResponse.data : (ordersResponse.data as any).orders || (ordersResponse.data as any).products || [];
            setOrders(ordersData.slice(0, 3));
          }
        } catch (orderError) {
          setOrders([]);
        }
      } catch (error) {
        console.error("Error loading profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [state.isAuthenticated, navigate, dispatch]);

  const handleLogout = () => {
    dispatch(actions.setUser(null));
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const userData = {
    name: profile?.username || profile?.name || (state.user as any)?.name || (state.user as any)?.username || "User",
    email: profile?.email || state.user?.email || "",
    phone: profile?.phone || (state.user as any)?.phone || "",
    avatar: profile?.avatar || state.user?.avatar || null,
    address: profile?.address || (state.user as any)?.address || "",
    joinDate: profile?.date_joined || profile?.created_at ? `Bergabung sejak ${new Date(profile.date_joined || profile.created_at).toLocaleDateString("id-ID", { year: "numeric", month: "long" })}` : "",
    totalOrders: orders.length,
    totalSpent: orders.reduce((sum: number, order: any) => sum + (order.total || order.total_amount || 0), 0),
    membershipLevel: profile?.membership_level || profile?.level || "",
  };

  const recentOrders = orders.map((order: any) => ({
    id: order.id || order.order_number || order.order_id || "",
    date: order.created_at || order.date || order.order_date || "",
    status: order.status || "",
    total: order.total || order.total_amount || 0,
    items: order.items?.length || order.item_count || 0,
  }));

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white pt-16 sm:pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Memuat profil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white pt-16 sm:pt-20">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200/50 p-4 sm:p-6 mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
            <div className="relative mx-auto sm:mx-0">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-slate-200 rounded-full overflow-hidden">
                {userData.avatar ? (
                  <img src={userData.avatar} alt={userData.name} className="w-full h-full object-cover" />
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
              <h1 className="text-2xl font-bold text-gray-900">{userData.name}</h1>
              {userData.email && (
                <p className="text-gray-600 flex items-center mt-1">
                  <Mail className="h-4 w-4 mr-2" />
                  {userData.email}
                </p>
              )}
              {userData.phone && (
                <p className="text-gray-600 flex items-center mt-1">
                  <Phone className="h-4 w-4 mr-2" />
                  {userData.phone}
                </p>
              )}
              {userData.joinDate && <p className="text-sm text-gray-500 mt-2">{userData.joinDate}</p>}
              {userData.membershipLevel && (
                <div className="flex items-center mt-2">
                  <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded-full">{userData.membershipLevel}</span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-gray-900">{userData.totalOrders}</p>
                <p className="text-sm text-gray-600">Pesanan</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{userData.totalSpent > 0 ? `Rp${userData.totalSpent.toLocaleString("id-ID")}` : "Rp0"}</p>
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

                  {recentOrders.length > 0 ? (
                    <div className="space-y-4">
                      {recentOrders.map((order) => (
                        <div key={order.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-gray-900">#{order.id}</p>
                              {order.date && (
                                <p className="text-sm text-gray-600">
                                  {new Date(order.date).toLocaleDateString("id-ID", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                  })}
                                </p>
                              )}
                              <p className="text-sm text-gray-600">{order.items} item(s)</p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-gray-900">Rp{order.total.toLocaleString("id-ID")}</p>
                              {order.status && <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>{getStatusText(order.status)}</span>}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Package2 className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                      <p className="text-gray-500">Belum ada pesanan</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === "orders" && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Riwayat Pesanan</h2>
                {recentOrders.length > 0 ? (
                  <div className="space-y-4">
                    {recentOrders.map((order) => (
                      <div key={order.id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-900">#{order.id}</p>
                            {order.date && (
                              <p className="text-sm text-gray-600">
                                {new Date(order.date).toLocaleDateString("id-ID", {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                })}
                              </p>
                            )}
                            <p className="text-sm text-gray-600">{order.items} item(s)</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-gray-900">Rp{order.total.toLocaleString("id-ID")}</p>
                            {order.status && <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>{getStatusText(order.status)}</span>}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Package2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Belum ada riwayat pesanan</p>
                    <Link to="/products" className="inline-flex items-center mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      Mulai Berbelanja
                    </Link>
                  </div>
                )}
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
