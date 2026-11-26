import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  Star, 
  ShieldCheck, 
  Clock, 
  Calendar, 
  Sparkles, 
  Ruler, 
  MessageCircle, 
  ShoppingBag,
  Info,
  CheckCircle2,
  Lock,
  ArrowRight,
  MessageSquare,
  Video,
  Play,
  Eye,
  Heart
} from 'lucide-react';
import WhatsAppIcon from './WhatsAppIcon';

export default function ProductDetailModal({ 
  product, 
  onClose, 
  onAddToCart,
  initialBookingType = 'rent',
  onOpenChatWithProduct
}) {
  if (!product) return null;

  const [showVideo, setShowVideo] = useState(false);
  const isRental = product.listingType === 'rent';
  const isBuy = product.listingType === 'buy';

  const [bookingMode, setBookingMode] = useState(
    product.listingType === 'buy' ? 'buy' : 'rent'
  );
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || 'Standard');
  
  // Rental Calculation State
  const [rentalUnit, setRentalUnit] = useState('daily'); // 'hourly', 'daily', 'monthly'
  const [rentalDuration, setRentalDuration] = useState(1);
  const [startDate, setStartDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });

  const formatPKR = (num) => Number(num || 0).toLocaleString('en-PK');

  // Calculate pricing
  const calculateRentalTotal = () => {
    if (!product.rentRate) return 0;
    const rate = 
      rentalUnit === 'hourly' ? product.rentRate.hourly :
      rentalUnit === 'daily' ? product.rentRate.daily :
      product.rentRate.monthly;
    return rate * rentalDuration;
  };

  const rentalTotal = calculateRentalTotal();
  const grandTotal = bookingMode === 'rent' 
    ? rentalTotal + (product.securityDeposit || 0) 
    : product.price;

  const handleWhatsAppInquiry = () => {
    const phone = product.vendor.phone.replace(/[^0-9]/g, '');
    let text = `Assalam o Alaikum! I want to inquire about "${product.title}" (ID: ${product.id}) on Mamas Collection Quetta.\n`;
    text += `Area: ${product.quettaArea}\n`;
    text += `Event: ${product.eventType.toUpperCase()}\n`;
    text += `Size Selected: ${selectedSize}\n`;
    if (bookingMode === 'rent') {
      text += `Booking Type: Rental (${rentalDuration} ${rentalUnit})\n`;
      text += `Start Date: ${startDate}\n`;
      text += `Rent Amount: Rs. ${formatPKR(rentalTotal)}\n`;
      text += `Refundable Security Deposit: Rs. ${formatPKR(product.securityDeposit)}\n`;
      text += `Grand Total: Rs. ${formatPKR(grandTotal)}\n`;
    } else {
      text += `Booking Type: Direct Purchase\n`;
      text += `Price: Rs. ${formatPKR(product.price)}\n`;
    }
    text += `Please confirm availability for Quetta delivery/pickup.`;

    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleConfirmAction = () => {
    const bookingDetails = {
      product,
      bookingMode,
      selectedSize,
      rentalUnit: bookingMode === 'rent' ? rentalUnit : null,
      rentalDuration: bookingMode === 'rent' ? rentalDuration : null,
      startDate: bookingMode === 'rent' ? startDate : null,
      rentAmount: bookingMode === 'rent' ? rentalTotal : null,
      securityDeposit: bookingMode === 'rent' ? product.securityDeposit : 0,
      totalPrice: grandTotal
    };
    onAddToCart(bookingDetails);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl border border-festiva-sand my-8 max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-festiva-sand bg-festiva-blush/60">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-festiva-burgundy animate-ping" />
            <span className="font-serif font-bold text-festiva-maroon text-sm sm:text-base">
              Item Details & Booking
            </span>
            <span className="text-xs text-stone-400">({product.id})</span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-stone-200 text-stone-500 hover:text-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto p-5 sm:p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            
            {/* Left Column: Image Gallery & Video Showcase */}
            <div className="md:col-span-6 space-y-3">
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-stone-100 border border-festiva-sand shadow-inner">
                {showVideo && product.video ? (
                  <div className="relative w-full h-full bg-black flex items-center justify-center">
                    <video
                      src={product.video}
                      controls
                      autoPlay
                      className="w-full h-full object-contain"
                    />
                    <button
                      type="button"
                      onClick={() => setShowVideo(false)}
                      className="absolute top-3 right-3 bg-black/70 hover:bg-black text-white text-xs px-2.5 py-1 rounded-full z-10 flex items-center gap-1 shadow"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Back to Photos</span>
                    </button>
                  </div>
                ) : (
                  <>
                    <img
                      src={product.images[activeImageIndex] || product.images[0]}
                      alt={product.title}
                      className="w-full h-full object-cover object-top"
                    />

                    {/* Badges on main image */}
                    <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                      {product.isOfficial ? (
                        <span className="bg-festiva-maroon text-festiva-lightgold font-bold text-xs px-3 py-1 rounded-full shadow-md flex items-center gap-1 border border-festiva-gold/40">
                          <Sparkles className="w-3 h-3 text-festiva-gold" />
                          <span>Mamas Collection Official</span>
                        </span>
                      ) : (
                        <span className="bg-stone-900/90 text-white font-semibold text-xs px-3 py-1 rounded-full shadow-md flex items-center gap-1">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Verified Peer Host</span>
                        </span>
                      )}

                      <span className="bg-white/90 text-festiva-burgundy font-bold text-[10px] px-2.5 py-0.5 rounded shadow-sm uppercase tracking-wider self-start">
                        {product.eventType}
                      </span>
                    </div>

                    <div className="absolute bottom-3 right-3 bg-black/75 backdrop-blur-md text-white text-xs px-2.5 py-1 rounded-full flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-festiva-gold" />
                      <span>{product.quettaArea}</span>
                    </div>

                    {product.video && (
                      <button
                        type="button"
                        onClick={() => setShowVideo(true)}
                        className="absolute bottom-3 left-3 bg-festiva-burgundy/90 hover:bg-festiva-burgundy text-white text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg border border-festiva-gold/40 backdrop-blur-sm transition-all animate-pulse"
                      >
                        <Play className="w-3.5 h-3.5 text-festiva-gold fill-festiva-gold" />
                        <span>Watch Video Clip</span>
                      </button>
                    )}
                  </>
                )}
              </div>

              {/* Thumbnails Row (Images + Video Button) */}
              <div className="flex gap-2 overflow-x-auto pb-1">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setActiveImageIndex(idx);
                      setShowVideo(false);
                    }}
                    className={`w-16 h-20 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all ${
                      !showVideo && activeImageIndex === idx ? 'border-festiva-burgundy scale-105 shadow-md' : 'border-stone-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}

                {product.video && (
                  <button
                    type="button"
                    onClick={() => setShowVideo(true)}
                    className={`w-16 h-20 rounded-xl overflow-hidden border-2 flex-shrink-0 flex flex-col items-center justify-center gap-1 bg-stone-900 text-white transition-all ${
                      showVideo ? 'border-festiva-burgundy scale-105 shadow-md bg-festiva-maroon' : 'border-stone-700 opacity-80 hover:opacity-100'
                    }`}
                  >
                    <Video className="w-5 h-5 text-festiva-lightgold" />
                    <span className="text-[10px] font-bold">Video</span>
                  </button>
                )}
              </div>

              {/* Stitched Measurements Card */}
              {product.measurements && (
                <div className="bg-[#FAF5F3] p-4 rounded-2xl border border-festiva-sand">
                  <div className="flex items-center gap-1.5 font-bold text-xs text-festiva-maroon mb-2">
                    <Ruler className="w-4 h-4 text-festiva-gold" />
                    <span>Exact Stitched Measurements (انچ میں ناپ):</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs text-stone-700">
                    <div className="bg-white p-2 rounded-lg border border-stone-200">
                      <span className="text-stone-400 block text-[10px]">Chest / Bust:</span>
                      <span className="font-semibold">{product.measurements.chest}</span>
                    </div>
                    <div className="bg-white p-2 rounded-lg border border-stone-200">
                      <span className="text-stone-400 block text-[10px]">Waist:</span>
                      <span className="font-semibold">{product.measurements.waist}</span>
                    </div>
                    <div className="bg-white p-2 rounded-lg border border-stone-200">
                      <span className="text-stone-400 block text-[10px]">Length:</span>
                      <span className="font-semibold">{product.measurements.length}</span>
                    </div>
                    <div className="bg-white p-2 rounded-lg border border-stone-200">
                      <span className="text-stone-400 block text-[10px]">Flare / Ghera:</span>
                      <span className="font-semibold">{product.measurements.flare}</span>
                    </div>
                  </div>
                  <p className="text-[11px] text-emerald-800 font-medium mt-2 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{product.measurements.alterationMargin}</span>
                  </p>
                </div>
              )}
            </div>

            {/* Right Column: Title, Vendor, Pricing & Booking Engine */}
            <div className="md:col-span-6 space-y-4">
              
              <div>
                <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
                  <div className="flex items-center gap-1 text-amber-500 font-semibold">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span>{product.rating}</span>
                    <span className="text-stone-400 font-normal">({product.reviewsCount} reviews)</span>
                  </div>
                  <span className="text-stone-600 font-medium bg-stone-100 px-2 py-0.5 rounded">
                    Condition: {product.condition}
                  </span>
                </div>

                <h2 className="font-serif font-bold text-xl sm:text-2xl text-stone-900 leading-snug">
                  {product.title}
                </h2>
                <p className="font-urdu text-sm text-festiva-burgundy mt-1 font-semibold">
                  {product.titleUrdu}
                </p>

                {/* Host Info */}
                <div className="flex items-center gap-2 mt-3 p-2.5 rounded-xl bg-festiva-blush/60 border border-festiva-sand text-xs">
                  <div className="w-8 h-8 rounded-full bg-festiva-burgundy text-white flex items-center justify-center font-bold text-xs">
                    {product.vendor.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-stone-800 flex items-center gap-1">
                      <span>{product.vendor.name}</span>
                      {product.vendor.verified && (
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      )}
                    </p>
                    <p className="text-[11px] text-stone-500">
                      Located in {product.quettaArea}, Quetta
                    </p>
                  </div>
                </div>

                {/* Live Engagement Stats (Views & Saves) */}
                <div className="flex items-center gap-2.5 text-xs text-stone-500 py-2 border-y border-stone-100 my-2">
                  <span className="flex items-center gap-1.5 text-blue-700 font-bold bg-blue-50 px-2.5 py-0.5 rounded-full">
                    <Eye className="w-3.5 h-3.5 text-blue-600" />
                    <span>{product.viewsCount || 192} Views</span>
                  </span>
                  <span className="flex items-center gap-1.5 text-rose-700 font-bold bg-rose-50 px-2.5 py-0.5 rounded-full">
                    <Heart className="w-3.5 h-3.5 text-rose-600 fill-rose-100" />
                    <span>{product.likesCount || 26} Saves</span>
                  </span>
                  <span className="text-[11px] text-emerald-700 font-bold ml-auto flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Mamas Escrow Safe</span>
                  </span>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs text-stone-600 leading-relaxed">
                {product.description}
              </p>

              {/* Size Selector */}
              {product.sizes && (
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1.5">
                    Select Available Size:
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((s) => (
                      <button
                        key={s}
                        onClick={() => setSelectedSize(s)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                          selectedSize === s
                            ? 'bg-festiva-burgundy text-white border-festiva-burgundy shadow-sm'
                            : 'bg-white text-stone-700 border-stone-200 hover:border-festiva-burgundy'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Strict Purpose Banner: Rent vs Buy */}
              <div 
                className="p-2.5 rounded-xl border text-xs font-bold flex items-center justify-between"
                style={{
                  backgroundColor: isRental ? '#FFFBEB' : '#ECFDF5',
                  borderColor: isRental ? '#FDE68A' : '#A7F3D0',
                  color: isRental ? '#92400E' : '#065F46'
                }}
              >
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-festiva-gold" />
                  <span>
                    {isRental 
                      ? '🔵 Listing Type: Only For Rent (صرف کرائے پر دستیاب)' 
                      : '🟢 Listing Type: Only For Full Purchase (صرف مکمل فروخت)'
                    }
                  </span>
                </span>
                <span className="text-[10px] uppercase font-extrabold tracking-wider bg-white px-2 py-0.5 rounded shadow-sm">
                  {isRental ? 'Rental Item' : 'Full Sale'}
                </span>
              </div>

              {/* RENTAL ENGINE CALCULATOR */}
              {bookingMode === 'rent' && product.rentRate && (
                <div className="bg-gradient-to-br from-[#FAF5F3] to-[#FFF8EE] p-4 rounded-2xl border border-festiva-sand space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-festiva-maroon flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-festiva-gold" />
                      <span>Rental Duration & Rates Calculator</span>
                    </span>
                    <span className="text-[10px] text-stone-500">
                      Original: Rs. {formatPKR(product.originalPrice)}
                    </span>
                  </div>

                  {/* Units Selector (Daily / Hourly / Monthly) */}
                  <div className="grid grid-cols-3 gap-1.5 text-xs">
                    <button
                      onClick={() => { setRentalUnit('daily'); setRentalDuration(1); }}
                      className={`p-2 rounded-xl text-center border font-bold transition-all ${
                        rentalUnit === 'daily'
                          ? 'bg-festiva-burgundy text-white border-festiva-burgundy'
                          : 'bg-white text-stone-700 border-stone-200 hover:border-festiva-burgundy'
                      }`}
                    >
                      <span className="block text-[10px] text-stone-300 font-normal">Daily</span>
                      Rs. {formatPKR(product.rentRate.daily)}
                    </button>

                    <button
                      onClick={() => { setRentalUnit('hourly'); setRentalDuration(4); }}
                      className={`p-2 rounded-xl text-center border font-bold transition-all ${
                        rentalUnit === 'hourly'
                          ? 'bg-festiva-burgundy text-white border-festiva-burgundy'
                          : 'bg-white text-stone-700 border-stone-200 hover:border-festiva-burgundy'
                      }`}
                    >
                      <span className="block text-[10px] text-stone-300 font-normal">Hourly</span>
                      Rs. {formatPKR(product.rentRate.hourly)}
                    </button>

                    <button
                      onClick={() => { setRentalUnit('monthly'); setRentalDuration(1); }}
                      className={`p-2 rounded-xl text-center border font-bold transition-all ${
                        rentalUnit === 'monthly'
                          ? 'bg-festiva-burgundy text-white border-festiva-burgundy'
                          : 'bg-white text-stone-700 border-stone-200 hover:border-festiva-burgundy'
                      }`}
                    >
                      <span className="block text-[10px] text-stone-300 font-normal">Monthly</span>
                      Rs. {formatPKR(product.rentRate.monthly)}
                    </button>
                  </div>

                  {/* Duration Counter & Date */}
                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <div>
                      <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                        Duration ({rentalUnit === 'daily' ? 'Days' : rentalUnit === 'hourly' ? 'Hours' : 'Months'}):
                      </label>
                      <div className="flex items-center bg-white rounded-xl border border-stone-200 overflow-hidden">
                        <button
                          onClick={() => setRentalDuration(Math.max(1, rentalDuration - 1))}
                          className="px-3 py-1.5 text-stone-600 hover:bg-stone-100 font-bold"
                        >
                          -
                        </button>
                        <span className="flex-1 text-center font-bold text-xs text-stone-900">
                          {rentalDuration}
                        </span>
                        <button
                          onClick={() => setRentalDuration(rentalDuration + 1)}
                          className="px-3 py-1.5 text-stone-600 hover:bg-stone-100 font-bold"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                        Event / Start Date:
                      </label>
                      <div className="relative">
                        <input
                          type="date"
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                          className="w-full bg-white border border-stone-200 rounded-xl px-2.5 py-1.5 text-xs font-medium text-stone-800 outline-none focus:border-festiva-burgundy"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Amanat Locker Security Deposit Notice */}
                  <div className="bg-amber-50 border border-amber-200/80 p-2.5 rounded-xl text-[11px] text-amber-900 space-y-1">
                    <div className="flex items-center justify-between font-bold">
                      <span className="flex items-center gap-1 text-amber-900">
                        <Lock className="w-3.5 h-3.5 text-amber-700" />
                        <span>Amanat Locker Security Deposit:</span>
                      </span>
                      <span>Rs. {formatPKR(product.securityDeposit)}</span>
                    </div>
                    <p className="text-[10px] text-amber-800 leading-snug">
                      100% refundable upon safe return inspection without damage.
                    </p>
                  </div>

                </div>
              )}

              {/* Price Summary Breakdown */}
              <div className="bg-stone-50 p-3.5 rounded-2xl border border-stone-200 space-y-2">
                <div className="flex justify-between text-xs text-stone-600">
                  <span>{bookingMode === 'rent' ? `Rental Fee (${rentalDuration} ${rentalUnit})` : 'Purchase Price'}:</span>
                  <span className="font-semibold text-stone-900">
                    Rs. {formatPKR(bookingMode === 'rent' ? rentalTotal : product.price)}
                  </span>
                </div>

                {bookingMode === 'rent' && (
                  <div className="flex justify-between text-xs text-stone-600">
                    <span>Refundable Security Deposit:</span>
                    <span className="font-semibold text-emerald-700">
                      + Rs. {formatPKR(product.securityDeposit)}
                    </span>
                  </div>
                )}

                <div className="border-t border-stone-200 pt-2 flex justify-between items-center text-sm font-bold">
                  <span className="text-festiva-maroon">Grand Total (کل رقم):</span>
                  <span className="text-lg text-festiva-burgundy">
                    Rs. {formatPKR(grandTotal)}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-1">
                <button
                  onClick={handleConfirmAction}
                  className="w-full bg-gradient-to-r from-festiva-burgundy via-festiva-maroon to-festiva-burgundy hover:brightness-110 text-white font-bold py-3 px-4 rounded-2xl shadow-festive transition-all flex items-center justify-center gap-2 transform active:scale-[0.99]"
                >
                  <ShoppingBag className="w-4 h-4 text-festiva-gold" />
                  <span>
                    {bookingMode === 'rent' ? 'Book Rental & Proceed to Checkout' : 'Buy Now & Proceed'}
                  </span>
                </button>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      if (onOpenChatWithProduct) {
                        onOpenChatWithProduct(product);
                        onClose();
                      }
                    }}
                    className={`w-full bg-stone-900 hover:bg-stone-800 text-white font-bold py-2.5 px-3 rounded-2xl transition-all flex items-center justify-center gap-2 text-xs shadow-md border border-festiva-gold/30 hover:border-festiva-gold group ${
                      !product.isOfficial ? 'sm:col-span-2' : ''
                    }`}
                  >
                    <MessageSquare className="w-4 h-4 text-festiva-lightgold group-hover:scale-110 transition-transform" />
                    <span>Chat with Seller (اندرون ایپ چیٹ - Safe & Monitored)</span>
                  </button>

                  {product.isOfficial && (
                    <button
                      onClick={handleWhatsAppInquiry}
                      className="w-full bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold py-2.5 px-3 rounded-2xl transition-all flex items-center justify-center gap-2 text-xs shadow-md"
                    >
                      <WhatsAppIcon className="w-4 h-4 fill-white" />
                      <span>Official WhatsApp: 0307-0816990</span>
                    </button>
                  )}
                </div>
              </div>

            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
