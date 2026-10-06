import React, { useState } from 'react';
import { 
  X, 
  ShoppingBag, 
  Phone, 
  Star, 
  Truck, 
  ShieldCheck, 
  Sparkles, 
  Heart, 
  Check, 
  Info,
  Clock,
  ArrowRight,
  Flame,
  Award
} from 'lucide-react';
import { Product, ProductVariant } from '../types';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { checkPincode } from '../services/api';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onBuyNow: (product: Product, variant: ProductVariant, quantity: number) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onBuyNow
}) => {
  if (!product) return null;

  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(() => {
    return (product.variants && product.variants[0]) || {
      id: product.id,
      title: 'Standard',
      price: product.base_price,
      compare_price: product.compare_at_price,
      stock_quantity: 50
    };
  });

  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'benefits' | 'ingredients' | 'howToUse' | 'storage'>('benefits');
  const [pincodeInput, setPincodeInput] = useState('500089');
  const [pincodeStatus, setPincodeStatus] = useState<any>({
    available: true,
    message: 'Express 1-2 Hours Local Delivery available to Manikonda (Store Location)!'
  });
  const [isCheckingPincode, setIsCheckingPincode] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const isFavorited = isInWishlist(product.id);
  const currentPrice = selectedVariant.price;
  const comparePrice = selectedVariant.compare_price || product.compare_at_price;
  const discountPercent = comparePrice && comparePrice > currentPrice
    ? Math.round(((comparePrice - currentPrice) / comparePrice) * 100)
    : 0;

  const handleAddToCart = () => {
    addToCart(product, selectedVariant, quantity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1200);
  };

  const handleCheckPincode = async () => {
    if (pincodeInput.length !== 6) return;
    setIsCheckingPincode(true);
    const res = await checkPincode(pincodeInput);
    setPincodeStatus(res);
    setIsCheckingPincode(false);
  };

  // WhatsApp prefilled message
  const waText = encodeURIComponent(
    `Hi Swathi, I want to order *${product.name}* (${selectedVariant.title}) x ${quantity} for ₹${currentPrice * quantity}. My delivery pincode is ${pincodeInput}. Please share payment details.`
  );
  const waUrl = `https://wa.me/919951118687?text=${waText}`;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      
      {/* Modal Dialog Card */}
      <div className="relative bg-[#FAF7F2] rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl border border-[#E7DEC8] max-h-[92vh] flex flex-col">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between p-4 sm:px-6 bg-white border-b border-[#E7DEC8]">
          <div className="flex items-center gap-2 text-xs font-semibold text-stone-500">
            <span>{product.category_name || 'Home Foods'}</span>
            <span>•</span>
            <span className="text-[#1E3A27] font-bold">100% Traditional & Organic</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleWishlist(product.id)}
              className="p-2 rounded-full hover:bg-stone-100 text-stone-500 hover:text-red-500 transition-colors"
            >
              <Heart className={`w-5 h-5 ${isFavorited ? 'fill-red-500 text-red-500' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-stone-100 text-stone-500 hover:text-stone-900 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-8 overflow-y-auto flex-1">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8">
            
            {/* Left: Gallery & Badges */}
            <div className="md:col-span-5 flex flex-col gap-4">
              <div className="relative rounded-2xl overflow-hidden aspect-square bg-stone-100 border border-[#E7DEC8] shadow-inner">
                <img
                  src={(product.images && product.images[0]) || 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80'}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                
                {product.is_bestseller && (
                  <span className="absolute top-3 left-3 bg-[#B35427] text-white text-xs font-extrabold uppercase px-2.5 py-1 rounded-md shadow-md">
                    Bestseller
                  </span>
                )}
                
                <div className="absolute bottom-3 left-3 right-3 bg-white/95 backdrop-blur-md p-2.5 rounded-xl border border-stone-200 text-center text-xs font-semibold text-[#1E3A27] flex items-center justify-center gap-1.5 shadow-md">
                  <Award className="w-4 h-4 text-[#D97706]" />
                  <span>FSSAI Certified: 23621028000492</span>
                </div>
              </div>

              {/* Verified Trust Strip */}
              <div className="p-3 bg-white rounded-xl border border-[#E7DEC8] space-y-2 text-xs text-stone-600">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Freshly made in small hygienic batches</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>No added palm oil, synthetic vinegar, or color</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Prepared with pure wood-pressed oils & rock salt</span>
                </div>
              </div>
            </div>

            {/* Right: Info, Variants, Quantity, Actions */}
            <div className="md:col-span-7 flex flex-col justify-between">
              <div>
                
                {/* Rating & Review */}
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex items-center gap-1 bg-amber-50 text-amber-900 border border-amber-200 px-2 py-0.5 rounded-md text-xs font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                    <span>{product.rating || '5.0'} / 5.0</span>
                  </div>
                  <span className="text-xs text-stone-500 font-medium">
                    (100+ Verified Customer Ratings)
                  </span>
                </div>

                {/* Title & Tagline */}
                <h2 className="font-serif-display text-2xl sm:text-3xl font-extrabold text-[#1E3A27] leading-tight">
                  {product.name}
                </h2>
                <p className="text-xs sm:text-sm text-[#B35427] font-semibold mt-1">
                  {product.tagline}
                </p>

                {/* Price Display */}
                <div className="mt-4 flex items-baseline gap-3">
                  <span className="text-3xl font-extrabold text-[#1E3A27]">
                    ₹{currentPrice}
                  </span>
                  {comparePrice && comparePrice > currentPrice && (
                    <>
                      <span className="text-lg text-stone-400 line-through">
                        ₹{comparePrice}
                      </span>
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                        Save ₹{comparePrice - currentPrice} ({discountPercent}% OFF)
                      </span>
                    </>
                  )}
                </div>
                <div className="text-xs text-stone-500 mt-0.5">Inclusive of all taxes</div>

                {/* Variant Selector (Weights/Sizes) */}
                {product.variants && product.variants.length > 0 && (
                  <div className="mt-5">
                    <div className="text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">
                      Select Package Weight / Size:
                    </div>
                    <div className="flex flex-wrap gap-2.5">
                      {product.variants.map((v) => {
                        const isSelected = selectedVariant.id === v.id;
                        return (
                          <button
                            key={v.id}
                            onClick={() => setSelectedVariant(v)}
                            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all border flex flex-col items-center ${
                              isSelected
                                ? 'bg-[#1E3A27] text-white border-[#1E3A27] shadow-md scale-102'
                                : 'bg-white text-stone-800 border-[#D8CEB9] hover:border-[#1E3A27]'
                            }`}
                          >
                            <span>{v.title}</span>
                            <span className={`text-[10px] font-normal ${isSelected ? 'text-[#FBBF24]' : 'text-stone-500'}`}>
                              ₹{v.price}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Quantity Selector */}
                <div className="mt-5 flex items-center gap-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-stone-700">Quantity:</span>
                  <div className="flex items-center border border-[#D8CEB9] rounded-xl bg-white overflow-hidden shadow-inner">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3.5 py-1.5 text-stone-600 hover:bg-stone-100 font-bold"
                    >
                      -
                    </button>
                    <span className="px-4 py-1.5 text-xs font-bold text-stone-800">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-3.5 py-1.5 text-stone-600 hover:bg-stone-100 font-bold"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-xs font-bold text-stone-600">
                    Subtotal: ₹{currentPrice * quantity}
                  </span>
                </div>

                {/* Hyderabad Pincode Estimator */}
                <div className="mt-5 p-3.5 bg-white rounded-2xl border border-[#E7DEC8] space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-stone-700 flex items-center gap-1.5">
                      <Truck className="w-3.5 h-3.5 text-[#B35427]" />
                      Check Hyderabad Delivery Speed
                    </span>
                    <span className="text-[11px] text-emerald-700 font-bold">Store: Manikonda</span>
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      maxLength={6}
                      value={pincodeInput}
                      onChange={(e) => setPincodeInput(e.target.value)}
                      placeholder="Enter 6-digit Pincode"
                      className="flex-1 px-3 py-1.5 text-xs bg-[#FAF7F2] border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1E3A27]"
                    />
                    <button
                      onClick={handleCheckPincode}
                      disabled={isCheckingPincode}
                      className="px-4 py-1.5 text-xs font-bold bg-[#1E3A27] text-white rounded-lg hover:bg-[#162D1F]"
                    >
                      {isCheckingPincode ? 'Checking...' : 'Check'}
                    </button>
                  </div>

                  {pincodeStatus && (
                    <div className="text-[11px] text-stone-600 flex items-start gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                      <span>{pincodeStatus.message || `Delivery to ${pincodeStatus.area_name}: ${pincodeStatus.delivery_time_estimate}`}</span>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="mt-6 flex flex-col sm:flex-row gap-2.5">
                  <button
                    onClick={handleAddToCart}
                    className={`flex-1 py-3 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md ${
                      isAdded
                        ? 'bg-emerald-600 text-white'
                        : 'bg-[#1E3A27] hover:bg-[#162D1F] text-white'
                    }`}
                  >
                    {isAdded ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Added to Cart!</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4" />
                        <span>Add to Cart (₹{currentPrice * quantity})</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => {
                      onBuyNow(product, selectedVariant, quantity);
                      onClose();
                    }}
                    className="flex-1 py-3 px-4 rounded-xl font-bold text-xs sm:text-sm bg-[#B35427] hover:bg-[#97431c] text-white flex items-center justify-center gap-1.5 shadow-md transition-all"
                  >
                    <span>Instant Checkout</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-3 px-4 rounded-xl font-bold text-xs sm:text-sm bg-[#25D366] hover:bg-[#20BA5A] text-white flex items-center justify-center gap-1.5 shadow-md transition-all"
                    title="Order via WhatsApp with Swathi"
                  >
                    <Phone className="w-4 h-4" />
                    <span>WhatsApp</span>
                  </a>
                </div>

              </div>
            </div>

          </div>

          {/* Bottom Tabs Section: Ingredients, Benefits, How to Use, Storage */}
          <div className="mt-8 pt-6 border-t border-[#E7DEC8]">
            <div className="flex border-b border-[#E7DEC8] overflow-x-auto scrollbar-none gap-2">
              <button
                onClick={() => setActiveTab('benefits')}
                className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${
                  activeTab === 'benefits'
                    ? 'border-[#1E3A27] text-[#1E3A27]'
                    : 'border-transparent text-stone-500 hover:text-stone-800'
                }`}
              >
                Health & Nutritional Benefits
              </button>
              <button
                onClick={() => setActiveTab('ingredients')}
                className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${
                  activeTab === 'ingredients'
                    ? 'border-[#1E3A27] text-[#1E3A27]'
                    : 'border-transparent text-stone-500 hover:text-stone-800'
                }`}
              >
                100% Clean Ingredients
              </button>
              <button
                onClick={() => setActiveTab('howToUse')}
                className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${
                  activeTab === 'howToUse'
                    ? 'border-[#1E3A27] text-[#1E3A27]'
                    : 'border-transparent text-stone-500 hover:text-stone-800'
                }`}
              >
                How to Enjoy
              </button>
              <button
                onClick={() => setActiveTab('storage')}
                className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${
                  activeTab === 'storage'
                    ? 'border-[#1E3A27] text-[#1E3A27]'
                    : 'border-transparent text-stone-500 hover:text-stone-800'
                }`}
              >
                Storage & Shelf Life
              </button>
            </div>

            <div className="py-4 text-xs sm:text-sm text-stone-700 leading-relaxed">
              {activeTab === 'benefits' && (
                <div className="p-4 bg-white rounded-xl border border-[#E7DEC8] space-y-2">
                  <p className="font-semibold text-stone-800">{product.benefits || 'High in natural nutrients, easy on digestion, and prepared with healthy traditional methods.'}</p>
                  <p className="text-stone-500 text-xs">At ManaDeshi Dukaan, we ensure slow processing to retain bio-active enzymes, essential micronutrients, and authentic aroma.</p>
                </div>
              )}

              {activeTab === 'ingredients' && (
                <div className="p-4 bg-white rounded-xl border border-[#E7DEC8] space-y-2">
                  <p className="font-semibold text-stone-800">{product.ingredients || 'Natural organic ingredients sourced directly from verified local Telugu farmers.'}</p>
                  <p className="text-stone-500 text-xs">Zero artificial preservatives, MSG, synthetic food colors, or palm oil.</p>
                </div>
              )}

              {activeTab === 'howToUse' && (
                <div className="p-4 bg-white rounded-xl border border-[#E7DEC8] space-y-2">
                  <p className="font-semibold text-stone-800">{product.how_to_use || 'Mix 1-2 teaspoons with piping hot steamed rice and a spoonful of ManaDeshi A2 Ghee.'}</p>
                </div>
              )}

              {activeTab === 'storage' && (
                <div className="p-4 bg-white rounded-xl border border-[#E7DEC8] space-y-2">
                  <p><strong className="text-stone-800">Shelf Life:</strong> {product.shelf_life || '6 Months from packing'}</p>
                  <p><strong className="text-stone-800">Instructions:</strong> {product.storage_instructions || 'Store in a cool, dry place. Keep container tightly closed.'}</p>
                </div>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
