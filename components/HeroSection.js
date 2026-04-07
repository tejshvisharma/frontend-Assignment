"use client";

/**
 * HeroSection.js
 * ══════════════
 * Scroll‑driven hero section for ITZFIZZ.
 *
 * WHAT THIS FILE DOES
 * ───────────────────
 * 1. Renders the hero layout (headline, road strip, stat cards).
 * 2. Runs an INTRO timeline on page load (headlines fade + letters stagger in).
 * 3. Runs a SCROLL timeline tied to the user's scroll position via GSAP
 *    ScrollTrigger (car moves, trail grows, stat cards appear).
 *
 * HOW TO READ THIS FILE
 * ─────────────────────
 * Read top-to-bottom. JSX first, then the two useEffect blocks:
 *   • introAnimation() – fires once on mount
 *   • scrollAnimation() – wired to ScrollTrigger
 */

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// ── Register the plugin once (must happen before any ScrollTrigger usage) ──
gsap.registerPlugin(ScrollTrigger);

// ── STAT CARD DATA ─────────────────────────────────────────────────────────
// Keeping data separate from JSX makes it easy to add / change metrics later.
const STATS = [
  {
    id: "stat1",
    value: "75%",
    label: "Faster Workflows",
    bg: "var(--color-card-1)",
    color: "#111",
    position: "top-[8%] right-[32%]",
  },
  {
    id: "stat2",
    value: "90%",
    label: "Task Completion",
    bg: "var(--color-card-2)",
    color: "#111",
    position: "bottom-[8%] right-[38%]",
  },
  {
    id: "stat3",
    value: "40%",
    label: "More Productivity",
    bg: "var(--color-card-3)",
    color: "#111",
    position: "top-[8%] right-[10%]",
  },
  {
    id: "stat4",
    value: "58%",
    label: "Pick‑up Point Use",
    bg: "var(--color-card-4)",
    color: "#111",
    position: "bottom-[8%] right-[12%]",
  },
];

// ── HEADLINE LETTERS ───────────────────────────────────────────────────────
// The headline is split into individual <span>s so GSAP can stagger each
// letter during the scroll animation (car "reveals" each letter as it passes).
const HEADLINE = "WHY HIRE ME ?".split("");

export default function HeroSection() {
  // ── REFS ─────────────────────────────────────────────────────────────────
  // We use refs instead of getElementById so this component is self-contained
  // and works correctly even if Next.js renders multiple instances.
  const sectionRef = useRef(null); // The outer scroll section (200 vh)
  const trackRef = useRef(null); // The sticky viewport container
  const roadRef = useRef(null); // The dark horizontal road strip
  const carRef = useRef(null); // The car image
  const trailRef = useRef(null); // The lime-green trail bar
  const lettersRef = useRef([]); // Array of headline letter spans
  const statCardsRef = useRef([]); // Array of stat card divs

  // ── EFFECT: INTRO ANIMATION ───────────────────────────────────────────────
  useEffect(() => {
    /**
     * introAnimation()
     * ────────────────
     * Runs ONCE when the component mounts (empty dependency array []).
     * Uses gsap.fromTo() – the animation moves FROM initial state TO final.
     *
     * Two sub-timelines kept separate so they're easy to tweak independently.
     */
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "expo.out" } });

      // 1️⃣  Road strip slides up from below the viewport
      tl.fromTo(
        roadRef.current,
        { yPercent: 100, opacity: 0 }, // start: off-screen below
        { yPercent: 0, opacity: 1, duration: 1.0 }, // end: in place
      );

      // 2️⃣  Keep headline hidden initially.
      //     Scroll-based logic reveals each letter only when the car reaches it.
      tl.set(lettersRef.current, { opacity: 0 }, "-=0.2");

      // 3️⃣  Stat cards gently fade in to show layout (they'll re-animate on scroll)
      tl.fromTo(
        statCardsRef.current,
        { opacity: 0, y: 20 },
        {
          opacity: 0, // keep invisible; ScrollTrigger will reveal them
          y: 0,
          duration: 0.4,
          stagger: 0.1,
        },
        "-=0.3",
      );
    }, sectionRef); // scope the context so cleanup works correctly

    // Cleanup: kills GSAP animations when component unmounts (prevents memory leaks)
    return () => ctx.revert();
  }, []);

  // ── EFFECT: SCROLL ANIMATION ──────────────────────────────────────────────
  useEffect(() => {
    /**
     * scrollAnimation()
     * ─────────────────
     * Wires everything to the page's scroll position using ScrollTrigger.
     *
     * KEY SCROLLTRIGGER CONCEPTS:
     *
     *   trigger  – the element whose scroll position drives the animation
     *   start    – when to begin (e.g., "top top" = when trigger's top hits viewport top)
     *   end      – when to finish
     *   scrub    – ties animation progress to scroll progress instead of time
     *              scrub: true  → perfectly tied (1:1)
     *              scrub: 1     → 1-second lag/smoothing (feels more fluid)
     *              scrub: 1.5   → smoother/heavier feel
     *   pin      – pins an element in place while the scroll progresses
     *
     * WHY pin: ".track"?
     *   The section is 200vh tall but we only have 100vh of visual space.
     *   By pinning .track (the sticky viewport), we get a "scrolling movie":
     *   the user scrolls the page but the visual content stays in place while
     *   the animations play out. After 200vh of scroll the pin releases.
     */

    const getCarMetrics = () => {
      const roadRect = roadRef.current?.getBoundingClientRect();
      const carRect = carRef.current?.getBoundingClientRect();
      const currentRoadWidth = roadRect?.width ?? window.innerWidth;
      const currentCarWidth =
        carRect?.width ?? Math.min(240, currentRoadWidth * 0.24);

      // Keep travel non-negative in case the car gets very large on small screens.
      const endX = Math.max(0, currentRoadWidth - currentCarWidth - 12);

      return { currentCarWidth, endX };
    };

    let letterRelativeCenters = [];

    const hideAllLetters = () => {
      lettersRef.current.forEach((letter) => {
        if (!letter) return;
        letter.style.opacity = "0";
      });
    };

    const cacheLetterPositions = () => {
      const roadLeft = roadRef.current?.getBoundingClientRect().left ?? 0;

      letterRelativeCenters = lettersRef.current.map((letter) => {
        if (!letter) return Number.POSITIVE_INFINITY;
        const rect = letter.getBoundingClientRect();
        const letterCentre = rect.left + rect.width / 2;
        return letterCentre - roadLeft;
      });
    };

    const revealLettersByCarPosition = () => {
      const { currentCarWidth } = getCarMetrics();
      const carX =
        (Number(gsap.getProperty(carRef.current, "x")) || 0) +
        currentCarWidth / 2;

      lettersRef.current.forEach((letter, i) => {
        if (!letter) return;
        const letterRelX = letterRelativeCenters[i] ?? Number.POSITIVE_INFINITY;
        letter.style.opacity = carX >= letterRelX ? "1" : "0";
      });
    };

    const ctx = gsap.context(() => {
      // ── MASTER SCROLL TIMELINE ───────────────────────────────────────────
      // All scroll-tied animations share one ScrollTrigger so they stay in sync.
      const scrollTL = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current, // which element drives the scrub?
          start: "top top", // when section top hits viewport top → start
          end: "bottom top", // when section bottom hits viewport top → end
          scrub: 1.5, // smooth 1.5 s lag – car glides, not snaps
          pin: trackRef.current, // keep the visual sticky while we scroll
          anticipatePin: 1, // prevents pin jump on fast scroll
          // markers: true,              // ← uncomment to debug trigger positions
        },
      });

      // ── Car movement ─────────────────────────────────────────────────────
      // x uses CSS transform:translateX → compositor thread, no layout cost.
      // ease: "none" inside a scrub timeline means GSAP maps scroll progress
      // linearly to animation progress. The scrub: 1.5 handles the smoothing.
      scrollTL.to(
        carRef.current,
        {
          x: () => getCarMetrics().endX,
          ease: "none", // ← linear mapping of scroll → position
          duration: 1, // duration is relative within the timeline, not seconds
        },
        0, // start at timeline position 0 (immediately)
      );

      // ── Trail growth ──────────────────────────────────────────────────────
      // The lime trail expands to match the car's midpoint, giving a "painted
      // road" effect. We animate width via CSS transform scaleX for performance
      // but here width is simpler because the trail always starts at left: 0.
      scrollTL.to(
        trailRef.current,
        {
          width: () => {
            const { endX, currentCarWidth } = getCarMetrics();
            return endX + currentCarWidth / 2;
          }, // trail tip = car centre
          ease: "none",
          duration: 1,
        },
        0, // same start position in timeline as the car
      );

      // ── Headline letter reveal ────────────────────────────────────────────
      // Each letter becomes visible as the car passes it. We can't know the
      // exact pixel offsets at animation-definition time, so we use an onUpdate
      // callback that runs every frame during the scroll.
      // (This is intentionally kept simple – no heavy DOM traversal needed because
      //  we only compare a few numbers, not query the DOM.)
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: "bottom top",
        scrub: 1.5,
        invalidateOnRefresh: true,
        onRefreshInit: cacheLetterPositions,
        onRefresh: () => {
          cacheLetterPositions();
          revealLettersByCarPosition();
        },
        onUpdate: (self) => {
          // Force a clean reset near scroll start to avoid reverse-scroll ghosting.
          if (self.progress <= 0.001) {
            hideAllLetters();
            return;
          }

          revealLettersByCarPosition();
        },
        onLeaveBack: hideAllLetters,
      });

      hideAllLetters();
      cacheLetterPositions();

      // ── Stat card appearances ─────────────────────────────────────────────
      // Each card fades in independently at different scroll offsets.
      // We DON'T put these in the master timeline so their trigger points
      // can be tuned separately without affecting car movement.
      const cardOffsets = [0.3, 0.45, 0.6, 0.75]; // fraction of scroll (0-1)

      statCardsRef.current.forEach((card, i) => {
        if (!card) return;

        gsap.fromTo(
          card,
          { opacity: 0, y: 30, scale: 0.95 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              // Convert fractional offset to pixel offset within the section
              start: () =>
                `top+=${cardOffsets[i] * window.innerHeight * 2} top`,
              end: () =>
                `top+=${(cardOffsets[i] + 0.1) * window.innerHeight * 2} top`,
              scrub: 1,
            },
          },
        );
      });
    }, sectionRef);

    return () => ctx.revert(); // clean up all ScrollTrigger instances on unmount
  }, []);

  // ── JSX ──────────────────────────────────────────────────────────────────
  return (
    /**
     * OUTER SECTION – 200vh tall
     * This extra height is the "scroll budget". The user scrolls 200vh worth
     * of distance but only ever sees 100vh because .track is pinned.
     * That scroll distance is what drives the animations.
     */
    <section
      ref={sectionRef}
      className="relative w-full"
      style={{ height: "200vh" }}
    >
      {/* ── STICKY TRACK (pinned by GSAP) ── */}
      <div
        ref={trackRef}
        className="sticky top-0 w-full overflow-hidden"
        style={{ height: "100vh", background: "#0a0a0a" }}
      >
        {/* ── BACKGROUND GRID (decorative, pure CSS) ── */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
          }}
        />

        {/* ── HEADLINE ABOVE THE ROAD ── */}
        <div
          className="absolute top-[18%] left-0 w-full flex justify-center items-center"
          style={{ perspective: "800px", zIndex: 4 }} // keep headline below enlarged car
        >
          <h1
            className="flex gap-[0.08em] flex-wrap justify-center select-none"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2.8rem, 7vw, 7.2rem)",
              letterSpacing: "0.08em",
              fontWeight: 800,
              lineHeight: 0.95,
              textTransform: "uppercase",
              color: "#f8fbff",
              textShadow: "0 10px 30px rgba(83, 144, 255, 0.32)",
            }}
          >
            {HEADLINE.map((char, i) => (
              <span
                key={i}
                ref={(el) => (lettersRef.current[i] = el)}
                style={{
                  display: "inline-block",
                  opacity: 0, // hidden by default; intro & scroll reveal
                  whiteSpace: "pre", // preserve spaces in the array
                  willChange: "opacity, transform", // hint to browser compositor
                }}
              >
                {char === " " ? "\u00A0" : char}
              </span>
            ))}
          </h1>
        </div>

        {/* ── ROAD STRIP ── */}
        <div
          ref={roadRef}
          className="absolute"
          style={{
            top: "50%",
            transform: "translateY(-50%)",
            width: "100vw",
            height: "clamp(140px, 18vh, 220px)",
            background: "var(--color-road)",
            overflow: "visible",
          }}
        >
          {/* Dashed centre line (pure CSS, no extra elements) */}
          <div
            aria-hidden
            className="absolute top-1/2 left-0 w-full -translate-y-1/2"
            style={{
              height: "3px",
              background:
                "repeating-linear-gradient(90deg, #333 0 40px, transparent 40px 80px)",
            }}
          />

          {/* Green trail that grows behind the car */}
          <div
            ref={trailRef}
            className="absolute top-0 left-0 h-full"
            style={{
              width: 0,
              background:
                "linear-gradient(90deg, var(--color-trail) 0%, #a3f000 100%)",
              zIndex: 1,
              opacity: 0.85,
            }}
          />

          {/* ── CAR ── */}
          {/*
           * Why transform instead of left/top for movement?
           * ─────────────────────────────────────────────────
           * Animating `left` triggers layout recalculation on every frame (expensive).
           * Animating `transform: translateX` runs on the GPU compositor thread
           * without touching the layout, keeping animations buttery-smooth at 60fps.
           * GSAP's `x` property maps directly to translateX.
           */}
          <img
            ref={carRef}
            src="/car.png" // drop your car PNG into /public/car.png
            alt="Car"
            className="absolute top-1/2 left-0"
            style={{
              transform: "translateY(-68%)",
              height: "250%",
              width: "auto",
              zIndex: 10,
              willChange: "transform", // tell browser this element will be transformed
              filter: "drop-shadow(0 8px 24px rgba(0,0,0,0.7))",
            }}
          />
        </div>

        {/* ── STAT CARDS ── */}
        {/*
         * Cards are absolutely positioned inside the sticky track, not the road.
         * They start invisible (opacity: 0) and ScrollTrigger fades them in.
         */}
        {STATS.map((stat, i) => (
          <div
            key={stat.id}
            ref={(el) => (statCardsRef.current[i] = el)}
            className={`absolute ${stat.position}`}
            style={{
              opacity: 0, // hidden; revealed by scroll animation
              background: stat.bg,
              color: stat.color,
              borderRadius: "14px",
              padding: "1.4rem 1.8rem",
              minWidth: "180px",
              boxShadow: "0 12px 40px rgba(0,0,0,0.4)",
              backdropFilter: "blur(4px)",
              willChange: "opacity, transform",
              zIndex: 20,
            }}
          >
            <span
              className="block font-bold"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(2.5rem, 5vw, 3.8rem)",
                lineHeight: 1,
              }}
            >
              {stat.value}
            </span>
            <span
              className="block mt-1 font-medium text-sm tracking-wide"
              style={{ fontFamily: "var(--font-body)", opacity: 0.75 }}
            >
              {stat.label}
            </span>
          </div>
        ))}

        {/* ── SCROLL CUE ── */}
        <div
          className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          style={{ opacity: 0.35, zIndex: 30 }}
        >
          <span
            className="text-xs tracking-widest uppercase text-white"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Scroll
          </span>
          <svg width="16" height="24" viewBox="0 0 16 24" fill="none">
            <rect
              x="1"
              y="1"
              width="14"
              height="22"
              rx="7"
              stroke="white"
              strokeWidth="1.5"
            />
            <circle cx="8" cy="7" r="2.5" fill="white">
              <animate
                attributeName="cy"
                values="7;15;7"
                dur="1.8s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                values="1;0.2;1"
                dur="1.8s"
                repeatCount="indefinite"
              />
            </circle>
          </svg>
        </div>
      </div>
    </section>
  );
}
