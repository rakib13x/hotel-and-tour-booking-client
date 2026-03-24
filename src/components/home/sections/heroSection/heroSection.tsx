"use client";

import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRightLeft, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import SearchForm from "./SearchForm";

interface Slide {
  id: number;
  image: string;
  label: string;
  title: string;
  subtitle: string;
  accent: string;
}

interface HeroSectionProps {
  className?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Static slide data
// To swap images: place files in /public/hero/ and set image: "/hero/file.jpg"
// ─────────────────────────────────────────────────────────────────────────────

const SLIDES: Slide[] = [
  {
    id: 0,
    image:
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1920&q=100&auto=format&fit=crop",
    label: "Mountains",
    title: "Discover the\nWorld's Wonders",
    subtitle:
      "Handcrafted holiday packages, sightseeing tours, and hotel stays — curated for every kind of explorer.",
    accent: "#3b82f6",
  },
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1920&q=100&auto=format&fit=crop",
    label: "Travel",
    title: "Fly Further,\nDream Bigger",
    subtitle:
      "Compare destinations, book transfers, and set off on your next adventure — all in one seamless experience.",
    accent: "#0ea5e9",
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&q=100&auto=format&fit=crop",
    label: "Beach",
    title: "Escape to\nParadise Shores",
    subtitle:
      "Pristine beaches, crystal waters, and unforgettable sunsets. Your perfect tropical retreat awaits.",
    accent: "#06b6d4",
  },
];

const SLIDE_COUNT = SLIDES.length;
const AUTO_PLAY_INTERVAL = 6000;

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

export default function HeroSection({ className = "" }: HeroSectionProps) {
  const [current, setCurrent] = useState<number>(0);

  // Auto-advance
  useEffect(() => {
    const id: ReturnType<typeof setInterval> = setInterval(() => {
      setCurrent((c: number) => (c + 1) % SLIDE_COUNT);
    }, AUTO_PLAY_INTERVAL);
    return (): void => clearInterval(id);
  }, []);

  const goTo = (index: number): void => setCurrent(index);
  const next = (): void => setCurrent((c: number) => (c + 1) % SLIDE_COUNT);
  const back = (): void =>
    setCurrent((c: number) => (c - 1 + SLIDE_COUNT) % SLIDE_COUNT);

  // Non-null assertion safe here — current is always a valid SLIDES index
  const slide: Slide = SLIDES[current] as Slide;

  return (
    <section
      className={`relative flex min-h-175 items-center justify-center overflow-hidden lg:h-[88vh] ${className}`}
    >
      {/* ── BACKGROUND IMAGE LAYER ─────────────────────────────────────────
          Pure CSS opacity crossfade — zero transforms on the image element.
          No GPU compositing / resampling = pixel-perfect sharp images.
      ────────────────────────────────────────────────────────────────────── */}
      <div className="absolute inset-0 z-0 bg-slate-900">
        {SLIDES.map((s: Slide, i: number) => (
          <div
            key={s.id}
            className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
            style={{ opacity: i === current ? 1 : 0 }}
            aria-hidden={i !== current}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={s.image}
              alt={s.label}
              loading={i === 0 ? "eager" : "lazy"}
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-linear-to-r from-black/65 via-black/35 to-black/10" />
            <div className="absolute inset-0 bg-linear-to-t from-black/55 via-transparent to-transparent" />
          </div>
        ))}
      </div>

      {/* ── PREV / NEXT ────────────────────────────────────────────────────── */}
      <button
        type="button"
        onClick={back}
        aria-label="Previous slide"
        className="absolute top-1/2 left-4 z-30 hidden -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/25 p-3 text-white backdrop-blur-md transition-all hover:bg-white/20 md:flex"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        type="button"
        onClick={next}
        aria-label="Next slide"
        className="absolute top-1/2 right-4 z-30 hidden -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/25 p-3 text-white backdrop-blur-md transition-all hover:bg-white/20 md:flex"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      {/* ── SLIDE LABEL TABS ───────────────────────────────────────────────── */}
      <div className="absolute top-6 right-6 z-30 hidden items-center gap-2 md:flex">
        {SLIDES.map((s: Slide, i: number) => (
          <button
            key={s.id}
            type="button"
            onClick={() => goTo(i)}
            className={`rounded-full px-3 py-1.5 text-xs font-bold tracking-widest uppercase transition-all duration-300 ${
              i === current
                ? "bg-white text-slate-900 shadow-lg"
                : "border border-white/30 text-white/60 hover:border-white/60 hover:text-white"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* ── DOTS ───────────────────────────────────────────────────────────── */}
      <div className="absolute bottom-6 left-1/2 z-30 flex -translate-x-1/2 items-center gap-2">
        {SLIDES.map((s: Slide, i: number) => (
          <button
            key={s.id}
            type="button"
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
            className="h-1.5 rounded-full transition-all duration-500"
            style={{
              width: i === current ? 32 : 8,
              backgroundColor:
                i === current ? slide.accent : "rgba(255,255,255,0.35)",
            }}
          />
        ))}
      </div>

      {/* ── SLIDE COUNTER ──────────────────────────────────────────────────── */}
      <div className="absolute right-6 bottom-6 z-30 hidden font-mono text-xs tracking-widest text-white/40 md:block">
        {String(current + 1).padStart(2, "0")}&nbsp;/&nbsp;
        {String(SLIDES.length).padStart(2, "0")}
      </div>

      {/* ── CONTENT ────────────────────────────────────────────────────────── */}
      <div className="relative z-20 mx-auto w-full max-w-7xl px-4 py-14 md:px-8 lg:py-0">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
          {/* Text — AnimatePresence / motion only on text, never on images */}
          <div className="text-center lg:text-left">
            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                {/* Eyebrow pill */}
                <p
                  className="mb-4 inline-block rounded-full px-4 py-1.5 text-xs font-bold tracking-[0.22em] uppercase"
                  style={{
                    background: `${slide.accent}22`,
                    color: slide.accent,
                    border: `1px solid ${slide.accent}55`,
                  }}
                >
                  Travel made simple
                </p>

                {/* Headline */}
                <h1
                  className="mb-5 text-4xl leading-[1.07] font-black tracking-tight whitespace-pre-line text-white drop-shadow-xl sm:text-5xl md:text-6xl lg:text-7xl"
                  style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}
                >
                  {slide.title}
                </h1>

                {/* Subtitle */}
                <p className="mx-auto mb-9 max-w-xl text-base leading-relaxed text-white/80 sm:text-lg lg:mx-0">
                  {slide.subtitle}
                </p>

                {/* CTAs */}
                <div className="flex flex-col justify-center gap-3 sm:flex-row lg:justify-start">
                  <Link href="/package">
                    <Button
                      size="lg"
                      className="w-full rounded-xl px-8 py-6 text-base font-bold text-white shadow-2xl transition-all hover:scale-[1.03] active:scale-95 sm:w-auto"
                      style={{ backgroundColor: slide.accent }}
                    >
                      Explore Packages
                      <ArrowRightLeft className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/about-us">
                    <Button
                      size="lg"
                      variant="outline"
                      className="w-full rounded-xl border-white/30 bg-white/10 px-8 py-6 text-base font-semibold text-white backdrop-blur-md transition-all hover:bg-white/20 sm:w-auto"
                    >
                      Learn More
                    </Button>
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Search form */}
          <div className="flex justify-center lg:justify-end">
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="w-full max-w-lg"
            >
              <SearchForm />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
