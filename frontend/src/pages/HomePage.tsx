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
import { ProductCard } from '../components/ProductCard';
import { ProductDetailModal } from '../components/ProductDetailModal';
import { CheckoutModal } from '../components/CheckoutModal';
import { OrderTrackingModal } from '../components/OrderTrackingModal';
import { VisitingCardModal } from '../components/VisitingCardModal';
import { WhatsAppFloatingWidget } from '../components/WhatsAppFloatingWidget';
import { Footer } from '../components/Footer';

import { fetchProducts, fetchCategories } from '../services/api';

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
  const { isLoggedIn, setIsAuthModalOpen } = useAuth();

  const {
    addToCart,
    setIsCartOpen,
  } = useCart();

  const [categories, setCategories] = useState<Category[]>(
    fallbackCategories,
  );

  const [products, setProducts] = useState<Product[]>(
    fallbackProducts,
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
        (cat) => cat.slug === selectedCategory,
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
    quantity: number,
  ) => {
    addToCart(product, variant, quantity);
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
    <div className="flex min-h-[100dvh] flex-col bg-white text-[#1c241d]">
      <TopBar
        products={products}
        onSelectProduct={setSelectedProduct}
        isAdminView={false}
      />

      <main className="flex-1">
        {/* HERO */}
        <section
          id="home"
          className="relative flex min-h-[720px] items-center overflow-hidden bg-[radial-gradient(circle_at_78%_35%,#e9f1e8_0,transparent_31%),linear-gradient(135deg,#fcfcf9,#f4f7f2)] max-[680px]:min-h-0"
        >
          <div className="pointer-events-none absolute -left-[220px] -top-[180px] h-[420px] w-[420px] rounded-full bg-[rgba(208,225,210,.35)]" />

          <div className="pointer-events-none absolute -bottom-[350px] -right-[300px] h-[520px] w-[520px] rounded-full bg-[rgba(233,221,201,.3)]" />

          <div className="mx-auto grid min-h-[720px] w-[min(calc(100%-48px),1240px)] grid-cols-[minmax(0,.9fr)_minmax(0,1.1fr)] items-center gap-[75px] py-[50px] pb-[65px] max-[1180px]:gap-[45px] max-[960px]:w-[calc(100%-36px)] max-[960px]:grid-cols-1 max-[960px]:gap-[45px] max-[960px]:pt-[70px] max-[680px]:min-h-0 max-[680px]:w-[calc(100%-28px)] max-[680px]:py-[70px]">
            <div className="relative z-[2] max-[960px]:text-center">
              <div className="mb-[23px] inline-flex items-center gap-2 text-[9px] font-extrabold uppercase tracking-[.15em] text-[var(--md-orange)] max-[960px]:justify-center">
                <span className="h-[7px] w-[7px] rounded-full bg-[var(--md-orange)]" />
                Homemade · Traditional · Hyderabad
              </div>

              <h1 className="m-0 font-['Playfair_Display',serif] text-[clamp(48px,6vw,82px)] leading-[.98] tracking-[-.055em] text-[#1c241d] max-[680px]:text-[clamp(44px,13vw,65px)]">
                A little taste
                <br />
                of <em className="not-italic text-[var(--md-green)]">home.</em>
              </h1>

              <p className="mt-[27px] max-w-[570px] text-[14px] leading-[1.85] text-[var(--md-muted)] max-[960px]:mx-auto max-[680px]:text-[13px] max-[680px]:leading-[1.75]">
                Authentic Telugu pickles, podis, ghee, cold-pressed oils,
                sweets and everyday favourites — made with traditional
                recipes and genuine ingredients.
              </p>

              <div className="mt-[30px] flex items-center gap-3 max-[960px]:justify-center max-[680px]:w-full max-[680px]:flex-col">
                <button
                  className="inline-flex min-h-[47px] items-center justify-center gap-[9px] rounded-full border border-[var(--md-green)] bg-[var(--md-green)] px-[19px] text-[11px] font-extrabold text-white transition-transform duration-200 hover:-translate-y-0.5 hover:bg-[var(--md-green-dark)] max-[680px]:w-full"
                  onClick={() => scrollTo('shop')}
                >
                  Shop our collection
                  <ArrowRight size={17} />
                </button>

                <button
                  className="inline-flex min-h-[47px] items-center justify-center gap-[9px] rounded-full border border-[#dbe4dc] bg-[rgba(255,255,255,.7)] px-[19px] text-[11px] font-extrabold text-[var(--md-green)] transition-transform duration-200 max-[680px]:w-full"
                  onClick={() => scrollTo('story')}
                >
                  Our story
                </button>
              </div>

              <div className="mt-[38px] flex flex-wrap gap-[17px] max-[960px]:justify-center max-[680px]:gap-[11px] max-[680px]:[&>span]:text-[7px] max-[390px]:gap-2 [&>span]:flex [&>span]:items-center [&>span]:gap-[6px] [&>span]:whitespace-nowrap [&>span]:text-[9px] [&>span]:font-bold [&>span]:text-[#778178]">
                <span>
                  <Leaf size={14} className="text-[var(--md-green)]" />
                  Traditional recipes
                </span>

                <span>
                  <Heart size={14} className="text-[var(--md-green)]" />
                  Made with care
                </span>

                <span>
                  <ShieldCheck size={14} className="text-[var(--md-green)]" />
                  Quality ingredients
                </span>
              </div>
            </div>

            <div className="relative h-[580px] max-[960px]:mx-auto max-[960px]:w-[min(620px,100%)] max-[680px]:h-[420px]">
              <div className="absolute inset-[15px_25px_20px_45px] overflow-hidden rounded-[260px_260px_28px_28px] shadow-[0_35px_80px_rgba(28,57,37,.16)] after:absolute after:inset-0 after:bg-[linear-gradient(180deg,transparent_50%,rgba(11,28,17,.18))] after:content-[''] animate-[hero-image-float_7s_ease-in-out_infinite] max-[680px]:inset-[10px_12px_15px] max-[680px]:rounded-[170px_170px_20px_20px]">
                <img
                  className="h-full w-full object-cover"
                  src={
                    products[0]?.images?.[0] ||
                    'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=1200&q=90'
                  }
                  alt="ManaDeshi homemade food"
                />
              </div>

              <div className="absolute left-[-10px] top-[80px] z-[3] flex animate-[card-float_5s_ease-in-out_infinite] items-center gap-2.5 rounded-[14px] bg-[rgba(255,255,255,.94)] px-[15px] py-3 shadow-[0_18px_45px_rgba(20,45,28,.13)] backdrop-blur-[12px] [&>svg]:text-[var(--md-green)] max-[680px]:left-0 max-[680px]:top-[45px] max-[680px]:px-[11px] max-[680px]:py-[9px]">
                <Sparkles size={16} className="text-[var(--md-green)]" />

                <div className="flex flex-col gap-[3px]">
                  <strong className="text-[9px] text-[#263029]">
                    Small batch
                  </strong>

                  <span className="text-[8px] text-[#7d8780]">
                    Made fresh
                  </span>
                </div>
              </div>

              <div className="absolute bottom-[70px] right-[-5px] z-[3] flex animate-[card-float_5s_ease-in-out_infinite] items-center gap-2.5 rounded-[14px] bg-[rgba(255,255,255,.94)] px-[15px] py-3 shadow-[0_18px_45px_rgba(20,45,28,.13)] backdrop-blur-[12px] [&>svg]:text-[var(--md-green)] [animation-delay:-2s] max-[680px]:right-0 max-[680px]:bottom-[35px] max-[680px]:px-[11px] max-[680px]:py-[9px]">
                <Star
                  size={15}
                  className="text-[var(--md-green)]"
                  fill="currentColor"
                />

                <div className="flex flex-col gap-[3px]">
                  <strong className="text-[9px] text-[#263029]">
                    Loved locally
                  </strong>

                  <span className="text-[8px] text-[#7d8780]">
                    Hyderabad kitchens
                  </span>
                </div>
              </div>
            </div>
          </div>

          <button
            className="absolute bottom-[22px] left-1/2 flex -translate-x-1/2 items-center gap-2 border-0 bg-transparent text-[8px] font-bold uppercase tracking-[.12em] text-[#89928b] max-[680px]:hidden"
            onClick={() => scrollTo('categories')}
          >
            <span className="relative h-[26px] w-[17px] rounded-[20px] border border-[#b9c3bb] after:absolute after:left-1/2 after:top-[5px] after:h-[6px] after:w-[3px] after:-translate-x-1/2 after:animate-[scroll-dot_1.7s_infinite] after:rounded-[99px] after:bg-[var(--md-green)] after:content-['']" />
            Explore
          </button>
        </section>

        {/* INTRO */}
        <section
          id="why-us"
          className="bg-white py-[100px] max-[680px]:py-[75px]"
        >
          <div className="mx-auto grid w-[min(calc(100%-48px),1240px)] grid-cols-[.9fr_1.1fr] items-center gap-[100px] max-[960px]:w-[calc(100%-36px)] max-[960px]:grid-cols-1 max-[960px]:gap-[30px] max-[680px]:w-[calc(100%-28px)]">
            <div>
              <span className="text-[9px] font-extrabold uppercase tracking-[.16em] text-[var(--md-orange)]">
                Welcome to ManaDeshi
              </span>

              <h2 className="mt-[9px] font-['Playfair_Display',serif] text-[clamp(38px,5vw,60px)] leading-none tracking-[-.05em] max-[680px]:text-[43px]">
                Food that feels
                <br />
                <em className="not-italic text-[var(--md-green)]">
                  familiar.
                </em>
              </h2>
            </div>

            <p className="max-w-[590px] text-[16px] leading-[1.9] text-[var(--md-muted)]">
              We believe the best food doesn't need to be complicated.
              Good ingredients, time-tested recipes and a little love can
              bring back the taste of home.
            </p>
          </div>
        </section>

        {/* CATEGORIES */}
        <section
          id="categories"
          className="bg-[var(--md-cream)] py-[110px] max-[680px]:py-[75px]"
        >
          <div className="mx-auto w-[min(calc(100%-48px),1240px)] max-[960px]:w-[calc(100%-36px)] max-[680px]:w-[calc(100%-28px)]">
            <div className="mb-[42px] flex items-end justify-between gap-[30px] max-[680px]:mb-[30px] max-[680px]:flex-col max-[680px]:items-start">
              <div>
                <span className="text-[9px] font-extrabold uppercase tracking-[.16em] text-[var(--md-orange)]">
                  Explore our kitchen
                </span>

                <h2 className="mt-2 font-['Playfair_Display',serif] text-[clamp(34px,4vw,50px)] leading-none tracking-[-.045em] max-[680px]:text-[35px]">
                  Shop by category
                </h2>

                <p className="mt-2.5 text-[12px] text-[var(--md-muted)]">
                  Start with what you're craving.
                </p>
              </div>

              <button
                className="inline-flex items-center gap-[7px] whitespace-nowrap border-0 bg-transparent p-0 text-[10px] font-extrabold text-[var(--md-green)] hover:underline hover:decoration-1 hover:underline-offset-[5px]"
                onClick={() => scrollTo('shop')}
              >
                View all products
                <ArrowRight size={16} />
              </button>
            </div>

            <div className="grid grid-cols-4 gap-[17px] max-[1180px]:grid-cols-3 max-[680px]:grid-cols-2 max-[680px]:gap-2.5">
              {categories.slice(0, 8).map((category, index) => (
                <button
                  key={category.id}
                  className="group relative h-[290px] overflow-hidden rounded-[18px] border-0 bg-[#ddd] p-0 text-left max-[680px]:h-[220px] max-[680px]:rounded-[13px] max-[390px]:h-[200px]"
                  onClick={() => {
                    setSelectedCategory(category.slug);
                    scrollTo('shop');
                  }}
                >
                  <div className="absolute inset-0 after:absolute after:inset-0 after:bg-[linear-gradient(180deg,transparent_30%,rgba(10,22,13,.75))]">
                    <img
                      className="h-full w-full object-cover transition-transform duration-[600ms] group-hover:scale-[1.07]"
                      src={
                        CATEGORY_IMAGES[
                          index % CATEGORY_IMAGES.length
                        ]
                      }
                      alt={category.name}
                      loading="lazy"
                    />
                  </div>

                  <div className="absolute bottom-[18px] left-5 right-5 z-[2] text-white max-[680px]:bottom-[14px] max-[680px]:left-[14px] max-[680px]:right-[14px]">
                    <span className="text-[8px] uppercase tracking-[.13em] opacity-70">
                      Explore
                    </span>

                    <h3 className="my-[6px] mb-[9px] font-['Playfair_Display',serif] text-[21px] leading-[1.05] max-[680px]:text-[17px]">
                      {category.name
                        .split('(')[0]
                        .trim()}
                    </h3>

                    <ChevronRight
                      className="opacity-80"
                      size={18}
                    />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* BENEFITS */}
        <section className="bg-[var(--md-green)] text-white">
          <div className="mx-auto grid w-[min(calc(100%-48px),1240px)] grid-cols-4 max-[960px]:w-[calc(100%-36px)] max-[960px]:grid-cols-2 max-[680px]:w-[calc(100%-28px)] max-[680px]:grid-cols-1">
            <div className="flex min-h-[130px] items-center gap-[13px] border-r border-[rgba(255,255,255,.12)] p-[25px] last:border-r-0 max-[960px]:nth-[2]:border-r-0 max-[960px]:nth-[-n+2]:border-b max-[680px]:min-h-[95px] max-[680px]:border-r-0 max-[680px]:border-b">
              <div className="grid h-[45px] w-[45px] shrink-0 place-items-center rounded-full bg-[rgba(255,255,255,.1)]">
                <Leaf size={22} />
              </div>

              <span className="flex flex-col gap-1 text-[9px] leading-[1.5] text-[rgba(255,255,255,.62)]">
                <strong className="text-[10px] text-white">
                  Real ingredients
                </strong>
                Carefully selected ingredients.
              </span>
            </div>

            <div className="flex min-h-[130px] items-center gap-[13px] border-r border-[rgba(255,255,255,.12)] p-[25px] last:border-r-0 max-[960px]:nth-[2]:border-r-0 max-[960px]:nth-[-n+2]:border-b max-[680px]:min-h-[95px] max-[680px]:border-r-0 max-[680px]:border-b">
              <div className="grid h-[45px] w-[45px] shrink-0 place-items-center rounded-full bg-[rgba(255,255,255,.1)]">
                <Heart size={22} />
              </div>

              <span className="flex flex-col gap-1 text-[9px] leading-[1.5] text-[rgba(255,255,255,.62)]">
                <strong className="text-[10px] text-white">
                  Made with care
                </strong>
                Traditional preparation methods.
              </span>
            </div>

            <div className="flex min-h-[130px] items-center gap-[13px] border-r border-[rgba(255,255,255,.12)] p-[25px] last:border-r-0 max-[960px]:nth-[2]:border-r-0 max-[960px]:nth-[-n+2]:border-b max-[680px]:min-h-[95px] max-[680px]:border-r-0 max-[680px]:border-b">
              <div className="grid h-[45px] w-[45px] shrink-0 place-items-center rounded-full bg-[rgba(255,255,255,.1)]">
                <ShieldCheck size={22} />
              </div>

              <span className="flex flex-col gap-1 text-[9px] leading-[1.5] text-[rgba(255,255,255,.62)]">
                <strong className="text-[10px] text-white">
                  Quality first
                </strong>
                Every product checked with care.
              </span>
            </div>

            <div className="flex min-h-[130px] items-center gap-[13px] border-r border-[rgba(255,255,255,.12)] p-[25px] last:border-r-0 max-[960px]:nth-[2]:border-r-0 max-[960px]:nth-[-n+2]:border-b max-[680px]:min-h-[95px] max-[680px]:border-r-0 max-[680px]:border-b max-[680px]:last:border-b-0">
              <div className="grid h-[45px] w-[45px] shrink-0 place-items-center rounded-full bg-[rgba(255,255,255,.1)]">
                <Truck size={22} />
              </div>

              <span className="flex flex-col gap-1 text-[9px] leading-[1.5] text-[rgba(255,255,255,.62)]">
                <strong className="text-[10px] text-white">
                  Delivered fresh
                </strong>
                From our kitchen to your home.
              </span>
            </div>
          </div>
        </section>

        {/* CUSTOMER FAVOURITES */}
        <section
          id="shop"
          ref={catalogRef}
          className="bg-white py-[110px] max-[680px]:py-[75px]"
        >
          <div className="mx-auto w-[min(calc(100%-48px),1240px)] max-[960px]:w-[calc(100%-36px)] max-[680px]:w-[calc(100%-28px)]">
            <div className="mb-[42px] flex items-end justify-between gap-[30px] max-[680px]:mb-[30px] max-[680px]:flex-col max-[680px]:items-start">
              <div>
                <span className="text-[9px] font-extrabold uppercase tracking-[.16em] text-[var(--md-orange)]">
                  From our kitchen
                </span>

                <h2 className="mt-2 font-['Playfair_Display',serif] text-[clamp(34px,4vw,50px)] leading-none tracking-[-.045em] max-[680px]:text-[35px]">
                  Customer favourites
                </h2>

                <p className="mt-2.5 text-[12px] text-[var(--md-muted)]">
                  Discover the products people keep coming back for.
                </p>
              </div>

              <button
                className="inline-flex items-center gap-[7px] whitespace-nowrap border-0 bg-transparent p-0 text-[10px] font-extrabold text-[var(--md-green)] hover:underline hover:underline-offset-[5px]"
                onClick={() => scrollTo('all-products')}
              >
                Browse everything
                <ArrowRight size={16} />
              </button>
            </div>

            <div className="grid grid-cols-4 gap-x-[17px] gap-y-[22px] max-[1180px]:grid-cols-3 max-[680px]:grid-cols-2 max-[680px]:gap-x-[9px] max-[680px]:gap-y-3 max-[390px]:gap-x-[7px] max-[390px]:gap-y-[9px]">
              {products.slice(0, 8).map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onOpenDetail={setSelectedProduct}
                />
              ))}
            </div>
          </div>
        </section>

        {/* STORY */}
        <section
          id="story"
          className="bg-[var(--md-cream)] py-[120px] max-[680px]:py-[75px]"
        >
          <div className="mx-auto grid w-[min(calc(100%-48px),1240px)] grid-cols-[1fr_.85fr] items-center gap-[100px] max-[960px]:w-[calc(100%-36px)] max-[960px]:grid-cols-1 max-[960px]:gap-[70px] max-[680px]:w-[calc(100%-28px)]">
            <div className="relative min-h-[600px] max-w-[700px] max-[960px]:mx-auto max-[960px]:w-full max-[680px]:min-h-[440px]">
              <div className="absolute left-0 top-0 h-[520px] w-[78%] overflow-hidden rounded-[22px] max-[680px]:h-[370px] max-[680px]:w-[83%]">
                <img
                  className="h-full w-full object-cover"
                  src={
                    products[1]?.images?.[0] ||
                    CATEGORY_IMAGES[2]
                  }
                  alt="Traditional food"
                  loading="lazy"
                />
              </div>

              <div className="absolute bottom-0 right-0 h-[250px] w-[43%] overflow-hidden rounded-[20px] border-[8px] border-[var(--md-cream)] max-[680px]:h-[190px] max-[680px]:w-[45%] max-[680px]:border-[5px]">
                <img
                  className="h-full w-full object-cover"
                  src={
                    products[2]?.images?.[0] ||
                    CATEGORY_IMAGES[0]
                  }
                  alt="Traditional ingredients"
                  loading="lazy"
                />
              </div>

              <div className="absolute bottom-[45px] left-[25px] flex items-center gap-2.5 rounded-[14px] bg-white px-4 py-[13px] shadow-[0_18px_45px_rgba(20,45,28,.12)] max-[680px]:bottom-[30px] max-[680px]:left-2.5">
                <Clock
                  size={17}
                  className="text-[var(--md-orange)]"
                />

                <div className="flex flex-col gap-[3px]">
                  <strong className="text-[10px]">
                    Made traditionally
                  </strong>

                  <span className="text-[8px] text-[#87918a]">
                    One batch at a time
                  </span>
                </div>
              </div>
            </div>

            <div className="max-[960px]:text-center">
              <span className="text-[9px] font-extrabold uppercase tracking-[.16em] text-[var(--md-orange)]">
                Our story
              </span>

              <h2 className="my-[10px] mb-[26px] max-w-[540px] font-['Playfair_Display',serif] text-[clamp(39px,5vw,62px)] leading-none tracking-[-.055em] max-[680px]:mx-auto max-[680px]:text-[43px]">
                Bringing the{' '}
                <em className="not-italic text-[var(--md-green)]">
                  taste of home
                </em>{' '}
                back to the table.
              </h2>

              <p className="mb-[15px] max-w-[520px] text-[13px] leading-[1.9] text-[var(--md-muted)] max-[960px]:mx-auto">
                ManaDeshi Dukaan was born from a love for the food we grew up eating.
              </p>

              <p className="mb-[15px] max-w-[520px] text-[13px] leading-[1.9] text-[var(--md-muted)] max-[960px]:mx-auto">
                From Andhra pickles and podis to ghee, oils, sweets and traditional favourites,
                our collection celebrates simple food made the way it should be.
              </p>

              <p className="mb-[15px] max-w-[520px] text-[13px] leading-[1.9] text-[var(--md-muted)] max-[960px]:mx-auto">
                No unnecessary complexity. Just honest ingredients, familiar recipes and food made with care.
              </p>

              <button
                className="mt-[15px] inline-flex min-h-[47px] items-center justify-center gap-[9px] rounded-full border border-[var(--md-green)] bg-[var(--md-green)] px-[19px] text-[11px] font-extrabold text-white transition-transform duration-200 hover:-translate-y-0.5 hover:bg-[var(--md-green-dark)] max-[680px]:w-full"
                onClick={() => scrollTo('shop')}
              >
                Explore our foods
                <ArrowRight size={17} />
              </button>
            </div>
          </div>
        </section>

        {/* PROCESS */}
        <section className="bg-white py-[115px] max-[680px]:py-[75px]">
          <div className="mx-auto w-[min(calc(100%-48px),1240px)] max-[960px]:w-[calc(100%-36px)] max-[680px]:w-[calc(100%-28px)]">
            <div className="mb-[55px] text-center">
              <span className="text-[9px] font-extrabold uppercase tracking-[.16em] text-[var(--md-orange)]">
                The ManaDeshi way
              </span>

              <h2 className="mt-[9px] font-['Playfair_Display',serif] text-[clamp(35px,4vw,50px)] leading-none tracking-[-.045em]">
                From our kitchen
                <br />
                to yours.
              </h2>
            </div>

            <div className="grid grid-cols-4 border-y border-[var(--md-border)] max-[960px]:grid-cols-2 max-[680px]:grid-cols-1">
              <div className="border-r border-[var(--md-border)] px-[27px] py-9 last:border-r-0 max-[960px]:nth-[2]:border-r-0 max-[960px]:nth-[-n+2]:border-b max-[680px]:border-r-0 max-[680px]:border-b">
                <span className="mb-[26px] block text-[9px] font-extrabold text-[#a3aaa5]">
                  01
                </span>

                <Leaf size={24} className="text-[var(--md-green)]" />

                <h3 className="mt-[17px] mb-2 text-[13px]">
                  Choose good ingredients
                </h3>

                <p className="text-[10px] leading-[1.7] text-[var(--md-muted)]">
                  We start with ingredients we would proudly use in our own kitchen.
                </p>
              </div>

              <div className="border-r border-[var(--md-border)] px-[27px] py-9 last:border-r-0 max-[960px]:nth-[2]:border-r-0 max-[960px]:nth-[-n+2]:border-b max-[680px]:border-r-0 max-[680px]:border-b">
                <span className="mb-[26px] block text-[9px] font-extrabold text-[#a3aaa5]">
                  02
                </span>

                <Heart size={24} className="text-[var(--md-green)]" />

                <h3 className="mt-[17px] mb-2 text-[13px]">
                  Make it with care
                </h3>

                <p className="text-[10px] leading-[1.7] text-[var(--md-muted)]">
                  Traditional recipes and careful preparation.
                </p>
              </div>

              <div className="border-r border-[var(--md-border)] px-[27px] py-9 last:border-r-0 max-[960px]:nth-[2]:border-r-0 max-[960px]:nth-[-n+2]:border-b max-[680px]:border-r-0 max-[680px]:border-b">
                <span className="mb-[26px] block text-[9px] font-extrabold text-[#a3aaa5]">
                  03
                </span>

                <ShoppingBag size={24} className="text-[var(--md-green)]" />

                <h3 className="mt-[17px] mb-2 text-[13px]">
                  Pack it fresh
                </h3>

                <p className="text-[10px] leading-[1.7] text-[var(--md-muted)]">
                  Prepared and packed with freshness in mind.
                </p>
              </div>

              <div className="border-r border-[var(--md-border)] px-[27px] py-9 last:border-r-0 max-[960px]:nth-[2]:border-r-0 max-[960px]:nth-[-n+2]:border-b max-[680px]:border-r-0 max-[680px]:border-b max-[680px]:last:border-b-0">
                <span className="mb-[26px] block text-[9px] font-extrabold text-[#a3aaa5]">
                  04
                </span>

                <Truck size={24} className="text-[var(--md-green)]" />

                <h3 className="mt-[17px] mb-2 text-[13px]">
                  Deliver to you
                </h3>

                <p className="text-[10px] leading-[1.7] text-[var(--md-muted)]">
                  From ManaDeshi Dukaan directly to your doorstep.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* REVIEWS */}
        <section className="bg-[#f7f8f4] py-[110px] max-[680px]:py-[75px]">
          <div className="mx-auto w-[min(calc(100%-48px),1240px)] max-[960px]:w-[calc(100%-36px)] max-[680px]:w-[calc(100%-28px)]">
            <div className="mb-[55px] text-center">
              <span className="text-[9px] font-extrabold uppercase tracking-[.16em] text-[var(--md-orange)]">
                Customer love
              </span>

              <h2 className="mt-[9px] font-['Playfair_Display',serif] text-[clamp(35px,4vw,50px)] leading-none tracking-[-.045em] max-[680px]:text-[35px]">
                From Hyderabad kitchens.
              </h2>
            </div>

            <div className="grid grid-cols-3 gap-[18px] max-[680px]:grid-cols-1">
              {REVIEWS.map((review) => (
                <article
                  key={review.author}
                  className="rounded-[18px] border border-[var(--md-border)] bg-white p-[29px]"
                >
                  <div className="flex gap-0.5 text-[#bd7a36]">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <Star
                        key={index}
                        size={14}
                        fill="currentColor"
                      />
                    ))}
                  </div>

                  <p className="my-[22px] min-h-[100px] font-['Playfair_Display',serif] text-[17px] leading-[1.55] text-[#59635c] max-[680px]:min-h-0">
                    “{review.text}”
                  </p>

                  <strong className="block text-[10px]">
                    {review.author}
                  </strong>

                  <span className="mt-1 block text-[8px] text-[#89928c]">
                    {review.location}
                  </span>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ALL PRODUCTS */}
        <section
          id="all-products"
          className="bg-white py-[110px] max-[680px]:py-[75px]"
        >
          <div className="mx-auto w-[min(calc(100%-48px),1240px)] max-[960px]:w-[calc(100%-36px)] max-[680px]:w-[calc(100%-28px)]">
            <div className="mb-[42px] flex items-end justify-between gap-[30px] max-[680px]:mb-[30px] max-[680px]:flex-col max-[680px]:items-start">
              <div>
                <span className="text-[9px] font-extrabold uppercase tracking-[.16em] text-[var(--md-orange)]">
                  Browse the collection
                </span>

                <h2 className="mt-2 font-['Playfair_Display',serif] text-[clamp(34px,4vw,50px)] leading-none tracking-[-.045em] max-[680px]:text-[35px]">
                  All products
                </h2>
              </div>
            </div>

            <div className="mb-2 flex flex-nowrap items-center gap-2 overflow-x-auto py-2 pb-7 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <button
                className={`inline-flex items-center gap-[5px] whitespace-nowrap rounded-full border-[1.5px] border-[var(--border-mid)] bg-white px-[14px] py-[6px] text-[12.5px] font-bold text-[var(--text-dark)] transition-all hover:border-[var(--green)] hover:text-[var(--green)] ${
                  selectedCategory === 'all'
                    ? 'border-[var(--green)] bg-[var(--green)] text-white'
                    : ''
                }`}
                onClick={() => setSelectedCategory('all')}
              >
                All
              </button>

              {categories.map((category) => (
                <button
                  key={category.id}
                  className={`inline-flex items-center gap-[5px] whitespace-nowrap rounded-full border-[1.5px] border-[var(--border-mid)] bg-white px-[14px] py-[6px] text-[12.5px] font-bold text-[var(--text-dark)] transition-all hover:border-[var(--green)] hover:text-[var(--green)] ${
                    selectedCategory === category.slug
                      ? 'border-[var(--green)] bg-[var(--green)] text-white'
                      : ''
                  }`}
                  onClick={() =>
                    setSelectedCategory(category.slug)
                  }
                >
                  {category.name
                    .split('(')[0]
                    .trim()}
                </button>
              ))}

              <select
                className="ml-auto shrink-0 cursor-pointer rounded-[var(--radius-sm)] border-[1.5px] border-[var(--border-mid)] bg-white px-3 py-[6px] text-[12.5px] font-semibold text-[var(--text-dark)] outline-none focus:border-[var(--green)]"
                value={sortBy}
                onChange={(event) =>
                  setSortBy(event.target.value)
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
              <div className="grid grid-cols-4 gap-x-[17px] gap-y-[22px] max-[1180px]:grid-cols-3 max-[680px]:grid-cols-2 max-[680px]:gap-x-[9px] max-[680px]:gap-y-3 max-[390px]:gap-x-[7px] max-[390px]:gap-y-[9px]">
                {filtered.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onOpenDetail={setSelectedProduct}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3 px-6 py-16 text-center text-[var(--text-mid)]">
                <ShoppingBag size={36} />

                <p>
                  Nothing in this collection yet.
                </p>

                <button
                  className="inline-flex items-center justify-center gap-2 rounded-[var(--radius-sm)] border-0 bg-[var(--green)] px-6 py-3 text-sm font-bold text-white transition-all hover:bg-[var(--green-mid)]"
                  onClick={() =>
                    setSelectedCategory('all')
                  }
                >
                  Show all
                </button>
              </div>
            )}
          </div>
        </section>

        {/* FINAL CTA */}
        <section
          id="contact"
          className="bg-[linear-gradient(135deg,var(--md-green),var(--md-green-dark))] text-white"
        >
          <div className="mx-auto flex min-h-[400px] w-[min(calc(100%-48px),1240px)] items-center justify-between gap-[50px] max-[960px]:w-[calc(100%-36px)] max-[960px]:flex-col max-[960px]:items-start max-[960px]:justify-center max-[680px]:min-h-[430px] max-[680px]:w-[calc(100%-28px)]">
            <div>
              <span className="text-[9px] font-extrabold uppercase tracking-[.16em] text-[var(--md-orange)]">
                ManaDeshi Dukaan
              </span>

              <h2 className="my-[10px] mb-[14px] max-w-[650px] font-['Playfair_Display',serif] text-[clamp(42px,5vw,65px)] leading-none tracking-[-.055em] max-[680px]:text-[45px]">
                Bring a little{' '}
                <em className="not-italic text-[#a9c5ae]">
                  home
                </em>{' '}
                to your table.
              </h2>

              <p className="m-0 text-[12px] text-[rgba(255,255,255,.62)]">
                Traditional foods, thoughtfully made for everyday homes.
              </p>
            </div>

            <button
              className="inline-flex min-h-[47px] shrink-0 items-center justify-center gap-[9px] rounded-full border border-white bg-white px-[19px] text-[11px] font-extrabold text-[var(--md-green)] transition-transform duration-200 hover:-translate-y-0.5 hover:bg-[#edf4ee] max-[680px]:w-full"
              onClick={() => scrollTo('shop')}
            >
              Start shopping
              <ArrowRight size={17} />
            </button>
          </div>
        </section>

        <Footer
          onOpenCardModal={() => setIsCardModalOpen(true)}
        />
      </main>

      {/* MODALS */}
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

      <WhatsAppFloatingWidget />
    </div>
  );
}

export default HomePage;