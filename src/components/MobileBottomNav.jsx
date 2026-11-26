import React from 'react';
import { 
  Home, 
  ShoppingBag, 
  Sparkles, 
  PlusCircle, 
  Crown,
  Tag,
  Store
} from 'lucide-react';

export default function MobileBottomNav({
  activeMode,
  setActiveMode,
  cartCount,
  onOpenCart,
  onOpenSellerPortal,
  onOpenAdmin,
  isAdminActive,
  onOpenMyListings
}) {
  return (
    <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-festiva-sand shadow-lg px-1.5 py-1.5 pb-[max(0.5rem,env(safe-area-inset-bottom))] flex items-center justify-around text-[10px] select-none">
      
      {/* Home Button */}
      <button
        onClick={() => {
          setActiveMode('all');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-xl transition-all ${
          activeMode === 'all' && !isAdminActive
            ? 'text-festiva-burgundy font-bold'
            : 'text-stone-500 hover:text-stone-800'
        }`}
      >
        <Home className="w-4 h-4" />
        <span>Home</span>
      </button>

      {/* Buy Mode */}
      <button
        onClick={() => setActiveMode('buy')}
        className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-xl transition-all ${
          activeMode === 'buy' && !isAdminActive
            ? 'text-festiva-burgundy font-bold'
            : 'text-stone-500 hover:text-stone-800'
        }`}
      >
        <Tag className="w-4 h-4" />
        <span>Buy</span>
      </button>

      {/* Rent Mode */}
      <button
        onClick={() => setActiveMode('rent')}
        className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-xl transition-all ${
          activeMode === 'rent' && !isAdminActive
            ? 'text-festiva-burgundy font-bold'
            : 'text-stone-500 hover:text-stone-800'
        }`}
      >
        <Sparkles className="w-4 h-4 text-festiva-gold" />
        <span>Rent Out</span>
      </button>

      {/* Sell / Post Listing */}
      <button
        onClick={onOpenSellerPortal}
        className="flex flex-col items-center gap-0.5 py-1 px-2 rounded-xl text-festiva-maroon font-bold"
      >
        <div className="w-6 h-6 rounded-full bg-gradient-to-r from-festiva-gold to-amber-600 flex items-center justify-center text-festiva-maroon shadow-sm">
          <PlusCircle className="w-4 h-4 text-white" />
        </div>
        <span>Post Item</span>
      </button>

      {/* Cart Button */}
      <button
        onClick={onOpenCart}
        className="flex flex-col items-center gap-0.5 py-1 px-2 rounded-xl text-stone-500 hover:text-stone-800 relative"
      >
        <div className="relative">
          <ShoppingBag className="w-4 h-4" />
          {cartCount > 0 && (
            <span className="absolute -top-1.5 -right-2 w-4 h-4 bg-festiva-burgundy text-white text-[9px] font-bold rounded-full flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </div>
        <span>Cart</span>
      </button>

      {/* My Ads Studio Button */}
      <button
        onClick={onOpenMyListings}
        className="flex flex-col items-center gap-0.5 py-1 px-2 rounded-xl text-stone-500 hover:text-festiva-burgundy"
        title="My Ads"
      >
        <Store className="w-4 h-4 text-festiva-burgundy" />
        <span>My Ads</span>
      </button>

      {/* Admin Button */}
      <button
        onClick={onOpenAdmin}
        className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-xl transition-all ${
          isAdminActive
            ? 'text-festiva-burgundy font-bold'
            : 'text-stone-500 hover:text-stone-800'
        }`}
      >
        <Crown className="w-4 h-4 text-festiva-gold" />
        <span>Admin</span>
      </button>

    </div>
  );
}
