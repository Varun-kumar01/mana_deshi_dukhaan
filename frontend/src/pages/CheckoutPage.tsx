import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronRight,
  LockKeyhole,
  MapPin,
  ShoppingBag,
  Truck,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PageLayout } from '../components/PageLayout';
import { CheckoutModal } from '../components/CheckoutModal';
import { OrderTrackingModal } from '../components/OrderTrackingModal';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import type { Order } from '../types';

export function CheckoutPage() {
  const { isLoggedIn, setIsAuthModalOpen } = useAuth();
  const { cart, subtotal, deliveryFee, totalAmount } = useCart();
  const navigate = useNavigate();

  const [isCheckoutOpen, setIsCheckoutOpen] = useState(true);
  const [order, setOrder] = useState<Order | null>(null);
  const [whatsappUrl, setWhatsappUrl] = useState<string | undefined>();

  useEffect(() => {
    if (!isLoggedIn && cart.length > 0) {
      setIsAuthModalOpen(true);
    }
  }, [isLoggedIn, cart.length, setIsAuthModalOpen]);

  return (
    <PageLayout title="Checkout" eyebrow="Complete your order">
      <div className="min-h-screen bg-[#FAF7F2]">
        {/* =========================================================
            EMPTY CART
        ========================================================= */}
        {cart.length === 0 ? (
          <>
            <section className="border-b border-[#E7DEC8] bg-[#F4EBDD]">
              <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-[#B35427]">
                  <Link
                    to="/"
                    className="transition hover:text-[#1E3A27]"
                  >
                    Home
                  </Link>
                  <ChevronRight size={13} />
                  <span>Checkout</span>
                </div>

                <h1 className="mt-4 font-display text-3xl font-extrabold tracking-[-0.02em] text-[#1E3A27] sm:text-4xl">
                  Complete your order
                </h1>
              </div>
            </section>

            <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
              <div className="overflow-hidden rounded-[2rem] border border-[#E7DEC8] bg-white shadow-[0_18px_50px_rgba(48,55,39,0.05)]">
                <div className="flex min-h-[420px] flex-col items-center justify-center px-6 py-12 text-center">
                  <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-[#F7E8DC]">
                    <div className="absolute inset-2 rounded-full border border-[#E6CDBB]" />
                    <ShoppingBag className="relative h-9 w-9 text-[#B35427]" />
                  </div>

                  <p className="mt-7 text-xs font-bold uppercase tracking-[0.18em] text-[#B35427]">
                    Nothing to checkout
                  </p>

                  <h2 className="mt-2 font-display text-2xl font-extrabold text-[#1E3A27] sm:text-3xl">
                    Your cart is empty
                  </h2>

                  <p className="mt-3 max-w-md text-sm leading-7 text-stone-600">
                    Add some homemade favourites to your cart before continuing
                    to checkout.
                  </p>

                  <Link
                    to="/shop"
                    className="mt-7 inline-flex min-h-12 items-center gap-2 rounded-full bg-[#1E3A27] px-7 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#2B5336]"
                  >
                    Explore the shop
                    <ArrowRight size={16} />
                  </Link>
                </div>

                <div className="grid border-t border-[#E7DEC8] bg-[#FAF7F2] sm:grid-cols-3">
                  <div className="flex items-center gap-3 border-b border-[#E7DEC8] px-5 py-5 sm:border-b-0 sm:border-r">
                    <Check size={18} className="text-[#1E3A27]" />
                    <span className="text-xs font-semibold text-stone-600">
                      Homemade with care
                    </span>
                  </div>

                  <div className="flex items-center gap-3 border-b border-[#E7DEC8] px-5 py-5 sm:border-b-0 sm:border-r">
                    <Truck size={18} className="text-[#B35427]" />
                    <span className="text-xs font-semibold text-stone-600">
                      Delivery across Hyderabad
                    </span>
                  </div>

                  <div className="flex items-center gap-3 px-5 py-5">
                    <LockKeyhole size={18} className="text-[#1E3A27]" />
                    <span className="text-xs font-semibold text-stone-600">
                      Secure checkout
                    </span>
                  </div>
                </div>
              </div>
            </section>
          </>
        ) : (
          <>
            {/* =====================================================
                CHECKOUT HERO
            ===================================================== */}
            <section className="border-b border-[#E7DEC8] bg-[#F4EBDD]">
              <div className="mx-auto max-w-7xl px-4 py-9 sm:px-6 sm:py-12 lg:px-8">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-[#B35427]">
                  <Link
                    to="/"
                    className="transition hover:text-[#1E3A27]"
                  >
                    Home
                  </Link>
                  <ChevronRight size={13} />
                  <Link
                    to="/cart"
                    className="transition hover:text-[#1E3A27]"
                  >
                    Cart
                  </Link>
                  <ChevronRight size={13} />
                  <span>Checkout</span>
                </div>

                <div className="mt-5 max-w-2xl">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#B35427]">
                    Almost there
                  </p>

                  <h1 className="mt-2 font-display text-3xl font-extrabold tracking-[-0.03em] text-[#1E3A27] sm:text-4xl lg:text-5xl">
                    Complete your order
                  </h1>

                  <p className="mt-3 text-sm leading-7 text-stone-600 sm:text-base">
                    Add your delivery and payment details and we will take care
                    of the rest.
                  </p>
                </div>

                {/* Progress */}
                <div className="mt-8 flex max-w-xl items-center">
                  <div className="flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1E3A27] text-white">
                      <Check size={15} />
                    </span>
                    <span className="hidden text-xs font-bold text-[#1E3A27] sm:block">
                      Cart
                    </span>
                  </div>

                  <div className="mx-3 h-px flex-1 bg-[#BFCAB9]" />

                  <div className="flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1E3A27] text-xs font-bold text-white">
                      2
                    </span>
                    <span className="hidden text-xs font-bold text-[#1E3A27] sm:block">
                      Checkout
                    </span>
                  </div>

                  <div className="mx-3 h-px flex-1 bg-[#D8CEB9]" />

                  <div className="flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full border border-[#D8CEB9] bg-white text-xs font-bold text-stone-400">
                      3
                    </span>
                    <span className="hidden text-xs font-bold text-stone-400 sm:block">
                      Complete
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* =====================================================
                MAIN CHECKOUT
            ===================================================== */}
            <section className="mx-auto grid max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[minmax(0,1fr)_390px] lg:px-8 lg:py-12">
              {/* ===================================================
                  CHECKOUT INFORMATION
              =================================================== */}
              <div className="min-w-0">
                <div className="rounded-[1.75rem] border border-[#E7DEC8] bg-white p-5 shadow-[0_15px_40px_rgba(48,55,39,0.04)] sm:p-7 lg:p-8">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#EEF5F0] text-[#1E3A27]">
                      <LockKeyhole size={22} />
                    </div>

                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#B35427]">
                        Secure checkout
                      </p>

                      <h2 className="mt-1 font-display text-2xl font-extrabold text-[#1E3A27] sm:text-3xl">
                        Delivery & payment
                      </h2>

                      <p className="mt-2 max-w-xl text-sm leading-6 text-stone-500">
                        Your details are used only to prepare and deliver your
                        order.
                      </p>
                    </div>
                  </div>

                  {!isLoggedIn ? (
                    <div className="mt-7 overflow-hidden rounded-2xl border border-amber-200 bg-amber-50">
                      <div className="flex gap-4 p-5">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white">
                          <LockKeyhole
                            size={18}
                            className="text-amber-700"
                          />
                        </div>

                        <div>
                          <p className="text-sm font-bold text-amber-900">
                            Sign in to continue
                          </p>

                          <p className="mt-1 text-sm leading-6 text-amber-800">
                            The sign-in window is open so you can securely
                            continue with your order.
                          </p>

                          <button
                            type="button"
                            onClick={() => setIsAuthModalOpen(true)}
                            className="mt-3 text-xs font-bold text-amber-900 underline underline-offset-4"
                          >
                            Open sign in
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <>
                      {/* Delivery details notice */}
                      <div className="mt-7 rounded-2xl bg-[#FAF7F2] p-5">
                        <div className="flex gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white">
                            <MapPin
                              size={18}
                              className="text-[#B35427]"
                            />
                          </div>

                          <div>
                            <p className="text-sm font-bold text-[#1E3A27]">
                              Complete your delivery details
                            </p>

                            <p className="mt-1 text-sm leading-6 text-stone-600">
                              Complete your delivery address and payment
                              preference in the secure checkout form.
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Information cards */}
                      <div className="mt-5 grid gap-3 sm:grid-cols-3">
                        <div className="rounded-2xl border border-[#E7DEC8] bg-white p-4 transition hover:border-[#D3C6B1]">
                          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F7E8DC]">
                            <MapPin
                              size={17}
                              className="text-[#B35427]"
                            />
                          </div>

                          <p className="mt-3 text-xs font-bold text-[#1E3A27]">
                            Delivery address
                          </p>

                          <p className="mt-1 text-xs leading-5 text-stone-500">
                            Add your delivery details in checkout.
                          </p>
                        </div>

                        <div className="rounded-2xl border border-[#E7DEC8] bg-white p-4 transition hover:border-[#D3C6B1]">
                          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#EEF5F0]">
                            <Truck
                              size={17}
                              className="text-[#1E3A27]"
                            />
                          </div>

                          <p className="mt-3 text-xs font-bold text-[#1E3A27]">
                            Delivery
                          </p>

                          <p className="mt-1 text-xs leading-5 text-stone-500">
                            Your order will be prepared with care.
                          </p>
                        </div>

                        <div className="rounded-2xl border border-[#E7DEC8] bg-white p-4 transition hover:border-[#D3C6B1]">
                          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#EEF5F0]">
                            <Check
                              size={17}
                              className="text-[#1E3A27]"
                            />
                          </div>

                          <p className="mt-3 text-xs font-bold text-[#1E3A27]">
                            Secure order
                          </p>

                          <p className="mt-1 text-xs leading-5 text-stone-500">
                            Review your details before placing the order.
                          </p>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Return */}
                  <Link
                    to="/cart"
                    className="mt-7 inline-flex items-center gap-2 text-sm font-bold text-[#1E3A27] transition hover:text-[#B35427]"
                  >
                    <ArrowLeft size={16} />
                    Return to cart
                  </Link>
                </div>

                {/* Security reassurance */}
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className="flex items-center gap-3 rounded-2xl border border-[#E7DEC8] bg-white p-4">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#EEF5F0]">
                      <LockKeyhole size={16} className="text-[#1E3A27]" />
                    </div>

                    <div>
                      <p className="text-xs font-bold text-[#1E3A27]">
                        Secure checkout
                      </p>
                      <p className="mt-1 text-[11px] text-stone-500">
                        Your order details stay protected.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 rounded-2xl border border-[#E7DEC8] bg-white p-4">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#F7E8DC]">
                      <Truck size={16} className="text-[#B35427]" />
                    </div>

                    <div>
                      <p className="text-xs font-bold text-[#1E3A27]">
                        Carefully prepared
                      </p>
                      <p className="mt-1 text-[11px] text-stone-500">
                        We pack every order with care.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* ===================================================
                  ORDER SUMMARY
              =================================================== */}
              <aside className="h-fit lg:sticky lg:top-24">
                <div className="rounded-[1.75rem] border border-[#E7DEC8] bg-white p-5 shadow-[0_18px_45px_rgba(48,55,39,0.05)] sm:p-7">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F7E8DC]">
                      <ShoppingBag
                        size={18}
                        className="text-[#B35427]"
                      />
                    </div>

                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-stone-400">
                        Your order
                      </p>

                      <h2 className="font-display text-xl font-extrabold text-[#1E3A27]">
                        Order summary
                      </h2>
                    </div>
                  </div>

                  {/* Items */}
                  <div className="mt-6 max-h-72 space-y-4 overflow-y-auto pr-1">
                    {cart.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-start gap-3"
                      >
                        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-[#F4EFE6]">
                          <img
                            src={item.image || '/visiting_card.png'}
                            alt={item.name}
                            className="h-full w-full object-cover"
                          />

                          <span className="absolute right-1 top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#1E3A27] px-1 text-[9px] font-bold text-white">
                            {item.quantity}
                          </span>
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="line-clamp-2 text-sm font-semibold leading-5 text-stone-700">
                            {item.name}
                          </p>

                          {item.variant_title && (
                            <p className="mt-1 text-[11px] text-stone-500">
                              {item.variant_title}
                            </p>
                          )}
                        </div>

                        <span className="shrink-0 text-sm font-bold text-[#1E3A27]">
                          ₹{item.price * item.quantity}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Totals */}
                  <div className="mt-6 space-y-3 border-t border-[#E7DEC8] pt-5 text-sm">
                    <div className="flex justify-between gap-3 text-stone-600">
                      <span>Subtotal</span>
                      <span className="font-semibold text-stone-800">
                        ₹{subtotal}
                      </span>
                    </div>

                    <div className="flex justify-between gap-3 text-stone-600">
                      <span>Delivery</span>

                      <span
                        className={
                          deliveryFee
                            ? 'font-semibold text-stone-800'
                            : 'font-bold text-green-700'
                        }
                      >
                        {deliveryFee ? `₹${deliveryFee}` : 'FREE'}
                      </span>
                    </div>

                    <div className="border-t border-[#E7DEC8] pt-5">
                      <div className="flex items-end justify-between gap-3">
                        <div>
                          <p className="font-bold text-[#1E3A27]">
                            Total
                          </p>

                          <p className="mt-1 text-[11px] leading-5 text-stone-500">
                            Final order amount
                          </p>
                        </div>

                        <span className="text-2xl font-extrabold text-[#1E3A27]">
                          ₹{totalAmount}
                        </span>
                      </div>
                    </div>
                  </div>

                  {isLoggedIn && (
                    <div className="mt-5 flex items-start gap-3 rounded-xl bg-[#EEF5F0] p-3.5">
                      <LockKeyhole
                        size={15}
                        className="mt-0.5 shrink-0 text-[#1E3A27]"
                      />

                      <p className="text-xs leading-5 text-stone-600">
                        Complete your address and payment details in the
                        checkout form.
                      </p>
                    </div>
                  )}
                </div>

                {/* Delivery reassurance */}
                <div className="mt-4 rounded-2xl border border-[#E7DEC8] bg-[#F1E9DD] p-5">
                  <div className="flex gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white">
                      <Truck
                        size={17}
                        className="text-[#B35427]"
                      />
                    </div>

                    <div>
                      <p className="text-sm font-bold text-[#1E3A27]">
                        Made with care
                      </p>

                      <p className="mt-1 text-xs leading-5 text-stone-600">
                        Your order is prepared and packed with the same care
                        that goes into every ManaDeshi favourite.
                      </p>
                    </div>
                  </div>
                </div>
              </aside>
            </section>
          </>
        )}
      </div>

      {/* ===========================================================
          CHECKOUT MODAL
      =========================================================== */}
      {isLoggedIn && cart.length > 0 && (
        <CheckoutModal
          isOpen={isCheckoutOpen}
          onClose={() => setIsCheckoutOpen(false)}
          onOrderSuccess={(newOrder, url) => {
            setOrder(newOrder);
            setWhatsappUrl(url);
          }}
        />
      )}

      {/* Reopen checkout */}
      {isLoggedIn && cart.length > 0 && !isCheckoutOpen && !order && (
        <button
          type="button"
          onClick={() => setIsCheckoutOpen(true)}
          className="fixed bottom-4 right-4 z-40 inline-flex min-h-12 items-center gap-2 rounded-full bg-[#1E3A27] px-6 text-sm font-bold text-white shadow-[0_12px_35px_rgba(30,58,39,0.25)] transition hover:-translate-y-0.5 hover:bg-[#2B5336]"
        >
          Continue checkout
          <ArrowRight size={16} />
        </button>
      )}

      {/* ===========================================================
          ORDER TRACKING
      =========================================================== */}
      <OrderTrackingModal
        order={order}
        whatsappUrl={whatsappUrl}
        onClose={() => {
          setOrder(null);
          navigate('/');
        }}
      />
    </PageLayout>
  );
}

export default CheckoutPage;