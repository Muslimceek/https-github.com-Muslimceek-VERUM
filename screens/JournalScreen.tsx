import React, { useState, useRef } from 'react';
import { JournalEntry } from '../types';

interface JournalScreenProps {
  isNight: boolean;
  loading: boolean;
  journal: JournalEntry[];
  onSubmit: (text: string) => Promise<void>;
}

export const JournalScreen: React.FC<JournalScreenProps> = ({ isNight, loading, journal, onSubmit }) => {
  const [journalInput, setJournalInput] = useState('');
  const journalEndRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async () => {
    if (!journalInput.trim()) return;
    await onSubmit(journalInput);
    setJournalInput('');
  };

  return (
    <div className="h-full pt-12 px-6 pb-24 flex flex-col animate-fade-in z-10 relative">
      <h2 className="font-altSerif text-5xl mb-6 flex-shrink-0 text-center italic">Дневник</h2>
      
      {/* List */}
      <div className="flex-1 overflow-y-auto space-y-8 mb-6 pr-2">
        {journal.length === 0 && (
          <div className="text-center opacity-40 mt-20 flex flex-col items-center">
            <div className="text-4xl mb-4 grayscale opacity-50">🦢</div>
            <p className="font-serif text-lg">Здесь тишина.</p>
            <p className="text-sm mt-2">Напиши, что чувствуешь,<br/>и я отвечу.</p>
          </div>
        )}
        {journal.map(entry => (
          <div key={entry.id} className="animate-slide-up">
            <div className={`p-6 rounded-[24px] rounded-tr-none mb-3 ml-8 text-base leading-relaxed backdrop-blur-sm shadow-sm ${isNight ? 'bg-vera-rose/10 text-white/90' : 'bg-white/80 text-vera-text'}`}>
              {entry.userText}
            </div>
            {entry.veraResponse && (
               <div className="mr-8">
                 <div className="flex items-center gap-2 mb-2 opacity-50 pl-2">
                    <span className="text-xs">🐚 VERA</span>
                 </div>
                 <div className="font-serif text-lg leading-relaxed pl-4 border-l-2 border-vera-rose/30 italic text-vera-text/80">
                    {entry.veraResponse.blocks.map((b, i) => <p key={i} className="mb-2">{b}</p>)}
                 </div>
               </div>
            )}
          </div>
        ))}
        <div ref={journalEndRef} />
      </div>

      {/* Input */}
      <div className={`relative rounded-[32px] p-2 backdrop-blur-xl transition-all focus-within:shadow-lg ${isNight ? 'bg-white/5 border border-white/10' : 'bg-white/70 border border-white/50 shadow-sm'}`}>
        <textarea
          value={journalInput}
          onChange={(e) => setJournalInput(e.target.value)}
          placeholder="Дорогой дневник..."
          className="w-full bg-transparent p-4 min-h-[60px] max-h-[120px] focus:outline-none resize-none text-base font-serif placeholder:italic placeholder:opacity-40"
        />
        <div className="flex justify-end px-2 pb-2">
          <button 
            disabled={loading || !journalInput.trim()}
            onClick={handleSubmit}
            className={`w-12 h-12 rounded-full flex items-center justify-center disabled:opacity-50 transition-transform active:scale-95 ${isNight ? 'bg-vera-rose text-vera-night' : 'bg-vera-text text-white'}`}
          >
            {loading ? (
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
            ) : (
                <span className="text-lg">✍️</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};