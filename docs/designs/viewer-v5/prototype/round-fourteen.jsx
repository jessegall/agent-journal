// Round fourteen (messages 121209, 121267, 121273). Replaces by name: FactMenu, R8OpenCard. Adds R14_HISTORY.
// 1. A fact of the attribute band opens a floating dropdown (FloatMenu, round fifteen), so no band that scrolls or clips can cut it.
// 2. Actions of an agent (open card and inspector) is one dropdown anchored to its button (r15AgentActions, round fifteen).
//    An action that cannot run now stays in the menu, greyed, saying why. Labels are short words.

/* ---------- a fact of the attribute band: its dropdown floats ---------- */
function FactMenu({width = 300, align = "left", fact, title, className = "", children}) {
  return <FloatMenu align={align} width={width} button={({toggle, open}) => <button type="button" className={"now-fact " + className + (open ? " on" : "")} title={title} aria-haspopup="menu" aria-expanded={open} onClick={toggle}>{fact}</button>}>{children}</FloatMenu>;
}

/* ---------- an agent's sessions, read by the History action ---------- */
const R14_HISTORY = [["3f2a91", "today 09:12", "running"], ["b81c04", "yesterday 16:40", "ended · compacted 2 times"], ["77d0aa", "yesterday 10:05", "ended"]];

/* ---------- an open card: Actions is the dropdown; nothing opens under the header ---------- */
// the profile word only when the name does not already say it (r15Role, round fifteen)
function R8OpenCard({a, onClose}) {
  const {open} = useOpen();
  const [tab, setTab] = useState(a.readOnly || a.retired ? "transcript" : "tasks");
  const tabs = [
    {key: "tasks", label: "Tasks", count: r8TasksOf(a).length}, {key: "transcript", label: "Transcript"}, {key: "terminal", label: "Terminal"},
    {key: "feed", label: "File feed"}, {key: "processes", label: "Processes"}, {key: "reports", label: "Reports", count: a.reports}, {key: "memories", label: "Memories", count: a.memories},
  ];
  const Body = R8_TAB_BODIES[tab];
  const role = r15Role(a);
  return <div className="r8-open" data-state={a.dot}>
    <div className="r8-ohead">
      <button type="button" className="r8-back" title="Back" aria-label="Back" onClick={onClose}><Icon name="back" size={14} /></button>
      <span className="r8-otitle">{a.title}</span><span className="r8-sub">{[a.name, role].filter(Boolean).join(" · ")}</span>{a.sandboxOff && <R13Sandbox />}
      <span className="grow" />
      <R14AgentActions a={a} />
      <Btn small icon="open" title="Inspector" onClick={() => open("agent", a.id)} />
      <R8Dot a={a} />
    </div>
    {a.retired ? <dl className="r8-lasting"><div><dt>Retired</dt><dd>{a.retiredAt}</dd></div><div><dt>By</dt><dd>{a.retiredBy}</dd></div><div><dt>Reason</dt><dd>{a.retireReason}</dd></div></dl>
      : <div className="r8-band"><InfoBar agentId={a.id} card /></div>}
    <Tabs tabs={tabs} value={tab} onPick={setTab} />
    <div className="r8-obody view-in" key={tab}><Body a={a} /></div>
    {!a.retired && <R8CommandBand a={a} />}
  </div>;
}

Object.assign(window, {FactMenu, R14_HISTORY, R8OpenCard});
