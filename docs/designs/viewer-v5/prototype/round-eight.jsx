// Round eight (messages 121006 and 121010). Replaces by name: AgentInspector and HomeNow, and sets NOW_WINDOWS.agents.
// 1. The Agents window as the viewer draws it today (AgentRows.vue, AgentCard.vue): search, filters and the Working, Idle, Retired, All tabs over a list of agent cards.
// 2. The drill-down: a card opens over the whole window (AgentCardDetails.vue) with the agent's attribute band (InformationBar.vue, card) under its head,
//    the card's tabs and the command band at its foot. Inspect opens the agent's inspector on the stack.
// 3. The agent inspector as AgentDetail.vue draws it: name with its state dot, the attribute band lined up under the name, Started by, the figures strip,
//    Doing now, Brief, Recent and the folds. The same attribute band shows for every agent you inspect.
// Flair: a state rail on each card, a halo on the working dot, cards that open in place, a live command line, meters that fill as they appear.

/* ---------- the agents, as the agents read and the card reads give them ---------- */
const R8_AGENTS = [
  {id: 1, name: "main", title: "Main agent", sub: "builder", number: "Main", role: "main", program: "Claude Code", model: "Opus 5.5", effort: "high", dot: "working", doing: "Working", since: "Since 09:12", seen: "Seen just now", startedBy: "Jesse", task: 9597, plan: 1131, perHour: 0, command: "sed -n 55,80p src/core/modules/agents/support/agent_rows.py", reports: 2, memories: 4, helpers: 3, skills: 14, running: "4 h 12 min", failed: 0, brief: "Build the agent journal with the user. Keep plans moving, send workers for contained work, and answer each message in plain words."},
  {id: 4, name: "worker-4", title: "Worker 4", sub: "worker", number: "Worker 4", role: "worker", program: "Claude Code", model: "Sonnet 5.5", effort: "medium", dot: "working", doing: "Working", since: "Since 11:02", seen: "Seen 20 s ago", startedBy: "main", task: 9682, plan: 1131, perHour: 1.4, command: "pytest src/viewer/tests/planCard.test.js -q", reports: 1, memories: 2, helpers: 0, skills: 9, running: "52 min", failed: 1, unit: "viewer polish", brief: "Plan card agent badges: no Agents: label, centred text, smaller icon. Prove it with the planCard test and a screenshot of the plans window."},
  {id: 7, name: "worker-7", title: "Worker 7", sub: "worker", number: "Worker 7", role: "worker", program: "Claude Code", model: "Sonnet 5.5", effort: "medium", dot: "waiting", doing: "Blocked: waits on task 9682 for the shared row", wait: "", since: "Since 11:40", seen: "Seen 6 min ago", startedBy: "main", task: 9683, plan: 1131, perHour: 0.8, command: "", reports: 0, memories: 1, helpers: 0, skills: 7, running: "1 h 3 min", failed: 0, brief: "File feed shows a moved file as moved, with where it came from."},
  {id: 12, name: "helper-851", title: "Helper 851", sub: "designer", number: "Helper 851", role: "helper", readOnly: true, program: "Claude Code", model: "Opus 5.5", effort: "high", dot: "thinking", doing: "Working", since: "Since 11:54", seen: "Seen just now", startedBy: "main", job: "Redraw the agent inspector and the drill-down of the Agents window to match the viewer, with a little more flair", jobTitle: "Agent inspector redraw", jobLaunch: "claude, resumed", command: "journal doc show 1275 --section 35", reports: 3, memories: 7, helpers: 0, skills: 11, running: "18 min", failed: 0, sandboxOff: true, brief: "Redraw the agent inspector and the drill-down of the Agents window to match the viewer, with a little more flair. Pin the design and report."},
  {id: 15, name: "reviewer-3", title: "Reviewer 3", sub: "reviewer", number: "Reviewer 3", role: "helper", readOnly: true, program: "Codex", model: "GPT-5", effort: "medium", dot: "waiting", doing: "Waiting: the process queue runs pytest tests/stories", wait: "the process queue runs pytest tests/stories", since: "Since 12:01", seen: "Seen 2 min ago", startedBy: "main", job: "Review plan 1133 against doc 1275", jobTitle: "Review plan 1133", jobLaunch: "codex, new conversation", command: "", reports: 1, memories: 0, helpers: 0, skills: 4, running: "9 min", failed: 0, brief: "Review plan 1133 against doc 1275 and report what does not hold."},
  {id: 20, name: "worker-2", title: "Worker 2", sub: "worker", number: "Worker 2", role: "worker", program: "Claude Code", model: "Sonnet 5.5", effort: "low", dot: "ended", ended: true, doing: "Idle: its process has stopped", since: "Since 10:31", seen: "Seen 1 h ago", startedBy: "main", task: 9680, plan: 1131, perHour: 2.1, command: "", reports: 2, memories: 0, helpers: 0, skills: 6, running: "1 h 40 min", failed: 0, brief: "The sins drain teaches: after fixing an area, rerun only that detector."},
  {id: 21, name: "helper-844", title: "Helper 844", sub: "researcher", number: "Helper 844", role: "helper", readOnly: true, program: "Claude Code", model: "Haiku 5.5", effort: "low", dot: "retired", ended: true, retired: true, retiredAt: "2 h ago", retiredBy: "main", retireReason: "Its job is done; the report is report 1376.", doing: "Retired", since: "Since 09:58", seen: "Seen 2 h ago", startedBy: "main", job: "Group the full-run failures by detector", jobTitle: "Full-run failures", jobLaunch: "claude, new conversation", command: "", reports: 1, memories: 0, helpers: 0, skills: 3, running: "26 min", failed: 0, brief: "Group the full-run failures by detector and file one report."},
];
const r8Agent = (id) => R8_AGENTS.find((a) => a.id === id) || R8_AGENTS[0];
const r8Live = (a) => !a.ended;
const R8_SHOWS = [{key: "running", label: "Working"}, {key: "idle", label: "Idle"}, {key: "retired", label: "Retired"}, {key: "all", label: "All"}];
const R8_EMPTY = {running: ["No agents working", "Agents with work in progress appear here."], idle: ["No agents idle", "Kept agents whose process has stopped appear here."], retired: ["No agents retired", "Retired agents appear here."], all: ["No agents yet", "Helpers started by the main agent appear here."]};
const r8Shown = (a, show) => ({running: r8Live(a), idle: a.ended && !a.retired, retired: Boolean(a.retired), all: true}[show]);
const r8Identity = (a) => [a.program, a.model, a.effort, a.number].join(" · ");
const r8TasksOf = (a) => TASKS.filter((t) => t.by === a.name || t.id === a.task);

/* ---------- the status dot in a card's corner: pulses while it works or thinks, still when it waits, a ring once retired ---------- */
function R8Dot({a}) {
  return <span className="r8-dot" data-state={a.dot} tabIndex={0} aria-label={[a.doing, a.since, a.seen].join(". ")} onClick={(e) => e.stopPropagation()}>
    <i />
    <span className="r8-tip" role="tooltip"><b>{a.doing}</b><span>{a.since}</span><span>{a.seen}</span></span>
  </span>;
}

/* ---------- a card's foot line: the job of a helper, or the plan or task in hand, its pace, and the bar of its tasks ---------- */
function R8TaskLine({a}) {
  const {open} = useOpen();
  const ts = r8TasksOf(a);
  const done = ts.filter((t) => t.state === "completed").length;
  const testing = ts.filter((t) => t.state === "testing").length;
  const go = (term, id) => (e) => { e.stopPropagation(); open(term, id); };
  if (a.job) return <span className="r8-task-line"><span className="r8-job" title={a.job}>{a.jobTitle}</span><span className="r8-faint">{a.jobLaunch}</span></span>;
  const t = TASKS.find((x) => x.id === a.task);
  return <span className="r8-task-line">
    {a.plan && <button type="button" className="r8-ref" title={PLANS.find((p) => p.id === a.plan)?.title} onClick={go("plan", a.plan)}>Plan {a.plan}</button>}
    {t && <button type="button" className="r8-ref quiet" title={t.title} onClick={go("task", t.id)}>Task {t.id}</button>}
    <span className="grow" />
    {a.role !== "main" && <span className="r8-faint" title="Tasks done an hour">{a.perHour}/h</span>}
    {ts.length > 0 && <span className="r8-tbar" title={`${done} of ${ts.length} done, ${testing} in testing`}><i style={{width: `${(done / ts.length) * 100}%`}} /><i className="testing" style={{width: `${(testing / ts.length) * 100}%`}} /></span>}
  </span>;
}

/* ---------- one card of the list ---------- */
function R8Card({a, index, onOpen}) {
  return <div className={"r8-card" + (a.lingering ? " lingering" : "")} data-state={a.dot} role="button" tabIndex={0} style={{animationDelay: `${index * 40}ms`}} onClick={() => onOpen(a)} onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), onOpen(a))}>
    <span className="r8-rail" aria-hidden="true" />
    <span className="r8-head"><span className="r8-title">{a.title}</span><span className="r8-sub">{a.sub}</span><span className="r8-chev"><Icon name="right" size={11} /></span></span>
    <span className="r8-line"><span className="r8-identity">{r8Identity(a)}</span>{a.sandboxOff && <span className="r8-warn">sandbox off</span>}</span>
    {a.unit && <span className="r8-unit">Unit: {a.unit}</span>}
    <R8TaskLine a={a} />
    <R8Dot a={a} />
  </div>;
}

/* ---------- the Actions panel under an open card's head (AgentActions.vue) ---------- */
function R8Actions({a}) {
  const toast = useToast();
  const [mode, setMode] = useState("");
  const [text, setText] = useState("");
  const idle = a.ended && !a.retired;
  const blocked = a.dot === "waiting" && !a.wait;
  const form = {
    job: ["Send a job", "What should it do?", "Send", "Job sent."],
    driver: ["Change driver", "Program and model, such as claude, Opus 5.5", "Change", "Driver changed."],
    retire: ["Retire", "Why is it retired? It cannot be started again.", "Retire", "Agent retired permanently."],
  }[mode];
  const submit = () => { if (!text.trim()) return; toast(form[3]); setMode(""); setText(""); };
  return <div className="r8-actions" onClick={(e) => e.stopPropagation()}>
    <div className="row" style={{gap: 6, flexWrap: "wrap"}}>
      <Btn small onClick={() => setMode(mode === "history" ? "" : "history")}>Session history</Btn>
      {blocked && <Btn small onClick={() => toast("Hold lifted.")}>Lift this hold</Btn>}
      {idle && <><Btn small onClick={() => setMode("job")}>Send a job</Btn><Btn small onClick={() => setMode("driver")}>Change driver</Btn><Btn small onClick={() => setMode("retire")}>Retire</Btn></>}
      {!idle && !a.retired && <span className="r8-faint" style={{fontSize: 11.5}}>Send a job, Change driver and Retire wait until its process stops</span>}
    </div>
    {mode === "history" && <div className="r8-history">{[["3f2a91", "today 09:12", "running"], ["b81c04", "yesterday 16:40", "ended, compacted 2 times"], ["77d0aa", "yesterday 10:05", "ended"]].map(([s, at, how]) => <div key={s} className="r8-hrow"><span className="mono">{s}</span><span>{at}</span><span className="r8-faint">{how}</span></div>)}</div>}
    {form && <form className="r8-form" onSubmit={(e) => { e.preventDefault(); submit(); }}>
      <label className="r8-faint">{form[0]}</label>
      <input className="qbox" autoFocus value={text} placeholder={form[1]} onChange={(e) => setText(e.target.value)} />
      <div className="row" style={{gap: 6}}><Btn small type="submit" variant={mode === "retire" ? "danger" : "primary"} disabled={!text.trim()}>{form[2]}</Btn><Btn small variant="ghost" onClick={() => setMode("")}>Cancel</Btn></div>
    </form>}
  </div>;
}

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
  if (!ts.length) return <Empty title="No tasks" line="No tasks have been assigned to this agent." />;
  const groups = [["started", "Started", ["started", "testing"]], ["blocked", "Blocked", ["blocked"]], ["open", "Open", ["open"]], ["completed", "Completed", ["completed", "cancelled"]]];
  return <div className="col" style={{gap: 0}}>
    {groups.map(([k, label, states]) => { const rows = ts.filter((t) => states.includes(t.state)); if (!rows.length) return null; const shut = folded[k];
      return <div key={k} className="r8-tgroup"><button type="button" className="r8-tgroup-head" aria-expanded={!shut} onClick={() => setFolded({...folded, [k]: !shut})}><Chevron open={!shut} /><span>{label}</span><span className="r8-faint">{rows.length}</span></button>
        {!shut && rows.map((t) => <TaskRow key={t.id} t={t} end={<Badge state={t.state} />} />)}</div>; })}
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
function R8ReportsTab({a}) {
  const {open} = useOpen();
  const rows = R8_REPORTS.slice(0, a.reports);
  if (!rows.length) return <Empty title="No reports" line="This agent has not sent any reports." />;
  return <div className="col" style={{gap: 0}}>{rows.map((r) => <button key={r.id} type="button" className="r8-report" onClick={() => open("report", r.id)}><span className="rc"><span className="k">Report</span><span className="n">{r.id}</span></span><span className="ellipsis">{r.text}</span></button>)}</div>;
}
function R8ProcessesTab({a}) {
  const {open} = useOpen();
  const rows = OUTPUTS.filter((o) => o.by === a.name);
  if (!rows.length) return <Empty title="No processes" line="This agent has run no command through the journal yet." />;
  return <div className="col" style={{gap: 0}}>{rows.map((o) => <button key={o.id} type="button" className="r8-report" onClick={() => open("output", o.id)}><span className="rc"><span className="k">Output</span><span className="n">{o.id}</span></span><span className="ellipsis mono" style={{fontSize: 12}}>{o.line}</span><Badge state={o.state} /></button>)}</div>;
}
const R8_TAB_BODIES = {tasks: R8TasksTab, transcript: R8TranscriptTab, terminal: () => <NowTerminal />, feed: () => <NowFeed />, processes: R8ProcessesTab, reports: R8ReportsTab, memories: () => <div style={{padding: "12px var(--inset)"}}><AgentMemoriesTab /></div>};

/* ---------- the command band at the foot of an open card (AgentCommand.vue) ---------- */
function R8CommandBand({a}) {
  const {open} = useOpen();
  if (a.ended && !a.retired) return <div className="r8-command"><span className="r8-faint">Idle since {a.since.replace("Since ", "")}: its process has stopped</span></div>;
  if (a.wait) return <div className="r8-command"><button type="button" className="r8-waiting" title="Open the process queue" onClick={() => open("output", 490026)}>Waiting: {a.wait} <Icon name="right" size={10} /></button></div>;
  if (a.dot === "waiting") return <div className="r8-command"><span className="r8-faint">Waiting</span></div>;
  return <div className="r8-command live"><span className="r8-live-dot" /><span className="r8-run mono">{a.command || "thinking"}</span></div>;
}

/* ---------- an open card: it takes the whole window until Back or Escape ---------- */
function R8OpenCard({a, onClose}) {
  const {open} = useOpen();
  const [menu, setMenu] = useState(false);
  const first = a.readOnly || a.retired ? "transcript" : "tasks";
  const [tab, setTab] = useState(first);
  const tabs = [
    {key: "tasks", label: "Tasks", count: r8TasksOf(a).length}, {key: "transcript", label: "Transcript"}, {key: "terminal", label: "Terminal"},
    {key: "feed", label: "File feed"}, {key: "processes", label: "Processes"}, {key: "reports", label: "Reports", count: a.reports}, {key: "memories", label: "Memories", count: a.memories},
  ];
  const Body = R8_TAB_BODIES[tab];
  return <div className="r8-open" data-state={a.dot}>
    <div className="r8-ohead">
      <button type="button" className="r8-back" title="Back to the agents" aria-label="Back" onClick={onClose}><Icon name="back" size={14} /></button>
      <span className="r8-otitle">{a.title}</span><span className="r8-sub">{a.name} · {a.sub}</span>
      <span className="grow" />
      <Btn small variant="ghost" className={menu ? "on" : ""} onClick={() => setMenu(!menu)}>Actions</Btn>
      <Btn small title="Inspect: open this agent's inspector" onClick={() => open("agent", a.id)}>Inspect</Btn>
      <R8Dot a={a} />
    </div>
    {menu && <R8Actions a={a} />}
    {a.retired ? <dl className="r8-lasting"><div><dt>Retired</dt><dd>{a.retiredAt}</dd></div><div><dt>Retired by</dt><dd>{a.retiredBy}</dd></div><div><dt>Retirement reason</dt><dd>{a.retireReason}</dd></div></dl>
      : <div className="r8-band"><InfoBar agentId={a.id} card end={a.sandboxOff ? <span className="r8-warn">sandbox off</span> : null} /></div>}
    <Tabs tabs={tabs} value={tab} onPick={setTab} />
    <div className="r8-obody view-in" key={tab}><Body a={a} /></div>
    {!a.retired && <R8CommandBand a={a} />}
  </div>;
}

/* ---------- the Agents window: search, filters and tabs, then the cards; a card opens in place ---------- */
function R8AgentsWindow() {
  const [show, setShow] = useState("running");
  const [words, setWords] = useState("");
  const [filters, setFilters] = useState({roles: [], programs: []});
  const [openId, setOpenId] = useState(null);
  const [closing, setClosing] = useState(false);
  const flip = (group, value) => setFilters({...filters, [group]: filters[group].includes(value) ? filters[group].filter((v) => v !== value) : [...filters[group], value]});
  const count = filters.roles.length + filters.programs.length;
  const rows = R8_AGENTS.filter((a) => r8Shown(a, show) && (!filters.roles.length || filters.roles.includes(a.role)) && (!filters.programs.length || filters.programs.includes(a.program)) && `${a.name} ${a.title} ${a.sub} ${a.model}`.toLowerCase().includes(words.toLowerCase()));
  // worker-2 ended a minute ago: it stays at the foot of Working, faded, for five minutes
  const lingering = show === "running" && !words && !count ? [{...r8Agent(20), lingering: true}] : [];
  const opened = openId == null ? null : r8Agent(openId);
  const close = () => { setClosing(true); setTimeout(() => { setOpenId(null); setClosing(false); }, 140); };
  // Escape closes the open card, as one layer of the kit's layer stack
  useLayer(Boolean(opened), close);
  if (opened) return <div className={"r8-agents focused" + (closing ? " closing" : "")}><R8OpenCard key={opened.id} a={opened} onClose={close} /></div>;
  const [title, hint] = R8_EMPTY[show];
  return <div className="r8-agents">
    <div className="r8-bar">
      <SearchField value={words} onChange={setWords} placeholder="Search agents" style={{flex: 1, height: 28}} />
      <Menu width={220} button={({toggle, open}) => <button type="button" className={"r8-filter" + (open ? " on" : "")} title="Filter the agents" onClick={toggle}><Icon name="filter" size={12} />{count > 0 && <span className="r8-fcount">{count}</span>}</button>}>{() => <>
        <div className="menu-label">Type</div>{[["main", "Main"], ["worker", "Worker"], ["helper", "Helper"]].map(([k, l]) => <MenuItem key={k} check={filters.roles.includes(k)} onClick={() => flip("roles", k)}>{l}</MenuItem>)}
        <div className="menu-label">Program</div>{["Claude Code", "Codex"].map((p) => <MenuItem key={p} check={filters.programs.includes(p)} onClick={() => flip("programs", p)}>{p}</MenuItem>)}
        {count > 0 && <><div className="menu-sep" /><MenuItem onClick={() => setFilters({roles: [], programs: []})}>Clear filters</MenuItem></>}
      </>}</Menu>
      <Seg value={show} onPick={setShow} options={R8_SHOWS.map((s) => ({...s, count: R8_AGENTS.filter((a) => r8Shown(a, s.key)).length}))} />
    </div>
    {show === "retired" && <p className="r8-upgrade">Retired during the upgrade: 2</p>}
    <div className="r8-list">
      {[...rows, ...lingering].map((a, i) => <R8Card key={a.id + (a.lingering ? "-l" : "")} a={a} index={i} onOpen={(x) => setOpenId(x.id)} />)}
      {!rows.length && (count ? <Empty title="No agents match the filters" action={<Btn small onClick={() => setFilters({roles: [], programs: []})}>Clear filters</Btn>} /> : <Empty title={words ? "No agent matches the search" : title} line={words ? "Try another name, profile or model" : hint} />)}
    </div>
  </div>;
}
NOW_WINDOWS.agents = R8AgentsWindow;

/* ---------- the agent inspector (AgentDetail.vue): who, the attribute band, figures, Doing now, Brief, Recent, folds ---------- */
function R8Strip({a}) {
  const s = sessionOf(a.id);
  const cells = [
    ["time", a.ended ? "Ran for" : "Running for", a.running],
    ["context", "Context used", `${s.context}%`, s.context, s.context > 80],
    ["cost", "Cost", dollars(s.cost)],
    a.role === "main" ? ["done", "Tasks done", "3 of 8"] : ["pace", "Tasks an hour", String(a.perHour)],
    ["failed", "Failed runs", String(a.failed), undefined, a.failed > 0],
  ];
  return <div className="r8-strip">{cells.map(([k, label, value, meter, bad]) => <div key={k} className="r8-cell"><small>{label}</small><b className={bad && meter === undefined ? "bad" : ""}>{value}</b>{meter !== undefined && <div className="r8-meter"><i className={bad ? "high" : ""} style={{width: `${meter}%`}} /></div>}</div>)}</div>;
}
function R8BandHead({icon, children, count}) {
  return <h3 className="r8-bandh"><Icon name={icon} size={12} />{children}{count != null && <span>{count}</span>}</h3>;
}
function R8Fold({icon, label, count, children}) {
  const [open, setOpen] = useState(false);
  return <div className="r8-fold"><button type="button" className="r8-bandh fold" aria-expanded={open} onClick={() => setOpen(!open)}><Chevron open={open} /><Icon name={icon} size={12} />{label}{count != null && <span>{count}</span>}</button>{open && <div className="r8-fold-body view-in">{children}</div>}</div>;
}
const R8_MOVES = [["Ran output 489998", "output", 489998, "bad", "25 min ago"], ["Filed report 1398", "report", 1398, "good", "40 min ago"], ["Read skill journal-tasks", null, null, "", "1 h ago"], ["Started task 9597", "task", 9597, "work", "1 h ago"], ["Made memory 822", "memory", 822, "", "2 h ago"]];
function R8Overview({a}) {
  const {open} = useOpen();
  const [whole, setWhole] = useState(false);
  const t = TASKS.find((x) => x.id === a.task);
  const plan = PLANS.find((p) => p.id === a.plan);
  const pts = plan ? plan.phases.flatMap((p) => p.tasks).map((id) => TASKS.find((x) => x.id === id)).filter(Boolean) : [];
  const done = pts.filter((x) => x.state === "completed").length;
  return <div className="r8-overview">
    <R8Strip a={a} />
    <R8BandHead icon="play">Doing now</R8BandHead>
    <div className="r8-now">
      {t ? <button type="button" className="r8-link" onClick={() => open("task", t.id)}>Task {t.id}: {t.title}</button> : <span className="r8-faint">{a.ended ? "It finished no task." : "It has no task. It was given an instruction."}</span>}
      {!a.ended && <span className="r8-doing">{a.command ? <><span className="r8-live-dot" /><span className="mono">Command: {a.command}</span></> : a.wait ? `Waiting: ${a.wait}` : a.dot === "thinking" ? "Thinking" : a.doing}</span>}
      <span className="r8-faint" style={{fontSize: 11.5}}>{a.seen}</span>
    </div>
    {plan && <div className="r8-plan"><div className="row"><span>Plan {plan.id}, phase {plan.phases.find((p) => p.tasks.includes(a.task))?.n || 1}</span><span className="grow" /><button type="button" className="r8-link" onClick={() => open("plan", plan.id)}>Show the plan</button></div><span className="r8-faint" style={{fontSize: 11.5}}>{done} of {pts.length} tasks done</span><div className="r8-meter wide"><i style={{width: `${pts.length ? (done / pts.length) * 100 : 0}%`}} /></div></div>}
    <R8BandHead icon="file">{a.readOnly ? "Instruction" : "Brief"}</R8BandHead>
    <div className={"r8-brief" + (whole ? "" : " clamp")}>{a.brief}</div>
    {!whole && a.brief.length > 150 && <button type="button" className="r8-link r8-more" onClick={() => setWhole(true)}>Show all</button>}
    <R8BandHead icon="clock">Recent</R8BandHead>
    <div className="r8-moves">{R8_MOVES.map(([text, term, id, tone, at]) => term ? <button key={text} type="button" className="r8-move" onClick={() => open(term, id)}><i className={"r8-mdot " + tone} /><span className="ellipsis">{text}</span><span className="r8-faint">{at}</span></button> : <div key={text} className="r8-move"><i className={"r8-mdot " + tone} /><span className="ellipsis">{text}</span><span className="r8-faint">{at}</span></div>)}</div>
    <R8Fold icon="agents" label="Helpers" count={a.helpers}>{a.helpers ? AGENTS.filter((x) => x.role !== "Main agent").slice(0, a.helpers).map((x) => <button key={x.id} type="button" className="r8-move" onClick={() => open("agent", x.id)}><span>{x.name}</span><span className="r8-faint">{x.role}</span></button>) : <p className="r8-faint" style={{margin: "0 var(--inset)"}}>It started no helpers.</p>}</R8Fold>
    <R8Fold icon="book" label="Skills" count={a.skills}>{SKILLS.slice(0, 4).map((k) => <div key={k.id} className="r8-move"><span>{k.title}</span></div>)}</R8Fold>
    <R8Fold icon="more" label="Details" count={null}><Fields rows={[["Number", String(a.id)], ["Session", <span className="mono">{sessionOf(a.id).session}</span>], ["Program", a.program], ["Type", a.role], ["Started by", a.startedBy], ["Started", a.since.replace("Since ", "today ")], ["Process", a.ended ? "none" : "pid 48213"]]} /></R8Fold>
    {a.ended && <p className="r8-ended">Ended {a.retired ? a.retiredAt : "1 h ago"}. It takes no more actions.</p>}
  </div>;
}
function AgentInspector({id, onClose, onOpen, onBack}) {
  const a = r8Agent(id);
  const [paused, setPaused] = useState(false);
  const actions = [
    ...(a.ended ? [] : [{group: "Session", label: paused ? "Resume the agent" : "Pause the agent", icon: paused ? "play" : "pause", desc: "Only journal commands and reads run while paused", run: () => setPaused(!paused)},
      {group: "Session", label: "Send a message", icon: "chat", field: {label: "Message", placeholder: "Tell the agent…"}, confirm: "Send"}]),
    ...CONTEXT_ACTIONS("agent", a.id),
    ...(a.ended ? [] : [{group: "Danger", label: "Stop the session", icon: "stop", danger: true, field: {label: "Why does it stop?"}, confirm: "Stop"}]),
  ];
  const state = a.retired ? "retired" : a.ended ? "ended" : paused ? "paused" : a.dot === "waiting" ? "blocked" : "started";
  const title = <span className="r8-name"><i className="r8-sdot" data-state={paused ? "waiting" : a.dot} />{a.name}</span>;
  const bar = <div className="r8-who">{a.retired ? <span className="r8-faint">Retired {a.retiredAt} by {a.retiredBy}</span> : <InfoBar agentId={a.id} card />}<p className="r8-started">Started by: {a.startedBy}{a.job ? <> · Job: {a.jobTitle}</> : null}</p></div>;
  const tabs = [
    {key: "overview", label: "Overview", flush: true, render: () => <R8Overview a={a} />},
    {key: "memories", label: "Memories", count: a.memories, render: () => <AgentMemoriesTab />},
  ];
  return <InspectorShell term="agent" id={a.id} kind={`Agent ${a.id} · ${a.number}`} state={state} title={title} bar={bar} width="medium" actions={actions} tabs={tabs} comments={false}
    links={r8TasksOf(a).map((t) => ({kind: "Task", term: "task", id: t.id, title: t.title, state: t.state, icon: "task"}))} onClose={onClose} onOpen={onOpen} onBack={onBack} />;
}

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

Object.assign(window, {R8_AGENTS, R8AgentsWindow, R8OpenCard, AgentInspector, HomeNow});
