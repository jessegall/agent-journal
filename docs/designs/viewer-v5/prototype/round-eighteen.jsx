// Round eighteen (user 121555): the right mouse button opens one context menu wherever it fits, and IDE tabs keep room for their cross.
// ContextMenu is the one component: opened by the right button at the pointer, or by Shift+F10 / the Menu key at the focused element.
const {useState, useEffect, useRef, useLayoutEffect} = React;

/* ---------- the one menu ---------- */
// items: {label, run, keys, danger, armedLabel, disabled: "why", short, children: [...]} or "-" for a line
function ContextMenu({at, head, items, onClose, depth = 0}) {
  const ref = useRef(null);
  const real = items.map((it, i) => ({it, i})).filter(({it}) => it !== "-");
  const [active, setActive] = useState(depth ? real.find(({it}) => !it.disabled)?.i ?? -1 : -1);
  const [sub, setSub] = useState(null);
  const [armed, setArmed] = useState(null);
  const [pos, setPos] = useState({left: at.x, top: at.y});
  // keep the whole menu on screen: flip left or up at the edge, 8 px from it
  useLayoutEffect(() => {
    const r = ref.current.getBoundingClientRect();
    const left = at.x + r.width > innerWidth - 8 ? Math.max(8, (at.flipX ?? at.x) - r.width) : at.x;
    const top = at.y + r.height > innerHeight - 8 ? Math.max(8, innerHeight - 8 - r.height) : at.y;
    setPos({left, top});
    ref.current.focus();
  }, [at.x, at.y]);
  useEffect(() => {
    if (depth) return;
    const away = (e) => { if (!e.target.closest(".r18-menu")) onClose(); };
    const leave = () => onClose();
    addEventListener("pointerdown", away, true); addEventListener("blur", leave); addEventListener("resize", leave); addEventListener("scroll", leave, true);
    return () => { removeEventListener("pointerdown", away, true); removeEventListener("blur", leave); removeEventListener("resize", leave); removeEventListener("scroll", leave, true); };
  }, []);
  const go = (step, from = active) => { const n = real.length; let k = real.findIndex(({i}) => i === from); if (k < 0) k = step > 0 ? -1 : n; for (let s = 0; s < n; s++) { k = (k + step + n) % n; if (!real[k].it.disabled) { setActive(real[k].i); return; } } };
  const choose = (i, el) => {
    const it = items[i]; if (!it || it === "-" || it.disabled) return;
    if (it.children) { const r = el.getBoundingClientRect(); setSub({i, at: {x: r.right + 2, y: r.top - 4, flipX: r.left - 2}}); return; }
    if (it.danger && armed !== i) { setArmed(i); return; }  // a delete asks once more in place: the item reads "Delete: click again"
    onClose(true); it.run && it.run();
  };
  const key = (e) => {
    if (sub) return;
    e.stopPropagation();
    const el = ref.current.querySelector(`[data-i="${active}"]`);
    if (e.key === "ArrowDown") { e.preventDefault(); go(1); }
    else if (e.key === "ArrowUp") { e.preventDefault(); go(-1); }
    else if (e.key === "Home") { e.preventDefault(); go(1, -1); }
    else if (e.key === "End") { e.preventDefault(); go(-1, -1); }
    else if (e.key === "Enter" || e.key === " ") { e.preventDefault(); el && choose(active, el); }
    else if (e.key === "ArrowRight" && items[active]?.children) { e.preventDefault(); choose(active, el); }
    else if (e.key === "Escape" || (e.key === "ArrowLeft" && depth)) { e.preventDefault(); onClose(false); }
    else if (e.key === "Tab") { e.preventDefault(); onClose(false); }
    else if (e.key.length === 1) { const hit = real.find(({it}) => !it.disabled && it.label.toLowerCase().startsWith(e.key.toLowerCase())); hit && setActive(hit.i); }
  };
  return (
    <div className="r18-menu" role="menu" tabIndex={-1} ref={ref} style={pos} onKeyDown={key} onContextMenu={(e) => e.preventDefault()} aria-label={head}>
      {head && !depth ? <div className="head">{head}</div> : null}
      {items.map((it, i) => it === "-" ? <div key={i} className="r18-sep" role="separator" /> : (
        <button key={i} data-i={i} role="menuitem" tabIndex={-1} aria-haspopup={it.children ? "menu" : undefined} aria-disabled={it.disabled ? "true" : undefined}
          className={["r18-mi", i === active && "active", it.danger && "danger", armed === i && "armed"].filter(Boolean).join(" ")}
          onMouseEnter={(e) => { setActive(i); if (it.children && !it.disabled) choose(i, e.currentTarget); else setSub(null); }}
          onClick={(e) => choose(i, e.currentTarget)} title={it.disabled || undefined}>
          <span className="t">{armed === i ? (it.armedLabel || `${it.label}: click again`) : it.label}</span>
          {it.disabled ? <span className="why">{it.short || ""}</span> : it.children ? <span className="sub">›</span> : it.keys ? <kbd>{it.keys}</kbd> : null}
        </button>))}
      {sub ? <ContextMenu depth={depth + 1} at={sub.at} items={items[sub.i].children} onClose={(done) => { setSub(null); if (done) onClose(true); else ref.current.focus(); }} /> : null}
    </div>);
}

// the hook every surface uses: right button at the pointer, Shift+F10 or the Menu key under the element; focus goes back to the element on close
function useContextMenu() {
  const [menu, setMenu] = useState(null);
  const back = useRef(null);
  const bind = (id, head, items) => ({
    onContextMenu: (e) => { e.preventDefault(); back.current = e.currentTarget; setMenu({id, head, items: items(), at: {x: e.clientX, y: e.clientY}}); },
    onKeyDown: (e) => { if ((e.shiftKey && e.key === "F10") || e.key === "ContextMenu") { e.preventDefault(); const r = e.currentTarget.getBoundingClientRect(); back.current = e.currentTarget; setMenu({id, head, items: items(), at: {x: r.left + 8, y: r.bottom + 2}}); } },
  });
  const close = () => { setMenu(null); back.current && back.current.isConnected && back.current.focus(); };
  const node = menu ? <ContextMenu key={menu.id + menu.at.x + menu.at.y} at={menu.at} head={menu.head} items={menu.items} onClose={close} /> : null;
  return {bind, node, target: menu?.id};
}

function useToastLine() {
  const [t, setT] = useState(null);
  useEffect(() => { if (!t) return; const h = setTimeout(() => setT(null), t.undo ? 6000 : 2400); return () => clearTimeout(h); }, [t]);
  return [t ? <div className="r18-toast" role="status">{t.text}{t.undo ? <button onClick={() => { t.undo(); setT(null); }}>Undo</button> : null}</div> : null, setT];
}

/* ---------- tabs ---------- */
function Tab({label, icon, on, target, onPick, onClose, menu, extra}) {
  return (
    <div role="tab" tabIndex={0} aria-selected={on} className={["r18-tab", on && "on", target && "target"].filter(Boolean).join(" ")}
      onClick={onPick} onMouseDown={(e) => { if (e.button === 1) e.preventDefault(); }} onAuxClick={(e) => { if (e.button === 1) { e.preventDefault(); onClose(); } }}
      onContextMenu={menu.onContextMenu}
      onKeyDown={(e) => { menu.onKeyDown(e); if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onPick(); } if (e.key === "Delete") onClose(); }}>
      <span className="ico">{icon}</span><span className="lbl">{label}</span>{extra}
      <button type="button" className="r18-x" tabIndex={-1} aria-label={`Close ${label}`} onPointerDown={(e) => e.stopPropagation()} onClick={(e) => { e.stopPropagation(); onClose(); }}>✕</button>
    </div>);
}

const R18_TREE = [
  {path: "src/core/modules/plans/support/plan_inspector.py", git: "M"},
  {path: "src/viewer/src/resource/Inspector.vue"},
  {path: "src/viewer/src/panes/PaneTabs.vue", git: "M"},
  {path: "src/viewer/src/kit/MenuPanel.vue"},
  {path: "src/viewer/src/kit/ContextMenu.vue", git: "A"},
  {path: "src/suites/coding/web/src/ProjectFiles.vue"},
];
const base = (p) => p.split("/").pop();
const iconOf = (p) => p.endsWith(".py") ? "py" : p.endsWith(".vue") ? "V" : "·";

function FilesDemo({cm, toast}) {
  const [tabs, setTabs] = useState(R18_TREE.slice(0, 4).map((f) => f.path));
  const [cur, setCur] = useState(R18_TREE[0].path);
  const [flash, setFlash] = useState(null);
  const [compact, setCompact] = useState(false);
  const close = (list) => { const rest = tabs.filter((t) => !list.includes(t)); setTabs(rest); if (list.includes(cur)) setCur(rest[Math.min(tabs.indexOf(cur), rest.length - 1)] || null); };
  const open = (p) => { if (!tabs.includes(p)) setTabs([...tabs, p]); setCur(p); };
  const copy = (text) => { navigator.clipboard?.writeText(text); toast({text: `Copied ${text}`}); };
  const reveal = (p) => { setFlash(p); setTimeout(() => setFlash(null), 1200); };
  const tabMenu = (p) => { const i = tabs.indexOf(p); return [
    {label: "Close", keys: "Del", run: () => close([p])},
    {label: "Close others", run: () => close(tabs.filter((t) => t !== p)), disabled: tabs.length < 2 && "The only tab", short: "only tab"},
    {label: "Close to the right", run: () => close(tabs.slice(i + 1)), disabled: i === tabs.length - 1 && "No tabs to the right", short: "none"},
    {label: "Close all", run: () => close(tabs)},
    "-",
    {label: "Copy path", run: () => copy(p)},
    {label: "Copy name", run: () => copy(base(p))},
    {label: "Reveal in Files", run: () => reveal(p)},
    "-",
    {label: "Comment on file", run: () => toast({text: "The comment box opens on the whole file"})},
  ]; };
  const rowMenu = (f) => [
    {label: tabs.includes(f.path) ? "Show" : "Open", keys: "↵", run: () => open(f.path)},
    {label: "Close", run: () => close([f.path]), disabled: !tabs.includes(f.path) && "Not open", short: "not open"},
    "-",
    {label: "Copy path", run: () => copy(f.path)},
    {label: "Copy name", run: () => copy(base(f.path))},
    {label: "Search in this folder", run: () => toast({text: `Search opens on ${f.path.split("/").slice(0, -1).join("/")}/`})},
    "-",
    {label: "Comment on file", run: () => toast({text: "The comment box opens on the whole file"})},
    {label: "Show changes in Git", run: () => toast({text: "Git opens on this file's diff"}), disabled: !f.git && "No changes", short: "no changes"},
  ];
  return (<section>
    <h2>File viewer</h2>
    <p className="r18-lead">Right-click a tab or a file name. Every tab keeps a 16 px slot for its cross; the cross shows on the open tab and on the tab under the pointer, so no tab grows or shifts. Middle click closes a tab. The tab a menu belongs to gets an accent ring while the menu is open; the open tab does not change.</p>
    <label className="r18-switch"><input type="checkbox" checked={compact} onChange={(e) => setCompact(e.target.checked)} /> Narrow pane (only the open tab shows its name)</label>
    <div className="r18-frame" style={{marginTop: 8}}>
      <div className={"r18-tabs" + (compact ? " compact" : "")} role="tablist">
        {tabs.map((p) => { const f = R18_TREE.find((x) => x.path === p); return <Tab key={p} label={base(p)} icon={iconOf(p)} on={p === cur} target={cm.target === "ft:" + p}
          extra={f?.git ? <span className={"gs " + f.git}>{f.git}</span> : null}
          onPick={() => setCur(p)} onClose={() => close([p])} menu={cm.bind("ft:" + p, p, () => tabMenu(p))} />; })}
      </div>
      <div className="r18-ide">
        <div className="r18-tree" role="tree">
          {R18_TREE.map((f) => { const b = cm.bind("fr:" + f.path, f.path, () => rowMenu(f)); return <div key={f.path} role="treeitem" tabIndex={0} title={f.path}
            className={["r18-row", f.path === cur && "on", cm.target === "fr:" + f.path && "target", flash === f.path && "flash"].filter(Boolean).join(" ")}
            onClick={() => open(f.path)} onContextMenu={b.onContextMenu}
            onKeyDown={(e) => { b.onKeyDown(e); if (e.key === "Enter") open(f.path); }}>
            <span className="faint mono" style={{width: 16, fontSize: 10}}>{iconOf(f.path)}</span><span className="grow ellipsis">{base(f.path)}</span>{f.git ? <span className={"gs mono " + f.git} style={{fontSize: 10}}>{f.git}</span> : null}</div>; })}
        </div>
        {cur ? <div className="r18-code">{`# ${cur}\n\nclass PlanInspector:\n    def sections(self):\n        return [...]`}</div> : <div className="r18-empty">No file open. Pick one in the tree, or press T to search.</div>}
      </div>
    </div>
  </section>);
}

const R18_PANES = [{id: "left", name: "Left pane"}, {id: "right", name: "Right pane"}];
function HomeDemo({cm, toast}) {
  const [panes, setPanes] = useState({left: ["Chat", "Tasks", "Agents"], right: ["Files", "Reminders"]});
  const [cur, setCur] = useState({left: "Chat", right: "Files"});
  const set = (pane, list, pick) => { setPanes((p) => ({...p, [pane]: list})); setCur((c) => { const want = pick ?? c[pane]; return {...c, [pane]: list.includes(want) ? want : list[list.length - 1] || null}; }); };
  const close = (pane, names) => { const before = panes[pane]; const was = cur[pane]; set(pane, before.filter((t) => !names.includes(t))); toast({text: names.length > 1 ? `Closed ${names.length} windows` : `Closed ${names[0]}`, undo: () => set(pane, before, was)}); };
  const move = (from, to, name) => { setPanes((p) => ({...p, [from]: p[from].filter((t) => t !== name), [to]: [...p[to], name]})); setCur((c) => ({...c, [to]: name, [from]: c[from] === name ? panes[from].filter((t) => t !== name)[0] || null : c[from]})); };
  const tabMenu = (pane, name) => { const list = panes[pane]; const i = list.indexOf(name); const other = R18_PANES.find((p) => p.id !== pane); return [
    {label: "Close", keys: "Del", run: () => close(pane, [name])},
    {label: "Close others", run: () => close(pane, list.filter((t) => t !== name)), disabled: list.length < 2 && "The only window in this pane", short: "only one"},
    {label: "Close to the right", run: () => close(pane, list.slice(i + 1)), disabled: i === list.length - 1 && "No windows to the right", short: "none"},
    "-",
    {label: "Duplicate", run: () => { let n = 2; while (list.includes(`${name} ${n}`)) n++; set(pane, [...list.slice(0, i + 1), `${name} ${n}`, ...list.slice(i + 1)], `${name} ${n}`); }},
    {label: "Move to", children: [
      {label: other.name, run: () => move(pane, other.id, name)},
      {label: "New pane on the right", run: () => toast({text: `${name} opens in a new pane on the right`})},
      {label: "New pane below", run: () => toast({text: `${name} opens in a new pane below`})},
      {label: "Floating window", run: () => toast({text: `${name} floats`})},
    ]},
    {label: "Split right", run: () => toast({text: `${name} splits to the right`}), disabled: list.length < 2 && "A pane with one window cannot split", short: "one window"},
    {label: "Split below", run: () => toast({text: `${name} splits below`}), disabled: list.length < 2 && "A pane with one window cannot split", short: "one window"},
    "-",
    {label: "Pane options…", run: () => toast({text: "The pane's own menu opens (PaneMenu)"})},
  ]; };
  return (<section>
    <h2>Home window tabs</h2>
    <p className="r18-lead">The same tabs and the same menu on the home screen. Closing a window can be undone from the toast for six seconds, since a pane's layout took work to make. Split right and below stay disabled with one window, as PaneMenu does today.</p>
    <div className="r18-frame r18-panes">
      {R18_PANES.map(({id}) => <div key={id}>
        <div className="r18-tabs" role="tablist">
          {panes[id].map((t) => <Tab key={t} label={t} icon="▪" on={cur[id] === t} target={cm.target === `ht:${id}:${t}`}
            onPick={() => setCur({...cur, [id]: t})} onClose={() => close(id, [t])} menu={cm.bind(`ht:${id}:${t}`, t, () => tabMenu(id, t))} />)}
        </div>
        <div className="r18-pane">{cur[id] ? `${cur[id]} window` : "No windows. Add one from the + bar."}</div>
      </div>)}
    </div>
  </section>);
}

// list windows: Open, Duplicate, Delete, and each window's own actions in the middle
// erase: Delete removes the row for good (a secret's value, user 121402), so it has no Undo toast
const R18_LISTS = [
  {kind: "Skills", one: "Skill", rows: [{name: "journal-memory", meta: "on"}, {name: "writing-story-tests", meta: "off", off: true}],
    own: (r) => [{label: r.off ? "Turn on" : "Turn off"}, {label: "Copy name"}]},
  {kind: "Memories", one: "Memory", rows: [{name: "Round 17 done in project 61d7ef82", meta: "8"}, {name: "Splash runs before React", meta: "8"}],
    own: () => [{label: "Weigh", children: [{label: "9: owed work"}, {label: "7: later today"}, {label: "5: work in hand"}]}, {label: "Edit"}], del: "Remove"},
  {kind: "Rules", one: "Rule", rows: [{name: "No attribution trailers", meta: "approved"}, {name: "Read narrowly", meta: "waiting"}],
    own: (r) => [{label: "Edit"}, r.meta === "waiting" ? {label: "Approve"} : {label: "Copy text"}]},
  {kind: "Templates", one: "Template", rows: [{name: "Bug report", meta: "task"}, {name: "Round report", meta: "report"}],
    own: () => [{label: "Use"}, {label: "Edit"}]},
  {kind: "Reminders", one: "Reminder", rows: [{name: "Check the install", meta: "every 60 min"}, {name: "Standup notes", meta: "paused", off: true}],
    own: (r) => [{label: r.off ? "Resume" : "Pause"}, {label: "Run now"}, {label: "Edit"}]},
  {kind: "Secrets", one: "Secret", rows: [{name: "GITHUB_TOKEN", meta: "set"}, {name: "LINEAR_KEY", meta: "set"}],
    own: () => [{label: "Replace value"}, {label: "Copy name"}], noDuplicate: "A secret's value is never copied", erase: true},
  {kind: "Plugins", one: "Plugin", rows: [{name: "coding", meta: "4.2.0"}, {name: "team", meta: "off", off: true}],
    own: (r) => [{label: r.off ? "Turn on" : "Turn off"}, {label: "Update", disabled: "Up to date", short: "up to date"}]},
];
function ListsDemo({cm, toast}) {
  const [gone, setGone] = useState([]);
  const wire = (items, row) => items.map((it) => it === "-" ? it : {...it, run: it.run || (() => toast({text: `${it.label}: ${row}`})), children: it.children && wire(it.children, row)});
  const remove = (L, r) => {
    const key = L.kind + r.name;
    setGone((g) => [...g, key]);
    if (L.erase) { toast({text: `Deleted ${r.name}. Its value is erased.`}); return; }
    toast({text: `${L.del === "Remove" ? "Removed" : "Deleted"} ${r.name}`, undo: () => setGone((g) => g.filter((k) => k !== key))});
  };
  const menu = (L, r) => wire([
    {label: "Open", keys: "↵"},
    {label: "Duplicate", disabled: L.noDuplicate, short: L.noDuplicate && "not for secrets"},
    "-", ...L.own(r), "-",
    {label: L.del || "Delete", danger: true, armedLabel: L.erase ? "Click again: the value is erased for good" : undefined, run: () => remove(L, r)},
  ], r.name);
  return (<section>
    <h2>List items</h2>
    <p className="r18-lead">Every list window gives the same frame: Open and Duplicate on top, the window's own actions in the middle, Delete last in red. Delete asks once more in place (the item turns red and says click again), then an Undo toast follows for six seconds where the server can restore the row. A secret's Delete erases it for good: it asks once in place, says the value is erased, and has no Undo.</p>
    <div className="r18-lists">
      {R18_LISTS.map((L) => <div key={L.kind} className="r18-frame r18-list"><h4>{L.kind}</h4>
        {L.rows.filter((r) => !gone.includes(L.kind + r.name)).map((r) => { const b = cm.bind(`l:${L.kind}:${r.name}`, `${L.one}: ${r.name}`, () => menu(L, r)); return <div key={r.name} tabIndex={0} role="button"
          className={["r18-row", r.off && "off", cm.target === `l:${L.kind}:${r.name}` && "target"].filter(Boolean).join(" ")}
          onContextMenu={b.onContextMenu} onKeyDown={b.onKeyDown}>
          <span className="name ellipsis">{r.name}</span><span className="meta">{r.meta}</span></div>; })}
      </div>)}
    </div>
  </section>);
}

function RoundEighteen() {
  const cm = useContextMenu();
  const [toastNode, toast] = useToastLine();
  return (<div className="r18">
    <div className="r18-main">
      <FilesDemo cm={cm} toast={toast} />
      <HomeDemo cm={cm} toast={toast} />
      <ListsDemo cm={cm} toast={toast} />
    </div>
    <aside className="r18-side">
      <h3>Round eighteen · user 121555</h3>
      <p>Right-click anything that has actions. One menu component everywhere: kit/ContextMenu.vue, drawn in the MenuPanel style.</p>
      <h3>Open it</h3>
      <ul><li>Right button: at the pointer</li><li><kbd>Shift F10</kbd> or the Menu key: under the focused tab or row</li><li>Middle button on a tab: closes it</li><li><kbd>Del</kbd> on a focused tab: closes it</li></ul>
      <h3>In the menu</h3>
      <ul><li><kbd>↑ ↓</kbd> move, <kbd>Home End</kbd> jump to the ends</li><li><kbd>↵</kbd> or <kbd>Space</kbd> runs</li><li><kbd>→</kbd> opens a submenu, <kbd>←</kbd> closes it</li><li>A letter jumps to the first item starting with it</li><li><kbd>Esc</kbd>, <kbd>Tab</kbd>, a click outside, a scroll, a resize or leaving the browser closes it; focus returns to the tab or row</li></ul>
      <h3>Rules</h3>
      <ul><li>Groups: open and close, copy and reveal, the window's own, delete last</li><li>A disabled item stays in place, dimmed, with a short reason, so the menu keeps its shape</li><li>Key hints show only keys that really work</li><li>Delete asks once in place; an Undo toast follows, except for a secret, whose value is erased for good</li><li>Text fields, selected text and plain links keep the browser's own menu: copy and paste must still work</li><li>The menu stays on screen: it flips left or up at an edge</li></ul>
      <h3>Tabs</h3>
      <ul><li>A 16 px slot for the cross on every tab</li><li>Cross shown on the open tab, the hovered tab, the focused tab and the tab whose menu is open</li><li>No more 0.5 s grow-in (PaneTabs.vue:172-204): nothing shifts</li><li>Narrow pane: the cross takes the icon's place on hover</li></ul>
    </aside>
    {cm.node}{toastNode}
  </div>);
}

ReactDOM.createRoot(document.getElementById("root")).render(<RoundEighteen />);
