// Round six, part 2: the sample rows the list pages read, their filter fields, the Documents page and the Skills tabs
// (report 1383 §4, §10-12, §16; doc 1276 §5-7). The other pages of round six are round-seven.jsx's and round-sixteen*.jsx's.
// Every list page is a ListPage: the filter bar across the page, rows with kind and number in columns, one reader meta line, an Actions menu.

/* ---------- sample rows the new readers need, shaped like the reads doc 1275 names ---------- */
const R6_DOC_BY = {1402: "helper-851", 1398: "main", 1376: "main", 1374: "helper-851", 1257: "worker-4"};
const R6_MEMORIES = [
  ...MEMORIES.map((m) => ({...m, agent: m.group, task: m.id === 812 ? 9692 : m.id === 790 ? 9680 : null, keywords: m.id === 812 ? ["comment box", "floating"] : m.id === 809 ? ["tunnel"] : [], at: m.id === 812 ? "2 h ago" : "yesterday"})),
  {id: 771, desc: "Show the plan focus only on Home", agent: "main", weight: 0, state: "removed", task: null, keywords: [], at: "3 days ago", body: "Show the plan focus only on Home. Removed: it shows in the Plans window too."},
];
const R6_RULES = [
  {id: 19, desc: "The main agent checks each supervisor warning against the messages itself", state: "active", by: "Jesse", at: "today", body: "The supervisor warns the main agent when its work drifts from what the user agreed. The main agent checks each warning against the messages itself and decides (message 120306)."},
  {id: 10, desc: "Never use a word of these lists in a name you write", state: "active", by: "Jesse", at: "2 days ago", body: "Project rule (message 113608): never use a word of these lists in a name you write."},
  {id: 14, desc: "Run the hook runner tests before changing it", state: "proposed", by: "worker-4", at: "1 h ago", body: "Run the Go and Python tests that cover the hook runner before changing it."},
  {id: 13, desc: "Only scoped tests run while a plan is worked", state: "removed", by: "Jesse", at: "2 days ago", body: "Replaced by rule 14 of the old numbering."},
];
const R6_RULE_WORDS = {active: "Active", proposed: "Proposed", removed: "Removed"};
const R6_TEMPLATES = [
  {id: 4, kind: "plan", name: "plan-default", title: "Plan: default", desc: "Phases with a test command and a checkpoint each", used: 12, by: "main", at: "3 days ago", commands: ["pytest tests -q", "npm --prefix src/viewer run build"], body: "# Plan template\n\n1. Brief\n2. Phases, each with its tasks\n3. A checkpoint at each phase end\n"},
  {id: 7, kind: "task", name: "task-bug", title: "Task: bug", desc: "What happens, what should happen, how to see it", used: 31, by: "Jesse", at: "last week", commands: [], body: "# Bug\n\n## What happens\n\n## What should happen\n\n## How to see it\n"},
  {id: 9, kind: "doc", name: "design-doc", title: "Document: design", desc: "Screens, states, what could go wrong", used: 5, by: "helper-851", at: "yesterday", commands: [], body: "# Design\n\n## What a person sees\n\n## Each state\n\n## What could go wrong\n"},
];
const R6_KIND_WORDS = {plan: "Plan", task: "Task", doc: "Document"};
const R6_SEQUENCES = [
  {id: 31, title: "Release check", desc: "Full run, changelog, tag, deploy", state: "started", by: "main", at: "today", steps: [["Full run", "completed"], ["Write the changelog", "started"], ["Tag the release", "open"], ["Deploy", "open"]],
    runs: [{id: 118, agent: "worker-4", state: "started", done: 1, total: 4, at: "20 min ago"}, {id: 112, agent: "main", state: "completed", done: 4, total: 4, at: "last Friday"}, {id: 107, agent: "main", state: "failed", done: 2, total: 4, at: "2 weeks ago"}],
    triggers: [{id: 1, kind: "At a time", when: "Fridays at 16:00"}]},
  {id: 28, title: "Morning sweep", desc: "Loose tasks, stale memories, failed checks", state: "open", by: "Jesse", at: "last week", steps: [["Read the loose tasks", "open"], ["Weigh the memories", "open"], ["Rerun failed checks", "open"]], runs: [], triggers: [{id: 2, kind: "When a plan ends", when: "Any plan"}]},
];
const R6_SEQ_WORDS = {started: "Running", open: "Idle"};
const R6_REMINDERS = [
  {id: 1, title: "Check the full run and report failures", agent: "main", schedule: "Every 30 min", next: "14:30", last: "14:00", state: "started", by: "Jesse", at: "today", body: "Check the full run and report failures, as report 1376 does."},
  {id: 2, title: "Weigh your memories before the plan ends", agent: "worker-4", schedule: "Once at 16:00", next: "16:00", last: "never", state: "paused", by: "main", at: "1 h ago", body: "Weigh your memories before plan 1131 ends."},
];
const R6_COMMITS = COMMITS.map((c, i) => ({...c, author: "Jesse Gall", at: ["2 h ago", "4 h ago", "6 h ago"][i], task: [9597, 9512, 9682][i], plan: [1131, 1130, 1131][i], branch: "version-5",
  files: [[["M", "src/core/modules/plans/support/plan_inspector.py", 4, 1], ["M", "src/viewer/src/resource/Inspector.vue", 12, 9], ["A", "src/viewer/src/kit/ActionMenu.vue", 88, 0]], [["M", "src/viewer/src/resource/Inspector.vue", 3, 3]], [["R", "src/viewer/src/kit/CommentRail.vue", 2, 2], ["D", "src/viewer/src/kit/QuickCommentBar.vue", 0, 41]]][i]}));
const R6_BRANCHES = [
  {id: "version-5", title: "version-5", kind: "Local", ahead: 3, behind: 0, current: true, last: "e923dfd", at: "2 h ago"},
  {id: "main", title: "main", kind: "Local", ahead: 0, behind: 0, last: "1a41b90", at: "today", isDefault: true},
  {id: "worker-4/9682", title: "worker-4/9682", kind: "Worktree", task: 9682, worker: "worker-4", ahead: 2, behind: 1, last: "77c01aa", at: "30 min ago"},
  {id: "worker-7/9683", title: "worker-7/9683", kind: "Worktree", task: 9683, worker: "worker-7", ahead: 1, behind: 3, last: "5bd2e10", at: "1 h ago"},
];
const R6_PULLS = [{id: 412, title: "Version 5", from: "version-5", into: "main", state: "open", plan: 1133, by: "main", at: "today", checks: [["Unit tests", "done", "41 s"], ["Stories", "failed", "6 m 12 s"], ["Viewer tests", "done", "12 s"]], body: "Builds plan 1133."}];
const R6_TEAM = {library: "team-journal.tunler.dev", state: "Connected", last: "2 min ago"};
const R6_TEAM_ITEMS = [
  {id: 1, kind: "Skill", title: "journal-tasks", follow: "followed", state: "Up to date", there: 3, here: 3, by: "Jesse", at: "yesterday"},
  {id: 2, kind: "Template", title: "plan-default", follow: "followed", state: "Changed here", there: 2, here: "2 + your change", by: "main", at: "3 days ago"},
  {id: 3, kind: "Rule", title: "Never ask the user to type a command", follow: "not", state: "Not followed", there: 1, here: "—", by: "Mara", at: "last week"},
  {id: 4, kind: "Skill", title: "release-notes", follow: "followed", state: "Newer in the library", there: 5, here: 4, by: "Mara", at: "today"},
];
const R6_TEAM_USERS = [{id: "jesse", title: "Jesse", role: "Owner", last: "now", shares: 6}, {id: "mara", title: "Mara", role: "Member", last: "yesterday", shares: 3}];
const R6_PLUGINS = PLUGINS.map((p) => ({...p, state: p.fault ? "fault" : p.on ? "on" : "off", upgrade: p.id === "status-band" ? "1.5.0" : null}));
const R6_INTEGRATIONS = [
  {id: "github", title: "GitHub", kind: "MCP server", on: true, state: "connected", stateLine: "Connected · 26 tools", command: "npx @modelcontextprotocol/server-github", profiles: ["journal-main", "journal-worker"], secret: "gh", desc: "Issues, pull requests, files"},
  {id: "linear", title: "Linear", kind: "MCP server", on: true, state: "login", stateLine: "Needs a login", command: "https://mcp.linear.app/sse", profiles: ["journal-main"], desc: "Issues and projects"},
  {id: "blender", title: "Blender", kind: "MCP server", on: true, state: "failed", stateLine: "Failed to connect: nothing listens on port 9876", command: "uvx blender-mcp", profiles: [], desc: "Drives a live Blender"},
  {id: "claude-design", title: "Claude Design", kind: "MCP server", on: false, state: "off", stateLine: "Off", command: "https://claude.ai/design/mcp", profiles: ["journal-designer"], desc: "Design projects"},
];
const R6_INT_WORDS = {connected: "Connected", login: "Needs a login", failed: "Failed to connect", off: "Off"};
const R6_SECRETS = [
  {id: "gh", title: "GitHub token", kind: "Token", mask: "ghp_••••••••••3f2a", usedBy: [["integration", "github"], ["profile", "journal-worker"]], last: "4 min ago", made: "2 weeks ago", state: "used"},
  {id: "tunler", title: "Tunler key", kind: "Key", mask: "tk_••••••••9c1d", usedBy: [["setting", "Tunnel"]], last: "3 min ago", made: "a month ago", state: "used"},
  {id: "linear", title: "Linear key", kind: "Key", mask: "lin_••••••••e7", usedBy: [], last: "never", made: "today", state: "unused"},
];

// the rows that had no inspector open in the shared shape with their facts
Object.assign(R6_INSPECTORS, {
  rule: (id) => { const r = R6_RULES.find((x) => x.id === id); return r && {title: r.desc, state: r.state === "removed" ? "cancelled" : r.state === "proposed" ? "draft" : "open", page: "rules", pageTitle: "Rules", fields: [["State", R6_RULE_WORDS[r.state]], ["By", <AgentLink name={r.by} />], ["When", r.at]]}; },
  reminder: (id) => { const r = R6_REMINDERS.find((x) => x.id === id); return r && {title: r.title, state: r.state, page: "reminders", pageTitle: "Reminders", fields: [["Agent", <AgentLink name={r.agent} />], ["Schedule", r.schedule], ["Next", r.next], ["Last", r.last]]}; },
  template: (id) => { const t = R6_TEMPLATES.find((x) => x.id === id); return t && {title: t.title, page: "templates", pageTitle: "Templates", fields: [["Kind", R6_KIND_WORDS[t.kind]], ["Name", <span className="mono">{t.name}</span>], ["Used", plural(t.used, "time")]]}; },
  sequence: (id) => { const q = R6_SEQUENCES.find((x) => x.id === id); return q && {title: q.title, state: q.state, page: "sequences", pageTitle: "Sequences", fields: [["Steps", q.steps.length], ["Runs", q.runs.length], ["By", <AgentLink name={q.by} />]]}; },
  commit: (id) => { const c = R6_COMMITS.find((x) => x.id === id); return c && {title: c.title, short: id, page: "git", pageTitle: "Git", fields: [["Author", c.author], ["When", c.at], ["Task", <RowLink term="task" id={c.task} bare />], ["Files", c.files.length]]}; },
  skill: (id) => { const s = SKILLS.find((x) => x.id === id) || {title: id, desc: ""}; return {title: s.title, abstract: s.desc, page: "skills", pageTitle: "Skills", fields: [["Group", s.group || "Journal"], ["Read by", s.read ? <AgentLink name="main" /> : "—"]]}; },
  profile: (id) => { const p = (window.PROFILE_ROWS || []).find((x) => x.name === id); return p && {title: p.title || p.name, abstract: p.description, short: id, page: "profiles", pageTitle: "Profiles", fields: [["Type", p.agent_type], ["Used", `${plural(p.uses, "time")} · ${p.last}`]]}; },
  integration: (id) => { const i = R6_INTEGRATIONS.find((x) => x.id === id); return i && {title: i.title, short: id, page: "integrations", pageTitle: "Integrations", fields: [["State", i.stateLine], ["Command", <span className="mono">{i.command}</span>]]}; },
  secret: (id) => { const s = R6_SECRETS.find((x) => x.id === id); return s && {title: s.title, short: id, page: "secrets", pageTitle: "Secrets", fields: [["Value", <span className="r6-mask">{s.mask}</span>], ["Last used", s.last]]}; },
});

const R6_AGENT_FIELD = (get, label = "Agent") => ({key: "agent", label, options: AGENTS.map((a) => [a.name, a.name]), get});

/* ---------- Documents: the list's time ends at the right edge; the reader's head says a state only when it needs you ---------- */
const R6_DOC_FIELDS = [
  {key: "kind", label: "Kind", options: [["doc", "Document"], ["report", "Report"]], get: (d) => d.term},
  {key: "state", label: "State", options: [["open", "Open"], ["closed", "Closed"]], get: (d) => d.state},
  R6_AGENT_FIELD((d) => d.by, "Author"),
];
function DocumentsPage({onOpen}) {
  const [chosen, setChosen] = useState(1402);
  const [making, setMaking] = useState(null);
  const toast = useToast();
  const rows = DOCS.map((d) => ({...d, by: R6_DOC_BY[d.id], desc: d.abstract, ref: {term: d.term, id: d.id}, group: d.group}));
  return <><ListPage title="Documents" fields={R6_DOC_FIELDS} rows={rows} initial={{state: {not: false, values: ["open"]}}} chosen={chosen} onChoose={setChosen} placeholder="Search"
    sort={[["newest", "Newest", () => 0], ["title", "A–Z", (a, b) => a.title.localeCompare(b.title)]]}
    header={<Menu width={220} button={({toggle, open}) => <button type="button" className={"btn small primary menu-btn" + (open ? " on" : "")} aria-haspopup="menu" aria-expanded={open} onClick={toggle}><span>New</span><Icon name="down" size={11} /></button>}>{(close) => <><MenuItem icon="doc" onClick={() => { setMaking("doc"); close(); }}>Document</MenuItem><MenuItem icon="check" onClick={() => { setMaking("report"); close(); }}>Report</MenuItem></>}</Menu>}
    renderReader={(doc) => <Reader key={doc.id} term={doc.term} item={doc} head={{row: {term: doc.term, id: doc.id}, by: doc.by, at: `updated ${doc.at}`}}
      tabs={[{key: "text", label: "Text", text: true}, {key: "revisions", label: "Revisions", count: 3, render: () => <Timeline rows={REVISIONS} />}, {key: "links", label: "Links", count: 1, render: () => <LinksTab links={[{kind: "Plan", term: "plan", id: 1133, title: "Viewer v5: one look for every page", state: "ready", icon: "plan"}]} onOpen={onOpen} />}]}
      actions={[{group: "Text", label: "Edit", icon: "edit"}, {group: "Text", label: "Inspector", icon: "open", run: () => onOpen(doc.term, doc.id)}, {group: "State", label: doc.state === "open" ? "Close" : "Reopen", icon: "tick", field: {label: "Reason"}}, {group: "Context", label: "Copy command", icon: "copy", desc: `journal ${doc.term} show ${doc.id}`}]}>
      {(ctx) => <DocumentText doc={doc} ctx={ctx} />}
    </Reader>} />
    {making && <CreateDialog title={making === "doc" ? "New document" : "New report"} submit="Make" onClose={() => setMaking(null)} onMade={(v) => toast(`${making === "doc" ? "Document" : "Report"} 1403 made: ${v.title}`)}
      command={(v) => `journal ${making} make "${v.title || "…"}" --abstract "…"`}
      fields={[{key: "title", label: "Title", required: true, placeholder: "Viewer v5: the reads table"}, {key: "abstract", label: "Abstract", required: true, help: "One line"}, {key: "task", label: "Task", kind: "select", options: [["", "—"], ...TASKS.filter((t) => t.state !== "completed").map((t) => [String(t.id), `${t.id} · ${t.title}`])]}, {key: "body", label: "Text", kind: "area", rows: 8, placeholder: "# Title\n\nMarkdown"}]} />}
  </>;
}

/* ---------- Skills: who must read it is one setting; the tabs the Skills page (round seven) shows ---------- */
const R6_SKILL_WHO = {journal: "every", "commandments-plain-viewer-text": "main"};
const R6_WHO_WORDS = {every: "Every agent", main: "Main agent", none: "None"};
const R6_READ_BY = {journal: ["main", "worker-4", "helper-851"], "journal-tasks": ["main", "worker-4"], "commandments-plain-viewer-text": ["main", "helper-851"]};
const R6_TRIGGERS = {journal: [{id: 1, words: "journal, skill", by: "the skill"}], "journal-documents": [{id: 2, words: "report, document", by: "Jesse"}]};
const R6_SKILL_FIELDS = [
  {key: "group", label: "Group", options: [["Journal", "Journal"], ["Commandments", "Commandments"]], get: (s) => s.group},
  {key: "who", label: "Required", options: [["every", "Every agent"], ["main", "Main agent"], ["profile", "A profile"], ["none", "None"]], get: (s) => [s.who, ...(s.requiredBy.length ? ["profile"] : [])]},
  {key: "read", label: "Read", options: [["yes", "Read"], ["no", "Not read"]], get: (s) => (s.readBy.length ? "yes" : "no")},
];
function SkillReading({s}) {
  return <>
    <Section title="Required"><Fields rows={[["For", R6_WHO_WORDS[s.who]], ["Profiles", s.requiredBy.length ? <span className="row" style={{gap: 6}}>{s.requiredBy.map((n) => <RowLink key={n} term="profile" id={n}>{n}</RowLink>)}</span> : "—"]]} /></Section>
    <Section title="Triggers">{s.triggers.length ? <div className="r6-list r6-trig">{s.triggers.map((t) => <div key={t.id} className="link-row"><span className="mono">{t.words}</span><span className="faint">{t.by}</span><span className="row" style={{gap: 4}}><Btn small variant="ghost">Edit</Btn><Btn small variant="ghost" disabled={t.by === "the skill"} title={t.by === "the skill" ? "In SKILL.md" : undefined}>Remove</Btn></span></div>)}</div> : <p className="muted" style={{margin: 0}}>None</p>}</Section>
  </>;
}
function SkillReaders({s}) {
  if (!s.readBy.length) return <p className="muted" style={{margin: 0}}>None</p>;
  return <div className="r6-list r6-who">{s.readBy.map((n) => <div key={n} className="link-row"><R16Agent name={n} /><span /><span className="faint">since its start</span></div>)}</div>;
}
function SkillProfiles({s}) {
  if (!s.offeredBy.length) return <p className="muted" style={{margin: 0}}>None</p>;
  return <div className="r6-list r6-who">{s.offeredBy.map((n) => <div key={n} className="link-row"><Icon name="agent" size={13} style={{color: "var(--text-3)"}} /><RowLink term="profile" id={n}>{n}</RowLink><span className="faint">{s.requiredBy.includes(n) ? "Required" : "Offered"}</span><span /></div>)}</div>;
}

/* ---------- the filter fields the pages of round seven read ---------- */
const R6_MEM_FIELDS = [
  R6_AGENT_FIELD((m) => m.agent),
  {key: "state", label: "State", options: [["active", "In force"], ["removed", "Removed"]], get: (m) => m.state},
  {key: "task", label: "Task", options: R6_OPTS(R6_MEMORIES, (m) => m.task, (t) => `Task ${t}`), get: (m) => m.task},
];
const R6_Steps = ({w}) => <span className="mem-w" aria-label={`Weight ${w}`}><span className="mem-steps">{Array.from({length: 10}, (_, i) => <i key={i} className={i < w ? "on" : ""} />)}</span>{w}</span>;
const R6_RULE_FIELDS = [{key: "state", label: "State", options: Object.entries(R6_RULE_WORDS), get: (r) => r.state}, {key: "by", label: "By", options: R6_OPTS(R6_RULES, (r) => r.by), get: (r) => r.by}];
const R6_SEQ_FIELDS = [{key: "state", label: "State", options: Object.entries(R6_SEQ_WORDS), get: (q) => q.state}, {key: "trigger", label: "Trigger", options: [["At a time", "At a time"], ["When a plan ends", "When a plan ends"], ["none", "By hand"]], get: (q) => (q.triggers.length ? q.triggers.map((t) => t.kind) : "none")}];
// Teams: the State field is built on the state a row shows (Update, Up to date, Not followed); whether it is followed is part of that state
const R6_TEAM_STATE = (i) => (i.follow !== "followed" || i.state === "Not followed" ? "unfollowed" : i.state === "Up to date" ? "current" : "update");
const R6_TEAM_FIELDS = [{key: "kind", label: "Kind", options: [["Skill", "Skill"], ["Template", "Template"], ["Rule", "Rule"]], get: (i) => i.kind}, {key: "state", label: "State", options: [["update", "Update"], ["current", "Up to date"], ["unfollowed", "Not followed"]], get: R6_TEAM_STATE}];
const R6_GIT_LETTER = {M: "Changed", A: "New", D: "Deleted", R: "Moved"};

Object.assign(window, {DocumentsPage, SkillReading, SkillReaders, SkillProfiles, R6_AGENT_FIELD, R6_TEAM_FIELDS, R6_TEAM_STATE, R6_Steps});
