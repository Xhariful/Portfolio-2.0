import React, { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Play,
  RotateCcw,
  Pause,
  Trophy,
  Volume2,
  VolumeX,
  Sparkles,
  Gamepad2,
  Flame,
  X,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Maximize2
} from 'lucide-react';

// Custom event to trigger opening the game modal from anywhere
export const openSnakeGameModal = () => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('open-snake-modal'));
  }
};

const COLS = 30;
const ROWS = 20;
const CELL = 24;
const START_SNAKE: [number, number][] = [
  [8, 10],
  [7, 10],
  [6, 10],
];

const DIRECTIONS: Record<string, [number, number]> = {
  ArrowUp: [0, -1],
  ArrowDown: [0, 1],
  ArrowLeft: [-1, 0],
  ArrowRight: [1, 0],
  w: [0, -1],
  s: [0, 1],
  a: [-1, 0],
  d: [1, 0],
  W: [0, -1],
  S: [0, 1],
  A: [-1, 0],
  D: [1, 0],
};

function randomFood(snake: [number, number][]): [number, number] | null {
  const empty: [number, number][] = [];
  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      if (!snake.some(([sx, sy]) => sx === x && sy === y)) {
        empty.push([x, y]);
      }
    }
  }
  return empty.length ? empty[Math.floor(Math.random() * empty.length)] : null;
}

interface GameState {
  snake: [number, number][];
  food: [number, number] | null;
  direction: [number, number];
  nextDirection: [number, number];
  score: number;
  status: 'ready' | 'playing' | 'paused' | 'over' | 'won';
}

function initialGame(): GameState {
  const snake = START_SNAKE.map((part) => [...part] as [number, number]);
  return {
    snake,
    food: randomFood(snake),
    direction: [1, 0],
    nextDirection: [1, 0],
    score: 0,
    status: 'ready',
  };
}

// Sound Synthesizer via Web Audio API
const playSoundEffect = (type: 'eat' | 'die' | 'start' | 'pause', enabled: boolean) => {
  if (!enabled || typeof window === 'undefined') return;
  try {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;
    if (type === 'eat') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.1);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
      osc.start(now);
      osc.stop(now + 0.12);
    } else if (type === 'die') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(80, now + 0.35);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      osc.start(now);
      osc.stop(now + 0.35);
    } else if (type === 'start') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, now);
      osc.frequency.setValueAtTime(659.25, now + 0.08);
      osc.frequency.setValueAtTime(783.99, now + 0.16);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      osc.start(now);
      osc.stop(now + 0.25);
    }
  } catch (_) {}
};

interface NeonSnakeModalProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const NeonSnakeModal: React.FC<NeonSnakeModalProps> = ({
  isOpen: controlledIsOpen,
  onClose: controlledOnClose,
}) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;

  const handleClose = useCallback(() => {
    if (controlledOnClose) {
      controlledOnClose();
    } else {
      setInternalIsOpen(false);
    }
    // Clean hash if was opened via hash
    try {
      if (typeof window !== 'undefined' && window.location.hash.includes('snake')) {
        window.history.replaceState(
          null,
          '',
          window.location.pathname + window.location.search
        );
      }
    } catch (_) {}
  }, [controlledOnClose]);

  // Global event listener for 'open-snake-modal' and hash check
  useEffect(() => {
    const handleOpenEvent = () => {
      setInternalIsOpen(true);
    };

    const handleHashCheck = () => {
      if (typeof window !== 'undefined' && window.location.hash.toLowerCase().includes('snake')) {
        setInternalIsOpen(true);
      }
    };

    window.addEventListener('open-snake-modal', handleOpenEvent);
    window.addEventListener('hashchange', handleHashCheck);
    handleHashCheck();

    return () => {
      window.removeEventListener('open-snake-modal', handleOpenEvent);
      window.removeEventListener('hashchange', handleHashCheck);
    };
  }, []);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const gameRef = useRef<GameState>(initialGame());
  const [snapshot, setSnapshot] = useState<{ score: number; status: GameState['status'] }>({
    score: 0,
    status: 'ready',
  });
  const [highScore, setHighScore] = useState(0);
  const highScoreRef = useRef(0);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const sync = useCallback(() => {
    const { score, status } = gameRef.current;
    setSnapshot({ score, status });
    if (score > highScoreRef.current) {
      highScoreRef.current = score;
      setHighScore(score);
      try {
        localStorage.setItem('neon-snake-high-score', String(score));
      } catch (_) {}
    }
  }, []);

  const start = useCallback(() => {
    playSoundEffect('start', soundEnabled);
    gameRef.current = initialGame();
    gameRef.current.status = 'playing';
    sync();
  }, [sync, soundEnabled]);

  const togglePause = useCallback(() => {
    const game = gameRef.current;
    if (game.status === 'playing') {
      game.status = 'paused';
    } else if (game.status === 'paused') {
      game.status = 'playing';
    }
    sync();
  }, [sync]);

  const turn = useCallback((newDirection: [number, number]) => {
    const game = gameRef.current;
    if (game.status === 'ready') {
      start();
      game.nextDirection = newDirection;
      return;
    }
    if (game.status !== 'playing') return;
    const [dx, dy] = game.direction;
    if (newDirection[0] === -dx && newDirection[1] === -dy) return;
    game.nextDirection = newDirection;
  }, [start]);

  // Read saved high score
  useEffect(() => {
    try {
      const saved = Number(localStorage.getItem('neon-snake-high-score')) || 0;
      highScoreRef.current = saved;
      setHighScore(saved);
    } catch (_) {}
  }, []);

  // When modal opens, initialize and pause game if not playing
  useEffect(() => {
    if (isOpen) {
      gameRef.current = initialGame();
      sync();
    }
  }, [isOpen, sync]);

  // Keyboard navigation & controls
  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target && ['INPUT', 'TEXTAREA'].includes(target.tagName)) return;

      const key = event.key;

      if (key === 'Escape') {
        event.preventDefault();
        handleClose();
        return;
      }

      if (DIRECTIONS[key]) {
        event.preventDefault();
        turn(DIRECTIONS[key]);
      } else if (key === ' ' || key === 'Spacebar' || key === 'Enter') {
        event.preventDefault();
        if (gameRef.current.status === 'ready' || gameRef.current.status === 'over' || gameRef.current.status === 'won') {
          start();
        } else if (gameRef.current.status === 'paused' || gameRef.current.status === 'playing') {
          togglePause();
        }
      } else if (key === 'p' || key === 'P') {
        event.preventDefault();
        togglePause();
      } else if (
        (key === 'r' || key === 'R') &&
        (gameRef.current.status === 'over' || gameRef.current.status === 'won')
      ) {
        event.preventDefault();
        start();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, start, togglePause, turn, handleClose]);

  // Main Canvas Render Loop
  useEffect(() => {
    if (!isOpen) return;

    let frame: number;
    let lastMove = 0;

    const draw = (time: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      const game = gameRef.current;
      const level = Math.floor(game.score / 5) + 1;
      const delay = Math.max(50, 130 - (level - 1) * 9);

      if (game.status === 'playing' && time - lastMove >= delay) {
        lastMove = time;
        game.direction = game.nextDirection;
        const [hx, hy] = game.snake[0];
        const [dx, dy] = game.direction;
        const head: [number, number] = [
          (hx + dx + COLS) % COLS,
          (hy + dy + ROWS) % ROWS,
        ];
        const eating =
          game.food && head[0] === game.food[0] && head[1] === game.food[1];
        const body = eating ? game.snake : game.snake.slice(0, -1);

        if (body.some(([x, y]) => x === head[0] && y === head[1])) {
          game.status = 'over';
          playSoundEffect('die', soundEnabled);
          sync();
        } else {
          game.snake.unshift(head);
          if (eating) {
            game.score += 1;
            playSoundEffect('eat', soundEnabled);
            game.food = randomFood(game.snake);
            if (!game.food) {
              game.status = 'won';
            }
            sync();
          } else {
            game.snake.pop();
          }
        }
      } else if (game.status !== 'playing') {
        lastMove = time;
      }

      // Background
      ctx.fillStyle = '#060a14';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Cyber Grid Lines
      ctx.strokeStyle = '#10192e';
      ctx.lineWidth = 1;
      for (let x = 0; x <= COLS; x++) {
        ctx.beginPath();
        ctx.moveTo(x * CELL, 0);
        ctx.lineTo(x * CELL, ROWS * CELL);
        ctx.stroke();
      }
      for (let y = 0; y <= ROWS; y++) {
        ctx.beginPath();
        ctx.moveTo(0, y * CELL);
        ctx.lineTo(COLS * CELL, y * CELL);
        ctx.stroke();
      }

      // Food (Glowing Berry)
      if (game.food) {
        const [fx, fy] = game.food;
        const pulse = Math.sin(time * 0.008) * 2.5;
        ctx.shadowColor = '#ff2e63';
        ctx.shadowBlur = 20;
        ctx.fillStyle = '#ff2e63';
        ctx.beginPath();
        ctx.arc(
          fx * CELL + CELL / 2,
          fy * CELL + CELL / 2,
          7.5 + pulse,
          0,
          Math.PI * 2
        );
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(
          fx * CELL + CELL / 2 - 2,
          fy * CELL + CELL / 2 - 2,
          2.5,
          0,
          Math.PI * 2
        );
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // Snake Body & Head
      game.snake.forEach(([x, y], index) => {
        const isHead = index === 0;
        ctx.fillStyle = isHead ? '#00f7a5' : '#05b078';
        ctx.shadowColor = '#00f7a5';
        ctx.shadowBlur = isHead ? 20 : 6;
        ctx.beginPath();
        if (typeof ctx.roundRect === 'function') {
          ctx.roundRect(x * CELL + 2, y * CELL + 2, CELL - 4, CELL - 4, 6);
        } else {
          ctx.rect(x * CELL + 2, y * CELL + 2, CELL - 4, CELL - 4);
        }
        ctx.fill();

        if (isHead) {
          ctx.fillStyle = '#060a14';
          ctx.shadowBlur = 0;
          ctx.beginPath();
          ctx.arc(x * CELL + 8, y * CELL + 8, 2.5, 0, Math.PI * 2);
          ctx.arc(x * CELL + 16, y * CELL + 8, 2.5, 0, Math.PI * 2);
          ctx.fill();
        }
      });
      ctx.shadowBlur = 0;

      // Overlay Screen for Ready / Paused / Game Over / Win
      if (game.status !== 'playing') {
        ctx.fillStyle = 'rgba(5, 10, 24, 0.82)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.textAlign = 'center';

        const titles: Record<string, string> = {
          ready: 'NEON SNAKE ARCADE',
          paused: 'GAME PAUSED',
          over: 'GAME OVER',
          won: 'VICTORY! YOU WON!',
        };

        const titleColors: Record<string, string> = {
          ready: '#00f7a5',
          paused: '#38bdf8',
          over: '#ff2e63',
          won: '#facc15',
        };

        ctx.fillStyle = titleColors[game.status] || '#f6fbff';
        ctx.shadowColor = titleColors[game.status] || '#00f7a5';
        ctx.shadowBlur = 22;
        ctx.font = 'bold 32px monospace, system-ui, sans-serif';
        ctx.fillText(titles[game.status], canvas.width / 2, canvas.height / 2 - 14);

        ctx.shadowBlur = 0;
        ctx.font = '15px system-ui, sans-serif';
        ctx.fillStyle = '#cbd5e1';

        const subtitles: Record<string, string> = {
          ready: 'Press Space or Click "Start Game" to begin',
          paused: 'Press Space or P to resume game',
          over: `Final Score: ${game.score} | Press R to play again`,
          won: `Legendary! Score: ${game.score} | Press R to play again`,
        };
        ctx.fillText(subtitles[game.status], canvas.width / 2, canvas.height / 2 + 26);
      }

      frame = requestAnimationFrame(draw);
    };

    frame = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(frame);
  }, [isOpen, sync, soundEnabled]);

  const level = Math.floor(snapshot.score / 5) + 1;

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="fixed inset-0 bg-slate-950/85 backdrop-blur-xl"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-3xl rounded-3xl bg-slate-900 border-2 border-emerald-500/50 shadow-2xl shadow-emerald-500/20 overflow-hidden flex flex-col z-10 my-auto text-slate-100"
        >
          {/* Top Bar */}
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-800 bg-slate-950/60">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shadow-xs">
                <Gamepad2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                  <span>Neon Snake Arcade</span>
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    60 FPS
                  </span>
                </h3>
                <p className="text-[11px] text-slate-400 hidden sm:block">
                  Control with Arrow Keys, WASD, or on-screen D-Pad.
                </p>
              </div>
            </div>

            {/* Actions: Sound toggle & Close */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setSoundEnabled(!soundEnabled)}
                title={soundEnabled ? 'Mute Game SFX' : 'Enable Game SFX'}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer text-xs flex items-center gap-1.5"
              >
                {soundEnabled ? (
                  <Volume2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <VolumeX className="w-4 h-4 text-slate-500" />
                )}
                <span className="text-[11px] font-mono hidden md:inline">
                  {soundEnabled ? 'SFX ON' : 'SFX OFF'}
                </span>
              </button>

              <button
                type="button"
                onClick={handleClose}
                aria-label="Close Arcade Modal"
                className="p-2 rounded-xl bg-slate-800 hover:bg-rose-500/20 hover:text-rose-400 hover:border-rose-500/40 border border-slate-700 text-slate-400 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-3 gap-2 px-5 py-2.5 bg-slate-950/40 border-b border-slate-800/80 text-center">
            <div className="px-2 py-1 rounded-xl bg-slate-800/60 border border-slate-700/60">
              <span className="text-[9px] font-mono uppercase text-slate-400 font-bold block">
                Score
              </span>
              <span className="text-base sm:text-lg font-black text-emerald-400 font-mono">
                {snapshot.score}
              </span>
            </div>

            <div className="px-2 py-1 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-center flex-col">
              <span className="text-[9px] font-mono uppercase text-slate-400 font-bold flex items-center gap-1">
                <Trophy className="w-2.5 h-2.5 text-amber-400" />
                <span>High Score</span>
              </span>
              <span className="text-base sm:text-lg font-black text-amber-400 font-mono">
                {highScore}
              </span>
            </div>

            <div className="px-2 py-1 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-center flex-col">
              <span className="text-[9px] font-mono uppercase text-slate-400 font-bold flex items-center gap-1">
                <Flame className="w-2.5 h-2.5 text-rose-400" />
                <span>Level</span>
              </span>
              <span className="text-base sm:text-lg font-black text-rose-400 font-mono">
                {level}
              </span>
            </div>
          </div>

          {/* Canvas Board Area */}
          <div className="p-3 sm:p-5 flex flex-col items-center justify-center bg-slate-950/90">
            <div className="relative w-full max-w-2xl rounded-2xl overflow-hidden border-2 border-emerald-500/40 shadow-xl bg-[#060a14]">
              <canvas
                ref={canvasRef}
                width={COLS * CELL}
                height={ROWS * CELL}
                className="w-full h-auto block select-none touch-none aspect-[30/20]"
                aria-label="Neon Snake interactive game board"
              />
            </div>

            {/* Buttons & D-PAD */}
            <div className="w-full max-w-2xl flex flex-col sm:flex-row items-center justify-between gap-4 mt-4">
              {/* Play / Pause / Restart */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={start}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/25 flex items-center gap-2 cursor-pointer transition-all active:scale-95"
                >
                  {snapshot.status === 'ready' ? (
                    <>
                      <Play className="w-4 h-4 fill-current" />
                      <span>Start Game (Space)</span>
                    </>
                  ) : (
                    <>
                      <RotateCcw className="w-4 h-4" />
                      <span>Play Again (R)</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={togglePause}
                  disabled={!['playing', 'paused'].includes(snapshot.status)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed border border-slate-700 text-slate-200 text-xs font-bold flex items-center gap-2 cursor-pointer transition-colors"
                >
                  {snapshot.status === 'paused' ? (
                    <>
                      <Play className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Resume</span>
                    </>
                  ) : (
                    <>
                      <Pause className="w-3.5 h-3.5 text-amber-400" />
                      <span>Pause (P)</span>
                    </>
                  )}
                </button>
              </div>

              {/* Touch D-PAD */}
              <div className="flex flex-col items-center">
                <div className="grid grid-cols-3 gap-1 w-32">
                  <span />
                  <button
                    type="button"
                    aria-label="Up"
                    onClick={() => turn([0, -1])}
                    className="p-2.5 rounded-xl bg-slate-800 hover:bg-purple-600 active:bg-emerald-500 border border-slate-700 text-slate-200 hover:text-white flex items-center justify-center cursor-pointer transition-colors"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <span />

                  <button
                    type="button"
                    aria-label="Left"
                    onClick={() => turn([-1, 0])}
                    className="p-2.5 rounded-xl bg-slate-800 hover:bg-purple-600 active:bg-emerald-500 border border-slate-700 text-slate-200 hover:text-white flex items-center justify-center cursor-pointer transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    aria-label="Down"
                    onClick={() => turn([0, 1])}
                    className="p-2.5 rounded-xl bg-slate-800 hover:bg-purple-600 active:bg-emerald-500 border border-slate-700 text-slate-200 hover:text-white flex items-center justify-center cursor-pointer transition-colors"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    aria-label="Right"
                    onClick={() => turn([1, 0])}
                    className="p-2.5 rounded-xl bg-slate-800 hover:bg-purple-600 active:bg-emerald-500 border border-slate-700 text-slate-200 hover:text-white flex items-center justify-center cursor-pointer transition-colors"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
                <span className="text-[9px] text-slate-400 font-mono mt-0.5">Touch D-PAD</span>
              </div>
            </div>

            {/* Keyboard shortcuts reminder */}
            <div className="mt-3 text-center text-[11px] text-slate-400">
              <span className="font-mono text-slate-300">Space:</span> Start/Pause ·{' '}
              <span className="font-mono text-slate-300">Arrow Keys / WASD:</span> Move ·{' '}
              <span className="font-mono text-slate-300">R:</span> Restart ·{' '}
              <span className="font-mono text-slate-300">Esc:</span> Close
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default NeonSnakeModal;
