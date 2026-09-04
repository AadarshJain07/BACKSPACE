import React, { useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { EraConfig } from '../../types/era';
import { sound } from '../../utils/audio';
import { Winamp2000 } from './Winamp2000';
import { FlashPlayer2000 } from './FlashPlayer2000';

interface Props {
  era: EraConfig;
}
interface AimMessage {
  sender: string;
  text: string;
  isMe: boolean;
  time: string;
}
interface GuestbookEntry {
  id: string;
  name: string;
  location: string;
  neighborhood: string;
  sticker: string;
  message: string;
  date: string;
}
interface NapsterDownload {
  id: string;
  title: string;
  artist: string;
  size: string;
  peer: string;
  speed: string;
  progress: number;
  status: 'idle' | 'connecting' | 'downloading' | 'stalled' | 'completed';
}

const INITIAL_GUESTBOOK: GuestbookEntry[] = [
  {
    id: '1',
    name: 'Neo_TheOne_99',
    location: 'Zion, Matrix',
    neighborhood: 'Area51',
    sticker: '👽 Y2K SURVIVOR',
    message: 'Awesome page!! The starry background and Winamp player are sick. Adding your site to my CyberRing!',
    date: 'Jan 02, 2000 03:14 AM'
  },
  {
    id: '2',
    name: 'Princess_Sparkle00',
    location: 'California, USA',
    neighborhood: 'SiliconValley',
    sticker: '🔥 HOT SITE',
    message: 'Love the Comic Sans and Napster links! A/S/L anyone? Sign my guestbook back plz!! *~*~*',
    date: 'Jan 01, 2000 11:42 PM'
  },
  {
    id: '3',
    name: 'xX_Sk8rBoi_Xx',
    location: 'Ontario, Canada',
    neighborhood: 'SoHo',
    sticker: '💾 MP3 WAREZ',
    message: 'Yo dude, thanks for the Darude Sandstorm mp3! Download took only 45 minutes on my 56k USRobotics modem!',
    date: 'Dec 31, 1999 11:58 PM'
  }
];
export const Era2000: React.FC<Props> = () => {
  // Navigation & Widgets State
  const [activePage, setActivePage] = useState<'home' | 'guestbook' | 'mp3s' | 'flash' | 'webring' | 'about'>('home');
  const [showWinamp, setShowWinamp] = useState<boolean>(true);
  const [showFlash, setShowFlash] = useState<boolean>(false);
  const [neighborhood, setNeighborhood] = useState<'SiliconValley' | 'Area51' | 'SoHo' | 'Heartland'>('SiliconValley');
  const [sparkleCursor, setSparkleCursor] = useState<boolean>(true);
  const [cursorSparkles, setCursorSparkles] = useState<{ id: number; x: number; y: number; char: string; color: string }[]>([]);
  // Y2K Bug Crisis Simulator State
  const [y2kActive, setY2kActive] = useState<boolean>(false);
  const [y2kDateYear, setY2kDateYear] = useState<string>('2000');
  // Visitor Counter
  const [visitorCount, setVisitorCount] = useState<number>(() => {
    const saved = localStorage.getItem('backspace_2000_hits');
    return saved ? parseInt(saved, 10) : 13370;
  });

   // GeoCities Guestbook State
  const [guestbook, setGuestbook] = useState<GuestbookEntry[]>(() => {
    const saved = localStorage.getItem('backspace_2000_guestbook');
    return saved ? JSON.parse(saved) : INITIAL_GUESTBOOK;
  });
  const [gbName, setGbName] = useState('');
  const [gbLocation, setGbLocation] = useState('');
  const [gbNeighborhood, setGbNeighborhood] = useState('SiliconValley');
  const [gbSticker, setGbSticker] = useState('🔥 HOT SITE');
  const [gbMessage, setGbMessage] = useState('');
  // Napster P2P Downloader State
  const [downloads, setDownloads] = useState<NapsterDownload[]>([
    { id: '1', title: 'Sandstorm.mp3', artist: 'Darude', size: '3.4 MB', peer: 'xX_CyberRave_00', speed: '4.2 KB/s', progress: 100, status: 'completed' },
    { id: '2', title: 'All Star.mp3', artist: 'Smash Mouth', size: '3.1 MB', peer: 'ShrekFan2000', speed: '3.8 KB/s', progress: 65, status: 'downloading' },
    { id: '3', title: 'Blue (Da Ba Dee).mp3', artist: 'Eiffel 65', size: '3.8 MB', peer: 'EuroDanceKing', speed: '4.8 KB/s', progress: 0, status: 'idle' },
    { id: '4', title: 'One Step Closer.mp3', artist: 'Linkin Park', size: '2.9 MB', peer: 'NuMetalKid99', speed: '5.1 KB/s', progress: 0, status: 'idle' },
    { id: '5', title: 'Hampton Hamster Dance.mp3', artist: 'Hamster Band', size: '2.4 MB', peer: 'FlashGod404', speed: '3.5 KB/s', progress: 0, status: 'idle' }
  ]);
  // AIM (AOL Instant Messenger) State
  const [showAim, setShowAim] = useState<boolean>(false);
  const [aimTab, setAimTab] = useState<'buddies' | 'chat'>('chat');
  const [currentBuddy, setCurrentBuddy] = useState<string>('SmarterChild');
  const [aimInput, setAimInput] = useState<string>('');
  const [myAwayStatus, setMyAwayStatus] = useState<string>('Online');
  const [aimMessages, setAimMessages] = useState<AimMessage[]>([
    { sender: 'SmarterChild', text: 'Hi there! I am SmarterChild, your personal AIM bot. Ask me for a joke, weather, movie trivia, or Y2K info!', isMe: false, time: '12:00 PM' },
    { sender: 'CoolSk8r99', text: 'yo!! did u download that new mp3 off Napster yet??', isMe: false, time: '12:01 PM' }
  ]);

  // Webring state
  const webringSites = [
    { name: '~*~ The Matrix Cyber Shrine ~*~', url: 'http://www.geocities.com/Area51/Vault/1999/', ring: 'Sci-Fi WebRing #402' },
    { name: 'Hamster Dance Original Fanclub', url: 'http://www.geocities.com/Heartland/Acres/1337/', ring: 'Dot-Com FunRing #12' },
    { name: 'DragonBall Z GIF Galaxy', url: 'http://www.geocities.com/Tokyo/Pagoda/9000/', ring: 'Anime CyberRing #88' },
    { name: 'Napster MP3 Underground Vault', url: 'http://www.geocities.com/SiliconValley/Pinnacle/2000/', ring: 'MusicWarez Ring #64' },
    { name: 'Homestar Runner Flash Appreciation', url: 'http://www.geocities.com/SoHo/Lofts/4040/', ring: 'Flash Portal Ring #101' }
  ];
  const [currentRingIndex, setCurrentRingIndex] = useState<number>(0);
  // Sparkle Mouse Trail Handler
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!sparkleCursor) return;
    if (Math.random() > 0.4) return;

       const chars = ['✦', '★', '✧', '★', '✸', '✶'];
    const colors = ['#00ffff', '#ffff00', '#ff00ff', '#00ff41', '#ffffff'];
    const newSparkle = {
      id: Date.now() + Math.random(),
      x: e.clientX,
      y: e.clientY + window.scrollY,
      char: chars[Math.floor(Math.random() * chars.length)],
      color: colors[Math.floor(Math.random() * colors.length)]
    };
    setCursorSparkles((prev) => [...prev.slice(-15), newSparkle]);
  }, [sparkleCursor]);
  // Clean old sparkles
  useEffect(() => {
    if (cursorSparkles.length === 0) return;
    const t = setTimeout(() => {
      setCursorSparkles((prev) => prev.slice(1));
    }, 250);
    return () => clearTimeout(t);
  }, [cursorSparkles]);
  // Handle Guestbook Submission
  const handleSignGuestbook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!gbName.trim() || !gbMessage.trim()) return;

    sound.playClick('2000');
    const newEntry: GuestbookEntry = {
      id: Date.now().toString(),
      name: gbName.trim(),
      location: gbLocation.trim() || 'Cyberspace',
      neighborhood: gbNeighborhood,
      sticker: gbSticker,
      message: gbMessage.trim(),
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })
    };
    const updated = [newEntry, ...guestbook];
    setGuestbook(updated);
    localStorage.setItem('backspace_2000_guestbook', JSON.stringify(updated));
    setGbName('');
    setGbLocation('');
    setGbMessage('');
    confetti({
      particleCount: 35,
      spread: 70,
      origin: { y: 0.7 }
    });
  };
  // Handle Napster Download Action
  const startNapsterDownload = (id: string) => {
    sound.playClick('2000');
    setDownloads((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status: 'connecting', progress: 5 } : d))
    );
    let currentProgress = 5;
    const interval = setInterval(() => {
      currentProgress += Math.floor(Math.random() * 15) + 8;
      
      // Dialup Stall Event
      if (currentProgress > 45 && currentProgress < 60 && Math.random() > 0.6) {
        setDownloads((prev) =>
          prev.map((d) => (d.id === id ? { ...d, status: 'stalled', speed: '0.0 KB/s' } : d))
        );
        setTimeout(() => {
          setDownloads((prev) =>
            prev.map((d) => (d.id === id ? { ...d, status: 'downloading', speed: '4.4 KB/s' } : d))
          );
        }, 1500);
      }
      if (currentProgress >= 100) {
        clearInterval(interval);
        setDownloads((prev) =>
          prev.map((d) => (d.id === id ? { ...d, progress: 100, status: 'completed' } : d))
        );
        sound.playCelebration();
        confetti({
          particleCount: 30,
          spread: 50,
          origin: { y: 0.8 }
        });
      } else {
        setDownloads((prev) =>
          prev.map((d) =>
            d.id === id
              ? {
                  ...d,
                  progress: Math.min(99, currentProgress),
                  status: 'downloading',
                  speed: `${(3.2 + Math.random() * 2).toFixed(1)} KB/s`
                }
              : d
          )
        );
      }
    }, 450);
  };
  // Handle AIM Message with SmarterChild logic
  const handleSendAim = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aimInput.trim()) return;
    sound.playClick('2000');
    const userMsg = aimInput.trim();
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setAimMessages((prev) => [...prev, { sender: 'You (xX_CyberGod_Xx)', text: userMsg, isMe: true, time: timeStr }]);
    setAimInput('');
    setTimeout(() => {
      let botReply = '';
      const lower = userMsg.toLowerCase();
      if (currentBuddy === 'SmarterChild') {
        if (lower.includes('joke')) {
          botReply = 'Why did the computer cross the road? To get to the other website! 😂 LOL';
        } else if (lower.includes('y2k') || lower.includes('bug')) {
          botReply = 'The Y2K Bug was supposed to shut down the global power grid, but our Pentium III processors survived!';
        } else if (lower.includes('napster') || lower.includes('mp3')) {
          botReply = 'Napster has over 20 million users sharing MP3s right now! Watch out for Metallica though!';
        } else if (lower.includes('weather')) {
          botReply = 'Current forecast in Silicon Valley: 72°F, sunny with a 99% chance of dot-com startup IPOs! ☀️';
        } else if (lower.includes('asl') || lower.includes('a/s/l')) {
          botReply = 'I am an AI bot created in 2000! Age: 0 / Sex: Robot / Loc: AOL Server Room 3';
        } else if (lower.includes('hi') || lower.includes('hello') || lower.includes('hey')) {
          botReply = 'Hey there! How is your dial-up connection treating you today?';
        } else {
          const defaultResponses = [
            'That is totally cool! Tell me more!',
            'ROFL! Check out my new Winamp visualizer preset!',
            'Hold on, my 56k modem just negotiated a new handshake!',
            'brb grabbing a Surge soda from the fridge!',
            'Did you check out the Flash player yet?'
          ];
          botReply = defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
        }
      } else {
        botReply = 'brb away from keyboard eating pizza bagels!';
      }

     setAimMessages((prev) => [...prev, { sender: currentBuddy, text: botReply, isMe: false, time: timeStr }]);
      sound.playClick('2000');
    }, 1000);
  };
  // Y2K Bug Simulation Trigger
  const triggerY2kSimulation = () => {
    sound.playClick('1995');
    setY2kActive(true);
    setY2kDateYear('1900');
    sound.playModemHandshake();
  };
  const fixY2kBug = () => {
    sound.playCelebration();
    setY2kActive(false);
    setY2kDateYear('2000');
    confetti({
      particleCount: 50,
      spread: 90,
      origin: { y: 0.5 }
    });
  };
  // Theme accents by neighborhood
  const getThemeStyles = () => {
    switch (neighborhood) {
      case 'Area51':
        return {
          bg: 'bg-[#001100]',
          border: 'border-[#00ff41]',
          text: 'text-[#00ff41]',
          headerGradient: 'from-[#003300] via-[#006600] to-[#001100]',
          title: '👽 AREA 51: UFO VAULT & SCI-FI MATRIX 👽'
        };
      case 'SoHo':
        return {
          bg: 'bg-[#220022]',
          border: 'border-[#ff00ff]',
          text: 'text-[#ffff00]',
          headerGradient: 'from-[#440044] via-[#880088] to-[#220022]',
          title: '🎨 SOHO: AVANT-GARDE FLASH & DIGITAL ART 🎨'
        };
      case 'Heartland':
        return {
          bg: 'bg-[#1a0f00]',
          border: 'border-[#ffaa00]',
          text: 'text-[#ffd700]',
          headerGradient: 'from-[#4a2e00] via-[#805000] to-[#1a0f00]',
          title: '🏡 HEARTLAND: HOMETOWN HOMEPAGES & FAMILY RINGS 🏡'
        };
      default:
        return {
          bg: 'bg-[#000033]',
          border: 'border-[#00ffff]',
          text: 'text-[#00ffff]',
          headerGradient: 'from-[#0a246a] via-[#a6caf0] to-[#0a246a]',
          title: '🔥 CYBER-REALM 2000: SILICON VALLEY TECH VAULT 🔥'
        };
    }
  };
  const currentTheme = getThemeStyles();
  return (
    <div
      onMouseMove={handleMouseMove}
      className={`w-full ${currentTheme.bg} text-white font-['Comic_Sans_MS',cursive,sans-serif] p-1 sm:p-2 border-4 ${currentTheme.border} shadow-[0_0_20px_rgba(0,255,255,0.4)] select-text relative`}
    >
      {/* DHTML Sparkles overlay */}
      {cursorSparkles.map((s) => (
        <span
          key={s.id}
          className="pointer-events-none fixed z-[9999] text-xs font-mono font-black animate-ping"
          style={{ left: s.x, top: s.y, color: s.color }}
        >
          {s.char}
        </span>
      ))}
      {/* ── Y2K EMERGENCY OVERLAY (When simulated) ── */}
      {y2kActive && (
        <div className="fixed inset-0 bg-red-950/90 z-[10000] flex flex-col items-center justify-center p-4 text-center font-mono">
          <div className="max-w-md bg-[#c0c0c0] text-black border-4 border-t-white border-l-white border-r-black border-b-black p-4 shadow-2xl">
            <div className="bg-[#800000] text-white font-bold px-2 py-1 flex items-center justify-between text-xs mb-3">
              <span>⚠️ CRITICAL SYSTEM ERROR - 01/01/{y2kDateYear}</span>
              <span className="animate-ping">🚨</span>
            </div>
            <div className="text-left text-xs space-y-2 mb-4">
              <p className="font-bold text-red-700">YEAR 2000 TWO-DIGIT OVERFLOW DETECTED!</p>
              <p>System clock rolled over to January 1, 1900. Financial mainframes and dial-up routers have lost synchronization!</p>
              <div className="bg-black text-[#00ff41] p-2 border border-red-500 text-[11px]">
                <code>
                  SYSTEM_DATE: 1900-01-01 00:00:01<br />
                  CPU_STATUS: PENTIUM III CLOCK DESYNC<br />
                  ACTIVE_X: MALFUNCTIONING
                </code>
              </div>
            </div>
            <button
              onClick={fixY2kBug}
              className="w-full py-2 bg-[#00ff41] hover:bg-white text-black font-black text-sm border-2 border-black uppercase shadow animate-bounce"
            >
              🛡️ DEPLOY Y2K HOTFIX PATCH & RESTORE SYSTEM
            </button>
          </div>
        </div>
      )}
      {/* 1. Microsoft Internet Explorer 5.5 Title Bar */}
      <div className={`bg-gradient-to-r ${currentTheme.headerGradient} text-white px-2 py-1 mb-1 flex items-center justify-between font-sans text-xs font-bold select-none border ${currentTheme.border}`}>
        <div className="flex items-center gap-1.5 truncate">
          <span className="text-yellow-300">🌐</span>
          <span className="truncate">
            Microsoft Internet Explorer - [{currentTheme.title} - Geocities.com/{neighborhood}/4096]
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
              alert('Y2K Safe Mode Active! Internet Explorer cannot be closed.');
            }}
            className="w-4 h-4 bg-[#c0c0c0] text-black text-[10px] font-bold border border-t-[#fff] border-l-[#fff] border-r-[#000] border-b-[#000]"
          >
            ✕
          </button>
        </div>
      </div>
      {/* 2. IE 5.5 Toolbar */}
      <div className="bg-[#d4d0c8] text-black p-1 border-b-2 border-[#808080] mb-2 flex flex-wrap items-center justify-between gap-1 font-sans text-xs">
        <div className="flex items-center gap-1 overflow-x-auto py-0.5">
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
              setShowWinamp(!showWinamp);
            }}
            className={`px-2 py-1 border border-t-[#fff] border-l-[#fff] border-r-[#000] border-b-[#000] flex items-center gap-1 text-[11px] font-bold ${
              showWinamp ? 'bg-[#00ff41] text-black' : 'bg-[#ece9d8] text-black hover:bg-white'
            }`}
          >
            <span>⚡</span> <span>Winamp 2.91 {showWinamp ? '(ON)' : '(OFF)'}</span>
          </button>
          <button
            onClick={() => {
              sound.playClick('2000');
              setShowFlash(!showFlash);
            }}
            className={`px-2 py-1 border border-t-[#fff] border-l-[#fff] border-r-[#000] border-b-[#000] flex items-center gap-1 text-[11px] font-bold ${
              showFlash ? 'bg-[#cc0000] text-white' : 'bg-[#ece9d8] text-black hover:bg-white'
            }`}
          >
            <span>🕹️</span> <span>Flash 4.0 {showFlash ? '(OPEN)' : '(OFF)'}</span>
          </button>
          <button
            onClick={() => setShowAim(!showAim)}
            className="px-2 py-1 bg-[#ffff00] text-black border border-t-[#fff] border-l-[#fff] border-r-[#000] border-b-[#000] hover:bg-yellow-300 flex items-center gap-1 text-[11px] font-bold"
          >
            <span>💬</span> <span>AIM Messenger</span>
          </button>
          <button
            onClick={triggerY2kSimulation}
            className="px-2 py-1 bg-red-600 hover:bg-red-500 text-white border border-t-[#fff] border-l-[#fff] border-r-[#000] border-b-[#000] flex items-center gap-1 text-[11px] font-bold"
            title="Simulate Year 2000 Clock Bug"
          >
            <span>⚠️</span> <span>Test Y2K Bug</span>
          </button>
          <button
            onClick={() => setSparkleCursor(!sparkleCursor)}
            className="px-2 py-1 bg-[#ff00ff] text-white border border-t-[#fff] border-l-[#fff] border-r-[#000] border-b-[#000] flex items-center gap-1 text-[11px] font-bold"
          >
            <span>✨</span> <span>Sparkles: {sparkleCursor ? 'ON' : 'OFF'}</span>
          </button>
        </div>
        {/* Neighborhood Selector */}
        <div className="flex items-center gap-1 text-[11px] font-mono">
          <span className="font-bold text-[#000080]">GeoNeighborhood:</span>
          <select
            value={neighborhood}
            onChange={(e) => {
              sound.playClick('2000');
              setNeighborhood(e.target.value as any);
            }}
            className="bg-white px-1 py-0.5 border border-[#808080] text-black font-semibold text-xs cursor-pointer"
          >
            <option value="SiliconValley">SiliconValley (Tech/Cyber)</option>
            <option value="Area51">Area51 (Sci-Fi/Aliens)</option>
            <option value="SoHo">SoHo (Flash & Art)</option>
            <option value="Heartland">Heartland (Classic Web)</option>
          </select>
        </div>
      </div>
      {/* 3. Address Bar */}
      <div className="bg-[#ece9d8] text-black p-1 border-2 border-t-[#808080] border-l-[#808080] border-r-[#fff] border-b-[#fff] mb-3 flex items-center gap-2 font-mono text-xs">
        <span className="font-sans font-bold text-[#000080]">Address:</span>
        <span className="bg-white px-2 py-0.5 border border-[#808080] flex-1 truncate text-[#000080]">
          http://www.geocities.com/{neighborhood}/Pinnacle/4096/{activePage}.html
        </span>
      </div>
      {/* 4. GeoCities Main Content Container */}
      <div className="bg-[#050522] border-4 border-double border-[#ff00ff] p-3 sm:p-5 text-center relative overflow-hidden">
        
        {/* Flashing Welcome Banner */}
        <div className="mb-4">
          <div className="text-2xl sm:text-4xl font-black tracking-wider text-[#00ffff] drop-shadow-[0_0_8px_#00ffff] animate-pulse">
            {currentTheme.title}
          </div>
          <div className="text-xs font-mono text-[#ffff00] mt-1">
            ~*~ System Date: 01/01/{y2kDateYear} • Optimized for Netscape 4.7 & IE 5.5 in 1024x768 ~*~
          </div>
        </div>
        {/* Winamp Player Embed */}
        {showWinamp && (
          <div className="mb-6">
            <Winamp2000 onClose={() => setShowWinamp(false)} />
          </div>
        )}
        {/* Macromedia Flash 4.0 Embed */}
        {showFlash && (
          <div className="mb-6">
            <FlashPlayer2000 onClose={() => setShowFlash(false)} />
          </div>
        )}
        {/* 3-Column Interactive Cyber Portal */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-left mb-6">
          
          {/* Left Column: Cyber Navigation & Odometer */}
          <div className="bg-[#000033] border-2 border-[#00ffff] p-3 space-y-3">
            <h3 className="text-center font-bold text-[#ffff00] border-b border-[#00ffff] pb-1 text-sm">
              ⚡ CYBER NAVIGATOR ⚡
            </h3>
            <ul className="space-y-1 text-xs">
              {[
                { id: 'home', label: '🚀 Home Base' },
                { id: 'guestbook', label: `📖 Cyber Guestbook (${guestbook.length})` },
                { id: 'mp3s', label: '💾 Napster 56k P2P' },
                { id: 'flash', label: '🕹️ Flash 4.0 Arcade' },
                { id: 'webring', label: '🪐 Webring Hub' }
              ].map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => {
                      sound.playClick('2000');
                      if (item.id === 'flash') {
                        setShowFlash(true);
                      }
                      setActivePage(item.id as any);
                    }}
                    className={`w-full text-left px-2 py-1 border ${
                      activePage === item.id
                        ? 'bg-[#ff00ff] text-white font-bold'
                        : 'bg-[#111144] text-[#00ffff]'
                    } hover:bg-[#ff00ff] hover:text-white transition-colors`}
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
            {/* Odometer Hit Counter */}
            <div className="pt-2 border-t border-[#00ffff] text-center">
              <div className="text-[10px] text-[#ffff00] font-mono mb-1">YOU ARE CYBER VISITOR:</div>
              <div
                onClick={() => {
                  sound.playClick('2000');
                  const next = visitorCount + 1;
                  setVisitorCount(next);
                  localStorage.setItem('backspace_2000_hits', next.toString());
                }}
                className="inline-block bg-black text-[#00ff00] font-mono font-bold text-xl px-3 py-1 border-2 border-red-500 shadow-[0_0_8px_#00ff00] cursor-pointer"
                title="Click to bump hit counter!"
              >
                {String(visitorCount).padStart(6, '0')}
              </div>
            </div>

  <div className="bg-yellow-400 text-black font-bold p-1 text-center text-xs tracking-wider border-2 border-black animate-bounce">
              ⚠️ BEST VIEWED IN 1024x768 ⚠️
            </div>
          </div>
          {/* Center/Right Dynamic Body (3 columns span) */}
          <div className="md:col-span-3 bg-[#000033] border-2 border-[#ff00ff] p-4 text-xs space-y-4">
            
            {/* 1. HOME TAB */}
            {activePage === 'home' && (
              <div>
                <h2 className="text-lg font-bold text-[#00ffff] border-b border-[#ff00ff] pb-1 mb-2">
                  💫 Welcome to the Dot-Com Cyber Base!
                </h2>
                <p className="leading-relaxed mb-3 text-slate-200">
                  Welcome to my personal home page hosted on <strong>GeoCities ({neighborhood})</strong>! 
                  Here you can download underground MP3s over 56k dial-up on Napster, play Macromedia Flash animations, 
                  listen to synthesized MIDI in Winamp, chat with SmarterChild on AIM, or sign the Cyber Guestbook!
                </p>
                {/* Y2K Status Card */}
                <div className="p-3 bg-[#111144] border border-[#00ffff] rounded mb-3 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-[#ffff00]">Y2K STATUS REPORT:</span>
                    <p className="text-[11px] text-gray-300 mt-0.5">
                      Power grid intact! Pentium III 800MHz processor operating with zero desync. 🥂
                    </p>
                  </div>
                  <button
                    onClick={triggerY2kSimulation}
                    className="px-2.5 py-1 bg-red-600 hover:bg-red-500 text-white font-bold text-xs border border-white"
                  >
                    Test Glitch
                  </button>
                </div>
                {/* Quick Action Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-center pt-2">
                  <div
                    onClick={() => { sound.playClick('2000'); setActivePage('mp3s'); }}
                    className="bg-[#050522] border border-[#00ffff] p-3 cursor-pointer hover:bg-[#111144]"
                  >
                    <div className="text-2xl mb-1">💾</div>
                    <div className="font-bold text-[#ffff00]">Napster 56k Vault</div>
                    <div className="text-[10px] text-gray-400 mt-1">Download & queue into Winamp</div>
                  </div>
                  <div
                    onClick={() => { sound.playClick('2000'); setShowFlash(true); setActivePage('flash'); }}
                    className="bg-[#050522] border border-[#ff00ff] p-3 cursor-pointer hover:bg-[#111144]"
                  >
                    <div className="text-2xl mb-1">🕹️</div>
                    <div className="font-bold text-[#00ff41]">Macromedia Flash 4</div>
                    <div className="text-[10px] text-gray-400 mt-1">Play Breakout 2000 & Hamster Dance</div>

                  </div>
                  <div
                    onClick={() => { sound.playClick('2000'); setShowAim(true); }}
                    className="bg-[#050522] border border-[#ffff00] p-3 cursor-pointer hover:bg-[#111144]"
                  >
                    <div className="text-2xl mb-1">💬</div>
                    <div className="font-bold text-[#00ffff]">AIM SmarterChild</div>
                    <div className="text-[10px] text-gray-400 mt-1">Chat with vintage AI bot</div>
                  </div>
                </div>
              </div>
            )}
            {/* 2. GUESTBOOK TAB */}
            {activePage === 'guestbook' && (
              <div>
                <h2 className="text-lg font-bold text-[#00ffff] border-b border-[#ff00ff] pb-1 mb-2">
                  📖 GeoCities Cyber Guestbook ({guestbook.length} Entries)
                </h2>
                {/* Sign Guestbook Form */}
                <form onSubmit={handleSignGuestbook} className="bg-[#111144] p-3 border-2 border-[#00ffff] mb-4 space-y-2">
                  <div className="font-bold text-[#ffff00] text-xs">★ SIGN THE CYBER GUESTBOOK ★</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Your Cyber Handle / Name *"
                      value={gbName}
                      onChange={(e) => setGbName(e.target.value)}
                      required
                      className="px-2 py-1 bg-black text-[#00ff41] border border-[#00ffff] text-xs font-mono"
                    />
                    <input
                      type="text"
                      placeholder="Location / Planet (e.g. Area51, Earth)"
                      value={gbLocation}
                      onChange={(e) => setGbLocation(e.target.value)}
                      className="px-2 py-1 bg-black text-[#00ff41] border border-[#00ffff] text-xs font-mono"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <select
                      value={gbNeighborhood}
                      onChange={(e) => setGbNeighborhood(e.target.value)}
                      className="px-2 py-1 bg-black text-[#ffff00] border border-[#00ffff] text-xs font-mono"
                    >
                      <option value="SiliconValley">Neighborhood: SiliconValley</option>
                      <option value="Area51">Neighborhood: Area51</option>
                      <option value="SoHo">Neighborhood: SoHo</option>
                      <option value="Heartland">Neighborhood: Heartland</option>
                    </select>
                    <select
                      value={gbSticker}
                      onChange={(e) => setGbSticker(e.target.value)}
                      className="px-2 py-1 bg-black text-[#ff00ff] border border-[#00ffff] text-xs font-mono font-bold"
                    >
                      <option value="🔥 HOT SITE">Sticker: 🔥 HOT SITE</option>
                      <option value="⚠️ UNDER CONSTRUCTION">Sticker: ⚠️ UNDER CONSTRUCTION</option>
                      <option value="👽 Y2K SURVIVOR">Sticker: 👽 Y2K SURVIVOR</option>
                      <option value="💾 MP3 WAREZ">Sticker: 💾 MP3 WAREZ</option>
                      <option value="★ TOP SITE">Sticker: ★ TOP SITE</option>
                    </select>
                  </div>
                  <textarea
                    rows={2}
                    placeholder="Leave your retro message for the webmaster..."
                    value={gbMessage}
                    onChange={(e) => setGbMessage(e.target.value)}
                    required
                    className="w-full px-2 py-1 bg-black text-[#00ff41] border border-[#00ffff] text-xs font-mono"
                  />
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="px-4 py-1.5 bg-[#00ff41] text-black font-bold text-xs border border-white hover:bg-white"
                    >
                      ✍️ Submit to Guestbook
                    </button>
                  </div>
                </form>
                {/* List of Entries */}
                <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                  {guestbook.map((entry) => (
                    <div key={entry.id} className="bg-[#050522] border border-[#ff00ff] p-3 text-xs space-y-1">
                      <div className="flex flex-wrap items-center justify-between gap-1 border-b border-[#ff00ff]/40 pb-1">
                        <span className="font-bold text-[#00ffff]">
                          👤 {entry.name} <span className="text-gray-400 font-normal">from [{entry.location}]</span>
                        </span>
                        <span className="px-1.5 py-0.5 bg-[#ff00ff] text-white text-[10px] font-bold">
                          {entry.sticker}
                        </span>
                      </div>
                      <p className="text-slate-200 leading-relaxed font-sans">{entry.message}</p>
                      <div className="text-[10px] text-yellow-300 font-mono flex justify-between">
                        <span>Neighborhood: {entry.neighborhood}</span>
                        <span>{entry.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {/* 3. NAPSTER 56K P2P TAB */}
            {activePage === 'mp3s' && (
              <div>
                <h2 className="text-lg font-bold text-[#00ffff] border-b border-[#ff00ff] pb-1 mb-2">
                  💾 Napster v2.0 Underground MP3 P2P Vault (128 kbps)
                </h2>
                <div className="bg-[#111144] p-2 border border-[#00ffff] mb-3 text-[11px] flex justify-between items-center">
                  <span>Connected to Napster Network: <strong>1,492,021 Users</strong> (14.2 Terabytes)</span>
                  <span className="text-[#00ff41] font-mono font-bold">● ONLINE @ 56.6 kbps</span>
                </div>
                <div className="space-y-2">
                  {downloads.map((mp3) => (
                    <div key={mp3.id} className="bg-[#050522] p-3 border border-[#ff00ff] space-y-1.5">
                      <div className="flex flex-wrap items-center justify-between gap-1">
                        <div>
                          <span className="font-bold text-[#ffff00] text-sm">🎵 {mp3.artist} - {mp3.title}</span>
                          <div className="text-[10px] text-gray-400 font-mono">
                            Size: {mp3.size} • Peer: {mp3.peer} • Speed: {mp3.speed}
                          </div>
                        </div>
                        <div className="flex gap-1.5">
                          {mp3.status === 'completed' ? (
                            <button
                              onClick={() => {
                                sound.playCelebration();
                                setShowWinamp(true);
                              }}
                              className="px-2.5 py-1 bg-[#00ff41] text-black font-bold text-xs border border-white hover:bg-white"
                            >
                              ▶ Play in Winamp
                            </button>
                          ) : mp3.status === 'downloading' ? (
                            <span className="px-2.5 py-1 bg-[#000080] text-[#00ffff] font-mono font-bold text-xs border border-[#00ffff] animate-pulse">
                              ⏳ DL {mp3.progress}%
                            </span>
                          ) : mp3.status === 'stalled' ? (
                            <span className="px-2.5 py-1 bg-red-600 text-white font-mono font-bold text-xs border border-white animate-bounce">
                              ⚠️ Dial-up Stall
                            </span>
                          ) : (
                            <button
                              onClick={() => startNapsterDownload(mp3.id)}
                              className="px-2.5 py-1 bg-[#00ffff] text-black font-bold text-xs border border-white hover:bg-[#ffff00]"
                            >
                              ⬇️ Download (56k)
                            </button>
                          )}
                        </div>
                      </div>
                      {/* Download Progress Bar */}
                      {(mp3.status === 'downloading' || mp3.status === 'stalled' || mp3.status === 'completed') && (
                        <div className="w-full bg-black border border-gray-600 h-3 overflow-hidden p-[1px]">
                          <div
                            className={`h-full transition-all duration-300 ${
                              mp3.status === 'completed'
                                ? 'bg-[#00ff41]'
                                : mp3.status === 'stalled'
                                ? 'bg-red-500'
                                : 'bg-[#00ffff]'
                            }`}
                            style={{ width: `${mp3.progress}%` }}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
            {/* 4. FLASH ARCADE TAB */}
            {activePage === 'flash' && (
              <div>
                <h2 className="text-lg font-bold text-[#00ffff] border-b border-[#ff00ff] pb-1 mb-2">
                  🕹️ Macromedia Flash 4.0 Cyber Arcade
                </h2>
                <p className="text-slate-300 mb-3">
                  Click below to open or expand the interactive Flash 4.0 player window:
                </p>
                {!showFlash && (
                  <button
                    onClick={() => {
                      sound.playClick('2000');
                      setShowFlash(true);
                    }}
                    className="px-4 py-2 bg-[#cc0000] text-white font-mono font-bold text-xs border-2 border-white hover:bg-red-700"
                  >
                    ▶ Launch Macromedia Flash Player 4.0
                  </button>
                )}
              </div>
            )}
            {/* 5. WEBRING TAB */}
            {activePage === 'webring' && (
              <div>
                <h2 className="text-lg font-bold text-[#00ffff] border-b border-[#ff00ff] pb-1 mb-2">
                  🪐 Interactive 2000 Webring Explorer
                </h2>
                <div className="bg-[#111144] p-4 border-2 border-[#00ffff] text-center mb-3">
                  <div className="text-[#ffff00] font-bold text-sm mb-1">
                    {webringSites[currentRingIndex].ring}
                  </div>
                  <div className="text-white text-base font-bold mb-2 font-mono">
                    "{webringSites[currentRingIndex].name}"
                  </div>
                  <div className="text-[11px] text-cyan-300 font-mono mb-4">
                    {webringSites[currentRingIndex].url}
                  </div>
                  <div className="flex flex-wrap gap-2 justify-center font-sans text-xs">
                    <button
                      onClick={() => {
                        sound.playClick('2000');
                        setCurrentRingIndex((prev) => (prev > 0 ? prev - 1 : webringSites.length - 1));
                      }}
                      className="px-3 py-1 bg-[#ff00ff] text-white font-bold border border-white"
                    >
                      [ &lt;&lt; Prev Site ]
                    </button>
                    <button
                      onClick={() => {
                        sound.playClick('2000');
                        setCurrentRingIndex(Math.floor(Math.random() * webringSites.length));
                      }}
                      className="px-3 py-1 bg-[#ffff00] text-black font-bold border border-black"
                    >
                      [ 🎲 Random Site ]
                    </button>
                    <button
                      onClick={() => {
                        sound.playClick('2000');
                        setCurrentRingIndex((prev) => (prev + 1) % webringSites.length);
                      }}
                      className="px-3 py-1 bg-[#00ffff] text-black font-bold border border-black"
                    >
                      [ Next Site &gt;&gt; ]
                    </button>
                  </div>
                </div>
              </div>
            )}
            {/* 88x31 Button Badges */}
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
                    onClick={() => {
                      sound.playClick('2000');
                      confetti({ particleCount: 20, spread: 50, origin: { y: 0.8 } });
                      alert(`★ 88x31 Badge: "${b.label}" added to your retro cache!`);
                    }}
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
          <span className="text-[#ffff00] font-bold">This GeoCities site is an official member of:</span>
          <div className="text-[#00ffff] font-mono font-bold mt-0.5">
            [The Silicon Valley Dot-Com WebRing #{neighborhood === 'Area51' ? '402' : '2000'}]
          </div>
        </div>
      </div>
      {/* 6. Floating AIM (AOL Instant Messenger) Pop-up Widget */}
      {showAim && (
        <div className="fixed bottom-4 right-4 z-50 w-72 sm:w-84 bg-[#ece9d8] border-2 border-t-[#fff] border-l-[#fff] border-r-[#000] border-b-[#000] shadow-2xl font-sans text-black">
          {/* AIM Header */}
          <div className="bg-gradient-to-r from-[#0a246a] to-[#a6caf0] text-white px-2 py-1 text-xs font-bold flex justify-between items-center">
            <div className="flex items-center gap-1.5">
              <span>💬</span>
              <span>AIM - {aimTab === 'buddies' ? 'Buddy List' : `Chat w/ ${currentBuddy}`}</span>
            </div>
            <div className="flex gap-1">
              <button
                onClick={() => setAimTab(aimTab === 'chat' ? 'buddies' : 'chat')}
                className="bg-[#c0c0c0] text-black px-1.5 text-[10px] border border-t-[#fff] border-l-[#fff] border-r-[#000] border-b-[#000] font-bold"
              >
                {aimTab === 'chat' ? 'Buddies' : 'Chat'}
              </button>
              <button
                onClick={() => setShowAim(false)}
                className="bg-[#c0c0c0] text-black px-1 text-[10px] border border-t-[#fff] border-l-[#fff] border-r-[#000] border-b-[#000]"
              >
                ✕
              </button>
            </div>
          </div>
          {/* AIM Body */}
          {aimTab === 'buddies' ? (
            <div className="p-2 text-xs">
              <div className="bg-white border border-[#808080] p-2 space-y-2 h-52 overflow-y-auto font-mono text-[11px]">
                <div className="font-bold text-[#000080] border-b pb-0.5">Buddies (3/4 Online)</div>
                {[
                  { name: 'SmarterChild', status: 'Online (AI Bot)', color: 'text-green-700' },
                  { name: 'CoolSk8r99', status: 'Away: at skate park', color: 'text-orange-700' },
                  { name: 'MatrixFan00', status: 'Online: There is no spoon', color: 'text-green-700' },
                  { name: 'xX_DarkAngel_Xx', status: 'Idle: listening to Hybrid Theory', color: 'text-gray-500' }
                ].map((b) => (
                  <div
                    key={b.name}
                    onClick={() => {
                      sound.playClick('2000');
                      setCurrentBuddy(b.name);
                      setAimTab('chat');
                    }}
                    className="p-1 hover:bg-[#000080] hover:text-white cursor-pointer flex justify-between items-center"
                  >
                    <span className="font-bold">👤 {b.name}</span>
                    <span className={`text-[10px] ${b.color}`}>{b.status}</span>
                  </div>
                ))}
              </div>
              <div className="mt-2 flex items-center justify-between text-[11px]">
                <span>My Status:</span>
                <select
                  value={myAwayStatus}
                  onChange={(e) => setMyAwayStatus(e.target.value)}
                  className="bg-white border px-1 py-0.5 text-xs"
                >
                  <option value="Online">Online</option>
                  <option value="Away: Lunch">Away: Lunch</option>
                  <option value="Away: Homework">Away: Homework</option>
                </select>
              </div>
            </div>
          ) : (
            <>
              <div className="p-2 bg-white m-1 border border-[#808080] h-48 overflow-y-auto text-xs space-y-1.5 font-['Comic_Sans_MS',sans-serif]">
                {aimMessages.map((m, i) => (
                  <div key={i} className={m.isMe ? 'text-blue-700' : 'text-red-700'}>
                    <strong>{m.sender}:</strong> {m.text}
                    <span className="text-[9px] text-gray-400 ml-1">[{m.time}]</span>
                  </div>
                ))}
              </div>
              <form onSubmit={handleSendAim} className="p-1 flex gap-1">
                <input
                  type="text"
                  value={aimInput}
                  onChange={(e) => setAimInput(e.target.value)}
                  placeholder={`Message ${currentBuddy}...`}
                  className="flex-1 px-1.5 py-0.5 border border-[#808080] text-xs font-['Comic_Sans_MS',sans-serif] focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-2.5 py-0.5 bg-[#d4d0c8] border border-t-[#fff] border-l-[#fff] border-r-[#000] border-b-[#000] font-bold text-xs active:border-t-[#000] active:border-l-[#000]"
                >
                  Send
                </button>
              </form>
            </>
          )}
        </div>
      )}
    </div>
  );
};
