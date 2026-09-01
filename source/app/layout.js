import "./globals.css";
import "./review-pass.css";

export const metadata = {
  title: "YMG design — Yacht & Vessel Design",
  description:
    "郑一鸣的游艇与船舶设计个人作品集。DRIFT 60M Explorer Yacht — 探索海洋的无限可能。",
  keywords: ["游艇设计", "船舶设计", "Yacht Design", "YMG design", "DRIFT 60"],
  openGraph: {
    title: "YMG design — Yacht & Vessel Design",
    description: "以工程逻辑为骨架，以空间与美学为表达。",
    images: ["/images/drift-hero.webp"]
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
