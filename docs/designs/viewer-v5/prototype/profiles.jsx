// The Profiles page and the profile editor, round six (report 1383 §1, §3, §5-7, §15; doc 1276 §1-2, §9), with the round-seventeen words.
// The editor holds exactly what AgentProfile holds (src/engine/profile/agent_profile.py) and what the file overlays (profile_format.py OVERLAID_FIELDS).
// Nothing new: no effort, no rules per profile, no limits. Those stay in the agent settings and on the Rules page.
// Today's panel keeps what it does: Start a helper (HelperStartForm.vue, the availability read), a locked type, the declared types and programs.
// The list groups by type, so a row never says its type again. Every field of the editor is one layout: its label over a full-width control.
// No help sentence under a field: a field says only what it takes from its base, or the one fact it needs.

/* ---------- what the reads give (profiles.profiles: types, programs, injections, profiles, availability, usage) ---------- */
const PROFILE_TYPES = [
  {key: "main", label: "Main agent", group: "Main agents", mayWrite: true, occupant: false, access: "writing", reports: false, siblings: false},
  {key: "worker", label: "Worker", group: "Workers", mayWrite: true, occupant: true, access: "writing", reports: true, siblings: true},
  {key: "helper", label: "Helper", group: "Helpers", mayWrite: false, occupant: true, access: "read-only", reports: true, siblings: false},
  {key: "reviewer", label: "Reviewer", group: "Reviewers", mayWrite: false, occupant: true, access: "read-only", reports: true, siblings: false},
];
const typeOf = (k) => PROFILE_TYPES.find((t) => t.key === k) || PROFILE_TYPES[2];
const PROFILE_PROGRAMS = [
  {name: "claude-code", title: "Claude Code", installed: true, models: ["Opus 5.5", "Sonnet 5.5", "Haiku 5.5", "Fable 5.2"], tiers: {fast: "Haiku 5.5", general: "Sonnet 5.5", strongest: "Opus 5.5"}},
  {name: "codex", title: "Codex", installed: false, models: ["gpt-5.5-codex", "gpt-5.5-codex-mini"], tiers: {fast: "gpt-5.5-codex-mini", general: "gpt-5.5-codex", strongest: "gpt-5.5-codex"}},
];
const programOf = (n) => PROFILE_PROGRAMS.find((p) => p.name === n);
const PROFILE_INJECTIONS = [{key: "journal", title: "Journal part", default: true}, {key: "commandments", title: "Commandments index", default: true}];
const OCCUPANTS = [["continue", "Resume it"], ["when-cold", "Start over after a long pause"], ["each-launch", "New for each job"]];
// the server refuses rare in a profile (ModelTier.automatic), so it is not offered
const TIERS = [["", "None"], ["fast", "Fast"], ["general", "General"], ["strongest", "Strongest"]];
const PROFILE_SKILLS = [...SKILLS.map((s) => [s.id, s.desc]), ["journal-workers", "Send a worker, and work as one"], ["journal-helpers", "Start a helper for a bounded read"], ["journal-plans", "Ordered tasks and their phases"], ["journal-memory", "Keep what matters past the context"]];
const FIELD_LABELS = {title: "Title", description: "Use", body: "Instructions", base: "Extends", agent_type: "Type", access: "Access", program: "Program", preferred_program: "When it cannot start", fallback_programs: "Fallbacks", program_models: "Models", tier: "Tier", occupant: "Conversation", mcp_tools: "Tools", writable_folders: "Folders", uses_project_instructions: "Project instruction files", injections: "Injections", skills: "Skills offered", required_skills: "Skills required", default_fields: "Defaults over the base", name: "Name"};

const P = (o) => ({title: "", description: "", body: "", base: "", agent_type: "helper", is_base: false, access: null, program: "", preferred_program: true, fallback_programs: [], program_models: {}, tier: null, occupant: "when-cold", mcp_tools: [], writable_folders: [], uses_project_instructions: false, injections: {}, skills: [], required_skills: [], default_fields: [], module: "", path: "", changed: [], module_text_changed: false, problem: "", notes: [], uses: 0, last: "never", runBy: [], ...o});
const PROFILE_START = [
  P({name: "journal-main", title: "Main agent", description: "The agent you talk to: it plans, hands out work and answers you", agent_type: "main", module: "journal.core.agents", occupant: "continue", program: "claude-code", program_models: {"claude-code": "Opus 5.5"}, tier: "strongest", skills: ["journal", "journal-tasks", "journal-documents", "journal-workers", "journal-helpers", "journal-plans", "journal-memory"], required_skills: ["journal", "journal-tasks"], mcp_tools: ["mcp__github", "mcp__linear"], uses: 212, last: "now", runBy: ["main"], body: "You are the main agent of this project.\n\nRead the overview first. Plan the work the user asks for, hand tasks to workers, and answer the user in the chat in plain words."}),
  P({name: "journal-worker", title: "Worker", description: "Writes code for one task in its own worktree", agent_type: "worker", module: "suites.coding.workers", changed: ["program_models", "tier"], program: "claude-code", fallback_programs: ["codex"], program_models: {"claude-code": "Sonnet 5.5"}, tier: "general", skills: ["journal", "journal-tasks", "journal-workers"], required_skills: ["journal", "journal-tasks", "journal-workers"], mcp_tools: ["mcp__github"], uses: 96, last: "5 min ago", runBy: ["worker-4", "worker-7"], body: "You are a worker. Take the task you were given, build it in your worktree, prove it with its tests and hand it to the merger."}),
  P({name: "journal-worker-senior", title: "Senior worker", description: "A worker for tasks of complexity 4 and 5", agent_type: "worker", module: "suites.coding.workers", base: "journal-worker", program: "claude-code", program_models: {"claude-code": "Opus 5.5"}, tier: "strongest", skills: ["journal", "journal-tasks", "journal-workers"], required_skills: ["journal", "journal-tasks", "journal-workers"], mcp_tools: ["mcp__github"], uses: 31, last: "1 h ago", body: "Take extra care with the architecture: read the commandments the task touches before you write."}),
  P({name: "journal-designer", title: "Designer", description: "Designs one screen or flow in Claude Design", agent_type: "helper", module: "journal.core.profiles", module_text_changed: true, base: "journal-base-helper", occupant: "each-launch", tier: "strongest", skills: ["journal", "journal-documents", "commandments-plain-viewer-text"], required_skills: ["journal", "journal-documents"], mcp_tools: ["mcp__claude_design"], uses: 14, last: "now", runBy: ["helper-851"], injections: {commandments: false}, notes: ["Offered only while the Claude Design integration is on"], body: "You design one screen or flow. Find what the code already shows of it first, then describe the design: what a user sees and does, each state, and what could go wrong."}),
  P({name: "journal-researcher", title: "Researcher", description: "Answers one question by reading code, documents and the web", agent_type: "helper", module: "journal.core.profiles", base: "journal-base-helper", occupant: "each-launch", tier: "general", skills: ["journal", "journal-documents"], required_skills: ["journal"], uses: 48, last: "yesterday", body: "Answer the question you were given. File a report with the files and lines that show each point."}),
  P({name: "journal-code-reviewer", title: "Code reviewer", description: "Reviews a worker's change before it is merged", agent_type: "reviewer", module: "suites.coding.reviews", occupant: "each-launch", tier: "strongest", skills: ["journal", "commandments-vue-vue-components"], required_skills: ["journal"], uses: 40, last: "3 h ago", runBy: ["reviewer-3"], body: "Review the change against the task and the commandments. File a report."}),
  P({name: "journal-base-helper", title: "Base helper", description: "What every helper starts from; never started on its own", agent_type: "helper", module: "journal.core.profiles", is_base: true, occupant: "each-launch", tier: "general", skills: ["journal"], required_skills: ["journal"], body: "You are a helper: you do one bounded job for the agent that started you, then report."}),
  P({name: "critic", title: "Critic", description: "Reads a design and argues against it, point by point", agent_type: "helper", path: ".agents/profiles/critic.md", base: "journal-researcher", occupant: "each-launch", tier: "strongest", default_fields: ["mcp_tools"], skills: ["journal", "journal-documents"], required_skills: ["journal"], uses_project_instructions: true, body: "Argue against the design you are given. Each point names what breaks and for whom."}),
  P({name: "release_checker", title: "Release checker", description: "Runs the release sequence and reports what is missing", agent_type: "worker", path: ".agents/profiles/release_checker.md", problem: "Unknown skill journal-release", base: "journal-worker", occupant: "each-launch", program: "claude-code", preferred_program: false, tier: "general", writable_folders: ["dist", "CHANGELOG.md"], skills: ["journal", "journal-tasks"], required_skills: ["journal"], uses: 3, last: "4 days ago", runBy: ["worker-7"], body: "Follow sequence 31 step by step."}),
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
const modelOf = (v) => { const prog = programOf(v.program || "claude-code"); return v.program_models[prog.name] || (v.tier && prog.tiers[v.tier]) || "base model"; };
const toggled = (list, item) => (list.includes(item) ? list.filter((x) => x !== item) : [...list, item]);
const plural = (n, one, many = one + "s") => `${n} ${n === 1 ? one : many}`;
// the profiles an extends would loop through: this one and every profile that extends it
const descendants = (rows, name) => { const out = new Set([name]); let grew = true; while (grew) { grew = false; for (const r of rows) if (r.base && out.has(r.base) && !out.has(r.name)) { out.add(r.name); grew = true; } } return out; };
// today's availability read, per profile and program (HelperStartForm.vue)
const AVAILABILITY = {
  "journal-designer": {can_start: true, reason: "", programs: ["claude-code"], idle_helpers: [{id: 12, name: "helper-851"}], can_start_fresh: true, fresh_reason: ""},
  "journal-code-reviewer": {can_start: false, reason: "3 of 3 reviewers running", programs: ["claude-code"], idle_helpers: [], can_start_fresh: false, fresh_reason: ""},
};
const availabilityOf = (name) => AVAILABILITY[name] || {can_start: true, reason: "", programs: ["claude-code"], idle_helpers: [], can_start_fresh: true, fresh_reason: ""};

function useProfileDraft(initial) {
  const [saved, setSaved] = useState(initial);
  const [now, setNow] = useState(initial);
  const changed = EDIT_KEYS.filter((k) => JSON.stringify(now[k]) !== JSON.stringify(saved[k]));
  return {v: now, saved, changed, set: (k, val) => setNow((n) => ({...n, [k]: val})), save: (refused = []) => setSaved((s) => ({...now, ...Object.fromEntries(refused.map((k) => [k, s[k]]))})), cancel: () => setNow(saved)};
}

/* ---------- the page ---------- */
const PF_FIELDS = [
  {key: "source", label: "Source", options: [["journal", "Journal"], ["project", "Project"]], get: (i) => (i.p.module ? "journal" : "project")},
  {key: "type", label: "Type", options: PROFILE_TYPES.map((t) => [t.key, t.label]), get: (i) => i.p.agent_type},
  {key: "state", label: "State", options: [["changed", "Changed"], ["problem", "Problem"], ["base", "Base"], ["running", "Running"]], get: (i) => [i.p.changed.length && "changed", i.p.problem && "problem", i.p.is_base && "base", i.p.runBy.length && "running"].filter(Boolean)},
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
  const reset = (p) => { const start = PROFILE_START.find((r) => r.name === p.name); setRows(rows.map((r) => r.name === p.name ? {...start, changed: [], uses: r.uses} : r)); toast(`${p.name} reset`); };
  const remove = (p) => { setRows(rows.filter((r) => r.name !== p.name)); setChosen(rows[0].name); toast(`Profile ${p.name} removed`); };
  const listed = [...(fresh ? [{...fresh, name: "__new"}] : []), ...rows];
  // the group names the type, so a row says its model and its skills
  const items = listed.map((p) => ({id: p.name, title: p.name === "__new" ? (fresh.title || "New profile") : p.name, desc: p.name === "__new" ? "Not saved" : `${modelOf(p)} · ${plural(p.skills.length, "skill")}`, group: p.name === "__new" ? "New" : p.is_base ? "Base profiles" : typeOf(p.agent_type).group, p}));
  const newMenu = <Menu width={280} button={({toggle, open}) => <button type="button" className={"btn small primary menu-btn" + (open ? " on" : "")} aria-haspopup="menu" aria-expanded={open} onClick={toggle}><span>New profile</span><Icon name="down" size={11} /></button>}>{(close) => <>
    <MenuItem icon="plus" onClick={() => { close(); startNew(null); }}>Blank</MenuItem>
    <div className="menu-sep" /><div className="menu-label">Extend</div>
    {rows.filter((r) => r.module).map((r) => <MenuItem key={r.name} icon="agent" desc={r.description} onClick={() => { close(); startNew(r.name); }}>{r.name}</MenuItem>)}
  </>}</Menu>;
  return <>
    <ListPage title="Profiles" header={newMenu} fields={PF_FIELDS} rows={items} chosen={chosen} onChoose={choose} listWidth={320}
      textOf={(i) => `${i.id} ${i.p.title} ${i.p.description}`} pickLine="No profile chosen"
      renderMeta={(i) => <span className="pf-list-meta">{i.p.name === "__new" ? <span className="badge-quiet">New</span> : <SourceBadge p={i.p} list />}</span>}
      renderReader={(i) => <ProfileEditor key={i.id} p={i.p} rows={rows} guard={holder} onSave={saveRow} onReset={reset} onRemove={remove} onDuplicate={duplicate} onStart={setStarting} onDrop={() => { setFresh(null); setChosen(rows[0].name); }} />} />
    {leaving && <LeaveDialog count={leaving.count} onStay={() => setLeaving(null)} onDiscard={() => { leaving.discard(); holder.current = null; setLeaving(null); leaving.then(); }} onSave={() => { const ok = leaving.save(); setLeaving(null); if (ok) { holder.current = null; leaving.then(); } }} />}
    {starting && <StartHelperDialog p={starting} onClose={() => setStarting(null)} />}
  </>;
}

/* ---------- one field: its label (and what it takes from its base) over a full-width control ---------- */
function PfField({label, help, changed, error, children}) {
  return <div className={"srow stack" + (error ? " refused" : "")}><div><div className="lab">{label}{changed && <i title="Changed" />}</div>{help && <p className="help" style={{margin: "2px 0 0", color: "var(--text-3)", fontSize: 12}}>{help}</p>}{error && <p className="row-error" role="alert">{error}</p>}</div><div className="ctl">{children}</div></div>;
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
    name: (x) => (!isNew ? null : !/^[A-Za-z0-9_-]+$/.test(x) ? "Letters, digits, dashes and underscores" : rows.some((r) => r.name === x) ? "Name taken" : null),
    description: (x) => (!x.trim() ? "Required" : null),
  };
  const save = () => {
    const keys = isNew ? EDIT_KEYS : d.changed;
    const refused = keys.filter((k) => refusalOf[k]?.(v[k]));
    setErrors(Object.fromEntries(refused.map((k) => [k, refusalOf[k](v[k])])));
    if (refused.length) { setFailure(isNew ? `Not made · ${plural(refused.length, "field")} to fix` : `${keys.length - refused.length} saved · ${refused.length} refused`); setTab(tabOfKey(refused[0])); if (!isNew) { d.save(refused); onSave(p, {...d.saved, ...Object.fromEntries(keys.filter((k) => !refused.includes(k)).map((k) => [k, v[k]]))}, keys.filter((k) => !refused.includes(k))); } return false; }
    setFailure(null); const changedKeys = d.changed; d.save(); onSave(p, v, changedKeys); return true;
  };
  const cancel = () => { d.cancel(); setErrors({}); setFailure(null); if (isNew) onDrop(); };
  // a new draft is guarded as soon as anything is typed in it, the same as a changed profile
  useEffect(() => { guard.current = d.changed.length ? {count: d.changed.length, save, discard: cancel} : null; return () => { guard.current = null; }; });
  const startable = (type.key === "helper" || type.key === "reviewer") && !p.is_base && !isNew;
  const actions = isNew ? [] : [
    {group: "Profile", label: "Duplicate", icon: "copy", run: () => { onDuplicate(p); return false; }},
    ...(p.module && p.changed.length ? [{group: "Profile", label: "Changes", icon: "edit", desc: p.changed.map((k) => FIELD_LABELS[k]).join(", "), run: () => { setTab(tabOfKey(p.changed[0])); return false; }}] : []),
    ...(p.module && (p.changed.length || p.module_text_changed) ? [{group: "Danger", label: "Journal version", icon: "back", danger: true, field: {label: "Reason"}, confirm: "Reset", run: () => { onReset(p); }}] : []),
    ...(!p.module ? [{group: "Danger", label: "Remove", icon: "trash", danger: true, field: {label: "Reason"}, confirm: "Remove", run: () => (p.runBy.length ? `${p.runBy.join(", ")} running` : onRemove(p))}] : []),
  ];
  const tabs = PROFILE_TABS.map((t) => ({key: t.key, label: t.keys.some(ch) ? <>{t.label}<i className="pf-dot" title="Changed" /></> : t.label}));
  // what a field takes from its base, and the way to set it to its default over the base (default_fields)
  const inherit = (k, empty) => {
    if (!base) return null;
    if (v.default_fields.includes(k)) return <span className="pf-inherit">default, not {base.name}'s<button type="button" onClick={() => d.set("default_fields", v.default_fields.filter((x) => x !== k))}>Use {base.name}'s</button></span>;
    if (JSON.stringify(base[k]) === JSON.stringify(v[k])) return <span className="pf-inherit">as in {base.name}<button type="button" onClick={() => { d.set("default_fields", [...v.default_fields, k]); d.set(k, empty); }}>Default</button></span>;
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
      <SettingSection title="Identity">
        <PfField label="Name" help={isNew ? "Letters, digits, dashes, underscores" : null} changed={ch("name")} error={errors.name}>{isNew ? <input type="text" aria-label="Name" value={v.name} placeholder="release-checker" onChange={(e) => d.set("name", e.target.value.trim())} /> : <input type="text" aria-label="Name" className="mono" value={p.name} readOnly disabled />}</PfField>
        <PfField label="Title" changed={ch("title")} error={errors.title}><input type="text" aria-label="Title" value={v.title} placeholder="Release checker" onChange={(e) => d.set("title", e.target.value)} /></PfField>
        <PfField label="Use" help={help("", "description", "")} changed={ch("description")} error={errors.description}><input type="text" aria-label="Use" value={v.description} placeholder="Runs the release sequence and reports what is missing" onChange={(e) => d.set("description", e.target.value)} /></PfField>
      </SettingSection>
      <SettingSection title="Type">
        <PfField label="Type" changed={ch("agent_type")}><select aria-label="Type" value={v.agent_type} disabled={!isNew} onChange={(e) => { d.set("agent_type", e.target.value); if (!typeOf(e.target.value).mayWrite && v.access === "writing") d.set("access", null); }}>{PROFILE_TYPES.map((t) => <option key={t.key} value={t.key}>{t.label}</option>)}</select></PfField>
        <PfField label="Access" help={type.mayWrite ? help("", "access", null) : "Read-only type"} changed={ch("access")}><select aria-label="Access" value={v.access || ""} onChange={(e) => d.set("access", e.target.value || null)}><option value="">Default · {(base?.access || type.access) === "writing" ? "Writing" : "Read-only"}</option><option value="read-only">Read-only</option>{type.mayWrite && <option value="writing">Writing</option>}</select></PfField>
        <PfField label="Extends" changed={ch("base")}><select aria-label="Extends" value={v.base} disabled={p.is_base} onChange={(e) => d.set("base", e.target.value)}><option value="">Nothing</option>{rows.filter((r) => r.agent_type === v.agent_type && !loop.has(r.name)).map((r) => <option key={r.name} value={r.name}>{r.name}</option>)}</select></PfField>
        {type.occupant && <PfField label="Conversation" help={help("", "occupant", "when-cold")} changed={ch("occupant")}><select aria-label="Conversation" value={v.occupant} onChange={(e) => d.set("occupant", e.target.value)}>{OCCUPANTS.map(([k, l]) => <option key={k} value={k}>{l}</option>)}</select></PfField>}
      </SettingSection>
    </>,
    model: <>
      <SettingSection title="Program">
        <PfField label="Program" help={help("", "program", "")} changed={ch("program")}><select aria-label="Program" value={v.program} onChange={(e) => d.set("program", e.target.value)}><option value="">Parent's</option>{PROFILE_PROGRAMS.map((g) => <option key={g.name} value={g.name} disabled={!g.installed}>{g.title}{g.installed ? "" : " · not installed"}</option>)}</select></PfField>
        <PfField label="When it cannot start" help={help("", "preferred_program", true)} changed={ch("preferred_program")}><select aria-label="When it cannot start" value={v.preferred_program ? "try" : "refuse"} disabled={!v.program} onChange={(e) => d.set("preferred_program", e.target.value === "try")}><option value="try">Try another program</option><option value="refuse">Do not start</option></select></PfField>
        {v.program && v.preferred_program && <PfField label="Fallbacks" help={help("In order", "fallback_programs", [])} changed={ch("fallback_programs")}><span className="row" style={{gap: 10}}>{PROFILE_PROGRAMS.filter((g) => g.name !== v.program).map((g) => <label key={g.name} className="row" style={{gap: 6, fontSize: 12.5, whiteSpace: "nowrap"}}><Switch on={v.fallback_programs.includes(g.name)} onChange={() => d.set("fallback_programs", toggled(v.fallback_programs, g.name))} title={g.title} />{g.title}</label>)}</span></PfField>}
      </SettingSection>
      <SettingSection title="Model">
        <PfField label="Tier" help={help("", "tier", null)} changed={ch("tier")} error={errors.tier}><select aria-label="Tier" value={v.tier || ""} onChange={(e) => d.set("tier", e.target.value || null)}>{TIERS.map(([k, l]) => <option key={k} value={k}>{l}</option>)}</select></PfField>
        {PROFILE_PROGRAMS.map((g) => <PfField key={g.name} label={g.title} help={!g.installed ? "Not installed" : v.program_models[g.name] ? null : v.tier && g.tiers[v.tier] ? `Tier · ${g.tiers[v.tier]}` : help("", "program_models", {})} changed={ch("program_models") && v.program_models[g.name] !== d.saved.program_models[g.name]}>
          <select aria-label={`Model on ${g.title}`} value={v.program_models[g.name] || ""} onChange={(e) => d.set("program_models", {...v.program_models, [g.name]: e.target.value})}><option value="">{v.tier ? "By tier" : "None"}</option>{g.models.map((m) => <option key={m} value={m}>{m}</option>)}</select></PfField>)}
      </SettingSection>
    </>,
    instructions: <>
      {p.module_text_changed && <InstructionsUpdate />}
      {base && <div className="notice" style={{marginBottom: 12}}><Icon name="agent" /><div>After <RowLink term="profile" id={base.name}>{base.name}</RowLink></div></div>}
      <SettingSection title="Instructions">
        <textarea className="pf-text" aria-label="Instructions" value={v.body} spellCheck={false} onChange={(e) => d.set("body", e.target.value)} placeholder="You are a release checker. Follow sequence 31 step by step…" />
        <div className="pf-count"><span>{plural(v.body ? v.body.split("\n").length : 0, "line")}</span><span>·</span><span>{plural(v.body.split(/\s+/).filter(Boolean).length, "word")}</span>{ch("body") && <><span>·</span><span>changed</span></>}</div>
      </SettingSection>
      <SettingSection title="Instruction files">
        <SettingRow label="Project instruction files" help={help("", "uses_project_instructions", false)} changed={ch("uses_project_instructions")}><Switch on={v.uses_project_instructions} onChange={(x) => d.set("uses_project_instructions", x)} title="Project instruction files" /></SettingRow>
        {PROFILE_INJECTIONS.map((j) => <SettingRow key={j.key} label={j.title} help={<span className="mono">{j.key}</span>} changed={ch("injections") && (v.injections[j.key] ?? j.default) !== (d.saved.injections[j.key] ?? j.default)}><Switch on={v.injections[j.key] ?? j.default} onChange={(x) => d.set("injections", {...v.injections, [j.key]: x})} title={j.title} /></SettingRow>)}
      </SettingSection>
    </>,
    skills: <>
      <SettingSection title="Skills">
        <div className="pf-cols"><span>Skill</span><span className="h">Offered</span><span className="h">Required</span><span className="h">Skills page</span></div>
        {PROFILE_SKILLS.map(([name, what]) => { const every = R6_SKILL_WHO[name] === "every" || (R6_SKILL_WHO[name] === "main" && v.agent_type === "main"); return <div key={name} className="pf-skill">
          <span className="nm"><RowLink term="skill" id={name}><b>{name}</b></RowLink><span>{what}</span></span>
          <span className="sw"><Switch on={v.skills.includes(name)} onChange={() => { d.set("skills", toggled(v.skills, name)); if (v.skills.includes(name)) d.set("required_skills", v.required_skills.filter((x) => x !== name)); }} title={`Offer ${name}`} /></span>
          <span className="sw"><Switch on={v.required_skills.includes(name)} onChange={() => { d.set("required_skills", toggled(v.required_skills, name)); if (!v.skills.includes(name)) d.set("skills", [...v.skills, name]); }} title={`Require ${name}`} /></span>
          <span className="every">{every ? "every agent" : ""}</span>
        </div>; })}
        {p.problem && <p className="row-error" role="alert">journal-release: no such skill · dropped on save</p>}
        <div className="pf-count"><span>{v.skills.length} offered</span><span>·</span><span>{v.required_skills.length} required</span>{inherit("skills", [])}</div>
      </SettingSection>
    </>,
    tools: <>
      <SettingSection title="MCP tools" help={inherit("mcp_tools", [])}>
        {allTools.map((k) => { const i = R6_INTEGRATIONS.find((x) => "mcp__" + x.id.replace("-", "_") === k); return <div key={k} className="pf-tool"><span className="k">{k}</span><span className="w">{i ? <><RowLink term="integration" id={i.id}>{i.title}</RowLink> · {R6_INT_WORDS[i.state]}</> : "—"}</span><Switch on={v.mcp_tools.includes(k)} onChange={() => d.set("mcp_tools", toggled(v.mcp_tools, k))} title={k} /></div>; })}
        <div className="pf-add"><input type="text" aria-label="Tool" value={toolWords} placeholder="mcp__sentry" onChange={(e) => setToolWords(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && toolWords.trim()) { d.set("mcp_tools", [...v.mcp_tools, toolWords.trim()]); setToolWords(""); } }} /><Btn small disabled={!toolWords.trim()} onClick={() => { d.set("mcp_tools", [...v.mcp_tools, toolWords.trim()]); setToolWords(""); }}>Add</Btn></div>
      </SettingSection>
      <SettingSection title="Folders" help={writes ? help("Beside its worktree", "writable_folders", []) : "Read-only"}>
        {v.writable_folders.map((f) => <div key={f} className="pf-tool"><span className="k">{f}</span><span /><Btn small variant="ghost" disabled={!writes} onClick={() => d.set("writable_folders", v.writable_folders.filter((x) => x !== f))}>Remove</Btn></div>)}
        <div className="pf-add"><input type="text" aria-label="Folder" value={folderWords} disabled={!writes} placeholder="dist" onChange={(e) => setFolderWords(e.target.value)} /><Btn small disabled={!writes || !folderWords.trim()} onClick={() => { d.set("writable_folders", [...v.writable_folders, folderWords.trim()]); setFolderWords(""); }}>Add</Btn></div>
      </SettingSection>
    </>,
    preview: <ProfilePreview v={v} base={base} type={type} access={access} unsaved={d.changed.length} />,
  }[tab];
  return <div className="pf">
    <div className="pf-head">
      <div style={{minWidth: 0}}>
        <div className="pf-meta"><span className="mono">{isNew ? (v.name || "new profile") : p.name}</span>{!isNew && <SourceBadge p={p} />}{p.path && <span className="path" title={p.path}>{p.path}</span>}
          {!isNew && p.runBy.map((n) => <R16Agent key={n} name={n} />)}{!isNew && <span>{plural(p.uses, "use")} · {p.last}</span>}</div>
        <h2 title={v.title}>{v.title || (isNew ? "New profile" : p.name)}</h2>
        <p title={v.description}>{v.description || "—"}</p>
      </div>
      <div className="row" style={{gap: 6}}>
        {startable && <Btn small variant="primary" onClick={() => onStart(p)}>Start</Btn>}
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
  return <Dialog narrow title={`Start ${p.name}`} onClose={onClose}
    foot={<div className="foot"><span className="note mono ellipsis" style={{fontSize: 11.5}}>journal helper start --profile {p.name}</span><Btn onClick={onClose}>Cancel</Btn><Btn variant="primary" disabled={blocked} onClick={() => { toast(`helper-852 started with ${p.name}`); onClose(); }}>Start</Btn></div>}>
    <div className="r6-start">
      <label><span>Job</span><textarea rows={4} value={brief} onChange={(e) => setBrief(e.target.value)} placeholder="Read the reminders module and say what the page should show" /></label>
      <label><span>Program</span><select value={program} onChange={(e) => setProgram(e.target.value)}><option value="">Profile's</option>{a.programs.map((n) => <option key={n} value={n}>{programOf(n).title}</option>)}</select></label>
      {a.idle_helpers.map((h) => <div key={h.id} className="r6-idle"><span className="r8-facts"><R16Agent name={h.name} /><span>idle</span></span><Btn small disabled={!brief.trim()} onClick={() => { toast(`Job sent to ${h.name}`); onClose(); }}>Send</Btn></div>)}
      {a.idle_helpers.length > 0 && <label><span>Reason for another</span><input type="text" value={why} onChange={(e) => setWhy(e.target.value)} /></label>}
      {a.fresh_reason && <p className="r6-reason">{a.fresh_reason}</p>}
      {a.reason && <p className="r6-reason" role="alert">{a.reason}</p>}
    </div>
  </Dialog>;
}

function InstructionsUpdate() {
  const [open, setOpen] = useState(false);
  const toast = useToast();
  return <div className="notice" style={{marginBottom: 12, flexDirection: "column", alignItems: "stretch", gap: 8}}>
    <div className="row"><Icon name="info" /><span className="grow">New journal version</span><Btn small variant="ghost" onClick={() => setOpen(!open)}>{open ? "Hide" : "Compare"}</Btn><Btn small onClick={() => toast("New text in the editor")}>Take</Btn></div>
    {open && <div className="now-diff"><div className="now-diff-rows">{[["ctx", 1, "You design one screen or flow."], ["del", 2, "Find what the code already shows of it first."], ["add", 2, "Find what the code already shows of it first, then describe the design."], ["add", 3, "Pin the design itself, never a journal document."]].map(([k, n, c], i) => <div key={i} className={"now-drow " + k}><span className="no">{n}</span><span className="sg">{SIGNS[k]}</span><span className="cd">{c}</span></div>)}</div></div>}
  </div>;
}

// Preview: what an agent of this profile starts with, from the draft; one fact a row
function ProfilePreview({v, base, type, access, unsaved}) {
  const project = RULES.filter((r) => r.group === "Active");
  const prog = programOf(v.program || base?.program || "claude-code");
  const told = ["— the brief from the agent that starts it —", "", ...(base ? [`— the instructions of ${base.name} —`, base.body, ""] : []), v.body || "(no instructions of its own)", "", "Read before your first step: " + (v.required_skills.join(", ") || "nothing"), ...(project.length ? ["", "Project rules:", ...project.map((r) => `- ${r.desc}`)] : [])].join("\n");
  return <>
    {unsaved > 0 && <div className="notice" style={{marginBottom: 14}}><Icon name="edit" /><div>{plural(unsaved, "unsaved change")}</div></div>}
    <SettingSection title="Starts with">
      <Fields rows={[["Program", v.program ? prog.title : `Parent's · ${prog.title}`], ["Model", `${modelOf(v)}${!v.program_models[prog.name] && v.tier ? ` · ${v.tier} tier` : ""}`], ["Access", access === "writing" ? "Writing" : "Read-only"], ...(type.occupant ? [["Conversation", OCCUPANTS.find(([k]) => k === v.occupant)[1]]] : []), ["MCP tools", v.mcp_tools.length ? v.mcp_tools.join(", ") : "—"], ["Folders", access === "writing" && v.writable_folders.length ? v.writable_folders.join(", ") : "Worktree"], ["Instruction files", v.uses_project_instructions ? "Project and own" : "Own"], ["Reports to", type.reports ? "Its parent" : "You"], ["Messages", type.siblings ? "Siblings" : "—"]]} />
    </SettingSection>
    <SettingSection title="Required skills"><div className="pf-chips">{v.required_skills.length ? v.required_skills.map((s) => <RowLink key={s} term="skill" id={s}><span className="chip">{s}</span></RowLink>) : <span className="muted">—</span>}</div><div className="pf-count"><span>{Math.max(0, v.skills.length - v.required_skills.length)} more offered</span></div></SettingSection>
    <SettingSection title="Instructions"><pre className="pf-preview">{told}</pre></SettingSection>
  </>;
}

Object.assign(window, {ProfilesPage, ProfileEditor, StartHelperDialog, PROFILE_START, PROFILE_TYPES, PROFILE_PROGRAMS, plural, PF_FIELDS, TIERS});
