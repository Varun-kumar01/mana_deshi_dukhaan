import React from 'react';
import {
  CheckCircle2,
  MapPin,
  Phone,
  Printer,
  Store,
  X,
  PackageCheck,
  Truck,
  Clock3,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';
import { Order } from '../types';

interface OrderTrackingModalProps {
  order: Order | null;
  onClose: () => void;
  whatsappUrl?: string;
}

const statuses = [
  {
    label: 'Pending',
    description: 'Order received',
    icon: Clock3,
  },
  {
    label: 'Confirmed',
    description: 'Order confirmed',
    icon: CheckCircle2,
  },
  {
    label: 'Packed',
    description: 'Being prepared',
    icon: PackageCheck,
  },
  {
    label: 'Shipped',
    description: 'On the way',
    icon: Truck,
  },
  {
    label: 'Delivered',
    description: 'Delivered to you',
    icon: CheckCircle2,
  },
];

export const OrderTrackingModal: React.FC<OrderTrackingModalProps> = ({
  order,
  onClose,
  whatsappUrl,
}) => {
  if (!order) return null;

  const statusIndex = statuses.findIndex(
    (status) => status.label === order.order_status,
  );

  const currentIndex = statusIndex >= 0 ? statusIndex : 1;

  const progressPercent =
    currentIndex === 0
      ? 0
      : (currentIndex / (statuses.length - 1)) * 100;

  const defaultWaUrl =
    whatsappUrl ||
    `https://wa.me/919951118687?text=Hi%20Swathi,%20inquiring%20about%20my%20order%20*${order.order_number}*`;

  const deliveryAddress = order.delivery_address;

  const currentStatus = statuses[currentIndex] || statuses[1];

  return (
    <div
      className="fixed inset-0 z-[500] flex items-center justify-center overflow-y-auto bg-[#132219]/75 p-2 backdrop-blur-md sm:p-5"
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="relative flex max-h-[96dvh] w-full max-w-3xl flex-col overflow-hidden rounded-[1.75rem] border border-[#E7DEC8] bg-[#FAF7F2] shadow-[0_30px_100px_rgba(0,0,0,0.28)] sm:rounded-[2.25rem]">
        {/* Header */}
        <header className="relative shrink-0 overflow-hidden bg-[#1E3A27] text-white">
          <div className="absolute -right-16 -top-20 h-52 w-52 rounded-full bg-white/5" />
          <div className="absolute -bottom-24 left-1/3 h-44 w-44 rounded-full bg-[#B35427]/20" />

          <div className="relative flex items-start justify-between gap-4 px-4 py-5 sm:px-7 sm:py-6">
            <div className="flex min-w-0 items-start gap-3.5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/10 sm:h-12 sm:w-12">
                <CheckCircle2
                  size={25}
                  strokeWidth={1.8}
                  className="text-[#F4C95D]"
                />
              </div>

              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#B9D5C0] sm:text-[11px]">
                  Order placed successfully
                </p>

                <h2 className="mt-1 truncate font-display text-xl font-extrabold tracking-tight sm:text-2xl">
                  Order #{order.order_number}
                </h2>

                <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-white/65">
                  <span className="rounded-full bg-white/10 px-2.5 py-1 font-semibold text-white">
                    {currentStatus.label}
                  </span>

                  <span>•</span>

                  <span>{currentStatus.description}</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close order tracking"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/65 transition hover:bg-white/10 hover:text-white sm:h-10 sm:w-10"
            >
              <X size={19} />
            </button>
          </div>
        </header>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto">
          <div className="space-y-4 p-3.5 sm:space-y-5 sm:p-6">
            {/* Status card */}
            <section className="overflow-hidden rounded-[1.5rem] border border-[#E7DEC8] bg-white shadow-sm">
              <div className="flex flex-col gap-3 border-b border-[#EEE7DA] px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-stone-500">
                    Order journey
                  </p>

                  <h3 className="mt-1 font-display text-base font-extrabold text-[#1E3A27] sm:text-lg">
                    Track your order
                  </h3>
                </div>

                <div className="flex w-fit items-center gap-2 rounded-full bg-[#EEF5F0] px-3 py-1.5 text-[10px] font-bold text-[#1E3A27] sm:text-xs">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#3B7A4B]" />
                  Live status
                </div>
              </div>

              {/* Desktop timeline */}
              <div className="hidden px-5 py-7 sm:block">
                <div className="relative">
                  <div className="absolute left-[10%] right-[10%] top-5 h-1 rounded-full bg-stone-200" />

                  <div
                    className="absolute left-[10%] top-5 h-1 rounded-full bg-[#1E3A27] transition-all duration-700"
                    style={{
                      width: `${progressPercent * 0.8}%`,
                    }}
                  />

                  <div className="relative z-10 flex items-start justify-between">
                    {statuses.map((status, index) => {
                      const isPassed = index <= currentIndex;
                      const isCurrent = index === currentIndex;
                      const Icon = status.icon;

                      return (
                        <div
                          key={status.label}
                          className="flex w-1/5 flex-col items-center text-center"
                        >
                          <div
                            className={`flex h-10 w-10 items-center justify-center rounded-full border-4 border-white transition-all duration-300 ${
                              isCurrent
                                ? 'scale-110 bg-[#B35427] text-white shadow-lg ring-4 ring-[#B35427]/15'
                                : isPassed
                                  ? 'bg-[#1E3A27] text-white shadow-sm'
                                  : 'bg-stone-100 text-stone-400'
                            }`}
                          >
                            <Icon size={16} strokeWidth={2.2} />
                          </div>

                          <p
                            className={`mt-3 text-xs font-extrabold ${
                              isCurrent
                                ? 'text-[#B35427]'
                                : isPassed
                                  ? 'text-[#1E3A27]'
                                  : 'text-stone-400'
                            }`}
                          >
                            {status.label}
                          </p>

                          <p className="mt-1 max-w-20 text-[10px] leading-4 text-stone-400">
                            {status.description}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Mobile timeline */}
              <div className="space-y-0 px-4 py-4 sm:hidden">
                {statuses.map((status, index) => {
                  const isPassed = index <= currentIndex;
                  const isCurrent = index === currentIndex;
                  const Icon = status.icon;
                  const isLast = index === statuses.length - 1;

                  return (
                    <div
                      key={status.label}
                      className="relative flex items-start gap-3.5"
                    >
                      {!isLast && (
                        <div
                          className={`absolute left-[15px] top-8 h-[calc(100%-8px)] w-0.5 ${
                            index < currentIndex
                              ? 'bg-[#1E3A27]'
                              : 'bg-stone-200'
                          }`}
                        />
                      )}

                      <div
                        className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                          isCurrent
                            ? 'bg-[#B35427] text-white ring-4 ring-[#B35427]/10'
                            : isPassed
                              ? 'bg-[#1E3A27] text-white'
                              : 'bg-stone-100 text-stone-400'
                        }`}
                      >
                        <Icon size={14} />
                      </div>

                      <div className="min-w-0 pb-5">
                        <p
                          className={`text-xs font-extrabold ${
                            isCurrent
                              ? 'text-[#B35427]'
                              : isPassed
                                ? 'text-[#1E3A27]'
                                : 'text-stone-400'
                          }`}
                        >
                          {status.label}
                        </p>

                        <p className="mt-0.5 text-[10px] text-stone-400">
                          {status.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Delivery + Store */}
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <section className="rounded-[1.5rem] border border-[#E7DEC8] bg-white p-4 shadow-sm sm:p-5">
                <div className="flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F4EBDD]">
                    <MapPin
                      size={17}
                      className="text-[#B35427]"
                    />
                  </div>

                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-stone-400">
                      Delivering to
                    </p>

                    <h3 className="text-sm font-extrabold text-[#1E3A27]">
                      Your address
                    </h3>
                  </div>
                </div>

                <div className="mt-4 rounded-xl bg-[#FAF7F2] p-3.5 text-xs leading-5 text-stone-600">
                  <p className="font-bold text-stone-800">
                    {order.customer_name}
                  </p>

                  <p className="mt-1">
                    {deliveryAddress.flat_house},{' '}
                    {deliveryAddress.streetArea ||
                      deliveryAddress.street_area}
                  </p>

                  {deliveryAddress.landmark && (
                    <p>Near {deliveryAddress.landmark}</p>
                  )}

                  <p>
                    {deliveryAddress.city} - {deliveryAddress.pincode}
                  </p>

                  <p className="mt-2 font-bold text-[#1E3A27]">
                    {order.customer_phone}
                  </p>
                </div>
              </section>

              <section className="rounded-[1.5rem] border border-[#E7DEC8] bg-white p-4 shadow-sm sm:p-5">
                <div className="flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#EEF5F0]">
                    <Store
                      size={17}
                      className="text-[#1E3A27]"
                    />
                  </div>

                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-stone-400">
                      Fulfilled by
                    </p>

                    <h3 className="text-sm font-extrabold text-[#1E3A27]">
                      ManaDeshi Dukaan
                    </h3>
                  </div>
                </div>

                <div className="mt-4 rounded-xl bg-[#EEF5F0] p-3.5 text-xs leading-5 text-stone-600">
                  <p className="font-bold text-stone-800">
                    ManaDeshi Dukaan by Swathi
                  </p>

                  <p className="mt-1">
                    Sai Srinivasa Nilayam, Manikonda
                  </p>

                  <p>Hyderabad - 500089</p>

                  <div className="mt-2 inline-flex items-center rounded-full bg-white px-2.5 py-1 text-[10px] font-bold text-[#1E3A27]">
                    ⚡ Hyderabad Express Delivery · 2–4 Hrs
                  </div>
                </div>
              </section>
            </div>

            {/* Ordered items */}
            <section className="rounded-[1.5rem] border border-[#E7DEC8] bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-[#EEE7DA] px-4 py-4 sm:px-5">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-stone-400">
                    Your purchase
                  </p>

                  <h3 className="mt-1 font-display text-base font-extrabold text-[#1E3A27] sm:text-lg">
                    Ordered items
                  </h3>
                </div>

                <span className="rounded-full bg-[#F4EBDD] px-3 py-1 text-[10px] font-bold text-stone-600">
                  {order.items.length}{' '}
                  {order.items.length === 1 ? 'item' : 'items'}
                </span>
              </div>

              <div className="divide-y divide-stone-100 px-4 sm:px-5">
                {order.items.map((item, index) => (
                  <div
                    key={`${item.product_id}-${index}`}
                    className="flex items-center justify-between gap-3 py-3.5"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      {item.product_image ? (
                        <img
                          src={item.product_image}
                          alt={item.product_name}
                          className="h-12 w-12 shrink-0 rounded-xl border border-stone-200 bg-[#FAF7F2] object-cover"
                        />
                      ) : (
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#F4EBDD] text-[#1E3A27]">
                          <Store size={17} />
                        </div>
                      )}

                      <div className="min-w-0">
                        <p className="truncate text-xs font-extrabold text-stone-800 sm:text-sm">
                          {item.product_name}
                        </p>

                        <p className="mt-1 text-[10px] text-stone-500 sm:text-xs">
                          {item.variant_title} × {item.quantity}
                        </p>
                      </div>
                    </div>

                    <p className="shrink-0 text-xs font-extrabold text-[#1E3A27] sm:text-sm">
                      ₹{item.price * item.quantity}
                    </p>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="border-t border-[#EEE7DA] bg-[#FAF7F2] px-4 py-4 sm:px-5">
                <div className="ml-auto max-w-sm space-y-2 text-xs">
                  <div className="flex justify-between gap-4 text-stone-600">
                    <span>Subtotal</span>
                    <span>₹{order.subtotal}</span>
                  </div>

                  {order.discount_amount > 0 && (
                    <div className="flex justify-between gap-4 font-semibold text-emerald-700">
                      <span>Discount</span>
                      <span>-₹{order.discount_amount}</span>
                    </div>
                  )}

                  <div className="flex justify-between gap-4 text-stone-600">
                    <span>Delivery</span>
                    <span>
                      {order.delivery_fee === 0
                        ? 'FREE'
                        : `₹${order.delivery_fee}`}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-4 border-t border-[#E7DEC8] pt-3 text-sm font-extrabold text-[#1E3A27]">
                    <span>Total</span>
                    <span className="text-lg">
                      ₹{order.total_amount}
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* Trust strip */}
            <div className="grid grid-cols-3 gap-2.5">
              <div className="rounded-xl border border-[#E7DEC8] bg-white p-3 text-center">
                <ShieldCheck
                  size={17}
                  className="mx-auto text-[#1E3A27]"
                />
                <p className="mt-1.5 text-[9px] font-bold text-stone-600 sm:text-[10px]">
                  Secure order
                </p>
              </div>

              <div className="rounded-xl border border-[#E7DEC8] bg-white p-3 text-center">
                <PackageCheck
                  size={17}
                  className="mx-auto text-[#B35427]"
                />
                <p className="mt-1.5 text-[9px] font-bold text-stone-600 sm:text-[10px]">
                  Carefully packed
                </p>
              </div>

              <div className="rounded-xl border border-[#E7DEC8] bg-white p-3 text-center">
                <Truck
                  size={17}
                  className="mx-auto text-[#1E3A27]"
                />
                <p className="mt-1.5 text-[9px] font-bold text-stone-600 sm:text-[10px]">
                  Local delivery
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-1 gap-3 pb-1 sm:grid-cols-[1fr_auto]">
              <a
                href={defaultWaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#25D366] px-4 py-3 text-xs font-bold text-white shadow-md transition hover:bg-[#20BA5A] sm:text-sm"
              >
                <Phone size={16} />

                <span>Get live updates on WhatsApp</span>

                <ChevronRight
                  size={15}
                  className="transition-transform group-hover:translate-x-0.5"
                />
              </a>

              <button
                type="button"
                onClick={() => window.print()}
                className="flex min-h-12 items-center justify-center gap-2 rounded-xl border border-[#D8CEB9] bg-white px-5 py-3 text-xs font-bold text-stone-700 shadow-sm transition hover:bg-stone-50 sm:text-sm"
              >
                <Printer size={16} />

                <span>Print invoice</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom close */}
        <div className="shrink-0 border-t border-[#E7DEC8] bg-white px-4 py-3 sm:hidden">
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-xl bg-[#1E3A27] px-4 py-3 text-sm font-bold text-white"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};