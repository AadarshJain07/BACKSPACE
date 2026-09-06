import React, { useState, useEffect, useRef, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { EraConfig } from '../../types/era';
import { sound } from '../../utils/audio';
import { YouTube2005 } from './era2005/YouTube2005';
import { Thefacebook2005 } from './era2005/Thefacebook2005';
import { GoogleMaps2005 } from './era2005/GoogleMaps2005';

interface Props {
  era: EraConfig;
}

interface DiggStory {
  id: string;
  title: string;
  url: string;
  domain: string;
  category: 'Tech' | 'Science' | 'Gaming' | 'Apple' | 'World';
  description: string;
  diggs: number;
  dugg: boolean;
  author: string;
  timestamp: string;
  tags: string[];
  commentsCount: number;
  comments: { id: string; author: string; text: string; time: string; diggs: number }[];
}

interface MySpaceFriend {
  id: string;
  name: string;
  avatar: string;
  role: string;
  status: string;
  quote: string;
}

interface FlickrPhoto {
  id: string;
  title: string;
  imageUrl: string;
  caption: string;
  tags: string[];
  views: number;
  notes: { id: string; x: number; y: number; width: number; height: number; text: string }[];
}

interface RssItem {
  id: string;
  feed: string;
  feedColor: string;
  title: string;
  snippet: string;
  time: string;
  unread: boolean;
  starred: boolean;
}

const INITIAL_STORIES: DiggStory[] = [
  {
    id: '1',
    title: 'YouTube founded by three former PayPal employees: Free video sharing for everyone',
    url: 'http://www.youtube.com',
    domain: 'youtube.com',
    category: 'Tech',
    description:
      'A brand new website called YouTube has launched. It lets anyone upload videos in Macromedia Flash format without any codec headaches. No more downloading 50MB QuickTime files!',
    diggs: 2842,
    dugg: false,
    author: 'jawed_karim',
    timestamp: '2 hours ago',
    tags: ['youtube', 'flash', 'video', 'ajax', 'social'],
    commentsCount: 3,
    comments: [
      { id: 'c1', author: 'silicon_surfer', text: 'Flash video streaming in the browser? Mind blown. Good luck paying for bandwidth though!', time: '1 hour ago', diggs: 42 },
      { id: 'c2', author: 'code_monkey', text: 'Just uploaded a video of my cat. Bandwidth is super smooth on DSL.', time: '45 mins ago', diggs: 18 },
      { id: 'c3', author: 'digg_fanatic', text: 'This might actually be bigger than Google Video. Front page material right here!', time: '20 mins ago', diggs: 9 }
    ]
  },
  {
    id: '2',
    title: 'Steve Jobs pulls the ultra-thin iPod Nano from his jeans coin pocket',
    url: 'http://www.apple.com/ipodnano',
    domain: 'apple.com',
    category: 'Apple',
    description:
      'At today\'s special event, Steve Jobs pointed to the tiny coin watch pocket on his Levi jeans and asked: "Ever wonder what this pocket is for?" Then he pulled out the razor-thin iPod Nano.',
    diggs: 3190,
    dugg: true,
    author: 'cult_of_mac',
    timestamp: '4 hours ago',
    tags: ['apple', 'ipod', 'hardware', 'gadgets', 'jobs'],
    commentsCount: 2,
    comments: [
      { id: 'c4', author: 'mac_head_05', text: 'RIP iPod Mini. That flash memory form factor is ridiculously thin.', time: '3 hours ago', diggs: 65 },
      { id: 'c5', author: 'mp3_audiophile', text: 'Scratch gate coming in 3... 2... 1... but damn it looks sexy.', time: '2 hours ago', diggs: 31 }
    ]
  },
  {
    id: '3',
    title: 'Ruby on Rails 1.0 released to the world: Web development that doesn\'t hurt',
    url: 'http://www.rubyonrails.org',
    domain: 'rubyonrails.org',
    category: 'Tech',
    description:
      'David Heinemeier Hansson (DHH) announces Rails 1.0. Convention over configuration, ActiveRecord, and instant Scaffolding are changing how startups build Web 2.0 applications in days instead of months.',
    diggs: 1980,
    dugg: false,
    author: 'dhh_fan',
    timestamp: '6 hours ago',
    tags: ['ruby', 'rails', 'web20', 'mvc', 'ajax'],
    commentsCount: 2,
    comments: [
      { id: 'c6', author: 'java_enterprise', text: 'Cute toy for blogs, but will it scale beyond 100 concurrent requests without J2EE?', time: '5 hours ago', diggs: -4 },
      { id: 'c7', author: 'agile_dev', text: 'Built an entire bookmarking site in a weekend. Never writing XML configs again.', time: '4 hours ago', diggs: 88 }
    ]
  },
  {
    id: '4',
    title: 'Firefox 1.5 officially unleashed: Faster tabs, clear private data, SVG support',
    url: 'http://www.mozilla.com/firefox',
    domain: 'mozilla.com',
    category: 'Tech',
    description:
      'Mozilla Corporation launches Firefox 1.5. Over 100 million downloads of version 1.0 led up to this. Faster back/forward navigation, drag-and-drop reordering for tabs, and automated updates.',
    diggs: 2540,
    dugg: false,
    author: 'firefox_ninja',
    timestamp: '8 hours ago',
    tags: ['firefox', 'mozilla', 'browser', 'opensource'],
    commentsCount: 1,
    comments: [
      { id: 'c8', author: 'tab_master', text: 'Drag-and-drop tabs is the single greatest browser feature ever created.', time: '7 hours ago', diggs: 77 }
    ]
  },
  {
    id: '5',
    title: 'Nintendo shocks gamers: Codename "Revolution" controller features 3D motion sensing wand',
    url: 'http://www.ign.com/revolution',
    domain: 'ign.com',
    category: 'Gaming',
    description:
      'Satoru Iwata presented Nintendo\'s next console remote at Tokyo Game Show. Instead of traditional gamepads, you swing a one-handed wireless wand to play tennis and swing swords.',
    diggs: 4120,
    dugg: false,
    author: 'nintendo_power',
    timestamp: '12 hours ago',
    tags: ['nintendo', 'gaming', 'wii', 'gadgets'],
    commentsCount: 1,
    comments: [
      { id: 'c9', author: 'halo_master', text: 'Gimmick! How are you supposed to play FPS games with a TV remote?', time: '11 hours ago', diggs: 12 }
    ]
  }
];

const INITIAL_FRIENDS: MySpaceFriend[] = [
  {
    id: 'tom',
    name: 'Tom Anderson',
    avatar: '👨‍💼',
    role: 'Co-Founder & Friend #1',
    status: 'Online Now!',
    quote: 'Thanks for being my friend! :-)'
  },
  {
    id: 'f1',
    name: 'Sarah (Scene Queen)',
    avatar: '🎀',
    role: 'Bestie / Indie Kid',
    status: 'Away: listening to Taking Back Sunday',
    quote: 'rawr means i love you in dinosaur XD'
  },
  {
    id: 'f2',
    name: 'Dave (Guitar Hero)',
    avatar: '🎸',
    role: 'Bandmate',
    status: 'Online',
    quote: 'Battle of the Bands this Friday at the VFW hall!'
  },
  {
    id: 'f3',
    name: 'Jenny (Flickr Addict)',
    avatar: '📷',
    role: 'Photographer',
    status: 'In Studio',
    quote: 'Just uploaded 120 photos from Warped Tour!'
  },
  {
    id: 'f4',
    name: 'Mike (Ruby Hacker)',
    avatar: '💻',
    role: 'Web 2.0 Architect',
    status: 'Online (Hacking Rails)',
    quote: 'AJAX + Ruby on Rails = Future of the Internet.'
  },
  {
    id: 'f5',
    name: 'Chloe (Emo Girl)',
    avatar: '🖤',
    role: 'Poet / Dreamer',
    status: 'Offline',
    quote: 'so long and goodnight... <3 My Chemical Romance'
  },
  {
    id: 'f6',
    name: 'Kevin (Digg Addict)',
    avatar: '⛏️',
    role: 'Tech News Junkie',
    status: 'Dugg 240 stories today',
    quote: 'If it\'s not on the front page of Digg, it didn\'t happen.'
  },
  {
    id: 'f7',
    name: 'Lisa (Podcaster)',
    avatar: '🎙️',
    role: 'iPod Audio Pioneer',
    status: 'Recording Episode #14',
    quote: 'Subscribe to my feed via RSS 2.0 in iTunes!'
  }
];

const INITIAL_FLICKR: FlickrPhoto[] = [
  {
    id: 'p1',
    title: 'Steve Jobs & The First iPod Nano',
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=700&auto=format&fit=crop&q=80',
    caption: 'San Francisco keynote, Sept 2005. The crowd gasped when Steve pulled it from the coin pocket.',
    tags: ['apple', 'ipod', 'stevejobs', 'keynote'],
    views: 14200,
    notes: [
      { id: 'n1', x: 25, y: 30, width: 35, height: 25, text: '🔍 1,000 songs in your pocket with flash memory!' },
      { id: 'n2', x: 65, y: 55, width: 25, height: 20, text: '✨ Iconic Click Wheel interface' }
    ]
  },
  {
    id: 'p2',
    title: 'Late Night College LAN Party (2005)',
    imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=700&auto=format&fit=crop&q=80',
    caption: 'Counter-Strike 1.6 & Halo PC until 6:00 AM. 40lb CRT monitors lugged up three flights of stairs.',
    tags: ['lanparty', 'gaming', 'counterstrike', 'crt'],
    views: 8930,
    notes: [
      { id: 'n3', x: 30, y: 25, width: 30, height: 30, text: '🖥️ Heavy 19-inch CRT monitors with 100Hz refresh' },
      { id: 'n4', x: 70, y: 40, width: 22, height: 25, text: '🥤 2-Liter bottles of Mountain Dew and Bawls energy' }
    ]
  },
  {
    id: 'p3',
    title: 'Early Web 2.0 Garage Startup Desk',
    imageUrl: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=700&auto=format&fit=crop&q=80',
    caption: 'Dual screen setup running TextMate, Firefox 1.5 with Firebug, and local MySQL server.',
    tags: ['startup', 'rails', 'textmate', 'web20'],
    views: 11450,
    notes: [
      { id: 'n5', x: 40, y: 35, width: 28, height: 28, text: '⚡ Firebug extension: Inspect DOM elements live in Firefox!' }
    ]
  }
];

const INITIAL_RSS: RssItem[] = [
  {
    id: 'r1',
    feed: 'TechCrunch',
    feedColor: 'bg-emerald-600',
    title: 'Flickr Acquired by Yahoo! for an estimated $35 Million',
    snippet: 'Caterina Fake and Stewart Butterfield confirm the acquisition. Yahoo pledges to preserve Flickr\'s vibrant community.',
    time: '14 mins ago',
    unread: true,
    starred: true
  },
  {
    id: 'r2',
    feed: 'Slashdot',
    feedColor: 'bg-teal-700',
    title: 'Linus Torvalds releases Git 0.99 for Linux Kernel Management',
    snippet: 'Following the BitKeeper controversy, Torvalds designed Git in just two weeks to manage distributed version control at scale.',
    time: '42 mins ago',
    unread: true,
    starred: false
  },
  {
    id: 'r3',
    feed: 'Boing Boing',
    feedColor: 'bg-red-600',
    title: 'Sony BMG Rootkit Scandal: DRM software silently installs kernel rootkit on PCs',
    snippet: 'Security researcher Mark Russinovich discovers audio CDs secretly install cloaked software that creates major security holes.',
    time: '2 hours ago',
    unread: false,
    starred: true
  },
  {
    id: 'r4',
    feed: 'Engadget',
    feedColor: 'bg-blue-600',
    title: 'Microsoft details Xbox 360 launch lineup with 18 HD titles',
    snippet: 'The next generation begins with Call of Duty 2, Perfect Dark Zero, and Project Gotham Racing 3 in high definition 720p.',
    time: '5 hours ago',
    unread: false,
    starred: false
  }
];

const ALL_TAGS = [
  { name: 'ajax', weight: 32 },
  { name: 'ruby', weight: 26 },
  { name: 'rails', weight: 24 },
  { name: 'youtube', weight: 30 },
  { name: 'apple', weight: 28 },
  { name: 'ipod', weight: 25 },
  { name: 'firefox', weight: 22 },
  { name: 'flickr', weight: 20 },
  { name: 'rss', weight: 18 },
  { name: 'social', weight: 29 },
  { name: 'gaming', weight: 19 },
  { name: 'beta', weight: 22 },
  { name: 'myspace', weight: 27 },
  { name: 'css', weight: 16 },
  { name: 'podcasts', weight: 15 }
];

export const Era2005: React.FC<Props> = () => {
  // Navigation tabs in Firefox 1.5
  const [activeTab, setActiveTab] = useState<'digg' | 'youtube' | 'thefacebook' | 'googlemaps' | 'myspace' | 'flickr' | 'rss' | 'badgeLab'>('digg');
  const [urlInput, setUrlInput] = useState('http://www.digg.com/web20/popular');
  const [isAjaxLoading, setIsAjaxLoading] = useState(false);
  const [ajaxStatusText, setAjaxStatusText] = useState('Done (Gecko 1.8.0 engine idle)');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Digg State
  const [stories, setStories] = useState<DiggStory[]>(INITIAL_STORIES);
  const [diggCategory, setDiggCategory] = useState<'All' | 'Tech' | 'Science' | 'Gaming' | 'Apple' | 'World'>('All');
  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({});
  const [newCommentText, setNewCommentText] = useState<Record<string, string>>({});
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [submitTitle, setSubmitTitle] = useState('');
  const [submitUrl, setSubmitUrl] = useState('');
  const [submitCategory, setSubmitCategory] = useState<'Tech' | 'Science' | 'Gaming' | 'Apple' | 'World'>('Tech');
  const [submitDesc, setSubmitDesc] = useState('');

  // MySpace State
  const [friends, setFriends] = useState<MySpaceFriend[]>(INITIAL_FRIENDS);
  const [myspaceTheme, setMyspaceTheme] = useState<'classic' | 'scene' | 'pink' | 'gothic'>('classic');
  const [userMood, setUserMood] = useState('Hyped :D');
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [equalizerBars, setEqualizerBars] = useState([40, 75, 55, 90, 60, 85, 30, 95]);
  const [myBio, setMyBio] = useState('Hey guys! Thanks for checking out my page. Hit me up on AIM or leave a comment below! Web 2.0 rules!');
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [draggedFriendIdx, setDraggedFriendIdx] = useState<number | null>(null);

  // Flickr State
  const [flickrPhotos, setFlickrPhotos] = useState<FlickrPhoto[]>(INITIAL_FLICKR);
  const [activePhotoId, setActivePhotoId] = useState('p1');
  const [showNoteInput, setShowNoteInput] = useState(false);
  const [noteCoord, setNoteCoord] = useState<{ x: number; y: number }>({ x: 50, y: 50 });
  const [newNoteText, setNewNoteText] = useState('');

  // RSS Reader State
  const [rssItems, setRssItems] = useState<RssItem[]>(INITIAL_RSS);
  const [rssFilter, setRssFilter] = useState<'all' | 'unread' | 'starred'>('all');

  // Web 2.0 Badge Customizer State
  const [badgeText, setBadgeText] = useState('BETA');
  const [badgeSubtext, setBadgeSubtext] = useState('WEB 2.0');
  const [badgeColor, setBadgeColor] = useState<'orange' | 'blue' | 'green' | 'purple'>('orange');
  const [showCornerRibbon, setShowCornerRibbon] = useState(true);

  // Audio synthesizer player for MySpace
  const audioCtxRef = useRef<AudioContext | null>(null);
  const synthTimerRef = useRef<number | null>(null);

  // Synchronize Firefox address bar URL on tab switch
  useEffect(() => {
    switch (activeTab) {
      case 'digg':
        setUrlInput('http://www.digg.com/web20/popular');
        break;
      case 'youtube':
        setUrlInput('http://www.youtube.com');
        break;
      case 'thefacebook':
        setUrlInput('http://www.thefacebook.com');
        break;
      case 'googlemaps':
        setUrlInput('http://maps.google.com');
        break;
      case 'myspace':
        setUrlInput('http://www.myspace.com/alex_retro_2005');
        break;
      case 'flickr':
        setUrlInput('http://www.flickr.com/photos/archive/2005');
        break;
      case 'rss':
        setUrlInput('http://www.google.com/reader/view/feed');
        break;
      case 'badgeLab':
        setUrlInput('http://www.web20badges.com/generator');
        break;
    }
  }, [activeTab]);

  // Simulate AJAX response indicator
  const triggerAjaxSimulation = useCallback((statusMsg: string, callback?: () => void) => {
    setIsAjaxLoading(true);
    setAjaxStatusText(`Connecting to server via XMLHttpRequest...`);
    const latency = Math.floor(Math.random() * 200) + 120;
    setTimeout(() => {
      setIsAjaxLoading(false);
      setAjaxStatusText(`Done (${statusMsg} in ${latency}ms)`);
      if (callback) callback();
    }, latency);
  }, []);

  // Equalizer animation for MySpace player
  useEffect(() => {
    if (!musicPlaying) return;
    const interval = setInterval(() => {
      setEqualizerBars([
        Math.floor(Math.random() * 80) + 20,
        Math.floor(Math.random() * 85) + 15,
        Math.floor(Math.random() * 95) + 5,
        Math.floor(Math.random() * 90) + 10,
        Math.floor(Math.random() * 75) + 25,
        Math.floor(Math.random() * 85) + 15,
        Math.floor(Math.random() * 90) + 10,
        Math.floor(Math.random() * 70) + 30
      ]);
    }, 120);
    return () => clearInterval(interval);
  }, [musicPlaying]);

  // Synth Chiptune player for MySpace
  const TRACKS = [
    { title: 'The Killers - Mr. Brightside (2005 Synth Cut)', bpm: 148, chords: [587.33, 523.25, 440, 392] },
    { title: 'Fall Out Boy - Sugar We\'re Goin Down (8-bit Pop-Punk)', bpm: 160, chords: [440, 392, 349.23, 523.25] },
    { title: 'Green Day - Holiday (Chiptune Anthemic)', bpm: 146, chords: [349.23, 440, 523.25, 392] }
  ];

  const toggleMySpaceMusic = () => {
    if (musicPlaying) {
      if (synthTimerRef.current) {
        clearInterval(synthTimerRef.current);
        synthTimerRef.current = null;
      }
      setMusicPlaying(false);
      sound.playClick('bubble');
      return;
    }

    sound.playWeb20Pop();
    setMusicPlaying(true);

    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!audioCtxRef.current && AudioCtx) {
        audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      if (!ctx) return;
      if (ctx.state === 'suspended') ctx.resume().catch(() => {});

      let step = 0;
      const track = TRACKS[currentTrackIndex];
      const noteDuration = 0.22;

      synthTimerRef.current = window.setInterval(() => {
        if (sound.isMuted) return;
        const now = ctx.currentTime;
        const rootFreq = track.chords[step % track.chords.length];

        // Power chord synthesis (Root + Fifth + Octave)
        const notes = [rootFreq, rootFreq * 1.5, rootFreq * 2];
        notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = idx === 0 ? 'sawtooth' : 'triangle';
          osc.frequency.setValueAtTime(freq, now);

          gain.gain.setValueAtTime(0.04, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + noteDuration);

          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + noteDuration);
        });

        // Arpeggiated lead chirp
        const leadFreq = rootFreq * (step % 2 === 0 ? 1.25 : 1.75);
        const leadOsc = ctx.createOscillator();
        const leadGain = ctx.createGain();
        leadOsc.type = 'square';
        leadOsc.frequency.setValueAtTime(leadFreq, now + 0.08);
        leadGain.gain.setValueAtTime(0.025, now + 0.08);
        leadGain.gain.exponentialRampToValueAtTime(0.001, now + noteDuration);

        leadOsc.connect(leadGain);
        leadGain.connect(ctx.destination);
        leadOsc.start(now + 0.08);
        leadOsc.stop(now + noteDuration);

        step++;
      }, 250);
    } catch {
      // Ignore audio context errors
    }
  };

  useEffect(() => {
    return () => {
      if (synthTimerRef.current) {
        clearInterval(synthTimerRef.current);
      }
    };
  }, []);

  // Digg Upvote Action
  const handleDigg = (storyId: string) => {
    sound.playDigg();
    setStories((prev) =>
      prev.map((s) => {
        if (s.id === storyId) {
          const nextDugg = !s.dugg;
          const nextDiggs = nextDugg ? s.diggs + 1 : s.diggs - 1;
          if (nextDugg) {
            confetti({
              particleCount: 25,
              spread: 60,
              origin: { y: 0.6 }
            });
          }
          return { ...s, dugg: nextDugg, diggs: nextDiggs };
        }
        return s;
      })
    );
    triggerAjaxSimulation(`Upvote registered for story #${storyId}`);
  };

  // Submit Story via AJAX
  const handleSubmitStory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!submitTitle.trim()) return;

    sound.playWeb20Pop();
    triggerAjaxSimulation('Story parsed and indexed', () => {
      const newStory: DiggStory = {
        id: Date.now().toString(),
        title: submitTitle,
        url: submitUrl || 'http://www.techcrunch.com',
        domain: submitUrl.replace(/^https?:\/\//, '').split('/')[0] || 'techcrunch.com',
        category: submitCategory,
        description: submitDesc || 'Exciting new Web 2.0 application launched today with full AJAX and API integration.',
        diggs: 1,
        dugg: true,
        author: 'you_web20',
        timestamp: 'Just now',
        tags: ['web20', 'ajax', submitCategory.toLowerCase()],
        commentsCount: 0,
        comments: []
      };

      setStories([newStory, ...stories]);
      setShowSubmitModal(false);
      setSubmitTitle('');
      setSubmitUrl('');
      setSubmitDesc('');
      confetti({ particleCount: 40, spread: 70 });
    });
  };

  // Post Comment via AJAX
  const handleAddComment = (storyId: string) => {
    const text = newCommentText[storyId];
    if (!text || !text.trim()) return;

    sound.playClick('bubble');
    triggerAjaxSimulation(`Comment posted via XMLHTTPRequest`, () => {
      setStories((prev) =>
        prev.map((s) => {
          if (s.id === storyId) {
            const newC = {
              id: Date.now().toString(),
              author: 'you_surfer',
              text: text.trim(),
              time: 'Just now',
              diggs: 1
            };
            return {
              ...s,
              commentsCount: s.commentsCount + 1,
              comments: [...s.comments, newC]
            };
          }
          return s;
        })
      );
      setNewCommentText((prev) => ({ ...prev, [storyId]: '' }));
    });
  };

  // Top 8 Friends Drag/Swap Reordering
  const handleFriendSwap = (idx1: number, idx2: number) => {
    sound.playClick('bubble');
    const updated = [...friends];
    const temp = updated[idx1];
    updated[idx1] = updated[idx2];
    updated[idx2] = temp;
    setFriends(updated);
    triggerAjaxSimulation(`MySpace Top 8 reordered: ${temp.name} moved to #${idx2 + 1}`);
  };

  // Add Yellow Note to Flickr Photo
  const handleAddFlickrNote = () => {
    if (!newNoteText.trim()) return;
    sound.playWeb20Pop();
    setFlickrPhotos((prev) =>
      prev.map((p) => {
        if (p.id === activePhotoId) {
          const newNote = {
            id: Date.now().toString(),
            x: noteCoord.x,
            y: noteCoord.y,
            width: 25,
            height: 20,
            text: newNoteText.trim()
          };
          return { ...p, notes: [...p.notes, newNote] };
        }
        return p;
      })
    );
    setShowNoteInput(false);
    setNewNoteText('');
    triggerAjaxSimulation('Flickr photo annotation saved to cloud');
  };

  // Filter stories by category or tag
  const filteredStories = stories.filter((s) => {
    const matchesCat = diggCategory === 'All' || s.category === diggCategory;
    const matchesTag = !selectedTag || s.tags.includes(selectedTag);
    const matchesSearch =
      !searchQuery.trim() ||
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesTag && matchesSearch;
  });

  return (
    <div className="relative font-sans text-slate-800 selection:bg-[#ff7700] selection:text-white pb-12">
      {/* Dynamic Corner Web 2.0 BETA Ribbon */}
      {showCornerRibbon && (
        <div
          onClick={() => {
            sound.playWeb20Pop();
            setActiveTab('badgeLab');
          }}
          className={`fixed top-20 -right-12 z-50 transform rotate-45 cursor-pointer select-none px-12 py-1 shadow-lg text-[11px] font-bold tracking-widest text-center uppercase border-y border-white/40 web20-gloss ${
            badgeColor === 'orange'
              ? 'web20-badge-beta'
              : badgeColor === 'blue'
              ? 'web20-badge-blue'
              : badgeColor === 'green'
              ? 'web20-badge-green'
              : 'bg-purple-700 text-white'
          }`}
          title="Click to customize Web 2.0 BETA badge"
        >
          {badgeText} • {badgeSubtext}
        </div>
      )}

      {/* Mozilla Firefox 1.5 Browser Chrome Window */}
      <div className="bg-[#d4d0c8] border-2 border-[#555] rounded-t-xl rounded-b-lg shadow-2xl overflow-hidden">
        {/* Titlebar with Firefox gradient */}
        <div className="bg-gradient-to-r from-[#1c3b6f] via-[#2c5898] to-[#1a3765] px-3 py-1.5 flex items-center justify-between text-white select-none">
          <div className="flex items-center gap-2">
            <span className="text-base drop-shadow">🦊</span>
            <span className="font-semibold text-xs tracking-wide">
              Mozilla Firefox 1.5 — [
              {activeTab === 'digg'
                ? 'Digg - Technology, Science & Social News'
                : activeTab === 'myspace'
                ? 'MySpace.com - Alex\'s Profile & Top 8 Friends'
                : activeTab === 'flickr'
                ? 'Flickr - Photo Stream 2005'
                : activeTab === 'rss'
                ? 'Google Reader - Live RSS 2.0 Feeds'
                : 'Web 2.0 Glossy Badge Studio'}
              ]
            </span>
          </div>
          <div className="flex items-center gap-1">
            <button className="w-5 h-4 bg-[#ece9d8] hover:bg-white text-black text-[10px] font-bold border border-[#7f9db9] rounded-sm flex items-center justify-center">
              _
            </button>
            <button className="w-5 h-4 bg-[#ece9d8] hover:bg-white text-black text-[10px] font-bold border border-[#7f9db9] rounded-sm flex items-center justify-center">
              □
            </button>
            <button
              onClick={() => alert('Firefox 1.5 Crash Recovery System: Restoring 4 tabs smoothly!')}
              className="w-5 h-4 bg-[#d9534f] hover:bg-red-600 text-white text-[10px] font-bold border border-[#900] rounded-sm flex items-center justify-center"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Firefox 1.5 Menu Bar */}
        <div className="bg-[#ece9d8] border-b border-[#aca899] px-2 py-0.5 text-[11px] flex gap-4 text-slate-800">
          <span className="hover:bg-[#316ac5] hover:text-white px-1.5 py-0.5 rounded cursor-pointer">File</span>
          <span className="hover:bg-[#316ac5] hover:text-white px-1.5 py-0.5 rounded cursor-pointer">Edit</span>
          <span className="hover:bg-[#316ac5] hover:text-white px-1.5 py-0.5 rounded cursor-pointer">View</span>
          <span className="hover:bg-[#316ac5] hover:text-white px-1.5 py-0.5 rounded cursor-pointer">Go</span>
          <span className="hover:bg-[#316ac5] hover:text-white px-1.5 py-0.5 rounded cursor-pointer">Bookmarks</span>
          <span className="hover:bg-[#316ac5] hover:text-white px-1.5 py-0.5 rounded cursor-pointer">Tools</span>
          <span className="hover:bg-[#316ac5] hover:text-white px-1.5 py-0.5 rounded cursor-pointer">Help</span>
        </div>

        {/* Revolutionary Firefox 1.5 Tab Bar */}
        <div className="bg-[#dedad0] border-b border-[#aca899] px-2 pt-1.5 flex items-end gap-1 select-none overflow-x-auto">
          {[
            { id: 'digg', label: 'Digg.com (News)', icon: '⛏️', badge: `${stories.length}` },
            { id: 'youtube', label: 'YouTube (Videos)', icon: '📹', badge: 'Flash' },
            { id: 'thefacebook', label: 'Thefacebook', icon: '🎓', badge: 'Harvard' },
            { id: 'googlemaps', label: 'Google Maps', icon: '🗺️', badge: 'AJAX' },
            { id: 'myspace', label: 'MySpace Profile', icon: '👤', badge: 'Top 8' },
            { id: 'flickr', label: 'Flickr Photostream', icon: '📸', badge: '3' },
            { id: 'rss', label: 'Google Reader (RSS)', icon: '📡', badge: 'New' },
            { id: 'badgeLab', label: 'Web 2.0 Badge Lab', icon: '✨', badge: 'BETA' }
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  sound.playClick('bubble');
                  setActiveTab(tab.id as typeof activeTab);
                  triggerAjaxSimulation(`Tab switched to ${tab.label}`);
                }}
                className={`group px-3 py-1.5 text-xs font-semibold rounded-t-lg flex items-center gap-1.5 transition-all border-t border-x ${
                  isActive
                    ? 'bg-white text-blue-900 border-[#999] shadow-sm -mb-[1px] pb-2 z-10'
                    : 'bg-[#cfcac0] hover:bg-[#eae6de] text-slate-700 border-[#b5b0a5]'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
                <span
                  className={`text-[9px] px-1.5 py-0.2 rounded-full font-mono ${
                    isActive ? 'bg-orange-500 text-white font-bold' : 'bg-slate-300 text-slate-600'
                  }`}
                >
                  {tab.badge}
                </span>
              </button>
            );
          })}
          <button
            onClick={() => {
              sound.playWeb20Pop();
              alert('New Firefox Tab: Opening about:blank with Gecko rendering!');
            }}
            className="px-2 py-1 text-slate-600 hover:text-black font-bold text-xs"
            title="Open New Tab"
          >
            +
          </button>
        </div>

        {/* Firefox 1.5 Navigation & Address Bar */}
        <div className="bg-[#ece9d8] border-b border-[#aca899] p-2 flex flex-wrap items-center gap-2 text-xs">
          {/* Back, Forward, Reload, Stop buttons */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => sound.playClick('bubble')}
              className="w-7 h-7 rounded-full bg-gradient-to-b from-[#75c653] to-[#459628] hover:from-[#8be065] hover:to-[#55aa32] text-white font-black text-sm shadow flex items-center justify-center border border-[#2f6f1c]"
              title="Back"
            >
              ◀
            </button>
            <button
              onClick={() => sound.playClick('bubble')}
              className="w-6 h-6 rounded-full bg-gradient-to-b from-[#b8dca5] to-[#8ebf76] text-white/70 font-bold text-xs flex items-center justify-center border border-[#7ca865]"
              title="Forward"
            >
              ▶
            </button>
            <button
              onClick={() => {
                sound.playClick('bubble');
                triggerAjaxSimulation('Reloading DOM tree via AJAX cache');
              }}
              className="w-6 h-6 rounded bg-white hover:bg-slate-100 border border-[#7f9db9] text-blue-700 flex items-center justify-center font-bold text-sm"
              title="Reload"
            >
              🔄
            </button>
            <button
              onClick={() => {
                sound.playClick('bubble');
                setIsAjaxLoading(false);
                setAjaxStatusText('Stopped by user');
              }}
              className="w-6 h-6 rounded bg-white hover:bg-slate-100 border border-[#7f9db9] text-red-600 flex items-center justify-center font-bold text-sm"
              title="Stop"
            >
              ⏹️
            </button>
          </div>

          {/* Address URL Pill Bar */}
          <div className="flex-1 min-w-[220px] flex items-center bg-white border border-[#7f9db9] rounded-md px-2 py-1 shadow-inner">
            <span className="text-slate-400 mr-1.5 text-xs">🔒</span>
            <input
              type="text"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              className="flex-1 text-xs text-slate-800 focus:outline-none font-mono"
            />
            {/* Authentic Firefox 1.5 RSS Live Bookmarks Orange Icon */}
            <button
              onClick={() => {
                sound.playRssChime();
                setActiveTab('rss');
              }}
              className="ml-1 px-1.5 py-0.5 rounded bg-[#ff6600] hover:bg-[#ff7711] text-white text-[10px] font-bold flex items-center gap-1 shadow-sm animate-pulse"
              title="Subscribe to RSS 2.0 Live Bookmarks Feed!"
            >
              <span>📡</span>
              <span>RSS</span>
            </button>
          </div>

          {/* Built-in Google Search Bar (Firefox 1.5 trademark!) */}
          <div className="w-48 flex items-center bg-white border border-[#7f9db9] rounded-md px-2 py-1 shadow-inner">
            <span className="text-[11px] mr-1 font-bold">
              <span className="text-blue-500">G</span>
              <span className="text-red-500">o</span>
              <span className="text-amber-500">o</span>
              <span className="text-blue-500">g</span>
              <span className="text-green-500">l</span>
              <span className="text-red-500">e</span>
            </span>
            <input
              type="text"
              placeholder="Search Web..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs text-slate-800 focus:outline-none"
            />
            <span className="text-slate-400 text-xs cursor-pointer">🔍</span>
          </div>
        </div>

        {/* Live Bookmarks Toolbar */}
        <div className="bg-[#f5f4ef] border-b border-[#aca899] px-3 py-1 flex items-center gap-3 text-[11px] text-slate-700">
          <span className="font-semibold text-slate-500">Bookmarks:</span>
          <button
            onClick={() => {
              sound.playClick('bubble');
              setActiveTab('digg');
            }}
            className="hover:underline flex items-center gap-1 font-medium"
          >
            ⛏️ Digg Frontpage
          </button>
          <button
            onClick={() => {
              sound.playClick('bubble');
              setActiveTab('youtube');
            }}
            className="hover:underline flex items-center gap-1 font-medium text-red-600"
          >
            📹 YouTube
          </button>
          <button
            onClick={() => {
              sound.playClick('bubble');
              setActiveTab('thefacebook');
            }}
            className="hover:underline flex items-center gap-1 font-medium text-blue-700"
          >
            🎓 Thefacebook
          </button>
          <button
            onClick={() => {
              sound.playClick('bubble');
              setActiveTab('googlemaps');
            }}
            className="hover:underline flex items-center gap-1 font-medium text-emerald-700"
          >
            🗺️ Google Maps
          </button>
          <button
            onClick={() => {
              sound.playClick('bubble');
              setActiveTab('myspace');
            }}
            className="hover:underline flex items-center gap-1 font-medium"
          >
            👤 MySpace (Top 8)
          </button>
          <button
            onClick={() => {
              sound.playClick('bubble');
              setActiveTab('flickr');
            }}
            className="hover:underline flex items-center gap-1 font-medium"
          >
            📸 Flickr Photos
          </button>
          <button
            onClick={() => {
              sound.playRssChime();
              setActiveTab('rss');
            }}
            className="hover:underline flex items-center gap-1 font-medium text-orange-600"
          >
            📡 Slashdot Feed
          </button>
          <div className="ml-auto flex items-center gap-2">
            {isAjaxLoading && (
              <span className="flex items-center gap-1 text-[10px] text-blue-700 font-mono">
                <span className="w-2.5 h-2.5 rounded-full border-2 border-blue-600 border-t-transparent animate-spin" />
                AJAX (XMLHttpRequest)
              </span>
            )}
            <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded border border-amber-300 font-mono">
              Web 2.0 Mode
            </span>
          </div>
        </div>

        {/* BROWSER CONTENT CANVAS */}
        <div className="min-h-[640px] bg-[#f4f7fb] p-3 sm:p-5">
          {/* ======================= TAB 1: DIGG.COM ======================= */}
          {activeTab === 'digg' && (
            <div className="max-w-5xl mx-auto space-y-4">
              {/* Digg Top Header Bar */}
              <div className="bg-[#1b3f73] text-white p-3 sm:p-4 rounded-xl shadow-md flex flex-wrap items-center justify-between gap-3 web20-gloss">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-[#ffcc00] to-[#ff9900] flex items-center justify-center text-xl font-black text-[#1b3f73] shadow">
                    ⛏️
                  </div>
                  <div>
                    <div className="text-2xl font-black tracking-tight flex items-center gap-1">
                      digg<span className="text-amber-400">.com</span>
                    </div>
                    <p className="text-[11px] text-blue-200">
                      All the news, none of the wait. Powered by community consensus.
                    </p>
                  </div>
                </div>

                {/* Submit Story & Fast Filter */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      sound.playClick('bubble');
                      setShowSubmitModal(true);
                    }}
                    className="px-3.5 py-1.5 rounded-full text-xs font-bold text-white web20-badge-beta shadow hover:scale-105 transition-transform flex items-center gap-1.5"
                  >
                    <span>➕</span>
                    <span>Submit a New Story</span>
                  </button>
                  <button
                    onClick={() => {
                      sound.playDigg();
                      triggerAjaxSimulation('All stories re-sorted by highest Digg count');
                      setStories([...stories].sort((a, b) => b.diggs - a.diggs));
                    }}
                    className="px-3 py-1.5 rounded-full text-xs font-semibold bg-white/15 hover:bg-white/25 text-white transition-all"
                  >
                    🔥 Top Popular
                  </button>
                </div>
              </div>

              {/* Digg Categories & Del.icio.us Tag Cloud Filter */}
              <div className="bg-white p-3 rounded-xl border border-[#c9d7e8] shadow-sm flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-1 text-xs">
                  <span className="font-bold text-slate-500 mr-1">Categories:</span>
                  {(['All', 'Tech', 'Science', 'Gaming', 'Apple', 'World'] as const).map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        sound.playClick('bubble');
                        setDiggCategory(cat);
                        triggerAjaxSimulation(`Filtered by category: ${cat}`);
                      }}
                      className={`px-2.5 py-1 rounded-full font-medium transition-all ${
                        diggCategory === cat
                          ? 'bg-[#2962ff] text-white shadow-sm font-bold'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Selected Tag Clear Badge */}
                {selectedTag && (
                  <div className="flex items-center gap-1 text-xs bg-orange-100 text-orange-800 px-2 py-0.5 rounded-full border border-orange-300">
                    <span>Tag: <strong>#{selectedTag}</strong></span>
                    <button
                      onClick={() => setSelectedTag(null)}
                      className="ml-1 hover:text-red-700 font-bold"
                    >
                      ✕
                    </button>
                  </div>
                )}
              </div>

              {/* Main Content Layout: Stories Stream + Sidebar */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                {/* Digg Stories Feed (2 Cols) */}
                <div className="lg:col-span-2 space-y-3">
                  {filteredStories.length === 0 ? (
                    <div className="bg-white rounded-xl p-8 text-center text-slate-500 border border-slate-200">
                      <p className="text-base font-semibold">No stories found matching your filter.</p>
                      <button
                        onClick={() => {
                          setDiggCategory('All');
                          setSelectedTag(null);
                          setSearchQuery('');
                        }}
                        className="mt-2 text-xs text-blue-600 underline"
                      >
                        Reset filters
                      </button>
                    </div>
                  ) : (
                    filteredStories.map((story, index) => (
                      <div
                        key={story.id}
                        className="bg-white rounded-xl p-3.5 sm:p-4 border border-[#c9d7e8] shadow-sm hover:shadow-md transition-shadow flex gap-3.5 sm:gap-4 items-start"
                      >
                        {/* Authentic Digg Counter & Button */}
                        <div className="flex flex-col items-center">
                          <button
                            onClick={() => handleDigg(story.id)}
                            className={`w-14 sm:w-16 py-1.5 px-1 rounded-lg border flex flex-col items-center justify-center transition-all ${
                              story.dugg
                                ? 'bg-gradient-to-b from-[#ffd54f] to-[#ffb300] border-[#f57f17] text-slate-900 shadow-inner'
                                : 'bg-gradient-to-b from-[#ffffff] to-[#f0f4f9] hover:from-[#fdf8e2] hover:to-[#ffe082] border-[#78909c] text-slate-800 shadow-sm'
                            }`}
                            title="Click to Digg this story!"
                          >
                            <span className="text-[10px] font-mono uppercase tracking-tight text-slate-600">
                              {story.dugg ? 'DUGG' : 'DIGG'}
                            </span>
                            <span className="text-base sm:text-lg font-black leading-none my-0.5">
                              {story.diggs.toLocaleString()}
                            </span>
                            <span className="text-[9px] text-blue-700 font-semibold">
                              {story.dugg ? '✓ Dugg it' : 'digg it'}
                            </span>
                          </button>
                          <span className="text-[10px] font-mono text-slate-400 mt-1">#{index + 1}</span>
                        </div>

                        {/* Story Content Details */}
                        <div className="flex-1 space-y-1.5">
                          <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                            <span className="px-2 py-0.2 rounded-full font-bold bg-blue-100 text-blue-800">
                              {story.category}
                            </span>
                            <span className="text-slate-400 font-mono">({story.domain})</span>
                            <span className="text-slate-500 ml-auto">{story.timestamp}</span>
                          </div>

                          <h3 className="text-base font-bold text-[#102a43] hover:text-[#2962ff] cursor-pointer leading-snug">
                            <a href={story.url} target="_blank" rel="noopener noreferrer">
                              {story.title}
                            </a>
                          </h3>

                          <p className="text-xs text-slate-600 leading-relaxed">{story.description}</p>

                          {/* Story Tags & Actions Bar */}
                          <div className="pt-1.5 flex flex-wrap items-center gap-2 text-xs border-t border-slate-100">
                            <span className="text-slate-400 text-[11px]">by <strong>{story.author}</strong></span>
                            <span className="text-slate-300">•</span>

                            {/* Tags */}
                            <div className="flex flex-wrap items-center gap-1">
                              {story.tags.map((t) => (
                                <button
                                  key={t}
                                  onClick={() => {
                                    sound.playClick('bubble');
                                    setSelectedTag(t);
                                  }}
                                  className="text-[10px] text-blue-600 hover:text-blue-800 bg-blue-50 px-1.5 py-0.5 rounded"
                                >
                                  #{t}
                                </button>
                              ))}
                            </div>

                            <span className="text-slate-300">•</span>

                            {/* Expand Comments Button */}
                            <button
                              onClick={() => {
                                sound.playClick('bubble');
                                setExpandedComments((prev) => ({ ...prev, [story.id]: !prev[story.id] }));
                              }}
                              className="text-xs font-semibold text-[#ff6600] hover:underline flex items-center gap-1 ml-auto"
                            >
                              <span>💬</span>
                              <span>{story.commentsCount} comments</span>
                            </button>
                          </div>

                          {/* Expandable AJAX Comment Thread */}
                          {expandedComments[story.id] && (
                            <div className="mt-3 pt-3 border-t-2 border-slate-100 space-y-2 bg-slate-50 p-3 rounded-lg">
                              <h4 className="text-xs font-bold text-slate-700 flex items-center justify-between">
                                <span>Discussion ({story.comments.length})</span>
                                <span className="text-[10px] text-slate-400 font-normal">Updated via AJAX</span>
                              </h4>

                              {story.comments.map((comment) => (
                                <div key={comment.id} className="bg-white p-2 rounded border border-slate-200 text-xs space-y-1">
                                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                                    <span className="font-bold text-blue-800">👤 {comment.author}</span>
                                    <span>{comment.time}</span>
                                  </div>
                                  <p className="text-slate-700">{comment.text}</p>
                                </div>
                              ))}

                              {/* Add Comment Form */}
                              <div className="flex gap-2 pt-1">
                                <input
                                  type="text"
                                  placeholder="Write a comment without page reload..."
                                  value={newCommentText[story.id] || ''}
                                  onChange={(e) =>
                                    setNewCommentText((prev) => ({ ...prev, [story.id]: e.target.value }))
                                  }
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') handleAddComment(story.id);
                                  }}
                                  className="flex-1 text-xs px-2.5 py-1 rounded border border-slate-300 bg-white focus:outline-none focus:border-blue-500"
                                />
                                <button
                                  onClick={() => handleAddComment(story.id)}
                                  className="px-3 py-1 bg-[#2962ff] text-white text-xs font-bold rounded hover:bg-blue-700 transition-colors"
                                >
                                  Post
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Digg Sidebar: Del.icio.us Tag Cloud & Stats */}
                <div className="space-y-4">
                  {/* Del.icio.us / Flickr Dynamic Tag Cloud */}
                  <div className="bg-white p-4 rounded-xl border border-[#c9d7e8] shadow-sm space-y-2.5">
                    <div className="flex items-center justify-between border-b pb-2">
                      <h4 className="text-xs font-bold text-[#102a43] flex items-center gap-1.5">
                        <span>🏷️</span>
                        <span>Del.icio.us Tag Cloud</span>
                      </h4>
                      <span className="text-[10px] text-slate-400 font-mono">Weighted</span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Font size reflects popularity across 2005 social bookmarks:
                    </p>
                    <div className="flex flex-wrap gap-1.5 items-center justify-center p-2 bg-slate-50 rounded-lg">
                      {ALL_TAGS.map((tag) => {
                        const isSelected = selectedTag === tag.name;
                        return (
                          <button
                            key={tag.name}
                            onClick={() => {
                              sound.playClick('bubble');
                              setSelectedTag(isSelected ? null : tag.name);
                              triggerAjaxSimulation(`Tag cloud clicked: #${tag.name}`);
                            }}
                            style={{ fontSize: `${Math.max(11, tag.weight * 0.75)}px` }}
                            className={`font-semibold px-1 py-0.5 rounded transition-all hover:scale-110 ${
                              isSelected
                                ? 'bg-[#ff6600] text-white'
                                : 'text-[#2962ff] hover:text-[#ff6600]'
                            }`}
                          >
                            {tag.name}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Web 2.0 Architectural Stats */}
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-200 shadow-sm space-y-2 text-xs">
                    <h4 className="font-bold text-blue-950 flex items-center gap-1.5">
                      <span>💡</span>
                      <span>2005 Tech Highlights</span>
                    </h4>
                    <ul className="space-y-1.5 text-blue-900 text-[11px]">
                      <li className="flex items-start gap-1">
                        <span>•</span>
                        <span><strong>AJAX:</strong> Coined by Jesse James Garrett in Feb 2005. Asynchronous web apps without white screen flashes.</span>
                      </li>
                      <li className="flex items-start gap-1">
                        <span>•</span>
                        <span><strong>Ruby on Rails:</strong> Created by DHH from Basecamp codebase, released v1.0 in Dec 2005.</span>
                      </li>
                      <li className="flex items-start gap-1">
                        <span>•</span>
                        <span><strong>YouTube:</strong> First video "Me at the zoo" uploaded April 23, 2005.</span>
                      </li>
                      <li className="flex items-start gap-1">
                        <span>•</span>
                        <span><strong>Flickr & Yahoo:</strong> Pioneer of folksonomy tagging and API mashups.</span>
                      </li>
                    </ul>
                  </div>

                  {/* Web 2.0 Badge Preview Card */}
                  <div className="bg-white p-4 rounded-xl border border-[#c9d7e8] shadow-sm text-center space-y-2">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      Badge of the Era
                    </span>
                    <div className="flex justify-center">
                      <div className="web20-badge-beta px-4 py-1.5 rounded-full font-black text-sm tracking-wide shadow-md web20-gloss inline-block">
                        WEB 2.0 BETA
                      </div>
                    </div>
                    <p className="text-[10px] text-slate-500">
                      Permanent BETA stickers symbolized perpetual agile iteration!
                    </p>
                  </div>
                </div>
              </div>

              {/* Submit Story Modal */}
              {showSubmitModal && (
                <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 backdrop-blur-sm">
                  <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-blue-200 space-y-4">
                    <div className="flex items-center justify-between border-b pb-3">
                      <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                        <span>⛏️</span>
                        <span>Submit a Story to Digg (AJAX)</span>
                      </h3>
                      <button
                        onClick={() => setShowSubmitModal(false)}
                        className="text-slate-400 hover:text-black font-bold"
                      >
                        ✕
                      </button>
                    </div>

                    <form onSubmit={handleSubmitStory} className="space-y-3 text-xs">
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">Story Title *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Google reveals secret project Android"
                          value={submitTitle}
                          onChange={(e) => setSubmitTitle(e.target.value)}
                          className="w-full px-3 py-1.5 rounded-lg border border-slate-300 focus:outline-none focus:border-blue-500"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block font-semibold text-slate-700 mb-1">Website URL</label>
                          <input
                            type="text"
                            placeholder="http://www.example.com"
                            value={submitUrl}
                            onChange={(e) => setSubmitUrl(e.target.value)}
                            className="w-full px-3 py-1.5 rounded-lg border border-slate-300 focus:outline-none focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block font-semibold text-slate-700 mb-1">Category</label>
                          <select
                            value={submitCategory}
                            onChange={(e) => setSubmitCategory(e.target.value as typeof submitCategory)}
                            className="w-full px-2 py-1.5 rounded-lg border border-slate-300 bg-white"
                          >
                            <option value="Tech">Technology</option>
                            <option value="Science">Science</option>
                            <option value="Gaming">Gaming</option>
                            <option value="Apple">Apple</option>
                            <option value="World">World News</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">Description</label>
                        <textarea
                          rows={3}
                          placeholder="Provide a short synopsis for fellow Diggers..."
                          value={submitDesc}
                          onChange={(e) => setSubmitDesc(e.target.value)}
                          className="w-full px-3 py-1.5 rounded-lg border border-slate-300 focus:outline-none focus:border-blue-500"
                        />
                      </div>

                      <div className="pt-2 flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setShowSubmitModal(false)}
                          className="px-3.5 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-1.5 rounded-lg font-bold text-white bg-[#2962ff] hover:bg-blue-700 shadow"
                        >
                          Submit via XMLHttpRequest 🚀
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ======================= TAB: YOUTUBE 2005 ======================= */}
          {activeTab === 'youtube' && (
            <div className="max-w-5xl mx-auto">
              <YouTube2005 />
            </div>
          )}

          {/* ======================= TAB: THEFACEBOOK 2005 ======================= */}
          {activeTab === 'thefacebook' && (
            <div className="max-w-5xl mx-auto">
              <Thefacebook2005 />
            </div>
          )}

          {/* ======================= TAB: GOOGLE MAPS 2005 ======================= */}
          {activeTab === 'googlemaps' && (
            <div className="max-w-5xl mx-auto">
              <GoogleMaps2005 />
            </div>
          )}

          {/* ======================= TAB 2: MYSPACE ======================= */}
          {activeTab === 'myspace' && (
            <div
              className={`max-w-4xl mx-auto rounded-2xl p-4 sm:p-6 shadow-xl transition-colors border ${
                myspaceTheme === 'classic'
                  ? 'bg-white text-slate-800 border-blue-200'
                  : myspaceTheme === 'scene'
                  ? 'bg-black text-cyan-300 border-pink-500'
                  : myspaceTheme === 'pink'
                  ? 'bg-pink-50 text-pink-900 border-pink-300'
                  : 'bg-slate-900 text-red-200 border-red-900'
              }`}
            >
              {/* MySpace Classic Top Navigation Bar */}
              <div className="bg-[#003399] text-white p-2.5 rounded-lg flex flex-wrap items-center justify-between gap-2 text-xs font-medium shadow mb-4">
                <div className="flex items-center gap-2 font-black text-base tracking-tighter">
                  <span>MySpace.com</span>
                  <span className="text-[10px] font-normal text-blue-200">| a place for friends</span>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-[11px]">
                  <span className="hover:underline cursor-pointer">Home</span>
                  <span className="hover:underline cursor-pointer">Browse</span>
                  <span className="hover:underline cursor-pointer">Search</span>
                  <span className="hover:underline cursor-pointer">Invite</span>
                  <span className="hover:underline cursor-pointer">Film</span>
                  <span className="hover:underline cursor-pointer">Mail</span>
                  <span className="hover:underline cursor-pointer">Blog</span>
                  <span className="hover:underline cursor-pointer">Favorites</span>
                </div>
              </div>

              {/* Theme / CSS Skin Switcher */}
              <div className="bg-slate-100 text-slate-800 p-2.5 rounded-lg border border-slate-300 mb-5 flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold">🎨 Profile Skin (CSS Hack):</span>
                  {(['classic', 'scene', 'pink', 'gothic'] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => {
                        sound.playClick('bubble');
                        setMyspaceTheme(t);
                        triggerAjaxSimulation(`MySpace CSS skin switched to ${t}`);
                      }}
                      className={`px-2 py-0.5 rounded capitalize font-medium ${
                        myspaceTheme === t ? 'bg-[#003399] text-white font-bold' : 'bg-white hover:bg-slate-200'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-1">
                  <span className="font-bold">Mood:</span>
                  <select
                    value={userMood}
                    onChange={(e) => {
                      setUserMood(e.target.value);
                      sound.playClick('bubble');
                    }}
                    className="bg-white border rounded px-1.5 py-0.5 text-xs"
                  >
                    <option value="Hyped :D">Hyped :D</option>
                    <option value="Listening to Music 🎧">Listening to Music 🎧</option>
                    <option value="Coding Rails 💻">Coding Rails 💻</option>
                    <option value="Bored -_-">Bored -_-</option>
                    <option value="Excited! ^_^">Excited! ^_^</option>
                  </select>
                </div>
              </div>

              {/* Tom Anderson Top Friend Banner */}
              <div className="bg-amber-100 border border-amber-300 text-amber-900 p-2 rounded-lg text-xs flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-base">👨‍💼</span>
                  <span>
                    <strong>Tom Anderson</strong> is your first friend on MySpace! (User ID: 1)
                  </span>
                </div>
                <span className="text-[10px] text-amber-700">Online Now</span>
              </div>

              {/* Profile Grid: Left Column Info + Right Column Top 8 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Left Column: User Card & Audio Player */}
                <div className="space-y-4">
                  {/* User Profile Card */}
                  <div
                    className={`p-4 rounded-xl border ${
                      myspaceTheme === 'scene'
                        ? 'bg-neutral-900 border-pink-500'
                        : myspaceTheme === 'gothic'
                        ? 'bg-neutral-950 border-red-900'
                        : 'bg-white border-slate-200 shadow-sm'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-16 h-16 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-700 flex items-center justify-center text-3xl shadow">
                        👾
                      </div>
                      <div>
                        <h2 className={`text-base font-black ${myspaceTheme === 'scene' ? 'myspace-glitter' : ''}`}>
                          Alex (Web 2.0 Kid)
                        </h2>
                        <p className="text-[11px] text-slate-500">"Online Now!"</p>
                        <p className="text-[11px] text-slate-500">San Francisco, California</p>
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t border-slate-200/50 text-[11px] space-y-1">
                      <p><strong>Current Mood:</strong> {userMood}</p>
                      <p><strong>Network:</strong> In Your Extended Network</p>
                      <p><strong>Profile Views:</strong> 13,420</p>
                    </div>

                    {/* Retro Contact Box */}
                    <div className="mt-4 bg-slate-100/70 p-2.5 rounded-lg border border-slate-200 text-xs space-y-1 text-blue-800">
                      <div className="font-bold text-slate-700 border-b pb-1 text-[11px]">Contacting Alex:</div>
                      <div className="grid grid-cols-2 gap-1 text-[11px]">
                        <span className="hover:underline cursor-pointer">✉️ Send Message</span>
                        <span className="hover:underline cursor-pointer">➕ Add to Friends</span>
                        <span className="hover:underline cursor-pointer">⭐ Add to Favorites</span>
                        <span className="hover:underline cursor-pointer">💬 Instant Message</span>
                      </div>
                    </div>
                  </div>

                  {/* MySpace Embedded Flash MP3 Player */}
                  <div className="bg-[#1e293b] text-white p-3.5 rounded-xl border-2 border-slate-700 shadow-lg space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono tracking-wider text-cyan-400 font-bold uppercase flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                        MySpace Music Player 2.0
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">128kbps MP3</span>
                    </div>

                    {/* Track Info */}
                    <div className="bg-black/40 p-2 rounded border border-slate-700 text-xs font-mono">
                      <div className="text-cyan-300 font-bold truncate">
                        {TRACKS[currentTrackIndex].title}
                      </div>
                      <div className="text-[10px] text-slate-400">Synthesized Web Audio Engine</div>
                    </div>

                    {/* Equalizer Visualizer Bars */}
                    <div className="h-9 flex items-end justify-between gap-1 px-1 bg-black/60 rounded p-1">
                      {equalizerBars.map((height, idx) => (
                        <div
                          key={idx}
                          style={{ height: musicPlaying ? `${height}%` : '15%' }}
                          className={`flex-1 rounded-t transition-all duration-100 ${
                            height > 80
                              ? 'bg-red-400'
                              : height > 50
                              ? 'bg-amber-400'
                              : 'bg-cyan-400'
                          }`}
                        />
                      ))}
                    </div>

                    {/* Player Controls */}
                    <div className="flex items-center justify-between pt-1">
                      <button
                        onClick={() => {
                          setCurrentTrackIndex((prev) => (prev > 0 ? prev - 1 : TRACKS.length - 1));
                          sound.playClick('bubble');
                        }}
                        className="text-xs hover:text-cyan-300 px-1"
                      >
                        ⏮️
                      </button>

                      <button
                        onClick={toggleMySpaceMusic}
                        className={`px-4 py-1 rounded-full text-xs font-bold transition-all shadow ${
                          musicPlaying
                            ? 'bg-red-600 hover:bg-red-500 text-white'
                            : 'bg-cyan-500 hover:bg-cyan-400 text-black'
                        }`}
                      >
                        {musicPlaying ? '⏸️ PAUSE' : '▶️ PLAY PROFILE SONG'}
                      </button>

                      <button
                        onClick={() => {
                          setCurrentTrackIndex((prev) => (prev < TRACKS.length - 1 ? prev + 1 : 0));
                          sound.playClick('bubble');
                        }}
                        className="text-xs hover:text-cyan-300 px-1"
                      >
                        ⏭️
                      </button>
                    </div>
                  </div>
                </div>

                {/* Right Column: Bio + Interactive Top 8 Friends */}
                <div className="md:col-span-2 space-y-4">
                  {/* About Me / Blurb */}
                  <div
                    className={`p-4 rounded-xl border ${
                      myspaceTheme === 'scene'
                        ? 'bg-neutral-900 border-pink-500'
                        : myspaceTheme === 'gothic'
                        ? 'bg-neutral-950 border-red-900'
                        : 'bg-white border-slate-200 shadow-sm'
                    }`}
                  >
                    <div className="flex items-center justify-between border-b pb-2 mb-2">
                      <h3 className="text-sm font-black uppercase text-[#ff6600]">Alex's Blurb</h3>
                      <button
                        onClick={() => setIsEditingBio(!isEditingBio)}
                        className="text-[11px] text-blue-600 hover:underline"
                      >
                        {isEditingBio ? 'Save HTML' : 'Edit Blurb'}
                      </button>
                    </div>

                    {isEditingBio ? (
                      <div className="space-y-2">
                        <textarea
                          rows={3}
                          value={myBio}
                          onChange={(e) => setMyBio(e.target.value)}
                          className="w-full text-xs p-2 border rounded font-mono bg-white text-black"
                        />
                        <button
                          onClick={() => {
                            setIsEditingBio(false);
                            sound.playWeb20Pop();
                          }}
                          className="px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded"
                        >
                          Update Profile
                        </button>
                      </div>
                    ) : (
                      <p className="text-xs leading-relaxed">{myBio}</p>
                    )}
                  </div>

                  {/* INTERACTIVE TOP 8 FRIENDS GRID */}
                  <div
                    className={`p-4 rounded-xl border ${
                      myspaceTheme === 'scene'
                        ? 'bg-neutral-900 border-pink-500'
                        : myspaceTheme === 'gothic'
                        ? 'bg-neutral-950 border-red-900'
                        : 'bg-white border-slate-200 shadow-sm'
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between border-b pb-2 mb-3">
                      <div>
                        <h3 className="text-sm font-black uppercase text-[#003399]">
                          Alex's Friend Space (Top 8)
                        </h3>
                        <p className="text-[11px] text-slate-500">
                          Alex has <strong className="text-blue-600">428</strong> friends. (Click or drag to swap friend ranking!)
                        </p>
                      </div>
                      <span className="text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full font-bold">
                        Interactive Ranking
                      </span>
                    </div>

                    {/* 4x2 Grid of Top 8 */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {friends.slice(0, 8).map((friend, idx) => (
                        <div
                          key={friend.id}
                          draggable
                          onDragStart={() => setDraggedFriendIdx(idx)}
                          onDragOver={(e) => e.preventDefault()}
                          onDrop={() => {
                            if (draggedFriendIdx !== null && draggedFriendIdx !== idx) {
                              handleFriendSwap(draggedFriendIdx, idx);
                              setDraggedFriendIdx(null);
                            }
                          }}
                          className="group relative bg-slate-50 hover:bg-amber-50 p-2 rounded-lg border border-slate-200 text-center transition-all cursor-move hover:shadow-md"
                        >
                          <div className="absolute top-1 left-1 bg-blue-600 text-white w-4 h-4 rounded-full text-[9px] font-black flex items-center justify-center">
                            #{idx + 1}
                          </div>

                          <div className="w-12 h-12 mx-auto rounded-lg bg-white border border-slate-300 flex items-center justify-center text-2xl shadow-sm my-1 group-hover:scale-105 transition-transform">
                            {friend.avatar}
                          </div>

                          <div className="font-bold text-xs truncate text-[#003399] group-hover:text-amber-700">
                            {friend.name}
                          </div>
                          <div className="text-[10px] text-slate-500 truncate">{friend.role}</div>

                          {/* Friend Quote Tooltip / Status */}
                          <div className="mt-1 text-[9px] text-slate-400 italic truncate">
                            "{friend.quote}"
                          </div>

                          {/* Quick Swap Buttons */}
                          <div className="mt-1 flex justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            {idx > 0 && (
                              <button
                                onClick={() => handleFriendSwap(idx, idx - 1)}
                                className="text-[10px] bg-white border px-1 rounded hover:bg-slate-200"
                                title="Move up"
                              >
                                ◀
                              </button>
                            )}
                            {idx < 7 && (
                              <button
                                onClick={() => handleFriendSwap(idx, idx + 1)}
                                className="text-[10px] bg-white border px-1 rounded hover:bg-slate-200"
                                title="Move down"
                              >
                                ▶
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-3 text-center">
                      <button
                        onClick={() => {
                          sound.playCelebration();
                          triggerAjaxSimulation('Top 8 friends lock verified!');
                          confetti({ particleCount: 30, spread: 60 });
                        }}
                        className="text-xs text-blue-600 hover:underline font-bold"
                      >
                        ⭐ View All 428 Friends in Network
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ======================= TAB 3: FLICKR ======================= */}
          {activeTab === 'flickr' && (
            <div className="max-w-4xl mx-auto space-y-4">
              {/* Flickr Header */}
              <div className="bg-white p-4 rounded-xl border border-[#c9d7e8] shadow-sm flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <div className="text-2xl font-black tracking-tight">
                    <span className="text-[#0063dc]">flick</span>
                    <span className="text-[#ff0084]">r</span>
                  </div>
                  <span className="text-xs text-slate-400 border-l pl-2">
                    Share your photos with the world • 2005 Archive
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      sound.playClick('bubble');
                      setShowNoteInput(!showNoteInput);
                    }}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold bg-[#ff0084] text-white hover:bg-pink-600 shadow"
                  >
                    ✏️ {showNoteInput ? 'Cancel Note' : 'Add Note to Photo'}
                  </button>
                </div>
              </div>

              {/* Photo Selector Thumbnails */}
              <div className="flex gap-3 overflow-x-auto pb-2">
                {flickrPhotos.map((photo) => (
                  <div
                    key={photo.id}
                    onClick={() => {
                      sound.playClick('bubble');
                      setActivePhotoId(photo.id);
                    }}
                    className={`cursor-pointer rounded-lg border-2 p-1 bg-white transition-all min-w-[140px] ${
                      activePhotoId === photo.id
                        ? 'border-[#ff0084] shadow-md scale-105'
                        : 'border-transparent hover:border-slate-300 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={photo.imageUrl}
                      alt={photo.title}
                      className="w-full h-20 object-cover rounded"
                    />
                    <div className="text-[11px] font-bold text-slate-700 truncate mt-1">
                      {photo.title}
                    </div>
                  </div>
                ))}
              </div>

              {/* Active Flickr Photo Canvas with Yellow Interactive Notes */}
              {(() => {
                const currentPhoto = flickrPhotos.find((p) => p.id === activePhotoId) || flickrPhotos[0];
                return (
                  <div className="bg-white p-4 rounded-xl border border-[#c9d7e8] shadow-md space-y-3">
                    <div className="flex items-center justify-between border-b pb-2">
                      <div>
                        <h3 className="text-base font-bold text-slate-900">{currentPhoto.title}</h3>
                        <p className="text-xs text-slate-500">{currentPhoto.caption}</p>
                      </div>
                      <span className="text-xs text-slate-400 font-mono">
                        👁️ {currentPhoto.views.toLocaleString()} views
                      </span>
                    </div>

                    {/* Photo Container with Note Overlay */}
                    <div
                      onClick={(e) => {
                        if (showNoteInput) {
                          const rect = e.currentTarget.getBoundingClientRect();
                          const clickX = ((e.clientX - rect.left) / rect.width) * 100;
                          const clickY = ((e.clientY - rect.top) / rect.height) * 100;
                          setNoteCoord({ x: Math.round(clickX), y: Math.round(clickY) });
                        }
                      }}
                      className="relative rounded-lg overflow-hidden border border-slate-300 max-h-[480px] flex items-center justify-center bg-black group select-none"
                    >
                      <img
                        src={currentPhoto.imageUrl}
                        alt={currentPhoto.title}
                        className="w-full h-auto max-h-[460px] object-contain"
                      />

                      {/* Flickr Yellow Hover Sticky Notes */}
                      {currentPhoto.notes.map((note) => (
                        <div
                          key={note.id}
                          style={{
                            left: `${note.x}%`,
                            top: `${note.y}%`,
                            width: `${note.width}%`,
                            height: `${note.height}%`
                          }}
                          className="absolute border-2 border-dashed border-amber-300 hover:border-solid hover:border-amber-400 hover:bg-amber-300/30 transition-all cursor-pointer group/note"
                        >
                          <div className="hidden group-hover/note:block absolute -top-9 left-0 z-20 bg-[#fffbe6] text-black text-[11px] p-1.5 rounded shadow-lg border border-amber-400 font-medium whitespace-nowrap">
                            {note.text}
                          </div>
                        </div>
                      ))}

                      {/* Note Placement Indicator */}
                      {showNoteInput && (
                        <div
                          style={{ left: `${noteCoord.x}%`, top: `${noteCoord.y}%` }}
                          className="absolute w-24 h-16 border-2 border-[#ff0084] bg-pink-500/20 pointer-events-none -translate-x-1/2 -translate-y-1/2 flex items-center justify-center text-[10px] text-white font-bold"
                        >
                          New Note Box
                        </div>
                      )}
                    </div>

                    {/* Note Creation Form Bar */}
                    {showNoteInput && (
                      <div className="p-3 bg-amber-50 rounded-lg border border-amber-300 flex flex-wrap gap-2 items-center text-xs">
                        <span className="font-bold text-amber-900">
                          Click photo to reposition note, then type text:
                        </span>
                        <input
                          type="text"
                          placeholder="e.g. Steve Jobs' black mock turtleneck"
                          value={newNoteText}
                          onChange={(e) => setNewNoteText(e.target.value)}
                          className="flex-1 min-w-[200px] px-2 py-1 rounded border border-amber-400 bg-white"
                        />
                        <button
                          onClick={handleAddFlickrNote}
                          className="px-3 py-1 bg-[#ff0084] text-white font-bold rounded hover:bg-pink-600"
                        >
                          Save Annotation
                        </button>
                      </div>
                    )}

                    {/* Tags Bar */}
                    <div className="flex flex-wrap items-center gap-1.5 pt-1 text-xs">
                      <span className="text-slate-400 font-bold">Tags:</span>
                      {currentPhoto.tags.map((tag) => (
                        <span key={tag} className="bg-slate-100 text-blue-700 px-2 py-0.5 rounded text-[11px]">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {/* ======================= TAB 4: RSS READER ======================= */}
          {activeTab === 'rss' && (
            <div className="max-w-4xl mx-auto space-y-4">
              {/* Reader Header */}
              <div className="bg-gradient-to-r from-[#ff6600] to-[#e65c00] text-white p-4 rounded-xl shadow flex flex-wrap items-center justify-between gap-3 web20-gloss">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-lg bg-white/20 flex items-center justify-center text-xl">
                    📡
                  </div>
                  <div>
                    <h3 className="text-lg font-black tracking-tight">Google Reader (RSS 2.0 Feed Engine)</h3>
                    <p className="text-[11px] text-orange-100">
                      Live syndicated XML feeds delivered via asynchronous polling.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      sound.playRssChime();
                      triggerAjaxSimulation('Polling 4 RSS feeds for fresh XML nodes');
                      confetti({ particleCount: 20, spread: 50 });
                    }}
                    className="px-3 py-1.5 rounded-lg bg-white text-orange-700 font-bold text-xs shadow hover:bg-orange-50 transition-all flex items-center gap-1"
                  >
                    <span>🔄</span>
                    <span>Fetch New Feeds</span>
                  </button>
                </div>
              </div>

              {/* Filter Tabs */}
              <div className="bg-white p-2.5 rounded-xl border border-[#c9d7e8] shadow-sm flex items-center gap-2 text-xs">
                {(['all', 'unread', 'starred'] as const).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => {
                      sound.playClick('bubble');
                      setRssFilter(filter);
                    }}
                    className={`px-3 py-1 rounded-full font-bold capitalize ${
                      rssFilter === filter
                        ? 'bg-[#ff6600] text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>

              {/* RSS Feed Items List */}
              <div className="space-y-2.5">
                {rssItems
                  .filter((item) => {
                    if (rssFilter === 'unread') return item.unread;
                    if (rssFilter === 'starred') return item.starred;
                    return true;
                  })
                  .map((item) => (
                    <div
                      key={item.id}
                      className={`p-3.5 rounded-xl border transition-all ${
                        item.unread
                          ? 'bg-white border-orange-200 shadow-sm'
                          : 'bg-slate-50 border-slate-200 opacity-80'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs mb-1">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded text-white text-[10px] font-bold ${item.feedColor}`}>
                            {item.feed}
                          </span>
                          <span className="text-slate-400 font-mono text-[11px]">{item.time}</span>
                        </div>
                        <button
                          onClick={() => {
                            sound.playClick('bubble');
                            setRssItems((prev) =>
                              prev.map((r) => (r.id === item.id ? { ...r, starred: !r.starred } : r))
                            );
                          }}
                          className={`text-sm ${item.starred ? 'text-amber-400' : 'text-slate-300 hover:text-amber-400'}`}
                        >
                          ★
                        </button>
                      </div>

                      <h4 className="text-sm font-bold text-slate-900 hover:text-orange-600 cursor-pointer">
                        {item.title}
                      </h4>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">{item.snippet}</p>

                      <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                        <button
                          onClick={() => {
                            sound.playClick('bubble');
                            setRssItems((prev) =>
                              prev.map((r) => (r.id === item.id ? { ...r, unread: !r.unread } : r))
                            );
                          }}
                          className="text-blue-600 hover:underline"
                        >
                          {item.unread ? 'Mark as Read' : 'Mark as Unread'}
                        </button>
                        <span className="text-slate-400">xml • rss 2.0</span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* ======================= TAB 5: BADGE LAB ======================= */}
          {activeTab === 'badgeLab' && (
            <div className="max-w-2xl mx-auto space-y-5">
              <div className="bg-white p-5 rounded-xl border border-[#c9d7e8] shadow-md space-y-4">
                <div className="border-b pb-2">
                  <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                    <span>✨</span>
                    <span>Web 2.0 Glossy Badge Studio</span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    Customize the shiny aqua skeuomorphic badge for this era!
                  </p>
                </div>

                {/* Badge Live Preview */}
                <div className="p-8 bg-slate-900 rounded-xl flex items-center justify-center">
                  <div
                    className={`px-6 py-2.5 rounded-full font-black text-lg tracking-widest uppercase shadow-xl web20-gloss select-none transform hover:scale-110 transition-transform ${
                      badgeColor === 'orange'
                        ? 'web20-badge-beta'
                        : badgeColor === 'blue'
                        ? 'web20-badge-blue'
                        : badgeColor === 'green'
                        ? 'web20-badge-green'
                        : 'bg-purple-700 text-white'
                    }`}
                  >
                    {badgeText} • {badgeSubtext}
                  </div>
                </div>

                {/* Controls */}
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Primary Tag</label>
                    <input
                      type="text"
                      value={badgeText}
                      onChange={(e) => setBadgeText(e.target.value)}
                      className="w-full px-3 py-1.5 rounded border border-slate-300"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Subtext</label>
                    <input
                      type="text"
                      value={badgeSubtext}
                      onChange={(e) => setBadgeSubtext(e.target.value)}
                      className="w-full px-3 py-1.5 rounded border border-slate-300"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-xs text-slate-700 mb-1.5">Aqua Gloss Palette</label>
                  <div className="flex gap-2">
                    {(['orange', 'blue', 'green', 'purple'] as const).map((col) => (
                      <button
                        key={col}
                        onClick={() => {
                          sound.playWeb20Pop();
                          setBadgeColor(col);
                        }}
                        className={`px-3 py-1 rounded-full text-xs font-bold capitalize text-white ${
                          col === 'orange'
                            ? 'bg-orange-600'
                            : col === 'blue'
                            ? 'bg-blue-600'
                            : col === 'green'
                            ? 'bg-emerald-600'
                            : 'bg-purple-600'
                        } ${badgeColor === col ? 'ring-2 ring-offset-2 ring-black font-black' : 'opacity-80'}`}
                      >
                        {col}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between border-t text-xs">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showCornerRibbon}
                      onChange={(e) => setShowCornerRibbon(e.target.checked)}
                      className="rounded text-orange-600"
                    />
                    <span>Pin ribbon to top corner of screen</span>
                  </label>

                  <button
                    onClick={() => {
                      sound.playCelebration();
                      confetti({ particleCount: 35, spread: 60 });
                    }}
                    className="px-3.5 py-1.5 bg-[#2962ff] text-white rounded-lg font-bold hover:bg-blue-700"
                  >
                    🎉 Celebrate Web 2.0
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Firefox 1.5 Status Bar at Bottom */}
        <div className="bg-[#ece9d8] border-t border-[#aca899] px-3 py-1 flex items-center justify-between text-[11px] text-slate-600 font-mono select-none">
          <div className="flex items-center gap-2">
            <span className="text-emerald-700">●</span>
            <span className="truncate">{ajaxStatusText}</span>
          </div>
          <div className="flex items-center gap-3">
            <span>Gecko 1.8.0</span>
            <span>|</span>
            <span>SSL 128-bit</span>
            <span>🔒</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Era2005;
