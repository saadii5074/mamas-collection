import React from 'react';
import { X, MessageSquare, ShieldCheck, MapPin, ArrowRight, Store, Clock } from 'lucide-react';

export default function InboxModal({
  isOpen,
  onClose,
  conversations,
  products,
  onOpenChatWithProduct
}) {
  if (!isOpen) return null;

  // Extract all active chat threads
  const conversationKeys = Object.keys(conversations);

  const threads = conversationKeys.map(key => {
    const productId = key.replace('chat_', '');
    const product = products.find(p => p.id === productId);
    const msgs = conversations[key] || [];
    const lastMsg = msgs[msgs.length - 1];

    return {
      productId,
      product,
      lastMsg,
      count: msgs.length
    };
  }).filter(t => t.product);

  const formatPKR = (num) => Number(num || 0).toLocaleString('en-PK');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div 
        className="bg-white rounded-3xl max-w-lg w-full max-h-[85vh] shadow-2xl flex flex-col overflow-hidden border border-festiva-gold/30 animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#4A0B16] via-[#6B1222] to-[#4A0B16] text-white p-5 flex items-center justify-between border-b border-festiva-gold/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-festiva-gold/20 border border-festiva-gold/40 flex items-center justify-center text-festiva-gold">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-lg text-white">
                In-App Messages & Inquiries
              </h2>
              <p className="text-xs text-white/80">Quetta Sellers & Hosts Chat Hub</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#FAF5F3]/40">
          {threads.length === 0 ? (
            <div className="text-center py-12 px-4 space-y-3">
              <div className="w-16 h-16 rounded-full bg-festiva-cream border border-festiva-gold/30 mx-auto flex items-center justify-center text-festiva-burgundy">
                <MessageSquare className="w-8 h-8 opacity-60" />
              </div>
              <h3 className="font-serif font-bold text-base text-stone-800">
                Abhi tak koi chat shuru nahi hui
              </h3>
              <p className="text-xs text-stone-500 max-w-xs mx-auto">
                Kissi bhi suit, jewellery ya car ke card par jakar <b>"Chat with Seller"</b> button dabayein taake aap seller se direct rabta kar sakein.
              </p>
            </div>
          ) : (
            threads.map(({ productId, product, lastMsg, count }) => (
              <div
                key={productId}
                onClick={() => {
                  onClose();
                  onOpenChatWithProduct(product);
                }}
                className="bg-white hover:bg-festiva-cream/50 border border-stone-200 hover:border-festiva-gold/50 rounded-2xl p-3.5 flex items-center gap-3 cursor-pointer transition-all shadow-sm group"
              >
                <img 
                  src={product.images?.[0] || 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=400'} 
                  alt={product.title} 
                  className="w-14 h-14 rounded-xl object-cover border border-festiva-gold/30 flex-shrink-0"
                />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="font-bold text-xs sm:text-sm text-stone-900 truncate group-hover:text-festiva-burgundy transition-colors">
                      {product.vendor.name}
                    </h4>
                    <span className="text-[10px] text-stone-400 whitespace-nowrap">
                      {lastMsg?.timestamp || 'Recently'}
                    </span>
                  </div>

                  <p className="text-xs text-stone-500 truncate mb-1">
                    {product.title}
                  </p>

                  <div className="flex items-center justify-between text-xs">
                    <p className="text-stone-700 text-xs truncate max-w-[220px]">
                      {lastMsg?.sender === 'user' ? 'You: ' : ''}{lastMsg?.text || 'Conversation active'}
                    </p>
                    <span className="text-[10px] font-bold text-festiva-burgundy bg-festiva-cream px-2 py-0.5 rounded-full border border-festiva-gold/30">
                      {count} msgs
                    </span>
                  </div>
                </div>

                <ArrowRight className="w-4 h-4 text-stone-300 group-hover:text-festiva-burgundy group-hover:translate-x-1 transition-all flex-shrink-0" />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
