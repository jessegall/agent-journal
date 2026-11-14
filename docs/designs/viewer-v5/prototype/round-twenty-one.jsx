// Round twenty-one (users 125244, 125248, 125300; doc 1303): the process queue by lane. Loaded last, before app.jsx.
// Replaces by name: QueueInspector (round sixteen). Every way into the queue (the agent bar's count, a waiting command band) opens this one.
// The data is the shape of the live lanes (src/core/modules/processes/support/lane_load.py), with each run's slot cost and kind added
// (build work in doc 1303), and the built-in classes and default limits of src/engine/execution: instant 24, short 12, long 8 slots.
// 1. Three lane tiles: slots in use of the limit, how many wait, Paused or Held. A click scrolls to the lane.
// 2. One block per lane: its name and use, what goes in it, the slot strip (a run fills the cells it takes), Running, and
//    Waiting in the order they start with the reason said once. A lane with nothing in it is one row high.
// 3. Only the long lane pauses (execution_status.py:36): Pause and Resume sit on its head; held for an update or a restart has no Resume.
// 4. Finished lately across lanes, then the waits of the last hour. Settings: one limit per lane.
// 5. The Actions menu's Demo group shows the held states and an empty queue; it is not part of the design.

/* ---------- sample rows ---------- */
const Q21_LANES = [
  {key: "instant", name: "Instant lane", cap: 24, what: "Hooks, journal commands and viewer requests. Each takes 1 slot.",
   running: [
     {kind: "command", line: "journal task show 9682", cls: "main agent command", prio: "immediate", who: "main", secs: 1, cost: 1, task: 9597},
     {kind: "hook", line: "PreToolUse · Bash", cls: "agent hook", prio: "reserved", who: "worker-4", secs: 0, cost: 1, task: 9682},
     {kind: "viewer", line: "queue list", cls: "window request", prio: "normal", who: "person", secs: 0, cost: 1},
     {kind: "tick", line: "reminders tick", cls: "tick handler", prio: "background", who: "journal", secs: 0, cost: 1},
   ], waiting: []},
  {key: "short", name: "Short lane", cap: 12, what: "Reads, searches, edits and git. Each takes 1 slot.",
   running: [
     {kind: "read", line: "sed -n 1,80p src/engine/execution/execution_order.py", cls: "main agent short line", prio: "immediate", who: "main", secs: 0, cost: 1, task: 9597, out: true},
     {kind: "git", line: "git diff --stat", cls: "agent short line", prio: "reserved", from: "agent", who: "worker-4", secs: 0, cost: 1, parent: "PreToolUse · Bash", task: 9682, out: true},
     {kind: "git", line: "git status --short", cls: "agent short line", prio: "agent", who: "worker-7", secs: 0, cost: 1, task: 9683, out: true},
     {kind: "search", line: "grep -rn LaneLoad src", cls: "agent short line", prio: "agent", who: "helper-851", secs: 1, cost: 1, out: true},
   ], waiting: []},
  {key: "long", name: "Long lane", cap: 8, what: "Tests, builds, checks, installs and plugins. A test, a build or a check takes 4 slots, an install 2.",
   running: [
     {kind: "test", line: "pytest tests/stories -x -q", cls: "test, build or check", prio: "agent", who: "worker-4", secs: 134, cost: 4, task: 9682, out: true, steps: {passed: 168, failed: 1, total: 412}},
     {kind: "build", line: "npm --prefix src/viewer run build", cls: "test, build or check", prio: "agent", who: "worker-7", secs: 48, cost: 4, task: 9683, out: true, progress: 62},
     {kind: "job", line: "journal-run watch src/viewer --build", cls: "background job", prio: "agent", who: "worker-4", secs: 842, cost: 0, task: 9682, out: true},
   ],
   waiting: [
     {kind: "ponytail", line: "ponytail audit --changed", cls: "plugin program", prio: "agent", from: "normal", who: "plugin ponytail", secs: 320, cost: 4},
     {kind: "test", line: "pytest tests/stories/test_agents.py -q", cls: "test, build or check", prio: "agent", who: "reviewer-3", secs: 63, cost: 4},
     {kind: "check", line: "journal check run sins", cls: "test, build or check", prio: "agent", who: "worker-7", secs: 40, cost: 4, reader: true, task: 9683},
     {kind: "graphify", line: "graphify update .", cls: "graphify", prio: "background", who: "journal", secs: 120, cost: 8},
   ]},
];
const Q21_DONE = [
  {lane: "long", kind: "test", line: "pytest tests/stories/test_launch.py -x -q", who: "worker-4", took: "4.2 s", ago: "3m ago", exit: 1, task: 9682},
  {lane: "short", kind: "git", line: "git status --short", who: "worker-4", took: "0.1 s", ago: "3m ago", exit: 0, task: 9682},
  {lane: "instant", kind: "command", line: "journal message unread", who: "main", took: "0.2 s", ago: "3m ago", exit: 0, task: 9597},
  {lane: "short", kind: "search", line: "grep -rn \"Halt the queue\" src", who: "helper-851", took: "0.3 s", ago: "4m ago", exit: 0},
  {lane: "long", kind: "build", line: "npm --prefix src/viewer run build", who: "worker-7", took: "1 min 12 s", ago: "6m ago", exit: 0, task: 9683},
  {lane: "long", kind: "check", line: "journal check run sins", who: "worker-4", took: "9 s", ago: "9m ago", exit: 2, task: 9682},
  {lane: "long", kind: "test", line: "pytest tests/unit/processes -q", who: "main", took: "38 s", ago: "11m ago", exit: 0, task: 9597},
  {lane: "short", kind: "edit", line: "Edit src/viewer/src/resource/ExecutionLanes.vue", who: "worker-7", took: "0 s", ago: "12m ago", exit: 0, task: 9683},
  {lane: "long", kind: "install", line: "npm --prefix src/viewer install", who: "worker-7", took: "21 s", ago: "14m ago", exit: 0, task: 9683},
];
const Q21_WAITS = [["Immediate", 212, 0, 0], ["Reserved", 96, 2, 0], ["Agent", 31, 251, 58], ["Normal", 18, 372, 121], ["Background", 4, 660, 410]];
// the agent bar counts what runs and waits: the lanes' rows stand in for round nine's
Q9_RUNS.splice(0, Q9_RUNS.length, ...Q21_LANES.flatMap((l) => [...l.running.map((r) => ({...r, section: "running"})), ...l.waiting.map((r) => ({...r, section: "waiting"}))]),
  ...Q21_DONE.map((r) => ({...r, section: "finished"})));
if (typeof WIDTH_OF !== "undefined") WIDTH_OF.queue = "large";

/* ---------- words ---------- */
const q21Fmt = (s) => s < 60 ? `${s} s` : s < 3600 ? `${Math.floor(s / 60)} min${s % 60 ? ` ${s % 60} s` : ""}` : `${Math.floor(s / 3600)} h ${Math.floor(s % 3600 / 60)} min`;
const q21Ago = (s) => s < 60 ? "just now" : s < 3600 ? `${Math.floor(s / 60)}m ago` : `${Math.floor(s / 3600)}h ago`;
const q21Takes = (n) => n === 0 ? "no slot" : n === 1 ? "1 slot" : `${n} slots`;
const q21Word = (s) => s[0].toUpperCase() + s.slice(1);
const q21Used = (rows) => rows.reduce((n, r) => n + r.cost, 0);
const q21Steps = (s) => `${s.passed + s.failed} of ${s.total} steps${s.failed ? ` · ${s.failed} failed` : ""}`;
const Q21_HALTS = {
  paused: (n, reason) => <><b>Paused</b>{reason ? ` · ${reason}` : ""}. No waiting run starts here until it is resumed; what runs goes on.</>,
  update: (n) => <><b>Held for an update.</b> The update waits for the running commands to end. Nothing new starts here until it is done; {n ? `the ${n} waiting keep their place` : "nothing waits"}.</>,
  restart: (n) => <><b>Held for a restart.</b> The server is restarting. {n ? `The ${n} waiting keep their place and start once it is back` : "Nothing waits"}.</>,
};

// who started a run: an agent is a link to its inspector, anyone else plain words
function Q21Who({name, go}) {
  const a = AGENTS.find((x) => x.name === name);
  if (!a) return <span className="q21-who">{name}</span>;
  return <span className="q21-who link" onClick={go("agent", a.id)}><R16Agent name={name} /></span>;
}

/* ---------- the slot strip: one cell per slot of the limit; a run fills the cells it takes ---------- */
function Q21Strip({rows, cap}) {
  let at = 0;
  const runs = rows.filter((r) => r.cost > 0).map((r, i) => { const over = at + r.cost > cap; at += r.cost;
    return <i key={`r${i}`} className={"q21-seg on" + (over ? " over" : "")} style={{flex: r.cost}} title={`${r.line} · ${q21Takes(r.cost)}${over ? " · over the limit" : ""}`}>{r.cost >= 3 ? r.kind : ""}</i>; });
  const free = Array.from({length: Math.max(0, cap - at)}, (_, i) => <i key={`f${i}`} className="q21-seg" title="Free" />);
  return <div className={"q21-strip" + (cap > 16 ? " fine" : "")} role="img" aria-label={`${q21Used(rows)} of ${cap} slots in use`}>{runs}{free}</div>;
}

/* ---------- one run: the round sixteen row, with what it takes; it folds open to its facts ---------- */
function Q21Row({lane, r, part, pos, waitCount, why, open, onToggle}) {
  const {open: openRow} = useOpen();
  const go = (term, id) => (e) => { e.stopPropagation(); openRow(term, id); };
  const lead = part === "running" ? <span className={"q9-dot " + (r.cost ? "run" : "free")} aria-label={r.cost ? "In a slot" : "Without a slot"} />
    : <span className="q9-pos" aria-label={`Place ${pos}`}>{pos}</span>;
  const facts = [["Class", r.cls], ["Priority", q21Word(r.prio) + (r.from ? `, moved up from ${r.from} after a long wait` : "") + (r.prio === "immediate" ? ": never waits" : "")],
    ["Started by", <Q21Who name={r.who} go={go} />],
    part === "running" ? ["Started", `${q21Ago(r.secs)} · running for ${q21Fmt(r.secs)}`] : ["Waiting for", q21Fmt(r.secs)],
    ["Takes", q21Takes(r.cost)],
    r.steps && ["Progress", <span className={r.steps.failed ? "q16-bad" : ""}>{q21Steps(r.steps)}</span>],
    r.progress != null && ["Progress", `${r.progress}%`],
    part === "waiting" && ["Place", `${pos} of ${waitCount} in the ${lane.name.toLowerCase()}`],
    part === "waiting" && ["Why it waits", r.reader ? "Waits for a reader" : why],
    r.parent && ["For", r.parent],
    r.task && ["Task", <button type="button" className="q9-a" onClick={go("task", r.task)}>Task {r.task}</button>],
  ].filter(Boolean);
  const pct = r.progress != null ? r.progress : r.steps ? Math.round((r.steps.passed + r.steps.failed) / r.steps.total * 100) : null;
  return <div className={"q21-run" + (open ? " open" : "")}>
    <button type="button" className="q21-line" aria-expanded={open} onClick={onToggle}>
      <span className="q9-lead">{lead}</span>
      <span className="q9-kind">{r.kind}</span>
      <span className="q21-cmd"><span className="txt">{r.line}</span>
        {part === "waiting" && r.from && <em className="up" title={`Moved up from ${r.from} after a long wait`}>moved up</em>}
        {r.reader && <em title="Waits for a reader">reader</em>}
        {r.parent && <em title={`Runs for ${r.parent}`}>for {r.parent}</em>}
        {pct != null && <em className={r.steps?.failed ? "bad" : ""} title={r.steps ? q21Steps(r.steps) : `${pct}%`}>{pct}%</em>}</span>
      <span className="q21-cost">{q21Takes(r.cost)}</span>
      <Q21Who name={r.who} go={go} />
      <span className="q9-time">{q21Fmt(r.secs)}</span>
      <span className="q9-chev"><Icon name="down" size={11} /></span>
    </button>
    {open && <div className="q21-facts"><dl>{facts.map(([k, v]) => <React.Fragment key={k}><dt>{k}</dt><dd>{v}</dd></React.Fragment>)}</dl>
      {r.out && <button type="button" className="q9-a q21-out" onClick={go("output", 489998)}>Open its output</button>}</div>}
  </div>;
}

/* ---------- one lane ---------- */
function Q21Lane({lane, cap, rows, state, reason, kept, opened, flip, pausing, setPausing, pause, resume}) {
  const [reasonText, setReasonText] = useState("");
  const {running, waiting} = rows;
  const used = q21Used(running), over = Math.max(0, used - cap), stopped = state !== "open";
  const why = state === "paused" ? "The lane is paused" : state === "update" ? "The lane is held for an update" : state === "restart" ? "The lane is held for a restart" : `No room: ${used} of ${cap} slots in use`;
  const shortWhy = state === "paused" ? "Paused" : stopped ? "Held" : `No room: ${used} of ${cap} slots in use`;
  const runShown = running.filter(kept), waitShown = waiting.filter(kept);
  const isLong = lane.key === "long";
  return <section className={"q21-lane" + (stopped ? " stopped" : "")} id={`q21-lane-${lane.key}`} aria-label={lane.name}>
    <h3 className="q21-head">{lane.name}
      <span className="q21-use"><b>{used}</b> of {cap} slots{waiting.length ? ` · ${waiting.length} waiting` : ""}</span>
      {state === "paused" ? <span className="q21-chip warn">Paused</span> : stopped ? <span className="q21-chip warn">Held</span> : over ? <span className="q21-chip bad">{over} over</span> : null}
      <span className="grow" />
      {isLong && state === "paused" && <Btn small variant="primary" onClick={resume}>Resume</Btn>}
      {isLong && state === "open" && !pausing && <Btn small icon="pause" onClick={() => setPausing(true)}>Pause</Btn>}
    </h3>
    <p className="q21-what">{lane.what}</p>
    {isLong && pausing && state === "open" && <form className="q21-note" onSubmit={(e) => { e.preventDefault(); pause(reasonText.trim()); setReasonText(""); }}>
      <Icon name="pause" size={13} /><input className="qbox q21-reason" autoFocus value={reasonText} onChange={(e) => setReasonText(e.target.value)} placeholder="Reason (optional)" aria-label="Reason" />
      <Btn small variant="primary" type="submit">Pause</Btn><Btn small onClick={() => setPausing(false)}>Cancel</Btn></form>}
    {stopped && <div className="q21-note" role="status"><Icon name="pause" size={13} /><span>{Q21_HALTS[state](waiting.length, reason)}</span></div>}
    <Q21Strip rows={running} cap={cap} />
    {!running.length && !waiting.length ? <p className="q9-empty q21-empty">Nothing runs or waits here</p> : <>
      <h4 className="q21-sub">Running <span>{running.length}</span></h4>
      {runShown.length ? runShown.map((r) => { const i = running.indexOf(r); const id = `${lane.key}-r${i}`;
        return <Q21Row key={id} lane={lane} r={r} part="running" open={opened.has(id)} onToggle={() => flip(id)} />; })
        : <p className="q9-empty q21-empty">{running.length ? "None match the filter" : "Nothing runs"}</p>}
      {waiting.length > 0 && <>
        <h4 className="q21-sub">Waiting, in the order they start <span>{waiting.length}</span><span className="why">{shortWhy}</span></h4>
        {waitShown.length ? waitShown.map((r) => { const i = waiting.indexOf(r); const id = `${lane.key}-w${i}`;
          return <Q21Row key={id} lane={lane} r={r} part="waiting" pos={i + 1} waitCount={waiting.length} why={why} open={opened.has(id)} onToggle={() => flip(id)} />; })
          : <p className="q9-empty q21-empty">None match the filter</p>}
      </>}
    </>}
  </section>;
}

/* ---------- the queue tab ---------- */
function Q21Queue({q}) {
  const {open: openRow} = useOpen();
  const go = (term, id) => (e) => { e.stopPropagation(); openRow(term, id); };
  const rootRef = useRef(null);
  const [cls, setCls] = useState("");
  const [who, setWho] = useState("");
  const [opened, setOpened] = useState(new Set(["long-r0"]));
  const [older, setOlder] = useState(false);
  const [pausing, setPausing] = useState(false);
  const flip = (id) => { const s = new Set(opened); s.has(id) ? s.delete(id) : s.add(id); setOpened(s); };
  const kept = (r) => (!cls || r.cls === cls) && (!who || r.who === who);
  const rowsOf = (l) => q.empty ? {running: [], waiting: []} : {running: l.running, waiting: l.waiting};
  const stateOf = (l) => l.key === "long" ? q.long : "open";
  const all = Q21_LANES.flatMap((l) => [...rowsOf(l).running, ...rowsOf(l).waiting]);
  const running = Q21_LANES.reduce((n, l) => n + rowsOf(l).running.length, 0);
  const shown = all.filter(kept).length;
  const pick = (values) => [...new Set(values)].sort();
  const jump = (key) => rootRef.current?.querySelector(`#q21-lane-${key}`)?.scrollIntoView({block: "start", behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth"});
  const done = Q21_DONE.filter(kept), doneShown = older ? done : done.slice(0, 6), failed = done.filter((r) => r.exit).length;
  return <div className="q9-queue q21" ref={rootRef}>
    <div className="q21-tools">
      <span className="q21-sum">{running} running · {all.length - running} waiting{cls || who ? ` · showing ${shown} of ${all.length}` : ""}</span>
      <label>Class <select className="qbox" value={cls} onChange={(e) => setCls(e.target.value)}><option value="">Every class</option>{pick(all.map((r) => r.cls)).map((v) => <option key={v}>{v}</option>)}</select></label>
      <label>Started by <select className="qbox" value={who} onChange={(e) => setWho(e.target.value)}><option value="">Anyone</option>{pick(all.map((r) => r.who)).map((v) => <option key={v}>{v}</option>)}</select></label>
    </div>
    <div className="q21-tiles">{Q21_LANES.map((l) => { const {running: r, waiting: w} = rowsOf(l), cap = q.caps[l.key], used = q21Used(r), st = stateOf(l);
      return <button key={l.key} type="button" className="q21-tile" onClick={() => jump(l.key)}>
        <small>{l.name.replace(" lane", "")}{st === "paused" ? <span className="q21-chip warn">Paused</span> : st !== "open" ? <span className="q21-chip warn">Held</span> : null}</small>
        <b>{used}<span> of {cap}</span></b>
        <span className={"q21-meter" + (st !== "open" ? " warn" : used > cap ? " bad" : "")}><i style={{width: `${Math.min(100, used / cap * 100)}%`}} /></span>
        <span className={"q21-tile-sub" + (w.length ? " on" : "")}>{w.length ? `${w.length} waiting` : "Nothing waits"}</span>
      </button>; })}</div>
    {Q21_LANES.map((l) => <Q21Lane key={l.key} lane={l} cap={q.caps[l.key]} rows={rowsOf(l)} state={stateOf(l)} reason={q.reason} kept={kept} opened={opened} flip={flip}
      pausing={pausing} setPausing={setPausing} pause={(why) => { setPausing(false); q.pause(why); }} resume={q.resume} />)}
    <section className="q9-section">
      <h3 className="q9-band"><Icon name="check" size={12} />Finished lately<span>{done.length}{failed > 0 && <em className="q17-failed"> · {failed} failed</em>}</span></h3>
      {doneShown.length ? doneShown.map((r, i) => <div key={i} className="q21-run done"><div className="q21-line">
        <span className="q9-lead"><span className={"q9-dot " + (r.exit ? "bad" : "ok")} aria-label={r.exit ? `Failed, exit ${r.exit}` : "Finished"} /></span>
        <span className="q21-lane-word">{q21Word(r.lane)}</span><span className="q9-kind">{r.kind}</span>
        <span className="q21-cmd"><span className="txt">{r.line}</span></span>
        <Q21Who name={r.who} go={go} />
        <span className={"q9-time" + (r.exit ? " bad" : "")}>{r.exit ? `exit ${r.exit}` : r.took}</span>
        <span className="q9-time">{r.ago}</span></div></div>) : <p className="q9-empty">None</p>}
      {done.length > 6 && !older && <button type="button" className="q9-older" onClick={() => setOlder(true)}>Show older</button>}
    </section>
    <section className="q9-section">
      <h3 className="q9-band"><Icon name="clock" size={12} />Waits, last hour</h3>
      <table className="q21-waits"><thead><tr><th>Priority</th><th>Started</th><th>Longest wait</th><th>Average wait</th></tr></thead>
        <tbody>{Q21_WAITS.map(([p, n, lo, av]) => <tr key={p}><td>{p}</td><td>{n}</td><td>{q21Fmt(lo)}</td><td>{q21Fmt(av)}</td></tr>)}</tbody></table>
    </section>
  </div>;
}

/* ---------- the settings tab: one limit per lane ---------- */
function Q21Settings({caps, setCap}) {
  const toast = useToast();
  return <div className="q9-settings">{Q21_LANES.map((l) => <div key={l.key} className="q9-set">
    <div className="grow"><label id={`q21-cap-${l.key}`}>{l.name} limit</label><p>Slots of this lane in use at once. Lowering it stops nothing that runs; the rest wait.</p></div>
    <div className="q9-step" role="group" aria-labelledby={`q21-cap-${l.key}`}>
      <button type="button" aria-label="One fewer" disabled={caps[l.key] <= 1} onClick={() => { setCap(l.key, caps[l.key] - 1); toast(`${l.name} limit: ${caps[l.key] - 1}`); }}>−</button>
      <output>{caps[l.key]}</output>
      <button type="button" aria-label="One more" onClick={() => { setCap(l.key, caps[l.key] + 1); toast(`${l.name} limit: ${caps[l.key] + 1}`); }}>+</button></div>
  </div>)}</div>;
}

/* ---------- the inspector ---------- */
function QueueInspector({onClose, onOpen, onBack}) {
  const [long, setLong] = useState("open");
  const [reason, setReason] = useState("");
  const [empty, setEmpty] = useState(false);
  const [caps, setCaps] = useState(() => Object.fromEntries(Q21_LANES.map((l) => [l.key, l.cap])));
  const setCap = (key, n) => setCaps({...caps, [key]: n});
  const q = {long, reason, empty, caps, pause: (why) => { setReason(why); setLong("paused"); }, resume: () => { setLong("open"); setReason(""); }};
  const actions = [
    {group: "Context", label: "Copy command", icon: "copy", desc: "journal process list --open", done: "Command copied"},
    {group: "Demo", label: long === "update" ? "Lift the update hold" : "Hold for an update", icon: "pause", run: () => setLong(long === "update" ? "open" : "update"), done: long === "update" ? "The long lane is open" : "Held for an update"},
    {group: "Demo", label: long === "restart" ? "Lift the restart hold" : "Hold for a restart", icon: "pause", run: () => setLong(long === "restart" ? "open" : "restart"), done: long === "restart" ? "The long lane is open" : "Held for a restart"},
    {group: "Demo", label: empty ? "Fill the queue" : "Empty the queue", icon: "term", run: () => setEmpty(!empty), done: empty ? "Queue filled" : "Queue emptied"},
  ];
  const count = empty ? 0 : Q21_LANES.reduce((n, l) => n + l.running.length + l.waiting.length, 0);
  const tabs = [
    {key: "queue", label: "Queue", count, flush: true, render: () => <Q21Queue q={q} />},
    {key: "settings", label: "Settings", render: () => <Q21Settings caps={caps} setCap={setCap} />},
  ];
  return <InspectorShell term="queue" id={1} kind="Queue" title="Process queue" width="large" actions={actions} tabs={tabs} comments={false} onClose={onClose} onOpen={onOpen} onBack={onBack} />;
}

Object.assign(window, {Q21_LANES, Q21_DONE, Q21Strip, Q21Row, Q21Lane, Q21Queue, Q21Settings, QueueInspector});
