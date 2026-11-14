// Home: panes of windows. Counts replaces Task counts and the Context window. The Tasks window filters with the one FilterBar.

// the filter fields of a task list: the same bar on Home, in a plan's phases and anywhere tasks are listed
const TASK_FIELDS = [
  {key: "state", label: "State", options: [["open", "Open"], ["started", "Started"], ["testing", "Testing"], ["blocked", "Blocked"], ["completed", "Completed"], ["cancelled", "Cancelled"]], get: (t) => t.state},
  {key: "plan", label: "Plan", options: [...PLANS.map((p) => [String(p.id), `Plan ${p.id}`]), ["none", "No plan"]], get: (t) => (t.plan ? String(t.plan) : "none")},
  {key: "tag", label: "Tag", options: [["viewer", "viewer"], ["tests", "tests"], ["skills", "skills"]], get: (t) => t.tags},
  {key: "priority", label: "Priority", options: [["high", "High"], ["normal", "Normal"], ["low", "Low"]], get: (t) => t.priority},
  {key: "assignee", label: "Assignee", options: [...AGENTS.map((a) => [a.name, a.name]), ["nobody", "Nobody"]], get: (t) => t.by || "nobody"},
];
const PLAN_FIELDS = [
  {key: "state", label: "State", options: [["draft", "Draft"], ["ready", "Ready"], ["started", "Started"], ["blocked", "Blocked"], ["completed", "Completed"]], get: (p) => p.state},
  {key: "assignee", label: "Assignee", options: AGENTS.map((a) => [a.name, a.name]), get: (p) => p.by},
];

const SOURCES = {
  tasks: {label: "Tasks", command: "task", fields: TASK_FIELDS, rows: () => TASKS},
  plans: {label: "Plans", command: "plan", fields: PLAN_FIELDS, rows: () => PLANS},
  processes: {label: "Processes", command: "process", fields: [{key: "state", label: "State", options: [["started", "Running"], ["failed", "Failed"], ["completed", "Finished"]], get: (o) => o.state}], rows: () => OUTPUTS},
  agents: {label: "Agents", command: "agent", fields: [{key: "state", label: "State", options: [["started", "Working"], ["paused", "Paused"], ["open", "Waiting"]], get: (a) => a.state}], rows: () => AGENTS},
};
// a count's conditions are a filter value: {field: {not, values}}; the same value fills the FilterBar when the tile is clicked
const countOf = (tile) => { const s = SOURCES[tile.source]; return applyFilter(s.rows(), s.fields, tile.where, "", () => "").length; };
const queryOf = (tile) => `${SOURCES[tile.source].command} count` + Object.entries(tile.where).filter(([, v]) => v?.values.length).map(([k, v]) => ` --${v.not ? "not-" : ""}${k} ${v.values.join(",")}`).join("");
// reads a query back into conditions, or says which part it cannot read
function parseQuery(text) {
  const words = text.trim().split(/\s+/);
  const source = Object.keys(SOURCES).find((k) => SOURCES[k].command === words[0]);
  if (!source) return {error: `A count starts with ${Object.values(SOURCES).map((s) => s.command).join(", ")}, not “${words[0] || ""}”.`};
  if (words[1] !== "count") return {error: `The second word is count: ${words[0]} count --state open.`};
  const where = {};
  for (let i = 2; i < words.length; i += 2) {
    const m = /^--(not-)?([a-z]+)$/.exec(words[i] || "");
    const field = m && SOURCES[source].fields.find((f) => f.key === m[2]);
    if (!field) return {error: `${SOURCES[source].label} have no filter ${words[i]}. They have ${SOURCES[source].fields.map((f) => "--" + f.key).join(", ")}.`};
    const values = (words[i + 1] || "").split(",").filter(Boolean);
    const unknown = values.find((v) => !field.options.some(([o]) => o === v));
    if (!values.length || unknown) return {error: `${words[i]} takes ${field.options.map(([o]) => o).join(", ")}${unknown ? `, not “${unknown}”` : ""}.`};
    where[field.key] = {not: Boolean(m[1]), values};
  }
  return {source, where};
}

const START_TILES = [
  {id: 1, label: "Open tasks", source: "tasks", where: {state: {not: false, values: ["open"]}}},
  {id: 2, label: "Started", source: "tasks", where: {state: {not: false, values: ["started"]}}},
  {id: 3, label: "Blocked", source: "tasks", where: {state: {not: false, values: ["blocked"]}}, warnAbove: 0},
  {id: 4, label: "Viewer tasks left", source: "tasks", where: {tag: {not: false, values: ["viewer"]}, state: {not: true, values: ["completed", "cancelled"]}}},
  {id: 5, label: "Failed runs", source: "processes", where: {state: {not: false, values: ["failed"]}}, warnAbove: 0},
];

function CountsWindow({onFilter}) {
  const [tiles, setTiles] = useState(START_TILES);
  const [editing, setEditing] = useState(null);
  const fresh = () => setEditing({id: Date.now(), label: "", source: "tasks", where: {state: {not: false, values: ["open"]}}, fresh: true});
  if (!tiles.length) return <><Empty title="No counts yet" line="A count shows how many rows match your conditions" action={<Btn small variant="primary" onClick={fresh}>Add a count</Btn>} />{editing && <CountEditor tile={editing} onClose={() => setEditing(null)} onSave={(t) => { setTiles([{...t, fresh: false}]); setEditing(null); }} />}</>;
  return <div className="counts">
    {tiles.map((t) => { const n = countOf(t); const over = t.warnAbove != null && n > t.warnAbove; return <div key={t.id} role="button" tabIndex={0} className={"count-tile" + (over ? " warn" : "")} onClick={() => onFilter(t)} onKeyDown={(e) => e.key === "Enter" && onFilter(t)} title={`Show these ${SOURCES[t.source].label.toLowerCase()}`}>
      <div className="row"><span className="n grow">{n}</span>
        <span onClick={(e) => e.stopPropagation()}><Menu button={({toggle}) => <Btn icon="more" small title="Tile actions" onClick={toggle} />}>{(close) => <>
          <MenuItem icon="edit" onClick={() => { setEditing(t); close(); }}>Edit the count</MenuItem>
          <MenuItem icon="filter" onClick={() => { onFilter(t); close(); }}>Show these rows</MenuItem>
          <div className="menu-sep" /><MenuItem icon="trash" danger onClick={() => { setTiles(tiles.filter((x) => x.id !== t.id)); close(); }}>Remove</MenuItem></>}</Menu></span></div>
      <span className="l">{t.label}</span>
      {over ? <span className="over"><Icon name="alert" size={11} />Above {t.warnAbove}</span> : <span className="q" title={queryOf(t)}>{queryOf(t)}</span>}
    </div>; })}
    <button className="count-tile add" onClick={fresh}><Icon name="plus" /><span className="l">Add a count</span></button>
    {editing && <CountEditor tile={editing} onClose={() => setEditing(null)} onSave={(t) => { setTiles(editing.fresh ? [...tiles, {...t, fresh: false}] : tiles.map((x) => x.id === t.id ? t : x)); setEditing(null); }} />}
  </div>;
}

function CountEditor({tile, onClose, onSave}) {
  const [t, setT] = useState(tile);
  const [mode, setMode] = useState("filter");
  const [query, setQuery] = useState(queryOf(tile));
  const [error, setError] = useState(null);
  const src = SOURCES[t.source];
  const n = countOf(t);
  const field = {minHeight: 0, height: 30, fontFamily: "var(--font)"};
  const readQuery = (text) => { setQuery(text); const r = parseQuery(text); if (r.error) setError(r.error); else { setError(null); setT({...t, source: r.source, where: r.where}); } };
  return <Dialog narrow title={tile.fresh ? "Add a count" : "Edit the count"} sub="A count shows how many rows match. Click it on Home to see those rows in the Tasks window, already filtered." onClose={onClose}
    foot={<div className="foot"><span className="note">Counts again when a matching row changes</span><Btn onClick={onClose}>Cancel</Btn><Btn variant="primary" disabled={!t.label.trim() || Boolean(error)} onClick={() => onSave(t)}>{tile.fresh ? "Add" : "Save"}</Btn></div>}>
    <div className="dialog-body col" style={{gap: 14}}>
      <label className="col" style={{gap: 6}}><span className="muted" style={{fontSize: 12}}>Name</span><input className="qbox" style={field} autoFocus value={t.label} placeholder="Open tasks" onChange={(e) => setT({...t, label: e.target.value})} /></label>
      <div className="row"><span className="muted" style={{fontSize: 12}}>Count</span><select className="qbox" aria-label="What to count" style={{...field, height: 28, width: 160}} value={t.source} onChange={(e) => { setT({...t, source: e.target.value, where: {}}); setQuery(queryOf({...t, source: e.target.value, where: {}})); setError(null); }}>{Object.entries(SOURCES).map(([k, s]) => <option key={k} value={k}>{s.label}</option>)}</select><span className="grow" /><Seg value={mode} onPick={(m) => { setMode(m); if (m === "query") setQuery(queryOf(t)); }} options={[{key: "filter", label: "Conditions"}, {key: "query", label: "Query"}]} /></div>
      {mode === "filter" ? <div className="col" style={{gap: 6}}><span className="muted" style={{fontSize: 12}}>Where</span>
        <div className="fbar" style={{padding: 0, border: 0}}>{src.fields.map((f) => <FilterChip key={f.key} field={f} rows={src.rows()} value={t.where[f.key]} onChange={(v) => setT({...t, where: {...t.where, [f.key]: v}})} />)}</div>
      </div> : <div className="col" style={{gap: 6}}><span className="muted" style={{fontSize: 12}}>A journal read command that answers with a count</span><textarea className="qbox" aria-label="Query" value={query} onChange={(e) => readQuery(e.target.value)} />{error ? <div className="refusal" role="alert"><Icon name="alert" size={12} /><span>{error}</span></div> : <span className="faint" style={{fontSize: 11.5}}>The conditions and the query are the same count: edit either.</span>}</div>}
      <label className="row"><Switch on={t.warnAbove != null} onChange={(on) => setT({...t, warnAbove: on ? 0 : null})} title="Mark the tile when it is above a number" /><span>Mark it when it is above</span><input type="number" aria-label="Limit" className="qbox" style={{...field, height: 28, width: 64}} value={t.warnAbove ?? 0} disabled={t.warnAbove == null} onChange={(e) => setT({...t, warnAbove: Number(e.target.value)})} /></label>
      <div className="preview-n"><b>{error ? "—" : n}</b><span className="muted">{error ? "the query does not read yet" : `${src.label.toLowerCase()} match now`}</span></div>
    </div>
  </Dialog>;
}

function ChatWindow() {
  const [msgs, setMsgs] = useState([
    {me: true, text: "Please send out the designer. Make every page coherent before release."},
    {text: "helper-851 is on it: it reads every page first, then draws the prototype. Doc 1275 lists the layouts."},
    {text: "Plan 1133 is ready for your approval. Task 9692 starts it."},
  ]);
  const [draft, setDraft] = useState("");
  const send = () => { draft.trim() && setMsgs([...msgs, {me: true, text: draft}]); setDraft(""); };
  return <div className="col" style={{height: "100%"}}>
    <div className="pbody" style={{paddingTop: 8}}>{msgs.map((m, i) => <div key={i} className={"chat-msg" + (m.me ? " me" : "")}>{!m.me && <Avatar name="main" agent />}<div className="bubble"><Linked text={m.text} /></div></div>)}</div>
    <div className="composer"><textarea rows={1} value={draft} aria-label="Message" onChange={(e) => setDraft(e.target.value)} placeholder="Message the main agent" onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }} /><Btn small variant="primary" onClick={send}>Send</Btn></div>
  </div>;
}

const GROUPS = {none: null, state: (t) => STATE_WORDS[t.state], plan: (t) => (t.plan ? `Plan ${t.plan}` : "No plan"), assignee: (t) => t.by || "Nobody"};
function TasksWindow({onOpen, filter, setFilter}) {
  const [words, setWords] = useState("");
  const [group, setGroup] = useState("state");
  const value = filter || emptyFilter();
  const rows = applyFilter(TASKS, TASK_FIELDS, value, words, (t) => `${t.id} ${t.title}`);
  const by = GROUPS[group];
  const groups = by ? [...new Set(rows.map(by))] : [null];
  return <div className="col" style={{height: "100%"}}>
    <FilterBar fields={TASK_FIELDS} rows={TASKS} value={value} onChange={setFilter} words={words} onWords={setWords} shown={rows.length} placeholder="Search tasks"
      end={<Menu button={({toggle, open}) => <MenuButton label={`Group: ${{none: "none", state: "state", plan: "plan", assignee: "assignee"}[group]}`} open={open} onClick={toggle} />}>{(close) => Object.keys(GROUPS).map((g) => <MenuItem key={g} check={g === group} onClick={() => { setGroup(g); close(); }}>{{none: "No groups", state: "By state", plan: "By plan", assignee: "By assignee"}[g]}</MenuItem>)}</Menu>} />
    <div className="pbody" style={{padding: "4px 0"}}>
      {groups.map((g) => <React.Fragment key={g || "all"}>{g && <div className="lr-group">{g} <span className="faint">{rows.filter((t) => by(t) === g).length}</span></div>}
        {rows.filter((t) => !by || by(t) === g).map((t) => <button key={t.id} className="trow" style={{padding: "8px 16px"}} onClick={() => onOpen("task", t.id)}><span className={"dot " + t.state} /><span className="ref">{t.id}</span><span className="grow ellipsis">{t.title}</span><span className="end">{t.plan && group !== "plan" && <RowLink term="plan" id={t.plan} />}{t.by && group !== "assignee" && <AgentLink name={t.by} />}{group !== "state" && <Badge state={t.state} />}</span></button>)}
      </React.Fragment>)}
      {!rows.length && <Empty title="No tasks match" line="Loosen a filter, or clear them all" action={<Btn small onClick={() => { setFilter(emptyFilter()); setWords(""); }}>Clear the filters</Btn>} />}
    </div>
  </div>;
}

function PlansWindow({onOpen}) {
  const [value, setValue] = useState({state: {not: true, values: ["completed"]}});
  const [words, setWords] = useState("");
  const rows = applyFilter(PLANS, PLAN_FIELDS, value, words, (p) => `${p.id} ${p.title}`);
  return <div className="col" style={{height: "100%"}}>
    <FilterBar fields={PLAN_FIELDS} rows={PLANS} value={value} onChange={setValue} words={words} onWords={setWords} shown={rows.length} placeholder="Search plans" />
    <div className="pbody" style={{padding: "12px 16px", display: "flex", flexDirection: "column", gap: 10}}>{rows.map((p) => { const ts = p.phases.flatMap((x) => x.tasks).map((id) => TASKS.find((t) => t.id === id)).filter(Boolean); const d = ts.filter((t) => t.state === "completed").length; return <button key={p.id} className="card" onClick={() => onOpen("plan", p.id)}>
      <div className="row"><span className="faint mono" style={{fontSize: 11}}>Plan {p.id}</span><Badge state={p.state} /><span className="grow" /><span className="row faint" style={{fontSize: 11}}><Avatar name={p.by} agent /><AgentLink name={p.by} /></span></div>
      <h3>{p.title}</h3><div className="row"><div className="progress grow"><i style={{width: `${ts.length ? (d / ts.length) * 100 : 0}%`}} /></div><span className="faint" style={{fontSize: 11}}>{d} of {ts.length}</span></div></button>; })}
      {!rows.length && <Empty title="No plans match" action={<Btn small onClick={() => { setValue(emptyFilter()); setWords(""); }}>Clear the filters</Btn>} />}</div>
  </div>;
}

function AgentsWindow({onOpen}) {
  return <div className="pbody" style={{padding: "4px 0"}}>{AGENTS.map((a) => <button key={a.id} className="trow" style={{padding: "8px 16px"}} onClick={() => onOpen("agent", a.id)}><span className={"dot " + (a.state === "paused" ? "blocked" : a.state)} /><b style={{fontWeight: 500, color: "var(--text)", width: 96, flex: "none"}}>{a.name}</b><span className="faint grow">{a.role}</span><span className="end">{a.task && <RowLink term="task" id={a.task} />}<Badge state={a.state} /></span></button>)}</div>;
}
function FeedWindow() {
  const {openFile} = useOpen();
  const rows = [["M", "src/viewer/src/resource/Inspector.vue", "worker-4", "+42 −18", 9682], ["A", "src/viewer/src/kit/ActionMenu.vue", "worker-4", "+120", 9682], ["R", "src/viewer/src/kit/CommentRail.vue", "worker-7", "moved", 9683], ["M", "src/core/modules/plans/support/plan_inspector.py", "main", "+6 −9", 9597]];
  return <div className="pbody" style={{padding: "4px 0"}}>{rows.map(([g, p, who, d, t]) => <button key={p} className="trow" style={{padding: "8px 16px"}} title={`Open ${p} in Files`} onClick={() => openFile(p)}><span className={"gs mono " + g} style={{width: 12}}>{g}</span><span className="grow ellipsis mono" style={{fontSize: 12}}>{p}</span><span className="end" style={{fontSize: 11}}><RowLink term="task" id={t} /><AgentLink name={who} /><span className="mono faint" style={{width: 56, textAlign: "right"}}>{d}</span></span></button>)}</div>;
}
function TerminalWindow() {
  const {open} = useOpen();
  return <div className="pbody" style={{background: "var(--term)", padding: "10px 16px", font: "12px/1.6 var(--mono)", color: "var(--text-2)"}}><div><span style={{color: "var(--good)"}}>$</span> pytest tests -x -q <span className="faint">· <RowLink term="output" id={489998} /></span></div><div className="faint">........................F</div><div style={{color: "var(--danger)"}}>FAILED tests/stories/test_launch.py::test_settings_text</div></div>;
}
function QuestionsWindow() {
  const [answered, setAnswered] = useState(null);
  return <div className="pbody" style={{padding: 16, display: "flex", flexDirection: "column", gap: 10}}><div className="card"><div className="row"><Badge state={answered ? "completed" : "open"}>{answered ? "Answered" : "Waiting on you"}</Badge><span className="faint" style={{fontSize: 11}}><AgentLink name="main" /> · 5 min ago · for <RowLink term="plan" id={1133} /></span></div><h3>Keep the developer pages in the sidebar, or move them into Settings?</h3>{answered ? <p>You answered: {answered}</p> : <div className="row"><Btn small onClick={() => setAnswered("In the sidebar")}>In the sidebar</Btn><Btn small onClick={() => setAnswered("Into Settings")}>Into Settings</Btn><Btn small variant="ghost">Answer in words</Btn></div>}</div></div>;
}

const WINDOW_GROUPS = [
  {title: "Conversation", items: [["chat", "Chat", "chat"], ["questions", "Questions", "bell", "Also holds what Waiting showed"]]},
  {title: "Work", items: [["counts", "Counts", "widget", "Your own counts from conditions or a query"], ["tasks", "Tasks", "task"], ["plans", "Plans", "plan"], ["agents", "Agents", "agent"]]},
  {title: "Code", items: [["feed", "File feed", "file"], ["terminal", "Terminal", "term"]]},
];
const WINDOWS = {chat: ChatWindow, counts: CountsWindow, tasks: TasksWindow, plans: PlansWindow, agents: AgentsWindow, feed: FeedWindow, terminal: TerminalWindow, questions: QuestionsWindow};
const WINDOW_TITLES = Object.fromEntries(WINDOW_GROUPS.flatMap((g) => g.items.map(([k, l, i]) => [k, {label: l, icon: i}])));

function Pane({tabs, setTabs, active, setActive, ...shared}) {
  const W = WINDOWS[active];
  return <div className="pane">
    <div className="ptabs" role="tablist">{tabs.map((k) => <button key={k} role="tab" aria-selected={k === active} className={"ptab" + (k === active ? " on" : "")} onClick={() => setActive(k)}><Icon name={WINDOW_TITLES[k].icon} size={12} />{WINDOW_TITLES[k].label}</button>)}
      <span className="grow" />
      <Menu width={300} button={({toggle}) => <Btn icon="plus" small title="Add a window" onClick={toggle} />}>{(close) => WINDOW_GROUPS.map((g, gi) => <React.Fragment key={g.title}>{gi > 0 && <div className="menu-sep" />}<div className="menu-label">{g.title}</div>{g.items.map(([k, l, i, d]) => <MenuItem key={k} icon={i} desc={d} hint={tabs.includes(k) ? "Open" : null} onClick={() => { if (!tabs.includes(k)) setTabs([...tabs, k]); setActive(k); close(); }}>{l}</MenuItem>)}</React.Fragment>)}</Menu>
    </div>
    <div className="pbody" style={{overflow: "hidden", display: "flex", flexDirection: "column"}}><W {...shared} /></div>
  </div>;
}

function HomePage({onOpen}) {
  const [left, setLeft] = useState(["chat", "terminal"]); const [la, setLa] = useState("chat");
  const [top, setTop] = useState(["counts"]); const [ta, setTa] = useState("counts");
  const [right, setRight] = useState(["tasks", "plans", "questions", "feed"]); const [ra, setRa] = useState("tasks");
  const [filter, setFilter] = useState(emptyFilter());
  // a count clicked in any pane fills the Tasks window's filter bar with its conditions
  const shared = {onOpen, filter, setFilter, onFilter: (t) => { if (t.source !== "tasks") { onOpen(t.source === "processes" ? "output" : "agent", t.source === "processes" ? 489998 : 1); return; } setFilter(t.where); if (!right.includes("tasks")) setRight([...right, "tasks"]); setRa("tasks"); }};
  return <div className="home" data-screen-label="Home">
    <Pane tabs={left} setTabs={setLeft} active={la} setActive={setLa} {...shared} />
    <div className="pane-split">
      <Pane tabs={top} setTabs={setTop} active={ta} setActive={setTa} {...shared} />
      <Pane tabs={right} setTabs={setRight} active={ra} setActive={setRa} {...shared} />
    </div>
  </div>;
}

Object.assign(window, {HomePage, CountsWindow, CountEditor, TASK_FIELDS, PLAN_FIELDS, parseQuery});
