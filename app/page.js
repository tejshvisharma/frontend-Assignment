import HeroSection from "@/components/HeroSection";
export default function Home() {
  return (
    <main>
      <HeroSection />
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
