// Round thirteen (messages 121184 and 121190).
// 1. What the redesign does not change looks exactly as the app does today. The chat is copied from the running viewer, not redrawn:
//    Chat.vue (history, day line, running strip, composer), kit/MessageCard.vue (bubble, tools, quote, reactions, foot, ticks),
//    text/rowNames.js and tokens.css .row-pill (the chips in a bubble), text/cards.js and cards.css (row cards), kit/ChatMark.vue (marks).
//    Class names and sizes are the build's, scoped under .r13-chat. Sets NOW_WINDOWS.chat.
// 2. Every part says where it comes from: the Changes switch (bottom left) marks New, Changed, and Current app (unchanged, copied).
// 3. sandbox off is a warning icon with a tooltip, next to the identity line, not pushed to the far end. Replaces R8Card and R8OpenCard.

/* ---------- chips: a row named in a bubble is a pill (text/rowNames.js) ---------- */
const R13_REF = /\b(task|plan|doc|document|report|message|output|question|memory)\s(\d+)\b/gi;
const R13_TERM = {document: "doc"};
function R13Text({text}) {
  const {open} = useOpen();
  const parts = []; let last = 0; let m; R13_REF.lastIndex = 0;
  while ((m = R13_REF.exec(text))) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    const term = R13_TERM[m[1].toLowerCase()] || m[1].toLowerCase(); const id = Number(m[2]);
    parts.push(<a key={m.index} className="row-pill" href="#" onClick={(e) => { e.preventDefault(); open(term, id); }}>{m[1]} <span className="row-pill-num">{m[2]}</span></a>);
    last = m.index + m[0].length;
  }
  parts.push(text.slice(last));
  return <p>{parts}</p>;
}

/* ---------- a mark (kit/ChatMark.vue): w-event a quiet line, w-process outlined, w-attention filled in its colour ---------- */
function R13Mark({m}) {
  const {open} = useOpen();
  const toast = useToast();
  return <div className={`mark w-${m.w}` + (m.failed ? " failed" : "") + (m.to ? " live" : "")} style={m.color ? {"--mark": m.color} : null} title={m.hover} onClick={() => m.to && open(m.to[0], m.to[1])}>
    <span className="top">
      <span className="mark-icon"><Icon name={m.icon} size={12} /></span>
      <span className="head"><span className="title">{m.title}</span>{m.name && <strong>{m.name}</strong>}</span>
      {(m.took || m.sign) && <span className="status">{m.took && <span className="ran-for">{m.took}</span>}{m.sign === "running" ? <span className="spin" aria-label="Still running" /> : m.sign ? <span className={"sign " + m.sign}><Icon name={m.sign === "failed" ? "close" : "tick"} size={11} /></span> : null}</span>}
    </span>
    {m.mact && <button type="button" className="mact" onClick={(e) => { e.stopPropagation(); toast(m.mact); }}>{m.mact}</button>}
  </div>;
}

/* ---------- a message (kit/MessageCard.vue) ---------- */
function R13Message({r}) {
  const toast = useToast();
  const {open} = useOpen();
  const [picking, setPicking] = useState(false);
  const [copied, setCopied] = useState(false);
  const [mine, setMine] = useState(r.reactions || []);
  return <article className="message" data-from={r.me ? "user" : "agent"}>
    <div className="message-body">
      <div className={"message-card md" + (r.comment ? " comment" : "")}>
        {r.comment && <button type="button" className="message-comment-head" onClick={() => open(r.comment[0], r.comment[1])}><Icon name="chat" size={12} /><span>Comment on {TERM_WORDS[r.comment[0]]} {r.comment[1]}</span></button>}
        {r.quote && <div className="message-quote">{r.quote}</div>}
        {r.worker && <button type="button" className="message-worker" onClick={() => open("agent", r.worker)}>Worker {r.worker}</button>}
        <R13Text text={r.text} />
        {r.card && <a className="row-card" href="#" onClick={(e) => { e.preventDefault(); open(r.card[0], r.card[1]); }}><span className="row-card-type">{TERM_WORDS[r.card[0]]} {r.card[1]}</span><span className="row-card-title">{r.card[2]}</span></a>}
      </div>
      <div className={"message-tools" + (picking ? " picking" : "")}>
        {picking ? <>
          <div className="message-faces">{["👍", "❤️", "😂", "🎉", "👀", "🙏"].map((f) => <button key={f} type="button" className="message-face" title={`React ${f}`} onClick={() => { setMine([...mine.filter((x) => x.e !== f), {e: f, mine: true}]); setPicking(false); }}>{f}</button>)}</div>
          <button type="button" className="message-tool" title="Cancel" onClick={() => setPicking(false)}><Icon name="close" size={11} /></button>
        </> : <>
          <button type="button" className="message-tool" title="React to this" onClick={() => setPicking(true)}>React</button>
          <button type="button" className="message-tool" onClick={() => toast("Replying")}>Reply</button>
          <button type="button" className="message-tool" onClick={() => { setCopied(true); setTimeout(() => setCopied(false), 1200); }}>{copied ? "Copied" : "Copy"}</button>
          {r.me && r.unread && <button type="button" className="message-tool" title="Only while it is unread">Delete</button>}
        </>}
      </div>
    </div>
    {mine.length > 0 && <div className="message-reactions">{mine.map((x) => <button key={x.e} type="button" className={"message-reaction" + (x.mine ? " mine" : "")}>{x.e}</button>)}</div>}
    {r.files && <div className="message-files">{r.files.map((f) => <a key={f} className="message-file" href="#" onClick={(e) => e.preventDefault()}>{f}</a>)}</div>}
    <div className="message-foot">
      <time className="message-time">{r.at}</time>
      <span className="message-dot" aria-hidden="true">•</span>
      <span className="message-id">message {r.id}</span>
      {r.me && <span className={"read-ticks" + (r.unread ? " unread" : "")} title={r.unread ? "Delivered" : "Read by the agent"}><Icon name="tick" size={12} /><Icon name="tick" size={12} /></span>}
    </div>
  </article>;
}

const R13_ROWS = [
  {day: "Today"},
  {me: true, id: 120138, at: "13:41", text: "The home screen stays as it is. Keep the new file viewer. No text may wrap."},
  {mark: {w: "event", icon: "task", title: "Task started", name: "9692 Build the viewer v5 layouts", to: ["task", 9692], hover: "Task 9692 · 13:42"}},
  {mark: {w: "event", icon: "agent", title: "helper-851 reads", name: "doc 1275", to: ["doc", 1275]}},
  {mark: {w: "process", icon: "term", title: "pytest tests/stories -x -q", took: "4.2 s", sign: "failed", failed: true, mact: "Output", to: ["output", 489998]}},
  {id: 120141, at: "13:44", worker: 4, text: "helper-851 draws round four. Doc 1275 keeps the list of what stays as it is.", reactions: [{e: "👍", mine: true}]},
  {me: true, id: 120155, at: "13:52", quote: "helper-851 draws round four. Doc 1275 keeps the list of what stays as it is.", text: "And fix the Open button of the Search reader."},
  {mark: {w: "attention", icon: "plan", title: "Plan 1133 waits for your approval", color: "var(--blocking)", mact: "Approve", to: ["plan", 1133]}},
  {id: 120157, at: "13:53", text: "Reader calls primary.run now, so Open opens the row. Task 9693 holds it.", card: ["task", 9693, "Every row reference in the viewer opens its inspector"]},
  {me: true, id: 120160, at: "13:55", comment: ["plan", 1133], text: "Phase 2 can start before phase 1 ends.", unread: true},
  {mark: {w: "process", icon: "term", title: "npm --prefix src/viewer run build", took: "48 s", sign: "running", mact: "Output", to: ["output", 490030]}},
];

/* ---------- the chat (Chat.vue): history, the running strip, the composer ---------- */
function R13Chat() {
  const [rows, setRows] = useState(R13_ROWS);
  const [draft, setDraft] = useState("");
  const send = () => { if (!draft.trim()) return; setRows([...rows, {me: true, id: 120170 + rows.length, at: "now", text: draft.trim(), unread: true}]); setDraft(""); };
  return <div className="r13-chat" data-origin="current">
    <div className="history"><div className="row-list">
      {rows.map((r, i) => <div key={i} className={"row-list-row" + (r.mark ? " has-mark" : "")}>{r.day ? <p className="chat-day">{r.day}</p> : r.mark ? <R13Mark m={r.mark} /> : <R13Message r={r} />}</div>)}
    </div></div>
    <p className="running-strip"><span className="running-dot" /><span className="running-text">sed -n 55,80p src/core/modules/agents/support/agent_rows.py</span></p>
    <form className="composer" onSubmit={(e) => { e.preventDefault(); send(); }}>
      <textarea className="composer-input" rows={3} value={draft} placeholder="Message the agent" onChange={(e) => setDraft(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }} />
      <div className="composer-row">
        <button type="button" className="composer-attach" title="Attach a file or an image" aria-label="Attach a file"><Icon name="clip" size={16} /></button>
        {draft.trim() ? <button type="submit" className="btn small primary composer-send">Send</button> : <button type="button" className="btn small composer-send bordered">Dump files</button>}
      </div>
    </form>
  </div>;
}
NOW_WINDOWS.chat = R13Chat;

/* ---------- sandbox off: a warning icon beside what it qualifies ---------- */
const R13_SANDBOX = "Sandbox off: its commands run outside the sandbox";
function R13Sandbox() { return <span className="r13-sandbox" title={R13_SANDBOX} aria-label={R13_SANDBOX} role="img"><Icon name="alert" size={12} /></span>; }

function R8Card({a, index, onOpen}) {
  return <div className={"r8-card" + (a.lingering ? " lingering" : "")} data-state={a.dot} role="button" tabIndex={0} style={{animationDelay: `${index * 40}ms`}} onClick={() => onOpen(a)} onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), onOpen(a))}>
    <span className="r8-rail" aria-hidden="true" />
    <span className="r8-head"><span className="r8-title">{a.title}</span><span className="r8-sub">{a.sub}</span><span className="r8-chev"><Icon name="right" size={11} /></span></span>
    <span className="r8-line r13-line"><span className="r8-identity">{r8Identity(a)}</span>{a.sandboxOff && <R13Sandbox />}</span>
    {a.unit && <span className="r8-unit">Unit: {a.unit}</span>}
    <R8TaskLine a={a} />
    <R8Dot a={a} />
  </div>;
}
function R8OpenCard({a, onClose}) {
  const {open} = useOpen();
  const [menu, setMenu] = useState(false);
  const [tab, setTab] = useState(a.readOnly || a.retired ? "transcript" : "tasks");
  const tabs = [
    {key: "tasks", label: "Tasks", count: r8TasksOf(a).length}, {key: "transcript", label: "Transcript"}, {key: "terminal", label: "Terminal"},
    {key: "feed", label: "File feed"}, {key: "processes", label: "Processes"}, {key: "reports", label: "Reports", count: a.reports}, {key: "memories", label: "Memories", count: a.memories},
  ];
  const Body = R8_TAB_BODIES[tab];
  return <div className="r8-open" data-state={a.dot}>
    <div className="r8-ohead">
      <button type="button" className="r8-back" title="Back" aria-label="Back" onClick={onClose}><Icon name="back" size={14} /></button>
      <span className="r8-otitle">{a.title}</span><span className="r8-sub">{a.name} · {a.sub}</span>{a.sandboxOff && <R13Sandbox />}
      <span className="grow" />
      <Btn small variant="ghost" className={menu ? "on" : ""} onClick={() => setMenu(!menu)}>Actions</Btn>
      <Btn small onClick={() => open("agent", a.id)}>Inspect</Btn>
      <R8Dot a={a} />
    </div>
    {menu && <R8Actions a={a} />}
    {a.retired ? <dl className="r8-lasting"><div><dt>Retired</dt><dd>{a.retiredAt}</dd></div><div><dt>Retired by</dt><dd>{a.retiredBy}</dd></div><div><dt>Reason</dt><dd>{a.retireReason}</dd></div></dl>
      : <div className="r8-band"><InfoBar agentId={a.id} card /></div>}
    <Tabs tabs={tabs} value={tab} onPick={setTab} />
    <div className="r8-obody view-in" key={tab}><Body a={a} /></div>
    {!a.retired && <R8CommandBand a={a} />}
  </div>;
}

/* ---------- the Changes switch: marks every part New, Changed or Current app ---------- */
(function addChangesSwitch() {
  if (document.getElementById("r13-changes")) return;
  const wrap = document.createElement("div");
  wrap.id = "r13-changes";
  wrap.innerHTML = '<button type="button" aria-pressed="false" title="Mark what is new, what changed and what is the current app">Changes</button><span class="r13-legend"><i class="new"></i>New<i class="changed"></i>Changed<i class="current"></i>Current app</span>';
  wrap.querySelector("button").addEventListener("click", (e) => { const on = document.body.classList.toggle("r13-origins"); e.currentTarget.setAttribute("aria-pressed", String(on)); });
  document.body.appendChild(wrap);
})();

Object.assign(window, {R13Chat, R13Mark, R13Message, R13Text, R13Sandbox, R8Card, R8OpenCard});
