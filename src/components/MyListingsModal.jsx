import React, { useState } from 'react';
import { 
  X, 
  Store, 
  Eye, 
  Heart, 
  MessageSquare, 
  Sparkles, 
  PlusCircle, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Trash2, 
  ShieldCheck, 
  Tag, 
  Calendar,
  Layers
} from 'lucide-react';

export default function MyListingsModal({
  isOpen,
  onClose,
  activeUser,
  products,
  onUpdateProduct,
  onDeleteProduct,
  onOpenPostAd
}) {
  if (!isOpen || !activeUser) return null;

  // Filter ads owned by active user (match by vendor name or phone, or default user zarghoon)
  const myAds = products.filter(p => {
    if (activeUser.id === 'user_zarghoon') {
      return p.vendor?.name?.toLowerCase().includes('zarghoon') || !p.isOfficial;
    }
    return p.vendor?.phone === activeUser.phone || p.vendor?.name === activeUser.name;
  });

  // Calculate live aggregate stats
  const totalViews = myAds.reduce((acc, a) => acc + (a.viewsCount || 142), 0);
  const totalLikes = myAds.reduce((acc, a) => acc + (a.likesCount || 18), 0);
  const totalInquiries = myAds.reduce((acc, a) => acc + (a.inquiriesCount || 5), 0);

  const formatPKR = (num) => Number(num || 0).toLocaleString('en-PK');

  const handleToggleRentalStatus = (ad) => {
    const isRented = ad.status === 'Rented Out';
    onUpdateProduct({
      ...ad,
      status: isRented ? 'Active' : 'Rented Out',
      inStock: isRented
    });
  };

  const handleToggleSoldStatus = (ad) => {
    const isSold = ad.status === 'Sold';
    onUpdateProduct({
      ...ad,
      status: isSold ? 'Active' : 'Sold',
      inStock: isSold
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div 
        className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] shadow-2xl flex flex-col overflow-hidden border border-festiva-gold/30 animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#4A0B16] via-[#6B1222] to-[#4A0B16] text-white p-5 flex items-center justify-between border-b border-festiva-gold/30">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-festiva-gold/20 border border-festiva-gold/40 flex items-center justify-center text-festiva-gold shadow-sm font-serif font-bold text-xl">
              {activeUser.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif font-bold text-lg sm:text-xl text-white">
                  {activeUser.name} &bull; My Ads Studio
                </h2>
                <span className="flex items-center gap-1 text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">
                  <ShieldCheck className="w-3 h-3" />
                  <span>Verified Quetta Seller</span>
                </span>
              </div>
              <p className="text-xs text-white/80">
                Phone: {activeUser.phone} &bull; {activeUser.area}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onOpenPostAd();
              }}
              className="bg-festiva-gold hover:bg-festiva-lightgold text-festiva-maroon font-bold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5 shadow-md transition-all active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              <span className="hidden sm:inline">Post New Ad</span>
            </button>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Aggregate KPI Summary Bar */}
        <div className="bg-festiva-cream/50 p-4 border-b border-stone-200 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="bg-white p-2.5 rounded-xl border border-stone-200 shadow-sm">
            <span className="text-[10px] uppercase font-bold text-stone-500 block">Total Ads</span>
            <span className="text-lg font-serif font-bold text-festiva-burgundy">{myAds.length}</span>
          </div>
          <div className="bg-white p-2.5 rounded-xl border border-stone-200 shadow-sm">
            <span className="text-[10px] uppercase font-bold text-stone-500 flex items-center justify-center gap-1">
              <Eye className="w-3 h-3 text-blue-600" />
              <span>Total Views</span>
            </span>
            <span className="text-lg font-serif font-bold text-blue-800">{totalViews}</span>
          </div>
          <div className="bg-white p-2.5 rounded-xl border border-stone-200 shadow-sm">
            <span className="text-[10px] uppercase font-bold text-stone-500 flex items-center justify-center gap-1">
              <Heart className="w-3 h-3 text-rose-600" />
              <span>Reactions</span>
            </span>
            <span className="text-lg font-serif font-bold text-rose-800">{totalLikes}</span>
          </div>
          <div className="bg-white p-2.5 rounded-xl border border-stone-200 shadow-sm">
            <span className="text-[10px] uppercase font-bold text-stone-500 flex items-center justify-center gap-1">
              <MessageSquare className="w-3 h-3 text-emerald-600" />
              <span>Inquiries</span>
            </span>
            <span className="text-lg font-serif font-bold text-emerald-800">{totalInquiries}</span>
          </div>
        </div>

        {/* Listings Container */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#FAF5F3]/50">
          {myAds.length === 0 ? (
            <div className="text-center py-16 px-4 space-y-3">
              <div className="w-16 h-16 rounded-full bg-festiva-cream border border-festiva-gold/30 mx-auto flex items-center justify-center text-festiva-burgundy">
                <Store className="w-8 h-8 opacity-60" />
              </div>
              <h3 className="font-serif font-bold text-base text-stone-800">
                Aapki abhi koi active listing nahi hai
              </h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                Apna bridal dress, formal suit, jewellery set ya wedding car Quetta ke hazaron buyers aur renters ke liye post karein!
              </p>
              <button
                onClick={() => {
                  onClose();
                  onOpenPostAd();
                }}
                className="bg-festiva-burgundy hover:bg-festiva-maroon text-white font-bold px-5 py-2.5 rounded-xl text-xs inline-flex items-center gap-2 shadow-md"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Post Your First Item (Rent or Sale)</span>
              </button>
            </div>
          ) : (
            myAds.map((ad) => {
              const views = ad.viewsCount || 165;
              const likes = ad.likesCount || 22;
              const inquiries = ad.inquiriesCount || 7;
              const isRented = ad.status === 'Rented Out';
              const isSold = ad.status === 'Sold';
              const isRentOnly = ad.listingType === 'rent';

              return (
                <div
                  key={ad.id}
                  className="bg-white border border-stone-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={ad.images?.[0] || 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=300'}
                        alt=""
                        className="w-16 h-20 rounded-xl object-cover border border-stone-200 flex-shrink-0"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[10px] text-stone-400 font-bold">{ad.id}</span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            isRentOnly 
                              ? 'bg-amber-100 text-amber-900 border border-amber-300' 
                              : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                          }`}>
                            {isRentOnly ? '🔵 Only For Rent' : '🟢 Only For Sale'}
                          </span>

                          {isRented && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800">
                              🔒 Rented Out
                            </span>
                          )}
                          {isSold && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-stone-200 text-stone-800">
                              ✓ Sold
                            </span>
                          )}
                        </div>

                        <h4 className="font-bold text-sm text-stone-900 mt-1 line-clamp-1">{ad.title}</h4>
                        
                        <div className="flex items-center gap-2 text-xs font-serif font-bold text-festiva-burgundy mt-0.5">
                          <span>
                            {isRentOnly 
                              ? `Rs. ${formatPKR(ad.rentRate?.daily)} / day` 
                              : `Rs. ${formatPKR(ad.price)}`
                            }
                          </span>
                          {isRentOnly && ad.securityDeposit && (
                            <span className="text-[10px] font-sans font-normal text-stone-500">
                              (Security: Rs. {formatPKR(ad.securityDeposit)})
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* OLX-Style Live Ad Engagement Metrics */}
                    <div className="flex items-center gap-4 bg-stone-50 px-3.5 py-2 rounded-xl border border-stone-200 self-start sm:self-center">
                      <div className="flex items-center gap-1.5 text-xs text-blue-700 font-bold" title="People who viewed your ad">
                        <Eye className="w-4 h-4 text-blue-600" />
                        <span>{views} <span className="font-normal text-stone-500 text-[10px]">views</span></span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-rose-700 font-bold" title="People who favorited your ad">
                        <Heart className="w-4 h-4 text-rose-600 fill-rose-100" />
                        <span>{likes} <span className="font-normal text-stone-500 text-[10px]">saves</span></span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-bold" title="Chats initiated">
                        <MessageSquare className="w-4 h-4 text-emerald-600" />
                        <span>{inquiries} <span className="font-normal text-stone-500 text-[10px]">chats</span></span>
                      </div>
                    </div>
                  </div>

                  {/* Operational Action Controls */}
                  <div className="pt-2 border-t border-stone-100 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      {isRentOnly ? (
                        <button
                          onClick={() => handleToggleRentalStatus(ad)}
                          className={`text-xs font-bold px-3 py-1 rounded-xl transition-all ${
                            isRented 
                              ? 'bg-emerald-600 hover:bg-emerald-700 text-white' 
                              : 'bg-stone-100 hover:bg-stone-200 text-stone-800'
                          }`}
                        >
                          {isRented ? '✓ Mark Available (واپس دستیاب کریں)' : 'Mark as Rented (کرائے پر دے دیا)'}
                        </button>
                      ) : (
                        <button
                          onClick={() => handleToggleSoldStatus(ad)}
                          className={`text-xs font-bold px-3 py-1 rounded-xl transition-all ${
                            isSold 
                              ? 'bg-emerald-600 hover:bg-emerald-700 text-white' 
                              : 'bg-stone-100 hover:bg-stone-200 text-stone-800'
                          }`}
                        >
                          {isSold ? '✓ Re-list Item' : 'Mark as Sold (فروخت ہو گیا)'}
                        </button>
                      )}
                    </div>

                    <button
                      onClick={() => onDeleteProduct(ad.id)}
                      className="text-red-500 hover:text-red-700 text-xs font-bold flex items-center gap-1 p-1 hover:bg-red-50 rounded-lg transition-colors"
                      title="Permanently Delete Ad"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete Ad</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
