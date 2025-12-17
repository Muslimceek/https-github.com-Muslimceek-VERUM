import React, { useState } from 'react';
import { VERAContent } from '../types';
import { Button } from './Button';

interface ResultCardProps {
  content: VERAContent;
  onSave: (id: string) => void;
  onGenerateAgain: () => void;
}

export const ResultCard: React.FC<ResultCardProps> = ({ content, onSave, onGenerateAgain }) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopyBlock = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="w-full max-w-lg mx-auto animate-slide-up pb-20">
      <div className="relative">
        {/* Soft Glow behind card */}
        <div className="absolute inset-0 bg-gradient-to-tr from-ios-rose/30 to-ios-blue/30 blur-[60px] rounded-full transform scale-90" />
        
        <div className="relative bg-ios-surface backdrop-blur-2xl rounded-[40px] p-8 md:p-10 shadow-glass border border-white/50 overflow-hidden">
          
          {/* Header */}
          <div className="flex justify-between items-center mb-8 opacity-60">
             <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-ios-text">{content.tag}</span>
             <span className="text-[10px] font-mono">{new Date().toLocaleDateString()}</span>
          </div>

          {/* Text Content */}
          <div className="space-y-8 font-serif text-xl md:text-2xl leading-relaxed text-center text-ios-text">
            {content.blocks.map((block, idx) => (
              <div 
                key={idx} 
                className="cursor-pointer active:scale-[0.98] transition-transform duration-300 select-none relative"
                onClick={() => handleCopyBlock(block, idx)}
              >
                <p className={`transition-opacity duration-300 ${copiedIndex === idx ? 'opacity-40' : 'opacity-100'}`}>
                  {block}
                </p>
                {copiedIndex === idx && (
                    <span className="absolute inset-0 flex items-center justify-center text-xs font-sans font-bold text-ios-primary tracking-widest animate-fade-in">
                        СОХРАНЕНО
                    </span>
                )}
              </div>
            ))}
          </div>

          {/* Decorative Divider */}
          <div className="my-10 flex justify-center opacity-30">
              <svg width="40" height="10" viewBox="0 0 40 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="20" cy="5" r="3" fill="#2D2D2D"/>
                  <circle cx="5" cy="5" r="2" fill="#2D2D2D"/>
                  <circle cx="35" cy="5" r="2" fill="#2D2D2D"/>
              </svg>
          </div>

          {/* Action Bar */}
          <div className="flex items-center justify-between gap-4 pt-2">
              <button 
                  onClick={onGenerateAgain}
                  className="w-12 h-12 rounded-full bg-white/50 flex items-center justify-center text-ios-text hover:bg-white transition-colors border border-white/40"
              >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M16 21h5v-5"/></svg>
              </button>

              <button 
                  onClick={() => onSave(content.id)}
                  className={`flex-1 h-12 rounded-full flex items-center justify-center gap-2 font-semibold text-sm transition-all duration-300 ${content.isFavorite ? 'bg-ios-primary text-white shadow-lg' : 'bg-white/50 text-ios-text border border-white/40'}`}
              >
                  {content.isFavorite ? (
                      <>
                        <svg className="fill-current" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>
                        <span>В ДУШЕ</span>
                      </>
                  ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>
                        <span>СОХРАНИТЬ</span>
                      </>
                  )}
              </button>
          </div>
        </div>
      </div>
    </div>
  );
};