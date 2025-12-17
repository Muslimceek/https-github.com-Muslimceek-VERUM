import React from 'react';

export const DailyMessageOverlay = ({ message, onClose, isNight }: { message: string, onClose: () => void, isNight: boolean }) => {
    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center px-8 animate-fade-in backdrop-blur-3xl bg-vera-bg/90 dark:bg-vera-night/90">
            <div className="absolute top-[-20%] right-[-20%] w-[600px] h-[600px] bg-vera-rose/20 rounded-full blur-3xl animate-pulse-slow"></div>
            
            <div className="relative z-10 flex flex-col items-center text-center max-w-md">
                <span className="text-[10px] uppercase tracking-[0.3em] opacity-60 mb-6 animate-slide-up">
                    Сегодня для тебя
                </span>
                
                <div className="mb-12 space-y-4">
                    {message.split('\n').map((line, i) => (
                        <p 
                            key={i} 
                            className="font-serif text-2xl md:text-3xl leading-relaxed animate-delicate-reveal"
                            style={{ animationDelay: `${i * 300}ms` }}
                        >
                            {line}
                        </p>
                    ))}
                </div>

                <div className="animate-fade-in" style={{ animationDelay: '1000ms' }}>
                     <button 
                        onClick={onClose}
                        className={`px-8 py-3 rounded-full text-sm font-medium tracking-wide transition-all duration-300 hover:scale-105 ${isNight ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-vera-text text-vera-bg shadow-lg hover:shadow-xl'}`}
                     >
                        Принимаю
                     </button>
                </div>
            </div>
            
             <div className="absolute bottom-10 opacity-30 text-[10px] tracking-widest font-mono">
                {new Date().toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })}
            </div>
        </div>
    );
};