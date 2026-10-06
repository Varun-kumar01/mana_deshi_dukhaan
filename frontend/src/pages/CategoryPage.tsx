import { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  ChevronRight,
  Leaf,
  SlidersHorizontal,
  Star,
} from 'lucide-react';
import { Link, useParams } from 'react-router-dom';

import { TopBar } from '../components/TopBar';
import { ProductCard } from '../components/ProductCard';
import { ProductDetailModal } from '../components/ProductDetailModal';
import { Footer } from '../components/Footer';

import { fetchProducts, fetchCategories } from '../services/api';
import { fallbackCategories, fallbackProducts } from '../data/mockData';

import { Product, Category } from '../types';

const CATEGORY_BANNERS: Record<string, string> = {
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

const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  pickles:
    'Bold, comforting and unmistakably homemade. Discover traditional Telugu pickles prepared with familiar ingredients and recipes passed down through generations.',
  powders:
    'A little spice can transform an everyday meal. Explore our collection of traditional podis and spice blends made for the way we eat at home.',
  snacks:
    'Crispy, crunchy and made for sharing. Traditional snacks prepared with the flavours that make every tea-time feel special.',
  sweets:
    'Little moments deserve something sweet. Explore traditional favourites made with simple ingredients and plenty of care.',
  oils:
    'Naturally nourishing oils chosen for everyday cooking, prepared with quality ingredients and a traditional approach.',
  ghee:
    'Rich, aromatic and deeply comforting. Bring the familiar taste of traditional ghee into your everyday meals.',
};

export function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();

  const [products, setProducts] = useState<Product[]>(fallbackProducts);
  const [categories, setCategories] =
    useState<Category[]>(fallbackCategories);
  const [selectedProduct, setSelectedProduct] =
    useState<Product | null>(null);
  const [sortBy, setSortBy] = useState('featured');
  const [showAll, setShowAll] = useState(false);

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
        // Keep fallback data when the API is unavailable.
      }
    }

    load();
  }, []);

  useEffect(() => {
    setShowAll(false);
    setSortBy('featured');

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }, [slug]);

  const category = categories.find(
    (item) => item.slug === slug,
  );

  const categoryName =
    category?.name?.split('(')[0].trim() ||
    slug?.replace(/-/g, ' ') ||
    'Collection';

  const bannerImage =
    (slug && CATEGORY_BANNERS[slug]) ||
    products.find(
      (product) => product.category_slug === slug,
    )?.images?.[0] ||
    CATEGORY_BANNERS.pickles;

  const description =
    (slug && CATEGORY_DESCRIPTIONS[slug]) ||
    `Explore our ${categoryName.toLowerCase()} collection, made with traditional recipes, quality ingredients and the familiar flavours of home.`;

  const categoryProducts = useMemo(() => {
    let result = products.filter(
      (product) =>
        product.category_slug === slug ||
        product.category_id === category?.id,
    );

    result = [...result].sort((a, b) => {
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

    return result;
  }, [products, category, slug, sortBy]);

  const displayedProducts = showAll
    ? categoryProducts
    : categoryProducts.slice(0, 8);

  const relatedCategories = categories.filter(
    (item) => item.slug !== slug,
  );

  return (
    <div className="flex min-h-dvh flex-col bg-white">
      <TopBar
        products={products}
        onSelectProduct={setSelectedProduct}
        isAdminView={false}
      />

      <main className="flex-1 text-[var(--text-dark)]">
        {/* Breadcrumb */}
        <div className="mx-auto w-full max-w-[1080px] px-5 max-[639px]:px-4">
          <div className="flex min-h-[52px] items-center gap-2 overflow-x-auto whitespace-nowrap text-xs text-[var(--text-light)]">
            <Link
              className="text-[var(--text-mid)] transition-colors hover:text-[var(--green)]"
              to="/"
            >
              Home
            </Link>

            <ChevronRight size={14} />

            <Link
              className="text-[var(--text-mid)] transition-colors hover:text-[var(--green)]"
              to="/shop"
            >
              Shop
            </Link>

            <ChevronRight size={14} />

            <span>{categoryName}</span>
          </div>
        </div>

        {/* Category Hero */}
        <section className="relative isolate min-h-[420px] overflow-hidden bg-[var(--green)] text-white sm:min-h-[500px]">
          <div className="absolute inset-0 z-0">
            <img
              className="h-full w-full object-cover"
              src={bannerImage}
              alt={categoryName}
            />
          </div>

          <div className="absolute inset-0 z-10 bg-gradient-to-r from-[rgba(18,35,23,0.94)] via-[rgba(18,35,23,0.68)] to-[rgba(18,35,23,0.12)]" />

          <div className="relative z-20 mx-auto flex min-h-[420px] w-full max-w-[1080px] items-center px-5 py-14 sm:min-h-[500px] max-[639px]:px-4">
            <div className="max-w-[620px]">
              <span className="mb-4 block text-xs font-bold uppercase tracking-[0.18em] text-[var(--amber-light)]">
                ManaDeshi collection
              </span>

              <h1 className="font-['Playfair_Display',Georgia,serif] text-5xl font-bold capitalize leading-[1.05] sm:text-7xl">
                {categoryName}
              </h1>

              <p className="mt-5 max-w-[560px] text-sm leading-7 text-white/85 sm:text-base">
                {description}
              </p>

              <div className="mt-7 flex flex-wrap items-center gap-x-7 gap-y-3 text-xs font-semibold text-white/90 sm:text-sm">
                <span className="flex items-center gap-2">
                  <Leaf size={15} />
                  Traditional recipes
                </span>

                <span className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-[var(--amber)]" />
                  Made with care
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Category Intro */}
        <section className="bg-white py-14 sm:py-20">
          <div className="mx-auto w-full max-w-[1080px] px-5 max-[639px]:px-4">
            <div className="grid gap-8 md:grid-cols-2 md:items-center md:gap-16">
              <div>
                <span className="mb-3 block text-xs font-bold uppercase tracking-[0.16em] text-[var(--terracotta)]">
                  From our kitchen
                </span>

                <h2 className="font-['Playfair_Display',Georgia,serif] text-4xl font-bold leading-tight text-[var(--green)] sm:text-5xl">
                  The kind of food
                  <br />
                  you remember.
                </h2>
              </div>

              <div>
                <p className="max-w-[500px] text-sm leading-7 text-[var(--text-mid)] sm:text-base">
                  We make food that belongs on everyday tables — familiar
                  flavours, honest ingredients and recipes inspired by the
                  kitchens we grew up around.
                </p>

                <Link
                  to="/about"
                  className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[var(--terracotta)] transition-colors hover:text-[var(--green)]"
                >
                  Learn about our story
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Products */}
        <section className="bg-[var(--cream)] py-14 sm:py-20">
          <div className="mx-auto w-full max-w-[1080px] px-5 max-[639px]:px-4">
            <div className="mb-8 flex flex-col gap-5 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <span className="mb-2 block text-xs font-bold uppercase tracking-[0.16em] text-[var(--terracotta)]">
                  Shop {categoryName}
                </span>

                <h2 className="font-['Playfair_Display',Georgia,serif] text-3xl font-bold text-[var(--green)] sm:text-4xl">
                  Our {categoryName}
                </h2>

                <p className="mt-2 text-sm text-[var(--text-mid)]">
                  {categoryProducts.length} products in this collection
                </p>
              </div>

              <div className="flex w-fit items-center gap-2 rounded-lg border border-[var(--border-mid)] bg-white px-3 py-2 text-[var(--text-mid)]">
                <SlidersHorizontal size={16} />

                <select
                  className="max-w-[170px] bg-transparent text-sm text-[var(--text-dark)] outline-none"
                  value={sortBy}
                  onChange={(event) => setSortBy(event.target.value)}
                >
                  <option value="featured">Featured</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                </select>
              </div>
            </div>

            {displayedProducts.length > 0 ? (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {displayedProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onOpenDetail={setSelectedProduct}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center rounded-2xl border border-dashed border-[var(--border-mid)] bg-white px-6 py-14 text-center">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--green-light)] text-[var(--green)]">
                  <Leaf size={30} />
                </div>

                <h3 className="font-['Playfair_Display',Georgia,serif] text-2xl font-bold text-[var(--green)]">
                  More goodness is coming.
                </h3>

                <p className="mt-2 text-sm text-[var(--text-mid)]">
                  We don't have products in this collection yet.
                </p>

                <Link
                  className="mt-5 inline-flex rounded-lg bg-[var(--green)] px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-[var(--green-mid)]"
                  to="/shop"
                >
                  Explore all products
                </Link>
              </div>
            )}

            {categoryProducts.length > 8 && (
              <div className="mt-9 flex justify-center">
                <button
                  className="inline-flex items-center gap-2 rounded-full border border-[var(--green)] px-6 py-3 text-sm font-bold text-[var(--green)] transition-colors hover:bg-[var(--green)] hover:text-white"
                  onClick={() => setShowAll((value) => !value)}
                >
                  {showAll
                    ? 'Show fewer products'
                    : `View all ${categoryProducts.length} products`}
                  <ArrowRight size={16} />
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Category Benefits */}
        <section className="bg-white py-14 sm:py-20">
          <div className="mx-auto w-full max-w-[1080px] px-5 max-[639px]:px-4">
            <div className="mb-9 text-center sm:mb-12">
              <span className="mb-3 block text-xs font-bold uppercase tracking-[0.16em] text-[var(--terracotta)]">
                Why ManaDeshi
              </span>

              <h2 className="font-['Playfair_Display',Georgia,serif] text-3xl font-bold leading-tight text-[var(--green)] sm:text-4xl">
                Good food starts
                <br />
                with good choices.
              </h2>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              <article className="rounded-2xl border border-[var(--border)] bg-[var(--cream)] p-6">
                <div className="mb-5 text-xs font-extrabold tracking-widest text-[var(--terracotta)]">
                  01
                </div>

                <Leaf
                  className="mb-4 text-[var(--green-mid)]"
                  size={23}
                />

                <h3 className="font-['Playfair_Display',Georgia,serif] text-xl font-bold text-[var(--green)]">
                  Genuine ingredients
                </h3>

                <p className="mt-2 text-sm leading-6 text-[var(--text-mid)]">
                  We believe simple food tastes best when you start with
                  ingredients you trust.
                </p>
              </article>

              <article className="rounded-2xl border border-[var(--border)] bg-[var(--cream)] p-6">
                <div className="mb-5 text-xs font-extrabold tracking-widest text-[var(--terracotta)]">
                  02
                </div>

                <Star
                  className="mb-4 text-[var(--amber)]"
                  size={23}
                  fill="currentColor"
                />

                <h3 className="font-['Playfair_Display',Georgia,serif] text-xl font-bold text-[var(--green)]">
                  Traditional flavours
                </h3>

                <p className="mt-2 text-sm leading-6 text-[var(--text-mid)]">
                  Familiar recipes and flavours inspired by the food we grew
                  up eating.
                </p>
              </article>

              <article className="rounded-2xl border border-[var(--border)] bg-[var(--cream)] p-6">
                <div className="mb-5 text-xs font-extrabold tracking-widest text-[var(--terracotta)]">
                  03
                </div>

                <Leaf
                  className="mb-4 text-[var(--green-mid)]"
                  size={23}
                />

                <h3 className="font-['Playfair_Display',Georgia,serif] text-xl font-bold text-[var(--green)]">
                  Made with care
                </h3>

                <p className="mt-2 text-sm leading-6 text-[var(--text-mid)]">
                  Every product is prepared with attention to freshness,
                  quality and consistency.
                </p>
              </article>
            </div>
          </div>
        </section>

        {/* Related Categories */}
        {relatedCategories.length > 0 && (
          <section className="bg-[var(--cream)] py-14 sm:py-20">
            <div className="mx-auto w-full max-w-[1080px] px-5 max-[639px]:px-4">
              <div className="mb-8 flex items-end justify-between gap-4">
                <div>
                  <span className="mb-2 block text-xs font-bold uppercase tracking-[0.16em] text-[var(--terracotta)]">
                    Keep exploring
                  </span>

                  <h2 className="font-['Playfair_Display',Georgia,serif] text-3xl font-bold text-[var(--green)] sm:text-4xl">
                    More from our kitchen
                  </h2>
                </div>

                <Link
                  className="inline-flex shrink-0 items-center gap-2 text-sm font-bold text-[var(--green)] transition-colors hover:text-[var(--terracotta)]"
                  to="/shop"
                >
                  View all
                  <ArrowRight size={16} />
                </Link>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {relatedCategories.slice(0, 4).map(
                  (relatedCategory, index) => (
                    <Link
                      key={relatedCategory.id}
                      to={`/category/${relatedCategory.slug}`}
                      className="group relative min-h-[220px] overflow-hidden rounded-2xl bg-[var(--green)] text-white shadow-sm"
                    >
                      <img
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        src={
                          [
                            CATEGORY_BANNERS.pickles,
                            CATEGORY_BANNERS.powders,
                            CATEGORY_BANNERS.snacks,
                            CATEGORY_BANNERS.sweets,
                          ][index % 4]
                        }
                        alt={relatedCategory.name}
                        loading="lazy"
                      />

                      <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/75 via-black/15 to-transparent p-5">
                        <span className="text-xs font-semibold uppercase tracking-widest text-white/80">
                          Explore
                        </span>

                        <h3 className="mt-1 font-['Playfair_Display',Georgia,serif] text-xl font-bold">
                          {relatedCategory.name
                            .split('(')[0]
                            .trim()}
                        </h3>

                        <ChevronRight
                          className="absolute bottom-5 right-4"
                          size={18}
                        />
                      </div>
                    </Link>
                  ),
                )}
              </div>
            </div>
          </section>
        )}

        {/* Final CTA */}
        <section className="bg-[var(--green)] px-5 py-14 text-white sm:py-20">
          <div className="mx-auto w-full max-w-[1080px]">
            <div className="mx-auto max-w-[700px] text-center">
              <span className="mb-3 block text-xs font-bold uppercase tracking-[0.16em] text-[var(--amber-light)]">
                ManaDeshi Dukaan
              </span>

              <h2 className="font-['Playfair_Display',Georgia,serif] text-4xl font-bold leading-tight sm:text-6xl">
                Bring home the
                <br />
                <em>flavours you love.</em>
              </h2>

              <p className="mt-4 text-sm text-white/80 sm:text-base">
                Explore the complete ManaDeshi collection.
              </p>

              <Link
                to="/shop"
                className="mt-6 inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-bold text-[var(--green)] transition-colors hover:bg-[var(--cream-2)]"
              >
                Shop everything
                <ArrowRight size={17} />
              </Link>
            </div>
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

export default CategoryPage;