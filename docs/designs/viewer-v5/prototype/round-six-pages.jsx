// Round six, part 2: the list pages, the card pages and their create dialogs (report 1383 §4, §10-12, §16; doc 1276 §5-7).
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
const R6_REM_WORDS = {started: "Running", paused: "Paused"};
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
  rule: (id) => { const r = R6_RULES.find((x) => x.id === id); return r && {title: r.desc, state: r.state === "removed" ? "cancelled" : r.state === "proposed" ? "draft" : "open", page: "rules", pageTitle: "Rules", fields: [["State", R6_RULE_WORDS[r.state]], ["Made by", <AgentLink name={r.by} />], ["When", r.at]]}; },
  reminder: (id) => { const r = R6_REMINDERS.find((x) => x.id === id); return r && {title: r.title, state: r.state, page: "reminders", pageTitle: "Reminders", fields: [["Tells", <AgentLink name={r.agent} />], ["Schedule", r.schedule], ["Next", r.next], ["Last told", r.last]]}; },
  template: (id) => { const t = R6_TEMPLATES.find((x) => x.id === id); return t && {title: t.title, page: "templates", pageTitle: "Templates", fields: [["Kind", R6_KIND_WORDS[t.kind]], ["Name", <span className="mono">{t.name}</span>], ["Used", `${t.used} times`]]}; },
  sequence: (id) => { const q = R6_SEQUENCES.find((x) => x.id === id); return q && {title: q.title, state: q.state, page: "sequences", pageTitle: "Sequences", fields: [["Steps", q.steps.length], ["Runs", q.runs.length], ["Made by", <AgentLink name={q.by} />]]}; },
  commit: (id) => { const c = R6_COMMITS.find((x) => x.id === id); return c && {title: c.title, short: id, page: "git", pageTitle: "Git", fields: [["Author", c.author], ["When", c.at], ["Task", <RowLink term="task" id={c.task} />], ["Files", c.files.length]]}; },
  skill: (id) => { const s = SKILLS.find((x) => x.id === id) || {title: id, desc: ""}; return {title: s.title, abstract: s.desc, page: "skills", pageTitle: "Skills", fields: [["Group", s.group || "Journal"], ["Read now by", s.read ? <AgentLink name="main" /> : "No agent"]]}; },
  profile: (id) => { const p = (window.PROFILE_ROWS || []).find((x) => x.name === id); return p && {title: p.title || p.name, abstract: p.description, short: id, page: "profiles", pageTitle: "Profiles", fields: [["Type", p.agent_type], ["Used", `${p.uses} times, last ${p.last}`]]}; },
  integration: (id) => { const i = R6_INTEGRATIONS.find((x) => x.id === id); return i && {title: i.title, short: id, page: "integrations", pageTitle: "Integrations", fields: [["State", i.stateLine], ["Command", <span className="mono">{i.command}</span>]]}; },
  secret: (id) => { const s = R6_SECRETS.find((x) => x.id === id); return s && {title: s.title, short: id, page: "secrets", pageTitle: "Secrets", fields: [["Value", <span className="r6-mask">{s.mask}</span>], ["Last used", s.last]]}; },
});

const R6_AGENT_FIELD = (get, label = "Agent") => ({key: "agent", label, options: AGENTS.map((a) => [a.name, a.name]), get});

/* ---------- Documents ---------- */
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
  return <><ListPage title="Documents" line="What agents wrote down to keep, and what they checked" fields={R6_DOC_FIELDS} rows={rows} initial={{state: {not: false, values: ["open"]}}} chosen={chosen} onChoose={setChosen} placeholder="Search titles and abstracts"
    sort={[["newest", "Newest first", () => 0], ["title", "Title, A to Z", (a, b) => a.title.localeCompare(b.title)]]}
    header={<Menu width={240} button={({toggle, open}) => <button type="button" className={"btn small primary menu-btn" + (open ? " on" : "")} aria-haspopup="menu" aria-expanded={open} onClick={toggle}><span>New</span><Icon name="down" size={11} /></button>}>{(close) => <><MenuItem icon="doc" desc="Lasting knowledge" onClick={() => { setMaking("doc"); close(); }}>A document</MenuItem><MenuItem icon="check" desc="What was checked" onClick={() => { setMaking("report"); close(); }}>A report</MenuItem></>}</Menu>}
    renderReader={(doc) => <Reader key={doc.id} term={doc.term} item={doc} head={{row: {term: doc.term, id: doc.id}, state: doc.state === "open" ? "open" : "completed", stateWord: doc.state === "open" ? "Open" : "Closed", by: doc.by, at: `updated ${doc.at}`}}
      tabs={[{key: "text", label: "Text", text: true}, {key: "revisions", label: "Revisions", count: 3, render: () => <Timeline rows={REVISIONS} />}, {key: "links", label: "Links", count: 1, render: () => <LinksTab links={[{kind: "Plan", term: "plan", id: 1133, title: "Viewer v5: one look for every page", state: "ready", icon: "plan"}]} onOpen={onOpen} />}]}
      actions={[{group: "Text", label: "Edit the text", icon: "edit"}, {group: "Text", label: "Open in the inspector", icon: "open", run: () => onOpen(doc.term, doc.id)}, {group: "State", label: doc.state === "open" ? "Close it" : "Open it again", icon: "tick", field: {label: "Why?"}}, {group: "Context", label: "Copy the context command", icon: "copy", desc: `journal ${doc.term} show ${doc.id}`}]}>
      {(ctx) => <DocumentText doc={doc} ctx={ctx} />}
    </Reader>} />
    {making && <CreateDialog title={making === "doc" ? "New document" : "New report"} sub={making === "doc" ? "Lasting knowledge the agents read" : "What was checked, and what came out"} submit={making === "doc" ? "Make the document" : "Make the report"} onClose={() => setMaking(null)} onMade={(v) => toast(`${making === "doc" ? "Document" : "Report"} 1403 made: ${v.title}`)}
      command={(v) => `journal ${making} make "${v.title || "…"}" --abstract "…"`}
      fields={[{key: "title", label: "Title", required: true, placeholder: "Viewer v5: the reads table"}, {key: "abstract", label: "Abstract", required: true, help: "One line, shown in the list"}, {key: "task", label: "For task", kind: "select", options: [["", "No task"], ...TASKS.filter((t) => t.state !== "completed").map((t) => [String(t.id), `Task ${t.id} · ${t.title}`])]}, {key: "body", label: "Text", kind: "area", rows: 8, placeholder: "# Title\n\nMarkdown"}]} />}
  </>;
}

/* ---------- Skills: who must read it is one setting with its own words, the profiles that offer or require it are links ---------- */
const R6_SKILL_WHO = {journal: "every", "commandments-plain-viewer-text": "main"};
const R6_WHO_WORDS = {every: "Every agent", main: "Only the main agent", none: "Not required"};
const R6_READ_BY = {journal: ["main", "worker-4", "helper-851"], "journal-tasks": ["main", "worker-4"], "commandments-plain-viewer-text": ["main", "helper-851"]};
const R6_TRIGGERS = {journal: [{id: 1, words: "journal, skill", by: "the skill"}], "journal-documents": [{id: 2, words: "report, document", by: "Jesse"}]};
const R6_SKILL_FIELDS = [
  {key: "group", label: "Group", options: [["Journal", "Journal"], ["Commandments", "Commandments"]], get: (s) => s.group},
  {key: "who", label: "Required", options: [["every", "For every agent"], ["main", "For the main agent"], ["profile", "By a profile"], ["none", "Not required"]], get: (s) => [s.who, ...(s.requiredBy.length ? ["profile"] : []), ...(s.who === "none" && !s.requiredBy.length ? [] : [])]},
  {key: "read", label: "Read now", options: [["yes", "Read by an agent"], ["no", "Not read"]], get: (s) => (s.readBy.length ? "yes" : "no")},
];
function SkillsPage() {
  const {go, open, openFile} = useOpen();
  const [chosen, setChosen] = useState("journal");
  const profiles = window.PROFILE_ROWS || [];
  const rows = SKILLS.map((s) => ({...s, who: R6_SKILL_WHO[s.id] || "none", readBy: R6_READ_BY[s.id] || [], triggers: R6_TRIGGERS[s.id] || [], offeredBy: profiles.filter((p) => p.skills.includes(s.id)).map((p) => p.name), requiredBy: profiles.filter((p) => p.required_skills.includes(s.id)).map((p) => p.name)}));
  return <ListPage title="Skills" line="What agents read to know how to work here" fields={R6_SKILL_FIELDS} rows={rows} chosen={chosen} onChoose={setChosen} placeholder="Find a skill"
    renderMeta={(s) => s.who !== "none" ? (s.who === "every" ? "every agent" : "main agent") : s.requiredBy.length ? `${s.requiredBy.length} profile${s.requiredBy.length === 1 ? "" : "s"}` : ""}
    renderReader={(s) => <Reader key={s.id} term="skill" item={{...s, abstract: s.desc}} comments={false} head={{extra: <><span className="mono">{s.group}</span><span className="sep">·</span><span>{s.who === "none" ? (s.requiredBy.length ? `Required by ${s.requiredBy.length} profile${s.requiredBy.length === 1 ? "" : "s"}` : "Not required") : `Required for ${s.who === "every" ? "every agent" : "the main agent"}`}</span></>}}
      primary={!s.readBy.includes("main") ? {label: "Make main read it", done: "main reads it before its next step"} : null}
      actions={[{group: "Reading", label: "Which agents must read it", icon: "agent", field: {label: "Which agents must read it at their start", options: Object.entries(R6_WHO_WORDS), value: s.who, help: "A profile's Required adds its own agents to this."}, confirm: "Save"},
        {group: "Reading", label: "Require it for a profile", icon: "agent", field: {label: "Profile", options: profiles.map((p) => [p.name, p.name])}, confirm: "Require it"},
        {group: "Reading", label: "Add a trigger", icon: "plus", desc: "The agent reads it as soon as your words appear", field: {label: "When these words appear", placeholder: "release, changelog"}},
        {group: "File", label: "Open SKILL.md in Files", icon: "open", run: () => openFile(`.claude/skills/${s.id}/SKILL.md`)}]}
      tabs={[{key: "text", label: "What it says", text: true}, {key: "reading", label: "When it is read", count: s.triggers.length, render: () => <SkillReading s={s} />}, {key: "readers", label: "Read by", count: s.readBy.length, render: () => <SkillReaders s={s} />}, {key: "profiles", label: "Profiles", count: s.offeredBy.length, render: () => <SkillProfiles s={s} />}]}>
      {() => <Markdown text={s.body} />}
    </Reader>} />;
}
function SkillReading({s}) {
  return <>
    <Section title="Who must read it"><Fields rows={[["For", R6_WHO_WORDS[s.who]], ["And by profile", s.requiredBy.length ? <span className="row" style={{gap: 6}}>{s.requiredBy.map((n) => <RowLink key={n} term="profile" id={n}>{n}</RowLink>)}</span> : "No profile"]]} /></Section>
    <Section title="Triggers">{s.triggers.length ? <div className="r6-list r6-trig">{s.triggers.map((t) => <div key={t.id} className="link-row"><span className="mono">{t.words}</span><span className="faint">from {t.by}</span><span className="row" style={{gap: 4}}><Btn small variant="ghost">Edit</Btn><Btn small variant="ghost" disabled={t.by === "the skill"} title={t.by === "the skill" ? "The skill's own trigger: change SKILL.md" : undefined}>Remove</Btn></span></div>)}</div> : <p className="muted" style={{margin: 0}}>No triggers. Add one in Actions.</p>}</Section>
  </>;
}
function SkillReaders({s}) {
  if (!s.readBy.length) return <p className="muted" style={{margin: 0}}>No agent has read it in its current context.</p>;
  return <div className="r6-list r6-who">{s.readBy.map((n) => { const a = AGENTS.find((x) => x.name === n); return <div key={n} className="link-row"><Icon name="agent" size={13} style={{color: "var(--text-3)"}} /><AgentLink name={n} /><span className="faint ellipsis">{a?.role}</span><span className="faint">since its start</span></div>; })}</div>;
}
function SkillProfiles({s}) {
  if (!s.offeredBy.length) return <p className="muted" style={{margin: 0}}>No profile offers it.</p>;
  return <div className="r6-list r6-who">{s.offeredBy.map((n) => <div key={n} className="link-row"><Icon name="agent" size={13} style={{color: "var(--text-3)"}} /><RowLink term="profile" id={n}>{n}</RowLink><span className="faint">{s.requiredBy.includes(n) ? "Required" : "Offered"}</span><span /></div>)}</div>;
}

/* ---------- Memories ---------- */
const R6_MEM_FIELDS = [
  R6_AGENT_FIELD((m) => m.agent),
  {key: "state", label: "State", options: [["active", "In force"], ["removed", "Removed"]], get: (m) => m.state},
  {key: "task", label: "Task", options: R6_OPTS(R6_MEMORIES, (m) => m.task, (t) => `Task ${t}`), get: (m) => m.task},
];
const R6_Steps = ({w}) => <span className="mem-w" title={`Weight ${w} of 10`}><span className="mem-steps">{Array.from({length: 10}, (_, i) => <i key={i} className={i < w ? "on" : ""} />)}</span>{w}</span>;
function MemoriesPage({onOpen}) {
  const [chosen, setChosen] = useState(812);
  const [making, setMaking] = useState(false);
  const toast = useToast();
  const rows = R6_MEMORIES.map((m) => ({...m, title: m.desc, desc: `${m.agent}${m.task ? ` · task ${m.task}` : ""}`, ref: {term: "memory", id: m.id}, group: ""}));
  return <><ListPage title="Memories" line="What agents keep in mind past their context" fields={R6_MEM_FIELDS} rows={rows} initial={{state: {not: false, values: ["active"]}}} chosen={chosen} onChoose={setChosen}
    sort={[["weight", "Weight, highest first", (a, b) => b.weight - a.weight], ["newest", "Newest first", (a, b) => b.id - a.id]]}
    header={<Btn variant="primary" small onClick={() => setMaking(true)}>New memory</Btn>}
    renderMeta={(m) => <R6_Steps w={m.weight} />}
    renderReader={(m) => <Reader key={m.id} term="memory" item={m} comments={false} head={{row: {term: "memory", id: m.id}, state: m.state === "active" ? "open" : "cancelled", stateWord: m.state === "active" ? "In force" : "Removed", byLabel: "kept by", by: m.agent, at: m.at}}
      actions={m.state === "active" ? [{group: "Memory", label: "Change the weight", icon: "gauge", field: {label: "Weight", options: Array.from({length: 10}, (_, i) => [String(i + 1), String(i + 1)]), value: String(m.weight)}, confirm: "Save"}, {group: "Memory", label: "Edit the text", icon: "edit", field: {label: "What to keep in mind", value: m.body}}, {group: "Memory", label: "Open in the inspector", icon: "open", run: () => onOpen("memory", m.id)}, {group: "Danger", label: "Remove the memory", icon: "trash", danger: true, field: {label: "Why is it removed?"}, confirm: "Remove"}]
        : [{group: "Memory", label: "Bring it back", icon: "back", field: {label: "Weight", options: Array.from({length: 10}, (_, i) => [String(i + 1), String(i + 1)]), value: "5"}, confirm: "Bring it back"}]}>
      {() => <><Section title="Facts"><Fields rows={[["Kept by", <AgentLink name={m.agent} />], ["For task", m.task ? <RowLink term="task" id={m.task} /> : "No task"], ["Weight", <R6_Steps w={m.weight} />], ["Brought back by", m.keywords.length ? <span className="row" style={{gap: 4}}>{m.keywords.map((k) => <span key={k} className="chip">{k}</span>)}</span> : "No keywords"], ["Made", m.at]]} /></Section><Section title="What it keeps in mind"><Markdown text={m.body} /></Section></>}
    </Reader>} />
    {making && <CreateDialog title="New memory" sub="An agent keeps it in mind past its context. It fades by one at each compaction." submit="Keep it" onClose={() => setMaking(false)} onMade={(v) => toast(`Memory 816 kept for ${v.agent}`)}
      command={(v) => `journal memory make "…" --weight ${v.weight || 7}${v.task ? ` --task ${v.task}` : ""}`}
      fields={[{key: "agent", label: "Kept by", kind: "agent", required: true, half: true}, {key: "weight", label: "Weight", kind: "select", options: Array.from({length: 10}, (_, i) => [String(10 - i), String(10 - i)]), value: "7", required: true, half: true}, {key: "text", label: "What to keep in mind", kind: "area", rows: 3, required: true, help: "One or two plain sentences"}, {key: "task", label: "For task", kind: "select", options: [["", "No task"], ...TASKS.filter((t) => t.state !== "completed").map((t) => [String(t.id), `Task ${t.id}`])], half: true}, {key: "keywords", label: "Brought back by", placeholder: "comment box, floating", half: true}]} />}
  </>;
}

/* ---------- Rules ---------- */
const R6_RULE_FIELDS = [{key: "state", label: "State", options: Object.entries(R6_RULE_WORDS), get: (r) => r.state}, {key: "by", label: "Made by", options: R6_OPTS(R6_RULES, (r) => r.by), get: (r) => r.by}];
function RulesPage() {
  const [chosen, setChosen] = useState(19);
  const rows = R6_RULES.map((r) => ({...r, title: r.desc, desc: r.state === "proposed" ? `Proposed by ${r.by}` : `${R6_RULE_WORDS[r.state]} · ${r.at}`, ref: {term: "rule", id: r.id}, group: R6_RULE_WORDS[r.state]}));
  return <ListPage title="Rules" line="What holds for every agent, and what agents proposed" fields={R6_RULE_FIELDS} rows={rows} initial={{state: {not: true, values: ["removed"]}}} chosen={chosen} onChoose={setChosen}
    renderMeta={(r) => r.at}
    renderReader={(r) => <Reader key={r.id} term="rule" item={r} comments head={{row: {term: "rule", id: r.id}, state: r.state === "removed" ? "cancelled" : r.state === "proposed" ? "draft" : "open", stateWord: R6_RULE_WORDS[r.state], byLabel: r.state === "proposed" ? "proposed by" : "by", by: r.by, at: r.at}}
      primary={r.state === "proposed" ? {label: "Accept the rule", done: `Rule ${r.id} accepted`} : null}
      actions={r.state === "removed" ? [{group: "Rule", label: "Bring it back", icon: "back", field: {label: "Why?"}}] : [{group: "Rule", label: "Edit", icon: "edit", field: {label: "The rule", value: r.body}, confirm: "Save"}, {group: "Danger", label: r.state === "proposed" ? "Decline" : "Remove", icon: "trash", danger: true, field: {label: "Why?"}}]}>
      {(ctx) => <Markdown text={r.body} comments={ctx.comments} onSelectText={ctx.setQuote} />}
    </Reader>} />;
}

/* ---------- Templates ---------- */
const R6_TPL_FIELDS = [{key: "kind", label: "Kind", options: Object.entries(R6_KIND_WORDS), get: (t) => t.kind}];
function TemplatesPage() {
  const [chosen, setChosen] = useState(4);
  const [making, setMaking] = useState(null);
  const toast = useToast();
  const rows = R6_TEMPLATES.map((t) => ({...t, ref: {term: "template", id: t.id}, group: R6_KIND_WORDS[t.kind] + "s"}));
  return <><ListPage title="Templates" line="Shapes for new plans, tasks and documents" fields={R6_TPL_FIELDS} rows={rows} chosen={chosen} onChoose={setChosen}
    header={<Btn variant="primary" small onClick={() => setMaking({})}>New template</Btn>}
    renderMeta={(t) => `used ${t.used}×`}
    renderReader={(t) => <Reader key={t.id} term="template" item={{...t, abstract: t.desc}} comments={false} head={{row: {term: "template", id: t.id}, extra: <><span className="mono">{t.name}</span><span className="sep">·</span><span>{R6_KIND_WORDS[t.kind]}</span></>, by: t.by, at: t.at}}
      primary={{label: `Make a ${R6_KIND_WORDS[t.kind].toLowerCase()} from it`, run: () => { setMaking({use: t}); return false; }}}
      actions={[{group: "Template", label: "Edit", icon: "edit", run: () => { setMaking({edit: t}); return false; }}, {group: "Template", label: "Duplicate", icon: "copy", done: `Template ${t.name}-copy made`}, {group: "Danger", label: "Remove the template", icon: "trash", danger: true, field: {label: "Why is it removed?"}, confirm: "Remove"}]}>
      {() => <><Section title="Facts"><Fields rows={[["Kind", R6_KIND_WORDS[t.kind]], ["Name", <span className="mono">{t.name}</span>], ["Used", `${t.used} times`]]} /></Section>
        {t.kind === "plan" && <Section title="Runs at each phase end">{t.commands.length ? <div className="r6-list">{t.commands.map((c) => <div key={c} className="link-row" style={{gridTemplateColumns: "16px minmax(0, 1fr)"}}><Icon name="term" size={13} style={{color: "var(--text-3)"}} /><span className="mono ellipsis">{c}</span></div>)}</div> : <p className="muted">No command.</p>}</Section>}
        <Section title="The shape"><Markdown text={t.body} /></Section></>}
    </Reader>} />
    {making && (making.use ? <CreateDialog title={`New ${R6_KIND_WORDS[making.use.kind].toLowerCase()} from ${making.use.name}`} submit={`Make the ${R6_KIND_WORDS[making.use.kind].toLowerCase()}`} onClose={() => setMaking(null)} onMade={(v) => toast(`${R6_KIND_WORDS[making.use.kind]} made: ${v.title}`)} command={(v) => `journal ${making.use.kind} make "${v.title || "…"}" --template ${making.use.name}`}
        fields={[{key: "title", label: "Title", required: true}, {key: "abstract", label: making.use.kind === "task" ? "What it is about" : "Abstract", required: making.use.kind !== "task"}, {key: "body", label: "Text", kind: "area", rows: 8, value: making.use.body}]} />
      : <CreateDialog title={making.edit ? `Edit ${making.edit.name}` : "New template"} submit={making.edit ? "Save" : "Make the template"} onClose={() => setMaking(null)} onMade={(v) => toast(making.edit ? `Template ${v.name} saved` : `Template ${v.name} made`)} command={(v) => `journal template ${making.edit ? "edit" : "make"} ${v.name || "…"}`}
        check={(v) => (!/^[a-z0-9-]+$/.test(v.name) ? {name: "Use small letters, digits and dashes."} : !making.edit && R6_TEMPLATES.some((t) => t.name === v.name) ? {name: `A template is already called ${v.name}.`} : {})}
        fields={[{key: "kind", label: "Kind", kind: "select", options: Object.entries(R6_KIND_WORDS), value: making.edit?.kind, required: true, half: true}, {key: "name", label: "Name", required: true, placeholder: "plan-release", value: making.edit?.name, half: true}, {key: "title", label: "Title", required: true, value: making.edit?.title}, {key: "commands", label: "Commands to run at each phase end", kind: "area", rows: 3, help: "One command a line", value: making.edit?.commands.join("\n"), when: (v) => v.kind === "plan"}, {key: "body", label: "Text", kind: "area", rows: 7, value: making.edit?.body}]} />)}
  </>;
}

/* ---------- Sequences ---------- */
const R6_SEQ_FIELDS = [{key: "state", label: "State", options: Object.entries(R6_SEQ_WORDS), get: (q) => q.state}, {key: "trigger", label: "Trigger", options: [["At a time", "At a time"], ["When a plan ends", "When a plan ends"], ["none", "By hand only"]], get: (q) => (q.triggers.length ? q.triggers.map((t) => t.kind) : "none")}];
function SequencesPage() {
  const [chosen, setChosen] = useState(31);
  const [making, setMaking] = useState(null);
  const toast = useToast();
  const rows = R6_SEQUENCES.map((q) => ({...q, desc: `${q.steps.length} steps · ${q.desc}`, ref: {term: "sequence", id: q.id}, group: ""}));
  return <><ListPage title="Sequences" line="Steps followed one at a time" fields={R6_SEQ_FIELDS} rows={rows} chosen={chosen} onChoose={setChosen}
    header={<Btn variant="primary" small onClick={() => setMaking({})}>New sequence</Btn>}
    renderMeta={(q) => <Badge state={q.state}>{R6_SEQ_WORDS[q.state]}</Badge>}
    renderReader={(q) => { const run = q.runs.find((r) => r.state === "started");
      return <Reader key={q.id} term="sequence" item={q} comments={false} head={{row: {term: "sequence", id: q.id}, state: q.state, stateWord: R6_SEQ_WORDS[q.state], by: q.by, at: q.at, extra: run && <span>run <RowLink term="run" id={run.id}>{run.id}</RowLink> at step {run.done + 1} of {run.total}</span>}}
        primary={run ? null : {label: "Start", run: () => { setMaking({start: q}); return false; }}}
        actions={[...(run ? [{group: "Run", label: `Stop run ${run.id}`, icon: "stop", field: {label: "Why is it stopped?"}, confirm: "Stop"}] : []), {group: "Sequence", label: "Edit the steps", icon: "edit", run: () => { setMaking({edit: q}); return false; }}, {group: "Sequence", label: "Add a trigger", icon: "clock", field: {label: "When it starts by itself", options: [["time", "At a time"], ["plan", "When a plan ends"], ["check", "When a check fails"]]}, confirm: "Add"}, {group: "Danger", label: "Remove the sequence", icon: "trash", danger: true, field: {label: "Why is it removed?"}, confirm: "Remove"}]}
        tabs={[{key: "steps", label: "Steps", count: q.steps.length, render: () => <div className="r6-list r6-steps">{q.steps.map(([s, st], i) => <div key={i} className="link-row"><span className="r6-num">{i + 1}</span><span className="ellipsis">{s}</span><Badge state={st} /></div>)}</div>},
          {key: "runs", label: "Runs", count: q.runs.length, render: () => q.runs.length ? <div className="r6-list r6-runs">{q.runs.map((r) => <div key={r.id} className="link-row"><RefCols term="run" id={r.id} /><AgentLink name={r.agent} /><span className="r6-bar"><i style={{width: `${(r.done / r.total) * 100}%`}} /></span><span className="r6-num">{r.done} of {r.total}</span><Badge state={r.state}>{r.state === "started" ? "Running" : undefined}</Badge></div>)}</div> : <p className="muted" style={{margin: 0}}>Never started.</p>},
          {key: "triggers", label: "Triggers", count: q.triggers.length, render: () => q.triggers.length ? <div className="r6-list r6-trig">{q.triggers.map((t) => <div key={t.id} className="link-row"><span className="ellipsis">{t.when}</span><span className="faint">{t.kind}</span><span className="row" style={{gap: 4}}><Btn small variant="ghost">Edit</Btn><Btn small variant="ghost">Remove</Btn></span></div>)}</div> : <p className="muted" style={{margin: 0}}>Started by hand only.</p>}]}>
        {() => null}
      </Reader>; }} />
    {making?.start && <CreateDialog title={`Start ${making.start.title}`} sub="One agent follows the steps, one at a time" submit="Start" onClose={() => setMaking(null)} onMade={(v) => toast(`Run 119 started: ${v.agent} at step ${v.from}`)} command={(v) => `journal sequence start ${making.start.id} --agent ${v.agent}`}
      fields={[{key: "agent", label: "Agent that follows it", kind: "agent", required: true}, {key: "from", label: "Start at step", kind: "select", options: making.start.steps.map(([s], i) => [String(i + 1), `${i + 1}. ${s}`]), required: true}]} />}
    {making && !making.start && <CreateDialog title={making.edit ? `Edit ${making.edit.title}` : "New sequence"} submit={making.edit ? "Save" : "Make the sequence"} onClose={() => setMaking(null)} onMade={(v) => toast(making.edit ? "Sequence saved" : `Sequence 32 made: ${v.title}`)} command={() => `journal sequence ${making.edit ? "edit" : "make"}`}
      fields={[{key: "title", label: "Title", required: true, value: making.edit?.title}, {key: "steps", label: "Steps", kind: "steps", required: true, placeholder: "Run the full test suite", value: making.edit?.steps.map(([s]) => s)}, {key: "trigger", label: "Starts by itself", kind: "select", options: [["none", "Never: by hand only"], ["time", "At a time"], ["plan", "When a plan ends"]], half: true}, {key: "when", label: "When", placeholder: "Fridays at 16:00", half: true, when: (v) => v.trigger === "time"}]} />}
  </>;
}

/* ---------- Reminders ---------- */
const R6_REM_FIELDS = [R6_AGENT_FIELD((r) => r.agent), {key: "state", label: "State", options: Object.entries(R6_REM_WORDS), get: (r) => r.state}];
function RemindersPage() {
  const [chosen, setChosen] = useState(1);
  const [making, setMaking] = useState(false);
  const toast = useToast();
  const rows = R6_REMINDERS.map((r) => ({...r, desc: `${r.schedule} · tells ${r.agent}`, ref: {term: "reminder", id: r.id}, group: ""}));
  return <><ListPage title="Reminders" line="Told to an agent at a time or on an interval" fields={R6_REM_FIELDS} rows={rows} chosen={chosen} onChoose={setChosen}
    header={<Btn variant="primary" small onClick={() => setMaking(true)}>New reminder</Btn>}
    renderMeta={(r) => r.state === "paused" ? <Badge state="paused" /> : `next ${r.next}`}
    renderReader={(r) => <Reader key={r.id} term="reminder" item={r} comments={false} head={{row: {term: "reminder", id: r.id}, state: r.state, stateWord: R6_REM_WORDS[r.state], byLabel: "made by", by: r.by, at: r.at}}
      primary={r.state === "paused" ? {label: "Resume", done: `Reminder ${r.id} resumed`} : {label: "Pause", done: `Reminder ${r.id} paused`}}
      actions={[{group: "Reminder", label: "Change the schedule", icon: "clock", field: {label: "When it is told", options: [["15", "Every 15 min"], ["30", "Every 30 min"], ["60", "Every hour"], ["once", "Once, at a time"]], value: "30"}, confirm: "Save"}, {group: "Reminder", label: "Tell another agent", icon: "agent", field: {label: "Agent", kind: "agent", value: r.agent}, confirm: "Save"}, {group: "Reminder", label: "Edit the text", icon: "edit", field: {label: "What it tells", value: r.body}, confirm: "Save"}, {group: "Danger", label: "Remove the reminder", icon: "trash", danger: true, field: {label: "Why is it removed?"}, confirm: "Remove"}]}>
      {() => <><Section title="Facts"><Fields rows={[["Tells", <AgentLink name={r.agent} />], ["Schedule", r.schedule], ["Next", r.state === "paused" ? "Paused" : r.next], ["Last told", r.last]]} /></Section><Section title="What it tells"><Markdown text={r.body} /></Section></>}
    </Reader>} />
    {making && <CreateDialog title="New reminder" sub="The agent is told this at the time, or on the interval" submit="Make the reminder" onClose={() => setMaking(false)} onMade={(v) => toast(`Reminder 3 made for ${v.agent}`)} command={(v) => `journal reminder make "…" --agent ${v.agent} ${v.how === "every" ? `--every ${v.every || "…"}` : `--at ${v.at || "…"}`}`}
      fields={[{key: "text", label: "What to tell", kind: "area", rows: 3, required: true}, {key: "agent", label: "Agent", kind: "agent", required: true}, {key: "how", label: "When", kind: "select", options: [["every", "On an interval"], ["at", "Once, at a time"]], required: true, half: true}, {key: "every", label: "Every", placeholder: "30 min", required: true, half: true, when: (v) => v.how === "every"}, {key: "at", label: "At", placeholder: "16:00", required: true, half: true, when: (v) => v.how === "at"}]} />}
  </>;
}

/* ---------- Teams: the team's library, what this journal shares, and who is in it ---------- */
const R6_TEAM_FIELDS = [{key: "kind", label: "Kind", options: [["Skill", "Skill"], ["Template", "Template"], ["Rule", "Rule"]], get: (i) => i.kind}, {key: "follow", label: "Followed", options: [["followed", "Followed here"], ["not", "Not followed"]], get: (i) => i.follow}];
function TeamsPage() {
  const [tab, setTab] = useState("library");
  const [chosen, setChosen] = useState(1);
  const [publishing, setPublishing] = useState(false);
  const toast = useToast();
  const line = <span>Library <span className="mono">{R6_TEAM.library}</span> · {R6_TEAM.state} · last reached {R6_TEAM.last}</span>;
  const header = <><Btn small onClick={() => toast("Synced with the library")}>Sync now</Btn><Btn small variant="primary" onClick={() => setPublishing(true)}>Share with the team</Btn></>;
  const tabs = <Tabs tabs={[{key: "library", label: "Library", count: R6_TEAM_ITEMS.length}, {key: "here", label: "Shared from here", count: 2}, {key: "users", label: "Users", count: R6_TEAM_USERS.length}]} value={tab} onPick={(t) => { setTab(t); setChosen(t === "users" ? "jesse" : 1); }} />;
  const items = (tab === "here" ? R6_TEAM_ITEMS.filter((i) => i.by === "Jesse" || i.by === "main") : R6_TEAM_ITEMS).map((i) => ({...i, desc: `${i.kind} · ${i.state}`, group: i.kind + "s"}));
  if (tab === "users") return <ListPage key="users" title="Teams" line={line} header={header} fields={[{key: "role", label: "Role", options: [["Owner", "Owner"], ["Member", "Member"]], get: (u) => u.role}]} rows={R6_TEAM_USERS.map((u) => ({...u, desc: `${u.role} · shares ${u.shares}`}))} chosen={chosen} onChoose={setChosen} placeholder="Search users"
    renderMeta={(u) => u.last} renderReader={(u) => <Reader key={u.id} term="user" item={u} comments={false} head={{extra: <span>{u.role}</span>, at: `last seen ${u.last}`}} actions={[{group: "User", label: "Change the role", icon: "user", field: {label: "Role", options: [["Owner", "Owner"], ["Member", "Member"]], value: u.role}, confirm: "Save"}, {group: "Danger", label: "Take out of the team", icon: "trash", danger: true, field: {label: "Why?"}}]}>{() => <Fields rows={[["Role", u.role], ["Shares", `${u.shares} items`], ["Last seen", u.last]]} />}</Reader>}>{tabs}</ListPage>;
  return <><ListPage key={tab} title="Teams" line={line} header={header} fields={R6_TEAM_FIELDS} rows={items} chosen={chosen} onChoose={setChosen} placeholder="Search the library"
    renderMeta={(i) => <Badge state={i.state === "Up to date" ? "open" : i.state === "Not followed" ? "draft" : "paused"}>{i.state}</Badge>}
    renderReader={(i) => <Reader key={i.id} term="library" item={i} comments={false} head={{extra: <><span>{i.kind}</span><span className="sep">·</span><span>{i.follow === "followed" ? "Followed here" : "Not followed"}</span></>, byLabel: "shared by", by: i.by, at: i.at}}
      primary={i.follow !== "followed" ? {label: "Follow", done: `${i.title} is followed here`} : i.state === "Newer in the library" ? {label: `Update to version ${i.there}`, done: `${i.title} updated`} : i.state === "Changed here" ? {label: "Share my change", done: "Your change is shared"} : null}
      actions={[{group: "Library", label: "Sync now", icon: "back"}, ...(i.follow === "followed" ? [{group: "Library", label: "Stop following", icon: "stop", field: {label: "Your copy stays as it is. Why stop?"}, confirm: "Stop following"}] : [])]}
      tabs={[{key: "facts", label: "Details", render: () => <Fields rows={[["Kind", i.kind], ["In the library", `version ${i.there}`], ["Here", typeof i.here === "number" ? `version ${i.here}` : i.here], ["State", i.state]]} />}, {key: "compare", label: "Compare", render: () => i.state === "Up to date" || i.state === "Not followed" ? <p className="muted" style={{margin: 0}}>{i.state === "Up to date" ? "The copy here is the library's." : "Not followed: there is no copy here."}</p> : <div className="r6-diff"><div className="hunk">library → here</div><div className="del">- Run the full suite at each phase end.</div><div className="add">+ Run the full suite once, at the end of the plan.</div><div>  Each phase has its own checkpoint.</div></div>}]}>
      {() => null}
    </Reader>}>{tabs}</ListPage>
    {publishing && <CreateDialog title="Share with the team" sub={`It goes to ${R6_TEAM.library}; other journals may follow it`} submit="Share" onClose={() => setPublishing(false)} onMade={(v) => toast(`${v.item} is shared`)} command={(v) => `journal library publish ${v.item}`}
      fields={[{key: "kind", label: "Kind", kind: "select", options: [["skill", "Skill"], ["template", "Template"], ["rule", "Rule"]], required: true, half: true}, {key: "item", label: "Which", kind: "select", options: [["journal-documents", "journal-documents"], ["plan-default", "plan-default"], ["design-doc", "design-doc"]], required: true, half: true}, {key: "note", label: "What changed", kind: "area", rows: 3}]} />}
  </>;
}

/* ---------- Git: commits with their files and diff, branches with their task and worker, pull requests with their checks ---------- */
const R6_GIT_LETTER = {M: "Changed", A: "New", D: "Deleted", R: "Moved"};
function GitPage() {
  const {openFile} = useOpen();
  const [tab, setTab] = useState("commits");
  const [chosen, setChosen] = useState(R6_COMMITS[0].id);
  const tabs = <Tabs tabs={[{key: "commits", label: "Commits", count: R6_COMMITS.length}, {key: "branches", label: "Branches", count: R6_BRANCHES.length}, {key: "pulls", label: "Pull requests", count: R6_PULLS.length}]} value={tab} onPick={(t) => { setTab(t); setChosen({commits: R6_COMMITS, branches: R6_BRANCHES, pulls: R6_PULLS}[t][0].id); }} />;
  const line = "Branch version-5 · 3 commits ahead of main";
  if (tab === "branches") return <ListPage key="b" title="Git" line={line} fields={[{key: "kind", label: "Kind", options: [["Local", "Local"], ["Worktree", "Worktree of a task"]], get: (b) => b.kind}, R6_AGENT_FIELD((b) => b.worker, "Worker")]} rows={R6_BRANCHES.map((b) => ({...b, desc: b.task ? `task ${b.task} · ${b.worker}` : b.current ? "Current" : b.isDefault ? "Default branch" : "", group: b.kind}))} chosen={chosen} onChoose={setChosen} placeholder="Search branches"
    renderMeta={(b) => `${b.ahead} ahead · ${b.behind} behind`}
    renderReader={(b) => <Reader key={b.id} term="branch" item={b} comments={false} head={{extra: <span>{b.kind}{b.current ? " · current" : ""}</span>, at: `last commit ${b.at}`}}
      actions={[{group: "Branch", label: "Copy its name", icon: "copy", done: "Name copied"}, ...(b.isDefault || b.current ? [] : [{group: "Danger", label: "Delete the branch", icon: "trash", danger: true, field: {label: "Why is it deleted?"}, confirm: "Delete", run: () => (b.kind === "Worktree" ? `Task ${b.task} still works in it. Merge or cancel the task first.` : undefined)}])]}>
      {() => <Fields rows={[b.task && ["Task", <RowLink term="task" id={b.task} />], b.worker && ["Worker", <AgentLink name={b.worker} />], ["Against main", `${b.ahead} ahead, ${b.behind} behind`], ["Last commit", <span className="mono">{b.last}</span>], ["When", b.at]]} />}
    </Reader>}>{tabs}</ListPage>;
  if (tab === "pulls") return <ListPage key="p" title="Git" line={line} fields={[{key: "state", label: "State", options: [["open", "Open"], ["completed", "Merged"], ["cancelled", "Closed"]], get: (p) => p.state}]} rows={R6_PULLS.map((p) => ({...p, desc: `${p.from} into ${p.into} · plan ${p.plan}`, ref: {term: "pull", id: p.id, kind: "PR"}, group: ""}))} chosen={chosen} onChoose={setChosen} placeholder="Search pull requests"
    renderMeta={(p) => <Badge state={p.checks.some((c) => c[1] === "failed") ? "failed" : "open"}>{p.checks.some((c) => c[1] === "failed") ? "A check failed" : "Open"}</Badge>}
    renderReader={(p) => <Reader key={p.id} term="pull" item={p} comments={false} head={{row: {term: "pull", id: p.id, kind: "PR"}, state: "open", stateWord: "Open", by: p.by, at: p.at}} actions={[{group: "Pull request", label: "Open on GitHub", icon: "open"}, {group: "Pull request", label: "Copy the link", icon: "copy", done: "Link copied"}]}>
      {() => <><Section title="Facts"><Fields rows={[["From", <span className="mono">{p.from}</span>], ["Into", <span className="mono">{p.into}</span>], ["Plan", <RowLink term="plan" id={p.plan} />]]} /></Section><Section title="Checks"><div className="r6-list r6-checks">{p.checks.map(([n, s, t]) => <div key={n} className="link-row"><span className="ellipsis">{n}</span><span className="r6-num">{t}</span><Badge state={s} /></div>)}</div></Section><Section title="Description"><Markdown text={p.body} /></Section></>}
    </Reader>}>{tabs}</ListPage>;
  return <ListPage key="c" title="Git" line={line} fields={[{key: "author", label: "Author", options: [["Jesse Gall", "Jesse Gall"]], get: (c) => c.author}, {key: "task", label: "Task", options: R6_OPTS(R6_COMMITS, (c) => c.task, (t) => `Task ${t}`), get: (c) => c.task}]}
    rows={R6_COMMITS.map((c) => ({...c, desc: `task ${c.task} · ${c.author} · ${c.at}`, ref: {term: "commit", id: c.id, kind: " "}, group: c.group}))} chosen={chosen} onChoose={setChosen} placeholder="Search commits"
    renderMeta={(c) => `${c.files.length} file${c.files.length === 1 ? "" : "s"}`}
    renderReader={(c) => <Reader key={c.id} term="commit" item={c} comments={false} head={{row: {term: "commit", id: c.id, kind: "Commit"}, extra: <span>by {c.author}</span>, at: c.at}}
      actions={[{group: "Commit", label: "Copy the hash", icon: "copy", done: "Hash copied"}, {group: "Commit", label: "Open its files in Files", icon: "file", run: () => openFile(c.files[0][1])}]}
      tabs={[{key: "files", label: "Files changed", count: c.files.length, render: () => <><Section title="Facts"><Fields rows={[["Task", <RowLink term="task" id={c.task} />], ["Plan", <RowLink term="plan" id={c.plan} />], ["Branch", <span className="mono">{c.branch}</span>]]} /></Section>
          <Section title="Files"><div className="r6-list">{c.files.map(([g, path, add, del]) => <div key={path} className="link-row r6-files"><span className="gs" title={R6_GIT_LETTER[g]}>{g}</span><span role="link" tabIndex={0} className="ref-link mono ellipsis" title={`Open ${path} in Files`} onClick={() => openFile(path)} onKeyDown={(e) => e.key === "Enter" && openFile(path)}>{path}</span><span className="num">+{add}</span><span className="num">−{del}</span></div>)}</div></Section></>},
        {key: "diff", label: "Diff", render: () => <div className="r6-diff">{c.files.slice(0, 2).map(([, path]) => <React.Fragment key={path}><div className="hunk">{path}</div><div className="del">- limit = None</div><div className="add">+ limit = worker.test_limit</div><div>  return limit</div></React.Fragment>)}</div>},
        {key: "message", label: "Message", render: () => <Markdown text={c.body || "No message body."} />}]}>
      {() => null}
    </Reader>}>{tabs}</ListPage>;
}

/* ---------- card pages: one filter bar, a kind icon, the state in words, Actions ---------- */
function R6CardPage({title, line, items, icon, fields, header, renderState, switchable, foot, actions, empty}) {
  const [value, setValue] = useState(emptyFilter());
  const [words, setWords] = useState("");
  const [on, setOn] = useState(Object.fromEntries(items.map((i) => [i.id, i.on])));
  const toast = useToast();
  const shown = applyFilter(items, fields, value, words, (i) => `${i.title} ${i.desc}`);
  return <div className="page" data-screen-label={title}>
    <PageHeader title={title} line={line}>{header}</PageHeader>
    <div className="r6-fbar"><FilterBar fields={fields} rows={items} value={value} onChange={setValue} words={words} onWords={setWords} shown={shown.length} placeholder={`Search ${title.toLowerCase()}`} /></div>
    <div style={{height: 12}} />
    <CardGridLayout items={shown} emptyTitle={items.length ? "Nothing matches the filters" : empty.title} emptyLine={items.length ? null : empty.line} emptyAction={items.length ? <Btn small onClick={() => { setValue(emptyFilter()); setWords(""); }}>Clear the filters</Btn> : empty.action}
      renderCard={(p) => <div key={p.id} className="card">
        <div className="row"><span className="tile-mark r6"><Icon name={icon} size={14} /></span><div className="grow" style={{minWidth: 0}}><h3>{p.title}</h3><div className="r6-card-state">{renderState(p, on[p.id])}</div></div>{switchable && <Switch on={on[p.id]} onChange={(v) => { setOn({...on, [p.id]: v}); toast(`${p.title} is ${v ? "on" : "off"}`); }} title={`${on[p.id] ? "Turn off" : "Turn on"} ${p.title}`} />}</div>
        <p title={p.desc}>{p.desc}</p>
        {p.fault && <div className="notice bad" style={{padding: "6px 10px"}}>{p.fault}</div>}
        <div className="row" style={{marginTop: "auto"}}>{foot(p)}<span className="grow" /><ActionMenu actions={actions(p)} onDone={toast} /></div>
      </div>} />
  </div>;
}
function PluginsPage({onOpenSettings}) {
  const [making, setMaking] = useState(null);
  const toast = useToast();
  return <><R6CardPage title="Plugins" line="Changes to the viewer and the agents' behaviour, installed here" items={R6_PLUGINS} icon="plug" switchable
    fields={[{key: "state", label: "State", options: [["on", "On"], ["off", "Off"], ["fault", "Has a fault"]], get: (p) => p.state}]}
    header={<Menu width={280} button={({toggle, open}) => <button type="button" className={"btn small primary menu-btn" + (open ? " on" : "")} aria-haspopup="menu" aria-expanded={open} onClick={toggle}><span>Install a plugin</span><Icon name="down" size={11} /></button>}>{(close) => <><MenuItem icon="open" desc="See what it adds before it is installed" onClick={() => { setMaking("install"); close(); }}>From a file or an address</MenuItem><MenuItem icon="plus" desc="An agent writes it, with the guide" onClick={() => { setMaking("make"); close(); }}>Make a new one</MenuItem></>}</Menu>}
    renderState={(p) => <><span>version {p.version}</span>{p.upgrade && <><span>·</span><span>{p.upgrade} can be installed</span></>}</>}
    foot={(p) => <Btn small onClick={() => onOpenSettings(p)}>Settings</Btn>}
    actions={(p) => [{group: "Plugin", label: "Show the log", icon: "log"}, ...(p.upgrade ? [{group: "Plugin", label: `Upgrade to ${p.upgrade}`, icon: "up", field: {label: "What changes", options: [["ok", "Adds a band setting; no new access"]]}, confirm: "Upgrade"}] : []), {group: "Danger", label: "Remove the plugin", icon: "trash", danger: true, field: {label: "Why is it removed?"}, confirm: "Remove"}]}
    empty={{title: "No plugins yet", line: "A plugin adds a band, a page or a hook", action: <Btn small variant="primary" onClick={() => setMaking("install")}>Install a plugin</Btn>}} />
    {making === "install" && <CreateDialog title="Install a plugin" sub="Before it is installed you see what it adds and what it may reach" submit="Install" onClose={() => setMaking(null)} onMade={() => toast("Plugin installed, off until you turn it on")} command={(v) => `journal plugin install ${v.from || "…"}`}
      fields={[{key: "from", label: "File or address", required: true, placeholder: "https://github.com/team/status-band or ~/plugins/band.zip"}, {key: "preview", label: "What it adds", kind: "select", options: [["band", "A band over the chat · 1 service · reads the build state · no secret"]], help: "Read from the plugin's manifest once the address is filled in"}]} />}
    {making === "make" && <CreateDialog title="Make a plugin" sub="main writes it in your project, following the plugin guide" submit="Hand it to main" onClose={() => setMaking(null)} onMade={() => toast("Task 9701 made: main writes the plugin")} command={() => "journal task make … --skill plugin-authoring"}
      fields={[{key: "name", label: "Name", required: true, placeholder: "deploy-band"}, {key: "what", label: "What it does", kind: "area", rows: 4, required: true, placeholder: "A band that shows the last deploy and its state"}]} />}
  </>;
}
function IntegrationsPage() {
  const [making, setMaking] = useState(null);
  const toast = useToast();
  return <><R6CardPage title="Integrations" line="MCP servers the agents may use" items={R6_INTEGRATIONS} icon="link" switchable
    fields={[{key: "state", label: "State", options: Object.entries(R6_INT_WORDS), get: (i) => i.state}, {key: "profile", label: "Profile", options: R6_OPTS(R6_INTEGRATIONS, (i) => i.profiles), get: (i) => i.profiles}]}
    header={<Btn variant="primary" small onClick={() => setMaking({})}>Add a server</Btn>}
    renderState={(i) => <><Badge state={i.state === "failed" ? "failed" : i.state === "login" ? "blocked" : i.state === "off" ? "draft" : "open"}>{R6_INT_WORDS[i.state]}</Badge><span className="ellipsis" title={i.stateLine}>{i.state === "failed" ? i.stateLine.split(": ")[1] : i.stateLine.split(" · ")[1] || ""}</span></>}
    foot={(i) => i.state === "login" ? <Btn small variant="primary">Log in</Btn> : i.state === "failed" ? <Btn small>Connect again</Btn> : <Btn small onClick={() => setMaking({edit: i})}>Settings</Btn>}
    actions={(i) => [{group: "Server", label: "Settings", icon: "gear", run: () => { setMaking({edit: i}); return false; }}, {group: "Server", label: "Show the log", icon: "log"}, {group: "Danger", label: "Remove the server", icon: "trash", danger: true, field: {label: "Why is it removed?"}, confirm: "Remove"}]}
    empty={{title: "No servers yet", line: "An MCP server gives agents more tools", action: <Btn small variant="primary" onClick={() => setMaking({})}>Add a server</Btn>}} />
    {making && (making.edit ? <IntegrationDialog i={making.edit} onClose={() => setMaking(null)} />
      : <CreateDialog title="Add a server" sub="An MCP server the agents may call" submit="Add the server" onClose={() => setMaking(null)} onMade={(v) => toast(`${v.name} added; connecting`)} command={(v) => `journal integration add ${v.name || "…"} -- ${v.command || "…"}`}
        fields={[{key: "name", label: "Name", required: true, placeholder: "sentry", half: true}, {key: "how", label: "How it is reached", kind: "select", options: [["command", "A command it runs"], ["address", "An address"]], half: true}, {key: "command", label: "Command or address", required: true, placeholder: "npx @sentry/mcp-server"}, {key: "secret", label: "Secret it needs", kind: "select", options: [["", "None"], ...R6_SECRETS.map((s) => [s.id, s.title])]}, {key: "profiles", label: "Profiles that may call it", placeholder: "journal-main, journal-worker", help: "Each profile's Tools tab shows it too"}]} />)}
  </>;
}
// an integration's own settings: its command, its state, who may call it, its log
function IntegrationDialog({i, onClose}) {
  const toast = useToast();
  const [tab, setTab] = useState("settings");
  const d = useDraft({command: i.command});
  return <Dialog title={i.title} sub={i.desc} onClose={onClose}>
    <SettingsLayout tabs={[{key: "settings", label: "Settings"}, {key: "who", label: "Who may call it", count: i.profiles.length}, {key: "log", label: "Log"}]} tab={tab} onTab={setTab} draft={d.changed.length} onCancel={d.cancel} onSave={() => { d.save(); toast(`${i.title} saved`); }}>
      {tab === "settings" && <SettingSection title="Server"><SettingRow label="State"><span className="ro">{i.stateLine}</span></SettingRow><div className="srow stack"><div><div className="lab">Command or address</div></div><div className="ctl"><input type="text" aria-label="Command or address" value={d.v.command} onChange={(e) => d.set("command", e.target.value)} /></div></div><SettingRow label="Secret it uses">{i.secret ? <RowLink term="secret" id={i.secret}>{R6_SECRETS.find((s) => s.id === i.secret)?.title}</RowLink> : <span className="ro">None</span>}</SettingRow></SettingSection>}
      {tab === "who" && <SettingSection title="Profiles that may call it" help="Change this in each profile's Tools tab.">{i.profiles.length ? <div className="r6-list r6-who">{i.profiles.map((n) => <div key={n} className="link-row"><Icon name="agent" size={13} style={{color: "var(--text-3)"}} /><RowLink term="profile" id={n}>{n}</RowLink><span /><span /></div>)}</div> : <p className="muted">No profile may call it yet.</p>}</SettingSection>}
      {tab === "log" && <SettingSection title="Log"><pre className="pf-preview">14:02 connected{"\n"}14:02 26 tools listed</pre></SettingSection>}
    </SettingsLayout>
  </Dialog>;
}
function SecretsPage() {
  const [making, setMaking] = useState(null);
  const toast = useToast();
  const used = (s) => s.usedBy.length ? s.usedBy.map(([t, id], k) => <React.Fragment key={id}>{k > 0 && ", "}{t === "setting" ? id : <RowLink term={t} id={id}>{t === "integration" ? R6_INTEGRATIONS.find((x) => x.id === id)?.title : id}</RowLink>}</React.Fragment>) : "nothing yet";
  return <><R6CardPage title="Secrets" line="Keys and logins, never shown to an agent in full" items={R6_SECRETS.map((s) => ({...s, desc: ""}))} icon="key"
    fields={[{key: "state", label: "Use", options: [["used", "In use"], ["unused", "Not used"]], get: (s) => s.state}, {key: "kind", label: "Kind", options: [["Token", "Token"], ["Key", "Key"]], get: (s) => s.kind}]}
    header={<Btn variant="primary" small onClick={() => setMaking({})}>New secret</Btn>}
    renderState={(s) => <span className="r6-mask">{s.mask}</span>}
    foot={(s) => <><Btn small onClick={() => setMaking({replace: s})}>Replace the value</Btn><span className="faint ellipsis" style={{fontSize: 11.5}}>used {s.last}</span></>}
    actions={(s) => [{group: "Secret", label: "Copy its name", icon: "copy", desc: s.id, done: "Name copied"}, {group: "Danger", label: "Remove the secret", icon: "trash", danger: true, field: {label: "Why is it removed?"}, confirm: "Remove", run: () => (s.usedBy.length ? `${s.title} is used by ${s.usedBy.length} ${s.usedBy.length === 1 ? "row" : "rows"}. Replace it there first.` : undefined)}]}
    empty={{title: "No secrets yet", line: "A key or login an integration or a plugin needs", action: <Btn small variant="primary" onClick={() => setMaking({})}>New secret</Btn>}} />
    <div style={{display: "none"}}>{R6_SECRETS.map((s) => <span key={s.id}>{used(s)}</span>)}</div>
    {making?.replace && <CreateDialog title={`Replace ${making.replace.title}`} sub={<span>Used by {used(making.replace)}. They use the new value from their next call.</span>} submit="Replace" onClose={() => setMaking(null)} onMade={() => toast(`${making.replace.title} replaced`)} command={() => `journal secret replace ${making.replace.id}`}
      fields={[{key: "value", label: "New value", kind: "password", required: true, help: "It is never shown again, here or to an agent"}]} />}
    {making && !making.replace && <CreateDialog title="New secret" sub="A key or login, kept out of every agent's view" submit="Keep the secret" onClose={() => setMaking(null)} onMade={(v) => toast(`${v.title} kept`)} command={(v) => `journal secret make ${v.name || "…"}`}
      check={(v) => (R6_SECRETS.some((s) => s.id === v.name) ? {name: `A secret is already called ${v.name}.`} : {})}
      fields={[{key: "title", label: "Title", required: true, placeholder: "Sentry token", half: true}, {key: "name", label: "Name", required: true, placeholder: "sentry", half: true}, {key: "value", label: "Value", kind: "password", required: true}, {key: "for", label: "For", kind: "select", options: [["", "Nothing yet"], ...R6_INTEGRATIONS.map((i) => [i.id, i.title])]}]} />}
  </>;
}

Object.assign(window, {DocumentsPage, SkillsPage, MemoriesPage, RulesPage, TemplatesPage, SequencesPage, RemindersPage, TeamsPage, GitPage, R6CardPage, PluginsPage, IntegrationsPage, IntegrationDialog, SecretsPage, R6_INTEGRATIONS, R6_SECRETS});
