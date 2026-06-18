import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { Trophy, RefreshCcw, Gamepad2, Volume2, VolumeX, Flame } from 'lucide-react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
}

interface Cloud {
  x: number;
  y: number;
  speed: number;
  size: number;
}

interface Star {
  x: number;
  y: number;
  speed: number;
  size: number;
  alpha: number;
}

export default function DinoGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'gameOver'>('idle');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  
  const gameRef = useRef({
    dinoY: 130,
    dinoVelocity: 0,
    obstacles: [] as { x: number; width: number; height: number }[],
    clouds: [] as Cloud[],
    stars: [] as Star[],
    particles: [] as Particle[],
    frame: 0,
    speed: 5.5,
    isJumping: false,
    animationId: 0
  });

  const GRAVITY = 0.7;
  const JUMP_FORCE = -13;
  const GROUND_Y = 130;
  const DINO_X = 50;
  const DINO_SIZE = 30;

  // Web Audio retro synthesizer sound generator
  const playSynthSound = (type: 'jump' | 'click' | 'gameover') => {
    if (isMuted) return;
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      
      if (type === 'jump') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(160, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(580, ctx.currentTime + 0.14);
        
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.14);
        
        osc.start();
        osc.stop(ctx.currentTime + 0.14);
      } else if (type === 'click') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.06);
        
        osc.start();
        osc.stop(ctx.currentTime + 0.06);
      } else if (type === 'gameover') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(180, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(30, ctx.currentTime + 0.35);
        
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
        
        osc.start();
        osc.stop(ctx.currentTime + 0.35);
      }
    } catch (e) {
      // Audio failed to start or was blocked by autoplay guidelines
    }
  };

  const initDecorations = () => {
    const game = gameRef.current;
    game.clouds = [];
    game.stars = [];
    game.particles = [];
    
    // Initial clouds
    for (let i = 0; i < 4; i++) {
      game.clouds.push({
        x: 40 + i * 110 + Math.random() * 40,
        y: 15 + Math.random() * 25,
        speed: 0.1 + Math.random() * 0.12,
        size: 15 + Math.random() * 15
      });
    }

    // Initial stars
    for (let i = 0; i < 15; i++) {
      game.stars.push({
        x: Math.random() * 320,
        y: Math.random() * 100,
        speed: 0.05 + Math.random() * 0.05,
        size: 0.8 + Math.random() * 1.5,
        alpha: 0.2 + Math.random() * 0.7
      });
    }
  };

  useEffect(() => {
    initDecorations();
  }, []);

  const spawnObstacle = () => {
    const game = gameRef.current;
    // Medium difficulty gaps
    const minGap = 165 + Math.random() * 55;
    const lastObstacle = game.obstacles[game.obstacles.length - 1];
    
    if (!lastObstacle || (400 - lastObstacle.x) > minGap) {
         game.obstacles.push({
            x: 400,
            width: 18 + Math.random() * (score > 800 ? 32 : 18),
            height: 28 + Math.random() * (score > 1200 ? 40 : 25)
        });
    }
  };

  const update = () => {
    if (gameState !== 'playing') return;

    const game = gameRef.current;
    
    // Dino Physics
    game.dinoVelocity += GRAVITY;
    game.dinoY += game.dinoVelocity;

    if (game.dinoY > GROUND_Y) {
      game.dinoY = GROUND_Y;
      game.dinoVelocity = 0;
      game.isJumping = false;
    }

    // Spawning running dust particles in background
    if (!game.isJumping && game.frame % 4 === 0) {
      game.particles.push({
        x: DINO_X + 4,
        y: GROUND_Y + DINO_SIZE - 2,
        vx: -1.2 * game.speed * 0.25 - Math.random(),
        vy: -0.2 - Math.random() * 0.4,
        size: 1.5 + Math.random() * 2.5,
        color: '#F27D26',
        alpha: 0.8
      });
    }

    // Move decor clouds
    game.clouds.forEach(c => {
      c.x -= c.speed + (game.speed * 0.06);
      if (c.x < -c.size * 2) {
        c.x = 340;
        c.y = 15 + Math.random() * 25;
      }
    });

    // Move decor stars
    game.stars.forEach(s => {
      s.x -= s.speed + (game.speed * 0.015);
      if (s.x < -10) {
        s.x = 330;
        s.y = Math.random() * 90;
      }
    });

    // Move Obstacles
    game.obstacles.forEach(obs => {
      obs.x -= game.speed;
    });

    // Remove off-screen obstacles
    game.obstacles = game.obstacles.filter(obs => obs.x + obs.width > 0);

    // Spawn Obstacles
    const spawnRate = score > 1500 ? 35 : score > 800 ? 48 : 60;
    if (game.frame % spawnRate === 0) {
      spawnObstacle();
    }

    // Collision Detection
    for (const obs of game.obstacles) {
      const dinoLeft = DINO_X + 6;
      const dinoRight = DINO_X + DINO_SIZE - 6;
      const dinoTop = game.dinoY + 4;
      const dinoBottom = game.dinoY + DINO_SIZE - 2;
      
      const obsLeft = obs.x;
      const obsRight = obs.x + obs.width;
      const obsTop = GROUND_Y + DINO_SIZE - obs.height;
      const obsBottom = GROUND_Y + DINO_SIZE;

      if (
        dinoRight > obsLeft && 
        dinoLeft < obsRight && 
        dinoBottom > obsTop &&
        dinoTop < obsBottom
      ) {
        // Spawn energetic crash sparks particles matching theme!
        for (let i = 0; i < 18; i++) {
          game.particles.push({
            x: DINO_X + DINO_SIZE / 2,
            y: game.dinoY + DINO_SIZE / 2,
            vx: (Math.random() - 0.5) * 7,
            vy: (Math.random() - 0.6) * 7 - 1.5,
            size: 2.5 + Math.random() * 3,
            color: i % 2 === 0 ? '#F27D26' : '#ffffff',
            alpha: 1.0
          });
        }
        playSynthSound('gameover');
        setGameState('gameOver');
        return;
      }
    }

    // Update active explosion / dust particles
    game.particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.alpha -= 0.03;
    });
    game.particles = game.particles.filter(p => p.alpha > 0);

    game.frame++;
    game.speed += 0.0012; // Gradual smooth speed increase
    setScore(Math.floor(game.frame / 4));
    
    game.animationId = requestAnimationFrame(update);
  };

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const isDark = document.documentElement.classList.contains('dark');
    const game = gameRef.current;

    // Draw background grid lines/sky gradient ambience
    if (isDark) {
      ctx.fillStyle = '#09090b';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw ambient moon/glow
      ctx.fillStyle = 'rgba(255, 255, 255, 0.02)';
      ctx.beginPath();
      ctx.arc(280, 40, 16, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.fillStyle = '#fafafa';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw warm ambient sun
      ctx.fillStyle = 'rgba(242, 125, 38, 0.03)';
      ctx.beginPath();
      ctx.arc(280, 40, 20, 0, Math.PI * 2);
      ctx.fill();
    }

    // Draw beautiful background stars (Only in Dark Mode)
    if (isDark) {
      game.stars.forEach(s => {
        ctx.fillStyle = `rgba(255, 255, 255, ${s.alpha})`;
        ctx.fillRect(s.x, s.y, s.size, s.size);
      });
    }

    // Draw Parallax Clouds
    ctx.fillStyle = isDark ? 'rgba(63, 63, 70, 0.25)' : 'rgba(212, 212, 216, 0.4)';
    game.clouds.forEach(c => {
      ctx.beginPath();
      ctx.arc(c.x, c.y, c.size, 0, Math.PI * 2);
      ctx.arc(c.x + c.size * 0.6, c.y - c.size * 0.2, c.size * 0.8, 0, Math.PI * 2);
      ctx.arc(c.x + c.size * 1.2, c.y, c.size * 0.7, 0, Math.PI * 2);
      ctx.fill();
    });

    // Draw soft parallax background hills/terrain
    ctx.fillStyle = isDark ? '#141417' : '#f1f1f4';
    ctx.beginPath();
    // Hill Layer 1 Left
    ctx.moveTo(-20, GROUND_Y + DINO_SIZE);
    ctx.quadraticCurveTo(80, GROUND_Y - 30, 180, GROUND_Y + DINO_SIZE); // Far hill coordinates
    // Hill Layer 1 Right
    ctx.moveTo(140, GROUND_Y + DINO_SIZE);
    ctx.quadraticCurveTo(240, GROUND_Y - 20, 340, GROUND_Y + DINO_SIZE);
    ctx.fill();

    // Draw active running particles/trails
    game.particles.forEach(p => {
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.alpha;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1.0; // Restore global alpha

    // Draw Ground with neat 3D grid line perspective or clean dotted look
    ctx.strokeStyle = isDark ? '#27272a' : '#e4e4e7';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, GROUND_Y + DINO_SIZE);
    ctx.lineTo(canvas.width, GROUND_Y + DINO_SIZE);
    ctx.stroke();

    // Minor retro dotted ticks on ground
    ctx.strokeStyle = isDark ? '#3d3d41' : '#d4d4d8';
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let x = -((game.frame * game.speed) % 40); x < canvas.width; x += 40) {
      ctx.moveTo(x, GROUND_Y + DINO_SIZE);
      ctx.lineTo(x - 5, GROUND_Y + DINO_SIZE + 4);
    }
    ctx.stroke();

    // Draw Obstacles (Cactus/Robot Spiders styling)
    ctx.fillStyle = isDark ? '#f4f4f5' : '#18181b';
    game.obstacles.forEach(obs => {
      // Base obstacle shape
      ctx.beginPath();
      ctx.roundRect(obs.x, GROUND_Y + DINO_SIZE - obs.height, obs.width, obs.height, 4);
      ctx.fill();
      
      // Retro visual decorative accent line inside cactus/hazard block
      ctx.fillStyle = isDark ? '#3f3f46' : '#d4d4d8';
      ctx.fillRect(obs.x + obs.width / 2 - 1, GROUND_Y + DINO_SIZE - obs.height + 4, 2, obs.height - 8);
    });

    // Draw Animated Pixel Style Dino
    ctx.fillStyle = '#F27D26'; // Brand Color
    const dY = game.dinoY;

    // Body Block
    ctx.beginPath();
    ctx.roundRect(DINO_X, dY, DINO_SIZE, DINO_SIZE, 6);
    ctx.fill();

    // Dino Snout Block
    ctx.fillRect(DINO_X + 15, dY, 19, 14);

    // Mini Back Spikes / Tail
    ctx.beginPath();
    ctx.moveTo(DINO_X, dY + DINO_SIZE * 0.4);
    ctx.lineTo(DINO_X - 6, dY + DINO_SIZE * 0.61);
    ctx.lineTo(DINO_X, dY + DINO_SIZE * 0.8);
    ctx.fill();

    // Dino Eye
    ctx.fillStyle = isDark ? '#09090b' : '#ffffff';
    ctx.fillRect(DINO_X + 22, dY + 4, 4, 4);

    // Front/Back Animated Little Leg Joints
    ctx.fillStyle = '#d15e0f'; // Darker contrast orange for legs shadow depth
    const legOffset = game.isJumping ? 0 : Math.sin(game.frame * 0.5) * 5;
    
    // Leg 1
    ctx.fillRect(DINO_X + 6, dY + DINO_SIZE, 5, 4 + legOffset);
    // Leg 2
    ctx.fillRect(DINO_X + 18, dY + DINO_SIZE, 5, 4 - legOffset);
  };

  useEffect(() => {
    if (gameState === 'playing') {
      gameRef.current.animationId = requestAnimationFrame(update);
    } else {
      cancelAnimationFrame(gameRef.current.animationId);
    }
    return () => cancelAnimationFrame(gameRef.current.animationId);
  }, [gameState, isMuted, score]);

  useEffect(() => {
    const renderLoop = () => {
      draw();
      requestAnimationFrame(renderLoop);
    };
    const id = requestAnimationFrame(renderLoop);
    return () => cancelAnimationFrame(id);
  }, []);

  const jump = () => {
    if (gameState === 'idle') {
      playSynthSound('click');
      startGame();
    } else if (gameState === 'playing' && !gameRef.current.isJumping) {
      playSynthSound('jump');
      gameRef.current.dinoVelocity = JUMP_FORCE;
      gameRef.current.isJumping = true;
    } else if (gameState === 'gameOver') {
      playSynthSound('click');
      startGame();
    }
  };

  // Keyboard Event Listener for smooth arcade controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        e.preventDefault();
        jump();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState]);

  const startGame = () => {
    gameRef.current = {
      dinoY: GROUND_Y,
      dinoVelocity: 0,
      obstacles: [],
      clouds: gameRef.current.clouds,
      stars: gameRef.current.stars,
      particles: [],
      frame: 0,
      speed: 5.5,
      isJumping: false,
      animationId: 0
    };
    setScore(0);
    setGameState('playing');
  };

  useEffect(() => {
    if (score > highScore) setHighScore(score);
  }, [score]);

  // Difficulty phase color
  const getPhaseColor = () => {
    if (score > 2000) return 'text-red-500';
    if (score > 1000) return 'text-orange-500';
    if (score > 500) return 'text-yellow-500';
    return 'text-brand';
  };

  const getPhaseLabel = () => {
    if (score > 2000) return 'Hyper Speed';
    if (score > 1000) return 'Expert';
    if (score > 500) return 'Amateur';
    return 'Novice';
  };

  return (
    <div 
      className="relative flex flex-col bg-zinc-50 dark:bg-zinc-950 rounded-2xl p-4 overflow-hidden mt-4 border border-zinc-200 dark:border-zinc-800 touch-none select-none max-w-full"
      onMouseDown={jump}
      onTouchStart={(e) => { e.preventDefault(); jump(); }}
    >
      <div className="flex justify-between items-center w-full mb-3">
         <div className="flex items-center gap-3">
            <Trophy size={14} className="text-brand animate-bounce-slow" />
            <span className="text-[10px] font-black uppercase tracking-widest opacity-60">HI {highScore}</span>
         </div>
         
         <div className="flex items-center gap-3">
            {/* Direct interactive Mute button */}
            <button
               onClick={(e) => {
                 e.stopPropagation();
                 setIsMuted(!isMuted);
               }}
               className="p-1 px-2 text-zinc-400 hover:text-brand bg-zinc-100 dark:bg-zinc-900 rounded-md transition-colors pointer-events-auto"
            >
               {isMuted ? <VolumeX size={12} /> : <Volume2 size={12} />}
            </button>

            <div className="flex flex-col items-end">
              <span className={`text-[10px] font-black uppercase tracking-widest transition-colors ${getPhaseColor()}`}>{score}</span>
              <span className="text-[7px] font-black uppercase tracking-[0.2em] opacity-30">{getPhaseLabel()}</span>
            </div>
         </div>
      </div>

      <div className="relative border border-zinc-200/50 dark:border-zinc-850 rounded-xl overflow-hidden shadow-inner bg-zinc-100 dark:bg-zinc-900">
        <canvas 
          ref={canvasRef} 
          width={320} 
          height={180} 
          className="w-full h-auto cursor-pointer block"
        />

        {gameState !== 'playing' && (
          <div className="absolute inset-0 bg-zinc-950/60 backdrop-blur-md flex flex-col items-center justify-center p-4 text-center">
            {gameState === 'gameOver' ? (
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }} 
                animate={{ scale: 1, opacity: 1 }}
                className="flex flex-col items-center"
              >
                <div className="w-10 h-10 bg-red-600/10 rounded-full flex items-center justify-center mb-2">
                   <Flame className="text-red-500 w-5 h-5 animate-pulse" />
                </div>
                <h4 className="text-white font-black uppercase tracking-tighter text-xl mb-0.5">Crash Collision</h4>
                <p className="text-white/60 text-[10px] uppercase font-black tracking-widest mb-3">Score reached: {score}</p>
                
                <button 
                  onClick={(e) => { e.stopPropagation(); startGame(); }}
                  className="bg-brand text-white px-5 py-2.5 rounded-xl flex items-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-lg shadow-brand/30 pointer-events-auto"
                >
                   <RefreshCcw size={14} />
                   <span className="text-[10px] font-black uppercase tracking-widest">Retry Run</span>
                </button>
              </motion.div>
            ) : (
              <motion.div 
                 initial={{ y: 10, opacity: 0 }} 
                 animate={{ y: 0, opacity: 1 }}
                 className="flex flex-col items-center"
              >
                <div className="w-14 h-14 bg-brand rounded-2xl flex items-center justify-center mb-3 shadow-xl shadow-brand/35 relative">
                  <Gamepad2 size={28} className="text-white animate-pulse" />
                  <span className="absolute -top-1 -right-1 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-orange-500"></span>
                  </span>
                </div>
                <h4 className="text-white font-black uppercase tracking-tighter text-lg mb-0.5">Aadesh Dash Arcade</h4>
                <p className="text-white/50 text-[9px] uppercase font-black tracking-widest mb-4">Space / Tap / Click to Jump</p>
                
                <button 
                  onClick={(e) => { e.stopPropagation(); startGame(); }}
                  className="bg-white text-zinc-900 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl pointer-events-auto"
                >
                  Insert Coin / Play
                </button>
              </motion.div>
            )}
          </div>
        )}
      </div>

      <div className="mt-2 text-[8px] font-mono uppercase tracking-[0.2em] text-center opacity-40">
        Controls: SpaceBar on Desktop • Tap Canvas on Mobile
      </div>
    </div>
  );
}
