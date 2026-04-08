"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

const STATS = [
  {
    id: "stat1",
    value: "UI/FE",
    label: "CRAFTING CLEAN, USABLE INTERFACES",
    bg: "#9bf66f",
    color: "#09111f",
    position: "top-[8%] right-[32%]",
  },
  {
    id: "stat2",
    value: "TOOLS",
    label: "REACT NEXT TAILWIND GSAP",
    bg: "#5ad6ff",
    color: "#09111f",
    position: "bottom-[8%] right-[38%]",
  },
  {
    id: "stat3",
    value: "10+",
    label: "REAL WORLD UI FLOWS SHIPPED",
    bg: "#ff9a53",
    color: "#09111f",
    position: "top-[8%] right-[10%]",
  },
];

const HEADLINE = "WHY HIRE ME ?".split("");

export default function HeroSection() {
  const openResume = () => {
    window.open(
      "https://mahatejshvi.tiiny.site/",
      "_blank",
      "noopener,noreferrer",
    );
  };

  const openPortfolio = () => {
    window.open(
      "https://mahatejshvi-vareny-swami-portfolio.vercel.app/",
      "_blank",
      "noopener,noreferrer",
    );
  };

  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const roadRef = useRef(null);
  const carRef = useRef(null);
  const trailRef = useRef(null);
  const hireBtnRef = useRef(null);
  const portfolioBtnRef = useRef(null);
  const lettersRef = useRef([]);
  const statCardsRef = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const isAtTopOnLoad =
        typeof window === "undefined" ? true : window.scrollY <= 4;

      // Keep headline letters hidden from the first animation frame.
      gsap.set(lettersRef.current, { opacity: 0 });

      if (!isAtTopOnLoad) {
        // Avoid intro flicker when browser restores a scrolled position on refresh.
        gsap.set(roadRef.current, { yPercent: 0, opacity: 1 });
        return;
      }

      const tl = gsap.timeline({ defaults: { ease: "expo.out" } });

      tl.fromTo(
        roadRef.current,
        { yPercent: 100, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 1.0 },
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const REVEAL_START_PROGRESS = 0.015;

    const getCarMetrics = () => {
      const roadRect = roadRef.current?.getBoundingClientRect();
      const carRect = carRef.current?.getBoundingClientRect();
      const currentRoadWidth = roadRect?.width ?? window.innerWidth;
      const currentCarWidth =
        carRect?.width ?? Math.min(520, currentRoadWidth * 0.34);

      const endX = Math.max(0, currentRoadWidth - currentCarWidth - 16);

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
      hideAllLetters();
      cacheLetterPositions();

      const scrollTL = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1.5,
          pin: trackRef.current,
          anticipatePin: 1,
        },
      });

      scrollTL.to(
        carRef.current,
        {
          x: () => getCarMetrics().endX,
          ease: "none",
          duration: 1,
        },
        0,
      );

      scrollTL.to(
        trailRef.current,
        {
          width: () => {
            const { endX, currentCarWidth } = getCarMetrics();
            return endX + currentCarWidth / 2;
          },
          ease: "none",
          duration: 1,
        },
        0,
      );

      scrollTL.fromTo(
        hireBtnRef.current,
        { opacity: 0, y: 24, scale: 0.96 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          ease: "none",
          duration: 0.28,
        },
        0.18,
      );

      scrollTL.fromTo(
        portfolioBtnRef.current,
        { opacity: 0, y: 24, scale: 0.96 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          ease: "none",
          duration: 0.28,
        },
        0.34,
      );

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: "bottom top",
        scrub: 1.5,
        invalidateOnRefresh: true,
        onRefreshInit: cacheLetterPositions,
        onRefresh: (self) => {
          cacheLetterPositions();

          if (self.progress <= REVEAL_START_PROGRESS) {
            hideAllLetters();
            return;
          }

          revealLettersByCarPosition();
        },
        onUpdate: (self) => {
          if (self.progress <= REVEAL_START_PROGRESS) {
            hideAllLetters();
            return;
          }

          revealLettersByCarPosition();
        },
        onLeaveBack: hideAllLetters,
      });

      const cardOffsets = [0.3, 0.45, 0.6, 0.75];
      const cardStartY = [30, 30, 30, 0];

      statCardsRef.current.forEach((card, i) => {
        if (!card) return;

        gsap.fromTo(
          card,
          { opacity: 0, y: cardStartY[i], scale: 0.95 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            immediateRender: false,
            ease: "power3.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: () =>
                `top+=${cardOffsets[i] * window.innerHeight * 2} top`,
              end: () =>
                `top+=${(cardOffsets[i] + 0.1) * window.innerHeight * 2} top`,
              scrub: 1,
              invalidateOnRefresh: true,
            },
          },
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full"
      style={{ height: "200vh" }}
    >
      <div
        ref={trackRef}
        className="sticky top-0 w-full overflow-hidden"
        style={{
          height: "100vh",
          background: `
            radial-gradient(circle at 12% 18%, rgba(118, 255, 99, 0.24) 0%, rgba(118, 255, 99, 0) 36%),
            radial-gradient(circle at 82% 18%, rgba(81, 222, 255, 0.27) 0%, rgba(81, 222, 255, 0) 40%),
            radial-gradient(circle at 18% 82%, rgba(255, 147, 72, 0.24) 0%, rgba(255, 147, 72, 0) 34%),
            radial-gradient(circle at 82% 80%, rgba(159, 199, 255, 0.2) 0%, rgba(159, 199, 255, 0) 36%),
            linear-gradient(145deg, #060a18 0%, #121c3b 48%, #131d36 100%)
          `,
        }}
      >
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(rgba(118,255,99,0.08) 1px, transparent 1px),
              linear-gradient(90deg, rgba(81,222,255,0.08) 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
            opacity: 0.62,
          }}
        />

        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `
              radial-gradient(circle at 8% 68%, rgba(255, 147, 72, 0.38) 0%, rgba(255, 147, 72, 0) 30%),
              radial-gradient(circle at 90% 70%, rgba(159, 199, 255, 0.3) 0%, rgba(159, 199, 255, 0) 30%),
              radial-gradient(circle at 50% 12%, rgba(81, 222, 255, 0.28) 0%, rgba(81, 222, 255, 0) 32%),
              radial-gradient(circle at 50% 88%, rgba(118, 255, 99, 0.24) 0%, rgba(118, 255, 99, 0) 30%)
            `,
            mixBlendMode: "soft-light",
            filter: "blur(12px)",
            opacity: 0.76,
          }}
        />

        <div
          className="absolute top-4 left-4 sm:left-8 md:left-[7%] flex items-center gap-3"
          style={{ zIndex: 28 }}
          aria-label="Brand logo"
        >
          <div
            style={{
              width: "2.2rem",
              height: "2.2rem",
              borderRadius: "10px",
              border: "1px solid rgba(145, 227, 255, 0.55)",
              background:
                "linear-gradient(145deg, rgba(90,214,255,0.26) 0%, rgba(155,246,111,0.18) 100%)",
              boxShadow:
                "0 8px 18px rgba(8,18,35,0.42), inset 0 1px 0 rgba(255,255,255,0.28)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "1.1rem",
                lineHeight: 1,
                letterSpacing: "0.04em",
                color: "#dff5ff",
                textShadow: "0 0 10px rgba(90,214,255,0.35)",
              }}
            >
              MV
            </span>
          </div>

          <div className="leading-tight">
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.82rem",
                textTransform: "uppercase",
                letterSpacing: "0.12em",
                color: "#e8f6ff",
                fontWeight: 600,
              }}
            >
              Mahatejshvi Vareny Swami
            </p>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.64rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "rgba(214, 238, 255, 0.76)",
              }}
            >
              Frontend Developer
            </p>
          </div>
        </div>

        <div
          className="absolute top-[18%] left-0 w-full flex justify-center items-center"
          style={{ perspective: "800px", zIndex: 4 }}
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
              color: "#f7fbff",
              textShadow:
                "0 8px 26px rgba(56, 234, 255, 0.3), 0 0 20px rgba(255, 154, 83, 0.22)",
            }}
          >
            {HEADLINE.map((char, i) => (
              <span
                key={i}
                ref={(el) => (lettersRef.current[i] = el)}
                style={{
                  display: "inline-block",
                  opacity: 0,
                  whiteSpace: "pre",
                  willChange: "opacity, transform",
                }}
              >
                {char === " " ? "\u00A0" : char}
              </span>
            ))}
          </h1>
        </div>

        <button
          ref={hireBtnRef}
          type="button"
          onClick={openResume}
          className="absolute top-[13%] left-4 sm:left-8 md:left-[7%]"
          style={{
            opacity: 0,
            zIndex: 26,
            padding: "0.74rem 1.3rem",
            borderRadius: "999px",
            border: "1px solid rgba(255,255,255,0.42)",
            background:
              "linear-gradient(135deg, rgba(118,255,99,0.95) 0%, rgba(81,222,255,0.9) 100%)",
            color: "#061225",
            fontFamily: "var(--font-body)",
            fontWeight: 700,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            fontSize: "0.76rem",
            boxShadow:
              "0 14px 30px rgba(10,16,34,0.44), 0 0 20px rgba(81,222,255,0.35), inset 0 1px 0 rgba(255,255,255,0.45)",
            backdropFilter: "blur(6px)",
            WebkitBackdropFilter: "blur(6px)",
            cursor: "pointer",
            willChange: "opacity, transform",
          }}
          title="See my resume"
          aria-label="See my resume"
        >
          See My Resume
        </button>

        <button
          ref={portfolioBtnRef}
          type="button"
          onClick={openPortfolio}
          className="absolute bottom-[18%] right-4 sm:right-8 md:right-[8%]"
          style={{
            opacity: 0,
            zIndex: 26,
            padding: "0.74rem 1.3rem",
            borderRadius: "999px",
            border: "1px solid rgba(255,255,255,0.46)",
            background:
              "linear-gradient(135deg, rgba(90,214,255,0.95) 0%, rgba(255,154,83,0.9) 100%)",
            color: "#081a2f",
            fontFamily: "var(--font-body)",
            fontWeight: 700,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            fontSize: "0.76rem",
            boxShadow:
              "0 14px 30px rgba(10,16,34,0.44), 0 0 20px rgba(90,214,255,0.3), inset 0 1px 0 rgba(255,255,255,0.35)",
            backdropFilter: "blur(6px)",
            WebkitBackdropFilter: "blur(6px)",
            cursor: "pointer",
            willChange: "opacity, transform",
          }}
          title="See my portfolio"
          aria-label="See my portfolio"
        >
          See My Portfolio
        </button>

        <div
          ref={roadRef}
          className="absolute"
          style={{
            top: "50%",
            transform: "translateY(-50%)",
            width: "100vw",
            height: "clamp(140px, 18vh, 220px)",
            background:
              "linear-gradient(180deg, #242648 0%, #191b35 46%, #241635 100%)",
            borderTop: "1px solid rgba(81, 222, 255, 0.34)",
            borderBottom: "1px solid rgba(255, 147, 72, 0.3)",
            boxShadow:
              "inset 0 20px 38px rgba(255,255,255,0.05), inset 0 -24px 44px rgba(0,0,0,0.3)",
            overflow: "visible",
          }}
        >
          <div
            aria-hidden
            className="absolute top-1/2 left-0 w-full -translate-y-1/2"
            style={{
              height: "3px",
              background:
                "repeating-linear-gradient(90deg, rgba(214,252,255,0.95) 0 40px, transparent 40px 78px)",
              filter: "drop-shadow(0 0 10px rgba(81, 222, 255, 0.4))",
            }}
          />

          <div
            ref={trailRef}
            className="absolute top-0 left-0 h-full"
            style={{
              width: 0,
              background:
                "linear-gradient(90deg, #9bf66f 0%, #5ad6ff 50%, #ff9a53 100%)",
              zIndex: 1,
              opacity: 0.9,
              boxShadow: "0 0 36px rgba(83, 241, 255, 0.42)",
            }}
          />

          {/* GSAP directly animates this element, so using img keeps ref behavior predictable. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <div
            ref={carRef}
            className="absolute top-1/2 left-0"
            style={{
              transform: "translateY(-58%)",
              width: "clamp(260px, 34vw, 520px)",
              zIndex: 10,
              willChange: "transform",
              filter:
                "drop-shadow(0 10px 28px rgba(0,0,0,0.58)) drop-shadow(0 0 20px rgba(81,222,255,0.18))",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/car.png"
              alt="Car"
              onError={(e) => {
                e.currentTarget.src = "/car.svg";
              }}
              style={{ width: "100%", height: "auto", display: "block" }}
            />
          </div>
        </div>

        {STATS.map((stat, i) => (
          <div
            key={stat.id}
            ref={(el) => (statCardsRef.current[i] = el)}
            className={`absolute ${stat.position}`}
            style={{
              opacity: 0,
              background: `radial-gradient(circle at 14% 12%, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0) 42%), linear-gradient(145deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.07) 42%, rgba(0,0,0,0.12) 100%), ${stat.bg}`,
              color: stat.color,
              border: "1px solid rgba(255,255,255,0.34)",
              borderRadius: "16px",
              padding: "1.4rem 1.8rem",
              minWidth: "180px",
              boxShadow: `0 18px 44px rgba(0,0,0,0.36), 0 0 34px ${stat.bg}66, inset 0 1px 0 rgba(255,255,255,0.4), inset 0 -1px 0 rgba(0,0,0,0.16)`,
              backdropFilter: "blur(9px) saturate(140%)",
              WebkitBackdropFilter: "blur(9px) saturate(140%)",
              overflow: "hidden",
              willChange: "opacity, transform",
              zIndex: 20,
            }}
          >
            <div
              aria-hidden
              className="absolute top-0 left-0 h-[3px] w-full"
              style={{
                background: `linear-gradient(90deg, rgba(255,255,255,0.12) 0%, ${stat.bg} 45%, rgba(255,255,255,0.95) 100%)`,
                opacity: 0.95,
              }}
            />
            <div
              aria-hidden
              className="absolute -top-10 -right-8 w-24 h-24 rounded-full pointer-events-none"
              style={{
                background: stat.bg,
                opacity: 0.28,
                filter: "blur(20px)",
              }}
            />
            <span
              className="block font-bold"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(2.5rem, 5vw, 3.8rem)",
                lineHeight: 1,
                letterSpacing: "0.03em",
                color: "#071426",
                display: "inline-block",
                padding: "0.08em 0.26em 0.04em",
                borderRadius: "10px",
                border: "1px solid rgba(255,255,255,0.34)",
                background:
                  "linear-gradient(135deg, rgba(255,255,255,0.46) 0%, rgba(255,255,255,0.16) 100%)",
                boxShadow:
                  "inset 0 1px 0 rgba(255,255,255,0.5), 0 8px 18px rgba(0,0,0,0.16)",
                textShadow: "0 2px 8px rgba(0,0,0,0.18)",
                position: "relative",
                zIndex: 2,
              }}
            >
              {stat.value}
            </span>
            <span
              className="block mt-1 font-medium text-sm tracking-wide"
              style={{
                fontFamily: "var(--font-body)",
                opacity: 0.92,
                letterSpacing: "0.07em",
                textTransform: "uppercase",
                fontWeight: 600,
                marginTop: "0.55rem",
                padding: "0.34rem 0.56rem",
                borderRadius: "10px",
                background: "rgba(7,20,38,0.16)",
                border: "1px solid rgba(7,20,38,0.26)",
                color: "#0a1222",
                lineHeight: 1.2,
                position: "relative",
                zIndex: 2,
              }}
            >
              {stat.label}
            </span>
          </div>
        ))}

        <div
          className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          style={{ opacity: 0.58, zIndex: 30 }}
        >
          <span
            className="text-xs tracking-widest uppercase text-white"
            style={{
              fontFamily: "var(--font-body)",
              color: "#deefff",
              textShadow: "0 0 12px rgba(81, 222, 255, 0.35)",
            }}
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
