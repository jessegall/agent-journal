// Every inspector is InspectorShell with its own tabs and actions. Nothing else differs. Inspectors open on a stack.
// TaskInspector is round-five.jsx's, AgentInspector round-sixteen.jsx's, InspectorFor round-six-kit.jsx's.

const task = (id) => TASKS.find((t) => t.id === id);
const CONTEXT_ACTIONS = (term, id) => [
  {group: "Context", label: "Copy command", icon: "copy", desc: `journal ${term} context ${id}`, done: "Command copied"},
  {group: "Context", label: "Mention", icon: "chat", done: `${term} ${id} in the message box`},
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
  const primary = {draft: {label: "Ready", run: () => setState("ready")}, ready: {label: "Approve", run: () => setState("approved"), done: "Approved"}, approved: {label: "Start", run: () => setState("started")}, blocked: {label: "Resume", run: () => setState("started"), done: "Plan resumed"}}[state];
  const live = ["draft", "ready", "approved", "started", "blocked"].includes(state);
  const actions = [
    ...(live ? [
      {group: "Who works on it", label: "Assign", icon: "agent", field: {label: "Agent", kind: "agent"}, confirm: "Assign", done: "Plan assigned"},
      {group: "Who works on it", label: "Auto-assign", icon: "user", done: "Main agent picks"},
    ] : []),
    ...(state === "started" ? [
      {group: "State", label: "Pause", icon: "pause", field: {label: "Reason"}, confirm: "Pause", run: () => setState("blocked"), done: "Plan paused"},
      // refused by the plan's close guard while tasks are open: the menu stays open and says which
      {group: "State", label: "Complete", icon: "tick", run: () => openTasks.length ? `${plural(openTasks.length, "open task")} · task ${openTasks[0].id} first` : setState("completed"), done: "Plan completed"},
    ] : []),
    ...(state === "completed" || state === "cancelled" ? [{group: "State", label: "Reopen", icon: "back", run: () => setState("started")}] : []),
    ...CONTEXT_ACTIONS("plan", plan.id),
    ...(live ? [{group: "Danger", label: "Cancel", icon: "stop", danger: true, field: {label: "Reason"}, confirm: "Cancel plan", run: () => setState("cancelled"), done: "Plan cancelled"}] : []),
  ];
  const tabs = [
    {key: "details", label: "Details", render: () => <>
      <Section title="Progress"><div className="row" style={{gap: 12}}><div className="progress grow" role="progressbar" aria-valuenow={done} aria-valuemax={all.length}><i style={{width: `${all.length ? (done / all.length) * 100 : 0}%`}} /></div><span className="muted" style={{fontSize: 12}}>{all.length ? `${done} of ${all.length} done` : "No tasks"}</span></div></Section>
      {state === "blocked" && <div className="notice warn" style={{marginBottom: 20}}><Icon name="pause" /><div><b style={{fontWeight: 500}}>Waiting on</b><div><Linked text={plan.reason || "—"} /></div></div></div>}
      <Section title="Brief"><p style={{margin: 0, lineHeight: 1.6}}><Linked text={plan.brief} /></p></Section>
      <Section title="Phases">{plan.phases.map((ph) => <PhaseCard key={ph.n} phase={ph} />)}</Section>
      <Section title="Facts"><Fields rows={[["Assigned to", <AgentLink name={plan.by} />], ["Created", <span>2 days ago · <RowLink term="message" id={120010} /></span>], ["Started", "yesterday 14:02"], ["Checkpoints", "1 of 3 passed"]]} /></Section>
    </>},
    {key: "timeline", label: "Timeline", render: () => <Timeline rows={[["Phase 2 started", "main · 1 h ago", true], ["Task 9681 completed", "worker-7 · 3 h ago"], ["Checkpoint 1 passed", "reviewer-3 · 5 h ago"], ["Plan started", "Jesse · yesterday"], ["Plan approved", "Jesse · yesterday"]]} />},
    {key: "reviews", label: "Reviews", count: 1, render: () => <div className="ccard"><div className="who"><AgentLink name="reviewer-3" /> · round 1 <span style={{marginLeft: "auto"}}><Badge state="done">Passed</Badge></span></div><p>The phases are ordered and each has a test command. One note on phase 3: name the skill files. Read report 1376 first.</p></div>},
  ];
  const links = [...all.map((t) => ({kind: "Task", term: "task", id: t.id, title: t.title, state: t.state, icon: "task"})), {kind: "Document", term: "doc", id: 1402, title: "Viewer v5: shared layouts", icon: "doc"}, {kind: "Message", term: "message", id: 120010, title: "Please send out the designer…", icon: "chat"}];
  return <InspectorShell term="plan" id={plan.id} kind={`Plan ${plan.id}`} state={state} title={plan.title} width="large" primary={primary} actions={actions} tabs={tabs} links={links} onClose={onClose} onOpen={onOpen} onStep={onStep} onBack={onBack} />;
}

// a phase: chevron, name, count on the right; its task rows put dot, number, title and holder in fixed columns
function PhaseCard({phase}) {
  const [open, setOpen] = useState(true);
  const ts = phase.tasks.map(task).filter(Boolean);
  return <div className="phase">
    <button className="phase-head" aria-expanded={open} onClick={() => setOpen(!open)}><Chevron open={open} /><b style={{fontWeight: 500}}>Phase {phase.n}</b><span className="grow muted">{phase.title}</span><span className="faint" style={{fontSize: 11.5}}>{ts.length ? `${ts.filter((t) => t.state === "completed").length} of ${ts.length}` : ""}</span></button>
    {open && <div className="phase-tasks">{ts.length ? ts.map((t) => <TaskRow key={t.id} t={t} end={t.by && <AgentLink name={t.by} />} />) : <div className="muted" style={{padding: "6px 12px", fontSize: 12}}>No tasks</div>}</div>}
  </div>;
}

// the document text tab, shared by the document inspector and the Documents page
function DocumentText({doc, ctx}) {
  return <Markdown text={doc.body} comments={ctx.comments} onMark={ctx.setHot} onSelectText={ctx.setQuote} />;
}
const REVISIONS = [["Revision 3 · current", "helper-851 · 12 min ago", true], ["Revision 2", "helper-851 · 1 h ago"], ["Revision 1", "helper-851 · 2 h ago"]];

function DocumentInspector({id, onClose, onOpen, onBack}) {
  const doc = DOCS.find((d) => d.id === id) || DOCS[0];
  const {go} = useOpen();
  const label = doc.term === "report" ? "Report" : "Document";
  const actions = [
    {group: "Text", label: "Edit", icon: "edit", done: "Editing"},
    {group: "Text", label: "Documents", icon: "open", run: () => { onClose(); go("documents"); return false; }},
    {group: "State", label: "Settle", icon: "tick", field: {label: "Reason"}, confirm: "Settle"},
    ...CONTEXT_ACTIONS(doc.term, doc.id),
  ];
  const tabs = [
    {key: "text", label: "Text", flush: true, render: (ctx) => <div className="insp-body" style={{padding: 0}}><div className="reader-text" style={{padding: "20px 16px 40px"}}><DocumentText doc={doc} ctx={ctx} /></div></div>},
    {key: "revisions", label: "Revisions", count: 3, render: () => <Timeline rows={REVISIONS} />},
    {key: "details", label: "Details", render: () => <Fields rows={[["By", <AgentLink name="helper-851" />], ["Created", "2 h ago"], ["Updated", doc.at]]} />},
  ];
  return <InspectorShell term={doc.term} id={doc.id} kind={`${label} ${doc.id}`} state={doc.state} title={doc.title} abstract={doc.abstract} width="wide" actions={actions} tabs={tabs} links={[{kind: "Plan", term: "plan", id: 1133, title: "Viewer v5: one look for every page", state: "ready", icon: "plan"}]} onClose={onClose} onOpen={onOpen} onBack={onBack} />;
}

function MemoryInspector({id, onClose, onOpen, onBack}) {
  const m = MEMORIES.find((x) => x.id === id) || MEMORIES[0];
  const tabs = [{key: "text", label: "Text", render: () => <><p style={{marginTop: 0, lineHeight: 1.6}}><Linked text={m.body} /></p><Section title="Keywords"><div className="row" style={{flexWrap: "wrap"}}>{["comment box", "inspector"].map((k) => <span key={k} className="chip">{k}</span>)}<Btn small icon="plus" title="Keyword" /></div></Section><Section title="Facts"><Fields rows={[["Kept by", <AgentLink name={m.group} />], ["Weight", `${m.weight} of 10`]]} /></Section></>}];
  const actions = [{group: "Memory", label: "Weight", icon: "gauge", field: {label: "Weight"}}, ...CONTEXT_ACTIONS("memory", m.id), {group: "Danger", label: "Remove", icon: "trash", danger: true, field: {label: "Reason"}, confirm: "Remove"}];
  return <InspectorShell term="memory" id={m.id} kind={`Memory ${m.id}`} title={m.desc} width="small" actions={actions} tabs={tabs} comments={false} onClose={onClose} onOpen={onOpen} onBack={onBack} />;
}

// an output: the command, what it printed, who ran it for which task. Opened from the Output page, a task, an agent or any reference.
function OutputInspector({id, onClose, onOpen, onBack}) {
  const o = OUTPUTS.find((x) => x.id === id) || OUTPUTS[1];
  const tabs = [
    {key: "output", label: "Output", render: () => <pre className="md" style={{margin: 0, padding: "12px 14px", border: "1px solid var(--border)", borderRadius: 8, background: "var(--term)", font: "12px/1.6 var(--mono)", color: o.state === "failed" ? "var(--text)" : "var(--text-2)", whiteSpace: "pre-wrap"}}>{o.text}</pre>},
    {key: "details", label: "Details", render: () => <Fields rows={[["Command", <span className="mono" style={{fontSize: 12}}>{o.line}</span>], ["By", <AgentLink name={o.by} />], ["Task", <RowLink term="task" id={o.task} bare />], ["Took", o.took], ["When", o.at]]} />},
  ];
  return <InspectorShell term="output" id={o.id} kind={`Output ${o.id}`} state={o.state} title={o.line} width="large" comments={false} tabs={tabs} actions={[{group: "Output", label: "Rerun", icon: "play"}, {group: "Output", label: "Copy command", icon: "copy", desc: `journal output read ${o.id} --summary`}]} links={[{kind: "Task", term: "task", id: o.task, title: task(o.task)?.title, icon: "task"}]} onClose={onClose} onOpen={onOpen} onBack={onBack} />;
}

function MessageInspector({id, onClose, onOpen, onBack}) {
  const m = MESSAGES.find((x) => x.id === id) || MESSAGES[0];
  const tabs = [{key: "text", label: "Message", render: () => <><p style={{marginTop: 0, lineHeight: 1.6}}><Linked text={m.text} /></p><Fields rows={[["From", m.by], ["Sent", m.at], ["Answered by", <AgentLink name="main" />]]} /></>}];
  return <InspectorShell term="message" id={m.id} kind={`Message ${m.id}`} title={m.text} width="medium" comments={false} tabs={tabs} actions={[{group: "Message", label: "Chat", icon: "open"}, ...CONTEXT_ACTIONS("message", m.id)]} links={[{kind: "Plan", term: "plan", id: 1133, title: "Viewer v5: one look for every page", state: "ready", icon: "plan"}]} onClose={onClose} onOpen={onOpen} onBack={onBack} />;
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
        {!top && !s.leaving && <button className="stack-peek" title={labelOf(s)} aria-label={labelOf(s)} onClick={() => onFocus(s.key)}><span className="stack-peek-label">{labelOf(s)}</span></button>}
      </div>;
    })}
  </div>;
}

Object.assign(window, {CONTEXT_ACTIONS, PlanInspector, DocumentInspector, DocumentText, MemoryInspector, OutputInspector, MessageInspector, InspectorStack, Timeline, TaskRow, REVISIONS, PhaseCard});
