// Shared components. Every page and inspector in the prototype is built from these. The UI kit page shows each one and its rules.
const {useState, useEffect, useRef, useMemo, useCallback, createContext, useContext} = React;

// Icon: simple geometric strokes only. Sizes: 14 in the sidebar, 13 in buttons and menus, 12 in tabs, facts and bars.
const ICONS = {
  home: "M3 8l5-4 5 4v5H3z", search: "M7 3a4 4 0 1 1 0 8a4 4 0 1 1 0-8M10 10l3.5 3.5", doc: "M4 2h5l3 3v9H4zM9 2v3h3", file: "M4 2h5l3 3v9H4z",
  folder: "M2 4h4l1.5 1.5H14V13H2z", folderOpen: "M2 4h4l1.5 1.5H13v1.5M2 13l1.5-5.5H15L13.5 13z", git: "M5 3v10M5 6a3 3 0 0 0 3 3h3M11 9a1.5 1.5 0 1 0 0.01 0M5 3a1.2 1.2 0 1 0 .01 0",
  check: "M3 8.5l3 3 7-7", term: "M2 3h12v10H2zM4.5 6.5l2 1.5-2 1.5M8 10h3", skill: "M3 3h4a2 2 0 0 1 2 2v8a2 2 0 0 0-2-2H3zM13 3H9.5M13 3v8H9", brain: "M8 3a3 3 0 0 0-3 3v1a2.5 2.5 0 0 0 0 5h6a2.5 2.5 0 0 0 0-5V6a3 3 0 0 0-3-3M8 3v9",
  rule: "M3 4h10M3 8h10M3 12h6", agent: "M8 3a2.5 2.5 0 1 1 0 5a2.5 2.5 0 1 1 0-5M3 14a5 5 0 0 1 10 0", plug: "M6 2v3M10 2v3M4 5h8v3a4 4 0 0 1-8 0zM8 12v2", key: "M5 6a3 3 0 1 1 0 .01M7.5 8L14 8M12 8v2.5M10 8v2",
  link: "M7 9l2-2M6 11l-1 1a2 2 0 0 1-3-3l2-2M10 5l1-1a2 2 0 0 1 3 3l-2 2", gear: "M8 5.5a2.5 2.5 0 1 1 0 5a2.5 2.5 0 1 1 0-5M8 1.5v2M8 12.5v2M1.5 8h2M12.5 8h2M3.4 3.4l1.4 1.4M11.2 11.2l1.4 1.4M3.4 12.6l1.4-1.4M11.2 4.8l1.4-1.4",
  template: "M3 3h10v3H3zM3 8h4v5H3zM9 8h4v5H9z", seq: "M3 4h6M3 8h10M3 12h4M11 3l2 1-2 1", bell: "M4 11V7a4 4 0 0 1 8 0v4l1 1.5H3zM6.5 14h3", mic: "M8 2a2 2 0 0 1 2 2v4a2 2 0 0 1-4 0V4a2 2 0 0 1 2-2M4 8a4 4 0 0 0 8 0M8 12v2",
  team: "M6 4a2 2 0 1 1 0 4a2 2 0 1 1 0-4M11 5a1.6 1.6 0 1 1 0 3.2a1.6 1.6 0 1 1 0-3.2M2 13a4 4 0 0 1 8 0M10 10.5a3 3 0 0 1 4.5 2.5", plan: "M3 3h10v10H3zM5.5 6h5M5.5 8.5h5M5.5 11h3",
  task: "M3 3h10v10H3zM5.5 8l2 2 3-4", chart: "M3 13V8M7 13V4M11 13V9M2 13.5h12", log: "M3 3h10M3 6h10M3 9h10M3 12h7", hash: "M6 2l-1.5 12M11.5 2L10 14M2.5 5.5h11M2 10.5h11", grid: "M3 3h4v4H3zM9 3h4v4H9zM3 9h4v4H3zM9 9h4v4H9z",
  close: "M4 4l8 8M12 4l-8 8", back: "M10 3L5 8l5 5", fwd: "M6 3l5 5-5 5", up: "M3 10l5-5 5 5", down: "M3 6l5 5 5-5", right: "M6 3l5 5-5 5", more: "M3.5 8h.01M8 8h.01M12.5 8h.01",
  share: "M8 2v8M5 5l3-3 3 3M3 9v4h10V9", open: "M9 3h4v4M13 3L7 9M11 10v3H3V5h3", plus: "M8 3v10M3 8h10", chat: "M2.5 3h11v8h-6l-3 2.5V11h-2z", pause: "M5.5 3v10M10.5 3v10", play: "M5 3l8 5-8 5z", stop: "M4 4h8v8H4z",
  tick: "M3 8.5l3 3 7-7", user: "M8 3a2.5 2.5 0 1 1 0 5a2.5 2.5 0 1 1 0-5M3 14a5 5 0 0 1 10 0", copy: "M5 5h8v8H5zM3 11V3h8", edit: "M3 13l1-3 7-7 2 2-7 7zM10 4l2 2", trash: "M3 4h10M6 4V2.5h4V4M4.5 4l.5 9.5h6l.5-9.5",
  bolt: "M9 2L4 9h4l-1 5 5-7H8z", gauge: "M2.5 11a5.5 5.5 0 1 1 11 0M8 11l3-4", branch: "M5 3v10M11 5v2a3 3 0 0 1-3 3H5", clock: "M8 2.5a5.5 5.5 0 1 1 0 11a5.5 5.5 0 1 1 0-11M8 5v3.2l2 1.3", tunnel: "M2 13V8a6 6 0 0 1 12 0v5M5 13V8a3 3 0 0 1 6 0v5",
  hook: "M10 2v6a3 3 0 0 1-6 0V7M8 7L4 7", tool: "M10 2.5a3 3 0 0 0-3.5 4L2.5 10.5 5.5 13.5l4-4a3 3 0 0 0 4-3.5l-2 2-2-1-1-2z", phone: "M5 2h6v12H5zM7.5 12h1", activity: "M2 8h3l2-5 2 10 2-5h3", wide: "M3 6V3h3M13 6V3h-3M3 10v3h3M13 10v3h-3",
  sidebar: "M2 3h12v10H2zM6 3v10", widget: "M3 3h4v4H3zM9 3h4v4H9zM3 9h4v4H3zM11 9v4M9 11h4", filter: "M2.5 3.5h11L9.5 8.5V13l-3-1.5v-3z", pin: "M6 2h4l-1 4 2 2H5l2-2zM8 8v6", star: "M8 2l1.8 4 4.2.4-3.2 2.8 1 4.3L8 11.3 4.2 13.5l1-4.3L2 6.4l4.2-.4z",
  coin: "M8 2.5a5.5 5.5 0 1 1 0 11a5.5 5.5 0 1 1 0-11M8 5v6M6.5 6.5h2.5a1 1 0 0 1 0 2H7a1 1 0 0 0 0 2h2.5", kit: "M2.5 3h4.5v4.5H2.5zM9 3h4.5v4.5H9zM2.5 9h4.5v4.5H2.5zM9 9h4.5v4.5H9z", motion: "M2 8h7M6 4l4 4-4 4M12 3v10",
  alert: "M8 2l6.5 11.5h-13zM8 6.5v3M8 11.5h.01", keyboard: "M2 4h12v8H2zM4.5 6.5h.01M7 6.5h.01M9.5 6.5h.01M12 6.5h.01M5 9.5h6",
};
function Icon({name, size = 14, style}) {
  return <span className="ico" style={style}><svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d={ICONS[name] || ICONS.doc} /></svg></span>;
}
// a chevron in its own 12 px slot: rows that may fold all reserve it, so what comes after lines up
function Chevron({open, hidden}) { return <span className={"chev" + (open ? " open" : "")} style={hidden ? {visibility: "hidden"} : null}><Icon name="right" size={10} /></span>; }

/* ---------- layers: one Escape closes one layer ----------
   Menus, the comment box, palettes, dialogs, a picked range of lines and the inspector stack each register a layer while they are open.
   One listener answers Escape by closing the newest layer only. Page shortcuts run only while no layer is open. */
const LAYERS = [];
document.addEventListener("keydown", (e) => { if (e.key === "Escape" && LAYERS.length) { e.preventDefault(); e.stopPropagation(); LAYERS[LAYERS.length - 1].current(); } }, true);
function useLayer(active, onEscape) {
  const ref = useRef(onEscape); ref.current = onEscape;
  useEffect(() => { if (!active) return; LAYERS.push(ref); return () => { const i = LAYERS.indexOf(ref); if (i >= 0) LAYERS.splice(i, 1); }; }, [active]);
}
const noLayerOpen = () => LAYERS.length === 0;
const typing = (e) => /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName) || e.target.isContentEditable;

// Btn passes only safe props to the button: never small, variant or icon, which are its own
function Btn({variant = "", small, icon, children, title, onClick, disabled, className = "", style, type = "button", ...rest}) {
  const cls = ["btn", variant, small && "small", !children && icon && "icon", className].filter(Boolean).join(" ");
  const safe = Object.fromEntries(Object.entries(rest).filter(([k]) => k.startsWith("aria-") || k.startsWith("data-")));
  return <button type={type} className={cls} title={title} aria-label={title} onClick={onClick} disabled={disabled} style={style} {...safe}>{icon && !children && <Icon name={icon} size={13} />}{children}</button>;
}

// Tabs: the one tab band (underline). Arrow keys move between tabs, Home and End go to the ends.
function Tabs({tabs, value, onPick, end}) {
  const key = (e) => { const at = tabs.findIndex((t) => t.key === value); const to = {ArrowRight: at + 1, ArrowLeft: at - 1, Home: 0, End: tabs.length - 1}[e.key]; if (to == null) return; e.preventDefault(); const t = tabs[(to + tabs.length) % tabs.length]; onPick(t.key); e.currentTarget.querySelector(`[data-tab="${t.key}"]`)?.focus(); };
  return <div className="tabs" role="tablist" onKeyDown={key}>
    {tabs.map((t) => <button key={t.key} data-tab={t.key} role="tab" aria-selected={t.key === value} tabIndex={t.key === value ? 0 : -1} type="button" className={"tab" + (t.key === value ? " on" : "")} onClick={() => onPick(t.key)}>{t.label}{t.count != null && t.count !== 0 && <span className="count">{t.count}</span>}</button>)}
    {end && <span className="tabs-end">{end}</span>}
  </div>;
}

// Seg: one filter of one to four choices; FilterBar when a list has more than one thing to filter on
function Seg({options, value, onPick}) {
  return <span className="seg" role="radiogroup">{options.map((o) => <button key={o.key} type="button" role="radio" aria-checked={o.key === value} className={o.key === value ? "on" : ""} onClick={() => onPick(o.key)}>{o.label}{o.count != null && <span className="faint" style={{marginLeft: 5}}>{o.count}</span>}</button>)}</span>;
}

function SearchField({value, onChange, placeholder, kbd, autoFocus, style}) {
  return <label className="search" style={style}><Icon name="search" size={13} /><input value={value} autoFocus={autoFocus} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} aria-label={placeholder} />{value ? <button className="btn icon" style={{width: 20, height: 20}} onClick={() => onChange("")} title="Clear the search" aria-label="Clear the search"><Icon name="close" size={11} /></button> : kbd && <span className="kbd">{kbd}</span>}</label>;
}

const STATE_WORDS = {in_progress: "In progress", started: "Started", open: "Open", blocked: "Blocked", completed: "Completed", cancelled: "Cancelled", draft: "Draft", ready: "Ready", testing: "Testing", paused: "Paused", on: "On", off: "Off", failed: "Failed", done: "Passed", approved: "Approved", answered: "Answered"};
function Badge({state, children}) { return <span className={"badge " + (state || "plain")}>{children || STATE_WORDS[state] || state}</span>; }
function Switch({on, onChange, title}) { return <button type="button" role="switch" aria-checked={on} title={title} aria-label={title} className={"switch" + (on ? " on" : "")} onClick={() => onChange(!on)} />; }
function Avatar({name, agent}) { return <span className={"avatar" + (agent ? " agent" : "")}>{name.slice(0, 1).toUpperCase()}</span>; }
function Empty({title, line, action}) { return <div className="empty"><div><b>{title}</b>{line && <div>{line}</div>}{action && <div style={{marginTop: 12}}>{action}</div>}</div></div>; }
function Skeleton({lines = 4}) { return <div className="col" style={{gap: 10, padding: 16}}>{Array.from({length: lines}, (_, i) => <div key={i} className="skel" style={{width: `${90 - i * 12}%`}} />)}</div>; }

/* ---------- links: every reference to a row opens it ----------
   RowLink draws one reference. Linked turns the references in a text ("plan 1131", "task 9597", "worker-4") into links.
   It is a span with the link role, so it may stand inside a row that is itself a button. */
const OpenContext = createContext({open: () => {}, go: () => {}, openFile: () => {}});
const useOpen = () => useContext(OpenContext);
const TERM_WORDS = {plan: "Plan", task: "Task", doc: "Document", report: "Report", output: "Output", message: "Message", agent: "Agent", memory: "Memory", question: "Question", rule: "Rule"};
const TERM_OF = {plan: "plan", task: "task", doc: "doc", document: "doc", report: "report", output: "output", message: "message", memory: "memory", question: "question", rule: "rule"};
const agentByName = (name) => AGENTS.find((a) => a.name === name);
function RowLink({term, id, children, title}) {
  const {open} = useOpen();
  const go = (e) => { e.stopPropagation(); e.preventDefault(); open(term, id); };
  return <span role="link" tabIndex={0} className="ref-link" title={title || `Open ${TERM_WORDS[term] || term} ${id}`} onClick={go} onKeyDown={(e) => e.key === "Enter" && go(e)}>{children || `${TERM_WORDS[term] || term} ${id}`}</span>;
}
function AgentLink({name}) {
  const a = agentByName(name);
  return a ? <RowLink term="agent" id={a.id} title={`Open agent ${name}`}>{name}</RowLink> : <span>{name}</span>;
}
const REF = /\b(plan|task|doc|document|report|output|message|memory|question|rule)s? (\d+)\b|\b(main|worker-\d+|helper-\d+|reviewer-\d+)\b/gi;
function Linked({text}) {
  if (!text) return null;
  const parts = []; let last = 0; let m; REF.lastIndex = 0;
  while ((m = REF.exec(text))) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    if (m[3]) parts.push(agentByName(m[3]) && m[3] !== "main" || m[3] === "main" && /main agent|\bmain\b/.test(m[0]) ? <AgentLink key={m.index} name={m[3]} /> : m[0]);
    else parts.push(<RowLink key={m.index} term={TERM_OF[m[1].toLowerCase()]} id={Number(m[2])}>{m[0]}</RowLink>);
    last = m.index + m[0].length;
  }
  parts.push(text.slice(last));
  return <>{parts}</>;
}

// Menu: the one dropdown panel. Its items have an icon each, or none; a check item keeps the icon slot for its tick.
function Menu({button, children, align = "right", width}) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useLayer(open, () => setOpen(false));
  useEffect(() => { if (!open) return; const down = (e) => ref.current && !ref.current.contains(e.target) && setOpen(false); document.addEventListener("mousedown", down); return () => document.removeEventListener("mousedown", down); }, [open]);
  return <span className="menu-wrap" ref={ref}>
    {button({open, toggle: () => setOpen(!open)})}
    {open && <div className={"menu" + (align === "left" ? " left" : "")} style={width ? {width} : null} role="menu">{typeof children === "function" ? children(() => setOpen(false)) : children}</div>}
  </span>;
}
function MenuItem({icon, check, children, desc, hint, danger, onClick}) {
  const slot = check !== undefined ? <span className="slot">{check && <Icon name="tick" size={12} />}</span> : icon && <span className="slot"><Icon name={icon} size={13} /></span>;
  return <button type="button" role={check !== undefined ? "menuitemcheckbox" : "menuitem"} aria-checked={check} className={"menu-item" + (danger ? " danger" : "")} onClick={onClick}>{slot}<span className="grow">{children}{desc && <span className="desc">{desc}</span>}</span>{hint != null && <span className="hint">{hint}</span>}</button>;
}
// the button that opens a menu: its words, then a chevron. Never an icon in front.
function MenuButton({label, open, onClick, title}) { return <button type="button" className={"btn small menu-btn" + (open ? " on" : "")} aria-haspopup="menu" aria-expanded={open} title={title} onClick={onClick}><span>{label}</span><Icon name="down" size={11} /></button>; }

/* ActionMenu: a row's actions as one dropdown. An action may ask one field before it runs, inside the menu.
   run(value) returns nothing when it went through, or the words of a refusal: the menu then stays open, keeps what was typed and shows why.
   Groups, in this order: Who works on it, State, Text or Reading, Context, Danger (last, red, always asks why). */
function ActionMenu({actions, label = "Actions", onDone}) {
  const [asking, setAsking] = useState(null);
  const [value, setValue] = useState("");
  const [refusal, setRefusal] = useState(null);
  const groups = [...new Set(actions.map((a) => a.group))];
  const fire = (a, close) => { const why = a.run?.(value); if (why) { setRefusal({label: a.label, why}); if (!a.field) setAsking(null); return; } setRefusal(null); close(); onDone?.(a.done || a.label); };
  return <Menu width={asking || refusal ? 300 : undefined} button={({toggle, open}) => <MenuButton label={label} open={open} onClick={() => { setAsking(null); setRefusal(null); toggle(); }} />}>
    {(close) => asking ? <form className="menu-form" onSubmit={(e) => { e.preventDefault(); fire(asking, close); }}>
        <div className="row"><Btn icon="back" small title="Back to the actions" onClick={() => { setAsking(null); setRefusal(null); }} /><b style={{fontSize: 12.5, fontWeight: 500}}>{asking.label}</b></div>
        <label className="muted" style={{fontSize: 11.5}}>{asking.field.label}</label>
        {asking.field.kind === "agent" ? <select value={value} onChange={(e) => setValue(e.target.value)}>{AGENTS.map((a) => <option key={a.id} value={a.name}>{a.name} · {a.role}</option>)}</select>
          : <textarea autoFocus rows={3} value={value} onChange={(e) => setValue(e.target.value)} placeholder={asking.field.placeholder} />}
        {refusal && <div className="refusal" role="alert"><Icon name="alert" size={12} /><span>{refusal.why}</span></div>}
        <div className="row" style={{justifyContent: "flex-end"}}><Btn small onClick={() => { setAsking(null); setRefusal(null); }}>Back</Btn><Btn type="submit" small variant={asking.danger ? "danger" : "primary"} disabled={asking.field.kind !== "agent" && !value.trim()}>{asking.confirm || asking.label}</Btn></div>
      </form>
      : <>{refusal && <div className="menu-form"><div className="refusal" role="alert"><Icon name="alert" size={12} /><span><b>{refusal.label}</b> did not go through: {refusal.why}</span></div></div>}
        {groups.map((g, gi) => <React.Fragment key={g}>{gi > 0 && <div className="menu-sep" />}<div className="menu-label">{g}</div>
          {actions.filter((a) => a.group === g).map((a) => <MenuItem key={a.label} icon={a.icon} desc={a.desc} danger={a.danger} hint={a.field ? "…" : a.hint} onClick={() => { if (a.field) { setValue(a.field.kind === "agent" ? AGENTS[1].name : ""); setRefusal(null); setAsking(a); } else fire(a, close); }}>{a.label}</MenuItem>)}
        </React.Fragment>)}</>}
  </Menu>;
}

/* ---------- FilterBar: one filter bar for every list with more than one thing to filter on ----------
   fields: [{key, label, options: [[value, label]], get(row) -> value or values}]. value: {key: {not, values: []}}.
   A chip per field: closed it reads its label; set it reads "State: Open, Started" and has its own ×. Its menu takes is or is not and the values,
   each with how many rows have it. Words search the text of each row. The bar ends with how many rows show, and Clear. */
const emptyFilter = () => ({});
function applyFilter(rows, fields, value, words, textOf) {
  return rows.filter((r) => fields.every((f) => { const v = value[f.key]; if (!v || !v.values.length) return true; const got = [].concat(f.get(r)); const hit = v.values.some((x) => got.includes(x)); return v.not ? !hit : hit; }) && (!words || textOf(r).toLowerCase().includes(words.toLowerCase())));
}
function FilterChip({field, value, rows, onChange}) {
  const v = value || {not: false, values: []};
  const set = (next) => onChange(next.values.length ? next : null);
  const names = v.values.map((x) => field.options.find(([o]) => o === x)?.[1] || x);
  const countOf = (o) => rows.filter((r) => [].concat(field.get(r)).includes(o)).length;
  return <span className={"fchip" + (v.values.length ? " on" : "")}>
    <Menu align="left" width={240} button={({toggle, open}) => <button type="button" className="fchip-main" aria-haspopup="menu" aria-expanded={open} onClick={toggle}><span>{field.label}</span>{v.values.length > 0 && <b>{v.not ? "is not " : ": "}{names.join(", ")}</b>}<Icon name="down" size={10} /></button>}>
      <div className="menu-form" style={{paddingBottom: 4}}><Seg value={v.not ? "not" : "is"} onPick={(k) => set({...v, not: k === "not"})} options={[{key: "is", label: "is"}, {key: "not", label: "is not"}]} /></div>
      {field.options.map(([o, label]) => <MenuItem key={o} check={v.values.includes(o)} hint={countOf(o)} onClick={() => set({...v, values: v.values.includes(o) ? v.values.filter((x) => x !== o) : [...v.values, o]})}>{label}</MenuItem>)}
    </Menu>
    {v.values.length > 0 && <button type="button" className="fchip-x" title={`Clear ${field.label}`} aria-label={`Clear ${field.label}`} onClick={() => onChange(null)}><Icon name="close" size={9} /></button>}
  </span>;
}
function FilterBar({fields, rows, value, onChange, words, onWords, shown, placeholder = "Search", end}) {
  const active = Object.values(value).filter(Boolean).length + (words ? 1 : 0);
  return <div className="fbar">
    <SearchField value={words} onChange={onWords} placeholder={placeholder} style={{width: 200, height: 26}} />
    {fields.map((f) => <FilterChip key={f.key} field={f} rows={rows} value={value[f.key]} onChange={(v) => onChange({...value, [f.key]: v})} />)}
    <span className="grow" />
    <span className="faint" style={{fontSize: 11.5, whiteSpace: "nowrap"}}>{shown} of {rows.length}</span>
    {active > 0 && <Btn small variant="ghost" onClick={() => { onChange(emptyFilter()); onWords(""); }}>Clear</Btn>}
    {end}
  </div>;
}

// CommentBox: the free-floating box, everywhere a row takes comments. Its count is the one way to bring the comments back.
function CommentBox({count = 0, onSend, onShow, quote, onClearQuote, placeholder = "Leave a comment"}) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [sent, setSent] = useState(false);
  const box = useRef(null);
  useLayer(open, () => setOpen(false));
  useEffect(() => { if (quote) setOpen(true); }, [quote]);
  useEffect(() => { if (open) box.current?.focus(); }, [open]);
  const send = () => { if (!draft.trim()) return; onSend?.(draft.trim(), quote); setDraft(""); setOpen(false); setSent(true); onClearQuote?.(); };
  return <div className="cbox-dock"><div className="cbox">
    {open ? <div className="cbox-form" onKeyDown={(e) => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) send(); }}>
        {quote && <div className="cbox-quote"><b>On</b><span className="grow ellipsis">{quote}</span><button className="btn icon" style={{width: 18, height: 18}} onClick={onClearQuote} title="Comment on the whole" aria-label="Comment on the whole"><Icon name="close" size={10} /></button></div>}
        <textarea ref={box} value={draft} onChange={(e) => setDraft(e.target.value)} placeholder={quote ? "What about this part?" : "Write a comment. The agent reads it."} aria-label="Comment" />
        <div className="row"><span className="faint grow" style={{fontSize: 11}}><span className="kbd">⌘</span> <span className="kbd">Enter</span> to send</span><Btn small onClick={() => setOpen(false)}>Cancel</Btn><Btn small variant="primary" disabled={!draft.trim()} onClick={send}>Send</Btn></div>
      </div>
      : <div className="cbox-closed">
        <button type="button" className="cbox-open-btn" onClick={() => setOpen(true)}><span className="cbox-mark"><Icon name={sent ? "tick" : "chat"} size={13} /></span><span>{sent ? "Sent. Leave another" : placeholder}</span>{draft && <span className="faint" style={{fontSize: 11, marginLeft: "auto"}}>Draft kept</span>}</button>
        {onShow && <Btn small variant="ghost" onClick={onShow}>{count} {count === 1 ? "comment" : "comments"}</Btn>}
      </div>}
  </div></div>;
}

function CommentCard({c, hot, onShow}) {
  return <div className={"ccard" + (hot ? " hot" : "")} onClick={onShow} style={{cursor: onShow ? "pointer" : "default"}}>
    <div className="who"><Avatar name={c.by} agent={c.agent} />{c.agent ? <AgentLink name={c.by} /> : <span style={{color: "var(--text-2)"}}>{c.by}</span>}<span>· {c.at}</span>{c.outdated && <Badge state="blocked">Lines changed</Badge>}{c.n && <span style={{marginLeft: "auto"}} className="kbd">{c.n}</span>}</div>
    {c.quote && <blockquote>{c.quote}</blockquote>}
    <p><Linked text={c.text} /></p>
    {c.reply && <div className="who" style={{paddingLeft: 8, borderLeft: "1px solid var(--border-2)"}}><Avatar name={c.reply.by} agent /><span><AgentLink name={c.reply.by} />: <Linked text={c.reply.text} /></span></div>}
  </div>;
}

// CommentRail: the comments in the margin. Its × hides it; the comment box's count brings it back. Narrow, it floats over the text.
function CommentRail({comments, hot, onShow, onClose, floating, empty = "No comments yet. Select text to comment on a part of it."}) {
  return <aside className={"crail" + (floating ? " float" : "")} aria-label="Comments">
    <div className="crail-head"><h3>Comments</h3><span className="faint">{comments.length}</span><span className="grow" />{onClose && <Btn icon="close" small title="Hide the comments" onClick={onClose} />}</div>
    <div className="crail-list">{comments.length ? comments.map((c) => <CommentCard key={c.id} c={c} hot={hot === c.id} onShow={() => onShow?.(c.id)} />) : <p className="muted" style={{margin: 0}}>{empty}</p>}</div>
  </aside>;
}

function Dialog({title, sub, children, foot, onClose, narrow}) {
  useLayer(true, onClose);
  return <div className="veil" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
    <div className={"dialog" + (narrow ? " narrow" : "")} role="dialog" aria-modal="true" aria-label={title}>
      <div className="dialog-head"><div className="grow"><h2>{title}</h2>{sub && <div className="muted" style={{fontSize: 12, marginTop: 2}}>{sub}</div>}</div><Btn icon="close" title="Close" onClick={onClose} /></div>
      {children}
      {foot}
    </div>
  </div>;
}

const ToastContext = createContext(() => {});
function useToast() { return useContext(ToastContext); }

function Fields({rows}) { return <dl className="fields">{rows.filter(Boolean).map(([k, v]) => <React.Fragment key={k}><dt>{k}</dt><dd>{v}</dd></React.Fragment>)}</dl>; }
function Section({title, end, children}) { return <section className="section"><h4 className="section-title"><span className="grow">{title}</span>{end}</h4>{children}</section>; }

Object.assign(window, {ICONS, Icon, Chevron, useLayer, noLayerOpen, typing, Btn, Tabs, Seg, SearchField, Badge, Switch, Avatar, Empty, Skeleton, OpenContext, useOpen, RowLink, AgentLink, Linked, TERM_WORDS, Menu, MenuItem, MenuButton, ActionMenu, FilterBar, FilterChip, applyFilter, emptyFilter, CommentBox, CommentCard, CommentRail, Dialog, ToastContext, useToast, Fields, Section, STATE_WORDS});
