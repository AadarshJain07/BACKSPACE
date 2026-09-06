import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { sound } from '../../../utils/audio';

interface WallPost {
  id: string;
  author: string;
  avatar: string;
  text: string;
  timestamp: string;
}

const INITIAL_WALL_POSTS: WallPost[] = [
  {
    id: 'wp1',
    author: 'Eduardo Saverin',
    avatar: '💼',
    text: 'Mark, check your email! The Peter Thiel term sheet just came through for angel investment.',
    timestamp: 'Today at 2:15pm'
  },
  {
    id: 'wp2',
    author: 'Dustin Moskovitz',
    avatar: '👨‍💻',
    text: 'Kirkland H-33 server just crashed because 8,000 Columbia freshmen signed up in 20 minutes.',
    timestamp: 'Yesterday at 11:42pm'
  },
  {
    id: 'wp3',
    author: 'Sarah Chen (Harvard \'07)',
    avatar: '👩‍🔬',
    text: 'Anyone taking CS50 have the notes from Malan\'s pointer lecture?? Left my notebook in Annenberg.',
    timestamp: 'Sep 21, 2005 at 4:10pm'
  }
];

const CAMPUSES = [
  { id: 'harvard', name: 'Harvard University', mascot: 'Crimson', members: 6720 },
  { id: 'stanford', name: 'Stanford University', mascot: 'Cardinal', members: 8140 },
  { id: 'columbia', name: 'Columbia University', mascot: 'Lions', members: 5930 },
  { id: 'yale', name: 'Yale University', mascot: 'Bulldogs', members: 5410 },
  { id: 'mit', name: 'MIT', mascot: 'Engineers', members: 4320 },
  { id: 'nyu', name: 'New York University', mascot: 'Bobcats', members: 9280 }
];

export const Thefacebook2005: React.FC = () => {
  const [selectedCampus, setSelectedCampus] = useState(CAMPUSES[0]);
  const [relationshipStatus, setRelationshipStatus] = useState<string>("It's Complicated");
  const [pokeCount, setPokeCount] = useState<number>(18);
  const [lastPokedBy, setLastPokedBy] = useState<string>('Mark Zuckerberg');
  const [pokeStreakMessage, setPokeStreakMessage] = useState<string>('Mark poked you back from his dorm!');
  const [wallPosts, setWallPosts] = useState<WallPost[]>(INITIAL_WALL_POSTS);
  const [newWallMessage, setNewWallMessage] = useState<string>('');
  const [bioQuote, setBioQuote] = useState<string>('“You don’t get to 500 million friends without making a few enemies.”');
  const [isEditingBio, setIsEditingBio] = useState<boolean>(false);
  const [searchPerson, setSearchPerson] = useState<string>('');

  const handlePokeBack = () => {
    sound.playPoke();
    setPokeCount((prev) => prev + 1);
    setLastPokedBy('You');
    setPokeStreakMessage(`You poked Mark Zuckerberg! Total Pokes: ${pokeCount + 1}`);

    // Mark pokes back after 1.2 seconds!
    setTimeout(() => {
      sound.playPoke();
      setLastPokedBy('Mark Zuckerberg');
      setPokeCount((prev) => prev + 1);
      setPokeStreakMessage(`Mark Zuckerberg instantly poked you back! Pokes: ${pokeCount + 2}`);
      confetti({ particleCount: 20, spread: 50, origin: { x: 0.2, y: 0.4 } });
    }, 1200);
  };

  const handlePostToWall = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWallMessage.trim()) return;
    sound.playWeb20Pop();

    const newPost: WallPost = {
      id: `wp_${Date.now()}`,
      author: `You (${selectedCampus.name} '07)`,
      avatar: '🧑‍🎓',
      text: newWallMessage.trim(),
      timestamp: 'Just now'
    };

    setWallPosts([newPost, ...wallPosts]);
    setNewWallMessage('');
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    setRelationshipStatus(newStatus);
    sound.playWeb20Pop();

    // Announce to Wall
    const statusPost: WallPost = {
      id: `status_${Date.now()}`,
      author: 'Thefacebook System',
      avatar: '📣',
      text: `Relationship status updated to: "${newStatus}"`,
      timestamp: 'Just now'
    };
    setWallPosts([statusPost, ...wallPosts]);
  };

  return (
    <div className="bg-[#f7f7f7] text-[#333333] font-sans border-2 border-[#3b5998] rounded shadow-md max-w-5xl mx-auto overflow-hidden">
      {/* Authentic 2004/2005 Header Banner */}
      <div className="bg-[#3b5998] text-white p-3 border-b-2 border-[#2b4170] flex flex-wrap items-center justify-between gap-4 select-none">
        <div className="flex items-center gap-3">
          {/* Al Pacino Binary Face Silhouette Tribute */}
          <div className="w-10 h-10 bg-[#2b4170] border border-blue-400/40 rounded flex items-center justify-center font-mono text-[9px] text-blue-200 leading-none overflow-hidden p-0.5">
            010101 101010 011110 100001
          </div>

          <div>
            <h1 className="text-xl sm:text-2xl font-bold font-serif tracking-tight flex items-baseline gap-1">
              <span>[Thefacebook]</span>
            </h1>
            <p className="text-[10px] text-blue-200 font-sans tracking-wide">
              an online directory that connects people through social networks at colleges
            </p>
          </div>
        </div>

        {/* College Network Selector */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-blue-100 font-semibold">Campus:</span>
          <select
            value={selectedCampus.id}
            onChange={(e) => {
              const campus = CAMPUSES.find((c) => c.id === e.target.value) || CAMPUSES[0];
              setSelectedCampus(campus);
              sound.playClick('bubble');
            }}
            className="bg-[#2b4170] text-white border border-blue-400 rounded px-2 py-1 text-xs focus:outline-none cursor-pointer"
          >
            {CAMPUSES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.members.toLocaleString()} students)
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Sub-header Navigation Links */}
      <div className="bg-[#eceff5] border-b border-[#d8dfea] px-4 py-1.5 flex flex-wrap items-center justify-between text-xs font-semibold text-[#3b5998]">
        <div className="flex items-center gap-4">
          <span className="cursor-pointer hover:underline">Profile (edit)</span>
          <span className="cursor-pointer hover:underline">Search People</span>
          <span className="cursor-pointer hover:underline">Browse Directory</span>
          <span className="cursor-pointer hover:underline">My Friends ({selectedCampus.members.toLocaleString()})</span>
          <span className="cursor-pointer hover:underline">Campus Groups</span>
        </div>
        <div className="text-[11px] text-slate-500 font-normal">
          Logged in as: <strong className="text-slate-700 font-bold">Mark Z. (Kirkland House)</strong>
        </div>
      </div>

      {/* Main Content Layout (Left Sidebar + Profile Core) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4">
        {/* Left Column: Navigation & Quick Search */}
        <div className="space-y-4">
          {/* Quick Search */}
          <div className="bg-white border border-[#d8dfea] p-3 rounded text-xs space-y-2">
            <h3 className="font-bold text-[#3b5998] border-b border-[#d8dfea] pb-1">
              Search {selectedCampus.name}
            </h3>
            <input
              type="text"
              placeholder="Search classmates..."
              value={searchPerson}
              onChange={(e) => setSearchPerson(e.target.value)}
              className="w-full border border-[#bdc7d8] p-1.5 rounded text-xs focus:outline-[#3b5998]"
            />
            <button
              onClick={() => sound.playClick('bubble')}
              className="w-full bg-[#3b5998] text-white py-1 rounded font-bold hover:bg-[#2b4170] text-xs shadow-xs"
            >
              Search
            </button>
          </div>

          {/* Interactive Poke War Widget */}
          <div className="bg-[#fff9d7] border-2 border-[#e2c822] p-3 rounded text-xs space-y-2 shadow-xs">
            <div className="flex items-center justify-between font-bold text-amber-900 border-b border-[#ecd43e] pb-1">
              <span className="flex items-center gap-1">👉 Poke War!</span>
              <span className="bg-amber-500 text-white px-1.5 py-0.2 rounded font-mono text-[10px]">
                x{pokeCount}
              </span>
            </div>

            <p className="text-[11px] text-amber-950 leading-tight">
              {lastPokedBy === 'Mark Zuckerberg' ? (
                <span>
                  <strong>Mark Zuckerberg</strong> has poked you! What will you do?
                </span>
              ) : (
                <span>
                  You just poked Mark. Waiting for his response...
                </span>
              )}
            </p>

            <button
              onClick={handlePokeBack}
              className="w-full py-1.5 bg-gradient-to-b from-[#ffea75] to-[#f4d13b] hover:from-[#fff08f] hover:to-[#f8da50] text-amber-950 font-bold rounded border border-[#d6b71a] shadow-xs active:scale-95 transition-transform flex items-center justify-center gap-1.5"
            >
              <span>👉</span>
              <span>Poke Mark Back</span>
            </button>

            <div className="text-[10px] text-amber-800 italic bg-white/60 p-1.5 rounded border border-amber-200/60">
              {pokeStreakMessage}
            </div>
          </div>

          {/* Mutual Friends list */}
          <div className="bg-white border border-[#d8dfea] p-3 rounded text-xs space-y-2">
            <h4 className="font-bold text-[#3b5998] border-b border-[#d8dfea] pb-1 flex justify-between items-center">
              <span>{selectedCampus.mascot} Friends</span>
              <span className="text-[10px] text-slate-400 font-normal">8 mutual</span>
            </h4>
            <div className="grid grid-cols-3 gap-2 text-center text-[10px]">
              {[
                { name: 'Chris H.', icon: '👨‍🦱' },
                { name: 'Dustin M.', icon: '👨‍💻' },
                { name: 'Eduardo S.', icon: '💼' },
                { name: 'Sean P.', icon: '🕶️' },
                { name: 'Tyler W.', icon: '🚣' },
                { name: 'Cameron W.', icon: '🚣‍♂️' }
              ].map((fr, i) => (
                <div
                  key={i}
                  onClick={() => sound.playClick('bubble')}
                  className="p-1 rounded hover:bg-slate-100 cursor-pointer border border-slate-100"
                >
                  <div className="text-xl">{fr.icon}</div>
                  <div className="font-semibold text-slate-700 truncate">{fr.name}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 3 Columns: Classic 2005 Thefacebook Profile */}
        <div className="md:col-span-3 space-y-4">
          {/* Profile Core Banner */}
          <div className="bg-white border border-[#d8dfea] p-4 rounded shadow-xs space-y-3">
            <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[#d8dfea] pb-3">
              <div>
                <h2 className="text-xl font-bold text-[#3b5998] font-serif">
                  Alex Vance
                </h2>
                <p className="text-xs text-slate-500">
                  {selectedCampus.name} &bull; Class of 2007 &bull; Leverett House
                </p>
              </div>

              {/* Status & Actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => sound.playPoke()}
                  className="px-2.5 py-1 bg-[#eceff5] hover:bg-[#d8dfea] border border-[#bdc7d8] rounded text-xs text-[#3b5998] font-bold"
                >
                  👉 Poke Alex
                </button>
                <button
                  onClick={() => sound.playClick('bubble')}
                  className="px-2.5 py-1 bg-[#eceff5] hover:bg-[#d8dfea] border border-[#bdc7d8] rounded text-xs text-[#3b5998] font-bold"
                >
                  ✉️ Send Message
                </button>
              </div>
            </div>

            {/* Profile Fields Table */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              {/* Avatar Box */}
              <div className="space-y-2">
                <div className="w-full aspect-square bg-[#eceff5] border border-[#bdc7d8] rounded flex flex-col items-center justify-center text-5xl shadow-inner">
                  <span>🧑‍🎓</span>
                  <span className="text-[10px] font-mono text-slate-500 mt-1">[photo]</span>
                </div>
                <div className="text-[10px] text-center text-slate-400">
                  Member since: February 2004
                </div>
              </div>

              {/* Personal Info Grid */}
              <div className="sm:col-span-2 space-y-2">
                <div className="bg-[#eceff5] px-2 py-1 font-bold text-[#3b5998] rounded text-xs">
                  Information & Directory Data
                </div>

                <div className="space-y-1.5 text-xs text-slate-700">
                  <div className="flex justify-between border-b border-slate-100 pb-1">
                    <span className="font-semibold text-slate-500 w-32">Status:</span>
                    <span className="flex-1 font-medium">Student (Junior)</span>
                  </div>

                  <div className="flex justify-between border-b border-slate-100 pb-1 items-center">
                    <span className="font-semibold text-slate-500 w-32">Relationship Status:</span>
                    <div className="flex-1">
                      <select
                        value={relationshipStatus}
                        onChange={handleStatusChange}
                        className="bg-white border border-[#bdc7d8] rounded px-1.5 py-0.5 text-xs font-bold text-[#3b5998] focus:outline-none"
                      >
                        <option value="Single">Single</option>
                        <option value="In a Relationship">In a Relationship</option>
                        <option value="It's Complicated">It's Complicated</option>
                        <option value="In an Open Relationship">In an Open Relationship</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-between border-b border-slate-100 pb-1">
                    <span className="font-semibold text-slate-500 w-32">Looking For:</span>
                    <span className="flex-1 font-medium">Friendship, Dating, Random play</span>
                  </div>

                  <div className="flex justify-between border-b border-slate-100 pb-1">
                    <span className="font-semibold text-slate-500 w-32">Concentration:</span>
                    <span className="flex-1 font-medium">Computer Science & Economics</span>
                  </div>

                  <div className="flex justify-between border-b border-slate-100 pb-1">
                    <span className="font-semibold text-slate-500 w-32">Interests:</span>
                    <span className="flex-1 font-medium">Halo 2, The O.C., Postal Service, Coding AJAX apps</span>
                  </div>

                  <div className="flex justify-between border-b border-slate-100 pb-1">
                    <span className="font-semibold text-slate-500 w-32">Favorite Music:</span>
                    <span className="flex-1 font-medium">Coldplay, The Killers, Modest Mouse, Green Day</span>
                  </div>
                </div>

                {/* Personal Quote */}
                <div className="pt-2">
                  <div className="text-[11px] font-semibold text-slate-500 mb-1 flex justify-between">
                    <span>Personal Quote:</span>
                    <button
                      onClick={() => setIsEditingBio(!isEditingBio)}
                      className="text-[#3b5998] hover:underline text-[10px]"
                    >
                      {isEditingBio ? 'Save' : 'Edit'}
                    </button>
                  </div>
                  {isEditingBio ? (
                    <input
                      type="text"
                      value={bioQuote}
                      onChange={(e) => setBioQuote(e.target.value)}
                      className="w-full border border-blue-400 p-1 rounded text-xs"
                    />
                  ) : (
                    <p className="italic text-slate-600 bg-slate-50 p-2 rounded border border-slate-200 text-xs">
                      {bioQuote}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* The Wall (Iconic Facebook Feature Launched Fall 2004) */}
          <div className="bg-white border border-[#d8dfea] p-4 rounded shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-[#d8dfea] pb-2">
              <h3 className="font-bold text-[#3b5998] text-sm flex items-center gap-1.5">
                <span>🧱</span>
                <span>The Wall ({wallPosts.length} posts)</span>
              </h3>
              <span className="text-[11px] text-slate-400">Displaying wall posts from classmates</span>
            </div>

            {/* Write on Wall Form */}
            <form onSubmit={handlePostToWall} className="space-y-2">
              <textarea
                rows={2}
                placeholder="Write something on Alex's wall..."
                value={newWallMessage}
                onChange={(e) => setNewWallMessage(e.target.value)}
                className="w-full border border-[#bdc7d8] p-2 rounded text-xs focus:outline-[#3b5998]"
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#3b5998] hover:bg-[#2b4170] text-white font-bold rounded text-xs shadow-xs"
                >
                  Post to Wall
                </button>
              </div>
            </form>

            {/* Wall Posts Stream */}
            <div className="space-y-3 pt-2">
              {wallPosts.map((post) => (
                <div key={post.id} className="border-b border-slate-100 pb-3 flex gap-3 text-xs">
                  <div className="w-8 h-8 rounded bg-[#eceff5] border border-[#bdc7d8] flex items-center justify-center text-lg shrink-0">
                    {post.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#3b5998] hover:underline cursor-pointer">
                        {post.author}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">{post.timestamp}</span>
                    </div>
                    <p className="text-slate-700 mt-1 leading-snug">{post.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
