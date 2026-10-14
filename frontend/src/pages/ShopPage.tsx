import { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  ChevronDown,
  ChevronRight,
  Filter,
  Leaf,
  Search,
  SlidersHorizontal,
  Sparkles,
  X,
} from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';

import { TopBar } from '../components/TopBar';
import { ProductCard } from '../components/ProductCard';
import { ProductDetailModal } from '../components/ProductDetailModal';
import { Footer } from '../components/Footer';

import { fetchCategories, fetchProducts } from '../services/api';
import {
  fallbackCategories,
  fallbackProducts,
} from '../data/mockData';

import { Category, Product } from '../types';

const SHOP_CATEGORY_IMAGES = [
  'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=900&q=85',
  'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=900&q=85',
  'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=900&q=85',
  'https://images.unsplash.com/photo-1589927986089-35812388d1f4?auto=format&fit=crop&w=900&q=85',
  'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=900&q=85',
  'https://images.unsplash.com/photo-1599785209707-a456fc1337bb?auto=format&fit=crop&w=900&q=85',
  'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=900&q=85',
  'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=900&q=85',
];

const SORT_OPTIONS = [
  ['featured', 'Featured'],
  ['price_asc', 'Price: Low to High'],
  ['price_desc', 'Price: High to Low'],
  ['rating', 'Top Rated'],
] as const;

export function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const initialCategory =
    searchParams.get('category') || 'all';

  const initialSearch =
    searchParams.get('search') || '';

  const initialCollection =
    searchParams.get('collection') || '';

  const [products, setProducts] =
    useState<Product[]>(fallbackProducts);

  const [categories, setCategories] =
    useState<Category[]>(fallbackCategories);

  const [selectedCategory, setSelectedCategory] =
    useState(initialCategory);

  const [search, setSearch] =
    useState(initialSearch);

  const [collection, setCollection] =
    useState(initialCollection);

  const [sortBy, setSortBy] =
    useState('featured');

  const [mobileFiltersOpen, setMobileFiltersOpen] =
    useState(false);

  const [sortOpen, setSortOpen] =
    useState(false);

  const [selectedProduct, setSelectedProduct] =
    useState<Product | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadShop() {
      try {
        const [cats, prods] = await Promise.all([
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
        // Keep fallback data when API is unavailable.
      }
    }

    loadShop();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    setSelectedCategory(
      searchParams.get('category') || 'all'
    );

    setSearch(
      searchParams.get('search') || ''
    );

    setCollection(
      searchParams.get('collection') || ''
    );
  }, [searchParams]);

  const currentCategory = useMemo(
    () =>
      categories.find(
        (category) =>
          category.slug === selectedCategory
      ),
    [categories, selectedCategory]
  );

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (selectedCategory !== 'all') {
      const category = categories.find(
        (item) =>
          item.slug === selectedCategory
      );

      if (category) {
        result = result.filter(
          (product) =>
            product.category_id === category.id ||
            product.category_slug ===
              selectedCategory
        );
      }
    }

    if (collection) {
      const normalizedCollection =
        collection.toLowerCase();

      if (
        normalizedCollection === 'bestsellers' ||
        normalizedCollection === 'best-sellers'
      ) {
        result = result.filter(
          (product) =>
            product.is_bestseller ||
            product.is_featured
        );
      }

      if (
        normalizedCollection === 'featured'
      ) {
        result = result.filter(
          (product) => product.is_featured
        );
      }

      // if (
      //   normalizedCollection === 'new-arrivals' ||
      //   normalizedCollection === 'new'
      // ) {
      //   result = result.filter(
      //     (product) =>
      //       product.is_new ||
      //       product.is_featured
      //   );
      // }
      if (
        normalizedCollection === 'new-arrivals' ||
        normalizedCollection === 'new'
      ) {
        // Product type has no is_new field.
        // Use featured products as the current "new arrivals"
        // fallback until the backend exposes a dedicated field.
        result = result.filter(
          (product) => product.is_featured
        );
      }
    }

    if (search.trim()) {
      const query =
        search.toLowerCase().trim();

      result = result.filter((product) => {
        const name =
          product.name?.toLowerCase() || '';

        const tagline =
          product.tagline?.toLowerCase() || '';

        const category =
          product.category_name?.toLowerCase() ||
          '';

        return (
          name.includes(query) ||
          tagline.includes(query) ||
          category.includes(query)
        );
      });
    }

    result.sort((a, b) => {
      if (sortBy === 'price_asc') {
        return a.base_price - b.base_price;
      }

      if (sortBy === 'price_desc') {
        return b.base_price - a.base_price;
      }

      if (sortBy === 'rating') {
        return (
          (b.rating || 5) -
          (a.rating || 5)
        );
      }

      if (sortBy === 'featured') {
        return (
          Number(Boolean(b.is_featured)) -
          Number(Boolean(a.is_featured))
        );
      }

      return 0;
    });

    return result;
  }, [
    products,
    categories,
    selectedCategory,
    search,
    collection,
    sortBy,
  ]);

  const categoryName =
    currentCategory?.name
      ?.split('(')[0]
      .trim();

  const updateParams = (
    nextCategory: string,
    nextSearch: string,
    nextCollection: string
  ) => {
    const params = new URLSearchParams();

    if (nextCategory !== 'all') {
      params.set('category', nextCategory);
    }

    if (nextSearch.trim()) {
      params.set(
        'search',
        nextSearch.trim()
      );
    }

    if (nextCollection) {
      params.set(
        'collection',
        nextCollection
      );
    }

    setSearchParams(params);
  };

  const updateCategory = (
    category: string
  ) => {
    setSelectedCategory(category);

    updateParams(
      category,
      search,
      collection
    );

    setMobileFiltersOpen(false);
  };

  const handleSearch = (
    value: string
  ) => {
    setSearch(value);

    updateParams(
      selectedCategory,
      value,
      collection
    );
  };

  const handleCollection = (
    value: string
  ) => {
    setCollection(value);

    updateParams(
      selectedCategory,
      search,
      value
    );
  };

  const clearFilters = () => {
    setSelectedCategory('all');
    setSearch('');
    setCollection('');
    setSortBy('featured');
    setSearchParams({});
    setMobileFiltersOpen(false);
  };

  const selectedSortLabel =
    SORT_OPTIONS.find(
      ([value]) => value === sortBy
    )?.[1] || 'Featured';

  return (
    <div className="min-h-[100dvh] bg-[#faf8f2] text-[#26351f]">
      <TopBar
        products={products}
        onSelectProduct={setSelectedProduct}
        isAdminView={false}
      />

      <main>
        {/* HERO */}
        <section className="relative overflow-hidden bg-[#f1eee3]">
          <div className="absolute -right-24 -top-28 h-[360px] w-[360px] rounded-full bg-[#7c9a63]/10 blur-3xl" />
          <div className="absolute -bottom-32 left-[-120px] h-[300px] w-[300px] rounded-full bg-[#d58b52]/10 blur-3xl" />

          <div className="relative mx-auto w-[min(calc(100%-48px),1240px)] py-12 sm:py-16 lg:py-20 max-[680px]:w-[calc(100%-28px)]">
            <div className="mb-8 flex items-center gap-2 text-xs text-[#77786f]">
              <Link
                to="/"
                className="transition-colors hover:text-[#496735]"
              >
                Home
              </Link>

              <ChevronRight size={14} />

              <span className="text-[#34462d]">
                Shop
              </span>

              {categoryName && (
                <>
                  <ChevronRight size={14} />
                  <span>
                    {categoryName}
                  </span>
                </>
              )}
            </div>

            <div className="grid items-end gap-10 lg:grid-cols-[1fr_300px]">
              <div>
                <span className="mb-3 block text-[10px] font-bold uppercase tracking-[0.2em] text-[#c16f38]">
                  ManaDeshi Dukaan
                </span>

                <h1 className="max-w-[800px] font-['Playfair_Display',Georgia,serif] text-5xl leading-[0.98] tracking-[-0.045em] text-[#263c21] sm:text-6xl lg:text-[76px]">
                  {categoryName ||
                    (collection
                      ? collection
                          .replace(
                            /-/g,
                            ' '
                          )
                          .replace(
                            /\b\w/g,
                            (letter) =>
                              letter.toUpperCase()
                          )
                      : 'Shop our collection')}
                </h1>

                <p className="mt-6 max-w-[610px] text-sm leading-7 text-[#6b6b62] sm:text-base">
                  Traditional favourites,
                  homemade goodness and
                  everyday essentials —
                  thoughtfully prepared for
                  everyday homes.
                </p>

                {collection && (
                  <button
                    type="button"
                    onClick={() =>
                      handleCollection('')
                    }
                    className="mt-5 inline-flex items-center gap-2 rounded-full border border-[#496735]/20 bg-white px-4 py-2 text-xs font-semibold text-[#496735] transition hover:bg-[#496735] hover:text-white"
                  >
                    Collection: {collection.replace(/-/g, ' ')}
                    <X size={13} />
                  </button>
                )}
              </div>

              <div className="hidden justify-self-end lg:block">
                <div className="flex h-[210px] w-[210px] rotate-[-7deg] flex-col items-center justify-center rounded-full border border-[#496735]/20 text-center text-[#496735]">
                  <Leaf size={24} strokeWidth={1.5} />
                  <span className="mt-3 text-xs uppercase tracking-[0.16em]">
                    Made with
                  </span>
                  <strong className="mt-1 font-['Playfair_Display',Georgia,serif] text-3xl font-normal">
                    care
                  </strong>
                  <span className="mt-1 text-xs">
                    from our home to yours
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* COLLECTION STRIP */}
        <section className="border-b border-[#293c24]/10 bg-[#faf8f2]">
          <div className="mx-auto w-[min(calc(100%-48px),1240px)] max-[680px]:w-[calc(100%-28px)]">
            <div className="flex gap-3 overflow-x-auto py-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <button
                type="button"
                onClick={() =>
                  handleCollection('')
                }
                className={`flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold transition ${
                  !collection
                    ? 'border-[#496735] bg-[#496735] text-white'
                    : 'border-[#293c24]/15 bg-white text-[#5f655b] hover:border-[#496735] hover:text-[#496735]'
                }`}
              >
                All products
              </button>

              {[
                ['bestsellers', 'Bestsellers'],
                ['new-arrivals', 'New arrivals'],
                ['featured', 'Featured'],
              ].map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() =>
                    handleCollection(value)
                  }
                  className={`flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold transition ${
                    collection === value
                      ? 'border-[#496735] bg-[#496735] text-white'
                      : 'border-[#293c24]/15 bg-white text-[#5f655b] hover:border-[#496735] hover:text-[#496735]'
                  }`}
                >
                  <Sparkles size={13} />
                  {label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* CATEGORY STRIP */}
        <section className="sticky top-0 z-30 border-b border-[#293c24]/10 bg-[#faf8f2]/95 backdrop-blur-xl">
          <div className="mx-auto w-[min(calc(100%-48px),1240px)] max-[680px]:w-[calc(100%-28px)]">
            <div className="flex gap-2 overflow-x-auto py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <button
                type="button"
                onClick={() =>
                  updateCategory('all')
                }
                className={`flex min-h-10 shrink-0 items-center rounded-full border px-4 text-xs font-semibold transition ${
                  selectedCategory === 'all'
                    ? 'border-[#496735] bg-[#496735] text-white'
                    : 'border-[#293c24]/15 bg-transparent text-[#666960] hover:border-[#496735] hover:text-[#496735]'
                }`}
              >
                All categories
              </button>

              {categories.map(
                (category, index) => (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() =>
                      updateCategory(
                        category.slug
                      )
                    }
                    className={`flex min-h-10 shrink-0 items-center gap-2 rounded-full border py-1 pl-1 pr-4 text-xs font-semibold transition ${
                      selectedCategory ===
                      category.slug
                        ? 'border-[#496735] bg-[#496735] text-white'
                        : 'border-[#293c24]/15 bg-transparent text-[#666960] hover:border-[#496735] hover:text-[#496735]'
                    }`}
                  >
                    <span className="h-8 w-8 overflow-hidden rounded-full">
                      <img
                        src={
                          SHOP_CATEGORY_IMAGES[
                            index %
                              SHOP_CATEGORY_IMAGES.length
                          ]
                        }
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    </span>

                    {category.name
                      .split('(')[0]
                      .trim()}
                  </button>
                )
              )}
            </div>
          </div>
        </section>

        {/* PRODUCTS */}
        <section className="py-10 sm:py-14 lg:py-16">
          <div className="mx-auto w-[min(calc(100%-48px),1240px)] max-[680px]:w-[calc(100%-28px)]">
            {/* TOOLBAR */}
            <div className="mb-8 flex flex-col gap-4 border-b border-[#293c24]/10 pb-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="font-['Playfair_Display',Georgia,serif] text-2xl text-[#293d24]">
                    {filteredProducts.length}
                  </span>

                  <span className="text-xs text-[#77786f]">
                    products
                  </span>
                </div>

                {(search ||
                  selectedCategory !==
                    'all') && (
                  <p className="mt-1 text-xs text-[#898a82]">
                    Showing results for your
                    selection
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-2 sm:flex-row">
                <div className="flex h-11 w-full items-center gap-2 rounded border border-[#293c24]/12 bg-white px-3 text-[#77786f] sm:w-[280px]">
                  <Search size={16} />

                  <input
                    value={search}
                    onChange={(event) =>
                      handleSearch(
                        event.target.value
                      )
                    }
                    placeholder="Search products..."
                    className="w-full bg-transparent text-xs text-[#30372c] outline-none placeholder:text-[#9a9a92]"
                  />

                  {search && (
                    <button
                      type="button"
                      onClick={() =>
                        handleSearch('')
                      }
                      className="shrink-0 text-[#77786f] transition hover:text-[#263c21]"
                      aria-label="Clear search"
                    >
                      <X size={15} />
                    </button>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setMobileFiltersOpen(
                      true
                    )
                  }
                  className="flex h-11 items-center justify-center gap-2 rounded border border-[#293c24]/12 bg-white px-4 text-xs font-semibold text-[#4d5948] lg:hidden"
                >
                  <SlidersHorizontal
                    size={16}
                  />
                  Filters
                </button>

                <div className="relative">
                  <button
                    type="button"
                    onClick={() =>
                      setSortOpen(
                        (open) => !open
                      )
                    }
                    className="flex h-11 w-full items-center justify-between gap-3 rounded border border-[#293c24]/12 bg-white px-4 text-xs text-[#676960] sm:min-w-[190px]"
                  >
                    <span>
                      Sort:
                    </span>

                    <strong className="font-semibold text-[#293d24]">
                      {selectedSortLabel}
                    </strong>

                    <ChevronDown
                      size={15}
                    />
                  </button>

                  {sortOpen && (
                    <div className="absolute right-0 top-[calc(100%+7px)] z-40 w-full min-w-[205px] rounded-lg border border-[#293c24]/10 bg-white p-1.5 shadow-[0_18px_50px_rgba(30,40,24,.14)]">
                      {SORT_OPTIONS.map(
                        ([value, label]) => (
                          <button
                            key={value}
                            type="button"
                            onClick={() => {
                              setSortBy(
                                value
                              );
                              setSortOpen(
                                false
                              );
                            }}
                            className={`block w-full rounded px-3 py-2.5 text-left text-xs transition ${
                              sortBy === value
                                ? 'bg-[#edf3e8] font-bold text-[#496735]'
                                : 'text-[#64675f] hover:bg-[#f4f5ef]'
                            }`}
                          >
                            {label}
                          </button>
                        )
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* DESKTOP FILTER + GRID */}
            <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
              <aside className="hidden lg:block">
                <div className="sticky top-[90px] rounded-xl border border-[#293c24]/10 bg-white p-5">
                  <div className="mb-5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Filter
                        size={16}
                        className="text-[#496735]"
                      />
                      <h2 className="text-sm font-bold text-[#293d24]">
                        Shop by category
                      </h2>
                    </div>

                    <button
                      type="button"
                      onClick={clearFilters}
                      className="text-[10px] font-semibold uppercase tracking-wide text-[#8a8b82] hover:text-[#496735]"
                    >
                      Clear
                    </button>
                  </div>

                  <div className="space-y-1">
                    <button
                      type="button"
                      onClick={() =>
                        updateCategory(
                          'all'
                        )
                      }
                      className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-xs transition ${
                        selectedCategory ===
                        'all'
                          ? 'bg-[#edf3e8] font-bold text-[#496735]'
                          : 'text-[#686b63] hover:bg-[#f5f6f0]'
                      }`}
                    >
                      All products
                      <span>
                        {products.length}
                      </span>
                    </button>

                    {categories.map(
                      (category) => {
                        const count =
                          products.filter(
                            (product) =>
                              product.category_id ===
                                category.id ||
                              product.category_slug ===
                                category.slug
                          ).length;

                        return (
                          <button
                            key={
                              category.id
                            }
                            type="button"
                            onClick={() =>
                              updateCategory(
                                category.slug
                              )
                            }
                            className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-xs transition ${
                              selectedCategory ===
                              category.slug
                                ? 'bg-[#edf3e8] font-bold text-[#496735]'
                                : 'text-[#686b63] hover:bg-[#f5f6f0]'
                            }`}
                          >
                            <span>
                              {category.name
                                .split(
                                  '('
                                )[0]
                                .trim()}
                            </span>

                            <span className="text-[10px] text-[#999b92]">
                              {count}
                            </span>
                          </button>
                        );
                      }
                    )}
                  </div>

                  <div className="mt-6 border-t border-[#293c24]/10 pt-5">
                    <div className="rounded-lg bg-[#f5f2e8] p-4">
                      <Leaf
                        size={19}
                        className="text-[#496735]"
                      />

                      <p className="mt-3 text-xs font-semibold text-[#33452c]">
                        Traditional food,
                        thoughtfully made.
                      </p>

                      <p className="mt-1 text-[11px] leading-5 text-[#77786f]">
                        Small-batch goodness
                        for everyday
                        kitchens.
                      </p>
                    </div>
                  </div>
                </div>
              </aside>

              <div>
                {filteredProducts.length > 0 ? (
                  <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:grid-cols-2 sm:gap-x-5 sm:gap-y-10 xl:grid-cols-3">
                    {filteredProducts.map(
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
                  <div className="flex min-h-[420px] flex-col items-center justify-center rounded-2xl border border-dashed border-[#293c24]/15 bg-white px-6 text-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#edf3e8] text-[#496735]">
                      <Search size={24} />
                    </div>

                    <h2 className="mt-5 font-['Playfair_Display',Georgia,serif] text-3xl text-[#293d24]">
                      No products found
                    </h2>

                    <p className="mt-2 max-w-[420px] text-sm leading-6 text-[#77786f]">
                      We couldn't find
                      anything matching
                      your current filters.
                      Try another search
                      or browse the full
                      collection.
                    </p>

                    <button
                      type="button"
                      onClick={
                        clearFilters
                      }
                      className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#496735] px-5 py-3 text-xs font-bold text-white transition hover:bg-[#3d592e]"
                    >
                      View all products
                      <ArrowRight
                        size={15}
                      />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* STORY STRIP */}
        <section className="border-y border-[#293c24]/10 bg-[#283b23] px-5 py-12 text-white sm:py-16">
          <div className="mx-auto grid w-full max-w-[1080px] items-center gap-8 md:grid-cols-[1fr_auto]">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#d8b47d]">
                ManaDeshi Dukaan
              </span>

              <h2 className="mt-2 max-w-[650px] font-['Playfair_Display',Georgia,serif] text-3xl leading-tight sm:text-5xl">
                Bring a little
                <em className="not-italic text-[#a9c5ae]">
                  {' '}
                  home
                </em>{' '}
                to your table.
              </h2>

              <p className="mt-3 max-w-[580px] text-sm leading-6 text-white/65">
                Traditional foods,
                thoughtfully made for
                everyday homes.
              </p>
            </div>

            <Link
              to="/gifting"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-xs font-bold text-[#496735] transition hover:-translate-y-0.5 hover:bg-[#eef4eb]"
            >
              Explore gifting
              <ArrowRight size={15} />
            </Link>
          </div>
        </section>

        <Footer />
      </main>

      {/* MOBILE FILTER DRAWER */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden">
          <button
            type="button"
            aria-label="Close filters"
            onClick={() =>
              setMobileFiltersOpen(
                false
              )
            }
            className="absolute inset-0 bg-black/40"
          />

          <aside className="absolute bottom-0 left-0 right-0 max-h-[88dvh] overflow-y-auto rounded-t-3xl bg-[#fffdf8] shadow-2xl">
            <div className="sticky top-0 flex items-center justify-between border-b border-[#293c24]/10 bg-[#fffdf8] px-5 py-4">
              <div>
                <h2 className="font-['Playfair_Display',Georgia,serif] text-2xl text-[#293d24]">
                  Filters
                </h2>
                <p className="mt-0.5 text-[11px] text-[#85867d]">
                  Refine your collection
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setMobileFiltersOpen(
                    false
                  )
                }
                className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f0f2eb] text-[#596253]"
              >
                <X size={17} />
              </button>
            </div>

            <div className="px-5 py-5">
              <h3 className="mb-3 text-xs font-bold uppercase tracking-[0.14em] text-[#6d7067]">
                Categories
              </h3>

              <div className="space-y-1">
                <button
                  type="button"
                  onClick={() =>
                    updateCategory(
                      'all'
                    )
                  }
                  className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-left text-sm ${
                    selectedCategory ===
                    'all'
                      ? 'bg-[#496735] font-bold text-white'
                      : 'bg-white text-[#5f6259]'
                  }`}
                >
                  All products
                  <span>
                    {products.length}
                  </span>
                </button>

                {categories.map(
                  (category) => (
                    <button
                      key={category.id}
                      type="button"
                      onClick={() =>
                        updateCategory(
                          category.slug
                        )
                      }
                      className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-left text-sm ${
                        selectedCategory ===
                        category.slug
                          ? 'bg-[#496735] font-bold text-white'
                          : 'bg-white text-[#5f6259]'
                      }`}
                    >
                      <span>
                        {category.name
                          .split(
                            '('
                          )[0]
                          .trim()}
                      </span>

                      <ChevronRight
                        size={15}
                      />
                    </button>
                  )
                )}
              </div>

              <h3 className="mb-3 mt-7 text-xs font-bold uppercase tracking-[0.14em] text-[#6d7067]">
                Sort by
              </h3>

              <div className="grid gap-2">
                {SORT_OPTIONS.map(
                  ([value, label]) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() =>
                        setSortBy(value)
                      }
                      className={`rounded-xl border px-4 py-3 text-left text-sm ${
                        sortBy === value
                          ? 'border-[#496735] bg-[#edf3e8] font-bold text-[#496735]'
                          : 'border-[#293c24]/10 bg-white text-[#64675f]'
                      }`}
                    >
                      {label}
                    </button>
                  )
                )}
              </div>
            </div>

            <div className="sticky bottom-0 grid grid-cols-[1fr_1.5fr] gap-2 border-t border-[#293c24]/10 bg-[#fffdf8] px-5 py-4">
              <button
                type="button"
                onClick={clearFilters}
                className="rounded-xl border border-[#293c24]/15 bg-white text-xs font-semibold text-[#60635a]"
              >
                Clear all
              </button>

              <button
                type="button"
                onClick={() =>
                  setMobileFiltersOpen(
                    false
                  )
                }
                className="rounded-xl bg-[#496735] text-xs font-bold text-white"
              >
                Show {filteredProducts.length}{' '}
                products
              </button>
            </div>
          </aside>
        </div>
      )}

      <ProductDetailModal
        product={selectedProduct}
        onClose={() =>
          setSelectedProduct(null)
        }
        onBuyNow={() =>
          setSelectedProduct(null)
        }
      />
    </div>
  );
}

export default ShopPage;