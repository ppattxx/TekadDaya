import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Grid3X3, ArrowRight } from "lucide-react";
import { categoryAPI } from "../services/api";

interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  productCount?: number;
}

export default function CategoryListPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await categoryAPI.getAll();

        if (response.status === "success") {
          const categoriesData = Array.isArray(response.data) ? response.data : (response.data as any).categories || [];

          const extendedCategories = categoriesData.map((cat: any, index: number) => ({
            id: cat.id || index + 1,
            name: cat.name,
            slug: cat.slug || cat.name,
            description: cat.description || getDescriptionForCategory(cat.name),
            image: cat.image,
            productCount: cat.product_count || cat.productCount || 0,
          }));

          setCategories(extendedCategories);
        } else {
          setCategories([]);
        }
      } catch (error) {
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const getDescriptionForCategory = (name: string): string => {
    const descriptions: { [key: string]: string } = {
      "Semua Barang": "Jelajahi seluruh koleksi produk kami",
      "Botol Plastik": "Berbagai jenis botol plastik berkualitas tinggi untuk berbagai kebutuhan",
      "Botol Kaca": "Botol kaca premium yang ramah lingkungan dan tahan lama",
      "Tutup & Aksesoris": "Tutup botol dan aksesoris pelengkap berkualitas",
    };
    return descriptions[name] || `Produk ${name} berkualitas tinggi`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-64 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-96 mb-8"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="h-48 bg-gray-200"></div>
                  <div className="p-4">
                    <div className="h-6 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div className="mb-6">
        <div className="flex items-center space-x-2 text-sm text-slate-600 mb-3">
          <Link to="/" className="hover:text-amber-600 transition-colors">
            Beranda
          </Link>
          <ArrowRight className="h-4 w-4" />
          <span className="text-slate-900 font-medium">Kategori</span>
        </div>

        <div className="flex items-center space-x-3 mb-3">
          <Grid3X3 className="h-8 w-8 text-amber-600" />
          <h1 className="text-3xl font-bold text-slate-900">Kategori Produk</h1>
        </div>

        <p className="text-slate-600 text-lg">Temukan produk yang Anda butuhkan berdasarkan kategori</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
        {categories.length > 0 ? (
          categories.map((category) => (
            <Link key={category.id} to={`/products?category=${encodeURIComponent(category.slug)}`} className="group">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200/50 overflow-hidden hover:shadow-xl transition-all duration-300 transform group-hover:-translate-y-1 flex flex-col h-full min-h-[320px]">
                <div className="relative h-40 bg-gradient-to-br from-slate-100 to-slate-200 overflow-hidden flex-shrink-0">
                  {category.image ? (
                    <img src={category.image} alt={category.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-center p-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-slate-300 to-slate-400 rounded-xl mx-auto mb-2 group-hover:from-amber-400 group-hover:to-amber-500 transition-all duration-300 shadow-lg"></div>
                        <span className="text-slate-500 text-xs font-medium">Category</span>
                      </div>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-200"></div>
                </div>

                <div className="p-4 flex flex-col flex-grow justify-between">
                  <div>
                    <h3 className="text-base font-semibold text-slate-900 mb-2 group-hover:text-amber-600 transition-colors line-clamp-1">{category.name}</h3>
                    <p className="text-slate-600 text-sm mb-3 line-clamp-3">{category.description}</p>
                  </div>

                  <div className="flex items-center justify-between mt-auto pt-2">
                    {(category.productCount || 0) > 0 && <span className="text-xs text-slate-500">{category.productCount} produk</span>}
                    <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-amber-600 group-hover:translate-x-1 transition-all duration-200" />
                  </div>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <Grid3X3 className="h-16 w-16 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 text-lg font-medium">Belum ada kategori tersedia</p>
            <p className="text-slate-400 text-sm mt-2">Silakan cek kembali nanti</p>
          </div>
        )}
      </div>

      <div className="mt-12 text-center">
        <div className="bg-gradient-to-r from-slate-800 to-slate-700 rounded-2xl p-8 text-white shadow-2xl border border-slate-200/20">
          <h2 className="text-2xl font-bold mb-4">Tidak menemukan yang dicari?</h2>
          <p className="text-slate-300 mb-6">Jelajahi semua produk kami atau hubungi tim customer service untuk bantuan</p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-4">
            <Link to="/products" className="bg-amber-500 hover:bg-amber-600 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl">
              Lihat Semua Produk
            </Link>
            <Link to="/contact" className="border border-slate-300 text-slate-300 hover:bg-white hover:text-slate-800 px-8 py-3 rounded-xl font-semibold transition-all duration-200">
              Hubungi Kami
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
