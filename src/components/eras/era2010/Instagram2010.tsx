import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { sound } from '../../../utils/audio';

interface InstagramPost {
  id: string;
  author: string;
  avatar: string;
  imageUrl: string;
  filter: string;
  caption: string;
  likes: number;
  isLiked?: boolean;
  timestamp: string;
  comments: { author: string; text: string }[];
}

const SAMPLE_IMAGES = [
  {
    title: 'Artisan Latte Art',
    url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80'
  },
  {
    title: 'Vintage Fixie Bike',
    url: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=600&auto=format&fit=crop&q=80'
  },
  {
    title: 'Golden Gate Sunset',
    url: 'https://images.unsplash.com/photo-1506146332389-18140dc7b2fb?w=600&auto=format&fit=crop&q=80'
  },
  {
    title: 'Film Camera on Desk',
    url: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&auto=format&fit=crop&q=80'
  }
];

const FILTERS = [
  { id: 'normal', name: 'Normal', style: '' },
  {
    id: 'earlybird',
    name: 'Earlybird',
    style: 'sepia(0.4) contrast(1.25) brightness(0.9) saturate(1.1)'
  },
  {
    id: 'lofi',
    name: 'Lo-Fi',
    style: 'contrast(1.4) saturate(1.5) brightness(0.95)'
  },
  {
    id: 'xpro',
    name: 'X-Pro II',
    style: 'contrast(1.3) saturate(1.4) hue-rotate(-10deg) brightness(0.9)'
  },
  {
    id: 'valencia',
    name: 'Valencia',
    style: 'contrast(1.1) brightness(1.1) sepia(0.2) saturate(1.2)'
  },
  {
    id: '1977',
    name: '1977',
    style: 'contrast(1.1) brightness(1.1) hue-rotate(-15deg) saturate(1.3)'
  }
];

const INITIAL_POSTS: InstagramPost[] = [
  {
    id: 'ig-1',
    author: 'kevin',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    imageUrl: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=600&auto=format&fit=crop&q=80',
    filter: 'earlybird',
    caption: 'test. First photo ever uploaded to Instagram! Meet my dog at the taco stand in Todos Santos. #nofilter (wait, actually #earlybird)',
    likes: 4120,
    timestamp: 'October 6, 2010',
    comments: [
      { author: 'mikeyk', text: 'History in the making man!' },
      { author: 'jack', text: 'Congrats on the launch today guys.' }
    ]
  },
  {
    id: 'ig-2',
    author: 'hipster_barista',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80',
    filter: 'lofi',
    caption: 'Morning pour over at the local roastery. Square photos just feel so much more cinematic. ☕✨ #latteart #v60 #squarephotos',
    likes: 342,
    timestamp: '2 hours ago',
    comments: [{ author: 'coffee_lover', text: 'That crema looks absolutely perfect!' }]
  }
];

export const Instagram2010: React.FC = () => {
  const [posts, setPosts] = useState<InstagramPost[]>(INITIAL_POSTS);
  const [activeTab, setActiveTab] = useState<'feed' | 'studio'>('feed');

  // Studio State
  const [selectedImage, setSelectedImage] = useState(SAMPLE_IMAGES[0].url);
  const [selectedFilter, setSelectedFilter] = useState(FILTERS[1]); // Earlybird
  const [vignetteEnabled, setVignetteEnabled] = useState(true);
  const [tiltShiftEnabled, setTiltShiftEnabled] = useState(false);
  const [studioCaption, setStudioCaption] = useState('');
  const [likeAnimationId, setLikeAnimationId] = useState<string | null>(null);

  const handleDoubleTap = (postId: string) => {
    sound.playWeb20Pop();
    setLikeAnimationId(postId);
    setTimeout(() => setLikeAnimationId(null), 800);

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

  const handlePublishPhoto = (e: React.FormEvent) => {
    e.preventDefault();
    sound.playCameraShutter();
    confetti({ particleCount: 40, spread: 50 });

    const newPost: InstagramPost = {
      id: `ig-${Date.now()}`,
      author: 'vintage_snapper',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
      imageUrl: selectedImage,
      filter: selectedFilter.id,
      caption: studioCaption.trim() || 'Snapshot from my 2010 camera roll! #retrovibes',
      likes: 1,
      isLiked: true,
      timestamp: 'Just now',
      comments: []
    };

    setPosts([newPost, ...posts]);
    setActiveTab('feed');
    setStudioCaption('');
  };

  return (
    <div className="bg-[#262626] text-white font-sans min-h-[620px] rounded-b-xl overflow-hidden shadow-inner select-text">
      {/* 2010 Leather & Brushed Aluminum Polaroid Header */}
      <div className="bg-gradient-to-b from-[#383838] to-[#1c1c1c] border-b border-[#444] px-4 py-2.5 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          {/* Vintage Brown Leather Camera Icon */}
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#8b5a2b] to-[#4a2e12] border border-[#a8703d] flex items-center justify-center shadow">
            <div className="w-3.5 h-3.5 rounded-full bg-black border border-amber-300/60 flex items-center justify-center">
              <div className="w-1 h-1 rounded-full bg-blue-400" />
            </div>
          </div>
          <div>
            <h3 className="font-serif font-bold text-lg text-white leading-none tracking-tight">
              Instagram <span className="text-amber-400 text-xs font-sans font-normal">(Oct 2010)</span>
            </h3>
            <p className="text-[10px] text-slate-400">Capture and Share the World&apos;s Moments</p>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              sound.playClick('click');
              setActiveTab('feed');
            }}
            className={`px-3 py-1 rounded text-xs font-bold transition-all ${
              activeTab === 'feed'
                ? 'bg-amber-600 text-white shadow'
                : 'bg-[#333] hover:bg-[#444] text-slate-300'
            }`}
          >
            📸 Feed
          </button>
          <button
            onClick={() => {
              sound.playClick('click');
              setActiveTab('studio');
            }}
            className={`px-3 py-1 rounded text-xs font-bold transition-all ${
              activeTab === 'studio'
                ? 'bg-amber-600 text-white shadow'
                : 'bg-[#333] hover:bg-[#444] text-slate-300'
            }`}
          >
            🎨 Filter Studio
          </button>
        </div>
      </div>

      {/* Main Instagram Body */}
      <div className="max-w-xl mx-auto p-4">
        {activeTab === 'studio' ? (
          /* FILTER STUDIO CREATOR */
          <div className="bg-[#1a1a1a] rounded-xl p-4 border border-[#333] shadow-lg animate-in fade-in duration-200">
            <h4 className="font-bold text-sm text-amber-400 mb-3 flex items-center gap-2">
              <span>🎛️</span>
              <span>Polaroid Filter Studio & Camera</span>
            </h4>

            {/* Photo Canvas Preview */}
            <div className="relative aspect-square rounded-lg overflow-hidden bg-black border-2 border-[#444] shadow-inner mb-4 flex items-center justify-center">
              <img
                src={selectedImage}
                alt="Studio Preview"
                style={{ filter: selectedFilter.style }}
                className="w-full h-full object-cover transition-all duration-300"
              />

              {/* Vignette Overlay */}
              {vignetteEnabled && (
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background:
                      'radial-gradient(circle, transparent 55%, rgba(0,0,0,0.85) 100%)'
                  }}
                />
              )}

              {/* Tilt-Shift Lens Blur Overlay */}
              {tiltShiftEnabled && (
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    backdropFilter: 'blur(3px)',
                    maskImage:
                      'linear-gradient(to bottom, black 0%, transparent 35%, transparent 65%, black 100%)',
                    WebkitMaskImage:
                      'linear-gradient(to bottom, black 0%, transparent 35%, transparent 65%, black 100%)'
                  }}
                />
              )}

              {/* Filter Watermark */}
              <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-xs px-2 py-0.5 rounded text-[10px] font-mono text-amber-300 border border-white/10">
                {selectedFilter.name.toUpperCase()} FILTER
              </div>
            </div>

            {/* Image Picker */}
            <div className="mb-3">
              <span className="text-xs text-slate-400 block mb-1.5 font-bold">Pick a Photo:</span>
              <div className="grid grid-cols-4 gap-2">
                {SAMPLE_IMAGES.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      sound.playClick('click');
                      setSelectedImage(img.url);
                    }}
                    className={`aspect-square rounded overflow-hidden border-2 transition-all ${
                      selectedImage === img.url ? 'border-amber-400 ring-2 ring-amber-400/50' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img.url} alt={img.title} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Filter Selector Carousel */}
            <div className="mb-4">
              <span className="text-xs text-slate-400 block mb-1.5 font-bold">Choose 2010 Filter:</span>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {FILTERS.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => {
                      sound.playClick('click');
                      setSelectedFilter(f);
                    }}
                    className={`p-1.5 rounded text-center border transition-all ${
                      selectedFilter.id === f.id
                        ? 'bg-amber-600 border-amber-400 text-white font-bold'
                        : 'bg-[#2a2a2a] border-[#444] text-slate-300 hover:bg-[#333]'
                    }`}
                  >
                    <div className="text-xs">{f.name}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Lens Toggles */}
            <div className="flex gap-4 mb-4 text-xs">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={vignetteEnabled}
                  onChange={(e) => setVignetteEnabled(e.target.checked)}
                  className="rounded accent-amber-500"
                />
                <span>Vignette Border</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={tiltShiftEnabled}
                  onChange={(e) => setTiltShiftEnabled(e.target.checked)}
                  className="rounded accent-amber-500"
                />
                <span>Tilt-Shift Lens Blur</span>
              </label>
            </div>

            {/* Caption & Publish */}
            <form onSubmit={handlePublishPhoto} className="space-y-3">
              <input
                type="text"
                value={studioCaption}
                onChange={(e) => setStudioCaption(e.target.value)}
                placeholder="Write a caption... #vintage #2010"
                className="w-full text-xs p-2.5 bg-[#2a2a2a] border border-[#444] rounded text-white focus:outline-none focus:border-amber-400"
              />

              <button
                type="submit"
                className="w-full py-2 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 text-white font-bold rounded text-xs shadow-md transition-all flex items-center justify-center gap-2"
              >
                <span>📸</span>
                <span>Share to Feed</span>
              </button>
            </form>
          </div>
        ) : (
          /* FEED STREAM */
          <div className="space-y-6">
            {posts.map((post) => {
              const filterDef = FILTERS.find((f) => f.id === post.filter);

              return (
                <div
                  key={post.id}
                  className="bg-[#1a1a1a] rounded-xl border border-[#333] overflow-hidden shadow-lg"
                >
                  {/* Post User Header */}
                  <div className="p-3 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={post.avatar}
                        alt={post.author}
                        className="w-8 h-8 rounded-full object-cover border border-[#555]"
                      />
                      <span className="font-bold text-xs text-white hover:underline cursor-pointer">
                        {post.author}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400">{post.timestamp}</span>
                  </div>

                  {/* 1:1 Square Photo with Double-Tap */}
                  <div
                    onDoubleClick={() => handleDoubleTap(post.id)}
                    className="relative aspect-square bg-black cursor-pointer select-none overflow-hidden"
                  >
                    <img
                      src={post.imageUrl}
                      alt="Post"
                      style={{ filter: filterDef?.style || '' }}
                      className="w-full h-full object-cover"
                    />

                    {/* Double-Tap Heart Animation */}
                    {likeAnimationId === post.id && (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none animate-in zoom-in-50 fade-out-90 duration-700">
                        <span className="text-7xl text-red-500 drop-shadow-[0_4px_12px_rgba(255,0,0,0.8)]">
                          ❤️
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Actions & Caption */}
                  <div className="p-3.5 space-y-2 text-xs">
                    <div className="flex items-center gap-4 text-base">
                      <button
                        onClick={() => handleDoubleTap(post.id)}
                        className={`hover:scale-110 transition-transform ${
                          post.isLiked ? 'text-red-500' : 'text-slate-300'
                        }`}
                      >
                        {post.isLiked ? '❤️' : '🤍'}
                      </button>
                      <button className="text-slate-300 hover:scale-110 transition-transform">
                        💬
                      </button>
                    </div>

                    <div className="font-bold text-slate-200">
                      {post.likes.toLocaleString()} likes
                    </div>

                    <div className="leading-snug">
                      <strong className="text-white mr-1.5 cursor-pointer hover:underline">
                        {post.author}
                      </strong>
                      <span className="text-slate-300">{post.caption}</span>
                    </div>

                    {/* Comments */}
                    {post.comments.length > 0 && (
                      <div className="pt-1.5 space-y-1 text-slate-400 text-[11px]">
                        {post.comments.map((c, i) => (
                          <div key={i}>
                            <strong className="text-slate-300 mr-1">{c.author}</strong>
                            <span>{c.text}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
