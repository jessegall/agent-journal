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
  { re: /^\/env\/([a-z0-9-]+)\/(?:messages|inbox)(\/archive)?(?:\/(\d+))?$/, view: "Inbox", params: ["env", "archive", "n"] },
  { re: /^\/env\/([a-z0-9-]+)\/questions(\/archive)?(?:\/(\d+))?$/, view: "Questions", params: ["env", "archive", "n"] },
  { re: /^\/env\/([a-z0-9-]+)\/reports(\/archive)?(?:\/(\d+|new))?$/, view: "Reports", params: ["env", "archive", "n"] },
  { re: /^\/env\/([a-z0-9-]+)\/suggestions(\/archive)?(?:\/(\d+))?$/, view: "Suggestions", params: ["env", "archive", "n"] },
  { re: /^\/env\/([a-z0-9-]+)\/work(\/archive)?(?:\/(\d+|new))?$/, view: "Work", params: ["env", "archive", "n"] },
  { re: /^\/env\/([a-z0-9-]+)\/reminders(\/archive)?(?:\/(\d+|new))?$/, view: "Reminders", params: ["env", "archive", "n"] },
  { re: /^\/env\/([a-z0-9-]+)\/docs(?:\/(new))?$/, view: "EnvDocs", params: ["env", "n"] },
  { re: /^\/env\/([a-z0-9-]+)\/settings$/, view: "Settings", params: ["env"] },
  { re: /^\/env\/([a-z0-9-]+)\/files$/, view: "Files", params: ["env"] },
  { re: /^\/env\/([a-z0-9-]+)\/commits\/([0-9a-f]{7,40})$/, view: "Commit", params: ["env", "sha"] },
  { re: /^\/env\/([a-z0-9-]+)\/search$/, view: "Search", params: ["env"] },
  { re: /^\/rules(\/archive)?(?:\/(\d+|new))?$/, view: "Rules", params: ["archive", "n"] },
  { re: /^\/tools(?:\/(\d+|new))?$/, view: "Tools", params: ["n"] },
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
  if (kind === "suggestion") return `#/env/${env}/suggestions/${num}`;
  if (kind === "reminder") return `#/env/${env}/reminders`;
  if (kind === "inbox") return `#/env/${env}/messages/${num}`;
  if (kind === "work") return `#/env/${env}/work`;
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
  return (i === 0 ? n : n.toFixed(1)) + " " + units[i];
}

// ─────────────────────────────────────────────────────────────── markdown
// Hand-written, no dependency. The source is escaped first, so every tag added below is added
// to already-safe text.
function _escapeHtml(s) {
  return String(s ?? "")
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function _mdInline(text) {
  text = text.replace(/`([^`]+)`/g, (_, c) => `<code>${c}</code>`);
  text = text.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  text = text.replace(/(^|[^*])\*([^*]+)\*(?!\*)/g, "$1<em>$2</em>");
  text = text.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, t, href) => `<a href="${href}" target="_blank" rel="noopener">${t}</a>`);
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
const HELP_TOPICS = { Todos: "todos", Inbox: "messages", Questions: "questions", Suggestions: "suggestions", Reports: "reports",
  Pins: "pins", Reminders: "reminders", Work: "work", EnvDocs: "docs", Docs: "docs", DocDetail: "docs", Rules: "rules", Tools: "tools",
  Files: "files" };
const HELP_CACHE = {};

// ─────────────────────────────────────────────────────────────── icons
const Icon = {
  props: ["name"],
  template: `
    <svg class=ico viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">
      <template v-if="name === 'todos'"><circle cx="8" cy="8" r="5.75"/><path d="M5.6 8.1l1.7 1.7 3.2-3.5"/></template>
      <path v-else-if="name === 'pins'" d="M8 14V9.5M5 2.5h6M6 2.5v3.5L4 9.5h8L10 6V2.5"/>
      <template v-else-if="name === 'suggestions'"><path d="M8 2.5a4 4 0 0 0-2.3 7.3V11.5h4.6V9.8A4 4 0 0 0 8 2.5z"/><path d="M6.3 13.5h3.4"/></template>
      <template v-else-if="name === 'info'"><circle cx="8" cy="8" r="5.75"/><path d="M8 7.3v3.4"/><path d="M8 5.1v.1"/></template>
      <template v-else-if="name === 'bell'"><path d="M4.5 11V7.5a3.5 3.5 0 0 1 7 0V11l1 1.5h-9z"/><path d="M6.8 13.5a1.3 1.3 0 0 0 2.4 0"/></template>
      <template v-else-if="name === 'activity'"><rect x="2.5" y="3" width="11" height="10" rx="1.5"/><path d="M9.5 3v10M11 6h1M11 8.5h1"/></template>
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
      <template v-else-if="name === 'tools'"><path d="M9.8 2.3a3 3 0 0 0-3.6 3.9L2.5 9.9a1.2 1.2 0 0 0 1.7 1.7l3.7-3.7a3 3 0 0 0 3.9-3.6L10 6 8.6 5.4 8 4l1.8-1.7Z"/></template>
      <template v-else-if="name === 'search'"><circle cx="7" cy="7" r="4.25"/><path d="M10.25 10.25L13.5 13.5"/></template>
      <template v-else-if="name === 'settings'"><circle cx="8" cy="8" r="2"/><path d="M8 1.75v1.5M8 12.75v1.5M1.75 8h1.5M12.75 8h1.5M3.6 3.6l1.05 1.05M11.35 11.35l1.05 1.05M3.6 12.4l1.05-1.05M11.35 4.65l1.05-1.05"/></template>
    </svg>`,
};

// A STATUS IS A PILL: an outline when open, filling as it moves, struck through when blocked.
const STATUS_COLOR = {
  progress: "#5b8def", blocked: "#d9a441", done: "#6fae7d", waiting: "#a78bfa", open: "#8b8e96", withdrawn: "#55575d",
};
const StatusIcon = {
  props: ["kind"],
  setup(props) {
    const color = computed(() => STATUS_COLOR[props.kind] || STATUS_COLOR.open);
    return { color };
  },
  template: `<span class=dot :style="{borderColor: color}" role=img :aria-label="kind"></span>`,
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
const TopBar = {
  props: { crumbs: { type: Array, default: () => [] } },
  components: { Icon },
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
    const notes = useFetch(() => drop.open && env.value && `/api/env/${env.value}/notifications`);
    const ideas = useFetch(() => drop.open && env.value && `/api/env/${env.value}/suggestions`);
    const asks = useFetch(() => drop.open && env.value && `/api/env/${env.value}/questions`);
    const openQuestions = computed(() => (asks.data || []).filter((q) => q.status === "open"));
    const suggestions = computed(() => (ideas.data || []).filter((s) => s.status === "open"));
    const changed = () => { notes.reload(); window.dispatchEvent(new CustomEvent("journal:changed")); };
    const readOne = (x) => send("POST", `/api/env/${env.value}/notifications/${x.n}/read`).then(changed);
    const readAll = () => send("POST", `/api/env/${env.value}/notifications/readall`).then(changed);
    const outside = (e) => { if (!e.target.closest(".drop-wrap")) drop.open = false; };
    watchEffect((onCleanup) => {
      if (!drop.open) return;
      document.addEventListener("mousedown", outside);
      onCleanup(() => document.removeEventListener("mousedown", outside));
    });
    const activity = ACTIVITY;
    const toggleActivity = () => setActivityShown(!ACTIVITY.shown);
    // what the agent keeps lives here as icons; the one whose page is open is lit
    const view = parseHash().view || "";
    const KEPT = [{ key: "suggestions", label: "Suggestions", view: "Suggestions" },
                  { key: "reports", label: "Reports", view: "Reports" }, { key: "pins", label: "Pins", view: "Pins" },
                  { key: "reminders", label: "Reminders", view: "Reminders" }];
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
    return { env, waiting, openCount, drop, notes, suggestions, asks, openQuestions, readOne, readAll, activity, toggleActivity, view, KEPT,
             helpTopic, help, helpDialog, openHelp, closeHelp };
  },
  template: `
    <div class=top>
      <div class=crumb>
        <template v-for="(c, i) in crumbs" :key="i">
          <span v-if="i" class=sep>/</span><b v-if="i === crumbs.length - 1">{{ c }}</b><span v-else>{{ c }}</span>
        </template>
        <button v-if="helpTopic" type=button class="icon-btn help-btn" :title="'What are ' + crumbs[crumbs.length - 1] + '?'"
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
          <span class=tool-wrap>
            <a :class="['icon-btn', {on: view === 'Questions'}]" :href="'#/env/' + env + '/questions'" title="Questions" aria-label="Questions"><Icon name="questions"/></a>
            <span v-if="openCount" class=tool-badge>{{ openCount }}</span>
          </span>
          <a v-for="k in KEPT" :key="k.key" :class="['icon-btn', {on: view === k.view}]" :href="'#/env/' + env + '/' + k.key"
            :title="k.label" :aria-label="k.label" :aria-current="view === k.view ? 'page' : null"><Icon :name="k.key"/></a>
          <div class=drop-wrap>
            <button type=button :class="['icon-btn', {on: drop.open}]" title="Notifications" aria-label="Notifications"
              :aria-expanded="drop.open" @click="drop.open = !drop.open">
              <Icon name="bell"/><span v-if="waiting" class=tool-badge>{{ waiting }}</span>
            </button>
            <div v-if="drop.open" class=drop>
              <div class=drop-head><span>Notifications</span>
                <button v-if="notes.data && notes.data.length" type=button class="btn more" @click="readAll">Mark all read</button></div>
              <p v-if="!(notes.data && notes.data.length) && !suggestions.length && !openQuestions.length" class="muted drop-empty">Nothing waiting.</p>
              <a v-for="q in openQuestions" :key="'q' + q.n" class=drop-row @click="drop.open = false"
                :href="(q.links && q.links.length && $refHref(q.links[0].ref, env)) || '#/env/' + env + '/questions/' + q.n">
                <span class=drop-kind>Question {{ q.n }}</span><span class=drop-text>{{ q.text }}</span>
              </a>
              <a v-for="s in suggestions" :key="'s' + s.n" class=drop-row :href="'#/env/' + env + '/suggestions/' + s.n" @click="drop.open = false">
                <span class=drop-kind>Suggestion {{ s.n }}</span><span class=drop-text>{{ s.title }}</span>
              </a>
              <div v-for="x in notes.data || []" :key="'n' + x.n" class=drop-row>
                <span class=drop-text>{{ x.text }}</span>
                <span class=drop-meta>{{ x.age || 'just now' }}
                  <a v-if="x.about && $refHref(x.about, env)" class=chip :href="$refHref(x.about, env)" @click="drop.open = false">{{ x.about_label }}</a>
                  <button type=button class="btn more" @click="readOne(x)">Mark read</button>
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
    </div>`,
};

const Panel = {
  props: ["label", "close", "onClose", "link"],
  components: { Icon },
  template: `
    <aside class=panel>
      <div class=panel-top><a v-if="link" class=panel-link :href="link" title="Open the page">{{ label }}</a><span v-else>{{ label }}</span>
        <button v-if="onClose" type=button class=icon-btn title="Close" @click="onClose"><Icon name="close"/></button>
        <a v-else class=icon-btn :href="close" title="Close"><Icon name="close"/></a></div>
      <div class=panel-body><slot/></div>
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
          <span v-if="q.pick === i + 1" class=option-pick>Agent's pick</span>{{ o.label }}
          <span v-if="o.description" class=option-description>{{ o.description }}</span>
          <code v-if="o.code" class=option-code>{{ o.code }}</code></button>
        <div v-if="!locked" role=button :tabindex="state.answering ? -1 : 0" :aria-pressed="state.picked === CUSTOM"
          :class="['option', 'option-custom', {picked: state.picked === CUSTOM}]"
          @click="pick(CUSTOM)" @keydown.enter.self.prevent="pick(CUSTOM)" @keydown.space.self.prevent="pick(CUSTOM)">
          Custom answer
          <textarea v-if="state.picked === CUSTOM" v-model="state.custom" placeholder="Write your answer" aria-label="Your custom answer"
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
  props: { rows: { type: Array, default: () => [] }, env: { type: String, default: "" } },
  components: { StatusIcon, QuestionAnswer },
  setup() { return { questionKind }; },
  template: `
    <div v-if="rows && rows.length">
      <p class=section-label>Questions</p>
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
            <div>{{ c.text }}</div>
            <div class=comment-meta>{{ c.source === 'web' ? 'You' : 'The agent' }} · {{ c.age || 'just now' }} · {{ c.done ? 'Handled' : c.told ? 'Seen by the agent' : 'Not seen yet' }}</div>
          </div>
          <div v-if="c.done" class="comment-card comment-reply">
            <div>{{ c.done }}</div>
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
    const state = reactive({ sort: {}, pages: {}, held: {}, arrived: {} });
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
      const was = Object.fromEntries(before.map((r) => [rowKey(r), { group: groupOf(r), row: r }]));
      const now = new Set(rows.map(rowKey));
      const lit = (bag, k, value) => { bag[k] = value; setTimeout(() => { delete bag[k]; }, HOLD_MS); };
      rows.forEach((r) => {
        const k = rowKey(r);
        if (!was[k]) lit(state.arrived, k, true);
        else if (was[k].group !== groupOf(r)) lit(state.held, k, was[k]);
      });
      Object.entries(was).forEach(([k, v]) => { if (!now.has(k)) lit(state.held, k, v); });
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
    const closable = computed(() => props.groups.some((g) => g.closed));
    const archived = computed(() => sections.value.reduce((sum, g) => sum + g.total, 0));
    const cols = computed(() => {
      const c = props.columns;
      return [c.priority && "22px", c.status && "22px", c.num && (c.numWidth || "44px"), c.question && "16px", "minmax(0, 1fr)",
              c.cite && "var(--cite-col, minmax(0, 180px))", c.age && "var(--age-col, 112px)"].filter(Boolean).join(" ");
    });
    const setSort = (key, by, dir) => { state.sort[key] = { by, dir }; };
    const more = (key) => { state.pages[key] = (state.pages[key] || 1) + 1; };
    const open = (event, row) => { if (props.pick) { event.preventDefault(); props.pick(row); } };
    const moving = (r) => !!state.held[rowKey(r)];
    const fresh = (r) => !!state.arrived[rowKey(r)];
    return { state, sections, closable, archived, cols, sortOf, setSort, more, open, moving, fresh };
  },
  template: `
    <div v-if="bar" class=viewbar>
      <span v-if="rows && archive">{{ archived }} archived</span>
      <span v-else-if="rows && count">{{ count(rows) }}</span>
      <span class=viewbar-tools>
        <a v-if="home && closable" :class="['btn', 'flush', {on: archive}]" :href="archive ? home : home + '/archive'"
          :title="archive ? 'Back to the list' : 'Items closed more than a week ago'">{{ archive ? 'Close archive' : 'Archive' }}</a>
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
            <span v-else class=sort-field>{{ sorts[0].label }}</span>
            <button type=button class="icon-btn sort-dir"
              :title="sortOf(g.key).dir === 'asc' ? 'Ascending — click for descending' : 'Descending — click for ascending'"
              :aria-label="sortOf(g.key).dir === 'asc' ? 'Sorted ascending' : 'Sorted descending'"
              @click="setSort(g.key, sortOf(g.key).by, sortOf(g.key).dir === 'asc' ? 'desc' : 'asc')">
              <Icon :name="sortOf(g.key).dir === 'asc' ? 'sort-asc' : 'sort-desc'"/>
            </button>
          </span>
        </div>
        <TransitionGroup tag="div" class=rows name="row" appear>
        <a v-for="(r, i) in g.rows" :key="r.n ?? r.name" :class="['row', 'lrow', {sel: selected && selected(r), struck: columns.struck && columns.struck(r), moving: moving(r), fresh: fresh(r)}]"
          :style="{gridTemplateColumns: cols, '--i': i}" :href="href(r)" @click="open($event, r)">
          <PriorityIcon v-if="columns.priority" :value="columns.priority(r)"/>
          <StatusIcon v-if="columns.status" :kind="columns.status(r)"/>
          <span v-if="columns.num" class=num>{{ columns.num(r) }}</span>
          <span v-if="columns.question" :class="['qmark', columns.question(r).state]" :title="columns.question(r).title"
            :aria-label="columns.question(r).title || null"><Icon v-if="columns.question(r).state" name="questions"/></span>
          <div class=stack><div class=title>{{ columns.title(r) }}</div><div v-if="columns.sub && columns.sub(r)" class=sub>{{ columns.sub(r) }}</div></div>
          <span v-if="columns.cite" class=cite>{{ columns.cite(r) }}</span>
          <span v-if="columns.age" class=age>{{ columns.age(r) }}</span>
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
  columns: { status: (m) => (m.status === "waiting" ? "waiting" : "done"), num: (m) => `#${m.n}`, title: (m) => m.text,
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
  groups: [{ key: "draft", label: "Draft", kind: "open", match: (d) => !d.superseded_by && d.status !== "final" },
           { key: "final", label: "Final", kind: "done", match: (d) => !d.superseded_by && d.status === "final" },
           { key: "superseded", label: "Superseded", kind: "withdrawn", match: (d) => d.superseded_by },
           { key: "archived", label: "Archived", kind: "withdrawn", match: (d) => d.archived && !d.superseded_by }],
  columns: { num: (d) => `#${d.n}`, title: (d) => d.title, sub: (d) => d.abstract, age: (d) => d.age, struck: (d) => d.superseded_by,
             cite: (d) => (d.attachments ? (d.attachments === 1 ? "1 file" : `${d.attachments} files`) : "") },
  count: (rows) => `${rows.filter((d) => !d.archived).length} catalogued`, name: "docs",
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
                <a v-if="e.kind === 'commit'" class="chip sha" :href="'#/env/' + env + '/commits/' + e.sha" :title="'What commit ' + e.sha.slice(0, 7) + ' covered'">{{ e.sha.slice(0, 7) }}</a><span v-if="e.text && e.kind !== 'started'"> — {{ e.text }}</span></span>
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
    const onAnswered = (data) => { item.data = data; if (props.reloaded) props.reloaded(); };
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
    const done = panelDone(props, item);
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
        <div class="prose message">{{ item.data.text }}</div>
        <dl class=props>
          <dt>Status</dt><dd><StatusIcon :kind="item.data.status === 'waiting' ? 'waiting' : 'done'"/>{{ item.data.status === 'waiting' ? 'Waiting to be processed' : item.data.status === 'moved' ? 'Moved to ' + item.data.moved_to : item.data.status === 'archived' ? 'Archived: ' + item.data.archived : 'Processed' }}</dd>
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
            <div v-for="(r, i) in item.data.replies" :key="i" class=sub>
              <div class=muted>{{ r.who === 'the agent' ? 'The agent' : 'You' }} · {{ r.age || 'just now' }}</div>
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
        <p v-else-if="item.data.status === 'waiting'" class="prose muted">Not processed yet. At its next stop the agent splits it into parts and records what each became.</p>
        <Comments :about="'message ' + item.data.n" :env="env" :key="'c-message' + item.data.n"/>
      </template>
    </Panel>`,
};

const WorkPanel = {
  props: PANEL_PROPS,
  components: { Panel, ActionBar },
  setup(props) {
    const api = computed(() => `/api/env/${props.env}/work`);
    const item = useFetch(() => props.env && props.n && `${api.value}/${props.n}`);
    const actions = computed(() => {
      const w = item.data;
      if (!w || w.ended) return [];
      const url = `${api.value}/${w.n}`;
      return [
        { label: "Add note", method: "PATCH", url, submit: "Add", fields: [{ name: "text", label: "Where it got to", kind: "area" }] },
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
              <span class=log-text><a class="chip sha" :href="'#/env/' + env + '/commits/' + c.sha" :title="'What commit ' + c.sha.slice(0, 7) + ' covered'">{{ c.sha.slice(0, 7) }}</a> {{ c.subject }}</span>
            </div>
          </div>
        </div>
        <div v-if="item.data.notes.length">
          <p class=section-label>Notes</p>
          <div class=linked><div v-for="(note, i) in item.data.notes" :key="i" class=sub>{{ note.text }}</div></div>
        </div>
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
          fields: [{ name: "note", label: "A note for the to-do (optional)" }],
          note: "A to-do is filed from it." },
        { label: "Adjust", method: "POST", url: `${url}/adjust`, submit: "Accept with this change",
          fields: [{ name: "change", label: "What to do differently", kind: "area" }],
          note: "A to-do is filed from it, carrying your change." },
        { label: "Decline", method: "POST", url: `${url}/decline`, danger: true, submit: "Decline",
          fields: [{ name: "why", label: "Why not (optional)" }],
          note: "The agent does not suggest it again." },
      ];
    });
    const done = panelDone(props, item);
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
  components: { TopBar, ResourceList, SuggestionPanel },
  setup(props) {
    const home = computed(() => `#/env/${props.env}/suggestions`);
    const base = computed(() => home.value + (props.archive || ""));
    const list = useFetch(() => props.env && `/api/env/${props.env}/suggestions?all=1`);
    return { list, home, base, SUGGESTION_LIST };
  },
  template: `
    <TopBar :crumbs="archive ? [env, 'Suggestions', 'Archive'] : [env, 'Suggestions']"/>
    <div class=body>
      <div class=list>
        <ResourceList v-bind="SUGGESTION_LIST" :archive="!!archive" :home="home" :rows="list.data" :loading="list.loading" :error="list.error"
          :href="(s) => base + '/' + s.n" :selected="(s) => String(s.n) === n"/>
      </div>
      <SuggestionPanel v-if="n" :key="'suggestion' + n" :env="env" :n="n" :close="base" :base="base" :reloaded="list.reload"/>
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
const Inbox = {
  props: ["env", "archive", "n"],
  components: { TopBar, Compose, ResourceList, MessagePanel },
  setup(props) {
    const api = computed(() => `/api/env/${props.env}/inbox`);
    const home = computed(() => `#/env/${props.env}/messages`);
    const base = computed(() => home.value + (props.archive || ""));
    const list = useFetch(() => props.env && `${api.value}?all=1`);
    const send = (text, files) => postJSON(api.value, { text, files }).then(() => { list.reload(); changed(); });
    // a message only reaches an agent at its next hook event; say so when none is working here
    const live = computed(() => {
      const row = OVERVIEW.data ? OVERVIEW.data.environments.find((e) => e.name === props.env) : null;
      return !!(row && row.active);
    });
    const hint = computed(() => (live.value ? "The agent is told at its next stop"
      : "No agent is working on this environment right now; the message waits until a session picks it up"));
    return { list, send, home, base, MESSAGE_LIST, hint };
  },
  template: `
    <TopBar :crumbs="archive ? [env, 'Messages', 'Archive'] : [env, 'Messages']"/>
    <div class=body>
      <div class=chat>
        <div class=list>
          <ResourceList v-bind="MESSAGE_LIST" :archive="!!archive" :home="home" :rows="list.data" :loading="list.loading" :error="list.error"
            :href="(m) => base + '/' + m.n" :selected="(m) => String(m.n) === n"/>
        </div>
        <div v-if="!archive" class="compose-wrap at-bottom">
          <Compose placeholder="Leave a message for the agent: an instruction, a follow-up, anything"
            submit="Send" :hint="hint" :send="send" :attach="true" :autofocus="!n"/>
        </div>
      </div>
      <MessagePanel v-if="n" :key="'message' + n" :env="env" :n="n" :close="base" :base="base" :reloaded="list.reload"/>
    </div>`,
};

const REPORT_LIST = {
  groups: [{ key: "reports", label: "Reports", kind: "open", match: (r) => !r.archived },
           { key: "archived", label: "Archived", kind: "withdrawn", closed: true, match: (r) => r.archived }],
  columns: { num: (r) => `#${r.n}`, title: (r) => r.title, sub: (r) => r.gist, cite: (r) => r.about_label, age: (r) => r.age,
             struck: (r) => r.archived },
  count: (rows) => `${rows.filter((r) => !r.archived).length} reports`, name: "reports",
  empty: "No reports on this environment yet.",
};

const Reports = {
  props: ["env", "archive", "n"],
  components: { TopBar, Panel, ActionBar, ResourceList },
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
      <TopBar :crumbs="[env, 'Reports', '#' + n]"><a class="btn new" :href="base">All reports</a></TopBar>
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
      <TopBar :crumbs="archive ? [env, 'Reports', 'Archive'] : [env, 'Reports']"/>
      <div class=body>
        <div class=list>
          <ResourceList v-bind="REPORT_LIST" :archive="!!archive" :home="home" :rows="list.data" :loading="list.loading" :error="list.error"
            :href="(r) => base + '/' + r.n">
            <template #tools><a class="btn new" :href="home + '/new'">New report</a></template>
          </ResourceList>
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
    components: { TopBar, ActionBar, ResourceList },
    setup(props) {
      const s = useFetch(() => url(props));
      const creating = computed(() => [{
        label: "New doc", method: "POST", url: url(props), submit: "Add doc", leave: true,
        follow: (body) => { const m = /doc (\d+)/.exec(body.message || ""); return m ? `#/docs/${m[1]}` : null; },
        fields: [{ name: "title", label: "Title" }, { name: "abstract", label: "Abstract, in one line" },
                 { name: "body", label: "Text", kind: "area" }],
      }]);
      const done = (body, a) => settle(body, a, base(props), s);
      return { s, creating, done, crumbs: computed(() => crumbs(props)), base: computed(() => base(props)), empty, DOC_LIST };
    },
    template: `
      <TopBar :crumbs="crumbs"/>
      <div class=body><div class=list>
        <div v-if="n === 'new'" class=compose-wrap><ActionBar :actions="creating" open="New doc" :done="done"/></div>
        <ResourceList v-bind="DOC_LIST" :empty="empty" :rows="s.data" :loading="s.loading" :error="s.error" :href="(d) => '#/docs/' + d.n">
          <template #tools><a class="btn new" :href="base + '/new'">New doc</a></template>
        </ResourceList>
      </div></div>`,
  };
}

const Docs = docList({ crumbs: () => ["Project", "Documents"], url: () => "/api/docs?archived=1", base: () => "#/docs",
                       empty: "No project-wide docs are catalogued." });
const EnvDocs = docList({ crumbs: (p) => [p.env, "Documents"], url: (p) => p.env && `/api/env/${p.env}/docs?archived=1`,
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
              <span>{{ c.text }}</span>
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
  components: { TopBar, Icon, StatusIcon, PriorityIcon, Peek, ResourceList, RadioGroup },
  setup(props) {
    const url = (tail) => () => props.env && `/api/env/${props.env}${tail}`;
    const summary = useFetch(url(""));
    const work = useFetch(url("/work"));
    const allWork = useFetch(url("/work?all=1"));
    const todos = useFetch(url("/todos"));
    const inbox = useFetch(url("/inbox"));
    const questions = useFetch(url("/questions"));
    const notes = useFetch(url("/notifications"));
    const noted = () => { notes.reload(); changed(); };
    const readOne = (x) => send("POST", `/api/env/${props.env}/notifications/${x.n}/read`).then(noted);
    const readAll = () => send("POST", `/api/env/${props.env}/notifications/readall`).then(noted);
    const openTodos = { ...TODO_LIST, groups: TODO_LIST.groups.filter((g) => !g.closed) };
    const finishedTodos = { groups: [{ key: "finished", label: "", match: (t) => t.done }],
                            columns: { num: (t) => `#${t.n}`, title: (t) => t.title, age: (t) => t.done_age },
                            sorts: [{ key: "done", label: "Done" }], empty: "Nothing is done yet." };
    const waitingMessages = { ...MESSAGE_LIST, groups: [{ ...MESSAGE_LIST.groups[0], label: "" }] };
    const openQuestions = { ...QUESTION_LIST, groups: [{ ...QUESTION_LIST.groups[0], label: "" }] };
    const openWork = { ...WORK_LIST, groups: [{ ...WORK_LIST.groups[0], label: "" }] };
    // the last work that ended, newest first, shown small under the open work
    const endedWork = computed(() => (allWork.data || []).filter((w) => w.ended)
      .sort((a, b) => (a.ended < b.ended ? 1 : a.ended > b.ended ? -1 : 0)).slice(0, 3));
    const waiting = computed(() => (inbox.data || []).filter((m) => m.status === "waiting"));
    const asking = computed(() => (questions.data || []).filter((q) => q.status === "open"));
    const stats = computed(() => {
      const s = summary.data || {};
      const count = (status) => (todos.data ? todos.data.filter((t) => todoStatus(t) === status).length : undefined);
      const blocked = count("blocked");
      return [
        { key: "messages", label: "Message queue", n: s.inbox, icon: "inbox", path: "messages", hot: s.inbox },
        { key: "questions", label: "Questions for you", n: s.questions, icon: "questions", path: "questions", hot: s.questions },
        { key: "progress", label: "In progress", n: count("progress"), icon: "todos", path: "todos" },
        { key: "blocked", label: "Blocked", n: blocked, icon: "todos", path: "todos", hot: blocked },
      ];
    });
    const about = (q) => q.links.map((l) => l.label).join(", ");
    const view = reactive({ finished: false, kind: "", n: 0 });
    const peek = (kind, n) => { view.kind = kind; view.n = n; };
    const unpeek = () => { view.kind = ""; view.n = 0; };
    const picked = (kind) => (r) => view.kind === kind && view.n === r.n;
    const reloadAll = () => [work, todos, inbox, questions].forEach((f) => f.reload());
    return { work, allWork, endedWork, todos, inbox, questions, notes, readOne, readAll, reloadAll, view, peek, unpeek, picked, waiting, asking, stats, openTodos, finishedTodos,
             waitingMessages, openQuestions, openWork };
  },
  template: `
    <TopBar :crumbs="[env, 'Home']"/>
    <div class="body home-body"><div class=page><div class=home>
      <section v-if="notes.data && notes.data.length" class=notifications>
        <div class=home-head><h2>Notifications</h2><span class=n>{{ notes.data.length }} unread</span>
          <button type=button class="btn more" @click="readAll">Mark all read</button></div>
        <div class=block>
          <div v-for="x in notes.data" :key="x.n" class=note-row>
            <div class=note-text>{{ x.text }}
              <span class=muted> · {{ x.age || 'just now' }}</span>
              <a v-if="x.about && $refHref(x.about, env)" class=chip :href="$refHref(x.about, env)">{{ x.about_label }}</a>
            </div>
            <button type=button class=btn @click="readOne(x)">Mark read</button>
          </div>
        </div>
      </section>
      <div class=stats>
        <a v-for="s in stats" :key="s.key" :class="['stat', {hot: s.hot}]" :href="'#/env/' + env + '/' + s.path">
          <span class=stat-top><span>{{ s.label }}</span><Icon :name="s.icon"/></span>
          <span class=stat-n>{{ s.n ?? '–' }}</span>
        </a>
      </div>

      <section>
        <div class=home-head><h2>Open work</h2><span class=n>{{ work.data ? work.data.length : '' }}</span></div>
        <div class=block>
          <ResourceList v-bind="openWork" :bar="false" :rows="work.data" :loading="work.loading" :error="work.error"
            :href="(w) => '#/env/' + env + '/work/' + w.n" :pick="(w) => peek('work', w.n)" :selected="picked('work')"/>
        </div>
        <div v-if="endedWork.length" class=recent-ended>
          <a v-for="w in endedWork" :key="w.n" class=recent-ended-row :href="'#/env/' + env + '/work/' + w.n"
            @click.prevent="peek('work', w.n)" :title="w.subject">
            <span class=recent-ended-title>{{ w.subject }}</span>
            <span class=recent-ended-age>ended {{ w.ended_age || 'just now' }}</span>
          </a>
        </div>
      </section>

      <section v-if="waiting.length">
        <div class=home-head><h2>Messages</h2><span class=n>{{ waiting.length }} waiting</span>
          <a class=more :href="'#/env/' + env + '/messages'">All messages</a></div>
        <div class=block>
          <ResourceList v-bind="waitingMessages" :bar="false" :rows="inbox.data" :href="(m) => '#/env/' + env + '/messages/' + m.n"
            :pick="(m) => peek('message', m.n)" :selected="picked('message')"/>
        </div>
      </section>

      <section v-if="asking.length">
        <div class=home-head><h2>Questions</h2><span class=n>{{ asking.length }} open</span>
          <a class=more :href="'#/env/' + env + '/questions'">All questions</a></div>
        <div class=block>
          <ResourceList v-bind="openQuestions" :bar="false" :rows="questions.data" :href="(q) => '#/env/' + env + '/questions/' + q.n"
            :pick="(q) => peek('question', q.n)" :selected="picked('question')"/>
        </div>
      </section>

      <section>
        <div class=home-head><h2>To-dos</h2>
          <RadioGroup label="Which to-dos" :options="[{ value: 'open', label: 'Open' }, { value: 'done', label: 'Done' }]"
            :modelValue="view.finished ? 'done' : 'open'" @update:modelValue="(v) => (view.finished = v === 'done')"/>
          <a class=more :href="'#/env/' + env + '/todos'">All to-dos</a></div>
        <div class=block>
          <ResourceList v-if="view.finished" v-bind="finishedTodos" :bar="false" :limit="8" :rows="todos.data"
            :href="(t) => '#/env/' + env + '/todos/' + t.n" :pick="(t) => peek('todo', t.n)" :selected="picked('todo')"/>
          <ResourceList v-else v-bind="openTodos" :bar="false" :limit="5" :rows="todos.data" :loading="todos.loading" :error="todos.error"
            :href="(t) => '#/env/' + env + '/todos/' + t.n" :pick="(t) => peek('todo', t.n)" :selected="picked('todo')"/>
        </div>
      </section>
    </div></div>
    <Peek v-if="view.kind" :key="view.kind + view.n" :env="env" :kind="view.kind" :n="view.n" :close="unpeek" :reloaded="reloadAll"/>
    </div>`,
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
    const kept = () => { s.reload(); changed(); };
    const showing = computed(() => (s.data ? [{
      label: "Change", method: "POST", url: `${api.value}/settings`, submit: "Save",
      fields: [{ name: "activity_show", label: "Lines Activity shows", value: String(s.data.activity_show) },
               { name: "activity_keep", label: "Lines the activity log keeps", value: String(s.data.activity_keep) }],
      shape: (p) => ({ activity_show: parseInt(p.activity_show, 10), activity_keep: parseInt(p.activity_keep, 10) }),
    }] : []));
    return { s, auto, setAuto, removing, done, keeping, kept, showing };
  },
  template: `
    <TopBar :crumbs="[env, 'Settings']"/>
    <div class=page><div class=home>
      <p v-if="s.loading && !s.data" class=empty>Loading…</p>
      <p v-else-if="s.error" class=error>{{ s.error }}</p>
      <template v-else-if="s.data">
        <section>
          <div class=home-head><h2>Auto mode</h2></div>
          <div class=setting>
            <Switch label="Work through the to-do list without asking" :modelValue="s.data.auto" @update:modelValue="setAuto"/>
            <p class="prose muted">When this is on and nothing is open, the agent starts the next ready to-do by itself.</p>
            <p v-if="auto.error" class=error>{{ auto.error }}</p>
          </div>
        </section>
        <section>
          <div class=home-head><h2>Reports</h2></div>
          <div class=setting>
            <p class="prose muted">{{ (s.data.reports_archive_days ? 'A report is archived ' + s.data.reports_archive_days + ' day(s) after it is written. ' : 'Reports stay listed until you archive them. ') + 'Every report is removed for good 30 days after it is written.' }}</p>
            <ActionBar :actions="keeping" :done="kept" :key="'keep' + s.data.reports_archive_days"/>
          </div>
        </section>
        <section>
          <div class=home-head><h2>Activity</h2></div>
          <div class=setting>
            <p class="prose muted">Activity shows the last {{ s.data.activity_show }} line(s). The activity log keeps the last {{ s.data.activity_keep }} and removes older ones.</p>
            <ActionBar :actions="showing" :done="kept" :key="'show' + s.data.activity_show + '-' + s.data.activity_keep"/>
          </div>
        </section>
        <section>
          <div class=home-head><h2>Remove this environment</h2></div>
          <div class=setting>
            <p v-if="s.data.start" class="prose muted">New sessions start on this environment, so it cannot be removed. Make another environment the start environment first.</p>
            <ActionBar v-else :actions="removing" :done="done"/>
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
    return { list, sourceHref, sourceLabel };
  },
  template: `
    <TopBar :crumbs="[env, 'Files']"/>
    <div class=page>
      <div class=page-inner>
        <p v-if="list.loading && !list.data" class=empty>Loading…</p>
        <p v-else-if="list.error" class=error>{{ list.error }}</p>
        <p v-else-if="list.data && !list.data.length" class=empty>No files are stored on this environment yet. Files attached to a message or added to a document show here.</p>
        <div v-else-if="list.data" class=files-page>
          <div v-for="f in list.data" :key="f.url" class=files-row>
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
            <dt>Commit</dt><dd><span class="chip sha">{{ found.data.sha }}</span></dd>
            <dt>Made</dt><dd>{{ found.data.age || 'just now' }}</dd>
          </dl>
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
        </template>
      </div>
    </div>`,
};

const VIEWS = { Home, EnvHome, Todos, Pins, Rules, Inbox, Questions, Suggestions, Reports, Work, Reminders, Docs, EnvDocs, DocDetail, Settings, Search, Tools, Files, Commit, NotFound };

// ─────────────────────────────────────────────────────────────── the app shell
// open work lives on Home, so the sidebar has no entry of its own for it
const NAV = [
  { key: "home", label: "Home", views: ["EnvHome", "Work"], path: "", count: "notifications" },
  { key: "inbox", label: "Messages", views: ["Inbox"], path: "messages", count: "inbox" },
  { key: "todos", label: "To-dos", views: ["Todos"], path: "todos", count: "todos" },
  { key: "docs", label: "Documents", views: ["EnvDocs"], path: "docs", count: "docs" },
  { key: "files", label: "Files", views: ["Files"], path: "files" },
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
    const grow = () => { const el = box.value; if (!el) return; el.style.height = "auto"; el.style.height = Math.min(el.scrollHeight, 120) + "px"; };
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
    const outsideCrew = (e) => { if (!e.target.closest(".drop-wrap.crew")) crew.open = false; };
    watchEffect((onCleanup) => {
      if (!crew.open) return;
      document.addEventListener("mousedown", outsideCrew);
      onCleanup(() => document.removeEventListener("mousedown", outsideCrew));
    });
    return { accept, quick, box, grow, sendQuick, crew, agentsList, working };
  },
  template: `
    <div class=activity-panel>
      <div class=activity-head><span class=group-label>Activity</span>
        <span class=activity-head-tools>
          <span class="drop-wrap crew">
            <button type=button :class="['icon-btn', {on: crew.open}]" title="Agents working here" aria-label="Agents working here"
              :aria-expanded="crew.open" @click="crew.open = !crew.open; agentsList.reload()">
              <Icon name="agents"/><span v-if="working" class=tool-badge>{{ working }}</span>
            </button>
            <div v-if="crew.open" class=drop>
              <div class=drop-head><span>Agents on {{ env }}</span></div>
              <p v-if="!(agentsList.data && agentsList.data.length)" class="muted drop-empty">No agent is working on this environment.</p>
              <div v-for="a in agentsList.data || []" :key="a.kind + a.id" class=drop-row>
                <span class=drop-kind>{{ a.kind === 'subagent' ? 'Subagent' : 'Session' }} · {{ a.kind === 'subagent' ? (a.age_text || 'just now') : (a.working ? 'Working' : 'Idle') }}</span>
                <span class=drop-text>{{ a.name || (a.kind === 'subagent' ? 'Subagent ' + a.id : 'Session ' + a.id) }}<span v-if="a.parent" class=muted> · from session {{ a.parent }}</span></span>
              </div>
            </div>
          </span>
        </span>
      </div>
      <template v-if="data">
        <div class=activity-list>
          <template v-for="(e, i) in data.events" :key="i">
            <div v-if="e.needs === 'open' && href(e)" class="activity-row activity-alert">
              <a class=activity-alert-body :href="href(e)">
                <span class=activity-text>{{ e.text }}<span v-if="e.n" class=activity-n> {{ e.n }}</span><span v-if="e.detail" class=activity-d>{{ e.detail }}</span></span>
                <span v-if="e.title" class=activity-title>{{ e.title }}</span>
                <span class=activity-age>{{ e.by }} · {{ e.age || 'just now' }}</span>
              </a>
              <span class=activity-actions>
                <a v-if="e.kind === 'question'" class="btn warn" :href="href(e)">Answer</a>
                <template v-else-if="e.kind === 'suggestion'">
                  <button type=button class="btn warn" @click="accept(e)">Accept</button>
                  <a class=btn :href="href(e)">Review</a>
                </template>
              </span>
            </div>
            <a v-else-if="href(e)" :class="['activity-row', 'activity-link', {'activity-soft': e.needs === 'answered'}]" :href="href(e)">
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
        </div>
        <form v-if="env" class=activity-compose @submit.prevent="sendQuick">
          <textarea ref=box v-model="quick.text" rows=1 placeholder="Message the agent" aria-label="Message the agent"
            :disabled="quick.sending" @input="grow"
            @keydown.enter.exact="!$event.isComposing && ($event.preventDefault(), sendQuick())"
            @keydown.meta.enter.prevent="sendQuick" @keydown.ctrl.enter.prevent="sendQuick"></textarea>
          <div class=activity-compose-bar>
            <span class=hint>{{ quick.error || 'Enter sends, Shift+Enter adds a line' }}</span>
            <button type=submit class="btn primary" :disabled="quick.sending || !quick.text.trim()">Send</button>
          </div>
        </form>
      </template>
    </div>`,
};

const App = {
  components: { ...VIEWS, Icon, ActivityPanel },
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
    const onHash = () => { Object.assign(route, parseHash()); loadOverview(); };
    window.addEventListener("hashchange", onHash);
    window.addEventListener("journal:changed", loadOverview);
    onUnmounted(() => {
      window.removeEventListener("hashchange", onHash);
      window.removeEventListener("journal:changed", loadOverview);
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
    watchEffect(() => {
      if (route.view === "Home" && envName.value) location.replace(`#/env/${envName.value}`);
    });
    const key = computed(() => route.view + ":" + (route.params.env || ""));
    const FOLDED = "journal.sidebar.folded";
    const folded = reactive((() => { try { return JSON.parse(localStorage.getItem(FOLDED) || "{}"); } catch (e) { return {}; } })());
    const fold = (name) => {
      folded[name] = !folded[name];
      try { localStorage.setItem(FOLDED, JSON.stringify(folded)); } catch (e) { /* storage off */ }
    };
    // an activity row opens what it is about, when it is about something with a page
    const ACTIVITY_PAGES = { todo: "todos", question: "questions", message: "messages", work: "work", report: "reports",
                             suggestion: "suggestions", pin: "pins", reminder: "reminders" };
    const activityHref = (e) => {
      if (e.kind === "doc") return e.n ? `#/docs/${e.n}` : "#/docs";
      if (e.kind === "rule") return e.n ? `#/rules/${e.n}` : "#/rules";
      // a comment has no page of its own: its line opens what it is about
      if (e.kind === "comment") return e.about && envName.value ? refHref(e.about, envName.value) : null;
      const page = ACTIVITY_PAGES[e.kind];
      if (!page || !envName.value) return null;
      return `#/env/${envName.value}/${page}` + (e.n ? `/${e.n}` : "");
    };
    // what the agent did last, in the footer under its status
    const latest = computed(() => ((activity.data && activity.data.events) || []).find((e) => e.by === "Agent"));
    const setAuto = (on) => {
      activity.data.auto = on;
      postJSON(`/api/env/${envName.value}/environment/settings`, { auto: on })
        .then(() => { activity.reload(); changed(); }, () => activity.reload());
    };
    // other projects' journals running on this machine, each at its own port
    const journals = reactive({ list: [], open: false });
    const loadJournals = () => fetch("/api/viewers").then((r) => r.json())
      .then((d) => { journals.list = Array.isArray(d) ? d : []; }).catch(() => {});
    const journalsTimer = setInterval(() => { if (document.visibilityState === "visible") loadJournals(); }, 20000);
    const outsideJournals = (e) => { if (!e.target.closest(".journal-switch")) journals.open = false; };
    document.addEventListener("mousedown", outsideJournals);
    onUnmounted(() => { clearInterval(journalsTimer); document.removeEventListener("mousedown", outsideJournals); });
    loadJournals();
    return { route, ov, envName, envRow, NAV, key, activity, folded, fold, activityHref, ACTIVITY, latest, setAuto, journals };
  },
  template: `
    <div class=app>
      <aside class=side>
        <div v-if="journals.list.length > 1" class="drop-wrap journal-switch">
          <button type=button class=project :aria-expanded="journals.open" :title="'Journals running on this machine'"
            @click="journals.open = !journals.open">
            <span class=logo>{{ (envName || 'j').charAt(0).toUpperCase() }}</span>{{ envName || 'journal' }}
            <span :class="['fold', {shut: !journals.open}]"></span>
          </button>
          <div v-if="journals.open" class=drop>
            <div class=drop-head><span>Journals running on this machine</span></div>
            <template v-for="j in journals.list" :key="j.port">
              <div v-if="j.current" class="drop-row current">
                <span class=drop-kind>This journal · port {{ j.port }}{{ j.version ? ' · ' + j.version : '' }}</span>
                <span class=drop-text>{{ j.project }}</span>
              </div>
              <a v-else class=drop-row :href="j.url" @click="journals.open = false">
                <span class=drop-kind>Port {{ j.port }}{{ j.version ? ' · ' + j.version : '' }}</span>
                <span class=drop-text>{{ j.project }}</span>
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
            <span v-if="item.count" :class="['count', {hot: (item.key === 'inbox' || item.key === 'home') && envRow && envRow[item.count]}]">{{ envRow && envRow[item.count] ? envRow[item.count] : '' }}</span>
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
        <div v-if="activity.data" class=side-foot>
          <div class=side-foot-head>
            <span>Agent<span v-if="activity.data.agent" :class="['side-foot-state', {working: activity.data.agent.working}]">{{ activity.data.agent.working ? 'Working' : 'Idle' }}</span></span>
            <span v-if="activity.data.agent && activity.data.agent.context" :class="['side-foot-ctx', {high: activity.data.agent.context.share >= 70}]"
              :title="'Context ' + activity.data.agent.context.share + '% used: ' + activity.data.agent.context.used.toLocaleString() + ' of ' + activity.data.agent.context.window.toLocaleString() + ' tokens'">
              <span class=ctx-bar><span :style="{width: activity.data.agent.context.share + '%'}"></span></span>{{ activity.data.agent.context.share }}%</span>
            <span :class="['env-dot', {live: activity.data.agent && activity.data.agent.working}]"
              :title="!activity.data.agent ? 'No agent on this environment' : activity.data.agent.working ? 'The agent is working' : 'The agent is waiting for you'"></span>
          </div>
          <div class=side-foot-auto>
            <span>Auto mode</span>
            <button type=button role=switch :aria-checked="activity.data.auto ? 'true' : 'false'" :class="['switch', {on: activity.data.auto}]"
              :title="activity.data.auto ? 'The agent works through the to-do list without asking' : 'The agent asks before picking up the next to-do'"
              @click="setAuto(!activity.data.auto)"><span class=knob></span></button>
          </div>
          <span v-if="latest" class=side-foot-now
            :title="[latest.text, latest.n, latest.detail].filter(Boolean).join(' ')">{{ [latest.text, latest.n, latest.detail].filter(Boolean).join(' ') }}</span>
          <span v-if="latest" class=side-foot-age>{{ latest.age || 'just now' }}</span>
        </div>
      </aside>
      <main class=main>
        <component :is="route.view" v-bind="route.params" :key="key"/>
      </main>
      <aside v-if="activity.data && ACTIVITY.shown" class=activity-dock>
        <ActivityPanel :data="activity.data" :href="activityHref" :env="envName"/>
      </aside>
    </div>`,
};

const app = createApp(App);
app.config.globalProperties.$md = renderMarkdown;
app.config.globalProperties.$human = humanSize;
app.config.globalProperties.$refHref = refHref;
app.mount("#app");
