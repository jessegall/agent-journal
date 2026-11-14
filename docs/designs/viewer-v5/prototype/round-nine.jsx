// Round nine (message 121106): the process queue's rows, and the ways into the queue inspector. Replaces by name: InspectorFor and R8CommandBand.
// The queue inspector itself (rows, tiles, settings) is round-sixteen-queue.jsx's.
// 1. Every process the journal runs shows in the queue, not only tests, builds and checks. Those wait for a slot; the rest start without one.
// 2. One compact row per process, readable at a glance; a row folds out to its output.

const Q9_KINDS = {"test run": "test", build: "build", check: "check", plugin: "plugin", read: "read", search: "search", edit: "edit", "version control": "git", package: "package", network: "network", "background job": "job", process: "process", journal: "journal", unknown: "other"};
// the categories that wait for a slot (CommandCategory.is_queued, and a plugin's runs); every other process starts without one
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

// every row's inspector; the queue has its own, a row with no inspector of its own gets the shared shape with its facts
function InspectorFor({s, ...props}) {
  if (s.term === "queue") return <QueueInspector {...props} />;
  const C = {plan: PlanInspector, task: TaskInspector, doc: DocumentInspector, report: DocumentInspector, agent: AgentInspector, memory: MemoryInspector, output: OutputInspector, message: MessageInspector}[s.term];
  if (C) return <C id={s.id} {...props} />;
  return <R6RowInspector s={s} {...props} />;
}

/* ---------- the band under an open agent card: what it runs now, or why it waits ---------- */
function R8CommandBand({a}) {
  const {open} = useOpen();
  if (a.ended && !a.retired) return <div className="r8-command"><span className="r8-faint">Idle since {a.since.replace("Since ", "")}</span></div>;
  if (a.wait) return <div className="r8-command"><button type="button" className="r8-waiting" title="Process queue" onClick={() => q9OpenQueue(open)}>Waiting: {a.wait} <Icon name="right" size={10} /></button></div>;
  if (a.dot === "waiting") return <div className="r8-command"><span className="r8-faint">Waiting</span></div>;
  return <div className="r8-command live"><span className="r8-live-dot" /><span className="r8-run mono">{a.command || "thinking"}</span></div>;
}

Object.assign(window, {Q9_RUNS, q9Waits, q9Kind, q9OpenQueue, InspectorFor, R8CommandBand});
