import type { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  ChevronRight,
  Heart,
  Menu,
  ShoppingBag,
  User,
  X,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Footer } from './Footer';
import { WhatsAppFloatingWidget } from './WhatsAppFloatingWidget';

interface PageLayoutProps {
  children: ReactNode;
  title: string;
  eyebrow?: string;
}

const NAV_ITEMS = [
  { label: 'Home', to: '/' },
  { label: 'Shop', to: '/shop' },
  { label: 'Our Story', to: '/about' },
  { label: 'Why Us', to: '/why-us' },
  { label: 'Contact', to: '/contact' },
];

export function PageLayout({
  children,
  title,
  eyebrow = 'ManaDeshi Dukaan by Swathi',
}: PageLayoutProps) {
  const { itemCount } = useCart();
  const { user, setIsAuthModalOpen } = useAuth();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] =
    useState(false);

  const closeMobileMenu = () =>
    setMobileMenuOpen(false);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <div className="flex min-h-dvh flex-col bg-[#FAF7F2] text-[#1A2318]">
      {/* Announcement bar */}
      <div className="bg-[#1E3A27] px-4 py-2 text-center text-[10px] font-semibold tracking-wide text-[#FAF7F2] sm:text-xs">
        Homemade with care
        <span className="mx-2 text-white/40">·</span>
        Free delivery above ₹499
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-[#E7DEC8] bg-white/95 shadow-sm backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link
            to="/"
            onClick={closeMobileMenu}
            className="flex min-w-0 items-center gap-2.5 sm:gap-3"
          >
            <div className="relative shrink-0">
              <img
                src="/visiting_card.png"
                alt="ManaDeshi Dukaan"
                className="h-9 w-9 rounded-xl border border-[#E7DEC8] bg-[#F4EFE6] object-cover sm:h-11 sm:w-11"
              />

              <span className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-white bg-[#B35427]" />
            </div>

            <span className="min-w-0">
              <span className="block truncate font-display text-[15px] font-extrabold leading-tight text-[#1E3A27] sm:text-xl">
                ManaDeshi Dukaan
              </span>

              <span className="block text-[8px] font-bold uppercase tracking-[0.16em] text-[#B35427] sm:text-[10px]">
                by Swathi
              </span>
            </span>
          </Link>

          {/* Desktop navigation */}
          <nav
            aria-label="Main navigation"
            className="hidden items-center gap-5 text-sm font-semibold text-stone-700 lg:flex xl:gap-7"
          >
            {NAV_ITEMS.map((item) => {
              const isActive =
                item.to === '/'
                  ? location.pathname === '/'
                  : location.pathname.startsWith(
                      item.to
                    );

              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`relative py-2 transition ${
                    isActive
                      ? 'text-[#1E3A27]'
                      : 'hover:text-[#B35427]'
                  }`}
                >
                  {item.label}

                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-[#B35427]" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Actions */}
          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
            <Link
              to="/wishlist"
              aria-label="Wishlist"
              className="hidden h-9 w-9 items-center justify-center rounded-full border border-[#E7DEC8] text-[#1E3A27] transition hover:bg-[#EEF5F0] sm:inline-flex sm:h-10 sm:w-10"
            >
              <Heart size={18} />
            </Link>

            <button
              type="button"
              onClick={() => setIsAuthModalOpen(true)}
              aria-label={
                user
                  ? `Account for ${user.name}`
                  : 'Sign in'
              }
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#E7DEC8] text-[#1E3A27] transition hover:bg-[#EEF5F0] sm:h-10 sm:w-10"
            >
              <User size={18} />
            </button>

            <Link
              to="/cart"
              aria-label={`Cart, ${itemCount} items`}
              className="relative inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#1E3A27] text-white transition hover:bg-[#2B5336] sm:h-10 sm:w-10"
            >
              <ShoppingBag size={17} />

              {itemCount > 0 && (
                <span className="absolute -right-1 -top-1 min-w-5 rounded-full bg-[#B35427] px-1 text-center text-[9px] font-bold leading-5 text-white">
                  {itemCount > 99 ? '99+' : itemCount}
                </span>
              )}
            </Link>

            {/* Mobile menu */}
            <button
              type="button"
              onClick={() =>
                setMobileMenuOpen(
                  (value) => !value
                )
              }
              aria-label={
                mobileMenuOpen
                  ? 'Close navigation'
                  : 'Open navigation'
              }
              aria-expanded={mobileMenuOpen}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#E7DEC8] text-[#1E3A27] transition hover:bg-[#EEF5F0] lg:hidden sm:h-10 sm:w-10"
            >
              {mobileMenuOpen ? (
                <X size={18} />
              ) : (
                <Menu size={18} />
              )}
            </button>
          </div>
        </div>

        {/* Mobile navigation */}
        {mobileMenuOpen && (
          <div className="border-t border-[#E7DEC8] bg-white shadow-sm lg:hidden">
            <nav
              aria-label="Mobile navigation"
              className="mx-auto max-w-7xl px-4 py-3 sm:px-6"
            >
              {NAV_ITEMS.map((item) => {
                const isActive =
                  item.to === '/'
                    ? location.pathname === '/'
                    : location.pathname.startsWith(
                        item.to
                      );

                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={closeMobileMenu}
                    className={`flex items-center justify-between border-b border-[#F0EBDD] py-3.5 text-sm font-semibold last:border-b-0 ${
                      isActive
                        ? 'text-[#1E3A27]'
                        : 'text-stone-700'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      {item.label}

                      {isActive && (
                        <span className="h-1.5 w-1.5 rounded-full bg-[#B35427]" />
                      )}
                    </span>

                    <ChevronRight
                      size={16}
                      className="text-stone-400"
                    />
                  </Link>
                );
              })}

              <Link
                to="/wishlist"
                onClick={closeMobileMenu}
                className="flex items-center justify-between border-b border-[#F0EBDD] py-3.5 text-sm font-semibold text-stone-700"
              >
                <span className="flex items-center gap-2">
                  <Heart size={16} />
                  Wishlist
                </span>

                <ChevronRight
                  size={16}
                  className="text-stone-400"
                />
              </Link>

              <Link
                to="/account"
                onClick={closeMobileMenu}
                className="mt-3 flex items-center justify-center gap-2 rounded-xl bg-[#EEF5F0] px-4 py-3 text-sm font-bold text-[#1E3A27]"
              >
                <User size={16} />
                {user ? 'My Account' : 'Sign In'}
              </Link>
            </nav>
          </div>
        )}

        {/* Compact mobile links */}
        {!mobileMenuOpen && (
          <div className="mx-auto flex max-w-7xl gap-5 overflow-x-auto border-t border-[#F0EBDD] px-4 py-2.5 text-[11px] font-semibold text-stone-600 sm:px-6 lg:hidden">
            <Link
              className="shrink-0 transition hover:text-[#B35427]"
              to="/shop"
            >
              Shop
            </Link>

            <Link
              className="shrink-0 transition hover:text-[#B35427]"
              to="/about"
            >
              Our Story
            </Link>

            <Link
              className="shrink-0 transition hover:text-[#B35427]"
              to="/why-us"
            >
              Why Us
            </Link>

            <Link
              className="shrink-0 transition hover:text-[#B35427]"
              to="/contact"
            >
              Contact
            </Link>

            <Link
              className="shrink-0 transition hover:text-[#B35427]"
              to="/wishlist"
            >
              Wishlist
            </Link>
          </div>
        )}
      </header>

      {/* Main */}
      <main className="w-full flex-1">
        {/* Page hero */}
        <section className="relative overflow-hidden border-b border-[#E7DEC8] bg-gradient-to-br from-[#EEF5F0] via-[#FAF7F2] to-[#F4EFE6]">
          <div
            aria-hidden="true"
            className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-[#DDEADF]/60 blur-3xl"
          />

          <div
            aria-hidden="true"
            className="absolute -bottom-24 left-1/4 h-56 w-56 rounded-full bg-[#F2DCCB]/50 blur-3xl"
          />

          <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
            <div className="max-w-4xl">
              <p className="mb-3 text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#B35427] sm:text-xs">
                {eyebrow}
              </p>

              <h1 className="font-display text-3xl font-extrabold leading-tight tracking-tight text-[#1E3A27] sm:text-4xl lg:text-5xl">
                {title}
              </h1>
            </div>
          </div>
        </section>

        {children}
      </main>

      <Footer />
      <WhatsAppFloatingWidget />
    </div>
  );
}