"use client";

import { useState, useEffect, useRef } from "react";
import { SubcontinentRoute } from "@/types/route";
import { Modal } from "@/components/ui/Modal";
import { useDesiRoute } from "@/lib/context/DesiRouteContext";
import { X, Play, Pause, Volume2, Sparkles, Utensils, Check, Clock } from "lucide-react";

interface NinePmClubModalProps {
  isOpen: boolean;
  onClose: () => void;
  route: SubcontinentRoute;
}

function formatClock(totalSeconds: number): string {
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

export function NinePmClubModal(props: NinePmClubModalProps) {
  if (!props.isOpen) return null;
  return <NinePmClubModalContent key={props.route.id} {...props} />;
}

function NinePmClubModalContent({ isOpen, onClose, route }: NinePmClubModalProps) {
  const { rsvpedRouteIds, toggleRsvpRoute } = useDesiRoute();
  const [isPlaying, setIsPlaying] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);

  const audioTitle = route.audioGuideTitle || "Himalayan Whispers: Sacred Alleys & Mountain Folklore";
  const narrator = route.audioGuideNarrator || "Local Cultural Chronicler";
  const durationMinutes = route.audioGuideDurationMinutes || 12;
  const totalSeconds = durationMinutes * 60;
  const rsvpSuccess = rsvpedRouteIds.includes(route.id);

  // Real playback ticker & gentle Web Audio Himalayan singing-bowl drone
  useEffect(() => {
    if (!isPlaying) {
      if (oscRef.current) {
        try {
          oscRef.current.stop();
          oscRef.current.disconnect();
        } catch {
          // Ignore already stopped oscillator
        }
        oscRef.current = null;
      }
      return;
    }

    // Attempt subtle calming ambient singing bowl harmonic (174 Hz soft sine fade)
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        if (!audioCtxRef.current) {
          audioCtxRef.current = new AudioCtx();
        }
        const ctx = audioCtxRef.current;
        if (ctx.state === "suspended") {
          void ctx.resume();
        }
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.value = 174; // Warm low Solfeggio grounding hum
        gain.gain.value = 0.025;
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        oscRef.current = osc;
      }
    } catch {
      // Headless or blocked autoplay — silent timer mode still advances cleanly
    }

    const timer = window.setInterval(() => {
      setElapsedSeconds((prev) => {
        if (prev + 1 >= totalSeconds) {
          setIsPlaying(false);
          return totalSeconds;
        }
        return prev + 1;
      });
    }, 1000);

    return () => {
      window.clearInterval(timer);
      if (oscRef.current) {
        try {
          oscRef.current.stop();
          oscRef.current.disconnect();
        } catch {
          // Ignore
        }
        oscRef.current = null;
      }
    };
  }, [isPlaying, totalSeconds]);

  const progressPct = Math.min(100, Math.round((elapsedSeconds / Math.max(1, totalSeconds)) * 100));

  return (
    <Modal isOpen={isOpen} onClose={onClose} labelledBy="ninepm-modal-title">
      <button
        type="button"
        onClick={onClose}
        className="absolute top-6 right-6 p-2 rounded-full visionos-glass text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
        aria-label="Close 9 PM Club Modal"
      >
        <X className="w-5 h-5" />
      </button>

      {/* Header */}
      <div className="flex items-center gap-3.5 mb-2">
        <div className="w-11 h-11 rounded-2xl bg-purple-500/15 text-purple-600 dark:text-purple-400 flex items-center justify-center border border-purple-500/20 shadow-xs">
          <Volume2 className="w-5 h-5" aria-hidden="true" />
        </div>
        <div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-purple-600 dark:text-purple-400 font-extrabold">
            Mode 2 • Solo Companion & Micro-Community
          </span>
          <h3 id="ninepm-modal-title" className="text-xl sm:text-2xl font-black text-slate-950 dark:text-slate-50">
            The 9 PM Club
          </h3>
        </div>
      </div>

      <p className="text-xs text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
        Solo travel doesn&apos;t mean being lonely after dark. Grounding synthesized Himalayan soundscape lore and casual 8:30 PM pure-veg dinner tables.
      </p>

      {/* Part 1: In-Browser Ambient Audio Vignette */}
      <div className="p-4 sm:p-5 rounded-2xl visionos-glass border border-slate-200/70 dark:border-slate-800 mb-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] uppercase font-mono font-bold text-purple-600 dark:text-purple-400">
            Audio Vignette • {durationMinutes} Mins
          </span>
          <span className="text-[10px] font-mono text-slate-500 flex items-center gap-1">
            <Clock className="w-3 h-3 text-purple-500" aria-hidden="true" /> Auto-stops at sleep
          </span>
        </div>

        <h4 className="text-base font-extrabold text-slate-900 dark:text-slate-100">{audioTitle}</h4>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Narrated by {narrator}</p>

        <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-800/60 space-y-3">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-10 h-10 rounded-full bg-purple-600 hover:bg-purple-700 text-white flex items-center justify-center shadow-md shadow-purple-500/25 transition-all tactile-button-3d"
              aria-label={isPlaying ? "Pause ambient audio" : "Play ambient audio"}
            >
              {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 ml-0.5 fill-current" />}
            </button>

            <div className="flex-1 space-y-1">
              <div
                className="h-2 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden"
                role="progressbar"
                aria-valuenow={progressPct}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                <div className="h-full bg-purple-600 transition-all duration-300" style={{ width: `${progressPct}%` }} />
              </div>
              <div className="flex justify-between text-[10px] font-mono text-slate-400">
                <span>{formatClock(elapsedSeconds)}</span>
                <span>{durationMinutes}:00</span>
              </div>
            </div>
          </div>

          <p className="text-[11px] text-slate-500 dark:text-slate-400 italic">
            ✨ Synthesized 100% client-side via Web Audio with zero third-party streams or tracking.
          </p>
        </div>
      </div>

      {/* Part 2: 8:30 PM Backpacker Dinner Pods */}
      <div className="p-4 sm:p-5 rounded-2xl bg-purple-500/10 dark:bg-purple-950/30 border border-purple-500/20">
        <div className="flex items-center justify-between mb-1.5">
          <h4 className="text-xs font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
            <Utensils className="w-4 h-4 text-purple-600 dark:text-purple-400" aria-hidden="true" />
            Tonight&apos;s 8:30 PM Solo Table in {route.destination}
          </h4>
          <span className="text-[10px] font-mono font-bold text-purple-700 dark:text-purple-300 bg-purple-500/20 px-2 py-0.5 rounded-full border border-purple-500/30">
            {rsvpSuccess ? "Seat Held" : "3 Spots Open"}
          </span>
        </div>

        <p className="text-[11px] text-slate-600 dark:text-slate-400 mb-3 leading-relaxed">
          Every evening at 8:30 PM, an opt-in table of 4–6 solo travelers convenes at a pre-vetted pure veg mountain cafe. Zero forced small talk.
        </p>

        <div className="p-3 rounded-xl visionos-glass border border-slate-200/70 dark:border-slate-800 text-xs mb-3.5 space-y-1">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-900 dark:text-slate-100">The Himalayan Pine Kitchen</span>
            <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">Pure Veg & Jain</span>
          </div>
          <p className="text-[11px] text-slate-500">Old Town Bazaar Lane, Walking distance from Zostel/Homestays</p>
        </div>

        <button
          type="button"
          onClick={() => toggleRsvpRoute(route.id)}
          aria-pressed={rsvpSuccess}
          className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all tactile-button-3d ${
            rsvpSuccess
              ? "bg-emerald-600 text-white shadow-xs"
              : "bg-purple-600 hover:bg-purple-700 text-white shadow-md shadow-purple-500/20"
          }`}
        >
          {rsvpSuccess ? (
            <>
              <Check className="w-4 h-4" aria-hidden="true" />
              <span>Reserved! Show up at 8:30 PM & say &quot;9 PM Club&quot; (Click to Cancel)</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" aria-hidden="true" />
              <span>Reserve Seat at Tonight&apos;s 8:30 PM Table (Free)</span>
            </>
          )}
        </button>
      </div>
    </Modal>
  );
}
