import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Send, 
  ShieldCheck, 
  MapPin, 
  Clock, 
  Sparkles, 
  CheckCheck, 
  Store, 
  Phone
} from 'lucide-react';
import WhatsAppIcon from './WhatsAppIcon';
import { checkMessageSafety } from '../services/marketplaceService';

export default function ChatModal({
  isOpen,
  onClose,
  product,
  conversations,
  onSendMessage,
  onOpenWhatsApp
}) {
  if (!isOpen || !product) return null;

  const [messageText, setMessageText] = useState('');
  const [securityWarning, setSecurityWarning] = useState('');
  const messagesEndRef = useRef(null);

  const conversationKey = `chat_${product.id}`;
  const currentMessages = conversations[conversationKey] || [
    {
      id: 1,
      sender: 'seller',
      senderName: product.vendor.name,
      text: `Assalam o Alaikum! Main ${product.vendor.name} hoon (${product.quettaArea}, Quetta). "${product.title}" ke baray mein aap jo bhi poochna chahein, yahan pooch sakti hain!`,
      timestamp: 'Recently'
    }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentMessages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!messageText.trim()) return;

    // Strict Anti-Disintermediation / Contact Masking Check
    const safety = checkMessageSafety(messageText);
    if (!safety.isSafe) {
      setSecurityWarning(`⚠️ Security Policy Violation: Aap direct Phone Number, WhatsApp ya Social Media link (${safety.violations.join(', ')}) share nahi kar sakte. Deals sirf Mamas Collection ke zariye safe tareeqay se karein!`);
      return;
    }
    setSecurityWarning('');

    const newMsg = {
      id: Date.now(),
      sender: 'user',
      senderName: 'You (Buyer)',
      text: messageText.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    onSendMessage(product, newMsg);
    setMessageText('');

    // Optional simulated instant seller acknowledgement
    setTimeout(() => {
      const replyMsg = {
        id: Date.now() + 1,
        sender: 'seller',
        senderName: product.vendor.name,
        text: `Ji bilkul, yeh item Quetta (${product.quettaArea}) mein ready hai. Aap booking confirm kar sakti hain ya direct WhatsApp par rabta kar sakti hain!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      onSendMessage(product, replyMsg);
    }, 1500);
  };

  const handleQuickQuestion = (text) => {
    setMessageText(text);
  };

  const formatPKR = (num) => Number(num || 0).toLocaleString('en-PK');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div 
        className="bg-white rounded-3xl max-w-lg w-full h-[620px] max-h-[90vh] shadow-2xl flex flex-col overflow-hidden border border-festiva-gold/30 animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Chat Header */}
        <div className="bg-gradient-to-r from-[#4A0B16] via-[#6B1222] to-[#4A0B16] text-white p-4 flex items-center justify-between border-b border-festiva-gold/30">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-11 h-11 rounded-full bg-festiva-gold/20 border-2 border-festiva-gold flex items-center justify-center text-festiva-lightgold font-bold font-serif text-lg">
                {product.vendor.name.charAt(0)}
              </div>
              <span className="w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#4A0B16] absolute bottom-0 right-0"></span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm sm:text-base text-white">
                  {product.vendor.name}
                </h3>
                {product.vendor.verified && (
                  <span className="flex items-center gap-1 text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-1.5 py-0.5 rounded-full font-medium">
                    <ShieldCheck className="w-3 h-3" />
                    <span>Verified</span>
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 text-xs text-stone-300">
                <MapPin className="w-3 h-3 text-festiva-gold" />
                <span>{product.quettaArea}, Quetta</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden sm:flex items-center gap-1 text-[11px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2.5 py-1 rounded-full font-bold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Mamas Escrow Safe</span>
            </span>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white p-2 rounded-xl hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Security Warning Banner */}
        {securityWarning && (
          <div className="bg-red-600 text-white px-4 py-2 text-xs font-semibold flex items-center justify-between gap-2 shadow-inner animate-fadeIn">
            <div className="flex items-center gap-2">
              <span>⛔</span>
              <span>{securityWarning}</span>
            </div>
            <button 
              onClick={() => setSecurityWarning('')}
              className="text-white/80 hover:text-white text-xs font-bold underline whitespace-nowrap"
            >
              OK
            </button>
          </div>
        )}

        {/* Product Compact Snippet Bar */}
        <div className="bg-festiva-cream/50 px-4 py-2.5 border-b border-stone-200 flex items-center gap-3">
          <img 
            src={product.images?.[0] || 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=400'} 
            alt={product.title} 
            className="w-12 h-12 rounded-xl object-cover border border-festiva-gold/30 shadow-sm flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <h4 className="font-bold text-xs text-stone-900 truncate">
              {product.title}
            </h4>
            <div className="flex items-center gap-2 text-xs">
              <span className="font-serif font-bold text-festiva-burgundy">
                Rs. {formatPKR(product.rentRate ? product.rentRate.daily : product.price)}
                {product.rentRate && <span className="text-[10px] text-stone-500 font-sans font-normal"> / day</span>}
              </span>
              <span className="text-stone-300">&bull;</span>
              <span className="text-stone-500 text-[11px] capitalize">{product.eventType}</span>
            </div>
          </div>
        </div>

        {/* Messages Thread Container */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#FAF5F3]/50">
          <div className="text-center my-2">
            <span className="bg-stone-200/80 text-stone-600 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              End-to-End Quetta Direct Messaging
            </span>
          </div>

          {currentMessages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div 
                key={msg.id} 
                className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
              >
                <div 
                  className={`max-w-[82%] sm:max-w-[75%] rounded-2xl p-3 shadow-sm ${
                    isUser 
                      ? 'bg-gradient-to-r from-festiva-burgundy to-festiva-maroon text-white rounded-br-none' 
                      : 'bg-white text-stone-800 border border-stone-200/80 rounded-bl-none'
                  }`}
                >
                  {!isUser && (
                    <div className="text-[11px] font-bold text-festiva-burgundy mb-1 flex items-center gap-1">
                      <span>{msg.senderName}</span>
                      <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    </div>
                  )}
                  <p className="text-xs sm:text-sm whitespace-pre-wrap leading-relaxed">
                    {msg.text}
                  </p>
                  <div className={`flex items-center justify-end gap-1 text-[10px] mt-1 ${isUser ? 'text-white/70' : 'text-stone-400'}`}>
                    <span>{msg.timestamp}</span>
                    {isUser && <CheckCheck className="w-3.5 h-3.5 text-festiva-lightgold" />}
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="bg-white px-3 py-2 border-t border-stone-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => handleQuickQuestion("Assalam o Alaikum, kya yeh suit weekend par available hai?")}
            className="text-[11px] bg-stone-100 hover:bg-festiva-cream text-stone-700 px-2.5 py-1 rounded-full whitespace-nowrap transition-colors border border-stone-200"
          >
            Weekend availability?
          </button>
          <button
            type="button"
            onClick={() => handleQuickQuestion("Quetta mein inspection ya fitting ke liye kab mil sakte hain?")}
            className="text-[11px] bg-stone-100 hover:bg-festiva-cream text-stone-700 px-2.5 py-1 rounded-full whitespace-nowrap transition-colors border border-stone-200"
          >
            Quetta Inspection/Fitting?
          </button>
          <button
            type="button"
            onClick={() => handleQuickQuestion("Security deposit refund ka kya procedure hai?")}
            className="text-[11px] bg-stone-100 hover:bg-festiva-cream text-stone-700 px-2.5 py-1 rounded-full whitespace-nowrap transition-colors border border-stone-200"
          >
            Security Deposit Refund?
          </button>
        </div>

        {/* Message Input Box */}
        <form onSubmit={handleSend} className="p-3 bg-white border-t border-stone-200 flex items-center gap-2">
          <input
            type="text"
            required
            placeholder={`Reply to ${product.vendor.name}...`}
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            className="flex-1 bg-stone-50 border border-stone-200 rounded-2xl px-4 py-2.5 text-xs sm:text-sm text-stone-900 outline-none focus:border-festiva-burgundy focus:bg-white transition-all"
          />
          <button
            type="submit"
            className="bg-festiva-burgundy hover:bg-festiva-maroon text-white p-2.5 sm:px-4 sm:py-2.5 rounded-2xl font-bold flex items-center justify-center gap-1.5 shadow-md shadow-festiva-burgundy/20 active:scale-95 transition-all"
          >
            <Send className="w-4 h-4 text-festiva-lightgold" />
            <span className="hidden sm:inline text-xs">Send</span>
          </button>
        </form>
      </div>
    </div>
  );
}
