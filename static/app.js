// The journal's browser renderer. Vue does the layout; the server only ever answers with
// JSON (see serve.py) — this file is the second renderer of that response, fmt.py the first.
"use strict";
const { createApp, reactive, computed, watch, watchEffect, onUnmounted } = Vue;

// ─────────────────────────────────────────────────────────────── a hash router
// A detail route renders the same view as its list, with the item open in the side panel.
const ROUTES = [
  { re: /^\/$/, view: "Home" },
  { re: /^\/env\/([a-z0-9-]+)$/, view: "EnvHome", params: ["env"] },
  { re: /^\/env\/([a-z0-9-]+)\/todos(?:\/(\d+|new))?$/, view: "Todos", params: ["env", "n"] },
  { re: /^\/env\/([a-z0-9-]+)\/pins(?:\/(\d+|new))?$/, view: "Pins", params: ["env", "n"] },
  { re: /^\/env\/([a-z0-9-]+)\/(?:messages|inbox)(?:\/(\d+))?$/, view: "Inbox", params: ["env", "n"] },
  { re: /^\/env\/([a-z0-9-]+)\/questions(?:\/(\d+))?$/, view: "Questions", params: ["env", "n"] },
  { re: /^\/env\/([a-z0-9-]+)\/reports(?:\/(\d+|new))?$/, view: "Reports", params: ["env", "n"] },
  { re: /^\/env\/([a-z0-9-]+)\/suggestions(?:\/(\d+))?$/, view: "Suggestions", params: ["env", "n"] },
  { re: /^\/env\/([a-z0-9-]+)\/work(?:\/(\d+|new))?$/, view: "Work", params: ["env", "n"] },
  { re: /^\/env\/([a-z0-9-]+)\/reminders(?:\/(\d+|new))?$/, view: "Reminders", params: ["env", "n"] },
  { re: /^\/env\/([a-z0-9-]+)\/docs(?:\/(new))?$/, view: "EnvDocs", params: ["env", "n"] },
  { re: /^\/env\/([a-z0-9-]+)\/settings$/, view: "Settings", params: ["env"] },
  { re: /^\/env\/([a-z0-9-]+)\/search$/, view: "Search", params: ["env"] },
  { re: /^\/rules(?:\/(\d+|new))?$/, view: "Rules", params: ["n"] },
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
  return fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload || {}) })
    .then((r) => r.json().then((body) => {
      if (!r.ok) throw new Error(body.error || "request failed");
      return body;
    }));
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

// ─────────────────────────────────────────────────────────────── icons
const Icon = {
  props: ["name"],
  template: `
    <svg class=ico viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">
      <template v-if="name === 'todos'"><circle cx="8" cy="8" r="5.75"/><path d="M5.6 8.1l1.7 1.7 3.2-3.5"/></template>
      <path v-else-if="name === 'pins'" d="M8 14V9.5M5 2.5h6M6 2.5v3.5L4 9.5h8L10 6V2.5"/>
      <template v-else-if="name === 'suggestions'"><path d="M8 2.5a4 4 0 0 0-2.3 7.3V11.5h4.6V9.8A4 4 0 0 0 8 2.5z"/><path d="M6.3 13.5h3.4"/></template>
      <template v-else-if="name === 'empty'"><path d="M2.5 9.5l1.8-5h7.4l1.8 5V13h-11z"/><path d="M2.5 9.5h3l1 1.5h3l1-1.5h3"/></template>
      <template v-else-if="name === 'dock-left'"><rect x="2.5" y="3" width="11" height="10" rx="1.5"/><path d="M6.5 3v10"/></template>
      <template v-else-if="name === 'float'"><rect x="2.5" y="3" width="11" height="10" rx="1.5"/><rect x="7.5" y="7" width="4.5" height="4" rx=".8"/></template>
      <template v-else-if="name === 'dock-right'"><rect x="2.5" y="3" width="11" height="10" rx="1.5"/><path d="M9.5 3v10"/></template>
      <template v-else-if="name === 'reports'"><path d="M4 2.5h5.5L12 5v8.5H4z"/><path d="M6.5 8h3M6.5 10.5h3"/></template>
      <template v-else-if="name === 'work'"><circle cx="8" cy="8" r="5.5"/><path d="M8 5v3l2 1.5"/></template>
      <path v-else-if="name === 'reminders'" d="M4 11V7a4 4 0 0 1 8 0v4l1 1.5H3L4 11ZM6.5 14h3"/>
      <template v-else-if="name === 'docs'"><path d="M4 1.8h5.5L12.5 5v9.2H4V1.8Z"/><path d="M9.5 1.8V5h3"/></template>
      <path v-else-if="name === 'rules'" d="M3 3.5h10M3 8h10M3 12.5h6"/>
      <path v-else-if="name === 'folder'" d="M2.5 3h4l1.5 1.5h5.5v8.5h-11V3Z"/>
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
const TopBar = {
  props: { crumbs: { type: Array, default: () => [] } },
  template: `
    <div class=top>
      <div class=crumb>
        <template v-for="(c, i) in crumbs" :key="i">
          <span v-if="i" class=sep>/</span><b v-if="i === crumbs.length - 1">{{ c }}</b><span v-else>{{ c }}</span>
        </template>
      </div>
      <slot/>
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
  props: ["placeholder", "submit", "hint", "send", "attach"],
  setup(props) {
    const draft = reactive({ text: "", sending: false, error: null, files: [] });
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
    return { draft, go, picked, unpick };
  },
  template: `
    <form class=compose @submit.prevent="go">
      <textarea class=box-area v-model="draft.text" rows=3 :placeholder="placeholder" :aria-label="submit"
        @keydown.meta.enter.prevent="go" @keydown.ctrl.enter.prevent="go"></textarea>
      <div v-if="draft.files.length" class=compose-files>
        <span v-for="(f, i) in draft.files" :key="i" class=chip>{{ f.name }} <button type=button class=chip-x title="Remove" @click="unpick(i)">×</button></span>
      </div>
      <div class=compose-bar>
        <label v-if="attach" class="btn attach">Attach files<input type=file multiple hidden @change="picked"></label>
        <span class=hint>{{ hint }}</span>
        <button type=submit class=primary :disabled="draft.sending || !draft.text.trim()">{{ submit }}</button>
      </div>
      <p v-if="draft.error" class=error>{{ draft.error }}</p>
    </form>`,
};

function questionKind(q) { return q.status === "open" ? "waiting" : q.status === "answered" ? "done" : "withdrawn"; }

const LinkedQuestions = {
  props: { rows: { type: Array, default: () => [] }, env: { type: String, default: "" } },
  components: { StatusIcon },
  setup() { return { questionKind }; },
  template: `
    <div v-if="rows && rows.length">
      <p class=section-label>Questions</p>
      <div class=linked>
        <a v-for="q in rows" :key="(q.env || env) + ':' + q.n" :href="'#/env/' + (q.env || env) + '/questions/' + q.n">
          <StatusIcon :kind="questionKind(q)"/>
          <span>{{ q.text }}<span v-if="q.answer" class=answer> → {{ q.answer }}</span></span>
        </a>
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
    const state = (c) => (c.done ? `Handled: ${c.done}` : c.told ? "Seen by the agent" : "Not seen yet");
    return { list, post, state };
  },
  template: `
    <div v-if="env && about" class=comments>
      <p class=section-label>Comments</p>
      <div v-if="list.data && list.data.length" class=linked>
        <div v-for="c in list.data" :key="c.n" class=sub>
          <div>{{ c.text }}</div>
          <div class=muted>{{ c.age || 'just now' }} · {{ state(c) }}</div>
        </div>
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

const PAGE_ROWS = 25;

// groups: {key, label, kind, closed, match(row)}; columns: {priority, status, num, numWidth, title, sub, cite, age, struck}
const ResourceList = {
  props: {
    rows: Array, loading: Boolean, error: String,
    groups: { type: Array, default: () => [{ key: "all", label: "", match: () => true }] },
    columns: Object, href: Function, selected: Function, pick: Function,
    sorts: { type: Array, default: () => [{ key: "n", label: "Number" }] },
    count: Function, showLabel: String, empty: String, name: String, showDefault: Boolean,
    bar: { type: Boolean, default: true }, limit: { type: Number, default: PAGE_ROWS },
  },
  components: { StatusIcon, PriorityIcon, Switch },
  setup(props) {
    // a switch the viewer flipped is remembered per list, in this browser only
    const key = props.name ? `journal:show:${props.name}` : "";
    const remembered = () => { try { return key ? localStorage.getItem(key) : null; } catch (e) { return null; } };
    const state = reactive({ show: remembered() === null ? props.showDefault : remembered() === "1", sort: {}, pages: {},
                             held: {}, arrived: {} });
    // after a refresh, a row that changed group or left the list stays put in blue for a moment, and a new row is lit
    const rowKey = (r) => String(r.n ?? r.name);
    const groupOf = (r) => (props.groups.find((g) => g.match(r)) || {}).key;
    const HOLD_MS = 2500;
    watch(() => props.rows, (rows, before) => {
      if (!rows || !before) return;
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
    watchEffect(() => { const on = state.show; try { if (key) localStorage.setItem(key, on ? "1" : "0"); } catch (e) { /* storage off */ } });
    const sortOf = (key) => state.sort[key] || { by: props.sorts[0].key, dir: "desc" };
    const sections = computed(() => (props.rows ? props.groups.filter((g) => state.show || !g.closed).map((g) => {
      const order = sortOf(g.key);
      const spec = props.sorts.find((x) => x.key === order.by) || props.sorts[0];
      const value = spec.value || ((r) => r[spec.key]);
      const current = Object.fromEntries(props.rows.map((r) => [rowKey(r), r]));
      const held = Object.entries(state.held).filter(([, v]) => v.group === g.key).map(([k, v]) => current[k] || v.row);
      const moving = new Set(Object.keys(state.held));
      const rows = props.rows.filter((r) => g.match(r) && !moving.has(rowKey(r))).concat(held).sort((a, b) => {
        const x = value(a), y = value(b);
        const c = x < y ? -1 : x > y ? 1 : 0;
        return order.dir === "asc" ? c : -c;
      });
      return { ...g, total: rows.length, rows: rows.slice(0, props.limit * (state.pages[g.key] || 1)) };
    }).filter((g) => g.total) : []));
    const closable = computed(() => props.groups.some((g) => g.closed));
    const cols = computed(() => {
      const c = props.columns;
      return [c.priority && "22px", c.status && "22px", c.num && (c.numWidth || "44px"), "minmax(0, 1fr)",
              c.cite && "minmax(0, 180px)", c.age && "112px"].filter(Boolean).join(" ");
    });
    const setSort = (key, value) => { const [by, dir] = value.split(":"); state.sort[key] = { by, dir }; };
    const more = (key) => { state.pages[key] = (state.pages[key] || 1) + 1; };
    const open = (event, row) => { if (props.pick) { event.preventDefault(); props.pick(row); } };
    const moving = (r) => !!state.held[rowKey(r)];
    const fresh = (r) => !!state.arrived[rowKey(r)];
    return { state, sections, closable, cols, sortOf, setSort, more, open, moving, fresh };
  },
  template: `
    <div v-if="bar" class=viewbar>
      <span v-if="rows && count">{{ count(rows) }}</span>
      <Switch v-if="closable && showLabel" class=bar-switch :label="showLabel" v-model="state.show"/>
    </div>
    <p v-if="loading && !rows" class=empty>Loading…</p>
    <p v-else-if="error && !rows" class=error>{{ error }}</p>
    <template v-else-if="rows">
      <template v-for="g in sections" :key="g.key">
        <div v-if="g.label" class=ghead>
          <StatusIcon v-if="g.kind" :kind="g.kind"/>{{ g.label }}<span class=n>{{ g.total }}</span>
          <select class=sort :value="sortOf(g.key).by + ':' + sortOf(g.key).dir" @change="setSort(g.key, $event.target.value)" aria-label="Sort">
            <template v-for="o in sorts" :key="o.key">
              <option :value="o.key + ':desc'">{{ o.label }}, high to low</option>
              <option :value="o.key + ':asc'">{{ o.label }}, low to high</option>
            </template>
          </select>
        </div>
        <a v-for="r in g.rows" :key="r.n ?? r.name" :class="['row', 'lrow', {sel: selected && selected(r), struck: columns.struck && columns.struck(r), moving: moving(r), fresh: fresh(r)}]"
          :style="{gridTemplateColumns: cols}" :href="href(r)" @click="open($event, r)">
          <PriorityIcon v-if="columns.priority" :value="columns.priority(r)"/>
          <StatusIcon v-if="columns.status" :kind="columns.status(r)"/>
          <span v-if="columns.num" class=num>{{ columns.num(r) }}</span>
          <div class=stack><div class=title>{{ columns.title(r) }}</div><div v-if="columns.sub && columns.sub(r)" class=sub>{{ columns.sub(r) }}</div></div>
          <span v-if="columns.cite" class=cite>{{ columns.cite(r) }}</span>
          <span v-if="columns.age" class=age>{{ columns.age(r) }}</span>
        </a>
        <button v-if="g.rows.length < g.total" type=button class="btn more-rows" @click="more(g.key)">Show {{ Math.min(limit, g.total - g.rows.length) }} more</button>
      </template>
      <p v-if="!sections.length" class=empty>{{ rows.length && closable && !state.show ? 'Nothing here is open. Switch on “' + showLabel + '” to see the rest.' : empty }}</p>
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
  { key: "open", label: "Open" },
  { key: "blocked", label: "Blocked" },
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

const TODO_LIST = {
  groups: GROUPS.map((g) => ({ ...g, kind: g.key, closed: g.key === "done", match: (t) => todoStatus(t) === g.key })),
  columns: { priority: (t) => t.priority, status: (t) => todoStatus(t), num: (t) => `#${t.n}`, title: (t) => t.title,
             cite: (t) => (t.doc ? `Doc ${t.doc}` : ""), age: (t) => t.age },
  sorts: [{ key: "n", label: "Number" }, { key: "priority", label: "Priority", value: (t) => t.priority ?? 100 }],
  count: (rows) => `${rows.filter((t) => todoStatus(t) !== "done").length} open`,
  showLabel: "Show done", empty: "Nothing is waiting on this environment.", name: "todos",
};
const CLAIM_LIST = {
  groups: [{ key: "standing", label: "Standing", kind: "open", match: (c) => !c.struck },
           { key: "struck", label: "Struck", kind: "withdrawn", closed: true, match: (c) => c.struck }],
  columns: { num: (c) => `#${c.n}`, title: (c) => c.fact, cite: (c) => (docOf(c.meta) ? `Doc ${docOf(c.meta)}` : ""),
             age: (c) => ageOf(c.meta), struck: (c) => c.struck },
  count: (rows) => `${rows.filter((c) => !c.struck).length} standing`, showLabel: "Show struck",
};
const MESSAGE_LIST = {
  groups: [{ key: "waiting", label: "Waiting", kind: "waiting", match: (m) => m.status === "waiting" },
           { key: "processed", label: "Processed", kind: "done", match: (m) => m.status === "processed" || m.status === "moved" },
           { key: "archived", label: "Archived", kind: "withdrawn", match: (m) => m.status === "archived" }],
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
  count: (rows) => `${rows.filter((q) => q.status === "open").length} open`, showLabel: "Show answered",
  empty: "Nothing has been asked on this environment.", name: "questions",
};
const LOG_KIND = { started: "Started", update: "Update", waiting: "Waiting on", ended: "Ended" };
const WORK_LIST = {
  groups: [{ key: "open", label: "Open", kind: "progress", match: (w) => !w.ended },
           { key: "ended", label: "Ended", kind: "done", closed: true, match: (w) => w.ended }],
  columns: { title: (w) => w.subject, sub: (w) => (w.notes.length ? w.notes[w.notes.length - 1].text : ""), age: (w) => w.age },
  count: (rows) => `${rows.filter((w) => !w.ended).length} open`, showLabel: "Show ended", empty: "Nothing is open.", name: "work",
};
const REMINDER_LIST = {
  groups: [{ key: "standing", label: "Standing", kind: "open", match: (r) => !r.struck },
           { key: "retired", label: "Retired", kind: "withdrawn", closed: true, match: (r) => r.struck }],
  columns: { num: (r) => `#${r.n}`, title: (r) => r.text, cite: (r) => r.until || "", struck: (r) => r.struck },
  count: (rows) => `${rows.filter((r) => !r.struck).length} standing`, showLabel: "Show retired",
  empty: "Nothing is being repeated.", name: "reminders",
};
const DOC_LIST = {
  groups: [{ key: "draft", label: "Draft", kind: "open", match: (d) => !d.superseded_by && d.status !== "final" },
           { key: "final", label: "Final", kind: "done", match: (d) => !d.superseded_by && d.status === "final" },
           { key: "superseded", label: "Superseded", kind: "withdrawn", closed: true, match: (d) => d.superseded_by },
           { key: "archived", label: "Archived", kind: "withdrawn", closed: true, match: (d) => d.archived && !d.superseded_by }],
  columns: { num: (d) => `#${d.n}`, title: (d) => d.title, sub: (d) => d.abstract, age: (d) => d.age, struck: (d) => d.superseded_by },
  count: (rows) => `${rows.filter((d) => !d.archived).length} catalogued`, showLabel: "Show superseded and archived", name: "docs",
};
const TOOL_LIST = {
  groups: [{ key: "tools", label: "Catalogued", match: () => true }],
  columns: { num: (t) => t.name, numWidth: "120px", title: (t) => t.title, sub: (t) => t.summary, age: (t) => t.age },
  sorts: [{ key: "n", label: "Number" }, { key: "name", label: "Name" }],
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
    return { item, actions, done, todoHref, todoStatus, STATUS_LABEL, priorityName, LOG_KIND };
  },
  template: `
    <Panel :label="'To-do #' + n" :close="close" :onClose="onClose" :link="link">
      <p v-if="item.error" class=error>{{ item.error }}</p>
      <template v-else-if="item.data">
        <h2 class=p-title>{{ item.data.title }}</h2>
        <dl class=props>
          <dt>Status</dt><dd><StatusIcon :kind="todoStatus(item.data)"/>{{ STATUS_LABEL[todoStatus(item.data)] }}</dd>
          <dt>Priority</dt><dd><PriorityIcon :value="item.data.priority"/>{{ priorityName(item.data.priority) }}</dd>
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
            <div v-for="(e, i) in item.data.log" :key="i" class=sub>
              <span class=muted>{{ LOG_KIND[e.kind] }} · {{ e.age || 'just now' }}</span><span v-if="e.text && e.kind !== 'started'"> — {{ e.text }}</span>
            </div>
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
  components: { Panel, StatusIcon, Compose, ActionBar, FromMessages },
  setup(props) {
    const api = computed(() => `/api/env/${props.env}/questions`);
    const item = useFetch(() => props.env && props.n && `${api.value}/${props.n}`);
    const answer = (text) => postJSON(`${api.value}/${props.n}/answer`, { answer: text })
      .then((body) => { item.data = body.data; if (props.reloaded) props.reloaded(); changed(); });
    // clicking an option only picks it; Save sends it, so a stray click never answers
    const state = reactive({ answering: false, picked: "" });
    const pick = (option) => { state.picked = state.picked === option ? "" : option; };
    const save = () => {
      if (!state.picked || state.answering) return;
      state.answering = true;
      answer(state.picked).then(() => { state.picked = ""; }).finally(() => { state.answering = false; });
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
    return { item, answer, pick, save, picked: computed(() => state.picked), answering: computed(() => state.answering),
             questionKind, actions, done };
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
        <div v-if="item.data.options.length && !item.data.withdrawn" class=options>
          <p class=section-label>{{ item.data.answer ? 'Choose again' : 'Choose one' }}</p>
          <button v-for="(o, i) in item.data.options" :key="i" type=button
            :class="['option', {picked: picked === o, chosen: !picked && item.data.answer === o}]" :disabled="answering"
            :aria-pressed="picked === o" @click="pick(o)">{{ o }}</button>
          <div class=option-save>
            <button type=button class="btn primary" :disabled="!picked || answering" @click="save">Save answer</button>
            <span v-if="picked" class=hint>Not sent until you save</span>
          </div>
        </div>
        <div v-if="item.data.answer">
          <p class=section-label>Answer<span v-if="item.data.answered_age"> · {{ item.data.answered_age }}</span></p>
          <div class="md prose" v-html="$md(item.data.answer)"></div>
        </div>
        <div v-if="item.data.withdrawn" class=note>Withdrawn: {{ item.data.withdrawn }}</div>
        <Compose v-else :placeholder="item.data.options.length ? 'Or write your own answer' : item.data.answer ? 'Write a new answer. The old one stays in the history.' : 'Your answer'"
          :submit="item.data.answer ? 'Add new answer' : 'Answer'" hint="The agent is told at its next stop" :send="answer"/>
      </template>
    </Panel>`,
};

const MessagePanel = {
  props: PANEL_PROPS,
  components: { Panel, StatusIcon, ActionBar },
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
    return { item, actions, done, heldUrl, isImage };
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
        <div v-if="item.data.files && item.data.files.length">
          <p class=section-label>Files</p>
          <div class=files>
            <template v-for="f in item.data.files" :key="f.name">
              <a v-if="!f.filed.startsWith('doc:')" class=file-row :href="heldUrl(item.data, f)" target=_blank rel=noopener>
                <span class=file-name>{{ f.name }}</span><span class=file-meta>{{ f.filed_label }} · {{ $human(f.size) }}</span>
              </a>
              <a v-else class=file-row :href="'#/docs/' + f.filed.slice(4)">
                <span class=file-name>{{ f.name }}</span><span class=file-meta>{{ f.filed_label }} · {{ $human(f.size) }}</span>
              </a>
              <img v-if="isImage(f.name) && !f.filed.startsWith('doc:')" class=file-preview :src="heldUrl(item.data, f)" :alt="f.name" loading=lazy>
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
        </dl>
        <ActionBar :actions="actions" :done="done" :key="'work' + item.data.n + (item.data.ended || '')"/>
        <div v-if="item.data.notes.length">
          <p class=section-label>Notes</p>
          <div class=linked><div v-for="(note, i) in item.data.notes" :key="i" class=sub>{{ note.text }}</div></div>
        </div>
      </template>
    </Panel>`,
};

const SUGGESTION_LIST = {
  groups: [{ key: "open", label: "Waiting on you", kind: "waiting", match: (s) => s.status === "open" },
           { key: "accepted", label: "Accepted", kind: "done", match: (s) => s.status === "accepted" || s.status === "adjusted" },
           { key: "declined", label: "Declined", kind: "withdrawn", closed: true, match: (s) => s.status === "declined" },
           { key: "withdrawn", label: "Withdrawn", kind: "withdrawn", closed: true, match: (s) => s.status === "withdrawn" }],
  columns: { num: (s) => `#${s.n}`, title: (s) => s.title, sub: (s) => s.gist, age: (s) => s.age,
             struck: (s) => s.status === "declined" || s.status === "withdrawn" },
  count: (rows) => `${rows.filter((s) => s.status === "open").length} waiting on you`, showLabel: "Show declined and withdrawn",
  name: "suggestions", empty: "No suggestions on this environment.",
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
  props: ["env", "n"],
  components: { TopBar, ResourceList, SuggestionPanel },
  setup(props) {
    const base = computed(() => `#/env/${props.env}/suggestions`);
    const list = useFetch(() => props.env && `/api/env/${props.env}/suggestions?all=1`);
    return { list, base, SUGGESTION_LIST };
  },
  template: `
    <TopBar :crumbs="[env, 'Suggestions']"/>
    <div class=body>
      <div class=list>
        <ResourceList v-bind="SUGGESTION_LIST" :rows="list.data" :loading="list.loading" :error="list.error"
          :href="(s) => base + '/' + s.n" :selected="(s) => String(s.n) === n"/>
      </div>
      <SuggestionPanel v-if="n" :key="'suggestion' + n" :env="env" :n="n" :close="base" :base="base" :reloaded="list.reload"/>
    </div>`,
};

const Todos = {
  props: ["env", "n"],
  components: { TopBar, Panel, ActionBar, ResourceList, TodoPanel },
  setup(props) {
    const api = computed(() => `/api/env/${props.env}/todos`);
    const base = computed(() => `#/env/${props.env}/todos`);
    const list = useFetch(() => props.env && api.value);
    const creating = computed(() => [{
      label: "New to-do", method: "POST", url: api.value, submit: "Add to-do", leave: true,
      fields: [{ name: "title", label: "Title", placeholder: "What needs doing, in a few words" },
               { name: "body", label: "Brief", kind: "area", placeholder: "Anything the agent needs to know to do it" },
               { name: "after", label: "Waits on (optional)", placeholder: "to-do numbers, like 3, 7" }],
    }]);
    const done = (body, a) => settle(body, a, base.value, list);
    return { list, creating, done, base, TODO_LIST };
  },
  template: `
    <TopBar :crumbs="[env, 'To-dos']"><a class="btn new" :href="base + '/new'">New to-do</a></TopBar>
    <div class=body>
      <div class=list>
        <ResourceList v-bind="TODO_LIST" :rows="list.data" :loading="list.loading" :error="list.error"
          :href="(t) => base + '/' + t.n" :selected="(t) => String(t.n) === n"/>
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
    props: ["env", "n"],
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
      const done = (body, a) => settle(body, a, base(props), list, item);
      return { list, item, creating, actions, done, ageOf, docOf, word, envs, crumbs: computed(() => crumbs(props)),
               base: computed(() => base(props)), scope: computed(() => scope(props)), noun, word, empty, CLAIM_LIST };
    },
    template: `
      <TopBar :crumbs="crumbs"><a class="btn new" :href="base + '/new'">New {{ word }}</a></TopBar>
      <div class=body>
        <div class=list>
          <ResourceList v-bind="CLAIM_LIST" :name="word + 's'" :empty="empty" :rows="list.data" :loading="list.loading" :error="list.error"
            :href="(c) => base + '/' + c.n" :selected="(c) => String(c.n) === n"/>
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
  props: ["env", "n"],
  components: { TopBar, Compose, ResourceList, MessagePanel },
  setup(props) {
    const api = computed(() => `/api/env/${props.env}/inbox`);
    const base = computed(() => `#/env/${props.env}/messages`);
    const list = useFetch(() => props.env && `${api.value}?all=1`);
    const send = (text, files) => postJSON(api.value, { text, files }).then(() => { list.reload(); changed(); });
    // a message only reaches an agent at its next hook event; say so when none is working here
    const live = computed(() => {
      const row = OVERVIEW.data ? OVERVIEW.data.environments.find((e) => e.name === props.env) : null;
      return !!(row && row.active);
    });
    const hint = computed(() => (live.value ? "The agent is told at its next stop"
      : "No agent is working on this environment right now; the message waits until a session picks it up"));
    return { list, send, base, MESSAGE_LIST, hint };
  },
  template: `
    <TopBar :crumbs="[env, 'Messages']"/>
    <div class=body>
      <div class=list>
        <div class=compose-wrap>
          <Compose placeholder="Leave a message for the agent: an instruction, a follow-up, anything"
            submit="Send" :hint="hint" :send="send" :attach="true"/>
        </div>
        <ResourceList v-bind="MESSAGE_LIST" :rows="list.data" :loading="list.loading" :error="list.error"
          :href="(m) => base + '/' + m.n" :selected="(m) => String(m.n) === n"/>
      </div>
      <MessagePanel v-if="n" :key="'message' + n" :env="env" :n="n" :close="base" :base="base" :reloaded="list.reload"/>
    </div>`,
};

const REPORT_LIST = {
  groups: [{ key: "reports", label: "Reports", kind: "open", match: (r) => !r.archived },
           { key: "archived", label: "Archived", kind: "withdrawn", closed: true, match: (r) => r.archived }],
  columns: { num: (r) => `#${r.n}`, title: (r) => r.title, sub: (r) => r.gist, cite: (r) => r.about_label, age: (r) => r.age,
             struck: (r) => r.archived },
  count: (rows) => `${rows.filter((r) => !r.archived).length} reports`, showLabel: "Show archived", name: "reports",
  empty: "No reports on this environment yet.",
};

const Reports = {
  props: ["env", "n"],
  components: { TopBar, Panel, ActionBar, ResourceList },
  setup(props) {
    const api = computed(() => `/api/env/${props.env}/reports`);
    const base = computed(() => `#/env/${props.env}/reports`);
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
    return { list, item, reading, creating, actions, done, base, REPORT_LIST };
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
      <TopBar :crumbs="[env, 'Reports']"><a class="btn new" :href="base + '/new'">New report</a></TopBar>
      <div class=body>
        <div class=list>
          <ResourceList v-bind="REPORT_LIST" :rows="list.data" :loading="list.loading" :error="list.error"
            :href="(r) => base + '/' + r.n"/>
        </div>
        <Panel v-if="n === 'new'" label="New report" :close="base">
          <ActionBar :actions="creating" open="New report" :done="done"/>
        </Panel>
      </div>
    </template>`,
};

const Questions = {
  props: ["env", "n"],
  components: { TopBar, ResourceList, QuestionPanel },
  setup(props) {
    const base = computed(() => `#/env/${props.env}/questions`);
    const list = useFetch(() => props.env && `/api/env/${props.env}/questions?all=1`);
    return { list, base, QUESTION_LIST };
  },
  template: `
    <TopBar :crumbs="[env, 'Questions']"/>
    <div class=body>
      <div class=list>
        <ResourceList v-bind="QUESTION_LIST" :rows="list.data" :loading="list.loading" :error="list.error"
          :href="(q) => base + '/' + q.n" :selected="(q) => String(q.n) === n"/>
      </div>
      <QuestionPanel v-if="n" :key="'question' + n" :env="env" :n="n" :close="base" :base="base" :reloaded="list.reload"/>
    </div>`,
};

// ─────────────────────────────────────────────────────────────── work and reminders
const Work = {
  props: ["env", "n"],
  components: { TopBar, Panel, ActionBar, ResourceList, WorkPanel },
  setup(props) {
    const api = computed(() => `/api/env/${props.env}/work`);
    const base = computed(() => `#/env/${props.env}/work`);
    const list = useFetch(() => props.env && `${api.value}?all=1`);
    const creating = computed(() => [{
      label: "Start work", method: "POST", url: api.value, submit: "Start", leave: true,
      fields: [{ name: "subject", label: "The work, in a sentence" }],
    }]);
    const done = (body, a) => settle(body, a, base.value, list);
    return { list, creating, done, base, WORK_LIST };
  },
  template: `
    <TopBar :crumbs="[env, 'Open work']"><a class="btn new" :href="base + '/new'">Start work</a></TopBar>
    <div class=body>
      <div class=list>
        <ResourceList v-bind="WORK_LIST" :rows="list.data" :loading="list.loading" :error="list.error"
          :href="(w) => base + '/' + w.n" :selected="(w) => String(w.n) === n"/>
      </div>
      <Panel v-if="n === 'new'" label="Start work" :close="base">
        <ActionBar :actions="creating" open="Start work" :done="done"/>
      </Panel>
      <WorkPanel v-else-if="n" :key="'work' + n" :env="env" :n="n" :close="base" :base="base" :reloaded="list.reload"/>
    </div>`,
};

const Reminders = {
  props: ["env", "n"],
  components: { TopBar, Panel, ActionBar, ResourceList, FromMessages, Comments },
  setup(props) {
    const api = computed(() => `/api/env/${props.env}/reminders`);
    const base = computed(() => `#/env/${props.env}/reminders`);
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
    return { list, item, creating, actions, done, base, REMINDER_LIST };
  },
  template: `
    <TopBar :crumbs="[env, 'Reminders']"><a class="btn new" :href="base + '/new'">New reminder</a></TopBar>
    <div class=body>
      <div class=list>
        <ResourceList v-bind="REMINDER_LIST" :rows="list.data" :loading="list.loading" :error="list.error"
          :href="(r) => base + '/' + r.n" :selected="(r) => String(r.n) === n"/>
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
      <TopBar :crumbs="crumbs"><a class="btn new" :href="base + '/new'">New doc</a></TopBar>
      <div class=body><div class=list>
        <div v-if="n === 'new'" class=compose-wrap><ActionBar :actions="creating" open="New doc" :done="done"/></div>
        <ResourceList v-bind="DOC_LIST" :empty="empty" :rows="s.data" :loading="s.loading" :error="s.error" :href="(d) => '#/docs/' + d.n"/>
      </div></div>`,
  };
}

const Docs = docList({ crumbs: () => ["Project", "Project docs"], url: () => "/api/docs?archived=1", base: () => "#/docs",
                       empty: "No project-wide docs are catalogued." });
const EnvDocs = docList({ crumbs: (p) => [p.env, "Environment docs"], url: (p) => p.env && `/api/env/${p.env}/docs?archived=1`,
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
          fields: [{ name: "abstract", label: "Abstract", value: d.abstract },
                   { name: "status", label: "Status", kind: "select", value: d.status,
                     options: [{ value: "draft", label: "Draft" }, { value: "final", label: "Final" }] }] },
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
    return { s, restParts, citedHref, actions, done, fileUrl, isImage, envs };
  },
  template: `
    <TopBar :crumbs="['Docs', s.data ? '#' + s.data.n : docref]"/>
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
        <div v-if="s.data.part">
          <p class=section-label>{{ s.data.n }}.{{ s.data.part.p }} {{ s.data.part.title }}</p>
          <div class="md prose" v-html="$md(s.data.part.body)"></div>
        </div>
        <div v-else-if="s.data.body" class="md prose" v-html="$md(s.data.body)"></div>
        <div v-for="p in restParts" :key="p.p" :id="'part-' + p.p">
          <p class=section-label>{{ s.data.n }}.{{ p.p }} {{ p.title }}<span v-if="p.age"> · {{ p.age }}</span></p>
          <div class="md prose" v-html="$md(p.body)"></div>
        </div>
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
  components: { TopBar, Icon, StatusIcon, PriorityIcon, Peek, ResourceList },
  setup(props) {
    const url = (tail) => () => props.env && `/api/env/${props.env}${tail}`;
    const summary = useFetch(url(""));
    const work = useFetch(url("/work"));
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
                            sorts: [{ key: "done", label: "Finished" }], empty: "Nothing has been finished yet." };
    const waitingMessages = { ...MESSAGE_LIST, groups: [{ ...MESSAGE_LIST.groups[0], label: "" }] };
    const openQuestions = { ...QUESTION_LIST, groups: [{ ...QUESTION_LIST.groups[0], label: "" }] };
    const openWork = { ...WORK_LIST, groups: [{ ...WORK_LIST.groups[0], label: "" }] };
    const waiting = computed(() => (inbox.data || []).filter((m) => m.status === "waiting"));
    const asking = computed(() => (questions.data || []).filter((q) => q.status === "open"));
    const stats = computed(() => {
      const s = summary.data || {};
      return [
        { label: "Messages waiting", n: s.inbox, icon: "inbox", path: "messages", hot: s.inbox },
        { label: "Open questions", n: s.questions, icon: "questions", path: "questions", hot: s.questions },
        { label: "Open to-dos", n: s.todos, icon: "todos", path: "todos" },
        { label: "Pins", n: s.pins, icon: "pins", path: "pins" },
        { label: "Reminders", n: s.reminders, icon: "reminders", path: "reminders" },
        { label: "Environment docs", n: s.docs, icon: "docs", path: "docs" },
      ];
    });
    const about = (q) => q.links.map((l) => l.label).join(", ");
    const view = reactive({ finished: false, kind: "", n: 0 });
    const peek = (kind, n) => { view.kind = kind; view.n = n; };
    const unpeek = () => { view.kind = ""; view.n = 0; };
    const picked = (kind) => (r) => view.kind === kind && view.n === r.n;
    const reloadAll = () => [work, todos, inbox, questions].forEach((f) => f.reload());
    return { work, todos, inbox, questions, notes, readOne, readAll, reloadAll, view, peek, unpeek, picked, waiting, asking, stats, openTodos, finishedTodos,
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
        <a v-for="s in stats" :key="s.path" :class="['stat', {hot: s.hot}]" :href="'#/env/' + env + '/' + s.path">
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
          <span class=segmented>
            <button type=button :class="['btn', {on: !view.finished}]" @click="view.finished = false">Open</button>
            <button type=button :class="['btn', {on: view.finished}]" @click="view.finished = true">Recently finished</button>
          </span>
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
    <aside v-else class="panel peek-idle" aria-hidden="true"><Icon name="empty"/></aside>
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
    <TopBar :crumbs="['Project', 'Tools']"><a class="btn new" :href="base + '/new'">New tool</a></TopBar>
    <div class=body>
      <div class=list>
        <ResourceList v-bind="TOOL_LIST" :rows="list.data" :loading="list.loading" :error="list.error"
          :href="(t) => base + '/' + t.n" :selected="(t) => String(t.n) === n"/>
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
    return { s, auto, setAuto, removing, done, keeping, kept };
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

const VIEWS = { Home, EnvHome, Todos, Pins, Rules, Inbox, Questions, Suggestions, Reports, Work, Reminders, Docs, EnvDocs, DocDetail, Settings, Search, Tools, NotFound };

// ─────────────────────────────────────────────────────────────── the app shell
// open work lives on Home, so the sidebar has no entry of its own for it
const NAV = [
  { key: "home", label: "Home", views: ["EnvHome", "Work"], path: "", count: "notifications" },
  { key: "search", label: "Search", views: ["Search"], path: "search" },
  { key: "inbox", label: "Messages", views: ["Inbox"], path: "messages", count: "inbox" },
  { key: "todos", label: "To-dos", views: ["Todos"], path: "todos", count: "todos" },
  { key: "questions", label: "Questions", views: ["Questions"], path: "questions", count: "questions" },
  { key: "suggestions", label: "Suggestions", views: ["Suggestions"], path: "suggestions", count: "suggestions" },
  { key: "reports", label: "Reports", views: ["Reports"], path: "reports", count: "reports" },
  { key: "pins", label: "Pins", views: ["Pins"], path: "pins", count: "pins" },
  { key: "reminders", label: "Reminders", views: ["Reminders"], path: "reminders", count: "reminders" },
  { key: "docs", label: "Environment docs", views: ["EnvDocs"], path: "docs", count: "docs" },
  { key: "settings", label: "Settings", views: ["Settings"], path: "settings" },
];

// the Activity panel: one component, shown in the sidebar, docked on the right, or as a window you drag
const ACTIVITY_MODES = [{ value: "sidebar", label: "Show in the sidebar", icon: "dock-left" },
                        { value: "float", label: "Show as a floating window", icon: "float" },
                        { value: "right", label: "Dock on the right", icon: "dock-right" }];

const ActivityPanel = {
  props: { data: Object, href: Function, mode: String, setMode: Function },
  emits: ["drag"],
  components: { Icon },
  setup() {
    return { ACTIVITY_MODES };
  },
  template: `
    <div :class="['activity-panel', 'mode-' + mode]">
      <div class=activity-head @mousedown="$emit('drag', $event)">
        <span class=group-label>Activity</span>
        <span class=activity-modes>
          <button v-for="m in ACTIVITY_MODES" :key="m.value" type=button :class="['mode-btn', {on: mode === m.value}]"
            :title="m.label" :aria-label="m.label" :aria-pressed="mode === m.value" @mousedown.stop @click="setMode(m.value)">
            <Icon :name="m.icon"/>
          </button>
        </span>
      </div>
      <template v-if="data">
        <div v-if="data.agent" class=activity-agent>
          <div class=activity-meta><span class="env-dot live"></span>Agent<span v-if="data.agent.seen"> · {{ data.agent.seen }}</span></div>
          <div v-if="data.agent.text" class="activity-text clamp">{{ data.agent.text }}</div>
        </div>
        <div class=activity-list>
          <template v-for="(e, i) in data.events" :key="i">
            <a v-if="href(e)" class="activity-row activity-link" :href="href(e)">
              <span class=activity-text>{{ e.text }}</span><span class=activity-age>{{ e.by }} · {{ e.age || 'just now' }}</span>
            </a>
            <div v-else class=activity-row>
              <span class=activity-text>{{ e.text }}</span><span class=activity-age>{{ e.by }} · {{ e.age || 'just now' }}</span>
            </div>
          </template>
        </div>
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
    const ACTIVITY_PAGES = { todo: "todos", question: "questions", message: "messages", work: "work" };
    const activityHref = (e) => (e.n && ACTIVITY_PAGES[e.kind] && envName.value ? `#/env/${envName.value}/${ACTIVITY_PAGES[e.kind]}/${e.n}` : null);
    // where Activity shows, and where its window was dragged to, remembered in this browser
    const ACT = "journal.activity";
    const remembered = (() => { try { return JSON.parse(localStorage.getItem(ACT) || "{}"); } catch (e) { return {}; } })();
    const act = reactive({ mode: "sidebar", x: null, y: null, ...remembered });
    const saveAct = () => { try { localStorage.setItem(ACT, JSON.stringify({ mode: act.mode, x: act.x, y: act.y })); } catch (e) { /* storage off */ } };
    const setMode = (mode) => { act.mode = mode; saveAct(); };
    const drag = (ev) => {
      const box = ev.target.closest(".activity-float");
      if (!box || ev.button !== 0) return;
      const r = box.getBoundingClientRect();
      const dx = ev.clientX - r.left, dy = ev.clientY - r.top;
      const move = (e) => {
        act.x = Math.max(0, Math.min(window.innerWidth - r.width, e.clientX - dx));
        act.y = Math.max(0, Math.min(window.innerHeight - 40, e.clientY - dy));
      };
      const up = () => { window.removeEventListener("mousemove", move); window.removeEventListener("mouseup", up); saveAct(); };
      window.addEventListener("mousemove", move);
      window.addEventListener("mouseup", up);
      ev.preventDefault();
    };
    const floatStyle = computed(() => (act.x == null ? { right: "24px", bottom: "24px" } : { left: act.x + "px", top: act.y + "px" }));
    return { route, ov, envName, envRow, NAV, key, activity, folded, fold, activityHref, act, setMode, drag, floatStyle };
  },
  template: `
    <div class=app>
      <aside class=side>
        <a class=project :href="envName ? '#/env/' + envName : '#/'" :title="ov.data ? ov.data.project : ''">
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
            <a :class="['item', {on: route.view === 'Docs' || route.view === 'DocDetail'}]" href="#/docs"><Icon name="folder"/>Project docs<span class=count>{{ ov.data ? ov.data.docs : '' }}</span></a>
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
        <div class="group activity" v-if="activity.data && act.mode === 'sidebar'">
          <ActivityPanel :data="activity.data" :href="activityHref" mode="sidebar" :setMode="setMode"/>
        </div>
      </aside>
      <main class=main>
        <component :is="route.view" v-bind="route.params" :key="key"/>
      </main>
      <aside v-if="activity.data && act.mode === 'right'" class=activity-dock>
        <ActivityPanel :data="activity.data" :href="activityHref" mode="right" :setMode="setMode"/>
      </aside>
      <div v-if="activity.data && act.mode === 'float'" class=activity-float :style="floatStyle">
        <ActivityPanel :data="activity.data" :href="activityHref" mode="float" :setMode="setMode" @drag="drag"/>
      </div>
    </div>`,
};

const app = createApp(App);
app.config.globalProperties.$md = renderMarkdown;
app.config.globalProperties.$human = humanSize;
app.config.globalProperties.$refHref = refHref;
app.mount("#app");
