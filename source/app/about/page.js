"use client";

import { useState } from "react";

const software = [
  ["Rhino", "船体与上层建筑三维建模"],
  ["KeyShot", "材质、灯光与静帧渲染"],
  ["Unreal Engine", "实时场景与动态展示"],
  ["Adobe Illustrator", "版式与视觉表达"],
  ["Office", "文档、数据与汇报整理"],
  ["Canva", "快速视觉沟通与内容设计"]
];

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export default function AboutPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);

  return (
    <main className="profile-page">
      <header className={`site-header site-header--light ${menuOpen ? "menu-open" : ""}`}>
        <a className="brand" href="/" onClick={closeMenu} aria-label="返回首页">
          <span className="brand-mark">YMG</span>
          <span className="brand-word">design</span>
        </a>
        <button
          className="menu-button"
          type="button"
          aria-expanded={menuOpen}
          aria-controls="profile-navigation"
          onClick={() => setMenuOpen((value) => !value)}
        >
          <span />
          <span />
        </button>
        <nav id="profile-navigation" className={menuOpen ? "site-nav is-open" : "site-nav"}>
          <a href="/#project" onClick={closeMenu}>项目 / Project</a>
          <a href="/#design" onClick={closeMenu}>设计 / Design</a>
          <a href="/about" onClick={closeMenu}>关于 / About</a>
          <a className="nav-resume" href="/files/YMG-resume.pdf" target="_blank" rel="noreferrer">
            简历 PDF
          </a>
        </nav>
      </header>

      <section className="profile-hero">
        <div className="profile-photo">
          <div className="portrait-backdrop" />
          <img src="/images/portrait.webp" alt="YMG design 设计师郑一鸣" />
        </div>

        <div className="profile-content">
          <p className="kicker">ABOUT YMG DESIGN</p>
          <h1>
            郑一鸣
            <span>Zheng Yiming</span>
          </h1>
          <p className="profile-lead">
            以工程逻辑为骨架，以空间与美学为表达。关注游艇造型、空间体验与工程可实现性的协同。
          </p>

          <dl className="profile-facts">
            <div>
              <dt>方向</dt>
              <dd>游艇设计 / 船舶设计</dd>
            </div>
            <div>
              <dt>教育</dt>
              <dd>广东海洋大学 · 船舶与海洋工程</dd>
            </div>
            <div>
              <dt>阶段</dt>
              <dd>本科在读 · 2023—2027</dd>
            </div>
            <div>
              <dt>能力</dt>
              <dd>概念设计 · 三维建模 · 可视化表达</dd>
            </div>
          </dl>

          <div className="software-section">
            <p className="kicker">SOFTWARE &amp; WORKFLOW</p>
            <h2>使用软件</h2>
            <div className="software-grid">
              {software.map(([name, description]) => (
                <article key={name}>
                  <strong>{name}</strong>
                  <span>{description}</span>
                </article>
              ))}
            </div>
          </div>

          <div className="profile-actions">
            <a href="/files/YMG-resume.pdf" target="_blank" rel="noreferrer">
              下载个人简历 <ArrowIcon />
            </a>
            <a href="mailto:2849597574@qq.com">
              发送邮件 <ArrowIcon />
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
