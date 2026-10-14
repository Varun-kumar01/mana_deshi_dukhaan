import React, { useEffect, useState } from 'react';
import {
  AlertCircle,
  Building,
  Check,
  CheckCircle2,
  ChevronDown,
  CreditCard,
  LockKeyhole,
  MapPin,
  ShieldCheck,
  ShoppingBag,
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
  'w-full rounded-xl border border-[#D8CEB9] bg-[#FAF7F2] px-3.5 py-3 text-sm text-stone-800 outline-none transition placeholder:text-stone-400 focus:border-[#1E3A27] focus:bg-white focus:ring-2 focus:ring-[#1E3A27]/10';

const labelClassName =
  'mb-1.5 block text-[11px] font-bold uppercase tracking-[0.04em] text-stone-600';

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
      description: 'Quick digital payment',
    },
    {
      value: 'Razorpay',
      title: 'Card / Netbanking',
      description: 'Secure Razorpay payment',
    },
    {
      value: 'COD',
      title: 'Cash on Delivery',
      description: 'Pay when your order arrives',
    },
  ];

  return (
    <div
      className="fixed inset-0 z-[500] flex items-end justify-center bg-black/65 backdrop-blur-sm sm:items-center sm:p-4 lg:p-6"
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="relative flex max-h-[100dvh] w-full flex-col overflow-hidden rounded-t-[1.75rem] border border-[#E7DEC8] bg-[#FAF7F2] shadow-2xl sm:max-h-[94dvh] sm:max-w-4xl sm:rounded-[2rem]">
        {/* =======================================================
            HEADER
        ======================================================= */}
        <div className="relative shrink-0 border-b border-[#E7DEC8] bg-white">
          <div className="flex items-center justify-between px-4 py-3.5 sm:px-6 sm:py-4">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#1E3A27] text-white">
                <Truck size={18} />
              </div>

              <div className="min-w-0">
                <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#B35427] sm:text-[10px]">
                  ManaDeshi Dukaan
                </p>

                <h3 className="truncate font-display text-base font-extrabold text-[#1E3A27] sm:text-lg">
                  Complete your order
                </h3>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close checkout"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-stone-500 transition hover:bg-[#F4EFE6] hover:text-stone-900"
            >
              <X size={20} />
            </button>
          </div>

          {/* Progress */}
          <div className="flex items-center gap-2 px-4 pb-4 sm:px-6">
            <div className="flex items-center gap-1.5">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#1E3A27] text-white">
                <Check size={12} />
              </span>
              <span className="hidden text-[10px] font-bold text-[#1E3A27] sm:block">
                Cart
              </span>
            </div>

            <div className="h-px flex-1 bg-[#C9D4C6]" />

            <div className="flex items-center gap-1.5">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#1E3A27] text-[10px] font-bold text-white">
                2
              </span>
              <span className="hidden text-[10px] font-bold text-[#1E3A27] sm:block">
                Details
              </span>
            </div>

            <div className="h-px flex-1 bg-[#D8CEB9]" />

            <div className="flex items-center gap-1.5">
              <span className="flex h-6 w-6 items-center justify-center rounded-full border border-[#D8CEB9] bg-white text-[10px] font-bold text-stone-400">
                3
              </span>
              <span className="hidden text-[10px] font-bold text-stone-400 sm:block">
                Complete
              </span>
            </div>
          </div>
        </div>

        {/* =======================================================
            FORM
        ======================================================= */}
        <form
          onSubmit={handleSubmit}
          className="flex-1 space-y-5 overflow-y-auto p-3.5 sm:p-6"
        >
          {/* Error */}
          {errorMessage && (
            <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-xs text-red-700">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white">
                <AlertCircle size={16} />
              </div>

              <div className="pt-1">
                <p className="font-bold">Unable to continue</p>
                <p className="mt-1 leading-5">
                  {errorMessage}
                </p>
              </div>
            </div>
          )}

          {/* =====================================================
              DELIVERY ZONE
          ===================================================== */}
          <section className="rounded-[1.5rem] border border-[#E7DEC8] bg-white p-4 sm:p-5">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#F7E8DC]">
                <MapPin size={18} className="text-[#B35427]" />
              </div>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#B35427]">
                  Delivery location
                </p>

                <h4 className="mt-1 font-display text-base font-extrabold text-[#1E3A27]">
                  Where should we deliver?
                </h4>

                <p className="mt-1 text-xs leading-5 text-stone-500">
                  Select your area to quickly fill the Hyderabad delivery
                  details.
                </p>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
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
                    className={`rounded-full border px-3 py-2 text-[10px] font-bold transition sm:text-[11px] ${
                      selected
                        ? 'border-[#1E3A27] bg-[#1E3A27] text-white shadow-sm'
                        : 'border-[#D8CEB9] bg-[#FAF7F2] text-stone-700 hover:border-[#1E3A27] hover:bg-white'
                    }`}
                  >
                    {preset.name}
                  </button>
                );
              })}
            </div>
          </section>

          {/* =====================================================
              CUSTOMER INFORMATION
          ===================================================== */}
          <section className="rounded-[1.5rem] border border-[#E7DEC8] bg-white p-4 sm:p-5">
            <div className="mb-5 flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#EEF5F0]">
                <User size={18} className="text-[#1E3A27]" />
              </div>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#B35427]">
                  Step 01
                </p>

                <h4 className="mt-1 font-display text-base font-extrabold text-[#1E3A27]">
                  Your information
                </h4>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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

            <div className="mt-4">
              <label className={labelClassName}>
                Email Address
                <span className="ml-1 font-normal normal-case tracking-normal text-stone-400">
                  (Optional)
                </span>
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

          {/* =====================================================
              ADDRESS
          ===================================================== */}
          <section className="rounded-[1.5rem] border border-[#E7DEC8] bg-white p-4 sm:p-5">
            <div className="mb-5 flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#F7E8DC]">
                <Building size={18} className="text-[#B35427]" />
              </div>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#B35427]">
                  Step 02
                </p>

                <h4 className="mt-1 font-display text-base font-extrabold text-[#1E3A27]">
                  Delivery address
                </h4>

                <p className="mt-1 text-xs leading-5 text-stone-500">
                  Tell us exactly where your order should arrive.
                </p>
              </div>
            </div>

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

            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
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

            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
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
                  className="w-full rounded-xl border border-stone-200 bg-stone-100 px-3.5 py-3 text-sm text-stone-600 outline-none"
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
                  className="w-full rounded-xl border border-stone-200 bg-stone-100 px-3.5 py-3 text-sm text-stone-600 outline-none"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className={labelClassName}>
                Special Instructions
                <span className="ml-1 font-normal normal-case tracking-normal text-stone-400">
                  (Optional)
                </span>
              </label>

              <textarea
                rows={3}
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

          {/* =====================================================
              PAYMENT
          ===================================================== */}
          <section className="rounded-[1.5rem] border border-[#E7DEC8] bg-white p-4 sm:p-5">
            <div className="mb-5 flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#EEF5F0]">
                <CreditCard size={18} className="text-[#1E3A27]" />
              </div>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#B35427]">
                  Step 03
                </p>

                <h4 className="mt-1 font-display text-base font-extrabold text-[#1E3A27]">
                  Choose payment method
                </h4>

                <p className="mt-1 text-xs leading-5 text-stone-500">
                  Select how you would like to pay for your order.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {paymentOptions.map((option) => {
                const selected =
                  paymentMethod === option.value;

                return (
                  <label
                    key={option.value}
                    className={`relative flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition ${
                      selected
                        ? 'border-[#1E3A27] bg-[#EEF5F0] shadow-sm'
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
                      className="sr-only"
                    />

                    <span
                      className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
                        selected
                          ? 'border-[#1E3A27] bg-[#1E3A27]'
                          : 'border-[#CFC4B2] bg-white'
                      }`}
                    >
                      {selected && (
                        <span className="h-1.5 w-1.5 rounded-full bg-white" />
                      )}
                    </span>

                    <div className="min-w-0">
                      <div className="text-xs font-bold text-[#1E3A27]">
                        {option.title}
                      </div>

                      <div className="mt-1 text-[10px] leading-4 text-stone-500">
                        {option.description}
                      </div>
                    </div>

                    {selected && (
                      <Check
                        size={14}
                        className="absolute right-3 top-3 text-[#1E3A27]"
                      />
                    )}
                  </label>
                );
              })}
            </div>
          </section>

          {/* =====================================================
              ORDER SUMMARY
          ===================================================== */}
          <section className="overflow-hidden rounded-[1.5rem] border border-[#D8CEB9] bg-[#F1E9DD]">
            <div className="border-b border-[#D8CEB9] px-4 py-4 sm:px-5">
              <div className="flex items-center gap-2">
                <ShoppingBag
                  size={17}
                  className="text-[#B35427]"
                />

                <h4 className="font-display text-base font-extrabold text-[#1E3A27]">
                  Your order
                </h4>
              </div>
            </div>

            <div className="space-y-3 px-4 py-4 text-xs text-stone-600 sm:px-5">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-4"
                >
                  <div className="flex min-w-0 items-center gap-2.5">
                    <div className="flex h-7 min-w-7 items-center justify-center rounded-full bg-white px-1.5 text-[9px] font-bold text-[#1E3A27]">
                      {item.quantity}
                    </div>

                    <span className="truncate font-medium text-stone-700">
                      {item.name}
                    </span>
                  </div>

                  <span className="shrink-0 font-semibold text-stone-800">
                    ₹{item.price * item.quantity}
                  </span>
                </div>
              ))}

              <div className="border-t border-[#D8CEB9] pt-3">
                <div className="flex justify-between gap-4">
                  <span>Selected Products</span>

                  <span className="font-semibold text-stone-800">
                    ₹{subtotal}
                  </span>
                </div>

                {couponDiscount > 0 && (
                  <div className="mt-2 flex justify-between gap-4 font-bold text-emerald-700">
                    <span>
                      Coupon Discount
                      {appliedCoupon?.code
                        ? ` (${appliedCoupon.code})`
                        : ''}
                    </span>

                    <span>-₹{couponDiscount}</span>
                  </div>
                )}

                <div className="mt-2 flex justify-between gap-4">
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
              </div>

              <div className="flex items-end justify-between gap-4 border-t border-[#D8CEB9] pt-4">
                <div>
                  <p className="font-bold text-[#1E3A27]">
                    Grand Total
                  </p>

                  <p className="mt-1 text-[10px] text-stone-500">
                    Final amount to pay
                  </p>
                </div>

                <span className="text-2xl font-extrabold text-[#1E3A27]">
                  ₹{totalAmount}
                </span>
              </div>
            </div>
          </section>

          {/* =====================================================
              SUBMIT
          ===================================================== */}
          <div className="rounded-[1.5rem] border border-[#D8E4D5] bg-[#EEF5F0] p-4 sm:p-5">
            <div className="flex items-start gap-3">
              <ShieldCheck
                size={19}
                className="mt-0.5 shrink-0 text-[#1E3A27]"
              />

              <div>
                <p className="text-xs font-bold text-[#1E3A27]">
                  You're almost done
                </p>

                <p className="mt-1 text-[11px] leading-5 text-stone-600">
                  Your order details will be securely submitted and our team
                  will prepare your favourites with care.
                </p>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || cart.length === 0}
              className="mt-4 flex min-h-14 w-full items-center justify-center gap-2 rounded-full bg-[#1E3A27] px-6 py-3.5 text-sm font-extrabold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-[#162D1F] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  <span>Placing your fresh order...</span>
                </>
              ) : (
                <>
                  <CheckCircle2
                    size={19}
                    className="text-[#F2C89F]"
                  />

                  <span>
                    Confirm & Place Order · ₹{totalAmount}
                  </span>
                </>
              )}
            </button>
          </div>

          <div className="flex items-center justify-center gap-2 pb-2 text-center text-[10px] leading-5 text-stone-500 sm:text-[11px]">
            <LockKeyhole size={12} />
            <span>
              Secure order · ManaDeshi Dukaan freshness guarantee
            </span>
          </div>
        </form>

        {/* Mobile bottom indicator */}
        <div className="flex shrink-0 items-center justify-center gap-2 border-t border-[#E7DEC8] bg-white px-4 py-2.5 text-[10px] text-stone-500 sm:hidden">
          <ShieldCheck size={13} className="text-[#1E3A27]" />
          Secure checkout
          <span>·</span>
          <span>Hyderabad delivery</span>
        </div>
      </div>
    </div>
  );
};