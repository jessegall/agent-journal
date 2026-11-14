// Pages on the shared layouts: Files, the simple list pages, Checks, Output and the logs.
// Documents, Skills, Memories and Git are round-six-pages.jsx's and round-seven.jsx's; Search is home-now.jsx's.

/* ---------- Files: an IDE-like browser, with comments on lines ----------
   One path (the bar over the file), one search (files by name, or text in files, in one palette), the status bar's facts after it. */
const flat = (n) => [n, ...(n.children || []).flatMap(flat)];
const ALL_FILES = flat(FILE_TREE).filter((n) => !n.dir);
const langOf = (p) => p.endsWith(".py") ? "Python" : p.endsWith(".vue") ? "Vue" : p.endsWith(".md") ? "Markdown" : p.endsWith(".css") ? "CSS" : "Text";
const GIT_WORDS = {M: "Changed", A: "New", D: "Deleted", R: "Moved", "?": "Not tracked"};
const KEYWORDS = /\b(from|import|const|def|class|return|for|in|if|else|export|template|script)\b/g;
// strings are cut out first, so a keyword never lands inside a span the colouring made
function tint(line) {
  if (/^\s*(#|\/\/)/.test(line)) return `<span class="tk-c">${escapeHtml(line)}</span>`;
  return line.split(/("[^"]*")/).map((part, i) => i % 2 ? `<span class="tk-s">${escapeHtml(part)}</span>`
    : escapeHtml(part).replace(KEYWORDS, '<span class="tk-k">$1</span>').replace(/\b([A-Z][A-Za-z]+)(?=\()/g, '<span class="tk-f">$1</span>')).join("");
}
// comments on files: a line range at a commit; when those lines change the comment says so
const FILE_COMMENTS = {
  "src/core/modules/plans/support/plan_inspector.py": [
    {id: 501, from: 15, to: 17, by: "Jesse", at: "10 min ago", text: "These three become the Actions menu; only the next step stays a button. See doc 1275.", reply: {by: "main", text: "Task 9692 builds it."}},
    {id: 502, from: 5, to: 5, by: "Jesse", at: "yesterday", outdated: true, text: "Name the states here, not a bare tuple."},
  ],
  "src/viewer/src/resource/Inspector.vue": [{id: 503, from: 4, to: 4, by: "reviewer-3", agent: true, at: "1 h ago", text: "Comments come from CommentBox only; QuickCommentBar goes."}],
};
const rangeText = (c) => c.from == null ? "Whole file" : c.from === c.to ? `Line ${c.from}` : `Lines ${c.from}–${c.to}`;

function FilesPage({initialPath}) {
  const toast = useToast();
  const start = initialPath || "src/core/modules/plans/support/plan_inspector.py";
  const [openDirs, setOpenDirs] = useState(new Set(["src", "src/viewer", "src/viewer/src", "src/viewer/src/resource", "src/viewer/src/kit", "src/core", "src/core/modules", "src/core/modules/plans"]));
  const [tabs, setTabs] = useState([...new Set([start, "src/viewer/src/resource/Inspector.vue"])]);
  const [current, setCurrent] = useState(start);
  const [hist, setHist] = useState({back: [], fwd: []});
  const [palette, setPalette] = useState(null);
  const [q, setQ] = useState("");
  const [hit, setHit] = useState(null);
  const [notes, setNotes] = useState(FILE_COMMENTS);
  const [sel, setSel] = useState(null);
  const [hot, setHot] = useState(null);
  const [rail, setRail] = useState(true);
  const [ref, w] = useWidth();
  useLayer(Boolean(palette), () => setPalette(null));
  useLayer(Boolean(sel) && !palette, () => setSel(null));
  const show = (path) => { setCurrent(path); setSel(null); setHot(null); };
  const open = (path, line = null) => { if (path !== current) setHist({back: [...hist.back, current].filter(Boolean), fwd: []}); if (!tabs.includes(path)) setTabs([...tabs, path]); show(path); setHit(line); setPalette(null); };
  const goBack = () => { const b = [...hist.back]; const p = b.pop(); if (!p) return; setHist({back: b, fwd: [current, ...hist.fwd].filter(Boolean)}); if (!tabs.includes(p)) setTabs([...tabs, p]); show(p); setHit(null); };
  const goFwd = () => { const [p, ...f] = hist.fwd; if (!p) return; setHist({back: [...hist.back, current].filter(Boolean), fwd: f}); if (!tabs.includes(p)) setTabs([...tabs, p]); show(p); setHit(null); };
  // page keys, only while no menu, dialog, palette or inspector is open, and never while typing: T search files, ⌘⇧F search text, [ and ] back and forward
  useEffect(() => { const k = (e) => { if (!noLayerOpen() || typing(e)) return; if (e.key === "t" && !e.metaKey && !e.ctrlKey) { e.preventDefault(); setPalette("files"); setQ(""); } if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key.toLowerCase() === "f") { e.preventDefault(); setPalette("text"); setQ(""); } if (e.key === "[") goBack(); if (e.key === "]") goFwd(); }; document.addEventListener("keydown", k); return () => document.removeEventListener("keydown", k); });
  const closeTab = (p) => { const rest = tabs.filter((t) => t !== p); setTabs(rest); if (p === current) show(rest[rest.length - 1] || null); };
  const toggle = (path) => { const s = new Set(openDirs); s.has(path) ? s.delete(path) : s.add(path); setOpenDirs(s); };
  const node = ALL_FILES.find((f) => f.path === current);
  const text = node && (FILE_TEXT[node.path] ?? `// ${node.name}\n// a sample file of the prototype\n`);
  const lines = text ? text.split("\n") : [];
  const fileNotes = (current && notes[current]) || [];
  const shownNotes = fileNotes.map((c) => ({...c, quote: c.from == null ? null : `${rangeText(c)} · ${(lines[c.from - 1] || "").trim()}`}));
  const noted = Object.fromEntries(Object.entries(notes).map(([p, l]) => [p, l.length]));
  // a click on a line number picks that line; Shift and a click stretches the pick to a range
  const pick = (n, stretch) => setSel(stretch && sel ? {from: Math.min(sel.from, n), to: Math.max(sel.to, n)} : {from: n, to: n});
  const send = (words) => { const c = {id: Date.now(), from: sel?.from ?? null, to: sel?.to ?? null, by: "Jesse", at: "now", text: words}; setNotes({...notes, [current]: [...fileNotes, c]}); setSel(null); setHot(c.id); };
  const showNote = (id) => { const c = fileNotes.find((x) => x.id === id); setHot(id); if (c?.from) setHit(c.from); };
  const textHits = q.length > 1 ? Object.entries(FILE_TEXT).map(([p, t]) => ({p, lines: t.split("\n").map((l, i) => ({l, i: i + 1})).filter((x) => x.l.toLowerCase().includes(q.toLowerCase()))})).filter((x) => x.lines.length) : [];
  const crumbs = current ? current.split("/") : [];
  const railShown = node && !node.binary && rail && fileNotes.length > 0 && w >= RAIL_FROM;
  return <div className="page" data-screen-label="Files">
    <div className="ide" style={{borderTop: 0}} ref={ref}>
      <div className="ide-bar">
        <Btn icon="back" small title="Back ( [ )" disabled={!hist.back.length} onClick={goBack} />
        <Btn icon="fwd" small title="Forward ( ] )" disabled={!hist.fwd.length} onClick={goFwd} />
        <div className="ide-path"><button onClick={() => show(null)}>agent-journal</button>{crumbs.map((c, i) => <React.Fragment key={i}><Icon name="right" size={9} style={{color: "var(--text-4)"}} /><button onClick={() => { if (i < crumbs.length - 1) { const s = new Set(openDirs); crumbs.slice(0, i + 1).forEach((_, j) => s.add(crumbs.slice(0, j + 1).join("/"))); setOpenDirs(s); } }}>{c}</button></React.Fragment>)}</div>
        <button className="cmdk" style={{width: 220, marginLeft: 0, height: 24}} onClick={() => { setPalette("files"); setQ(""); }}><Icon name="search" size={12} /><span className="grow" style={{textAlign: "left"}}>Search</span><span className="kbd">T</span></button>
      </div>
      <div className="ide-main">
        <nav className="tree" aria-label="Project files">{FILE_TREE.children.map((c) => <TreeNode key={c.path} n={c} depth={0} openDirs={openDirs} toggle={toggle} current={current} open={open} noted={noted} />)}</nav>
        <div className="col grow" style={{minHeight: 0, position: "relative"}}>
          <div className="etabs" role="tablist">{tabs.map((p) => <button key={p} role="tab" aria-selected={p === current} className={"etab" + (p === current ? " on" : "")} onClick={() => open(p)} title={p}>{p.split("/").pop()}<span className="x" role="button" aria-label={`Close ${p.split("/").pop()}`} title="Close" onClick={(e) => { e.stopPropagation(); closeTab(p); }}><Icon name="close" size={9} /></span></button>)}</div>
          {!node ? <Empty title="No file open" />
            : node.binary ? <Empty title="Not text" />
            : <div className="code view-in" key={current}>
              {node.big && <div className="notice warn" style={{margin: "0 16px 8px"}}>First 2,000 of 18,400 lines</div>}
              {node.from && <div className="notice" style={{margin: "0 16px 8px"}}>Moved from <span className="mono">{node.from}</span> · <RowLink term="task" id={node.task} /></div>}
              {lines.map((l, i) => { const n = i + 1; const inSel = sel && n >= sel.from && n <= sel.to; const on = shownNotes.filter((c) => c.from && n >= c.from && n <= c.to); const ends = shownNotes.filter((c) => c.to === n);
                return <React.Fragment key={i}>
                  <div className={"ln" + (hit === n ? " hit" : "") + (inSel ? " sel" : "") + (on.length ? " noted" : "")}>
                    <span className="no" onClick={(e) => pick(n, e.shiftKey)}>{n}</span>
                    <span className="cm">{on.length ? <i aria-label={plural(on.length, "comment")} /> : <button className="add" title="Comment" aria-label={`Comment on line ${n}`} onClick={() => pick(n, false)}><Icon name="plus" size={10} /></button>}</span>
                    <span dangerouslySetInnerHTML={{__html: tint(l) || " "}} />
                  </div>
                  {ends.map((c) => <div key={c.id} className="thread"><CommentCard c={{...c, quote: null}} hot={hot === c.id} onShow={() => setHot(c.id)} /></div>)}
                </React.Fragment>; })}
            </div>}
          {node && !node.binary && <CommentBox count={fileNotes.length} onSend={send} quote={sel ? `${rangeText(sel)} · ${node.name}` : null} onClearQuote={() => setSel(null)} onShow={() => setRail(!rail)} />}
          {node && !node.binary && rail && fileNotes.length > 0 && w < RAIL_FROM && <CommentRail floating comments={shownNotes} hot={hot} onShow={showNote} onClose={() => setRail(false)} />}
          {node && <div className="statusbar">{node.git && <span className={"gs " + (node.git === "?" ? "U" : node.git)}>{GIT_WORDS[node.git]}</span>}{node.task && <span><AgentLink name={node.by} /> · <RowLink term="task" id={node.task} /> · <RowLink term="plan" id={TASKS.find((t) => t.id === node.task)?.plan} /></span>}<span className="grow" /><span>{plural(lines.length, "line")}</span><span>{langOf(node.path)}</span><Btn small icon="copy" title="Copy path" onClick={() => toast("Path copied")} /></div>}
        </div>
        {railShown && <CommentRail comments={shownNotes} hot={hot} onShow={showNote} onClose={() => setRail(false)} />}
      </div>
    </div>
    {palette && <div className="veil" style={{background: "rgb(0 0 0 / .3)", placeItems: "start center"}} onMouseDown={(e) => e.target === e.currentTarget && setPalette(null)}><div className="palette" role="dialog" aria-label="Search">
      <div className="row" style={{gap: 8}}><SearchField autoFocus value={q} onChange={setQ} placeholder="Search" style={{flex: 1}} /><Seg value={palette} onPick={setPalette} options={[{key: "files", label: "Files"}, {key: "text", label: "Text"}]} /></div>
      <div className="palette-list">{palette === "files" ? <>
        {!q && <div className="menu-label">Open and changed</div>}
        {(q ? ALL_FILES.filter((f) => f.path.toLowerCase().includes(q.toLowerCase())) : ALL_FILES.filter((f) => tabs.includes(f.path) || f.git)).map((f) => <MenuItem key={f.path} icon="file" hint={f.path.split("/").slice(0, -1).join("/")} onClick={() => open(f.path)}>{f.name}</MenuItem>)}
        {q && !ALL_FILES.some((f) => f.path.toLowerCase().includes(q.toLowerCase())) && <p className="muted" style={{padding: 12, margin: 0}}>No match</p>}
      </> : q.length < 2 ? <p className="muted" style={{padding: 12, margin: 0}}>Two letters or more · <span className="kbd">⌘⇧F</span></p>
        : textHits.length ? textHits.map((h) => <div key={h.p}><div className="hitfile"><Icon name="file" size={12} />{h.p.split("/").pop()}<span className="faint" style={{fontSize: 11}}>{h.p}</span><span className="grow" /><span className="faint">{h.lines.length}</span></div>{h.lines.map((x) => { const at = x.l.toLowerCase().indexOf(q.toLowerCase()); return <button key={x.i} className="hitline" onClick={() => open(h.p, x.i)}><span className="faint">{x.i}</span><span>{x.l.slice(0, at).trimStart()}<em>{x.l.slice(at, at + q.length)}</em>{x.l.slice(at + q.length)}</span></button>; })}</div>) : <p className="muted" style={{padding: 12, margin: 0}}>No match</p>}
      </div>
    </div></div>}
  </div>;
}

/* ---------- list pages on ListReaderLayout ---------- */
function SimpleListPage({title, items, term, newLabel, meta, comments = false, actions, primary, filters, renderBody}) {
  const [chosen, setChosen] = useState(items[0]?.id);
  return <div className="page" data-screen-label={title}>
    <PageHeader title={title}>{newLabel && <Btn variant="primary" small>{newLabel}</Btn>}</PageHeader>
    <ListReaderLayout items={items} chosen={chosen} onChoose={setChosen} placeholder="Search" filters={filters} renderMeta={meta} emptyAction={newLabel && <Btn small variant="primary">{newLabel}</Btn>}
      renderReader={(item) => <Reader key={item.id} term={term} item={item} comments={comments} primary={primary?.(item)} actions={actions?.(item)}>{(ctx) => renderBody ? renderBody(item) : <Markdown text={item.body || ""} comments={ctx.comments} onSelectText={ctx.setQuote} />}</Reader>} />
  </div>;
}

/* ---------- card pages on CardGridLayout: a check's state is said once, a box only when it failed ---------- */
function CardPage({title, items, kind, onOpenSettings, newLabel}) {
  const [words, setWords] = useState("");
  const [on, setOn] = useState(Object.fromEntries(items.map((i) => [i.id, i.on])));
  const shown = items.filter((i) => i.title.toLowerCase().includes(words.toLowerCase()));
  return <div className="page" data-screen-label={title}>
    <PageHeader title={title}>{newLabel && <Btn variant="primary" small>{newLabel}</Btn>}</PageHeader>
    <div className="r6-fbar"><div className="fbar"><SearchField value={words} onChange={setWords} placeholder="Search" style={{width: 200, height: 26}} /></div></div>
    <CardGridLayout items={shown}
      emptyTitle={words ? "No match" : `No ${title.toLowerCase()}`} emptyAction={words ? <Btn small onClick={() => setWords("")}>Clear</Btn> : newLabel && <Btn small variant="primary">{newLabel}</Btn>}
      renderCard={(p) => <div key={p.id} className="card r16-card">
        <div className="row r16-card-head"><div className="grow" style={{minWidth: 0}}><h3>{p.title}</h3>{kind !== "check" && <div className="r16-card-state">{p.version}</div>}</div>{kind !== "check" && <Switch on={on[p.id]} onChange={(v) => setOn({...on, [p.id]: v})} title={p.title} />}{kind === "check" && <Badge state={p.version === "passed" ? "done" : "failed"} />}</div>
        <p className="r16-card-line"><Linked text={p.desc} /></p>
        {p.fault && <div className="notice bad r16-fault">{p.fault}</div>}
        <div className="r16-card-foot">{kind === "check" && <Btn small>Run</Btn>}<span className="grow" /><ActionMenu actions={[...(kind === "check" ? [] : [{group: title, label: "Settings", icon: "gear", run: () => { onOpenSettings?.(p); return false; }}]), {group: title, label: kind === "check" ? "Output" : "Log", icon: "log"}, ...(kind === "plugin" ? [{group: title, label: "Upgrade", icon: "up"}] : []), {group: "Danger", label: "Remove", icon: "trash", danger: true, field: {label: "Name"}, confirm: "Remove"}]} /></div>
      </div>} />
  </div>;
}

/* ---------- table pages on TableLayout: times and sizes flush right ---------- */
const OUTPUT_FIELDS = [
  {key: "state", label: "State", options: [["started", "Running"], ["failed", "Failed"], ["completed", "Finished"]], get: (o) => o.state},
  {key: "agent", label: "Agent", options: AGENTS.map((a) => [a.name, a.name]), get: (o) => o.by},
  {key: "task", label: "Task", options: [...new Set(OUTPUTS.map((o) => o.task))].map((t) => [t, `Task ${t}`]), get: (o) => o.task},
];
const OUTPUT_WORDS = {started: "Running", completed: "Finished", failed: "Failed"};
function OutputPage({onOpen}) {
  const [value, setValue] = useState(emptyFilter());
  const [words, setWords] = useState("");
  const rows = applyFilter(OUTPUTS, OUTPUT_FIELDS, value, words, (o) => `${o.id} ${o.line}`);
  return <div className="page" data-screen-label="Output">
    <PageHeader title="Output" />
    <div className="r6-fbar"><FilterBar fields={OUTPUT_FIELDS} rows={OUTPUTS} value={value} onChange={setValue} words={words} onWords={setWords} shown={rows.length} placeholder="Search" /></div>
    <TableLayout columns={[{key: "id", label: "Output", width: 90, render: (r) => <RowLink term="output" id={r.id}>{r.id}</RowLink>}, {key: "line", label: "Command", render: (r) => <span className="mono" style={{color: "var(--text)"}}>{r.line}</span>}, {key: "by", label: "Agent", width: 100, render: (r) => <R16Agent name={r.by} />}, {key: "task", label: "Task", width: 70, render: (r) => <RowLink term="task" id={r.task} bare />}, {key: "state", label: "State", width: 90, render: (r) => <Badge state={r.state}>{OUTPUT_WORDS[r.state]}</Badge>}, {key: "took", label: "Took", width: 70, end: true}, {key: "at", label: "When", width: 90, end: true}]}
      rows={rows} onRow={(r) => onOpen("output", r.id)} empty={<Empty title="No match" action={<Btn small onClick={() => { setValue(emptyFilter()); setWords(""); }}>Clear</Btn>} />} />
  </div>;
}
function LogPage({title}) {
  const [words, setWords] = useState("");
  const all = [{id: 1, at: "14:02:11", what: "PreToolUse Bash · main", ms: "38 ms"}, {id: 2, at: "14:02:09", what: "Stop · worker-4", ms: "112 ms"}, {id: 3, at: "14:01:55", what: "UserPromptSubmit · main", ms: "21 ms"}];
  const rows = all.filter((r) => r.what.toLowerCase().includes(words.toLowerCase()));
  const timed = title !== "System logs";
  return <div className="page" data-screen-label={title}><PageHeader title={title} /><div className="r6-fbar"><div className="fbar"><SearchField value={words} onChange={setWords} placeholder="Search" style={{width: 200, height: 26}} /></div></div><TableLayout columns={[{key: "at", label: "When", width: 100}, {key: "what", label: "What", render: (r) => <Linked text={r.what} />}, ...(timed ? [{key: "ms", label: "Took", width: 80, end: true}] : [])]} rows={rows} empty={<Empty title="No match" action={<Btn small onClick={() => setWords("")}>Clear</Btn>} />} /></div>;
}

Object.assign(window, {FilesPage, SimpleListPage, CardPage, OutputPage, LogPage, ALL_FILES, GIT_WORDS, langOf, tint, FILE_COMMENTS, rangeText, OUTPUT_FIELDS});
