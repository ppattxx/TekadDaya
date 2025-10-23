import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Filter, Grid, List } from "lucide-react";
import { mockProducts, mockCategories } from "../services/mockData";
import ProductCard from "../components/ProductCard";

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);

  const page = parseInt(searchParams.get("page") || "1");
  const category = searchParams.get("category") || "";
  const search = searchParams.get("search") || "";
  const sortBy = searchParams.get("sort") || "name";

  const filteredProducts = useMemo(() => {
    let filtered = mockProducts;

    if (category) {
      filtered = filtered.filter((product) => product.category.toLowerCase() === category.toLowerCase());
    }

    if (search) {
      filtered = filtered.filter((product) => product.name.toLowerCase().includes(search.toLowerCase()) || product.description.toLowerCase().includes(search.toLowerCase()));
    }

    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "price":
          return a.harga - b.harga;
        case "name":
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

    return filtered;
  }, [category, search, sortBy]);

  const productsData = {
    products: filteredProducts.slice((page - 1) * 12, page * 12),
    total: filteredProducts.length,
    totalPages: Math.ceil(filteredProducts.length / 12),
  };

  const productsLoading = false;
  const categoriesData = { categories: mockCategories };

  const updateFilters = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    if (key !== "page") {
      newParams.set("page", "1");
    }
    setSearchParams(newParams);
  };

  const handlePageChange = (newPage: number) => {
    updateFilters("page", newPage.toString());
  };

  const clearFilters = () => {
    setSearchParams({});
  };

  return (
    <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-6 sm:py-8 lg:py-10 xl:py-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 lg:mb-8 xl:mb-10 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-slate-900 mb-2 lg:mb-3 xl:mb-4">Produk</h1>
          {search && (
            <p className="text-slate-600 text-sm sm:text-base">
              Hasil pencarian untuk "<span className="font-semibold">{search}</span>"
            </p>
          )}
          {category && (
            <p className="text-slate-600 text-sm sm:text-base">
              Kategori: <span className="font-semibold capitalize">{category}</span>
            </p>
          )}
        </div>

        <div className="flex items-center space-x-3 sm:space-x-4 w-full sm:w-auto justify-between sm:justify-end">
          <div className="flex items-center bg-slate-100 rounded-lg p-1">
            <button onClick={() => setViewMode("grid")} className={`p-2 rounded-md transition-colors ${viewMode === "grid" ? "bg-white text-amber-600 shadow-sm" : "text-slate-600 hover:text-slate-900"}`}>
              <Grid className="h-4 w-4" />
            </button>
            <button onClick={() => setViewMode("list")} className={`p-2 rounded-md transition-colors ${viewMode === "list" ? "bg-white text-amber-600 shadow-sm" : "text-slate-600 hover:text-slate-900"}`}>
              <List className="h-4 w-4" />
            </button>
          </div>

          <button onClick={() => setShowFilters(!showFilters)} className="lg:hidden flex items-center space-x-2 px-3 sm:px-4 py-2 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors text-sm">
            <Filter className="h-4 w-4" />
            <span>Filter</span>
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8">
        <aside className={`lg:w-64 xl:w-72 ${showFilters ? "block" : "hidden lg:block"}`}>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200/50 p-4 sm:p-6 lg:sticky lg:top-24">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-gray-900">Filter</h2>
              {(category || search || sortBy !== "name") && (
                <button onClick={clearFilters} className="text-sm text-blue-600 hover:text-blue-700">
                  Hapus Semua
                </button>
              )}
            </div>

            <div className="mb-6">
              <h3 className="font-medium text-gray-900 mb-3 text-sm">Kategori</h3>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input type="radio" name="category" value="" checked={!category} onChange={(e) => updateFilters("category", e.target.value)} className="text-blue-600 focus:ring-blue-500" />
                  <span className="ml-2 text-sm text-gray-700">Semua Kategori</span>
                </label>
                {categoriesData.categories.map((cat: any) => (
                  <label key={cat.id} className="flex items-center">
                    <input type="radio" name="category" value={cat.slug} checked={category === cat.slug} onChange={(e) => updateFilters("category", e.target.value)} className="text-blue-600 focus:ring-blue-500" />
                    <span className="ml-2 text-sm text-gray-700 capitalize">{cat.name}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-medium text-gray-900 mb-3 text-sm">Urutkan</h3>
              <select value={sortBy} onChange={(e) => updateFilters("sort", e.target.value)} className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm">
                <option value="name">Nama (A-Z)</option>
                <option value="name_desc">Nama (Z-A)</option>
                <option value="price">Harga (Rendah ke Tinggi)</option>
                <option value="price_desc">Harga (Tinggi ke Rendah)</option>
                <option value="rating">Rating</option>
                <option value="newest">Terbaru</option>
              </select>
            </div>
          </div>
        </aside>

        <main className="flex-1">
          {productsLoading ? (
            <div className={`grid gap-4 sm:gap-6 lg:gap-8 ${viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1"}`}>
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200/50">
                  <div className="bg-gradient-to-br from-slate-100 to-slate-200 h-48 rounded-t-2xl animate-pulse" />
                  <div className="p-4 sm:p-6 space-y-3">
                    <div className="bg-slate-200 h-4 rounded animate-pulse" />
                    <div className="bg-slate-200 h-4 rounded animate-pulse w-3/4" />
                    <div className="bg-slate-200 h-6 rounded animate-pulse w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : productsData.products.length === 0 ? (
            <div className="text-center py-12 lg:py-16">
              <div className="text-slate-400 mb-4">
                <Grid className="h-12 w-12 sm:h-16 sm:w-16 mx-auto" />
              </div>
              <h3 className="text-lg sm:text-xl font-medium text-slate-900 mb-2">No products found</h3>
              <p className="text-slate-600 mb-4 text-sm sm:text-base">Try adjusting your search or filter criteria</p>
              <button onClick={clearFilters} className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white px-6 py-3 rounded-lg font-medium transition-all shadow-lg hover:shadow-xl">
                Clear Filters
              </button>
            </div>
          ) : (
            <>
              <div className={`grid gap-4 sm:gap-6 lg:gap-8 ${viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1"}`}>
                {productsData.products.map((product: any) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {productsData.totalPages > 1 && (
                <div className="flex justify-center items-center space-x-2 mt-8">
                  <button onClick={() => handlePageChange(page - 1)} disabled={page <= 1} className="px-3 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                    Previous
                  </button>

                  <div className="flex items-center space-x-1">
                    {Array.from({ length: Math.min(5, productsData.totalPages) }, (_, i) => {
                      const pageNum = i + 1;
                      return (
                        <button key={pageNum} onClick={() => handlePageChange(pageNum)} className={`px-3 py-2 rounded-lg ${page === pageNum ? "bg-blue-600 text-white" : "border border-gray-300 text-gray-700 hover:bg-gray-50"}`}>
                          {pageNum}
                        </button>
                      );
                    })}

                    {productsData.totalPages > 5 && (
                      <>
                        <span className="px-2 text-gray-500">...</span>
                        <button
                          onClick={() => handlePageChange(productsData.totalPages)}
                          className={`px-3 py-2 rounded-lg ${page === productsData.totalPages ? "bg-blue-600 text-white" : "border border-gray-300 text-gray-700 hover:bg-gray-50"}`}
                        >
                          {productsData.totalPages}
                        </button>
                      </>
                    )}
                  </div>

                  <button
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page >= productsData.totalPages}
                    className="px-3 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
