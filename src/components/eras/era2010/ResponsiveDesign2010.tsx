import React, { useState } from 'react';
import { sound } from '../../../utils/audio';

type DeviceMode = 'desktop' | 'ipad-portrait' | 'ipad-landscape' | 'iphone4';

export const ResponsiveDesign2010: React.FC = () => {
  const [device, setDevice] = useState<DeviceMode>('desktop');
  const [customWidth, setCustomWidth] = useState(100); // % of container

  const getWidthClass = () => {
    switch (device) {
      case 'desktop':
        return 'max-w-4xl';
      case 'ipad-landscape':
        return 'max-w-2xl';
      case 'ipad-portrait':
        return 'max-w-lg';
      case 'iphone4':
        return 'max-w-xs';
    }
  };

  const getActiveMediaQuery = () => {
    switch (device) {
      case 'desktop':
        return '@media screen and (min-width: 1024px)';
      case 'ipad-landscape':
        return '@media screen and (min-width: 769px) and (max-width: 1023px)';
      case 'ipad-portrait':
        return '@media screen and (min-width: 481px) and (max-width: 768px)';
      case 'iphone4':
        return '@media screen and (max-width: 480px)';
    }
  };

  return (
    <div className="bg-[#181b24] text-slate-200 font-sans min-h-[620px] rounded-b-xl p-4 sm:p-6 shadow-inner select-text">
      {/* RWD 2010 Pioneer Header */}
      <div className="max-w-4xl mx-auto mb-6 bg-gradient-to-r from-slate-900 to-indigo-950/80 border-l-4 border-cyan-400 rounded-r-xl p-4 shadow-md">
        <div className="flex items-center gap-2 mb-1.5 text-xs text-cyan-400 font-bold uppercase tracking-wider">
          <span>📐</span>
          <span>A List Apart • May 25, 2010</span>
        </div>
        <h3 className="text-xl sm:text-2xl font-serif font-bold text-white mb-2">
          Ethan Marcotte Coins &quot;Responsive Web Design&quot;
        </h3>
        <p className="text-xs sm:text-sm text-slate-300 italic leading-relaxed">
          &ldquo;Fluid grids, flexible images, and media queries: three technical ingredients for
          responsive web design... Now, more than ever, we’re designing work meant to be viewed along
          a gradient of different experiences.&rdquo;
        </p>
      </div>

      {/* Device Switcher Controls */}
      <div className="max-w-4xl mx-auto mb-6 bg-slate-900/90 p-3 rounded-xl border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="text-slate-400 font-bold">Simulate Device:</span>
          <button
            onClick={() => {
              sound.playClick('click');
              setDevice('desktop');
            }}
            className={`px-3 py-1.5 rounded font-medium border transition-all flex items-center gap-1.5 ${
              device === 'desktop'
                ? 'bg-cyan-600 text-white border-cyan-400 font-bold shadow'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
          >
            <span>🖥️</span>
            <span>Desktop (1280px)</span>
          </button>

          <button
            onClick={() => {
              sound.playClick('click');
              setDevice('ipad-landscape');
            }}
            className={`px-3 py-1.5 rounded font-medium border transition-all flex items-center gap-1.5 ${
              device === 'ipad-landscape'
                ? 'bg-cyan-600 text-white border-cyan-400 font-bold shadow'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
          >
            <span>📱</span>
            <span>iPad (1024px)</span>
          </button>

          <button
            onClick={() => {
              sound.playClick('click');
              setDevice('ipad-portrait');
            }}
            className={`px-3 py-1.5 rounded font-medium border transition-all flex items-center gap-1.5 ${
              device === 'ipad-portrait'
                ? 'bg-cyan-600 text-white border-cyan-400 font-bold shadow'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
          >
            <span>📱</span>
            <span>iPad Portrait (768px)</span>
          </button>

          <button
            onClick={() => {
              sound.playClick('click');
              setDevice('iphone4');
            }}
            className={`px-3 py-1.5 rounded font-medium border transition-all flex items-center gap-1.5 ${
              device === 'iphone4'
                ? 'bg-cyan-600 text-white border-cyan-400 font-bold shadow'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
          >
            <span>📲</span>
            <span>iPhone 4 (320px Retina)</span>
          </button>
        </div>

        {/* Active Media Query Badge */}
        <div className="bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 px-2.5 py-1 rounded font-mono text-[11px]">
          {getActiveMediaQuery()}
        </div>
      </div>

      {/* Simulated Device Frame Container */}
      <div className="flex justify-center transition-all duration-300 ease-out">
        <div
          className={`w-full ${getWidthClass()} transition-all duration-300 ease-out bg-slate-900 border-4 border-slate-700 rounded-2xl shadow-2xl overflow-hidden`}
        >
          {/* Simulated Browser Viewport Header */}
          <div className="bg-slate-800 px-3 py-2 border-b border-slate-700 flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500 inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-green-500 inline-block" />
              <span className="font-mono text-[11px] text-slate-300 ml-2">
                viewport: {device === 'desktop' ? '1280px' : device === 'ipad-landscape' ? '1024px' : device === 'ipad-portrait' ? '768px' : '320px'}
              </span>
            </div>
            <span className="text-[10px] text-cyan-400 font-mono font-bold">RWD ENGINE</span>
          </div>

          {/* Responsive Web Page Content */}
          <div className="p-4 sm:p-6 bg-slate-950 text-slate-200">
            {/* Fluid Header */}
            <div className="border-b border-slate-800 pb-4 mb-4 flex flex-wrap items-center justify-between gap-2">
              <div>
                <h4 className="text-lg font-bold text-white tracking-tight">The Modern Web Journal</h4>
                <p className="text-xs text-slate-400">Published in the dawn of responsive layout</p>
              </div>
              <div className="flex gap-3 text-xs text-cyan-400 font-medium">
                <span className="hover:underline cursor-pointer">Articles</span>
                <span className="hover:underline cursor-pointer">Topics</span>
                <span className="hover:underline cursor-pointer">About</span>
              </div>
            </div>

            {/* Responsive Grid Columns (Flex/Grid adapting to viewport) */}
            <div
              className={`grid gap-4 ${
                device === 'desktop'
                  ? 'grid-cols-3'
                  : device === 'ipad-landscape'
                  ? 'grid-cols-3'
                  : device === 'ipad-portrait'
                  ? 'grid-cols-2'
                  : 'grid-cols-1'
              }`}
            >
              <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 space-y-2">
                <div className="h-28 bg-gradient-to-br from-cyan-900/60 to-blue-900/60 rounded flex items-center justify-center text-3xl">
                  🌐
                </div>
                <h5 className="font-bold text-white text-xs">1. Fluid Grids</h5>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Abandoning pixel-locked rigid 960px layouts for proportional percentage formulas:
                  `target ÷ context = result`.
                </p>
              </div>

              <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 space-y-2">
                <div className="h-28 bg-gradient-to-br from-emerald-900/60 to-teal-900/60 rounded flex items-center justify-center text-3xl">
                  🖼️
                </div>
                <h5 className="font-bold text-white text-xs">2. Flexible Images</h5>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Setting `img &#123; max-width: 100%; height: auto; &#125;` ensures visual media
                  effortlessly scales within any container width.
                </p>
              </div>

              <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 space-y-2">
                <div className="h-28 bg-gradient-to-br from-purple-900/60 to-indigo-900/60 rounded flex items-center justify-center text-3xl">
                  📱
                </div>
                <h5 className="font-bold text-white text-xs">3. CSS3 Media Queries</h5>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Targeting specific device characteristics and resolutions with `@media` rules
                  instead of building separate `m.domain.com` websites.
                </p>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-500 flex justify-between">
              <span>One URL. One Codebase. Infinite Devices.</span>
              <span>© 2010 A List Apart</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
