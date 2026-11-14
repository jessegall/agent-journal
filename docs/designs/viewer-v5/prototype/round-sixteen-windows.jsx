// Round sixteen, the windows (messages 121386, 121393, 121395, 121397, 121407, 121458). Loaded after round-sixteen.jsx.
// Replaces by name: R6CardPage, QuestionsWindow (Home Questions window only; the chat keeps QuestionCard), RemindersPage, IntegrationsPage, TeamsPage.
// 1. Questions window: its own card. Head line (number, asking agent as a chip, plan, time, a More menu), the question, its context,
//    options as full-width rows you pick, then Answer. Open and Answered are two section bars, both open at first (121458);
//    an answered card is one quiet, dimmed block. Either bar can be folded.
// 2. Reminders: no 'tells'. The agent is a chip and the next time a value, both on the right edge; every row is the height of the tallest.
// 3. Integrations: the state badge sits in the card's top-right corner; a card lifts on hover without being cut.
// 4. Suggested is a group, not a state: a suggested card has no badge, and the State filter has no Suggested.
// 5. Teams: a badge only when something waits. Newer and Changed are one Update badge; Up to date and Not followed are faint text.

/* ---------- one agent chip, used wherever a row names an agent ---------- */
function R16Agent({name}) { return <span className="r16-agent" title={`Agent ${name}`}><Icon name="agent" size={10} />{name}</span>; }

/* ---------- card pages: as round seven, plus a corner slot at the head's right edge ---------- */
function R6CardPage({title, line, items, icon, iconOf, fields, initial, header, renderState, renderLine, renderExtra, switchable, onSwitch, foot, actions, empty, groupOf, corner}) {
  const [value, setValue] = useState(initial || emptyFilter());
  const [words, setWords] = useState("");
  const [on, setOn] = useState(Object.fromEntries(items.map((i) => [i.id, i.on])));
  const [picked] = useState(() => r7Take(Object.entries(R7_PAGE_OF).find(([, [, t]]) => t === title)?.[0]));
  const toast = useToast();
  const shown = applyFilter(items, fields, picked != null ? emptyFilter() : value, words, (i) => `${i.title} ${i.desc || ""}`);
  const card = (p) => <div key={p.id} className={"card r16-card" + (picked === p.id ? " r7-picked" : "")}>
    <div className="row r16-card-head"><span className="tile-mark r6"><Icon name={iconOf ? iconOf(p) : icon} size={14} /></span>
      <div className="grow" style={{minWidth: 0}}><h3 title={p.title}>{p.title}</h3>{renderState && <div className="r6-card-state r7-whole">{renderState(p, on[p.id])}</div>}</div>
      {corner?.(p) && <span className="r16-corner">{corner(p)}</span>}
      {switchable?.(p) && <Switch on={on[p.id]} onChange={(v) => { setOn({...on, [p.id]: v}); toast(onSwitch(p, v)); }} title={`${on[p.id] ? "Turn off" : "Turn on"} ${p.title}`} />}
    </div>
    <p className="r7-whole" title={p.desc}>{renderLine ? renderLine(p) : p.desc}</p>
    {renderExtra?.(p)}
    {p.fault && <div className="notice bad" style={{padding: "6px 10px"}}>{p.fault}</div>}
    <div className="row" style={{marginTop: "auto"}}>{foot(p)}<span className="grow" />{actions(p).length > 0 && <ActionMenu actions={actions(p)} onDone={toast} />}</div>
  </div>;
  const groups = groupOf ? [...new Set(shown.map(groupOf))] : [""];
  return <div className="page" data-screen-label={title}>
    <PageHeader title={title} line={line}>{header}</PageHeader>
    <div className="r6-fbar"><FilterBar fields={fields} rows={items} value={value} onChange={setValue} words={words} onWords={setWords} shown={shown.length} placeholder={`Search ${title.toLowerCase()}`} /></div>
    <div className="scroll r16-cards" style={{flex: 1, paddingTop: 12}}>
      {!shown.length ? <Empty title={items.length ? "Nothing matches the filters" : empty.title} line={items.length ? null : empty.line} action={items.length ? <Btn small onClick={() => { setValue(emptyFilter()); setWords(""); }}>Clear the filters</Btn> : empty.action} />
        : groups.map((g) => <React.Fragment key={g}>{g && <div className="lr-group" style={{paddingLeft: "var(--inset)"}}>{g}</div>}<div className="cg"><div className="cg-grid">{shown.filter((p) => !groupOf || groupOf(p) === g).map(card)}</div></div></React.Fragment>)}
    </div>
  </div>;
}

/* ---------- 1. the Questions window ---------- */
function Q16Card({q}) {
  const {open} = useOpen();
  const toast = useToast();
  const [state, setState] = useState(q.state || "open");
  const [answer, setAnswer] = useState(q.answer || "");
  const [pick, setPick] = useState(null);
  const [typed, setTyped] = useState("");
  const [elaborated, setElaborated] = useState(false);
  const chosen = typed.trim() || pick;
  const send = () => { if (!chosen) return; setState("answered"); setAnswer(chosen); toast(`Question ${q.id} answered`); };
  const head = <header className="q16-head">
    <button type="button" className="q16-n" onClick={() => open("question", q.id)}>Question {q.id}</button>
    <R16Agent name={q.by} />
    {q.plan && <button type="button" className="q16-ref" onClick={() => open("plan", q.plan)}>Plan {q.plan}</button>}
    <span className="grow" />
    <time className="q16-time">{q.at}</time>
    {state === "open" && <FloatMenu align="right" width={200} button={({toggle, open: on}) => <button type="button" className={"btn icon small q16-more" + (on ? " on" : "")} aria-label="More" title="More" onClick={toggle}><Icon name="more" size={13} /></button>}>{(close) => <>
      <MenuItem icon="chat" off={elaborated} desc={elaborated ? "Asked" : undefined} onClick={() => { setElaborated(true); toast("The agent elaborates"); close(); }}>Elaborate</MenuItem>
      <MenuItem icon="close" onClick={() => { setState("closed"); toast(`Question ${q.id} closed`); close(); }}>Close</MenuItem>
    </>}</FloatMenu>}
  </header>;
  if (state !== "open") return <section className="q16-card done" data-state={state}>
    {head}
    <p className="q16-text">{q.text}</p>
    <p className="q16-answer">{state === "answered" ? <><Icon name="tick" size={12} /><span>{answer}</span></> : <><Icon name="close" size={12} /><span>Closed</span></>}</p>
  </section>;
  return <section className="q16-card" data-state="open">
    {head}
    <p className="q16-text">{q.text}</p>
    {q.context && <p className="q16-context"><Linked text={q.context} /></p>}
    <div className="q16-options" role="radiogroup" aria-label="Options">
      {q.options.map((o) => <button key={o} type="button" role="radio" aria-checked={pick === o && !typed.trim()} className="q16-option" onClick={() => { setPick(o); setTyped(""); }}>
        <i className="q16-ring" /><span className="q16-otext">{o}</span>{o === q.recommended && <span className="q16-rec">Recommended</span>}
      </button>)}
    </div>
    <form className="q16-form" onSubmit={(e) => { e.preventDefault(); send(); }}>
      <input className="text-input q16-input" value={typed} placeholder="Other answer" aria-label="Other answer" onChange={(e) => setTyped(e.target.value)} />
      <Btn variant="primary" small type="submit" disabled={!chosen}>Answer</Btn>
    </form>
  </section>;
}
// both sections start open, so answered questions fill the panel under the open ones; each can be folded
function QuestionsWindow() {
  const live = Q11_QUESTIONS.filter((q) => (q.state || "open") === "open");
  const done = Q11_QUESTIONS.filter((q) => (q.state || "open") !== "open");
  return <div className="q16-list">
    <R16Section icon="questions" label="Open" count={live.length}>
      {live.length ? <div className="q16-cards">{live.map((q) => <Q16Card key={q.id} q={q} />)}</div> : <p className="r16-none">No open questions</p>}
    </R16Section>
    {done.length > 0 && <R16Section icon="tick" label="Answered" count={done.length}>
      <div className="q16-cards">{done.map((q) => <Q16Card key={q.id} q={q} />)}</div>
    </R16Section>}
  </div>;
}
NOW_WINDOWS.questions = QuestionsWindow;

/* ---------- 2. Reminders: when on the left, next time and agent on the right edge, rows of one height ---------- */
const r16Next = (r) => (r.every?.[0] === "tasks" ? "next closed task" : r.every?.[0] === "tool-uses" ? r.next.replace(/^in /, "") : r.next);
const R16_HOLDS = {"task-in-hand": "holds until it has a task", "task-started": "holds until task start", "task-brief-read": "holds until brief read", "task-logged": "holds until task log", "task-closed": "holds until task close", "task-stopped": "holds until task stop", "task-blocks-reviewed": "holds until blocks reviewed"};
function RemindersPage() {
  const [chosen, setChosen] = useState(41);
  const [making, setMaking] = useState(false);
  const toast = useToast();
  const rows = R7_REMINDERS.map((r) => ({...r, title: r.text, desc: [r7When(r), r.block && R16_HOLDS[r.block]].filter(Boolean).join(" · "), num: r.id, group: ""}));
  return <div className="r16-rem"><ListPage title="Reminders" line="Told to the agent that made it, at a time, on an interval, or once" fields={[R6_AGENT_FIELD((r) => r.by, "Agent"), {key: "how", label: "Repeats", options: [["minutes", "Minutes"], ["tool-uses", "Tool uses"], ["tasks", "Closed tasks"], ["once", "Once"]], get: (r) => (r.once ? "once" : r.every?.[0])}, {key: "block", label: "Holds", options: [["yes", "Holds"], ["no", "No hold"]], get: (r) => (r.block ? "yes" : "no")}]} rows={rows} chosen={chosen} onChoose={setChosen}
    header={<Btn variant="primary" small onClick={() => setMaking(true)}>New reminder</Btn>}
    renderMeta={(r) => <><span className="r16-next" title={`Next: ${r.next}`}>{r16Next(r)}</span><R16Agent name={r.by} /></>}
    renderReader={(r) => <Reader key={r.id} term="reminder" item={r} comments={false} head={{row: {term: "reminder", id: r.id}, state: r.state === "blocked" ? "blocked" : undefined, stateWord: "Holding", extra: <R16Agent name={r.by} />, at: `made ${r.made}`}}
      actions={[{group: "Reminder", label: "Copy command", icon: "copy", desc: "reminder make", done: "Command copied"}, {group: "Danger", label: "Delete", icon: "trash", danger: true, desc: "reminder delete", field: {label: "Reason"}, confirm: "Delete"}]}>
      {() => <><Section title="Facts"><Fields rows={[["Agent", <AgentLink name={r.by} />], ["When", r7When(r)], ["Holds", r.block ? <span>{R7_BLOCKS[r.block]}{r.subject && <> <RowLink term="task" id={Number(r.subject)} /></>}</span> : "No"], ["Next", r.next], ["Last", r.last]]} /></Section><Section title="Text"><Markdown text={r.text} /></Section></>}
    </Reader>} /></div>;
}

/* ---------- 3 and 4. Integrations: the state in the corner; Suggested is a group with no badge ---------- */
const R16_SERVER_STATES = [["connected", "Connected"], ["failed", "Failed"]];
function IntegrationsPage() {
  const [making, setMaking] = useState(null);
  const toast = useToast();
  return <><R6CardPage title="Integrations" line="MCP servers the agents may use" items={R7_SERVERS.map((s) => ({...s, fault: s.reason}))} icon="link" groupOf={(s) => (s.state === "suggested" ? "Suggested" : "Installed")}
    fields={[{key: "state", label: "State", options: R16_SERVER_STATES, get: (s) => (s.state === "suggested" ? null : s.state)}, {key: "profile", label: "Profile", options: R6_OPTS(R7_SERVERS, (s) => s.profiles), get: (s) => s.profiles}]}
    header={<Btn variant="primary" small onClick={() => setMaking({})}>Add server</Btn>}
    corner={(s) => s.state === "suggested" ? null : <Badge state={s.state === "failed" ? "failed" : "open"}>{s.state === "failed" ? "Failed" : "Connected"}</Badge>}
    renderState={(s) => s.tools ? <span>{plural(s.tools, "tool")}</span> : s.why ? <span>{s.why}</span> : null}
    renderLine={(s) => <span className="mono" style={{fontSize: 11.5}}>{s.target}</span>}
    foot={(s) => s.state === "suggested" ? <Btn small variant="primary" title="mcp install" onClick={() => toast(`${s.title} installed`)}>Install</Btn> : s.state === "failed" ? <Btn small title="mcp check" onClick={() => toast(`Checking ${s.title}`)}>Check</Btn> : <Btn small onClick={() => setMaking({edit: s})}>Settings</Btn>}
    actions={(s) => s.state === "suggested" ? [] : [{group: "Server", label: "Settings", icon: "gear", run: () => { setMaking({edit: s}); return false; }}, {group: "Server", label: "Check", icon: "back", desc: "mcp check"}, {group: "Server", label: "Secret", icon: "key", desc: "mcp key", field: {label: "Secret", options: R7_SECRETS.filter((x) => !x.deleted).map((x) => [String(x.id), x.title])}, confirm: "Give"}, {group: "Danger", label: "Remove", icon: "trash", danger: true, desc: "mcp remove", field: {label: "Reason"}, confirm: "Remove"}]}
    empty={{title: "No servers yet", line: "An MCP server gives agents more tools", action: <Btn small variant="primary" onClick={() => setMaking({})}>Add server</Btn>}} />
    {making && (making.edit ? <R7ServerDialog s={making.edit} onClose={() => setMaking(null)} />
      : <CreateDialog title="Add server" sub="Checked once it is added" submit="Add" onClose={() => setMaking(null)} onMade={(v) => toast(`${v.name} added`)} command={(v) => `journal mcp add ${v.name || "…"} ${v.target || "…"}`}
        check={(v) => (R7_SERVERS.some((s) => s.id === v.name) ? {name: `A server is already called ${v.name}.`} : {})}
        fields={[{key: "name", label: "Name", required: true, placeholder: "sentry"}, {key: "target", label: "Command or address", required: true, placeholder: "npx @sentry/mcp-server"}]} />)}
  </>;
}

/* ---------- 5. Teams: a badge only for Update; normal states are faint text ---------- */
// the word table of round fifteen turned "Not followed" into "Unfollowed" and kept Newer and Changed apart: those entries go
delete R15_TEXT["Not followed"]; delete R15_TEXT["Newer in the library"]; delete R15_TEXT["Changed here"];
const r16TeamState = (i) => (i.follow !== "followed" || i.state === "Not followed" ? "unfollowed" : i.state === "Up to date" ? "current" : "update");
const R16_TEAM_WORDS = {update: "Update", current: "Up to date", unfollowed: "Not followed"};
const r16TeamField = R6_TEAM_FIELDS.find((f) => f.key === "state");
if (r16TeamField) Object.assign(r16TeamField, {label: "State", options: Object.entries(R16_TEAM_WORDS), get: r16TeamState});
function R16TeamMark({i}) {
  const s = r16TeamState(i);
  if (s === "update") return <Badge state="paused"><span title={i.state === "Changed here" ? "Changed here: share it" : `Version ${i.there} in the library`}>Update</span></Badge>;
  return <span className="r16-quiet">{R16_TEAM_WORDS[s]}</span>;
}
function TeamsPage() {
  const [tab, setTab] = useState(() => (r7Peek(["user"]) ? "users" : "library"));
  const [chosen, setChosen] = useState(1);
  const [publishing, setPublishing] = useState(false);
  const toast = useToast();
  const line = <span>Library <span className="mono">{R6_TEAM.library}</span> · {R6_TEAM.state} · last reached {R6_TEAM.last}</span>;
  const header = <><Btn small onClick={() => toast("Synced")} title="library sync">Sync</Btn><Btn small variant="primary" onClick={() => setPublishing(true)}>Share</Btn></>;
  const tabs = <Tabs tabs={[{key: "library", label: "Library", count: R6_TEAM_ITEMS.length}, {key: "here", label: "Shared from here", count: 2}, {key: "users", label: "Users", count: R6_TEAM_USERS.length}]} value={tab} onPick={(t) => { setTab(t); setChosen(t === "users" ? "jesse" : 1); }} />;
  const items = (tab === "here" ? R6_TEAM_ITEMS.filter((i) => i.by === "Jesse" || i.by === "main") : R6_TEAM_ITEMS).map((i) => ({...i, desc: `${i.kind} · shared by ${i.by}`, group: i.kind + "s"}));
  if (tab === "users") return <ListPage key="users" title="Teams" pickTerm="user" line={line} header={header} fields={[{key: "role", label: "Role", options: [["Owner", "Owner"], ["Member", "Member"]], get: (u) => u.role}]} rows={R6_TEAM_USERS.map((u) => ({...u, desc: `${u.role} · shares ${u.shares}`}))} chosen={chosen} onChoose={setChosen} placeholder="Search users"
    renderMeta={(u) => u.last} renderReader={(u) => <Reader key={u.id} term="user" item={u} comments={false} head={{extra: <span>{u.role}</span>, at: `last seen ${u.last}`}} actions={[{group: "User", label: "Role", icon: "user", desc: "set_library_role", field: {label: "Role", options: [["Owner", "Owner"], ["Member", "Member"]], value: u.role}, confirm: "Save"}, {group: "Danger", label: "Remove", icon: "trash", danger: true, desc: "remove_library_user", field: {label: "Reason"}}]}>{() => <><Fields rows={[["Role", u.role], ["Shares", plural(u.shares, "item")], ["Last seen", u.last]]} /><Section title="Shared"><div className="r6-list">{R6_TEAM_ITEMS.filter((i) => i.by === u.title).map((i) => <div key={i.id} className="link-row" style={{gridTemplateColumns: "10ch minmax(0, 1fr)"}}><span className="faint">{i.kind}</span><span>{i.title}</span></div>)}</div></Section></>}</Reader>}>{tabs}</ListPage>;
  return <><ListPage key={tab} title="Teams" pickTerm="library" line={line} header={header} fields={R6_TEAM_FIELDS} rows={items} chosen={chosen} onChoose={setChosen} placeholder="Search the library"
    renderMeta={(i) => <R16TeamMark i={i} />}
    renderReader={(i) => { const s = r16TeamState(i); return <Reader key={i.id} term="library" item={i} comments={false} head={{extra: <><span>{i.kind}</span><span className="sep">·</span><span>shared by <R7Person name={i.by} /></span></>, at: i.at}}
      primary={s === "unfollowed" ? {label: "Follow", done: `${i.title} followed`} : i.state === "Newer in the library" ? {label: `Take version ${i.there}`, done: `${i.title} at version ${i.there}`} : i.state === "Changed here" ? {label: "Share change", done: "Change shared"} : null}
      actions={[{group: "Library", label: "Sync", icon: "back", desc: "library sync"}, {group: "Library", label: "Versions", icon: "clock", desc: "library versions"}, ...(s !== "unfollowed" ? [{group: "Library", label: "Unfollow", icon: "stop", desc: "library leave", field: {label: "Reason"}, confirm: "Unfollow"}] : [])]}
      tabs={[{key: "facts", label: "Details", render: () => <Fields rows={[["Kind", i.kind], ["Library", `version ${i.there}`], ["Here", typeof i.here === "number" ? `version ${i.here}` : i.here], ["State", s === "update" ? (i.state === "Changed here" ? "Update: changed here" : "Update: newer in the library") : R16_TEAM_WORDS[s]], ["Shared by", <R7Person name={i.by} />]]} />}, {key: "compare", label: "Compare", render: () => s !== "update" ? <p className="muted" style={{margin: 0}}>{s === "current" ? "Same as the library" : "No copy here"}</p> : <div className="r6-diff"><div className="hunk">{i.state === "Changed here" ? "library → here" : "here → library"}</div><div className="del">- Run the full suite at each phase end.</div><div className="add">+ Run the full suite once, at the end of the plan.</div><div>  Each phase has its own checkpoint.</div></div>}]}>
      {() => null}
    </Reader>; }}>{tabs}</ListPage>
    {publishing && <CreateDialog title="Share" sub={`To ${R6_TEAM.library}`} submit="Share" onClose={() => setPublishing(false)} onMade={(v) => toast(`${v.item} shared`)} command={(v) => `journal library share ${v.kind} ${v.item}`}
      fields={[{key: "kind", label: "Kind", kind: "select", options: [["skill", "Skill"], ["template", "Template"], ["rule", "Rule"]], required: true, half: true}, {key: "item", label: "Which", kind: "select", options: [["journal-documents", "journal-documents"], ["4", "Template 4"], ["19", "Rule 19"]], required: true, half: true}]} />}
  </>;
}

Object.assign(window, {R16Agent, R6CardPage, Q16Card, QuestionsWindow, RemindersPage, IntegrationsPage, TeamsPage});
