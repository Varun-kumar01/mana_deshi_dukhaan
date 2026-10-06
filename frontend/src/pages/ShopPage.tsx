import { useEffect, useMemo, useState } from 'react';
import {
  ChevronDown,
  ChevronRight,
  Filter,
  Search,
  SlidersHorizontal,
  X,
  ShoppingBag,
  Leaf,
} from 'lucide-react';
import { useSearchParams, Link } from 'react-router-dom';

import { TopBar } from '../components/TopBar';
import { ProductCard } from '../components/ProductCard';
import { ProductDetailModal } from '../components/ProductDetailModal';
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
} from '../types';

const SHOP_CATEGORY_IMAGES = [
  'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=900&q=85',
  'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=900&q=85',
  'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=900&q=85',
  'https://images.unsplash.com/photo-1589927986089-35812388d1f4?auto=format&fit=crop&w=900&q=85',
  'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=900&q=85',
  'https://images.unsplash.com/photo-1599785209707-a456fc1337bb?auto=format&fit=crop&w=900&q=85',
];

export function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const initialCategory =
    searchParams.get('category') || 'all';

  const initialSearch =
    searchParams.get('search') || '';

  const [products, setProducts] =
    useState<Product[]>(fallbackProducts);

  const [categories, setCategories] =
    useState<Category[]>(fallbackCategories);

  const [selectedCategory, setSelectedCategory] =
    useState(initialCategory);

  const [sortBy, setSortBy] =
    useState('featured');

  const [search, setSearch] =
    useState(initialSearch);

  const [mobileFiltersOpen, setMobileFiltersOpen] =
    useState(false);

  const [selectedProduct, setSelectedProduct] =
    useState<Product | null>(null);

  const [showSort, setShowSort] =
    useState(false);

  useEffect(() => {
    async function loadShop() {
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
        // Keep fallback data.
      }
    }

    loadShop();
  }, []);

  useEffect(() => {
    const category =
      searchParams.get('category') || 'all';

    const searchValue =
      searchParams.get('search') || '';

    setSelectedCategory(category);
    setSearch(searchValue);
  }, [searchParams]);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (selectedCategory !== 'all') {
      const category = categories.find(
        (item) => item.slug === selectedCategory,
      );

      if (category) {
        result = result.filter(
          (product) =>
            product.category_id === category.id ||
            product.category_slug === selectedCategory,
        );
      }
    }

    if (search.trim()) {
      const query = search.toLowerCase().trim();

      result = result.filter((product) => {
        const name =
          product.name?.toLowerCase() || '';

        const tagline =
          product.tagline?.toLowerCase() || '';

        const category =
          product.category_name?.toLowerCase() || '';

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
        return (b.rating || 5) - (a.rating || 5);
      }

      return 0;
    });

    return result;
  }, [
    products,
    categories,
    selectedCategory,
    sortBy,
    search,
  ]);

  const currentCategory =
    categories.find(
      (category) =>
        category.slug === selectedCategory,
    );

  const updateCategory = (
    category: string,
  ) => {
    setSelectedCategory(category);

    const params = new URLSearchParams();

    if (category !== 'all') {
      params.set('category', category);
    }

    if (search.trim()) {
      params.set('search', search.trim());
    }

    setSearchParams(params);
    setMobileFiltersOpen(false);
  };

  const handleSearch = (
    value: string,
  ) => {
    setSearch(value);

    const params = new URLSearchParams();

    if (selectedCategory !== 'all') {
      params.set(
        'category',
        selectedCategory,
      );
    }

    if (value.trim()) {
      params.set('search', value.trim());
    }

    setSearchParams(params);
  };

  const clearFilters = () => {
    setSelectedCategory('all');
    setSearch('');
    setSortBy('featured');
    setSearchParams({});
  };

  const categoryName =
    currentCategory?.name
      ?.split('(')[0]
      .trim();

  return (
    <div className="flex min-h-[100dvh] flex-col">
      <TopBar
        products={products}
        onSelectProduct={setSelectedProduct}
        isAdminView={false}
      />

      <main className="min-h-screen flex-1 bg-[#faf7f2]">
        {/* SHOP HERO */}
        <section className="relative overflow-hidden bg-[radial-gradient(circle_at_85%_20%,rgba(116,139,83,.14),transparent_30%),#f3efe4] py-[42px] pb-[72px] max-[768px]:py-[25px] max-[768px]:pb-[45px] max-[480px]:pt-5">
          <div className="mx-auto w-[min(calc(100%-48px),1240px)] max-[960px]:w-[calc(100%-36px)] max-[680px]:w-[calc(100%-28px)]">
            <div className="mb-[46px] flex flex-wrap items-center gap-[7px] text-[13px] text-[#7d7b70] max-[768px]:mb-8 max-[768px]:text-xs">
              <Link
                to="/"
                className="text-inherit no-underline hover:text-[#496535]"
              >
                Home
              </Link>

              <ChevronRight size={14} />

              <span>Shop</span>

              {categoryName && (
                <>
                  <ChevronRight size={14} />

                  <span>{categoryName}</span>
                </>
              )}
            </div>

            <div className="flex items-center justify-between gap-[60px] max-[768px]:gap-[25px]">
              <div>
                <span className="text-[9px] font-extrabold uppercase tracking-[.16em] text-[var(--md-orange)]">
                  ManaDeshi Dukaan
                </span>

                <h1 className="my-[10px] mb-[18px] max-w-[760px] font-['Playfair_Display',serif] text-[clamp(42px,5vw,76px)] leading-[.98] tracking-[-2.5px] text-[#253820] max-[768px]:mt-[9px] max-[768px]:text-[clamp(39px,11vw,55px)] max-[768px]:tracking-[-1.8px] max-[480px]:text-[40px]">
                  {categoryName || 'Shop our collection'}
                </h1>

                <p className="m-0 max-w-[570px] text-[17px] leading-[1.8] text-[#68685e] max-[768px]:text-sm max-[768px]:leading-[1.7] max-[480px]:text-[13px]">
                  Traditional favourites, homemade goodness and everyday
                  essentials, prepared with care.
                </p>
              </div>

              <div className="shrink-0 max-[768px]:hidden">
                <div className="flex h-[190px] w-[190px] -rotate-[8deg] flex-col items-center justify-center rounded-full border border-[rgba(73,101,53,.2)] text-[#496535]">
                  <span className="text-[13px]">
                    Made with
                  </span>

                  <strong className="my-[7px] text-[30px] font-normal">
                    ♥
                  </strong>

                  <span className="text-[13px]">
                    at home
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CATEGORY STRIP */}
        <section className="sticky top-0 z-[30] border-b border-[rgba(40,55,31,.1)] bg-[rgba(250,248,241,.94)] backdrop-blur-[18px] max-[768px]:relative">
          <div className="mx-auto w-[min(calc(100%-48px),1240px)] max-[960px]:w-[calc(100%-36px)] max-[680px]:w-[calc(100%-28px)]">
            <div className="flex items-center gap-2.5 overflow-x-auto py-[15px] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden max-[768px]:-mx-4 max-[768px]:px-4 max-[768px]:py-[11px]">
              <button
                className={`inline-flex min-h-[42px] shrink-0 items-center gap-[9px] rounded-full border border-[rgba(54,70,44,.14)] bg-transparent py-[5px] pl-[7px] pr-4 text-[13px] text-[#5f6258] transition-all duration-[250ms] hover:border-[#4c6a38] hover:bg-[#4c6a38] hover:text-white max-[768px]:min-h-[39px] max-[768px]:pr-[13px] max-[768px]:text-xs ${
                  selectedCategory === 'all'
                    ? 'border-[#4c6a38] bg-[#4c6a38] text-white'
                    : ''
                }`}
                onClick={() => updateCategory('all')}
              >
                All products
              </button>

              {categories.map((category, index) => (
                <button
                  key={category.id}
                  className={`inline-flex min-h-[42px] shrink-0 items-center gap-[9px] rounded-full border border-[rgba(54,70,44,.14)] bg-transparent py-[5px] pl-[7px] pr-4 text-[13px] text-[#5f6258] transition-all duration-[250ms] hover:border-[#4c6a38] hover:bg-[#4c6a38] hover:text-white max-[768px]:min-h-[39px] max-[768px]:pr-[13px] max-[768px]:text-xs ${
                    selectedCategory === category.slug
                      ? 'border-[#4c6a38] bg-[#4c6a38] text-white'
                      : ''
                  }`}
                  onClick={() =>
                    updateCategory(category.slug)
                  }
                >
                  <span className="flex h-[31px] w-[31px] overflow-hidden rounded-full max-[768px]:h-[27px] max-[768px]:w-[27px]">
                    <img
                      className="h-full w-full object-cover"
                      src={
                        SHOP_CATEGORY_IMAGES[
                          index % SHOP_CATEGORY_IMAGES.length
                        ]
                      }
                      alt=""
                    />
                  </span>

                  {category.name
                    .split('(')[0]
                    .trim()}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* SHOP CONTENT */}
        <section className="py-[58px] pb-[90px] max-[768px]:py-[38px] max-[768px]:pb-[60px]">
          <div className="mx-auto w-[min(calc(100%-48px),1240px)] max-[960px]:w-[calc(100%-36px)] max-[680px]:w-[calc(100%-28px)]">
            <div className="mb-[38px] flex items-center justify-between gap-6 max-[768px]:mb-[25px] max-[768px]:flex-col max-[768px]:items-start max-[768px]:gap-4">
              <div className="flex items-baseline gap-[7px] text-[#77766e]">
                <strong className="font-['Playfair_Display',serif] text-2xl text-[#263b21] max-[480px]:text-[21px]">
                  {filteredProducts.length}
                </strong>

                <span className="text-[13px]">
                  products
                </span>
              </div>

              <div className="flex items-center gap-3 max-[768px]:w-full max-[768px]:flex-wrap">
                <div className="flex h-[46px] w-[270px] items-center gap-[9px] rounded border border-[rgba(43,58,38,.14)] bg-white px-[13px] text-[#7a7a72] max-[768px]:h-12 max-[768px]:w-full">
                  <Search size={17} />

                  <input
                    className="w-full min-w-0 border-0 bg-transparent text-[13px] text-[#333] outline-none"
                    type="text"
                    value={search}
                    onChange={(event) =>
                      handleSearch(event.target.value)
                    }
                    placeholder="Search products..."
                  />

                  {search && (
                    <button
                      className="flex border-0 bg-transparent text-[#777]"
                      onClick={() => handleSearch('')}
                      aria-label="Clear search"
                    >
                      <X size={15} />
                    </button>
                  )}
                </div>

                <button
                  className="hidden h-[46px] items-center justify-center gap-[7px] rounded border border-[#dcdcd4] bg-white px-[14px] text-[13px] text-[#4f5e48] max-[768px]:flex"
                  onClick={() =>
                    setMobileFiltersOpen(true)
                  }
                >
                  <SlidersHorizontal size={17} />
                  Filters
                </button>

                <div className="relative max-[768px]:flex-1">
                  <button
                    className="flex h-[46px] items-center gap-[7px] rounded border border-[rgba(43,58,38,.14)] bg-white px-[14px] text-[13px] text-[#65665f] max-[768px]:w-full max-[768px]:justify-center"
                    onClick={() =>
                      setShowSort((value) => !value)
                    }
                  >
                    <span>Sort:</span>

                    <strong className="font-semibold text-[#293d24]">
                      {sortBy === 'price_asc'
                        ? 'Price low to high'
                        : sortBy === 'price_desc'
                          ? 'Price high to low'
                          : sortBy === 'rating'
                            ? 'Top rated'
                            : 'Featured'}
                    </strong>

                    <ChevronDown size={16} />
                  </button>

                  {showSort && (
                    <div className="absolute right-0 top-[calc(100%+7px)] z-[50] w-[205px] rounded-md border border-[rgba(43,58,38,.1)] bg-white p-[7px] shadow-[0_16px_40px_rgba(30,40,24,.12)]">
                      <button
                        className="block w-full rounded px-3 py-[11px] text-left text-[13px] text-[#5f6258] hover:bg-[#f1f4ea] hover:text-[#42602f]"
                        onClick={() => {
                          setSortBy('featured');
                          setShowSort(false);
                        }}
                      >
                        Featured
                      </button>

                      <button
                        className="block w-full rounded px-3 py-[11px] text-left text-[13px] text-[#5f6258] hover:bg-[#f1f4ea] hover:text-[#42602f]"
                        onClick={() => {
                          setSortBy('price_asc');
                          setShowSort(false);
                        }}
                      >
                        Price: Low to High
                      </button>

                      <button
                        className="block w-full rounded px-3 py-[11px] text-left text-[13px] text-[#5f6258] hover:bg-[#f1f4ea] hover:text-[#42602f]"
                        onClick={() => {
                          setSortBy('price_desc');
                          setShowSort(false);
                        }}
                      >
                        Price: High to Low
                      </button>

                      <button
                        className="block w-full rounded px-3 py-[11px] text-left text-[13px] text-[#5f6258] hover:bg-[#f1f4ea] hover:text-[#42602f]"
                        onClick={() => {
                          setSortBy('rating');
                          setShowSort(false);
                        }}
                      >
                        Top Rated
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-[235px_minmax(0,1fr)] gap-[46px] max-[1100px]:grid-cols-[205px_minmax(0,1fr)] max-[1100px]:gap-7 max-[768px]:block">
              {/* DESKTOP FILTERS */}
              <aside className="sticky top-[90px] self-start border border-[rgba(48,64,42,.1)] bg-[#fffdf8] p-[23px] max-[1100px]:p-[18px] max-[768px]:hidden">
                <div className="flex items-start justify-between pb-5">
                  <div>
                    <span className="text-[11px] uppercase tracking-[1.5px] text-[#85847b]">
                      Shop
                    </span>

                    <h3 className="mt-[5px] font-['Playfair_Display',serif] text-[22px] font-medium text-[#293e24]">
                      Categories
                    </h3>
                  </div>

                  <Filter
                    size={18}
                    className="text-[#587246]"
                  />
                </div>

                <div className="flex flex-col [&>button]:flex [&>button]:items-center [&>button]:justify-between [&>button]:border-0 [&>button]:border-b [&>button]:border-[rgba(48,64,42,.07)] [&>button]:bg-transparent [&>button]:py-3 [&>button]:text-left [&>button]:text-[13px] [&>button]:text-[#6b6b63] [&>button]:transition-colors [&>button:hover]:text-[#466331]">
                  <button
                    className={
                      selectedCategory === 'all'
                        ? 'font-semibold text-[#466331]'
                        : ''
                    }
                    onClick={() =>
                      updateCategory('all')
                    }
                  >
                    <span>All products</span>
                    <ChevronRight size={15} />
                  </button>

                  {categories.map((category) => (
                    <button
                      key={category.id}
                      className={
                        selectedCategory === category.slug
                          ? 'font-semibold text-[#466331]'
                          : ''
                      }
                      onClick={() =>
                        updateCategory(category.slug)
                      }
                    >
                      <span>
                        {category.name
                          .split('(')[0]
                          .trim()}
                      </span>

                      <ChevronRight size={15} />
                    </button>
                  ))}
                </div>

                <div className="my-6 h-px bg-[rgba(48,64,42,.1)]" />

                <div className="bg-[#eef2e7] p-[17px] text-[#5d6a55]">
                  <Leaf
                    size={19}
                    className="mb-2 text-[#577445]"
                  />

                  <strong className="mb-[5px] block text-[13px] text-[#405735]">
                    Made with care
                  </strong>

                  <p className="m-0 text-[11px] leading-[1.65]">
                    Traditional recipes, genuine ingredients and
                    small-batch preparation.
                  </p>
                </div>
              </aside>

              {/* PRODUCTS */}
              <div className="min-w-0">
                {search && (
                  <div className="mb-[23px] flex items-center gap-[6px] text-[13px] text-[#7a7971]">
                    <span>
                      Search results for
                    </span>

                    <strong className="text-[#344a2b]">
                      “{search}”
                    </strong>

                    <button
                      className="ml-2 border-0 bg-transparent text-xs text-[#56723f] underline"
                      onClick={() =>
                        handleSearch('')
                      }
                    >
                      Clear
                    </button>
                  </div>
                )}

                {filteredProducts.length > 0 ? (
                  <div className="grid grid-cols-3 gap-x-5 gap-y-[27px] max-[1100px]:grid-cols-2 max-[768px]:gap-x-[11px] max-[768px]:gap-y-[22px] max-[480px]:gap-x-[9px] max-[480px]:gap-y-6">
                    {filteredProducts.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        onOpenDetail={setSelectedProduct}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="flex min-h-[430px] flex-col items-center justify-center text-center max-[480px]:min-h-[350px]">
                    <div className="flex h-[74px] w-[74px] items-center justify-center rounded-full bg-[#edf1e8] text-[#587346]">
                      <ShoppingBag size={34} />
                    </div>

                    <h2 className="my-[22px] mb-2 font-['Playfair_Display',serif] text-[28px] text-[#2c4026]">
                      Nothing found
                    </h2>

                    <p className="mb-5 text-sm text-[#77766f]">
                      We couldn't find products matching your selection.
                    </p>

                    <button
                      className="rounded-[3px] bg-[#496735] px-5 py-3 text-white"
                      onClick={clearFilters}
                    >
                      View all products
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* SHOP STORY BANNER */}
        <section className="pb-[100px] max-[768px]:pb-[60px]">
          <div className="mx-auto w-[min(calc(100%-48px),1240px)] max-[960px]:w-[calc(100%-36px)] max-[680px]:w-[calc(100%-28px)]">
            <div className="grid min-h-[490px] grid-cols-2 overflow-hidden bg-[#e7ebdf] max-[768px]:min-h-0 max-[768px]:grid-cols-1">
              <div className="min-h-[490px] max-[768px]:min-h-[280px]">
                <img
                  className="h-full w-full object-cover"
                  src={
                    products[0]?.images?.[0] ||
                    SHOP_CATEGORY_IMAGES[0]
                  }
                  alt="Traditional ManaDeshi food"
                  loading="lazy"
                />
              </div>

              <div className="flex flex-col items-start justify-center p-[70px] max-[1100px]:p-12 max-[768px]:px-[25px] max-[768px]:py-[42px] max-[768px]:pb-12 max-[480px]:px-5 max-[480px]:py-9 max-[480px]:pb-[42px]">
                <span className="text-[9px] font-extrabold uppercase tracking-[.16em] text-[var(--md-orange)]">
                  A taste of home
                </span>

                <h2 className="my-[13px] mb-5 font-['Playfair_Display',serif] text-[clamp(34px,4vw,52px)] font-normal leading-[1.05] text-[#2d4327] max-[768px]:text-[38px] max-[480px]:text-[34px]">
                  Simple ingredients.
                  <br />
                  <em className="block italic text-[#688052]">
                    Beautiful food.
                  </em>
                </h2>

                <p className="mb-7 max-w-[480px] text-[15px] leading-[1.8] text-[#687062] max-[768px]:text-sm">
                  Every ManaDeshi product begins with the belief that
                  traditional food should taste as familiar as the food
                  made at home.
                </p>

                <Link
                  to="/about"
                  className="inline-flex min-h-[47px] w-fit items-center gap-[9px] rounded-full border border-[var(--md-green)] bg-[var(--md-green)] px-[19px] text-[11px] font-extrabold text-white no-underline transition-transform duration-200 hover:-translate-y-0.5 hover:bg-[var(--md-green-dark)]"
                >
                  Discover our story
                  <ChevronRight size={17} />
                </Link>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </main>

      {/* MOBILE FILTER DRAWER */}
      {mobileFiltersOpen && (
        <div
          className="fixed inset-0 z-[200] flex justify-end bg-[rgba(25,32,22,.42)]"
          onClick={() =>
            setMobileFiltersOpen(false)
          }
        >
          <aside
            className="flex h-full w-[min(390px,90vw)] animate-[shopDrawerIn_.25s_ease_forwards] flex-col bg-[#fffdf8] shadow-[-15px_0_50px_rgba(20,30,20,.16)]"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <div className="flex items-center justify-between border-b border-[#e7e5dd] px-[22px] py-[26px]">
              <div>
                <span className="text-[11px] uppercase tracking-[1.5px] text-[#7d7d73]">
                  Shop
                </span>

                <h2 className="mt-1 font-['Playfair_Display',serif] text-[26px] font-medium text-[#293d24]">
                  Filters
                </h2>
              </div>

              <button
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[#deded5] bg-white text-[#4c4d47]"
                onClick={() =>
                  setMobileFiltersOpen(false)
                }
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-[22px] py-[25px]">
              <span className="mb-2.5 block text-[11px] font-semibold uppercase tracking-[1.2px] text-[#77776e]">
                Categories
              </span>

              <button
                className={`block w-full border-0 border-b border-[#eceae2] bg-transparent py-[14px] text-left text-sm text-[#686861] ${
                  selectedCategory === 'all'
                    ? 'font-bold text-[#496735]'
                    : ''
                }`}
                onClick={() =>
                  updateCategory('all')
                }
              >
                All products
              </button>

              {categories.map((category) => (
                <button
                  key={category.id}
                  className={`block w-full border-0 border-b border-[#eceae2] bg-transparent py-[14px] text-left text-sm text-[#686861] ${
                    selectedCategory === category.slug
                      ? 'font-bold text-[#496735]'
                      : ''
                  }`}
                  onClick={() =>
                    updateCategory(category.slug)
                  }
                >
                  {category.name
                    .split('(')[0]
                    .trim()}
                </button>
              ))}

              <div className="my-[25px] h-px bg-[#e4e3db]" />

              <span className="mb-2.5 block text-[11px] font-semibold uppercase tracking-[1.2px] text-[#77776e]">
                Sort by
              </span>

              {[
                ['featured', 'Featured'],
                ['price_asc', 'Price: Low to High'],
                ['price_desc', 'Price: High to Low'],
                ['rating', 'Top Rated'],
              ].map(([value, label]) => (
                <button
                  key={value}
                  className={`block w-full border-0 border-b border-[#eceae2] bg-transparent py-[14px] text-left text-sm text-[#686861] ${
                    sortBy === value
                      ? 'font-bold text-[#496735]'
                      : ''
                  }`}
                  onClick={() => {
                    setSortBy(value);
                    setMobileFiltersOpen(false);
                  }}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-[1fr_1.5fr] gap-2.5 border-t border-[#e4e3db] bg-[#fffdf8] px-[22px] py-[17px]">
              <button
                className="h-[47px] rounded-[3px] border border-[#d9d9d1] bg-white text-[13px] text-[#5f6259]"
                onClick={clearFilters}
              >
                Clear all
              </button>

              <button
                className="h-[47px] rounded-[3px] border-0 bg-[#496735] text-[13px] text-white"
                onClick={() =>
                  setMobileFiltersOpen(false)
                }
              >
                Show {filteredProducts.length} products
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* PRODUCT DETAIL */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() =>
          setSelectedProduct(null)
        }
        onBuyNow={() => {
          setSelectedProduct(null);
        }}
      />
    </div>
  );
}

export default ShopPage;