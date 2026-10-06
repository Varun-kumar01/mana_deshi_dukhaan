import React, { useState } from 'react';
import { Phone, X, MessageSquare, Sparkles } from 'lucide-react';

export const WhatsAppFloatingWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const phone = '919951118687';
  const defaultMsg = encodeURIComponent(
    'Hi Swathi, I am browsing ManaDeshi Dukaan and would like help ordering fresh organic foods!'
  );
  const waUrl = `https://wa.me/${phone}?text=${defaultMsg}`;

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end">
      
      {/* Pop-up bubble */}
      {isOpen && (
        <div className="mb-3 w-72 bg-white rounded-2xl shadow-2xl border border-[#E7DEC8] overflow-hidden animate-fadeIn text-xs">
          <div className="bg-[#1E3A27] text-white p-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img
                src="/visiting_card.png"
                alt="Swathi"
                className="w-7 h-7 rounded-full object-cover border border-[#D97706]"
              />
              <div>
                <div className="font-bold">Swathi • ManaDeshi Dukaan</div>
                <div className="text-[10px] text-emerald-300">Online • Manikonda Store</div>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-stone-300 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-3.5 space-y-2.5 bg-[#FAF7F2]">
            <p className="text-stone-700 leading-relaxed">
              Namaskaram! 🙏 Looking for fresh Andhra pickles, cold-pressed oils, or pure cow ghee? I can take your order directly on WhatsApp with instant delivery in Hyderabad!
            </p>

            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-3 bg-[#25D366] hover:bg-[#20BA5A] text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-md transition-all text-xs"
            >
              <Phone className="w-4 h-4" />
              <span>Chat with Swathi on WhatsApp</span>
            </a>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#20BA5A] text-white flex items-center justify-center shadow-xl shadow-[#25D366]/30 hover:scale-110 transition-all duration-300 relative group"
        title="Chat with Swathi on WhatsApp"
      >
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-400 rounded-full border-2 border-white animate-ping" />
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white" />
        <Phone className="w-7 h-7 fill-white" />
      </button>

    </div>
  );
};
