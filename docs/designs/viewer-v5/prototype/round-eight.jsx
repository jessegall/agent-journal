// Round eight (messages 121006 and 121010), with the round-seventeen corrections. Replaces by name: HomeNow, and sets NOW_WINDOWS.agents.
// 1. The Agents window as the viewer draws it today (AgentRows.vue, AgentCard.vue): search, filters and the Working, Idle, Retired, All tabs over a list of agent cards.
//    Working holds only agents with a live process: an idle agent is under Idle, never faded into Working.
// 2. The drill-down: a card opens over the whole window (R8OpenCard, round fourteen) with the agent's attribute band under its head, the card's tabs
//    (their bodies are here) and the command band at its foot (round nine). The row (R8Card) is round fifteen's, the inspector round sixteen's.
// 3. The inspector's figures strip says what the attribute band above it does not: how long it ran, its pace, its failed runs.

/* ---------- the agents, as the agents read and the card reads give them ---------- */
const R8_AGENTS = [
  {id: 1, name: "main", title: "Main agent", sub: "builder", number: "Main", role: "main", program: "Claude Code", model: "Opus 5.5", effort: "high", dot: "working", doing: "Working", since: "Since 09:12", seen: "Seen just now", startedBy: "Jesse", task: 9597, plan: 1131, perHour: 0, command: "sed -n 55,80p src/core/modules/agents/support/agent_rows.py", reports: 2, memories: 4, helpers: 3, skills: 14, running: "4 h 12 min", failed: 0, brief: "Build the agent journal with the user. Keep plans moving, send workers for contained work, and answer each message in plain words."},
  {id: 4, name: "worker-4", title: "Worker 4", sub: "worker", number: "Worker 4", role: "worker", program: "Claude Code", model: "Sonnet 5.5", effort: "medium", dot: "working", doing: "Working", since: "Since 11:02", seen: "Seen 20 s ago", startedBy: "main", task: 9682, plan: 1131, perHour: 1.4, command: "pytest src/viewer/tests/planCard.test.js -q", reports: 1, memories: 2, helpers: 0, skills: 9, running: "52 min", failed: 1, unit: "viewer polish", brief: "Plan card agent badges: no Agents: label, centred text, smaller icon. Prove it with the planCard test and a screenshot of the plans window."},
  {id: 7, name: "worker-7", title: "Worker 7", sub: "worker", number: "Worker 7", role: "worker", program: "Claude Code", model: "Sonnet 5.5", effort: "medium", dot: "waiting", doing: "Blocked: waits on task 9682 for the shared row", wait: "", since: "Since 11:40", seen: "Seen 6 min ago", startedBy: "main", task: 9683, plan: 1131, perHour: 0.8, command: "", reports: 0, memories: 1, helpers: 0, skills: 7, running: "1 h 3 min", failed: 0, brief: "File feed shows a moved file as moved, with where it came from."},
  {id: 12, name: "helper-851", title: "Helper 851", sub: "designer", number: "Helper 851", role: "helper", readOnly: true, program: "Claude Code", model: "Opus 5.5", effort: "high", dot: "thinking", doing: "Working", since: "Since 11:54", seen: "Seen just now", startedBy: "main", job: "Redraw the agent inspector and the drill-down of the Agents window to match the viewer, with a little more flair", jobTitle: "Agent inspector redraw", jobLaunch: "claude, resumed", command: "journal doc show 1275 --section 35", reports: 3, memories: 7, helpers: 0, skills: 11, running: "18 min", failed: 0, sandboxOff: true, brief: "Redraw the agent inspector and the drill-down of the Agents window to match the viewer, with a little more flair. Pin the design and report."},
  {id: 15, name: "reviewer-3", title: "Reviewer 3", sub: "reviewer", number: "Reviewer 3", role: "helper", readOnly: true, program: "Codex", model: "GPT-5", effort: "medium", dot: "waiting", doing: "Waiting: the process queue runs pytest tests/stories", wait: "the process queue runs pytest tests/stories", since: "Since 12:01", seen: "Seen 2 min ago", startedBy: "main", job: "Review plan 1133 against doc 1275", jobTitle: "Review plan 1133", jobLaunch: "codex, new conversation", command: "", reports: 1, memories: 0, helpers: 0, skills: 4, running: "9 min", failed: 0, brief: "Review plan 1133 against doc 1275 and report what does not hold."},
  {id: 20, name: "worker-2", title: "Worker 2", sub: "worker", number: "Worker 2", role: "worker", program: "Claude Code", model: "Sonnet 5.5", effort: "low", dot: "ended", ended: true, doing: "Idle", since: "Since 10:31", seen: "Seen 1 h ago", startedBy: "main", task: 9680, plan: 1131, perHour: 2.1, command: "", reports: 2, memories: 0, helpers: 0, skills: 6, running: "1 h 40 min", failed: 0, brief: "The sins drain teaches: after fixing an area, rerun only that detector."},
  {id: 21, name: "helper-844", title: "Helper 844", sub: "researcher", number: "Helper 844", role: "helper", readOnly: true, program: "Claude Code", model: "Haiku 5.5", effort: "low", dot: "retired", ended: true, retired: true, retiredAt: "2 h ago", retiredBy: "main", retireReason: "Its job is done; the report is report 1376.", doing: "Retired", since: "Since 09:58", seen: "Seen 2 h ago", startedBy: "main", job: "Group the full-run failures by detector", jobTitle: "Full-run failures", jobLaunch: "claude, new conversation", command: "", reports: 1, memories: 0, helpers: 0, skills: 3, running: "26 min", failed: 0, brief: "Group the full-run failures by detector and file one report."},
];
const r8Agent = (id) => R8_AGENTS.find((a) => a.id === id) || R8_AGENTS[0];
const r8Live = (a) => !a.ended;
const R8_SHOWS = [{key: "running", label: "Working"}, {key: "idle", label: "Idle"}, {key: "retired", label: "Retired"}, {key: "all", label: "All"}];
const R8_EMPTY = {running: "None working", idle: "None idle", retired: "None retired", all: "No agents"};
const r8Shown = (a, show) => ({running: r8Live(a), idle: a.ended && !a.retired, retired: Boolean(a.retired), all: true}[show]);
const r8TasksOf = (a) => TASKS.filter((t) => t.by === a.name || t.id === a.task);

/* ---------- the tabs of an open card ---------- */
const R8_TRANSCRIPT = [
  ["you", "Redraw the agent inspector and the Agents window drill-down."],
  ["agent", "Reading AgentRows.vue and AgentCard.vue first, then the inspector's AgentDetail.vue."],
  ["tool", "Bash · grep -rn \"InformationBar\" src/viewer/src/resource/agent"],
  ["agent", "The attribute band sits under the name in the inspector, and under the head of an open card."],
  ["journal", "A context mark: weigh your memories within 10 tool uses."],
  ["tool", "write_files · round-eight.jsx"],
];
const R8_REPORTS = [{id: 1398, text: "Splash screen design ready for a worker"}, {id: 1395, text: "Viewer v5 round seven: what changed"}, {id: 1390, text: "Round six reads every page's window data"}];
function R8TasksTab({a}) {
  const [folded, setFolded] = useState({completed: true});
  const ts = r8TasksOf(a);
  if (!ts.length) return <Empty title="No tasks" />;
  const groups = [["started", "Started", ["started", "testing"]], ["blocked", "Blocked", ["blocked"]], ["open", "Open", ["open"]], ["completed", "Completed", ["completed", "cancelled"]]];
  return <div className="col" style={{gap: 0}}>
    {groups.map(([k, label, states]) => { const rows = ts.filter((t) => states.includes(t.state)); if (!rows.length) return null; const shut = folded[k];
      return <div key={k} className="r8-tgroup"><button type="button" className="r8-tgroup-head" aria-expanded={!shut} onClick={() => setFolded({...folded, [k]: !shut})}><Chevron open={!shut} /><span>{label}</span><span className="r8-faint">{rows.length}</span></button>
        {!shut && rows.map((t) => <TaskRow key={t.id} t={t} />)}</div>; })}
    <p className="r8-label">Instruction</p>
    <div className="r8-instruction">{a.brief}</div>
  </div>;
}
function R8TranscriptTab({a}) {
  return <div className="col" style={{gap: 0}}>
    {a.readOnly && <div className="r8-instruction" style={{margin: "12px var(--inset)"}}>{a.job || a.brief}</div>}
    {R8_TRANSCRIPT.map(([who, text], i) => <div key={i} className={"r8-trow " + who}><span className="r8-author">{who}</span><span className={who === "tool" ? "mono" : ""}>{text}</span></div>)}
  </div>;
}
// under the Reports tab and the Processes tab a row is its number, not its kind and number
function R8ReportsTab({a}) {
  const {open} = useOpen();
  const rows = R8_REPORTS.slice(0, a.reports);
  if (!rows.length) return <Empty title="No reports" />;
  return <div className="col" style={{gap: 0}}>{rows.map((r) => <button key={r.id} type="button" className="r8-report" onClick={() => open("report", r.id)}><span className="rc"><span className="k" /><span className="n">{r.id}</span></span><span className="ellipsis">{r.text}</span></button>)}</div>;
}
function R8ProcessesTab({a}) {
  const {open} = useOpen();
  const rows = OUTPUTS.filter((o) => o.by === a.name);
  if (!rows.length) return <Empty title="No processes" />;
  return <div className="col" style={{gap: 0}}>{rows.map((o) => <button key={o.id} type="button" className="r8-report" onClick={() => open("output", o.id)}><span className="rc"><span className="k" /><span className="n">{o.id}</span></span><span className="ellipsis mono" style={{fontSize: 12}}>{o.line}</span><Badge state={o.state}>{OUTPUT_WORDS[o.state]}</Badge></button>)}</div>;
}
const R8_TAB_BODIES = {tasks: R8TasksTab, transcript: R8TranscriptTab, terminal: () => <NowTerminal />, feed: () => <NowFeed />, processes: R8ProcessesTab, reports: R8ReportsTab, memories: () => <div style={{padding: "12px var(--inset)"}}><AgentMemoriesTab /></div>};

/* ---------- the Agents window: search, filters and tabs, then the cards; a card opens in place ---------- */
// the Working tab carries no count: the pane tab already counts the working agents
function R8AgentsWindow() {
  const [show, setShow] = useState("running");
  const [words, setWords] = useState("");
  const [filters, setFilters] = useState({roles: [], programs: []});
  const [openId, setOpenId] = useState(null);
  const [closing, setClosing] = useState(false);
  const flip = (group, value) => setFilters({...filters, [group]: filters[group].includes(value) ? filters[group].filter((v) => v !== value) : [...filters[group], value]});
  const count = filters.roles.length + filters.programs.length;
  const rows = R8_AGENTS.filter((a) => r8Shown(a, show) && (!filters.roles.length || filters.roles.includes(a.role)) && (!filters.programs.length || filters.programs.includes(a.program)) && `${a.name} ${a.title} ${a.sub} ${a.model}`.toLowerCase().includes(words.toLowerCase()));
  const opened = openId == null ? null : r8Agent(openId);
  const close = () => { setClosing(true); setTimeout(() => { setOpenId(null); setClosing(false); }, 140); };
  // Escape closes the open card, as one layer of the kit's layer stack
  useLayer(Boolean(opened), close);
  if (opened) return <div className={"r8-agents focused" + (closing ? " closing" : "")}><R8OpenCard key={opened.id} a={opened} onClose={close} /></div>;
  return <div className="r8-agents">
    <div className="r8-bar">
      <SearchField value={words} onChange={setWords} placeholder="Search" style={{flex: 1, height: 28}} />
      <Menu width={220} button={({toggle, open}) => <button type="button" className={"r8-filter" + (open ? " on" : "")} title="Filter" onClick={toggle}><Icon name="filter" size={12} />{count > 0 && <span className="r8-fcount">{count}</span>}</button>}>{() => <>
        <div className="menu-label">Type</div>{[["main", "Main"], ["worker", "Worker"], ["helper", "Helper"]].map(([k, l]) => <MenuItem key={k} check={filters.roles.includes(k)} onClick={() => flip("roles", k)}>{l}</MenuItem>)}
        <div className="menu-label">Program</div>{["Claude Code", "Codex"].map((p) => <MenuItem key={p} check={filters.programs.includes(p)} onClick={() => flip("programs", p)}>{p}</MenuItem>)}
        {count > 0 && <><div className="menu-sep" /><MenuItem onClick={() => setFilters({roles: [], programs: []})}>Clear</MenuItem></>}
      </>}</Menu>
      <Seg value={show} onPick={setShow} options={R8_SHOWS.map((s) => ({...s, count: s.key === "running" ? undefined : R8_AGENTS.filter((a) => r8Shown(a, s.key)).length}))} />
    </div>
    {show === "retired" && <p className="r8-upgrade">Retired by upgrade: 2</p>}
    <div className="r8-list">
      {rows.map((a, i) => <R8Card key={a.id} a={a} index={i} onOpen={(x) => setOpenId(x.id)} />)}
      {!rows.length && (count ? <Empty title="No match" action={<Btn small onClick={() => setFilters({roles: [], programs: []})}>Clear</Btn>} /> : <Empty title={words ? "No match" : R8_EMPTY[show]} />)}
    </div>
  </div>;
}
NOW_WINDOWS.agents = R8AgentsWindow;

/* ---------- the inspector's figures: what the attribute band above does not show ---------- */
function R8Strip({a}) {
  const cells = [
    ["time", a.ended ? "Ran for" : "Running for", a.running],
    a.role === "main" ? ["done", "Tasks done", "3 of 8"] : ["pace", "Tasks an hour", String(a.perHour)],
    ["failed", "Failed runs", String(a.failed), a.failed > 0],
  ];
  return <div className="r8-strip">{cells.map(([k, label, value, bad]) => <div key={k} className="r8-cell"><small>{label}</small><b className={bad ? "bad" : ""}>{value}</b></div>)}</div>;
}
const R8_MOVES = [["Ran output 489998", "output", 489998, "bad", "25 min ago"], ["Filed report 1398", "report", 1398, "good", "40 min ago"], ["Read skill journal-tasks", null, null, "", "1 h ago"], ["Started task 9597", "task", 9597, "work", "1 h ago"], ["Made memory 822", "memory", 822, "", "2 h ago"]];

/* ---------- Home: the right pane carries the Agents window, open, so the drill-down is one click away ---------- */
function HomeNow({onOpen}) {
  const [left, setLeft] = useState(["chat", "terminal"]); const [la, setLa] = useState("chat");
  const [right, setRight] = useState(["agents", "tasks", "plans", "questions", "feed"]); const [ra, setRa] = useState("agents");
  const [filter, setFilter] = useState(emptyFilter());
  const shared = {onOpen, filter, setFilter, onFilter: (t) => { if (t.source !== "tasks") return; setFilter(t.where); if (!right.includes("tasks")) setRight([...right, "tasks"]); setRa("tasks"); }};
  return <div className="home-now" data-screen-label="Home">
    <NowPane tabs={left} setTabs={setLeft} active={la} setActive={setLa} shared={shared} />
    <NowPane tabs={right} setTabs={setRight} active={ra} setActive={setRa} shared={shared} />
  </div>;
}

Object.assign(window, {R8_AGENTS, r8Agent, r8TasksOf, R8AgentsWindow, R8Strip, R8_MOVES, R8_TAB_BODIES, HomeNow});
