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

const FALLBACK_PRODUCT_IMAGE =
  'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=1200&q=90';

export function ProductPage() {
  const { id } =
    useParams<{ id: string }>();

  const navigate = useNavigate();

  const { addToCart } = useCart();

  const {
    isLoggedIn,
    setIsAuthModalOpen,
  } = useAuth();

  const {
    isInWishlist,
    toggleWishlist,
  } = useWishlist();

  const [products, setProducts] =
    useState<Product[]>(
      fallbackProducts
    );

  const [categories, setCategories] =
    useState<Category[]>(
      fallbackCategories
    );

  const [selectedImage, setSelectedImage] =
    useState(0);

  const [
    selectedVariantIndex,
    setSelectedVariantIndex,
  ] = useState(0);

  const [quantity, setQuantity] =
    useState(1);

  const [activeTab, setActiveTab] =
    useState<
      | 'description'
      | 'benefits'
      | 'ingredients'
      | 'usage'
    >('description');

  const [isAdded, setIsAdded] =
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
        (item) =>
          String(item.id) === String(id)
      ),
    [products, id]
  );

  const relatedProducts = useMemo(() => {
    if (!product) return [];

    return products
      .filter(
        (item) =>
          item.id !== product.id &&
          (item.category_id ===
            product.category_id ||
            item.category_slug ===
              product.category_slug)
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
      <div className="flex min-h-[100dvh] flex-col bg-[#faf8f2]">
        <TopBar
          products={products}
          onSelectProduct={(selected) =>
            navigate(
              `/product/${selected.id}`
            )
          }
          isAdminView={false}
        />

        <main className="flex flex-1 items-center justify-center px-5 py-20 text-center">
          <div className="max-w-[480px]">
            <ShoppingBag
              size={46}
              className="mx-auto text-[#496735]"
            />

            <span className="mt-5 block text-[10px] font-bold uppercase tracking-[0.18em] text-[#c16f38]">
              ManaDeshi Dukaan
            </span>

            <h1 className="mt-3 font-['Playfair_Display',Georgia,serif] text-4xl text-[#293d24]">
              Product not found
            </h1>

            <p className="mt-3 text-sm leading-6 text-[#74766e]">
              This product may have been
              removed or is no longer
              available.
            </p>

            <Link
              to="/shop"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#496735] px-6 py-3 text-xs font-bold text-white transition hover:bg-[#3e592f]"
            >
              <ArrowLeft size={15} />
              Back to shop
            </Link>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  const productWithVariants =
    product as Product & {
      variants?: ProductVariant[];
    };

  const variants =
    productWithVariants.variants || [];

  const selectedVariant =
    variants[selectedVariantIndex];

  const displayPrice =
    selectedVariant?.price ??
    product.base_price;

  const images =
    product.images?.filter(Boolean).length
      ? product.images.filter(Boolean)
      : [FALLBACK_PRODUCT_IMAGE];

  const categoryName =
    category?.name ||
    product.category_name ||
    'Traditional Foods';

  const rating = product.rating || 5;

  const maxStock =
    selectedVariant?.stock_quantity ||
    50;

  const isWishlisted =
    isInWishlist(product.id);

  const comparePrice =
    selectedVariant?.compare_price ??
    product.compare_at_price;

  const discountPercent =
    comparePrice &&
    comparePrice > displayPrice
      ? Math.round(
          ((comparePrice -
            displayPrice) /
            comparePrice) *
            100
        )
      : 0;

  const fallbackVariant =
    (): ProductVariant => ({
      id: product.id,
      product_id: product.id,
      title: 'Standard',
      price: product.base_price,
      stock_quantity: 50,
    });

  const activeVariant =
    selectedVariant || fallbackVariant();

  const handleWishlist = () => {
    if (!isLoggedIn) {
      setIsAuthModalOpen(true);
      return;
    }

    toggleWishlist(product.id);
  };

  const handleAddToCart = () => {
    addToCart(
      product,
      activeVariant,
      quantity
    );

    setIsAdded(true);

    window.setTimeout(() => {
      setIsAdded(false);
    }, 1800);
  };

  const handleBuyNow = () => {
    addToCart(
      product,
      activeVariant,
      quantity
    );

    navigate('/checkout');
  };

  const decreaseQuantity = () => {
    setQuantity((current) =>
      Math.max(1, current - 1)
    );
  };

  const increaseQuantity = () => {
    setQuantity((current) =>
      Math.min(
        Math.max(1, maxStock),
        current + 1
      )
    );
  };

  return (
    <div className="min-h-[100dvh] bg-[#faf8f2] text-[#26351f]">
      <TopBar
        products={products}
        onSelectProduct={(selected) =>
          navigate(
            `/product/${selected.id}`
          )
        }
        isAdminView={false}
      />

      <main>
        {/* BREADCRUMB */}
        <div className="mx-auto flex min-h-[54px] w-[min(calc(100%-48px),1240px)] items-center gap-2 overflow-hidden text-xs text-[#85867e] max-[680px]:w-[calc(100%-28px)]">
          <Link
            to="/"
            className="shrink-0 hover:text-[#496735]"
          >
            Home
          </Link>

          <ChevronRight
            size={14}
            className="shrink-0"
          />

          <Link
            to="/shop"
            className="shrink-0 hover:text-[#496735]"
          >
            Shop
          </Link>

          <ChevronRight
            size={14}
            className="shrink-0"
          />

          {product.category_slug && (
            <>
              <Link
                to={`/category/${product.category_slug}`}
                className="shrink-0 truncate hover:text-[#496735]"
              >
                {categoryName}
              </Link>

              <ChevronRight
                size={14}
                className="shrink-0"
              />
            </>
          )}

          <span className="truncate text-[#41473d]">
            {product.name}
          </span>
        </div>

        {/* PRODUCT */}
        <section className="bg-white py-8 sm:py-12 lg:py-16">
          <div className="mx-auto grid w-[min(calc(100%-48px),1240px)] gap-10 max-[680px]:w-[calc(100%-28px)] md:grid-cols-2 md:gap-12 lg:gap-20">
            {/* GALLERY */}
            <div className="min-w-0">
              <div className="grid gap-3 md:grid-cols-[68px_minmax(0,1fr)]">
                {/* THUMBNAILS */}
                <div className="order-2 flex gap-2 overflow-x-auto md:order-1 md:flex-col [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  {images.map(
                    (image, index) => (
                      <button
                        key={`${image}-${index}`}
                        type="button"
                        onClick={() =>
                          setSelectedImage(
                            index
                          )
                        }
                        className={`h-[62px] w-[62px] shrink-0 overflow-hidden rounded-lg border-2 transition ${
                          selectedImage ===
                          index
                            ? 'border-[#496735]'
                            : 'border-transparent'
                        }`}
                      >
                        <img
                          src={image}
                          alt={`${product.name} ${index + 1}`}
                          className="h-full w-full object-cover"
                        />
                      </button>
                    )
                  )}
                </div>

                {/* MAIN IMAGE */}
                <div className="relative order-1 aspect-square overflow-hidden rounded-2xl bg-[#f3f0e7] md:order-2">
                  <img
                    src={
                      images[selectedImage]
                    }
                    alt={product.name}
                    className="h-full w-full object-cover"
                  />

                  <button
                    type="button"
                    onClick={
                      handleWishlist
                    }
                    className={`absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/95 shadow-lg transition hover:scale-105 ${
                      isWishlisted
                        ? 'text-red-500'
                        : 'text-[#496735]'
                    }`}
                    aria-label="Add to wishlist"
                  >
                    <Heart
                      size={20}
                      fill={
                        isWishlisted
                          ? 'currentColor'
                          : 'none'
                      }
                    />
                  </button>

                  <div className="absolute bottom-4 left-4 flex items-center gap-2 rounded-full bg-white/90 px-3 py-2 text-[10px] font-bold text-[#496735] shadow-sm backdrop-blur">
                    <Leaf size={13} />
                    Traditional
                  </div>

                  {images.length > 1 && (
                    <>
                      <button
                        type="button"
                        onClick={() =>
                          setSelectedImage(
                            selectedImage ===
                              0
                              ? images.length -
                                  1
                              : selectedImage -
                                  1
                          )
                        }
                        className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#496735] shadow"
                        aria-label="Previous image"
                      >
                        <ArrowLeft
                          size={17}
                        />
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          setSelectedImage(
                            selectedImage ===
                              images.length -
                                1
                              ? 0
                              : selectedImage +
                                  1
                          )
                        }
                        className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#496735] shadow"
                        aria-label="Next image"
                      >
                        <ArrowRight
                          size={17}
                        />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* DETAILS */}
            <div className="flex min-w-0 flex-col">
              <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#c16f38]">
                {categoryName}
              </span>

              <h1 className="mt-3 font-['Playfair_Display',Georgia,serif] text-4xl leading-[1.04] tracking-[-.035em] text-[#293d24] sm:text-5xl lg:text-[56px]">
                {product.name}
              </h1>

              {product.tagline && (
                <p className="mt-4 max-w-[560px] text-sm leading-7 text-[#6e7068] sm:text-base">
                  {product.tagline}
                </p>
              )}

              {/* RATING */}
              <div className="mt-5 flex flex-wrap items-center gap-2">
                <div className="flex text-[#d69a42]">
                  {Array.from({
                    length: 5,
                  }).map(
                    (_, index) => (
                      <Star
                        key={index}
                        size={15}
                        fill={
                          index <
                          Math.round(
                            rating
                          )
                            ? 'currentColor'
                            : 'none'
                        }
                      />
                    )
                  )}
                </div>

                <strong className="text-xs text-[#37432f]">
                  {rating.toFixed(1)}
                </strong>

                <span className="text-xs text-[#92948c]">
                  {PRODUCT_REVIEWS.length}{' '}
                  reviews
                </span>
              </div>

              {/* PRICE */}
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <span className="font-['Playfair_Display',Georgia,serif] text-4xl text-[#293d24]">
                  ₹{displayPrice.toFixed(0)}
                </span>

                {comparePrice &&
                  comparePrice >
                    displayPrice && (
                    <>
                      <span className="text-sm text-[#9b9c94] line-through">
                        ₹
                        {comparePrice.toFixed(
                          0
                        )}
                      </span>

                      <span className="rounded-full bg-[#f4e4c9] px-2.5 py-1 text-[10px] font-bold text-[#a66b27]">
                        {discountPercent}% OFF
                      </span>
                    </>
                  )}
              </div>

              <p className="mt-1 text-[10px] text-[#999a92]">
                Inclusive of applicable taxes
              </p>

              {/* VARIANTS */}
              {variants.length > 0 && (
                <div className="mt-7">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-xs font-bold text-[#394331]">
                      Choose size
                    </span>

                    <span className="text-xs font-semibold text-[#496735]">
                      {selectedVariant?.title ||
                        'Standard'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {variants.map(
                      (
                        variant,
                        index
                      ) => (
                        <button
                          key={
                            variant.id
                          }
                          type="button"
                          onClick={() => {
                            setSelectedVariantIndex(
                              index
                            );
                            setQuantity(
                              1
                            );
                          }}
                          className={`rounded-lg border px-3 py-3 text-left transition ${
                            selectedVariantIndex ===
                            index
                              ? 'border-[#496735] bg-[#edf3e8] text-[#496735]'
                              : 'border-[#293c24]/10 bg-white text-[#62655d] hover:border-[#496735]/40'
                          }`}
                        >
                          <span className="block text-xs font-bold">
                            {
                              variant.title
                            }
                          </span>

                          <span className="mt-1 block text-[11px]">
                            ₹
                            {variant.price.toFixed(
                              0
                            )}
                          </span>
                        </button>
                      )
                    )}
                  </div>
                </div>
              )}

              {/* QUANTITY */}
              <div className="mt-6">
                <span className="mb-3 block text-xs font-bold text-[#394331]">
                  Quantity
                </span>

                <div className="flex h-12 w-fit items-center overflow-hidden rounded-lg border border-[#293c24]/15 bg-white">
                  <button
                    type="button"
                    onClick={
                      decreaseQuantity
                    }
                    className="flex h-full w-12 items-center justify-center text-[#496735] transition hover:bg-[#f0f3eb]"
                    aria-label="Decrease quantity"
                  >
                    <Minus size={15} />
                  </button>

                  <span className="flex h-full min-w-12 items-center justify-center border-x border-[#293c24]/10 text-sm font-bold text-[#293d24]">
                    {quantity}
                  </span>

                  <button
                    type="button"
                    onClick={
                      increaseQuantity
                    }
                    className="flex h-full w-12 items-center justify-center text-[#496735] transition hover:bg-[#f0f3eb]"
                    aria-label="Increase quantity"
                  >
                    <Plus size={15} />
                  </button>
                </div>

                <p className="mt-2 text-[10px] text-[#999a92]">
                  {maxStock} units available
                </p>
              </div>

              {/* ACTIONS */}
              <div className="mt-7 grid gap-2 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={
                    handleAddToCart
                  }
                  className="flex min-h-12 items-center justify-center gap-2 rounded-full border border-[#496735] px-5 text-xs font-bold text-[#496735] transition hover:bg-[#edf3e8]"
                >
                  {isAdded ? (
                    <>
                      <Check size={16} />
                      Added to cart
                    </>
                  ) : (
                    <>
                      <ShoppingBag
                        size={16}
                      />
                      Add to cart
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={
                    handleBuyNow
                  }
                  className="flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#496735] px-5 text-xs font-bold text-white transition hover:bg-[#3d592e]"
                >
                  Buy now
                  <ArrowRight
                    size={16}
                  />
                </button>
              </div>

              {/* TRUST */}
              <div className="mt-7 grid grid-cols-3 gap-2 border-y border-[#293c24]/10 py-5">
                <div className="text-center">
                  <Truck
                    size={18}
                    className="mx-auto text-[#496735]"
                  />
                  <p className="mt-2 text-[10px] font-semibold text-[#60645b]">
                    Fast delivery
                  </p>
                </div>

                <div className="border-x border-[#293c24]/10 text-center">
                  <ShieldCheck
                    size={18}
                    className="mx-auto text-[#496735]"
                  />
                  <p className="mt-2 text-[10px] font-semibold text-[#60645b]">
                    Quality checked
                  </p>
                </div>

                <div className="text-center">
                  <Leaf
                    size={18}
                    className="mx-auto text-[#496735]"
                  />
                  <p className="mt-2 text-[10px] font-semibold text-[#60645b]">
                    Traditional
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* INFORMATION TABS */}
        <section className="border-y border-[#293c24]/10 bg-[#faf8f2]">
          <div className="mx-auto w-[min(calc(100%-48px),1080px)] max-[680px]:w-[calc(100%-28px)]">
            <div className="flex overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {[
                [
                  'description',
                  'Description',
                ],
                ['benefits', 'Benefits'],
                [
                  'ingredients',
                  'Ingredients',
                ],
                ['usage', 'How to use'],
              ].map(
                ([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() =>
                      setActiveTab(
                        value as typeof activeTab
                      )
                    }
                    className={`relative shrink-0 px-5 py-5 text-xs font-semibold transition ${
                      activeTab === value
                        ? 'text-[#496735]'
                        : 'text-[#85877f] hover:text-[#496735]'
                    }`}
                  >
                    {label}

                    {activeTab ===
                      value && (
                      <span className="absolute bottom-0 left-5 right-5 h-0.5 rounded-full bg-[#496735]" />
                    )}
                  </button>
                )
              )}
            </div>

            <div className="py-8 sm:py-10">
              {activeTab ===
                'description' && (
                <div className="max-w-[760px]">
                  <h2 className="font-['Playfair_Display',Georgia,serif] text-2xl text-[#293d24]">
                    About this product
                  </h2>

                  <p className="mt-4 text-sm leading-7 text-[#6f7169]">
                    {product.description ||
                      product.tagline ||
                      `A traditional ${product.name.toLowerCase()} prepared with care for everyday meals.`}
                  </p>
                </div>
              )}

              {activeTab ===
                'benefits' && (
                <div className="max-w-[760px]">
                  <h2 className="font-['Playfair_Display',Georgia,serif] text-2xl text-[#293d24]">
                    Why you'll love it
                  </h2>

                  <div className="mt-5 grid gap-3 sm:grid-cols-3">
                    {[
                      [
                        'Traditional',
                        'Inspired by familiar recipes and flavours.',
                      ],
                      [
                        'Thoughtful',
                        'Prepared with care for everyday homes.',
                      ],
                      [
                        'Fresh',
                        'Packed to preserve taste and quality.',
                      ],
                    ].map(
                      ([title, text]) => (
                        <div
                          key={title}
                          className="rounded-xl border border-[#293c24]/10 bg-white p-4"
                        >
                          <Leaf
                            size={18}
                            className="text-[#496735]"
                          />

                          <h3 className="mt-3 text-xs font-bold text-[#35422f]">
                            {title}
                          </h3>

                          <p className="mt-1 text-[11px] leading-5 text-[#777970]">
                            {text}
                          </p>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}

              {activeTab ===
                'ingredients' && (
                <div className="max-w-[760px]">
                  <h2 className="font-['Playfair_Display',Georgia,serif] text-2xl text-[#293d24]">
                    Ingredients
                  </h2>

                  <p className="mt-4 text-sm leading-7 text-[#6f7169]">
                    {product.ingredients ||
                      'Made with carefully selected ingredients. Please refer to the product packaging for the complete ingredient information.'}
                  </p>
                </div>
              )}

              {activeTab === 'usage' && (
                <div className="max-w-[760px]">
                  <h2 className="font-['Playfair_Display',Georgia,serif] text-2xl text-[#293d24]">
                    How to use
                  </h2>

                  <p className="mt-4 text-sm leading-7 text-[#6f7169]">
                    Enjoy this product as
                    part of your everyday
                    meals. Store according
                    to the instructions on
                    the packaging and use a
                    clean, dry spoon whenever
                    applicable.
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* REVIEWS */}
        <section className="bg-white py-14 sm:py-20">
          <div className="mx-auto w-[min(calc(100%-48px),1080px)] max-[680px]:w-[calc(100%-28px)]">
            <div className="mb-8">
              <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#c16f38]">
                Customer love
              </span>

              <h2 className="mt-2 font-['Playfair_Display',Georgia,serif] text-3xl text-[#293d24] sm:text-4xl">
                What people say
              </h2>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {PRODUCT_REVIEWS.map(
                (review) => (
                  <article
                    key={review.name}
                    className="rounded-2xl border border-[#293c24]/10 bg-[#faf8f2] p-5"
                  >
                    <div className="flex text-[#d69a42]">
                      {Array.from({
                        length: 5,
                      }).map(
                        (_, index) => (
                          <Star
                            key={index}
                            size={14}
                            fill={
                              index <
                              review.rating
                                ? 'currentColor'
                                : 'none'
                            }
                          />
                        )
                      )}
                    </div>

                    <p className="mt-4 text-sm leading-6 text-[#62655d]">
                      “{review.text}”
                    </p>

                    <div className="mt-5">
                      <p className="text-xs font-bold text-[#34422f]">
                        {review.name}
                      </p>

                      <p className="mt-1 text-[10px] text-[#92948c]">
                        {review.location}
                      </p>
                    </div>
                  </article>
                )
              )}
            </div>
          </div>
        </section>

        {/* RELATED PRODUCTS */}
        {relatedProducts.length > 0 && (
          <section className="bg-[#faf8f2] py-14 sm:py-20">
            <div className="mx-auto w-[min(calc(100%-48px),1240px)] max-[680px]:w-[calc(100%-28px)]">
              <div className="mb-8 flex items-end justify-between gap-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#c16f38]">
                    You may also like
                  </span>

                  <h2 className="mt-2 font-['Playfair_Display',Georgia,serif] text-3xl text-[#293d24] sm:text-4xl">
                    More from this collection
                  </h2>
                </div>

                {product.category_slug && (
                  <Link
                    to={`/category/${product.category_slug}`}
                    className="hidden items-center gap-2 text-xs font-bold text-[#496735] hover:text-[#c16f38] sm:inline-flex"
                  >
                    View collection
                    <ArrowRight
                      size={15}
                    />
                  </Link>
                )}
              </div>

              <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:grid-cols-2 sm:gap-x-5 lg:grid-cols-4">
                {relatedProducts.map(
                  (relatedProduct) => (
                    <ProductCard
                      key={
                        relatedProduct.id
                      }
                      product={
                        relatedProduct
                      }
                      onOpenDetail={(
                        selected
                      ) =>
                        navigate(
                          `/product/${selected.id}`
                        )
                      }
                    />
                  )
                )}
              </div>
            </div>
          </section>
        )}

        {/* FINAL CTA */}
        <section className="bg-[#283b23] px-5 py-14 text-white sm:py-20">
          <div className="mx-auto max-w-[700px] text-center">
            <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#dfb778]">
              ManaDeshi Dukaan
            </span>

            <h2 className="mt-3 font-['Playfair_Display',Georgia,serif] text-4xl leading-tight sm:text-6xl">
              Bring home the
              <em className="not-italic text-[#a9c5ae]">
                {' '}
                flavours you love.
              </em>
            </h2>

            <p className="mt-4 text-sm text-white/65">
              Explore more traditional
              favourites from our kitchen.
            </p>

            <Link
              to="/shop"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-xs font-bold text-[#496735] transition hover:-translate-y-0.5 hover:bg-[#edf3e8]"
            >
              Continue shopping
              <ArrowRight size={15} />
            </Link>
          </div>
        </section>

        <Footer />
      </main>

      {/* MOBILE BUY BAR */}
      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-[#293c24]/10 bg-white/95 p-3 shadow-[0_-8px_30px_rgba(30,40,24,.1)] backdrop-blur md:hidden">
        <div className="mx-auto flex max-w-[600px] items-center gap-2">
          <button
            type="button"
            onClick={
              handleAddToCart
            }
            className="flex h-12 flex-1 items-center justify-center gap-2 rounded-full border border-[#496735] text-xs font-bold text-[#496735]"
          >
            <ShoppingBag size={16} />
            Add
          </button>

          <button
            type="button"
            onClick={
              handleBuyNow
            }
            className="flex h-12 flex-[1.35] items-center justify-center gap-2 rounded-full bg-[#496735] text-xs font-bold text-white"
          >
            Buy now
            <ArrowRight size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductPage;