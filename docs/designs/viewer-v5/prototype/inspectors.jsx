// Every inspector is InspectorShell with its own tabs and actions. Nothing else differs. Inspectors open on a stack.

const task = (id) => TASKS.find((t) => t.id === id);
const CONTEXT_ACTIONS = (term, id) => [
  {group: "Context", label: "Copy the context command", icon: "copy", desc: `journal ${term} context ${id}`, done: "Command copied"},
  {group: "Context", label: "Mention in the chat", icon: "chat", done: `${term} ${id} put in the message box`},
];
// a timeline row's words may name rows: each named row is a link
const Timeline = ({rows}) => <div className="timeline">{rows.map(([a, b, h]) => <div key={a} className={"tl" + (h ? " hot" : "")}><b><Linked text={a} /></b><small><Linked text={b} /></small></div>)}</div>;
const TaskRow = ({t, end}) => { const {open} = useOpen(); return <button className="trow" onClick={() => open("task", t.id)}><span className={"dot " + t.state} /><span className="ref">{t.id}</span><span className="grow ellipsis">{t.title}</span>{end && <span className="end">{end}</span>}</button>; };

function PlanInspector({id, onClose, onOpen, onStep, onBack}) {
  const plan = PLANS.find((p) => p.id === id) || PLANS[0];
  const [state, setState] = useState(plan.state);
  const all = plan.phases.flatMap((p) => p.tasks).map(task).filter(Boolean);
  const done = all.filter((t) => t.state === "completed").length;
  const openTasks = all.filter((t) => !["completed", "cancelled"].includes(t.state));
  const primary = {draft: {label: "Mark ready", run: () => setState("ready")}, ready: {label: "Approve", run: () => setState("approved"), done: "Approved. The agent starts the plan"}, approved: {label: "Start", run: () => setState("started")}, blocked: {label: "Resume", run: () => setState("started"), done: "Plan resumed"}}[state];
  const live = ["draft", "ready", "approved", "started", "blocked"].includes(state);
  const actions = [
    ...(live ? [
      {group: "Who works on it", label: "Assign to an agent", icon: "agent", field: {label: "Agent", kind: "agent"}, confirm: "Assign", done: "Plan assigned"},
      {group: "Who works on it", label: "Let the main agent pick", icon: "user", done: "The main agent picks who works on it"},
    ] : []),
    ...(state === "started" ? [
      {group: "State", label: "Pause the plan", icon: "pause", field: {label: "Why does it wait?", placeholder: "It waits on…"}, confirm: "Pause", run: () => setState("blocked"), done: "Plan paused"},
      // refused by the plan's close guard while tasks are open: the menu stays open and says which
      {group: "State", label: "Complete the plan", icon: "tick", run: () => openTasks.length ? `${openTasks.length} of its tasks are still open (task ${openTasks[0].id} first). Complete or cancel them, then the plan.` : setState("completed"), done: "Plan completed"},
    ] : []),
    ...(state === "completed" || state === "cancelled" ? [{group: "State", label: "Reopen the plan", icon: "back", run: () => setState("started")}] : []),
    ...CONTEXT_ACTIONS("plan", plan.id),
    ...(live ? [{group: "Danger", label: "Cancel the plan", icon: "stop", danger: true, field: {label: "Why is it cancelled?"}, confirm: "Cancel the plan", run: () => setState("cancelled"), done: "Plan cancelled"}] : []),
  ];
  const tabs = [
    {key: "details", label: "Details", render: () => <>
      <Section title="Progress"><div className="row" style={{gap: 12}}><div className="progress grow" role="progressbar" aria-valuenow={done} aria-valuemax={all.length}><i style={{width: `${all.length ? (done / all.length) * 100 : 0}%`}} /></div><span className="muted" style={{fontSize: 12}}>{done} of {all.length} done</span></div></Section>
      {state === "blocked" && <div className="notice warn" style={{marginBottom: 20}}><Icon name="pause" /><div><b style={{fontWeight: 500}}>Paused, waiting on</b><div><Linked text={plan.reason || "the reason given when it was paused"} /></div></div></div>}
      <Section title="Brief"><p style={{margin: 0, lineHeight: 1.6}}><Linked text={plan.brief} /></p></Section>
      <Section title="Phases">{plan.phases.map((ph) => <PhaseCard key={ph.n} phase={ph} />)}</Section>
      <Section title="Facts"><Fields rows={[["Assigned to", <span className="row"><Avatar name={plan.by} agent /><AgentLink name={plan.by} /></span>], ["Created", <span>2 days ago, from <RowLink term="message" id={120010} /></span>], ["Started", "yesterday, 14:02"], ["Checkpoints", "1 of 3 passed"]]} /></Section>
    </>},
    {key: "timeline", label: "Timeline", render: () => <Timeline rows={[["Phase 2 started", "main · 1 h ago", true], ["Task 9681 completed", "worker-7 · 3 h ago"], ["Checkpoint 1 passed", "reviewer-3 · 5 h ago"], ["Plan started", "Jesse · yesterday"], ["Plan approved", "Jesse · yesterday"]]} />},
    {key: "reviews", label: "Reviews", count: 1, render: () => <div className="ccard"><div className="who"><Avatar name="reviewer-3" agent /><AgentLink name="reviewer-3" /> · round 1 <span style={{marginLeft: "auto"}}><Badge state="done">Passed</Badge></span></div><p>The phases are ordered and each has a test command. One note on phase 3: name the skill files. Read report 1376 first.</p></div>},
  ];
  const links = [...all.map((t) => ({kind: "Task", term: "task", id: t.id, title: t.title, state: t.state, icon: "task"})), {kind: "Document", term: "doc", id: 1402, title: "Viewer v5: shared layouts", icon: "doc"}, {kind: "Message", term: "message", id: 120010, title: "Please send out the designer…", icon: "chat"}];
  return <InspectorShell term="plan" id={plan.id} kind={`Plan ${plan.id}`} state={state} title={plan.title} width="large" primary={primary} actions={actions} tabs={tabs} links={links} onClose={onClose} onOpen={onOpen} onStep={onStep} onBack={onBack} />;
}

// a phase: chevron, name, count on the right; its task rows put dot, number, title and holder in fixed columns
function PhaseCard({phase}) {
  const [open, setOpen] = useState(true);
  const ts = phase.tasks.map(task).filter(Boolean);
  return <div className="phase">
    <button className="phase-head" aria-expanded={open} onClick={() => setOpen(!open)}><Chevron open={open} /><b style={{fontWeight: 500}}>Phase {phase.n}</b><span className="grow muted">{phase.title}</span><span className="faint" style={{fontSize: 11.5}}>{ts.filter((t) => t.state === "completed").length} of {ts.length}</span></button>
    {open && <div className="phase-tasks">{ts.length ? ts.map((t) => <TaskRow key={t.id} t={t} end={t.by && <AgentLink name={t.by} />} />) : <div className="muted" style={{padding: "6px 12px", fontSize: 12}}>No tasks yet</div>}</div>}
  </div>;
}

function TaskInspector({id, onClose, onOpen, onBack}) {
  const t = task(id) || TASKS[0];
  const [state, setState] = useState(t.state);
  const live = ["open", "started", "testing", "blocked"].includes(state);
  const primary = {blocked: {label: "Unblock", run: () => setState("open")}, testing: {label: "Send back to work", run: () => setState("started")}, completed: {label: "Reopen", run: () => setState("open")}, cancelled: {label: "Reopen", run: () => setState("open")}}[state];
  const actions = [
    ...(live ? [{group: "Who works on it", label: "Assign to an agent", icon: "agent", field: {label: "Agent", kind: "agent"}, confirm: "Assign"}] : []),
    ...(["started", "testing"].includes(state) ? [{group: "State", label: "Complete the task", icon: "tick", field: {label: "What was the outcome?"}, confirm: "Complete", run: () => setState("completed")}] : []),
    ...(["open", "started"].includes(state) ? [{group: "State", label: "Block the task", icon: "pause", field: {label: "What does it wait on?"}, confirm: "Block", run: () => setState("blocked")}] : []),
    ...CONTEXT_ACTIONS("task", t.id),
    ...(live ? [{group: "Danger", label: "Cancel the task", icon: "stop", danger: true, field: {label: "Why is it cancelled?"}, confirm: "Cancel the task", run: () => setState("cancelled")}] : []),
  ];
  const outputs = OUTPUTS.filter((o) => o.task === t.id);
  const tabs = [
    {key: "details", label: "Details", render: () => <>
      {state === "blocked" && t.reason && <div className="notice warn" style={{marginBottom: 20}}><Icon name="pause" /><div><Linked text={t.reason} /></div></div>}
      <Section title="Facts"><Fields rows={[["Plan", t.plan ? <span><RowLink term="plan" id={t.plan} /> · phase {t.phase}</span> : "No plan"], ["Held by", t.by ? <AgentLink name={t.by} /> : "Nobody"], ["Priority", t.priority], ["Complexity", `${t.complexity} of 5`], ["Tags", t.tags.length ? <span className="row" style={{gap: 4}}>{t.tags.map((g) => <span key={g} className="chip">{g}</span>)}</span> : "None"]]} /></Section>
      <Section title="What waits on what"><div className="col" style={{gap: 2}}><TaskRow t={task(9681)} end={<span className="faint">ends first</span>} /><TaskRow t={task(9684)} end={<span className="faint">waits on this</span>} /></div></Section>
      {outputs.length > 0 && <Section title="Commands">{outputs.map((o) => <div key={o.id} className="link-row"><Icon name="term" size={13} style={{color: "var(--text-3)"}} /><button className="ref" onClick={() => onOpen("output", o.id)}>Output {o.id}</button><span className="ellipsis mono" style={{fontSize: 12}}>{o.line}</span><Badge state={o.state}>{o.state === "started" ? "Running" : undefined}</Badge></div>)}</Section>}
    </>},
    {key: "log", label: "Log", count: 3, render: () => <Timeline rows={[["Started by " + (t.by || "main"), "40 min ago", true], ["Assigned from plan " + (t.plan || 1131), "1 h ago"], ["Created from message 120010", "yesterday"]]} />},
  ];
  const links = [{kind: "Report", term: "report", id: 1376, title: "Full-run failures, grouped", icon: "doc"}, ...outputs.map((o) => ({kind: "Output", term: "output", id: o.id, title: o.line, state: o.state, icon: "term"}))];
  return <InspectorShell term="task" id={t.id} kind={`Task ${t.id}`} state={state} title={t.title} width="medium" primary={primary} actions={actions} tabs={tabs} links={links} onClose={onClose} onOpen={onOpen} onBack={onBack} />;
}

// the document text tab, shared by the document inspector and the Documents page
function DocumentText({doc, ctx}) {
  return <Markdown text={doc.body} comments={ctx.comments} onMark={ctx.setHot} onSelectText={ctx.setQuote} />;
}
const REVISIONS = [["Revision 3 · current", "helper-851 · 12 min ago", true], ["Revision 2", "helper-851 · 1 h ago"], ["Revision 1", "helper-851 · 2 h ago"]];

function DocumentInspector({id, onClose, onOpen, onBack}) {
  const doc = DOCS.find((d) => d.id === id) || DOCS[0];
  const label = doc.term === "report" ? "Report" : "Document";
  const actions = [
    {group: "Text", label: "Edit the text", icon: "edit", done: "Editing"},
    {group: "Text", label: "Open on the Documents page", icon: "open"},
    {group: "State", label: `Mark the ${label.toLowerCase()} as needing no action`, icon: "tick", field: {label: "Why does it need no action?"}, confirm: "Mark it"},
    ...CONTEXT_ACTIONS(doc.term, doc.id),
  ];
  const tabs = [
    {key: "text", label: "Text", flush: true, render: (ctx) => <div className="insp-body" style={{padding: 0}}><div className="reader-text" style={{padding: "20px 16px 40px"}}><DocumentText doc={doc} ctx={ctx} /></div></div>},
    {key: "revisions", label: "Revisions", count: 3, render: () => <Timeline rows={REVISIONS} />},
    {key: "details", label: "Details", render: () => <Fields rows={[["State", <Badge state={doc.state} />], ["Written by", <AgentLink name="helper-851" />], ["Created", "2 h ago"], ["Updated", doc.at]]} />},
  ];
  return <InspectorShell term={doc.term} id={doc.id} kind={`${label} ${doc.id}`} title={doc.title} abstract={doc.abstract} width="wide" actions={actions} tabs={tabs} links={[{kind: "Plan", term: "plan", id: 1133, title: "Viewer v5: one look for every page", state: "ready", icon: "plan"}]} onClose={onClose} onOpen={onOpen} onBack={onBack} />;
}

function AgentInspector({id, onClose, onOpen, onBack}) {
  const a = AGENTS.find((x) => x.id === id) || AGENTS[0];
  const [state, setState] = useState(a.state);
  const actions = [
    {group: "Session", label: state === "paused" ? "Resume the agent" : "Pause the agent", icon: state === "paused" ? "play" : "pause", desc: "Only journal commands and reads run while paused", run: () => setState(state === "paused" ? "started" : "paused")},
    {group: "Session", label: "Compact the context", icon: "gauge"},
    {group: "Session", label: "Change the model", icon: "bolt", field: {label: "Model", placeholder: "Opus 5.5"}},
    ...CONTEXT_ACTIONS("agent", a.id),
    {group: "Danger", label: "Stop the session", icon: "stop", danger: true, field: {label: "Why does it stop?"}, confirm: "Stop"},
  ];
  const held = TASKS.filter((t) => t.by === a.name && ["started", "testing", "blocked"].includes(t.state));
  const tabs = [
    {key: "now", label: "Now", render: () => <>
      <Section title="Holds">{held.length ? held.map((t) => <TaskRow key={t.id} t={t} end={<Badge state={t.state} />} />) : <p className="muted" style={{margin: 0}}>No task held</p>}</Section>
      <Section title="Session"><Fields rows={[["Role", a.role], ["Model", a.model], ["Context", <span className="row"><span className="meter" style={{width: 120}}><i style={{width: a.context + "%"}} /></span>{a.context}% full</span>], ["Last command", (() => { const o = OUTPUTS.find((x) => x.by === a.name); return o ? <RowLink term="output" id={o.id} /> : "None"; })()]]} /></Section>
    </>},
    {key: "recent", label: "Recent", render: () => <Timeline rows={[["Ran output 489998", "25 min ago", true], ["Read skill journal-tasks", "1 h ago"], ["Started task 9597", "1 h ago"]]} />},
  ];
  return <InspectorShell term="agent" id={a.id} kind={`Agent · ${a.role}`} state={state} title={a.name} width="medium" actions={actions} tabs={tabs} comments={false} links={held.map((t) => ({kind: "Task", term: "task", id: t.id, title: t.title, state: t.state, icon: "task"}))} onClose={onClose} onOpen={onOpen} onBack={onBack} />;
}

function MemoryInspector({id, onClose, onOpen, onBack}) {
  const m = MEMORIES.find((x) => x.id === id) || MEMORIES[0];
  const tabs = [{key: "text", label: "Text", render: () => <><p style={{marginTop: 0, lineHeight: 1.6}}><Linked text={m.body} /></p><Section title="Keywords"><div className="row" style={{flexWrap: "wrap"}}>{["comment box", "inspector"].map((k) => <span key={k} className="chip">{k}</span>)}<Btn small>Add a keyword</Btn></div></Section><Section title="Facts"><Fields rows={[["Held by", <AgentLink name={m.group} />], ["Weight", `${m.weight} of 10`]]} /></Section></>}];
  const actions = [{group: "Memory", label: "Change the weight", icon: "gauge", field: {label: "Weight, 1 to 10"}}, ...CONTEXT_ACTIONS("memory", m.id), {group: "Danger", label: "Remove the memory", icon: "trash", danger: true, field: {label: "Why is it removed?"}, confirm: "Remove"}];
  return <InspectorShell term="memory" id={m.id} kind={`Memory ${m.id}`} state={m.state === "active" ? "on" : "off"} title={m.desc} width="small" actions={actions} tabs={tabs} comments={false} onClose={onClose} onOpen={onOpen} onBack={onBack} />;
}

// an output: the command, what it printed, who ran it for which task. Opened from the Output page, a task, an agent or any reference.
function OutputInspector({id, onClose, onOpen, onBack}) {
  const o = OUTPUTS.find((x) => x.id === id) || OUTPUTS[1];
  const tabs = [
    {key: "output", label: "Output", render: () => <pre className="md" style={{margin: 0, padding: "12px 14px", border: "1px solid var(--border)", borderRadius: 8, background: "var(--term)", font: "12px/1.6 var(--mono)", color: o.state === "failed" ? "var(--text)" : "var(--text-2)", whiteSpace: "pre-wrap"}}>{o.text}</pre>},
    {key: "details", label: "Details", render: () => <Fields rows={[["Command", <span className="mono" style={{fontSize: 12}}>{o.line}</span>], ["Ran by", <AgentLink name={o.by} />], ["For", <RowLink term="task" id={o.task} />], ["Took", o.took], ["When", o.at]]} />},
  ];
  return <InspectorShell term="output" id={o.id} kind={`Output ${o.id}`} state={o.state} title={o.line} width="large" comments={false} tabs={tabs} actions={[{group: "Output", label: "Run it again", icon: "play"}, {group: "Output", label: "Copy the read command", icon: "copy", desc: `journal output read ${o.id} --summary`}]} links={[{kind: "Task", term: "task", id: o.task, title: task(o.task)?.title, icon: "task"}]} onClose={onClose} onOpen={onOpen} onBack={onBack} />;
}

function MessageInspector({id, onClose, onOpen, onBack}) {
  const m = MESSAGES.find((x) => x.id === id) || MESSAGES[0];
  const tabs = [{key: "text", label: "Message", render: () => <><p style={{marginTop: 0, lineHeight: 1.6}}><Linked text={m.text} /></p><Fields rows={[["From", m.by], ["Sent", m.at], ["Answered by", <AgentLink name="main" />]]} /></>}];
  return <InspectorShell term="message" id={m.id} kind={`Message ${m.id}`} title={m.text} width="medium" comments={false} tabs={tabs} actions={[{group: "Message", label: "Show in the chat", icon: "chat"}, ...CONTEXT_ACTIONS("message", m.id)]} links={[{kind: "Plan", term: "plan", id: 1133, title: "Viewer v5: one look for every page", state: "ready", icon: "plan"}]} onClose={onClose} onOpen={onOpen} onBack={onBack} />;
}

/* ---------- the inspector stack ----------
   A row opened from an inspector slides in on top of it. Each inspector under the top one sits --peek (28 px) further left than the one above,
   2% smaller and a little darker, its name down its visible edge. A click on one brings it back into focus: the ones above slide out right.
   A click on the dimmed page, or Escape, closes the top one only; Close closes them all. A pane's row opens on this same stack. */
const WIDTH_OF = {plan: "large", doc: "wide", report: "wide", memory: "small", task: "medium", agent: "medium", output: "large", message: "medium"};
const PEEK = 28;
const widthPx = (w, vw) => Math.min({small: 480, medium: 640, large: 820, wide: Math.min(1120, vw * 0.92)}[w], vw - 24);
const labelOf = (s) => (TERM_WORDS[s.term] || s.term) + " " + s.id;
function stackPlaces(stack, vw) {
  const live = stack.filter((s) => !s.leaving);
  const places = {}; let leftAbove = null;
  for (let i = live.length - 1; i >= 0; i--) {
    const s = live[i]; const w = widthPx(WIDTH_OF[s.term] || "medium", vw); const depth = live.length - 1 - i;
    let tx = depth === 0 ? 0 : Math.min(0, leftAbove - PEEK + w - vw);
    tx = Math.max(tx, w - vw + depth * 6);
    leftAbove = vw + tx - w;
    places[s.key] = {tx, depth};
  }
  return places;
}

function InspectorFor({s, ...props}) {
  const C = {plan: PlanInspector, task: TaskInspector, doc: DocumentInspector, report: DocumentInspector, agent: AgentInspector, memory: MemoryInspector, output: OutputInspector, message: MessageInspector}[s.term];
  if (C) return <C id={s.id} {...props} />;
  return <InspectorShell term={s.term} id={s.id} kind={labelOf(s)} title={labelOf(s)} tabs={[{key: "details", label: "Details", render: () => <p className="muted">This row opens in the shared inspector shape.</p>}]} {...props} />;
}

function InspectorStack({stack, onOpen, onBack, onFocus, onClose}) {
  const [vw, setVw] = useState(window.innerWidth);
  useEffect(() => { const r = () => setVw(window.innerWidth); window.addEventListener("resize", r); return () => window.removeEventListener("resize", r); }, []);
  if (!stack.length) return null;
  const places = stackPlaces(stack, vw);
  const several = stack.filter((s) => !s.leaving).length > 1;
  return <div className="stack-veil" onMouseDown={(e) => e.target === e.currentTarget && onBack()}>
    {stack.map((s, i) => {
      const p = places[s.key] || {tx: 0, depth: 0};
      const top = !s.leaving && p.depth === 0;
      return <div key={s.key} className={"stack-item" + (s.leaving ? " leaving" : "") + (!top && !s.leaving ? " under" : "")} style={{transform: `translateX(${p.tx}px) scale(${1 - p.depth * 0.02})`, zIndex: i + 1, "--dim": Math.min(p.depth * 0.15, 0.45)}} aria-hidden={!top}>
        <InspectorFor s={s} onClose={onClose} onOpen={onOpen} onBack={several && top ? onBack : null} onStep={s.term === "plan" ? (d) => { const at = PLANS.findIndex((x) => x.id === s.id); onOpen("plan", PLANS[(at + d + PLANS.length) % PLANS.length].id, "replace"); } : null} />
        {!top && !s.leaving && <button className="stack-peek" title={`Back to ${labelOf(s)}`} aria-label={`Back to ${labelOf(s)}`} onClick={() => onFocus(s.key)}><span className="stack-peek-label">{labelOf(s)}</span></button>}
      </div>;
    })}
  </div>;
}

Object.assign(window, {PlanInspector, TaskInspector, DocumentInspector, DocumentText, AgentInspector, MemoryInspector, OutputInspector, MessageInspector, InspectorStack, Timeline, TaskRow, REVISIONS});
