import React, { useState } from 'react';
import { ShoppingBag, Heart, Star, Check, Sparkles } from 'lucide-react';
import { Product, ProductVariant } from '../types';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

interface ProductCardProps {
  product: Product;
  onOpenDetail: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onOpenDetail }) => {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(() =>
    (product.variants && product.variants[0]) || {
      id: product.id,
      title: 'Standard',
      price: product.base_price,
      compare_price: product.compare_at_price,
      stock_quantity: 50,
    }
  );
  const [added, setAdded] = useState(false);

  const isFavorited = isInWishlist(product.id);
  const currentPrice = selectedVariant.price;
  const comparePrice = selectedVariant.compare_price || product.compare_at_price;
  const discountPct = comparePrice && comparePrice > currentPrice
    ? Math.round(((comparePrice - currentPrice) / comparePrice) * 100)
    : 0;

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, selectedVariant, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1300);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  return (
    <div
      className="group flex cursor-pointer flex-col overflow-hidden rounded-[20px] border-[1.5px] border-[#E7DEC8] bg-white transition-all duration-200 hover:border-[#D8CEB9] hover:shadow-sm"
      onClick={() => onOpenDetail(product)}
    >

      {/* ── Image ── */}
      <div className="relative aspect-square overflow-hidden bg-[#F4EFE6]">
        <img
          className="h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-105"
          src={(product.images && product.images[0]) || 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80'}
          alt={product.name}
        />

        {/* Badges */}
        <div className="absolute left-2 top-2 flex flex-col gap-1">
          {product.is_bestseller && <span className="inline-block rounded-full bg-[#B35427] px-2 py-[3px] text-[10px] font-bold tracking-[.03em] text-white">Bestseller</span>}
          {discountPct > 0 && <span className="inline-block rounded-full bg-[#D97706] px-2 py-[3px] text-[10px] font-bold tracking-[.03em] text-white">{discountPct}% OFF</span>}
          {product.is_new_arrival && <span className="inline-block rounded-full bg-[#1E3A27] px-2 py-[3px] text-[10px] font-bold tracking-[.03em] text-white">New</span>}
        </div>

        {/* Wishlist */}
        <button
          className={`absolute right-2 top-2 flex h-[30px] w-[30px] items-center justify-center rounded-full border border-[#E7DEC8] bg-white transition-all hover:border-red-500 hover:bg-red-100 ${
            isFavorited ? 'border-red-500 bg-red-100' : ''
          }`}
          onClick={handleWishlist}
          title={isFavorited ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart
            size={14}
            className={isFavorited ? 'fill-red-500 text-red-500' : 'text-[#4B5563]'}
          />
        </button>

        {/* Organic tag */}
        <div className="absolute bottom-2 left-2 flex items-center gap-1 rounded-md bg-white/90 px-2 py-[3px] text-[10px] font-bold text-[#1E3A27] backdrop-blur-md">
          <Sparkles size={11} className="text-[#D97706]" />
          Natural &amp; Pure
        </div>
      </div>

      {/* ── Body ── */}
      <div className="flex flex-1 flex-col p-3">

        {/* Category & Rating row */}
        <div className="mb-1 flex items-center justify-between">
          <span className="mb-1 text-[10px] font-bold uppercase tracking-[.07em] text-[#B35427]">{product.category_name || 'Traditional'}</span>
          <span className="flex items-center gap-[3px] text-[11px] font-bold text-[#D97706]">
            <Star size={11} className="fill-amber-500 text-amber-500" />
            {product.rating || '5.0'}
          </span>
        </div>

        {/* Name */}
        <div className="mb-1 font-[family-name:'Playfair_Display',Georgia,serif] text-[15px] font-bold leading-[1.3] text-[#1A2318]">{product.name}</div>

        {/* Tagline */}
        <div className="mb-[10px] line-clamp-2 flex-1 text-[11.5px] leading-[1.4] text-[#4B5563]">
          {product.tagline || product.short_description}
        </div>

        {/* Variant selector */}
        {product.variants && product.variants.length > 1 && (
          <div className="mb-[10px]" onClick={e => e.stopPropagation()}>
            <div className="mb-[5px] text-[10px] font-bold uppercase tracking-[.06em] text-[#9CA3AF]">
              Size:
            </div>
            <div className="flex flex-wrap gap-[5px]">
              {product.variants.map(v => (
                <button
                  key={v.id}
                  onClick={() => setSelectedVariant(v)}
                  className={`rounded-md border-[1.5px] px-[9px] py-1 text-[11px] font-bold transition-all ${
                    selectedVariant.id === v.id
                      ? 'border-[#1E3A27] bg-[#1E3A27] text-white'
                      : 'border-[#D8CEB9] bg-[#FAF7F2] text-[#1A2318]'
                  }`}
                >
                  {v.title}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Footer: price + add btn */}
        <div className="mt-auto flex items-center justify-between gap-2">
          <div className="flex flex-col">
            <span className="text-[17px] font-extrabold leading-none text-[#1E3A27]">₹{currentPrice}</span>
            {comparePrice && comparePrice > currentPrice && (
              <span className="text-[11px] text-[#9CA3AF] line-through">₹{comparePrice}</span>
            )}
          </div>

          <button
            className={`flex shrink-0 items-center gap-1 rounded-lg px-3 py-[7px] text-xs font-bold text-white transition-all hover:bg-[#2B5336] ${
              added ? 'bg-green-600' : 'bg-[#1E3A27]'
            }`}
            onClick={handleAdd}
          >
            {added ? <Check size={13} /> : <ShoppingBag size={13} />}
            <span>{added ? 'Added' : 'Add'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
