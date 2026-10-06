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
    <div className="product-card" onClick={() => onOpenDetail(product)}>

      {/* ── Image ── */}
      <div className="product-card-img-wrap">
        <img
          src={(product.images && product.images[0]) || 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80'}
          alt={product.name}
        />

        {/* Badges */}
        <div className="product-card-badges">
          {product.is_bestseller && <span className="badge badge-terra">Bestseller</span>}
          {discountPct > 0      && <span className="badge badge-amber">{discountPct}% OFF</span>}
          {product.is_new_arrival && <span className="badge badge-green">New</span>}
        </div>

        {/* Wishlist */}
        <button
          className={`product-card-wishlist${isFavorited ? ' active' : ''}`}
          onClick={handleWishlist}
          title={isFavorited ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart
            size={14}
            style={isFavorited ? { fill: '#EF4444', color: '#EF4444' } : { color: 'var(--text-mid)' }}
          />
        </button>

        {/* Organic tag */}
        <div style={{
          position: 'absolute', bottom: 8, left: 8,
          display: 'flex', alignItems: 'center', gap: 4,
          background: 'rgba(255,255,255,.9)', backdropFilter: 'blur(6px)',
          padding: '3px 8px', borderRadius: 6,
          fontSize: 10, fontWeight: 700, color: 'var(--green)',
        }}>
          <Sparkles size={11} color="var(--amber)" />
          Natural &amp; Pure
        </div>
      </div>

      {/* ── Body ── */}
      <div className="product-card-body">

        {/* Category & Rating row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
          <span className="product-card-category">{product.category_name || 'Traditional'}</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 11, fontWeight: 700, color: '#D97706' }}>
            <Star size={11} style={{ fill: '#F59E0B', color: '#F59E0B' }} />
            {product.rating || '5.0'}
          </span>
        </div>

        {/* Name */}
        <div className="product-card-name">{product.name}</div>

        {/* Tagline */}
        <div className="product-card-tagline"
          style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {product.tagline || product.short_description}
        </div>

        {/* Variant selector */}
        {product.variants && product.variants.length > 1 && (
          <div style={{ marginBottom: 10 }} onClick={e => e.stopPropagation()}>
            <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--text-light)', marginBottom: 5 }}>
              Size:
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
              {product.variants.map(v => (
                <button
                  key={v.id}
                  onClick={() => setSelectedVariant(v)}
                  style={{
                    padding: '4px 9px',
                    borderRadius: 6,
                    fontSize: 11,
                    fontWeight: 700,
                    border: '1.5px solid',
                    borderColor: selectedVariant.id === v.id ? 'var(--green)' : 'var(--border-mid)',
                    background: selectedVariant.id === v.id ? 'var(--green)' : 'var(--cream)',
                    color: selectedVariant.id === v.id ? '#fff' : 'var(--text-dark)',
                    transition: 'all .12s',
                  }}
                >
                  {v.title}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Footer: price + add btn */}
        <div className="product-card-footer">
          <div className="product-card-price">
            <span className="product-card-price-main">₹{currentPrice}</span>
            {comparePrice && comparePrice > currentPrice && (
              <span className="product-card-price-compare">₹{comparePrice}</span>
            )}
          </div>

          <button
            className="product-card-add"
            onClick={handleAdd}
            style={added ? { background: '#16A34A' } : {}}
          >
            {added ? <Check size={13} /> : <ShoppingBag size={13} />}
            <span>{added ? 'Added' : 'Add'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
