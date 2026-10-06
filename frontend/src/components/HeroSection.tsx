import React from 'react';
import { 
  Sparkles, 
  ShieldCheck, 
  Truck, 
  HeartHandshake, 
  MapPin, 
  Phone, 
  ArrowRight,
  CheckCircle2,
  Clock
} from 'lucide-react';

interface HeroSectionProps {
  onShopClick: () => void;
  onOpenCardModal: () => void;
  onOpenPincodeModal: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onShopClick,
  onOpenCardModal,
  onOpenPincodeModal
}) => {
  return (
    <section className="relative overflow-hidden pt-6 pb-12 sm:pb-16 bg-gradient-to-b from-[#F4EFE6] via-[#FAF7F2] to-[#FAF7F2] border-b border-[#E7DEC8]">
      
      {/* Decorative Traditional Motifs */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-[#E5D8C3]/30 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-[#D97706]/10 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Top Heritage Badge */}
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1E3A27] text-white text-xs font-semibold shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#FBBF24]" />
            <span>Pure Food • Traditional Taste • Naturally</span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold">
            <div className="flex text-amber-500">
              {'★★★★★'.split('').map((star, i) => (
                <span key={i}>{star}</span>
              ))}
            </div>
            <span>5.0 (100 Reviews on Google Maps)</span>
          </div>
        </div>

        {/* Hero Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Text & Value Proposition */}
          <div className="lg:col-span-7 text-center sm:text-left">
            <h1 className="font-[family-name:'Playfair_Display',Georgia,serif] text-3xl sm:text-5xl lg:text-6xl font-extrabold text-[#1E3A27] leading-[1.15] tracking-tight">
              Switch to a Healthier Lifestyle with Pure <span className="text-[#B35427] underline decoration-[#D97706]/40 underline-offset-8">Organic Foods</span>
            </h1>

            <p className="mt-4 sm:mt-6 text-base sm:text-lg text-stone-700 font-medium leading-relaxed max-w-2xl">
              Authentic Andhra pickles, bilona A2 Gir cow ghee, stone-ground podis, wood-pressed oils, and traditional sweets crafted with heirloom family recipes. Freshly packed with zero chemicals or artificial preservatives.
            </p>

            {/* Quick Physical Store Anchor from Visiting Card */}
            <div className="mt-4 p-3 rounded-xl bg-white/80 border border-[#D8CEB9] inline-flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-xs text-stone-600 shadow-sm">
              <div className="flex items-center gap-1.5 font-bold text-[#1E3A27]">
                <MapPin className="w-4 h-4 text-[#B35427]" />
                <span>Store Location: Manikonda, Hyderabad</span>
              </div>
              <span className="hidden sm:inline text-stone-300">|</span>
              <span className="text-stone-500">Lane beside Pizza Hut & Harivillu Apts (500089)</span>
              <button 
                onClick={onOpenCardModal}
                className="text-[#B35427] font-bold hover:underline"
              >
                View Visiting Card
              </button>
            </div>

            {/* CTA Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row items-center gap-3.5">
              <button
                onClick={onShopClick}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-[#1E3A27] hover:bg-[#162D1F] text-white font-bold text-sm sm:text-base shadow-lg shadow-[#1E3A27]/20 flex items-center justify-center gap-2 group transition-all"
              >
                <span>Shop Fresh Catalog</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <a
                href="https://wa.me/919951118687?text=Hi%20Swathi,%20I%20would%20like%20to%20order%20directly%20on%20WhatsApp!"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#25D366] hover:bg-[#20BA5A] text-white font-bold text-sm sm:text-base shadow-md flex items-center justify-center gap-2 transition-all"
              >
                <Phone className="w-4 h-4" />
                <span>Order on WhatsApp</span>
              </a>

              <button
                onClick={onOpenPincodeModal}
                className="w-full sm:w-auto px-5 py-3.5 rounded-xl bg-white hover:bg-[#F4EFE6] text-stone-800 font-semibold text-sm border border-[#D8CEB9] shadow-sm flex items-center justify-center gap-1.5 transition-all"
              >
                <Clock className="w-4 h-4 text-[#D97706]" />
                <span>Hyderabad Delivery Time</span>
              </button>
            </div>

            {/* Customer Rating Proof */}
            <div className="mt-8 pt-6 border-t border-[#E7DEC8]/80 flex flex-wrap items-center justify-center sm:justify-start gap-6 text-xs text-stone-600">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#1E3A27]" />
                <span className="font-semibold text-stone-800">100% Homemade Hygiene</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#1E3A27]" />
                <span className="font-semibold text-stone-800">FSSAI Certified Kitchen</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#1E3A27]" />
                <span className="font-semibold text-stone-800">No Palm Oil or Colors</span>
              </div>
            </div>

          </div>

          {/* Right Hero Visual Cards */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md">
              
              {/* Main Card with Visual Showcase */}
              <div className="relative rounded-3xl overflow-hidden bg-white p-3.5 shadow-2xl border border-[#E7DEC8] transform rotate-1 hover:rotate-0 transition-transform duration-500">
                <div className="relative h-72 sm:h-80 rounded-2xl overflow-hidden bg-stone-100">
                  <img
                    src="https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80"
                    alt="Authentic Andhra Pickles and Ghee"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex flex-col justify-end p-5 text-white">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#FBBF24]">Signature Delicacy</span>
                    <h3 className="font-[family-name:'Playfair_Display',Georgia,serif] text-xl font-bold">Kothimera Karam & Andhra Avakaya</h3>
                    <p className="text-xs text-stone-200 mt-1">Ground fresh with organic cold-pressed sesame oil</p>
                  </div>
                </div>

                <div className="p-4 bg-[#FAF7F2] rounded-xl mt-3 flex items-center justify-between border border-[#E7DEC8]/60">
                  <div className="flex items-center gap-2.5">
                    <img
                      src="/visiting_card.png"
                      alt="Business Logo"
                      className="w-10 h-10 object-cover rounded-lg border border-[#B35427]"
                    />
                    <div>
                      <div className="font-bold text-xs text-stone-800">ManaDeshi Dukaan by Swathi</div>
                      <div className="text-[11px] text-stone-500">Sai Srinivasa Nilayam, Manikonda</div>
                    </div>
                  </div>
                  <span className="text-xs font-extrabold text-[#B35427] bg-[#B35427]/10 px-2.5 py-1 rounded-full">
                    Fresh Batches
                  </span>
                </div>
              </div>

              {/* Floating Feature Tag 1 */}
              <div className="absolute -top-4 -left-4 flex animate-bounce items-center gap-2.5 rounded-2xl border border-stone-200 bg-white/95 p-3 shadow-xl backdrop-blur-md">
                <div className="w-9 h-9 rounded-xl bg-[#1E3A27] text-white flex items-center justify-center font-bold text-base">
                  🏺
                </div>
                <div>
                  <div className="text-[11px] text-stone-500 font-bold uppercase">Heritage Method</div>
                  <div className="text-xs font-extrabold text-stone-800">Vedic Bilona Churned</div>
                </div>
              </div>

              {/* Floating Feature Tag 2 */}
              <div className="absolute -bottom-4 -right-4 bg-white/95 backdrop-blur-md rounded-2xl p-3 shadow-xl border border-stone-200 flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#D97706] text-white flex items-center justify-center font-bold text-base">
                  ⚡
                </div>
                <div>
                  <div className="text-[11px] text-stone-500 font-bold uppercase">Manikonda Local</div>
                  <div className="text-xs font-extrabold text-stone-800">1-2 Hr Instant Delivery</div>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* 4 Core Pillars */}
        <div className="mt-12 sm:mt-16 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#E7DEC8] shadow-sm hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-xl bg-[#1E3A27]/10 text-[#1E3A27] flex items-center justify-center mb-3">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-stone-800 text-sm">100% Chemical Free</h4>
            <p className="text-xs text-stone-500 mt-1">Zero synthetic colors, palm oil, or chemical vinegar preservatives.</p>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#E7DEC8] shadow-sm hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-xl bg-[#B35427]/10 text-[#B35427] flex items-center justify-center mb-3">
              <Sparkles className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-stone-800 text-sm">Wood-Pressed Oils</h4>
            <p className="text-xs text-stone-500 mt-1">Extracted in slow wooden churners at room temperature.</p>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#E7DEC8] shadow-sm hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-xl bg-[#D97706]/10 text-[#D97706] flex items-center justify-center mb-3">
              <Truck className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-stone-800 text-sm">2-4 Hr Hyd Express</h4>
            <p className="text-xs text-stone-500 mt-1">Direct from Manikonda kitchen to your doorstep in minutes.</p>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#E7DEC8] shadow-sm hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-xl bg-[#1E3A27]/10 text-[#1E3A27] flex items-center justify-center mb-3">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-stone-800 text-sm">Heirloom Recipes</h4>
            <p className="text-xs text-stone-500 mt-1">Authentic Andhra & Telangana taste perfected by Swathi.</p>
          </div>
        </div>

      </div>
    </section>
  );
};
