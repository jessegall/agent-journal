// Rounds sixteen and seventeen, the windows (messages 121386, 121393, 121395, 121397, 121407, 121458; round 17: reports 1411, 1412, doc 1289).
// Loaded after round-sixteen.jsx. Replaces by name: R6CardPage, QuestionsWindow (Home Questions window only; the chat keeps QuestionCard),
// RemindersPage, IntegrationsPage, TeamsPage.
// 1. Questions window: its own card. Head line: number, asking agent as a chip, plan, then More and the time, the time always at the right edge.
//    Options are plain rows you pick, no box inside the card. Open and Done are two section bars, both open at first (121458).
//    A done card is quiet by its colours, never by opacity.
// 2. Reminders: every row is one height (121393): number, the title in at most two lines ending in an ellipsis, the next time at the right edge;
//    line two the repeat rule (short words, never cut) and the agent chip at its right end. The whole title is in the reader.
// 3. Cards: a box only for a state that needs the person. Integrations has no Connected badge; a failed server says so once, in its notice.
//    Every card has the same lines in the same places, and cards size to their content in a grid that fills the width.
//    The card foot holds only the one action that waits (Install, Check, Fill, Allow); everything else is in Actions.
// 4. Suggested is a group, not a state: a suggested card has no badge, and the State filter has no Suggested.
// 5. Teams: a badge only when something waits (Update). Up to date and Not followed are faint text. The State filter is built on the
//    team field 'state' (R6_TEAM_FIELDS). Which way an update goes is written under the name, never only in a tooltip.

/* ---------- one agent chip, used wherever a row names an agent ---------- */
function R16Agent({name}) { return <span className="r16-agent"><Icon name="agent" size={10} />{name}</span>; }

/* ---------- card pages ---------- */
function R6CardPage({title, items, icon, iconOf, fields, initial, header, renderState, renderLine, renderExtra, switchable, onSwitch, foot, actions, empty, groupOf, corner}) {
  const [value, setValue] = useState(initial || emptyFilter());
  const [words, setWords] = useState("");
  const [on, setOn] = useState(Object.fromEntries(items.map((i) => [i.id, i.on])));
  const [picked] = useState(() => r7Take(Object.entries(R7_PAGE_OF).find(([, [, t]]) => t === title)?.[0]));
  const toast = useToast();
  const shown = applyFilter(items, fields, picked != null ? emptyFilter() : value, words, (i) => `${i.title} ${i.desc || ""}`);
  const card = (p) => { const footing = foot?.(p); const acts = actions(p); return <div key={p.id} className={"card r16-card" + (picked === p.id ? " r7-picked" : "")}>
    <div className="row r16-card-head">
      <div className="grow" style={{minWidth: 0}}><h3 title={p.title}>{p.title}</h3>{renderState && <div className="r16-card-state">{renderState(p, on[p.id])}</div>}</div>
      {corner?.(p) && <span className="r16-corner">{corner(p)}</span>}
      {switchable?.(p) && <Switch on={on[p.id]} onChange={(v) => { setOn({...on, [p.id]: v}); toast(onSwitch(p, v)); }} title={p.title} />}
    </div>
    <p className="r16-card-line">{renderLine ? renderLine(p) : p.desc}</p>
    {renderExtra?.(p)}
    {p.fault && <div className="notice bad r16-fault">{p.fault}</div>}
    {(footing || acts.length > 0) && <div className="r16-card-foot">{footing}<span className="grow" />{acts.length > 0 && <ActionMenu actions={acts} onDone={toast} />}</div>}
  </div>; };
  const groups = groupOf ? [...new Set(shown.map(groupOf))] : [""];
  return <div className="page" data-screen-label={title}>
    <PageHeader title={title}>{header}</PageHeader>
    <div className="r6-fbar"><FilterBar fields={fields} rows={items} value={value} onChange={setValue} words={words} onWords={setWords} shown={shown.length} placeholder="Search" /></div>
    <div className="scroll r16-cards" style={{flex: 1, paddingTop: 12}}>
      {!shown.length ? <Empty title={items.length ? "No match" : empty.title} action={items.length ? <Btn small onClick={() => { setValue(emptyFilter()); setWords(""); }}>Clear</Btn> : empty.action} />
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
  // More sits before the time, so the time ends at the card's right edge on every card, open or done
  const head = <header className="q16-head">
    <button type="button" className="q16-n" title={`Question ${q.id}`} onClick={() => open("question", q.id)}>{q.id}</button>
    <R16Agent name={q.by} />
    {q.plan && <button type="button" className="q16-ref" onClick={() => open("plan", q.plan)}>Plan {q.plan}</button>}
    <span className="grow" />
    {state === "open" && <FloatMenu align="right" width={200} button={({toggle, open: on}) => <button type="button" className={"btn icon small q16-more" + (on ? " on" : "")} aria-label="More" title="More" onClick={toggle}><Icon name="more" size={13} /></button>}>{(close) => <>
      <MenuItem icon="chat" off={elaborated} desc={elaborated ? "Asked" : undefined} onClick={() => { setElaborated(true); toast("Elaboration asked"); close(); }}>Elaborate</MenuItem>
      <MenuItem icon="close" onClick={() => { setState("closed"); toast(`Question ${q.id} closed`); close(); }}>Close</MenuItem>
    </>}</FloatMenu>}
    <time className="q16-time">{q.at}</time>
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
        <i className="q16-ring" /><span className="q16-otext">{o}</span>{o === q.recommended && <span className="q16-rec" aria-label="Recommended"><Icon name="star" size={11} /></span>}
      </button>)}
    </div>
    <form className="q16-form" onSubmit={(e) => { e.preventDefault(); send(); }}>
      <input className="text-input q16-input" value={typed} placeholder="Other" aria-label="Other answer" onChange={(e) => setTyped(e.target.value)} />
      <Btn variant="primary" small type="submit" disabled={!chosen}>Answer</Btn>
    </form>
  </section>;
}
// both sections start open; the tab already counts the open questions, so the Open bar has no count; Done holds answered and closed
function QuestionsWindow() {
  const live = Q11_QUESTIONS.filter((q) => (q.state || "open") === "open");
  const done = Q11_QUESTIONS.filter((q) => (q.state || "open") !== "open");
  return <div className="q16-list">
    <R16Section icon="questions" label="Open">
      {live.length ? <div className="q16-cards">{live.map((q) => <Q16Card key={q.id} q={q} />)}</div> : <p className="r16-none">None</p>}
    </R16Section>
    {done.length > 0 && <R16Section icon="tick" label="Done" count={done.length}>
      <div className="q16-cards">{done.map((q) => <Q16Card key={q.id} q={q} />)}</div>
    </R16Section>}
  </div>;
}
NOW_WINDOWS.questions = QuestionsWindow;

/* ---------- 2. Reminders: every row one height ---------- */
// the rule says how it repeats in a few words; a number the next-time column already gives is not said again
const r16Rule = (r) => (r.once ? "Once" : r.every[0] === "minutes" ? `Every ${r.every[1]} min` : r.every[0] === "tasks" ? (r.every[1] === 1 ? "Each closed task" : `Every ${r.every[1]} closed tasks`) : `Every ${r.every[1]} tool uses`);
const r16Next = (r) => (r.every?.[0] === "tasks" ? "" : r.every?.[0] === "tool-uses" ? r.next : r.next);
const R16_HOLDS = {"task-in-hand": "Until it has a task", "task-started": "Until task start", "task-brief-read": "Until brief read", "task-logged": "Until task log", "task-closed": "Until task close", "task-stopped": "Until task stop", "task-blocks-reviewed": "Until blocks reviewed"};
function RemindersPage() {
  const [chosen, setChosen] = useState(41);
  const [making, setMaking] = useState(false);
  const toast = useToast();
  const rows = R7_REMINDERS.map((r) => ({...r, title: r.text, desc: <><span className="r16-rule">{r16Rule(r)}</span>{r.block && <span className="r16-holds" aria-label="Holds the agent"><Icon name="pause" size={10} />Holds</span>}</>, num: r.id, group: ""}));
  return <div className="r16-rem"><ListPage title="Reminders" listWidth={460} fields={[R6_AGENT_FIELD((r) => r.by, "Agent"), {key: "how", label: "Repeats", options: [["minutes", "Minutes"], ["tool-uses", "Tool uses"], ["tasks", "Closed tasks"], ["once", "Once"]], get: (r) => (r.once ? "once" : r.every?.[0])}, {key: "block", label: "Holds", options: [["yes", "Holds"], ["no", "No hold"]], get: (r) => (r.block ? "yes" : "no")}]} rows={rows} chosen={chosen} onChoose={setChosen}
    textOf={(r) => `${r.id} ${r.text} ${r.by}`}
    header={<Btn variant="primary" small onClick={() => setMaking(true)}>New reminder</Btn>}
    renderMeta={(r) => <><span className="r16-next">{r16Next(r)}</span><R16Agent name={r.by} /></>}
    renderReader={(r) => <Reader key={r.id} term="reminder" item={r} comments={false} head={{row: {term: "reminder", id: r.id}, state: r.state === "blocked" ? "blocked" : undefined, stateWord: "Holds", extra: <R16Agent name={r.by} />, at: `made ${r.made}`}}
      actions={[{group: "Reminder", label: "Copy command", icon: "copy", desc: "reminder make", done: "Command copied"}, {group: "Danger", label: "Delete", icon: "trash", danger: true, desc: "reminder delete", field: {label: "Reason"}, confirm: "Delete"}]}>
      {() => <Section title="Facts"><Fields rows={[["Repeats", r7When(r)], r.block && ["Holds", <span>{R16_HOLDS[r.block]}{r.subject && <> · <RowLink term="task" id={Number(r.subject)} /></>}</span>], ["Next", r.next], ["Last", r.last]]} /></Section>}
    </Reader>} /></div>;
}

/* ---------- 3 and 4. Integrations: no badge for Connected, a failed server said once, Suggested is a group ---------- */
const R16_SERVER_STATES = [["connected", "Connected"], ["failed", "Failed"]];
function IntegrationsPage() {
  const [making, setMaking] = useState(null);
  const toast = useToast();
  return <><R6CardPage title="Integrations" items={R7_SERVERS.map((s) => ({...s, fault: s.reason}))} icon="link" groupOf={(s) => (s.state === "suggested" ? "Suggested" : "Installed")}
    fields={[{key: "state", label: "State", options: R16_SERVER_STATES, get: (s) => (s.state === "suggested" ? null : s.state)}, {key: "profile", label: "Profile", options: R6_OPTS(R7_SERVERS, (s) => s.profiles), get: (s) => s.profiles}]}
    header={<Btn variant="primary" small onClick={() => setMaking({})}>Add server</Btn>}
    renderState={(s) => <span>{s.state === "suggested" ? s.why : s.tools ? plural(s.tools, "tool") : "—"}</span>}
    renderLine={(s) => <span className="mono">{s.target}</span>}
    foot={(s) => s.state === "suggested" ? <Btn small variant="primary" title="mcp install" onClick={() => toast(`${s.title} installed`)}>Install</Btn> : s.state === "failed" ? <Btn small title="mcp check" onClick={() => toast(`Checking ${s.title}`)}>Check</Btn> : null}
    actions={(s) => s.state === "suggested" ? [] : [{group: "Server", label: "Settings", icon: "gear", run: () => { setMaking({edit: s}); return false; }}, ...(s.state === "failed" ? [] : [{group: "Server", label: "Check", icon: "back", desc: "mcp check"}]), {group: "Server", label: "Secret", icon: "key", desc: "mcp key", field: {label: "Secret", options: R7_SECRETS.filter((x) => !x.deleted).map((x) => [String(x.id), x.title])}, confirm: "Give"}, {group: "Danger", label: "Remove", icon: "trash", danger: true, desc: "mcp remove", field: {label: "Reason"}, confirm: "Remove"}]}
    empty={{title: "No servers", action: <Btn small variant="primary" onClick={() => setMaking({})}>Add server</Btn>}} />
    {making && (making.edit ? <R7ServerDialog s={making.edit} onClose={() => setMaking(null)} />
      : <CreateDialog title="Add server" submit="Add" onClose={() => setMaking(null)} onMade={(v) => toast(`${v.name} added`)} command={(v) => `journal mcp add ${v.name || "…"} ${v.target || "…"}`}
        check={(v) => (R7_SERVERS.some((s) => s.id === v.name) ? {name: "Name taken"} : {})}
        fields={[{key: "name", label: "Name", required: true, placeholder: "sentry"}, {key: "target", label: "Command or address", required: true, placeholder: "npx @sentry/mcp-server"}]} />)}
  </>;
}

/* ---------- 5. Teams: a badge only for Update; normal states are faint text ---------- */
const r16TeamState = (i) => (i.follow !== "followed" || i.state === "Not followed" ? "unfollowed" : i.state === "Up to date" ? "current" : "update");
const R16_TEAM_WORDS = {update: "Update", current: "Up to date", unfollowed: "Not followed"};
const r16TeamWay = (i) => (r16TeamState(i) !== "update" ? "" : i.state === "Changed here" ? "Changed here" : "Newer in library");
function R16TeamMark({i}) {
  const s = r16TeamState(i);
  return s === "update" ? <Badge state="update">Update</Badge> : <span className="r16-quiet">{R16_TEAM_WORDS[s]}</span>;
}
function TeamsPage() {
  const [tab, setTab] = useState(() => (r7Peek(["user"]) ? "users" : "library"));
  const [chosen, setChosen] = useState(1);
  const [publishing, setPublishing] = useState(false);
  const toast = useToast();
  const mine = R6_TEAM_ITEMS.filter((i) => i.by === "Jesse" || i.by === "main");
  const header = <><Btn small onClick={() => toast("Synced")} title="library sync">Sync</Btn><Btn small variant="primary" onClick={() => setPublishing(true)}>Share</Btn></>;
  const tabs = <Tabs tabs={[{key: "library", label: "Library", count: R6_TEAM_ITEMS.length}, {key: "here", label: "Shared from here", count: mine.length}, {key: "users", label: "Users", count: R6_TEAM_USERS.length}]} value={tab} onPick={(t) => { setTab(t); setChosen(t === "users" ? "jesse" : 1); }} />;
  // the group names the kind, so a row says only which way an update goes and who shared it
  const items = (tab === "here" ? mine : R6_TEAM_ITEMS).map((i) => ({...i, desc: [r16TeamWay(i), i.by].filter(Boolean).join(" · "), group: i.kind + "s"}));
  if (tab === "users") return <ListPage key="users" title="Teams" pickTerm="user" header={header} fields={[{key: "role", label: "Role", options: [["Owner", "Owner"], ["Member", "Member"]], get: (u) => u.role}]} rows={R6_TEAM_USERS.map((u) => ({...u, desc: `${u.role} · ${plural(u.shares, "share")}`}))} chosen={chosen} onChoose={setChosen} placeholder="Search"
    renderMeta={(u) => u.last} renderReader={(u) => <Reader key={u.id} term="user" item={u} comments={false} head={{extra: <span>{u.role}</span>, at: `seen ${u.last}`}} actions={[{group: "User", label: "Role", icon: "user", desc: "set_library_role", field: {label: "Role", options: [["Owner", "Owner"], ["Member", "Member"]], value: u.role}, confirm: "Save"}, {group: "Danger", label: "Remove", icon: "trash", danger: true, desc: "remove_library_user", field: {label: "Reason"}}]}>{() => <Section title="Shared"><div className="r6-list">{R6_TEAM_ITEMS.filter((i) => i.by === u.title).map((i) => <div key={i.id} className="link-row" style={{gridTemplateColumns: "10ch minmax(0, 1fr)"}}><span className="faint">{i.kind}</span><span>{i.title}</span></div>)}</div></Section>}</Reader>}>{tabs}</ListPage>;
  return <><ListPage key={tab} title="Teams" pickTerm="library" header={header} fields={R6_TEAM_FIELDS} rows={items} chosen={chosen} onChoose={setChosen} placeholder="Search"
    renderMeta={(i) => <R16TeamMark i={i} />}
    renderReader={(i) => { const s = r16TeamState(i); const same = i.here === i.there; return <Reader key={i.id} term="library" item={i} comments={false} head={{state: s === "update" ? "update" : undefined, stateWord: r16TeamWay(i), extra: <span>by <R7Person name={i.by} /></span>, at: i.at}}
      primary={s === "unfollowed" ? {label: "Follow", done: `${i.title} followed`} : i.state === "Newer in the library" ? {label: "Update", done: `${i.title} at version ${i.there}`} : i.state === "Changed here" ? {label: "Share", done: "Change shared"} : null}
      actions={[{group: "Library", label: "Versions", icon: "clock", desc: "library versions"}, ...(s !== "unfollowed" ? [{group: "Library", label: "Unfollow", icon: "stop", desc: "library leave", field: {label: "Reason"}, confirm: "Unfollow"}] : [])]}
      tabs={[{key: "facts", label: "Details", render: () => <Fields rows={same ? [["Version", String(i.there)]] : [["Library", `version ${i.there}`], ["Here", typeof i.here === "number" ? `version ${i.here}` : "—"]]} />}, ...(s === "update" ? [{key: "compare", label: "Compare", render: () => <div className="r6-diff"><div className="hunk">{i.state === "Changed here" ? "library → here" : "here → library"}</div><div className="del">- Run the full suite at each phase end.</div><div className="add">+ Run the full suite once, at the end of the plan.</div><div>  Each phase has its own checkpoint.</div></div>}] : [])]}>
      {() => null}
    </Reader>; }}>{tabs}</ListPage>
    {publishing && <CreateDialog title="Share" sub={R6_TEAM.library} submit="Share" onClose={() => setPublishing(false)} onMade={(v) => toast(`${v.item} shared`)} command={(v) => `journal library share ${v.kind} ${v.item}`}
      fields={[{key: "kind", label: "Kind", kind: "select", options: [["skill", "Skill"], ["template", "Template"], ["rule", "Rule"]], required: true, half: true}, {key: "item", label: "Item", kind: "select", options: [["journal-documents", "journal-documents"], ["4", "Template 4"], ["19", "Rule 19"]], required: true, half: true}]} />}
  </>;
}

Object.assign(window, {R16Agent, R6CardPage, Q16Card, QuestionsWindow, RemindersPage, IntegrationsPage, TeamsPage, r16TeamState, R16_TEAM_WORDS});
