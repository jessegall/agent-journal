// Round four (messages 120138, 120143, 120155, 120159), with the round-seventeen words.
// 1. Home as the current viewer draws it: the information bar, pane tabs, the terminal and the file feed. Each piece names the build file it copies.
//    The agent bar is round-fifteen.jsx's, the bars over Home round-fourteen-bars.jsx's, Home itself round-eight.jsx's, the chat round-thirteen.jsx's,
//    the Plans window round-six-focus.jsx's. InspectorShell is round-sixteen.jsx's, Reader round-six-kit.jsx's.
// 2. No text wraps: a row's kind and number stand in their own columns (RefCols), and every row is one line cut with an ellipsis.
// 3. The Tasks window: the title takes the free width; a column says only what is not normal (a dash for nobody, a priority only when high).
// 4. A figure and its unit are one string (41%), never two flex items with a gap between them.

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
  return <span role="link" tabIndex={0} className="rc" title={`${word} ${id}`} onClick={go} onKeyDown={(e) => e.key === "Enter" && go(e)}><span className="k">{word}</span><span className="n">{id}</span></span>;
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

/* ---------- the information bar: InformationBar.vue; on Home and, as one live bar, in the agent inspector ---------- */
function InfoBar({agentId = 1, card, end}) {
  const s = sessionOf(agentId);
  const [model, setModel] = useState(s.model);
  const [effort, setEffort] = useState(s.effort);
  const pick = {model, effort, setModel, setEffort};
  return <div className={"now-info" + (card ? " card" : "")} data-information-bar>
    <FactMenu width={240} className="lead" title={`Session ${s.session}`} fact={<><Icon name="agents" size={12} /><span>{s.program}</span></>}>{(close) => <AgentStopMenu close={close} />}</FactMenu>
    <FactMenu width={280} title={`Allowance · resets ${s.resets}`} fact={<><Icon name="allowance" size={12} /><span className="now-gauge usage"><span style={{width: s.allowance + "%"}} /></span><span>{`${s.allowance}%`}</span></>}>{() => <AllowanceDropdown s={s} />}</FactMenu>
    <FactMenu width={300} title="Context" fact={<><Icon name="gauge" size={12} /><span className="now-gauge"><span style={{width: s.context + "%"}} /></span><span>{`${s.context}%`}</span></>}>{(close) => <ContextDropdown s={s} close={close} />}</FactMenu>
    <FactMenu width={360} title="Model" fact={<><Icon name="model" size={12} /><span>{model}</span></>}>{(close) => <ModelDropdown pick={pick} close={close} />}</FactMenu>
    <FactMenu width={240} title="Effort" fact={<><Icon name="bolt" size={12} /><span>{effort}</span></>}>{(close) => <EffortDropdown pick={pick} close={close} />}</FactMenu>
    <FactMenu width={360} title="API price" fact={dollars(s.cost)}>{() => <CostDropdown s={s} />}</FactMenu>
    <span className="now-fact" title="Branch"><Icon name="branch" size={12} /><span>{s.branch}</span></span>
    {!card && <FactMenu width={260} className={s.jobs ? "" : "none"} title="Jobs" fact={<><Icon name="clock" size={12} /><span>{s.jobs}</span></>}>{() => <div className="dd"><div className="dd-head"><span>Jobs</span></div><div className="dd-sub">None</div></div>}</FactMenu>}
    <FactMenu width={280} title="Skills" fact={<><Icon name="book" size={12} /><span>{s.skills}</span></>}>{(close) => <><div className="menu-label">Skills</div>{SKILLS.slice(0, 5).map((k) => <MenuItem key={k.id} icon="skill" onClick={close}>{k.title}</MenuItem>)}<div className="menu-sep" /><MenuItem icon="open" onClick={close}>Skills</MenuItem></>}</FactMenu>
    <FactMenu width={260} className={s.fitness < 75 ? "low" : ""} title="Fitness" fact={<><Icon name="heart" size={12} /><span>{s.fitness}</span></>}>{() => <div className="dd"><div className="dd-head"><span>Fitness</span><span className="grow" /><b>{s.fitness}</b></div><div className="dd-line"><span>Steps through</span><span className="grow" /><span>96%</span></div><div className="dd-line"><span>Refusals obeyed</span><span className="grow" /><span>11 of 12</span></div></div>}</FactMenu>
    <FactMenu width={260} title="Load" fact={<><Icon name="weight" size={12} /><span>{s.load}</span></>}>{() => <div className="dd"><div className="dd-head"><span>Load</span><span className="grow" /><b>{s.load}</b></div><div className="dd-line"><span>Unanswered</span><span className="grow" /><span>{s.load}</span></div></div>}</FactMenu>
    <span className="grow" />
    {end}
  </div>;
}
// the program fact's menu keeps the app's own words (InformationBar.vue 118-119)
function AgentStopMenu({close}) {
  const toast = useToast();
  const [asking, setAsking] = useState(false);
  return asking ? <><div className="menu-label">Stop the agent?</div><MenuItem danger onClick={() => { toast("Agent stopped"); close(); }}>Stop it</MenuItem><MenuItem onClick={() => setAsking(false)}>Keep it running</MenuItem></>
    : <MenuItem icon="stop" onClick={() => setAsking(true)}>Stop</MenuItem>;
}
function AllowanceDropdown({s}) {
  return <div className="dd">
    <div className="dd-head"><span>Plan allowance</span></div>
    <div className="dd-line"><span>{s.allowanceTitle} window</span><span className="grow" /><span style={{color: "var(--text)"}}>{`${s.allowance}%`}</span></div>
    <div className="dd-meter"><i style={{width: s.allowance + "%"}} /></div>
    <div className="dd-line"><span className="faint">Resets {s.resets}</span></div>
    <div className="dd-line" style={{marginTop: 6}}><span>Weekly</span><span className="grow" /><span>{`${s.weekly}%`}</span></div>
    <div className="dd-meter"><i style={{width: s.weekly + "%"}} /></div>
  </div>;
}

// Context: how full, how many tokens of how many, when it was compacted, then Compact now and Clear (which asks first)
function ContextDropdown({s, close}) {
  const toast = useToast();
  const [asking, setAsking] = useState(false);
  return <div className="dd">
    <div className="dd-head"><span>Context</span><span className="grow" /><b>{`${s.context}%`}</b></div>
    <div className="dd-meter"><i style={{width: s.context + "%"}} /><span className="mark" style={{left: "80%"}} /></div>
    <div className="dd-line"><span>{s.tokens}k of {s.window}k tokens</span>{s.capped && <Badge state="blocked">Capped</Badge>}<span className="grow" /><span className="faint">compacts at 80%</span></div>
    <div className="dd-line"><span className="faint">{s.compactions ? `Compacted ${s.compacted} · ${plural(s.compactions, "time")}` : "Not compacted"}</span></div>
    <div className="menu-sep" />
    {asking ? <div className="dd-ask">
        <div className="refusal"><Icon name="alert" size={12} /><span>Drops {s.tokens}k tokens</span></div>
        <div className="row"><Btn small onClick={() => setAsking(false)}>Keep</Btn><Btn small variant="danger" onClick={() => { toast("Context cleared"); close(); }}>Clear</Btn></div>
      </div>
      : <>
        <MenuItem icon="gauge" onClick={() => { toast("Compacting"); close(); }}>Compact now</MenuItem>
        <MenuItem icon="trash" danger hint="…" onClick={() => setAsking(true)}>Clear</MenuItem>
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
    <div className="dd-foot">From the next turn</div>
  </div>;
}
function EffortDropdown({pick, close}) {
  return <><div className="menu-label">Effort</div>{EFFORTS.map(([k, l]) => <MenuItem key={k} check={pick.effort === k} onClick={() => { pick.setEffort(k); close(); }}>{l}</MenuItem>)}<div className="dd-foot">From the next turn</div></>;
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
      <div className="dd-foot">Journal price table</div>
    </>}
  </div>;
}

/* ---------- pane tabs: PaneTabs.vue ---------- */
const NOW_TITLES = {chat: ["Chat", "chat"], terminal: ["Terminal", "term"], tasks: ["Tasks", "task"], plans: ["Plans", "plan"], questions: ["Questions", "bell"], feed: ["File feed", "file"], counts: ["Counts", "widget"], agents: ["Agents", "agent"]};
const NOW_COUNTS = {tasks: TASKS.length, questions: 1};
function NowPane({tabs, setTabs, active, setActive, shared}) {
  const W = NOW_WINDOWS[active];
  return <div className="now-pane">
    <div className="now-ptabs">
      <div className="now-ptabs-row" role="tablist">{tabs.map((k) => <button key={k} type="button" role="tab" aria-selected={k === active} className={"now-ptab" + (k === active ? " on" : "")} onClick={() => setActive(k)}><Icon name={NOW_TITLES[k][1]} size={12} /><span>{NOW_TITLES[k][0]}</span>{NOW_COUNTS[k] != null && <span className={"n" + (k === "questions" ? " hot" : "")}>{NOW_COUNTS[k]}</span>}</button>)}</div>
      <Menu width={300} button={({toggle}) => <Btn icon="plus" small title="Window" onClick={toggle} />}>{(close) => WINDOW_GROUPS.map((g, gi) => <React.Fragment key={g.title}>{gi > 0 && <div className="menu-sep" />}<div className="menu-label">{g.title}</div>{g.items.filter(([k]) => NOW_TITLES[k]).map(([k, l, i, d]) => <MenuItem key={k} icon={i} desc={d} hint={tabs.includes(k) ? "Open" : null} onClick={() => { if (!tabs.includes(k)) setTabs([...tabs, k]); setActive(k); close(); }}>{l}</MenuItem>)}</React.Fragment>)}</Menu>
      <Menu width={220} button={({toggle}) => <Btn icon="dots" small title="Pane" onClick={toggle} />}>{(close) => <><MenuItem icon="sidebar" onClick={close}>Split right</MenuItem><MenuItem icon="down" onClick={close}>Split below</MenuItem><MenuItem icon="open" onClick={close}>Detach</MenuItem><div className="menu-sep" /><MenuItem icon="close" onClick={close}>Close pane</MenuItem></>}</Menu>
    </div>
    <div className="now-pbody"><W {...shared} /></div>
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
      <div className={"now-trow" + (r.refusal ? " refused" : "")}>
        <span className="now-tmark">{r.mark}</span>
        <button type="button" className="now-ttext" aria-expanded={opened.has(r.id)} onClick={() => flip(r.id)}>{r.text}</button>
        {r.refusal && <span className="now-tstate">refused</span>}
      </div>
      {opened.has(r.id) && <div className="now-tout">{r.refusal ? `Refused: ${r.refusal}` : r.out || "No output"}</div>}
    </React.Fragment>)}</div>
    <form className="now-trun" onSubmit={(e) => { e.preventDefault(); if (typed.trim()) { toast("Sent"); setTyped(""); } }}><span>$</span><input value={typed} onChange={(e) => setTyped(e.target.value)} aria-label="Command" autoComplete="off" /></form>
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
      <SearchField value={words} onChange={setWords} placeholder="Filter" style={{flex: 1, height: 26}} />
      <Menu width={220} button={({toggle}) => <Btn icon="dots" small title="View" onClick={toggle} />}>{() => <>
        <MenuItem check={opts.headers} onClick={() => setOpts({...opts, headers: !opts.headers})}>Headers only</MenuItem>
        <MenuItem check={false}>Fold big files</MenuItem><MenuItem check={false}>Hide unchanged</MenuItem>
        <MenuItem check={opts.removals} onClick={() => setOpts({...opts, removals: !opts.removals})}>Removals</MenuItem>
        <MenuItem check={false}>Flush</MenuItem><MenuItem check={false}>Two columns</MenuItem><MenuItem check={false}>Card height</MenuItem>
        <MenuItem check={false} onClick={() => setFolds({})}>Expand all</MenuItem><MenuItem check={false}>Smaller text</MenuItem><MenuItem check={false}>Larger text</MenuItem>
      </>}</Menu>
    </div>
    <div className="now-feed-flow">
      {!cards.length && <Empty title="No match" action={<Btn small onClick={() => setWords("")}>Clear</Btn>} />}
      {cards.map((c) => { const folded = folds[c.id] ?? opts.headers; const dir = c.path.slice(0, c.path.lastIndexOf("/") + 1); const name = c.path.slice(dir.length);
        return <section key={c.id} className={"now-diff" + (folded ? " folded" : "")}>
          <div className="now-diff-head" onClick={() => setFolds({...folds, [c.id]: !folded})}>
            <span className="now-diff-path" title={c.path}><span className="now-diff-dir">{dir}</span><span className="now-diff-name" onClick={(e) => { e.stopPropagation(); openFile(c.path); }}>{name}</span>{c.change === "new" && <span className="now-diff-badge new">new</span>}</span>
            <span className={"now-diff-count add" + (c.added ? "" : " zero")}>+{c.added}</span>
            <span className={"now-diff-count del" + (c.removed ? "" : " zero")}>−{c.removed}</span>
            <span className="now-diff-ago">{c.ago}</span>
          </div>
          {!folded && <div className="now-diff-rows">{c.rows.filter(([k]) => opts.removals || k !== "del").map(([k, n, code], i) => <div key={i} className={"now-drow " + k}><span className="no">{n}</span><span className="sg">{SIGNS[k]}</span><span className="cd">{code}</span></div>)}</div>}
        </section>; })}
    </div>
  </div>;
}

/* ---------- Tasks: the one filter bar (it wraps, nothing is cut), then rows of fixed columns; the title takes the free width ---------- */
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
    <FilterBar fields={TASK_FIELDS} rows={TASKS} value={value} onChange={setFilter} words={words} onWords={setWords} shown={rows.length} placeholder="Search"
      end={<Menu button={({toggle, open}) => <MenuButton label={GROUP_WORDS[group]} open={open} onClick={toggle} />}>{(close) => Object.keys(GROUPS).map((g) => <MenuItem key={g} check={g === group} onClick={() => { setGroup(g); close(); }}>{GROUP_WORDS[g]}</MenuItem>)}</Menu>} />
    <div className="tk-head"><span /><span style={{textAlign: "right"}}>Task</span><span>Title</span><span>Tags</span><span>Plan</span><span>Assignee</span><span>{group === "state" ? "Priority" : "State"}</span></div>
    <div style={{flex: 1, minHeight: 0, overflow: "auto"}}>
      {groups.map((g) => <React.Fragment key={g || "all"}>{g && <div className="lr-group">{g} <span className="faint">{rows.filter((t) => by(t) === g).length}</span></div>}
        {rows.filter((t) => !by || by(t) === g).map((t) => <button key={t.id} type="button" className="tk-row" title={t.title} onClick={() => onOpen("task", t.id)}>
          {group === "state" ? <span /> : <span className={"sdot " + t.state} />}
          <span className="id">{t.id}</span>
          <span className="t">{t.title}</span>
          <TaskTags tags={t.tags} />
          {t.plan ? <span><RowLink term="plan" id={t.plan} bare /></span> : <span className="none">—</span>}
          {t.by ? <span><AgentLink name={t.by} /></span> : <span className="none">—</span>}
          {group === "state" ? <span className="none">{t.priority === "high" ? "high" : ""}</span> : <span className="tk-state"><span className={"sdot " + t.state} />{STATE_WORDS[t.state]}</span>}
        </button>)}
      </React.Fragment>)}
      {!rows.length && <Empty title="No match" action={<Btn small onClick={() => { setFilter(emptyFilter()); setWords(""); }}>Clear</Btn>} />}
    </div>
  </div>;
}

const NOW_WINDOWS = {terminal: NowTerminal, tasks: NowTasks, questions: QuestionsWindow, feed: NowFeed, counts: CountsWindow, agents: AgentsWindow};

// the layouts of the bars over Home (round-fourteen-bars.jsx)
const LAYOUTS = [["Default", "Chat and side panels"], ["Developer", "Developer pages"], ["Chat only", "Chat"], ["Terminal", "Big terminal, small chat"], ["Review", "Feed and chat"], ["Monitor", "Terminal, feed, tasks"], ["Inbox", "Chat, plans, tasks"], ["Agents", "Agents"]];

/* ---------- Links: icon, kind, number, title and state, each in its own column ---------- */
function LinksTab({links, onOpen}) {
  const kinds = [...new Set(links.map((l) => l.kind))];
  const [kind, setKind] = useState("all");
  if (!links.length) return <p className="muted">No links</p>;
  const shown = links.filter((l) => kind === "all" || l.kind === kind);
  return <>
    {kinds.length > 1 && <div style={{marginBottom: 10}}><Seg value={kind} onPick={setKind} options={[{key: "all", label: "All", count: links.length}, ...kinds.map((k) => ({key: k, label: k, count: links.filter((l) => l.kind === k).length}))]} /></div>}
    {shown.map((l) => <div key={l.kind + l.id} className="link-row cols"><Icon name={l.icon} size={13} style={{color: "var(--text-3)"}} /><RefCols term={l.term} id={l.id} kind={l.kind} /><span title={l.title}>{l.title}</span>{l.state ? <Badge state={l.state} /> : <span />}</div>)}
  </>;
}

/* ---------- an agent's memories: weight, number, text, task; in force and removed under one bar each ---------- */
const AGENT_MEMORIES = [
  {id: 808, weight: 9, state: "active", task: 9693, text: "Round 3 for viewer v5: reports 1378 and 1379, messages 120111 and 120115 go into the prototype, the UI kit and doc 1275."},
  {id: 806, weight: 9, state: "active", task: null, text: "Viewer v5 round 2: motion.css, align.css, uikit.css, the inspector stack and file comments are written."},
  {id: 803, weight: 7, state: "active", task: 9692, text: "The prototype lives in Claude Design project 61d7ef82; pin its link, never a journal document."},
  {id: 799, weight: 4, state: "active", task: null, text: "The user wants plain words in every label, and no colour that the viewer's tokens do not already hold."},
  {id: 761, weight: 0, state: "removed", task: 9597, reason: "faded", text: "Report 1376 groups the full-run failures by detector."},
  {id: 742, weight: 0, state: "removed", task: null, reason: "no longer true", text: "The home Context window repeats the Context fact on the information bar."},
];
// under a Memory column and a Task column, the number alone
function MemoryLine({m}) {
  const {open} = useOpen();
  return <button type="button" className={"mem-row" + (m.state === "removed" ? " removed" : "")} title={m.text} onClick={() => open("memory", m.id)}>
    <span className="mem-w" aria-label={`Weight ${m.weight}`}><span className="mem-steps" aria-hidden="true">{Array.from({length: 10}, (_, i) => <i key={i} className={i < m.weight ? "on" : ""} />)}</span>{m.weight}</span>
    <span className="k" /><span className="n">{m.id}</span>
    <span className="t">{m.text}</span>
    {m.state === "removed" ? <span className="x">{m.reason}</span> : m.task ? <span><RowLink term="task" id={m.task} bare /></span> : <span className="x">—</span>}
  </button>;
}
function AgentMemoriesTab() {
  const [removedOpen, setRemovedOpen] = useState(false);
  const active = AGENT_MEMORIES.filter((m) => m.state === "active");
  const removed = AGENT_MEMORIES.filter((m) => m.state === "removed");
  if (!AGENT_MEMORIES.length) return <Empty title="No memories" />;
  return <div className="col" style={{gap: 0}}>
    <div className="mem-head"><span>Weight</span><span>Memory</span><span /><span>Text</span><span>Task</span></div>
    {active.map((m) => <MemoryLine key={m.id} m={m} />)}
    <div className="mem-band"><button type="button" aria-expanded={removedOpen} onClick={() => setRemovedOpen(!removedOpen)}><Chevron open={removedOpen} />Removed<span className="faint" style={{marginLeft: 6}}>{removed.length}</span></button></div>
    {removedOpen && <><div className="mem-head"><span>Weight</span><span>Memory</span><span /><span>Text</span><span>Reason</span></div>{removed.map((m) => <MemoryLine key={m.id} m={m} />)}</>}
  </div>;
}

// Search: one field, the results grouped by kind; under a group the row says only what the group does not (its state); Open opens the row
function SearchPage({onOpen}) {
  const [q, setQ] = useState("comment box");
  const all = [...DOCS.map((d) => ({id: "d" + d.id, term: d.term, rid: d.id, title: d.title, desc: d.abstract, body: d.body, group: d.term === "doc" ? "Documents" : "Reports"})), ...TASKS.map((t) => ({id: "t" + t.id, term: "task", rid: t.id, title: t.title, desc: STATE_WORDS[t.state], body: t.title, group: "Tasks"})), ...MEMORIES.map((m) => ({id: "m" + m.id, term: "memory", rid: m.id, title: m.desc, desc: m.title, body: m.body, group: "Memories"}))];
  const words = q.trim().toLowerCase().split(/\s+/).filter(Boolean);
  const hits = words.length ? all.filter((r) => words.some((w) => (r.title + " " + r.body).toLowerCase().includes(w))) : [];
  const [chosen, setChosen] = useState(null);
  return <div className="page" data-screen-label="Search">
    <div className="phead"><SearchField autoFocus value={q} onChange={(v) => { setQ(v); setChosen(null); }} placeholder="Search" style={{flex: 1, height: 36}} /></div>
    {!words.length ? <Empty title="Search" />
      : !hits.length ? <Empty title="No match" action={<Btn small onClick={() => setQ("")}>Clear</Btn>} />
      : <ListReaderLayout items={hits} chosen={chosen ?? hits[0].id} onChoose={setChosen} searchable={false} pickLine="No result chosen"
        renderReader={(r) => <Reader key={r.id} term="search" item={r} comments={false} meta={<span style={{"--rc-kind": "auto"}}><RefCols term={r.term} id={r.rid} /></span>}
          primary={{label: "Open", run: () => { onOpen(r.term, r.rid); }, done: `${TERM_WORDS[r.term]} ${r.rid} opened`}}>{() => <Markdown text={r.body} />}</Reader>} />}
  </div>;
}

Object.assign(window, {RefCols, InfoBar, NowPane, NowTerminal, NowFeed, NowTasks, ContextDropdown, ModelDropdown, CostDropdown, LinksTab, SearchPage, AGENT_MEMORIES, AgentMemoriesTab, MemoryLine, LAYOUTS, NOW_WINDOWS, NOW_COUNTS, NOW_TITLES, SESSIONS, sessionOf});
