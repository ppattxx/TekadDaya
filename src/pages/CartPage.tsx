import { Link } from "react-router-dom";
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from "lucide-react";
import { useAppStore, actions } from "../store/AppContext";
import { useUpdateCartItem, useRemoveFromCart, useClearCart } from "../hooks/useApi";

export default function CartPage() {
  const { state, dispatch } = useAppStore();
  const updateCartItem = useUpdateCartItem();
  const removeFromCart = useRemoveFromCart();
  const clearCart = useClearCart();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleQuantityChange = (itemId: number, productId: number, newQuantity: number) => {
    if (newQuantity < 1) return;

    if (localStorage.getItem("auth_token")) {
      updateCartItem.mutate({ id: productId, quantity: newQuantity });
    } else {
      dispatch(actions.updateCartItem(itemId, newQuantity));
    }
  };

  const handleRemoveItem = (itemId: number, productId: number) => {
    if (localStorage.getItem("auth_token")) {
      removeFromCart.mutate(productId);
    } else {
      dispatch(actions.removeFromCart(itemId));
    }
  };

  const handleClearCart = () => {
    if (window.confirm("Apakah Anda yakin ingin mengosongkan keranjang?")) {
      if (localStorage.getItem("auth_token")) {
        clearCart.mutate();
      } else {
        dispatch(actions.clearCart());
      }
    }
  };

  if (state.cart.items.length === 0) {
    return (
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 pt-20 pb-16 lg:pb-20 xl:pb-24">
        <div className="text-center">
          <ShoppingBag className="mx-auto h-24 w-24 lg:h-32 lg:w-32 xl:h-40 xl:w-40 text-gray-300" />
          <h2 className="text-2xl lg:text-3xl xl:text-4xl font-bold text-gray-900 mt-6 lg:mt-8 xl:mt-10">Keranjang Anda kosong</h2>
          <p className="text-gray-600 lg:text-lg xl:text-xl mt-2 mb-8 lg:mt-4 lg:mb-10 xl:mt-6 xl:mb-12">Sepertinya Anda belum menambahkan produk ke keranjang.</p>
          <Link to="/products" className="btn-primary inline-flex items-center bg-amber-600 hover:bg-amber-700 text-white">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Lanjutkan Belanja
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white pt-16 sm:pt-18 lg:pt-20">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 gap-3 sm:gap-0">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900">Keranjang Belanja</h1>
          <button onClick={handleClearCart} className="text-red-600 hover:text-red-700 text-sm sm:text-base font-medium self-start sm:self-auto">
            Kosongkan Keranjang
          </button>
        </div>

        <div className="flex flex-col lg:grid lg:grid-cols-12 gap-6 lg:gap-8">
          <div className="lg:col-span-8">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200/50">
              <div className="px-4 sm:px-6 py-4 border-b border-slate-200/50">
                <h2 className="text-base sm:text-lg font-medium text-slate-900">Item Keranjang ({state.cart.itemCount})</h2>
              </div>

              <div className="divide-y divide-slate-200/50">
                {state.cart.items.map((item) => (
                  <div key={item.id} className="p-4 sm:p-6">
                    <div className="flex flex-col xs:flex-row items-start xs:items-center space-y-3 xs:space-y-0 xs:space-x-4">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl flex items-center justify-center flex-shrink-0">
                        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-slate-300 to-slate-400 rounded-lg"></div>
                      </div>

                      <div className="flex-1 min-w-0 w-full xs:w-auto">
                        <Link to={`/products/${item.product.id}`} className="text-base sm:text-lg font-medium text-slate-900 hover:text-amber-600 block line-clamp-2">
                          {item.product.name}
                        </Link>
                        <p className="text-xs sm:text-sm text-slate-500 mt-1">{item.product.category}</p>
                        <p className="text-base sm:text-lg font-semibold text-amber-600 mt-2">{formatPrice(item.product.harga)}</p>
                      </div>

                      <div className="flex flex-col xs:flex-row items-start xs:items-center space-y-3 xs:space-y-0 xs:space-x-3 w-full xs:w-auto">
                        <div className="flex items-center border border-slate-300 rounded-lg bg-white">
                          <button
                            onClick={() => handleQuantityChange(item.id, item.product.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            className="p-2 text-gray-600 hover:text-gray-800 disabled:text-gray-300 disabled:cursor-not-allowed"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="px-4 py-2 text-gray-900 font-medium min-w-[3rem] text-center">{item.quantity}</span>
                          <button
                            onClick={() => handleQuantityChange(item.id, item.product.id, item.quantity + 1)}
                            disabled={item.quantity >= item.product.stock}
                            className="p-2 text-gray-600 hover:text-gray-800 disabled:text-gray-300 disabled:cursor-not-allowed"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>

                        <button onClick={() => handleRemoveItem(item.id, item.product.id)} className="p-2 text-red-600 hover:text-red-700">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
                      <span className="text-sm text-gray-600">
                        {item.quantity} × {formatPrice(item.product.harga)}
                      </span>
                      <span className="text-lg font-semibold text-gray-900">{formatPrice(item.product.harga * item.quantity)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6">
              <Link to="/products" className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Lanjutkan Belanja
              </Link>
            </div>
          </div>

          <div className="lg:col-span-4 mt-8 lg:mt-0">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Ringkasan Pesanan</h2>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal ({state.cart.itemCount} item)</span>
                  <span className="text-gray-900">{formatPrice(state.cart.total)}</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Ongkir</span>
                  <span className="text-gray-900">{state.cart.total >= 100000 ? "Gratis" : formatPrice(15000)}</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Pajak</span>
                  <span className="text-gray-900">{formatPrice(state.cart.total * 0.1)}</span>
                </div>

                <hr className="my-4" />

                <div className="flex justify-between text-lg font-semibold">
                  <span className="text-gray-900">Total</span>
                  <span className="text-gray-900">{formatPrice(state.cart.total + (state.cart.total >= 100000 ? 0 : 15000) + state.cart.total * 0.1)}</span>
                </div>
              </div>

              {state.cart.total >= 100000 && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-700">🎉 Anda mendapat ongkir gratis!</p>
                </div>
              )}

              <div className="mt-6 space-y-3">
                {state.isAuthenticated ? (
                  <Link to="/checkout" className="w-full btn-primary text-center block">
                    Lanjut ke Pembayaran
                  </Link>
                ) : (
                  <div className="space-y-3">
                    <Link to="/login?redirect=checkout" className="w-full btn-primary text-center block">
                      Masuk untuk Checkout
                    </Link>
                    <p className="text-xs text-gray-600 text-center">
                      Atau{" "}
                      <Link to="/register" className="text-blue-600 hover:text-blue-700">
                        buat akun
                      </Link>{" "}
                      untuk menyimpan keranjang
                    </p>
                  </div>
                )}

                <button className="w-full btn-secondary">Simpan untuk Nanti</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
