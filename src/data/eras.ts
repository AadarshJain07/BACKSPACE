import { EraConfig } from '../types/era';
export const ERAS: EraConfig[] = [
  {
    id: '1995',
    year: '1995',
    eraName: 'EARLY WEB',
    tagline: 'The Wild Frontier & The Browser Wars',
    subtitle: 'Table layouts, gray bevels, 14.4k modems, and the birth of Netscape Navigator.',
    description:
      'The World Wide Web emerges from academic labs into public consciousness. Websites are hand-coded HTML tables with default blue links, raw gray backgrounds, tiled backgrounds, and spinning "under construction" GIFs. Bandwidth is measured in single-digit kilobytes per second.',
    colorScheme: {
      bg: '#c0c0c0',
      cardBg: '#dcdcdc',
      border: '#808080',
      text: '#000080',
      accent: '#0000ee',
      glow: 'rgba(0, 0, 128, 0.4)',
    },
    designLanguage: {
      philosophy: 'Document-First Raw Hypertext',
      typography: 'Times New Roman & Courier 12pt',
      palette: {
        primary: '#000080', // Navy Blue
        secondary: '#0000ee', // Pure Hyperlink Blue
        background: '#c0c0c0', // Windows 95 System Gray
        text: '#000000',
        accent: '#800080', // Visited Purple
      },
      signatureUI: [
        '3D Beveled Outset Borders',
        'Raw HTML <table> Grid Layouts',
        'Flashing <blink> & <marquee> text',
        'Hit Counters & Netscape Badges',
        'Times New Roman Body Copy',
      ],
      layoutModel: 'Rigid Table Columns (width="100%" cellpadding="4")',
    },
    browserChrome: {
      title: 'Netscape Navigator 1.2 — [Welcome to The World Wide Web!]',
      url: 'http://www.cern.ch/hypertext/WWW/TheProject.html',
      engine: 'NCSA Mosaic / Netscape Engine v1.2',
      statusText: 'Document: Done (1.4 KB / 4.2 sec @ 14.4 kbps)',
      retroMenus: true,
      showTabs: false,
    },
    stats: {
      webPopulation: '16 Million (0.4% of World)',
      topWebsites: ['Yahoo! Directory', 'WebCrawler', 'AOL', 'Geocities', 'Pathfinder'],
      avgSpeed: '14.4 kbps - 28.8 kbps Dial-up',
      keyTech: ['HTML 2.0', 'CGI-BIN Perl', 'Mosaic Browser', 'GIF89a'],
      culturePillar: 'Dial-up handshakes, CD-ROMs in the mail, "Surfing the Info Highway"',
    },
    soundPreset: 'dialup',
    easterEggHint: 'Click the Netscape "N" meteor logo or the hit counter to generate hits!',
    easterEggCode: '1995',
    interactiveHighlights: [
      'Interactive 1995 Yahoo-style Hierarchical Web Directory',
      'Live Retro Guestbook with authentic 90s entries',
      'Mechanical 3D Bevel Button Clicker',
      'Netscape Navigator Menu Bar (File, Edit, View, Go, Bookmarks)',
    ],
  },
  {
    id: '2000',
    year: '2000',
    eraName: 'WEB 1.0 & GEOCITIES',
    tagline: 'Dot-Com Euphoria & Personal Homepages',
    subtitle: 'Cyber aesthetics, webrings, MIDI background music, and 88x31 pixel button badges.',
    description:
      'The dot-com boom reaches fever pitch. Millions of regular people build their first personal homepages in Geocities neighborhoods (SiliconValley, Area51, Soho). Web design is expressive, unhinged, and proudly DIY with starry backgrounds, neon Comic Sans, and visitor guestbooks.',
    colorScheme: {
      bg: '#000033',
      cardBg: '#050522',
      border: '#00ffff',
      text: '#ffff00',
      accent: '#ff00ff',
      glow: 'rgba(0, 255, 255, 0.4)',
    },
    designLanguage: {
      philosophy: 'Unfiltered Personal Expression & Cyber-Space Enthusiasm',
      typography: 'Comic Sans MS, Trebuchet MS, Arial Black',
      palette: {
        primary: '#00ffff', // Cyan Neon
        secondary: '#ffff00', // Yellow Cyber
        background: '#000033', // Deep Midnight Blue / Starfield
        text: '#ffffff',
        accent: '#ff00ff', // Hot Magenta
      },
      signatureUI: [
        '88x31 Pixel Badges ("Best viewed in 1024x768")',
        'Starry Tiled Backgrounds & Neon Flames',
        'Webring Navigation Bars ([<< Prev] [Random] [Next >>])',
        'Embedded MIDI Synth Track Players',
        'Animated "Under Construction" Workers',
      ],
      layoutModel: 'Nested Framesets & Table-based Cyber Portals',
    },
    browserChrome: {
      title: 'Microsoft Internet Explorer 5.5 — [CyberRealm 2000]',
      url: 'http://www.geocities.com/SiliconValley/Pinnacle/4096/',
      engine: 'Trident (MSHTML.dll) 5.5',
      statusText: 'Applet audioPlayer running... 12 items remaining',
      retroMenus: true,
      showTabs: false,
    },
    stats: {
      webPopulation: '361 Million (5.8% of World)',
      topWebsites: ['AOL.com', 'Yahoo!', 'MSN', 'eBay', 'Geocities', 'Napster'],
      avgSpeed: '56 kbps V.90 Standard',
      keyTech: ['Flash 4', 'CSS1', 'JavaScript 1.2', 'DHTML', 'ActiveX'],
      culturePillar: 'Y2K survival, Napster MP3s, AIM screen names, Geocities eviction anxiety',
    },
    soundPreset: 'click',
    easterEggHint: 'Sign the Cyber Guestbook or click the 88x31 badges to trigger retro sounds!',
    easterEggCode: '2000',
    interactiveHighlights: [
      'Interactive Geocities Guestbook (write notes & sign!)',
      'Webring Hopper & 88x31 Button Badge Collector',
      'Cyber MIDI Visualizer Simulator',
      'AIM (AOL Instant Messenger) style buddy status widget',
    ],
  },

  {
    id: '2005',
    year: '2005',
    eraName: 'WEB 2.0 REVOLUTION',
    tagline: 'The Web Becomes Social, Glossy & Participatory',
    subtitle: 'Gradients, drop shadows, glossy badges, AJAX live updates, Flickr, Digg, and MySpace.',
    description:
      'The web awakens from the post-crash slumber into a vibrant user-generated paradise. Rounded corners with glossy reflections define every button. AJAX brings dynamic pages without reloads. Tag clouds, RSS icons, star ratings, and MySpace Top 8 friend grids rule the culture.',
    colorScheme: {
      bg: '#f3f8fd',
      cardBg: '#ffffff',
      border: '#a8d2f7',
      text: '#1e3d59',
      accent: '#3984d7',
      glow: 'rgba(57, 132, 215, 0.35)',
    },
    designLanguage: {
      philosophy: 'Glossy Skeuomorphism & Social Architecture',
      typography: 'Lucida Grande, Trebuchet MS, Helvetica Rounded',
      palette: {
        primary: '#3984d7', // Web 2.0 Sky Blue
        secondary: '#ff7700', // RSS Orange
        background: '#f4f8fb', // Soft Cloud White
        text: '#223344',
        accent: '#94c946', // Fresh Lime Green
      },
      signatureUI: [
        'Aqua Glass Reflection Highlight Overlays',
        'Glossy 3D Gradient Badges (BETA stickers)',
        'Flickr & Del.icio.us Dynamic Tag Clouds',
        'Digg-style Upvoting & Comment Nesting',
        'MySpace Top 8 Friends Customizer',
      ],
      layoutModel: 'Header + Sidebar + Center Stream with Gloss Containers',
    },
    browserChrome: {
      title: 'Mozilla Firefox 1.5 — [Digg / Web 2.0 Social Portal]',
      url: 'http://www.digg-delight.com/web20/explore?rss=true',
      engine: 'Gecko 1.8.0',
      statusText: 'Done (XMLHTTPRequest completed in 84ms)',
      retroMenus: false,
      showTabs: true,
    },
    stats: {
      webPopulation: '1.02 Billion (15.7% of World)',
      topWebsites: ['Yahoo!', 'Google Search', 'MySpace', 'eBay', 'MSN', 'Digg'],
      avgSpeed: '1.5 Mbps DSL / Cable Broadband',
      keyTech: ['AJAX (XMLHttpRequest)', 'Ruby on Rails', 'RSS 2.0', 'Flash 8 Video', 'Prototype.js'],
      culturePillar: 'MySpace HTML coding, Digg frontpage swarms, iPod podcasts, YouTube launch',
    },
    soundPreset: 'bubble',
    easterEggHint: 'Upvote stories on Digg or rearrange the MySpace Top 8 friends!',
    easterEggCode: '2005',
    interactiveHighlights: [
      'Working Digg.com Upvoting & Submission Feed',
      'MySpace Profile Top 8 Friends Editor & Player',
      'Dynamic Web 2.0 Tag Cloud Filter',
      'Live "BETA" Glossy Ribbon Badge toggles',
    ],
  },
  {
    id: '2010',
    year: '2010',
    eraName: 'THE SOCIAL STREAM',
    tagline: 'The Web of Continuous Feeds & 140 Characters',
    subtitle: 'Facebook blue bars, tweet feeds, infinite scrolling, retina graphics, and responsive grids.',
    description:
      'The desktop web pivots towards unified social identity and real-time streaming feeds. The blue navigation bar becomes ubiquitous. Users consume information in rapid 140-character bites. Ethan Marcotte coins "Responsive Web Design", and HTML5 begins the dramatic phase-out of Adobe Flash.',
    colorScheme: {
      bg: '#e9ebee',
      cardBg: '#ffffff',
      border: '#ccd0d5',
      text: '#1c1e21',
      accent: '#3b5998',
      glow: 'rgba(59, 89, 152, 0.25)',
    },
    designLanguage: {
      philosophy: 'Unified Social Graph & Infinite Stream Architecture',
      typography: 'Helvetica Neue, Segoe UI, Arial',
      palette: {
        primary: '#3b5998', // Social Blue
        secondary: '#1da1f2', // Twitter Light Blue
        background: '#e9ebee', // Canvas Neutral Gray
        text: '#1c1e21',
        accent: '#5890ff',
      },
      signatureUI: [
        'Persistent Blue Top Navbar with Notification Badges',
        'Single-Column Microblog Stream (140-char limit counter)',
        'Like, Retweet, Share Action Ribbon',
        'Early CSS3 Gradients & Subtle 1px Box Shadows',
        'Trending Hashtag Panels (#HTML5, #iPadLaunch)',
      ],
      layoutModel: '3-Column Social Dashboard (Nav | Central Stream | Trending Widgets)',
    },
    browserChrome: {
      title: 'Google Chrome 8 — [Live Social Timeline]',
      url: 'https://social.stream.com/feed/live',
      engine: 'WebKit / V8 JavaScript Engine',
      statusText: 'Connecting to WebSocket stream...',
      retroMenus: false,
      showTabs: true,
    },
    stats: {
      webPopulation: '1.97 Billion (28.7% of World)',
      topWebsites: ['Google', 'Facebook', 'YouTube', 'Yahoo!', 'Wikipedia', 'Twitter'],
      avgSpeed: '5 Mbps - 15 Mbps Broadband & 3G',
      keyTech: ['HTML5 Canvas & Video', 'CSS3 Media Queries', 'jQuery 1.4', 'Node.js', 'WebSockets'],
      culturePillar: 'Retweets, Facebook poking, iPhone 4 Retina screen, Flash vs. HTML5 war',
    },
    soundPreset: 'click',
    easterEggHint: 'Compose a tweet in the 140-character box or like posts to watch the counter tick!',
    easterEggCode: '2010',
    interactiveHighlights: [
      'Interactive 140-character Tweet Composer with live count & hashtag preview',
      'Social Feed with real-time Like & Retweet interaction states',
      'Trending Topics Sidebar with clickable historical trivia',
      'Early Responsive Viewport preview toggle',
    ],
  },

  {
    id: '2015',
    year: '2015',
    eraName: 'MOBILE-FIRST & FLAT DESIGN',
    tagline: 'The Pocket Internet & Material Design',
    subtitle: 'Flat minimalism, pastel cards, hamburger drawers, floating action buttons, and touch-first UI.',
    description:
      'Mobile traffic officially overtakes desktop. Skeuomorphism is ruthlessly eradicated in favor of crisp flat design and Google Material Design. High-contrast cards, bold typography, hamburger sidebars, and vibrant flat palettes dominate every app and responsive website.',
    colorScheme: {
      bg: '#f4f5f7',
      cardBg: '#ffffff',
      border: '#e2e8f0',
      text: '#2d3748',
      accent: '#e74c3c',
      glow: 'rgba(231, 76, 60, 0.2)',
    },
    designLanguage: {
      philosophy: 'Material Physics, Flat Planes & Mobile Ergonomics',
      typography: 'Roboto, Open Sans, Proxima Nova',
      palette: {
        primary: '#2c3e50', // Midnight Flat Slate
        secondary: '#e74c3c', // Flat Alizarin Red
        background: '#f4f5f7', // Clean Off-White
        text: '#2d3748',
        accent: '#1abc9c', // Flat Turquoise
      },
      signatureUI: [
        'Floating Action Button (+) with Material Elevation Ripple',
        'Clean Flat Cards with 2px Drop Shadow (Material Layering)',
        'Slide-Out Hamburger Menu Navigation Drawer',
        'Instagram-style Square Visual Grids with Double-Tap Likes',
        'Pull-to-refresh & Smooth Touch Drag Gestures',
      ],
      layoutModel: 'Modular Card Grid with Flexible Responsive Breakpoints',
    },
    browserChrome: {
      title: 'Mobile Safari / Chrome 45 — [Flatfolio Feed]',
      url: 'https://m.flatspace.io/cards/discover',
      engine: 'Blink / WebKit iOS',
      statusText: 'ServiceWorker registered (Offline ready)',
      retroMenus: false,
      showTabs: true,
    },
    stats: {
      webPopulation: '3.18 Billion (43.4% of World)',
      topWebsites: ['Google', 'YouTube', 'Facebook', 'Baidu', 'Amazon', 'Instagram'],
      avgSpeed: '25 Mbps 4G LTE / Fiber',
      keyTech: ['React.js', 'Webpack', 'Sass/PostCSS', 'Bootstrap 3', 'Material Design', 'Flexbox'],
      culturePillar: 'Swipe right culture, Instagram aesthetics, mobile app dominance, flat UI zealotry',
    },
    soundPreset: 'flat',
    easterEggHint: 'Click the Floating Action Button (+) or double click cards to send heart particles!',
    easterEggCode: '2015',
    interactiveHighlights: [
      'Interactive Material FAB (+) with animated speed dial options',
      'Card feed with double-tap heart animations & flat tag filters',
      'Toggleable Mobile Frame Simulation Mode',
      'Material Ripple Effect on all interactive tiles',
    ],
  },
  {
    id: '2020',
    year: '2020',
    eraName: 'THE PLATFORM & ALGORITHM ERA',
    tagline: 'Dark Mode Everywhere & Algorithmic Feeds',
    subtitle: 'OLED blacks, creator economy monetization, vertical video cards, live streaming chats, and TikTok feeds.',
    description:
      'The pandemic pushes human civilization entirely online. The web is dark by default to save battery and eye strain. Feeds are no longer chronological but powered by deep engagement algorithms. The creator economy explodes with subscriptions, super chats, and micro-influencer ecosystems.',
    colorScheme: {
      bg: '#0a0d14',
      cardBg: '#121722',
      border: '#1f293d',
      text: '#f1f5f9',
      accent: '#6366f1',
      glow: 'rgba(99, 102, 241, 0.35)',
    },
    designLanguage: {
      philosophy: 'Dopamine-Optimized Platform Surfaces & OLED Minimalism',
      typography: 'Inter, SF Pro Display, Plus Jakarta Sans',
      palette: {
        primary: '#6366f1', // Indigo Accent
        secondary: '#ec4899', // Hyper Pink Creator
        background: '#0a0d14', // Deep Obsidian
        text: '#f1f5f9',
        accent: '#10b981', // Emerald Stream Status
      },
      signatureUI: [
        'Pitch Black Dark Mode with Subtle Glass Highlights',
        'TikTok-inspired Vertical Algorithmic Video Cards',
        'Live Twitch-style Chat Stream with Instant Emoji Reactions',
        'Creator Tip / Super-Chat Micro-Transactions with Particle Explosions',
        'Floating Pill Navigation Dock at the Bottom of Viewport',
      ],
      layoutModel: 'Immersive Dark Grid with Dynamic Story Carousels & Side Streamers',
    },
    browserChrome: {
      title: 'Brave / Arc Proto — [Platform Hub: Algorithm Stream]',
      url: 'https://platform.stream/hub/algorithmic-for-you',
      engine: 'Chromium 88 / WebAssembly',
      statusText: 'AI Recommendation model loaded (TensorFlow.js 2.8)',
      retroMenus: false,
      showTabs: true,
    },
    stats: {
      webPopulation: '4.70 Billion (60.1% of World)',
      topWebsites: ['Google', 'YouTube', 'TikTok', 'Facebook', 'Netflix', 'Twitter/X'],
      avgSpeed: '75 Mbps 5G / Gigabit Home Fiber',
      keyTech: ['Next.js', 'Tailwind CSS', 'TypeScript', 'GraphQL', 'Vercel Serverless', 'Framer Motion'],
      culturePillar: 'Lockdown streaming, TikTok dance trends, crypto hype, creator tipping, infinite doomscrolling',
    },
    soundPreset: 'digital',
    easterEggHint: 'Send a Creator Tip with the SuperChat button to launch confetti and custom sound!',
    easterEggCode: '2020',
    interactiveHighlights: [
      'Live Algorithmic Stream Feed with "For You" vs "Following" engine',
      'Interactive SuperChat / Creator Tip button with particle bursts',
      'Live Chat Stream with auto-scrolling audience comments',
      'Platform Stats HUD (Real-time view count & algorithm engagement score)',
    ],
  },
  {
    id: '2026',
    year: '2026',
    eraName: 'THE AI WEB',
    tagline: 'Agentic Interfaces & Real-Time Synthesis',
    subtitle: 'Context-aware spatial layouts, dynamic distillations, natural language command bars, and calm luxury typography.',
    description:
      'The modern web transforms from static content repositories into adaptive intelligent surfaces. Interfaces generate dynamically around user intent. Command bars (`⌘K`) replace deep navigation trees. Content is synthesized, cross-referenced, and distilled in real time with quiet, refined spatial craftsmanship.',
    colorScheme: {
      bg: '#090a0f',
      cardBg: 'rgba(255, 255, 255, 0.03)',
      border: 'rgba(255, 255, 255, 0.08)',
      text: '#f8fafc',
      accent: '#38bdf8',
      glow: 'rgba(56, 189, 248, 0.25)',
    },
    designLanguage: {
      philosophy: 'Quiet Intelligence, Context-Aware Morphing & Pure Intent-First Ergonomics',
      typography: 'Space Grotesk, Plus Jakarta Sans, Syne',
      palette: {
        primary: '#38bdf8', // Cyber Cerulean
        secondary: '#a78bfa', // Ambient Lavender
        background: '#090a0f', // Deep Void Slate
        text: '#f8fafc',
        accent: '#34d399', // Harmonic Mint
      },
      signatureUI: [
        'Dynamic Agentic Command Surface (⌘K / Natural Prompt Query)',
        'Real-time Content Distiller (Instant Synthesis of Web Thought)',
        'Calm Ambient Refraction & Subtle Variable Blur Glass',
        'Intent-Aware Adaptive Modular Widgets',
        'Zero-Jargon Spatial Visual Hierarchy with Golden Ratio Rhythms',
      ],
      layoutModel: 'Spatial Fluid Grid that Reconfigures Based on Active Reasoning Streams',
    },
    browserChrome: {
      title: 'Agentic Canvas v4 — [Workspace: Intent Stream]',
      url: 'synth://agentic.kernel/intelligence-distill',
      engine: 'Neural Layout Engine & Local LLM Runtime',
      statusText: 'Context active • 8 reasoning threads synchronized',
      retroMenus: false,
      showTabs: false,
    },
    stats: {
      webPopulation: '5.65 Billion (70.2% of World)',
      topWebsites: ['ChatGPT', 'Claude AI', 'YouTube Synthesized', 'Perplexity', 'Github Copilot', 'Google Gemini'],
      avgSpeed: '300 Mbps Wi-Fi 7 / Ultra Low Latency 5G Advanced',
      keyTech: ['Local WebLLMs', 'Agentic Workflows', 'Multi-modal Web Workers', 'WebGPU 2.0', 'React Server Components'],
      culturePillar: 'AI co-pilots, vibe coding, synthetic media synthesis, context window expansions',
    },
    soundPreset: 'spatial',
    easterEggHint: 'Type a prompt in the AI Synthesizer bar or switch reasoning modes to hear harmonic tones!',
    easterEggCode: '2026',
    interactiveHighlights: [
      'Interactive AI Distiller: Type questions or prompts for live synthetic reasoning output',
      'Dynamic Intent Switcher (Deep Research, Creative Synthesis, Code Architecture)',
      'Spatial Ambient Glow Controller with pointer parallax',
      'Live Reasoning Thought Token Stream visualization',
    ],
  },
  {
    id: '2040',
    year: '2040',
    eraName: 'UNKNOWN — SPECULATIVE',
    tagline: 'Multi-Dimensional Neural Canvas & Quantum Hyper-Web',
    subtitle: 'Resonance nodes, thought streams, non-linear chronological navigation, and morphic quantum layouts.',
    description:
      'The browser dissolves into an interconnected multi-dimensional consciousness layer. Content is no longer authored in files or pages—it exists as probabilistic thought nodes that synchronize across neural-quantum mesh fabrics. The concept of a "URL" is historic trivia; navigation happens via emotional and semantic harmonic resonance.',
    colorScheme: {
      bg: '#040209',
      cardBg: 'rgba(30, 10, 50, 0.25)',
      border: 'rgba(180, 100, 255, 0.2)',
      text: '#f3e8ff',
      accent: '#c084fc',
      glow: 'rgba(192, 132, 252, 0.4)',
    },
    designLanguage: {
      philosophy: 'Speculative Quantum Resonance, Morphic Fluidity & Biological Computing',
      typography: 'Cinzel & Space Grotesk Hybrid',
      palette: {
        primary: '#c084fc', // Quantum Violet
        secondary: '#2dd4bf', // Bioluminescent Teal
        background: '#040209', // Singularity Black
        text: '#f3e8ff',
        accent: '#f43f5e', // Resonance Coral
      },
      signatureUI: [
        'Resonance Thought-Node Visualizer (Click to connect dimensional links)',
        'Quantum Probability State Controller (Superposition / Entanglement)',
        'Morphic Typography that reacts to pointer proximity and velocity',
        'Chronological Temporal Fold (Rewind into alternate universe timelines)',
        'Bioluminescent Waveform Synth Engine',
      ],
      layoutModel: 'Non-Euclidean Spatial Lattice with Force-Directed Semantic Anchors',
    },
    browserChrome: {
      title: 'Neural Node 0x9F41 — [Quantum Superposition Stream]',
      url: 'neural://telepathy.fabric/singularity/node?frequency=432hz',
      engine: 'Bio-Silicon Quantum Entanglement Bus v11.4',
      statusText: 'Synaptic latency: 0.002ms • Entangled with 14,892 parallel minds',
      retroMenus: false,
      showTabs: false,
    },
    stats: {
      webPopulation: '8.1 Billion Entities + 400B Autonomous Synapses',
      topWebsites: ['Global Neural Singularity', 'Holonet Fabric', 'Quantum Archives', 'Memetic Dreamspace'],
      avgSpeed: 'Instantaneous Quantum Teleportation (0ms Latency)',
      keyTech: ['BCI (Brain-Computer Interface)', 'Molecular Memory QuBits', 'Living Photonic Cells', 'Temporal Logic'],
      culturePillar: 'Telepathic consensus, simulated realities, biological immortality, synthetic memory sharing',
    },
    soundPreset: 'quantum',
    easterEggHint: 'Click the central Quantum Resonance Node to collapse the superposition wave into alternate futures!',
    easterEggCode: '2040',
    interactiveHighlights: [
      'Interactive Neural Resonance Node Network (Drag, link & energize nodes)',
      'Quantum Timeline Superposition Slider (Shift alternate timeline probabilities)',
      'Direct Synaptic Thought Stream Feed',
      'Bioluminescent Kinetic Particle Field reacting to mouse acceleration',
    ],
  },
];
