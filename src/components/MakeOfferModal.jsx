import React, { useState } from 'react';
import { 
  X, 
  Tag, 
  Sparkles, 
  MessageSquare, 
  ShieldCheck, 
  ArrowRight, 
  Percent, 
  CheckCircle2,
  Clock
} from 'lucide-react';
import { createOffer, sanitizeInput } from '../services/marketplaceService';

export default function MakeOfferModal({
  isOpen,
  onClose,
  product,
  activeUser,
  onOfferSubmitted
}) {
  if (!isOpen || !product) return null;

  const originalPrice = product.listingType === 'buy' 
    ? product.price 
    : (product.rentRate?.daily || product.price);

  const [offeredPrice, setOfferedPrice] = useState(
    Math.round(originalPrice * 0.85) // default 15% discount
  );
  const [note, setNote] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const formatPKR = (num) => Number(num || 0).toLocaleString('en-PK');

  const discountPercent = Math.round(((originalPrice - offeredPrice) / originalPrice) * 100);
  const savings = Math.max(0, originalPrice - offeredPrice);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!activeUser) {
      setError('Please sign in or select an active user profile first.');
      return;
    }

    if (offeredPrice <= 0 || offeredPrice >= originalPrice) {
      setError(`Offer price must be less than original Rs. ${formatPKR(originalPrice)} and greater than 0.`);
      return;
    }

    const offerData = {
      productId: product.id,
      productTitle: product.title,
      productImage: product.images?.[0] || 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?q=80&w=600',
      sellerPhone: product.vendor?.phone || '0307-8899112',
      sellerName: product.vendor?.name || 'Quetta Vendor',
      buyerId: activeUser.id,
      buyerName: activeUser.name,
      buyerPhone: activeUser.phone,
      originalPrice: originalPrice,
      offeredPrice: Number(offeredPrice),
      offerType: product.listingType,
      note: sanitizeInput(note) || 'Assalam o Alaikum! I am interested at this offered price.'
    };

    const newOffer = createOffer(offerData);
    if (onOfferSubmitted) onOfferSubmitted(newOffer);
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div 
        className="bg-white rounded-t-[28px] sm:rounded-3xl max-w-lg w-full max-h-[92vh] sm:max-h-[85vh] shadow-2xl flex flex-col overflow-hidden border border-festiva-gold/30 animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#4A0B16] via-[#6B1222] to-[#4A0B16] text-white p-4 sm:p-5 flex items-center justify-between border-b border-festiva-gold/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-festiva-gold/20 border border-festiva-gold/40 flex items-center justify-center text-festiva-gold shadow-sm font-serif font-bold text-lg">
              <Tag className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif font-bold text-base sm:text-lg text-white">
                  Make an Offer / قیمت طے کریں
                </h2>
                <span className="text-[10px] bg-emerald-500 text-white px-2 py-0.5 rounded-full font-bold uppercase">
                  OLX Bargain
                </span>
              </div>
              <p className="text-xs text-white/80">
                Direct seller se apni marzi ki qemat negotiate karein
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="overflow-y-auto p-4 sm:p-6 space-y-4">
          
          {submitted ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center border-2 border-emerald-300 animate-bounce">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-lg text-stone-900">
                  Offer Bhej Di Gayi Hai! 🎉
                </h3>
                <p className="text-xs text-stone-600 mt-1 max-w-sm mx-auto">
                  Aapki <b>Rs. {formatPKR(offeredPrice)}</b> ki offer vendor (<b>{product.vendor?.name}</b>) ko phonch chuki hai. Vendor ke accept ya counter-offer karne par aapko notification mil jayega.
                </p>
              </div>

              <div className="bg-festiva-blush p-3 rounded-2xl border border-festiva-sand text-xs text-stone-700">
                <span>Offer Status: </span>
                <span className="font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                  Pending Seller Review (زیر غور)
                </span>
              </div>

              <button
                onClick={onClose}
                className="w-full bg-festiva-burgundy hover:bg-festiva-maroon text-white font-bold py-2.5 rounded-xl text-xs transition-all"
              >
                Done / Theek Hai
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Product Preview Card */}
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-stone-50 border border-stone-200">
                <img 
                  src={product.images?.[0] || 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?q=80&w=200'} 
                  alt={product.title} 
                  className="w-16 h-20 rounded-xl object-cover border border-stone-300 flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-xs sm:text-sm text-stone-900 truncate">
                    {product.title}
                  </h4>
                  <p className="text-[11px] text-stone-500 mt-0.5">
                    Seller: <b className="text-festiva-burgundy">{product.vendor?.name}</b> &bull; {product.quettaArea}
                  </p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-[11px] text-stone-500 line-through">
                      Rs. {formatPKR(originalPrice)}
                    </span>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      Original Price
                    </span>
                  </div>
                </div>
              </div>

              {error && (
                <div className="p-2.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-medium">
                  {error}
                </div>
              )}

              {/* Offer Amount Input */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Your Offered Price (آپ کتنے میں لینا چاہتے ہیں؟):
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-3 font-bold text-xs text-stone-500">
                    Rs.
                  </span>
                  <input
                    type="number"
                    min="1000"
                    max={originalPrice - 1}
                    value={offeredPrice}
                    onChange={(e) => setOfferedPrice(Number(e.target.value))}
                    className="w-full bg-festiva-blush/40 focus:bg-white border-2 border-stone-200 focus:border-festiva-burgundy rounded-2xl py-2.5 pl-12 pr-4 text-base font-bold text-festiva-burgundy outline-none transition-all"
                    required
                  />
                </div>

                {/* Quick Offer Chips (-10%, -15%, -20%, -25%) */}
                <div className="flex items-center gap-1.5 mt-2 overflow-x-auto pb-1">
                  {[10, 15, 20, 25, 30].map(pct => {
                    const priceForPct = Math.round(originalPrice * (1 - pct / 100));
                    return (
                      <button
                        key={pct}
                        type="button"
                        onClick={() => setOfferedPrice(priceForPct)}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold whitespace-nowrap transition-all border ${
                          discountPercent === pct
                            ? 'bg-festiva-burgundy text-white border-festiva-burgundy'
                            : 'bg-white text-stone-700 border-stone-200 hover:border-festiva-burgundy'
                        }`}
                      >
                        -{pct}% (Rs. {formatPKR(priceForPct)})
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Savings & Discount Summary Banner */}
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 p-3 rounded-2xl flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Percent className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-900 font-semibold">
                    {discountPercent > 0 ? `${discountPercent}% Discount Proposed` : 'Fair Offer'}
                  </span>
                </div>
                <div className="font-bold text-emerald-800">
                  You Save: Rs. {formatPKR(savings)}
                </div>
              </div>

              {/* Note / Negotiation message */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Message / Negotiation Note to Seller (اختیاری پیغام):
                </label>
                <textarea
                  rows="2"
                  placeholder="e.g. Can you confirm if matching dupatta is included? I can make payment via Easypaisa today."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full bg-festiva-blush/40 focus:bg-white border border-stone-200 focus:border-festiva-burgundy rounded-xl p-2.5 text-xs outline-none"
                />
              </div>

              {/* Active User Confirmation */}
              {activeUser && (
                <div className="text-[11px] text-stone-500 flex items-center justify-between bg-stone-50 p-2 rounded-xl">
                  <span>Offering as: <b>{activeUser.name}</b> ({activeUser.phone})</span>
                  <span className="text-emerald-600 font-semibold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> Verified
                  </span>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-festiva-burgundy via-festiva-maroon to-festiva-burgundy hover:brightness-110 text-white font-bold py-3 rounded-2xl shadow-festive transition-all flex items-center justify-center gap-2 text-xs"
              >
                <Sparkles className="w-4 h-4 text-festiva-gold" />
                <span>Send Offer of Rs. {formatPKR(offeredPrice)} (پیشکش بھیجیں)</span>
              </button>
            </form>
          )}

        </div>
      </div>
    </div>
  );
}
