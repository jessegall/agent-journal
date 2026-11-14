// The Profiles page and the profile editor, round six (report 1383 §1, §3, §5-7, §15; doc 1276 §1-2, §9).
// The editor holds exactly what AgentProfile holds (src/engine/profile/agent_profile.py) and what the file overlays (profile_format.py OVERLAID_FIELDS).
// Nothing new: no effort, no rules per profile, no limits. Those stay in the agent settings and on the Rules page.
// Today's panel keeps what it does: Start a helper (HelperStartForm.vue, the availability read), a locked type, the declared types and programs.

/* ---------- what the reads give (profiles.profiles: types, programs, injections, profiles, availability, usage) ---------- */
const PROFILE_TYPES = [
  {key: "main", label: "Main agent", group: "Main agents", mayWrite: true, occupant: false, access: "writing", reports: false, siblings: false, started: "The journal starts it when you open the chat"},
  {key: "worker", label: "Worker", group: "Workers", mayWrite: true, occupant: true, access: "writing", reports: true, siblings: true, started: "A plan's dispatch starts it for a task"},
  {key: "helper", label: "Helper", group: "Helpers", mayWrite: false, occupant: true, access: "read-only", reports: true, siblings: false, started: "An agent, or you, starts it with a job"},
  {key: "reviewer", label: "Reviewer", group: "Reviewers", mayWrite: false, occupant: true, access: "read-only", reports: true, siblings: false, started: "An agent, or you, starts it with a change to review"},
];
const typeOf = (k) => PROFILE_TYPES.find((t) => t.key === k) || PROFILE_TYPES[2];
const PROFILE_PROGRAMS = [
  {name: "claude-code", title: "Claude Code", installed: true, models: ["Opus 5.5", "Sonnet 5.5", "Haiku 5.5", "Fable 5.2"], tiers: {fast: "Haiku 5.5", general: "Sonnet 5.5", strongest: "Opus 5.5"}},
  {name: "codex", title: "Codex", installed: false, models: ["gpt-5.5-codex", "gpt-5.5-codex-mini"], tiers: {fast: "gpt-5.5-codex-mini", general: "gpt-5.5-codex", strongest: "gpt-5.5-codex"}},
];
const programOf = (n) => PROFILE_PROGRAMS.find((p) => p.name === n);
const PROFILE_INJECTIONS = [{key: "journal", title: "The journal's part of the instruction files", default: true}, {key: "commandments", title: "The commandments index", default: true}];
const OCCUPANTS = [["continue", "Resume it"], ["when-cold", "Start over after a long pause"], ["each-launch", "New for each job"]];
const TIERS = [["", "No tier: the models named below"], ["fast", "Fast"], ["general", "General"], ["strongest", "Strongest"], ["rare", "Rare"]];
const PROFILE_SKILLS = [...SKILLS.map((s) => [s.id, s.desc]), ["journal-workers", "Send a worker, and work as one"], ["journal-helpers", "Start a helper for a bounded read"], ["journal-plans", "Ordered tasks and their phases"], ["journal-memory", "Keep what matters past the context"]];
const FIELD_LABELS = {title: "Title", description: "When it is used", body: "Instructions", base: "Extends", agent_type: "Type", access: "Access", program: "Program", preferred_program: "When it cannot start", fallback_programs: "Programs to try instead", program_models: "Models", tier: "Tier", occupant: "Conversation", mcp_tools: "Tools", writable_folders: "Folders it may write", uses_project_instructions: "Project instruction files", injections: "Injections", skills: "Skills offered", required_skills: "Skills required", default_fields: "Defaults over the base", name: "Name"};

const P = (o) => ({title: "", description: "", body: "", base: "", agent_type: "helper", is_base: false, access: null, program: "", preferred_program: true, fallback_programs: [], program_models: {}, tier: null, occupant: "when-cold", mcp_tools: [], writable_folders: [], uses_project_instructions: false, injections: {}, skills: [], required_skills: [], default_fields: [], module: "", path: "", changed: [], module_text_changed: false, problem: "", notes: [], uses: 0, last: "never", runBy: [], ...o});
const PROFILE_START = [
  P({name: "journal-main", title: "Main agent", description: "The agent you talk to: it plans, hands out work and answers you", agent_type: "main", module: "journal.core.agents", occupant: "continue", program: "claude-code", program_models: {"claude-code": "Opus 5.5"}, tier: "strongest", skills: ["journal", "journal-tasks", "journal-documents", "journal-workers", "journal-helpers", "journal-plans", "journal-memory"], required_skills: ["journal", "journal-tasks"], mcp_tools: ["mcp__github", "mcp__linear"], uses: 212, last: "now", runBy: ["main"], body: "You are the main agent of this project.\n\nRead the overview first. Plan the work the user asks for, hand tasks to workers, and answer the user in the chat in plain words."}),
  P({name: "journal-worker", title: "Worker", description: "Writes code for one task in its own worktree", agent_type: "worker", module: "suites.coding.workers", changed: ["program_models", "tier"], program: "claude-code", fallback_programs: ["codex"], program_models: {"claude-code": "Sonnet 5.5"}, tier: "general", skills: ["journal", "journal-tasks", "journal-workers"], required_skills: ["journal", "journal-tasks", "journal-workers"], mcp_tools: ["mcp__github"], uses: 96, last: "5 min ago", runBy: ["worker-4", "worker-7"], body: "You are a worker. Take the task you were given, build it in your worktree, prove it with its tests and hand it to the merger."}),
  P({name: "journal-worker-senior", title: "Senior worker", description: "A worker for tasks of complexity 4 and 5", agent_type: "worker", module: "suites.coding.workers", base: "journal-worker", program: "claude-code", program_models: {"claude-code": "Opus 5.5"}, tier: "strongest", skills: ["journal", "journal-tasks", "journal-workers"], required_skills: ["journal", "journal-tasks", "journal-workers"], mcp_tools: ["mcp__github"], uses: 31, last: "1 h ago", body: "Take extra care with the architecture: read the commandments the task touches before you write."}),
  P({name: "journal-designer", title: "Designer", description: "Designs one screen or flow in Claude Design", agent_type: "helper", module: "journal.core.profiles", module_text_changed: true, base: "journal-base-helper", occupant: "each-launch", tier: "strongest", skills: ["journal", "journal-documents", "commandments-plain-viewer-text"], required_skills: ["journal", "journal-documents"], mcp_tools: ["mcp__claude_design"], uses: 14, last: "now", runBy: ["helper-851"], injections: {commandments: false}, notes: ["Its instructions name Claude Design tools, so it is offered only while that integration is on."], body: "You design one screen or flow. Find what the code already shows of it first, then describe the design: what a user sees and does, each state, and what could go wrong."}),
  P({name: "journal-researcher", title: "Researcher", description: "Answers one question by reading code, documents and the web", agent_type: "helper", module: "journal.core.profiles", base: "journal-base-helper", occupant: "each-launch", tier: "general", skills: ["journal", "journal-documents"], required_skills: ["journal"], uses: 48, last: "yesterday", body: "Answer the question you were given. File a report with the files and lines that show each point."}),
  P({name: "journal-code-reviewer", title: "Code reviewer", description: "Reviews a worker's change before it is merged", agent_type: "reviewer", module: "suites.coding.reviews", occupant: "each-launch", tier: "strongest", skills: ["journal", "commandments-vue-vue-components"], required_skills: ["journal"], uses: 40, last: "3 h ago", runBy: ["reviewer-3"], body: "Review the change against the task and the commandments. File a report."}),
  P({name: "journal-base-helper", title: "Base helper", description: "What every helper starts from; never started on its own", agent_type: "helper", module: "journal.core.profiles", is_base: true, occupant: "each-launch", tier: "general", skills: ["journal"], required_skills: ["journal"], body: "You are a helper: you do one bounded job for the agent that started you, then report."}),
  P({name: "critic", title: "Critic", description: "Reads a design and argues against it, point by point", agent_type: "helper", path: ".agents/profiles/critic.md", base: "journal-researcher", occupant: "each-launch", tier: "strongest", default_fields: ["mcp_tools"], skills: ["journal", "journal-documents"], required_skills: ["journal"], uses_project_instructions: true, body: "Argue against the design you are given. Each point names what breaks and for whom."}),
  P({name: "release_checker", title: "Release checker", description: "Runs the release sequence and reports what is missing", agent_type: "worker", path: ".agents/profiles/release_checker.md", problem: "The file names a skill that does not exist: journal-release. Remove it or add the skill.", base: "journal-worker", occupant: "each-launch", program: "claude-code", preferred_program: false, tier: "general", writable_folders: ["dist", "CHANGELOG.md"], skills: ["journal", "journal-tasks"], required_skills: ["journal"], uses: 3, last: "4 days ago", runBy: ["worker-7"], body: "Follow sequence 31 step by step."}),
];
window.PROFILE_ROWS = PROFILE_START;
const EDIT_KEYS = ["name", "title", "description", "agent_type", "access", "base", "occupant", "program", "preferred_program", "fallback_programs", "program_models", "tier", "body", "uses_project_instructions", "injections", "skills", "required_skills", "mcp_tools", "writable_folders", "default_fields"];
const BASE_KEYS = EDIT_KEYS.filter((k) => !["name", "agent_type", "base", "default_fields"].includes(k));
const PROFILE_TABS = [
  {key: "about", label: "About", keys: ["name", "title", "description", "agent_type", "access", "base", "occupant"]},
  {key: "model", label: "Model", keys: ["program", "preferred_program", "fallback_programs", "program_models", "tier"]},
  {key: "instructions", label: "Instructions", keys: ["body", "uses_project_instructions", "injections"]},
  {key: "skills", label: "Skills", keys: ["skills", "required_skills"]},
  {key: "tools", label: "Tools and folders", keys: ["mcp_tools", "writable_folders"]},
  {key: "preview", label: "Preview", keys: []},
];
const tabOfKey = (k) => PROFILE_TABS.find((t) => t.keys.includes(k))?.key || "about";
const draftOf = (p) => Object.fromEntries(EDIT_KEYS.map((k) => [k, p[k]]));
const modelOf = (v) => { const prog = programOf(v.program || "claude-code"); return v.program_models[prog.name] || (v.tier && prog.tiers[v.tier]) || "its base's model"; };
const toggled = (list, item) => (list.includes(item) ? list.filter((x) => x !== item) : [...list, item]);
const plural = (n, one, many = one + "s") => `${n} ${n === 1 ? one : many}`;
// the profiles an extends would loop through: this one and every profile that extends it
const descendants = (rows, name) => { const out = new Set([name]); let grew = true; while (grew) { grew = false; for (const r of rows) if (r.base && out.has(r.base) && !out.has(r.name)) { out.add(r.name); grew = true; } } return out; };
// today's availability read, per profile and program (HelperStartForm.vue)
const AVAILABILITY = {
  "journal-designer": {can_start: true, reason: "", programs: ["claude-code"], idle_helpers: [{id: 12, name: "helper-851"}], can_start_fresh: true, fresh_reason: ""},
  "journal-code-reviewer": {can_start: false, reason: "3 reviewers run now, and the agent settings allow 3. Send the job to an idle one, or wait.", programs: ["claude-code"], idle_helpers: [], can_start_fresh: false, fresh_reason: ""},
};
const availabilityOf = (name) => AVAILABILITY[name] || {can_start: true, reason: "", programs: ["claude-code"], idle_helpers: [], can_start_fresh: true, fresh_reason: ""};

function useProfileDraft(initial) {
  const [saved, setSaved] = useState(initial);
  const [now, setNow] = useState(initial);
  const changed = EDIT_KEYS.filter((k) => JSON.stringify(now[k]) !== JSON.stringify(saved[k]));
  return {v: now, saved, changed, set: (k, val) => setNow((n) => ({...n, [k]: val})), save: (refused = []) => setSaved((s) => ({...now, ...Object.fromEntries(refused.map((k) => [k, s[k]]))})), cancel: () => setNow(saved)};
}

// one source badge, and one more only for a state: Changed, Problem or Base
function SourceBadge({p, list}) {
  const src = p.module ? <span className="pf-src" title={`Comes with the journal, from ${p.module}; your changes are kept through updates`}>{list ? "Journal" : "Comes with the journal"}</span> : <span className="pf-src project" title={`Made in this project: ${p.path}`}>Project</span>;
  const state = p.problem ? <span className="pf-src problem" title={p.problem}>Problem</span> : p.is_base ? <span className="pf-src" title="Other profiles extend it; it is never started on its own">Base</span> : p.changed.length ? <span className="pf-src changed" title={`You changed ${plural(p.changed.length, "setting")}; they are kept through updates`}>Changed</span> : null;
  return <>{list ? null : src}{state}{list && !state ? src : null}</>;
}

/* ---------- the page ---------- */
const PF_FIELDS = [
  {key: "source", label: "Source", options: [["journal", "Comes with the journal"], ["project", "Project"]], get: (i) => (i.p.module ? "journal" : "project")},
  {key: "type", label: "Type", options: PROFILE_TYPES.map((t) => [t.key, t.label]), get: (i) => i.p.agent_type},
  {key: "state", label: "State", options: [["changed", "Changed"], ["problem", "Has a problem"], ["base", "Base"], ["running", "Running now"]], get: (i) => [i.p.changed.length && "changed", i.p.problem && "problem", i.p.is_base && "base", i.p.runBy.length && "running"].filter(Boolean)},
];
function ProfilesPage({guard}) {
  const toast = useToast();
  const [rows, setRowsNow] = useState(PROFILE_START);
  const setRows = (r) => { window.PROFILE_ROWS = r; setRowsNow(r); };
  const [chosen, setChosen] = useState("journal-worker");
  const [fresh, setFresh] = useState(null);
  const [leaving, setLeaving] = useState(null);
  const [starting, setStarting] = useState(null);
  const own = useRef(null);
  const holder = guard || own;
  // every switch away from a draft asks first: another row, New, Duplicate
  const ask = (then) => { if (holder.current) setLeaving({then, ...holder.current}); else then(); };
  const choose = (id) => { if (id !== chosen) ask(() => { if (id !== "__new") setFresh(null); setChosen(id); }); };
  const blank = () => P({name: "", agent_type: "helper", occupant: "each-launch"});
  const startNew = (from) => ask(() => { const base = from && rows.find((r) => r.name === from); setFresh(base ? P({name: "", base: base.name, agent_type: base.agent_type, occupant: base.occupant, skills: base.skills, required_skills: base.required_skills}) : blank()); setChosen("__new"); });
  const duplicate = (p) => ask(() => { setFresh({...p, name: "", title: `${p.title} copy`, module: "", path: "", changed: [], uses: 0, last: "never", runBy: [], is_base: false, problem: "", module_text_changed: false}); setChosen("__new"); });
  const saveRow = (p, v, changedKeys) => {
    if (p.name === "__new") { const made = {...p, ...v, path: `.agents/profiles/${v.name}.md`, changed: []}; setRows([made, ...rows]); setFresh(null); setChosen(v.name); toast(`Profile ${v.name} made`); return; }
    setRows(rows.map((r) => r.name === p.name ? {...r, ...v, changed: r.module ? [...new Set([...r.changed, ...changedKeys])] : []} : r)); toast(`Profile ${p.name} saved`);
  };
  const reset = (p) => { const start = PROFILE_START.find((r) => r.name === p.name); setRows(rows.map((r) => r.name === p.name ? {...start, changed: [], uses: r.uses} : r)); toast(`${p.name} is the journal's version again`); };
  const remove = (p) => { setRows(rows.filter((r) => r.name !== p.name)); setChosen(rows[0].name); toast(`Profile ${p.name} removed`); };
  const listed = [...(fresh ? [{...fresh, name: "__new"}] : []), ...rows];
  const items = listed.map((p) => ({id: p.name, title: p.name === "__new" ? (fresh.title || "New profile") : p.name, desc: p.name === "__new" ? "Not saved yet" : `${typeOf(p.agent_type).label} · ${modelOf(p)} · ${plural(p.skills.length, "skill")}`, group: p.name === "__new" ? "New" : p.is_base ? "Base profiles" : typeOf(p.agent_type).group, p}));
  const newMenu = <Menu width={300} button={({toggle, open}) => <button type="button" className={"btn small primary menu-btn" + (open ? " on" : "")} aria-haspopup="menu" aria-expanded={open} onClick={toggle}><span>New profile</span><Icon name="down" size={11} /></button>}>{(close) => <>
    <MenuItem icon="plus" desc="Empty: you choose its type and fill in every field" onClick={() => { close(); startNew(null); }}>A blank profile</MenuItem>
    <div className="menu-sep" /><div className="menu-label">Extend a profile: what you leave out comes from it</div>
    {rows.filter((r) => r.module).map((r) => <MenuItem key={r.name} icon="agent" desc={r.description} onClick={() => { close(); startNew(r.name); }}>{r.name}</MenuItem>)}
  </>}</Menu>;
  return <>
    <ListPage title="Profiles" line="Which program, model, skills and instructions each kind of agent starts with" header={newMenu} fields={PF_FIELDS} rows={items} chosen={chosen} onChoose={choose} listWidth={320} placeholder="Search profiles"
      textOf={(i) => `${i.id} ${i.p.title} ${i.p.description}`} pickLine="Choose a profile to read and change it here"
      renderMeta={(i) => <span className="pf-list-meta">{i.p.name === "__new" ? <span className="pf-src">New</span> : <SourceBadge p={i.p} list />}</span>}
      renderReader={(i) => <ProfileEditor key={i.id} p={i.p} rows={rows} guard={holder} onSave={saveRow} onReset={reset} onRemove={remove} onDuplicate={duplicate} onStart={setStarting} onDrop={() => { setFresh(null); setChosen(rows[0].name); }} />} />
    {leaving && <LeaveDialog count={leaving.count} onStay={() => setLeaving(null)} onDiscard={() => { leaving.discard(); holder.current = null; setLeaving(null); leaving.then(); }} onSave={() => { const ok = leaving.save(); setLeaving(null); if (ok) { holder.current = null; leaving.then(); } }} />}
    {starting && <StartHelperDialog p={starting} onClose={() => setStarting(null)} />}
  </>;
}

/* ---------- the editor ---------- */
function ProfileEditor({p, rows, guard, onSave, onReset, onRemove, onDuplicate, onStart, onDrop}) {
  const toast = useToast();
  const isNew = p.name === "__new";
  const d = useProfileDraft(draftOf(isNew ? {...p, name: ""} : p));
  const v = d.v;
  const [tab, setTab] = useState(p.problem ? "skills" : "about");
  const [errors, setErrors] = useState({});
  const [failure, setFailure] = useState(null);
  const base = rows.find((r) => r.name === v.base);
  const type = typeOf(v.agent_type);
  const ch = (k) => d.changed.includes(k);
  const access = v.access || base?.access || type.access;
  const writes = type.mayWrite && access === "writing";
  const refusalOf = {
    name: (x) => (!isNew ? null : !/^[A-Za-z0-9_-]+$/.test(x) ? "Use letters, digits, dashes and underscores, such as release-checker." : rows.some((r) => r.name === x) ? `A profile is already called ${x}.` : null),
    description: (x) => (!x.trim() ? "Say when it is used: the agent reads this to decide when to start it." : null),
    tier: (x) => (x === "rare" && !Object.values(v.program_models).some(Boolean) ? "The rare tier needs a named model: name one below." : null),
  };
  const save = () => {
    const keys = isNew ? EDIT_KEYS : d.changed;
    const refused = keys.filter((k) => refusalOf[k]?.(v[k]));
    setErrors(Object.fromEntries(refused.map((k) => [k, refusalOf[k](v[k])])));
    if (refused.length) { setFailure(isNew ? `Not made: ${plural(refused.length, "field")} to fix, marked in amber.` : `${keys.length - refused.length} of ${keys.length} saved. ${refused.length} refused: see the marked row.`); setTab(tabOfKey(refused[0])); if (!isNew) { d.save(refused); onSave(p, {...d.saved, ...Object.fromEntries(keys.filter((k) => !refused.includes(k)).map((k) => [k, v[k]]))}, keys.filter((k) => !refused.includes(k))); } return false; }
    setFailure(null); const changedKeys = d.changed; d.save(); onSave(p, v, changedKeys); return true;
  };
  const cancel = () => { d.cancel(); setErrors({}); setFailure(null); if (isNew) onDrop(); };
  // a new draft is guarded as soon as anything is typed in it, the same as a changed profile
  useEffect(() => { guard.current = d.changed.length ? {count: d.changed.length, save, discard: cancel} : null; return () => { guard.current = null; }; });
  const startable = (type.key === "helper" || type.key === "reviewer") && !p.is_base && !isNew;
  const actions = isNew ? [] : [
    {group: "Profile", label: "Duplicate as a project profile", icon: "copy", run: () => { onDuplicate(p); return false; }},
    ...(p.module && p.changed.length ? [{group: "Profile", label: "Show what you changed", icon: "edit", desc: p.changed.map((k) => FIELD_LABELS[k]).join(", "), run: () => { setTab(tabOfKey(p.changed[0])); return false; }}] : []),
    ...(p.module && (p.changed.length || p.module_text_changed) ? [{group: "Danger", label: "Use the journal's version", icon: "back", danger: true, field: {label: "Your changes to this profile go. Why?"}, confirm: "Use the journal's version", run: () => { onReset(p); }}] : []),
    ...(!p.module ? [{group: "Danger", label: "Remove the profile", icon: "trash", danger: true, field: {label: "Why is it removed?"}, confirm: "Remove", run: () => (p.runBy.length ? `${p.runBy.join(" and ")} run${p.runBy.length === 1 ? "s" : ""} this profile now. Stop ${p.runBy.length === 1 ? "it" : "them"} first, then remove the profile.` : onRemove(p))}] : []),
  ];
  const tabs = PROFILE_TABS.map((t) => ({key: t.key, label: t.keys.some(ch) ? <>{t.label}<i className="pf-dot" title="Changes not saved" /></> : t.label}));
  // what a field takes from its base, and the way to set it to its default over the base (default_fields)
  const inherit = (k, empty) => {
    if (!base) return null;
    if (v.default_fields.includes(k)) return <span className="pf-inherit">the default, not {base.name}'s<button type="button" onClick={() => d.set("default_fields", v.default_fields.filter((x) => x !== k))}>Use {base.name}'s</button></span>;
    if (JSON.stringify(base[k]) === JSON.stringify(v[k])) return <span className="pf-inherit">as in {base.name}<button type="button" onClick={() => { d.set("default_fields", [...v.default_fields, k]); d.set(k, empty); }}>Use the default</button></span>;
    return null;
  };
  const help = (text, k, empty) => { const i = inherit(k, empty); return i ? <>{text}{text && " · "}{i}</> : text; };
  const loop = descendants(rows, p.name);
  const allTools = [...new Set([...R6_INTEGRATIONS.map((i) => "mcp__" + i.id.replace("-", "_")), ...v.mcp_tools])];
  const [toolWords, setToolWords] = useState("");
  const [folderWords, setFolderWords] = useState("");
  const section = {
    about: <>
      {p.problem && <div className="notice warn" style={{marginBottom: 14}}><Icon name="alert" /><div>{p.problem}</div></div>}
      {p.notes.map((n) => <div key={n} className="notice" style={{marginBottom: 14}}><Icon name="alert" /><div>{n}</div></div>)}
      <SettingSection title="Who it is" help="An agent starts this profile by its name, and reads When it is used to decide when.">
        <SettingRow label="Name" help={isNew ? "Letters, digits, dashes and underscores. It cannot change later." : "Fixed: agents start the profile by it"} changed={ch("name")} error={errors.name}>{isNew ? <input type="text" aria-label="Name" value={v.name} placeholder="release-checker" onChange={(e) => d.set("name", e.target.value.trim())} /> : <input type="text" aria-label="Name" value={p.name} readOnly disabled />}</SettingRow>
        <div className={"srow stack" + (errors.title ? " refused" : "")}><div><div className="lab">Title{ch("title") && <i title="Changed, not saved" />}</div></div><div className="ctl"><input type="text" aria-label="Title" value={v.title} placeholder="Release checker" onChange={(e) => d.set("title", e.target.value)} /></div></div>
        <div className={"srow stack" + (errors.description ? " refused" : "")}><div><div className="lab">When it is used{ch("description") && <i title="Changed, not saved" />}</div><p className="help" style={{margin: "2px 0 0", color: "var(--text-3)", fontSize: 12}}>{help("One line the agent reads", "description", "")}</p>{errors.description && <p className="row-error" role="alert">{errors.description}</p>}</div><div className="ctl"><input type="text" aria-label="When it is used" value={v.description} placeholder="Runs the release sequence and reports what is missing" onChange={(e) => d.set("description", e.target.value)} /></div></div>
      </SettingSection>
      <SettingSection title="What it is">
        <SettingRow label="Type" help={isNew ? type.started : `Fixed once the profile exists. ${type.started}.`} changed={ch("agent_type")}><select aria-label="Type" value={v.agent_type} disabled={!isNew} onChange={(e) => { d.set("agent_type", e.target.value); if (!typeOf(e.target.value).mayWrite && v.access === "writing") d.set("access", null); }}>{PROFILE_TYPES.map((t) => <option key={t.key} value={t.key}>{t.label}</option>)}</select></SettingRow>
        <SettingRow label="Access" help={type.mayWrite ? help("Whether it may change files", "access", null) : `A ${type.label.toLowerCase()} only reads, so Writing is not offered`} changed={ch("access")}><select aria-label="Access" value={v.access || ""} onChange={(e) => d.set("access", e.target.value || null)}><option value="">As its {base ? "base" : "type"}: {(base?.access || type.access) === "writing" ? "Writing" : "Read-only"}</option><option value="read-only">Read-only</option>{type.mayWrite && <option value="writing">Writing</option>}</select></SettingRow>
        <SettingRow label="Extends" help={p.is_base ? "A base profile extends nothing" : "Starts from that profile; what you set here wins. A profile that extends this one cannot be chosen."} changed={ch("base")}><select aria-label="Extends" value={v.base} disabled={p.is_base} onChange={(e) => d.set("base", e.target.value)}><option value="">Nothing</option>{rows.filter((r) => r.agent_type === v.agent_type && !loop.has(r.name)).map((r) => <option key={r.name} value={r.name}>{r.name}</option>)}</select></SettingRow>
        {type.occupant && <SettingRow label="Conversation" help={help("What the agent does with its conversation when it gets its next job. The agent itself is kept in each case.", "occupant", "when-cold")} changed={ch("occupant")}><select aria-label="Conversation" value={v.occupant} onChange={(e) => d.set("occupant", e.target.value)}>{OCCUPANTS.map(([k, l]) => <option key={k} value={k}>{l}</option>)}</select></SettingRow>}
      </SettingSection>
    </>,
    model: <>
      <SettingSection title="Program" help="The program that runs it, and what happens when that program cannot start.">
        <SettingRow label="Program" help={help("", "program", "")} changed={ch("program")}><select aria-label="Program" value={v.program} onChange={(e) => d.set("program", e.target.value)}><option value="">The parent program</option>{PROFILE_PROGRAMS.map((g) => <option key={g.name} value={g.name} disabled={!g.installed}>{g.title}{g.installed ? "" : " (not installed)"}</option>)}</select></SettingRow>
        <SettingRow label="When it cannot start" help={v.program ? help("Start on another program, and say so, or refuse to start", "preferred_program", true) : "Choose a program first"} changed={ch("preferred_program")}><select aria-label="When it cannot start" value={v.preferred_program ? "try" : "refuse"} disabled={!v.program} onChange={(e) => d.set("preferred_program", e.target.value === "try")}><option value="try">Try another program</option><option value="refuse">Do not start</option></select></SettingRow>
        {v.program && v.preferred_program && <SettingRow label="Programs to try instead" help={help("In this order. None picked tries every other program", "fallback_programs", [])} changed={ch("fallback_programs")}><span className="row" style={{gap: 10, justifyContent: "flex-end"}}>{PROFILE_PROGRAMS.filter((g) => g.name !== v.program).map((g) => <label key={g.name} className="row" style={{gap: 6, fontSize: 12.5, whiteSpace: "nowrap"}}><Switch on={v.fallback_programs.includes(g.name)} onChange={() => d.set("fallback_programs", toggled(v.fallback_programs, g.name))} title={`Try ${g.title}`} />{g.title}</label>)}</span></SettingRow>}
      </SettingSection>
      <SettingSection title="Model" help="A model named for a program wins. Without one, the tier picks that program's model of the tier.">
        <SettingRow label="Tier" help={help(v.tier === "rare" ? "Rare needs a named model below" : "", "tier", null)} changed={ch("tier")} error={errors.tier}><select aria-label="Tier" value={v.tier || ""} onChange={(e) => d.set("tier", e.target.value || null)}>{TIERS.map(([k, l]) => <option key={k} value={k}>{l}</option>)}</select></SettingRow>
        {PROFILE_PROGRAMS.map((g) => <SettingRow key={g.name} label={`Model on ${g.title}`} help={!g.installed ? `${g.title} is not installed here; the model is kept for when it is` : v.program_models[g.name] ? "Named" : v.tier && g.tiers[v.tier] ? `By tier: ${g.tiers[v.tier]}` : help("Its base's", "program_models", {})} changed={ch("program_models") && v.program_models[g.name] !== d.saved.program_models[g.name]}>
          <select aria-label={`Model on ${g.title}`} value={v.program_models[g.name] || ""} onChange={(e) => d.set("program_models", {...v.program_models, [g.name]: e.target.value})}><option value="">{v.tier && v.tier !== "rare" ? "By tier" : "None named"}</option>{g.models.map((m) => <option key={m} value={m}>{m}</option>)}</select></SettingRow>)}
      </SettingSection>
    </>,
    instructions: <>
      {p.module_text_changed && <InstructionsUpdate />}
      {base && <div className="notice" style={{marginBottom: 12}}><Icon name="agent" /><div>It is told the instructions of <RowLink term="profile" id={base.name}>{base.name}</RowLink> first, then these.</div></div>}
      <SettingSection title="What it is told" help="Each time it starts, after the brief from the agent that starts it.">
        <textarea className="pf-text" aria-label="Instructions" value={v.body} spellCheck={false} onChange={(e) => d.set("body", e.target.value)} placeholder="You are a release checker. Follow sequence 31 step by step…" />
        <div className="pf-count"><span>{plural(v.body ? v.body.split("\n").length : 0, "line")}</span><span>·</span><span>{plural(v.body.split(/\s+/).filter(Boolean).length, "word")}</span>{ch("body") && <><span>·</span><span>changed, not saved</span></>}</div>
      </SettingSection>
      <SettingSection title="Instruction files" help="What its own checkout holds beside these instructions.">
        <SettingRow label="Keep the project's instruction files" help={help("Its own checkout keeps the project's instruction files beside the ones written for this profile", "uses_project_instructions", false)} changed={ch("uses_project_instructions")}><Switch on={v.uses_project_instructions} onChange={(x) => d.set("uses_project_instructions", x)} title="Keep the project's instruction files" /></SettingRow>
        {PROFILE_INJECTIONS.map((j) => <SettingRow key={j.key} label={j.title} help={<span className="mono">{j.key}</span>} changed={ch("injections") && (v.injections[j.key] ?? j.default) !== (d.saved.injections[j.key] ?? j.default)}><Switch on={v.injections[j.key] ?? j.default} onChange={(x) => d.set("injections", {...v.injections, [j.key]: x})} title={`Write ${j.title.toLowerCase()} into its instruction files`} /></SettingRow>)}
      </SettingSection>
    </>,
    skills: <>
      <SettingSection title="Skills" help={<>Offered: the agent may read it when it fits. Required: it reads it before its first step. Skills every agent must read are set on the Skills page.</>}>
        <div className="pf-cols"><span>Skill</span><span className="h">Offered</span><span className="h">Required</span><span className="h">Skills page</span></div>
        {PROFILE_SKILLS.map(([name, what]) => { const every = R6_SKILL_WHO[name] === "every" || (R6_SKILL_WHO[name] === "main" && v.agent_type === "main"); return <div key={name} className="pf-skill" title={what}>
          <span className="nm"><RowLink term="skill" id={name}><b>{name}</b></RowLink><span>{what}</span></span>
          <span className="sw"><Switch on={v.skills.includes(name)} onChange={() => { d.set("skills", toggled(v.skills, name)); if (v.skills.includes(name)) d.set("required_skills", v.required_skills.filter((x) => x !== name)); }} title={`Offer ${name}`} /></span>
          <span className="sw"><Switch on={v.required_skills.includes(name)} onChange={() => { d.set("required_skills", toggled(v.required_skills, name)); if (!v.skills.includes(name)) d.set("skills", [...v.skills, name]); }} title={`Require ${name}`} /></span>
          <span className="every">{every ? "read by every agent" : ""}</span>
        </div>; })}
        {p.problem && <p className="row-error" role="alert">journal-release is named in the file but no skill has that name. Saving drops it.</p>}
        <div className="pf-count"><span>{v.skills.length} offered</span><span>·</span><span>{v.required_skills.length} required</span>{inherit("skills", [])}</div>
      </SettingSection>
    </>,
    tools: <>
      <SettingSection title="MCP tools it may call" help={<>Beside the program's own tools, which are set in Settings, Program tools. A tool not listed by an integration stays here until you remove it. {inherit("mcp_tools", [])}</>}>
        {allTools.map((k) => { const i = R6_INTEGRATIONS.find((x) => "mcp__" + x.id.replace("-", "_") === k); return <div key={k} className="pf-tool"><span className="k">{k}</span><span className="w">{i ? <><RowLink term="integration" id={i.id}>{i.title}</RowLink> · {R6_INT_WORDS[i.state]}</> : "No integration offers it now"}</span><Switch on={v.mcp_tools.includes(k)} onChange={() => d.set("mcp_tools", toggled(v.mcp_tools, k))} title={`Let it call ${k}`} /></div>; })}
        <div className="pf-add"><input type="text" aria-label="Another tool name" value={toolWords} placeholder="mcp__sentry" onChange={(e) => setToolWords(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && toolWords.trim()) { d.set("mcp_tools", [...v.mcp_tools, toolWords.trim()]); setToolWords(""); } }} /><Btn small disabled={!toolWords.trim()} onClick={() => { d.set("mcp_tools", [...v.mcp_tools, toolWords.trim()]); setToolWords(""); }}>Add a tool</Btn></div>
      </SettingSection>
      <SettingSection title="Folders it may write" help={writes ? help("Beside its own worktree", "writable_folders", []) : `Only a profile with Writing access writes folders. This one is ${access === "writing" ? "a type that only reads" : "read-only"}: change Access on About.`}>
        {v.writable_folders.map((f) => <div key={f} className="pf-tool"><span className="k">{f}</span><span /><Btn small variant="ghost" disabled={!writes} onClick={() => d.set("writable_folders", v.writable_folders.filter((x) => x !== f))}>Remove</Btn></div>)}
        <div className="pf-add"><input type="text" aria-label="A folder it may write" value={folderWords} disabled={!writes} placeholder="dist" onChange={(e) => setFolderWords(e.target.value)} /><Btn small disabled={!writes || !folderWords.trim()} onClick={() => { d.set("writable_folders", [...v.writable_folders, folderWords.trim()]); setFolderWords(""); }}>Add a folder</Btn></div>
      </SettingSection>
    </>,
    preview: <ProfilePreview v={v} base={base} type={type} access={access} unsaved={d.changed.length} />,
  }[tab];
  return <div className="pf">
    <div className="pf-head">
      <div style={{minWidth: 0}}>
        <div className="pf-meta"><span className="mono">{isNew ? (v.name || "new profile") : p.name}</span>{!isNew && <SourceBadge p={p} />}{p.path && <span className="path" title={p.path}>{p.path}</span>}
          {!isNew && <span>{p.runBy.length ? <>run by {p.runBy.map((n, k) => <React.Fragment key={n}>{k > 0 && ", "}<AgentLink name={n} /></React.Fragment>)} · </> : null}used {plural(p.uses, "time")}, last {p.last}</span>}</div>
        <h2 title={v.title}>{v.title || (isNew ? "New profile" : p.name)}</h2>
        <p title={v.description}>{v.description || "Say when it is used"}</p>
      </div>
      <div className="row" style={{gap: 6}}>
        {startable && <Btn small variant="primary" onClick={() => onStart(p)}>Start a helper</Btn>}
        {actions.length > 0 && <ActionMenu actions={actions} onDone={toast} />}
      </div>
    </div>
    <div className="pf-body">
      <SettingsLayout tabs={tabs} tab={tab} onTab={setTab} draft={isNew ? Math.max(1, d.changed.length) : d.changed.length} failure={failure} onCancel={cancel} onSave={save}>
        {section}
      </SettingsLayout>
    </div>
  </div>;
}

// today's HelperStartForm as a dialog: the job, the program, an idle helper to send it to, and why another one starts
function StartHelperDialog({p, onClose}) {
  const toast = useToast();
  const a = availabilityOf(p.name);
  const [brief, setBrief] = useState("");
  const [program, setProgram] = useState("");
  const [why, setWhy] = useState("");
  const blocked = !a.can_start || !brief.trim() || (a.idle_helpers.length > 0 && !why.trim());
  return <Dialog narrow title={`Start a ${typeOf(p.agent_type).label.toLowerCase()} of ${p.name}`} sub="It reads only, does the job and reports to you" onClose={onClose}
    foot={<div className="foot"><span className="note mono ellipsis" style={{fontSize: 11.5}}>journal helper start --profile {p.name}</span><Btn onClick={onClose}>Cancel</Btn><Btn variant="primary" disabled={blocked} onClick={() => { toast(`helper-852 started with ${p.name}`); onClose(); }}>Start a read-only helper</Btn></div>}>
    <div className="r6-start">
      <label><span>The job</span><textarea rows={4} value={brief} onChange={(e) => setBrief(e.target.value)} placeholder="Read the reminders module and say what the page should show" /></label>
      <label><span>Program</span><select value={program} onChange={(e) => setProgram(e.target.value)}><option value="">The profile's program</option>{a.programs.map((n) => <option key={n} value={n}>{programOf(n).title}</option>)}</select></label>
      {a.idle_helpers.map((h) => <div key={h.id} className="r6-idle"><span><AgentLink name={h.name} /> · Idle, with this profile</span><Btn small disabled={!brief.trim()} onClick={() => { toast(`Job sent to ${h.name}`); onClose(); }}>Send the job</Btn></div>)}
      {a.idle_helpers.length > 0 && <label><span>Why start another helper?</span><input type="text" value={why} onChange={(e) => setWhy(e.target.value)} /></label>}
      {a.fresh_reason && <p className="r6-reason">{a.fresh_reason}</p>}
      {a.reason && <p className="r6-reason" role="alert">{a.reason}</p>}
    </div>
  </Dialog>;
}

function InstructionsUpdate() {
  const [open, setOpen] = useState(false);
  const toast = useToast();
  return <div className="notice" style={{marginBottom: 12, flexDirection: "column", alignItems: "stretch", gap: 8}}>
    <div className="row"><Icon name="star" /><span className="grow">The journal's instructions for this profile have a new version.</span><Btn small variant="ghost" onClick={() => setOpen(!open)}>{open ? "Hide" : "Compare"}</Btn><Btn small onClick={() => toast("The journal's new text is in the editor; save to keep it")}>Take the new version</Btn></div>
    {open && <div className="now-diff"><div className="now-diff-rows">{[["ctx", 1, "You design one screen or flow."], ["del", 2, "Find what the code already shows of it first."], ["add", 2, "Find what the code already shows of it first, then describe the design."], ["add", 3, "Pin the design itself, never a journal document."]].map(([k, n, c], i) => <div key={i} className={"now-drow " + k}><span className="no">{n}</span><span className="sg">{SIGNS[k]}</span><span className="cd">{c}</span></div>)}</div></div>}
  </div>;
}

// Preview: what an agent of this profile starts with, from the draft; one fact a row
function ProfilePreview({v, base, type, access, unsaved}) {
  const project = RULES.filter((r) => r.group === "Active");
  const prog = programOf(v.program || base?.program || "claude-code");
  const told = ["— the brief from the agent that starts it —", "", ...(base ? [`— the instructions of ${base.name} —`, base.body, ""] : []), v.body || "(no instructions of its own)", "", "Read before your first step: " + (v.required_skills.join(", ") || "nothing"), ...(project.length ? ["", "Project rules:", ...project.map((r) => `- ${r.desc}`)] : [])].join("\n");
  return <>
    {unsaved > 0 && <div className="notice" style={{marginBottom: 14}}><Icon name="edit" /><div>With your {plural(unsaved, "unsaved change")}.</div></div>}
    <SettingSection title="What it starts with">
      <Fields rows={[["Program", v.program ? prog.title : `The parent program (${prog.title} here)`], ["Model", `${modelOf(v)}${!v.program_models[prog.name] && v.tier ? ` (the ${v.tier} tier)` : ""}`], ["Access", access === "writing" ? "Writing" : "Read-only"], ...(type.occupant ? [["Conversation", OCCUPANTS.find(([k]) => k === v.occupant)[1]]] : []), ["MCP tools", v.mcp_tools.length ? v.mcp_tools.join(", ") : "None"], ["Folders it writes", access === "writing" && v.writable_folders.length ? v.writable_folders.join(", ") : "Its worktree only"], ["Instruction files", v.uses_project_instructions ? "The project's, and its own" : "Its own only"], ["Reports to", type.reports ? "The agent that starts it" : "You"], ["Messages other agents", type.siblings ? "Yes, its siblings" : "No"]]} />
    </SettingSection>
    <SettingSection title="Skills it reads first"><div className="pf-chips">{v.required_skills.length ? v.required_skills.map((s) => <RowLink key={s} term="skill" id={s}><span className="chip">{s}</span></RowLink>) : <span className="muted">None</span>}</div><div className="pf-count"><span>and {Math.max(0, v.skills.length - v.required_skills.length)} more offered</span></div></SettingSection>
    <SettingSection title="What it is told" help="In this order, each time it starts"><pre className="pf-preview">{told}</pre></SettingSection>
  </>;
}

Object.assign(window, {ProfilesPage, ProfileEditor, StartHelperDialog, PROFILE_START, PROFILE_TYPES, PROFILE_PROGRAMS});
