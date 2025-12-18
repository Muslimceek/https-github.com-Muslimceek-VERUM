import React, { useState } from 'react';
import { ResultCard } from '../components/ResultCard';
import { VERAContent, SITUATIONS } from '../types';

interface HomeScreenProps {
  isNight: boolean;
  loading: boolean;
  userName?: string;
  currentWord: VERAContent | null;
  onGenerateWord: (situation: string) => Promise<void>;
  onClearWord: () => void;
  onToggleFavorite: (content: VERAContent) => void;
  onBreath: () => void;
  onToggleNight: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  isNight, loading, userName, currentWord,
  onGenerateWord, onClearWord, onToggleFavorite, onBreath, onToggleNight
}) => {
  const [homeInput, setHomeInput] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleJoinChannel = () => {
    if (window.amplitude && typeof window.amplitude.getInstance === 'function') {
      try {
        window.amplitude.getInstance().logEvent('channel_join_click');
      } catch (e) {
        console.warn("Amplitude log event failed:", e);
      }
    }
    window.open('https://t.me/verum_coquette', '_blank');
  };

  if (loading) return (
    <div className="h-full flex flex-col items-center justify-center animate-breath z-10 relative">
      <div className={`w-32 h-32 rounded-full blur-[60px] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ${isNight ? 'bg-vera-rose/20' : 'bg-vera-peach/40'}`}></div>
      <p className="font-altSerif text-2xl italic opacity-70">Слушаю сердце...</p>
    </div>
  );

  if (currentWord) return (
    <div className="flex-1 flex flex-col justify-center pb-24 z-10 relative pt-12 animate-fade-in">
        <div className="px-8 mb-4 flex justify-between items-center">
            <span className="text-[10px] uppercase tracking-widest opacity-40">{currentWord.tag}</span>
            <button onClick={onClearWord} className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">✕</button>
        </div>
        <ResultCard content={currentWord} onSave={() => onToggleFavorite(currentWord)} onGenerateAgain={onClearWord} />
    </div>
  );

  return (
    <div className="h-full flex flex-col pt-6 px-6 pb-28 animate-fade-in overflow-y-auto z-10 relative no-scrollbar">
      <div className="flex justify-between items-center mb-10 relative z-20">
         <button onClick={onToggleNight} className="w-10 h-10 rounded-full flex items-center justify-center bg-white/10 backdrop-blur-md border border-white/20">
              {isNight ? '🌙' : '☀️'}
         </button>
         <button onClick={handleJoinChannel} className="px-4 py-1.5 rounded-full text-[10px] uppercase tracking-widest font-bold bg-white/10 border border-white/10 animate-pulse">
            Наш канал ✨
         </button>
         <button onClick={onBreath} className="w-10 h-10 rounded-full flex items-center justify-center bg-white/10 backdrop-blur-md border border-white/20">
             🌬️
         </button>
      </div>

      <div className="text-center mb-12">
          <p className="text-[10px] uppercase tracking-[0.4em] opacity-50 mb-2">
              {userName ? `Здравствуй, ${userName}` : 'Здравствуй'}
          </p>
          <h1 className="font-altSerif text-7xl leading-none italic opacity-90">Vera</h1>
      </div>

      <div className={`relative transition-all duration-700 mb-10 ${isFocused ? 'scale-[1.02]' : ''}`}>
         <div className="relative rounded-[36px] overflow-hidden backdrop-blur-xl border border-white/20 bg-white/10 shadow-glass">
            <textarea 
               value={homeInput}
               onChange={(e) => setHomeInput(e.target.value)}
               onFocus={() => setIsFocused(true)}
               onBlur={() => setIsFocused(false)}
               placeholder="О чем ты молчишь?"
               className="w-full bg-transparent p-8 min-h-[200px] resize-none focus:outline-none text-2xl font-altSerif text-center placeholder:opacity-30 italic leading-relaxed"
            />
            {homeInput && (
                <div className="flex justify-center pb-6">
                    <button onClick={() => onGenerateWord(homeInput)} className="px-10 py-3 rounded-full bg-vera-text text-white font-serif italic text-lg shadow-xl hover:scale-105 transition-transform">
                        Отпустить 🕊️
                    </button>
                </div>
            )}
         </div>
      </div>

      <div className="flex flex-wrap justify-center gap-3">
        {SITUATIONS.map(sit => (
          <button key={sit.text} onClick={() => onGenerateWord(sit.text)} className="px-5 py-3 rounded-full text-sm font-altSerif border border-white/10 bg-white/5 hover:bg-white/10 transition-all flex items-center gap-2">
            <span>{sit.emoji}</span>
            <span>{sit.text}</span>
          </button>
        ))}
      </div>
    </div>
  );
};