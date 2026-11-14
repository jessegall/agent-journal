// Round fourteen (messages 121209, 121267, 121273). Replaces by name: FactMenu, ActionMenu, AgentInspector, R8OpenCard.
// 1. FloatMenu: a dropdown drawn on the page body at its button's place, above everything, so no band that scrolls or clips can cut it.
//    The facts of the attribute band and every Actions menu open through it.
// 2. Actions of an agent (open card and inspector) is one dropdown anchored to its button, never a band of buttons under the header.
//    An action that cannot run now stays in the menu, greyed, with a tooltip saying why. Labels are short words.

/* ---------- FloatMenu: fixed to the viewport, anchored under its button, closed by Escape, a click outside, a scroll or a resize ---------- */
function FloatMenu({button, children, align = "left", width = 260}) {
  const [at, setAt] = useState(null);
  const anchor = useRef(null);
  const panel = useRef(null);
  const close = () => setAt(null);
  useLayer(Boolean(at), close);
  useEffect(() => {
    if (!at) return;
    const down = (e) => { if (anchor.current?.contains(e.target) || panel.current?.contains(e.target)) return; close(); };
    const moved = (e) => { if (panel.current?.contains(e.target)) return; close(); };
    document.addEventListener("mousedown", down);
    window.addEventListener("scroll", moved, true);
    window.addEventListener("resize", close);
    return () => { document.removeEventListener("mousedown", down); window.removeEventListener("scroll", moved, true); window.removeEventListener("resize", close); };
  }, [at]);
  const toggle = () => {
    if (at) { close(); return; }
    const r = anchor.current.getBoundingClientRect();
    const wanted = align === "left" ? r.left : r.right - width;
    setAt({top: r.bottom + 6, left: Math.max(8, Math.min(wanted, window.innerWidth - width - 8))});
  };
  return <span className="r14-anchor" ref={anchor}>
    {button({open: Boolean(at), toggle})}
    {at && ReactDOM.createPortal(<div ref={panel} className={"menu r14-float" + (align === "left" ? " left" : "")} role="menu" style={{top: at.top, left: at.left, width}}>{typeof children === "function" ? children(close) : children}</div>, document.body)}
  </span>;
}

/* ---------- a fact of the attribute band: its dropdown floats ---------- */
function FactMenu({width = 300, align = "left", fact, title, className = "", children}) {
  return <FloatMenu align={align} width={width} button={({toggle, open}) => <button type="button" className={"now-fact " + className + (open ? " on" : "")} title={title} aria-haspopup="menu" aria-expanded={open} onClick={toggle}>{fact}</button>}>{children}</FloatMenu>;
}

/* ---------- an action that cannot run now: greyed, its reason as the tooltip ---------- */
function R14Off({icon, label, why}) {
  return <button type="button" role="menuitem" aria-disabled="true" className="menu-item r14-off" title={why} onClick={(e) => e.preventDefault()}>
    <span className="slot">{icon && <Icon name={icon} size={13} />}</span><span className="grow">{plainLabel(label).word}</span>
  </button>;
}

/* ---------- ActionMenu: as round six, floating, and an action with off: "<why>" shows greyed ---------- */
function ActionMenu({actions, label = "Actions", onDone}) {
  const [asking, setAsking] = useState(null);
  const [value, setValue] = useState("");
  const [refusal, setRefusal] = useState(null);
  const groups = [...new Set(actions.map((a) => a.group))];
  const optionsOf = (f) => f.kind === "agent" ? AGENTS.map((a) => [a.name, `${a.name} · ${a.role}`]) : f.options;
  const picks = (f) => Boolean(optionsOf(f));
  const fire = (a, close) => { const why = a.run?.(value); if (typeof why === "string") { setRefusal({label: a.label, why}); if (!a.field) setAsking(null); return; } setRefusal(null); close(); if (why !== false) onDone?.(a.done || a.label); };
  return <FloatMenu align="right" width={280} button={({toggle, open}) => <MenuButton label={label} open={open} onClick={() => { setAsking(null); setRefusal(null); toggle(); }} />}>
    {(close) => asking ? <form className="menu-form" onSubmit={(e) => { e.preventDefault(); fire(asking, close); }}>
        <div className="row"><Btn icon="back" small title="Back" onClick={() => { setAsking(null); setRefusal(null); }} /><b style={{fontSize: 12.5, fontWeight: 500}}>{plainLabel(asking.label).word}</b></div>
        <label className="muted" style={{fontSize: 11.5}}>{asking.field.label}</label>
        {picks(asking.field) ? <select value={value} onChange={(e) => setValue(e.target.value)}>{optionsOf(asking.field).map(([k, l]) => <option key={k} value={k}>{l}</option>)}</select>
          : <textarea autoFocus rows={3} value={value} onChange={(e) => setValue(e.target.value)} placeholder={asking.field.placeholder} />}
        {refusal && <div className="refusal" role="alert"><Icon name="alert" size={12} /><span>{refusal.why}</span></div>}
        <div className="row" style={{justifyContent: "flex-end"}}><Btn small onClick={() => { setAsking(null); setRefusal(null); }}>Back</Btn><Btn type="submit" small variant={asking.danger ? "danger" : "primary"} disabled={!picks(asking.field) && !value.trim()}>{asking.confirm || asking.label}</Btn></div>
      </form>
      : <>{refusal && <div className="menu-form"><div className="refusal" role="alert"><Icon name="alert" size={12} /><span><b>{plainLabel(refusal.label).word}</b>: {refusal.why}</span></div></div>}
        {groups.map((g, gi) => <React.Fragment key={g}>{gi > 0 && <div className="menu-sep" />}<div className="menu-label">{g}</div>
          {actions.filter((a) => a.group === g).map((a) => a.off ? <R14Off key={a.label} icon={a.icon} label={a.label} why={a.off} />
            : <MenuItem key={a.label} icon={a.icon} desc={a.desc} danger={a.danger} hint={a.field ? "…" : a.hint} onClick={() => { if (a.field) { setValue(picks(a.field) ? (a.field.value ?? optionsOf(a.field)[0][0]) : (a.field.value ?? "")); setRefusal(null); setAsking(a); } else fire(a, close); }}>{a.label}</MenuItem>)}
        </React.Fragment>)}</>}
  </FloatMenu>;
}

/* ---------- Actions of an open card (AgentActions.vue): one dropdown; what cannot run now is greyed with its reason ---------- */
const R14_HISTORY = [["3f2a91", "today 09:12", "running"], ["b81c04", "yesterday 16:40", "ended, compacted 2 times"], ["77d0aa", "yesterday 10:05", "ended"]];
const R14_FORMS = {
  job: ["Send job", "What should it do?", "Send", "Job sent."],
  driver: ["Driver", "Program and model, such as claude, Opus 5.5", "Change", "Driver changed."],
  retire: ["Retire", "Why? It cannot be started again.", "Retire", "Agent retired."],
};
function R14AgentActions({a}) {
  const toast = useToast();
  const [view, setView] = useState("list");
  const [text, setText] = useState("");
  const idle = a.ended && !a.retired;
  const blocked = a.dot === "waiting" && !a.wait;
  const runs = a.retired ? "It is retired" : idle ? null : "Waits until its process stops";
  const items = [
    {key: "history", label: "History", icon: "clock"},
    {key: "lift", label: "Lift hold", icon: "play", off: blocked ? null : a.wait ? "It waits on the process queue, not on a hold" : "Nothing holds it"},
    {key: "job", label: "Send job", icon: "task", off: runs},
    {key: "driver", label: "Driver", icon: "model", off: runs},
    {key: "retire", label: "Retire", icon: "stop", danger: true, off: runs},
  ];
  const form = R14_FORMS[view];
  const back = <Btn icon="back" small title="Back" onClick={() => setView("list")} />;
  return <FloatMenu align="right" width={300} button={({open, toggle}) => <MenuButton label="Actions" open={open} onClick={() => { setView("list"); setText(""); toggle(); }} />}>
    {(close) => view === "history" ? <div className="menu-form">
        <div className="row">{back}<b style={{fontSize: 12.5, fontWeight: 500}}>History</b></div>
        <div className="r8-history">{R14_HISTORY.map(([s, at, how]) => <div key={s} className="r8-hrow r14-hrow"><span className="mono">{s}</span><span>{at}</span><span className="r8-faint">{how}</span></div>)}</div>
      </div>
      : form ? <form className="menu-form" onSubmit={(e) => { e.preventDefault(); if (!text.trim()) return; toast(form[3]); close(); }}>
        <div className="row">{back}<b style={{fontSize: 12.5, fontWeight: 500}}>{form[0]}</b></div>
        <textarea autoFocus rows={3} value={text} placeholder={form[1]} onChange={(e) => setText(e.target.value)} />
        <div className="row" style={{justifyContent: "flex-end"}}><Btn small onClick={() => setView("list")}>Back</Btn><Btn small type="submit" variant={view === "retire" ? "danger" : "primary"} disabled={!text.trim()}>{form[2]}</Btn></div>
      </form>
      : <>{items.map((it) => it.off ? <R14Off key={it.key} icon={it.icon} label={it.label} why={it.off} />
          : <MenuItem key={it.key} icon={it.icon} danger={it.danger} hint={R14_FORMS[it.key] ? "…" : undefined} onClick={() => { if (it.key === "lift") { toast("Hold lifted."); close(); return; } setText(""); setView(it.key); }}>{it.label}</MenuItem>)}</>}
  </FloatMenu>;
}

/* ---------- an open card: Actions is the dropdown; nothing opens under the header ---------- */
function R8OpenCard({a, onClose}) {
  const {open} = useOpen();
  const [tab, setTab] = useState(a.readOnly || a.retired ? "transcript" : "tasks");
  const tabs = [
    {key: "tasks", label: "Tasks", count: r8TasksOf(a).length}, {key: "transcript", label: "Transcript"}, {key: "terminal", label: "Terminal"},
    {key: "feed", label: "File feed"}, {key: "processes", label: "Processes"}, {key: "reports", label: "Reports", count: a.reports}, {key: "memories", label: "Memories", count: a.memories},
  ];
  const Body = R8_TAB_BODIES[tab];
  return <div className="r8-open" data-state={a.dot}>
    <div className="r8-ohead">
      <button type="button" className="r8-back" title="Back" aria-label="Back" onClick={onClose}><Icon name="back" size={14} /></button>
      <span className="r8-otitle">{a.title}</span><span className="r8-sub">{a.name} · {a.sub}</span>{a.sandboxOff && <R13Sandbox />}
      <span className="grow" />
      <R14AgentActions a={a} />
      <Btn small onClick={() => open("agent", a.id)}>Inspect</Btn>
      <R8Dot a={a} />
    </div>
    {a.retired ? <dl className="r8-lasting"><div><dt>Retired</dt><dd>{a.retiredAt}</dd></div><div><dt>Retired by</dt><dd>{a.retiredBy}</dd></div><div><dt>Reason</dt><dd>{a.retireReason}</dd></div></dl>
      : <div className="r8-band"><InfoBar agentId={a.id} card /></div>}
    <Tabs tabs={tabs} value={tab} onPick={setTab} />
    <div className="r8-obody view-in" key={tab}><Body a={a} /></div>
    {!a.retired && <R8CommandBand a={a} />}
  </div>;
}

/* ---------- the agent inspector: its session actions stay in the menu once the process has stopped, greyed, saying why ---------- */
function AgentInspector({id, onClose, onOpen, onBack}) {
  const a = r8Agent(id);
  const [paused, setPaused] = useState(false);
  const off = a.ended ? (a.retired ? "It is retired" : "Its process has stopped") : null;
  const actions = [
    {group: "Session", label: paused ? "Resume the agent" : "Pause the agent", icon: paused ? "play" : "pause", desc: "Only journal commands and reads run while paused", run: () => setPaused(!paused), off},
    {group: "Session", label: "Send a message", icon: "chat", field: {label: "Message", placeholder: "Tell the agent…"}, confirm: "Send", off},
    ...CONTEXT_ACTIONS("agent", a.id),
    {group: "Danger", label: "Stop the session", icon: "stop", danger: true, field: {label: "Why does it stop?"}, confirm: "Stop", off},
  ];
  const state = a.retired ? "retired" : a.ended ? "ended" : paused ? "paused" : a.dot === "waiting" ? "blocked" : "started";
  const title = <span className="r8-name"><i className="r8-sdot" data-state={paused ? "waiting" : a.dot} />{a.name}</span>;
  const bar = <div className="r8-who">{a.retired ? <span className="r8-faint">Retired {a.retiredAt} by {a.retiredBy}</span> : <InfoBar agentId={a.id} card />}<p className="r8-started">Started by: {a.startedBy}{a.job ? <> · Job: {a.jobTitle}</> : null}</p></div>;
  const tabs = [
    {key: "overview", label: "Overview", flush: true, render: () => <R8Overview a={a} />},
    {key: "memories", label: "Memories", count: a.memories, render: () => <AgentMemoriesTab />},
  ];
  return <InspectorShell term="agent" id={a.id} kind={`Agent ${a.id} · ${a.number}`} state={state} title={title} bar={bar} width="medium" actions={actions} tabs={tabs} comments={false}
    links={r8TasksOf(a).map((t) => ({kind: "Task", term: "task", id: t.id, title: t.title, state: t.state, icon: "task"}))} onClose={onClose} onOpen={onOpen} onBack={onBack} />;
}

Object.assign(window, {FloatMenu, FactMenu, R14Off, ActionMenu, R14AgentActions, R8OpenCard, AgentInspector});
