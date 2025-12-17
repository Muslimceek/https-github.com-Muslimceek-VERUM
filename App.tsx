import React, { useState, useEffect, useRef } from 'react';
import { TabBar } from './components/TabBar';
import { generateVeraWord, generateVeraLetter, generateJournalResponse } from './services/geminiService';
import { ScreenType, VERAContent, JournalEntry, SITUATIONS, LETTER_TYPES, LIBRARY_FILTERS } from './types';
import { v4 as uuidv4 } from 'uuid';

// --- Background Component ---
const LivingBackground = ({ isNight }: { isNight: boolean }) => (
  <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
    <div className={`absolute top-[-10%] left-[-10%] w-[80%] h-[50%] rounded-full blur-3xl opacity-40 mix-blend-multiply filter animate-blob ${isNight ? 'bg-[#4A403A]' : 'bg-[#E7C8C0]'}`}></div>
    <div className={`absolute top-[-10%] right-[-10%] w-[80%] h-[50%] rounded-full blur-3xl opacity-40 mix-blend-multiply filter animate-blob animation-delay-2000 ${isNight ? 'bg-[#3E3835]' : 'bg-[#E3D5CA]'}`}></div>
    <div className={`absolute bottom-[-20%] left-[20%] w-[80%] h-[50%] rounded-full blur-3xl opacity-40 mix-blend-multiply filter animate-blob animation-delay-4000 ${isNight ? 'bg-[#5C504A]' : 'bg-[#DCC6BA]'}`}></div>
  </div>
);

// --- Breathing Overlay Component ---
const BreathingOverlay = ({ onClose, isNight }: { onClose: () => void; isNight: boolean }) => {
  const [phase, setPhase] = useState<'Inhale' | 'Hold' | 'Exhale'>('Inhale');
  
  useEffect(() => {
    const cycle = () => {
      setPhase('Inhale'); // 4s
      setTimeout(() => {
        setPhase('Hold'); // 4s
        setTimeout(() => {
          setPhase('Exhale'); // 4s
          setTimeout(cycle, 4000);
        }, 4000);
      }, 4000);
    };
    cycle();
    return () => {}; // Cleanup not strictly needed for this simple version
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center backdrop-blur-3xl animate-fade-in bg-white/30 dark:bg-black/30">
       <button onClick={onClose} className="absolute top-8 right-8 p-4 opacity-60 hover:opacity-100 transition-opacity">
         <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
       </button>
       
       <div className={`relative flex items-center justify-center transition-all duration-[4000ms] ease-in-out ${phase === 'Inhale' ? 'scale-150' : phase === 'Exhale' ? 'scale-100' : 'scale-150'}`}>
          <div className={`w-48 h-48 rounded-full opacity-30 blur-xl ${isNight ? 'bg-vera-rose' : 'bg-vera-caramel'}`}></div>
          <div className={`absolute w-32 h-32 rounded-full opacity-80 shadow-2xl ${isNight ? 'bg-[#EAE0D5]' : 'bg-white'}`}></div>
       </div>

       <div className="mt-20 text-center font-serif text-2xl tracking-widest opacity-80 h-8">
          {phase === 'Inhale' && 'ВДОХ'}
          {phase === 'Hold' && 'ПАУЗА'}
          {phase === 'Exhale' && 'ВЫДОХ'}
       </div>
    </div>
  );
};

function App() {
  // State
  const [screen, setScreen] = useState<ScreenType>('ONBOARDING');
  const [isNight, setIsNight] = useState(false);
  const [loading, setLoading] = useState(false);
  const [favorites, setFavorites] = useState<VERAContent[]>([]);
  const [journal, setJournal] = useState<JournalEntry[]>([]);
  const [isBreathing, setIsBreathing] = useState(false);
  
  // Content States
  const [currentWord, setCurrentWord] = useState<VERAContent | null>(null);
  const [journalInput, setJournalInput] = useState('');
  const [homeInput, setHomeInput] = useState(''); 
  const [selectedLetterType, setSelectedLetterType] = useState<string | null>(null);

  // Refs needed for scrolling
  const journalEndRef = useRef<HTMLDivElement>(null);

  // Initialization & Night Mode Check
  useEffect(() => {
    // Load data
    const savedFavs = localStorage.getItem('vera_favorites');
    if (savedFavs) setFavorites(JSON.parse(savedFavs));
    
    const savedJournal = localStorage.getItem('vera_journal');
    if (savedJournal) setJournal(JSON.parse(savedJournal));

    const onboarded = localStorage.getItem('vera_onboarded_final');
    if (onboarded) setScreen('HOME');

    // Auto Night Mode (after 22:00 or before 06:00)
    const checkTime = () => {
      const hour = new Date().getHours();
      if (hour >= 22 || hour < 6) setIsNight(true);
    };
    checkTime();
    
    // Apply body class
    if (isNight) document.body.classList.add('night-mode');
    else document.body.classList.remove('night-mode');

  }, [isNight]);

  useEffect(() => {
    localStorage.setItem('vera_favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('vera_journal', JSON.stringify(journal));
  }, [journal]);

  // Actions
  const handleOnboardingFinish = () => {
    localStorage.setItem('vera_onboarded_final', 'true');
    setScreen('HOME');
  };

  const handleToggleNight = () => {
    setIsNight(!isNight);
  };

  const createContentObject = (text: string, type: VERAContent['type'], tag: string): VERAContent => {
    return {
      id: uuidv4(),
      text,
      blocks: text.split(/\n\s*\n/).filter(b => b.trim().length > 0),
      type,
      tag,
      timestamp: Date.now(),
      isFavorite: false
    };
  };

  const handleGenerateWord = async (situation: string) => {
    if (!situation.trim()) return;
    setLoading(true);
    try {
      const text = await generateVeraWord(situation);
      const tag = SITUATIONS.includes(situation) ? situation : "Личное";
      setCurrentWord(createContentObject(text, 'word', tag));
      setHomeInput(''); 
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateLetter = async (typeId: string) => {
    setLoading(true);
    const type = LETTER_TYPES.find(t => t.id === typeId);
    if (!type) return;
    try {
      const text = await generateVeraLetter(type.label, isNight ? 'на ночь, очень мягко' : 'глубоко и искренне');
      setCurrentWord(createContentObject(text, 'letter', type.label));
      setSelectedLetterType(null); 
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleJournalSubmit = async () => {
    if (!journalInput.trim()) return;
    setLoading(true);
    try {
      const responseText = await generateJournalResponse(journalInput);
      const veraResponse = createContentObject(responseText, 'journal_response', 'Дневник');
      
      const newEntry: JournalEntry = {
        id: uuidv4(),
        userText: journalInput,
        veraResponse,
        timestamp: Date.now()
      };
      
      setJournal(prev => [newEntry, ...prev]);
      setJournalInput('');
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = (content: VERAContent) => {
    const exists = favorites.find(f => f.id === content.id);
    if (exists) {
      setFavorites(prev => prev.filter(f => f.id !== content.id));
      if (currentWord?.id === content.id) {
        setCurrentWord({ ...currentWord, isFavorite: false });
      }
    } else {
      setFavorites(prev => [{ ...content, isFavorite: true }, ...prev]);
      if (currentWord?.id === content.id) {
        setCurrentWord({ ...currentWord, isFavorite: true });
      }
    }
  };

  // --- RENDERS ---

  const renderOnboarding = () => (
    <div className="h-screen flex flex-col justify-between p-8 animate-fade-in relative overflow-hidden z-10">
      <div className="absolute top-[-20%] left-[-20%] w-[140%] h-[60%] bg-vera-rose/20 rounded-[50%] blur-3xl" />
      
      <div className="relative z-10 pt-20">
        <h1 className="font-serif text-5xl mb-6 text-vera-text">VERA</h1>
        <p className="font-serif text-2xl leading-relaxed text-vera-text">
          Ты не обязана<br/>быть сильной<br/>всегда.
        </p>
      </div>

      <div className="relative z-10 pb-10">
        <p className="text-vera-textLight mb-10 text-sm">Здесь можно чувствовать. Без оценок. Без советов.</p>
        <button 
          onClick={handleOnboardingFinish}
          className="w-full bg-vera-text text-vera-bg py-5 rounded-full font-serif text-lg tracking-wide hover:opacity-90 transition-opacity"
        >
          Начать мягко
        </button>
      </div>
    </div>
  );

  const renderContentCard = (content: VERAContent) => (
    <div className="flex-1 flex flex-col justify-center pb-24 z-10 relative">
      <div className="px-6 mb-8 flex justify-between items-center opacity-0 animate-fade-in" style={{ animationDelay: '200ms' }}>
        <span className="text-xs uppercase tracking-[0.2em]">{content.tag}</span>
        <button onClick={() => setCurrentWord(null)} className="p-2">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
      </div>

      <div className="px-8 space-y-8 font-serif text-xl md:text-2xl text-center leading-relaxed">
        {content.blocks.map((block, idx) => (
          <p 
            key={idx} 
            className="cursor-pointer active:opacity-50 transition-opacity opacity-0 animate-delicate-reveal" 
            style={{ animationDelay: `${300 + (idx * 400)}ms` }}
            onClick={() => navigator.clipboard.writeText(block)}
          >
            {block}
          </p>
        ))}
      </div>

      <div className="mt-16 flex justify-center gap-6 opacity-0 animate-fade-in" style={{ animationDelay: `${400 + (content.blocks.length * 400)}ms` }}>
        <button 
          onClick={() => toggleFavorite(content)}
          className={`w-14 h-14 rounded-full flex items-center justify-center border transition-all duration-300 ${content.isFavorite ? 'bg-vera-rose border-vera-rose text-white' : 'border-vera-text/10 hover:bg-vera-text/5'}`}
        >
           <svg className={content.isFavorite ? 'fill-current' : ''} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
        </button>
        <button 
          onClick={() => navigator.clipboard.writeText(content.text)}
          className="w-14 h-14 rounded-full flex items-center justify-center border border-vera-text/10 hover:bg-vera-text/5 text-vera-text/60"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
        </button>
      </div>
    </div>
  );

  const renderHome = () => {
    if (loading) return (
      <div className="h-full flex flex-col items-center justify-center animate-breath z-10 relative">
        <div className="w-4 h-4 bg-vera-caramel rounded-full opacity-60"></div>
        <p className="mt-4 font-serif text-vera-text/50 tracking-widest text-sm">ЧУВСТВУЮ...</p>
      </div>
    );

    if (currentWord) return renderContentCard(currentWord);

    return (
      <div className="h-full flex flex-col pt-8 px-6 pb-24 animate-fade-in overflow-y-auto z-10 relative">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h2 className="font-serif text-3xl mb-1 text-vera-text">VERA</h2>
            <div className="flex items-center gap-2">
                <p className="text-vera-textLight text-sm">Поделись тем, что на сердце.</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setIsBreathing(true)} className="w-10 h-10 rounded-full glass-panel flex items-center justify-center opacity-70 hover:opacity-100 transition-opacity" title="Дыхание">
               <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4" className="opacity-50"/></svg>
            </button>
            <button onClick={handleToggleNight} className="w-10 h-10 rounded-full glass-panel flex items-center justify-center opacity-70 hover:opacity-100 transition-opacity">
                {isNight ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
                ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
                )}
            </button>
          </div>
        </div>

        {/* Custom Input Area */}
        <div className={`rounded-[32px] p-2 mb-10 transition-all focus-within:shadow-xl relative overflow-hidden backdrop-blur-sm ${isNight ? 'bg-white/5 focus-within:bg-white/10' : 'bg-white/80 shadow-sm focus-within:shadow-vera-rose/20'}`}>
           <textarea 
             value={homeInput}
             onChange={(e) => setHomeInput(e.target.value)}
             placeholder="Напиши, что происходит, о чем ты думаешь..."
             className="w-full bg-transparent p-5 min-h-[140px] resize-none focus:outline-none text-lg font-serif placeholder:opacity-40 leading-relaxed"
           />
           <div className="flex justify-between items-end px-2 pb-2">
             {homeInput && (
                 <button onClick={() => setHomeInput('')} className="p-3 opacity-40 hover:opacity-80 transition-opacity text-xs uppercase tracking-wider">
                     Сбросить
                 </button>
             )}
             <div className="flex-1"></div>
             <button 
                onClick={() => handleGenerateWord(homeInput)}
                disabled={!homeInput.trim()}
                className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium text-sm transition-all ${!homeInput.trim() ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100'} ${isNight ? 'bg-vera-rose text-vera-night' : 'bg-vera-text text-white shadow-lg'}`}
              >
                <span>Ответить</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
              </button>
           </div>
        </div>

        {/* Preset Chips */}
        <div className="mb-4">
          <p className="text-[10px] uppercase tracking-widest opacity-40 mb-4 ml-2">ИЛИ ВЫБЕРИ СЛОВО</p>
          <div className="grid grid-cols-2 gap-3">
            {SITUATIONS.map(sit => (
              <button
                key={sit}
                onClick={() => handleGenerateWord(sit)}
                className={`py-4 px-5 rounded-[20px] text-left text-sm transition-transform active:scale-[0.98] backdrop-blur-sm ${isNight ? 'bg-white/5 hover:bg-white/10' : 'bg-white/80 hover:bg-white shadow-sm/50'}`}
              >
                {sit}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderLetters = () => {
    if (loading) return (
        <div className="h-full flex flex-col items-center justify-center animate-breath z-10 relative">
          <p className="font-serif text-vera-text/50 tracking-widest text-sm">ПИШУ...</p>
        </div>
    );
    if (currentWord) return renderContentCard(currentWord);

    return (
      <div className="h-full pt-12 px-6 pb-24 animate-fade-in overflow-y-auto z-10 relative">
        <h2 className="font-serif text-3xl mb-8">Письма</h2>
        <div className="space-y-4">
          {LETTER_TYPES.map(type => (
            <button
              key={type.id}
              onClick={() => handleGenerateLetter(type.id)}
              className={`w-full p-6 rounded-[24px] text-left transition-transform active:scale-[0.98] backdrop-blur-sm ${isNight ? 'bg-white/5' : 'bg-white/80 shadow-sm'}`}
            >
              <h3 className="font-serif text-xl mb-1">{type.label}</h3>
              <p className="text-xs opacity-60 uppercase tracking-wider">{type.prompt}</p>
            </button>
          ))}
        </div>
      </div>
    );
  };

  const renderJournal = () => (
    <div className="h-full pt-12 px-6 pb-24 flex flex-col animate-fade-in z-10 relative">
      <h2 className="font-serif text-3xl mb-6 flex-shrink-0">Дневник</h2>
      
      {/* List */}
      <div className="flex-1 overflow-y-auto space-y-8 mb-6 pr-2">
        {journal.length === 0 && (
          <div className="text-center opacity-40 mt-20">
            <p className="font-serif text-lg">Здесь тишина.</p>
            <p className="text-sm mt-2">Напиши, что чувствуешь,<br/>и я отвечу.</p>
          </div>
        )}
        {journal.map(entry => (
          <div key={entry.id} className="animate-slide-up">
            <div className={`p-4 rounded-2xl rounded-tr-none mb-3 ml-8 text-sm leading-relaxed backdrop-blur-sm ${isNight ? 'bg-vera-caramel/20' : 'bg-vera-caramel/10'}`}>
              {entry.userText}
            </div>
            {entry.veraResponse && (
               <div className="mr-8">
                 <div className="flex items-center gap-2 mb-2 opacity-50">
                    <div className="w-1 h-1 bg-current rounded-full"></div>
                    <span className="text-[10px] uppercase tracking-widest">VERA</span>
                 </div>
                 <div className="font-serif text-lg leading-relaxed pl-3 border-l border-vera-text/10">
                    {entry.veraResponse.blocks.map((b, i) => <p key={i} className="mb-2">{b}</p>)}
                 </div>
               </div>
            )}
          </div>
        ))}
        <div ref={journalEndRef} />
      </div>

      {/* Input */}
      <div className={`relative rounded-3xl p-1 backdrop-blur-sm ${isNight ? 'bg-white/5' : 'bg-white shadow-lg shadow-vera-rose/10'}`}>
        <textarea
          value={journalInput}
          onChange={(e) => setJournalInput(e.target.value)}
          placeholder="Я чувствую..."
          className="w-full bg-transparent p-4 min-h-[60px] max-h-[120px] focus:outline-none resize-none text-base"
        />
        <div className="flex justify-end px-2 pb-2">
          <button 
            disabled={loading || !journalInput.trim()}
            onClick={handleJournalSubmit}
            className="w-10 h-10 bg-vera-text text-vera-bg rounded-full flex items-center justify-center disabled:opacity-50"
          >
            {loading ? (
                <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
            ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );

  const renderLibrary = () => (
    <div className="h-full pt-12 px-6 pb-24 animate-fade-in overflow-y-auto z-10 relative">
      <h2 className="font-serif text-3xl mb-8 text-center">Моё</h2>
      
      {/* Filters (Visual only for MVP) */}
      <div className="flex gap-2 overflow-x-auto pb-6 -mx-6 px-6 no-scrollbar">
        {LIBRARY_FILTERS.map(f => (
           <span key={f} className={`flex-shrink-0 px-4 py-2 rounded-full text-xs border ${f === 'Все' ? 'border-vera-text bg-vera-text text-vera-bg' : 'border-vera-text/20 opacity-60'}`}>
             {f}
           </span>
        ))}
      </div>

      <div className="grid gap-4">
        {favorites.map((item) => (
          <div key={item.id} className={`p-6 rounded-[24px] relative group backdrop-blur-sm ${isNight ? 'bg-white/5' : 'bg-white/80'}`}>
             <div className="mb-3 flex justify-between">
                <span className="text-[10px] uppercase tracking-wider opacity-50">{item.tag}</span>
                <button onClick={() => toggleFavorite(item)} className="text-vera-rose">
                   <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                </button>
             </div>
             <p className="font-serif text-lg leading-relaxed line-clamp-4">{item.text}</p>
          </div>
        ))}
        {favorites.length === 0 && (
           <div className="text-center opacity-40 py-20">
              Пусто. Сохраняй то,<br/>что отзывается.
           </div>
        )}
      </div>
    </div>
  );

  if (screen === 'ONBOARDING') return (
    <>
        <LivingBackground isNight={isNight} />
        {renderOnboarding()}
    </>
  );

  return (
    <div className={`h-screen flex flex-col ${isNight ? 'text-[#EAE0D5]' : 'text-[#2A2A2A]'}`}>
      <LivingBackground isNight={isNight} />
      {isBreathing && <BreathingOverlay onClose={() => setIsBreathing(false)} isNight={isNight} />}
      <div className="flex-1 relative overflow-hidden">
         {screen === 'HOME' && renderHome()}
         {screen === 'LETTERS' && renderLetters()}
         {screen === 'JOURNAL' && renderJournal()}
         {screen === 'LIBRARY' && renderLibrary()}
      </div>
      <TabBar activeScreen={screen} onNavigate={(s) => { setScreen(s); setCurrentWord(null); }} isNight={isNight} />
    </div>
  );
}

export default App;