// Round sixteen, the process queue (messages 121480 and 121488). Loaded last. Replaces by name: Q9Glance, Q9Row, Q9Queue, Q9Settings, QueueInspector.
// 1. Slot is the word: 'Slots in use', and every tooltip, note and help line of the queue says slot, never place.
// 2. The first tile drops its 'Processes at once: 3' line: '2 of 3' already says the limit. No tile repeats a number it already shows.
//    The limit is changed in the Settings tab.
// 3. Progress, from what the run's reader knows (the process card's progress, steps_passed, steps_failed, test_count, reads_progress):
//    a percent (from a progress pattern, or steps of a known total) is a very small bar and the percent;
//    steps with no total is the current step; a run with no reader shows neither. Failed steps turn the bar and the figure red.

/* ---------- what each running process's reader knows, as the process card gives it ---------- */
const R16_PROGRESS = {
  490031: {progress: 41, steps: {passed: 168, failed: 1, total: 412}},  // pytest stories: steps of a known total
  490030: {progress: 62},                                               // vite build: a progress pattern, no steps
  490029: {steps: {passed: 86, failed: 0}},                              // pytest unit: steps, no total yet
};
Q9_RUNS.forEach((r) => Object.assign(r, R16_PROGRESS[r.id] || {}));
const r16Done = (s) => s.passed + s.failed;
function r16ProgressWords(r) {
  const s = r.steps;
  if (s && s.total) return `${r16Done(s)} of ${s.total} steps${s.failed ? `, ${s.failed} failed` : ""}`;
  if (r.progress != null) return `${r.progress}% done`;
  if (s) return `Step ${r16Done(s)}${s.failed ? `, ${s.failed} failed` : ""}`;
  return null;
}
// the progress cell of a running row; an empty cell keeps the columns in line on every other row
function Q16Progress({r}) {
  const words = r.section === "running" ? r16ProgressWords(r) : null;
  if (!words) return <span className="q16-prog" />;
  const bad = r.steps?.failed > 0;
  return <span className={"q16-prog" + (bad ? " bad" : "")} title={words} aria-label={words}>
    {r.progress != null ? <><span className="q16-bar"><i style={{width: `${r.progress}%`}} /></span><span className="q16-fig">{r.progress}%</span></>
      : <span className="q16-fig">step {r16Done(r.steps)}</span>}
  </span>;
}

/* ---------- the tiles: slots in use, waiting, running at once, finished ---------- */
function Q9Glance({limit, paused}) {
  const running = Q9_RUNS.filter((r) => r.section === "running");
  const used = running.filter((r) => r.slot).length;
  const waiting = Q9_RUNS.filter((r) => r.section === "waiting").length;
  const finished = Q9_RUNS.filter((r) => r.section === "finished");
  const failed = finished.filter((r) => r.exit !== 0).length;
  return <div className="q9-glance">
    <div className="q9-g"><small>Slots in use</small><b>{used}<span> of {limit}</span></b>
      <div className="q9-slots" aria-hidden="true">{Array.from({length: limit}, (_, i) => <i key={i} className={i < used ? "on" : ""} />)}</div></div>
    <div className="q9-g"><small>Waiting</small><b className={paused && waiting ? "warn" : ""}>{waiting}</b><span className="q9-note">{paused ? "Held while paused" : waiting ? "Oldest first" : "Nothing waits"}</span></div>
    <div className="q9-g"><small>Running at once</small><b>{running.length - used}</b><span className="q9-note">Need no slot</span></div>
    <div className="q9-g"><small>Finished</small><b>{finished.length}</b><span className={"q9-note" + (failed ? " bad" : "")}>{failed ? `${failed} failed` : "None failed"}</span></div>
  </div>;
}

/* ---------- one process: lead, kind, command, progress, agent, time; it folds out to its output ---------- */
function Q9Row({r, position, open, onToggle}) {
  const {open: openRow} = useOpen();
  const failed = r.section === "finished" && r.exit !== 0;
  const lead = r.section === "waiting" ? <span className="q9-pos">{position}</span>
    : <span className={"q9-dot" + (r.section === "running" ? (r.slot ? " run" : " free") : failed ? " bad" : " ok")} title={r.section === "running" ? (r.slot ? "Running in a slot" : "Running without a slot") : failed ? `Failed, exit ${r.exit}` : "Finished"} />;
  const go = (term, id) => (e) => { e.stopPropagation(); openRow(term, id); };
  const progress = r.section === "running" ? r16ProgressWords(r) : null;
  return <div className={"q9-run" + (open ? " open" : "") + (failed ? " failed" : "")} data-section={r.section}>
    <button type="button" className="q9-line q16-line" aria-expanded={open} title={r.line} onClick={onToggle}>
      <span className="q9-lead">{lead}</span>
      <span className={"q9-kind" + (q9Waits(r) ? " waits" : "")} title={q9Waits(r) ? "Waits for a slot" : "Starts at once"}>{q9Kind(r)}</span>
      <span className="q9-cmd">{r.line}</span>
      <Q16Progress r={r} />
      <span className="q9-who" role="link" tabIndex={-1} onClick={go("agent", (AGENTS.find((a) => a.name === r.agent) || {}).id)}>{r.agent}</span>
      <span className={"q9-time" + (failed ? " bad" : "")}>{failed ? `exit ${r.exit}` : r.time}</span>
      <span className="q9-chev"><Icon name="down" size={11} /></span>
    </button>
    <div className="q9-drop"><div className="q9-drop-inner">
      <div className="q9-out">
        <div className="q9-out-head">
          <span>Output {r.id}</span>
          {r.task && <><span className="q9-sep">·</span><button type="button" className="q9-a" onClick={go("task", r.task)}>Task {r.task}</button></>}
          <span className="q9-sep">·</span><span>{r.time}</span>
          {progress && <><span className="q9-sep">·</span><span className={r.steps?.failed ? "q16-bad" : ""}>{progress}</span></>}
          {r.main && <><span className="q9-sep">·</span><span>main agent</span></>}
          <span className="grow" />
          <R12Open title={`Output ${r.id}`} onClick={go("output", 489998)} />
        </div>
        <pre>{r.section === "waiting" ? <span className="q9-muted">Not started · number {position} in line</span> : <><span className="q9-prompt">$ </span>{r.line}{r.out.length ? "\n" + r.out.join("\n") : ""}{r.section === "running" && <span className="q9-caret" />}</>}</pre>
      </div>
    </div></div>
  </div>;
}

/* ---------- the queue: as round twelve; the paused line says slot ---------- */
function Q9Queue({limit, paused, reason}) {
  const [opened, setOpened] = useState(new Set([490031]));
  const [more, setMore] = useState(false);
  const flip = (id) => { const s = new Set(opened); s.has(id) ? s.delete(id) : s.add(id); setOpened(s); };
  const sections = [["running", "Running", "play", "Nothing running"], ["waiting", "Waiting", "clock", "Nothing waiting"], ["finished", "Finished", "check", "Nothing finished yet"]];
  return <div className="q9-queue">
    {paused && <div className="q9-paused" role="status"><Icon name="pause" size={13} /><span><b>Paused</b> · no waiting process gets a slot{reason ? ` · ${reason}` : ""}</span></div>}
    <Q9Glance limit={limit} paused={paused} />
    {sections.map(([key, label, icon, empty]) => { let rows = Q9_RUNS.filter((r) => r.section === key); const total = rows.length; if (key === "finished" && !more) rows = rows.slice(0, 6);
      return <section key={key} className="q9-section">
        <h3 className="q9-band"><Icon name={icon} size={12} />{label}<span>{total}</span></h3>
        {rows.length ? rows.map((r, i) => <Q9Row key={r.id} r={r} position={i + 1} open={opened.has(r.id)} onToggle={() => flip(r.id)} />) : <p className="q9-empty">{empty}</p>}
        {key === "finished" && total > 6 && !more && <button type="button" className="q9-older" onClick={() => setMore(true)}>Older</button>}
      </section>; })}
  </div>;
}

/* ---------- the settings: the help lines say slot ---------- */
function Q9Settings({limit, setLimit}) {
  const toast = useToast();
  const [main, setMain] = useState(true);
  const [tests, setTests] = useState(2);
  const set = (n) => { setLimit(n); toast(`Slots: ${n}`); };
  return <div className="q9-settings">
    <div className="q9-set"><div className="grow"><label id="q9-limit">Processes at once</label><p>The number of slots: how many tests, builds and checks run at the same time. The rest wait for a slot. Lowering it stops none that are running.</p><code>process.run_batch_size</code></div>
      <div className="q9-step" role="group" aria-labelledby="q9-limit"><button type="button" aria-label="One fewer" disabled={limit <= 1} onClick={() => set(limit - 1)}>−</button><output>{limit}</output><button type="button" aria-label="One more" onClick={() => set(limit + 1)}>+</button></div></div>
    <div className="q9-set"><div className="grow"><label htmlFor="q9-tests">Test runs per worker</label><p>How many slots one worker's test runs may hold at once. 0 is no limit.</p></div>
      <input id="q9-tests" className="qbox q9-num" type="number" min="0" value={tests} onChange={(e) => setTests(Number(e.target.value))} /></div>
    <div className="q9-set"><div className="grow"><label id="q9-main">Count the main agent</label><p>Its processes always start right away, but each test or build takes a slot, so fewer workers run at once.</p></div>
      <Switch on={main} onChange={setMain} title="Count the main agent" /></div>
  </div>;
}

/* ---------- the inspector: its abstract and Pause say slot ---------- */
function QueueInspector({onClose, onOpen, onBack}) {
  const [paused, setPaused] = useState(false);
  const [reason, setReason] = useState("");
  const [limit, setLimit] = useState(3);
  const actions = [
    paused ? {group: "Queue", label: "Resume", icon: "play", run: () => { setPaused(false); setReason(""); }, done: "Queue resumed"}
      : {group: "Queue", label: "Pause", icon: "pause", desc: "No new slots", field: {label: "Reason"}, confirm: "Pause", run: (why) => { setPaused(true); setReason(typeof why === "string" ? why : ""); }, done: "Queue paused"},
    {group: "Context", label: "Copy command", icon: "copy", desc: "journal queue list", done: "Command copied"},
  ];
  const primary = paused ? {label: "Resume", run: () => { setPaused(false); setReason(""); }, done: "Queue resumed"} : null;
  const tabs = [
    {key: "queue", label: "Queue", count: Q9_RUNS.filter((r) => r.section !== "finished").length, flush: true, render: () => <Q9Queue limit={limit} paused={paused} reason={reason} />},
    {key: "settings", label: "Settings", render: () => <Q9Settings limit={limit} setLimit={setLimit} />},
  ];
  return <InspectorShell term="queue" id={1} kind="Process queue" state={paused ? "paused" : "started"} title="Process queue" abstract="Tests, builds and checks wait for a slot; every other process starts at once." width="medium" primary={primary} actions={actions} tabs={tabs} comments={false} onClose={onClose} onOpen={onOpen} onBack={onBack} />;
}

Object.assign(window, {Q16Progress, Q9Glance, Q9Row, Q9Queue, Q9Settings, QueueInspector});
