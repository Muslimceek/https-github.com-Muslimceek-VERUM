import React from 'react';
import { ResultCard } from '../components/ResultCard';
import { VERAContent, LETTER_TYPES } from '../types';

interface LettersScreenProps {
  isNight: boolean;
  loading: boolean;
  currentWord: VERAContent | null;
  onGenerateLetter: (typeId: string) => Promise<void>;
  onClearWord: () => void;
  onToggleFavorite: (content: VERAContent) => void;
}

export const LettersScreen: React.FC<LettersScreenProps> = ({
  isNight,
  loading,
  currentWord,
  onGenerateLetter,
  onClearWord,
  onToggleFavorite
}) => {
  if (loading) return (
      <div className="h-full flex flex-col items-center justify-center animate-breath z-10 relative">
        <div className="text-4xl mb-4 animate-bounce">🖋️</div>
        <p className="font-serif text-vera-text/50 tracking-widest text-sm">ПИШУ...</p>
      </div>
  );

  if (currentWord) {
    return (
        <div className="flex-1 flex flex-col justify-center pb-24 z-10 relative pt-12">
            <div className="px-6 mb-8 flex justify-between items-center opacity-0 animate-fade-in" style={{ animationDelay: '200ms' }}>
                <span className="text-xs uppercase tracking-[0.2em]">{currentWord.tag}</span>
                <button onClick={onClearWord} className="p-2 w-10 h-10 rounded-full bg-white/30 hover:bg-white/50 flex items-center justify-center">
                    ✕
                </button>
            </div>
            <ResultCard 
                content={currentWord} 
                onSave={() => onToggleFavorite(currentWord)} 
                onGenerateAgain={() => { onClearWord(); }} 
            />
        </div>
    );
  }

  return (
    <div className="h-full pt-12 px-6 pb-24 animate-fade-in overflow-y-auto z-10 relative">
      <h2 className="font-altSerif text-5xl mb-2 text-center italic">Письма</h2>
      <p className="text-center text-xs uppercase tracking-widest opacity-50 mb-10">Слова, которых ты ждала</p>
      
      <div className="grid gap-4">
        {LETTER_TYPES.map(type => (
          <button
            key={type.id}
            onClick={() => onGenerateLetter(type.id)}
            className={`w-full p-6 rounded-[32px] text-left transition-all hover:scale-[1.02] active:scale-[0.98] backdrop-blur-md border group ${isNight ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-white/60 border-white/40 shadow-sm hover:shadow-md'}`}
          >
            <div className="flex justify-between items-start mb-2">
                 <h3 className="font-altSerif text-3xl italic">{type.label}</h3>
                 <span className="text-3xl group-hover:scale-110 transition-transform duration-500">{type.emoji}</span>
            </div>
            <p className="text-xs opacity-60 uppercase tracking-wider pl-1">{type.prompt}</p>
          </button>
        ))}
      </div>
    </div>
  );
};