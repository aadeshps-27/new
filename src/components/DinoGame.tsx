import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { Trophy, RefreshCcw, Gamepad2 } from 'lucide-react';

export default function DinoGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'gameOver'>('idle');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  
  const gameRef = useRef({
    dinoY: 0,
    dinoVelocity: 0,
    obstacles: [] as { x: number; width: number; height: number }[],
    frame: 0,
    speed: 5,
    isJumping: false,
    animationId: 0
  });

  const GRAVITY = 0.6;
  const JUMP_FORCE = -12;
  const GROUND_Y = 130;
  const DINO_X = 50;
  const DINO_SIZE = 30;

  const spawnObstacle = () => {
    const minGap = 200;
    const lastObstacle = gameRef.current.obstacles[gameRef.current.obstacles.length - 1];
    
    if (!lastObstacle || (150 * 5 - lastObstacle.x) > minGap) {
         gameRef.current.obstacles.push({
            x: 400,
            width: 20 + Math.random() * 20,
            height: 30 + Math.random() * 20
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

    // Move Obstacles
    game.obstacles.forEach(obs => {
      obs.x -= game.speed;
    });

    // Remove off-screen obstacles
    game.obstacles = game.obstacles.filter(obs => obs.x + obs.width > 0);

    // Spawn Obstacles
    if (game.frame % 60 === 0) {
      spawnObstacle();
    }

    // Collision Detection
    for (const obs of game.obstacles) {
      if (
        DINO_X < obs.x + obs.width &&
        DINO_X + DINO_SIZE > obs.x &&
        game.dinoY < GROUND_Y && // Simple check for landing on top but actually we want hit
        game.dinoY + DINO_SIZE > GROUND_Y - obs.height + 30 // adjust for dino base
      ) {
        // More precise hit box
        const dinoLeft = DINO_X + 5;
        const dinoRight = DINO_X + DINO_SIZE - 5;
        const dinoBottom = game.dinoY + DINO_SIZE;
        const obsTop = GROUND_Y + DINO_SIZE - obs.height;

        if (dinoRight > obs.x && dinoLeft < obs.x + obs.width && dinoBottom > obsTop) {
            setGameState('gameOver');
            return;
        }
      }
    }

    game.frame++;
    game.speed += 0.001;
    setScore(Math.floor(game.frame / 5));
    
    game.animationId = requestAnimationFrame(update);
  };

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw Ground
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, GROUND_Y + DINO_SIZE);
    ctx.lineTo(canvas.width, GROUND_Y + DINO_SIZE);
    ctx.stroke();

    // Draw Dino
    ctx.fillStyle = '#F27D26'; // brand color
    // Simple Dino Shape
    ctx.beginPath();
    ctx.roundRect(DINO_X, gameRef.current.dinoY, DINO_SIZE, DINO_SIZE, 8);
    ctx.fill();
    // Eye
    ctx.fillStyle = 'white';
    ctx.fillRect(DINO_X + 20, gameRef.current.dinoY + 5, 4, 4);

    // Draw Obstacles
    ctx.fillStyle = '#18181b';
    gameRef.current.obstacles.forEach(obs => {
      ctx.beginPath();
      ctx.roundRect(obs.x, GROUND_Y + DINO_SIZE - obs.height, obs.width, obs.height, 4);
      ctx.fill();
    });
  };

  useEffect(() => {
    if (gameState === 'playing') {
      gameRef.current.animationId = requestAnimationFrame(update);
    } else {
      cancelAnimationFrame(gameRef.current.animationId);
    }
    return () => cancelAnimationFrame(gameRef.current.animationId);
  }, [gameState]);

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
      startGame();
    } else if (gameState === 'playing' && !gameRef.current.isJumping) {
      gameRef.current.dinoVelocity = JUMP_FORCE;
      gameRef.current.isJumping = true;
    } else if (gameState === 'gameOver') {
      startGame();
    }
  };

  const startGame = () => {
    gameRef.current = {
      dinoY: GROUND_Y,
      dinoVelocity: 0,
      obstacles: [],
      frame: 0,
      speed: 5,
      isJumping: false,
      animationId: 0
    };
    setScore(0);
    setGameState('playing');
  };

  useEffect(() => {
    if (score > highScore) setHighScore(score);
  }, [score]);

  return (
    <div 
      className="relative flex flex-col items-center bg-zinc-50 dark:bg-zinc-950 rounded-2xl p-4 overflow-hidden mt-4 border border-zinc-200 dark:border-zinc-800 touch-none select-none"
      onMouseDown={jump}
      onTouchStart={(e) => { e.preventDefault(); jump(); }}
    >
      <div className="flex justify-between w-full mb-2">
         <div className="flex items-center gap-2">
            <Trophy size={14} className="text-brand" />
            <span className="text-[10px] font-black uppercase tracking-widest opacity-50">HI {highScore}</span>
         </div>
         <span className="text-[10px] font-black uppercase tracking-widest text-brand">{score}</span>
      </div>

      <canvas 
        ref={canvasRef} 
        width={320} 
        height={180} 
        className="w-full h-auto cursor-pointer"
      />

      {gameState !== 'playing' && (
        <div className="absolute inset-0 bg-zinc-950/40 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center">
          {gameState === 'gameOver' ? (
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }}
              className="flex flex-col items-center"
            >
              <h4 className="text-white font-black uppercase tracking-tighter text-2xl mb-1">Game Over</h4>
              <p className="text-white/60 text-[10px] uppercase font-black tracking-widest mb-4">Final Score: {score}</p>
              <button 
                onClick={(e) => { e.stopPropagation(); startGame(); }}
                className="bg-brand text-white p-4 rounded-2xl flex items-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-lg shadow-brand/20"
              >
                 <RefreshCcw size={18} />
                 <span className="text-xs font-black uppercase tracking-widest">Restart</span>
              </button>
            </motion.div>
          ) : (
            <motion.div 
               initial={{ y: 10, opacity: 0 }} 
               animate={{ y: 0, opacity: 1 }}
               className="flex flex-col items-center"
            >
              <div className="w-16 h-16 bg-brand rounded-2xl flex items-center justify-center mb-4 shadow-xl shadow-brand/20">
                <Gamepad2 size={32} className="text-white" />
              </div>
              <h4 className="text-white font-black uppercase tracking-tighter text-xl mb-1">Aadesh Dash</h4>
              <p className="text-white/60 text-[10px] uppercase font-black tracking-widest mb-6">Tap to jump & avoid obstacles</p>
              <button 
                onClick={(e) => { e.stopPropagation(); startGame(); }}
                className="bg-white text-zinc-900 px-8 py-4 rounded-xl text-xs font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl"
              >
                Play Now
              </button>
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
}
