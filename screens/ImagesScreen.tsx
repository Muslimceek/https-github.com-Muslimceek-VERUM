import React, { useState } from 'react';
import { IMAGE_STYLES } from '../types';
import { generateVeraImage } from '../services/geminiService';

interface ImagesScreenProps {
  isNight: boolean;
}

export const ImagesScreen: React.FC<ImagesScreenProps> = ({ isNight }) => {
  const [imagePrompt, setImagePrompt] = useState('');
  const [selectedImageStyle, setSelectedImageStyle] = useState(IMAGE_STYLES[0]);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(false);

  const handleGenerateImage = async () => {
    if (!imagePrompt.trim()) return;
    setLoading(true);
    setGeneratedImageUrl(null);
    setGenerationError(null);
    try {
      const url = await generateVeraImage(imagePrompt, selectedImageStyle.prompt);
      setGeneratedImageUrl(url);
      setIsImageLoading(true);
    } catch (e: any) {
      console.error(e);
      setGenerationError("Не удалось создать образ. Пожалуйста, попробуйте еще раз.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadImage = async (url: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `vera-art-${Date.now()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (e) {
      console.error("Download failed", e);
      window.open(url, '_blank');
    }
  };

  const handleShareImage = async (url: string) => {
    if (navigator.share) {
      try {
        const response = await fetch(url);
        const blob = await response.blob();
        const file = new File([blob], 'vera-image.jpg', { type: 'image/jpeg' });
        await navigator.share({
          files: [file],
          title: 'Мой образ в VERA',
        });
      } catch (e) {
        console.error("Share failed", e);
        navigator.clipboard.writeText(url);
        alert("Ссылка скопирована");
      }
    } else {
        navigator.clipboard.writeText(url);
        alert("Ссылка скопирована");
    }
  };

  if (loading) return (
      <div className="h-full flex flex-col items-center justify-center animate-breath z-10 relative">
          <div className="text-4xl mb-4 animate-spin">🎨</div>
          <p className="mt-4 font-serif text-vera-text/50 tracking-widest text-sm">ПОДБИРАЮ КРАСКИ...</p>
      </div>
  );

  return (
      <div className="h-full flex flex-col pt-8 px-6 pb-24 animate-fade-in overflow-y-auto z-10 relative">
           <div className="mb-6 text-center">
              <h2 className="font-altSerif text-5xl mb-2 text-vera-text italic">Образы</h2>
              <p className="text-sm opacity-60 max-w-xs mx-auto leading-relaxed">Создай визуальное отражение своих чувств</p>
           </div>

           {/* Error Message */}
           {generationError && (
               <div className="mb-6 p-4 rounded-2xl bg-red-50/50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/30 text-center animate-slide-up">
                  <p className="text-red-800 dark:text-red-200 font-serif mb-1 text-lg">Муза отдыхает</p>
                  <p className="text-xs opacity-70">{generationError}</p>
               </div>
           )}

           {/* Generated Image Result */}
           {generatedImageUrl ? (
               <div className="flex-1 flex flex-col animate-slide-up">
                  {/* Image Card */}
                  <div className="relative rounded-[32px] overflow-hidden shadow-2xl mb-8 bg-vera-text/5 aspect-[4/5] group w-full max-w-sm mx-auto border-8 border-white shadow-glass">
                      
                      {/* Image Loader overlay */}
                      {isImageLoading && (
                          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-vera-bg/80 backdrop-blur-md">
                              <div className="text-4xl animate-bounce">🖌️</div>
                              <span className="text-[10px] uppercase tracking-widest opacity-60 mt-4">Рисую...</span>
                          </div>
                      )}
                      
                      <img 
                          src={generatedImageUrl} 
                          alt="Generated" 
                          className={`w-full h-full object-cover transition-opacity duration-700 ${isImageLoading ? 'opacity-0' : 'opacity-100'}`}
                          onLoad={() => setIsImageLoading(false)}
                          onError={() => {
                              setIsImageLoading(false);
                              setGenerationError("Не удалось загрузить изображение.");
                          }}
                      />
                  </div>
                  
                  {/* Action Buttons Row */}
                  <div className="flex justify-center items-center gap-4 mb-4">
                       {/* Download */}
                       <button 
                          onClick={() => handleDownloadImage(generatedImageUrl)}
                          className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg active:scale-90 transition-transform text-xl ${isNight ? 'bg-white/10 hover:bg-white/20' : 'bg-white hover:bg-gray-50'}`}
                          title="Скачать"
                       >
                          📥
                       </button>

                       {/* Share */}
                       <button 
                          onClick={() => handleShareImage(generatedImageUrl)}
                          className={`flex-1 h-14 rounded-full flex items-center justify-center gap-2 font-medium shadow-xl active:scale-95 transition-all ${isNight ? 'bg-vera-rose text-vera-night' : 'bg-vera-text text-white'}`}
                       >
                          <span>✨ Поделиться</span>
                       </button>

                       {/* Close/Retry */}
                       <button 
                           onClick={() => setGeneratedImageUrl(null)}
                           className={`w-14 h-14 rounded-full flex items-center justify-center opacity-60 hover:opacity-100 text-xl ${isNight ? 'hover:bg-white/10' : 'hover:bg-black/5'}`}
                           title="Закрыть"
                       >
                           ✕
                       </button>
                  </div>
               </div>
           ) : (
               <>
                  {/* Prompt Input */}
                  <div className={`rounded-[32px] p-2 mb-8 backdrop-blur-sm transition-all focus-within:shadow-xl ${isNight ? 'bg-white/5' : 'bg-white shadow-lg shadow-vera-rose/10'}`}>
                      <textarea
                          value={imagePrompt}
                          onChange={(e) => { setImagePrompt(e.target.value); setGenerationError(null); }}
                          placeholder="Опиши свой сон, чувство или мечту..."
                          className="w-full bg-transparent p-6 min-h-[160px] resize-none focus:outline-none text-xl font-altSerif placeholder:opacity-40 leading-relaxed text-center"
                          style={{ fontStyle: 'italic' }}
                      />
                  </div>

                  {/* Style Selector - Horizontal Scroll */}
                  <div className="mb-10">
                      <div className="flex items-center justify-between mb-4 px-2">
                           <p className="text-[10px] uppercase tracking-widest opacity-40">СТИЛЬ</p>
                           <span className="text-xs font-serif opacity-60">{selectedImageStyle.label} {selectedImageStyle.emoji}</span>
                      </div>
                      
                      <div className="flex gap-3 overflow-x-auto pb-6 -mx-6 px-6 no-scrollbar snap-x">
                          {IMAGE_STYLES.map(style => (
                              <button
                                  key={style.id}
                                  onClick={() => setSelectedImageStyle(style)}
                                  className={`snap-start flex-shrink-0 h-28 w-24 rounded-[24px] flex flex-col items-center justify-center gap-2 transition-all duration-300 relative overflow-hidden group border ${selectedImageStyle.id === style.id 
                                      ? (isNight ? 'border-white bg-white/10' : 'border-vera-text bg-vera-text/5 scale-105 shadow-md') 
                                      : 'border-transparent bg-white/40 hover:bg-white/60'}`}
                              >
                                  <div className="text-3xl mb-1 filter drop-shadow-sm">{style.emoji}</div>
                                  <span className="text-[10px] font-medium opacity-80">{style.label}</span>
                              </button>
                          ))}
                      </div>
                  </div>

                  {/* Generate Button */}
                  <div className="mt-auto pb-4">
                      <button 
                          onClick={handleGenerateImage}
                          disabled={!imagePrompt.trim()}
                          className={`w-full py-5 rounded-[28px] font-medium text-lg transition-all flex items-center justify-center gap-3 shadow-xl ${!imagePrompt.trim() ? 'opacity-50 cursor-not-allowed' : 'opacity-100 hover:scale-[1.02] active:scale-[0.98]'} ${isNight ? 'bg-vera-rose text-vera-night' : 'bg-vera-text text-white'}`}
                      >
                          <span>Воплотить</span>
                          <span>🧚‍♀️</span>
                      </button>
                  </div>
               </>
           )}
      </div>
  );
};