import { useEffect, useMemo, useState } from 'react';

import {
  ArrowRight,
  Check,
  ChevronRight,
  Gift,
  Heart,
  Leaf,
  Mail,
  Package,
  Sparkles,
  Star,
  Truck,
} from 'lucide-react';

import { Link } from 'react-router-dom';

import { TopBar } from '../components/TopBar';
import { ProductCard } from '../components/ProductCard';
import { ProductDetailModal } from '../components/ProductDetailModal';
import { Footer } from '../components/Footer';

import { fetchProducts } from '../services/api';

import { fallbackProducts } from '../data/mockData';

import { Product } from '../types';

const GIFTING_HERO =
  'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=1800&q=90';

const GIFTING_IMAGES = [
  'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=1000&q=90',
  'https://images.unsplash.com/photo-1599785209707-a456fc1337bb?auto=format&fit=crop&w=1000&q=90',
  'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=1000&q=90',
  'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=1000&q=90',
];

const OCCASIONS = [
  {
    title: 'Festive gifting',
    description:
      'Thoughtful food hampers for festivals, family gatherings and celebrations.',
    image:
      'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=900&q=85',
  },
  {
    title: 'Corporate gifting',
    description:
      'Beautifully curated traditional food gifts for teams, clients and partners.',
    image:
      'https://images.unsplash.com/photo-1599785209707-a456fc1337bb?auto=format&fit=crop&w=900&q=85',
  },
  {
    title: 'Personal occasions',
    description:
      'Send a little taste of home for birthdays, weddings and special moments.',
    image:
      'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=900&q=85',
  },
];

const GIFTING_STEPS = [
  {
    number: '01',
    icon: Gift,
    title: 'Choose your gifts',
    description:
      'Pick individual favourites or let us help you build a thoughtful food collection.',
  },
  {
    number: '02',
    icon: Package,
    title: 'We curate & pack',
    description:
      'Every order is carefully packed so your gift arrives looking as special as it feels.',
  },
  {
    number: '03',
    icon: Truck,
    title: 'Delivered with care',
    description:
      'We deliver directly to your recipient, ready to be opened and enjoyed.',
  },
];

const GIFTING_FAQS = [
  {
    question: 'Can I create a custom gift hamper?',
    answer:
      'Yes. Choose products from our collection and contact us for help creating a customised gifting combination.',
  },
  {
    question: 'Do you offer corporate gifting?',
    answer:
      'Yes. We can help with larger gifting requirements for companies, teams, clients and events.',
  },
  {
    question: 'Can gifts be delivered directly to the recipient?',
    answer:
      'Yes. Add the recipient delivery details during checkout and we can send the gift directly to them.',
  },
  {
    question: 'Can I order gifts in bulk?',
    answer:
      'Absolutely. For bulk requirements, contact our gifting team so we can discuss quantities, packaging and delivery.',
  },
];

export function GiftingPage() {
  const [products, setProducts] =
    useState<Product[]>(fallbackProducts);

  const [selectedProduct, setSelectedProduct] =
    useState<Product | null>(null);

  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    async function loadProducts() {
      try {
        const response = await fetchProducts();

        if (response?.length) {
          setProducts(response);
        }
      } catch {
        // Keep fallback products when backend is unavailable.
      }
    }

    loadProducts();
  }, []);

  const giftingProducts = useMemo(() => {
    const featured = products.filter(
      (product) =>
        product.is_featured ||
        product.is_bestseller
    );

    return (featured.length ? featured : products).slice(0, 8);
  }, [products]);

  return (
    <div className="min-h-screen bg-[#fbf8f0] text-[#293723]">
      <TopBar
        products={products}
        onSelectProduct={setSelectedProduct}
        isAdminView={false}
      />

      <main>
        {/* =========================================================
            HERO
        ========================================================= */}

        <section className="relative overflow-hidden bg-[#eee8d8]">
          <div className="mx-auto grid min-h-[650px] w-full max-w-[1380px] grid-cols-1 lg:grid-cols-2">
            <div className="flex items-center px-6 py-20 sm:px-10 lg:px-16 xl:px-24">
              <div className="max-w-[600px]">
                <span className="mb-5 inline-flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#d47b32]">
                  <Gift size={15} />
                  ManaDeshi Gifting
                </span>

                <h1 className="font-['Playfair_Display',Georgia,serif] text-[clamp(48px,6vw,82px)] font-medium leading-[0.98] tracking-[-0.04em] text-[#293723]">
                  Give a little
                  <br />
                  <em className="text-[#71865a]">
                    taste of home.
                  </em>
                </h1>

                <p className="mt-7 max-w-[510px] text-base leading-8 text-[#687062] sm:text-lg">
                  Thoughtfully made traditional foods,
                  beautifully brought together for
                  the people who matter.
                </p>

                <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                  <Link
                    to="/shop"
                    className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#334d2d] px-7 text-sm font-bold text-white transition-all hover:-translate-y-0.5 hover:bg-[#263b22]"
                  >
                    Shop gifting favourites
                    <ArrowRight size={17} />
                  </Link>

                  <a
                    href="#corporate"
                    className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-[#334d2d]/20 bg-white/60 px-7 text-sm font-bold text-[#334d2d] transition-all hover:bg-white"
                  >
                    Corporate gifting
                  </a>
                </div>

                <div className="mt-9 grid max-w-[500px] grid-cols-1 gap-3 text-sm text-[#5d6857] sm:grid-cols-3">
                  <div className="flex items-center gap-2">
                    <Check size={16} className="text-[#71865a]" />
                    Curated gifts
                  </div>

                  <div className="flex items-center gap-2">
                    <Check size={16} className="text-[#71865a]" />
                    Beautiful packing
                  </div>

                  <div className="flex items-center gap-2">
                    <Check size={16} className="text-[#71865a]" />
                    Pan-India delivery
                  </div>
                </div>
              </div>
            </div>

            <div className="relative min-h-[430px] lg:min-h-full">
              <img
                src={GIFTING_HERO}
                alt="ManaDeshi gifting"
                className="absolute inset-0 h-full w-full object-cover"
              />

              <div className="absolute inset-0 bg-gradient-to-r from-[#eee8d8]/20 via-transparent to-black/10" />

              <div className="absolute bottom-7 left-6 rounded-2xl bg-white/95 px-5 py-4 shadow-xl backdrop-blur-sm sm:left-10">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#edf2e8] text-[#536b47]">
                    <Heart size={18} fill="currentColor" />
                  </div>

                  <div>
                    <p className="text-xs font-extrabold uppercase tracking-wider text-[#334d2d]">
                      Made with care
                    </p>
                    <p className="mt-0.5 text-xs text-[#7a8175]">
                      Traditional food, thoughtfully gifted
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================
            INTRO
        ========================================================= */}

        <section className="bg-white px-6 py-20 sm:py-28">
          <div className="mx-auto grid w-full max-w-[1120px] gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#d47b32]">
                The art of gifting
              </span>

              <h2 className="mt-4 font-['Playfair_Display',Georgia,serif] text-4xl leading-tight tracking-[-0.03em] text-[#293723] sm:text-5xl">
                Gifts that feel
                <br />
                <em className="text-[#71865a]">
                  personal.
                </em>
              </h2>
            </div>

            <div className="max-w-[650px]">
              <p className="text-base leading-8 text-[#697265] sm:text-lg">
                Some gifts are opened and forgotten.
                Others bring back a memory.
              </p>

              <p className="mt-5 text-base leading-8 text-[#697265] sm:text-lg">
                ManaDeshi gifting brings together the
                flavours, recipes and ingredients that
                make Indian homes feel like home.
              </p>

              <p className="mt-5 text-base leading-8 text-[#697265] sm:text-lg">
                Whether it is a festive hamper for your
                family or a thoughtful gift for a client,
                we make every box feel considered.
              </p>
            </div>
          </div>
        </section>

        {/* =========================================================
            OCCASIONS
        ========================================================= */}

        <section className="bg-[#f2eee3] px-5 py-20 sm:py-28">
          <div className="mx-auto w-full max-w-[1240px]">
            <div className="mb-12 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#d47b32]">
                  Find the right gift
                </span>

                <h2 className="mt-3 font-['Playfair_Display',Georgia,serif] text-4xl tracking-[-0.03em] text-[#293723] sm:text-5xl">
                  Made for every
                  <br />
                  <em className="text-[#71865a]">
                    occasion.
                  </em>
                </h2>
              </div>

              <Link
                to="/shop"
                className="inline-flex w-fit items-center gap-2 text-sm font-bold text-[#334d2d]"
              >
                Explore everything
                <ArrowRight size={16} />
              </Link>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              {OCCASIONS.map((occasion) => (
                <Link
                  key={occasion.title}
                  to="/shop"
                  className="group relative min-h-[430px] overflow-hidden rounded-[26px]"
                >
                  <img
                    src={occasion.image}
                    alt={occasion.title}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

                  <div className="absolute inset-x-0 bottom-0 p-7 text-white">
                    <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/70">
                      ManaDeshi
                    </span>

                    <h3 className="mt-2 font-['Playfair_Display',Georgia,serif] text-3xl">
                      {occasion.title}
                    </h3>

                    <p className="mt-3 max-w-[330px] text-sm leading-6 text-white/80">
                      {occasion.description}
                    </p>

                    <span className="mt-5 inline-flex items-center gap-2 text-xs font-bold">
                      Explore gifts
                      <ChevronRight
                        size={16}
                        className="transition-transform group-hover:translate-x-1"
                      />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* =========================================================
            GIFTING COLLECTION
        ========================================================= */}

        <section className="bg-[#fbf8f0] px-5 py-20 sm:py-28">
          <div className="mx-auto w-full max-w-[1240px]">
            <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#d47b32]">
                  Gift favourites
                </span>

                <h2 className="mt-3 font-['Playfair_Display',Georgia,serif] text-4xl leading-tight tracking-[-0.03em] text-[#293723] sm:text-5xl">
                  Little boxes of
                  <br />
                  <em className="text-[#71865a]">
                    happiness.
                  </em>
                </h2>
              </div>

              <p className="max-w-[580px] text-base leading-8 text-[#697265]">
                Build your own collection from our most-loved
                traditional foods. Pick a few favourites or
                combine flavours for a gift that feels uniquely
                yours.
              </p>
            </div>

            <div className="mt-12 grid grid-cols-2 gap-x-4 gap-y-9 sm:grid-cols-3 lg:grid-cols-4">
              {giftingProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onOpenDetail={setSelectedProduct}
                />
              ))}
            </div>

            <div className="mt-12 flex justify-center">
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 rounded-full border border-[#334d2d]/25 px-7 py-3 text-sm font-bold text-[#334d2d] transition-colors hover:bg-[#334d2d] hover:text-white"
              >
                View all products
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>

        {/* =========================================================
            IMAGE STORY
        ========================================================= */}

        <section className="overflow-hidden bg-white px-5 py-20 sm:py-28">
          <div className="mx-auto grid w-full max-w-[1240px] gap-5 lg:grid-cols-2">
            <div className="grid grid-cols-2 gap-5">
              <div className="overflow-hidden rounded-[26px]">
                <img
                  src={GIFTING_IMAGES[0]}
                  alt="Traditional gifting"
                  className="h-full min-h-[300px] w-full object-cover"
                />
              </div>

              <div className="overflow-hidden rounded-[26px]">
                <img
                  src={GIFTING_IMAGES[1]}
                  alt="Festive food gift"
                  className="h-full min-h-[300px] w-full object-cover"
                />
              </div>

              <div className="col-span-2 overflow-hidden rounded-[26px]">
                <img
                  src={GIFTING_IMAGES[2]}
                  alt="ManaDeshi food collection"
                  className="h-[300px] w-full object-cover sm:h-[390px]"
                />
              </div>
            </div>

            <div className="flex flex-col justify-center rounded-[26px] bg-[#eef1e8] px-7 py-12 sm:px-12 lg:px-16">
              <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#d47b32]">
                More than a box
              </span>

              <h2 className="mt-4 font-['Playfair_Display',Georgia,serif] text-4xl leading-tight tracking-[-0.03em] text-[#293723] sm:text-5xl">
                A gift with a
                <br />
                <em className="text-[#71865a]">
                  story inside.
                </em>
              </h2>

              <p className="mt-6 text-sm leading-7 text-[#697265] sm:text-base">
                Every ManaDeshi gift is inspired by the food
                that brings people together around an Indian
                dining table.
              </p>

              <p className="mt-4 text-sm leading-7 text-[#697265] sm:text-base">
                From familiar pickles and podis to sweets,
                ghee and snacks, each product is chosen to
                create a comforting, memorable experience.
              </p>

              <Link
                to="/about"
                className="mt-8 inline-flex w-fit items-center gap-2 rounded-full bg-[#334d2d] px-6 py-3 text-sm font-bold text-white transition-all hover:-translate-y-0.5 hover:bg-[#263b22]"
              >
                Our story
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>

        {/* =========================================================
            HOW IT WORKS
        ========================================================= */}

        <section className="bg-[#334d2d] px-5 py-20 text-white sm:py-28">
          <div className="mx-auto w-full max-w-[1100px]">
            <div className="mx-auto max-w-[650px] text-center">
              <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#dca164]">
                Simple gifting
              </span>

              <h2 className="mt-4 font-['Playfair_Display',Georgia,serif] text-4xl leading-tight sm:text-5xl">
                From our kitchen
                <br />
                <em>to someone special.</em>
              </h2>
            </div>

            <div className="mt-14 grid gap-8 md:grid-cols-3">
              {GIFTING_STEPS.map((step) => {
                const Icon = step.icon;

                return (
                  <div
                    key={step.number}
                    className="border-t border-white/15 pt-7"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold tracking-[0.15em] text-[#dca164]">
                        {step.number}
                      </span>

                      <Icon size={25} strokeWidth={1.5} />
                    </div>

                    <h3 className="mt-8 font-['Playfair_Display',Georgia,serif] text-2xl">
                      {step.title}
                    </h3>

                    <p className="mt-3 text-sm leading-7 text-white/65">
                      {step.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* =========================================================
            CORPORATE
        ========================================================= */}

        <section
          id="corporate"
          className="bg-[#f2eee3] px-5 py-20 sm:py-28"
        >
          <div className="mx-auto grid w-full max-w-[1200px] overflow-hidden rounded-[30px] bg-white lg:grid-cols-2">
            <div className="relative min-h-[390px]">
              <img
                src={GIFTING_IMAGES[3]}
                alt="Corporate gifting"
                className="absolute inset-0 h-full w-full object-cover"
              />
            </div>

            <div className="flex flex-col justify-center px-7 py-12 sm:px-12 lg:px-16">
              <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#d47b32]">
                For businesses
              </span>

              <h2 className="mt-4 font-['Playfair_Display',Georgia,serif] text-4xl leading-tight text-[#293723] sm:text-5xl">
                Corporate gifts
                <br />
                <em className="text-[#71865a]">
                  worth remembering.
                </em>
              </h2>

              <p className="mt-5 text-sm leading-7 text-[#697265] sm:text-base">
                Give your clients, employees and partners
                something more meaningful than another
                generic gift box.
              </p>

              <div className="mt-7 space-y-3">
                {[
                  'Custom product combinations',
                  'Bulk order support',
                  'Thoughtful traditional food selections',
                  'Dedicated gifting assistance',
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 text-sm text-[#596354]"
                  >
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#edf2e8] text-[#536b47]">
                      <Check size={14} />
                    </span>

                    {item}
                  </div>
                ))}
              </div>

              <a
                href="mailto:hello@manadeshidukaan.com?subject=Corporate%20Gifting%20Enquiry"
                className="mt-8 inline-flex w-fit items-center gap-2 rounded-full bg-[#334d2d] px-7 py-3 text-sm font-bold text-white transition-all hover:-translate-y-0.5 hover:bg-[#263b22]"
              >
                <Mail size={16} />
                Enquire for corporate gifting
              </a>
            </div>
          </div>
        </section>

        {/* =========================================================
            TRUST STRIP
        ========================================================= */}

        <section className="border-y border-[#334d2d]/10 bg-white">
          <div className="mx-auto grid max-w-[1100px] grid-cols-2 md:grid-cols-4">
            <div className="border-b border-r border-[#334d2d]/10 px-5 py-8 text-center md:border-b-0">
              <Leaf
                size={22}
                className="mx-auto text-[#71865a]"
              />
              <p className="mt-3 text-xs font-bold text-[#334d2d]">
                Quality ingredients
              </p>
            </div>

            <div className="border-b border-[#334d2d]/10 px-5 py-8 text-center md:border-b-0 md:border-r">
              <Gift
                size={22}
                className="mx-auto text-[#71865a]"
              />
              <p className="mt-3 text-xs font-bold text-[#334d2d]">
                Thoughtful gifting
              </p>
            </div>

            <div className="border-r border-[#334d2d]/10 px-5 py-8 text-center">
              <Package
                size={22}
                className="mx-auto text-[#71865a]"
              />
              <p className="mt-3 text-xs font-bold text-[#334d2d]">
                Carefully packed
              </p>
            </div>

            <div className="px-5 py-8 text-center">
              <Truck
                size={22}
                className="mx-auto text-[#71865a]"
              />
              <p className="mt-3 text-xs font-bold text-[#334d2d]">
                Delivered with care
              </p>
            </div>
          </div>
        </section>

        {/* =========================================================
            FAQ
        ========================================================= */}

        <section className="bg-[#fbf8f0] px-5 py-20 sm:py-28">
          <div className="mx-auto max-w-[850px]">
            <div className="text-center">
              <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#d47b32]">
                Gifting questions
              </span>

              <h2 className="mt-3 font-['Playfair_Display',Georgia,serif] text-4xl text-[#293723] sm:text-5xl">
                Frequently asked
              </h2>
            </div>

            <div className="mt-10 divide-y divide-[#334d2d]/10 border-y border-[#334d2d]/10">
              {GIFTING_FAQS.map((faq, index) => {
                const isOpen = openFaq === index;

                return (
                  <button
                    key={faq.question}
                    type="button"
                    onClick={() =>
                      setOpenFaq(
                        isOpen ? null : index
                      )
                    }
                    className="block w-full py-6 text-left"
                  >
                    <div className="flex items-center justify-between gap-5">
                      <span className="text-sm font-bold text-[#334d2d] sm:text-base">
                        {faq.question}
                      </span>

                      <ChevronRight
                        size={18}
                        className={`shrink-0 text-[#71865a] transition-transform ${
                          isOpen
                            ? 'rotate-90'
                            : ''
                        }`}
                      />
                    </div>

                    {isOpen && (
                      <p className="mt-4 max-w-[720px] pr-6 text-sm leading-7 text-[#697265]">
                        {faq.answer}
                      </p>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* =========================================================
            FINAL CTA
        ========================================================= */}

        <section className="bg-[#71865a] px-5 py-20 text-white sm:py-28">
          <div className="mx-auto max-w-[800px] text-center">
            <Sparkles
              size={27}
              className="mx-auto text-[#f3c78e]"
            />

            <h2 className="mt-5 font-['Playfair_Display',Georgia,serif] text-4xl leading-tight sm:text-6xl">
              Make someone's day
              <br />
              <em>a little more delicious.</em>
            </h2>

            <p className="mx-auto mt-5 max-w-[560px] text-sm leading-7 text-white/80 sm:text-base">
              Discover traditional favourites and create
              a gift they will genuinely enjoy.
            </p>

            <Link
              to="/shop"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-7 py-3 text-sm font-bold text-[#334d2d] transition-all hover:-translate-y-0.5"
            >
              Start gifting
              <ArrowRight size={17} />
            </Link>
          </div>
        </section>

        <Footer />
      </main>

      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onBuyNow={() => setSelectedProduct(null)}
      />
    </div>
  );
}

export default GiftingPage;