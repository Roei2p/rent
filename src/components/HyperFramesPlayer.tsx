import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Maximize2,
  Share2,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Zap,
  ArrowRight,
  TrendingUp,
  Layers,
  Award
} from 'lucide-react';
import { Property, LandlordProfile, TenantProfile } from '../types';

interface HyperFramesPlayerProps {
  isOpen: boolean;
  onClose: () => void;
  property: Property;
  landlord: LandlordProfile;
  tenant: TenantProfile;
}

interface Scene {
  id: number;
  duration: number; // in seconds
  title: string;
  subtitle: string;
}

const SCENES: Scene[] = [
  {
    id: 1,
    duration: 5,
    title: 'ביטחון ושקט נפשי לשני הצדדים',
    subtitle: 'ללא עמלות תיווך כפולות · ללא פנקסי צ׳קים · ערבות דיגיטלית בנקאית מאושרת'
  },
  {
    id: 2,
    duration: 5,
    title: 'אימות תשלומי חשמל וארנונה',
    subtitle: 'בדיקה ישירה מול ספרי חברת החשמל, ספקי הגז ועיריית תל אביב-יפו'
  },
  {
    id: 3,
    duration: 5,
    title: 'תיקון תקלות באחריות ובלוח זמנים',
    subtitle: 'אנשי מקצוע קבועים ומוסמכים · זמני טיפול מוגדרים מראש · 72 שעות להידברות הוגנת'
  },
  {
    id: 4,
    duration: 5,
    title: 'תעודת יושר רשמית לכל החיים',
    subtitle: 'מוסר תשלומים מושלם של 100% · אפס הפרות חוזה · מוניטין מוכח לעסקאות עתידיות'
  }
];

export const HyperFramesPlayer: React.FC<HyperFramesPlayerProps> = ({
  isOpen,
  onClose,
  property,
  landlord,
  tenant
}) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0); // 0 to 20 seconds
  const [isMuted, setIsMuted] = useState(false);
  const [activeSpeed, setActiveSpeed] = useState<number>(1);
  const totalDuration = 20; // 20s Brag launch reel standard

  // Animation timer ref
  const animFrameRef = useRef<number | null>(null);
  const lastTimestampRef = useRef<number | null>(null);

  // Playback Loop
  useEffect(() => {
    if (!isOpen) return;

    if (isPlaying) {
      const step = (timestamp: number) => {
        if (!lastTimestampRef.current) lastTimestampRef.current = timestamp;
        const delta = (timestamp - lastTimestampRef.current) / 1000;
        lastTimestampRef.current = timestamp;

        setCurrentTime((prev) => {
          const next = prev + delta * activeSpeed;
          if (next >= totalDuration) {
            // Trigger celebration on reel completion!
            confetti({
              particleCount: 50,
              spread: 60,
              origin: { y: 0.7 }
            });
            setIsPlaying(false);
            return totalDuration;
          }
          return next;
        });

        animFrameRef.current = requestAnimationFrame(step);
      };

      animFrameRef.current = requestAnimationFrame(step);
    } else {
      lastTimestampRef.current = null;
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    }

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isPlaying, isOpen, activeSpeed]);

  if (!isOpen) return null;

  // Determine current active scene
  const currentSceneIndex = Math.min(
    Math.floor(currentTime / 5),
    SCENES.length - 1
  );
  const currentScene = SCENES[currentSceneIndex];
  const sceneProgress = ((currentTime % 5) / 5) * 100;

  const handleSeek = (newTime: number) => {
    setCurrentTime(Math.min(Math.max(newTime, 0), totalDuration));
    lastTimestampRef.current = null;
  };

  const handleRestart = () => {
    setCurrentTime(0);
    setIsPlaying(true);
    lastTimestampRef.current = null;
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-4xl w-full shadow-2xl flex flex-col overflow-hidden text-white my-auto">
        
        {/* Top bar with clean authoritative branding */}
        <div className="px-5 py-3.5 border-b border-slate-800 flex items-center justify-between bg-slate-900/90 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-700 flex items-center justify-center text-white font-bold shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm tracking-tight text-white">
                  תקציר וידאו מודרך · RentShield
                </span>
                <span className="text-[10px] font-bold bg-blue-900/60 text-blue-300 border border-blue-700/50 px-2 py-0.5 rounded-full">
                  תקציר מאושר 20 שניות
                </span>
              </div>
              <span className="text-[11px] text-slate-300 font-medium">
                סקירה מונפשת של תנאי השכירות, החשבונות והערבויות
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-lg text-xs font-mono">
              {[1, 1.5, 2].map((spd) => (
                <button
                  key={spd}
                  onClick={() => setActiveSpeed(spd)}
                  className={`px-2 py-0.5 rounded-md transition-colors ${
                    activeSpeed === spd
                      ? 'bg-blue-600 text-white font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {spd}x
                </button>
              ))}
            </div>

            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white text-sm font-bold p-1"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Viewport Canvas (16:9 Cinema Aspect Ratio) */}
        <div className="relative aspect-video bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 overflow-hidden flex items-center justify-center select-none">
          
          {/* Subtle Ambient Motion Grid */}
          <div className="absolute inset-0 opacity-15 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>

          {/* AnimatePresence for HyperFrames Scene Morphing */}
          <AnimatePresence mode="wait">
            
            {/* SCENE 1: The Frictionless Shift */}
            {currentSceneIndex === 0 && (
              <motion.div
                key="scene-1"
                initial={{ opacity: 0, scale: 0.96, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 1.04, y: -15 }}
                transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                className="relative z-10 text-center px-6 max-w-2xl space-y-5"
              >
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: [0.8, 1.05, 1] }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="w-16 h-16 mx-auto rounded-3xl bg-blue-600/30 border border-blue-500/40 flex items-center justify-center text-blue-400 shadow-xl"
                >
                  <ShieldCheck className="w-9 h-9" />
                </motion.div>

                <div className="space-y-2">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-xs font-mono uppercase tracking-widest text-blue-400 font-semibold"
                  >
                    פרק 1 · שקיפות מוחלטת
                  </motion.div>
                  <motion.h2
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight"
                  >
                    ללא צ'קים. ללא עמלות תיווך.
                    <br />
                    <span className="text-blue-400">הסכם שכירות מוגן דיגיטלית.</span>
                  </motion.h2>
                </div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.45 }}
                  className="flex flex-wrap items-center justify-center gap-3 text-xs text-slate-300"
                >
                  <span className="bg-slate-800/80 border border-slate-700/80 px-3 py-1.5 rounded-xl font-medium">
                    דיזנגוף 142, תל אביב-יפו
                  </span>
                  <span className="bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 px-3 py-1.5 rounded-xl font-medium flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    ערבות בנקאית מאומתת ₪25,200
                  </span>
                </motion.div>
              </motion.div>
            )}

            {/* SCENE 2: Real-time Infrastructure Check */}
            {currentSceneIndex === 1 && (
              <motion.div
                key="scene-2"
                initial={{ opacity: 0, scale: 0.96, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 1.04, y: -15 }}
                transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                className="relative z-10 w-full max-w-xl px-6 space-y-4 text-center"
              >
                <div className="text-xs font-bold uppercase tracking-widest text-blue-400">
                  שלב 2 · חשבונות שוטפים
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                  בדיקה ישירה מול חברת החשמל והעירייה
                </h2>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="p-3.5 rounded-2xl bg-slate-800/90 border border-slate-700 text-right space-y-1"
                  >
                    <div className="text-xs text-slate-300 font-bold">חברת החשמל</div>
                    <div className="text-lg font-black text-white font-mono">₪485</div>
                    <div className="text-[11px] text-blue-300 font-bold flex items-center gap-1">
                      <Zap className="w-3 h-3 text-blue-400" /> שולם ונבדק מול הספק
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="p-3.5 rounded-2xl bg-slate-800/90 border border-slate-700 text-right space-y-1"
                  >
                    <div className="text-xs text-slate-300 font-bold">ארנונה עיריית תל אביב</div>
                    <div className="text-lg font-black text-white font-mono">₪890</div>
                    <div className="text-[11px] text-blue-300 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-blue-400" /> שובר משולם ומאושר
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            )}

            {/* SCENE 3: SLA & 72-Hour Appeal System */}
            {currentSceneIndex === 2 && (
              <motion.div
                key="scene-3"
                initial={{ opacity: 0, scale: 0.96, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 1.04, y: -15 }}
                transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                className="relative z-10 w-full max-w-xl px-6 space-y-4 text-center"
              >
                <div className="text-xs font-mono uppercase tracking-widest text-rose-400 font-semibold">
                  פרק 3 · מנגנון 72 שעות ערעור
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                  פתרון תקלות בלוח זמנים חוזי (SLA)
                </h2>

                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.25 }}
                  className="p-4 rounded-2xl bg-amber-950/40 border border-amber-500/40 text-right space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between text-amber-300 font-bold">
                    <span>שרברב יורם שמש (איש מקצוע קבוע מוגדר)</span>
                    <span className="font-mono bg-amber-500/20 px-2 py-0.5 rounded-md flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      72 שעות הידברות פעיל
                    </span>
                  </div>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    בדירוג נמוך מ-5 כוכבים, המערכת מעניקה חלון זמן לתיקון חוזר או פיצוי לפני פרסום סופי - שומרים על יחסי שכירות בריאים.
                  </p>
                </motion.div>
              </motion.div>
            )}

            {/* SCENE 4: Integrity Certificate */}
            {currentSceneIndex === 4 || currentSceneIndex === 3 && (
              <motion.div
                key="scene-4"
                initial={{ opacity: 0, scale: 0.96, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 1.04, y: -15 }}
                transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                className="relative z-10 w-full max-w-lg px-6 text-center space-y-4"
              >
                <div className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-semibold">
                  פרק 4 · תעודת היושר
                </div>
                
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="p-5 rounded-3xl bg-emerald-950/40 border border-emerald-500/50 shadow-2xl space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="text-right">
                      <div className="text-xs text-emerald-400 font-bold">תעודת יושר רשמית</div>
                      <div className="text-base font-bold text-white">{tenant.name} & {landlord.name}</div>
                    </div>
                    <div className="text-3xl font-black text-emerald-400 font-mono">
                      98<span className="text-xs font-normal text-slate-400"> /100</span>
                    </div>
                  </div>

                  <div className="text-xs text-slate-300 text-right space-y-1 pt-1 border-t border-emerald-900/60">
                    <div className="flex justify-between">
                      <span>מוסר תשלומים:</span>
                      <span className="text-emerald-400 font-bold">100% (ללא יום פיגור)</span>
                    </div>
                    <div className="flex justify-between">
                      <span>עמידה ב-SLA:</span>
                      <span className="text-emerald-400 font-bold">98% (במסגרת החוזה)</span>
                    </div>
                  </div>
                </motion.div>

                <div className="text-xs text-slate-400">
                  RentShield · הבית של יחסי שכירות הוגנים, מהימנים ודיגיטליים בישראל
                </div>
              </motion.div>
            )}

          </AnimatePresence>

          {/* Bottom Video HUD Overlay */}
          <div className="absolute bottom-3 left-4 right-4 z-20 flex items-center justify-between text-xs font-mono text-slate-400 bg-slate-900/60 backdrop-blur-xs px-3 py-1.5 rounded-xl border border-slate-800">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
              <span className="text-white font-bold">
                {currentScene.title}
              </span>
            </div>
            <div className="tabular-nums">
              {currentTime.toFixed(1)}s / {totalDuration}s
            </div>
          </div>
        </div>

        {/* Timeline Control Bar (Seeker, Scene Selector, Play/Pause) */}
        <div className="p-4 sm:p-5 bg-slate-900 border-t border-slate-800 space-y-3 shrink-0">
          
          {/* Scrubber Progress Bar */}
          <div
            className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden cursor-pointer relative"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const clickX = e.clientX - rect.left;
              const ratio = clickX / rect.width;
              handleSeek(ratio * totalDuration);
            }}
          >
            <div
              className="bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-500 h-full transition-all duration-75 rounded-full"
              style={{ width: `${(currentTime / totalDuration) * 100}%` }}
            ></div>
          </div>

          {/* Controls Row */}
          <div className="flex items-center justify-between flex-wrap gap-3">
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-9 h-9 rounded-xl bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center transition-all shadow-xs"
                title={isPlaying ? 'השהה' : 'נגן'}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 translate-x-[-1px]" />}
              </button>

              <button
                onClick={handleRestart}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                title="הפעל מחדש"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <div className="text-xs font-mono text-slate-400 mr-2">
                סצנה {currentSceneIndex + 1} מתוך 4
              </div>
            </div>

            {/* Scene Jumping Chips */}
            <div className="hidden sm:flex items-center gap-1.5">
              {SCENES.map((sc, idx) => (
                <button
                  key={sc.id}
                  onClick={() => handleSeek(idx * 5)}
                  className={`text-[11px] px-2.5 py-1 rounded-lg border transition-all ${
                    currentSceneIndex === idx
                      ? 'border-blue-500 bg-blue-500/20 text-blue-300 font-bold'
                      : 'border-slate-800 hover:border-slate-700 text-slate-400'
                  }`}
                >
                  {sc.title.split(' ')[0]} {sc.title.split(' ')[1] || ''}
                </button>
              ))}
            </div>

            {/* Quick Share / Export Action */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  confetti({ particleCount: 30 });
                  alert('קישור לסרטון ה-Brag של הנכס הועתק ללוח לצורך שיתוף בוואטסאפ או פייסבוק!');
                }}
                className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5"
              >
                <Share2 className="w-3.5 h-3.5 text-blue-400" />
                <span>שתף Reel</span>
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
