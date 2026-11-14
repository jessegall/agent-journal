// Rounds sixteen and seventeen, the process queue (messages 121480 and 121488; round 17: reports 1411, 1412, doc 1289). Loaded last.
// Replaces by name: Q9Glance, Q9Row, Q9Queue, Q9Settings, QueueInspector.
// 1. Slot is the word: 'Slots in use', 'Without a slot', and the Settings limit is 'Slots'. Never 'at once', never place.
// 2. Two tiles only: Slots in use (the number, the pips, the limit) and Without a slot. Waiting and Finished are counted once, on their section bars;
//    the Finished bar also says how many failed.
// 3. Progress, from what the run's reader knows (the process card's progress, steps_passed, steps_failed, test_count, reads_progress):
//    a percent (from a progress pattern, or steps of a known total) is a very small bar and the percent;
//    steps with no total is the current step; a run with no reader shows neither. Failed steps turn the bar and the figure red.
// 4. Paused is said once in the queue (the banner) and once as the way out (Resume, the primary button). Main agent runs always take a slot
//    (task 9719), so there is no switch for it.

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
  if (s && s.total) return `${r16Done(s)} of ${s.total} steps${s.failed ? ` · ${s.failed} failed` : ""}`;
  if (r.progress != null) return `${r.progress}%`;
  if (s) return `Step ${r16Done(s)}${s.failed ? ` · ${s.failed} failed` : ""}`;
  return null;
}
// the progress cell of a running row; an empty cell keeps the columns in line on every other row
function Q16Progress({r}) {
  const words = r.section === "running" ? r16ProgressWords(r) : null;
  if (!words) return <span className="q16-prog" />;
  const bad = r.steps?.failed > 0;
  return <span className={"q16-prog" + (bad ? " bad" : "")} aria-label={words}>
    {r.progress != null ? <><span className="q16-bar"><i style={{width: `${r.progress}%`}} /></span><span className="q16-fig">{r.progress}%</span></>
      : <span className="q16-fig">step {r16Done(r.steps)}</span>}
  </span>;
}

/* ---------- the tiles: slots in use, without a slot ---------- */
function Q9Glance({limit}) {
  const running = Q9_RUNS.filter((r) => r.section === "running");
  const used = running.filter((r) => r.slot).length;
  return <div className="q9-glance q17-glance">
    <div className="q9-g"><small>Slots in use</small><b>{used}<span> of {limit}</span></b>
      <div className="q9-slots" aria-hidden="true">{Array.from({length: limit}, (_, i) => <i key={i} className={i < used ? "on" : ""} />)}</div></div>
    <div className="q9-g"><small>Without a slot</small><b>{running.length - used}</b></div>
  </div>;
}

/* ---------- one process: lead, kind, command, progress, agent, time; it folds out to its output ---------- */
function Q9Row({r, position, open, onToggle}) {
  const {open: openRow} = useOpen();
  const failed = r.section === "finished" && r.exit !== 0;
  const lead = r.section === "waiting" ? <span className="q9-pos">{position}</span>
    : <span className={"q9-dot" + (r.section === "running" ? (r.slot ? " run" : " free") : failed ? " bad" : " ok")} aria-label={r.section === "running" ? (r.slot ? "In a slot" : "Without a slot") : failed ? `Failed, exit ${r.exit}` : "Finished"} />;
  const go = (term, id) => (e) => { e.stopPropagation(); openRow(term, id); };
  const progress = r.section === "running" ? r16ProgressWords(r) : null;
  return <div className={"q9-run" + (open ? " open" : "") + (failed ? " failed" : "")} data-section={r.section}>
    <button type="button" className="q9-line q16-line" aria-expanded={open} onClick={onToggle}>
      <span className="q9-lead">{lead}</span>
      <span className={"q9-kind" + (q9Waits(r) ? " waits" : "")}>{q9Kind(r)}</span>
      <span className="q9-cmd">{r.line}</span>
      <Q16Progress r={r} />
      <span className="q9-who" onClick={go("agent", (AGENTS.find((a) => a.name === r.agent) || {}).id)}><R16Agent name={r.agent} /></span>
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
          <span className="grow" />
          <R12Open title={`Output ${r.id}`} onClick={go("output", 489998)} />
        </div>
        <pre>{r.section === "waiting" ? <span className="q9-muted">Waiting · {position} in line</span> : <><span className="q9-prompt">$ </span>{r.line}{r.out.length ? "\n" + r.out.join("\n") : ""}{r.section === "running" && <span className="q9-caret" />}</>}</pre>
      </div>
    </div></div>
  </div>;
}

/* ---------- the queue: the paused banner, two tiles, then Running, Waiting and Finished, each counted once on its bar ---------- */
function Q9Queue({limit, paused, reason}) {
  const [opened, setOpened] = useState(new Set([490031]));
  const [more, setMore] = useState(false);
  const flip = (id) => { const s = new Set(opened); s.has(id) ? s.delete(id) : s.add(id); setOpened(s); };
  const sections = [["running", "Running", "play", "None"], ["waiting", "Waiting", "clock", "None"], ["finished", "Finished", "check", "None"]];
  return <div className="q9-queue">
    {paused && <div className="q9-paused" role="status"><Icon name="pause" size={13} /><span><b>Paused</b>{reason ? ` · ${reason}` : ""}</span></div>}
    <Q9Glance limit={limit} />
    {sections.map(([key, label, icon, empty]) => { let rows = Q9_RUNS.filter((r) => r.section === key); const total = rows.length; const failed = key === "finished" ? rows.filter((r) => r.exit !== 0).length : 0; if (key === "finished" && !more) rows = rows.slice(0, 6);
      return <section key={key} className="q9-section">
        <h3 className="q9-band"><Icon name={icon} size={12} />{label}<span>{total}{failed > 0 && <em className="q17-failed"> · {failed} failed</em>}</span></h3>
        {rows.length ? rows.map((r, i) => <Q9Row key={r.id} r={r} position={i + 1} open={opened.has(r.id)} onToggle={() => flip(r.id)} />) : <p className="q9-empty">{empty}</p>}
        {key === "finished" && total > 6 && !more && <button type="button" className="q9-older" onClick={() => setMore(true)}>Older</button>}
      </section>; })}
  </div>;
}

/* ---------- the settings: Slots, and the test runs a worker may hold ---------- */
function Q9Settings({limit, setLimit}) {
  const toast = useToast();
  const [tests, setTests] = useState(2);
  const set = (n) => { setLimit(n); toast(`Slots: ${n}`); };
  return <div className="q9-settings">
    <div className="q9-set"><div className="grow"><label id="q9-limit">Slots</label><p>Tests, builds and checks running together</p><code>process.run_batch_size</code></div>
      <div className="q9-step" role="group" aria-labelledby="q9-limit"><button type="button" aria-label="One fewer" disabled={limit <= 1} onClick={() => set(limit - 1)}>−</button><output>{limit}</output><button type="button" aria-label="One more" onClick={() => set(limit + 1)}>+</button></div></div>
    <div className="q9-set"><div className="grow"><label htmlFor="q9-tests">Test runs per worker</label><p>0 is no limit</p></div>
      <input id="q9-tests" className="qbox q9-num" type="number" min="0" value={tests} onChange={(e) => setTests(Number(e.target.value))} /></div>
  </div>;
}

/* ---------- the inspector ---------- */
function QueueInspector({onClose, onOpen, onBack}) {
  const [paused, setPaused] = useState(false);
  const [reason, setReason] = useState("");
  const [limit, setLimit] = useState(3);
  const actions = [
    ...(paused ? [] : [{group: "Queue", label: "Pause", icon: "pause", desc: "No new slots", field: {label: "Reason"}, confirm: "Pause", run: (why) => { setPaused(true); setReason(typeof why === "string" ? why : ""); }, done: "Queue paused"}]),
    {group: "Context", label: "Copy command", icon: "copy", desc: "journal queue list", done: "Command copied"},
  ];
  const primary = paused ? {label: "Resume", run: () => { setPaused(false); setReason(""); }, done: "Queue resumed"} : null;
  const tabs = [
    {key: "queue", label: "Queue", count: Q9_RUNS.filter((r) => r.section !== "finished").length, flush: true, render: () => <Q9Queue limit={limit} paused={paused} reason={reason} />},
    {key: "settings", label: "Settings", render: () => <Q9Settings limit={limit} setLimit={setLimit} />},
  ];
  return <InspectorShell term="queue" id={1} kind="Queue" title="Process queue" width="medium" primary={primary} actions={actions} tabs={tabs} comments={false} onClose={onClose} onOpen={onOpen} onBack={onBack} />;
}

Object.assign(window, {Q16Progress, Q9Glance, Q9Row, Q9Queue, Q9Settings, QueueInspector});
