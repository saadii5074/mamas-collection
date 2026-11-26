import React from 'react';
import { Sparkles, Shield, ArrowRight, Clock, Award, HeartHandshake } from 'lucide-react';

export default function HeroBanner({ onSelectEvent, onOpenSellerPortal, activeMode, setActiveMode }) {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-[#4A0B16] via-[#6B1222] to-[#2D060D] text-white">
      {/* Decorative luxury ornamental patterns */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />
      <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-festiva-gold/15 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-festiva-rose/20 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 py-8 sm:py-12 md:py-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Headlines & Call to Actions */}
          <div className="lg:col-span-7 space-y-4 sm:space-y-6 text-center lg:text-left">
            
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-festiva-gold/30 px-3.5 py-1.5 rounded-full">
              <Sparkles className="w-4 h-4 text-festiva-gold animate-spin-slow" />
              <span className="text-xs sm:text-sm font-semibold text-festiva-lightgold tracking-wide">
                Quetta's 1st Luxury Bridal & Peer Rental Platform
              </span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight text-white">
              Wear Your Dream <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-festiva-lightgold via-festiva-gold to-amber-200">
                Bridal Dress
              </span>{' '}
              on Rent or Buy
            </h1>

            <p className="text-sm sm:text-base text-stone-200 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
              ماماس کلیکشن کوئیٹہ: ڈیڑھ لاکھ کا لہنگا اب الماری میں بند نہیں رہے گا! شادی، بارات اور ولیمہ کے لیے برائیڈل سوٹس مناسب کرائے پر لیں، یا اپنی ملبوسات، فرنیچر اور گاڑی کرائے پر دے کر کمائیں۔
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-4 pt-2">
              <button
                onClick={() => setActiveMode('rent')}
                className="bg-gradient-to-r from-festiva-gold to-amber-600 hover:from-amber-500 hover:to-festiva-gold text-festiva-maroon font-bold px-6 py-3 rounded-full text-xs sm:text-sm transition-all shadow-festive flex items-center gap-2 transform active:scale-95"
              >
                <span>Explore Bridal Suits for Rent</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onOpenSellerPortal}
                className="bg-white/10 hover:bg-white/20 text-white font-semibold border border-white/25 px-5 py-3 rounded-full text-xs sm:text-sm transition-all backdrop-blur-sm flex items-center gap-2"
              >
                <HeartHandshake className="w-4 h-4 text-festiva-lightgold" />
                <span>Rent Out Your Dress in Quetta</span>
              </button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-2 sm:gap-4 pt-4 border-t border-white/15 max-w-lg mx-auto lg:mx-0 text-left">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-festiva-gold flex-shrink-0" />
                <div>
                  <p className="text-[11px] font-bold text-white">Amanat Locker</p>
                  <p className="text-[10px] text-stone-300">100% Safe Deposit</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-festiva-gold flex-shrink-0" />
                <div>
                  <p className="text-[11px] font-bold text-white">Daily / Hourly</p>
                  <p className="text-[10px] text-stone-300">Flexible Rates</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-festiva-gold flex-shrink-0" />
                <div>
                  <p className="text-[11px] font-bold text-white">Quetta Delivery</p>
                  <p className="text-[10px] text-stone-300">Fast Local Service</p>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Festive Card Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-sm rounded-2xl p-1 bg-gradient-to-tr from-festiva-gold via-amber-200 to-festiva-gold/40 shadow-2xl">
              <div className="bg-[#540915] rounded-[15px] p-4 text-white">
                <div className="relative aspect-[4/5] rounded-xl overflow-hidden mb-3 border border-festiva-gold/30">
                  <img
                    src="https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=800&auto=format&fit=crop"
                    alt="Mamas Bridal Lehenga"
                    className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-2.5 left-2.5 bg-festiva-maroon/90 backdrop-blur-md text-festiva-lightgold border border-festiva-gold/40 text-[10px] font-bold px-2 py-1 rounded-md uppercase">
                    ⭐ Barat Top Pick (Quetta)
                  </div>
                  <div className="absolute bottom-2.5 right-2.5 bg-black/80 backdrop-blur-md text-white text-[11px] font-semibold px-2.5 py-1 rounded-md">
                    Rent: Rs. 14,000 / Day
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-serif font-bold text-sm text-festiva-lightgold">
                      Royal Noor Zardozi Lehenga
                    </h3>
                    <p className="text-[11px] text-stone-300">
                      Original Value: Rs. 195,000
                    </p>
                  </div>
                  <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 text-[10px] font-bold px-2 py-0.5 rounded">
                    Available in Cantt
                  </span>
                </div>
              </div>
            </div>

            {/* Floating Review Badge */}
            <div className="absolute -bottom-3 -left-2 sm:bottom-2 sm:-left-4 bg-white/95 backdrop-blur-md text-stone-900 border border-festiva-sand p-2.5 rounded-xl shadow-lg flex items-center gap-2.5 text-xs">
              <div className="w-8 h-8 rounded-full bg-festiva-burgundy text-white flex items-center justify-center font-bold text-xs">
                5.0
              </div>
              <div>
                <p className="font-bold text-[11px] text-festiva-maroon">100% Fit & Quality Assured</p>
                <p className="text-[10px] text-stone-500">Quetta Verified Host</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
