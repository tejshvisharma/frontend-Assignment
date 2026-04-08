import "./globals.css";

export const metadata = {
  title: "Mahatejshvi | Frontend Developer",
  description:
    "Scroll-Driven Hero Case Study built with Next.js, Tailwind CSS, and GSAP",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
