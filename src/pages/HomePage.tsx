import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { productAPI } from "../services/api";
import type { Product } from "../types";
import HeroSection from "../components/HeroSection";
import { useScrolled } from "../hooks/useScrolled";
import { useAppStore, actions } from "../store/AppContext";

export default function HomePage() {
  const { dispatch } = useAppStore();
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortBy, setSortBy] = useState("relevant");
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalProducts, setTotalProducts] = useState(0);
  const isScrolled = useScrolled(150);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await productAPI.getAll({
          limit: 6,
          category: selectedCategory || undefined,
          search: searchQuery || undefined,
        });

        if (response.status === "success") {
          const productsData = Array.isArray(response.data) ? response.data : (response.data as any).products || [];
          setProducts(productsData);
          setTotalProducts((response as any).pagination?.total || productsData.length);
        } else {
          setProducts([]);
          setTotalProducts(0);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts([]);
        setTotalProducts(0);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory, searchQuery]);

  const filteredProducts = products;

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(actions.addToCart(product, 1));
  };

  return (
    <>
      <HeroSection searchQuery={searchQuery} setSearchQuery={setSearchQuery} isScrolled={isScrolled} />

      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-8 sm:py-12">
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 xl:gap-12">
            <aside className="w-full lg:w-60 xl:w-64 flex-shrink-0">
              <div className="lg:sticky lg:top-24 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-slate-200/50 p-2 sm:p-3 lg:p-4">
                <h3 className="font-bold text-slate-800 mb-2 lg:mb-3 text-sm sm:text-base">Kategori</h3>

                <div className="flex flex-row lg:flex-col gap-1.5 lg:gap-2 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0">
                  <label className="flex items-center cursor-pointer hover:bg-slate-50 p-1.5 sm:p-2 rounded-md transition-all group whitespace-nowrap lg:whitespace-normal">
                    <input
                      type="radio"
                      name="category"
                      value=""
                      checked={selectedCategory === ""}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="text-amber-600 focus:ring-amber-500 focus:ring-2 w-3 h-3 sm:w-3.5 sm:h-3.5 flex-shrink-0"
                    />
                    <span className="ml-1.5 sm:ml-2 text-slate-700 text-xs sm:text-sm font-medium group-hover:text-amber-600 transition-colors">Semua Produk</span>
                  </label>

                  <label className="flex items-center cursor-pointer hover:bg-slate-50 p-1.5 sm:p-2 rounded-md transition-all group whitespace-nowrap lg:whitespace-normal">
                    <input
                      type="radio"
                      name="category"
                      value="Botol Plastik"
                      checked={selectedCategory === "Botol Plastik"}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="text-amber-600 focus:ring-amber-500 focus:ring-2 w-3 h-3 sm:w-3.5 sm:h-3.5 flex-shrink-0"
                    />
                    <span className="ml-1.5 sm:ml-2 text-slate-700 text-xs sm:text-sm font-medium group-hover:text-amber-600 transition-colors">Produk Plastik</span>
                  </label>
                </div>
              </div>
            </aside>

            <main className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 lg:mb-8 xl:mb-10 gap-3 sm:gap-4 lg:gap-6">
                <p className="text-slate-600 text-sm sm:text-base lg:text-lg xl:text-xl font-medium">
                  Menampilkan 1-{Math.min(6, filteredProducts.length)} of {totalProducts.toLocaleString()} premium produk
                </p>

                <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 lg:space-x-6 xl:space-x-8">
                  <span className="text-slate-600 text-sm sm:text-base lg:text-lg font-medium">Urutkan</span>
                  <div className="relative w-full sm:w-auto min-w-[180px] sm:min-w-[200px] lg:min-w-[240px]">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="w-full appearance-none bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl pl-3 pr-8 sm:pl-4 sm:pr-10 lg:pl-5 lg:pr-12 py-2 sm:py-2.5 lg:py-3 xl:py-4 text-sm sm:text-base lg:text-lg focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all shadow-sm hover:shadow-md text-slate-700"
                    >
                      <option value="relevant">Paling relevan</option>
                      <option value="price_low">Harga: rendah ke tinggi</option>
                      <option value="price_high">Harga: tinggi ke rendah</option>
                      <option value="newest">Terbaru</option>
                    </select>
                    <ChevronDown className="absolute right-2 sm:right-3 lg:right-4 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-slate-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 xl:gap-10">
                {loading
                  ? Array.from({ length: 6 }).map((_, index) => (
                      <div key={index} className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200/50 overflow-hidden animate-pulse">
                        <div className="aspect-square bg-gradient-to-br from-slate-100 to-slate-200"></div>
                        <div className="p-8 space-y-3">
                          <div className="h-6 bg-slate-200 rounded"></div>
                          <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                          <div className="h-8 bg-slate-200 rounded w-1/2"></div>
                        </div>
                      </div>
                    ))
                  : filteredProducts.map((product: Product) => (
                      <Link key={product.id} to={`/products/${product.id}`} className="block">
                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200/50 overflow-hidden hover:shadow-xl transition-all duration-300 group hover:scale-105 h-full flex flex-col cursor-pointer">
                          <div className="aspect-square bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center relative overflow-hidden">
                            <div className="text-center p-8">
                              <div className="w-24 h-24 sm:w-28 sm:h-28 bg-gradient-to-br from-slate-300 to-slate-400 rounded-2xl mx-auto mb-4 group-hover:from-amber-400 group-hover:to-amber-500 transition-all duration-300 shadow-lg"></div>
                              <span className="text-slate-500 text-base font-medium">Premium Product</span>
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                          </div>

                          <div className="p-8 flex flex-col flex-grow">
                            <h3 className="font-bold text-slate-800 mb-6 line-clamp-2 text-xl leading-tight group-hover:text-amber-600 transition-colors">{product.name}</h3>

                            <div className="space-y-3 text-base text-slate-600 mb-8 flex-grow">
                              {product.volume && (
                                <p className="flex items-center justify-between">
                                  <span className="font-medium text-slate-500">Volume:</span>
                                  <span className="font-semibold">{product.volume}</span>
                                </p>
                              )}
                              {product.berat && (
                                <p className="flex items-center justify-between">
                                  <span className="font-medium text-slate-500">Berat:</span>
                                  <span className="font-semibold">{product.berat}</span>
                                </p>
                              )}
                              {product.isiPerPolybag && (
                                <p className="flex items-center justify-between">
                                  <span className="font-medium text-slate-500">Per bag:</span>
                                  <span className="font-semibold">{product.isiPerPolybag}</span>
                                </p>
                              )}
                            </div>

                            <div className="flex items-center justify-between mt-auto bg-slate-50 -mx-8 -mb-8 px-4 lg:px-6 xl:px-8 py-3 lg:py-4 min-h-[60px] gap-2 lg:gap-4">
                              <div className="text-lg lg:text-xl font-bold text-amber-600 flex-shrink-0">Rp {(product.harga || 0).toLocaleString("id-ID")}</div>
                              <button
                                onClick={(e) => handleAddToCart(e, product)}
                                className="bg-amber-500 hover:bg-amber-600 text-white px-3 lg:px-4 xl:px-6 py-2 lg:py-2.5 rounded-lg text-xs lg:text-sm font-semibold transition-all duration-200 shadow-md hover:shadow-lg flex-shrink-0"
                              >
                                Tambah +
                              </button>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
              </div>

              {filteredProducts.length === 0 && !loading && (
                <div className="text-center py-16 col-span-full">
                  <div className="w-24 h-24 bg-gradient-to-br from-slate-200 to-slate-300 rounded-2xl mx-auto mb-4"></div>
                  <p className="text-slate-500 text-lg font-medium">Tidak ada produk ditemukan</p>
                  <p className="text-slate-400 text-sm mt-2">Coba sesuaikan pencarian atau filter Anda</p>
                </div>
              )}
            </main>
          </div>
        </div>
      </div>
    </>
  );
}
