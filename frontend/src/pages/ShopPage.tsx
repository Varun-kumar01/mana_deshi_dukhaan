import { useEffect, useMemo, useState } from 'react';
import {
  ChevronDown,
  ChevronRight,
  Filter,
  Search,
  SlidersHorizontal,
  X,
  ShoppingBag,
} from 'lucide-react';
import { useSearchParams, Link } from 'react-router-dom';

import { TopBar } from '../components/TopBar';
import { ProductCard } from '../components/ProductCard';
import { ProductDetailModal } from '../components/ProductDetailModal';
import { Footer } from '../components/Footer';

import { fetchProducts, fetchCategories } from '../services/api';
import {
  fallbackCategories,
  fallbackProducts,
} from '../data/mockData';

import { Product, Category } from '../types';

const SHOP_CATEGORY_IMAGES = [
  'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=900&q=85',
  'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=900&q=85',
  'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=900&q=85',
  'https://images.unsplash.com/photo-1589927986089-35812388d1f4?auto=format&fit=crop&w=900&q=85',
  'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=900&q=85',
  'https://images.unsplash.com/photo-1599785209707-a456fc1337bb?auto=format&fit=crop&w=900&q=85',
];

export function ShopPage() {
  const [searchParams, setSearchParams] =
    useSearchParams();

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
        return (
          a.base_price - b.base_price
        );
      }

      if (sortBy === 'price_desc') {
        return (
          b.base_price - a.base_price
        );
      }

      if (sortBy === 'rating') {
        return (
          (b.rating || 5) -
          (a.rating || 5)
        );
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
        category.slug === selectedCategory
    );

  const updateCategory = (
    category: string
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
    value: string
  ) => {
    setSearch(value);

    const params = new URLSearchParams();

    if (selectedCategory !== 'all') {
      params.set(
        'category',
        selectedCategory
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
    <div className="app-shell">

      <TopBar
        products={products}
        onSelectProduct={
          setSelectedProduct
        }
        isAdminView={false}
      />

      <main className="shop-page">

        {/* =====================================================
            SHOP HERO
        ===================================================== */}

        <section className="shop-page-hero">

          <div className="site-container">

            <div className="shop-breadcrumbs">
              <Link to="/">
                Home
              </Link>

              <ChevronRight size={14} />

              <span>
                Shop
              </span>

              {categoryName && (
                <>
                  <ChevronRight
                    size={14}
                  />

                  <span>
                    {categoryName}
                  </span>
                </>
              )}
            </div>

            <div className="shop-hero-content">

              <div>
                <span className="section-eyebrow">
                  ManaDeshi Dukaan
                </span>

                <h1>
                  {categoryName ||
                    'Shop our collection'}
                </h1>

                <p>
                  Traditional favourites,
                  homemade goodness and
                  everyday essentials,
                  prepared with care.
                </p>
              </div>

              <div className="shop-hero-decoration">
                <div className="shop-hero-circle">
                  <span>
                    Made with
                  </span>

                  <strong>
                    ♥
                  </strong>

                  <span>
                    at home
                  </span>
                </div>
              </div>

            </div>

          </div>

        </section>

        {/* =====================================================
            CATEGORY STRIP
        ===================================================== */}

        <section className="shop-category-strip">

          <div className="site-container">

            <div className="shop-category-scroll">

              <button
                className={
                  selectedCategory ===
                  'all'
                    ? 'shop-category-pill active'
                    : 'shop-category-pill'
                }
                onClick={() =>
                  updateCategory('all')
                }
              >
                All products
              </button>

              {categories.map(
                (category, index) => (
                  <button
                    key={category.id}
                    className={
                      selectedCategory ===
                      category.slug
                        ? 'shop-category-pill active'
                        : 'shop-category-pill'
                    }
                    onClick={() =>
                      updateCategory(
                        category.slug
                      )
                    }
                  >
                    <span className="shop-pill-image">
                      <img
                        src={
                          SHOP_CATEGORY_IMAGES[
                            index %
                              SHOP_CATEGORY_IMAGES.length
                          ]
                        }
                        alt=""
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

        {/* =====================================================
            SHOP CONTENT
        ===================================================== */}

        <section className="shop-products-section">

          <div className="site-container">

            {/* Desktop / Mobile toolbar */}

            <div className="shop-toolbar">

              <div className="shop-result-count">

                <strong>
                  {filteredProducts.length}
                </strong>

                <span>
                  products
                </span>

              </div>

              <div className="shop-toolbar-actions">

                <div className="shop-search">

                  <Search size={17} />

                  <input
                    type="text"
                    value={search}
                    onChange={(event) =>
                      handleSearch(
                        event.target.value
                      )
                    }
                    placeholder="Search products..."
                  />

                  {search && (
                    <button
                      onClick={() =>
                        handleSearch('')
                      }
                      aria-label="Clear search"
                    >
                      <X size={15} />
                    </button>
                  )}

                </div>

                <button
                  className="mobile-filter-button"
                  onClick={() =>
                    setMobileFiltersOpen(
                      true
                    )
                  }
                >
                  <SlidersHorizontal
                    size={17}
                  />
                  Filters
                </button>

                <div className="shop-sort-wrapper">

                  <button
                    className="shop-sort-button"
                    onClick={() =>
                      setShowSort(
                        (value) => !value
                      )
                    }
                  >
                    <span>
                      Sort:
                    </span>

                    <strong>
                      {sortBy ===
                      'price_asc'
                        ? 'Price low to high'
                        : sortBy ===
                          'price_desc'
                        ? 'Price high to low'
                        : sortBy ===
                          'rating'
                        ? 'Top rated'
                        : 'Featured'}
                    </strong>

                    <ChevronDown
                      size={16}
                    />
                  </button>

                  {showSort && (
                    <div className="shop-sort-menu">

                      <button
                        onClick={() => {
                          setSortBy(
                            'featured'
                          );
                          setShowSort(false);
                        }}
                      >
                        Featured
                      </button>

                      <button
                        onClick={() => {
                          setSortBy(
                            'price_asc'
                          );
                          setShowSort(false);
                        }}
                      >
                        Price: Low to High
                      </button>

                      <button
                        onClick={() => {
                          setSortBy(
                            'price_desc'
                          );
                          setShowSort(false);
                        }}
                      >
                        Price: High to Low
                      </button>

                      <button
                        onClick={() => {
                          setSortBy(
                            'rating'
                          );
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

            {/* =================================================
                PRODUCTS LAYOUT
            ================================================= */}

            <div className="shop-layout">

              {/* Desktop filters */}

              <aside className="shop-sidebar">

                <div className="shop-sidebar-header">
                  <div>
                    <span>
                      Shop
                    </span>

                    <h3>
                      Categories
                    </h3>
                  </div>

                  <Filter size={18} />
                </div>

                <div className="shop-sidebar-list">

                  <button
                    className={
                      selectedCategory ===
                      'all'
                        ? 'active'
                        : ''
                    }
                    onClick={() =>
                      updateCategory('all')
                    }
                  >
                    <span>
                      All products
                    </span>

                    <ChevronRight
                      size={15}
                    />
                  </button>

                  {categories.map(
                    (category) => (
                      <button
                        key={category.id}
                        className={
                          selectedCategory ===
                          category.slug
                            ? 'active'
                            : ''
                        }
                        onClick={() =>
                          updateCategory(
                            category.slug
                          )
                        }
                      >
                        <span>
                          {category.name
                            .split('(')[0]
                            .trim()}
                        </span>

                        <ChevronRight
                          size={15}
                        />
                      </button>
                    )
                  )}

                </div>

                <div className="shop-sidebar-divider" />

                <div className="shop-sidebar-note">

                  <Leaf size={19} />

                  <strong>
                    Made with care
                  </strong>

                  <p>
                    Traditional recipes,
                    genuine ingredients
                    and small-batch
                    preparation.
                  </p>

                </div>

              </aside>

              {/* Products */}

              <div className="shop-product-area">

                {search && (
                  <div className="shop-active-search">

                    <span>
                      Search results for
                    </span>

                    <strong>
                      “{search}”
                    </strong>

                    <button
                      onClick={() =>
                        handleSearch('')
                      }
                    >
                      Clear
                    </button>

                  </div>
                )}

                {filteredProducts.length >
                0 ? (
                  <div className="shop-product-grid">

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
                  <div className="shop-empty-state">

                    <div>
                      <ShoppingBag
                        size={34}
                      />
                    </div>

                    <h2>
                      Nothing found
                    </h2>

                    <p>
                      We couldn't find
                      products matching
                      your selection.
                    </p>

                    <button
                      onClick={
                        clearFilters
                      }
                    >
                      View all products
                    </button>

                  </div>
                )}

              </div>

            </div>

          </div>

        </section>

        {/* =====================================================
            SHOP STORY BANNER
        ===================================================== */}

        <section className="shop-story-banner">

          <div className="site-container">

            <div className="shop-story-inner">

              <div className="shop-story-image">
                <img
                  src={
                    products[0]?.images?.[0] ||
                    SHOP_CATEGORY_IMAGES[0]
                  }
                  alt="Traditional ManaDeshi food"
                  loading="lazy"
                />
              </div>

              <div className="shop-story-content">

                <span className="section-eyebrow">
                  A taste of home
                </span>

                <h2>
                  Simple ingredients.
                  <br />
                  <em>Beautiful food.</em>
                </h2>

                <p>
                  Every ManaDeshi product
                  begins with the belief
                  that traditional food
                  should taste as familiar
                  as the food made at home.
                </p>

                <Link
                  to="/about"
                  className="home-primary-button"
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

      {/* =====================================================
          MOBILE FILTER DRAWER
      ===================================================== */}

      {mobileFiltersOpen && (
        <div
          className="mobile-filter-overlay"
          onClick={() =>
            setMobileFiltersOpen(false)
          }
        >
          <aside
            className="mobile-filter-drawer"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <div className="mobile-filter-header">

              <div>
                <span>
                  Shop
                </span>

                <h2>
                  Filters
                </h2>
              </div>

              <button
                onClick={() =>
                  setMobileFiltersOpen(
                    false
                  )
                }
              >
                <X size={20} />
              </button>

            </div>

            <div className="mobile-filter-content">

              <span className="mobile-filter-label">
                Categories
              </span>

              <button
                className={
                  selectedCategory ===
                  'all'
                    ? 'mobile-filter-option active'
                    : 'mobile-filter-option'
                }
                onClick={() =>
                  updateCategory('all')
                }
              >
                All products
              </button>

              {categories.map(
                (category) => (
                  <button
                    key={category.id}
                    className={
                      selectedCategory ===
                      category.slug
                        ? 'mobile-filter-option active'
                        : 'mobile-filter-option'
                    }
                    onClick={() =>
                      updateCategory(
                        category.slug
                      )
                    }
                  >
                    {category.name
                      .split('(')[0]
                      .trim()}
                  </button>
                )
              )}

              <div className="mobile-filter-divider" />

              <span className="mobile-filter-label">
                Sort by
              </span>

              {[
                [
                  'featured',
                  'Featured',
                ],
                [
                  'price_asc',
                  'Price: Low to High',
                ],
                [
                  'price_desc',
                  'Price: High to Low',
                ],
                [
                  'rating',
                  'Top Rated',
                ],
              ].map(([value, label]) => (
                <button
                  key={value}
                  className={
                    sortBy === value
                      ? 'mobile-filter-option active'
                      : 'mobile-filter-option'
                  }
                  onClick={() => {
                    setSortBy(value);
                    setMobileFiltersOpen(
                      false
                    );
                  }}
                >
                  {label}
                </button>
              ))}

            </div>

            <div className="mobile-filter-footer">

              <button
                className="mobile-filter-clear"
                onClick={clearFilters}
              >
                Clear all
              </button>

              <button
                className="mobile-filter-apply"
                onClick={() =>
                  setMobileFiltersOpen(
                    false
                  )
                }
              >
                Show{' '}
                {filteredProducts.length}{' '}
                products
              </button>

            </div>

          </aside>
        </div>
      )}

      {/* =====================================================
          PRODUCT DETAIL
      ===================================================== */}

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