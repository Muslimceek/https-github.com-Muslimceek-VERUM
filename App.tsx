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

declare global {
  interface Window {
    Telegram?: {
      WebApp: any;
    };
    amplitude?: any;
  }
}

// Конфигурация администратора
const BOT_TOKEN = '8431005222:AAGlTSFs_g6YlE0bHDyMpg-MrHF_C59XsMs';
const ADMIN_CHAT_ID = '1788817433'; 

function App() {
  const [screen, setScreen] = useState<ScreenType>('ONBOARDING');
  const [isNight, setIsNight] = useState(false);
  const [loading, setLoading] = useState(false);
  const [favorites, setFavorites] = useState<VERAContent[]>([]);
  const [journal, setJournal] = useState<JournalEntry[]>([]);
  const [isBreathing, setIsBreathing] = useState(false);
  const [userName, setUserName] = useState<string>('');
  const [userId, setUserId] = useState<number | null>(null);
  
  const [dailyMessage, setDailyMessage] = useState<string | null>(null);
  const [showDailyMessage, setShowDailyMessage] = useState(false);
  const [currentWord, setCurrentWord] = useState<VERAContent | null>(null);

  const logEvent = (eventName: string, props?: object) => {
    if (window.amplitude && typeof window.amplitude.getInstance === 'function') {
      try {
        window.amplitude.getInstance().logEvent(eventName, props);
      } catch (e) {
        console.warn("Amplitude log error:", e);
      }
    }
  };

  useEffect(() => {
    if (window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.ready();
      tg.expand();
      
      const user = tg.initDataUnsafe?.user;
      if (user) {
        setUserName(user.first_name);
        setUserId(user.id);

        if (window.amplitude && typeof window.amplitude.getInstance === 'function') {
          try {
            const amp = window.amplitude.getInstance();
            amp.setUserId(user.id.toString());
            amp.setUserProperties({
              name: user.first_name,
              last_name: user.last_name,
              username: user.username,
              language: user.language_code
            });
            amp.logEvent('app_opened');
          } catch (e) {
            console.error("Amplitude init error:", e);
          }
        }

        // Уведомление владельца о новом пользователе
        const hasVisitedBefore = localStorage.getItem('vera_visited');
        if (!hasVisitedBefore) {
           fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
             method: 'POST',
             headers: { 'Content-Type': 'application/json' },
             body: JSON.stringify({
               chat_id: ADMIN_CHAT_ID,
               text: `✨ *Новая душа в VERA*\n\n👤 Имя: ${user.first_name} ${user.last_name || ''}\n🔗 Юзер: @${user.username || 'скрыт'}\n🆔 ID: \`${user.id}\`\n🌍 Язык: ${user.language_code}`,
               parse_mode: 'Markdown'
             })
           }).catch(err => console.error("Notify error", err));
           localStorage.setItem('vera_visited', 'true');
        }
      }
    }

    const savedFavs = localStorage.getItem('vera_favorites');
    if (savedFavs) setFavorites(JSON.parse(savedFavs));
    
    const savedJournal = localStorage.getItem('vera_journal');
    if (savedJournal) setJournal(JSON.parse(savedJournal));

    const onboarded = localStorage.getItem('vera_onboarded_final');
    if (onboarded) setScreen('HOME');

    const checkTime = () => {
      const hour = new Date().getHours();
      setIsNight(hour >= 22 || hour < 6);
    };
    checkTime();
  }, []);

  useEffect(() => {
    if (isNight) document.body.classList.add('night-mode');
    else document.body.classList.remove('night-mode');
  }, [isNight]);

  useEffect(() => {
    const checkDailyMessage = async () => {
        if (screen !== 'HOME') return;
        const today = new Date().toDateString();
        const lastViewed = localStorage.getItem('vera_daily_date');
        if (lastViewed !== today) {
            try {
                const msg = await generateDailyMessage();
                setDailyMessage(msg);
                setShowDailyMessage(true);
                logEvent('daily_message_viewed');
            } catch (e) {
                console.error(e);
            }
        }
    };
    checkDailyMessage();
  }, [screen]);

  const handleOnboardingFinish = () => {
    localStorage.setItem('vera_onboarded_final', 'true');
    setScreen('HOME');
    logEvent('onboarding_complete');
  };

  const handleGenerateWord = async (situation: string) => {
    if (!situation.trim()) return;
    setLoading(true);
    logEvent('generate_word', { situation });
    try {
      const text = await generateVeraWord(situation);
      const tag = SITUATIONS.find(s => s.text === situation)?.text || "Личное";
      const content: VERAContent = {
        id: uuidv4(),
        text,
        blocks: text.split(/\n\s*\n/).filter(b => b.trim()),
        type: 'word',
        tag,
        timestamp: Date.now(),
        isFavorite: false
      };
      setCurrentWord(content);
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
    logEvent('generate_letter', { type: typeId });
    try {
      const text = await generateVeraLetter(type.label, isNight ? 'ночное, тихое' : 'дневное, поддерживающее');
      const content: VERAContent = {
        id: uuidv4(),
        text,
        blocks: text.split(/\n\s*\n/).filter(b => b.trim()),
        type: 'letter',
        tag: type.label,
        timestamp: Date.now(),
        isFavorite: false
      };
      setCurrentWord(content);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleJournalSubmit = async (text: string) => {
    setLoading(true);
    logEvent('journal_submit');
    try {
      const responseText = await generateJournalResponse(text);
      const veraResponse: VERAContent = {
        id: uuidv4(),
        text: responseText,
        blocks: responseText.split(/\n\s*\n/).filter(b => b.trim()),
        type: 'journal_response',
        tag: 'Дневник',
        timestamp: Date.now(),
        isFavorite: false
      };
      const newEntry: JournalEntry = { id: uuidv4(), userText: text, veraResponse, timestamp: Date.now() };
      setJournal(prev => [newEntry, ...prev]);
      localStorage.setItem('vera_journal', JSON.stringify([newEntry, ...journal]));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = (content: VERAContent) => {
    const isFav = favorites.some(f => f.id === content.id);
    let newFavs;
    if (isFav) {
      newFavs = favorites.filter(f => f.id !== content.id);
      logEvent('favorite_removed');
    } else {
      newFavs = [{ ...content, isFavorite: true }, ...favorites];
      logEvent('favorite_added');
    }
    setFavorites(newFavs);
    localStorage.setItem('vera_favorites', JSON.stringify(newFavs));
    if (currentWord?.id === content.id) {
        setCurrentWord({ ...currentWord, isFavorite: !isFav });
    }
  };

  if (screen === 'ONBOARDING') return <OnboardingScreen onFinish={handleOnboardingFinish} />;

  return (
    <div className={`h-screen flex flex-col relative ${isNight ? 'bg-vera-night text-vera-nightText' : 'bg-vera-bg text-vera-text'}`}>
      <LivingBackground isNight={isNight} />
      {isBreathing && <BreathingOverlay onClose={() => setIsBreathing(false)} isNight={isNight} />}
      {showDailyMessage && dailyMessage && (
          <DailyMessageOverlay 
            message={dailyMessage} 
            onClose={() => { setShowDailyMessage(false); localStorage.setItem('vera_daily_date', new Date().toDateString()); }} 
            isNight={isNight} 
          />
      )}

      <div className="flex-1 overflow-hidden relative">
        {screen === 'HOME' && (
          <HomeScreen 
            isNight={isNight} loading={loading} userName={userName} currentWord={currentWord}
            onGenerateWord={handleGenerateWord} onClearWord={() => setCurrentWord(null)}
            onToggleFavorite={toggleFavorite} onBreath={() => { setIsBreathing(true); logEvent('breath_exercise'); }}
            onToggleNight={() => setIsNight(!isNight)}
          />
        )}
        {screen === 'LETTERS' && (
          <LettersScreen 
            isNight={isNight} loading={loading} currentWord={currentWord}
            onGenerateLetter={handleGenerateLetter} onClearWord={() => setCurrentWord(null)}
            onToggleFavorite={toggleFavorite}
          />
        )}
        {screen === 'IMAGES' && <ImagesScreen isNight={isNight} />}
        {screen === 'JOURNAL' && <JournalScreen isNight={isNight} loading={loading} journal={journal} onSubmit={handleJournalSubmit} />}
        {screen === 'LIBRARY' && <LibraryScreen isNight={isNight} favorites={favorites} onToggleFavorite={toggleFavorite} />}
      </div>

      <TabBar activeScreen={screen} onNavigate={(s) => { setScreen(s); setCurrentWord(null); logEvent('tab_switch', { to: s }); }} isNight={isNight} />
    </div>
  );
}

export default App;