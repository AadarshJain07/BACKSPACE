import React, { useState } from 'react';
import { EraConfig } from '../../types/era';
import { sound } from '../../utils/audio';
interface Props {
  era: EraConfig;
}
export const Era1995: React.FC<Props> = () => {
  const [hits, setHits] = useState(4289);
  const [activeCategory, setActiveCategory] = useState<string | null>('Computers');
  const [guestName, setGuestName] = useState('');
  const [guestComment, setGuestComment] = useState('');
  const [guestbook, setGuestbook] = useState([
    { name: 'WebSurfer95', comment: 'Cool site!! Surfing this from my university Sun Sparc station!', date: 'Oct 12, 1995' },
    { name: 'Dr_Mosaic', comment: 'Excellent hypertext collection. Added to my NCSA hotlist.', date: 'Nov 03, 1995' }
  ]);
  const [modemPlaying, setModemPlaying] = useState(false);
  const [eggTriggered, setEggTriggered] = useState(false);
  const handleHitClick = () => {
    sound.playClick('1995');
    setHits(prev => prev + 1);
  };
  const handleSignGuestbook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim()) return;
    sound.playClick('1995');
    setGuestbook([
      { name: guestName, comment: guestComment || 'Greetings from cyberspace!', date: 'Dec 1995' },
      ...guestbook
    ]);
    setGuestName('');
    setGuestComment('');
  };
  const playModem = () => {
    setModemPlaying(true);
    sound.playModemHandshake();
    setTimeout(() => setModemPlaying(false), 2000);
  };
  const triggerNetscapeEasterEgg = () => {
    sound.playTimeWarp();
    setEggTriggered(prev => !prev);
  };
  const categories: Record<string, { title: string; links: { name: string; url: string; desc: string }[] }> = {
    Computers: {
      title: 'Computers & Internet',
      links: [
        { name: 'World Wide Web Consortium (W3C)', url: '#', desc: 'Standards and specifications for hypertext.' },
        { name: 'NCSA Mosaic Home Page', url: '#', desc: 'The first graphical browser developed at UIUC.' },
        { name: 'Yahoo! Internet Guide', url: '#', desc: "Jerry and David's guide to the World Wide Web." },
        { name: 'comp.infosystems.www FAQ', url: '#', desc: 'Usenet newsgroup discussion archive.' }
      ]
    },

     Arts: {
      title: 'Arts & Humanities',
      links: [
        { name: 'WebMuseum Paris', url: '#', desc: 'Nicolas Pioch’s famous online art exhibition.' },
        { name: 'ASCII Art Archives', url: '#', desc: 'Thousands of plain-text pictures drawn with characters.' },
        { name: 'Electronic Poetry Center', url: '#', desc: 'Experimental literature distributed over HTTP.' }
      ]
    },
    Science: {
      title: 'Science & Physics',
      links: [
        { name: 'CERN European Particle Physics', url: '#', desc: 'Birthplace of the WWW created by Tim Berners-Lee.' },
        { name: 'NASA Jet Propulsion Laboratory', url: '#', desc: 'Latest imagery from the Galileo Jupiter probe.' },
        { name: 'Hubble Space Telescope Images', url: '#', desc: 'View raw GIF files straight from orbital cameras.' }
      ]
    },
    Entertainment: {
      title: 'Entertainment & Games',
      links: [
        { name: 'Doom II / Id Software Shareware', url: '#', desc: 'Download shareware PKZIP archives via FTP.' },
        { name: 'Internet Movie Database (IMDb)', url: '#', desc: 'Early hyperlinked film and cast encyclopedia.' },
        { name: 'The Dilbert Zone', url: '#', desc: 'Daily comic strips delivered over the World Wide Web.' }
      ]
    }
  };
  return (
    <div className="w-full bg-[#c0c0c0] text-black font-serif text-[15px] leading-relaxed p-2 sm:p-4 border-4 border-t-[#ffffff] border-l-[#ffffff] border-r-[#808080] border-b-[#808080] shadow-2xl select-text">
      {/* 1995 Netscape Navigator Menu Bar */}
      <div className="bg-[#c0c0c0] border-b-2 border-[#808080] pb-2 mb-3 font-sans text-xs flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1 sm:gap-2">
          {['File', 'Edit', 'View', 'Go', 'Bookmarks', 'Options', 'Directory', 'Help'].map((item) => (
            <button
              key={item}
              onClick={() => sound.playClick('1995')}
              className="px-2 py-0.5 bg-[#c0c0c0] border border-t-[#ffffff] border-l-[#ffffff] border-r-[#808080] border-b-[#808080] active:border-t-[#808080] active:border-l-[#808080] active:border-r-[#ffffff] active:border-b-[#ffffff] hover:bg-[#d0d0d0] text-black font-semibold text-[11px]"
            >
              {item}
            </button>
          ))}
        </div>
        {/* Netscape pulsating meteor logo easter egg */}
        <button
          onClick={triggerNetscapeEasterEgg}
          title="Click the Netscape Navigator 'N' Logo!"
          className="px-3 py-1 bg-[#000044] text-[#00ffff] font-mono font-bold text-xs border-2 border-inset border-[#808080] flex items-center gap-2 hover:bg-[#000066] transition-all"
        >
          <span className={`inline-block font-black text-sm ${eggTriggered ? 'animate-spin text-amber-300' : 'animate-pulse'}`}>
            [N]
          </span>
          <span className="hidden sm:inline">NETSCAPE 1.2</span>
        </button>
      </div>
      {/* URL Location Bar */}
      <div className="bg-[#dcdcdc] border-2 border-t-[#808080] border-l-[#808080] border-r-[#ffffff] border-b-[#ffffff] p-1.5 mb-3 flex items-center gap-2 text-xs font-mono">
        <span className="font-bold text-[#000080]">Location:</span>
        <span className="bg-white px-2 py-0.5 border border-[#808080] flex-1 truncate text-black">
          http://www.cern.ch/hypertext/WWW/TheProject.html
        </span>
        <button
          onClick={playModem}
          disabled={modemPlaying}
          className="px-2 py-0.5 bg-[#c0c0c0] border border-t-[#fff] border-l-[#fff] border-r-[#808080] border-b-[#808080] active:border-t-[#808080] active:border-l-[#808080] active:border-r-[#fff] active:border-b-[#fff] font-sans text-[11px] font-bold text-red-800"
        >
          {modemPlaying ? '📞 DIALING 56K...' : '🔊 56k Dial-Up'}
        </button>
      </div>

       {/* Main 1995 Web Page Layout (Raw HTML Table Simulation) */}
      <div className="bg-white border-2 border-[#808080] p-4 text-black">
        {/* Header with authentic 90s graphics & marquee */}
        <div className="border-b-2 border-[#000080] pb-3 mb-4 text-center">
          <div className="text-2xl sm:text-3xl font-bold tracking-tight text-[#000080] mb-1">
            Welcome to The World-Wide Web Consortium
          </div>
          <div className="text-xs font-mono text-[#555] mb-2">
            *** Practical Information for Cyberspace Explorers ***
          </div>
          <div className="bg-[#ffffcc] border border-[#cccc99] p-1 text-xs font-mono overflow-hidden">
            <div className="animate-marquee whitespace-nowrap text-[#990000] font-bold">
              ★ HOT NEWS (1995): Sun Microsystems announces "Java" language for interactive web applets! ★ Netscape files historic IPO! ★ Best viewed in 800x600 resolution with 256 colors! ★
            </div>
          </div>
        </div>
        {/* 2-Column Table Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Left Column: Yahoo Directory Tree */}
          <div className="md:col-span-1 bg-[#eeeeee] border-2 border-t-[#808080] border-l-[#808080] border-r-[#ffffff] border-b-[#ffffff] p-3 text-xs">
            <h3 className="font-bold text-sm text-[#000080] border-b border-[#808080] pb-1 mb-2">
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
                  }}
                  className={`w-full text-left px-2 py-1 flex items-center justify-between border ${
                    activeCategory === cat
                      ? 'bg-[#000080] text-white border-[#000080]'
                      : 'bg-[#dcdcdc] text-black border-t-[#ffffff] border-l-[#ffffff] border-r-[#808080] border-b-[#808080] hover:bg-[#e0e0e0]'
                  }`}
                >
                  <span className="font-bold">📁 {cat}</span>
                  <span className="text-[10px]">({categories[cat].links.length})</span>
                </button>
              ))}
            </div>
            {/* Hit Counter */}
            <div className="mt-4 pt-3 border-t-2 border-dashed border-[#808080] text-center">
              <div className="text-[11px] font-bold mb-1">YOU ARE VISITOR NUMBER:</div>
              <button
                onClick={handleHitClick}
                className="bg-black text-[#00ff00] font-mono font-bold tracking-widest text-lg px-3 py-1 border-2 border-[#808080] inline-block shadow-inner hover:text-[#ffff00] transition-colors"
                title="Click to increase counter!"
              >
                {String(hits).padStart(6, '0')}
              </button>
              <div className="text-[10px] text-[#666] mt-1 italic">
                (Click counter to record page hit)
              </div>
            </div>
            {/* Under Construction Banner */}
            <div className="mt-4 bg-[#ffff00] border-2 border-black p-2 text-center text-black font-bold text-[11px] uppercase tracking-wide">
              🚧 UNDER CONSTRUCTION 🚧
              <div className="text-[9px] font-normal lowercase">site maintained by webmaster@domain.org</div>
            </div>
          </div>
          {/* Right Column: Hyperlinks & Interactive Guestbook */}
          <div className="md:col-span-2 space-y-4">
            {/* Active Category Content */}
            {activeCategory && categories[activeCategory] && (
              <div className="border border-[#808080] p-3 bg-[#fafafa]">
                <h2 className="text-lg font-bold text-[#000080] border-b border-[#000080] pb-1 mb-2">
                  📂 {categories[activeCategory].title}
                </h2>
                <ul className="list-disc pl-5 space-y-2">
                  {categories[activeCategory].links.map((link, idx) => (
                    <li key={idx} className="text-xs">
                      <a
                        href={link.url}
                        onClick={(e) => {
                          e.preventDefault();
                          sound.playClick('1995');
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
            {/* 1995 Interactive Web Guestbook */}
            <div className="border border-[#808080] p-3 bg-[#f5f5f5]">
              <h3 className="font-bold text-sm text-[#000080] border-b border-[#808080] pb-1 mb-2">
                ✍️ Hypertext Guestbook (CGI-BIN Perl Form)
              </h3>
              <form onSubmit={handleSignGuestbook} className="space-y-2 mb-3 text-xs">
                <div>
                  <label className="block font-bold text-[#333] mb-0.5">Your Name / Handle:</label>
                  <input
                    type="text"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    placeholder="e.g., CyberJedi95"
                    className="w-full p-1 border-2 border-t-[#808080] border-l-[#808080] border-r-[#ffffff] border-b-[#ffffff] bg-white text-black font-mono text-xs focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#333] mb-0.5">Comment for Webmaster:</label>
                  <input
                    type="text"
                    value={guestComment}
                    onChange={(e) => setGuestComment(e.target.value)}
                    placeholder="e.g., Cool homepage! Check out my FTP archive!"
                    className="w-full p-1 border-2 border-t-[#808080] border-l-[#808080] border-r-[#ffffff] border-b-[#ffffff] bg-white text-black font-mono text-xs focus:outline-none"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="px-3 py-1 bg-[#c0c0c0] border-2 border-t-[#ffffff] border-l-[#ffffff] border-r-[#808080] border-b-[#808080] active:border-t-[#808080] active:border-l-[#808080] active:border-r-[#ffffff] active:border-b-[#ffffff] font-bold text-black text-xs"
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
                    className="px-3 py-1 bg-[#c0c0c0] border-2 border-t-[#ffffff] border-l-[#ffffff] border-r-[#808080] border-b-[#808080] font-normal text-black text-xs"
                  >
                    Clear
                  </button>
                </div>
              </form>
              {/* Guestbook List */}
              <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                {guestbook.map((entry, idx) => (
                  <div key={idx} className="bg-white p-1.5 border border-[#ccc] text-[11px]">
                    <span className="font-bold text-[#000080]">★ {entry.name}</span>{' '}
                    <span className="text-[#888] text-[9px]">({entry.date})</span>:
                    <p className="text-[#222] italic mt-0.5">"{entry.comment}"</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        {/* 1995 Footer */}
        <div className="mt-4 pt-3 border-t-2 border-[#808080] text-center text-xs text-[#555] font-mono flex flex-wrap items-center justify-between gap-2">
          <span>[ <a href="#" onClick={(e) => { e.preventDefault(); sound.playClick('1995'); }} className="text-[#0000ee] underline">Top</a> | <a href="#" onClick={(e) => { e.preventDefault(); sound.playClick('1995'); }} className="text-[#0000ee] underline">Search</a> | <a href="#" onClick={(e) => { e.preventDefault(); sound.playClick('1995'); }} className="text-[#0000ee] underline">Help</a> | <a href="#" onClick={(e) => { e.preventDefault(); sound.playClick('1995'); }} className="text-[#0000ee] underline">Feedback</a> ]</span>
          <span className="font-bold text-[#000080]">Best viewed with Netscape Navigator 1.1 or Mosaic!</span>
        </div>
      </div>
    </div>
  );
};