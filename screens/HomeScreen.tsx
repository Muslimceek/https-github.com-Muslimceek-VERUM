import React, { useState } from 'react';
import { ResultCard } from '../components/ResultCard';
import { VERAContent, SITUATIONS } from '../types';

interface HomeScreenProps {
  isNight: boolean;
  loading: boolean;
  currentWord: VERAContent | null;
  onGenerateWord: (situation: string) => Promise<void>;
  onClearWord: () => void;
  onToggleFavorite: (content: VERAContent) => void;
  onBreath: () => void;
  onToggleNight: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  isNight,
  loading,
  currentWord,
  onGenerateWord,
  onClearWord,
  onToggleFavorite,
  onBreath,
  onToggleNight
}) => {
  const [homeInput, setHomeInput] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleGenerate = () => {
    if (homeInput.trim()) {
      onGenerateWord(homeInput);
      setHomeInput('');
    }
  };

  if (loading) return (
    <div className="h-full flex flex-col items-center justify-center animate-breath z-10 relative">
      <div className={`w-32 h-32 rounded-full blur-[60px] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ${isNight ? 'bg-vera-rose/20' : 'bg-vera-peach/40'}`}></div>
      <div className="relative z-10 flex flex-col items-center">
        <div className="text-4xl mb-6 animate-bounce">🕊️</div>
        <p className="font-altSerif text-2xl italic text-vera-text opacity-70 tracking-wide">Чувствую тебя...</p>
      </div>
    </div>
  );

  if (currentWord) {
    return (
      <div className="flex-1 flex flex-col justify-center pb-24 z-10 relative pt-12 animate-fade-in">
        <div className="px-8 mb-4 flex justify-between items-center">
            <span className="text-[10px] uppercase tracking-[0.3em] font-sans opacity-40">{currentWord.tag}</span>
            <button 
                onClick={onClearWord} 
                className="w-10 h-10 rounded-full flex items-center justify-center bg-white/30 hover:bg-white/50 backdrop-blur-md transition-colors"
            >
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
    <div className="h-full flex flex-col pt-6 px-6 pb-28 animate-fade-in overflow-y-auto z-10 relative no-scrollbar">
      
      {/* Top Controls (Floating) */}
      <div className="flex justify-between items-center mb-8 relative z-20">
         <button onClick={onToggleNight} className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 backdrop-blur-md border text-xl ${isNight ? 'bg-white/10 border-white/10 text-white' : 'bg-white/40 border-white/40 shadow-sm'}`}>
              {isNight ? '🌙' : '☀️'}
         </button>

         <button onClick={onBreath} className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 backdrop-blur-md border text-xl ${isNight ? 'bg-white/10 border-white/10' : 'bg-white/40 border-white/40 shadow-sm'}`}>
             🌬️
         </button>
      </div>

      {/* Editorial Header */}
      <div className="text-center mb-10 relative">
          <h1 className="font-altSerif text-[5rem] leading-[0.8] tracking-tighter text-vera-text opacity-90 italic">
              Vera
          </h1>
          <div className="h-px w-12 bg-vera-text/20 mx-auto mt-4 mb-4"></div>
          <p className="font-serif text-sm tracking-widest text-vera-textLight uppercase opacity-60">
              Пространство тишины
          </p>
      </div>

      {/* Main Input Area - "The Paper" */}
      <div className={`relative group transition-all duration-700 mb-10 ${isFocused ? 'scale-[1.02]' : 'scale-100'}`}>
         {/* Glow effect behind */}
         <div className={`absolute -inset-1 rounded-[40px] blur-xl opacity-40 transition duration-1000 group-hover:opacity-60 ${isNight ? 'bg-gradient-to-r from-vera-rose/20 to-purple-900/20' : 'bg-gradient-to-r from-vera-peach/50 to-vera-rose/50'}`}></div>
         
         <div className={`relative rounded-[36px] overflow-hidden backdrop-blur-xl transition-colors duration-500 border ${isNight ? 'bg-white/5 border-white/10' : 'bg-white/60 border-white/40 shadow-[0_8px_32px_rgba(231,200,192,0.15)]'}`}>
            <textarea 
               value={homeInput}
               onChange={(e) => setHomeInput(e.target.value)}
               onFocus={() => setIsFocused(true)}
               onBlur={() => setIsFocused(false)}
               placeholder="О чем молчит твое сердце?"
               className={`w-full bg-transparent p-8 min-h-[180px] resize-none focus:outline-none text-2xl md:text-3xl font-altSerif placeholder:opacity-40 placeholder:italic leading-normal text-center flex items-center justify-center ${isNight ? 'placeholder:text-white/30' : 'placeholder:text-vera-text/30'}`}
               style={{ fontStyle: homeInput ? 'normal' : 'italic' }}
            />
            
            {/* Action Bar inside the card */}
            <div className={`flex justify-between items-center px-4 pb-4 transition-opacity duration-500 ${homeInput ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                 <button onClick={() => setHomeInput('')} className="p-4 text-[10px] uppercase tracking-widest opacity-40 hover:opacity-100 transition-opacity">
                     Стереть
                 </button>
                 
                 <button 
                    onClick={handleGenerate}
                    className={`h-12 px-8 rounded-full flex items-center gap-3 transition-all duration-500 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 ${isNight ? 'bg-vera-rose text-vera-night' : 'bg-vera-text text-[#FFFCF8]'}`}
                 >
                    <span className="font-serif italic text-lg pr-1">Отпустить</span>
                    <span className="text-xl">🕊️</span>
                 </button>
            </div>
         </div>
      </div>

      {/* Organic Chips layout */}
      <div className="relative">
          <div className="flex items-center gap-4 mb-6 opacity-40 justify-center">
              <div className="h-px flex-1 bg-current"></div>
              <span className="text-[10px] uppercase tracking-[0.2em]">Или выбери</span>
              <div className="h-px flex-1 bg-current"></div>
          </div>
          
          <div className="flex flex-wrap justify-center gap-3 pb-8">
            {SITUATIONS.map((sit, idx) => (
              <button
                key={sit.text}
                onClick={() => onGenerateWord(sit.text)}
                style={{ animationDelay: `${idx * 100}ms` }}
                className={`animate-slide-up pl-4 pr-5 py-3 rounded-full text-base font-altSerif transition-all duration-500 border hover:scale-105 active:scale-95 flex items-center gap-2
                  ${isNight 
                    ? 'bg-white/5 border-white/10 hover:bg-white/10 text-white/80' 
                    : 'bg-white/50 border-white/40 hover:bg-white text-vera-text shadow-sm hover:shadow-md'
                  }`}
              >
                <span className="text-lg opacity-80">{sit.emoji}</span>
                <span>{sit.text}</span>
              </button>
            ))}
          </div>
      </div>
    </div>
  );
};