import React from 'react';
import {
  CheckCircle2,
  MapPin,
  Phone,
  Printer,
  Store,
  X,
} from 'lucide-react';
import { Order } from '../types';

interface OrderTrackingModalProps {
  order: Order | null;
  onClose: () => void;
  whatsappUrl?: string;
}

const statuses = [
  'Pending',
  'Confirmed',
  'Packed',
  'Shipped',
  'Delivered',
];

export const OrderTrackingModal: React.FC<OrderTrackingModalProps> = ({
  order,
  onClose,
  whatsappUrl,
}) => {
  if (!order) return null;

  const statusIndex = statuses.indexOf(order.order_status);
  const currentIndex = statusIndex >= 0 ? statusIndex : 1;

  const progressPercent =
    currentIndex === 0
      ? 0
      : (currentIndex / (statuses.length - 1)) * 100;

  const defaultWaUrl =
    whatsappUrl ||
    `https://wa.me/919951118687?text=Hi%20Swathi,%20inquiring%20about%20my%20order%20*${order.order_number}*`;

  const deliveryAddress = order.delivery_address;

  return (
    <div
      className="fixed inset-0 z-[500] flex items-center justify-center overflow-y-auto bg-black/65 p-3 backdrop-blur-sm sm:p-6"
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="relative flex max-h-[94dvh] w-full max-w-2xl flex-col overflow-hidden rounded-[2rem] border border-[#E7DEC8] bg-[#FAF7F2] shadow-2xl">
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between bg-[#1E3A27] px-4 py-4 text-white sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10">
              <CheckCircle2
                size={22}
                className="text-amber-300"
              />
            </div>

            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-300 sm:text-xs">
                Order Placed Successfully!
              </p>

              <h3 className="mt-0.5 truncate font-display text-lg font-extrabold sm:text-xl">
                Order ID: {order.order_number}
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close order tracking"
            className="ml-3 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white/70 transition hover:bg-white/10 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 space-y-5 overflow-y-auto p-4 sm:p-6">
          {/* Status timeline */}
          <section className="rounded-2xl border border-[#E7DEC8] bg-white p-4 shadow-sm sm:p-5">
            <div className="mb-5 text-xs font-bold uppercase tracking-wider text-stone-600">
              Live Order Status Timeline
            </div>

            <div className="relative px-1 sm:px-3">
              {/* Background line */}
              <div className="absolute left-[10%] right-[10%] top-4 h-1 -translate-y-1/2 rounded-full bg-stone-200" />

              {/* Progress line */}
              <div
                className="absolute left-[10%] top-4 h-1 -translate-y-1/2 rounded-full bg-[#1E3A27] transition-all duration-500"
                style={{
                  width: `${progressPercent * 0.8}%`,
                }}
              />

              <div className="relative z-10 flex items-start justify-between">
                {statuses.map((status, index) => {
                  const isPassed = index <= currentIndex;
                  const isCurrent = index === currentIndex;

                  return (
                    <div
                      key={status}
                      className="flex min-w-0 flex-1 flex-col items-center"
                    >
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-full text-[10px] font-bold transition-all sm:h-9 sm:w-9 sm:text-xs ${
                          isCurrent
                            ? 'scale-110 bg-[#D97706] text-white shadow-md ring-4 ring-[#D97706]/20'
                            : isPassed
                              ? 'bg-[#1E3A27] text-white shadow-sm'
                              : 'bg-stone-200 text-stone-500'
                        }`}
                      >
                        {isPassed && index < currentIndex ? (
                          <CheckCircle2 size={16} />
                        ) : (
                          index + 1
                        )}
                      </div>

                      <span
                        className={`mt-2 w-full break-words px-0.5 text-center text-[9px] font-bold leading-tight sm:text-[11px] ${
                          isCurrent
                            ? 'text-[#D97706]'
                            : isPassed
                              ? 'text-[#1E3A27]'
                              : 'text-stone-400'
                        }`}
                      >
                        {status}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Delivery + store */}
          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
            <section className="space-y-2 rounded-2xl border border-[#E7DEC8] bg-white p-4 text-xs text-stone-600">
              <div className="flex items-center gap-1.5 font-bold text-stone-800">
                <MapPin
                  size={16}
                  className="text-[#B35427]"
                />
                <span>Delivery Address</span>
              </div>

              <div className="pt-1">
                <p className="font-bold text-stone-800">
                  {order.customer_name}
                </p>

                <p className="mt-1 leading-5">
                  {deliveryAddress.flat_house},{' '}
                  {deliveryAddress.streetArea ||
                    deliveryAddress.street_area}
                </p>

                {deliveryAddress.landmark && (
                  <p className="leading-5">
                    Near {deliveryAddress.landmark}
                  </p>
                )}

                <p className="leading-5">
                  {deliveryAddress.city} - {deliveryAddress.pincode}
                </p>

                <p className="mt-1 font-semibold text-[#1E3A27]">
                  Phone: {order.customer_phone}
                </p>
              </div>
            </section>

            <section className="space-y-2 rounded-2xl border border-[#E7DEC8] bg-white p-4 text-xs text-stone-600">
              <div className="flex items-center gap-1.5 font-bold text-stone-800">
                <Store
                  size={16}
                  className="text-[#1E3A27]"
                />
                <span>Dispatched From Store</span>
              </div>

              <div className="pt-1">
                <p className="font-bold text-stone-800">
                  ManaDeshi Dukaan by Swathi
                </p>

                <p className="mt-1 leading-5">
                  Sai Srinivasa Nilayam, Manikonda
                </p>

                <p className="leading-5">
                  Hyderabad - 500089
                </p>

                <p className="mt-1 font-bold text-emerald-700">
                  ⚡ Hyderabad Express Delivery (2-4 Hrs)
                </p>
              </div>
            </section>
          </div>

          {/* Items */}
          <section className="rounded-2xl border border-[#E7DEC8] bg-white p-4 sm:p-5">
            <div className="mb-2.5 text-xs font-bold uppercase tracking-wider text-stone-800">
              Ordered Items ({order.items.length})
            </div>

            <div className="divide-y divide-stone-100">
              {order.items.map((item, index) => (
                <div
                  key={`${item.product_id}-${index}`}
                  className="flex items-center justify-between gap-3 py-3"
                >
                  <div className="flex min-w-0 items-center gap-2.5">
                    {item.product_image ? (
                      <img
                        src={item.product_image}
                        alt={item.product_name}
                        className="h-11 w-11 shrink-0 rounded-lg border border-stone-200 object-cover"
                      />
                    ) : (
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#F4EFE6] text-[#1E3A27]">
                        <Store size={16} />
                      </div>
                    )}

                    <div className="min-w-0">
                      <div className="truncate text-xs font-bold text-stone-800">
                        {item.product_name}
                      </div>

                      <div className="mt-0.5 text-[10px] text-stone-500 sm:text-[11px]">
                        Size: {item.variant_title} × {item.quantity}
                      </div>
                    </div>
                  </div>

                  <div className="shrink-0 text-xs font-bold text-[#1E3A27]">
                    ₹{item.price * item.quantity}
                  </div>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="mt-2 space-y-1.5 border-t border-stone-200 pt-3 text-xs">
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
                <span>Delivery Charge</span>
                <span>
                  {order.delivery_fee === 0
                    ? 'FREE'
                    : `₹${order.delivery_fee}`}
                </span>
              </div>

              <div className="flex justify-between gap-4 border-t border-stone-100 pt-2 text-sm font-extrabold text-[#1E3A27]">
                <span>Total Paid / Payable</span>
                <span>₹{order.total_amount}</span>
              </div>
            </div>
          </section>

          {/* Actions */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_auto]">
            <a
              href={defaultWaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#25D366] px-4 py-3 text-xs font-bold text-white shadow-md transition hover:bg-[#20BA5A] sm:text-sm"
            >
              <Phone size={16} />
              <span>Get Live Updates on WhatsApp</span>
            </a>

            <button
              type="button"
              onClick={() => window.print()}
              className="flex min-h-12 items-center justify-center gap-1.5 rounded-xl border border-[#D8CEB9] bg-white px-5 py-3 text-xs font-semibold text-stone-700 shadow-sm transition hover:bg-stone-50 sm:text-sm"
            >
              <Printer size={16} />
              <span>Print Invoice</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};