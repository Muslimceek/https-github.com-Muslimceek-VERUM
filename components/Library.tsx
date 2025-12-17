import React from 'react';
import { GeneratedContent } from '../types';

interface LibraryProps {
  items: GeneratedContent[];
  onRemove: (id: string) => void;
  onCopy: (text: string) => void;
}

export const Library: React.FC<LibraryProps> = ({ items, onRemove, onCopy }) => {
  const favorites = items.filter(i => i.isFavorite);

  const handleCopy = (text: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onCopy(text);
  };

  if (favorites.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6 animate-fade-in">
        <div className="w-16 h-16 border border-verum-gray/30 rotate-45 mb-8 flex items-center justify-center">
            <div className="w-2 h-2 bg-verum-gray/30 rounded-full"></div>
        </div>
        <h2 className="text-2xl font-serif text-verum-white mb-4">Пустота</h2>
        <p className="text-verum-gray max-w-sm">
          Сохраняйте мысли, которые откликаются, чтобы вернуться к ним позже.
        </p>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-12 px-6 max-w-3xl mx-auto animate-fade-in">
        <h2 className="text-3xl font-serif text-verum-gold mb-12 text-center">Избранное</h2>
        <div className="grid gap-6">
            {favorites.map((item) => (
                <div key={item.id} className="bg-verum-graphite border border-white/5 p-6 md:p-8 relative group hover:border-verum-gold/30 transition-colors">
                    <div className="mb-4 flex justify-between items-start">
                         <span className="text-[10px] uppercase tracking-widest text-verum-gold/70">{item.theme}</span>
                         <button onClick={() => onRemove(item.id)} className="text-verum-gray hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                         </button>
                    </div>
                    <div className="font-serif text-verum-white/90 text-lg whitespace-pre-line mb-6 leading-relaxed">
                        {item.blocks[0]}...
                    </div>
                    <button 
                        onClick={(e) => handleCopy(item.text, e)}
                        className="text-xs uppercase tracking-wider text-verum-gray hover:text-verum-white border-b border-transparent hover:border-verum-white pb-1 transition-all"
                    >
                        Скопировать целиком
                    </button>
                </div>
            ))}
        </div>
    </div>
  );
};