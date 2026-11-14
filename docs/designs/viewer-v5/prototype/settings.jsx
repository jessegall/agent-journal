// Settings page, agent settings modal and plugin settings modal: all SettingsLayout, all kept as a draft and applied with Save.
// Leaving with unsaved changes asks: Stay, Discard or Save and leave. A save may go through in part: the refused rows say why.

function Choice({value, options, onChange, label}) { return <select value={value} aria-label={label} onChange={(e) => onChange(e.target.value)}>{options.map((o) => <option key={o}>{o}</option>)}</select>; }
function Num({value, onChange, label}) { return <input type="number" aria-label={label} value={value} onChange={(e) => onChange(Number(e.target.value))} style={{width: 90}} />; }
function TextIn({value, onChange, placeholder, label}) { return <input type="text" aria-label={label} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />; }

const SETTINGS_NAV = [
  {title: "Viewer"}, {key: "viewer", label: "Look and layout", icon: "grid", keys: ["theme", "density", "inspector"]}, {key: "sidebar", label: "Sidebar", icon: "sidebar", keys: ["rail"]},
  {title: "Agents"}, {key: "agents", label: "Agent settings", icon: "agent"}, {key: "commands", label: "Command classification", icon: "term"}, {key: "hooks", label: "Hooks", icon: "hook"}, {key: "tools", label: "Tools", icon: "tool"},
  {title: "Connections"}, {key: "tunnel", label: "Tunnel", icon: "tunnel", keys: ["tunnel", "tunnelName", "tunnelAccess"]}, {key: "tunler", label: "Tunler account", icon: "key"}, {key: "phones", label: "Phones", icon: "phone", keys: ["pairing"]},
  {title: "Project"}, {key: "environments", label: "Environments", icon: "branch", keys: ["envDefault"]}, {key: "developer", label: "Developer", icon: "chart", keys: ["developer", "hookLog"]},
];

// what the server refuses in the prototype: a tunnel name with a space
const REFUSALS = {tunnelName: (v) => (/\s/.test(v) ? "A tunnel name has no spaces: use letters, numbers and dashes." : null)};

function SettingsPage({onAgentSettings, developer, setDeveloper, guard}) {
  const toast = useToast();
  const [nav, setNav] = useState("viewer");
  const [find, setFind] = useState("");
  const [errors, setErrors] = useState({});
  const [failure, setFailure] = useState(null);
  const d = useDraft({theme: "Dark", density: "Comfortable", inspector: "Beside the page", rail: "Icons below 1100 px", tunnel: true, tunnelName: "jesse-journal", tunnelAccess: "Only paired devices", developer, hookLog: false, pairing: true, envDefault: "5 · version-5"});
  const save = () => {
    const refused = d.changed.filter((k) => REFUSALS[k]?.(d.v[k]));
    d.save(refused);
    setErrors(Object.fromEntries(refused.map((k) => [k, REFUSALS[k](d.v[k])])));
    if (refused.length) { setFailure(`${d.changed.length - refused.length} of ${d.changed.length} saved. ${refused.length} refused: see the marked row.`); setNav(SETTINGS_NAV.find((n) => n.keys?.includes(refused[0])).key); return false; }
    setFailure(null); setDeveloper(d.v.developer); toast("Settings saved"); return true;
  };
  const cancel = () => { d.cancel(); setErrors({}); setFailure(null); };
  // the shell asks before it leaves a page with unsaved changes
  useEffect(() => { guard.current = d.changed.length ? {count: d.changed.length, save, discard: cancel} : null; return () => { guard.current = null; }; });
  const ch = (k) => d.changed.includes(k);
  const f = (label) => Boolean(find) && label.toLowerCase().includes(find.toLowerCase());
  const section = {
    viewer: <><SettingSection title="Look" help="How every page of the viewer is drawn, in this browser.">
        <SettingRow label="Colour scheme" changed={ch("theme")} found={f("Colour scheme")}><Choice label="Colour scheme" value={d.v.theme} options={["Dark", "Light", "Follow the system"]} onChange={(v) => d.set("theme", v)} /></SettingRow>
        <SettingRow label="Density" help="Comfortable keeps 16 px insets; compact keeps 12 px." changed={ch("density")} found={f("Density")}><Choice label="Density" value={d.v.density} options={["Comfortable", "Compact"]} onChange={(v) => d.set("density", v)} /></SettingRow></SettingSection>
      <SettingSection title="Inspector"><SettingRow label="Where a row opens" help="Beside the page keeps the page readable behind it." changed={ch("inspector")}><Choice label="Where a row opens" value={d.v.inspector} options={["Beside the page", "Over the page"]} onChange={(v) => d.set("inspector", v)} /></SettingRow></SettingSection></>,
    sidebar: <SettingSection title="Sidebar" help="The sidebar never hides on a click. It narrows to icons by this setting, or by itself below 1100 px; then each icon names its page on hover and the groups become lines.">
      <SettingRow label="Show the sidebar as" changed={ch("rail")}><Choice label="Show the sidebar as" value={d.v.rail} options={["Icons below 1100 px", "Always names and icons", "Always icons"]} onChange={(v) => d.set("rail", v)} /></SettingRow></SettingSection>,
    agents: <SettingSection title="Agent settings" help="What agents may do: workers, helpers, tests and limits. They open in their own window, with presets."><div style={{paddingTop: 8}}><Btn variant="primary" onClick={onAgentSettings}>Open the agent settings</Btn></div></SettingSection>,
    commands: <SettingSection title="Command classification" help="Which shell commands only read, and which write.">{["git status", "npm test", "pytest"].map((c) => <SettingRow key={c} label={<span className="mono">{c}</span>}><Choice label={c} value="Reads" options={["Reads", "Writes", "Ask"]} onChange={() => {}} /></SettingRow>)}</SettingSection>,
    hooks: <SettingSection title="Hooks" help="The project's own hooks beside the journal's. Each runs at the moment it names.">{[["PreToolUse", "lint-on-edit.sh", 490012], ["Stop", "notify.sh", 489985]].map(([m, s, o]) => <SettingRow key={s} label={<span><span className="mono">{s}</span> <span className="faint">· {m}</span></span>} help={<span>Last run 4 min ago, 38 ms · <RowLink term="output" id={o} /></span>}><Switch on onChange={() => {}} title={`Run ${s}`} /></SettingRow>)}</SettingSection>,
    tools: <SettingSection title="Tools" help="Extra tools agents may use."><SettingRow label="Web search"><Switch on onChange={() => {}} title="Web search" /></SettingRow><SettingRow label="Browser"><Switch on={false} onChange={() => {}} title="Browser" /></SettingRow></SettingSection>,
    tunnel: <><SettingSection title="Tunnel" help="Reach this viewer from your phone or another computer, through a link only you hold.">
        <SettingRow label="Tunnel" help={d.v.tunnel ? "Open at jesse-journal.tunler.dev" : "Closed"} changed={ch("tunnel")} found={f("Tunnel")}><Switch on={d.v.tunnel} onChange={(v) => d.set("tunnel", v)} title="Open the tunnel" /></SettingRow>
        <SettingRow label="Name" help="Letters, numbers and dashes" changed={ch("tunnelName")} error={errors.tunnelName}><TextIn label="Tunnel name" value={d.v.tunnelName} onChange={(v) => d.set("tunnelName", v)} /></SettingRow>
        <SettingRow label="Who may open it" changed={ch("tunnelAccess")}><Choice label="Who may open it" value={d.v.tunnelAccess} options={["Only paired devices", "Anyone with the link and a login"]} onChange={(v) => d.set("tunnelAccess", v)} /></SettingRow></SettingSection>
      <div className="notice" style={{marginTop: 14}}><Icon name="tunnel" /><div>Connected · 2 devices · last request 3 min ago</div></div></>,
    tunler: <SettingSection title="Tunler account" help="The account the tunnel runs on."><SettingRow label="Signed in as"><span className="muted">jesse@…</span></SettingRow><SettingRow label="Plan"><span className="muted">Free · 1 tunnel</span></SettingRow><div style={{paddingTop: 10}}><Btn small>Sign out</Btn></div></SettingSection>,
    phones: <SettingSection title="Phones" help="Paired phones get pushes when a question waits on you."><SettingRow label="Allow pairing" changed={ch("pairing")}><Switch on={d.v.pairing} onChange={(v) => d.set("pairing", v)} title="Allow pairing" /></SettingRow><SettingRow label="Jesse's phone" help="Paired 3 days ago"><Btn small className="danger">Unpair</Btn></SettingRow></SettingSection>,
    environments: <SettingSection title="Environments" help="Lines of work in this project, each with its own agents, tasks and chat."><SettingRow label="Open at start" changed={ch("envDefault")}><Choice label="Open at start" value={d.v.envDefault} options={["5 · version-5", "1 · main"]} onChange={(v) => d.set("envDefault", v)} /></SettingRow></SettingSection>,
    developer: <SettingSection title="Developer" help="Pages for people who work on the journal itself. On, they show under Developer in the sidebar."><SettingRow label="Developer pages" changed={ch("developer")}><Switch on={d.v.developer} onChange={(v) => d.set("developer", v)} title="Developer pages" /></SettingRow><SettingRow label="Log hook requests" changed={ch("hookLog")}><Switch on={d.v.hookLog} onChange={(v) => d.set("hookLog", v)} title="Log hook requests" /></SettingRow></SettingSection>,
  };
  const navWithDots = SETTINGS_NAV.map((n) => n.keys ? {...n, changed: n.keys.filter((k) => d.changed.includes(k)).length} : n);
  return <div className="page" data-screen-label="Settings">
    <PageHeader title="Settings" line="This project's settings, in the same layout as the agent and plugin settings" />
    <div style={{flex: 1, minHeight: 0, display: "flex", borderTop: "1px solid var(--border)"}}>
      <SettingsLayout scope="Environment 5 · version-5" find={<SearchField value={find} onChange={(v) => { setFind(v); const hit = v && SETTINGS_NAV.find((n) => n.label?.toLowerCase().includes(v.toLowerCase())); hit && setNav(hit.key); }} placeholder="Find a setting" style={{width: 260}} />}
        nav={navWithDots} navValue={nav} onNav={setNav} draft={d.changed.length} failure={failure} onCancel={cancel} onSave={save}>
        {section[nav]}
      </SettingsLayout>
    </div>
  </div>;
}

function LeaveDialog({count, onStay, onDiscard, onSave}) {
  return <Dialog narrow title={`${count} change${count === 1 ? " is" : "s are"} not saved`} sub="Save them before you leave this page, or leave them out." onClose={onStay}
    foot={<div className="foot"><span className="note" /><Btn onClick={onStay}>Stay</Btn><Btn className="danger" onClick={onDiscard}>Discard</Btn><Btn variant="primary" onClick={onSave}>Save and leave</Btn></div>}><div className="dialog-body muted">The changed rows keep their dot until they are saved.</div></Dialog>;
}

const PRESETS = ["Careful", "Balanced", "Fast", "Custom"];
function AgentSettingsDialog({onClose}) {
  const toast = useToast();
  const [tab, setTab] = useState("work");
  const [asking, setAsking] = useState(false);
  const d = useDraft({preset: "Balanced", workers: 3, senior: 1, review: "Every plan", tests: "Phase end", limit: 2, effort: "high", model: "Opus 5.5"});
  const ch = (k) => d.changed.includes(k);
  const close = () => (d.changed.length ? setAsking(true) : onClose());
  return <Dialog title="Agent settings" sub="What agents may do in this environment" onClose={close}>
    <SettingsLayout scope="Environment 5 · version-5" preset={<><span className="muted" style={{fontSize: 12}}>Preset</span><Seg value={d.v.preset} onPick={(v) => d.set("preset", v)} options={PRESETS.map((p) => ({key: p, label: p}))} /><button className="btn ghost small">What is a preset?</button></>}
      find={<SearchField value="" onChange={() => {}} placeholder="Find a setting" style={{width: 200}} />}
      tabs={[{key: "work", label: "Work"}, {key: "helpers", label: "Helpers", count: 3}, {key: "tests", label: "Tests"}, {key: "advanced", label: "Advanced"}]} tab={tab} onTab={setTab}
      draft={d.changed.length} onCancel={d.cancel} onSave={() => { d.save(); toast("Agent settings saved"); }}>
      {tab === "work" && <><SettingSection title="Workers" help="Workers write code, each in its own worktree."><SettingRow label="Workers at once" changed={ch("workers")}><Num label="Workers at once" value={d.v.workers} onChange={(v) => d.set("workers", v)} /></SettingRow><SettingRow label="Senior workers at once" help="For tasks of complexity 4 and 5" changed={ch("senior")}><Num label="Senior workers at once" value={d.v.senior} onChange={(v) => d.set("senior", v)} /></SettingRow></SettingSection>
        <SettingSection title="Reviews"><SettingRow label="Review plans" changed={ch("review")}><Choice label="Review plans" value={d.v.review} options={["Every plan", "Plans of 3 phases or more", "Never"]} onChange={(v) => d.set("review", v)} /></SettingRow></SettingSection></>}
      {tab === "helpers" && <SettingSection title="Helpers" help="Read-only helpers for bounded reads."><SettingRow label="Model" changed={ch("model")}><Choice label="Model" value={d.v.model} options={["Opus 5.5", "Sonnet 5.5", "Haiku 5.5"]} onChange={(v) => d.set("model", v)} /></SettingRow><SettingRow label="Effort" changed={ch("effort")}><Choice label="Effort" value={d.v.effort} options={["low", "medium", "high"]} onChange={(v) => d.set("effort", v)} /></SettingRow></SettingSection>}
      {tab === "tests" && <SettingSection title="Tests"><SettingRow label="Full run" changed={ch("tests")}><Choice label="Full run" value={d.v.tests} options={["Phase end", "Task end", "Never"]} onChange={(v) => d.set("tests", v)} /></SettingRow><SettingRow label="Test runs a worker may start per task" changed={ch("limit")}><Num label="Test runs per task" value={d.v.limit} onChange={(v) => d.set("limit", v)} /></SettingRow></SettingSection>}
      {tab === "advanced" && <SettingSection title="Advanced" help="Rarely changed."><SettingRow label="Keep worktrees after a merge"><Switch on={false} onChange={() => {}} title="Keep worktrees after a merge" /></SettingRow></SettingSection>}
    </SettingsLayout>
    {asking && <LeaveDialog count={d.changed.length} onStay={() => setAsking(false)} onDiscard={() => { d.cancel(); onClose(); }} onSave={() => { d.save(); toast("Agent settings saved"); onClose(); }} />}
  </Dialog>;
}

function PluginSettingsDialog({plugin, onClose}) {
  const toast = useToast();
  const [tab, setTab] = useState("settings");
  const d = useDraft({on: plugin.on, interval: 60, place: "Over the chat"});
  const ch = (k) => d.changed.includes(k);
  return <Dialog title={plugin.title} sub={plugin.desc} onClose={onClose}>
    <SettingsLayout scope={`Plugin · ${plugin.version}`} preset={<span className="row"><Switch on={d.v.on} onChange={(v) => d.set("on", v)} title={`Turn ${plugin.title} on or off`} /><span className="muted" style={{fontSize: 12}}>{d.v.on ? "On" : "Off"}</span></span>}
      tabs={[{key: "settings", label: "Settings"}, {key: "services", label: "Services", count: plugin.services}, {key: "log", label: "Log"}]} tab={tab} onTab={setTab}
      draft={d.changed.length} onCancel={d.cancel} onSave={() => { d.save(); toast(`${plugin.title} saved`); }}>
      {tab === "settings" && <SettingSection title="Settings" help="Settings this plugin declares."><SettingRow label="Read the build state every" help="Seconds" changed={ch("interval")}><Num label="Seconds" value={d.v.interval} onChange={(v) => d.set("interval", v)} /></SettingRow><SettingRow label="Where the band shows" changed={ch("place")}><Choice label="Where the band shows" value={d.v.place} options={["Over the chat", "Under the top bar"]} onChange={(v) => d.set("place", v)} /></SettingRow>{plugin.fault && <div className="notice bad" style={{marginTop: 12}}>{plugin.fault}. Add the credential on the Secrets page.</div>}</SettingSection>}
      {tab === "services" && <SettingSection title="Services">{plugin.services ? <SettingRow label={<span className="mono">poller</span>} help="Running · restarted 2 h ago"><Btn small>Restart</Btn></SettingRow> : <p className="muted">This plugin runs no service.</p>}</SettingSection>}
      {tab === "log" && <SettingSection title="Log"><pre className="md" style={{font: "12px/1.6 var(--mono)", color: "var(--text-2)"}}>14:02 band drawn{"\n"}14:01 build state read: passing</pre></SettingSection>}
    </SettingsLayout>
  </Dialog>;
}

Object.assign(window, {SettingsPage, AgentSettingsDialog, PluginSettingsDialog, LeaveDialog});
