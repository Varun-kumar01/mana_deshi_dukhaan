import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  ChevronRight,
  Clock,
  Heart,
  Leaf,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Star,
  Truck,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

import { TopBar } from '../components/TopBar';
import { ProductCard } from '../components/ProductCard';
import { ProductDetailModal } from '../components/ProductDetailModal';
import { CheckoutModal } from '../components/CheckoutModal';
import { OrderTrackingModal } from '../components/OrderTrackingModal';
import { VisitingCardModal } from '../components/VisitingCardModal';
import { WhatsAppFloatingWidget } from '../components/WhatsAppFloatingWidget';
import { Footer } from '../components/Footer';

import {
  fetchCategories,
  fetchProducts,
} from '../services/api';

import {
  fallbackCategories,
  fallbackProducts,
} from '../data/mockData';

import {
  Category,
  Order,
  Product,
  ProductVariant,
} from '../types';

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=1400&q=90';

const CATEGORY_IMAGES = [
  'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=900&q=85',
  'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=900&q=85',
  'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=900&q=85',
  'https://images.unsplash.com/photo-1589927986089-35812388d1f4?auto=format&fit=crop&w=900&q=85',
  'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=900&q=85',
  'https://images.unsplash.com/photo-1599785209707-a456fc1337bb?auto=format&fit=crop&w=900&q=85',
  'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=900&q=85',
  'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=900&q=85',
];

const REVIEWS = [
  {
    quote:
      'The taste instantly reminded me of home. Everything felt fresh, authentic and beautifully packed.',
    name: 'Srilatha Reddy',
    place: 'Manikonda',
  },
  {
    quote:
      'The pickles and podis have become regulars in our kitchen. Traditional taste without compromising on quality.',
    name: 'Ravi Teja',
    place: 'Gachibowli',
  },
  {
    quote:
      'The ghee and homemade sweets were excellent. You can genuinely taste the care that goes into every batch.',
    name: 'Venkatesh Murthy',
    place: 'Banjara Hills',
  },
];

export function HomePage() {
  const navigate = useNavigate();

  const { isLoggedIn, setIsAuthModalOpen } = useAuth();

  const {
    addToCart,
    setIsCartOpen,
  } = useCart();

  const [products, setProducts] =
    useState<Product[]>(fallbackProducts);

  const [categories, setCategories] =
    useState<Category[]>(fallbackCategories);

  const [selectedProduct, setSelectedProduct] =
    useState<Product | null>(null);

  const [isCheckoutOpen, setIsCheckoutOpen] =
    useState(false);

  const [pendingCheckout, setPendingCheckout] =
    useState(false);

  const [trackingOrder, setTrackingOrder] =
    useState<Order | null>(null);

  const [trackingWAUrl, setTrackingWAUrl] =
    useState<string | undefined>();

  const [isCardModalOpen, setIsCardModalOpen] =
    useState(false);

  useEffect(() => {
    const loadStore = async () => {
      try {
        const [apiProducts, apiCategories] =
          await Promise.all([
            fetchProducts(),
            fetchCategories(),
          ]);

        if (apiProducts?.length) {
          setProducts(apiProducts);
        }

        if (apiCategories?.length) {
          setCategories(apiCategories);
        }
      } catch {
        // Fallback catalog remains available.
      }
    };

    loadStore();
  }, []);

  useEffect(() => {
    if (isLoggedIn && pendingCheckout) {
      setPendingCheckout(false);
      setIsCheckoutOpen(true);
    }
  }, [isLoggedIn, pendingCheckout]);

  const featuredProducts = useMemo(
    () =>
      products
        .filter(
          (product) =>
            product.is_featured ||
            product.is_bestseller,
        )
        .slice(0, 8),
    [products],
  );

  const bestsellers = useMemo(() => {
    const featured = products.filter(
      (product) =>
        product.is_bestseller ||
        product.is_featured,
    );

    return (
      featured.length
        ? featured
        : products
    ).slice(0, 8);
  }, [products]);

  const categoryCards = categories.slice(0, 8);

  const handleBuyNow = (
    product: Product,
    variant: ProductVariant,
    quantity: number,
  ) => {
    addToCart(product, variant, quantity);
    setIsCartOpen(false);

    if (!isLoggedIn) {
      setPendingCheckout(true);
      setIsAuthModalOpen(true);
      return;
    }

    setIsCheckoutOpen(true);
  };

  const handleCategoryClick = (
    category: Category,
  ) => {
    navigate(`/category/${category.slug}`);
  };

  return (
    <div className="min-h-dvh bg-[#fbfaf6] text-[#1d281f]">
      <TopBar
        products={products}
        onSelectProduct={setSelectedProduct}
        isAdminView={false}
      />

      <main>
        {/* =====================================================
            HERO
        ===================================================== */}
        <section className="relative overflow-hidden bg-[#f3f0e7]">
          <div className="absolute -left-40 -top-40 h-[420px] w-[420px] rounded-full bg-[#dfe9dc]/60 blur-3xl" />

          <div className="absolute -bottom-40 -right-40 h-[480px] w-[480px] rounded-full bg-[#eadcc9]/50 blur-3xl" />

          <div className="relative mx-auto grid min-h-[650px] w-full max-w-[1440px] grid-cols-1 items-center gap-10 px-5 py-14 sm:px-8 lg:grid-cols-2 lg:px-12 lg:py-20 xl:px-16">
            <div className="order-2 max-w-[650px] lg:order-1">
              <div className="mb-5 inline-flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#b9652d]">
                <span className="h-2 w-2 rounded-full bg-[#b9652d]" />
                Homemade · Traditional · Authentic
              </div>

              <h1 className="font-['Playfair_Display',Georgia,serif] text-[clamp(48px,7vw,88px)] font-medium leading-[0.94] tracking-[-0.055em] text-[#243126]">
                A little taste
                <br />
                of{' '}
                <em className="not-italic text-[#285239]">
                  home.
                </em>
              </h1>

              <p className="mt-7 max-w-[560px] text-sm leading-7 text-[#687269] sm:text-[15px]">
                Discover authentic Telugu pickles,
                podis, ghee, oils, sweets and
                everyday favourites made with
                traditional recipes and genuine
                ingredients.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  to="/shop"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#285239] px-7 text-xs font-extrabold text-white transition hover:-translate-y-0.5 hover:bg-[#1f432e]"
                >
                  Shop the collection
                  <ArrowRight size={16} />
                </Link>

                <Link
                  to="/gifting"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-[#d5ddd4] bg-white/70 px-7 text-xs font-extrabold text-[#285239] transition hover:bg-white"
                >
                  Explore gifting
                </Link>
              </div>

              <div className="mt-9 grid grid-cols-3 gap-3 border-t border-[#d9ddd5] pt-6 sm:flex sm:flex-wrap sm:gap-7">
                <div className="flex items-center gap-2 text-[10px] font-bold text-[#687269]">
                  <Leaf
                    size={16}
                    className="text-[#285239]"
                  />
                  Traditional
                </div>

                <div className="flex items-center gap-2 text-[10px] font-bold text-[#687269]">
                  <Heart
                    size={16}
                    className="text-[#285239]"
                  />
                  Made with care
                </div>

                <div className="flex items-center gap-2 text-[10px] font-bold text-[#687269]">
                  <ShieldCheck
                    size={16}
                    className="text-[#285239]"
                  />
                  Quality first
                </div>
              </div>
            </div>

            <div className="relative order-1 mx-auto w-full max-w-[620px] lg:order-2">
              <div className="relative aspect-[0.9] overflow-hidden rounded-[45%_45%_24px_24px] shadow-[0_35px_90px_rgba(36,49,38,0.18)] sm:rounded-[48%_48%_30px_30px]">
                <img
                  src={
                    products[0]?.images?.[0] ||
                    HERO_IMAGE
                  }
                  alt="Traditional ManaDeshi food"
                  className="h-full w-full object-cover"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />
              </div>

              <div className="absolute -left-2 top-10 rounded-2xl bg-white/95 px-4 py-3 shadow-xl backdrop-blur sm:-left-5">
                <div className="flex items-center gap-2.5">
                  <Sparkles
                    size={17}
                    className="text-[#285239]"
                  />

                  <div>
                    <p className="text-[10px] font-extrabold text-[#263128]">
                      Small batch
                    </p>

                    <p className="mt-0.5 text-[9px] text-[#7a837c]">
                      Made fresh
                    </p>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-3 right-2 rounded-2xl bg-white/95 px-4 py-3 shadow-xl backdrop-blur sm:-right-5">
                <div className="flex items-center gap-2.5">
                  <Star
                    size={17}
                    fill="currentColor"
                    className="text-[#b9652d]"
                  />

                  <div>
                    <p className="text-[10px] font-extrabold text-[#263128]">
                      Loved locally
                    </p>

                    <p className="mt-0.5 text-[9px] text-[#7a837c]">
                      Hyderabad kitchens
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            INTRO / VALUES
        ===================================================== */}
        <section className="bg-white">
          <div className="mx-auto grid w-full max-w-[1240px] grid-cols-1 gap-8 px-5 py-20 sm:px-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:gap-20 lg:py-28">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#b9652d]">
                The ManaDeshi way
              </span>

              <h2 className="mt-3 font-['Playfair_Display',Georgia,serif] text-[clamp(38px,5vw,62px)] leading-none tracking-[-0.05em] text-[#243126]">
                Food that feels
                <br />
                <em className="not-italic text-[#285239]">
                  familiar.
                </em>
              </h2>
            </div>

            <div>
              <p className="max-w-[650px] text-[15px] leading-8 text-[#69736b]">
                We believe the best food doesn't
                need to be complicated. Good
                ingredients, time-tested recipes
                and a little care can bring back
                the taste of home.
              </p>

              <Link
                to="/our-story"
                className="mt-6 inline-flex items-center gap-2 text-xs font-extrabold text-[#285239]"
              >
                Discover our story
                <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </section>

        {/* =====================================================
            CATEGORY DISCOVERY
        ===================================================== */}
        <section className="bg-[#f3f0e7] py-20 sm:py-24 lg:py-28">
          <div className="mx-auto w-full max-w-[1440px] px-5 sm:px-8 lg:px-12">
            <div className="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#b9652d]">
                  Explore our kitchen
                </span>

                <h2 className="mt-2 font-['Playfair_Display',Georgia,serif] text-[clamp(36px,5vw,56px)] leading-none tracking-[-0.05em] text-[#243126]">
                  Shop by category
                </h2>

                <p className="mt-3 text-sm text-[#737c75]">
                  Start with what you're craving.
                </p>
              </div>

              <Link
                to="/shop"
                className="inline-flex items-center gap-2 text-xs font-extrabold text-[#285239]"
              >
                View everything
                <ArrowRight size={15} />
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 lg:gap-4">
              {categoryCards.map(
                (category, index) => (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() =>
                      handleCategoryClick(category)
                    }
                    className="group relative aspect-[0.82] overflow-hidden rounded-2xl text-left sm:aspect-[0.9]"
                  >
                    <img
                      src={
                        CATEGORY_IMAGES[
                          index %
                            CATEGORY_IMAGES.length
                        ]
                      }
                      alt={category.name}
                      loading="lazy"
                      className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />

                    <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
                      <p className="text-[8px] font-bold uppercase tracking-[0.15em] text-white/65">
                        Explore
                      </p>

                      <h3 className="mt-1 font-['Playfair_Display',Georgia,serif] text-lg leading-tight text-white sm:text-xl">
                        {category.name}
                      </h3>

                      <span className="mt-2 inline-flex items-center text-white/80">
                        <ChevronRight size={16} />
                      </span>
                    </div>
                  </button>
                ),
              )}
            </div>
          </div>
        </section>

        {/* =====================================================
            FEATURED PRODUCTS
        ===================================================== */}
        <section className="bg-white py-20 sm:py-24 lg:py-28">
          <div className="mx-auto w-full max-w-[1440px] px-5 sm:px-8 lg:px-12">
            <div className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#b9652d]">
                  Made for your pantry
                </span>

                <h2 className="mt-2 font-['Playfair_Display',Georgia,serif] text-[clamp(36px,5vw,56px)] leading-none tracking-[-0.05em] text-[#243126]">
                  Customer favourites
                </h2>
              </div>

              <Link
                to="/shop"
                className="inline-flex items-center gap-2 text-xs font-extrabold text-[#285239]"
              >
                Shop all
                <ArrowRight size={15} />
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">
              {(featuredProducts.length
                ? featuredProducts
                : bestsellers
              )
                .slice(0, 8)
                .map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onOpenDetail={setSelectedProduct}
                  />
                ))}
            </div>
          </div>
        </section>

        {/* =====================================================
            GIFTING BANNER
        ===================================================== */}
        <section className="bg-[#285239] text-white">
          <div className="mx-auto grid w-full max-w-[1440px] grid-cols-1 items-center gap-10 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-2 lg:px-12 lg:py-24">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#e4b184]">
                Gifting, the ManaDeshi way
              </span>

              <h2 className="mt-3 max-w-[650px] font-['Playfair_Display',Georgia,serif] text-[clamp(40px,5vw,65px)] leading-[0.98] tracking-[-0.05em]">
                Give a little
                <br />
                taste of home.
              </h2>

              <p className="mt-6 max-w-[550px] text-sm leading-7 text-white/70">
                Thoughtfully curated food gifts
                for festivals, celebrations,
                clients, teams and the people
                who matter most.
              </p>

              <Link
                to="/gifting"
                className="mt-7 inline-flex min-h-12 items-center gap-2 rounded-full bg-white px-6 text-xs font-extrabold text-[#285239] transition hover:-translate-y-0.5"
              >
                Explore gifting
                <ArrowRight size={16} />
              </Link>
            </div>

            <div className="relative mx-auto w-full max-w-[580px]">
              <div className="aspect-[1.2] overflow-hidden rounded-[2rem]">
                <img
                  src="https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=1200&q=90"
                  alt="ManaDeshi gifting"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            WHY MANADESHI
        ===================================================== */}
        <section className="bg-[#fbfaf6] py-20 sm:py-24 lg:py-28">
          <div className="mx-auto w-full max-w-[1240px] px-5 sm:px-8">
            <div className="mx-auto max-w-[700px] text-center">
              <span className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#b9652d]">
                Why ManaDeshi
              </span>

              <h2 className="mt-3 font-['Playfair_Display',Georgia,serif] text-[clamp(38px,5vw,58px)] leading-none tracking-[-0.05em] text-[#243126]">
                Simple ingredients.
                <br />
                <em className="not-italic text-[#285239]">
                  Honest food.
                </em>
              </h2>
            </div>

            <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  icon: Leaf,
                  title: 'Traditional recipes',
                  text: 'Recipes inspired by the flavours we grew up with.',
                },
                {
                  icon: ShieldCheck,
                  title: 'Quality ingredients',
                  text: 'Thoughtfully selected ingredients for everyday food.',
                },
                {
                  icon: Sparkles,
                  title: 'Small batches',
                  text: 'Made with attention instead of mass production.',
                },
                {
                  icon: Truck,
                  title: 'Hyderabad delivery',
                  text: 'Fresh orders delivered conveniently to your doorstep.',
                },
              ].map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.title}
                    className="rounded-2xl border border-[#e7e3d9] bg-white p-6 sm:p-7"
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#edf4ee] text-[#285239]">
                      <Icon size={20} />
                    </div>

                    <h3 className="mt-5 text-sm font-extrabold text-[#29342c]">
                      {item.title}
                    </h3>

                    <p className="mt-2 text-xs leading-6 text-[#788178]">
                      {item.text}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* =====================================================
            REVIEWS
        ===================================================== */}
        <section className="bg-white py-20 sm:py-24">
          <div className="mx-auto w-full max-w-[1240px] px-5 sm:px-8">
            <div className="text-center">
              <span className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#b9652d]">
                From our customers
              </span>

              <h2 className="mt-3 font-['Playfair_Display',Georgia,serif] text-[clamp(38px,5vw,55px)] leading-none tracking-[-0.05em] text-[#243126]">
                Loved like home.
              </h2>
            </div>

            <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-3">
              {REVIEWS.map((review) => (
                <article
                  key={review.name}
                  className="rounded-2xl bg-[#f5f2ea] p-6 sm:p-8"
                >
                  <div className="flex gap-1 text-[#b9652d]">
                    {[1, 2, 3, 4, 5].map(
                      (star) => (
                        <Star
                          key={star}
                          size={13}
                          fill="currentColor"
                        />
                      ),
                    )}
                  </div>

                  <p className="mt-6 font-['Playfair_Display',Georgia,serif] text-lg leading-7 text-[#344037]">
                    “{review.quote}”
                  </p>

                  <div className="mt-7 border-t border-[#dfdacd] pt-4">
                    <p className="text-xs font-extrabold text-[#29342c]">
                      {review.name}
                    </p>

                    <p className="mt-1 text-[10px] text-[#7c847d]">
                      {review.place}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* =====================================================
            SERVICE STRIP
        ===================================================== */}
        <section className="bg-[#f3f0e7]">
          <div className="mx-auto grid w-full max-w-[1240px] grid-cols-1 divide-y divide-[#ddd8cc] px-5 sm:grid-cols-2 sm:px-8 sm:divide-x sm:divide-y-0 lg:grid-cols-4">
            {[
              {
                icon: Truck,
                title: 'Fast delivery',
                text: 'Convenient Hyderabad delivery',
              },
              {
                icon: ShieldCheck,
                title: 'Quality assured',
                text: 'Carefully selected products',
              },
              {
                icon: Clock,
                title: 'Fresh batches',
                text: 'Prepared with attention',
              },
              {
                icon: Heart,
                title: 'Made with care',
                text: 'Inspired by our homes',
              },
            ].map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="flex items-center gap-4 px-4 py-7 sm:px-6 lg:px-7"
                >
                  <Icon
                    size={22}
                    className="shrink-0 text-[#285239]"
                  />

                  <div>
                    <p className="text-xs font-extrabold text-[#29342c]">
                      {item.title}
                    </p>

                    <p className="mt-1 text-[10px] text-[#7a837c]">
                      {item.text}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* =====================================================
            FINAL CTA
        ===================================================== */}
        <section className="bg-[#fbfaf6] px-5 py-20 sm:px-8 sm:py-28">
          <div className="mx-auto max-w-[900px] text-center">
            <span className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#b9652d]">
              Bring home something special
            </span>

            <h2 className="mt-4 font-['Playfair_Display',Georgia,serif] text-[clamp(42px,6vw,72px)] leading-[0.95] tracking-[-0.055em] text-[#243126]">
              Your next favourite
              <br />
              might taste like{' '}
              <em className="not-italic text-[#285239]">
                home.
              </em>
            </h2>

            <p className="mx-auto mt-6 max-w-[560px] text-sm leading-7 text-[#727b73]">
              Explore our collection of traditional
              favourites, everyday essentials and
              thoughtful gifts.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                to="/shop"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#285239] px-7 text-xs font-extrabold text-white hover:bg-[#1f432e]"
              >
                Start shopping
                <ShoppingBag size={16} />
              </Link>

              <Link
                to="/our-story"
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-[#d9ddd5] bg-white px-7 text-xs font-extrabold text-[#285239]"
              >
                Our story
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer
        onOpenCardModal={() =>
          setIsCardModalOpen(true)
        }
      />

      {/* Product detail */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() =>
          setSelectedProduct(null)
        }
        onBuyNow={handleBuyNow}
      />

      {/* Checkout */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() =>
          setIsCheckoutOpen(false)
        }
        onOrderSuccess={(order, whatsappUrl) => {
          setIsCheckoutOpen(false);
          setTrackingOrder(order);
          setTrackingWAUrl(whatsappUrl);
        }}
      />

      {/* Order tracking */}
      <OrderTrackingModal
        order={trackingOrder}
        onClose={() =>
          setTrackingOrder(null)
        }
        whatsappUrl={trackingWAUrl}
      />

      {/* Visiting card */}
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