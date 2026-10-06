import { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  ChevronRight,
  Leaf,
  SlidersHorizontal,
  Star,
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
  const { slug } = useParams<{
    slug: string;
  }>();

  const [products, setProducts] =
    useState<Product[]>(fallbackProducts);

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
        // Keep fallback data.
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
    (item) => item.slug === slug
  );

  const categoryName =
    category?.name
      ?.split('(')[0]
      .trim() ||
    slug
      ?.replace(/-/g, ' ') ||
    'Collection';

  const bannerImage =
    (slug && CATEGORY_BANNERS[slug]) ||
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

    result = [...result].sort((a, b) => {
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

      return 0;
    });

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
    <div className="app-shell">

      <TopBar
        products={products}
        onSelectProduct={
          setSelectedProduct
        }
        isAdminView={false}
      />

      <main className="category-page">

        {/* =====================================================
            BREADCRUMB
        ===================================================== */}

        <div className="site-container">

          <div className="category-breadcrumbs">

            <Link to="/">
              Home
            </Link>

            <ChevronRight size={14} />

            <Link to="/shop">
              Shop
            </Link>

            <ChevronRight size={14} />

            <span>
              {categoryName}
            </span>

          </div>

        </div>

        {/* =====================================================
            CATEGORY HERO
        ===================================================== */}

        <section className="category-hero">

          <div className="category-hero-image">
            <img
              src={bannerImage}
              alt={categoryName}
            />
          </div>

          <div className="category-hero-overlay" />

          <div className="site-container category-hero-container">

            <div className="category-hero-copy">

              <span className="section-eyebrow">
                ManaDeshi collection
              </span>

              <h1>
                {categoryName}
              </h1>

              <p>
                {description}
              </p>

              <div className="category-hero-meta">

                <span>
                  <Leaf size={15} />
                  Traditional recipes
                </span>

                <span>
                  <span className="category-dot" />
                  Made with care
                </span>

              </div>

            </div>

          </div>

        </section>

        {/* =====================================================
            CATEGORY INTRO
        ===================================================== */}

        <section className="category-intro">

          <div className="site-container">

            <div className="category-intro-grid">

              <div>

                <span className="section-eyebrow">
                  From our kitchen
                </span>

                <h2>
                  The kind of food
                  <br />
                  you remember.
                </h2>

              </div>

              <div>

                <p>
                  We make food that belongs
                  on everyday tables — familiar
                  flavours, honest ingredients
                  and recipes inspired by the
                  kitchens we grew up around.
                </p>

                <Link
                  to="/about"
                  className="category-story-link"
                >
                  Learn about our story
                  <ArrowRight size={16} />
                </Link>

              </div>

            </div>

          </div>

        </section>

        {/* =====================================================
            PRODUCTS
        ===================================================== */}

        <section className="category-products">

          <div className="site-container">

            <div className="category-products-header">

              <div>

                <span className="section-eyebrow">
                  Shop {categoryName}
                </span>

                <h2>
                  Our {categoryName}
                </h2>

                <p>
                  {categoryProducts.length}{' '}
                  products in this collection
                </p>

              </div>

              <div className="category-sort">

                <SlidersHorizontal
                  size={16}
                />

                <select
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
                    Price: Low to High
                  </option>

                  <option value="price_desc">
                    Price: High to Low
                  </option>

                  <option value="rating">
                    Top Rated
                  </option>
                </select>

              </div>

            </div>

            {displayedProducts.length >
            0 ? (
              <div className="category-product-grid">

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
              <div className="category-empty">

                <div>
                  <Leaf size={30} />
                </div>

                <h3>
                  More goodness is coming.
                </h3>

                <p>
                  We don't have products in
                  this collection yet.
                </p>

                <Link to="/shop">
                  Explore all products
                </Link>

              </div>
            )}

            {categoryProducts.length >
              8 && (
              <div className="category-view-more">

                <button
                  onClick={() =>
                    setShowAll(
                      (value) => !value
                    )
                  }
                >
                  {showAll
                    ? 'Show fewer products'
                    : `View all ${categoryProducts.length} products`}

                  <ArrowRight
                    size={16}
                  />
                </button>

              </div>
            )}

          </div>

        </section>

        {/* =====================================================
            CATEGORY BENEFITS
        ===================================================== */}

        <section className="category-benefits">

          <div className="site-container">

            <div className="category-benefits-heading">

              <span className="section-eyebrow">
                Why ManaDeshi
              </span>

              <h2>
                Good food starts
                <br />
                with good choices.
              </h2>

            </div>

            <div className="category-benefits-grid">

              <article>
                <div className="category-benefit-number">
                  01
                </div>

                <Leaf size={23} />

                <h3>
                  Genuine ingredients
                </h3>

                <p>
                  We believe simple food
                  tastes best when you start
                  with ingredients you trust.
                </p>
              </article>

              <article>
                <div className="category-benefit-number">
                  02
                </div>

                <Star
                  size={23}
                  fill="currentColor"
                />

                <h3>
                  Traditional flavours
                </h3>

                <p>
                  Familiar recipes and
                  flavours inspired by the
                  food we grew up eating.
                </p>
              </article>

              <article>
                <div className="category-benefit-number">
                  03
                </div>

                <Leaf size={23} />

                <h3>
                  Made with care
                </h3>

                <p>
                  Every product is prepared
                  with attention to freshness,
                  quality and consistency.
                </p>
              </article>

            </div>

          </div>

        </section>

        {/* =====================================================
            RELATED CATEGORIES
        ===================================================== */}

        {relatedCategories.length > 0 && (
          <section className="related-category-section">

            <div className="site-container">

              <div className="related-category-heading">

                <div>
                  <span className="section-eyebrow">
                    Keep exploring
                  </span>

                  <h2>
                    More from our kitchen
                  </h2>
                </div>

                <Link to="/shop">
                  View all
                  <ArrowRight size={16} />
                </Link>

              </div>

              <div className="related-category-grid">

                {relatedCategories
                  .slice(0, 4)
                  .map(
                    (
                      relatedCategory,
                      index
                    ) => (
                      <Link
                        key={
                          relatedCategory.id
                        }
                        to={`/category/${relatedCategory.slug}`}
                        className="related-category-card"
                      >
                        <img
                          src={
                            [
                              CATEGORY_BANNERS.pickles,
                              CATEGORY_BANNERS.powders,
                              CATEGORY_BANNERS.snacks,
                              CATEGORY_BANNERS.sweets,
                            ][
                              index % 4
                            ]
                          }
                          alt={
                            relatedCategory.name
                          }
                          loading="lazy"
                        />

                        <div>
                          <span>
                            Explore
                          </span>

                          <h3>
                            {
                              relatedCategory.name
                                .split(
                                  '('
                                )[0]
                                .trim()
                            }
                          </h3>

                          <ChevronRight
                            size={18}
                          />
                        </div>
                      </Link>
                    )
                  )}

              </div>

            </div>

          </section>
        )}

        {/* =====================================================
            FINAL CTA
        ===================================================== */}

        <section className="category-final-cta">

          <div className="site-container">

            <div>

              <span className="section-eyebrow">
                ManaDeshi Dukaan
              </span>

              <h2>
                Bring home the
                <em>
                  flavours you love.
                </em>
              </h2>

              <p>
                Explore the complete
                ManaDeshi collection.
              </p>

              <Link
                to="/shop"
                className="home-light-button"
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

export default CategoryPage;