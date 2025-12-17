import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { ResultCard } from './components/ResultCard';
import { Button } from './components/Button';
import { Library } from './components/Library';
import { generateVerumWisdom } from './services/geminiService';
import { AppScreen, GeneratedContent, StyleOptions, ToneType, MoodType, EXAMPLE_PROMPTS } from './types';
import { v4 as uuidv4 } from 'uuid';

// Helper for simple UUID if package not available in env
const generateId = () => Math.random().toString(36).substr(2, 9);

function App() {
  const [screen, setScreen] = useState<AppScreen>(AppScreen.SPLASH);
  const [inputValue, setInputValue] = useState('');
  const [style, setStyle] = useState<StyleOptions>({ tone: 'masculine', mood: 'hard' });
  const [loading, setLoading] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
  const [library, setLibrary] = useState<GeneratedContent[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Load library from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem('verum_library');
    if (saved) {
      setLibrary(JSON.parse(saved));
    }
    
    // Splash screen timer
    const timer = setTimeout(() => {
      // Check if user has seen onboarding
      const onboarded = localStorage.getItem('verum_onboarded');
      setScreen(onboarded ? AppScreen.HOME : AppScreen.ONBOARDING);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  // Save library to local storage on change
  useEffect(() => {
    localStorage.setItem('verum_library', JSON.stringify(library));
  }, [library]);

  const handleFinishOnboarding = () => {
    localStorage.setItem('verum_onboarded', 'true');
    setScreen(AppScreen.HOME);
  };

  const handleGenerate = async () => {
    if (!inputValue.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const text = await generateVerumWisdom(inputValue, style);
      
      // Split text into blocks based on double newlines
      const blocks = text.split(/\n\s*\n/).filter(b => b.trim().length > 0);

      const content: GeneratedContent = {
        id: generateId(),
        text: text,
        blocks: blocks,
        theme: inputValue,
        timestamp: Date.now(),
        isFavorite: false,
        style: { ...style }
      };

      setGeneratedContent(content);
    } catch (err) {
      setError("Не удалось поймать мысль. Попробуйте еще раз.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveToggle = (id: string) => {
    if (generatedContent && generatedContent.id === id) {
      const updated = { ...generatedContent, isFavorite: !generatedContent.isFavorite };
      setGeneratedContent(updated);
      
      if (updated.isFavorite) {
        setLibrary(prev => [updated, ...prev]);
      } else {
        setLibrary(prev => prev.filter(item => item.id !== id));
      }
    } else {
        // Removing from library view
        setLibrary(prev => prev.filter(item => item.id !== id));
    }
  };

  const copyToClipboard = (text: string) => {
      navigator.clipboard.writeText(text);
      // Could add toast notification here
  };

  // --- RENDER FUNCTIONS ---

  if (screen === AppScreen.SPLASH) {
    return (
      <div className="fixed inset-0 bg-verum-black flex items-center justify-center z-50">
        <div className="text-center animate-fade-in">
           <div className="w-20 h-20 border-2 border-verum-gold mx-auto mb-6 flex items-center justify-center rotate-45">
              <span className="text-4xl text-verum-gold font-serif font-bold -rotate-45">V</span>
           </div>
           <h1 className="text-3xl font-serif text-verum-white tracking-[0.3em] mb-2">VERUM</h1>
           <p className="text-verum-gray text-sm tracking-widest opacity-0 animate-[fadeIn_2s_1s_forwards]">СЛОВА, КОТОРЫЕ УЖЕ ПРОЖИТЫ</p>
        </div>
      </div>
    );
  }

  if (screen === AppScreen.ONBOARDING) {
    return (
      <div className="min-h-screen bg-verum-black flex flex-col items-center justify-center p-8 relative overflow-hidden">
        <div className="absolute top-[-20%] left-[-20%] w-[50%] h-[50%] bg-verum-gold/5 blur-[100px] rounded-full pointer-events-none" />
        
        <div className="max-w-md w-full text-center space-y-8 relative z-10 animate-slide-up">
           <h2 className="text-4xl font-serif text-verum-white leading-tight">
             Не выдумка.<br/>
             <span className="text-verum-gold italic">Смысл.</span>
           </h2>
           <p className="text-verum-gray text-lg font-light leading-relaxed">
             Генерируй мысли, основанные на реальном опыте. Для тех, кто ценит глубину, а не пустые фразы.
           </p>
           
           <div className="pt-8">
             <Button onClick={handleFinishOnboarding}>НАЧАТЬ</Button>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-verum-black text-verum-white font-sans selection:bg-verum-gold selection:text-verum-black">
      <Header currentScreen={screen} onNavigate={setScreen} />

      <main className="min-h-screen flex flex-col">
        {screen === AppScreen.HOME && (
          <div className="flex-1 flex flex-col justify-center items-center px-4 py-24 md:px-0">
            
            {!generatedContent || loading ? (
              <div className="w-full max-w-xl animate-fade-in">
                 <div className="text-center mb-12">
                   <h1 className="text-3xl md:text-5xl font-serif mb-4">Направление мысли</h1>
                   <p className="text-verum-gray">О чем нужно сказать сейчас?</p>
                 </div>

                 {/* Input Area */}
                 <div className="space-y-6">
                    <div className="relative group">
                      <input 
                        type="text" 
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Например: Верность, Цена успеха..."
                        className="w-full bg-transparent border-b border-white/20 py-4 text-xl md:text-2xl font-serif placeholder-white/20 focus:outline-none focus:border-verum-gold transition-colors text-center"
                        onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                      />
                    </div>

                    {/* Chips */}
                    {!inputValue && (
                      <div className="flex flex-wrap justify-center gap-2">
                        {EXAMPLE_PROMPTS.map(prompt => (
                          <button 
                            key={prompt}
                            onClick={() => setInputValue(prompt)}
                            className="px-3 py-1 border border-white/10 rounded-full text-xs text-verum-gray hover:border-verum-gold/50 hover:text-verum-gold transition-colors"
                          >
                            {prompt}
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Style Selectors */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-white/5">
                        <div>
                          <label className="block text-xs uppercase tracking-widest text-verum-gray mb-3 text-center md:text-left">От лица</label>
                          <div className="flex gap-2 justify-center md:justify-start">
                            {(['masculine', 'female_appeal', 'universal'] as ToneType[]).map((t) => (
                              <button
                                key={t}
                                onClick={() => setStyle({...style, tone: t})}
                                className={`w-8 h-8 flex items-center justify-center rounded-full border transition-all ${style.tone === t ? 'border-verum-gold bg-verum-gold text-verum-black' : 'border-white/20 text-verum-gray hover:border-white'}`}
                                title={t}
                              >
                                {t === 'masculine' && '🧔'}
                                {t === 'female_appeal' && '❤️'}
                                {t === 'universal' && '⚖️'}
                              </button>
                            ))}
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs uppercase tracking-widest text-verum-gray mb-3 text-center md:text-right">Настроение</label>
                          <div className="flex gap-2 justify-center md:justify-end">
                            {(['hard', 'soft', 'philosophical'] as MoodType[]).map((m) => (
                              <button
                                key={m}
                                onClick={() => setStyle({...style, mood: m})}
                                className={`w-8 h-8 flex items-center justify-center rounded-full border transition-all ${style.mood === m ? 'border-verum-gold bg-verum-gold text-verum-black' : 'border-white/20 text-verum-gray hover:border-white'}`}
                                title={m}
                              >
                                {m === 'hard' && '🔥'}
                                {m === 'soft' && '🌙'}
                                {m === 'philosophical' && '🧠'}
                              </button>
                            ))}
                          </div>
                        </div>
                    </div>

                    <div className="pt-8 text-center">
                      <Button onClick={handleGenerate} loading={loading} disabled={!inputValue.trim()}>
                        СОЗДАТЬ МЫСЛЬ
                      </Button>
                    </div>

                    {error && (
                      <div className="text-red-400 text-sm text-center mt-4">{error}</div>
                    )}
                 </div>
              </div>
            ) : (
              // Result View
              <ResultCard 
                content={generatedContent} 
                onSave={handleSaveToggle}
                onGenerateAgain={() => {
                  setGeneratedContent(null);
                  handleGenerate();
                }}
              />
            )}

            {/* Close Result Button (if showing result) */}
            {generatedContent && !loading && (
               <button 
                  onClick={() => setGeneratedContent(null)}
                  className="fixed bottom-8 left-1/2 -translate-x-1/2 text-verum-gray hover:text-white transition-colors"
               >
                 <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>
               </button>
            )}
          </div>
        )}

        {screen === AppScreen.LIBRARY && (
          <div className="flex-1 bg-verum-black">
             <Library 
                items={library} 
                onRemove={handleSaveToggle}
                onCopy={copyToClipboard}
              />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;