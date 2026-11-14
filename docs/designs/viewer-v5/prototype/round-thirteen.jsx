// Round thirteen (messages 121184 and 121190), with the round-seventeen words.
// 1. What the redesign does not change looks exactly as the app does today. The chat is copied from the running viewer, not redrawn:
//    Chat.vue (history, day line, running strip, composer), text/rowNames.js and tokens.css .row-pill (the chips in a bubble),
//    text/cards.js and cards.css (row cards), kit/ChatMark.vue (marks). Class names and sizes are the build's, scoped under .r13-chat.
//    The message card is round-fifteen.jsx's R13Message. Sets NOW_WINDOWS.chat.
// 2. A mark is a short fact: what happened and to which row, never a sentence.
// 3. The composer has the attach button and Send; Send is off until there is text.
// 4. Every part says where it comes from: the Changes switch, in the prototype's strip above the app, marks New, Changed and Current app.

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
  return <div className={`mark w-${m.w}` + (m.failed ? " failed" : "") + (m.to ? " live" : "")} style={m.color ? {"--mark": m.color} : null} onClick={() => m.to && open(m.to[0], m.to[1])}>
    <span className="top">
      <span className="mark-icon"><Icon name={m.icon} size={12} /></span>
      <span className="head"><span className="title">{m.title}</span>{m.name && <strong>{m.name}</strong>}</span>
      {(m.took || m.sign) && <span className="status">{m.took && <span className="ran-for">{m.took}</span>}{m.sign === "running" ? <span className="spin" aria-label="Running" /> : m.sign ? <span className={"sign " + m.sign}><Icon name={m.sign === "failed" ? "close" : "tick"} size={11} /></span> : null}</span>}
    </span>
    {m.mact && <button type="button" className="mact" onClick={(e) => { e.stopPropagation(); toast(m.mact); }}>{m.mact}</button>}
  </div>;
}

const R13_ROWS = [
  {day: "Today"},
  {me: true, id: 120138, at: "13:41", text: "The home screen stays as it is. Keep the new file viewer. No text may wrap."},
  {mark: {w: "event", icon: "task", title: "Task started", name: "9692 Build the viewer v5 layouts", to: ["task", 9692]}},
  {mark: {w: "event", icon: "agent", title: "helper-851 · read", name: "doc 1275", to: ["doc", 1275]}},
  {mark: {w: "process", icon: "term", title: "pytest tests/stories -x -q", took: "4.2 s", sign: "failed", failed: true, mact: "Output", to: ["output", 489998]}},
  {id: 120141, at: "13:44", worker: 4, text: "helper-851 draws round four. Doc 1275 keeps the list of what stays as it is.", reactions: [{e: "👍", mine: true}]},
  {me: true, id: 120155, at: "13:52", quote: "helper-851 draws round four. Doc 1275 keeps the list of what stays as it is.", text: "And fix the Open button of the Search reader."},
  {mark: {w: "attention", icon: "plan", title: "Approval", name: "Plan 1133", color: "var(--blocking)", mact: "Approve", to: ["plan", 1133]}},
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
      <textarea className="composer-input" rows={3} value={draft} placeholder="Message" aria-label="Message" onChange={(e) => setDraft(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }} />
      <div className="composer-row">
        <button type="button" className="composer-attach" title="Attach" aria-label="Attach"><Icon name="clip" size={16} /></button>
        <button type="submit" className="btn small primary composer-send" disabled={!draft.trim()}>Send</button>
      </div>
    </form>
  </div>;
}
NOW_WINDOWS.chat = R13Chat;

/* ---------- the Changes switch: marks every part New, Changed or Current app ---------- */
(function addChangesSwitch() {
  if (document.getElementById("r13-changes")) return;
  const wrap = document.createElement("div");
  wrap.id = "r13-changes";
  wrap.innerHTML = '<button type="button" aria-pressed="false">Changes</button><span class="r13-legend"><i class="new"></i>New<i class="changed"></i>Changed<i class="current"></i>Current app</span>';
  wrap.querySelector("button").addEventListener("click", (e) => { const on = document.body.classList.toggle("r13-origins"); e.currentTarget.setAttribute("aria-pressed", String(on)); });
  document.body.appendChild(wrap);
})();

Object.assign(window, {R13Chat, R13Mark, R13Text, R13_ROWS});
