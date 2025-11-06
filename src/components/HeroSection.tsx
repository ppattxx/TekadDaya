import { Search, Shield, Award, Users } from "lucide-react";

interface HeroSectionProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isScrolled: boolean;
}

export default function HeroSection({ searchQuery, setSearchQuery, isScrolled }: HeroSectionProps) {
  return (
    <section
      className={`relative bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 transition-all duration-500 ease-in-out ${
        isScrolled ? "h-16 sm:h-20 opacity-0 transform -translate-y-4" : "h-80 sm:h-96 lg:h-[28rem] xl:h-[32rem] opacity-100 transform translate-y-0"
      }`}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,215,0,0.1),transparent)] opacity-30"></div>
      <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.02)_50%,transparent_75%)]"></div>

      <div className="relative z-10 h-full flex flex-col items-center justify-center px-3 sm:px-4 md:px-6 lg:px-8">
        <div className={`text-center mb-6 sm:mb-8 lg:mb-10 transition-all duration-500 ease-in-out ${isScrolled ? "opacity-0 transform translate-y-8 pointer-events-none" : "opacity-100 transform translate-y-0"}`}>
          <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-3 sm:mb-4 lg:mb-6 tracking-tight">
            <span className="block">BELI BOTOL</span>
          </h1>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-blue-100 max-w-xs sm:max-w-lg md:max-w-2xl lg:max-w-3xl mx-auto leading-relaxed px-2 sm:px-0">
            Temukan produk berkualitas premium dengan keandalan tak tertandingi dan layanan profesional
          </p>
        </div>

        <div
          className={`w-full max-w-sm sm:max-w-lg md:max-w-2xl lg:max-w-3xl xl:max-w-4xl mb-6 sm:mb-8 lg:mb-10 transition-all duration-500 ease-in-out ${
            isScrolled ? "opacity-0 transform translate-y-8 scale-95 pointer-events-none" : "opacity-100 transform translate-y-0 scale-100"
          }`}
        >
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-amber-600 rounded-lg sm:rounded-xl blur-sm opacity-25 group-hover:opacity-40 transition-opacity"></div>
            <div className="relative bg-white/95 backdrop-blur-sm rounded-lg sm:rounded-xl shadow-2xl border border-white/20">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center p-2 sm:p-2 gap-2 sm:gap-0">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4 sm:h-5 sm:w-5" />
                  <input
                    type="text"
                    placeholder="Cari produk... "
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-4 text-sm sm:text-base lg:text-lg bg-transparent border-none focus:outline-none text-slate-700 placeholder-slate-400"
                  />
                </div>
                <button className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white px-4 sm:px-6 lg:px-8 py-3 sm:py-4 rounded-md sm:rounded-lg text-sm sm:text-base font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 whitespace-nowrap">
                  Cari
                </button>
              </div>
            </div>
          </div>
        </div>

        <div
          className={`flex flex-wrap justify-center items-center gap-8 text-white/80 transition-all duration-500 ease-in-out ${isScrolled ? "opacity-0 transform translate-y-8 pointer-events-none" : "opacity-100 transform translate-y-0"}`}
        >
          <div className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-amber-400" />
            <span className="text-sm font-medium">Belanja Aman</span>
          </div>
          <div className="flex items-center space-x-2">
            <Award className="h-5 w-5 text-amber-400" />
            <span className="text-sm font-medium">Kualitas Premium</span>
          </div>
          <div className="flex items-center space-x-2">
            <Users className="h-5 w-5 text-amber-400" />
            <span className="text-sm font-medium">10K+ Pelanggan Puas</span>
          </div>
        </div>
      </div>
    </section>
  );
}
