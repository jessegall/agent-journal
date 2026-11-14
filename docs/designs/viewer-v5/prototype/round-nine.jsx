// Round nine (message 121106): the process queue inspector. Replaces by name: InspectorFor, HomeAgentBar and R8CommandBand.
// 1. Every process the journal runs shows in the queue, not only tests, builds and checks. Those wait for a place; the rest start at once and say so.
// 2. The setting Commands at once is called Processes at once.
// 3. The action Halt the queue is Pause the queue; Resume the queue stays.
// 4. One compact row per process, readable at a glance; a row folds out to its output.

const Q9_KINDS = {"test run": "test", build: "build", check: "check", plugin: "plugin", read: "read", search: "search", edit: "edit", "version control": "git", package: "package", network: "network", "background job": "job", process: "process", journal: "journal", unknown: "other"};
// the categories that wait for a place (CommandCategory.is_queued, and a plugin's runs); every other process starts at once
const Q9_QUEUED = new Set(["test run", "build", "check", "plugin"]);
const Q9_RUNS = [
  {id: 490031, section: "running", category: "test run", line: "pytest tests/stories -x -q", agent: "worker-4", task: 9682, time: "2 m 14 s", slot: true, out: ["collected 412 items", "tests/stories/test_launch.py ........", "tests/stories/test_queue.py ......F", "tests/stories/test_plans.py ...."]},
  {id: 490030, section: "running", category: "build", line: "npm --prefix src/viewer run build", agent: "worker-7", task: 9683, time: "48 s", slot: true, out: ["vite v5.4.2 building for production...", "transforming (812) src/resource/ProcessQueueRun.vue"]},
  {id: 490029, section: "running", category: "test run", line: "pytest tests/unit/processes -q", agent: "main", task: 9597, time: "31 s", slot: true, main: true, out: ["........................................ [ 61%]"]},
  {id: 490028, section: "running", category: "read", line: "sed -n 55,80p src/core/modules/agents/support/agent_rows.py", agent: "main", task: 9597, time: "0 s", slot: false, out: ["    rows = self.queries.query(AgentRow)", "    return rows.matching(IsNull(\"retired_at\"))"]},
  {id: 490027, section: "running", category: "background job", line: "journal-run watch src/viewer --build", agent: "worker-4", task: 9682, time: "14 m 2 s", slot: false, out: ["watching src/viewer for changes"]},
  {id: 490034, section: "waiting", category: "test run", line: "pytest tests/stories/test_agents.py -q", agent: "reviewer-3", task: null, time: "1 m 3 s", out: []},
  {id: 490035, section: "waiting", category: "check", line: "journal check run sins", agent: "worker-7", task: 9683, time: "40 s", out: []},
  {id: 490036, section: "waiting", category: "plugin", plugin: "ponytail", line: "ponytail audit --changed", agent: "helper-851", task: null, time: "12 s", out: []},
  {id: 490026, section: "finished", category: "test run", line: "pytest tests/stories/test_launch.py -x -q", agent: "worker-4", task: 9682, time: "4.2 s", exit: 1, out: ["F", "FAILED tests/stories/test_launch.py::test_settings_text", "1 failed in 4.21 s"]},
  {id: 490025, section: "finished", category: "version control", line: "git status --short", agent: "worker-4", task: 9682, time: "0.1 s", exit: 0, out: [" M src/viewer/src/resource/ProcessQueueRun.vue"]},
  {id: 490024, section: "finished", category: "search", line: "grep -rn \"Halt the queue\" src", agent: "helper-851", task: null, time: "0.3 s", exit: 0, out: ["src/core/modules/processes/support/queue_inspector.py:17: ...\"Halt the queue\"..."]},
  {id: 490023, section: "finished", category: "build", line: "npm --prefix src/viewer run build", agent: "worker-7", task: 9683, time: "1 m 12 s", exit: 0, out: ["✓ built in 71.84 s"]},
  {id: 490022, section: "finished", category: "edit", line: "Edit src/viewer/src/resource/ProcessQueueControls.vue", agent: "worker-7", task: 9683, time: "0 s", exit: 0, out: ["1 line changed"]},
  {id: 490021, section: "finished", category: "test run", line: "pytest tests/unit/processes -q", agent: "main", task: 9597, time: "38 s", exit: 0, main: true, out: ["212 passed in 37.9 s"]},
  {id: 490020, section: "finished", category: "check", line: "journal check run sins", agent: "worker-4", task: 9682, time: "9 s", exit: 2, out: ["3 sins in src/viewer/src/resource", "exit 2"]},
  {id: 490019, section: "finished", category: "network", line: "curl -s https://registry.npmjs.org/vite", agent: "worker-7", task: 9683, time: "0.6 s", exit: 0, out: ["{\"name\":\"vite\", ...}"]},
];
const q9Waits = (r) => Q9_QUEUED.has(r.category);
const q9Kind = (r) => (r.plugin ? r.plugin : Q9_KINDS[r.category] || r.category);
const q9Register = () => { if (typeof INSPECTED !== "undefined" && !INSPECTED.includes("queue")) INSPECTED.push("queue"); };
if (typeof WIDTH_OF !== "undefined") WIDTH_OF.queue = "medium";
if (typeof TERM_WORDS !== "undefined") TERM_WORDS.queue = "Process queue";
const q9OpenQueue = (open) => { q9Register(); open("queue", 1); };

/* ---------- one process: a line of fixed columns; it folds out to its output ---------- */
function Q9Row({r, position, open, onToggle}) {
  const {open: openRow} = useOpen();
  const failed = r.section === "finished" && r.exit !== 0;
  const lead = r.section === "waiting" ? <span className="q9-pos">{position}</span>
    : <span className={"q9-dot" + (r.section === "running" ? (r.slot ? " run" : " free") : failed ? " bad" : " ok")} title={r.section === "running" ? (r.slot ? "Running, takes a place" : "Running, started at once without a place") : failed ? `Failed, exit ${r.exit}` : "Finished"} />;
  const go = (term, id) => (e) => { e.stopPropagation(); openRow(term, id); };
  return <div className={"q9-run" + (open ? " open" : "") + (failed ? " failed" : "")} data-section={r.section}>
    <button type="button" className="q9-line" aria-expanded={open} title={r.line} onClick={onToggle}>
      <span className="q9-lead">{lead}</span>
      <span className={"q9-kind" + (q9Waits(r) ? " waits" : "")} title={q9Waits(r) ? "Waits for a place" : "Starts at once"}>{q9Kind(r)}</span>
      <span className="q9-cmd">{r.line}</span>
      <span className="q9-who" role="link" tabIndex={-1} onClick={go("agent", (AGENTS.find((a) => a.name === r.agent) || {}).id)}>{r.agent}</span>
      <span className={"q9-time" + (failed ? " bad" : "")}>{failed ? `exit ${r.exit}` : r.time}</span>
      <span className="q9-chev"><Icon name="down" size={11} /></span>
    </button>
    <div className="q9-drop"><div className="q9-drop-inner">
      <div className="q9-out">
        <div className="q9-out-head">
          <span>Output {r.id}</span>
          {r.task && <><span className="q9-sep">·</span><button type="button" className="q9-a" onClick={go("task", r.task)}>Task {r.task}</button></>}
          <span className="q9-sep">·</span><span>{r.section === "waiting" ? `waiting ${r.time}` : r.section === "running" ? `running ${r.time}` : `took ${r.time}`}</span>
          {r.main && <><span className="q9-sep">·</span><span>main agent</span></>}
          <span className="grow" />
          <button type="button" className="q9-a" onClick={go("output", 489998)}>Open the output</button>
        </div>
        <pre>{r.section === "waiting" ? <span className="q9-muted">It has not started. It gets place {position} in line.</span> : <><span className="q9-prompt">$ </span>{r.line}{r.out.length ? "\n" + r.out.join("\n") : ""}{r.section === "running" && <span className="q9-caret" />}</>}</pre>
      </div>
    </div></div>
  </div>;
}

/* ---------- the glance: places in use, how many wait, how the last ones ended ---------- */
function Q9Glance({limit, paused, onSettings}) {
  const running = Q9_RUNS.filter((r) => r.section === "running");
  const used = running.filter((r) => r.slot).length;
  const waiting = Q9_RUNS.filter((r) => r.section === "waiting").length;
  const finished = Q9_RUNS.filter((r) => r.section === "finished");
  const failed = finished.filter((r) => r.exit !== 0).length;
  return <div className="q9-glance">
    <div className="q9-g"><small>Places in use</small><b>{used}<span> of {limit}</span></b>
      <div className="q9-slots" aria-label={`${used} of ${limit} places in use`}>{Array.from({length: limit}, (_, i) => <i key={i} className={i < used ? "on" : ""} />)}</div>
      <button type="button" className="q9-a" onClick={onSettings}>Processes at once: {limit}</button></div>
    <div className="q9-g"><small>Waiting</small><b className={paused && waiting ? "warn" : ""}>{waiting}</b><span className="q9-note">{paused ? "Held while paused" : waiting ? "The oldest goes first" : "Nothing waits"}</span></div>
    <div className="q9-g"><small>Running at once</small><b>{running.length - used}</b><span className="q9-note">Reads, edits and the like need no place</span></div>
    <div className="q9-g"><small>Finished</small><b>{finished.length}</b><span className={"q9-note" + (failed ? " bad" : "")}>{failed ? `${failed} failed` : "None failed"}</span></div>
  </div>;
}

function Q9Queue({limit, paused, reason, onSettings}) {
  const [opened, setOpened] = useState(new Set([490031]));
  const [more, setMore] = useState(false);
  const flip = (id) => { const s = new Set(opened); s.has(id) ? s.delete(id) : s.add(id); setOpened(s); };
  const sections = [["running", "Running", "play", "Nothing is running."], ["waiting", "Waiting", "clock", "Nothing waits. A test, build or check that starts now gets a place at once."], ["finished", "Finished", "check", "Nothing has run yet."]];
  return <div className="q9-queue">
    {paused && <div className="q9-paused" role="status"><Icon name="pause" size={13} /><span><b>The queue is paused.</b> No waiting process gets a place until you resume it; running ones go on, and reads and edits still start at once.{reason ? ` Reason: ${reason}` : ""}</span></div>}
    <Q9Glance limit={limit} paused={paused} onSettings={onSettings} />
    {sections.map(([key, label, icon, empty]) => { let rows = Q9_RUNS.filter((r) => r.section === key); const total = rows.length; if (key === "finished" && !more) rows = rows.slice(0, 6);
      return <section key={key} className="q9-section">
        <h3 className="q9-band"><Icon name={icon} size={12} />{label}<span>{total}</span></h3>
        {rows.length ? rows.map((r, i) => <Q9Row key={r.id} r={r} position={i + 1} open={opened.has(r.id)} onToggle={() => flip(r.id)} />) : <p className="q9-empty">{empty}</p>}
        {key === "finished" && total > 6 && !more && <button type="button" className="q9-older" onClick={() => setMore(true)}>Show older processes</button>}
      </section>; })}
  </div>;
}

/* ---------- the settings of the queue ---------- */
function Q9Settings({limit, setLimit}) {
  const toast = useToast();
  const [main, setMain] = useState(true);
  const [tests, setTests] = useState(2);
  const set = (n) => { setLimit(n); toast(`Processes at once: ${n}`); };
  return <div className="q9-settings">
    <div className="q9-set"><div className="grow"><label id="q9-limit">Processes at once</label><p>How many tests, builds and checks may run at the same time. The rest wait their turn. Lowering it stops none that are running.</p><code>process.run_batch_size</code></div>
      <div className="q9-step" role="group" aria-labelledby="q9-limit"><button type="button" aria-label="One fewer" disabled={limit <= 1} onClick={() => set(limit - 1)}>−</button><output>{limit}</output><button type="button" aria-label="One more" onClick={() => set(limit + 1)}>+</button></div></div>
    <div className="q9-set"><div className="grow"><label htmlFor="q9-tests">Test runs per worker</label><p>A limit the coding suite adds: how many of one worker's test runs may hold a place at once. 0 is no limit.</p></div>
      <input id="q9-tests" className="qbox q9-num" type="number" min="0" value={tests} onChange={(e) => setTests(Number(e.target.value))} /></div>
    <div className="q9-set"><div className="grow"><label id="q9-main">Count the main agent</label><p>Its processes always start right away, but each test or build takes a place, so fewer workers run at once.</p></div>
      <Switch on={main} onChange={setMain} title="Count the main agent" /></div>
  </div>;
}

function QueueInspector({onClose, onOpen, onBack}) {
  const [paused, setPaused] = useState(false);
  const [reason, setReason] = useState("");
  const [limit, setLimit] = useState(3);
  const [tab, setTab] = useState(null);
  const actions = [
    paused ? {group: "Queue", label: "Resume the queue", icon: "play", run: () => { setPaused(false); setReason(""); }, done: "Queue resumed"}
      : {group: "Queue", label: "Pause the queue", icon: "pause", desc: "Running processes go on; waiting ones get no place until you resume it", field: {label: "Why do you pause it?", placeholder: "Optional"}, confirm: "Pause", run: (why) => { setPaused(true); setReason(typeof why === "string" ? why : ""); }, done: "Queue paused"},
    {group: "Context", label: "Copy the read command", icon: "copy", desc: "journal queue list", done: "Command copied"},
  ];
  const primary = paused ? {label: "Resume the queue", run: () => { setPaused(false); setReason(""); }, done: "Queue resumed"} : null;
  const tabs = [
    {key: "queue", label: "Queue", count: Q9_RUNS.filter((r) => r.section !== "finished").length, flush: true, render: () => <Q9Queue limit={limit} paused={paused} reason={reason} onSettings={() => setTab("settings")} />},
    {key: "settings", label: "Settings", render: () => <Q9Settings limit={limit} setLimit={setLimit} />},
  ];
  // the shell picks its own tab; a key change makes Processes at once open the Settings tab
  const ordered = tab === "settings" ? [tabs[1], tabs[0]] : tabs;
  return <InspectorShell key={tab || "queue"} term="queue" id={1} kind="Process queue" state={paused ? "paused" : "started"} title="Process queue" abstract="Every process the journal runs. Tests, builds and checks wait for a free place; the rest start at once." width="medium" primary={primary} actions={actions} tabs={ordered} comments={false} onClose={onClose} onOpen={onOpen} onBack={onBack} />;
}

function InspectorFor({s, ...props}) {
  if (s.term === "queue") return <QueueInspector {...props} />;
  const C = {plan: PlanInspector, task: TaskInspector, doc: DocumentInspector, report: DocumentInspector, agent: AgentInspector, memory: MemoryInspector, output: OutputInspector, message: MessageInspector}[s.term];
  if (C) return <C id={s.id} {...props} />;
  const label = (TERM_WORDS[s.term] || s.term) + " " + s.id;
  return <InspectorShell term={s.term} id={s.id} kind={label} title={label} tabs={[{key: "details", label: "Details", render: () => <p className="muted">This row opens in the shared inspector shape.</p>}]} {...props} />;
}

/* ---------- the two ways in: the queue count on the agent bar, and Waiting in an open agent card ---------- */
function HomeAgentBar() {
  const {open} = useOpen();
  const [paused, setPaused] = useState(false);
  const t = TASKS.find((x) => x.id === AGENTS[0].task);
  const helpers = AGENTS.filter((a) => a.role !== "Main agent" && a.state !== "open");
  const running = Q9_RUNS.filter((r) => r.section === "running").length;
  const waiting = Q9_RUNS.filter((r) => r.section === "waiting").length;
  return <div className="now-agent" data-agent-bar>
    <span className={"now-dot " + (paused ? "paused" : "running")} />
    <strong>{paused ? "Paused" : "Working"}</strong>
    <button type="button" className="now-task" title={t.title} onClick={() => open("task", t.id)}>Task {t.id}: {t.title}</button>
    <button type="button" className="now-plan" title={`Open plan ${t.plan}`} onClick={() => open("plan", t.plan)}>Plan {t.plan}</button>
    <span className="grow" />
    <button type="button" className={"btn icon now-pause" + (paused ? " paused" : "")} aria-label={paused ? "Resume" : "Pause"} title={paused ? "Resume: the agent carries on where it stopped" : "Pause: only journal commands, read tools and read commands run until you resume it"} onClick={() => setPaused(!paused)}><Icon name={paused ? "resume" : "pause"} size={16} /></button>
    <span className="now-divider" />
    <button type="button" className="now-count" aria-label="Process queue" title={`Process queue: ${running} running, ${waiting} waiting`} onClick={() => q9OpenQueue(open)}><Icon name="term" size={12} />{running}{waiting ? <span className="q9-wait-count">+{waiting}</span> : null}</button>
    <Menu width={280} button={({toggle}) => <button type="button" className="now-count" aria-label="Helpers" title="Running: helpers" onClick={toggle}><Icon name="agents" size={12} />{helpers.length}</button>}>{(close) => <>
      <div className="menu-label">Running beside main</div>
      {helpers.map((a) => <MenuItem key={a.id} icon="agent" desc={a.task ? `Task ${a.task}` : a.role} hint={STATE_WORDS[a.state]} onClick={() => { open("agent", a.id); close(); }}>{a.name}</MenuItem>)}
    </>}</Menu>
  </div>;
}
function R8CommandBand({a}) {
  const {open} = useOpen();
  if (a.ended && !a.retired) return <div className="r8-command"><span className="r8-faint">Idle since {a.since.replace("Since ", "")}: its process has stopped</span></div>;
  if (a.wait) return <div className="r8-command"><button type="button" className="r8-waiting" title="Open the process queue" onClick={() => q9OpenQueue(open)}>Waiting: {a.wait} <Icon name="right" size={10} /></button></div>;
  if (a.dot === "waiting") return <div className="r8-command"><span className="r8-faint">Waiting</span></div>;
  return <div className="r8-command live"><span className="r8-live-dot" /><span className="r8-run mono">{a.command || "thinking"}</span></div>;
}

Object.assign(window, {Q9_RUNS, QueueInspector, InspectorFor, HomeAgentBar, R8CommandBand});
