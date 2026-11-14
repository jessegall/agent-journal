// The reusable layouts: SettingsLayout, CardGridLayout, TableLayout, and the shared pieces every surface uses (Markdown, PageHeader, comments).
// InspectorShell is round-sixteen.jsx's, ListReaderLayout round-seven.jsx's, Reader round-six-kit.jsx's, LinksTab home-now.jsx's.

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

// a page's header: its title, then its buttons at the right edge. No line under the title: the page says what it holds.
function PageHeader({title, children}) {
  return <div className="phead"><div className="grow"><h1>{title}</h1></div>{children}</div>;
}

// the comments of one row, kept while the row is shown
function useComments(key) {
  const [list, setList] = useState(COMMENTS[key] || []);
  useEffect(() => setList(COMMENTS[key] || []), [key]);
  const send = (text, quote) => setList((l) => { const next = [...l, {id: Date.now(), n: quote ? l.filter((c) => c.quote).length + 1 : null, by: "Jesse", at: "now", text, quote}]; COMMENTS[key] = next; return next; });
  return [list, send];
}

// the comments beside a text, the same on every surface: a rail from RAIL_FROM, floating over the text below it,
// shown only when there are comments, hidden by its × and brought back by the count on the comment box
function useCommentRail(width) {
  const [shown, setShown] = useState(width >= RAIL_FROM);
  const [floatOpen, setFloatOpen] = useState(false);
  const wide = width >= RAIL_FROM;
  useLayer(!wide && floatOpen, () => setFloatOpen(false));
  return {inline: wide && shown, floating: !wide && floatOpen, toggle: () => (wide ? setShown(!shown) : setFloatOpen(!floatOpen)), hide: () => (wide ? setShown(false) : setFloatOpen(false))};
}

/* ---------- SettingsLayout ----------
   Top band (scope chip, preset), the Tabs band, the section nav with the find field at its head, setting sections of rows,
   and the foot that applies the draft: how many changes wait, or how many a save refused and why. */
function SettingsLayout({scope, preset, tabs, tab, onTab, nav, navValue, onNav, children, draft, onSave, onCancel, find, failure}) {
  const top = scope || preset || (find && !nav);
  return <div className="sl">
    {top && <div className="sl-top">{scope && <span className="chip">{scope}</span>}{preset}<span className="grow" />{!nav && find}</div>}
    {tabs && <Tabs tabs={tabs} value={tab} onPick={onTab} />}
    <div className="sl-body">
      {nav && <nav className="sl-nav" aria-label="Sections">{find && <div className="sl-find">{find}</div>}{nav.map((n) => n.title ? <div key={n.title} className="side-group-title" style={{marginTop: 10}}>{n.title}</div> : <button key={n.key} className={navValue === n.key ? "on" : ""} aria-current={navValue === n.key} onClick={() => onNav(n.key)}><span className="slot"><Icon name={n.icon} size={13} /></span>{n.label}{n.changed > 0 && <i className="nav-dot" title="Changed" />}</button>)}</nav>}
      <div className="sl-content" key={navValue || tab}><div className="view-in">{children}</div></div>
    </div>
    <div className="foot"><span className={"note" + (failure ? " bad" : "")} role="status">{failure || (draft ? `${draft} change${draft === 1 ? "" : "s"}` : "No changes")}</span><Btn onClick={onCancel} disabled={!draft}>Cancel</Btn><Btn variant="primary" onClick={onSave} disabled={!draft}>Save</Btn></div>
  </div>;
}
function SettingSection({title, help, children}) { return <section className="ssec"><h4>{title}</h4>{help && <p className="help">{help}</p>}{children}</section>; }
function SettingRow({label, help, changed, found, error, children}) {
  return <div className={"srow" + (found ? " found" : "") + (error ? " refused" : "")}><div><div className="lab">{label}{changed && <i title="Changed" />}</div>{help && <p className="help" style={{margin: "2px 0 0", color: "var(--text-3)", fontSize: 12}}>{help}</p>}{error && <p className="row-error" role="alert">{error}</p>}</div><div className="ctl">{children}</div></div>;
}
// a settings draft: values change locally until Save; a save may refuse some keys and keep them changed
function useDraft(initial) {
  const [saved, setSaved] = useState(initial); const [now, setNow] = useState(initial);
  const changed = Object.keys(now).filter((k) => now[k] !== saved[k]);
  return {v: now, set: (k, val) => setNow((n) => ({...n, [k]: val})), changed, save: (refused = []) => setSaved((s) => ({...now, ...Object.fromEntries(refused.map((k) => [k, s[k]]))})), cancel: () => setNow(saved)};
}

/* ---------- CardGridLayout ----------  a toolbar and a grid of cards; a card opens its dialog. Empty: what is missing and one action. */
function CardGridLayout({toolbar, items, renderCard, emptyTitle, emptyAction}) {
  return <><div className="toolbar">{toolbar}</div><div className="cg">{items.length ? <div className="cg-grid">{items.map(renderCard)}</div> : <Empty title={emptyTitle} action={emptyAction} />}</div></>;
}

/* ---------- TableLayout ----------  a filter toolbar and a sticky-headed table; a row opens its inspector. Empty and failed states inside the table area.
   A column marked end (times, sizes, counts) is right-aligned with tabular figures. */
function TableLayout({toolbar, columns, rows, onRow, empty, failure}) {
  return <><div className="toolbar">{toolbar}</div><div className="scroll" style={{flex: 1, borderTop: "1px solid var(--border)"}}>
    {failure ? <div style={{padding: 16}}><div className="notice bad" role="alert">{failure}</div></div>
      : rows.length ? <table className="tbl"><thead><tr>{columns.map((c) => <th key={c.key} className={c.end ? "end" : undefined} style={{width: c.width}}>{c.label}</th>)}</tr></thead><tbody>{rows.map((r) => <tr key={r.id} tabIndex={0} onClick={() => onRow?.(r)} onKeyDown={(e) => e.key === "Enter" && onRow?.(r)}>{columns.map((c) => <td key={c.key} className={c.end ? "end" : undefined}>{c.render ? c.render(r) : r[c.key]}</td>)}</tr>)}</tbody></table>
      : empty}
  </div></>;
}

Object.assign(window, {RAIL_FROM, escapeHtml, inline, markdown, Markdown, useWidth, useComments, useCommentRail, PageHeader, SettingsLayout, SettingSection, SettingRow, useDraft, CardGridLayout, TableLayout});
