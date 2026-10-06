import React, { useState, useEffect, useRef } from 'react';
import { Package } from 'lucide-react';

import { CartProvider, useCart } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { AuthProvider, useAuth } from './context/AuthContext';

import { TopBar } from './components/TopBar';
import { AuthModal } from './components/AuthModal';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderTrackingModal } from './components/OrderTrackingModal';
import { VisitingCardModal } from './components/VisitingCardModal';
import { WhatsAppFloatingWidget } from './components/WhatsAppFloatingWidget';
import { AdminDashboard } from './components/AdminDashboard';
import { Footer } from './components/Footer';

import { fetchProducts, fetchCategories } from './services/api';
import { fallbackCategories, fallbackProducts } from './data/mockData';
import { Product, Category, ProductVariant, Order } from './types';

const REVIEWS = [
  {
    text: 'The Kothimera Karam and Avakaya taste exactly like home. Fresh, clean, and delivered the same evening.',
    author: 'Ravi Teja',
    location: 'Gachibowli',
  },
  {
    text: 'Vedic A2 Ghee and Bellam Sunnundalu were exceptional. You can tell it is made in small batches.',
    author: 'Srilatha Reddy',
    location: 'Manikonda',
  },
  {
    text: 'Wood-pressed groundnut oil and forest honey — the difference from supermarket brands is immediate.',
    author: 'Venkatesh Murthy',
    location: 'Banjara Hills',
  },
];

function MainApp() {
  const { isAdmin, isLoggedIn, setIsAuthModalOpen } = useAuth();
  const { addToCart, setIsCartOpen } = useCart();

  const [categories, setCategories] = useState<Category[]>(fallbackCategories);
  const [products, setProducts] = useState<Product[]>(fallbackProducts);
  const [isAdminView, setIsAdminView] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('featured');

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [pendingCheckout, setPendingCheckout] = useState(false);
  const [trackingOrder, setTrackingOrder] = useState<Order | null>(null);
  const [trackingWAUrl, setTrackingWAUrl] = useState<string | undefined>();

  const catalogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function load() {
      try {
        const [cats, prods] = await Promise.all([fetchCategories(), fetchProducts()]);
        if (cats && cats.length > 0) setCategories(cats);
        if (prods && prods.length > 0) setProducts(prods);
      } catch {
        // fallback catalog
      }
    }
    load();
  }, []);

  useEffect(() => {
    if (!isAdmin && isAdminView) setIsAdminView(false);
  }, [isAdmin, isAdminView]);

  useEffect(() => {
    if (isLoggedIn && pendingCheckout) {
      setPendingCheckout(false);
      if (!isAdmin) {
        setIsCheckoutOpen(true);
      }
    }
  }, [isLoggedIn, pendingCheckout, isAdmin]);

  const filtered = products
    .filter(p => {
      if (selectedCategory === 'all') return true;
      const cat = categories.find(c => c.slug === selectedCategory);
      if (cat && p.category_id !== cat.id && p.category_slug !== selectedCategory) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'price_asc') return a.base_price - b.base_price;
      if (sortBy === 'price_desc') return b.base_price - a.base_price;
      if (sortBy === 'rating') return (b.rating || 5) - (a.rating || 5);
      return 0;
    });

  const handleAdminAccess = () => {
    setIsAdminView(true);
    setIsCheckoutOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleProceedToCheckout = () => {
    if (!isLoggedIn) {
      setPendingCheckout(true);
      setIsAuthModalOpen(true);
      return;
    }
    setIsCheckoutOpen(true);
  };

  const handleBuyNow = (product: Product, variant: ProductVariant, quantity: number) => {
    addToCart(product, variant, quantity);
    setIsCartOpen(false);
    handleProceedToCheckout();
  };

  return (
    <div className="app-shell">
      <TopBar
        products={products}
        onSelectProduct={setSelectedProduct}
        isAdminView={isAdminView}
      />

      <AuthModal onAdminAccess={handleAdminAccess} />

      {isAdminView ? (
        <AdminDashboard
          onBackToStore={() => setIsAdminView(false)}
          onCatalogChange={async () => {
            const prods = await fetchProducts();
            if (prods.length) setProducts(prods);
          }}
        />
      ) : (
        <main className="store-main">
          <section className="hero">
            <div className="page-content hero-inner">
              <p className="hero-kicker">Manikonda · Hyderabad</p>
              <h1 className="hero-title">
                Homemade pickles, ghee &amp; oils
                <span> from Swathi's kitchen.</span>
              </h1>
              <p className="hero-copy">
                Traditional Telugu foods made in small batches — no preservatives,
                no dedicated shop pages. Scroll and add what you need.
              </p>
            </div>
          </section>

          <section ref={catalogRef} className="catalog">
            <div className="page-content">
              <div className="filter-bar">
                <button
                  className={`filter-pill${selectedCategory === 'all' ? ' active-green' : ''}`}
                  onClick={() => setSelectedCategory('all')}
                >
                  All
                </button>
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    className={`filter-pill${selectedCategory === cat.slug ? ' active-green' : ''}`}
                    onClick={() => setSelectedCategory(cat.slug)}
                  >
                    {cat.name.split('(')[0].trim()}
                  </button>
                ))}
                <select
                  className="sort-select"
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                  aria-label="Sort products"
                >
                  <option value="featured">Featured</option>
                  <option value="price_asc">Price: Low → High</option>
                  <option value="price_desc">Price: High → Low</option>
                  <option value="rating">Top Rated</option>
                </select>
              </div>

              {filtered.length === 0 ? (
                <div className="empty-state">
                  <Package size={36} />
                  <p>Nothing in this collection yet.</p>
                  <button className="btn-primary" onClick={() => setSelectedCategory('all')}>
                    Show all
                  </button>
                </div>
              ) : (
                <div className="product-grid">
                  {filtered.map(product => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onOpenDetail={setSelectedProduct}
                    />
                  ))}
                </div>
              )}
            </div>
          </section>

          <section className="reviews-section">
            <div className="page-content">
              <h2 className="section-title">From Hyderabad kitchens</h2>
              <div className="reviews-grid">
                {REVIEWS.map((r, i) => (
                  <article key={i} className="review-card">
                    <div className="review-stars">★★★★★</div>
                    <p className="review-text">“{r.text}”</p>
                    <div>
                      <div className="review-author">{r.author}</div>
                      <div className="review-location">{r.location}</div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <Footer onOpenCardModal={() => setIsCardModalOpen(true)} />
        </main>
      )}

      <CartDrawer onProceedToCheckout={handleProceedToCheckout} />

      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onBuyNow={handleBuyNow}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onOrderSuccess={(order, waUrl) => {
          setTrackingOrder(order);
          setTrackingWAUrl(waUrl);
        }}
      />

      <OrderTrackingModal
        order={trackingOrder}
        onClose={() => setTrackingOrder(null)}
        whatsappUrl={trackingWAUrl}
      />

      <VisitingCardModal
        isOpen={isCardModalOpen}
        onClose={() => setIsCardModalOpen(false)}
      />

      {!isAdminView && <WhatsAppFloatingWidget />}
    </div>
  );
}

export function App() {
  return (
    <AuthProvider>
      <WishlistProvider>
        <CartProvider>
          <MainApp />
        </CartProvider>
      </WishlistProvider>
    </AuthProvider>
  );
}

export default App;
