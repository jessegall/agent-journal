// Round fifteen (message 121280; critiques doc 1283, doc 1284, report 1408), with the round-seventeen corrections. Loaded after round fourteen.
// Replaces by name: Icon, Menu, FloatMenu, MenuItem, ActionMenu, R14Off, R14AgentActions, HomeAgentBar,
// R8Dot, R8Card, R8TaskLine, R13Sandbox, R13Message, QuestionCard. Sets NOW_WINDOWS.chat.
// 1. Current app parts are copies: the icons are kit/Icon.vue's shapes, the tooltip is the app's (kit/tip.js: below, centred, flips above, 9 px gap,
//    8 px from the window edge) in place of the native title, menus are MenuPanel and MenuItem, the question block is QuestionCard flush.
// 2. Every dropdown floats and flips (FloatMenu); nothing a scroll box holds can clip it.
// 3. Words are written where they are used: short nouns and plain words. Nothing rewrites a word at run time; a sentence label is a bug.

/* ---------- 1. icons: kit/Icon.vue, copied ---------- */
const R15_SHAPES = {
  agent: '<circle cx="8" cy="5.3" r="2.5"/><path d="M3 13.5c0-2.8 2.2-4.6 5-4.6s5 1.8 5 4.6"/>',
  time: '<circle cx="8" cy="8" r="5.5"/><path d="M8 4.5V8l2.4 1.5"/>',
  allowance: '<path d="M3 4.5h10v7H3zM5 6.5h1M10 9.5h1"/><circle cx="8" cy="8" r="1.4"/>',
  phone: '<rect x="4.5" y="1.5" width="7" height="13" rx="1.6"/><path d="M7 12.2h2"/>',
  key: '<circle cx="5.5" cy="10.5" r="2.8"/><path d="M7.5 8.5 13 3M10.8 5.2l1.7 1.7M9.2 6.8l1.2 1.2"/>',
  terminal: '<path d="M2 3.5h12v9H2zM4.8 6.4 6.9 8l-2.1 1.6M8.4 10h3"/>',
  trash: '<path d="M3 4.5h10M6.4 4.5V3h3.2v1.5M4.4 4.5l.7 8.5h5.8l.7-8.5"/>',
  chat: '<path d="M2.5 3h11v7.5H8L5 13v-2.5H2.5z"/>',
  gauge: '<path d="M2.6 11.5a5.4 5.4 0 1 1 10.8 0"/><path d="M8 11.5 10.4 7.4"/><circle cx="8" cy="11.5" r=".6" fill="currentColor"/>',
  hook: '<path d="M8 2v7.6a2.9 2.9 0 1 1-2.9-2.9"/><circle cx="8" cy="2.6" r=".7" fill="currentColor"/>',
  heart: '<path d="M8 13.2 3.2 8.4a2.9 2.9 0 0 1 4.1-4.1L8 5l.7-.7a2.9 2.9 0 0 1 4.1 4.1z"/>',
  weight: '<path d="M2.5 13.5h11l-1.6-7.5H4.1zM6 6a2 2 0 1 1 4 0"/>',
  points: '<path d="M3 13.2V8.6M6.7 13.2V5.4M10.4 13.2V9.8M14 13.2V2.8" stroke-linecap="round"/>',
  bolt: '<path d="M9.2 2 4.2 8.8h3.6L6.8 14l5-6.8H8.2z"/>',
  bulb: '<path d="M5.4 9.9a4.3 4.3 0 1 1 5.2 0c-.45.35-.7.85-.7 1.4v.2H6.1v-.2c0-.55-.25-1.05-.7-1.4Z"/><path d="M6.3 13.5h3.4"/>',
  todos: '<circle cx="8" cy="8" r="5.75"/><path d="M5.6 8.1l1.7 1.7 3.2-3.5"/>',
  task: '<rect x="3.5" y="2.5" width="9" height="11.5" rx="1.4"/><path d="M6.2 2.5V1.6h3.6v.9M5.8 6.4h4.4M5.8 8.9h4.4M5.8 11.4h2.6"/>',
  pins: '<path d="M8 14V9.5M5 2.5h6M6 2.5v3.5L4 9.5h8L10 6V2.5"/>',
  style: '<path d="M5.5 4.5 2.5 8l3 3.5M10.5 4.5l3 3.5-3 3.5M9 3.5l-2 9"/>',
  warn: '<path d="M8 2.6 14 13H2zM8 6.6v3.2M8 11.6v.1"/>',
  book: '<path d="M8 4.4c-1.7-1.2-3.8-1.5-6-.9v9c2.2-.6 4.3-.3 6 .9 1.7-1.2 3.8-1.5 6-.9v-9c-2.2-.6-4.3-.3-6 .9Z"/><path d="M8 4.4v9"/>',
  branch: '<circle cx="5" cy="3.6" r="1.6"/><circle cx="5" cy="12.4" r="1.6"/><circle cx="11.6" cy="5.4" r="1.6"/><path d="M5 5.2v5.6M11.6 7v.6a3.6 3.6 0 0 1-3.6 3.6H6.6"/>',
  wide: '<path d="M6.2 2.6H2.6v3.6M9.8 2.6h3.6v3.6M6.2 13.4H2.6V9.8M9.8 13.4h3.6V9.8"/>',
  up: '<path d="M8 12.5V4M4.5 7.5L8 4l3.5 3.5"/>',
  down: '<path d="M8 3.5V12M4.5 8.5L8 12l3.5-3.5"/>',
  board: '<rect x="1.8" y="2.5" width="12.4" height="11" rx="2"/><rect x="3.6" y="4.4" width="2.4" height="4" rx=".5" fill="currentColor" stroke="none"/><rect x="3.6" y="9.4" width="2.4" height="2.2" rx=".5" fill="currentColor" stroke="none"/><rect x="6.8" y="4.4" width="2.4" height="5.6" rx=".5" fill="currentColor" stroke="none"/><rect x="10" y="4.4" width="2.4" height="2.4" rx=".5" fill="currentColor" stroke="none"/><rect x="10" y="7.8" width="2.4" height="3.2" rx=".5" fill="currentColor" stroke="none"/>',
  open: '<path d="M9 3.5h3.5V7"/><path d="M12.5 3.5L7.5 8.5"/><path d="M11 9.5v3H3.5V5h3"/>',
  sidepanel: '<rect x="2.5" y="3" width="11" height="10" rx="1.5"/><path d="M9.5 3v10"/>',
  tab: '<path d="M2.5 5.5h11V13h-11zM2.5 5.5V3h5v2.5"/>',
  chapters: '<path d="M2.5 4h6M2.5 8h11M2.5 12h8"/><path d="M11 2.2v3.6l1.2-.9 1.2.9V2.2"/>',
  reply: '<path d="M6.5 4.2 3 7.6l3.5 3.4"/><path d="M3.4 7.6h5.4a4 4 0 0 1 4 4v1.2"/>',
  copy: '<rect x="5.5" y="5.5" width="8" height="8" rx="1.6"/><path d="M10.5 3.8V3.6A1.6 1.6 0 0 0 8.9 2H4.1A1.6 1.6 0 0 0 2.5 3.6v4.8A1.6 1.6 0 0 0 4.1 10h.2"/>',
  pull: '<circle cx="4.5" cy="3.8" r="1.5"/><circle cx="4.5" cy="12.2" r="1.5"/><circle cx="11.5" cy="12.2" r="1.5"/><path d="M4.5 5.3v5.4M11.5 10.7V7.2a2.2 2.2 0 0 0-2.2-2.2H7.4M8.8 3.4 7.2 5l1.6 1.6"/>',
  restore: '<path d="M3 8a5 5 0 1 0 1.5-3.55"/><path d="M3 2.75V5h2.25"/>',
  caret: '<path d="M5 6.5l3 3 3-3"/>',
  share: '<path d="M5.5 6H4.5A1.5 1.5 0 0 0 3 7.5v5A1.5 1.5 0 0 0 4.5 14h7a1.5 1.5 0 0 0 1.5-1.5v-5A1.5 1.5 0 0 0 11.5 6h-1"/><path d="M8 9.5V2M5.75 4.25L8 2l2.25 2.25"/>',
  tiles: '<rect x="2.5" y="2.5" width="4.5" height="4.5" rx="1"/><rect x="9" y="2.5" width="4.5" height="4.5" rx="1"/><rect x="2.5" y="9" width="4.5" height="4.5" rx="1"/><rect x="9" y="9" width="4.5" height="4.5" rx="1"/>',
  pause: '<path d="M5.8 4v8M10.2 4v8"/>',
  stop: '<path d="M4.5 4.5h7v7h-7z"/>',
  resume: '<path d="M5.5 3.8v8.4L12.2 8z"/>',
  tick: '<path d="M3.8 8.3l2.6 2.6 5.8-6.1"/>',
  layout: '<rect x="2.5" y="3" width="11" height="10" rx="1.5"/><path d="M9 3v10M9 8h4.5"/>',
  info: '<circle cx="8" cy="8" r="5.75"/><path d="M8 7.3v3.4"/><path d="M8 5.1v.1"/>',
  bell: '<path d="M4.5 11V7.5a3.5 3.5 0 0 1 7 0V11l1 1.5h-9z"/><path d="M6.8 13.5a1.3 1.3 0 0 0 2.4 0"/>',
  activity: '<rect x="2.5" y="3" width="11" height="10" rx="1.5"/><path d="M9.5 3v10M11 6h1M11 8.5h1"/>',
  arrow: '<path d="M3.5 8h9M9 4.5L12.5 8 9 11.5"/>',
  chevronRight: '<path d="M6 3 11 8 6 13"/>',
  back: '<path d="M12.5 8h-9M7 4.5L3.5 8 7 11.5"/>',
  paperclip: '<path d="M10.5 5.5l-4.3 4.3a1.3 1.3 0 0 0 1.8 1.8l4.6-4.6a2.6 2.6 0 0 0-3.7-3.7L4.3 8a3.9 3.9 0 0 0 5.5 5.5l3.7-3.7"/>',
  crosshair: '<circle cx="8" cy="8" r="4.2"/><path d="M8 1.5v3M8 11.5v3M1.5 8h3M11.5 8h3"/>',
  model: '<path d="M8 2.2c.5 2.9 2 4.4 4.9 4.9-2.9.5-4.4 2-4.9 4.9-.5-2.9-2-4.4-4.9-4.9 2.9-.5 4.4-2 4.9-4.9z"/><path d="M12.6 10.6c.2 1.1.8 1.7 1.9 1.9-1.1.2-1.7.8-1.9 1.9-.2-1.1-.8-1.7-1.9-1.9 1.1-.2 1.7-.8 1.9-1.9z"/>',
  agents: '<circle cx="6" cy="5.5" r="2"/><path d="M2.5 13a3.5 3.5 0 0 1 7 0"/><path d="M10.5 3.8a2 2 0 0 1 0 3.4"/><path d="M11.5 9.8a3.5 3.5 0 0 1 2 3.2"/>',
  reports: '<path d="M4 2.5h5.5L12 5v8.5H4z"/><path d="M6.5 8h3M6.5 10.5h3"/>',
  work: '<circle cx="8" cy="8" r="5.5"/><path d="M8 5v3l2 1.5"/>',
  reminders: '<path d="M13 8a5 5 0 1 1-1.5-3.55"/><path d="M13 2.75V5h-2.25"/><path d="M8 5.5V8l1.75 1.25"/>',
  pencil: '<path d="M10.6 2.8l2.6 2.6-7.4 7.4-3.3.7.7-3.3z"/><path d="M9.2 4.2l2.6 2.6"/>',
  docs: '<path d="M4 1.8h5.5L12.5 5v9.2H4V1.8Z"/><path d="M9.5 1.8V5h3"/>',
  rules: '<path d="M3 3.5h10M3 8h10M3 12.5h6"/>',
  folder: '<path d="M2.5 3h4l1.5 1.5h5.5v8.5h-11V3Z"/>',
  inbox: '<path d="M2 9.5l1.8-6h8.4l1.8 6v3.5H2V9.5Z"/><path d="M2 9.5h3.5l1 1.5h3l1-1.5H14"/>',
  questions: '<circle cx="8" cy="8" r="5.5"/><path d="M6.4 6.3a1.7 1.7 0 0 1 3.2.7c0 1.2-1.6 1.4-1.6 2.5"/><circle cx="8" cy="11.4" r=".6" fill="currentColor" stroke="none"/>',
  home: '<path d="M2.5 7.5L8 2.75l5.5 4.75v6.25h-3.75v-4h-3.5v4H2.5V7.5Z"/>',
  close: '<path d="M4 4l8 8M12 4l-8 8"/>',
  plus: '<path d="M8 3.5v9M3.5 8h9"/>',
  power: '<path d="M8 2v6"/><path d="M4.5 4.2a5 5 0 1 0 7 0"/>',
  people: '<circle cx="6" cy="5.5" r="2.2"/><path d="M2.2 13c.4-2.2 1.9-3.5 3.8-3.5s3.4 1.3 3.8 3.5"/><circle cx="11.2" cy="6" r="1.8"/><path d="M11 9.6c1.6 0 2.8 1.1 3.1 3"/>',
  lock: '<rect x="3.5" y="7" width="9" height="6.5" rx="1.5"/><path d="M5.5 7V5a2.5 2.5 0 0 1 5 0v2"/>',
  plug: '<path d="M5.2 2.2v3.2M8.8 2.2v3.2M3.4 5.4h7.2v2.1a3.6 3.6 0 0 1-3.6 3.6 3.6 3.6 0 0 1-3.6-3.6Z"/><path d="M7 11.3v2.5"/>',
  tools: '<path d="M9.8 2.3a3 3 0 0 0-3.6 3.9L2.5 9.9a1.2 1.2 0 0 0 1.7 1.7l3.7-3.7a3 3 0 0 0 3.9-3.6L10 6 8.6 5.4 8 4l1.8-1.7Z"/>',
  plan: '<path d="M4 14V2.5M4 3h7.5l-1.5 2.75 1.5 2.75H4"/>',
  search: '<circle cx="7" cy="7" r="4.25"/><path d="M10.25 10.25L13.5 13.5"/>',
  settings: '<circle cx="8" cy="8" r="2"/><path d="M8 1.75v1.5M8 12.75v1.5M1.75 8h1.5M12.75 8h1.5M3.6 3.6l1.05 1.05M11.35 11.35l1.05 1.05M3.6 12.4l1.05-1.05M11.35 4.65l1.05-1.05"/>',
  smile: '<circle cx="8" cy="8" r="5.5"/><path d="M5.8 9.5c1.2 1.2 3.2 1.2 4.4 0M6.2 6.5h.01M9.8 6.5h.01"/>',
  dots: '<path d="M4 8h.01M8 8h.01M12 8h.01"/>',
  eye: '<path d="M1.9 8c1.5-2.6 3.5-3.9 6.1-3.9s4.6 1.3 6.1 3.9c-1.5 2.6-3.5 3.9-6.1 3.9S3.4 10.6 1.9 8Z"/><circle cx="8" cy="8" r="1.8"/>',
  dot: '<circle cx="8" cy="8" r="2.5"/>',
  start: '<path d="M5.5 3.8v8.4L12 8z" stroke-linejoin="round"/>',
  loop: '<path d="M12.6 6.2A4.9 4.9 0 0 0 3.4 6M3.4 9.8a4.9 4.9 0 0 0 9.2.2"/><path d="M12.8 3v3.3H9.5M3.2 13V9.7h3.3"/>',
};
// the app's own aliases (Icon.vue), then the prototype's older names mapped onto the app's shapes
const R15_ALIAS = {
  mail: "inbox", circle: "todos", flag: "plan", report: "reports", help: "questions", bubble: "inbox", wrench: "tools", brush: "style", band: "rules",
  bot: "agents", panel: "activity", x: "close", check: "todos", clip: "paperclip", send: "arrow", more: "dots", chevron: "arrow", list: "rules", clock: "reminders", pin: "pins",
  term: "terminal", doc: "docs", file: "docs", folderOpen: "folder", git: "pull", skill: "book", brain: "bulb", rule: "rules", gear: "settings", template: "tiles",
  seq: "loop", team: "people", chart: "points", log: "chapters", grid: "tiles", fwd: "arrow", right: "chevronRight", play: "start", user: "agent", edit: "pencil",
  tool: "tools", sidebar: "sidepanel", widget: "board", alert: "warn", target: "crosshair", kit: "tiles", coin: "allowance", down: "caret",
};
function Icon({name, size = 14, style}) {
  const shape = R15_SHAPES[R15_ALIAS[name] || name];
  const svg = {width: size, height: size, viewBox: "0 0 16 16", fill: "none", stroke: "currentColor", strokeWidth: "1.4", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true"};
  return <span className="ico" style={style}>{shape ? <svg {...svg} dangerouslySetInnerHTML={{__html: shape}} /> : <svg {...svg}><path d={ICONS[name] || ICONS.doc} /></svg>}</span>;
}

/* ---------- the app's tooltip (kit/tip.js) in place of every native title ---------- */
const R15_TIP = {el: null, timer: 0, target: null};
function r15TipLayer() {
  if (R15_TIP.el) return R15_TIP.el;
  const el = document.createElement("div");
  el.id = "kit-tooltip"; el.className = "r15-tip"; el.setAttribute("role", "tooltip");
  document.body.appendChild(el);
  R15_TIP.el = el;
  return el;
}
function r15Tipped(node) {
  if (!(node instanceof Element)) return null;
  const el = node.closest("[title], [data-tip]");
  if (!el) return null;
  if (el.hasAttribute("title")) {
    const words = el.getAttribute("title");
    el.removeAttribute("title");
    if (words) el.setAttribute("data-tip", words); else el.removeAttribute("data-tip");
    if (words && !el.hasAttribute("aria-label") && !el.textContent.trim()) el.setAttribute("aria-label", words);
  }
  return el.getAttribute("data-tip") ? el : null;
}
function r15TipShow(target) {
  if (!target.isConnected) return;
  const el = r15TipLayer();
  el.textContent = target.getAttribute("data-tip");
  el.classList.add("on");
  const r = target.getBoundingClientRect();
  const w = el.offsetWidth, h = el.offsetHeight;
  const below = r.bottom + 9 + h <= window.innerHeight - 8;
  const x = Math.min(Math.max(r.left + r.width / 2 - w / 2, 8), window.innerWidth - 8 - w);
  el.style.left = `${x}px`;
  el.style.top = `${below ? r.bottom + 9 : r.top - 9 - h}px`;
  el.dataset.side = below ? "below" : "above";
  el.style.setProperty("--arrow", `${Math.min(Math.max(r.left + r.width / 2 - x, 10), w - 10)}px`);
  target.setAttribute("aria-describedby", "kit-tooltip");
  R15_TIP.target = target;
}
function r15TipHide() {
  clearTimeout(R15_TIP.timer);
  R15_TIP.target?.removeAttribute("aria-describedby");
  R15_TIP.target = null;
  R15_TIP.el?.classList.remove("on");
}

// a band that scrolls sideways fades at its right edge while more lies past it
function r15Fades() {
  document.querySelectorAll(".insp-bar .now-info.card, .r8-band .now-info.card").forEach((b) => b.classList.toggle("r15-more", b.scrollWidth - b.scrollLeft - b.clientWidth > 2));
}
if (!window.__r15) {
  window.__r15 = true;
  document.addEventListener("mouseover", (e) => { const el = r15Tipped(e.target); if (el === R15_TIP.target) return; r15TipHide(); if (el) R15_TIP.timer = setTimeout(() => r15TipShow(el), 350); });
  document.addEventListener("focusin", (e) => { const el = r15Tipped(e.target); r15TipHide(); if (el && el.matches(":focus-visible")) r15TipShow(el); });
  document.addEventListener("focusout", r15TipHide);
  document.addEventListener("mousedown", r15TipHide);
  window.addEventListener("scroll", () => { r15TipHide(); r15Fades(); }, true);
  window.addEventListener("resize", r15Fades);
  let queued = false;
  new MutationObserver(() => { if (!queued) { queued = true; requestAnimationFrame(() => { queued = false; r15Fades(); }); } }).observe(document.body, {childList: true, subtree: true});
}

/* ---------- 2. every dropdown floats, flips above when there is no room below, and follows its button ---------- */
function FloatMenu({button, children, align = "left", width}) {
  const [open, setOpen] = useState(false);
  const [at, setAt] = useState(null);
  const anchor = useRef(null);
  const panel = useRef(null);
  const close = (back) => { setOpen(false); setAt(null); if (back) anchor.current?.querySelector("button, [tabindex]")?.focus(); };
  useLayer(open, () => close(true));
  const place = () => {
    const a = anchor.current, p = panel.current;
    if (!a || !p) return;
    const r = a.getBoundingClientRect();
    if (r.bottom < 0 || r.top > window.innerHeight) { close(); return; }
    const w = p.offsetWidth, h = p.scrollHeight;
    const below = window.innerHeight - r.bottom - 12, above = r.top - 12;
    const up = h > below && above > below;
    const left = align === "left" ? r.left : r.right - w;
    const max = Math.max(120, up ? above : below);
    setAt({left: Math.max(8, Math.min(left, window.innerWidth - w - 8)), top: up ? Math.max(8, r.top - 4 - Math.min(h, max)) : r.bottom + 4, max, up});
  };
  React.useLayoutEffect(() => { if (open) place(); }, [open]);
  useEffect(() => {
    if (!open) return;
    const down = (e) => { if (anchor.current?.contains(e.target) || panel.current?.contains(e.target)) return; close(); };
    const moved = (e) => { if (panel.current?.contains(e.target)) return; place(); };
    const grown = new ResizeObserver(() => place());
    if (panel.current) grown.observe(panel.current);
    document.addEventListener("mousedown", down);
    window.addEventListener("scroll", moved, true);
    window.addEventListener("resize", place);
    return () => { grown.disconnect(); document.removeEventListener("mousedown", down); window.removeEventListener("scroll", moved, true); window.removeEventListener("resize", place); };
  }, [open]);
  const keys = (e) => {
    const items = [...panel.current.querySelectorAll('[role^="menuitem"]:not([aria-disabled="true"])')];
    const i = items.indexOf(document.activeElement);
    const to = {ArrowDown: i + 1, ArrowUp: i - 1, Home: 0, End: items.length - 1}[e.key];
    if (to == null || !items.length) return;
    e.preventDefault();
    items[(to + items.length) % items.length].focus();
  };
  const toggle = () => (open ? close() : setOpen(true));
  return <span className="r14-anchor" ref={anchor}>
    {button({open, toggle})}
    {open && ReactDOM.createPortal(<div ref={panel} role="menu" className={"menu r14-float" + (at?.up ? " up" : "") + (align === "left" ? " left" : "")} onKeyDown={keys}
      style={{left: at?.left ?? 0, top: at?.top ?? 0, width, maxHeight: at?.max, visibility: at ? "visible" : "hidden"}}>{typeof children === "function" ? children(() => close()) : children}</div>, document.body)}
  </span>;
}
function Menu({button, children, align = "right", width}) { return <FloatMenu button={button} align={align} width={width}>{children}</FloatMenu>; }

// MenuItem as the app's: icon or none, the word, a line under it (a command or a few words); an action that cannot run is greyed and says why
function MenuItem({icon, check, children, desc, hint, danger, onClick, off}) {
  const slot = check !== undefined ? <span className="slot">{check && <Icon name="tick" size={12} />}</span> : icon && <span className="slot"><Icon name={icon} size={13} /></span>;
  return <button type="button" role={check !== undefined ? "menuitemcheckbox" : "menuitem"} aria-checked={check} aria-disabled={off ? "true" : undefined}
    className={"menu-item" + (danger ? " danger" : "") + (off ? " off" : "") + (desc ? " described" : "")} onClick={off ? (e) => e.preventDefault() : onClick}>
    {slot}<span className="grow menu-item-text"><span>{children}</span>{desc && <small className="desc">{desc}</small>}</span>{hint != null && <span className="hint">{hint}</span>}
  </button>;
}
function R14Off({icon, label, why}) { return <MenuItem icon={icon} off desc={why}>{label}</MenuItem>; }

/* ---------- one Actions list for an agent, the same in the open card and in the inspector ---------- */
const R15_DRIVERS = [["claude-opus", "Claude Code · Opus 5.5"], ["claude-sonnet", "Claude Code · Sonnet 5.5"], ["claude-haiku", "Claude Code · Haiku 5.5"], ["codex-gpt5", "Codex · GPT-5"]];
function R15History() { return <div className="r8-history">{R14_HISTORY.map(([s, at, how]) => <div key={s} className="r8-hrow r14-hrow"><span className="mono">{s}</span><span>{at}</span><span className="r8-faint">{how}</span></div>)}</div>; }
const r15AgentActions = (a, paused, setPaused) => {
  const gone = a.retired ? "Retired" : null;
  const stopped = gone || (a.ended ? "Process stopped" : null);
  const running = gone || (a.ended ? null : "Process running");
  const hold = gone || (a.dot === "waiting" && !a.wait ? null : a.wait ? "Waits on the queue" : "No hold");
  return [
    {group: "Session", label: paused ? "Resume" : "Pause", icon: paused ? "resume" : "pause", run: () => setPaused(!paused), done: paused ? "Resumed" : "Paused", off: stopped},
    {group: "Session", label: "Message", icon: "chat", field: {label: "Message"}, confirm: "Send", done: "Sent", off: stopped},
    {group: "Session", label: "Lift hold", icon: "start", done: "Hold lifted", off: hold},
    {group: "Session", label: "History", icon: "restore", panel: () => <R15History />},
    {group: "Work", label: "Send job", icon: "task", field: {label: "Job"}, confirm: "Send", done: "Job sent", off: running},
    {group: "Work", label: "Driver", icon: "model", field: {label: "Driver", options: R15_DRIVERS}, confirm: "Change", done: "Driver changed", off: running},
    ...CONTEXT_ACTIONS("agent", a.id),
    {group: "Danger", label: "Stop", icon: "stop", danger: true, field: {label: "Reason"}, confirm: "Stop", done: "Stopped", off: stopped},
    {group: "Danger", label: "Retire", icon: "trash", danger: true, field: {label: "Reason"}, confirm: "Retire", done: "Retired", off: running},
  ];
};

// ActionMenu: floats; an action may ask one field, show one panel, or be greyed with its reason
function ActionMenu({actions, label = "Actions", onDone}) {
  const [asking, setAsking] = useState(null);
  const [value, setValue] = useState("");
  const [refusal, setRefusal] = useState(null);
  const groups = [...new Set(actions.map((a) => a.group))];
  const optionsOf = (f) => f.kind === "agent" ? AGENTS.map((a) => [a.name, `${a.name} · ${a.role}`]) : f.options;
  const picks = (f) => Boolean(optionsOf(f));
  const reset = () => { setAsking(null); setRefusal(null); };
  const fire = (a, close) => { const why = a.run?.(value); if (typeof why === "string") { setRefusal({label: a.label, why}); if (!a.field) setAsking(null); return; } setRefusal(null); close(); if (why !== false) onDone?.(a.done || a.label); };
  const head = (a) => <div className="row"><Btn icon="back" small title="Back" onClick={reset} /><b className="r15-menu-head">{a.label}</b></div>;
  return <FloatMenu align="right" width={260} button={({toggle, open}) => <MenuButton label={label} open={open} onClick={() => { reset(); toggle(); }} />}>
    {(close) => asking?.panel ? <div className="menu-form">{head(asking)}{asking.panel()}</div>
      : asking ? <form className="menu-form" onSubmit={(e) => { e.preventDefault(); fire(asking, close); }}>
        {head(asking)}
        {picks(asking.field) ? <select aria-label={asking.field.label} value={value} onChange={(e) => setValue(e.target.value)}>{optionsOf(asking.field).map(([k, l]) => <option key={k} value={k}>{l}</option>)}</select>
          : <textarea autoFocus rows={3} aria-label={asking.field.label} placeholder={asking.field.label} value={value} onChange={(e) => setValue(e.target.value)} />}
        {refusal && <div className="refusal" role="alert"><Icon name="warn" size={12} /><span>{refusal.why}</span></div>}
        <div className="row" style={{justifyContent: "flex-end"}}><Btn small onClick={reset}>Back</Btn><Btn type="submit" small variant={asking.danger ? "danger" : "primary"} disabled={!picks(asking.field) && !value.trim()}>{asking.confirm || asking.label}</Btn></div>
      </form>
      : <>{refusal && <div className="menu-form"><div className="refusal" role="alert"><Icon name="warn" size={12} /><span><b>{refusal.label}</b>: {refusal.why}</span></div></div>}
        {groups.map((g, gi) => <React.Fragment key={g}>{gi > 0 && <div className="menu-sep" />}<div className="menu-label">{g}</div>
          {actions.filter((a) => a.group === g).map((a) => <MenuItem key={a.label} icon={a.icon} danger={a.danger} off={Boolean(a.off)} desc={a.off || a.desc} hint={a.field || a.panel ? "…" : a.hint}
            onClick={() => { if (a.panel) { setAsking(a); return; } if (a.field) { setValue(picks(a.field) ? (a.field.value ?? optionsOf(a.field)[0][0]) : (a.field.value ?? "")); setRefusal(null); setAsking(a); } else fire(a, close); }}>{a.label}</MenuItem>)}
        </React.Fragment>)}</>}
  </FloatMenu>;
}
function R14AgentActions({a}) {
  const toast = useToast();
  const [paused, setPaused] = useState(false);
  return <ActionMenu actions={r15AgentActions(a, paused, setPaused)} onDone={toast} />;
}

/* ---------- agents: the identity line says each thing once; sandbox off can be reached by keyboard; the status tip floats ---------- */
function R13Sandbox() { return <span className="r13-sandbox" tabIndex={0} role="img" aria-label="Sandbox off" title="Sandbox off"><Icon name="warn" size={12} /></span>; }
function R8Dot({a}) {
  const words = [a.doing, a.since, a.seen].join("\n");
  return <span className="r8-dot" data-state={a.dot} tabIndex={0} aria-label={words} title={words} onClick={(e) => e.stopPropagation()}><i /></span>;
}
// the third line of every agent row: plan and task (or a helper's job), then the rate and its bar for a worker; a dash when there is nothing
function R8TaskLine({a}) {
  const {open} = useOpen();
  const ts = r8TasksOf(a);
  const done = ts.filter((t) => t.state === "completed").length;
  const testing = ts.filter((t) => t.state === "testing").length;
  const go = (term, id) => (e) => { e.stopPropagation(); open(term, id); };
  if (a.job) return <span className="r8-task-line"><span className="r8-job" title={a.job}>{a.jobTitle}</span></span>;
  const t = TASKS.find((x) => x.id === a.task);
  return <span className="r8-task-line">
    {a.plan && <button type="button" className="r8-ref" title={PLANS.find((p) => p.id === a.plan)?.title} onClick={go("plan", a.plan)}>Plan {a.plan}</button>}
    {t && <button type="button" className="r8-ref quiet" title={t.title} onClick={go("task", t.id)}>Task {t.id}</button>}
    {!a.plan && !t && <span className="r8-faint">—</span>}
    <span className="grow" />
    {a.role !== "main" && <span className="r8-faint" title="Tasks an hour">{a.perHour}/h</span>}
    {a.role !== "main" && ts.length > 0 && <span className="r8-tbar" title={`${done} of ${ts.length} done`}><i style={{width: `${(done / ts.length) * 100}%`}} /><i className="testing" style={{width: `${(testing / ts.length) * 100}%`}} /></span>}
  </span>;
}
// the profile word only when the name does not already say it: Worker 4 has none, Main agent says builder, Helper 851 designer
const r15Role = (a) => (a.title.toLowerCase().includes(String(a.sub).toLowerCase()) ? "" : a.sub);
// every row is three lines: name (and profile), identity (with the unit when there is one), the task line; the whole row opens, no chevron
function R8Card({a, index, onOpen}) {
  return <div className={"r8-card" + (a.lingering ? " lingering" : "")} data-state={a.dot} role="button" tabIndex={0} onClick={() => onOpen(a)} onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), onOpen(a))}>
    <span className="r8-rail" aria-hidden="true" />
    <span className="r8-head"><span className="r8-title">{a.title}</span>{r15Role(a) && <span className="r8-sub">{r15Role(a)}</span>}</span>
    <span className="r8-line r13-line"><span className="r8-identity">{[a.program, a.model, a.effort, a.unit].filter(Boolean).join(" · ")}</span>{a.sandboxOff && <R13Sandbox />}</span>
    <R8TaskLine a={a} />
    <R8Dot a={a} />
  </div>;
}

/* ---------- the agent bar: AgentBar.vue (Plan is plain text), one process count with a tooltip that says what it counts ---------- */
function HomeAgentBar() {
  const {open} = useOpen();
  const [paused, setPaused] = useState(false);
  const t = TASKS.find((x) => x.id === AGENTS[0].task);
  const helpers = AGENTS.filter((a) => a.role !== "Main agent" && a.state !== "open");
  const running = Q9_RUNS.filter((r) => r.section === "running").length;
  const waiting = Q9_RUNS.filter((r) => r.section === "waiting").length;
  return <div className="now-agent" data-agent-bar>
    <span className={"now-dot " + (paused ? "paused" : "running")} />
    <strong>{paused ? "Paused" : "Working"}</strong>
    <button type="button" className="now-task" title={t.title} onClick={() => open("task", t.id)}>Task {t.id}: {t.title}</button>
    <span className="now-plan">Plan {t.plan}</span>
    <span className="grow" />
    <button type="button" className={"btn icon now-pause" + (paused ? " paused" : "")} aria-label={paused ? "Resume" : "Pause"} title={paused ? "Resume" : "Pause"} onClick={() => setPaused(!paused)}><Icon name={paused ? "resume" : "pause"} size={16} /></button>
    <span className="now-divider" />
    <button type="button" className="now-count" aria-label="Process queue" title={`Process queue · ${running} running · ${waiting} waiting`} onClick={() => q9OpenQueue(open)}><Icon name="term" size={12} />{running + waiting}</button>
    <FloatMenu align="right" width={280} button={({toggle}) => <button type="button" className="now-count" aria-label="Helpers" title="Helpers" onClick={toggle}><Icon name="agents" size={12} />{helpers.length}</button>}>{(close) => <>
      <div className="menu-label">Helpers</div>
      {helpers.map((a) => <MenuItem key={a.id} icon="agent" desc={a.task ? `Task ${a.task}` : a.role} hint={STATE_WORDS[a.state]} onClick={() => { open("agent", a.id); close(); }}>{a.name}</MenuItem>)}
    </>}</FloatMenu>
  </div>;
}

/* ---------- the chat: MessageCard.vue's comment head (bubble icon, the row's own lower-case name) and reaction count; it opens at the newest message ---------- */
function R13Message({r}) {
  const toast = useToast();
  const {open} = useOpen();
  const [picking, setPicking] = useState(false);
  const [copied, setCopied] = useState(false);
  const [mine, setMine] = useState(r.reactions || []);
  return <article className="message" data-from={r.me ? "user" : "agent"}>
    <div className="message-body">
      <div className={"message-card md" + (r.comment ? " comment" : "")}>
        {r.comment && <button type="button" className="message-comment-head" title={`${r.comment[0]} ${r.comment[1]}`} onClick={() => open(r.comment[0], r.comment[1])}><Icon name="bubble" size={12} /><span>Comment · {r.comment[0]} {r.comment[1]}</span></button>}
        {r.quote && <div className="message-quote">{r.quote}</div>}
        {r.worker && <button type="button" className="message-worker" onClick={() => open("agent", r.worker)}>Worker {r.worker}</button>}
        <R13Text text={r.text} />
        {r.card && <a className="row-card" href="#" onClick={(e) => { e.preventDefault(); open(r.card[0], r.card[1]); }}><span className="row-card-type">{TERM_WORDS[r.card[0]]} {r.card[1]}</span><span className="row-card-title">{r.card[2]}</span></a>}
      </div>
      <div className={"message-tools" + (picking ? " picking" : "")}>
        {picking ? <>
          <div className="message-faces">{["👍", "❤️", "😂", "🎉", "👀", "🙏"].map((f) => <button key={f} type="button" className="message-face" onClick={() => { setMine([...mine.filter((x) => x.e !== f), {e: f, mine: true}]); setPicking(false); }}>{f}</button>)}</div>
          <button type="button" className="message-tool" title="Cancel" onClick={() => setPicking(false)}><Icon name="close" size={11} /></button>
        </> : <>
          <button type="button" className="message-tool" onClick={() => setPicking(true)}>React</button>
          <button type="button" className="message-tool" onClick={() => toast("Replying")}>Reply</button>
          <button type="button" className="message-tool" onClick={() => { setCopied(true); setTimeout(() => setCopied(false), 1200); }}>{copied ? "Copied" : "Copy"}</button>
          {r.me && r.unread && <button type="button" className="message-tool">Delete</button>}
        </>}
      </div>
    </div>
    {mine.length > 0 && <div className="message-reactions">{mine.map((x) => <button key={x.e} type="button" className={"message-reaction" + (x.mine ? " mine" : "")}>{x.e}{x.count > 1 && <span className="message-reaction-count">{x.count}</span>}</button>)}</div>}
    <div className="message-foot">
      <time className="message-time">{r.at}</time>
      <span className="message-dot" aria-hidden="true">•</span>
      <span className="message-id">message {r.id}</span>
      {r.me && <span className={"read-ticks" + (r.unread ? " unread" : "")} title={r.unread ? "Delivered" : "Read"}><Icon name="tick" size={12} /><Icon name="tick" size={12} /></span>}
    </div>
  </article>;
}
const R15_REACTED = R13_ROWS.find((r) => r.id === 120141);
if (R15_REACTED) R15_REACTED.reactions = [{e: "👍", mine: true, count: 2}];
function R15Chat() {
  const box = useRef(null);
  React.useLayoutEffect(() => {
    const history = box.current?.querySelector(".history");
    if (!history) return;
    let atFoot = true;
    const toFoot = () => { if (atFoot) history.scrollTop = history.scrollHeight; };
    const watch = () => { atFoot = history.scrollHeight - history.scrollTop - history.clientHeight < 24; };
    toFoot();
    history.addEventListener("scroll", watch);
    const grown = new ResizeObserver(toFoot);
    grown.observe(history.firstElementChild);
    return () => { history.removeEventListener("scroll", watch); grown.disconnect(); };
  }, []);
  return <div className="r15-chat" ref={box}><R13Chat /></div>;
}
NOW_WINDOWS.chat = R15Chat;

/* ---------- questions in the chat: QuestionCard.vue flush and QuestionActions.vue, with the three asked changes (121164) ---------- */
// no state badge; an open question lightly highlighted; an answered one dimmed in colour, still readable
function QuestionCard({q}) {
  const {open} = useOpen();
  const toast = useToast();
  const [state, setState] = useState(q.state || "open");
  const [answer, setAnswer] = useState(q.answer || "");
  const [typed, setTyped] = useState("");
  const [elaborated, setElaborated] = useState(false);
  const settle = (text) => { setState("answered"); setAnswer(text); toast(`Question ${q.id} answered`); };
  return <section className="question flush" data-state={state} data-question-card>
    <header className="question-head"><i className="question-dot" /><p className="question-label">Question {q.id}</p><span className="question-time">{q.at}</span></header>
    <button type="button" className="question-open" onClick={() => open("question", q.id)}>{q.text}</button>
    {q.context && <p className="question-context">{q.context}</p>}
    {state !== "open" ? <p className="question-closed">{state === "answered" ? <><b className="question-answered">Answered:</b> <span className="question-answer">{answer}</span></> : "Closed"}</p> : <>
      <div className="question-options">{q.options.map((o) => <button key={o} type="button" className={"question-option" + (o === q.recommended ? " recommended" : "")} onClick={() => settle(o)}><i className="question-ring" /><span className="question-option-text">{o}</span>{o === q.recommended && <span className="question-chip">Recommended</span>}</button>)}</div>
      <form className="question-form" onSubmit={(e) => { e.preventDefault(); if (typed.trim()) settle(typed.trim()); }}>
        <input className="text-input question-input" value={typed} placeholder="Other" aria-label="Answer" onChange={(e) => setTyped(e.target.value)} />
        <span className="question-buttons">
          <Btn small onClick={() => { setState("closed"); toast(`Question ${q.id} closed`); }}>Close</Btn>
          <Btn small disabled={elaborated} onClick={() => { setElaborated(true); toast("Elaboration asked"); }}>{elaborated ? "Asked" : "Elaborate"}</Btn>
          <Btn variant="primary" small type="submit">Answer</Btn>
        </span>
      </form>
    </>}
  </section>;
}

/* ---------- pane tab counts read the rows, as the app's do ---------- */
NOW_COUNTS.questions = Q11_QUESTIONS.filter((q) => (q.state || "open") === "open").length;
NOW_COUNTS.tasks = TASKS.filter((t) => !["completed", "cancelled"].includes(t.state)).length;
NOW_COUNTS.plans = PLANS.filter((p) => !["completed", "cancelled"].includes(p.state)).length;
NOW_COUNTS.agents = R8_AGENTS.filter((a) => !a.ended).length;

Object.assign(window, {R15_SHAPES, R15_ALIAS, Icon, FloatMenu, Menu, MenuItem, R14Off, ActionMenu, R14AgentActions, R13Sandbox, R8Dot, R8TaskLine, R8Card, HomeAgentBar, R13Message, R15Chat, QuestionCard});
