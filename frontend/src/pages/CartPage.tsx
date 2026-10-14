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

  const FREE_DELIVERY_THRESHOLD = 999;
  const deliveryProgress = Math.min(
    100,
    (subtotal / FREE_DELIVERY_THRESHOLD) * 100
  );
  const remainingForFreeDelivery = Math.max(
    0,
    FREE_DELIVERY_THRESHOLD - subtotal
  );

  return (
    <PageLayout title="Your cart" eyebrow="Shopping bag">
      <div className="min-h-screen bg-[#FAF7F2]">
        {/* =========================================================
            EMPTY CART
        ========================================================= */}
        {cart.length === 0 ? (
          <>
            <section className="relative overflow-hidden border-b border-[#E7DEC8] bg-[#F4EBDD]">
              <div className="absolute -right-24 -top-28 h-72 w-72 rounded-full bg-[#DCE8D8]/70 blur-3xl" />
              <div className="absolute -bottom-24 -left-20 h-64 w-64 rounded-full bg-[#F1D8C7]/70 blur-3xl" />

              <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
                <div className="max-w-2xl">
                  <div className="mb-5 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-[#B35427]">
                    <Link
                      to="/"
                      className="transition hover:text-[#1E3A27]"
                    >
                      Home
                    </Link>
                    <ChevronRight size={13} />
                    <span>Cart</span>
                  </div>

                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#B35427]">
                    Your bag is ready
                  </p>

                  <h1 className="mt-3 font-display text-4xl font-extrabold leading-[1.05] tracking-[-0.03em] text-[#1E3A27] sm:text-5xl lg:text-6xl">
                    A little more
                    <span className="block italic text-[#688052]">
                      goodness awaits.
                    </span>
                  </h1>

                  <p className="mt-5 max-w-xl text-sm leading-7 text-stone-600 sm:text-base">
                    Your shopping bag is empty, but there is plenty of
                    homemade goodness waiting to be discovered.
                  </p>
                </div>
              </div>
            </section>

            <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
              <div className="overflow-hidden rounded-[2rem] border border-[#E7DEC8] bg-white shadow-[0_18px_50px_rgba(48,55,39,0.06)]">
                <div className="flex min-h-[420px] flex-col items-center justify-center px-6 py-12 text-center">
                  <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-[#F7E8DC]">
                    <div className="absolute inset-2 rounded-full border border-[#E6CDBB]" />
                    <ShoppingBag className="relative h-9 w-9 text-[#B35427]" />
                  </div>

                  <p className="mt-7 text-xs font-bold uppercase tracking-[0.18em] text-[#B35427]">
                    Your cart is waiting
                  </p>

                  <h2 className="mt-2 font-display text-2xl font-extrabold text-[#1E3A27] sm:text-3xl">
                    Nothing here just yet.
                  </h2>

                  <p className="mt-3 max-w-md text-sm leading-7 text-stone-600">
                    Explore our traditional pickles, podis, ghee, snacks,
                    sweets and everyday favourites.
                  </p>

                  <Link
                    to="/shop"
                    className="mt-7 inline-flex min-h-12 items-center gap-2 rounded-full bg-[#1E3A27] px-7 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#2B5336]"
                  >
                    Explore the collection
                    <ArrowRight size={16} />
                  </Link>
                </div>

                <div className="grid border-t border-[#E7DEC8] bg-[#FAF7F2] sm:grid-cols-3">
                  {[
                    {
                      icon: Check,
                      title: 'Homemade with care',
                    },
                    {
                      icon: Truck,
                      title: 'Delivery across Hyderabad',
                    },
                    {
                      icon: ShoppingBag,
                      title: 'Traditional favourites',
                    },
                  ].map((item, index) => {
                    const Icon = item.icon;

                    return (
                      <div
                        key={item.title}
                        className={`flex items-center gap-3 px-5 py-5 ${
                          index < 2
                            ? 'border-b border-[#E7DEC8] sm:border-b-0 sm:border-r'
                            : ''
                        }`}
                      >
                        <Icon
                          size={18}
                          className={
                            index === 1
                              ? 'text-[#B35427]'
                              : 'text-[#1E3A27]'
                          }
                        />
                        <span className="text-xs font-semibold text-stone-600">
                          {item.title}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>
          </>
        ) : (
          <>
            {/* =====================================================
                CART HERO
            ===================================================== */}
            <section className="border-b border-[#E7DEC8] bg-[#F4EBDD]">
              <div className="mx-auto max-w-7xl px-4 py-9 sm:px-6 sm:py-12 lg:px-8">
                <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
                  <div>
                    <div className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-[#B35427]">
                      <Link
                        to="/"
                        className="transition hover:text-[#1E3A27]"
                      >
                        Home
                      </Link>
                      <ChevronRight size={13} />
                      <span>Cart</span>
                    </div>

                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#B35427]">
                      Your selected favourites
                    </p>

                    <h1 className="mt-2 font-display text-3xl font-extrabold tracking-[-0.02em] text-[#1E3A27] sm:text-4xl lg:text-5xl">
                      Your shopping bag
                    </h1>

                    <p className="mt-3 max-w-xl text-sm leading-6 text-stone-600">
                      Everything you selected, gathered in one place and ready
                      to come home.
                    </p>
                  </div>

                  <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[#D8CEB9] bg-white px-4 py-2 text-xs font-bold text-[#1E3A27]">
                    <ShoppingBag size={15} />
                    {cart.length} {cart.length === 1 ? 'item' : 'items'}
                  </div>
                </div>
              </div>
            </section>

            {/* =====================================================
                MAIN CART
            ===================================================== */}
            <section className="mx-auto grid max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[minmax(0,1fr)_390px] lg:px-8 lg:py-12">
              {/* LEFT */}
              <div className="min-w-0">
                <div className="mb-5 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-stone-500">
                      Shopping bag
                    </p>
                    <h2 className="mt-1 font-display text-xl font-extrabold text-[#1E3A27] sm:text-2xl">
                      Your selected favourites
                    </h2>
                  </div>

                  <span className="hidden text-xs font-medium text-stone-500 sm:block">
                    {cart.length} selected
                  </span>
                </div>

                <div className="space-y-4">
                  {cart.map((item) => (
                    <article
                      key={item.id}
                      className="group overflow-hidden rounded-[1.5rem] border border-[#E7DEC8] bg-white transition hover:border-[#D3C6B1] hover:shadow-[0_15px_35px_rgba(48,55,39,0.06)]"
                    >
                      <div className="flex min-w-0 gap-3 p-3 sm:gap-5 sm:p-5">
                        <Link
                          to={`/product/${item.product_id}`}
                          className="relative shrink-0 overflow-hidden rounded-xl"
                        >
                          <img
                            src={item.image || '/visiting_card.png'}
                            alt={item.name}
                            className="h-28 w-28 bg-[#F4EFE6] object-cover transition duration-500 group-hover:scale-[1.03] sm:h-36 sm:w-36"
                          />
                        </Link>

                        <div className="flex min-w-0 flex-1 flex-col">
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <Link
                                to={`/product/${item.product_id}`}
                                className="line-clamp-2 font-display text-base font-bold leading-6 text-[#1E3A27] transition hover:text-[#B35427] sm:text-lg"
                              >
                                {item.name}
                              </Link>

                              {item.variant_title && (
                                <p className="mt-1.5 text-xs font-medium text-stone-500">
                                  {item.variant_title}
                                </p>
                              )}
                            </div>

                            <button
                              type="button"
                              onClick={() => removeFromCart(item.id)}
                              aria-label={`Remove ${item.name}`}
                              className="shrink-0 rounded-full p-2 text-stone-400 transition hover:bg-red-50 hover:text-red-600"
                            >
                              <Trash2 size={17} />
                            </button>
                          </div>

                          <div className="mt-auto flex flex-wrap items-end justify-between gap-4 pt-5">
                            <div>
                              <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.14em] text-stone-400">
                                Quantity
                              </p>

                              <div className="inline-flex items-center overflow-hidden rounded-full border border-[#D8CEB9] bg-[#FAF7F2]">
                                <button
                                  type="button"
                                  onClick={() =>
                                    updateQuantity(item.id, -1)
                                  }
                                  aria-label={`Decrease quantity of ${item.name}`}
                                  className="flex h-9 w-9 items-center justify-center text-[#1E3A27] transition hover:bg-white"
                                >
                                  <Minus size={14} />
                                </button>

                                <span className="min-w-9 text-center text-sm font-bold text-[#1E3A27]">
                                  {item.quantity}
                                </span>

                                <button
                                  type="button"
                                  onClick={() =>
                                    updateQuantity(item.id, 1)
                                  }
                                  aria-label={`Increase quantity of ${item.name}`}
                                  className="flex h-9 w-9 items-center justify-center text-[#1E3A27] transition hover:bg-white"
                                >
                                  <Plus size={14} />
                                </button>
                              </div>
                            </div>

                            <div className="text-right">
                              <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.14em] text-stone-400">
                                Item total
                              </p>

                              <strong className="text-lg font-extrabold text-[#1E3A27] sm:text-xl">
                                ₹{item.price * item.quantity}
                              </strong>
                            </div>
                          </div>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>

                {/* Continue shopping */}
                <Link
                  to="/shop"
                  className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-[#1E3A27] transition hover:text-[#B35427]"
                >
                  <ArrowRight className="rotate-180" size={16} />
                  Continue shopping
                </Link>

                {/* Free delivery progress */}
                <div className="mt-7 rounded-2xl border border-[#DCE6D8] bg-[#EEF5F0] p-4 sm:p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white">
                        <Truck size={17} className="text-[#1E3A27]" />
                      </div>

                      <div>
                        <p className="text-sm font-bold text-[#1E3A27]">
                          {remainingForFreeDelivery > 0
                            ? `Add ₹${remainingForFreeDelivery} more for free delivery`
                            : 'You unlocked free delivery!'}
                        </p>

                        <p className="mt-1 text-xs leading-5 text-stone-600">
                          {remainingForFreeDelivery > 0
                            ? `You're ₹${remainingForFreeDelivery} away from the free delivery threshold.`
                            : 'Your order qualifies for free delivery.'}
                        </p>
                      </div>
                    </div>

                    <span className="hidden text-xs font-bold text-[#1E3A27] sm:block">
                      ₹{Math.min(subtotal, FREE_DELIVERY_THRESHOLD)} / ₹
                      {FREE_DELIVERY_THRESHOLD}
                    </span>
                  </div>

                  <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-[#D6E2D2]">
                    <div
                      className="h-full rounded-full bg-[#1E3A27] transition-all duration-500"
                      style={{ width: `${deliveryProgress}%` }}
                    />
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
                      <ShoppingBag size={18} className="text-[#B35427]" />
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

                  {/* Coupon */}
                  <div className="mt-6 rounded-xl border border-[#E7DEC8] bg-[#FAF7F2] p-3.5">
                    <div className="flex items-center gap-2">
                      <Tag size={15} className="text-[#B35427]" />

                      <span className="text-xs font-bold text-[#1E3A27]">
                        Have a coupon?
                      </span>
                    </div>

                    {couponDiscount > 0 && appliedCoupon?.code ? (
                      <div className="mt-3 flex items-center justify-between rounded-lg bg-[#EEF5F0] px-3 py-2.5">
                        <span className="text-xs font-bold text-[#1E3A27]">
                          {appliedCoupon.code}
                        </span>

                        <span className="text-xs font-bold text-green-700">
                          −₹{couponDiscount}
                        </span>
                      </div>
                    ) : (
                      <p className="mt-2 text-[11px] leading-5 text-stone-500">
                        Coupon application is available during checkout.
                      </p>
                    )}
                  </div>

                  {/* Totals */}
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

                    <div className="border-t border-[#E7DEC8] pt-5">
                      <div className="flex items-end justify-between gap-3">
                        <div>
                          <p className="font-bold text-[#1E3A27]">Total</p>
                          <p className="mt-1 text-[11px] leading-5 text-stone-500">
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
                    className="mt-7 flex min-h-13 w-full items-center justify-center gap-2 rounded-full bg-[#1E3A27] px-5 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[#2B5336]"
                  >
                    Proceed to checkout
                    <ArrowRight size={16} />
                  </Link>

                  <div className="mt-5 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-[11px] text-stone-500">
                    <Check size={13} className="text-[#1E3A27]" />
                    Secure checkout
                    <span>·</span>
                    <span>Homemade with care</span>
                  </div>
                </div>

                {/* Delivery card */}
                <div className="mt-4 rounded-2xl border border-[#E7DEC8] bg-[#F1E9DD] p-5">
                  <div className="flex gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white">
                      <Truck size={17} className="text-[#B35427]" />
                    </div>

                    <div>
                      <p className="text-sm font-bold text-[#1E3A27]">
                        Delivery information
                      </p>

                      <p className="mt-1 text-xs leading-5 text-stone-600">
                        We prepare your favourites with care and arrange
                        delivery for your order.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Trust */}
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="rounded-2xl border border-[#E7DEC8] bg-white p-4">
                    <Check size={16} className="text-[#1E3A27]" />
                    <p className="mt-2 text-xs font-bold text-[#1E3A27]">
                      Freshly packed
                    </p>
                  </div>

                  <div className="rounded-2xl border border-[#E7DEC8] bg-white p-4">
                    <ShoppingBag size={16} className="text-[#B35427]" />
                    <p className="mt-2 text-xs font-bold text-[#1E3A27]">
                      Carefully packed
                    </p>
                  </div>
                </div>
              </aside>
            </section>
          </>
        )}
      </div>
    </PageLayout>
  );
}

export default CartPage;