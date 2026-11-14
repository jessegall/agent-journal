// Round five (messages 120222 and 120239, and the Commands rows of the task inspector), with the round-seventeen badge rule.
// Replaces by name: TaskInspector (inspectors.jsx). The plan focus pieces (useFocus, FocusFact, the agent bar, the Plans window) are round-six-focus.jsx's;
// this file keeps the focus state they share (FOCUS, planTasks, planProgress, FocusBar).
// The UI kit gets a Badges section: one rule, a box only for a state that needs the person.

Object.assign(ICONS, {target: "M8 2.5a5.5 5.5 0 1 1 0 11a5.5 5.5 0 1 1 0-11M8 5.5a2.5 2.5 0 1 1 0 5a2.5 2.5 0 1 1 0-5M8 7.6v.8"});

/* ---------- the plan focus: one plan the agent works on first, named by it or by you, else the default ---------- */
// the default is the oldest started plan that has work the agent can take (journal-plans skill, "How its tasks are handed out")
const planTasks = (p) => p.phases.flatMap((x) => x.tasks).map((id) => TASKS.find((t) => t.id === id)).filter(Boolean);
const planProgress = (p) => { const ts = planTasks(p); return {total: ts.length, done: ts.filter((t) => t.state === "completed").length, testing: ts.filter((t) => t.state === "testing").length}; };
const FOCUSABLE = (p) => p.state === "started" || p.state === "approved";
const defaultFocus = () => [...PLANS].filter((p) => p.state === "started" && planTasks(p).some((t) => ["open", "started"].includes(t.state))).sort((a, b) => a.id - b.id)[0] || null;
const FOCUS = {plan: 1131, source: "explicit", listeners: new Set()};
function FocusBar({plan}) {
  const {total, done, testing} = planProgress(plan);
  return <span className="focus-bar" aria-hidden="true"><i style={{width: `${total ? (done / total) * 100 : 0}%`}} /><i className="testing" style={{width: `${total ? (testing / total) * 100 : 0}%`}} /></span>;
}

/* ---------- the task inspector: a command row is icon, the output number, the command, its state ---------- */
function TaskInspector({id, onClose, onOpen, onBack}) {
  const t = task(id) || TASKS[0];
  const [state, setState] = useState(t.state);
  const live = ["open", "started", "testing", "blocked"].includes(state);
  const primary = {blocked: {label: "Unblock", run: () => setState("open")}, testing: {label: "Send back", run: () => setState("started")}, completed: {label: "Reopen", run: () => setState("open")}, cancelled: {label: "Reopen", run: () => setState("open")}}[state];
  const actions = [
    ...(live ? [{group: "Who works on it", label: "Assign", icon: "agent", field: {label: "Agent", kind: "agent"}, confirm: "Assign"}] : []),
    ...(["started", "testing"].includes(state) ? [{group: "State", label: "Complete", icon: "tick", field: {label: "Outcome"}, confirm: "Complete", run: () => { setState("completed"); }}] : []),
    ...(["open", "started"].includes(state) ? [{group: "State", label: "Block", icon: "pause", field: {label: "Reason"}, confirm: "Block", run: () => { setState("blocked"); }}] : []),
    ...CONTEXT_ACTIONS("task", t.id),
    ...(live ? [{group: "Danger", label: "Cancel", icon: "stop", danger: true, field: {label: "Reason"}, confirm: "Cancel task", run: () => { setState("cancelled"); }}] : []),
  ];
  const outputs = OUTPUTS.filter((o) => o.task === t.id);
  const tabs = [
    {key: "details", label: "Details", render: () => <>
      {state === "blocked" && t.reason && <div className="notice warn" style={{marginBottom: 20}}><Icon name="pause" /><div><Linked text={t.reason} /></div></div>}
      <Section title="Facts"><Fields rows={[["Plan", t.plan ? <span><RowLink term="plan" id={t.plan} /> · phase {t.phase}</span> : "—"], ["Held by", t.by ? <AgentLink name={t.by} /> : "—"], ["Priority", t.priority], ["Complexity", `${t.complexity} of 5`], ["Tags", t.tags.length ? <span className="row" style={{gap: 4}}>{t.tags.map((g) => <span key={g} className="chip">{g}</span>)}</span> : "—"]]} /></Section>
      <Section title="Order"><div className="col" style={{gap: 2}}><TaskRow t={task(9681)} end={<span className="faint">first</span>} /><TaskRow t={task(9684)} end={<span className="faint">after</span>} /></div></Section>
      {outputs.length > 0 && <Section title="Commands">{outputs.map((o) => <div key={o.id} className="link-row cols cmd"><Icon name="term" size={13} style={{color: "var(--text-3)"}} /><RowLink term="output" id={o.id} bare /><span className="mono" title={o.line}>{o.line}</span><Badge state={o.state}>{OUTPUT_WORDS[o.state]}</Badge></div>)}</Section>}
    </>},
    {key: "log", label: "Log", count: 3, render: () => <Timeline rows={[[`Started · ${t.by || "main"}`, "40 min ago", true], [`Assigned · plan ${t.plan || 1131}`, "1 h ago"], ["Created · message 120010", "yesterday"]]} />},
  ];
  const links = [{kind: "Report", term: "report", id: 1376, title: "Full-run failures, grouped", icon: "doc"}, ...outputs.map((o) => ({kind: "Output", term: "output", id: o.id, title: o.line, state: o.state, icon: "term"}))];
  return <InspectorShell term="task" id={t.id} kind={`Task ${t.id}`} state={state} title={t.title} width="medium" primary={primary} actions={actions} tabs={tabs} links={links} onClose={onClose} onOpen={onOpen} onBack={onBack} />;
}

/* ---------- UI kit: a Badges section, after Colour and states ---------- */
function BadgesKit() {
  return <>
    <Rules items={[
      "**One rule (kit.jsx Badge): a box only for a state that needs the person.** Failed, Blocked, Problem, Update, Paused and a wait on the person get a badge. Every normal state (Open, Active, In force, Running, Passed, Started, Ready, Approved, Connected, Up to date) is faint text, or nothing when a heading, a filter or a dot already says it.",
      "**Badges are squarish.** Every badge, tag and count has a 4 px corner (`--r-badge`). Never a pill, never a circle around words.",
      "A **tag** is outlined and 18 px tall. A **count** after a tab or a nav item is a number on a faint ground.",
      "A badge or a faint state stands at the row's right edge, so it lines up whatever the width of what comes before it.",
    ]} />
    <Ex cap="Needs the person: a badge" row>{["failed", "blocked", "problem", "update", "paused"].map((s) => <Badge key={s} state={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</Badge>)}</Ex>
    <Ex cap="Normal: faint text" row>{["open", "started", "ready", "approved", "done"].map((s) => <Badge key={s} state={s} />)}<span className="badge-quiet">Connected</span><span className="badge-quiet">Up to date</span></Ex>
    <Ex cap="Tags and counts" row><span className="tk-tag">viewer</span><span className="tk-tag">tests</span><span className="tk-tag more">+2</span><span className="chip">skill</span></Ex>
    <DoDont good={<div className="row"><span className="badge-quiet">Started</span><Badge state="blocked">Blocked</Badge></div>} bad={<div className="row"><span className="badge started">Started</span><span className="badge open">Connected</span></div>} />
  </>;
}
const KIT_BODY_BEFORE_BADGES = window.KitBody;
window.KitBody = function KitBodyWithBadges(props) { return props.id === "badges" ? <BadgesKit /> : <KIT_BODY_BEFORE_BADGES {...props} />; };
if (!KIT_SECTIONS.some((s) => s.id === "badges")) KIT_SECTIONS.splice(KIT_SECTIONS.findIndex((s) => s.id === "colour") + 1, 0, {id: "badges", title: "Badges", desc: "A box only when it needs you", group: "Foundations"});

Object.assign(window, {TaskInspector, BadgesKit, planProgress, planTasks, FocusBar, FOCUS, FOCUSABLE, defaultFocus});
