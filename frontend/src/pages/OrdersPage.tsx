import {
  ArrowLeft,
  CalendarDays,
  ChevronRight,
  Clock3,
  Loader2,
  Package,
  RefreshCw,
  ShoppingBag,
  Truck,
  XCircle,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { PageLayout } from '../components/PageLayout';
import { OrderTrackingModal } from '../components/OrderTrackingModal';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
// import { getApiBaseUrl } from '../services/api';

import type { Order } from '../types';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

type OrderItem = {
  id?: number;
  product_id?: number;
  name?: string;
  product_name?: string;
  variant_title?: string;
  quantity?: number;
  price?: number;
  image?: string;
};

type OrderWithItems = Order & {
  items?: OrderItem[];
  order_items?: OrderItem[];
  created_at?: string;
  updated_at?: string;
  status?: string;
  payment_method?: string;
  total_amount?: number;
  subtotal?: number;
  delivery_fee?: number;
  discount_amount?: number;
};

const getStatusLabel = (status?: string) => {
  const value = String(status || 'pending').toLowerCase();

  if (value === 'delivered') return 'Delivered';
  if (value === 'cancelled' || value === 'canceled') return 'Cancelled';
  if (value === 'shipped' || value === 'out_for_delivery') {
    return 'On the way';
  }
  if (value === 'confirmed' || value === 'accepted') {
    return 'Confirmed';
  }

  return 'Order placed';
};

const getStatusStyles = (status?: string) => {
  const value = String(status || 'pending').toLowerCase();

  if (value === 'delivered') {
    return 'bg-[#EEF5F0] text-[#1E6B3A] border-[#CFE2D4]';
  }

  if (value === 'cancelled' || value === 'canceled') {
    return 'bg-[#FFF1EF] text-[#A63D2F] border-[#F0CCC6]';
  }

  if (
    value === 'shipped' ||
    value === 'out_for_delivery'
  ) {
    return 'bg-[#FDF3EA] text-[#A84D25] border-[#EED4C1]';
  }

  if (
    value === 'confirmed' ||
    value === 'accepted'
  ) {
    return 'bg-[#EEF5F0] text-[#2D6843] border-[#CFE2D4]';
  }

  return 'bg-[#FFF8E8] text-[#8A651E] border-[#EADDB9]';
};

const formatDate = (value?: string) => {
  if (!value) return 'Date unavailable';

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

const formatCurrency = (value?: number) => {
  const amount = Number(value || 0);

  return `₹${amount.toLocaleString('en-IN', {
    maximumFractionDigits: 0,
  })}`;
};

const getOrderItems = (order: OrderWithItems): OrderItem[] => {
  if (Array.isArray(order.items)) {
    return order.items;
  }

  if (Array.isArray(order.order_items)) {
    return order.order_items;
  }

  return [];
};

const getImageUrl = (image?: string) => {
  if (!image) return '';

  if (
    image.startsWith('http://') ||
    image.startsWith('https://') ||
    image.startsWith('data:')
  ) {
    return image;
  }

//   const baseUrl = API_BASE_URL;

//   return `${baseUrl.replace(/\/$/, '')}/${image.replace(/^\//, '')}`;

return `${API_BASE_URL.replace(/\/$/, '')}/${image.replace(/^\//, '')}`;
};

export function OrdersPage() {
  const navigate = useNavigate();

  const { isLoggedIn, user, setIsAuthModalOpen } = useAuth();
  const { setIsCartOpen } = useCart();

  const [orders, setOrders] = useState<OrderWithItems[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [selectedOrder, setSelectedOrder] =
    useState<OrderWithItems | null>(null);

  const [trackingOrder, setTrackingOrder] =
    useState<OrderWithItems | null>(null);

  const [cancellingId, setCancellingId] =
    useState<number | null>(null);

  const loadOrders = async (showRefresh = false) => {
    if (!user?.id) {
      setOrders([]);
      setLoading(false);
      return;
    }

    if (showRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    setError(null);

    try {
      const response = await fetch(
        `${API_BASE_URL}/orders/user/${user.id}`
      );

      if (!response.ok) {
        throw new Error('Unable to load your orders.');
      }

      const data = await response.json();

      const receivedOrders =
        Array.isArray(data)
          ? data
          : Array.isArray(data.orders)
            ? data.orders
            : Array.isArray(data.data)
              ? data.data
              : [];

      setOrders(receivedOrders);
    } catch (err) {
      console.error('Failed to load orders:', err);

      setError(
        err instanceof Error
          ? err.message
          : 'Unable to load your orders.'
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (!isLoggedIn) {
      setLoading(false);
      return;
    }

    loadOrders();
  }, [isLoggedIn, user?.id]);

  const activeOrders = useMemo(
    () =>
      orders.filter((order) => {
        const status = String(
          order.status || ''
        ).toLowerCase();

        return (
          status !== 'delivered' &&
          status !== 'cancelled' &&
          status !== 'canceled'
        );
      }),
    [orders]
  );

  const deliveredOrders = useMemo(
    () =>
      orders.filter((order) => {
        const status = String(
          order.status || ''
        ).toLowerCase();

        return status === 'delivered';
      }),
    [orders]
  );

  const handleCancel = async (orderId?: number) => {
    if (!orderId) return;

    const confirmed = window.confirm(
      'Are you sure you want to cancel this order?'
    );

    if (!confirmed) return;

    setCancellingId(orderId);

    try {
      const response = await fetch(
        `${API_BASE_URL}/orders/${orderId}/cancel`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Unable to cancel this order.');
      }

      await loadOrders(true);

      setSelectedOrder(null);
    } catch (err) {
      window.alert(
        err instanceof Error
          ? err.message
          : 'Unable to cancel this order.'
      );
    } finally {
      setCancellingId(null);
    }
  };

  if (!isLoggedIn) {
    return (
      <PageLayout
        title="My orders"
        eyebrow="Your ManaDeshi journey"
      >
        <section className="min-h-[70vh] bg-[#FAF7F2] px-4 py-12 sm:px-6 lg:px-8 lg:py-20">
          <div className="mx-auto max-w-4xl">
            <div className="overflow-hidden rounded-[2rem] border border-[#E7DEC8] bg-white shadow-[0_24px_80px_rgba(45,39,29,0.08)]">
              <div className="relative overflow-hidden bg-[#1E3A27] px-6 py-12 text-center text-white sm:px-12 sm:py-16">
                <div className="absolute -right-20 -top-20 h-48 w-48 rounded-full bg-[#B35427]/20 blur-2xl" />
                <div className="absolute -bottom-24 -left-16 h-56 w-56 rounded-full bg-white/5 blur-2xl" />

                <div className="relative mx-auto flex max-w-xl flex-col items-center">
                  <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/20">
                    <Package size={30} />
                  </div>

                  <p className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-[#E8D6B8]">
                    Your orders
                  </p>

                  <h1 className="font-display text-3xl font-semibold sm:text-5xl">
                    Your pantry story starts here.
                  </h1>

                  <p className="mt-5 max-w-lg text-sm leading-7 text-white/75 sm:text-base">
                    Sign in to view your ManaDeshi orders,
                    track deliveries and revisit your favourite
                    products.
                  </p>

                  <button
                    type="button"
                    onClick={() => setIsAuthModalOpen(true)}
                    className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-[#F5EBD8] px-7 py-3.5 text-sm font-bold text-[#1E3A27] transition hover:bg-white"
                  >
                    Sign in to continue
                    <ChevronRight size={17} />
                  </button>
                </div>
              </div>

              <div className="grid gap-px bg-[#E7DEC8] sm:grid-cols-3">
                {[
                  {
                    icon: Package,
                    title: 'Order history',
                    text: 'Everything in one place.',
                  },
                  {
                    icon: Truck,
                    title: 'Track delivery',
                    text: 'Know where your order is.',
                  },
                  {
                    icon: ShoppingBag,
                    title: 'Shop again',
                    text: 'Bring favourites back.',
                  },
                ].map((item) => {
                  const Icon = item.icon;

                  return (
                    <div
                      key={item.title}
                      className="bg-white px-5 py-6 text-center"
                    >
                      <Icon
                        className="mx-auto text-[#B35427]"
                        size={22}
                      />
                      <p className="mt-3 text-sm font-bold text-[#26372B]">
                        {item.title}
                      </p>
                      <p className="mt-1 text-xs text-[#7C8179]">
                        {item.text}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      </PageLayout>
    );
  }

  return (
    <>
      <PageLayout
        title="My orders"
        eyebrow="Your ManaDeshi journey"
      >
        <div className="bg-[#FAF7F2]">
          {/* Hero */}
          <section className="border-b border-[#E7DEC8] bg-[#F4EBDD]">
            <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <button
                    type="button"
                    onClick={() => navigate('/account')}
                    className="mb-5 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-[#667066] transition hover:text-[#1E3A27]"
                  >
                    <ArrowLeft size={15} />
                    Back to account
                  </button>

                  <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#B35427]">
                    ManaDeshi orders
                  </p>

                  <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight text-[#1E3A27] sm:text-5xl">
                    My orders
                  </h1>

                  <p className="mt-3 max-w-2xl text-sm leading-7 text-[#667066] sm:text-base">
                    Keep track of everything you've ordered
                    from ManaDeshi Dukkaan.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => loadOrders(true)}
                  disabled={refreshing}
                  className="inline-flex w-fit items-center gap-2 rounded-full border border-[#CFC5B2] bg-white px-5 py-3 text-sm font-bold text-[#1E3A27] shadow-sm transition hover:border-[#1E3A27] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <RefreshCw
                    size={16}
                    className={
                      refreshing ? 'animate-spin' : ''
                    }
                  />
                  Refresh orders
                </button>
              </div>

              {!loading && orders.length > 0 && (
                <div className="mt-8 grid gap-3 sm:grid-cols-3">
                  <StatCard
                    label="Total orders"
                    value={orders.length}
                    icon={ShoppingBag}
                  />

                  <StatCard
                    label="In progress"
                    value={activeOrders.length}
                    icon={Clock3}
                  />

                  <StatCard
                    label="Delivered"
                    value={deliveredOrders.length}
                    icon={Truck}
                  />
                </div>
              )}
            </div>
          </section>

          {/* Orders */}
          <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
            {loading ? (
              <div className="flex min-h-[360px] items-center justify-center">
                <div className="flex flex-col items-center">
                  <Loader2
                    size={32}
                    className="animate-spin text-[#1E3A27]"
                  />
                  <p className="mt-4 text-sm font-medium text-[#737970]">
                    Loading your orders...
                  </p>
                </div>
              </div>
            ) : error ? (
              <div className="mx-auto max-w-xl rounded-[1.75rem] border border-[#E7DEC8] bg-white p-8 text-center shadow-sm">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#FFF1EF] text-[#A63D2F]">
                  <XCircle size={25} />
                </div>

                <h2 className="mt-5 font-display text-2xl font-semibold text-[#26372B]">
                  We couldn't load your orders
                </h2>

                <p className="mt-2 text-sm leading-6 text-[#737970]">
                  {error}
                </p>

                <button
                  type="button"
                  onClick={() => loadOrders()}
                  className="mt-6 rounded-full bg-[#1E3A27] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#294D35]"
                >
                  Try again
                </button>
              </div>
            ) : orders.length === 0 ? (
              <EmptyOrders />
            ) : (
              <div className="space-y-6">
                {orders.map((order) => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    cancelling={
                      cancellingId === order.id
                    }
                    onView={() =>
                      setSelectedOrder(order)
                    }
                    onTrack={() =>
                      setTrackingOrder(order)
                    }
                    onCancel={() =>
                      handleCancel(order.id)
                    }
                  />
                ))}
              </div>
            )}
          </section>

          {/* Bottom CTA */}
          {!loading && orders.length > 0 && (
            <section className="border-t border-[#E7DEC8] bg-white">
              <div className="mx-auto max-w-7xl px-4 py-12 text-center sm:px-6 lg:px-8 lg:py-16">
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#B35427]">
                  Ready for another basket?
                </p>

                <h2 className="mt-3 font-display text-3xl font-semibold text-[#1E3A27]">
                  Discover something delicious.
                </h2>

                <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-[#737970]">
                  Explore our pantry, gifting and everyday
                  essentials.
                </p>

                <Link
                  to="/shop"
                  className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#1E3A27] px-7 py-3.5 text-sm font-bold text-white transition hover:bg-[#294D35]"
                >
                  Continue shopping
                  <ChevronRight size={17} />
                </Link>
              </div>
            </section>
          )}
        </div>
      </PageLayout>

      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onTrack={() => {
            setTrackingOrder(selectedOrder);
            setSelectedOrder(null);
          }}
          onCancel={() =>
            handleCancel(selectedOrder.id)
          }
          cancelling={
            cancellingId === selectedOrder.id
          }
        />
      )}

      {trackingOrder && (
        <OrderTrackingModal
          order={trackingOrder}
          onClose={() => setTrackingOrder(null)}
        />
      )}
    </>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: number;
  icon: typeof Package;
}) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-[#E1D6C3] bg-white p-4 shadow-sm">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#EEF5F0] text-[#1E3A27]">
        <Icon size={20} />
      </div>

      <div>
        <p className="text-2xl font-semibold text-[#1E3A27]">
          {value}
        </p>

        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#858A83]">
          {label}
        </p>
      </div>
    </div>
  );
}

function OrderCard({
  order,
  cancelling,
  onView,
  onTrack,
  onCancel,
}: {
  order: OrderWithItems;
  cancelling: boolean;
  onView: () => void;
  onTrack: () => void;
  onCancel: () => void;
}) {
  const items = getOrderItems(order);

  const status = String(
    order.status || 'pending'
  ).toLowerCase();

  const canCancel =
    status !== 'delivered' &&
    status !== 'cancelled' &&
    status !== 'canceled';

  const total = Number(
    order.total_amount ??
      (order as unknown as { total?: number }).total ??
      0
  );

  return (
    <article className="overflow-hidden rounded-[1.75rem] border border-[#E5DBC9] bg-white shadow-[0_12px_40px_rgba(45,39,29,0.05)]">
      {/* Header */}
      <div className="flex flex-col gap-4 border-b border-[#EEE6D9] px-5 py-5 sm:px-7 sm:py-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#8A9088]">
              Order
            </p>

            <p className="mt-1 text-sm font-bold text-[#26372B]">
              #{order.id}
            </p>
          </div>

          <div className="hidden h-8 w-px bg-[#E8DFD1] lg:block" />

          <div className="flex items-center gap-2 text-sm text-[#6F766E]">
            <CalendarDays size={16} />
            {formatDate(order.created_at)}
          </div>

          <span
            className={`rounded-full border px-3 py-1.5 text-xs font-bold ${getStatusStyles(
              order.status
            )}`}
          >
            {getStatusLabel(order.status)}
          </span>
        </div>

        <div className="text-left lg:text-right">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#8A9088]">
            Order total
          </p>

          <p className="mt-1 text-xl font-semibold text-[#1E3A27]">
            {formatCurrency(total)}
          </p>
        </div>
      </div>

      {/* Products */}
      <div className="px-5 py-5 sm:px-7">
        {items.length > 0 ? (
          <div className="flex gap-3 overflow-x-auto pb-1">
            {items.slice(0, 5).map((item, index) => {
              const image = getImageUrl(item.image);

              return (
                <div
                  key={`${item.product_id}-${index}`}
                  className="group shrink-0"
                >
                  <div className="h-20 w-20 overflow-hidden rounded-xl border border-[#E9E0D3] bg-[#F6F2EA] sm:h-24 sm:w-24">
                    {image ? (
                      <img
                        src={image}
                        alt={
                          item.name ||
                          item.product_name ||
                          'Product'
                        }
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-[#B9B2A5]">
                        <Package size={22} />
                      </div>
                    )}
                  </div>

                  <p className="mt-2 max-w-24 truncate text-[11px] font-semibold text-[#4B554C]">
                    {item.name ||
                      item.product_name ||
                      'Product'}
                  </p>

                  <p className="text-[10px] text-[#8B908A]">
                    Qty {item.quantity || 1}
                  </p>
                </div>
              );
            })}

            {items.length > 5 && (
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl border border-dashed border-[#D9CEBD] bg-[#FAF7F2] text-xs font-bold text-[#737970] sm:h-24 sm:w-24">
                +{items.length - 5}
              </div>
            )}
          </div>
        ) : (
          <div className="rounded-xl bg-[#FAF7F2] px-4 py-5 text-sm text-[#737970]">
            Order items are available inside the order details.
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-3 border-t border-[#EEE6D9] bg-[#FCFAF6] px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-7">
        <p className="text-xs text-[#7B817A]">
          {items.length > 0
            ? `${items.length} ${
                items.length === 1 ? 'item' : 'items'
              } in this order`
            : 'Order details available'}
        </p>

        <div className="flex flex-wrap gap-2">
          {canCancel && (
            <button
              type="button"
              onClick={onCancel}
              disabled={cancelling}
              className="rounded-full border border-[#E4C7C1] px-4 py-2.5 text-xs font-bold text-[#A63D2F] transition hover:bg-[#FFF1EF] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {cancelling ? (
                <span className="flex items-center gap-2">
                  <Loader2
                    size={13}
                    className="animate-spin"
                  />
                  Cancelling
                </span>
              ) : (
                'Cancel order'
              )}
            </button>
          )}

          {canCancel && (
            <button
              type="button"
              onClick={onTrack}
              className="rounded-full border border-[#C9D9CD] px-4 py-2.5 text-xs font-bold text-[#1E3A27] transition hover:bg-[#EEF5F0]"
            >
              Track order
            </button>
          )}

          <button
            type="button"
            onClick={onView}
            className="inline-flex items-center gap-1.5 rounded-full bg-[#1E3A27] px-5 py-2.5 text-xs font-bold text-white transition hover:bg-[#294D35]"
          >
            View details
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </article>
  );
}

function EmptyOrders() {
  const navigate = useNavigate();

  return (
    <div className="mx-auto max-w-3xl overflow-hidden rounded-[2rem] border border-[#E6DCCB] bg-white shadow-[0_20px_60px_rgba(45,39,29,0.06)]">
      <div className="bg-[#1E3A27] px-6 py-12 text-center text-white sm:px-12 sm:py-16">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white/10">
          <ShoppingBag size={28} />
        </div>

        <p className="mt-6 text-xs font-bold uppercase tracking-[0.24em] text-[#E8D6B8]">
          Nothing here yet
        </p>

        <h2 className="mt-3 font-display text-3xl font-semibold sm:text-4xl">
          Your first ManaDeshi order is waiting.
        </h2>

        <p className="mx-auto mt-4 max-w-lg text-sm leading-7 text-white/70">
          Fill your pantry with thoughtfully sourced
          favourites, everyday essentials and beautiful
          gifts.
        </p>

        <button
          type="button"
          onClick={() => navigate('/shop')}
          className="mt-8 rounded-full bg-[#F5EBD8] px-7 py-3.5 text-sm font-bold text-[#1E3A27] transition hover:bg-white"
        >
          Explore the shop
        </button>
      </div>
    </div>
  );
}

function OrderDetailsModal({
  order,
  onClose,
  onTrack,
  onCancel,
  cancelling,
}: {
  order: OrderWithItems;
  onClose: () => void;
  onTrack: () => void;
  onCancel: () => void;
  cancelling: boolean;
}) {
  const items = getOrderItems(order);

  const status = String(
    order.status || 'pending'
  ).toLowerCase();

  const canCancel =
    status !== 'delivered' &&
    status !== 'cancelled' &&
    status !== 'canceled';

  const total = Number(
    order.total_amount ??
      (order as unknown as { total?: number }).total ??
      0
  );

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center bg-[#16251B]/55 p-0 backdrop-blur-sm sm:items-center sm:p-5">
      <div className="flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-[2rem] bg-white shadow-2xl sm:rounded-[2rem]">
        <div className="flex items-start justify-between border-b border-[#EAE1D4] px-5 py-5 sm:px-7">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#B35427]">
              Order details
            </p>

            <h2 className="mt-1 font-display text-2xl font-semibold text-[#1E3A27]">
              Order #{order.id}
            </h2>

            <p className="mt-1 text-xs text-[#7A817A]">
              {formatDate(order.created_at)}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F5F1E9] text-[#4B554C] transition hover:bg-[#EDE5D7]"
            aria-label="Close"
          >
            <XCircle size={20} />
          </button>
        </div>

        <div className="overflow-y-auto px-5 py-5 sm:px-7 sm:py-6">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-[#FAF7F2] p-4">
            <span
              className={`rounded-full border px-3 py-1.5 text-xs font-bold ${getStatusStyles(
                order.status
              )}`}
            >
              {getStatusLabel(order.status)}
            </span>

            <span className="text-lg font-semibold text-[#1E3A27]">
              {formatCurrency(total)}
            </span>
          </div>

          <div className="mt-6">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#777E76]">
              Items
            </p>

            <div className="mt-3 divide-y divide-[#EEE6D9] rounded-2xl border border-[#E7DEC8]">
              {items.length > 0 ? (
                items.map((item, index) => {
                  const image = getImageUrl(item.image);

                  return (
                    <div
                      key={`${item.product_id}-${index}`}
                      className="flex items-center gap-3 p-4"
                    >
                      <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-[#F5F1E9]">
                        {image ? (
                          <img
                            src={image}
                            alt={
                              item.name ||
                              item.product_name ||
                              'Product'
                            }
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-[#B8B0A1]">
                            <Package size={19} />
                          </div>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-bold text-[#303A32]">
                          {item.name ||
                            item.product_name ||
                            'Product'}
                        </p>

                        {item.variant_title && (
                          <p className="mt-0.5 text-xs text-[#858B84]">
                            {item.variant_title}
                          </p>
                        )}

                        <p className="mt-1 text-xs text-[#858B84]">
                          Qty {item.quantity || 1}
                        </p>
                      </div>

                      <p className="text-sm font-bold text-[#1E3A27]">
                        {formatCurrency(
                          Number(item.price || 0) *
                            Number(item.quantity || 1)
                        )}
                      </p>
                    </div>
                  );
                })
              ) : (
                <p className="p-5 text-sm text-[#737970]">
                  No item details available.
                </p>
              )}
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <InfoBox
              label="Payment"
              value={
                order.payment_method ||
                'Payment information unavailable'
              }
            />

            <InfoBox
              label="Order date"
              value={formatDate(order.created_at)}
            />
          </div>
        </div>

        <div className="border-t border-[#EAE1D4] bg-[#FCFAF6] px-5 py-4 sm:px-7">
          <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
            {canCancel && (
              <button
                type="button"
                onClick={onCancel}
                disabled={cancelling}
                className="rounded-full border border-[#E4C7C1] px-5 py-3 text-sm font-bold text-[#A63D2F] disabled:opacity-50"
              >
                {cancelling
                  ? 'Cancelling...'
                  : 'Cancel order'}
              </button>
            )}

            {canCancel && (
              <button
                type="button"
                onClick={onTrack}
                className="rounded-full border border-[#C9D9CD] px-5 py-3 text-sm font-bold text-[#1E3A27]"
              >
                Track order
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="rounded-full bg-[#1E3A27] px-6 py-3 text-sm font-bold text-white"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoBox({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-[#E7DEC8] bg-[#FAF7F2] p-4">
      <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#8A9088]">
        {label}
      </p>

      <p className="mt-2 text-sm font-semibold capitalize text-[#344037]">
        {value}
      </p>
    </div>
  );
}

export default OrdersPage;