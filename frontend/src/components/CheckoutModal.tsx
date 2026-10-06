import React, { useEffect, useState } from 'react';
import {
  AlertCircle,
  Building,
  CheckCircle2,
  CreditCard,
  MapPin,
  Truck,
  User,
  X,
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

type PaymentMethod = 'COD' | 'UPI' | 'Razorpay' | 'WhatsApp';

const inputClassName =
  'w-full rounded-xl border border-[#D8CEB9] bg-[#FAF7F2] px-3 py-2.5 text-xs text-stone-800 outline-none transition placeholder:text-stone-400 focus:border-[#1E3A27] focus:ring-2 focus:ring-[#1E3A27]/10';

const labelClassName =
  'mb-1.5 block text-[11px] font-bold text-stone-600';

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  onOrderSuccess,
}) => {
  const {
    cart,
    subtotal,
    deliveryFee,
    couponDiscount,
    appliedCoupon,
    totalAmount,
    clearCart,
  } = useCart();

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
    specialInstructions: '',
  });

  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>('UPI');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] =
    useState<string | null>(null);

  useEffect(() => {
    if (!isOpen || !user) return;

    setFormData((previous) => ({
      ...previous,
      fullName: previous.fullName || user.name || '',
      phone:
        previous.phone ||
        (user.phone || '').replace(/^\+?91\s?/, ''),
      email: previous.email || user.email || '',
    }));
  }, [isOpen, user]);

  if (!isOpen) return null;

  const updateField = (
    field: keyof typeof formData,
    value: string
  ) => {
    setFormData((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const handleSelectAreaPreset = (
    area: string,
    pin: string
  ) => {
    setFormData((previous) => ({
      ...previous,
      streetArea: `${area}, Hyderabad`,
      pincode: pin,
    }));
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    setErrorMessage(null);

    if (cart.length === 0) {
      setErrorMessage('Your cart is empty.');
      return;
    }

    if (
      !formData.fullName.trim() ||
      !formData.phone.trim() ||
      !formData.flatHouse.trim() ||
      !formData.streetArea.trim() ||
      !formData.pincode.trim()
    ) {
      setErrorMessage(
        'Please fill in all required shipping fields.'
      );
      return;
    }

    if (!/^\d{6}$/.test(formData.pincode.trim())) {
      setErrorMessage(
        'Please enter a valid 6-digit pincode.'
      );
      return;
    }

    if (
      formData.phone.replace(/\D/g, '').length < 10
    ) {
      setErrorMessage(
        'Please enter a valid 10-digit phone number.'
      );
      return;
    }

    setIsSubmitting(true);

    const cleanPhone = formData.phone
      .replace(/\D/g, '')
      .replace(/^91/, '');

    const orderPayload = {
      user_id: user?.id,
      customer_name: formData.fullName.trim(),
      customer_phone: `+91 ${cleanPhone}`,
      customer_email: formData.email.trim(),
      delivery_address: {
        full_name: formData.fullName.trim(),
        phone: formData.phone.trim(),
        flat_house: formData.flatHouse.trim(),
        street_area: formData.streetArea.trim(),
        landmark: formData.landmark.trim(),
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode.trim(),
      },
      items: cart.map((item) => ({
        product_id: item.product_id,
        product_name: item.name,
        variant_title: item.variant_title,
        price: item.price,
        quantity: item.quantity,
        product_image: item.image,
      })),
      subtotal,
      discount_amount: couponDiscount,
      delivery_fee: deliveryFee,
      total_amount: totalAmount,
      coupon_code: appliedCoupon
        ? appliedCoupon.code
        : null,
      payment_method: paymentMethod,
      special_instructions:
        formData.specialInstructions.trim(),
    };

    try {
      const response = await createOrder(orderPayload);

      if (response.success && response.order) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });

        clearCart();
        onClose();

        onOrderSuccess(
          response.order,
          response.whatsappUrl
        );
      } else {
        setErrorMessage(
          response.message ||
            'Failed to place order. Please try again.'
        );
      }
    } catch (error: any) {
      setErrorMessage(
        error?.message ||
          'Error communicating with server. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const presets = [
    { name: 'Manikonda', pin: '500089' },
    { name: 'Gachibowli', pin: '500032' },
    { name: 'Kondapur', pin: '500084' },
    { name: 'Madhapur / Hitec City', pin: '500081' },
    { name: 'Jubilee Hills', pin: '500033' },
  ];

  const paymentOptions: {
    value: PaymentMethod;
    title: string;
    description: string;
  }[] = [
    {
      value: 'UPI',
      title: 'UPI / GPay / PhonePe',
      description: 'Scan & Pay on Delivery or Instant',
    },
    {
      value: 'Razorpay',
      title: 'Card / Netbanking',
      description: 'Razorpay Secure Online',
    },
    {
      value: 'COD',
      title: 'Cash on Delivery',
      description: 'Pay cash upon delivery',
    },
  ];

  return (
    <div
      className="fixed inset-0 z-[500] flex items-center justify-center overflow-y-auto bg-black/65 p-2 backdrop-blur-sm sm:p-4 lg:p-6"
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="relative flex max-h-[96dvh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-[#E7DEC8] bg-[#FAF7F2] shadow-2xl sm:rounded-[2rem]">
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-[#E7DEC8] bg-white px-3 py-3 sm:px-6 sm:py-4">
          <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#1E3A27] text-white shadow-sm sm:h-10 sm:w-10">
              <Truck size={18} />
            </div>

            <div className="min-w-0">
              <h3 className="font-display text-base font-bold text-stone-800 sm:text-lg">
                Checkout & Delivery
              </h3>

              <p className="truncate text-[9px] text-stone-500 sm:text-xs">
                ManaDeshi Dukaan by Swathi • Manikonda
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close checkout"
            className="ml-2 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-stone-500 transition hover:bg-stone-100 hover:text-stone-900"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="flex-1 space-y-5 overflow-y-auto p-3 sm:p-6"
        >
          {/* Error */}
          {errorMessage && (
            <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700">
              <AlertCircle
                size={16}
                className="mt-0.5 shrink-0"
              />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Quick areas */}
          <section>
            <div className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-stone-600">
              <MapPin
                size={14}
                className="text-[#B35427]"
              />
              Quick Delivery Zone
            </div>

            <div className="flex flex-wrap gap-1.5">
              {presets.map((preset) => {
                const selected =
                  formData.pincode === preset.pin;

                return (
                  <button
                    key={preset.pin}
                    type="button"
                    onClick={() =>
                      handleSelectAreaPreset(
                        preset.name,
                        preset.pin
                      )
                    }
                    className={`rounded-lg border px-2.5 py-1.5 text-[10px] font-semibold transition sm:text-[11px] ${
                      selected
                        ? 'border-[#1E3A27] bg-[#1E3A27] text-white shadow-sm'
                        : 'border-[#D8CEB9] bg-white text-stone-700 hover:border-[#1E3A27]'
                    }`}
                  >
                    {preset.name} ({preset.pin})
                  </button>
                );
              })}
            </div>
          </section>

          {/* Customer information */}
          <section className="space-y-4 rounded-2xl border border-[#E7DEC8] bg-white p-3.5 sm:p-4">
            <h4 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-stone-800">
              <User
                size={15}
                className="text-[#1E3A27]"
              />
              1. Customer Information
            </h4>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className={labelClassName}>
                  Full Name *
                </label>

                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(event) =>
                    updateField(
                      'fullName',
                      event.target.value
                    )
                  }
                  placeholder="e.g. Ravi Teja"
                  className={inputClassName}
                />
              </div>

              <div>
                <label className={labelClassName}>
                  WhatsApp / Phone Number *
                </label>

                <input
                  type="tel"
                  inputMode="tel"
                  required
                  value={formData.phone}
                  onChange={(event) =>
                    updateField(
                      'phone',
                      event.target.value
                    )
                  }
                  placeholder="e.g. 9849012345"
                  className={inputClassName}
                />
              </div>
            </div>

            <div>
              <label className={labelClassName}>
                Email Address (Optional)
              </label>

              <input
                type="email"
                value={formData.email}
                onChange={(event) =>
                  updateField(
                    'email',
                    event.target.value
                  )
                }
                placeholder="ravi.teja@gmail.com"
                className={inputClassName}
              />
            </div>
          </section>

          {/* Address */}
          <section className="space-y-4 rounded-2xl border border-[#E7DEC8] bg-white p-3.5 sm:p-4">
            <h4 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-stone-800">
              <Building
                size={15}
                className="text-[#1E3A27]"
              />
              2. Delivery Address in Hyderabad
            </h4>

            <div>
              <label className={labelClassName}>
                Flat / Villa / House No. & Building *
              </label>

              <input
                type="text"
                required
                value={formData.flatHouse}
                onChange={(event) =>
                  updateField(
                    'flatHouse',
                    event.target.value
                  )
                }
                placeholder="e.g. Flat 302, Sai Srinivasa Nilayam"
                className={inputClassName}
              />
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className={labelClassName}>
                  Street / Colony / Area *
                </label>

                <input
                  type="text"
                  required
                  value={formData.streetArea}
                  onChange={(event) =>
                    updateField(
                      'streetArea',
                      event.target.value
                    )
                  }
                  placeholder="e.g. Srinivasa Colony, Manikonda"
                  className={inputClassName}
                />
              </div>

              <div>
                <label className={labelClassName}>
                  Nearby Landmark
                </label>

                <input
                  type="text"
                  value={formData.landmark}
                  onChange={(event) =>
                    updateField(
                      'landmark',
                      event.target.value
                    )
                  }
                  placeholder="e.g. Near Pizza Hut"
                  className={inputClassName}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div>
                <label className={labelClassName}>
                  Pincode *
                </label>

                <input
                  type="text"
                  inputMode="numeric"
                  required
                  maxLength={6}
                  value={formData.pincode}
                  onChange={(event) =>
                    updateField(
                      'pincode',
                      event.target.value.replace(
                        /\D/g,
                        ''
                      )
                    )
                  }
                  placeholder="500089"
                  className={`${inputClassName} font-bold`}
                />
              </div>

              <div>
                <label className={labelClassName}>
                  City
                </label>

                <input
                  type="text"
                  readOnly
                  value={formData.city}
                  className="w-full rounded-xl border border-stone-200 bg-stone-100 px-3 py-2.5 text-xs text-stone-600 outline-none"
                />
              </div>

              <div>
                <label className={labelClassName}>
                  State
                </label>

                <input
                  type="text"
                  readOnly
                  value={formData.state}
                  className="w-full rounded-xl border border-stone-200 bg-stone-100 px-3 py-2.5 text-xs text-stone-600 outline-none"
                />
              </div>
            </div>

            <div>
              <label className={labelClassName}>
                Special Instructions (Optional)
              </label>

              <textarea
                rows={2}
                value={formData.specialInstructions}
                onChange={(event) =>
                  updateField(
                    'specialInstructions',
                    event.target.value
                  )
                }
                placeholder="Delivery instructions, gate details, etc."
                className={`${inputClassName} resize-none`}
              />
            </div>
          </section>

          {/* Payment */}
          <section className="space-y-3 rounded-2xl border border-[#E7DEC8] bg-white p-3.5 sm:p-4">
            <h4 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-stone-800">
              <CreditCard
                size={15}
                className="text-[#1E3A27]"
              />
              3. Payment Method
            </h4>

            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
              {paymentOptions.map((option) => {
                const selected =
                  paymentMethod === option.value;

                return (
                  <label
                    key={option.value}
                    className={`flex cursor-pointer items-start gap-2.5 rounded-xl border p-3 transition ${
                      selected
                        ? 'border-[#1E3A27] bg-[#FAF7F2] shadow-sm'
                        : 'border-[#D8CEB9] bg-white hover:border-[#1E3A27]'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={option.value}
                      checked={selected}
                      onChange={() =>
                        setPaymentMethod(option.value)
                      }
                      className="mt-0.5 accent-[#1E3A27]"
                    />

                    <div>
                      <div className="text-xs font-bold text-stone-800">
                        {option.title}
                      </div>

                      <div className="mt-0.5 text-[10px] leading-4 text-stone-500">
                        {option.description}
                      </div>
                    </div>
                  </label>
                );
              })}
            </div>
          </section>

          {/* Order summary */}
          <section className="space-y-2 rounded-2xl border border-[#E7DEC8] bg-[#FAF7F2] p-3.5 text-xs text-stone-600 sm:p-4">
            <div className="flex justify-between gap-4">
              <span>
                Selected Products ({cart.length} items)
              </span>

              <span className="font-semibold text-stone-800">
                ₹{subtotal}
              </span>
            </div>

            {couponDiscount > 0 && (
              <div className="flex justify-between gap-4 font-bold text-emerald-700">
                <span>
                  Coupon Discount ({appliedCoupon?.code})
                </span>

                <span>-₹{couponDiscount}</span>
              </div>
            )}

            <div className="flex justify-between gap-4">
              <span>Hyderabad Delivery</span>

              <span className="font-semibold text-stone-800">
                {deliveryFee === 0 ? (
                  <span className="font-bold text-emerald-700">
                    FREE
                  </span>
                ) : (
                  `₹${deliveryFee}`
                )}
              </span>
            </div>

            <div className="flex items-center justify-between gap-4 border-t border-[#D8CEB9] pt-3 text-base font-extrabold text-[#1E3A27]">
              <span>Grand Total to Pay</span>
              <span>₹{totalAmount}</span>
            </div>
          </section>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting || cart.length === 0}
            className="flex min-h-14 w-full items-center justify-center gap-2 rounded-xl bg-[#1E3A27] px-6 py-3.5 text-sm font-extrabold text-white shadow-xl transition hover:bg-[#162D1F] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                <span>Placing your fresh order...</span>
              </>
            ) : (
              <>
                <CheckCircle2
                  size={20}
                  className="text-amber-300"
                />
                <span>
                  Confirm & Place Order (₹{totalAmount})
                </span>
              </>
            )}
          </button>

          <p className="text-center text-[10px] leading-5 text-stone-500 sm:text-[11px]">
            🔒 By placing an order, you agree to
            ManaDeshi Dukaan&apos;s freshness guarantee &
            return policy.
          </p>
        </form>
      </div>
    </div>
  );
};