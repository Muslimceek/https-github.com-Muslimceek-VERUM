import React, { useState } from 'react';
import { GeneratedContent } from '../types';
import { Button } from './Button';

interface ResultCardProps {
  content: GeneratedContent;
  onSave: (id: string) => void;
  onGenerateAgain: () => void;
}

export const ResultCard: React.FC<ResultCardProps> = ({ content, onSave, onGenerateAgain }) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);

  const handleCopyBlock = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleCopyAll = () => {
    navigator.clipboard.writeText(content.text);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  return (
    <div className="w-full max-w-xl mx-auto animate-slide-up">
      <div className="bg-verum-graphite p-8 md:p-12 relative overflow-hidden border border-white/5 shadow-2xl">
        {/* Background Accent */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-verum-gold/5 blur-[50px] rounded-full pointer-events-none" />
        
        {/* Topic Header */}
        <div className="mb-8 text-center border-b border-white/10 pb-4">
            <span className="text-verum-gold text-xs uppercase tracking-[0.2em] mb-2 block">Тема</span>
            <h2 className="text-xl font-serif text-verum-white/90">{content.theme}</h2>
        </div>

        {/* Content Blocks */}
        <div className="space-y-8 font-serif text-lg md:text-xl leading-relaxed text-center text-verum-white">
          {content.blocks.map((block, idx) => (
            <div 
              key={idx} 
              className="relative group cursor-pointer transition-all hover:text-verum-gold"
              onClick={() => handleCopyBlock(block, idx)}
            >
              <div className="whitespace-pre-line">{block}</div>
              
              {/* Tooltip for copy */}
              <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/80 px-3 py-1 text-xs text-white rounded opacity-0 transition-opacity pointer-events-none ${copiedIndex === idx ? '!opacity-100' : 'group-hover:opacity-40'}`}>
                {copiedIndex === idx ? 'СКОПИРОВАНО' : 'КОПИРОВАТЬ'}
              </div>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="my-8 flex justify-center">
            <div className="w-1 h-1 bg-verum-gold rounded-full mx-1"></div>
            <div className="w-1 h-1 bg-verum-gold rounded-full mx-1"></div>
            <div className="w-1 h-1 bg-verum-gold rounded-full mx-1"></div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-4">
            <div className="flex gap-4 justify-center">
                <Button variant="secondary" onClick={handleCopyAll} className="flex-1">
                    {copiedAll ? 'СКОПИРОВАНО' : 'КОПИРОВАТЬ ВСЁ'}
                </Button>
                <button 
                    onClick={() => onSave(content.id)}
                    className={`px-4 border transition-colors ${content.isFavorite ? 'border-verum-gold text-verum-gold bg-verum-gold/10' : 'border-verum-graphite text-verum-gray hover:text-white'}`}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill={content.isFavorite ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                    </svg>
                </button>
            </div>
            
            <Button variant="ghost" onClick={onGenerateAgain} className="text-xs tracking-widest opacity-60 hover:opacity-100">
                СГЕНЕРИРОВАТЬ ЕЩЁ
            </Button>
        </div>

        <div className="mt-6 text-center">
            <p className="text-[10px] text-verum-gray uppercase tracking-widest opacity-40">
                Основано на реальных мыслях
            </p>
        </div>
      </div>
    </div>
  );
};