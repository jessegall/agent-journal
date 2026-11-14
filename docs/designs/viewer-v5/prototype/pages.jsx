// Pages, each on one of the shared layouts

function DocumentsPage({onOpen}) {
  const [term, setTerm] = useState("doc");
  const [state, setState] = useState("open");
  const [order, setOrder] = useState("newest");
  const items = DOCS.filter((d) => d.term === term && d.state === state).map((d) => ({...d, desc: d.abstract})).sort((a, b) => order === "title" ? a.title.localeCompare(b.title) : 0);
  const [chosen, setChosen] = useState(1402);
  const label = term === "doc" ? "document" : "report";
  return <div className="page" data-screen-label="Documents">
    <PageHeader title="Documents" line="What agents wrote down to keep, and what they checked"><Btn variant="primary" small>New {label}</Btn></PageHeader>
    <ListReaderLayout items={items} chosen={chosen} onChoose={setChosen} placeholder="Search titles and abstracts" pickLine={`Choose a ${label} to read it here`} emptyTitle={`No ${state} ${label}s`} emptyAction={<Btn small onClick={() => setState(state === "open" ? "closed" : "open")}>Show the {state === "open" ? "closed" : "open"} ones</Btn>}
      filters={<><Seg value={term} onPick={(k) => { setTerm(k); setChosen(DOCS.find((d) => d.term === k)?.id); }} options={[{key: "doc", label: "Documents"}, {key: "report", label: "Reports"}]} /><Seg value={state} onPick={setState} options={[{key: "open", label: "Open"}, {key: "closed", label: "Closed"}]} /></>}
      extra={<Seg value={order} onPick={setOrder} options={[{key: "newest", label: "Newest"}, {key: "title", label: "A–Z"}]} />}
      renderReader={(doc) => <Reader key={doc.id} term={doc.term} item={doc} meta={<><span className="mono">{doc.term === "doc" ? "Document" : "Report"} {doc.id}</span><span>· updated {doc.at} by <AgentLink name="helper-851" /></span></>}
        tabs={[{key: "text", label: "Text", text: true}, {key: "revisions", label: "Revisions", count: 3, render: () => <Timeline rows={REVISIONS} />}, {key: "links", label: "Links", count: 1, render: () => <LinksTab links={[{kind: "Plan", term: "plan", id: 1133, title: "Viewer v5: one look for every page", state: "ready", icon: "plan"}]} onOpen={onOpen} />}]}
        actions={[{group: "Text", label: "Edit the text", icon: "edit"}, {group: "Text", label: "Open in the inspector", icon: "open", run: () => onOpen(doc.term, doc.id)}, {group: "State", label: "Mark as needing no action", icon: "tick", field: {label: "Why does it need no action?"}, confirm: "Mark it"}, {group: "Context", label: "Copy the context command", icon: "copy", desc: `journal ${doc.term} show ${doc.id}`}]}>
        {(ctx) => <DocumentText doc={doc} ctx={ctx} />}
      </Reader>} />
  </div>;
}

/* ---------- Files: an IDE-like browser, with comments on lines ---------- */
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
const rangeText = (c) => c.from == null ? "The whole file" : c.from === c.to ? `Line ${c.from}` : `Lines ${c.from}–${c.to}`;

function TreeNode({n, depth, openDirs, toggle, current, open, noted}) {
  const pad = {paddingLeft: 8 + depth * 14};
  if (n.dir) return <>
    <button className="tree-row" style={pad} aria-expanded={openDirs.has(n.path)} onClick={() => toggle(n.path)}><Chevron open={openDirs.has(n.path)} /><Icon name={openDirs.has(n.path) ? "folderOpen" : "folder"} size={13} style={{color: "var(--text-3)"}} /><span className="ellipsis">{n.name}</span></button>
    {openDirs.has(n.path) && n.children.map((c) => <TreeNode key={c.path} n={c} depth={depth + 1} openDirs={openDirs} toggle={toggle} current={current} open={open} noted={noted} />)}</>;
  return <button className={"tree-row" + (n.path === current ? " on" : "")} style={pad} aria-current={n.path === current} title={n.from ? `Moved from ${n.from}` : n.path} onClick={() => open(n.path)}><Chevron hidden /><Icon name="file" size={13} style={{color: "var(--text-4)"}} /><span className="ellipsis grow">{n.name}</span>{noted[n.path] && <span className="faint" style={{fontSize: 10.5}} title="Comments">{noted[n.path]}</span>}<span className={"gs " + (n.git === "?" ? "U" : n.git || "")} title={GIT_WORDS[n.git]} style={{width: 10}}>{n.git || ""}</span></button>;
}

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
  // page keys, only while no menu, dialog, palette or inspector is open, and never while typing: T go to a file, ⌘⇧F search in files, [ and ] back and forward
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
  const railShown = node && !node.binary && rail && w >= RAIL_FROM;
  return <div className="page" data-screen-label="Files">
    <div className="ide" style={{borderTop: 0}} ref={ref}>
      <div className="ide-bar">
        <Btn icon="back" small title="Back ( [ )" disabled={!hist.back.length} onClick={goBack} />
        <Btn icon="fwd" small title="Forward ( ] )" disabled={!hist.fwd.length} onClick={goFwd} />
        <div className="ide-path"><button onClick={() => show(null)}>agent-journal</button>{crumbs.map((c, i) => <React.Fragment key={i}><Icon name="right" size={9} style={{color: "var(--text-4)"}} /><button onClick={() => { if (i < crumbs.length - 1) { const s = new Set(openDirs); crumbs.slice(0, i + 1).forEach((_, j) => s.add(crumbs.slice(0, j + 1).join("/"))); setOpenDirs(s); } }}>{c}</button></React.Fragment>)}</div>
        <button className="cmdk" style={{width: 240, marginLeft: 0, height: 24}} onClick={() => { setPalette("files"); setQ(""); }}><Icon name="search" size={12} /><span className="grow" style={{textAlign: "left"}}>Go to a file</span><span className="kbd">T</span></button>
        <Btn small onClick={() => { setPalette("text"); setQ(""); }}>Search in files</Btn>
      </div>
      <div className="ide-main">
        <nav className="tree" aria-label="Project files"><div className="lr-group" style={{paddingLeft: 8}}>Project</div>{FILE_TREE.children.map((c) => <TreeNode key={c.path} n={c} depth={0} openDirs={openDirs} toggle={toggle} current={current} open={open} noted={noted} />)}</nav>
        <div className="col grow" style={{minHeight: 0, position: "relative"}}>
          <div className="etabs" role="tablist">{tabs.map((p) => <button key={p} role="tab" aria-selected={p === current} className={"etab" + (p === current ? " on" : "")} onClick={() => open(p)} title={p}>{p.split("/").pop()}<span className="x" role="button" aria-label={`Close ${p.split("/").pop()}`} title="Close" onClick={(e) => { e.stopPropagation(); closeTab(p); }}><Icon name="close" size={9} /></span></button>)}</div>
          {!node ? <Empty title="No file open" line={<span>Choose a file in the tree, or press <span className="kbd">T</span> to go to one</span>} />
            : node.binary ? <Empty title="This file is not text" line="logo.png is an image of 24 KB. Open it from the project folder." />
            : <div className="code view-in" key={current}>
              {node.big && <div className="notice warn" style={{margin: "0 16px 8px"}}>Only the first 2,000 lines of this 18,400-line file are shown.</div>}
              {node.from && <div className="notice" style={{margin: "0 16px 8px"}}>Moved from <span className="mono">{node.from}</span> in <RowLink term="task" id={node.task} />.</div>}
              {lines.map((l, i) => { const n = i + 1; const inSel = sel && n >= sel.from && n <= sel.to; const on = shownNotes.filter((c) => c.from && n >= c.from && n <= c.to); const ends = shownNotes.filter((c) => c.to === n);
                return <React.Fragment key={i}>
                  <div className={"ln" + (hit === n ? " hit" : "") + (inSel ? " sel" : "") + (on.length ? " noted" : "")}>
                    <span className="no" title="Pick this line. Shift and click picks a range" onClick={(e) => pick(n, e.shiftKey)}>{n}</span>
                    <span className="cm">{on.length ? <i title={`${on.length} comment`} /> : <button className="add" title="Comment on this line" aria-label={`Comment on line ${n}`} onClick={() => pick(n, false)}><Icon name="plus" size={10} /></button>}</span>
                    <span dangerouslySetInnerHTML={{__html: tint(l) || " "}} />
                  </div>
                  {ends.map((c) => <div key={c.id} className="thread"><CommentCard c={{...c, quote: null}} hot={hot === c.id} onShow={() => setHot(c.id)} /></div>)}
                </React.Fragment>; })}
            </div>}
          {node && !node.binary && <CommentBox count={fileNotes.length} onSend={send} quote={sel ? `${rangeText(sel)} of ${node.name}` : null} onClearQuote={() => setSel(null)} placeholder="Comment on this file, or pick lines first" onShow={() => setRail(!rail)} />}
          {node && !node.binary && rail && w < RAIL_FROM && <CommentRail floating comments={shownNotes} hot={hot} onShow={showNote} onClose={() => setRail(false)} empty="No comments on this file. Click a line number, or Shift and click for a range, then write." />}
          {node && <div className="statusbar"><span className="mono">{node.path}</span>{node.git && <span className={"gs " + (node.git === "?" ? "U" : node.git)}>{GIT_WORDS[node.git]}</span>}{node.task && <span>by <AgentLink name={node.by} /> in <RowLink term="task" id={node.task} /> · <RowLink term="plan" id={TASKS.find((t) => t.id === node.task)?.plan} /></span>}<span className="grow" /><span>{lines.length} lines</span><span>{langOf(node.path)}</span><button className="btn ghost small" style={{height: 18}} onClick={() => toast("Path copied")}>Copy path</button></div>}
        </div>
        {railShown && <CommentRail comments={shownNotes} hot={hot} onShow={showNote} onClose={() => setRail(false)} empty="No comments on this file. Click a line number, or Shift and click for a range, then write." />}
      </div>
    </div>
    {palette && <div className="veil" style={{background: "rgb(0 0 0 / .3)", placeItems: "start center"}} onMouseDown={(e) => e.target === e.currentTarget && setPalette(null)}><div className="palette" role="dialog" aria-label={palette === "files" ? "Go to a file" : "Search in files"}>
      <SearchField autoFocus value={q} onChange={setQ} placeholder={palette === "files" ? "Go to a file by name" : "Search the text of every file"} />
      <div className="palette-list">{palette === "files" ? <>
        {!q && <div className="menu-label">Open and changed files</div>}
        {(q ? ALL_FILES.filter((f) => f.path.toLowerCase().includes(q.toLowerCase())) : ALL_FILES.filter((f) => tabs.includes(f.path) || f.git)).map((f) => <MenuItem key={f.path} icon="file" hint={f.path.split("/").slice(0, -1).join("/")} onClick={() => open(f.path)}>{f.name}</MenuItem>)}
        {q && !ALL_FILES.some((f) => f.path.toLowerCase().includes(q.toLowerCase())) && <p className="muted" style={{padding: 12, margin: 0}}>No file is called “{q}”.</p>}
      </> : q.length < 2 ? <p className="muted" style={{padding: 12, margin: 0}}>Type two letters or more. <span className="kbd">⌘⇧F</span> opens this anywhere on the page.</p>
        : textHits.length ? textHits.map((h) => <div key={h.p}><div className="hitfile"><Icon name="file" size={12} />{h.p.split("/").pop()}<span className="faint" style={{fontSize: 11}}>{h.p}</span><span className="grow" /><span className="faint">{h.lines.length}</span></div>{h.lines.map((x) => { const at = x.l.toLowerCase().indexOf(q.toLowerCase()); return <button key={x.i} className="hitline" onClick={() => open(h.p, x.i)}><span className="faint">{x.i}</span><span>{x.l.slice(0, at).trimStart()}<em>{x.l.slice(at, at + q.length)}</em>{x.l.slice(at + q.length)}</span></button>; })}</div>) : <p className="muted" style={{padding: 12, margin: 0}}>No file holds “{q}”.</p>}
      </div>
    </div></div>}
  </div>;
}

/* ---------- list pages on ListReaderLayout ---------- */
function SimpleListPage({title, line, items, term, newLabel, meta, comments = false, actions, primary, filters, renderBody}) {
  const [chosen, setChosen] = useState(items[0]?.id);
  return <div className="page" data-screen-label={title}>
    <PageHeader title={title} line={line}>{newLabel && <Btn variant="primary" small>{newLabel}</Btn>}</PageHeader>
    <ListReaderLayout items={items} chosen={chosen} onChoose={setChosen} placeholder={`Search ${title.toLowerCase()}`} filters={filters} renderMeta={meta} emptyAction={newLabel && <Btn small variant="primary">{newLabel}</Btn>}
      renderReader={(item) => <Reader key={item.id} term={term} item={item} comments={comments} primary={primary?.(item)} actions={actions?.(item)} meta={<span className="mono">{item.group}</span>}>{(ctx) => renderBody ? renderBody(item) : <Markdown text={item.body || ""} comments={ctx.comments} onSelectText={ctx.setQuote} />}</Reader>} />
  </div>;
}

function SkillsPage() {
  const [filter, setFilter] = useState("all");
  const [req, setReq] = useState(Object.fromEntries(SKILLS.map((s) => [s.id, s.required])));
  const items = SKILLS.filter((s) => filter === "all" || (filter === "required" ? req[s.id] : filter === "read" ? s.read : !s.read));
  const [chosen, setChosen] = useState("journal");
  return <div className="page" data-screen-label="Skills">
    <PageHeader title="Skills" line="What agents read to know how to work here" />
    <ListReaderLayout items={items} chosen={chosen} onChoose={setChosen} placeholder="Find a skill" emptyTitle="No skill in this filter" emptyAction={<Btn small onClick={() => setFilter("all")}>Show every skill</Btn>}
      filters={<Seg value={filter} onPick={setFilter} options={[{key: "all", label: "All", count: SKILLS.length}, {key: "required", label: "Required"}, {key: "read", label: "Read"}, {key: "unread", label: "Not read"}]} />}
      renderMeta={(s) => <span onClick={(e) => e.stopPropagation()}><Switch on={req[s.id]} onChange={(v) => setReq({...req, [s.id]: v})} title={`Required: every agent reads ${s.title} at its start`} /></span>}
      renderReader={(s) => <Reader key={s.id} term="skill" item={{...s, abstract: s.desc}} comments={false} meta={<><span className="mono">{s.group}</span>{s.read ? <Badge state="done">Read by main</Badge> : <Badge state="draft">Not read yet</Badge>}</>}
        primary={!s.read ? {label: "Make the agent read it", done: "The agent reads it before its next step"} : null}
        actions={[{group: "Reading", label: "Add a trigger", icon: "plus", desc: "The agent reads it as soon as your words appear", field: {label: "When these words appear"}}, {group: "Reading", label: "Require it for a profile", icon: "agent", field: {label: "Agent", kind: "agent"}}, {group: "File", label: "Open SKILL.md", icon: "open"}]}>
        {() => <><Section title="When it is read"><div className="col" style={{gap: 6, fontSize: 12.5}}><div>When you write <code className="mono">skill, journal</code></div><div className="muted">No triggers of your own yet.</div></div></Section><Section title="What the skill says"><Markdown text={s.body} /></Section></>}
      </Reader>} />
  </div>;
}

function MemoriesPage({onOpen}) {
  const [state, setState] = useState("active");
  return <SimpleListPage title="Memories" line="What agents keep in mind past their context" items={MEMORIES} term="memory" newLabel="New memory"
    filters={<Seg value={state} onPick={setState} options={[{key: "active", label: "In force"}, {key: "removed", label: "Removed"}]} />}
    meta={(m) => <span className="m">weight {m.weight}</span>}
    actions={(m) => [{group: "Memory", label: "Open in the inspector", icon: "open", run: () => onOpen("memory", m.id)}, {group: "Memory", label: "Change the weight", icon: "gauge", field: {label: "Weight, 1 to 10"}}, {group: "Danger", label: "Remove the memory", icon: "trash", danger: true, field: {label: "Why is it removed?"}, confirm: "Remove"}]} />;
}

// Git: a Tabs band above the list-and-reader layout switches between the three lists of one repository
function GitPage() {
  const [tab, setTab] = useState("commits");
  const [chosen, setChosen] = useState(COMMITS[0].id);
  const branches = [{id: "version-5", title: "version-5", desc: "3 ahead of main · current", group: "Local", body: "Current branch."}, {id: "worker-4/9682", title: "worker-4/9682", desc: "Task 9682 · worker-4", group: "Worktrees", body: "The worktree of task 9682."}, {id: "worker-7/9683", title: "worker-7/9683", desc: "Task 9683 · worker-7", group: "Worktrees", body: "The worktree of task 9683."}, {id: "main", title: "main", desc: "Default branch", group: "Local", body: ""}];
  const lists = {commits: COMMITS, branches, pulls: [{id: 412, title: "Version 5", desc: "version-5 into main · open", group: "Open", body: "Builds plan 1133."}]};
  return <div className="page" data-screen-label="Git">
    <PageHeader title="Git" line="Branch version-5 · 3 commits ahead of main" />
    <Tabs tabs={[{key: "commits", label: "Commits", count: COMMITS.length}, {key: "branches", label: "Branches", count: branches.length}, {key: "pulls", label: "Pull requests", count: 1}]} value={tab} onPick={(t) => { setTab(t); setChosen(lists[t][0].id); }} />
    <ListReaderLayout key={tab} items={lists[tab]} chosen={chosen} onChoose={setChosen} placeholder={`Search ${tab === "pulls" ? "pull requests" : tab}`} renderMeta={(c) => tab === "commits" ? <span className="m mono">{c.id}</span> : null}
      renderReader={(c) => <Reader key={c.id} term="commit" item={c} comments={false} meta={<span className="mono">{c.id} · {c.desc}</span>}>{() => <Markdown text={c.body || "No message body."} />}</Reader>} />
  </div>;
}

// Search: rows of every kind, grouped by kind; the reader previews the chosen row and opens it
function SearchPage({onOpen}) {
  const [q, setQ] = useState("comment box");
  const all = [...DOCS.map((d) => ({id: "d" + d.id, term: d.term, rid: d.id, title: d.title, desc: d.abstract, body: d.body, group: d.term === "doc" ? "Documents" : "Reports"})), ...TASKS.map((t) => ({id: "t" + t.id, term: "task", rid: t.id, title: t.title, desc: `Task ${t.id} · ${STATE_WORDS[t.state]}`, body: t.title, group: "Tasks"})), ...MEMORIES.map((m) => ({id: "m" + m.id, term: "memory", rid: m.id, title: m.desc, desc: m.title, body: m.body, group: "Memories"}))];
  const words = q.trim().toLowerCase().split(/\s+/).filter(Boolean);
  const hits = words.length ? all.filter((r) => words.some((w) => (r.title + " " + r.body).toLowerCase().includes(w))) : [];
  const [chosen, setChosen] = useState(null);
  return <div className="page" data-screen-label="Search">
    <div className="phead"><SearchField autoFocus value={q} onChange={(v) => { setQ(v); setChosen(null); }} placeholder="Search the journal" style={{flex: 1, height: 36}} /></div>
    {!words.length ? <Empty title="Search the journal" line="Tasks, plans, documents, reports, memories and messages" />
      : !hits.length ? <Empty title={`Nothing matches “${q}”`} line="Try fewer words, or another word for the same thing" action={<Btn small onClick={() => setQ("")}>Clear the search</Btn>} />
      : <ListReaderLayout items={hits} chosen={chosen ?? hits[0].id} onChoose={setChosen} searchable={false} pickLine="Choose a result"
        renderReader={(r) => <Reader key={r.id} term="search" item={r} comments={false} meta={<span className="mono">{r.group}</span>} primary={{label: "Open", done: "Opened"}}>{() => <><Markdown text={r.body} /><div style={{marginTop: 12}}><Btn small variant="primary" onClick={() => onOpen(r.term, r.rid)}>Open {TERM_WORDS[r.term]?.toLowerCase()} {r.rid}</Btn></div></>}</Reader>} />}
  </div>;
}

/* ---------- card pages on CardGridLayout ---------- */
function CardPage({title, line, items, kind, onOpenSettings, newLabel}) {
  const [words, setWords] = useState("");
  const [on, setOn] = useState(Object.fromEntries(items.map((i) => [i.id, i.on])));
  const shown = items.filter((i) => i.title.toLowerCase().includes(words.toLowerCase()));
  return <div className="page" data-screen-label={title}>
    <PageHeader title={title} line={line}>{newLabel && <Btn variant="primary" small>{newLabel}</Btn>}</PageHeader>
    <CardGridLayout toolbar={<SearchField value={words} onChange={setWords} placeholder={`Search ${title.toLowerCase()}`} style={{width: 320}} />} items={shown}
      emptyTitle={words ? "Nothing matches the search" : `No ${title.toLowerCase()} yet`} emptyLine={words ? null : line} emptyAction={words ? <Btn small onClick={() => setWords("")}>Clear the search</Btn> : newLabel && <Btn small variant="primary">{newLabel}</Btn>}
      renderCard={(p) => <div key={p.id} className="card">
        <div className="row"><span className="tile-mark">{p.title.slice(0, 2)}</span><div className="grow"><h3>{p.title}</h3><span className="faint" style={{fontSize: 11.5}}>{p.version}</span></div>{kind !== "check" && <Switch on={on[p.id]} onChange={(v) => setOn({...on, [p.id]: v})} title={`Turn ${p.title} on or off`} />}{kind === "check" && <Badge state={p.version === "passed" ? "done" : "failed"} />}</div>
        <p><Linked text={p.desc} /></p>
        {p.fault && <div className="notice bad" style={{padding: "6px 10px"}}>{p.fault}</div>}
        <div className="row" style={{marginTop: "auto"}}>{kind === "check" ? <Btn small>Run</Btn> : <Btn small onClick={() => onOpenSettings?.(p)}>Settings</Btn>}<span className="grow" /><ActionMenu label="More" actions={[{group: title, label: kind === "check" ? "Show the last output" : "Show the log", icon: "log"}, ...(kind === "plugin" ? [{group: title, label: "Upgrade", icon: "up"}] : []), {group: "Danger", label: "Remove", icon: "trash", danger: true, field: {label: `Type ${p.title} to confirm`}, confirm: "Remove"}]} /></div>
      </div>} />
  </div>;
}

/* ---------- table pages on TableLayout ---------- */
const OUTPUT_FIELDS = [
  {key: "state", label: "State", options: [["started", "Running"], ["failed", "Failed"], ["completed", "Finished"]], get: (o) => o.state},
  {key: "agent", label: "Agent", options: AGENTS.map((a) => [a.name, a.name]), get: (o) => o.by},
  {key: "task", label: "Task", options: [...new Set(OUTPUTS.map((o) => o.task))].map((t) => [t, `Task ${t}`]), get: (o) => o.task},
];
function OutputPage({onOpen}) {
  const [value, setValue] = useState(emptyFilter());
  const [words, setWords] = useState("");
  const rows = applyFilter(OUTPUTS, OUTPUT_FIELDS, value, words, (o) => `${o.id} ${o.line}`);
  return <div className="page" data-screen-label="Output">
    <PageHeader title="Output" line="Every command the agents ran, and what it printed" />
    <div style={{borderTop: "1px solid var(--border)"}}><FilterBar fields={OUTPUT_FIELDS} rows={OUTPUTS} value={value} onChange={setValue} words={words} onWords={setWords} shown={rows.length} placeholder="Search commands" /></div>
    <TableLayout columns={[{key: "id", label: "Output", width: 110, render: (r) => <RowLink term="output" id={r.id}>{r.id}</RowLink>}, {key: "line", label: "Command", render: (r) => <span className="mono" style={{color: "var(--text)"}}>{r.line}</span>}, {key: "by", label: "Agent", width: 100, render: (r) => <AgentLink name={r.by} />}, {key: "task", label: "Task", width: 100, render: (r) => <RowLink term="task" id={r.task} />}, {key: "state", label: "State", width: 110, render: (r) => <Badge state={r.state}>{r.state === "started" ? "Running" : undefined}</Badge>}, {key: "took", label: "Took", width: 90}, {key: "at", label: "When", width: 110}]}
      rows={rows} onRow={(r) => onOpen("output", r.id)} empty={<Empty title="No command matches" line="Loosen a filter, or clear them all" action={<Btn small onClick={() => { setValue(emptyFilter()); setWords(""); }}>Clear the filters</Btn>} />} />
  </div>;
}
function LogPage({title, line}) {
  const [words, setWords] = useState("");
  const all = [{id: 1, at: "14:02:11", what: "PreToolUse Bash · main", ms: "38 ms"}, {id: 2, at: "14:02:09", what: "Stop · worker-4", ms: "112 ms"}, {id: 3, at: "14:01:55", what: "UserPromptSubmit · main", ms: "21 ms"}];
  const rows = all.filter((r) => r.what.toLowerCase().includes(words.toLowerCase()));
  return <div className="page" data-screen-label={title}><PageHeader title={title} line={line} /><TableLayout toolbar={<SearchField value={words} onChange={setWords} placeholder="Search" style={{width: 300}} />} columns={[{key: "at", label: "When", width: 120}, {key: "what", label: "What", render: (r) => <Linked text={r.what} />}, {key: "ms", label: "Took", width: 90}]} rows={rows} empty={<Empty title="Nothing matches the search" action={<Btn small onClick={() => setWords("")}>Clear the search</Btn>} />} /></div>;
}

Object.assign(window, {DocumentsPage, FilesPage, SimpleListPage, SkillsPage, MemoriesPage, GitPage, SearchPage, CardPage, OutputPage, LogPage});
