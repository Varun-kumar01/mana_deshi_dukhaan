import React, { useState } from 'react';
import {
  ArrowRight,
  Clock,
  Heart,
  MapPin,
  MessageCircle,
  Phone,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { VisitingCardModal } from './VisitingCardModal';

interface FooterProps {
  onOpenCardModal?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenCardModal }) => {
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);

  const handleOpenCard = () => {
    if (onOpenCardModal) {
      onOpenCardModal();
    } else {
      setIsCardModalOpen(true);
    }
  };

  return (
    <>
      <footer className="border-t border-[#E7DEC8] bg-[#FAF7F2] text-[#4B5563]">
        <div className="mx-auto max-w-7xl px-4 pb-8 pt-12 sm:px-6 lg:px-8 lg:pt-14">
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr]">
            {/* Brand */}
            <div>
              <Link to="/" className="inline-block">
                <h2 className="font-display text-2xl font-extrabold text-[#1E3A27]">
                  ManaDeshi Dukaan
                </h2>

                <p className="mt-1 text-[11px] font-bold uppercase tracking-[0.16em] text-[#B35427]">
                  by Swathi
                </p>
              </Link>

              <p className="mt-5 max-w-sm text-sm leading-7 text-stone-600">
                Traditional Telugu flavours, homemade favourites and thoughtful
                small-batch foods made with care.
              </p>

              <Link
                to="/shop"
                className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#1E3A27] transition hover:text-[#B35427]"
              >
                Explore the shop
                <ArrowRight size={16} />
              </Link>
            </div>

            {/* Quick links */}
            <div>
              <h3 className="font-display text-base font-bold text-[#1E3A27]">
                Explore
              </h3>

              <nav className="mt-4 flex flex-col gap-3 text-sm">
                <Link
                  to="/shop"
                  className="transition hover:text-[#B35427]"
                >
                  Shop
                </Link>

                <Link
                  to="/about"
                  className="transition hover:text-[#B35427]"
                >
                  Our Story
                </Link>

                <Link
                  to="/why-us"
                  className="transition hover:text-[#B35427]"
                >
                  Why Us
                </Link>

                <Link
                  to="/wishlist"
                  className="transition hover:text-[#B35427]"
                >
                  Wishlist
                </Link>

                <Link
                  to="/contact"
                  className="transition hover:text-[#B35427]"
                >
                  Contact Us
                </Link>
              </nav>
            </div>

            {/* Contact */}
            <div>
              <h3 className="font-display text-base font-bold text-[#1E3A27]">
                Get in touch
              </h3>

              <div className="mt-4 space-y-4 text-sm">
                <div className="flex items-start gap-3">
                  <MapPin
                    size={17}
                    className="mt-0.5 shrink-0 text-[#B35427]"
                  />

                  <p className="leading-6 text-stone-600">
                    Sai Srinivasa Nilayam, T4,
                    <br />
                    Srinivasa Colony, Manikonda,
                    <br />
                    Hyderabad 500089
                  </p>
                </div>

                <a
                  href="tel:+919951118687"
                  className="flex items-center gap-3 font-semibold text-[#1E3A27] transition hover:text-[#B35427]"
                >
                  <Phone size={17} className="shrink-0 text-[#B35427]" />
                  +91 99511 18687
                </a>

                <a
                  href="https://wa.me/919951118687"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 font-semibold text-[#1E3A27] transition hover:text-[#B35427]"
                >
                  <MessageCircle
                    size={17}
                    className="shrink-0 text-[#B35427]"
                  />
                  WhatsApp us
                </a>

                <div className="flex items-center gap-3 text-stone-600">
                  <Clock
                    size={17}
                    className="shrink-0 text-[#B35427]"
                  />
                  Daily 9:00 AM – 9:00 PM
                </div>
              </div>
            </div>
          </div>

          {/* Bottom */}
          <div className="mt-10 flex flex-col gap-4 border-t border-[#E7DEC8] pt-6 text-xs sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-1.5 text-stone-500">
              <span>© {new Date().getFullYear()} ManaDeshi Dukaan</span>
              <span>·</span>
              <span className="inline-flex items-center gap-1">
                Made with
                <Heart size={12} className="fill-[#B35427] text-[#B35427]" />
                by Swathi
              </span>
            </div>

            <button
              type="button"
              onClick={handleOpenCard}
              className="w-fit font-semibold text-[#1E3A27] transition hover:text-[#B35427]"
            >
              Visiting card
            </button>
          </div>
        </div>
      </footer>

      <VisitingCardModal
        isOpen={!onOpenCardModal && isCardModalOpen}
        onClose={() => setIsCardModalOpen(false)}
      />
    </>
  );
};