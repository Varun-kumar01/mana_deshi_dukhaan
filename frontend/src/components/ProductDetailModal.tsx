import React, { useEffect, useState } from 'react';
import {
  ArrowRight,
  Award,
  Check,
  Clock,
  Heart,
  Phone,
  ShoppingBag,
  Star,
  Truck,
  X,
} from 'lucide-react';
import { Product, ProductVariant } from '../types';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { checkPincode } from '../services/api';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onBuyNow: (
    product: Product,
    variant: ProductVariant,
    quantity: number
  ) => void;
}

export const ProductDetailModal: React.FC<
  ProductDetailModalProps
> = ({ product, onClose, onBuyNow }) => {
  if (!product) return null;

  return (
    <ProductDetailModalContent
      key={product.id}
      product={product}
      onClose={onClose}
      onBuyNow={onBuyNow}
    />
  );
};

interface ProductDetailModalContentProps {
  product: Product;
  onClose: () => void;
  onBuyNow: ProductDetailModalProps['onBuyNow'];
}

const ProductDetailModalContent: React.FC<
  ProductDetailModalContentProps
> = ({ product, onClose, onBuyNow }) => {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [selectedVariant, setSelectedVariant] =
    useState<ProductVariant>(
      () =>
        product.variants?.[0] || {
          id: product.id,
          product_id: product.id,
          title: 'Standard',
          price: product.base_price,
          compare_price: product.compare_at_price,
          stock_quantity: 50,
        }
    );

  const [quantity, setQuantity] = useState(1);

  const [activeTab, setActiveTab] = useState<
    'benefits' | 'ingredients' | 'howToUse' | 'storage'
  >('benefits');

  const [pincodeInput, setPincodeInput] = useState('500089');

  const [pincodeStatus, setPincodeStatus] = useState<any>({
    available: true,
    message:
      'Express 1-2 Hours Local Delivery available to Manikonda (Store Location)!',
  });

  const [isCheckingPincode, setIsCheckingPincode] =
    useState(false);

  const [isAdded, setIsAdded] = useState(false);

  const isFavorited = isInWishlist(product.id);

  const currentPrice = selectedVariant.price;

  const comparePrice =
    selectedVariant.compare_price ||
    product.compare_at_price;

  const discountPercent =
    comparePrice && comparePrice > currentPrice
      ? Math.round(
          ((comparePrice - currentPrice) / comparePrice) * 100
        )
      : 0;

  const maxStock = selectedVariant.stock_quantity || 50;

  useEffect(() => {
    setQuantity(1);
  }, [selectedVariant.id]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  const handleAddToCart = () => {
    addToCart(product, selectedVariant, quantity);
    setIsAdded(true);

    window.setTimeout(() => {
      setIsAdded(false);
    }, 1200);
  };

  const handleCheckPincode = async () => {
    if (pincodeInput.length !== 6) return;

    setIsCheckingPincode(true);

    try {
      const res = await checkPincode(pincodeInput);
      setPincodeStatus(res);
    } catch {
      setPincodeStatus({
        available: false,
        message:
          'Unable to check delivery availability right now.',
      });
    } finally {
      setIsCheckingPincode(false);
    }
  };

  const waText = encodeURIComponent(
    `Hi Swathi, I want to order *${product.name}* (${selectedVariant.title}) x ${quantity} for ₹${currentPrice * quantity}. My delivery pincode is ${pincodeInput}. Please share payment details.`
  );

  const waUrl = `https://wa.me/919951118687?text=${waText}`;

  const handleBackdropClick = (
    event: React.MouseEvent<HTMLDivElement>
  ) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  const tabs = [
    {
      id: 'benefits' as const,
      label: 'Health & Nutritional Benefits',
    },
    {
      id: 'ingredients' as const,
      label: '100% Clean Ingredients',
    },
    {
      id: 'howToUse' as const,
      label: 'How to Enjoy',
    },
    {
      id: 'storage' as const,
      label: 'Storage & Shelf Life',
    },
  ];

  return (
    <div
      className="fixed inset-0 z-[500] flex items-center justify-center overflow-y-auto bg-black/65 p-2 backdrop-blur-sm sm:p-4 lg:p-6"
      onClick={handleBackdropClick}
    >
      <div className="relative flex max-h-[96dvh] w-full max-w-6xl flex-col overflow-hidden rounded-2xl border border-[#E7DEC8] bg-[#FAF7F2] shadow-2xl sm:rounded-[2rem]">
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-[#E7DEC8] bg-white px-3 py-2.5 sm:px-6 sm:py-4">
          <div className="flex min-w-0 items-center gap-2 text-[10px] font-semibold text-stone-500 sm:text-xs">
            <span className="truncate">
              {product.category_name || 'Home Foods'}
            </span>

            <span className="shrink-0 text-stone-300">•</span>

            <span className="hidden shrink-0 font-bold text-[#1E3A27] xs:inline sm:inline">
              100% Traditional & Organic
            </span>
          </div>

          <div className="ml-2 flex shrink-0 items-center gap-1">
            <button
              type="button"
              onClick={() => toggleWishlist(product.id)}
              aria-label={
                isFavorited
                  ? 'Remove from wishlist'
                  : 'Add to wishlist'
              }
              className="flex h-9 w-9 items-center justify-center rounded-full text-stone-500 transition hover:bg-stone-100 hover:text-red-500"
            >
              <Heart
                size={19}
                className={
                  isFavorited
                    ? 'fill-red-500 text-red-500'
                    : ''
                }
              />
            </button>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close product details"
              className="flex h-9 w-9 items-center justify-center rounded-full text-stone-500 transition hover:bg-stone-100 hover:text-stone-900"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-3 sm:p-6 lg:p-8">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-12 lg:gap-8">
              {/* Gallery */}
              <div className="md:col-span-5">
                <div className="flex flex-col gap-3 sm:gap-4">
                  <div className="relative aspect-square overflow-hidden rounded-2xl border border-[#E7DEC8] bg-stone-100 shadow-inner">
                    <img
                      src={
                        product.images?.[0] ||
                        'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80'
                      }
                      alt={product.name}
                      className="h-full w-full object-cover"
                    />

                    {product.is_bestseller && (
                      <span className="absolute left-3 top-3 rounded-md bg-[#B35427] px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wide text-white shadow-md sm:text-xs">
                        Bestseller
                      </span>
                    )}

                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-center gap-1.5 rounded-xl border border-stone-200 bg-white/95 p-2 text-center text-[9px] font-semibold text-[#1E3A27] shadow-md backdrop-blur-md sm:p-2.5 sm:text-xs">
                      <Award
                        size={15}
                        className="shrink-0 text-amber-600"
                      />
                      <span>
                        FSSAI Certified: 23621028000492
                      </span>
                    </div>
                  </div>

                  {/* Trust strip */}
                  <div className="space-y-2 rounded-xl border border-[#E7DEC8] bg-white p-3 text-[11px] text-stone-600 sm:text-xs">
                    <div className="flex items-start gap-2">
                      <Check
                        size={15}
                        className="mt-0.5 shrink-0 text-emerald-600"
                      />
                      <span>
                        Freshly made in small hygienic batches
                      </span>
                    </div>

                    <div className="flex items-start gap-2">
                      <Check
                        size={15}
                        className="mt-0.5 shrink-0 text-emerald-600"
                      />
                      <span>
                        No added palm oil, synthetic vinegar, or
                        color
                      </span>
                    </div>

                    <div className="flex items-start gap-2">
                      <Check
                        size={15}
                        className="mt-0.5 shrink-0 text-emerald-600"
                      />
                      <span>
                        Prepared with pure wood-pressed oils &
                        rock salt
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Product information */}
              <div className="flex flex-col md:col-span-7">
                {/* Rating */}
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <div className="flex items-center gap-1 rounded-md border border-amber-200 bg-amber-50 px-2 py-1 text-xs font-bold text-amber-900">
                    <Star
                      size={13}
                      className="fill-amber-500 text-amber-500"
                    />
                    <span>
                      {product.rating || '5.0'} / 5.0
                    </span>
                  </div>

                  <span className="text-[10px] font-medium text-stone-500 sm:text-xs">
                    (100+ Verified Customer Ratings)
                  </span>
                </div>

                {/* Title */}
                <h2 className="font-display text-2xl font-extrabold leading-tight text-[#1E3A27] sm:text-3xl lg:text-4xl">
                  {product.name}
                </h2>

                {product.tagline && (
                  <p className="mt-1 text-xs font-semibold text-[#B35427] sm:text-sm">
                    {product.tagline}
                  </p>
                )}

                {/* Price */}
                <div className="mt-4 flex flex-wrap items-center gap-2 sm:gap-3">
                  <span className="text-3xl font-extrabold text-[#1E3A27]">
                    ₹{currentPrice}
                  </span>

                  {comparePrice &&
                    comparePrice > currentPrice && (
                      <>
                        <span className="text-lg text-stone-400 line-through">
                          ₹{comparePrice}
                        </span>

                        <span className="rounded bg-emerald-100 px-2 py-1 text-[10px] font-bold text-emerald-700 sm:text-xs">
                          Save ₹
                          {comparePrice - currentPrice}{' '}
                          ({discountPercent}% OFF)
                        </span>
                      </>
                    )}
                </div>

                <p className="mt-1 text-[11px] text-stone-500">
                  Inclusive of all taxes
                </p>

                {/* Variants */}
                {product.variants &&
                  product.variants.length > 0 && (
                    <div className="mt-5">
                      <div className="mb-2 text-xs font-bold uppercase tracking-wider text-stone-700">
                        Select Package Weight / Size
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {product.variants.map((variant) => {
                          const isSelected =
                            selectedVariant.id === variant.id;

                          const isOutOfStock =
                            (variant.stock_quantity ?? 0) <= 0;

                          return (
                            <button
                              key={variant.id}
                              type="button"
                              disabled={isOutOfStock}
                              onClick={() =>
                                setSelectedVariant(variant)
                              }
                              className={[
                                'flex min-w-[78px] flex-col items-center rounded-xl border px-3 py-2.5 text-xs font-bold transition-all sm:min-w-[84px] sm:px-4 sm:text-sm',
                                isSelected
                                  ? 'border-[#1E3A27] bg-[#1E3A27] text-white shadow-md'
                                  : 'border-[#D8CEB9] bg-white text-stone-800 hover:border-[#1E3A27]',
                                isOutOfStock
                                  ? 'cursor-not-allowed opacity-40'
                                  : '',
                              ].join(' ')}
                            >
                              <span>{variant.title}</span>

                              <span
                                className={
                                  isSelected
                                    ? 'mt-0.5 text-[10px] font-normal text-amber-300'
                                    : 'mt-0.5 text-[10px] font-normal text-stone-500'
                                }
                              >
                                ₹{variant.price}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                {/* Quantity */}
                <div className="mt-5 flex flex-wrap items-center gap-3 sm:gap-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-stone-700">
                    Quantity
                  </span>

                  <div className="flex overflow-hidden rounded-xl border border-[#D8CEB9] bg-white shadow-inner">
                    <button
                      type="button"
                      onClick={() =>
                        setQuantity(
                          Math.max(1, quantity - 1)
                        )
                      }
                      className="px-3.5 py-2 text-sm font-bold text-stone-600 transition hover:bg-stone-100"
                    >
                      −
                    </button>

                    <span className="flex min-w-10 items-center justify-center border-x border-[#E7DEC8] px-3 text-xs font-bold text-stone-800">
                      {quantity}
                    </span>

                    <button
                      type="button"
                      disabled={quantity >= maxStock}
                      onClick={() =>
                        setQuantity(
                          Math.min(
                            maxStock,
                            quantity + 1
                          )
                        )
                      }
                      className="px-3.5 py-2 text-sm font-bold text-stone-600 transition hover:bg-stone-100 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      +
                    </button>
                  </div>

                  <span className="text-xs font-bold text-stone-600">
                    Subtotal: ₹{currentPrice * quantity}
                  </span>
                </div>

                {/* Pincode */}
                <div className="mt-5 space-y-3 rounded-2xl border border-[#E7DEC8] bg-white p-3.5">
                  <div className="flex flex-col gap-1 text-xs sm:flex-row sm:items-center sm:justify-between">
                    <span className="flex items-center gap-1.5 font-bold text-stone-700">
                      <Truck
                        size={14}
                        className="text-[#B35427]"
                      />
                      Check Hyderabad Delivery Speed
                    </span>

                    <span className="text-[11px] font-bold text-emerald-700">
                      Store: Manikonda
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      value={pincodeInput}
                      onChange={(event) =>
                        setPincodeInput(
                          event.target.value.replace(
                            /\D/g,
                            ''
                          )
                        )
                      }
                      placeholder="Enter 6-digit Pincode"
                      className="min-w-0 flex-1 rounded-lg border border-stone-200 bg-[#FAF7F2] px-3 py-2 text-xs outline-none transition focus:border-[#1E3A27] focus:ring-1 focus:ring-[#1E3A27]"
                    />

                    <button
                      type="button"
                      onClick={handleCheckPincode}
                      disabled={
                        isCheckingPincode ||
                        pincodeInput.length !== 6
                      }
                      className="shrink-0 rounded-lg bg-[#1E3A27] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#162D1F] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {isCheckingPincode
                        ? 'Checking...'
                        : 'Check'}
                    </button>
                  </div>

                  {pincodeStatus && (
                    <div
                      className={`flex items-start gap-1.5 text-[11px] ${
                        pincodeStatus.available === false
                          ? 'text-red-600'
                          : 'text-stone-600'
                      }`}
                    >
                      <Clock
                        size={14}
                        className="mt-0.5 shrink-0 text-amber-600"
                      />

                      <span>
                        {pincodeStatus.message ||
                          `Delivery to ${pincodeStatus.area_name}: ${pincodeStatus.delivery_time_estimate}`}
                      </span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="mt-6 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    className={`flex min-h-12 items-center justify-center gap-2 rounded-xl px-4 py-3 text-xs font-bold shadow-md transition-all sm:text-sm ${
                      isAdded
                        ? 'bg-emerald-600 text-white'
                        : 'bg-[#1E3A27] text-white hover:bg-[#162D1F]'
                    }`}
                  >
                    {isAdded ? (
                      <>
                        <Check size={16} />
                        <span>Added to Cart!</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag size={16} />
                        <span>
                          Add to Cart (₹
                          {currentPrice * quantity})
                        </span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      onBuyNow(
                        product,
                        selectedVariant,
                        quantity
                      );
                      onClose();
                    }}
                    className="flex min-h-12 items-center justify-center gap-1.5 rounded-xl bg-[#B35427] px-4 py-3 text-xs font-bold text-white shadow-md transition hover:bg-[#97431C] sm:text-sm"
                  >
                    <span>Instant Checkout</span>
                    <ArrowRight size={16} />
                  </button>

                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Order via WhatsApp with Swathi"
                    className="flex min-h-12 items-center justify-center gap-1.5 rounded-xl bg-[#25D366] px-4 py-3 text-xs font-bold text-white shadow-md transition hover:bg-[#20BA5A] sm:col-span-2 sm:text-sm"
                  >
                    <Phone size={16} />
                    <span>Order via WhatsApp</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="mt-7 border-t border-[#E7DEC8] pt-6 sm:mt-8">
              <div className="flex gap-1 overflow-x-auto border-b border-[#E7DEC8] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {tabs.map((tab) => {
                  const isActive = activeTab === tab.id;

                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() =>
                        setActiveTab(tab.id)
                      }
                      className={`shrink-0 border-b-2 px-3 pb-2.5 text-[11px] font-bold transition sm:text-xs ${
                        isActive
                          ? 'border-[#1E3A27] text-[#1E3A27]'
                          : 'border-transparent text-stone-500 hover:text-stone-800'
                      }`}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              <div className="py-4 text-xs leading-relaxed text-stone-700 sm:text-sm">
                {activeTab === 'benefits' && (
                  <div className="space-y-2 rounded-xl border border-[#E7DEC8] bg-white p-4">
                    <p className="font-semibold text-stone-800">
                      {product.benefits ||
                        'High in natural nutrients, easy on digestion, and prepared with healthy traditional methods.'}
                    </p>

                    <p className="text-xs text-stone-500">
                      At ManaDeshi Dukaan, we ensure slow
                      processing to retain bio-active enzymes,
                      essential micronutrients, and authentic
                      aroma.
                    </p>
                  </div>
                )}

                {activeTab === 'ingredients' && (
                  <div className="space-y-2 rounded-xl border border-[#E7DEC8] bg-white p-4">
                    <p className="font-semibold text-stone-800">
                      {product.ingredients ||
                        'Natural organic ingredients sourced directly from verified local Telugu farmers.'}
                    </p>

                    <p className="text-xs text-stone-500">
                      Zero artificial preservatives, MSG,
                      synthetic food colors, or palm oil.
                    </p>
                  </div>
                )}

                {activeTab === 'howToUse' && (
                  <div className="space-y-2 rounded-xl border border-[#E7DEC8] bg-white p-4">
                    <p className="font-semibold text-stone-800">
                      {product.how_to_use ||
                        'Mix 1-2 teaspoons with piping hot steamed rice and a spoonful of ManaDeshi A2 Ghee.'}
                    </p>
                  </div>
                )}

                {activeTab === 'storage' && (
                  <div className="space-y-2 rounded-xl border border-[#E7DEC8] bg-white p-4">
                    <p>
                      <strong className="text-stone-800">
                        Shelf Life:
                      </strong>{' '}
                      {product.shelf_life ||
                        '6 Months from packing'}
                    </p>

                    <p>
                      <strong className="text-stone-800">
                        Instructions:
                      </strong>{' '}
                      {product.storage_instructions ||
                        'Store in a cool, dry place. Keep container tightly closed.'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};