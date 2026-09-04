import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { EraConfig } from '../../types/era';
import { sound } from '../../utils/audio';

interface Props {
  era: EraConfig;
}

interface AimMessage {
  sender: string;
  text: string;
  isMe: boolean;
}

export const Era2000: React.FC<Props> = () => {
  // Page state
  const [visitorCount, setVisitorCount] = useState<number>(() => {
    const saved = localStorage.getItem('backspace_2000_hits');
    return saved ? parseInt(saved, 10) : 13370;
  });

  const [activePage, setActivePage] = useState<'home' | 'webring' | 'mp3s' | 'about'>('home');

  // MIDI Player state (Web Audio API synth loop)
  const [isPlayingMidi, setIsPlayingMidi] = useState<boolean>(false);
  const [currentTrack, setCurrentTrack] = useState<string>('Cyber Techno (Synthesized)');
  const midiIntervalRef = useRef<number | null>(null);

  // AIM (AOL Instant Messenger) widget state
  const [showAim, setShowAim] = useState<boolean>(false);
  const [aimInput, setAimInput] = useState<string>('');
  const [aimMessages, setAimMessages] = useState<AimMessage[]>([
    { sender: 'CoolSk8r99', text: 'yo!! did u download that new mp3 off Napster yet??', isMe: false },
    { sender: 'MatrixFan00', text: 'brb mom needs to use the phone line to call grandma', isMe: false }
  ]);

  // Webring navigation state
  const webringSites = [
    { name: '~*~ The Matrix Cyber Shrine ~*~', url: 'http://www.geocities.com/Area51/Vault/1999/', ring: 'Sci-Fi WebRing #402' },
    { name: 'Hamster Dance Original Fanclub', url: 'http://www.geocities.com/Heartland/Acres/1337/', ring: 'Dot-Com FunRing #12' },
    { name: 'DragonBall Z GIF Galaxy', url: 'http://www.geocities.com/Tokyo/Pagoda/9000/', ring: 'Anime CyberRing #88' },
    { name: 'Napster MP3 Underground Vault', url: 'http://www.geocities.com/SiliconValley/Pinnacle/2000/', ring: 'MusicWarez Ring #64' },
    { name: 'Homestar Runner Flash Appreciation', url: 'http://www.geocities.com/SoHo/Lofts/4040/', ring: 'Flash Portal Ring #101' }
  ];
  const [currentRingIndex, setCurrentRingIndex] = useState<number>(0);

  // Synthesize chiptune MIDI using Web Audio API
  const toggleMidi = () => {
    sound.playClick('2000');
    if (isPlayingMidi) {
      if (midiIntervalRef.current) clearInterval(midiIntervalRef.current);
      setIsPlayingMidi(false);
      return;
    }

    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      setIsPlayingMidi(true);

      const melody = [261.63, 329.63, 392.00, 523.25, 392.00, 329.63, 293.66, 349.23, 440.00, 587.33];
      let noteIndex = 0;

      midiIntervalRef.current = window.setInterval(() => {
        if (!isPlayingMidi) return;
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(melody[noteIndex % melody.length], now);
        gain.gain.setValueAtTime(0.06, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.2);
        noteIndex++;
      }, 220);
    } catch {
      setIsPlayingMidi(false);
    }
  };

  useEffect(() => {
    return () => {
      if (midiIntervalRef.current) clearInterval(midiIntervalRef.current);
    };
  }, [isPlayingMidi]);

  // Handle AIM send
  const handleSendAim = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aimInput.trim()) return;
    sound.playClick('2000');
    const userMsg = aimInput.trim();
    setAimMessages(prev => [...prev, { sender: 'You (xX_CyberGod_Xx)', text: userMsg, isMe: true }]);
    setAimInput('');

    // Authentic retro bot replies
    setTimeout(() => {
      const autoReplies = [
        'haha lol rofl!!',
        'a/s/l ???',
        'Hold on, Kazaa download finished!',
        'gtg dinner, leave an away msg!',
        'dude, check out this sweet new Winamp skin!'
      ];
      const reply = autoReplies[Math.floor(Math.random() * autoReplies.length)];
      setAimMessages(prev => [...prev, { sender: 'CoolSk8r99', text: reply, isMe: false }]);
      sound.playClick('2000');
    }, 1200);
  };

  // Badge click reaction
  const handleBadgeClick = (badge: string) => {
    sound.playClick('2000');
    confetti({
      particleCount: 25,
      spread: 60,
      origin: { y: 0.8 }
    });
    alert(`★ 88x31 Badge clicked: "${badge}" added to your retro bookmark cache!`);
  };

  return (
    <div className="w-full bg-[#000033] text-white font-['Comic_Sans_MS',cursive,sans-serif] p-1 sm:p-2 border-4 border-[#00ffff] shadow-[0_0_20px_rgba(0,255,255,0.4)] select-text">
      
      {/* 1. Microsoft Internet Explorer 5.5 Title Bar */}
      <div className="bg-gradient-to-r from-[#0a246a] via-[#a6caf0] to-[#0a246a] text-white px-2 py-1 mb-1 flex items-center justify-between font-sans text-xs font-bold select-none border border-[#00ffff]">
        <div className="flex items-center gap-1.5 truncate">
          <span className="text-yellow-300">🌐</span>
          <span className="truncate">
            Microsoft Internet Explorer - [~*~ CyberRealm 2000: SiliconValley/Pinnacle/4096 ~*~]
          </span>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => sound.playClick('2000')}
            className="w-4 h-4 bg-[#c0c0c0] text-black text-[10px] font-bold border border-t-[#fff] border-l-[#fff] border-r-[#000] border-b-[#000]"
          >
            _
          </button>
          <button
            onClick={() => sound.playClick('2000')}
            className="w-4 h-4 bg-[#c0c0c0] text-black text-[10px] font-bold border border-t-[#fff] border-l-[#fff] border-r-[#000] border-b-[#000]"
          >
            □
          </button>
          <button
            onClick={() => {
              sound.playClick('2000');
              alert('Y2K safe! Cannot close Internet Explorer 5.5.');
            }}
            className="w-4 h-4 bg-[#c0c0c0] text-black text-[10px] font-bold border border-t-[#fff] border-l-[#fff] border-r-[#000] border-b-[#000]"
          >
            ✕
          </button>
        </div>
      </div>

      {/* 2. IE 5.5 Beveled Toolbar */}
      <div className="bg-[#d4d0c8] text-black p-1 border-b-2 border-[#808080] mb-2 flex flex-wrap items-center justify-between gap-1 font-sans text-xs">
        <div className="flex items-center gap-1 overflow-x-auto py-0.5">
          <button
            onClick={() => {
              sound.playClick('2000');
              setActivePage('home');
            }}
            className="px-2 py-1 bg-[#ece9d8] border border-t-[#fff] border-l-[#fff] border-r-[#808080] border-b-[#808080] hover:bg-white flex items-center gap-1 text-[11px] font-semibold"
          >
            <span>⬅️</span> <span>Back</span>
          </button>
          <button
            onClick={() => {
              sound.playClick('2000');
              setActivePage('home');
            }}
            className="px-2 py-1 bg-[#ece9d8] border border-t-[#fff] border-l-[#fff] border-r-[#808080] border-b-[#808080] hover:bg-white flex items-center gap-1 text-[11px] font-semibold"
          >
            <span>🏠</span> <span>Home</span>
          </button>
          <button
            onClick={() => {
              sound.playClick('2000');
              alert('Page refreshed! ActiveX controls reloaded.');
            }}
            className="px-2 py-1 bg-[#ece9d8] border border-t-[#fff] border-l-[#fff] border-r-[#808080] border-b-[#808080] hover:bg-white flex items-center gap-1 text-[11px] font-semibold"
          >
            <span>🔄</span> <span>Refresh</span>
          </button>
          <button
            onClick={() => {
              sound.playClick('2000');
              alert('Added to Favorites (C:\\WINDOWS\\Favorites\\Geocities)');
            }}
            className="px-2 py-1 bg-[#ece9d8] border border-t-[#fff] border-l-[#fff] border-r-[#808080] border-b-[#808080] hover:bg-white flex items-center gap-1 text-[11px] font-semibold"
          >
            <span>⭐</span> <span>Favorites</span>
          </button>
          <button
            onClick={() => setShowAim(!showAim)}
            className="px-2 py-1 bg-[#ffff00] text-black border border-t-[#fff] border-l-[#fff] border-r-[#000] border-b-[#000] hover:bg-yellow-300 flex items-center gap-1 text-[11px] font-bold"
          >
            <span>💬</span> <span>AIM Messenger ({aimMessages.length})</span>
          </button>
        </div>

        {/* Spinning e Logo */}
        <div className="w-6 h-6 bg-[#0a246a] rounded-full border border-white flex items-center justify-center text-white font-bold text-xs shadow-inner animate-pulse">
          e
        </div>
      </div>

      {/* 3. Address Bar */}
      <div className="bg-[#ece9d8] text-black p-1 border-2 border-t-[#808080] border-l-[#808080] border-r-[#fff] border-b-[#fff] mb-3 flex items-center gap-2 font-mono text-xs">
        <span className="font-sans font-bold text-[#000080]">Address:</span>
        <span className="bg-white px-2 py-0.5 border border-[#808080] flex-1 truncate text-[#000080]">
          http://www.geocities.com/SiliconValley/Pinnacle/4096/index.html
        </span>
      </div>

      {/* 4. Geocities Main Cyber Webpage */}
      <div className="bg-[#050522] border-4 border-double border-[#ff00ff] p-4 text-center relative overflow-hidden">
        
        {/* Neon Flashing Banner */}
        <div className="mb-4">
          <div className="text-3xl sm:text-4xl font-black tracking-wider text-[#00ffff] drop-shadow-[0_0_8px_#00ffff] animate-pulse">
            🔥 WELCOME TO CYBER-REALM 2000 🔥
          </div>
          <div className="text-xs font-mono text-[#ffff00] mt-1">
            ~*~ Best Viewed with 1024x768 Resolution in Internet Explorer 5.0+ ~*~
          </div>
        </div>

        {/* Embedded 2000 MIDI Track Player */}
        <div className="max-w-md mx-auto mb-6 bg-[#000044] border-2 border-[#00ffff] p-2 rounded shadow-[0_0_10px_#00ffff]">
          <div className="text-[11px] font-mono text-[#00ffff] flex items-center justify-between mb-1">
            <span>🎵 EMBEDDED MIDI SYNTH PLAYER v2.0</span>
            <span className={isPlayingMidi ? 'text-green-400 animate-pulse' : 'text-gray-400'}>
              {isPlayingMidi ? 'PLAYING ▶' : 'STOPPED ■'}
            </span>
          </div>
          <div className="bg-black p-1.5 font-mono text-xs text-[#ffff00] border border-cyan-500 mb-2 truncate">
            Track: {currentTrack}
          </div>
          <div className="flex gap-2 justify-center font-sans">
            <button
              onClick={toggleMidi}
              className="px-3 py-1 bg-[#00ffff] text-black font-bold text-xs hover:bg-[#ff00ff] hover:text-white transition-colors border border-black"
            >
              {isPlayingMidi ? '⏸ Pause MIDI' : '▶ Play Background MIDI'}
            </button>
            <button
              onClick={() => {
                sound.playClick('2000');
                const tracks = ['Matrix Cyber Techno', 'Darude Sandstorm Chiptune', 'All-Star Smash Synth'];
                const next = tracks[(tracks.indexOf(currentTrack) + 1) % tracks.length];
                setCurrentTrack(next);
              }}
              className="px-2 py-1 bg-[#333366] text-white font-bold text-xs border border-white hover:bg-[#555599]"
            >
              ⏭ Next Track
            </button>
          </div>
        </div>

        {/* Interactive Geocities Content Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left mb-6">
          
          {/* Left Column: Cyber Navigation & Profile */}
          <div className="bg-[#000033] border-2 border-[#00ffff] p-3 space-y-3">
            <h3 className="text-center font-bold text-[#ffff00] border-b border-[#00ffff] pb-1 text-sm">
              ⚡ CYBER NAVIGATOR ⚡
            </h3>
            <ul className="space-y-1.5 text-xs">
              <li>
                <button
                  onClick={() => { sound.playClick('2000'); setActivePage('home'); }}
                  className={`w-full text-left px-2 py-1 border ${activePage === 'home' ? 'bg-[#ff00ff] text-white' : 'bg-[#111144] text-[#00ffff]'} hover:bg-[#ff00ff] hover:text-white`}
                >
                  🚀 Home Base
                </button>
              </li>
              <li>
                <button
                  onClick={() => { sound.playClick('2000'); setActivePage('mp3s'); }}
                  className={`w-full text-left px-2 py-1 border ${activePage === 'mp3s' ? 'bg-[#ff00ff] text-white' : 'bg-[#111144] text-[#00ffff]'} hover:bg-[#ff00ff] hover:text-white`}
                >
                  💾 Napster MP3 Stash
                </button>
              </li>
              <li>
                <button
                  onClick={() => { sound.playClick('2000'); setActivePage('webring'); }}
                  className={`w-full text-left px-2 py-1 border ${activePage === 'webring' ? 'bg-[#ff00ff] text-white' : 'bg-[#111144] text-[#00ffff]'} hover:bg-[#ff00ff] hover:text-white`}
                >
                  🪐 Cyber Webring Hub
                </button>
              </li>
            </ul>

            {/* Retro Odometer Visitor Counter */}
            <div className="pt-2 border-t border-[#00ffff] text-center">
              <div className="text-[10px] text-[#ffff00] font-mono mb-1">YOU ARE VISITOR NO:</div>
              <div
                onClick={() => {
                  sound.playClick('2000');
                  const next = visitorCount + 1;
                  setVisitorCount(next);
                  localStorage.setItem('backspace_2000_hits', next.toString());
                }}
                className="inline-block bg-black text-[#00ff00] font-mono font-bold text-xl px-3 py-1 border-2 border-red-500 shadow-[0_0_8px_#00ff00] cursor-pointer"
                title="Click to bump counter!"
              >
                {String(visitorCount).padStart(6, '0')}
              </div>
            </div>

            {/* Hazard Under Construction */}
            <div className="bg-yellow-400 text-black font-bold p-1 text-center text-xs tracking-wider border-2 border-black animate-bounce">
              ⚠️ PAGE UNDER HEAVY CONSTRUCTION ⚠️
            </div>
          </div>

          {/* Center Column: Dynamic Era Showcase */}
          <div className="md:col-span-2 bg-[#000033] border-2 border-[#ff00ff] p-4 text-xs space-y-4">
            {activePage === 'home' && (
              <div>
                <h2 className="text-lg font-bold text-[#00ffff] border-b border-[#ff00ff] pb-1 mb-2">
                  💫 Greetings Traveler of Cyberspace!
                </h2>
                <p className="leading-relaxed mb-3 text-slate-200">
                  Welcome to my personal home page hosted on <strong>GeoCities (SiliconValley)</strong>! 
                  Here you will find my collection of Flash animations, Winamp skins, Napster MP3 playlists, and Y2K survival tips. 
                  Don't forget to sign the guestbook before you leave!
                </p>

                <div className="p-3 bg-[#111144] border border-[#00ffff] rounded mb-3">
                  <span className="font-bold text-[#ffff00]">Y2K STATUS REPORT:</span>
                  <p className="text-[11px] text-gray-300 mt-1">
                    System clock: January 2000. Power grid intact! All Pentium III processors operating normally. No nuclear silos malfunctioned! 🎉
                  </p>
                </div>
              </div>
            )}

            {activePage === 'mp3s' && (
              <div>
                <h2 className="text-lg font-bold text-[#00ffff] border-b border-[#ff00ff] pb-1 mb-2">
                  🎧 Napster MP3 Underground Vault (128 kbps)
                </h2>
                <ul className="space-y-2">
                  {[
                    { title: 'Darude - Sandstorm.mp3', size: '3.4 MB', time: '38 mins @ 56k' },
                    { title: 'Smash Mouth - All Star.mp3', size: '3.1 MB', time: '32 mins @ 56k' },
                    { title: 'Eiffel 65 - Blue (Da Ba Dee).mp3', size: '3.8 MB', time: '41 mins @ 56k' },
                    { title: 'Linkin Park - One Step Closer.mp3', size: '2.9 MB', time: '29 mins @ 56k' }
                  ].map((mp3, i) => (
                    <li key={i} className="bg-[#111144] p-2 border border-[#ff00ff] flex items-center justify-between">
                      <div>
                        <span className="font-bold text-[#ffff00]">🎵 {mp3.title}</span>
                        <div className="text-[10px] text-gray-400">{mp3.size} • DL Est: {mp3.time}</div>
                      </div>
                      <button
                        onClick={() => {
                          sound.playClick('2000');
                          alert(`Queued in Napster client v2.0 beta! Downloading over 56k modem...`);
                        }}
                        className="px-2 py-1 bg-[#00ffff] text-black font-bold text-[11px] hover:bg-[#ffff00]"
                      >
                        Download
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {activePage === 'webring' && (
              <div>
                <h2 className="text-lg font-bold text-[#00ffff] border-b border-[#ff00ff] pb-1 mb-2">
                  🪐 Interactive 2000 Webring Explorer
                </h2>
                <div className="bg-[#111144] p-3 border-2 border-[#00ffff] text-center mb-3">
                  <div className="text-[#ffff00] font-bold text-sm mb-1">
                    {webringSites[currentRingIndex].ring}
                  </div>
                  <div className="text-white text-base font-bold mb-2">
                    "{webringSites[currentRingIndex].name}"
                  </div>
                  <div className="text-[11px] text-cyan-300 font-mono mb-3">
                    {webringSites[currentRingIndex].url}
                  </div>

                  <div className="flex flex-wrap gap-2 justify-center font-sans text-xs">
                    <button
                      onClick={() => {
                        sound.playClick('2000');
                        setCurrentRingIndex((prev) => (prev > 0 ? prev - 1 : webringSites.length - 1));
                      }}
                      className="px-2 py-1 bg-[#ff00ff] text-white font-bold border border-white"
                    >
                      [ &lt;&lt; Prev Site ]
                    </button>
                    <button
                      onClick={() => {
                        sound.playClick('2000');
                        setCurrentRingIndex(Math.floor(Math.random() * webringSites.length));
                      }}
                      className="px-2 py-1 bg-[#ffff00] text-black font-bold border border-black"
                    >
                      [ 🎲 Random Site ]
                    </button>
                    <button
                      onClick={() => {
                        sound.playClick('2000');
                        setCurrentRingIndex((prev) => (prev + 1) % webringSites.length);
                      }}
                      className="px-2 py-1 bg-[#00ffff] text-black font-bold border border-black"
                    >
                      [ Next Site &gt;&gt; ]
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* 88x31 Button Badge Showcase */}
            <div className="pt-3 border-t border-[#ff00ff]">
              <div className="text-center text-[11px] font-bold text-[#ffff00] mb-2 font-mono">
                ★ 88x31 PIXEL CYBER BADGES (CLICK TO COLLECT) ★
              </div>
              <div className="flex flex-wrap gap-2 justify-center">
                {[
                  { label: 'Internet Explorer 5.5', bg: 'bg-[#000080]', text: 'text-white' },
                  { label: 'Netscape NOW!', bg: 'bg-[#006666]', text: 'text-yellow-300' },
                  { label: 'Made with Notepad', bg: 'bg-[#333333]', text: 'text-green-400' },
                  { label: 'ICQ: 1409219', bg: 'bg-[#006600]', text: 'text-white' },
                  { label: 'Get Macromedia Flash', bg: 'bg-[#cc0000]', text: 'text-white' },
                  { label: 'Napster: Share MP3s', bg: 'bg-[#000044]', text: 'text-cyan-300' }
                ].map((b, i) => (
                  <button
                    key={i}
                    onClick={() => handleBadgeClick(b.label)}
                    className={`${b.bg} ${b.text} px-2 py-1 text-[9px] font-mono font-bold border border-white shadow hover:scale-105 transition-transform`}
                  >
                    [{b.label}]
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 5. Webring Footer Navigation */}
        <div className="p-2 border-2 border-dashed border-[#00ffff] bg-[#000033] text-xs inline-block max-w-lg mx-auto">
          <span className="text-[#ffff00] font-bold">This GeoCities site is an official member of the:</span>
          <div className="text-[#00ffff] font-mono font-bold mt-0.5">
            [The Silicon Valley Dot-Com WebRing #2000]
          </div>
        </div>
      </div>

      {/* 6. Floating AIM (AOL Instant Messenger) Pop-up Widget */}
      {showAim && (
        <div className="fixed bottom-4 right-4 z-50 w-72 sm:w-80 bg-[#ece9d8] border-2 border-t-[#fff] border-l-[#fff] border-r-[#000] border-b-[#000] shadow-2xl font-sans text-black">
          <div className="bg-gradient-to-r from-[#0a246a] to-[#a6caf0] text-white px-2 py-1 text-xs font-bold flex justify-between items-center">
            <span>Instant Message with CoolSk8r99</span>
            <button
              onClick={() => setShowAim(false)}
              className="bg-[#c0c0c0] text-black px-1 text-[10px] border border-t-[#fff] border-l-[#fff] border-r-[#000] border-b-[#000]"
            >
              ✕
            </button>
          </div>
          <div className="p-2 bg-white m-1 border border-[#808080] h-44 overflow-y-auto text-xs space-y-1.5 font-['Comic_Sans_MS',sans-serif]">
            {aimMessages.map((m, i) => (
              <div key={i} className={m.isMe ? 'text-blue-700' : 'text-red-700'}>
                <strong>{m.sender}:</strong> {m.text}
              </div>
            ))}
          </div>
          <form onSubmit={handleSendAim} className="p-1 flex gap-1">
            <input
              type="text"
              value={aimInput}
              onChange={(e) => setAimInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 px-1 py-0.5 border border-[#808080] text-xs font-['Comic_Sans_MS',sans-serif] focus:outline-none"
            />
            <button
              type="submit"
              className="px-2 py-0.5 bg-[#d4d0c8] border border-t-[#fff] border-l-[#fff] border-r-[#000] border-b-[#000] font-bold text-xs active:border-t-[#000] active:border-l-[#000]"
            >
              Send
            </button>
          </form>
        </div>
      )}

    </div>
  );
};