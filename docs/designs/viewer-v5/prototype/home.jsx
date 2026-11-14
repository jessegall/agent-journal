// Home's shared pieces: the filter fields of tasks and plans, the Counts window and its editor, the window groups of the + menu,
// and the first windows NOW_WINDOWS (home-now.jsx) starts with before later rounds replace them.

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
  if (!source) return {error: `Starts with ${Object.values(SOURCES).map((s) => s.command).join(", ")}, not “${words[0] || ""}”`};
  if (words[1] !== "count") return {error: `Second word: count (${words[0]} count --state open)`};
  const where = {};
  for (let i = 2; i < words.length; i += 2) {
    const m = /^--(not-)?([a-z]+)$/.exec(words[i] || "");
    const field = m && SOURCES[source].fields.find((f) => f.key === m[2]);
    if (!field) return {error: `No filter ${words[i]} · ${SOURCES[source].fields.map((f) => "--" + f.key).join(", ")}`};
    const values = (words[i + 1] || "").split(",").filter(Boolean);
    const unknown = values.find((v) => !field.options.some(([o]) => o === v));
    if (!values.length || unknown) return {error: `${words[i]}: ${field.options.map(([o]) => o).join(", ")}${unknown ? `, not “${unknown}”` : ""}`};
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
  if (!tiles.length) return <><Empty title="No counts" action={<Btn small variant="primary" onClick={fresh}>New count</Btn>} />{editing && <CountEditor tile={editing} onClose={() => setEditing(null)} onSave={(t) => { setTiles([{...t, fresh: false}]); setEditing(null); }} />}</>;
  return <div className="counts">
    {tiles.map((t) => { const n = countOf(t); const over = t.warnAbove != null && n > t.warnAbove; return <div key={t.id} role="button" tabIndex={0} className={"count-tile" + (over ? " warn" : "")} onClick={() => onFilter(t)} onKeyDown={(e) => e.key === "Enter" && onFilter(t)} aria-label={t.label}>
      <div className="row"><span className="n grow">{n}</span>
        <span onClick={(e) => e.stopPropagation()}><Menu button={({toggle}) => <Btn icon="more" small title="Count" onClick={toggle} />}>{(close) => <>
          <MenuItem icon="edit" onClick={() => { setEditing(t); close(); }}>Edit</MenuItem>
          <MenuItem icon="filter" onClick={() => { onFilter(t); close(); }}>Rows</MenuItem>
          <div className="menu-sep" /><MenuItem icon="trash" danger onClick={() => { setTiles(tiles.filter((x) => x.id !== t.id)); close(); }}>Remove</MenuItem></>}</Menu></span></div>
      <span className="l">{t.label}</span>
      {over ? <span className="over"><Icon name="alert" size={11} />Above {t.warnAbove}</span> : <span className="q" title={queryOf(t)}>{queryOf(t)}</span>}
    </div>; })}
    <button className="count-tile add" onClick={fresh}><Icon name="plus" /><span className="l">New count</span></button>
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
  return <Dialog narrow title={tile.fresh ? "New count" : "Edit count"} onClose={onClose}
    foot={<div className="foot"><span className="grow" /><Btn onClick={onClose}>Cancel</Btn><Btn variant="primary" disabled={!t.label.trim() || Boolean(error)} onClick={() => onSave(t)}>{tile.fresh ? "Add" : "Save"}</Btn></div>}>
    <div className="dialog-body col" style={{gap: 14}}>
      <label className="col" style={{gap: 6}}><span className="muted" style={{fontSize: 12}}>Name</span><input className="qbox" style={field} autoFocus value={t.label} placeholder="Open tasks" onChange={(e) => setT({...t, label: e.target.value})} /></label>
      <div className="row"><span className="muted" style={{fontSize: 12}}>Count</span><select className="qbox" aria-label="Count" style={{...field, height: 28, width: 160}} value={t.source} onChange={(e) => { setT({...t, source: e.target.value, where: {}}); setQuery(queryOf({...t, source: e.target.value, where: {}})); setError(null); }}>{Object.entries(SOURCES).map(([k, s]) => <option key={k} value={k}>{s.label}</option>)}</select><span className="grow" /><Seg value={mode} onPick={(m) => { setMode(m); if (m === "query") setQuery(queryOf(t)); }} options={[{key: "filter", label: "Conditions"}, {key: "query", label: "Query"}]} /></div>
      {mode === "filter" ? <div className="col" style={{gap: 6}}><span className="muted" style={{fontSize: 12}}>Where</span>
        <div className="fbar" style={{padding: 0, border: 0}}>{src.fields.map((f) => <FilterChip key={f.key} field={f} rows={src.rows()} value={t.where[f.key]} onChange={(v) => setT({...t, where: {...t.where, [f.key]: v}})} />)}</div>
      </div> : <div className="col" style={{gap: 6}}><span className="muted" style={{fontSize: 12}}>Query</span><textarea className="qbox" aria-label="Query" value={query} onChange={(e) => readQuery(e.target.value)} />{error && <div className="refusal" role="alert"><Icon name="alert" size={12} /><span>{error}</span></div>}</div>}
      <label className="row"><Switch on={t.warnAbove != null} onChange={(on) => setT({...t, warnAbove: on ? 0 : null})} title="Mark above" /><span>Mark above</span><input type="number" aria-label="Limit" className="qbox" style={{...field, height: 28, width: 64}} value={t.warnAbove ?? 0} disabled={t.warnAbove == null} onChange={(e) => setT({...t, warnAbove: Number(e.target.value)})} /></label>
      <div className="preview-n"><b>{error ? "—" : n}</b><span className="muted">{error ? "Not read" : src.label.toLowerCase()}</span></div>
    </div>
  </Dialog>;
}

const GROUPS = {none: null, state: (t) => STATE_WORDS[t.state], plan: (t) => (t.plan ? `Plan ${t.plan}` : "No plan"), assignee: (t) => t.by || "Nobody"};

// the first Agents and Questions windows; round eight and round sixteen replace them in NOW_WINDOWS
function AgentsWindow({onOpen}) {
  return <div className="pbody" style={{padding: "4px 0"}}>{AGENTS.map((a) => <button key={a.id} className="trow" style={{padding: "8px 16px"}} onClick={() => onOpen("agent", a.id)}><span className={"dot " + (a.state === "paused" ? "blocked" : a.state)} /><b style={{fontWeight: 500, color: "var(--text)", width: 96, flex: "none"}}>{a.name}</b><span className="faint grow">{a.role}</span><span className="end">{a.task && <RowLink term="task" id={a.task} />}</span></button>)}</div>;
}
function QuestionsWindow() { return <Empty title="No questions" />; }

const WINDOW_GROUPS = [
  {title: "Conversation", items: [["chat", "Chat", "chat"], ["questions", "Questions", "bell"]]},
  {title: "Work", items: [["counts", "Counts", "widget", "Your counts"], ["tasks", "Tasks", "task"], ["plans", "Plans", "plan"], ["agents", "Agents", "agent"]]},
  {title: "Code", items: [["feed", "File feed", "file"], ["terminal", "Terminal", "term"]]},
];

Object.assign(window, {CountsWindow, CountEditor, TASK_FIELDS, PLAN_FIELDS, SOURCES, parseQuery, GROUPS, WINDOW_GROUPS, AgentsWindow, QuestionsWindow});
