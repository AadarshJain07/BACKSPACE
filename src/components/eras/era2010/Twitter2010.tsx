import React, { useState } from 'react';
import { sound } from '../../../utils/audio';

export interface Tweet {
  id: string;
  author: string;
  handle: string;
  avatar: string;
  verified?: boolean;
  content: string;
  timestamp: string;
  retweets: number;
  favorites: number;
  isRetweeted?: boolean;
  isFavorited?: boolean;
  client?: string;
  replies?: { author: string; handle: string; text: string; time: string }[];
}

const INITIAL_TWEETS: Tweet[] = [
  {
    id: 't1',
    author: 'Steve Jobs',
    handle: '@stevejobs',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    verified: true,
    content: 'Our thoughts on Flash: Flash was created during the PC era. The mobile era is about low power devices, touch interfaces, and open web standards like HTML5.',
    timestamp: '28m',
    retweets: 14280,
    favorites: 8940,
    client: 'via iPad',
    replies: [
      { author: 'Adobe Systems', handle: '@adobe', text: 'Open standards are great, but Flash powers 75% of web video and 80% of casual games today.', time: '14m' },
      { author: 'Web Standardist', handle: '@standards_now', text: 'Canvas and H.264 are the future. No plugins!', time: '9m' }
    ]
  },
  {
    id: 't2',
    author: 'Barack Obama',
    handle: '@BarackObama',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    verified: true,
    content: 'We are extending high-speed wireless coverage to 98% of Americans. The internet is our modern highway system. #Broadband',
    timestamp: '1h',
    retweets: 9230,
    favorites: 6112,
    client: 'via Twitter Web Client',
    replies: [
      { author: 'Tech Enthusiast', handle: '@fiber_geek', text: 'Can not wait for LTE to rollout in our city!', time: '42m' }
    ]
  },
  {
    id: 't3',
    author: 'Christopher Nolan Fans',
    handle: '@inception_movie',
    avatar: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=100&auto=format&fit=crop&q=80',
    content: 'You must not be afraid to dream a little bigger, darling. Still reeling from the ending of #Inception... did that spinning top fall or not?! 🌀',
    timestamp: '2h',
    retweets: 6814,
    favorites: 5490,
    client: 'via TweetDeck',
    replies: [
      { author: 'Cinephile', handle: '@film_buff', text: 'Listen to the sound right before the cut to black!', time: '1h' },
      { author: 'Sarah C.', handle: '@sarah_c', text: 'Watched it 3 times in IMAX already. Masterpiece!', time: '52m' }
    ]
  },
  {
    id: 't4',
    author: 'Paul Octopus',
    handle: '@paul_the_oracle',
    avatar: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=100&auto=format&fit=crop&q=80',
    content: 'Just selected the Spanish flag box again. Spain will lift the 2010 FIFA World Cup trophy on Sunday in Johannesburg! 🇪🇸⚽ #WorldCup2010',
    timestamp: '3h',
    retweets: 24109,
    favorites: 18320,
    client: 'via SeaWeb Oberhausen',
    replies: [
      { author: 'Iniesta Fan', handle: '@andres_8', text: 'The Octopus has spoken! VAMOS ESPAÑA!', time: '2h' }
    ]
  },
  {
    id: 't5',
    author: 'Rovio Mobile',
    handle: '@AngryBirds',
    avatar: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=100&auto=format&fit=crop&q=80',
    verified: true,
    content: 'Squawk! Angry Birds has just hit 50,000,000 downloads worldwide on iOS and Android! Thank you to every slinger out there! 🎯🐷',
    timestamp: '5h',
    retweets: 11420,
    favorites: 7920,
    client: 'via Twitter for iPhone',
    replies: [
      { author: 'Gamer Guy', handle: '@casual_gamer', text: 'Level 3-15 took me 4 hours to 3-star. Addictive!', time: '4h' }
    ]
  },
  {
    id: 't6',
    author: 'Justin Bieber',
    handle: '@justinbieber',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&auto=format&fit=crop&q=80',
    verified: true,
    content: 'Baby baby baby ohhhh! Video just hit #1 most viewed on YouTube! Love my Beliebers so much, thank u for believing in me! #BelieberFamily',
    timestamp: '7h',
    retweets: 38940,
    favorites: 29500,
    client: 'via BlackBerry Smartphones App',
    replies: [
      { author: 'Selena M.', handle: '@selena_g', text: 'Proud of you! Keep shining!', time: '6h' }
    ]
  }
];

const TRENDS = [
  { tag: '#Inception', tweets: '412K' },
  { tag: '#ThoughtsOnFlash', tweets: '289K' },
  { tag: '#WorldCup2010', tweets: '1.2M' },
  { tag: '#AngryBirds', tweets: '184K' },
  { tag: '#iPadLaunch', tweets: '520K' },
  { tag: '#FailWhale', tweets: '95K' },
  { tag: 'Paul the Octopus', tweets: '310K' },
  { tag: 'Ethan Marcotte', tweets: '44K' }
];

export const Twitter2010: React.FC = () => {
  const [tweets, setTweets] = useState<Tweet[]>(INITIAL_TWEETS);
  const [newTweetText, setNewTweetText] = useState('');
  const [selectedTweet, setSelectedTweet] = useState<Tweet>(INITIAL_TWEETS[0]);
  const [activeTab, setActiveTab] = useState<'timeline' | 'mentions' | 'retweets'>('timeline');
  const [filterTag, setFilterTag] = useState<string | null>(null);
  const [showFailWhale, setShowFailWhale] = useState(false);
  const [replyInput, setReplyInput] = useState('');

  const charLimit = 140;
  const charsRemaining = charLimit - newTweetText.length;

  const handlePostTweet = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTweetText.trim() || charsRemaining < 0) return;

    sound.playTweetChirp();
    const createdTweet: Tweet = {
      id: `tweet-${Date.now()}`,
      author: 'Temporal Explorer',
      handle: '@timewarp_2010',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
      content: newTweetText.trim(),
      timestamp: 'Just now',
      retweets: 0,
      favorites: 0,
      client: 'via Twitter Web 2010',
      replies: []
    };

    setTweets([createdTweet, ...tweets]);
    setSelectedTweet(createdTweet);
    setNewTweetText('');
  };

  const handleToggleFavorite = (tweetId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    sound.playClick('click');

    setTweets((prev) =>
      prev.map((t) => {
        if (t.id === tweetId) {
          const isFav = !t.isFavorited;
          const updated = {
            ...t,
            isFavorited: isFav,
            favorites: isFav ? t.favorites + 1 : t.favorites - 1
          };
          if (selectedTweet?.id === tweetId) {
            setSelectedTweet(updated);
          }
          return updated;
        }
        return t;
      })
    );
  };

  const handleToggleRetweet = (tweetId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    sound.playTweetChirp();

    setTweets((prev) =>
      prev.map((t) => {
        if (t.id === tweetId) {
          const isRT = !t.isRetweeted;
          const updated = {
            ...t,
            isRetweeted: isRT,
            retweets: isRT ? t.retweets + 1 : t.retweets - 1
          };
          if (selectedTweet?.id === tweetId) {
            setSelectedTweet(updated);
          }
          return updated;
        }
        return t;
      })
    );
  };

  const handleAddReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyInput.trim() || !selectedTweet) return;

    sound.playTweetChirp();
    const newReply = {
      author: 'Temporal Explorer',
      handle: '@timewarp_2010',
      text: replyInput.trim(),
      time: 'Just now'
    };

    const updatedSelected = {
      ...selectedTweet,
      replies: [...(selectedTweet.replies || []), newReply]
    };

    setSelectedTweet(updatedSelected);
    setTweets((prev) => prev.map((t) => (t.id === selectedTweet.id ? updatedSelected : t)));
    setReplyInput('');
  };

  const filteredTweets = filterTag
    ? tweets.filter((t) => t.content.toLowerCase().includes(filterTag.toLowerCase()))
    : tweets;

  return (
    <div className="bg-[#c0deed] text-[#333333] font-sans min-h-[620px] rounded-b-xl p-3 sm:p-4 shadow-inner relative select-text">
      {/* 2010 Classic Twitter Top Bar */}
      <div className="bg-[#33ccff] bg-gradient-to-b from-[#33ccff] to-[#00acee] text-white px-4 py-2 rounded-t-lg flex items-center justify-between shadow-md mb-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-bold text-xl tracking-tight">
            <span className="text-2xl">🐤</span>
            <span>twitter</span>
          </div>
          <span className="text-xs bg-white/20 px-2 py-0.5 rounded text-white/90 font-mono hidden sm:inline-block">
            #NewTwitter (2010)
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={() => {
              sound.playGlitch();
              setShowFailWhale(true);
            }}
            className="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-white rounded font-bold shadow transition-all flex items-center gap-1"
            title="Simulate Twitter Over Capacity 2010 Fail Whale"
          >
            <span>🐳</span>
            <span className="hidden sm:inline">Fail Whale</span>
          </button>
          <div className="bg-[#0084b4] px-2.5 py-1 rounded text-white font-medium">
            @timewarp_2010
          </div>
        </div>
      </div>

      {/* Fail Whale Crash Modal */}
      {showFailWhale && (
        <div className="absolute inset-0 z-50 bg-[#0e2439]/90 backdrop-blur-sm flex items-center justify-center p-4 rounded-xl">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full text-center shadow-2xl border-4 border-[#33ccff] animate-in fade-in zoom-in-95 duration-200">
            <div className="relative py-4">
              {/* Fail Whale SVG Art */}
              <div className="text-6xl sm:text-7xl mb-2 animate-bounce">🐳</div>
              <div className="flex justify-center gap-2 text-amber-500 text-xl animate-pulse">
                <span>🕊️</span>
                <span>🕊️</span>
                <span>🕊️</span>
                <span>🕊️</span>
                <span>🕊️</span>
                <span>🕊️</span>
                <span>🕊️</span>
                <span>🕊️</span>
              </div>
            </div>

            <h3 className="text-2xl font-bold text-[#333333] mb-2 font-serif">Twitter is over capacity.</h3>
            <p className="text-sm text-[#666666] leading-relaxed mb-6">
              Please wait a moment and try again. For more information, check out{' '}
              <span className="text-[#0084b4] underline">Twitter Status</span>.
            </p>

            <div className="p-3 bg-[#f5f8fa] border border-[#e1e8ed] rounded-lg text-xs font-mono text-[#555] mb-6">
              HTTP 503 Service Unavailable • Unicorn server pool overloaded with #WorldCup tweets.
            </div>

            <button
              onClick={() => {
                sound.playClick('click');
                setShowFailWhale(false);
              }}
              className="px-6 py-2 bg-[#00acee] hover:bg-[#0084b4] text-white font-bold rounded-full shadow transition-all"
            >
              Back to Timeline
            </button>
          </div>
        </div>
      )}

      {/* Main 2-Pane Twitter 2010 Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
        {/* Left Column: Timeline Stream & Composer (7 cols) */}
        <div className="lg:col-span-7 space-y-3">
          {/* 140-Character Composer Box */}
          <div className="bg-white rounded-lg p-3.5 shadow border border-[#cbe1ec]">
            <div className="text-xs font-bold text-[#666666] uppercase mb-1.5 tracking-wider flex items-center justify-between">
              <span>What&apos;s happening?</span>
              <span
                className={`font-mono text-xs font-bold ${
                  charsRemaining < 0
                    ? 'text-red-600 animate-pulse'
                    : charsRemaining <= 20
                    ? 'text-amber-600'
                    : 'text-[#999999]'
                }`}
              >
                {charsRemaining}
              </span>
            </div>

            <form onSubmit={handlePostTweet}>
              <textarea
                value={newTweetText}
                onChange={(e) => setNewTweetText(e.target.value)}
                placeholder="Compose new Tweet in 140 characters or less..."
                rows={3}
                className="w-full text-sm p-2 border border-[#cbe1ec] rounded-md focus:outline-none focus:border-[#33ccff] focus:ring-1 focus:ring-[#33ccff] resize-none text-[#222]"
              />

              <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-100">
                <div className="flex items-center gap-2 text-xs text-[#777]">
                  <button
                    type="button"
                    onClick={() => setNewTweetText((prev) => prev + ' #2010Web')}
                    className="text-[#0084b4] hover:underline"
                  >
                    + #2010Web
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewTweetText((prev) => prev + ' #HTML5')}
                    className="text-[#0084b4] hover:underline"
                  >
                    + #HTML5
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={!newTweetText.trim() || charsRemaining < 0}
                  className="px-4 py-1.5 bg-[#00acee] hover:bg-[#0084b4] disabled:bg-slate-300 disabled:cursor-not-allowed text-white text-xs font-bold rounded shadow transition-all"
                >
                  Tweet
                </button>
              </div>
            </form>
          </div>

          {/* Feed Filter Notification (if active) */}
          {filterTag && (
            <div className="bg-[#e8f5fd] border border-[#b2dffc] px-3 py-1.5 rounded-md flex items-center justify-between text-xs text-[#0084b4]">
              <span>
                Filtering by: <strong>{filterTag}</strong>
              </span>
              <button
                onClick={() => setFilterTag(null)}
                className="text-red-500 hover:text-red-700 font-bold ml-2"
              >
                ✕ Clear
              </button>
            </div>
          )}

          {/* Navigation Tabs */}
          <div className="bg-white rounded-t-lg border-b border-[#cbe1ec] flex text-xs font-bold text-[#666666]">
            <button
              onClick={() => {
                sound.playClick('click');
                setActiveTab('timeline');
              }}
              className={`flex-1 py-2.5 text-center border-b-2 transition-all ${
                activeTab === 'timeline'
                  ? 'border-[#00acee] text-[#0084b4]'
                  : 'border-transparent hover:text-[#333]'
              }`}
            >
              Timeline
            </button>
            <button
              onClick={() => {
                sound.playClick('click');
                setActiveTab('mentions');
              }}
              className={`flex-1 py-2.5 text-center border-b-2 transition-all ${
                activeTab === 'mentions'
                  ? 'border-[#00acee] text-[#0084b4]'
                  : 'border-transparent hover:text-[#333]'
              }`}
            >
              @Mentions
            </button>
            <button
              onClick={() => {
                sound.playClick('click');
                setActiveTab('retweets');
              }}
              className={`flex-1 py-2.5 text-center border-b-2 transition-all ${
                activeTab === 'retweets'
                  ? 'border-[#00acee] text-[#0084b4]'
                  : 'border-transparent hover:text-[#333]'
              }`}
            >
              Retweets
            </button>
          </div>

          {/* Tweets Feed List */}
          <div className="bg-white rounded-b-lg shadow border-x border-b border-[#cbe1ec] divide-y divide-[#e1e8ed] overflow-hidden">
            {filteredTweets.map((tweet) => {
              const isSelected = selectedTweet?.id === tweet.id;
              return (
                <div
                  key={tweet.id}
                  onClick={() => {
                    sound.playClick('click');
                    setSelectedTweet(tweet);
                  }}
                  className={`p-3 sm:p-4 hover:bg-[#f5f8fa] transition-colors cursor-pointer ${
                    isSelected ? 'bg-[#e8f5fd] border-l-4 border-[#00acee]' : ''
                  }`}
                >
                  <div className="flex gap-3">
                    <img
                      src={tweet.avatar}
                      alt={tweet.author}
                      className="w-10 h-10 rounded object-cover shadow-sm flex-shrink-0"
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-bold text-sm text-[#333333] hover:underline">
                          {tweet.author}
                        </span>
                        {tweet.verified && (
                          <span className="text-[#00acee] text-xs font-bold" title="Verified Account">
                            ✓
                          </span>
                        )}
                        <span className="text-xs text-[#999999]">{tweet.handle}</span>
                        <span className="text-xs text-[#999999]">·</span>
                        <span className="text-xs text-[#999999]">{tweet.timestamp}</span>
                      </div>

                      <p className="text-sm text-[#333333] mt-1 leading-snug break-words">
                        {tweet.content}
                      </p>

                      {/* Tweet Actions (2010 style) */}
                      <div className="flex items-center gap-4 mt-2.5 text-xs text-[#999999]">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedTweet(tweet);
                          }}
                          className="hover:text-[#0084b4] flex items-center gap-1"
                        >
                          <span>↩</span>
                          <span>Reply</span>
                        </button>

                        <button
                          onClick={(e) => handleToggleRetweet(tweet.id, e)}
                          className={`hover:text-green-600 flex items-center gap-1 transition-colors ${
                            tweet.isRetweeted ? 'text-green-600 font-bold' : ''
                          }`}
                        >
                          <span>🔁</span>
                          <span>{tweet.retweets}</span>
                        </button>

                        <button
                          onClick={(e) => handleToggleFavorite(tweet.id, e)}
                          className={`hover:text-amber-500 flex items-center gap-1 transition-colors ${
                            tweet.isFavorited ? 'text-amber-500 font-bold' : ''
                          }`}
                        >
                          <span>{tweet.isFavorited ? '★' : '☆'}</span>
                          <span>{tweet.favorites}</span>
                        </button>

                        {tweet.client && (
                          <span className="text-[11px] text-[#bbb] ml-auto hidden sm:inline">
                            {tweet.client}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: 2010 Dual-Pane Details & Trends (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          {/* Detail Inspection Pane */}
          {selectedTweet ? (
            <div className="bg-white rounded-lg p-4 shadow border border-[#cbe1ec]">
              <div className="flex items-center gap-3 pb-3 border-b border-[#e1e8ed]">
                <img
                  src={selectedTweet.avatar}
                  alt={selectedTweet.author}
                  className="w-12 h-12 rounded object-cover shadow"
                />
                <div>
                  <div className="flex items-center gap-1">
                    <h4 className="font-bold text-base text-[#333333] leading-tight">
                      {selectedTweet.author}
                    </h4>
                    {selectedTweet.verified && <span className="text-[#00acee] text-xs">✓</span>}
                  </div>
                  <p className="text-xs text-[#777777]">{selectedTweet.handle}</p>
                </div>
              </div>

              <div className="py-3 text-base text-[#222222] leading-relaxed border-b border-[#e1e8ed]">
                {selectedTweet.content}
              </div>

              <div className="py-2.5 text-xs text-[#999999] border-b border-[#e1e8ed] flex items-center justify-between">
                <span>{selectedTweet.timestamp} ago</span>
                <span className="font-medium text-[#0084b4]">{selectedTweet.client || 'via Web'}</span>
              </div>

              {/* Stats Bar */}
              <div className="flex items-center gap-6 py-2.5 border-b border-[#e1e8ed] text-xs">
                <div>
                  <strong className="text-sm text-[#333333]">{selectedTweet.retweets}</strong>{' '}
                  <span className="text-[#888]">Retweets</span>
                </div>
                <div>
                  <strong className="text-sm text-[#333333]">{selectedTweet.favorites}</strong>{' '}
                  <span className="text-[#888]">Favorites</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 py-3 border-b border-[#e1e8ed]">
                <button
                  onClick={() => handleToggleRetweet(selectedTweet.id)}
                  className={`flex-1 py-1 px-2 rounded text-xs font-bold border transition-all flex items-center justify-center gap-1 ${
                    selectedTweet.isRetweeted
                      ? 'bg-green-50 text-green-700 border-green-300'
                      : 'border-[#ccc] hover:bg-slate-50 text-[#555]'
                  }`}
                >
                  <span>🔁</span>
                  <span>{selectedTweet.isRetweeted ? 'Retweeted' : 'Retweet'}</span>
                </button>
                <button
                  onClick={() => handleToggleFavorite(selectedTweet.id)}
                  className={`flex-1 py-1 px-2 rounded text-xs font-bold border transition-all flex items-center justify-center gap-1 ${
                    selectedTweet.isFavorited
                      ? 'bg-amber-50 text-amber-700 border-amber-300'
                      : 'border-[#ccc] hover:bg-slate-50 text-[#555]'
                  }`}
                >
                  <span>{selectedTweet.isFavorited ? '★' : '☆'}</span>
                  <span>{selectedTweet.isFavorited ? 'Favorited' : 'Favorite'}</span>
                </button>
              </div>

              {/* Replies Thread */}
              <div className="mt-3">
                <h5 className="text-xs font-bold text-[#666] mb-2 uppercase tracking-wide">
                  Replies & Discussion
                </h5>

                <div className="space-y-2 mb-3 max-h-48 overflow-y-auto pr-1">
                  {selectedTweet.replies && selectedTweet.replies.length > 0 ? (
                    selectedTweet.replies.map((rep, idx) => (
                      <div key={idx} className="bg-[#f5f8fa] p-2 rounded text-xs border border-[#e1e8ed]">
                        <div className="flex items-center justify-between text-[11px] text-[#888] mb-0.5">
                          <span className="font-bold text-[#333]">{rep.author}</span>
                          <span>{rep.time}</span>
                        </div>
                        <p className="text-[#444]">{rep.text}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-[#999] italic">No replies yet. Be the first!</p>
                  )}
                </div>

                {/* Reply Form */}
                <form onSubmit={handleAddReply} className="flex gap-2">
                  <input
                    type="text"
                    value={replyInput}
                    onChange={(e) => setReplyInput(e.target.value)}
                    placeholder={`Reply to ${selectedTweet.handle}...`}
                    className="flex-1 text-xs px-2.5 py-1.5 border border-[#cbe1ec] rounded focus:outline-none focus:border-[#00acee]"
                  />
                  <button
                    type="submit"
                    disabled={!replyInput.trim()}
                    className="px-3 py-1 bg-[#00acee] hover:bg-[#0084b4] disabled:bg-slate-300 text-white text-xs font-bold rounded transition-all"
                  >
                    Reply
                  </button>
                </form>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg p-6 text-center text-xs text-[#888] border border-[#cbe1ec]">
              Select a tweet to inspect full conversation thread
            </div>
          )}

          {/* Trending Topics Sidebar Widget */}
          <div className="bg-white rounded-lg p-3.5 shadow border border-[#cbe1ec]">
            <h4 className="font-bold text-sm text-[#333333] mb-2 flex items-center justify-between">
              <span>Trends: Worldwide (2010)</span>
              <span className="text-[10px] text-[#0084b4] cursor-pointer hover:underline">Change</span>
            </h4>

            <div className="divide-y divide-slate-100 text-xs">
              {TRENDS.map((t, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    sound.playClick('click');
                    if (t.tag === '#FailWhale') {
                      setShowFailWhale(true);
                    } else {
                      setFilterTag(t.tag);
                    }
                  }}
                  className="py-1.5 hover:bg-slate-50 flex items-center justify-between cursor-pointer px-1 rounded transition-colors group"
                >
                  <span className="text-[#0084b4] font-bold group-hover:underline">{t.tag}</span>
                  <span className="text-[#999999] text-[11px]">{t.tweets}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
