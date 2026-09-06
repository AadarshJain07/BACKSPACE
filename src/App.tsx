import React, { useState, useEffect, useCallback } from 'react';
import { ERAS } from './data/eras';
import type { EraId } from './types/era';
import { sound } from './utils/audio';
import { Timeline } from './components/Timeline';
import { Era1995 } from './components/eras/Era1995';
import { Era2000 } from './components/eras/Era2000';
import { Era2005 } from './components/eras/Era2005';

export const App: React.FC = () => {
  const [currentEraId, setCurrentEraId] = useState<EraId>('1995');
  const [soundMuted, setSoundMuted] = useState(false);
  const [crtEnabled, setCrtEnabled] = useState(true);

  const currentEra = ERAS.find((e) => e.id === currentEraId) || ERAS[0];
  const currentIndex = ERAS.findIndex((e) => e.id === currentEraId);

  const handleSelectEra = useCallback((eraId: string) => {
    sound.playTimeWarp();
    setCurrentEraId(eraId as EraId);
  }, []);

  const handlePrevEra = useCallback(() => {
    if (currentIndex > 0) {
      handleSelectEra(ERAS[currentIndex - 1].id);
    }
  }, [currentIndex, handleSelectEra]);

  const handleNextEra = useCallback(() => {
    if (currentIndex < ERAS.length - 1) {
      handleSelectEra(ERAS[currentIndex + 1].id);
    }
  }, [currentIndex, handleSelectEra]);

  const handleToggleSound = () => {
    const nextState = !soundMuted;
    setSoundMuted(nextState);
    sound.isMuted = nextState;
  };

  // Keyboard navigation & Touch Swipe Navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) return;
      if (e.key === 'ArrowLeft') handlePrevEra();
      if (e.key === 'ArrowRight') handleNextEra();
    };
    window.addEventListener('keydown', handleKeyDown);

    // Touch Swipe Gesture Handling
    let touchStartX = 0;
    let touchStartY = 0;

    const handleTouchStart = (e: TouchEvent) => {
      const target = e.target as HTMLElement;
      if (['INPUT', 'TEXTAREA', 'SELECT', 'CANVAS', 'BUTTON'].includes(target.tagName)) return;
      if (target.closest('canvas') || target.closest('.no-swipe')) return;

      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!touchStartX || !touchStartY) return;

      const touchEndX = e.changedTouches[0].clientX;
      const touchEndY = e.changedTouches[0].clientY;

      const deltaX = touchEndX - touchStartX;
      const deltaY = touchEndY - touchStartY;

      // Ensure horizontal swipe is dominant and exceeds minimum threshold (60px)
      if (Math.abs(deltaX) > 60 && Math.abs(deltaX) > Math.abs(deltaY) * 1.5) {
        if (deltaX < 0) {
          // Swiped Left -> Go Next Era
          handleNextEra();
        } else {
          // Swiped Right -> Go Prev Era
          handlePrevEra();
        }
      }

      touchStartX = 0;
      touchStartY = 0;
    };

    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handlePrevEra, handleNextEra]);

  return (
    <div className="min-h-screen flex flex-col bg-[#0e1017] text-[#c5c6c7] selection:bg-[#ffb000] selection:text-black">
      {/* 1980s CRT Raster Overlay */}
      {crtEnabled && <div className="crt-overlay" />}

      {/* Retro Vintage Header */}
      <header className="border-b border-[#2d3748] bg-[#141722] px-4 sm:px-8 py-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-[#ffb000] animate-ping" />
          <div>
            <h1 className="text-2xl sm:text-3xl font-mono font-bold tracking-tight text-[#f1f5f9] flex items-center">
              BACKSPACE<span className="text-[#ffb000] amber-glow animate-pulse">_</span>
            </h1>
            <p className="text-[11px] font-mono text-[#8a99ad]">
              [REWIND THE INTERNET] • TEMPORAL RECONSTRUCTION ENGINE
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCrtEnabled(!crtEnabled)}
            className="px-3 py-1.5 rounded-lg text-xs font-mono font-semibold border border-[#3e4c63] bg-[#1a202c] hover:bg-[#2d3748] text-[#a0aec0] hover:text-white transition-all flex items-center gap-1.5"
            title="Toggle CRT Screen Scanlines"
          >
            <span>📺</span>
            <span>CRT: {crtEnabled ? 'ON' : 'OFF'}</span>
          </button>

          <button
            onClick={handleToggleSound}
            className="px-3 py-1.5 rounded-lg text-xs font-mono font-semibold border border-[#3e4c63] bg-[#1a202c] hover:bg-[#2d3748] text-[#a0aec0] hover:text-white transition-all flex items-center gap-1.5"
          >
            <span>{!soundMuted ? '🔊' : '🔇'}</span>
            <span>{!soundMuted ? 'AUDIO: ON' : 'MUTED'}</span>
          </button>
        </div>
      </header>

      {/* Timeline Scrubber */}
      <Timeline
        eras={ERAS}
        currentEra={currentEra}
        currentIndex={currentIndex}
        onSelectEra={handleSelectEra}
        onPrevEra={handlePrevEra}
        onNextEra={handleNextEra}
      />

      {/* Main Era Display */}
      <main className="max-w-7xl mx-auto w-full p-4 sm:p-6 flex-1">
        {currentEraId === '1995' ? (
          <Era1995 era={currentEra} />
        ) : currentEraId === '2000' ? (
          <Era2000 era={currentEra} />
        ) : currentEraId === '2005' ? (
          <Era2005 era={currentEra} />
        ) : (
          <div className="bg-slate-900 border border-white/10 rounded-2xl p-12 text-center space-y-3">
            <div className="text-4xl font-mono text-amber-400 font-bold">{currentEra.year}</div>
            <h2 className="text-xl font-bold uppercase">{currentEra.eraName}</h2>
            <p className="text-xs text-slate-400 max-w-md mx-auto">{currentEra.subtitle}</p>
            <div className="inline-block mt-4 px-3 py-1 bg-amber-400/10 text-amber-300 border border-amber-400/30 rounded-full text-xs font-mono">
              Coming in future challenge days! 🚀
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
