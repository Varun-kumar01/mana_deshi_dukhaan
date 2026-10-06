import React, { useState, useEffect, useRef } from 'react';
import { 
  ShoppingBag, 
  Search, 
  MapPin, 
  Phone, 
  Menu, 
  X, 
  ChevronDown,
  LayoutDashboard,
  Store
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { Product, Category } from '../types';

interface NavbarProps {
  categories: Category[];
  products: Product[];
  selectedCategory: string;
  onSelectCategory: (slug: string) => void;
  onSelectProduct: (product: Product) => void;
  onOpenCardModal: () => void;
  onOpenPincodeModal: () => void;
  isAdminView: boolean;
  onToggleAdmin: () => void;
  currentPincode: string;
  pincodeArea: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  categories,
  products,
  selectedCategory,
  onSelectCategory,
  onSelectProduct,
  onOpenCardModal,
  onOpenPincodeModal,
  isAdminView,
  onToggleAdmin,
  currentPincode,
  pincodeArea
}) => {
  const { itemCount, totalAmount, setIsCartOpen } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Filter products for search dropdown
  const filteredProducts = searchQuery.trim()
    ? products.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.tagline && p.tagline.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (p.category_name && p.category_name.toLowerCase().includes(searchQuery.toLowerCase()))
      ).slice(0, 6)
    : [];

  // Close search dropdown on click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsSearchFocused(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#E7DEC8] transition-all">
      {/* Top Announcement Bar */}
      <div className="bg-[#1E3A27] text-[#FAF7F2] text-xs py-2 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-1.5 font-medium">
          <div className="flex items-center gap-2">
            <span className="bg-[#D97706] text-white px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider animate-pulse">
              Hyd Express
            </span>
            <span>⚡ Same-Day Delivery in Manikonda & Hyderabad within 2-4 Hours! | Free delivery above ₹499</span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <button 
              onClick={onOpenCardModal}
              className="hover:text-[#FBBF24] transition-colors flex items-center gap-1 underline underline-offset-2"
            >
              <Store className="w-3.5 h-3.5" />
              <span>Store: Manikonda, Hyd</span>
            </button>
            <a 
              href="https://wa.me/919951118687?text=Hi%20Swathi,%20I%20would%20like%20to%20order%20organic%20foods%20from%20ManaDeshi%20Dukaan" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-[#4ADE80] transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>+91 9951118687</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between gap-4">
          
          {/* Logo & Brand Identity */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => { onSelectCategory('all'); if (isAdminView) onToggleAdmin(); }}
              className="flex items-center gap-3 text-left group"
            >
              {/* Traditional Seal Icon */}
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#1E3A27] to-[#2B5336] p-0.5 shadow-md flex items-center justify-center overflow-hidden border border-[#D97706]/40">
                <img 
                  src="/visiting_card.png" 
                  alt="ManaDeshi Dukaan Seal" 
                  className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-[family-name:'Playfair_Display',Georgia,serif] font-extrabold text-xl sm:text-2xl text-[#1E3A27] tracking-tight group-hover:text-[#B35427] transition-colors">
                    MANADESHI DUKAAN
                  </span>
                  <span className="hidden md:inline-block text-[10px] uppercase font-bold tracking-widest bg-[#D97706]/15 text-[#9A5B00] px-2 py-0.5 rounded-md border border-[#D97706]/30">
                    5.0 ★
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold tracking-wider uppercase text-[#B35427]">
                    BY SWATHI
                  </span>
                  <span className="text-[11px] text-[#55695B] font-medium hidden sm:inline">
                    • Natural & Organic Home Foods
                  </span>
                </div>
              </div>
            </button>
          </div>

          {/* Location Delivery Selector (Hyderabad Quick Check) */}
          <button 
            onClick={onOpenPincodeModal}
            className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#EFE8DC]/70 hover:bg-[#E7DEC8] border border-[#D8CEB9] text-xs transition-colors text-left"
          >
            <MapPin className="w-4 h-4 text-[#B35427] shrink-0" />
            <div>
              <div className="text-[10px] text-stone-500 uppercase font-bold leading-tight">Deliver to</div>
              <div className="font-semibold text-stone-800 truncate max-w-[140px]">
                {currentPincode ? `${pincodeArea} (${currentPincode})` : 'Check Pincode'}
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
          </button>

          {/* Search Bar with Live Overlay Dropdown */}
          <div ref={searchRef} className="relative flex-1 max-w-md hidden md:block">
            <div className="relative">
              <input
                type="text"
                placeholder="Search Kothimera Karam, A2 Ghee, Avakaya, Podi..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                className="w-full pl-10 pr-4 py-2 text-sm bg-white rounded-full border border-[#D8CEB9] focus:outline-none focus:ring-2 focus:ring-[#1E3A27] focus:border-transparent transition-all shadow-inner placeholder:text-stone-400"
              />
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Dropdown Results */}
            {isSearchFocused && filteredProducts.length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden z-50">
                <div className="p-2 border-b border-stone-100 bg-[#FAF7F2] flex items-center justify-between text-xs text-stone-500 font-semibold px-4">
                  <span>Found {filteredProducts.length} organic items</span>
                  <span className="text-[11px] text-[#B35427]">Select to inspect</span>
                </div>
                <div className="divide-y divide-stone-100 max-h-80 overflow-y-auto">
                  {filteredProducts.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => {
                        onSelectProduct(p);
                        setIsSearchFocused(false);
                        setSearchQuery('');
                      }}
                      className="w-full text-left p-3 hover:bg-[#F4EFE6] transition-colors flex items-center gap-3"
                    >
                      <img
                        src={(p.images && p.images[0]) || '/visiting_card.png'}
                        alt={p.name}
                        className="w-12 h-12 object-cover rounded-lg border border-stone-200"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-stone-800 text-sm truncate">{p.name}</div>
                        <div className="text-xs text-stone-500 truncate">{p.tagline || p.category_name}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-[#1E3A27] text-sm">₹{p.base_price}</div>
                        {p.variants && p.variants.length > 0 && (
                          <div className="text-[10px] text-stone-400">{p.variants[0].title}+</div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons (Wishlist, Cart, Admin Toggle) */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Admin Switch Toggle Button */}
            <button
              onClick={onToggleAdmin}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all border ${
                isAdminView
                  ? 'bg-[#B35427] text-white border-[#B35427] shadow-md'
                  : 'bg-white hover:bg-[#FAF7F2] text-[#1E3A27] border-[#D8CEB9]'
              }`}
              title={isAdminView ? 'Switch to Customer Storefront' : 'Switch to Admin Panel'}
            >
              {isAdminView ? (
                <>
                  <Store className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Storefront</span>
                </>
              ) : (
                <>
                  <LayoutDashboard className="w-3.5 h-3.5 text-[#B35427]" />
                  <span className="hidden sm:inline">Admin Panel</span>
                </>
              )}
            </button>

            {/* Cart Drawer Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-2 px-3 py-2 bg-[#1E3A27] hover:bg-[#162D1F] text-white rounded-xl shadow-md transition-all group"
            >
              <ShoppingBag className="w-5 h-5 text-[#FAF7F2] group-hover:scale-110 transition-transform" />
              <div className="hidden sm:flex flex-col text-left leading-none">
                <span className="text-[10px] text-stone-300 font-medium">Cart</span>
                <span className="text-xs font-bold">₹{totalAmount}</span>
              </div>
              {itemCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-[#D97706] text-white text-[11px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                  {itemCount}
                </span>
              )}
            </button>

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 md:hidden text-stone-700 hover:text-stone-900 rounded-lg hover:bg-stone-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>

        {/* Mobile Search Bar */}
        <div className="mt-3 md:hidden">
          <div className="relative">
            <input
              type="text"
              placeholder="Search pickles, cold-pressed oils, ghee..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-white rounded-full border border-[#D8CEB9] focus:outline-none focus:ring-1 focus:ring-[#1E3A27]"
            />
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
          {searchQuery.trim() && filteredProducts.length > 0 && (
            <div className="mt-2 bg-white rounded-xl shadow-lg border border-stone-200 divide-y divide-stone-100 max-h-60 overflow-y-auto">
              {filteredProducts.map(p => (
                <button
                  key={p.id}
                  onClick={() => {
                    onSelectProduct(p);
                    setSearchQuery('');
                  }}
                  className="w-full text-left p-2.5 flex items-center justify-between text-xs"
                >
                  <span className="font-semibold text-stone-800">{p.name}</span>
                  <span className="font-bold text-[#1E3A27]">₹{p.base_price}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Category Pills Navigation Bar */}
      {!isAdminView && (
        <div className="border-t border-[#E7DEC8]/80 bg-[#FAF7F2] overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden py-2 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto flex items-center gap-2 whitespace-nowrap">
            <button
              onClick={() => onSelectCategory('all')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-full transition-all flex items-center gap-1.5 ${
                selectedCategory === 'all'
                  ? 'bg-[#1E3A27] text-white shadow-sm'
                  : 'bg-white hover:bg-[#F4EFE6] text-stone-700 border border-[#D8CEB9]'
              }`}
            >
              <span>🌿 All Products</span>
            </button>

            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.slug)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-full transition-all flex items-center gap-1.5 ${
                  selectedCategory === cat.slug
                    ? 'bg-[#1E3A27] text-white shadow-sm'
                    : 'bg-white hover:bg-[#F4EFE6] text-stone-700 border border-[#D8CEB9]'
                }`}
              >
                <span>{cat.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};
