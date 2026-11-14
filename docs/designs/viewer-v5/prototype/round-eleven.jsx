// Round eleven (message 121164): a question card carries no "Waiting on you" badge. An open question is lightly highlighted;
// an answered one is dimmed. One card, QuestionCard (QuestionCard.vue), used wherever a question shows as a card. Sets NOW_WINDOWS.questions.

const Q11_QUESTIONS = [
  {id: 88, at: "5 min ago", by: "main", plan: 1133, text: "Keep the developer pages in the sidebar, or move them into Settings?", context: "Plan 1133 moves every page onto the shared layouts. Numbers, Request log and System logs are for developers only.", options: ["In the sidebar", "Into Settings"], recommended: "In the sidebar"},
  {id: 87, at: "22 min ago", by: "worker-4", plan: 1131, text: "May the plan card show the agent's profile beside its name?", context: "Task 9682 trims the agent badges on plan cards.", options: ["Yes, the profile too", "Only the name"], recommended: "Only the name"},
  {id: 86, at: "1 h ago", by: "main", plan: null, text: "Run the full test suite now, or after plan 1131 is merged?", options: ["Now", "After the merge"], recommended: "After the merge", state: "answered", answer: "After the merge"},
  {id: 85, at: "2 h ago", by: "helper-851", plan: 1133, text: "Should the splash screen also play when a window regains focus?", options: ["Every focus", "Only the first focus"], recommended: "Only the first focus", state: "answered", answer: "Only the first focus"},
];

function QuestionCard({q}) {
  const {open} = useOpen();
  const toast = useToast();
  const [state, setState] = useState(q.state || "open");
  const [answer, setAnswer] = useState(q.answer || "");
  const [typed, setTyped] = useState("");
  const settle = (text) => { setState("answered"); setAnswer(text); toast(`Question ${q.id} answered`); };
  const answered = state === "answered";
  return <section className="q11-card" data-state={state}>
    <header className="q11-head">
      <i className="q11-dot" aria-hidden="true" />
      <button type="button" className="q11-ref" onClick={() => open("question", q.id)}>Question {q.id}</button>
      <span className="q11-faint">·</span><AgentLink name={q.by} />
      {q.plan && <><span className="q11-faint">·</span><RowLink term="plan" id={q.plan} /></>}
      <span className="grow" /><span className="q11-faint">{q.at}</span>
    </header>
    <h3 className="q11-text">{q.text}</h3>
    {q.context && !answered && <p className="q11-context"><Linked text={q.context} /></p>}
    {answered ? <p className="q11-answered"><span>Answered:</span> {answer}</p> : <>
      <div className="q11-options">{q.options.map((o) => <button key={o} type="button" className={"q11-option" + (o === q.recommended ? " rec" : "")} onClick={() => settle(o)}><i className="q11-ring" /><span>{o}</span>{o === q.recommended && <span className="q11-tag">Recommended</span>}</button>)}</div>
      <form className="q11-form" onSubmit={(e) => { e.preventDefault(); if (typed.trim()) settle(typed.trim()); }}>
        <input className="qbox" value={typed} placeholder="Or answer in your own words…" aria-label="Your answer" onChange={(e) => setTyped(e.target.value)} />
        <Btn small type="submit" variant={typed.trim() ? "primary" : undefined} disabled={!typed.trim()}>Answer</Btn>
      </form>
    </>}
  </section>;
}

// the Home Questions window: open questions first, then the answered ones, dimmed
function QuestionsWindow() {
  const open = Q11_QUESTIONS.filter((q) => q.state !== "answered");
  const done = Q11_QUESTIONS.filter((q) => q.state === "answered");
  return <div className="q11-list">
    {!open.length && <Empty title="No open questions" line="A question an agent asks you shows here" />}
    {open.map((q) => <QuestionCard key={q.id} q={q} />)}
    {done.length > 0 && <div className="q11-group">Answered</div>}
    {done.map((q) => <QuestionCard key={q.id} q={q} />)}
  </div>;
}
NOW_WINDOWS.questions = QuestionsWindow;

Object.assign(window, {Q11_QUESTIONS, QuestionCard, QuestionsWindow});
