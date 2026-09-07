import React, { useState, useRef, useEffect } from 'react';
import { sound } from '../../../utils/audio';

export const Html5Showcase2010: React.FC = () => {
  const [flashCrashed, setFlashCrashed] = useState(false);
  const [batteryDrained, setBatteryDrained] = useState(42);
  const [activeSimulation, setActiveSimulation] = useState<'particles' | 'cloth' | 'matrix'>('particles');
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // HTML5 Interactive Canvas Animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = 480);
    let height = (canvas.height = 280);

    // Particle Swarm
    const particles = Array.from({ length: 90 }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 3,
      vy: (Math.random() - 0.5) * 3,
      radius: Math.random() * 3 + 2,
      color: `hsl(${Math.random() * 360}, 85%, 60%)`
    }));

    let mouseX = width / 2;
    let mouseY = height / 2;

    const handleCanvasMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = (e.clientX - rect.left) * (canvas.width / rect.width);
      mouseY = (e.clientY - rect.top) * (canvas.height / rect.height);
    };

    canvas.addEventListener('mousemove', handleCanvasMouseMove);

    const render = () => {
      ctx.fillStyle = 'rgba(10, 15, 26, 0.25)';
      ctx.fillRect(0, 0, width, height);

      particles.forEach((p, idx) => {
        // Gravitational attraction towards mouse
        const dx = mouseX - p.x;
        const dy = mouseY - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 180 && dist > 5) {
          p.vx += (dx / dist) * 0.25;
          p.vy += (dy / dist) * 0.25;
        }

        // Apply speed dampening
        p.vx *= 0.96;
        p.vy *= 0.96;

        p.x += p.vx;
        p.y += p.vy;

        // Bounce walls
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Connect neighbor lines
        for (let j = idx + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const d2 = Math.sqrt((p.x - p2.x) ** 2 + (p.y - p2.y) ** 2);
          if (d2 < 55) {
            ctx.strokeStyle = `rgba(255, 255, 255, ${1 - d2 / 55})`;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      });

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      canvas.removeEventListener('mousemove', handleCanvasMouseMove);
    };
  }, [activeSimulation]);

  return (
    <div className="bg-[#10141d] text-slate-200 font-sans min-h-[620px] rounded-b-xl p-4 sm:p-6 shadow-inner select-text">
      {/* Historical Quote Header */}
      <div className="max-w-4xl mx-auto mb-6 bg-gradient-to-r from-slate-900 to-slate-800 border-l-4 border-amber-500 rounded-r-xl p-4 shadow-md">
        <div className="flex items-center gap-2 mb-1.5 text-xs text-amber-400 font-bold uppercase tracking-wider">
          <span>📜</span>
          <span>Historical Turning Point: April 29, 2010</span>
        </div>
        <h3 className="text-xl sm:text-2xl font-serif font-bold text-white mb-2">
          Steve Jobs: &quot;Thoughts on Flash&quot;
        </h3>
        <p className="text-xs sm:text-sm text-slate-300 italic leading-relaxed">
          &ldquo;Flash was created during the PC era—for PCs and mice... But the mobile era is about
          low power devices, touch interfaces and open web standards—all areas where Flash falls short.
          New open standards created in the mobile era, such as HTML5, will win.&rdquo;
        </p>
      </div>

      {/* Comparison Battlefield (Flash vs. HTML5) */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Flash Side */}
        <div className="bg-slate-900/90 rounded-xl border border-red-500/30 overflow-hidden shadow-lg flex flex-col">
          <div className="bg-gradient-to-r from-red-900/60 to-red-800/40 px-4 py-3 border-b border-red-500/30 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl">⚠️</span>
              <div>
                <h4 className="font-bold text-sm text-red-300">Adobe Flash Player 10.1</h4>
                <p className="text-[10px] text-red-400">Proprietary Binary NPAPI Plug-in</p>
              </div>
            </div>
            <span className="bg-red-500/20 text-red-400 border border-red-500/40 text-[10px] font-mono px-2 py-0.5 rounded">
              CPU: 98%
            </span>
          </div>

          <div className="p-4 flex-1 flex flex-col justify-between">
            {/* Flash Simulation Screen */}
            <div className="aspect-[16/10] bg-black rounded-lg border-2 border-slate-800 flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
              {flashCrashed ? (
                <div className="animate-in zoom-in-95 duration-200">
                  <div className="text-5xl mb-3">💥</div>
                  <h5 className="font-bold text-red-400 text-sm mb-1">
                    The Adobe Flash plugin has crashed.
                  </h5>
                  <p className="text-[11px] text-slate-400 mb-4 max-w-xs">
                    Shockwave Flash 10.1 r102 encountered an unhandled memory exception.
                  </p>
                  <button
                    onClick={() => {
                      sound.playClick('click');
                      setFlashCrashed(false);
                    }}
                    className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-bold transition-colors"
                  >
                    Reload Plugin 🔄
                  </button>
                </div>
              ) : (
                <div>
                  <div className="text-4xl mb-2 animate-pulse">🔌</div>
                  <h5 className="font-bold text-amber-400 text-sm mb-1">Flash Applet Active</h5>
                  <p className="text-[11px] text-slate-400 mb-3">
                    Laptop fans spinning loudly... Battery draining rapidly.
                  </p>
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => {
                        sound.playGlitch();
                        setFlashCrashed(true);
                      }}
                      className="px-3 py-1 bg-red-500/30 hover:bg-red-500/50 border border-red-500/50 text-red-200 rounded text-xs transition-colors"
                    >
                      Simulate Flash Crash
                    </button>
                    <button
                      onClick={() => {
                        sound.playClick('click');
                        setBatteryDrained((b) => Math.max(5, b - 15));
                      }}
                      className="px-3 py-1 bg-amber-500/30 hover:bg-amber-500/50 border border-amber-500/50 text-amber-200 rounded text-xs transition-colors"
                    >
                      Drain Battery ({batteryDrained}%)
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Critique Points */}
            <div className="mt-4 space-y-2 text-xs text-slate-400">
              <div className="flex items-start gap-2">
                <span className="text-red-400 font-bold">✕</span>
                <span>Requires external binary plugin installation & constant security patches.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-red-400 font-bold">✕</span>
                <span>No hardware video acceleration on mobile = battery dies in 2 hours.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-red-400 font-bold">✕</span>
                <span>Designed for mouse hover; impossible to navigate with capacitive fingers.</span>
              </div>
            </div>
          </div>
        </div>

        {/* HTML5 Side */}
        <div className="bg-slate-900/90 rounded-xl border border-emerald-500/30 overflow-hidden shadow-lg flex flex-col">
          <div className="bg-gradient-to-r from-emerald-900/60 to-emerald-800/40 px-4 py-3 border-b border-emerald-500/30 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl">⚡</span>
              <div>
                <h4 className="font-bold text-sm text-emerald-300">HTML5 Canvas Engine</h4>
                <p className="text-[10px] text-emerald-400">Open Web Standards • Zero Plugins</p>
              </div>
            </div>
            <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[10px] font-mono px-2 py-0.5 rounded">
              60 FPS Hardware
            </span>
          </div>

          <div className="p-4 flex-1 flex flex-col justify-between">
            {/* HTML5 Canvas Simulation Screen */}
            <div className="rounded-lg overflow-hidden border-2 border-emerald-500/40 relative shadow-inner bg-[#0a0f1a]">
              <canvas
                ref={canvasRef}
                className="w-full h-auto block cursor-pointer"
                title="Move your mouse over the canvas to interact with particle swarm physics!"
              />
              <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-xs px-2 py-0.5 rounded text-[10px] font-mono text-emerald-400 border border-emerald-500/20">
                Interactive: Move Cursor
              </div>
            </div>

            {/* Praise Points */}
            <div className="mt-4 space-y-2 text-xs text-slate-300">
              <div className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>Native browser execution without plugins or security vulnerabilities.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>Full GPU acceleration via Canvas 2D & WebGL (smooth 60 FPS).</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>Native touch events (touchstart, touchmove) for iOS and modern smartphones.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
