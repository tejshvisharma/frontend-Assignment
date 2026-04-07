# ITZFIZZ – Scroll‑Driven Hero Section

A polished scroll animation hero built with **Next.js 14 · React 18 · Tailwind CSS · GSAP + ScrollTrigger**.

---

## Quick Start

```bash
npm install
npm run dev
# open http://localhost:3000
```

> **Car image:** drop your car PNG into `public/car.png`.  
> A top-view PNG with a transparent background works best (e.g. McLaren 720S).

---

## Project Structure

```
itzfizz-hero/
├── app/
│   ├── globals.css        ← global tokens, Google Fonts import, Tailwind layers
│   ├── layout.js          ← root Next.js layout (metadata, body)
│   └── page.js            ← root page – just renders HeroSection
├── components/
│   └── HeroSection.js     ← all animation logic lives here
├── public/
│   └── car.png            ← add your car image here
├── tailwind.config.js
├── next.config.js
└── package.json
```

---

## How the Hero Works

### 1. Layout

The section is **200vh tall** but only **100vh is visible** at a time. This "extra" height is the *scroll budget* — the distance the user scrolls to drive all the animations. The inner `.track` div is pinned by GSAP so it stays in the viewport while the user scrolls.

```
Viewport (100vh)
┌──────────────────────────────┐
│  Headline (letters)          │ ← GSAP stagger on load + car reveal on scroll
│                              │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━ │ ← Road strip (200px tall)
│  🟢🟢🟢🟢🟢🟢🟢🟢🟢🚗      │   trail (green) + car moves left→right
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                              │
│  [58%] [90%] ...             │ ← Stat cards fade in during scroll
└──────────────────────────────┘
```

### 2. Intro Animation (page load)

```js
// gsap.timeline() chains animations sequentially
const tl = gsap.timeline({ defaults: { ease: "expo.out" } });

tl.fromTo(road, { yPercent: 100 }, { yPercent: 0 });   // road slides up
tl.fromTo(letters, { opacity:0, y:60 }, { opacity:1, y:0, stagger:0.04 }); // letters cascade
```

- `fromTo()` explicitly sets both start and end states – safer than `from()` alone.
- `stagger: 0.04` staggers each letter's animation start by 40 ms.
- `"-=0.5"` overlaps with the previous animation for a connected feel.

### 3. Scroll Animation (core feature)

```js
gsap.timeline({
  scrollTrigger: {
    trigger: sectionRef,
    start: "top top",    // start when section hits viewport top
    end: "bottom top",   // end when section bottom leaves viewport top
    scrub: 1.5,          // 1.5 s smoothing lag (car glides, not snaps)
    pin: trackRef,       // pin the visual container while scrolling
  }
})
.to(car, { x: endX, ease: "none" })      // move car right
.to(trail, { width: endX + carW/2 })     // grow trail to car's midpoint
```

#### Key ScrollTrigger props explained

| Prop | What it does |
|------|-------------|
| `trigger` | Element whose scroll position drives the animation |
| `start` | When to begin – format is `"elementEdge viewportEdge"` |
| `end` | When to finish – same format |
| `scrub` | Ties animation progress to scroll progress. `true` = instant, number = seconds of lag |
| `pin` | Pins an element in place while the scroll budget is consumed |
| `anticipatePin` | Eliminates the jump when pinning on fast scroll |

### 4. Letter Reveal via `onUpdate`

```js
ScrollTrigger.create({
  onUpdate: () => {
    const carX = gsap.getProperty(car, "x") + carWidth / 2;
    letters.forEach(letter => {
      letter.style.opacity = carX >= letter.getBoundingClientRect().left ? "1" : "0";
    });
  }
});
```

`onUpdate` fires every frame while the user scrolls. We compare the car's current X position against each letter's position to toggle visibility – no heavy math, just a comparison.

### 5. Performance

| Technique | Why |
|-----------|-----|
| `transform: translateX` (GSAP `x`) | GPU-composited, zero layout cost |
| `will-change: transform` | Signals the browser to promote element to its own layer |
| `scrub` instead of `onScroll` events | GSAP batches updates; avoids raw scroll listeners |
| `gsap.context()` | Scopes all GSAP animations; single `.revert()` cleans everything on unmount |

---

## Suggested Git Commit History

```
feat(project): initialise Next.js 14 + Tailwind + GSAP boilerplate
feat(hero): set up hero section layout with road strip and sticky track
feat(hero): add headline letter spans and stat card components
feat(hero): implement intro animation (road slide-up + letter stagger)
feat(hero): add scroll-driven car movement with GSAP ScrollTrigger
feat(hero): implement trail growth and letter reveal on scroll
feat(hero): add stat card fade-in animations with staggered scroll offsets
perf(hero): migrate animations to transform properties, add will-change hints
style(hero): refine colour palette, add grid background and scroll cue
docs(hero): add README with architecture explanation and GSAP prop glossary
```

---

## Customisation

| What | Where | How |
|------|-------|-----|
| Headline text | `HeroSection.js` | Edit the `HEADLINE` string constant |
| Stat cards | `HeroSection.js` | Edit the `STATS` array |
| Colours | `globals.css` | Edit the CSS custom properties under `:root` |
| Car image | `public/car.png` | Replace the file |
| Animation feel | `HeroSection.js` | Adjust `scrub`, `ease`, and `stagger` values |



git add -p package.json next.config.js jsconfig.json
git commit -m "Initialize Next.js app skeleton"

git add -p tailwind.config.js app/layout.js app/page.js app/globals.css
git commit -m "Configure Tailwind and base layout"

git add -p app/globals.css app/layout.js
git commit -m "Add global theme tokens and fonts"

git add -p components/HeroSection.js app/page.js
git commit -m "Create HeroSection component shell"








git add -p components/HeroSection.js public
git commit -m "Add road scene and car asset"

git add -p package.json components/HeroSection.js
git commit -m "Add GSAP and ScrollTrigger setup"

git add -p components/HeroSection.js
git commit -m "Pin hero section on scroll"

git add -p components/HeroSection.js
git commit -m "Add hero intro animation timeline"

git add -p components/HeroSection.js app/globals.css
git commit -m "Add scroll-driven car motion effects"

git add -p app/page.js app/globals.css
git commit -m "Add about projects contact sections"

git add -p components/HeroSection.js app/page.js app/globals.css
git commit -m "Refine responsive layout and spacing"

git add -p components/HeroSection.js app/globals.css
git commit -m "Polish microinteractions and motion"

git add README.md settings.json
git commit -m "Add README and editor settings"