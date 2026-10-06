import React, { useState } from 'react';
import { MessageCircle, Phone, X } from 'lucide-react';

export const WhatsAppFloatingWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const phone = '919951118687';
  const defaultMsg = encodeURIComponent(
    'Hi Swathi, I am browsing ManaDeshi Dukaan and would like help ordering fresh organic foods!',
  );

  const waUrl = `https://wa.me/${phone}?text=${defaultMsg}`;

  return (
    <div className="fixed bottom-4 right-4 z-[300] flex flex-col items-end sm:bottom-6 sm:right-6">
      {/* Chat popup */}
      {isOpen && (
        <div className="mb-3 w-[calc(100vw-2rem)] max-w-[340px] overflow-hidden rounded-2xl border border-[#E7DEC8] bg-white shadow-2xl sm:w-80">
          {/* Popup header */}
          <div className="flex items-center justify-between bg-[#1E3A27] p-3.5 text-white">
            <div className="flex min-w-0 items-center gap-2.5">
              <div className="relative shrink-0">
                <img
                  src="/visiting_card.png"
                  alt="Swathi"
                  className="h-9 w-9 rounded-full border border-amber-400 object-cover"
                />

                <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-[#1E3A27] bg-emerald-400" />
              </div>

              <div className="min-w-0">
                <div className="truncate text-xs font-bold sm:text-sm">
                  Swathi · ManaDeshi Dukaan
                </div>

                <div className="mt-0.5 text-[10px] text-emerald-300">
                  Online · Manikonda Store
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Close WhatsApp chat"
              className="ml-2 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white/60 transition hover:bg-white/10 hover:text-white"
            >
              <X size={16} />
            </button>
          </div>

          {/* Message */}
          <div className="bg-[#FAF7F2] p-4">
            <div className="relative rounded-2xl rounded-tl-sm border border-[#E7DEC8] bg-white p-3.5 shadow-sm">
              <p className="text-xs leading-6 text-stone-700 sm:text-[13px]">
                Namaskaram! 🙏 Looking for fresh Andhra pickles, cold-pressed
                oils, or pure cow ghee? I can take your order directly on
                WhatsApp with instant delivery in Hyderabad!
              </p>
            </div>

            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] px-3 py-3 text-xs font-bold text-white shadow-md transition hover:bg-[#20BA5A] hover:shadow-lg"
            >
              <MessageCircle size={16} />
              Chat with Swathi on WhatsApp
            </a>
          </div>
        </div>
      )}

      {/* Floating button */}
      <button
        type="button"
        onClick={() => setIsOpen((value) => !value)}
        aria-label={
          isOpen
            ? 'Close WhatsApp chat'
            : 'Chat with Swathi on WhatsApp'
        }
        aria-expanded={isOpen}
        title="Chat with Swathi on WhatsApp"
        className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-xl shadow-[#25D366]/30 transition-all duration-300 hover:scale-105 hover:bg-[#20BA5A] hover:shadow-[#25D366]/40 sm:h-15 sm:w-15"
      >
        {!isOpen && (
          <>
            <span className="absolute -right-0.5 -top-0.5 h-3.5 w-3.5 animate-ping rounded-full border-2 border-white bg-emerald-400" />
            <span className="absolute -right-0.5 -top-0.5 h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-500" />
          </>
        )}

        {isOpen ? (
          <X size={24} />
        ) : (
          <Phone size={25} className="fill-white" />
        )}
      </button>
    </div>
  );
};