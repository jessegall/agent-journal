// The ajournal splash on every open of the viewer (messages 121420 and 121445; spec doc 1278, timing doc 1288).
// A plain script, run before React: the cover shows at once in the theme's background, before anything else draws.
// 0. Blank: it waits until the tab is in view, then holds an empty screen for 0.5 s.
// 1. Entrance (about 2.8 s): the dot pops in at the centre, the full ring grows round it, and both stay. The dot pulses: two soft beats
//    (a double beat, 250 ms apart), and the double beat repeats every second, about 2 s in all. Then the gap opens and the dot moves out to the ring.
// 2. Loading: the ring spins. At least two full turns, and longer while the first request is still loading.
//    Demo hold (on in the prototype): the spin lasts at least 4 s, so a viewer feels what loading looks like.
// 3. End: the spin eases to rest upright, the mark slides left and 'ajournal' comes out. It always plays whole.
// 4. Reveal: the lockup holds 450 ms, then the cover fades over 280 ms and Home is underneath.
// Address options: ?theme=light|dark (default: the system's), ?load=<ms>|hand (the first request, default 2500; hand: click or Enter),
// ?hold=<ms> (the demo hold, default 4000; 0 turns it off), ?splash=off. window.AJSplash.replay() plays it again.
(function () {
  const VW = 1000, VH = 625, CY = VH / 2;
  const R = 31.6, SW = 16.7, DOT = 8.2;
  const THEMES = {light: {bg: "#FFFFFF", fg: "#0E1014"}, dark: {bg: "#131416", fg: "#FFFFFF"}};
  const T = {blank: 500, pulseFrom: 760, pulseUntil: 2800, beatGap: 250, beatEvery: 1000, turns: 720, hold: 4000, lockupHold: 450, fade: 280, slow: 9000};
  const NS = "http://www.w3.org/2000/svg";
  const clamp = (t, a = 0, b = 1) => Math.min(b, Math.max(a, t));
  const lerp = (a, b, t) => a + (b - a) * t;
  const rad = (d) => d * Math.PI / 180;
  const E = {
    out3: (t) => 1 - Math.pow(1 - t, 3), out4: (t) => 1 - Math.pow(1 - t, 4), out5: (t) => 1 - Math.pow(1 - t, 5),
    inOut4: (t) => (t < .5 ? 8 * t ** 4 : 1 - Math.pow(-2 * t + 2, 4) / 2),
    inOutSine: (t) => -(Math.cos(Math.PI * t) - 1) / 2,
    spring(z) { const w = 6.9 / z, wd = w * Math.sqrt(1 - z * z); return (t) => (t >= 1 ? 1 : 1 - Math.exp(-z * w * t) * (Math.cos(wd * t) + (z * w / wd) * Math.sin(wd * t))); },
  };
  const SPR = {pop: E.spring(.42), soft: E.spring(.62)};
  const svgEl = (tag, attrs = {}, parent) => { const e = document.createElementNS(NS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); if (parent) parent.appendChild(e); return e; };

  /* ---------- styles and the font, put in at once ---------- */
  const css = document.createElement("style");
  css.textContent = `
    .ajs-cover { position: fixed; inset: 0; z-index: 2147483000; display: grid; place-items: center; overflow: hidden; }
    .ajs-cover.ajs-still { position: absolute; z-index: 2; }
    .ajs-cover.ajs-hand { cursor: pointer; }
    .ajs-box { position: absolute; inset: 0; container-type: size; display: grid; place-items: center; }
    .ajs-inner { position: relative; width: min(100%, 160cqh); aspect-ratio: 16 / 10; container-type: inline-size; }
    .ajs-inner svg { position: absolute; inset: 0; width: 100%; height: 100%; overflow: visible; }
    .ajs-word { position: absolute; white-space: nowrap; font-family: 'Space Grotesk', sans-serif; font-weight: 500; letter-spacing: -0.03em; line-height: 1.4; }
    .ajs-word span { display: inline-block; will-change: transform, opacity, filter; }
    .ajs-status { position: absolute; left: 0; right: 0; bottom: 6%; text-align: center; font: 500 12px Inter, system-ui, sans-serif; opacity: 0; transition: opacity .4s; }
    .ajs-reduced .ajs-inner { opacity: 0; transition: opacity 200ms ease-out; }
    .ajs-reduced.ajs-in .ajs-inner { opacity: 1; }
  `;
  document.head.appendChild(css);
  const font = document.createElement("link");
  font.rel = "stylesheet";
  font.href = "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500&family=Inter:wght@500&display=swap";
  document.head.appendChild(font);

  /* ---------- one clock for every splash on the page ---------- */
  let vt = 0, lastT = null, ticking = false;
  const queue = [], dirty = new Set(), live = new Set();
  function tick(now) {
    if (lastT !== null) vt += Math.min(40, now - lastT);
    lastT = now;
    for (const st of dirty) st.draw(vt);
    dirty.clear();
    for (const f of queue.splice(0)) f(vt);
    for (const c of live) c.clock();
    requestAnimationFrame(tick);
  }
  const startClock = () => { if (!ticking) { ticking = true; requestAnimationFrame(tick); } };

  class Run {
    constructor(st) { this.dead = false; this.st = st; }
    render() { dirty.add(this.st); }
    frame() { return new Promise((r) => queue.push((t) => { if (!this.dead) r(t); })); }
    async tween(d, fn, t0 = vt) { fn(clamp((vt - t0) / d)); this.render(); for (;;) { const p = clamp(((await this.frame()) - t0) / d); fn(p); this.render(); if (p >= 1) return; } }
    async wait(ms) { const t0 = vt; while ((await this.frame()) - t0 < ms) {} }
    async until(at) { while (vt < at) await this.frame(); }
  }
  class Mark {
    constructor(svg, color) {
      this.g = svgEl("g", {}, svg);
      this.ring = svgEl("circle", {cx: 50, cy: 50, r: R, fill: "none", stroke: color, pathLength: 360}, this.g);
      this.dot = svgEl("ellipse", {fill: color}, this.g);
      Object.assign(this, {x: 500, y: CY, D: L.D, rot: 0, tail: -15, len: 300, ringScale: 1, ringOpacity: 1, dotAngle: -45, dotR: R, dotScale: 1, _p: null, _s: 1});
    }
    get k() { return this.D / 80; }
    draw(now) {
      this.g.setAttribute("transform", `translate(${this.x} ${this.y}) scale(${this.k}) rotate(${this.rot}) translate(-50 -50)`);
      const len = clamp(this.len, 0, 360);
      this.ring.setAttribute("transform", `translate(50 50) scale(${this.ringScale}) rotate(${this.tail}) translate(-50 -50)`);
      if (len >= 359.95) this.ring.removeAttribute("stroke-dasharray"); else this.ring.setAttribute("stroke-dasharray", `${len} ${360 - len}`);
      this.ring.setAttribute("stroke-width", SW); this.ring.setAttribute("opacity", this.ringOpacity);
      const ang = this.rot + this.dotAngle;
      if (this._p && now > this._p.t) { const sp = Math.abs((ang - this._p.a) / (now - this._p.t)) * Math.PI / 180 * this.dotR * this.k; this._s = lerp(this._s, 1 + Math.min(.32, sp * .45), .35); }
      this._p = {t: now, a: ang};
      const a = rad(this.dotAngle), cx = 50 + this.dotR * Math.cos(a), cy = 50 + this.dotR * Math.sin(a), r = DOT * Math.max(0, this.dotScale);
      this.dot.setAttribute("cx", cx); this.dot.setAttribute("cy", cy);
      this.dot.setAttribute("rx", r * this._s); this.dot.setAttribute("ry", r / Math.sqrt(this._s));
      this.dot.setAttribute("transform", `rotate(${this.dotAngle + 90} ${cx} ${cy})`);
    }
  }
  class Ripple {
    constructor(svg, color) { this.e = svgEl("circle", {fill: "none", stroke: color}, svg); Object.assign(this, {x: 500, y: CY, r: 0, w: 0, o: 0}); }
    draw() { const e = this.e; e.setAttribute("cx", this.x); e.setAttribute("cy", this.y); e.setAttribute("r", this.r); e.setAttribute("stroke-width", this.w); e.setAttribute("opacity", this.o); }
  }
  class Word {
    constructor(inner, color, F) {
      this.F = F; this.el = document.createElement("div"); this.el.className = "ajs-word"; this.el.style.color = color; this.el.style.fontSize = (F / 10) + "cqw";
      this.spans = [..."ajournal"].map((ch) => { const s = document.createElement("span"); s.textContent = ch; this.el.appendChild(s); return s; });
      inner.appendChild(this.el);
      this.letters = this.spans.map(() => ({o: 1, x: 0, b: 0}));
      Object.assign(this, {x: L.wordX, baseline: L.base, maskL: null});
    }
    get W() { return M.w * this.F; }
    hide(from) { this.letters.forEach((q) => Object.assign(q, {o: 0}, from)); }
    draw() {
      const s = this.el.style;
      s.left = (this.x / VW * 100) + "%"; s.top = ((this.baseline - M.base * this.F) / VH * 100) + "%";
      let mask = "none";
      if (this.maskL != null) { const a = this.maskL / this.W * 100; mask = `linear-gradient(90deg, transparent ${a}%, #000 ${a + 8}%)`; }
      s.maskImage = s.webkitMaskImage = mask;
      this.spans.forEach((sp, i) => { const q = this.letters[i]; sp.style.opacity = q.o; sp.style.transform = `translate(${q.x}em, 0)`; sp.style.filter = `blur(${Math.max(0, q.b)}em)`; });
    }
  }
  class Stage {
    constructor(inner) { this.inner = inner; this.svg = svgEl("svg", {viewBox: `0 0 ${VW} ${VH}`, preserveAspectRatio: "xMidYMid meet"}); inner.appendChild(this.svg); this.items = []; }
    add(i) { this.items.push(i); return i; }
    draw(now) { for (const i of this.items) i.draw(now); }
  }
  const ramp = (vmax, ms) => (el) => vmax * E.inOutSine(clamp(el / ms));

  // spins until done() says so, then eases into the next upright angle
  async function rotate(run, done, o) {
    const t0 = vt; let last = t0, target = null;
    for (;;) {
      const t = await run.frame(), dt = t - last; last = t;
      const v = o.speed(t - t0), a = o.get();
      if (done(t - t0) && v > .03) {
        const D = v * o.decel / 3;
        if (target === null) target = o.align + Math.ceil((a + D - o.align) / 360) * 360;
        const r = target - a;
        if (r <= D) { const dur = 3 * r / v; run.tween(dur, (q) => o.set(a + r * E.out3(q)), t - dt); await run.wait(Math.max(0, dur - o.lead)); return; }
      }
      o.set(a + v * dt); run.render();
    }
  }
  function stagger(run, w, {delay, gap, dur, from}) {
    w.hide(from);
    const total = delay + 7 * gap + dur;
    return run.tween(total, (p) => { const t = p * total;
      w.letters.forEach((q, i) => { const k = clamp((t - delay - i * gap) / dur); q.o = E.out3(clamp(k * 1.7)); q.x = from.x * (1 - E.out5(k)); q.b = from.b * (1 - E.out3(clamp(k * 1.4))); }); });
  }
  // one soft beat of the centred dot: it swells and settles, and a faint ring goes out from it
  function beat(run, m, rip) {
    run.tween(380, (t) => { m.dotScale = 1 + .3 * Math.sin(Math.PI * E.out3(t)); });
    run.tween(900, (t) => { const r0 = DOT * m.k; rip.r = lerp(r0 * 1.1, r0 * 4.2, E.out4(t)); rip.w = 1.8 * (1 - t); rip.o = .3 * (1 - E.out3(t)); });
  }
  // the double beat, every second, until the given time
  async function pulses(run, m, rips, from, until) {
    for (let n = 0; ; n += 1) {
      for (const off of [0, T.beatGap]) {
        const at = from + n * T.beatEvery + off;
        if (at + 380 > until) return;
        await run.until(at);
        beat(run, m, rips[(n * 2 + (off ? 1 : 0)) % rips.length]);
      }
    }
  }

  /* ---------- the stages of one run ---------- */
  async function animate(card) {
    const {run, st, theme} = card;
    // 0. blank: the screen stays empty for half a second
    card.stage("blank");
    await run.wait(T.blank);
    const m = st.add(new Mark(st.svg, theme.fg));
    Object.assign(m, {len: 360, tail: -45, ringScale: .35, ringOpacity: 0, dotR: 0, dotScale: 0});
    const w = st.add(new Word(st.inner, theme.fg, L.F)); w.hide({});
    const rips = [st.add(new Ripple(st.svg, theme.fg)), st.add(new Ripple(st.svg, theme.fg)), st.add(new Ripple(st.svg, theme.fg))];
    // 1. entrance: the dot pops at the centre, the full ring grows round it and stays; the dot pulses for about 2 s
    card.stage("entrance");
    const e0 = vt;
    run.tween(720, (t) => { m.dotScale = SPR.pop(t); });
    run.tween(950, (t) => { const r0 = DOT * m.k, rip = rips[2]; rip.r = lerp(r0, r0 * 6.5, E.out4(t)); rip.w = 2.4 * (1 - t); rip.o = .45 * (1 - E.out3(t)); });
    run.wait(170).then(() => run.tween(1050, (t) => { m.ringScale = lerp(.35, 1, SPR.soft(t)); m.ringOpacity = E.out3(clamp(t * 2.5)); }));
    await pulses(run, m, rips.slice(0, 2), e0 + T.pulseFrom, e0 + T.pulseUntil);
    await run.until(e0 + T.pulseUntil);
    m.dotScale = 1;
    // the gap opens and the dot moves out to the ring
    run.tween(860, (t) => { const g = 60 * E.inOut4(t); m.len = 360 - g; m.tail = -45 + g / 2; m.dotR = R * SPR.soft(clamp((t - .06) / .94)); });
    await run.wait(240);
    // 2. loading: at least two full turns, at least the demo hold, and until the first request has loaded
    card.stage("loading");
    await rotate(run, (spun) => m.rot >= T.turns && spun >= card.hold && card.ready(), {get: () => m.rot, set: (a) => { m.rot = a; }, speed: ramp(.62, 950), align: 0, decel: 1200, lead: 420});
    // 3. end: from here nothing stops it
    card.stage("ending");
    card.status.style.opacity = 0;
    const x0 = m.x;
    const letters = stagger(run, w, {delay: 200, gap: 36, dur: 820, from: {x: -.5, b: .09}});
    await run.tween(1050, (t) => { m.x = lerp(x0, L.markX, E.inOut4(t)); w.maskL = (m.x + L.D / 2 + L.gap * .12) - w.x; });
    await letters; w.maskL = null; run.render();
    await run.wait(T.lockupHold);
    // 4. reveal: the cover fades over Home
    card.stage("reveal");
    await run.tween(T.fade, (t) => { card.cover.style.opacity = 1 - E.out3(t); });
    card.finish();
  }
  async function reduced(card) {
    const {run, st, theme} = card;
    card.stage("blank");
    await run.wait(T.blank);
    const m = st.add(new Mark(st.svg, theme.fg)); m.x = L.markX;
    st.add(new Word(st.inner, theme.fg, L.F));
    run.render(); card.stage("loading");
    requestAnimationFrame(() => card.cover.classList.add("ajs-in"));
    const t0 = vt;
    while (!(card.ready() && vt - t0 >= Math.max(600, card.hold))) await run.frame();
    card.stage("reveal");
    await run.tween(T.fade, (t) => { card.cover.style.opacity = 1 - E.out3(t); });
    card.finish();
  }

  /* ---------- measuring the word, once its font is in ---------- */
  let M = null, L = null, measuring = null;
  async function measure() {
    try { await Promise.race([document.fonts.load('500 100px "Space Grotesk"'), new Promise((r) => setTimeout(r, 2500))]); } catch (e) {}
    const box = document.createElement("div"); box.className = "ajs-word"; box.style.cssText = "left:-9999px;top:0;font-size:100px;visibility:hidden";
    const spans = [..."ajournal"].map((ch) => { const s = document.createElement("span"); s.textContent = ch; box.appendChild(s); return s; });
    const mk = document.createElement("span"); mk.style.cssText = "display:inline-block;width:0;height:0;vertical-align:baseline"; box.appendChild(mk);
    document.body.appendChild(box);
    const br = box.getBoundingClientRect(), w = (spans[7].getBoundingClientRect().right - br.left) / 100, base = (mk.getBoundingClientRect().top - br.top) / 100;
    box.remove();
    const c = document.createElement("canvas"); c.width = c.height = 400; const x = c.getContext("2d", {willReadFrequently: true});
    x.font = '500 200px "Space Grotesk"'; x.fillText("x", 100, 300);
    const d = x.getImageData(0, 0, 400, 400).data; let top = 400;
    for (let j = 0; j < 400 && top === 400; j++) for (let i = 0; i < 400; i++) if (d[(j * 400 + i) * 4 + 3] > 110) { top = j; break; }
    M = {w, base, xh: (300 - top) / 200};
    const D = 96, W = 4.21 * D, F = W / M.w, gap = .62 * D, tot = D + gap + W;
    L = {D, F, gap, markX: 500 - tot / 2 + D / 2, wordX: 500 - tot / 2 + D + gap, base: CY + M.xh * F / 2};
  }
  const measured = () => (measuring ||= new Promise((r) => { const go = () => measure().then(r); document.body ? go() : document.addEventListener("DOMContentLoaded", go); }));
  // the tab is in view: visible, not in the background
  const inView = () => new Promise((r) => { if (document.visibilityState === "visible") { r(); return; } const on = () => { if (document.visibilityState !== "visible") return; document.removeEventListener("visibilitychange", on); r(); }; document.addEventListener("visibilitychange", on); });

  const themeOf = (name) => THEMES[name] || (matchMedia("(prefers-color-scheme: light)").matches ? THEMES.light : THEMES.dark);
  function cover(host, theme, still) {
    const el = document.createElement("div");
    el.className = "ajs-cover" + (still ? " ajs-still" : "");
    el.style.background = theme.bg;
    el.setAttribute("role", "status"); el.setAttribute("aria-label", "Starting the journal");
    const box = document.createElement("div"); box.className = "ajs-box";
    const inner = document.createElement("div"); inner.className = "ajs-inner";
    box.appendChild(inner); el.appendChild(box);
    const status = document.createElement("div"); status.className = "ajs-status"; status.style.color = theme.fg; status.textContent = "Starting the journal…";
    inner.appendChild(status);
    host.appendChild(el);
    return {el, inner, status};
  }

  /* ---------- play: the empty cover at once; the animation once the tab is in view and the word is measured ---------- */
  function play({theme: name, load = 2500, hand = false, hold = T.hold, appReady = () => true, onStage = () => {}, onEnd = () => {}} = {}) {
    const theme = themeOf(name);
    const host = document.body || document.documentElement;
    const {el, inner, status} = cover(host, theme, false);
    const opened = performance.now();
    const card = {theme, inner, cover: el, status, run: null, st: null, readyAt: null, done: false, hold,
      ready() { return appReady() && (hand ? card.readyAt !== null : performance.now() - opened >= load); },
      clock() { if (!card.done && !card.ready() && performance.now() - opened >= T.slow) status.style.opacity = .55; },
      stage(s) { el.dataset.stage = s; onStage(s); },
      finish() { card.done = true; live.delete(card); if (card.run) card.run.dead = true; el.remove(); onEnd(); },
    };
    if (hand) {
      el.classList.add("ajs-hand");
      const done = () => { if (card.readyAt === null) card.readyAt = performance.now(); };
      el.addEventListener("click", done);
      addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") done(); });
    }
    const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (still) el.classList.add("ajs-reduced");
    live.add(card); startClock();
    Promise.all([measured(), inView()]).then(() => { card.st = new Stage(inner); card.run = new Run(card.st); (still ? reduced : animate)(card); });
    return card;
  }

  /* ---------- a still frame of one stage, for the stages page ---------- */
  async function frame(host, name, stage) {
    const theme = themeOf(name);
    const {el, inner} = cover(host, theme, true);
    await measured();
    if (stage === "blank") return el;
    const st = new Stage(inner);
    const m = st.add(new Mark(st.svg, theme.fg));
    if (stage === "entrance") {
      Object.assign(m, {len: 360, tail: -45, ringScale: 1, ringOpacity: 1, dotR: 0, dotScale: 1.22});
      const rip = st.add(new Ripple(st.svg, theme.fg)); const r0 = DOT * m.k; Object.assign(rip, {r: r0 * 2.6, w: 1.1, o: .2});
    } else if (stage === "loading") { Object.assign(m, {len: 300, tail: -15, dotR: R, dotScale: 1, rot: 128}); m._s = 1.28; }
    else {
      const w = st.add(new Word(inner, theme.fg, L.F));
      if (stage === "ending") {
        m.x = lerp(500, L.markX, .62); m.rot = 0;
        w.letters.forEach((q, i) => { const k = clamp(1.25 - i * .17); q.o = E.out3(clamp(k * 1.7)); q.x = -.5 * (1 - E.out5(k)); q.b = .09 * (1 - E.out3(clamp(k * 1.4))); });
        w.maskL = (m.x + L.D / 2 + L.gap * .12) - w.x;
      } else { m.x = L.markX; el.style.opacity = .42; }
    }
    st.draw(0);
    return el;
  }

  /* ---------- on every open of the viewer: the cover shows at once and Home is the page under it ---------- */
  function settings() {
    const q = new URLSearchParams(location.search);
    const load = q.get("load"), hold = q.get("hold");
    return {theme: q.get("theme") || undefined, hand: load === "hand", load: load && load !== "hand" ? Number(load) : 2500, hold: hold != null ? Number(hold) : T.hold,
      appReady: () => (document.getElementById("root")?.childElementCount || 0) > 0};
  }
  window.AJSplash = {play, frame, replay: (o) => play({...settings(), ...o}), timing: T};
  const me = document.currentScript;
  if (me && me.dataset.autoplay !== "false" && new URLSearchParams(location.search).get("splash") !== "off") {
    try { localStorage.setItem("v5.page", "home"); } catch (e) {}
    play(settings());
  }
})();
