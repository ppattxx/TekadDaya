import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Minus, Plus, ShoppingCart, CreditCard, ArrowLeft, Heart } from "lucide-react";
import { useAppStore, actions } from "../store/AppContext";
import { mockProducts } from "../services/mockData";
import type { Product, ProductVariant } from "../types";

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { dispatch } = useAppStore();

  const [product, setProduct] = useState<Product | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const foundProduct = mockProducts.find((p) => p.id === parseInt(id));
      setProduct(foundProduct || null);
      if (foundProduct && foundProduct.list_varian && foundProduct.list_varian.length > 0) {
        setSelectedVariant(foundProduct.list_varian[0]);
      }
      setLoading(false);
    }
  }, [id]);

  const handleQuantityChange = (delta: number) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1 && newQuantity <= (selectedVariant?.stock || product?.stock || 0)) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      dispatch(actions.addToCart(product, quantity));
      alert(`Berhasil menambahkan ${quantity} ${product.name} ke keranjang!`);
    }
  };

  const handleBuyNow = () => {
    if (product) {
      dispatch(actions.addToCart(product, quantity));
      navigate("/checkout");
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat detail produk...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Produk tidak ditemukan</h2>
          <button onClick={() => navigate("/products")} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Kembali ke Produk
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
      <div className="bg-white/95 backdrop-blur-sm border-b border-slate-200/50 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <button onClick={handleBack} className="flex items-center text-slate-600 hover:text-slate-900 transition-colors">
              <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
              <span className="text-sm sm:text-base">Kembali</span>
            </button>

            <div className="flex items-center space-x-2 sm:space-x-4">
              <button className="p-2 text-slate-600 hover:text-red-500 transition-colors">
                <Heart className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
              <button className="p-2 text-slate-600 hover:text-slate-900 transition-colors">
                <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
          <div className="space-y-4">
            <div className="aspect-square bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl overflow-hidden flex items-center justify-center">
              <div className="text-center p-8 sm:p-12">
                <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-slate-300 to-slate-400 rounded-2xl sm:rounded-3xl mx-auto mb-4 sm:mb-6 hover:from-amber-400 hover:to-amber-500 transition-all duration-300 shadow-xl"></div>
                <span className="text-slate-500 text-lg font-medium">Product Image</span>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">Rp{product.harga.toLocaleString("id-ID")}</div>
              <h1 className="text-2xl font-semibold text-gray-900 leading-tight">{product.name}</h1>
            </div>

            {product.list_varian && product.list_varian.length > 0 && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Varian</h3>
                <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-2">
                  {product.list_varian.map((variant) => (
                    <button
                      key={variant.id}
                      onClick={() => setSelectedVariant(variant)}
                      className={`px-3 py-2 text-sm font-medium rounded-lg border transition-all ${
                        selectedVariant?.id === variant.id ? "border-blue-500 bg-blue-50 text-blue-700" : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
                      }`}
                    >
                      {variant.name}
                    </button>
                  ))}
                </div>
                {selectedVariant && <p className="text-sm text-gray-600 mt-2">Stok: {selectedVariant.stock} tersedia</p>}
              </div>
            )}

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Kuantitas</h3>
              <div className="flex items-center space-x-4">
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button onClick={() => handleQuantityChange(-1)} disabled={quantity <= 1} className="p-2 text-gray-600 hover:text-gray-800 disabled:text-gray-300 disabled:cursor-not-allowed">
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="px-4 py-2 text-gray-900 font-medium min-w-[3rem] text-center">{quantity}</span>
                  <button onClick={() => handleQuantityChange(1)} disabled={quantity >= (selectedVariant?.stock || product.stock)} className="p-2 text-gray-600 hover:text-gray-800 disabled:text-gray-300 disabled:cursor-not-allowed">
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <span className="text-sm text-gray-600">Max: {selectedVariant?.stock || product.stock}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
              <button onClick={handleAddToCart} className="flex-1 flex items-center justify-center px-6 py-3 border border-blue-600 text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition-colors">
                <ShoppingCart className="h-5 w-5 mr-2" />
                Keranjang
              </button>
              <button onClick={handleBuyNow} className="flex-1 flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
                <CreditCard className="h-5 w-5 mr-2" />
                Beli Sekarang
              </button>
            </div>

            <div className="space-y-6 pt-6 border-t border-gray-200">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">DESKRIPSI</h3>
                <p className="text-gray-700 leading-relaxed">{product.description}</p>
              </div>

              {product.ukuran_detail && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Ukuran Detail</h4>
                  <p className="text-gray-700">{product.ukuran_detail}</p>
                </div>
              )}

              {product.bahan && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Bahan</h4>
                  <p className="text-gray-700">{product.bahan}</p>
                </div>
              )}

              {product.fungsi && product.fungsi.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Fungsi</h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    {product.fungsi.map((func, index) => (
                      <li key={index}>{func}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-12 sm:mt-16">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-6 sm:mb-8">Produk Lainnya</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
            {mockProducts
              .filter((p) => p.id !== product.id)
              .slice(0, 6)
              .map((otherProduct) => (
                <div
                  key={otherProduct.id}
                  onClick={() => navigate(`/products/${otherProduct.id}`)}
                  className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg border border-slate-200/50 overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer"
                >
                  <div className="aspect-square bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                    <div className="text-center p-3 sm:p-4">
                      <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-br from-slate-300 to-slate-400 rounded-lg sm:rounded-xl mx-auto mb-1 sm:mb-2 hover:from-amber-400 hover:to-amber-500 transition-all duration-300"></div>
                      <span className="text-slate-500 text-xs font-medium hidden sm:block">Product</span>
                    </div>
                  </div>
                  <div className="p-2 sm:p-3">
                    <h3 className="font-medium text-slate-900 text-xs sm:text-sm line-clamp-2 mb-1 sm:mb-2">{otherProduct.name}</h3>
                    <div className="text-amber-600 font-bold text-xs sm:text-sm">Rp{otherProduct.harga.toLocaleString("id-ID")}</div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
