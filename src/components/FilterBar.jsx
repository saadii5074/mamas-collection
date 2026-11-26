import React from 'react';
import { 
  Sparkles, 
  Tag, 
  RotateCcw, 
  Palette, 
  Ruler, 
  CalendarDays,
  Store,
  Layers
} from 'lucide-react';
import { EVENT_CATEGORIES, COLOR_PALETTE } from '../data/mockData';

export default function FilterBar({
  selectedEvent,
  setSelectedEvent,
  selectedCategory,
  setSelectedCategory,
  selectedColor,
  setSelectedColor,
  selectedSize,
  setSelectedSize,
  onlyOfficial,
  setOnlyOfficial,
  activeMode,
  setActiveMode,
  onResetFilters,
  totalResults
}) {
  const categories = [
    { id: 'all', name: 'All Categories' },
    { id: 'bridal', name: 'Bridal Lehengas & Gowns' },
    { id: 'garments', name: 'Ladies Garments' },
    { id: 'perfumes', name: 'Luxury Perfumes & Oud' },
    { id: 'jewellery', name: 'Bridal Jewellery' },
    { id: 'cars', name: 'Wedding Cars (Rent)' },
    { id: 'furniture', name: 'Stage Furniture (Rent)' }
  ];

  const sizes = ['All', 'XS', 'S', 'M', 'L', 'XL', 'Free Size'];

  const hasActiveFilters = 
    selectedEvent !== 'all' || 
    selectedCategory !== 'all' || 
    selectedColor !== null || 
    selectedSize !== 'All' || 
    onlyOfficial;

  return (
    <div className="bg-white border-b border-festiva-sand shadow-sm py-4 px-4 sticky top-[65px] sm:top-[77px] z-30">
      <div className="max-w-7xl mx-auto space-y-3">
        
        {/* Row 1: Event Selector Chips (Barat, Valima, Mehndi, etc.) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <div className="flex items-center gap-1.5 text-xs font-bold text-festiva-burgundy mr-1 flex-shrink-0">
            <CalendarDays className="w-4 h-4 text-festiva-gold" />
            <span>Event:</span>
          </div>

          {EVENT_CATEGORIES.map((evt) => {
            const isActive = selectedEvent === evt.id;
            return (
              <button
                key={evt.id}
                onClick={() => setSelectedEvent(evt.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-festiva-burgundy text-white shadow-sm ring-2 ring-festiva-gold/40'
                    : 'bg-festiva-blush text-stone-700 hover:bg-festiva-sand border border-festiva-sand/80'
                }`}
              >
                {isActive && <Sparkles className="w-3 h-3 text-festiva-gold" />}
                <span>{evt.name}</span>
              </button>
            );
          })}
        </div>

        {/* Row 2: Categories, Sizes, Colors & Reset */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-stone-100 text-xs">
          
          <div className="flex flex-wrap items-center gap-2 sm:gap-4">
            
            {/* Category Dropdown */}
            <div className="flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-stone-500" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-festiva-blush border border-festiva-sand rounded-lg px-2.5 py-1 text-xs font-medium text-stone-800 focus:outline-none focus:border-festiva-burgundy cursor-pointer"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            {/* Size Selector */}
            <div className="flex items-center gap-1.5">
              <Ruler className="w-3.5 h-3.5 text-stone-500" />
              <select
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value)}
                className="bg-festiva-blush border border-festiva-sand rounded-lg px-2.5 py-1 text-xs font-medium text-stone-800 focus:outline-none focus:border-festiva-burgundy cursor-pointer"
              >
                {sizes.map((s) => (
                  <option key={s} value={s}>{s === 'All' ? 'All Sizes' : `Size: ${s}`}</option>
                ))}
              </select>
            </div>

            {/* Color Swatches */}
            <div className="hidden md:flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-stone-500" />
              <span className="text-stone-500 text-[11px]">Color:</span>
              <div className="flex items-center gap-1">
                {COLOR_PALETTE.map((c) => {
                  const isSelected = selectedColor === c.name;
                  return (
                    <button
                      key={c.name}
                      onClick={() => setSelectedColor(isSelected ? null : c.name)}
                      title={c.name}
                      className={`w-4 h-4 rounded-full transition-transform ${
                        isSelected ? 'scale-125 ring-2 ring-festiva-burgundy ring-offset-1' : 'hover:scale-110'
                      } ${c.border ? 'border border-stone-300' : ''}`}
                      style={{ backgroundColor: c.hex }}
                    />
                  );
                })}
                {selectedColor && (
                  <button 
                    onClick={() => setSelectedColor(null)}
                    className="text-[10px] text-stone-400 hover:text-stone-700 underline ml-1"
                  >
                    clear
                  </button>
                )}
              </div>
            </div>

            {/* Official Mamas Collection toggle */}
            <button
              onClick={() => setOnlyOfficial(!onlyOfficial)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-semibold transition-all ${
                onlyOfficial
                  ? 'bg-festiva-maroon text-festiva-lightgold border-festiva-gold'
                  : 'bg-festiva-blush text-stone-700 border-festiva-sand hover:bg-festiva-sand'
              }`}
            >
              <Store className="w-3.5 h-3.5 text-festiva-gold" />
              <span>Mamas Official Store Only</span>
            </button>

          </div>

          {/* Right Status & Reset */}
          <div className="flex items-center gap-3">
            <span className="text-stone-500 font-medium text-xs">
              Showing <b className="text-festiva-burgundy">{totalResults}</b> items in Quetta
            </span>

            {hasActiveFilters && (
              <button
                onClick={onResetFilters}
                className="flex items-center gap-1 text-[11px] text-rose-600 hover:text-rose-800 font-semibold"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
