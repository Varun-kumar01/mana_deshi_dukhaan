import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowRight,
  ChevronRight,
  Leaf,
  ShieldCheck,
  Truck,
  Heart,
  Star,
  Sparkles,
  ShoppingBag,
  Clock,
} from 'lucide-react';

import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

import { TopBar } from '../components/TopBar';
import { AuthModal } from '../components/AuthModal';
import { ProductCard } from '../components/ProductCard';
import { ProductDetailModal } from '../components/ProductDetailModal';
import { CartDrawer } from '../components/CartDrawer';
import { CheckoutModal } from '../components/CheckoutModal';
import { OrderTrackingModal } from '../components/OrderTrackingModal';
import { VisitingCardModal } from '../components/VisitingCardModal';
import { WhatsAppFloatingWidget } from '../components/WhatsAppFloatingWidget';
import { Footer } from '../components/Footer';

import {
  fetchProducts,
  fetchCategories,
} from '../services/api';

import {
  fallbackCategories,
  fallbackProducts,
} from '../data/mockData';

import {
  Product,
  Category,
  ProductVariant,
  Order,
} from '../types';

const REVIEWS = [
  {
    text: 'The Kothimera Karam and Avakaya taste exactly like home. Fresh, clean and full of flavour.',
    author: 'Ravi Teja',
    location: 'Gachibowli',
  },
  {
    text: 'The A2 Ghee and Bellam Sunnundalu were exceptional. You can really taste the small-batch difference.',
    author: 'Srilatha Reddy',
    location: 'Manikonda',
  },
  {
    text: 'The wood-pressed groundnut oil is now a regular part of our kitchen. Really happy with the quality.',
    author: 'Venkatesh Murthy',
    location: 'Banjara Hills',
  },
];

const CATEGORY_IMAGES = [
  'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=85',
  'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=800&q=85',
  'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=85',
  'https://images.unsplash.com/photo-1589927986089-35812388d1f4?auto=format&fit=crop&w=800&q=85',
  'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=85',
  'https://images.unsplash.com/photo-1599785209707-a456fc1337bb?auto=format&fit=crop&w=800&q=85',
  'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=85',
  'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=85',
];

export function HomePage() {
  const {
    isLoggedIn,
    setIsAuthModalOpen,
  } = useAuth();

  const {
    addToCart,
    setIsCartOpen,
  } = useCart();

  const [categories, setCategories] = useState<Category[]>(
    fallbackCategories
  );

  const [products, setProducts] = useState<Product[]>(
    fallbackProducts
  );

  const [selectedCategory, setSelectedCategory] =
    useState('all');

  const [sortBy, setSortBy] =
    useState('featured');

  const [selectedProduct, setSelectedProduct] =
    useState<Product | null>(null);

  const [isCardModalOpen, setIsCardModalOpen] =
    useState(false);

  const [isCheckoutOpen, setIsCheckoutOpen] =
    useState(false);

  const [pendingCheckout, setPendingCheckout] =
    useState(false);

  const [trackingOrder, setTrackingOrder] =
    useState<Order | null>(null);

  const [trackingWAUrl, setTrackingWAUrl] =
    useState<string | undefined>();

  const catalogRef =
    useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function load() {
      try {
        const [cats, prods] = await Promise.all([
          fetchCategories(),
          fetchProducts(),
        ]);

        if (cats?.length) {
          setCategories(cats);
        }

        if (prods?.length) {
          setProducts(prods);
        }
      } catch {
        // Keep fallback data when backend is unavailable.
      }
    }

    load();
  }, []);

  useEffect(() => {
    if (isLoggedIn && pendingCheckout) {
      setPendingCheckout(false);
      setIsCheckoutOpen(true);
    }
  }, [isLoggedIn, pendingCheckout]);

  const filtered = products
    .filter((product) => {
      if (selectedCategory === 'all') {
        return true;
      }

      const category = categories.find(
        (cat) => cat.slug === selectedCategory
      );

      if (!category) {
        return true;
      }

      return (
        product.category_id === category.id ||
        product.category_slug === selectedCategory
      );
    })
    .sort((a, b) => {
      if (sortBy === 'price_asc') {
        return a.base_price - b.base_price;
      }

      if (sortBy === 'price_desc') {
        return b.base_price - a.base_price;
      }

      if (sortBy === 'rating') {
        return (b.rating || 5) - (a.rating || 5);
      }

      return 0;
    });

  const handleProceedToCheckout = () => {
    if (!isLoggedIn) {
      setPendingCheckout(true);
      setIsAuthModalOpen(true);
      return;
    }

    setIsCheckoutOpen(true);
  };

  const handleBuyNow = (
    product: Product,
    variant: ProductVariant,
    quantity: number
  ) => {
    addToCart(
      product,
      variant,
      quantity
    );

    setIsCartOpen(false);
    handleProceedToCheckout();
  };

  const scrollTo = (id: string) => {
    document
      .getElementById(id)
      ?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
  };

  return (
    <div className="app-shell">

      <TopBar
        products={products}
        onSelectProduct={setSelectedProduct}
        isAdminView={false}
      />

      <AuthModal />

      <main className="store-main">

        {/* =====================================================
            HERO
        ===================================================== */}

        <section
          id="home"
          className="home-hero"
        >
          <div className="home-hero-orb orb-one" />
          <div className="home-hero-orb orb-two" />

          <div className="site-container home-hero-grid">

            <div className="home-hero-content">

              <div className="home-eyebrow">
                <span />
                Homemade · Traditional · Hyderabad
              </div>

              <h1>
                A little taste
                <br />
                of <em>home.</em>
              </h1>

              <p>
                Authentic Telugu pickles,
                podis, ghee, cold-pressed
                oils, sweets and everyday
                favourites — made with
                traditional recipes and
                genuine ingredients.
              </p>

              <div className="home-hero-actions">

                <button
                  className="home-primary-button"
                  onClick={() =>
                    scrollTo('shop')
                  }
                >
                  Shop our collection
                  <ArrowRight size={17} />
                </button>

                <button
                  className="home-secondary-button"
                  onClick={() =>
                    scrollTo('story')
                  }
                >
                  Our story
                </button>

              </div>

              <div className="hero-mini-points">

                <span>
                  <Leaf size={14} />
                  Traditional recipes
                </span>

                <span>
                  <Heart size={14} />
                  Made with care
                </span>

                <span>
                  <ShieldCheck size={14} />
                  Quality ingredients
                </span>

              </div>
            </div>

            <div className="home-hero-visual">

              <div className="hero-main-image">
                <img
                  src={
                    products[0]?.images?.[0] ||
                    'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=1200&q=90'
                  }
                  alt="ManaDeshi homemade food"
                />
              </div>

              <div className="hero-image-card card-one">
                <Sparkles size={16} />

                <div>
                  <strong>
                    Small batch
                  </strong>

                  <span>
                    Made fresh
                  </span>
                </div>
              </div>

              <div className="hero-image-card card-two">
                <Star
                  size={15}
                  fill="currentColor"
                />

                <div>
                  <strong>
                    Loved locally
                  </strong>

                  <span>
                    Hyderabad kitchens
                  </span>
                </div>
              </div>

            </div>
          </div>

          <button
            className="hero-scroll"
            onClick={() =>
              scrollTo('categories')
            }
          >
            <span />
            Explore
          </button>
        </section>

        {/* =====================================================
            INTRO
        ===================================================== */}

        <section
          id="why-us"
          className="intro-strip"
        >
          <div className="site-container intro-grid">

            <div>
              <span className="section-eyebrow">
                Welcome to ManaDeshi
              </span>

              <h2>
                Food that feels
                <br />
                <em>familiar.</em>
              </h2>
            </div>

            <p>
              We believe the best food
              doesn't need to be complicated.
              Good ingredients, time-tested
              recipes and a little love can
              bring back the taste of home.
            </p>

          </div>
        </section>

        {/* =====================================================
            CATEGORIES
        ===================================================== */}

        <section
          id="categories"
          className="home-section categories-home"
        >
          <div className="site-container">

            <div className="home-section-heading">

              <div>
                <span className="section-eyebrow">
                  Explore our kitchen
                </span>

                <h2>
                  Shop by category
                </h2>

                <p>
                  Start with what you're craving.
                </p>
              </div>

              <button
                className="home-text-link"
                onClick={() =>
                  scrollTo('shop')
                }
              >
                View all products
                <ArrowRight size={16} />
              </button>

            </div>

            <div className="home-category-grid">

              {categories
                .slice(0, 8)
                .map((category, index) => (
                  <button
                    key={category.id}
                    className="home-category-card"
                    onClick={() => {
                      setSelectedCategory(
                        category.slug
                      );

                      scrollTo('shop');
                    }}
                  >
                    <div className="home-category-image">
                      <img
                        src={
                          CATEGORY_IMAGES[
                            index %
                              CATEGORY_IMAGES.length
                          ]
                        }
                        alt={category.name}
                        loading="lazy"
                      />
                    </div>

                    <div className="home-category-overlay">

                      <span>
                        Explore
                      </span>

                      <h3>
                        {category.name
                          .split('(')[0]
                          .trim()}
                      </h3>

                      <ChevronRight
                        size={18}
                      />

                    </div>
                  </button>
                ))}

            </div>
          </div>
        </section>

        {/* =====================================================
            BENEFITS
        ===================================================== */}

        <section className="benefits-section">
          <div className="site-container benefits-grid">

            <div className="benefit">
              <div>
                <Leaf size={22} />
              </div>

              <span>
                <strong>
                  Real ingredients
                </strong>
                Carefully selected
                ingredients.
              </span>
            </div>

            <div className="benefit">
              <div>
                <Heart size={22} />
              </div>

              <span>
                <strong>
                  Made with care
                </strong>
                Traditional preparation
                methods.
              </span>
            </div>

            <div className="benefit">
              <div>
                <ShieldCheck size={22} />
              </div>

              <span>
                <strong>
                  Quality first
                </strong>
                Every product checked
                with care.
              </span>
            </div>

            <div className="benefit">
              <div>
                <Truck size={22} />
              </div>

              <span>
                <strong>
                  Delivered fresh
                </strong>
                From our kitchen to
                your home.
              </span>
            </div>

          </div>
        </section>

        {/* =====================================================
            CUSTOMER FAVOURITES
        ===================================================== */}

        <section
          id="shop"
          ref={catalogRef}
          className="home-section products-home"
        >
          <div className="site-container">

            <div className="home-section-heading">

              <div>
                <span className="section-eyebrow">
                  From our kitchen
                </span>

                <h2>
                  Customer favourites
                </h2>

                <p>
                  Discover the products
                  people keep coming back for.
                </p>
              </div>

              <button
                className="home-text-link"
                onClick={() =>
                  scrollTo('all-products')
                }
              >
                Browse everything
                <ArrowRight size={16} />
              </button>

            </div>

            <div className="home-product-grid">

              {products
                .slice(0, 8)
                .map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onOpenDetail={
                      setSelectedProduct
                    }
                  />
                ))}

            </div>

          </div>
        </section>

        {/* =====================================================
            STORY
        ===================================================== */}

        <section
          id="story"
          className="story-home-section"
        >
          <div className="site-container story-home-grid">

            <div className="story-home-images">

              <div className="story-large-image">
                <img
                  src={
                    products[1]?.images?.[0] ||
                    CATEGORY_IMAGES[2]
                  }
                  alt="Traditional food"
                  loading="lazy"
                />
              </div>

              <div className="story-small-image">
                <img
                  src={
                    products[2]?.images?.[0] ||
                    CATEGORY_IMAGES[0]
                  }
                  alt="Traditional ingredients"
                  loading="lazy"
                />
              </div>

              <div className="story-floating-badge">
                <Clock size={17} />

                <div>
                  <strong>
                    Made traditionally
                  </strong>

                  <span>
                    One batch at a time
                  </span>
                </div>
              </div>

            </div>

            <div className="story-home-content">

              <span className="section-eyebrow">
                Our story
              </span>

              <h2>
                Bringing the
                <em>
                  taste of home
                </em>
                back to the table.
              </h2>

              <p>
                ManaDeshi Dukaan was born
                from a love for the food we
                grew up eating.
              </p>

              <p>
                From Andhra pickles and
                podis to ghee, oils, sweets
                and traditional favourites,
                our collection celebrates
                simple food made the way it
                should be.
              </p>

              <p>
                No unnecessary complexity.
                Just honest ingredients,
                familiar recipes and food
                made with care.
              </p>

              <button
                className="home-primary-button"
                onClick={() =>
                  scrollTo('shop')
                }
              >
                Explore our foods
                <ArrowRight size={17} />
              </button>

            </div>

          </div>
        </section>

        {/* =====================================================
            PROCESS
        ===================================================== */}

        <section className="process-home-section">

          <div className="site-container">

            <div className="center-heading">

              <span className="section-eyebrow">
                The ManaDeshi way
              </span>

              <h2>
                From our kitchen
                <br />
                to yours.
              </h2>

            </div>

            <div className="process-home-grid">

              <div>
                <span>01</span>

                <Leaf size={24} />

                <h3>
                  Choose good
                  ingredients
                </h3>

                <p>
                  We start with ingredients
                  we would proudly use in
                  our own kitchen.
                </p>
              </div>

              <div>
                <span>02</span>

                <Heart size={24} />

                <h3>
                  Make it with care
                </h3>

                <p>
                  Traditional recipes and
                  careful preparation.
                </p>
              </div>

              <div>
                <span>03</span>

                <ShoppingBag size={24} />

                <h3>
                  Pack it fresh
                </h3>

                <p>
                  Prepared and packed with
                  freshness in mind.
                </p>
              </div>

              <div>
                <span>04</span>

                <Truck size={24} />

                <h3>
                  Deliver to you
                </h3>

                <p>
                  From ManaDeshi Dukaan
                  directly to your doorstep.
                </p>
              </div>

            </div>

          </div>

        </section>

        {/* =====================================================
            REVIEWS
        ===================================================== */}

        <section className="home-section reviews-home">

          <div className="site-container">

            <div className="center-heading">

              <span className="section-eyebrow">
                Customer love
              </span>

              <h2>
                From Hyderabad
                kitchens.
              </h2>

            </div>

            <div className="home-reviews-grid">

              {REVIEWS.map((review) => (
                <article
                  key={review.author}
                  className="home-review-card"
                >
                  <div className="review-star-row">

                    {Array.from({
                      length: 5,
                    }).map((_, index) => (
                      <Star
                        key={index}
                        size={14}
                        fill="currentColor"
                      />
                    ))}

                  </div>

                  <p>
                    “{review.text}”
                  </p>

                  <strong>
                    {review.author}
                  </strong>

                  <span>
                    {review.location}
                  </span>
                </article>
              ))}

            </div>

          </div>

        </section>

        {/* =====================================================
            ALL PRODUCTS
        ===================================================== */}

        <section
          id="all-products"
          className="home-section all-products-home"
        >
          <div className="site-container">

            <div className="home-section-heading">

              <div>
                <span className="section-eyebrow">
                  Browse the collection
                </span>

                <h2>
                  All products
                </h2>
              </div>

            </div>

            <div className="filter-bar">

              <button
                className={`filter-pill ${
                  selectedCategory === 'all'
                    ? 'active-green'
                    : ''
                }`}
                onClick={() =>
                  setSelectedCategory('all')
                }
              >
                All
              </button>

              {categories.map((category) => (
                <button
                  key={category.id}
                  className={`filter-pill ${
                    selectedCategory ===
                    category.slug
                      ? 'active-green'
                      : ''
                  }`}
                  onClick={() =>
                    setSelectedCategory(
                      category.slug
                    )
                  }
                >
                  {category.name
                    .split('(')[0]
                    .trim()}
                </button>
              ))}

              <select
                className="sort-select"
                value={sortBy}
                onChange={(event) =>
                  setSortBy(
                    event.target.value
                  )
                }
              >
                <option value="featured">
                  Featured
                </option>

                <option value="price_asc">
                  Price: Low → High
                </option>

                <option value="price_desc">
                  Price: High → Low
                </option>

                <option value="rating">
                  Top Rated
                </option>
              </select>

            </div>

            {filtered.length > 0 ? (
              <div className="home-product-grid">

                {filtered.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onOpenDetail={
                      setSelectedProduct
                    }
                  />
                ))}

              </div>
            ) : (
              <div className="empty-state">

                <ShoppingBag size={36} />

                <p>
                  Nothing in this
                  collection yet.
                </p>

                <button
                  className="btn-primary"
                  onClick={() =>
                    setSelectedCategory(
                      'all'
                    )
                  }
                >
                  Show all
                </button>

              </div>
            )}

          </div>
        </section>

        {/* =====================================================
            FINAL CTA
        ===================================================== */}

        <section
          id="contact"
          className="final-home-cta"
        >
          <div className="site-container final-home-cta-inner">

            <div>

              <span className="section-eyebrow">
                ManaDeshi Dukaan
              </span>

              <h2>
                Bring a little
                <em>home</em>
                to your table.
              </h2>

              <p>
                Traditional foods,
                thoughtfully made for
                everyday homes.
              </p>

            </div>

            <button
              className="home-light-button"
              onClick={() =>
                scrollTo('shop')
              }
            >
              Start shopping
              <ArrowRight size={17} />
            </button>

          </div>
        </section>

        <Footer
          onOpenCardModal={() =>
            setIsCardModalOpen(true)
          }
        />

      </main>

      {/* =====================================================
          GLOBAL MODALS
      ===================================================== */}

      <CartDrawer
        onProceedToCheckout={
          handleProceedToCheckout
        }
      />

      <ProductDetailModal
        product={selectedProduct}
        onClose={() =>
          setSelectedProduct(null)
        }
        onBuyNow={handleBuyNow}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() =>
          setIsCheckoutOpen(false)
        }
        onOrderSuccess={(order, waUrl) => {
          setTrackingOrder(order);
          setTrackingWAUrl(waUrl);
        }}
      />

      <OrderTrackingModal
        order={trackingOrder}
        onClose={() =>
          setTrackingOrder(null)
        }
        whatsappUrl={trackingWAUrl}
      />

      <VisitingCardModal
        isOpen={isCardModalOpen}
        onClose={() =>
          setIsCardModalOpen(false)
        }
      />

      <WhatsAppFloatingWidget />

    </div>
  );
}

export default HomePage;