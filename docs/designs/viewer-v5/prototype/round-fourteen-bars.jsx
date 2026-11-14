// Round fourteen, the bars over Home (message 121276). Replaces by name: HomeAgentBar and HomeBars. Unchanged parts look as the app has them (121184).
// 1. The process count is one number, running and waiting together (AgentBar.vue:55-57 shows one number).
// 2. The layout control is the app's icon button, Presets (agents/LayoutPicker.vue:20-21), at the end of the information bar (PaneStage.vue:359-363),
//    not a 'Layout: Default' text dropdown. Its list floats (FloatMenu).

Object.assign(ICONS, {layout: "M2.5 3h11v10h-11zM7 3v10M7 8h6.5"});

function HomeAgentBar() {
  const {open} = useOpen();
  const [paused, setPaused] = useState(false);
  const t = TASKS.find((x) => x.id === AGENTS[0].task);
  const helpers = AGENTS.filter((a) => a.role !== "Main agent" && a.state !== "open");
  const processes = Q9_RUNS.filter((r) => r.section !== "finished").length;
  return <div className="now-agent" data-agent-bar>
    <span className={"now-dot " + (paused ? "paused" : "running")} />
    <strong>{paused ? "Paused" : "Working"}</strong>
    <button type="button" className="now-task" title={t.title} onClick={() => open("task", t.id)}>Task {t.id}: {t.title}</button>
    <button type="button" className="now-plan" title={`Open plan ${t.plan}`} onClick={() => open("plan", t.plan)}>Plan {t.plan}</button>
    <span className="grow" />
    <button type="button" className={"btn icon now-pause" + (paused ? " paused" : "")} aria-label={paused ? "Resume" : "Pause"} title={paused ? "Resume: the agent carries on where it stopped" : "Pause: only journal commands, read tools and read commands run until you resume it"} onClick={() => setPaused(!paused)}><Icon name={paused ? "resume" : "pause"} size={16} /></button>
    <span className="now-divider" />
    <button type="button" className="now-count" aria-label="Process queue" title="Process queue: processes running now" onClick={() => q9OpenQueue(open)}><Icon name="term" size={12} />{processes}</button>
    <FloatMenu align="right" width={280} button={({toggle}) => <button type="button" className="now-count" aria-label="Helpers" title="Running: helpers" onClick={toggle}><Icon name="agents" size={12} />{helpers.length}</button>}>{(close) => <>
      <div className="menu-label">Running beside main</div>
      {helpers.map((a) => <MenuItem key={a.id} icon="agent" desc={a.task ? `Task ${a.task}` : a.role} hint={STATE_WORDS[a.state]} onClick={() => { open("agent", a.id); close(); }}>{a.name}</MenuItem>)}
    </>}</FloatMenu>
  </div>;
}

function HomeBars() {
  const [layout, setLayout] = useState("Default");
  return <>
    <HomeAgentBar />
    <InfoBar end={<span className="now-layout"><FloatMenu align="right" width={240} button={({toggle, open}) => <button type="button" className={"btn icon r14-layout" + (open ? " on" : "")} data-presets title="Presets" aria-label="Presets" onClick={toggle}><Icon name="layout" size={12} /></button>}>{(close) => <>
      <div className="menu-label">Presets</div>
      {LAYOUTS.map(([l, d]) => <MenuItem key={l} check={l === layout} desc={d} onClick={() => { setLayout(l); close(); }}>{l}</MenuItem>)}
    </>}</FloatMenu></span>} />
  </>;
}

Object.assign(window, {HomeAgentBar, HomeBars});
