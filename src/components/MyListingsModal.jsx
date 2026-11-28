import React, { useState, useEffect } from 'react';
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
  Layers,
  Wallet,
  ArrowDownCircle,
  Percent,
  Check,
  AlertCircle
} from 'lucide-react';
import { 
  getOffers, 
  updateOfferStatus, 
  getSellerWallet, 
  requestWithdrawal,
  sanitizeInput
} from '../services/marketplaceService';

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

  const [activeTab, setActiveTab] = useState('ads'); // 'ads', 'offers', 'wallet'
  const [offers, setOffers] = useState(() => getOffers());
  const [wallet, setWallet] = useState(() => getSellerWallet(activeUser.phone || activeUser.name));

  // Counter offer state
  const [counteringOfferId, setCounteringOfferId] = useState(null);
  const [counterPriceInput, setCounterPriceInput] = useState('');

  // Withdrawal modal state
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawMethod, setWithdrawMethod] = useState('Easypaisa');
  const [accountTitle, setAccountTitle] = useState(activeUser.name || '');
  const [accountNumber, setAccountNumber] = useState(activeUser.phone || '');
  const [withdrawSuccessMsg, setWithdrawSuccessMsg] = useState('');
  const [withdrawError, setWithdrawError] = useState('');

  // Refresh offers and wallet when activeUser or tab changes
  useEffect(() => {
    setOffers(getOffers());
    setWallet(getSellerWallet(activeUser.phone || activeUser.name));
  }, [activeUser, activeTab]);

  // Filter ads owned by active user (match by vendor name or phone, or default user zarghoon)
  const myAds = products.filter(p => {
    if (activeUser.id === 'user_zarghoon') {
      return p.vendor?.name?.toLowerCase().includes('zarghoon') || !p.isOfficial;
    }
    return p.vendor?.phone === activeUser.phone || p.vendor?.name === activeUser.name;
  });

  // Filter received offers for this seller
  const myReceivedOffers = offers.filter(o => {
    if (activeUser.id === 'user_zarghoon') {
      return o.sellerPhone === '0307-8899112' || o.sellerName?.toLowerCase().includes('zarghoon');
    }
    return o.sellerPhone === activeUser.phone || o.sellerName === activeUser.name;
  });

  const pendingOffersCount = myReceivedOffers.filter(o => o.status === 'pending').length;

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

  const handleAcceptOffer = (offerId) => {
    const updated = updateOfferStatus(offerId, 'accepted');
    setOffers(updated);
  };

  const handleRejectOffer = (offerId) => {
    const updated = updateOfferStatus(offerId, 'rejected');
    setOffers(updated);
  };

  const handleSendCounterOffer = (offerId) => {
    if (!counterPriceInput || Number(counterPriceInput) <= 0) return;
    const updated = updateOfferStatus(offerId, 'countered', counterPriceInput);
    setOffers(updated);
    setCounteringOfferId(null);
    setCounterPriceInput('');
  };

  const handleWithdrawSubmit = (e) => {
    e.preventDefault();
    setWithdrawError('');
    setWithdrawSuccessMsg('');

    const amt = Number(withdrawAmount);
    if (!amt || amt <= 0) {
      setWithdrawError('Please enter a valid withdrawal amount.');
      return;
    }

    const res = requestWithdrawal(
      activeUser.phone || activeUser.name,
      amt,
      withdrawMethod,
      sanitizeInput(accountTitle),
      sanitizeInput(accountNumber)
    );

    if (res.success) {
      setWithdrawSuccessMsg(`Withdrawal of Rs. ${formatPKR(amt)} requested successfully via ${withdrawMethod}!`);
      setWallet(getSellerWallet(activeUser.phone || activeUser.name));
      setWithdrawAmount('');
      setTimeout(() => {
        setIsWithdrawOpen(false);
        setWithdrawSuccessMsg('');
      }, 2500);
    } else {
      setWithdrawError(res.error || 'Failed to process withdrawal.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div 
        className="bg-white rounded-t-[28px] sm:rounded-3xl max-w-3xl w-full max-h-[92vh] sm:max-h-[90vh] shadow-2xl flex flex-col overflow-hidden border border-festiva-gold/30 animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#4A0B16] via-[#6B1222] to-[#4A0B16] text-white p-4 sm:p-5 flex items-center justify-between border-b border-festiva-gold/30">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-festiva-gold/20 border border-festiva-gold/40 flex items-center justify-center text-festiva-gold shadow-sm font-serif font-bold text-lg sm:text-xl">
              {activeUser.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif font-bold text-base sm:text-xl text-white truncate max-w-[200px] sm:max-w-none">
                  {activeUser.name} &bull; Seller Studio
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

        {/* Studio Tabs Navigation */}
        <div className="flex border-b border-stone-200 bg-festiva-blush/40 px-4 pt-2 gap-2 text-xs font-bold">
          <button
            onClick={() => setActiveTab('ads')}
            className={`pb-2.5 px-3 border-b-2 flex items-center gap-2 transition-all ${
              activeTab === 'ads'
                ? 'border-festiva-burgundy text-festiva-burgundy'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Store className="w-4 h-4" />
            <span>My Active Ads ({myAds.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('offers')}
            className={`pb-2.5 px-3 border-b-2 flex items-center gap-2 transition-all relative ${
              activeTab === 'offers'
                ? 'border-festiva-burgundy text-festiva-burgundy'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Tag className="w-4 h-4" />
            <span>Received Offers ({myReceivedOffers.length})</span>
            {pendingOffersCount > 0 && (
              <span className="w-2 h-2 rounded-full bg-rose-600 animate-ping absolute top-2 right-1" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('wallet')}
            className={`pb-2.5 px-3 border-b-2 flex items-center gap-2 transition-all ${
              activeTab === 'wallet'
                ? 'border-festiva-burgundy text-festiva-burgundy'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Wallet className="w-4 h-4" />
            <span>Escrow Amanat Wallet (والیٹ)</span>
          </button>
        </div>

        {/* TAB 1: ADS CONTAINER */}
        {activeTab === 'ads' && (
          <div className="flex-1 flex flex-col overflow-hidden">
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

            {/* Listings Scrollable Container */}
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
                    Apna bridal lehenga, sherwani, ya jewellery Quetta mein rent ya sell karne ke liye button dabayein.
                  </p>
                  <button
                    onClick={() => {
                      onClose();
                      onOpenPostAd();
                    }}
                    className="inline-flex items-center gap-2 bg-festiva-burgundy text-white font-bold px-4 py-2 rounded-xl text-xs shadow-festive hover:brightness-110"
                  >
                    <PlusCircle className="w-4 h-4 text-festiva-gold" />
                    <span>Post Your First Item</span>
                  </button>
                </div>
              ) : (
                myAds.map((ad) => {
                  const isRentOnly = ad.listingType === 'rent';
                  const isRented = ad.status === 'Rented Out';
                  const isSold = ad.status === 'Sold';

                  return (
                    <div 
                      key={ad.id}
                      className="bg-white rounded-2xl p-3.5 sm:p-4 border border-stone-200 shadow-sm hover:border-festiva-gold/60 transition-all space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <img 
                            src={ad.images?.[0] || 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?q=80&w=200'} 
                            alt={ad.title} 
                            className="w-16 h-20 rounded-xl object-cover border border-stone-200 flex-shrink-0"
                          />
                          <div>
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-festiva-blush text-festiva-maroon border border-festiva-sand">
                                {ad.category}
                              </span>
                              {isRented && (
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                                  ⏳ Rented Out
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
                            <span>{ad.viewsCount || 142} <span className="font-normal text-stone-500 text-[10px]">views</span></span>
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-rose-700 font-bold" title="People who favorited your ad">
                            <Heart className="w-4 h-4 text-rose-600 fill-rose-100" />
                            <span>{ad.likesCount || 18} <span className="font-normal text-stone-500 text-[10px]">saves</span></span>
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-bold" title="Chats initiated">
                            <MessageSquare className="w-4 h-4 text-emerald-600" />
                            <span>{ad.inquiriesCount || 5} <span className="font-normal text-stone-500 text-[10px]">chats</span></span>
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
        )}

        {/* TAB 2: OFFERS CONTAINER */}
        {activeTab === 'offers' && (
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#FAF5F3]/50">
            {myReceivedOffers.length === 0 ? (
              <div className="text-center py-16 px-4 space-y-2">
                <Tag className="w-12 h-12 text-stone-300 mx-auto" />
                <h3 className="font-serif font-bold text-base text-stone-800">
                  Koi offer abhi tak mosool nahi hui
                </h3>
                <p className="text-xs text-stone-500">
                  Jab koi buyer aapke item par bargain/offer bhejega toh yahan nazar aayegi.
                </p>
              </div>
            ) : (
              myReceivedOffers.map((o) => {
                const isPending = o.status === 'pending';
                const isAccepted = o.status === 'accepted';
                const isRejected = o.status === 'rejected';
                const isCountered = o.status === 'countered';

                return (
                  <div key={o.id} className="bg-white rounded-2xl p-4 border border-stone-200 shadow-sm space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <img 
                          src={o.productImage} 
                          alt={o.productTitle} 
                          className="w-14 h-16 rounded-xl object-cover border border-stone-200 flex-shrink-0"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs sm:text-sm text-stone-900 line-clamp-1">
                              {o.productTitle}
                            </span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                              isAccepted ? 'bg-emerald-100 text-emerald-800' :
                              isRejected ? 'bg-red-100 text-red-800' :
                              isCountered ? 'bg-blue-100 text-blue-800' :
                              'bg-amber-100 text-amber-800'
                            }`}>
                              {o.status}
                            </span>
                          </div>
                          <p className="text-xs text-stone-500 mt-0.5">
                            Buyer: <b className="text-stone-800">{o.buyerName}</b> ({o.buyerPhone})
                          </p>
                          <div className="flex items-center gap-3 text-xs mt-1">
                            <span className="text-stone-400 line-through">
                              Original: Rs. {formatPKR(o.originalPrice)}
                            </span>
                            <span className="font-bold text-festiva-burgundy text-sm bg-festiva-blush px-2 py-0.5 rounded-lg border border-festiva-sand">
                              Offered: Rs. {formatPKR(o.offeredPrice)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Buyer's Note */}
                    {o.note && (
                      <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-200 text-xs text-stone-700 italic">
                        "{o.note}"
                      </div>
                    )}

                    {/* Counter price preview if already countered */}
                    {isCountered && o.counterPrice && (
                      <div className="bg-blue-50 border border-blue-200 text-blue-900 text-xs p-2 rounded-xl font-medium">
                        You sent a counter-offer of: <b>Rs. {formatPKR(o.counterPrice)}</b>
                      </div>
                    )}

                    {/* Action Controls for Pending Offers */}
                    {isPending && (
                      <div className="pt-2 border-t border-stone-100">
                        {counteringOfferId === o.id ? (
                          <div className="flex items-center gap-2">
                            <input 
                              type="number"
                              placeholder="Enter counter price (Rs.)"
                              value={counterPriceInput}
                              onChange={(e) => setCounterPriceInput(e.target.value)}
                              className="border border-stone-300 rounded-xl px-3 py-1.5 text-xs flex-1 outline-none focus:border-festiva-burgundy"
                            />
                            <button
                              onClick={() => handleSendCounterOffer(o.id)}
                              className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-3 py-1.5 rounded-xl transition-all"
                            >
                              Send Counter
                            </button>
                            <button
                              onClick={() => setCounteringOfferId(null)}
                              className="text-xs text-stone-500 px-2"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleAcceptOffer(o.id)}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-1.5 rounded-xl transition-all flex items-center gap-1 shadow-sm"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Accept Offer (منظور کریں)</span>
                            </button>

                            <button
                              onClick={() => {
                                setCounteringOfferId(o.id);
                                setCounterPriceInput(Math.round((o.originalPrice + o.offeredPrice) / 2).toString());
                              }}
                              className="bg-stone-800 hover:bg-stone-900 text-white font-bold text-xs px-3 py-1.5 rounded-xl transition-all"
                            >
                              Counter Offer
                            </button>

                            <button
                              onClick={() => handleRejectOffer(o.id)}
                              className="text-red-600 hover:text-red-800 text-xs font-bold px-3 py-1.5 hover:bg-red-50 rounded-xl transition-all"
                            >
                              Reject
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* TAB 3: WALLET CONTAINER */}
        {activeTab === 'wallet' && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 bg-[#FAF5F3]/50">
            {/* Wallet Balances Overview Card */}
            <div className="bg-gradient-to-br from-[#4A0B16] via-[#6B1222] to-[#2B060D] text-white p-5 rounded-3xl shadow-xl border border-festiva-gold/40 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-festiva-lightgold font-serif font-bold text-sm">
                  <Wallet className="w-4 h-4 text-festiva-gold" />
                  <span>Mamas Collection Escrow Amanat Vault</span>
                </div>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full font-bold">
                  Verified Seller Account
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                <div className="bg-white/10 p-3 rounded-2xl border border-white/10">
                  <span className="text-[10px] text-white/70 block uppercase font-bold">Available for Withdrawal</span>
                  <span className="text-xl font-serif font-bold text-festiva-lightgold">
                    Rs. {formatPKR(wallet.availableBalance)}
                  </span>
                </div>

                <div className="bg-white/10 p-3 rounded-2xl border border-white/10">
                  <span className="text-[10px] text-white/70 block uppercase font-bold">In Escrow (Under Inspection)</span>
                  <span className="text-xl font-serif font-bold text-amber-300">
                    Rs. {formatPKR(wallet.escrowPending)}
                  </span>
                </div>

                <div className="bg-white/10 p-3 rounded-2xl border border-white/10">
                  <span className="text-[10px] text-white/70 block uppercase font-bold">Lifetime Earned</span>
                  <span className="text-xl font-serif font-bold text-white">
                    Rs. {formatPKR(wallet.lifetimeEarned)}
                  </span>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setIsWithdrawOpen(true)}
                  disabled={wallet.availableBalance <= 0}
                  className="bg-festiva-gold hover:bg-festiva-lightgold text-festiva-maroon font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-2 shadow-lg transition-all active:scale-95 disabled:opacity-50"
                >
                  <ArrowDownCircle className="w-4 h-4" />
                  <span>Withdraw Funds (رقم نکالیں)</span>
                </button>
              </div>
            </div>

            {/* Withdrawal Modal / Dialog */}
            {isWithdrawOpen && (
              <div className="bg-white p-4 sm:p-5 rounded-2xl border-2 border-festiva-gold/50 shadow-md space-y-4">
                <div className="flex items-center justify-between border-b border-stone-200 pb-2">
                  <h4 className="font-serif font-bold text-sm text-stone-900">
                    Withdrawal Request to Easypaisa / JazzCash / Bank
                  </h4>
                  <button onClick={() => setIsWithdrawOpen(false)} className="text-stone-400 hover:text-stone-700">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {withdrawSuccessMsg && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl font-bold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>{withdrawSuccessMsg}</span>
                  </div>
                )}

                {withdrawError && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-800 text-xs rounded-xl font-medium">
                    {withdrawError}
                  </div>
                )}

                <form onSubmit={handleWithdrawSubmit} className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-stone-700 mb-1">
                        Amount to Withdraw (Max: Rs. {formatPKR(wallet.availableBalance)}):
                      </label>
                      <input 
                        type="number"
                        placeholder="e.g. 10000"
                        max={wallet.availableBalance}
                        value={withdrawAmount}
                        onChange={(e) => setWithdrawAmount(e.target.value)}
                        className="w-full border border-stone-300 rounded-xl p-2 text-xs outline-none focus:border-festiva-burgundy"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-stone-700 mb-1">
                        Payout Method:
                      </label>
                      <select
                        value={withdrawMethod}
                        onChange={(e) => setWithdrawMethod(e.target.value)}
                        className="w-full border border-stone-300 rounded-xl p-2 text-xs outline-none focus:border-festiva-burgundy bg-white"
                      >
                        <option value="Easypaisa">Easypaisa</option>
                        <option value="JazzCash">JazzCash</option>
                        <option value="Meezan Bank">Meezan Bank</option>
                        <option value="Habib Bank Limited (HBL)">HBL</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-stone-700 mb-1">
                        Account Holder Title:
                      </label>
                      <input 
                        type="text"
                        placeholder="e.g. Muhammad Saad"
                        value={accountTitle}
                        onChange={(e) => setAccountTitle(e.target.value)}
                        className="w-full border border-stone-300 rounded-xl p-2 text-xs outline-none focus:border-festiva-burgundy"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-stone-700 mb-1">
                        Mobile Number / IBAN:
                      </label>
                      <input 
                        type="text"
                        placeholder="e.g. 0307-1234567 or PK..."
                        value={accountNumber}
                        onChange={(e) => setAccountNumber(e.target.value)}
                        className="w-full border border-stone-300 rounded-xl p-2 text-xs outline-none focus:border-festiva-burgundy"
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-festiva-burgundy hover:bg-festiva-maroon text-white font-bold py-2.5 rounded-xl text-xs transition-all shadow-md"
                  >
                    Confirm Withdrawal (رقم ٹرانسفر کی درخواست بھیجیں)
                  </button>
                </form>
              </div>
            )}

            {/* Transaction History Table */}
            <div className="bg-white rounded-2xl border border-stone-200 p-4 space-y-3">
              <h4 className="font-serif font-bold text-stone-900 text-xs sm:text-sm">
                Recent Escrow Transactions & Payouts (حالیہ لین دین)
              </h4>

              <div className="space-y-2">
                {wallet.transactions.map((tx) => (
                  <div key={tx.id} className="flex items-center justify-between p-2.5 rounded-xl bg-stone-50 border border-stone-100 text-xs">
                    <div>
                      <div className="font-bold text-stone-900">{tx.description}</div>
                      <div className="text-[10px] text-stone-500">{tx.date} &bull; {tx.type}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-festiva-burgundy">Rs. {formatPKR(tx.amount)}</div>
                      <span className={`text-[9px] px-2 py-0.2 rounded-full font-bold uppercase ${
                        tx.status === 'Released' ? 'bg-emerald-100 text-emerald-800' :
                        tx.status === 'Processing' ? 'bg-blue-100 text-blue-800' :
                        'bg-amber-100 text-amber-800'
                      }`}>
                        {tx.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
