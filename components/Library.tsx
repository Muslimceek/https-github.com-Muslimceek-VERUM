import React from 'react';
import { VERAContent } from '../types';

interface LibraryProps {
  items: VERAContent[];
  onRemove: (id: string) => void;
  onCopy: (text: string) => void;
}

export const Library: React.FC<LibraryProps> = ({ items, onRemove, onCopy }) => {
  const favorites = items.filter(i => i.isFavorite);

  if (favorites.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-8 animate-fade-in">
        <div className="w-24 h-24 bg-white/40 backdrop-blur-xl rounded-full mb-8 flex items-center justify-center shadow-glass">
            <svg className="text-ios-text/30" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>
        </div>
        <h2 className="text-2xl font-serif text-ios-text mb-2">Здесь пока тихо</h2>
        <p className="text-ios-subtext text-sm max-w-xs leading-relaxed">
          Собирай мысли, которые отзываются в сердце. Они будут жить здесь.
        </p>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-20 px-6 max-w-lg mx-auto animate-fade-in">
        <h2 className="text-4xl font-serif text-ios-text mb-1 text-center">Избранное</h2>
        <p className="text-center text-ios-subtext text-xs uppercase tracking-widest mb-10">Твоя коллекция</p>
        
        <div className="grid gap-6">
            {favorites.map((item, idx) => (
                <div 
                    key={item.id} 
                    className="bg-white/60 backdrop-blur-xl border border-white/50 p-8 rounded-[32px] shadow-sm relative group transition-transform hover:scale-[1.01]"
                    style={{ animationDelay: `${idx * 100}ms` }}
                >
                    <div className="flex justify-between items-start mb-6">
                        <span className="px-3 py-1 bg-white/50 rounded-full text-[10px] font-bold tracking-wider text-ios-subtext uppercase">
                            {item.tag}
                        </span>
                        <button 
                            onClick={() => onRemove(item.id)} 
                            className="w-8 h-8 flex items-center justify-center rounded-full bg-transparent hover:bg-rose-100 text-ios-subtext hover:text-rose-500 transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                        </button>
                    </div>
                    
                    <div className="font-serif text-ios-text text-lg leading-relaxed mb-6">
                        {item.blocks[0]}...
                    </div>
                    
                    <button 
                        onClick={() => onCopy(item.text)}
                        className="flex items-center gap-2 text-xs font-semibold text-ios-subtext hover:text-ios-text transition-colors"
                    >
                         <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                        Скопировать
                    </button>
                </div>
            ))}
        </div>
    </div>
  );
};