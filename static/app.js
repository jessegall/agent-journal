// The journal's browser renderer. Vue does the layout; the server only ever answers with
// JSON (see serve.py) — this file is the second renderer of that response, fmt.py the first.
"use strict";
const { createApp, reactive, computed, watch, watchEffect, onUnmounted, onMounted, ref, nextTick, provide, inject } = Vue;

// ─────────────────────────────────────────────────────────────── a hash router
// A detail route renders the same view as its list, with the item open in the side panel.
const ROUTES = [
  { re: /^\/$/, view: "Home" },
  { re: /^\/env\/([a-z0-9-]+)$/, view: "EnvHome", params: ["env"] },
  { re: /^\/env\/([a-z0-9-]+)\/todos(\/archive)?(?:\/(\d+|new))?$/, view: "Todos", params: ["env", "archive", "n"] },
  { re: /^\/env\/([a-z0-9-]+)\/pins(\/archive)?(?:\/(\d+|new))?$/, view: "Pins", params: ["env", "archive", "n"] },
  { re: /^\/env\/([a-z0-9-]+)\/(?:messages|inbox)(\/archive)?(?:\/((?:[qsr]\/)?\d+))?$/, view: "Inbox", params: ["env", "archive", "n"] },
  { re: /^\/env\/([a-z0-9-]+)\/questions(\/archive)?(?:\/(\d+))?$/, view: "Questions", params: ["env", "archive", "n"] },
  { re: /^\/env\/([a-z0-9-]+)\/reports\/(\d+)\/page$/, view: "ReportDetail", params: ["env", "n"] },
  { re: /^\/env\/([a-z0-9-]+)\/reports(\/archive)?(?:\/(\d+|new))?$/, view: "Reports", params: ["env", "archive", "n"] },
  { re: /^\/env\/([a-z0-9-]+)\/plans(\/archive)?(?:\/(\d+|new))?$/, view: "Plans", params: ["env", "archive", "n"] },
  { re: /^\/env\/([a-z0-9-]+)\/suggestions(\/archive)?(?:\/(\d+|ask))?$/, view: "Suggestions", params: ["env", "archive", "n"] },
  { re: /^\/env\/([a-z0-9-]+)\/style(?:\/([a-z0-9-]+))?$/, view: "Style", params: ["env", "n"] },
  { re: /^\/env\/([a-z0-9-]+)\/work(\/archive)?(?:\/(\d+|new))?$/, view: "Work", params: ["env", "archive", "n"] },
  { re: /^\/env\/([a-z0-9-]+)\/reminders(\/archive)?(?:\/(\d+|new))?$/, view: "Reminders", params: ["env", "archive", "n"] },
  { re: /^\/env\/([a-z0-9-]+)\/docs(?:\/(new|\d+))?$/, view: "EnvDocs", params: ["env", "n"] },
  { re: /^\/env\/([a-z0-9-]+)\/connections(?:\/(\d+))?$/, view: "Connections", params: ["env", "n"] },
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
      // a write says so here, where every write passes, so Activity shows what you did without waiting for the poll
      if (method !== "GET") changed();
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
  // A PART CAN BECOME A PLAIN REF -- "work", "noted", "answered" -- which names no row and has no
  // number. Those are not pages: without this, `work` alone built /work/undefined and the view
  // parsed it into NaN. Reminders and coding style are the two kinds that legitimately have none.
  if (!num && kind !== "reminder" && kind !== "style") return null;
  if (kind === "todo") return `#/env/${env}/todos/${num}`;
  if (kind === "pin") return `#/env/${env}/pins/${num}`;
  if (kind === "rule") return `#/rules/${num}`;
  if (kind === "doc") return `#/docs/${num}`;
  if (kind === "question") return `#/env/${env}/questions/${num}`;
  if (kind === "report") return `#/env/${env}/reports/${num}`;
  if (kind === "plan") return `#/env/${env}/plans/${num}`;
  if (kind === "suggestion") return `#/env/${env}/suggestions/${num}`;
  // NAMED, WHEN THE REF NAMES ONE. `reminder:6` went to the index like a bare `reminder`, so the
  // one pill that knew exactly which row it meant threw that away and travelled to a list.
  if (kind === "reminder") return num ? `#/env/${env}/reminders/${num}` : `#/env/${env}/reminders`;
  if (kind === "inbox") return `#/env/${env}/messages/${num}`;
  if (kind === "work") return `#/env/${env}/work/${num}`;
  // a transcript is a FILE, not a page: nothing lists it, and this is the only way to it
  if (kind === "transcript") return `/transcripts/${env}/${num}`;
  if (kind === "style") return num ? `#/env/${env}/style/${num}` : `#/env/${env}/style`;
  return null;
}

//: the route segment each peekable resource lives under, so a reference can be read back into a panel
const REF_ROUTES = { todos: "todo", messages: "message", questions: "question", suggestions: "suggestion",
                     work: "work", plans: "plan", reports: "report", docs: "doc",
                     // what a message BECAME is most often one of these three, and each of them used
                     // to travel to its index instead of opening over what you were reading
                     pins: "pin", rules: "rule", reminders: "reminder" };

// A reference inside a panel opens that resource OVER the page, never navigating away from what you are reading.
// One funnel for every chip: it reads the href the chip already carries, so nothing needs a second source of truth.
// A reference whose kind has no panel — a skill, a session, a commit — is left alone and still navigates.
function openRef(event, href) {
  if (!href || event.metaKey || event.ctrlKey || event.shiftKey || event.button) return;
  const parts = String(href).replace(/^#\//, "").split("/");
  // #/docs/3 reads as ["docs", "3"]; #/env/<env>/todos/5 carries the environment first
  const tail = parts[0] === "env" ? parts.slice(2) : parts;
  const subagent = tail[0] === "agents" && tail[1] === "subagent";
  const kind = subagent ? "subagent" : REF_ROUTES[tail[0]];
  const n = subagent ? tail[2] : tail[1];
  if (!kind || !n || !PEEK[kind]) return;
  event.preventDefault();
  OVERLAY.kind = kind;
  OVERLAY.n = subagent ? n : Number(n);
}

// a pin's or rule's meta is the CLI's own " · " line; its age and doc citation are read back out of it
// the short age a fixed 52px column holds: "27m ago" is 27m, "3h ago" 3h, "16d ago" 2w
function shortAge(age) {
  const text = String(age || "");
  if (text === "just now") return "now";
  const m = /^(\d+) minutes? ago$/.exec(text) || /^(\d+)m ago$/.exec(text);
  if (m) return `${m[1]}m`;
  const h = /^(\d+)h ago$/.exec(text);
  if (h) return `${h[1]}h`;
  const d = /^(\d+)d ago$/.exec(text);
  if (d) return Number(d[1]) < 14 ? `${d[1]}d` : `${Math.floor(Number(d[1]) / 7)}w`;
  return text;
}
// SOME NOTIFICATIONS ARE NOT NEWS, THEY ARE A DEMAND. A question is waiting on an answer, a plan on
// a decision, a report on being read — and in a list of fifty they looked exactly like the rest. The
// kinds that need the user get their kind's colour on the left edge; everything else stays plain,
// or the colour says nothing.
const NOTE_TINT = { question: "#c9955e", plan: "#5b8def", report: "#d9a441" };
function noteTint(note) {
  return NOTE_TINT[String((note && note.about) || "").split(":")[0]] || "";
}
// a notification about a message is the agent replying to it, so it opens that reply; anything else opens its own page
function noteHref(note, env) {
  const [kind, n] = String((note && note.about) || "").split(":");
  return kind === "inbox" && n && env ? `#/env/${env}/messages/r/${n}` : refHref(note && note.about, env);
}
function ageOf(meta) { return (meta || "").split(" · ").find((s) => / ago$|^just now$/.test(s)) || ""; }
function docOf(meta) { const m = /→ doc ([\d.]+)/.exec(meta || ""); return m ? m[1] : null; }

// a file the viewer sends: its name and the data URL the server stores it from
function readFileAsData(file) {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve({ name: file.name, data: String(r.result) });
    r.onerror = () => reject(new Error(`Could not read ${file.name}`));
    r.readAsDataURL(file);
  });
}

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

//: the kinds a row can be named by in ordinary prose, and the ref `refHref` wants for each.
//: `to-do 183` is what the journal itself prints, so it is what a reader types.
const NAMED_ROW = { "to-do": "todo", "todo": "todo", "pin": "pin", "rule": "rule", "doc": "doc",
                    "report": "report", "reminder": "reminder", "message": "inbox",
                    "question": "question", "plan": "plan", "suggestion": "suggestion" };
const ROW_IN_TEXT = new RegExp(`\\b(${Object.keys(NAMED_ROW).join("|")})\\s+(\\d+(?:\\.\\d+)?)\\b`, "gi");

// A ROW NAMED IN A SENTENCE IS A REFERENCE. "to-dos 183, 184 and 185" is how the journal writes
// them and so how a reader writes them back, and each one is a thing with a page — so it opens,
// over what you are reading, the same way a became-pill does. Applied AFTER code spans and links
// so a number already inside one is left as it was.
function _rowPills(escaped) {
  const env = parseHash().params.env || "";
  return escaped.replace(ROW_IN_TEXT, (whole, word, num) => {
    const href = refHref(`${NAMED_ROW[word.toLowerCase()]}:${num}`, env);
    return href ? `<a class="row-pill" href="${href}" onclick="return window.__openRef(event, '${href}')">${whole}</a>` : whole;
  });
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
  text = text.split(/(<a [^>]*>.*?<\/a>|<code>.*?<\/code>)/).map((part, i) => (i % 2 ? part : _rowPills(part))).join("");
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
const HELP_TOPICS = { Todos: "todos", Messages: "messages", Questions: "questions", Suggestions: "suggestions", Reports: "reports", Plans: "plans",
  Pins: "pins", Reminders: "reminders", Work: "work", EnvDocs: "docs", Docs: "docs", DocDetail: "docs", Rules: "rules", Tools: "tools", Connections: "connections",
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
      <template v-else-if="name === 'plus'"><path d="M8 3.5v9M3.5 8h9"/></template>
      <template v-else-if="name === 'plug'"><path d="M5.2 2.2v3.2M8.8 2.2v3.2M3.4 5.4h7.2v2.1a3.6 3.6 0 0 1-3.6 3.6 3.6 3.6 0 0 1-3.6-3.6Z"/><path d="M7 11.3v2.5"/></template>
      <template v-else-if="name === 'tools'"><path d="M9.8 2.3a3 3 0 0 0-3.6 3.9L2.5 9.9a1.2 1.2 0 0 0 1.7 1.7l3.7-3.7a3 3 0 0 0 3.9-3.6L10 6 8.6 5.4 8 4l1.8-1.7Z"/></template>
      <path v-else-if="name === 'plan'" d="M4 14V2.5M4 3h7.5l-1.5 2.75 1.5 2.75H4"/>
      <template v-else-if="name === 'search'"><circle cx="7" cy="7" r="4.25"/><path d="M10.25 10.25L13.5 13.5"/></template>
      <template v-else-if="name === 'settings'"><circle cx="8" cy="8" r="2"/><path d="M8 1.75v1.5M8 12.75v1.5M1.75 8h1.5M12.75 8h1.5M3.6 3.6l1.05 1.05M11.35 11.35l1.05 1.05M3.6 12.4l1.05-1.05M11.35 4.65l1.05-1.05"/></template>
    </svg>`,
};

// A STATUS IS A PILL: an outline when open, filling as it moves, struck through when blocked.
const STATUS_COLOR = {
  progress: "#5b8def", blocked: "#d9a441", done: "#3ecf74", waiting: "#a78bfa", open: "#8b8e96", withdrawn: "#55575d",
};
const StatusIcon = {
  props: ["kind", "tint"],
  setup(props) {
    const color = computed(() => props.tint || STATUS_COLOR[props.kind] || STATUS_COLOR.open);
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
// wide says whether the content column has room for two of anything: Home's queue reads it, and so does the status bar
const SHELL = reactive({ env: "", activity: null, setAuto: null, wide: true });
const WIDE_AT = 782;
// how long each resource keeps a closed item listed, from the environment's settings
const RETENTION = reactive({ table: null });
// one overlay the shell hosts for any page: what the status bar inspects opens here, over whatever is showing
const OVERLAY = reactive({ kind: "", n: 0, quote: "", file: null, images: [], at: 0 });

// AN IMAGE IS LOOKED AT, NOT DOWNLOADED. A picture in the thread was an <a target=_blank>, so
// clicking it threw the raw file into a browser tab and took the reader out of the conversation to
// do it. It opens over the page instead, and it opens with the OTHER pictures of that message
// beside it, because a message with five screenshots is one thing to look through rather than five
// things to open — which is what the arrow keys are for.
function openImages(event, files, i, at) {
  if (event && (event.metaKey || event.ctrlKey || event.shiftKey || event.button)) return;
  if (event) event.preventDefault();
  OVERLAY.kind = "image";
  OVERLAY.images = files;
  OVERLAY.at = i;
}

// A FILE IS READ WHERE YOU FOUND IT. A doc's attachment used to be an <a target=_blank>: clicking a
// 50KB markdown file threw the raw text into a browser tab. This opens it over the page instead —
// markdown rendered, images shown, anything else as plain text — and the raw file is still one click
// away for the cases a browser does better.
function openFile(event, file) {
  if (event && (event.metaKey || event.ctrlKey || event.shiftKey || event.button)) return;
  if (event) event.preventDefault();
  OVERLAY.kind = "file";
  OVERLAY.file = file;
}

// what the agent said, quoted, so a comment back to it starts from its own words
// comments render through linkify rather than markdown, so the "> " reads as itself and is never swallowed
function quoted(said) {
  const text = String(said || "").trim();
  return text ? `${text.split("\n").map((line) => `> ${line}`).join("\n")}\n\n` : "";
}

//: environment -> the work and plan the bar last knew, so it says the same thing on the next page
// it mounts afresh on every page, and without these it would have nothing to say until its fetches land
const AGENT_STATE = reactive({});

const StatusBar = {
  components: { Icon },
  setup() {
    const env = computed(() => SHELL.env);
    const work = useFetch(() => env.value && `/api/env/${env.value}/work`);
    const plans = useFetch(() => env.value && `/api/env/${env.value}/plans`);
    watchEffect(() => {
      if (!env.value) return;
      const kept = AGENT_STATE[env.value] || (AGENT_STATE[env.value] = { work: null, plan: null });
      if (work.data) kept.work = work.data[0] || null;
      if (plans.data) kept.plan = plans.data.find((p) => p.status === "active") || null;
    });
    const view = computed(() => {
      const agent = SHELL.activity && SHELL.activity.agent;
      const kept = AGENT_STATE[env.value] || { work: null, plan: null };
      const plan = plans.data ? (plans.data.find((p) => p.status === "active") || null) : kept.plan;
      const w = work.data ? (work.data[0] || null) : kept.work;
      const base = `#/env/${env.value}`;
      const planHref = plan ? `${base}/plans/${plan.n}` : null;
      const workHref = w ? `${base}/work/${w.n}` : planHref;
      if (plan && plan.held) return { state: "Stopped", held: true, what: `plan ${plan.n} · phase ${plan.held} is a checkpoint — waiting for you to continue`, href: planHref };
      if (!agent) return { state: "Stopped", what: "no agent is on this environment", href: planHref };
      const onIt = w ? (w.todo ? `to-do ${w.todo} · ${w.subject}` : w.subject)
        : plan ? `plan ${plan.n} · phase ${plan.current}: ${plan.current_title}` : "";
      if (agent.compacting) return { state: "Working", live: true, what: "compacting its context", href: workHref };
      if (agent.working) return { state: "Working", live: true, what: onIt || "on its own", href: workHref };
      return { state: "Idle", what: onIt ? `last on ${onIt}` : "waiting for you", href: workHref };
    });
    const inspectWork = computed(() => (work.data ? work.data[0] : (AGENT_STATE[env.value] || {}).work) || null);
    // WHAT IS BEING WORKED, AND WHERE: the branch this project is on, and the to-do the open work
    // serves. Both are already in hand — the branch rides in the activity payload, the number is on
    // the work row — and the bar is the one thing visible on every page.
    const facts = computed(() => {
      const b = SHELL.activity && SHELL.activity.branch;
      const w = inspectWork.value;
      return {
        branch: b ? (b.detached ? `detached at ${b.name}` : b.name) : "",
        hint: b && b.detached ? `Not on a branch: HEAD is at commit ${b.name}` : "The git branch checked out in this project",
        todo: w && w.todo ? w.todo : 0,
      };
    });
    // the sentence is the control: it opens the to-do it names, the work when the work serves none,
    // or the plan when nothing is open — the chip that used to carry the link is gone from the bar
    const openCurrent = () => {
      const w = inspectWork.value;
      if (w && w.todo) { OVERLAY.kind = "todo"; OVERLAY.n = w.todo; }
      else if (w) { OVERLAY.kind = "work"; OVERLAY.n = w.n; }
      else if (view.value.href) location.hash = view.value.href;
    };
    return { env, view, SHELL, openCurrent, facts };
  },
  template: `
    <div v-if="env && SHELL.activity" :class="['statusbar', {held: view.held}]">
      <span :class="['statusbar-dot', {live: view.live, held: view.held}]"></span>
      <button type=button class=statusbar-text :title="facts.todo ? 'Open the to-do it is on' : 'Open what it is on'" @click="openCurrent"><b>{{ view.state }}</b><span>{{ view.what }}</span></button>
      <span class=statusbar-tools>
        <span v-if="facts.branch && SHELL.wide" class=statusbar-facts :title="facts.hint"><Icon name="style"/><span>{{ facts.branch }}</span></span>
        <button type=button class=statusbar-auto role=switch :aria-checked="SHELL.activity.auto ? 'true' : 'false'"
          :title="SHELL.activity.auto ? 'The agent works through the to-do list without asking' : 'The agent asks before picking up the next to-do'"
          @click="SHELL.setAuto && SHELL.setAuto(!SHELL.activity.auto)">Auto<span :class="['switch', {on: SHELL.activity.auto}]"><span class=knob></span></span></button>
      </span>
    </div>`,
};

const TopBar = {
  props: { crumbs: { type: Array, default: () => [] } },
  components: { Icon, StatusBar },
  setup(props) {
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
    // A NOTIFICATION OPENS THE THING, IT DOES NOT TRAVEL TO IT. On the home the page's own panel takes
    // it, because that panel carries the trail through the other waiting rows; anywhere else `openRef`
    // swaps the overlay in place, which is the same funnel every ref in the viewer already uses. Only
    // something neither can render — a kind with no panel — is left to the link.
    const openFromBell = (event, x) => {
      const kind = String(x.about || "").split(":")[0];
      if (onHome() && ["inbox", "todo", "question", "suggestion", "work"].includes(kind)) {
        event.preventDefault();
        window.dispatchEvent(new CustomEvent("journal:peek", { detail: { about: x.about } }));
        return;
      }
      openRef(event, noteHref(x, env.value));
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
    // a crumb before the last opens its page: the environment's home, or the area it names
    const CRUMB_PATHS = { Home: "", Messages: "messages", "To-dos": "todos", Documents: "docs", Docs: "docs", Reports: "reports", Plans: "plans", Settings: "settings" };
    const crumbHref = (i) => {
      const c = props.crumbs[i];
      if (!env.value) return null;
      if (i === 0 && c === env.value) return `#/env/${env.value}`;
      return c in CRUMB_PATHS ? `#/env/${env.value}${CRUMB_PATHS[c] ? `/${CRUMB_PATHS[c]}` : ""}` : null;
    };
    return { env, waiting, openCount, drop, notes, unreadNotes, readNotes, suggestions, asks, openQuestions, readOne, readAll, openFromBell, activity, toggleActivity, view,
             helpTopic, help, helpDialog, openHelp, closeHelp, crumbHref, noteHref };
  },
  template: `
    <div class=top>
      <div class=crumb>
        <template v-for="(c, i) in crumbs" :key="i">
          <span v-if="i" class=sep>/</span><b v-if="i === crumbs.length - 1">{{ c }}</b><a v-else-if="crumbHref(i)" class=crumb-link :href="crumbHref(i)">{{ c }}</a><span v-else>{{ c }}</span>
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
              <div v-for="x in unreadNotes" :key="'n' + x.n" :class="['drop-row', {open: !!noteHref(x, env)}]"
                :role="noteHref(x, env) ? 'button' : null" :tabindex="noteHref(x, env) ? 0 : null"
                :title="noteHref(x, env) ? 'Open ' + x.about_label : null"
                @click="noteHref(x, env) && (readOne(x), openFromBell($event, x), drop.open = false)"
                @keydown.enter.self.prevent="noteHref(x, env) && (readOne(x), openFromBell($event, x), drop.open = false)">
                <span class=drop-text>{{ x.text }}</span>
                <span class=drop-meta>{{ x.age || 'just now' }}
                  <button type=button class="btn more" @click.stop="readOne(x)">Mark read</button>
                </span>
              </div>
              <div v-if="readNotes.length" class=drop-sub>Read</div>
              <div v-for="x in readNotes" :key="'r' + x.n" :class="['drop-row', 'read', {open: !!noteHref(x, env)}]"
                :role="noteHref(x, env) ? 'button' : null" :tabindex="noteHref(x, env) ? 0 : null"
                :title="noteHref(x, env) ? 'Open ' + x.about_label : null"
                @click="noteHref(x, env) && (openFromBell($event, x), drop.open = false)"
                @keydown.enter.self.prevent="noteHref(x, env) && (openFromBell($event, x), drop.open = false)">
                <span class=drop-text>{{ x.text }}</span>
                <span class=drop-meta>{{ x.age || 'just now' }}</span>
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
//: list name -> {group key: folded}, so a group the user folded or opened keeps that state here
const LIST_FOLDS_KEY = "journal.list.folded";
function listFolds() {
  try { return JSON.parse(localStorage.getItem(LIST_FOLDS_KEY) || "{}"); } catch (e) { return {}; }
}
function saveListFolds(folds) {
  try { localStorage.setItem(LIST_FOLDS_KEY, JSON.stringify(folds)); } catch (e) { /* storage off */ }
}

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
// 560px was fine for a to-do and hopeless for a 50KB markdown file, and the cap meant half a screen
// was not something you could drag to. The ceiling is the viewport now: read something long in it.
const INSPECTOR_WIDTH = { key: "journal.inspector.width", min: 420, fallback: 500,
                          get max() { return Math.max(560, Math.round(window.innerWidth * 0.62)); } };
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

// how many inspector panels are showing, and when the last one went: stepping with the arrow keys or advancing
// after an action unmounts one panel and mounts the next, and only the first open slides in
const PANELS = { open: 0, leftAt: 0 };
const STEP_MS = 250;

const Panel = {
  props: ["label", "close", "onClose", "link"],
  components: { Icon },
  setup(props) {
    // ONE inspector is open at a time. Every route's panel comes through here, so the rule lives here rather than
    // in twenty views: when the overlay opens a resource, the panel the page mounted steps aside until it closes.
    const isOverlay = inject("overlayPanel", false);
    const standDown = computed(() => !isOverlay && !!OVERLAY.kind);
    const body = ref(null);
    // a panel lies over the whole app: the scrim, Esc and the close button all leave it the same way
    // it slides out before it goes, so it leaves a beat after the click
    const closing = ref(false);
    const stepped = PANELS.open > 0 || Date.now() - PANELS.leftAt < STEP_MS;
    PANELS.open += 1;
    onUnmounted(() => { PANELS.open = Math.max(0, PANELS.open - 1); PANELS.leftAt = Date.now(); });
    const dismiss = () => {
      if (closing.value) return;
      closing.value = true;
      const leave = () => {
        if (props.onClose) props.onClose();
        else if (props.close) location.hash = props.close;
      };
      if (matchMedia("(prefers-reduced-motion: reduce)").matches) leave(); else setTimeout(leave, 160);
    };
    const hash = ref(location.hash);
    const onHash = () => { hash.value = location.hash; };
    const at = computed(() => trailIndex(hash.value));
    const place = computed(() => (at.value >= 0 && INSPECTOR_TRAIL.items.length ? `${at.value + 1} of ${INSPECTOR_TRAIL.items.length}` : ""));
    const KIND_OF = { "to-do": "todo", message: "message", reply: "message", question: "question", suggestion: "suggestion", work: "work", plan: "plan", report: "report", doc: "doc", subagent: "subagent" };
    // the page each kind belongs to, named the way the nav names it
    const PAGE_OF = { todo: "to-dos", message: "messages", question: "messages", suggestion: "messages", work: "work", plan: "plans", report: "reports", doc: "documents", subagent: "the agent page" };
    const kindOf = computed(() => KIND_OF[String(props.label || "").split(" ")[0].toLowerCase()] || "");
    const chipTint = computed(() => (kindOf.value && TYPES[kindOf.value] ? TYPES[kindOf.value].tint : null));
    const pageWords = computed(() => `Go to ${PAGE_OF[kindOf.value] || "the page"}`);
    const ROUTE_OF = { todo: "todos", message: "messages", question: "messages", suggestion: "messages", work: "work", plan: "plans", report: "reports", doc: "docs" };
    // a link to the page you are already on is not a way out, so it is not offered
    const onItsPage = computed(() => {
      const env = (hash.value.match(/^#\/env\/([a-z0-9-]+)/) || [])[1];
      const list = env && ROUTE_OF[kindOf.value] ? `#/env/${env}/${ROUTE_OF[kindOf.value]}` : "";
      return hash.value === props.link || (!!list && hash.value === list);
    });
    // the link leaves the inspector for the page behind it, so the panel goes with it
    const leaveForPage = (e) => { if (props.onClose) { e.preventDefault(); props.onClose(); location.hash = props.link; } };
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
    onMounted(() => {
      decorate();
      if (!body.value) return;   // it stood down for an overlay: there is nothing mounted to watch
      watcher = new MutationObserver(decorate);
      watcher.observe(body.value, { childList: true, subtree: true });
    });
    onUnmounted(() => { if (watcher) watcher.disconnect(); });
    return { stepped, standDown, body, onClick, onKey, dismiss, closing, drag, inspector, place, step, chipTint, pageWords, onItsPage, leaveForPage, INSPECTOR_TRAIL };
  },
  template: `
    <div v-if="!standDown" :class="['panel-scrim', {closing, stepped}]" @click="dismiss"></div>
    <aside v-if="!standDown" :class="['panel', {closing, stepped}]" :style="{ width: inspector.width + 'px' }">
      <div class=panel-grip title="Drag to resize" @pointerdown="drag"></div>
      <div class=panel-top>
        <span class=panel-ref><span class=panel-chip :style="chipTint ? { color: chipTint } : null">{{ label }}</span>
          <a v-if="link && !onItsPage" class=panel-open :href="link" :title="pageWords + ', leaving this panel'" @click="leaveForPage">{{ pageWords }}<Icon name="arrow"/></a></span>
        <span class=panel-tools>
          <span v-if="place" class=panel-place>{{ place }}</span>
          <button v-if="place" type=button class=icon-btn title="Previous (↑)" aria-label="Previous" :disabled="INSPECTOR_TRAIL.items.length < 2" @click="step(-1)"><Icon name="up"/></button>
          <button v-if="place" type=button class=icon-btn title="Next (↓)" aria-label="Next" :disabled="INSPECTOR_TRAIL.items.length < 2" @click="step(1)"><Icon name="down"/></button>
          <button type=button class=icon-btn title="Close" aria-label="Close" @click="dismiss"><Icon name="close"/></button>
        </span></div>
      <div class=panel-body ref=body @click="onClick" @keydown="onKey"><slot/></div>
    </aside>`,
};

const Compose = {
  props: ["placeholder", "submit", "hint", "send", "attach", "autofocus", "initial", "quote", "bare", "onUp"],
  components: { Icon },
  setup(props) {
    // `initial` seeds the box. `quote` does NOT: what is being commented ON is shown above the field and
    // cannot be edited — it is the thing quoted, not the reply — and it is put back in front of the text
    // when the comment is sent, so the agent still receives what it was about.
    const draft = reactive({ text: props.initial || "", sending: false, error: null, files: [] });
    const quoteLines = computed(() => String(props.quote || "").trim().split("\n").map((l) => l.replace(/^>\s?/, "")));
    const area = ref(null);
    onMounted(() => { if (props.autofocus && area.value) area.value.focus(); });
    const picked = (e) => {
      draft.files.push(...Array.from(e.target.files || []));
      e.target.value = "";
      // the picker took the focus and does not give it back, so the next keystroke goes nowhere
      nextTick(() => { if (area.value) area.value.focus(); });
    };
    const unpick = (i) => draft.files.splice(i, 1);
    async function go() {
      if (!draft.text.trim() || draft.sending) return;
      draft.sending = true;
      draft.error = null;
      const said = String(props.quote || "");
      try {
        const files = props.attach ? await Promise.all(draft.files.map(readFileAsData)) : [];
        await props.send(said ? said + draft.text : draft.text, files);
        draft.text = "";
        draft.files = [];
      } catch (e) {
        draft.error = e.message;
      } finally {
        draft.sending = false;
      }
    }
    return { draft, go, picked, unpick, area, quoteLines };
  },
  template: `
    <form class=compose @submit.prevent="go">
      <div v-if="quote" class=compose-quote>
        <span class=compose-quote-label>Commenting on</span>
        <div class=compose-quote-text><p v-for="(l, i) in quoteLines" :key="i">{{ l }}</p></div>
      </div>
      <div :class="['compose-box', {attachable: attach}]">
        <!-- UP IN AN EMPTY BOX GOES BACK TO THE LAST THING SAID, the way a shell goes back through
             its history. With anything typed the arrow moves the caret, which is what it is for. -->
        <textarea ref=area class=box-area v-model="draft.text" rows=3 :placeholder="placeholder" :aria-label="submit"
          @keydown.enter.exact="!$event.isComposing && ($event.preventDefault(), go())"
          @keydown.up="onUp && !draft.text.trim() && ($event.preventDefault(), onUp())"
          @keydown.meta.enter.prevent="go" @keydown.ctrl.enter.prevent="go"></textarea>
        <label v-if="attach" class=compose-attach title="Attach files" aria-label="Attach files">
          <Icon name="paperclip"/><input type=file multiple hidden @change="picked">
        </label>
        <div v-if="draft.files.length" class=compose-files>
          <span v-for="(f, i) in draft.files" :key="i" class=chip>{{ f.name }} <button type=button class=chip-x title="Remove" @click="unpick(i)">×</button></span>
        </div>
      </div>
      <div v-if="!bare" class=compose-bar>
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
    // AN ANSWER IN THEIR OWN WORDS IS STILL AN ANSWER. `chosen` only ever matched an option whose label
    // equalled the answer, so a written one highlighted nothing and the question read as unanswered.
    const wrote = computed(() => !!props.q.answer && !(props.q.options || []).some((o) => o.label === props.q.answer));
    const cancel = () => { state.changing = false; state.picked = ""; state.custom = ""; };
    // `compact` is what the thread passes, and in a conversation every box sends on Enter. On the
    // question's own page the box is one form field among many, where Enter making a line is right.
    const sendsOnEnter = computed(() => !!props.compact);
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
    return { state, answer, pick, save, locked, cancel, CUSTOM, chosen, wrote, sendsOnEnter };
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
        <div v-if="locked && wrote" class="option option-custom chosen">
          <span class=option-pick>Your answer</span>{{ q.answer }}
        </div>
        <div v-if="!locked" role=button :tabindex="state.answering ? -1 : 0" :aria-pressed="state.picked === CUSTOM"
          :class="['option', 'option-custom', {picked: state.picked === CUSTOM}]"
          @click="pick(CUSTOM)" @keydown.enter.self.prevent="pick(CUSTOM)" @keydown.space.self.prevent="pick(CUSTOM)">
          Custom answer
          <textarea v-if="state.picked === CUSTOM" v-model="state.custom" placeholder="Write your answer" aria-label="Your custom answer"
            @keydown.enter.exact="sendsOnEnter && (!$event.isComposing) && ($event.preventDefault(), save())"
            @keydown.meta.enter.prevent="save" @keydown.ctrl.enter.prevent="save"
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
        <Compose v-if="!(q.options && q.options.length)" :placeholder="q.answer ? 'Write a new answer. The old one stays in the history.' : 'Answer the agent…'"
          :submit="q.answer ? 'Add new answer' : 'Answer'" hint="The agent is told at its next stop" :send="answer" :bare="compact"/>
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
  props: { about: { type: String, default: "" }, env: { type: String, default: "" }, quote: { type: String, default: "" } },
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
            <div v-if="c.became && c.became.length" class=comment-made>
              <RefChip v-for="b in c.became" :key="b.ref" :to="$refHref(b.ref, env)" :label="b.label"/>
            </div>
            <div class=comment-meta>The agent · handled it</div>
          </div>
        </template>
      </div>
      <Compose placeholder="Comment for the agent" submit="Comment" hint="The agent is told at its next stop" :send="post"
        :quote="quote" :key="'c-draft-' + quote"/>
    </div>`,
};

const FromMessages = {
  props: { rows: { type: Array, default: () => [] }, env: { type: String, default: "" } },
  template: `
    <div v-if="rows && rows.length" class=from-messages>
      <p class=section-label>From your message</p>
      <a v-for="m in rows" :key="m.n" class=chip :href="'#/env/' + (m.env || env) + '/messages/' + m.n" @click="$openRef($event, '#/env/' + (m.env || env) + '/messages/' + m.n)" :title="m.excerpt">Message #{{ m.n }}</a>
    </div>`,
};

// ─────────────────────────────────────────────────────────────── writing: actions and their forms
// An action is { label, method, url, fields, submit, note, danger, only, leave, shape }: `only` sends the
// fields that changed, `leave` returns to the list, `shape` rewrites the payload before it is sent.
const ActionBar = {
  props: { actions: { type: Array, default: () => [] }, done: Function, open: { type: String, default: "" } },
  components: { Icon },
  setup(props) {
    // the one primary action leads the row; the rest keep their order after it
    const ordered = computed(() => [...props.actions.filter((a) => a.primary), ...props.actions.filter((a) => !a.primary)]);
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
      const typed = { ...s.values };
      if (a.only) {
        payload = Object.fromEntries(Object.entries(payload).filter(([k, v]) => v !== initial(a, k)));
        if (!Object.keys(payload).length) { s.error = "Nothing was changed."; return; }
      }
      if (a.shape) payload = a.shape(payload);
      s.sending = true;
      s.error = null;
      try {
        // `also` is a request that goes FIRST and is described by the action: the plan-with-me action
        // uses it to create the placeholder plan before the message that asks for it is sent
        if (a.also) {
          const extra = a.also(typed);
          if (extra) await send(extra.method || "POST", extra.url, extra.body);
        }
        const body = await send(a.method, a.url, payload);
        if (!props.open) s.open = "";
        if (props.done) props.done(body, a);
      } catch (e) {
        s.error = e.message;
      } finally {
        s.sending = false;
      }
    }
    return { s, current, pick, go, ordered };
  },
  template: `
    <div v-if="actions.length" class=actions>
      <div v-if="!open" class=action-buttons>
        <button v-for="a in ordered" :key="a.label" type=button :class="[a.primary ? 'primary-act' : 'btn', {danger: a.danger, on: s.open === a.label}]"
          @click="pick(a)">{{ a.label }}<Icon v-if="a.primary" name="arrow"/></button>
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

// groups: {key, label, kind, closed, folded, match(row)}; a row marked live stays listed in a closed group until it closes; columns: {priority, status, num, numWidth, title, sub, cite, age, ageWidth, library, struck}
// a row's type is a plain tinted word; the status dot beside it already carries state
const TYPES = {
  question: { label: "Question", tint: "#c9955e" }, message: { label: "Message", tint: "#6fae7d" },
  suggestion: { label: "Suggestion", tint: "#a3a8f0" }, doc: { label: "Doc", tint: "#6fae7d" },
  report: { label: "Report", tint: "#d9a441" }, plan: { label: "Plan", tint: "#5b8def" },
  todo: { label: "To-do", tint: "#5b8def" }, work: { label: "Work", tint: "#5b8def" },
  transcript: { label: "Transcript", tint: "#6fb3c9" },
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
    // a closed section shows what closed within the resource's days listed (0 keeps it listed); older, or closed at an unknown time, is archived
    const listedMs = () => {
      const kept = RETENTION.table && props.name && RETENTION.table[props.name];
      return kept ? kept.archive * 86400000 : RECENT_MS;
    };
    const recent = (r) => !!r.closed_at && (listedMs() === 0 || Date.now() - Date.parse(r.closed_at) < listedMs());
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
      const rows = props.rows.filter((r) => g.match(r) && !moving.has(rowKey(r)) && (!g.closed || (r.live ? !props.archive : recent(r) !== props.archive))).concat(held).sort((a, b) => {
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
    // a group starts as its list asks, and keeps whatever the user chose here
    const folds = reactive(listFolds());
    const folded = (g) => {
      const kept = folds[props.name || ""];
      const chose = kept ? kept[g.key] : undefined;
      return chose === undefined ? !!g.folded : chose;
    };
    const fold = (g) => {
      const list = props.name || "";
      folds[list] = { ...(folds[list] || {}), [g.key]: !folded(g) };
      saveListFolds(folds);
    };
    // THE WHOLE HEADER IS THE TARGET, not just the chevron: a 20px hit area for something the eye
    // reads as one row. The chevron keeps its own click (so it stays the keyboard control and is not
    // toggled twice), and a click that lands in the sort controls is a sort, never a fold.
    const foldFromHead = (e, g) => {
      if (e.target.closest(".sort, .ghead-fold")) return;
      fold(g);
    };
    return { state, sections, closable, archived, sortOf, setSort, more, open, moving, fresh, folded, fold, foldFromHead, TYPES };
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
        <div v-if="g.label" class=ghead @click="foldFromHead($event, g)">
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
          <button type=button class=ghead-fold :aria-expanded="!folded(g)" :title="folded(g) ? 'Show these' : 'Fold these away'"
            :aria-label="(folded(g) ? 'Show ' : 'Fold away ') + g.label" @click="fold(g)"><span :class="['fold', {shut: folded(g)}]"></span></button>
        </div>
        <TransitionGroup v-if="!folded(g)" tag="div" :class="['rows', {quiet: state.quiet}]" name="row" appear>
        <a v-for="(r, i) in g.rows" :key="r.n ?? r.name" :class="['row', 'lrow', {library: columns.library, sel: selected && selected(r), struck: columns.struck && columns.struck(r), moving: moving(r), fresh: fresh(r)}]"
          :style="{'--i': i, '--num-w': columns.numWidth || '44px', ...(columns.ageWidth ? {'--age-col': columns.ageWidth} : {})}" :href="href(r)" @click="open($event, r)">
          <PriorityIcon v-if="columns.priority" :value="columns.priority(r)"/>
          <StatusIcon v-if="columns.status" :kind="columns.status(r)" :tint="columns.tint ? columns.tint(r) : null"/>
          <span v-if="columns.type" class=type :style="{ color: (TYPES[columns.type(r)] || {}).tint }">{{ (TYPES[columns.type(r)] || {}).label }}</span>
          <span v-if="columns.num" class=num>{{ columns.num(r) }}</span>
          <span v-if="columns.question" :class="['qmark', columns.question(r).state]" :title="columns.question(r).title"
            :aria-label="columns.question(r).title || null"><Icon v-if="columns.question(r).state" name="questions"/></span>
          <div class=stack><div class=title>{{ columns.title(r) }}</div>
            <div v-if="(columns.sub && columns.sub(r)) || (columns.cite && columns.cite(r))" :class="['sub', {'only-cite': !(columns.sub && columns.sub(r))}]">{{ columns.sub ? columns.sub(r) : '' }}<span v-if="columns.cite && columns.cite(r)" class=sub-cite>{{ columns.sub && columns.sub(r) ? ' · ' : '' }}{{ columns.cite(r) }}</span></div></div>
          <span v-if="columns.cite && !columns.library" class=cite>{{ columns.cite(r) }}</span>
          <span v-if="columns.age" :class="['age', {warn: columns.ageWarn && columns.ageWarn(r)}]" :title="r.age || null">{{ columns.age(r) }}</span>
        </a>
        </TransitionGroup>
        <button v-if="!folded(g) && g.rows.length < g.total" type=button class="btn more-rows" @click="more(g.key)">Show {{ Math.min(limit, g.total - g.rows.length) }} more</button>
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
// THE ORDER IS HOW CLOSE A ROW IS TO MOVING: what is being worked, what is on the user, what is
// stuck, what is merely waiting its turn, what is finished. One list, read by the page and by the
// rail's tab alike, so the two can never disagree about where Blocked sits.
const GROUPS = [
  { key: "progress", label: "In progress" },
  { key: "waiting", label: "Waiting on you" },
  { key: "blocked", label: "Blocked" },
  { key: "open", label: "Open" },
  { key: "done", label: "Done" },
];
const STATUS_LABEL = Object.fromEntries(GROUPS.map((g) => [g.key, g.label]));

//: what a to-do's state is CALLED in the rail, where there is room for a word and not a sentence
const TODO_RAIL_WORD = { progress: "working", waiting: "waiting on you", blocked: "blocked", open: "" };

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

// the closed group names how long a closed to-do stays listed here, from the environment's retention settings
function closedLabel() {
  const kept = RETENTION.table && RETENTION.table.todos;
  const days = kept ? kept.archive : 7;
  if (days === 0) return "Closed";
  if (days === 1) return "Closed today";
  return days === 7 ? "Closed this week" : `Closed in the last ${days} days`;
}
const TODO_LIST = {
  groups: GROUPS.map((g) => {
    // closed to-dos arrive collapsed like every other closed section; this group is built here rather than
    // written as a literal, which is why the pass over `closed: true` lines did not reach it
    const group = { ...g, kind: g.key, closed: g.key === "done", folded: g.key === "done", match: (t) => todoStatus(t) === g.key };
    // an accessor, not a copied value, so the label follows the setting when it loads
    if (g.key === "done") Object.defineProperty(group, "label", { get: closedLabel, enumerable: true });
    return group;
  }),
  columns: { priority: (t) => t.priority, status: (t) => todoStatus(t), num: (t) => `#${t.n}`, question: todoQuestionMark,
             numWidth: "34px", ageWidth: "52px", title: (t) => t.title, age: (t) => shortAge(t.age),
             // A ROW THAT IS WAITING SAYS ON WHAT. The pill told a reader that a to-do was Blocked or
             // Waiting on you and then stopped, which is the half of the sentence they did not need —
             // the reason is required when it is written, and it was being thrown away on the way out.
             sub: (t) => t.asks || t.blocked || "",
             // the row already carried its plan and nobody drew it: a row in a plan reads differently
             // from one on the open list, and which PHASE is the part you cannot work out from the list
             cite: (t) => (t.plan ? `Plan ${t.plan.n} · phase ${t.plan.phase}` : "") },
  sorts: [{ key: "n", label: "ID" }, { key: "priority", label: "Priority", value: (t) => t.priority ?? 100 }],
  count: (rows) => `${rows.length} to-dos, ${rows.filter((t) => todoStatus(t) !== "done").length} open`,
  empty: "Nothing is waiting on this environment.", name: "todos",
};
const CLAIM_LIST = {
  groups: [{ key: "standing", label: "Standing", kind: "open", match: (c) => !c.struck },
           { key: "struck", label: "Struck", kind: "withdrawn", closed: true, folded: true, match: (c) => c.struck }],
  columns: { num: (c) => `#${c.n}`, title: (c) => c.fact, cite: (c) => (docOf(c.meta) ? `Doc ${docOf(c.meta)}` : ""),
             age: (c) => ageOf(c.meta), struck: (c) => c.struck },
  count: (rows) => `${rows.filter((c) => !c.struck).length} standing`,};
const MESSAGE_LIST = {
  groups: [{ key: "waiting", label: "Waiting", kind: "waiting", match: (m) => m.status === "waiting" },
           { key: "processed", label: "Processed", kind: "done", closed: true, folded: true, match: (m) => m.status === "processed" || m.status === "moved" },
           { key: "archived", label: "Archived", kind: "withdrawn", closed: true, folded: true, match: (m) => m.status === "archived" }],
  columns: { status: (m) => (m.status !== "waiting" ? "done" : m.read ? "progress" : "waiting"), num: (m) => `#${m.n}`, title: (m) => m.text,
             cite: messageBecame, age: (m) => m.age },
  count: (rows) => `${rows.filter((m) => m.status === "waiting").length} waiting`,
  empty: "No messages yet.",
};
const QUESTION_LIST = {
  groups: [{ key: "open", label: "Open", kind: "waiting", match: (q) => q.status === "open" },
           { key: "answered", label: "Answered", kind: "done", closed: true, folded: true, match: (q) => q.status === "answered" },
           { key: "withdrawn", label: "Withdrawn", kind: "withdrawn", closed: true, folded: true, match: (q) => q.status === "withdrawn" }],
  columns: { status: (q) => questionKind(q), num: (q) => `#${q.n}`, title: (q) => q.text,
             cite: (q) => q.links.map((l) => l.label).join(", "), age: (q) => q.age },
  count: (rows) => `${rows.filter((q) => q.status === "open").length} open`,  empty: "Nothing has been asked on this environment.", name: "questions",
};
const LOG_KIND = { started: "Started", update: "Update", waiting: "Waiting on", commit: "Committed", ended: "Ended" };
const WORK_LIST = {
  groups: [{ key: "open", label: "Open", kind: "progress", match: (w) => !w.ended },
           { key: "ended", label: "Ended", kind: "done", closed: true, folded: true, match: (w) => w.ended }],
  columns: { title: (w) => w.subject, sub: (w) => (w.notes.length ? w.notes[w.notes.length - 1].text : ""),
             cite: (w) => [w.todo && `To-do ${w.todo}`, w.doc && `Doc ${w.doc}`].filter(Boolean).join(", "), age: (w) => w.age },
  count: (rows) => `${rows.filter((w) => !w.ended).length} open`, empty: "Nothing is open.", name: "work",
};
const REMINDER_LIST = {
  groups: [{ key: "standing", label: "Standing", kind: "open", match: (r) => !r.struck },
           { key: "retired", label: "Retired", kind: "withdrawn", closed: true, folded: true, match: (r) => r.struck }],
  columns: { num: (r) => `#${r.n}`, title: (r) => r.text, cite: (r) => r.until || "", struck: (r) => r.struck },
  count: (rows) => `${rows.filter((r) => !r.struck).length} standing`,  empty: "Nothing is being repeated.", name: "reminders",
};
const DOC_LIST = {
  groups: [{ key: "final", label: "Final", kind: "done", match: (d) => !d.archived && !d.superseded_by && d.status === "final" },
           { key: "draft", label: "Draft", kind: "open", match: (d) => !d.archived && !d.superseded_by && d.status !== "final" },
           { key: "superseded", label: "Superseded", kind: "withdrawn", match: (d) => !d.archived && d.superseded_by },
           { key: "archived", label: "Archived", kind: "withdrawn", folded: true, match: (d) => d.archived && !d.superseded_by }],
  columns: { status: (d) => (d.archived || d.superseded_by ? "withdrawn" : d.status === "final" ? "done" : "open"),
             library: true, num: (d) => `#${d.n}`, numWidth: "34px", title: (d) => d.title, sub: (d) => d.abstract, age: (d) => shortAge(d.age), ageWidth: "52px", struck: (d) => d.superseded_by,
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
const PANEL_PROPS = ["env", "n", "close", "onClose", "base", "link", "reloaded", "swap"];

function panelDone(props, item) {
  return (body, a) => {
    settle(a.advance ? null : body, a.advance ? { ...a, follow: null, leave: false } : a, props.base, item);
    if (props.reloaded) props.reloaded();
    if (a.advance) advanceInspector(props);
  };
}

// a primary action that also opens the next item says so, while there is a next item to open
function nextWord() { return INSPECTOR_TRAIL.items.length > 1 ? " & next" : ""; }

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
      // with auto mode off, an open to-do nothing holds back can be handed to the agent now; the viewer cannot start an agent, so it is a message
      const go = !(SHELL.activity && SHELL.activity.auto) && !["blocked", "waiting"].includes(todoStatus(t)) ? [{
        label: "Implement this", method: "POST", url: `/api/env/${props.env}/messages`, submit: "Send to the agent",
        note: "The agent is asked to start this to-do now. If it turns out to be blocked, the agent tells you what blocks it.",
        shape: () => ({ files: [], text: `Implement to-do ${t.n} now: ${t.title}. Start it with \`journal todos start ${t.n}\`; if it turns out blocked, tell me what blocks it instead.` }),
      }] : [];
      return [
        ...go,
        { label: "Edit", method: "PATCH", url, only: true, submit: "Save",
          fields: [{ name: "title", label: "Title", value: t.title },
                   { name: "body", label: "Brief", kind: "area", value: t.body || "" },
                   { name: "priority", label: "Priority", kind: "select", value: priorityName(t.priority).toLowerCase(), options: PRIORITIES }] },
        { label: `Mark done${nextWord()}`, primary: true, advance: true, method: "POST", url: `${url}/done`, fields: [{ name: "how", label: "How it was finished" }] },
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
    <Panel :label=\"'To-do ' + n" :close="close" :onClose="onClose" :link="link">
      <FetchState :state="item"/>
      <template v-if="item.data">
        <h2 class=p-title>{{ item.data.title }}</h2>
        <dl class=props>
          <!-- A BLOCKED ROW SAYS WHAT IT IS BLOCKED ON, beside the word Blocked rather than in a note
               under the buttons. The word alone tells a reader the one thing they already know. -->
          <dt>Status</dt><dd><StatusIcon :kind="todoStatus(item.data)"/>{{ STATUS_LABEL[todoStatus(item.data)] }}
            <span v-if="!item.data.done && (item.data.blocked || item.data.asks)" class=status-why>— {{ item.data.blocked || item.data.asks }}</span></dd>
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
          <dt>Cites</dt><dd>
            <a v-if="item.data.doc" :href="'#/docs/' + item.data.doc">Doc {{ item.data.doc }}</a>
            <a v-if="item.data.transcript" class=chip :href="'/transcripts/' + env + '/' + item.data.transcript" target=_blank rel=noopener>Transcript {{ item.data.transcript }}</a>
            <span v-if="!item.data.doc && !item.data.transcript" class=muted>—</span></dd>
          <template v-if="item.data.plan"><dt>Plan</dt><dd><a :href="'#/env/' + env + '/plans/' + item.data.plan.n">Plan {{ item.data.plan.n }} · phase {{ item.data.plan.phase }}</a></dd></template>
          <dt>Added</dt><dd>{{ item.data.age || '—' }}</dd>
          <template v-if="item.data.after.length">
            <dt>Waits on</dt><dd><a v-for="a in item.data.after" :key="a" :href="todoHref(a)">#{{ a }}</a></dd>
          </template>
        </dl>
        <ActionBar :actions="actions" :done="done" :key="'todo' + item.data.n + (item.data.done || '')"/>
        <div v-if="item.data.done" class=note>Closed: {{ item.data.how || 'done' }}</div>
        <div v-if="item.data.blocked" class=note>Set aside: {{ item.data.blocked }}</div>
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
                <CommitChip v-if="e.kind === 'commit'" :env="env" :sha="e.sha"/><span v-if="e.text && e.kind !== 'started'" :class="{'sha-subject': e.kind === 'commit'}"> — <span v-html="$linkify(e.text)"></span></span></span>
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
    <Panel :label=\"'Question ' + n" :close="close" :onClose="onClose" :link="link">
      <FetchState :state="item"/>
      <template v-if="item.data">
        <div class="md p-title" v-html="$md(item.data.text)"></div>
        <dl class=props>
          <dt>Status</dt><dd><StatusIcon :kind="questionKind(item.data)"/>{{ item.data.status === 'open' ? 'Open' : item.data.status === 'answered' ? 'Answered' : 'Withdrawn' }}</dd>
          <dt>About</dt><dd>
            <RefChip v-for="l in item.data.links" :key="l.ref" :to="$refHref(l.ref, env)" :label="l.label"/>
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

// each part of a message beside the agent's answer to it, so a reply reads where the question was asked
function messageAnswers(m) {
  if (!m) return { rows: [], others: [] };
  const agentReplies = (m.replies || []).filter((r) => r.who === "the agent" && r.part);
  const used = new Set();
  const matches = (p, r) => p.excerpt && r.part && (p.excerpt.includes(r.part) || r.part.includes(p.excerpt));
  // a part answered by a reply is recorded twice, once filed and once as answered: fold them into one row
  const byAsk = new Map();
  (m.parts || []).forEach((p) => {
    const seen = byAsk.get(p.excerpt);
    const became = p.became.filter((b) => b.ref !== "answered");
    if (seen) seen.became.push(...became.filter((b) => !seen.became.some((x) => x.ref === b.ref)));
    else byAsk.set(p.excerpt, { excerpt: p.excerpt, became });
  });
  const rows = [...byAsk.values()].map((p) => {
    const reply = agentReplies.find((r) => matches(p, r));
    if (reply) used.add(reply);
    return { part: p.excerpt, answer: reply ? reply.text : "", became: p.became, age: reply ? reply.age || "just now" : "" };
  });
  agentReplies.filter((r) => !used.has(r)).forEach((r) => { used.add(r); rows.push({ part: r.part, answer: r.text, became: [], age: r.age || "just now" }); });
  const waiting = m.status === "waiting";
  const shaped = rows.map((r) => ({ ...r, done: !!r.answer || !waiting, pending: !r.answer && waiting,
                                    chip: r.answer ? "answered" : waiting ? "still working" : r.became.length ? "filed" : "noted" }));
  // NO FRACTION IN THE TITLE. It counted only parts carrying a written reply, against every part
  // recorded — so a part that became a to-do read as unanswered when it had been handled, and the
  // panel announced unfinished work that did not exist. The parts below say what each became, each
  // with its own chip, so the title is the message itself.
  return { rows: shaped, others: (m.replies || []).filter((r) => !used.has(r)) };
}

// One progress bar, wherever progress is shown. THE MEASUREMENT IS INSIDE IT: the home card and the
// plan page used to compute their own widths, and drifted — the home measured to-dos while the plan
// page measured phases, so the same plan read two different progresses depending on where you looked.
const ProgressBar = {
  props: { rows: { type: Array, default: () => [] }, word: { type: String, default: "to-dos" } },
  setup(props) {
    const done = computed(() => (props.rows || []).filter((r) => r.done).length);
    const total = computed(() => (props.rows || []).length);
    const width = computed(() => (total.value ? `${(100 * done.value) / total.value}%` : "0%"));
    const text = computed(() => `${done.value} of ${total.value} ${props.word} done`);
    return { done, total, width, text };
  },
  template: `
    <span class=progress-track :role="'progressbar'" :aria-valuenow="done" :aria-valuemax="total" :aria-label="text">
      <span :style="{ width }"></span>
    </span>`,
};

// One funnel for what a fetch is DOING. Every panel repeated the same error paragraph and every
// page the same Loading… line — 25 copies of two lines. It renders nothing once the data is there,
// so a caller shows its own content under `v-if="<state>.data"` as before.
const FetchState = {
  props: { state: { type: Object, required: true }, loading: { type: String, default: "" } },
  template: `
    <p v-if="state.error" class=error>{{ state.error }}</p>
    <p v-else-if="loading && state.loading && !state.data" class=empty>{{ loading }}</p>`,
};

// One chip for a reference the reader can open — the anchor, the openRef click, and the plain
// chip when nothing links it. Written out by hand at eight call sites before this.
const RefChip = {
  props: { to: { type: String, default: "" }, label: { type: String, default: "" } },
  template: `
    <a v-if="to" class=chip :href="to" @click="$openRef($event, to)">{{ label }}</a>
    <span v-else class=chip>{{ label }}</span>`,
};

// A commit, as the short sha that opens what it covered.
const CommitChip = {
  props: { env: String, sha: String },
  computed: { short() { return String(this.sha || "").slice(0, 7); } },
  template: `
    <a class="chip sha" :href="'#/env/' + env + '/commits/' + sha" :title="'What commit ' + short + ' covered'">{{ short }}</a>`,
};

// A session, as the chip that opens it.
const SessionChip = {
  props: { env: String, id: String },
  template: `<a class=chip :href="'#/env/' + env + '/agents/session/' + id">Session {{ id }}</a>`,
};

// What the user wrote, under its heading: the message panel and the reply panel show the same block.
const UserMessage = {
  props: { text: String },
  template: `<div><p class=section-label>Your message</p><div class="prose message" v-html="$linkify(text)"></div></div>`,
};

// The files a piece of work or a commit changed, with what each gained and lost.
const WorkFilesSection = {
  props: { files: { type: Array, default: () => [] }, isNew: { type: Boolean, default: false } },
  template: `
    <div v-if="files.length">
      <p class=section-label>Files changed <span class=muted>{{ files.length }}</span></p>
      <div class=work-files>
        <div v-for="f in files" :key="f.path" class=work-file :title="f.path">
          <span class=work-file-path>{{ f.path }}</span>
          <span v-if="isNew && f.created" class=work-file-new>new</span>
          <span class=work-file-add>+{{ f.added }}</span><span class=work-file-del>−{{ f.removed }}</span>
        </div>
      </div>
    </div>`,
};

// Every journal running on this machine: the project strip and the sidebar switcher show the same list.
const JournalsDropdown = {
  props: { rows: { type: Array, default: () => [] }, colorOf: Function, pick: Function },
  template: `
    <div class=drop-head><span>Journals running on this machine</span></div>
    <template v-for="j in rows" :key="j.port">
      <div v-if="j.current" class="drop-row current">
        <span class=drop-kind>This journal · port {{ j.port }}{{ j.version ? ' · ' + j.version : '' }}</span>
        <span class=drop-text><span class=journal-dot :style="{background: colorOf(j.project)}"></span>{{ j.project }}</span>
      </div>
      <a v-else class=drop-row :href="j.url" @click="pick()">
        <span class=drop-kind>Port {{ j.port }}{{ j.version ? ' · ' + j.version : '' }}</span>
        <span class=drop-text><span class=journal-dot :style="{background: colorOf(j.project)}"></span>{{ j.project }}</span>
      </a>
    </template>`,
};

// Point by point: a card per part, what it asked, what the agent answered or is doing, and what it made
const PointByPoint = {
  props: { rows: Array, env: String },
  components: { Icon },
  setup(props) {
    // A PART IS NOT A QUESTION. The agent splits a message into the pieces it acted on: one becomes a
    // to-do, one a doc, one gets answered. Saying "you asked N things · M answered" of all of them
    // reported a statement the user made as an unanswered question of theirs — so the line counts
    // what actually happened to each piece instead.
    const note = computed(() => {
      const rows = props.rows || [];
      const answered = rows.filter((r) => r.answer).length;
      const filed = rows.filter((r) => !r.answer && r.became.length).length;
      const working = rows.filter((r) => r.pending).length;
      return [`${rows.length} ${rows.length === 1 ? "part" : "parts"}`, answered ? `${answered} answered` : "",
              filed ? `${filed} filed` : "", working ? `${working} still working` : ""].filter(Boolean).join(" · ");
    });
    return { TYPES, note };
  },
  template: `
    <div v-if="rows.length">
      <div class=files-head><p class=section-label>Point by point</p><span class=muted>{{ note }}</span></div>
      <div class=part-cards>
        <div v-for="(p, i) in rows" :key="i" :class="['part-card', {pending: p.pending}]">
          <div class=part-strip>
            <span class=part-ordinal>{{ i + 1 }}/{{ rows.length }}</span>
            <span :class="['part-chip', {done: p.done}]">{{ p.chip }}</span>
            <span class=part-age>{{ p.age }}</span>
          </div>
          <div class=part-main>
            <div class=reply-ask><span class=reply-bar></span><span class=part-ask>{{ p.part }}</span></div>
            <div v-if="p.answer" class="md prose part-answer" v-html="$md(p.answer)"></div>
            <p v-else-if="p.pending" class=part-working>Still working on this one.</p>
            <a v-for="b in p.became" :key="b.ref" class=part-made :href="$refHref(b.ref, env) || null" @click="$openRef($event, $refHref(b.ref, env))">
              <span class=part-made-label>{{ p.pending ? 'it is making' : 'it made' }}</span>
              <span class=part-made-dot :style="{ background: (TYPES[String(b.ref).split(':')[0]] || {}).tint || '#83868e' }"></span>
              <span class=part-made-ref>{{ b.label }}</span>
              <Icon name="open"/>
            </a>
          </div>
        </div>
      </div>
    </div>`,
};

const MessagePanel = {
  props: PANEL_PROPS,
  components: { Panel, StatusIcon, ActionBar, Comments, Icon, PointByPoint, Compose, UserMessage },
  setup(props) {
    const api = computed(() => `/api/env/${props.env}/messages`);
    const item = useFetch(() => props.env && props.n && `${api.value}/${props.n}`);
    const envs = useEnvironments(() => props.env);
    const heldUrl = (m, f) => `/message-files/${props.env}/${m.n}/${encodeURIComponent(f.name)}`;
    // nothing lists a transcript: the message that carried it is the only way in
    const transcriptUrl = computed(() => (item.data && item.data.transcript ? `/transcripts/${props.env}/${item.data.n}` : ""));
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
    const attachFiles = async (event) => {
      const picked = Array.from(event.target.files || []);
      event.target.value = "";
      if (!picked.length || attaching.busy || !item.data) return;
      attaching.busy = true;
      attaching.error = "";
      try {
        const files = await Promise.all(picked.map(readFileAsData));
        await postJSON(`${api.value}/${item.data.n}/attach`, { files });
        item.reload();
        changed();
      } catch (err) {
        attaching.error = err.message;
      } finally {
        attaching.busy = false;
      }
    };
    const answered = computed(() => messageAnswers(item.data));
    // THE BOX IS FOR ANSWERING THE AGENT, so it appears only once the agent has said something here.
    // On a message nobody has replied to it invited the user to answer themselves, which is what looked
    // like a bug; adding to your own message is what the comment thread below is for.
    const asked = computed(() => ((item.data && item.data.replies) || []).some((r) => r.who === "the agent"));
    // answering where you are reading: it posts a reply on the message, then opens the next item like the primary action does
    const answerMessage = (text) => postJSON(`${api.value}/${item.data.n}/reply`, { text })
      .then(() => { item.reload(); changed(); advanceInspector(props); });
    // a message that declared what it is says so where its number is read, rather than reading as an ordinary one
    const noun = computed(() => (item.data && item.data.kind === "transcript" ? "Transcript" : "Message"));
    return { item, actions, done, heldUrl, isImage, removing, startRemove, cancelRemove, confirmRemove, attaching, attachFiles, answered, answerMessage, asked, noun, transcriptUrl };
  },
  template: `
    <Panel :label=\"noun + ' ' + n" :close="close" :onClose="onClose" :link="link">
      <FetchState :state="item"/>
      <template v-if="item.data">
        <!-- the heading is the message's NUMBER: the text is read once, under it, where UserMessage renders it -->
        <h2 class=panel-title>{{ noun }} {{ item.data.n }}</h2>
        <UserMessage :text="item.data.text"/>
        <a v-if="transcriptUrl" class=file-row :href="transcriptUrl" target=_blank rel=noopener>
          <span class=file-name>Open the transcript</span><span class=file-meta>its own file, listed nowhere</span>
        </a>
        <dl class=props>
          <dt>Status</dt><dd :title="item.data.status === 'waiting' && item.data.read ? 'The agent read it ' + item.data.read_age : null"><StatusIcon :kind="item.data.status !== 'waiting' ? 'done' : item.data.read ? 'progress' : 'waiting'"/>{{ item.data.status === 'waiting' ? (item.data.read ? 'Being handled' : 'Waiting to be processed') : item.data.status === 'moved' ? 'Moved to ' + item.data.moved_to : item.data.status === 'archived' ? 'Archived: ' + item.data.archived : 'Processed' }}</dd>
          <dt>Left</dt><dd>{{ item.data.age || '—' }}</dd>
          <dt>From</dt><dd>{{ item.data.source === 'web' ? 'The browser' : 'The terminal' }}</dd>
        </dl>
        <ActionBar :actions="actions" :done="done" :key="'message' + item.data.n + item.data.status"/>
        <div v-if="asked" class=answer-here>
          <p class=section-label>Your answer</p>
          <Compose placeholder="Answer the agent…" submit="Send" hint="Enter sends · Shift+Enter for a new line" :send="answerMessage"/>
        </div>
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
        <PointByPoint v-if="answered.rows.length" :rows="answered.rows" :env="env"/>
        <p v-else-if="item.data.status === 'waiting' && item.data.read" class="prose muted">The agent has read it and is handling it. It splits it into parts and answers or files each one.</p>
        <p v-else-if="item.data.status === 'waiting'" class="prose muted">Not processed yet. At its next stop the agent splits it into parts and answers or files each one.</p>
        <div v-if="answered.others.length">
          <p class=section-label>Replies</p>
          <div class=linked>
            <div v-for="(r, i) in answered.others" :key="i" :class="['sub', 'reply', {'from-agent': r.who === 'the agent'}]">
              <div class=muted>{{ r.who === 'the agent' ? 'The agent' : 'You' }}{{ r.part ? ' answered' : '' }} · {{ r.age || 'just now' }}</div>
              <blockquote v-if="r.part" class=reply-part>{{ r.part }}</blockquote>
              <div class="md prose" v-html="$md(r.text)"></div>
            </div>
          </div>
        </div>
        <Comments :about="'message ' + item.data.n" :env="env" :key="'c-message' + item.data.n"/>
      </template>
    </Panel>`,
};

// a reply on its own: your message and what the agent answered, with one step to the full message
const ReplyPanel = {
  props: PANEL_PROPS,
  components: { Panel, PointByPoint, Icon, Comments, UserMessage },
  setup(props) {
    const item = useFetch(() => props.env && props.n && `/api/env/${props.env}/messages/${props.n}`);
    const answered = computed(() => messageAnswers(item.data));
    // IT SWAPS WHAT THE INSPECTOR SHOWS AND NEVER LEAVES THE PAGE. It used to swap only when the panel
    // WAS the overlay, and navigate otherwise -- but the home mounts its panels through its own view,
    // so from there the test was false and this threw the reader onto the messages INDEX. Nothing in an
    // inspector navigates to a list: the overlay opens over whatever page you are on.
    const openMessage = () => {
      if (props.swap) { props.swap("message", props.n); return; }
      OVERLAY.kind = "message";
      OVERLAY.n = props.n;
    };
    return { item, answered, openMessage };
  },
  template: `
    <Panel :label="'Reply to message ' + n" :close="close" :onClose="onClose" :link="link">
      <FetchState :state="item"/>
      <template v-if="item.data">
        <h2 class=panel-title>The reply to message {{ item.data.n }}</h2>
        <!-- THE REPLY LEADS. This panel is opened to read an answer: the message it answers is context
             underneath it, not the first thing. A plain reply quotes no part of the message, so it used
             to fall into the others bucket and be dropped here entirely, by the one panel meant for it. -->
        <div v-if="answered.others.length" class=linked>
          <div v-for="(r, i) in answered.others" :key="i" :class="['sub', 'reply', {'from-agent': r.who === 'the agent'}]">
            <div class=muted>{{ r.who === 'the agent' ? 'The agent' : 'You' }}{{ r.part ? ' answered' : '' }} · {{ r.age || 'just now' }}</div>
            <blockquote v-if="r.part" class=reply-part>{{ r.part }}</blockquote>
            <div class="md prose" v-html="$md(r.text)"></div>
          </div>
        </div>
        <PointByPoint v-if="answered.rows.length" :rows="answered.rows" :env="env"/>
        <p v-else-if="!answered.others.length" class="prose muted">The agent has not answered any part of this message yet.</p>
        <details class=reply-source>
          <summary>The message it answers</summary>
          <UserMessage :text="item.data.text"/>
        </details>
        <div class=actions><div class=action-buttons>
          <button type=button class=primary-act @click="openMessage">Open the full message<Icon name="arrow"/></button>
        </div></div>
        <Comments :about="'message ' + n" :env="env" :key="'c-message' + n"/>
      </template>
    </Panel>`,
};

const WorkPanel = {
  props: PANEL_PROPS,
  components: { Panel, ActionBar, Comments, WorkFilesSection },
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
    return { item, actions, done, OVERLAY };
  },
  template: `
    <Panel :label=\"'Work ' + n" :close="close" :onClose="onClose" :link="link">
      <FetchState :state="item"/>
      <template v-if="item.data">
        <h2 class=p-title>{{ item.data.subject }}</h2>
        <dl class=props>
          <dt>Started</dt><dd>{{ item.data.age || '—' }}</dd>
          <dt v-if="item.data.ended">Ended</dt><dd v-if="item.data.ended">{{ item.data.ended_age || 'just now' }}</dd>
          <dt>Status</dt><dd>{{ item.data.ended ? 'Ended' : item.data.awaiting ? 'Waiting on ' + item.data.awaiting : 'Open' }}</dd>
          <template v-if="item.data.todo"><dt>To-do</dt><dd><RefChip :to="'#/env/' + env + '/todos/' + item.data.todo" :label="'To-do ' + item.data.todo"/></dd></template>
          <template v-if="item.data.doc"><dt>Document</dt><dd><RefChip :to="'#/docs/' + item.data.doc" :label="'Doc ' + item.data.doc"/></dd></template>
        </dl>
        <ActionBar :actions="actions" :done="done" :key="'work' + item.data.n + (item.data.ended || '')"/>
        <WorkFilesSection :files="item.data.files || []" is-new/>
        <div v-if="item.data.commits && item.data.commits.length">
          <p class=section-label>Commits <span class=muted>{{ item.data.commits.length }}</span></p>
          <div class=linked>
            <div v-for="c in item.data.commits" :key="c.sha" class="sub log-row">
              <span class=log-text><CommitChip :env="env" :sha="c.sha"/> <span class=sha-subject>{{ c.subject }}</span></span>
            </div>
          </div>
        </div>
        <div v-if="item.data.notes.length">
          <p class=section-label data-shut>Work log <span class=muted>{{ item.data.notes.length }}</span></p>
          <div class=work-log>
            <div v-for="(note, i) in item.data.notes" :key="i" class=work-log-note>
              <span class=work-log-when>{{ note.age || 'just now' }}</span>
              <div class=work-log-text v-html="$linkify(note.text)"></div>
            </div>
          </div>
        </div>
        <Comments :about="'work ' + item.data.n" :env="env" :key="'c-work' + item.data.n"
          :quote="OVERLAY.n === item.data.n ? OVERLAY.quote : ''"/>
      </template>
    </Panel>`,
};

const SUGGESTION_LIST = {
  groups: [{ key: "open", label: "Waiting on you", kind: "waiting", match: (s) => s.status === "open" },
           { key: "accepted", label: "Accepted", kind: "done", closed: true, folded: true, match: (s) => s.status === "accepted" || s.status === "adjusted" },
           { key: "declined", label: "Declined", kind: "withdrawn", closed: true, folded: true, match: (s) => s.status === "declined" },
           { key: "withdrawn", label: "Withdrawn", kind: "withdrawn", closed: true, folded: true, match: (s) => s.status === "withdrawn" }],
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
        { label: `Accept${nextWord()}`, primary: true, advance: true, method: "POST", url: `${url}/accept`, submit: "Accept",
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
    // Accept advances through panelDone; adjusting or declining also settles the suggestion, so it opens the next one too
    const done = (body, a) => { settled(body, a); if (["Adjust", "Decline"].includes(a.label)) advanceInspector(props); };
    return { item, actions, done, SUGGESTION_STATUS };
  },
  template: `
    <Panel :label=\"'Suggestion ' + n" :close="close" :onClose="onClose" :link="link">
      <FetchState :state="item"/>
      <template v-if="item.data">
        <h2 class=p-title>{{ item.data.title }}</h2>
        <dl class=props>
          <dt>Status</dt><dd>{{ SUGGESTION_STATUS[item.data.status] }}</dd>
          <dt>Suggested</dt><dd>{{ item.data.age || 'just now' }}</dd>
          <dt>About</dt><dd>
            <RefChip v-for="l in item.data.links" :key="l.ref" :to="$refHref(l.ref, env)" :label="l.label"/>
            <span v-if="!item.data.links.length" class=muted>—</span>
          </dd>
          <template v-if="item.data.became"><dt>Became</dt><dd><RefChip :to="$refHref(item.data.became, env)" :label="item.data.became.replace('todo:', 'To-do ')"/></dd></template>
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
      label: "Ask for suggestions", method: "POST", url: `/api/env/${props.env}/messages`, submit: "Send to the agent", leave: true,
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
// ONE PANEL PER RESOURCE, rendered on its page and wherever a reference opens it. A pin and a rule
// are the same shape with two scopes, so they are one factory and two names — the names matter
// because the inspector looks a panel up by one.
function claimPanel({ noun, api, page, scope, movable }) {
  const word = noun.toLowerCase();
  return {
    props: PANEL_PROPS,
    components: { Panel, ActionBar, LinkedQuestions, FromMessages, Comments, FetchState },
    setup(props) {
      const url = computed(() => api(props));
      const item = useFetch(() => props.n && `${url.value}/${props.n}`);
      const envs = useEnvironments(() => props.env);
      const actions = computed(() => {
        const c = item.data;
        if (!c || c.struck) return [];
        const one = `${url.value}/${c.n}`;
        return [
          { label: "Edit", method: "PATCH", url: one, only: true, submit: "Save",
            fields: [{ name: "fact", label: noun === "Rule" ? "Ruling" : "Claim", value: c.fact },
                     { name: "body", label: "Reasoning", kind: "area", value: c.body || "" }],
            note: `Changing the ${noun === "Rule" ? "ruling" : "claim"} strikes this ${word} and adds the new one under a new number.` },
          ...(movable ? [
            { label: "Move", method: "POST", url: `${one}/move`, fields: [envField(envs.value)],
              note: "It is struck here and added there." },
            { label: "Promote to rule", method: "POST", url: `${one}/promote`, submit: "Promote",
              note: "It becomes a rule on every environment, and this pin is struck." },
          ] : []),
          ...(noun === "Rule" ? [c.in_claude_md
            ? { label: "Remove from CLAUDE.md", method: "POST", url: `${one}/uninject`, submit: "Remove",
                note: "The rule stays; only its copy in CLAUDE.md is taken out." }
            : { label: "Add to CLAUDE.md", method: "POST", url: `${one}/inject`, submit: "Add",
                note: "Writes the ruling into the project's CLAUDE.md between journal markers, with a path to any file or doc it cites — never the file itself." }] : []),
          { label: "Strike", method: "DELETE", url: one, danger: true, fields: [{ name: "why", label: "Why it stopped being true" }] },
        ];
      });
      const done = (body, a) => { settle(body, a, props.base || props.close, item); if (props.reloaded) props.reloaded(); };
      return { item, actions, done, ageOf, docOf, word, envs, noun,
               scope: computed(() => scope(props)), page: computed(() => page(props)) };
    },
    template: `
      <Panel :label="noun + ' ' + n" :close="close" :onClose="onClose" :link="link || page">
        <FetchState :state="item"/>
        <template v-if="item.data">
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
      </Panel>`,
  };
}

const PinPanel = claimPanel({ noun: "Pin", api: (p) => `/api/env/${p.env}/pins`,
                              page: (p) => `#/env/${p.env}/pins/${p.n}`, scope: (p) => p.env, movable: true });
const RulePanel = claimPanel({ noun: "Rule", api: () => "/api/rules",
                               page: (p) => `#/rules/${p.n}`, scope: () => "Every environment", movable: false });

function claimsView({ crumbs, api, base, noun, scope, empty, movable }) {
  return {
    props: ["env", "archive", "n"],
    components: { TopBar, Panel, LinkedQuestions, ActionBar, ResourceList, FromMessages, Comments, PinPanel, RulePanel },
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
      return { list, item, creating, actions, done, ageOf, docOf, word, envs, panel: noun === "Rule" ? "RulePanel" : "PinPanel",
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
        <component v-else-if="n" :is="panel" :key="word + n" :env="env" :n="n" :close="base" :base="base" :reloaded="list.reload"/>
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

// what the row is CALLED, which a declared kind overrides: one funnel, read by the type column and its tint
function inboxType(r) { return r.kind || r.type; }

function suggestionKind(s) { return s.status === "open" ? "waiting" : s.status === "accepted" || s.status === "adjusted" ? "done" : "withdrawn"; }

const INBOX_LIST = {
  groups: [{ key: "you", label: "Waiting on you", kind: "waiting", match: (r) => r.group === "you" },
           { key: "agent", label: "Waiting on the agent", kind: "progress", match: (r) => r.group === "agent" },
           { key: "handled", label: "Handled", kind: "done", closed: true, folded: true, match: (r) => r.group === "handled" }],
  columns: { status: (r) => r.status, tint: (r) => (r.group === "you" ? (TYPES[inboxType(r)] || {}).tint || null : null), type: (r) => inboxType(r), num: (r) => `#${r.num}`, numWidth: "34px", title: (r) => r.title, age: (r) => shortAge(r.age), ageWidth: "52px", struck: (r) => r.struck },
  sorts: [{ key: "at", label: "Newest", value: (r) => r.at || "" }],
  count: (rows) => `${rows.filter((r) => r.group === "you").length} waiting · ${rows.filter((r) => r.at && Date.now() - Date.parse(r.at) < 7 * 86400000).length} this week`,
  empty: "Nothing has arrived here yet.", name: "inbox",
};

const Inbox = {
  props: ["env", "archive", "n"],
  components: { TopBar, Compose, ResourceList, MessagePanel, ReplyPanel, QuestionPanel, SuggestionPanel },
  setup(props) {
    const api = computed(() => `/api/env/${props.env}/messages`);
    const home = computed(() => `#/env/${props.env}/messages`);
    const base = computed(() => home.value + (props.archive || ""));
    const messages = useFetch(() => props.env && `${api.value}?all=1`);
    const questions = useFetch(() => props.env && `/api/env/${props.env}/questions?all=1`);
    const suggestions = useFetch(() => props.env && `/api/env/${props.env}/suggestions?all=1`);
    const reloadAll = () => [messages, questions, suggestions].forEach((f) => f.reload());
    const rows = computed(() => {
      if (!messages.data || !questions.data || !suggestions.data) return null;
      return [
        ...messages.data.map((m) => ({ name: `m${m.n}`, type: "message", kind: m.kind || "", num: m.n, title: m.text, age: m.age, at: m.at, closed_at: m.closed_at,
                                       group: m.status === "waiting" ? "agent" : "handled", live: m.status === "waiting", status: MESSAGE_LIST.columns.status(m), struck: m.status === "archived" })),
        ...questions.data.map((q) => ({ name: `q${q.n}`, type: "question", num: q.n, title: q.text, age: q.age, at: q.at, closed_at: q.closed_at,
                                        group: q.status === "open" ? "you" : "handled", status: questionKind(q), struck: q.status === "withdrawn" })),
        ...suggestions.data.map((s) => ({ name: `s${s.n}`, type: "suggestion", num: s.n, title: s.title, age: s.age, at: s.at, closed_at: s.closed_at,
                                          group: s.status === "open" ? "you" : "handled", status: suggestionKind(s), struck: s.status === "declined" || s.status === "withdrawn" })),
      ];
    });
    const opened = computed(() => {
      const m = /^(?:([qsr])\/)?(\d+)$/.exec(props.n || "");
      if (!m) return null;
      return { type: { q: "question", s: "suggestion", r: "reply" }[m[1]] || "message", num: m[2] };
    });
    // a message only reaches an agent at its next hook event; say so when none is working here
    const live = computed(() => {
      const row = OVERVIEW.data ? OVERVIEW.data.environments.find((e) => e.name === props.env) : null;
      return !!(row && row.active);
    });
    const hint = computed(() => (live.value ? "The agent is told at its next stop"
      : "No agent is working on this environment right now; the message waits until a session picks it up"));
    const readAll = () => send("POST", `/api/env/${props.env}/notifications/readall`).then(changed);
    const writeMessage = () => {
      if (THREAD_BOX.focus && THREAD_BOX.focus("")) return;
      Object.assign(QUICK, { open: true, q: "", i: 0, writing: true });
    };
    return { rows, messages, reloadAll, opened, home, base, INBOX_LIST, hint, inboxRef, readAll, writeMessage };
  },
  template: `
    <TopBar :crumbs="archive ? [env, 'Messages', 'Archive'] : [env, 'Messages']"/>
    <div class=body>
      <div class=chat>
        <div class=list>
          <ResourceList v-bind="INBOX_LIST" :archive="!!archive" :home="home" :rows="rows" :loading="messages.loading" :error="messages.error"
            :href="(r) => base + '/' + inboxRef(r)" :selected="(r) => inboxRef(r) === n">
            <template #tools>
              <button type=button class="btn toolbar-btn" @click="readAll">Mark all read</button>
              <button type=button class="btn new" title="Message the agent — space, space" :aria-description="hint" @click="writeMessage">Message the agent</button>
            </template>
          </ResourceList>
        </div>
      </div>
      <MessagePanel v-if="opened && opened.type === 'message'" :key="'message' + opened.num" :env="env" :n="opened.num" :close="base" :base="base" :reloaded="reloadAll"/>
      <QuestionPanel v-else-if="opened && opened.type === 'question'" :key="'question' + opened.num" :env="env" :n="opened.num" :close="base" :base="base + '/q'" :reloaded="reloadAll"/>
      <SuggestionPanel v-else-if="opened && opened.type === 'suggestion'" :key="'suggestion' + opened.num" :env="env" :n="opened.num" :close="base" :base="base + '/s'" :reloaded="reloadAll"/>
      <ReplyPanel v-else-if="opened && opened.type === 'reply'" :key="'reply' + opened.num" :env="env" :n="opened.num" :close="base" :base="base + '/r'" :reloaded="reloadAll"/>
    </div>`,
};

// docs and reports are one Documents area: the same tabs head each of their lists. Plans left it for
// a nav entry of their own, on the user's word — a plan is a document, kind of, but it is its own feature.
const DOC_TABS = [{ key: "docs", label: "Docs" }];

// the switch's last known counts per environment: each tab is its own page, so the switch mounts afresh on every
// change, and without these it would show no numbers until its fetches land and jump in width
const DOC_COUNTS = reactive({});

const DocTabs = {
  props: { env: String, current: String },
  setup(props) {
    const docs = useFetch(() => props.env && `/api/env/${props.env}/docs?archived=1`);
    const reports = useFetch(() => props.env && `/api/env/${props.env}/reports`);
    watchEffect(() => {
      if (!props.env) return;
      const kept = DOC_COUNTS[props.env] || (DOC_COUNTS[props.env] = { docs: "", reports: "" });
      if (docs.data) kept.docs = docs.data.filter((d) => !d.archived).length;
      if (reports.data) kept.reports = reports.data.length;
    });
    const counts = computed(() => DOC_COUNTS[props.env] || { docs: "", reports: "" });
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

const PLAN_STATUS = { preparing: "Being written", draft: "Draft", active: "Active", parked: "Paused", done: "Done", abandoned: "Abandoned" };

const PLAN_LIST = {
  groups: [{ key: "active", label: "Active", kind: "progress", match: (p) => p.status === "active" },
           { key: "draft", label: "Drafts", kind: "open", match: (p) => p.status === "draft" },
           // finished plans read as sections too, so nothing sits behind a separate archive view
           { key: "done", label: "Done", kind: "done", folded: true, match: (p) => p.status === "done" },
           { key: "abandoned", label: "Abandoned", kind: "withdrawn", folded: true, match: (p) => p.status === "abandoned" }],
  columns: { status: (p) => ({ active: "progress", draft: "open", done: "done", abandoned: "withdrawn" })[p.status] || "open", library: true, num: (p) => `#${p.n}`, numWidth: "34px", title: (p) => p.title, sub: (p) => p.goal, cite: (p) => `${p.phases_done} of ${p.phases_total} phases`,
             age: (p) => shortAge(p.age), ageWidth: "52px", struck: (p) => p.status === "abandoned" },
  count: (rows) => `${rows.filter((p) => p.status === "active" || p.status === "draft").length} plans`, name: "plans",
  empty: "No plans on this environment yet.",
};

// a plan's links are written "doc 4.2" and "report 1"; refHref reads "doc:4.2"
function planRefHref(ref, env) { return refHref(String(ref).replace(" ", ":"), env); }

function planStepState(ph) { return ph.complete ? "Complete" : ph.current ? "Current" : "Not started"; }

// ONE PLACE DECIDES WHAT A PLAN IS WAITING FOR. The page's band, the peek panel and the home card each
// asked that question and answered it in a different vocabulary — the page said "Approve the plan" where
// the card said "Start", and the panel had never heard of a paused or finished plan at all.
// `label` is the sentence a page or panel shows; `short` is the one word a card has room for.
function planPrimary(p) {
  if (!p) return null;
  if (p.held) {
    return { label: "Continue past the checkpoint", short: "Continue", verb: "proceed",
             note: "The phase before this one is complete and the plan stopped for you to look. The agent starts the next phase.",
             hint: "The plan is waiting at a checkpoint for you" };
  }
  if (p.status === "draft") {
    return { label: "Approve the plan", short: "Start", verb: "activate",
             note: "The agent is assigned this plan and starts its first phase. One plan at a time.",
             hint: "Start this plan and assign it to the agent" };
  }
  if (p.status === "parked") {
    return { label: "Pick this plan up again", short: "Resume", verb: "activate",
             note: "The plan becomes the one the agent is working, and its to-dos are on the list again.",
             hint: "Pick this plan up again" };
  }
  if (p.status === "done" && !p.acknowledged) {
    return { label: "Acknowledge", short: "Acknowledge", verb: "acknowledge",
             note: "You have seen that this plan finished; its card leaves the home page.",
             hint: "You have seen that this plan finished; clear it from here" };
  }
  return null;
}

const PlanPanel = {
  props: PANEL_PROPS,
  components: { Panel, ActionBar, FromMessages, Comments, Icon },
  setup(props) {
    // folded by default, because the panel is a QUICK look at where the plan stands; the phase you
    // open is the one you are asking about
    const shown = ref(new Set());
    const fold = (p) => {
      const next = new Set(shown.value);
      next.has(p) ? next.delete(p) : next.add(p);
      shown.value = next;
    };
    const api = computed(() => `/api/env/${props.env}/plans`);
    const item = useFetch(() => props.env && props.n && `${api.value}/${props.n}`);
    const actions = computed(() => {
      const p = item.data;
      if (!p || p.status === "abandoned") return [];
      const url = `${api.value}/${p.n}`;
      const act = planPrimary(p);
      return [
        ...(act ? [{ label: act.label, primary: true, advance: true, method: "POST", url: `${url}/${act.verb}`,
                     submit: act.label, note: act.note }] : []),
        // a finished plan is the record of what was done: it is acknowledged, never abandoned
        ...(p.status === "done" ? [] : [{ label: "Abandon", method: "DELETE", url, danger: true, submit: "Abandon",
                                         fields: [{ name: "why", label: "Why the plan is stopped" }] }]),
      ];
    });
    const done = panelDone(props, item);
    return { item, actions, done, shown, fold, PLAN_STATUS };
  },
  template: `
    <Panel :label="'Plan ' + n" :close="close" :onClose="onClose" :link="link">
      <FetchState :state="item"/>
      <template v-if="item.data">
        <h2 class=panel-title>{{ item.data.title }}</h2>
        <dl class=props>
          <dt>Type</dt><dd>Plan — ends with the work</dd>
          <dt>Status</dt><dd>{{ PLAN_STATUS[item.data.status] }}, {{ item.data.phases_done }} of {{ item.data.phases_total }} phases</dd>
          <dt>Goal</dt><dd>{{ item.data.goal || '—' }}</dd>
          <template v-if="item.data.from_doc"><dt>From</dt><dd><RefChip :to="'#/docs/' + item.data.from_doc" :label="'Doc ' + item.data.from_doc"/></dd></template>
          <dt>{{ item.data.status === 'done' ? 'Ended' : 'Drafted' }}</dt><dd>{{ item.data.age || 'just now' }}</dd>
        </dl>
        <ActionBar :actions="actions" :done="done" :key="'plan' + item.data.n + item.data.status"/>
        <div v-if="item.data.phases && item.data.phases.length">
          <p class=section-label>Phases</p>
          <div class=plan-panel-phases>
            <template v-for="ph in item.data.phases" :key="ph.p">
              <button type=button class="plan-panel-phase open" :aria-expanded="shown.has(ph.p) ? 'true' : 'false'"
                :title="shown.has(ph.p) ? 'Hide its to-dos' : 'Show its to-dos'" @click="fold(ph.p)">
                <Icon :name="shown.has(ph.p) ? 'down' : 'arrow'"/>
                <span class=phase-num>{{ ph.p }}</span><span class=plan-panel-phase-title>{{ ph.title }}</span>
                <span class=muted>{{ ph.todos.filter((t) => t.done).length }} of {{ ph.todos.length }} done</span>
              </button>
              <div v-if="shown.has(ph.p)" class=plan-panel-rows>
                <p v-if="ph.when" class=plan-panel-when>complete when {{ ph.when }}</p>
                <a v-for="t in ph.todos" :key="t.n" class=plan-panel-row
                  :href="'#/env/' + env + '/todos/' + t.n" @click="$openRef($event, '#/env/' + env + '/todos/' + t.n)">
                  <span :class="['needs-dot', {live: !t.done}]"></span>
                  <span :class="['plan-panel-row-title', {done: t.done}]">{{ t.title || ('to-do ' + t.n) }}</span>
                  <span class=muted>#{{ t.n }}</span>
                </a>
                <p v-if="!ph.todos.length" class=plan-panel-when>no to-dos yet</p>
              </div>
            </template>
          </div>
        </div>
        <div v-if="item.data.body"><p class=section-label>Approach</p><div class="md prose" v-html="$md(item.data.body)"></div></div>
        <Comments :about="'plan ' + item.data.n" :env="env" :key="'c-plan' + item.data.n"/>
      </template>
    </Panel>`,
};

const Plans = {
  props: ["env", "archive", "n"],
  components: { TopBar, Panel, ActionBar, ResourceList, StatusIcon, TodoPanel, PlanPanel, Icon, ProgressBar, FromMessages, Comments },
  setup(props) {
    const api = computed(() => `/api/env/${props.env}/plans`);
    const home = computed(() => `#/env/${props.env}/plans`);
    const base = computed(() => home.value + (props.archive || ""));
    const reading = computed(() => props.n && props.n !== "new");
    const list = useFetch(() => props.env && `${api.value}?all=1`);
    const item = useFetch(() => props.env && reading.value && `${api.value}/${props.n}`);
    // the assigned plan has a page, and so does a draft: a plan you are being asked to approve is the one you most need to read in full
    // EVERY plan opens on its own page, finished ones included: a plan that is done is the record of
    // what was done, and excluding it sent its own link to the list instead (and the switcher offers it).
    const onPage = computed(() => reading.value);
    const todos = useFetch(() => props.env && onPage.value && `/api/env/${props.env}/todos?all=1`);
    // the viewer cannot start an agent, so planning together is a message: the agent asks back with questions to click
    const creating = computed(() => [{
      label: "Plan it with the agent", method: "POST", url: `/api/env/${props.env}/messages`, submit: "Send to the agent", leave: true,
      fields: [{ name: "wish", label: "What do you want to achieve?", kind: "area",
                 placeholder: "In your own words, as rough as you like. The agent asks back until the goal is clear." }],
      note: "The agent asks you questions, each with answers to pick or your own words, then drafts the plan for you to approve.",
      // the plan appears the instant you ask: a placeholder the agent then writes into, so the request
      // is visibly in flight rather than nothing until the questions are done
      also: ({ wish }) => ({ url: api.value, body: { title: "To be determined", goal: (wish || "").trim() || "to be shaped with the agent", preparing: true } }),
      shape: ({ wish }) => ({ files: [], text: `Plan with me: I want to start a new plan on this environment. What I want to achieve, roughly: ${(wish || "").trim() || "(not sure yet, help me find it)"}\n\nShape the goal with me first. Ask me one question at a time with \`journal questions add "<question>" --option="<answer>" --option="<answer>"\`, so I can pick an answer or write my own, and keep going until the goal is clear. Then draft the plan with \`journal plans add\`, its phases and their to-dos, and tell me it is ready to approve.` }),
    }, {
      label: "Write it myself", method: "POST", url: api.value, submit: "Save draft", leave: true,
      fields: [{ name: "title", label: "Title" }, { name: "goal", label: "Goal", placeholder: "What is true when the plan is done" },
               { name: "body", label: "Approach (optional)", kind: "area" }],
      note: "A plan starts as a draft. Add its phases and to-dos, then approve it.",
    }]);
    const actions = computed(() => {
      const p = item.data;
      if (!p || p.status !== "active") return [];
      const url = `${api.value}/${p.n}`;
      return [
        { label: "Add phase", method: "POST", url: `${url}/phase`, submit: "Add phase",
          fields: [{ name: "title", label: "Title" }, { name: "when", label: "Complete when (optional)" }] },
        { label: "Add to-dos", method: "POST", url: `${url}/todos`, submit: "Add",
          fields: [{ name: "phase", label: "Phase number" }, { name: "todos", label: "To-do numbers", placeholder: "4, 5, 6" },
                   { name: "reopen", label: "Why, if the phase is already complete (optional)" }] },
        { label: "Link", method: "POST", url: `${url}/link`, submit: "Link",
          fields: [{ name: "ref", label: "Document or report", placeholder: "doc 4.2 or report 1" }] },
        // pausing is parking: the plan stays where it is, its to-dos are held, and the slot is free
        { label: "Pause this plan", method: "POST", url: `${url}/park`, submit: "Pause the plan",
          note: "The agent stops picking up this plan's to-dos. The plan keeps its phases and what is done; you start it again from here.",
          fields: [{ name: "why", label: "Why it is paused" }] },
        { label: "Abandon", method: "DELETE", url, danger: true, submit: "Abandon",
          fields: [{ name: "why", label: "Why the plan is stopped" }] },
      ];
    });
    const done = (body, a) => settle(body, a, onPage.value ? "" : base.value, list, item);
    // the card carries adding a phase, beside the primary action; the row below carries the rest
    const rest = computed(() => actions.value.filter((a) => a.label !== "Add phase"));
    // adding a phase opens a sheet with both routes: write it here, or hand the agent a sentence and let it draft one.
    // the viewer cannot draft anything itself, so the second route is a message, the same funnel as Ask for suggestions.
    const phaseSheet = ref(null);
    const openPhase = () => { if (phaseSheet.value) phaseSheet.value.showModal(); };
    const closePhase = () => { if (phaseSheet.value) phaseSheet.value.close(); };
    const phaseRoutes = computed(() => {
      const p = item.data;
      if (!p) return [];
      return [
        { label: "Write it", primary: true, method: "POST", url: `${api.value}/${p.n}/phase`, submit: "Add phase",
          fields: [{ name: "title", label: "Title" }, { name: "when", label: "Complete when (optional)" },
                   { name: "checkpoint", label: "Stop here for you to look", kind: "select",
                     value: "no", options: [{ value: "no", label: "No" }, { value: "yes", label: "Yes, a checkpoint" }] }],
          shape: (v) => ({ title: v.title, when: v.when, checkpoint: v.checkpoint === "yes" }) },
        { label: "Ask the agent to draft it", method: "POST", url: `/api/env/${props.env}/messages`, submit: "Send to the agent",
          fields: [{ name: "text", label: "What the phase is for", kind: "area",
                     placeholder: "Say what this phase should cover. The agent writes the phase and puts to-dos in it." }],
          note: "The agent gets this as a message and adds the phase itself.",
          shape: ({ text }) => ({ files: [], text: `Please add a phase to plan ${p.n} (${p.title}): ${(text || "").trim()}`
            + "\n\nWrite the phase with `journal plans phase`, and put the to-dos it needs in it." }) },
      ];
    });
    const phaseDone = (body, a) => { closePhase(); done(body, a); };
    const leaveNew = () => { changed(); location.hash = base.value; };
    // a to-do row on the plan opens in the inspector over the plan, stepping through the plan's to-dos
    const todoView = reactive({ n: 0 });
    const planTodos = computed(() => (item.data && item.data.phases ? item.data.phases.flatMap((ph) => ph.todos) : []));
    const trailOwner = {};
    watchEffect(() => {
      if (!onPage.value) {
        if (INSPECTOR_TRAIL.owner === trailOwner) Object.assign(INSPECTOR_TRAIL, { owner: null, items: [], current: null });
        return;
      }
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
      return { phases: `${p.phases_done} of ${p.phases_total} phases complete`, todos: `${finished} of ${planTodos.value.length} to-dos done` };
    });
    // THE BAND CARRIES THE ONE ACT THE PLAN IS WAITING FOR, and `planPrimary` is what decides it here,
    // in the peek panel and on the home card alike.
    const primary = computed(() => {
      const p = item.data;
      const act = planPrimary(p);
      if (!act) return null;
      return { label: act.label, hint: act.hint,
               go: () => send("POST", `${api.value}/${p.n}/${act.verb}`)
                 .then(() => { item.reload(); list.reload(); changed(); }) };
    });
    const quiet = computed(() => (item.data && item.data.current ? `Working phase ${item.data.current}` : ""));
    const citedDocs = useFetch(() => props.env && onPage.value && `/api/env/${props.env}/docs?archived=1`);
    const citedReports = useFetch(() => props.env && onPage.value && `/api/env/${props.env}/reports?all=1`);
    const cites = computed(() => ((item.data && item.data.refs) || []).map((ref) => {
      const [kind, num] = ref.split(" ");
      // a transcript is in neither pool: nothing catalogues one, so its ref is its own title
      const pool = kind === "doc" ? citedDocs.data : kind === "report" ? citedReports.data : null;
      const got = (pool || []).find((x) => x.n === Number(String(num).split(".")[0]));
      return { ref, label: `${TYPES[kind].label} ${num}`, title: got ? got.title : ref, tint: TYPES[kind].tint, href: planRefHref(ref, props.env) };
    }));
    const doneCount = (ph) => ph.todos.filter((t) => t.done).length;
    // each to-do on a phase shows its real state: in progress, waiting on you, blocked, done or open
    const TODO_WORD = { progress: "In progress", waiting: "Waiting on you", blocked: "Blocked", done: "Done", open: "Open" };
    const todoState = (t) => {
      if (t.done) return "done";
      const got = (todos.data || []).find((x) => x.n === t.n);
      return got ? todoStatus(got) : "open";
    };
    const meta = computed(() => {
      const p = item.data;
      if (!p) return "";
      const when = p.status === "done" ? "ended" : p.status === "abandoned" ? "stopped" : "drafted";
      return [`plan ${p.n}`, p.from_doc ? `from doc ${p.from_doc}` : "", `${when} ${p.age || "just now"}`].filter(Boolean).join(" · ");
    });
    return { list, item, reading, onPage, creating, actions, rest, done, phaseSheet, openPhase, closePhase, phaseRoutes, phaseDone, planTodos, leaveNew, api, home, base, todoView, openTodo, closeTodo, progress, primary, quiet, cites, PLAN_LIST, doneCount, planStepState, planRefHref, todoState, TODO_WORD, meta, PLAN_STATUS };
  },
  template: `
    <template v-if="onPage">
      <TopBar :crumbs="[env, 'Plans', '#' + n]"><a class=btn :href="base">All plans</a></TopBar>
      <div class=body><div class=page><div class=plan-screen>
        <FetchState :state="item"/>
        <template v-if="item.data">
          <div class=plan-top>
            <div class=plan-top-meta>
              <span :class="['plan-assigned', {quiet: item.data.status !== 'active'}]">{{ item.data.status === 'active' ? 'Assigned to the agent' : PLAN_STATUS[item.data.status] }}</span>
              <span class=muted>{{ meta }}</span>
            </div>
            <h1 class=plan-title>{{ item.data.title }}</h1>
            <p class=plan-goal><span class=muted>Goal — </span>{{ item.data.goal }}</p>
          </div>
          <!-- a plan being written has no phases yet, so a 0 of 0 band measures nothing and says nothing -->
          <div v-if="item.data.status !== 'preparing'" class=plan-progress>
            <div class=plan-progress-text>
              <div class=plan-progress-line><b>{{ progress.phases }}</b><span class=muted>· {{ progress.todos }}</span></div>
              <ProgressBar :rows="planTodos"/>
              <p v-if="item.data.status === 'parked' && item.data.parked_why" class=plan-paused-why>Paused: {{ item.data.parked_why }}</p>
            </div>
            <div class=plan-progress-actions>
              <button v-if="primary" type=button class=band-primary :title="primary.hint" @click="primary.go">{{ primary.label }}<Icon name="arrow"/></button>
              <span v-else-if="quiet" class=plan-quiet>{{ quiet }}</span>
              <button v-if="item.data.status === 'active'" type=button class=btn @click="openPhase">Add phase</button>
            </div>
          </div>
          <ActionBar :actions="rest" :done="done" :key="'plan' + item.data.n + item.data.status + (item.data.held || '') + item.data.auto"/>
          <dialog ref=phaseSheet class=sheet @click.self="closePhase">
            <div class=help-head><span>Add a phase to plan {{ item.data.n }}</span>
              <button type=button class=icon-btn title="Close" aria-label="Close" @click="closePhase"><Icon name="close"/></button></div>
            <div class=sheet-body>
              <p class="prose muted">Write the phase yourself, or say what it is for and let the agent draft it.</p>
              <ActionBar :actions="phaseRoutes" :done="phaseDone" :key="'phase' + item.data.n"/>
            </div>
          </dialog>
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
            <div v-for="t in ph.todos" :key="t.n" :class="['phase-todo', {sel: todoView.n === t.n}]"
              role=button :tabindex="0" :aria-label="'To-do ' + t.n + ': ' + (t.title || 'archived')"
              @click="openTodo(t)" @keydown.enter.self.prevent="openTodo(t)" @keydown.space.self.prevent="openTodo(t)">
              <StatusIcon :kind="todoState(t)"/>
              <span class=phase-todo-n>#{{ t.n }}</span>
              <span :class="['phase-todo-title', {done: t.done}]">{{ t.title || 'archived' }}</span>
              <span class=phase-todo-state>{{ TODO_WORD[todoState(t)] }}</span>
            </div>
            <p v-if="!ph.todos.length" class="muted phase-empty">No to-dos yet</p>
          </section>
          <p v-if="!item.data.phases.length" class=muted>{{ item.data.status === 'preparing' ? 'The agent is writing this plan; its phases are being added.' : 'No phases yet.' }}</p>
          <FromMessages :rows="item.data.from_messages" :env="env"/>
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
          <Comments :about="'plan ' + item.data.n" :env="env" :key="'c-planpage' + item.data.n"/>
        </template>
      </div></div></div>
      <TodoPanel v-if="todoView.n" :key="'todo' + todoView.n" :env="env" :n="todoView.n" :onClose="closeTodo" :link="'#/env/' + env + '/todos/' + todoView.n" :reloaded="item.reload"/>
    </template>
    <template v-else>
      <TopBar :crumbs="archive ? [env, 'Plans', 'Archive'] : [env, 'Plans']"/>
      <div class=body>
        <div class=list>
          <ResourceList v-bind="PLAN_LIST" :archive="!!archive" :home="home" :rows="list.data" :loading="list.loading" :error="list.error"
            :href="(p) => base + '/' + p.n" :selected="(p) => String(p.n) === String(n)">
            <template #tools><a class="btn new" :href="home + '/new'">New plan</a></template>
          </ResourceList>
        </div>
        <Panel v-if="n === 'new'" label="New plan" :close="base">
          <ActionBar :actions="creating" :done="(body, a) => (a.url === api ? done(body, a) : leaveNew())"/>
        </Panel>
        <PlanPanel v-else-if="reading" :key="'plan' + n" :env="env" :n="n" :close="base" :base="base" :reloaded="list.reload"/>
      </div>
    </template>`,
};

const REPORT_LIST = {
  groups: [{ key: "reports", label: "Listed", kind: "open", match: (r) => !r.archived },
           // archived reports read as a section, like a doc's do: not `closed`, which would hide the older ones behind an archive view
           { key: "archived", label: "Archived", kind: "withdrawn", folded: true, match: (r) => r.archived }],
  // a report within two days of aging off the list shows its age in amber
  columns: { status: (r) => (r.archived ? "withdrawn" : "open"), library: true, num: (r) => `#${r.n}`, numWidth: "34px", title: (r) => r.title, sub: (r) => r.gist, cite: (r) => r.about_label, age: (r) => shortAge(r.age), ageWidth: "52px",
             ageWarn: (r) => r.ages_out_in !== null && r.ages_out_in !== undefined && r.ages_out_in <= 2,
             struck: (r) => r.archived },
  count: (rows) => `${rows.filter((r) => !r.archived).length} reports`, name: "reports",
  empty: "No reports on this environment yet.",
};

// ONE REPORT, ONE COMPONENT. What it says, what can be done with it and the fact that opening
// it counts as reading it were written twice — once for the inspector and once for the page —
// and the two copies had already drifted into different keys for the same thing. The panel and
// the page differ in their frame and in where an action leaves you, and in nothing else, so
// that is all each of them holds.
const ReportBody = {
  props: { env: String, n: [String, Number], done: Function, title: { type: String, default: "panel-title" } },
  components: { ActionBar, Comments, RefChip, FetchState },
  setup(props) {
    const api = computed(() => `/api/env/${props.env}/reports`);
    const item = useFetch(() => props.env && props.n && `${api.value}/${props.n}`);
    const actions = computed(() => {
      const r = item.data;
      if (!r || r.archived) return [];
      return [
        { label: "Turn into a doc", primary: true, method: "POST", url: `${api.value}/${r.n}/todoc`, submit: "Turn into a doc",
          note: "A document is made from this report and kept for good; the report is archived.",
          follow: (body) => (body.data && body.data.doc ? `#/docs/${body.data.doc}` : null) },
        { label: "Archive", method: "DELETE", url: `${api.value}/${r.n}`, danger: true, submit: "Archive",
          fields: [{ name: "why", label: "Why it is taken off the list" }] },
      ];
    });
    // opening a report is the user reading it: the home stops asking, the same way a question does
    let marked = false;
    watch(() => item.data, (r) => {
      if (marked || !r || r.seen || r.archived) return;
      marked = true;
      postJSON(`${api.value}/${r.n}/seen`, {}).then(() => changed()).catch(() => { marked = false; });
    }, { immediate: true });
    return { item, actions, settled: (body, a) => props.done(body, a, item) };
  },
  template: `
    <FetchState :state="item"/>
    <template v-if="item.data">
      <component :is="title === 'p-title' ? 'h1' : 'h2'" :class="title">{{ item.data.title }}</component>
      <dl class=props>
        <dt>Type</dt><dd>Report — ages out<template v-if="!item.data.archived && item.data.ages_out_in !== null && item.data.ages_out_in !== undefined"> in {{ item.data.ages_out_in }} {{ item.data.ages_out_in === 1 ? 'day' : 'days' }}</template></dd>
        <dt>Written</dt><dd>{{ item.data.age || 'just now' }}</dd>
        <dt>For</dt><dd><RefChip v-if="item.data.about && $refHref(item.data.about, env)" :to="$refHref(item.data.about, env)" :label="item.data.about_label"/><span v-else class=muted>—</span></dd>
        <template v-if="item.data.archived"><dt>Archived</dt><dd>{{ item.data.archived }}</dd></template>
        <template v-if="item.data.doc"><dt>Document</dt><dd><RefChip :to="'#/docs/' + item.data.doc" :label="'Doc ' + item.data.doc"/></dd></template>
      </dl>
      <ActionBar :actions="actions" :done="settled" :key="'report' + item.data.n + (item.data.archived ? 'x' : '')"/>
      <div class="md prose" v-html="$md(item.data.body)"></div>
      <Comments :about="'report ' + item.data.n" :env="env" :key="'c-report' + item.data.n"/>
    </template>`,
};

const ReportPanel = {
  props: PANEL_PROPS,
  components: { Panel, ReportBody },
  setup(props) {
    return { done: (body, a, item) => panelDone(props, item)(body, a) };
  },
  template: `
    <Panel :label="'Report ' + n" :close="close" :onClose="onClose" :link="link">
      <ReportBody :env="env" :n="n" :done="done"/>
    </Panel>`,
};

// a report read full width, the way a doc is: the panel stays for a quick look from the home queue
const ReportDetail = {
  props: ["env", "n"],
  components: { TopBar, ReportBody },
  setup(props) {
    return { done: (body, a) => { changed(); if (a.label === "Archive") location.hash = `#/env/${props.env}/reports`; } };
  },
  template: `
    <TopBar :crumbs="[env, 'Reports', '#' + n]"/>
    <div class=body><div class=page>
      <div class=page-inner><ReportBody :env="env" :n="n" :done="done" title="p-title"/></div>
    </div></div>`,
};


const Reports = {
  props: ["env", "archive", "n"],
  components: { TopBar, Panel, ActionBar, ResourceList, ReportPanel },
  setup(props) {
    const api = computed(() => `/api/env/${props.env}/reports`);
    const home = computed(() => `#/env/${props.env}/reports`);
    const base = computed(() => home.value + (props.archive || ""));
    const reading = computed(() => props.n && props.n !== "new");
    const list = useFetch(() => props.env && `${api.value}?all=1`);
    const creating = computed(() => [{
      label: "New report", method: "POST", url: api.value, submit: "Add report", leave: true,
      fields: [{ name: "title", label: "Title" }, { name: "body", label: "Text", kind: "area" },
               { name: "about", label: "For (optional)", placeholder: "todo 22 or question 4" }],
    }]);
    const done = (body, a) => settle(body, a, base.value, list);
    return { list, reading, creating, done, home, base, REPORT_LIST };
  },
  template: `
    <TopBar :crumbs="archive ? [env, 'Reports', 'Archive'] : [env, 'Reports']"/>
    <div class=body>
      <div class=list>
        <div class=doc-head><span class=doc-head-grow></span><span class=doc-head-new><a class="btn new" :href="home + '/new'">New report</a></span></div>
        <ResourceList v-bind="REPORT_LIST" :bar="false" :archive="!!archive" :home="home" :rows="list.data" :loading="list.loading" :error="list.error"
          :href="(r) => base + '/' + r.n" :selected="(r) => String(r.n) === String(n)"/>
      </div>
      <Panel v-if="n === 'new'" label="New report" :close="base">
        <ActionBar :actions="creating" open="New report" :done="done"/>
      </Panel>
      <ReportPanel v-else-if="reading" :key="'report' + n" :env="env" :n="n" :close="base" :base="base" :reloaded="list.reload"/>
    </div>`,
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
      label: "Ask for a coding style review", method: "POST", url: `/api/env/${props.env}/messages`, submit: "Send to the agent", leave: true,
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

const ReminderPanel = {
  props: PANEL_PROPS,
  components: { Panel, ActionBar, FromMessages, Comments, FetchState },
  setup(props) {
    const api = computed(() => `/api/env/${props.env}/reminders`);
    const item = useFetch(() => props.env && props.n && `${api.value}/${props.n}`);
    const envs = useEnvironments(() => props.env);
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
    const done = (body, a) => { settle(body, a, props.base || props.close, item); if (props.reloaded) props.reloaded(); };
    return { item, actions, done, page: computed(() => `#/env/${props.env}/reminders/${props.n}`) };
  },
  template: `
    <Panel :label="'Reminder ' + n" :close="close" :onClose="onClose" :link="link || page">
      <FetchState :state="item"/>
      <template v-if="item.data">
        <h2 class=p-title>{{ item.data.text }}</h2>
        <dl class=props>
          <dt>Until</dt><dd>{{ item.data.until || 'It is never retired on its own' }}</dd>
          <dt>Facts</dt><dd>{{ item.data.meta || '—' }}</dd>
        </dl>
        <ActionBar :actions="actions" :done="done" :key="'reminder' + item.data.n + (item.data.struck ? 'x' : '')"/>
        <FromMessages :rows="item.data.from_messages" :env="env"/>
        <Comments :about="'reminder ' + item.data.n" :env="env" :key="'c-reminder' + item.data.n"/>
      </template>
    </Panel>`,
};

const Reminders = {
  props: ["env", "archive", "n"],
  components: { TopBar, Panel, ActionBar, ResourceList, FromMessages, Comments, ReminderPanel },
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
      <ReminderPanel v-else-if="n" :key="'reminder' + n" :env="env" :n="n" :close="base" :base="base" :reloaded="list.reload"/>
    </div>`,
};

// ─────────────────────────────────────────────────────────────── docs
// archiving a doc asks why; the doc page and the inspector share this one action
function docArchiveAction(url, extra = {}) {
  return { label: "Archive", method: "POST", url: `${url}/archive`, danger: true, submit: "Archive",
           fields: [{ name: "why", label: "Why it is no longer needed" }], ...extra };
}

// a doc opened from an environment's Documents list: read in the inspector, edited on its own page
const DocPanel = {
  props: PANEL_PROPS,
  components: { Panel, ActionBar },
  setup(props) {
    const item = useFetch(() => props.n && `/api/docs/${props.n}`);
    const actions = computed(() => (item.data && !item.data.archived ? [docArchiveAction(`/api/docs/${item.data.n}`, { advance: true })] : []));
    const done = panelDone(props, item);
    const state = computed(() => {
      const d = item.data;
      if (!d) return "";
      return d.superseded_by ? `Superseded by doc ${d.superseded_by}` : d.archived ? "Archived" : d.status === "final" ? "Final" : "Draft";
    });
    return { item, state, actions, done };
  },
  template: `
    <Panel :label="'Doc ' + n" :close="close" :onClose="onClose" :link="link">
      <FetchState :state="item"/>
      <template v-if="item.data">
        <h2 class=panel-title>{{ item.data.title }}</h2>
        <dl class=props>
          <dt>Type</dt><dd>Doc — kept for good</dd>
          <dt>Status</dt><dd>{{ state }}</dd>
          <dt>Written</dt><dd>{{ item.data.age || 'just now' }}</dd>
          <dt>Parts</dt><dd>{{ (item.data.parts || []).length || '—' }}</dd>
          <dt>Cited by</dt><dd>{{ (item.data.cited_by || []).length ? item.data.cited_by.length + ((item.data.cited_by.length === 1) ? ' entry' : ' entries') : '—' }}</dd>
        </dl>
        <p v-if="!item.data.archived && (item.data.cited_by || []).length" class="prose muted">Still cited by {{ item.data.cited_by.length }} {{ item.data.cited_by.length === 1 ? 'entry' : 'entries' }}; archiving takes it off the list, and those citations stay.</p>
        <ActionBar :actions="actions" :done="done" :key="'doc' + item.data.n + (item.data.archived ? 'x' : '')"/>
        <p v-if="item.data.abstract" class="prose muted">{{ item.data.abstract }}</p>
        <div v-if="item.data.body" class="md prose" v-html="$md(item.data.body)"></div>
        <div v-if="(item.data.parts || []).length">
          <p class=section-label>Parts</p>
          <div class=plan-panel-phases>
            <a v-for="p in item.data.parts" :key="p.p" class=plan-panel-phase :href="'#/docs/' + item.data.n + '.' + p.p">
              <span class=muted>{{ item.data.n }}.{{ p.p }}</span><span class=plan-panel-phase-title>{{ p.title }}</span></a>
          </div>
        </div>
      </template>
    </Panel>`,
};

function docList({ crumbs, url, base, empty }) {
  return {
    props: ["env", "n"],
    components: { TopBar, ActionBar, ResourceList, DocTabs, DocPanel },
    setup(props) {
      const s = useFetch(() => url(props));
      // every document at once: DOC_LIST puts the archived ones in their own folded section, so nothing
      // needs a second view to reach — and two controls no longer drive one hidden flag
      const rows = computed(() => s.data);
      const creating = computed(() => [{
        label: "New doc", method: "POST", url: url(props), submit: "Add doc", leave: true,
        follow: (body) => { const m = /doc (\d+)/.exec(body.message || ""); return m ? `#/docs/${m[1]}` : null; },
        fields: [{ name: "title", label: "Title" }, { name: "abstract", label: "Abstract, in one line" },
                 { name: "body", label: "Text", kind: "area" }],
      }]);
      const done = (body, a) => settle(body, a, base(props), s);
      return { s, rows, creating, done, crumbs: computed(() => crumbs(props)), base: computed(() => base(props)), empty, DOC_LIST };
    },
    template: `
      <TopBar :crumbs="crumbs"/>
      <div class=body><div class=list>
        <div v-if="n === 'new'" class=compose-wrap><ActionBar :actions="creating" open="New doc" :done="done"/></div>
        <DocTabs v-if="env" :env="env" current="docs">
          <a class=viewbar-archive :href="base.slice(0, -4) + 'files'">Files</a>
          <template #new><a class="btn new" :href="base + '/new'">New document</a></template>
        </DocTabs>
        <ResourceList v-bind="DOC_LIST" :bar="!env" :empty="empty" :rows="rows"
          :loading="s.loading" :error="s.error" :href="(d) => (env ? base + '/' + d.n : '#/docs/' + d.n)" :selected="(d) => String(d.n) === String(n)">
          <template #tools>
            <a v-if="base.startsWith('#/env/')" class=btn :href="base.slice(0, -4) + 'files'">Files</a>
            <a class="btn new" :href="base + '/new'">New doc</a>
          </template>
        </ResourceList>
      </div></div>
      <DocPanel v-if="env && n && n !== 'new'" :key="'doc' + n" :env="env" :n="n" :close="base" :base="base" :link="'#/docs/' + n" :reloaded="s.reload"/>`,
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
        ...(d.archived ? [] : [docArchiveAction(url)]),
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
    return { s, restParts, citedHref, actions, done, fileUrl, openFile, isImage, envs, editing, startEdit, cancelEdit, saveEdit };
  },
  template: `
    <TopBar :crumbs="['Documents', s.data ? '#' + s.data.n : docref]"/>
    <div class=page>
      <FetchState :state="s" loading="Loading…"/>
      <div v-if="s.data" class=page-inner>
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
              <a v-for="f in a.files" :key="f" class=file-row :href="fileUrl(s.data.n, a.name + '/' + f)"
                @click="openFile($event, { url: fileUrl(s.data.n, a.name + '/' + f), name: f, from: 'Doc ' + s.data.n })">
                <Icon name="docs"/><span class=file-name>{{ f }}</span>
              </a>
            </details>
            <div v-else class=file>
              <a class=file-row :href="fileUrl(s.data.n, a.name)"
                @click="openFile($event, { url: fileUrl(s.data.n, a.name), name: a.name, from: 'Doc ' + s.data.n })">
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
// a subagent belongs to the agent, not to a section of its own: this is the panel its line under the facts opens
const SubagentPanel = {
  props: ["env", "n", "close", "onClose", "link"],
  components: { Panel },
  setup(props) {
    const about = useFetch(() => props.env && props.n && `/api/env/${props.env}/agent?kind=subagent&agent=${props.n}`);
    return { about, AGENT_STATUS };
  },
  template: `
    <Panel :label="'Subagent ' + n" :close="close" :onClose="onClose" :link="link">
      <FetchState :state="about"/>
      <template v-if="about.data">
        <h2 class=p-title>{{ about.data.name }}</h2>
        <dl class=props>
          <dt>State</dt><dd>{{ AGENT_STATUS[about.data.status] || about.data.status }}</dd>
          <dt>Model</dt><dd>{{ about.data.model || 'not recorded' }}</dd>
          <dt>Dispatched by</dt><dd><SessionChip :env="env" :id="about.data.parent"/></dd>
          <dt>Last wrote</dt><dd>{{ about.data.seen || 'nothing yet' }}</dd>
        </dl>
        <div>
          <p class=section-label>{{ about.data.status === 'working' ? 'What it has reported so far' : 'What it reported' }}</p>
          <p v-if="about.data.said" class=prose>{{ about.data.said }}</p>
          <p v-else class="prose muted">It has not written anything yet.</p>
        </div>
      </template>
    </Panel>`,
};

const PEEK = {
  todo: { panel: "TodoPanel", page: (env, n) => `#/env/${env}/todos/${n}` },
  message: { panel: "MessagePanel", page: (env, n) => `#/env/${env}/messages/${n}` },
  reply: { panel: "ReplyPanel", page: (env, n) => `#/env/${env}/messages/r/${n}` },
  question: { panel: "QuestionPanel", page: (env, n) => `#/env/${env}/messages/q/${n}` },
  suggestion: { panel: "SuggestionPanel", page: (env, n) => `#/env/${env}/messages/s/${n}` },
  work: { panel: "WorkPanel", page: (env, n) => `#/env/${env}/work/${n}` },
  subagent: { panel: "SubagentPanel", page: (env, n) => `#/env/${env}/agents/subagent/${n}` },
  plan: { panel: "PlanPanel", page: (env, n) => `#/env/${env}/plans/${n}` },
  report: { panel: "ReportPanel", page: (env, n) => `#/env/${env}/reports/${n}` },
  pin: { panel: "PinPanel", page: (env, n) => `#/env/${env}/pins/${n}` },
  reminder: { panel: "ReminderPanel", page: (env, n) => `#/env/${env}/reminders/${n}` },
  // a doc belongs to the project rather than an environment, so its page carries no env
  doc: { panel: "DocPanel", page: (env, n) => `#/docs/${n}` },
  // a rule binds every environment, so its page carries none either
  rule: { panel: "RulePanel", page: (env, n) => `#/rules/${n}` },
};

// Home's side panel: the resource's own panel, with its header linking to the page
// the picture over the page: its own ground, blurred, and the message's other pictures one key away
const Lightbox = {
  props: { images: Array, at: Number, close: Function },
  components: { Icon },
  setup(props) {
    const i = ref(props.at || 0);
    const shown = computed(() => props.images[i.value] || null);
    const step = (by) => { i.value = (i.value + by + props.images.length) % props.images.length; };
    const onKey = (e) => {
      if (e.key === "Escape") return props.close();
      if (e.key === "ArrowRight" || e.key === "ArrowDown") { e.preventDefault(); step(1); }
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") { e.preventDefault(); step(-1); }
    };
    onMounted(() => window.addEventListener("keydown", onKey));
    onUnmounted(() => window.removeEventListener("keydown", onKey));
    return { i, shown, step };
  },
  template: `
    <div class=lightbox @click.self="close">
      <div class=lightbox-bar>
        <span class=lightbox-name>{{ shown ? shown.name : "" }}</span>
        <span v-if="images.length > 1" class=lightbox-of>{{ i + 1 }} of {{ images.length }}</span>
        <a class=lightbox-raw :href="shown ? shown.url : ''" target=_blank rel=noopener title="Open the file itself">Open</a>
        <button type=button class=lightbox-x title="Close" aria-label="Close" @click="close"><Icon name="close"/></button>
      </div>
      <button v-if="images.length > 1" type=button class="lightbox-step back" aria-label="Previous" @click.stop="step(-1)"><Icon name="up"/></button>
      <img v-if="shown" class=lightbox-img :src="shown.url" :alt="shown.name" @click.stop>
      <button v-if="images.length > 1" type=button class="lightbox-step on" aria-label="Next" @click.stop="step(1)"><Icon name="down"/></button>
    </div>`,
};

const FileReader_ = {
  props: { file: Object, close: Function },
  components: { Panel, FetchState },
  setup(props) {
    provide("overlayPanel", true);
    const text = reactive({ loading: true, error: null, body: "" });
    const name = computed(() => (props.file || {}).name || "");
    const kind = computed(() => {
      const n = name.value.toLowerCase();
      if (/\.(png|jpe?g|gif|webp|svg|avif|bmp)$/.test(n)) return "image";
      if (/\.(md|markdown)$/.test(n)) return "markdown";
      if (/\.(pdf)$/.test(n)) return "pdf";
      return "text";
    });
    watchEffect(async () => {
      const f = props.file;
      if (!f || kind.value === "image" || kind.value === "pdf") { text.loading = false; return; }
      text.loading = true;
      text.error = null;
      try {
        const res = await fetch(f.url);
        if (!res.ok) throw new Error(`The file could not be read (${res.status}).`);
        text.body = await res.text();
      } catch (e) {
        text.error = e.message;
      } finally {
        text.loading = false;
      }
    });
    return { text, name, kind };
  },
  template: `
    <Panel :label="file.from || 'File'" :close="close" :onClose="close" :link="file.url">
      <h2 class=panel-title>{{ name }}</h2>
      <img v-if="kind === 'image'" class=file-full :src="file.url" :alt="name">
      <p v-else-if="kind === 'pdf'" class="prose muted">A PDF opens best in its own tab —
        <a :href="file.url" target=_blank rel=noopener>open {{ name }}</a>.</p>
      <p v-else-if="text.loading" class=empty>Loading…</p>
      <p v-else-if="text.error" class=error>{{ text.error }}</p>
      <div v-else-if="kind === 'markdown'" class="md prose" v-html="$md(text.body)"></div>
      <pre v-else class=file-raw>{{ text.body }}</pre>
    </Panel>`,
};

const Peek = {
  props: ["env", "kind", "n", "close", "reloaded", "swap"],
  components: { TodoPanel, MessagePanel, ReplyPanel, QuestionPanel, WorkPanel, SuggestionPanel, SubagentPanel, PlanPanel, ReportPanel, DocPanel, PinPanel, RulePanel, ReminderPanel },
  // this subtree IS the overlay, so the Panel inside it stays while any panel the route mounted stands down
  setup() { provide("overlayPanel", true); return { PEEK }; },
  template: `
    <component :is="PEEK[kind].panel" :env="env" :n="n" :onClose="close" :link="PEEK[kind].page(env, n)" :reloaded="reloaded" :swap="swap"/>`,
};

// ─────────────────────────────────────────────────────────────── an environment's home
// only the WORD for where a plan stands; the act it offers comes from planPrimary
const PLAN_WORD = { preparing: "being written", active: "working", parked: "paused", draft: "ready to start", done: "finished" };

// ONE CARD, ONE FETCH. The home kept a hand-rolled cache of every plan's to-dos in a reactive object
// and guarded it by READING the same object its fetch WROTE — so every response re-triggered the
// effect that produced it. A card fetches its own plan through useFetch, which settled that question
// for every other list in this file, and brings its own error line with it.
// WHAT IS WAITING READS AS A CARD, one per kind, not a uniform row: the kind's tint lights the edge,
// a question carries more weight than the rest, and the card names the one thing to do with it.
// A CARD IN THE RAIL IS AN INDEX ENTRY, NOT A SECOND PLACE TO ACT. Clicking one moves the thread to
// the turn that raised it, so the question is answered in line with the conversation around it. Off
// the home — the Messages page, a list — there is no thread to move, and the inspector opens as before.
const THREAD_GOTO = reactive({ key: "", at: 0 });

// WHAT A QUOTE POINTS AT. A reply quotes the message it answers and an answer quotes the question
// it answers, and both of those are turns already in the thread — so the quote is a way back to
// them rather than a decoration.
function quoteAnchor(t) {
  if (!t || !t.n) return "";
  if (t.kind === "reply" || t.kind === "receipt") return `message:${t.n}`;
  if (t.kind === "answer") return `question:${t.n}`;
  return "";
}

// What a rail card scrolls to. A question or a message is its number; held work has no number,
// so it is named by the work it holds — the one thing about it that does not change.
function turnAnchor(t) {
  if (t.kind === "parked") return `parked:${t.ref}`;
  return t.n ? `${t.kind}:${t.n}` : "";
}

// THE THREAD IS THE WRITING BOX WHILE IT IS ON SCREEN. Space-space and "Message the agent" used to
// open the quick menu's own pane, which sent and closed with no visible history — the void the whole
// chat was built to end. While a thread is mounted it lends its box, and everywhere else the pane is
// still the only place to write.
const THREAD_BOX = { focus: null };

const NeedsCard = {
  props: { item: Object, selected: Boolean, dismiss: Function },
  components: { Icon },
  template: `
    <div :class="['needs-card', item.kind, {sel: selected}]" :style="{ '--tint': item.tint }"
      role=button :tabindex="0" :aria-label="item.label + ': ' + item.title"
      @click="item.open" @keydown.enter.self.prevent="item.open" @keydown.space.self.prevent="item.open">
      <div class=needs-card-top>
        <p class=needs-card-title>{{ item.title }}</p>
        <button v-if="!item.sticky" type=button class=needs-dismiss title="Dismiss" aria-label="Dismiss" @click.stop="dismiss(item)"><Icon name="close"/></button>
      </div>
      <div class=needs-card-meta><span class=needs-card-kind>{{ item.label }}</span>{{ item.meta }}</div>
      <!-- A BUTTON IS FOR AN ACT, and only a card that DOES something carries one: continuing past a
           checkpoint, starting a plan. A report you read and a question you answer are not acts, they
           are openings — and the whole card already opens, so the button was a second, louder way to
           do the one thing the card was already for. -->
      <div v-if="item.act" class=needs-card-foot>
        <button type=button class=needs-card-go @click.stop="item.act">{{ item.action }}</button>
      </div>
    </div>`,
};

const PlanCard = {
  props: { env: String, plan: Object, blocked: Boolean, reloaded: Function, peek: Function },
  components: { ProgressBar, Icon },
  setup(props) {
    const detail = useFetch(() => props.env && props.plan && `/api/env/${props.env}/plans/${props.plan.n}`);
    const rows = computed(() => ((detail.data && detail.data.phases) || []).flatMap((ph) => ph.todos));
    const error = ref("");
    // ONE PLAN IS WORKED AT A TIME, so a card does not offer a button that must be refused: starting a
    // draft or resuming a paused plan is withheld while another is active, and the card says why.
    const act = computed(() => (props.blocked ? null : planPrimary(props.plan)));
    const card = computed(() => {
      const p = props.plan;
      const done = rows.value.filter((t) => t.done).length;
      const word = PLAN_WORD[p.status] || PLAN_WORD.active;
      const phases = `${p.phases_done} of ${p.phases_total} phases`;
      return {
        ref: `plan ${p.n} · ${p.held && p.status === "active" ? "held" : word}`,
        // a draft has done nothing yet, so it says what it holds rather than how far it has gone
        progress: p.status === "draft"
          ? `${p.phases_total} ${p.phases_total === 1 ? "phase" : "phases"}${rows.value.length ? ` · ${rows.value.length} to-dos` : ""}`
          : `${phases}${rows.value.length ? ` · ${done} of ${rows.value.length} to-dos` : ""}`,
        why: [p.status === "parked" ? p.parked_why : "",
              p.status === "preparing" ? "the agent is adding its phases" : "",
              props.blocked ? "one plan at a time" : ""].filter(Boolean).join(" · "),
        bar: p.status !== "draft" && p.status !== "preparing",
      };
    });
    const run = () => {
      error.value = "";
      send("POST", `/api/env/${props.env}/plans/${props.plan.n}/${act.value.verb}`)
        .then(() => { detail.reload(); if (props.reloaded) props.reloaded(); })
        // a refusal has a reason — it belongs on the card, not thrown into the console where a button just looks dead
        .catch((e) => { error.value = e.message; });
    };
    // the card SHOWS the plan rather than leaving for it: the panel already carries the link to the
    // page, which is the "and from there you can go to the plan" half. Where there is no panel to open
    // — a page that does not host one — the link is still the right answer.
    const open = () => {
      if (props.peek) return props.peek("plan", props.plan.n);
      location.hash = `#/env/${props.env}/plans/${props.plan.n}`;
    };
    return { detail, rows, error, act, card, run, open };
  },
  template: `
    <div :class="['work-now', {ready: plan.status === 'draft', finished: plan.status === 'done', parked: plan.status === 'parked'}]"
      role=button :tabindex="0" :aria-label="'Plan ' + plan.n + ': ' + plan.title"
      @click="open" @keydown.enter.self.prevent="open" @keydown.space.self.prevent="open">
      <div class=work-now-body>
        <div class=work-now-top><span class=work-now-title>{{ plan.title }}</span></div>
        <span class=work-now-ref>{{ card.ref }}</span>
        <div class=work-now-bar>
          <ProgressBar v-if="card.bar" :rows="rows"/>
          <span class=work-now-ref>{{ card.progress }}</span>
        </div>
        <p v-if="card.why" class=work-now-why @click.stop>{{ card.why }}</p>
        <p v-if="error" class="error work-now-error" @click.stop>{{ error }}</p>
      </div>
      <div v-if="act" class=work-now-foot>
        <button type=button :class="plan.status === 'done' ? 'work-now-ack' : 'work-now-start'"
          :title="act.hint" @click.stop="run">{{ act.short }}<Icon name="arrow"/></button>
      </div>
    </div>`,
};

const PlanCards = {
  props: { env: String, plans: { type: Array, default: () => [] }, reloaded: Function, peek: Function },
  components: { PlanCard },
  setup(props) {
    const active = computed(() => props.plans.find((p) => p.status === "active") || null);
    const blocked = (p) => !!active.value && (p.status === "draft" || p.status === "parked");
    return { blocked };
  },
  template: `
    <TransitionGroup name=card appear>
      <PlanCard v-for="p in plans" :key="'plan' + p.n" :env="env" :plan="p" :blocked="blocked(p)" :reloaded="reloaded" :peek="peek"/>
    </TransitionGroup>`,
};

// The conversation on an environment: what the agent said, what you said back, and nothing either of you DID.
// The turns come from /chat, which reads the transcript and the inbox; the Activity column keeps the doing.
const Thread = {
  props: { env: String },
  components: { Compose, QuestionAnswer, Icon },
  setup(props) {
    const chat = useFetch(() => props.env && `/api/env/${props.env}/chat`);
    // the shell is known before any turn is: the thread draws its own shape while /chat is in flight,
    // so the page does not snap into place and the writing box is there to type into from the first paint
    // THE WIDTH IS ON THE TURN, NOT ON THE LINES INSIDE IT. It was the other way round, and a
    // percentage inside a shrink-to-fit bubble is circular: the user's own turns collapsed to two
    // small grey squares with nothing legible in them — "the weird text box things". A turn gets a
    // width and its lines fill it, which is what a turn actually looks like.
    const SKELETON = [{ k: 1, mine: false, w: "76%", rows: 2 }, { k: 2, mine: true, w: "54%", rows: 1 },
                      { k: 3, mine: false, w: "88%", rows: 3 }, { k: 4, mine: true, w: "40%", rows: 1 },
                      { k: 5, mine: false, w: "70%", rows: 2 }, { k: 6, mine: true, w: "62%", rows: 2 },
                      { k: 7, mine: false, w: "82%", rows: 3 }, { k: 8, mine: true, w: "48%", rows: 1 },
                      { k: 9, mine: false, w: "72%", rows: 2 }, { k: 10, mine: true, w: "58%", rows: 2 },
                      { k: 11, mine: false, w: "86%", rows: 3 }, { k: 12, mine: true, w: "44%", rows: 1 },
                      { k: 13, mine: false, w: "78%", rows: 2 }];
    const root = ref(null);
    // the key is what a turn IS, never where it sits: the thread is capped, so an index shifts for
    // every turn when one arrives, and Vue would rebuild each of them and lose what is typed in one
    // declared before `turns`, which reads it: a computed runs on the first render, and a const
    // declared further down is not merely undefined there — it throws
    const pending = ref([]);
    let sent = 0;
    const turns = computed(() => {
      // THE SERVER'S VERSION OF A PENDING TURN KEEPS THE PENDING TURN'S KEY. Otherwise the optimistic
      // one leaves and the real one enters in the same render — two animations over the same words,
      // which is the stutter — where they are the same turn and should simply be updated in place.
      const mine = new Map(pending.value.filter((t) => t.state !== "failed").map((t) => [(t.text || "").trim(), t.key]));
      // THE NOTE AND THE ANSWER ARE ONE SLOT. The journal's "Noted — created to-do 4." stands under
      // a message until the agent says something itself, and then it is gone: two turns, but one
      // place in the thread. Keyed apart, that swap is an exit and an enter over the same words,
      // with the scroll moving under both — so the note and the first agent reply to a message
      // carry the same key and are patched in place. They never both exist, so nothing collides.
      const answered = new Set();
      const real = ((chat.data && chat.data.turns) || []).map((t) => {
        const held = t.who === "you" ? mine.get((t.text || "").trim()) : null;
        const refs = (t.became_refs || []).map((r) => ({ ...r, key: String(r.ref), href: refHref(r.ref, props.env) }))
          .filter((r) => r.href);
        let slot = "";
        if (t.kind === "receipt") {
          slot = `answer:${t.n}`;
        } else if (t.kind === "reply" && t.who === "agent" && t.n && !answered.has(t.n)) {
          answered.add(t.n);
          slot = `answer:${t.n}`;
        }
        return { ...t, key: held || slot || `${t.kind}:${t.n || 0}:${t.at}`, becameRefs: refs };
      });
      // PURE. It used to write back to `pending` through nextTick, which re-triggered it — and on that
      // second pass the last turn's key changed from its pending key to its real one, destroying and
      // recreating the very element the reader was looking at. What has landed is decided in a watcher.
      const landed = new Set(real.map((t) => t.key));
      return [...real, ...pending.value.filter((t) => t.state === "failed" || !landed.has(t.key))];
    });
    const more = computed(() => (chat.data && chat.data.more) || 0);
    // a new turn lands in view, but never while the reader is scrolled up reading back: a thread
    // that yanks the page away mid-sentence is the one thing a long conversation must not do
    const near = () => {
      const box = root.value;
      return !box || box.scrollHeight - box.scrollTop - box.clientHeight < 160;
    };
    // THE LAST TURN, NEVER THE COUNT. The thread is capped, so once it is full a new turn drops the
    // oldest and the length does not move — a count would have said "nothing arrived" from then on.
    // GUARDED, LIKE EVERY OTHER READ OF t.text HERE. A turn with no text is a real turn — a
    // message that is only an attachment — and the template two screens down already says so
    // with its `alone` class. This read did not, and it throws inside the watcher that follows
    // the thread: reproduced by stubbing the response with `text` absent, three times a poll,
    // after which nothing scrolls to a new turn and nothing counts what was missed.
    const newest = (rows) => { const t = rows[rows.length - 1]; return t ? `${t.at}:${t.kind}:${t.n}:${(t.text || "").length}` : ""; };
    // ARRIVAL, NEVER FIRST PAINT. The group mounts empty and the first answer inserts a hundred and
    // twenty turns at once, which is an insert as far as Vue is concerned — so the name is empty until
    // that batch has landed, and only what comes after it animates.
    onMounted(() => {
      THREAD_BOX.focus = (draft) => {
        const area = root.value && root.value.closest(".thread") && root.value.closest(".thread").querySelector("textarea");
        if (!area) return false;
        if (draft) {
          area.value = draft;
          area.dispatchEvent(new Event("input", { bubbles: true }));
        }
        area.focus();
        area.setSelectionRange(area.value.length, area.value.length);
        return true;
      };
    });
    onUnmounted(() => { THREAD_BOX.focus = null; });
    watch(() => (chat.data && chat.data.turns) || [], (rows) => {
      if (!pending.value.length) return;
      const said = new Set(rows.filter((t) => t.who === "you").map((t) => (t.text || "").trim()));
      const left = pending.value.filter((t) => t.state === "failed" || !said.has((t.text || "").trim()));
      if (left.length !== pending.value.length) pending.value = left;
    });
    const bottom = (behavior) => {
      if (root.value) root.value.scrollTo({ top: root.value.scrollHeight, behavior });
    };
    // AN IMAGE HAS NO HEIGHT UNTIL IT LOADS, so the box is measured short and the scroll lands above
    // the bottom. The one that grew says so, and the thread finishes the journey — but only if the
    // reader is still down there, so a picture loading far above never yanks them away from what
    // they are reading.
    const grew = () => { if (near()) bottom("auto"); };
    // A WAY BACK DOWN, and it says why it is worth pressing: `near` already decides whether an arriving
    // turn follows the reader, so the same test decides when the button belongs, and what arrived while
    // they were up there is counted rather than merely hinted at.
    const away = ref(false);
    const missed = ref(0);
    const watchScroll = () => {
      const was = away.value;
      away.value = !near();
      if (was && !away.value) missed.value = 0;
    };
    const backDown = () => { missed.value = 0; bottom("auto"); };
    // WHAT IS KNOWN IS THAT IT IS WORKING, not that it is typing. A typing indicator in a chat app
    // means a person has a box open with characters in it; nothing here knows that, and claiming it
    // would be the first thing in this thread that is not true. The agent's own state is known and
    // already fetched, so that is what is shown.
    const busy = computed(() => {
      const agent = SHELL.activity && SHELL.activity.agent;
      return !!(agent && agent.working);
    });
    const settled = ref(false);
    let last = "";
    watch(turns, (rows) => {
      const key = newest(rows);
      const first = !last;
      const arrived = key && key !== last;
      const follow = first || near();
      if (arrived && !follow) missed.value += 1;
      last = key;
      if (first) nextTick(() => { settled.value = true; });
      if (!arrived || !root.value) return;
      // THE POSITION IS HELD, NOT RE-DERIVED. Every earlier attempt scrolled at what it believed was
      // the right moment and left the scroll to chance in between, which is why removing two plausible
      // causes did not stop it jumping. The box is measured before the change and put back after it:
      // pinned to the bottom if the reader was there, and otherwise kept exactly where it was with the
      // height that appeared above them added back. Nothing in between can move it.
      const wasHeight = root.value.scrollHeight;
      const wasTop = root.value.scrollTop;
      const settle = () => {
        const box = root.value;
        if (!box) return;
        if (follow) box.scrollTo({ top: box.scrollHeight, behavior: first ? "auto" : "smooth" });
        else box.scrollTop = wasTop + (box.scrollHeight - wasHeight);
      };
      nextTick(() => { settle(); requestAnimationFrame(settle); });
    });
    // REPLYING TO A TURN, and where it goes depends on what the turn IS. An agent reply already lives
    // under a message, so the answer goes there with `quoting` — which the server checks against what
    // was really said in that thread, so the quote cannot be invented. Anything else has no thread to
    // answer under, so it becomes a new message carrying the words it answers.
    const answering = ref(null);
    const replyTo = (t) => { answering.value = t; };
    const unreply = () => { answering.value = null; };
    const quoteOf = computed(() => (answering.value ? (answering.value.full || answering.value.text || "") : ""));
    // A QUOTE IS A REMINDER OF WHAT IS BEING ANSWERED, not a second copy of it — one line, cut on a
    // word. NO ELLIPSIS: the server checks the quote against what was really said, so an excerpt with
    // a character the original does not have is refused. What is stored is true; the CSS does the
    // trailing-off, which is a rendering question and not a record one.
    const QUOTE_MAX = 140;
    const excerpt = (text) => {
      const flat = String(text || "").replace(/\s+/g, " ").trim();
      if (flat.length <= QUOTE_MAX) return flat;
      const cut = flat.slice(0, QUOTE_MAX);
      const word = cut.lastIndexOf(" ");
      return (word > QUOTE_MAX / 2 ? cut.slice(0, word) : cut).trim();
    };
    // THE TURN IS IN THE THREAD BEFORE THE SERVER HAS HEARD OF IT. Pressing Enter should not wait on a
    // round trip; the send reconciles behind it. A send that FAILS says so on its own turn and hands
    // the words back, because a turn sitting there looking sent when it never arrived is the same lie
    // the send confirmation was written to stop.
    const post = async (text, files) => {
      const fix = editing.value;
      if (fix) {
        editing.value = null;
        await send("PATCH", `/api/env/${props.env}/messages/${fix.n}`, { text })
          .then(() => { chat.reload(); changed(); })
          .catch((e) => flash(e.message));
        return;
      }
      const to = answering.value;
      const said = to && !(to.who === "agent" && to.kind === "reply" && to.n)
        ? quoted(excerpt(quoteOf.value)) + text : text;
      const mine = { key: `pending:${sent += 1}`, at: new Date().toISOString(), who: "you", pending: true,
                     becameRefs: [], became: "", files: [],
                     kind: to && to.who === "agent" && to.kind === "reply" && to.n ? "reply" : "message",
                     // THE OPTIMISTIC TURN CARRIES WHAT WAS SENT, not what was typed. They differ
                     // whenever the reply quotes what it answers, and the two are matched BY TEXT to
                     // keep one key across the swap — so a quoted reply never matched, the pending
                     // turn left while the real one entered, and the same words animated twice.
                     n: to && to.kind === "reply" ? to.n : null, text: said, state: "sending",
                     ref: to && to.who === "agent" && to.kind === "reply" ? excerpt(quoteOf.value) : "" };
      pending.value = [...pending.value, mine];
      answering.value = null;
      // the watcher scrolls when the turn lands; a second smooth scroll started here fights it
      nextTick(() => bottom("auto"));
      try {
        if (to && to.who === "agent" && to.kind === "reply" && to.n) {
          await postJSON(`/api/env/${props.env}/messages/${to.n}/reply`, { text, quoting: excerpt(quoteOf.value) });
        } else {
          await postJSON(`/api/env/${props.env}/messages`, { text: said, files });
        }
        chat.reload();
        changed();
      } catch (e) {
        mine.state = "failed";
        mine.error = e.message;
        pending.value = [...pending.value];
      }
    };
    const retry = (t) => {
      pending.value = pending.value.filter((x) => x.key !== t.key);
      // the quote is put back in the box with the words, since that is what would be sent again
      THREAD_BOX.focus && THREAD_BOX.focus(t.text);
    };
    const fileUrl = (n, name) => `/message-files/${props.env}/${n}/${encodeURIComponent(name)}`;
    // the PICTURES of one turn, in the order they were sent: what the arrow keys walk
    const pictures = (t) => (t.files || []).filter((f) => f.picture).map((f) => ({ name: f.name, url: fileUrl(t.n, f.name) }));
    // the stored time is UTC; slicing the characters out of it showed the reader somebody else's clock
    const clock = (at) => {
      const when = new Date(at);
      // the ZONE is the reader's; the format is asked for, so it is set rather than inherited
      return isNaN(when) ? "" : when.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });
    };
    // a turn is cut to keep the bubble a bubble; the rest is one click away, never gone
    const whole = ref(new Set());
    const showAll = (t) => {
      const next = new Set(whole.value);
      next.has(t.key) ? next.delete(t.key) : next.add(t.key);
      whole.value = next;
    };
    const lit = ref("");
    watch(() => THREAD_GOTO.at, () => {
      const want = THREAD_GOTO.key;
      if (!want || !root.value) return;
      const el = root.value.querySelector(`[data-turn="${want}"]`);
      if (!el) return;
      // claimed: the card moved the thread, so nothing opens an inspector over it
      THREAD_GOTO.key = "";
      // NOT SMOOTH. The browser paces a smooth scroll over the whole distance, and the distance here is
      // often thousands of pixels — so the further back the turn is, the longer it crawls, which is
      // backwards: the further it is, the less anyone wants to watch the journey. The lit turn is what
      // says where you landed.
      el.scrollIntoView({ block: "center" });
      lit.value = want;
      setTimeout(() => { if (lit.value === want) lit.value = ""; }, 2200);
    });
    // the header POINTS at what the message became; what is being DONE stays in the Activity column
    // EDITING IS NOT A SECOND WRITING BOX. It reuses the one at the foot of the thread, with the turn
    // named above it, the way replying does — so there is one place text is typed and one thing to learn.
    const editing = ref(null);
    const startEdit = (t) => {
      editing.value = t;
      answering.value = null;
      THREAD_BOX.focus && THREAD_BOX.focus(t.full || t.text || "");
    };
    const unedit = () => { editing.value = null; THREAD_BOX.focus && THREAD_BOX.focus(""); };
    // the last thing the user said, which is the one they want back when they press up on an empty box
    const editLast = () => {
      const mine = turns.value.filter((t) => t.who === "you" && t.kind === "message" && t.n && !t.pending);
      const last = mine[mine.length - 1];
      if (last) startEdit(last);
    };
    const drop = (t) => {
      if (!t.n) return;
      send("DELETE", `/api/env/${props.env}/messages/${t.n}`, { why: "deleted from the chat" })
        .then(() => { chat.reload(); changed(); })
        .catch(() => {});
    };
    // the thread moves to it when the thread holds it; otherwise the inspector opens in place. Never
    // a navigation away — the same rule the rail cards follow.
    const goRef = (event, r) => {
      event.preventDefault();
      THREAD_GOTO.key = r.key;
      THREAD_GOTO.at = Date.now();
      nextTick(() => { if (THREAD_GOTO.key) openRef(event, r.href); });
    };
    // the quote is the way back to what it quotes: the same move a rail card makes, and nothing
    // opens over the thread, because what it points at is in the thread
    const goQuote = (t) => {
      const want = quoteAnchor(t);
      if (!want) return;
      THREAD_GOTO.key = want;
      THREAD_GOTO.at = Date.now();
    };
    // what the ticks mean, said in words for whoever hovers one
    const landed = (t) => (t.state === "filed"
      ? `Filed${t.became ? `: it became ${t.became}` : ""}`
      : t.state === "read" ? "The agent has read it" : "Delivered, not read yet");
    // answering inside the thread is the same act as answering on the question's own page, so the
    // thread reloads rather than keeping a second copy of the answer
    const answered = () => { chat.reload(); changed(); };
    return { turns, more, post, retry, root, answered, landed, goRef, fileUrl, pictures, clock, away, missed, watchScroll, backDown, busy, editing, startEdit, unedit, replyTo, unreply, answering, drop, lit, whole, showAll, chat, SKELETON, settled, grew, THREAD_GOTO, anchor: turnAnchor, quoteAnchor, goQuote, editLast };
  },
  template: `
    <div class=thread>
      <button v-if="away" type=button class=thread-down :title="missed ? missed + ' arrived while you were reading' : 'Back to the newest'" @click="backDown">
        <Icon name="down"/>{{ missed ? missed + " new" : "Newest" }}
      </button>
      <div class=thread-write>
        <div v-if="editing" class=thread-answering>
          <span class=thread-answering-label>Editing</span>
          <span class=thread-answering-text>{{ editing.text }}</span>
          <button type=button class=thread-answering-x title="Leave it as it was" @click="unedit">×</button>
        </div>
        <div v-if="answering" class=thread-answering>
          <span class=thread-answering-label>Replying to</span>
          <span class=thread-answering-text>{{ answering.text }}</span>
          <button type=button class=thread-answering-x title="Not replying to it after all" @click="unreply">×</button>
        </div>
        <Compose placeholder="Write to the agent…" submit="Send" :send="post" :attach="true" :bare="true" :onUp="editLast"/>
      </div>
      <div ref=root class=thread-scroll @scroll.passive="watchScroll">
      <template v-if="!chat.data">
        <div v-for="s in SKELETON" :key="s.k" :class="['thread-turn', 'waiting', {mine: s.mine}]" :style="{ width: s.w }">
          <div class=thread-bubble><span v-for="i in s.rows" :key="i" class=thread-blank></span></div>
        </div>
      </template>
      <p v-if="more" class=thread-more>{{ more }} earlier</p>
      <p v-if="chat.data && !turns.length" class=thread-empty>Nothing has been said here yet.</p>
      <TransitionGroup :name="settled ? 'turn' : ''">
      <div v-for="t in turns" :key="t.key" :data-turn="anchor(t) || null"
        :class="['thread-turn', {mine: t.who === 'you', receipt: t.kind === 'receipt', ask: t.kind === 'question' || t.kind === 'parked', sending: t.state === 'sending', failed: t.state === 'failed', lit: !!anchor(t) && lit === anchor(t)}]">
        <div class="thread-bubble md">
          <p v-if="t.kind === 'question'" class=thread-ask-label>Question {{ t.n }}</p>
          <p v-if="t.kind === 'parked'" class=thread-ask-label>Waiting on you</p>
          <p v-if="t.kind === 'message' && (t.becameRefs || []).length" :class="['thread-became', {live: t.working}]">
            <span v-if="t.working" class=thread-became-dot></span>
            <span v-if="t.working" class=thread-became-word>Working on</span>
            <a v-for="r in t.becameRefs" :key="r.label" class=thread-pill :href="r.href"
              :title="'Open ' + r.label" @click.stop="goRef($event, r)">{{ r.label }}</a></p>
          <button v-if="t.ref && t.kind !== 'message' && quoteAnchor(t)" type=button class="thread-quote go"
            :title="'Go to the turn this answers'" @click="goQuote(t)">{{ t.ref }}</button>
          <p v-else-if="t.ref && t.kind !== 'message'" class=thread-quote>{{ t.ref }}</p>
          <div v-if="t.text" v-html="$md(whole.has(t.key) ? t.full : t.text)"></div>
          <p v-if="t.state === 'failed'" class=thread-failed>Not sent — {{ t.error }}
            <button type=button class=thread-tool @click.stop="retry(t)">Put it back in the box</button></p>
          <button v-if="t.full" type=button class=thread-full @click.stop="showAll(t)">
            {{ whole.has(t.key) ? "Show less" : "Read more" }}</button>
          <QuestionAnswer v-if="t.kind === 'question'" :env="env" :q="t.question" :compact="true" @answered="answered"/>
          <button v-if="t.kind === 'parked'" type=button class=thread-answer @click.stop="replyTo(t)">Answer the agent</button>
          <div v-if="t.files && t.files.length" :class="['thread-files', {alone: !t.text}]">
            <a v-for="(f, i) in t.files" :key="f.name" class=thread-file :href="fileUrl(t.n, f.name)" target=_blank :title="f.name"
              @click="f.picture ? $openImages($event, pictures(t), pictures(t).findIndex((p) => p.name === f.name)) : null">
              <img v-if="f.picture" class=thread-image :src="fileUrl(t.n, f.name)" :alt="f.name" loading=lazy @load="grew">
              <span v-else class=thread-file-name><Icon name="paperclip"/>{{ f.name }}</span>
            </a>
          </div>
        </div>
        <!-- A RECEIPT IS NOT A TURN AND NOTHING IS DONE TO IT. It is the record saying what a
             message became; replying to it, or deleting it, is answering a filing cabinet. -->
        <div v-if="t.kind !== 'receipt'" class=thread-tools>
          <button type=button class=thread-tool title="Reply to this, quoting it" @click.stop="replyTo(t)">Reply</button>
          <button v-if="t.kind === 'message' && t.state !== 'filed'" type=button class=thread-tool
            title="Change what it says — the old words are kept and the agent is told" @click.stop="startEdit(t)">Edit</button>
          <button v-if="t.kind === 'message' && t.state !== 'filed'" type=button class=thread-tool
            title="Delete it — it comes off the list and stays in the record" @click.stop="drop(t)">Delete</button>
        </div>
        <div class=thread-meta>
          <span v-if="t.n && t.who === 'you'" class=thread-ref>{{ t.kind === "question" ? "question" : "message" }} {{ t.n }}</span>
          <span>{{ clock(t.at) }}</span>
          <span v-if="t.kind === 'message'" :class="['thread-ticks', t.state]" :title="landed(t)"
            role=img :aria-label="landed(t)">
            <svg viewBox="0 0 19 12" fill=none stroke=currentColor stroke-width="1.6" stroke-linecap=round stroke-linejoin=round>
              <path d="M1.5 6.6 4.4 9.5 10 2.8"/>
              <path v-if="t.state !== 'sent'" d="M8 6.6 10.9 9.5 16.5 2.8"/>
            </svg>
          </span>
        </div>
      </div>
      </TransitionGroup>
      <div v-if="busy" class="thread-turn busy" aria-label="The agent is working">
        <div class=thread-bubble><span class=thread-dot></span><span class=thread-dot></span><span class=thread-dot></span></div>
        <div class=thread-meta><span>working</span></div>
      </div>
      </div>
    </div>`,
};

const EnvHome = {
  props: ["env"],
  components: { TopBar, Icon, Peek, ProgressBar, PlanCards, NeedsCard, Thread, StatusIcon },
  setup(props) {
    const url = (tail) => () => props.env && `/api/env/${props.env}${tail}`;
    // everything, not just what is open: Current work reads the finished ones under the open ones
    const work = useFetch(url("/work"));
    // the finished lines are the newest few; the COUNT behind "N more" rides in the environment row
    // NEWEST FIRST, or the cap takes the wrong six: the work list is ordered oldest-first for its own
    // page, where what you started first leads -- so a plain cap handed this section the oldest work
    // ever written and it showed nothing finished for hours.
    const recentWork = useFetch(url("/work?all=1&cap=6&order=desc"));
    const questions = useFetch(url("/questions?cap=8"));
    const suggestions = useFetch(url("/suggestions"));
    const reports = useFetch(url("/reports"));
    // ?all=1 so a FINISHED plan is here too: its card stays until the user acknowledges it, and the
    // plain list hides done ones, which is why the card used to vanish the moment the last phase closed
    const plans = useFetch(url("/plans?all=1"));
    const messages = useFetch(url("/messages?cap=10"));
    const notes = useFetch(url("/notifications"));
    const todos = useFetch(url("/todos"));
    // THE RAIL IS THREE LISTS, NOT ONE. What waits on the user is what it has always held; the
    // to-dos and the notifications were each a page away, which is a page too far for the thing you
    // glance at while reading the conversation. One at a time, each saying how much it holds.
    const tab = ref("waiting");
    const view = reactive({ kind: "", n: 0 });
    const peek = (kind, n) => { view.kind = kind; view.n = n; INSPECTOR_TRAIL.current = `${kind}:${n}`; };
    // the thread answers if it holds that turn; it says so by moving, and peek is the fallback
    const goto = (kind, n) => {
      THREAD_GOTO.key = `${kind}:${n}`;
      THREAD_GOTO.at = Date.now();
      // held work has no page of its own: the turn IS it, and answering happens on the turn
      if (kind === "parked") return;
      nextTick(() => { if (THREAD_GOTO.key) peek(kind, n); });
    };
    const unpeek = () => { view.kind = ""; view.n = 0; INSPECTOR_TRAIL.current = null; };
    const reloadAll = () => [work, recentWork, questions, suggestions, plans, messages, notes].forEach((f) => f.reload());
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
    // A QUESTION CANNOT BE DISMISSED. Everything else here is read or decided somewhere else too,
    // so clearing its card loses nothing; a question is the one row that goes nowhere until the
    // user answers it, and dismissing it hid it in this browser with nothing to bring it back.
    // PARKED WORK IS THE AGENT WAITING ON YOU, and it was the one thing here that said so nowhere:
    // the open-work list filters it out, so "the PR is ready, do you want to merge it?" sat in the
    // record while the thread carried on. It cannot be dismissed either — nothing else brings it back.
    const QUEUE_TYPES = { question: { label: "Question", tint: "#c9955e", action: "Answer", sticky: true },
                          parked: { label: "Held", tint: "#c9955e", action: "Answer", sticky: true },
                          reply: { label: "Message", tint: "#6fae7d", action: "Read" },
                          report: { label: "Report", tint: "#d9a441", action: "Read" },
                          suggestion: { label: "Suggestion", tint: "#a3a8f0", action: "Accept" } };
    const queue = computed(() => {
      const rows = [
        ...(questions.data || []).filter((q) => q.status === "open").map((q) => ({ kind: "question", n: q.n, title: q.text, age: q.age })),
        ...(work.data || []).filter((w) => !w.ended && w.parked).map((w) => ({ kind: "parked", n: w.subject, title: w.parked, age: w.parked_age })),
        ...(suggestions.data || []).filter((s) => s.status === "open").map((s) => ({ kind: "suggestion", n: s.n, title: s.title, age: s.age })),
        // A REPORT WAITS UNTIL IT IS ARCHIVED, not until it is glanced at. `seen` is stamped the moment
        // the panel opens, so a report the user scrolled past left the rail for good — and a report is
        // the one thing here written FOR them. Archiving it, or dismissing the card, is what clears it.
        ...(reports.data || []).filter((r) => !r.archived).map((r) => ({ kind: "report", n: r.n, title: r.title, age: r.age })),
      ];
      return rows.map((r) => ({ ...r, ...QUEUE_TYPES[r.kind], key: `${r.kind}:${r.n}` })).filter((r) => r.sticky || !dismissed.value.has(r.key))
        .map((r) => ({ ...r, meta: r.kind === "parked" ? `${r.n} · ${r.age}` : `${r.label.toLowerCase()} ${r.n} · ${r.age}`,
                       open: () => goto(r.kind, r.n) }));
    });
    // EVERY LIVE PLAN IS SHOWN, not only the one in progress. One plan is worked at a time, but a
    // parked one, a draft waiting to be approved and a finished one waiting to be acknowledged are all
    // still live — and each used to be invisible here the moment another took the single slot.
    const LIVE_PLAN = { active: 0, parked: 1, preparing: 2, draft: 3, done: 4 };
    const livePlans = computed(() => (plans.data || [])
      .filter((p) => p.status === "active" || p.status === "parked" || p.status === "draft"
                     || p.status === "preparing" || (p.status === "done" && !p.acknowledged))
      .sort((a, b) => (LIVE_PLAN[a.status] - LIVE_PLAN[b.status]) || a.n - b.n));
    const reloadPlans = () => { plans.reload(); changed(); };
    const plan = computed(() => livePlans.value.find((p) => p.status === "active") || null);
    const held = computed(() => !!(plan.value && plan.value.held));
    const continuePlan = () => send("POST", `/api/env/${props.env}/plans/${plan.value.n}/proceed`).then(reloadPlans);
    const goPlan = () => { if (plan.value) location.hash = `#/env/${props.env}/plans/${plan.value.n}`; };
    const crew = useFetch(url("/agents"));
    // the answer, in words: how many things need the user, what that means, and the facts about the agent in one muted line
    // who is working here, in one muted line: the page leads with it and goes straight into what needs the user
    const lead = computed(() => {
      const agent = SHELL.activity && SHELL.activity.agent;
      const session = (crew.data || []).find((a) => a.kind === "session" && agent && a.id === agent.session);
      const branch = SHELL.activity && SHELL.activity.branch;
      // SIX FACTS DO NOT FIT ON ONE LINE OF A 288px RAIL, and a line that does not fit ellipses the
      // end of itself. They are separate facts, so they are separate rows: what is being read is the
      // value, and the label is only there to say which fact it is.
      // AN ICON PER FACT, so the bar reads as five things rather than one run-on line. The icons are
      // the set's own: whatever a fact IS elsewhere in the viewer is what marks it here.
      const rows = [
        { label: "agent", icon: "agents",
          value: session && session.name ? session.name : agent ? "Claude Code" : "No agent" },
        { label: "model", icon: "style", value: agent && agent.model ? agent.model : "" },
        { label: "session", icon: "activity", value: agent ? agent.session : "" },
        { label: "running", icon: "reminders", value: agent && agent.started ? spanText(Date.now() - Date.parse(agent.started)) : "" },
        { label: "context", icon: "files", value: agent && agent.context ? `${agent.context.share}%` : "" },
      ].filter((r) => r.value);
      // the session is an agent with a page of its own, the same page a subagent's line opens —
      // it was the one name here you could not click
      return { rows, share: agent && agent.context ? agent.context.share : 0,
               href: agent ? `#/env/${props.env}/agents/session/${agent.session}` : "" };
    });
    // folded by default: a list that GROWS must never push the conversation down, which is the whole
    // reason these facts left the space above the thread in the first place
    const crewOpen = ref(false);
    const envRow = computed(() => (OVERVIEW.data ? OVERVIEW.data.environments.find((e) => e.name === props.env) : null));
    const SLOTS = 3;
    // the rows are a capped page; the COUNT is the environment's own, so a cap can never make it lie.
    // Unseen reports are not in that row (it counts unarchived ones), so they are counted from theirs.
    // WHAT THE LIST HOLDS, COUNTED FROM THE LIST. It was counted from the environment row instead —
    // every open question, every unarchived report — while the list hides the ones this browser has
    // dismissed. So a dismissed report was counted and not shown, and the heading said five things
    // were waiting above an empty column. The code's own comment warned about exactly this.
    const waitingCount = computed(() => queue.value.length + (held.value ? 1 : 0));
    // nothing waiting: the section gives its space back rather than holding 200px of empty slot
    const clear = computed(() => !queue.value.length && !held.value);
    const openTodos = computed(() => (todos.data || []).filter((t) => todoStatus(t) !== "done"));
    const todoGroups = computed(() => GROUPS.filter((g) => g.key !== "done")
      .map((g) => ({ key: g.key, label: g.label, rows: openTodos.value.filter((t) => todoStatus(t) === g.key) }))
      .filter((g) => g.rows.length));
    const unread = computed(() => (notes.data || []).filter((n) => !n.read));
    const TABS = computed(() => [{ key: "waiting", label: "Waiting on you", n: waitingCount.value },
                                 { key: "todos", label: "To-dos", n: openTodos.value.length },
                                 { key: "notifications", label: "Notifications", n: unread.value.length }]);
    const readNote = (n) => send("POST", `/api/env/${props.env}/notifications/${n.n}/read`).then(() => notes.reload());
    const readAll = () => send("POST", `/api/env/${props.env}/notifications/readall`).then(() => notes.reload());
    const openNote = (event, n) => {
      readNote(n);
      const href = noteHref(n, props.env);
      if (href) openRef(event, href);
    };
    // the checkpoint waits on the user like anything else here, so it reads as a card with its own verb
    const heldCard = computed(() => (held.value ? {
      key: "held", kind: "held", label: "Checkpoint", tint: "#d9a441", action: "Continue",
      title: "Continue past the checkpoint",
      meta: plan.value && plan.value.held_age ? `held ${plan.value.held_age}` : `plan ${plan.value.n} · phase ${plan.value.held}`,
      open: goPlan, act: continuePlan,
    } : null));
    // the second line: when it was, and the to-do it serves — the Finished heading says it is finished, so the line does not
    const workSub = (w, finished) => [(finished ? w.ended_age : w.age) || "just now",
                                      w.todo ? `to-do ${w.todo}` : ""].filter(Boolean).join(" · ");
    const open_ = computed(() => (work.data || []).filter((w) => !w.ended && !w.parked));
    // THE STATUS BAR NAMES THE ROW BEING WORKED, so the rail does not say it again: the card that
    // repeated it is gone, and what is listed here is the OTHER open work, which the bar cannot name
    const workLines = computed(() => open_.value.slice(1)
      .map((w) => ({ n: w.n, title: w.subject, sub: workSub(w, false), live: false })));
    // parked work is neither working nor finished: it stopped on purpose and says what it waits on
    const parkedLines = computed(() => (work.data || []).filter((w) => !w.ended && w.parked)
      .map((w) => ({ n: w.n, title: w.subject, why: w.parked, sub: [w.parked_age || w.age, w.todo ? `to-do ${w.todo}` : ""].filter(Boolean).join(" · ") })));
    // what the agent has just finished reads under the open work, quieter: it is context, not something to act on
    const FINISHED_SHOWN = 3;
    const FINISHED_DAYS = 7;
    const finishedLines = computed(() => {
      const since = Date.now() - FINISHED_DAYS * 86400000;
      return (recentWork.data || []).filter((w) => w.ended && Date.parse(w.ended) >= since)
        .sort((a, b) => (b.ended > a.ended ? 1 : b.ended < a.ended ? -1 : 0))
        .slice(0, FINISHED_SHOWN)
        .map((w) => ({ n: w.n, title: w.subject, sub: workSub(w, true) }));
    });
    // THE REAL REMAINDER, not "total minus three": the section shows three pieces from the last week, so
    // everything older is invisible too. The count comes from the environment row — the page used to pull
    // every row ever written, every five seconds, to work it out in the browser.
    const finishedMore = computed(() => Math.max(0, ((envRow.value || {}).work_done || 0) - finishedLines.value.length));
    // Subagents belong to the agent, so they hang under its facts line: one line each, and nothing at all
    // when none are there. A FINISHED ONE STAYS, for as long as the API keeps sending it — a subagent used
    // to disappear the instant it stopped, which is the moment its line is most worth clicking.
    // THE STRIP IS FOR WHAT IS HAPPENING NOW. A subagent that has not called a tool for an hour is kept
    // by the API for a day — so it cannot vanish while it is merely thinking — but the home says its
    // piece and lets go; the Activity crew list keeps the longer patience. And the line SAYS "quiet":
    // a name sitting under the agent with only an age beside it reads as still running.
    const CREW_QUIET_SECS = 3600;
    const liveCrew = computed(() => (crew.data || []).filter((a) => a.kind === "subagent")
      .filter((a) => a.state !== "quiet" || (a.quiet_secs || 0) <= CREW_QUIET_SECS)
      .map((a, i) => ({ key: `subagent:${a.id}`, name: a.name || `Subagent ${a.id}`,
                        done: a.state === "finished", quiet: a.state === "quiet",
                        title: `Subagent ${a.id} · ${a.model || "model not recorded"} · from session ${a.parent}`
                             + (a.state === "quiet" ? " · no tool call in a while, and it has not said it finished" : ""),
                        // RUNNING WAS SAID BY A PULSING GREEN DOT AND NOTHING ELSE, so with motion off it
                        // was said by a green dot alone — and quiet and finished both had a word already
                        tail: [a.model, a.state === "quiet" ? `quiet · ${a.age_text}`
                               : a.state === "finished" ? `finished · ${a.ended_age}` : `running · ${a.age_text}`]
                          .filter(Boolean).join(" · "),
                        delay: `${i * 60}ms`, open: () => peek("subagent", a.id) })));

    // a subagent's panel steps through the other subagents, never sideways into the queue behind it
    const trailOwner = {};
    watchEffect(() => {
      INSPECTOR_TRAIL.owner = trailOwner;
      INSPECTOR_TRAIL.items = (view.kind === "subagent" ? liveCrew.value : queue.value).map((r) => ({ key: r.key, go: r.open }));
      INSPECTOR_TRAIL.current = view.kind ? `${view.kind}:${view.n}` : null;
    });
    onUnmounted(() => { if (INSPECTOR_TRAIL.owner === trailOwner) Object.assign(INSPECTOR_TRAIL, { owner: null, items: [], current: null }); });

    return { view, peek, unpeek, reloadAll, queue, dismiss, SLOTS, SHELL, lead, held, heldCard, clear, plan, continuePlan, goPlan, livePlans, reloadPlans, workLines, parkedLines, finishedLines, finishedMore, liveCrew, crewOpen, waitingCount,
             tab, TABS, openTodos, todoGroups, unread, todoStatus, openNote, readNote, readAll, noteHref, noteTint, goto };
  },
  template: `
    <TopBar :crumbs="[env, 'Home']"/>
    <div class=body><div class=page><div class=home>
      <div class=home-main>
      <section class="home-section home-thread">
      <!-- THE AGENT BAR BELONGS TO THE CHAT, NOT TO THE PAGE. It is the agent's own state — which
           model, which session, how long, how full — and the rail beside it is not the agent's, so
           a bar spanning both said that state was the whole page's. -->
      <div class=agent-bar>
        <div class=agent-facts>
          <template v-for="(r, i) in lead.rows" :key="r.label">
            <a v-if="i === 0 && lead.href" class=agent-fact-lead :href="lead.href" :title="'Open the agent page — ' + r.label">
              <Icon :name="r.icon"/>{{ r.value }}</a>
            <span v-else class=agent-fact :title="r.label"><Icon :name="r.icon"/>{{ r.value }}</span>
          </template>
        </div>
        <button v-if="liveCrew.length" type=button class=agent-crew-toggle :aria-expanded="crewOpen ? 'true' : 'false'"
          :title="crewOpen ? 'Hide the subagents' : 'Show the subagents'" @click="crewOpen = !crewOpen">
          {{ liveCrew.length }} {{ liveCrew.length === 1 ? "subagent" : "subagents" }}<Icon :name="crewOpen ? 'up' : 'down'"/>
        </button>
      </div>
      <div v-if="crewOpen && liveCrew.length" class=crew-strip>
        <button v-for="a in liveCrew" :key="a.key" type=button :class="['crew-line', {done: a.done, quiet: a.quiet}]" :title="a.title" @click="a.open">
          <span class=crew-dot></span><span class=crew-name>{{ a.name }}</span>
          <span class=crew-tail>{{ a.tail }}</span>
        </button>
      </div>
        <Thread :env="env"/>
      </section>
      <div class=home-rail>
      <section v-if="livePlans.length" class=home-section>
        <PlanCards :env="env" :plans="livePlans" :reloaded="reloadPlans" :peek="peek"/>
      </section>
      <div class=rail-tabs role=tablist>
        <button v-for="t in TABS" :key="t.key" type=button role=tab :aria-selected="tab === t.key"
          :class="['rail-tab', {on: tab === t.key}]" @click="tab = t.key">
          <!-- ALWAYS A NUMBER, and zero is a number: a count that disappears when it reaches nought
               makes the tab change shape at the moment it is telling you the best news it has. -->
          {{ t.label }}<span :class="['rail-tab-n', {hot: t.n && t.key !== 'todos'}]">{{ t.n }}</span>
        </button>
      </div>
      <template v-if="tab === 'waiting'">
        <div v-if="clear" class=home-rail-empty>
          <Icon name="questions"/>
          <p>Nothing is waiting on you.</p>
        </div>
        <section v-else class=home-section>
          <div class=needs-slot>
            <TransitionGroup name=qrow>
            <NeedsCard v-if="heldCard" key=held :item="heldCard" :dismiss="dismiss"/>
            <NeedsCard v-for="it in queue" :key="it.key" :item="it" :selected="view.kind + ':' + view.n === it.key" :dismiss="dismiss"/>
            </TransitionGroup>
          </div>
        </section>
      </template>
      <template v-else-if="tab === 'todos'">
        <div v-if="!openTodos.length" class=home-rail-empty>
          <Icon name="todos"/>
          <p>Nothing is on the list.</p>
        </div>
        <!-- GROUPED, THE WAY THE TO-DO PAGE GROUPS THEM. The state was a word on the end of every
             row, which says the same thing as many times as there are rows; a heading says it once. -->
        <div class=rail-list>
          <template v-for="g in todoGroups" :key="g.key">
            <div class=rail-group>{{ g.label }}<span class=rail-group-n>{{ g.rows.length }}</span></div>
            <button v-for="t in g.rows" :key="t.n" type=button
              :class="['rail-row', {sel: view.kind === 'todo' && view.n === t.n}]" @click="goto('todo', t.n)">
              <StatusIcon :kind="g.key"/>
              <span class=rail-row-n>#{{ t.n }}</span>
              <span class=rail-row-title>{{ t.title }}</span>
            </button>
          </template>
        </div>
      </template>
      <template v-else>
        <div v-if="!unread.length" class=home-rail-empty>
          <Icon name="bell"/>
          <p>Nothing new.</p>
        </div>
        <!-- a notification is read by opening it, and cleared where it is if it opens nothing -->
        <!-- no dismiss control: opening one marks it read, which is the only thing to do with it -->
        <div class=rail-list>
        <div v-for="n in unread" :key="n.n" class=rail-note>
          <!-- the class name "note" is taken: it already carries a card's border and radius, so the
               row picked up a box nobody gave it. A name in a shared stylesheet belongs to somebody. -->
          <button type=button :class="['rail-row', 'wrap', {tinted: noteTint(n)}]" :style="{ '--tint': noteTint(n) || null }"
            :disabled="!noteHref(n, env)" @click="openNote($event, n)">
            <span class=rail-row-title>{{ n.text }}</span>
            <span class=rail-row-state>{{ n.age || 'just now' }}</span>
          </button>
        </div>
        </div>
        <!-- THE CONTROLS FOR THE WHOLE LIST SIT UNDER IT, not on every row: clearing fifty rows one
             at a time is the thing this bar exists to save. It is stuck to the foot of the column,
             so it is where the hand already is after reading to the bottom. -->
        <div class=rail-foot>
          <button type=button class=rail-foot-act :disabled="!unread.length" @click="readAll">Mark all as read</button>
        </div>
      </template>
      </div>
      </div>
    </div></div></div>
    <Peek v-if="view.kind" :key="view.kind + view.n" :env="env" :kind="view.kind" :n="view.n" :close="unpeek" :reloaded="reloadAll" :swap="peek"/>`,
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
        <FetchState :state="item"/>
        <template v-if="item.data">
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

const CONNECTION_LIST = {
  groups: [{ key: "connections", label: "Kept", match: () => true }],
  columns: { num: (c) => c.name, numWidth: "120px", title: (c) => c.purpose, sub: (c) => c.url || c.kind,
             cite: (c) => (c.overridden.length ? `${c.overridden.join(", ")} here` : "") },
  sorts: [{ key: "n", label: "ID" }, { key: "name", label: "Name" }],
  count: (rows) => `${rows.length} kept`, empty: "Nothing is connected.",
};

const Connections = {
  props: ["env", "n"],
  components: { TopBar, Panel, ResourceList, FetchState },
  setup(props) {
    const base = computed(() => `#/env/${props.env}/connections`);
    const list = useFetch(() => `/api/env/${props.env}/connections`);
    const item = useFetch(() => props.n && `/api/env/${props.env}/connections/${props.n}`);
    // READ-ONLY, DELIBERATELY. A connection is written from the terminal, where whoever types a
    // variable name can see which shell they are in; the page says what is kept and what this
    // environment changed, and the commands to change it.
    // JOINED HERE, NOT IN THE TEMPLATE. A template is a backtick string, so a "\n" written in
    // an expression inside one is a REAL newline by the time Vue compiles it — which is a
    // syntax error in the compiled render function and a blank page with it.
    const HOW = ['journal connections set <name> purpose|kind|url|secret "<value>"',
                 'journal connections here <name> purpose|kind|url|secret "<value>"'].join("\n");
    return { list, item, base, CONNECTION_LIST, HOW };
  },
  template: `
    <TopBar :crumbs="['Environment', 'Connections']"/>
    <div class=body>
      <div class=list>
        <ResourceList v-bind="CONNECTION_LIST" :rows="list.data" :loading="list.loading" :error="list.error"
          :href="(c) => base + '/' + c.n" :selected="(c) => String(c.n) === n"/>
      </div>
      <Panel v-if="n" :label="'Connection ' + (item.data ? item.data.name : '')" :close="base">
        <FetchState :state="item"/>
        <template v-if="item.data">
          <h2 class=p-title>{{ item.data.purpose }}</h2>
          <dl class=props>
            <dt>Name</dt><dd><code>{{ item.data.name }}</code></dd>
            <dt>Kind</dt><dd>{{ item.data.kind || '—' }}</dd>
            <dt>URL</dt><dd>
              {{ item.data.url || '—' }}
              <span v-if="item.data.overridden.includes('url')" class=dim>
                — the project's own: {{ item.data.project.url || 'not set' }}</span></dd>
            <dt>Secret</dt><dd>
              <code v-if="item.data.secret">{{ item.data.secret }}</code><span v-else>—</span>
              <span class=dim>{{ item.data.secret ? (item.data.secret_set ? " is set on the server" : " is NOT set on the server") : "" }}</span></dd>
            <dt>Kept</dt><dd>{{ item.data.at ? item.data.at.slice(0, 16).replace("T", " ") : '—' }}</dd>
          </dl>
          <p class=prose>The secret is the NAME of an environment variable, never the token: this record is
            read back verbatim into every session, so nothing here ever carries a value.</p>
          <p class=prose>Change it from the terminal:</p>
          <pre class=how><code>{{ HOW }}</code></pre>
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
    // the Project rows say how much each holds: coding style rules and tools belong to the project, not the environment
    const styleRules = useFetch(() => "/api/style?all=1");
    const tools = useFetch(() => "/api/tools");
    // stopping is not undoable from here: once it goes, this page has nothing to ask
    const viewerSaid = ref("");
    const viewerBusy = ref(false);
    const viewerAct = async (verb) => {
      if (viewerBusy.value) return;
      if (verb === "stop" && !window.confirm("Stop the viewer? This page stops working until it is started again from the terminal.")) return;
      viewerBusy.value = true;
      try {
        const got = await send("POST", `/api/viewer/${verb}`);
        viewerSaid.value = (got && got.message) || (verb === "stop" ? "stopping" : "restarting");
      } catch (e) {
        viewerSaid.value = e.message;
      } finally {
        viewerBusy.value = false;
      }
    };
    const counted = (n, one, many) => (typeof n === "number" ? `${n} ${n === 1 ? one : many}` : "");
    const auto = reactive({ saving: false, error: null });
    async function setAuto(on) {
      auto.saving = true;
      auto.error = null;
      try {
        await postJSON("/api/journal/settings", { auto: on });
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
    // one row per resource: its days listed once closed, and, where archived items are deleted, its days in the archive
    const keepingRows = computed(() => (s.data && s.data.retention ? Object.entries(s.data.retention).map(([key, k]) => {
      const listed = k.archive ? `listed ${k.archive} day${k.archive === 1 ? "" : "s"}` : "listed until archived by hand";
      const deleted = k.deletes ? (k.delete ? `deleted ${k.delete} day${k.delete === 1 ? "" : "s"} after` : "never deleted") : "kept in the archive";
      const fields = [{ name: "archive", label: "Days listed once closed (0 keeps it listed)", value: String(k.archive) }];
      if (k.deletes) fields.push({ name: "delete", label: "Days in the archive before it is deleted (0 keeps it)", value: String(k.delete) });
      return { key, label: k.label, value: `${listed} · ${deleted}`,
               actions: [{ label: "Change", method: "POST", url: `${api.value}/settings`, submit: "Save", fields,
                           shape: (p) => ({ retention: { resource: key, archive: parseInt(p.archive, 10),
                                                         ...(k.deletes ? { delete: parseInt(p.delete, 10) } : {}) } }) }] };
    }) : []));
    const kept = () => { s.reload(); changed(); };
    const showing = computed(() => (s.data ? [{
      label: "Change", method: "POST", url: `${api.value}/settings`, submit: "Save",
      fields: [{ name: "activity_show", label: "Lines Activity shows", value: String(s.data.activity_show) },
               { name: "activity_keep", label: "Lines the activity log keeps", value: String(s.data.activity_keep) }],
      shape: (p) => ({ activity_show: parseInt(p.activity_show, 10), activity_keep: parseInt(p.activity_keep, 10) }),
    }] : []));
    const toggleActivity = () => setActivityShown(!ACTIVITY.shown);
    const saveSetting = (body) => postJSON(`${api.value}/settings`, body).then(() => { s.reload(); changed(); });
    return { s, auto, setAuto, saveSetting, removing, done, keepingRows, kept, showing, ACTIVITY, toggleActivity, styleRules, tools, counted,
             viewerSaid, viewerBusy, viewerAct };
  },
  template: `
    <TopBar :crumbs="[env, 'Settings']"/>
    <div class=page><div class=settings-page>
      <FetchState :state="s" loading="Loading…"/>
      <template v-if="s.data">
        <section class=settings-group>
          <h2>This environment</h2>
          <p class=settings-note>What this one environment does differently.</p>
          <div class=settings-card>
            <div class=settings-row>
              <span class=settings-label>Work from the viewer</span>
              <span class=settings-value>{{ s.data.viewer_first ? 'On: the agent answers here, one line in the terminal' : 'Off' }}</span>
              <button type=button class=btn @click="saveSetting({ viewer_first: !s.data.viewer_first })">{{ s.data.viewer_first ? 'Turn off' : 'Turn on' }}</button>
            </div>
          </div>
        </section>
        <section class=settings-group>
          <h2>Keeping</h2>
          <p class=settings-note>How long a closed item stays listed before it is archived, and how long it stays in the archive before it is deleted for good. 0 keeps it.</p>
          <div class=settings-card>
            <div v-for="k in keepingRows" :key="k.key" class=settings-row>
              <span class=settings-label>{{ k.label }}</span>
              <span class=settings-value>{{ k.value }}</span>
              <ActionBar :actions="k.actions" :done="kept" :key="'keep-' + k.key + k.value"/>
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
            <div class=settings-row>
              <span class=settings-label>Auto mode</span>
              <span class=settings-value>{{ s.data.auto ? 'On: the agent works through to-dos without asking, on every environment' : 'Off: nothing starts without your word' }}</span>
              <button type=button class=btn :disabled="auto.saving" @click="setAuto(!s.data.auto)">{{ s.data.auto ? 'Turn off' : 'Turn on' }}</button>
              <p v-if="auto.error" class="error settings-wide">{{ auto.error }}</p>
            </div>
            <!-- the one control that ends the thing serving the page: it says so rather than reading like a logout -->
            <div class=settings-row><span class=settings-label>This viewer</span>
              <span class=settings-value>{{ viewerSaid || 'runs until it is stopped' }}</span>
              <button type=button class=btn :disabled="viewerBusy" @click="viewerAct('restart')">Restart</button>
              <button type=button class="btn danger" :disabled="viewerBusy" @click="viewerAct('stop')">Stop</button></div>
            <div class=settings-row><span class=settings-label>Pins</span><span class=settings-value>{{ s.data.pins }} standing</span><a class=btn :href="'#/env/' + env + '/pins'">Open</a></div>
            <div class=settings-row><span class=settings-label>Reminders</span><span class=settings-value>{{ counted(s.data.reminders, 'reminder', 'reminders') }}</span><a class=btn :href="'#/env/' + env + '/reminders'">Open</a></div>
            <div class=settings-row><span class=settings-label>Coding style rules</span><span class=settings-value>{{ styleRules.data ? counted(styleRules.data.length, 'rule', 'rules') : '' }}</span><a class=btn :href="'#/env/' + env + '/style'">Open</a></div>
            <div class=settings-row><span class=settings-label>Catalogued tools</span><span class=settings-value>{{ tools.data ? counted(tools.data.length, 'tool', 'tools') : '' }}</span><a class=btn href="#/tools">Open</a></div>
            <div class=settings-row><span class=settings-label>Documents</span><span class=settings-value>{{ typeof s.data.docs === 'number' ? s.data.docs + ' catalogued' : '' }}</span><a class=btn :href="'#/env/' + env + '/docs'">Open</a></div>
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
    // the reader names where the file came from, the way the doc page does
    const readFile = (e, f) => openFile(e, { ...f, from: sourceLabel(f) });
    return { list, sourceHref, sourceLabel, images, others, openFile: readFile };
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
              <a class=files-tile-img :href="f.url" :title="'Open ' + f.name" @click="openFile($event, f)"><img :src="f.url" :alt="f.name" loading=lazy></a>
              <figcaption><span class=files-tile-name :title="f.name">{{ f.name }}</span><a :href="sourceHref(f)">{{ sourceLabel(f) }}</a></figcaption>
            </figure>
          </div>
        </div>
        <div v-if="others.length">
        <p v-if="images.length" class=section-label>Other files <span class=muted>{{ others.length }}</span></p>
        <div class=files-page>
          <div v-for="f in others" :key="f.url" class=files-row>
            <a class=files-thumb :href="f.url" :title="'Open ' + f.name" @click="openFile($event, f)">
              <img v-if="f.image" :src="f.url" :alt="f.name" loading=lazy>
              <Icon v-else :name="f.folder ? 'folder' : 'docs'"/>
            </a>
            <div class=files-main>
              <a class=files-name :href="f.url" @click="openFile($event, f)">{{ f.name }}<span v-if="f.folder">/</span></a>
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
  components: { TopBar, WorkFilesSection },
  setup(props) {
    const found = useFetch(() => props.env && props.sha && `/api/env/${props.env}/commits?sha=${props.sha}`);
    return { found };
  },
  template: `
    <TopBar :crumbs="[env, 'Commit ' + sha.slice(0, 7)]"/>
    <div class=page>
      <div class=page-inner>
        <FetchState :state="found" loading="Loading…"/>
        <template v-if="found.data">
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
            <p v-if="!found.data.work.length" class="prose muted">No work on this environment recorded this commit; it is read from the repository itself.</p>
            <div v-else class=linked>
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
          <WorkFilesSection :files="found.data.files || []"/>
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
    await postJSON(`/api/env/${env()}/messages`, { text: `Please load the \`${name()}\` skill now.`, files: [] });
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
      <FetchState :state="skill" loading="Loading…"/>
      <template v-if="skill.data">
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
      <FetchState :state="about" loading="Loading…"/>
      <template v-if="about.data">
        <h1 class=p-title>{{ about.data.name }}</h1>
        <dl class=props>
          <dt>Status</dt><dd><span :class="['agent-status', about.data.status]">{{ AGENT_STATUS[about.data.status] || about.data.status }}</span><span v-if="about.data.seen" class=muted> · last seen {{ about.data.seen }}</span></dd>
          <dt>Agent</dt><dd>{{ about.data.kind === 'subagent' ? 'Subagent' : 'Session' }} {{ about.data.id }}</dd>
          <template v-if="about.data.parent"><dt>Sent by</dt><dd><SessionChip :env="env" :id="about.data.parent"/></dd></template>
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
      <FetchState :state="about" loading="Loading…"/>
      <template v-if="about.data">
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
      <FetchState :state="skill" loading="Loading…"/>
      <template v-if="skill.data">
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

const VIEWS = { Home, EnvHome, Todos, Pins, Rules, Connections, Inbox, Questions, Suggestions, Style, Reports, ReportDetail, Plans, Work, Reminders, Docs, EnvDocs, DocDetail, Settings, Search, Tools, Files, Commit, Agent, AgentTranscript, About, SkillView, NotFound };

// ─────────────────────────────────────────────────────────────── the app shell
// open work lives on Home, so the sidebar has no entry of its own for it
const NAV = [
  { key: "home", label: "Home", views: ["EnvHome", "Work"], path: "" },
  { key: "inbox", label: "Messages", views: ["Inbox", "Questions", "Suggestions"], path: "messages", count: ["questions", "suggestions"] },
  { key: "todos", label: "To-dos", views: ["Todos"], path: "todos", count: "todos" },
  { key: "docs", label: "Documents", views: ["EnvDocs", "Files"], path: "docs", count: "docs" },
  // a report is not a doc: it is written for the user, it ages out, and it is never handed to a session
  { key: "reports", label: "Reports", views: ["Reports", "ReportDetail"], path: "reports", count: "reports" },
  // a plan is a document, kind of, but it is a big feature of its own: the user asked for it out of Documents
  { key: "plans", label: "Plans", icon: "plan", views: ["Plans"], path: "plans", count: "plans" },
  // WHAT THE AGENT KNOWS, AND WHAT IT IS TOLD AGAIN. Both are per-environment, unlike the project's
  // rules and tools below them — and both had a page and a route but no way in from the nav at all.
  { key: "pins", label: "Pins", views: ["Pins"], path: "pins", count: "pins" },
  { key: "reminders", label: "Reminders", views: ["Reminders"], path: "reminders", count: "reminders" },
  // the list is the project's; what is SHOWN is this environment's reading of it, overrides applied,
  // which is why it sits here rather than under Project beside the rules
  { key: "connections", label: "Connections", icon: "plug", views: ["Connections"], path: "connections" },
  { key: "settings", label: "Settings", views: ["Settings"], path: "settings" },
];

// the Activity panel, always shown in the right column
const ActivityPanel = {
  props: { data: Object, href: Function, env: String },
  components: { Icon },
  setup(props) {
    const accept = (e) => send("POST", `/api/env/${props.env}/suggestions/${e.n}/accept`)
      .then(() => window.dispatchEvent(new CustomEvent("journal:changed")));
    // who is working on this environment: its sessions, and the subagents they dispatched
    const crew = reactive({ open: false });
    const agentsList = useFetch(() => props.env && `/api/env/${props.env}/agents`);
    const working = computed(() => (agentsList.data || []).filter((a) => a.working).length);
    const crewGroups = computed(() => [
      { key: "active", label: "Active", rows: (agentsList.data || []).filter((a) => a.working) },
      // quiet: no tool call in a while, and no stop either — it may still be running, and it may have died
      { key: "quiet", label: "Quiet", rows: (agentsList.data || []).filter((a) => !a.working && a.state === "quiet") },
      { key: "done", label: "Finished", rows: (agentsList.data || []).filter((a) => a.state === "finished") },
      { key: "idle", label: "Idle", rows: (agentsList.data || []).filter((a) => !a.working && a.state === "idle") },
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
    // which MCP lines the reader has opened, by row key: the calls a server made are shown under it
    const opened = reactive({});
    // a new line brings the list back to the top, unless the pointer is over it
    const list = ref(null);
    const hovered = ref(false);
    watch(() => keyed.value[0] && keyed.value[0].key, (now, was) => {
      if (!now || !was || now === was || hovered.value || !list.value) return;
      list.value.scrollTo({ top: 0, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
    });
    // a line opens its resource over the page: only a kind with no panel of its own is still a link out
    const PEEK_KIND = { todo: "todo", question: "question", suggestion: "suggestion", work: "work",
                        plan: "plan", report: "report", doc: "doc", message: "message" };
    const peekOf = (e) => {
      if (e.kind === "message" && e.text === "Answered your question") return e.n ? { kind: "reply", n: Number(e.n) } : null;
      if (e.kind === "comment") {
        // a comment has nothing of its own to open, so its line opens what the comment is about
        const [about, n] = String(e.about || "").split(":");
        const kind = about === "inbox" ? "message" : PEEK_KIND[about];
        return kind && n ? { kind, n: Number(n) } : null;
      }
      const kind = PEEK_KIND[e.kind];
      return kind && e.n ? { kind, n: Number(e.n) } : null;
    };
    const onRow = (event, e) => {
      const it = peekOf(e);
      // a modified click is the reader asking for a tab of their own, so it is left alone
      if (!it || event.metaKey || event.ctrlKey || event.shiftKey || event.button) return;
      event.preventDefault();
      OVERLAY.kind = it.kind;
      OVERLAY.n = it.n;
    };
    // a subagent in this dropdown opens its panel as well; a session has only a page of its own
    const onCrewRow = (event, a) => {
      if (a.kind !== "subagent" || event.metaKey || event.ctrlKey || event.shiftKey || event.button) return;
      event.preventDefault();
      OVERLAY.kind = "subagent";
      OVERLAY.n = a.id;
    };
    return { accept, crew, agentsList, working, crewGroups, keyed, list, hovered, opened, onRow, onCrewRow };
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
                :title="'Open ' + (a.name || (a.kind === 'subagent' ? 'subagent ' : 'session ') + a.id)" @click="crew.open = false; onCrewRow($event, a)">
                <span class=drop-kind>{{ a.kind === 'subagent' ? 'Subagent' : 'Session' }} · {{ a.working ? 'Working' : a.state === 'finished' ? 'Finished' : a.state === 'quiet' ? 'Quiet' : 'Idle' }}{{ a.kind === 'subagent' && a.model ? ' · ' + a.model : '' }}{{ a.kind === 'subagent' && !a.working && a.age_text ? ' · ' + a.age_text : '' }}</span>
                <span class=drop-text>{{ a.name || (a.kind === 'subagent' ? 'Subagent ' + a.id : 'Session ' + a.id) }}<span v-if="a.parent" class=muted> · from session {{ a.parent }}</span></span>
              </a>
              </template>
            </div>
          </span>
        </span>
      </div>
      <template v-if="data">
        <div class=activity-list ref=list @mouseenter="hovered = true" @mouseleave="hovered = false">
          <TransitionGroup name=act>
          <template v-for="{ e, key } in keyed" :key="key">
            <div v-if="e.needs === 'open' && href(e)" class="activity-row activity-alert">
              <a class=activity-alert-body :href="href(e)" @click="onRow($event, e)">
                <span class=activity-text>{{ e.text }}<span v-if="e.n" class=activity-n> {{ e.n }}</span><span v-if="e.detail" class=activity-d>{{ e.detail }}</span></span>
                <span v-if="e.title" class=activity-title>{{ e.title }}</span>
                <span class=activity-age>{{ e.by }} · {{ e.age || 'just now' }}</span>
              </a>
              <span class=activity-actions>
                <a v-if="e.kind === 'question'" class="btn warn" :href="href(e)" @click="onRow($event, e)">Answer</a>
                <a v-else-if="e.kind === 'message'" class="btn warn" :href="href(e)" @click="onRow($event, e)">Open</a>
                <template v-else-if="e.kind === 'suggestion'">
                  <button type=button class="btn warn" @click="accept(e)">Accept</button>
                  <a class=btn :href="href(e)" @click="onRow($event, e)">Review</a>
                </template>
              </span>
            </div>
            <div v-else-if="e.kind === 'mcp'" :class="['activity-row', 'activity-mcp', {open: opened[key]}]">
              <button type=button class=activity-mcp-head :aria-expanded="!!opened[key]"
                :title="(e.calls || []).length + ' call(s) through this server'" @click="opened[key] = !opened[key]">
                <span class=activity-text>{{ e.text }}<span v-if="e.detail" class=activity-d>{{ e.detail }}</span></span>
                <span class=activity-age>{{ e.by }} · {{ e.age || 'just now' }}</span>
              </button>
              <div v-if="opened[key]" class=activity-mcp-calls>
                <span v-for="(c, i) in e.calls || []" :key="i" class=activity-mcp-call>{{ c }}</span>
              </div>
            </div>
            <a v-else-if="href(e)" :class="['activity-row', 'activity-link', {'activity-soft': e.needs === 'answered', 'activity-commit': e.kind === 'commit'}]" :href="href(e)" @click="onRow($event, e)">
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
      </template>
    </div>`,
};

// the quick menu: space opens it anywhere to search actions; space again on an empty search writes a message to the agent
const QUICK = reactive({ open: false, q: "", i: 0, writing: false, draft: "", files: [] });
const TOAST = reactive({ text: "" });
let toastTimer = 0;

function flash(text) {
  TOAST.text = text;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { TOAST.text = ""; }, 2600);
}

// what the agent did while the tab was away, shown bottom right when the user comes back
const AWAY = reactive({ open: false, since: 0, back: 0 });
const AWAY_DONE = /^(Closed|Committed|Ended|Wrote|Writing|Replied|Replying|Answered|Filed|Drafted|Suggest|Turned)/;

function awayLines(events, since) {
  return (events || []).filter((e) => e.by === "Agent" && e.at && Date.parse(e.at) >= since && AWAY_DONE.test(e.text)).slice(0, 6)
    .map((e, i) => ({ key: `${e.at}${i}`, age: e.age || "just now",
                      text: `${[e.text, e.n, e.detail].filter(Boolean).join(" ")}${e.title ? ` — ${e.title}` : ""}` }));
}

function spanText(ms) {
  const minutes = Math.max(1, Math.round(ms / 60000));
  if (minutes < 60) return `${minutes}m`;
  return `${Math.floor(minutes / 60)}h ${minutes % 60}m`;
}

const QuickMenu = {
  props: ["env"],
  components: { Icon },
  setup(props) {
    const input = ref(null);
    const area = ref(null);
    onMounted(() => { const el = QUICK.writing ? area.value : input.value; if (el) el.focus(); });
    const questions = useFetch(() => props.env && `/api/env/${props.env}/questions`);
    const suggestions = useFetch(() => props.env && `/api/env/${props.env}/suggestions`);
    const plans = useFetch(() => props.env && `/api/env/${props.env}/plans`);
    const close = () => Object.assign(QUICK, { open: false, q: "", i: 0, writing: false });
    const goTo = (hash) => () => { close(); location.hash = hash; };
    const write = (draft) => {
      // the thread is on screen: write there, where what is sent stays visible
      if (THREAD_BOX.focus && THREAD_BOX.focus(draft === undefined ? QUICK.draft : draft)) {
        close();
        return;
      }
      Object.assign(QUICK, { writing: true, draft: draft === undefined ? QUICK.draft : draft });
      nextTick(() => { const el = area.value; if (el) { el.focus(); el.setSelectionRange(el.value.length, el.value.length); } });
    };
    const back = () => {
      Object.assign(QUICK, { writing: false, i: 0 });
      nextTick(() => { if (input.value) input.value.focus(); });
    };
    const plan = computed(() => (plans.data || []).find((p) => p.status === "active") || null);
    const rows = computed(() => {
      const base = `#/env/${props.env}`;
      const q = QUICK.q.trim();
      const openQuestions = (questions.data || []).filter((x) => x.status === "open");
      const openSuggestions = (suggestions.data || []).filter((x) => x.status === "open");
      const waiting = openQuestions.length + openSuggestions.length;
      const auto = !!(SHELL.activity && SHELL.activity.auto);
      const p = plan.value;
      const commands = [
        { label: "Go to Home", keys: "home queue cockpit", hk: "1", icon: "home", run: goTo(base) },
        { label: "Go to Messages", keys: "messages inbox questions suggestions", hk: "2", icon: "inbox", run: goTo(`${base}/messages`) },
        { label: "Go to To-dos", keys: "todos todo tasks", hk: "3", icon: "todos", run: goTo(`${base}/todos`) },
        { label: "Go to Documents", keys: "documents docs reports plans", hk: "4", icon: "docs", run: goTo(`${base}/docs`) },
        // always listed: it opens the plan the agent is assigned, or the plans list while none is
        { label: "Go to the plan", keys: "plan plans phases checkpoint", hk: "5", icon: "plan", run: goTo(p ? `${base}/plans/${p.n}` : `${base}/plans`) },
        { label: "Go to Settings", keys: "settings preferences", hk: "6", icon: "settings", run: goTo(`${base}/settings`) },
      ];
      if (waiting) {
        // it opens on Home, where the queue is: the hash change clears the overlay, so the item opens after it
        const first = openQuestions.length
          ? { kind: "question", n: openQuestions[0].n }
          : { kind: "suggestion", n: openSuggestions[0].n };
        commands.unshift({ label: `Answer the first of ${waiting} waiting on you`, keys: "answer waiting", hk: "a", icon: "questions",
                           run: () => {
                             close();
                             // going to Home clears any open overlay, so the item opens once that has happened
                             const show = () => { OVERLAY.kind = first.kind; OVERLAY.n = first.n; };
                             if (location.hash === base) { nextTick(show); return; }
                             window.addEventListener("hashchange", () => nextTick(show), { once: true });
                             location.hash = base;
                           } });
      }
      if (p && p.held) {
        commands.push({ label: "Continue past the checkpoint", keys: "continue checkpoint plan", hk: "c", icon: "work",
                        run: () => { close(); send("POST", `/api/env/${props.env}/plans/${p.n}/proceed`).then(() => { changed(); flash("The agent is working again"); }); } });
      }
      commands.push({ label: auto ? "Pause auto mode" : "Resume auto mode", keys: "auto mode", icon: "agents",
                      run: () => { close(); if (SHELL.setAuto) SHELL.setAuto(!auto); flash(auto ? "Auto mode paused" : "Auto mode on"); } });
      commands.push({ label: "Show what happened while you were away", keys: "away digest notification recap", icon: "bell",
                      run: () => { close(); AWAY.open = true; } });
      commands.push({ label: ACTIVITY.shown ? "Hide the activity column" : "Show the activity column", keys: "activity column", icon: "activity",
                      run: () => { close(); setActivityShown(!ACTIVITY.shown); } });
      const needle = q.toLowerCase();
      const found = commands.filter((c) => !q || `${c.label} ${c.keys}`.toLowerCase().includes(needle));
      if (!q) return [{ label: "Message the agent", hk: "space", icon: "arrow", run: () => write() }, ...found];
      return [...found, { label: `Message the agent: “${q}”`, icon: "arrow", run: () => write(q) }];
    });
    const at = computed(() => Math.max(0, Math.min(QUICK.i, rows.value.length - 1)));
    const onKey = (e) => {
      if (e.isComposing) return;
      if (e.key === " " && !QUICK.q) { e.preventDefault(); write(); }
      else if (!QUICK.q && e.key.length === 1 && !e.metaKey && !e.ctrlKey && !e.altKey && rows.value.some((r) => r.hk === e.key.toLowerCase())) {
        e.preventDefault();
        e.stopPropagation();
        rows.value.find((r) => r.hk === e.key.toLowerCase()).run();
      }
      else if (e.key === "ArrowDown") { e.preventDefault(); QUICK.i = Math.min(at.value + 1, rows.value.length - 1); }
      else if (e.key === "ArrowUp") { e.preventDefault(); QUICK.i = Math.max(at.value - 1, 0); }
      else if (e.key === "Enter") { e.preventDefault(); e.stopPropagation(); if (rows.value[at.value]) rows.value[at.value].run(); }
      else if (e.key === "Escape") { e.preventDefault(); e.stopPropagation(); close(); }
    };
    const onInput = (e) => { QUICK.q = e.target.value; QUICK.i = 0; };
    const sending = ref(false);
    const fileInput = ref(null);
    const attach = () => { if (fileInput.value) fileInput.value.click(); };
    const picked = (e) => { QUICK.files.push(...Array.from(e.target.files || [])); e.target.value = ""; };
    const unpick = (i) => QUICK.files.splice(i, 1);
    const held = computed(() => QUICK.files.length);
    const sendDraft = async () => {
      const text = QUICK.draft.trim();
      if ((!text && !held.value) || sending.value) return;
      sending.value = true;
      const count = held.value;
      try {
        const files = await Promise.all(QUICK.files.map(readFileAsData));
        await postJSON(`/api/env/${props.env}/messages`, { text, files });
        QUICK.draft = "";
        QUICK.files = [];
        close();
        changed();
        const carried = count ? ` with ${count} ${count === 1 ? "file" : "files"}` : "";
        flash(`Sent${carried} — ${landsWhen.value}`);
      } catch (err) {
        flash(err.message);
      } finally {
        sending.value = false;
      }
    };
    const onAreaKey = (e) => {
      if (e.isComposing) return;
      if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); e.stopPropagation(); sendDraft(); }
      else if (e.key === "Escape") { e.preventDefault(); e.stopPropagation(); back(); }
    };
    // what "sent" actually means right now: nothing interrupts a working agent, so saying only "Sent"
    // reads as delivered and a message that sits for ten minutes reads as lost
    const landsWhen = computed(() => {
      const agent = SHELL.activity && SHELL.activity.agent;
      if (!agent) return "no agent is here, so it will be read when the next session starts";
      if (agent.working) return "the agent is working, so it will read this when it stops";
      return "the agent is idle, so it will read this in a few seconds";
    });
    const agentNote = computed(() => {
      const agent = SHELL.activity && SHELL.activity.agent;
      if (plan.value && plan.value.held) return "it is stopped at a checkpoint";
      if (!agent) return "no agent is here; it waits for the next session";
      return agent.working ? "it is working" : "it is idle";
    });
    const filesHint = computed(() => (held.value
      ? `${held.value} ${held.value === 1 ? "file" : "files"} attached · ↵ sends`
      : "⇧↵ new line · esc back to actions"));
    return { QUICK, input, area, rows, at, onKey, onInput, close, back, sendDraft, onAreaKey, agentNote, sending,
             fileInput, attach, picked, unpick, held, filesHint, humanSize };
  },
  template: `
    <div class=quick-scrim @click="close"></div>
    <div class=quick-menu role=dialog aria-label="Quick menu">
      <template v-if="!QUICK.writing">
        <div class=quick-head>
          <Icon name="search"/>
          <input ref=input class=quick-input :value="QUICK.q" placeholder="Search actions…" aria-label="Search actions" @input="onInput" @keydown="onKey">
          <button type=button class=quick-key @click="close">esc</button>
        </div>
        <div class=quick-rows>
          <button v-for="(r, i) in rows" :key="r.label" type=button :class="['quick-row', {on: i === at}]" @click="r.run" @mouseenter="QUICK.i = i">
            <Icon :name="r.icon"/><span class=quick-label>{{ r.label }}</span><span v-if="r.hk" class=quick-cap>{{ r.hk }}</span>
          </button>
        </div>
        <div class=quick-foot><span>↑↓ move</span><span>↵ run</span>
          <span class=quick-foot-note>{{ QUICK.q.trim() ? rows.length + (rows.length === 1 ? ' match' : ' matches') : 'press a key, or search' }}</span></div>
      </template>
      <template v-else>
        <div class="quick-head writing">
          <Icon name="arrow"/><span class=quick-write-title>Message the agent</span><span class=quick-write-note>{{ agentNote }}</span>
        </div>
        <div class=quick-write>
          <textarea ref=area v-model="QUICK.draft" placeholder="Ask it something, or tell it what to do next…" aria-label="Message the agent"
            :disabled="sending" @keydown="onAreaKey"></textarea>
        </div>
        <div v-if="held" class=quick-files>
          <span v-for="(f, i) in QUICK.files" :key="i" class=quick-file>
            <span class=quick-file-name>{{ f.name }}</span><span class=quick-file-size>{{ humanSize(f.size) }}</span>
            <button type=button class=quick-file-x aria-label="Remove" title="Remove" @click="unpick(i)"><Icon name="close"/></button>
          </span>
        </div>
        <div class="quick-foot writing">
          <input ref=fileInput type=file multiple hidden @change="picked">
          <button type=button class=quick-attach title="Attach files" @click="attach"><Icon name="paperclip"/>Attach</button>
          <span class=quick-foot-grow>{{ filesHint }}</span>
          <button type=button class=btn @click="back">Back</button>
          <button type=button :class="['quick-send', {ready: QUICK.draft.trim() || held}]" :disabled="sending || (!QUICK.draft.trim() && !held)" @click="sendDraft">Send<Icon name="arrow"/></button>
        </div>
      </template>
    </div>`,
};

const App = {
  components: { ...VIEWS, Icon, ActivityPanel, Peek, QuickMenu, JournalsDropdown, FileReader_, Lightbox },
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
    // one observer for the whole app: what has room for two columns, and what must stack
    const measureWidth = () => {
      const main = document.querySelector("main");
      const w = main ? main.clientWidth - 56 : 0;
      if (w) SHELL.wide = w >= WIDE_AT;
    };
    let widthWatch = null;
    onMounted(() => {
      measureWidth();
      const main = document.querySelector("main");
      if (main && window.ResizeObserver) { widthWatch = new ResizeObserver(measureWidth); widthWatch.observe(main); }
    });
    onUnmounted(() => { if (widthWatch) widthWatch.disconnect(); });
    const closeOverlay = () => { OVERLAY.kind = ""; OVERLAY.n = 0; OVERLAY.quote = ""; OVERLAY.file = null; };
    // THE USER ASKS, THE AGENT UPGRADES. An upgrade runs the suites and replaces the package, which is
    // the agent's job, not a button's -- so this says so in the one way the viewer already reaches it:
    // an ordinary message. Rule 8 -- a new viewer verb needs no new case to be announced.
    const upgrade = reactive({ busy: false, said: "", error: "" });
    const askUpgrade = async (version) => {
      if (upgrade.busy || !envName.value) return;
      Object.assign(upgrade, { busy: true, said: "", error: "" });
      try {
        await postJSON(`/api/env/${envName.value}/messages`, {
          text: `Upgrade the journal to ${version} now: run \`journal upgrade\` from the project root, `
              + "then tell me what changed and whether anything needs my attention.",
          files: [],
        });
        changed();
        upgrade.said = "The agent is asked to upgrade. It gets this at its next stop, or at once if it is idle.";
      } catch (e) {
        upgrade.error = e.message;
      } finally {
        upgrade.busy = false;
      }
    };
    const onHash = () => { Object.assign(route, parseHash()); closeOverlay(); loadOverview(); };
    window.addEventListener("hashchange", onHash);
    window.addEventListener("journal:changed", loadOverview);
    // space opens the quick menu, unless it is typing into something or pressing a focused control
    const openQuick = () => Object.assign(QUICK, { open: true, q: "", i: 0 });
    const making = reactive({ open: false, name: "", error: "" });
    const makeEnv = async () => {
      const name = making.name.trim();
      if (!name) return;
      making.error = "";
      try {
        // the env in the PATH is only where the request came from; the new name is the body
        const body = await postJSON(`/api/env/${envName.value || "default"}/environment/make`, { name });
        Object.assign(making, { open: false, name: "" });
        changed();
        loadOverview();
        location.hash = `#/env/${(body.data && body.data.name) || name}`;
      } catch (e) {
        making.error = e.message;
      }
    };
    // HOW THE FOCUS WAS REACHED, TRACKED RATHER THAN ASKED FOR. :focus-visible cannot answer this:
    // measured inside a live keydown it reads TRUE even for a button focused by a mouse click, because the
    // browser counts the key itself as keyboard interaction. So the last input that moved focus is recorded here.
    let focusFromPointer = false;
    const sawPointer = () => { focusFromPointer = true; };
    const sawKeyMove = (e) => { if (e.key === "Tab" || e.key.startsWith("Arrow")) focusFromPointer = false; };
    window.addEventListener("pointerdown", sawPointer, true);
    window.addEventListener("keydown", sawKeyMove, true);
    const onSpace = (e) => {
      if (e.key !== " " || QUICK.open || e.defaultPrevented) return;
      const el = document.activeElement;
      if (el && el !== document.body) {
        // typing always keeps space, wherever the focus came from
        if (el.isContentEditable || el.matches("input,textarea,select")) return;
        // a control reached with the keyboard keeps space, so Tab-and-space still presses it; one left
        // focused by a click does not, which is why space used to press the button you had just clicked
        if (el.matches("button,a[href],[role=button],[tabindex]") && !focusFromPointer) return;
      }
      e.preventDefault();
      openQuick();
    };
    window.addEventListener("keydown", onSpace);
    onUnmounted(() => {
      window.removeEventListener("hashchange", onHash);
      window.removeEventListener("journal:changed", loadOverview);
      window.removeEventListener("keydown", onSpace);
      window.removeEventListener("pointerdown", sawPointer, true);
      window.removeEventListener("keydown", sawKeyMove, true);
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
      // the agent answering a message opens that reply on its own, not the whole message
      if (e.kind === "message" && e.text === "Answered your question" && e.n && envName.value) return `#/env/${envName.value}/messages/r/${e.n}`;
      const page = ACTIVITY_PAGES[e.kind];
      if (!page || !envName.value) return null;
      return `#/env/${envName.value}/${page}` + (e.n ? `/${e.n}` : "");
    };
    const setAuto = (on) => {
      activity.data.auto = on;
      postJSON("/api/journal/settings", { auto: on })
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
    // the away digest: stamped when the tab is hidden or loses focus, shown once when the user comes back after a minute or more
    let leftAt = 0;
    const onLeave = () => { leftAt = leftAt || Date.now(); };
    const onReturn = () => {
      if (document.visibilityState !== "visible" || !leftAt) return;
      const since = leftAt;
      leftAt = 0;
      if (Date.now() - since < 60000) return;
      activity.reload();
      setTimeout(() => {
        if (!awayLines(activity.data && activity.data.events, since).length) return;
        Object.assign(AWAY, { open: true, since, back: Date.now() });
      }, 1500);
    };
    const onHidden = () => { if (document.hidden) onLeave(); else onReturn(); };
    document.addEventListener("visibilitychange", onHidden);
    window.addEventListener("blur", onLeave);
    window.addEventListener("focus", onReturn);
    // Esc peels the digest before anything under it; the quick menu takes its own Esc first
    const onAwayEscape = (e) => {
      if (e.key !== "Escape" || !AWAY.open || QUICK.open) return;
      e.preventDefault();
      e.stopPropagation();
      AWAY.open = false;
    };
    window.addEventListener("keydown", onAwayEscape, true);
    onUnmounted(() => {
      document.removeEventListener("visibilitychange", onHidden);
      window.removeEventListener("blur", onLeave);
      window.removeEventListener("focus", onReturn);
      window.removeEventListener("keydown", onAwayEscape, true);
    });
    const away = computed(() => {
      const since = AWAY.since || Date.now() - 86400000;
      const inbox = NAV.find((item) => item.key === "inbox");
      const waiting = navCount(inbox);
      return { lines: awayLines(activity.data && activity.data.events, since),
               for: AWAY.since ? `${spanText((AWAY.back || Date.now()) - AWAY.since)} away` : "last 24 hours",
               waiting: waiting ? `${waiting} waiting on you` : "Nothing waiting on you" };
    });
    const openInbox = () => { AWAY.open = false; location.hash = `#/env/${envName.value}/messages`; };
    watchEffect(() => { SHELL.env = envName.value; SHELL.activity = activity.data; });
    // a nav count may add several of the environment's counts, as the Inbox does for questions and suggestions
    const navCount = (item) => (envRow.value ? [].concat(item.count).reduce((sum, k) => sum + (envRow.value[k] || 0), 0) : 0);
    SHELL.setAuto = setAuto;
    const envSettings = useFetch(() => envName.value && `/api/env/${envName.value}/environment`);
    watchEffect(() => { RETENTION.table = envSettings.data ? envSettings.data.retention || null : null; });
    return { making, makeEnv, QUICK, TOAST, openQuick, OVERLAY, closeOverlay, route, ov, envName, envRow, NAV, navCount, key, activity, folded, fold, activityHref, ACTIVITY, setAuto, journals, away, AWAY, openInbox, identity, strip, colorOf, stripMenu, loadJournals, journalsOrdered, upgrade, askUpgrade };
  },
  template: `
    <div :class="['app', {striped: strip}]" :style="strip ? {'--strip': strip.color, '--strip-label': strip.label} : null">
      <div v-if="strip" class=project-strip role=presentation>
        <button type=button class=project-strip-name :aria-expanded="stripMenu.open" title="Journals running on this machine"
          @click="stripMenu.open = !stripMenu.open; loadJournals()">{{ strip.name }}</button>
      </div>
      <div v-if="strip && stripMenu.open" class="drop strip-drop">
        <JournalsDropdown :rows="journalsOrdered" :color-of="colorOf" :pick="() => { stripMenu.open = false; }"/>
      </div>
      <aside class=side>
        <div v-if="journals.list.length > 1" class="drop-wrap journal-switch">
          <button type=button class=project :aria-expanded="journals.open" :title="'Journals running on this machine'"
            @click="journals.open = !journals.open">
            <span class=logo>{{ (envName || 'j').charAt(0).toUpperCase() }}</span>{{ envName || 'journal' }}
            <span :class="['fold', {shut: !journals.open}]"></span>
          </button>
          <div v-if="journals.open" class=drop>
            <JournalsDropdown :rows="journalsOrdered" :color-of="colorOf" :pick="() => { journals.open = false; }"/>
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
            <Icon :name="item.icon || item.key"/>{{ item.label }}
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
          <!-- MAKING ONE IS A LINE OF WORK BEGINNING, and it belonged next to the list of them.
               It creates and moves nobody: no session in a browser is anyone's to move. -->
          <button v-if="!folded.environments" type=button class="item item-new" @click="making.open = true">
            <Icon name="plus"/>New environment</button>
          <form v-if="!folded.environments && making.open" class=env-new @submit.prevent="makeEnv">
            <input ref=envName v-model="making.name" class=field placeholder="a short name" autofocus
              @keydown.escape="making.open = false">
            <p v-if="making.error" class=error>{{ making.error }}</p>
          </form>
        </div>
        <div class="side-foot side-foot-row">
          <a v-if="identity.data && identity.data.version" class=side-foot-version href="#/about" title="Version and changelog">Agent journal {{ identity.data.version }}</a>
          <button type=button class=space-hint title="Quick menu: search actions, or press space again to message the agent" @click="openQuick">space</button>
        </div>
      </aside>
      <main class=main>
        <Transition name=page mode=out-in>
          <div class=page-shell :key="key"><component :is="route.view" v-bind="route.params"/></div>
        </Transition>
      </main>
      <Peek v-if="OVERLAY.kind && OVERLAY.kind !== 'file' && envName" :key="'overlay' + OVERLAY.kind + OVERLAY.n" :env="envName" :kind="OVERLAY.kind" :n="OVERLAY.n"
        :close="closeOverlay" :reloaded="reloadActivity"/>
      <FileReader_ v-if="OVERLAY.kind === 'file' && OVERLAY.file" :key="OVERLAY.file.url" :file="OVERLAY.file" :close="closeOverlay"/>
      <Lightbox v-if="OVERLAY.kind === 'image' && OVERLAY.images.length" :images="OVERLAY.images" :at="OVERLAY.at" :close="closeOverlay"/>
      <QuickMenu v-if="QUICK.open && envName" :env="envName"/>
      <div v-if="TOAST.text" class=quick-toast role=status>{{ TOAST.text }}</div>
      <aside v-if="(activity.data && ACTIVITY.shown) || (ov.data && ov.data.update)" class=activity-dock>
        <ActivityPanel v-if="activity.data && ACTIVITY.shown" :data="activity.data" :href="activityHref" :env="envName"/>
        <!-- it does not close: the journal serving this page is out of date, and nothing but the upgrade makes that untrue -->
        <div v-if="ov.data && ov.data.update" class=update-bar>
          <p class=update-bar-head>Agent journal {{ ov.data.update.version }} is available</p>
          <p class=update-bar-note>This project has {{ ov.data.update.have }}<template v-if="ov.data.update.headline"> — {{ ov.data.update.headline }}</template></p>
          <p v-if="upgrade.said" class=update-bar-how>{{ upgrade.said }}</p>
          <p v-else-if="upgrade.error" class=error>{{ upgrade.error }}</p>
          <template v-else>
            <button type=button class=update-bar-go :disabled="upgrade.busy" @click="askUpgrade(ov.data.update.version)">Upgrade now</button>
            <p class=update-bar-how>or from the terminal: <code>journal upgrade</code></p>
          </template>
        </div>
      </aside>
      <div v-if="AWAY.open && envName" class=away-card role=status>
        <div class=away-head>
          <span class=away-dot></span><span class=away-title>While you were away</span><span class=away-for>{{ away.for }}</span>
          <button type=button class=away-close aria-label="Dismiss" title="Dismiss" @click="AWAY.open = false"><Icon name="close"/></button>
        </div>
        <div class=away-lines>
          <div v-for="d in away.lines" :key="d.key" class=away-line><span>{{ d.text }}</span><span class=away-age>{{ d.age }}</span></div>
          <p v-if="!away.lines.length" class="away-line muted">Nothing new from the agent.</p>
        </div>
        <div class=away-foot><span>{{ away.waiting }}</span><button type=button class=away-go @click="openInbox">Open messages</button></div>
      </div>
    </div>`,
};

const app = createApp(App);
// a primitive nearly every panel and page renders, so it is registered once rather than imported 25 times
for (const [name, part] of Object.entries({ FetchState, RefChip, CommitChip, SessionChip })) app.component(name, part);
app.config.globalProperties.$md = renderMarkdown;
app.config.globalProperties.$human = humanSize;
app.config.globalProperties.$refHref = refHref;
app.config.globalProperties.$openRef = openRef;
app.config.globalProperties.$openImages = openImages;
// the row pills are built as HTML inside rendered markdown, so their click has no component to
// reach — one global is how a string in `v-html` gets back to the overlay every other chip uses
window.__openRef = (event, href) => { openRef(event, href); return !event.defaultPrevented; };
app.config.globalProperties.$linkify = linkify;
app.mount("#app");
