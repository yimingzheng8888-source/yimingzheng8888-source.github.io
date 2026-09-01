"use client";

import { useEffect, useRef, useState } from "react";

const deckPlans = [
  { id: "flybridge", label: "飞桥甲板", en: "Flybridge Deck", image: "/images/deck-flybridge.webp" },
  { id: "upper", label: "上层甲板", en: "Upper Deck", image: "/images/deck-upper.webp" },
  { id: "main", label: "主甲板", en: "Main Deck", image: "/images/deck-main.webp" },
  { id: "lower", label: "下层甲板", en: "Lower Deck", image: "/images/deck-lower.webp" }
];

const specs = [
  ["60 m", "总长", "Length overall"],
  ["11.1 m", "型宽", "Beam"],
  ["2.9 m", "满载吃水", "Draft"],
  ["12.5 kn", "巡航航速", "Cruising speed"],
  ["10", "乘员人数", "Guests"]
];

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

function FeatureMedia({ video, poster, alt }) {
  const ref = useRef(null);
  const [playing, setPlaying] = useState(false);

  const toggle = async () => {
    const element = ref.current;
    if (!element) return;
    if (element.paused) {
      await element.play();
      setPlaying(true);
    } else {
      element.pause();
      setPlaying(false);
    }
  };

  return (
    <div className="feature-media">
      <video
        ref={ref}
        muted
        loop
        playsInline
        preload="none"
        poster={poster}
        aria-label={alt}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      >
        <source src={video} type="video/mp4" />
      </video>
      <button className="media-toggle" onClick={toggle} type="button" aria-label={playing ? "暂停视频" : "播放视频"}>
        <span>{playing ? "Ⅱ" : "▶"}</span>
        {playing ? "PAUSE" : "PLAY"}
      </button>
    </div>
  );
}

export default function HomePage() {
  const [activeDeck, setActiveDeck] = useState(deckPlans[0]);
  const heroVideo = useRef(null);
  const [heroPlaying, setHeroPlaying] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [headerOnHero, setHeaderOnHero] = useState(true);

  useEffect(() => {
    const nodes = document.querySelectorAll("[data-reveal]");
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) entry.target.classList.add("is-visible");
        }
      },
      { threshold: 0.12 }
    );
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const updateHeader = () => {
      setHeaderOnHero(window.scrollY < window.innerHeight - 96);
    };

    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });
    window.addEventListener("resize", updateHeader);

    return () => {
      window.removeEventListener("scroll", updateHeader);
      window.removeEventListener("resize", updateHeader);
    };
  }, []);

  const toggleHero = async () => {
    const element = heroVideo.current;
    if (!element) return;
    if (element.paused) {
      await element.play();
      setHeroPlaying(true);
    } else {
      element.pause();
      setHeroPlaying(false);
    }
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <main>
      <header className={`site-header ${headerOnHero ? "site-header--hero" : "site-header--light"} ${menuOpen ? "menu-open" : ""}`}>
        <a className="brand" href="#top" onClick={closeMenu} aria-label="返回首页">
          <span className="brand-mark">YMG</span>
          <span className="brand-word">design</span>
        </a>
        <button
          className="menu-button"
          type="button"
          aria-expanded={menuOpen}
          aria-controls="site-navigation"
          onClick={() => setMenuOpen((value) => !value)}
        >
          <span />
          <span />
        </button>
        <nav id="site-navigation" className={menuOpen ? "site-nav is-open" : "site-nav"}>
          <a href="#project" onClick={closeMenu}>项目 / Project</a>
          <a href="#design" onClick={closeMenu}>设计 / Design</a>
          <a href="/about" onClick={closeMenu}>关于 / About</a>
          <a className="nav-resume" href="/files/YMG-resume.pdf" target="_blank" rel="noreferrer">
            简历 PDF
          </a>
        </nav>
      </header>

      <section className="hero" id="top">
        <video
          ref={heroVideo}
          className="hero-video"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster="/images/drift-hero.webp"
          onPlay={() => setHeroPlaying(true)}
          onPause={() => setHeroPlaying(false)}
        >
          <source src="/media/drift-panorama.mp4" type="video/mp4" />
        </video>
        <div className="hero-shade" />
        <div className="hero-grain" />
        <div className="hero-content">
          <p className="eyebrow">60M EXPLORER YACHT · 2026</p>
          <h1>
            <span>DRIFT</span>
            <small>泛舟</small>
          </h1>
          <p className="hero-copy">
            探索海洋的无限可能
            <span>Exploring infinite maritime possibilities.</span>
          </p>
        </div>
        <div className="hero-meta">
          <span>YACHT &amp; VESSEL DESIGN</span>
          <span>YMG DESIGN / ZHENG YIMING</span>
        </div>
        <button className="hero-toggle" type="button" onClick={toggleHero}>
          <span>{heroPlaying ? "Ⅱ" : "▶"}</span>
          {heroPlaying ? "暂停动态" : "播放动态"}
        </button>
        <a className="scroll-cue" href="#project">
          <span>SCROLL TO EXPLORE</span>
          <i />
        </a>
      </section>

      <section className="project-intro project-intro--concise" id="project">
        <div className="section-index light">01 / PROJECT CONCEPT</div>
        <div className="project-statement" data-reveal>
          <p className="kicker">DRIFT · SEA CULTURE STATION</p>
          <h2>一座连接传统与未来的海上文化驿站</h2>
          <p>
            以 60 米探索型超级游艇为载体，让远洋探索、海南地域文化与可持续技术在海上相遇。
          </p>
          <p className="english">
            A 60-metre explorer yacht where ocean exploration, Hainan heritage and
            responsible technology meet.
          </p>
        </div>
      </section>

      <section className="technical-data">
        <div className="section-index light">02 / TECHNICAL DATA</div>
        <h2 data-reveal>TECHNICAL DATA</h2>
        <div className="technical-groups">
          <article data-reveal>
            <h3>DIMENSIONS</h3>
            {specs.slice(0, 3).map(([value, zh, en]) => (
              <div className="technical-row" key={en}>
                <span>{en}<small>{zh}</small></span>
                <strong>{value}</strong>
              </div>
            ))}
          </article>
          <article data-reveal>
            <h3>PERFORMANCE &amp; CAPACITY</h3>
            {specs.slice(3).map(([value, zh, en]) => (
              <div className="technical-row" key={en}>
                <span>{en}<small>{zh}</small></span>
                <strong>{value}</strong>
              </div>
            ))}
            <div className="technical-row">
              <span>Vessel type<small>船型</small></span>
              <strong>Monohull</strong>
            </div>
          </article>
        </div>
      </section>

      <section className="full-image" aria-label="DRIFT 海上外观效果图">
        <img src="/images/drift-ocean.webp" alt="DRIFT 60 超级游艇航行于深蓝海面" />
        <div className="image-caption">
          <span>Exterior Profile</span>
          <span>沉稳 · 务实 · 厚积薄发</span>
        </div>
      </section>

      <section className="design-language" id="design">
        <div className="section-index">03 / DESIGN LANGUAGE</div>
        <div className="design-grid">
          <div className="cutout-wrap" data-reveal>
            <img src="/images/drift-profile-transparent.png" alt="DRIFT 游艇透明底舷侧造型图" />
          </div>
          <div className="design-copy" data-reveal>
            <p className="kicker">FORM &amp; HERITAGE</p>
            <h2>经纬交织，<br />重构海上轮廓</h2>
            <p>
              舷侧长椭圆阵列取意于崖州传统织机，大地色船体回应天然植物染色，
              让 60 米体量呈现内敛而坚定的姿态。
            </p>
          </div>
        </div>
      </section>

      <section className="feature-section">
        <div className="section-heading">
          <div className="section-index">04 / SIGNATURE SPACES</div>
          <h2 data-reveal>不止于航行，<br />重新定义远洋生活。</h2>
        </div>

        <article className="feature-row feature-ar">
          <div className="feature-image" data-reveal>
            <img src="/images/drift-ar-workshop.webp" alt="DRIFT AR 创新工坊空间" />
          </div>
          <div className="feature-copy" data-reveal>
            <span className="feature-number">01</span>
            <p className="kicker">AR INNOVATION WORKSHOP</p>
            <h3>创新工坊</h3>
            <p>
              以增强现实与全息交互串联传统纺织工艺和现代海洋科技，
              把游艇中的休闲空间转化为面向下一代的探索与教育窗口。
            </p>
          </div>
        </article>

        <article className="feature-row reverse">
          <div className="feature-image" data-reveal>
            <img src="/images/drift-saloon.webp" alt="DRIFT 主甲板会客厅效果图" />
          </div>
          <div className="feature-copy" data-reveal>
            <span className="feature-number">02</span>
            <p className="kicker">MAIN DECK SALOON</p>
            <h3>主甲板会客厅</h3>
            <p>
              U 型弧形沙发构成包容的社交场域，黎族图腾木雕与现代视听系统形成跨时空对话。
              旋转隔断在保证空间流动性的同时，完成“移步换景”的视线组织。
            </p>
          </div>
        </article>

        <article className="feature-row">
          <div className="feature-image" data-reveal>
            <img src="/images/drift-submersible.webp" alt="DRIFT 潜水器收放平台效果图" />
          </div>
          <div className="feature-copy" data-reveal>
            <span className="feature-number">03</span>
            <p className="kicker">SUBMERSIBLE LAUNCH SYSTEM</p>
            <h3>潜水器收放系统</h3>
            <p>
              底部滑轨与沉水式尾平台协同工作，使潜水器以安全浮态完成布放与回收。
              动态升降结构释放舱内净空，也创造极具辨识度的远洋科考场景。
            </p>
          </div>
        </article>
      </section>

      <section className="deck-section">
        <div className="section-index">05 / GENERAL ARRANGEMENT</div>
        <div className="deck-title" data-reveal>
          <h2>LAYOUTS</h2>
        </div>
        <div className="deck-tabs" role="tablist" aria-label="总布置图甲板选择">
          {deckPlans.map((deck) => (
            <button
              key={deck.id}
              type="button"
              role="tab"
              aria-controls="active-deck-plan"
              aria-selected={activeDeck.id === deck.id}
              className={activeDeck.id === deck.id ? "active" : ""}
              onClick={() => setActiveDeck(deck)}
            >
              <span>{deck.label}</span>
            </button>
          ))}
        </div>
        <div className="deck-visual" id="active-deck-plan" role="tabpanel" data-reveal>
          <img key={activeDeck.id} src={activeDeck.image} alt={`${activeDeck.label}总布置图`} />
        </div>
      </section>

      <section className="systems-section">
        <div className="section-index">06 / RESPONSIBLE EXPLORATION</div>
        <div className="systems-intro">
          <h2 data-reveal>探索更远，<br />留下更轻的足迹。</h2>
          <p data-reveal>
            DRIFT 将混合动力、光伏伸展停机坪、灰水循环和海上垂直农场整合为相互支持的微生态系统。
          </p>
        </div>
        <div className="system-grid">
          <article data-reveal>
            <span>01</span>
            <h3>Hybrid Power</h3>
            <p>柴电混合架构与储能系统支持静音停泊和高效能源分配。</p>
          </article>
          <article data-reveal>
            <span>02</span>
            <h3>Adaptive Helipad</h3>
            <p>可伸展停机坪兼作光伏阵列，让闲置空间参与清洁能源生产。</p>
          </article>
          <article data-reveal>
            <span>03</span>
            <h3>Closed-loop Water</h3>
            <p>灰水净化后反哺垂直农场，构建船内水资源循环链路。</p>
          </article>
        </div>
      </section>

      <section className="profile-cta">
        <div className="section-index">07 / ABOUT</div>
        <div className="profile-cta-inner" data-reveal>
          <p className="kicker">YMG DESIGN · ZHENG YIMING</p>
          <h2>了解设计背后的我。</h2>
          <a href="/about">
            查看个人信息与软件技能 <ArrowIcon />
          </a>
        </div>
      </section>

      <section className="next-projects">
        <div className="section-index light">NEXT / SELECTED WORKS</div>
        <div className="next-heading">
          <h2>更多项目，即将呈现。</h2>
          <p>More selected works are being prepared.</p>
        </div>
        <div className="project-teasers">
          <article>
            <span>SUPER YACHT</span>
            <h3>鲸梦泽</h3>
            <small>COMING SOON</small>
          </article>
          <article>
            <span>EXCURSION VESSEL</span>
            <h3>蔚蓝之环</h3>
            <small>COMING SOON</small>
          </article>
        </div>
      </section>

      <footer>
        <div className="footer-top">
          <p>Let&apos;s create what moves on water.</p>
          <a href="mailto:2849597574@qq.com">2849597574@qq.com</a>
        </div>
        <div className="footer-bottom">
          <span>© 2026 YMG design</span>
          <a href="#top">BACK TO TOP ↑</a>
        </div>
      </footer>
    </main>
  );
}
