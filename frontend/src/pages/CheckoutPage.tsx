import {
  ArrowLeft,
  ArrowRight,
  Check,
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
      <div className="bg-[#FAF7F2]">
        {cart.length === 0 ? (
          <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
            <div className="overflow-hidden rounded-[2rem] border border-[#E7DEC8] bg-white">
              <div className="flex min-h-[420px] flex-col items-center justify-center px-6 py-12 text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#F7E8DC]">
                  <ShoppingBag className="h-9 w-9 text-[#B35427]" />
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
                  className="mt-7 inline-flex items-center gap-2 rounded-xl bg-[#1E3A27] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#2B5336]"
                >
                  Explore the shop
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </section>
        ) : (
          <section className="mx-auto grid max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[minmax(0,1fr)_380px] lg:px-8 lg:py-12">
            {/* Checkout information */}
            <div className="min-w-0">
              <div className="rounded-[2rem] border border-[#E7DEC8] bg-white p-5 sm:p-7 lg:p-8">
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

                    <p className="mt-2 text-sm leading-6 text-stone-500">
                      Your details are used to prepare and deliver this order.
                    </p>
                  </div>
                </div>

                {!isLoggedIn ? (
                  <div className="mt-7 rounded-2xl border border-amber-200 bg-amber-50 p-5">
                    <div className="flex gap-3">
                      <LockKeyhole
                        size={18}
                        className="mt-0.5 shrink-0 text-amber-700"
                      />

                      <div>
                        <p className="text-sm font-bold text-amber-900">
                          Sign in to continue
                        </p>

                        <p className="mt-1 text-sm leading-6 text-amber-800">
                          The sign-in window is open so you can securely
                          continue with your order.
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="mt-7 rounded-2xl bg-[#FAF7F2] p-5">
                      <div className="flex gap-3">
                        <MapPin
                          size={19}
                          className="mt-0.5 shrink-0 text-[#B35427]"
                        />

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

                    <div className="mt-5 grid gap-3 sm:grid-cols-3">
                      <div className="rounded-2xl border border-[#E7DEC8] bg-white p-4">
                        <MapPin
                          size={18}
                          className="text-[#B35427]"
                        />
                        <p className="mt-3 text-xs font-bold text-[#1E3A27]">
                          Delivery address
                        </p>
                        <p className="mt-1 text-xs leading-5 text-stone-500">
                          Add your delivery details in checkout.
                        </p>
                      </div>

                      <div className="rounded-2xl border border-[#E7DEC8] bg-white p-4">
                        <Truck
                          size={18}
                          className="text-[#1E3A27]"
                        />
                        <p className="mt-3 text-xs font-bold text-[#1E3A27]">
                          Delivery
                        </p>
                        <p className="mt-1 text-xs leading-5 text-stone-500">
                          Your order will be prepared with care.
                        </p>
                      </div>

                      <div className="rounded-2xl border border-[#E7DEC8] bg-white p-4">
                        <Check
                          size={18}
                          className="text-[#1E3A27]"
                        />
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

                <Link
                  to="/cart"
                  className="mt-7 inline-flex items-center gap-2 text-sm font-bold text-[#1E3A27] transition hover:text-[#B35427]"
                >
                  <ArrowLeft size={16} />
                  Return to cart
                </Link>
              </div>
            </div>

            {/* Order summary */}
            <aside className="h-fit lg:sticky lg:top-24">
              <div className="rounded-3xl border border-[#E7DEC8] bg-white p-5 sm:p-7">
                <div className="flex items-center gap-2">
                  <ShoppingBag
                    size={19}
                    className="text-[#B35427]"
                  />

                  <h2 className="font-display text-xl font-extrabold text-[#1E3A27]">
                    Order summary
                  </h2>
                </div>

                <div className="mt-5 max-h-64 space-y-4 overflow-y-auto pr-1">
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-start justify-between gap-4 text-sm"
                    >
                      <div className="min-w-0">
                        <p className="font-semibold text-stone-700">
                          {item.name}
                        </p>

                        <p className="mt-1 text-xs leading-5 text-stone-500">
                          {item.variant_title} × {item.quantity}
                        </p>
                      </div>

                      <span className="shrink-0 font-bold text-[#1E3A27]">
                        ₹{item.price * item.quantity}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-5 space-y-3 border-t border-[#E7DEC8] pt-5 text-sm">
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

                  <div className="border-t border-[#E7DEC8] pt-4">
                    <div className="flex items-end justify-between gap-3">
                      <div>
                        <p className="font-bold text-[#1E3A27]">Total</p>
                        <p className="mt-1 text-xs text-stone-500">
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
                  <div className="mt-5 flex items-start gap-2 rounded-xl bg-[#EEF5F0] p-3">
                    <LockKeyhole
                      size={15}
                      className="mt-0.5 shrink-0 text-[#1E3A27]"
                    />

                    <p className="text-xs leading-5 text-stone-600">
                      Complete your address and payment details in the checkout
                      form.
                    </p>
                  </div>
                )}
              </div>
            </aside>
          </section>
        )}
      </div>

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

      {isLoggedIn && cart.length > 0 && !isCheckoutOpen && !order && (
        <button
          type="button"
          onClick={() => setIsCheckoutOpen(true)}
          className="fixed bottom-4 right-4 z-40 inline-flex items-center gap-2 rounded-xl bg-[#1E3A27] px-5 py-3 text-sm font-bold text-white shadow-xl transition hover:bg-[#2B5336]"
        >
          Continue checkout
          <ArrowRight size={16} />
        </button>
      )}

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