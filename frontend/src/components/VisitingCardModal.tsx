import React from 'react';
import { X, MapPin, Phone, ExternalLink, Store, Sparkles, Navigation } from 'lucide-react';

interface VisitingCardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VisitingCardModal: React.FC<VisitingCardModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="relative bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-[#E7DEC8] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-[#1E3A27] text-white">
          <div className="flex items-center gap-2">
            <Store className="w-5 h-5 text-[#FBBF24]" />
            <h3 className="font-serif-display font-bold text-base">Store Visiting Card & Location</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-white/10 text-white/80">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Card Body */}
        <div className="p-5 space-y-4">
          
          {/* Authentic Card Image */}
          <div className="rounded-2xl overflow-hidden shadow-lg border-2 border-[#D8CEB9] bg-[#FAF7F2]">
            <img
              src="/visiting_card.png"
              alt="ManaDeshi Dukaan by Swathi Visiting Card"
              className="w-full h-auto object-cover"
            />
          </div>

          {/* Store Address Details */}
          <div className="p-4 bg-[#FAF7F2] rounded-2xl border border-[#E7DEC8] space-y-2 text-xs text-stone-700">
            <div className="font-bold text-stone-900 text-sm flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-[#B35427]" />
              <span>ManaDeshi Dukaan by Swathi</span>
            </div>
            <p className="leading-relaxed">
              Sai Srinivasa Nilayam, Flat # T4, Srinivasa Colony,<br />
              Manikonda, Lane beside Pizza Hut & Harivillu Apartments,<br />
              Hyderabad, Telangana - <strong>500089</strong>
            </p>
            <div className="pt-2 border-t border-[#E7DEC8] flex items-center justify-between">
              <span className="font-bold text-[#1E3A27] flex items-center gap-1">
                <Phone className="w-3.5 h-3.5" />
                +91 9951118687
              </span>
              <span className="text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded">
                Open Daily 9 AM - 9 PM
              </span>
            </div>
          </div>

          {/* Direct Actions */}
          <div className="grid grid-cols-2 gap-2.5">
            <a
              href="https://wa.me/919951118687?text=Hi%20Swathi,%20I%20got%20your%20visiting%20card%20from%20ManaDeshi%20Dukaan%20website"
              target="_blank"
              rel="noopener noreferrer"
              className="py-2.5 px-4 rounded-xl bg-[#25D366] text-white font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-[#20BA5A] shadow-md"
            >
              <Phone className="w-4 h-4" />
              <span>WhatsApp Store</span>
            </a>

            <a
              href="https://maps.google.com/?q=ManaDeshi+Dukaan+by+Swathi+Manikonda+Hyderabad"
              target="_blank"
              rel="noopener noreferrer"
              className="py-2.5 px-4 rounded-xl bg-[#1E3A27] text-white font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-[#162D1F] shadow-md"
            >
              <Navigation className="w-4 h-4 text-[#FBBF24]" />
              <span>Google Maps Directions</span>
            </a>
          </div>

        </div>

      </div>
    </div>
  );
};
