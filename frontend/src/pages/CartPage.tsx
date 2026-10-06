import {
  ArrowRight,
  Check,
  ChevronRight,
  Minus,
  Plus,
  ShoppingBag,
  Tag,
  Trash2,
  Truck,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { PageLayout } from '../components/PageLayout';
import { useCart } from '../context/CartContext';

export function CartPage() {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    subtotal,
    deliveryFee,
    couponDiscount,
    appliedCoupon,
    totalAmount,
  } = useCart();

  return (
    <PageLayout title="Your cart" eyebrow="Your order">
      <div className="bg-[#FAF7F2]">
        {cart.length === 0 ? (
          <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
            <div className="overflow-hidden rounded-[2rem] border border-[#E7DEC8] bg-white">
              <div className="flex min-h-[460px] flex-col items-center justify-center px-6 py-12 text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#F7E8DC]">
                  <ShoppingBag className="h-9 w-9 text-[#B35427]" />
                </div>

                <p className="mt-7 text-xs font-bold uppercase tracking-[0.18em] text-[#B35427]">
                  Your cart is waiting
                </p>

                <h2 className="mt-2 font-display text-2xl font-extrabold text-[#1E3A27] sm:text-3xl">
                  Nothing here just yet.
                </h2>

                <p className="mt-3 max-w-md text-sm leading-7 text-stone-600">
                  Discover small-batch pickles, podis, ghee, snacks, sweets
                  and other traditional favourites.
                </p>

                <Link
                  to="/shop"
                  className="mt-7 inline-flex items-center gap-2 rounded-xl bg-[#1E3A27] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#2B5336]"
                >
                  Continue shopping
                  <ArrowRight size={16} />
                </Link>
              </div>

              <div className="grid border-t border-[#E7DEC8] bg-[#FAF7F2] sm:grid-cols-3">
                <div className="flex items-center gap-3 border-b border-[#E7DEC8] px-5 py-4 sm:border-b-0 sm:border-r">
                  <Check size={18} className="text-[#1E3A27]" />
                  <span className="text-xs font-semibold text-stone-600">
                    Homemade with care
                  </span>
                </div>

                <div className="flex items-center gap-3 border-b border-[#E7DEC8] px-5 py-4 sm:border-b-0 sm:border-r">
                  <Truck size={18} className="text-[#B35427]" />
                  <span className="text-xs font-semibold text-stone-600">
                    Delivery across Hyderabad
                  </span>
                </div>

                <div className="flex items-center gap-3 px-5 py-4">
                  <ShoppingBag size={18} className="text-[#1E3A27]" />
                  <span className="text-xs font-semibold text-stone-600">
                    Traditional favourites
                  </span>
                </div>
              </div>
            </div>
          </section>
        ) : (
          <section className="mx-auto grid max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[minmax(0,1fr)_380px] lg:px-8 lg:py-12">
            {/* Cart items */}
            <div className="min-w-0">
              <div className="mb-5 flex items-end justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#B35427]">
                    Shopping bag
                  </p>
                  <h2 className="mt-1 font-display text-2xl font-extrabold text-[#1E3A27]">
                    Your selected favourites
                  </h2>
                </div>

                <span className="shrink-0 rounded-full bg-[#EEF5F0] px-3 py-1.5 text-xs font-bold text-[#1E3A27]">
                  {cart.length} {cart.length === 1 ? 'item' : 'items'}
                </span>
              </div>

              <div className="space-y-4">
                {cart.map((item) => (
                  <article
                    key={item.id}
                    className="group flex min-w-0 gap-3 rounded-2xl border border-[#E7DEC8] bg-white p-3 transition hover:border-[#D8CEB9] hover:shadow-sm sm:gap-5 sm:p-5"
                  >
                    <Link
                      to={`/product/${item.product_id}`}
                      className="shrink-0"
                    >
                      <img
                        src={item.image || '/visiting_card.png'}
                        alt={item.name}
                        className="h-24 w-24 rounded-xl bg-[#F4EFE6] object-cover sm:h-32 sm:w-32"
                      />
                    </Link>

                    <div className="flex min-w-0 flex-1 flex-col">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <h2 className="line-clamp-2 font-display text-base font-bold text-[#1E3A27] sm:text-lg">
                            {item.name}
                          </h2>

                          {item.variant_title && (
                            <p className="mt-1 text-xs font-medium text-stone-500">
                              {item.variant_title}
                            </p>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={() => removeFromCart(item.id)}
                          aria-label={`Remove ${item.name}`}
                          className="shrink-0 rounded-lg p-2 text-stone-400 transition hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 size={17} />
                        </button>
                      </div>

                      <div className="mt-auto flex flex-wrap items-end justify-between gap-3 pt-4">
                        <div className="inline-flex items-center overflow-hidden rounded-lg border border-[#D8CEB9]">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, -1)}
                            aria-label={`Decrease quantity of ${item.name}`}
                            className="p-2.5 text-[#1E3A27] transition hover:bg-[#F4EFE6]"
                          >
                            <Minus size={14} />
                          </button>

                          <span className="min-w-9 text-center text-sm font-bold text-[#1E3A27]">
                            {item.quantity}
                          </span>

                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, 1)}
                            aria-label={`Increase quantity of ${item.name}`}
                            className="p-2.5 text-[#1E3A27] transition hover:bg-[#F4EFE6]"
                          >
                            <Plus size={14} />
                          </button>
                        </div>

                        <strong className="text-lg font-extrabold text-[#1E3A27]">
                          ₹{item.price * item.quantity}
                        </strong>
                      </div>
                    </div>
                  </article>
                ))}

                <Link
                  to="/shop"
                  className="inline-flex items-center gap-2 py-2 text-sm font-bold text-[#1E3A27] transition hover:text-[#B35427]"
                >
                  <ArrowRight className="rotate-180" size={16} />
                  Continue shopping
                </Link>
              </div>
            </div>

            {/* Order summary */}
            <aside className="h-fit lg:sticky lg:top-24">
              <div className="rounded-3xl border border-[#E7DEC8] bg-white p-5 sm:p-7">
                <div className="flex items-center gap-2">
                  <ShoppingBag size={19} className="text-[#B35427]" />
                  <h2 className="font-display text-xl font-extrabold text-[#1E3A27]">
                    Order summary
                  </h2>
                </div>

                <div className="mt-6 space-y-4 text-sm">
                  <div className="flex justify-between gap-3 text-stone-600">
                    <span>Subtotal</span>
                    <span className="font-semibold text-stone-800">
                      ₹{subtotal}
                    </span>
                  </div>

                  {couponDiscount > 0 && (
                    <div className="flex items-start justify-between gap-3 font-semibold text-green-700">
                      <span className="flex items-center gap-1.5">
                        <Tag size={14} />
                        Discount
                        {appliedCoupon?.code && (
                          <span className="text-xs">
                            ({appliedCoupon.code})
                          </span>
                        )}
                      </span>
                      <span>−₹{couponDiscount}</span>
                    </div>
                  )}

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
                          Inclusive of applicable charges
                        </p>
                      </div>

                      <span className="text-2xl font-extrabold text-[#1E3A27]">
                        ₹{totalAmount}
                      </span>
                    </div>
                  </div>
                </div>

                <Link
                  to="/checkout"
                  className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-[#1E3A27] px-5 py-3.5 text-sm font-bold text-white transition hover:bg-[#2B5336]"
                >
                  Proceed to checkout
                  <ArrowRight size={16} />
                </Link>

                <div className="mt-5 flex items-center justify-center gap-2 text-xs text-stone-500">
                  <Check size={14} className="text-[#1E3A27]" />
                  Secure checkout
                  <span>·</span>
                  <span>Homemade with care</span>
                </div>
              </div>

              <div className="mt-4 rounded-2xl border border-[#E7DEC8] bg-[#F1E9DD] p-4">
                <div className="flex gap-3">
                  <Truck className="mt-0.5 shrink-0 text-[#B35427]" size={18} />
                  <div>
                    <p className="text-sm font-bold text-[#1E3A27]">
                      Delivery information
                    </p>
                    <p className="mt-1 text-xs leading-5 text-stone-600">
                      We prepare your favourites with care and arrange delivery
                      for your order.
                    </p>
                  </div>
                </div>
              </div>
            </aside>
          </section>
        )}
      </div>
    </PageLayout>
  );
}

export default CartPage;