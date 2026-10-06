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
} from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import { TopBar } from '../components/TopBar';
import { ProductCard } from '../components/ProductCard';
import { Footer } from '../components/Footer';

import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';

import { fetchProducts, fetchCategories } from '../services/api';
import { fallbackCategories, fallbackProducts } from '../data/mockData';

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

  const { addToCart } = useCart();
  const { isLoggedIn, setIsAuthModalOpen } = useAuth();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [products, setProducts] = useState<Product[]>(fallbackProducts);
  const [categories, setCategories] =
    useState<Category[]>(fallbackCategories);

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
        (item) => String(item.id) === String(id),
      ),
    [products, id],
  );

  const relatedProducts = useMemo(() => {
    if (!product) return [];

    return products
      .filter(
        (item) =>
          item.id !== product.id &&
          (item.category_id === product.category_id ||
            item.category_slug === product.category_slug),
      )
      .slice(0, 4);
  }, [products, product]);

  const category = categories.find(
    (item) =>
      item.id === product?.category_id ||
      item.slug === product?.category_slug,
  );

  if (!product) {
    return (
      <div className="flex min-h-dvh flex-col">
        <TopBar
          products={products}
          onSelectProduct={(selected) =>
            navigate(`/product/${selected.id}`)
          }
          isAdminView={false}
        />

        <main className="flex flex-1 items-center justify-center bg-[var(--cream)] px-5 py-20 text-center">
          <div className="flex max-w-[480px] flex-col items-center">
            <ShoppingBag
              className="mb-5 text-[var(--green)]"
              size={42}
            />

            <span className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-[var(--terracotta)]">
              ManaDeshi Dukaan
            </span>

            <h1 className="font-['Playfair_Display',Georgia,serif] text-4xl font-bold text-[var(--green)]">
              Product not found
            </h1>

            <p className="mt-3 text-sm leading-6 text-[var(--text-mid)]">
              This product may have been removed or is no longer
              available.
            </p>

            <Link
              to="/shop"
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[var(--green)] px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-[var(--green-mid)]"
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
    selectedVariant?.price ?? product.base_price;

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

  const createFallbackVariant = (): ProductVariant => ({
    id: product.id,
    product_id: product.id,
    title: 'Standard',
    price: product.base_price,
    stock_quantity: 50,
  });

  const handleAddToCart = () => {
    const variant =
      selectedVariant || createFallbackVariant();

    addToCart(product, variant, quantity);

    setIsAdded(true);

    window.setTimeout(() => {
      setIsAdded(false);
    }, 1800);
  };

  const handleBuyNow = () => {
    const variant =
      selectedVariant || createFallbackVariant();

    addToCart(product, variant, quantity);
    navigate('/checkout');
  };

  return (
    <div className="flex min-h-dvh flex-col pb-20 md:pb-0">
      <TopBar
        products={products}
        onSelectProduct={(selected) =>
          navigate(`/product/${selected.id}`)
        }
        isAdminView={false}
      />

      <main className="flex-1 text-[var(--text-dark)]">
        {/* Breadcrumbs */}
        <div className="mx-auto flex min-h-[52px] w-full max-w-[1080px] items-center gap-2 overflow-hidden px-5 text-xs text-[var(--text-light)] max-[639px]:px-4">
          <Link
            className="shrink-0 text-[var(--text-mid)] transition-colors hover:text-[var(--green)]"
            to="/"
          >
            Home
          </Link>

          <ChevronRight size={14} />

          <Link
            className="shrink-0 text-[var(--text-mid)] transition-colors hover:text-[var(--green)]"
            to="/shop"
          >
            Shop
          </Link>

          <ChevronRight size={14} />

          {product.category_slug && (
            <>
              <Link
                className="shrink-0 text-[var(--text-mid)] transition-colors hover:text-[var(--green)]"
                to={`/category/${product.category_slug}`}
              >
                {categoryName}
              </Link>

              <ChevronRight size={14} />
            </>
          )}

          <span className="truncate text-[var(--text-dark)]">
            {product.name}
          </span>
        </div>

        {/* Product Main */}
        <section className="bg-white py-8 sm:py-12">
          <div className="mx-auto grid w-full max-w-[1080px] gap-8 px-5 md:grid-cols-2 md:gap-12 lg:gap-16 max-[639px]:px-4">
            {/* Image Gallery */}
            <div className="grid content-start gap-3 md:grid-cols-[64px_minmax(0,1fr)] md:gap-4">
              <div className="order-2 flex gap-2 overflow-x-auto md:order-1 md:flex-col">
                {images.map((image, index) => (
                  <button
                    key={`${image}-${index}`}
                    type="button"
                    className={`h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 transition-colors ${
                      selectedImage === index
                        ? 'border-[var(--green)]'
                        : 'border-transparent'
                    }`}
                    onClick={() => setSelectedImage(index)}
                  >
                    <img
                      className="h-full w-full object-cover"
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                    />
                  </button>
                ))}
              </div>

              <div className="relative order-1 aspect-square overflow-hidden rounded-2xl bg-[var(--cream)] md:order-2">
                <img
                  src={images[selectedImage]}
                  alt={product.name}
                  className="h-full w-full object-cover"
                />

                <button
                  type="button"
                  className={`absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/95 shadow-md transition-colors hover:bg-white ${
                    isInWishlist(product.id)
                      ? 'text-red-500'
                      : 'text-[var(--terracotta)]'
                  }`}
                  onClick={handleWishlist}
                  aria-label="Add to wishlist"
                >
                  <Heart
                    size={21}
                    fill={
                      isInWishlist(product.id)
                        ? 'currentColor'
                        : 'none'
                    }
                  />
                </button>

                <div className="absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-2 text-xs font-bold text-[var(--green)] shadow-sm backdrop-blur">
                  <Leaf size={13} />
                  Homemade
                </div>

                {images.length > 1 && (
                  <>
                    <button
                      type="button"
                      className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[var(--green)] shadow-sm transition-colors hover:bg-white"
                      onClick={() =>
                        setSelectedImage(
                          selectedImage === 0
                            ? images.length - 1
                            : selectedImage - 1,
                        )
                      }
                      aria-label="Previous image"
                    >
                      <ArrowLeft size={18} />
                    </button>

                    <button
                      type="button"
                      className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[var(--green)] shadow-sm transition-colors hover:bg-white"
                      onClick={() =>
                        setSelectedImage(
                          selectedImage === images.length - 1
                            ? 0
                            : selectedImage + 1,
                        )
                      }
                      aria-label="Next image"
                    >
                      <ArrowRight size={18} />
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Product Information */}
            <div className="flex flex-col items-start">
              <div className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-[var(--terracotta)]">
                {categoryName}
              </div>

              <h1 className="font-['Playfair_Display',Georgia,serif] text-4xl font-bold leading-tight text-[var(--green)] sm:text-5xl">
                {product.name}
              </h1>

              {product.tagline && (
                <p className="mt-3 text-base leading-7 text-[var(--text-mid)] sm:text-lg">
                  {product.tagline}
                </p>
              )}

              <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
                <div className="flex text-[var(--amber)]">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star
                      key={index}
                      size={16}
                      fill={
                        index < Math.round(rating)
                          ? 'currentColor'
                          : 'none'
                      }
                    />
                  ))}
                </div>

                <strong>{rating.toFixed(1)}</strong>

                <span className="text-xs text-[var(--text-light)]">
                  {PRODUCT_REVIEWS.length} verified reviews
                </span>
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-3">
                <span className="text-3xl font-extrabold text-[var(--green)] sm:text-4xl">
                  ₹{displayPrice.toFixed(0)}
                </span>

                {product.compare_at_price &&
                  product.compare_at_price > displayPrice && (
                    <>
                      <span className="text-base text-[var(--text-light)] line-through">
                        ₹{product.compare_at_price.toFixed(0)}
                      </span>

                      <span className="rounded-full bg-[var(--amber-light)] px-2.5 py-1 text-xs font-bold text-[var(--amber)]">
                        {Math.round(
                          (1 -
                            displayPrice /
                              product.compare_at_price) *
                            100,
                        )}
                        % OFF
                      </span>
                    </>
                  )}
              </div>

              <div className="mt-1 text-xs text-[var(--text-light)]">
                Inclusive of applicable taxes
              </div>

              {/* Variants */}
              {variants.length > 0 && (
                <div className="mt-7 w-full">
                  <div className="mb-3 flex items-center justify-between gap-3 text-sm">
                    <span className="font-bold text-[var(--text-dark)]">
                      Choose quantity
                    </span>

                    <strong className="text-[var(--green)]">
                      {selectedVariant?.title || 'Standard'}
                    </strong>
                  </div>

                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {variants.map((variant, index) => (
                      <button
                        key={variant.id}
                        type="button"
                        className={`flex min-h-[62px] items-center justify-between gap-2 rounded-xl border px-3 py-3 text-sm transition-colors ${
                          selectedVariantIndex === index
                            ? 'border-[var(--green)] bg-[var(--green-light)] text-[var(--green)]'
                            : 'border-[var(--border)] bg-white text-[var(--text-dark)] hover:border-[var(--green)]'
                        }`}
                        onClick={() =>
                          setSelectedVariantIndex(index)
                        }
                      >
                        <span>{variant.title}</span>

                        <strong>
                          ₹{variant.price.toFixed(0)}
                        </strong>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div className="mt-7 flex w-full gap-3">
                <div className="flex h-12 shrink-0 items-center rounded-lg border border-[var(--border-mid)]">
                  <button
                    className="flex h-full w-10 items-center justify-center text-[var(--green)] transition-colors hover:bg-[var(--green-light)]"
                    type="button"
                    onClick={() =>
                      setQuantity(Math.max(1, quantity - 1))
                    }
                    aria-label="Decrease quantity"
                  >
                    <Minus size={15} />
                  </button>

                  <span className="min-w-8 text-center text-sm font-bold">
                    {quantity}
                  </span>

                  <button
                    className="flex h-full w-10 items-center justify-center text-[var(--green)] transition-colors hover:bg-[var(--green-light)]"
                    type="button"
                    onClick={() =>
                      setQuantity(Math.min(20, quantity + 1))
                    }
                    aria-label="Increase quantity"
                  >
                    <Plus size={15} />
                  </button>
                </div>

                <button
                  type="button"
                  className={`flex h-12 flex-1 items-center justify-center gap-2 rounded-lg px-4 text-sm font-bold text-white transition-colors ${
                    isAdded
                      ? 'bg-[#16A34A]'
                      : 'bg-[var(--green)] hover:bg-[var(--green-mid)]'
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
                className="mt-3 flex h-12 w-full items-center justify-center gap-2 rounded-lg border border-[var(--green)] text-sm font-bold text-[var(--green)] transition-colors hover:bg-[var(--green-light)]"
                onClick={handleBuyNow}
              >
                Buy it now
                <ArrowRight size={18} />
              </button>

              {/* Trust Strip */}
              <div className="mt-7 grid w-full gap-3 border-t border-[var(--border)] pt-5 sm:grid-cols-3">
                <div className="flex items-start gap-2 text-[var(--green-mid)]">
                  <Truck
                    className="mt-0.5 shrink-0"
                    size={20}
                  />
                  <span className="text-xs leading-5 text-[var(--text-mid)]">
                    <strong className="block text-[var(--text-dark)]">
                      Fast delivery
                    </strong>
                    Hyderabad delivery available
                  </span>
                </div>

                <div className="flex items-start gap-2 text-[var(--green-mid)]">
                  <ShieldCheck
                    className="mt-0.5 shrink-0"
                    size={20}
                  />
                  <span className="text-xs leading-5 text-[var(--text-mid)]">
                    <strong className="block text-[var(--text-dark)]">
                      Quality assured
                    </strong>
                    Carefully packed for freshness
                  </span>
                </div>

                <div className="flex items-start gap-2 text-[var(--green-mid)]">
                  <Leaf
                    className="mt-0.5 shrink-0"
                    size={20}
                  />
                  <span className="text-xs leading-5 text-[var(--text-mid)]">
                    <strong className="block text-[var(--text-dark)]">
                      Traditional recipes
                    </strong>
                    Made with familiar ingredients
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Product Story */}
        <section className="bg-[var(--cream)] py-14 sm:py-20">
          <div className="mx-auto w-full max-w-[1080px] px-5 max-[639px]:px-4">
            <div className="mb-8 flex overflow-x-auto border-b border-[var(--border-mid)]">
              {[
                ['description', 'Description'],
                ['ingredients', 'Ingredients'],
                ['making', 'How it is made'],
                ['reviews', 'Reviews'],
              ].map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  className={`shrink-0 border-b-2 px-4 py-3 text-sm font-bold transition-colors ${
                    activeTab === key
                      ? 'border-[var(--green)] text-[var(--green)]'
                      : 'border-transparent text-[var(--text-mid)] hover:text-[var(--green)]'
                  }`}
                  onClick={() => setActiveTab(key)}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="rounded-2xl bg-white p-5 shadow-sm sm:p-9">
              {activeTab === 'description' && (
                <div className="grid gap-6 md:grid-cols-2 md:gap-12">
                  <div>
                    <span className="mb-3 block text-xs font-bold uppercase tracking-[0.16em] text-[var(--terracotta)]">
                      From our kitchen
                    </span>

                    <h2 className="font-['Playfair_Display',Georgia,serif] text-3xl font-bold leading-tight text-[var(--green)] sm:text-4xl">
                      Made to taste like
                      <br />
                      <em>home.</em>
                    </h2>
                  </div>

                  <div className="space-y-4 text-sm leading-7 text-[var(--text-mid)]">
                    <p>
                      {product.description ||
                        product.tagline ||
                        `Our ${product.name} is prepared with traditional recipes and carefully selected ingredients. Every batch is made with the familiar flavours of home in mind.`}
                    </p>

                    <p>
                      We keep things simple — good ingredients,
                      thoughtful preparation and the kind of flavour
                      that belongs on an everyday family table.
                    </p>
                  </div>
                </div>
              )}

              {activeTab === 'ingredients' && (
                <div>
                  <span className="mb-3 block text-xs font-bold uppercase tracking-[0.16em] text-[var(--terracotta)]">
                    Simple ingredients
                  </span>

                  <h2 className="font-['Playfair_Display',Georgia,serif] text-3xl font-bold text-[var(--green)]">
                    Nothing complicated.
                  </h2>

                  <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    {[
                      'Quality ingredients',
                      'Traditional spices',
                      'No unnecessary shortcuts',
                      'Small-batch preparation',
                    ].map((item) => (
                      <div
                        className="flex items-center gap-2 rounded-lg bg-[var(--green-light)] p-3 text-sm text-[var(--green)]"
                        key={item}
                      >
                        <Check
                          className="shrink-0"
                          size={16}
                        />
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'making' && (
                <div className="grid gap-6 md:grid-cols-2 md:gap-12">
                  <div>
                    <span className="mb-3 block text-xs font-bold uppercase tracking-[0.16em] text-[var(--terracotta)]">
                      Our process
                    </span>

                    <h2 className="font-['Playfair_Display',Georgia,serif] text-3xl font-bold leading-tight text-[var(--green)] sm:text-4xl">
                      Prepared with
                      <br />
                      <em>patience.</em>
                    </h2>
                  </div>

                  <div className="space-y-4">
                    {[
                      [
                        '01',
                        'Select',
                        'We begin with carefully chosen ingredients.',
                      ],
                      [
                        '02',
                        'Prepare',
                        'Traditional preparation methods preserve the familiar flavour.',
                      ],
                      [
                        '03',
                        'Pack',
                        'Each order is packed carefully for freshness.',
                      ],
                    ].map(([number, title, text]) => (
                      <div className="flex gap-4" key={number}>
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--green-light)] text-xs font-extrabold text-[var(--green)]">
                          {number}
                        </span>

                        <div>
                          <strong className="text-sm text-[var(--text-dark)]">
                            {title}
                          </strong>

                          <p className="mt-1 text-sm leading-6 text-[var(--text-mid)]">
                            {text}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="grid gap-4 md:grid-cols-3">
                  {PRODUCT_REVIEWS.map((review) => (
                    <article
                      key={review.name}
                      className="rounded-xl border border-[var(--border)] bg-[var(--cream)] p-5"
                    >
                      <div className="flex text-[var(--amber)]">
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
                          ),
                        )}
                      </div>

                      <p className="my-4 text-sm leading-6 text-[var(--text-mid)]">
                        “{review.text}”
                      </p>

                      <strong className="block text-sm text-[var(--text-dark)]">
                        {review.name}
                      </strong>

                      <span className="text-xs text-[var(--text-light)]">
                        {review.location}
                      </span>
                    </article>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="bg-white py-14 sm:py-20">
            <div className="mx-auto w-full max-w-[1080px] px-5 max-[639px]:px-4">
              <div className="mb-8 flex items-end justify-between gap-4">
                <div>
                  <span className="mb-2 block text-xs font-bold uppercase tracking-[0.16em] text-[var(--terracotta)]">
                    You may also like
                  </span>

                  <h2 className="font-['Playfair_Display',Georgia,serif] text-3xl font-bold leading-tight text-[var(--green)] sm:text-4xl">
                    More from this <em>collection.</em>
                  </h2>
                </div>

                {product.category_slug && (
                  <Link
                    to={`/category/${product.category_slug}`}
                    className="inline-flex shrink-0 items-center gap-2 text-sm font-bold text-[var(--green)] transition-colors hover:text-[var(--terracotta)]"
                  >
                    View collection
                    <ArrowRight size={16} />
                  </Link>
                )}
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {relatedProducts.map((item) => (
                  <ProductCard
                    key={item.id}
                    product={item}
                    onOpenDetail={(selected) =>
                      navigate(`/product/${selected.id}`)
                    }
                  />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Final CTA */}
        <section className="bg-[var(--green)] px-5 py-14 text-white sm:py-20">
          <div className="mx-auto flex w-full max-w-[1080px] flex-col items-center justify-between gap-8 text-center md:flex-row md:text-left">
            <div className="max-w-[620px]">
              <span className="mb-3 block text-xs font-bold uppercase tracking-[0.16em] text-[var(--amber-light)]">
                ManaDeshi Dukaan
              </span>

              <h2 className="font-['Playfair_Display',Georgia,serif] text-4xl font-bold leading-tight sm:text-5xl">
                Bring a little <em>home</em> to your table.
              </h2>

              <p className="mt-4 text-sm text-white/80 sm:text-base">
                Traditional foods, thoughtfully made for everyday
                homes.
              </p>
            </div>

            <Link
              to="/shop"
              className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-bold text-[var(--green)] transition-colors hover:bg-[var(--cream-2)]"
            >
              Continue shopping
              <ArrowRight size={17} />
            </Link>
          </div>
        </section>

        <Footer />
      </main>

      {/* Mobile Purchase Bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-between gap-4 border-t border-[var(--border)] bg-white px-4 py-3 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] md:hidden">
        <div className="min-w-0">
          <span className="block font-bold text-[var(--green)]">
            ₹{displayPrice.toFixed(0)}
          </span>

          <small className="block max-w-[50vw] truncate text-xs text-[var(--text-mid)]">
            {product.name}
          </small>
        </div>

        <button
          className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-lg bg-[var(--green)] px-5 text-sm font-bold text-white"
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