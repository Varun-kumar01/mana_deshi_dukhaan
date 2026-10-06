import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  Phone, 
  CreditCard, 
  Truck, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle,
  Building,
  User,
  ShoppingBag
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { createOrder } from '../services/api';
import { Order } from '../types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderSuccess: (order: Order, whatsappUrl?: string) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  onOrderSuccess
}) => {
  const { cart, subtotal, deliveryFee, couponDiscount, appliedCoupon, totalAmount, clearCart } = useCart();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    flatHouse: '',
    streetArea: '',
    landmark: '',
    city: 'Hyderabad',
    state: 'Telangana',
    pincode: '500089',
    specialInstructions: ''
  });

  React.useEffect(() => {
    if (!isOpen || !user) return;
    setFormData(prev => ({
      ...prev,
      fullName: prev.fullName || user.name || '',
      phone: prev.phone || (user.phone || '').replace(/^\+91\s?/, ''),
      email: prev.email || user.email || '',
    }));
  }, [isOpen, user]);

  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'UPI' | 'Razorpay' | 'WhatsApp'>('UPI');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  // Quick area preset helper
  const handleSelectAreaPreset = (area: string, pin: string) => {
    setFormData(prev => ({
      ...prev,
      streetArea: `${area}, Hyderabad`,
      pincode: pin
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (cart.length === 0) {
      setErrorMessage('Your cart is empty.');
      return;
    }

    if (!formData.fullName.trim() || !formData.phone.trim() || !formData.flatHouse.trim() || !formData.pincode.trim()) {
      setErrorMessage('Please fill in all required shipping fields');
      return;
    }

    setIsSubmitting(true);

    const orderPayload = {
      user_id: user?.id,
      customer_name: formData.fullName,
      customer_phone: '+91 ' + formData.phone.replace(/^\+91/, '').trim(),
      customer_email: formData.email,
      delivery_address: {
        full_name: formData.fullName,
        phone: formData.phone,
        flat_house: formData.flatHouse,
        street_area: formData.streetArea,
        landmark: formData.landmark,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode
      },
      items: cart.map(item => ({
        product_id: item.product_id,
        product_name: item.name,
        variant_title: item.variant_title,
        price: item.price,
        quantity: item.quantity,
        product_image: item.image
      })),
      subtotal,
      discount_amount: couponDiscount,
      delivery_fee: deliveryFee,
      total_amount: totalAmount,
      coupon_code: appliedCoupon ? appliedCoupon.code : null,
      payment_method: paymentMethod,
      special_instructions: formData.specialInstructions
    };

    try {
      const res = await createOrder(orderPayload);
      if (res.success && res.order) {
        // Trigger celebratory confetti
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });

        clearCart();
        onClose();
        onOrderSuccess(res.order, res.whatsappUrl);
      } else {
        setErrorMessage(res.message || 'Failed to place order. Please try again.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Error communicating with server');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="relative bg-[#FAF7F2] rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-[#E7DEC8] max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:px-6 bg-white border-b border-[#E7DEC8]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#1E3A27] text-white flex items-center justify-center font-bold">
              <Truck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif-display font-bold text-stone-800 text-lg">Checkout & Delivery</h3>
              <p className="text-xs text-stone-500">ManaDeshi Dukaan by Swathi • Manikonda</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-stone-100 text-stone-500 hover:text-stone-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-5">
          
          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Quick Hyderabad Area Presets */}
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-stone-600 mb-1.5 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-[#B35427]" />
              Quick Delivery Zone Select:
            </div>
            <div className="flex flex-wrap gap-1.5">
              {[
                { name: 'Manikonda (Store Area)', pin: '500089' },
                { name: 'Gachibowli', pin: '500032' },
                { name: 'Kondapur', pin: '500084' },
                { name: 'Madhapur / Hitec City', pin: '500081' },
                { name: 'Jubilee Hills', pin: '500033' },
              ].map(preset => (
                <button
                  type="button"
                  key={preset.pin}
                  onClick={() => handleSelectAreaPreset(preset.name, preset.pin)}
                  className={`text-[11px] px-2.5 py-1 rounded-lg border font-semibold transition-all ${
                    formData.pincode === preset.pin
                      ? 'bg-[#1E3A27] text-white border-[#1E3A27]'
                      : 'bg-white text-stone-700 border-[#D8CEB9] hover:border-[#1E3A27]'
                  }`}
                >
                  {preset.name} ({preset.pin})
                </button>
              ))}
            </div>
          </div>

          {/* Contact Details */}
          <div className="p-4 bg-white rounded-2xl border border-[#E7DEC8] space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-800 flex items-center gap-1.5">
              <User className="w-4 h-4 text-[#1E3A27]" />
              1. Customer Information
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-bold text-stone-600 block mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="e.g. Ravi Teja"
                  className="w-full px-3 py-2 text-xs bg-[#FAF7F2] border border-[#D8CEB9] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#1E3A27]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-stone-600 block mb-1">WhatsApp / Phone Number *</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="e.g. 9849012345"
                  className="w-full px-3 py-2 text-xs bg-[#FAF7F2] border border-[#D8CEB9] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#1E3A27]"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-stone-600 block mb-1">Email Address (Optional)</label>
              <input
                type="email"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                placeholder="ravi.teja@gmail.com"
                className="w-full px-3 py-2 text-xs bg-[#FAF7F2] border border-[#D8CEB9] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#1E3A27]"
              />
            </div>
          </div>

          {/* Shipping Address */}
          <div className="p-4 bg-white rounded-2xl border border-[#E7DEC8] space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-800 flex items-center gap-1.5">
              <Building className="w-4 h-4 text-[#1E3A27]" />
              2. Delivery Address in Hyderabad
            </h4>

            <div>
              <label className="text-[11px] font-bold text-stone-600 block mb-1">Flat / Villa / House No. & Building *</label>
              <input
                type="text"
                required
                value={formData.flatHouse}
                onChange={e => setFormData({ ...formData, flatHouse: e.target.value })}
                placeholder="e.g. Flat 302, Sai Srinivasa Nilayam"
                className="w-full px-3 py-2 text-xs bg-[#FAF7F2] border border-[#D8CEB9] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#1E3A27]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-bold text-stone-600 block mb-1">Street / Colony / Area *</label>
                <input
                  type="text"
                  required
                  value={formData.streetArea}
                  onChange={e => setFormData({ ...formData, streetArea: e.target.value })}
                  placeholder="e.g. Srinivasa Colony, Manikonda"
                  className="w-full px-3 py-2 text-xs bg-[#FAF7F2] border border-[#D8CEB9] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#1E3A27]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-stone-600 block mb-1">Nearby Landmark</label>
                <input
                  type="text"
                  value={formData.landmark}
                  onChange={e => setFormData({ ...formData, landmark: e.target.value })}
                  placeholder="e.g. Lane beside Pizza Hut & Harivillu Apts"
                  className="w-full px-3 py-2 text-xs bg-[#FAF7F2] border border-[#D8CEB9] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#1E3A27]"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-[11px] font-bold text-stone-600 block mb-1">Pincode *</label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={formData.pincode}
                  onChange={e => setFormData({ ...formData, pincode: e.target.value })}
                  placeholder="500089"
                  className="w-full px-3 py-2 text-xs bg-[#FAF7F2] border border-[#D8CEB9] rounded-xl font-bold focus:outline-none focus:ring-1 focus:ring-[#1E3A27]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-stone-600 block mb-1">City</label>
                <input
                  type="text"
                  readOnly
                  value={formData.city}
                  className="w-full px-3 py-2 text-xs bg-stone-100 border border-stone-200 rounded-xl text-stone-600"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-stone-600 block mb-1">State</label>
                <input
                  type="text"
                  readOnly
                  value={formData.state}
                  className="w-full px-3 py-2 text-xs bg-stone-100 border border-stone-200 rounded-xl text-stone-600"
                />
              </div>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="p-4 bg-white rounded-2xl border border-[#E7DEC8] space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-800 flex items-center gap-1.5">
              <CreditCard className="w-4 h-4 text-[#1E3A27]" />
              3. Payment Method
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              
              {/* UPI Option */}
              <label className={`p-3 rounded-xl border cursor-pointer transition-all flex items-start gap-2.5 ${
                paymentMethod === 'UPI' ? 'border-[#1E3A27] bg-[#FAF7F2] shadow-sm' : 'border-[#D8CEB9]'
              }`}>
                <input
                  type="radio"
                  name="payment"
                  value="UPI"
                  checked={paymentMethod === 'UPI'}
                  onChange={() => setPaymentMethod('UPI')}
                  className="mt-0.5 text-[#1E3A27] focus:ring-[#1E3A27]"
                />
                <div>
                  <div className="text-xs font-bold text-stone-800">UPI / GPay / PhonePe</div>
                  <div className="text-[10px] text-stone-500">Scan & Pay on Delivery or Instant</div>
                </div>
              </label>

              {/* Razorpay Online */}
              <label className={`p-3 rounded-xl border cursor-pointer transition-all flex items-start gap-2.5 ${
                paymentMethod === 'Razorpay' ? 'border-[#1E3A27] bg-[#FAF7F2] shadow-sm' : 'border-[#D8CEB9]'
              }`}>
                <input
                  type="radio"
                  name="payment"
                  value="Razorpay"
                  checked={paymentMethod === 'Razorpay'}
                  onChange={() => setPaymentMethod('Razorpay')}
                  className="mt-0.5 text-[#1E3A27] focus:ring-[#1E3A27]"
                />
                <div>
                  <div className="text-xs font-bold text-stone-800">Card / Netbanking</div>
                  <div className="text-[10px] text-stone-500">Razorpay Secure Online</div>
                </div>
              </label>

              {/* Cash on Delivery */}
              <label className={`p-3 rounded-xl border cursor-pointer transition-all flex items-start gap-2.5 ${
                paymentMethod === 'COD' ? 'border-[#1E3A27] bg-[#FAF7F2] shadow-sm' : 'border-[#D8CEB9]'
              }`}>
                <input
                  type="radio"
                  name="payment"
                  value="COD"
                  checked={paymentMethod === 'COD'}
                  onChange={() => setPaymentMethod('COD')}
                  className="mt-0.5 text-[#1E3A27] focus:ring-[#1E3A27]"
                />
                <div>
                  <div className="text-xs font-bold text-stone-800">Cash on Delivery</div>
                  <div className="text-[10px] text-stone-500">Pay cash upon delivery</div>
                </div>
              </label>

            </div>
          </div>

          {/* Order Summary Recap */}
          <div className="p-4 bg-[#FAF7F2] rounded-2xl border border-[#E7DEC8] space-y-1.5 text-xs text-stone-600">
            <div className="flex justify-between">
              <span>Selected Products ({cart.length} items)</span>
              <span className="font-semibold text-stone-800">₹{subtotal}</span>
            </div>
            {couponDiscount > 0 && (
              <div className="flex justify-between text-emerald-700 font-bold">
                <span>Coupon Discount ({appliedCoupon?.code})</span>
                <span>-₹{couponDiscount}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Hyderabad Delivery</span>
              <span className="font-semibold text-stone-800">
                {deliveryFee === 0 ? <span className="text-emerald-700 font-bold">FREE</span> : `₹${deliveryFee}`}
              </span>
            </div>
            <div className="flex justify-between text-sm sm:text-base font-extrabold text-[#1E3A27] pt-2 border-t border-[#D8CEB9]">
              <span>Grand Total to Pay</span>
              <span>₹{totalAmount}</span>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 px-6 rounded-xl bg-[#1E3A27] hover:bg-[#162D1F] text-white font-extrabold text-sm shadow-xl flex items-center justify-center gap-2 transition-all"
          >
            {isSubmitting ? (
              <span>Placing your fresh order...</span>
            ) : (
              <>
                <CheckCircle2 className="w-5 h-5 text-[#FBBF24]" />
                <span>Confirm & Place Order (₹{totalAmount})</span>
              </>
            )}
          </button>

          <p className="text-[11px] text-center text-stone-500">
            🔒 By placing an order, you agree to ManaDeshi Dukaan's freshness guarantee & return policy.
          </p>

        </form>

      </div>
    </div>
  );
};
