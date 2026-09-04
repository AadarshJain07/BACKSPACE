import React, { useRef, useEffect } from 'react';
import { EraConfig } from '../types/era';
import { sound } from '../utils/audio';
interface TimelineProps {
  eras: EraConfig[];
  currentEra: EraConfig;
  onSelectEra: (id: string) => void;
  onPrevEra: () => void;
  onNextEra: () => void;
  currentIndex: number;
}
export const Timeline: React.FC<TimelineProps> = ({
  eras,
  currentEra,
  onSelectEra,
  onPrevEra,
  onNextEra,
  currentIndex
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  // Auto-scroll active year into center view on mobile/tablet
  useEffect(() => {
    if (containerRef.current) {
      const activeEl = containerRef.current.querySelector(`[data-era-id="${currentEra.id}"]`);
      if (activeEl) {
        activeEl.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      }
    }
  }, [currentEra.id]);
  const progressPercent = (currentIndex / (eras.length - 1)) * 100;
  return (
    <div className="w-full bg-slate-950/80 border-b border-white/10 backdrop-blur-xl px-4 py-6 sm:py-8 select-none z-10">
      <div className="max-w-7xl mx-auto space-y-4">
        {/* Timeline Header HUD */}
        <div className="flex items-center justify-between text-xs font-mono text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-slate-300 font-bold uppercase tracking-wider">
              TEMPORAL CONTINUUM ENGINE
            </span>
            <span className="text-slate-600 hidden sm:inline">|</span>
            <span className="text-slate-400 hidden sm:inline">
              Position: {currentIndex + 1} of {eras.length}
            </span>
          </div>

            {/* Quick Prev / Next jump buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                sound.playClick('click');
                onPrevEra();
              }}
              disabled={currentIndex === 0}
              className="px-3 py-1 bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none rounded-lg border border-white/10 text-white font-bold transition-all flex items-center gap-1 active:scale-95"
              title="Previous Era (Left Arrow)"
            >
              <span>←</span>
              <span className="hidden sm:inline">PREV</span>
            </button>

              <button
              onClick={() => {
                sound.playClick('click');
                onNextEra();
              }}
              disabled={currentIndex === eras.length - 1}
              className="px-3 py-1 bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none rounded-lg border border-white/10 text-white font-bold transition-all flex items-center gap-1 active:scale-95"
              title="Next Era (Right Arrow)"
            >
              <span className="hidden sm:inline">NEXT</span>
              <span>→</span>
            </button>
          </div>
        </div>

           {/* The Main Interactive Timeline Track */}
        <div className="relative pt-6 pb-4">
          {/* Background Track Line */}
          <div className="absolute top-1/2 left-0 right-0 h-1.5 -translate-y-1/2 bg-white/10 rounded-full overflow-hidden">
            {/* Glowing progress fill */}
            <div
              className="h-full bg-gradient-to-r from-amber-500 via-sky-400 to-purple-500 transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          {/* Era Nodes Container */}
          <div
            ref={containerRef}
            className="relative flex items-center justify-between gap-4 overflow-x-auto no-scrollbar py-4 px-2"
          >
            {eras.map((era, index) => {
              const isSelected = era.id === currentEra.id;
              const isPast = index <= currentIndex;
              return (
                <button
                  key={era.id}
                  data-era-id={era.id}
                  onClick={() => {
                    sound.playClick(era.soundPreset);
                    onSelectEra(era.id);
                  }}
                  className={`group relative flex flex-col items-center min-w-[90px] sm:min-w-[110px] focus:outline-none transition-all duration-300 ${
                    isSelected ? 'scale-110 z-20' : 'hover:scale-105 opacity-75 hover:opacity-100 z-10'
                  }`}
                >
                  {/* Central Tactile Dial Node */}
                  <div className="relative mb-2">
                    {/* Pulsing ring for active era */}
     {isSelected && (
                      <div className="absolute -inset-2 rounded-full bg-amber-400/30 animate-ping pointer-events-none" />
                    )}
                    <div
                      className={`w-9 h-9 sm:w-11 sm:h-11 rounded-full flex items-center justify-center font-mono font-bold text-xs sm:text-sm border-2 transition-all duration-300 shadow-lg ${
                        isSelected
                          ? 'bg-amber-400 text-black border-white shadow-amber-500/50 scale-110 ring-4 ring-amber-400/20'
                          : isPast
                          ? 'bg-slate-800 text-slate-200 border-sky-400/60 hover:border-sky-300'
                          : 'bg-slate-900 text-slate-500 border-white/20 hover:border-white/40'
                      }`}
                    >
                      {era.year.length > 4 ? '?' : era.year.slice(2)}
                    </div>
                  </div>
                  {/* Year & Era Name Labels */}
                  <div className="text-center space-y-0.5">
                    <div
                      className={`text-xs sm:text-sm font-black font-mono transition-colors ${
                        isSelected
                          ? 'text-amber-400 font-extrabold scale-105'
                          : isPast
                          ? 'text-slate-200'
                          : 'text-slate-400'
                      }`}
                    >
                      {era.year}
                    </div>
                    <div
                      className={`text-[10px] font-semibold truncate max-w-[85px] sm:max-w-[100px] uppercase tracking-tighter ${
                        isSelected ? 'text-white' : 'text-slate-500'
                      }`}
                    >
                      {era.eraName.split(' ')[0]}
                    </div>
                  </div>
                  {/* Era badge pill */}
                  {isSelected && (
                    <div className="mt-1.5 px-2 py-0.5 rounded-full bg-amber-400/10 border border-amber-400/30 text-[9px] font-mono font-bold text-amber-300 whitespace-nowrap animate-bounce">
                      ACTIVE ERA
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
        {/* Keyboard Navigation Shortcuts Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-white/5 text-[11px] font-mono text-slate-400">
          <div className="flex items-center gap-3">
            <span className="text-slate-400 font-semibold">Keyboard Shortcuts:</span>
            <span className="bg-white/10 px-1.5 py-0.5 rounded border border-white/10 text-slate-300">← / →</span>
            <span className="text-slate-400">Navigate Eras</span>
            <span className="bg-white/10 px-1.5 py-0.5 rounded border border-white/10 text-slate-300">R</span>
            <span className="text-slate-400">Random Era</span>
          </div>

          <div className="text-slate-400 italic">
            Tip: Press <kbd className="bg-white/10 px-1 py-0.5 rounded text-amber-400 not-italic">I</kbd> for deep era lore
          </div>
        </div>
      </div>
    </div>
  );
};
