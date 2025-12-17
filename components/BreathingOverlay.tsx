import React, { useState, useEffect } from 'react';

export const BreathingOverlay = ({ onClose, isNight }: { onClose: () => void; isNight: boolean }) => {
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
    return () => {};
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