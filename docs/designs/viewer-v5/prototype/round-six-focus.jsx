// Round six, part 3: Settings searches every row and holds the agent settings inline (report 1383 §13, doc 1276 §2, §9),
// and the plan focus (report 1383 §14, doc 1276 §8). Replaces by name: SettingsPage, useFocus, FocusFact, HomeAgentBar, PlansWithFocus.

/* ---------- Settings: one list of sections, each with its scope; every control is in the draft; the search goes over every row ---------- */
const R6_SETTINGS = [
  {title: "Viewer"},
  {key: "look", label: "Look and layout", icon: "grid", scope: "This browser", help: "How every page of the viewer is drawn.", rows: [
    {key: "theme", label: "Colour scheme", kind: "select", options: ["Dark", "Light", "Follow the system"], value: "Dark"},
    {key: "density", label: "Density", help: "Comfortable keeps 16 px insets; compact keeps 12 px.", kind: "select", options: ["Comfortable", "Compact"], value: "Comfortable"},
    {key: "inspector", label: "Where a row opens", help: "Beside the page keeps the page readable behind it.", kind: "select", options: ["Beside the page", "Over the page"], value: "Beside the page"}]},
  {key: "sidebar", label: "Sidebar", icon: "sidebar", scope: "This browser", help: "The sidebar never hides on a click. Narrow, each icon names its page on hover.", rows: [
    {key: "rail", label: "Show the sidebar as", kind: "select", options: ["Icons below 1100 px", "Always names and icons", "Always icons"], value: "Icons below 1100 px"}]},
  {title: "Agents"},
  {key: "workers", label: "Workers", icon: "agent", scope: "This environment", help: "Workers write code, each in its own worktree. A profile's own settings come on top of these.", rows: [
    {key: "preset", label: "Preset", help: "Careful, Balanced and Fast set the rows below; a change makes it Custom.", kind: "select", options: ["Careful", "Balanced", "Fast", "Custom"], value: "Balanced"},
    {key: "workersAtOnce", label: "Workers at once", kind: "number", value: 3},
    {key: "seniorAtOnce", label: "Senior workers at once", help: "For tasks of complexity 4 and 5", kind: "number", value: 1}]},
  {key: "reviews", label: "Reviews", icon: "check", scope: "This environment", rows: [
    {key: "review", label: "Review plans", kind: "select", options: ["Every plan", "Plans of 3 phases or more", "Never"], value: "Every plan"}]},
  {key: "helpers", label: "Helpers", icon: "agents", scope: "This environment", help: "Read-only helpers for bounded reads. A helper profile's model wins over this.", rows: [
    {key: "helperModel", label: "Model when its profile names none", kind: "select", options: ["Opus 5.5", "Sonnet 5.5", "Haiku 5.5"], value: "Opus 5.5"},
    {key: "helperEffort", label: "Effort", kind: "select", options: ["low", "medium", "high", "xhigh", "max"], value: "high"}]},
  {key: "tests", label: "Tests", icon: "check", scope: "This environment", rows: [
    {key: "fullRun", label: "Full run", kind: "select", options: ["Phase end", "Plan end", "Never"], value: "Plan end"},
    {key: "testLimit", label: "Test runs a worker may start per task", kind: "number", value: 2}]},
  {key: "tools", label: "Program tools", icon: "tool", scope: "This environment", help: "Tools of the agent program itself. MCP servers are on the Integrations page, and each profile's Tools tab says which it may call.", link: ["integrations", "Open Integrations"], rows: [
    {key: "webSearch", label: "Web search", kind: "switch", value: true},
    {key: "browser", label: "Browser", kind: "switch", value: false}]},
  {key: "commands", label: "Command classification", icon: "term", scope: "This project", help: "Which shell commands only read, and which write.", rows: ["git status", "npm test", "pytest"].map((c, i) => ({key: "cmd" + i, label: c, mono: true, kind: "select", options: ["Reads", "Writes", "Ask"], value: i === 0 ? "Reads" : "Writes"}))},
  {key: "hooks", label: "Hooks", icon: "hook", scope: "This project", help: "The project's own hooks beside the journal's.", rows: [
    {key: "hookLint", label: "lint-on-edit.sh · PreToolUse", mono: true, help: "Last run 4 min ago, 38 ms", output: 490012, kind: "switch", value: true},
    {key: "hookNotify", label: "notify.sh · Stop", mono: true, help: "Last run 1 h ago, 112 ms", output: 489985, kind: "switch", value: true}]},
  {key: "advanced", label: "Advanced", icon: "gear", scope: "This environment", rows: [{key: "keepWorktrees", label: "Keep worktrees after a merge", kind: "switch", value: false}]},
  {title: "Connections"},
  {key: "tunnel", label: "Tunnel", icon: "tunnel", scope: "This project", help: "Reach this viewer from your phone or another computer, through a link only you hold.", note: "Connected · 2 devices · last request 3 min ago", rows: [
    {key: "tunnel", label: "Tunnel", help: "Open at jesse-journal.tunler.dev", kind: "switch", value: true},
    {key: "tunnelName", label: "Name", help: "Letters, numbers and dashes", kind: "text", value: "jesse-journal"},
    {key: "tunnelAccess", label: "Who may open it", kind: "select", options: ["Only paired devices", "Anyone with the link and a login"], value: "Only paired devices"}]},
  {key: "tunler", label: "Tunler account", icon: "key", scope: "This project", rows: [{key: "tunlerUser", label: "Signed in as", kind: "read", value: "jesse@…"}, {key: "tunlerPlan", label: "Plan", kind: "read", value: "Free · 1 tunnel"}]},
  {key: "phones", label: "Phones", icon: "phone", scope: "This project", help: "Paired phones get pushes when a question waits on you.", rows: [{key: "pairing", label: "Allow pairing", kind: "switch", value: true}, {key: "phone1", label: "Jesse's phone", help: "Paired 3 days ago", kind: "button", value: "Unpair"}]},
  {title: "Project"},
  {key: "environments", label: "Environments", icon: "branch", scope: "This project", rows: [{key: "envDefault", label: "Open at start", kind: "select", options: ["5 · version-5", "1 · main"], value: "5 · version-5"}]},
  {key: "developer", label: "Developer", icon: "chart", scope: "This project", help: "Pages for people who work on the journal itself.", rows: [{key: "developer", label: "Developer pages", kind: "switch", value: true}, {key: "hookLog", label: "Log hook requests", kind: "switch", value: false}]},
];
const R6_SECTIONS = R6_SETTINGS.filter((s) => s.key);
const R6_SET_REFUSALS = {tunnelName: (v) => (/\s/.test(v) ? "A tunnel name has no spaces: use letters, numbers and dashes." : null)};

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
    if (refused.length) { setFailure(`${d.changed.length - refused.length} of ${d.changed.length} saved. ${refused.length} refused: see the marked row.`); setNav(sectionOf(refused[0]).key); setFind(""); return false; }
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
  const body = q ? <SettingSection title={`${hits.length} setting${hits.length === 1 ? "" : "s"} match “${find}”`} help="Choose one to go to its row.">
      {hits.length ? hits.map(({r, s: sec}) => <button key={r.key} type="button" className="r6-hit" onClick={() => { setNav(sec.key); setMark(r.key); setFind(""); }}><span className={r.mono ? "mono" : ""}>{r.label}</span><span className="where">{sec.label} · {sec.scope}</span></button>)
        : <p className="muted">No setting has these words. Try another word for the same thing.</p>}
    </SettingSection>
    : <><SettingSection title={<>{s.label}<span className="r6-scope">{s.scope}</span></>} help={s.help}>
        {s.rows.map((r) => <SettingRow key={r.key} label={r.mono ? <span className="mono">{r.label}</span> : r.label} help={r.output ? <span>{r.help} · <RowLink term="output" id={r.output} /></span> : r.help} changed={d.changed.includes(r.key)} found={mark === r.key} error={errors[r.key]}>{control(r)}</SettingRow>)}
      </SettingSection>
      {s.link && <div style={{marginTop: 12}}><Btn small variant="ghost" onClick={() => go(s.link[0])}>{s.link[1]}</Btn></div>}
      {s.note && <div className="notice" style={{marginTop: 14}}><Icon name={s.icon} /><div>{s.note}</div></div>}</>;
  const navRows = R6_SETTINGS.map((n) => n.key ? {...n, changed: n.rows.filter((r) => d.changed.includes(r.key)).length} : n);
  return <div className="page" data-screen-label="Settings">
    <PageHeader title="Settings" line="The viewer, the agents, the connections and the project" />
    <div style={{flex: 1, minHeight: 0, display: "flex", borderTop: "1px solid var(--border)"}}>
      <SettingsLayout find={<SearchField value={find} onChange={setFind} placeholder="Find a setting" style={{width: 280}} />} nav={navRows} navValue={q ? null : nav} onNav={(k) => { setNav(k); setMark(null); setFind(""); }} draft={d.changed.length} failure={failure} onCancel={cancel} onSave={save}>
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
function FocusFact() {
  const {plan, source, ended, choose} = useFocus();
  const toast = useToast();
  const {open} = useOpen();
  const [hover, setHover] = useState(null);
  if (!plan) return <span className="now-focus default" title="No plan is started or approved, so the agent has no plan focus"><Icon name="target" size={12} /><span className="word">No plan focus</span></span>;
  const {total, done} = planProgress(plan);
  const choosable = PLANS.filter(FOCUSABLE).sort((a, b) => (a.id === plan.id ? -1 : b.id === plan.id ? 1 : a.id - b.id));
  const waiting = PLANS.filter((p) => !FOCUSABLE(p) && !R6_ENDED(p));
  const closed = PLANS.filter(R6_ENDED).length;
  const shown = choosable.slice(0, R6_MENU_MAX);
  const cmd = hover === "default" ? "journal plan focus --clear" : `journal plan focus ${hover ?? plan.id}`;
  const row = (p, can) => { const pr = planProgress(p); const on = plan.id === p.id;
    return <button key={p.id} type="button" role="menuitemradio" aria-checked={on} aria-disabled={!can} className="focus-row" title={can ? p.title : `${p.title}: only a started or approved plan can be the focus`}
      onMouseEnter={() => can && setHover(p.id)} onFocus={() => can && setHover(p.id)} onClick={() => { if (!can) return; choose(p.id); toast(`Plan ${p.id} is main's focus`); }}>
      <span className="tick">{on && <Icon name="tick" size={12} />}</span><span>Plan</span><span className="n">{p.id}</span><span>{p.title}</span><span className="st">{STATE_WORDS[p.state]}</span><FocusBar plan={p} /><span className="num">{pr.done} of {pr.total}</span>
    </button>; };
  return <Menu align="left" width={460} button={({toggle, open: isOpen}) => <button type="button" className={"now-focus" + (source === "default" ? " default" : "") + (isOpen ? " on" : "")} title={`${source === "default" ? "The default focus: the oldest started plan with work" : "The plan main works on first"}: plan ${plan.id}, ${done} of ${total} tasks done. Change it`} aria-haspopup="menu" aria-expanded={isOpen} onClick={toggle}>
      <Icon name="target" size={12} /><span className="word">Focus</span>{plan.id !== TASKS.find((x) => x.id === AGENTS[0].task)?.plan && <b>Plan {plan.id}</b>}<FocusBar plan={plan} /><span>{done} of {total}</span>
    </button>}>{(close) => <div onMouseLeave={() => setHover(null)}>
      <div className="dd-head"><span>Plan focus of main</span><span className="grow" /><span className="faint" style={{fontSize: 11}}>{source === "default" ? "the default" : "named"}</span></div>
      <div className="dd-sub">{ended ? `Plan ${ended.id} was ${ended.state === "completed" ? "completed" : "cancelled"}, so main is back on the default focus.` : "The plan main works on first. Its tasks are handed out before the others."}</div>
      <div className="focus-group">Started or approved</div>
      {shown.map((p) => row(p, true))}
      {choosable.length > shown.length && <div className="focus-more"><span>and {choosable.length - shown.length} more</span><button type="button" onClick={() => { open("window", "plans"); close(); }}>Open the Plans window</button></div>}
      {waiting.length > 0 && <><div className="focus-group">Not started or approved yet</div>{waiting.slice(0, 3).map((p) => row(p, false))}</>}
      <div className="focus-more"><span>{closed} completed or cancelled plans are left out.</span></div>
      <div className="menu-sep" />
      <div onMouseEnter={() => setHover("default")}><MenuItem icon="back" desc={`Now plan ${defaultFocus()?.id ?? "none"}: the oldest started plan with work`} onClick={() => { choose(null); toast("main is back on the default focus"); close(); }}>Use the default</MenuItem></div>
      <MenuItem icon="plan" onClick={() => { open("plan", plan.id); close(); }}>Open plan {plan.id}</MenuItem>
      <div className="dd-foot mono">{cmd}</div>
    </div>}</Menu>;
}

// the agent bar as round four drew it; the task's plan stays the link it is today, the focus comes after it
function HomeAgentBar() {
  const {open} = useOpen();
  const [paused, setPaused] = useState(false);
  const t = TASKS.find((x) => x.id === AGENTS[0].task);
  const helpers = AGENTS.filter((a) => a.role !== "Main agent" && a.state !== "open");
  return <div className="now-agent" data-agent-bar>
    <span className={"now-dot " + (paused ? "paused" : "running")} />
    <strong>{paused ? "Paused" : "Working"}</strong>
    <button type="button" className="now-task" title={t.title} onClick={() => open("task", t.id)}>Task {t.id}: {t.title}</button>
    {t.plan && <button type="button" className="now-plan" title={`Open plan ${t.plan}`} onClick={() => open("plan", t.plan)}>Plan {t.plan}</button>}
    <FocusFact />
    <span className="grow" />
    <button type="button" className={"btn icon now-pause" + (paused ? " paused" : "")} aria-label={paused ? "Resume" : "Pause"} title={paused ? "Resume: the agent carries on where it stopped" : "Pause: only journal commands, read tools and read commands run until you resume it"} onClick={() => setPaused(!paused)}><Icon name={paused ? "resume" : "pause"} size={16} /></button>
    <span className="now-divider" />
    <button type="button" className="now-count" aria-label="Process queue" title="Process queue: processes running now" onClick={() => open("output", 490026)}><Icon name="term" size={12} />1</button>
    <Menu width={280} button={({toggle}) => <button type="button" className="now-count" aria-label="Helpers" title="Running: helpers" onClick={toggle}><Icon name="agents" size={12} />{helpers.length}</button>}>{(close) => <>
      <div className="menu-label">Running beside main</div>
      {helpers.map((a) => <MenuItem key={a.id} icon="agent" desc={a.task ? `Task ${a.task}` : a.role} hint={STATE_WORDS[a.state]} onClick={() => { open("agent", a.id); close(); }}>{a.name}</MenuItem>)}
    </>}</Menu>
  </div>;
}

// the Plans window: the card is no button around buttons. Its title opens the plan; the focus target is its own button, always shown
function PlansWithFocus({onOpen}) {
  const [value, setValue] = useState({state: {not: true, values: ["completed", "cancelled"]}});
  const [words, setWords] = useState("");
  const {plan: focused, source, choose} = useFocus();
  const toast = useToast();
  const rows = applyFilter(PLANS, PLAN_FIELDS, value, words, (p) => `${p.id} ${p.title}`);
  return <div className="col" style={{height: "100%", gap: 0}}>
    <FilterBar fields={PLAN_FIELDS} rows={PLANS} value={value} onChange={setValue} words={words} onWords={setWords} shown={rows.length} placeholder="Search plans" />
    <div className="pl-grid">{rows.map((p) => { const ts = planTasks(p); const {done, testing} = planProgress(p); const phase = p.phases.find((x) => x.tasks.some((id) => TASKS.find((t) => t.id === id && t.state !== "completed")))?.n; const isFocus = focused?.id === p.id;
      return <div key={p.id} className={"pl-card" + (isFocus ? " focus" : "")} onClick={(e) => { if (!e.target.closest("button, [role=link]")) onOpen("plan", p.id); }}>
        <span className="pl-head"><Icon name="plan" size={12} /><span>Plan</span><span className="n">{p.id}</span>
          {isFocus ? <span className={"pl-focus" + (source === "default" ? " default" : "")} title={source === "default" ? "main's focus by default: the oldest started plan with work" : "main's focus: its tasks are handed out first"}><Icon name="target" size={11} />Focus</span>
            : FOCUSABLE(p) ? <button type="button" className="pl-make" title={`Make plan ${p.id} main's focus`} aria-label={`Make plan ${p.id} main's focus`} onClick={() => { choose(p.id); toast(`Plan ${p.id} is main's focus`); }}><Icon name="target" size={12} /></button> : <span />}
          <span className="pl-state"><span className={"sdot " + p.state} />{STATE_WORDS[p.state]}</span></span>
        <button type="button" className="pl-open" title={p.title} onClick={() => onOpen("plan", p.id)}>{p.title}</button>
        <span className="pl-bar" title={`${done} of ${ts.length} done`}><i style={{width: `${ts.length ? (done / ts.length) * 100 : 0}%`}} /><i className="testing" style={{width: `${ts.length ? (testing / ts.length) * 100 : 0}%`}} /></span>
        <span className="pl-foot"><span>{done} of {ts.length} tasks done{phase ? ` · phase ${phase}` : ""}</span><span><AgentLink name={p.by} /></span></span>
      </div>; })}
      {!rows.length && <Empty title="No plans match" action={<Btn small onClick={() => { setValue(emptyFilter()); setWords(""); }}>Clear the filters</Btn>} />}
    </div>
  </div>;
}
NOW_WINDOWS.plans = PlansWithFocus;

Object.assign(window, {SettingsPage, useFocus, FocusFact, HomeAgentBar, PlansWithFocus});
