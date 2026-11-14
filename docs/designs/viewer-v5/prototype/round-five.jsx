// Round five (messages 120222 and 120239, and the Commands rows of the task inspector).
// This file replaces, by name, HomeAgentBar (home-now.jsx) and TaskInspector (inspectors.jsx), and puts PlansWithFocus in the Plans window.
// 1. Plan focus: the main agent's focused plan, with its progress, after the task and plan in the agent bar, and marked in the Plans window.
// 3. Badges are squarish (round-five.css); the UI kit gets a Badges section.
// 4. The task inspector's command rows put the kind and the number in two columns, as every other reference does.

Object.assign(ICONS, {target: "M8 2.5a5.5 5.5 0 1 1 0 11a5.5 5.5 0 1 1 0-11M8 5.5a2.5 2.5 0 1 1 0 5a2.5 2.5 0 1 1 0-5M8 7.6v.8"});

/* ---------- the plan focus: one plan the agent works on first, named by it or by you, else the default ---------- */
// the default is the oldest started plan that has work the agent can take (journal-plans skill, "How its tasks are handed out")
const planTasks = (p) => p.phases.flatMap((x) => x.tasks).map((id) => TASKS.find((t) => t.id === id)).filter(Boolean);
const planProgress = (p) => { const ts = planTasks(p); return {total: ts.length, done: ts.filter((t) => t.state === "completed").length, testing: ts.filter((t) => t.state === "testing").length}; };
const FOCUSABLE = (p) => p.state === "started" || p.state === "approved";
const defaultFocus = () => [...PLANS].filter((p) => p.state === "started" && planTasks(p).some((t) => ["open", "started"].includes(t.state))).sort((a, b) => a.id - b.id)[0] || null;
const FOCUS = {plan: 1131, source: "explicit", listeners: new Set()};
function useFocus() {
  const [, tick] = useState(0);
  useEffect(() => { const heard = () => tick((n) => n + 1); FOCUS.listeners.add(heard); return () => FOCUS.listeners.delete(heard); }, []);
  const plan = FOCUS.source === "explicit" ? PLANS.find((p) => p.id === FOCUS.plan) : defaultFocus();
  const choose = (id) => { FOCUS.plan = id; FOCUS.source = id == null ? "default" : "explicit"; FOCUS.listeners.forEach((f) => f()); };
  return {plan, source: FOCUS.source, choose};
}
function FocusBar({plan}) {
  const {total, done, testing} = planProgress(plan);
  return <span className="focus-bar" aria-hidden="true"><i style={{width: `${total ? (done / total) * 100 : 0}%`}} /><i className="testing" style={{width: `${total ? (testing / total) * 100 : 0}%`}} /></span>;
}

// the focus fact in the agent bar: the target, Focus, Plan and its number, its bar and "2 of 6". It opens the focus menu.
function FocusFact({sameAsTask}) {
  const {plan, source, choose} = useFocus();
  const toast = useToast();
  const {open} = useOpen();
  if (!plan) return <span className="now-focus default" title="No plan is started or approved, so the agent has no plan focus"><Icon name="target" size={12} /><span className="word">No plan focus</span></span>;
  const {total, done} = planProgress(plan);
  const why = source === "default" ? "The default focus: the oldest started plan with work. Choose one" : "The plan the agent works on first. Change it";
  return <Menu align="left" width={380} button={({toggle, open: shown}) => <button type="button" className={"now-focus" + (source === "default" ? " default" : "") + (shown ? " on" : "")} title={`${why}: plan ${plan.id}, ${done} of ${total} tasks done`} aria-haspopup="menu" aria-expanded={shown} onClick={toggle}>
      <Icon name="target" size={12} />{!sameAsTask && <span className="word">Focus</span>}<b>Plan {plan.id}</b><FocusBar plan={plan} /><span>{done} of {total}</span>
    </button>}>{(close) => <>
      <div className="dd-head"><span>Plan focus of main</span><span className="grow" /><span className="faint" style={{fontSize: 11}}>{source === "default" ? "the default" : "named"}</span></div>
      <div className="dd-sub">The plan main works on first. Its tasks are handed out before the others.</div>
      {PLANS.map((p) => { const pr = planProgress(p); const on = plan.id === p.id; return <button key={p.id} type="button" role="menuitemradio" aria-checked={on} className="focus-row" disabled={!FOCUSABLE(p)} title={FOCUSABLE(p) ? p.title : `Plan ${p.id} is ${STATE_WORDS[p.state].toLowerCase()}: only a started or approved plan can be the focus`} onClick={() => { choose(p.id); toast(`Plan ${p.id} is main's focus`); close(); }}>
        <span className="tick">{on && <Icon name="tick" size={12} />}</span><span>Plan</span><span className="n">{p.id}</span><span>{FOCUSABLE(p) ? p.title : STATE_WORDS[p.state]}</span><FocusBar plan={p} /><span className="num">{pr.done} of {pr.total}</span>
      </button>; })}
      <div className="menu-sep" />
      <MenuItem icon="back" check={undefined} desc={`Now plan ${defaultFocus()?.id ?? "none"}: the oldest started plan with work`} onClick={() => { choose(null); toast("main is back on the default focus"); close(); }}>Use the default</MenuItem>
      <MenuItem icon="plan" onClick={() => { open("plan", plan.id); close(); }}>Open plan {plan.id}</MenuItem>
      <div className="dd-foot">The same as journal plan focus {plan.id}</div>
    </>}</Menu>;
}

/* ---------- the agent bar: as round four, with the focus after the task and its plan ---------- */
function HomeAgentBar() {
  const {open} = useOpen();
  const [paused, setPaused] = useState(false);
  const {plan} = useFocus();
  const t = TASKS.find((x) => x.id === AGENTS[0].task);
  const helpers = AGENTS.filter((a) => a.role !== "Main agent" && a.state !== "open");
  const same = plan && plan.id === t.plan;
  return <div className="now-agent" data-agent-bar>
    <span className={"now-dot " + (paused ? "paused" : "running")} />
    <strong>{paused ? "Paused" : "Working"}</strong>
    <button type="button" className="now-task" title={t.title} onClick={() => open("task", t.id)}>Task {t.id}: {t.title}</button>
    {!same && t.plan && <button type="button" className="now-plan" title={`Open plan ${t.plan}`} onClick={() => open("plan", t.plan)}>Plan {t.plan}</button>}
    <FocusFact sameAsTask={same} />
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

/* ---------- the Plans window: round four's cards; the focused plan carries the accent edge and Focus in its head ---------- */
function PlansWithFocus({onOpen}) {
  const [value, setValue] = useState({state: {not: true, values: ["completed"]}});
  const [words, setWords] = useState("");
  const {plan: focused, source, choose} = useFocus();
  const toast = useToast();
  const rows = applyFilter(PLANS, PLAN_FIELDS, value, words, (p) => `${p.id} ${p.title}`);
  return <div className="col" style={{height: "100%", gap: 0}}>
    <FilterBar fields={PLAN_FIELDS} rows={PLANS} value={value} onChange={setValue} words={words} onWords={setWords} shown={rows.length} placeholder="Search plans" />
    <div className="pl-grid">{rows.map((p) => { const ts = planTasks(p); const {done, testing} = planProgress(p); const phase = p.phases.find((x) => x.tasks.some((id) => TASKS.find((t) => t.id === id && t.state !== "completed")))?.n; const isFocus = focused?.id === p.id;
      return <div key={p.id} role="button" tabIndex={0} className={"pl-card" + (isFocus ? " focus" : "")} aria-current={isFocus ? "true" : undefined} onClick={() => onOpen("plan", p.id)} onKeyDown={(e) => e.key === "Enter" && onOpen("plan", p.id)}>
        <span className="pl-head"><Icon name="plan" size={12} /><span>Plan</span><span className="n">{p.id}</span>
          {isFocus ? <span className={"pl-focus" + (source === "default" ? " default" : "")} title={source === "default" ? "main's focus by default: the oldest started plan with work" : "main's focus: its tasks are handed out first"}><Icon name="target" size={11} />Focus</span>
            : FOCUSABLE(p) ? <span role="button" tabIndex={0} className="pl-make" title={`Make plan ${p.id} main's focus`} aria-label={`Make plan ${p.id} main's focus`} onClick={(e) => { e.stopPropagation(); choose(p.id); toast(`Plan ${p.id} is main's focus`); }} onKeyDown={(e) => { if (e.key === "Enter") { e.stopPropagation(); choose(p.id); } }}><Icon name="target" size={12} /></span> : <span />}
          <span className="pl-state"><span className={"sdot " + p.state} />{STATE_WORDS[p.state]}</span></span>
        <span className="pl-title" title={p.title}>{p.title}</span>
        <span className="pl-bar" title={`${done} of ${ts.length} done`}><i style={{width: `${ts.length ? (done / ts.length) * 100 : 0}%`}} /><i className="testing" style={{width: `${ts.length ? (testing / ts.length) * 100 : 0}%`}} /></span>
        <span className="pl-foot"><span>{done} of {ts.length} tasks done{phase ? ` · phase ${phase}` : ""}</span><span><AgentLink name={p.by} /></span></span>
      </div>; })}
      {!rows.length && <Empty title="No plans match" action={<Btn small onClick={() => { setValue(emptyFilter()); setWords(""); }}>Clear the filters</Btn>} />}
    </div>
  </div>;
}
NOW_WINDOWS.plans = PlansWithFocus;

/* ---------- the task inspector: as inspectors.jsx; a command row is icon, Output and its number in two columns, the command, its state ---------- */
function TaskInspector({id, onClose, onOpen, onBack}) {
  const t = task(id) || TASKS[0];
  const [state, setState] = useState(t.state);
  const live = ["open", "started", "testing", "blocked"].includes(state);
  const primary = {blocked: {label: "Unblock", run: () => setState("open")}, testing: {label: "Send back to work", run: () => setState("started")}, completed: {label: "Reopen", run: () => setState("open")}, cancelled: {label: "Reopen", run: () => setState("open")}}[state];
  const actions = [
    ...(live ? [{group: "Who works on it", label: "Assign to an agent", icon: "agent", field: {label: "Agent", kind: "agent"}, confirm: "Assign"}] : []),
    ...(["started", "testing"].includes(state) ? [{group: "State", label: "Complete the task", icon: "tick", field: {label: "What was the outcome?"}, confirm: "Complete", run: () => { setState("completed"); }}] : []),
    ...(["open", "started"].includes(state) ? [{group: "State", label: "Block the task", icon: "pause", field: {label: "What does it wait on?"}, confirm: "Block", run: () => { setState("blocked"); }}] : []),
    ...CONTEXT_ACTIONS("task", t.id),
    ...(live ? [{group: "Danger", label: "Cancel the task", icon: "stop", danger: true, field: {label: "Why is it cancelled?"}, confirm: "Cancel the task", run: () => { setState("cancelled"); }}] : []),
  ];
  const outputs = OUTPUTS.filter((o) => o.task === t.id);
  const tabs = [
    {key: "details", label: "Details", render: () => <>
      {state === "blocked" && t.reason && <div className="notice warn" style={{marginBottom: 20}}><Icon name="pause" /><div><Linked text={t.reason} /></div></div>}
      <Section title="Facts"><Fields rows={[["Plan", t.plan ? <span><RowLink term="plan" id={t.plan} /> · phase {t.phase}</span> : "No plan"], ["Held by", t.by ? <AgentLink name={t.by} /> : "Nobody"], ["Priority", t.priority], ["Complexity", `${t.complexity} of 5`], ["Tags", t.tags.length ? <span className="row" style={{gap: 4}}>{t.tags.map((g) => <span key={g} className="chip">{g}</span>)}</span> : "None"]]} /></Section>
      <Section title="What waits on what"><div className="col" style={{gap: 2}}><TaskRow t={task(9681)} end={<span className="faint">ends first</span>} /><TaskRow t={task(9684)} end={<span className="faint">waits on this</span>} /></div></Section>
      {outputs.length > 0 && <Section title="Commands">{outputs.map((o) => <div key={o.id} className="link-row cols cmd"><Icon name="term" size={13} style={{color: "var(--text-3)"}} /><span style={{"--rc-kind": "48px"}}><RefCols term="output" id={o.id} /></span><span className="mono" title={o.line}>{o.line}</span><Badge state={o.state}>{o.state === "started" ? "Running" : undefined}</Badge></div>)}</Section>}
    </>},
    {key: "log", label: "Log", count: 3, render: () => <Timeline rows={[["Started by " + (t.by || "main"), "40 min ago", true], ["Assigned from plan " + (t.plan || 1131), "1 h ago"], ["Created from message 120010", "yesterday"]]} />},
  ];
  const links = [{kind: "Report", term: "report", id: 1376, title: "Full-run failures, grouped", icon: "doc"}, ...outputs.map((o) => ({kind: "Output", term: "output", id: o.id, title: o.line, state: o.state, icon: "term"}))];
  return <InspectorShell term="task" id={t.id} kind={`Task ${t.id}`} state={state} title={t.title} width="medium" primary={primary} actions={actions} tabs={tabs} links={links} onClose={onClose} onOpen={onOpen} onBack={onBack} />;
}

/* ---------- UI kit: a Badges section, after Colour and states ---------- */
function BadgesKit() {
  return <>
    <Rules items={[
      "**Badges are squarish.** Every badge, state pill, tag, chip and count has a 4 px corner (`--r-badge`). Never a pill, never a circle around words.",
      "A **state badge** is a small dot and the state's word, 20 px tall in a header and 18 px in a row, 11 px text. Only blocked and failed are amber; every other state is grey.",
      "A **tag** is outlined and 18 px tall. A **source badge** (Project, Changed, Problem) is outlined; Changed has a dashed edge, Problem is amber.",
      "A **count** after a tab or a nav item is a number on a faint ground, with the same 4 px corner.",
      "A badge always stands in its own column, so it lines up whatever the width of what comes before it.",
    ]} />
    <Ex cap="State badges" row>{["open", "started", "testing", "blocked", "completed", "cancelled", "ready"].map((s) => <span key={s} className="pl-state"><span className={"sdot " + s} />{STATE_WORDS[s]}</span>)}</Ex>
    <Ex cap="Tags, source badges and counts" row><span className="tk-tag">viewer</span><span className="tk-tag">tests</span><span className="tk-tag more">+2</span><span className="pf-src">Comes with the journal</span><span className="pf-src project">Project</span><span className="pf-src changed">Changed</span><span className="pf-src problem">Problem</span><Badge state="started" /><span className="chip">skill</span></Ex>
    <DoDont good={<div className="row"><span className="pl-state"><span className="sdot started" />Started</span><span className="tk-tag">viewer</span></div>} bad={<div className="row"><span className="pl-state" style={{borderRadius: 999}}><span className="sdot started" />Started</span><span className="tk-tag" style={{borderRadius: 999}}>viewer</span></div>} />
  </>;
}
const KIT_BODY_BEFORE_BADGES = window.KitBody;
window.KitBody = function KitBodyWithBadges(props) { return props.id === "badges" ? <BadgesKit /> : <KIT_BODY_BEFORE_BADGES {...props} />; };
if (!KIT_SECTIONS.some((s) => s.id === "badges")) KIT_SECTIONS.splice(KIT_SECTIONS.findIndex((s) => s.id === "colour") + 1, 0, {id: "badges", title: "Badges", desc: "Squarish, a 4 px corner, in a column of their own", group: "Foundations"});

Object.assign(window, {useFocus, FocusFact, HomeAgentBar, PlansWithFocus, TaskInspector, BadgesKit, planProgress});
