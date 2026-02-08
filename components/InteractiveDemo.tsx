"use client";

import { useState, useEffect, useRef, useMemo, useCallback, SVGProps } from "react";

// ═══════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════

interface CityAfterSegment {
  t: string;
  h?: boolean;
}

interface CityData {
  city: string;
  state: string;
  dot: string;
  unique: number;
  words: number;
  after: CityAfterSegment[];
}

type Phase = "intro" | "before" | "transforming" | "after" | "cycling";

// ═══════════════════════════════════════════════════════════
// DATA
// ═══════════════════════════════════════════════════════════

const CITIES: CityData[] = [
  {
    city: "Austin", state: "TX", dot: "#C2410C", unique: 98, words: 1842,
    after: [
      { t: "From " },
      { t: "Austin's vibrant South Congress district", h: true },
      { t: " to family practices near " },
      { t: "Round Rock and Cedar Park", h: true },
      { t: ", the city's " },
      { t: "964,000 residents", h: true },
      { t: " have access to a growing network of top-rated dental providers. With " },
      { t: "UT Austin's dental school", h: true },
      { t: " feeding local talent into the market, patients benefit from cutting-edge care. Practices in the " },
      { t: "Domain and Mueller developments", h: true },
      { t: " are expanding rapidly to meet demand in Austin's booming north side." },
    ],
  },
  {
    city: "Denver", state: "CO", dot: "#9A3412", unique: 96, words: 1650,
    after: [
      { t: "Clinics concentrated around " },
      { t: "Denver's booming RiNo neighborhood", h: true },
      { t: " have expanded into " },
      { t: "Lakewood and Aurora", h: true },
      { t: " as the metro area's " },
      { t: "715,000 residents", h: true },
      { t: " drive demand for accessible dental care. The " },
      { t: "Colorado Dental Association", h: true },
      { t: " reports a 23% increase in new practices since 2022. Altitude-related dry mouth concerns make " },
      { t: "Denver's preventive care specialists", h: true },
      { t: " particularly sought-after among new residents." },
    ],
  },
  {
    city: "Portland", state: "OR", dot: "#166534", unique: 97, words: 1923,
    after: [
      { t: "Rooted in " },
      { t: "Portland's Alberta Arts District", h: true },
      { t: " with practices extending to " },
      { t: "Beaverton and Tigard", h: true },
      { t: ", the city's " },
      { t: "641,000 residents", h: true },
      { t: " benefit from a community known for " },
      { t: "holistic and eco-conscious approaches", h: true },
      { t: " to dental health. Portland's high " },
      { t: "coffee and craft beer consumption", h: true },
      { t: " has driven unique demand for cosmetic dentistry and stain-prevention specialists." },
    ],
  },
  {
    city: "Nashville", state: "TN", dot: "#92400E", unique: 95, words: 1780,
    after: [
      { t: "Across " },
      { t: "Nashville's rapidly expanding East Side", h: true },
      { t: " and established clinics along " },
      { t: "West End Avenue near Vanderbilt", h: true },
      { t: ", the city's " },
      { t: "683,000 residents", h: true },
      { t: " are fueling unprecedented demand. " },
      { t: "Nashville's entertainment industry", h: true },
      { t: " creates outsized demand for cosmetic dentistry — performers and songwriters on " },
      { t: "Music Row", h: true },
      { t: " represent a growing niche for local practices." },
    ],
  },
  {
    city: "Charlotte", state: "NC", dot: "#991B1B", unique: 99, words: 1695,
    after: [
      { t: "From " },
      { t: "Charlotte's bustling South End corridor", h: true },
      { t: " to growing suburbs like " },
      { t: "Huntersville and Matthews", h: true },
      { t: ", the metro's " },
      { t: "897,000 residents", h: true },
      { t: " represent one of the fastest-growing dental markets in the Southeast. The influx of " },
      { t: "banking professionals from Uptown's financial district", h: true },
      { t: " has driven demand for premium cosmetic work, while " },
      { t: "UNC Charlotte's health science campus", h: true },
      { t: " feeds a pipeline of new providers." },
    ],
  },
];

const GENERIC_PARTS: string[] = [
  "Welcome to ",
  "{CITY}",
  ", where you'll find some of the best dentists in the area. With a growing population, residents have access to quality dental care providers. Whether you're looking for general dentistry or specialized services, ",
  "{CITY}",
  " has plenty of options to meet your needs. Browse our directory to find top-rated dentists near you.",
];

// ═══════════════════════════════════════════════════════════
// ICONS
// ═══════════════════════════════════════════════════════════

const I = {
  check: (p: SVGProps<SVGSVGElement>) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" {...p}><polyline points="20 6 9 17 4 12" /></svg>,
  spin: (p: SVGProps<SVGSVGElement>) => <svg viewBox="0 0 24 24" fill="none" strokeWidth={2.5} strokeLinecap="round" {...p}><path d="M12 2a10 10 0 0110 10" stroke="currentColor"><animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur=".7s" repeatCount="indefinite" /></path></svg>,
  spark: (p: SVGProps<SVGSVGElement>) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M12 3l1.5 5.5L19 10l-5.5 1.5L12 17l-1.5-5.5L5 10l5.5-1.5z" /></svg>,
  swap: (p: SVGProps<SVGSVGElement>) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...p}><polyline points="17 1 21 5 17 9" /><path d="M3 11V9a4 4 0 014-4h14" /><polyline points="7 23 3 19 7 15" /><path d="M21 13v2a4 4 0 01-4 4H3" /></svg>,
  arrow: (p: SVGProps<SVGSVGElement>) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M5 12h14M12 5l7 7-7 7" /></svg>,
  copy: (p: SVGProps<SVGSVGElement>) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" {...p}><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" /></svg>,
  bolt: (p: SVGProps<SVGSVGElement>) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>,
  upload: (p: SVGProps<SVGSVGElement>) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>,
  settings: (p: SVGProps<SVGSVGElement>) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" /></svg>,
};

// ═══════════════════════════════════════════════════════════
// DOT GRID
// ═══════════════════════════════════════════════════════════

function DotGrid({ isBefore }: { isBefore: boolean }) {
  const delays = useMemo(() =>
    Array.from({ length: 100 }, () => Math.random() * 1.2), []
  );

  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="flex flex-wrap gap-[2.5px] w-[108px] justify-center">
        {delays.map((d, i) => (
          <div
            key={i}
            className="rounded-[1px]"
            style={{
              width: 3.5, height: 3.5,
              backgroundColor: isBefore ? '#C2410C' : '#166534',
              opacity: isBefore ? 0.35 : 0.65,
              transition: `all 0.4s ease ${isBefore ? '0s' : `${d}s`}`,
            }}
          />
        ))}
      </div>
      <span
        className="text-[9px] font-bold uppercase tracking-wider transition-colors duration-500"
        style={{ color: isBefore ? '#991B1B' : '#166534' }}
      >
        {isBefore ? '500 duplicate pages' : '500 unique pages'}
      </span>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// SCORE GAUGE
// ═══════════════════════════════════════════════════════════

function ScoreGauge({ score, isBefore }: { score: number; isBefore: boolean }) {
  const val = isBefore ? 12 : score;
  const color = isBefore ? '#991B1B' : '#166534';
  const r = 26;
  const circ = 2 * Math.PI * r;
  const off = circ - (val / 100) * circ;

  return (
    <div className="flex flex-col items-center gap-0.5">
      <div className="relative w-[64px] h-[64px]">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 60 60">
          <circle cx="30" cy="30" r={r} fill="none" stroke="#E0DBD2" strokeWidth="4" />
          <circle
            cx="30" cy="30" r={r} fill="none"
            stroke={color} strokeWidth="4" strokeLinecap="round"
            strokeDasharray={circ} strokeDashoffset={off}
            style={{ transition: 'stroke-dashoffset 0.8s ease, stroke 0.4s ease' }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-[15px] font-extrabold transition-colors duration-[400ms]"
            style={{ color, fontVariantNumeric: 'tabular-nums' }}
          >{val}%</span>
        </div>
      </div>
      <span className="text-[9px] font-bold uppercase tracking-wider transition-colors duration-500"
        style={{ color }}
      >Unique</span>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// STREAMING TEXT
// ═══════════════════════════════════════════════════════════

function StreamText({ segments, speed = 6 }: { segments: CityAfterSegment[]; speed?: number }) {
  const [chars, setChars] = useState(0);
  const total = segments.reduce((s, seg) => s + seg.t.length, 0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);

  useEffect(() => {
    setChars(0);
    let i = 0;
    intervalRef.current = setInterval(() => {
      i += 2;
      setChars(i);
      if (i >= total) clearInterval(intervalRef.current);
    }, speed);
    return () => clearInterval(intervalRef.current);
  }, [segments, speed, total]);

  let rem = chars;
  const streaming = chars < total;

  return (
    <span>
      {segments.map((seg, si) => {
        if (rem <= 0) return null;
        const len = Math.min(rem, seg.t.length);
        rem -= len;
        const text = seg.t.slice(0, len);
        return seg.h ? (
          <mark key={si} className="bg-[#EDEAD6] text-inherit px-0.5 rounded border-b-2 border-[#C2410C]/30">{text}</mark>
        ) : (
          <span key={si}>{text}</span>
        );
      })}
      {streaming && <span className="inline-block w-[2px] h-[14px] bg-[#C2410C] ml-0.5 -mb-[2px] animate-pulse" />}
    </span>
  );
}

// ═══════════════════════════════════════════════════════════
// BEFORE TEXT with cycling city name
// ═══════════════════════════════════════════════════════════

function BeforeText({ activeCityName, isVisible }: { activeCityName: string; isVisible: boolean }) {
  const [displayCity, setDisplayCity] = useState(activeCityName);
  const allNames = CITIES.map(c => c.city);

  useEffect(() => {
    let i = allNames.indexOf(activeCityName);
    if (i === -1) i = 0;
    setDisplayCity(allNames[i]);
    if (!isVisible) return;
    const interval = setInterval(() => {
      i = (i + 1) % allNames.length;
      setDisplayCity(allNames[i]);
    }, 600);
    return () => clearInterval(interval);
  }, [activeCityName, isVisible]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <span className="text-[#A39E95]">
      {GENERIC_PARTS.map((p, i) =>
        p === "{CITY}" ? (
          <span key={i} className="font-semibold text-[#991B1B] transition-all duration-200"
            style={{ textDecoration: 'underline', textDecorationColor: 'rgba(153,27,27,0.3)', textDecorationStyle: 'wavy', textUnderlineOffset: '4px' }}
          >{displayCity}</span>
        ) : <span key={i}>{p}</span>
      )}
    </span>
  );
}

// ═══════════════════════════════════════════════════════════
// INTRO SEQUENCE
// ═══════════════════════════════════════════════════════════

function IntroSequence({ onDone }: { onDone: () => void }) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    setStep(0);
    const t: ReturnType<typeof setTimeout>[] = [];
    t.push(setTimeout(() => setStep(1), 600));
    t.push(setTimeout(() => setStep(2), 1200));
    t.push(setTimeout(() => setStep(3), 1800));
    t.push(setTimeout(() => setStep(4), 2800));
    t.push(setTimeout(onDone, 3400));
    return () => t.forEach(clearTimeout);
  }, [onDone]);

  const items = [
    { icon: <I.upload className="w-3.5 h-3.5" />, label: "dentists_500_cities.csv uploaded", trigger: 1 },
    { icon: <I.settings className="w-3.5 h-3.5" />, label: 'Template: "Best {Service} in {City}"', trigger: 2 },
    { icon: <I.bolt className="w-3.5 h-3.5" />, label: step >= 4 ? "500 pages generated" : "Generating 500 pages...", trigger: 3 },
  ];

  return (
    <div className="py-10 px-8 flex flex-col items-center" style={{ animation: 'fadeUp .3s ease' }}>
      <div className="w-full max-w-xs space-y-3">
        {items.map((item, i) => {
          const active = step >= item.trigger;
          const done = step > item.trigger || (i === 2 && step >= 4);
          const loading = active && !done && i === 2;

          return (
            <div
              key={i}
              className="flex items-center gap-3 transition-all duration-[400ms]"
              style={{
                opacity: active ? 1 : 0.15,
                transform: `translateX(${active ? 0 : 10}px)`,
                transition: 'all 0.35s ease',
              }}
            >
              <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${
                done ? 'bg-[#DCFCE7] text-[#166534]'
                  : loading ? 'bg-[#FFF7ED] text-[#C2410C]'
                    : 'bg-[#EDEAD6] text-[#A39E95]'
              }`}>
                {done ? <I.check className="w-3.5 h-3.5" /> : loading ? <I.spin className="w-3.5 h-3.5" /> : item.icon}
              </div>
              <span className={`text-[13px] font-medium transition-colors duration-300 ${
                done ? 'text-[#1A1A19]' : loading ? 'text-[#706B63]' : 'text-[#A39E95]'
              }`}>{item.label}</span>
            </div>
          );
        })}
      </div>

      {/* Mini progress bar */}
      <div className="w-full max-w-xs mt-6">
        <div className="h-1.5 bg-[#EDEAD6] rounded-full overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#C2410C] to-[#166534] transition-all duration-700 ease-out"
            style={{ width: step === 0 ? '5%' : step === 1 ? '25%' : step === 2 ? '50%' : step === 3 ? '80%' : '100%' }}
          />
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════════════════

export default function InteractiveDemo() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [cityIdx, setCityIdx] = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  const [manualMode, setManualMode] = useState(false);
  const autoRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(true);

  // Pause auto-play when scrolled out of view to prevent off-screen height
  // changes from causing unwanted scroll corrections
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const handleIntroDone = useCallback(() => setPhase("before"), []);

  const city = CITIES[cityIdx];
  const isBefore = phase === "before";
  const isAfter = phase === "after" || phase === "cycling";

  // ── Auto-play orchestration ──

  useEffect(() => {
    if (phase !== "before" || manualMode || !isVisible) return;
    autoRef.current = setTimeout(() => {
      setTransitioning(true);
      setTimeout(() => {
        setPhase("after");
        setTransitioning(false);
      }, 300);
    }, 7000);
    return () => clearTimeout(autoRef.current);
  }, [phase, manualMode, isVisible]);

  useEffect(() => {
    if (phase !== "after" || manualMode || !isVisible) return;
    autoRef.current = setTimeout(() => {
      setPhase("cycling");
    }, 6000);
    return () => clearTimeout(autoRef.current);
  }, [phase, manualMode, isVisible]);

  useEffect(() => {
    if (phase !== "cycling" || manualMode || !isVisible) return;
    autoRef.current = setTimeout(() => {
      setTransitioning(true);
      setTimeout(() => {
        setCityIdx(prev => (prev + 1) % CITIES.length);
        setTransitioning(false);
      }, 250);
    }, 6000);
    return () => clearTimeout(autoRef.current);
  }, [phase, cityIdx, manualMode, isVisible]);

  // ── Manual controls ──

  function selectCity(i: number) {
    if (i === cityIdx && isAfter) return;
    setManualMode(true);
    clearTimeout(autoRef.current);
    setTransitioning(true);
    setTimeout(() => {
      setCityIdx(i);
      setPhase("after");
      setTransitioning(false);
    }, 200);
  }

  function toggleToBefore() {
    if (isBefore) return;
    setManualMode(true);
    clearTimeout(autoRef.current);
    setTransitioning(true);
    setTimeout(() => {
      setPhase("before");
      setTransitioning(false);
    }, 250);
  }

  function toggleToAfter() {
    if (isAfter) return;
    setManualMode(true);
    clearTimeout(autoRef.current);
    setTransitioning(true);
    setTimeout(() => {
      setPhase("after");
      setTransitioning(false);
    }, 250);
  }

  // ── Hint text ──
  function getHint() {
    if (phase === "intro") return { icon: <I.bolt className="w-3 h-3" />, text: "Setting up your generation..." };
    if (isBefore && !manualMode) return { icon: <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#991B1B] animate-pulse" />, text: "Same text for every city — only the name changes" };
    if (isBefore) return { icon: <I.spark className="w-3 h-3" />, text: "Click \"After\" to see the Seoscribed version" };
    if (isAfter && !manualMode) return { icon: <I.spark className="w-3 h-3" />, text: "Each city gets completely unique content — click any to compare" };
    return { icon: <I.spark className="w-3 h-3" />, text: "Click any city — every page is genuinely different" };
  }

  const hint = getHint();

  return (
    <div ref={containerRef} className="mt-20 w-full max-w-[680px] mx-auto relative">

      {/* Glow — shifts color with phase */}
      <div
        className="absolute -inset-4 rounded-[32px] blur-3xl pointer-events-none transition-all duration-1000"
        style={{
          background: isBefore
            ? 'radial-gradient(ellipse at center, rgba(194,65,12,0.05) 0%, transparent 70%)'
            : phase === "intro"
              ? 'radial-gradient(ellipse at center, rgba(194,65,12,0.04) 0%, transparent 70%)'
              : 'radial-gradient(ellipse at center, rgba(22,101,52,0.06) 0%, transparent 70%)'
        }}
      />

      {/* Main container */}
      <div className="relative bg-white rounded-2xl border border-[#E0DBD2] shadow-2xl shadow-[#706B63]/10 overflow-hidden">

        {/* Browser chrome */}
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-[#E0DBD2] bg-[#F8F6F1]/80">
          <div className="flex gap-1.5">
            {["#FCA5A5", "#FDE68A", "#86EFAC"].map((c, i) => (
              <div key={i} className="w-2.5 h-2.5 rounded-full" style={{ background: c, opacity: 0.8 }} />
            ))}
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 bg-[#EDEAD6] rounded-md">
            <svg className="w-2.5 h-2.5 text-[#A39E95]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0110 0v4" />
            </svg>
            <span className="text-[10px] text-[#A39E95] font-mono tracking-wide">app.seoscribed.com</span>
          </div>
          <div className="w-8" />
        </div>

        {/* ── Intro phase ── */}
        {phase === "intro" && (
          <IntroSequence onDone={handleIntroDone} />
        )}

        {/* ── Showcase phase (before / after / cycling) ── */}
        {phase !== "intro" && (
          <>
            {/* City pills + toggle bar */}
            <div className="px-4 sm:px-5 pt-4 pb-3 border-b border-[#E0DBD2]/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
              style={{ animation: 'fadeUp .3s ease' }}
            >
              <div className="flex gap-1.5 flex-wrap">
                {CITIES.map((c, i) => (
                  <button
                    key={c.city}
                    onClick={() => selectCity(i)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 border ${
                      i === cityIdx
                        ? 'bg-[#1A1A19] text-white border-[#1A1A19] shadow-sm'
                        : 'bg-white text-[#706B63] border-[#E0DBD2] hover:border-[#C2410C]/30 hover:text-[#1A1A19]'
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: i === cityIdx ? '#fff' : c.dot }} />
                    {c.city}
                  </button>
                ))}
              </div>

              <div className="flex items-center bg-[#EDEAD6] rounded-lg p-0.5 shrink-0">
                <button
                  onClick={toggleToBefore}
                  className={`px-3 py-1.5 rounded-md text-[11px] font-bold uppercase tracking-wide transition-all duration-200 ${
                    isBefore ? 'bg-white text-[#991B1B] shadow-sm' : 'text-[#A39E95] hover:text-[#706B63]'
                  }`}
                >Before</button>
                <button
                  onClick={toggleToAfter}
                  className={`px-3 py-1.5 rounded-md text-[11px] font-bold uppercase tracking-wide transition-all duration-200 ${
                    isAfter ? 'bg-white text-[#166534] shadow-sm' : 'text-[#A39E95] hover:text-[#706B63]'
                  }`}
                >After</button>
              </div>
            </div>

            {/* Content area */}
            <div className="px-4 sm:px-5 py-5" style={{ animation: 'fadeUp .4s ease' }}>
              <div className="flex gap-5">

                {/* Left: text content */}
                <div className="flex-1 min-w-0">

                  {/* Page title */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-2 h-2 rounded-full flex-shrink-0 transition-all duration-300" style={{ background: city.dot }} />
                    <span className="text-sm font-bold text-[#1A1A19] truncate">
                      Best Dentists in {city.city}, {city.state}
                    </span>
                    {isAfter && (
                      <span className="text-[10px] font-mono text-[#A39E95] ml-auto hidden sm:inline">
                        {city.words.toLocaleString()} words · {Math.round(city.words / 250)} min
                      </span>
                    )}
                  </div>

                  {/* Content card */}
                  <div
                    className={`relative rounded-xl border-2 p-4 sm:p-5 min-h-[150px] transition-all duration-500 ${
                      isBefore ? 'border-[#991B1B]/20 bg-[#FDF2F0]/30' : 'border-[#166534]/20 bg-[#F0FDF4]/30'
                    }`}
                    style={{
                      opacity: transitioning ? 0 : 1,
                      transform: transitioning ? 'scale(0.98)' : 'scale(1)',
                      transition: 'opacity 0.2s, transform 0.2s, border-color 0.5s, background-color 0.5s',
                    }}
                  >
                    {/* Mode badge */}
                    <div className={`absolute -top-2.5 left-3 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border transition-all duration-300 ${
                      isBefore
                        ? 'bg-[#FDF2F0] text-[#991B1B] border-[#E8B4A8]'
                        : 'bg-[#F0FDF4] text-[#166534] border-[#BBF7D0]'
                    }`}>
                      {isBefore ? '⚠ Generic Output' : '✦ Seoscribed'}
                    </div>

                    {/* Text */}
                    <div className="mt-1.5 text-[13px] sm:text-[14px] leading-[1.85]">
                      {isBefore ? (
                        <BeforeText activeCityName={city.city} isVisible={isVisible} key="before-text" />
                      ) : (
                        <span className="text-[#1A1A19]">
                          <StreamText segments={city.after} speed={6} key={`after-${cityIdx}`} />
                        </span>
                      )}
                    </div>

                    {/* Bottom meta */}
                    <div className="flex items-center justify-between mt-4 pt-2.5 border-t border-[#E0DBD2]/40 text-[10px]">
                      {isBefore ? (
                        <div className="flex items-center gap-1.5 text-[#991B1B]">
                          <I.copy className="w-3 h-3" />
                          <span className="font-semibold">Same on all 500 pages</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-3 font-mono text-[#A39E95]">
                          <span className="flex items-center gap-1">
                            <I.spark className="w-3 h-3 text-[#C2410C]" />
                            {city.after.filter(s => s.h).length} local references
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Manual toggle strip */}
                  {manualMode && (
                    <div className="mt-3 flex items-center gap-4">
                      {isAfter && (
                        <button onClick={toggleToBefore} className="flex items-center gap-1.5 text-[11px] text-[#A39E95] hover:text-[#706B63] font-medium transition-colors">
                          <I.swap className="w-3 h-3" />
                          Show generic version
                        </button>
                      )}
                      {isBefore && (
                        <button onClick={toggleToAfter} className="flex items-center gap-1.5 text-[11px] text-[#C2410C] hover:text-[#9A3412] font-bold transition-colors group">
                          <I.spark className="w-3.5 h-3.5" />
                          See Seoscribed output
                          <I.arrow className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* Right sidebar: gauge + dots */}
                <div className="hidden sm:flex flex-col items-center gap-5 pt-8 shrink-0 w-[120px]">
                  <ScoreGauge score={city.unique} isBefore={isBefore} />
                  <DotGrid isBefore={isBefore} />
                </div>
              </div>

              {/* Mobile: gauge + dots */}
              <div className="flex sm:hidden items-center justify-around mt-4 pt-4 border-t border-[#E0DBD2]/50">
                <ScoreGauge score={city.unique} isBefore={isBefore} />
                <DotGrid isBefore={isBefore} />
              </div>
            </div>
          </>
        )}
      </div>

      {/* Hint text */}
      <p className="text-center mt-4 text-[11px] text-[#A39E95] flex items-center justify-center gap-1.5 font-medium">
        {hint.icon}
        {hint.text}
      </p>
    </div>
  );
}
