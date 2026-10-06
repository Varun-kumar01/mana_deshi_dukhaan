
import { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronRight,
  Heart,
  Leaf,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Star,
  Truck,
  X,
} from 'lucide-react';
import {
  Link,
  useNavigate,
  useParams,
} from 'react-router-dom';

import { TopBar } from '../components/TopBar';
import { ProductCard } from '../components/ProductCard';
import { Footer } from '../components/Footer';

import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';

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
  ProductVariant,
  Category,
} from '../types';

const PRODUCT_REVIEWS = [
  {
    name: 'Ravi Teja',
    location: 'Gachibowli',
    rating: 5,
    text: 'Tastes exactly like homemade food. The flavour is authentic and the quality is excellent.',
  },
  {
    name: 'Srilatha Reddy',
    location: 'Manikonda',
    rating: 5,
    text: 'Really loved the freshness and traditional taste. Will definitely order again.',
  },
  {
    name: 'Venkatesh Murthy',
    location: 'Banjara Hills',
    rating: 4,
    text: 'Good packaging, great taste and arrived fresh. Very happy with the purchase.',
  },
];

export function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const {
    addToCart,
  } = useCart();

  const {
    isLoggedIn,
    setIsAuthModalOpen,
  } = useAuth();

  const {
    isWishlisted,
    toggleWishlist,
  } = useWishlist();

  const [products, setProducts] = useState<Product[]>(fallbackProducts);
  const [categories, setCategories] = useState<Category[]>(
    fallbackCategories
  );

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [isAdded, setIsAdded] = useState(false);

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
    setSelectedImage(0);
    setSelectedVariantIndex(0);
    setQuantity(1);
    setIsAdded(false);

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }, [id]);

  const product = useMemo(
    () =>
      products.find(
        (item) => String(item.id) === String(id)
      ),
    [products, id]
  );

  const relatedProducts = useMemo(() => {
    if (!product) return [];

    return products
      .filter(
        (item) =>
          item.id !== product.id &&
          (
            item.category_id === product.category_id ||
            item.category_slug === product.category_slug
          )
      )
      .slice(0, 4);
  }, [products, product]);

  const category = categories.find(
    (item) =>
      item.id === product?.category_id ||
      item.slug === product?.category_slug
  );

  if (!product) {
    return (
      <div className="app-shell">
        <TopBar
          products={products}
          onSelectProduct={(selected) =>
            navigate(`/product/${selected.id}`)
          }
          isAdminView={false}
        />

        <main className="product-not-found">
          <div className="product-not-found-inner">
            <ShoppingBag size={42} />
            <span className="section-eyebrow">
              ManaDeshi Dukaan
            </span>
            <h1>Product not found</h1>
            <p>
              This product may have been removed or is no longer
              available.
            </p>

            <Link
              to="/shop"
              className="product-back-button"
            >
              <ArrowLeft size={16} />
              Back to shop
            </Link>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  const productWithVariants = product as Product & {
    variants?: ProductVariant[];
  };

  const variants = productWithVariants.variants || [];

  const selectedVariant =
    variants[selectedVariantIndex];

  const displayPrice =
    selectedVariant?.price ??
    product.base_price;

  const images =
    product.images?.filter(Boolean).length
      ? product.images.filter(Boolean)
      : [
          'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=1200&q=90',
        ];

  const categoryName =
    category?.name ||
    product.category_name ||
    'Traditional Foods';

  const rating = product.rating || 5;

  const handleWishlist = () => {
    if (!isLoggedIn) {
      setIsAuthModalOpen(true);
      return;
    }

    toggleWishlist(product.id);
  };

  const createFallbackVariant = (): ProductVariant => {
    return {
      id: product.id,
      product_id: product.id,
      name: 'Standard',
      price: product.base_price,
    } as ProductVariant;
  };

  const handleAddToCart = () => {
    const variant =
      selectedVariant || createFallbackVariant();

    addToCart(
      product,
      variant,
      quantity
    );

    setIsAdded(true);

    window.setTimeout(() => {
      setIsAdded(false);
    }, 1800);
  };

  const handleBuyNow = () => {
    const variant =
      selectedVariant || createFallbackVariant();

    addToCart(
      product,
      variant,
      quantity
    );

    navigate('/checkout');
  };

  return (
    <div className="app-shell">
      <TopBar
        products={products}
        onSelectProduct={(selected) =>
          navigate(`/product/${selected.id}`)
        }
        isAdminView={false}
      />

      <main className="product-page">

        {/* =====================================================
            BREADCRUMBS
        ===================================================== */}

        <div className="site-container product-breadcrumbs">
          <Link to="/">Home</Link>
          <ChevronRight size={14} />
          <Link to="/shop">Shop</Link>
          <ChevronRight size={14} />

          {product.category_slug ? (
            <>
              <Link
                to={`/category/${product.category_slug}`}
              >
                {categoryName}
              </Link>
              <ChevronRight size={14} />
            </>
          ) : null}

          <span>{product.name}</span>
        </div>

        {/* =====================================================
            PRODUCT MAIN
        ===================================================== */}

        <section className="product-main-section">
          <div className="site-container product-main-grid">

            {/* IMAGE GALLERY */}

            <div className="product-gallery">

              <div className="product-thumbnails">
                {images.map((image, index) => (
                  <button
                    key={`${image}-${index}`}
                    type="button"
                    className={`product-thumbnail ${
                      selectedImage === index
                        ? 'active'
                        : ''
                    }`}
                    onClick={() =>
                      setSelectedImage(index)
                    }
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                    />
                  </button>
                ))}
              </div>

              <div className="product-main-image-wrap">

                <img
                  src={images[selectedImage]}
                  alt={product.name}
                  className="product-main-image"
                />

                <button
                  type="button"
                  className={`product-image-wishlist ${
                    isWishlisted(product.id)
                      ? 'active'
                      : ''
                  }`}
                  onClick={handleWishlist}
                  aria-label="Add to wishlist"
                >
                  <Heart
                    size={21}
                    fill={
                      isWishlisted(product.id)
                        ? 'currentColor'
                        : 'none'
                    }
                  />
                </button>

                <div className="product-image-badge">
                  <Leaf size={13} />
                  Homemade
                </div>

                {images.length > 1 && (
                  <>
                    <button
                      type="button"
                      className="product-image-arrow left"
                      onClick={() =>
                        setSelectedImage(
                          selectedImage === 0
                            ? images.length - 1
                            : selectedImage - 1
                        )
                      }
                    >
                      <ArrowLeft size={18} />
                    </button>

                    <button
                      type="button"
                      className="product-image-arrow right"
                      onClick={() =>
                        setSelectedImage(
                          selectedImage === images.length - 1
                            ? 0
                            : selectedImage + 1
                        )
                      }
                    >
                      <ArrowRight size={18} />
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* PRODUCT INFORMATION */}

            <div className="product-information">

              <div className="product-category-label">
                {categoryName}
              </div>

              <h1>{product.name}</h1>

              {product.tagline && (
                <p className="product-tagline-large">
                  {product.tagline}
                </p>
              )}

              <div className="product-rating-row">
                <div className="product-stars">
                  {Array.from({ length: 5 }).map(
                    (_, index) => (
                      <Star
                        key={index}
                        size={16}
                        fill={
                          index < Math.round(rating)
                            ? 'currentColor'
                            : 'none'
                        }
                      />
                    )
                  )}
                </div>

                <strong>
                  {rating.toFixed(1)}
                </strong>

                <span>
                  {PRODUCT_REVIEWS.length} verified reviews
                </span>
              </div>

              <div className="product-price-block">
                <span className="product-price">
                  ₹{displayPrice.toFixed(0)}
                </span>

                {product.compare_at_price &&
                  product.compare_at_price >
                    displayPrice && (
                    <span className="product-compare-price">
                      ₹{product.compare_at_price.toFixed(0)}
                    </span>
                  )}

                {product.compare_at_price &&
                  product.compare_at_price >
                    displayPrice && (
                    <span className="product-discount">
                      {Math.round(
                        (
                          1 -
                          displayPrice /
                            product.compare_at_price
                        ) * 100
                      )}
                      % OFF
                    </span>
                  )}
              </div>

              <div className="product-tax-note">
                Inclusive of applicable taxes
              </div>

              {/* VARIANTS */}

              {variants.length > 0 && (
                <div className="product-option-section">
                  <div className="product-option-heading">
                    <span>Choose quantity</span>
                    <strong>
                      {selectedVariant?.name}
                    </strong>
                  </div>

                  <div className="product-variants">
                    {variants.map((variant, index) => (
                      <button
                        key={variant.id}
                        type="button"
                        className={`product-variant ${
                          selectedVariantIndex === index
                            ? 'active'
                            : ''
                        }`}
                        onClick={() =>
                          setSelectedVariantIndex(index)
                        }
                      >
                        <span>
                          {variant.name}
                        </span>

                        <strong>
                          ₹{variant.price.toFixed(0)}
                        </strong>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* QUANTITY */}

              <div className="product-buy-row">

                <div className="product-quantity">
                  <button
                    type="button"
                    onClick={() =>
                      setQuantity(
                        Math.max(1, quantity - 1)
                      )
                    }
                  >
                    <Minus size={15} />
                  </button>

                  <span>{quantity}</span>

                  <button
                    type="button"
                    onClick={() =>
                      setQuantity(
                        Math.min(20, quantity + 1)
                      )
                    }
                  >
                    <Plus size={15} />
                  </button>
                </div>

                <button
                  type="button"
                  className={`product-add-button ${
                    isAdded ? 'added' : ''
                  }`}
                  onClick={handleAddToCart}
                >
                  {isAdded ? (
                    <>
                      <Check size={18} />
                      Added to cart
                    </>
                  ) : (
                    <>
                      <ShoppingBag size={18} />
                      Add to cart
                    </>
                  )}
                </button>

              </div>

              <button
                type="button"
                className="product-buy-button"
                onClick={handleBuyNow}
              >
                Buy it now
                <ArrowRight size={18} />
              </button>

              {/* TRUST STRIP */}

              <div className="product-trust-grid">

                <div>
                  <Truck size={20} />
                  <span>
                    <strong>Fast delivery</strong>
                    Hyderabad delivery available
                  </span>
                </div>

                <div>
                  <ShieldCheck size={20} />
                  <span>
                    <strong>Quality assured</strong>
                    Carefully packed for freshness
                  </span>
                </div>

                <div>
                  <Leaf size={20} />
                  <span>
                    <strong>Traditional recipes</strong>
                    Made with familiar ingredients
                  </span>
                </div>

              </div>

            </div>
          </div>
        </section>

        {/* =====================================================
            PRODUCT STORY
        ===================================================== */}

        <section className="product-story-section">
          <div className="site-container">

            <div className="product-story-tabs">
              {[
                ['description', 'Description'],
                ['ingredients', 'Ingredients'],
                ['making', 'How it is made'],
                ['reviews', 'Reviews'],
              ].map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  className={
                    activeTab === key
                      ? 'active'
                      : ''
                  }
                  onClick={() =>
                    setActiveTab(key)
                  }
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="product-story-content">

              {activeTab === 'description' && (
                <div className="product-tab-grid">
                  <div>
                    <span className="section-eyebrow">
                      From our kitchen
                    </span>

                    <h2>
                      Made to taste like
                      <em> home.</em>
                    </h2>
                  </div>

                  <div>
                    <p>
                      {product.description ||
                        product.tagline ||
                        `Our ${product.name} is prepared with traditional recipes and carefully selected ingredients. Every batch is made with the familiar flavours of home in mind.`}
                    </p>

                    <p>
                      We keep things simple — good ingredients,
                      thoughtful preparation and the kind of
                      flavour that belongs on an everyday
                      family table.
                    </p>
                  </div>
                </div>
              )}

              {activeTab === 'ingredients' && (
                <div className="product-tab-single">
                  <span className="section-eyebrow">
                    Simple ingredients
                  </span>

                  <h2>
                    Nothing complicated.
                  </h2>

                  <div className="ingredient-list">
                    {[
                      'Quality ingredients',
                      'Traditional spices',
                      'No unnecessary shortcuts',
                      'Small-batch preparation',
                    ].map((item) => (
                      <div key={item}>
                        <Check size={16} />
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'making' && (
                <div className="product-tab-grid">
                  <div>
                    <span className="section-eyebrow">
                      Our process
                    </span>

                    <h2>
                      Prepared with
                      <em> patience.</em>
                    </h2>
                  </div>

                  <div className="making-steps">
                    {[
                      ['01', 'Select', 'We begin with carefully chosen ingredients.'],
                      ['02', 'Prepare', 'Traditional preparation methods preserve the familiar flavour.'],
                      ['03', 'Pack', 'Each order is packed carefully for freshness.'],
                    ].map(([number, title, text]) => (
                      <div key={number}>
                        <span>{number}</span>
                        <div>
                          <strong>{title}</strong>
                          <p>{text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="product-reviews-grid">
                  {PRODUCT_REVIEWS.map((review) => (
                    <article
                      key={review.name}
                      className="product-review-card"
                    >
                      <div className="product-review-stars">
                        {Array.from({ length: 5 }).map(
                          (_, index) => (
                            <Star
                              key={index}
                              size={14}
                              fill={
                                index < review.rating
                                  ? 'currentColor'
                                  : 'none'
                              }
                            />
                          )
                        )}
                      </div>

                      <p>“{review.text}”</p>

                      <strong>{review.name}</strong>
                      <span>{review.location}</span>
                    </article>
                  ))}
                </div>
              )}

            </div>
          </div>
        </section>

        {/* =====================================================
            RELATED PRODUCTS
        ===================================================== */}

        {relatedProducts.length > 0 && (
          <section className="product-related-section">
            <div className="site-container">

              <div className="section-heading-row">
                <div>
                  <span className="section-eyebrow">
                    You may also like
                  </span>

                  <h2>
                    More from this
                    <em> collection.</em>
                  </h2>
                </div>

                {product.category_slug && (
                  <Link
                    to={`/category/${product.category_slug}`}
                    className="section-link"
                  >
                    View collection
                    <ArrowRight size={16} />
                  </Link>
                )}
              </div>

              <div className="product-related-grid">
                {relatedProducts.map((item) => (
                  <ProductCard
                    key={item.id}
                    product={item}
                    onClick={() =>
                      navigate(`/product/${item.id}`)
                    }
                  />
                ))}
              </div>

            </div>
          </section>
        )}

        {/* =====================================================
            FINAL CTA
        ===================================================== */}

        <section className="product-final-cta">
          <div className="site-container product-final-cta-inner">

            <div>
              <span className="section-eyebrow">
                ManaDeshi Dukaan
              </span>

              <h2>
                Bring a little
                <em> home</em>
                to your table.
              </h2>

              <p>
                Traditional foods, thoughtfully made
                for everyday homes.
              </p>
            </div>

            <Link
              to="/shop"
              className="product-cta-button"
            >
              Continue shopping
              <ArrowRight size={17} />
            </Link>

          </div>
        </section>

        <Footer />
      </main>

      {/* MOBILE PURCHASE BAR */}

      <div className="product-mobile-buybar">
        <div>
          <span>₹{displayPrice.toFixed(0)}</span>
          <small>{product.name}</small>
        </div>

        <button
          type="button"
          onClick={handleAddToCart}
        >
          <ShoppingBag size={17} />
          Add
        </button>
      </div>
    </div>
  );
}

export default ProductPage;
```