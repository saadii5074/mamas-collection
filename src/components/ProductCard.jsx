import React from 'react';
import { 
  Sparkles, 
  MapPin, 
  ShieldCheck, 
  Star, 
  MessageCircle, 
  Clock, 
  ShoppingBag,
  Store,
  Layers,
  ChevronRight,
  Eye,
  Heart,
  MessageSquare
} from 'lucide-react';
import WhatsAppIcon from './WhatsAppIcon';

export default function ProductCard({ product, onSelectProduct, onQuickRent, onQuickBuy }) {
  const isRentalAvailable = product.listingType === 'rent' || product.listingType === 'both';
  const isBuyAvailable = product.listingType === 'buy' || product.listingType === 'both';

  const formatPKR = (num) => {
    return Number(num).toLocaleString('en-PK');
  };

  const handleWhatsApp = (e) => {
    e.stopPropagation();
    if (product.isOfficial) {
      const phone = '03070816990';
      const message = encodeURIComponent(
        `Hello Mamas Collection Quetta! I am interested in official item "${product.title}" (${product.id}).`
      );
      window.open(`https://wa.me/92${phone}?text=${message}`, '_blank');
    } else {
      onSelectProduct(product);
    }
  };

  return (
    <div 
      onClick={() => onSelectProduct(product)}
      className="group bg-white rounded-2xl overflow-hidden border border-festiva-sand hover:border-festiva-gold/60 shadow-sm hover:shadow-festive transition-all duration-300 flex flex-col cursor-pointer"
    >
      {/* Image Container with Badges */}
      <div className="relative aspect-[3/4] bg-festiva-sand overflow-hidden">
        <img
          src={product.images[0]}
          alt={product.title}
          className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
          loading="lazy"
        />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-start justify-between gap-1.5 pointer-events-none">
          <div className="flex flex-col gap-1 items-start">
            {product.isOfficial ? (
              <span className="bg-gradient-to-r from-festiva-maroon to-festiva-burgundy text-festiva-lightgold font-bold text-[10px] px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1 border border-festiva-gold/40">
                <Sparkles className="w-2.5 h-2.5 text-festiva-gold" />
                <span>Mamas Official</span>
              </span>
            ) : (
              <span className="bg-stone-900/80 backdrop-blur-md text-white font-semibold text-[10px] px-2 py-0.5 rounded-full shadow-sm flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                <span>Verified Peer Host</span>
              </span>
            )}

            <span className="bg-white/90 backdrop-blur-md text-festiva-burgundy font-bold text-[9px] px-2 py-0.5 rounded shadow-sm uppercase tracking-wider">
              {product.eventType}
            </span>
          </div>

          <span className="bg-black/60 backdrop-blur-md text-white font-medium text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1">
            <MapPin className="w-2.5 h-2.5 text-festiva-gold" />
            <span>{product.quettaArea}</span>
          </span>
        </div>

        {/* Color Swatch & OLX-Style Engagement Counters */}
        <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1.5 pointer-events-none">
          {product.color && (
            <div 
              className="w-3.5 h-3.5 rounded-full border border-white shadow-md"
              style={{ backgroundColor: product.color.hex }}
              title={`Color: ${product.color.name}`}
            />
          )}
          <span className="bg-black/65 backdrop-blur-md text-white text-[9px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
            <Eye className="w-2.5 h-2.5 text-festiva-gold" />
            <span>{product.viewsCount || 38}</span>
          </span>
          <span className="bg-black/65 backdrop-blur-md text-white text-[9px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
            <Heart className="w-2.5 h-2.5 text-rose-400 fill-rose-400" />
            <span>{product.likesCount || 6}</span>
          </span>
        </div>

        {/* Action Button on Card Corner */}
        {product.isOfficial ? (
          <button
            onClick={handleWhatsApp}
            title="Official WhatsApp Support"
            className="absolute bottom-2.5 right-2.5 w-8 h-8 rounded-full bg-[#25D366] hover:bg-[#1EBE5D] text-white flex items-center justify-center shadow-lg transform hover:scale-110 active:scale-95 transition-all border border-white/30"
          >
            <WhatsAppIcon className="w-4 h-4 fill-white" />
          </button>
        ) : (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelectProduct(product);
            }}
            title="Chat Safely with Host (Monitored)"
            className="absolute bottom-2.5 right-2.5 w-8 h-8 rounded-full bg-stone-900/90 hover:bg-stone-900 text-festiva-lightgold flex items-center justify-center shadow-lg transform hover:scale-110 active:scale-95 transition-all border border-festiva-gold/40"
          >
            <MessageSquare className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Card Content */}
      <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Rating & Condition */}
          <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
            <div className="flex items-center gap-1 text-amber-500 font-semibold text-[11px]">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{product.rating}</span>
              <span className="text-stone-400 font-normal">({product.reviewsCount})</span>
            </div>
            <span className="text-[10px] text-stone-500 bg-stone-100 px-1.5 py-0.5 rounded font-medium">
              {product.condition}
            </span>
          </div>

          {/* Title */}
          <h3 className="font-serif font-bold text-sm sm:text-base text-stone-900 line-clamp-1 group-hover:text-festiva-burgundy transition-colors">
            {product.title}
          </h3>
          <p className="text-[11px] text-festiva-burgundy/80 font-medium font-urdu line-clamp-1 mt-0.5">
            {product.titleUrdu}
          </p>

          {/* Sizes Tag */}
          {product.sizes && (
            <div className="flex items-center gap-1 mt-2 overflow-hidden">
              <span className="text-[10px] text-stone-400">Sizes:</span>
              <div className="flex items-center gap-1">
                {product.sizes.map((s) => (
                  <span key={s} className="text-[9px] font-semibold bg-festiva-blush text-stone-700 border border-festiva-sand px-1.5 py-0.5 rounded">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Price & Rental Rate Display */}
        <div className="pt-2 border-t border-stone-100 space-y-2">
          
          {isRentalAvailable && product.rentRate && (
            <div className="bg-[#FAF5F3] p-2 rounded-xl border border-festiva-sand/70">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-festiva-maroon flex items-center gap-1">
                  <Clock className="w-3 h-3 text-festiva-gold" />
                  <span>Rent / کرایہ</span>
                </span>
                <span className="text-xs font-bold text-festiva-burgundy">
                  Rs. {formatPKR(product.rentRate.daily)} <span className="text-[10px] font-normal text-stone-500">/ day</span>
                </span>
              </div>
              <div className="flex items-center justify-between text-[10px] text-stone-500 mt-0.5">
                <span>Security: Rs. {formatPKR(product.securityDeposit)}</span>
                <span>Orig: Rs. {formatPKR(product.originalPrice)}</span>
              </div>
            </div>
          )}

          {isBuyAvailable && (
            <div className="flex items-center justify-between text-xs px-1">
              <span className="text-[10px] text-stone-500 font-medium">Direct Sale Price:</span>
              <span className="font-bold text-stone-900 text-sm">
                Rs. {formatPKR(product.price)}
              </span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center gap-2 pt-1">
            {isRentalAvailable ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onQuickRent(product);
                }}
                className="flex-1 bg-festiva-burgundy hover:bg-festiva-maroon text-white text-xs font-bold py-2 rounded-xl transition-all shadow-sm flex items-center justify-center gap-1"
              >
                <Sparkles className="w-3 h-3 text-festiva-gold" />
                <span>Book Rental</span>
              </button>
            ) : (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onQuickBuy(product);
                }}
                className="flex-1 bg-stone-900 hover:bg-festiva-maroon text-white text-xs font-bold py-2 rounded-xl transition-all shadow-sm flex items-center justify-center gap-1"
              >
                <ShoppingBag className="w-3 h-3 text-festiva-gold" />
                <span>Buy Now</span>
              </button>
            )}

            <button
              onClick={(e) => {
                e.stopPropagation();
                onSelectProduct(product);
              }}
              className="p-2 rounded-xl bg-festiva-blush hover:bg-festiva-sand border border-festiva-sand text-festiva-burgundy transition-all"
              title="View Full Details & Measurements"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
