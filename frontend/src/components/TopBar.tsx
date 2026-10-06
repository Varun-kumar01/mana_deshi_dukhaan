import React, { useEffect, useRef, useState } from 'react';
import {
  ChevronDown,
  ChevronRight,
  Menu,
  Search,
  ShoppingBag,
  User,
  X,
} from 'lucide-react';
import {
  Link,
  useLocation,
  useNavigate,
} from 'react-router-dom';

import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Product } from '../types';

interface TopBarProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  isAdminView: boolean;
}

const MAIN_NAV = [
  {
    label: 'Grocery',
    type: 'mega',
  },
  {
    label: 'Fresh',
    type: 'mega-fresh',
  },
  {
    label: 'Gifting',
    type: 'link',
    to: '/gifting',
  },
  {
    label: 'B2B',
    type: 'link',
    to: '/b2b',
  },
  {
    label: 'Our Story',
    type: 'link',
    to: '/our-story',
  },
  {
    label: 'Blogs',
    type: 'link',
    to: '/blogs',
  },
  {
    label: 'FAQs',
    type: 'link',
    to: '/faqs',
  },
];

const GROCERY_GROUPS = [
  {
    title: 'Shop by Category',
    items: [
      { label: 'All Products', slug: 'all' },
      { label: 'Pickles', slug: 'pickles' },
      { label: 'Powders', slug: 'powders' },
      { label: 'Snacks', slug: 'snacks' },
      { label: 'Sweets', slug: 'sweets' },
      { label: 'Oils & Ghee', slug: 'oils-ghee' },
    ],
  },
  {
    title: 'Shop by Preference',
    items: [
      { label: 'Bestsellers', slug: 'bestsellers' },
      { label: 'New Arrivals', slug: 'new-arrivals' },
      { label: 'Traditional Favourites', slug: 'traditional' },
      { label: 'Gift Worthy', slug: 'gifting' },
    ],
  },
  {
    title: 'Explore',
    items: [
      { label: 'Shop Everything', slug: 'all' },
      { label: 'Gifting', slug: 'gifting' },
      { label: 'Corporate Gifting', slug: 'b2b' },
    ],
  },
];

const FRESH_GROUPS = [
  {
    title: 'Fresh from Our Kitchen',
    items: [
      { label: 'Fresh Products', slug: 'fresh' },
      { label: 'Homemade Specialities', slug: 'homemade' },
      { label: 'Seasonal Favourites', slug: 'seasonal' },
    ],
  },
  {
    title: 'Shop',
    items: [
      { label: 'All Products', slug: 'all' },
      { label: 'Bestsellers', slug: 'bestsellers' },
      { label: 'New Arrivals', slug: 'new-arrivals' },
    ],
  },
];

export const TopBar: React.FC<TopBarProps> = ({
  products,
  onSelectProduct,
  isAdminView,
}) => {
  const { itemCount, setIsCartOpen } = useCart();
  const { setIsAuthModalOpen, user } = useAuth();

  const location = useLocation();
  const navigate = useNavigate();

  const searchRef = useRef<HTMLDivElement>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [desktopMenu, setDesktopMenu] = useState<
    'grocery' | 'fresh' | null
  >(null);
  const [scrolled, setScrolled] = useState(false);

  const filteredSearch = searchQuery.trim()
    ? products
        .filter((product) => {
          const query = searchQuery.toLowerCase();

          return (
            product.name.toLowerCase().includes(query) ||
            product.tagline?.toLowerCase().includes(query) ||
            product.category_name?.toLowerCase().includes(query)
          );
        })
        .slice(0, 8)
    : [];

  const categoryItems = Array.from(
    new Map(
      products
        .filter((product) => product.category_slug)
        .map((product) => [
          product.category_slug as string,
          {
            slug: product.category_slug as string,
            name:
              product.category_name ||
              (product.category_slug as string).replace(/-/g, ' '),
          },
        ]),
    ).values(),
  );

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setSearchOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setDesktopMenu(null);
    setSearchOpen(false);
  }, [location.pathname]);

  const closeMenus = () => {
    setDesktopMenu(null);
    setMobileOpen(false);
  };

  const navigateCategory = (slug: string) => {
    closeMenus();

    if (slug === 'all') {
      navigate('/shop');
      return;
    }

    if (slug === 'b2b') {
      navigate('/b2b');
      return;
    }

    if (slug === 'gifting') {
      navigate('/gifting');
      return;
    }

    if (
      slug === 'bestsellers' ||
      slug === 'new-arrivals' ||
      slug === 'traditional' ||
      slug === 'fresh' ||
      slug === 'homemade' ||
      slug === 'seasonal'
    ) {
      navigate(`/shop?collection=${encodeURIComponent(slug)}`);
      return;
    }

    const existingCategory = categoryItems.find(
      (category) => category.slug === slug,
    );

    navigate(
      existingCategory
        ? `/category/${encodeURIComponent(slug)}`
        : `/shop?category=${encodeURIComponent(slug)}`,
    );
  };

  const handleSearchSelect = (product: Product) => {
    setSearchQuery('');
    setSearchOpen(false);
    closeMenus();
    onSelectProduct(product);
  };

  if (isAdminView) {
    return null;
  }

  return (
    <>
      {/* Announcement bar */}
      <div className="bg-[#173522] text-white">
        <div className="mx-auto flex min-h-9 w-full max-w-[1440px] items-center justify-center px-4 text-center text-[10px] font-medium tracking-[0.04em] sm:px-6 sm:text-[11px] lg:px-8">
          <span>
            Homemade with care · Traditional Telugu flavours · Free delivery
            above ₹499
          </span>
        </div>
      </div>

      {/* Main header */}
      <header
        className={`sticky top-0 z-[200] border-b border-[#e7ebe6] bg-[#fffdf9]/95 backdrop-blur-xl transition-shadow duration-300 ${
          scrolled
            ? 'shadow-[0_8px_30px_rgba(20,45,28,0.08)]'
            : ''
        }`}
      >
        <div className="mx-auto flex min-h-[76px] w-full max-w-[1440px] items-center gap-3 px-4 sm:px-6 lg:px-8 xl:gap-7">
          {/* Logo */}
          <Link
            to="/"
            onClick={closeMenus}
            className="flex shrink-0 items-center gap-2.5"
            aria-label="ManaDeshi Dukaan home"
          >
            <div className="h-10 w-10 overflow-hidden rounded-full border border-[#234b32]/15 bg-[#edf4ee] sm:h-11 sm:w-11">
              <img
                src="/visiting_card.png"
                alt="ManaDeshi Dukaan"
                className="h-full w-full object-cover"
              />
            </div>

            <div className="hidden min-w-0 leading-none min-[430px]:block">
              <div className="font-['Playfair_Display',Georgia,serif] text-[19px] font-bold tracking-[-0.04em] text-[#234b32] sm:text-[21px]">
                ManaDeshi
              </div>

              <div className="mt-1 text-[7px] font-extrabold uppercase tracking-[0.14em] text-[#bd6c32] sm:text-[8px]">
                Dukaan by Swathi
              </div>
            </div>
          </Link>

          {/* Desktop navigation */}
          <nav className="hidden items-center gap-1 lg:flex">
            {MAIN_NAV.map((item) => {
              if (item.type === 'link') {
                return (
                  <Link
                    key={item.label}
                    to={item.to!}
                    className={`rounded-full px-3 py-2 text-[11px] font-bold transition-colors ${
                      location.pathname === item.to
                        ? 'bg-[#edf4ee] text-[#234b32]'
                        : 'text-[#4e5a51] hover:bg-[#f2f5f1] hover:text-[#234b32]'
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              }

              const menuName =
                item.type === 'mega'
                  ? 'grocery'
                  : 'fresh';

              const open = desktopMenu === menuName;

              return (
                <button
                  key={item.label}
                  type="button"
                  aria-expanded={open}
                  onClick={() =>
                    setDesktopMenu((current) =>
                      current === menuName ? null : menuName,
                    )
                  }
                  className={`flex items-center gap-1 rounded-full px-3 py-2 text-[11px] font-bold transition-colors ${
                    open
                      ? 'bg-[#edf4ee] text-[#234b32]'
                      : 'text-[#4e5a51] hover:bg-[#f2f5f1] hover:text-[#234b32]'
                  }`}
                >
                  {item.label}
                  <ChevronDown
                    size={13}
                    className={`transition-transform ${
                      open ? 'rotate-180' : ''
                    }`}
                  />
                </button>
              );
            })}
          </nav>

          {/* Search */}
          <div
            ref={searchRef}
            className="relative order-last min-w-0 flex-1 lg:order-none lg:max-w-[300px] xl:max-w-[340px]"
          >
            <div className="flex h-10 items-center gap-2 rounded-full border border-[#e2e8e2] bg-[#f8faf7] px-3.5 transition-colors focus-within:border-[#b9cbbd] focus-within:bg-white">
              <Search
                size={16}
                className="shrink-0 text-[#778279]"
              />

              <input
                type="search"
                value={searchQuery}
                placeholder="Search products..."
                aria-label="Search products"
                onFocus={() => setSearchOpen(true)}
                onChange={(event) => {
                  setSearchQuery(event.target.value);
                  setSearchOpen(true);
                }}
                className="w-full min-w-0 bg-transparent text-[11px] text-[#172019] outline-none placeholder:text-[#9aa39c]"
              />

              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setSearchOpen(false);
                  }}
                  aria-label="Clear search"
                  className="shrink-0 text-[#778279] hover:text-[#234b32]"
                >
                  <X size={15} />
                </button>
              )}
            </div>

            {searchOpen && filteredSearch.length > 0 && (
              <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-[400] max-h-[min(480px,70vh)] overflow-y-auto rounded-2xl border border-[#e3e9e3] bg-white p-1.5 shadow-[0_24px_70px_rgba(20,45,28,0.16)]">
                {filteredSearch.map((product) => (
                  <button
                    key={product.id}
                    type="button"
                    onClick={() => handleSearchSelect(product)}
                    className="flex w-full items-center gap-3 rounded-xl p-2.5 text-left transition-colors hover:bg-[#f1f5f0]"
                  >
                    <img
                      src={
                        product.images?.[0] ||
                        '/visiting_card.png'
                      }
                      alt=""
                      className="h-11 w-11 shrink-0 rounded-lg object-cover"
                    />

                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[11px] font-bold text-[#27342b]">
                        {product.name}
                      </span>

                      <span className="mt-0.5 block truncate text-[9px] text-[#78817b]">
                        {product.category_name || 'ManaDeshi Dukaan'}
                      </span>
                    </span>

                    <span className="shrink-0 text-[11px] font-bold text-[#234b32]">
                      ₹{product.base_price}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="ml-auto flex shrink-0 items-center gap-1.5">
            <button
              type="button"
              onClick={() => setIsAuthModalOpen(true)}
              aria-label="My account"
              title={
                user
                  ? `Signed in as ${user.name}`
                  : 'My account'
              }
              className="grid h-10 w-10 place-items-center rounded-full border border-[#e1e7e1] bg-white text-[#234b32] transition hover:bg-[#edf4ee]"
            >
              {user ? (
                <span className="grid h-6 w-6 place-items-center rounded-full bg-[#234b32] text-[10px] font-bold text-white">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              ) : (
                <User size={18} />
              )}
            </button>

            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              aria-label="Shopping cart"
              title="Shopping cart"
              className="relative grid h-10 w-10 place-items-center rounded-full border border-[#e1e7e1] bg-white text-[#234b32] transition hover:bg-[#edf4ee]"
            >
              <ShoppingBag size={18} />

              {itemCount > 0 && (
                <span className="absolute -right-1 -top-1 grid h-[18px] min-w-[18px] place-items-center rounded-full border-2 border-white bg-[#bd6c32] px-1 text-[8px] font-extrabold text-white">
                  {itemCount}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setMobileOpen((open) => !open)}
              aria-label="Open navigation menu"
              aria-expanded={mobileOpen}
              className="grid h-10 w-10 place-items-center rounded-full border border-[#e1e7e1] bg-white text-[#234b32] lg:hidden"
            >
              {mobileOpen ? (
                <X size={21} />
              ) : (
                <Menu size={21} />
              )}
            </button>
          </div>
        </div>

        {/* Desktop Grocery/Fresh mega menu */}
        {desktopMenu && (
          <div className="hidden border-t border-[#edf0ec] bg-white lg:block">
            <div className="mx-auto w-full max-w-[1440px] px-8 py-8">
              {desktopMenu === 'grocery' ? (
                <div className="grid grid-cols-3 gap-10">
                  {GROCERY_GROUPS.map((group) => (
                    <div key={group.title}>
                      <div className="mb-4 text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#bd6c32]">
                        {group.title}
                      </div>

                      <div className="space-y-1">
                        {group.items.map((item) => (
                          <button
                            key={item.label}
                            type="button"
                            onClick={() =>
                              navigateCategory(item.slug)
                            }
                            className="group flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-xs font-semibold capitalize text-[#3f4b43] transition hover:bg-[#f1f5f0] hover:text-[#234b32]"
                          >
                            <span>{item.label}</span>
                            <ChevronRight
                              size={13}
                              className="opacity-0 transition group-hover:translate-x-0.5 group-hover:opacity-100"
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-10">
                  {FRESH_GROUPS.map((group) => (
                    <div key={group.title}>
                      <div className="mb-4 text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#bd6c32]">
                        {group.title}
                      </div>

                      <div className="space-y-1">
                        {group.items.map((item) => (
                          <button
                            key={item.label}
                            type="button"
                            onClick={() =>
                              navigateCategory(item.slug)
                            }
                            className="group flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-xs font-semibold text-[#3f4b43] transition hover:bg-[#f1f5f0] hover:text-[#234b32]"
                          >
                            <span>{item.label}</span>
                            <ChevronRight
                              size={13}
                              className="opacity-0 transition group-hover:translate-x-0.5 group-hover:opacity-100"
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Mobile navigation */}
        {mobileOpen && (
          <div className="max-h-[calc(100dvh-76px)] overflow-y-auto border-t border-[#e7ebe6] bg-white lg:hidden">
            <div className="mx-auto w-full max-w-[1440px] px-4 py-3 sm:px-6">
              <div className="space-y-1">
                {/* Grocery */}
                <details className="group rounded-xl bg-[#f7f9f6]">
                  <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between px-4 text-xs font-bold text-[#234b32] [&::-webkit-details-marker]:hidden">
                    Grocery
                    <ChevronDown
                      size={15}
                      className="transition-transform group-open:rotate-180"
                    />
                  </summary>

                  <div className="border-t border-[#e7ebe6] px-2 pb-2">
                    {GROCERY_GROUPS.flatMap(
                      (group) => group.items,
                    ).map((item, index, array) => (
                      <button
                        key={`${item.label}-${index}`}
                        type="button"
                        onClick={() =>
                          navigateCategory(item.slug)
                        }
                        className="flex min-h-11 w-full items-center justify-between border-b border-[#eef1ed] px-3 text-left text-xs text-[#58635c] last:border-0"
                      >
                        <span>{item.label}</span>
                        <ChevronRight size={13} />
                      </button>
                    ))}
                  </div>
                </details>

                {/* Fresh */}
                <details className="group rounded-xl bg-[#f7f9f6]">
                  <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between px-4 text-xs font-bold text-[#234b32] [&::-webkit-details-marker]:hidden">
                    Fresh
                    <ChevronDown
                      size={15}
                      className="transition-transform group-open:rotate-180"
                    />
                  </summary>

                  <div className="border-t border-[#e7ebe6] px-2 pb-2">
                    {FRESH_GROUPS.flatMap(
                      (group) => group.items,
                    ).map((item, index) => (
                      <button
                        key={`${item.label}-${index}`}
                        type="button"
                        onClick={() =>
                          navigateCategory(item.slug)
                        }
                        className="flex min-h-11 w-full items-center justify-between border-b border-[#eef1ed] px-3 text-left text-xs text-[#58635c] last:border-0"
                      >
                        <span>{item.label}</span>
                        <ChevronRight size={13} />
                      </button>
                    ))}
                  </div>
                </details>

                {/* Main links */}
                {MAIN_NAV.filter(
                  (item) =>
                    item.type === 'link',
                ).map((item) => (
                  <Link
                    key={item.label}
                    to={item.to!}
                    className="flex min-h-12 items-center justify-between border-b border-[#edf0ec] px-3 text-xs font-bold text-[#3f4b43]"
                    onClick={closeMenus}
                  >
                    <span>{item.label}</span>
                    <ChevronRight size={14} />
                  </Link>
                ))}

                {/* Account */}
                <button
                  type="button"
                  onClick={() => {
                    closeMenus();
                    setIsAuthModalOpen(true);
                  }}
                  className="flex min-h-12 w-full items-center gap-3 border-b border-[#edf0ec] px-3 text-left text-xs font-bold text-[#234b32]"
                >
                  <User size={17} />
                  <span>
                    {user ? user.name : 'My Account'}
                  </span>
                </button>

                {/* Cart */}
                <button
                  type="button"
                  onClick={() => {
                    closeMenus();
                    setIsCartOpen(true);
                  }}
                  className="flex min-h-12 w-full items-center gap-3 px-3 text-left text-xs font-bold text-[#234b32]"
                >
                  <ShoppingBag size={17} />
                  <span>
                    My Cart
                    {itemCount > 0
                      ? ` (${itemCount})`
                      : ''}
                  </span>
                </button>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
};