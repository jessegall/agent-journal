// Round four (messages 120138, 120143, 120155, 120159).
// 1. Home as the current viewer draws it: the agent bar, the information bar, pane tabs, the chat and its bubbles, the terminal and the file feed.
//    The agent bar and the information bar show on Home only. Each piece names the build file it copies.
// 3. No text wraps: a row's kind and number stand in their own columns (RefCols), and every row is one line cut with an ellipsis.
// 4. The Plans window with less colour and its state in a column of its own; the Tasks window with a Tags column.
// 5. The dropdowns of the information bar (context, model and effort, cost and pricing) redesigned; the agent inspector's one bar and its memories.
// 6. Reader calls primary.run, and Search's Open goes through it.

Object.assign(ICONS, {
  allowance: "M2.5 13h11M3.5 13V8M6.5 13V5M9.5 13V9M12.5 13V6.5",
  model: "M8 2l5.5 3v6L8 14l-5.5-3V5zM8 8l5.5-3M8 8v6M8 8L2.5 5",
  heart: "M8 13.5S2.5 10 2.5 6.2A2.7 2.7 0 0 1 8 5a2.7 2.7 0 0 1 5.5 1.2C13.5 10 8 13.5 8 13.5z",
  weight: "M5 5.5h6l2 7.5H3zM6.5 5.5a1.5 1.5 0 1 1 3 0",
  book: "M3 3h4a1.5 1.5 0 0 1 1 .5A1.5 1.5 0 0 1 9 3h4v9H9a1 1 0 0 0-1 1 1 1 0 0 0-1-1H3z",
  clip: "M10.5 5.5L6 10a1.4 1.4 0 0 0 2 2l5-5a2.8 2.8 0 0 0-4-4L4 8a4.2 4.2 0 0 0 6 6l3.5-3.5",
  agents: "M6 4a2 2 0 1 1 0 4a2 2 0 1 1 0-4M11 5a1.6 1.6 0 1 1 0 3.2a1.6 1.6 0 1 1 0-3.2M2 13a4 4 0 0 1 8 0M10 10.5a3 3 0 0 1 4.5 2.5",
  resume: "M5 3l8 5-8 5z",
  dots: "M8 3.5h.01M8 8h.01M8 12.5h.01",
});

/* ---------- one row's kind and number, each in its own column ----------
   A span with the link role, as RowLink is, so it may stand inside a row that is itself a button. */
function RefCols({term, id, kind}) {
  const {open} = useOpen();
  const word = kind || TERM_WORDS[term] || term;
  const go = (e) => { e.stopPropagation(); e.preventDefault(); open(term, id); };
  return <span role="link" tabIndex={0} className="rc" title={`Open ${word} ${id}`} onClick={go} onKeyDown={(e) => e.key === "Enter" && go(e)}><span className="k">{word}</span><span className="n">{id}</span></span>;
}

/* ---------- the facts of an agent, as the usage read gives them ---------- */
const SESSIONS = {
  1: {program: "Claude Code", session: "3f2a91", allowance: 41, allowanceTitle: "5-hour", resets: "16:00", weekly: 18, context: 62, tokens: 124, window: 200, capped: false, compacted: "2 h ago", compactions: 3, model: "Opus 5.5", effort: "high", cost: 4.12, branch: "version-5", jobs: 0, skills: 14, fitness: 92, load: 3},
  4: {program: "Claude Code", session: "9c04be", allowance: 41, allowanceTitle: "5-hour", resets: "16:00", weekly: 18, context: 31, tokens: 62, window: 200, capped: false, compacted: "never", compactions: 0, model: "Sonnet 5.5", effort: "medium", cost: 1.86, branch: "worker-4/9682", jobs: 0, skills: 9, fitness: 71, load: 1},
};
const sessionOf = (id) => SESSIONS[id] || {...SESSIONS[4], session: "a71d03", cost: 0.42, context: AGENTS.find((a) => a.id === id)?.context ?? 0, model: AGENTS.find((a) => a.id === id)?.model ?? "Opus 5.5", fitness: 88};
const COSTS = [{agent: "main", profile: "builder", model: "Opus 5.5", cost: 4.12}, {agent: "helper-851", profile: "designer", model: "Opus 5.5", cost: 3.07}, {agent: "worker-4", profile: "worker", model: "Sonnet 5.5", cost: 1.86}, {agent: "worker-7", profile: "worker", model: "Sonnet 5.5", cost: 1.24}, {agent: "reviewer-3", profile: "reviewer", model: "Opus 5.5", cost: 0.96}, {agent: "helper-844", profile: "researcher", model: "Haiku 5.5", cost: 0.18}];
// sample prices of the prototype, per million tokens; the build reads the journal's own price table
const MODELS = [
  {name: "Opus 5.5", id: "claude-opus-5-5", window: "1M", input: 5, output: 25, write: 6.25, read: 0.5},
  {name: "Sonnet 5.5", id: "claude-sonnet-5-5", window: "1M", input: 3, output: 15, write: 3.75, read: 0.3},
  {name: "Haiku 5.5", id: "claude-haiku-5-5", window: "200k", input: 1, output: 5, write: 1.25, read: 0.1},
  {name: "Fable 5.2", id: "claude-fable-5-2", window: "1M", input: 10, output: 50, write: 12.5, read: 1},
];
const EFFORTS = [["low", "Low"], ["medium", "Medium"], ["high", "High"], ["xhigh", "Extra high"], ["max", "Max"]];
const dollars = (n) => `$${n.toFixed(2)}`;
const rate = (n) => (Number.isInteger(n) ? `$${n}` : `$${n.toFixed(2)}`);

/* ---------- the agent bar: AgentBar.vue, unchanged ---------- */
function HomeAgentBar() {
  const {open} = useOpen();
  const [paused, setPaused] = useState(false);
  const t = TASKS.find((x) => x.id === AGENTS[0].task);
  const helpers = AGENTS.filter((a) => a.role !== "Main agent" && a.state !== "open");
  return <div className="now-agent" data-agent-bar>
    <span className={"now-dot " + (paused ? "paused" : "running")} />
    <strong>{paused ? "Paused" : "Working"}</strong>
    <button type="button" className="now-task" title={t.title} onClick={() => open("task", t.id)}>Task {t.id}: {t.title}</button>
    <button type="button" className="now-plan" title={`Open plan ${t.plan}`} onClick={() => open("plan", t.plan)}>Plan {t.plan}</button>
    <span className="grow" />
    <button type="button" className={"btn icon now-pause" + (paused ? " paused" : "")} aria-label={paused ? "Resume" : "Pause"} title={paused ? "Resume: the agent carries on where it stopped" : "Pause: only journal commands, read tools and read commands run until you resume it"} onClick={() => setPaused(!paused)}><Icon name={paused ? "resume" : "pause"} size={16} /></button>
    <span className="now-divider" />
    <button type="button" className="now-count" aria-label="Process queue" title="Process queue: processes running now" onClick={() => open("output", 490026)}><Icon name="term" size={12} />1</button>
    <Menu width={280} button={({toggle}) => <button type="button" className="now-count" aria-label="Helpers" title="Running: helpers" onClick={toggle}><Icon name="agents" size={12} />{helpers.length}</button>}>{(close) => <>
      <div className="menu-label">Running beside main</div>
      {helpers.map((a) => <MenuItem key={a.id} icon="agent" desc={a.task ? `Task ${a.task}` : a.role} hint={STATE_WORDS[a.state]} onClick={() => { open("agent", a.id); close(); }}>{a.name}</MenuItem>)}
    </>}</Menu>
  </div>;
}

/* ---------- the information bar: InformationBar.vue; on Home and, as one live bar, in the agent inspector ---------- */
function FactMenu({width = 300, align = "left", fact, title, className = "", children}) {
  return <Menu align={align} width={width} button={({toggle, open}) => <button type="button" className={"now-fact " + className + (open ? " on" : "")} title={title} aria-haspopup="menu" aria-expanded={open} onClick={toggle}>{fact}</button>}>{children}</Menu>;
}
function InfoBar({agentId = 1, card, end}) {
  const s = sessionOf(agentId);
  const [model, setModel] = useState(s.model);
  const [effort, setEffort] = useState(s.effort);
  const pick = {model, effort, setModel, setEffort};
  return <div className={"now-info" + (card ? " card" : "")} data-information-bar>
    <FactMenu width={240} className="lead" title={`Session ${s.session}: stop it`} fact={<><Icon name="agents" size={12} /> {s.program}</>}>{(close) => <AgentStopMenu close={close} />}</FactMenu>
    <FactMenu width={280} title={`${s.allowance}% of the plan's ${s.allowanceTitle} allowance used, starts again ${s.resets}`} fact={<><Icon name="allowance" size={12} /> <span className="now-gauge usage"><span style={{width: s.allowance + "%"}} /></span> {s.allowance}%</>}>{() => <AllowanceDropdown s={s} />}</FactMenu>
    <FactMenu width={300} title={`Context ${s.context}% full: clear or compact it`} fact={<><Icon name="gauge" size={12} /> <span className="now-gauge"><span style={{width: s.context + "%"}} /></span> {s.context}%</>}>{(close) => <ContextDropdown s={s} close={close} />}</FactMenu>
    <FactMenu width={360} title={`${model}: change the model`} fact={<><Icon name="model" size={12} /> {model}</>}>{(close) => <ModelDropdown pick={pick} close={close} />}</FactMenu>
    <FactMenu width={240} title="Reasoning effort: change it" fact={<><Icon name="bolt" size={12} /> {effort}</>}>{(close) => <EffortDropdown pick={pick} close={close} />}</FactMenu>
    <FactMenu width={360} title="The predicted API price of this session: open its breakdown" fact={dollars(s.cost)}>{() => <CostDropdown s={s} />}</FactMenu>
    <span className="now-fact" title="Current branch"><Icon name="branch" size={12} /> {s.branch}</span>
    {!card && <FactMenu width={260} className={s.jobs ? "" : "none"} title="Jobs the agent scheduled for itself" fact={<><Icon name="clock" size={12} /> {s.jobs}</>}>{() => <div className="dd"><div className="dd-head"><span>Scheduled jobs</span></div><div className="dd-sub">The agent has scheduled nothing for itself</div></div>}</FactMenu>}
    <FactMenu width={280} title="View skills read by this agent" fact={<><Icon name="book" size={12} /> {s.skills}</>}>{(close) => <><div className="menu-label">Skills read: {s.skills}</div>{SKILLS.slice(0, 5).map((k) => <MenuItem key={k.id} icon="skill" onClick={close}>{k.title}</MenuItem>)}<div className="menu-sep" /><MenuItem icon="open" onClick={close}>Browse every skill</MenuItem></>}</FactMenu>
    <FactMenu width={260} className={s.fitness < 75 ? "low" : ""} title="View the agent’s performance measures" fact={<><Icon name="heart" size={12} /> {s.fitness}</>}>{() => <div className="dd"><div className="dd-head"><span>Fitness</span><span className="grow" /><b>{s.fitness}</b></div><div className="dd-line"><span>Steps that went through</span><span className="grow" /><span>96%</span></div><div className="dd-line"><span>Refusals it obeyed</span><span className="grow" /><span>11 of 12</span></div></div>}</FactMenu>
    <FactMenu width={260} title="Compare incoming messages with agent replies" fact={<><Icon name="weight" size={12} /> {s.load}</>}>{() => <div className="dd"><div className="dd-head"><span>Load</span><span className="grow" /><b>{s.load}</b></div><div className="dd-line"><span>Messages not answered yet</span><span className="grow" /><span>{s.load}</span></div></div>}</FactMenu>
    <span className="grow" />
    {end}
  </div>;
}
function AgentStopMenu({close}) {
  const toast = useToast();
  const [asking, setAsking] = useState(false);
  return asking ? <><div className="menu-label">Stop the agent? It stops what it is doing.</div><MenuItem danger onClick={() => { toast("Agent stopped"); close(); }}>Stop it</MenuItem><MenuItem onClick={() => setAsking(false)}>Keep it running</MenuItem></>
    : <MenuItem icon="stop" onClick={() => setAsking(true)}>Stop</MenuItem>;
}
function AllowanceDropdown({s}) {
  return <div className="dd">
    <div className="dd-head"><span>Plan allowance</span></div>
    <div className="dd-line"><span>{s.allowanceTitle} window</span><span className="grow" /><span style={{color: "var(--text)"}}>{s.allowance}%</span></div>
    <div className="dd-meter"><i style={{width: s.allowance + "%"}} /></div>
    <div className="dd-line"><span className="faint">Starts again at {s.resets}</span></div>
    <div className="dd-line" style={{marginTop: 6}}><span>Weekly</span><span className="grow" /><span>{s.weekly}%</span></div>
    <div className="dd-meter"><i style={{width: s.weekly + "%"}} /></div>
  </div>;
}

// Context: how full, how many tokens of how many, when it was compacted, then Compact now and Clear (which asks first)
function ContextDropdown({s, close}) {
  const toast = useToast();
  const [asking, setAsking] = useState(false);
  return <div className="dd">
    <div className="dd-head"><span>Context</span><span className="grow" /><b>{s.context}% full</b></div>
    <div className="dd-meter" title="The agent compacts by itself at 80%"><i style={{width: s.context + "%"}} /><span className="mark" style={{left: "80%"}} /></div>
    <div className="dd-line"><span>{s.tokens}k of {s.window}k tokens</span>{s.capped && <Badge state="blocked">Capped</Badge>}<span className="grow" /><span className="faint">compacts at 80%</span></div>
    <div className="dd-line"><span className="faint">{s.compactions ? `Compacted ${s.compacted}, ${s.compactions} times this session` : "Not compacted yet this session"}</span></div>
    <div className="menu-sep" />
    {asking ? <div className="dd-ask">
        <div className="refusal"><Icon name="alert" size={12} /><span>Clear drops all {s.tokens}k tokens. The agent starts again from its overview and memories.</span></div>
        <div className="row"><Btn small onClick={() => setAsking(false)}>Keep it</Btn><Btn small variant="danger" onClick={() => { toast("Context cleared"); close(); }}>Clear the context</Btn></div>
      </div>
      : <>
        <MenuItem icon="gauge" desc="Keeps a summary and frees most of the tokens" onClick={() => { toast("Compacting the context"); close(); }}>Compact now</MenuItem>
        <MenuItem icon="trash" danger desc="Starts again from the overview and memories" hint="…" onClick={() => setAsking(true)}>Clear the context</MenuItem>
      </>}
  </div>;
}

// Model: each model on one row, its context window and price in columns; effort as one segmented control under them
function ModelDropdown({pick, close}) {
  const toast = useToast();
  const cols = {gridTemplateColumns: "14px minmax(0, 1fr) 44px 44px 44px"};
  return <div className="dd">
    <div className="dd-head"><span>Model</span><span className="grow" /><span className="faint" style={{fontSize: 11}}>per million tokens</span></div>
    <div className="dd-cols" style={cols}><span /><span className="h">Model</span><span className="h num">Window</span><span className="h num">In</span><span className="h num">Out</span></div>
    {MODELS.map((m) => <button key={m.name} type="button" role="menuitemradio" aria-checked={pick.model === m.name} className={"dd-row" + (pick.model === m.name ? " on" : "")} style={cols} title={m.id} onClick={() => { pick.setModel(m.name); toast(`${m.name} from the next turn`); close(); }}>
      <span className="tick">{pick.model === m.name && <Icon name="tick" size={12} />}</span><span>{m.name}</span><span className="num">{m.window}</span><span className="num">{rate(m.input)}</span><span className="num">{rate(m.output)}</span>
    </button>)}
    <div className="dd-group">Effort</div>
    <div className="dd-seg"><Seg value={pick.effort} onPick={(k) => pick.setEffort(k)} options={EFFORTS.map(([k]) => ({key: k, label: k}))} /></div>
    <div className="dd-foot">A change takes effect at the agent's next turn</div>
  </div>;
}
function EffortDropdown({pick, close}) {
  return <><div className="menu-label">Reasoning effort</div>{EFFORTS.map(([k, l]) => <MenuItem key={k} check={pick.effort === k} onClick={() => { pick.setEffort(k); close(); }}>{l}</MenuItem>)}<div className="dd-foot">Takes effect at the next turn</div></>;
}

// Cost: Breakdown (totals, then by model, agent and profile, each with its share) and Pricing (the price table behind the numbers)
function CostGroup({title, rows, total}) {
  const cols = {gridTemplateColumns: "minmax(0, 1fr) 72px 52px", height: 24};
  return <><div className="dd-group">{title}</div>{rows.map(([label, cost]) => <div key={label} className="dd-row" style={cols}><span>{label}</span><span className="dd-share"><i style={{width: `${(cost / total) * 100}%`}} /></span><span className="num">{dollars(cost)}</span></div>)}</>;
}
function CostDropdown({s}) {
  const [view, setView] = useState("breakdown");
  const total = COSTS.reduce((n, c) => n + c.cost, 0);
  const by = (key) => Object.entries(COSTS.reduce((m, c) => ({...m, [c[key]]: (m[c[key]] || 0) + c.cost}), {})).sort((a, b) => b[1] - a[1]);
  const pcols = {gridTemplateColumns: "minmax(0, 1fr) 42px 42px 52px 46px"};
  return <div className="dd">
    <div className="dd-head"><span>Predicted API price</span></div>
    <div className="dd-sub" title="What these sessions would cost when using Claude Code or Codex through an API. It is not what a plan charges.">Through an API. Not what your plan charges.</div>
    <div className="dd-seg"><Seg value={view} onPick={setView} options={[{key: "breakdown", label: "Breakdown"}, {key: "pricing", label: "Pricing"}]} /></div>
    {view === "breakdown" ? <>
      <div className="dd-total"><span>This session</span><b>{dollars(s.cost)}</b></div>
      <div className="dd-total big"><span>All open sessions</span><b>{dollars(total)}</b></div>
      <CostGroup title="By model" rows={by("model")} total={total} />
      <CostGroup title="By agent" rows={by("agent")} total={total} />
      <CostGroup title="By profile" rows={by("profile")} total={total} />
    </> : <>
      <div className="dd-cols" style={pcols}><span className="h">Per million tokens</span><span className="h num">In</span><span className="h num">Out</span><span className="h num">Cache in</span><span className="h num">Cached</span></div>
      {MODELS.map((m) => <div key={m.name} className="dd-row" style={{...pcols, height: 26}} title={m.id}><span>{m.name}</span><span className="num">{rate(m.input)}</span><span className="num">{rate(m.output)}</span><span className="num">{rate(m.write)}</span><span className="num">{rate(m.read)}</span></div>)}
      <div className="dd-foot" title="The journal's price table">From the journal's price table · sample prices in this prototype</div>
    </>}
  </div>;
}

/* ---------- pane tabs: PaneTabs.vue ---------- */
const NOW_TITLES = {chat: ["Chat", "chat"], terminal: ["Terminal", "term"], tasks: ["Tasks", "task"], plans: ["Plans", "plan"], questions: ["Questions", "bell"], feed: ["File feed", "file"], counts: ["Counts", "widget"], agents: ["Agents", "agent"]};
const NOW_COUNTS = {tasks: 8, questions: 1};
function NowPane({tabs, setTabs, active, setActive, shared}) {
  const W = NOW_WINDOWS[active];
  return <div className="now-pane">
    <div className="now-ptabs">
      <div className="now-ptabs-row" role="tablist">{tabs.map((k) => <button key={k} type="button" role="tab" aria-selected={k === active} className={"now-ptab" + (k === active ? " on" : "")} onClick={() => setActive(k)}><Icon name={NOW_TITLES[k][1]} size={12} /><span>{NOW_TITLES[k][0]}</span>{NOW_COUNTS[k] != null && <span className={"n" + (k === "questions" ? " hot" : "")}>{NOW_COUNTS[k]}</span>}</button>)}</div>
      <Menu width={300} button={({toggle}) => <Btn icon="plus" small title="Add a window" onClick={toggle} />}>{(close) => WINDOW_GROUPS.map((g, gi) => <React.Fragment key={g.title}>{gi > 0 && <div className="menu-sep" />}<div className="menu-label">{g.title}</div>{g.items.filter(([k]) => NOW_TITLES[k]).map(([k, l, i, d]) => <MenuItem key={k} icon={i} desc={d} hint={tabs.includes(k) ? "Open" : null} onClick={() => { if (!tabs.includes(k)) setTabs([...tabs, k]); setActive(k); close(); }}>{l}</MenuItem>)}</React.Fragment>)}</Menu>
      <Menu width={220} button={({toggle}) => <Btn icon="dots" small title="Window settings" onClick={toggle} />}>{(close) => <><MenuItem icon="sidebar" onClick={close}>Split to the right</MenuItem><MenuItem icon="down" onClick={close}>Split below</MenuItem><MenuItem icon="open" onClick={close}>Detach</MenuItem><div className="menu-sep" /><MenuItem icon="close" onClick={close}>Close the pane</MenuItem></>}</Menu>
    </div>
    <div className="now-pbody"><W {...shared} /></div>
  </div>;
}

/* ---------- chat: Chat.vue, MessageCard.vue, ChatMark.vue ---------- */
const CHAT_ROWS = [
  {day: "Today"},
  {me: true, id: 120138, at: "13:41", text: "The home screen stays as it is. Keep the new file viewer. No text may wrap."},
  {mark: "Task 9692 started", icon: "task"},
  {mark: "helper-851 reads doc 1275", icon: "agent"},
  {mark: "pytest tests/stories -x -q · output 489998 · failed", icon: "term", kind: "process"},
  {id: 120141, at: "13:44", text: "helper-851 draws round four. Doc 1275 keeps the list of what stays as it is."},
  {me: true, id: 120155, at: "13:52", text: "And fix the Open button of the Search reader."},
  {mark: "Plan 1133 waits for your approval", icon: "plan", kind: "attention"},
  {id: 120157, at: "13:53", text: "Reader calls primary.run now, so Open opens the row. Task 9693 holds it."},
];
function NowChat() {
  const toast = useToast();
  const [rows, setRows] = useState(CHAT_ROWS);
  const [draft, setDraft] = useState("");
  const send = () => { if (!draft.trim()) return; setRows([...rows, {me: true, id: 120160 + rows.length, at: "now", text: draft.trim()}]); setDraft(""); };
  return <div className="now-chat">
    <div className="now-history"><div className="now-list">
      {rows.map((r, i) => r.day ? <p key={i} className="now-day">{r.day}</p>
        : r.mark ? <div key={i} className={"now-mark" + (r.kind ? " " + r.kind : "")}><Icon name={r.icon} size={11} /><span><Linked text={r.mark} /></span></div>
        : <article key={i} className={"now-msg" + (r.me ? " me" : "")}>
          <div className="now-body">
            <div className="now-card"><p><Linked text={r.text} /></p></div>
            <div className="now-tools"><button type="button" className="now-tool" onClick={() => toast("Pick a reaction")}>React</button><button type="button" className="now-tool" onClick={() => setDraft(`> ${r.text}\n`)}>Reply</button><button type="button" className="now-tool" onClick={() => toast("Copied")}>Copy</button></div>
          </div>
          <div className="now-mfoot"><time>{r.at}</time><span className="dot" aria-hidden="true">•</span><span className="id">message {r.id}</span>{r.me && <span className="ticks" title="Read by the agent">✓✓</span>}</div>
        </article>)}
    </div></div>
    <p className="now-running"><span className="now-running-dot" /><span>sed -n 55,80p src/core/modules/agents/support/agent_rows.py</span></p>
    <form className="now-composer" onSubmit={(e) => { e.preventDefault(); send(); }}>
      <textarea rows={3} value={draft} placeholder="Message the agent" aria-label="Message the agent" onChange={(e) => setDraft(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }} />
      <div className="now-composer-row">
        <button type="button" className="now-attach" title="Attach a file or an image" aria-label="Attach a file"><Icon name="clip" size={16} /></button>
        {draft.trim() ? <Btn small variant="primary" className="now-send" type="submit">Send</Btn> : <Btn small className="now-send">Dump files</Btn>}
      </div>
    </form>
  </div>;
}

/* ---------- terminal: Terminal.vue ---------- */
const TERM_ROWS = [
  {id: 1, mark: "#", text: "journal task show 9597"},
  {id: 2, mark: "$", text: "grep -rn \"AgentBar\" src/viewer/src", out: "src/viewer/src/windows/PaneStage.vue:29:import AgentBar from \"../shell/AgentBar.vue\";\nsrc/viewer/src/windows/PaneStage.vue:354:<AgentBar :agent=\"agentRow\" …"},
  {id: 3, mark: ">", text: "Read src/viewer/src/shell/InformationBar.vue"},
  {id: 4, mark: "$", text: "pytest tests/stories/test_launch.py -x -q", out: "F\nFAILED tests/stories/test_launch.py::test_settings_text\n1 failed in 4.21 s"},
  {id: 5, mark: "$", text: "rm -rf src/viewer/node_modules", refusal: "a command may not delete outside the agent's worktree"},
  {id: 6, mark: "$", text: "sed -n 55,80p src/core/modules/agents/support/agent_rows.py"},
];
function NowTerminal() {
  const [opened, setOpened] = useState(new Set([4]));
  const [typed, setTyped] = useState("");
  const toast = useToast();
  const flip = (id) => { const s = new Set(opened); s.has(id) ? s.delete(id) : s.add(id); setOpened(s); };
  return <section className="now-term">
    <div className="now-term-body">{TERM_ROWS.map((r) => <React.Fragment key={r.id}>
      <div className={"now-trow" + (r.refusal ? " refused" : "")} title={r.refusal ? `The journal refused this before it ran: ${r.refusal}` : null}>
        <span className="now-tmark">{r.mark}</span>
        <button type="button" className="now-ttext" aria-expanded={opened.has(r.id)} onClick={() => flip(r.id)}>{r.text}</button>
        {r.refusal && <span className="now-tstate">refused</span>}
      </div>
      {opened.has(r.id) && <div className="now-tout">{r.refusal ? `The journal refused this before it ran: ${r.refusal}` : r.out || "(no output)"}</div>}
    </React.Fragment>)}</div>
    <form className="now-trun" onSubmit={(e) => { e.preventDefault(); if (typed.trim()) { toast("Sent to the agent's terminal"); setTyped(""); } }}><span>$</span><input value={typed} onChange={(e) => setTyped(e.target.value)} aria-label="A command to run in the agent's terminal" autoComplete="off" /></form>
  </section>;
}

/* ---------- file feed: FileFeed.vue, FeedBar.vue, DiffCard.vue; oldest above, newest below ---------- */
const FEED = [
  {id: 1, path: "src/core/modules/plans/support/plan_inspector.py", change: "edit", added: 1, removed: 1, ago: "9m", rows: [["fold", "", "⋯ 14 lines"], ["ctx", 15, "    actions=("], ["del", 16, "        ButtonDeclaration(\"plans.pause\", (), \"Pause\", \"plan block {row_id}\"),"], ["add", 16, "        ButtonDeclaration(\"plans.pause\", (), \"Pause the plan\", \"plan block {row_id} --reason={reason}\"),"], ["ctx", 17, "    ),"]]},
  {id: 2, path: "src/viewer/src/kit/ActionMenu.vue", change: "new", added: 6, removed: 0, ago: "5m", rows: [["add", 1, "<script setup>"], ["add", 2, "import MenuPanel from \"./MenuPanel.vue\";"], ["add", 3, ""], ["add", 4, "// a row's actions as one dropdown, its groups in a fixed order"], ["add", 5, "const props = defineProps({actions: {type: Array, required: true}});"], ["add", 6, "</script>"]]},
  {id: 3, path: "src/viewer/src/resource/Inspector.vue", change: "edit", added: 2, removed: 2, ago: "2m", rows: [["ctx", 134, "        <template v-else>"], ["del", 135, "            <InspectorActions ref=\"actionBar\">"], ["del", 136, "                <ButtonSlot :name=\"`row.${term}`\" … />"], ["add", 135, "            <InspectorBar :row=\"row\" :term=\"term\">"], ["add", 136, "                <ActionMenu :actions=\"actions\" />"], ["ctx", 137, "            </InspectorBar>"]]},
];
const SIGNS = {add: "+", del: "−", ctx: " ", fold: ""};
function NowFeed() {
  const {openFile} = useOpen();
  const [words, setWords] = useState("");
  const [folds, setFolds] = useState({});
  const [opts, setOpts] = useState({headers: false, removals: true});
  const cards = FEED.filter((c) => c.path.toLowerCase().includes(words.toLowerCase()));
  return <div className="now-feed">
    <div className="now-feedbar">
      <SearchField value={words} onChange={setWords} placeholder="Filter files" style={{flex: 1, height: 26}} />
      <Menu width={220} button={({toggle}) => <Btn icon="dots" small title="View" onClick={toggle} />}>{() => <>
        <MenuItem check={opts.headers} onClick={() => setOpts({...opts, headers: !opts.headers})}>Headers only</MenuItem>
        <MenuItem check={false}>Collapse big files</MenuItem><MenuItem check={false}>Hide unchanged lines</MenuItem>
        <MenuItem check={opts.removals} onClick={() => setOpts({...opts, removals: !opts.removals})}>Show removals</MenuItem>
        <MenuItem check={false}>Flush</MenuItem><MenuItem check={false}>Always two columns</MenuItem><MenuItem check={false}>Limit card height</MenuItem>
        <MenuItem check={false} onClick={() => setFolds({})}>Expand everything</MenuItem><MenuItem check={false}>Smaller text</MenuItem><MenuItem check={false}>Larger text</MenuItem>
      </>}</Menu>
    </div>
    <div className="now-feed-flow">
      {!cards.length && <Empty title="No file matches the filter" action={<Btn small onClick={() => setWords("")}>Clear the filter</Btn>} />}
      {cards.map((c) => { const folded = folds[c.id] ?? opts.headers; const dir = c.path.slice(0, c.path.lastIndexOf("/") + 1); const name = c.path.slice(dir.length);
        return <section key={c.id} className={"now-diff" + (folded ? " folded" : "")}>
          <div className="now-diff-head" onClick={() => setFolds({...folds, [c.id]: !folded})}>
            <span className="now-diff-path" title={`${c.path} · click the name to open it`}><span className="now-diff-dir">{dir}</span><span className="now-diff-name" onClick={(e) => { e.stopPropagation(); openFile(c.path); }}>{name}</span>{c.change === "new" && <span className="now-diff-badge new">new</span>}</span>
            <span className={"now-diff-count add" + (c.added ? "" : " zero")}>+{c.added}</span>
            <span className={"now-diff-count del" + (c.removed ? "" : " zero")}>−{c.removed}</span>
            <span className="now-diff-ago">{c.ago}</span>
          </div>
          {!folded && <div className="now-diff-rows">{c.rows.filter(([k]) => opts.removals || k !== "del").map(([k, n, code], i) => <div key={i} className={"now-drow " + k}><span className="no">{n}</span><span className="sg">{SIGNS[k]}</span><span className="cd">{code}</span></div>)}</div>}
        </section>; })}
    </div>
  </div>;
}

/* ---------- Tasks: the one filter bar, then rows of fixed columns; tags in a column of their own ---------- */
const TAG_ROOM = 2;
function TaskTags({tags}) {
  if (!tags.length) return <span className="none">—</span>;
  return <span className="tk-tags" title={tags.join(", ")}>{tags.slice(0, TAG_ROOM).map((g) => <span key={g} className="tk-tag">{g}</span>)}{tags.length > TAG_ROOM && <span className="tk-tag more">+{tags.length - TAG_ROOM}</span>}</span>;
}
const GROUP_WORDS = {none: "No groups", state: "By state", plan: "By plan", assignee: "By assignee"};
function NowTasks({onOpen, filter, setFilter}) {
  const [words, setWords] = useState("");
  const [group, setGroup] = useState("state");
  const value = filter || emptyFilter();
  const rows = applyFilter(TASKS, TASK_FIELDS, value, words, (t) => `${t.id} ${t.title} ${t.tags.join(" ")}`);
  const by = GROUPS[group];
  const groups = by ? [...new Set(rows.map(by))] : [null];
  return <div className="tk-wrap">
    <FilterBar fields={TASK_FIELDS} rows={TASKS} value={value} onChange={setFilter} words={words} onWords={setWords} shown={rows.length} placeholder="Search tasks"
      end={<Menu button={({toggle, open}) => <MenuButton label={`Group: ${group}`} open={open} onClick={toggle} />}>{(close) => Object.keys(GROUPS).map((g) => <MenuItem key={g} check={g === group} onClick={() => { setGroup(g); close(); }}>{GROUP_WORDS[g]}</MenuItem>)}</Menu>} />
    <div className="tk-head"><span /><span style={{textAlign: "right"}}>Task</span><span>Title</span><span>Tags</span><span>Plan</span><span>Assignee</span><span>{group === "state" ? "Priority" : "State"}</span></div>
    <div style={{flex: 1, minHeight: 0, overflow: "auto"}}>
      {groups.map((g) => <React.Fragment key={g || "all"}>{g && <div className="lr-group">{g} <span className="faint">{rows.filter((t) => by(t) === g).length}</span></div>}
        {rows.filter((t) => !by || by(t) === g).map((t) => <button key={t.id} type="button" className="tk-row" title={t.title} onClick={() => onOpen("task", t.id)}>
          <span className={"sdot " + t.state} title={STATE_WORDS[t.state]} />
          <span className="id">{t.id}</span>
          <span className="t">{t.title}</span>
          <TaskTags tags={t.tags} />
          {t.plan ? <span style={{"--rc-kind": "28px", "--rc-n": "4ch"}}><RefCols term="plan" id={t.plan} /></span> : <span className="none">—</span>}
          {t.by ? <span><AgentLink name={t.by} /></span> : <span className="none">Nobody</span>}
          {group === "state" ? <span className="none">{t.priority}</span> : <span className="tk-state"><span className={"sdot " + t.state} />{STATE_WORDS[t.state]}</span>}
        </button>)}
      </React.Fragment>)}
      {!rows.length && <Empty title="No tasks match" line="Loosen a filter, or clear them all" action={<Btn small onClick={() => { setFilter(emptyFilter()); setWords(""); }}>Clear the filters</Btn>} />}
    </div>
  </div>;
}

/* ---------- Plans: PlanCards.vue's cards, in quiet colours; the state in a column of its own, so it lines up whatever the number's width ---------- */
function NowPlans({onOpen}) {
  const [value, setValue] = useState({state: {not: true, values: ["completed"]}});
  const [words, setWords] = useState("");
  const rows = applyFilter(PLANS, PLAN_FIELDS, value, words, (p) => `${p.id} ${p.title}`);
  return <div className="col" style={{height: "100%", gap: 0}}>
    <FilterBar fields={PLAN_FIELDS} rows={PLANS} value={value} onChange={setValue} words={words} onWords={setWords} shown={rows.length} placeholder="Search plans" />
    <div className="pl-grid">{rows.map((p) => { const ts = p.phases.flatMap((x) => x.tasks).map((id) => TASKS.find((t) => t.id === id)).filter(Boolean); const d = ts.filter((t) => t.state === "completed").length; const testing = ts.filter((t) => t.state === "testing").length; const phase = p.phases.find((x) => x.tasks.some((id) => TASKS.find((t) => t.id === id && t.state !== "completed")))?.n;
      return <button key={p.id} type="button" className="pl-card" onClick={() => onOpen("plan", p.id)}>
        <span className="pl-head"><Icon name="plan" size={12} /><span>Plan</span><span className="n">{p.id}</span><span /><span className="pl-state"><span className={"sdot " + p.state} />{STATE_WORDS[p.state]}</span></span>
        <span className="pl-title" title={p.title}>{p.title}</span>
        <span className="pl-bar" title={`${d} of ${ts.length} done`}><i style={{width: `${ts.length ? (d / ts.length) * 100 : 0}%`}} /><i className="testing" style={{width: `${ts.length ? (testing / ts.length) * 100 : 0}%`}} /></span>
        <span className="pl-foot"><span>{d} of {ts.length} tasks done{phase ? ` · phase ${phase}` : ""}</span><span><AgentLink name={p.by} /></span></span>
      </button>; })}
      {!rows.length && <Empty title="No plans match" action={<Btn small onClick={() => { setValue(emptyFilter()); setWords(""); }}>Clear the filters</Btn>} />}
    </div>
  </div>;
}

const NOW_WINDOWS = {chat: NowChat, terminal: NowTerminal, tasks: NowTasks, plans: NowPlans, questions: QuestionsWindow, feed: NowFeed, counts: CountsWindow, agents: AgentsWindow};

// Home: the coding suite's home layout, a row split at one half (coding_suite.py:44)
function HomeNow({onOpen}) {
  const [left, setLeft] = useState(["chat", "terminal"]); const [la, setLa] = useState("chat");
  const [right, setRight] = useState(["tasks", "plans", "questions", "feed"]); const [ra, setRa] = useState("feed");
  const [filter, setFilter] = useState(emptyFilter());
  const shared = {onOpen, filter, setFilter, onFilter: (t) => { if (t.source !== "tasks") return; setFilter(t.where); if (!right.includes("tasks")) setRight([...right, "tasks"]); setRa("tasks"); }};
  return <div className="home-now" data-screen-label="Home">
    <NowPane tabs={left} setTabs={setLeft} active={la} setActive={setLa} shared={shared} />
    <NowPane tabs={right} setTabs={setRight} active={ra} setActive={setRa} shared={shared} />
  </div>;
}

// the bars over Home only: the agent bar, then the information bar with the layout picker at its end
const LAYOUTS = [["Default", "Chat and side panels"], ["Developer", "A layout for developers"], ["Chat only", "Only the chat"], ["Terminal", "Big terminal, small chat"], ["Review", "Feed and chat"], ["Monitor", "Terminal, feed, tasks"], ["Inbox", "Chat, plans, tasks"], ["Agents", "Agents"]];
function HomeBars() {
  const [layout, setLayout] = useState("Default");
  return <>
    <HomeAgentBar />
    <InfoBar end={<span className="now-layout"><Menu width={240} button={({toggle, open}) => <MenuButton label={`Layout: ${layout}`} open={open} onClick={toggle} title="Choose a layout" />}>{(close) => LAYOUTS.map(([l, d]) => <MenuItem key={l} check={l === layout} desc={d} onClick={() => { setLayout(l); close(); }}>{l}</MenuItem>)}</Menu></span>} />
  </>;
}

/* ---------- Links: icon, kind, number, title and state, each in its own column ---------- */
function LinksTab({links, onOpen}) {
  const kinds = [...new Set(links.map((l) => l.kind))];
  const [kind, setKind] = useState("all");
  if (!links.length) return <p className="muted">Nothing links to this row yet.</p>;
  const shown = links.filter((l) => kind === "all" || l.kind === kind);
  return <>
    {kinds.length > 1 && <div style={{marginBottom: 10}}><Seg value={kind} onPick={setKind} options={[{key: "all", label: "All", count: links.length}, ...kinds.map((k) => ({key: k, label: k, count: links.filter((l) => l.kind === k).length}))]} /></div>}
    {shown.map((l) => <div key={l.kind + l.id} className="link-row cols"><Icon name={l.icon} size={13} style={{color: "var(--text-3)"}} /><RefCols term={l.term} id={l.id} kind={l.kind} /><span title={l.title}>{l.title}</span>{l.state ? <Badge state={l.state} /> : <span />}</div>)}
  </>;
}

/* ---------- InspectorShell: as in layouts.jsx, with one optional bar under the title (the agent inspector's facts) ---------- */
function InspectorShell({term, id, kind, state, title, abstract, bar, width = "medium", primary, actions = [], tabs, links = [], comments, onClose, onBack, onStep, onOpen}) {
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
      <h2 className="insp-title" title={typeof title === "string" ? title : undefined}>{title}</h2>
      {abstract && <p className="insp-abstract" title={abstract}>{abstract}</p>}
      {bar && <div className="insp-bar">{bar}</div>}
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

/* ---------- the agent inspector: one bar of facts, each opening its dropdown, and Actions as one dropdown in the band ---------- */
const AGENT_MEMORIES = [
  {id: 808, weight: 9, state: "active", task: 9693, text: "Round 3 for viewer v5: reports 1378 and 1379, messages 120111 and 120115 go into the prototype, the UI kit and doc 1275."},
  {id: 806, weight: 9, state: "active", task: null, text: "Viewer v5 round 2: motion.css, align.css, uikit.css, the inspector stack and file comments are written."},
  {id: 803, weight: 7, state: "active", task: 9692, text: "The prototype lives in Claude Design project 61d7ef82; pin its link, never a journal document."},
  {id: 799, weight: 4, state: "active", task: null, text: "The user wants plain words in every label, and no colour that the viewer's tokens do not already hold."},
  {id: 761, weight: 0, state: "removed", task: 9597, reason: "faded", text: "Report 1376 groups the full-run failures by detector."},
  {id: 742, weight: 0, state: "removed", task: null, reason: "no longer true", text: "The home Context window repeats the Context fact on the information bar."},
];
function MemoryLine({m}) {
  const {open} = useOpen();
  return <button type="button" className={"mem-row" + (m.state === "removed" ? " removed" : "")} title={m.text} onClick={() => open("memory", m.id)}>
    <span className="mem-w" title={`Weight ${m.weight} of 10`}><span className="mem-steps" aria-hidden="true">{Array.from({length: 10}, (_, i) => <i key={i} className={i < m.weight ? "on" : ""} />)}</span>{m.weight}</span>
    <span className="k">Memory</span><span className="n">{m.id}</span>
    <span className="t">{m.text}</span>
    {m.state === "removed" ? <span className="x">{m.reason}</span> : m.task ? <span style={{"--rc-kind": "34px", "--rc-n": "5ch"}}><RefCols term="task" id={m.task} /></span> : <span className="x">—</span>}
  </button>;
}
function AgentMemoriesTab() {
  const [removedOpen, setRemovedOpen] = useState(false);
  const active = AGENT_MEMORIES.filter((m) => m.state === "active");
  const removed = AGENT_MEMORIES.filter((m) => m.state === "removed");
  if (!AGENT_MEMORIES.length) return <Empty title="No memories" line="This agent has not made any, and none were given to it." />;
  return <div className="col" style={{gap: 0}}>
    <div className="mem-band" style={{paddingTop: 0}}>In force: {active.length}</div>
    <div className="mem-head"><span>Weight</span><span>Memory</span><span /><span>What it keeps in mind</span><span>Task</span></div>
    {active.map((m) => <MemoryLine key={m.id} m={m} />)}
    <div className="mem-band"><button type="button" aria-expanded={removedOpen} onClick={() => setRemovedOpen(!removedOpen)}><Chevron open={removedOpen} />Removed: {removed.length}</button></div>
    {removedOpen && <><div className="mem-head"><span>Weight</span><span>Memory</span><span /><span>What it kept in mind</span><span>Why removed</span></div>{removed.map((m) => <MemoryLine key={m.id} m={m} />)}</>}
  </div>;
}
function AgentInspector({id, onClose, onOpen, onBack}) {
  const a = AGENTS.find((x) => x.id === id) || AGENTS[0];
  const [state, setState] = useState(a.state);
  const actions = [
    {group: "Session", label: state === "paused" ? "Resume the agent" : "Pause the agent", icon: state === "paused" ? "play" : "pause", desc: "Only journal commands and reads run while paused", run: () => { setState(state === "paused" ? "started" : "paused"); }},
    {group: "Session", label: "Send a message", icon: "chat", field: {label: "Message", placeholder: "Tell the agent…"}, confirm: "Send"},
    ...CONTEXT_ACTIONS("agent", a.id),
    {group: "Danger", label: "Stop the session", icon: "stop", danger: true, field: {label: "Why does it stop?"}, confirm: "Stop"},
  ];
  const held = TASKS.filter((t) => t.by === a.name && ["started", "testing", "blocked"].includes(t.state));
  const tabs = [
    {key: "tasks", label: "Tasks", count: held.length, render: () => held.length ? <div className="col" style={{gap: 2}}>{held.map((t) => <TaskRow key={t.id} t={t} end={<Badge state={t.state} />} />)}</div> : <Empty title="No task held" line="The agent holds no task now" />},
    {key: "memories", label: "Memories", count: AGENT_MEMORIES.filter((m) => m.state === "active").length, render: () => <AgentMemoriesTab />},
    {key: "recent", label: "Recent", render: () => <Timeline rows={[["Ran output 489998", "25 min ago", true], ["Read skill journal-tasks", "1 h ago"], ["Started task 9597", "1 h ago"]]} />},
  ];
  return <InspectorShell term="agent" id={a.id} kind={`Agent ${a.id} · ${a.role}`} state={state} title={a.name} width="medium" bar={<InfoBar agentId={a.id} card />} actions={actions} tabs={tabs} comments={false} links={held.map((t) => ({kind: "Task", term: "task", id: t.id, title: t.title, state: t.state, icon: "task"}))} onClose={onClose} onOpen={onOpen} onBack={onBack} />;
}

/* ---------- Reader: as in layouts.jsx; its primary button runs primary.run, then says what happened ---------- */
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
  const runPrimary = () => { const why = primary.run?.(); toast(why || primary.done || primary.label); };
  return <div ref={ref} style={{display: "flex", flex: 1, minWidth: 0, position: "relative"}}>
    <div className="reader-col">
      <div className="reader-head row" style={{alignItems: "flex-start", paddingBottom: tabs ? 4 : 12, borderBottom: tabs ? 0 : "1px solid var(--border)"}}>
        <div className="grow"><div className="row muted" style={{fontSize: 12, marginBottom: 4, whiteSpace: "nowrap", overflow: "hidden"}}>{meta}</div><h2 title={item.title}>{item.title}</h2>{item.abstract && <p title={item.abstract}>{item.abstract}</p>}</div>
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

// Search: as in pages.jsx; Open opens the chosen row, through Reader's primary.run
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
        renderReader={(r) => <Reader key={r.id} term="search" item={r} comments={false} meta={<><span className="mono">{r.group}</span><span style={{"--rc-kind": "auto"}}><RefCols term={r.term} id={r.rid} /></span></>}
          primary={{label: "Open", run: () => { onOpen(r.term, r.rid); }, done: `${TERM_WORDS[r.term]} ${r.rid} opened`}}>{() => <Markdown text={r.body} />}</Reader>} />}
  </div>;
}

Object.assign(window, {RefCols, InfoBar, HomeAgentBar, HomeBars, HomeNow, NowChat, NowTerminal, NowFeed, NowTasks, NowPlans, ContextDropdown, ModelDropdown, CostDropdown, LinksTab, InspectorShell, AgentInspector, Reader, SearchPage, AGENT_MEMORIES});
