import { Link } from "react-router-dom";
import type { Product } from "../types";
import { useAppStore, actions } from "../store/AppContext";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { dispatch } = useAppStore();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(actions.addToCart(product, 1));
  };

  const formatPrice = (price: number) => {
    return `Rp ${price.toLocaleString()}`;
  };

  return (
    <Link to={`/products/${product.id}`} className="block">
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

          <div className="flex items-center justify-between mt-auto bg-slate-50 -mx-8 -mb-8 px-4 py-3 min-h-[60px] gap-3">
            <div className="text-lg font-bold text-amber-600 flex-shrink-0">{formatPrice(product.harga)}</div>
            <button
              onClick={handleAddToCart}
              className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 shadow-md hover:shadow-lg flex-shrink-0"
              aria-label={`Add ${product.name} to cart`}
            >
              Tambah +
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
