import React, { useState, useEffect, useRef, useCallback } from 'react';
import { sound } from '../../utils/audio';

interface Track {
  id: number;
  title: string;
  artist: string;
  duration: string;
  bpm: number;
  melody: number[];
}

const PLAYLIST: Track[] = [
  {
    id: 1,
    title: 'Sandstorm (Synth 2000)',
    artist: 'Darude',
    duration: '03:45',
    bpm: 136,
    melody: [
      293.66, 293.66, 293.66, 293.66, 293.66,
      293.66, 293.66, 293.66, 293.66, 293.66, 293.66, 349.23,
      293.66, 293.66, 293.66, 293.66, 293.66, 293.66, 293.66, 440.00, 392.00
    ]
  },
  {
    id: 2,
    title: 'Blue (Da Ba Dee)',
    artist: 'Eiffel 65',
    duration: '03:39',
    bpm: 128,
    melody: [
      329.63, 392.00, 440.00, 493.88, 440.00, 392.00, 329.63,
      293.66, 329.63, 392.00, 440.00, 392.00, 329.63, 293.66
    ]
  },
  {
    id: 3,
    title: 'All Star (8-bit Riff)',
    artist: 'Smash Mouth',
    duration: '03:21',
    bpm: 104,
    melody: [
      392.00, 587.33, 493.88, 493.88, 440.00, 392.00, 392.00,
      440.00, 493.88, 440.00, 392.00, 392.00, 523.25, 493.88
    ]
  },
  {
    id: 4,
    title: 'Clubbed to Death',
    artist: 'Rob Dougan (Matrix OST)',
    duration: '04:12',
    bpm: 90,
    melody: [
      220.00, 261.63, 293.66, 329.63, 293.66, 261.63, 220.00,
      196.00, 220.00, 261.63, 220.00, 164.81, 196.00, 220.00
    ]
  },
  {
    id: 5,
    title: 'Hampton The Hamster',
    artist: 'The Hamster Dance',
    duration: '02:55',
    bpm: 135,
    melody: [
      523.25, 659.25, 783.99, 659.25, 523.25, 659.25, 783.99,
      880.00, 783.99, 659.25, 587.33, 523.25
    ]
  }
];

interface WinampProps {
  onClose?: () => void;
}

export const Winamp2000: React.FC<WinampProps> = ({ onClose }) => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [volume, setVolume] = useState(85);
  const [showPlaylist, setShowPlaylist] = useState(true);
  const [showEq, setShowEq] = useState(false);
  const [isShaded, setIsShaded] = useState(false);
  const [eqLevels, setEqLevels] = useState<number[]>([3, 5, 2, -1, 0, 4, 6, 3, 2, 1]);

  // Visualizer spectrum bars
  const [spectrumBars, setSpectrumBars] = useState<number[]>(new Array(16).fill(2));

  const audioCtxRef = useRef<AudioContext | null>(null);
  const timerRef = useRef<number | null>(null);
  const noteIndexRef = useRef(0);
  const synthIntervalRef = useRef<number | null>(null);

  const currentTrack = PLAYLIST[currentTrackIndex];

  // Stop music synthesizer
  const stopAudio = useCallback(() => {
    if (synthIntervalRef.current) {
      clearInterval(synthIntervalRef.current);
      synthIntervalRef.current = null;
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setIsPlaying(false);
    setIsPaused(false);
    setSecondsElapsed(0);
    setSpectrumBars(new Array(16).fill(1));
  }, []);

  // Play chiptune synthesizer
  const startAudio = useCallback((trackIdx: number) => {
    stopAudio();
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume().catch(() => {});
      }

      setIsPlaying(true);
      setIsPaused(false);
      const track = PLAYLIST[trackIdx];
      const intervalMs = Math.round((60 / track.bpm) * 500); // 8th note speed

      noteIndexRef.current = 0;

      // Elapsed time counter
      timerRef.current = window.setInterval(() => {
        setSecondsElapsed(prev => prev + 1);
      }, 1000);

      // Note oscillator sequencer & visualizer update
      synthIntervalRef.current = window.setInterval(() => {
        if (!ctx || ctx.state === 'suspended') return;
        const now = ctx.currentTime;
        const noteFreq = track.melody[noteIndexRef.current % track.melody.length];

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        // Authentic 2000 soundcard square/saw wave
        osc.type = noteIndexRef.current % 3 === 0 ? 'sawtooth' : 'square';
        osc.frequency.setValueAtTime(noteFreq, now);

        const currentVol = (volume / 100) * 0.08;
        gain.gain.setValueAtTime(currentVol, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + (intervalMs / 1000) * 0.85);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + (intervalMs / 1000));

        // Generate spectrum visualizer peaks reactive to current note
        const baseHeight = Math.min(100, Math.max(15, (noteFreq / 800) * 100));
        setSpectrumBars(() => {
          return Array.from({ length: 16 }, (_, i) => {
            const dist = Math.abs(i - (noteIndexRef.current % 16));
            const variance = Math.sin(i * 1.5 + noteIndexRef.current) * 20;
            const barVal = Math.max(4, Math.min(100, (baseHeight - dist * 4) + variance));
            return Math.floor(barVal);
          });
        });

        noteIndexRef.current++;
      }, intervalMs);
    } catch {
      setIsPlaying(false);
    }
  }, [stopAudio, volume]);

  const handlePlay = () => {
    sound.playClick('2000');
    if (isPaused) {
      startAudio(currentTrackIndex);
    } else {
      startAudio(currentTrackIndex);
    }
  };

  const handlePause = () => {
    sound.playClick('2000');
    if (isPlaying) {
      if (synthIntervalRef.current) clearInterval(synthIntervalRef.current);
      if (timerRef.current) clearInterval(timerRef.current);
      setIsPlaying(false);
      setIsPaused(true);
      setSpectrumBars(new Array(16).fill(1));
    }
  };

  const handleNext = () => {
    sound.playClick('2000');
    const nextIdx = (currentTrackIndex + 1) % PLAYLIST.length;
    setCurrentTrackIndex(nextIdx);
    if (isPlaying) startAudio(nextIdx);
  };

  const handlePrev = () => {
    sound.playClick('2000');
    const prevIdx = currentTrackIndex > 0 ? currentTrackIndex - 1 : PLAYLIST.length - 1;
    setCurrentTrackIndex(prevIdx);
    if (isPlaying) startAudio(prevIdx);
  };

  useEffect(() => {
    return () => {
      stopAudio();
    };
  }, [stopAudio]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  return (
    <div className="w-full max-w-md mx-auto my-4 font-mono select-none shadow-[0_0_15px_rgba(0,255,255,0.3)]">
      {/* ── WINAMP MAIN WINDOW ── */}
      <div className="bg-[#242730] border-2 border-t-[#687082] border-l-[#687082] border-r-[#0f1115] border-b-[#0f1115] p-1.5 text-white">
        
        {/* Title Bar */}
        <div className="bg-gradient-to-r from-[#000080] via-[#2453a6] to-[#000080] text-white px-2 py-0.5 flex items-center justify-between text-[11px] font-bold border border-[#00ffff]/40">
          <div className="flex items-center gap-1.5 truncate">
            <span className="text-yellow-400 font-black tracking-tighter text-[12px]">⚡</span>
            <span className="tracking-wide">WINAMP v2.91</span>
          </div>
          <div className="flex items-center gap-1 shrink-0 font-sans text-[10px]">
            <button
              onClick={() => setIsShaded(!isShaded)}
              className="w-3.5 h-3.5 bg-[#c0c0c0] text-black font-bold border border-t-white border-l-white border-r-black border-b-black flex items-center justify-center leading-none"
              title="Toggle Shade Mode"
            >
              {isShaded ? '▼' : '▲'}
            </button>
            <button
              onClick={onClose}
              className="w-3.5 h-3.5 bg-[#c0c0c0] text-black font-bold border border-t-white border-l-white border-r-black border-b-black flex items-center justify-center leading-none"
              title="Close Winamp"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Shaded Mini Bar */}
        {isShaded ? (
          <div className="bg-black p-1.5 flex items-center justify-between mt-1 border border-[#3e4452]">
            <div className="text-[#00ff00] text-xs font-bold truncate">
              {formatTime(secondsElapsed)} {currentTrack.artist} - {currentTrack.title}
            </div>
            <div className="flex gap-1">
              <button onClick={handlePlay} className="px-1.5 bg-[#3a3f4d] text-white text-[10px] border border-t-white border-b-black">▶</button>
              <button onClick={handlePause} className="px-1.5 bg-[#3a3f4d] text-white text-[10px] border border-t-white border-b-black">⏸</button>
              <button onClick={stopAudio} className="px-1.5 bg-[#3a3f4d] text-white text-[10px] border border-t-white border-b-black">■</button>
            </div>
          </div>
        ) : (
          <>
            {/* Top LCD Display Panel */}
            <div className="bg-black border-2 border-t-[#0a0a0e] border-l-[#0a0a0e] border-r-[#4f5869] border-b-[#4f5869] p-2 mt-1.5 mb-2">
              
              {/* Top status & Spectrum */}
              <div className="flex items-start justify-between gap-2">
                {/* 7-Segment Digital Clock */}
                <div className="bg-[#051405] border border-[#005500] px-2 py-0.5 rounded text-center">
                  <div className="text-[8px] text-[#008800] uppercase tracking-wider font-bold">TRACK TIME</div>
                  <div className="text-2xl font-bold tracking-widest text-[#00ff41] font-mono drop-shadow-[0_0_6px_#00ff41]">
                    {formatTime(secondsElapsed)}
                  </div>
                </div>

                {/* 16-Bar Spectrum Analyzer */}
                <div className="flex-1 bg-[#051405] border border-[#005500] p-1 h-[42px] flex items-end justify-between gap-[2px]">
                  {spectrumBars.map((val, idx) => (
                    <div key={idx} className="flex-1 h-full flex flex-col justify-end">
                      <div
                        className="w-full transition-all duration-75 rounded-[1px]"
                        style={{
                          height: `${val}%`,
                          background:
                            val > 80
                              ? '#ff3333'
                              : val > 50
                              ? '#ffff00'
                              : '#00ff41',
                          boxShadow: isPlaying ? '0 0 4px currentColor' : 'none'
                        }}
                      />
                    </div>
                  ))}
                </div>

                {/* KBPS / KHZ / Stereo Badges */}
                <div className="flex flex-col gap-0.5 text-[8px] text-right font-bold text-[#00aa00]">
                  <span className="bg-[#002200] px-1 py-0.5 border border-[#004400] text-[#00ff00]">128 KBPS</span>
                  <span className="bg-[#002200] px-1 py-0.5 border border-[#004400] text-[#00ff00]">44.1 KHZ</span>
                  <span className="bg-[#002200] px-1 py-0.5 border border-[#004400] text-[#00ff00]">STEREO</span>
                </div>
              </div>

              {/* Scrolling Song Title Marquee */}
              <div className="mt-2 bg-[#001800] border border-[#004400] px-2 py-1 overflow-hidden whitespace-nowrap">
                <div className="text-[#00ff41] text-xs font-bold inline-block animate-marquee drop-shadow-[0_0_4px_#00ff41]">
                  {isPlaying ? '▶' : isPaused ? '⏸' : '■'} {currentTrackIndex + 1}. {currentTrack.artist} - {currentTrack.title} ({currentTrack.duration}) *** WINAMP: IT REALLY WHIPS THE LLAMA'S ASS! ***
                </div>
              </div>
            </div>

            {/* Middle Sliders: Volume & Balance */}
            <div className="bg-[#1b1e25] border border-[#373d4a] p-1.5 mb-2 flex items-center justify-between gap-3 text-[10px] text-gray-300">
              <div className="flex items-center gap-1.5 flex-1">
                <span className="text-[#00ff00] font-bold">VOL:</span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={volume}
                  onChange={(e) => setVolume(Number(e.target.value))}
                  className="w-full accent-[#00ff41] h-1.5 bg-black cursor-pointer"
                />
                <span className="text-gray-400 w-7 text-right">{volume}%</span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setShowEq(!showEq)}
                  className={`px-1.5 py-0.5 text-[9px] font-bold border border-t-white border-l-white border-r-black border-b-black ${
                    showEq ? 'bg-[#00aaaa] text-black font-extrabold' : 'bg-[#3b414f] text-gray-200'
                  }`}
                >
                  EQ
                </button>
                <button
                  onClick={() => setShowPlaylist(!showPlaylist)}
                  className={`px-1.5 py-0.5 text-[9px] font-bold border border-t-white border-l-white border-r-black border-b-black ${
                    showPlaylist ? 'bg-[#ff00ff] text-white font-extrabold' : 'bg-[#3b414f] text-gray-200'
                  }`}
                >
                  PL
                </button>
              </div>
            </div>

            {/* Transport Control Buttons */}
            <div className="grid grid-cols-6 gap-1 bg-[#16181e] p-1 border border-[#3e4452]">
              <button
                onClick={handlePrev}
                title="Previous Track"
                className="py-1.5 bg-[#3a404f] hover:bg-[#4d5568] active:bg-[#282c37] text-white font-black text-xs border border-t-white border-l-white border-r-black border-b-black shadow"
              >
                |◀◀
              </button>
              <button
                onClick={handlePlay}
                title="Play"
                className={`py-1.5 ${isPlaying ? 'bg-[#00ff41] text-black' : 'bg-[#3a404f] text-white hover:bg-[#4d5568]'} font-black text-xs border border-t-white border-l-white border-r-black border-b-black shadow`}
              >
                ▶
              </button>
              <button
                onClick={handlePause}
                title="Pause"
                className={`py-1.5 ${isPaused ? 'bg-[#ffff00] text-black' : 'bg-[#3a404f] text-white hover:bg-[#4d5568]'} font-black text-xs border border-t-white border-l-white border-r-black border-b-black shadow`}
              >
                ❚❚
              </button>
              <button
                onClick={stopAudio}
                title="Stop"
                className="py-1.5 bg-[#3a404f] hover:bg-[#4d5568] active:bg-[#282c37] text-white font-black text-xs border border-t-white border-l-white border-r-black border-b-black shadow"
              >
                ■
              </button>
              <button
                onClick={handleNext}
                title="Next Track"
                className="py-1.5 bg-[#3a404f] hover:bg-[#4d5568] active:bg-[#282c37] text-white font-black text-xs border border-t-white border-l-white border-r-black border-b-black shadow"
              >
                ▶▶|
              </button>
              <button
                onClick={() => {
                  sound.playClick('2000');
                  alert('EJECT: Please insert CD-ROM into drive D:\\');
                }}
                title="Eject CD"
                className="py-1.5 bg-[#3a404f] hover:bg-[#4d5568] active:bg-[#282c37] text-yellow-400 font-black text-xs border border-t-white border-l-white border-r-black border-b-black shadow"
              >
                ⏏
              </button>
            </div>
          </>
        )}
      </div>

      {/* ── OPTIONAL EQUALIZER DRAWER ── */}
      {showEq && !isShaded && (
        <div className="bg-[#1e2129] border-2 border-t-black border-l-[#687082] border-r-[#0f1115] border-b-[#0f1115] p-2 mt-0.5 text-white">
          <div className="text-[10px] font-bold text-[#00ffff] mb-1.5 flex justify-between border-b border-[#3e4452] pb-0.5">
            <span>WINAMP EQUALIZER</span>
            <span className="text-[#00ff00]">PRESETS: [TECHNO / CLUB]</span>
          </div>
          <div className="flex items-center justify-between gap-1 h-20 pt-1">
            {['60', '170', '310', '600', '1K', '3K', '6K', '12K', '14K', '16K'].map((band, idx) => (
              <div key={band} className="flex-1 flex flex-col items-center h-full justify-between">
                <input
                  type="range"
                  min="-10"
                  max="10"
                  value={eqLevels[idx]}
                  onChange={(e) => {
                    const newLevels = [...eqLevels];
                    newLevels[idx] = Number(e.target.value);
                    setEqLevels(newLevels);
                  }}
                  className="h-14 -rotate-90 w-12 accent-[#00ff41] bg-black cursor-pointer"
                />
                <span className="text-[8px] text-gray-400 font-mono mt-1">{band}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── PLAYLIST DRAWER (PL) ── */}
      {showPlaylist && !isShaded && (
        <div className="bg-[#12141a] border-2 border-t-black border-l-[#687082] border-r-[#0f1115] border-b-[#0f1115] p-2 mt-0.5 text-white">
          <div className="bg-[#000044] text-[#ffff00] px-2 py-0.5 text-[10px] font-bold flex justify-between items-center border border-[#00ffff]/30 mb-1.5">
            <span>WINAMP PLAYLIST [{PLAYLIST.length} TRACKS]</span>
            <span className="text-[#00ff00]">TOTAL TIME: 17:52</span>
          </div>

          <div className="bg-black border border-[#2a2f3d] p-1 max-h-36 overflow-y-auto font-mono text-xs space-y-0.5">
            {PLAYLIST.map((track, idx) => {
              const isSelected = currentTrackIndex === idx;
              return (
                <div
                  key={track.id}
                  onClick={() => {
                    sound.playClick('2000');
                    setCurrentTrackIndex(idx);
                    startAudio(idx);
                  }}
                  className={`px-2 py-1 cursor-pointer flex justify-between items-center transition-colors text-[11px] ${
                    isSelected
                      ? 'bg-[#000080] text-[#00ff41] font-bold'
                      : 'text-gray-300 hover:bg-[#1a2030] hover:text-white'
                  }`}
                >
                  <div className="truncate">
                    <span className="text-[#00ffff] mr-1.5">{idx + 1}.</span>
                    <span>{track.artist} - {track.title}</span>
                  </div>
                  <span className="text-gray-400 text-[10px] ml-2 shrink-0">{track.duration}</span>
                </div>
              );
            })}
          </div>

          <div className="mt-1.5 flex justify-between items-center text-[10px] text-gray-400">
            <span>Click any track to play</span>
            <button
              onClick={() => {
                sound.playClick('2000');
                const randomIdx = Math.floor(Math.random() * PLAYLIST.length);
                setCurrentTrackIndex(randomIdx);
                startAudio(randomIdx);
              }}
              className="px-2 py-0.5 bg-[#2d3240] hover:bg-[#3f4659] text-white border border-t-white border-l-white border-r-black border-b-black"
            >
              🔀 Shuffle Track
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
