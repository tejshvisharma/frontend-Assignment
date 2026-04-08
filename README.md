# Scroll-Driven Hero Landing Page

This project is a custom landing page section I built to show frontend animation skills in a practical way.

The hero is fully scroll-driven:

- A car moves across the road as the user scrolls.
- Headline letters reveal based on the car position.
- Stat cards fade in at different points during the scroll.

The goal was to create something that feels smooth, modern, and interactive without making the code hard to follow.

## What I Built

- A pinned hero section that stays in view while scroll controls the animation.
- A coordinated animation flow using GSAP and ScrollTrigger.
- A letter-by-letter headline reveal tied to movement, not just a timed effect.
- Animated cards that appear progressively during the scroll journey.
- A responsive layout that works across screen sizes and browsers.

## Tech Stack

- Next.js 14
- React 18
- Tailwind CSS
- GSAP + ScrollTrigger

## Why This Project Matters

This project demonstrates that I can:

- Build polished frontend experiences, not just static UI.
- Connect animation state to user behavior (scroll position).
- Handle real issues like refresh state consistency and cross-browser behavior.
- Keep motion performance-friendly by using transform-based animation.

## How It Works (Simple Explanation)

1. The section height is larger than the screen, so scrolling creates animation time.
2. The hero area is pinned while the page scrolls through that section.
3. Scroll progress moves the car from left to right.
4. As the car reaches each letter position, that letter becomes visible.
5. Cards fade in at different scroll ranges to tell a visual story.

## Project Structure

```text
files/
├── app/
│   ├── globals.css
│   ├── layout.js
│   └── page.js
├── components/
│   └── HeroSection.js
├── public/
│   └── car.png
├── tailwind.config.js
├── next.config.js
└── package.json
```

## Run Locally

```bash
npm install
npm run dev
```

Open: http://localhost:3000

## Customization

- Headline text: update the `HEADLINE` string in `components/HeroSection.js`
- Stat card content: edit the `STATS` array in `components/HeroSection.js`
- Theme colors and fonts: edit `app/globals.css`
- Car asset: replace `public/car.png`

## Notes

- Car image works best as a transparent PNG (top view).
- Animations are scoped and cleaned up on unmount for stability.
- Scroll behavior has been tuned so initial load and refresh states remain consistent.

## Hosting (Final Step)

This project is ready to deploy on Vercel.

1. Push your latest code to GitHub.
2. Import the repository in Vercel.
3. Keep the default settings:
	- Framework: Next.js
	- Build command: `npm run build`
	- Output: Next.js default
4. Deploy.

Before deploying, run this once locally:

```bash
npm run build
```

If build succeeds, your hosting build should also succeed.
