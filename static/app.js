// The journal's browser renderer. Vue does the layout; the server only ever answers with
// JSON (see serve.py) — this file is the SECOND renderer of that same response, the CLI's
// text renderer (fmt.py) being the first. See doc 4, to-do 11 for unifying the two further.
"use strict";
const { createApp, reactive, computed, onMounted, onUnmounted, watchEffect } = Vue;

// ─────────────────────────────────────────────────────────────── a tiny hash router
// THE SAME SHAPE AS THE SERVER'S ROUTE TABLE, ON PURPOSE: a pattern and what it names.
// A hash route never reaches the Python process (browsers do not send the fragment), so
// the server only ever needs to answer `/` once; everything after that is this table.
const ROUTES = [
  { re: /^\/$/, view: "Home" },
  { re: /^\/env\/([a-z0-9-]+)$/, view: "EnvHome", params: ["env"] },
  { re: /^\/env\/([a-z0-9-]+)\/todos$/, view: "Todos", params: ["env"] },
  { re: /^\/env\/([a-z0-9-]+)\/todos\/(\d+)$/, view: "TodoDetail", params: ["env", "n"] },
  { re: /^\/env\/([a-z0-9-]+)\/pins$/, view: "Pins", params: ["env"] },
  { re: /^\/env\/([a-z0-9-]+)\/pins\/(\d+)$/, view: "PinDetail", params: ["env", "n"] },
  { re: /^\/env\/([a-z0-9-]+)\/work$/, view: "Work", params: ["env"] },
  { re: /^\/env\/([a-z0-9-]+)\/reminders$/, view: "Reminders", params: ["env"] },
  { re: /^\/env\/([a-z0-9-]+)\/docs$/, view: "EnvDocs", params: ["env"] },
  { re: /^\/rules$/, view: "Rules" },
  { re: /^\/rules\/(\d+)$/, view: "RuleDetail", params: ["n"] },
  { re: /^\/docs$/, view: "Docs" },
  { re: /^\/docs\/(\d+(?:\.\d+)?)$/, view: "DocDetail", params: ["docref"] },
];

function parseHash() {
  const path = (location.hash || "#/").slice(1) || "/";
  for (const r of ROUTES) {
    const m = r.re.exec(path);
    if (m) {
      const params = {};
      (r.params || []).forEach((name, i) => { params[name] = m[i + 1]; });
      return { view: r.view, params };
    }
  }
  return { view: "NotFound", params: {} };
}

// ─────────────────────────────────────────────────────────────── fetching helper
// EVERY VIEW COMPONENT USES THIS, so a fetch's loading/error handling is written once.
// `urlFn` returning a falsy value means "not ready yet" (a prop the route hasn't
// delivered this render) — skip the request rather than fetch `/api/.../undefined`.
function useFetch(urlFn) {
  const state = reactive({ data: null, loading: true, error: null });
  let stop = watchEffect(() => {
    const url = urlFn();
    if (!url) return;
    state.loading = true;
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

function esc(s) { return s == null ? "" : String(s); }   // Vue's template compiler escapes text nodes itself

// ─────────────────────────────────────────────────────────────── markdown
// A SMALL, HAND-WRITTEN RENDERER, ON PURPOSE: no markdown library exists in
// this project and none is added for this (same no-dependency reasoning as
// everywhere else) — headings, paragraphs, lists, fenced/inline code, bold,
// italic and links, and nothing past that. THE SOURCE IS ESCAPED FIRST,
// unconditionally, before any markdown syntax is turned into tags — every
// tag `inline()`/the block loop below adds is added to already-safe text,
// so a stray `<` or `&` in someone's prose can never become live HTML.
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
    if (h) { closeList(); const lvl = h[1].length; out.push(`<h${lvl}>${_mdInline(h[2])}</h${lvl}>`); i++; continue; }
    if (/^\s*$/.test(line)) { closeList(); i++; continue; }
    // A LIST ITEM'S WRAPPED CONTINUATION LINES belong to that item, not to a
    // new paragraph below it — collected the same way a paragraph collects
    // its own lines, stopping at whatever would start a new block.
    const ul = line.match(/^\s*[-*]\s+(.*)$/);
    if (ul) {
      if (listType !== "ul") { closeList(); out.push("<ul>"); listType = "ul"; }
      const item = [ul[1]];
      i++;
      while (i < lines.length && !/^\s*$/.test(lines[i]) && !/^#{1,6}\s/.test(lines[i]) &&
            !/^\s*[-*]\s/.test(lines[i]) && !/^\s*\d+\.\s/.test(lines[i]) && !/^```/.test(lines[i])) {
        item.push(lines[i].trim());
        i++;
      }
      out.push(`<li>${_mdInline(item.join(" "))}</li>`);
      continue;
    }
    const ol = line.match(/^\s*\d+\.\s+(.*)$/);
    if (ol) {
      if (listType !== "ol") { closeList(); out.push("<ol>"); listType = "ol"; }
      const item = [ol[1]];
      i++;
      while (i < lines.length && !/^\s*$/.test(lines[i]) && !/^#{1,6}\s/.test(lines[i]) &&
            !/^\s*[-*]\s/.test(lines[i]) && !/^\s*\d+\.\s/.test(lines[i]) && !/^```/.test(lines[i])) {
        item.push(lines[i].trim());
        i++;
      }
      out.push(`<li>${_mdInline(item.join(" "))}</li>`);
      continue;
    }
    closeList();
    const para = [line];
    i++;
    while (i < lines.length && !/^\s*$/.test(lines[i]) && !/^#{1,6}\s/.test(lines[i]) &&
          !/^\s*[-*]\s/.test(lines[i]) && !/^\s*\d+\.\s/.test(lines[i]) && !/^```/.test(lines[i])) {
      para.push(lines[i]);
      i++;
    }
    out.push(`<p>${_mdInline(para.join(" "))}</p>`);
  }
  closeList();
  return out.join("\n");
}

// ─────────────────────────────────────────────────────────────── shared bits
const Loading = { template: `<p class=meta>loading…</p>` };
const ErrorBox = { props: ["message"], template: `<p class=error>{{ message }}</p>` };
const Badges = {
  props: ["names"],
  template: `<span v-for="n in names" :key="n" class=badge>{{ n }}</span>`,
};

// ONE ROW, EVERYWHERE: tags stand on their own line above whatever the row
// links to — a to-do's title, a doc's title, an environment's name — never
// inline before it. Every list view uses this instead of writing its own
// badges+link markup, so the "tags above title" rule lives in one place.
const RowMain = {
  props: { badges: { type: Array, default: () => [] } },
  components: { Badges },
  template: `
    <div class=row-main>
      <div class=row-badges v-if="badges.length || $slots.extra">
        <Badges :names="badges"/><slot name="extra"/>
      </div>
      <slot/>
    </div>`,
};

// A LABELLED CARD: a section that needs to read as its own block — a to-do's
// brief, a doc's body — rather than just more text on the page. Reused
// instead of every view hand-rolling its own bordered box.
const Card = {
  props: ["title"],
  template: `
    <section class=card>
      <h3 v-if="title" class=card-title>{{ title }}</h3>
      <div class=card-body><slot/></div>
    </section>`,
};

// A ROW'S META, PRIMARY THEN SECONDARY (to-do 15): what a reader acts on without
// digging — age, a doc citation — shown plainly; a strike reason, a "has its
// reasoning" pointer, tucked behind a native <details> so it stays FOUND without
// competing for space with the facts that matter every time. No JS for the
// disclosure itself — that is what <details> is for.
const MetaLine = {
  props: { meta: { type: String, default: "" }, secondary: { type: Array, default: () => [] } },
  template: `
    <div class=meta>
      {{ meta }}
      <details v-if="secondary.length" class=meta-more>
        <summary>{{ secondary.length }} more</summary>
        <div v-for="(s, i) in secondary" :key="i">{{ s }}</div>
      </details>
    </div>`,
};

// A CLICKABLE "cites a doc" BADGE, from a row's meta text: pins/rules/reminders
// don't carry a separate `doc` field (only to-dos do, from todo.row_response) —
// their doc citation already lives in the same "→ doc N: title" string every
// renderer, CLI included, has always built (`docs.ref_label`). Reading it back
// out of that ONE string here is cheaper than adding a parallel structured field
// three modules would have to keep in sync with it.
const DocBadge = {
  props: ["meta"],
  setup(props) {
    const ref = computed(() => {
      const m = /→ doc ([\d.]+):/.exec(props.meta || "");
      return m ? m[1] : null;
    });
    return { ref };
  },
  template: `<a v-if="ref" :href="'#/docs/' + ref" class=badge title="cites a doc">doc</a>`,
};

// ─────────────────────────────────────────────────────────────── views
const Home = {
  components: { Loading, ErrorBox, RowMain },
  setup() {
    const s = useFetch(() => "/api/overview");
    return { s };
  },
  template: `
    <div v-if="s.loading"><Loading/></div>
    <ErrorBox v-else-if="s.error" :message="s.error"/>
    <div v-else>
      <p class=meta>{{ s.data.rules }} rule(s) · {{ s.data.docs }} doc(s), project-wide —
        <a href="#/rules">rules</a> · <a href="#/docs">docs</a></p>
      <h2>environments</h2>
      <div class=row v-for="e in s.data.environments" :key="e.name">
        <RowMain :badges="[...(e.current ? ['current'] : []), ...(e.active ? ['agent active'] : [])]">
          <a :href="'#/env/' + e.name">{{ e.name }}</a>
        </RowMain>
        <div class="meta meta-tight">{{ e.todos }} to-do(s) · {{ e.pins }} pin(s) ·
          {{ e.work }} open work · {{ e.reminders }} reminder(s)</div>
      </div>
      <p v-if="!s.data.environments.length">none yet.</p>
    </div>`,
};

const EnvHome = {
  props: ["env"],
  components: { Loading, ErrorBox, Card },
  setup(props) {
    const s = useFetch(() => props.env && `/api/env/${props.env}`);
    // OPEN WORK, RIGHT HERE: "instantly see what it's currently working on" was the
    // ask — a count behind a link one click away is not that. A second, small fetch,
    // since the dashboard counts and the open-work rows are genuinely different
    // shapes (views.py already serves both separately).
    const w = useFetch(() => props.env && `/api/env/${props.env}/work`);
    return { s, w };
  },
  template: `
    <div v-if="s.loading"><Loading/></div>
    <ErrorBox v-else-if="s.error" :message="s.error"/>
    <div v-else>
      <h1>{{ env }}</h1>
      <Card v-if="w.data && w.data.length" title="open work now">
        <div class=row v-for="item in w.data" :key="item.subject">
          <div class=row-main>{{ item.subject }}</div>
          <div class=meta>
            <div>{{ item.age }}</div>
            <div v-for="(note, i) in item.notes" :key="i">— {{ note.text }}</div>
          </div>
        </div>
      </Card>
      <div class=row><div class=row-main><a :href="'#/env/' + env + '/todos'">to-dos</a></div>
        <span class=meta>{{ s.data.todos }} open</span></div>
      <div class=row><div class=row-main><a :href="'#/env/' + env + '/pins'">pins</a></div>
        <span class=meta>{{ s.data.pins }} standing</span></div>
      <div class=row><div class=row-main><a :href="'#/env/' + env + '/work'">open work</a></div>
        <span class=meta>{{ s.data.work }} open</span></div>
      <div class=row><div class=row-main><a :href="'#/env/' + env + '/reminders'">reminders</a></div>
        <span class=meta>{{ s.data.reminders }} live</span></div>
      <div class=row><div class=row-main><a :href="'#/env/' + env + '/docs'">docs</a></div>
        <span class=meta>{{ s.data.docs }} scoped here</span></div>
    </div>`,
};

const Todos = {
  props: ["env"],
  components: { Loading, ErrorBox, RowMain },
  setup(props) {
    const s = useFetch(() => props.env && `/api/env/${props.env}/todos`);
    return { s };
  },
  template: `
    <h1>{{ env }} · to-dos</h1>
    <div v-if="s.loading"><Loading/></div>
    <ErrorBox v-else-if="s.error" :message="s.error"/>
    <div v-else>
      <div class=row v-for="t in s.data" :key="t.n">
        <RowMain :badges="t.states">
          <template #extra>
            <a v-if="t.doc" :href="'#/docs/' + t.doc" class=badge title="cites a doc">doc</a>
          </template>
          <a :href="'#/env/' + env + '/todos/' + t.n">{{ t.n }}. {{ t.title }}</a>
        </RowMain>
        <div class=meta>{{ t.age }}
          <span v-if="t.blocked"> · blocked: {{ t.blocked }}</span>
          <span v-if="t.after.length"> · after {{ t.after.join(', ') }}</span>
        </div>
      </div>
      <p v-if="!s.data.length">none.</p>
    </div>`,
};

const TodoDetail = {
  props: ["env", "n"],
  components: { Loading, ErrorBox, Badges, Card },
  setup(props) {
    const s = useFetch(() => props.env && props.n && `/api/env/${props.env}/todos/${props.n}`);
    return { s };
  },
  template: `
    <div v-if="s.loading"><Loading/></div>
    <ErrorBox v-else-if="s.error" :message="s.error"/>
    <div v-else>
      <h1>to-do {{ s.data.n }}: {{ s.data.title }}</h1>
      <Badges :names="s.data.states"/>
      <p class=meta>{{ s.data.age }}
        <a v-if="s.data.doc" :href="'#/docs/' + s.data.doc">doc {{ s.data.doc }}</a></p>
      <p v-if="s.data.blocked"><b>blocked:</b> {{ s.data.blocked }}</p>
      <p v-if="s.data.after.length"><b>after:</b>
        <a v-for="a in s.data.after" :key="a" :href="'#/env/' + env + '/todos/' + a">{{ a }}</a>
        <span v-if="s.data.waiting_on.length"> — still open: {{ s.data.waiting_on.join(', ') }}</span>
        <span v-else>, all done</span></p>
      <Card v-if="s.data.asks" :title="s.data.answer ? 'answered' : 'waiting on the user'">
        <div class=md v-html="$md(s.data.asks)"></div>
        <p v-if="s.data.answer">→ {{ s.data.answer }}</p>
      </Card>
      <Card title="brief">
        <div class=md v-if="s.data.body" v-html="$md(s.data.body)"></div>
        <p v-else>(title only.)</p>
      </Card>
    </div>`,
};

const Pins = {
  props: ["env"],
  components: { Loading, ErrorBox, MetaLine, DocBadge },
  setup(props) {
    const s = useFetch(() => props.env && `/api/env/${props.env}/pins`);
    return { s };
  },
  template: `
    <h1>{{ env }} · pins</h1>
    <div v-if="s.loading"><Loading/></div>
    <ErrorBox v-else-if="s.error" :message="s.error"/>
    <div v-else>
      <div class=row v-for="p in s.data" :key="p.n">
        <div class=row-main><DocBadge :meta="p.meta"/><a :href="'#/env/' + env + '/pins/' + p.n">{{ p.fact }}</a></div>
        <MetaLine :meta="p.meta" :secondary="p.meta_secondary"/>
      </div>
      <p v-if="!s.data.length">nothing pinned.</p>
    </div>`,
};

const PinDetail = {
  // Read-only for now, same as RuleDetail — see to-do 19/20.
  props: ["env", "n"],
  components: { Loading, ErrorBox, MetaLine, DocBadge, Card },
  setup(props) {
    const s = useFetch(() => props.env && props.n && `/api/env/${props.env}/pins/${props.n}`);
    return { s };
  },
  template: `
    <div v-if="s.loading"><Loading/></div>
    <ErrorBox v-else-if="s.error" :message="s.error"/>
    <div v-else>
      <h1>{{ env }} · pin {{ s.data.n }}<span v-if="s.data.struck" class=badge>struck</span></h1>
      <p><DocBadge :meta="s.data.meta"/>{{ s.data.fact }}</p>
      <MetaLine :meta="s.data.meta" :secondary="s.data.meta_secondary"/>
      <Card v-if="s.data.body" title="reasoning">
        <div class=md v-html="$md(s.data.body)"></div>
      </Card>
      <p v-else class=meta>No reasoning is written down for this pin.</p>
    </div>`,
};

const Rules = {
  components: { Loading, ErrorBox, MetaLine, DocBadge },
  setup() {
    const s = useFetch(() => "/api/rules");
    return { s };
  },
  template: `
    <h1>rules</h1>
    <div v-if="s.loading"><Loading/></div>
    <ErrorBox v-else-if="s.error" :message="s.error"/>
    <div v-else>
      <div class=row v-for="r in s.data" :key="r.n">
        <div class=row-main><DocBadge :meta="r.meta"/><a :href="'#/rules/' + r.n">{{ r.fact }}</a></div>
        <MetaLine :meta="r.meta" :secondary="r.meta_secondary"/>
      </div>
      <p v-if="!s.data.length">no rules stand.</p>
    </div>`,
};

const RuleDetail = {
  // Read-only for now — see to-do 19's brief. Editing is explicitly future work,
  // not something this page (or its API route) does.
  props: ["n"],
  components: { Loading, ErrorBox, MetaLine, DocBadge, Card },
  setup(props) {
    const s = useFetch(() => props.n && `/api/rules/${props.n}`);
    return { s };
  },
  template: `
    <div v-if="s.loading"><Loading/></div>
    <ErrorBox v-else-if="s.error" :message="s.error"/>
    <div v-else>
      <h1>rule {{ s.data.n }}<span v-if="s.data.struck" class=badge>struck</span></h1>
      <p><DocBadge :meta="s.data.meta"/>{{ s.data.fact }}</p>
      <MetaLine :meta="s.data.meta" :secondary="s.data.meta_secondary"/>
      <Card v-if="s.data.body" title="reasoning">
        <div class=md v-html="$md(s.data.body)"></div>
      </Card>
      <p v-else class=meta>No reasoning is written down for this rule.</p>
    </div>`,
};

const Work = {
  props: ["env"],
  components: { Loading, ErrorBox },
  setup(props) {
    const s = useFetch(() => props.env && `/api/env/${props.env}/work`);
    return { s };
  },
  template: `
    <h1>{{ env }} · open work</h1>
    <div v-if="s.loading"><Loading/></div>
    <ErrorBox v-else-if="s.error" :message="s.error"/>
    <div v-else>
      <div class=row v-for="w in s.data" :key="w.subject">
        <div class=row-main>{{ w.subject }}</div>
        <div class=meta>
          <div>{{ w.age }}</div>
          <div v-for="(note, i) in w.notes" :key="i">— {{ note.text }}</div>
        </div>
      </div>
      <p v-if="!s.data.length">nothing open.</p>
    </div>`,
};

const Reminders = {
  props: ["env"],
  components: { Loading, ErrorBox, MetaLine },
  setup(props) {
    const s = useFetch(() => props.env && `/api/env/${props.env}/reminders`);
    return { s };
  },
  template: `
    <h1>{{ env }} · reminders</h1>
    <div v-if="s.loading"><Loading/></div>
    <ErrorBox v-else-if="s.error" :message="s.error"/>
    <div v-else>
      <div class=row v-for="r in s.data" :key="r.n">
        <div class=row-main>{{ r.text }}</div>
        <MetaLine :meta="r.meta" :secondary="r.meta_secondary"/>
      </div>
      <p v-if="!s.data.length">nothing is being repeated.</p>
    </div>`,
};

const Docs = {
  components: { Loading, ErrorBox, RowMain },
  setup() {
    const s = useFetch(() => "/api/docs");
    return { s };
  },
  template: `
    <h1>docs</h1>
    <div v-if="s.loading"><Loading/></div>
    <ErrorBox v-else-if="s.error" :message="s.error"/>
    <div v-else>
      <div class=row v-for="d in s.data" :key="d.n">
        <RowMain :badges="d.attachments ? [d.status, 'attachments'] : [d.status]">
          <a :href="'#/docs/' + d.n">{{ d.n }}. {{ d.title }}</a>
        </RowMain>
        <div class=meta>{{ d.abstract }}</div>
      </div>
      <p v-if="!s.data.length">none catalogued.</p>
    </div>`,
};

const EnvDocs = {
  props: ["env"],
  components: { Loading, ErrorBox, RowMain },
  setup(props) {
    const s = useFetch(() => props.env && `/api/env/${props.env}/docs`);
    return { s };
  },
  template: `
    <h1>{{ env }} · docs</h1>
    <div v-if="s.loading"><Loading/></div>
    <ErrorBox v-else-if="s.error" :message="s.error"/>
    <div v-else>
      <div class=row v-for="d in s.data" :key="d.n">
        <RowMain :badges="d.attachments ? [d.status, 'attachments'] : [d.status]">
          <a :href="'#/docs/' + d.n">{{ d.n }}. {{ d.title }}</a>
        </RowMain>
        <div class=meta>{{ d.abstract }}</div>
      </div>
      <p v-if="!s.data.length">none scoped to this environment — <a href="#/docs">the project's docs</a> may still apply.</p>
    </div>`,
};

const DocDetail = {
  // NAMED "docref", NOT "ref": `ref` is a reserved attribute Vue intercepts for its own
  // template-ref mechanism even when bound dynamically via v-bind — a prop actually
  // called `ref` never reaches the component.
  props: ["docref"],
  components: { Loading, ErrorBox, Card, RowMain },
  setup(props) {
    const s = useFetch(() => props.docref && `/api/docs/${props.docref}`);
    // `docref` naming one part (e.g. "4.1") already shows it above as `s.data.part` —
    // drop that same part from the full list below so it is not shown twice.
    const restParts = computed(() => {
      if (!s.data) return [];
      const skip = s.data.part ? s.data.part.p : null;
      return s.data.parts.filter((p) => p.p !== skip);
    });
    return { s, restParts };
  },
  template: `
    <div v-if="s.loading"><Loading/></div>
    <ErrorBox v-else-if="s.error" :message="s.error"/>
    <div v-else>
      <h1>doc {{ s.data.n }}: {{ s.data.title }}</h1>
      <p class=meta><span class=badge>{{ s.data.status }}</span>
        <span class=badge>{{ s.data.scope }}</span> {{ s.data.age }}</p>
      <p v-if="s.data.superseded_by"><b>superseded by doc {{ s.data.superseded_by }}</b> —
        <a :href="'#/docs/' + s.data.superseded_by">read that instead</a></p>
      <Card title="abstract"><p>{{ s.data.abstract }}</p></Card>
      <Card v-if="s.data.part" :title="s.data.n + '.' + s.data.part.p + ' ' + s.data.part.title">
        <p class=meta>{{ s.data.part.age }} · {{ s.data.part.source }}</p>
        <div class=md v-html="$md(s.data.part.body)"></div>
      </Card>
      <Card v-else-if="s.data.body" title="body">
        <div class=md v-html="$md(s.data.body)"></div>
      </Card>
      <Card v-for="p in restParts" :key="p.p" :id="'part-' + p.p" :title="s.data.n + '.' + p.p + ' ' + p.title">
        <p class=meta>{{ p.age }} · {{ p.source }}</p>
        <div class=md v-html="$md(p.body)"></div>
      </Card>
      <template v-if="s.data.attachments.length">
        <h3>attachments</h3>
        <div class=attachment-grid>
          <div class=attachment-card v-for="a in s.data.attachments" :key="a.name">
            <svg class=attachment-icon viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path v-if="a.dir" d="M3 7a1 1 0 0 1 1-1h5l2 2h9a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7Z" stroke-linejoin="round"/>
              <path v-else d="M6 2h9l4 4v15a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1Z M14 2v5h5" stroke-linejoin="round" stroke-linecap="round"/>
            </svg>
            <div class=attachment-info>
              <a v-if="!a.dir" :href="'/docs/' + s.data.n + '/files/' + encodeURIComponent(a.name)" class=attachment-name>{{ a.name }}</a>
              <span v-else class=attachment-name>{{ a.name }}/</span>
              <span class=meta>{{ a.dir ? 'folder' : a.title }} · {{ $human(a.size) }}</span>
            </div>
          </div>
        </div>
      </template>
      <template v-if="s.data.cited_by.length">
        <h3>cited by</h3>
        <div class=row v-for="(c, i) in s.data.cited_by" :key="i">
          <RowMain :badges="[c.kind]">
            <a :href="c.kind === 'rule' ? '#/rules' : c.kind === 'to-do' ? '#/env/' + c.env + '/todos/' + c.n : '#/env/' + c.env + '/pins'">
              {{ c.env ? c.env + ' · ' : '' }}{{ c.text }}
            </a>
          </RowMain>
        </div>
      </template>
    </div>`,
};

const NotFound = { template: `<p class=error>nothing here.</p>` };

const VIEWS = { Home, EnvHome, Todos, TodoDetail, Pins, PinDetail, Rules, RuleDetail, Work, Reminders, Docs, EnvDocs, DocDetail, NotFound };

// ─────────────────────────────────────────────────────────────── the app shell
const App = {
  components: VIEWS,
  setup() {
    const route = reactive(parseHash());
    const onHashChange = () => Object.assign(route, parseHash());
    window.addEventListener("hashchange", onHashChange);
    onUnmounted(() => window.removeEventListener("hashchange", onHashChange));
    const key = computed(() => location.hash);
    // A QUICK JUMP, NOT A REBUILD: the nav otherwise has no way to reach an
    // environment without going home first. One extra request, once, for a
    // list nothing else on this page needs.
    const envs = reactive({ list: [] });
    fetch("/api/overview").then((r) => r.json()).then((d) => { envs.list = d.environments; })
      .catch(() => {});
    // SHOWS WHERE YOU ARE, NEVER A PLACEHOLDER: "environments" isn't itself
    // one, so it was never a real choice — just an option that did nothing
    // when picked. On an environment's own pages this shows that
    // environment; everywhere else (Home, Docs, Rules) it defaults to the
    // project's current one, so the select always names a real answer.
    const currentEnv = computed(() => {
      if (route.params.env) return route.params.env;
      const cur = envs.list.find((e) => e.current);
      return cur ? cur.name : (envs.list[0] ? envs.list[0].name : "");
    });
    function jump(ev) {
      const val = ev.target.value;
      if (val) location.hash = "#/env/" + val;
    }
    return { route, key, envs, currentEnv, jump };
  },
  template: `
    <nav>
      <div class=brand-group>
        <a href="#/" class=brand>journal</a>
        <span class=env-jump-wrap>
          <select class=env-jump aria-label="Jump to an environment" :value="currentEnv" @change="jump">
            <option v-for="e in envs.list" :key="e.name" :value="e.name">{{ e.name }}</option>
          </select>
        </span>
      </div>
      <div class=nav-links>
        <a href="#/docs" :class="{active: route.view === 'Docs' || route.view === 'DocDetail'}">docs</a>
        <a href="#/rules" :class="{active: route.view === 'Rules'}">rules</a>
      </div>
    </nav>
    <component :is="route.view" v-bind="route.params" :key="key"/>`,
};

function humanSize(n) {
  if (!n) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  let i = 0;
  while (n >= 1024 && i < units.length - 1) { n /= 1024; i++; }
  return (i === 0 ? n : n.toFixed(1)) + " " + units[i];
}

const app = createApp(App);
// ONE FUNNEL: every template calls the same $md/$human, rather than each view
// importing/returning its own reference from setup().
app.config.globalProperties.$md = renderMarkdown;
app.config.globalProperties.$human = humanSize;
app.mount("#app");
