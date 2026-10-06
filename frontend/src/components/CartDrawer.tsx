import React, { useState } from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, Tag, Phone, Truck } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface CartDrawerProps {
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onProceedToCheckout }) => {
  const {
    cart, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity,
    subtotal, deliveryFee, freeDeliveryThreshold, amountNeededForFreeDelivery,
    totalAmount, appliedCoupon, couponDiscount, couponError,
    applyCouponCode, removeCoupon, itemCount,
  } = useCart();

  const [couponInput, setCouponInput] = useState('');
  const [isApplying, setIsApplying] = useState(false);

  if (!isCartOpen) return null;

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    setIsApplying(true);
    await applyCouponCode(couponInput);
    setIsApplying(false);
  };

  const progress = Math.min(100, Math.round((subtotal / freeDeliveryThreshold) * 100));

  const waText = encodeURIComponent(
    `Hi Swathi, I'd like to order:\n\n` +
    cart.map(i => `• ${i.name} (${i.variant_title}) x${i.quantity} = ₹${i.price * i.quantity}`).join('\n') +
    `\n\nTotal: ₹${totalAmount}\nPlease confirm!`
  );
  const waUrl = `https://wa.me/919951118687?text=${waText}`;

  return (
    <>
      {/* Overlay */}
      <div className="cart-overlay" onClick={() => setIsCartOpen(false)} />

      {/* Drawer */}
      <div className="cart-drawer">

        {/* Header */}
        <div className="cart-drawer-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 34, height: 34, borderRadius: 8,
              background: 'var(--green)', color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <ShoppingBag size={16} />
            </div>
            <div>
              <div className="cart-drawer-title">Your Cart</div>
              <div style={{ fontSize: 12, color: 'var(--text-mid)' }}>{itemCount} item{itemCount !== 1 ? 's' : ''}</div>
            </div>
          </div>
          <button className="cart-drawer-close" onClick={() => setIsCartOpen(false)}>
            <X size={18} />
          </button>
        </div>

        {/* Free delivery progress */}
        <div className="free-delivery-bar" style={{ margin: '0 16px', marginTop: 12, borderRadius: 'var(--radius-sm)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Truck size={14} />
            {amountNeededForFreeDelivery === 0
              ? '🎉 FREE delivery unlocked!'
              : `Add ₹${amountNeededForFreeDelivery} more for free delivery`}
          </div>
          <div className="free-delivery-progress">
            <div className="free-delivery-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>

        {/* Items */}
        <div className="cart-drawer-body">
          {cart.length === 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, textAlign: 'center', padding: '48px 0' }}>
              <div style={{
                width: 64, height: 64, borderRadius: '50%',
                background: 'var(--cream-2)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: 12,
              }}>
                <ShoppingBag size={28} color="var(--text-light)" />
              </div>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 800, color: 'var(--text-dark)', marginBottom: 6 }}>
                Your cart is empty
              </div>
              <div style={{ fontSize: 13, color: 'var(--text-mid)', maxWidth: 240 }}>
                Discover homemade pickles, stone-ground podis, pure A2 ghee and more.
              </div>
              <button
                className="btn-primary"
                style={{ marginTop: 20 }}
                onClick={() => setIsCartOpen(false)}
              >
                Start Shopping
              </button>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.id} className="cart-item">
                <img
                  src={item.image || '/visiting_card.png'}
                  alt={item.name}
                  className="cart-item-img"
                />
                <div className="cart-item-info">
                  <div className="cart-item-name">{item.name}</div>
                  <div className="cart-item-variant">{item.variant_title}</div>
                  <div className="cart-item-price">₹{item.price * item.quantity}</div>
                  <div className="cart-item-controls">
                    <button className="qty-btn" onClick={() => updateQuantity(item.id, -1)}>−</button>
                    <span className="qty-count">{item.quantity}</span>
                    <button className="qty-btn" onClick={() => updateQuantity(item.id, 1)}>+</button>
                    <button className="cart-item-remove" onClick={() => removeFromCart(item.id)}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="cart-drawer-footer">

            {/* Coupon */}
            {appliedCoupon ? (
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '9px 12px', marginBottom: 10,
                background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: 8,
                fontSize: 12, fontWeight: 700, color: '#166534',
              }}>
                <span><Tag size={13} style={{ display: 'inline', marginRight: 4 }} />
                  {appliedCoupon.code} applied (−₹{couponDiscount})
                </span>
                <button onClick={removeCoupon} style={{ fontSize: 11, color: 'var(--text-mid)', textDecoration: 'underline' }}>
                  Remove
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon}>
                <div className="coupon-row">
                  <input
                    className="coupon-input"
                    type="text"
                    placeholder="Coupon code (MANADESHI10)"
                    value={couponInput}
                    onChange={e => setCouponInput(e.target.value.toUpperCase())}
                  />
                  <button type="submit" className="coupon-apply" disabled={isApplying}>
                    {isApplying ? '...' : 'Apply'}
                  </button>
                </div>
                {couponError && (
                  <div style={{ fontSize: 11, color: '#DC2626', marginTop: 4 }}>{couponError}</div>
                )}
              </form>
            )}

            {/* Totals */}
            <div className="cart-totals" style={{ borderTop: '1px solid var(--border)', paddingTop: 12 }}>
              <div className="cart-total-row">
                <span>Subtotal</span>
                <span>₹{subtotal}</span>
              </div>
              {couponDiscount > 0 && (
                <div className="cart-total-row" style={{ color: '#16A34A', fontWeight: 700 }}>
                  <span>Discount ({appliedCoupon?.code})</span>
                  <span>−₹{couponDiscount}</span>
                </div>
              )}
              <div className="cart-total-row">
                <span>Delivery</span>
                <span style={{ color: deliveryFee === 0 ? '#16A34A' : undefined, fontWeight: 700 }}>
                  {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
                </span>
              </div>
              <div className="cart-total-row grand">
                <span>Total</span>
                <span className="amount">₹{totalAmount}</span>
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <button
                className="btn-primary"
                style={{ width: '100%' }}
                onClick={() => { setIsCartOpen(false); onProceedToCheckout(); }}
              >
                Proceed to Checkout <ArrowRight size={15} />
              </button>
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-whatsapp"
                style={{ fontSize: 13 }}
              >
                <Phone size={14} /> Send to WhatsApp
              </a>
            </div>

          </div>
        )}
      </div>
    </>
  );
};
