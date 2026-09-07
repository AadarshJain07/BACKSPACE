import React, { useRef, useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { sound } from '../../../utils/audio';

interface Block {
  x: number;
  y: number;
  w: number;
  h: number;
  type: 'wood' | 'stone' | 'ice';
  health: number;
  color: string;
  vx?: number;
  vy?: number;
  angle?: number;
}

interface Pig {
  x: number;
  y: number;
  radius: number;
  alive: boolean;
  health: number;
  hasHelmet?: boolean;
}

export const AngryBirds2010: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(18500);
  const [birdsLeft, setBirdsLeft] = useState(3);
  const [levelStatus, setLevelStatus] = useState<'aiming' | 'flying' | 'cleared' | 'failed'>('aiming');
  const [stars, setStars] = useState(0);

  // Slingshot anchor coordinates
  const anchorX = 140;
  const anchorY = 320;

  // Bird state
  const birdRef = useRef({
    x: anchorX,
    y: anchorY,
    vx: 0,
    vy: 0,
    radius: 16,
    isDragging: false,
    inFlight: false,
    angle: 0
  });

  // Structures & Targets
  const blocksRef = useRef<Block[]>([]);
  const pigsRef = useRef<Pig[]>([]);
  const particlesRef = useRef<{ x: number; y: number; vx: number; vy: number; color: string; life: number }[]>([]);
  const scoreFloatsRef = useRef<{ x: number; y: number; text: string; opacity: number }[]>([]);

  // Initialize Level structures
  const initLevel = useCallback(() => {
    birdRef.current = {
      x: anchorX,
      y: anchorY,
      vx: 0,
      vy: 0,
      radius: 16,
      isDragging: false,
      inFlight: false,
      angle: 0
    };

    blocksRef.current = [
      // Base table / pillar
      { x: 500, y: 340, w: 140, h: 20, type: 'wood', health: 100, color: '#b87333' },
      // Left vertical beam
      { x: 520, y: 260, w: 20, h: 80, type: 'wood', health: 80, color: '#cd853f' },
      // Right vertical beam
      { x: 600, y: 260, w: 20, h: 80, type: 'wood', health: 80, color: '#cd853f' },
      // Horizontal cross beam
      { x: 510, y: 240, w: 120, h: 20, type: 'ice', health: 60, color: '#87ceeb' },
      // Top vertical pillars
      { x: 540, y: 170, w: 18, h: 70, type: 'stone', health: 120, color: '#708090' },
      { x: 580, y: 170, w: 18, h: 70, type: 'stone', health: 120, color: '#708090' },
      // Top roof beam
      { x: 530, y: 150, w: 80, h: 20, type: 'wood', health: 80, color: '#b87333' }
    ];

    pigsRef.current = [
      { x: 570, y: 315, radius: 18, alive: true, health: 40 },
      { x: 570, y: 215, radius: 16, alive: true, health: 40, hasHelmet: true },
      { x: 570, y: 125, radius: 14, alive: true, health: 30 }
    ];

    particlesRef.current = [];
    scoreFloatsRef.current = [];
    setBirdsLeft(3);
    setLevelStatus('aiming');
    setStars(0);
  }, [anchorX, anchorY]);

  useEffect(() => {
    initLevel();
  }, [initLevel]);

  // Main Canvas Render & Physics Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const gravity = 0.35;
    const groundY = 360;

    const loop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 1. Sky & Sunny Desert Background
      const skyGrad = ctx.createLinearGradient(0, 0, 0, groundY);
      skyGrad.addColorStop(0, '#5bc8f5');
      skyGrad.addColorStop(1, '#c5ebff');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, canvas.width, groundY);

      // Clouds
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.beginPath();
      ctx.arc(180, 80, 24, 0, Math.PI * 2);
      ctx.arc(210, 70, 30, 0, Math.PI * 2);
      ctx.arc(240, 80, 22, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.arc(480, 60, 20, 0, Math.PI * 2);
      ctx.arc(505, 50, 26, 0, Math.PI * 2);
      ctx.arc(530, 60, 20, 0, Math.PI * 2);
      ctx.fill();

      // Sun
      ctx.fillStyle = '#ffec3d';
      ctx.beginPath();
      ctx.arc(70, 60, 32, 0, Math.PI * 2);
      ctx.fill();

      // Ground (Lush Grass & Dirt)
      ctx.fillStyle = '#489c2b';
      ctx.fillRect(0, groundY, canvas.width, 16);
      ctx.fillStyle = '#8b5a2b';
      ctx.fillRect(0, groundY + 16, canvas.width, canvas.height - groundY - 16);

      // 2. Slingshot (Back arm)
      ctx.strokeStyle = '#5c3a21';
      ctx.lineWidth = 10;
      ctx.beginPath();
      ctx.moveTo(anchorX - 8, groundY);
      ctx.lineTo(anchorX - 10, anchorY + 15);
      ctx.lineTo(anchorX - 25, anchorY - 20);
      ctx.stroke();

      // Slingshot Back Rubber Band
      const bird = birdRef.current;
      ctx.strokeStyle = '#2b1d0c';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(anchorX - 22, anchorY - 15);
      ctx.lineTo(bird.x, bird.y);
      ctx.stroke();

      // Trajectory Dotted Arc (When aiming)
      if (bird.isDragging) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        const pullVx = (anchorX - bird.x) * 0.22;
        const pullVy = (anchorY - bird.y) * 0.22;
        let simX = bird.x;
        let simY = bird.y;
        let simVx = pullVx;
        let simVy = pullVy;

        for (let i = 0; i < 24; i++) {
          simX += simVx;
          simY += simVy;
          simVy += gravity;
          if (i % 2 === 0) {
            ctx.beginPath();
            ctx.arc(simX, simY, 3, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      // 3. Draw Bird
      ctx.save();
      ctx.translate(bird.x, bird.y);
      ctx.rotate(bird.angle);

      // Red Bird Body
      ctx.fillStyle = '#e02424';
      ctx.beginPath();
      ctx.arc(0, 0, bird.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#991b1b';
      ctx.lineWidth = 2;
      ctx.stroke();

      // White chest belly
      ctx.fillStyle = '#fce7f3';
      ctx.beginPath();
      ctx.arc(-2, 4, bird.radius * 0.65, 0, Math.PI);
      ctx.fill();

      // Fierce black eyebrows
      ctx.fillStyle = '#000000';
      ctx.beginPath();
      ctx.moveTo(-1, -6);
      ctx.lineTo(12, -2);
      ctx.lineTo(10, 0);
      ctx.lineTo(-1, -3);
      ctx.fill();

      // Eyes
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(5, -2, 4, 0, Math.PI * 2);
      ctx.arc(11, -1, 3.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#000000';
      ctx.beginPath();
      ctx.arc(6, -2, 1.8, 0, Math.PI * 2);
      ctx.arc(12, -1, 1.6, 0, Math.PI * 2);
      ctx.fill();

      // Yellow beak
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.moveTo(8, 2);
      ctx.lineTo(19, 4);
      ctx.lineTo(8, 8);
      ctx.closePath();
      ctx.fill();

      // Tail feathers
      ctx.fillStyle = '#000000';
      ctx.fillRect(-bird.radius - 6, -3, 8, 3);
      ctx.fillRect(-bird.radius - 8, -6, 10, 3);

      ctx.restore();

      // Slingshot Front Arm & Front Band
      ctx.strokeStyle = '#2b1d0c';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(anchorX + 18, anchorY - 15);
      ctx.lineTo(bird.x + 4, bird.y);
      ctx.stroke();

      ctx.strokeStyle = '#6d4526';
      ctx.lineWidth = 10;
      ctx.beginPath();
      ctx.moveTo(anchorX + 8, groundY);
      ctx.lineTo(anchorX + 6, anchorY + 15);
      ctx.lineTo(anchorX + 22, anchorY - 20);
      ctx.stroke();

      // 4. Update Bird Flight Physics
      if (bird.inFlight) {
        bird.x += bird.vx;
        bird.y += bird.vy;
        bird.vy += gravity;
        bird.angle = Math.atan2(bird.vy, bird.vx);

        // Ground Collision
        if (bird.y + bird.radius >= groundY) {
          bird.y = groundY - bird.radius;
          bird.vy *= -0.3;
          bird.vx *= 0.7;

          if (Math.abs(bird.vx) < 0.2 && Math.abs(bird.vy) < 0.3) {
            bird.inFlight = false;
            handleBirdSettle();
          }
        }

        // Check Collisions with Pigs
        pigsRef.current.forEach((pig) => {
          if (!pig.alive) return;
          const dx = bird.x - pig.x;
          const dy = bird.y - pig.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < bird.radius + pig.radius) {
            // Pig Hit!
            sound.playPigPop();
            pig.alive = false;
            setScore((s) => s + 5000);

            // Pop score float
            scoreFloatsRef.current.push({
              x: pig.x,
              y: pig.y - 10,
              text: '+5000',
              opacity: 1
            });

            // Particles
            for (let i = 0; i < 15; i++) {
              particlesRef.current.push({
                x: pig.x,
                y: pig.y,
                vx: (Math.random() - 0.5) * 8,
                vy: (Math.random() - 0.5) * 8,
                color: '#22c55e',
                life: 30
              });
            }

            // Deflect bird
            bird.vx *= 0.5;
            bird.vy *= 0.5;
          }
        });

        // Check Collisions with Blocks
        blocksRef.current.forEach((block) => {
          if (block.health <= 0) return;
          if (
            bird.x + bird.radius > block.x &&
            bird.x - bird.radius < block.x + block.w &&
            bird.y + bird.radius > block.y &&
            bird.y - bird.radius < block.y + block.h
          ) {
            sound.playBrickHit();
            const impact = Math.sqrt(bird.vx * bird.vx + bird.vy * bird.vy);
            block.health -= impact * 15;
            setScore((s) => s + 250);

            // Debris particles
            for (let i = 0; i < 6; i++) {
              particlesRef.current.push({
                x: bird.x,
                y: bird.y,
                vx: (Math.random() - 0.5) * 6,
                vy: (Math.random() - 0.5) * 6,
                color: block.color,
                life: 25
              });
            }

            bird.vx *= -0.3;
            bird.vy *= 0.5;
          }
        });

        // Offscreen boundary
        if (bird.x > canvas.width + 50 || bird.x < -50) {
          bird.inFlight = false;
          handleBirdSettle();
        }
      }

      // 5. Draw Blocks
      blocksRef.current.forEach((block) => {
        if (block.health <= 0) return;
        ctx.fillStyle = block.color;
        ctx.fillRect(block.x, block.y, block.w, block.h);
        ctx.strokeStyle = '#00000044';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(block.x, block.y, block.w, block.h);
      });

      // 6. Draw Pigs
      pigsRef.current.forEach((pig) => {
        if (!pig.alive) return;
        ctx.save();
        ctx.translate(pig.x, pig.y);

        // Green Pig Body
        ctx.fillStyle = '#22c55e';
        ctx.beginPath();
        ctx.arc(0, 0, pig.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#15803d';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Pig Ears
        ctx.fillStyle = '#16a34a';
        ctx.beginPath();
        ctx.arc(-pig.radius * 0.7, -pig.radius * 0.7, 5, 0, Math.PI * 2);
        ctx.arc(pig.radius * 0.7, -pig.radius * 0.7, 5, 0, Math.PI * 2);
        ctx.fill();

        // Snout
        ctx.fillStyle = '#4ade80';
        ctx.beginPath();
        ctx.ellipse(0, 2, 7, 5, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#166534';
        ctx.beginPath();
        ctx.arc(-3, 2, 1.8, 0, Math.PI * 2);
        ctx.arc(3, 2, 1.8, 0, Math.PI * 2);
        ctx.fill();

        // Goofy Eyes
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(-6, -4, 4, 0, Math.PI * 2);
        ctx.arc(6, -4, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#000000';
        ctx.beginPath();
        ctx.arc(-5, -4, 1.8, 0, Math.PI * 2);
        ctx.arc(5, -4, 1.8, 0, Math.PI * 2);
        ctx.fill();

        // Helmet (if present)
        if (pig.hasHelmet) {
          ctx.fillStyle = '#4b5563';
          ctx.beginPath();
          ctx.arc(0, -6, pig.radius * 0.85, Math.PI, 0);
          ctx.fill();
          ctx.strokeStyle = '#1f2937';
          ctx.stroke();
        }

        ctx.restore();
      });

      // 7. Draw Particles
      particlesRef.current.forEach((p, idx) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.2;
        p.life--;

        ctx.fillStyle = p.color;
        ctx.fillRect(p.x, p.y, 3, 3);

        if (p.life <= 0) {
          particlesRef.current.splice(idx, 1);
        }
      });

      // 8. Draw Floating Score numbers
      scoreFloatsRef.current.forEach((sf, idx) => {
        sf.y -= 1;
        sf.opacity -= 0.03;

        ctx.fillStyle = `rgba(255, 215, 0, ${Math.max(0, sf.opacity)})`;
        ctx.font = 'bold 16px sans-serif';
        ctx.fillText(sf.text, sf.x, sf.y);

        if (sf.opacity <= 0) {
          scoreFloatsRef.current.splice(idx, 1);
        }
      });

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [anchorX, anchorY]);

  // Handle bird landing/settle and level state
  const handleBirdSettle = () => {
    const allPigsDead = pigsRef.current.every((p) => !p.alive);

    if (allPigsDead) {
      sound.playCelebration();
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.5 } });
      setLevelStatus('cleared');
      setStars(birdsLeft === 3 ? 3 : birdsLeft === 2 ? 2 : 1);
      return;
    }

    if (birdsLeft > 1) {
      setBirdsLeft((b) => b - 1);
      birdRef.current = {
        x: anchorX,
        y: anchorY,
        vx: 0,
        vy: 0,
        radius: 16,
        isDragging: false,
        inFlight: false,
        angle: 0
      };
      setLevelStatus('aiming');
    } else {
      setBirdsLeft(0);
      setLevelStatus('failed');
      sound.playGlitch();
    }
  };

  // Mouse / Touch Dragging Handlers
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (levelStatus !== 'aiming') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const dx = mouseX - birdRef.current.x;
    const dy = mouseY - birdRef.current.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < 40) {
      birdRef.current.isDragging = true;
      sound.playSlingshotPull();
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!birdRef.current.isDragging) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Limit maximum slingshot stretch to 85px
    const dx = mouseX - anchorX;
    const dy = mouseY - anchorY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const maxPull = 85;

    if (dist > maxPull) {
      const angle = Math.atan2(dy, dx);
      birdRef.current.x = anchorX + Math.cos(angle) * maxPull;
      birdRef.current.y = anchorY + Math.sin(angle) * maxPull;
    } else {
      birdRef.current.x = mouseX;
      birdRef.current.y = mouseY;
    }
  };

  const handleMouseUp = () => {
    if (!birdRef.current.isDragging) return;
    birdRef.current.isDragging = false;

    // Calculate launch velocity based on pull displacement
    const pullX = anchorX - birdRef.current.x;
    const pullY = anchorY - birdRef.current.y;
    const speedMultiplier = 0.22;

    if (Math.abs(pullX) > 10 || Math.abs(pullY) > 10) {
      sound.playBirdFly();
      birdRef.current.vx = pullX * speedMultiplier;
      birdRef.current.vy = pullY * speedMultiplier;
      birdRef.current.inFlight = true;
      setLevelStatus('flying');
    } else {
      // Snap back if barely pulled
      birdRef.current.x = anchorX;
      birdRef.current.y = anchorY;
    }
  };

  return (
    <div className="bg-[#2a2f3d] text-white p-4 rounded-b-xl shadow-inner select-none">
      {/* Game Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#1e2330] p-3 rounded-lg border border-slate-700 mb-3">
        <div className="flex items-center gap-3">
          <span className="text-3xl">🎯</span>
          <div>
            <h3 className="font-bold text-lg text-amber-400 leading-none">
              Angry Birds (2010 Web Edition)
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              The 50M+ Download Phenomenon • Slingshot Physics Simulator
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="bg-black/40 px-3 py-1.5 rounded border border-white/10">
            <span className="text-slate-400 block text-[10px]">SCORE</span>
            <span className="text-amber-300 font-bold text-base">{score}</span>
          </div>
          <div className="bg-black/40 px-3 py-1.5 rounded border border-white/10">
            <span className="text-slate-400 block text-[10px]">HIGH SCORE</span>
            <span className="text-emerald-400 font-bold text-base">{highScore}</span>
          </div>
          <div className="bg-black/40 px-3 py-1.5 rounded border border-white/10">
            <span className="text-slate-400 block text-[10px]">BIRDS</span>
            <div className="flex gap-1 text-sm mt-0.5">
              {Array.from({ length: 3 }).map((_, i) => (
                <span key={i} className={i < birdsLeft ? 'opacity-100' : 'opacity-20'}>
                  🔴
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Canvas Canvas Container */}
      <div className="relative rounded-xl overflow-hidden border-4 border-[#1e2330] shadow-2xl bg-black flex justify-center">
        <canvas
          ref={canvasRef}
          width={720}
          height={400}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          className="cursor-crosshair max-w-full h-auto block"
        />

        {/* Level Cleared Overlay */}
        {levelStatus === 'cleared' && (
          <div className="absolute inset-0 bg-black/75 backdrop-blur-xs flex flex-col items-center justify-center text-center p-6 animate-in zoom-in-95 duration-200">
            <div className="text-5xl mb-2">🏆</div>
            <h4 className="text-3xl font-extrabold text-amber-400 font-serif mb-1">
              LEVEL CLEARED!
            </h4>
            <p className="text-xs text-slate-300 mb-4">All bad piggies popped!</p>

            {/* Stars */}
            <div className="flex gap-2 text-3xl mb-5">
              <span className={stars >= 1 ? 'text-amber-400' : 'text-slate-600'}>★</span>
              <span className={stars >= 2 ? 'text-amber-400 text-4xl -mt-1' : 'text-slate-600 text-4xl -mt-1'}>
                ★
              </span>
              <span className={stars >= 3 ? 'text-amber-400' : 'text-slate-600'}>★</span>
            </div>

            <div className="text-lg font-mono text-white mb-6">
              Final Score: <strong className="text-amber-300">{score}</strong>
            </div>

            <button
              onClick={() => {
                sound.playClick('click');
                if (score > highScore) setHighScore(score);
                setScore(0);
                initLevel();
              }}
              className="px-6 py-2 bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-600 hover:to-yellow-500 text-slate-900 font-bold rounded-full shadow-lg transition-transform hover:scale-105"
            >
              Play Again ▶
            </button>
          </div>
        )}

        {/* Level Failed Overlay */}
        {levelStatus === 'failed' && (
          <div className="absolute inset-0 bg-black/75 backdrop-blur-xs flex flex-col items-center justify-center text-center p-6 animate-in zoom-in-95 duration-200">
            <div className="text-5xl mb-2">🐷</div>
            <h4 className="text-2xl font-bold text-red-400 mb-1">LEVEL FAILED</h4>
            <p className="text-xs text-slate-300 mb-6">The pigs survived your assault!</p>
            <button
              onClick={() => {
                sound.playClick('click');
                setScore(0);
                initLevel();
              }}
              className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-full shadow transition-all"
            >
              Try Again 🔄
            </button>
          </div>
        )}
      </div>

      {/* Instruction Tips */}
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400 px-1">
        <span>
          💡 <strong>How to Play:</strong> Click and drag the red bird in the slingshot backwards, aim along the dotted arc, and release to smash the wooden fort!
        </span>
        <button
          onClick={() => {
            sound.playClick('click');
            setScore(0);
            initLevel();
          }}
          className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-white rounded text-xs font-mono transition-colors"
        >
          Reset Fort 🔄
        </button>
      </div>
    </div>
  );
};
