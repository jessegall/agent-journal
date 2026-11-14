// Round twelve (messages 121169 and 121171): no sentence labels. Use an icon where an icon will do; where a label stays, it is a plain
// short word or noun phrase (Output, Logs, Retry). Replaces by name: Btn, MenuItem, MenuButton, CommentBox, and from rounds eight and nine
// R8Overview, Q9Row and Q9Queue, whose text links become icons or words.
// Every label of every screen passes through Btn, MenuItem or MenuButton (an Actions entry, its confirm, a primary step, a menu, an empty
// state's button), so one vocabulary, PLAIN_LABELS, decides them all:
//  1. a label in PLAIN_LABELS takes its short word;
//  2. a label that opens or shows something (Open, Show, View, Go to, Browse, Inspect) is the open icon, its tooltip naming what opens;
//  3. otherwise articles and possessives go (the, a, an, this, its, your, my);
//  4. a label still longer than three words is logged to the console, for the next sweep.

const PLAIN_LABELS = {
  // context and sharing
  "Copy the context command": "Copy command", "Copy the read command": "Copy command", "Mention in the chat": "Mention", "Copy a share link": "Share link", "Copy its name": "Copy name",
  // who works on it
  "Assign to an agent": "Assign", "Let the main agent pick": "Auto-assign",
  // state
  "Mark ready": "Ready", "Pause the plan": "Pause", "Complete the plan": "Complete", "Reopen the plan": "Reopen", "Cancel the plan": "Cancel",
  "Complete the task": "Complete", "Block the task": "Block", "Cancel the task": "Cancel", "Send back to work": "Send back",
  "Pause the agent": "Pause", "Resume the agent": "Resume", "Stop the session": "Stop", "Send a message": "Message", "Compact the context": "Compact", "Change the model": "Model",
  "Pause the queue": "Pause", "Resume the queue": "Resume", "Stop it": "Stop", "Keep it running": "Keep running", "Start an agent": "Start",
  // text and memory
  "Edit the text": "Edit", "Mark the document as needing no action": "Settle", "Mark the report as needing no action": "Settle", "Mark it": "Settle",
  "Change the weight": "Weight", "Remove the memory": "Remove", "Add a keyword": "Keyword", "Run it again": "Rerun",
  // lists and filters
  "Clear the search": "Clear", "Clear the filters": "Clear", "Clear the filter": "Clear", "Clear filters": "Clear", "Show older processes": "Older", "Show older commands": "Older", "Show all": "More",
  "Add a count": "New count", "Edit the count": "Edit", "Answer in words": "Other",
  // agents
  "Session history": "History", "Lift this hold": "Lift hold", "Send a job": "Send job", "Change driver": "Driver", "Make an agent read it now": "Require",
  // secrets
  "Remove the secret": "Remove", "Replace the value": "Replace", "Keep the secret": "Save",
  // panes and views
  "Split to the right": "Split right", "Close the pane": "Close pane", "Expand everything": "Expand all", "Hide unchanged lines": "Hide unchanged", "Collapse big files": "Fold big files",
  "Show removals": "Removals", "Always two columns": "Two columns", "Limit card height": "Card height", "Choose a layout": "Layout",
  // comments
  "Leave a comment": "Comment", "Sent. Leave another": "Comment",
};
// open-type labels: what opens is the tooltip, the open icon is the control
const PLAIN_OPENS = {"Open on the Documents page": "Documents", "Show in the chat": "Chat", "Browse every skill": "Skills", "Show these rows": "Rows", "Open the output": "Output", "Show the plan": "Plan", "Inspect": "Inspect", "Open the output window": "Output"};
const OPEN_VERB = /^(Open|Show|View|Go to|Browse|Inspect)\b\s*(.*)$/;
const FILLER = /\b(the|a|an|this|that|its|your|my)\b\s*/gi;
const warned = new Set();
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
// a check item ("Show removals") is a switch, not a way to open something, so it never becomes the open icon
function plainLabel(text, {checkable} = {}) {
  if (typeof text !== "string") return {word: text};
  if (PLAIN_LABELS[text]) return {word: PLAIN_LABELS[text]};
  if (!checkable && PLAIN_OPENS[text]) return {icon: "open", word: PLAIN_OPENS[text]};
  const opens = !checkable && OPEN_VERB.exec(text);
  if (opens) return {icon: "open", word: cap(opens[2].replace(FILLER, "").trim()) || opens[1]};
  const word = cap(text.replace(FILLER, "").replace(/\s+/g, " ").trim()) || text;
  if (word.split(" ").length > 3 && !warned.has(word)) { warned.add(word); console.warn(`[labels] still long: "${word}"`); }
  return {word};
}

function Btn({variant = "", small, icon, children, title, onClick, disabled, className = "", style, type = "button", ...rest}) {
  const p = plainLabel(children);
  const iconOnly = p.icon || (!children && icon);
  const shownIcon = p.icon || icon;
  const cls = ["btn", variant, small && "small", iconOnly && "icon", className].filter(Boolean).join(" ");
  const tip = title || (p.icon ? p.word : undefined);
  const safe = Object.fromEntries(Object.entries(rest).filter(([k]) => k.startsWith("aria-") || k.startsWith("data-")));
  return <button type={type} className={cls} title={tip} aria-label={tip || (typeof p.word === "string" ? p.word : undefined)} onClick={onClick} disabled={disabled} style={style} {...safe}>{iconOnly ? <Icon name={shownIcon} size={13} /> : p.word}</button>;
}
function MenuItem({icon, check, children, desc, hint, danger, onClick}) {
  const p = plainLabel(children, {checkable: check !== undefined});
  const slotIcon = p.icon || icon;
  const slot = check !== undefined ? <span className="slot">{check && <Icon name="tick" size={12} />}</span> : slotIcon && <span className="slot"><Icon name={slotIcon} size={13} /></span>;
  return <button type="button" role={check !== undefined ? "menuitemcheckbox" : "menuitem"} aria-checked={check} className={"menu-item" + (danger ? " danger" : "")} title={typeof children === "string" && children !== p.word ? children : undefined} onClick={onClick}>{slot}<span className="grow">{p.word}{desc && <span className="desc">{desc}</span>}</span>{hint != null && <span className="hint">{hint}</span>}</button>;
}
function MenuButton({label, open, onClick, title}) {
  const p = plainLabel(label, {checkable: true});
  return <button type="button" className={"btn small menu-btn" + (open ? " on" : "")} aria-haspopup="menu" aria-expanded={open} title={title} onClick={onClick}><span>{p.word}</span><Icon name="down" size={11} /></button>;
}

// the comment box: closed, it is the chat icon and the word Comment; its count is a number with the icon, not a phrase
function CommentBox({count = 0, onSend, onShow, quote, onClearQuote}) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [sent, setSent] = useState(false);
  const box = useRef(null);
  useLayer(open, () => setOpen(false));
  useEffect(() => { if (quote) setOpen(true); }, [quote]);
  useEffect(() => { if (open) box.current?.focus(); }, [open]);
  const send = () => { if (!draft.trim()) return; onSend?.(draft.trim(), quote); setDraft(""); setOpen(false); setSent(true); onClearQuote?.(); };
  return <div className="cbox-dock"><div className="cbox">
    {open ? <div className="cbox-form" onKeyDown={(e) => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) send(); }}>
        {quote && <div className="cbox-quote"><b>On</b><span className="grow ellipsis">{quote}</span><button className="btn icon" style={{width: 18, height: 18}} onClick={onClearQuote} title="Whole text" aria-label="Whole text"><Icon name="close" size={10} /></button></div>}
        <textarea ref={box} value={draft} onChange={(e) => setDraft(e.target.value)} placeholder={quote ? "What about this part?" : "Write a comment. The agent reads it."} aria-label="Comment" />
        <div className="row"><span className="faint grow" style={{fontSize: 11}}><span className="kbd">⌘</span> <span className="kbd">Enter</span></span><Btn small onClick={() => setOpen(false)}>Cancel</Btn><Btn small variant="primary" disabled={!draft.trim()} onClick={send}>Send</Btn></div>
      </div>
      : <div className="cbox-closed">
        <button type="button" className="cbox-open-btn" onClick={() => setOpen(true)}><span className="cbox-mark"><Icon name={sent ? "tick" : "chat"} size={13} /></span><span>Comment</span>{draft && <span className="faint" style={{fontSize: 11, marginLeft: "auto"}}>Draft</span>}</button>
        {onShow && <button type="button" className="btn small ghost r12-count" title={`Comments: ${count}`} aria-label={`Comments: ${count}`} onClick={onShow}><Icon name="chat" size={12} />{count}</button>}
      </div>}
  </div></div>;
}

/* ---------- round eight and nine: their text links become an icon or a word ---------- */
function R12Open({title, onClick}) { return <button type="button" className="r12-open" title={title} aria-label={title} onClick={onClick}><Icon name="open" size={12} /></button>; }

function R8Overview({a}) {
  const {open} = useOpen();
  const [whole, setWhole] = useState(false);
  const t = TASKS.find((x) => x.id === a.task);
  const plan = PLANS.find((p) => p.id === a.plan);
  const pts = plan ? plan.phases.flatMap((p) => p.tasks).map((id) => TASKS.find((x) => x.id === id)).filter(Boolean) : [];
  const done = pts.filter((x) => x.state === "completed").length;
  return <div className="r8-overview">
    <R8Strip a={a} />
    <R8BandHead icon="play">Now</R8BandHead>
    <div className="r8-now">
      {t ? <button type="button" className="r8-link" onClick={() => open("task", t.id)}>Task {t.id}: {t.title}</button> : <span className="r8-faint">{a.ended ? "No task finished" : "No task"}</span>}
      {!a.ended && <span className="r8-doing">{a.command ? <><span className="r8-live-dot" /><span className="mono">{a.command}</span></> : a.wait ? `Waiting: ${a.wait}` : a.dot === "thinking" ? "Thinking" : a.doing}</span>}
      <span className="r8-faint" style={{fontSize: 11.5}}>{a.seen}</span>
    </div>
    {plan && <div className="r8-plan"><div className="row"><span>Plan {plan.id}, phase {plan.phases.find((p) => p.tasks.includes(a.task))?.n || 1}</span><span className="grow" /><R12Open title={`Plan ${plan.id}`} onClick={() => open("plan", plan.id)} /></div><span className="r8-faint" style={{fontSize: 11.5}}>{done} of {pts.length} tasks done</span><div className="r8-meter wide"><i style={{width: `${pts.length ? (done / pts.length) * 100 : 0}%`}} /></div></div>}
    <R8BandHead icon="file">{a.readOnly ? "Instruction" : "Brief"}</R8BandHead>
    <div className={"r8-brief" + (whole ? "" : " clamp")}>{a.brief}</div>
    {!whole && a.brief.length > 150 && <button type="button" className="r8-link r8-more" onClick={() => setWhole(true)}>More</button>}
    <R8BandHead icon="clock">Recent</R8BandHead>
    <div className="r8-moves">{R8_MOVES.map(([text, term, id, tone, at]) => term ? <button key={text} type="button" className="r8-move" onClick={() => open(term, id)}><i className={"r8-mdot " + tone} /><span className="ellipsis">{text}</span><span className="r8-faint">{at}</span></button> : <div key={text} className="r8-move"><i className={"r8-mdot " + tone} /><span className="ellipsis">{text}</span><span className="r8-faint">{at}</span></div>)}</div>
    <R8Fold icon="agents" label="Helpers" count={a.helpers}>{a.helpers ? AGENTS.filter((x) => x.role !== "Main agent").slice(0, a.helpers).map((x) => <button key={x.id} type="button" className="r8-move" onClick={() => open("agent", x.id)}><span>{x.name}</span><span className="r8-faint">{x.role}</span></button>) : <p className="r8-faint" style={{margin: "0 var(--inset)"}}>None</p>}</R8Fold>
    <R8Fold icon="book" label="Skills" count={a.skills}>{SKILLS.slice(0, 4).map((k) => <div key={k.id} className="r8-move"><span>{k.title}</span></div>)}</R8Fold>
    <R8Fold icon="more" label="Details" count={null}><Fields rows={[["Number", String(a.id)], ["Session", <span className="mono">{sessionOf(a.id).session}</span>], ["Program", a.program], ["Type", a.role], ["Started by", a.startedBy], ["Started", a.since.replace("Since ", "today ")], ["Process", a.ended ? "none" : "pid 48213"]]} /></R8Fold>
    {a.ended && <p className="r8-ended">Ended {a.retired ? a.retiredAt : "1 h ago"}. It takes no more actions.</p>}
  </div>;
}

function Q9Row({r, position, open, onToggle}) {
  const {open: openRow} = useOpen();
  const failed = r.section === "finished" && r.exit !== 0;
  const lead = r.section === "waiting" ? <span className="q9-pos">{position}</span>
    : <span className={"q9-dot" + (r.section === "running" ? (r.slot ? " run" : " free") : failed ? " bad" : " ok")} title={r.section === "running" ? (r.slot ? "Running, takes a place" : "Running, started at once without a place") : failed ? `Failed, exit ${r.exit}` : "Finished"} />;
  const go = (term, id) => (e) => { e.stopPropagation(); openRow(term, id); };
  return <div className={"q9-run" + (open ? " open" : "") + (failed ? " failed" : "")} data-section={r.section}>
    <button type="button" className="q9-line" aria-expanded={open} title={r.line} onClick={onToggle}>
      <span className="q9-lead">{lead}</span>
      <span className={"q9-kind" + (q9Waits(r) ? " waits" : "")} title={q9Waits(r) ? "Waits for a place" : "Starts at once"}>{q9Kind(r)}</span>
      <span className="q9-cmd">{r.line}</span>
      <span className="q9-who" role="link" tabIndex={-1} onClick={go("agent", (AGENTS.find((a) => a.name === r.agent) || {}).id)}>{r.agent}</span>
      <span className={"q9-time" + (failed ? " bad" : "")}>{failed ? `exit ${r.exit}` : r.time}</span>
      <span className="q9-chev"><Icon name="down" size={11} /></span>
    </button>
    <div className="q9-drop"><div className="q9-drop-inner">
      <div className="q9-out">
        <div className="q9-out-head">
          <span>Output {r.id}</span>
          {r.task && <><span className="q9-sep">·</span><button type="button" className="q9-a" onClick={go("task", r.task)}>Task {r.task}</button></>}
          <span className="q9-sep">·</span><span>{r.time}</span>
          {r.main && <><span className="q9-sep">·</span><span>main agent</span></>}
          <span className="grow" />
          <R12Open title={`Output ${r.id}`} onClick={go("output", 489998)} />
        </div>
        <pre>{r.section === "waiting" ? <span className="q9-muted">Not started · place {position}</span> : <><span className="q9-prompt">$ </span>{r.line}{r.out.length ? "\n" + r.out.join("\n") : ""}{r.section === "running" && <span className="q9-caret" />}</>}</pre>
      </div>
    </div></div>
  </div>;
}

function Q9Queue({limit, paused, reason, onSettings}) {
  const [opened, setOpened] = useState(new Set([490031]));
  const [more, setMore] = useState(false);
  const flip = (id) => { const s = new Set(opened); s.has(id) ? s.delete(id) : s.add(id); setOpened(s); };
  const sections = [["running", "Running", "play", "Nothing running"], ["waiting", "Waiting", "clock", "Nothing waiting"], ["finished", "Finished", "check", "Nothing finished yet"]];
  return <div className="q9-queue">
    {paused && <div className="q9-paused" role="status"><Icon name="pause" size={13} /><span><b>Paused.</b> Waiting processes get no place until you resume the queue; running ones go on, and reads and edits still start at once.{reason ? ` Reason: ${reason}` : ""}</span></div>}
    <Q9Glance limit={limit} paused={paused} onSettings={onSettings} />
    {sections.map(([key, label, icon, empty]) => { let rows = Q9_RUNS.filter((r) => r.section === key); const total = rows.length; if (key === "finished" && !more) rows = rows.slice(0, 6);
      return <section key={key} className="q9-section">
        <h3 className="q9-band"><Icon name={icon} size={12} />{label}<span>{total}</span></h3>
        {rows.length ? rows.map((r, i) => <Q9Row key={r.id} r={r} position={i + 1} open={opened.has(r.id)} onToggle={() => flip(r.id)} />) : <p className="q9-empty">{empty}</p>}
        {key === "finished" && total > 6 && !more && <button type="button" className="q9-older" onClick={() => setMore(true)}>Older</button>}
      </section>; })}
  </div>;
}

Object.assign(window, {PLAIN_LABELS, PLAIN_OPENS, plainLabel, Btn, MenuItem, MenuButton, CommentBox, R12Open, R8Overview, Q9Row, Q9Queue});
