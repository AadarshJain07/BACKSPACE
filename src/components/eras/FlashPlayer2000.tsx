import React, { useState, useEffect, useRef } from 'react';
import { sound } from '../../utils/audio';

interface FlashProps {
  onClose?: () => void;
}

export const FlashPlayer2000: React.FC<FlashProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'game' | 'hamster' | 'badger'>('game');
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [score, setScore] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(() => {
    return parseInt(localStorage.getItem('backspace_2000_flash_score') || '120', 10);
  });
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [gameStarted, setGameStarted] = useState<boolean>(false);

  // Pong / Cyber Brick Canvas Game State
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const gameStateRef = useRef({
    paddleX: 130,
    paddleWidth: 60,
    ballX: 150,
    ballY: 100,
    ballSpeedX: 2.5,
    ballSpeedY: -2.5,
    bricks: Array.from({ length: 15 }, (_, i) => ({
      x: (i % 5) * 56 + 12,
      y: Math.floor(i / 5) * 16 + 20,
      width: 50,
      height: 12,
      alive: true,
      color: i < 5 ? '#ff0055' : i < 10 ? '#00ffff' : '#ffff00'
    }))
  });

  const resetGame = () => {
    gameStateRef.current = {
      paddleX: 130,
      paddleWidth: 60,
      ballX: 150,
      ballY: 120,
      ballSpeedX: 2.5 * (Math.random() > 0.5 ? 1 : -1),
      ballSpeedY: -2.5,
      bricks: Array.from({ length: 15 }, (_, i) => ({
        x: (i % 5) * 56 + 12,
        y: Math.floor(i / 5) * 16 + 20,
        width: 50,
        height: 12,
        alive: true,
        color: i < 5 ? '#ff0055' : i < 10 ? '#00ffff' : '#ffff00'
      }))
    };
    setScore(0);
    setGameOver(false);
    setGameStarted(true);
  };

  // Game Loop
  useEffect(() => {
    if (activeTab !== 'game' || !gameStarted || gameOver || !isPlaying) return;

    let animId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const loop = () => {
      const state = gameStateRef.current;

      // Update ball
      state.ballX += state.ballSpeedX;
      state.ballY += state.ballSpeedY;

      // Wall bounce
      if (state.ballX <= 4 || state.ballX >= canvas.width - 4) {
        state.ballSpeedX = -state.ballSpeedX;
        sound.playClick('2000');
      }
      if (state.ballY <= 4) {
        state.ballSpeedY = -state.ballSpeedY;
        sound.playClick('2000');
      }

      // Paddle collision
      if (
        state.ballY >= canvas.height - 24 &&
        state.ballY <= canvas.height - 14 &&
        state.ballX >= state.paddleX &&
        state.ballX <= state.paddleX + state.paddleWidth
      ) {
        state.ballSpeedY = -Math.abs(state.ballSpeedY);
        const hitOffset = (state.ballX - (state.paddleX + state.paddleWidth / 2)) / (state.paddleWidth / 2);
        state.ballSpeedX = hitOffset * 3.5;
        sound.playClick('2000');
      }

      // Floor collision -> Game Over
      if (state.ballY > canvas.height) {
        setGameOver(true);
        sound.playClick('1995');
        return;
      }

      // Brick collisions
      let activeCount = 0;
      state.bricks.forEach((brick) => {
        if (brick.alive) {
          activeCount++;
          if (
            state.ballX >= brick.x &&
            state.ballX <= brick.x + brick.width &&
            state.ballY >= brick.y &&
            state.ballY <= brick.y + brick.height
          ) {
            brick.alive = false;
            state.ballSpeedY = -state.ballSpeedY;
            setScore((prev) => {
              const next = prev + 20;
              if (next > highScore) {
                setHighScore(next);
                localStorage.setItem('backspace_2000_flash_score', next.toString());
              }
              return next;
            });
            sound.playCelebration();
          }
        }
      });

      if (activeCount === 0) {
        setGameOver(true);
        sound.playCelebration();
        return;
      }

      // Render Canvas
      ctx.fillStyle = '#020215';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Grid background
      ctx.strokeStyle = '#12123a';
      ctx.lineWidth = 1;
      for (let x = 0; x < canvas.width; x += 20) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += 20) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Draw Bricks
      state.bricks.forEach((b) => {
        if (b.alive) {
          ctx.fillStyle = b.color;
          ctx.fillRect(b.x, b.y, b.width, b.height);
          ctx.strokeStyle = '#ffffff';
          ctx.strokeRect(b.x, b.y, b.width, b.height);
        }
      });

      // Draw Paddle
      ctx.fillStyle = '#00ff41';
      ctx.fillRect(state.paddleX, canvas.height - 18, state.paddleWidth, 10);
      ctx.strokeStyle = '#ffffff';
      ctx.strokeRect(state.paddleX, canvas.height - 18, state.paddleWidth, 10);

      // Draw Ball
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(state.ballX, state.ballY, 4, 0, Math.PI * 2);
      ctx.fill();

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [activeTab, gameStarted, gameOver, isPlaying, highScore]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    gameStateRef.current.paddleX = Math.max(
      0,
      Math.min(canvasRef.current.width - gameStateRef.current.paddleWidth, mouseX - gameStateRef.current.paddleWidth / 2)
    );
  };

  return (
    <div className="w-full max-w-lg mx-auto bg-[#c0c0c0] border-2 border-t-[#ffffff] border-l-[#ffffff] border-r-[#000000] border-b-[#000000] shadow-2xl font-sans text-black select-none mb-6">
      {/* Macromedia Flash Title Bar */}
      <div className="bg-gradient-to-r from-[#990000] via-[#cc0000] to-[#660000] text-white px-2 py-1 flex items-center justify-between text-xs font-bold">
        <div className="flex items-center gap-1.5">
          <span className="bg-white text-[#cc0000] rounded-sm px-1 py-0.2 text-[10px] font-black">f</span>
          <span>Macromedia Flash Player 4.0 - [Y2K Cyber Showcase.swf]</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => sound.playClick('2000')}
            className="w-4 h-4 bg-[#c0c0c0] text-black text-[10px] font-bold border border-t-[#fff] border-l-[#fff] border-r-[#000] border-b-[#000] flex items-center justify-center leading-none"
          >
            _
          </button>
          <button
            onClick={onClose}
            className="w-4 h-4 bg-[#c0c0c0] text-black text-[10px] font-bold border border-t-[#fff] border-l-[#fff] border-r-[#000] border-b-[#000] flex items-center justify-center leading-none"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Flash Menu Bar */}
      <div className="bg-[#ece9d8] border-b border-[#808080] px-2 py-0.5 text-[11px] flex gap-3 text-black font-semibold">
        <span className="hover:bg-[#000080] hover:text-white px-1 cursor-pointer">File</span>
        <span className="hover:bg-[#000080] hover:text-white px-1 cursor-pointer">View</span>
        <span className="hover:bg-[#000080] hover:text-white px-1 cursor-pointer">Control</span>
        <span className="hover:bg-[#000080] hover:text-white px-1 cursor-pointer">Help</span>
      </div>

      {/* SWF Selector Tabs */}
      <div className="bg-[#d4d0c8] p-1.5 border-b border-[#808080] flex gap-1 text-xs">
        <button
          onClick={() => {
            sound.playClick('2000');
            setActiveTab('game');
          }}
          className={`px-2 py-1 font-bold border border-t-[#fff] border-l-[#fff] border-r-[#000] border-b-[#000] ${
            activeTab === 'game' ? 'bg-[#000080] text-yellow-300' : 'bg-[#e0ded8] text-black hover:bg-white'
          }`}
        >
          🕹️ Cyber Breakout 2000
        </button>
        <button
          onClick={() => {
            sound.playClick('2000');
            setActiveTab('hamster');
          }}
          className={`px-2 py-1 font-bold border border-t-[#fff] border-l-[#fff] border-r-[#000] border-b-[#000] ${
            activeTab === 'hamster' ? 'bg-[#000080] text-yellow-300' : 'bg-[#e0ded8] text-black hover:bg-white'
          }`}
        >
          🐹 Hamster Dance Rave
        </button>
        <button
          onClick={() => {
            sound.playClick('2000');
            setActiveTab('badger');
          }}
          className={`px-2 py-1 font-bold border border-t-[#fff] border-l-[#fff] border-r-[#000] border-b-[#000] ${
            activeTab === 'badger' ? 'bg-[#000080] text-yellow-300' : 'bg-[#e0ded8] text-black hover:bg-white'
          }`}
        >
          🦡 Badger Badger Loop
        </button>
      </div>

      {/* Flash Viewport Display Area */}
      <div className="p-2 bg-[#1a1a1a]">
        {activeTab === 'game' && (
          <div className="relative flex flex-col items-center">
            <div className="w-full flex justify-between items-center text-xs font-mono text-[#00ff41] bg-black px-3 py-1 border border-[#00ffff] mb-1">
              <span>SCORE: {score}</span>
              <span>HIGH: {highScore}</span>
              <span>FPS: 30.0</span>
            </div>

            <canvas
              ref={canvasRef}
              width={300}
              height={200}
              onMouseMove={handleMouseMove}
              className="border-2 border-[#00ffff] bg-black cursor-none block w-full max-w-[300px] h-[200px]"
            />

            {!gameStarted && (
              <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center p-4 text-center">
                <div className="text-[#00ffff] font-mono font-bold text-base mb-2">CYBER BREAKOUT 2000</div>
                <div className="text-gray-300 text-xs mb-3">Move mouse to steer paddle. Destroy all neon blocks!</div>
                <button
                  onClick={resetGame}
                  className="px-4 py-1.5 bg-[#00ff41] text-black font-mono font-bold text-xs border-2 border-white shadow hover:scale-105"
                >
                  ▶ START GAME (.SWF)
                </button>
              </div>
            )}

            {gameOver && (
              <div className="absolute inset-0 bg-black/85 flex flex-col items-center justify-center p-4 text-center">
                <div className="text-red-500 font-mono font-bold text-lg mb-1">
                  {score >= 300 ? '🎉 YOU WIN! HIGH SCORE!' : '💥 GAME OVER!'}
                </div>
                <div className="text-yellow-300 text-xs font-mono mb-3">FINAL SCORE: {score}</div>
                <button
                  onClick={resetGame}
                  className="px-4 py-1 bg-[#ffff00] text-black font-mono font-bold text-xs border-2 border-black"
                >
                  🔄 PLAY AGAIN
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'hamster' && (
          <div className="bg-[#000044] border-2 border-[#ff00ff] p-4 text-center relative overflow-hidden">
            <div className="text-yellow-300 font-black text-sm tracking-wider animate-pulse mb-3">
              ★ OFFICIAL HAMPTON THE HAMSTER DANCE FANCLUB ★
            </div>
            
            <div className="grid grid-cols-4 gap-2 text-2xl sm:text-3xl my-3">
              {['🐹', '🕶️🐹', '🎸🐹', '🎉🐹', '🎧🐹', '💃🐹', '🕺🐹', '⭐🐹'].map((h, i) => (
                <div
                  key={i}
                  className={`p-2 bg-[#111166] border border-[#00ffff] rounded ${
                    i % 2 === 0 ? 'animate-bounce' : 'animate-pulse'
                  }`}
                  style={{ animationDuration: `${0.4 + (i % 3) * 0.2}s` }}
                >
                  {h}
                </div>
              ))}
            </div>

            <div className="text-[11px] font-mono text-[#00ff41] bg-black p-1.5 border border-[#00ff41]">
              Di-da-di-da-di-doh-doh! Di-da-di-di-doh! 🎶
            </div>
          </div>
        )}

        {activeTab === 'badger' && (
          <div className="bg-[#003300] border-2 border-[#00ff00] p-4 text-center">
            <div className="text-white font-mono font-bold text-sm mb-2">BADGER BADGER BADGER ANIMATION</div>
            <div className="flex justify-center gap-3 text-3xl my-4">
              <span className="animate-bounce">🦡</span>
              <span className="animate-bounce" style={{ animationDelay: '0.1s' }}>🦡</span>
              <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>🦡</span>
              <span className="animate-pulse">🍄</span>
              <span className="animate-pulse">🐍</span>
            </div>
            <div className="text-yellow-300 text-xs font-mono font-bold">
              "Badger, badger, badger, badger, mushroom, mushroom, a snake! Oh it's a snake!"
            </div>
          </div>
        )}
      </div>

      {/* Flash Player Controls Bottom Ribbon */}
      <div className="bg-[#ece9d8] p-1.5 border-t border-[#808080] flex justify-between items-center text-xs">
        <div className="flex gap-1">
          <button
            onClick={() => {
              sound.playClick('2000');
              setIsPlaying(!isPlaying);
            }}
            className="px-2 py-0.5 bg-[#d4d0c8] border border-t-[#fff] border-l-[#fff] border-r-[#000] border-b-[#000] font-bold"
          >
            {isPlaying ? '⏸ Pause' : '▶ Play'}
          </button>
          <button
            onClick={() => {
              sound.playClick('2000');
              resetGame();
            }}
            className="px-2 py-0.5 bg-[#d4d0c8] border border-t-[#fff] border-l-[#fff] border-r-[#000] border-b-[#000] font-bold"
          >
            ⏮ Rewind
          </button>
        </div>
        <span className="text-[10px] text-gray-600 font-mono">Zoom: 100% • 320x240 @ 256 Colors</span>
      </div>
    </div>
  );
};
