import React from 'react';
import { VERAContent, LIBRARY_FILTERS } from '../types';

interface LibraryScreenProps {
  isNight: boolean;
  favorites: VERAContent[];
  onToggleFavorite: (content: VERAContent) => void;
}

export const LibraryScreen: React.FC<LibraryScreenProps> = ({ isNight, favorites, onToggleFavorite }) => {
  return (
    <div className="h-full pt-12 px-6 pb-24 animate-fade-in overflow-y-auto z-10 relative">
      <h2 className="font-altSerif text-5xl mb-8 text-center italic">Моё</h2>
      
      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto pb-6 -mx-6 px-6 no-scrollbar">
        {LIBRARY_FILTERS.map(f => (
           <span key={f.label} className={`flex-shrink-0 px-5 py-2 rounded-full text-xs font-medium border flex items-center gap-2 ${f.label === 'Все' ? 'border-vera-text bg-vera-text text-vera-bg' : 'border-vera-text/10 bg-white/40 backdrop-blur-sm'}`}>
             <span>{f.emoji}</span>
             <span>{f.label}</span>
           </span>
        ))}
      </div>

      <div className="grid gap-4">
        {favorites.map((item) => (
          <div key={item.id} className={`p-8 rounded-[32px] relative group backdrop-blur-md border ${isNight ? 'bg-white/5 border-white/5' : 'bg-white/70 border-white/40 shadow-sm hover:shadow-md'} transition-all`}>
             <div className="mb-4 flex justify-between items-center">
                <span className="px-3 py-1 rounded-full bg-white/50 text-[10px] uppercase tracking-wider opacity-60 font-bold">{item.tag}</span>
                <button onClick={() => onToggleFavorite(item)} className="text-xl hover:scale-110 transition-transform">
                   ❤️
                </button>
             </div>
             <p className="font-altSerif text-2xl leading-relaxed opacity-90">{item.text}</p>
          </div>
        ))}
        {favorites.length === 0 && (
           <div className="text-center opacity-40 py-20 flex flex-col items-center">
              <div className="text-6xl mb-4 grayscale opacity-30">🩰</div>
              <p className="font-serif italic text-xl">Пусто...</p>
              <p className="text-xs mt-2 uppercase tracking-widest">Сохраняй то, что отзывается</p>
           </div>
        )}
      </div>
    </div>
  );
};