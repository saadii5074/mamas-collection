import React from 'react';
import { 
  ShoppingBag, 
  MapPin, 
  Search, 
  Sparkles, 
  PlusCircle, 
  ShieldCheck, 
  Crown,
  MessageSquare,
  Lock,
  Store,
  User,
  RefreshCw
} from 'lucide-react';
import WhatsAppIcon from './WhatsAppIcon';
import { QUETTA_AREAS } from '../data/mockData';

export default function Navbar({ 
  selectedArea, 
  setSelectedArea, 
  searchQuery, 
  setSearchQuery,
  activeMode, 
  setActiveMode,
  cartCount,
  onOpenCart,
  onOpenSellerPortal,
  onOpenAdmin,
  isAdminActive,
  isAdminAuthenticated,
  onOpenInbox,
  unreadMessagesCount = 0,
  activeUser,
  onOpenMyListings,
  onOpenAuth,
  onSwitchRole
}) {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-festiva-sand shadow-sm transition-all">
      {/* Top Festive Announcement Bar */}
      <div className="bg-gradient-to-r from-festiva-maroon via-festiva-burgundy to-festiva-maroon text-white text-xs py-2 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="bg-festiva-gold/20 text-festiva-lightgold font-bold px-2 py-0.5 rounded text-[10px] tracking-wider uppercase border border-festiva-gold/40">
              Quetta Launch
            </span>
            <span className="hidden sm:inline font-medium text-festiva-lightgold">
              ✨ ماماس کلیکشن - شادیوں اور ایونٹس کے لیے برائیڈل سوٹس اور رینٹل مارکیٹ پلیس
            </span>
            <span className="sm:hidden font-medium text-festiva-lightgold">
              ماماس کلیکشن کوئیٹہ
            </span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            {/* Simulation Role Switcher */}
            {activeUser && (
              <button
                onClick={onSwitchRole}
                className="hidden sm:flex items-center gap-1.5 bg-white/10 hover:bg-white/20 px-2 py-0.5 rounded text-[10px] text-festiva-lightgold font-mono transition-all border border-white/20"
                title="Switch demo account to test buyer vs seller communication"
              >
                <RefreshCw className="w-3 h-3 text-festiva-gold" />
                <span>Demo: <b>{activeUser.name}</b> ({activeUser.role === 'seller' ? 'Seller' : 'Buyer'})</span>
                <span className="underline ml-0.5 text-white">Switch</span>
              </button>
            )}

            <a 
              href="https://wa.me/923070816990?text=Hello%20Mamas%20Collection%20Quetta!" 
              target="_blank" 
              rel="noreferrer"
              className="flex items-center gap-1.5 hover:text-festiva-lightgold transition-colors font-semibold"
            >
              <WhatsAppIcon className="w-3.5 h-3.5 text-emerald-400" />
              <span>WhatsApp: 0307-0816990</span>
            </a>
            <span className="text-white/40">|</span>
            <button 
              onClick={onOpenAdmin}
              className={`flex items-center gap-1.5 font-semibold transition-colors ${
                isAdminActive ? 'text-festiva-lightgold underline' : 'hover:text-festiva-lightgold'
              }`}
            >
              {isAdminAuthenticated ? (
                <>
                  <Crown className="w-3.5 h-3.5 text-festiva-gold" />
                  <span>Admin Control Room</span>
                </>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5 text-festiva-gold" />
                  <span>Admin Login</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Row */}
      <div className="max-w-7xl mx-auto px-4 py-3 sm:py-4">
        <div className="flex items-center justify-between gap-3 sm:gap-6">
          
          {/* Brand Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveMode('all')}>
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-festiva-burgundy to-festiva-maroon flex items-center justify-center text-festiva-gold shadow-festive border border-festiva-gold/30">
              <span className="font-serif font-bold text-2xl sm:text-3xl leading-none">M</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-festiva-maroon">
                  Mamas Collection
                </span>
                <span className="hidden md:inline-block px-1.5 py-0.5 rounded text-[9px] font-bold bg-festiva-gold text-festiva-maroon uppercase">
                  Quetta
                </span>
              </div>
              <p className="text-[10px] sm:text-xs text-stone-500 font-medium tracking-wide">
                Luxury Bridal, Garments & P2P Rental
              </p>
            </div>
          </div>

          {/* Quetta Area Selector Dropdown */}
          <div className="hidden lg:flex items-center bg-festiva-blush border border-festiva-sand rounded-full px-3 py-1.5 text-xs">
            <MapPin className="w-4 h-4 text-festiva-burgundy mr-1.5 flex-shrink-0" />
            <span className="text-stone-500 mr-1.5">Area:</span>
            <select 
              value={selectedArea}
              onChange={(e) => setSelectedArea(e.target.value)}
              className="bg-transparent font-semibold text-festiva-burgundy focus:outline-none cursor-pointer"
            >
              {QUETTA_AREAS.map((area) => (
                <option key={area} value={area} className="text-stone-800">
                  {area}
                </option>
              ))}
            </select>
          </div>

          {/* Search Box */}
          <div className="flex-1 max-w-md hidden sm:block">
            <div className="relative">
              <input
                type="text"
                placeholder="Search bridal lehenga, perfume, car, furniture in Quetta..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-festiva-blush/60 hover:bg-festiva-blush focus:bg-white text-xs sm:text-sm pl-9 pr-4 py-2 rounded-full border border-festiva-sand focus:border-festiva-burgundy focus:ring-1 focus:ring-festiva-burgundy outline-none transition-all placeholder:text-stone-400"
              />
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
            </div>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Mode Switcher: Buy vs Rent */}
            <div className="flex p-0.5 bg-festiva-blush rounded-full border border-festiva-sand text-xs font-semibold">
              <button
                onClick={() => setActiveMode('buy')}
                className={`px-3 py-1.5 rounded-full transition-all ${
                  activeMode === 'buy'
                    ? 'bg-festiva-burgundy text-white shadow-sm'
                    : 'text-stone-600 hover:text-festiva-burgundy'
                }`}
              >
                Buy
              </button>
              <button
                onClick={() => setActiveMode('rent')}
                className={`px-3 py-1.5 rounded-full transition-all flex items-center gap-1 ${
                  activeMode === 'rent'
                    ? 'bg-festiva-burgundy text-white shadow-sm'
                    : 'text-stone-600 hover:text-festiva-burgundy'
                }`}
              >
                <Sparkles className="w-3 h-3 text-festiva-gold" />
                <span>Rent Out</span>
              </button>
            </div>

            {/* List Your Item (Seller Portal) */}
            <button
              onClick={onOpenSellerPortal}
              className="hidden md:flex items-center gap-1.5 bg-gradient-to-r from-festiva-gold to-amber-600 hover:from-amber-600 hover:to-festiva-gold text-festiva-maroon hover:text-white px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shadow-sm"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Post For Rent / Sell</span>
            </button>

            {/* My Ads & Listings Studio (OLX Style) */}
            <button
              onClick={onOpenMyListings}
              className="hidden lg:flex items-center gap-1.5 bg-festiva-blush hover:bg-festiva-sand text-festiva-burgundy px-3 py-1.5 rounded-full text-xs font-bold border border-festiva-sand transition-all shadow-sm"
              title="My Ads, Views, Saves & Studio"
            >
              <Store className="w-3.5 h-3.5 text-festiva-burgundy" />
              <span>My Ads</span>
            </button>

            {/* User Account / Phone Auth */}
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-1.5 bg-festiva-blush hover:bg-festiva-sand text-stone-800 px-3 py-1.5 rounded-full text-xs font-semibold border border-festiva-sand transition-all"
              title={activeUser ? `Signed in as ${activeUser.name} (${activeUser.phone})` : "Login / Register with Phone"}
            >
              <User className="w-3.5 h-3.5 text-festiva-burgundy" />
              <span className="hidden sm:inline max-w-[80px] truncate">
                {activeUser ? activeUser.name.split(' ')[0] : 'Sign In'}
              </span>
            </button>

            {/* In-App Messages / Chat Trigger */}
            <button
              onClick={onOpenInbox}
              className="relative p-2.5 rounded-full bg-festiva-blush hover:bg-festiva-sand text-stone-700 hover:text-festiva-burgundy border border-festiva-sand transition-all"
              title="In-App Messages & Inquiries"
            >
              <MessageSquare className="w-5 h-5" />
              {unreadMessagesCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                  {unreadMessagesCount}
                </span>
              )}
            </button>

            {/* Cart & Booking Drawer Trigger */}
            <button
              onClick={onOpenCart}
              className="relative p-2.5 rounded-full bg-festiva-blush hover:bg-festiva-sand text-festiva-burgundy border border-festiva-sand transition-all"
              title="Cart / Bookings"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-festiva-burgundy text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white animate-pulse">
                  {cartCount}
                </span>
              )}
            </button>
          </div>

        </div>

        {/* Mobile Search & Area row */}
        <div className="mt-2.5 sm:hidden flex items-center gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search bridal, rent, jewelry..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-festiva-blush text-xs pl-8 pr-3 py-1.5 rounded-full border border-festiva-sand outline-none"
            />
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-2" />
          </div>

          <select 
            value={selectedArea}
            onChange={(e) => setSelectedArea(e.target.value)}
            className="bg-festiva-blush border border-festiva-sand rounded-full px-2 py-1.5 text-[11px] font-semibold text-festiva-burgundy focus:outline-none max-w-[130px] truncate"
          >
            {QUETTA_AREAS.map((area) => (
              <option key={area} value={area}>
                {area}
              </option>
            ))}
          </select>
        </div>
      </div>
    </header>
  );
}
