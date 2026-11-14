// Round six, part 3: Settings searches every row and holds the agent settings inline (report 1383 §13, doc 1276 §2, §9),
// and the plan focus (report 1383 §14, doc 1276 §8). Replaces by name: SettingsPage, useFocus, PlansWithFocus. FocusFact is round-seven.jsx's.
// Round seventeen: no help sentence under a row, a section or a page; one icon per section; the Plans window says a state only when it needs you.

/* ---------- Settings: one list of sections, each with its scope; every control is in the draft; the search goes over every row ---------- */
const R6_SETTINGS = [
  {title: "Viewer"},
  {key: "look", label: "Look and layout", icon: "grid", scope: "This browser", rows: [
    {key: "theme", label: "Colour scheme", kind: "select", options: ["Dark", "Light", "Follow the system"], value: "Dark"},
    {key: "density", label: "Density", help: "16 px or 12 px insets", kind: "select", options: ["Comfortable", "Compact"], value: "Comfortable"},
    {key: "inspector", label: "Opens in", kind: "select", options: ["Beside the page", "Over the page"], value: "Beside the page"}]},
  {key: "sidebar", label: "Sidebar", icon: "sidebar", scope: "This browser", rows: [
    {key: "rail", label: "Sidebar", kind: "select", options: ["Icons below 1100 px", "Always names and icons", "Always icons"], value: "Icons below 1100 px"}]},
  {title: "Agents"},
  {key: "workers", label: "Workers", icon: "agent", scope: "This environment", rows: [
    {key: "preset", label: "Preset", help: "Sets the rows below", kind: "select", options: ["Careful", "Balanced", "Fast", "Custom"], value: "Balanced"},
    {key: "workersAtOnce", label: "Workers at once", kind: "number", value: 3},
    {key: "seniorAtOnce", label: "Senior workers at once", help: "Complexity 4 and 5", kind: "number", value: 1}]},
  {key: "reviews", label: "Reviews", icon: "eye", scope: "This environment", rows: [
    {key: "review", label: "Review plans", kind: "select", options: ["Every plan", "Plans of 3 phases or more", "Never"], value: "Every plan"}]},
  {key: "helpers", label: "Helpers", icon: "agents", scope: "This environment", rows: [
    {key: "helperModel", label: "Default model", kind: "select", options: ["Opus 5.5", "Sonnet 5.5", "Haiku 5.5"], value: "Opus 5.5"},
    {key: "helperEffort", label: "Effort", kind: "select", options: ["low", "medium", "high", "xhigh", "max"], value: "high"}]},
  {key: "tests", label: "Tests", icon: "todos", scope: "This environment", rows: [
    {key: "fullRun", label: "Full run", kind: "select", options: ["Phase end", "Plan end", "Never"], value: "Plan end"},
    {key: "testLimit", label: "Test runs per task", kind: "number", value: 2}]},
  {key: "tools", label: "Program tools", icon: "tool", scope: "This environment", link: ["integrations", "Integrations"], rows: [
    {key: "webSearch", label: "Web search", kind: "switch", value: true},
    {key: "browser", label: "Browser", kind: "switch", value: false}]},
  {key: "commands", label: "Command classification", icon: "term", scope: "This project", rows: ["git status", "npm test", "pytest"].map((c, i) => ({key: "cmd" + i, label: c, mono: true, kind: "select", options: ["Reads", "Writes", "Ask"], value: i === 0 ? "Reads" : "Writes"}))},
  {key: "hooks", label: "Hooks", icon: "hook", scope: "This project", rows: [
    {key: "hookLint", label: "lint-on-edit.sh · PreToolUse", mono: true, help: "4 min ago · 38 ms", output: 490012, kind: "switch", value: true},
    {key: "hookNotify", label: "notify.sh · Stop", mono: true, help: "1 h ago · 112 ms", output: 489985, kind: "switch", value: true}]},
  {key: "advanced", label: "Advanced", icon: "layout", scope: "This environment", rows: [{key: "keepWorktrees", label: "Keep worktrees after a merge", kind: "switch", value: false}]},
  {title: "Connections"},
  {key: "tunnel", label: "Tunnel", icon: "tunnel", scope: "This project", note: "Connected · 2 devices · last request 3 min ago", rows: [
    {key: "tunnel", label: "Tunnel", help: "jesse-journal.tunler.dev", kind: "switch", value: true},
    {key: "tunnelName", label: "Name", help: "Letters, numbers and dashes", kind: "text", value: "jesse-journal"},
    {key: "tunnelAccess", label: "Access", kind: "select", options: ["Only paired devices", "Anyone with the link and a login"], value: "Only paired devices"}]},
  {key: "tunler", label: "Tunler account", icon: "key", scope: "This project", rows: [{key: "tunlerUser", label: "Signed in as", kind: "read", value: "jesse@…"}, {key: "tunlerPlan", label: "Plan", kind: "read", value: "Free · 1 tunnel"}]},
  {key: "phones", label: "Phones", icon: "phone", scope: "This project", rows: [{key: "pairing", label: "Allow pairing", kind: "switch", value: true}, {key: "phone1", label: "Jesse's phone", help: "Paired 3 days ago", kind: "button", value: "Unpair"}]},
  {title: "Project"},
  {key: "environments", label: "Environments", icon: "branch", scope: "This project", rows: [{key: "envDefault", label: "Open at start", kind: "select", options: ["5 · version-5", "1 · main"], value: "5 · version-5"}]},
  {key: "developer", label: "Developer", icon: "style", scope: "This project", rows: [{key: "developer", label: "Developer pages", kind: "switch", value: true}, {key: "hookLog", label: "Log hook requests", kind: "switch", value: false}]},
];
const R6_SECTIONS = R6_SETTINGS.filter((s) => s.key);
const R6_SET_REFUSALS = {tunnelName: (v) => (/\s/.test(v) ? "No spaces" : null)};

function SettingsPage({developer, setDeveloper, guard}) {
  const toast = useToast();
  const {go} = useOpen();
  const [nav, setNav] = useState("look");
  const [find, setFind] = useState("");
  const [mark, setMark] = useState(null);
  const [errors, setErrors] = useState({});
  const [failure, setFailure] = useState(null);
  const d = useDraft(Object.fromEntries(R6_SECTIONS.flatMap((s) => s.rows.filter((r) => r.kind !== "read" && r.kind !== "button").map((r) => [r.key, r.key === "developer" ? developer : r.value]))));
  const sectionOf = (k) => R6_SECTIONS.find((s) => s.rows.some((r) => r.key === k));
  const save = () => {
    const refused = d.changed.filter((k) => R6_SET_REFUSALS[k]?.(d.v[k]));
    d.save(refused);
    setErrors(Object.fromEntries(refused.map((k) => [k, R6_SET_REFUSALS[k](d.v[k])])));
    if (refused.length) { setFailure(`${d.changed.length - refused.length} saved · ${refused.length} refused`); setNav(sectionOf(refused[0]).key); setFind(""); return false; }
    setFailure(null); setDeveloper(d.v.developer); toast("Settings saved"); return true;
  };
  const cancel = () => { d.cancel(); setErrors({}); setFailure(null); };
  useEffect(() => { guard.current = d.changed.length ? {count: d.changed.length, save, discard: cancel} : null; return () => { guard.current = null; }; });
  const q = find.trim().toLowerCase();
  const hits = q ? R6_SECTIONS.flatMap((s) => s.rows.filter((r) => (r.label + " " + (r.help || "") + " " + (r.options || []).join(" ")).toLowerCase().includes(q)).map((r) => ({r, s}))) : [];
  const control = (r) => {
    if (r.kind === "read") return <span className="ro">{r.value}</span>;
    if (r.kind === "button") return <Btn small className="danger">{r.value}</Btn>;
    if (r.kind === "switch") return <Switch on={d.v[r.key]} onChange={(x) => d.set(r.key, x)} title={r.label} />;
    if (r.kind === "number") return <input type="number" aria-label={r.label} value={d.v[r.key]} style={{width: 90}} onChange={(e) => d.set(r.key, Number(e.target.value))} />;
    if (r.kind === "text") return <input type="text" aria-label={r.label} value={d.v[r.key]} onChange={(e) => d.set(r.key, e.target.value)} />;
    return <select aria-label={r.label} value={d.v[r.key]} onChange={(e) => d.set(r.key, e.target.value)}>{r.options.map((o) => <option key={o}>{o}</option>)}</select>;
  };
  const s = R6_SECTIONS.find((x) => x.key === nav);
  const body = q ? <SettingSection title={plural(hits.length, "setting")}>
      {hits.length ? hits.map(({r, s: sec}) => <button key={r.key} type="button" className="r6-hit" onClick={() => { setNav(sec.key); setMark(r.key); setFind(""); }}><span className={r.mono ? "mono" : ""}>{r.label}</span><span className="where">{sec.label} · {sec.scope}</span></button>)
        : <p className="muted">No match</p>}
    </SettingSection>
    : <><SettingSection title={<>{s.label}<span className="r6-scope">{s.scope}</span></>}>
        {s.rows.map((r) => <SettingRow key={r.key} label={r.mono ? <span className="mono">{r.label}</span> : r.label} help={r.output ? <span>{r.help} · <RowLink term="output" id={r.output} /></span> : r.help} changed={d.changed.includes(r.key)} found={mark === r.key} error={errors[r.key]}>{control(r)}</SettingRow>)}
      </SettingSection>
      {s.link && <div style={{marginTop: 12}}><Btn small icon="open" title={s.link[1]} onClick={() => go(s.link[0])} /></div>}
      {s.note && <div className="notice" style={{marginTop: 14}}><Icon name={s.icon} /><div>{s.note}</div></div>}</>;
  const navRows = R6_SETTINGS.map((n) => n.key ? {...n, changed: n.rows.filter((r) => d.changed.includes(r.key)).length} : n);
  return <div className="page" data-screen-label="Settings">
    <PageHeader title="Settings" />
    <div style={{flex: 1, minHeight: 0, display: "flex", borderTop: "1px solid var(--border)"}}>
      <SettingsLayout find={<SearchField value={find} onChange={setFind} placeholder="Search" style={{width: "100%", height: 26}} />} nav={navRows} navValue={q ? null : nav} onNav={(k) => { setNav(k); setMark(null); setFind(""); }} draft={d.changed.length} failure={failure} onCancel={cancel} onSave={save}>
        {body}
      </SettingsLayout>
    </div>
  </div>;
}

/* ---------- plan focus ---------- */
// a few more plans, so the menu shows how it stays short when plans pile up
if (!PLANS.some((p) => p.id === 1134)) PLANS.push(
  {id: 1134, title: "Settings: search over every row", state: "approved", by: "main", brief: "", phases: [{n: 1, title: "Search", tasks: []}]},
  ...Array.from({length: 46}, (_, i) => ({id: 1080 + i, title: `Earlier plan ${1080 + i}`, state: i % 7 === 0 ? "cancelled" : "completed", by: "main", brief: "", phases: [{n: 1, title: "", tasks: []}]})));
const R6_ENDED = (p) => p && (p.state === "completed" || p.state === "cancelled");
const R6_MENU_MAX = 6;
// a named focus on a plan that ends goes back to the default, and the menu says so once
function useFocus() {
  const [, tick] = useState(0);
  useEffect(() => { const heard = () => tick((n) => n + 1); FOCUS.listeners.add(heard); return () => FOCUS.listeners.delete(heard); }, []);
  const named = FOCUS.source === "explicit" ? PLANS.find((p) => p.id === FOCUS.plan) : null;
  const ended = R6_ENDED(named) ? named : null;
  const plan = named && !ended ? named : defaultFocus();
  const source = named && !ended ? "explicit" : "default";
  const choose = (id) => { FOCUS.plan = id; FOCUS.source = id == null ? "default" : "explicit"; FOCUS.listeners.forEach((f) => f()); };
  return {plan, source, ended, choose};
}

// the Plans window: the card is no button around buttons. Its title opens the plan; the focus target is its own button.
// Under the Plans tab a card shows its number alone, its state only when it needs you (Blocked), and ended plans only when the State filter asks for them.
function PlansWithFocus({onOpen}) {
  const [value, setValue] = useState(emptyFilter());
  const [words, setWords] = useState("");
  const {plan: focused, source, choose} = useFocus();
  const toast = useToast();
  const picked = applyFilter(PLANS, PLAN_FIELDS, value, words, (p) => `${p.id} ${p.title}`);
  const rows = value.state ? picked : picked.filter((p) => !R6_ENDED(p));
  return <div className="col" style={{height: "100%", gap: 0}}>
    <FilterBar fields={PLAN_FIELDS} rows={PLANS} value={value} onChange={setValue} words={words} onWords={setWords} shown={rows.length} placeholder="Search" />
    <div className="pl-grid">{rows.map((p) => { const ts = planTasks(p); const {done, testing} = planProgress(p); const phase = p.phases.find((x) => x.tasks.some((id) => TASKS.find((t) => t.id === id && t.state !== "completed")))?.n; const isFocus = focused?.id === p.id;
      return <div key={p.id} className={"pl-card" + (isFocus ? " focus" : "")} onClick={(e) => { if (!e.target.closest("button, [role=link]")) onOpen("plan", p.id); }}>
        <span className="pl-head"><Icon name="plan" size={12} /><span className="n">{p.id}</span><span />
          {isFocus ? <span className={"pl-focus" + (source === "default" ? " default" : "")}><Icon name="target" size={11} />Focus</span>
            : FOCUSABLE(p) ? <button type="button" className="pl-make" title="Focus" aria-label={`Focus plan ${p.id}`} onClick={() => { choose(p.id); toast(`Plan ${p.id} is main's focus`); }}><Icon name="target" size={12} /></button> : <span />}
          <Badge state={p.state} /></span>
        <button type="button" className="pl-open" title={p.title} onClick={() => onOpen("plan", p.id)}>{p.title}</button>
        {ts.length > 0 && <span className="pl-bar"><i style={{width: `${(done / ts.length) * 100}%`}} /><i className="testing" style={{width: `${(testing / ts.length) * 100}%`}} /></span>}
        <span className="pl-foot"><span>{ts.length ? `${done} of ${ts.length} done${phase ? ` · phase ${phase}` : ""}` : "No tasks"}</span><R16Agent name={p.by} /></span>
      </div>; })}
      {!rows.length && <Empty title="No match" action={<Btn small onClick={() => { setValue(emptyFilter()); setWords(""); }}>Clear</Btn>} />}
    </div>
  </div>;
}
NOW_WINDOWS.plans = PlansWithFocus;

Object.assign(window, {SettingsPage, useFocus, PlansWithFocus, R6_SECTIONS, R6_SETTINGS, R6_ENDED});
