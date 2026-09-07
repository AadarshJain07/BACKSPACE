import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { EraConfig } from '../../types/era';
import { sound } from '../../utils/audio';
import { Twitter2010 } from './era2010/Twitter2010';
import { Facebook2010 } from './era2010/Facebook2010';
import { AngryBirds2010 } from './era2010/AngryBirds2010';
import { Instagram2010 } from './era2010/Instagram2010';
import { Html5Showcase2010 } from './era2010/HTML5Showcase2010';
import { ResponsiveDesign2010 } from './era2010/ResponsiveDesign2010';

interface Props {
  era: EraConfig;
}

type TabType = 'twitter' | 'facebook' | 'angrybirds' | 'instagram' | 'flash' | 'rwd';

export const Era2010: React.FC<Props> = ({ era }) => {
  const [activeTab, setActiveTab] = useState<TabType>('twitter');
  const [bookmarked, setBookmarked] = useState(false);
  const [showSpannerMenu, setShowSpannerMenu] = useState(false);

  const getUrl = () => {
    switch (activeTab) {
      case 'twitter':
        return 'https://twitter.com/timeline';
      case 'facebook':
        return 'https://www.facebook.com/home.php';
      case 'angrybirds':
        return 'chrome-app://rovio.angrybirds/web/';
      case 'instagram':
        return 'https://instagr.am/p/vintage-launch';
      case 'flash':
        return 'https://www.apple.com/hotnews/thoughts-on-flash/';
      case 'rwd':
        return 'https://alistapart.com/article/responsive-web-design/';
    }
  };

  const handleBookmarkClick = () => {
    sound.playCelebration();
    confetti({ particleCount: 35, spread: 60 });
    setBookmarked(!bookmarked);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* 2010 Era Header & Historical Description */}
      <div className="bg-gradient-to-r from-[#1c2333] to-[#0e131f] border border-[#2b354c] rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="px-3 py-1 bg-blue-500/20 text-blue-400 border border-blue-500/30 text-xs font-mono font-bold rounded-full">
              {era.year} • {era.eraName}
            </span>
            <span className="text-xs text-slate-400 font-mono">
              [THE SOCIAL GRAPH & THE RISE OF MOBILE]
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {era.tagline}
          </h2>
          <p className="text-sm text-slate-300 mt-2 max-w-3xl leading-relaxed">
            {era.description}
          </p>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-slate-800 text-xs font-mono">
            <div>
              <span className="text-slate-400 block text-[10px]">GLOBAL POPULATION</span>
              <strong className="text-amber-400 font-bold">{era.stats.webPopulation}</strong>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">AVERAGE BANDWIDTH</span>
              <strong className="text-cyan-400 font-bold">{era.stats.avgSpeed}</strong>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">TOP SITES</span>
              <strong className="text-emerald-400 font-bold truncate block">
                {era.stats.topWebsites.slice(0, 3).join(', ')}
              </strong>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">KEY TECHNOLOGIES</span>
              <strong className="text-purple-400 font-bold truncate block">
                HTML5, CSS3, jQuery, Node
              </strong>
            </div>
          </div>
        </div>
      </div>

      {/* Google Chrome 8 (2010) Browser Chrome Window */}
      <div className="rounded-xl overflow-hidden shadow-2xl border border-[#3e485e] bg-[#222733]">
        {/* Chrome Window Header & Angled Tabs */}
        <div className="bg-[#1b1f2b] pt-2 px-2 border-b border-[#2e3648] select-none">
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
            {/* Tab 1: Twitter */}
            <button
              onClick={() => {
                sound.playClick('click');
                setActiveTab('twitter');
              }}
              className={`px-3 py-1.5 text-xs rounded-t-lg font-medium transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'twitter'
                  ? 'bg-[#c0deed] text-[#333] font-bold shadow-sm'
                  : 'bg-[#282f42] text-slate-400 hover:text-slate-200 hover:bg-[#323a50]'
              }`}
            >
              <span>🐤</span>
              <span>New Twitter (2010)</span>
            </button>

            {/* Tab 2: Facebook */}
            <button
              onClick={() => {
                sound.playClick('click');
                setActiveTab('facebook');
              }}
              className={`px-3 py-1.5 text-xs rounded-t-lg font-medium transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'facebook'
                  ? 'bg-[#e9ebee] text-[#1c1e21] font-bold shadow-sm'
                  : 'bg-[#282f42] text-slate-400 hover:text-slate-200 hover:bg-[#323a50]'
              }`}
            >
              <span>👥</span>
              <span>Facebook & FarmVille</span>
            </button>

            {/* Tab 3: Angry Birds */}
            <button
              onClick={() => {
                sound.playClick('click');
                setActiveTab('angrybirds');
              }}
              className={`px-3 py-1.5 text-xs rounded-t-lg font-medium transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'angrybirds'
                  ? 'bg-[#2a2f3d] text-amber-400 font-bold shadow-sm'
                  : 'bg-[#282f42] text-slate-400 hover:text-slate-200 hover:bg-[#323a50]'
              }`}
            >
              <span>🎯</span>
              <span>Angry Birds Physics</span>
            </button>

            {/* Tab 4: Instagram */}
            <button
              onClick={() => {
                sound.playClick('click');
                setActiveTab('instagram');
              }}
              className={`px-3 py-1.5 text-xs rounded-t-lg font-medium transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'instagram'
                  ? 'bg-[#262626] text-white font-bold shadow-sm'
                  : 'bg-[#282f42] text-slate-400 hover:text-slate-200 hover:bg-[#323a50]'
              }`}
            >
              <span>📸</span>
              <span>Instagram Launch</span>
            </button>

            {/* Tab 5: Thoughts on Flash */}
            <button
              onClick={() => {
                sound.playClick('click');
                setActiveTab('flash');
              }}
              className={`px-3 py-1.5 text-xs rounded-t-lg font-medium transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'flash'
                  ? 'bg-[#10141d] text-white font-bold shadow-sm'
                  : 'bg-[#282f42] text-slate-400 hover:text-slate-200 hover:bg-[#323a50]'
              }`}
            >
              <span>⚡</span>
              <span>Thoughts on Flash</span>
            </button>

            {/* Tab 6: Responsive Design */}
            <button
              onClick={() => {
                sound.playClick('click');
                setActiveTab('rwd');
              }}
              className={`px-3 py-1.5 text-xs rounded-t-lg font-medium transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'rwd'
                  ? 'bg-[#181b24] text-white font-bold shadow-sm'
                  : 'bg-[#282f42] text-slate-400 hover:text-slate-200 hover:bg-[#323a50]'
              }`}
            >
              <span>📐</span>
              <span>Responsive Web Design</span>
            </button>
          </div>
        </div>

        {/* Chrome Navigation & Minimalist Omnibox */}
        <div className="bg-[#2a3040] px-3 py-2 border-b border-[#3b445a] flex items-center gap-2 select-none relative">
          {/* Back, Forward, Reload */}
          <div className="flex items-center gap-1 text-slate-400 text-xs">
            <button
              onClick={() => sound.playClick('click')}
              className="p-1 rounded hover:bg-white/10 hover:text-white"
              title="Back"
            >
              ◀
            </button>
            <button
              onClick={() => sound.playClick('click')}
              className="p-1 rounded hover:bg-white/10 hover:text-white"
              title="Forward"
            >
              ▶
            </button>
            <button
              onClick={() => sound.playClick('click')}
              className="p-1 rounded hover:bg-white/10 hover:text-white"
              title="Reload"
            >
              🔄
            </button>
          </div>

          {/* Minimalist Omnibox */}
          <div className="flex-1 flex items-center bg-white rounded-md px-2.5 py-1 text-xs text-[#222] shadow-inner font-mono">
            <span className="text-emerald-700 font-bold mr-1">🔒</span>
            <span className="flex-1 truncate">{getUrl()}</span>
            <button
              onClick={handleBookmarkClick}
              className={`hover:scale-125 transition-transform ${
                bookmarked ? 'text-amber-500' : 'text-slate-400'
              }`}
              title="Bookmark this page (Easter Egg!)"
            >
              {bookmarked ? '★' : '☆'}
            </button>
          </div>

          {/* 2010 Chrome Spanner / Wrench Menu */}
          <div className="relative">
            <button
              onClick={() => {
                sound.playClick('click');
                setShowSpannerMenu(!showSpannerMenu);
              }}
              className="p-1.5 rounded hover:bg-white/10 text-slate-300"
              title="Customize and control Google Chrome (Spanner Icon)"
            >
              🔧
            </button>

            {showSpannerMenu && (
              <div className="absolute right-0 top-full mt-1 w-52 bg-white text-slate-800 rounded-md shadow-2xl border border-slate-300 py-1 z-50 text-xs font-sans animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-1.5 font-bold border-b border-slate-100 text-slate-900">
                  Google Chrome 8.0 (2010)
                </div>
                <div className="px-3 py-1 hover:bg-blue-50 cursor-pointer">New tab (Ctrl+T)</div>
                <div className="px-3 py-1 hover:bg-blue-50 cursor-pointer">New incognito window</div>
                <div className="px-3 py-1 hover:bg-blue-50 cursor-pointer">Bookmarks & History</div>
                <div className="border-t border-slate-100 my-1" />
                <div className="px-3 py-1 hover:bg-blue-50 cursor-pointer">
                  Developer Tools (Web Inspector)
                </div>
                <div className="px-3 py-1 hover:bg-blue-50 cursor-pointer">Task Manager (Shift+Esc)</div>
                <div className="border-t border-slate-100 my-1" />
                <div className="px-3 py-1 text-slate-500 text-[11px]">WebKit 534.10 / V8 2.4.9</div>
              </div>
            )}
          </div>
        </div>

        {/* Tab Active Content Rendering */}
        <div>
          {activeTab === 'twitter' && <Twitter2010 />}
          {activeTab === 'facebook' && <Facebook2010 />}
          {activeTab === 'angrybirds' && <AngryBirds2010 />}
          {activeTab === 'instagram' && <Instagram2010 />}
          {activeTab === 'flash' && <Html5Showcase2010 />}
          {activeTab === 'rwd' && <ResponsiveDesign2010 />}
        </div>
      </div>
    </div>
  );
};
