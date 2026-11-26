import React from 'react';
import { 
  X, 
  Trash2, 
  ShoppingBag, 
  Calendar, 
  Clock, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight,
  MapPin,
  Lock
} from 'lucide-react';

export default function CartDrawer({
  isOpen,
  onClose,
  items,
  onRemoveItem,
  onProceedToCheckout
}) {
  if (!isOpen) return null;

  const formatPKR = (num) => Number(num || 0).toLocaleString('en-PK');

  const subtotalItems = items.reduce((acc, item) => {
    return acc + (item.bookingMode === 'rent' ? item.rentAmount : item.totalPrice);
  }, 0);

  const totalSecurityDeposit = items.reduce((acc, item) => {
    return acc + (item.bookingMode === 'rent' ? (item.securityDeposit || 0) : 0);
  }, 0);

  const grandTotal = subtotalItems + totalSecurityDeposit;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col border-l border-festiva-sand">
          
          {/* Drawer Header */}
          <div className="px-5 py-4 border-b border-festiva-sand bg-festiva-blush flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-festiva-burgundy" />
              <h2 className="font-serif font-bold text-lg text-festiva-maroon">
                Your Bag & Bookings
              </h2>
              <span className="bg-festiva-burgundy text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {items.length}
              </span>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-stone-200 text-stone-500 hover:text-stone-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Items List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
                <div className="w-16 h-16 rounded-full bg-festiva-blush border border-festiva-sand flex items-center justify-center text-festiva-burgundy">
                  <ShoppingBag className="w-8 h-8 stroke-1" />
                </div>
                <h3 className="font-serif font-bold text-stone-800 text-base">
                  Your cart is empty
                </h3>
                <p className="text-xs text-stone-500 max-w-xs">
                  Browse our Quetta collection of bridal suits for rent, jewellery, perfumes, and garments.
                </p>
                <button
                  onClick={onClose}
                  className="bg-festiva-burgundy text-white text-xs font-bold px-5 py-2.5 rounded-xl hover:bg-festiva-maroon transition-all shadow-sm"
                >
                  Explore Collection
                </button>
              </div>
            ) : (
              items.map((cartItem, index) => {
                const isRental = cartItem.bookingMode === 'rent';
                return (
                  <div 
                    key={index}
                    className="p-3 bg-[#FAF5F3] rounded-2xl border border-festiva-sand flex gap-3 relative group"
                  >
                    {/* Item Image */}
                    <div className="w-20 h-24 rounded-xl overflow-hidden bg-stone-200 flex-shrink-0">
                      <img
                        src={cartItem.product.images[0]}
                        alt={cartItem.product.title}
                        className="w-full h-full object-cover object-top"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 flex flex-col justify-between text-xs">
                      <div>
                        <div className="flex items-center justify-between gap-1">
                          <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded ${
                            isRental 
                              ? 'bg-festiva-burgundy text-white' 
                              : 'bg-stone-900 text-white'
                          }`}>
                            {isRental ? 'Rental Booking' : 'Direct Buy'}
                          </span>

                          <button
                            onClick={() => onRemoveItem(index)}
                            className="text-stone-400 hover:text-rose-600 transition-colors p-1"
                            title="Remove"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <h4 className="font-serif font-bold text-stone-900 text-sm mt-1 line-clamp-1">
                          {cartItem.product.title}
                        </h4>

                        <div className="text-[11px] text-stone-500 flex items-center gap-2 mt-0.5">
                          <span>Size: <b>{cartItem.selectedSize}</b></span>
                          <span>•</span>
                          <span className="flex items-center gap-0.5 text-stone-600">
                            <MapPin className="w-3 h-3 text-festiva-gold" />
                            {cartItem.product.quettaArea}
                          </span>
                        </div>

                        {/* Rental Specific Specs */}
                        {isRental && (
                          <div className="mt-1.5 p-1.5 rounded-lg bg-white border border-stone-200 text-[10px] space-y-0.5">
                            <div className="flex justify-between text-stone-600">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3 text-festiva-gold" />
                                Start Date:
                              </span>
                              <b>{cartItem.startDate}</b>
                            </div>
                            <div className="flex justify-between text-stone-600">
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3 text-festiva-gold" />
                                Duration:
                              </span>
                              <b>{cartItem.rentalDuration} {cartItem.rentalUnit}</b>
                            </div>
                            <div className="flex justify-between text-amber-900 font-medium">
                              <span>Security Deposit:</span>
                              <b>Rs. {formatPKR(cartItem.securityDeposit)}</b>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Line Item Total */}
                      <div className="flex justify-between items-center pt-2 border-t border-festiva-sand/80 mt-1">
                        <span className="text-stone-500 text-[10px]">Total for item:</span>
                        <span className="font-bold text-festiva-burgundy text-xs">
                          Rs. {formatPKR(cartItem.totalPrice)}
                        </span>
                      </div>

                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Drawer Footer / Checkout summary */}
          {items.length > 0 && (
            <div className="p-4 border-t border-festiva-sand bg-festiva-blush space-y-3">
              <div className="space-y-1.5 text-xs text-stone-700">
                <div className="flex justify-between">
                  <span>Items / Rental Charges:</span>
                  <span className="font-semibold text-stone-900">Rs. {formatPKR(subtotalItems)}</span>
                </div>

                {totalSecurityDeposit > 0 && (
                  <div className="flex justify-between text-amber-900">
                    <span className="flex items-center gap-1">
                      <Lock className="w-3 h-3 text-amber-700" />
                      Refundable Security Deposit:
                    </span>
                    <span className="font-bold">+ Rs. {formatPKR(totalSecurityDeposit)}</span>
                  </div>
                )}

                <div className="flex justify-between text-emerald-700">
                  <span>Quetta Launch Delivery / Verification:</span>
                  <span className="font-bold">FREE</span>
                </div>

                <div className="border-t border-festiva-sand pt-2 flex justify-between items-center text-sm font-bold text-stone-900">
                  <span className="text-festiva-maroon font-serif text-base">Grand Total:</span>
                  <span className="text-lg text-festiva-burgundy">
                    Rs. {formatPKR(grandTotal)}
                  </span>
                </div>
              </div>

              <button
                onClick={onProceedToCheckout}
                className="w-full bg-gradient-to-r from-festiva-burgundy to-festiva-maroon hover:brightness-110 text-white font-bold py-3 px-4 rounded-xl shadow-festive transition-all flex items-center justify-center gap-2 transform active:scale-95 text-xs sm:text-sm"
              >
                <span>Proceed to Checkout & Payment</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
