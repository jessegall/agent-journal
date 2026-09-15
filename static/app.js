// The journal's browser renderer. Vue does the layout; the server only ever answers with
// JSON (see serve.py) — this file is the second renderer of that response, fmt.py the first.
"use strict";
const { createApp, reactive, computed, watch, watchEffect, onUnmounted, onMounted, ref } = Vue;

// ─────────────────────────────────────────────────────────────── a hash router
// A detail route renders the same view as its list, with the item open in the side panel.
const ROUTES = [
  { re: /^\/$/, view: "Home" },
  { re: /^\/env\/([a-z0-9-]+)$/, view: "EnvHome", params: ["env"] },
  { re: /^\/env\/([a-z0-9-]+)\/todos(\/archive)?(?:\/(\d+|new))?$/, view: "Todos", params: ["env", "archive", "n"] },
  { re: /^\/env\/([a-z0-9-]+)\/pins(\/archive)?(?:\/(\d+|new))?$/, view: "Pins", params: ["env", "archive", "n"] },
  { re: /^\/env\/([a-z0-9-]+)\/(?:messages|inbox)(\/archive)?(?:\/((?:[qs]\/)?\d+))?$/, view: "Inbox", params: ["env", "archive", "n"] },
  { re: /^\/env\/([a-z0-9-]+)\/questions(\/archive)?(?:\/(\d+))?$/, view: "Questions", params: ["env", "archive", "n"] },
  { re: /^\/env\/([a-z0-9-]+)\/reports(\/archive)?(?:\/(\d+|new))?$/, view: "Reports", params: ["env", "archive", "n"] },
  { re: /^\/env\/([a-z0-9-]+)\/plans(\/archive)?(?:\/(\d+|new))?$/, view: "Plans", params: ["env", "archive", "n"] },
  { re: /^\/env\/([a-z0-9-]+)\/suggestions(\/archive)?(?:\/(\d+|ask))?$/, view: "Suggestions", params: ["env", "archive", "n"] },
  { re: /^\/env\/([a-z0-9-]+)\/style(?:\/([a-z0-9-]+))?$/, view: "Style", params: ["env", "n"] },
  { re: /^\/env\/([a-z0-9-]+)\/work(\/archive)?(?:\/(\d+|new))?$/, view: "Work", params: ["env", "archive", "n"] },
  { re: /^\/env\/([a-z0-9-]+)\/reminders(\/archive)?(?:\/(\d+|new))?$/, view: "Reminders", params: ["env", "archive", "n"] },
  { re: /^\/env\/([a-z0-9-]+)\/docs(?:\/(new))?$/, view: "EnvDocs", params: ["env", "n"] },
  { re: /^\/env\/([a-z0-9-]+)\/settings$/, view: "Settings", params: ["env"] },
  { re: /^\/env\/([a-z0-9-]+)\/files$/, view: "Files", params: ["env"] },
  { re: /^\/env\/([a-z0-9-]+)\/agents\/(session|subagent)\/([0-9a-f-]{6,40})$/, view: "Agent", params: ["env", "kind", "id"] },
  { re: /^\/env\/([a-z0-9-]+)\/agents\/(session|subagent)\/([0-9a-f-]{6,40})\/transcript$/, view: "AgentTranscript", params: ["env", "kind", "id"] },
  { re: /^\/env\/([a-z0-9-]+)\/commits\/([0-9a-f]{7,40})$/, view: "Commit", params: ["env", "sha"] },
  { re: /^\/env\/([a-z0-9-]+)\/search$/, view: "Search", params: ["env"] },
  { re: /^\/rules(\/archive)?(?:\/(\d+|new))?$/, view: "Rules", params: ["archive", "n"] },
  { re: /^\/tools(?:\/(\d+|new))?$/, view: "Tools", params: ["n"] },
  { re: /^\/about$/, view: "About", params: [] },
  { re: /^\/env\/([a-z0-9-]+)\/skills\/([A-Za-z0-9_.:-]+)$/, view: "SkillView", params: ["env", "name"] },
  { re: /^\/skills\/([A-Za-z0-9_.:-]+)$/, view: "SkillView", params: ["name"] },
  { re: /^\/docs(?:\/(new))?$/, view: "Docs", params: ["n"] },
  { re: /^\/docs\/(\d+(?:\.\d+)?)$/, view: "DocDetail", params: ["docref"] },
];

function parseHash() {
  const path = (location.hash || "#/").slice(1) || "/";
  for (const r of ROUTES) {
    const m = r.re.exec(path);
    if (m) {
      const params = {};
      (r.params || []).forEach((name, i) => { if (m[i + 1] !== undefined) params[name] = m[i + 1]; });
      return { view: r.view, params };
    }
  }
  return { view: "NotFound", params: {} };
}

// ─────────────────────────────────────────────────────────────── fetching
// `urlFn` returning a falsy value means "nothing to fetch yet". Data already shown stays
// on screen while the next request is in flight, so opening another item does not flash.
// every list and item on screen refreshes itself while the tab is visible
const POLL_MS = 5000;
// when the tab was last hidden and shown again: the first refresh after a long absence carries everything that changed meanwhile
const TAB = { hiddenAt: 0, shownAt: 0 };
document.addEventListener("visibilitychange", () => { if (document.hidden) TAB.hiddenAt = Date.now(); else TAB.shownAt = Date.now(); });
function cameBack() {
  return TAB.hiddenAt > 0 && TAB.shownAt > TAB.hiddenAt && TAB.shownAt - TAB.hiddenAt > POLL_MS && Date.now() - TAB.shownAt < 2 * POLL_MS;
}
// when this viewer last wrote something: list changes that land soon after are its own, not news
const LAST_WRITE = { at: 0 };
const QUIET_MS = 4000;

function useFetch(urlFn, { poll = true } = {}) {
  const state = reactive({ data: null, loading: true, error: null, tick: 0 });
  state.reload = () => { state.tick += 1; };
  let busy = false;
  const stop = watchEffect(() => {
    const url = urlFn();
    void state.tick;
    if (!url) return;
    // only writes here: reading state.data would make every response trigger the next fetch
    state.loading = true;
    busy = true;
    fetch(url)
      .then((r) => r.json().then((body) => ({ ok: r.ok, body })))
      .then(({ ok, body }) => {
        if (!ok) throw new Error(body.error || "request failed");
        state.data = body;
        state.error = null;
      })
      .catch((e) => { state.error = e.message; })
      .finally(() => { state.loading = false; busy = false; });
  });
  // self-healing: a poll that throws or fails is simply tried again on the next tick
  const timer = poll ? setInterval(() => {
    try {
      if (!busy && document.visibilityState === "visible") state.reload();
    } catch (e) { /* the next tick tries again */ }
  }, POLL_MS) : null;
  onUnmounted(() => { stop(); if (timer) clearInterval(timer); });
  return state;
}

function send(method, url, payload) {
  // stamped when the write starts and again when it lands, so the reload it causes is inside the quiet window
  LAST_WRITE.at = Date.now();
  return fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload || {}) })
    .then((r) => r.json().then((body) => {
      if (!r.ok) throw new Error(body.error || "request failed");
      return body;
    }))
    .finally(() => { LAST_WRITE.at = Date.now(); });
}

function postJSON(url, payload) { return send("POST", url, payload); }

function changed() { window.dispatchEvent(new Event("journal:changed")); }

// A LINK FOR A STORED REFERENCE ("todo:3", "doc:4.1"), the spellings questions and the inbox
// store. `noted` links nowhere.
function refHref(ref, env) {
  const [kind, num] = String(ref).split(":");
  if (kind === "todo") return `#/env/${env}/todos/${num}`;
  if (kind === "pin") return `#/env/${env}/pins/${num}`;
  if (kind === "rule") return `#/rules/${num}`;
  if (kind === "doc") return `#/docs/${num}`;
  if (kind === "question") return `#/env/${env}/questions/${num}`;
  if (kind === "report") return `#/env/${env}/reports/${num}`;
  if (kind === "plan") return `#/env/${env}/plans/${num}`;
  if (kind === "suggestion") return `#/env/${env}/suggestions/${num}`;
  if (kind === "reminder") return `#/env/${env}/reminders`;
  if (kind === "inbox") return `#/env/${env}/messages/${num}`;
  if (kind === "work") return `#/env/${env}/work/${num}`;
  if (kind === "style") return num ? `#/env/${env}/style/${num}` : `#/env/${env}/style`;
  return null;
}

// a pin's or rule's meta is the CLI's own " · " line; its age and doc citation are read back out of it
function ageOf(meta) { return (meta || "").split(" · ").find((s) => / ago$|^just now$/.test(s)) || ""; }
function docOf(meta) { const m = /→ doc ([\d.]+)/.exec(meta || ""); return m ? m[1] : null; }

function humanSize(n) {
  if (!n) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  let i = 0;
  while (n >= 1024 && i < units.length - 1) { n /= 1024; i++; }
  return `${i === 0 ? n : n.toFixed(1)} ${units[i]}`;
}

// ─────────────────────────────────────────────────────────────── markdown
// Hand-written, no dependency. The source is escaped first, so every tag added below is added
// to already-safe text.
function _escapeHtml(s) {
  return String(s ?? "")
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

// a bare web address in escaped text, and what trails it that is punctuation rather than address
const URL_IN_TEXT = /https?:\/\/[^\s<>"']+/g;

function _linkUrls(escaped) {
  return escaped.replace(URL_IN_TEXT, (url) => {
    const trail = (url.match(/[.,;:!?)\]]+$/) || [""])[0];
    const href = url.slice(0, url.length - trail.length);
    return `<a class="autolink" href="${href}" target="_blank" rel="noopener">${href}</a>${trail}`;
  });
}

// plain text as HTML, escaped, with every web address a link: for text that is not markdown
function linkify(text) {
  return _linkUrls(_escapeHtml(String(text ?? "")));
}

function _mdInline(text) {
  text = text.replace(/`([^`]+)`/g, (_, c) => `<code>${c}</code>`);
  text = text.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  text = text.replace(/(^|[^*])\*([^*]+)\*(?!\*)/g, "$1<em>$2</em>");
  // only web links, mail, anchors and relative paths become links: a javascript: (or any other scheme) link is shown as its text
  text = text.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, t, href) =>
    (/^(https?:\/\/|mailto:|#|\/|\.\.?\/)/i.test(href) || !/^[a-z][a-z0-9+.\-]*:/i.test(href)
      ? `<a href="${href}" target="_blank" rel="noopener">${t}</a>` : t));
  // a bare address becomes a link too; one already inside a link's href or text is left alone
  text = text.split(/(<a [^>]*>.*?<\/a>|<code>.*?<\/code>)/).map((part, i) => (i % 2 ? part : _linkUrls(part))).join("");
  return text;
}

function renderMarkdown(src) {
  if (!(src || "").trim()) return "";
  const lines = _escapeHtml(src).replace(/\r\n/g, "\n").split("\n");
  const out = [];
  let listType = null;
  const closeList = () => { if (listType) { out.push(`</${listType}>`); listType = null; } };
  const startsBlock = (l) => /^\s*$/.test(l) || /^#{1,6}\s/.test(l) || /^\s*[-*]\s/.test(l) || /^\s*\d+\.\s/.test(l) || /^```/.test(l);
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (/^```/.test(line)) {
      closeList();
      const code = [];
      i++;
      while (i < lines.length && !/^```\s*$/.test(lines[i])) { code.push(lines[i]); i++; }
      i++;
      out.push(`<pre><code>${code.join("\n")}</code></pre>`);
      continue;
    }
    const h = line.match(/^(#{1,6})\s+(.*)$/);
    if (h) { closeList(); out.push(`<h${h[1].length}>${_mdInline(h[2])}</h${h[1].length}>`); i++; continue; }
    if (/^\s*$/.test(line)) { closeList(); i++; continue; }
    const li = line.match(/^\s*[-*]\s+(.*)$/) || line.match(/^\s*\d+\.\s+(.*)$/);
    if (li) {
      const type = /^\s*[-*]\s/.test(line) ? "ul" : "ol";
      if (listType !== type) { closeList(); out.push(`<${type}>`); listType = type; }
      const item = [li[1]];
      i++;
      while (i < lines.length && !startsBlock(lines[i])) { item.push(lines[i].trim()); i++; }
      out.push(`<li>${_mdInline(item.join(" "))}</li>`);
      continue;
    }
    closeList();
    const para = [line];
    i++;
    while (i < lines.length && !startsBlock(lines[i])) { para.push(lines[i]); i++; }
    out.push(`<p>${_mdInline(para.join(" "))}</p>`);
  }
  closeList();
  return out.join("\n");
}

// page view -> its help file under static/help/
const HELP_TOPICS = { Todos: "todos", Inbox: "messages", Questions: "questions", Suggestions: "suggestions", Reports: "reports", Plans: "plans",
  Pins: "pins", Reminders: "reminders", Work: "work", EnvDocs: "docs", Docs: "docs", DocDetail: "docs", Rules: "rules", Tools: "tools",
  Files: "files", Style: "style" };
const HELP_CACHE = {};

// ─────────────────────────────────────────────────────────────── icons
const Icon = {
  props: ["name"],
  template: `
    <svg class=ico viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">
      <template v-if="name === 'todos'"><circle cx="8" cy="8" r="5.75"/><path d="M5.6 8.1l1.7 1.7 3.2-3.5"/></template>
      <path v-else-if="name === 'pins'" d="M8 14V9.5M5 2.5h6M6 2.5v3.5L4 9.5h8L10 6V2.5"/>
      <path v-else-if="name === 'style'" d="M5.5 4.5 2.5 8l3 3.5M10.5 4.5l3 3.5-3 3.5M9 3.5l-2 9"/>
      <template v-else-if="name === 'suggestions'"><path d="M8 2.5a4 4 0 0 0-2.3 7.3V11.5h4.6V9.8A4 4 0 0 0 8 2.5z"/><path d="M6.3 13.5h3.4"/></template>
      <path v-else-if="name === 'up'" d="M8 12.5V4M4.5 7.5L8 4l3.5 3.5"/>
      <path v-else-if="name === 'down'" d="M8 3.5V12M4.5 8.5L8 12l3.5-3.5"/>
      <template v-else-if="name === 'open'"><path d="M9 3.5h3.5V7"/><path d="M12.5 3.5L7.5 8.5"/><path d="M11 9.5v3H3.5V5h3"/></template>
      <template v-else-if="name === 'sidepanel'"><rect x="2.5" y="3" width="11" height="10" rx="1.5"/><path d="M9.5 3v10"/></template>
      <template v-else-if="name === 'info'"><circle cx="8" cy="8" r="5.75"/><path d="M8 7.3v3.4"/><path d="M8 5.1v.1"/></template>
      <template v-else-if="name === 'bell'"><path d="M4.5 11V7.5a3.5 3.5 0 0 1 7 0V11l1 1.5h-9z"/><path d="M6.8 13.5a1.3 1.3 0 0 0 2.4 0"/></template>
      <template v-else-if="name === 'activity'"><rect x="2.5" y="3" width="11" height="10" rx="1.5"/><path d="M9.5 3v10M11 6h1M11 8.5h1"/></template>
      <path v-else-if="name === 'arrow'" d="M3.5 8h9M9 4.5L12.5 8 9 11.5"/>
      <template v-else-if="name === 'collapse'"><path d="M6 4.5l3.5 3.5L6 11.5"/><path d="M11.5 3.5v9"/></template>
      <template v-else-if="name === 'paperclip'"><path d="M10.5 5.5l-4.3 4.3a1.3 1.3 0 0 0 1.8 1.8l4.6-4.6a2.6 2.6 0 0 0-3.7-3.7L4.3 8a3.9 3.9 0 0 0 5.5 5.5l3.7-3.7"/></template>
      <template v-else-if="name === 'sort-asc'"><path d="M8 13V3M4 7l4-4 4 4"/></template>
      <template v-else-if="name === 'sort-desc'"><path d="M8 3v10M4 9l4 4 4-4"/></template>
      <template v-else-if="name === 'open'"><path d="M9 3.5h3.5V7"/><path d="M12.5 3.5L7.5 8.5"/><path d="M11 9.5v3H3.5V5h3"/></template>
      <template v-else-if="name === 'agents'"><circle cx="6" cy="5.5" r="2"/><path d="M2.5 13a3.5 3.5 0 0 1 7 0"/><path d="M10.5 3.8a2 2 0 0 1 0 3.4"/><path d="M11.5 9.8a3.5 3.5 0 0 1 2 3.2"/></template>
      <template v-else-if="name === 'empty'"><path d="M2.5 9.5l1.8-5h7.4l1.8 5V13h-11z"/><path d="M2.5 9.5h3l1 1.5h3l1-1.5h3"/></template>
      <template v-else-if="name === 'reports'"><path d="M4 2.5h5.5L12 5v8.5H4z"/><path d="M6.5 8h3M6.5 10.5h3"/></template>
      <template v-else-if="name === 'work'"><circle cx="8" cy="8" r="5.5"/><path d="M8 5v3l2 1.5"/></template>
      <template v-else-if="name === 'reminders'"><path d="M13 8a5 5 0 1 1-1.5-3.55"/><path d="M13 2.75V5h-2.25"/><path d="M8 5.5V8l1.75 1.25"/></template>
      <template v-else-if="name === 'docs'"><path d="M4 1.8h5.5L12.5 5v9.2H4V1.8Z"/><path d="M9.5 1.8V5h3"/></template>
      <path v-else-if="name === 'rules'" d="M3 3.5h10M3 8h10M3 12.5h6"/>
      <path v-else-if="name === 'folder'" d="M2.5 3h4l1.5 1.5h5.5v8.5h-11V3Z"/>
      <template v-else-if="name === 'files'"><path d="M5.5 4.5V2h6l2 2v7.5h-2.5"/><path d="M2.5 4.5h6l2 2v7.5h-8V4.5Z"/></template>
      <template v-else-if="name === 'inbox'"><path d="M2 9.5l1.8-6h8.4l1.8 6v3.5H2V9.5Z"/><path d="M2 9.5h3.5l1 1.5h3l1-1.5H14"/></template>
      <template v-else-if="name === 'questions'"><circle cx="8" cy="8" r="5.5"/><path d="M6.4 6.3a1.7 1.7 0 0 1 3.2.7c0 1.2-1.6 1.4-1.6 2.5"/><circle cx="8" cy="11.4" r=".6" fill="currentColor" stroke="none"/></template>
      <path v-else-if="name === 'home'" d="M2.5 7.5L8 2.75l5.5 4.75v6.25h-3.75v-4h-3.5v4H2.5V7.5Z"/>
      <path v-else-if="name === 'close'" d="M4 4l8 8M12 4l-8 8"/>
      <template v-else-if="name === 'tools'"><path d="M9.8 2.3a3 3 0 0 0-3.6 3.9L2.5 9.9a1.2 1.2 0 0 0 1.7 1.7l3.7-3.7a3 3 0 0 0 3.9-3.6L10 6 8.6 5.4 8 4l1.8-1.7Z"/></template>
      <template v-else-if="name === 'search'"><circle cx="7" cy="7" r="4.25"/><path d="M10.25 10.25L13.5 13.5"/></template>
      <template v-else-if="name === 'settings'"><circle cx="8" cy="8" r="2"/><path d="M8 1.75v1.5M8 12.75v1.5M1.75 8h1.5M12.75 8h1.5M3.6 3.6l1.05 1.05M11.35 11.35l1.05 1.05M3.6 12.4l1.05-1.05M11.35 4.65l1.05-1.05"/></template>
    </svg>`,
};

// A STATUS IS A PILL: an outline when open, filling as it moves, struck through when blocked.
const STATUS_COLOR = {
  progress: "#5b8def", blocked: "#d9a441", done: "#3ecf74", waiting: "#a78bfa", open: "#8b8e96", withdrawn: "#55575d",
};
const StatusIcon = {
  props: ["kind"],
  setup(props) {
    const color = computed(() => STATUS_COLOR[props.kind] || STATUS_COLOR.open);
    return { color };
  },
  // done is filled as well as green, so it stands apart from open by shape, not by colour alone
  template: `<span class=dot :style="{borderColor: color, background: kind === 'done' ? color : 'transparent'}" role=img :aria-label="kind"></span>`,
};

// A PRIORITY IS THREE CHEVRONS: how many are lit is how important it is.
const PriorityIcon = {
  props: ["value"],
  setup(props) {
    const v = computed(() => Number(props.value ?? 100));
    const bars = computed(() => v.value < 100 ? [1, 0.25, 0.25] : v.value === 100 ? [1, 1, 0.25] : [1, 1, 1]);
    return { v, bars };
  },
  template: `
    <svg :class="['ico', {hot: v >= 200}]" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6"
      stroke-linecap="round" stroke-linejoin="round" :aria-label="'priority ' + v">
      <path d="M4.5 13l3.5-2.25L11.5 13" :style="{opacity: bars[0]}"/>
      <path d="M4.5 9.25L8 7l3.5 2.25" :style="{opacity: bars[1]}"/>
      <path d="M4.5 5.5L8 3.25l3.5 2.25" :style="{opacity: bars[2]}"/>
    </svg>`,
};

// ─────────────────────────────────────────────────────────────── shared pieces
// the page's top bar: crumbs, the page's own button, then Search and Notifications on every page
// what the shell knows about the agent, for the status bar every page carries under its top bar
const SHELL = reactive({ env: "", activity: null, setAuto: null });
// one overlay the shell hosts for any page: what the status bar inspects opens here, over whatever is showing
const OVERLAY = reactive({ kind: "", n: 0 });

const StatusBar = {
  components: { Icon },
  setup() {
    const env = computed(() => SHELL.env);
    const work = useFetch(() => env.value && `/api/env/${env.value}/work`);
    const plans = useFetch(() => env.value && `/api/env/${env.value}/plans`);
    const view = computed(() => {
      const agent = SHELL.activity && SHELL.activity.agent;
      const plan = (plans.data || []).find((p) => p.status === "active") || null;
      const w = (work.data || [])[0] || null;
      const base = `#/env/${env.value}`;
      const planHref = plan ? `${base}/plans/${plan.n}` : null;
      const workHref = w ? `${base}/work/${w.n}` : planHref;
      if (plan && plan.held) return { state: "Stopped", held: true, what: `phase ${plan.held} is a checkpoint, waiting for you to continue`, href: planHref };
      if (!agent) return { state: "Stopped", what: "no agent is on this environment", href: planHref };
      const onIt = w ? w.subject : plan ? `plan ${plan.n} · phase ${plan.current}: ${plan.current_title}` : "";
      if (agent.compacting) return { state: "Working", live: true, what: "compacting its context", href: workHref };
      if (agent.working) return { state: "Working", live: true, what: onIt || "on its own", href: workHref };
      return { state: "Idle", what: onIt ? `last on ${onIt}` : "waiting for you", href: workHref };
    });
    const inspectWork = computed(() => (work.data || [])[0] || null);
    const inspect = (w) => { OVERLAY.kind = "work"; OVERLAY.n = w.n; };
    return { env, view, SHELL, inspectWork, inspect };
  },
  template: `
    <div v-if="env && SHELL.activity" :class="['statusbar', {held: view.held}]">
      <span :class="['statusbar-dot', {live: view.live, held: view.held}]"></span>
      <a v-if="view.href" class=statusbar-text :href="view.href"><b>{{ view.state }}</b><span>{{ view.what }}</span></a>
      <span v-else class=statusbar-text><b>{{ view.state }}</b><span>{{ view.what }}</span></span>
      <span class=statusbar-tools>
        <button type=button class=statusbar-auto role=switch :aria-checked="SHELL.activity.auto ? 'true' : 'false'"
          :title="SHELL.activity.auto ? 'The agent works through the to-do list without asking' : 'The agent asks before picking up the next to-do'"
          @click="SHELL.setAuto && SHELL.setAuto(!SHELL.activity.auto)">Auto<span :class="['switch', {on: SHELL.activity.auto}]"><span class=knob></span></span></button>
        <button v-if="inspectWork && !view.held" type=button class="btn statusbar-inspect" title="Open the agent's work here" @click="inspect(inspectWork)">Inspect<Icon name="sidepanel"/></button>
        <a v-else-if="view.href" class="btn statusbar-inspect" :href="view.href" title="Open what the agent is on">Inspect<Icon name="sidepanel"/></a>
      </span>
    </div>`,
};

const TopBar = {
  props: { crumbs: { type: Array, default: () => [] } },
  components: { Icon, StatusBar },
  setup() {
    const hashEnv = parseHash().params.env || "";
    const env = computed(() => {
      if (hashEnv) return hashEnv;
      const envs = OVERVIEW.data ? OVERVIEW.data.environments : [];
      return (envs.find((e) => e.active) || envs.find((e) => e.current) || envs[0] || {}).name || "";
    });
    const row = computed(() => (OVERVIEW.data && env.value ? OVERVIEW.data.environments.find((e) => e.name === env.value) : null));
    const waiting = computed(() => (row.value ? (row.value.notifications || 0) + (row.value.suggestions || 0) + (row.value.questions || 0) : 0));
    const openCount = computed(() => (row.value ? row.value.questions || 0 : 0));
    const drop = reactive({ open: false });
    // the last 50, read ones too: a notice cleared by a stray click can still be read again
    const notes = useFetch(() => drop.open && env.value && `/api/env/${env.value}/notifications?all=1&cap=50`);
    const unreadNotes = computed(() => (notes.data || []).filter((x) => !x.read));
    const readNotes = computed(() => (notes.data || []).filter((x) => x.read));
    const ideas = useFetch(() => drop.open && env.value && `/api/env/${env.value}/suggestions`);
    const asks = useFetch(() => drop.open && env.value && `/api/env/${env.value}/questions`);
    const openQuestions = computed(() => (asks.data || []).filter((q) => q.status === "open"));
    const suggestions = computed(() => (ideas.data || []).filter((s) => s.status === "open"));
    const changed = () => { notes.reload(); window.dispatchEvent(new CustomEvent("journal:changed")); };
    const readOne = (x) => send("POST", `/api/env/${env.value}/notifications/${x.n}/read`).then(changed);
    const readAll = () => send("POST", `/api/env/${env.value}/notifications/readall`).then(changed);
    const onHome = () => /^#\/env\/[^/]+\/?$/.test(location.hash);
    const openFromBell = (event, x) => {
      const kind = String(x.about || "").split(":")[0];
      if (!onHome() || !["inbox", "todo", "question", "suggestion", "work"].includes(kind)) return;
      event.preventDefault();
      window.dispatchEvent(new CustomEvent("journal:peek", { detail: { about: x.about } }));
    };
    const outside = (e) => { if (!e.target.closest(".drop-wrap")) drop.open = false; };
    watchEffect((onCleanup) => {
      if (!drop.open) return;
      document.addEventListener("mousedown", outside);
      onCleanup(() => document.removeEventListener("mousedown", outside));
    });
    const activity = ACTIVITY;
    const toggleActivity = () => setActivityShown(!ACTIVITY.shown);
    const view = parseHash().view || "";
    // each resource page explains itself from static/help/<topic>.md
    const helpTopic = HELP_TOPICS[view] || "";
    const help = reactive({ html: "", open: false });
    const helpDialog = ref(null);
    const openHelp = async () => {
      if (!helpDialog.value) return;
      helpDialog.value.showModal();
      help.open = true;
      if (help.html) return;
      if (!(helpTopic in HELP_CACHE)) {
        const res = await fetch(`/help/${helpTopic}.md`);
        HELP_CACHE[helpTopic] = res.ok ? await res.text() : "";
      }
      help.html = renderMarkdown(HELP_CACHE[helpTopic]) || "<p>No help written for this page yet.</p>";
    };
    const closeHelp = () => { if (helpDialog.value) helpDialog.value.close(); };
    return { env, waiting, openCount, drop, notes, unreadNotes, readNotes, suggestions, asks, openQuestions, readOne, readAll, openFromBell, activity, toggleActivity, view,
             helpTopic, help, helpDialog, openHelp, closeHelp };
  },
  template: `
    <div class=top>
      <div class=crumb>
        <template v-for="(c, i) in crumbs" :key="i">
          <span v-if="i" class=sep>/</span><b v-if="i === crumbs.length - 1">{{ c }}</b><span v-else>{{ c }}</span>
        </template>
        <button v-if="helpTopic" type=button class="icon-btn help-btn" :title="'Help for ' + crumbs[crumbs.length - 1]"
          :aria-label="'About ' + crumbs[crumbs.length - 1]" @click="openHelp"><Icon name="info"/></button>
      </div>
      <dialog v-if="helpTopic" ref=helpDialog class=help @click.self="closeHelp" @close="help.open = false">
        <div class=help-head><span>{{ crumbs[crumbs.length - 1] }}</span>
          <button type=button class=icon-btn title="Close" aria-label="Close" @click="closeHelp"><Icon name="close"/></button></div>
        <div class="help-body md" v-html="help.html"></div>
      </dialog>
      <div class=top-tools>
        <slot/>
        <template v-if="env">
          <a class=icon-btn :href="'#/env/' + env + '/search'" title="Search" aria-label="Search"><Icon name="search"/></a>
          <div class=drop-wrap>
            <button type=button :class="['icon-btn', {on: drop.open}]" title="Notifications" aria-label="Notifications"
              :aria-expanded="drop.open" @click="drop.open = !drop.open">
              <Icon name="bell"/><span v-if="waiting" class=tool-badge>{{ waiting }}</span>
            </button>
            <div v-if="drop.open" class=drop>
              <div class=drop-head><span>Notifications</span>
                <button v-if="unreadNotes.length" type=button class="btn more" @click="readAll">Mark all read</button></div>
              <p v-if="!unreadNotes.length && !suggestions.length && !openQuestions.length" class="muted drop-empty">Nothing waiting.</p>
              <a v-for="q in openQuestions" :key="'q' + q.n" class=drop-row @click="drop.open = false"
                :href="(q.links && q.links.length && $refHref(q.links[0].ref, env)) || '#/env/' + env + '/questions/' + q.n">
                <span class=drop-kind>Question {{ q.n }}</span><span class=drop-text>{{ q.text }}</span>
              </a>
              <a v-for="s in suggestions" :key="'s' + s.n" class=drop-row :href="'#/env/' + env + '/suggestions/' + s.n" @click="drop.open = false">
                <span class=drop-kind>Suggestion {{ s.n }}</span><span class=drop-text>{{ s.title }}</span>
              </a>
              <div v-for="x in unreadNotes" :key="'n' + x.n" class=drop-row>
                <span class=drop-text>{{ x.text }}</span>
                <span class=drop-meta>{{ x.age || 'just now' }}
                  <a v-if="x.about && $refHref(x.about, env)" class="btn more" :href="$refHref(x.about, env)" :title="'Open ' + x.about_label" @click="readOne(x); openFromBell($event, x); drop.open = false">Open</a>
                  <button type=button class="btn more" @click="readOne(x)">Mark read</button>
                </span>
              </div>
              <div v-if="readNotes.length" class=drop-sub>Read</div>
              <div v-for="x in readNotes" :key="'r' + x.n" class="drop-row read">
                <span class=drop-text>{{ x.text }}</span>
                <span class=drop-meta>{{ x.age || 'just now' }}
                  <a v-if="x.about && $refHref(x.about, env)" class="btn more" :href="$refHref(x.about, env)" :title="'Open ' + x.about_label" @click="openFromBell($event, x); drop.open = false">Open</a>
                </span>
              </div>
            </div>
          </div>
          <button type=button :class="['icon-btn', {on: activity.shown}]" :title="activity.shown ? 'Hide Activity' : 'Show Activity'"
            :aria-label="activity.shown ? 'Hide Activity' : 'Show Activity'" :aria-pressed="activity.shown" @click="toggleActivity">
            <Icon name="activity"/>
          </button>
        </template>
      </div>
    </div>
    <StatusBar/>`,
};

// a section of any panel folds from its label; what is folded is remembered by the label's name
const FOLDED_KEY = "journal:folded";
function foldedNames() {
  try { return new Set(JSON.parse(localStorage.getItem(FOLDED_KEY) || "[]")); } catch (e) { return new Set(); }
}
function saveFolded(names) {
  try { localStorage.setItem(FOLDED_KEY, JSON.stringify([...names])); } catch (e) { /* folding still works for this view */ }
}
// a label marked data-shut starts folded; the ones the viewer opened are remembered instead
const OPENED_KEY = "journal:opened";
function openedNames() {
  try { return new Set(JSON.parse(localStorage.getItem(OPENED_KEY) || "[]")); } catch (e) { return new Set(); }
}
function saveOpened(names) {
  try { localStorage.setItem(OPENED_KEY, JSON.stringify([...names])); } catch (e) { /* folding still works for this view */ }
}

// the inspector's width, dragged by its left edge and remembered per browser
const INSPECTOR_WIDTH = { key: "journal.inspector.width", min: 420, max: 560, fallback: 500 };
const inspector = reactive({ width: storedInspectorWidth() });
// the rows of the list that opened the inspector, in the order shown: its position and its up and down steps read from here
const INSPECTOR_TRAIL = reactive({ owner: null, items: [], current: null });

// an item dealt with in the inspector hands over to the next one in its list; with none left, the inspector closes
function trailIndex(hash) {
  const key = INSPECTOR_TRAIL.current ?? hash;
  return INSPECTOR_TRAIL.items.findIndex((it) => it.key === key);
}

function advanceInspector(props) {
  const items = INSPECTOR_TRAIL.items;
  const i = trailIndex(location.hash);
  const next = i >= 0 ? items[i + 1] || items[i - 1] : null;
  if (next) next.go();
  else if (props.onClose) props.onClose();
  else if (props.base || props.close) location.hash = props.base || props.close;
}

function storedInspectorWidth() {
  try {
    const got = Number(localStorage.getItem(INSPECTOR_WIDTH.key));
    return got ? Math.min(INSPECTOR_WIDTH.max, Math.max(INSPECTOR_WIDTH.min, got)) : INSPECTOR_WIDTH.fallback;
  } catch (e) { return INSPECTOR_WIDTH.fallback; }
}

const Panel = {
  props: ["label", "close", "onClose", "link"],
  components: { Icon },
  setup(props) {
    const body = ref(null);
    // a panel lies over the whole app: the scrim, Esc and the close button all leave it the same way
    const dismiss = () => {
      if (props.onClose) props.onClose();
      else if (props.close) location.hash = props.close;
    };
    const hash = ref(location.hash);
    const onHash = () => { hash.value = location.hash; };
    const at = computed(() => trailIndex(hash.value));
    const place = computed(() => (at.value >= 0 && INSPECTOR_TRAIL.items.length > 1 ? `${at.value + 1} of ${INSPECTOR_TRAIL.items.length}` : ""));
    const step = (by) => {
      const items = INSPECTOR_TRAIL.items;
      if (at.value < 0 || items.length < 2) return;
      items[(at.value + by + items.length) % items.length].go();
    };
    const typing = (el) => !!el && (["INPUT", "TEXTAREA", "SELECT"].includes(el.tagName) || el.isContentEditable);
    const onEscape = (e) => {
      if (e.isComposing) return;
      // a menu open inside the panel takes these keys for itself; a folding section label is not a menu
      if (document.querySelector('.panel button[aria-expanded="true"]')) return;
      if (e.key === "Escape") dismiss();
      else if ((e.key === "ArrowUp" || e.key === "ArrowDown") && !typing(e.target) && place.value) {
        e.preventDefault();
        step(e.key === "ArrowUp" ? -1 : 1);
      }
    };
    const drag = (e) => {
      e.preventDefault();
      const move = (m) => { inspector.width = Math.min(INSPECTOR_WIDTH.max, Math.max(INSPECTOR_WIDTH.min, window.innerWidth - m.clientX)); };
      const up = () => {
        window.removeEventListener("pointermove", move);
        window.removeEventListener("pointerup", up);
        try { localStorage.setItem(INSPECTOR_WIDTH.key, String(Math.round(inspector.width))); } catch (err) { /* storage off */ }
      };
      window.addEventListener("pointermove", move);
      window.addEventListener("pointerup", up);
    };
    onMounted(() => { window.addEventListener("keydown", onEscape); window.addEventListener("hashchange", onHash); });
    onUnmounted(() => { window.removeEventListener("keydown", onEscape); window.removeEventListener("hashchange", onHash); });
    const nameOf = (label) => ([...label.childNodes].find((n) => n.nodeType === 3 && n.textContent.trim()) || label).textContent.trim();
    // the section is the label's element, or the element around a header row that holds the label beside its buttons
    const sectionOf = (label) => {
      const head = label.parentElement;
      const section = head && head.classList.contains("files-head") ? head.parentElement : head;
      return section && section !== body.value && !label.closest(".question-answer") ? section : null;
    };
    const decorate = () => {
      if (!body.value) return;
      const folded = foldedNames();
      const opened = openedNames();
      body.value.querySelectorAll(".section-label:not([data-foldable])").forEach((label) => {
        const section = sectionOf(label);
        if (!section) return;
        const shut = label.hasAttribute("data-shut") ? !opened.has(nameOf(label)) : folded.has(nameOf(label));
        label.dataset.foldable = "";
        label.setAttribute("role", "button");
        label.setAttribute("tabindex", "0");
        label.setAttribute("aria-expanded", String(!shut));
        section.classList.toggle("folded", shut);
      });
    };
    const toggle = (label) => {
      const section = sectionOf(label);
      if (!section) return;
      const shut = !section.classList.contains("folded");
      section.classList.toggle("folded", shut);
      label.setAttribute("aria-expanded", String(!shut));
      if (label.hasAttribute("data-shut")) {
        const names = openedNames();
        if (shut) names.delete(nameOf(label)); else names.add(nameOf(label));
        saveOpened(names);
        return;
      }
      const names = foldedNames();
      if (shut) names.add(nameOf(label)); else names.delete(nameOf(label));
      saveFolded(names);
    };
    const onClick = (e) => { const label = e.target.closest(".section-label[data-foldable]"); if (label) toggle(label); };
    const onKey = (e) => {
      const label = e.target.closest && e.target.closest(".section-label[data-foldable]");
      if (label && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); toggle(label); }
    };
    // sections arrive after their data loads, so labels are decorated as they appear
    let watcher = null;
    onMounted(() => { decorate(); watcher = new MutationObserver(decorate); watcher.observe(body.value, { childList: true, subtree: true }); });
    onUnmounted(() => { if (watcher) watcher.disconnect(); });
    return { body, onClick, onKey, dismiss, drag, inspector, place, step };
  },
  template: `
    <div class=panel-scrim @click="dismiss"></div>
    <aside class=panel :style="{ width: inspector.width + 'px' }">
      <div class=panel-grip title="Drag to resize" @pointerdown="drag"></div>
      <div class=panel-top>
        <span class=panel-ref><span class=panel-chip>{{ label }}</span>
          <a v-if="link" class=panel-open :href="link" :title="'Open ' + label + ' on its own page'">Open page<Icon name="arrow"/></a></span>
        <span class=panel-tools>
          <span v-if="place" class=panel-place>{{ place }}</span>
          <button v-if="place" type=button class=icon-btn title="Previous (↑)" aria-label="Previous" @click="step(-1)"><Icon name="up"/></button>
          <button v-if="place" type=button class=icon-btn title="Next (↓)" aria-label="Next" @click="step(1)"><Icon name="down"/></button>
          <button v-if="onClose" type=button class=icon-btn title="Close" @click="onClose"><Icon name="close"/></button>
          <a v-else class=icon-btn :href="close" title="Close"><Icon name="close"/></a>
        </span></div>
      <div class=panel-body ref=body @click="onClick" @keydown="onKey"><slot/></div>
    </aside>`,
};

const Compose = {
  props: ["placeholder", "submit", "hint", "send", "attach", "autofocus"],
  components: { Icon },
  setup(props) {
    const draft = reactive({ text: "", sending: false, error: null, files: [] });
    const area = ref(null);
    onMounted(() => { if (props.autofocus && area.value) area.value.focus(); });
    const picked = (e) => { draft.files.push(...Array.from(e.target.files || [])); e.target.value = ""; };
    const unpick = (i) => draft.files.splice(i, 1);
    const encoded = (file) => new Promise((resolve, reject) => {
      const r = new FileReader();
      r.onload = () => resolve({ name: file.name, data: String(r.result) });
      r.onerror = () => reject(new Error(`Could not read ${file.name}`));
      r.readAsDataURL(file);
    });
    async function go() {
      if (!draft.text.trim() || draft.sending) return;
      draft.sending = true;
      draft.error = null;
      try {
        const files = props.attach ? await Promise.all(draft.files.map(encoded)) : [];
        await props.send(draft.text, files);
        draft.text = "";
        draft.files = [];
      } catch (e) {
        draft.error = e.message;
      } finally {
        draft.sending = false;
      }
    }
    return { draft, go, picked, unpick, area };
  },
  template: `
    <form class=compose @submit.prevent="go">
      <div :class="['compose-box', {attachable: attach}]">
        <textarea ref=area class=box-area v-model="draft.text" rows=3 :placeholder="placeholder" :aria-label="submit"
          @keydown.enter.exact="!$event.isComposing && ($event.preventDefault(), go())"
          @keydown.meta.enter.prevent="go" @keydown.ctrl.enter.prevent="go"></textarea>
        <label v-if="attach" class=compose-attach title="Attach files" aria-label="Attach files">
          <Icon name="paperclip"/><input type=file multiple hidden @change="picked">
        </label>
      </div>
      <div v-if="draft.files.length" class=compose-files>
        <span v-for="(f, i) in draft.files" :key="i" class=chip>{{ f.name }} <button type=button class=chip-x title="Remove" @click="unpick(i)">×</button></span>
      </div>
      <div class=compose-bar>
        <span class=hint>{{ hint }}</span>
        <button type=submit class=primary :disabled="draft.sending || !draft.text.trim()">{{ submit }}</button>
      </div>
      <p v-if="draft.error" class=error>{{ draft.error }}</p>
    </form>`,
};

function questionKind(q) { return q.status === "open" ? "waiting" : q.status === "answered" ? "done" : "withdrawn"; }

// answering a question: pick an option and Save, or write an answer; the same wherever a question shows
const QuestionAnswer = {
  props: { env: String, q: Object, compact: Boolean },
  emits: ["answered"],
  components: { Compose },
  setup(props, { emit }) {
    const CUSTOM = Symbol("custom");
    const state = reactive({ answering: false, picked: "", changing: false, custom: "" });
    // an answered question stays read-only until Change answer is pressed
    const locked = computed(() => !!props.q.answer && !state.changing);
    const cancel = () => { state.changing = false; state.picked = ""; state.custom = ""; };
    const answer = (text) => postJSON(`/api/env/${props.env}/questions/${props.q.n}/answer`, { answer: text })
      .then((body) => { state.changing = false; emit("answered", body.data); changed(); });
    // clicking an option only picks it; Save sends it, so a stray click never answers
    const pick = (option) => { state.picked = state.picked === option && option !== CUSTOM ? "" : option; };
    // what Save would send: the picked option, or the custom text once there is some
    const chosen = computed(() => (state.picked === CUSTOM ? state.custom.trim() : state.picked));
    const save = () => {
      if (!chosen.value || state.answering) return;
      state.answering = true;
      answer(chosen.value).then(() => { state.picked = ""; state.custom = ""; }).finally(() => { state.answering = false; });
    };
    return { state, answer, pick, save, locked, cancel, CUSTOM, chosen };
  },
  template: `
    <div :class="['question-answer', {compact}]">
      <div v-if="q.options && q.options.length" class=options>
        <p v-if="!compact" class=section-label>{{ locked ? 'Options' : q.answer ? 'Choose again' : 'Choose one' }}</p>
        <button v-for="(o, i) in q.options" :key="i" type=button
          :class="['option', {picked: state.picked === o.label, chosen: !state.picked && q.answer === o.label, locked, 'has-pick': q.pick === i + 1}]"
          :disabled="locked || state.answering" :aria-pressed="state.picked === o.label" @click="pick(o.label)">
          <span v-if="q.pick === i + 1 && !locked" class=option-pick>Agent's pick</span>{{ o.label }}
          <span v-if="o.description" class=option-description>{{ o.description }}</span>
          <code v-if="o.code" class=option-code>{{ o.code }}</code></button>
        <div v-if="!locked" role=button :tabindex="state.answering ? -1 : 0" :aria-pressed="state.picked === CUSTOM"
          :class="['option', 'option-custom', {picked: state.picked === CUSTOM}]"
          @click="pick(CUSTOM)" @keydown.enter.self.prevent="pick(CUSTOM)" @keydown.space.self.prevent="pick(CUSTOM)">
          Custom answer
          <textarea v-if="state.picked === CUSTOM" v-model="state.custom" placeholder="Write your answer" aria-label="Your custom answer" @keydown.meta.enter.prevent="save" @keydown.ctrl.enter.prevent="save"
            :disabled="state.answering" @click.stop @keydown.meta.enter.prevent="save" @keydown.ctrl.enter.prevent="save"
            @vue:mounted="({ el }) => el.focus()"></textarea>
        </div>
      </div>
      <div v-if="locked" class=option-save>
        <button type=button class=btn @click="state.changing = true">Change answer</button>
      </div>
      <template v-else>
        <div v-if="q.options && q.options.length" class=option-save>
          <button type=button class="btn primary" :disabled="!chosen || state.answering" @click="save">Save answer</button>
          <button v-if="q.answer" type=button class=btn @click="cancel">Cancel</button>
          <span v-if="state.picked" class=hint>{{ state.picked === CUSTOM && !chosen ? 'Write your answer to save it' : 'Not sent until you save' }}</span>
        </div>
        <Compose v-if="!(q.options && q.options.length)" :placeholder="q.answer ? 'Write a new answer. The old one stays in the history.' : 'Your answer'"
          :submit="q.answer ? 'Add new answer' : 'Answer'" hint="The agent is told at its next stop" :send="answer"/>
        <div v-if="q.answer && !(q.options && q.options.length)" class=option-save>
          <button type=button class=btn @click="cancel">Cancel</button>
        </div>
      </template>
    </div>`,
};

const LinkedQuestions = {
  props: { rows: { type: Array, default: () => [] }, env: { type: String, default: "" }, label: { type: String, default: "Questions" } },
  components: { StatusIcon, QuestionAnswer },
  setup() { return { questionKind }; },
  template: `
    <div v-if="rows && rows.length">
      <p class=section-label>{{ label }}</p>
      <div class=linked>
        <div v-for="q in rows" :key="(q.env || env) + ':' + q.n" class=linked-q>
          <a :href="'#/env/' + (q.env || env) + '/questions/' + q.n">
            <StatusIcon :kind="questionKind(q)"/>
            <span>{{ q.text }}<span v-if="q.answer" class=answer> → {{ q.answer }}</span></span>
          </a>
          <QuestionAnswer v-if="q.status === 'open'" compact :env="q.env || env" :q="q"/>
        </div>
      </div>
    </div>`,
};

const Comments = {
  props: { about: { type: String, default: "" }, env: { type: String, default: "" } },
  components: { Compose },
  setup(props) {
    const list = useFetch(() => props.env && props.about &&
      `/api/env/${props.env}/comments?about=${encodeURIComponent(props.about)}&all=1&direction=asc`);
    const post = (text) => send("POST", `/api/env/${props.env}/comments`, { about: props.about, text }).then(() => list.reload());
    return { list, post };
  },
  template: `
    <div v-if="env && about" class=comments>
      <p class=section-label>Comments</p>
      <div v-if="list.data && list.data.length" class=comment-list>
        <template v-for="c in list.data" :key="c.n">
          <div class=comment-card>
            <div v-html="$linkify(c.text)"></div>
            <div class=comment-meta>{{ c.source === 'web' ? 'You' : 'The agent' }} · {{ c.age || 'just now' }} · {{ c.done ? 'Handled' : c.told ? 'Seen by the agent' : 'Not seen yet' }}</div>
          </div>
          <div v-if="c.done" class="comment-card comment-reply">
            <div v-html="$linkify(c.done)"></div>
            <div class=comment-meta>The agent · handled it</div>
          </div>
        </template>
      </div>
      <Compose placeholder="Comment for the agent" submit="Comment" hint="The agent is told at its next stop" :send="post"/>
    </div>`,
};

const FromMessages = {
  props: { rows: { type: Array, default: () => [] }, env: { type: String, default: "" } },
  template: `
    <div v-if="rows && rows.length" class=from-messages>
      <p class=section-label>From your message</p>
      <a v-for="m in rows" :key="m.n" class=chip :href="'#/env/' + env + '/messages/' + m.n" :title="m.excerpt">Message #{{ m.n }}</a>
    </div>`,
};

// ─────────────────────────────────────────────────────────────── writing: actions and their forms
// An action is { label, method, url, fields, submit, note, danger, only, leave, shape }: `only` sends the
// fields that changed, `leave` returns to the list, `shape` rewrites the payload before it is sent.
const ActionBar = {
  props: { actions: { type: Array, default: () => [] }, done: Function, open: { type: String, default: "" } },
  setup(props) {
    const s = reactive({ open: "", values: {}, sending: false, error: null });
    const current = computed(() => props.actions.find((a) => a.label === s.open) || null);
    const initial = (a, name) => ((a.fields || []).find((f) => f.name === name) || {}).value ?? "";
    function pick(a) {
      s.error = null;
      if (s.open === a.label && !props.open) { s.open = ""; return; }
      s.open = a.label;
      s.values = Object.fromEntries((a.fields || []).map((f) => [f.name, f.value ?? ""]));
      // an action with nothing to fill in runs on the click; if it fails, its form stays open with the error
      if (a.immediate) go();
    }
    if (props.open) {
      const a = props.actions.find((x) => x.label === props.open);
      if (a) pick(a);
    }
    async function go() {
      const a = current.value;
      if (!a || s.sending) return;
      let payload = { ...s.values };
      if (a.only) {
        payload = Object.fromEntries(Object.entries(payload).filter(([k, v]) => v !== initial(a, k)));
        if (!Object.keys(payload).length) { s.error = "Nothing was changed."; return; }
      }
      if (a.shape) payload = a.shape(payload);
      s.sending = true;
      s.error = null;
      try {
        const body = await send(a.method, a.url, payload);
        if (!props.open) s.open = "";
        if (props.done) props.done(body, a);
      } catch (e) {
        s.error = e.message;
      } finally {
        s.sending = false;
      }
    }
    return { s, current, pick, go };
  },
  template: `
    <div v-if="actions.length" class=actions>
      <div v-if="!open" class=action-buttons>
        <button v-for="a in actions" :key="a.label" type=button :class="['btn', {danger: a.danger, on: s.open === a.label}]"
          @click="pick(a)">{{ a.label }}</button>
      </div>
      <form v-if="current" class=action-form @submit.prevent="go">
        <label v-for="f in current.fields || []" :key="f.name" class=field>
          <span>{{ f.label }}</span>
          <textarea v-if="f.kind === 'area'" class=box-area v-model="s.values[f.name]" rows=5 :placeholder="f.placeholder || ''"></textarea>
          <select v-else-if="f.kind === 'select'" class=input v-model="s.values[f.name]">
            <option v-for="o in f.options" :key="o.value" :value="o.value">{{ o.label }}</option>
          </select>
          <input v-else class=input v-model="s.values[f.name]" :placeholder="f.placeholder || ''">
        </label>
        <p v-if="current.note" class="prose muted">{{ current.note }}</p>
        <div class=compose-bar>
          <span class=hint>{{ current.hint || '' }}</span>
          <span class=form-buttons>
            <button v-if="!open" type=button class=btn @click="s.open = ''">Cancel</button>
            <button type=submit :class="['primary', {'danger-fill': current.danger}]" :disabled="s.sending">{{ current.submit || current.label }}</button>
          </span>
        </div>
        <p v-if="s.error" class=error>{{ s.error }}</p>
      </form>
    </div>`,
};

// ─────────────────────────────────────────────────────────────── lists: one component for every resource
const Switch = {
  props: { label: String, modelValue: Boolean },
  emits: ["update:modelValue"],
  template: `
    <label class=switch-row>
      <span>{{ label }}</span>
      <button type=button role=switch :aria-checked="modelValue ? 'true' : 'false'" :class="['switch', {on: modelValue}]"
        @click.prevent="$emit('update:modelValue', !modelValue)"><span class=knob></span></button>
    </label>`,
};

// one choice out of a few, like Open / Done: options [{value, label}], v-model the chosen value; arrow keys move the choice
const RadioGroup = {
  props: { options: { type: Array, default: () => [] }, modelValue: { type: String, default: "" }, label: { type: String, default: "" } },
  emits: ["update:modelValue"],
  setup(props, { emit }) {
    const choose = (value) => { if (value !== props.modelValue) emit("update:modelValue", value); };
    const step = (event, by) => {
      const count = props.options.length;
      const i = props.options.findIndex((o) => o.value === props.modelValue);
      // the position, not the option object: a parent that builds its options inline hands over a new array on the next render
      const j = (i + by + count) % count;
      const group = event.currentTarget.parentElement;
      choose(props.options[j].value);
      requestAnimationFrame(() => { const button = group.querySelectorAll("[role=radio]")[j]; if (button) button.focus(); });
    };
    return { choose, step };
  },
  template: `
    <span class=radio-group role=radiogroup :aria-label="label || null">
      <button v-for="o in options" :key="o.value" type=button role=radio :aria-checked="o.value === modelValue ? 'true' : 'false'"
        :tabindex="o.value === modelValue ? 0 : -1" :class="['radio-option', {on: o.value === modelValue}]" @click="choose(o.value)"
        @keydown.right.prevent="step($event, 1)" @keydown.down.prevent="step($event, 1)"
        @keydown.left.prevent="step($event, -1)" @keydown.up.prevent="step($event, -1)">{{ o.label }}</button>
    </span>`,
};

const PAGE_ROWS = 25;
// how long a closed item stays in its list before it counts as archived
const RECENT_MS = 7 * 24 * 60 * 60 * 1000;

// groups: {key, label, kind, closed, match(row)}; columns: {priority, status, num, numWidth, title, sub, cite, age, struck}
// a row's type is a plain tinted word; the status dot beside it already carries state
const TYPES = {
  question: { label: "Question", tint: "#c9955e" }, message: { label: "Message", tint: "#6fae7d" },
  suggestion: { label: "Suggestion", tint: "#a3a8f0" }, doc: { label: "Doc", tint: "#6fae7d" },
  report: { label: "Report", tint: "#d9a441" }, plan: { label: "Plan", tint: "#5b8def" },
  todo: { label: "To-do", tint: "#5b8def" }, work: { label: "Work", tint: "#5b8def" },
};

const ResourceList = {
  props: {
    rows: Array, loading: Boolean, error: String,
    groups: { type: Array, default: () => [{ key: "all", label: "", match: () => true }] },
    columns: Object, href: Function, selected: Function, pick: Function,
    sorts: { type: Array, default: () => [{ key: "n", label: "ID" }] },
    count: Function, empty: String, name: String,
    bar: { type: Boolean, default: true }, limit: { type: Number, default: PAGE_ROWS }, archive: Boolean,
    home: String,
  },
  components: { StatusIcon, PriorityIcon, Icon },
  setup(props) {
    const state = reactive({ sort: {}, pages: {}, held: {}, arrived: {}, quiet: false });
    // a closed section shows what closed in the last week; anything older, or closed at an unknown time, is archived
    const recent = (r) => !!r.closed_at && Date.now() - Date.parse(r.closed_at) < RECENT_MS;
    // after a refresh, a row that changed group or left the list stays put in blue for a moment, and a new row is lit
    const rowKey = (r) => String(r.n ?? r.name);
    const groupOf = (r) => (props.groups.find((g) => g.match(r)) || {}).key;
    const HOLD_MS = 2500;
    watch(() => props.rows, (rows, before) => {
      if (!rows || !before) return;
      // only what a poll brings is marked; a change the viewer just made itself is not news
      if (Date.now() - LAST_WRITE.at < QUIET_MS) return;
      // back from another tab: everything that changed arrives at once, so rows only fade in; none linger or slide out in a heap
      const back = cameBack();
      if (back) { state.quiet = true; setTimeout(() => { state.quiet = false; }, 1200); }
      const was = Object.fromEntries(before.map((r) => [rowKey(r), { group: groupOf(r), row: r }]));
      const now = new Set(rows.map(rowKey));
      const lit = (bag, k, value) => { bag[k] = value; setTimeout(() => { delete bag[k]; }, HOLD_MS); };
      rows.forEach((r) => {
        const k = rowKey(r);
        if (!was[k]) lit(state.arrived, k, true);
        else if (!back && was[k].group !== groupOf(r)) lit(state.held, k, was[k]);
      });
      if (!back) Object.entries(was).forEach(([k, v]) => { if (!now.has(k)) lit(state.held, k, v); });
    });
    const sortOf = (key) => state.sort[key] || { by: props.sorts[0].key, dir: "desc" };
    const sections = computed(() => (props.rows ? props.groups.filter((g) => !props.archive || g.closed).map((g) => {
      const order = sortOf(g.key);
      const spec = props.sorts.find((x) => x.key === order.by) || props.sorts[0];
      const value = spec.value || ((r) => r[spec.key]);
      const current = Object.fromEntries(props.rows.map((r) => [rowKey(r), r]));
      const held = Object.entries(state.held).filter(([, v]) => v.group === g.key).map(([k, v]) => current[k] || v.row);
      const moving = new Set(Object.keys(state.held));
      const rows = props.rows.filter((r) => g.match(r) && !moving.has(rowKey(r)) && (!g.closed || recent(r) !== props.archive)).concat(held).sort((a, b) => {
        const x = value(a), y = value(b);
        const c = x < y ? -1 : x > y ? 1 : 0;
        return order.dir === "asc" ? c : -c;
      });
      return { ...g, total: rows.length, rows: rows.slice(0, props.limit * (state.pages[g.key] || 1)) };
    }).filter((g) => g.total) : []));
    // a list whose rows open the inspector by link hands it the order they are shown in
    const trailOwner = {};
    watchEffect(() => {
      if (!props.href || props.pick) return;
      INSPECTOR_TRAIL.owner = trailOwner;
      INSPECTOR_TRAIL.current = null;
      INSPECTOR_TRAIL.items = sections.value.flatMap((g) => g.rows.map((r) => {
        const href = props.href(r);
        return { key: href, go: () => { location.hash = href; } };
      }));
    });
    onUnmounted(() => { if (INSPECTOR_TRAIL.owner === trailOwner) Object.assign(INSPECTOR_TRAIL, { owner: null, items: [], current: null }); });
    const closable = computed(() => props.groups.some((g) => g.closed));
    const archived = computed(() => sections.value.reduce((sum, g) => sum + g.total, 0));
    const setSort = (key, by, dir) => { state.sort[key] = { by, dir }; };
    const more = (key) => { state.pages[key] = (state.pages[key] || 1) + 1; };
    const open = (event, row) => { if (props.pick) { event.preventDefault(); props.pick(row); } };
    const moving = (r) => !!state.held[rowKey(r)];
    const fresh = (r) => !!state.arrived[rowKey(r)];
    return { state, sections, closable, archived, sortOf, setSort, more, open, moving, fresh, TYPES };
  },
  template: `
    <div v-if="bar" class=viewbar>
      <span v-if="rows && archive">{{ archived }} archived</span>
      <span v-else-if="rows && count">{{ count(rows) }}</span>
      <template v-if="home && closable">
        <span class=viewbar-sep aria-hidden=true></span>
        <a :class="['viewbar-archive', {on: archive}]" :href="archive ? home : home + '/archive'"
          :title="archive ? 'Back to the list' : 'Items closed more than a week ago'">{{ archive ? 'Close archive' : 'Archive' }}</a>
      </template>
      <span class=viewbar-tools>
        <slot name="tools"/>
      </span>
    </div>
    <p v-if="loading && !rows" class=empty>Loading…</p>
    <p v-else-if="error && !rows" class=error>{{ error }}</p>
    <template v-else-if="rows">
      <TransitionGroup tag="div" class=groups name="group" appear>
      <div v-for="g in sections" :key="g.key" class=lgroup>
        <div v-if="g.label" class=ghead>
          <StatusIcon v-if="g.kind" :kind="g.kind"/>{{ g.label }}<span class=n>{{ g.total }}</span>
          <span class=sort>
            <select v-if="sorts.length > 1" class=sort-select :value="sortOf(g.key).by" aria-label="Sort by"
              @change="setSort(g.key, $event.target.value, sortOf(g.key).dir)">
              <option v-for="o in sorts" :key="o.key" :value="o.key">{{ o.label }}</option>
            </select>
            <button type=button class="icon-btn sort-dir"
              :title="sortOf(g.key).dir === 'asc' ? 'Ascending — click for descending' : 'Descending — click for ascending'"
              :aria-label="sortOf(g.key).dir === 'asc' ? 'Sorted ascending' : 'Sorted descending'"
              @click="setSort(g.key, sortOf(g.key).by, sortOf(g.key).dir === 'asc' ? 'desc' : 'asc')">
              <Icon :name="sortOf(g.key).dir === 'asc' ? 'sort-asc' : 'sort-desc'"/>
            </button>
          </span>
        </div>
        <TransitionGroup tag="div" :class="['rows', {quiet: state.quiet}]" name="row" appear>
        <a v-for="(r, i) in g.rows" :key="r.n ?? r.name" :class="['row', 'lrow', {sel: selected && selected(r), struck: columns.struck && columns.struck(r), moving: moving(r), fresh: fresh(r)}]"
          :style="{'--i': i, '--num-w': columns.numWidth || '44px'}" :href="href(r)" @click="open($event, r)">
          <PriorityIcon v-if="columns.priority" :value="columns.priority(r)"/>
          <StatusIcon v-if="columns.status" :kind="columns.status(r)"/>
          <span v-if="columns.type" class=type :style="{ color: (TYPES[columns.type(r)] || {}).tint }">{{ (TYPES[columns.type(r)] || {}).label }}</span>
          <span v-if="columns.num" class=num>{{ columns.num(r) }}</span>
          <span v-if="columns.question" :class="['qmark', columns.question(r).state]" :title="columns.question(r).title"
            :aria-label="columns.question(r).title || null"><Icon v-if="columns.question(r).state" name="questions"/></span>
          <div class=stack><div class=title>{{ columns.title(r) }}</div>
            <div v-if="(columns.sub && columns.sub(r)) || (columns.cite && columns.cite(r))" :class="['sub', {'only-cite': !(columns.sub && columns.sub(r))}]">{{ columns.sub ? columns.sub(r) : '' }}<span v-if="columns.cite && columns.cite(r)" class=sub-cite>{{ columns.sub && columns.sub(r) ? ' · ' : '' }}{{ columns.cite(r) }}</span></div></div>
          <span v-if="columns.cite" class=cite>{{ columns.cite(r) }}</span>
          <span v-if="columns.age" :class="['age', {warn: columns.ageWarn && columns.ageWarn(r)}]">{{ columns.age(r) }}</span>
        </a>
        </TransitionGroup>
        <button v-if="g.rows.length < g.total" type=button class="btn more-rows" @click="more(g.key)">Show {{ Math.min(limit, g.total - g.rows.length) }} more</button>
      </div>
      </TransitionGroup>
      <p v-if="!sections.length" class=empty>{{ archive ? 'Nothing here closed more than a week ago.' : rows.length && closable ? 'Nothing here is open, and nothing closed in the last week.' : empty }}</p>
    </template>`,
};

// after a write: refresh what is on screen, then follow the resource to its number when it has one
function settle(body, action, base, ...shown) {
  changed();
  shown.forEach((f) => f && f.reload());
  const n = body && body.data && body.data.n;
  const to = action.follow ? action.follow(body) : null;
  if (to) location.hash = to;
  else if (n && base) location.hash = `${base}/${n}`;
  else if (action.leave && base) location.hash = base;
}

// one overview for the whole page: the shell loads and polls it, every view reads this
const OVERVIEW = reactive({ data: null });
// whether the Activity column is shown, remembered in this browser
const ACTIVITY_KEY = "journal.activity.shown";
const ACTIVITY = reactive({ shown: (() => { try { return localStorage.getItem(ACTIVITY_KEY) !== "0"; } catch (e) { return true; } })() });
function setActivityShown(shown) {
  ACTIVITY.shown = shown;
  try { localStorage.setItem(ACTIVITY_KEY, shown ? "1" : "0"); } catch (e) { /* storage off */ }
}

function useEnvironments(current) {
  return computed(() => (OVERVIEW.data ? OVERVIEW.data.environments.map((e) => e.name).filter((name) => name !== current()) : []));
}

function envField(names, label = "Environment") {
  return { name: "environment", label, kind: "select", value: "",
           options: [{ value: "", label: "Choose one" }, ...names.map((name) => ({ value: name, label: name }))] };
}

const PRIORITIES = [{ value: "low", label: "Low" }, { value: "default", label: "Default" },
                    { value: "high", label: "High" }, { value: "critical", label: "Critical" }];

// ─────────────────────────────────────────────────────────────── to-dos
const GROUPS = [
  { key: "progress", label: "In progress" },
  { key: "waiting", label: "Waiting on the user" },
  { key: "blocked", label: "Blocked" },
  { key: "open", label: "Open" },
  { key: "done", label: "Done" },
];
const STATUS_LABEL = Object.fromEntries(GROUPS.map((g) => [g.key, g.label]));

function todoStatus(t) {
  const s = t.states || [];
  if (s.includes("done")) return "done";
  if (s.includes("asks")) return "waiting";
  if (s.includes("blocked") || (t.waiting_on && t.waiting_on.length)) return "blocked";
  if (s.includes("started") || s.includes("assigned") || s.includes("reported")) return "progress";
  return "open";
}

function messageBecame(m) { return [...new Set(m.parts.flatMap((p) => p.became.map((b) => b.label)))].join(", "); }

// a to-do row's question marker: lit while a linked question is open, faint once all are answered
function todoQuestionMark(t) {
  const open = t.questions_open || 0, answered = t.questions_answered || 0;
  if (open) return { state: "open", title: open === 1 ? "1 open question" : `${open} open questions` };
  if (answered) return { state: "answered", title: answered === 1 ? "1 answered question" : `${answered} answered questions` };
  return { state: "", title: "" };
}

const TODO_LIST = {
  groups: GROUPS.map((g) => ({ ...g, kind: g.key, closed: g.key === "done", match: (t) => todoStatus(t) === g.key })),
  columns: { priority: (t) => t.priority, status: (t) => todoStatus(t), num: (t) => `#${t.n}`, question: todoQuestionMark,
             title: (t) => t.title, cite: (t) => (t.doc ? `Doc ${t.doc}` : ""), age: (t) => t.age },
  sorts: [{ key: "n", label: "ID" }, { key: "priority", label: "Priority", value: (t) => t.priority ?? 100 }],
  count: (rows) => `${rows.filter((t) => todoStatus(t) !== "done").length} open`,
  empty: "Nothing is waiting on this environment.", name: "todos",
};
const CLAIM_LIST = {
  groups: [{ key: "standing", label: "Standing", kind: "open", match: (c) => !c.struck },
           { key: "struck", label: "Struck", kind: "withdrawn", closed: true, match: (c) => c.struck }],
  columns: { num: (c) => `#${c.n}`, title: (c) => c.fact, cite: (c) => (docOf(c.meta) ? `Doc ${docOf(c.meta)}` : ""),
             age: (c) => ageOf(c.meta), struck: (c) => c.struck },
  count: (rows) => `${rows.filter((c) => !c.struck).length} standing`,};
const MESSAGE_LIST = {
  groups: [{ key: "waiting", label: "Waiting", kind: "waiting", match: (m) => m.status === "waiting" },
           { key: "processed", label: "Processed", kind: "done", closed: true, match: (m) => m.status === "processed" || m.status === "moved" },
           { key: "archived", label: "Archived", kind: "withdrawn", closed: true, match: (m) => m.status === "archived" }],
  columns: { status: (m) => (m.status !== "waiting" ? "done" : m.read ? "progress" : "waiting"), num: (m) => `#${m.n}`, title: (m) => m.text,
             cite: messageBecame, age: (m) => m.age },
  count: (rows) => `${rows.filter((m) => m.status === "waiting").length} waiting`,
  empty: "No messages yet.",
};
const QUESTION_LIST = {
  groups: [{ key: "open", label: "Open", kind: "waiting", match: (q) => q.status === "open" },
           { key: "answered", label: "Answered", kind: "done", closed: true, match: (q) => q.status === "answered" },
           { key: "withdrawn", label: "Withdrawn", kind: "withdrawn", closed: true, match: (q) => q.status === "withdrawn" }],
  columns: { status: (q) => questionKind(q), num: (q) => `#${q.n}`, title: (q) => q.text,
             cite: (q) => q.links.map((l) => l.label).join(", "), age: (q) => q.age },
  count: (rows) => `${rows.filter((q) => q.status === "open").length} open`,  empty: "Nothing has been asked on this environment.", name: "questions",
};
const LOG_KIND = { started: "Started", update: "Update", waiting: "Waiting on", commit: "Committed", ended: "Ended" };
const WORK_LIST = {
  groups: [{ key: "open", label: "Open", kind: "progress", match: (w) => !w.ended },
           { key: "ended", label: "Ended", kind: "done", closed: true, match: (w) => w.ended }],
  columns: { title: (w) => w.subject, sub: (w) => (w.notes.length ? w.notes[w.notes.length - 1].text : ""),
             cite: (w) => [w.todo && `To-do ${w.todo}`, w.doc && `Doc ${w.doc}`].filter(Boolean).join(", "), age: (w) => w.age },
  count: (rows) => `${rows.filter((w) => !w.ended).length} open`, empty: "Nothing is open.", name: "work",
};
const REMINDER_LIST = {
  groups: [{ key: "standing", label: "Standing", kind: "open", match: (r) => !r.struck },
           { key: "retired", label: "Retired", kind: "withdrawn", closed: true, match: (r) => r.struck }],
  columns: { num: (r) => `#${r.n}`, title: (r) => r.text, cite: (r) => r.until || "", struck: (r) => r.struck },
  count: (rows) => `${rows.filter((r) => !r.struck).length} standing`,  empty: "Nothing is being repeated.", name: "reminders",
};
const DOC_LIST = {
  groups: [{ key: "draft", label: "Draft", kind: "open", match: (d) => !d.archived && !d.superseded_by && d.status !== "final" },
           { key: "final", label: "Final", kind: "done", match: (d) => !d.archived && !d.superseded_by && d.status === "final" },
           { key: "superseded", label: "Superseded", kind: "withdrawn", match: (d) => !d.archived && d.superseded_by },
           { key: "archived", label: "Archived", kind: "withdrawn", match: (d) => d.archived && !d.superseded_by }],
  columns: { num: (d) => `#${d.n}`, title: (d) => d.title, sub: (d) => d.abstract, age: (d) => d.age, struck: (d) => d.superseded_by,
             cite: (d) => (d.attachments ? (d.attachments === 1 ? "1 file" : `${d.attachments} files`) : "") },
  count: (rows) => (rows.length && rows.every((d) => d.archived) ? `${rows.length} archived` : `${rows.length} catalogued`), name: "docs",
};
const TOOL_LIST = {
  groups: [{ key: "tools", label: "Catalogued", match: () => true }],
  columns: { num: (t) => t.name, numWidth: "120px", title: (t) => t.title, sub: (t) => t.summary, age: (t) => t.age },
  sorts: [{ key: "n", label: "ID" }, { key: "name", label: "Name" }],
  count: (rows) => `${rows.length} catalogued`, empty: "No tools are catalogued.",
};

function priorityName(value) {
  const v = Number(value ?? 100);
  return v >= 200 ? "Critical" : v > 100 ? "High" : v < 100 ? "Low" : "Default";
}

// ─────────────────────────────────────────────────────────────── one detail panel per resource, used on its page and on Home
// props: env, n; close (a link) or onClose (a function); base: where a write lands on the page; link: the header's page link;
// reloaded: called after a write, so the page's list refreshes
const PANEL_PROPS = ["env", "n", "close", "onClose", "base", "link", "reloaded"];

function panelDone(props, item) {
  return (body, a) => { settle(body, a, props.base, item); if (props.reloaded) props.reloaded(); };
}

const TodoPanel = {
  props: PANEL_PROPS,
  components: { Panel, StatusIcon, PriorityIcon, LinkedQuestions, ActionBar, FromMessages, Comments },
  setup(props) {
    const api = computed(() => `/api/env/${props.env}/todos`);
    const item = useFetch(() => props.env && props.n && `${api.value}/${props.n}`);
    const envs = useEnvironments(() => props.env);
    const actions = computed(() => {
      const t = item.data;
      if (!t) return [];
      const url = `${api.value}/${t.n}`;
      if (t.done) return [{ label: "Reopen", method: "POST", url: `${url}/reopen`, fields: [{ name: "why", label: "Why it is open again" }] }];
      return [
        { label: "Edit", method: "PATCH", url, only: true, submit: "Save",
          fields: [{ name: "title", label: "Title", value: t.title },
                   { name: "body", label: "Brief", kind: "area", value: t.body || "" },
                   { name: "priority", label: "Priority", kind: "select", value: priorityName(t.priority).toLowerCase(), options: PRIORITIES }] },
        { label: "Mark done", method: "POST", url: `${url}/done`, fields: [{ name: "how", label: "How it was finished" }] },
        { label: "Waits on", method: "POST", url: `${url}/after`, submit: "Save",
          fields: [{ name: "names", label: "To-do numbers it waits on", value: t.after.join(", "), placeholder: "3, 7" }],
          note: "It cannot start before those are done. Leave it empty to wait on nothing.",
          shape: (p) => (p.names.trim() ? p : { none: true }) },
        { label: "Move", method: "POST", url: `${url}/move`, fields: [envField(envs.value)], leave: true,
          note: "It gets a new number on the other environment." },
        { label: "Drop", method: "DELETE", url, danger: true, fields: [{ name: "why", label: "Why it is dropped" }] },
      ];
    });
    const done = panelDone(props, item);
    const todoHref = (a) => `#/env/${props.env}/todos/${a}`;
    // the priority row is one button; it opens a menu of the levels, and choosing one saves
    const LEVELS = [{ value: "low", n: 50 }, { value: "default", n: 100 }, { value: "high", n: 150 }, { value: "critical", n: 200 }];
    const saving = reactive({ on: false });
    const menu = reactive({ open: false });
    const outside = (e) => { if (!e.target.closest(".prio-wrap")) menu.open = false; };
    const escape = (e) => { if (e.key === "Escape") menu.open = false; };
    watchEffect((onCleanup) => {
      if (!menu.open) return;
      document.addEventListener("mousedown", outside);
      document.addEventListener("keydown", escape);
      onCleanup(() => { document.removeEventListener("mousedown", outside); document.removeEventListener("keydown", escape); });
    });
    const setPriority = (level) => {
      menu.open = false;
      if (saving.on || !item.data || priorityName(item.data.priority).toLowerCase() === level.value) return;
      saving.on = true;
      send("PATCH", `${api.value}/${item.data.n}`, { priority: level.value })
        .then(() => { item.reload(); if (props.reloaded) props.reloaded(); changed(); })
        .finally(() => { saving.on = false; });
    };
    return { item, actions, done, todoHref, todoStatus, STATUS_LABEL, priorityName, LOG_KIND, LEVELS, saving, menu, setPriority };
  },
  template: `
    <Panel :label="'To-do #' + n" :close="close" :onClose="onClose" :link="link">
      <p v-if="item.error" class=error>{{ item.error }}</p>
      <template v-else-if="item.data">
        <h2 class=p-title>{{ item.data.title }}</h2>
        <dl class=props>
          <dt>Status</dt><dd><StatusIcon :kind="todoStatus(item.data)"/>{{ STATUS_LABEL[todoStatus(item.data)] }}</dd>
          <dt>Priority</dt>
          <dd v-if="item.data.done"><PriorityIcon :value="item.data.priority"/>{{ priorityName(item.data.priority) }}</dd>
          <dd v-else class=prio-wrap>
            <button type=button class=prio-current :disabled="saving.on" aria-haspopup=menu :aria-expanded="menu.open"
              :title="'Priority: ' + priorityName(item.data.priority) + ' (click to change)'" @click="menu.open = !menu.open">
              <PriorityIcon :value="item.data.priority"/><span>{{ priorityName(item.data.priority) }}</span>
            </button>
            <div v-if="menu.open" class=prio-menu role=menu>
              <button v-for="l in LEVELS" :key="l.value" type=button role=menuitemradio
                :class="['prio-option', {on: priorityName(item.data.priority).toLowerCase() === l.value}]"
                :aria-checked="priorityName(item.data.priority).toLowerCase() === l.value" @click="setPriority(l)">
                <PriorityIcon :value="l.n"/><span>{{ priorityName(l.n) }}</span>
              </button>
            </div>
          </dd>
          <dt>Cites</dt><dd><a v-if="item.data.doc" :href="'#/docs/' + item.data.doc">Doc {{ item.data.doc }}</a><span v-else class=muted>—</span></dd>
          <template v-if="item.data.plan"><dt>Plan</dt><dd><a :href="'#/env/' + env + '/plans/' + item.data.plan.n">Plan {{ item.data.plan.n }} · phase {{ item.data.plan.phase }}</a></dd></template>
          <dt>Added</dt><dd>{{ item.data.age || '—' }}</dd>
          <template v-if="item.data.after.length">
            <dt>Waits on</dt><dd><a v-for="a in item.data.after" :key="a" :href="todoHref(a)">#{{ a }}</a></dd>
          </template>
        </dl>
        <ActionBar :actions="actions" :done="done" :key="'todo' + item.data.n + (item.data.done || '')"/>
        <div v-if="item.data.done" class=note>Closed: {{ item.data.how || 'done' }}</div>
        <div v-if="item.data.blocked" class=note>Set aside until {{ item.data.blocked }}</div>
        <div v-if="item.data.asks" class=note>
          <p class=section-label>{{ item.data.answer ? 'The user answered' : 'Waiting on the user' }}</p>
          <div>{{ item.data.asks }}</div>
          <div v-if="item.data.answer" class=muted>→ {{ item.data.answer }}</div>
        </div>
        <div>
          <p class=section-label>Brief</p>
          <div v-if="item.data.body" class="md prose" v-html="$md(item.data.body)"></div>
          <p v-else class="prose muted">Title only; no brief was written.</p>
        </div>
        <div v-if="item.data.log && item.data.log.length">
          <p class=section-label>Work log</p>
          <div class=linked>
            <component :is="e.work && e.kind !== 'commit' ? 'a' : 'div'" v-for="(e, i) in item.data.log" :key="i" class="sub log-row"
              :href="e.work && e.kind !== 'commit' ? '#/env/' + env + '/work/' + e.work : null" :title="e.work && e.kind !== 'commit' ? 'Open work ' + e.work : null">
              <span class=log-text><span class=muted>{{ LOG_KIND[e.kind] }} · {{ e.age || 'just now' }}</span>
                <a v-if="e.kind === 'commit'" class="chip sha" :href="'#/env/' + env + '/commits/' + e.sha" :title="'What commit ' + e.sha.slice(0, 7) + ' covered'">{{ e.sha.slice(0, 7) }}</a><span v-if="e.text && e.kind !== 'started'" :class="{'sha-subject': e.kind === 'commit'}"> — <span v-html="$linkify(e.text)"></span></span></span>
              <a v-if="e.work && e.kind === 'commit'" class=log-work :href="'#/env/' + env + '/work/' + e.work">Work {{ e.work }}</a>
              <span v-else-if="e.work" class=log-work>Work {{ e.work }}</span>
            </component>
          </div>
        </div>
        <FromMessages :rows="item.data.from_messages" :env="env"/>
        <LinkedQuestions :rows="item.data.questions" :env="env"/>
        <Comments :about="'todo ' + item.data.n" :env="env" :key="'c-todo' + item.data.n"/>
      </template>
    </Panel>`,
};

const QuestionPanel = {
  props: PANEL_PROPS,
  components: { Panel, StatusIcon, ActionBar, FromMessages, QuestionAnswer },
  setup(props) {
    const api = computed(() => `/api/env/${props.env}/questions`);
    const item = useFetch(() => props.env && props.n && `${api.value}/${props.n}`);
    const onAnswered = (data) => {
      const wasOpen = item.data && item.data.status === "open";
      item.data = data;
      if (props.reloaded) props.reloaded();
      if (wasOpen) advanceInspector(props);
    };
    const actions = computed(() => {
      const q = item.data;
      if (!q || q.withdrawn) return [];
      const url = `${api.value}/${q.n}`;
      return [
        { label: "Edit", method: "PATCH", url, only: true, submit: "Save", fields: [{ name: "text", label: "Question", kind: "area", value: q.text }],
          note: q.answer ? "The agent is told the question changed." : "" },
        { label: "Withdraw", method: "DELETE", url, danger: true, fields: [{ name: "why", label: "Why it no longer needs an answer" }] },
      ];
    });
    const done = panelDone(props, item);
    // opening an open question is the user seeing it: Activity stops asking for their attention
    let marked = false;
    watch(() => item.data, (q) => {
      if (marked || !q || q.status !== "open" || q.seen) return;
      marked = true;
      postJSON(`${api.value}/${q.n}/seen`, {}).then(() => changed()).catch(() => { marked = false; });
    }, { immediate: true });
    return { item, onAnswered, questionKind, actions, done };
  },
  template: `
    <Panel :label="'Question #' + n" :close="close" :onClose="onClose" :link="link">
      <p v-if="item.error" class=error>{{ item.error }}</p>
      <template v-else-if="item.data">
        <div class="md p-title" v-html="$md(item.data.text)"></div>
        <dl class=props>
          <dt>Status</dt><dd><StatusIcon :kind="questionKind(item.data)"/>{{ item.data.status === 'open' ? 'Open' : item.data.status === 'answered' ? 'Answered' : 'Withdrawn' }}</dd>
          <dt>About</dt><dd>
            <template v-for="l in item.data.links" :key="l.ref">
              <a v-if="$refHref(l.ref, env)" :href="$refHref(l.ref, env)" class=chip>{{ l.label }}</a>
              <span v-else class=chip>{{ l.label }}</span>
            </template>
            <span v-if="!item.data.links.length" class=muted>—</span>
          </dd>
          <dt>Asked</dt><dd>{{ item.data.age || '—' }}</dd>
        </dl>
        <ActionBar :actions="actions" :done="done" :key="'question' + item.data.n + item.data.status"/>
        <FromMessages :rows="item.data.from_messages" :env="env"/>
        <div v-if="item.data.description" class="md prose" v-html="$md(item.data.description)"></div>
        <div v-if="item.data.answer">
          <p class=section-label>Answer<span v-if="item.data.answered_age"> · {{ item.data.answered_age }}</span></p>
          <div class="md prose" v-html="$md(item.data.answer)"></div>
        </div>
        <div v-if="item.data.withdrawn" class=note>Withdrawn: {{ item.data.withdrawn }}</div>
        <QuestionAnswer v-else :env="env" :q="item.data" @answered="onAnswered"/>
      </template>
    </Panel>`,
};

const MessagePanel = {
  props: PANEL_PROPS,
  components: { Panel, StatusIcon, ActionBar, Comments },
  setup(props) {
    const api = computed(() => `/api/env/${props.env}/inbox`);
    const item = useFetch(() => props.env && props.n && `${api.value}/${props.n}`);
    const envs = useEnvironments(() => props.env);
    const heldUrl = (m, f) => `/inbox-files/${props.env}/${m.n}/${encodeURIComponent(f.name)}`;
    const isImage = (name) => /\.(png|jpe?g|gif|webp|svg|avif)$/i.test(name);
    const actions = computed(() => {
      const m = item.data;
      if (!m || m.status === "archived") return [];
      const url = `${api.value}/${m.n}`;
      const archive = { label: "Archive", method: "DELETE", url, danger: true, submit: "Archive",
                        fields: [{ name: "why", label: "Why it needs nothing more" }] };
      if (m.status !== "waiting") return [archive];
      return [archive,
        { label: "Edit", method: "PATCH", url, only: true, submit: "Save", fields: [{ name: "text", label: "Message", kind: "area", value: m.text }] },
        { label: "Move", method: "POST", url: `${url}/move`, fields: [envField(envs.value)], leave: true,
          note: "For a message left on the wrong environment: it waits there instead." },
      ];
    });
    const settled = panelDone(props, item);
    const done = (body, a) => { settled(body, a); if (a.label === "Archive") advanceInspector(props); };
    // taking one file off the message: it asks why, and the file is kept under struck/
    const removing = reactive({ name: "", why: "", busy: false, error: "" });
    const startRemove = (f) => Object.assign(removing, { name: f.name, why: "", busy: false, error: "" });
    const cancelRemove = () => { removing.name = ""; removing.error = ""; };
    const confirmRemove = async () => {
      if (!removing.why.trim() || removing.busy || !item.data) return;
      removing.busy = true;
      removing.error = "";
      try {
        await postJSON(`${api.value}/${item.data.n}/detach`, { name: removing.name, why: removing.why });
        removing.name = "";
        item.reload();
        changed();
      } catch (err) {
        removing.error = err.message;
      } finally {
        removing.busy = false;
      }
    };
    // adding files to a message already sent: read each as a data URL, the way the message box does
    const attaching = reactive({ busy: false, error: "" });
    const readFile = (file) => new Promise((resolve, reject) => {
      const r = new FileReader();
      r.onload = () => resolve({ name: file.name, data: String(r.result) });
      r.onerror = () => reject(new Error(`Could not read ${file.name}`));
      r.readAsDataURL(file);
    });
    const attachFiles = async (event) => {
      const picked = Array.from(event.target.files || []);
      event.target.value = "";
      if (!picked.length || attaching.busy || !item.data) return;
      attaching.busy = true;
      attaching.error = "";
      try {
        const files = await Promise.all(picked.map(readFile));
        await postJSON(`${api.value}/${item.data.n}/attach`, { files });
        item.reload();
        changed();
      } catch (err) {
        attaching.error = err.message;
      } finally {
        attaching.busy = false;
      }
    };
    return { item, actions, done, heldUrl, isImage, removing, startRemove, cancelRemove, confirmRemove, attaching, attachFiles };
  },
  template: `
    <Panel :label="'Message #' + n" :close="close" :onClose="onClose" :link="link">
      <p v-if="item.error" class=error>{{ item.error }}</p>
      <template v-else-if="item.data">
        <div class="prose message" v-html="$linkify(item.data.text)"></div>
        <dl class=props>
          <dt>Status</dt><dd :title="item.data.status === 'waiting' && item.data.read ? 'The agent read it ' + item.data.read_age : null"><StatusIcon :kind="item.data.status !== 'waiting' ? 'done' : item.data.read ? 'progress' : 'waiting'"/>{{ item.data.status === 'waiting' ? (item.data.read ? 'Being handled' : 'Waiting to be processed') : item.data.status === 'moved' ? 'Moved to ' + item.data.moved_to : item.data.status === 'archived' ? 'Archived: ' + item.data.archived : 'Processed' }}</dd>
          <dt>Left</dt><dd>{{ item.data.age || '—' }}</dd>
          <dt>From</dt><dd>{{ item.data.source === 'web' ? 'The browser' : 'The terminal' }}</dd>
        </dl>
        <ActionBar :actions="actions" :done="done" :key="'message' + item.data.n + item.data.status"/>
        <div>
          <div class=files-head>
            <p class=section-label>Files</p>
            <label :class="['btn', {disabled: attaching.busy}]" :aria-disabled="attaching.busy">
              {{ attaching.busy ? 'Adding…' : 'Attach files' }}<input type=file multiple hidden :disabled="attaching.busy" @change="attachFiles">
            </label>
          </div>
          <p v-if="attaching.error" class=error>{{ attaching.error }}</p>
          <p v-if="!item.data.files || !item.data.files.length" class="prose muted">No files. Files you add are kept with the message, and the agent is told.</p>
          <div v-else class=files>
            <template v-for="f in item.data.files" :key="f.name">
              <div v-if="f.removed" class="file-row removed">
                <span class=file-name :title="f.name">{{ f.name }}</span><span class=file-meta :title="f.filed_label">{{ f.filed_label }} · {{ $human(f.size) }}</span>
              </div>
              <a v-else-if="f.filed.startsWith('doc:')" class=file-row :href="'#/docs/' + f.filed.slice(4)">
                <span class=file-name>{{ f.name }}</span><span class=file-meta>{{ f.filed_label }} · {{ $human(f.size) }}</span>
              </a>
              <template v-else>
                <div class=file-held>
                  <a class=file-row :href="heldUrl(item.data, f)" target=_blank rel=noopener>
                    <span class=file-name>{{ f.name }}</span><span class=file-meta>{{ f.filed_label }} · {{ $human(f.size) }}</span>
                  </a>
                  <button v-if="removing.name !== f.name" type=button class=btn :aria-label="'Remove ' + f.name" @click="startRemove(f)">Remove</button>
                </div>
                <form v-if="removing.name === f.name" class=file-remove @submit.prevent="confirmRemove">
                  <input v-model="removing.why" :placeholder="'Why remove ' + f.name + '?'" :aria-label="'Why remove ' + f.name" :disabled="removing.busy"
                    @keydown.esc.prevent="cancelRemove" @vue:mounted="({ el }) => el.focus()">
                  <button type=submit class="btn danger" :disabled="removing.busy || !removing.why.trim()">Remove</button>
                  <button type=button class=btn :disabled="removing.busy" @click="cancelRemove">Cancel</button>
                </form>
                <p v-if="removing.name === f.name && removing.error" class=error>{{ removing.error }}</p>
                <img v-if="isImage(f.name)" class=file-preview :src="heldUrl(item.data, f)" :alt="f.name" loading=lazy>
              </template>
            </template>
          </div>
        </div>
        <div v-if="item.data.replies && item.data.replies.length">
          <p class=section-label>Replies</p>
          <div class=linked>
            <div v-for="(r, i) in item.data.replies" :key="i" :class="['sub', 'reply', {'from-agent': r.who === 'the agent'}]">
              <div class=muted>{{ r.who === 'the agent' ? 'The agent' : 'You' }}{{ r.part ? ' answered' : '' }} · {{ r.age || 'just now' }}</div>
              <blockquote v-if="r.part" class=reply-part>{{ r.part }}</blockquote>
              <div class="md prose" v-html="$md(r.text)"></div>
            </div>
          </div>
        </div>
        <div v-if="item.data.parts.length">
          <p class=section-label>What it became</p>
          <div class=part v-for="(p, i) in item.data.parts" :key="i">
            <div class=excerpt>«{{ p.excerpt }}»</div>
            <template v-for="b in p.became" :key="b.ref">
              <a v-if="$refHref(b.ref, env)" :href="$refHref(b.ref, env)" class=chip>{{ b.label }}</a>
              <span v-else class=chip>{{ b.label }}</span>
            </template>
          </div>
        </div>
        <p v-else-if="item.data.status === 'waiting' && item.data.read" class="prose muted">The agent has read it and is handling it. It splits it into parts and records what each became.</p>
        <p v-else-if="item.data.status === 'waiting'" class="prose muted">Not processed yet. At its next stop the agent splits it into parts and records what each became.</p>
        <Comments :about="'message ' + item.data.n" :env="env" :key="'c-message' + item.data.n"/>
      </template>
    </Panel>`,
};

const WorkPanel = {
  props: PANEL_PROPS,
  components: { Panel, ActionBar, Comments },
  setup(props) {
    const api = computed(() => `/api/env/${props.env}/work`);
    const item = useFetch(() => props.env && props.n && `${api.value}/${props.n}`);
    const actions = computed(() => {
      const w = item.data;
      if (!w || w.ended) return [];
      const url = `${api.value}/${w.n}`;
      return [
        { label: "End work", method: "DELETE", url, danger: true, submit: "End it",
          note: "Ending work does not close a to-do of the same title." },
      ];
    });
    const done = panelDone(props, item);
    return { item, actions, done };
  },
  template: `
    <Panel :label="'Work #' + n" :close="close" :onClose="onClose" :link="link">
      <p v-if="item.error" class=error>{{ item.error }}</p>
      <template v-else-if="item.data">
        <h2 class=p-title>{{ item.data.subject }}</h2>
        <dl class=props>
          <dt>Started</dt><dd>{{ item.data.age || '—' }}</dd>
          <dt v-if="item.data.ended">Ended</dt><dd v-if="item.data.ended">{{ item.data.ended_age || 'just now' }}</dd>
          <dt>Status</dt><dd>{{ item.data.ended ? 'Ended' : item.data.awaiting ? 'Waiting on ' + item.data.awaiting : 'Open' }}</dd>
          <template v-if="item.data.todo"><dt>To-do</dt><dd><a class=chip :href="'#/env/' + env + '/todos/' + item.data.todo">To-do {{ item.data.todo }}</a></dd></template>
          <template v-if="item.data.doc"><dt>Document</dt><dd><a class=chip :href="'#/docs/' + item.data.doc">Doc {{ item.data.doc }}</a></dd></template>
        </dl>
        <ActionBar :actions="actions" :done="done" :key="'work' + item.data.n + (item.data.ended || '')"/>
        <div v-if="item.data.files && item.data.files.length">
          <p class=section-label>Files changed <span class=muted>{{ item.data.files.length }}</span></p>
          <div class=work-files>
            <div v-for="f in item.data.files" :key="f.path" class=work-file :title="f.path">
              <span class=work-file-path>{{ f.path }}</span>
              <span v-if="f.created" class=work-file-new>new</span>
              <span class=work-file-add>+{{ f.added }}</span><span class=work-file-del>−{{ f.removed }}</span>
            </div>
          </div>
        </div>
        <div v-if="item.data.commits && item.data.commits.length">
          <p class=section-label>Commits <span class=muted>{{ item.data.commits.length }}</span></p>
          <div class=linked>
            <div v-for="c in item.data.commits" :key="c.sha" class="sub log-row">
              <span class=log-text><a class="chip sha" :href="'#/env/' + env + '/commits/' + c.sha" :title="'What commit ' + c.sha.slice(0, 7) + ' covered'">{{ c.sha.slice(0, 7) }}</a> <span class=sha-subject>{{ c.subject }}</span></span>
            </div>
          </div>
        </div>
        <div v-if="item.data.notes.length">
          <p class=section-label data-shut>Work log <span class=muted>{{ item.data.notes.length }}</span></p>
          <div class=linked><div v-for="(note, i) in item.data.notes" :key="i" class=sub v-html="$linkify(note.text)"></div></div>
        </div>
        <Comments :about="'work ' + item.data.n" :env="env" :key="'c-work' + item.data.n"/>
      </template>
    </Panel>`,
};

const SUGGESTION_LIST = {
  groups: [{ key: "open", label: "Waiting on you", kind: "waiting", match: (s) => s.status === "open" },
           { key: "accepted", label: "Accepted", kind: "done", closed: true, match: (s) => s.status === "accepted" || s.status === "adjusted" },
           { key: "declined", label: "Declined", kind: "withdrawn", closed: true, match: (s) => s.status === "declined" },
           { key: "withdrawn", label: "Withdrawn", kind: "withdrawn", closed: true, match: (s) => s.status === "withdrawn" }],
  columns: { num: (s) => `#${s.n}`, title: (s) => s.title, sub: (s) => s.gist, age: (s) => s.age,
             struck: (s) => s.status === "declined" || s.status === "withdrawn" },
  count: (rows) => `${rows.filter((s) => s.status === "open").length} waiting on you`,  name: "suggestions", empty: "No suggestions on this environment.",
};

const SUGGESTION_STATUS = { open: "Waiting on you", accepted: "Accepted", adjusted: "Accepted with your change",
                            declined: "Declined", withdrawn: "Withdrawn by the agent" };

const SuggestionPanel = {
  props: PANEL_PROPS,
  components: { Panel, ActionBar, Comments },
  setup(props) {
    const api = computed(() => `/api/env/${props.env}/suggestions`);
    const item = useFetch(() => props.env && props.n && `${api.value}/${props.n}`);
    const actions = computed(() => {
      const s = item.data;
      if (!s || s.status !== "open") return [];
      const url = `${api.value}/${s.n}`;
      return [
        { label: "Accept", method: "POST", url: `${url}/accept`, submit: "Accept",
          fields: [{ name: "note", label: "A note for the to-do (optional)", kind: "area" }],
          note: "A to-do is filed from it." },
        { label: "Adjust", method: "POST", url: `${url}/adjust`, submit: "Accept with this change",
          fields: [{ name: "change", label: "What to do differently", kind: "area" }],
          note: "A to-do is filed from it, carrying your change." },
        { label: "Decline", method: "POST", url: `${url}/decline`, danger: true, submit: "Decline",
          fields: [{ name: "why", label: "Why not (optional)" }],
          note: "The agent does not suggest it again." },
      ];
    });
    const settled = panelDone(props, item);
    const done = (body, a) => { settled(body, a); if (["Accept", "Adjust", "Decline"].includes(a.label)) advanceInspector(props); };
    return { item, actions, done, SUGGESTION_STATUS };
  },
  template: `
    <Panel :label="'Suggestion #' + n" :close="close" :onClose="onClose" :link="link">
      <p v-if="item.error" class=error>{{ item.error }}</p>
      <template v-else-if="item.data">
        <h2 class=p-title>{{ item.data.title }}</h2>
        <dl class=props>
          <dt>Status</dt><dd>{{ SUGGESTION_STATUS[item.data.status] }}</dd>
          <dt>Suggested</dt><dd>{{ item.data.age || 'just now' }}</dd>
          <dt>About</dt><dd>
            <template v-for="l in item.data.links" :key="l.ref">
              <a v-if="$refHref(l.ref, env)" :href="$refHref(l.ref, env)" class=chip>{{ l.label }}</a>
              <span v-else class=chip>{{ l.label }}</span>
            </template>
            <span v-if="!item.data.links.length" class=muted>—</span>
          </dd>
          <template v-if="item.data.became"><dt>Became</dt><dd><a class=chip :href="$refHref(item.data.became, env)">{{ item.data.became.replace('todo:', 'To-do ') }}</a></dd></template>
        </dl>
        <ActionBar :actions="actions" :done="done" :key="'suggestion' + item.data.n + item.data.status"/>
        <div v-if="item.data.declined" class=note>Declined: {{ item.data.declined }}</div>
        <div v-if="item.data.withdrawn" class=note>Withdrawn: {{ item.data.withdrawn }}</div>
        <div>
          <p class=section-label>Why</p>
          <div class="md prose" v-html="$md(item.data.body)"></div>
        </div>
        <div v-if="item.data.change">
          <p class=section-label>Your change</p>
          <div class="md prose" v-html="$md(item.data.change)"></div>
        </div>
        <Comments :about="'suggestion ' + item.data.n" :env="env" :key="'c-suggestion' + item.data.n"/>
      </template>
    </Panel>`,
};

const Suggestions = {
  props: ["env", "archive", "n"],
  components: { TopBar, ResourceList, SuggestionPanel, Panel, ActionBar },
  setup(props) {
    const home = computed(() => `#/env/${props.env}/suggestions`);
    const base = computed(() => home.value + (props.archive || ""));
    const list = useFetch(() => props.env && `/api/env/${props.env}/suggestions?all=1`);
    // the viewer cannot start an agent, so asking is a message: the agent sends a subagent to look and files what it finds
    const asking = computed(() => [{
      label: "Ask for suggestions", method: "POST", url: `/api/env/${props.env}/inbox`, submit: "Send to the agent", leave: true,
      fields: [{ name: "scope", label: "What to look at (optional)", kind: "area",
                 placeholder: "An area, a worry or a goal to focus on. Leave empty to let the agent choose." }],
      shape: ({ scope }) => ({ files: [], text: "Please look for suggestions: send a background subagent to research this environment "
        + "and file what it finds with `journal suggest`, while you carry on with your own work."
        + (scope && scope.trim() ? `\n\nFocus on: ${scope.trim()}` : "") }),
    }]);
    const done = (body, a) => { changed(); location.hash = base.value; };
    return { list, home, base, SUGGESTION_LIST, asking, done };
  },
  template: `
    <TopBar :crumbs="archive ? [env, 'Suggestions', 'Archive'] : [env, 'Suggestions']"/>
    <div class=body>
      <div class=list>
        <ResourceList v-bind="SUGGESTION_LIST" :archive="!!archive" :home="home" :rows="list.data" :loading="list.loading" :error="list.error"
          :href="(s) => base + '/' + s.n" :selected="(s) => String(s.n) === n">
          <template #tools><a class="btn new" :href="home + '/ask'">Ask for suggestions</a></template>
        </ResourceList>
      </div>
      <Panel v-if="n === 'ask'" label="Ask for suggestions" :close="base">
        <p class="prose muted">The agent gets this as a message. It sends a subagent to look for improvements and files what comes back here, while it carries on with its own work.</p>
        <ActionBar :actions="asking" open="Ask for suggestions" :done="done"/>
      </Panel>
      <SuggestionPanel v-else-if="n" :key="'suggestion' + n" :env="env" :n="n" :close="base" :base="base" :reloaded="list.reload"/>
    </div>`,
};

const Todos = {
  props: ["env", "archive", "n"],
  components: { TopBar, Panel, ActionBar, ResourceList, TodoPanel },
  setup(props) {
    const api = computed(() => `/api/env/${props.env}/todos`);
    const home = computed(() => `#/env/${props.env}/todos`);
    const base = computed(() => home.value + (props.archive || ""));
    const list = useFetch(() => props.env && api.value);
    const creating = computed(() => [{
      label: "New to-do", method: "POST", url: api.value, submit: "Add to-do", leave: true,
      fields: [{ name: "title", label: "Title", placeholder: "What needs doing, in a few words" },
               { name: "body", label: "Brief", kind: "area", placeholder: "Anything the agent needs to know to do it" },
               { name: "after", label: "Waits on (optional)", placeholder: "to-do numbers, like 3, 7" },
               { name: "priority", label: "Priority", kind: "select", value: "default", options: PRIORITIES }],
    }]);
    const done = (body, a) => settle(body, a, base.value, list);
    return { list, creating, done, home, base, TODO_LIST };
  },
  template: `
    <TopBar :crumbs="archive ? [env, 'To-dos', 'Archive'] : [env, 'To-dos']"/>
    <div class=body>
      <div class=list>
        <ResourceList v-bind="TODO_LIST" :archive="!!archive" :home="home" :rows="list.data" :loading="list.loading" :error="list.error"
          :href="(t) => base + '/' + t.n" :selected="(t) => String(t.n) === n">
          <template #tools><a class="btn new" :href="home + '/new'">New to-do</a></template>
        </ResourceList>
      </div>
      <Panel v-if="n === 'new'" label="New to-do" :close="base">
        <ActionBar :actions="creating" open="New to-do" :done="done"/>
      </Panel>
      <TodoPanel v-else-if="n" :key="'todo' + n" :env="env" :n="n" :close="base" :base="base" :reloaded="list.reload"/>
    </div>`,
};

// ─────────────────────────────────────────────────────────────── pins and rules
function claimsView({ crumbs, api, base, noun, scope, empty, movable }) {
  return {
    props: ["env", "archive", "n"],
    components: { TopBar, Panel, LinkedQuestions, ActionBar, ResourceList, FromMessages, Comments },
    setup(props) {
      const list = useFetch(() => api(props) && `${api(props)}?all=1`);
      const item = useFetch(() => props.n && props.n !== "new" && `${api(props)}/${props.n}`);
      const envs = useEnvironments(() => props.env);
      const word = noun.toLowerCase();
      const creating = computed(() => [{
        label: `New ${word}`, method: "POST", url: api(props), submit: `Add ${word}`, leave: true,
        fields: [{ name: "fact", label: noun === "Rule" ? "The ruling, in one line" : "The claim, in one line" },
                 { name: "body", label: "Reasoning (optional)", kind: "area" },
                 { name: "doc", label: "Cites a doc (optional)", placeholder: "a doc number, like 4 or 4.2" }],
      }]);
      const actions = computed(() => {
        const c = item.data;
        if (!c || c.struck) return [];
        const url = `${api(props)}/${c.n}`;
        return [
          { label: "Edit", method: "PATCH", url, only: true, submit: "Save",
            fields: [{ name: "fact", label: noun === "Rule" ? "Ruling" : "Claim", value: c.fact },
                     { name: "body", label: "Reasoning", kind: "area", value: c.body || "" }],
            note: `Changing the ${noun === "Rule" ? "ruling" : "claim"} strikes this ${word} and adds the new one under a new number.` },
          ...(movable ? [
            { label: "Move", method: "POST", url: `${url}/move`, fields: [envField(envs.value)],
              note: "It is struck here and added there." },
            { label: "Promote to rule", method: "POST", url: `${url}/promote`, submit: "Promote",
              note: "It becomes a rule on every environment, and this pin is struck." },
          ] : []),
          ...(noun === "Rule" ? [c.in_claude_md
            ? { label: "Remove from CLAUDE.md", method: "POST", url: `${url}/uninject`, submit: "Remove",
                note: "The rule stays; only its copy in CLAUDE.md is taken out." }
            : { label: "Add to CLAUDE.md", method: "POST", url: `${url}/inject`, submit: "Add",
                note: "Writes the ruling into the project's CLAUDE.md between journal markers, with a path to any file or doc it cites — never the file itself." }] : []),
          { label: "Strike", method: "DELETE", url, danger: true, fields: [{ name: "why", label: "Why it stopped being true" }] },
        ];
      });
      const done = (body, a) => settle(body, a, base(props) + (props.archive || ""), list, item);
      return { list, item, creating, actions, done, ageOf, docOf, word, envs,
               crumbs: computed(() => (props.archive ? [...crumbs(props), "Archive"] : crumbs(props))),
               home: computed(() => base(props)), base: computed(() => base(props) + (props.archive || "")),
               scope: computed(() => scope(props)), noun, word, empty, CLAIM_LIST };
    },
    template: `
      <TopBar :crumbs="crumbs"/>
      <div class=body>
        <div class=list>
          <ResourceList v-bind="CLAIM_LIST" :archive="!!archive" :home="home" :name="word + 's'" :empty="empty" :rows="list.data" :loading="list.loading" :error="list.error"
            :href="(c) => base + '/' + c.n" :selected="(c) => String(c.n) === n">
            <template #tools><a class="btn new" :href="home + '/new'">New {{ word }}</a></template>
          </ResourceList>
        </div>
        <Panel v-if="n === 'new'" :label="'New ' + word" :close="base">
          <ActionBar :actions="creating" :open="'New ' + word" :done="done"/>
        </Panel>
        <Panel v-else-if="n" :label="noun + ' #' + n" :close="base">
          <p v-if="item.error" class=error>{{ item.error }}</p>
          <template v-else-if="item.data">
            <h2 class=p-title>{{ item.data.fact }}</h2>
            <dl class=props>
              <dt>Scope</dt><dd>{{ scope }}</dd>
              <template v-if="noun === 'Rule'"><dt>CLAUDE.md</dt><dd>{{ item.data.in_claude_md ? 'Written in CLAUDE.md' : 'Not in CLAUDE.md' }}</dd></template>
              <dt>Cites</dt><dd><a v-if="docOf(item.data.meta)" :href="'#/docs/' + docOf(item.data.meta)">Doc {{ docOf(item.data.meta) }}</a><span v-else class=muted>—</span></dd>
              <dt>Written</dt><dd>{{ ageOf(item.data.meta) || '—' }}</dd>
            </dl>
            <ActionBar :actions="actions" :done="done" :key="noun + item.data.n + (item.data.struck ? 'x' : '')"/>
            <div v-if="item.data.struck_why" class=note>Struck: {{ item.data.struck_why }}</div>
            <div v-if="item.data.meta_secondary.length" class=note>
              <div v-for="(s, i) in item.data.meta_secondary" :key="i">{{ s }}</div>
            </div>
            <div>
              <p class=section-label>Reasoning</p>
              <div v-if="item.data.body" class="md prose" v-html="$md(item.data.body)"></div>
              <p v-else class="prose muted">No reasoning is written down; the claim is all there is.</p>
            </div>
            <FromMessages :rows="item.data.from_messages" :env="env || 'web-interface'"/>
            <LinkedQuestions :rows="item.data.questions" :env="env"/>
            <Comments :about="word + ' ' + item.data.n" :env="env || envs[0] || ''" :key="'c-' + word + item.data.n"/>
          </template>
        </Panel>
      </div>`,
  };
}

const Pins = claimsView({
  crumbs: (p) => [p.env, "Pins"], api: (p) => p.env && `/api/env/${p.env}/pins`, base: (p) => `#/env/${p.env}/pins`,
  noun: "Pin", scope: (p) => p.env, empty: "Nothing is pinned on this environment.", movable: true,
});

const Rules = claimsView({
  crumbs: () => ["Project", "Rules"], api: () => "/api/rules", base: () => "#/rules",
  noun: "Rule", scope: () => "Every environment", empty: "No rules stand.", movable: false,
});

// ─────────────────────────────────────────────────────────────── inbox and questions
// the Inbox: messages, questions and suggestions in one list; a question or suggestion opens as q/3 or s/7
function inboxRef(r) { return r.type === "message" ? String(r.num) : `${r.type[0]}/${r.num}`; }

function suggestionKind(s) { return s.status === "open" ? "waiting" : s.status === "accepted" || s.status === "adjusted" ? "done" : "withdrawn"; }

const INBOX_LIST = {
  groups: [{ key: "you", label: "Waiting on you", kind: "waiting", match: (r) => r.group === "you" },
           { key: "agent", label: "Waiting on the agent", kind: "progress", match: (r) => r.group === "agent" },
           { key: "handled", label: "Handled", kind: "done", closed: true, match: (r) => r.group === "handled" }],
  columns: { status: (r) => r.status, type: (r) => r.type, num: (r) => `#${r.num}`, title: (r) => r.title, age: (r) => r.age, struck: (r) => r.struck },
  sorts: [{ key: "at", label: "Newest", value: (r) => r.at || "" }],
  count: (rows) => `${rows.filter((r) => r.group === "you").length} waiting on you`,
  empty: "Nothing has arrived here yet.", name: "inbox",
};

const Inbox = {
  props: ["env", "archive", "n"],
  components: { TopBar, Compose, ResourceList, MessagePanel, QuestionPanel, SuggestionPanel },
  setup(props) {
    const api = computed(() => `/api/env/${props.env}/inbox`);
    const home = computed(() => `#/env/${props.env}/messages`);
    const base = computed(() => home.value + (props.archive || ""));
    const messages = useFetch(() => props.env && `${api.value}?all=1`);
    const questions = useFetch(() => props.env && `/api/env/${props.env}/questions?all=1`);
    const suggestions = useFetch(() => props.env && `/api/env/${props.env}/suggestions?all=1`);
    const reloadAll = () => [messages, questions, suggestions].forEach((f) => f.reload());
    const rows = computed(() => {
      if (!messages.data || !questions.data || !suggestions.data) return null;
      return [
        ...messages.data.map((m) => ({ name: `m${m.n}`, type: "message", num: m.n, title: m.text, age: m.age, at: m.at, closed_at: m.closed_at,
                                       group: m.status === "waiting" ? "agent" : "handled", status: MESSAGE_LIST.columns.status(m), struck: m.status === "archived" })),
        ...questions.data.map((q) => ({ name: `q${q.n}`, type: "question", num: q.n, title: q.text, age: q.age, at: q.at, closed_at: q.closed_at,
                                        group: q.status === "open" ? "you" : "handled", status: questionKind(q), struck: q.status === "withdrawn" })),
        ...suggestions.data.map((s) => ({ name: `s${s.n}`, type: "suggestion", num: s.n, title: s.title, age: s.age, at: s.at, closed_at: s.closed_at,
                                          group: s.status === "open" ? "you" : "handled", status: suggestionKind(s), struck: s.status === "declined" || s.status === "withdrawn" })),
      ];
    });
    const opened = computed(() => {
      const m = /^(?:([qs])\/)?(\d+)$/.exec(props.n || "");
      if (!m) return null;
      return { type: m[1] === "q" ? "question" : m[1] === "s" ? "suggestion" : "message", num: m[2] };
    });
    const send = (text, files) => postJSON(api.value, { text, files }).then(() => { messages.reload(); changed(); });
    // a message only reaches an agent at its next hook event; say so when none is working here
    const live = computed(() => {
      const row = OVERVIEW.data ? OVERVIEW.data.environments.find((e) => e.name === props.env) : null;
      return !!(row && row.active);
    });
    const hint = computed(() => (live.value ? "The agent is told at its next stop"
      : "No agent is working on this environment right now; the message waits until a session picks it up"));
    return { rows, messages, reloadAll, opened, send, home, base, INBOX_LIST, hint, inboxRef };
  },
  template: `
    <TopBar :crumbs="archive ? [env, 'Inbox', 'Archive'] : [env, 'Inbox']"/>
    <div class=body>
      <div class=chat>
        <div class=list>
          <ResourceList v-bind="INBOX_LIST" :archive="!!archive" :home="home" :rows="rows" :loading="messages.loading" :error="messages.error"
            :href="(r) => base + '/' + inboxRef(r)" :selected="(r) => inboxRef(r) === n"/>
        </div>
        <div v-if="!archive" class="compose-wrap at-bottom">
          <Compose placeholder="Leave a message for the agent: an instruction, a follow-up, anything"
            submit="Send" :hint="hint" :send="send" :attach="true" :autofocus="!n"/>
        </div>
      </div>
      <MessagePanel v-if="opened && opened.type === 'message'" :key="'message' + opened.num" :env="env" :n="opened.num" :close="base" :base="base" :reloaded="reloadAll"/>
      <QuestionPanel v-else-if="opened && opened.type === 'question'" :key="'question' + opened.num" :env="env" :n="opened.num" :close="base" :base="base + '/q'" :reloaded="reloadAll"/>
      <SuggestionPanel v-else-if="opened && opened.type === 'suggestion'" :key="'suggestion' + opened.num" :env="env" :n="opened.num" :close="base" :base="base + '/s'" :reloaded="reloadAll"/>
    </div>`,
};

// docs, reports and plans are one Documents area: the same tabs head each of their lists
const DOC_TABS = [{ key: "docs", label: "Docs" }, { key: "reports", label: "Reports" }, { key: "plans", label: "Plans" }];

const DocTabs = {
  props: { env: String, current: String },
  setup(props) {
    const docs = useFetch(() => props.env && `/api/env/${props.env}/docs?archived=1`);
    const reports = useFetch(() => props.env && `/api/env/${props.env}/reports`);
    const plans = useFetch(() => props.env && `/api/env/${props.env}/plans`);
    const counts = computed(() => ({ docs: docs.data ? docs.data.filter((d) => !d.archived).length : "",
                                     reports: reports.data ? reports.data.length : "", plans: plans.data ? plans.data.length : "" }));
    return { DOC_TABS, counts };
  },
  // the head of the Documents area: the type switch with its counts, then the page's quiet links, then its New button
  template: `
    <div class=doc-head>
      <nav class=doc-switch aria-label="Documents">
        <a v-for="t in DOC_TABS" :key="t.key" :class="['doc-switch-opt', {on: t.key === current}]" :href="'#/env/' + env + '/' + t.key"
          :aria-current="t.key === current ? 'page' : null">{{ t.label }}<span class=doc-switch-n>{{ counts[t.key] }}</span></a>
      </nav>
      <slot/>
      <span class=doc-head-new><slot name="new"/></span>
    </div>`,
};

const PLAN_STATUS = { draft: "Draft", active: "Active", done: "Done", abandoned: "Abandoned" };

const PLAN_LIST = {
  groups: [{ key: "active", label: "Active", kind: "progress", match: (p) => p.status === "active" },
           { key: "draft", label: "Drafts", kind: "open", match: (p) => p.status === "draft" },
           { key: "done", label: "Done", kind: "done", closed: true, match: (p) => p.status === "done" },
           { key: "abandoned", label: "Abandoned", kind: "withdrawn", closed: true, match: (p) => p.status === "abandoned" }],
  columns: { num: (p) => `#${p.n}`, title: (p) => p.title, sub: (p) => p.goal, cite: (p) => `${p.phases_done} of ${p.phases_total} phases`,
             age: (p) => p.age, struck: (p) => p.status === "abandoned" },
  count: (rows) => `${rows.filter((p) => p.status === "active" || p.status === "draft").length} plans`, name: "plans",
  empty: "No plans on this environment yet.",
};

// a plan's links are written "doc 4.2" and "report 1"; refHref reads "doc:4.2"
function planRefHref(ref, env) { return refHref(String(ref).replace(" ", ":"), env); }

function planStepState(ph) { return ph.complete ? "Complete" : ph.current ? "Current" : "Not started"; }

const Plans = {
  props: ["env", "archive", "n"],
  components: { TopBar, Panel, ActionBar, ResourceList, StatusIcon, DocTabs, TodoPanel, Icon },
  setup(props) {
    const api = computed(() => `/api/env/${props.env}/plans`);
    const home = computed(() => `#/env/${props.env}/plans`);
    const base = computed(() => home.value + (props.archive || ""));
    const reading = computed(() => props.n && props.n !== "new");
    const list = useFetch(() => props.env && !reading.value && `${api.value}?all=1`);
    const item = useFetch(() => props.env && reading.value && `${api.value}/${props.n}`);
    // the viewer cannot start an agent, so planning together is a message: the agent asks back with questions to click
    const creating = computed(() => [{
      label: "Plan it with the agent", method: "POST", url: `/api/env/${props.env}/inbox`, submit: "Send to the agent", leave: true,
      fields: [{ name: "wish", label: "What do you want to achieve?", kind: "area",
                 placeholder: "In your own words, as rough as you like. The agent asks back until the goal is clear." }],
      note: "The agent asks you questions, each with answers to pick or your own words, then drafts the plan for you to approve.",
      shape: ({ wish }) => ({ files: [], text: `Plan with me: I want to start a new plan on this environment. What I want to achieve, roughly: ${(wish || "").trim() || "(not sure yet, help me find it)"}\n\nShape the goal with me first. Ask me one question at a time with \`journal questions add "<question>" --option="<answer>" --option="<answer>"\`, so I can pick an answer or write my own, and keep going until the goal is clear. Then draft the plan with \`journal plans add\`, its phases and their to-dos, and tell me it is ready to approve.` }),
    }, {
      label: "Write it myself", method: "POST", url: api.value, submit: "Save draft", leave: true,
      fields: [{ name: "title", label: "Title" }, { name: "goal", label: "Goal", placeholder: "What is true when the plan is done" },
               { name: "body", label: "Approach (optional)", kind: "area" }],
      note: "A plan starts as a draft. Add its phases and to-dos, then approve it.",
    }]);
    const actions = computed(() => {
      const p = item.data;
      if (!p || p.status === "done" || p.status === "abandoned") return [];
      const url = `${api.value}/${p.n}`;
      const out = [];
      out.push(p.auto
        ? { label: "Stop at checkpoints", method: "POST", url: `${url}/auto`, submit: "Stop at checkpoints", shape: () => ({ on: false }),
            note: "The agent waits at each checkpoint again until you continue." }
        : { label: "Auto mode", method: "POST", url: `${url}/auto`, submit: "Continue past checkpoints on its own", shape: () => ({ on: true }),
            note: "The agent works the whole plan without stopping at checkpoints. They still mark their phase, and you are still notified as each completes." });
      out.push(
        { label: "Add phase", method: "POST", url: `${url}/phase`, submit: "Add phase",
          fields: [{ name: "title", label: "Title" }, { name: "when", label: "Complete when (optional)" }] },
        { label: "Add to-dos", method: "POST", url: `${url}/todos`, submit: "Add",
          fields: [{ name: "phase", label: "Phase number" }, { name: "todos", label: "To-do numbers", placeholder: "4, 5, 6" },
                   { name: "reopen", label: "Why, if the phase is already complete (optional)" }] },
        { label: "Link", method: "POST", url: `${url}/link`, submit: "Link",
          fields: [{ name: "ref", label: "Document or report", placeholder: "doc 4.2 or report 1" }] },
        { label: "Abandon", method: "DELETE", url, danger: true, submit: "Abandon",
          fields: [{ name: "why", label: "Why the plan is stopped" }] });
      return out;
    });
    const done = (body, a) => settle(body, a, reading.value ? "" : base.value, list, item);
    const leaveNew = () => { changed(); location.hash = base.value; };
    // a to-do row on the plan opens in the inspector over the plan, stepping through the plan's to-dos
    const todoView = reactive({ n: 0 });
    const planTodos = computed(() => (item.data && item.data.phases ? item.data.phases.flatMap((ph) => ph.todos) : []));
    const trailOwner = {};
    watchEffect(() => {
      if (!reading.value) return;
      INSPECTOR_TRAIL.owner = trailOwner;
      INSPECTOR_TRAIL.items = planTodos.value.map((t) => ({ key: `todo:${t.n}`, go: () => { todoView.n = t.n; } }));
      INSPECTOR_TRAIL.current = todoView.n ? `todo:${todoView.n}` : null;
    });
    onUnmounted(() => { if (INSPECTOR_TRAIL.owner === trailOwner) Object.assign(INSPECTOR_TRAIL, { owner: null, items: [], current: null }); });
    const openTodo = (t) => { todoView.n = t.n; };
    const closeTodo = () => { todoView.n = 0; };
    const progress = computed(() => {
      const p = item.data;
      if (!p) return null;
      const finished = planTodos.value.filter((t) => t.done).length;
      return { phases: `${p.phases_done} of ${p.phases_total} phases complete`, todos: `${finished} of ${planTodos.value.length} to-dos done`,
               width: p.phases_total ? `${(100 * p.phases_done) / p.phases_total}%` : "0%" };
    });
    // one primary action: approving a draft, or going on past a checkpoint
    const primary = computed(() => {
      const p = item.data;
      if (!p) return null;
      const after = () => { item.reload(); changed(); };
      if (p.status === "draft") return { label: "Approve plan", go: () => send("POST", `${api.value}/${p.n}/activate`).then(after) };
      if (p.held) return { label: "Continue past the checkpoint", go: () => send("POST", `${api.value}/${p.n}/proceed`).then(after) };
      return null;
    });
    const quiet = computed(() => (item.data && item.data.status === "active" && item.data.current ? `Working phase ${item.data.current}` : ""));
    const PLAN_TINT = { active: "#5b8def", draft: "#c9955e", done: "#3ecf74", abandoned: "#83868e" };
    const planChip = (status) => { const c = PLAN_TINT[status] || "#83868e"; return { color: c, borderColor: `${c}73`, background: `${c}29` }; };
    const citedDocs = useFetch(() => props.env && reading.value && `/api/env/${props.env}/docs?archived=1`);
    const citedReports = useFetch(() => props.env && reading.value && `/api/env/${props.env}/reports?all=1`);
    const cites = computed(() => ((item.data && item.data.refs) || []).map((ref) => {
      const [kind, num] = ref.split(" ");
      const pool = kind === "doc" ? citedDocs.data : citedReports.data;
      const got = (pool || []).find((x) => x.n === Number(String(num).split(".")[0]));
      return { ref, label: `${TYPES[kind].label} ${num}`, title: got ? got.title : ref, tint: TYPES[kind].tint, href: planRefHref(ref, props.env) };
    }));
    const doneCount = (ph) => ph.todos.filter((t) => t.done).length;
    return { list, item, reading, creating, actions, done, leaveNew, api, home, base, todoView, openTodo, closeTodo, progress, primary, quiet, planChip, cites, PLAN_LIST, PLAN_STATUS, doneCount, planStepState, planRefHref };
  },
  template: `
    <template v-if="reading">
      <TopBar :crumbs="[env, 'Documents', 'Plans', '#' + n]"><a class=btn :href="base">All plans</a></TopBar>
      <div class=body><div class=page><div class=plan-screen>
        <p v-if="item.error" class=error>{{ item.error }}</p>
        <template v-else-if="item.data">
          <div class=plan-top>
            <div class=plan-top-meta>
              <span class=plan-chip :style="planChip(item.data.status)">{{ PLAN_STATUS[item.data.status] }}</span>
              <span class=muted>plan {{ item.data.n }} · drafted {{ item.data.age || 'just now' }}<template v-if="item.data.why"> · {{ item.data.why }}</template></span>
            </div>
            <h1 class=plan-title>{{ item.data.title }}</h1>
            <p class=plan-goal><span class=muted>Goal — </span>{{ item.data.goal }}</p>
          </div>
          <div class=plan-progress>
            <div class=plan-progress-text>
              <div class=plan-progress-line><b>{{ progress.phases }}</b><span class=muted>· {{ progress.todos }}</span></div>
              <span class=plan-bar><span :style="{ width: progress.width }"></span></span>
              <span class="muted plan-progress-note">{{ item.data.auto ? 'Auto mode: continues past checkpoints on its own' : 'Stops at each checkpoint until you continue' }}</span>
            </div>
            <div class=plan-progress-actions>
              <button v-if="primary" type=button class=band-primary @click="primary.go">{{ primary.label }}<Icon name="arrow"/></button>
              <span v-else-if="quiet" class=plan-quiet>{{ quiet }}</span>
            </div>
          </div>
          <ActionBar :actions="actions" :done="done" :key="'plan' + item.data.n + item.data.status + (item.data.held || '') + item.data.auto"/>
          <section v-for="ph in item.data.phases" :key="ph.p" :class="['phase-card', {current: ph.current, complete: ph.complete}]">
            <div class=phase-head>
              <span class=phase-num>{{ ph.p }}</span>
              <div class=phase-name>
                <span class=phase-title>{{ ph.title }}</span>
                <span v-if="ph.when || ph.checkpoint" class=phase-when>{{ [ph.checkpoint ? 'Checkpoint' : '', ph.when ? 'complete when ' + ph.when : ''].filter(Boolean).join(' — ') }}</span>
              </div>
              <span class=phase-state>{{ planStepState(ph) }}</span>
              <span class=phase-count>{{ doneCount(ph) }} of {{ ph.todos.length }} done</span>
            </div>
            <div v-for="t in ph.todos" :key="t.n" :class="['phase-todo', {sel: todoView.n === t.n}]" @click="openTodo(t)">
              <StatusIcon :kind="t.done ? 'done' : 'open'"/>
              <span class=phase-todo-n>#{{ t.n }}</span>
              <span :class="['phase-todo-title', {done: t.done}]">{{ t.title || 'archived' }}</span>
              <span class=phase-todo-state>{{ t.done ? 'Done' : ph.current ? 'Open' : 'Not started' }}</span>
            </div>
            <p v-if="!ph.todos.length" class="muted phase-empty">No to-dos yet</p>
          </section>
          <p v-if="!item.data.phases.length" class=muted>No phases yet.</p>
          <section v-if="cites.length" class=plan-cites>
            <h2 class=col-title>What this plan cites</h2>
            <div class=cites-list>
              <a v-for="c in cites" :key="c.ref" class=cite-row :href="c.href">
                <span class=cite-dot :style="{ borderColor: c.tint }"></span>
                <span class=cite-ref>{{ c.label }}</span>
                <span class=cite-title>{{ c.title }}</span>
                <Icon name="open"/>
              </a>
            </div>
          </section>
          <div v-if="item.data.body" class=plan-approach><h2 class=col-title>Approach</h2><div class="md prose" v-html="$md(item.data.body)"></div></div>
        </template>
      </div></div></div>
      <TodoPanel v-if="todoView.n" :key="'todo' + todoView.n" :env="env" :n="todoView.n" :onClose="closeTodo" :link="'#/env/' + env + '/todos/' + todoView.n" :reloaded="item.reload"/>
    </template>
    <template v-else>
      <TopBar :crumbs="archive ? [env, 'Documents', 'Plans', 'Archive'] : [env, 'Documents', 'Plans']"/>
      <div class=body>
        <div class=list>
          <DocTabs :env="env" current="plans">
            <a :class="['viewbar-archive', {on: archive}]" :href="archive ? home : home + '/archive'">{{ archive ? 'Close archive' : 'Archive' }}</a>
            <template #new><a class="btn new" :href="home + '/new'">New plan</a></template>
          </DocTabs>
          <ResourceList v-bind="PLAN_LIST" :bar="false" :archive="!!archive" :home="home" :rows="list.data" :loading="list.loading" :error="list.error"
            :href="(p) => base + '/' + p.n"/>
        </div>
        <Panel v-if="n === 'new'" label="New plan" :close="base">
          <ActionBar :actions="creating" :done="(body, a) => (a.url === api ? done(body, a) : leaveNew())"/>
        </Panel>
      </div>
    </template>`,
};

const REPORT_LIST = {
  groups: [{ key: "reports", label: "Reports", kind: "open", match: (r) => !r.archived },
           { key: "archived", label: "Archived", kind: "withdrawn", closed: true, match: (r) => r.archived }],
  // a report within two days of aging off the list shows its age in amber
  columns: { num: (r) => `#${r.n}`, title: (r) => r.title, sub: (r) => r.gist, cite: (r) => r.about_label, age: (r) => r.age,
             ageWarn: (r) => r.ages_out_in !== null && r.ages_out_in !== undefined && r.ages_out_in <= 2,
             struck: (r) => r.archived },
  count: (rows) => `${rows.filter((r) => !r.archived).length} reports`, name: "reports",
  empty: "No reports on this environment yet.",
};

const Reports = {
  props: ["env", "archive", "n"],
  components: { TopBar, Panel, ActionBar, ResourceList, DocTabs },
  setup(props) {
    const api = computed(() => `/api/env/${props.env}/reports`);
    const home = computed(() => `#/env/${props.env}/reports`);
    const base = computed(() => home.value + (props.archive || ""));
    const reading = computed(() => props.n && props.n !== "new");
    const list = useFetch(() => props.env && !reading.value && `${api.value}?all=1`);
    const item = useFetch(() => props.env && reading.value && `${api.value}/${props.n}`);
    const creating = computed(() => [{
      label: "New report", method: "POST", url: api.value, submit: "Add report", leave: true,
      fields: [{ name: "title", label: "Title" }, { name: "body", label: "Text", kind: "area" },
               { name: "about", label: "For (optional)", placeholder: "todo 22 or question 4" }],
    }]);
    const actions = computed(() => {
      const r = item.data;
      if (!r || r.archived) return [];
      return [
        { label: "Turn into doc", method: "POST", url: `${api.value}/${r.n}/todoc`, submit: "Turn into doc",
          note: "A document is made from this report and kept for good; the report is archived.",
          follow: (body) => (body.data && body.data.doc ? `#/docs/${body.data.doc}` : null) },
        { label: "Archive", method: "DELETE", url: `${api.value}/${r.n}`, danger: true, submit: "Archive",
          fields: [{ name: "why", label: "Why it is taken off the list" }] },
      ];
    });
    const done = (body, a) => settle(body, a, reading.value ? "" : base.value, list, item);
    return { list, item, reading, creating, actions, done, home, base, REPORT_LIST };
  },
  template: `
    <template v-if="reading">
      <TopBar :crumbs="[env, 'Reports', '#' + n]"><a class=btn :href="base">All reports</a></TopBar>
      <div class=body><div class=page><div class=page-inner>
        <p v-if="item.error" class=error>{{ item.error }}</p>
        <template v-else-if="item.data">
          <h1 class=p-title>{{ item.data.title }}</h1>
          <dl class=props>
            <dt>Written</dt><dd>{{ item.data.age || 'just now' }}</dd>
            <dt>For</dt><dd><a v-if="item.data.about && $refHref(item.data.about, env)" :href="$refHref(item.data.about, env)" class=chip>{{ item.data.about_label }}</a><span v-else class=muted>—</span></dd>
            <template v-if="item.data.archived"><dt>Archived</dt><dd>{{ item.data.archived }}</dd></template>
            <template v-if="item.data.doc"><dt>Document</dt><dd><a class=chip :href="'#/docs/' + item.data.doc">Doc {{ item.data.doc }}</a></dd></template>
          </dl>
          <ActionBar :actions="actions" :done="done" :key="'report' + item.data.n + (item.data.archived ? 'x' : '')"/>
          <div class="md prose" v-html="$md(item.data.body)"></div>
        </template>
      </div></div></div>
    </template>
    <template v-else>
      <TopBar :crumbs="archive ? [env, 'Documents', 'Reports', 'Archive'] : [env, 'Documents', 'Reports']"/>
      <div class=body>
        <div class=list>
          <DocTabs :env="env" current="reports">
            <a :class="['viewbar-archive', {on: archive}]" :href="archive ? home : home + '/archive'">{{ archive ? 'Close archive' : 'Archive' }}</a>
            <template #new><a class="btn new" :href="home + '/new'">New report</a></template>
          </DocTabs>
          <ResourceList v-bind="REPORT_LIST" :bar="false" :archive="!!archive" :home="home" :rows="list.data" :loading="list.loading" :error="list.error"
            :href="(r) => base + '/' + r.n"/>
        </div>
        <Panel v-if="n === 'new'" label="New report" :close="base">
          <ActionBar :actions="creating" open="New report" :done="done"/>
        </Panel>
      </div>
    </template>`,
};

const Questions = {
  props: ["env", "archive", "n"],
  components: { TopBar, ResourceList, QuestionPanel },
  setup(props) {
    const home = computed(() => `#/env/${props.env}/questions`);
    const base = computed(() => home.value + (props.archive || ""));
    const list = useFetch(() => props.env && `/api/env/${props.env}/questions?all=1`);
    return { list, home, base, QUESTION_LIST };
  },
  template: `
    <TopBar :crumbs="archive ? [env, 'Questions', 'Archive'] : [env, 'Questions']"/>
    <div class=body>
      <div class=list>
        <ResourceList v-bind="QUESTION_LIST" :archive="!!archive" :home="home" :rows="list.data" :loading="list.loading" :error="list.error"
          :href="(q) => base + '/' + q.n" :selected="(q) => String(q.n) === n"/>
      </div>
      <QuestionPanel v-if="n" :key="'question' + n" :env="env" :n="n" :close="base" :base="base" :reloaded="list.reload"/>
    </div>`,
};

// ─────────────────────────────────────────────────────────────── coding style
const STYLE_LIST = {
  groups: [{ key: "rules", label: "Rules", kind: "open", match: () => true }],
  columns: { title: (r) => r.title, sub: (r) => r.decision, cite: (r) => r.skill },
  sorts: [{ key: "n", label: "Added" }, { key: "subject", label: "Subject" }],
  count: (rows) => `${rows.length} ${rows.length === 1 ? "rule" : "rules"}`, name: "rules",
  empty: "No coding style rules yet. Ask for a review to find them.",
};

function aboutStyle(q, ref) {
  return (q.links || []).some((l) => (ref ? l.ref === ref : l.ref === "style" || l.ref.startsWith("style:")));
}

// a rule is routed by its subject; the API numbers them, so the list says which number it is
const StylePanel = {
  props: ["env", "n", "rows", "questions", "close", "base", "reloaded"],
  components: { Panel, ActionBar, LinkedQuestions },
  setup(props) {
    const rule = computed(() => (props.rows || []).find((r) => r.subject === props.n));
    const item = useFetch(() => rule.value && `/api/style/${rule.value.n}`);
    const asked = computed(() => (props.questions || []).filter((q) => aboutStyle(q, `style:${props.n}`)));
    const actions = computed(() => {
      const r = item.data;
      if (!r) return [];
      const url = `/api/style/${r.n}`;
      return [
        { label: "Edit", method: "PATCH", url, only: true, submit: "Save",
          fields: [{ name: "title", label: "Title", value: r.title }, { name: "decision", label: "Decision", value: r.decision },
                   { name: "when", label: "Loads when", value: r.when }],
          note: "Its skill is written again with the change." },
        { label: "Remove", method: "DELETE", url, danger: true, leave: true, submit: "Remove",
          fields: [{ name: "why", label: "Why it no longer applies" }], note: "Its skill is deleted too." },
      ];
    });
    const done = (body, a) => { settle(body, a, props.base, item); if (props.reloaded) props.reloaded(); };
    return { rule, item, asked, actions, done };
  },
  template: `
    <Panel :label="'Rule ' + n" :close="close">
      <p v-if="rows && !rule" class="prose muted">There is no coding style rule named {{ n }}.</p>
      <p v-else-if="item.error" class=error>{{ item.error }}</p>
      <template v-else-if="item.data">
        <h2 class=p-title>{{ item.data.title }}</h2>
        <dl class=props>
          <dt>Decision</dt><dd>{{ item.data.decision }}</dd>
          <dt>Loads when</dt><dd>{{ item.data.when }}</dd>
          <dt>Skill</dt><dd><a class=chip :href="'#/env/' + env + '/skills/' + item.data.skill">{{ item.data.skill }}</a></dd>
        </dl>
        <ActionBar :actions="actions" :done="done" :key="'style' + item.data.n"/>
        <div v-if="item.data.body">
          <div class="md prose" v-html="$md(item.data.body)"></div>
        </div>
        <p v-else class="prose muted">No reasoning or examples are written down for this rule.</p>
        <LinkedQuestions :rows="asked" :env="env"/>
      </template>
    </Panel>`,
};

const Style = {
  props: ["env", "n"],
  components: { TopBar, ResourceList, StylePanel, Panel, ActionBar, LinkedQuestions },
  setup(props) {
    const home = computed(() => `#/env/${props.env}/style`);
    const list = useFetch(() => "/api/style?all=1");
    const questions = useFetch(() => props.env && `/api/env/${props.env}/questions?all=1`);
    const open = computed(() => (questions.data || []).filter((q) => q.status === "open" && aboutStyle(q)));
    // like suggestions, a review is a message: the agent sends a subagent to read the code and asks what it finds
    const asking = computed(() => [{
      label: "Ask for a coding style review", method: "POST", url: `/api/env/${props.env}/inbox`, submit: "Send to the agent", leave: true,
      fields: [{ name: "scope", label: "Where to look (optional)", kind: "area",
                 placeholder: "A folder, a layer or a kind of code. Leave empty to let the agent choose." }],
      shape: ({ scope }) => ({ files: [], text: "Please run a coding style review: send a background subagent to read the code "
        + "and find where its style differs, then ask me about each difference with `journal questions add --about=\"style\"`, "
        + "one option per style with its code example, and turn my answers into rules with `journal style add`."
        + (scope && scope.trim() ? `\n\nLook at: ${scope.trim()}` : "") }),
    }]);
    const done = () => { changed(); location.hash = home.value; };
    return { home, list, questions, open, asking, done, STYLE_LIST };
  },
  template: `
    <TopBar :crumbs="[env, 'Coding style']"/>
    <div class=body>
      <div class=list>
        <div v-if="open.length" class=style-questions><LinkedQuestions :rows="open" :env="env" label="Waiting on your answer"/></div>
        <ResourceList v-bind="STYLE_LIST" :home="home" :rows="list.data" :loading="list.loading" :error="list.error"
          :href="(r) => home + '/' + r.subject" :selected="(r) => r.subject === n">
          <template #tools><a class="btn new" :href="home + '/ask'">Ask for a coding style review</a></template>
        </ResourceList>
      </div>
      <Panel v-if="n === 'ask'" label="Ask for a coding style review" :close="home">
        <p class="prose muted">The agent gets this as a message. It sends a subagent to read the code, then asks you about each difference it finds, with the code side by side. Your answers become rules, and each rule becomes a skill.</p>
        <ActionBar :actions="asking" open="Ask for a coding style review" :done="done"/>
      </Panel>
      <StylePanel v-else-if="n" :key="'style' + n" :env="env" :n="n" :rows="list.data" :questions="questions.data" :close="home" :base="home" :reloaded="list.reload"/>
    </div>`,
};

// ─────────────────────────────────────────────────────────────── work and reminders
const Work = {
  props: ["env", "archive", "n"],
  components: { TopBar, Panel, ActionBar, ResourceList, WorkPanel },
  setup(props) {
    const api = computed(() => `/api/env/${props.env}/work`);
    const home = computed(() => `#/env/${props.env}/work`);
    const base = computed(() => home.value + (props.archive || ""));
    const list = useFetch(() => props.env && `${api.value}?all=1`);
    const creating = computed(() => [{
      label: "Start work", method: "POST", url: api.value, submit: "Start", leave: true,
      fields: [{ name: "subject", label: "The work, in a sentence" }],
    }]);
    const done = (body, a) => settle(body, a, base.value, list);
    return { list, creating, done, home, base, WORK_LIST };
  },
  template: `
    <TopBar :crumbs="archive ? [env, 'Open work', 'Archive'] : [env, 'Open work']"/>
    <div class=body>
      <div class=list>
        <ResourceList v-bind="WORK_LIST" :archive="!!archive" :home="home" :rows="list.data" :loading="list.loading" :error="list.error"
          :href="(w) => base + '/' + w.n" :selected="(w) => String(w.n) === n">
          <template #tools><a class="btn new" :href="home + '/new'">Start work</a></template>
        </ResourceList>
      </div>
      <Panel v-if="n === 'new'" label="Start work" :close="base">
        <ActionBar :actions="creating" open="Start work" :done="done"/>
      </Panel>
      <WorkPanel v-else-if="n" :key="'work' + n" :env="env" :n="n" :close="base" :base="base" :reloaded="list.reload"/>
    </div>`,
};

const Reminders = {
  props: ["env", "archive", "n"],
  components: { TopBar, Panel, ActionBar, ResourceList, FromMessages, Comments },
  setup(props) {
    const api = computed(() => `/api/env/${props.env}/reminders`);
    const home = computed(() => `#/env/${props.env}/reminders`);
    const base = computed(() => home.value + (props.archive || ""));
    const list = useFetch(() => props.env && `${api.value}?all=1`);
    const item = useFetch(() => props.env && props.n && props.n !== "new" && `${api.value}/${props.n}`);
    const envs = useEnvironments(() => props.env);
    const creating = computed(() => [{
      label: "New reminder", method: "POST", url: api.value, submit: "Add reminder", leave: true,
      fields: [{ name: "text", label: "The instruction, in one line" },
               { name: "until", label: "Until (optional)", placeholder: "the condition that retires it" }],
    }]);
    const actions = computed(() => {
      const r = item.data;
      if (!r || r.struck) return [];
      const url = `${api.value}/${r.n}`;
      return [
        { label: "Edit", method: "PATCH", url, only: true, submit: "Save",
          fields: [{ name: "text", label: "Instruction", value: r.text }, { name: "until", label: "Until", value: r.until || "" }] },
        { label: "Move", method: "POST", url: `${url}/move`, fields: [envField(envs.value)] },
        { label: "Retire", method: "DELETE", url, danger: true, fields: [{ name: "why", label: "What made it true" }] },
      ];
    });
    const done = (body, a) => settle(body, a, base.value, list, item);
    return { list, item, creating, actions, done, home, base, REMINDER_LIST };
  },
  template: `
    <TopBar :crumbs="archive ? [env, 'Reminders', 'Archive'] : [env, 'Reminders']"/>
    <div class=body>
      <div class=list>
        <ResourceList v-bind="REMINDER_LIST" :archive="!!archive" :home="home" :rows="list.data" :loading="list.loading" :error="list.error"
          :href="(r) => base + '/' + r.n" :selected="(r) => String(r.n) === n">
          <template #tools><a class="btn new" :href="home + '/new'">New reminder</a></template>
        </ResourceList>
      </div>
      <Panel v-if="n === 'new'" label="New reminder" :close="base">
        <ActionBar :actions="creating" open="New reminder" :done="done"/>
      </Panel>
      <Panel v-else-if="n" :label="'Reminder #' + n" :close="base">
        <p v-if="item.error" class=error>{{ item.error }}</p>
        <template v-else-if="item.data">
          <h2 class=p-title>{{ item.data.text }}</h2>
          <dl class=props>
            <dt>Until</dt><dd>{{ item.data.until || 'It is never retired on its own' }}</dd>
            <dt>Facts</dt><dd>{{ item.data.meta || '—' }}</dd>
          </dl>
          <ActionBar :actions="actions" :done="done" :key="'reminder' + item.data.n + (item.data.struck ? 'x' : '')"/>
          <FromMessages :rows="item.data.from_messages" :env="env"/>
          <Comments :about="'reminder ' + item.data.n" :env="env" :key="'c-reminder' + item.data.n"/>
        </template>
      </Panel>
    </div>`,
};

// ─────────────────────────────────────────────────────────────── docs
function docList({ crumbs, url, base, empty }) {
  return {
    props: ["env", "n"],
    components: { TopBar, ActionBar, ResourceList, RadioGroup, DocTabs },
    setup(props) {
      const s = useFetch(() => url(props));
      // open and archived documents are shown apart, one or the other
      const shown = reactive({ archived: false });
      const rows = computed(() => (s.data ? s.data.filter((d) => !!d.archived === shown.archived) : null));
      const creating = computed(() => [{
        label: "New doc", method: "POST", url: url(props), submit: "Add doc", leave: true,
        follow: (body) => { const m = /doc (\d+)/.exec(body.message || ""); return m ? `#/docs/${m[1]}` : null; },
        fields: [{ name: "title", label: "Title" }, { name: "abstract", label: "Abstract, in one line" },
                 { name: "body", label: "Text", kind: "area" }],
      }]);
      const done = (body, a) => settle(body, a, base(props), s);
      return { s, rows, shown, creating, done, crumbs: computed(() => crumbs(props)), base: computed(() => base(props)), empty, DOC_LIST };
    },
    template: `
      <TopBar :crumbs="crumbs"/>
      <div class=body><div class=list>
        <div v-if="n === 'new'" class=compose-wrap><ActionBar :actions="creating" open="New doc" :done="done"/></div>
        <DocTabs v-if="env" :env="env" current="docs">
          <button type=button :class="['viewbar-archive', {on: shown.archived}]" @click="shown.archived = !shown.archived">{{ shown.archived ? 'Close archive' : 'Archive' }}</button>
          <a class=viewbar-archive :href="base.slice(0, -4) + 'files'">Files</a>
          <template #new><a class="btn new" :href="base + '/new'">New document</a></template>
        </DocTabs>
        <ResourceList v-bind="DOC_LIST" :bar="!env" :key="shown.archived ? 'archived' : 'open'"
          :empty="shown.archived ? 'No documents here are archived.' : empty" :rows="rows"
          :loading="s.loading" :error="s.error" :href="(d) => '#/docs/' + d.n">
          <template #tools>
            <RadioGroup label="Which documents" :options="[{ value: 'open', label: 'Open' }, { value: 'archived', label: 'Archived' }]"
              :modelValue="shown.archived ? 'archived' : 'open'" @update:modelValue="(v) => (shown.archived = v === 'archived')"/>
            <a v-if="base.startsWith('#/env/')" class=btn :href="base.slice(0, -4) + 'files'">Files</a>
            <a class="btn new" :href="base + '/new'">New doc</a>
          </template>
        </ResourceList>
      </div></div>`,
  };
}

const Docs = docList({ crumbs: () => ["Project", "Documents"], url: () => "/api/docs?archived=1", base: () => "#/docs",
                       empty: "No project-wide docs are catalogued." });
const EnvDocs = docList({ crumbs: (p) => [p.env, "Documents", "Docs"], url: (p) => p.env && `/api/env/${p.env}/docs?archived=1`,
                          base: (p) => `#/env/${p.env}/docs`,
                          empty: "No docs are scoped to this environment; the project's docs still apply." });

const DocDetail = {
  // NAMED "docref", NOT "ref": Vue intercepts `ref` as its own template-ref attribute.
  props: ["docref"],
  components: { TopBar, Icon, LinkedQuestions, ActionBar, Comments },
  setup(props) {
    const s = useFetch(() => props.docref && `/api/docs/${props.docref}`);
    const envs = useEnvironments(() => "");
    const restParts = computed(() => {
      if (!s.data) return [];
      const skip = s.data.part ? s.data.part.p : null;
      return s.data.parts.filter((p) => p.p !== skip);
    });
    const citedHref = (c) => c.kind === "rule" ? `#/rules/${c.n}` : c.kind === "to-do" ? `#/env/${c.env}/todos/${c.n}` : `#/env/${c.env}/pins/${c.n}`;
    const fileUrl = (n, path) => `/docs/${n}/files/` + path.split("/").map(encodeURIComponent).join("/");
    const isImage = (name) => /\.(png|jpe?g|gif|webp|svg|avif)$/i.test(name);
    const actions = computed(() => {
      const d = s.data;
      if (!d) return [];
      const url = `/api/docs/${d.n}`;
      return [
        { label: "Edit", method: "PATCH", url, only: true, submit: "Save",
          fields: [{ name: "abstract", label: "Abstract", value: d.abstract }] },
        d.status === "final"
          ? { label: "Mark as draft", method: "POST", url: `${url}/draft`, immediate: true, submit: "Mark as draft" }
          : { label: "Mark final", method: "POST", url: `${url}/final`, immediate: true, submit: "Mark final" },
        { label: "Add part", method: "POST", url: `${url}/part`, submit: "Add part",
          fields: [{ name: "title", label: "Title" }, { name: "body", label: "Text", kind: "area" }] },
        { label: "Move", method: "POST", url: `${url}/move`,
          fields: [{ ...envField(envs.value, "Belongs to"), options: [{ value: "", label: "Choose one" },
                     { value: "__project", label: "The whole project" }, ...envs.value.map((name) => ({ value: name, label: name }))] }],
          shape: (p) => (p.environment === "__project" ? { global: true } : p) },
        ...(d.archived ? [] : [{ label: "Archive", method: "POST", url: `${url}/archive`, danger: true, submit: "Archive",
          fields: [{ name: "why", label: "Why it is no longer needed" }] }]),
      ];
    });
    const done = (body, a) => settle(body, a, "", s);
    // one part at a time is edited in place; saving replaces its text and keeps the old one under struck/
    const editing = reactive({ p: null, text: "", saving: false, error: "" });
    const startEdit = (part) => { Object.assign(editing, { p: part.p, text: part.body || "", saving: false, error: "" }); };
    const cancelEdit = () => { editing.p = null; editing.error = ""; };
    const saveEdit = async () => {
      if (editing.saving || editing.p === null || !s.data) return;
      editing.saving = true;
      editing.error = "";
      try {
        await send("PATCH", `/api/docs/${s.data.n}.${editing.p}`, { body: editing.text });
        editing.p = null;
        s.reload();
        changed();
      } catch (err) {
        editing.error = err.message;
      } finally {
        editing.saving = false;
      }
    };
    return { s, restParts, citedHref, actions, done, fileUrl, isImage, envs, editing, startEdit, cancelEdit, saveEdit };
  },
  template: `
    <TopBar :crumbs="['Documents', s.data ? '#' + s.data.n : docref]"/>
    <div class=page>
      <p v-if="s.loading && !s.data" class=empty>Loading…</p>
      <p v-else-if="s.error" class=error>{{ s.error }}</p>
      <div v-else-if="s.data" class=page-inner>
        <h1 class=p-title>{{ s.data.title }}</h1>
        <dl class=props>
          <dt>Status</dt><dd>{{ s.data.status }}</dd>
          <dt>Scope</dt><dd>{{ s.data.scope }}</dd>
          <dt>Written</dt><dd>{{ s.data.age || '—' }}</dd>
          <template v-if="s.data.superseded_by"><dt>Superseded</dt><dd><a :href="'#/docs/' + s.data.superseded_by">by doc {{ s.data.superseded_by }}</a></dd></template>
          <template v-if="s.data.archived"><dt>Archived</dt><dd>{{ s.data.archived }}</dd></template>
        </dl>
        <ActionBar :actions="actions" :done="done" :key="'doc' + s.data.n"/>
        <div><p class=section-label>Abstract</p><p class=prose>{{ s.data.abstract }}</p></div>
        <div v-if="!s.data.part && s.data.body" class="md prose" v-html="$md(s.data.body)"></div>
        <section v-for="p in (s.data.part ? [s.data.part] : []).concat(restParts)" :key="p.p" :id="'part-' + p.p"
          :class="['doc-part', {editing: editing.p === p.p}]">
          <header class=doc-part-head>
            <span class=doc-part-num>{{ s.data.n }}.{{ p.p }}</span>
            <span class=doc-part-title>{{ p.title }}</span>
            <span v-if="p.age" class=doc-part-age>{{ p.age }}</span>
            <button v-if="editing.p !== p.p" type=button class=btn :aria-label="'Edit part ' + s.data.n + '.' + p.p" @click="startEdit(p)">Edit</button>
          </header>
          <form v-if="editing.p === p.p" class=doc-part-edit @submit.prevent="saveEdit">
            <textarea v-model="editing.text" :aria-label="'Text of part ' + s.data.n + '.' + p.p" :disabled="editing.saving"
              @keydown.meta.enter.prevent="saveEdit" @keydown.ctrl.enter.prevent="saveEdit" @keydown.esc.prevent="cancelEdit"></textarea>
            <div class=doc-part-edit-bar>
              <button type=submit class="btn primary" :disabled="editing.saving">Save</button>
              <button type=button class=btn :disabled="editing.saving" @click="cancelEdit">Cancel</button>
              <span class=hint>{{ editing.error || 'The old text is kept under struck/' }}</span>
            </div>
          </form>
          <div v-else class="doc-part-body md prose" v-html="$md(p.body)"></div>
        </section>
        <div v-if="s.data.attachments.length" class=files>
          <p class=section-label>Files</p>
          <template v-for="a in s.data.attachments" :key="a.name">
            <details v-if="a.dir" class=file-folder>
              <summary><Icon name="folder"/><span class=file-name>{{ a.name }}/</span><span class=file-meta>{{ a.files.length }} file(s) · {{ $human(a.size) }}</span></summary>
              <a v-for="f in a.files" :key="f" class=file-row :href="fileUrl(s.data.n, a.name + '/' + f)" target=_blank rel=noopener>
                <Icon name="docs"/><span class=file-name>{{ f }}</span>
              </a>
            </details>
            <div v-else class=file>
              <a class=file-row :href="fileUrl(s.data.n, a.name)" target=_blank rel=noopener>
                <Icon name="docs"/><span class=file-name>{{ a.name }}</span>
                <span class=file-meta>{{ a.title }}<template v-if="a.title"> · </template>{{ $human(a.size) }}</span>
              </a>
              <img v-if="isImage(a.name)" class=file-preview :src="fileUrl(s.data.n, a.name)" :alt="a.title || a.name" loading=lazy>
            </div>
          </template>
        </div>
        <LinkedQuestions :rows="s.data.questions"/>
        <Comments :about="'doc ' + s.data.n" :env="s.data.track || envs[0] || ''" :key="'c-doc' + s.data.n"/>
        <div v-if="s.data.cited_by.length">
          <p class=section-label>Cited by</p>
          <div class=linked>
            <a v-for="(c, i) in s.data.cited_by" :key="i" :href="citedHref(c)">
              <span class=muted>{{ c.kind }} {{ c.n }}<template v-if="c.env"> · {{ c.env }}</template></span>
              <span v-html="$linkify(c.text)"></span>
            </a>
          </div>
        </div>
      </div>
    </div>`,
};

// ─────────────────────────────────────────────────────────────── a resource, opened beside the page
// what a click on a row opens without leaving the page, with a link to the resource's own page
const PEEK = {
  todo: { panel: "TodoPanel", page: (env, n) => `#/env/${env}/todos/${n}` },
  message: { panel: "MessagePanel", page: (env, n) => `#/env/${env}/messages/${n}` },
  question: { panel: "QuestionPanel", page: (env, n) => `#/env/${env}/questions/${n}` },
  suggestion: { panel: "SuggestionPanel", page: (env, n) => `#/env/${env}/suggestions/${n}` },
  work: { panel: "WorkPanel", page: (env, n) => `#/env/${env}/work/${n}` },
};

// Home's side panel: the resource's own panel, with its header linking to the page
const Peek = {
  props: ["env", "kind", "n", "close", "reloaded"],
  components: { TodoPanel, MessagePanel, QuestionPanel, WorkPanel, SuggestionPanel },
  setup() { return { PEEK }; },
  template: `
    <component :is="PEEK[kind].panel" :env="env" :n="n" :onClose="close" :link="PEEK[kind].page(env, n)" :reloaded="reloaded"/>`,
};

// ─────────────────────────────────────────────────────────────── an environment's home
const EnvHome = {
  props: ["env"],
  components: { TopBar, Icon, Peek },
  setup(props) {
    const url = (tail) => () => props.env && `/api/env/${props.env}${tail}`;
    const work = useFetch(url("/work"));
    const questions = useFetch(url("/questions"));
    const suggestions = useFetch(url("/suggestions"));
    const notes = useFetch(url("/notifications"));
    const plans = useFetch(url("/plans"));
    const view = reactive({ kind: "", n: 0 });
    const peek = (kind, n) => { view.kind = kind; view.n = n; INSPECTOR_TRAIL.current = `${kind}:${n}`; };
    const unpeek = () => { view.kind = ""; view.n = 0; INSPECTOR_TRAIL.current = null; };
    const reloadAll = () => [work, questions, suggestions, notes, plans].forEach((f) => f.reload());
    const readOne = (x) => send("POST", `/api/env/${props.env}/notifications/${x.n}/read`).then(() => { notes.reload(); changed(); });

    // Dismiss takes a row off this list without acting on it, remembered in this browser
    const dismissKey = computed(() => `journal.dismissed.${props.env}`);
    const dismissed = ref(new Set());
    watchEffect(() => {
      try { dismissed.value = new Set(JSON.parse(localStorage.getItem(dismissKey.value) || "[]")); } catch (e) { dismissed.value = new Set(); }
    });
    const dismiss = (it) => {
      dismissed.value = new Set([...dismissed.value, it.key]);
      try { localStorage.setItem(dismissKey.value, JSON.stringify([...dismissed.value].slice(-300))); } catch (e) { /* storage off */ }
    };

    // Over to you: what waits on the user, questions first, in one list
    const QUEUE_TYPES = { question: { label: "Question", tint: "#c9955e", action: "Answer" },
                          message: { label: "Message", tint: "#6fae7d", action: "Read" },
                          suggestion: { label: "Suggestion", tint: "#a3a8f0", action: "Accept" } };
    const SLOTS = 3;
    const queue = computed(() => {
      const rows = [
        ...(questions.data || []).filter((q) => q.status === "open").map((q) => ({ kind: "question", n: q.n, title: q.text, age: q.age })),
        ...(notes.data || []).filter((x) => String(x.about).startsWith("inbox:"))
          .map((x) => ({ kind: "message", n: Number(String(x.about).split(":")[1]), title: x.text, age: x.age || "just now", note: x })),
        ...(suggestions.data || []).filter((s) => s.status === "open").map((s) => ({ kind: "suggestion", n: s.n, title: s.title, age: s.age })),
      ];
      return rows.map((r) => ({ ...r, ...QUEUE_TYPES[r.kind], key: `${r.kind}:${r.n}` })).filter((r) => !dismissed.value.has(r.key))
        .map((r) => ({ ...r, open: () => { if (r.note) readOne(r.note); peek(r.kind, r.n); } }));
    });
    const trailOwner = {};
    watchEffect(() => {
      INSPECTOR_TRAIL.owner = trailOwner;
      INSPECTOR_TRAIL.items = queue.value.map((r) => ({ key: r.key, go: r.open }));
      INSPECTOR_TRAIL.current = view.kind ? `${view.kind}:${view.n}` : null;
    });
    onUnmounted(() => { if (INSPECTOR_TRAIL.owner === trailOwner) Object.assign(INSPECTOR_TRAIL, { owner: null, items: [], current: null }); });

    // what happened since the last visit: remembered per browser, stamped on leaving Home
    const seenKey = computed(() => `journal.home.seen.${props.env}`);
    const since = (() => { try { return Number(localStorage.getItem(`journal.home.seen.${props.env}`)) || Date.now() - 86400000; } catch (e) { return Date.now() - 86400000; } })();
    onUnmounted(() => { try { localStorage.setItem(seenKey.value, String(Date.now())); } catch (e) { /* storage off */ } });
    const agentEvents = computed(() => ((SHELL.activity && SHELL.activity.events) || [])
      .filter((e) => e.by === "Agent" && e.at && Date.parse(e.at) >= since));
    const DONE_WORDS = /^(Closed|Committed|Ended|Wrote|Writing|Replied|Replying|Answered|Filed|Drafted|Suggest|Turned)/;
    const doneAway = computed(() => agentEvents.value.filter((e) => DONE_WORDS.test(e.text)).slice(0, 6).map((e, i) => ({
      key: `${e.at}${i}`, age: e.age || "just now",
      text: [e.text, e.n, e.detail].filter(Boolean).join(" ") + (e.title ? ` — ${e.title}` : ""),
    })));
    const awayLine = computed(() => {
      const count = (re) => agentEvents.value.filter((e) => re.test(e.text)).length;
      const parts = [[count(/^Closed to-do/), "closed", "to-do", "to-dos"], [count(/^Committed/), "made", "commit", "commits"],
                     [count(/^Repl/), "answered", "of your messages", "of your messages"], [count(/^(Wrote|Writing) a report/), "wrote", "report", "reports"]]
        .filter(([n]) => n).map(([n, verb, one, many]) => (one.startsWith("of ") ? `${verb} ${n} ${one}` : `${verb} ${n} ${n === 1 ? one : many}`));
      if (!parts.length) return "Nothing new since you last looked.";
      const list = parts.length > 1 ? `${parts.slice(0, -1).join(", ")} and ${parts[parts.length - 1]}` : parts[0];
      return `While you were away it ${list}.`;
    });

    const plan = computed(() => (plans.data || []).find((p) => p.status === "active") || null);
    const continuePlan = () => send("POST", `/api/env/${props.env}/plans/${plan.value.n}/proceed`).then(() => { plans.reload(); changed(); });
    const openWork = computed(() => (work.data || []).map((w) => {
      const added = w.files.reduce((sum, f) => sum + (f.added || 0), 0);
      const removed = w.files.reduce((sum, f) => sum + (f.removed || 0), 0);
      return { ...w, files_text: w.files.length ? `${w.files.length} file${w.files.length === 1 ? "" : "s"} · +${added} −${removed}` : "" };
    }));
    const band = computed(() => {
      const agent = SHELL.activity && SHELL.activity.agent;
      const p = plan.value;
      const n = queue.value.length;
      const held = !!(p && p.held);
      const tag = n || held ? { text: "Waiting on you", tint: "#c9955e" } : agent && agent.working ? { text: "Working", tint: "#a3a8f0" } : { text: "Idle", tint: "#83868e" };
      const w = openWork.value[0];
      const headline = n ? (n === 1 ? "One thing is waiting on you" : `${n} things are waiting on you`)
        : held ? "The agent stopped at a checkpoint and needs you"
        : agent && agent.working ? (w ? `The agent is working on ${w.subject}` : "The agent is working") : "Nothing is waiting on you";
      const planHref = p ? `#/env/${props.env}/plans/${p.n}` : "";
      const primary = n ? { label: "Answer the first one", go: () => queue.value[0].open() }
        : held ? { label: "Continue past the checkpoint", go: continuePlan }
        : { label: "Open the to-dos", go: () => { location.hash = `#/env/${props.env}/todos`; } };
      const ctx = agent && agent.context ? `${agent.context.share}%` : "—";
      const auto = SHELL.activity ? (SHELL.activity.auto ? "On" : "Off") : "—";
      return { tag, headline, sub: awayLine.value, primary, planHref,
               stats: [{ label: "Agent", value: !agent ? "Stopped" : agent.working ? "Working" : "Idle" }, { label: "Context", value: ctx }, { label: "Auto mode", value: auto }] };
    });
    return { view, peek, unpeek, reloadAll, queue, dismiss, SLOTS, band, openWork, doneAway };
  },
  template: `
    <TopBar :crumbs="[env, 'Home']"/>
    <div class=body><div class=page><div class=cockpit>
      <section class=band>
        <div class=band-main>
          <span class=band-tag :style="{ color: band.tag.tint }">{{ band.tag.text }}</span>
          <h2 class=band-title>{{ band.headline }}</h2>
          <p class=band-sub>{{ band.sub }}</p>
          <div class=band-actions>
            <button type=button class=band-primary @click="band.primary.go">{{ band.primary.label }}<Icon name="arrow"/></button>
            <a v-if="band.planHref" class=btn :href="band.planHref">Open the plan</a>
          </div>
        </div>
        <div class=band-stats>
          <div v-for="s in band.stats" :key="s.label" class=band-stat><span>{{ s.label }}</span><span>{{ s.value }}</span></div>
        </div>
      </section>
      <div class=cockpit-cols>
        <section class=queue-col>
          <div class=queue-head><h2>Over to you</h2><span class=n>{{ queue.length ? queue.length + ' waiting' : 'clear' }}</span>
            <span v-if="queue.length > SLOTS" class=queue-hint>{{ queue.length - SLOTS }} more — scroll the list</span></div>
          <div class=queue-slot>
            <div v-for="it in queue" :key="it.key" :class="['queue-row', {sel: view.kind + ':' + view.n === it.key}]" @click="it.open">
              <span class=queue-dot :style="{ background: it.tint }"></span>
              <div class=queue-text>
                <span class=queue-label>{{ it.label }} {{ it.n }}<span class=queue-age> · {{ it.age }}</span></span>
                <span class=queue-title>{{ it.title }}</span>
              </div>
              <button type=button class=queue-act @click.stop="it.open">{{ it.action }}</button>
              <button type=button class=queue-dismiss title="Dismiss: take it off this list without acting" aria-label="Dismiss" @click.stop="dismiss(it)"><Icon name="close"/></button>
            </div>
            <div v-if="!queue.length" class=queue-empty><span>Nothing is waiting on you</span><span class=muted>The agent works on. It lands here when it needs you.</span></div>
            <div v-else-if="queue.length < SLOTS" class=queue-room>{{ queue.length === 1 ? 'Last one. Nothing else waiting on you.' : 'Nothing else waiting on you.' }}</div>
          </div>
        </section>
        <section class=work-col>
          <h2 class=col-title>The agent's work</h2>
          <a v-for="w in openWork" :key="w.n" class=work-card :href="'#/env/' + env + '/work/' + w.n" @click.prevent="peek('work', w.n)">
            <span class=work-card-meta>work {{ w.n }} · {{ w.age || 'just now' }}</span>
            <span class=work-card-title>{{ w.subject }}</span>
            <span v-if="w.files_text" class=work-card-meta>{{ w.files_text }}</span>
          </a>
          <p v-if="!openWork.length" class="muted col-empty">No work is open.</p>
          <h2 class="col-title quiet">Done while you were away</h2>
          <div v-for="d in doneAway" :key="d.key" class=done-row><span class=done-text>{{ d.text }}</span><span class=done-age>{{ d.age }}</span></div>
          <p v-if="!doneAway.length" class="muted col-empty">Nothing new since you last looked.</p>
        </section>
      </div>
    </div></div></div>
    <Peek v-if="view.kind" :key="view.kind + view.n" :env="env" :kind="view.kind" :n="view.n" :close="unpeek" :reloaded="reloadAll"/>`,
};

// ─────────────────────────────────────────────────────────────── tools
const Tools = {
  props: ["n"],
  components: { TopBar, Panel, ActionBar, ResourceList },
  setup(props) {
    const base = "#/tools";
    const list = useFetch(() => "/api/tools");
    const item = useFetch(() => props.n && props.n !== "new" && `/api/tools/${props.n}`);
    const creating = [{
      label: "New tool", method: "POST", url: "/api/tools", submit: "Add tool", leave: true,
      fields: [{ name: "name", label: "Name", placeholder: "one word, like suite" },
               { name: "title", label: "Title", placeholder: "what it does, in a few words" },
               { name: "summary", label: "Summary", placeholder: "the one line every session is handed" },
               { name: "usage", label: "Usage (optional)", placeholder: "how to call it" }],
      note: "Put the script in .journal/tools/<name>/ and set its entry from the terminal.",
    }];
    const actions = computed(() => {
      const t = item.data;
      if (!t) return [];
      const url = `/api/tools/${t.n}`;
      return [
        { label: "Edit", method: "PATCH", url, only: true, submit: "Save",
          fields: [{ name: "title", label: "Title", value: t.title }, { name: "summary", label: "Summary", value: t.summary },
                   { name: "usage", label: "Usage", value: t.usage }, { name: "when", label: "When to use it", value: t.when }] },
        { label: "Retire", method: "DELETE", url, danger: true, leave: true, fields: [{ name: "why", label: "Why it is retired" }] },
      ];
    });
    const done = (body, a) => settle(body, a, base, list, item);
    return { list, item, creating, actions, done, base, TOOL_LIST };
  },
  template: `
    <TopBar :crumbs="['Project', 'Tools']"/>
    <div class=body>
      <div class=list>
        <ResourceList v-bind="TOOL_LIST" :rows="list.data" :loading="list.loading" :error="list.error"
          :href="(t) => base + '/' + t.n" :selected="(t) => String(t.n) === n">
          <template #tools><a class="btn new" :href="base + '/new'">New tool</a></template>
        </ResourceList>
      </div>
      <Panel v-if="n === 'new'" label="New tool" :close="base">
        <ActionBar :actions="creating" open="New tool" :done="done"/>
      </Panel>
      <Panel v-else-if="n" :label="'Tool ' + (item.data ? item.data.name : '')" :close="base">
        <p v-if="item.error" class=error>{{ item.error }}</p>
        <template v-else-if="item.data">
          <h2 class=p-title>{{ item.data.title }}</h2>
          <p class=prose>{{ item.data.summary }}</p>
          <dl class=props>
            <dt>Name</dt><dd><code>{{ item.data.name }}</code></dd>
            <dt>Usage</dt><dd>{{ item.data.usage || '—' }}</dd>
            <dt>When</dt><dd>{{ item.data.when || '—' }}</dd>
            <dt>Script</dt><dd>{{ item.data.script || 'no entry point yet' }}</dd>
            <dt>Added</dt><dd>{{ item.data.age || '—' }}</dd>
          </dl>
          <ActionBar :actions="actions" :done="done" :key="'tool' + item.data.n"/>
          <div v-if="item.data.body" class="md prose" v-html="$md(item.data.body)"></div>
        </template>
      </Panel>
    </div>`,
};

// ─────────────────────────────────────────────────────────────── search
const SEARCH_KINDS = {
  todo: { label: "To-do", href: (env, n) => `#/env/${env}/todos/${n}` },
  pin: { label: "Pin", href: (env, n) => `#/env/${env}/pins/${n}` },
  rule: { label: "Rule", href: (env, n) => `#/rules/${n}` },
  question: { label: "Question", href: (env, n) => `#/env/${env}/questions/${n}` },
  message: { label: "Message", href: (env, n) => `#/env/${env}/messages/${n}` },
  reminder: { label: "Reminder", href: (env, n) => `#/env/${env}/reminders/${n}` },
  doc: { label: "Doc", href: (env, n) => `#/docs/${n}` },
};

function markHits(text) { return _escapeHtml(text).replace(/«/g, "<mark>").replace(/»/g, "</mark>"); }

const Search = {
  props: ["env"],
  components: { TopBar, Switch },
  setup(props) {
    const form = reactive({ text: "", all: false, term: "", page: 1 });
    const s = useFetch(() => props.env && form.term &&
      `/api/env/${props.env}/search?term=${encodeURIComponent(form.term)}&all=${form.all ? 1 : ""}&page=${form.page}`, { poll: false });
    const go = () => { form.term = form.text.trim(); form.page = 1; };
    return { form, s, go, kinds: SEARCH_KINDS, markHits };
  },
  template: `
    <TopBar :crumbs="[env, 'Search']"/>
    <div class=page><div class=home>
      <form class=search-bar @submit.prevent="go">
        <input class="input search-input" v-model="form.text" placeholder="Search to-dos, pins, docs, messages and the conversation">
        <Switch label="Every environment" :modelValue="form.all" @update:modelValue="(v) => { form.all = v; if (form.term) go(); }"/>
        <button type=submit class=primary :disabled="!form.text.trim() || (!!form.term && s.loading)">
          <span v-if="s.loading && form.term" class=spinner></span>{{ s.loading && form.term ? 'Searching' : 'Search' }}</button>
      </form>
      <p v-if="!form.term" class="prose muted">This searches like <code>journal search</code>: everything said in the sessions on this environment, and the journal's own to-dos, pins, rules, questions, messages, reminders and docs.</p>
      <p v-else-if="s.loading && !s.data" class=empty><span class=spinner></span> Searching…</p>
      <p v-else-if="s.error" class=error>{{ s.error }}</p>
      <template v-else-if="s.data">
        <section>
          <div class=home-head><h2>In the journal</h2><span class=n>{{ s.data.resources.length }}</span></div>
          <div class=block>
            <a v-for="r in s.data.resources" :key="r.kind + r.n" class="row searchrow" :href="kinds[r.kind].href(env, r.n)">
              <span class=tag>{{ kinds[r.kind].label }}</span><span class=num>#{{ r.n }}</span><span class=title>{{ r.text }}</span>
            </a>
            <p v-if="!s.data.resources.length" class=empty>Nothing in the journal mentions it.</p>
          </div>
        </section>
        <section>
          <div class=home-head><h2>In the conversation</h2><span class=n>{{ s.data.total }}</span></div>
          <div class=block>
            <template v-for="g in s.data.transcript" :key="g.session">
              <div class=ghead>{{ g.mine ? 'This session' : 'Session ' + g.session.slice(0, 8) }}<span class=n>{{ g.when }}</span></div>
              <div v-for="l in g.lines" :key="g.session + l.n" class="row hitrow">
                <span class=num>{{ l.n }}</span><span class=tag>{{ l.who === 'user' ? 'You' : 'Agent' }}</span>
                <span class="prose hit" v-html="markHits(l.text)"></span>
              </div>
            </template>
            <p v-if="!s.data.transcript.length" class=empty>Nothing that was said mentions it.</p>
          </div>
          <div v-if="s.data.pages > 1" class=pager>
            <button type=button class=btn :disabled="s.data.page <= 1" @click="form.page = s.data.page - 1">Newer</button>
            <span class=muted>Page {{ s.data.page }} of {{ s.data.pages }}</span>
            <button type=button class=btn :disabled="s.data.page >= s.data.pages" @click="form.page = s.data.page + 1">Older</button>
          </div>
        </section>
      </template>
    </div></div>`,
};

// ─────────────────────────────────────────────────────────────── an environment's settings
const Settings = {
  props: ["env"],
  components: { TopBar, ActionBar, Switch },
  setup(props) {
    const api = computed(() => `/api/env/${props.env}/environment`);
    const s = useFetch(() => props.env && api.value);
    const auto = reactive({ saving: false, error: null });
    async function setAuto(on) {
      auto.saving = true;
      auto.error = null;
      try {
        await postJSON(`${api.value}/settings`, { auto: on });
        s.reload();
        changed();
      } catch (e) {
        auto.error = e.message;
      } finally {
        auto.saving = false;
      }
    }
    const removing = computed(() => [{
      label: "Remove this environment", method: "POST", url: `${api.value}/remove`, danger: true, submit: "Remove it",
      fields: [{ name: "confirm", label: `Type ${props.env} to confirm` }],
      note: s.data ? `This deletes its ${s.data.pins} pin(s), ${s.data.todos} open to-do(s), its open work and its messages for good. Docs stay with the project.` : "",
    }]);
    const done = () => { changed(); location.hash = "#/"; };
    const keeping = computed(() => (s.data ? [{
      label: "Change", method: "POST", url: `${api.value}/settings`, submit: "Save",
      fields: [{ name: "reports_archive_days", label: "Days a report stays listed (0 keeps them)", value: String(s.data.reports_archive_days) }],
      shape: (p) => ({ reports_archive_days: parseInt(p.reports_archive_days, 10) }),
    }] : []));
    const archiving = computed(() => (s.data ? [{
      label: "Change", method: "POST", url: `${api.value}/settings`, submit: "Save",
      fields: [{ name: "todos_archive_days", label: "Days a done to-do stays listed (0 keeps them)", value: String(s.data.todos_archive_days) }],
      shape: (p) => ({ todos_archive_days: parseInt(p.todos_archive_days, 10) }),
    }] : []));
    const kept = () => { s.reload(); changed(); };
    const showing = computed(() => (s.data ? [{
      label: "Change", method: "POST", url: `${api.value}/settings`, submit: "Save",
      fields: [{ name: "activity_show", label: "Lines Activity shows", value: String(s.data.activity_show) },
               { name: "activity_keep", label: "Lines the activity log keeps", value: String(s.data.activity_keep) }],
      shape: (p) => ({ activity_show: parseInt(p.activity_show, 10), activity_keep: parseInt(p.activity_keep, 10) }),
    }] : []));
    const toggleActivity = () => setActivityShown(!ACTIVITY.shown);
    const saveSetting = (body) => postJSON(`${api.value}/settings`, body).then(() => { s.reload(); changed(); });
    return { s, auto, setAuto, saveSetting, removing, done, keeping, archiving, kept, showing, ACTIVITY, toggleActivity };
  },
  template: `
    <TopBar :crumbs="[env, 'Settings']"/>
    <div class=page><div class=settings-page>
      <p v-if="s.loading && !s.data" class=empty>Loading…</p>
      <p v-else-if="s.error" class=error>{{ s.error }}</p>
      <template v-else-if="s.data">
        <section class=settings-group>
          <h2>This environment</h2>
          <p class=settings-note>How long things stay listed here, and what the agent may do on its own.</p>
          <div class=settings-card>
            <div class=settings-row>
              <span class=settings-label>Auto mode</span>
              <span class=settings-value>{{ s.data.auto ? 'On: it works through to-dos without asking' : 'Off' }}</span>
              <button type=button class=btn :disabled="auto.saving" @click="setAuto(!s.data.auto)">{{ s.data.auto ? 'Turn off' : 'Turn on' }}</button>
              <p v-if="auto.error" class="error settings-wide">{{ auto.error }}</p>
            </div>
            <div class=settings-row>
              <span class=settings-label>Work from the viewer</span>
              <span class=settings-value>{{ s.data.viewer_first ? 'On: the agent answers here, one line in the terminal' : 'Off' }}</span>
              <button type=button class=btn @click="saveSetting({ viewer_first: !s.data.viewer_first })">{{ s.data.viewer_first ? 'Turn off' : 'Turn on' }}</button>
            </div>
            <div class=settings-row>
              <span class=settings-label>Days a report stays listed</span>
              <span class=settings-value>{{ s.data.reports_archive_days ? s.data.reports_archive_days + ' days' : 'Until archived' }}</span>
              <ActionBar :actions="keeping" :done="kept" :key="'keep' + s.data.reports_archive_days"/>
            </div>
            <div class=settings-row>
              <span class=settings-label>Days a done to-do stays listed</span>
              <span class=settings-value>{{ s.data.todos_archive_days ? s.data.todos_archive_days + ' days' : 'Until archived' }}</span>
              <ActionBar :actions="archiving" :done="kept" :key="'archive' + s.data.todos_archive_days"/>
            </div>
          </div>
        </section>
        <section class=settings-group>
          <h2>Activity column</h2>
          <p class=settings-note>Whether the column shows, how many lines it shows, and how much history the log keeps.</p>
          <div class=settings-card>
            <div class=settings-row>
              <span class=settings-label>Show the activity column</span>
              <span class=settings-value>{{ ACTIVITY.shown ? 'Shown' : 'Hidden' }}</span>
              <button type=button class=btn @click="toggleActivity">{{ ACTIVITY.shown ? 'Hide' : 'Show' }}</button>
            </div>
            <div class=settings-row>
              <span class=settings-label>Lines shown, and lines kept</span>
              <span class=settings-value>{{ s.data.activity_show }} shown · {{ s.data.activity_keep }} kept</span>
              <ActionBar :actions="showing" :done="kept" :key="'show' + s.data.activity_show + '-' + s.data.activity_keep"/>
            </div>
          </div>
        </section>
        <section class=settings-group>
          <h2>Project</h2>
          <p class=settings-note>What is kept on this environment, and what the whole project shares.</p>
          <div class=settings-card>
            <div class=settings-row><span class=settings-label>Pins</span><span class=settings-value>{{ s.data.pins }} standing</span><a class=btn :href="'#/env/' + env + '/pins'">Open</a></div>
            <div class=settings-row><span class=settings-label>Reminders</span><span class=settings-value></span><a class=btn :href="'#/env/' + env + '/reminders'">Open</a></div>
            <div class=settings-row><span class=settings-label>Coding style</span><span class=settings-value></span><a class=btn :href="'#/env/' + env + '/style'">Open</a></div>
            <div class=settings-row><span class=settings-label>Tools</span><span class=settings-value></span><a class=btn href="#/tools">Open</a></div>
            <div class=settings-row><span class=settings-label>Documents</span><span class=settings-value></span><a class=btn :href="'#/env/' + env + '/docs'">Open</a></div>
          </div>
        </section>
        <section class=settings-group>
          <h2>Remove this environment</h2>
          <div class=settings-card>
            <div class=settings-row>
              <p v-if="s.data.start" class="settings-label muted">New sessions start on this environment, so it cannot be removed. Make another environment the start environment first.</p>
              <template v-else>
                <span class=settings-label>Its pins, open to-dos, open work and messages are deleted for good. Docs stay with the project.</span>
                <ActionBar :actions="removing" :done="done"/>
              </template>
            </div>
          </div>
        </section>
      </template>
    </div></div>`,
};

const Home = { template: `<p class=empty>Loading…</p>` };
const NotFound = { components: { TopBar }, template: `<TopBar :crumbs="['Not found']"/><p class=empty>Nothing here.</p>` };

// every file stored for the environment: its messages' files and its documents' attachments
const Files = {
  props: ["env"],
  components: { TopBar, Icon },
  setup(props) {
    const list = useFetch(() => props.env && `/api/env/${props.env}/files`);
    const sourceHref = (f) => (f.source === "message" ? `#/env/${props.env}/messages/${f.n}` : `#/docs/${f.n}`);
    const sourceLabel = (f) => (f.source === "message" ? `Message ${f.n}` : `Document ${f.n}`);
    const images = computed(() => (list.data || []).filter((f) => f.image));
    const others = computed(() => (list.data || []).filter((f) => !f.image));
    return { list, sourceHref, sourceLabel, images, others };
  },
  template: `
    <TopBar :crumbs="[env, 'Documents', 'Files']"/>
    <div class=page>
      <div class=page-inner>
        <p v-if="list.loading && !list.data" class=empty>Loading…</p>
        <p v-else-if="list.error" class=error>{{ list.error }}</p>
        <p v-else-if="list.data && !list.data.length" class=empty>No files are stored on this environment yet. Files attached to a message or added to a document show here.</p>
        <template v-else-if="list.data">
        <div v-if="images.length">
          <p class=section-label>Images <span class=muted>{{ images.length }}</span></p>
          <div class=files-gallery>
            <figure v-for="f in images" :key="f.url" class=files-tile>
              <a class=files-tile-img :href="f.url" target=_blank rel=noopener :title="'Open ' + f.name"><img :src="f.url" :alt="f.name" loading=lazy></a>
              <figcaption><span class=files-tile-name :title="f.name">{{ f.name }}</span><a :href="sourceHref(f)">{{ sourceLabel(f) }}</a></figcaption>
            </figure>
          </div>
        </div>
        <div v-if="others.length">
        <p v-if="images.length" class=section-label>Other files <span class=muted>{{ others.length }}</span></p>
        <div class=files-page>
          <div v-for="f in others" :key="f.url" class=files-row>
            <a class=files-thumb :href="f.url" target=_blank rel=noopener :title="'Open ' + f.name">
              <img v-if="f.image" :src="f.url" :alt="f.name" loading=lazy>
              <Icon v-else :name="f.folder ? 'folder' : 'docs'"/>
            </a>
            <div class=files-main>
              <a class=files-name :href="f.url" target=_blank rel=noopener>{{ f.name }}<span v-if="f.folder">/</span></a>
              <span class=files-meta>
                <a :href="sourceHref(f)">{{ sourceLabel(f) }}</a>
                <span> · {{ f.folder ? f.count + ' file(s) · ' : '' }}{{ $human(f.size) }}</span>
              </span>
            </div>
            <span class=files-age>{{ f.age || 'just now' }}</span>
          </div>
        </div>
        </div>
        </template>
      </div>
    </div>`,
};

// what one commit covered: the work it was made during, and that work's to-dos
const Commit = {
  props: ["env", "sha"],
  components: { TopBar },
  setup(props) {
    const found = useFetch(() => props.env && props.sha && `/api/env/${props.env}/commits?sha=${props.sha}`);
    return { found };
  },
  template: `
    <TopBar :crumbs="[env, 'Commit ' + sha.slice(0, 7)]"/>
    <div class=page>
      <div class=page-inner>
        <p v-if="found.loading && !found.data" class=empty>Loading…</p>
        <p v-else-if="found.error" class=error>{{ found.error }}</p>
        <template v-else-if="found.data">
          <h1 class=p-title>{{ found.data.subject || 'Commit ' + sha.slice(0, 7) }}</h1>
          <dl class=props>
            <dt>Commit</dt><dd><span class="chip sha">{{ found.data.sha.slice(0, 12) }}</span>
              <a v-if="found.data.url" class="btn flush" :href="found.data.url" target=_blank rel=noopener>View on GitHub</a></dd>
            <template v-if="found.data.author"><dt>Author</dt><dd>{{ found.data.author }}</dd></template>
            <dt>Made</dt><dd>{{ found.data.date ? new Date(found.data.date).toLocaleString() : '' }}<span class=muted>{{ found.data.date ? ' · ' : '' }}{{ found.data.age || 'just now' }}</span></dd>
            <dt>Pull request</dt><dd>
              <a v-if="found.data.pull_request" class=chip :href="found.data.pull_request.url" target=_blank rel=noopener>#{{ found.data.pull_request.number }} {{ found.data.pull_request.title }} · {{ found.data.pull_request.state.toLowerCase() }}</a>
              <span v-else class=muted>{{ found.data.url ? 'None holds this commit' : 'Not known' }}</span></dd>
          </dl>
          <div v-if="found.data.body">
            <p class=section-label>Message</p>
            <div class="prose commit-body">{{ found.data.body }}</div>
          </div>
          <div>
            <p class=section-label>Work <span class=muted>{{ found.data.work.length }}</span></p>
            <div class=linked>
              <a v-for="w in found.data.work" :key="w.n" class="sub log-row" :href="'#/env/' + env + '/work/' + w.n">
                <span class=log-text>{{ w.subject }}</span><span class=log-work>{{ w.ended ? 'Ended' : 'Open' }} · Work {{ w.n }}</span>
              </a>
            </div>
          </div>
          <div>
            <p class=section-label>To-dos <span class=muted>{{ found.data.todos.length }}</span></p>
            <p v-if="!found.data.todos.length" class="prose muted">The work this commit was made during is not tied to a to-do.</p>
            <div v-else class=linked>
              <a v-for="t in found.data.todos" :key="t.n" class="sub log-row" :href="'#/env/' + env + '/todos/' + t.n">
                <span class=log-text>{{ t.title }}</span><span class=log-work>{{ t.done ? 'Done' : 'Open' }} · To-do {{ t.n }}</span>
              </a>
            </div>
          </div>
          <div v-if="found.data.files && found.data.files.length">
            <p class=section-label>Files changed <span class=muted>{{ found.data.files.length }}</span></p>
            <div class=work-files>
              <div v-for="f in found.data.files" :key="f.path" class=work-file :title="f.path">
                <span class=work-file-path>{{ f.path }}</span>
                <span class=work-file-add>+{{ f.added }}</span><span class=work-file-del>−{{ f.removed }}</span>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>`,
};

// ─────────────────────────────────────────────────────────────── one agent
const AGENT_STATUS = { working: "Working", idle: "Idle", ended: "Ended", finished: "Finished" };
const TRANSCRIPT_WHO = { human: "You", text: "Agent", tool_result: "Tool result", injected: "Journal", task: "Task",
                         peer: "Another session", superseded: "You, edited" };

// the viewer cannot load a skill itself: it asks the agent, now or at every start
function useSkillActions(env, name, skill, reloaded) {
  const acting = reactive({ busy: false, said: "", error: "" });
  const act = async (fn) => {
    if (acting.busy) return;
    Object.assign(acting, { busy: true, said: "", error: "" });
    try { acting.said = await fn(); } catch (e) { acting.error = e.message; } finally { acting.busy = false; }
  };
  const loadNow = () => act(async () => {
    await postJSON(`/api/env/${env()}/inbox`, { text: `Please load the \`${name()}\` skill now.`, files: [] });
    changed();
    return "The agent is asked to load it. It gets the message at its next stop, or at once if it is idle.";
  });
  const toggleAlways = () => act(async () => {
    const on = !(skill.data && skill.data.always);
    await postJSON(`/api/env/${env()}/environment/settings`, { always_load: name(), always_on: on });
    skill.reload();
    if (reloaded) reloaded();
    return on ? "Every session is told to load it at its start." : "Sessions are no longer told to load it at their start.";
  });
  return { acting, loadNow, toggleAlways };
}

const SkillPanel = {
  props: ["env", "name", "onClose", "reloaded"],
  components: { Panel },
  setup(props) {
    const skill = useFetch(() => props.name && `/api/skills/${props.name}`, { poll: false });
    const page = computed(() => `#/env/${props.env}/skills/${props.name}`);
    return { skill, page, ...useSkillActions(() => props.env, () => props.name, skill, props.reloaded) };
  },
  template: `
    <Panel label="Skill" :onClose="onClose" :link="page">
      <p v-if="skill.error" class=error>{{ skill.error }}</p>
      <p v-else-if="!skill.data" class=empty>Loading…</p>
      <template v-else>
        <h2 class=p-title>{{ skill.data.name }}</h2>
        <dl class=props><dt>Where</dt><dd>{{ skill.data.source === 'user' ? "Your own skills" : "This project's skills" }}</dd>
          <dt>At every start</dt><dd>{{ skill.data.always ? 'Yes, every session is told to load it' : 'No' }}</dd></dl>
        <div class=skill-actions>
          <button type=button :class="['btn', {on: skill.data.always}]" :disabled="acting.busy" @click="toggleAlways">
            {{ skill.data.always ? 'Stop loading it at every start' : 'Load it at every start' }}</button>
          <button type=button class=btn :disabled="acting.busy" @click="loadNow">Ask the agent to load it now</button>
          <a class=btn :href="page">Read the skill</a>
        </div>
        <p v-if="acting.said" class="prose muted">{{ acting.said }}</p>
        <p v-if="acting.error" class=error>{{ acting.error }}</p>
        <div>
          <p class=section-label>Loads when</p>
          <p class=prose>{{ skill.data.description }}</p>
        </div>
      </template>
    </Panel>`,
};

const Agent = {
  props: ["env", "kind", "id"],
  components: { TopBar, SkillPanel },
  setup(props) {
    const about = useFetch(() => props.env && props.id && `/api/env/${props.env}/agent?kind=${props.kind}&agent=${props.id}`);
    const shown = ref(10);
    // a skill opens in the side panel first; its page is one click further
    const picked = ref(null);
    const pickSkill = (event, s) => {
      if (!s.readable || event.metaKey || event.ctrlKey || event.shiftKey) return;
      event.preventDefault();
      picked.value = s.name;
    };
    const closeSkill = () => { picked.value = null; };
    return { about, AGENT_STATUS, shown, picked, pickSkill, closeSkill };
  },
  template: `
    <TopBar :crumbs="[env, 'Agents', about.data ? about.data.name : (kind === 'subagent' ? 'Subagent ' : 'Session ') + id]"/>
    <div class=body><div class=page><div class=page-inner>
      <p v-if="about.error" class=error>{{ about.error }}</p>
      <p v-else-if="!about.data" class=empty>Loading…</p>
      <template v-else>
        <h1 class=p-title>{{ about.data.name }}</h1>
        <dl class=props>
          <dt>Status</dt><dd><span :class="['agent-status', about.data.status]">{{ AGENT_STATUS[about.data.status] || about.data.status }}</span><span v-if="about.data.seen" class=muted> · last seen {{ about.data.seen }}</span></dd>
          <dt>Agent</dt><dd>{{ about.data.kind === 'subagent' ? 'Subagent' : 'Session' }} {{ about.data.id }}</dd>
          <template v-if="about.data.parent"><dt>Sent by</dt><dd><a class=chip :href="'#/env/' + env + '/agents/session/' + about.data.parent">Session {{ about.data.parent }}</a></dd></template>
          <dt>Environment</dt><dd>{{ about.data.env }}</dd>
          <template v-if="about.data.model"><dt>Model</dt><dd>{{ about.data.model }}</dd></template>
          <template v-if="about.data.context"><dt>Context</dt><dd>{{ about.data.context.share }}% used</dd></template>
        </dl>
        <div v-if="about.data.has_transcript" class=agent-links>
          <a class=btn :href="'#/env/' + env + '/agents/' + kind + '/' + id + '/transcript'">Open transcript</a>
        </div>
        <template v-if="about.data.kind === 'session'">
          <div>
            <p class=section-label>Most recent work <span class=muted>{{ about.data.work.length }}</span></p>
            <p v-if="!about.data.work.length" class="prose muted">This session has not declared any work here.</p>
            <div v-else class=agent-work>
              <div class=agent-work-head><span>Work</span><span>Status</span><span>Files</span><span>Commits</span><span>When</span></div>
              <a v-for="w in about.data.work.slice(0, shown)" :key="w.n" class=agent-work-row :href="'#/env/' + env + '/work/' + w.n">
                <span class=title>{{ w.subject }}</span>
                <span :class="['agent-work-status', {open: !w.ended}]">{{ w.ended ? 'Ended' : 'Open' }}</span>
                <span class=num>{{ w.files || '—' }}</span>
                <span class=num>{{ w.commits || '—' }}</span>
                <span class=age>{{ w.when }}</span>
              </a>
              <button v-if="about.data.work.length > shown" type=button class="btn agent-work-more" @click="shown += 10">Load more</button>
            </div>
          </div>
          <div>
            <p class=section-label>Subagents it sent <span class=muted>{{ about.data.dispatched.length }}</span></p>
            <p v-if="!about.data.dispatched.length" class="prose muted">No subagents from this session are recorded here.</p>
            <div v-else class="agent-work dispatched">
              <div class=agent-work-head><span>Subagent</span><span>Status</span><span>Model</span><span>Last wrote</span></div>
              <a v-for="a in about.data.dispatched" :key="a.id" class=agent-work-row :href="'#/env/' + env + '/agents/subagent/' + a.id">
                <span class=title>{{ a.name }}</span>
                <span :class="['agent-work-status', {open: a.working}]">{{ a.working ? 'Working' : 'Finished' }}</span>
                <span class=num>{{ a.model || '—' }}</span>
                <span class=age>{{ String(a.age || '').replace(/^last wrote /, '') }}</span>
              </a>
            </div>
          </div>
        </template>
        <div v-if="about.data.skills && about.data.skills.length">
          <p class=section-label>Skills <span class=muted>{{ about.data.skills.filter((s) => s.loaded).length }} loaded of {{ about.data.skills.length }}</span></p>
          <div class="agent-work skills">
            <div class=agent-work-head><span>Skill</span><span>Where</span><span>Loaded</span></div>
            <component :is="s.readable ? 'a' : 'div'" v-for="s in about.data.skills" :key="s.source + s.name" :class="['agent-work-row', {picked: picked === s.name}]"
              :href="s.readable ? '#/env/' + env + '/skills/' + s.name : null" :title="s.description || null" @click="pickSkill($event, s)">
              <span class=title>{{ s.name }}<span v-if="s.always" class=skill-always>every start</span></span>
              <span class=num>{{ s.source }}</span>
              <span :class="['agent-work-status', {open: s.loaded}]">{{ s.loaded ? (s.loaded === 1 ? 'Once' : s.loaded + ' times') : '—' }}</span>
            </component>
          </div>
        </div>
      </template>
    </div></div>
    <SkillPanel v-if="picked" :key="'skill' + picked" :env="env" :name="picked" :onClose="closeSkill" :reloaded="about.reload"/>
    </div>`,
};

// an agent's raw transcript: the newest lines first, older ones a thousand at a time as you scroll up
const AgentTranscript = {
  props: ["env", "kind", "id"],
  components: { TopBar },
  setup(props) {
    const log = reactive({ rows: [], prev: null, total: 0, loading: false, error: "", started: false });
    const top = ref(null);
    const scroller = () => (top.value ? top.value.closest(".page") : null);
    const load = async () => {
      if (log.loading || (log.started && log.prev == null)) return;
      log.loading = true;
      log.error = "";
      const box = scroller();
      const fromBottom = box ? box.scrollHeight - box.scrollTop : 0;
      try {
        const before = log.started ? `&before=${log.prev}` : "";
        const res = await fetch(`/api/env/${props.env}/agent?kind=${props.kind}&agent=${props.id}&transcript=1&limit=1000${before}`);
        const body = await res.json();
        if (!res.ok) { log.error = body.error || "The transcript could not be read."; log.started = true; log.prev = null; return; }
        const first = !log.started;
        log.rows = body.lines.concat(log.rows);
        Object.assign(log, { prev: body.prev, total: body.total, started: true });
        await Vue.nextTick();
        const el = scroller();
        if (!el) return;
        // the first load opens at the newest line; an older page keeps the reader where they were
        el.scrollTop = first ? el.scrollHeight : el.scrollHeight - fromBottom;
        if (first) requestAnimationFrame(() => { el.scrollTop = el.scrollHeight; });
      } catch (err) {
        log.error = err.message;
      } finally {
        log.loading = false;
      }
    };
    let watcher = null;
    onMounted(() => {
      watcher = new IntersectionObserver((seen) => { if (log.started && seen.some((e) => e.isIntersecting)) load(); }, { rootMargin: "600px 0px" });
      if (top.value) watcher.observe(top.value);
    });
    onUnmounted(() => { if (watcher) watcher.disconnect(); });
    load();
    const time = (ts) => (ts ? new Date(ts).toLocaleString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit" }) : "");
    return { log, top, time, TRANSCRIPT_WHO };
  },
  template: `
    <TopBar :crumbs="[env, 'Agents', (kind === 'subagent' ? 'Subagent ' : 'Session ') + id, 'Transcript']"/>
    <div class=body><div class=page><div class="page-inner tlog">
      <div class=tlog-head>
        <a class="btn flush" :href="'#/env/' + env + '/agents/' + kind + '/' + id">Back to the agent</a>
        <span class=muted>{{ log.total ? log.rows.length + ' of ' + log.total + ' lines' : '' }}</span>
      </div>
      <div ref=top class=tlog-end>{{ log.loading && log.rows.length ? 'Loading earlier lines…' : log.started && log.prev == null && log.rows.length ? 'Start of the transcript.' : '' }}</div>
      <p v-if="log.error" class=error>{{ log.error }}</p>
      <p v-if="log.loading && !log.rows.length" class=empty>Loading…</p>
      <div v-for="l in log.rows" :key="l.n" :class="['tlog-line', 'tlog-' + l.kind]">
        <div class=tlog-meta><span class=tlog-who>{{ TRANSCRIPT_WHO[l.kind] || l.kind }}</span><span>{{ time(l.ts) }}</span><span class=tlog-n>#{{ l.n }}</span></div>
        <div v-if="l.tools.length" class=tlog-tools>Used {{ l.tools.join(', ') }}</div>
        <pre v-if="l.text" class=tlog-text>{{ l.text }}</pre>
        <span v-if="l.clipped" class=muted>Cut short here.</span>
      </div>
    </div></div></div>`,
};

// the version this viewer runs and what changed, newest first
const About = {
  components: { TopBar },
  setup() {
    const about = useFetch(() => "/api/about", { poll: false });
    // the file's own title and preamble stay out: the page has its own head
    const log = computed(() => { const t = (about.data && about.data.changelog) || ""; const i = t.indexOf("\n## "); return i < 0 ? t : t.slice(i + 1); });
    return { about, log };
  },
  template: `
    <TopBar :crumbs="['About']"/>
    <div class=body><div class=page><div class=page-inner>
      <p v-if="about.error" class=error>{{ about.error }}</p>
      <p v-else-if="!about.data" class=empty>Loading…</p>
      <template v-else>
        <h1 class=p-title>Agent journal</h1>
        <dl class=props><dt>Version</dt><dd>{{ about.data.version }}</dd></dl>
        <div>
          <p class=section-label>Changelog</p>
          <div class="md prose about-log" v-html="$md(log)"></div>
        </div>
      </template>
    </div></div></div>`,
};

// one skill's text, read-only: skills are edited in the project's files, not here
const SkillView = {
  props: ["env", "name"],
  components: { TopBar },
  setup(props) {
    const skill = useFetch(() => props.name && `/api/skills/${props.name}`, { poll: false });
    const body = computed(() => String((skill.data && skill.data.text) || "").replace(/^---\n[\s\S]*?\n---\n/, ""));
    return { skill, body, ...useSkillActions(() => props.env, () => props.name, skill) };
  },
  template: `
    <TopBar :crumbs="['Skills', name]"/>
    <div class=body><div class=page><div class=page-inner>
      <p v-if="skill.error" class=error>{{ skill.error }}</p>
      <p v-else-if="!skill.data" class=empty>Loading…</p>
      <template v-else>
        <h1 class=p-title>{{ skill.data.name }}</h1>
        <dl class=props><dt>Where</dt><dd>{{ skill.data.source === 'user' ? "Your own skills" : "This project's skills" }}</dd>
          <dt>Loads when</dt><dd>{{ skill.data.description }}</dd>
          <dt>At every start</dt><dd>{{ skill.data.always ? 'Yes, every session is told to load it' : 'No' }}</dd></dl>
        <div v-if="env" class=skill-actions>
          <button type=button class=btn :disabled="acting.busy" @click="loadNow">Ask the agent to load it now</button>
          <button type=button :class="['btn', {on: skill.data.always}]" :disabled="acting.busy" @click="toggleAlways">
            {{ skill.data.always ? 'Stop loading it at every start' : 'Load it at every start' }}</button>
        </div>
        <p v-if="acting.said" class="prose muted">{{ acting.said }}</p>
        <p v-if="acting.error" class=error>{{ acting.error }}</p>
        <p class="prose muted">Read-only. A skill is changed in its SKILL.md file, not through the journal.</p>
        <div class="md prose" v-html="$md(body)"></div>
      </template>
    </div></div></div>`,
};

const VIEWS = { Home, EnvHome, Todos, Pins, Rules, Inbox, Questions, Suggestions, Style, Reports, Plans, Work, Reminders, Docs, EnvDocs, DocDetail, Settings, Search, Tools, Files, Commit, Agent, AgentTranscript, About, SkillView, NotFound };

// ─────────────────────────────────────────────────────────────── the app shell
// open work lives on Home, so the sidebar has no entry of its own for it
const NAV = [
  { key: "home", label: "Home", views: ["EnvHome", "Work"], path: "", count: "notifications" },
  { key: "inbox", label: "Inbox", views: ["Inbox", "Questions", "Suggestions"], path: "messages", count: ["questions", "suggestions"] },
  { key: "todos", label: "To-dos", views: ["Todos"], path: "todos", count: "todos" },
  { key: "docs", label: "Documents", views: ["EnvDocs", "Files", "Reports", "Plans"], path: "docs", count: "docs" },
  { key: "settings", label: "Settings", views: ["Settings"], path: "settings" },
];

// the Activity panel, always shown in the right column
const ActivityPanel = {
  props: { data: Object, href: Function, env: String },
  components: { Icon },
  setup(props) {
    const accept = (e) => send("POST", `/api/env/${props.env}/suggestions/${e.n}/accept`)
      .then(() => window.dispatchEvent(new CustomEvent("journal:changed")));
    // a quick message from the bottom of the column: the same message the Messages page sends
    const quick = reactive({ text: "", sending: false, error: "" });
    const box = ref(null);
    const grow = () => { const el = box.value; if (!el) return; el.style.height = "auto"; el.style.height = `${Math.min(el.scrollHeight, 120)}px`; };
    const sendQuick = async () => {
      if (!quick.text.trim() || quick.sending || !props.env) return;
      quick.sending = true;
      quick.error = "";
      try {
        await postJSON(`/api/env/${props.env}/inbox`, { text: quick.text, files: [] });
        quick.text = "";
        requestAnimationFrame(grow);
        window.dispatchEvent(new CustomEvent("journal:changed"));
      } catch (err) {
        quick.error = err.message;
      } finally {
        quick.sending = false;
      }
    };
    // who is working on this environment: its sessions, and the subagents they dispatched
    const crew = reactive({ open: false });
    const agentsList = useFetch(() => props.env && `/api/env/${props.env}/agents`);
    const working = computed(() => (agentsList.data || []).filter((a) => a.working).length);
    const crewGroups = computed(() => [
      { key: "active", label: "Active", rows: (agentsList.data || []).filter((a) => a.working) },
      { key: "idle", label: "Idle", rows: (agentsList.data || []).filter((a) => !a.working) },
    ].filter((g) => g.rows.length));
    const outsideCrew = (e) => { if (!e.target.closest(".drop-wrap.crew")) crew.open = false; };
    watchEffect((onCleanup) => {
      if (!crew.open) return;
      document.addEventListener("mousedown", outsideCrew);
      onCleanup(() => document.removeEventListener("mousedown", outsideCrew));
    });
    // each line keyed by when, what and which, so a line keeps its place while newer ones arrive above it
    const keyed = computed(() => {
      const seen = {};
      return ((props.data && props.data.events) || []).map((e) => {
        const k = `${e.at}|${e.kind}|${e.n}|${e.text}|${e.title}`;
        seen[k] = (seen[k] || 0) + 1;
        return { e, key: `${k}#${seen[k]}` };
      });
    });
    // a new line brings the list back to the top, unless the pointer is over it
    const list = ref(null);
    const hovered = ref(false);
    watch(() => keyed.value[0] && keyed.value[0].key, (now, was) => {
      if (!now || !was || now === was || hovered.value || !list.value) return;
      list.value.scrollTo({ top: 0, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
    });
    return { accept, quick, box, grow, sendQuick, crew, agentsList, working, crewGroups, keyed, list, hovered };
  },
  template: `
    <div class=activity-panel>
      <div class=activity-head><span class=group-label>Activity</span>
        <span class=activity-head-tools>
          <span class="drop-wrap crew">
            <button type=button :class="['icon-btn', {on: crew.open}]" title="Agents working here" aria-label="Agents working here"
              :aria-expanded="crew.open" @click="crew.open = !crew.open; agentsList.reload()">
              <Icon name="agents"/><span v-if="working" class="tool-badge count">{{ working }}</span>
            </button>
            <div v-if="crew.open" class=drop>
              <div class=drop-head><span>Agents on {{ env }}</span></div>
              <p v-if="!crewGroups.length" class="muted drop-empty">No agent is working on this environment.</p>
              <template v-for="g in crewGroups" :key="g.key">
              <p class=drop-sub>{{ g.label }} <span class=muted>{{ g.rows.length }}</span></p>
              <a v-for="a in g.rows" :key="a.kind + a.id" :class="['drop-row', {idle: !a.working}]" :href="'#/env/' + env + '/agents/' + a.kind + '/' + a.id"
                :title="'Open ' + (a.name || (a.kind === 'subagent' ? 'subagent ' : 'session ') + a.id)" @click="crew.open = false">
                <span class=drop-kind>{{ a.kind === 'subagent' ? 'Subagent' : 'Session' }} · {{ a.working ? 'Working' : a.state === 'finished' ? 'Finished' : 'Idle' }}{{ a.kind === 'subagent' && a.model ? ' · ' + a.model : '' }}{{ a.kind === 'subagent' && !a.working && a.age_text ? ' · ' + a.age_text : '' }}</span>
                <span class=drop-text>{{ a.name || (a.kind === 'subagent' ? 'Subagent ' + a.id : 'Session ' + a.id) }}<span v-if="a.parent" class=muted> · from session {{ a.parent }}</span></span>
              </a>
              </template>
            </div>
          </span>
        </span>
      </div>
      <template v-if="data">
        <div v-if="data.agent && data.agent.said" class=activity-said>
          <span class=activity-said-head>Agent said</span>
          <div class=activity-said-text>{{ data.agent.said }}</div>
        </div>
        <div class=activity-list ref=list @mouseenter="hovered = true" @mouseleave="hovered = false">
          <TransitionGroup name=act>
          <template v-for="{ e, key } in keyed" :key="key">
            <div v-if="e.needs === 'open' && href(e)" class="activity-row activity-alert">
              <a class=activity-alert-body :href="href(e)">
                <span class=activity-text>{{ e.text }}<span v-if="e.n" class=activity-n> {{ e.n }}</span><span v-if="e.detail" class=activity-d>{{ e.detail }}</span></span>
                <span v-if="e.title" class=activity-title>{{ e.title }}</span>
                <span class=activity-age>{{ e.by }} · {{ e.age || 'just now' }}</span>
              </a>
              <span class=activity-actions>
                <a v-if="e.kind === 'question'" class="btn warn" :href="href(e)">Answer</a>
                <a v-else-if="e.kind === 'message'" class="btn warn" :href="href(e)">Open</a>
                <template v-else-if="e.kind === 'suggestion'">
                  <button type=button class="btn warn" @click="accept(e)">Accept</button>
                  <a class=btn :href="href(e)">Review</a>
                </template>
              </span>
            </div>
            <a v-else-if="href(e)" :class="['activity-row', 'activity-link', {'activity-soft': e.needs === 'answered', 'activity-commit': e.kind === 'commit'}]" :href="href(e)">
              <span class=activity-text>{{ e.text }}<span v-if="e.n" class=activity-n> {{ e.n }}</span><span v-if="e.detail" class=activity-d>{{ e.detail }}</span></span>
              <span v-if="e.title" class=activity-title>{{ e.title }}</span>
              <span class=activity-age>{{ e.by }} · {{ e.age || 'just now' }}</span>
            </a>
            <div v-else class=activity-row>
              <span class=activity-text>{{ e.text }}<span v-if="e.n" class=activity-n> {{ e.n }}</span><span v-if="e.detail" class=activity-d>{{ e.detail }}</span></span>
              <span v-if="e.title" class=activity-title>{{ e.title }}</span>
              <span class=activity-age>{{ e.by }} · {{ e.age || 'just now' }}</span>
            </div>
          </template>
          </TransitionGroup>
        </div>
        <form v-if="env" class=activity-compose @submit.prevent="sendQuick">
          <div class=compose-field>
            <textarea ref=box v-model="quick.text" rows=1 placeholder="Message the agent" aria-label="Message the agent"
              :disabled="quick.sending" @input="grow"
              @keydown.enter.exact="!$event.isComposing && ($event.preventDefault(), sendQuick())"
              @keydown.meta.enter.prevent="sendQuick" @keydown.ctrl.enter.prevent="sendQuick"></textarea>
            <button v-if="quick.text.trim()" type=submit class=compose-send :disabled="quick.sending" title="Send" aria-label="Send"><Icon name="arrow"/></button>
          </div>
          <p v-if="quick.error" class=compose-error>{{ quick.error }}</p>
        </form>
      </template>
    </div>`,
};

// the quick menu: space opens it anywhere; what is typed goes to the agent unless a command is picked
const QUICK = reactive({ open: false, q: "", i: 0 });
const TOAST = reactive({ text: "" });
let toastTimer = 0;

function flash(text) {
  TOAST.text = text;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { TOAST.text = ""; }, 2600);
}

const QuickMenu = {
  props: ["env"],
  components: { Icon },
  setup(props) {
    const input = ref(null);
    onMounted(() => { if (input.value) input.value.focus(); });
    const questions = useFetch(() => props.env && `/api/env/${props.env}/questions`);
    const suggestions = useFetch(() => props.env && `/api/env/${props.env}/suggestions`);
    const plans = useFetch(() => props.env && `/api/env/${props.env}/plans`);
    const close = () => Object.assign(QUICK, { open: false, q: "", i: 0 });
    const goTo = (hash) => () => { close(); location.hash = hash; };
    const rows = computed(() => {
      const base = `#/env/${props.env}`;
      const q = QUICK.q.trim();
      const openQuestions = (questions.data || []).filter((x) => x.status === "open");
      const openSuggestions = (suggestions.data || []).filter((x) => x.status === "open");
      const waiting = openQuestions.length + openSuggestions.length;
      const plan = (plans.data || []).find((p) => p.status === "active") || null;
      const auto = !!(SHELL.activity && SHELL.activity.auto);
      const commands = [
        { label: "Go to Home", keys: "home queue cockpit", hint: "page", run: goTo(base) },
        { label: "Go to Inbox", keys: "inbox messages questions suggestions", hint: "page", run: goTo(`${base}/messages`) },
        { label: "Go to To-dos", keys: "todos todo tasks", hint: "page", run: goTo(`${base}/todos`) },
        { label: "Go to Documents", keys: "documents docs reports plans", hint: "page", run: goTo(`${base}/docs`) },
        ...(plan ? [{ label: "Go to the plan", keys: "plan phases checkpoint", hint: "page", run: goTo(`${base}/plans/${plan.n}`) }] : []),
        { label: "Go to Settings", keys: "settings preferences", hint: "page", run: goTo(`${base}/settings`) },
      ];
      if (waiting) {
        const first = openQuestions.length ? `${base}/messages/q/${openQuestions[0].n}` : `${base}/messages/s/${openSuggestions[0].n}`;
        commands.unshift({ label: `Answer the first of ${waiting} waiting on you`, keys: "answer waiting", hint: "inspector", run: goTo(first) });
      }
      if (plan && plan.held) {
        commands.push({ label: "Continue past the checkpoint", keys: "continue checkpoint plan", hint: "agent",
                        run: () => { close(); send("POST", `/api/env/${props.env}/plans/${plan.n}/proceed`).then(() => { changed(); flash("The agent is working again"); }); } });
      }
      commands.push({ label: auto ? "Pause auto mode" : "Resume auto mode", keys: "auto mode", hint: "agent",
                      run: () => { close(); if (SHELL.setAuto) SHELL.setAuto(!auto); flash(auto ? "Auto mode paused" : "Auto mode on"); } });
      commands.push({ label: ACTIVITY.shown ? "Hide the activity column" : "Show the activity column", keys: "activity column", hint: "view",
                      run: () => { close(); setActivityShown(!ACTIVITY.shown); } });
      const needle = q.toLowerCase();
      const found = commands.filter((c) => !q || `${c.label} ${c.keys}`.toLowerCase().includes(needle));
      if (!q) return found;
      const message = { label: `Send “${q}” to the agent`, hint: "message",
                        run: () => { close(); postJSON(`/api/env/${props.env}/inbox`, { text: q, files: [] }).then(() => { changed(); flash("Sent to the agent"); }); } };
      return [message, ...found];
    });
    const at = computed(() => Math.max(0, Math.min(QUICK.i, rows.value.length - 1)));
    const onKey = (e) => {
      if (e.key === "ArrowDown") { e.preventDefault(); QUICK.i = Math.min(at.value + 1, rows.value.length - 1); }
      else if (e.key === "ArrowUp") { e.preventDefault(); QUICK.i = Math.max(at.value - 1, 0); }
      else if (e.key === "Enter") { e.preventDefault(); e.stopPropagation(); if (rows.value[at.value]) rows.value[at.value].run(); }
      else if (e.key === "Escape") { e.preventDefault(); e.stopPropagation(); close(); }
    };
    const onInput = (e) => { QUICK.q = e.target.value; QUICK.i = 0; };
    return { QUICK, input, rows, at, onKey, onInput, close };
  },
  template: `
    <div class=quick-scrim @click="close"></div>
    <div class=quick-menu role=dialog aria-label="Quick menu">
      <div class=quick-head>
        <Icon name="arrow"/>
        <input ref=input class=quick-input :value="QUICK.q" placeholder="Message the agent, or type a command…"
          aria-label="Message the agent, or type a command" @input="onInput" @keydown="onKey">
        <button type=button class=quick-key @click="close">esc</button>
      </div>
      <div class=quick-rows>
        <button v-for="(r, i) in rows" :key="r.label" type=button :class="['quick-row', {on: i === at}]" @click="r.run" @mouseenter="QUICK.i = i">
          <span class=quick-label>{{ r.label }}</span><span class=quick-hint>{{ r.hint }}</span>
        </button>
      </div>
      <div class=quick-foot><span>↑↓ move</span><span>↵ run</span>
        <span class=quick-foot-note>{{ QUICK.q.trim() ? '↵ sends it to the agent' : 'Just start typing to message the agent' }}</span></div>
    </div>`,
};

const App = {
  components: { ...VIEWS, Icon, ActivityPanel, Peek, QuickMenu },
  setup() {
    const route = reactive(parseHash());
    const ov = OVERVIEW;
    let version = "";
    const loadOverview = () => fetch("/api/overview").then((r) => r.json()).then((d) => {
      // a newer journal is being served: reload the whole page so the new viewer renders
      if (version && d.version && d.version !== version) { location.reload(); return; }
      version = version || d.version || "";
      ov.data = d;
    }).catch(() => {});
    const overviewTimer = setInterval(() => { if (document.visibilityState === "visible") loadOverview(); }, POLL_MS);
    const closeOverlay = () => { OVERLAY.kind = ""; OVERLAY.n = 0; };
    const onHash = () => { Object.assign(route, parseHash()); closeOverlay(); loadOverview(); };
    window.addEventListener("hashchange", onHash);
    window.addEventListener("journal:changed", loadOverview);
    // space opens the quick menu, unless it is typing into something or pressing a focused control
    const openQuick = () => Object.assign(QUICK, { open: true, q: "", i: 0 });
    const onSpace = (e) => {
      if (e.key !== " " || QUICK.open || e.defaultPrevented) return;
      const el = document.activeElement;
      if (el && el !== document.body && (el.isContentEditable || el.matches("input,textarea,select,button,a[href],[role=button],[tabindex]"))) return;
      e.preventDefault();
      openQuick();
    };
    window.addEventListener("keydown", onSpace);
    onUnmounted(() => {
      window.removeEventListener("hashchange", onHash);
      window.removeEventListener("journal:changed", loadOverview);
      window.removeEventListener("keydown", onSpace);
      clearInterval(overviewTimer);
    });
    loadOverview();
    const envName = computed(() => {
      if (route.params.env) return route.params.env;
      const envs = ov.data ? ov.data.environments : [];
      // the viewer opens where an agent is working; the CLI's start environment only when nobody is
      return (envs.find((e) => e.active) || envs.find((e) => e.current) || envs[0] || {}).name || "";
    });
    const envRow = computed(() => (ov.data ? ov.data.environments.find((e) => e.name === envName.value) : null));
    const activity = useFetch(() => envName.value && `/api/env/${envName.value}/activity`);
    // a message just sent, or anything else just written, shows in Activity now rather than at the next poll
    const reloadActivity = () => activity.reload();
    window.addEventListener("journal:changed", reloadActivity);
    onUnmounted(() => window.removeEventListener("journal:changed", reloadActivity));
    watchEffect(() => {
      if (route.view === "Home" && envName.value) location.replace(`#/env/${envName.value}`);
    });
    const key = computed(() => `${route.view}:${route.params.env || ""}`);
    const FOLDED = "journal.sidebar.folded";
    const folded = reactive((() => { try { return JSON.parse(localStorage.getItem(FOLDED) || "{}"); } catch (e) { return {}; } })());
    const fold = (name) => {
      folded[name] = !folded[name];
      try { localStorage.setItem(FOLDED, JSON.stringify(folded)); } catch (e) { /* storage off */ }
    };
    // an activity row opens what it is about, when it is about something with a page
    const ACTIVITY_PAGES = { todo: "todos", question: "questions", message: "messages", work: "work", report: "reports", plan: "plans",
                             suggestion: "suggestions", pin: "pins", reminder: "reminders" };
    const activityHref = (e) => {
      if (e.kind === "doc") return e.n ? `#/docs/${e.n}` : "#/docs";
      if (e.kind === "rule") return e.n ? `#/rules/${e.n}` : "#/rules";
      // a comment has no page of its own: its line opens what it is about
      if (e.kind === "comment") return e.about && envName.value ? refHref(e.about, envName.value) : null;
      if (e.kind === "commit") return e.sha && envName.value ? `#/env/${envName.value}/commits/${e.sha}` : null;
      const page = ACTIVITY_PAGES[e.kind];
      if (!page || !envName.value) return null;
      return `#/env/${envName.value}/${page}` + (e.n ? `/${e.n}` : "");
    };
    const setAuto = (on) => {
      activity.data.auto = on;
      postJSON(`/api/env/${envName.value}/environment/settings`, { auto: on })
        .then(() => { activity.reload(); changed(); }, () => activity.reload());
    };
    // other projects' journals running on this machine, each at its own port
    const journals = reactive({ list: [], open: false });
    // with several journals open, each viewer wears its project's colour in a strip along the top, so tabs are told apart
    // ten colours, each with the label colour that reads best on it; running journals never share one
    const STRIP_POOL = [["#e5484d", "#0d0e10"], ["#f76b15", "#0d0e10"], ["#ffc53d", "#0d0e10"], ["#30a46c", "#0d0e10"], ["#12a594", "#0d0e10"], ["#0090ff", "#0d0e10"], ["#3e63dd", "#ffffff"], ["#8e4ec6", "#ffffff"], ["#d6409f", "#0d0e10"], ["#a18072", "#0d0e10"]];
    const slotOf = (name) => { let h = 0; for (const ch of String(name || "")) h = (h * 31 + ch.codePointAt(0)) % STRIP_POOL.length; return h; };
    const stripSlots = computed(() => {
      const taken = new Set();
      const slots = {};
      // every viewer sees the same list, so every viewer hands out the same colours
      [...new Set(journals.list.map((j) => j.project))].sort().forEach((name) => {
        let slot = slotOf(name);
        for (let i = 0; i < STRIP_POOL.length && taken.has(slot); i++) slot = (slot + 1) % STRIP_POOL.length;
        taken.add(slot);
        slots[name] = slot;
      });
      return slots;
    });
    const paletteOf = (name) => STRIP_POOL[stripSlots.value[name] ?? slotOf(name)];
    const colorOf = (name) => paletteOf(name)[0];
    const identity = useFetch(() => "/api/identity", { poll: false });
    // the strip's tab opens a switcher to the other journals running on this machine
    const stripMenu = reactive({ open: false });
    const outsideStrip = (e) => { if (!e.target.closest(".project-strip-name, .strip-drop")) stripMenu.open = false; };
    const escStrip = (e) => { if (e.key === "Escape") stripMenu.open = false; };
    watchEffect((onCleanup) => {
      if (!stripMenu.open) return;
      document.addEventListener("mousedown", outsideStrip);
      document.addEventListener("keydown", escStrip);
      onCleanup(() => { document.removeEventListener("mousedown", outsideStrip); document.removeEventListener("keydown", escStrip); });
    });
    const strip = computed(() => {
      if (journals.list.length < 2) return null;
      const here = journals.list.find((j) => j.current) || {};
      const name = here.project || (ov.data && ov.data.project) || "";
      return name ? { name, color: colorOf(name), label: paletteOf(name)[1] } : null;
    });
    // the pickers list this journal first; colours still come from the whole list, so none changes
    const journalsOrdered = computed(() => [...journals.list.filter((j) => j.current), ...journals.list.filter((j) => !j.current)]);
    const loadJournals = () => fetch("/api/viewers").then((r) => r.json())
      .then((d) => { journals.list = Array.isArray(d) ? d : []; }).catch(() => {});
    const journalsTimer = setInterval(() => { if (document.visibilityState === "visible") loadJournals(); }, 20000);
    const outsideJournals = (e) => { if (!e.target.closest(".journal-switch")) journals.open = false; };
    document.addEventListener("mousedown", outsideJournals);
    onUnmounted(() => { clearInterval(journalsTimer); document.removeEventListener("mousedown", outsideJournals); });
    loadJournals();
    // what the agent did while this tab was hidden, said once when the user comes back to it
    const away = reactive({ since: "", text: "" });
    const AWAY_WORDS = [["Closed to-do", "to-do closed", "to-dos closed"], ["Added to-do", "to-do added", "to-dos added"],
                        ["Ended work", "piece of work finished", "pieces of work finished"], ["Filed message", "message filed", "messages filed"],
                        ["Asked question", "question for you", "questions for you"], ["Suggested a change", "suggestion", "suggestions"],
                        ["Handled comment", "comment handled", "comments handled"],
                        ["Answered your question", "question of yours answered", "questions of yours answered"]];
    let awayTimer = null;
    const onVisibility = () => {
      if (document.hidden) { away.since = away.since || new Date().toISOString(); return; }
      const since = Date.parse(away.since);
      away.since = "";
      if (!since || Date.now() - since < 60000) return;
      activity.reload();
      setTimeout(() => {
        const events = (activity.data && activity.data.events) || [];
        const said = AWAY_WORDS.map(([text, one, many]) => {
          const n = events.filter((e) => e.text === text && e.by !== "You" && Date.parse(e.at) >= since).length;
          return n ? `${n} ${n === 1 ? one : many}` : "";
        }).filter(Boolean);
        if (!said.length) return;
        away.text = said.join(" · ");
        clearTimeout(awayTimer);
        awayTimer = setTimeout(() => { away.text = ""; }, 15000);
      }, 1500);
    };
    document.addEventListener("visibilitychange", onVisibility);
    onUnmounted(() => { document.removeEventListener("visibilitychange", onVisibility); clearTimeout(awayTimer); });
    watchEffect(() => { SHELL.env = envName.value; SHELL.activity = activity.data; });
    // a nav count may add several of the environment's counts, as the Inbox does for questions and suggestions
    const navCount = (item) => (envRow.value ? [].concat(item.count).reduce((sum, k) => sum + (envRow.value[k] || 0), 0) : 0);
    SHELL.setAuto = setAuto;
    return { QUICK, TOAST, openQuick, OVERLAY, closeOverlay, route, ov, envName, envRow, NAV, navCount, key, activity, folded, fold, activityHref, ACTIVITY, setAuto, journals, away, identity, strip, colorOf, stripMenu, loadJournals, journalsOrdered };
  },
  template: `
    <div :class="['app', {striped: strip}]" :style="strip ? {'--strip': strip.color, '--strip-label': strip.label} : null">
      <div v-if="strip" class=project-strip role=presentation>
        <button type=button class=project-strip-name :aria-expanded="stripMenu.open" title="Journals running on this machine"
          @click="stripMenu.open = !stripMenu.open; loadJournals()">{{ strip.name }}</button>
      </div>
      <div v-if="strip && stripMenu.open" class="drop strip-drop">
        <div class=drop-head><span>Journals running on this machine</span></div>
        <template v-for="j in journalsOrdered" :key="j.port">
          <div v-if="j.current" class="drop-row current">
            <span class=drop-kind>This journal · port {{ j.port }}{{ j.version ? ' · ' + j.version : '' }}</span>
            <span class=drop-text><span class=journal-dot :style="{background: colorOf(j.project)}"></span>{{ j.project }}</span>
          </div>
          <a v-else class=drop-row :href="j.url" @click="stripMenu.open = false">
            <span class=drop-kind>Port {{ j.port }}{{ j.version ? ' · ' + j.version : '' }}</span>
            <span class=drop-text><span class=journal-dot :style="{background: colorOf(j.project)}"></span>{{ j.project }}</span>
          </a>
        </template>
      </div>
      <aside class=side>
        <div v-if="journals.list.length > 1" class="drop-wrap journal-switch">
          <button type=button class=project :aria-expanded="journals.open" :title="'Journals running on this machine'"
            @click="journals.open = !journals.open">
            <span class=logo>{{ (envName || 'j').charAt(0).toUpperCase() }}</span>{{ envName || 'journal' }}
            <span :class="['fold', {shut: !journals.open}]"></span>
          </button>
          <div v-if="journals.open" class=drop>
            <div class=drop-head><span>Journals running on this machine</span></div>
            <template v-for="j in journalsOrdered" :key="j.port">
              <div v-if="j.current" class="drop-row current">
                <span class=drop-kind>This journal · port {{ j.port }}{{ j.version ? ' · ' + j.version : '' }}</span>
                <span class=drop-text><span class=journal-dot :style="{background: colorOf(j.project)}"></span>{{ j.project }}</span>
              </div>
              <a v-else class=drop-row :href="j.url" @click="journals.open = false">
                <span class=drop-kind>Port {{ j.port }}{{ j.version ? ' · ' + j.version : '' }}</span>
                <span class=drop-text><span class=journal-dot :style="{background: colorOf(j.project)}"></span>{{ j.project }}</span>
              </a>
            </template>
          </div>
        </div>
        <a v-else class=project :href="envName ? '#/env/' + envName : '#/'" :title="ov.data ? ov.data.project : ''">
          <span class=logo>{{ (envName || 'j').charAt(0).toUpperCase() }}</span>{{ envName || 'journal' }}
        </a>
        <div class=group v-if="envName">
          <button type=button class="group-label fold-head" @click="fold('environment')" :aria-expanded="!folded.environment">
            Environment<span :class="['fold', {shut: folded.environment}]"></span></button>
          <a v-if="!folded.environment" v-for="item in NAV" :key="item.key" :class="['item', {on: item.views.includes(route.view)}]"
            :href="'#/env/' + envName + (item.path ? '/' + item.path : '')">
            <Icon :name="item.key"/>{{ item.label }}
            <span v-if="item.count" :class="['count', {hot: (item.key === 'inbox' || item.key === 'home') && navCount(item)}]">{{ navCount(item) || '' }}</span>
          </a>
        </div>
        <div class=group>
          <button type=button class="group-label fold-head" @click="fold('project')" :aria-expanded="!folded.project">
            Project<span :class="['fold', {shut: folded.project}]"></span></button>
          <template v-if="!folded.project">
            <a :class="['item', {on: route.view === 'Rules'}]" href="#/rules"><Icon name="rules"/>Rules<span class=count>{{ ov.data ? ov.data.rules : '' }}</span></a>
            <a :class="['item', {on: route.view === 'Tools'}]" href="#/tools"><Icon name="tools"/>Tools</a>
            <a :class="['item', {on: route.view === 'Docs' || route.view === 'DocDetail'}]" href="#/docs"><Icon name="folder"/>Documents<span class=count>{{ ov.data ? ov.data.docs : '' }}</span></a>
          </template>
        </div>
        <div class=group v-if="ov.data">
          <button type=button class="group-label fold-head" @click="fold('environments')" :aria-expanded="!folded.environments">
            Environments<span :class="['fold', {shut: folded.environments}]"></span></button>
          <a v-if="!folded.environments" v-for="e in ov.data.environments" :key="e.name" :class="['item', {on: route.params.env === e.name}]"
            :href="'#/env/' + e.name" :title="e.active ? 'an agent is working here' : ''">
            <span :class="['env-dot', {live: e.active}]"></span>{{ e.name }}
          </a>
        </div>
        <div class="side-foot side-foot-row">
          <a v-if="identity.data && identity.data.version" class=side-foot-version href="#/about" title="Version and changelog">Agent journal {{ identity.data.version }}<span v-if="activity.data && activity.data.branch" class=side-foot-branch-name
            :title="activity.data.branch.detached ? 'Not on a branch: HEAD is at commit ' + activity.data.branch.name : 'The git branch checked out in this project'"> · {{ activity.data.branch.detached ? 'detached at ' + activity.data.branch.name : activity.data.branch.name }}</span></a>
          <button type=button class=space-hint title="Quick menu: type to message the agent" @click="openQuick">space</button>
        </div>
      </aside>
      <main class=main>
        <component :is="route.view" v-bind="route.params" :key="key"/>
      </main>
      <Peek v-if="OVERLAY.kind && envName" :key="'overlay' + OVERLAY.kind + OVERLAY.n" :env="envName" :kind="OVERLAY.kind" :n="OVERLAY.n"
        :close="closeOverlay" :reloaded="reloadActivity"/>
      <QuickMenu v-if="QUICK.open && envName" :env="envName"/>
      <div v-if="TOAST.text" class=quick-toast role=status>{{ TOAST.text }}</div>
      <aside v-if="activity.data && ACTIVITY.shown" class=activity-dock>
        <ActivityPanel :data="activity.data" :href="activityHref" :env="envName"/>
      </aside>
      <div v-if="away.text" class=away-toast role=status>
        <span>While you were away: {{ away.text }}</span>
        <button type=button class=away-close aria-label="Dismiss" title="Dismiss" @click="away.text = ''">×</button>
      </div>
    </div>`,
};

const app = createApp(App);
app.config.globalProperties.$md = renderMarkdown;
app.config.globalProperties.$human = humanSize;
app.config.globalProperties.$refHref = refHref;
app.config.globalProperties.$linkify = linkify;
app.mount("#app");
