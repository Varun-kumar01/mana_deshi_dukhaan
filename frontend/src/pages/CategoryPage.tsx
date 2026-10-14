import { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  ChevronRight,
  Leaf,
  SlidersHorizontal,
} from 'lucide-react';
import {
  Link,
  useParams,
} from 'react-router-dom';

import { TopBar } from '../components/TopBar';
import { ProductCard } from '../components/ProductCard';
import { ProductDetailModal } from '../components/ProductDetailModal';
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
  Product,
} from '../types';

const CATEGORY_BANNERS: Record<
  string,
  string
> = {
  pickles:
    'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=1800&q=90',

  powders:
    'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=1800&q=90',

  snacks:
    'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=1800&q=90',

  sweets:
    'https://images.unsplash.com/photo-1599785209707-a456fc1337bb?auto=format&fit=crop&w=1800&q=90',

  oils:
    'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=1800&q=90',

  ghee:
    'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=1800&q=90',
};

const CATEGORY_DESCRIPTIONS: Record<
  string,
  string
> = {
  pickles:
    'Bold, comforting and unmistakably homemade. Discover traditional Telugu pickles prepared with familiar ingredients and recipes passed down through generations.',

  powders:
    'A little spice can transform an everyday meal. Explore traditional podis and spice blends made for the way we eat at home.',

  snacks:
    'Crispy, crunchy and made for sharing. Traditional snacks prepared with the flavours that make every tea-time feel special.',

  sweets:
    'Little moments deserve something sweet. Explore traditional favourites made with simple ingredients and plenty of care.',

  oils:
    'Naturally nourishing oils chosen for everyday cooking, prepared with quality ingredients and a traditional approach.',

  ghee:
    'Rich, aromatic and deeply comforting. Bring the familiar taste of traditional ghee into your everyday meals.',
};

const CATEGORY_IMAGES = [
  'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=700&q=85',
  'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=700&q=85',
  'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=700&q=85',
  'https://images.unsplash.com/photo-1589927986089-35812388d1f4?auto=format&fit=crop&w=700&q=85',
  'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=700&q=85',
  'https://images.unsplash.com/photo-1599785209707-a456fc1337bb?auto=format&fit=crop&w=700&q=85',
];

const SORT_OPTIONS = [
  ['featured', 'Featured'],
  ['price_asc', 'Price: Low to High'],
  ['price_desc', 'Price: High to Low'],
  ['rating', 'Top Rated'],
] as const;

export function CategoryPage() {
  const { slug } = useParams<{
    slug: string;
  }>();

  const [products, setProducts] =
    useState<Product[]>(
      fallbackProducts
    );

  const [categories, setCategories] =
    useState<Category[]>(
      fallbackCategories
    );

  const [selectedProduct, setSelectedProduct] =
    useState<Product | null>(null);

  const [sortBy, setSortBy] =
    useState('featured');

  const [showAll, setShowAll] =
    useState(false);

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        const [cats, prods] =
          await Promise.all([
            fetchCategories(),
            fetchProducts(),
          ]);

        if (!mounted) return;

        if (cats?.length) {
          setCategories(cats);
        }

        if (prods?.length) {
          setProducts(prods);
        }
      } catch {
        // Keep fallback data.
      }
    }

    load();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    setShowAll(false);
    setSortBy('featured');

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }, [slug]);

  const category = useMemo(
    () =>
      categories.find(
        (item) => item.slug === slug
      ),
    [categories, slug]
  );

  const categoryName =
    category?.name
      ?.split('(')[0]
      .trim() ||
    slug
      ?.replace(/-/g, ' ')
      .replace(/\b\w/g, (letter) =>
        letter.toUpperCase()
      ) ||
    'Collection';

  const bannerImage =
    (slug &&
      CATEGORY_BANNERS[slug]) ||
    products.find(
      (product) =>
        product.category_slug === slug
    )?.images?.[0] ||
    CATEGORY_BANNERS.pickles;

  const description =
    (slug &&
      CATEGORY_DESCRIPTIONS[slug]) ||
    `Explore our ${categoryName.toLowerCase()} collection, made with traditional recipes, quality ingredients and the familiar flavours of home.`;

  const categoryProducts = useMemo(() => {
    let result = products.filter(
      (product) =>
        product.category_slug === slug ||
        product.category_id === category?.id
    );

    result = [...result].sort(
      (a, b) => {
        if (sortBy === 'price_asc') {
          return (
            a.base_price -
            b.base_price
          );
        }

        if (sortBy === 'price_desc') {
          return (
            b.base_price -
            a.base_price
          );
        }

        if (sortBy === 'rating') {
          return (
            (b.rating || 5) -
            (a.rating || 5)
          );
        }

        if (sortBy === 'featured') {
          return (
            Number(
              Boolean(b.is_featured)
            ) -
            Number(
              Boolean(a.is_featured)
            )
          );
        }

        return 0;
      }
    );

    return result;
  }, [
    products,
    category,
    slug,
    sortBy,
  ]);

  const displayedProducts = showAll
    ? categoryProducts
    : categoryProducts.slice(0, 8);

  const relatedCategories =
    categories.filter(
      (item) => item.slug !== slug
    );

  return (
    <div className="min-h-[100dvh] bg-[#faf8f2] text-[#26351f]">
      <TopBar
        products={products}
        onSelectProduct={
          setSelectedProduct
        }
        isAdminView={false}
      />

      <main>
        {/* BREADCRUMB */}
        <div className="mx-auto w-[min(calc(100%-48px),1240px)] max-[680px]:w-[calc(100%-28px)]">
          <div className="flex min-h-[54px] items-center gap-2 overflow-hidden text-xs text-[#85867e]">
            <Link
              to="/"
              className="shrink-0 transition-colors hover:text-[#496735]"
            >
              Home
            </Link>

            <ChevronRight
              size={14}
              className="shrink-0"
            />

            <Link
              to="/shop"
              className="shrink-0 transition-colors hover:text-[#496735]"
            >
              Shop
            </Link>

            <ChevronRight
              size={14}
              className="shrink-0"
            />

            <span className="truncate text-[#4e5549]">
              {categoryName}
            </span>
          </div>
        </div>

        {/* HERO */}
        <section className="relative min-h-[440px] overflow-hidden bg-[#283b23] text-white sm:min-h-[520px]">
          <div className="absolute inset-0">
            <img
              src={bannerImage}
              alt={categoryName}
              className="h-full w-full object-cover"
            />
          </div>

          <div className="absolute inset-0 bg-gradient-to-r from-[#152718]/95 via-[#1c3020]/70 to-[#1c3020]/10" />

          <div className="relative mx-auto flex min-h-[440px] w-[min(calc(100%-48px),1240px)] items-center py-16 sm:min-h-[520px] max-[680px]:w-[calc(100%-28px)]">
            <div className="max-w-[700px]">
              <span className="mb-4 block text-[10px] font-bold uppercase tracking-[0.2em] text-[#dfb778]">
                ManaDeshi collection
              </span>

              <h1 className="font-['Playfair_Display',Georgia,serif] text-5xl leading-[.98] tracking-[-.04em] sm:text-7xl lg:text-[82px]">
                {categoryName}
              </h1>

              <p className="mt-6 max-w-[600px] text-sm leading-7 text-white/80 sm:text-base">
                {description}
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  to="/shop"
                  className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-xs font-bold text-[#496735] transition hover:-translate-y-0.5 hover:bg-[#f1f5ed]"
                >
                  Shop all products
                  <ArrowRight size={15} />
                </Link>

                <Link
                  to="/our-story"
                  className="inline-flex items-center gap-2 rounded-full border border-white/30 px-5 py-3 text-xs font-semibold text-white transition hover:bg-white/10"
                >
                  Our story
                </Link>
              </div>

              <div className="mt-8 flex flex-wrap gap-6 text-xs text-white/80">
                <span className="flex items-center gap-2">
                  <Leaf size={15} />
                  Traditional recipes
                </span>

                <span className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#d9a661]" />
                  Made with care
                </span>

                <span className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#d9a661]" />
                  Everyday goodness
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* INTRO */}
        <section className="bg-white py-14 sm:py-20">
          <div className="mx-auto w-[min(calc(100%-48px),1080px)] max-[680px]:w-[calc(100%-28px)]">
            <div className="grid gap-10 md:grid-cols-2 md:items-center md:gap-20">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#c16f38]">
                  From our kitchen
                </span>

                <h2 className="mt-3 font-['Playfair_Display',Georgia,serif] text-4xl leading-tight tracking-[-.03em] text-[#293d24] sm:text-5xl">
                  The kind of food
                  <br />
                  you remember.
                </h2>
              </div>

              <div>
                <p className="text-sm leading-7 text-[#6e7068] sm:text-base">
                  We make food that belongs
                  on everyday tables —
                  familiar flavours, honest
                  ingredients and recipes
                  inspired by the kitchens we
                  grew up around.
                </p>

                <Link
                  to="/our-story"
                  className="mt-5 inline-flex items-center gap-2 text-xs font-bold text-[#496735] transition hover:text-[#c16f38]"
                >
                  Learn about our story
                  <ArrowRight size={15} />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* PRODUCTS */}
        <section className="bg-[#faf8f2] py-12 sm:py-16 lg:py-20">
          <div className="mx-auto w-[min(calc(100%-48px),1240px)] max-[680px]:w-[calc(100%-28px)]">
            <div className="mb-8 flex flex-col gap-5 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#c16f38]">
                  Shop the collection
                </span>

                <h2 className="mt-2 font-['Playfair_Display',Georgia,serif] text-3xl tracking-[-.025em] text-[#293d24] sm:text-4xl">
                  {categoryName}
                </h2>

                <p className="mt-2 text-xs text-[#808178]">
                  {categoryProducts.length}{' '}
                  products in this collection
                </p>
              </div>

              <div className="flex h-11 items-center gap-2 rounded-lg border border-[#293c24]/10 bg-white px-3">
                <SlidersHorizontal
                  size={15}
                  className="text-[#496735]"
                />

                <select
                  value={sortBy}
                  onChange={(event) =>
                    setSortBy(
                      event.target.value
                    )
                  }
                  className="bg-transparent text-xs text-[#4f554b] outline-none"
                >
                  {SORT_OPTIONS.map(
                    ([value, label]) => (
                      <option
                        key={value}
                        value={value}
                      >
                        {label}
                      </option>
                    )
                  )}
                </select>
              </div>
            </div>

            {displayedProducts.length > 0 ? (
              <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:grid-cols-2 sm:gap-x-5 sm:gap-y-10 lg:grid-cols-4">
                {displayedProducts.map(
                  (product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onOpenDetail={
                        setSelectedProduct
                      }
                    />
                  )
                )}
              </div>
            ) : (
              <div className="flex min-h-[380px] flex-col items-center justify-center rounded-2xl border border-dashed border-[#293c24]/15 bg-white px-6 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#edf3e8] text-[#496735]">
                  <Leaf size={28} />
                </div>

                <h3 className="mt-5 font-['Playfair_Display',Georgia,serif] text-2xl text-[#293d24]">
                  More goodness is coming.
                </h3>

                <p className="mt-2 max-w-[400px] text-sm leading-6 text-[#77786f]">
                  There are currently no
                  products in this
                  collection.
                </p>

                <Link
                  to="/shop"
                  className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#496735] px-5 py-3 text-xs font-bold text-white transition hover:bg-[#3e592f]"
                >
                  Explore all products
                  <ArrowRight size={15} />
                </Link>
              </div>
            )}

            {categoryProducts.length > 8 && (
              <div className="mt-10 flex justify-center">
                <button
                  type="button"
                  onClick={() =>
                    setShowAll(
                      (value) => !value
                    )
                  }
                  className="inline-flex items-center gap-2 rounded-full border border-[#496735] px-6 py-3 text-xs font-bold text-[#496735] transition hover:bg-[#496735] hover:text-white"
                >
                  {showAll
                    ? 'Show fewer products'
                    : `View all ${categoryProducts.length} products`}

                  <ArrowRight size={15} />
                </button>
              </div>
            )}
          </div>
        </section>

        {/* RELATED CATEGORIES */}
        {relatedCategories.length > 0 && (
          <section className="bg-white py-14 sm:py-20">
            <div className="mx-auto w-[min(calc(100%-48px),1240px)] max-[680px]:w-[calc(100%-28px)]">
              <div className="mb-8 text-center">
                <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#c16f38]">
                  Keep exploring
                </span>

                <h2 className="mt-2 font-['Playfair_Display',Georgia,serif] text-3xl text-[#293d24] sm:text-4xl">
                  More from ManaDeshi
                </h2>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
                {relatedCategories
                  .slice(0, 6)
                  .map(
                    (item, index) => (
                      <Link
                        key={item.id}
                        to={`/category/${item.slug}`}
                        className="group overflow-hidden rounded-xl border border-[#293c24]/10 bg-[#faf8f2]"
                      >
                        <div className="aspect-square overflow-hidden">
                          <img
                            src={
                              CATEGORY_IMAGES[
                                index %
                                  CATEGORY_IMAGES.length
                              ]
                            }
                            alt={item.name}
                            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                          />
                        </div>

                        <div className="flex items-center justify-between gap-2 p-3">
                          <span className="truncate text-xs font-semibold text-[#394431]">
                            {item.name
                              .split('(')[0]
                              .trim()}
                          </span>

                          <ChevronRight
                            size={14}
                            className="shrink-0 text-[#879080] transition group-hover:translate-x-0.5 group-hover:text-[#496735]"
                          />
                        </div>
                      </Link>
                    )
                  )}
              </div>
            </div>
          </section>
        )}

        {/* WHY US */}
        <section className="bg-[#283b23] px-5 py-14 text-white sm:py-20">
          <div className="mx-auto w-full max-w-[1080px]">
            <div className="mx-auto max-w-[650px] text-center">
              <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#dfb778]">
                Why ManaDeshi
              </span>

              <h2 className="mt-3 font-['Playfair_Display',Georgia,serif] text-3xl leading-tight sm:text-5xl">
                Good food starts
                <br />
                with good choices.
              </h2>

              <p className="mt-4 text-sm leading-6 text-white/65">
                Traditional recipes,
                thoughtful preparation and
                flavours designed to bring
                the feeling of home to your
                table.
              </p>
            </div>

            <div className="mt-10 grid gap-3 sm:grid-cols-3">
              {[
                [
                  '01',
                  'Traditional',
                  'Inspired by recipes and flavours we grew up with.',
                ],
                [
                  '02',
                  'Thoughtful',
                  'Prepared with care for everyday homes.',
                ],
                [
                  '03',
                  'From home',
                  'Food that brings familiar moments back to the table.',
                ],
              ].map(
                ([number, title, text]) => (
                  <div
                    key={number}
                    className="rounded-2xl border border-white/10 bg-white/5 p-5"
                  >
                    <span className="text-xs font-bold text-[#d9b176]">
                      {number}
                    </span>

                    <h3 className="mt-5 font-['Playfair_Display',Georgia,serif] text-xl">
                      {title}
                    </h3>

                    <p className="mt-2 text-xs leading-6 text-white/55">
                      {text}
                    </p>
                  </div>
                )
              )}
            </div>
          </div>
        </section>

        <Footer />
      </main>

      <ProductDetailModal
        product={selectedProduct}
        onClose={() =>
          setSelectedProduct(null)
        }
        onBuyNow={(
          _product,
          _variant,
          _quantity
        ) => {
          setSelectedProduct(null);
        }}
      />
    </div>
  );
}

export default CategoryPage;