import HeroSection from "@/components/HeroSection";

/**
 * PAGE ROOT
 * ─────────
 * Kept intentionally thin: the page only imports HeroSection.
 * This keeps concerns separated – layout lives in layout.js,
 * animation logic lives in HeroSection.js.
 */
export default function Home() {
  return (
    <main>
      <HeroSection />

      {/* ── Dummy content so the user has something to scroll into ── */}
      <section className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
        <p
          className="text-center text-[#333] text-xl tracking-widest uppercase"
          style={{ fontFamily: "var(--font-display)" }}
        >
          More content below
        </p>
      </section>
    </main>
  );
}
