// Round sixteen (messages 121381, 121383 and 121402). Loaded after round fifteen.
// Replaces by name: InspectorShell, R8Overview, AgentInspector, SecretsPage.
// 1. No Started by line under the attribute band, and no Started by row in Details: where an agent came from is the Family tree tab.
// 2. A Family tree tab after Links: the person who started the chain, each parent agent down to this one, and the agents this one started,
//    each a row that opens its own inspector. Children that started agents of their own fold open. The server sends the whole chain in one read.
// 3. Every section bar of the Overview (Now, Brief, Recent, Skills, Details) is one left-aligned line: chevron, icon, label, count right.
//    The Helpers bar is gone: the Family tree tab shows the agents it started.
//    The old bar broke because .r8-bandh span { margin-left: auto } also caught the icon, which Icon draws as a span.
// 4. Secrets: a deleted secret is erased for good. No Deleted group, no Restore, no Deleted state in the filter;
//    the delete confirmation says it is erased permanently and cannot be restored.

/* ---------- InspectorShell: as home-now.jsx, plus tabs that come after Links ---------- */
function InspectorShell({term, id, kind, state, title, abstract, bar, width = "medium", primary, actions = [], tabs, after = [], links = [], comments, onClose, onBack, onStep, onOpen}) {
  const toast = useToast();
  const [tab, setTab] = useState(tabs[0].key);
  const [rootRef, w] = useWidth();
  const [list, send] = useComments(`${term}:${id}`);
  const [hot, setHot] = useState(null);
  const [quote, setQuote] = useState(null);
  const takesComments = comments !== false;
  const rail = useCommentRail(w);
  const narrow = w < 600;
  const share = {group: "Context", label: "Copy a share link", icon: "share", done: "Share link copied"};
  const allActions = narrow ? [...actions.filter((a) => a.group !== "Danger"), share, ...actions.filter((a) => a.group === "Danger")] : actions;
  const allTabs = [...tabs, {key: "links", label: "Links", count: links.length}, ...after];
  const shown = allTabs.find((t) => t.key === tab) || allTabs[0];
  const ctx = {setQuote, hot, setHot, comments: list, toast};
  return <aside ref={rootRef} className={"insp " + width} data-screen-label={`Inspector ${term}`}>
    <header className="insp-head">
      <div className="insp-band">
        {onBack && <Btn icon="back" small title="Back" onClick={onBack} />}
        {onStep && <><Btn icon="up" small title="Previous" onClick={() => onStep(-1)} /><Btn icon="down" small title="Next" onClick={() => onStep(1)} /></>}
        <span className="kind">{kind}{state && <Badge state={state} />}</span>
        <span className="grow" />
        {primary && <Btn small variant="primary" onClick={() => { const why = primary.run?.(); toast(why || primary.done || primary.label); }}>{primary.label}</Btn>}
        {allActions.length > 0 && <ActionMenu actions={allActions} onDone={toast} />}
        {!narrow && <Btn icon="share" small title="Share link" onClick={() => toast("Share link copied")} />}
        <Btn icon="close" small title={onBack ? "Close all" : "Close"} onClick={onClose} />
      </div>
      <h2 className="insp-title">{title}</h2>
      {abstract && <p className="insp-abstract">{abstract}</p>}
      {bar && <div className="insp-bar">{bar}</div>}
    </header>
    <Tabs tabs={allTabs} value={shown.key} onPick={setTab} />
    <div className="insp-main">
      <div className="insp-col">
        <div key={shown.key} className="view-in" style={{flex: 1, minHeight: 0, display: "flex", flexDirection: "column"}}>
          {shown.key === "links" ? <div className="insp-body"><LinksTab links={links} onOpen={onOpen} /></div>
            : shown.flush ? shown.render(ctx) : <div className="insp-body">{shown.render(ctx)}</div>}
        </div>
        {takesComments && <CommentBox count={list.length} onSend={send} quote={quote} onClearQuote={() => setQuote(null)} onShow={rail.toggle} />}
        {takesComments && rail.floating && <CommentRail floating comments={list} hot={hot} onShow={setHot} onClose={rail.hide} />}
      </div>
      {takesComments && rail.inline && <CommentRail comments={list} hot={hot} onShow={setHot} onClose={rail.hide} />}
    </div>
  </aside>;
}

/* ---------- one section bar: chevron, icon, label, count right; it folds the rows under it ---------- */
function R16Section({icon, label, count, startsOpen = true, children}) {
  const [open, setOpen] = useState(startsOpen);
  return <section className="r16-section">
    <button type="button" className="r16-bar" aria-expanded={open} data-agent-fold onClick={() => setOpen(!open)}>
      <i className="r16-chev"><Icon name="caret" size={11} /></i>
      <i className="r16-icon"><Icon name={icon} size={12} /></i>
      <b className="r16-label">{label}</b>
      {count != null && <em className="r16-count">{count}</em>}
    </button>
    {open && <div className="r16-body view-in">{children}</div>}
  </section>;
}

/* ---------- the Overview: the strip, then five sections, each one bar; Now, Brief and Recent start open ---------- */
function R8Overview({a}) {
  const {open} = useOpen();
  const [whole, setWhole] = useState(false);
  const t = TASKS.find((x) => x.id === a.task);
  const plan = PLANS.find((p) => p.id === a.plan);
  const pts = plan ? plan.phases.flatMap((p) => p.tasks).map((id) => TASKS.find((x) => x.id === id)).filter(Boolean) : [];
  const done = pts.filter((x) => x.state === "completed").length;
  return <div className="r8-overview">
    <R8Strip a={a} />
    <R16Section icon="play" label="Now">
      <div className="r8-now">
        {t ? <button type="button" className="r8-link" onClick={() => open("task", t.id)}>Task {t.id}: {t.title}</button> : <span className="r8-faint">{a.ended ? "No task finished" : "No task"}</span>}
        {!a.ended && <span className="r8-doing">{a.command ? <><span className="r8-live-dot" /><span className="mono">{a.command}</span></> : a.wait ? `Waiting: ${a.wait}` : a.dot === "thinking" ? "Thinking" : a.doing}</span>}
        <span className="r8-faint" style={{fontSize: 11.5}}>{a.seen}</span>
      </div>
      {plan && <div className="r8-plan"><div className="row"><span>Plan {plan.id}, phase {plan.phases.find((p) => p.tasks.includes(a.task))?.n || 1}</span><span className="grow" /><R12Open title={`Plan ${plan.id}`} onClick={() => open("plan", plan.id)} /></div><span className="r8-faint" style={{fontSize: 11.5}}>{done} of {pts.length} done</span><div className="r8-meter wide"><i style={{width: `${pts.length ? (done / pts.length) * 100 : 0}%`}} /></div></div>}
    </R16Section>
    <R16Section icon="file" label={a.readOnly ? "Instruction" : "Brief"}>
      <div className={"r8-brief" + (whole ? "" : " clamp")}>{a.brief}</div>
      {!whole && a.brief.length > 150 && <button type="button" className="r8-link r8-more" onClick={() => setWhole(true)}>More</button>}
    </R16Section>
    <R16Section icon="clock" label="Recent" count={R8_MOVES.length}>
      <div className="r8-moves">{R8_MOVES.map(([text, term, id, tone, at]) => term ? <button key={text} type="button" className="r8-move" onClick={() => open(term, id)}><i className={"r8-mdot " + tone} /><span className="ellipsis">{text}</span><span className="r8-faint">{at}</span></button> : <div key={text} className="r8-move"><i className={"r8-mdot " + tone} /><span className="ellipsis">{text}</span><span className="r8-faint">{at}</span></div>)}</div>
    </R16Section>
    <R16Section icon="book" label="Skills" count={a.skills} startsOpen={false}>
      {SKILLS.slice(0, 4).map((k) => <div key={k.id} className="r8-move r16-two"><span>{k.title}</span></div>)}
    </R16Section>
    <R16Section icon="more" label="Details" startsOpen={false}>
      <div className="r16-fields"><Fields rows={[["Number", String(a.id)], ["Session", <span className="mono">{sessionOf(a.id).session}</span>], ["Program", a.program], ["Type", a.role], ["Started", a.since.replace("Since ", "today ")], ["Process", a.ended ? "none" : "pid 48213"]]} /></div>
    </R16Section>
    {a.ended && <p className="r8-ended">Ended {a.retired ? a.retiredAt : "1 h ago"}</p>}
  </div>;
}

/* ---------- the family: who started whom. parent is an agent number; a chain's top was started by a person ---------- */
// one read: the agent's inspection carries its chain of parents (top first) and the agents it started, with theirs
const R16_PARENT = {1: null, 4: 1, 7: 1, 12: 1, 15: 12, 20: 1, 21: 1};
const R16_PERSON = {1: "Jesse"};
const r16Children = (a) => R8_AGENTS.filter((x) => R16_PARENT[x.id] === a.id);
function r16Chain(a) {
  const up = [];
  for (let id = R16_PARENT[a.id]; id != null; id = R16_PARENT[id]) up.unshift(r8Agent(id));
  return up;
}
const r16State = (x) => x.retired ? "retired" : x.ended ? "ended" : x.dot;
const r16Word = (x) => x.retired ? "Retired" : x.ended ? "Idle" : x.dot === "waiting" ? "Waiting" : "Working";

function R16Node({x, self, depth}) {
  const {open} = useOpen();
  const kids = r16Children(x);
  const [shut, setShut] = useState(depth > 1);
  const body = <><i className="r8-sdot" data-state={r16State(x)} /><span className="r16-name">{x.name}</span><span className="r16-sub">{x.sub}</span><span className="r16-when">{r16Word(x)}</span></>;
  return <li className={x.retired ? "retired" : ""}>
    <div className="r16-line">
      {kids.length > 0 && !self ? <button type="button" className="r16-twist" aria-expanded={!shut} aria-label={shut ? `Show ${kids.length} started by ${x.name}` : "Hide"} onClick={() => setShut(!shut)}><Icon name="caret" size={11} /></button> : <span className="r16-twist" />}
      {self ? <div className="r16-node self" aria-current="true">{body}<span className="r16-here">This agent</span></div>
        : <button type="button" className="r16-node" onClick={() => open("agent", x.id)}>{body}{kids.length > 0 && shut && <em className="r16-count">{kids.length}</em>}</button>}
    </div>
    {kids.length > 0 && (self || !shut) && <ul>{kids.map((k) => <R16Node key={k.id} x={k} depth={depth + 1} />)}</ul>}
    {self && !kids.length && <ul><li><div className="r16-line"><span className="r16-twist" /><span className="r16-none">Started no agents</span></div></li></ul>}
  </li>;
}

// an ancestor shows only the line down to this agent, not its other children
function R16Ancestor({x, children}) {
  const {open} = useOpen();
  return <li className={x.retired ? "retired" : ""}>
    <div className="r16-line"><span className="r16-twist" /><button type="button" className="r16-node" onClick={() => open("agent", x.id)}><i className="r8-sdot" data-state={r16State(x)} /><span className="r16-name">{x.name}</span><span className="r16-sub">{x.sub}</span><span className="r16-when">{r16Word(x)}</span></button></div>
    <ul>{children}</ul>
  </li>;
}

// states: loading (skeleton rows, while the one read runs), failed (Retry; shown for worker-7 in this prototype), ready
function R16FamilyTree({a}) {
  const [state, setState] = useState("loading");
  useEffect(() => { const t = setTimeout(() => setState(a.id === 7 ? "failed" : "ready"), 320); return () => clearTimeout(t); }, [a.id]);
  if (state === "loading") return <div className="r16-tree" aria-busy="true">{[0, 1, 2, 3].map((i) => <div key={i} className="r16-skel" style={{marginLeft: Math.min(i, 2) * 17}} />)}</div>;
  if (state === "failed") return <div className="r16-tree"><div className="notice bad" role="alert"><Icon name="warn" size={13} /><span className="grow">Family tree not read</span><Btn small onClick={() => { setState("loading"); setTimeout(() => setState("ready"), 320); }}>Retry</Btn></div></div>;
  const up = r16Chain(a);
  const top = up[0] || a;
  const person = R16_PERSON[top.id];
  // nest: person > ancestors > this agent > its children
  let tree = <R16Node x={a} self depth={up.length} />;
  for (let i = up.length - 1; i >= 0; i -= 1) tree = <R16Ancestor key={up[i].id} x={up[i]}>{tree}</R16Ancestor>;
  return <div className="r16-tree">
    <ul className="r16-root">
      <li>
        <div className="r16-line"><span className="r16-twist" /><div className="r16-node person"><i className="r16-person"><Icon name="user" size={12} /></i><span className="r16-name">{person || "Unknown"}</span><span className="r16-sub">person</span></div></div>
        <ul>{tree}</ul>
      </li>
    </ul>
  </div>;
}

/* ---------- the agent inspector: the attribute band alone under the name; Family tree after Links ---------- */
function AgentInspector({id, onClose, onOpen, onBack}) {
  const a = r8Agent(id);
  const [paused, setPaused] = useState(false);
  const state = a.retired ? "retired" : a.ended ? "ended" : paused ? "paused" : a.dot === "waiting" ? "blocked" : "started";
  const title = <span className="r8-name"><i className="r8-sdot" data-state={paused ? "waiting" : a.dot} />{a.name}{a.sandboxOff && <R13Sandbox />}</span>;
  const bar = <div className="r8-who">{a.retired ? <span className="r8-faint">Retired {a.retiredAt} by {a.retiredBy}</span> : <InfoBar agentId={a.id} card />}</div>;
  const tabs = [
    {key: "overview", label: "Overview", flush: true, render: () => <R8Overview a={a} />},
    {key: "memories", label: "Memories", count: a.memories, render: () => <AgentMemoriesTab />},
  ];
  const after = [{key: "family", label: "Family tree", count: r16Children(a).length, flush: true, render: () => <R16FamilyTree a={a} />}];
  return <InspectorShell term="agent" id={a.id} kind={`Agent ${a.id} · ${a.number}`} state={state} title={title} bar={bar} width="medium" actions={r15AgentActions(a, paused, setPaused)} tabs={tabs} after={after} comments={false}
    links={r8TasksOf(a).map((t) => ({kind: "Task", term: "task", id: t.id, title: t.title, state: t.state, icon: "task"}))} onClose={onClose} onOpen={onOpen} onBack={onBack} />;
}

/* ---------- Secrets: a deleted secret is erased for good (message 121402) ---------- */
// no deleted rows exist to show, so the list holds live secrets only, and the State filter has no Deleted
const R16_SECRET_STATES = [["ready", "Ready"], ["waiting", "Waiting for its value"], ["proposal", "A program waits for you"]];
const r16SecretState = (x) => (x.waiting ? "waiting" : x.proposed.length ? "proposal" : "ready");
function SecretsPage() {
  const toast = useToast();
  const [rows, setRows] = useState(() => R7_SECRETS.filter((x) => !x.deleted));
  const [open, setOpen] = useState(null);
  const [making, setMaking] = useState(false);
  const [erasing, setErasing] = useState(null);
  const items = rows.map((x) => ({...x, desc: x.programs.length ? `Programs: ${x.programs.join(", ")}` : "No program"}));
  const erase = () => { setRows(rows.filter((x) => x.id !== erasing.id)); toast(`${erasing.title} erased`); setErasing(null); };
  return <><R6CardPage title="Secrets" line="Keys and logins an agent uses through a program, never shown to it" items={items} iconOf={(x) => R7_SECRET_TYPES[x.type][1]} groupOf={() => ""}
    fields={[{key: "state", label: "State", options: R16_SECRET_STATES, get: r16SecretState}, {key: "type", label: "Kind", options: Object.entries(R7_SECRET_TYPES).map(([k, [l]]) => [k, l]), get: (x) => x.type}]}
    header={<Btn variant="primary" small onClick={() => setMaking(true)}>New secret</Btn>}
    renderState={(x) => <><span>Secret {x.id}</span><span className="sep">·</span><span>{R7_SECRET_TYPES[x.type][0]}</span>{x.helpers && <><span className="sep">·</span><span>Helpers</span></>}</>}
    renderLine={(x) => x.programs.length ? <><span>Programs:</span>{x.programs.map((p) => <span key={p} className="mono">{p}</span>)}</> : <span>No program</span>}
    renderExtra={(x) => <>{x.waiting && <div className="r7-prop"><span><AgentLink name={x.waiting.by} /> asks for it: {x.waiting.why}</span><Btn small variant="primary" onClick={() => setOpen(x)}>Fill it in</Btn></div>}
      {x.proposed.map((p) => <div key={p.program} className="r7-prop"><span><AgentLink name={p.by} /> proposes <code className="mono">{p.program}</code></span><Btn small variant="primary" title={`secret allow ${x.id} ${p.program}`} onClick={() => toast(`${p.program} may use ${x.title}`)}>Allow {p.program}</Btn></div>)}</>}
    foot={(x) => <Btn small onClick={() => setOpen(x)}>Edit</Btn>}
    actions={(x) => [{group: "Secret", label: "Copy its number", icon: "copy", desc: `secret ${x.id}`, done: "Number copied"},
      {group: "Danger", label: "Delete", icon: "trash", danger: true, desc: `secret delete ${x.id}`, run: () => { setErasing(x); return false; }}]}
    empty={{title: "No secrets yet", line: "A key or login an agent needs for a program", action: <Btn small variant="primary" onClick={() => setMaking(true)}>New secret</Btn>}} />
    {open && <R7SecretDialog x={open} onClose={() => setOpen(null)} />}
    {erasing && <Dialog narrow title={`Delete ${erasing.title}`} onClose={() => setErasing(null)}
      foot={<div className="foot"><span className="grow" /><Btn onClick={() => setErasing(null)}>Cancel</Btn><Btn variant="danger" data-secret-confirm onClick={erase}>Delete secret</Btn></div>}>
      <div className="dialog-body r16-erase">
        <p className="r16-erase-lead"><Icon name="warn" size={14} /><span>The secret is erased permanently and cannot be restored.</span></p>
        <p className="r16-erase-line">Its values are wiped, and no agent or program can use it again.{erasing.programs.length > 0 && <> Programs that use it now: {erasing.programs.map((p, i) => <React.Fragment key={p}>{i > 0 && ", "}<code className="mono">{p}</code></React.Fragment>)}.</>}</p>
      </div>
    </Dialog>}
    {making && <CreateDialog title="New secret" sub="Its values are kept out of every agent's view; an agent uses it through the programs you allow" submit="Save" onClose={() => setMaking(false)} onMade={(v) => toast(`Secret 8 saved: ${v.title}`)}
      command={(v) => `journal secret make "${v.title || "…"}" --type "${v.type}"${v.note ? ' --brief "…"' : ""}, then secret fill 8 … and secret allow 8 ${v.program || "…"}`}
      fields={[{key: "type", label: "Kind", kind: "select", options: Object.entries(R7_SECRET_TYPES).map(([k, [l]]) => [k, l]), required: true, half: true}, {key: "title", label: "Title", required: true, placeholder: "Sentry token", half: true}, {key: "value", label: "Key", kind: "password", required: true, when: (v) => v.type === "api key"}, {key: "user", label: "Username", required: true, half: true, when: (v) => v.type === "login"}, {key: "password", label: "Password", kind: "password", required: true, half: true, when: (v) => v.type === "login"}, {key: "fields", label: "Fields and their values", kind: "steps", placeholder: "token: …", required: true, when: (v) => v.type === "custom"}, {key: "program", label: "Program", placeholder: "curl"}, {key: "note", label: "Note", placeholder: "For the Sentry API"}]} />}
  </>;
}

Object.assign(window, {InspectorShell, R16Section, R8Overview, R16FamilyTree, AgentInspector, SecretsPage});
