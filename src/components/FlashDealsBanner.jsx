import React, { useState, useEffect } from 'react';
import { 
  Flame, 
  Clock, 
  Sparkles, 
  Zap, 
  ArrowRight,
  ShieldCheck,
  Tag
} from 'lucide-react';

export default function FlashDealsBanner({ onSelectFlashCategory }) {
  // 6 hour ticking countdown timer
  const [timeLeft, setTimeLeft] = useState({
    hours: 5,
    minutes: 42,
    seconds: 18
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 6, minutes: 0, seconds: 0 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const padZero = (n) => String(n).padStart(2, '0');

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 my-4">
      <div className="bg-gradient-to-r from-[#3B070F] via-[#6B1222] to-[#2B060D] text-white rounded-3xl p-4 sm:p-5 shadow-xl border border-festiva-gold/40 relative overflow-hidden">
        
        {/* Decorative background glow */}
        <div className="absolute -top-16 -right-16 w-48 h-48 bg-festiva-gold/15 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 relative z-10">
          
          {/* Left Title & Badge */}
          <div className="flex items-center gap-3.5 text-center md:text-left">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-festiva-maroon shadow-lg flex-shrink-0 animate-pulse">
              <Zap className="w-6 h-6 fill-current" />
            </div>
            <div>
              <div className="flex items-center justify-center md:justify-start gap-2">
                <span className="font-serif font-bold text-base sm:text-lg text-festiva-lightgold">
                  Amazon-Style Bridal Flash Deals
                </span>
                <span className="text-[10px] bg-red-600 text-white font-black px-2 py-0.5 rounded-full uppercase tracking-wider animate-bounce">
                  Live Now
                </span>
              </div>
              <p className="text-xs text-stone-200 mt-0.5">
                Quetta Bridal Festiva: Flat 30% to 50% OFF on selected designer Barat & Valima lehengas
              </p>
            </div>
          </div>

          {/* Center Countdown Clock */}
          <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10 shadow-inner">
            <Clock className="w-4 h-4 text-festiva-gold" />
            <span className="text-xs text-stone-300 font-medium">Deals Expire In:</span>
            <div className="flex items-center gap-1 font-mono font-bold text-sm text-festiva-lightgold">
              <span className="bg-white/10 px-2 py-0.5 rounded-lg border border-white/10">
                {padZero(timeLeft.hours)}h
              </span>
              <span>:</span>
              <span className="bg-white/10 px-2 py-0.5 rounded-lg border border-white/10">
                {padZero(timeLeft.minutes)}m
              </span>
              <span>:</span>
              <span className="bg-white/10 px-2 py-0.5 rounded-lg border border-white/10 text-amber-400">
                {padZero(timeLeft.seconds)}s
              </span>
            </div>
          </div>

          {/* Right Action Button & Progress */}
          <div className="flex items-center gap-3">
            <div className="hidden lg:block text-right">
              <span className="text-[10px] text-stone-300 block">Claimed: 84%</span>
              <div className="w-24 h-1.5 bg-white/20 rounded-full overflow-hidden mt-0.5">
                <div className="w-[84%] h-full bg-gradient-to-r from-amber-400 to-red-500 rounded-full" />
              </div>
            </div>

            <button
              onClick={() => {
                if (onSelectFlashCategory) onSelectFlashCategory('bridal');
              }}
              className="bg-festiva-gold hover:bg-festiva-lightgold text-festiva-maroon font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-md transition-all active:scale-95 whitespace-nowrap"
            >
              <span>Explore Deals (ڈیلز دیکھیں)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
