import React from 'react';

export const LivingBackground = ({ isNight }: { isNight: boolean }) => (
  <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
    {/* Soft glowing orbs with updated "coquette" palette */}
    <div className={`absolute top-[-20%] left-[-10%] w-[90%] h-[60%] rounded-full blur-[100px] opacity-50 mix-blend-multiply filter animate-blob ${isNight ? 'bg-[#5C4B45]' : 'bg-[#F4D4D4]'}`}></div>
    
    <div className={`absolute top-[10%] right-[-20%] w-[80%] h-[60%] rounded-full blur-[120px] opacity-40 mix-blend-multiply filter animate-blob animation-delay-2000 ${isNight ? 'bg-[#4A3B38]' : 'bg-[#E8E4F2]'}`}></div>
    
    <div className={`absolute bottom-[-10%] left-[10%] w-[90%] h-[50%] rounded-full blur-[90px] opacity-50 mix-blend-multiply filter animate-blob animation-delay-4000 ${isNight ? 'bg-[#6B5A52]' : 'bg-[#F8E4D8]'}`}></div>
    
    {/* Subtle noise texture for realism */}
    <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/noise-lines.png')]"></div>
  </div>
);