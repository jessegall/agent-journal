// The shell: grouped sidebar (never hidden by a click), top bar with one search, the page, the inspector stack.
// The agent bar and the information bar show on Home only (home-now.jsx, message 120138). OpenContext gives every component the one way to open a row, a page or a file.
// Round six: every approved page is its own component on ListPage or R6CardPage. Round seven: a row with no inspector opens its page with the row chosen (R7_PAGE_OF).

const NAV = [
  {items: [["home", "Home", "home"], ["search", "Search", "search"]]},
  {title: "Work", items: [["documents", "Documents", "doc", 4], ["files", "Files", "file"], ["git", "Git", "git"], ["checks", "Checks", "check", 1], ["output", "Output", "term"], ["transcriptions", "Transcriptions", "mic"]]},
  {title: "Agents", items: [["profiles", "Profiles", "agent"], ["skills", "Skills", "skill"], ["memories", "Memories", "brain"], ["rules", "Rules", "rule", 1], ["templates", "Templates", "template"], ["sequences", "Sequences", "seq"], ["reminders", "Reminders", "bell"]]},
  {title: "Connect", items: [["plugins", "Plugins", "plug"], ["integrations", "Integrations", "link"], ["secrets", "Secrets", "key", 2], ["teams", "Teams", "team"]]},
];
const DEV_NAV = {title: "Developer", items: [["numbers", "Numbers", "chart"], ["requests", "Request log", "log"], ["syslogs", "System logs", "log"]]};
const FOOT_NAV = [["kit", "UI kit", "kit"], ["settings", "Settings", "gear"], ["updates", "Agent journal 5.0.0", "star"]];
const TITLES = Object.fromEntries([...NAV, DEV_NAV].flatMap((g) => g.items).map(([k, l]) => [k, l]));
Object.assign(TITLES, {kit: "UI kit", settings: "Settings", updates: "Change log"});

function NavItem({k, label, icon, count, page, go}) {
  return <button className={"nav" + (page === k ? " on" : "")} title={label} aria-current={page === k ? "page" : undefined} onClick={() => go(k)}><span className="slot"><Icon name={icon} size={14} /></span><span>{label}</span>{count ? <span className="count">{count}</span> : null}</button>;
}

// in the icon rail each group title becomes a line, and every icon names its page on hover
function Sidebar({page, go, rail, developer}) {
  const groups = developer ? [...NAV, DEV_NAV] : NAV;
  return <aside className={"side" + (rail ? " rail" : "")} data-screen-label="Sidebar">
    <div className="side-head"><span className="logo">A</span>
      <Menu align="left" width={240} button={({toggle}) => <button className="env-switch" onClick={toggle} title="Switch environment"><b>agent-journal</b><span>version-5 · environment 5 ▾</span></button>}>{(close) => <><div className="menu-label">Environments</div><MenuItem icon="branch" hint="current" onClick={close}>version-5</MenuItem><MenuItem icon="branch" onClick={close}>main</MenuItem><div className="menu-sep" /><MenuItem icon="plus" onClick={close}>New environment</MenuItem></>}</Menu>
    </div>
    <nav className="side-scroll" aria-label="Pages">
      {groups.map((g, gi) => <div key={gi} className="side-group" style={gi === 0 ? {marginTop: 4} : null}>
        {g.title && <div className="side-group-title">{g.title}</div>}
        {g.items.map(([k, l, i, n]) => <NavItem key={k} k={k} label={l} icon={i} count={n} page={page} go={go} />)}
      </div>)}
    </nav>
    <div className="side-foot">{FOOT_NAV.map(([k, l, i]) => <NavItem key={k} k={k} label={l} icon={i} page={page} go={go} />)}</div>
  </aside>;
}

// the bell: what waits on you, the secrets' proposals and requests among them
function TopBar({page, onSearch}) {
  const {open} = useOpen();
  return <div className="topbar">
    <div className="crumbs"><span>agent-journal</span><Icon name="right" size={9} /><span>version-5</span><Icon name="right" size={9} /><b>{TITLES[page] || "Home"}</b></div>
    <button className="cmdk" onClick={onSearch}><Icon name="search" size={12} /><span className="grow" style={{textAlign: "left"}}>Search the journal, or jump to a page</span><span className="kbd">⌘K</span></button>
    <Menu width={320} button={({toggle}) => <span style={{position: "relative", display: "inline-flex"}}><Btn icon="bell" title="Waiting on you: 4" onClick={toggle} /><span className="bell-count">4</span></span>}>{(close) => <><div className="menu-label">Waiting on you</div>
      <MenuItem icon="plan" desc="Ready for approval" onClick={() => { open("plan", 1133); close(); }}>Plan 1133</MenuItem>
      <MenuItem icon="bell" desc="Developer pages: sidebar or Settings?" onClick={() => { open("question", 88); close(); }}>Question 88</MenuItem>
      <MenuItem icon="key" desc="worker-4 proposes the program git" onClick={() => { open("secret", 3); close(); }}>Secret 3, GitHub token</MenuItem>
      <MenuItem icon="key" desc="worker-7 asks for its value" onClick={() => { open("secret", 7); close(); }}>Secret 7, Sentry token</MenuItem>
    </>}</Menu>
    <Btn icon="phone" title="Jesse's phone is connected" />
    <Btn icon="activity" title="Activity" />
  </div>;
}

function CommandPalette({go, onClose}) {
  const {open} = useOpen();
  const [q, setQ] = useState("");
  useLayer(true, onClose);
  const pages = Object.entries(TITLES).filter(([, l]) => l.toLowerCase().includes(q.toLowerCase()));
  const num = /^\d+$/.test(q.trim()) ? Number(q.trim()) : null;
  const rows = q ? [...TASKS.filter((t) => t.title.toLowerCase().includes(q.toLowerCase()) || t.id === num).slice(0, 4).map((t) => ["task", t.id, t.title]), ...PLANS.filter((p) => p.id === num || p.title.toLowerCase().includes(q.toLowerCase())).slice(0, 4).map((p) => ["plan", p.id, p.title]), ...DOCS.filter((d) => d.title.toLowerCase().includes(q.toLowerCase()) || d.id === num).map((d) => [d.term, d.id, d.title])] : [];
  return <div className="veil" style={{background: "rgb(0 0 0 / .3)", placeItems: "start center"}} onMouseDown={(e) => e.target === e.currentTarget && onClose()}><div className="palette" role="dialog" aria-label="Search the journal">
    <SearchField autoFocus value={q} onChange={setQ} placeholder="Search the journal, a number, or jump to a page" />
    <div className="palette-list">
      {pages.length > 0 && <><div className="menu-label">Pages</div>{pages.slice(0, 6).map(([k, l]) => <MenuItem key={k} icon="right" onClick={() => { go(k); onClose(); }}>{l}</MenuItem>)}</>}
      {rows.length > 0 && <><div className="menu-label">Rows</div>{rows.map(([t, id, title]) => <MenuItem key={t + id} icon={t === "task" ? "task" : t === "plan" ? "plan" : "doc"} hint={`${TERM_WORDS[t]} ${id}`} onClick={() => { open(t, id); onClose(); }}>{title}</MenuItem>)}</>}
      {q && <MenuItem icon="search" onClick={() => { go("search"); onClose(); }}>Search everything for “{q}”</MenuItem>}
    </div>
  </div></div>;
}

const LEAVE_MS = 360;
const INSPECTED = ["plan", "task", "doc", "report", "agent", "memory", "output", "message", "question"];
function App() {
  const [page, setPage] = useState(() => localStorage.getItem("v5.page") || "home");
  const [filePath, setFilePath] = useState(null);
  const [stack, setStack] = useState([]);
  const [toast, setToast] = useState(null);
  const [palette, setPalette] = useState(false);
  const [plugin, setPlugin] = useState(null);
  const [developer, setDeveloper] = useState(true);
  const [leaving, setLeaving] = useState(null);
  const [pickKey, setPickKey] = useState(0);
  const guard = useRef(null);
  const [wide, setWide] = useState(window.innerWidth);
  useEffect(() => { const r = () => setWide(window.innerWidth); window.addEventListener("resize", r); return () => window.removeEventListener("resize", r); }, []);
  const say = useCallback((text) => { setToast(text); clearTimeout(window.__t); window.__t = setTimeout(() => setToast(null), 2400); }, []);
  // inspectors that leave are marked, slide out to the right, then go
  const leave = (marks) => { setStack((s) => { const gone = marks(s.filter((x) => !x.leaving)); return gone.length ? s.map((x) => gone.includes(x) ? {...x, leaving: true} : x) : s; }); setTimeout(() => setStack((s) => s.filter((x) => !x.leaving)), LEAVE_MS); };
  const back = () => leave((live) => live.slice(-1));
  const focus = (key) => leave((live) => live.slice(live.findIndex((x) => x.key === key) + 1));
  const closeAll = () => leave((live) => live);
  const live = stack.filter((x) => !x.leaving);
  useLayer(live.length > 0, back);
  // a page change asks first when the page holds unsaved changes
  const goNow = (k) => { setPage(k); localStorage.setItem("v5.page", k); closeAll(); };
  const go = (k) => { if (k === page) return; if (guard.current) setLeaving({to: k, ...guard.current}); else goNow(k); };
  // a row with an inspector opens it; a row without one opens its page with the row chosen; anything else is not a link
  const openRow = (term, id, how) => {
    if (id == null) return;
    const home = R7_PAGE_OF[term];
    if (home) { R7_PICK.term = term; R7_PICK.id = id; if (home[0] === page) { if (!guard.current) setPickKey((n) => n + 1); } else go(home[0]); closeAll(); return; }
    if (!INSPECTED.includes(term)) return;
    const item = {term, id, key: `${term}-${id}-${Date.now()}`};
    setStack((s) => { const now = s.filter((x) => !x.leaving); if (how === "replace" && now.length) return [...now.slice(0, -1), item]; const top = now[now.length - 1]; return top && top.term === term && top.id === id ? s : [...now, item]; });
  };
  const openFile = (path) => { setFilePath(path); if (page === "files") setPage("files"); else go("files"); };
  useEffect(() => { const k = (e) => { if ((e.metaKey || e.ctrlKey) && e.key === "k") { e.preventDefault(); setPalette(true); } }; document.addEventListener("keydown", k); return () => document.removeEventListener("keydown", k); }, []);
  const body = {
    home: <HomeNow onOpen={openRow} />, search: <SearchPage onOpen={openRow} />, kit: <UiKitPage onOpen={openRow} />,
    documents: <DocumentsPage onOpen={openRow} />, files: <FilesPage key={filePath} initialPath={filePath} />, git: <GitPage />,
    profiles: <ProfilesPage guard={guard} />, skills: <SkillsPage />, memories: <MemoriesPage onOpen={openRow} />, rules: <RulesPage />,
    templates: <TemplatesPage />, sequences: <SequencesPage />, reminders: <RemindersPage />,
    plugins: <PluginsPage onOpenSettings={setPlugin} />, integrations: <IntegrationsPage />, secrets: <SecretsPage />, teams: <TeamsPage />,
    settings: <SettingsPage developer={developer} setDeveloper={setDeveloper} guard={guard} />,
    transcriptions: <SimpleListPage title="Transcriptions" line="What you said, written out" items={TRANSCRIPTIONS} term="transcription" />,
    checks: <CardPage title="Checks" line="Commands that tell whether the project is healthy" items={CHECKS} kind="check" newLabel="New check" />,
    output: <OutputPage onOpen={openRow} />, numbers: <LogPage title="Numbers" line="How long the journal's parts take" />, requests: <LogPage title="Request log" line="Every hook request, newest first" />, syslogs: <LogPage title="System logs" line="What the server wrote" />,
    updates: <SimpleListPage title="Change log" line="What changed in each version" items={[{id: "5.0.0", title: "Version 5.0.0", desc: "One look for every page", group: "Releases", body: "# 5.0.0\n\n- Shared layouts, from plan 1133\n- The Actions menu\n- The Counts window and the filter bar\n- The inspector stack\n- Comments on files\n- Every reference is a link\n- Plan focus in the agent bar, the profile editor, squarish badges\n"}]} term="update" />,
  }[page] || <HomeNow onOpen={openRow} />;
  const home = page === "home" || !TITLES[page];
  return <ToastContext.Provider value={say}><OpenContext.Provider value={{open: openRow, go, openFile}}>
    <div className="app">
      <Sidebar page={page} go={go} rail={wide < 1100} developer={developer} />
      <main className="main">
        <TopBar page={page} onSearch={() => setPalette(true)} />
        {home && <HomeBars />}
        <div className="page view-in" key={`${page}-${pickKey}`}>{body}</div>
      </main>
    </div>
    <InspectorStack stack={stack} onOpen={openRow} onBack={back} onFocus={focus} onClose={closeAll} />
    {palette && <CommandPalette go={go} onClose={() => setPalette(false)} />}
    {plugin && <PluginSettingsDialog plugin={plugin} onClose={() => setPlugin(null)} />}
    {leaving && <LeaveDialog count={leaving.count} onStay={() => setLeaving(null)} onDiscard={() => { leaving.discard(); guard.current = null; setLeaving(null); goNow(leaving.to); }} onSave={() => { const ok = leaving.save(); setLeaving(null); if (ok) { guard.current = null; goNow(leaving.to); } }} />}
    {toast && <div className="toast" role="status" key={toast}>{toast}</div>}
  </OpenContext.Provider></ToastContext.Provider>;
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
