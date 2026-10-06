import React from 'react';
import {
  MapPin,
  Navigation,
  Phone,
  Store,
  X,
} from 'lucide-react';

interface VisitingCardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VisitingCardModal: React.FC<VisitingCardModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[500] flex items-center justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative flex max-h-[92dvh] w-full max-w-lg flex-col overflow-hidden rounded-[2rem] border border-[#E7DEC8] bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between bg-[#1E3A27] px-5 py-4 text-white sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/10">
              <Store size={18} className="text-amber-300" />
            </div>

            <div className="min-w-0">
              <p className="font-display text-sm font-bold sm:text-base">
                Store Visiting Card
              </p>
              <p className="text-[10px] font-medium text-white/60">
                Location & contact details
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close visiting card"
            className="ml-3 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white/70 transition hover:bg-white/10 hover:text-white"
          >
            <X size={19} />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto p-4 sm:p-6">
          {/* Visiting card image */}
          <div className="overflow-hidden rounded-2xl border-2 border-[#D8CEB9] bg-[#FAF7F2] shadow-lg">
            <img
              src="/visiting_card.png"
              alt="ManaDeshi Dukaan by Swathi Visiting Card"
              className="h-auto w-full object-cover"
            />
          </div>

          {/* Address */}
          <div className="mt-4 rounded-2xl border border-[#E7DEC8] bg-[#FAF7F2] p-4">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#F7E8DC] text-[#B35427]">
                <MapPin size={17} />
              </div>

              <div className="min-w-0">
                <h3 className="text-sm font-bold text-[#1E3A27]">
                  ManaDeshi Dukaan by Swathi
                </h3>

                <p className="mt-2 text-xs leading-6 text-stone-600">
                  Sai Srinivasa Nilayam, Flat # T4, Srinivasa Colony,
                  <br className="hidden sm:block" />
                  Manikonda, Lane beside Pizza Hut & Harivillu Apartments,
                  <br className="hidden sm:block" />
                  Hyderabad, Telangana -{' '}
                  <strong className="text-stone-800">500089</strong>
                </p>
              </div>
            </div>

            <div className="mt-4 flex flex-col gap-3 border-t border-[#E7DEC8] pt-4 sm:flex-row sm:items-center sm:justify-between">
              <a
                href="tel:+919951118687"
                className="inline-flex items-center gap-2 text-sm font-bold text-[#1E3A27] transition hover:text-[#B35427]"
              >
                <Phone size={15} />
                +91 9951118687
              </a>

              <span className="inline-flex w-fit items-center rounded-full bg-emerald-100 px-3 py-1 text-[10px] font-bold text-emerald-700">
                Open Daily · 9 AM – 9 PM
              </span>
            </div>
          </div>

          {/* Direct actions */}
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <a
              href="https://wa.me/919951118687?text=Hi%20Swathi,%20I%20got%20your%20visiting%20card%20from%20ManaDeshi%20Dukaan%20website"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#25D366] px-4 py-3 text-xs font-bold text-white shadow-md transition hover:bg-[#20BA5A] hover:shadow-lg"
            >
              <Phone size={16} />
              WhatsApp Store
            </a>

            <a
              href="https://maps.google.com/?q=ManaDeshi+Dukaan+by+Swathi+Manikonda+Hyderabad"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#1E3A27] px-4 py-3 text-xs font-bold text-white shadow-md transition hover:bg-[#162D1F]"
            >
              <Navigation size={16} className="text-amber-300" />
              Google Maps Directions
            </a>
          </div>

          {/* Close */}
          <button
            type="button"
            onClick={onClose}
            className="mt-4 w-full rounded-xl border border-[#D8CEB9] bg-white px-4 py-3 text-sm font-bold text-[#1E3A27] transition hover:bg-[#F4EFE6]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};