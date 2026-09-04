import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { EraConfig } from '../../types/era';
import { sound } from '../../utils/audio';

interface Props {
  era: EraConfig;
}

interface GuestbookEntry {
  name: string;
  comment: string;
  date: string;
}

export const Era1995: React.FC<Props> = () => {
  // Visitor counter state
  const [hits, setHits] = useState<number>(() => {
    const saved = localStorage.getItem('backspace_1995_hits');
    return saved ? parseInt(saved, 10) : 4289;
  });

  // Navigation and active content state
  const [activeCategory, setActiveCategory] = useState<string>('Computers');
  const [currentUrl, setCurrentUrl] = useState<string>('http://www.cern.ch/hypertext/WWW/TheProject.html');
  const [urlInput, setUrlInput] = useState<string>('http://www.cern.ch/hypertext/WWW/TheProject.html');
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  
  // Modals & Easter Eggs
  const [showAboutModal, setShowAboutModal] = useState<boolean>(false);
  const [showSourceModal, setShowSourceModal] = useState<boolean>(false);
  const [showPrintModal, setShowPrintModal] = useState<boolean>(false);
  const [eggTriggered, setEggTriggered] = useState<boolean>(false);

  // Search state (1995 Lycos / WebCrawler simulation)
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modem Dialing Handshake sequence state
  const [modemStatus, setModemStatus] = useState<string | null>(null);

  // Page loading simulation state
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadProgress, setLoadProgress] = useState<number>(100);

  // Guestbook with LocalStorage persistence
  const [guestName, setGuestName] = useState<string>('');
  const [guestComment, setGuestComment] = useState<string>('');
  const [guestbook, setGuestbook] = useState<GuestbookEntry[]>(() => {
    const saved = localStorage.getItem('backspace_1995_guestbook');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // Fallback to default entries
      }
    }
    return [
      { name: 'WebSurfer95', comment: 'Cool site!! Surfing this from my university Sun Sparc station!', date: 'Oct 12, 1995' },
      { name: 'Dr_Mosaic', comment: 'Excellent hypertext collection. Added to my NCSA hotlist.', date: 'Nov 03, 1995' },
      { name: 'CyberKnight', comment: 'Anyone have the FTP mirror for Linux kernel 1.2.8?', date: 'Nov 24, 1995' },
      { name: 'PixelArtist', comment: 'Love the animated under-construction GIF!', date: 'Dec 01, 1995' }
    ];
  });

  const searchInputRef = useRef<HTMLInputElement>(null);

  // Categories and historical 1995 websites
  const categories: Record<string, { title: string; links: { name: string; url: string; desc: string }[] }> = {
    Computers: {
      title: 'Computers & Internet',
      links: [
        { name: 'World Wide Web Consortium (W3C)', url: 'http://www.w3.org/', desc: 'Standards, specifications, and architecture for hypertext systems.' },
        { name: 'NCSA Mosaic Home Page', url: 'http://www.ncsa.uiuc.edu/SDG/Software/Mosaic/', desc: 'The revolutionary graphical browser developed by Marc Andreessen at UIUC.' },
        { name: 'Yahoo! Internet Guide', url: 'http://www.yahoo.com/', desc: "Jerry Yang & David Filo's hand-curated directory of the World Wide Web." },
        { name: 'comp.infosystems.www FAQ', url: 'news:comp.infosystems.www.users', desc: 'Usenet newsgroup archive answering common HTML and modem questions.' },
        { name: 'Sun Microsystems Java Announcement', url: 'http://java.sun.com/', desc: 'Write once, run anywhere! Interactive applets running directly in Netscape.' }
      ]
    },
    Arts: {
      title: 'Arts & Humanities',
      links: [
        { name: 'WebMuseum Paris (Le WebLouvre)', url: 'http://sunsite.unc.edu/wm/', desc: "Nicolas Pioch’s famous online art exhibition, featuring high-res 256-color GIF paintings." },
        { name: 'ASCII Art Archives', url: 'http://www.ascii-art.com/', desc: 'Thousands of plain-text pictures rendered using standard monospaced characters.' },
        { name: 'Electronic Poetry Center', url: 'http://wings.buffalo.edu/epc/', desc: 'Experimental hypertext literature and digital verse distributed via HTTP.' },
        { name: 'Project Gutenberg', url: 'http://promo.net/pg/', desc: 'Free public domain electronic books transcribed into standard 7-bit ASCII text.' }
      ]
    },
    Science: {
      title: 'Science & Space',
      links: [
        { name: 'CERN European Particle Physics Laboratory', url: 'http://www.cern.ch/', desc: 'The birthplace of the World Wide Web created by Tim Berners-Lee in 1989.' },
        { name: 'NASA Jet Propulsion Laboratory', url: 'http://www.jpl.nasa.gov/', desc: 'Latest orbital imagery and updates from the Galileo Jupiter atmospheric probe.' },
        { name: 'Hubble Space Telescope Public Pictures', url: 'http://www.stsci.edu/pubinfo/Pictures.html', desc: 'Direct downloads of raw astronomical GIF photos from low Earth orbit.' },
        { name: 'LANL Physics E-Print Archive (arXiv)', url: 'http://xxx.lanl.gov/', desc: 'Pre-print research papers shared globally amongst theoretical physicists.' }
      ]
    },
    Entertainment: {
      title: 'Entertainment & Games',
      links: [
        { name: 'Doom II / id Software Shareware FTP', url: 'ftp://ftp.idsoftware.com/idstuff/doom/', desc: 'Download shareware PKZIP archives and deathmatch WADs over FTP.' },
        { name: 'The Internet Movie Database (IMDb)', url: 'http://www.imdb.com/', desc: 'Crowdsourced hyperlinked encyclopedia of motion pictures, actors, and directors.' },
        { name: 'The Dilbert Zone', url: 'http://www.unitedmedia.com/comics/dilbert/', desc: 'Scott Adams’ daily comic strips delivered fresh to your browser every morning.' },
        { name: 'Rolling Stones Voodoo Lounge Tour', url: 'http://www.stones.com/', desc: 'First major rock band with a dedicated World Wide Web promotional homepage.' }
      ]
    }
  };

  // Persist hits
  const handleHitClick = () => {
    sound.playClick('1995');
    const newHits = hits + 1;
    setHits(newHits);
    localStorage.setItem('backspace_1995_hits', newHits.toString());
  };

  // Sign Guestbook
  const handleSignGuestbook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim()) return;
    sound.playClick('1995');
    const newEntry: GuestbookEntry = {
      name: guestName.trim(),
      comment: guestComment.trim() || 'Greetings from cyberspace!',
      date: 'Sep 1995'
    };
    const updated = [newEntry, ...guestbook];
    setGuestbook(updated);
    localStorage.setItem('backspace_1995_guestbook', JSON.stringify(updated));
    setGuestName('');
    setGuestComment('');
  };

  // 56k Dial-Up Sequence
  const playModem = () => {
    if (modemStatus) return;
    sound.playModemHandshake();
    setModemStatus('Dialing ISP via 14.4k modem...');
    setTimeout(() => {
      setModemStatus('Negotiating V.34 modem handshake (screech & carrier detect)...');
    }, 900);
    setTimeout(() => {
      setModemStatus('Carrier detected! Connected at 14,400 bps. IP: 198.137.240.91');
    }, 1900);
    setTimeout(() => {
      setModemStatus(null);
    }, 3200);
  };

  // Simulate Page Reload
  const simulateReload = () => {
    sound.playClick('1995');
    setIsLoading(true);
    setLoadProgress(15);
    const step1 = setTimeout(() => setLoadProgress(55), 300);
    const step2 = setTimeout(() => setLoadProgress(85), 600);
    const step3 = setTimeout(() => {
      setLoadProgress(100);
      setIsLoading(false);
    }, 900);
    return () => {
      clearTimeout(step1);
      clearTimeout(step2);
      clearTimeout(step3);
    };
  };

  // Easter Egg Netscape Logo
  const triggerNetscapeEasterEgg = () => {
    sound.playCelebration();
    setEggTriggered(prev => !prev);
    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.3 }
    });
    setShowAboutModal(true);
  };

  // Navigation handlers
  const handleNavigate = (url: string, category?: string) => {
    sound.playClick('1995');
    setCurrentUrl(url);
    setUrlInput(url);
    if (category) {
      setActiveCategory(category);
    }
    simulateReload();
  };

  // Focus Search
  const handleFindClick = () => {
    sound.playClick('1995');
    if (searchInputRef.current) {
      searchInputRef.current.focus();
      searchInputRef.current.select();
    }
  };

  // Filtered links based on search
  const allLinks = Object.entries(categories).flatMap(([catName, catData]) =>
    catData.links.map(l => ({ ...l, category: catName }))
  );
  const searchResults = searchQuery.trim()
    ? allLinks.filter(
        item =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : null;

  // Close menus on outer click
  useEffect(() => {
    const handleClickOutside = () => setActiveMenu(null);
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <div className="w-full bg-[#c0c0c0] text-black font-serif text-[15px] leading-relaxed p-1 sm:p-2 border-4 border-t-[#ffffff] border-l-[#ffffff] border-r-[#404040] border-b-[#404040] shadow-2xl select-text">
      
      {/* 1. Classic Windows 95 Window Chrome Title Bar */}
      <div className="bg-gradient-to-r from-[#000080] via-[#1084d0] to-[#000080] text-white px-2 py-1 mb-1 flex items-center justify-between font-sans text-xs font-bold select-none border border-black">
        <div className="flex items-center gap-1.5 truncate">
          <span className="text-amber-300 font-mono text-sm">🌐</span>
          <span className="truncate">Netscape Navigator - [Welcome to The World-Wide Web Consortium (1995)]</span>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => sound.playClick('1995')}
            title="Minimize"
            className="w-4 h-4 bg-[#c0c0c0] text-black text-[10px] font-bold border border-t-[#fff] border-l-[#fff] border-r-[#000] border-b-[#000] flex items-center justify-center active:border-t-[#000] active:border-l-[#000]"
          >
            _
          </button>
          <button
            onClick={() => sound.playClick('1995')}
            title="Maximize"
            className="w-4 h-4 bg-[#c0c0c0] text-black text-[10px] font-bold border border-t-[#fff] border-l-[#fff] border-r-[#000] border-b-[#000] flex items-center justify-center active:border-t-[#000] active:border-l-[#000]"
          >
            □
          </button>
          <button
            onClick={() => {
              sound.playClick('1995');
              alert('Netscape Navigator 1.2 cannot be closed while exploring cyberspace!');
            }}
            title="Close"
            className="w-4 h-4 bg-[#c0c0c0] text-black text-[10px] font-bold border border-t-[#fff] border-l-[#fff] border-r-[#000] border-b-[#000] flex items-center justify-center active:border-t-[#000] active:border-l-[#000]"
          >
            ✕
          </button>
        </div>
      </div>

      {/* 2. Menu Bar with Functional Dropdowns */}
      <div
        className="relative bg-[#c0c0c0] border-b-2 border-[#808080] pb-1 mb-1.5 font-sans text-xs flex flex-wrap items-center justify-between gap-1"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-0.5">
          {/* File Menu */}
          <div className="relative">
            <button
              onClick={() => {
                sound.playClick('1995');
                setActiveMenu(activeMenu === 'File' ? null : 'File');
              }}
              className={`px-2 py-0.5 text-[11px] font-medium border ${
                activeMenu === 'File'
                  ? 'border-t-[#808080] border-l-[#808080] border-r-[#fff] border-b-[#fff] bg-[#d0d0d0]'
                  : 'border-transparent hover:border-t-[#fff] hover:border-l-[#fff] hover:border-r-[#808080] hover:border-b-[#808080]'
              }`}
            >
              <u>F</u>ile
            </button>
            {activeMenu === 'File' && (
              <div className="absolute left-0 top-full mt-0.5 w-44 bg-[#c0c0c0] border-2 border-t-[#fff] border-l-[#fff] border-r-[#000] border-b-[#000] shadow-lg z-50 py-1 text-xs font-sans">
                <button
                  onClick={() => {
                    handleFindClick();
                    setActiveMenu(null);
                  }}
                  className="w-full text-left px-3 py-1 hover:bg-[#000080] hover:text-white flex justify-between"
                >
                  <span>Open Location...</span>
                  <span className="text-[10px] text-gray-500">Ctrl+L</span>
                </button>
                <button
                  onClick={() => {
                    setShowSourceModal(true);
                    setActiveMenu(null);
                  }}
                  className="w-full text-left px-3 py-1 hover:bg-[#000080] hover:text-white"
                >
                  View Document Source
                </button>
                <button
                  onClick={() => {
                    setShowPrintModal(true);
                    setActiveMenu(null);
                  }}
                  className="w-full text-left px-3 py-1 hover:bg-[#000080] hover:text-white flex justify-between"
                >
                  <span>Print Page...</span>
                  <span className="text-[10px] text-gray-500">Ctrl+P</span>
                </button>
                <div className="border-t border-[#808080] my-1" />
                <button
                  onClick={() => {
                    playModem();
                    setActiveMenu(null);
                  }}
                  className="w-full text-left px-3 py-1 hover:bg-[#000080] hover:text-white text-red-900 font-bold"
                >
                  Connect 14.4k Modem
                </button>
              </div>
            )}
          </div>

          {/* Bookmarks Menu */}
          <div className="relative">
            <button
              onClick={() => {
                sound.playClick('1995');
                setActiveMenu(activeMenu === 'Bookmarks' ? null : 'Bookmarks');
              }}
              className={`px-2 py-0.5 text-[11px] font-medium border ${
                activeMenu === 'Bookmarks'
                  ? 'border-t-[#808080] border-l-[#808080] border-r-[#fff] border-b-[#fff] bg-[#d0d0d0]'
                  : 'border-transparent hover:border-t-[#fff] hover:border-l-[#fff] hover:border-r-[#808080] hover:border-b-[#808080]'
              }`}
            >
              <u>B</u>ookmarks
            </button>
            {activeMenu === 'Bookmarks' && (
              <div className="absolute left-0 top-full mt-0.5 w-60 bg-[#c0c0c0] border-2 border-t-[#fff] border-l-[#fff] border-r-[#000] border-b-[#000] shadow-lg z-50 py-1 text-xs font-sans">
                <button
                  onClick={() => {
                    handleNavigate('http://www.cern.ch/hypertext/WWW/TheProject.html', 'Science');
                    setActiveMenu(null);
                  }}
                  className="w-full text-left px-3 py-1 hover:bg-[#000080] hover:text-white truncate"
                >
                  ★ CERN World-Wide Web Origin
                </button>
                <button
                  onClick={() => {
                    handleNavigate('http://www.ncsa.uiuc.edu/Mosaic/', 'Computers');
                    setActiveMenu(null);
                  }}
                  className="w-full text-left px-3 py-1 hover:bg-[#000080] hover:text-white truncate"
                >
                  ★ NCSA Mosaic Home Page
                </button>
                <button
                  onClick={() => {
                    handleNavigate('http://www.yahoo.com/', 'Computers');
                    setActiveMenu(null);
                  }}
                  className="w-full text-left px-3 py-1 hover:bg-[#000080] hover:text-white truncate"
                >
                  ★ Yahoo! Hierarchical Guide
                </button>
                <button
                  onClick={() => {
                    handleNavigate('http://www.jpl.nasa.gov/', 'Science');
                    setActiveMenu(null);
                  }}
                  className="w-full text-left px-3 py-1 hover:bg-[#000080] hover:text-white truncate"
                >
                  ★ NASA Jet Propulsion Lab
                </button>
                <button
                  onClick={() => {
                    handleNavigate('ftp://ftp.idsoftware.com/idstuff/doom/', 'Entertainment');
                    setActiveMenu(null);
                  }}
                  className="w-full text-left px-3 py-1 hover:bg-[#000080] hover:text-white truncate"
                >
                  ★ Doom II Shareware Archive
                </button>
              </div>
            )}
          </div>

          {/* View Menu */}
          <div className="relative">
            <button
              onClick={() => {
                sound.playClick('1995');
                setActiveMenu(activeMenu === 'View' ? null : 'View');
              }}
              className={`px-2 py-0.5 text-[11px] font-medium border ${
                activeMenu === 'View'
                  ? 'border-t-[#808080] border-l-[#808080] border-r-[#fff] border-b-[#fff] bg-[#d0d0d0]'
                  : 'border-transparent hover:border-t-[#fff] hover:border-l-[#fff] hover:border-r-[#808080] hover:border-b-[#808080]'
              }`}
            >
              <u>V</u>iew
            </button>
            {activeMenu === 'View' && (
              <div className="absolute left-0 top-full mt-0.5 w-48 bg-[#c0c0c0] border-2 border-t-[#fff] border-l-[#fff] border-r-[#000] border-b-[#000] shadow-lg z-50 py-1 text-xs font-sans">
                <button
                  onClick={() => {
                    simulateReload();
                    setActiveMenu(null);
                  }}
                  className="w-full text-left px-3 py-1 hover:bg-[#000080] hover:text-white"
                >
                  Reload Page
                </button>
                <button
                  onClick={() => {
                    setShowSourceModal(true);
                    setActiveMenu(null);
                  }}
                  className="w-full text-left px-3 py-1 hover:bg-[#000080] hover:text-white"
                >
                  Document Source (HTML)
                </button>
              </div>
            )}
          </div>

          {/* Help Menu */}
          <div className="relative">
            <button
              onClick={() => {
                sound.playClick('1995');
                setActiveMenu(activeMenu === 'Help' ? null : 'Help');
              }}
              className={`px-2 py-0.5 text-[11px] font-medium border ${
                activeMenu === 'Help'
                  ? 'border-t-[#808080] border-l-[#808080] border-r-[#fff] border-b-[#fff] bg-[#d0d0d0]'
                  : 'border-transparent hover:border-t-[#fff] hover:border-l-[#fff] hover:border-r-[#808080] hover:border-b-[#808080]'
              }`}
            >
              <u>H</u>elp
            </button>
            {activeMenu === 'Help' && (
              <div className="absolute left-0 top-full mt-0.5 w-52 bg-[#c0c0c0] border-2 border-t-[#fff] border-l-[#fff] border-r-[#000] border-b-[#000] shadow-lg z-50 py-1 text-xs font-sans">
                <button
                  onClick={() => {
                    triggerNetscapeEasterEgg();
                    setActiveMenu(null);
                  }}
                  className="w-full text-left px-3 py-1 hover:bg-[#000080] hover:text-white font-bold"
                >
                  ★ About Netscape Navigator...
                </button>
                <button
                  onClick={() => {
                    alert('1995 Release Notes: Added support for tables, centered text, background wallpapers, and the new Java applet tag.');
                    setActiveMenu(null);
                  }}
                  className="w-full text-left px-3 py-1 hover:bg-[#000080] hover:text-white"
                >
                  Release Notes (v1.2)
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Dial-Up Trigger Button */}
        <button
          onClick={playModem}
          disabled={Boolean(modemStatus)}
          className="px-2 py-0.5 bg-[#c0c0c0] border border-t-[#fff] border-l-[#fff] border-r-[#808080] border-b-[#808080] active:border-t-[#808080] active:border-l-[#808080] active:border-r-[#fff] active:border-b-[#fff] font-sans text-[11px] font-bold text-red-800 flex items-center gap-1 shadow-sm"
        >
          <span>{modemStatus ? '📞' : '🔊'}</span>
          <span>{modemStatus ? 'DIALING 14.4K...' : '14.4k Dial-Up'}</span>
        </button>
      </div>

      {/* 3. Iconic Netscape Navigator Beveled Toolbar & Meteor Logo */}
      <div className="bg-[#c0c0c0] border-b-2 border-[#808080] pb-2 mb-2 px-1 flex items-center justify-between gap-2 overflow-x-auto">
        <div className="flex items-center gap-1 shrink-0">
          {/* Back */}
          <button
            onClick={() => {
              sound.playClick('1995');
              handleNavigate('http://www.cern.ch/hypertext/WWW/TheProject.html', 'Science');
            }}
            className="px-2 py-1 bg-[#c0c0c0] border-2 border-t-[#ffffff] border-l-[#ffffff] border-r-[#808080] border-b-[#808080] active:border-t-[#808080] active:border-l-[#808080] active:border-r-[#ffffff] active:border-b-[#ffffff] flex flex-col items-center min-w-[42px]"
          >
            <span className="text-sm leading-none">⬅️</span>
            <span className="font-sans text-[10px] font-bold text-black mt-0.5">Back</span>
          </button>

          {/* Forward */}
          <button
            onClick={() => {
              sound.playClick('1995');
              handleNavigate('http://www.yahoo.com/', 'Computers');
            }}
            className="px-2 py-1 bg-[#c0c0c0] border-2 border-t-[#ffffff] border-l-[#ffffff] border-r-[#808080] border-b-[#808080] active:border-t-[#808080] active:border-l-[#808080] active:border-r-[#ffffff] active:border-b-[#ffffff] flex flex-col items-center min-w-[42px]"
          >
            <span className="text-sm leading-none">➡️</span>
            <span className="font-sans text-[10px] font-bold text-black mt-0.5">Forward</span>
          </button>

          {/* Home */}
          <button
            onClick={() => {
              handleNavigate('http://www.cern.ch/hypertext/WWW/TheProject.html', 'Computers');
            }}
            className="px-2 py-1 bg-[#c0c0c0] border-2 border-t-[#ffffff] border-l-[#ffffff] border-r-[#808080] border-b-[#808080] active:border-t-[#808080] active:border-l-[#808080] active:border-r-[#ffffff] active:border-b-[#ffffff] flex flex-col items-center min-w-[42px]"
          >
            <span className="text-sm leading-none">🏠</span>
            <span className="font-sans text-[10px] font-bold text-black mt-0.5">Home</span>
          </button>

          {/* Reload */}
          <button
            onClick={simulateReload}
            className="px-2 py-1 bg-[#c0c0c0] border-2 border-t-[#ffffff] border-l-[#ffffff] border-r-[#808080] border-b-[#808080] active:border-t-[#808080] active:border-l-[#808080] active:border-r-[#ffffff] active:border-b-[#ffffff] flex flex-col items-center min-w-[42px]"
          >
            <span className={`text-sm leading-none ${isLoading ? 'animate-spin' : ''}`}>🔄</span>
            <span className="font-sans text-[10px] font-bold text-black mt-0.5">Reload</span>
          </button>

          {/* Images */}
          <button
            onClick={() => {
              sound.playClick('1995');
              alert('GIF89a images refreshed from 14.4k cache.');
            }}
            className="px-2 py-1 bg-[#c0c0c0] border-2 border-t-[#ffffff] border-l-[#ffffff] border-r-[#808080] border-b-[#808080] active:border-t-[#808080] active:border-l-[#808080] active:border-r-[#ffffff] active:border-b-[#ffffff] flex flex-col items-center min-w-[42px]"
          >
            <span className="text-sm leading-none">🖼️</span>
            <span className="font-sans text-[10px] font-bold text-black mt-0.5">Images</span>
          </button>

          {/* Open */}
          <button
            onClick={() => {
              handleFindClick();
            }}
            className="px-2 py-1 bg-[#c0c0c0] border-2 border-t-[#ffffff] border-l-[#ffffff] border-r-[#808080] border-b-[#808080] active:border-t-[#808080] active:border-l-[#808080] active:border-r-[#ffffff] active:border-b-[#ffffff] flex flex-col items-center min-w-[42px]"
          >
            <span className="text-sm leading-none">📂</span>
            <span className="font-sans text-[10px] font-bold text-black mt-0.5">Open</span>
          </button>

          {/* Print */}
          <button
            onClick={() => {
              sound.playClick('1995');
              setShowPrintModal(true);
            }}
            className="px-2 py-1 bg-[#c0c0c0] border-2 border-t-[#ffffff] border-l-[#ffffff] border-r-[#808080] border-b-[#808080] active:border-t-[#808080] active:border-l-[#808080] active:border-r-[#ffffff] active:border-b-[#ffffff] flex flex-col items-center min-w-[42px]"
          >
            <span className="text-sm leading-none">🖨️</span>
            <span className="font-sans text-[10px] font-bold text-black mt-0.5">Print</span>
          </button>

          {/* Find */}
          <button
            onClick={handleFindClick}
            className="px-2 py-1 bg-[#c0c0c0] border-2 border-t-[#ffffff] border-l-[#ffffff] border-r-[#808080] border-b-[#808080] active:border-t-[#808080] active:border-l-[#808080] active:border-r-[#ffffff] active:border-b-[#ffffff] flex flex-col items-center min-w-[42px]"
          >
            <span className="text-sm leading-none">🔍</span>
            <span className="font-sans text-[10px] font-bold text-black mt-0.5">Find</span>
          </button>

          {/* Stop */}
          <button
            onClick={() => {
              sound.playClick('1995');
              setIsLoading(false);
              setLoadProgress(100);
            }}
            className="px-2 py-1 bg-[#c0c0c0] border-2 border-t-[#ffffff] border-l-[#ffffff] border-r-[#808080] border-b-[#808080] active:border-t-[#808080] active:border-l-[#808080] active:border-r-[#ffffff] active:border-b-[#ffffff] flex flex-col items-center min-w-[42px]"
          >
            <span className="text-sm leading-none text-red-600">🛑</span>
            <span className="font-sans text-[10px] font-bold text-black mt-0.5">Stop</span>
          </button>
        </div>

        {/* Famous Netscape Animated Meteor Shower Logo Button */}
        <button
          onClick={triggerNetscapeEasterEgg}
          title="Click the Netscape Navigator meteor logo for easter egg!"
          className="px-3 py-1 bg-[#000044] text-[#00ffff] font-mono font-bold text-xs border-2 border-inset border-[#808080] flex items-center gap-2 hover:bg-[#000066] transition-all shadow-inner shrink-0"
        >
          <div className="relative">
            <span className={`inline-block font-black text-base ${isLoading || eggTriggered ? 'animate-spin text-amber-300' : 'animate-pulse'}`}>
              [N]
            </span>
            <span className="absolute -top-1 -right-1 text-[8px] text-yellow-300">✦</span>
          </div>
          <div className="text-left leading-tight hidden sm:block">
            <div className="text-[10px] font-bold tracking-widest text-[#00ffff]">NETSCAPE</div>
            <div className="text-[8px] text-gray-300">COMMUNICATIONS</div>
          </div>
        </button>
      </div>

      {/* 4. Location Bar with URL Input & Dial-up Progress Notice */}
      <div className="bg-[#dcdcdc] border-2 border-t-[#808080] border-l-[#808080] border-r-[#ffffff] border-b-[#ffffff] p-1.5 mb-2 flex items-center gap-2 text-xs font-mono">
        <span className="font-bold text-[#000080] shrink-0 font-sans text-xs">Location:</span>
        <input
          type="text"
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleNavigate(urlInput);
            }
          }}
          className="bg-white px-2 py-0.5 border border-[#808080] flex-1 text-black font-mono text-xs focus:outline-none"
        />
        <button
          onClick={() => handleNavigate(urlInput)}
          className="px-2 py-0.5 bg-[#c0c0c0] border border-t-[#fff] border-l-[#fff] border-r-[#000] border-b-[#000] active:border-t-[#000] active:border-l-[#000] font-sans text-[11px] font-bold"
        >
          Go
        </button>
      </div>

      {/* Modem Handshake Status Banner */}
      {modemStatus && (
        <div className="mb-2 p-2 bg-[#000080] text-yellow-300 border-2 border-yellow-400 font-mono text-xs flex items-center justify-between gap-2 animate-pulse">
          <div className="flex items-center gap-2">
            <span className="text-base">☎️</span>
            <span>{modemStatus}</span>
          </div>
          <span className="text-[10px] bg-yellow-400 text-black px-1 font-bold">14.4 KBPS</span>
        </div>
      )}

      {/* 5. Main 1995 Web Page Layout (Raw HTML Table Simulation) */}
      <div className="bg-white border-2 border-[#808080] p-3 sm:p-5 text-black">
        {/* Header with authentic 90s graphics & marquee */}
        <div className="border-b-2 border-[#000080] pb-3 mb-4 text-center">
          <div className="text-2xl sm:text-3xl font-bold tracking-tight text-[#000080] mb-1 font-serif">
            Welcome to The World-Wide Web Consortium
          </div>
          <div className="text-xs font-mono text-[#555] mb-2">
            *** Practical Information for Cyberspace Explorers & NCSA Mosaic Users ***
          </div>

          {/* Authentic 90s Marquee with <blink> tag */}
          <div className="bg-[#ffffcc] border border-[#cccc99] p-1 text-xs font-mono overflow-hidden shadow-inner">
            <div className="animate-marquee whitespace-nowrap text-[#990000] font-bold">
              ★ <span className="animate-blink bg-[#990000] text-white px-1">HOT NEWS (1995):</span> Sun Microsystems announces "Java" language for interactive web applets! ★ Netscape Communications files historic IPO! ★ Best viewed in 800x600 resolution with 256 colors! ★ CERN transfers WWW project stewardship to W3C! ★
            </div>
          </div>
        </div>

        {/* 2-Column Table Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Left Column: Yahoo Directory Tree & Tools */}
          <div className="md:col-span-1 bg-[#eeeeee] border-2 border-t-[#808080] border-l-[#808080] border-r-[#ffffff] border-b-[#ffffff] p-3 text-xs space-y-4">
            
            {/* 1995 Search Simulator (Lycos / WebCrawler) */}
            <div className="bg-white border border-[#808080] p-2">
              <div className="font-bold text-[#000080] text-[11px] mb-1 flex items-center justify-between">
                <span>🔍 WebCrawler Search (1995)</span>
                <span className="text-[9px] text-[#777]">v1.0</span>
              </div>
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Keywords: cern, java, doom..."
                className="w-full p-1 border border-[#808080] font-mono text-[11px] text-black bg-[#fafafa] focus:bg-white focus:outline-none"
              />
              {searchQuery && (
                <div className="mt-1 text-[10px] text-[#444] flex justify-between items-center">
                  <span>Matches: {searchResults ? searchResults.length : 0} items</span>
                  <button
                    onClick={() => setSearchQuery('')}
                    className="text-red-700 underline hover:text-red-900"
                  >
                    Clear
                  </button>
                </div>
              )}
            </div>

            {/* Subject Directory Index */}
            <div>
              <h3 className="font-bold text-sm text-[#000080] border-b border-[#808080] pb-1 mb-2 font-serif">
                📂 Web Directory Index
              </h3>
              <p className="mb-2 text-[#444] text-[11px]">
                Select a subject taxonomy to explore hyperlinked pages:
              </p>
              <div className="space-y-1">
                {Object.keys(categories).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      sound.playClick('1995');
                      setActiveCategory(cat);
                      setSearchQuery('');
                    }}
                    className={`w-full text-left px-2 py-1 flex items-center justify-between border font-sans text-xs ${
                      activeCategory === cat && !searchQuery
                        ? 'bg-[#000080] text-white border-[#000080] font-bold'
                        : 'bg-[#dcdcdc] text-black border-t-[#ffffff] border-l-[#ffffff] border-r-[#808080] border-b-[#808080] hover:bg-[#e0e0e0]'
                    }`}
                  >
                    <span>📁 {cat}</span>
                    <span className="text-[10px]">({categories[cat].links.length})</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Retro Hit Counter */}
            <div className="pt-2 border-t-2 border-dashed border-[#808080] text-center">
              <div className="text-[11px] font-bold text-[#000080] mb-1 font-sans">
                YOU ARE VISITOR NUMBER:
              </div>
              <button
                onClick={handleHitClick}
                className="bg-black text-[#00ff00] font-mono font-bold tracking-widest text-lg px-3 py-1 border-2 border-[#808080] inline-block shadow-inner hover:text-[#ffff00] transition-colors cursor-pointer"
                title="Click counter to increment page hits!"
              >
                {String(hits).padStart(6, '0')}
              </button>
              <div className="text-[10px] text-[#666] mt-1 italic">
                (Click counter to record page hit)
              </div>
            </div>

            {/* Under Construction GIF Banner */}
            <div className="bg-[#ffff00] border-2 border-black p-2 text-center text-black font-bold text-[11px] uppercase tracking-wide font-sans shadow-sm">
              <div className="flex items-center justify-center gap-1">
                <span className="animate-bounce">🚧</span>
                <span>UNDER CONSTRUCTION</span>
                <span className="animate-bounce">🚧</span>
              </div>
              <div className="text-[9px] font-normal lowercase mt-0.5">
                site maintained by webmaster@cern.ch
              </div>
            </div>

            {/* Authentic 88x31 Badges */}
            <div className="pt-2 border-t border-[#ccc] text-center space-y-1.5">
              <div className="text-[10px] font-bold text-[#666] uppercase">Cyberspace Badges</div>
              <div className="flex flex-wrap gap-1.5 justify-center">
                <span className="px-2 py-0.5 bg-[#000080] text-white text-[9px] font-bold font-mono border border-black">
                  [Netscape Now 2.0]
                </span>
                <span className="px-2 py-0.5 bg-[#990000] text-white text-[9px] font-bold font-mono border border-black">
                  [HTML 2.0 Valid]
                </span>
                <span className="px-2 py-0.5 bg-[#006600] text-white text-[9px] font-bold font-mono border border-black">
                  [800x600 256c]
                </span>
                <span className="px-2 py-0.5 bg-[#333333] text-white text-[9px] font-bold font-mono border border-black">
                  [Made with Notepad]
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Search Results / Links & CGI-BIN Guestbook */}
          <div className="md:col-span-2 space-y-4">
            
            {/* Search Results Display */}
            {searchResults && (
              <div className="border-2 border-[#000080] p-3 bg-[#ffffea]">
                <h2 className="text-sm font-bold text-[#000080] border-b border-[#000080] pb-1 mb-2 font-serif flex items-center justify-between">
                  <span>🔍 WebCrawler Search Results for "{searchQuery}"</span>
                  <span className="text-xs font-normal">Found {searchResults.length} entries</span>
                </h2>
                {searchResults.length === 0 ? (
                  <p className="text-xs text-red-700 italic">
                    No matching hypertext documents found. Try queries like "cern", "java", "doom", or "web".
                  </p>
                ) : (
                  <ul className="list-disc pl-5 space-y-2">
                    {searchResults.map((link, idx) => (
                      <li key={idx} className="text-xs">
                        <a
                          href={link.url}
                          onClick={(e) => {
                            e.preventDefault();
                            handleNavigate(link.url, link.category);
                          }}
                          className="text-[#0000ee] underline font-bold hover:text-[#ff0000] visited:text-[#800080]"
                        >
                          {link.name}
                        </a>
                        <span className="ml-1 text-[10px] text-gray-600 bg-gray-200 px-1 border border-gray-400">
                          {link.category}
                        </span>
                        <p className="text-[#333] text-[11px] mt-0.5">{link.desc}</p>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {/* Active Category Content */}
            {!searchResults && activeCategory && categories[activeCategory] && (
              <div className="border border-[#808080] p-3 bg-[#fafafa]">
                <h2 className="text-lg font-bold text-[#000080] border-b border-[#000080] pb-1 mb-2 font-serif flex items-center justify-between">
                  <span>📂 {categories[activeCategory].title}</span>
                  <span className="text-[11px] text-[#666] font-mono font-normal">HTTP/1.0 200 OK</span>
                </h2>
                <ul className="list-disc pl-5 space-y-2.5">
                  {categories[activeCategory].links.map((link, idx) => (
                    <li key={idx} className="text-xs">
                      <a
                        href={link.url}
                        onClick={(e) => {
                          e.preventDefault();
                          handleNavigate(link.url);
                        }}
                        className="text-[#0000ee] underline font-bold hover:text-[#ff0000] visited:text-[#800080]"
                      >
                        {link.name}
                      </a>
                      <p className="text-[#333] text-[11px] mt-0.5">{link.desc}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* 1995 Interactive Web Guestbook (CGI-BIN Perl Form) */}
            <div className="border border-[#808080] p-3 bg-[#f5f5f5]">
              <div className="flex items-center justify-between border-b border-[#808080] pb-1 mb-2">
                <h3 className="font-bold text-sm text-[#000080] font-serif">
                  ✍️ Hypertext Guestbook (CGI-BIN Perl Form)
                </h3>
                <span className="text-[10px] text-[#555] font-mono">
                  {guestbook.length} entries recorded
                </span>
              </div>
              
              <form onSubmit={handleSignGuestbook} className="space-y-2 mb-3 text-xs">
                <div>
                  <label className="block font-bold text-[#333] mb-0.5 font-sans">
                    Your Name / Cyber Handle:
                  </label>
                  <input
                    type="text"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    placeholder="e.g., SiliconSurfer95"
                    className="w-full p-1 border-2 border-t-[#808080] border-l-[#808080] border-r-[#ffffff] border-b-[#ffffff] bg-white text-black font-mono text-xs focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#333] mb-0.5 font-sans">
                    Comment for Webmaster:
                  </label>
                  <input
                    type="text"
                    value={guestComment}
                    onChange={(e) => setGuestComment(e.target.value)}
                    placeholder="e.g., Awesome WWW links! Sending greetings from Tokyo!"
                    className="w-full p-1 border-2 border-t-[#808080] border-l-[#808080] border-r-[#ffffff] border-b-[#ffffff] bg-white text-black font-mono text-xs focus:outline-none"
                  />
                </div>
                <div className="flex gap-2 font-sans">
                  <button
                    type="submit"
                    className="px-3 py-1 bg-[#c0c0c0] border-2 border-t-[#ffffff] border-l-[#ffffff] border-r-[#808080] border-b-[#808080] active:border-t-[#808080] active:border-l-[#808080] active:border-r-[#ffffff] active:border-b-[#ffffff] font-bold text-black text-xs hover:bg-[#d0d0d0]"
                  >
                    Submit Entry
                  </button>
                  <button
                    type="reset"
                    onClick={() => {
                      setGuestName('');
                      setGuestComment('');
                      sound.playClick('1995');
                    }}
                    className="px-3 py-1 bg-[#c0c0c0] border-2 border-t-[#ffffff] border-l-[#ffffff] border-r-[#808080] border-b-[#808080] active:border-t-[#808080] active:border-l-[#808080] active:border-r-[#ffffff] active:border-b-[#ffffff] font-normal text-black text-xs hover:bg-[#d0d0d0]"
                  >
                    Clear Form
                  </button>
                </div>
              </form>

              {/* Guestbook Entries Feed */}
              <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1 border border-[#ccc] p-1.5 bg-white">
                {guestbook.map((entry, idx) => (
                  <div key={idx} className="p-1.5 border-b border-[#eee] last:border-b-0 text-[11px]">
                    <span className="font-bold text-[#000080]">★ {entry.name}</span>{' '}
                    <span className="text-[#888] text-[9px]">({entry.date})</span>:
                    <p className="text-[#222] italic mt-0.5">"{entry.comment}"</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 1995 Raw HTML Footer */}
        <div className="mt-4 pt-3 border-t-2 border-[#808080] text-center text-xs text-[#555] font-mono flex flex-wrap items-center justify-between gap-2">
          <span>
            [ <a href="#" onClick={(e) => { e.preventDefault(); handleNavigate(currentUrl); }} className="text-[#0000ee] underline">Top</a> |{' '}
            <a href="#" onClick={(e) => { e.preventDefault(); handleFindClick(); }} className="text-[#0000ee] underline">Search</a> |{' '}
            <a href="#" onClick={(e) => { e.preventDefault(); setShowSourceModal(true); }} className="text-[#0000ee] underline">View Source</a> |{' '}
            <a href="#" onClick={(e) => { e.preventDefault(); triggerNetscapeEasterEgg(); }} className="text-[#0000ee] underline">About Netscape</a> ]
          </span>
          <span className="font-bold text-[#000080]">
            Best viewed with Netscape Navigator 1.1 or NCSA Mosaic!
          </span>
        </div>
      </div>

      {/* 6. Netscape Navigator Bottom Status Bar */}
      <div className="mt-1 bg-[#c0c0c0] border-2 border-t-[#808080] border-l-[#808080] border-r-[#ffffff] border-b-[#ffffff] p-1 flex items-center justify-between text-xs font-mono text-[#333]">
        <div className="flex items-center gap-2 truncate">
          {/* Security Broken Key Icon */}
          <span
            title="Unencrypted HTTP/1.0 Connection (Standard in 1995)"
            className="px-1.5 py-0.2 bg-[#dcdcdc] border border-[#808080] text-black font-bold text-[10px]"
          >
            🔓 Broken Key (Insecure)
          </span>
          <span className="truncate text-[11px]">
            {isLoading ? 'Reading document from host www.cern.ch...' : 'Document: Done (1.4 KB / 4.2 sec @ 14.4 kbps)'}
          </span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-24 bg-[#808080] h-3 border border-[#404040] p-0.5 hidden sm:block">
            <div
              className="bg-[#000080] h-full transition-all duration-300"
              style={{ width: `${loadProgress}%` }}
            />
          </div>
          <span className="text-[10px] font-bold">{loadProgress}%</span>
        </div>
      </div>

      {/* MODAL: About Netscape Navigator (Easter Egg) */}
      {showAboutModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-[#c0c0c0] border-4 border-t-[#ffffff] border-l-[#ffffff] border-r-[#404040] border-b-[#404040] p-4 max-w-md w-full shadow-2xl font-sans text-black">
            <div className="bg-[#000080] text-white px-2 py-1 font-bold text-xs flex justify-between items-center mb-3">
              <span>About Netscape Navigator</span>
              <button
                onClick={() => setShowAboutModal(false)}
                className="bg-[#c0c0c0] text-black px-1.5 text-[10px] border border-t-[#fff] border-l-[#fff] border-r-[#000] border-b-[#000]"
              >
                ✕
              </button>
            </div>
            <div className="text-center mb-4">
              <div className="text-3xl font-black font-mono text-[#000080] mb-1">
                NETSCAPE NAVIGATOR 1.2
              </div>
              <div className="text-xs text-[#555] font-mono">
                Copyright © 1994-1995 Netscape Communications Corp.
              </div>
              <div className="mt-3 p-3 bg-white border border-[#808080] text-xs text-left leading-relaxed font-serif">
                <p className="mb-2">
                  <strong>Created by:</strong> Marc Andreessen, Jim Clark, Eric Bina, and the original Mosaic development team.
                </p>
                <p className="text-[11px] text-[#444]">
                  Netscape Navigator revolutionized the information superhighway by introducing HTML tables, inline GIF images, client-side cookies, and support for Sun Microsystems' Java applets.
                </p>
              </div>
            </div>
            <div className="flex justify-center">
              <button
                onClick={() => {
                  sound.playClick('1995');
                  setShowAboutModal(false);
                }}
                className="px-5 py-1 bg-[#c0c0c0] border-2 border-t-[#ffffff] border-l-[#ffffff] border-r-[#808080] border-b-[#808080] active:border-t-[#808080] active:border-l-[#808080] font-bold text-xs"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: View HTML Source */}
      {showSourceModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-[#c0c0c0] border-4 border-t-[#ffffff] border-l-[#ffffff] border-r-[#404040] border-b-[#404040] p-3 max-w-2xl w-full shadow-2xl font-mono text-black">
            <div className="bg-[#000080] text-white px-2 py-1 font-bold text-xs flex justify-between items-center mb-2">
              <span>View-Source: {currentUrl}</span>
              <button
                onClick={() => setShowSourceModal(false)}
                className="bg-[#c0c0c0] text-black px-1.5 text-[10px] border border-t-[#fff] border-l-[#fff] border-r-[#000] border-b-[#000]"
              >
                ✕
              </button>
            </div>
            <div className="bg-white border-2 border-[#808080] p-3 max-h-96 overflow-y-auto text-xs text-[#000080] leading-tight select-all">
              <pre className="whitespace-pre font-mono text-[11px]">
{`<!DOCTYPE HTML PUBLIC "-//IETF//DTD HTML 2.0//EN">
<html>
<head>
  <title>The World-Wide Web Consortium (W3C)</title>
  <meta name="generator" content="Notepad 3.1">
</head>
<body bgcolor="#FFFFFF" text="#000000" link="#0000EE" vlink="#800080">
  <center>
    <h1>Welcome to The World-Wide Web Consortium</h1>
    <font size="2">*** Practical Information for Cyberspace Explorers ***</font>
    <marquee bgcolor="#FFFFCC"><blink>HOT NEWS (1995):</blink> Java Applet Support Announced!</marquee>
  </center>
  <hr size="4" color="#808080">
  <table width="100%" border="1" cellpadding="6">
    <tr>
      <td width="30%" valign="top" bgcolor="#EEEEEE">
        <b>Web Directory Index:</b>
        <ul>
          <li><a href="#computers">Computers & Internet</a></li>
          <li><a href="#arts">Arts & Humanities</a></li>
          <li><a href="#science">Science & Space</a></li>
          <li><a href="#entertainment">Entertainment</a></li>
        </ul>
        <center>
          <p>YOU ARE VISITOR NUMBER: <b>${hits}</b></p>
          <img src="under_construction.gif" alt="Under Construction">
        </center>
      </td>
      <td width="70%" valign="top">
        <h2>Hypertext Exploration</h2>
        <p>The World Wide Web is a wide-area hypermedia information initiative aiming to give universal access to a large universe of documents.</p>
        <!-- Form action handled by CGI-BIN perl script -->
        <form action="/cgi-bin/guestbook.pl" method="POST">
          <input type="text" name="author" value="WebSurfer95">
          <input type="submit" value="Sign Guestbook">
        </form>
      </td>
    </tr>
  </table>
  <hr size="2">
  <center>
    <small>Best viewed with Netscape Navigator 1.1 or NCSA Mosaic</small>
  </center>
</body>
</html>`}
              </pre>
            </div>
            <div className="mt-2 flex justify-end">
              <button
                onClick={() => {
                  sound.playClick('1995');
                  setShowSourceModal(false);
                }}
                className="px-4 py-1 bg-[#c0c0c0] border-2 border-t-[#ffffff] border-l-[#ffffff] border-r-[#808080] border-b-[#808080] font-bold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Print Spooler */}
      {showPrintModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 font-sans">
          <div className="bg-[#c0c0c0] border-4 border-t-[#ffffff] border-l-[#ffffff] border-r-[#404040] border-b-[#404040] p-4 max-w-sm w-full shadow-2xl text-black">
            <div className="bg-[#000080] text-white px-2 py-1 font-bold text-xs flex justify-between items-center mb-3">
              <span>Print Document (LPT1:)</span>
              <button
                onClick={() => setShowPrintModal(false)}
                className="bg-[#c0c0c0] text-black px-1.5 text-[10px] border border-t-[#fff] border-l-[#fff] border-r-[#000] border-b-[#000]"
              >
                ✕
              </button>
            </div>
            <div className="text-xs space-y-2 mb-4">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🖨️</span>
                <div>
                  <div className="font-bold">Epson ActionLaser II (Dot Matrix / LPT1)</div>
                  <div className="text-[10px] text-[#555]">Status: Ready (Tractor-feed paper loaded)</div>
                </div>
              </div>
              <div className="border border-[#808080] p-2 bg-white text-[11px]">
                <div>Print Range: All pages (1-3)</div>
                <div>Copies: 1</div>
                <div>Quality: Draft (150 DPI Monochrome)</div>
              </div>
            </div>
            <div className="flex justify-end gap-2 text-xs">
              <button
                onClick={() => {
                  sound.playClick('1995');
                  window.print();
                  setShowPrintModal(false);
                }}
                className="px-4 py-1 bg-[#c0c0c0] border-2 border-t-[#ffffff] border-l-[#ffffff] border-r-[#808080] border-b-[#808080] font-bold"
              >
                Print
              </button>
              <button
                onClick={() => setShowPrintModal(false)}
                className="px-4 py-1 bg-[#c0c0c0] border-2 border-t-[#ffffff] border-l-[#ffffff] border-r-[#808080] border-b-[#808080]"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};