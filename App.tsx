import React, { useState, useEffect } from 'react';
import { TabBar } from './components/TabBar';
import { LivingBackground } from './components/LivingBackground';
import { BreathingOverlay } from './components/BreathingOverlay';
import { DailyMessageOverlay } from './components/DailyMessageOverlay';
import { OnboardingScreen } from './screens/OnboardingScreen';
import { HomeScreen } from './screens/HomeScreen';
import { LettersScreen } from './screens/LettersScreen';
import { ImagesScreen } from './screens/ImagesScreen';
import { JournalScreen } from './screens/JournalScreen';
import { LibraryScreen } from './screens/LibraryScreen';

import { generateVeraWord, generateVeraLetter, generateJournalResponse, generateDailyMessage } from './services/geminiService';
import { ScreenType, VERAContent, JournalEntry, SITUATIONS, LETTER_TYPES } from './types';
import { v4 as uuidv4 } from 'uuid';

function App() {
  // State
  const [screen, setScreen] = useState<ScreenType>('ONBOARDING');
  const [isNight, setIsNight] = useState(false);
  const [loading, setLoading] = useState(false);
  const [favorites, setFavorites] = useState<VERAContent[]>([]);
  const [journal, setJournal] = useState<JournalEntry[]>([]);
  const [isBreathing, setIsBreathing] = useState(false);
  
  // Daily Message State
  const [dailyMessage, setDailyMessage] = useState<string | null>(null);
  const [showDailyMessage, setShowDailyMessage] = useState(false);
  
  // Content States
  const [currentWord, setCurrentWord] = useState<VERAContent | null>(null);

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

  // Check for Daily Message (Only on Home screen, i.e., post-onboarding)
  useEffect(() => {
    const checkDailyMessage = async () => {
        if (screen !== 'HOME') return;

        const today = new Date().toDateString();
        const lastViewed = localStorage.getItem('vera_daily_date');
        
        // If we haven't seen a message today
        if (lastViewed !== today) {
            try {
                const msg = await generateDailyMessage();
                setDailyMessage(msg);
                setShowDailyMessage(true);
            } catch (e) {
                console.error("Failed to fetch daily message", e);
            }
        }
    };
    
    // Only run if we are settled on HOME (e.g. after refresh or after onboarding finish)
    checkDailyMessage();
  }, [screen]);

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
  
  const handleCloseDailyMessage = () => {
      setShowDailyMessage(false);
      localStorage.setItem('vera_daily_date', new Date().toDateString());
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
      const tag = SITUATIONS.some(s => s.text === situation) ? situation : "Личное";
      setCurrentWord(createContentObject(text, 'word', tag));
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
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleJournalSubmit = async (text: string) => {
    setLoading(true);
    try {
      const responseText = await generateJournalResponse(text);
      const veraResponse = createContentObject(responseText, 'journal_response', 'Дневник');
      
      const newEntry: JournalEntry = {
        id: uuidv4(),
        userText: text,
        veraResponse,
        timestamp: Date.now()
      };
      
      setJournal(prev => [newEntry, ...prev]);
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

  // --- RENDER ---

  if (screen === 'ONBOARDING') return (
    <>
        <LivingBackground isNight={isNight} />
        <OnboardingScreen onFinish={handleOnboardingFinish} />
    </>
  );

  return (
    <div className={`h-screen flex flex-col ${isNight ? 'text-[#EAE0D5]' : 'text-[#2A2A2A]'}`}>
      <LivingBackground isNight={isNight} />
      
      {isBreathing && <BreathingOverlay onClose={() => setIsBreathing(false)} isNight={isNight} />}
      {showDailyMessage && dailyMessage && <DailyMessageOverlay message={dailyMessage} onClose={handleCloseDailyMessage} isNight={isNight} />}
      
      <div className="flex-1 relative overflow-hidden">
         {screen === 'HOME' && (
            <HomeScreen 
                isNight={isNight} 
                loading={loading}
                currentWord={currentWord}
                onGenerateWord={handleGenerateWord}
                onClearWord={() => setCurrentWord(null)}
                onToggleFavorite={toggleFavorite}
                onBreath={() => setIsBreathing(true)}
                onToggleNight={handleToggleNight}
            />
         )}
         {screen === 'LETTERS' && (
             <LettersScreen 
                isNight={isNight}
                loading={loading}
                currentWord={currentWord}
                onGenerateLetter={handleGenerateLetter}
                onClearWord={() => setCurrentWord(null)}
                onToggleFavorite={toggleFavorite}
             />
         )}
         {screen === 'IMAGES' && (
             <ImagesScreen isNight={isNight} />
         )}
         {screen === 'JOURNAL' && (
             <JournalScreen 
                isNight={isNight} 
                loading={loading} 
                journal={journal} 
                onSubmit={handleJournalSubmit} 
             />
         )}
         {screen === 'LIBRARY' && (
             <LibraryScreen 
                isNight={isNight} 
                favorites={favorites} 
                onToggleFavorite={toggleFavorite} 
             />
         )}
      </div>
      
      <TabBar activeScreen={screen} onNavigate={(s) => { setScreen(s); setCurrentWord(null); }} isNight={isNight} />
    </div>
  );
}

export default App;