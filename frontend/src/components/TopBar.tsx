// import React, { useState, useEffect, useRef } from 'react';
// import { ShoppingBag, Search, X, User } from 'lucide-react';
// import { useCart } from '../context/CartContext';
// import { useAuth } from '../context/AuthContext';
// import { Product } from '../types';

// interface TopBarProps {
//   products: Product[];
//   onSelectProduct: (product: Product) => void;
//   isAdminView: boolean;
// }

// export const TopBar: React.FC<TopBarProps> = ({
//   products,
//   onSelectProduct,
//   isAdminView,
// }) => {
//   const { itemCount, setIsCartOpen } = useCart();
//   const { setIsAuthModalOpen, user } = useAuth();

//   const [searchQuery, setSearchQuery] = useState('');
//   const [isSearchFocused, setIsSearchFocused] = useState(false);
//   const [scrolled, setScrolled] = useState(false);
//   const searchRef = useRef<HTMLDivElement>(null);

//   const filteredSearch = searchQuery.trim()
//     ? products.filter(p =>
//         p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         (p.tagline && p.tagline.toLowerCase().includes(searchQuery.toLowerCase())) ||
//         (p.category_name && p.category_name.toLowerCase().includes(searchQuery.toLowerCase()))
//       ).slice(0, 7)
//     : [];

//   useEffect(() => {
//     const onScroll = () => setScrolled(window.scrollY > 4);
//     window.addEventListener('scroll', onScroll, { passive: true });
//     return () => window.removeEventListener('scroll', onScroll);
//   }, []);

//   useEffect(() => {
//     function handleClickOutside(e: MouseEvent) {
//       if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
//         setIsSearchFocused(false);
//       }
//     }
//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, []);

//   return (
//     <header className={`topbar${scrolled ? ' scrolled' : ''}`}>
//       <div className="topbar-main">
//         <button
//           className="topbar-logo"
//           onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
//         >
//           <div className="topbar-logo-mark">
//             <img src="/visiting_card.png" alt="ManaDeshi Dukaan" />
//           </div>
//           <div className="topbar-logo-text-wrap">
//             <span className="topbar-logo-name">ManaDeshi</span>
//             <span className="topbar-logo-sub">by Swathi</span>
//           </div>
//         </button>

//         {!isAdminView && (
//           <div className="topbar-search" ref={searchRef}>
//             <Search size={15} className="search-icon" />
//             <input
//               type="search"
//               placeholder="Search pickles, ghee, oils..."
//               value={searchQuery}
//               onChange={e => setSearchQuery(e.target.value)}
//               onFocus={() => setIsSearchFocused(true)}
//               enterKeyHint="search"
//             />
//             {searchQuery && (
//               <button
//                 type="button"
//                 onClick={() => setSearchQuery('')}
//                 className="search-clear"
//                 aria-label="Clear search"
//               >
//                 <X size={14} />
//               </button>
//             )}

//             {isSearchFocused && filteredSearch.length > 0 && (
//               <div className="search-dropdown">
//                 {filteredSearch.map(p => (
//                   <button
//                     type="button"
//                     key={p.id}
//                     className="search-dropdown-item"
//                     onClick={() => {
//                       onSelectProduct(p);
//                       setIsSearchFocused(false);
//                       setSearchQuery('');
//                     }}
//                   >
//                     <img
//                       src={(p.images && p.images[0]) || '/visiting_card.png'}
//                       alt=""
//                     />
//                     <div style={{ flex: 1, minWidth: 0, textAlign: 'left' }}>
//                       <div className="search-item-name">{p.name}</div>
//                       <div className="search-item-cat">{p.category_name}</div>
//                     </div>
//                     <span className="search-item-price">₹{p.base_price}</span>
//                   </button>
//                 ))}
//               </div>
//             )}
//           </div>
//         )}

//         <div className="topbar-actions">
//           <button
//             className="topbar-btn"
//             onClick={() => setIsAuthModalOpen(true)}
//             title={user ? `Signed in as ${user.name}` : 'Profile · Sign in'}
//             aria-label="Profile"
//           >
//             {user ? (
//               <span className="profile-avatar">{user.name.charAt(0).toUpperCase()}</span>
//             ) : (
//               <User size={18} />
//             )}
//           </button>

//           {!isAdminView && (
//             <button
//               className="topbar-btn cart-btn"
//               onClick={() => setIsCartOpen(true)}
//               aria-label="Cart"
//             >
//               <ShoppingBag size={18} />
//               {itemCount > 0 && <span className="topbar-badge">{itemCount}</span>}
//             </button>
//           )}
//         </div>
//       </div>
//     </header>
//   );
// };

import React, { useEffect, useRef, useState } from 'react';
import {
  ShoppingBag,
  Search,
  X,
  User,
  Menu,
  ChevronDown,
  Heart,
} from 'lucide-react';

import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Product } from '../types';

interface TopBarProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  isAdminView: boolean;
}

const NAV_ITEMS = [
  { label: 'Home', target: 'home' },
  { label: 'Shop', target: 'shop' },
  { label: 'Categories', target: 'categories' },
  { label: 'Our Story', target: 'story' },
  { label: 'Why Us', target: 'why-us' },
  { label: 'Contact', target: 'contact' },
];

export const TopBar: React.FC<TopBarProps> = ({
  products,
  onSelectProduct,
  isAdminView,
}) => {
  const { itemCount, setIsCartOpen } = useCart();
  const { setIsAuthModalOpen, user } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);

  const filteredSearch = searchQuery.trim()
    ? products
        .filter(
          (p) =>
            p.name
              .toLowerCase()
              .includes(searchQuery.toLowerCase()) ||
            (p.tagline &&
              p.tagline
                .toLowerCase()
                .includes(searchQuery.toLowerCase())) ||
            (p.category_name &&
              p.category_name
                .toLowerCase()
                .includes(searchQuery.toLowerCase()))
        )
        .slice(0, 7)
    : [];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll, {
      passive: true,
    });

    return () =>
      window.removeEventListener(
        'scroll',
        handleScroll
      );
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(
          event.target as Node
        )
      ) {
        setSearchOpen(false);
      }
    };

    document.addEventListener(
      'mousedown',
      handleClickOutside
    );

    return () =>
      document.removeEventListener(
        'mousedown',
        handleClickOutside
      );
  }, []);

  const navigateTo = (target: string) => {
    setMobileOpen(false);

    if (target === 'home') {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });

      return;
    }

    const element =
      document.getElementById(target);

    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };

  if (isAdminView) {
    return null;
  }

  return (
    <>
      <div className="announcement-bar">
        <div className="site-container announcement-inner">
          <span>
            Homemade with care · Traditional Telugu
            flavours
          </span>

          <span className="announcement-right">
            Free delivery above ₹499
          </span>
        </div>
      </div>

      <header
        className={`site-header ${
          scrolled ? 'site-header-scrolled' : ''
        }`}
      >
        <div className="site-container navbar">
          {/* LOGO */}

          <button
            className="brand"
            onClick={() =>
              navigateTo('home')
            }
            aria-label="ManaDeshi Dukaan"
          >
            <div className="brand-mark">
              <img
                src="/visiting_card.png"
                alt="ManaDeshi Dukaan"
              />
            </div>

            <div className="brand-copy">
              <strong>ManaDeshi</strong>
              <span>Dukaan by Swathi</span>
            </div>
          </button>

          {/* DESKTOP NAVIGATION */}

          <nav className="desktop-nav">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.target}
                onClick={() =>
                  navigateTo(item.target)
                }
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* SEARCH */}

          <div
            className="navbar-search"
            ref={searchRef}
          >
            <Search size={16} />

            <input
              type="search"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(event) => {
                setSearchQuery(
                  event.target.value
                );

                setSearchOpen(true);
              }}
              onFocus={() =>
                setSearchOpen(true)
              }
            />

            {searchQuery && (
              <button
                className="search-clear"
                onClick={() => {
                  setSearchQuery('');
                  setSearchOpen(false);
                }}
                aria-label="Clear search"
              >
                <X size={15} />
              </button>
            )}

            {searchOpen &&
              filteredSearch.length > 0 && (
                <div className="search-results">
                  {filteredSearch.map(
                    (product) => (
                      <button
                        key={product.id}
                        className="search-result"
                        onClick={() => {
                          onSelectProduct(
                            product
                          );

                          setSearchQuery('');
                          setSearchOpen(false);
                        }}
                      >
                        <img
                          src={
                            product.images?.[0] ||
                            '/visiting_card.png'
                          }
                          alt=""
                        />

                        <span>
                          <strong>
                            {product.name}
                          </strong>

                          <small>
                            {
                              product.category_name
                            }
                          </small>
                        </span>

                        <b>
                          ₹{product.base_price}
                        </b>
                      </button>
                    )
                  )}
                </div>
              )}
          </div>

          {/* ACTIONS */}

          <div className="navbar-actions">
            <button
              className="navbar-icon-button"
              onClick={() =>
                setIsAuthModalOpen(true)
              }
              aria-label="Profile"
              title="Profile"
            >
              {user ? (
                <span className="profile-avatar">
                  {user.name
                    .charAt(0)
                    .toUpperCase()}
                </span>
              ) : (
                <User size={19} />
              )}
            </button>

            <button
              className="navbar-icon-button"
              onClick={() =>
                setIsCartOpen(true)
              }
              aria-label="Shopping cart"
              title="Cart"
            >
              <ShoppingBag size={19} />

              {itemCount > 0 && (
                <span className="cart-count">
                  {itemCount}
                </span>
              )}
            </button>

            <button
              className="mobile-menu-button"
              onClick={() =>
                setMobileOpen(
                  (value) => !value
                )
              }
              aria-label="Menu"
            >
              {mobileOpen ? (
                <X size={22} />
              ) : (
                <Menu size={22} />
              )}
            </button>
          </div>
        </div>

        {/* MOBILE NAVIGATION */}

        {mobileOpen && (
          <div className="mobile-navigation">
            <div className="site-container mobile-navigation-inner">
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.target}
                  onClick={() =>
                    navigateTo(
                      item.target
                    )
                  }
                >
                  <span>{item.label}</span>

                  <ChevronDown size={15} />
                </button>
              ))}

              <button
                className="mobile-profile-link"
                onClick={() => {
                  setMobileOpen(false);
                  setIsAuthModalOpen(true);
                }}
              >
                <User size={17} />

                <span>
                  {user
                    ? user.name
                    : 'My Profile'}
                </span>
              </button>

              <button
                className="mobile-profile-link"
                onClick={() => {
                  setMobileOpen(false);
                  setIsCartOpen(true);
                }}
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
        )}
      </header>
    </>
  );
};
