// The five reusable layouts: InspectorShell, ListReaderLayout, SettingsLayout, CardGridLayout, TableLayout.

// one breakpoint for the comment rail on every surface (inspectorWidths.js in the build): below it the rail floats over the text
const RAIL_FROM = 980;

function escapeHtml(s) { return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }
// **bold**, `code`, and every row reference as a link
function inline(s) {
  return escapeHtml(s).replace(/\*\*(.+?)\*\*/g, "<b>$1</b>").replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\b(plan|task|doc|document|report|output|message|memory|question|rule)s? (\d+)\b/gi, (m, t, n) => `<span role="link" tabindex="0" class="ref-link" data-term="${{document: "doc"}[t.toLowerCase()] || t.toLowerCase()}" data-id="${n}">${m}</span>`);
}
// a small markdown reader; quotes of comments are drawn as numbered marks in the text
function markdown(text, comments = []) {
  const out = []; let list = null; let code = null;
  for (const raw of text.split("\n")) {
    if (raw.startsWith("```")) { if (code) { out.push(`<pre>${escapeHtml(code.join("\n"))}</pre>`); code = null; } else code = []; continue; }
    if (code) { code.push(raw); continue; }
    if (/^- /.test(raw)) { (list ||= []).push(`<li>${inline(raw.slice(2))}</li>`); continue; }
    if (list) { out.push(`<ul>${list.join("")}</ul>`); list = null; }
    const h = raw.match(/^(#{1,3}) (.*)/);
    if (h) out.push(`<h${h[1].length}>${inline(h[2])}</h${h[1].length}>`);
    else if (raw.trim()) out.push(`<p>${inline(raw)}</p>`);
  }
  if (list) out.push(`<ul>${list.join("")}</ul>`);
  let html = out.join("");
  for (const c of comments) if (c.quote) html = html.replace(escapeHtml(c.quote), `<mark data-c="${c.id}">${escapeHtml(c.quote)}<sup>${c.n || ""}</sup></mark>`);
  return html;
}
function Markdown({text, comments, onMark, onSelectText}) {
  const {open} = useOpen();
  const follow = (e) => { const r = e.target.closest(".ref-link"); if (r) { open(r.dataset.term, Number(r.dataset.id)); return true; } return false; };
  return <div className="md" dangerouslySetInnerHTML={{__html: markdown(text, comments)}}
    onClick={(e) => { if (follow(e)) return; const m = e.target.closest("mark"); if (m) onMark?.(Number(m.dataset.c)); }}
    onKeyDown={(e) => e.key === "Enter" && follow(e)}
    onMouseUp={() => { const s = window.getSelection()?.toString().trim(); if (s && s.length > 3) onSelectText?.(s); }} />;
}

// width of an element, to switch a rail into a floating one when it gets narrow
function useWidth() {
  const ref = useRef(null); const [w, setW] = useState(1200);
  useEffect(() => { if (!ref.current) return; const o = new ResizeObserver(([e]) => setW(e.contentRect.width)); o.observe(ref.current); return () => o.disconnect(); }, []);
  return [ref, w];
}

function PageHeader({title, line, children}) {
  return <div className="phead"><div className="grow"><h1>{title}</h1>{line && <p>{line}</p>}</div>{children}</div>;
}

// the comments of one row, kept while the row is shown
function useComments(key) {
  const [list, setList] = useState(COMMENTS[key] || []);
  useEffect(() => setList(COMMENTS[key] || []), [key]);
  const send = (text, quote) => setList((l) => { const next = [...l, {id: Date.now(), n: quote ? l.filter((c) => c.quote).length + 1 : null, by: "Jesse", at: "now", text, quote}]; COMMENTS[key] = next; return next; });
  return [list, send];
}

// the comments beside a text, the same on every surface: a rail from RAIL_FROM, floating over the text below it,
// hidden by its × and brought back by the count on the comment box
function useCommentRail(width) {
  const [shown, setShown] = useState(width >= RAIL_FROM);
  const [floatOpen, setFloatOpen] = useState(false);
  const wide = width >= RAIL_FROM;
  useLayer(!wide && floatOpen, () => setFloatOpen(false));
  return {inline: wide && shown, floating: !wide && floatOpen, toggle: () => (wide ? setShown(!shown) : setFloatOpen(!floatOpen)), hide: () => (wide ? setShown(false) : setFloatOpen(false))};
}

/* ---------- InspectorShell ----------
   Header band, left to right: Back (only on a stack), Previous and Next, the kind and the state; on the right the primary next step,
   Actions ▾, Share and Close. Close is always last, and the primary sits left of Actions, so a longer label never moves Actions.
   Below 600 px Share folds into Actions › Context. Then the title and abstract, the Tabs band (Details, the row's own tabs, Links), the body
   and the floating CommentBox. All share --inset. */
function InspectorShell({term, id, kind, state, title, abstract, width = "medium", primary, actions = [], tabs, links = [], comments, onClose, onBack, onStep, onOpen}) {
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
  const allTabs = [...tabs, {key: "links", label: "Links", count: links.length}];
  const shown = allTabs.find((t) => t.key === tab) || allTabs[0];
  const ctx = {setQuote, hot, setHot, comments: list, toast};
  return <aside ref={rootRef} className={"insp " + width} data-screen-label={`Inspector ${term}`}>
    <header className="insp-head">
      <div className="insp-band">
        {onBack && <Btn icon="back" small title="Back to the inspector under this one" onClick={onBack} />}
        {onStep && <><Btn icon="up" small title="Previous" onClick={() => onStep(-1)} /><Btn icon="down" small title="Next" onClick={() => onStep(1)} /></>}
        <span className="kind">{kind}{state && <Badge state={state} />}</span>
        <span className="grow" />
        {primary && <Btn small variant="primary" onClick={() => { const why = primary.run?.(); toast(why || primary.done || primary.label); }}>{primary.label}</Btn>}
        {allActions.length > 0 && <ActionMenu actions={allActions} onDone={toast} />}
        {!narrow && <Btn icon="share" small title="Copy a share link" onClick={() => toast("Share link copied")} />}
        <Btn icon="close" small title={onBack ? "Close every inspector" : "Close"} onClick={onClose} />
      </div>
      <h2 className="insp-title">{title}</h2>
      {abstract && <p className="insp-abstract">{abstract}</p>}
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

// Links: one grid, so the icon, the reference, the title and the state each stand in their own column
function LinksTab({links, onOpen}) {
  const kinds = [...new Set(links.map((l) => l.kind))];
  const [kind, setKind] = useState("all");
  if (!links.length) return <p className="muted">Nothing links to this row yet.</p>;
  const shown = links.filter((l) => kind === "all" || l.kind === kind);
  return <>
    {kinds.length > 1 && <div style={{marginBottom: 10}}><Seg value={kind} onPick={setKind} options={[{key: "all", label: "All", count: links.length}, ...kinds.map((k) => ({key: k, label: k, count: links.filter((l) => l.kind === k).length}))]} /></div>}
    {shown.map((l) => <div key={l.kind + l.id} className="link-row"><Icon name={l.icon} size={13} style={{color: "var(--text-3)"}} /><button className="ref" onClick={() => onOpen?.(l.term, l.id)}>{l.kind} {l.id}</button><span className="ellipsis">{l.title}</span>{l.state ? <Badge state={l.state} /> : <span />}</div>)}
  </>;
}

/* ---------- ListReaderLayout ----------
   A searchable, filterable, grouped list on the left, the chosen row read on the right. A page may put a Tabs band above it to switch
   between lists (Git), or a FilterBar inside it in place of the segmented filters. */
function ListReaderLayout({items, chosen, onChoose, placeholder = "Search", filters, extra, renderMeta, renderReader, emptyTitle = "Nothing here yet", emptyAction, pickLine = "Choose a row to read it here", listWidth, searchable = true}) {
  const [words, setWords] = useState("");
  const shown = items.filter((i) => !words || (i.title + " " + (i.desc || "")).toLowerCase().includes(words.toLowerCase()));
  const groups = [...new Set(shown.map((i) => i.group || ""))];
  const current = items.find((i) => i.id === chosen);
  const step = (d) => { const at = shown.findIndex((i) => i.id === chosen); const next = shown[Math.min(shown.length - 1, Math.max(0, at + d))]; next && onChoose(next.id); };
  return <div className="lr">
    <div className="lr-list" style={listWidth ? {width: listWidth} : null} tabIndex={0} aria-label="List" onKeyDown={(e) => { if (typing(e)) return; if (e.key === "ArrowDown") { e.preventDefault(); step(1); } if (e.key === "ArrowUp") { e.preventDefault(); step(-1); } }}>
      {(searchable || filters || extra) && <div className="lr-list-tools">{searchable && <SearchField value={words} onChange={setWords} placeholder={placeholder} />}{(filters || extra) && <div className="row" style={{flexWrap: "wrap"}}>{filters}<span className="grow" />{extra}</div>}</div>}
      <div className="lr-items">
        {!shown.length && <div style={{padding: 20}} className="muted"><b style={{color: "var(--text)", fontWeight: 500}}>{words ? "Nothing matches the search" : emptyTitle}</b><div style={{marginTop: 8}}>{words ? <Btn small onClick={() => setWords("")}>Clear the search</Btn> : emptyAction}</div></div>}
        {groups.map((g) => <React.Fragment key={g}>{g && <div className="lr-group">{g}</div>}
          {shown.filter((i) => (i.group || "") === g).map((i) => <button key={i.id} type="button" className={"lrow" + (i.id === chosen ? " on" : "")} aria-current={i.id === chosen} onClick={() => onChoose(i.id)}>
            <span className="grow col" style={{gap: 2}}><span className="t ellipsis">{i.title}</span>{i.desc && <span className="d">{i.desc}</span>}</span>
            {renderMeta ? renderMeta(i) : i.at && <span className="m">{i.at}</span>}
          </button>)}
        </React.Fragment>)}
      </div>
    </div>
    <div className="lr-reader" key={chosen ?? "none"}><div className="view-in" style={{display: "flex", flex: 1, minWidth: 0}}>{current ? renderReader(current) : <Empty title={pickLine} line={<span className="faint">Use <span className="kbd">↑</span> <span className="kbd">↓</span> in the list to step through</span>} />}</div></div>
  </div>;
}

// the reader half: header (meta, title, abstract; on the right the primary and Actions ▾), optional tabs, the body, the rail and the box
function Reader({term, item, actions, primary, children, comments = true, meta, tabs}) {
  const toast = useToast();
  const [ref, w] = useWidth();
  const [list, send] = useComments(`${term}:${item.id}`);
  const [quote, setQuote] = useState(null);
  const [hot, setHot] = useState(null);
  const [tab, setTab] = useState(tabs?.[0].key);
  const rail = useCommentRail(w);
  const ctx = {setQuote, hot, setHot, comments: list};
  const current = tabs?.find((t) => t.key === tab);
  return <div ref={ref} style={{display: "flex", flex: 1, minWidth: 0, position: "relative"}}>
    <div className="reader-col">
      <div className="reader-head row" style={{alignItems: "flex-start", paddingBottom: tabs ? 4 : 12, borderBottom: tabs ? 0 : "1px solid var(--border)"}}>
        <div className="grow"><div className="row muted" style={{fontSize: 12, marginBottom: 4}}>{meta}</div><h2>{item.title}</h2>{item.abstract && <p>{item.abstract}</p>}</div>
        <div className="row" style={{gap: 6}}>
          {primary && <Btn small variant="primary" onClick={() => toast(primary.done || primary.label)}>{primary.label}</Btn>}
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

/* ---------- SettingsLayout ----------
   Top band (scope chip, preset, find), the Tabs band, an optional section nav, setting sections of rows, and the foot that applies the draft.
   The foot says how many changes wait, or, after a save that went through only in part, how many were refused and why. */
function SettingsLayout({scope, preset, tabs, tab, onTab, nav, navValue, onNav, children, draft, onSave, onCancel, find, failure}) {
  return <div className="sl">
    {(scope || preset || find) && <div className="sl-top">{scope && <span className="chip">{scope}</span>}{preset}<span className="grow" />{find}</div>}
    {tabs && <Tabs tabs={tabs} value={tab} onPick={onTab} />}
    <div className="sl-body">
      {nav && <nav className="sl-nav" aria-label="Sections">{nav.map((n) => n.title ? <div key={n.title} className="side-group-title" style={{marginTop: 10}}>{n.title}</div> : <button key={n.key} className={navValue === n.key ? "on" : ""} aria-current={navValue === n.key} onClick={() => onNav(n.key)}><span className="slot"><Icon name={n.icon} size={13} /></span>{n.label}{n.changed > 0 && <i className="nav-dot" title="Changes not saved" />}</button>)}</nav>}
      <div className="sl-content" key={navValue || tab}><div className="view-in">{children}</div></div>
    </div>
    <div className="foot"><span className={"note" + (failure ? " bad" : "")} role="status">{failure || (draft ? `${draft} change${draft === 1 ? "" : "s"} not saved yet` : "No changes")}</span><Btn onClick={onCancel} disabled={!draft}>Cancel</Btn><Btn variant="primary" onClick={onSave} disabled={!draft}>Save</Btn></div>
  </div>;
}
function SettingSection({title, help, children}) { return <section className="ssec"><h4>{title}</h4>{help && <p className="help">{help}</p>}{children}</section>; }
function SettingRow({label, help, changed, found, error, children}) {
  return <div className={"srow" + (found ? " found" : "") + (error ? " refused" : "")}><div><div className="lab">{label}{changed && <i title="Changed, not saved" />}</div>{help && <p className="help" style={{margin: "2px 0 0", color: "var(--text-3)", fontSize: 12}}>{help}</p>}{error && <p className="row-error" role="alert">{error}</p>}</div><div className="ctl">{children}</div></div>;
}
// a settings draft: values change locally until Save; a save may refuse some keys and keep them changed
function useDraft(initial) {
  const [saved, setSaved] = useState(initial); const [now, setNow] = useState(initial);
  const changed = Object.keys(now).filter((k) => now[k] !== saved[k]);
  return {v: now, set: (k, val) => setNow((n) => ({...n, [k]: val})), changed, save: (refused = []) => setSaved((s) => ({...now, ...Object.fromEntries(refused.map((k) => [k, s[k]]))})), cancel: () => setNow(saved)};
}

/* ---------- CardGridLayout ----------  a toolbar and a grid of cards; a card opens its dialog. Empty: what is missing and one action. */
function CardGridLayout({toolbar, items, renderCard, emptyTitle, emptyLine, emptyAction}) {
  return <><div className="toolbar">{toolbar}</div><div className="cg">{items.length ? <div className="cg-grid">{items.map(renderCard)}</div> : <Empty title={emptyTitle} line={emptyLine} action={emptyAction} />}</div></>;
}

/* ---------- TableLayout ----------  a filter toolbar and a sticky-headed table; a row opens its inspector. Empty and failed states inside the table area. */
function TableLayout({toolbar, columns, rows, onRow, empty, failure}) {
  return <><div className="toolbar">{toolbar}</div><div className="scroll" style={{flex: 1, borderTop: "1px solid var(--border)"}}>
    {failure ? <div style={{padding: 16}}><div className="notice bad" role="alert">{failure}</div></div>
      : rows.length ? <table className="tbl"><thead><tr>{columns.map((c) => <th key={c.key} style={{width: c.width}}>{c.label}</th>)}</tr></thead><tbody>{rows.map((r) => <tr key={r.id} tabIndex={0} onClick={() => onRow?.(r)} onKeyDown={(e) => e.key === "Enter" && onRow?.(r)}>{columns.map((c) => <td key={c.key}>{c.render ? c.render(r) : r[c.key]}</td>)}</tr>)}</tbody></table>
      : empty}
  </div></>;
}

Object.assign(window, {RAIL_FROM, escapeHtml, inline, markdown, Markdown, useWidth, useComments, useCommentRail, PageHeader, InspectorShell, LinksTab, ListReaderLayout, Reader, SettingsLayout, SettingSection, SettingRow, useDraft, CardGridLayout, TableLayout});
