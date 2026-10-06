import React from 'react';
import { 
  X, 
  CheckCircle2, 
  Package, 
  Truck, 
  MapPin, 
  Phone, 
  Calendar, 
  Clock, 
  Store,
  ExternalLink,
  Printer
} from 'lucide-react';
import { Order } from '../types';

interface OrderTrackingModalProps {
  order: Order | null;
  onClose: () => void;
  whatsappUrl?: string;
}

export const OrderTrackingModal: React.FC<OrderTrackingModalProps> = ({
  order,
  onClose,
  whatsappUrl
}) => {
  if (!order) return null;

  const statuses = ['Pending', 'Confirmed', 'Packed', 'Shipped', 'Delivered'];
  const currentIndex = statuses.indexOf(order.order_status) !== -1
    ? statuses.indexOf(order.order_status)
    : 1;

  const defaultWaUrl = whatsappUrl || `https://wa.me/919951118687?text=Hi%20Swathi,%20inquiring%20about%20my%20order%20*${order.order_number}*`;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="relative bg-[#FAF7F2] rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-[#E7DEC8] max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:px-6 bg-[#1E3A27] text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center font-bold">
              <CheckCircle2 className="w-6 h-6 text-[#FBBF24]" />
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider text-emerald-300 font-bold">
                Order Placed Successfully!
              </div>
              <h3 className="font-serif-display font-extrabold text-xl">
                Order ID: {order.order_number}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-5">
          
          {/* Status Timeline Stepper */}
          <div className="p-4 bg-white rounded-2xl border border-[#E7DEC8] shadow-sm">
            <div className="text-xs font-bold uppercase tracking-wider text-stone-600 mb-4">
              Live Order Status Timeline:
            </div>

            <div className="relative flex items-center justify-between">
              {/* Line connector */}
              <div className="absolute left-4 right-4 top-1/2 -translate-y-1/2 h-1 bg-stone-200 z-0" />
              <div
                className="absolute left-4 top-1/2 -translate-y-1/2 h-1 bg-[#1E3A27] transition-all duration-500 z-0"
                style={{ width: `${(currentIndex / (statuses.length - 1)) * 90}%` }}
              />

              {statuses.map((step, idx) => {
                const isPassed = idx <= currentIndex;
                const isCurrent = idx === currentIndex;

                return (
                  <div key={step} className="relative z-10 flex flex-col items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                        isCurrent
                          ? 'bg-[#D97706] text-white ring-4 ring-[#D97706]/20 scale-110 shadow-md'
                          : isPassed
                          ? 'bg-[#1E3A27] text-white shadow-sm'
                          : 'bg-stone-200 text-stone-500'
                      }`}
                    >
                      {idx + 1}
                    </div>
                    <span
                      className={`text-[10px] sm:text-[11px] font-bold mt-1.5 whitespace-nowrap ${
                        isCurrent
                          ? 'text-[#D97706]'
                          : isPassed
                          ? 'text-[#1E3A27]'
                          : 'text-stone-400'
                      }`}
                    >
                      {step}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Delivery & Store Dispatch Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="p-3.5 bg-white rounded-2xl border border-[#E7DEC8] space-y-1.5 text-xs text-stone-600">
              <div className="flex items-center gap-1.5 font-bold text-stone-800">
                <MapPin className="w-4 h-4 text-[#B35427]" />
                <span>Delivery Address</span>
              </div>
              <p className="font-semibold text-stone-800">{order.customer_name}</p>
              <p>{order.delivery_address.flat_house}, {order.delivery_address.streetArea || order.delivery_address.street_area}</p>
              <p>{order.delivery_address.city} - {order.delivery_address.pincode}</p>
              <p className="text-[#1E3A27] font-semibold">Phone: {order.customer_phone}</p>
            </div>

            <div className="p-3.5 bg-white rounded-2xl border border-[#E7DEC8] space-y-1.5 text-xs text-stone-600">
              <div className="flex items-center gap-1.5 font-bold text-stone-800">
                <Store className="w-4 h-4 text-[#1E3A27]" />
                <span>Dispatched From Store</span>
              </div>
              <p className="font-bold text-stone-800">ManaDeshi Dukaan by Swathi</p>
              <p>Sai Srinivasa Nilayam, Manikonda</p>
              <p>Hyderabad - 500089</p>
              <p className="text-emerald-700 font-bold">⚡ Hyderabad Express Delivery (2-4 Hrs)</p>
            </div>
          </div>

          {/* Order Items Summary */}
          <div className="p-4 bg-white rounded-2xl border border-[#E7DEC8] space-y-2.5">
            <div className="text-xs font-bold uppercase tracking-wider text-stone-800">
              Ordered Items ({order.items.length})
            </div>

            <div className="divide-y divide-stone-100">
              {order.items.map((item, i) => (
                <div key={i} className="py-2.5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    {item.product_image && (
                      <img
                        src={item.product_image}
                        alt={item.product_name}
                        className="w-10 h-10 object-cover rounded-lg border border-stone-200"
                      />
                    )}
                    <div>
                      <div className="font-bold text-stone-800">{item.product_name}</div>
                      <div className="text-stone-500 text-[11px]">Size: {item.variant_title} × {item.quantity}</div>
                    </div>
                  </div>
                  <div className="font-bold text-[#1E3A27]">₹{item.price * item.quantity}</div>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-stone-200 space-y-1 text-xs">
              <div className="flex justify-between text-stone-600">
                <span>Subtotal</span>
                <span>₹{order.subtotal}</span>
              </div>
              {order.discount_amount > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Discount</span>
                  <span>-₹{order.discount_amount}</span>
                </div>
              )}
              <div className="flex justify-between text-stone-600">
                <span>Delivery Charge</span>
                <span>{order.delivery_fee === 0 ? 'FREE' : `₹${order.delivery_fee}`}</span>
              </div>
              <div className="flex justify-between font-extrabold text-[#1E3A27] text-sm pt-1 border-t border-stone-100">
                <span>Total Paid / Payable</span>
                <span>₹{order.total_amount}</span>
              </div>
            </div>
          </div>

          {/* Actions & WhatsApp Support */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <a
              href={defaultWaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#20BA5A] text-white font-bold text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 transition-all"
            >
              <Phone className="w-4 h-4" />
              <span>Get Live Updates on WhatsApp</span>
            </a>

            <button
              onClick={() => window.print()}
              className="px-4 py-3 rounded-xl bg-white hover:bg-stone-50 border border-[#D8CEB9] text-stone-700 font-semibold text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-sm"
            >
              <Printer className="w-4 h-4" />
              <span>Print Invoice</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
