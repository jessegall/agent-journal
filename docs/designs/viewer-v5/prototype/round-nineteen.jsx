// Round nineteen (users 121777 and 121795). Loaded after round sixteen. Replaces by name: R8TaskLine, Q9Row.
// 1. An agent card's third line carries its plan's progress: one bar in three shades (completed full, testing lighter, started faint;
//    open and blocked tasks leave the track uncoloured) and the count beside it, such as "4 of 18". Cancelled tasks are left out of both.
//    The bar is the plan's, not the agent's own tasks: every agent on the same plan shows the same bar. A helper's job has no plan, so no bar.
// 2. In the process queue an expanded command says when it started, as time ago (format/time.js ago(): "just now", "5m ago"),
//    beside the duration it already shows. A waiting command has not started, so it has none.

/* ---------- 1. the plan bar ---------- */
// sample rows: plan 1131 had six tasks and none testing; twelve more make it 18 (4 completed, 2 testing, 3 started, 9 open or blocked)
TASKS.push(
  {id: 9660, title: "Task window filter bar replaces Show in plan", state: "completed", by: "worker-4", plan: 1131, phase: 1, complexity: 2, priority: "normal", tags: ["viewer"]},
  {id: 9661, title: "Every row reference opens its inspector", state: "completed", by: "worker-2", plan: 1131, phase: 1, complexity: 2, priority: "normal", tags: ["viewer"]},
  {id: 9662, title: "Story kit names a nudge by its declaration", state: "testing", by: "worker-4", plan: 1131, phase: 2, complexity: 3, priority: "normal", tags: ["tests"]},
  {id: 9663, title: "Stories skip a working folder another run removed", state: "testing", by: "worker-7", plan: 1131, phase: 2, complexity: 2, priority: "normal", tags: ["tests"]},
  {id: 9664, title: "Drain skill reruns only the fixed detector", state: "started", by: "worker-2", plan: 1131, phase: 3, complexity: 2, priority: "low", tags: ["skills"]},
  ...[9665, 9666, 9667, 9668, 9669, 9670, 9671].map((id, i) => ({id, title: ["Pane tabs keep room for the close cross", "Files window gets tabs", "One context menu component", "Secrets list: Delete erases for good", "Plan bar on agent cards", "Splash at three quarters size", "Architecture upkeep: module fields as lists"][i], state: "open", plan: 1131, phase: i < 4 ? 1 : 3, complexity: 2, priority: "low", tags: []})),
);

const R19_SHADES = ["completed", "testing", "started"];
const r19PlanCounts = (plan) => {
  const ts = TASKS.filter((t) => t.plan === plan && t.state !== "cancelled");
  const n = Object.fromEntries(R19_SHADES.map((s) => [s, ts.filter((t) => t.state === s).length]));
  return {...n, open: ts.length - n.completed - n.testing - n.started, total: ts.length};
};
function R19PlanBar({plan}) {
  const c = r19PlanCounts(plan);
  if (!c.total) return null;
  const words = `Plan ${plan}: ${c.completed} completed, ${c.testing} testing, ${c.started} started, ${c.open} open`;
  return <span className="r19-plan" title={words} aria-label={words}>
    <span className="r19-bar" aria-hidden="true">{R19_SHADES.map((s) => c[s] ? <i key={s} className={s} style={{width: `${(c[s] / c.total) * 100}%`}} /> : null)}</span>
    <span className="r19-count"><b>{c.completed}</b> of {c.total}</span>
  </span>;
}
// the third line of every agent row: plan and task (or a helper's job), the rate for a worker, then the plan's bar and count; a dash when there is nothing
function R8TaskLine({a}) {
  const {open} = useOpen();
  const go = (term, id) => (e) => { e.stopPropagation(); open(term, id); };
  if (a.job) return <span className="r8-task-line"><span className="r8-job" title={a.job}>{a.jobTitle}</span></span>;
  const t = TASKS.find((x) => x.id === a.task);
  return <span className="r8-task-line">
    {a.plan && <button type="button" className="r8-ref" title={PLANS.find((p) => p.id === a.plan)?.title} onClick={go("plan", a.plan)}>Plan {a.plan}</button>}
    {t && <button type="button" className="r8-ref quiet" title={t.title} onClick={go("task", t.id)}>Task {t.id}</button>}
    {!a.plan && !t && <span className="r8-faint">—</span>}
    <span className="grow" />
    {a.role !== "main" && <span className="r8-faint" title="Tasks an hour">{a.perHour}/h</span>}
    {a.plan && <R19PlanBar plan={a.plan} />}
  </span>;
}

/* ---------- 2. the queue: when an expanded command started ---------- */
// sample start times, in seconds before now, as the run's started_at gives them (ProcessQueueRun.vue reads started_at for its duration)
const R19_STARTED = {490031: 134, 490030: 48, 490029: 31, 490028: 0, 490027: 842, 490026: 300, 490025: 420, 490024: 540, 490023: 780, 490022: 900, 490021: 1500, 490020: 2100, 490019: 3000};
Q9_RUNS.forEach((r) => { if (R19_STARTED[r.id] != null) r.startedAt = Date.now() - R19_STARTED[r.id] * 1000; });
// the app's ago(): under a minute is "just now", then minutes, hours, days
const r19Ago = (at) => { const s = Math.max(0, (Date.now() - at) / 1000); return s < 60 ? "just now" : s < 3600 ? `${Math.floor(s / 60)}m ago` : s < 86400 ? `${Math.floor(s / 3600)}h ago` : `${Math.floor(s / 86400)}d ago`; };
const r19Clock = (at) => new Date(at).toLocaleString([], {day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", hour12: false});

// one process: lead, kind, command, progress, agent, time; it folds out to its output, whose head says when it started and how long it ran
function Q9Row({r, position, open, onToggle}) {
  const {open: openRow} = useOpen();
  const failed = r.section === "finished" && r.exit !== 0;
  const lead = r.section === "waiting" ? <span className="q9-pos">{position}</span>
    : <span className={"q9-dot" + (r.section === "running" ? (r.slot ? " run" : " free") : failed ? " bad" : " ok")} aria-label={r.section === "running" ? (r.slot ? "In a slot" : "Without a slot") : failed ? `Failed, exit ${r.exit}` : "Finished"} />;
  const go = (term, id) => (e) => { e.stopPropagation(); openRow(term, id); };
  const progress = r.section === "running" ? r16ProgressWords(r) : null;
  const started = r.section !== "waiting" && r.startedAt != null;
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
          {started && <><span className="q9-sep">·</span><time dateTime={new Date(r.startedAt).toISOString()} title={r19Clock(r.startedAt)}>Started {r19Ago(r.startedAt)}</time></>}
          <span className="q9-sep">·</span><span title={r.section === "waiting" ? "Waiting for" : r.section === "running" ? "Running for" : "Ran for"}>{r.time}</span>
          {progress && <><span className="q9-sep">·</span><span className={r.steps?.failed ? "q16-bad" : ""}>{progress}</span></>}
          <span className="grow" />
          <R12Open title={`Output ${r.id}`} onClick={go("output", 489998)} />
        </div>
        <pre>{r.section === "waiting" ? <span className="q9-muted">Waiting · {position} in line</span> : <><span className="q9-prompt">$ </span>{r.line}{r.out.length ? "\n" + r.out.join("\n") : ""}{r.section === "running" && <span className="q9-caret" />}</>}</pre>
      </div>
    </div></div>
  </div>;
}

Object.assign(window, {R8TaskLine, R19PlanBar, r19PlanCounts, Q9Row});
