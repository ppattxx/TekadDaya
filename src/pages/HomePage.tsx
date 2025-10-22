import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { mockProducts } from "../services/mockData";
import type { Product } from "../types";
import HeroSection from "../components/HeroSection";
import { useScrolled } from "../hooks/useScrolled";
import { useAppStore, actions } from "../store/AppContext";

export default function HomePage() {
  const { dispatch } = useAppStore();
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortBy, setSortBy] = useState("relevant");
  const [searchQuery, setSearchQuery] = useState("");
  const isScrolled = useScrolled(150);

  const filteredProducts = mockProducts.filter((product: Product) => {
    const matchesCategory = selectedCategory === "" || product.category === selectedCategory;
    const matchesSearch = searchQuery === "" || product.name.toLowerCase().includes(searchQuery.toLowerCase()) || product.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const totalProducts = 41245;

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
            <aside className="w-full lg:w-72 xl:w-80 2xl:w-96 flex-shrink-0">
              <div className="lg:sticky lg:top-24 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200/50 p-4 sm:p-6 lg:p-8 xl:p-10">
                <h3 className="font-bold text-slate-800 mb-4 lg:mb-6 text-lg sm:text-xl xl:text-2xl">Categories</h3>

                <div className="flex flex-row lg:flex-col gap-3 lg:gap-4 xl:gap-6 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0">
                  <label className="flex items-center cursor-pointer hover:bg-slate-50 p-2 sm:p-3 lg:p-4 rounded-xl transition-all group whitespace-nowrap lg:whitespace-normal">
                    <input
                      type="radio"
                      name="category"
                      value=""
                      checked={selectedCategory === ""}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="text-amber-600 focus:ring-amber-500 focus:ring-2 w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 flex-shrink-0"
                    />
                    <span className="ml-2 sm:ml-3 lg:ml-4 xl:ml-5 text-slate-700 text-sm sm:text-base lg:text-lg xl:text-xl font-medium group-hover:text-amber-600 transition-colors">All Products</span>
                  </label>

                  <label className="flex items-center cursor-pointer hover:bg-slate-50 p-2 sm:p-3 lg:p-4 rounded-xl transition-all group whitespace-nowrap lg:whitespace-normal">
                    <input
                      type="radio"
                      name="category"
                      value="Botol Plastik"
                      checked={selectedCategory === "Botol Plastik"}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="text-amber-600 focus:ring-amber-500 focus:ring-2 w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 flex-shrink-0"
                    />
                    <span className="ml-2 sm:ml-3 lg:ml-4 xl:ml-5 text-slate-700 text-sm sm:text-base lg:text-lg xl:text-xl font-medium group-hover:text-amber-600 transition-colors">Plastic Products</span>
                  </label>
                </div>
              </div>
            </aside>

            <main className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 lg:mb-8 xl:mb-10 gap-3 sm:gap-4 lg:gap-6">
                <p className="text-slate-600 text-sm sm:text-base lg:text-lg xl:text-xl font-medium">
                  Showing 1-{Math.min(6, filteredProducts.length)} of {totalProducts.toLocaleString()} premium products
                </p>

                <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 lg:space-x-6 xl:space-x-8">
                  <span className="text-slate-600 text-sm sm:text-base lg:text-lg font-medium">Sort by</span>
                  <div className="relative w-full sm:w-auto min-w-[180px] sm:min-w-[200px] lg:min-w-[240px]">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="w-full appearance-none bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl pl-3 pr-8 sm:pl-4 sm:pr-10 lg:pl-5 lg:pr-12 py-2 sm:py-2.5 lg:py-3 xl:py-4 text-sm sm:text-base lg:text-lg focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all shadow-sm hover:shadow-md text-slate-700"
                    >
                      <option value="relevant">Most Relevant</option>
                      <option value="price_low">Price: Low to High</option>
                      <option value="price_high">Price: High to Low</option>
                      <option value="newest">Newest First</option>
                    </select>
                    <ChevronDown className="absolute right-2 sm:right-3 lg:right-4 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-slate-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 xl:gap-10">
                {filteredProducts.slice(0, 6).map((product: Product) => (
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
                              <span className="font-medium text-slate-500">Weight:</span>
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

                        <div className="flex items-center justify-between mt-auto bg-slate-50 -mx-8 -mb-8 px-8 py-4 min-h-[60px]">
                          <div className="text-xl font-bold text-amber-600 whitespace-nowrap flex-shrink-0">Rp {product.harga.toLocaleString("id-ID")}</div>
                          <button
                            onClick={(e) => handleAddToCart(e, product)}
                            className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 shadow-md hover:shadow-lg whitespace-nowrap flex-shrink-0 ml-4"
                          >
                            Buy Now
                          </button>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {filteredProducts.length === 0 && (
                <div className="text-center py-16 col-span-full">
                  <div className="w-24 h-24 bg-gradient-to-br from-slate-200 to-slate-300 rounded-2xl mx-auto mb-4"></div>
                  <p className="text-slate-500 text-lg font-medium">No products found</p>
                  <p className="text-slate-400 text-sm mt-2">Try adjusting your search or filter criteria</p>
                </div>
              )}
            </main>
          </div>
        </div>
      </div>
    </>
  );
}
