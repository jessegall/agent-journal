// The journal's browser renderer. Vue does the layout; the server only ever answers with
// JSON (see serve.py) — this file is the second renderer of that response, fmt.py the first.
"use strict";
const { createApp, reactive, computed, watchEffect, onUnmounted } = Vue;

// ─────────────────────────────────────────────────────────────── a hash router
// A detail route renders the same view as its list, with the item open in the side panel.
const ROUTES = [
  { re: /^\/$/, view: "Home" },
  { re: /^\/env\/([a-z0-9-]+)$/, view: "EnvHome", params: ["env"] },
  { re: /^\/env\/([a-z0-9-]+)\/todos(?:\/(\d+|new))?$/, view: "Todos", params: ["env", "n"] },
  { re: /^\/env\/([a-z0-9-]+)\/pins(?:\/(\d+|new))?$/, view: "Pins", params: ["env", "n"] },
  { re: /^\/env\/([a-z0-9-]+)\/inbox(?:\/(\d+))?$/, view: "Inbox", params: ["env", "n"] },
  { re: /^\/env\/([a-z0-9-]+)\/questions(?:\/(\d+))?$/, view: "Questions", params: ["env", "n"] },
  { re: /^\/env\/([a-z0-9-]+)\/work(?:\/(\d+|new))?$/, view: "Work", params: ["env", "n"] },
  { re: /^\/env\/([a-z0-9-]+)\/reminders(?:\/(\d+|new))?$/, view: "Reminders", params: ["env", "n"] },
  { re: /^\/env\/([a-z0-9-]+)\/docs(?:\/(new))?$/, view: "EnvDocs", params: ["env", "n"] },
  { re: /^\/env\/([a-z0-9-]+)\/settings$/, view: "Settings", params: ["env"] },
  { re: /^\/rules(?:\/(\d+|new))?$/, view: "Rules", params: ["n"] },
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
function useFetch(urlFn) {
  const state = reactive({ data: null, loading: true, error: null, tick: 0 });
  state.reload = () => { state.tick += 1; };
  const stop = watchEffect(() => {
    const url = urlFn();
    void state.tick;
    if (!url) return;
    if (state.data === null) state.loading = true;
    state.error = null;
    fetch(url)
      .then((r) => r.json().then((body) => ({ ok: r.ok, body })))
      .then(({ ok, body }) => {
        if (!ok) throw new Error(body.error || "request failed");
        state.data = body;
      })
      .catch((e) => { state.error = e.message; })
      .finally(() => { state.loading = false; });
  });
  onUnmounted(stop);
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
  if (kind === "reminder") return `#/env/${env}/reminders`;
  if (kind === "inbox") return `#/env/${env}/inbox/${num}`;
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
      <template v-if="name === 'todos'"><rect x="4.75" y="1.75" width="6.5" height="12.5" rx="3.25"/><rect x="6.5" y="7.75" width="3" height="4.75" rx="1.5" fill="currentColor" stroke="none"/></template>
      <path v-else-if="name === 'pins'" d="M8 14V9.5M5 2.5h6M6 2.5v3.5L4 9.5h8L10 6V2.5"/>
      <template v-else-if="name === 'work'"><circle cx="8" cy="8" r="5.5"/><path d="M8 5v3l2 1.5"/></template>
      <path v-else-if="name === 'reminders'" d="M4 11V7a4 4 0 0 1 8 0v4l1 1.5H3L4 11ZM6.5 14h3"/>
      <template v-else-if="name === 'docs'"><path d="M4 1.8h5.5L12.5 5v9.2H4V1.8Z"/><path d="M9.5 1.8V5h3"/></template>
      <path v-else-if="name === 'rules'" d="M3 3.5h10M3 8h10M3 12.5h6"/>
      <path v-else-if="name === 'folder'" d="M2.5 3h4l1.5 1.5h5.5v8.5h-11V3Z"/>
      <template v-else-if="name === 'inbox'"><path d="M2 9.5l1.8-6h8.4l1.8 6v3.5H2V9.5Z"/><path d="M2 9.5h3.5l1 1.5h3l1-1.5H14"/></template>
      <template v-else-if="name === 'questions'"><circle cx="8" cy="8" r="5.5"/><path d="M6.4 6.3a1.7 1.7 0 0 1 3.2.7c0 1.2-1.6 1.4-1.6 2.5"/><circle cx="8" cy="11.4" r=".6" fill="currentColor" stroke="none"/></template>
      <path v-else-if="name === 'home'" d="M2.5 7.5L8 2.75l5.5 4.75v6.25h-3.75v-4h-3.5v4H2.5V7.5Z"/>
      <path v-else-if="name === 'close'" d="M4 4l8 8M12 4l-8 8"/>
      <template v-else-if="name === 'settings'"><circle cx="8" cy="8" r="2"/><path d="M8 1.75v1.5M8 12.75v1.5M1.75 8h1.5M12.75 8h1.5M3.6 3.6l1.05 1.05M11.35 11.35l1.05 1.05M3.6 12.4l1.05-1.05M11.35 4.65l1.05-1.05"/></template>
    </svg>`,
};

// A STATUS IS A PILL: an outline when open, filling as it moves, struck through when blocked.
const STATUS_COLOR = { progress: "var(--accent)", blocked: "var(--warn)", waiting: "var(--accent-text)" };
const StatusIcon = {
  props: ["kind"],
  setup(props) {
    const color = computed(() => STATUS_COLOR[props.kind] || "var(--text-3)");
    return { color };
  },
  template: `
    <svg class=ico viewBox="0 0 16 16" fill="none" :aria-label="kind">
      <rect x="4.75" y="1.75" width="6.5" height="12.5" rx="3.25" stroke-width="1.5"
        :style="{stroke: color}" :stroke-dasharray="kind === 'withdrawn' ? '2 2' : null"/>
      <rect v-if="kind === 'progress'" x="6.5" y="7.75" width="3" height="4.75" rx="1.5" :style="{fill: color}"/>
      <rect v-if="kind === 'done'" x="6.5" y="3.5" width="3" height="9" rx="1.5" :style="{fill: color}"/>
      <circle v-if="kind === 'waiting'" cx="8" cy="8" r="1.5" :style="{fill: color}"/>
      <path v-if="kind === 'blocked'" d="M2.5 8h11" stroke-width="1.5" stroke-linecap="round" :style="{stroke: color}"/>
    </svg>`,
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
    </div>`,
};

const Panel = {
  props: ["label", "close"],
  components: { Icon },
  template: `
    <aside class=panel>
      <div class=panel-top><span>{{ label }}</span><a class=icon-btn :href="close" title="Close"><Icon name="close"/></a></div>
      <div class=panel-body><slot/></div>
    </aside>`,
};

const Compose = {
  props: ["placeholder", "submit", "hint", "send"],
  setup(props) {
    const draft = reactive({ text: "", sending: false, error: null });
    async function go() {
      if (!draft.text.trim() || draft.sending) return;
      draft.sending = true;
      draft.error = null;
      try {
        await props.send(draft.text);
        draft.text = "";
      } catch (e) {
        draft.error = e.message;
      } finally {
        draft.sending = false;
      }
    }
    return { draft, go };
  },
  template: `
    <form class=compose @submit.prevent="go">
      <textarea class=box-area v-model="draft.text" rows=3 :placeholder="placeholder" :aria-label="submit"
        @keydown.meta.enter.prevent="go" @keydown.ctrl.enter.prevent="go"></textarea>
      <div class=compose-bar>
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

function useEnvironments(current) {
  const ov = useFetch(() => "/api/overview");
  return computed(() => (ov.data ? ov.data.environments.map((e) => e.name).filter((name) => name !== current()) : []));
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

function priorityName(value) {
  const v = Number(value ?? 100);
  return v >= 200 ? "Critical" : v > 100 ? "High" : v < 100 ? "Low" : "Default";
}

const Todos = {
  props: ["env", "n"],
  components: { TopBar, Panel, StatusIcon, PriorityIcon, LinkedQuestions, ActionBar },
  setup(props) {
    const api = computed(() => `/api/env/${props.env}/todos`);
    const base = computed(() => `#/env/${props.env}/todos`);
    const list = useFetch(() => props.env && api.value);
    const item = useFetch(() => props.env && props.n && props.n !== "new" && `${api.value}/${props.n}`);
    const envs = useEnvironments(() => props.env);
    const view = reactive({ done: false });
    const groups = computed(() => {
      if (!list.data) return [];
      return GROUPS.filter((g) => g.key !== "done" || view.done).map((g) => ({
        ...g,
        rows: list.data.filter((t) => todoStatus(t) === g.key)
          .sort((a, b) => (b.priority ?? 100) - (a.priority ?? 100) || b.n - a.n),
      })).filter((g) => g.rows.length);
    });
    const open = computed(() => (list.data || []).filter((t) => todoStatus(t) !== "done").length);
    const creating = computed(() => [{
      label: "New to-do", method: "POST", url: api.value, submit: "Add to-do", leave: true,
      fields: [{ name: "title", label: "Title", placeholder: "What needs doing, in a few words" },
               { name: "body", label: "Brief", kind: "area", placeholder: "Anything the agent needs to know to do it" },
               { name: "after", label: "Waits on (optional)", placeholder: "to-do numbers, like 3, 7" }],
    }]);
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
    const done = (body, a) => settle(body, a, base.value, list, item);
    return { list, item, view, groups, open, creating, actions, done, base, todoStatus, STATUS_LABEL, priorityName };
  },
  template: `
    <TopBar :crumbs="[env, 'To-dos']"/>
    <div class=viewbar>
      <span>Grouped by <b>status</b></span><span>Ordered by <b>priority</b></span>
      <span v-if="list.data"><b>{{ open }}</b> open</span>
      <label class=toggle><input type=checkbox v-model="view.done"> Show done</label>
      <a class="btn new" :href="base + '/new'">New to-do</a>
    </div>
    <div class=body>
      <div class=list>
        <p v-if="list.loading && !list.data" class=empty>Loading…</p>
        <p v-else-if="list.error" class=error>{{ list.error }}</p>
        <template v-else-if="list.data">
          <template v-for="g in groups" :key="g.key">
            <div class=ghead><StatusIcon :kind="g.key"/>{{ g.label }}<span class=n>{{ g.rows.length }}</span></div>
            <a v-for="t in g.rows" :key="t.n" :class="['row', 'todorow', {sel: String(t.n) === n}]" :href="base + '/' + t.n">
              <PriorityIcon :value="t.priority"/>
              <StatusIcon :kind="g.key"/>
              <span class=num>#{{ t.n }}</span>
              <span class=title>{{ t.title }}</span>
              <span class=cite>{{ t.doc ? 'Doc ' + t.doc : '' }}</span>
              <span class=age>{{ t.age }}</span>
            </a>
          </template>
          <p v-if="!groups.length" class=empty>Nothing is waiting on this environment.</p>
        </template>
      </div>
      <Panel v-if="n === 'new'" label="New to-do" :close="base">
        <ActionBar :actions="creating" open="New to-do" :done="done"/>
      </Panel>
      <Panel v-else-if="n" :label="'To-do #' + n" :close="base">
        <p v-if="item.error" class=error>{{ item.error }}</p>
        <template v-else-if="item.data">
          <h2 class=p-title>{{ item.data.title }}</h2>
          <dl class=props>
            <dt>Status</dt><dd><StatusIcon :kind="todoStatus(item.data)"/>{{ STATUS_LABEL[todoStatus(item.data)] }}</dd>
            <dt>Priority</dt><dd><PriorityIcon :value="item.data.priority"/>{{ priorityName(item.data.priority) }}</dd>
            <dt>Cites</dt><dd><a v-if="item.data.doc" :href="'#/docs/' + item.data.doc">Doc {{ item.data.doc }}</a><span v-else class=muted>—</span></dd>
            <dt>Added</dt><dd>{{ item.data.age || '—' }}</dd>
            <template v-if="item.data.after.length">
              <dt>Waits on</dt><dd><a v-for="a in item.data.after" :key="a" :href="base + '/' + a">#{{ a }}</a></dd>
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
          <LinkedQuestions :rows="item.data.questions" :env="env"/>
        </template>
      </Panel>
    </div>`,
};

// ─────────────────────────────────────────────────────────────── pins and rules
function claimsView({ crumbs, api, base, noun, scope, empty, movable }) {
  return {
    props: ["env", "n"],
    components: { TopBar, Panel, LinkedQuestions, ActionBar },
    setup(props) {
      const list = useFetch(() => api(props));
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
          { label: "Strike", method: "DELETE", url, danger: true, fields: [{ name: "why", label: "Why it stopped being true" }] },
        ];
      });
      const done = (body, a) => settle(body, a, base(props), list, item);
      return { list, item, creating, actions, done, ageOf, docOf, crumbs: computed(() => crumbs(props)),
               base: computed(() => base(props)), scope: computed(() => scope(props)), noun, word, empty };
    },
    template: `
      <TopBar :crumbs="crumbs"/>
      <div class=viewbar><span>Ordered by <b>newest</b></span><span v-if="list.data"><b>{{ list.data.length }}</b> standing</span>
        <a class="btn new" :href="base + '/new'">New {{ word }}</a></div>
      <div class=body>
        <div class=list>
          <p v-if="list.loading && !list.data" class=empty>Loading…</p>
          <p v-else-if="list.error" class=error>{{ list.error }}</p>
          <template v-else-if="list.data">
            <a v-for="p in list.data" :key="p.n" :class="['row', 'pinrow', {sel: String(p.n) === n, struck: p.struck}]" :href="base + '/' + p.n">
              <span class=num>#{{ p.n }}</span>
              <span class=title>{{ p.fact }}</span>
              <span class=cite>{{ docOf(p.meta) ? 'Doc ' + docOf(p.meta) : '' }}</span>
              <span class=age>{{ ageOf(p.meta) }}</span>
            </a>
            <p v-if="!list.data.length" class=empty>{{ empty }}</p>
          </template>
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
            <LinkedQuestions :rows="item.data.questions" :env="env"/>
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
  components: { TopBar, Panel, StatusIcon, Compose, ActionBar },
  setup(props) {
    const api = computed(() => `/api/env/${props.env}/inbox`);
    const base = computed(() => `#/env/${props.env}/inbox`);
    const list = useFetch(() => props.env && api.value);
    const envs = useEnvironments(() => props.env);
    const send = (text) => postJSON(api.value, { text }).then(() => { list.reload(); changed(); });
    const item = computed(() => (list.data && props.n ? list.data.find((m) => String(m.n) === props.n) : null));
    const waiting = computed(() => (list.data || []).filter((m) => m.status === "waiting").length);
    const became = (m) => [...new Set(m.parts.flatMap((p) => p.became.map((b) => b.label)))].join(", ");
    const actions = computed(() => {
      const m = item.value;
      if (!m || m.status !== "waiting") return [];
      const url = `${api.value}/${m.n}`;
      return [
        { label: "Edit", method: "PATCH", url, only: true, submit: "Save", fields: [{ name: "text", label: "Message", kind: "area", value: m.text }] },
        { label: "Move", method: "POST", url: `${url}/move`, fields: [envField(envs.value)], leave: true,
          note: "For a message left on the wrong environment: it waits there instead." },
      ];
    });
    const done = (body, a) => settle(body, a, base.value, list);
    return { list, send, item, waiting, became, actions, done };
  },
  template: `
    <TopBar :crumbs="[env, 'Inbox']"/>
    <div class=viewbar><span>Waiting <b>first</b></span><span v-if="list.data"><b>{{ waiting }}</b> waiting</span></div>
    <div class=body>
      <div class=list>
        <div class=compose-wrap>
          <Compose placeholder="Leave a message for the agent: an instruction, a follow-up, anything"
            submit="Send" hint="The agent is told at its next stop" :send="send"/>
        </div>
        <p v-if="list.loading && !list.data" class=empty>Loading…</p>
        <p v-else-if="list.error" class=error>{{ list.error }}</p>
        <template v-else-if="list.data">
          <a v-for="m in list.data" :key="m.n" :class="['row', 'inboxrow', {sel: String(m.n) === n}]" :href="'#/env/' + env + '/inbox/' + m.n">
            <StatusIcon :kind="m.status === 'waiting' ? 'waiting' : 'done'"/>
            <span class=num>#{{ m.n }}</span>
            <span class=title>{{ m.text }}</span>
            <span class=cite>{{ became(m) }}</span>
            <span class=age>{{ m.age }}</span>
          </a>
          <p v-if="!list.data.length" class=empty>The inbox is empty.</p>
        </template>
      </div>
      <Panel v-if="n && item" :label="'Message #' + n" :close="'#/env/' + env + '/inbox'">
        <div class="prose message">{{ item.text }}</div>
        <dl class=props>
          <dt>Status</dt><dd><StatusIcon :kind="item.status === 'waiting' ? 'waiting' : 'done'"/>{{ item.status === 'waiting' ? 'Waiting to be processed' : item.status === 'moved' ? 'Moved to ' + item.moved_to : 'Processed' }}</dd>
          <dt>Left</dt><dd>{{ item.age || '—' }}</dd>
          <dt>From</dt><dd>{{ item.source === 'web' ? 'The browser' : 'The terminal' }}</dd>
        </dl>
        <ActionBar :actions="actions" :done="done" :key="'message' + item.n + item.status"/>
        <div v-if="item.parts.length">
          <p class=section-label>What it became</p>
          <div class=part v-for="(p, i) in item.parts" :key="i">
            <div class=excerpt>«{{ p.excerpt }}»</div>
            <template v-for="b in p.became" :key="b.ref">
              <a v-if="$refHref(b.ref, env)" :href="$refHref(b.ref, env)" class=chip>{{ b.label }}</a>
              <span v-else class=chip>{{ b.label }}</span>
            </template>
          </div>
        </div>
        <p v-else-if="item.status === 'waiting'" class="prose muted">Not processed yet. At its next stop the agent splits it into parts and records what each became.</p>
      </Panel>
    </div>`,
};

const Questions = {
  props: ["env", "n"],
  components: { TopBar, Panel, StatusIcon, Compose, ActionBar },
  setup(props) {
    const api = computed(() => `/api/env/${props.env}/questions`);
    const base = computed(() => `#/env/${props.env}/questions`);
    const list = useFetch(() => props.env && api.value);
    const item = useFetch(() => props.env && props.n && `${api.value}/${props.n}`);
    const answer = (text) => postJSON(`${api.value}/${props.n}/answer`, { answer: text })
      .then((body) => { item.data = body.data; list.reload(); changed(); });
    const open = computed(() => (list.data || []).filter((q) => q.status === "open").length);
    const about = (q) => q.links.map((l) => l.label).join(", ");
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
    const done = (body, a) => settle(body, a, base.value, list, item);
    return { list, item, answer, open, about, questionKind, actions, done };
  },
  template: `
    <TopBar :crumbs="[env, 'Questions']"/>
    <div class=viewbar><span>Open <b>first</b></span><span v-if="list.data"><b>{{ open }}</b> open</span></div>
    <div class=body>
      <div class=list>
        <p v-if="list.loading && !list.data" class=empty>Loading…</p>
        <p v-else-if="list.error" class=error>{{ list.error }}</p>
        <template v-else-if="list.data">
          <a v-for="q in list.data" :key="q.n" :class="['row', 'questionrow', {sel: String(q.n) === n}]" :href="'#/env/' + env + '/questions/' + q.n">
            <StatusIcon :kind="questionKind(q)"/>
            <span class=num>#{{ q.n }}</span>
            <span class=title>{{ q.text }}</span>
            <span class=cite>{{ about(q) }}</span>
            <span class=age>{{ q.age }}</span>
          </a>
          <p v-if="!list.data.length" class=empty>Nothing has been asked on this environment.</p>
        </template>
      </div>
      <Panel v-if="n" :label="'Question #' + n" :close="'#/env/' + env + '/questions'">
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
          <div v-if="item.data.answer">
            <p class=section-label>Answer<span v-if="item.data.answered_age"> · {{ item.data.answered_age }}</span></p>
            <div class="md prose" v-html="$md(item.data.answer)"></div>
          </div>
          <div v-if="item.data.withdrawn" class=note>Withdrawn: {{ item.data.withdrawn }}</div>
          <Compose v-else :placeholder="item.data.answer ? 'Write a new answer. The old one stays in the history.' : 'Your answer'"
            :submit="item.data.answer ? 'Add new answer' : 'Answer'" hint="The agent is told at its next stop" :send="answer"/>
        </template>
      </Panel>
    </div>`,
};

// ─────────────────────────────────────────────────────────────── work and reminders
const Work = {
  props: ["env", "n"],
  components: { TopBar, Panel, StatusIcon, ActionBar },
  setup(props) {
    const api = computed(() => `/api/env/${props.env}/work`);
    const base = computed(() => `#/env/${props.env}/work`);
    const list = useFetch(() => props.env && api.value);
    const item = useFetch(() => props.env && props.n && props.n !== "new" && `${api.value}/${props.n}`);
    const creating = computed(() => [{
      label: "Start work", method: "POST", url: api.value, submit: "Start", leave: true,
      fields: [{ name: "subject", label: "The work, in a sentence" }],
    }]);
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
    const done = (body, a) => settle(body, a, base.value, list, item);
    return { list, item, creating, actions, done, base };
  },
  template: `
    <TopBar :crumbs="[env, 'Open work']"/>
    <div class=viewbar><span v-if="list.data"><b>{{ list.data.length }}</b> open</span>
      <a class="btn new" :href="base + '/new'">Start work</a></div>
    <div class=body>
      <div class=list>
        <p v-if="list.loading && !list.data" class=empty>Loading…</p>
        <p v-else-if="list.error" class=error>{{ list.error }}</p>
        <template v-else-if="list.data">
          <a :class="['row', 'workrow', {sel: String(w.n) === n}]" v-for="w in list.data" :key="w.n" :href="base + '/' + w.n">
            <StatusIcon kind="progress"/>
            <div>
              <div class=title>{{ w.subject }}</div>
              <div v-for="(note, i) in w.notes.slice(-3)" :key="i" class=sub>{{ note.text }}</div>
            </div>
            <span class=age>{{ w.age }}</span>
          </a>
          <p v-if="!list.data.length" class=empty>Nothing is open.</p>
        </template>
      </div>
      <Panel v-if="n === 'new'" label="Start work" :close="base">
        <ActionBar :actions="creating" open="Start work" :done="done"/>
      </Panel>
      <Panel v-else-if="n" :label="'Work #' + n" :close="base">
        <p v-if="item.error" class=error>{{ item.error }}</p>
        <template v-else-if="item.data">
          <h2 class=p-title>{{ item.data.subject }}</h2>
          <dl class=props>
            <dt>Started</dt><dd>{{ item.data.age || '—' }}</dd>
            <dt>Status</dt><dd>{{ item.data.ended ? 'Ended' : item.data.awaiting ? 'Waiting on ' + item.data.awaiting : 'Open' }}</dd>
          </dl>
          <ActionBar :actions="actions" :done="done" :key="'work' + item.data.n + (item.data.ended || '')"/>
          <div v-if="item.data.notes.length">
            <p class=section-label>Notes</p>
            <div class=linked><div v-for="(note, i) in item.data.notes" :key="i" class=sub>{{ note.text }}</div></div>
          </div>
        </template>
      </Panel>
    </div>`,
};

const Reminders = {
  props: ["env", "n"],
  components: { TopBar, Panel, ActionBar },
  setup(props) {
    const api = computed(() => `/api/env/${props.env}/reminders`);
    const base = computed(() => `#/env/${props.env}/reminders`);
    const list = useFetch(() => props.env && api.value);
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
    return { list, item, creating, actions, done, base };
  },
  template: `
    <TopBar :crumbs="[env, 'Reminders']"/>
    <div class=viewbar><span>Said again at <b>every stop</b></span><span v-if="list.data"><b>{{ list.data.length }}</b> standing</span>
      <a class="btn new" :href="base + '/new'">New reminder</a></div>
    <div class=body>
      <div class=list>
        <p v-if="list.loading && !list.data" class=empty>Loading…</p>
        <p v-else-if="list.error" class=error>{{ list.error }}</p>
        <template v-else-if="list.data">
          <a :class="['row', 'reminderrow', {sel: String(r.n) === n}]" v-for="r in list.data" :key="r.n" :href="base + '/' + r.n">
            <span class=num>#{{ r.n }}</span><span class=title>{{ r.text }}</span><span class=cite>{{ r.meta }}</span>
          </a>
          <p v-if="!list.data.length" class=empty>Nothing is being repeated.</p>
        </template>
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
        </template>
      </Panel>
    </div>`,
};

// ─────────────────────────────────────────────────────────────── docs
function docList({ crumbs, url, base, empty }) {
  return {
    props: ["env", "n"],
    components: { TopBar, ActionBar },
    setup(props) {
      const s = useFetch(() => url(props));
      const creating = computed(() => [{
        label: "New doc", method: "POST", url: url(props), submit: "Add doc", leave: true,
        follow: (body) => { const m = /doc (\d+)/.exec(body.message || ""); return m ? `#/docs/${m[1]}` : null; },
        fields: [{ name: "title", label: "Title" }, { name: "abstract", label: "Abstract, in one line" },
                 { name: "body", label: "Text", kind: "area" }],
      }]);
      const done = (body, a) => settle(body, a, base(props), s);
      return { s, creating, done, crumbs: computed(() => crumbs(props)), base: computed(() => base(props)), empty };
    },
    template: `
      <TopBar :crumbs="crumbs"/>
      <div class=viewbar><span>Ordered by <b>number</b></span><span v-if="s.data"><b>{{ s.data.length }}</b> catalogued</span>
        <a class="btn new" :href="base + '/new'">New doc</a></div>
      <div class=body><div class=list>
        <div v-if="n === 'new'" class=compose-wrap><ActionBar :actions="creating" open="New doc" :done="done"/></div>
        <p v-if="s.loading && !s.data" class=empty>Loading…</p>
        <p v-else-if="s.error" class=error>{{ s.error }}</p>
        <template v-else-if="s.data">
          <a v-for="d in s.data" :key="d.n" :class="['row', 'docrow', {struck: d.superseded_by}]" :href="'#/docs/' + d.n">
            <span class=num>#{{ d.n }}</span><span class=title>{{ d.title }}</span>
            <span class=tag>{{ d.status }}</span><span class=age>{{ d.age }}</span>
          </a>
          <p v-if="!s.data.length" class=empty>{{ empty }}</p>
        </template>
      </div></div>`,
  };
}

const Docs = docList({ crumbs: () => ["Project", "All docs"], url: () => "/api/docs", base: () => "#/docs",
                       empty: "No project-wide docs are catalogued." });
const EnvDocs = docList({ crumbs: (p) => [p.env, "Docs"], url: (p) => p.env && `/api/env/${p.env}/docs`,
                          base: (p) => `#/env/${p.env}/docs`,
                          empty: "No docs are scoped to this environment; the project's docs still apply." });

const DocDetail = {
  // NAMED "docref", NOT "ref": Vue intercepts `ref` as its own template-ref attribute.
  props: ["docref"],
  components: { TopBar, Icon, LinkedQuestions, ActionBar },
  setup(props) {
    const s = useFetch(() => props.docref && `/api/docs/${props.docref}`);
    const envs = useEnvironments(() => "");
    const restParts = computed(() => {
      if (!s.data) return [];
      const skip = s.data.part ? s.data.part.p : null;
      return s.data.parts.filter((p) => p.p !== skip);
    });
    const citedHref = (c) => c.kind === "rule" ? `#/rules/${c.n}` : c.kind === "to-do" ? `#/env/${c.env}/todos/${c.n}` : `#/env/${c.env}/pins/${c.n}`;
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
      ];
    });
    const done = (body, a) => settle(body, a, "", s);
    return { s, restParts, citedHref, actions, done };
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
        <div v-if="s.data.attachments.length">
          <p class=section-label>Attachments</p>
          <div class=attachment-grid>
            <div class=attachment-card v-for="a in s.data.attachments" :key="a.name">
              <Icon :name="a.dir ? 'folder' : 'docs'"/>
              <div class=attachment-info>
                <a v-if="!a.dir" class=attachment-name :href="'/docs/' + s.data.n + '/files/' + encodeURIComponent(a.name)">{{ a.name }}</a>
                <span v-else class=attachment-name>{{ a.name }}/</span>
                <span class=attachment-meta>{{ a.dir ? 'folder' : a.title }} · {{ $human(a.size) }}</span>
              </div>
            </div>
          </div>
        </div>
        <LinkedQuestions :rows="s.data.questions"/>
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

// ─────────────────────────────────────────────────────────────── an environment's home
const EnvHome = {
  props: ["env"],
  components: { TopBar, Icon, StatusIcon, PriorityIcon },
  setup(props) {
    const url = (tail) => () => props.env && `/api/env/${props.env}${tail}`;
    const summary = useFetch(url(""));
    const work = useFetch(url("/work"));
    const todos = useFetch(url("/todos"));
    const inbox = useFetch(url("/inbox"));
    const questions = useFetch(url("/questions"));
    const groups = computed(() => {
      const rows = (todos.data || []).filter((t) => todoStatus(t) !== "done")
        .sort((a, b) => (b.priority ?? 100) - (a.priority ?? 100) || b.n - a.n);
      return GROUPS.filter((g) => g.key !== "done").map((g) => {
        const all = rows.filter((t) => todoStatus(t) === g.key);
        return { ...g, total: all.length, rows: g.key === "open" ? all.slice(0, 5) : all };
      }).filter((g) => g.rows.length);
    });
    const waiting = computed(() => (inbox.data || []).filter((m) => m.status === "waiting"));
    const asking = computed(() => (questions.data || []).filter((q) => q.status === "open"));
    const stats = computed(() => {
      const s = summary.data || {};
      return [
        { label: "Inbox waiting", n: s.inbox, icon: "inbox", path: "inbox", hot: s.inbox },
        { label: "Open questions", n: s.questions, icon: "questions", path: "questions", hot: s.questions },
        { label: "Open to-dos", n: s.todos, icon: "todos", path: "todos" },
        { label: "Pins", n: s.pins, icon: "pins", path: "pins" },
        { label: "Reminders", n: s.reminders, icon: "reminders", path: "reminders" },
        { label: "Docs", n: s.docs, icon: "docs", path: "docs" },
      ];
    });
    const about = (q) => q.links.map((l) => l.label).join(", ");
    return { work, groups, waiting, asking, stats, about, questionKind };
  },
  template: `
    <TopBar :crumbs="[env, 'Home']"/>
    <div class=page><div class=home>
      <div class=stats>
        <a v-for="s in stats" :key="s.path" :class="['stat', {hot: s.hot}]" :href="'#/env/' + env + '/' + s.path">
          <span class=stat-top><span>{{ s.label }}</span><Icon :name="s.icon"/></span>
          <span class=stat-n>{{ s.n ?? '–' }}</span>
        </a>
      </div>

      <section>
        <div class=home-head><h2>Open work</h2><span class=n>{{ work.data ? work.data.length : '' }}</span></div>
        <div class=block>
          <p v-if="work.loading && !work.data" class=empty>Loading…</p>
          <p v-else-if="work.error" class=error>{{ work.error }}</p>
          <template v-else-if="work.data">
            <div class="row workrow" v-for="w in work.data" :key="w.subject">
              <StatusIcon kind="progress"/>
              <div>
                <div class=title>{{ w.subject }}</div>
                <div v-for="(note, i) in w.notes.slice(-3)" :key="i" class=sub>{{ note.text }}</div>
              </div>
              <span class=age>{{ w.age }}</span>
            </div>
            <p v-if="!work.data.length" class=empty>Nothing is open.</p>
          </template>
        </div>
      </section>

      <section v-if="waiting.length">
        <div class=home-head><h2>Inbox</h2><span class=n>{{ waiting.length }} waiting</span>
          <a class=more :href="'#/env/' + env + '/inbox'">Open inbox</a></div>
        <div class=block>
          <a v-for="m in waiting" :key="m.n" class="row inboxrow" :href="'#/env/' + env + '/inbox/' + m.n">
            <StatusIcon kind="waiting"/><span class=num>#{{ m.n }}</span><span class=title>{{ m.text }}</span>
            <span class=cite></span><span class=age>{{ m.age }}</span>
          </a>
        </div>
      </section>

      <section v-if="asking.length">
        <div class=home-head><h2>Questions</h2><span class=n>{{ asking.length }} open</span>
          <a class=more :href="'#/env/' + env + '/questions'">All questions</a></div>
        <div class=block>
          <a v-for="q in asking" :key="q.n" class="row questionrow" :href="'#/env/' + env + '/questions/' + q.n">
            <StatusIcon :kind="questionKind(q)"/><span class=num>#{{ q.n }}</span><span class=title>{{ q.text }}</span>
            <span class=cite>{{ about(q) }}</span><span class=age>{{ q.age }}</span>
          </a>
        </div>
      </section>

      <section>
        <div class=home-head><h2>To-dos</h2><a class=more :href="'#/env/' + env + '/todos'">All to-dos</a></div>
        <div class=block>
          <p v-if="!groups.length" class=empty>Nothing is waiting on this environment.</p>
          <template v-for="g in groups" :key="g.key">
            <div class=ghead><StatusIcon :kind="g.key"/>{{ g.label }}
              <span class=n>{{ g.total > g.rows.length ? g.rows.length + ' of ' + g.total : g.total }}</span></div>
            <a v-for="t in g.rows" :key="t.n" class="row todorow" :href="'#/env/' + env + '/todos/' + t.n">
              <PriorityIcon :value="t.priority"/><StatusIcon :kind="g.key"/><span class=num>#{{ t.n }}</span>
              <span class=title>{{ t.title }}</span><span class=cite>{{ t.doc ? 'Doc ' + t.doc : '' }}</span>
              <span class=age>{{ t.age }}</span>
            </a>
          </template>
        </div>
      </section>
    </div></div>`,
};

// ─────────────────────────────────────────────────────────────── an environment's settings
const Settings = {
  props: ["env"],
  components: { TopBar, ActionBar },
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
      note: s.data ? `This deletes its ${s.data.pins} pin(s), ${s.data.todos} open to-do(s), its open work and its inbox for good. Docs stay with the project.` : "",
    }]);
    const done = () => { changed(); location.hash = "#/"; };
    return { s, auto, setAuto, removing, done };
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
            <label class=toggle><input type=checkbox :checked="s.data.auto" :disabled="auto.saving" @change="setAuto($event.target.checked)">
              Work through the to-do list without asking</label>
            <p class="prose muted">When this is on and nothing is open, the agent starts the next ready to-do by itself.</p>
            <p v-if="auto.error" class=error>{{ auto.error }}</p>
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

const VIEWS = { Home, EnvHome, Todos, Pins, Rules, Inbox, Questions, Work, Reminders, Docs, EnvDocs, DocDetail, Settings, NotFound };

// ─────────────────────────────────────────────────────────────── the app shell
// open work lives on Home, so the sidebar has no entry of its own for it
const NAV = [
  { key: "home", label: "Home", views: ["EnvHome", "Work"], path: "" },
  { key: "inbox", label: "Inbox", views: ["Inbox"], path: "inbox", count: "inbox" },
  { key: "todos", label: "To-dos", views: ["Todos"], path: "todos", count: "todos" },
  { key: "questions", label: "Questions", views: ["Questions"], path: "questions", count: "questions" },
  { key: "pins", label: "Pins", views: ["Pins"], path: "pins", count: "pins" },
  { key: "reminders", label: "Reminders", views: ["Reminders"], path: "reminders", count: "reminders" },
  { key: "docs", label: "Docs", views: ["EnvDocs"], path: "docs", count: "docs" },
  { key: "settings", label: "Settings", views: ["Settings"], path: "settings" },
];

const App = {
  components: { ...VIEWS, Icon },
  setup() {
    const route = reactive(parseHash());
    const ov = reactive({ data: null });
    const loadOverview = () => fetch("/api/overview").then((r) => r.json()).then((d) => { ov.data = d; }).catch(() => {});
    const onHash = () => { Object.assign(route, parseHash()); loadOverview(); };
    window.addEventListener("hashchange", onHash);
    window.addEventListener("journal:changed", loadOverview);
    onUnmounted(() => {
      window.removeEventListener("hashchange", onHash);
      window.removeEventListener("journal:changed", loadOverview);
    });
    loadOverview();
    const envName = computed(() => {
      if (route.params.env) return route.params.env;
      const envs = ov.data ? ov.data.environments : [];
      return (envs.find((e) => e.current) || envs[0] || {}).name || "";
    });
    const envRow = computed(() => (ov.data ? ov.data.environments.find((e) => e.name === envName.value) : null));
    watchEffect(() => {
      if (route.view === "Home" && envName.value) location.replace(`#/env/${envName.value}`);
    });
    const key = computed(() => route.view + ":" + (route.params.env || ""));
    return { route, ov, envName, envRow, NAV, key };
  },
  template: `
    <div class=app>
      <aside class=side>
        <a class=project :href="envName ? '#/env/' + envName : '#/'" :title="ov.data ? ov.data.project : ''">
          <span class=logo>{{ (envName || 'j').charAt(0).toUpperCase() }}</span>{{ envName || 'journal' }}
        </a>
        <div class=group v-if="envName">
          <a v-for="item in NAV" :key="item.key" :class="['item', {on: item.views.includes(route.view)}]"
            :href="'#/env/' + envName + (item.path ? '/' + item.path : '')">
            <Icon :name="item.key"/>{{ item.label }}
            <span v-if="item.count" :class="['count', {hot: item.key === 'inbox' && envRow && envRow.inbox}]">{{ envRow && envRow[item.count] ? envRow[item.count] : '' }}</span>
          </a>
        </div>
        <div class=group>
          <div class=group-label>Project</div>
          <a :class="['item', {on: route.view === 'Rules'}]" href="#/rules"><Icon name="rules"/>Rules<span class=count>{{ ov.data ? ov.data.rules : '' }}</span></a>
          <a :class="['item', {on: route.view === 'Docs' || route.view === 'DocDetail'}]" href="#/docs"><Icon name="folder"/>All docs<span class=count>{{ ov.data ? ov.data.docs : '' }}</span></a>
        </div>
        <div class=group v-if="ov.data">
          <div class=group-label>Environments</div>
          <a v-for="e in ov.data.environments" :key="e.name" :class="['item', {on: route.params.env === e.name}]"
            :href="'#/env/' + e.name" :title="e.active ? 'an agent is working here' : ''">
            <span :class="['env-dot', {cur: e.current, live: e.active}]"></span>{{ e.name }}
          </a>
        </div>
      </aside>
      <main class=main>
        <component :is="route.view" v-bind="route.params" :key="key"/>
      </main>
    </div>`,
};

const app = createApp(App);
app.config.globalProperties.$md = renderMarkdown;
app.config.globalProperties.$human = humanSize;
app.config.globalProperties.$refHref = refHref;
app.mount("#app");
