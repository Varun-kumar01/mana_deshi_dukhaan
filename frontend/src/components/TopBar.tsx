import React, { useState, useEffect, useRef } from 'react';
import { ShoppingBag, Search, X, User } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Product } from '../types';

interface TopBarProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  isAdminView: boolean;
}

export const TopBar: React.FC<TopBarProps> = ({
  products,
  onSelectProduct,
  isAdminView,
}) => {
  const { itemCount, setIsCartOpen } = useCart();
  const { setIsAuthModalOpen, user } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const filteredSearch = searchQuery.trim()
    ? products.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.tagline && p.tagline.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (p.category_name && p.category_name.toLowerCase().includes(searchQuery.toLowerCase()))
      ).slice(0, 7)
    : [];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

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
    <header className={`topbar${scrolled ? ' scrolled' : ''}`}>
      <div className="topbar-main">
        <button
          className="topbar-logo"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <div className="topbar-logo-mark">
            <img src="/visiting_card.png" alt="ManaDeshi Dukaan" />
          </div>
          <div className="topbar-logo-text-wrap">
            <span className="topbar-logo-name">ManaDeshi</span>
            <span className="topbar-logo-sub">by Swathi</span>
          </div>
        </button>

        {!isAdminView && (
          <div className="topbar-search" ref={searchRef}>
            <Search size={15} className="search-icon" />
            <input
              type="search"
              placeholder="Search pickles, ghee, oils..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              enterKeyHint="search"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="search-clear"
                aria-label="Clear search"
              >
                <X size={14} />
              </button>
            )}

            {isSearchFocused && filteredSearch.length > 0 && (
              <div className="search-dropdown">
                {filteredSearch.map(p => (
                  <button
                    type="button"
                    key={p.id}
                    className="search-dropdown-item"
                    onClick={() => {
                      onSelectProduct(p);
                      setIsSearchFocused(false);
                      setSearchQuery('');
                    }}
                  >
                    <img
                      src={(p.images && p.images[0]) || '/visiting_card.png'}
                      alt=""
                    />
                    <div style={{ flex: 1, minWidth: 0, textAlign: 'left' }}>
                      <div className="search-item-name">{p.name}</div>
                      <div className="search-item-cat">{p.category_name}</div>
                    </div>
                    <span className="search-item-price">₹{p.base_price}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="topbar-actions">
          <button
            className="topbar-btn"
            onClick={() => setIsAuthModalOpen(true)}
            title={user ? `Signed in as ${user.name}` : 'Profile · Sign in'}
            aria-label="Profile"
          >
            {user ? (
              <span className="profile-avatar">{user.name.charAt(0).toUpperCase()}</span>
            ) : (
              <User size={18} />
            )}
          </button>

          {!isAdminView && (
            <button
              className="topbar-btn cart-btn"
              onClick={() => setIsCartOpen(true)}
              aria-label="Cart"
            >
              <ShoppingBag size={18} />
              {itemCount > 0 && <span className="topbar-badge">{itemCount}</span>}
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
