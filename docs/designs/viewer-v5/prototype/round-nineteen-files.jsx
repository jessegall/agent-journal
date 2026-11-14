// Round nineteen, file viewing (users 121867 and 121875). Loaded after round-nineteen-menus.jsx, before app.jsx.
// Replaces by name: InspectorFor. Sets NOW_WINDOWS.feed (the feed with its open icon) and NOW_WINDOWS.files (Files as a home window).
// One files browser, three places, each the same FilesPage (tree, tabs, code, comments on lines):
// 1. the Files page, from the sidebar (a click);
// 2. the file inspector, the widest one, over whatever page is open: from the open icon of a file in the file feed,
//    from ⌘ or Ctrl and a click on Files in the sidebar, and from Open in the inspector in a file's or the sidebar row's menu;
// 3. a window on the home layout, placed from the + menu of a pane like any other window, so home works as a small IDE.

const AJ_FILE_START = "src/core/modules/plans/support/plan_inspector.py";
const ajFilePath = (nameOrPath) => ALL_FILES.find((f) => f.path === nameOrPath || f.name === nameOrPath)?.path || nameOrPath;
// opens the file inspector through the app's own open, as every row does (app.jsx sets AJ_FILES when it renders)
const ajInspectFile = (path) => window.AJ_FILES?.inspect(path || AJ_FILE_START);
Object.assign(TERM_WORDS, {file: "File"});
if (typeof WIDTH_OF !== "undefined") WIDTH_OF.file = "wide";

/* ---------- 2. the file inspector: the files browser in the widest inspector, the page stays under it ---------- */
function FileInspector({id, onClose, onOpen, onBack}) {
  const {openFile} = useOpen();
  const path = id || AJ_FILE_START;
  const actions = [
    {group: "File", label: "Copy path", icon: "copy", run: () => { navigator.clipboard?.writeText(path).catch(() => {}); }, done: "Path copied"},
    {group: "File", label: "Show changes in Git", icon: "git", done: "Git opens on this file"},
  ];
  const tabs = [{key: "file", label: "Files", flush: true, render: () => <div className="aj-files-window in-inspector"><FilesPage initialPath={path} /></div>}];
  return <InspectorShell term="file" id={path} kind="Files" title={path.split("/").pop()} width="wide aj-file"
    primary={{label: "Open the Files page", run: () => { openFile(path); }, done: "Files opened"}}
    actions={actions} tabs={tabs} comments={false} onClose={onClose} onOpen={onOpen} onBack={onBack} />;
}

// every row's inspector (round nine's), and the file inspector for a file
function InspectorFor({s, ...props}) {
  if (s.term === "file") return <FileInspector id={s.id} {...props} />;
  if (s.term === "queue") return <QueueInspector {...props} />;
  const C = {plan: PlanInspector, task: TaskInspector, doc: DocumentInspector, report: DocumentInspector, agent: AgentInspector, memory: MemoryInspector, output: OutputInspector, message: MessageInspector}[s.term];
  if (C) return <C id={s.id} {...props} />;
  return <R6RowInspector s={s} {...props} />;
}

/* ---------- 1. the file feed: each file has an open icon that opens it in the file inspector ---------- */
// the name still opens the Files page; the icon keeps the reader on the page they are on
function AJNowFeed() {
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
            <span className="now-diff-path" title={c.path}><span className="now-diff-dir">{dir}</span><span className="now-diff-name" onClick={(e) => { e.stopPropagation(); (e.metaKey || e.ctrlKey) ? ajInspectFile(c.path) : openFile(c.path); }}>{name}</span>{c.change === "new" && <span className="now-diff-badge new">new</span>}</span>
            <span className={"now-diff-count add" + (c.added ? "" : " zero")}>+{c.added}</span>
            <span className={"now-diff-count del" + (c.removed ? "" : " zero")}>−{c.removed}</span>
            <span className="now-diff-ago">{c.ago}</span>
            <button type="button" className="aj-feed-open" title="Open in the inspector" aria-label={`Open ${name} in the inspector`} onClick={(e) => { e.stopPropagation(); ajInspectFile(c.path); }}><Icon name="open" size={12} /></button>
          </div>
          {!folded && <div className="now-diff-rows">{c.rows.filter(([k]) => opts.removals || k !== "del").map(([k, n, code], i) => <div key={i} className={"now-drow " + k}><span className="no">{n}</span><span className="sg">{SIGNS[k]}</span><span className="cd">{code}</span></div>)}</div>}
        </section>; })}
    </div>
  </div>;
}
NOW_WINDOWS.feed = AJNowFeed;

/* ---------- 3. Files as a home window ---------- */
function AJFilesWindow() { return <div className="aj-files-window"><FilesPage /></div>; }
NOW_WINDOWS.files = AJFilesWindow;
NOW_TITLES.files = ["Files", "file"];
if (typeof WINDOW_GROUPS !== "undefined" && !WINDOW_GROUPS.some((g) => g.items.some(([k]) => k === "files"))) {
  const group = WINDOW_GROUPS.find((g) => g.items.some(([k]) => k === "feed")) || WINDOW_GROUPS[0];
  group.items.push(["files", "Files", "file", "The project's files: tree, tabs, code"]);
}

/* ---------- the menus: Open in the inspector for a file, and the sidebar's rows (round-nineteen-menus.jsx reads AJ_PLACES in order) ---------- */
const ajAddFilesToHome = () => {
  const pane = AJ_PANES[AJ_PANES.length - 1]?.current;
  if (!pane) { ajSay("Open Home, then add Files from a pane's + menu"); return; }
  if (!pane.tabs.includes("files")) pane.setTabs([...pane.tabs, "files"]);
  pane.setActive("files");
};
AJ_PLACES.unshift(
  [".side .nav", (el) => {
    const label = ajText(el);
    if (label !== "Files") return {head: label, items: [{label: "Open", run: () => ajClick(el)}]};
    return {head: "Files", items: [
      {label: "Open", run: () => ajClick(el)},
      {label: "Open in the inspector", keys: "⌘ click", run: () => ajInspectFile()},
      {label: "Place on Home", disabled: !AJ_PANES.length && "Open Home first", short: "on Home", run: ajAddFilesToHome},
    ]};
  }],
  [".tree button, .tree [role=treeitem]", (el) => {
    const name = ajText(el), path = ajFilePath(el.title || name);
    const inInspector = Boolean(el.closest(".insp"));
    return {head: path, items: [
      {label: "Open", keys: "↵", run: () => ajClick(el)},
      {label: "Open in the inspector", disabled: inInspector && "Already in the inspector", short: "here", run: () => ajInspectFile(path)},
      "-",
      {label: "Copy path", run: () => ajCopy(path)},
      {label: "Copy name", run: () => ajCopy(name)},
      {label: "Search in this folder", run: () => ajSay("Search opens on this folder")},
      "-",
      {label: "Comment on file", run: () => ajSay("The comment box opens on the whole file")},
      {label: "Show changes in Git", run: () => ajSay("Git opens on this file's diff")},
    ]};
  }],
  [".now-diff-head", (el) => {
    const path = el.querySelector(".now-diff-path")?.title || ajText(el);
    const folded = el.closest(".now-diff")?.classList.contains("folded");
    return {head: path, items: [
      {label: "Open in the inspector", run: () => ajInspectFile(path)},
      {label: "Open the Files page", run: () => ajClick(el.querySelector(".now-diff-name"))},
      {label: folded ? "Unfold" : "Fold", run: () => ajClick(el)},
      "-",
      {label: "Copy path", run: () => ajCopy(path)},
    ]};
  }],
);

Object.assign(window, {FileInspector, InspectorFor, AJNowFeed, AJFilesWindow, ajInspectFile});
