import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { sound } from '../../../utils/audio';

interface FacebookPost {
  id: string;
  author: string;
  avatar: string;
  timestamp: string;
  content: string;
  image?: string;
  likes: number;
  isLiked?: boolean;
  comments: { id: string; author: string; avatar: string; text: string; time: string }[];
  isFarmVille?: boolean;
}

interface CropType {
  id: string;
  name: string;
  icon: string;
  growTimeSec: number;
  cost: number;
  revenue: number;
  xp: number;
}

const CROPS: CropType[] = [
  { id: 'strawberry', name: 'Strawberries', icon: '🍓', growTimeSec: 3, cost: 10, revenue: 35, xp: 5 },
  { id: 'wheat', name: 'Golden Wheat', icon: '🌾', growTimeSec: 6, cost: 25, revenue: 80, xp: 12 },
  { id: 'pumpkin', name: 'Giant Pumpkins', icon: '🎃', growTimeSec: 10, cost: 50, revenue: 160, xp: 25 }
];

interface Plot {
  id: number;
  state: 'grass' | 'plowed' | 'growing' | 'ready';
  crop?: CropType;
  plantedAt?: number;
}

const INITIAL_POSTS: FacebookPost[] = [
  {
    id: 'fb-1',
    author: 'Mark Zuckerberg',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    timestamp: '3 hours ago · 🌐',
    content:
      'As of this morning, 500 million people all around the world are actively using Facebook to stay connected with their friends and the people around them. Thank you for making this community what it is today!',
    likes: 84120,
    comments: [
      {
        id: 'c1',
        author: 'Sheryl Sandberg',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80',
        text: 'Incredible milestone for the team and our global community!',
        time: '2 hours ago'
      },
      {
        id: 'c2',
        author: 'Eduardo Saverin',
        avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&auto=format&fit=crop&q=80',
        text: 'Congrats Mark. A long journey from Kirkland House.',
        time: '1 hour ago'
      }
    ]
  },
  {
    id: 'fb-2',
    author: 'Sarah Jenkins',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
    timestamp: '4 hours ago · 🌐',
    content:
      '🌾 FarmVille: Sarah found a lonely Lost Cow wandering in her orchard! Would you like to adopt this cute cow and give it a home on your farm?',
    image: 'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?w=500&auto=format&fit=crop&q=80',
    likes: 19,
    isFarmVille: true,
    comments: [
      {
        id: 'c3',
        author: 'David Miller',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
        text: 'I adopted her! Sent you 500 fuel in return! Please send me fertilizer!!',
        time: '3 hours ago'
      }
    ]
  },
  {
    id: 'fb-3',
    author: 'Alex Rivera',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    timestamp: '6 hours ago via Facebook for iPhone · 🌐',
    content:
      'Just got the new iPhone 4! The Retina display is unbelievable... you literally cannot see the individual pixels with the human eye. Facetime with my brother in London worked without a hitch!',
    likes: 42,
    comments: [
      {
        id: 'c4',
        author: 'Jessica Wu',
        avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80',
        text: 'Just make sure you do not hold it on the bottom left corner antenna band haha #Antennagate',
        time: '5 hours ago'
      }
    ]
  }
];

export const Facebook2010: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'wall' | 'farmville'>('wall');
  const [posts, setPosts] = useState<FacebookPost[]>(INITIAL_POSTS);
  const [newStatus, setNewStatus] = useState('');
  const [commentInputs, setCommentInputs] = useState<{ [postId: string]: string }>({});

  // FarmVille State
  const [coins, setCoins] = useState(450);
  const [xp, setXp] = useState(85);
  const [level, setLevel] = useState(4);
  const [selectedCrop, setSelectedCrop] = useState<CropType>(CROPS[0]);
  const [selectedTool, setSelectedTool] = useState<'plow' | 'plant' | 'harvest'>('plant');
  const [plots, setPlots] = useState<Plot[]>([
    { id: 0, state: 'ready', crop: CROPS[0] },
    { id: 1, state: 'growing', crop: CROPS[1], plantedAt: Date.now() - 3000 },
    { id: 2, state: 'plowed' },
    { id: 3, state: 'grass' },
    { id: 4, state: 'ready', crop: CROPS[2] },
    { id: 5, state: 'growing', crop: CROPS[0], plantedAt: Date.now() - 2000 },
    { id: 6, state: 'plowed' },
    { id: 7, state: 'grass' },
    { id: 8, state: 'grass' },
    { id: 9, state: 'plowed' },
    { id: 10, state: 'ready', crop: CROPS[1] },
    { id: 11, state: 'grass' },
    { id: 12, state: 'grass' },
    { id: 13, state: 'grass' },
    { id: 14, state: 'plowed' },
    { id: 15, state: 'grass' }
  ]);

  const handlePostStatus = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStatus.trim()) return;

    sound.playFacebookDing();
    const createdPost: FacebookPost = {
      id: `post-${Date.now()}`,
      author: 'Temporal Explorer',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
      timestamp: 'Just now · 🌐',
      content: newStatus.trim(),
      likes: 0,
      comments: []
    };

    setPosts([createdPost, ...posts]);
    setNewStatus('');
  };

  const handleToggleLike = (postId: string) => {
    sound.playFacebookDing();
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const liked = !p.isLiked;
          return {
            ...p,
            isLiked: liked,
            likes: liked ? p.likes + 1 : p.likes - 1
          };
        }
        return p;
      })
    );
  };

  const handleAddComment = (postId: string, e: React.FormEvent) => {
    e.preventDefault();
    const text = commentInputs[postId];
    if (!text || !text.trim()) return;

    sound.playClick('click');
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          return {
            ...p,
            comments: [
              ...p.comments,
              {
                id: `c-${Date.now()}`,
                author: 'Temporal Explorer',
                avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
                text: text.trim(),
                time: 'Just now'
              }
            ]
          };
        }
        return p;
      })
    );

    setCommentInputs((prev) => ({ ...prev, [postId]: '' }));
  };

  // FarmVille Plot Click Handler
  const handlePlotClick = (plotId: number) => {
    const plot = plots.find((p) => p.id === plotId);
    if (!plot) return;

    if (plot.state === 'ready') {
      // Harvest crop!
      sound.playHarvestCoins();
      confetti({ particleCount: 25, spread: 45, origin: { y: 0.6 } });
      const rev = plot.crop ? plot.crop.revenue : 30;
      const gainedXp = plot.crop ? plot.crop.xp : 5;
      setCoins((c) => c + rev);
      const newXp = xp + gainedXp;
      setXp(newXp);
      if (newXp >= level * 100) {
        sound.playCelebration();
        setLevel((lvl) => lvl + 1);
      }

      setPlots((prev) =>
        prev.map((p) => (p.id === plotId ? { ...p, state: 'grass', crop: undefined } : p))
      );
      return;
    }

    if (selectedTool === 'plow' && plot.state === 'grass') {
      if (coins < 5) return;
      sound.playClick('dialup');
      setCoins((c) => c - 5);
      setXp((x) => x + 1);
      setPlots((prev) => prev.map((p) => (p.id === plotId ? { ...p, state: 'plowed' } : p)));
    } else if (selectedTool === 'plant' && plot.state === 'plowed') {
      if (coins < selectedCrop.cost) return;
      sound.playClick('bubble');
      setCoins((c) => c - selectedCrop.cost);
      setPlots((prev) =>
        prev.map((p) =>
          p.id === plotId
            ? { ...p, state: 'growing', crop: selectedCrop, plantedAt: Date.now() }
            : p
        )
      );

      // Auto-ready after crop growth time
      setTimeout(() => {
        setPlots((prev) =>
          prev.map((p) => (p.id === plotId ? { ...p, state: 'ready' } : p))
        );
      }, selectedCrop.growTimeSec * 1000);
    }
  };

  return (
    <div className="bg-[#e9ebee] text-[#1c1e21] font-sans min-h-[620px] rounded-b-xl overflow-hidden shadow-inner select-text">
      {/* 2010 Classic Facebook Blue Top Navigation */}
      <div className="bg-[#3b5998] text-white px-3 sm:px-6 py-1.5 flex items-center justify-between shadow border-b border-[#29487d]">
        <div className="flex items-center gap-3 sm:gap-6 flex-1 max-w-2xl">
          <span className="font-bold text-2xl tracking-tighter cursor-pointer hover:opacity-95">
            facebook
          </span>

          {/* Search Box */}
          <div className="relative flex-1 max-w-xs hidden sm:block">
            <input
              type="text"
              placeholder="Search..."
              className="w-full text-xs px-2.5 py-1 text-black bg-white rounded-sm focus:outline-none placeholder-slate-400"
            />
            <span className="absolute right-2 top-1.5 text-xs text-slate-400">🔍</span>
          </div>
        </div>

        {/* 2010 Social Icons & Profile Link */}
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-2 text-white/90">
            <span className="relative cursor-pointer hover:text-white" title="Friend Requests">
              👥
              <span className="absolute -top-1.5 -right-2 bg-red-600 text-white text-[9px] font-bold px-1 rounded-full">
                2
              </span>
            </span>
            <span className="relative cursor-pointer hover:text-white" title="Messages">
              💬
              <span className="absolute -top-1.5 -right-2 bg-red-600 text-white text-[9px] font-bold px-1 rounded-full">
                4
              </span>
            </span>
            <span className="relative cursor-pointer hover:text-white" title="Notifications">
              🌐
              <span className="absolute -top-1.5 -right-2 bg-red-600 text-white text-[9px] font-bold px-1 rounded-full">
                7
              </span>
            </span>
          </div>

          <div className="h-4 w-px bg-white/20 mx-1 hidden sm:block" />

          <div className="flex items-center gap-1.5 cursor-pointer hover:underline font-bold">
            <img
              src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80"
              alt="Profile"
              className="w-5 h-5 rounded-sm object-cover"
            />
            <span className="hidden sm:inline">Temporal</span>
          </div>
        </div>
      </div>

      {/* Main Facebook Body Grid */}
      <div className="max-w-6xl mx-auto p-3 sm:p-4 grid grid-cols-1 md:grid-cols-12 gap-3">
        {/* Left Sidebar (3 cols) */}
        <div className="md:col-span-3 space-y-2 text-xs">
          <div className="bg-white rounded p-2.5 shadow-sm border border-[#ccd0d5] space-y-1">
            <button
              onClick={() => {
                sound.playClick('click');
                setActiveTab('wall');
              }}
              className={`w-full text-left px-2 py-1.5 rounded flex items-center gap-2 font-semibold transition-all ${
                activeTab === 'wall'
                  ? 'bg-[#eceff5] text-[#3b5998] font-bold'
                  : 'hover:bg-slate-50 text-[#333]'
              }`}
            >
              <span>📰</span>
              <span>News Feed</span>
            </button>

            <button
              onClick={() => {
                sound.playClick('click');
                setActiveTab('farmville');
              }}
              className={`w-full text-left px-2 py-1.5 rounded flex items-center justify-between font-semibold transition-all ${
                activeTab === 'farmville'
                  ? 'bg-[#ebfaeb] text-emerald-800 font-bold border border-emerald-300'
                  : 'hover:bg-slate-50 text-[#333]'
              }`}
            >
              <div className="flex items-center gap-2">
                <span>🌾</span>
                <span>FarmVille (2010)</span>
              </div>
              <span className="bg-red-500 text-white text-[9px] px-1.5 py-0.5 rounded-full animate-pulse">
                HOT
              </span>
            </button>

            <div className="border-t border-slate-100 my-1 pt-1 space-y-1 text-slate-600">
              <div className="px-2 py-1 flex items-center gap-2 hover:bg-slate-50 rounded cursor-pointer">
                <span>💬</span>
                <span>Messages (4)</span>
              </div>
              <div className="px-2 py-1 flex items-center gap-2 hover:bg-slate-50 rounded cursor-pointer">
                <span>📅</span>
                <span>Events</span>
              </div>
              <div className="px-2 py-1 flex items-center gap-2 hover:bg-slate-50 rounded cursor-pointer">
                <span>📷</span>
                <span>Photos</span>
              </div>
              <div className="px-2 py-1 flex items-center gap-2 hover:bg-slate-50 rounded cursor-pointer">
                <span>👥</span>
                <span>Friends</span>
              </div>
            </div>
          </div>

          {/* 2010 Trending Facebook Ad */}
          <div className="bg-white rounded p-3 shadow-sm border border-[#ccd0d5] text-[11px] text-[#666]">
            <span className="font-bold uppercase text-[9px] text-[#999] tracking-wider block mb-1">
              Sponsored
            </span>
            <img
              src="https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=400&auto=format&fit=crop&q=80"
              alt="Smartwatch Proto"
              className="w-full h-24 object-cover rounded mb-1.5"
            />
            <strong className="text-[#3b5998] hover:underline cursor-pointer block text-xs">
              Pre-Order the iPad (1st Gen)
            </strong>
            <p className="mt-0.5 text-slate-500 leading-tight">
              A magical and revolutionary device at an unbelievable price. Starting at $499.
            </p>
          </div>
        </div>

        {/* Center Content Column (6 cols for Wall, or 9 cols for FarmVille) */}
        <div className={`${activeTab === 'farmville' ? 'md:col-span-9' : 'md:col-span-6'} space-y-3`}>
          {activeTab === 'farmville' ? (
            /* FARMVILLE 2010 MINI-GAME */
            <div className="bg-white rounded-lg shadow border border-[#ccd0d5] p-4 animate-in fade-in duration-200">
              {/* FarmVille Banner Header */}
              <div className="bg-gradient-to-r from-emerald-600 via-green-500 to-lime-500 rounded-lg p-3 text-white flex flex-wrap items-center justify-between gap-3 shadow-sm mb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-3xl">🚜</span>
                    <div>
                      <h3 className="font-bold text-lg sm:text-xl leading-none">FarmVille 2010</h3>
                      <p className="text-[11px] text-emerald-100 mt-0.5">
                        Zynga&apos;s 32M Daily Player Phenomenon • Plow, Seed & Harvest!
                      </p>
                    </div>
                  </div>
                </div>

                {/* Player HUD */}
                <div className="flex items-center gap-3 text-xs bg-black/25 px-3 py-1.5 rounded-lg border border-white/20">
                  <div className="flex items-center gap-1 font-bold text-amber-300">
                    <span>🪙</span>
                    <span>{coins} Coins</span>
                  </div>
                  <div className="flex items-center gap-1 font-bold text-blue-300">
                    <span>⭐</span>
                    <span>Level {level} ({xp} XP)</span>
                  </div>
                </div>
              </div>

              {/* Farm Tools & Crop Market Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4 bg-[#f7fafc] p-3 rounded-lg border border-slate-200 text-xs">
                {/* Tools */}
                <div>
                  <span className="font-bold text-slate-600 block mb-1.5">Select Farming Tool:</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        sound.playClick('click');
                        setSelectedTool('plow');
                      }}
                      className={`flex-1 py-1.5 px-2 rounded font-bold border transition-all flex items-center justify-center gap-1 ${
                        selectedTool === 'plow'
                          ? 'bg-amber-600 text-white border-amber-700 shadow-sm'
                          : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <span>⛏️</span>
                      <span>Plow (5c)</span>
                    </button>

                    <button
                      onClick={() => {
                        sound.playClick('click');
                        setSelectedTool('plant');
                      }}
                      className={`flex-1 py-1.5 px-2 rounded font-bold border transition-all flex items-center justify-center gap-1 ${
                        selectedTool === 'plant'
                          ? 'bg-emerald-600 text-white border-emerald-700 shadow-sm'
                          : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <span>🌱</span>
                      <span>Plant</span>
                    </button>
                  </div>
                </div>

                {/* Seed Crop Selector */}
                <div>
                  <span className="font-bold text-slate-600 block mb-1.5">Seed Market:</span>
                  <div className="grid grid-cols-3 gap-1.5">
                    {CROPS.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => {
                          sound.playClick('click');
                          setSelectedCrop(c);
                          setSelectedTool('plant');
                        }}
                        className={`p-1 rounded text-center border transition-all ${
                          selectedCrop.id === c.id
                            ? 'bg-emerald-100 border-emerald-500 font-bold text-emerald-900 shadow-xs'
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <div className="text-base">{c.icon}</div>
                        <div className="text-[10px] leading-tight truncate">{c.name}</div>
                        <div className="text-[9px] text-emerald-700 font-mono">-{c.cost}c</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* 4x4 Isometric-style Farm Grid */}
              <div className="bg-[#78b159] p-4 sm:p-6 rounded-xl border-4 border-[#5d9043] shadow-inner">
                <div className="grid grid-cols-4 gap-2.5 sm:gap-3 max-w-md mx-auto">
                  {plots.map((plot) => {
                    const isGrass = plot.state === 'grass';
                    const isPlowed = plot.state === 'plowed';
                    const isGrowing = plot.state === 'growing';
                    const isReady = plot.state === 'ready';

                    return (
                      <div
                        key={plot.id}
                        onClick={() => handlePlotClick(plot.id)}
                        className={`aspect-square rounded-lg border-2 cursor-pointer flex flex-col items-center justify-center relative transition-transform hover:scale-105 select-none shadow-sm ${
                          isGrass
                            ? 'bg-[#5c9e31] border-[#4b8227] hover:brightness-110'
                            : isPlowed
                            ? 'bg-[#8d5b36] border-[#653f22] hover:brightness-110'
                            : isGrowing
                            ? 'bg-[#6d4629] border-[#4c311c]'
                            : 'bg-[#96633b] border-amber-400 ring-2 ring-amber-300 animate-pulse'
                        }`}
                        title={
                          isGrass
                            ? 'Grass plot: Select Plow to dig soil'
                            : isPlowed
                            ? 'Plowed soil: Click with Plant tool to seed'
                            : isGrowing
                            ? `Growing ${plot.crop?.name}...`
                            : `READY TO HARVEST! Click to collect +${plot.crop?.revenue} coins!`
                        }
                      >
                        {isGrass && <span className="text-emerald-300 text-lg opacity-60">🌿</span>}
                        {isPlowed && (
                          <span className="text-amber-900/60 text-xs font-mono font-bold">SOIL</span>
                        )}
                        {isGrowing && (
                          <div className="text-center">
                            <span className="text-xl animate-bounce">🌱</span>
                            <div className="text-[9px] text-amber-200 font-bold mt-0.5">Growing</div>
                          </div>
                        )}
                        {isReady && (
                          <div className="text-center">
                            <span className="text-2xl animate-spin">{plot.crop?.icon}</span>
                            <div className="text-[10px] font-bold text-amber-300 bg-black/60 px-1 rounded mt-0.5">
                              HARVEST!
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="mt-4 p-2.5 bg-[#f5f8fa] border border-[#ccd0d5] rounded text-xs text-slate-600 flex items-center justify-between">
                <span>
                  Tip: Harvest crops when ripe to earn coins and XP. Reached Level 5 for the Barn!
                </span>
                <button
                  onClick={() => {
                    sound.playCelebration();
                    confetti({ particleCount: 50, spread: 60 });
                  }}
                  className="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-white rounded font-bold text-[11px] shadow"
                >
                  Send Farm Gift 🎁
                </button>
              </div>
            </div>
          ) : (
            /* NEWS FEED & WALL */
            <>
              {/* Publisher Box */}
              <div className="bg-white rounded shadow-sm border border-[#ccd0d5] p-3 text-xs">
                <div className="flex items-center gap-3 pb-2 border-b border-slate-100 font-bold text-[#3b5998]">
                  <span className="cursor-pointer hover:underline flex items-center gap-1">
                    ✏️ Update Status
                  </span>
                  <span className="text-slate-300">|</span>
                  <span className="cursor-pointer hover:underline flex items-center gap-1 text-slate-500">
                    📷 Add Photos
                  </span>
                </div>

                <form onSubmit={handlePostStatus} className="mt-2.5">
                  <div className="flex gap-2">
                    <img
                      src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80"
                      alt="Avatar"
                      className="w-8 h-8 rounded-sm object-cover"
                    />
                    <textarea
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value)}
                      placeholder="What's on your mind?"
                      rows={2}
                      className="w-full text-xs p-1.5 border border-slate-200 rounded focus:outline-none focus:border-[#3b5998] resize-none"
                    />
                  </div>

                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100">
                    <div className="flex items-center gap-1 text-slate-500 text-[11px]">
                      <span>🔒 Everyone</span>
                    </div>
                    <button
                      type="submit"
                      disabled={!newStatus.trim()}
                      className="px-4 py-1 bg-[#5b74a8] hover:bg-[#3b5998] disabled:bg-slate-300 text-white font-bold rounded text-xs shadow-xs transition-colors"
                    >
                      Share
                    </button>
                  </div>
                </form>
              </div>

              {/* Feed Items */}
              <div className="space-y-3">
                {posts.map((post) => (
                  <div
                    key={post.id}
                    className="bg-white rounded shadow-sm border border-[#ccd0d5] p-3 text-xs space-y-2"
                  >
                    <div className="flex items-center gap-2.5">
                      <img
                        src={post.avatar}
                        alt={post.author}
                        className="w-10 h-10 rounded-sm object-cover"
                      />
                      <div>
                        <h4 className="font-bold text-[#3b5998] hover:underline cursor-pointer">
                          {post.author}
                        </h4>
                        <span className="text-[11px] text-slate-400">{post.timestamp}</span>
                      </div>
                    </div>

                    <p className="text-slate-800 leading-normal text-xs whitespace-pre-line">
                      {post.content}
                    </p>

                    {post.image && (
                      <div className="rounded overflow-hidden border border-slate-200">
                        <img
                          src={post.image}
                          alt="Post Media"
                          className="w-full max-h-64 object-cover"
                        />
                      </div>
                    )}

                    {/* Like & Comment Bar */}
                    <div className="pt-2 border-t border-slate-100 flex items-center gap-4 text-[#3b5998] font-bold text-[11px]">
                      <button
                        onClick={() => handleToggleLike(post.id)}
                        className={`hover:underline flex items-center gap-1 ${
                          post.isLiked ? 'text-blue-600 font-extrabold' : ''
                        }`}
                      >
                        <span>👍</span>
                        <span>{post.isLiked ? 'Unlike' : 'Like'}</span>
                      </button>

                      <button className="hover:underline flex items-center gap-1 text-slate-600">
                        <span>💬</span>
                        <span>Comment</span>
                      </button>

                      <button className="hover:underline text-slate-600 ml-auto">Share</button>
                    </div>

                    {/* Likes counter indicator */}
                    {post.likes > 0 && (
                      <div className="bg-[#f2f4f7] px-2 py-1 rounded text-[11px] text-slate-600 flex items-center gap-1.5">
                        <span className="text-[#3b5998]">👍</span>
                        <span>
                          {post.isLiked ? 'You and ' : ''}
                          <strong>{post.likes} people</strong> like this.
                        </span>
                      </div>
                    )}

                    {/* Comments Section */}
                    {post.comments.length > 0 && (
                      <div className="space-y-1.5 pt-1">
                        {post.comments.map((comment) => (
                          <div
                            key={comment.id}
                            className="bg-[#f2f4f7] p-2 rounded flex gap-2 text-[11px]"
                          >
                            <img
                              src={comment.avatar}
                              alt={comment.author}
                              className="w-7 h-7 rounded-sm object-cover flex-shrink-0"
                            />
                            <div>
                              <strong className="text-[#3b5998] hover:underline cursor-pointer mr-1">
                                {comment.author}
                              </strong>
                              <span className="text-slate-700">{comment.text}</span>
                              <div className="text-[10px] text-slate-400 mt-0.5">{comment.time}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Comment Form */}
                    <form
                      onSubmit={(e) => handleAddComment(post.id, e)}
                      className="flex gap-2 pt-1"
                    >
                      <input
                        type="text"
                        value={commentInputs[post.id] || ''}
                        onChange={(e) =>
                          setCommentInputs({ ...commentInputs, [post.id]: e.target.value })
                        }
                        placeholder="Write a comment..."
                        className="flex-1 text-xs px-2 py-1 border border-slate-200 rounded focus:outline-none focus:border-[#3b5998]"
                      />
                      <button
                        type="submit"
                        disabled={!commentInputs[post.id]?.trim()}
                        className="px-3 py-1 bg-[#5b74a8] hover:bg-[#3b5998] disabled:bg-slate-200 text-white font-bold rounded text-xs transition-colors"
                      >
                        Post
                      </button>
                    </form>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Right Sidebar (3 cols, hidden when in FarmVille mode) */}
        {activeTab === 'wall' && (
          <div className="md:col-span-3 space-y-3 text-xs">
            {/* Birthday Widget */}
            <div className="bg-white rounded p-3 shadow-sm border border-[#ccd0d5]">
              <h5 className="font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                <span>🎂</span>
                <span>Birthdays</span>
              </h5>
              <p className="text-[11px] text-slate-500">
                <strong>Tom Anderson</strong> and <strong>2 others</strong> have birthdays today.
              </p>
            </div>

            {/* FarmVille Banner in Feed */}
            <div
              onClick={() => {
                sound.playClick('click');
                setActiveTab('farmville');
              }}
              className="bg-gradient-to-br from-emerald-500 to-green-600 text-white p-3 rounded-lg shadow-sm border border-emerald-600 cursor-pointer hover:brightness-105 transition-all"
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-2xl">🚜</span>
                <span className="font-bold text-sm">FarmVille 2010</span>
              </div>
              <p className="text-[11px] text-emerald-100 mb-2">
                Your strawberries are ready for harvest! Click to play now.
              </p>
              <span className="inline-block bg-white text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded shadow">
                Play Game ▶
              </span>
            </div>

            {/* Chat Friends List Simulator */}
            <div className="bg-white rounded p-3 shadow-sm border border-[#ccd0d5]">
              <h5 className="font-bold text-slate-700 mb-2 flex items-center justify-between text-xs">
                <span>Chat (Online - 5)</span>
                <span className="w-2 h-2 rounded-full bg-green-500" />
              </h5>
              <div className="space-y-1.5 text-[11px]">
                {['Mark Zuckerberg', 'Steve Jobs', 'Paul the Octopus', 'Sarah Jenkins'].map(
                  (friend, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between hover:bg-slate-50 p-1 rounded cursor-pointer"
                    >
                      <span className="text-slate-700 font-medium">{friend}</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
