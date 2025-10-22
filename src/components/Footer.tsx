import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Mail, Phone, Shield, Award, Truck } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,215,0,0.05),transparent)] opacity-50"></div>
      <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.01)_50%,transparent_75%)]"></div>

      <div className="relative z-10 max-w-8xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 xl:px-12 py-8 sm:py-12 lg:py-16 xl:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12 lg:mb-16">
          <div className="flex items-center justify-center space-x-2 sm:space-x-3 p-4 sm:p-6 bg-white/5 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-white/10">
            <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-amber-400" />
            <div>
              <h4 className="font-bold text-white text-sm sm:text-base">Secure Shopping</h4>
              <p className="text-slate-400 text-xs sm:text-sm">SSL Protected</p>
            </div>
          </div>
          <div className="flex items-center justify-center space-x-2 sm:space-x-3 p-4 sm:p-6 bg-white/5 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-white/10">
            <Award className="h-6 w-6 sm:h-8 sm:w-8 text-amber-400" />
            <div>
              <h4 className="font-bold text-white text-sm sm:text-base">Premium Quality</h4>
              <p className="text-slate-400 text-xs sm:text-sm">Guaranteed Products</p>
            </div>
          </div>
          <div className="flex items-center justify-center space-x-2 sm:space-x-3 p-4 sm:p-6 bg-white/5 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-white/10">
            <Truck className="h-6 w-6 sm:h-8 sm:w-8 text-amber-400" />
            <div>
              <h4 className="font-bold text-white text-sm sm:text-base">Fast Delivery</h4>
              <p className="text-slate-400 text-xs sm:text-sm">Nationwide Shipping</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-12">
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 sm:space-x-3 mb-4 sm:mb-6">
              <img
                src="/src/assets/logo.png"
                alt="TekadDaya Logo"
                className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                  const placeholder = document.createElement("div");
                  placeholder.className = "h-12 w-12 bg-gradient-to-br from-slate-700 to-slate-900 rounded-xl flex items-center justify-center shadow-lg";
                  placeholder.innerHTML = '<span class="text-amber-400 font-bold text-xl">TD</span>';
                  e.currentTarget.parentNode?.insertBefore(placeholder, e.currentTarget);
                }}
              />
              <span className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">TekadDaya</span>
            </div>
            <p className="text-slate-300 mb-4 sm:mb-6 text-sm sm:text-base lg:text-lg leading-relaxed">Professional e-commerce platform delivering premium quality products with unmatched reliability and exceptional customer service.</p>
            <div className="flex items-center space-x-3 sm:space-x-4">
              <a href="#" className="p-2 sm:p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all hover:scale-110">
                <Facebook className="h-4 w-4 sm:h-5 sm:w-5 text-slate-300 hover:text-white" />
              </a>
              <a href="#" className="p-2 sm:p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all hover:scale-110">
                <Twitter className="h-4 w-4 sm:h-5 sm:w-5 text-slate-300 hover:text-white" />
              </a>
              <a href="#" className="p-2 sm:p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all hover:scale-110">
                <Instagram className="h-4 w-4 sm:h-5 sm:w-5 text-slate-300 hover:text-white" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-base sm:text-lg xl:text-xl font-bold text-white mb-3 sm:mb-4 lg:mb-6">Quick Links</h3>
            <ul className="space-y-2 sm:space-y-3">
              <li>
                <Link to="/products" className="text-slate-300 hover:text-amber-400 transition-colors flex items-center space-x-2 group text-sm sm:text-base">
                  <span>All Products</span>
                  <div className="w-0 group-hover:w-4 h-0.5 bg-amber-400 transition-all"></div>
                </Link>
              </li>
              <li>
                <Link to="/categories" className="text-slate-300 hover:text-amber-400 transition-colors flex items-center space-x-2 group text-sm sm:text-base">
                  <span>Categories</span>
                  <div className="w-0 group-hover:w-4 h-0.5 bg-amber-400 transition-all"></div>
                </Link>
              </li>
              <li>
                <Link to="/deals" className="text-slate-300 hover:text-amber-400 transition-colors flex items-center space-x-2 group text-sm sm:text-base">
                  <span>Special Deals</span>
                  <div className="w-0 group-hover:w-4 h-0.5 bg-amber-400 transition-all"></div>
                </Link>
              </li>
              <li>
                <Link to="/new-arrivals" className="text-slate-300 hover:text-amber-400 transition-colors flex items-center space-x-2 group text-sm sm:text-base">
                  <span>New Arrivals</span>
                  <div className="w-0 group-hover:w-4 h-0.5 bg-amber-400 transition-all"></div>
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-base sm:text-lg xl:text-xl font-bold text-white mb-3 sm:mb-4 lg:mb-6">Support</h3>
            <ul className="space-y-2 sm:space-y-3">
              <li>
                <Link to="/contact" className="text-slate-300 hover:text-amber-400 transition-colors flex items-center space-x-2 group text-sm sm:text-base">
                  <span>Contact Us</span>
                  <div className="w-0 group-hover:w-4 h-0.5 bg-amber-400 transition-all"></div>
                </Link>
              </li>
              <li>
                <Link to="/shipping" className="text-slate-300 hover:text-amber-400 transition-colors flex items-center space-x-2 group text-sm sm:text-base">
                  <span>Shipping Info</span>
                  <div className="w-0 group-hover:w-4 h-0.5 bg-amber-400 transition-all"></div>
                </Link>
              </li>
              <li>
                <Link to="/returns" className="text-slate-300 hover:text-amber-400 transition-colors flex items-center space-x-2 group text-sm sm:text-base">
                  <span>Returns</span>
                  <div className="w-0 group-hover:w-4 h-0.5 bg-amber-400 transition-all"></div>
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-slate-300 hover:text-amber-400 transition-colors flex items-center space-x-2 group text-sm sm:text-base">
                  <span>FAQ</span>
                  <div className="w-0 group-hover:w-4 h-0.5 bg-amber-400 transition-all"></div>
                </Link>
              </li>
            </ul>

            <div className="mt-6 sm:mt-8">
              <div className="flex items-center space-x-2 sm:space-x-3 mb-2 sm:mb-3">
                <Phone className="h-4 w-4 sm:h-5 sm:w-5 text-amber-400" />
                <span className="text-slate-300 font-medium text-sm sm:text-base">+62 21 1234 5678</span>
              </div>
              <div className="flex items-center space-x-2 sm:space-x-3">
                <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-amber-400" />
                <span className="text-slate-300 font-medium text-sm sm:text-base">support@tekaddaya.com</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-700/50 mt-8 sm:mt-12 pt-6 sm:pt-8">
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 sm:space-y-6 lg:space-y-0">
            <p className="text-slate-400 text-center lg:text-left text-xs sm:text-sm">© 2024 TekadDaya. All rights reserved. | Built with excellence for professional commerce.</p>
            <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4 lg:space-x-8">
              <span className="text-slate-400 font-medium text-xs sm:text-sm">Secure Payment Options:</span>
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-white px-2 sm:px-3 lg:px-4 py-1 sm:py-2 rounded-lg text-xs sm:text-sm font-bold shadow-lg">VISA</div>
                <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-white px-2 sm:px-3 lg:px-4 py-1 sm:py-2 rounded-lg text-xs sm:text-sm font-bold shadow-lg">MASTERCARD</div>
                <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-white px-2 sm:px-3 lg:px-4 py-1 sm:py-2 rounded-lg text-xs sm:text-sm font-bold shadow-lg">PAYPAL</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
