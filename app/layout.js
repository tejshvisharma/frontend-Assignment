import "./globals.css";

export const metadata = {
  title: "ITZFIZZ – Scroll Animation Hero",
  description: "Scroll-driven hero section built with GSAP + ScrollTrigger in Next.js",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
