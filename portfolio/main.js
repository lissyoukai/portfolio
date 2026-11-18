/* ================= Translations =================
   Edit texts here. Keys match data-i18n attributes in index.html. */
const I18N = {
  en: {
    "page.title": "Liss — Product Designer",
    "nav.work": "Work",
    "nav.about": "About",
    "nav.contact": "Contact",
    "menu.open": "Open menu",
    "menu.close": "Close menu",
    "hero.greeting": "Hey, I'm Liss",
    "hero.role": "Product Designer focused on turning complex product logic into clear user experiences",
    "hero.status": "Currently looking for a product design role",
    "hero.alt": "Liss sitting on a white bench in a park",
    "meta.year": "Year",
    "meta.role": "Role",
    "meta.tags": "Tags",
    "meta.productDesigner": "Product Designer",
    "tag.fintech": "Fintech",
    "tag.mobileApp": "Mobile App",
    "tag.internalPlatform": "Internal Platform",
    "tag.multiRole": "Multi-role Workflow",
    "tag.webDesktop": "Web · Desktop",
    "tag.designSystem": "Design System",
    "tag.ia": "Information Architecture",
    "tag.redesign": "Redesign",
    "tullysub.desc": "Subscription management for personal and shared plans. A mobile app with role-based access, payment-status tracking, and a spend-analytics screen — built to help users control recurring expenses and avoid losing money on forgotten services.",
    "tullysub.alt": "Three Tullysub app screens: budget dashboard, empty subscriptions list and spending analytics",
    "fefuone.title": "FEFUone · Event Builder",
    "fefuone.desc": "Event management module for FEFU's university platform. Organizers book venues, equipment and services in one step — with live capacity checks and availability — then move through moderation and approvals with clear statuses.",
    "fefuone.alt": "FEFUone event builder: venue selection with capacity check, availability calendar, and equipment and services",
    "geology.desc": "Systemic redesign of a data-heavy research platform — unifying navigation, data tables, filters, and interactive tools (maps, charts) into one design system across 40+ screens, without changing the existing technical architecture.",
    "geology.alt": "GeologyScience.ru home page with an interactive map of Russia",
    "footer.copy": "© 2026—ongoing",
    "footer.note": "made thoughtfully, late at night ₊⊹"
  },
  // RU: only case descriptions are translated; everything else stays in English.
  // To translate another field, add its key here (keys are listed in the "en" block above).
  ru: {
    "tullysub.desc": "Управление личными и совместными подписками. Мобильное приложение с ролевым доступом, статусами оплат и аналитикой расходов — помогает держать регулярные траты под контролем и не терять деньги на забытых сервисах.",
    "fefuone.desc": "Модуль управления мероприятиями для университетской платформы ДВФУ. Организатор за один шаг бронирует площадки, оборудование и услуги — с проверкой вместимости и занятости, — а затем проходит модерацию и согласования с понятными статусами.",
    "geology.desc": "Системный редизайн исследовательской платформы с большим объёмом данных: навигация, таблицы, фильтры и интерактивные инструменты (карты, графики) собраны в единую дизайн-систему на 40+ экранах без изменения технической архитектуры."
  }
};

/* ================= Language ================= */
const LANG_KEY = "liss-lang";
let currentLang = "en";

function readSavedLang() {
  try { return localStorage.getItem(LANG_KEY); } catch (e) { return null; }
}

function saveLang(lang) {
  try { localStorage.setItem(LANG_KEY, lang); } catch (e) { /* storage unavailable — fine */ }
}

function initialLang() {
  const fromUrl = new URLSearchParams(location.search).get("lang");
  if (fromUrl && I18N[fromUrl]) return fromUrl;          // links like ?lang=ru
  const saved = readSavedLang();
  if (saved && I18N[saved]) return saved;
  return (navigator.language || "").toLowerCase().startsWith("ru") ? "ru" : "en";
}

function applyLang(lang) {
  const dict = { ...I18N.en, ...(I18N[lang] || {}) };
  currentLang = lang;
  document.documentElement.lang = lang;
  document.title = dict["page.title"];

  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const text = dict[el.dataset.i18n];
    if (text !== undefined) el.textContent = text;
  });
  document.querySelectorAll("[data-i18n-alt]").forEach((el) => {
    const text = dict[el.dataset.i18nAlt];
    if (text !== undefined) el.alt = text;
  });
  document.querySelectorAll(".lang__btn").forEach((btn) => {
    btn.setAttribute("aria-pressed", String(btn.dataset.lang === lang));
  });
  updateMenuLabel();
}

document.querySelectorAll(".lang__btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    applyLang(btn.dataset.lang);
    saveLang(btn.dataset.lang);
  });
});

/* ================= Mobile menu ================= */
const menuBtn = document.querySelector(".menu-btn");
const mobileMenu = document.getElementById("mobile-menu");

function updateMenuLabel() {
  const open = menuBtn.getAttribute("aria-expanded") === "true";
  menuBtn.setAttribute("aria-label", I18N.en[open ? "menu.close" : "menu.open"]);
}

function setMenu(open) {
  menuBtn.setAttribute("aria-expanded", String(open));
  mobileMenu.hidden = !open;
  updateMenuLabel();
}

menuBtn.addEventListener("click", () => {
  setMenu(menuBtn.getAttribute("aria-expanded") !== "true");
});

mobileMenu.addEventListener("click", (e) => {
  if (e.target.closest("a")) setMenu(false);
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !mobileMenu.hidden) {
    setMenu(false);
    menuBtn.focus();
  }
});

window.matchMedia("(min-width: 721px)").addEventListener("change", (e) => {
  if (e.matches) setMenu(false);
});

// close the mobile menu when tapping outside it
document.addEventListener("click", (e) => {
  if (!mobileMenu.hidden && !e.target.closest("#mobile-menu, .menu-btn")) setMenu(false);
});

/* ================= Contact popover (desktop header) =================
   Opens on click, and on hover for mouse users. Closes on outside click, Escape, or leaving it with the mouse. */
const contactBtn = document.querySelector(".nav__btn");
const contactPop = document.getElementById("contact-pop");
const contactWrap = document.querySelector(".nav__contact");
let popCloseTimer;
let popOpenedAt = 0;

function setPop(open) {
  clearTimeout(popCloseTimer);
  if (open && contactPop.hidden) popOpenedAt = performance.now();
  contactBtn.setAttribute("aria-expanded", String(open));
  contactPop.hidden = !open;
}

contactBtn.addEventListener("click", () => {
  // with a mouse the popover is usually already open from hover — don't let that same click close it
  if (!contactPop.hidden && performance.now() - popOpenedAt < 600) return;
  setPop(contactPop.hidden);
});

if (matchMedia("(hover: hover) and (pointer: fine)").matches) {
  contactWrap.addEventListener("pointerenter", () => setPop(true));
  contactWrap.addEventListener("pointerleave", () => {
    popCloseTimer = setTimeout(() => setPop(false), 220);
  });
}

document.addEventListener("click", (e) => {
  if (!contactPop.hidden && !e.target.closest(".nav__contact")) setPop(false);
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !contactPop.hidden) {
    setPop(false);
    contactBtn.focus();
  }
});

/* ================= Night sky ₊˚⊹ =================
   An ASCII sky drawn on a canvas behind the page:
   - background: small ⊹ in loose clusters, fixed pattern (same on every visit)
   - the moon: a crescent built from the moon photo, next to the avatar
   - moving the mouse over the sky erases the stars; they come back a moment later
   Colors: moon #462DE3 → #AFB3F0 (gradient stops 65% → 100%), stars #AFB3F0. */
const SKY = {
  cellW: 7.664,          // px per column at desktop scale (Framer grid: 1226px / 160 cols)
  cellH: 12,             // px per row
  fontSize: 12,
  starColor: [175, 179, 240],   // #AFB3F0
  moonColor: [70, 45, 227],     // #462DE3
  eraseRadius: 64,       // px around the cursor (soft edge)
  returnDelay: 800,      // ms before erased stars start coming back
  moonSwapEvery: 120,    // ms between glyph changes on the moon under the cursor
  moonCrossfade: 220,    // ms for one glyph to turn into another
  moonGlyphs: ["⁺", "⊹", "✧", "⋆", "✦", "✻"]
};

// Moon brightness per cell (36 × 22), sampled from the moon photo. Two digits per cell: 00–99.
const MOON_LUM = [
  "040404040404040404040404040404040404040404040404040404040404040804040404",
  "040404040404040404040404040404040404040404040404040404040404040720040404",
  "040404040404040404040404040404040404040404040404040404040404040421270404",
  "040404040404040404040404040404040404040404040404040404040404040411491604",
  "040404040404040404040404040404040404040404040404040404040404040410444805",
  "040404040404040404040404040404040404040404040404040404040404040412466818",
  "040404040404040404040404040404040404040404040404040404040404040420486742",
  "040404040404040404040404040404040404040404040404040404040404040932537059",
  "040404040404040404040404040404040404040404040404040404040404062243617570",
  "040404040404040404040404040404040404040404040404040404040404123352678066",
  "040404040404040404040404040404040404040404040404040404040407284657718654",
  "040404040404040404040404040404040404040404040404040404040624495562719330",
  "040404040404040404040404040404040404040404040404040404082744555966788307",
  "040404040404040404040404040404040404040404040404040410304155646878933205",
  "040404040404040404040404040404040404040404040404061633434964758095530604",
  "040404040404040404040404040404040404040404040616273847556273839467070504",
  "040404040404040404040404040404040404040405122338495666707785946008040404",
  "040404040404040404040404040404040509112027394958647081869192380605040404",
  "040509040404040404040404040406102019375358637175768393996815050404040404",
  "040408141617120810091215202938444959667273818389959667240605040404040404",
  "040404040623334753545351555960646974788689938968391105040404040404040404",
  "040404040404040515293948566164686764574734190705050404040404040404040404"
];

const skyCanvas = document.querySelector(".sky__stars");
const glowCanvas = document.querySelector(".sky__glow");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
let glyphs = [];
let pointer = null;
let rafId = 0;
let lastFrame = 0;

function hash(x, y) {
  let h = (x * 374761393 + y * 668265263) ^ 0x5bd1e995;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}

function valueNoise(x, y) {
  const xi = Math.floor(x), yi = Math.floor(y);
  const xf = x - xi, yf = y - yi;
  const s = (t) => t * t * (3 - 2 * t);
  const a = hash(xi, yi), b = hash(xi + 1, yi), c = hash(xi, yi + 1), d = hash(xi + 1, yi + 1);
  const u = s(xf), v = s(yf);
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}

function moonColor(lum) {
  // gradient position: bright moon = 0, empty sky = 1; solid #462DE3 up to 65%, then fades to #AFB3F0
  const pos = 1 - lum;
  const t = pos <= 0.65 ? 0 : (pos - 0.65) / 0.35;
  const [r1, g1, b1] = SKY.moonColor, [r2, g2, b2] = SKY.starColor;
  return `rgb(${Math.round(r1 + (r2 - r1) * t)},${Math.round(g1 + (g2 - g1) * t)},${Math.round(b1 + (b2 - b1) * t)})`;
}

function buildSky() {
  const avatar = document.querySelector(".hero__avatar");
  if (!avatar || !skyCanvas) return;
  const doc = document.documentElement;
  const docH = doc.scrollHeight;
  const vw = doc.clientWidth;
  // layout position (ignores the entrance animation's transform)
  let left = 0, top = 0;
  for (let el = avatar; el; el = el.offsetParent) { left += el.offsetLeft; top += el.offsetTop; }
  const scale = avatar.offsetWidth / 250;
  const cw = SKY.cellW * scale, ch = SKY.cellH * scale;
  const cx = left + avatar.offsetWidth / 2;
  const cy = top + avatar.offsetHeight / 2;

  // Grid origin = top-left cell of the moon (same placement as on the Framer site)
  const ox = cx - 17 * cw;
  const oy = cy + 71 * scale;
  const moonRows = MOON_LUM.length, moonCols = MOON_LUM[0].length / 2;

  const list = [];
  const colMin = Math.floor(-ox / cw) - 1, colMax = Math.ceil((vw - ox) / cw);
  const rowMin = Math.floor(-oy / ch) - 1, rowMax = Math.ceil((docH - oy) / ch);
  const starColor = `rgb(${SKY.starColor.join(",")})`;

  for (let row = rowMin; row <= rowMax; row++) {
    for (let col = colMin; col <= colMax; col++) {
      const x = ox + col * cw, y = oy + row * ch;
      const inMoon = row >= 0 && row < moonRows && col >= 0 && col < moonCols;
      if (inMoon) {
        const lum = Number(MOON_LUM[row].substr(col * 2, 2)) / 99;
        if (lum >= 0.06) {
          const gi = Math.min(SKY.moonGlyphs.length - 1, Math.floor(((lum - 0.06) / 0.94) * SKY.moonGlyphs.length));
          const base = SKY.moonGlyphs[gi];
          list.push({ x, y, base, ch: base, prev: null, swapAt: 0, touchedAt: 0, color: moonColor(lum), moon: true });
          continue;
        }
      }
      // keep a little clear air around the moon
      if (row >= -2 && row < moonRows + 2 && col >= -2 && col < moonCols + 2) continue;
      const n = valueNoise(col / 6.5, row / 4.5);
      const density = 0.012 + 0.2 * Math.max(0, (n - 0.58) / 0.42);
      if (hash(col + 9127, row - 3301) < density) {
        list.push({ x, y, ch: "⊹", color: starColor, moon: false, a: 1, hide: 0, touchedAt: 0 });
      }
    }
  }
  glyphs = list;
  SKY.font = `${(SKY.fontSize * scale).toFixed(2)}px "Fragment Mono", ui-monospace, monospace`;
  SKY.glyphW = cw;
  SKY.glyphH = ch;
  resizeCanvases();
  requestDraw();
}

function resizeCanvases() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const w = window.innerWidth, h = window.innerHeight;
  [skyCanvas, glowCanvas].forEach((c) => {
    if (!c) return;
    c.width = Math.round(w * dpr);
    c.height = Math.round(h * dpr);
    c.getContext("2d").setTransform(dpr, 0, 0, dpr, 0, 0);
  });
}

function requestDraw() {
  if (!rafId) rafId = requestAnimationFrame(draw);
}

function draw(now) {
  rafId = 0;
  const sx = window.scrollX, sy = window.scrollY;
  const w = window.innerWidth, h = window.innerHeight;
  const ctx = skyCanvas.getContext("2d");
  const gctx = glowCanvas ? glowCanvas.getContext("2d") : null;
  ctx.clearRect(0, 0, w, h);
  if (gctx) gctx.clearRect(0, 0, w, h);
  ctx.font = SKY.font;
  ctx.textBaseline = "top";
  ctx.textAlign = "center";
  if (gctx) { gctx.font = SKY.font; gctx.textBaseline = "top"; gctx.textAlign = "center"; }

  const dt = lastFrame ? Math.min(64, now - lastFrame) : 16;
  lastFrame = now;
  const easeOut = 1 - Math.exp(-dt / 90);   // fade out ~0.3s
  const easeIn = 1 - Math.exp(-dt / 320);   // come back ~1.2s
  let animating = false;
  const R = SKY.eraseRadius, inner = R * 0.35;
  const smooth = (t) => t * t * (3 - 2 * t);
  const cxOff = SKY.glyphW / 2, cyOff = SKY.glyphH / 2;

  const paint = (g, ch, alpha, px, py) => {
    ctx.globalAlpha = alpha;
    ctx.fillStyle = g.color;
    ctx.fillText(ch, px + cxOff, py);
    if (gctx && g.moon) {
      gctx.globalAlpha = alpha;
      gctx.fillStyle = g.color;
      gctx.fillText(ch, px + cxOff, py);
    }
  };

  for (const g of glyphs) {
    const px = g.x - sx, py = g.y - sy;
    if (py < -SKY.glyphH || py > h + SKY.glyphH || px < -SKY.glyphW || px > w + SKY.glyphW) continue;

    // how strongly the cursor touches this glyph: 1 at the centre, fading to 0 at the edge
    let influence = 0;
    if (pointer) {
      const dx = px + cxOff - pointer.x, dy = py + cyOff - pointer.y;
      const d = Math.sqrt(dx * dx + dy * dy);
      if (d < R) influence = 1 - smooth(Math.max(0, (d - inner) / (R - inner)));
    }

    if (g.moon) {
      // The moon never disappears: glyphs under the cursor turn into other moon glyphs,
      // then slowly settle back into the original picture.
      if (influence > 0.15) {
        g.touchedAt = now;
        if (!reduceMotion && now - g.swapAt > SKY.moonSwapEvery / influence) {
          const options = SKY.moonGlyphs.filter((c) => c !== g.ch);
          g.prev = g.ch;
          g.ch = options[Math.floor(Math.random() * options.length)];
          g.swapAt = now;
        }
      } else if (g.ch !== g.base && now - g.touchedAt > SKY.returnDelay * 1.5 && now - g.swapAt > SKY.moonCrossfade) {
        g.prev = g.ch;
        g.ch = g.base;
        g.swapAt = now;
      }
      const p = g.prev ? Math.min(1, (now - g.swapAt) / SKY.moonCrossfade) : 1;
      if (p < 1) {
        paint(g, g.prev, 1 - p, px, py);
        paint(g, g.ch, p, px, py);
        animating = true;
      } else {
        g.prev = null;
        paint(g, g.ch, 1, px, py);
      }
      if (g.ch !== g.base) animating = true;
      continue;
    }

    // Stars fade out softly under the cursor and drift back after a pause
    if (influence > 0) {
      g.hide = Math.max(g.hide, influence);
      g.touchedAt = now;
    } else if (g.hide > 0 && now - g.touchedAt > SKY.returnDelay) {
      g.hide = 0;
    }
    const target = 1 - g.hide;
    if (reduceMotion) g.a = target;
    else if (Math.abs(g.a - target) > 0.02) {
      g.a += (target - g.a) * (target < g.a ? easeOut : easeIn);
      animating = true;
    } else g.a = target;
    if (g.hide > 0) animating = true;
    if (g.a <= 0.01) continue;
    paint(g, g.ch, g.a, px, py);
  }
  ctx.globalAlpha = 1;
  if (gctx) gctx.globalAlpha = 1;
  if (animating) requestDraw();
  else lastFrame = 0;
}

window.addEventListener("pointermove", (e) => {
  if (e.pointerType === "touch") return;
  pointer = { x: e.clientX, y: e.clientY };
  requestDraw();
}, { passive: true });

document.addEventListener("pointerleave", () => { pointer = null; requestDraw(); });
window.addEventListener("scroll", requestDraw, { passive: true });

let skyTimer;
function rebuildSkySoon() {
  clearTimeout(skyTimer);
  skyTimer = setTimeout(buildSky, 120);
}
window.addEventListener("resize", rebuildSkySoon);
window.addEventListener("load", buildSky);
if (document.fonts && document.fonts.ready) document.fonts.ready.then(buildSky);
if ("ResizeObserver" in window) new ResizeObserver(rebuildSkySoon).observe(document.body);

/* ================= Entrance & scroll reveal =================
   Content appears one piece after another on load, cases appear as you scroll to them. */
function setupReveal() {
  const root = document.documentElement;
  if (!root.classList.contains("anim")) return;
  const mark = (el, delay) => { if (el) { el.classList.add("reveal"); el.style.setProperty("--d", `${delay}ms`); } };

  mark(document.querySelector(".header"), 0);
  mark(document.querySelector(".hero__avatar"), 200);
  mark(document.querySelector(".hero__greeting"), 620);
  document.querySelectorAll(".hero__intro span").forEach((el, i) => mark(el, 920 + i * 280));
  mark(document.querySelector(".contacts"), 1500);

  document.querySelectorAll(".case").forEach((c) => {
    mark(c.querySelector(".case__cover"), 0);
    mark(c.querySelector(".case__head"), 320);
    mark(c.querySelector(".case__desc"), 520);
    mark(c.querySelector(".case__details"), 700);
    c.querySelectorAll(".case__label, .tags li").forEach((el, i) => mark(el, 800 + i * 100));
  });
  mark(document.querySelector(".footer__inner"), 0);

  // once an element has finished appearing, drop the animation classes so hover/press effects stay instant
  const done = (el) => {
    const delay = parseFloat(el.style.getPropertyValue("--d")) || 0;
    const dur = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--reveal-dur")) * 1000 || 2400;
    setTimeout(() => el.classList.remove("reveal", "is-in"), delay + dur * 1.25);
  };
  const show = (el) => { el.classList.add("is-in"); done(el); };

  const heroItems = document.querySelectorAll(".header.reveal, .hero .reveal");
  requestAnimationFrame(() => requestAnimationFrame(() => {
    heroItems.forEach(show);
    document.querySelector(".sky")?.classList.add("is-in");
  }));

  const rest = [...document.querySelectorAll(".reveal")].filter((el) => !el.closest(".hero") && !el.classList.contains("header"));
  if (!("IntersectionObserver" in window)) { rest.forEach(show); return; }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      // reveal a whole case together so its parts keep their order
      const group = e.target.closest(".case, .footer") || e.target;
      group.querySelectorAll(".reveal:not(.is-in)").forEach((el) => { show(el); io.unobserve(el); });
    });
  }, { rootMargin: "0px 0px -10% 0px", threshold: 0.12 });
  rest.forEach((el) => io.observe(el));
}

/* ================= Soft "haptic" sounds =================
   Soft muffled taps synthesized with Web Audio (no audio files), in the style of derkachcreate.com:
   a sine that slides down in pitch through a low-pass filter, played as a short double pulse.
   - hover over anything interactive → light double tap
   - click → one slightly firmer tap
   Browsers allow sound only after the first click or key press on the page, so hovers are silent until then. */
const HAPTIC = {
  startHz: 620,          // pitch at the start of each pulse
  endHz: 360,            // pitch it slides down to
  lowpassHz: 860,        // lower = more muffled
  volume: 0.055,         // overall loudness
  hover: [{ duration: 80, intensity: 0.8 }, { delay: 80, duration: 50, intensity: 0.3 }],
  click: [{ duration: 90, intensity: 1 }]
};
const HAPTIC_TARGETS = ".nav a, .nav__btn, .link-pill, .logo, .lang__btn, .menu-btn, .tags li, .case__cover, .contacts__item";
let audioCtx = null;
let audioReady = false;
let lastHoverEl = null;
let lastHoverAt = 0;

function getAudio() {
  const Ctx = window.AudioContext || window.webkitAudioContext;
  if (!Ctx) return null;
  audioCtx = audioCtx || new Ctx();
  return audioCtx;
}

function unlockAudio() {
  const ctx = getAudio();
  if (!ctx) return;
  (ctx.resume ? ctx.resume() : Promise.resolve()).then(() => { audioReady = true; }).catch(() => {});
}

function pulse(ctx, start, p) {
  const dur = p.duration / 1000;
  const level = Math.max(0.1, Math.min(p.intensity, 1));
  const osc = ctx.createOscillator();
  const lp = ctx.createBiquadFilter();
  const gain = ctx.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(HAPTIC.startHz, start);
  osc.frequency.exponentialRampToValueAtTime(HAPTIC.endHz, start + dur);
  lp.type = "lowpass";
  lp.frequency.setValueAtTime(HAPTIC.lowpassHz, start);
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(HAPTIC.volume * level, start + 0.008);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + dur);
  osc.connect(lp).connect(gain).connect(ctx.destination);
  osc.start(start);
  osc.stop(start + dur + 0.01);
}

function playHaptic(pattern) {
  const ctx = getAudio();
  if (!ctx || !audioReady) return;
  try {
    const now = ctx.currentTime;
    let offset = 0;
    pattern.forEach((p) => {
      offset += p.delay || 0;
      pulse(ctx, now + offset / 1000, p);
      offset += p.duration;
    });
  } catch (e) { /* stay silent */ }
}

document.addEventListener("pointerdown", (e) => {
  if (!audioReady) unlockAudio();
  if (e.button === 0 && e.target.closest(HAPTIC_TARGETS)) {
    // wait a tick on the very first click so the audio has time to unlock
    setTimeout(() => playHaptic(HAPTIC.click), audioReady ? 0 : 30);
  }
}, { passive: true });
document.addEventListener("keydown", () => { if (!audioReady) unlockAudio(); });

document.addEventListener("pointerover", (e) => {
  if (e.pointerType === "touch") return;
  const el = e.target.closest(HAPTIC_TARGETS);
  if (!el) return;
  if (el === lastHoverEl && e.relatedTarget && el.contains(e.relatedTarget)) return;
  const now = performance.now();
  if (now - lastHoverAt < 90) return;
  lastHoverEl = el;
  lastHoverAt = now;
  playHaptic(HAPTIC.hover);
}, { passive: true });

/* ================= Cover hover pill =================
   A small "Open case" label follows the cursor over project covers. */
// "open" = case page exists; "soon" = case study is being written; "progress" = the product itself is in progress
const CTA_TEXT = { open: "Open case ↗", soon: "Case study coming soon", progress: "Case in progress" };
function setupCoverPill() {
  const pill = document.querySelector(".cover-pill");
  if (!pill || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
  const text = pill.querySelector(".cover-pill__text");
  let x = 0, y = 0, tx = 0, ty = 0, raf = 0, active = false;

  const loop = () => {
    const k = reduceMotion ? 1 : 0.18;
    x += (tx - x) * k;
    y += (ty - y) * k;
    pill.style.transform = `translate(${x + 18}px, ${y + 18}px)`;
    raf = (active || Math.abs(tx - x) > 0.5 || Math.abs(ty - y) > 0.5) ? requestAnimationFrame(loop) : 0;
  };

  document.querySelectorAll(".case__cover[data-cta]").forEach((cover) => {
    cover.addEventListener("pointerenter", (e) => {
      const kind = cover.dataset.cta;
      pill.dataset.kind = kind;
      text.textContent = CTA_TEXT[kind] || CTA_TEXT.open;
      tx = e.clientX; ty = e.clientY;
      if (!active) { x = tx; y = ty; }
      active = true;
      pill.classList.add("is-visible");
      if (!raf) raf = requestAnimationFrame(loop);
    });
    cover.addEventListener("pointermove", (e) => { tx = e.clientX; ty = e.clientY; });
    cover.addEventListener("pointerleave", () => {
      active = false;
      pill.classList.remove("is-visible");
    });
  });
}

/* ================= Contacts: copy email =================
   Click copies the address and shows "Copied". If the browser refuses, the address itself is shown so it can be selected. */
function setupContacts() {
  document.querySelectorAll("[data-copy]").forEach((btn) => {
    const label = btn.querySelector(".copy-label");
    const original = label.dataset.default;
    let timer;
    btn.addEventListener("click", async () => {
      const value = btn.dataset.copy;
      clearTimeout(timer);
      try {
        await navigator.clipboard.writeText(value);
        label.textContent = original === "email" ? "copied" : "Copied";
        btn.classList.add("is-done");
        timer = setTimeout(() => { label.textContent = original; btn.classList.remove("is-done"); }, 1800);
      } catch (e) {
        label.textContent = value;   // clipboard blocked — show the address so it can be selected
      }
    });
  });
}

/* ================= Start ================= */
setupContacts();
setupCoverPill();
setupReveal();
applyLang(initialLang());
buildSky();
