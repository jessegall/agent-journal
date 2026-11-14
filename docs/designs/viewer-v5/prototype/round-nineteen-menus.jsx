// Round nineteen (user 121802): the journal's own context menu everywhere in the prototype. Loaded last, before app.jsx.
// Replaces by name: NowPane (home tabs get the IDE cross and their own menu).
// 1. One window-wide listener cancels the browser's menu on every right click (event.preventDefault on contextmenu) and opens
//    the journal's menu (round eighteen's ContextMenu, drawn by round-eighteen.css) with the items of the place clicked.
// 2. A component may open its own menu first (the home tabs do) and marks the event, so the listener leaves it alone.
// 3. Shift+F10 and the Menu key open the same menu under the focused element. The element the menu belongs to gets the accent ring.
// 4. Text fields and selected text get Cut, Copy, Paste and Select all, since the browser's menu is gone there too.
// 5. An item runs after the menu has closed, outside the click that chose it, so the window it acts on updates as on a plain click.

/* ---------- the one menu (round eighteen's ContextMenu, with React's hooks by name so no script's names clash) ---------- */
function AJContextMenu({at, head, items, onClose, depth = 0}) {
  const ref = React.useRef(null);
  const real = items.map((it, i) => ({it, i})).filter(({it}) => it !== "-");
  const [active, setActive] = React.useState(depth ? real.find(({it}) => !it.disabled)?.i ?? -1 : -1);
  const [sub, setSub] = React.useState(null);
  const [armed, setArmed] = React.useState(null);
  const [pos, setPos] = React.useState({left: at.x, top: at.y});
  React.useLayoutEffect(() => {
    const r = ref.current.getBoundingClientRect();
    const left = at.x + r.width > innerWidth - 8 ? Math.max(8, (at.flipX ?? at.x) - r.width) : at.x;
    const top = at.y + r.height > innerHeight - 8 ? Math.max(8, innerHeight - 8 - r.height) : at.y;
    setPos({left, top});
    ref.current.focus();
  }, [at.x, at.y]);
  React.useEffect(() => {
    if (depth) return;
    const away = (e) => { if (!e.target.closest(".r18-menu")) onClose(false); };
    const leave = () => onClose(false);
    const scrolled = (e) => { if (!e.target.closest?.(".r18-menu")) onClose(false); };
    addEventListener("pointerdown", away, true); addEventListener("blur", leave); addEventListener("resize", leave); addEventListener("scroll", scrolled, true);
    return () => { removeEventListener("pointerdown", away, true); removeEventListener("blur", leave); removeEventListener("resize", leave); removeEventListener("scroll", scrolled, true); };
  }, []);
  const go = (step, from = active) => { const n = real.length; let k = real.findIndex(({i}) => i === from); if (k < 0) k = step > 0 ? -1 : n; for (let s = 0; s < n; s++) { k = (k + step + n) % n; if (!real[k].it.disabled) { setActive(real[k].i); return; } } };
  const choose = (i, el) => {
    const it = items[i]; if (!it || it === "-" || it.disabled) return;
    if (it.children) { const r = el.getBoundingClientRect(); setSub({i, at: {x: r.right + 2, y: r.top - 4, flipX: r.left - 2}}); return; }
    if (it.danger && armed !== i) { setArmed(i); return; }
    onClose(true);
    if (it.run) setTimeout(it.run, 0);
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
    <div className="r18-menu" role="menu" tabIndex={-1} ref={ref} style={pos} onKeyDown={key} onContextMenu={(e) => { e.preventDefault(); e.nativeEvent.ajDone = true; }} aria-label={head}>
      {head && !depth ? <div className="head">{head}</div> : null}
      {items.map((it, i) => it === "-" ? <div key={i} className="r18-sep" role="separator" /> : (
        <button key={i} data-i={i} type="button" role="menuitem" tabIndex={-1} aria-haspopup={it.children ? "menu" : undefined} aria-disabled={it.disabled ? "true" : undefined}
          className={["r18-mi", i === active && "active", it.danger && "danger", armed === i && "armed"].filter(Boolean).join(" ")}
          onMouseEnter={(e) => { setActive(i); if (it.children && !it.disabled) choose(i, e.currentTarget); else setSub(null); }}
          onClick={(e) => choose(i, e.currentTarget)} title={typeof it.disabled === "string" ? it.disabled : undefined}>
          <span className="t">{armed === i ? (it.armedLabel || `${it.label}: click again`) : it.label}</span>
          {it.disabled ? <span className="why">{it.short || ""}</span> : it.children ? <span className="sub">›</span> : it.keys ? <kbd>{it.keys}</kbd> : null}
        </button>))}
      {sub ? <AJContextMenu depth={depth + 1} at={sub.at} items={items[sub.i].children} onClose={(done) => { setSub(null); if (done) onClose(true); else ref.current.focus(); }} /> : null}
    </div>);
}

/* ---------- the host: one menu and one toast for the whole page, in its own root over the app ---------- */
const AJ_MENU = {set: null, toast: null, openedAt: 0};
function ajOpenMenu(at, head, items, el) {
  if (!items || !items.length || !AJ_MENU.set) return;
  AJ_MENU.openedAt = performance.now();
  AJ_MENU.set({at, head, items, el, key: AJ_MENU.openedAt});
}
const ajSay = (text, undo) => AJ_MENU.toast && AJ_MENU.toast({text, undo, key: performance.now()});
function AJMenuHost() {
  const [m, setM] = React.useState(null);
  const [t, setT] = React.useState(null);
  AJ_MENU.set = setM; AJ_MENU.toast = setT;
  React.useEffect(() => { if (!m?.el) return; const el = m.el; el.classList.add("aj-target"); return () => el.classList.remove("aj-target"); }, [m]);
  React.useEffect(() => { if (!t) return; const h = setTimeout(() => setT(null), t.undo ? 6000 : 2400); return () => clearTimeout(h); }, [t]);
  const close = () => { const el = m?.el; setM(null); if (el && el.isConnected && el.focus) el.focus({preventScroll: true}); };
  return <>
    {m ? <AJContextMenu key={m.key} at={m.at} head={m.head} items={m.items} onClose={close} /> : null}
    {t ? <div className="r18-toast" role="status">{t.text}{t.undo ? <button type="button" onClick={() => { t.undo(); setT(null); }}>Undo</button> : null}</div> : null}
  </>;
}

/* ---------- small helpers the items use ---------- */
const ajText = (el) => (el?.innerText || el?.textContent || "").trim().replace(/\s+/g, " ");
const ajShort = (s, n = 48) => (s.length > n ? s.slice(0, n - 1) + "…" : s);
const ajCopy = (text, what) => { navigator.clipboard?.writeText(text).catch(() => {}); ajSay(`Copied ${what || ajShort(text, 40)}`); };
const ajClick = (el) => el && el.click();
// clicks one after another, a frame apart, so each window updates before the next click (Close others, Close all)
const ajClickEach = (els) => { const next = (i) => { if (i >= els.length) return; ajClick(els[i]); requestAnimationFrame(() => next(i + 1)); }; next(0); };
const ajPage = (el) => el.closest("[data-screen-label]")?.dataset.screenLabel || "Viewer";
const ajDelete = (word, name, erase) => erase
  ? {label: word, danger: true, armedLabel: "Click again: the value is erased for good", run: () => ajSay(`Deleted ${name}. Its value is erased.`)}
  : {label: word, danger: true, run: () => ajSay(`${word === "Remove" ? "Removed" : "Deleted"} ${name}`, () => ajSay(`${name} is back`))};

/* ---------- text: fields and selected text keep copy and paste, now in the journal's menu ---------- */
function ajFieldItems(f) {
  const picked = f.selectionStart != null ? f.value.slice(f.selectionStart, f.selectionEnd) : String(getSelection());
  const locked = f.readOnly || f.disabled;
  return [
    {label: "Cut", keys: "⌘X", disabled: (!picked || locked) && "Nothing chosen", short: "", run: () => { f.focus(); document.execCommand("cut"); }},
    {label: "Copy", keys: "⌘C", disabled: !picked && "Nothing chosen", short: "", run: () => ajCopy(picked)},
    {label: "Paste", keys: "⌘V", disabled: locked && "Read only", short: "", run: () => { f.focus(); navigator.clipboard?.readText().then((s) => document.execCommand("insertText", false, s)).catch(() => ajSay("The browser did not allow pasting: use ⌘V")); }},
    "-",
    {label: "Select all", keys: "⌘A", run: () => { f.focus(); f.select ? f.select() : document.execCommand("selectAll"); }},
  ];
}
function ajSelectionItems(picked) {
  return [
    {label: "Copy", keys: "⌘C", run: () => ajCopy(picked)},
    {label: "Search for it", run: () => ajSay(`Search opens on “${ajShort(picked, 30)}”`)},
    {label: "Quote in a comment", run: () => ajSay("The comment box opens with the quote")},
  ];
}

/* ---------- list rows: Open, Duplicate, the page's own actions, Delete (round eighteen) ---------- */
const AJ_OWN = {
  Skills: (n) => [{label: "Turn on or off"}, {label: "Copy name", run: () => ajCopy(n)}],
  Memories: () => [{label: "Weigh", children: [{label: "9: owed work"}, {label: "7: later today"}, {label: "5: work in hand"}]}, {label: "Edit"}],
  Rules: () => [{label: "Edit"}, {label: "Approve"}],
  Templates: () => [{label: "Use"}, {label: "Edit"}],
  Reminders: () => [{label: "Pause or resume"}, {label: "Run now"}, {label: "Edit"}],
  Secrets: (n) => [{label: "Replace value"}, {label: "Copy name", run: () => ajCopy(n)}],
  Plugins: () => [{label: "Turn on or off"}, {label: "Update"}],
  Integrations: () => [{label: "Settings"}, {label: "Test connection"}],
  Sequences: () => [{label: "Run"}, {label: "Edit"}],
  Profiles: () => [{label: "Edit"}, {label: "Start an agent with it"}],
  Teams: (n) => [{label: "Message"}, {label: "Copy name", run: () => ajCopy(n)}],
};
const AJ_DELETE_WORD = {Memories: "Remove"};
const AJ_NO_DELETE = new Set(["Git", "Search", "Documents", "Reports", "Teams"]);
function ajListItems(row) {
  const page = ajPage(row);
  const name = ajText(row.querySelector(".t")) || ajText(row);
  const say = (it) => ({...it, run: it.run || (() => ajSay(`${it.label}: ${ajShort(name, 30)}`)), children: it.children && it.children.map(say)});
  const own = (AJ_OWN[page] || (() => [{label: "Copy title", run: () => ajCopy(name)}]))(name).map(say);
  const secret = page === "Secrets";
  return {head: `${page}: ${ajShort(name, 36)}`, items: [
    {label: "Open", keys: "↵", run: () => ajClick(row)},
    ...(AJ_NO_DELETE.has(page) ? [] : [{label: "Duplicate", disabled: secret && "A secret's value is never copied", short: secret ? "not for secrets" : "", run: () => ajSay(`Duplicated ${name}`)}]),
    "-", ...own,
    ...(AJ_NO_DELETE.has(page) ? [] : ["-", ajDelete(AJ_DELETE_WORD[page] || "Delete", name, secret)]),
  ]};
}

/* ---------- every place, most particular first: [selector, (element) => {head, items}] ---------- */
const AJ_PLACES = [
  // a file viewer tab (pages.jsx FilesPage .etab, its cross is .x)
  [".etab", (el) => {
    const path = el.title, name = path.split("/").pop();
    const tabs = [...el.parentElement.querySelectorAll(".etab")], i = tabs.indexOf(el);
    const shut = (list) => ajClickEach(list.map((t) => t.querySelector(".x")));
    return {head: path, items: [
      {label: "Close", keys: "Del", run: () => shut([el])},
      {label: "Close others", disabled: tabs.length < 2 && "The only tab", short: "only tab", run: () => shut(tabs.filter((t) => t !== el))},
      {label: "Close to the right", disabled: i === tabs.length - 1 && "No tabs to the right", short: "none", run: () => shut(tabs.slice(i + 1))},
      {label: "Close all", run: () => shut(tabs)},
      "-",
      {label: "Copy path", run: () => ajCopy(path)},
      {label: "Copy name", run: () => ajCopy(name)},
      {label: "Reveal in Files", run: () => { const hit = [...document.querySelectorAll(".tree *")].find((n) => n.children.length === 0 && n.textContent.trim() === name); const row = hit?.closest("button, [role=treeitem], [tabindex]") || hit; if (row) { row.scrollIntoView({block: "nearest"}); row.classList.add("aj-flash"); setTimeout(() => row.classList.remove("aj-flash"), 1200); } }},
      "-",
      {label: "Comment on file", run: () => ajSay("The comment box opens on the whole file")},
    ]};
  }],
  // a file name in the tree
  [".tree button, .tree [role=treeitem]", (el) => {
    const name = ajText(el), path = el.title || name;
    const isOpen = [...document.querySelectorAll(".etab")].some((t) => t.title.endsWith("/" + name) || t.title === name);
    return {head: path, items: [
      {label: isOpen ? "Show" : "Open", keys: "↵", run: () => ajClick(el)},
      "-",
      {label: "Copy path", run: () => ajCopy(path)},
      {label: "Copy name", run: () => ajCopy(name)},
      {label: "Search in this folder", run: () => ajSay("Search opens on this folder")},
      "-",
      {label: "Comment on file", run: () => ajSay("The comment box opens on the whole file")},
      {label: "Show changes in Git", run: () => ajSay("Git opens on this file's diff")},
    ]};
  }],
  // a line of code in the file viewer
  [".code .ln", (el) => {
    const n = ajText(el.querySelector(".no")), path = document.querySelector(".etab.on")?.title || "";
    return {head: `Line ${n}`, items: [
      {label: "Comment on this line", run: () => ajClick(el.querySelector(".no"))},
      {label: "Copy line", run: () => ajCopy(ajText(el.lastElementChild))},
      {label: "Copy path and line", run: () => ajCopy(`${path}:${n}`)},
    ]};
  }],
  // a row reference anywhere, before the row around it: plan 1131 on an agent card, task 9682 in a queue row
  [".rc, .ref-link, .r8-ref, .row-card, .q9-a, [role=link]", (el) => {
    const words = el.title || ajText(el);
    return {head: words, items: [
      {label: "Open", keys: "↵", run: () => ajClick(el)},
      {label: "Copy reference", run: () => ajCopy(words.toLowerCase())},
    ]};
  }],
  // an agent card (round fifteen's R8Card)
  [".r8-card", (el) => {
    const name = ajText(el.querySelector(".r8-title"));
    const ended = ["ended", "retired"].includes(el.dataset.state);
    return {head: name, items: [
      {label: "Open", keys: "↵", run: () => ajClick(el)},
      {label: "Message", disabled: ended && "Process stopped", short: "stopped", run: () => ajSay(`The message box opens for ${name}`)},
      {label: "Pause", disabled: ended && "Process stopped", short: "stopped", run: () => ajSay(`${name} paused`)},
      "-",
      {label: "Copy name", run: () => ajCopy(name)},
      {label: "Open its plan", disabled: !el.querySelector(".r8-ref:not(.quiet)") && "No plan", short: "no plan", run: () => ajClick(el.querySelector(".r8-ref:not(.quiet)"))},
      {label: "Open its task", disabled: !el.querySelector(".r8-ref.quiet") && "No task", short: "no task", run: () => ajClick(el.querySelector(".r8-ref.quiet"))},
      "-",
      ended ? {label: "Retire", danger: true, run: () => ajSay(`${name} retired`)} : {label: "Stop", danger: true, run: () => ajSay(`${name} stopped`)},
    ]};
  }],
  // a task row (the Tasks window)
  [".tk-row", (el) => {
    const id = ajText(el.querySelector(".id")), title = ajText(el.querySelector(".t"));
    return {head: `Task ${id}`, items: [
      {label: "Open", keys: "↵", run: () => ajClick(el)},
      "-",
      {label: "Copy number", run: () => ajCopy(`task ${id}`)},
      {label: "Copy title", run: () => ajCopy(title)},
      "-",
      {label: "Mark done", run: () => ajSay(`Task ${id} completed`)},
      {label: "Block", run: () => ajSay(`Task ${id} blocked`)},
      "-",
      {label: "Cancel task", danger: true, run: () => ajSay(`Task ${id} cancelled`, () => ajSay(`Task ${id} is open again`))},
    ]};
  }],
  // a chat message
  [".message", (el) => {
    const text = ajText(el.querySelector(".message-card"));
    const faces = ["👍", "❤️", "😂", "🎉", "👀", "🙏"];
    return {head: ajShort(text, 40), items: [
      {label: "Reply", run: () => { const box = document.querySelector("textarea"); box ? box.focus() : ajSay("The reply box opens"); }},
      {label: "React", children: faces.map((f) => ({label: f, run: () => ajSay(`Reacted ${f}`)}))},
      "-",
      {label: "Copy text", run: () => ajCopy(text, "the message")},
      {label: "Copy link", run: () => ajCopy(location.href.split("#")[0] + "#message", "the link")},
      {label: "Pin to the top of the chat", run: () => ajSay("Pinned")},
    ]};
  }],
  // a process in the queue
  [".q9-run", (el) => {
    const cmd = ajText(el.querySelector(".q9-cmd")), section = el.dataset.section, opened = el.classList.contains("open");
    return {head: ajShort(cmd, 40), items: [
      {label: opened ? "Hide output" : "Show output", run: () => ajClick(el.querySelector(".q9-line"))},
      {label: "Copy command", run: () => ajCopy(cmd)},
      {label: "Open its task", disabled: !el.querySelector(".q9-a") && "No task", short: "no task", run: () => ajClick(el.querySelector(".q9-a"))},
      "-",
      section === "finished" ? {label: "Run again", run: () => ajSay("Queued again")}
        : {label: section === "waiting" ? "Take out of the queue" : "Stop", danger: true, run: () => ajSay(section === "waiting" ? "Taken out of the queue" : "Stopped")},
    ]};
  }],
  // a memory of an agent
  [".mem-row", (el) => {
    const n = ajText(el.querySelector(".n")), text = ajText(el.querySelector(".t"));
    return {head: `Memory ${n}`, items: [
      {label: "Open", keys: "↵", run: () => ajClick(el)},
      {label: "Weigh", children: [9, 7, 5].map((w) => ({label: `${w}`, run: () => ajSay(`Memory ${n} weighs ${w}`)}))},
      {label: "Copy text", run: () => ajCopy(text)},
      "-",
      ajDelete("Remove", `memory ${n}`),
    ]};
  }],
  // a row of a list page
  [".lrow", (el) => ajListItems(el)],
  // a card of a card page (plugins, integrations, checks)
  [".card.r16-card", (el) => {
    const name = ajText(el.querySelector("h3")), page = ajPage(el);
    return {head: `${page}: ${name}`, items: [
      {label: "Settings", run: () => ajSay(`${name} settings open`)},
      {label: "Turn on or off", disabled: !el.querySelector(".switch, [role=switch]") && "No switch", short: "", run: () => ajClick(el.querySelector(".switch, [role=switch]"))},
      {label: "Copy name", run: () => ajCopy(name)},
      "-",
      ajDelete("Remove", name),
    ]};
  }],
  // a row of a table page
  [".tbl tbody tr", (el) => {
    const first = ajText(el.cells[0]), line = ajText(el);
    return {head: ajShort(line, 40), items: [
      {label: "Open", keys: "↵", run: () => ajClick(el)},
      {label: "Copy number", run: () => ajCopy(first)},
      {label: "Copy row", run: () => ajCopy(line)},
    ]};
  }],
  // a file in the file feed
  [".now-diff-head", (el) => {
    const path = el.querySelector(".now-diff-path")?.title || ajText(el);
    const folded = el.closest(".now-diff")?.classList.contains("folded");
    return {head: path, items: [
      {label: "Open file", run: () => ajClick(el.querySelector(".now-diff-name"))},
      {label: folded ? "Unfold" : "Fold", run: () => ajClick(el)},
      "-",
      {label: "Copy path", run: () => ajCopy(path)},
    ]};
  }],
  // a command in the terminal
  [".now-trow", (el) => {
    const cmd = ajText(el.querySelector(".now-ttext"));
    return {head: ajShort(cmd, 40), items: [
      {label: "Show output", run: () => ajClick(el.querySelector(".now-ttext"))},
      {label: "Copy command", run: () => ajCopy(cmd)},
      {label: "Run again", run: () => ajSay("Sent")},
    ]};
  }],
  // a tab not drawn by NowPane: show it
  ["[role=tab]", (el) => ({head: ajText(el) || el.title, items: [{label: "Show", run: () => ajClick(el)}]})],
  // any other control: its own action under its own name, and its words to copy
  ["button, [role=button], a[href], summary", (el) => {
    const name = el.getAttribute("aria-label") || el.title || ajText(el);
    if (!name) return null;
    return {head: ajShort(name, 40), items: [{label: ajShort(name, 32), run: () => ajClick(el)}, {label: "Copy words", run: () => ajCopy(name)}]};
  }],
];
// the page itself: where nothing else fits
const ajPageItems = (el) => ({head: ajPage(el), items: [
  {label: "Search", keys: "⌘K", run: () => document.dispatchEvent(new KeyboardEvent("keydown", {key: "k", metaKey: true, bubbles: true}))},
  {label: "Copy link to this page", run: () => ajCopy(location.href, "the link")},
  "-",
  {label: "Reload", run: () => location.reload()},
]});

function ajFind(target) {
  const field = target.closest("input:not([type=checkbox]):not([type=radio]):not([type=range]), textarea, [contenteditable=true]");
  if (field) return {head: "Text", items: ajFieldItems(field), el: field};
  const picked = String(getSelection()).trim();
  if (picked && getSelection().rangeCount && getSelection().getRangeAt(0).intersectsNode(target)) return {head: `“${ajShort(picked, 34)}”`, items: ajSelectionItems(picked), el: null};
  for (const [sel, make] of AJ_PLACES) {
    const el = target.closest(sel);
    if (!el) continue;
    const made = make(el);
    if (made) return {...made, el};
  }
  return {...ajPageItems(target), el: null};
}

/* ---------- the listeners: after React's own (they run on #root), so a component that opened its own menu wins ---------- */
if (!window.__ajMenus) {
  window.__ajMenus = true;
  addEventListener("contextmenu", (e) => {
    e.preventDefault();
    if (e.ajDone || e.target.closest?.(".r18-menu")) return;
    if (performance.now() - AJ_MENU.openedAt < 60) return;
    const found = ajFind(e.target);
    ajOpenMenu({x: e.clientX, y: e.clientY}, found.head, found.items, found.el);
  });
  // Shift+F10 or the Menu key: the menu of the focused element, under it
  addEventListener("keydown", (e) => {
    if (!((e.shiftKey && e.key === "F10") || e.key === "ContextMenu")) return;
    e.preventDefault();
    const el = document.activeElement && document.activeElement !== document.body ? document.activeElement : document.querySelector("#root");
    const r = el.getBoundingClientRect();
    el.dispatchEvent(new MouseEvent("contextmenu", {bubbles: true, cancelable: true, clientX: Math.max(8, r.left + 8), clientY: Math.min(innerHeight - 8, r.bottom + 2)}));
  });
  const spot = document.createElement("div");
  spot.id = "aj-menus";
  document.body.appendChild(spot);
  ReactDOM.createRoot(spot).render(<AJMenuHost />);
}

/* ---------- home pane tabs: PaneTabs.vue with the IDE cross and their own menu (Close, Duplicate, Move, Split) ---------- */
const AJ_PANES = [];
const ajBase = (k) => String(k).split("#")[0];
const ajTitle = (k) => { const [b, n] = String(k).split("#"); return (NOW_TITLES[b]?.[0] || b) + (n ? ` ${n}` : ""); };
const ajFresh = (k, taken) => { let n = 2; while (taken.includes(`${ajBase(k)}#${n}`)) n++; return `${ajBase(k)}#${n}`; };
function NowPane({tabs, setTabs, active, setActive, shared}) {
  const me = React.useRef(null);
  const box = React.useRef(null);
  me.current = {tabs, setTabs, active, setActive};
  React.useEffect(() => { AJ_PANES.push(me); return () => { AJ_PANES.splice(AJ_PANES.indexOf(me), 1); }; }, []);
  const W = active != null ? NOW_WINDOWS[ajBase(active)] : null;
  const close = (keys) => {
    const before = tabs, was = active;
    const rest = tabs.filter((k) => !keys.includes(k));
    setTabs(rest);
    if (keys.includes(active)) setActive(rest[Math.max(0, tabs.indexOf(active) - 1)] ?? rest[0] ?? null);
    ajSay(keys.length > 1 ? `Closed ${keys.length} windows` : `Closed ${ajTitle(keys[0])}`, () => { setTabs(before); setActive(was); });
  };
  const others = () => AJ_PANES.filter((p) => p !== me).map((p) => p.current);
  const move = (k, to) => { const key = to.tabs.includes(k) ? ajFresh(k, to.tabs) : k; to.setTabs([...to.tabs, key]); to.setActive(key); const rest = tabs.filter((x) => x !== k); setTabs(rest); if (k === active) setActive(rest[0] ?? null); };
  const menu = (k) => {
    const i = tabs.indexOf(k);
    return [
      {label: "Close", keys: "Del", run: () => close([k])},
      {label: "Close others", disabled: tabs.length < 2 && "The only window in this pane", short: "only one", run: () => close(tabs.filter((x) => x !== k))},
      {label: "Close to the right", disabled: i === tabs.length - 1 && "No windows to the right", short: "none", run: () => close(tabs.slice(i + 1))},
      "-",
      {label: "Duplicate", run: () => { const key = ajFresh(k, tabs); setTabs([...tabs.slice(0, i + 1), key, ...tabs.slice(i + 1)]); setActive(key); }},
      {label: "Move to", children: [
        ...others().map((to, n) => ({label: n === 0 && AJ_PANES.length === 2 ? "The other pane" : `Pane ${n + 1}`, run: () => move(k, to)})),
        {label: "New pane on the right", run: () => ajSay(`${ajTitle(k)} opens in a new pane on the right`)},
        {label: "New pane below", run: () => ajSay(`${ajTitle(k)} opens in a new pane below`)},
        {label: "Floating window", run: () => ajSay(`${ajTitle(k)} floats`)},
      ]},
      {label: "Split right", disabled: tabs.length < 2 && "A pane with one window cannot split", short: "one window", run: () => ajSay(`${ajTitle(k)} splits to the right`)},
      {label: "Split below", disabled: tabs.length < 2 && "A pane with one window cannot split", short: "one window", run: () => ajSay(`${ajTitle(k)} splits below`)},
      "-",
      {label: "Pane options…", run: () => ajClick(box.current?.querySelector('[title="Pane"]'))},
    ];
  };
  return <div className="now-pane" ref={box}>
    <div className="now-ptabs">
      <div className="now-ptabs-row" role="tablist">{tabs.map((k) => { const b = ajBase(k); const title = ajTitle(k); return <button key={k} type="button" role="tab" aria-selected={k === active} title={title}
        className={"now-ptab aj-tab" + (k === active ? " on" : "")} onClick={() => setActive(k)}
        onMouseDown={(e) => { if (e.button === 1) e.preventDefault(); }} onAuxClick={(e) => { if (e.button === 1) { e.preventDefault(); close([k]); } }}
        onKeyDown={(e) => { if (e.key === "Delete") { e.preventDefault(); close([k]); } }}
        onContextMenu={(e) => { e.preventDefault(); e.nativeEvent.ajDone = true; ajOpenMenu({x: e.clientX, y: e.clientY}, title, menu(k), e.currentTarget); }}>
        <Icon name={NOW_TITLES[b]?.[1] || "widget"} size={12} /><span>{title}</span>{NOW_COUNTS[b] != null && <span className={"n" + (b === "questions" ? " hot" : "")}>{NOW_COUNTS[b]}</span>}
        <span className="aj-x" role="button" aria-label={`Close ${title}`} onClick={(e) => { e.stopPropagation(); close([k]); }}><Icon name="close" size={9} /></span>
      </button>; })}</div>
      <Menu width={300} button={({toggle}) => <Btn icon="plus" small title="Window" onClick={toggle} />}>{(done) => WINDOW_GROUPS.map((g, gi) => <React.Fragment key={g.title}>{gi > 0 && <div className="menu-sep" />}<div className="menu-label">{g.title}</div>{g.items.filter(([k]) => NOW_TITLES[k]).map(([k, l, i, d]) => <MenuItem key={k} icon={i} desc={d} hint={tabs.includes(k) ? "Open" : null} onClick={() => { if (!tabs.includes(k)) setTabs([...tabs, k]); setActive(k); done(); }}>{l}</MenuItem>)}</React.Fragment>)}</Menu>
      <Menu width={220} button={({toggle}) => <Btn icon="dots" small title="Pane" onClick={toggle} />}>{(done) => <><MenuItem icon="sidebar" onClick={done}>Split right</MenuItem><MenuItem icon="down" onClick={done}>Split below</MenuItem><MenuItem icon="open" onClick={done}>Detach</MenuItem><div className="menu-sep" /><MenuItem icon="close" onClick={done}>Close pane</MenuItem></>}</Menu>
    </div>
    <div className="now-pbody">{W ? <W {...shared} /> : <Empty title="No windows" line="Add one with the + button" />}</div>
  </div>;
}

Object.assign(window, {AJContextMenu, ajOpenMenu, ajSay, AJ_PLACES, NowPane});
