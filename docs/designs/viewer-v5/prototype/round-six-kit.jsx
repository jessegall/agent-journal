// Round six, part 1: the shared pieces both reviews asked for (report 1383, doc 1276). Replaces by name: Badge, ActionMenu, ListReaderLayout, Reader, TreeNode, InspectorFor.
// - Badge: one grey, squarish token; only blocked and failed are amber.
// - ActionMenu: a field may be a picker of any list (a profile, a schedule), not only an agent.
// - ListReaderLayout: each row is kind and number (RefCols), title, one line of text with its references as links, and a meta column.
//   The filter bar stands above the list and the reader (ListPage), the same shape as Output, Tasks and Plans.
// - Reader: one meta line on every page: kind and number, state, by whom, when.
// - CreateDialog: the one form behind every New button; closing it with something typed asks first.

Object.assign(TERM_WORDS, {reminder: "Reminder", template: "Template", sequence: "Sequence", commit: "Commit", branch: "Branch", pull: "Pull request", profile: "Profile", skill: "Skill", integration: "Integration", secret: "Secret", plugin: "Plugin", run: "Run"});

function Badge({state, children}) { return <span className={"badge " + (state || "plain")}>{children || STATE_WORDS[state] || state}</span>; }

function ActionMenu({actions, label = "Actions", onDone}) {
  const [asking, setAsking] = useState(null);
  const [value, setValue] = useState("");
  const [refusal, setRefusal] = useState(null);
  const groups = [...new Set(actions.map((a) => a.group))];
  const optionsOf = (f) => f.kind === "agent" ? AGENTS.map((a) => [a.name, `${a.name} · ${a.role}`]) : f.options;
  const picks = (f) => Boolean(optionsOf(f));
  const fire = (a, close) => { const why = a.run?.(value); if (typeof why === "string") { setRefusal({label: a.label, why}); if (!a.field) setAsking(null); return; } setRefusal(null); close(); if (why !== false) onDone?.(a.done || a.label); };
  return <Menu width={asking || refusal ? 300 : undefined} button={({toggle, open}) => <MenuButton label={label} open={open} onClick={() => { setAsking(null); setRefusal(null); toggle(); }} />}>
    {(close) => asking ? <form className="menu-form" onSubmit={(e) => { e.preventDefault(); fire(asking, close); }}>
        <div className="row"><Btn icon="back" small title="Back to the actions" onClick={() => { setAsking(null); setRefusal(null); }} /><b style={{fontSize: 12.5, fontWeight: 500}}>{asking.label}</b></div>
        <label className="muted" style={{fontSize: 11.5}}>{asking.field.label}</label>
        {picks(asking.field) ? <select value={value} onChange={(e) => setValue(e.target.value)}>{optionsOf(asking.field).map(([k, l]) => <option key={k} value={k}>{l}</option>)}</select>
          : <textarea autoFocus rows={3} value={value} onChange={(e) => setValue(e.target.value)} placeholder={asking.field.placeholder} />}
        {asking.field.help && <span className="faint" style={{fontSize: 11.5}}>{asking.field.help}</span>}
        {refusal && <div className="refusal" role="alert"><Icon name="alert" size={12} /><span>{refusal.why}</span></div>}
        <div className="row" style={{justifyContent: "flex-end"}}><Btn small onClick={() => { setAsking(null); setRefusal(null); }}>Back</Btn><Btn type="submit" small variant={asking.danger ? "danger" : "primary"} disabled={!picks(asking.field) && !value.trim()}>{asking.confirm || asking.label}</Btn></div>
      </form>
      : <>{refusal && <div className="menu-form"><div className="refusal" role="alert"><Icon name="alert" size={12} /><span><b>{refusal.label}</b> did not go through: {refusal.why}</span></div></div>}
        {groups.map((g, gi) => <React.Fragment key={g}>{gi > 0 && <div className="menu-sep" />}<div className="menu-label">{g}</div>
          {actions.filter((a) => a.group === g).map((a) => <MenuItem key={a.label} icon={a.icon} desc={a.desc} danger={a.danger} hint={a.field ? "…" : a.hint} onClick={() => { if (a.field) { setValue(picks(a.field) ? (a.field.value ?? optionsOf(a.field)[0][0]) : (a.field.value ?? "")); setRefusal(null); setAsking(a); } else fire(a, close); }}>{a.label}</MenuItem>)}
        </React.Fragment>)}</>}
  </Menu>;
}

// a row: [kind and number] [title / one line with its links] [meta]. Rows without a number (skills, profiles, branches) leave the first column out.
function ListReaderLayout({items, chosen, onChoose, placeholder = "Search", filters, extra, renderMeta, renderReader, emptyTitle = "Nothing here yet", emptyAction, pickLine = "Choose a row to read it here", listWidth, searchable = true}) {
  const [words, setWords] = useState("");
  const shown = items.filter((i) => !words || (i.title + " " + (typeof i.desc === "string" ? i.desc : "")).toLowerCase().includes(words.toLowerCase()));
  const groups = [...new Set(shown.map((i) => i.group || ""))];
  const current = items.find((i) => i.id === chosen);
  const hasRef = items.some((i) => i.ref);
  const step = (d) => { const at = shown.findIndex((i) => i.id === chosen); const next = shown[Math.min(shown.length - 1, Math.max(0, at + d))]; next && onChoose(next.id); };
  return <div className={"lr" + (hasRef ? " has-ref" : "")}>
    <div className="lr-list" style={listWidth ? {width: listWidth} : null} tabIndex={0} aria-label="List" onKeyDown={(e) => { if (typing(e)) return; if (e.key === "ArrowDown") { e.preventDefault(); step(1); } if (e.key === "ArrowUp") { e.preventDefault(); step(-1); } }}>
      {(searchable || filters || extra) && <div className="lr-list-tools">{searchable && <SearchField value={words} onChange={setWords} placeholder={placeholder} />}{(filters || extra) && <div className="row">{filters}<span className="grow" />{extra}</div>}</div>}
      <div className="lr-items">
        {!shown.length && <div style={{padding: 20}} className="muted"><b style={{color: "var(--text)", fontWeight: 500}}>{words ? "Nothing matches the search" : emptyTitle}</b><div style={{marginTop: 8}}>{words ? <Btn small onClick={() => setWords("")}>Clear the search</Btn> : emptyAction}</div></div>}
        {groups.map((g) => <React.Fragment key={g}>{g && <div className="lr-group">{g}</div>}
          {shown.filter((i) => (i.group || "") === g).map((i) => <button key={i.id} type="button" className={"lrow r6" + (i.id === chosen ? " on" : "")} aria-current={i.id === chosen} onClick={() => onChoose(i.id)}>
            {hasRef && (i.ref ? <RefCols term={i.ref.term} id={i.ref.id} kind={i.ref.kind} /> : <span />)}
            <span className="r6-main"><span className="t ellipsis">{i.title}</span>{i.desc && <span className="d">{typeof i.desc === "string" ? <Linked text={i.desc} /> : i.desc}</span>}</span>
            <span className="r6-meta">{renderMeta ? renderMeta(i) : i.at}</span>
          </button>)}
        </React.Fragment>)}
      </div>
    </div>
    <div className="lr-reader" key={chosen ?? "none"}><div className="view-in" style={{display: "flex", flex: 1, minWidth: 0}}>{current ? renderReader(current) : <Empty title={pickLine} line={<span className="faint">Use <span className="kbd">↑</span> <span className="kbd">↓</span> in the list to step through</span>} />}</div></div>
  </div>;
}

// the one meta line of a reader: kind and number, state, by whom, when, then anything the page adds
function ReaderMeta({row, state, stateWord, by, byLabel = "by", at, extra}) {
  return <div className="reader-meta">
    {row && <RefCols term={row.term} id={row.id} kind={row.kind} />}
    {state && <Badge state={state}>{stateWord}</Badge>}
    {by && <span>{byLabel} <AgentLink name={by} /></span>}
    {extra}
    {at && <span className="tail">{at}</span>}
  </div>;
}
function Reader({term, item, actions, primary, children, comments = true, meta, head, tabs}) {
  const toast = useToast();
  const [ref, w] = useWidth();
  const [list, send] = useComments(`${term}:${item.id}`);
  const [quote, setQuote] = useState(null);
  const [hot, setHot] = useState(null);
  const [tab, setTab] = useState(tabs?.[0].key);
  const rail = useCommentRail(w);
  const ctx = {setQuote, hot, setHot, comments: list};
  const current = tabs?.find((t) => t.key === tab);
  const runPrimary = () => { const why = primary.run?.(); if (why === false) return; toast(typeof why === "string" ? why : primary.done || primary.label); };
  return <div ref={ref} style={{display: "flex", flex: 1, minWidth: 0, position: "relative"}}>
    <div className="reader-col">
      <div className="reader-head row" style={{alignItems: "flex-start", paddingBottom: tabs ? 4 : 12, borderBottom: tabs ? 0 : "1px solid var(--border)"}}>
        <div className="grow">{head ? <ReaderMeta {...head} /> : <div className="reader-meta">{meta}</div>}<h2 title={item.title}>{item.title}</h2>{item.abstract && <p title={item.abstract}>{item.abstract}</p>}</div>
        <div className="row" style={{gap: 6}}>
          {primary && <Btn small variant="primary" onClick={runPrimary}>{primary.label}</Btn>}
          {actions && <ActionMenu actions={actions} onDone={toast} />}
        </div>
      </div>
      {tabs && <Tabs tabs={tabs} value={tab} onPick={setTab} />}
      <div className="reader-body" key={tab}><div className="reader-text view-in">{current && !current.text ? current.render(ctx) : children(ctx)}</div></div>
      {comments && <CommentBox count={list.length} onSend={send} quote={quote} onClearQuote={() => setQuote(null)} onShow={rail.toggle} />}
      {comments && rail.floating && <CommentRail floating comments={list} hot={hot} onShow={setHot} onClose={rail.hide} />}
    </div>
    {comments && rail.inline && <CommentRail comments={list} hot={hot} onShow={setHot} onClose={rail.hide} />}
  </div>;
}

/* ListPage: header, the filter bar across the page, then the list and the reader. Every list page uses it.
   fields as FilterBar takes them; initial: the filter it opens with; sort: [[key, label, compare]] in the bar's end menu. */
function ListPage({title, line, header, fields, rows, initial, textOf, sort, chosen, onChoose, placeholder, renderMeta, renderReader, emptyTitle, emptyAction, pickLine, listWidth, children}) {
  const [value, setValue] = useState(initial || emptyFilter());
  const [words, setWords] = useState("");
  const [order, setOrder] = useState(sort?.[0][0]);
  const shownRows = applyFilter(rows, fields, value, words, textOf || ((r) => `${r.id} ${r.title} ${typeof r.desc === "string" ? r.desc : ""}`));
  const sorted = sort ? [...shownRows].sort(sort.find(([k]) => k === order)[2]) : shownRows;
  const clear = () => { setValue(emptyFilter()); setWords(""); };
  const sortMenu = sort && <Menu width={200} button={({toggle, open}) => <MenuButton label={sort.find(([k]) => k === order)[1]} open={open} onClick={toggle} title="Order" />}>{(close) => sort.map(([k, l]) => <MenuItem key={k} check={k === order} onClick={() => { setOrder(k); close(); }}>{l}</MenuItem>)}</Menu>;
  return <div className="page" data-screen-label={title}>
    <PageHeader title={title} line={line}>{header}</PageHeader>
    {children}
    <div className="r6-fbar"><FilterBar fields={fields} rows={rows} value={value} onChange={setValue} words={words} onWords={setWords} shown={sorted.length} placeholder={placeholder || `Search ${title.toLowerCase()}`} end={sortMenu} /></div>
    <ListReaderLayout items={sorted} chosen={sorted.some((r) => r.id === chosen) ? chosen : sorted[0]?.id} onChoose={onChoose} searchable={false} renderMeta={renderMeta} renderReader={renderReader} listWidth={listWidth} pickLine={pickLine}
      emptyTitle={rows.length ? "No row matches the filters" : emptyTitle} emptyAction={rows.length ? <Btn small onClick={clear}>Clear the filters</Btn> : emptyAction} />
  </div>;
}
// the options of a filter field, read from the rows
const R6_OPTS = (rows, get, label = (v) => v) => [...new Set(rows.flatMap((r) => [].concat(get(r))).filter((v) => v != null && v !== ""))].map((v) => [v, label(v)]);

/* ---------- CreateDialog: the form behind every New button ----------
   fields: [{key, label, kind: text | area | select | agent | password | number | steps, options, help, required, placeholder, half, when(values)}].
   check(values) returns {key: refusal}; a refused field keeps its value and says why. Closing with something typed asks first. */
function CreateDialog({title, sub, fields, submit = "Make it", command, onClose, onMade, check}) {
  const start = Object.fromEntries(fields.map((f) => [f.key, f.value ?? (f.kind === "steps" ? [""] : f.kind === "agent" ? AGENTS[0].name : f.kind === "select" ? f.options[0][0] : "")]));
  const [v, setV] = useState(start);
  const [errors, setErrors] = useState({});
  const [asking, setAsking] = useState(false);
  const typed = fields.filter((f) => JSON.stringify(v[f.key]) !== JSON.stringify(start[f.key])).length;
  const set = (k, x) => setV((n) => ({...n, [k]: x}));
  const live = fields.filter((f) => !f.when || f.when(v));
  const make = () => {
    const missing = Object.fromEntries(live.filter((f) => f.required && !String(f.kind === "steps" ? v[f.key].join("") : v[f.key]).trim()).map((f) => [f.key, `Fill in ${f.label.toLowerCase()}.`]));
    const refused = {...missing, ...(check?.(v) || {})};
    setErrors(refused);
    if (Object.keys(refused).length) return false;
    onMade?.(v); onClose(); return true;
  };
  const close = () => (typed ? setAsking(true) : onClose());
  const control = (f) => {
    const common = {"aria-label": f.label, value: v[f.key], placeholder: f.placeholder, onChange: (e) => set(f.key, e.target.value)};
    if (f.kind === "area") return <textarea {...common} rows={f.rows || 5} />;
    if (f.kind === "select") return <select {...common}>{f.options.map(([k, l]) => <option key={k} value={k}>{l}</option>)}</select>;
    if (f.kind === "agent") return <select {...common}>{AGENTS.map((a) => <option key={a.id} value={a.name}>{a.name} · {a.role}</option>)}</select>;
    if (f.kind === "password") return <input type="password" autoComplete="off" {...common} />;
    if (f.kind === "number") return <input type="number" {...common} />;
    if (f.kind === "steps") return <div className="steps">{v[f.key].map((s, i) => <div key={i}><span className="faint r6-num">{i + 1}</span><input type="text" aria-label={`Step ${i + 1}`} value={s} placeholder={i === 0 ? f.placeholder : ""} onChange={(e) => set(f.key, v[f.key].map((x, j) => j === i ? e.target.value : x))} /><Btn small variant="ghost" disabled={v[f.key].length === 1} onClick={() => set(f.key, v[f.key].filter((_, j) => j !== i))}>Remove</Btn></div>)}<div><span /><span><Btn small onClick={() => set(f.key, [...v[f.key], ""])}>Add a step</Btn></span></div></div>;
    return <input type="text" {...common} />;
  };
  const rowsOf = [];
  for (let i = 0; i < live.length; i++) { const f = live[i]; if (f.half && live[i + 1]?.half) { rowsOf.push([f, live[i + 1]]); i++; } else rowsOf.push([f]); }
  return <Dialog narrow title={title} sub={sub} onClose={close} foot={<div className="foot"><span className="note mono ellipsis" style={{fontSize: 11.5}} title="The command this runs">{command?.(v)}</span><Btn onClick={close}>Cancel</Btn><Btn variant="primary" onClick={make}>{submit}</Btn></div>}>
    <form className="r6-form" onSubmit={(e) => { e.preventDefault(); make(); }}>
      {rowsOf.map((pair) => <div key={pair[0].key} className={pair.length > 1 ? "two" : ""}>{pair.map((f) => <label key={f.key}><span>{f.label}{f.required ? "" : <span className="faint"> · if you want</span>}</span>{control(f)}{f.help && <span className="help">{f.help}</span>}{errors[f.key] && <span className="err" role="alert">{errors[f.key]}</span>}</label>)}</div>)}
    </form>
    {asking && <LeaveDialog count={typed} onStay={() => setAsking(false)} onDiscard={onClose} onSave={() => { setAsking(false); make(); }} />}
  </Dialog>;
}

/* ---------- Files: the tree's comment count gets its own icon and column, apart from the git mark ---------- */
function TreeNode({n, depth, openDirs, toggle, current, open, noted}) {
  const pad = {paddingLeft: 8 + depth * 14};
  if (n.dir) return <>
    <button className="tree-row" style={pad} aria-expanded={openDirs.has(n.path)} onClick={() => toggle(n.path)}><Chevron open={openDirs.has(n.path)} /><Icon name={openDirs.has(n.path) ? "folderOpen" : "folder"} size={13} style={{color: "var(--text-3)"}} /><span className="ellipsis">{n.name}</span></button>
    {openDirs.has(n.path) && n.children.map((c) => <TreeNode key={c.path} n={c} depth={depth + 1} openDirs={openDirs} toggle={toggle} current={current} open={open} noted={noted} />)}</>;
  const words = {M: "Changed", A: "New", D: "Deleted", R: "Moved", "?": "Not tracked"};
  return <button className={"tree-row" + (n.path === current ? " on" : "")} style={pad} aria-current={n.path === current} title={n.from ? `Moved from ${n.from}` : n.path} onClick={() => open(n.path)}><Chevron hidden /><Icon name="file" size={13} style={{color: "var(--text-4)"}} /><span className="ellipsis grow">{n.name}</span>
    <span className="r6-cm" title={noted[n.path] ? `${noted[n.path]} comment${noted[n.path] === 1 ? "" : "s"}` : undefined}>{noted[n.path] ? <><Icon name="chat" size={10} />{noted[n.path]}</> : null}</span>
    <span className="gs" title={words[n.git]}>{n.git || ""}</span></button>;
}

/* ---------- every reference opens an inspector: the rows that had none get the shared shape, with their facts and the page they live on ---------- */
const R6_INSPECTORS = {};
function R6RowInspector({s, ...props}) {
  const {go} = useOpen();
  const row = R6_INSPECTORS[s.term]?.(s.id);
  const word = TERM_WORDS[s.term] || s.term;
  if (!row) return <InspectorShell term={s.term} id={s.id} kind={`${word} ${s.id}`} title={`${word} ${s.id}`} tabs={[{key: "details", label: "Details", render: () => <p className="muted">This row opens in the shared inspector shape.</p>}]} {...props} />;
  return <InspectorShell term={s.term} id={s.id} kind={`${word} ${row.short || s.id}`} state={row.state} title={row.title} abstract={row.abstract} width="medium" comments={false}
    primary={{label: `Open on the ${row.pageTitle} page`, run: () => { props.onClose(); go(row.page); return ""; }}}
    tabs={[{key: "details", label: "Details", render: () => <Section title="Facts"><Fields rows={row.fields} /></Section>}]} {...props} />;
}
function InspectorFor({s, ...props}) {
  const C = {plan: PlanInspector, task: TaskInspector, doc: DocumentInspector, report: DocumentInspector, agent: AgentInspector, memory: MemoryInspector, output: OutputInspector, message: MessageInspector}[s.term];
  if (C) return <C id={s.id} {...props} />;
  return <R6RowInspector s={s} {...props} />;
}

Object.assign(window, {Badge, ActionMenu, ListReaderLayout, ReaderMeta, Reader, ListPage, R6_OPTS, CreateDialog, TreeNode, R6_INSPECTORS, R6RowInspector, InspectorFor});
