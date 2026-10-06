import React, { useState } from 'react';
import { X, MapPin, Check } from 'lucide-react';
import { checkPincode } from '../services/api';

interface PincodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPincode: (pincode: string, area: string) => void;
  currentPincode: string;
}

export const PincodeModal: React.FC<PincodeModalProps> = ({
  isOpen,
  onClose,
  onSelectPincode,
  currentPincode
}) => {
  const [pin, setPin] = useState(currentPincode || '500089');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  if (!isOpen) return null;

  const handleCheck = async (targetPin?: string) => {
    const code = targetPin || pin;
    if (code.length !== 6) return;
    setLoading(true);
    const res = await checkPincode(code);
    setResult(res);
    setLoading(false);
  };

  const handleApply = () => {
    if (result && result.available) {
      onSelectPincode(pin, result.area_name.split('/')[0].trim());
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-[fadeIn_.3s_ease_both]">
      <div className="relative bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-[#E7DEC8]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-[#1E3A27] text-white">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-[#FBBF24]" />
            <h3 className="font-[family-name:'Playfair_Display',Georgia,serif] font-bold text-base">Check Hyderabad Delivery Speed</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-white/10 text-white/80">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          <p className="text-xs text-stone-600">
            Enter your 6-digit delivery pincode to check instant local delivery time from our Manikonda store.
          </p>

          <div className="flex gap-2">
            <input
              type="text"
              maxLength={6}
              value={pin}
              onChange={e => setPin(e.target.value)}
              placeholder="e.g. 500089"
              className="flex-1 px-3.5 py-2 text-sm bg-[#FAF7F2] border border-[#D8CEB9] rounded-xl font-bold focus:outline-none focus:ring-2 focus:ring-[#1E3A27]"
            />
            <button
              onClick={() => handleCheck()}
              disabled={loading}
              className="px-5 py-2 bg-[#1E3A27] text-white rounded-xl text-xs font-bold hover:bg-[#162D1F]"
            >
              {loading ? 'Checking...' : 'Check'}
            </button>
          </div>

          {/* Quick Click Areas */}
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-stone-400 mb-1.5">
              Popular Hyderabad Zones:
            </div>
            <div className="flex flex-wrap gap-1.5">
              {[
                { name: 'Manikonda', pin: '500089' },
                { name: 'Gachibowli', pin: '500032' },
                { name: 'Kondapur', pin: '500084' },
                { name: 'Madhapur', pin: '500081' },
                { name: 'Jubilee Hills', pin: '500033' },
              ].map(item => (
                <button
                  key={item.pin}
                  onClick={() => {
                    setPin(item.pin);
                    handleCheck(item.pin);
                  }}
                  className="px-2.5 py-1 bg-stone-50 hover:bg-[#FAF7F2] border border-stone-200 rounded-lg text-xs font-semibold text-stone-700"
                >
                  {item.name} ({item.pin})
                </button>
              ))}
            </div>
          </div>

          {/* Result Box */}
          {result && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-2 text-xs text-stone-800">
              <div className="flex items-center gap-2 font-bold text-emerald-900">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Delivery Available!</span>
              </div>
              <p><strong>Zone:</strong> {result.area_name}</p>
              <p><strong>Estimated Speed:</strong> ⚡ {result.delivery_time_estimate}</p>
              <p><strong>Fee:</strong> {result.delivery_fee === 0 ? 'FREE' : `₹${result.delivery_fee}`} (Free above ₹{result.free_delivery_above})</p>

              <button
                onClick={handleApply}
                className="w-full mt-2 py-2 bg-[#1E3A27] text-white rounded-xl font-bold text-xs hover:bg-[#162D1F]"
              >
                Set this location & continue shopping
              </button>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
