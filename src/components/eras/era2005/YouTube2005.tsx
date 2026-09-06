import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { sound } from '../../../utils/audio';

export interface YouTubeVideo {
  id: string;
  title: string;
  author: string;
  views: number;
  duration: string;
  rating: number; // 1-5
  ratingsCount: number;
  userRating?: number;
  uploadDate: string;
  description: string;
  category: string;
  tags: string[];
  thumbnail: string;
  aspectColor: string;
  comments: { id: string; author: string; text: string; time: string; likes: number }[];
}

const INITIAL_VIDEOS: YouTubeVideo[] = [
  {
    id: 'jawed',
    title: 'Me at the zoo',
    author: 'jawed',
    views: 4829100,
    duration: '0:19',
    rating: 4.8,
    ratingsCount: 14230,
    uploadDate: 'Apr 23, 2005',
    description: 'The first video on YouTube. Standing in front of the elephants at the San Diego Zoo. The cool thing about these guys is that they have really, really, really long trunks.',
    category: 'People & Blogs',
    tags: ['first', 'zoo', 'elephants', 'jawed', 'san diego'],
    thumbnail: '🐘',
    aspectColor: '#2b331f',
    comments: [
      { id: 'c1', author: 'ele_fan99', text: 'History right here!! First video ever on youtube!', time: '1 hour ago', likes: 142 },
      { id: 'c2', author: 'dsl_surfer', text: 'Flash video streaming is crazy fast compared to Windows Media Player.', time: '3 hours ago', likes: 58 },
      { id: 'c3', author: 'san_diego_kid', text: 'I know exactly which elephant exhibit this is lol', time: '1 day ago', likes: 23 }
    ]
  },
  {
    id: 'numanuma',
    title: 'Numa Numa Dance',
    author: 'GaryBrolsma',
    views: 7120300,
    duration: '1:39',
    rating: 4.9,
    ratingsCount: 28400,
    uploadDate: 'Dec 11, 2004',
    description: 'Gary Brolsma lip-syncing to Dragostea Din Tei by O-Zone on his webcam with headset on. Pure unadulterated web energy.',
    category: 'Entertainment',
    tags: ['numanuma', 'dance', 'ozone', 'webcam', 'viral'],
    thumbnail: '🎧',
    aspectColor: '#1e293b',
    comments: [
      { id: 'c4', author: 'ozone_fan', text: 'MAI-A-HEE, MAI-A-HOO, MAI-A-HA, MAI-A-HAHA!!', time: '2 hours ago', likes: 310 },
      { id: 'c5', author: 'webcam_master', text: 'Best video on the entire internet hands down.', time: '5 hours ago', likes: 89 }
    ]
  },
  {
    id: 'lazysunday',
    title: 'Lazy Sunday - The Chronic of Narnia (SNL)',
    author: 'TheLonelyIsland',
    views: 5410900,
    duration: '2:54',
    rating: 4.7,
    ratingsCount: 19800,
    uploadDate: 'Dec 17, 2005',
    description: 'Andy Samberg and Chris Parnell rap about cupcakes from Magnolia Bakery, eating Mr. Pibb, and seeing The Chronicles of Narnia.',
    category: 'Comedy',
    tags: ['snl', 'andysamberg', 'narnia', 'rap', 'magnolia'],
    thumbnail: '🧁',
    aspectColor: '#3b1d1d',
    comments: [
      { id: 'c6', author: 'cupcake_lover', text: 'You can call us Aaron Burr from the way we\'re droppin\' Hamiltons!', time: '4 hours ago', likes: 182 },
      { id: 'c7', author: 'snl_buff', text: 'Digital Shorts are changing comedy forever.', time: '8 hours ago', likes: 45 }
    ]
  },
  {
    id: 'evolution',
    title: 'Evolution of Dance',
    author: 'judsonlaipply',
    views: 9240100,
    duration: '6:00',
    rating: 4.9,
    ratingsCount: 41200,
    uploadDate: 'Apr 6, 2005',
    description: 'Comedian Judson Laipply dances through 30 iconic dance songs from 1950 to 2005 in one continuous routine.',
    category: 'Entertainment',
    tags: ['dance', 'evolution', 'macarena', 'thriller', 'twist'],
    thumbnail: '🕺',
    aspectColor: '#2d1b4e',
    comments: [
      { id: 'c8', author: 'groove_queen', text: 'The Carlton dance and the Macarena had me rolling haha', time: '6 hours ago', likes: 195 }
    ]
  },
  {
    id: 'canonrock',
    title: 'Guitar - Canon Rock (JerryC Arrangement)',
    author: 'funtwo',
    views: 6890400,
    duration: '5:20',
    rating: 5.0,
    ratingsCount: 33400,
    uploadDate: 'Oct 23, 2005',
    description: 'Lim Jeong-hyun (funtwo) sitting in his room wearing a baseball cap playing an unbelievable rock version of Pachelbel\'s Canon on electric guitar.',
    category: 'Music',
    tags: ['guitar', 'canonrock', 'funtwo', 'solo', 'shred'],
    thumbnail: '🎸',
    aspectColor: '#1c3042',
    comments: [
      { id: 'c9', author: 'shred_god', text: 'Who is this mystery guy in the hat?! That sweep picking is inhuman!', time: '1 day ago', likes: 405 }
    ]
  }
];

export const YouTube2005: React.FC = () => {
  const [videos, setVideos] = useState<YouTubeVideo[]>(INITIAL_VIDEOS);
  const [selectedVideoId, setSelectedVideoId] = useState<string>('jawed');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(15); // 0 to 100%
  const [volume, setVolume] = useState<number>(80);
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false);
  const [subscribers, setSubscribers] = useState<number>(12840);
  const [showEmbedCode, setShowEmbedCode] = useState<boolean>(false);
  const [copyToast, setCopyToast] = useState<boolean>(false);
  const [userComment, setUserComment] = useState<string>('');
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadTitle, setUploadTitle] = useState<string>('');
  const [uploadDesc, setUploadDesc] = useState<string>('');
  const [uploadTags, setUploadTags] = useState<string>('');
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [searchFilter, setSearchFilter] = useState<string>('');

  const playbackTimerRef = useRef<number | null>(null);

  const activeVideo = videos.find((v) => v.id === selectedVideoId) || videos[0];

  // Playback timer simulation
  useEffect(() => {
    if (isPlaying) {
      playbackTimerRef.current = window.setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 1.5;
        });
      }, 250);
    } else {
      if (playbackTimerRef.current) clearInterval(playbackTimerRef.current);
    }
    return () => {
      if (playbackTimerRef.current) clearInterval(playbackTimerRef.current);
    };
  }, [isPlaying]);

  const togglePlay = () => {
    sound.playWeb20Pop();
    if (!isPlaying) {
      // Increment views count on play
      setVideos((prev) =>
        prev.map((v) => (v.id === activeVideo.id ? { ...v, views: v.views + 1 } : v))
      );
    }
    setIsPlaying(!isPlaying);
  };

  const handleSelectVideo = (video: YouTubeVideo) => {
    sound.playClick('bubble');
    setSelectedVideoId(video.id);
    setIsPlaying(true);
    setProgress(0);
  };

  const handleRateStar = (starIndex: number) => {
    sound.playStarRating();
    const newCount = (activeVideo.userRating ? activeVideo.ratingsCount : activeVideo.ratingsCount + 1);
    const newAverage =
      ((activeVideo.rating * activeVideo.ratingsCount) + starIndex) / (newCount);

    setVideos((prev) =>
      prev.map((v) =>
        v.id === activeVideo.id
          ? {
              ...v,
              rating: parseFloat(newAverage.toFixed(1)),
              ratingsCount: newCount,
              userRating: starIndex
            }
          : v
      )
    );
  };

  const handleSubscribe = () => {
    sound.playDigg();
    if (!isSubscribed) {
      setIsSubscribed(true);
      setSubscribers((s) => s + 1);
      confetti({ particleCount: 35, spread: 60, origin: { y: 0.6 } });
    } else {
      setIsSubscribed(false);
      setSubscribers((s) => s - 1);
    }
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userComment.trim()) return;
    sound.playWeb20Pop();

    const newComment = {
      id: `comm_${Date.now()}`,
      author: 'web20_pioneer',
      text: userComment.trim(),
      time: 'Just now',
      likes: 1
    };

    setVideos((prev) =>
      prev.map((v) =>
        v.id === activeVideo.id
          ? { ...v, comments: [newComment, ...v.comments] }
          : v
      )
    );
    setUserComment('');
  };

  const handleCopyEmbed = () => {
    sound.playClick('bubble');
    const embedCode = `<object width="425" height="350"><param name="movie" value="http://www.youtube.com/v/${activeVideo.id}"></param><param name="wmode" value="transparent"></param><embed src="http://www.youtube.com/v/${activeVideo.id}" type="application/x-shockwave-flash" wmode="transparent" width="425" height="350"></embed></object>`;
    navigator.clipboard?.writeText(embedCode);
    setCopyToast(true);
    setTimeout(() => setCopyToast(false), 2500);
  };

  const handleStartUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadTitle.trim()) return;
    sound.playWeb20Pop();
    setUploadProgress(10);

    const interval = setInterval(() => {
      setUploadProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          sound.playCelebration();
          const newVideo: YouTubeVideo = {
            id: `upload_${Date.now()}`,
            title: uploadTitle.trim(),
            author: 'you (uploader)',
            views: 1,
            duration: '0:45',
            rating: 5.0,
            ratingsCount: 1,
            uploadDate: 'Today',
            description: uploadDesc || 'Uploaded via Web 2.0 AJAX uploader simulation.',
            category: 'Entertainment',
            tags: uploadTags.split(',').map((t) => t.trim()).filter(Boolean),
            thumbnail: '📹',
            aspectColor: '#2b1b3b',
            comments: [
              { id: 'first_c', author: 'jawed', text: 'Welcome to YouTube! Broadcast Yourself :-)', time: 'Just now', likes: 10 }
            ]
          };
          setVideos((prev) => [newVideo, ...prev]);
          setSelectedVideoId(newVideo.id);
          setIsUploading(false);
          setUploadTitle('');
          setUploadDesc('');
          setUploadTags('');
          setUploadProgress(0);
          confetti({ particleCount: 50, spread: 70 });
          return 0;
        }
        return p + 25;
      });
    }, 300);
  };

  const filteredVideos = videos.filter(
    (v) =>
      v.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
      v.author.toLowerCase().includes(searchFilter.toLowerCase()) ||
      v.tags.some((t) => t.toLowerCase().includes(searchFilter.toLowerCase()))
  );

  return (
    <div className="bg-[#f2f2f2] text-slate-800 font-sans p-4 border border-[#cccccc] shadow-md rounded-md space-y-4">
      {/* 2005 Classic YouTube Header */}
      <div className="bg-white border border-[#d2d2d2] p-3 rounded flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {/* Authentic 2005 YouTube Logo */}
          <div className="flex items-center font-black tracking-tight select-none text-2xl">
            <span className="text-[#333333]">You</span>
            <span className="bg-[#cc181e] text-white px-2 py-0.5 rounded-lg ml-0.5 text-xl shadow-inner font-sans border-t border-red-400">
              Tube
            </span>
          </div>
          <span className="text-[11px] italic font-serif text-slate-500 hidden sm:inline">
            Broadcast Yourself™
          </span>
        </div>

        {/* 2005 Header Navigation Links */}
        <div className="flex items-center gap-4 text-xs font-bold text-[#0033cc]">
          <span className="cursor-pointer hover:underline">Videos</span>
          <span className="cursor-pointer hover:underline">Channels</span>
          <span className="cursor-pointer hover:underline">Community</span>
          <button
            onClick={() => {
              sound.playClick('bubble');
              setIsUploading(true);
            }}
            className="px-2.5 py-1 bg-gradient-to-b from-[#ffff99] to-[#e6db55] text-amber-950 border border-[#b8af3b] rounded font-bold hover:brightness-105 shadow-sm text-xs flex items-center gap-1"
          >
            <span>⬆️</span>
            <span>Upload</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="flex items-center gap-1">
          <input
            type="text"
            placeholder="Search Videos..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="px-2 py-1 text-xs border border-[#999999] rounded-l bg-white focus:outline-none w-36 sm:w-48"
          />
          <button
            onClick={() => sound.playClick('bubble')}
            className="px-3 py-1 bg-[#eeeeee] hover:bg-[#dddddd] border border-[#999999] rounded-r text-xs font-semibold text-slate-700"
          >
            Search
          </button>
        </div>
      </div>

      {/* Upload Video Modal */}
      {isUploading && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white border-2 border-[#cc181e] rounded-lg p-5 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                <span className="bg-[#cc181e] text-white px-1.5 py-0.5 rounded text-xs">YT</span>
                Upload Video to YouTube (Macromedia Flash FLV Transcoder)
              </h3>
              <button
                onClick={() => setIsUploading(false)}
                className="text-slate-400 hover:text-black font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleStartUpload} className="space-y-3 text-xs">
              <div>
                <label className="font-bold block text-slate-700 mb-1">Video Title:</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. My Band Practice 2005"
                  value={uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                  className="w-full border border-slate-300 p-1.5 rounded focus:outline-blue-500"
                />
              </div>

              <div>
                <label className="font-bold block text-slate-700 mb-1">Description:</label>
                <textarea
                  rows={2}
                  placeholder="What is this video about?"
                  value={uploadDesc}
                  onChange={(e) => setUploadDesc(e.target.value)}
                  className="w-full border border-slate-300 p-1.5 rounded focus:outline-blue-500"
                />
              </div>

              <div>
                <label className="font-bold block text-slate-700 mb-1">Tags (comma separated):</label>
                <input
                  type="text"
                  placeholder="funny, music, web20, blog"
                  value={uploadTags}
                  onChange={(e) => setUploadTags(e.target.value)}
                  className="w-full border border-slate-300 p-1.5 rounded focus:outline-blue-500"
                />
              </div>

              <div className="p-2 bg-slate-100 rounded border border-slate-200 text-[11px] text-slate-600">
                <p>Supported file formats: .avi, .mov, .mpg (Max 100MB / 10 mins)</p>
                <p className="text-amber-700 font-semibold mt-0.5">Automated Flash 8 Sorenson Spark FLV encoding enabled.</p>
              </div>

              {uploadProgress > 0 && (
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] font-mono">
                    <span>Encoding & Uploading...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden border border-slate-300">
                    <div
                      className="h-full bg-gradient-to-r from-red-500 to-amber-500 transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setIsUploading(false)}
                  className="px-3 py-1 bg-slate-200 rounded text-slate-700 hover:bg-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploadProgress > 0}
                  className="px-4 py-1.5 bg-[#cc181e] text-white font-bold rounded shadow hover:bg-red-700"
                >
                  {uploadProgress > 0 ? 'Encoding...' : 'Upload Video'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Main Video View & Sidebar Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left 2 Columns: Video Player & Details */}
        <div className="lg:col-span-2 space-y-3">
          {/* Video Title Banner */}
          <div className="bg-white p-3 border border-[#d2d2d2] rounded shadow-xs">
            <h2 className="text-base sm:text-lg font-bold text-[#333333] flex items-center justify-between">
              <span>{activeVideo.title}</span>
              <span className="text-xs font-normal text-slate-500 font-mono">
                {activeVideo.views.toLocaleString()} views
              </span>
            </h2>
            <div className="text-xs text-slate-600 flex items-center gap-2 mt-1">
              <span>Added: <strong className="text-slate-800">{activeVideo.uploadDate}</strong></span>
              <span>•</span>
              <span>by <strong className="text-[#0033cc] cursor-pointer hover:underline">{activeVideo.author}</strong></span>
              <span>•</span>
              <span className="bg-slate-100 border border-slate-200 px-1.5 py-0.2 rounded text-[10px] text-slate-600">
                {activeVideo.category}
              </span>
            </div>
          </div>

          {/* Authentic 4:3 Macromedia Flash Player Frame */}
          <div className="bg-black rounded-lg overflow-hidden border-2 border-[#111111] shadow-xl aspect-4/3 relative flex flex-col justify-between">
            {/* Simulated Video Canvas Frame */}
            <div
              className="flex-1 flex flex-col items-center justify-center p-6 text-center select-none relative overflow-hidden transition-colors"
              style={{ backgroundColor: activeVideo.aspectColor }}
            >
              {/* Subtle Scanline CRT Grain */}
              <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] bg-[size:12px_12px] opacity-40 pointer-events-none" />

              {/* Video Icon & Graphic */}
              <div className="text-6xl sm:text-7xl mb-3 drop-shadow-md animate-pulse">
                {activeVideo.thumbnail}
              </div>

              <div className="text-white font-mono text-sm sm:text-base font-bold bg-black/60 backdrop-blur-xs px-3 py-1 rounded border border-white/20">
                {activeVideo.title}
              </div>

              <div className="text-slate-300 text-xs mt-2 max-w-sm">
                {isPlaying ? (
                  <span className="text-emerald-400 font-mono flex items-center gap-1.5 justify-center">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    STREAMING FLASH FLV (Sorenson Spark @ 300kbps)
                  </span>
                ) : (
                  <span className="text-amber-300">Click ▶ Play or Video to begin playback</span>
                )}
              </div>

              {/* Big Center Play Button (Click to toggle) */}
              <button
                onClick={togglePlay}
                className="absolute inset-0 w-full h-full flex items-center justify-center bg-transparent group"
              >
                {!isPlaying && (
                  <div className="w-16 h-16 rounded-full bg-[#cc181e]/90 text-white flex items-center justify-center text-3xl shadow-2xl border-2 border-white/80 group-hover:scale-110 transition-transform">
                    ▶
                  </div>
                )}
              </button>
            </div>

            {/* Flash Player Controls Bottom Bar */}
            <div className="bg-[#1f1f1f] border-t border-[#333333] p-2 text-white flex flex-col gap-1.5 select-none">
              {/* Timeline Scrubber & Buffer Bar */}
              <div
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const clickX = e.clientX - rect.left;
                  const newPercent = Math.max(0, Math.min(100, (clickX / rect.width) * 100));
                  setProgress(newPercent);
                  sound.playClick('bubble');
                }}
                className="w-full h-2.5 bg-[#444444] rounded cursor-pointer relative overflow-hidden group"
                title="Scrub Flash Buffer"
              >
                {/* Simulated Buffer Ahead */}
                <div
                  className="h-full bg-[#666666] absolute left-0 top-0 transition-all"
                  style={{ width: `${Math.min(100, progress + 25)}%` }}
                />
                {/* Active Playhead */}
                <div
                  className="h-full bg-[#cc181e] absolute left-0 top-0 transition-all group-hover:bg-red-500"
                  style={{ width: `${progress}%` }}
                />
              </div>

              {/* Buttons Bar */}
              <div className="flex items-center justify-between text-xs px-1">
                <div className="flex items-center gap-3">
                  <button
                    onClick={togglePlay}
                    className="hover:text-red-400 font-bold flex items-center gap-1"
                  >
                    <span>{isPlaying ? '⏸ Pause' : '▶ Play'}</span>
                  </button>

                  <div className="text-[11px] font-mono text-slate-400">
                    <span>
                      {Math.floor((progress / 100) * 19)}s / {activeVideo.duration}
                    </span>
                  </div>
                </div>

                {/* Volume & Quality Options */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 text-[11px]">
                    <span>🔊</span>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={volume}
                      onChange={(e) => setVolume(Number(e.target.value))}
                      className="w-16 accent-[#cc181e] cursor-pointer"
                    />
                  </div>

                  <span className="text-[10px] bg-[#333333] px-1.5 py-0.5 rounded text-amber-300 font-mono">
                    240p HQ
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Social Interactions & 5-Star Rating Bar */}
          <div className="bg-white p-3 border border-[#d2d2d2] rounded flex flex-wrap items-center justify-between gap-3 text-xs shadow-xs">
            {/* 5-Star Interactive Rating */}
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-700">Rate this video:</span>
              <div className="flex items-center gap-1 text-amber-500 text-base">
                {[1, 2, 3, 4, 5].map((star) => {
                  const isGold = (activeVideo.userRating || Math.round(activeVideo.rating)) >= star;
                  return (
                    <button
                      key={star}
                      onClick={() => handleRateStar(star)}
                      className="hover:scale-125 transition-transform"
                      title={`Rate ${star} Stars`}
                    >
                      {isGold ? '★' : '☆'}
                    </button>
                  );
                })}
              </div>
              <span className="text-slate-500 text-[11px] font-mono">
                ({activeVideo.rating.toFixed(1)} / 5 • {activeVideo.ratingsCount.toLocaleString()} votes)
              </span>
            </div>

            {/* Subscribe & Share Action Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleSubscribe}
                className={`px-3 py-1 rounded font-bold transition-all border text-xs shadow-xs flex items-center gap-1 ${
                  isSubscribed
                    ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                    : 'bg-gradient-to-b from-[#ffff99] to-[#ffd700] text-amber-950 border-[#cca300] hover:brightness-105'
                }`}
              >
                <span>{isSubscribed ? '✓ Subscribed' : '+ Subscribe'}</span>
                <span className="text-[10px] opacity-75">({subscribers.toLocaleString()})</span>
              </button>

              <button
                onClick={() => {
                  sound.playClick('bubble');
                  setShowEmbedCode(!showEmbedCode);
                }}
                className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded text-slate-700 font-semibold"
              >
                &lt;/&gt; Embed
              </button>
            </div>
          </div>

          {/* Embed Code Panel */}
          {showEmbedCode && (
            <div className="bg-[#fffde7] border border-[#ffecb3] p-3 rounded text-xs space-y-1.5 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-amber-900">Embed this video on your MySpace or Blog:</span>
                <button
                  onClick={handleCopyEmbed}
                  className="px-2 py-0.5 bg-amber-600 hover:bg-amber-700 text-white rounded text-[11px] font-bold"
                >
                  {copyToast ? '✓ Copied!' : 'Copy Code'}
                </button>
              </div>
              <textarea
                readOnly
                rows={2}
                value={`<object width="425" height="350"><param name="movie" value="http://www.youtube.com/v/${activeVideo.id}"></param><param name="wmode" value="transparent"></param><embed src="http://www.youtube.com/v/${activeVideo.id}" type="application/x-shockwave-flash" wmode="transparent" width="425" height="350"></embed></object>`}
                className="w-full font-mono text-[11px] p-1.5 bg-white border border-amber-300 rounded select-all"
              />
            </div>
          )}

          {/* Description & Tags */}
          <div className="bg-white p-3 border border-[#d2d2d2] rounded text-xs space-y-2">
            <p className="text-slate-700 leading-relaxed">{activeVideo.description}</p>
            <div className="flex flex-wrap items-center gap-1 pt-1 border-t border-slate-100">
              <span className="text-slate-400 font-semibold text-[11px]">Tags:</span>
              {activeVideo.tags.map((t) => (
                <span
                  key={t}
                  onClick={() => setSearchFilter(t)}
                  className="text-[#0033cc] bg-blue-50 hover:bg-blue-100 px-1.5 py-0.5 rounded text-[10px] cursor-pointer"
                >
                  #{t}
                </span>
              ))}
            </div>
          </div>

          {/* Comments Section */}
          <div className="bg-white p-3 border border-[#d2d2d2] rounded space-y-3">
            <h3 className="text-xs font-bold text-slate-800 flex items-center justify-between">
              <span>Comments ({activeVideo.comments.length})</span>
              <span className="text-[11px] text-slate-500 font-normal">Post a Video Response</span>
            </h3>

            {/* Write comment form */}
            <form onSubmit={handleAddComment} className="flex gap-2">
              <input
                type="text"
                placeholder="Join the discussion... (e.g. 5 stars!!)"
                value={userComment}
                onChange={(e) => setUserComment(e.target.value)}
                className="flex-1 text-xs border border-slate-300 p-1.5 rounded focus:outline-blue-500"
              />
              <button
                type="submit"
                className="px-3 py-1.5 bg-[#cc181e] text-white font-bold rounded text-xs hover:bg-red-700 shadow-xs"
              >
                Post
              </button>
            </form>

            {/* Comment Thread */}
            <div className="space-y-2 pt-1">
              {activeVideo.comments.map((comm) => (
                <div key={comm.id} className="text-xs border-b border-slate-100 pb-2 flex justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-[#0033cc]">{comm.author}</span>
                      <span className="text-[10px] text-slate-400">({comm.time})</span>
                    </div>
                    <p className="text-slate-700 mt-0.5">{comm.text}</p>
                  </div>
                  <div className="text-[11px] text-slate-400 flex items-center gap-1 self-start">
                    <span>👍</span>
                    <span>{comm.likes}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Related Videos List */}
        <div className="space-y-3">
          <div className="bg-white border border-[#d2d2d2] p-3 rounded">
            <h3 className="font-bold text-xs text-slate-800 mb-2.5 pb-1 border-b border-slate-200 flex items-center justify-between">
              <span>Related Videos</span>
              <span className="text-[10px] text-slate-500 font-normal">1 of {filteredVideos.length}</span>
            </h3>

            <div className="space-y-2.5">
              {filteredVideos.map((vid) => {
                const isCurrent = vid.id === activeVideo.id;
                return (
                  <div
                    key={vid.id}
                    onClick={() => handleSelectVideo(vid)}
                    className={`flex gap-2.5 p-1.5 rounded cursor-pointer transition-colors border ${
                      isCurrent
                        ? 'bg-red-50 border-red-200'
                        : 'hover:bg-slate-50 border-transparent'
                    }`}
                  >
                    {/* Thumbnail box */}
                    <div
                      className="w-20 h-14 rounded overflow-hidden flex items-center justify-center text-2xl shrink-0 relative border border-slate-300"
                      style={{ backgroundColor: vid.aspectColor }}
                    >
                      <span>{vid.thumbnail}</span>
                      <span className="absolute bottom-0.5 right-0.5 bg-black/80 text-white font-mono text-[9px] px-1 rounded">
                        {vid.duration}
                      </span>
                    </div>

                    {/* Meta info */}
                    <div className="min-w-0 flex-1">
                      <h4 className="text-xs font-bold text-[#0033cc] line-clamp-2 hover:underline">
                        {vid.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">{vid.author}</p>
                      <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-0.5">
                        <span>{vid.views.toLocaleString()} views</span>
                        <span>•</span>
                        <span className="text-amber-500 font-bold">★ {vid.rating}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Vintage 2005 Promotional Box */}
          <div className="bg-gradient-to-b from-[#fbf5e6] to-[#faecd2] border border-[#e8ce9e] p-3 rounded text-xs space-y-1 text-slate-700 shadow-xs">
            <div className="font-bold text-amber-900 flex items-center gap-1">
              <span>✨</span>
              <span>YouTube 2005 Trivia</span>
            </div>
            <p className="text-[11px] leading-snug">
              In Nov 2005, Sequoia Capital invested $3.5M. By 2006, Google acquired YouTube for $1.65 Billion in stock!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
