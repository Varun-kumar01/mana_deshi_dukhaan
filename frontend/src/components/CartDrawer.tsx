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
      <div className="fixed inset-0 z-[300] bg-black/35 backdrop-blur-[3px]" onClick={() => setIsCartOpen(false)} />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 z-[301] flex w-full max-w-[400px] flex-col bg-white pb-[env(safe-area-inset-bottom)] animate-[slideInRight_.25s_ease]">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#E7DEC8] px-5 py-[18px]">
          <div className="flex items-center gap-[10px]">
            <div className="flex h-[34px] w-[34px] items-center justify-center rounded-lg bg-[#1E3A27] text-white">
              <ShoppingBag size={16} />
            </div>
            <div>
              <div className="font-[family-name:'Playfair_Display',Georgia,serif] text-xl font-extrabold text-[#1A2318]">Your Cart</div>
              <div className="text-xs text-[#4B5563]">{itemCount} item{itemCount !== 1 ? 's' : ''}</div>
            </div>
          </div>
          <button className="flex h-[34px] w-[34px] items-center justify-center rounded-full bg-[#F4EFE6] text-[#4B5563] transition-colors hover:bg-[#D8CEB9]" onClick={() => setIsCartOpen(false)}>
            <X size={18} />
          </button>
        </div>

        {/* Free delivery progress */}
        <div className="mx-4 mt-3 rounded-lg border border-[#1E3A27]/15 bg-[#EEF5F0] px-3.5 py-2.5 text-xs font-semibold text-[#1E3A27]">
          <div className="flex items-center gap-1.5">
            <Truck size={14} />
            {amountNeededForFreeDelivery === 0
              ? '🎉 FREE delivery unlocked!'
              : `Add ₹${amountNeededForFreeDelivery} more for free delivery`}
          </div>
          <div className="mt-2 h-1 overflow-hidden rounded-full bg-[#1E3A27]/[.12]">
            <div className="h-full rounded-full bg-[#1E3A27] transition-[width] duration-300" style={{ width: `${progress}%` }} />
          </div>
        </div>

        {/* Items */}
        <div className="flex flex-1 flex-col gap-3 overflow-y-auto p-4">
          {cart.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center py-12 text-center">
              <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-[#F4EFE6]">
                <ShoppingBag size={28} color="var(--text-light)" />
              </div>
              <div className="mb-1.5 font-[family-name:'Playfair_Display',Georgia,serif] text-lg font-extrabold text-[#1A2318]">
                Your cart is empty
              </div>
              <div className="max-w-[240px] text-[13px] text-[#4B5563]">
                Discover homemade pickles, stone-ground podis, pure A2 ghee and more.
              </div>
              <button
                className="mt-5 inline-flex items-center justify-center gap-2 rounded-lg bg-[#1E3A27] px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-[#2B5336]"
                onClick={() => setIsCartOpen(false)}
              >
                Start Shopping
              </button>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.id} className="flex gap-3 rounded-[14px] border border-[#E7DEC8] bg-[#FAF7F2] p-3">
                <img
                  src={item.image || '/visiting_card.png'}
                  alt={item.name}
                  className="h-16 w-16 shrink-0 rounded-[10px] object-cover"
                />
                <div className="min-w-0 flex-1">
                  <div className="text-[13.5px] font-bold leading-[1.3] text-[#1A2318]">{item.name}</div>
                  <div className="mt-0.5 text-[11px] text-[#4B5563]">{item.variant_title}</div>
                  <div className="text-[15px] font-extrabold text-[#1E3A27]">₹{item.price * item.quantity}</div>
                  <div className="mt-2 flex items-center gap-2">
                    <button className="flex h-[26px] w-[26px] items-center justify-center rounded-md border-[1.5px] border-[#D8CEB9] bg-white text-sm font-bold text-[#1A2318] transition-all hover:border-[#1E3A27] hover:text-[#1E3A27]" onClick={() => updateQuantity(item.id, -1)}>−</button>
                    <span className="min-w-5 text-center text-sm font-bold text-[#1A2318]">{item.quantity}</span>
                    <button className="flex h-[26px] w-[26px] items-center justify-center rounded-md border-[1.5px] border-[#D8CEB9] bg-white text-sm font-bold text-[#1A2318] transition-all hover:border-[#1E3A27] hover:text-[#1E3A27]" onClick={() => updateQuantity(item.id, 1)}>+</button>
                    <button className="ml-auto text-[#9CA3AF] transition-colors hover:text-red-600" onClick={() => removeFromCart(item.id)}>
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
          <div className="border-t border-[#E7DEC8] bg-[#FAF7F2] px-5 py-4">

            {/* Coupon */}
            {appliedCoupon ? (
              <div className="mb-2.5 flex items-center justify-between rounded-lg border border-green-200 bg-green-50 px-3 py-[9px] text-xs font-bold text-green-800">
                <span><Tag size={13} className="mr-1 inline" />
                  {appliedCoupon.code} applied (−₹{couponDiscount})
                </span>
                <button onClick={removeCoupon} className="text-[11px] text-[#4B5563] underline">
                  Remove
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon}>
                <div className="my-2.5 flex gap-2">
                  <input
                    className="min-w-0 flex-1 rounded-lg border-[1.5px] border-[#D8CEB9] px-3.5 py-[9px] text-[13px] uppercase tracking-[.04em] outline-none focus:border-[#1E3A27]"
                    type="text"
                    placeholder="Coupon code (MANADESHI10)"
                    value={couponInput}
                    onChange={e => setCouponInput(e.target.value.toUpperCase())}
                  />
                  <button type="submit" className="rounded-lg bg-[#1E3A27] px-4 py-[9px] text-[13px] font-bold text-white disabled:opacity-60" disabled={isApplying}>
                    {isApplying ? '...' : 'Apply'}
                  </button>
                </div>
                {couponError && (
                  <div className="mt-1 text-[11px] text-red-600">{couponError}</div>
                )}
              </form>
            )}

            {/* Totals */}
            <div className="mb-3 flex flex-col gap-2 border-t border-[#E7DEC8] pt-3">
              <div className="flex justify-between text-[13px] text-[#4B5563]">
                <span>Subtotal</span>
                <span>₹{subtotal}</span>
              </div>
              {couponDiscount > 0 && (
                <div className="flex justify-between text-[13px] font-bold text-green-600">
                  <span>Discount ({appliedCoupon?.code})</span>
                  <span>−₹{couponDiscount}</span>
                </div>
              )}
              <div className="flex justify-between text-[13px] text-[#4B5563]">
                <span>Delivery</span>
                <span className={deliveryFee === 0 ? 'font-bold text-green-600' : 'font-bold'}>
                  {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
                </span>
              </div>
              <div className="mt-1 flex justify-between text-base font-extrabold text-[#1A2318]">
                <span>Total</span>
                <span className="text-[#1E3A27]">₹{totalAmount}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2">
              <button
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#1E3A27] px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-[#2B5336]"
                onClick={() => { setIsCartOpen(false); onProceedToCheckout(); }}
              >
                Proceed to Checkout <ArrowRight size={15} />
              </button>
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#25D366] px-6 py-3 text-[13px] font-bold text-white no-underline transition-colors hover:bg-[#1EBE5D]"
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
