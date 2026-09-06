import React, { useState, useRef, useCallback } from 'react';
import { sound } from '../../../utils/audio';

interface MapPin {
  id: string;
  letter: string;
  title: string;
  category: string;
  address: string;
  city: string;
  x: number; // Percent on map (0-100)
  y: number; // Percent on map (0-100)
  description: string;
  rating: string;
  icon: string;
}

const LANDMARKS: MapPin[] = [
  {
    id: 'googleplex',
    letter: 'A',
    title: 'Googleplex (Google HQ)',
    category: 'Technology Campus',
    address: '1600 Amphitheatre Pkwy',
    city: 'Mountain View, CA 94043',
    x: 48,
    y: 52,
    description: 'Global headquarters of Google LLC. Lava lamps, volleyball courts, and free chef lunches fueling the Web 2.0 AJAX revolution.',
    rating: '★★★★★ (4.9)',
    icon: '🌐'
  },
  {
    id: 'stanford',
    letter: 'B',
    title: 'Stanford University (Gates CS Bldg)',
    category: 'University Campus',
    address: '353 Jane Stanford Way',
    city: 'Stanford, CA 94305',
    x: 32,
    y: 38,
    description: 'Birthplace of Larry Page and Sergey Brin\'s BackRub algorithm and Yahoo! founders Jerry Yang and David Filo.',
    rating: '★★★★★ (4.8)',
    icon: '🌲'
  },
  {
    id: 'apple',
    letter: 'C',
    title: 'Apple Computer Inc.',
    category: 'Corporate Campus',
    address: '1 Infinite Loop',
    city: 'Cupertino, CA 95014',
    x: 64,
    y: 72,
    description: 'Where Steve Jobs and Jony Ive designed the original iPod Nano, Mac OS X Tiger, and the Power Mac G5.',
    rating: '★★★★★ (5.0)',
    icon: '🍏'
  },
  {
    id: 'garage',
    letter: 'D',
    title: 'HP Garage (Birthplace of Silicon Valley)',
    category: 'Historic Landmark',
    address: '367 Addison Ave',
    city: 'Palo Alto, CA 94301',
    x: 38,
    y: 44,
    description: 'Where Bill Hewlett and Dave Packard founded HP in 1939 with $538 in cash.',
    rating: '★★★★☆ (4.6)',
    icon: '🛠️'
  },
  {
    id: 'sandhill',
    letter: 'E',
    title: 'Sand Hill Road Venture Capital Row',
    category: 'Venture Capital',
    address: '2800 Sand Hill Rd',
    city: 'Menlo Park, CA 94025',
    x: 24,
    y: 32,
    description: 'Home to Kleiner Perkins and Sequoia Capital, the funding engines of Google, Yahoo!, and YouTube.',
    rating: '★★★★☆ (4.5)',
    icon: '💰'
  }
];

export const GoogleMaps2005: React.FC = () => {
  const [mapMode, setMapMode] = useState<'map' | 'satellite' | 'hybrid'>('map');
  const [zoom, setZoom] = useState<number>(3); // 1 (far) to 5 (close)
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [activePin, setActivePin] = useState<MapPin | null>(LANDMARKS[0]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showDirections, setShowDirections] = useState<boolean>(false);
  const [dirFrom, setDirFrom] = useState<string>('Stanford University (Gates CS Bldg)');
  const [dirTo, setDirTo] = useState<string>('Googleplex (Google HQ)');
  const [isCalculatingRoute, setIsCalculatingRoute] = useState<boolean>(false);
  const [routeCalculated, setRouteCalculated] = useState<boolean>(false);

  const mapContainerRef = useRef<HTMLDivElement>(null);

  // Mouse drag handlers for slippery map
  const handleMouseDown = (e: React.MouseEvent) => {
    // Ignore clicks on buttons or info window
    if ((e.target as HTMLElement).closest('.no-drag')) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
  };

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging) return;
    setPanOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  }, [isDragging, dragStart]);

  const handleMouseUp = () => {
    if (isDragging) {
      setIsDragging(false);
    }
  };

  const handlePan = (dx: number, dy: number) => {
    sound.playClick('bubble');
    setPanOffset((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
  };

  const handleZoom = (newZoom: number) => {
    sound.playClick('bubble');
    setZoom(Math.max(1, Math.min(5, newZoom)));
  };

  const handleSelectPin = (pin: MapPin) => {
    sound.playMapPin();
    setActivePin(pin);
    // Pan toward pin
    setPanOffset({
      x: (50 - pin.x) * 4,
      y: (50 - pin.y) * 4
    });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sound.playClick('bubble');
    const match = LANDMARKS.find(
      (l) =>
        l.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.city.toLowerCase().includes(searchQuery.toLowerCase())
    );
    if (match) {
      handleSelectPin(match);
    } else {
      alert(`No results found for "${searchQuery}" in 2005 Silicon Valley map index.`);
    }
  };

  const handleCalculateDirections = (e: React.FormEvent) => {
    e.preventDefault();
    sound.playWeb20Pop();
    setIsCalculatingRoute(true);
    setRouteCalculated(false);

    setTimeout(() => {
      setIsCalculatingRoute(false);
      setRouteCalculated(true);
      sound.playDigg();
    }, 450);
  };

  return (
    <div className="bg-[#f0f4f9] text-slate-800 font-sans border-2 border-[#6f8bb2] rounded-lg shadow-lg overflow-hidden flex flex-col">
      {/* 2005 Google Maps Header & Search Bar */}
      <div className="bg-[#e5ecf9] border-b border-[#abc2ea] p-3 flex flex-wrap items-center justify-between gap-3 select-none">
        <div className="flex items-center gap-2">
          {/* Authentic 2005 Google Logo with Maps */}
          <div className="text-xl font-bold tracking-tight">
            <span className="text-blue-600">G</span>
            <span className="text-red-600">o</span>
            <span className="text-amber-500">o</span>
            <span className="text-blue-600">g</span>
            <span className="text-green-600">l</span>
            <span className="text-red-600">e</span>
            <span className="text-slate-800 ml-1.5 font-serif font-normal text-lg">Maps</span>
            <span className="ml-1.5 text-[9px] bg-red-600 text-white px-1 rounded uppercase font-bold tracking-wider">
              BETA
            </span>
          </div>
        </div>

        {/* Tab Toggle: Search vs Driving Directions */}
        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={() => {
              sound.playClick('bubble');
              setShowDirections(false);
            }}
            className={`px-3 py-1 rounded font-bold border transition-colors ${
              !showDirections
                ? 'bg-white text-blue-900 border-[#abc2ea] shadow-xs'
                : 'bg-transparent text-slate-600 border-transparent hover:underline'
            }`}
          >
            Search Map
          </button>
          <button
            onClick={() => {
              sound.playClick('bubble');
              setShowDirections(true);
            }}
            className={`px-3 py-1 rounded font-bold border transition-colors ${
              showDirections
                ? 'bg-white text-blue-900 border-[#abc2ea] shadow-xs'
                : 'bg-transparent text-slate-600 border-transparent hover:underline'
            }`}
          >
            Get Directions
          </button>
        </div>

        {/* Search Bar */}
        {!showDirections ? (
          <form onSubmit={handleSearchSubmit} className="flex items-center gap-1">
            <input
              type="text"
              placeholder="e.g. Googleplex, Stanford, Apple..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-2 py-1 text-xs border border-[#7f9db9] rounded bg-white focus:outline-none w-48 sm:w-64 shadow-inner"
            />
            <button
              type="submit"
              className="px-3 py-1 bg-gradient-to-b from-[#f2f2f2] to-[#dddddd] hover:brightness-105 border border-[#7f9db9] rounded text-xs font-bold text-slate-700 shadow-xs"
            >
              Search
            </button>
          </form>
        ) : null}
      </div>

      {/* Main Body: Directions Sidebar + Map Canvas */}
      <div className="flex flex-col md:flex-row h-[550px] relative">
        {/* Directions Sidebar (when opened) */}
        {showDirections && (
          <div className="w-full md:w-80 bg-white border-r border-[#abc2ea] p-3 overflow-y-auto flex flex-col gap-3 shrink-0 z-20 shadow-md">
            <h3 className="font-bold text-xs text-[#0000cc] border-b border-slate-200 pb-1 flex items-center gap-1">
              <span>🚗</span>
              <span>Driving Directions (AJAX Calculated)</span>
            </h3>

            <form onSubmit={handleCalculateDirections} className="space-y-2 text-xs">
              <div>
                <label className="font-bold block text-slate-600 mb-0.5">Start address (A):</label>
                <select
                  value={dirFrom}
                  onChange={(e) => setDirFrom(e.target.value)}
                  className="w-full border border-slate-300 p-1 rounded text-xs"
                >
                  {LANDMARKS.map((l) => (
                    <option key={l.id} value={l.title}>
                      [{l.letter}] {l.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold block text-slate-600 mb-0.5">End address (B):</label>
                <select
                  value={dirTo}
                  onChange={(e) => setDirTo(e.target.value)}
                  className="w-full border border-slate-300 p-1 rounded text-xs"
                >
                  {LANDMARKS.map((l) => (
                    <option key={l.id} value={l.title}>
                      [{l.letter}] {l.title}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                disabled={isCalculatingRoute}
                className="w-full py-1.5 bg-gradient-to-b from-[#2b64a8] to-[#1e487a] hover:from-[#3577c4] hover:to-[#225591] text-white font-bold rounded shadow-xs text-xs"
              >
                {isCalculatingRoute ? 'Calculating route...' : 'Get Directions'}
              </button>
            </form>

            {/* Route Steps Result */}
            {routeCalculated && (
              <div className="space-y-2 text-xs border-t border-slate-200 pt-2 animate-fadeIn">
                <div className="bg-emerald-50 border border-emerald-200 p-2 rounded text-[11px] text-emerald-900 font-semibold">
                  Distance: <strong>6.8 miles</strong> (Approx. <strong>12 mins</strong> without traffic)
                </div>

                <div className="space-y-1.5 text-[11px] text-slate-700">
                  <div className="flex gap-2">
                    <span className="font-bold text-slate-400">1.</span>
                    <span>Head southeast toward Campus Dr</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="font-bold text-slate-400">2.</span>
                    <span>Turn left onto El Camino Real (CA-82 S)</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="font-bold text-slate-400">3.</span>
                    <span>Merge onto US-101 S via ramp to San Jose</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="font-bold text-slate-400">4.</span>
                    <span>Take exit 398 for Shoreline Blvd toward Amphitheatre</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="font-bold text-slate-400">5.</span>
                    <span>Turn right onto Amphitheatre Pkwy &mdash; Destination on right</span>
                  </div>
                </div>

                <button
                  onClick={() => window.print()}
                  className="text-[10px] text-[#0000cc] hover:underline block pt-1 font-semibold"
                >
                  🖨️ Print driving directions
                </button>
              </div>
            )}

            {/* Landmark Fast-Jump List */}
            <div className="pt-2 border-t border-slate-200">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                Explore Landmarks:
              </span>
              <div className="space-y-1">
                {LANDMARKS.map((lm) => (
                  <button
                    key={lm.id}
                    onClick={() => handleSelectPin(lm)}
                    className="w-full text-left p-1 rounded hover:bg-blue-50 text-[11px] flex items-center gap-1.5 text-slate-700"
                  >
                    <span className="w-4 h-4 bg-red-600 text-white rounded-full font-bold text-[9px] flex items-center justify-center shrink-0">
                      {lm.letter}
                    </span>
                    <span className="truncate">{lm.title}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Slippery Map Viewport Container */}
        <div
          ref={mapContainerRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          className={`flex-1 relative overflow-hidden select-none ${
            isDragging ? 'cursor-grabbing' : 'cursor-grab'
          }`}
          style={{
            backgroundColor: mapMode === 'satellite' ? '#122616' : mapMode === 'hybrid' ? '#1c2e1f' : '#aad3df'
          }}
        >
          {/* Draggable Canvas World Layer */}
          <div
            className="absolute inset-0 transition-transform duration-75"
            style={{
              transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${1 + (zoom - 3) * 0.25})`,
              transformOrigin: 'center center'
            }}
          >
            {/* Authentic Map Background Graphic / Tiles Simulation */}
            <div
              className={`w-[1600px] h-[1200px] absolute -top-[300px] -left-[400px] ${
                mapMode === 'satellite'
                  ? 'bg-[radial-gradient(#2d5a34_2px,#16351b_2px)] bg-[size:40px_40px]'
                  : mapMode === 'hybrid'
                  ? 'bg-[radial-gradient(#2d5a34_2px,#1b3b20_2px)] bg-[size:30px_30px]'
                  : 'bg-[radial-gradient(#e1e7ec_2px,#f4f3f0_2px)] bg-[size:28px_28px]'
              }`}
            >
              {/* Simulated Bay Area Water Body */}
              <div
                className={`absolute top-0 right-0 w-[550px] h-[750px] rounded-bl-[200px] border-l-4 ${
                  mapMode === 'map'
                    ? 'bg-[#a3ccff] border-[#81b2ed]'
                    : 'bg-[#0f2838] border-[#18394e]'
                }`}
              >
                <span className="absolute bottom-24 left-24 font-serif italic text-sm font-bold opacity-60 text-blue-900 tracking-wider">
                  San Francisco South Bay
                </span>
              </div>

              {/* Simulated Highways (US-101, I-280, CA-85) */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-85">
                {/* US-101 Freeway */}
                <path
                  d="M 100 100 Q 600 500 1400 900"
                  fill="none"
                  stroke={mapMode === 'map' ? '#ff9900' : '#d49b3d'}
                  strokeWidth="8"
                />
                <path
                  d="M 100 100 Q 600 500 1400 900"
                  fill="none"
                  stroke={mapMode === 'map' ? '#ffe066' : '#f7cb59'}
                  strokeWidth="4"
                />

                {/* Interstate 280 */}
                <path
                  d="M 150 300 Q 500 700 1300 1100"
                  fill="none"
                  stroke={mapMode === 'map' ? '#3388ff' : '#4d9eff'}
                  strokeWidth="7"
                />
                <path
                  d="M 150 300 Q 500 700 1300 1100"
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="3"
                />

                {/* Local Street Grid Lines */}
                <line x1="300" y1="200" x2="1100" y2="200" stroke="#d5d5d5" strokeWidth="3" />
                <line x1="200" y1="450" x2="1200" y2="450" stroke="#d5d5d5" strokeWidth="3" />
                <line x1="300" y1="750" x2="1100" y2="750" stroke="#d5d5d5" strokeWidth="3" />
                <line x1="500" y1="100" x2="500" y2="1000" stroke="#d5d5d5" strokeWidth="3" />
                <line x1="850" y1="100" x2="850" y2="1000" stroke="#d5d5d5" strokeWidth="3" />

                {/* Simulated Direction Navigation Line when Route Calculated */}
                {routeCalculated && (
                  <path
                    d="M 520 450 Q 680 500 780 620"
                    fill="none"
                    stroke="#4385f5"
                    strokeWidth="6"
                    strokeDasharray="8 4"
                    className="animate-pulse"
                  />
                )}
              </svg>

              {/* Highway Label Badges */}
              <div className="absolute top-[280px] left-[520px] bg-[#1a4a8a] text-white border border-white font-mono text-[9px] font-bold px-1 rounded shadow">
                US-101
              </div>
              <div className="absolute top-[520px] left-[420px] bg-[#1a4a8a] text-white border border-white font-mono text-[9px] font-bold px-1 rounded shadow">
                I-280
              </div>

              {/* Landmark Pushpins */}
              {LANDMARKS.map((lm) => {
                const isSelected = activePin?.id === lm.id;
                return (
                  <div
                    key={lm.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectPin(lm);
                    }}
                    className="absolute cursor-pointer group no-drag transition-transform hover:scale-125"
                    style={{
                      left: `${300 + lm.x * 8}px`,
                      top: `${200 + lm.y * 6}px`
                    }}
                  >
                    {/* Iconic 2005 Red Pushpin */}
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-7 h-7 rounded-full text-white font-bold text-xs flex items-center justify-center shadow-lg border-2 border-white ${
                          isSelected ? 'bg-red-700 ring-2 ring-amber-400 scale-110' : 'bg-red-600'
                        }`}
                      >
                        {lm.letter}
                      </div>
                      <div className="w-1.5 h-3 bg-red-700 -mt-0.5 rounded-b-sm" />
                      <div className="w-2.5 h-1 bg-black/40 rounded-full blur-xs" />
                    </div>

                    {/* Pin Label Hover Tooltip */}
                    <div className="absolute top-8 left-1/2 -translate-x-1/2 bg-white/95 text-slate-800 text-[10px] font-bold px-2 py-0.5 rounded shadow border border-slate-300 whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity">
                      {lm.title}
                    </div>
                  </div>
                );
              })}

              {/* Iconic 2005 Info Window Speech Bubble */}
              {activePin && (
                <div
                  className="absolute no-drag z-30 bg-white border border-[#ababab] rounded-lg p-3 shadow-2xl w-64 text-xs space-y-2 select-text"
                  style={{
                    left: `${240 + activePin.x * 8}px`,
                    top: `${70 + activePin.y * 6}px`
                  }}
                >
                  {/* Bubble Pointer Arrow */}
                  <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-0 h-0 border-x-8 border-x-transparent border-t-8 border-t-white" />

                  {/* Header & Close Button */}
                  <div className="flex items-start justify-between gap-1 border-b border-slate-100 pb-1.5">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xl">{activePin.icon}</span>
                      <h4 className="font-bold text-slate-900 leading-tight">
                        {activePin.title}
                      </h4>
                    </div>
                    <button
                      onClick={() => setActivePin(null)}
                      className="text-slate-400 hover:text-black font-bold text-xs"
                    >
                      ✕
                    </button>
                  </div>

                  {/* Address & Rating */}
                  <div className="text-[11px] text-slate-600 leading-tight">
                    <p>{activePin.address}</p>
                    <p>{activePin.city}</p>
                    <p className="text-amber-600 font-bold mt-0.5">{activePin.rating}</p>
                  </div>

                  {/* Description */}
                  <p className="text-[10px] text-slate-500 italic bg-slate-50 p-1.5 rounded border border-slate-100">
                    {activePin.description}
                  </p>

                  {/* Directions Links */}
                  <div className="text-[11px] text-[#0000cc] pt-1 flex items-center justify-between border-t border-slate-100 font-semibold">
                    <span
                      onClick={() => {
                        setShowDirections(true);
                        setDirTo(activePin.title);
                        sound.playClick('bubble');
                      }}
                      className="hover:underline cursor-pointer"
                    >
                      Directions: To here
                    </span>
                    <span>&bull;</span>
                    <span
                      onClick={() => {
                        setShowDirections(true);
                        setDirFrom(activePin.title);
                        sound.playClick('bubble');
                      }}
                      className="hover:underline cursor-pointer"
                    >
                      From here
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Navigation Controls (Top Left Corner of Map) */}
          <div className="absolute top-3 left-3 z-10 flex flex-col items-center gap-1.5 no-drag bg-white/90 backdrop-blur-xs p-1.5 rounded-lg border border-slate-400/60 shadow-md">
            {/* Pan Compass Rose */}
            <div className="w-16 h-16 relative bg-[#f7f7f7] border border-slate-300 rounded-full flex items-center justify-center shadow-inner">
              <button
                onClick={() => handlePan(0, 60)}
                className="absolute top-0.5 left-1/2 -translate-x-1/2 text-slate-700 hover:text-black text-xs font-bold"
                title="Pan North"
              >
                ▲
              </button>
              <button
                onClick={() => handlePan(-60, 0)}
                className="absolute left-0.5 top-1/2 -translate-y-1/2 text-slate-700 hover:text-black text-xs font-bold"
                title="Pan West"
              >
                ◀
              </button>
              <button
                onClick={() => handlePan(60, 0)}
                className="absolute right-0.5 top-1/2 -translate-y-1/2 text-slate-700 hover:text-black text-xs font-bold"
                title="Pan East"
              >
                ▶
              </button>
              <button
                onClick={() => handlePan(0, -60)}
                className="absolute bottom-0.5 left-1/2 -translate-x-1/2 text-slate-700 hover:text-black text-xs font-bold"
                title="Pan South"
              >
                ▼
              </button>
              <button
                onClick={() => setPanOffset({ x: 0, y: 0 })}
                className="w-4 h-4 rounded-full bg-slate-300 hover:bg-slate-400 text-[8px] flex items-center justify-center font-mono"
                title="Center Map"
              >
                •
              </button>
            </div>

            {/* Zoom Slider */}
            <div className="flex flex-col items-center gap-1 pt-1">
              <button
                onClick={() => handleZoom(zoom + 1)}
                className="w-6 h-6 rounded bg-slate-100 hover:bg-slate-200 border border-slate-300 font-bold text-xs shadow-xs"
                title="Zoom In"
              >
                +
              </button>
              <div className="w-2 h-20 bg-slate-200 rounded-full relative flex items-center justify-center border border-slate-300">
                <div
                  className="w-4 h-2.5 bg-[#2b64a8] rounded border border-white shadow absolute transition-all"
                  style={{ top: `${(5 - zoom) * 20}%` }}
                />
              </div>
              <button
                onClick={() => handleZoom(zoom - 1)}
                className="w-6 h-6 rounded bg-slate-100 hover:bg-slate-200 border border-slate-300 font-bold text-xs shadow-xs"
                title="Zoom Out"
              >
                -
              </button>
            </div>
          </div>

          {/* Map View Mode Toggles (Top Right Corner of Map) */}
          <div className="absolute top-3 right-3 z-10 no-drag flex rounded border border-[#7f9db9] shadow-md overflow-hidden bg-white text-xs font-bold">
            <button
              onClick={() => {
                sound.playClick('bubble');
                setMapMode('map');
              }}
              className={`px-3 py-1 transition-colors ${
                mapMode === 'map'
                  ? 'bg-gradient-to-b from-[#2b64a8] to-[#1e487a] text-white'
                  : 'bg-white hover:bg-slate-100 text-slate-700'
              }`}
            >
              Map
            </button>
            <button
              onClick={() => {
                sound.playClick('bubble');
                setMapMode('satellite');
              }}
              className={`px-3 py-1 border-x border-[#7f9db9] transition-colors ${
                mapMode === 'satellite'
                  ? 'bg-gradient-to-b from-[#2b64a8] to-[#1e487a] text-white'
                  : 'bg-white hover:bg-slate-100 text-slate-700'
              }`}
            >
              Satellite
            </button>
            <button
              onClick={() => {
                sound.playClick('bubble');
                setMapMode('hybrid');
              }}
              className={`px-3 py-1 transition-colors ${
                mapMode === 'hybrid'
                  ? 'bg-gradient-to-b from-[#2b64a8] to-[#1e487a] text-white'
                  : 'bg-white hover:bg-slate-100 text-slate-700'
              }`}
            >
              Hybrid
            </button>
          </div>

          {/* Bottom Copyright & Scale Bar */}
          <div className="absolute bottom-1 right-2 z-10 text-[9px] text-slate-600 bg-white/80 px-2 py-0.5 rounded shadow-xs font-mono">
            Map data &copy; 2005 NAVTEQ™ &bull; Google Maps Engine v1.0
          </div>
        </div>
      </div>
    </div>
  );
};
