import React, { useState, useEffect } from 'react';
import { 
  X, 
  Sparkles, 
  MapPin, 
  ShieldCheck, 
  Star, 
  Crown, 
  Clock, 
  Calendar, 
  CheckCircle2, 
  Ruler, 
  Play, 
  Video, 
  MessageSquare, 
  PhoneCall,
  ShoppingBag,
  Info,
  Lock,
  Tag,
  ThumbsUp,
  AlertTriangle,
  Camera,
  Send
} from 'lucide-react';
import WhatsAppIcon from './WhatsAppIcon';
import { 
  getReviews, 
  addReview, 
  checkDateConflict, 
  sanitizeInput 
} from '../services/marketplaceService';

export default function ProductDetailModal({
  isOpen,
  onClose,
  product,
  initialMode = 'rent',
  activeUser,
  onAddToCart,
  onOpenChatWithProduct,
  onOpenMakeOffer
}) {
  if (!isOpen || !product) return null;

  const [showVideo, setShowVideo] = useState(false);
  const isRental = product.listingType === 'rent';
  const isBuy = product.listingType === 'buy';

  const [bookingMode, setBookingMode] = useState(
    product.listingType === 'buy' ? 'buy' : initialMode
  );
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || 'Standard');
  
  // Interactive Rental Calendar Date Picker State
  const [rentalUnit, setRentalUnit] = useState('daily'); // 'hourly', 'daily', 'monthly'
  const [startDate, setStartDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState(() => {
    const future = new Date();
    future.setDate(future.getDate() + 3);
    return future.toISOString().split('T')[0];
  });
  const [rentalDuration, setRentalDuration] = useState(2);
  const [dateConflict, setDateConflict] = useState({ hasConflict: false });

  // Tab State: Specs vs Reviews
  const [activeTab, setActiveTab] = useState('specs'); // 'specs', 'reviews'
  const [reviews, setReviews] = useState(() => getReviews(product.id));

  // Review submission state
  const [isWritingReview, setIsWritingReview] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewEvent, setReviewEvent] = useState('Barat');
  const [reviewFitting, setReviewFitting] = useState('Perfect Fit');
  const [reviewPhoto, setReviewPhoto] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState(false);

  // Recalculate duration and conflict when dates change
  useEffect(() => {
    if (bookingMode === 'rent' && startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffTime = end.getTime() - start.getTime();
      const diffDays = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
      setRentalDuration(diffDays);

      const conflict = checkDateConflict(product.id, startDate, endDate);
      setDateConflict(conflict);
    }
  }, [startDate, endDate, bookingMode, product.id]);

  useEffect(() => {
    setReviews(getReviews(product.id));
  }, [product.id]);

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
      text += `Booking Type: Rental (${rentalDuration} days from ${startDate} to ${endDate})\n`;
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
    if (dateConflict.hasConflict) {
      alert(dateConflict.message);
      return;
    }

    const bookingDetails = {
      product,
      bookingMode,
      selectedSize,
      rentalUnit: bookingMode === 'rent' ? rentalUnit : null,
      rentalDuration: bookingMode === 'rent' ? rentalDuration : null,
      startDate: bookingMode === 'rent' ? startDate : null,
      endDate: bookingMode === 'rent' ? endDate : null,
      rentAmount: bookingMode === 'rent' ? rentalTotal : null,
      securityDeposit: bookingMode === 'rent' ? product.securityDeposit : 0,
      totalPrice: grandTotal
    };
    onAddToCart(bookingDetails);
    onClose();
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!reviewComment.trim()) return;

    const newRev = {
      productId: product.id,
      authorName: activeUser?.name || 'Customer from Quetta',
      authorCity: activeUser?.area || `${product.quettaArea}`,
      rating: reviewRating,
      event: reviewEvent,
      fitting: reviewFitting,
      comment: sanitizeInput(reviewComment),
      photo: reviewPhoto || null
    };

    const updated = addReview(newRev);
    setReviews(updated.filter(r => r.productId === product.id));
    setReviewSuccess(true);
    setReviewComment('');
    setReviewPhoto('');
    setTimeout(() => {
      setIsWritingReview(false);
      setReviewSuccess(false);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-t-[28px] sm:rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl border-t sm:border border-festiva-sand max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-4 sm:px-5 py-3 sm:py-3.5 border-b border-festiva-sand bg-festiva-blush/60">
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
        <div className="overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-6 pb-12 sm:pb-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            
            {/* Left Column: Image Gallery, Video Showcase & Tabs */}
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
                      className="absolute top-3 right-3 bg-white/80 hover:bg-white text-stone-800 p-1.5 rounded-full shadow-md z-10 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <>
                    <img
                      src={product.images[activeImageIndex] || product.images[0]}
                      alt={product.title}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    />

                    {/* Badge Overlays */}
                    <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                      {product.isOfficial ? (
                        <span className="bg-festiva-maroon text-festiva-lightgold font-serif font-bold text-xs px-3 py-1 rounded-full shadow-md border border-festiva-gold/40 flex items-center gap-1">
                          <Crown className="w-3.5 h-3.5 text-festiva-gold" />
                          <span>Official Mamas Collection</span>
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

              {/* Detail Tabs Selector: Specs vs Customer Reviews */}
              <div className="flex border-b border-stone-200 pt-2 gap-2 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setActiveTab('specs')}
                  className={`pb-2 px-3 border-b-2 transition-all ${
                    activeTab === 'specs'
                      ? 'border-festiva-burgundy text-festiva-burgundy'
                      : 'border-transparent text-stone-500 hover:text-stone-800'
                  }`}
                >
                  Specs & Measurements
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('reviews')}
                  className={`pb-2 px-3 border-b-2 transition-all flex items-center gap-1 ${
                    activeTab === 'reviews'
                      ? 'border-festiva-burgundy text-festiva-burgundy'
                      : 'border-transparent text-stone-500 hover:text-stone-800'
                  }`}
                >
                  <Star className="w-3.5 h-3.5 fill-festiva-gold text-festiva-gold" />
                  <span>Customer Reviews ({reviews.length})</span>
                </button>
              </div>

              {/* TAB CONTENT: SPECS & MEASUREMENTS */}
              {activeTab === 'specs' && product.measurements && (
                <div className="bg-[#FAF5F3] p-4 rounded-2xl border border-festiva-sand space-y-2">
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

              {/* TAB CONTENT: REAL CUSTOMER REVIEWS */}
              {activeTab === 'reviews' && (
                <div className="bg-[#FAF5F3] p-4 rounded-2xl border border-festiva-sand space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                      <span className="font-bold text-xs text-stone-900">
                        {product.rating || '5.0'} / 5.0 Rating
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => setIsWritingReview(!isWritingReview)}
                      className="text-xs font-bold text-festiva-burgundy hover:underline"
                    >
                      {isWritingReview ? 'Cancel' : '+ Write a Review'}
                    </button>
                  </div>

                  {/* Review Submission Form */}
                  {isWritingReview && (
                    <form onSubmit={handleReviewSubmit} className="bg-white p-3.5 rounded-xl border border-stone-200 space-y-2.5">
                      {reviewSuccess && (
                        <div className="p-2 bg-emerald-50 text-emerald-800 text-xs rounded-lg font-bold">
                          ✓ Review Submitted Successfully!
                        </div>
                      )}

                      <div>
                        <label className="block text-[10px] font-bold text-stone-600 mb-1">Star Rating:</label>
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                              key={s}
                              onClick={() => setReviewRating(s)}
                              className={`w-5 h-5 cursor-pointer transition-transform hover:scale-110 ${
                                s <= reviewRating ? 'fill-amber-400 text-amber-400' : 'text-stone-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[10px] font-bold text-stone-600 mb-0.5">Event:</label>
                          <select
                            value={reviewEvent}
                            onChange={(e) => setReviewEvent(e.target.value)}
                            className="w-full text-xs border border-stone-200 rounded-lg p-1.5 outline-none"
                          >
                            <option value="Barat">Barat</option>
                            <option value="Valima">Valima</option>
                            <option value="Mehndi">Mehndi</option>
                            <option value="Party">Party</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-stone-600 mb-0.5">Fitting:</label>
                          <select
                            value={reviewFitting}
                            onChange={(e) => setReviewFitting(e.target.value)}
                            className="w-full text-xs border border-stone-200 rounded-lg p-1.5 outline-none"
                          >
                            <option value="Perfect Fit">Perfect Fit</option>
                            <option value="True to Size">True to Size</option>
                            <option value="Slightly Tight">Slightly Tight</option>
                            <option value="Loose / Altered">Loose / Altered</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-stone-600 mb-0.5">Your Feedback:</label>
                        <textarea
                          rows="2"
                          placeholder="Shadi par kaisa laga? Fabric, quality, aur fitting kaisa tha?"
                          value={reviewComment}
                          onChange={(e) => setReviewComment(e.target.value)}
                          className="w-full text-xs border border-stone-200 rounded-lg p-2 outline-none"
                          required
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-festiva-burgundy text-white font-bold py-1.5 rounded-lg text-xs"
                      >
                        Submit Verified Review
                      </button>
                    </form>
                  )}

                  {/* Reviews List */}
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {reviews.map((r) => (
                      <div key={r.id} className="bg-white p-3 rounded-xl border border-stone-200 space-y-1.5 text-xs">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5 font-bold text-stone-900">
                            <span>{r.authorName}</span>
                            <span className="text-[10px] bg-emerald-50 text-emerald-700 px-1.5 py-0.2 rounded font-semibold border border-emerald-200">
                              ✓ Verified
                            </span>
                          </div>
                          <div className="flex items-center text-amber-500">
                            {[...Array(r.rating || 5)].map((_, i) => (
                              <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                            ))}
                          </div>
                        </div>

                        <p className="text-stone-700 text-[11px] leading-relaxed">
                          "{r.comment}"
                        </p>

                        <div className="flex items-center justify-between text-[10px] text-stone-400 pt-1 border-t border-stone-100">
                          <span>{r.authorCity} &bull; {r.event}</span>
                          <span className="text-emerald-700 font-semibold">{r.fitting}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>

            {/* Right Column: Pricing, Dates Calendar, Bargain & Actions */}
            <div className="md:col-span-6 space-y-4">
              
              <div>
                <h1 className="font-serif font-bold text-xl sm:text-2xl text-stone-900 leading-tight">
                  {product.title}
                </h1>
                {product.titleUrdu && (
                  <p className="text-sm font-serif text-festiva-burgundy mt-1 font-semibold">
                    {product.titleUrdu}
                  </p>
                )}
                
                <div className="flex items-center gap-2 mt-2 text-xs text-stone-600">
                  <div className="flex items-center gap-1 text-festiva-gold font-bold">
                    <Star className="w-4 h-4 fill-festiva-gold text-festiva-gold" />
                    <span>{product.rating}</span>
                  </div>
                  <span>&bull;</span>
                  <span>{reviews.length} Verified Reviews</span>
                  <span>&bull;</span>
                  <span className="text-stone-400">Condition: <b>{product.condition || 'Pre-loved'}</b></span>
                </div>
              </div>

              {/* Vendor / Seller Box */}
              <div className="bg-festiva-blush/60 p-3 rounded-2xl border border-festiva-sand flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-stone-400 block uppercase font-bold">Item Hosted By:</span>
                  <span className="font-serif font-bold text-festiva-maroon text-sm">
                    {product.vendor.name}
                  </span>
                  <p className="text-[11px] text-stone-500">
                    Location: {product.quettaArea}, Quetta
                  </p>
                </div>
                {product.vendor.verified && (
                  <span className="text-emerald-700 font-semibold text-xs flex items-center gap-1 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Verified</span>
                  </span>
                )}
              </div>

              {/* Single Mode Notice (Only Rent vs Only Buy) */}
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-festiva-blush/40 border border-festiva-sand text-xs font-bold text-stone-800">
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

              {/* RENTAL ENGINE & INTERACTIVE CALENDAR */}
              {bookingMode === 'rent' && product.rentRate && (
                <div className="bg-gradient-to-br from-[#FAF5F3] to-[#FFF8EE] p-4 rounded-2xl border border-festiva-sand space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-festiva-maroon flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-festiva-gold" />
                      <span>Live Rental Calendar Booking</span>
                    </span>
                    <span className="text-[10px] text-stone-500">
                      Rate: Rs. {formatPKR(product.rentRate.daily)} / day
                    </span>
                  </div>

                  {/* Date Conflict Alert Banner */}
                  {dateConflict.hasConflict && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-bold flex items-center gap-2 animate-shake">
                      <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0" />
                      <span>{dateConflict.message}</span>
                    </div>
                  )}

                  {/* Interactive Date Range Picker */}
                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <div>
                      <label className="block text-[11px] font-bold text-stone-700 mb-1">
                        Event Start Date:
                      </label>
                      <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full bg-white border border-stone-200 rounded-xl px-2.5 py-1.5 text-xs font-medium text-stone-800 outline-none focus:border-festiva-burgundy"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-stone-700 mb-1">
                        Return Date:
                      </label>
                      <input
                        type="date"
                        value={endDate}
                        min={startDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-full bg-white border border-stone-200 rounded-xl px-2.5 py-1.5 text-xs font-medium text-stone-800 outline-none focus:border-festiva-burgundy"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs bg-white/70 p-2 rounded-xl border border-stone-200">
                    <span className="text-stone-600 font-medium">
                      Calculated Rental Period:
                    </span>
                    <span className="font-bold text-festiva-burgundy">
                      {rentalDuration} Day(s) &bull; Rs. {formatPKR(rentalTotal)}
                    </span>
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
                  <span>{bookingMode === 'rent' ? `Rental Fee (${rentalDuration} Days)` : 'Purchase Price'}:</span>
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

              {/* Action Buttons: Book Now, Make an Offer, Chat */}
              <div className="space-y-2 pt-1">
                
                {/* Book / Checkout Button */}
                <button
                  onClick={handleConfirmAction}
                  disabled={dateConflict.hasConflict}
                  className="w-full bg-gradient-to-r from-festiva-burgundy via-festiva-maroon to-festiva-burgundy hover:brightness-110 text-white font-bold py-3 px-4 rounded-2xl shadow-festive transition-all flex items-center justify-center gap-2 transform active:scale-[0.99] disabled:opacity-50"
                >
                  <ShoppingBag className="w-4 h-4 text-festiva-gold" />
                  <span>
                    {bookingMode === 'rent' ? 'Book Rental & Proceed to Checkout' : 'Buy Now & Proceed'}
                  </span>
                </button>

                {/* Second Row: Make an Offer (OLX Bargaining) & Chat with Seller */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  
                  {/* Make an Offer Button */}
                  <button
                    onClick={() => {
                      if (onOpenMakeOffer) {
                        onOpenMakeOffer(product);
                      }
                    }}
                    className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold py-2.5 px-3 rounded-2xl transition-all flex items-center justify-center gap-1.5 text-xs shadow-md border border-amber-400 active:scale-95"
                  >
                    <Tag className="w-4 h-4 text-white" />
                    <span>Make an Offer (قیمت طے کریں)</span>
                  </button>

                  {/* Chat With Seller Button */}
                  <button
                    onClick={() => {
                      if (onOpenChatWithProduct) {
                        onOpenChatWithProduct(product);
                        onClose();
                      }
                    }}
                    className="w-full bg-stone-900 hover:bg-stone-800 text-white font-bold py-2.5 px-3 rounded-2xl transition-all flex items-center justify-center gap-1.5 text-xs shadow-md border border-festiva-gold/30 hover:border-festiva-gold group"
                  >
                    <MessageSquare className="w-4 h-4 text-festiva-lightgold group-hover:scale-110 transition-transform" />
                    <span>In-App Chat (محفوظ چیٹ)</span>
                  </button>

                </div>

                {/* Official WhatsApp Button if Official Store */}
                {product.isOfficial && (
                  <button
                    onClick={handleWhatsAppInquiry}
                    className="w-full bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold py-2.5 px-3 rounded-2xl transition-all flex items-center justify-center gap-2 text-xs shadow-md"
                  >
                    <WhatsAppIcon className="w-4 h-4 fill-white" />
                    <span>Official WhatsApp Inquiry: 0307-0816990</span>
                  </button>
                )}

              </div>

            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
