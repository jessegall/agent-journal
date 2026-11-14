// Round seven (report 1385, doc 1277, and the main agent's decisions of round seven), with the round-seventeen words.
// Replaces by name: ListReaderLayout, ListPage, SourceBadge, FocusFact, PluginSettingsDialog, and the pages Skills, Memories, Rules, Templates,
// Sequences, Git, Plugins. Reminders, Teams, Integrations and Secrets are round-sixteen*.jsx's; this file keeps the rows they read.
// - Every control runs a command the journal has (named in its foot or its desc), or one doc 1275 lists as build work. Others are gone.
// - A reference opens an inspector when there is one, else its page with the row chosen; a row with neither is plain text.
// - On a page of one kind the row shows its number only; under a group heading a row never repeats the heading's word.

// the source of a profile: a faint word when it is not the journal's; Problem is a badge, it needs you
function SourceBadge({p, list}) {
  if (p.problem) return <Badge state="problem">Problem</Badge>;
  if (p.changed.length) return <span className="badge-quiet" title={plural(p.changed.length, "setting") + " changed"}>Changed</span>;
  return !p.module && list ? <span className="badge-quiet">Project</span> : null;
}

/* ---------- where a reference goes ----------
   The rows with an inspector open it (plan, task, doc, report, agent, memory, output, message, question).
   The rows without one open their page with the row chosen: R7_PAGE_OF names the page, and the page reads the pick when it opens. */
const R7_PAGE_OF = {rule: ["rules", "Rules"], reminder: ["reminders", "Reminders"], template: ["templates", "Templates"], sequence: ["sequences", "Sequences"], skill: ["skills", "Skills"], profile: ["profiles", "Profiles"], commit: ["git", "Git"], pull: ["git", "Git"], user: ["teams", "Teams"], secret: ["secrets", "Secrets"], integration: ["integrations", "Integrations"], plugin: ["plugins", "Plugins"]};
const R7_PICK = {term: null, id: null};
const r7Take = (term) => { if (R7_PICK.term !== term) return null; const id = R7_PICK.id; R7_PICK.term = null; return id; };
const r7Peek = (terms) => (terms.includes(R7_PICK.term) ? R7_PICK.term : null);

/* ---------- the list ---------- */
// a row: [number, or kind and number where kinds mix] [the title / a line of whole facts] [meta, flush right]
function ListReaderLayout({items, chosen, onChoose, placeholder = "Search", filters, extra, renderMeta, renderReader, emptyTitle = "Nothing here yet", emptyAction, pickLine = "No row chosen", listWidth, searchable = true}) {
  const [words, setWords] = useState("");
  const shown = items.filter((i) => !words || (i.title + " " + (typeof i.desc === "string" ? i.desc : "")).toLowerCase().includes(words.toLowerCase()));
  const groups = [...new Set(shown.map((i) => i.group || ""))];
  const current = items.find((i) => i.id === chosen);
  const hasRef = items.some((i) => i.ref || i.num != null);
  const step = (d) => { const at = shown.findIndex((i) => i.id === chosen); const next = shown[Math.min(shown.length - 1, Math.max(0, at + d))]; next && onChoose(next.id); };
  const facts = (desc) => typeof desc !== "string" ? desc : desc.split(" · ").map((part, k) => <React.Fragment key={k}>{k > 0 && <span className="sep">·</span>}<span><Linked text={part} /></span></React.Fragment>);
  return <div className={"lr" + (hasRef ? " has-ref" : "")}>
    <div className="lr-list" style={listWidth ? {width: listWidth} : null} tabIndex={0} aria-label="List" onKeyDown={(e) => { if (typing(e)) return; if (e.key === "ArrowDown") { e.preventDefault(); step(1); } if (e.key === "ArrowUp") { e.preventDefault(); step(-1); } }}>
      {(searchable || filters || extra) && <div className="lr-list-tools">{searchable && <SearchField value={words} onChange={setWords} placeholder={placeholder} />}{(filters || extra) && <div className="row">{filters}<span className="grow" />{extra}</div>}</div>}
      <div className="lr-items">
        {!shown.length && <div style={{padding: 20}} className="muted"><b style={{color: "var(--text)", fontWeight: 500}}>{words ? "No match" : emptyTitle}</b><div style={{marginTop: 8}}>{words ? <Btn small onClick={() => setWords("")}>Clear</Btn> : emptyAction}</div></div>}
        {groups.map((g) => <React.Fragment key={g}>{g && <div className="lr-group">{g}</div>}
          {shown.filter((i) => (i.group || "") === g).map((i) => <button key={i.id} type="button" className={"lrow r6" + (i.id === chosen ? " on" : "")} aria-current={i.id === chosen} onClick={() => onChoose(i.id)}>
            {hasRef && (i.ref ? <RefCols term={i.ref.term} id={i.ref.id} kind={i.ref.kind} /> : i.num != null ? <span className={"r7-n" + (typeof i.num === "string" ? " hash" : "")}>{i.num}</span> : <span />)}
            <span className="r6-main"><span className="t">{i.title}</span>{i.desc && <span className="d r7-whole">{facts(i.desc)}</span>}</span>
            <span className="r6-meta">{renderMeta ? renderMeta(i) : i.at}</span>
          </button>)}
        </React.Fragment>)}
      </div>
    </div>
    <div className="lr-reader" key={chosen ?? "none"}><div className="view-in" style={{display: "flex", flex: 1, minWidth: 0}}>{current ? renderReader(current) : <Empty title={pickLine} line={<span className="faint"><span className="kbd">↑</span> <span className="kbd">↓</span></span>} />}</div></div>
  </div>;
}

// ListPage as round six, and it takes a pick: a reference followed from elsewhere chooses its row when the page opens
function ListPage({title, header, fields, rows, initial, textOf, sort, chosen, onChoose, placeholder, renderMeta, renderReader, emptyTitle, emptyAction, pickLine, listWidth, pickTerm, children}) {
  const [value, setValue] = useState(initial || emptyFilter());
  const [words, setWords] = useState("");
  const [order, setOrder] = useState(sort?.[0][0]);
  const term = pickTerm || Object.entries(R7_PAGE_OF).find(([, [, t]]) => t === title)?.[0];
  useEffect(() => { const id = r7Take(term); if (id != null && rows.some((r) => r.id === id)) { setValue(emptyFilter()); onChoose(id); } }, []);
  const shownRows = applyFilter(rows, fields, value, words, textOf || ((r) => `${r.id} ${r.title} ${typeof r.desc === "string" ? r.desc : ""}`));
  const sorted = sort ? [...shownRows].sort(sort.find(([k]) => k === order)[2]) : shownRows;
  const clear = () => { setValue(emptyFilter()); setWords(""); };
  const sortMenu = sort && <Menu width={200} button={({toggle, open}) => <MenuButton label={sort.find(([k]) => k === order)[1]} open={open} onClick={toggle} title="Order" />}>{(close) => sort.map(([k, l]) => <MenuItem key={k} check={k === order} onClick={() => { setOrder(k); close(); }}>{l}</MenuItem>)}</Menu>;
  return <div className="page" data-screen-label={title}>
    <PageHeader title={title}>{header}</PageHeader>
    {children}
    <div className="r6-fbar"><FilterBar fields={fields} rows={rows} value={value} onChange={setValue} words={words} onWords={setWords} shown={sorted.length} placeholder={placeholder || "Search"} end={sortMenu} /></div>
    <ListReaderLayout items={sorted} chosen={sorted.some((r) => r.id === chosen) ? chosen : sorted[0]?.id} onChoose={onChoose} searchable={false} renderMeta={renderMeta} renderReader={renderReader} listWidth={listWidth} pickLine={pickLine}
      emptyTitle={rows.length ? "No match" : emptyTitle} emptyAction={rows.length ? <Btn small onClick={clear}>Clear</Btn> : emptyAction} />
  </div>;
}

/* ---------- Skills: commands skill set-required, skill require, trigger make, profile save ---------- */
function SkillsPage() {
  const {openFile} = useOpen();
  const [chosen, setChosen] = useState("journal");
  const profiles = window.PROFILE_ROWS || [];
  const rows = SKILLS.map((s) => ({...s, who: R6_SKILL_WHO[s.id] || "none", readBy: R6_READ_BY[s.id] || [], triggers: R6_TRIGGERS[s.id] || [], offeredBy: profiles.filter((p) => p.skills.includes(s.id)).map((p) => p.name), requiredBy: profiles.filter((p) => p.required_skills.includes(s.id)).map((p) => p.name)}));
  const required = (s) => (s.who !== "none" ? R6_WHO_WORDS[s.who] : s.requiredBy.length ? plural(s.requiredBy.length, "profile") : "");
  return <ListPage title="Skills" fields={R6_SKILL_FIELDS} rows={rows} chosen={chosen} onChoose={setChosen}
    renderMeta={(s) => <span className="badge-quiet">{required(s)}</span>}
    renderReader={(s) => <Reader key={s.id} term="skill" item={{...s, abstract: s.desc}} comments={false} head={{extra: <><span>{s.group}</span>{required(s) && <><span className="sep">·</span><span>Required · {required(s)}</span></>}</>}}
      actions={[{group: "Reading", label: "Readers", icon: "agent", desc: "skill set-required", field: {label: "Readers", options: [["all", "Every agent"], ["all-again", "Every agent, after each compaction too"], ["main", "Main agent"], ["main-again", "Main agent, after each compaction too"], ["none", "None"]], value: s.who === "every" ? "all" : s.who}, confirm: "Save"},
        {group: "Reading", label: "Require", icon: "agent", desc: "skill require", field: {label: "Agent", kind: "agent"}, confirm: "Require"},
        {group: "Reading", label: "Profile", icon: "agent", desc: "profile save", field: {label: "Profile", options: profiles.map((p) => [p.name, p.name])}, confirm: "Require"},
        {group: "Reading", label: "Trigger", icon: "plus", desc: "trigger make --do skill", field: {label: "Words", placeholder: "release, changelog"}},
        {group: "File", label: "SKILL.md", icon: "open", run: () => openFile(`.claude/skills/${s.id}/SKILL.md`)}]}
      tabs={[{key: "text", label: "Text", text: true}, {key: "reading", label: "Triggers", count: s.triggers.length, render: () => <SkillReading s={s} />}, {key: "readers", label: "Read by", count: s.readBy.length, render: () => <SkillReaders s={s} />}, {key: "profiles", label: "Profiles", count: s.offeredBy.length, render: () => <SkillProfiles s={s} />}]}>
      {() => <Markdown text={s.body} />}
    </Reader>} />;
}

/* ---------- Memories: memory weigh, edit, remove, restore. No New memory: memory make keeps it for the agent that runs it ---------- */
function MemoriesPage({onOpen}) {
  const [chosen, setChosen] = useState(812);
  const rows = R6_MEMORIES.map((m) => ({...m, title: m.desc, desc: `${m.agent}${m.task ? ` · task ${m.task}` : ""}`, num: m.id, group: ""}));
  const weights = Array.from({length: 10}, (_, i) => [String(i + 1), String(i + 1)]);
  return <ListPage title="Memories" fields={R6_MEM_FIELDS} rows={rows} initial={{state: {not: false, values: ["active"]}}} chosen={chosen} onChoose={setChosen} pickTerm="memory"
    sort={[["weight", "Weight", (a, b) => b.weight - a.weight], ["newest", "Newest", (a, b) => b.id - a.id]]}
    renderMeta={(m) => <R6_Steps w={m.weight} />}
    renderReader={(m) => <Reader key={m.id} term="memory" item={m} comments={false} head={{row: {term: "memory", id: m.id}, byLabel: "kept by", by: m.agent, at: m.at, extra: m.state === "removed" && <span className="badge-quiet">Removed</span>}}
      actions={m.state === "active" ? [{group: "Memory", label: "Weight", icon: "gauge", desc: "memory weigh", field: {label: "Weight", options: weights, value: String(m.weight)}, confirm: "Save"}, {group: "Memory", label: "Edit", icon: "edit", desc: "memory edit", field: {label: "Text", value: m.body}}, {group: "Memory", label: "Inspector", icon: "open", run: () => onOpen("memory", m.id)}, {group: "Danger", label: "Remove", icon: "trash", danger: true, desc: "memory remove", field: {label: "Reason"}, confirm: "Remove"}]
        : [{group: "Memory", label: "Restore", icon: "back", desc: "memory restore", field: {label: "Weight", options: weights, value: "5"}, confirm: "Restore"}]}>
      {() => <><Section title="Facts"><Fields rows={[["Task", m.task ? <RowLink term="task" id={m.task} bare /> : "—"], ["Weight", <R6_Steps w={m.weight} />], ["Keywords", m.keywords.length ? <span className="row" style={{gap: 4}}>{m.keywords.map((k) => <span key={k} className="chip">{k}</span>)}</span> : "—"]]} /></Section><Section title="Text"><Markdown text={m.body} /></Section></>}
    </Reader>} />;
}

/* ---------- Rules: rule approve, deny, edit, remove. The group names the state, the time stands at the right ---------- */
function RulesPage() {
  const [chosen, setChosen] = useState(19);
  const rows = R6_RULES.map((r) => ({...r, title: r.desc, desc: r.by, num: r.id, group: R6_RULE_WORDS[r.state]}));
  return <ListPage title="Rules" fields={R6_RULE_FIELDS} rows={rows} initial={{state: {not: true, values: ["removed"]}}} chosen={chosen} onChoose={setChosen}
    renderMeta={(r) => r.at}
    renderReader={(r) => <Reader key={r.id} term="rule" item={r} comments head={{row: {term: "rule", id: r.id}, byLabel: r.state === "proposed" ? "proposed by" : "by", by: r.by, at: r.at, extra: r.state === "removed" && <span className="badge-quiet">Removed</span>}}
      primary={r.state === "proposed" ? {label: "Accept", done: `Rule ${r.id} accepted`} : null}
      actions={r.state === "removed" ? [{group: "Rule", label: "Copy text", icon: "copy", done: "Text copied"}] : [{group: "Rule", label: "Edit", icon: "edit", desc: "rule edit", field: {label: "Rule", value: r.body}, confirm: "Save"}, {group: "Danger", label: r.state === "proposed" ? "Decline" : "Remove", icon: "trash", danger: true, desc: r.state === "proposed" ? "rule deny" : "rule remove", field: {label: "Reason"}}]}>
      {(ctx) => <Markdown text={r.body} comments={ctx.comments} onSelectText={ctx.setQuote} />}
    </Reader>} />;
}

/* ---------- Templates: template make, template send. Today a template is never edited or removed ---------- */
const R7_TEMPLATES = [
  {id: 4, title: "Plan: default", brief: "Phases with a test command and a checkpoint each", appliesTo: ["plan"], purpose: "Shape a new plan", by: "main", at: "3 days ago", commands: ["pytest tests -q", "npm --prefix src/viewer run build"], parts: [["Brief", "What the plan is for: {goal}"], ["Phases", "Each phase with its tasks and a checkpoint"]]},
  {id: 7, title: "Task: bug", brief: "What happens, what should happen, how to see it", appliesTo: ["task"], purpose: "Report a bug as a task", by: "Jesse", at: "last week", commands: [], parts: [["What happens", "{what}"], ["What should happen", "{expected}"], ["How to see it", ""]]},
  {id: 9, title: "Review: design", brief: "Screens, states, what could go wrong", appliesTo: ["doc", "plan"], purpose: "Ask for a review of a design", by: "helper-851", at: "yesterday", commands: [], parts: [["What a person sees", ""], ["Each state", ""], ["What could go wrong", ""]]},
];
const R7_ROW_KINDS = {plan: "Plan", task: "Task", doc: "Document"};
const r7Slots = (t) => [...new Set(t.parts.flatMap(([, b]) => [...b.matchAll(/\{(\w+)\}/g)].map((m) => m[1])))];
// the title names the kind (Plan: default), so the row and the meta do not say it again
function TemplatesPage() {
  const [chosen, setChosen] = useState(4);
  const [making, setMaking] = useState(null);
  const toast = useToast();
  const rows = R7_TEMPLATES.map((t) => ({...t, desc: t.brief, num: t.id, group: ""}));
  return <><ListPage title="Templates" fields={[{key: "applies", label: "Applies to", options: Object.entries(R7_ROW_KINDS), get: (t) => t.appliesTo}]} rows={rows} chosen={chosen} onChoose={setChosen}
    header={<Btn variant="primary" small onClick={() => setMaking({})}>New template</Btn>}
    renderMeta={(t) => t.at}
    renderReader={(t) => <Reader key={t.id} term="template" item={{...t, abstract: t.brief}} comments={false} head={{row: {term: "template", id: t.id}, by: t.by, at: t.at}}
      primary={{label: "Send", run: () => { setMaking({send: t}); return false; }}}
      actions={[{group: "Template", label: "Copy command", icon: "copy", desc: `journal template show ${t.id}`, done: "Command copied"}]}>
      {() => <><Section title="Facts"><Fields rows={[["Applies to", t.appliesTo.map((k) => R7_ROW_KINDS[k]).join(", ")], ["Purpose", t.purpose], ["Slots", r7Slots(t).length ? r7Slots(t).map((s) => `{${s}}`).join(", ") : "—"]]} /></Section>
        {t.commands.length > 0 && <Section title="Phase end"><div className="r6-list">{t.commands.map((c) => <div key={c} className="link-row" style={{gridTemplateColumns: "16px minmax(0, 1fr)"}}><Icon name="term" size={13} style={{color: "var(--text-3)"}} /><span className="mono">{c}</span></div>)}</div></Section>}
        <Section title="Parts"><Fields rows={t.parts.map(([h, b]) => [h, b || "—"])} /></Section></>}
    </Reader>} />
    {making?.send && <CreateDialog title={`Send ${making.send.title}`} submit="Send" onClose={() => setMaking(null)} onMade={(v) => toast(`Sent on ${R7_ROW_KINDS[v.kind].toLowerCase()} ${v.row}`)}
      command={(v) => `journal template send ${making.send.id} --on=${v.kind}:${v.row || "…"}${r7Slots(making.send).map((s) => ` --set=${s}=…`).join("")}`}
      check={(v) => (/^\d+$/.test(v.row) ? {} : {row: "A number"})}
      fields={[{key: "kind", label: "On", kind: "select", options: making.send.appliesTo.map((k) => [k, R7_ROW_KINDS[k]]), required: true, half: true}, {key: "row", label: "Number", required: true, placeholder: "1131", half: true}, ...r7Slots(making.send).map((s) => ({key: "slot-" + s, label: `{${s}}`, required: true}))]} />}
    {making && !making.send && <CreateDialog title="New template" submit="Make" onClose={() => setMaking(null)} onMade={(v) => toast(`Template 10 made: ${v.title}`)} command={(v) => `journal template make "${v.title || "…"}" --applies-to ${v.applies || "…"} --brief "…" --parts "…"${v.commands ? ' --commands "…"' : ""}`}
      fields={[{key: "title", label: "Title", required: true, placeholder: "Plan: release"}, {key: "brief", label: "Description", required: true}, {key: "applies", label: "Applies to", kind: "select", options: [["plan", "Plans"], ["task", "Tasks"], ["doc", "Documents"], ["plan,task", "Plans and tasks"]], required: true, half: true}, {key: "purpose", label: "Purpose", half: true}, {key: "parts", label: "Parts", kind: "steps", required: true, placeholder: "Brief: what the plan is for, {goal}"}, {key: "commands", label: "Phase end commands", kind: "area", rows: 3, help: "One a line", when: (v) => v.applies.startsWith("plan")}]} />}
  </>;
}

/* ---------- Sequences: sequence run, abandon, edit, delete, trigger make. A step's state is its dot ---------- */
function SequencesPage() {
  const [chosen, setChosen] = useState(31);
  const [making, setMaking] = useState(null);
  const toast = useToast();
  const rows = R6_SEQUENCES.map((q) => ({...q, num: q.id, group: ""}));
  return <><ListPage title="Sequences" fields={R6_SEQ_FIELDS} rows={rows} chosen={chosen} onChoose={setChosen}
    header={<Btn variant="primary" small onClick={() => setMaking({})}>New sequence</Btn>}
    renderMeta={(q) => <Badge state={q.state}>{R6_SEQ_WORDS[q.state]}</Badge>}
    renderReader={(q) => { const run = q.runs.find((r) => r.state === "started");
      return <Reader key={q.id} term="sequence" item={q} comments={false} head={{row: {term: "sequence", id: q.id}, by: q.by, at: q.at, extra: run && <span className="r8-facts"><span>Run {run.id}</span><span className="sep">·</span><span>step {run.done + 1} of {run.total}</span><R16Agent name={run.agent} /></span>}}
        primary={run ? null : {label: "Start", done: `Sequence ${q.id} started`}}
        actions={[...(run ? [{group: "Run", label: `Abandon run ${run.id}`, icon: "stop", desc: "sequence abandon", field: {label: "Reason"}, confirm: "Abandon"}] : []), {group: "Sequence", label: "Edit steps", icon: "edit", desc: "sequence edit", run: () => { setMaking({edit: q}); return false; }}, {group: "Sequence", label: "Trigger", icon: "clock", desc: "trigger make", field: {label: "Starts", options: [["time", "At a time"], ["plan", "When a plan ends"], ["check", "When a check fails"]]}, confirm: "Add"}, {group: "Danger", label: "Delete", icon: "trash", danger: true, desc: "sequence delete", field: {label: "Reason"}, confirm: "Delete"}]}
        tabs={[{key: "steps", label: "Steps", count: q.steps.length, render: () => <div className="r6-list r6-steps">{q.steps.map(([s, st], i) => <div key={i} className="link-row"><span className="r6-num">{i + 1}</span><span>{s}</span><span className={"sdot " + st} aria-label={STATE_WORDS[st]} /></div>)}</div>},
          {key: "runs", label: "Runs", count: q.runs.length, render: () => q.runs.length ? <div className="r6-list r6-runs">{q.runs.map((r) => <div key={r.id} className="link-row"><span className="r6-num">{r.id}</span><R16Agent name={r.agent} /><span className="r6-bar"><i style={{width: `${(r.done / r.total) * 100}%`}} /></span><span className="r6-num">{r.done} of {r.total}</span><Badge state={r.state}>{OUTPUT_WORDS[r.state]}</Badge></div>)}</div> : <p className="muted" style={{margin: 0}}>None</p>},
          {key: "triggers", label: "Triggers", count: q.triggers.length, render: () => q.triggers.length ? <div className="r6-list r6-trig">{q.triggers.map((t) => <div key={t.id} className="link-row"><span>{t.when}</span><span className="faint">{t.kind}</span><span className="row" style={{gap: 4}}><Btn small variant="ghost" title="trigger edit">Edit</Btn><Btn small variant="ghost" title="trigger strike">End</Btn></span></div>)}</div> : <p className="muted" style={{margin: 0}}>By hand</p>}]}>
        {() => null}
      </Reader>; }} />
    {making && <CreateDialog title={making.edit ? `Edit ${making.edit.title}` : "New sequence"} submit={making.edit ? "Save" : "Make"} onClose={() => setMaking(null)} onMade={(v) => toast(making.edit ? "Sequence saved" : `Sequence 32 made: ${v.title}`)} command={() => `journal sequence ${making.edit ? `edit ${making.edit.id}` : "make"} …`}
      fields={[{key: "title", label: "Title", required: true, value: making.edit?.title}, {key: "steps", label: "Steps", kind: "steps", required: true, placeholder: "Run the full test suite", value: making.edit?.steps.map(([s]) => s)}]} />}
  </>;
}

/* ---------- Reminders: the rows the Reminders page (round sixteen) reads. A reminder is told to the agent that made it ---------- */
const R7_REMINDERS = [
  {id: 41, text: "Check the full run and report failures", by: "main", every: ["minutes", 30], once: false, at: null, block: "", subject: "", next: "14:30", last: "14:00", made: "today", state: "open"},
  {id: 42, text: "Log what you did before you close the task", by: "worker-4", every: ["tasks", 1], once: false, at: null, block: "task-logged", subject: "9682", next: "at the next closed task", last: "never", made: "1 h ago", state: "blocked"},
  {id: 43, text: "Weigh your memories before plan 1131 ends", by: "main", every: null, once: true, at: "16:00", block: "", subject: "", next: "16:00", last: "never", made: "20 min ago", state: "open"},
  {id: 44, text: "Read the review of plan 1133", by: "helper-851", every: ["tool-uses", 50], once: false, at: null, block: "", subject: "", next: "in 12 tool uses", last: "30 min ago", made: "2 h ago", state: "open"},
];
const r7When = (r) => [r.at && `at ${r.at}`, r.every && `every ${r.every[0] === "minutes" ? plural(r.every[1], "minute") : r.every[0] === "tasks" ? plural(r.every[1], "closed task") : plural(r.every[1], "tool use")}`, r.once && "once"].filter(Boolean).join(", ");

/* ---------- Teams: a person of the team links to their row in Users, an agent to its inspector ---------- */
function R7Person({name}) { return R6_TEAM_USERS.some((u) => u.title === name) ? <RowLink term="user" id={R6_TEAM_USERS.find((u) => u.title === name).id}>{name}</RowLink> : <AgentLink name={name} />; }

/* ---------- Git: commits show their short hash as the row's number; nothing deletes a branch ---------- */
function GitPage() {
  const {openFile} = useOpen();
  const [tab, setTab] = useState(() => (r7Peek(["pull"]) ? "pulls" : "commits"));
  const [chosen, setChosen] = useState(R6_COMMITS[0].id);
  const tabs = <Tabs tabs={[{key: "commits", label: "Commits", count: R6_COMMITS.length}, {key: "branches", label: "Branches", count: R6_BRANCHES.length}, {key: "pulls", label: "Pull requests", count: R6_PULLS.length}]} value={tab} onPick={(t) => { setTab(t); setChosen({commits: R6_COMMITS, branches: R6_BRANCHES, pulls: R6_PULLS}[t][0].id); }} />;
  if (tab === "branches") return <ListPage key="b" title="Git" pickTerm="branch" fields={[{key: "kind", label: "Kind", options: [["Local", "Local"], ["Worktree", "Worktree"]], get: (b) => b.kind}, R6_AGENT_FIELD((b) => b.worker, "Worker")]} rows={R6_BRANCHES.map((b) => ({...b, desc: b.task ? `task ${b.task} · ${b.worker}` : b.current ? "Current" : b.isDefault ? "Default" : "", group: b.kind}))} chosen={chosen} onChoose={setChosen}
    renderMeta={(b) => `${b.ahead} ahead · ${b.behind} behind`}
    renderReader={(b) => <Reader key={b.id} term="branch" item={b} comments={false} head={{extra: b.current && <span>Current</span>, at: `last commit ${b.at}`}} actions={[{group: "Branch", label: "Copy name", icon: "copy", done: "Name copied"}]}>
      {() => <Fields rows={[b.task && ["Task", <RowLink term="task" id={b.task} bare />], b.worker && ["Worker", <R16Agent name={b.worker} />], ["Last commit", <RowLink term="commit" id={b.last}><span className="mono">{b.last}</span></RowLink>]]} />}
    </Reader>}>{tabs}</ListPage>;
  if (tab === "pulls") return <ListPage key="p" title="Git" pickTerm="pull" fields={[{key: "state", label: "State", options: [["open", "Open"], ["completed", "Merged"], ["cancelled", "Closed"]], get: (p) => p.state}]} rows={R6_PULLS.map((p) => ({...p, desc: `${p.from} into ${p.into} · plan ${p.plan}`, num: p.id, group: ""}))} chosen={chosen} onChoose={setChosen}
    renderMeta={(p) => p.checks.some((c) => c[1] === "failed") ? <Badge state="failed">Check failed</Badge> : <span className="badge-quiet">Open</span>}
    renderReader={(p) => <Reader key={p.id} term="pull" item={p} comments={false} head={{row: {term: "pull", id: p.id, kind: "Pull request"}, by: p.by, at: p.at}} actions={[{group: "Pull request", label: "GitHub", icon: "open"}, {group: "Pull request", label: "Copy link", icon: "copy", done: "Link copied"}]}>
      {() => <><Section title="Facts"><Fields rows={[["From", <span className="mono">{p.from}</span>], ["Into", <span className="mono">{p.into}</span>], ["Plan", <RowLink term="plan" id={p.plan} bare />]]} /></Section><Section title="Checks"><div className="r6-list r6-checks">{p.checks.map(([n, s, t]) => <div key={n} className="link-row"><span>{n}</span><span className="r6-num">{t}</span><Badge state={s} /></div>)}</div></Section><Section title="Description"><Markdown text={p.body} /></Section></>}
    </Reader>}>{tabs}</ListPage>;
  return <ListPage key="c" title="Git" pickTerm="commit" fields={[{key: "author", label: "Author", options: [["Jesse Gall", "Jesse Gall"]], get: (c) => c.author}, {key: "task", label: "Task", options: R6_OPTS(R6_COMMITS, (c) => c.task, (t) => `Task ${t}`), get: (c) => c.task}]}
    rows={R6_COMMITS.map((c) => ({...c, desc: `${c.author} · task ${c.task}`, num: c.id, group: c.group}))} chosen={chosen} onChoose={setChosen}
    renderMeta={(c) => c.at}
    renderReader={(c) => <Reader key={c.id} term="commit" item={c} comments={false} head={{row: {term: "commit", id: c.id, kind: "Commit"}, extra: <span>{c.author}</span>, at: c.at}}
      actions={[{group: "Commit", label: "Copy hash", icon: "copy", done: "Hash copied"}, {group: "Commit", label: "Files", icon: "open", run: () => openFile(c.files[0][1])}]}
      tabs={[{key: "files", label: "Files", count: c.files.length, render: () => <><Section title="Facts"><Fields rows={[["Task", <RowLink term="task" id={c.task} bare />], ["Plan", <RowLink term="plan" id={c.plan} bare />], ["Branch", <span className="mono">{c.branch}</span>]]} /></Section>
          <div className="r6-list">{c.files.map(([g, path, add, del]) => <div key={path} className="link-row r6-files"><span className="gs" title={R6_GIT_LETTER[g]}>{g}</span><span role="link" tabIndex={0} className="ref-link mono" title={path} onClick={() => openFile(path)} onKeyDown={(e) => e.key === "Enter" && openFile(path)}>{path}</span><span className="num">+{add}</span><span className="num">{del ? `−${del}` : ""}</span></div>)}</div></>},
        {key: "diff", label: "Diff", render: () => <div className="r6-diff">{c.files.slice(0, 2).map(([, path]) => <React.Fragment key={path}><div className="hunk">{path}</div><div className="del">- limit = None</div><div className="add">+ limit = worker.test_limit</div><div>  return limit</div></React.Fragment>)}</div>},
        {key: "message", label: "Message", render: () => <Markdown text={c.body || "No message"} />}]}>
      {() => null}
    </Reader>}>{tabs}</ListPage>;
}

/* ---------- Plugins: plugin enable, disable, upgrade, remove, install (after plugin preview), log; the dialog's services: plugin service, service-log ---------- */
function PluginsPage({onOpenSettings}) {
  const [making, setMaking] = useState(null);
  const toast = useToast();
  return <><R6CardPage title="Plugins" items={R6_PLUGINS} icon="plug" switchable={() => true} onSwitch={(p, v) => `${p.title} ${v ? "on" : "off"}`}
    fields={[{key: "state", label: "State", options: [["on", "On"], ["off", "Off"], ["fault", "Fault"]], get: (p) => p.state}]}
    header={<Menu width={240} button={({toggle, open}) => <button type="button" className={"btn small primary menu-btn" + (open ? " on" : "")} aria-haspopup="menu" aria-expanded={open} onClick={toggle}><span>Install</span><Icon name="down" size={11} /></button>}>{(close) => <><MenuItem icon="open" onClick={() => { setMaking("install"); close(); }}>From file or address</MenuItem><MenuItem icon="plus" onClick={() => { setMaking("make"); close(); }}>New plugin</MenuItem></>}</Menu>}
    renderState={(p) => <span>{p.upgrade ? `version ${p.version} · ${p.upgrade} available` : `version ${p.version}`}</span>}
    actions={(p) => [{group: "Plugin", label: "Settings", icon: "gear", run: () => { onOpenSettings(p); return false; }}, {group: "Plugin", label: "Log", icon: "log", desc: "plugin log"}, ...(p.upgrade ? [{group: "Plugin", label: `Upgrade to ${p.upgrade}`, icon: "up", desc: "plugin upgrade", field: {label: "Changes", options: [["ok", "Adds a band setting; no new access"]]}, confirm: "Upgrade"}] : []), {group: "Danger", label: "Remove", icon: "trash", danger: true, desc: "plugin remove", field: {label: "Reason"}, confirm: "Remove"}]}
    empty={{title: "No plugins", action: <Btn small variant="primary" onClick={() => setMaking("install")}>Install</Btn>}} />
    {making === "install" && <CreateDialog title="Install plugin" submit="Install" onClose={() => setMaking(null)} onMade={() => toast("Installed, off")} command={(v) => `journal plugin install ${v.from || "…"}`}
      fields={[{key: "from", label: "File or address", required: true, placeholder: "https://github.com/team/status-band or ~/plugins/band.zip"}, {key: "preview", label: "What it adds", kind: "select", options: [["band", "A band over the chat · 1 service · reads the build state · no secret"]], help: "From the plugin's manifest"}]} />}
    {making === "make" && <CreateDialog title="New plugin" submit="Send to main" onClose={() => setMaking(null)} onMade={() => toast("Task 9701 made")} command={() => "journal task make …"}
      fields={[{key: "name", label: "Name", required: true, placeholder: "deploy-band"}, {key: "what", label: "What it does", kind: "area", rows: 4, required: true, placeholder: "A band that shows the last deploy and its state"}]} />}
  </>;
}
// the plugin dialog of round two, with today's service terminal back in its Services tab
function PluginSettingsDialog({plugin, onClose}) {
  const toast = useToast();
  const [tab, setTab] = useState("settings");
  const [output, setOutput] = useState(null);
  const d = useDraft({interval: 60, place: "Over the chat"});
  const ch = (k) => d.changed.includes(k);
  const services = plugin.services ? ["poller", "sync"].slice(0, plugin.services) : [];
  return <Dialog title={plugin.title} sub={plugin.desc} onClose={onClose}>
    <SettingsLayout tabs={[{key: "settings", label: "Settings"}, {key: "services", label: "Services", count: plugin.services}]} tab={tab} onTab={setTab} draft={d.changed.length} onCancel={d.cancel} onSave={() => { d.save(); toast(`${plugin.title} saved`); }}>
      {tab === "settings" && <SettingSection title="Settings"><SettingRow label="Interval" help="Seconds" changed={ch("interval")}><input type="number" aria-label="Seconds" value={d.v.interval} style={{width: 90}} onChange={(e) => d.set("interval", Number(e.target.value))} /></SettingRow><SettingRow label="Place" changed={ch("place")}><select aria-label="Place" value={d.v.place} onChange={(e) => d.set("place", e.target.value)}><option>Over the chat</option><option>Under the top bar</option></select></SettingRow>{plugin.fault && <div className="notice bad" style={{marginTop: 12}}>{plugin.fault}</div>}</SettingSection>}
      {tab === "services" && <SettingSection title="Services">{services.length ? services.map((s) => <React.Fragment key={s}><SettingRow label={<span className="mono">{s}</span>} help="Running · restarted 2 h ago"><span className="row" style={{gap: 6, justifyContent: "flex-end"}}><Btn small onClick={() => setOutput(output === s ? null : s)}>{output === s ? "Hide" : "Output"}</Btn><Btn small onClick={() => toast(`${s} restarted`)}>Restart</Btn></span></SettingRow>{output === s && <pre className="r7-term" aria-label={`${s} output`}>{"14:02:11 build state read: passing\n14:01:11 build state read: passing\n14:00:11 band drawn"}</pre>}</React.Fragment>) : <p className="muted">None</p>}</SettingSection>}
    </SettingsLayout>
  </Dialog>;
}

/* ---------- Integrations: the rows the Integrations page (round sixteen) reads, and a server's own dialog ---------- */
const R7_SERVERS = [
  {id: "github", title: "github", target: "npx @modelcontextprotocol/server-github", state: "connected", tools: 26, secret: 3, profiles: ["journal-main", "journal-worker"], desc: "npx @modelcontextprotocol/server-github"},
  {id: "blender", title: "blender", target: "uvx blender-mcp", state: "failed", reason: "Failed to connect · nothing listens on port 9876", profiles: [], desc: "uvx blender-mcp"},
  {id: "claude-design", title: "claude-design", target: "https://claude.ai/design/mcp", state: "connected", tools: 24, profiles: ["journal-designer"], desc: "https://claude.ai/design/mcp"},
  {id: "linear", title: "linear", target: "https://mcp.linear.app/sse", state: "suggested", why: "Named in 3 tasks", profiles: [], desc: "https://mcp.linear.app/sse"},
];
const R7_SERVER_WORDS = {connected: "Connected", failed: "Failed to connect", suggested: "Suggested"};
// the command is fixed: remove the server and add it again to change it
function R7ServerDialog({s, onClose}) {
  const toast = useToast();
  const sec = R7_SECRETS.find((x) => x.id === s.secret);
  return <Dialog narrow title={s.title} sub={R7_SERVER_WORDS[s.state]} onClose={onClose} foot={<div className="foot"><span className="grow" /><Btn onClick={() => toast(`Checking ${s.title}`)}>Check</Btn><Btn variant="primary" onClick={onClose}>Done</Btn></div>}>
    <div className="dialog-body">
      <Fields rows={[["Runs", <span className="mono">{s.target}</span>], ["Tools", s.tools ? s.tools : "—"], ["Secret", sec ? <RowLink term="secret" id={sec.id}>{sec.title}</RowLink> : "—"], ["Profiles", s.profiles.length ? <span className="row" style={{gap: 6}}>{s.profiles.map((n, k) => <React.Fragment key={n}>{k > 0 && ", "}<RowLink term="profile" id={n}>{n}</RowLink></React.Fragment>)}</span> : "—"]]} />
    </div>
  </Dialog>;
}

/* ---------- Secrets: the rows the Secrets page (round sixteen) reads, and one secret's dialog ----------
   Commands: secret make, fill, allow (a program, or --helpers), update (title, note, fields), delete. */
const R7_SECRETS = [
  {id: 3, title: "GitHub token", type: "api key", fields: [{name: "key", hidden: true, filled: true}], programs: ["gh", "curl"], proposed: [{program: "git", by: "worker-4"}], helpers: false, note: "For gh and the GitHub API", deleted: false},
  {id: 5, title: "Tunler login", type: "login", fields: [{name: "username", hidden: false, filled: true}, {name: "password", hidden: true, filled: true}], programs: ["tunler"], proposed: [], helpers: true, note: "", deleted: false},
  {id: 7, title: "Sentry token", type: "api key", fields: [{name: "key", hidden: true, filled: false}], programs: [], proposed: [], helpers: false, note: "", waiting: {by: "worker-7", why: "To read the error behind task 9683"}, deleted: false},
];
const R7_SECRET_TYPES = {"api key": ["API key", "key"], login: ["Login", "user"], custom: ["Custom", "grid"]};
// one secret, as today's SecretDialog: credentials, allowed programs and proposals, helpers, title and note; Save runs each change
function R7SecretDialog({x, onClose}) {
  const toast = useToast();
  const [values, setValues] = useState({});
  const [programs, setPrograms] = useState(x.programs);
  const [proposed, setProposed] = useState(x.proposed);
  const [helpers, setHelpers] = useState(x.helpers);
  const [title, setTitle] = useState(x.title);
  const [note, setNote] = useState(x.note);
  const [fields, setFields] = useState(x.fields);
  const [newProgram, setNewProgram] = useState("");
  const [newField, setNewField] = useState("");
  const [asking, setAsking] = useState(false);
  const allow = (p) => { if (p && !programs.includes(p)) setPrograms([...programs, p]); setProposed(proposed.filter((q) => q.program !== p)); setNewProgram(""); };
  const changes = [...Object.entries(values).filter(([, v]) => v).map(([f]) => `secret fill ${x.id} ${f}`), ...programs.filter((p) => !x.programs.includes(p)).map((p) => `secret allow ${x.id} ${p}`), ...(helpers && !x.helpers ? [`secret allow ${x.id} --helpers`] : []), ...(title !== x.title || note !== x.note || fields.length !== x.fields.length ? [`secret update ${x.id}`] : [])];
  const close = () => (changes.length ? setAsking(true) : onClose());
  const save = () => { toast(`${title} saved: ${plural(changes.length, "change")}`); onClose(); };
  return <Dialog narrow title={x.title} sub={x.waiting ? <span className="r8-facts"><R16Agent name={x.waiting.by} /><span>{x.waiting.why}</span></span> : R7_SECRET_TYPES[x.type][0]} onClose={close}
    foot={<div className="foot"><span className="note">{changes.length ? plural(changes.length, "change") : "No changes"}</span><Btn onClick={close}>Cancel</Btn><Btn variant="primary" disabled={!changes.length || !title.trim()} onClick={save}>Save</Btn></div>}>
    <div className="dialog-body">
      <div className="r7-sec"><span className="lab">Credentials</span>
        {fields.map((f) => <label key={f.name} className="r7-field"><span>{f.name}</span><span className="r7-line"><input type={f.hidden ? "password" : "text"} autoComplete="off" aria-label={f.name} value={values[f.name] || ""} placeholder={f.filled ? "Kept" : "Empty"} onChange={(e) => setValues({...values, [f.name]: e.target.value})} />{x.type === "custom" ? <Btn small variant="ghost" onClick={() => setFields(fields.filter((g) => g !== f))}>Remove</Btn> : <span />}</span></label>)}
        {x.type === "custom" && <span className="r7-line"><input type="text" aria-label="Field" placeholder="Field" value={newField} onChange={(e) => setNewField(e.target.value)} /><Btn small disabled={!newField.trim()} onClick={() => { setFields([...fields, {name: newField.trim(), hidden: true, filled: false}]); setNewField(""); }}>Add</Btn></span>}
      </div>
      <div className="r7-sec"><span className="lab">Programs</span>
        {programs.length ? <div className="r7-chips">{programs.map((p) => <span key={p} className="chip mono">{p}</span>)}</div> : <span className="muted">No program</span>}
        {proposed.map((p) => <div key={p.program} className="r7-line"><R16Agent name={p.by} /><span className="grow">proposes <code className="mono">{p.program}</code></span><Btn small variant="primary" onClick={() => allow(p.program)}>Allow {p.program}</Btn></div>)}
        <span className="r7-line"><input type="text" aria-label="Program" placeholder="Program" value={newProgram} onChange={(e) => setNewProgram(e.target.value)} /><Btn small disabled={!newProgram.trim()} onClick={() => allow(newProgram.trim())}>Allow</Btn></span>
      </div>
      <div className="r7-sec"><span className="lab">Helpers</span>{helpers ? <span className="muted">Allowed</span> : <div className="r7-line"><span className="muted grow">Not allowed</span><Btn small onClick={() => setHelpers(true)}>Allow</Btn></div>}</div>
      <div className="r7-sec"><span className="lab">Title and note</span><label className="r7-field"><span>Title</span><input type="text" value={title} onChange={(e) => setTitle(e.target.value)} /></label><label className="r7-field"><span>Note</span><input type="text" value={note} placeholder="Purpose" onChange={(e) => setNote(e.target.value)} /></label></div>
    </div>
    {asking && <LeaveDialog count={changes.length} onStay={() => setAsking(false)} onDiscard={onClose} onSave={save} />}
  </Dialog>;
}

/* ---------- plan focus: the menu closes on a pick; under a menu of plans a row is its number and title ---------- */
function FocusFact() {
  const {plan, source, ended, choose} = useFocus();
  const toast = useToast();
  const {open} = useOpen();
  const [hover, setHover] = useState(null);
  if (!plan) return <span className="now-focus default"><Icon name="target" size={12} /><span className="word">No focus</span></span>;
  const {total, done} = planProgress(plan);
  const choosable = PLANS.filter(FOCUSABLE).sort((a, b) => (a.id === plan.id ? -1 : b.id === plan.id ? 1 : a.id - b.id));
  const waiting = PLANS.filter((p) => !FOCUSABLE(p) && !R6_ENDED(p));
  const closed = PLANS.filter(R6_ENDED).length;
  const shown = choosable.slice(0, R6_MENU_MAX);
  const cmd = hover === "default" ? "journal plan focus --clear" : `journal plan focus ${hover ?? plan.id}`;
  return <Menu align="left" width={460} button={({toggle, open: isOpen}) => <button type="button" className={"now-focus" + (source === "default" ? " default" : "") + (isOpen ? " on" : "")} title={`Focus · plan ${plan.id}${source === "default" ? " · default" : ""}`} aria-haspopup="menu" aria-expanded={isOpen} onClick={toggle}>
      <Icon name="target" size={12} /><span className="word">Focus</span>{plan.id !== TASKS.find((x) => x.id === AGENTS[0].task)?.plan && <b>Plan {plan.id}</b>}<FocusBar plan={plan} /><span>{done} of {total}</span>
    </button>}>{(close) => { const row = (p, can) => { const pr = planProgress(p); const on = plan.id === p.id;
      return <button key={p.id} type="button" role="menuitemradio" aria-checked={on} aria-disabled={!can} className="focus-row" title={can ? p.title : `${p.title} · ${STATE_WORDS[p.state]}`}
        onMouseEnter={() => can && setHover(p.id)} onFocus={() => can && setHover(p.id)} onClick={() => { if (!can) return; choose(p.id); toast(`Plan ${p.id} is main's focus`); close(); }}>
        <span className="tick">{on && <Icon name="tick" size={12} />}</span><span /><span className="n">{p.id}</span><span>{p.title}</span><span className="st">{can ? "" : STATE_WORDS[p.state]}</span><FocusBar plan={p} /><span className="num">{pr.total ? `${pr.done} of ${pr.total}` : "—"}</span>
      </button>; };
      return <div onMouseLeave={() => setHover(null)}>
      <div className="dd-head"><span>Focus of main</span><span className="grow" /><span className="faint" style={{fontSize: 11}}>{source === "default" ? "default" : "named"}</span></div>
      {ended && <div className="dd-sub">Plan {ended.id} {ended.state} · back on the default</div>}
      <div className="focus-group">Started or approved</div>
      {shown.map((p) => row(p, true))}
      {choosable.length > shown.length && <div className="focus-more">{choosable.length - shown.length} more</div>}
      {waiting.length > 0 && <><div className="focus-group">Other</div>{waiting.slice(0, 3).map((p) => row(p, false))}</>}
      <div className="focus-more">{closed} ended</div>
      <div className="menu-sep" />
      <div onMouseEnter={() => setHover("default")}><MenuItem icon="back" desc={`Plan ${defaultFocus()?.id ?? "—"}`} onClick={() => { choose(null); toast("main is back on the default focus"); close(); }}>Default</MenuItem></div>
      <MenuItem icon="open" onClick={() => { open("plan", plan.id); close(); }}>Plan {plan.id}</MenuItem>
      <div className="dd-foot mono">{cmd}</div>
    </div>; }}</Menu>;
}

Object.assign(window, {SourceBadge, R7_PAGE_OF, R7_PICK, r7Take, r7Peek, ListReaderLayout, ListPage, SkillsPage, MemoriesPage, RulesPage, TemplatesPage, SequencesPage, GitPage, PluginsPage, PluginSettingsDialog, R7ServerDialog, R7SecretDialog, R7Person, FocusFact, R7_SECRETS, R7_SECRET_TYPES, R7_REMINDERS, R7_TEMPLATES, R7_SERVERS, R7_SERVER_WORDS, r7When});
