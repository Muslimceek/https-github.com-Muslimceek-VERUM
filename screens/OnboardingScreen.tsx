import React, { useState, useEffect } from 'react';

interface OnboardingScreenProps {
  onFinish: () => void;
}

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onFinish }) => {
  const [onboardingStep, setOnboardingStep] = useState(0);

  // Auto-advance Splash Screen
  useEffect(() => {
    if (onboardingStep === 0) {
      const timer = setTimeout(() => {
        setOnboardingStep(1);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [onboardingStep]);

  const handleNextStep = () => {
    if (onboardingStep < 4) {
      setOnboardingStep(prev => prev + 1);
    } else {
      onFinish();
    }
  };

  // Step 0: Splash Screen
  if (onboardingStep === 0) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-vera-bg relative overflow-hidden animate-fade-in">
        {/* Background Swirl */}
        <div className="absolute w-[600px] h-[600px] bg-white border-[40px] border-[#FFFDF8] rounded-full opacity-40 blur-3xl animate-pulse-slow"></div>
        
        <div className="z-10 flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-vera-yellow flex items-center justify-center mb-6 shadow-lg animate-float">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="#2A2A2A" stroke="none"/></svg>
            </div>
            <h1 className="font-serif text-5xl tracking-widest text-vera-text mb-2">VERA</h1>
            <div className="w-8 h-1 bg-vera-yellow mb-4"></div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-vera-textLight">Gentle Support</p>
        </div>
        
        <div className="absolute bottom-12 flex gap-2">
             <div className="w-1.5 h-1.5 rounded-full bg-vera-yellow"></div>
             <div className="w-1.5 h-1.5 rounded-full bg-vera-text/10"></div>
             <div className="w-1.5 h-1.5 rounded-full bg-vera-text/10"></div>
        </div>
      </div>
    );
  }

  // Steps 1-4 Content configuration
  const steps = [
      null, // placeholder for index 0
      {
          title: "Ты не обязана быть сильной всегда",
          subtitle: "Позволь себе просто быть",
          visual: (
            <div className="w-64 h-64 rounded-full bg-gradient-to-tr from-[#F5E6D3] to-[#FFF8F0] shadow-xl flex items-center justify-center animate-float relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,_rgba(255,255,255,0.8),_transparent)]"></div>
                <div className="w-full h-full opacity-30" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, #E7C8C0 10px, #E7C8C0 11px)' }}></div>
            </div>
          )
      },
      {
          title: "Здесь можно чувствовать",
          subtitle: "Твои эмоции важны, безопасны и услышаны.",
          visual: (
            <div className="relative w-64 h-64 animate-float">
                 <div className="absolute inset-0 rounded-full bg-[#E8A576] blur-2xl opacity-40"></div>
                 <div className="relative w-full h-full bg-gradient-to-bl from-[#F4B084] to-[#C89B7B] rounded-[40%_60%_70%_30%/40%_50%_60%_50%] shadow-inner border-t border-white/30"></div>
            </div>
          )
      },
      {
          title: "Слова — как поддержка",
          subtitle: "Находи утешение в ежедневных словах, которые отзываются в сердце.",
          visual: (
            <div className="w-64 h-64 rounded-[40px] bg-gradient-to-b from-[#C99C67] to-[#8C6B4A] shadow-2xl flex items-center justify-center overflow-hidden relative animate-float">
                <div className="absolute w-[200%] h-[200%] bg-[radial-gradient(circle,_rgba(255,255,255,0.2)_0%,_transparent_60%)] animate-pulse-slow"></div>
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-tr from-transparent via-white/10 to-transparent"></div>
            </div>
          )
      },
      {
          title: "Мы здесь для тебя",
          subtitle: "VERA — это место, где тебя понимают. Без осуждения, только поддержка.",
          visual: (
            <div className="w-64 h-64 relative flex items-center justify-center animate-float">
                 {/* Abstract Lotus */}
                 <div className="absolute w-40 h-40 bg-[#E7C8C0] rounded-tl-[100px] rounded-br-[100px] rotate-45 opacity-80 mix-blend-multiply"></div>
                 <div className="absolute w-40 h-40 bg-[#D4E2D4] rounded-tr-[100px] rounded-bl-[100px] rotate-45 opacity-80 mix-blend-multiply"></div>
                 <div className="absolute w-32 h-32 bg-white/60 rounded-full blur-md"></div>
            </div>
          )
      }
  ];

  const currentStepData = steps[onboardingStep];

  return (
    <div className="h-screen flex flex-col justify-between p-8 bg-vera-bg animate-fade-in relative overflow-hidden">
        {/* Skip Button */}
        <div className="absolute top-12 right-8 z-20">
            <button onClick={onFinish} className="text-xs text-vera-textLight hover:text-vera-text transition-colors">
                Пропустить
            </button>
        </div>

        {/* Visual Area */}
        <div className="flex-1 flex items-center justify-center mt-10">
            {currentStepData?.visual}
        </div>

        {/* Text Area */}
        <div className="flex flex-col items-center text-center z-10 mb-8">
            <h2 className="font-serif text-3xl md:text-4xl text-vera-text mb-4 leading-tight">
                {currentStepData?.title}
            </h2>
            <p className="text-vera-textLight text-sm md:text-base leading-relaxed max-w-xs mb-10">
                {currentStepData?.subtitle}
            </p>

            {/* Indicators */}
            <div className="flex gap-2 mb-10">
                {[1, 2, 3, 4].map((step) => (
                    <div 
                       key={step} 
                       className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${onboardingStep === step ? 'bg-vera-yellow scale-125' : 'bg-vera-text/10'}`}
                    />
                ))}
            </div>

            {/* Primary Button */}
            <button 
              onClick={handleNextStep}
              className="w-full bg-vera-yellow text-vera-text font-semibold py-4 rounded-[20px] shadow-lg shadow-yellow-200/50 hover:shadow-xl hover:scale-[1.01] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              <span>{onboardingStep === 4 ? 'Начать мягко' : 'Далее'}</span>
              {onboardingStep === 4 && (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
              )}
            </button>
            
            {onboardingStep === 4 && (
                <p className="mt-4 text-[10px] text-vera-textLight opacity-60">У меня уже есть аккаунт</p>
            )}
        </div>
    </div>
  );
};