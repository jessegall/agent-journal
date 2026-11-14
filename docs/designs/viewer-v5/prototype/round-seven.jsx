// Round seven (report 1385, doc 1277, and the main agent's decisions of round seven). Replaces by name: ListReaderLayout, ListPage, R6CardPage,
// SourceBadge, FocusFact, PluginSettingsDialog, and the pages Skills, Memories, Rules, Templates, Sequences, Reminders, Teams, Git, Plugins, Integrations, Secrets.
// - Every control runs a command the journal has (named in its foot or its desc), or one doc 1275 lists as build work. Others are gone.
// - A reference opens an inspector when there is one, else its page with the row chosen; a row with neither is plain text.
// - On a page of one kind the row shows its number only; titles wrap and are always whole; a line of facts shows each fact whole or not at all.

/* ---------- decisions taken on existing names ---------- */
TIERS.splice(TIERS.findIndex(([k]) => k === "rare"), 1); // the server refuses rare in a profile (ModelTier.automatic), so it is not offered
PF_FIELDS[0].options[0][1] = "Journal";
Object.assign(R6_SECTIONS.find((s) => s.key === "workers").rows[0], {help: "A preset is a set of the eight switches and nothing more; it fills them in, and nothing is saved until you press Save. Careful, Balanced and Fast are the presets; any other mix shows as Custom."});

// one word for the source: Journal, with the long form as its title
function SourceBadge({p, list}) {
  const src = p.module ? <span className="pf-src" title={`Comes with the journal, from ${p.module}; your changes are kept through updates`}>Journal</span> : <span className="pf-src project" title={`Made in this project: ${p.path}`}>Project</span>;
  const state = p.problem ? <span className="pf-src problem" title={p.problem}>Problem</span> : p.is_base ? <span className="pf-src" title="Other profiles extend it; it is never started on its own">Base</span> : p.changed.length ? <span className="pf-src changed" title={`You changed ${plural(p.changed.length, "setting")}; they are kept through updates`}>Changed</span> : null;
  return <>{list ? null : src}{state}{list && !state ? src : null}</>;
}

/* ---------- where a reference goes ----------
   The rows with an inspector open it (plan, task, doc, report, agent, memory, output, message, question).
   The rows without one open their page with the row chosen: R7_PAGE_OF names the page, and the page reads the pick when it opens. */
const R7_PAGE_OF = {rule: ["rules", "Rules"], reminder: ["reminders", "Reminders"], template: ["templates", "Templates"], sequence: ["sequences", "Sequences"], skill: ["skills", "Skills"], profile: ["profiles", "Profiles"], commit: ["git", "Git"], pull: ["git", "Git"], user: ["teams", "Teams"], secret: ["secrets", "Secrets"], integration: ["integrations", "Integrations"], plugin: ["plugins", "Plugins"]};
const R7_PICK = {term: null, id: null};
const r7Take = (term) => { if (R7_PICK.term !== term) return null; const id = R7_PICK.id; R7_PICK.term = null; return id; };
const r7Peek = (terms) => (terms.includes(R7_PICK.term) ? R7_PICK.term : null);

/* ---------- the list ---------- */
// a row: [number, or kind and number where kinds mix] [the whole title / a line of whole facts] [meta]
function ListReaderLayout({items, chosen, onChoose, placeholder = "Search", filters, extra, renderMeta, renderReader, emptyTitle = "Nothing here yet", emptyAction, pickLine = "Choose a row to read it here", listWidth, searchable = true}) {
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
        {!shown.length && <div style={{padding: 20}} className="muted"><b style={{color: "var(--text)", fontWeight: 500}}>{words ? "Nothing matches the search" : emptyTitle}</b><div style={{marginTop: 8}}>{words ? <Btn small onClick={() => setWords("")}>Clear the search</Btn> : emptyAction}</div></div>}
        {groups.map((g) => <React.Fragment key={g}>{g && <div className="lr-group">{g}</div>}
          {shown.filter((i) => (i.group || "") === g).map((i) => <button key={i.id} type="button" className={"lrow r6" + (i.id === chosen ? " on" : "")} aria-current={i.id === chosen} onClick={() => onChoose(i.id)}>
            {hasRef && (i.ref ? <RefCols term={i.ref.term} id={i.ref.id} kind={i.ref.kind} /> : i.num != null ? <span className={"r7-n" + (typeof i.num === "string" ? " hash" : "")}>{i.num}</span> : <span />)}
            <span className="r6-main"><span className="t">{i.title}</span>{i.desc && <span className="d r7-whole">{facts(i.desc)}</span>}</span>
            <span className="r6-meta">{renderMeta ? renderMeta(i) : i.at}</span>
          </button>)}
        </React.Fragment>)}
      </div>
    </div>
    <div className="lr-reader" key={chosen ?? "none"}><div className="view-in" style={{display: "flex", flex: 1, minWidth: 0}}>{current ? renderReader(current) : <Empty title={pickLine} line={<span className="faint">Use <span className="kbd">↑</span> <span className="kbd">↓</span> in the list to step through</span>} />}</div></div>
  </div>;
}

// ListPage as round six, and it takes a pick: a reference followed from elsewhere chooses its row when the page opens
function ListPage({title, line, header, fields, rows, initial, textOf, sort, chosen, onChoose, placeholder, renderMeta, renderReader, emptyTitle, emptyAction, pickLine, listWidth, pickTerm, children}) {
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
    <PageHeader title={title} line={line}>{header}</PageHeader>
    {children}
    <div className="r6-fbar"><FilterBar fields={fields} rows={rows} value={value} onChange={setValue} words={words} onWords={setWords} shown={sorted.length} placeholder={placeholder || `Search ${title.toLowerCase()}`} end={sortMenu} /></div>
    <ListReaderLayout items={sorted} chosen={sorted.some((r) => r.id === chosen) ? chosen : sorted[0]?.id} onChoose={onChoose} searchable={false} renderMeta={renderMeta} renderReader={renderReader} listWidth={listWidth} pickLine={pickLine}
      emptyTitle={rows.length ? "No row matches the filters" : emptyTitle} emptyAction={rows.length ? <Btn small onClick={clear}>Clear the filters</Btn> : emptyAction} />
  </div>;
}

// a card page as round six: the state line keeps whole facts, and a picked card is marked
function R6CardPage({title, line, items, icon, iconOf, fields, initial, header, renderState, renderLine, renderExtra, switchable, onSwitch, foot, actions, empty, groupOf}) {
  const [value, setValue] = useState(initial || emptyFilter());
  const [words, setWords] = useState("");
  const [on, setOn] = useState(Object.fromEntries(items.map((i) => [i.id, i.on])));
  const [picked] = useState(() => r7Take(Object.entries(R7_PAGE_OF).find(([, [, t]]) => t === title)?.[0]));
  const toast = useToast();
  const shown = applyFilter(items, fields, picked != null ? emptyFilter() : value, words, (i) => `${i.title} ${i.desc || ""}`);
  const card = (p) => <div key={p.id} className={"card" + (picked === p.id ? " r7-picked" : "")}>
    <div className="row"><span className="tile-mark r6"><Icon name={iconOf ? iconOf(p) : icon} size={14} /></span><div className="grow" style={{minWidth: 0}}><h3 title={p.title}>{p.title}</h3><div className="r6-card-state r7-whole">{renderState(p, on[p.id])}</div></div>{switchable?.(p) && <Switch on={on[p.id]} onChange={(v) => { setOn({...on, [p.id]: v}); toast(onSwitch(p, v)); }} title={`${on[p.id] ? "Turn off" : "Turn on"} ${p.title}`} />}</div>
    <p className="r7-whole" title={p.desc}>{renderLine ? renderLine(p) : p.desc}</p>
    {renderExtra?.(p)}
    {p.fault && <div className="notice bad" style={{padding: "6px 10px"}}>{p.fault}</div>}
    <div className="row" style={{marginTop: "auto"}}>{foot(p)}<span className="grow" />{actions(p).length > 0 && <ActionMenu actions={actions(p)} onDone={toast} />}</div>
  </div>;
  const groups = groupOf ? [...new Set(shown.map(groupOf))] : [""];
  return <div className="page" data-screen-label={title}>
    <PageHeader title={title} line={line}>{header}</PageHeader>
    <div className="r6-fbar"><FilterBar fields={fields} rows={items} value={value} onChange={setValue} words={words} onWords={setWords} shown={shown.length} placeholder={`Search ${title.toLowerCase()}`} /></div>
    <div className="scroll" style={{flex: 1, paddingTop: 12}}>
      {!shown.length ? <Empty title={items.length ? "Nothing matches the filters" : empty.title} line={items.length ? null : empty.line} action={items.length ? <Btn small onClick={() => { setValue(emptyFilter()); setWords(""); }}>Clear the filters</Btn> : empty.action} />
        : groups.map((g) => <React.Fragment key={g}>{g && <div className="lr-group" style={{paddingLeft: "var(--inset)"}}>{g}</div>}<div className="cg"><div className="cg-grid">{shown.filter((p) => !groupOf || groupOf(p) === g).map(card)}</div></div></React.Fragment>)}
    </div>
  </div>;
}

/* ---------- Skills: commands skill set-required, skill require, trigger make, profile save ---------- */
function SkillsPage() {
  const {openFile} = useOpen();
  const [chosen, setChosen] = useState("journal");
  const profiles = window.PROFILE_ROWS || [];
  const rows = SKILLS.map((s) => ({...s, who: R6_SKILL_WHO[s.id] || "none", readBy: R6_READ_BY[s.id] || [], triggers: R6_TRIGGERS[s.id] || [], offeredBy: profiles.filter((p) => p.skills.includes(s.id)).map((p) => p.name), requiredBy: profiles.filter((p) => p.required_skills.includes(s.id)).map((p) => p.name)}));
  return <ListPage title="Skills" line="What agents read to know how to work here" fields={R6_SKILL_FIELDS} rows={rows} chosen={chosen} onChoose={setChosen} placeholder="Find a skill"
    renderMeta={(s) => s.who !== "none" ? (s.who === "every" ? "every agent" : "main agent") : s.requiredBy.length ? plural(s.requiredBy.length, "profile") : ""}
    renderReader={(s) => <Reader key={s.id} term="skill" item={{...s, abstract: s.desc}} comments={false} head={{extra: <><span className="mono">{s.group}</span><span className="sep">·</span><span>{s.who === "none" ? (s.requiredBy.length ? `Required by ${plural(s.requiredBy.length, "profile")}` : "Not required") : `Required for ${s.who === "every" ? "every agent" : "the main agent"}`}</span></>}}
      actions={[{group: "Reading", label: "Which agents must read it", icon: "agent", desc: "skill set-required", field: {label: "Which agents read it at their start", options: [["all", "Every agent"], ["all-again", "Every agent, and again after each compaction"], ["main", "Only the main agent"], ["main-again", "Only the main agent, and again after each compaction"], ["none", "Not required"]], value: s.who === "every" ? "all" : s.who, help: "A profile's Required adds its own agents to this."}, confirm: "Save"},
        {group: "Reading", label: "Make an agent read it now", icon: "agent", desc: "skill require", field: {label: "Agent", kind: "agent"}, confirm: "Make it read"},
        {group: "Reading", label: "Require it for a profile", icon: "agent", desc: "profile save", field: {label: "Profile", options: profiles.map((p) => [p.name, p.name])}, confirm: "Require it"},
        {group: "Reading", label: "Add a trigger", icon: "plus", desc: "trigger make --do skill", field: {label: "When these words appear", placeholder: "release, changelog"}},
        {group: "File", label: "Open SKILL.md in Files", icon: "open", run: () => openFile(`.claude/skills/${s.id}/SKILL.md`)}]}
      tabs={[{key: "text", label: "What it says", text: true}, {key: "reading", label: "When it is read", count: s.triggers.length, render: () => <SkillReading s={s} />}, {key: "readers", label: "Read by", count: s.readBy.length, render: () => <SkillReaders s={s} />}, {key: "profiles", label: "Profiles", count: s.offeredBy.length, render: () => <SkillProfiles s={s} />}]}>
      {() => <Markdown text={s.body} />}
    </Reader>} />;
}

/* ---------- Memories: memory weigh, edit, remove, restore. No New memory: memory make keeps it for the agent that runs it ---------- */
function MemoriesPage({onOpen}) {
  const [chosen, setChosen] = useState(812);
  const rows = R6_MEMORIES.map((m) => ({...m, title: m.desc, desc: `${m.agent}${m.task ? ` · task ${m.task}` : ""}`, num: m.id, group: ""}));
  const weights = Array.from({length: 10}, (_, i) => [String(i + 1), String(i + 1)]);
  return <ListPage title="Memories" line="What agents keep in mind past their context" fields={R6_MEM_FIELDS} rows={rows} initial={{state: {not: false, values: ["active"]}}} chosen={chosen} onChoose={setChosen} pickTerm="memory"
    sort={[["weight", "Weight, highest first", (a, b) => b.weight - a.weight], ["newest", "Newest first", (a, b) => b.id - a.id]]}
    renderMeta={(m) => <R6_Steps w={m.weight} />}
    renderReader={(m) => <Reader key={m.id} term="memory" item={m} comments={false} head={{row: {term: "memory", id: m.id}, state: m.state === "active" ? "open" : "cancelled", stateWord: m.state === "active" ? "In force" : "Removed", byLabel: "kept by", by: m.agent, at: m.at}}
      actions={m.state === "active" ? [{group: "Memory", label: "Change the weight", icon: "gauge", desc: "memory weigh", field: {label: "Weight", options: weights, value: String(m.weight)}, confirm: "Save"}, {group: "Memory", label: "Edit the text", icon: "edit", desc: "memory edit", field: {label: "What to keep in mind", value: m.body}}, {group: "Memory", label: "Open in the inspector", icon: "open", run: () => onOpen("memory", m.id)}, {group: "Danger", label: "Remove the memory", icon: "trash", danger: true, desc: "memory remove", field: {label: "Why is it removed?"}, confirm: "Remove"}]
        : [{group: "Memory", label: "Bring it back", icon: "back", desc: "memory restore", field: {label: "Weight", options: weights, value: "5"}, confirm: "Bring it back"}]}>
      {() => <><Section title="Facts"><Fields rows={[["Kept by", <AgentLink name={m.agent} />], ["For task", m.task ? <RowLink term="task" id={m.task} /> : "No task"], ["Weight", <R6_Steps w={m.weight} />], ["Brought back by", m.keywords.length ? <span className="row" style={{gap: 4}}>{m.keywords.map((k) => <span key={k} className="chip">{k}</span>)}</span> : "No keywords"], ["Made", m.at]]} /></Section><Section title="What it keeps in mind"><Markdown text={m.body} /></Section></>}
    </Reader>} />;
}

/* ---------- Rules: rule approve, deny, edit, remove ---------- */
function RulesPage() {
  const [chosen, setChosen] = useState(19);
  const rows = R6_RULES.map((r) => ({...r, title: r.desc, desc: r.state === "proposed" ? `Proposed by ${r.by}` : `${R6_RULE_WORDS[r.state]} · ${r.at}`, num: r.id, group: R6_RULE_WORDS[r.state]}));
  return <ListPage title="Rules" line="What holds for every agent, and what agents proposed" fields={R6_RULE_FIELDS} rows={rows} initial={{state: {not: true, values: ["removed"]}}} chosen={chosen} onChoose={setChosen}
    renderMeta={(r) => r.at}
    renderReader={(r) => <Reader key={r.id} term="rule" item={r} comments head={{row: {term: "rule", id: r.id}, state: r.state === "removed" ? "cancelled" : r.state === "proposed" ? "draft" : "open", stateWord: R6_RULE_WORDS[r.state], byLabel: r.state === "proposed" ? "proposed by" : "by", by: r.by, at: r.at}}
      primary={r.state === "proposed" ? {label: "Accept the rule", done: `Rule ${r.id} accepted`} : null}
      actions={r.state === "removed" ? [{group: "Rule", label: "Copy its text", icon: "copy", done: "Text copied"}] : [{group: "Rule", label: "Edit", icon: "edit", desc: "rule edit", field: {label: "The rule", value: r.body}, confirm: "Save"}, {group: "Danger", label: r.state === "proposed" ? "Decline" : "Remove", icon: "trash", danger: true, desc: r.state === "proposed" ? "rule deny" : "rule remove", field: {label: "Why?"}}]}>
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
function TemplatesPage() {
  const [chosen, setChosen] = useState(4);
  const [making, setMaking] = useState(null);
  const toast = useToast();
  const rows = R7_TEMPLATES.map((t) => ({...t, desc: `${t.appliesTo.map((k) => R7_ROW_KINDS[k]).join(", ")} · ${t.brief}`, num: t.id, group: ""}));
  return <><ListPage title="Templates" line="Shapes you send as a comment on a plan, task or document" fields={[{key: "applies", label: "Applies to", options: Object.entries(R7_ROW_KINDS), get: (t) => t.appliesTo}]} rows={rows} chosen={chosen} onChoose={setChosen}
    header={<Btn variant="primary" small onClick={() => setMaking({})}>New template</Btn>}
    renderMeta={(t) => t.appliesTo.map((k) => R7_ROW_KINDS[k]).join(", ")}
    renderReader={(t) => <Reader key={t.id} term="template" item={{...t, abstract: t.brief}} comments={false} head={{row: {term: "template", id: t.id}, by: t.by, at: t.at}}
      primary={{label: "Send it on a row", run: () => { setMaking({send: t}); return false; }}}
      actions={[{group: "Template", label: "Copy the show command", icon: "copy", desc: `journal template show ${t.id}`, done: "Command copied"}]}>
      {() => <><Section title="Facts"><Fields rows={[["Applies to", t.appliesTo.map((k) => R7_ROW_KINDS[k]).join(", ")], ["What it is for", t.purpose], ["Asks for", r7Slots(t).length ? r7Slots(t).map((s) => `{${s}}`).join(", ") : "Nothing"]]} /></Section>
        {t.commands.length > 0 && <Section title="Runs at each phase end"><div className="r6-list">{t.commands.map((c) => <div key={c} className="link-row" style={{gridTemplateColumns: "16px minmax(0, 1fr)"}}><Icon name="term" size={13} style={{color: "var(--text-3)"}} /><span className="mono">{c}</span></div>)}</div></Section>}
        <Section title="Its parts"><Fields rows={t.parts.map(([h, b]) => [h, b || "—"])} /></Section></>}
    </Reader>} />
    {making?.send && <CreateDialog title={`Send ${making.send.title}`} sub="It goes on the row as your comment; the agent reads it there" submit="Send" onClose={() => setMaking(null)} onMade={(v) => toast(`Sent on ${R7_ROW_KINDS[v.kind].toLowerCase()} ${v.row}`)}
      command={(v) => `journal template send ${making.send.id} --on=${v.kind}:${v.row || "…"}${r7Slots(making.send).map((s) => ` --set=${s}=…`).join("")}`}
      check={(v) => (/^\d+$/.test(v.row) ? {} : {row: "Give the row's number, such as 1131."})}
      fields={[{key: "kind", label: "On a", kind: "select", options: making.send.appliesTo.map((k) => [k, R7_ROW_KINDS[k]]), required: true, half: true}, {key: "row", label: "Number", required: true, placeholder: "1131", half: true}, ...r7Slots(making.send).map((s) => ({key: "slot-" + s, label: `{${s}}`, required: true}))]} />}
    {making && !making.send && <CreateDialog title="New template" sub="Once made, a template is not changed: make a new one" submit="Make the template" onClose={() => setMaking(null)} onMade={(v) => toast(`Template 10 made: ${v.title}`)} command={(v) => `journal template make "${v.title || "…"}" --applies-to ${v.applies || "…"} --brief "…" --parts "…"${v.commands ? ' --commands "…"' : ""}`}
      fields={[{key: "title", label: "Title", required: true, placeholder: "Plan: release"}, {key: "brief", label: "What it is", required: true}, {key: "applies", label: "Applies to", kind: "select", options: [["plan", "Plans"], ["task", "Tasks"], ["doc", "Documents"], ["plan,task", "Plans and tasks"]], required: true, half: true}, {key: "purpose", label: "What it is for", half: true}, {key: "parts", label: "Parts", kind: "steps", required: true, placeholder: "Brief: what the plan is for, {goal}"}, {key: "commands", label: "Commands to run at each phase end", kind: "area", rows: 3, help: "One command a line", when: (v) => v.applies.startsWith("plan")}]} />}
  </>;
}

/* ---------- Sequences: sequence run, abandon, edit, delete, trigger make ---------- */
function SequencesPage() {
  const [chosen, setChosen] = useState(31);
  const [making, setMaking] = useState(null);
  const toast = useToast();
  const rows = R6_SEQUENCES.map((q) => ({...q, desc: `${plural(q.steps.length, "step")} · ${q.desc}`, num: q.id, group: ""}));
  return <><ListPage title="Sequences" line="Steps followed one at a time" fields={R6_SEQ_FIELDS} rows={rows} chosen={chosen} onChoose={setChosen}
    header={<Btn variant="primary" small onClick={() => setMaking({})}>New sequence</Btn>}
    renderMeta={(q) => <Badge state={q.state}>{R6_SEQ_WORDS[q.state]}</Badge>}
    renderReader={(q) => { const run = q.runs.find((r) => r.state === "started");
      return <Reader key={q.id} term="sequence" item={q} comments={false} head={{row: {term: "sequence", id: q.id}, state: q.state, stateWord: R6_SEQ_WORDS[q.state], by: q.by, at: q.at, extra: run && <span>run {run.id}, step {run.done + 1} of {run.total}, followed by <AgentLink name={run.agent} /></span>}}
        primary={run ? null : {label: "Start", done: `Sequence ${q.id} started: main follows it from step 1`}}
        actions={[...(run ? [{group: "Run", label: `Abandon run ${run.id}`, icon: "stop", desc: "sequence abandon", field: {label: "Why is it abandoned?"}, confirm: "Abandon"}] : []), {group: "Sequence", label: "Edit the steps", icon: "edit", desc: "sequence edit", run: () => { setMaking({edit: q}); return false; }}, {group: "Sequence", label: "Add a trigger", icon: "clock", desc: "trigger make", field: {label: "When it starts by itself", options: [["time", "At a time"], ["plan", "When a plan ends"], ["check", "When a check fails"]]}, confirm: "Add"}, {group: "Danger", label: "Delete the sequence", icon: "trash", danger: true, desc: "sequence delete", field: {label: "Why is it deleted?"}, confirm: "Delete"}]}
        tabs={[{key: "steps", label: "Steps", count: q.steps.length, render: () => <div className="r6-list r6-steps">{q.steps.map(([s, st], i) => <div key={i} className="link-row"><span className="r6-num">{i + 1}</span><span>{s}</span><Badge state={st} /></div>)}</div>},
          {key: "runs", label: "Runs", count: q.runs.length, render: () => q.runs.length ? <div className="r6-list r6-runs">{q.runs.map((r) => <div key={r.id} className="link-row"><span className="r6-num">{r.id}</span><AgentLink name={r.agent} /><span className="r6-bar"><i style={{width: `${(r.done / r.total) * 100}%`}} /></span><span className="r6-num">{r.done} of {r.total}</span><Badge state={r.state}>{r.state === "started" ? "Running" : undefined}</Badge></div>)}</div> : <p className="muted" style={{margin: 0}}>Never started.</p>},
          {key: "triggers", label: "Triggers", count: q.triggers.length, render: () => q.triggers.length ? <div className="r6-list r6-trig">{q.triggers.map((t) => <div key={t.id} className="link-row"><span>{t.when}</span><span className="faint">{t.kind}</span><span className="row" style={{gap: 4}}><Btn small variant="ghost" title="trigger edit">Edit</Btn><Btn small variant="ghost" title="trigger strike">End it</Btn></span></div>)}</div> : <p className="muted" style={{margin: 0}}>Started by hand only.</p>}]}>
        {() => null}
      </Reader>; }} />
    {making && <CreateDialog title={making.edit ? `Edit ${making.edit.title}` : "New sequence"} submit={making.edit ? "Save" : "Make the sequence"} onClose={() => setMaking(null)} onMade={(v) => toast(making.edit ? "Sequence saved" : `Sequence 32 made: ${v.title}`)} command={() => `journal sequence ${making.edit ? `edit ${making.edit.id}` : "make"} …`}
      fields={[{key: "title", label: "Title", required: true, value: making.edit?.title}, {key: "steps", label: "Steps", kind: "steps", required: true, placeholder: "Run the full test suite", value: making.edit?.steps.map(([s]) => s)}]} />}
  </>;
}

/* ---------- Reminders: reminder make, list, delete. A reminder is told to the agent that made it ---------- */
const R7_BLOCKS = {"task-in-hand": "until it holds a task", "task-started": "until it starts a task", "task-brief-read": "until it read the task's brief", "task-logged": "until it logs the task", "task-closed": "until it closes the task", "task-stopped": "until it stops the task", "task-blocks-reviewed": "until the task's blocks are reviewed"};
const R7_REMINDERS = [
  {id: 41, text: "Check the full run and report failures", by: "main", every: ["minutes", 30], once: false, at: null, block: "", subject: "", next: "14:30", last: "14:00", made: "today", state: "open"},
  {id: 42, text: "Log what you did before you close the task", by: "worker-4", every: ["tasks", 1], once: false, at: null, block: "task-logged", subject: "9682", next: "at the next closed task", last: "never", made: "1 h ago", state: "blocked"},
  {id: 43, text: "Weigh your memories before plan 1131 ends", by: "main", every: null, once: true, at: "16:00", block: "", subject: "", next: "16:00", last: "never", made: "20 min ago", state: "open"},
  {id: 44, text: "Read the review of plan 1133", by: "helper-851", every: ["tool-uses", 50], once: false, at: null, block: "", subject: "", next: "in 12 tool uses", last: "30 min ago", made: "2 h ago", state: "open"},
];
const r7When = (r) => [r.at && `at ${r.at}`, r.every && `every ${r.every[0] === "minutes" ? plural(r.every[1], "minute") : r.every[0] === "tasks" ? plural(r.every[1], "closed task") : plural(r.every[1], "tool use")}`, r.once && "once"].filter(Boolean).join(", ");
function RemindersPage() {
  const [chosen, setChosen] = useState(41);
  const [making, setMaking] = useState(false);
  const toast = useToast();
  const rows = R7_REMINDERS.map((r) => ({...r, title: r.text, desc: `${r7When(r)} · tells ${r.by}${r.block ? " · holds it" : ""}`, num: r.id, group: ""}));
  return <><ListPage title="Reminders" line="Told to the agent that made it, at a time, on an interval, or once" fields={[R6_AGENT_FIELD((r) => r.by, "Told to"), {key: "how", label: "Repeats", options: [["minutes", "Every so many minutes"], ["tool-uses", "Every so many tool uses"], ["tasks", "Every so many closed tasks"], ["once", "Once"]], get: (r) => (r.once ? "once" : r.every?.[0])}, {key: "block", label: "Holds the agent", options: [["yes", "Holds it until…"], ["no", "Only tells"]], get: (r) => (r.block ? "yes" : "no")}]} rows={rows} chosen={chosen} onChoose={setChosen}
    header={<Btn variant="primary" small onClick={() => setMaking(true)}>New reminder</Btn>}
    renderMeta={(r) => r.next}
    renderReader={(r) => <Reader key={r.id} term="reminder" item={r} comments={false} head={{row: {term: "reminder", id: r.id}, state: r.state === "blocked" ? "blocked" : undefined, stateWord: "Holding", byLabel: "tells", by: r.by, at: `made ${r.made}`}}
      actions={[{group: "Reminder", label: "Copy its make command", icon: "copy", desc: "to make it again with changes", done: "Command copied"}, {group: "Danger", label: "Delete the reminder", icon: "trash", danger: true, desc: "reminder delete", field: {label: "Why is it deleted?"}, confirm: "Delete"}]}>
      {() => <><Section title="Facts"><Fields rows={[["Told to", <><AgentLink name={r.by} /><span className="faint">, the agent that made it</span></>], ["When", r7When(r)], ["Holds the agent", r.block ? <span>{R7_BLOCKS[r.block]}{r.subject && <> <RowLink term="task" id={Number(r.subject)} /></>}</span> : "No: it only tells"], ["Next", r.next], ["Last told", r.last]]} /></Section><Section title="What it tells"><Markdown text={r.text} /></Section></>}
    </Reader>} />
    {making && <CreateDialog title="New reminder" sub="Made here, it is told to main, the agent you talk to" submit="Make the reminder" onClose={() => setMaking(false)} onMade={() => toast("Reminder 45 made for main")}
      command={(v) => `journal reminder make "…"${v.at ? ` --at ${v.at}` : ""}${v.how === "once" ? " --once" : ` --every-${v.how} ${v.n || "…"}`}${v.block ? ` --block ${v.block}${v.subject ? ` --block-subject ${v.subject}` : ""}` : ""}`}
      check={(v) => (v.how !== "once" && !/^\d+$/.test(v.n) ? {n: "Give a whole number."} : v.how === "once" && !v.at ? {at: "A reminder told once needs a time."} : {})}
      fields={[{key: "text", label: "What to tell", kind: "area", rows: 3, required: true}, {key: "how", label: "Repeats", kind: "select", options: [["minutes", "Every so many minutes"], ["tool-uses", "Every so many tool uses"], ["tasks", "Every so many closed tasks"], ["once", "No: once"]], required: true, half: true}, {key: "n", label: "How many", placeholder: "30", required: true, half: true, when: (v) => v.how !== "once"}, {key: "at", label: "At", placeholder: "16:00", help: "Its first time; a reminder told once needs one", half: true}, {key: "block", label: "Hold the agent", kind: "select", options: [["", "No: only tell it"], ...Object.entries(R7_BLOCKS)], half: true}, {key: "subject", label: "For task", placeholder: "9682", when: (v) => Boolean(v.block)}]} />}
  </>;
}

/* ---------- Teams: library sync, share, get, leave, versions; the users with set_library_role and remove_library_user ---------- */
function R7Person({name}) { return R6_TEAM_USERS.some((u) => u.title === name) ? <RowLink term="user" id={R6_TEAM_USERS.find((u) => u.title === name).id}>{name}</RowLink> : <AgentLink name={name} />; }
function TeamsPage() {
  const [tab, setTab] = useState(() => (r7Peek(["user"]) ? "users" : "library"));
  const [chosen, setChosen] = useState(1);
  const [publishing, setPublishing] = useState(false);
  const toast = useToast();
  const line = <span>Library <span className="mono">{R6_TEAM.library}</span> · {R6_TEAM.state} · last reached {R6_TEAM.last}</span>;
  const header = <><Btn small onClick={() => toast("Synced with the library")} title="library sync">Sync now</Btn><Btn small variant="primary" onClick={() => setPublishing(true)}>Share with the team</Btn></>;
  const tabs = <Tabs tabs={[{key: "library", label: "Library", count: R6_TEAM_ITEMS.length}, {key: "here", label: "Shared from here", count: 2}, {key: "users", label: "Users", count: R6_TEAM_USERS.length}]} value={tab} onPick={(t) => { setTab(t); setChosen(t === "users" ? "jesse" : 1); }} />;
  const items = (tab === "here" ? R6_TEAM_ITEMS.filter((i) => i.by === "Jesse" || i.by === "main") : R6_TEAM_ITEMS).map((i) => ({...i, desc: `${i.kind} · shared by ${i.by}`, group: i.kind + "s"}));
  if (tab === "users") return <ListPage key="users" title="Teams" pickTerm="user" line={line} header={header} fields={[{key: "role", label: "Role", options: [["Owner", "Owner"], ["Member", "Member"]], get: (u) => u.role}]} rows={R6_TEAM_USERS.map((u) => ({...u, desc: `${u.role} · shares ${u.shares}`}))} chosen={chosen} onChoose={setChosen} placeholder="Search users"
    renderMeta={(u) => u.last} renderReader={(u) => <Reader key={u.id} term="user" item={u} comments={false} head={{extra: <span>{u.role}</span>, at: `last seen ${u.last}`}} actions={[{group: "User", label: "Change the role", icon: "user", desc: "set_library_role", field: {label: "Role", options: [["Owner", "Owner"], ["Member", "Member"]], value: u.role}, confirm: "Save"}, {group: "Danger", label: "Take out of the team", icon: "trash", danger: true, desc: "remove_library_user", field: {label: "Why?"}}]}>{() => <><Fields rows={[["Role", u.role], ["Shares", plural(u.shares, "item")], ["Last seen", u.last]]} /><Section title="What they shared"><div className="r6-list">{R6_TEAM_ITEMS.filter((i) => i.by === u.title).map((i) => <div key={i.id} className="link-row" style={{gridTemplateColumns: "10ch minmax(0, 1fr)"}}><span className="faint">{i.kind}</span><span>{i.title}</span></div>)}</div></Section></>}</Reader>}>{tabs}</ListPage>;
  return <><ListPage key={tab} title="Teams" pickTerm="library" line={line} header={header} fields={R6_TEAM_FIELDS} rows={items} chosen={chosen} onChoose={setChosen} placeholder="Search the library"
    renderMeta={(i) => <Badge state={i.state === "Up to date" ? "open" : i.state === "Not followed" ? "draft" : "paused"}>{i.state}</Badge>}
    renderReader={(i) => <Reader key={i.id} term="library" item={i} comments={false} head={{extra: <><span>{i.kind}</span><span className="sep">·</span><span>{i.follow === "followed" ? "Followed here" : "Not followed"}</span><span className="sep">·</span><span>shared by <R7Person name={i.by} /></span></>, at: i.at}}
      primary={i.follow !== "followed" ? {label: "Follow", done: `${i.title} is followed here`} : i.state === "Newer in the library" ? {label: `Take version ${i.there}`, done: `${i.title} is at version ${i.there}`} : i.state === "Changed here" ? {label: "Share my change", done: "Your change is shared"} : null}
      actions={[{group: "Library", label: "Sync now", icon: "back", desc: "library sync"}, {group: "Library", label: "Show its versions", icon: "clock", desc: "library versions"}, ...(i.follow === "followed" ? [{group: "Library", label: "Stop following", icon: "stop", desc: "library leave", field: {label: "Your copy stays as it is. Why stop?"}, confirm: "Stop following"}] : [])]}
      tabs={[{key: "facts", label: "Details", render: () => <Fields rows={[["Kind", i.kind], ["In the library", `version ${i.there}`], ["Here", typeof i.here === "number" ? `version ${i.here}` : i.here], ["State", i.state], ["Shared by", <R7Person name={i.by} />]]} />}, {key: "compare", label: "Compare", render: () => i.state === "Up to date" || i.state === "Not followed" ? <p className="muted" style={{margin: 0}}>{i.state === "Up to date" ? "The copy here is the library's." : "Not followed: there is no copy here."}</p> : <div className="r6-diff"><div className="hunk">library → here</div><div className="del">- Run the full suite at each phase end.</div><div className="add">+ Run the full suite once, at the end of the plan.</div><div>  Each phase has its own checkpoint.</div></div>}]}>
      {() => null}
    </Reader>}>{tabs}</ListPage>
    {publishing && <CreateDialog title="Share with the team" sub={`It goes to ${R6_TEAM.library}; other journals may follow it`} submit="Share" onClose={() => setPublishing(false)} onMade={(v) => toast(`${v.item} is shared`)} command={(v) => `journal library share ${v.kind} ${v.item}`}
      fields={[{key: "kind", label: "Kind", kind: "select", options: [["skill", "Skill"], ["template", "Template"], ["rule", "Rule"]], required: true, half: true}, {key: "item", label: "Which", kind: "select", options: [["journal-documents", "journal-documents"], ["4", "Template 4"], ["19", "Rule 19"]], required: true, half: true}]} />}
  </>;
}

/* ---------- Git: as round six; commits show their short hash as the row's number; nothing deletes a branch ---------- */
function GitPage() {
  const {openFile} = useOpen();
  const [tab, setTab] = useState(() => (r7Peek(["pull"]) ? "pulls" : "commits"));
  const [chosen, setChosen] = useState(R6_COMMITS[0].id);
  const tabs = <Tabs tabs={[{key: "commits", label: "Commits", count: R6_COMMITS.length}, {key: "branches", label: "Branches", count: R6_BRANCHES.length}, {key: "pulls", label: "Pull requests", count: R6_PULLS.length}]} value={tab} onPick={(t) => { setTab(t); setChosen({commits: R6_COMMITS, branches: R6_BRANCHES, pulls: R6_PULLS}[t][0].id); }} />;
  const line = "Branch version-5 · 3 commits ahead of main";
  if (tab === "branches") return <ListPage key="b" title="Git" pickTerm="branch" line={line} fields={[{key: "kind", label: "Kind", options: [["Local", "Local"], ["Worktree", "Worktree of a task"]], get: (b) => b.kind}, R6_AGENT_FIELD((b) => b.worker, "Worker")]} rows={R6_BRANCHES.map((b) => ({...b, desc: b.task ? `task ${b.task} · ${b.worker}` : b.current ? "Current" : b.isDefault ? "Default branch" : "", group: b.kind}))} chosen={chosen} onChoose={setChosen} placeholder="Search branches"
    renderMeta={(b) => `${b.ahead} ahead · ${b.behind} behind`}
    renderReader={(b) => <Reader key={b.id} term="branch" item={b} comments={false} head={{extra: <span>{b.kind}{b.current ? " · current" : ""}</span>, at: `last commit ${b.at}`}} actions={[{group: "Branch", label: "Copy its name", icon: "copy", done: "Name copied"}]}>
      {() => <Fields rows={[b.task && ["Task", <RowLink term="task" id={b.task} />], b.worker && ["Worker", <AgentLink name={b.worker} />], ["Against main", `${b.ahead} ahead, ${b.behind} behind`], ["Last commit", <RowLink term="commit" id={b.last}><span className="mono">{b.last}</span></RowLink>], ["When", b.at]]} />}
    </Reader>}>{tabs}</ListPage>;
  if (tab === "pulls") return <ListPage key="p" title="Git" pickTerm="pull" line={line} fields={[{key: "state", label: "State", options: [["open", "Open"], ["completed", "Merged"], ["cancelled", "Closed"]], get: (p) => p.state}]} rows={R6_PULLS.map((p) => ({...p, desc: `${p.from} into ${p.into} · plan ${p.plan}`, num: p.id, group: ""}))} chosen={chosen} onChoose={setChosen} placeholder="Search pull requests"
    renderMeta={(p) => <Badge state={p.checks.some((c) => c[1] === "failed") ? "failed" : "open"}>{p.checks.some((c) => c[1] === "failed") ? "A check failed" : "Open"}</Badge>}
    renderReader={(p) => <Reader key={p.id} term="pull" item={p} comments={false} head={{row: {term: "pull", id: p.id, kind: "Pull request"}, state: "open", stateWord: "Open", by: p.by, at: p.at}} actions={[{group: "Pull request", label: "Open on GitHub", icon: "open"}, {group: "Pull request", label: "Copy the link", icon: "copy", done: "Link copied"}]}>
      {() => <><Section title="Facts"><Fields rows={[["From", <span className="mono">{p.from}</span>], ["Into", <span className="mono">{p.into}</span>], ["Plan", <RowLink term="plan" id={p.plan} />]]} /></Section><Section title="Checks"><div className="r6-list r6-checks">{p.checks.map(([n, s, t]) => <div key={n} className="link-row"><span>{n}</span><span className="r6-num">{t}</span><Badge state={s} /></div>)}</div></Section><Section title="Description"><Markdown text={p.body} /></Section></>}
    </Reader>}>{tabs}</ListPage>;
  return <ListPage key="c" title="Git" pickTerm="commit" line={line} fields={[{key: "author", label: "Author", options: [["Jesse Gall", "Jesse Gall"]], get: (c) => c.author}, {key: "task", label: "Task", options: R6_OPTS(R6_COMMITS, (c) => c.task, (t) => `Task ${t}`), get: (c) => c.task}]}
    rows={R6_COMMITS.map((c) => ({...c, desc: `task ${c.task} · ${c.author} · ${c.at}`, num: c.id, group: c.group}))} chosen={chosen} onChoose={setChosen} placeholder="Search commits"
    renderMeta={(c) => plural(c.files.length, "file")}
    renderReader={(c) => <Reader key={c.id} term="commit" item={c} comments={false} head={{row: {term: "commit", id: c.id, kind: "Commit"}, extra: <span>by {c.author}</span>, at: c.at}}
      actions={[{group: "Commit", label: "Copy the hash", icon: "copy", done: "Hash copied"}, {group: "Commit", label: "Open its files in Files", icon: "file", run: () => openFile(c.files[0][1])}]}
      tabs={[{key: "files", label: "Files changed", count: c.files.length, render: () => <><Section title="Facts"><Fields rows={[["Task", <RowLink term="task" id={c.task} />], ["Plan", <RowLink term="plan" id={c.plan} />], ["Branch", <span className="mono">{c.branch}</span>]]} /></Section>
          <Section title="Files"><div className="r6-list">{c.files.map(([g, path, add, del]) => <div key={path} className="link-row r6-files"><span className="gs" title={R6_GIT_LETTER[g]}>{g}</span><span role="link" tabIndex={0} className="ref-link mono" title={`Open ${path} in Files`} onClick={() => openFile(path)} onKeyDown={(e) => e.key === "Enter" && openFile(path)}>{path}</span><span className="num">+{add}</span><span className="num">−{del}</span></div>)}</div></Section></>},
        {key: "diff", label: "Diff", render: () => <div className="r6-diff">{c.files.slice(0, 2).map(([, path]) => <React.Fragment key={path}><div className="hunk">{path}</div><div className="del">- limit = None</div><div className="add">+ limit = worker.test_limit</div><div>  return limit</div></React.Fragment>)}</div>},
        {key: "message", label: "Message", render: () => <Markdown text={c.body || "No message body."} />}]}>
      {() => null}
    </Reader>}>{tabs}</ListPage>;
}

/* ---------- Plugins: plugin enable, disable, upgrade, remove, install (after plugin preview), log; the dialog's services: plugin service, service-log ---------- */
function PluginsPage({onOpenSettings}) {
  const [making, setMaking] = useState(null);
  const toast = useToast();
  return <><R6CardPage title="Plugins" line="Changes to the viewer and the agents' behaviour, installed here" items={R6_PLUGINS} icon="plug" switchable={() => true} onSwitch={(p, v) => `${p.title} is ${v ? "on" : "off"} (plugin ${v ? "enable" : "disable"})`}
    fields={[{key: "state", label: "State", options: [["on", "On"], ["off", "Off"], ["fault", "Has a fault"]], get: (p) => p.state}]}
    header={<Menu width={280} button={({toggle, open}) => <button type="button" className={"btn small primary menu-btn" + (open ? " on" : "")} aria-haspopup="menu" aria-expanded={open} onClick={toggle}><span>Install a plugin</span><Icon name="down" size={11} /></button>}>{(close) => <><MenuItem icon="open" desc="See what it adds before it is installed" onClick={() => { setMaking("install"); close(); }}>From a file or an address</MenuItem><MenuItem icon="plus" desc="main writes it, with the plugin guide" onClick={() => { setMaking("make"); close(); }}>Make a new one</MenuItem></>}</Menu>}
    renderState={(p) => <><span>version {p.version}</span>{p.upgrade && <><span className="sep">·</span><span>{p.upgrade} can be installed</span></>}</>}
    foot={(p) => <Btn small onClick={() => onOpenSettings(p)}>Settings</Btn>}
    actions={(p) => [{group: "Plugin", label: "Show the log", icon: "log", desc: "plugin log"}, ...(p.upgrade ? [{group: "Plugin", label: `Upgrade to ${p.upgrade}`, icon: "up", desc: "plugin upgrade", field: {label: "What changes", options: [["ok", "Adds a band setting; no new access"]]}, confirm: "Upgrade"}] : []), {group: "Danger", label: "Remove the plugin", icon: "trash", danger: true, desc: "plugin remove", field: {label: "Why is it removed?"}, confirm: "Remove"}]}
    empty={{title: "No plugins yet", line: "A plugin adds a band, a page or a hook", action: <Btn small variant="primary" onClick={() => setMaking("install")}>Install a plugin</Btn>}} />
    {making === "install" && <CreateDialog title="Install a plugin" sub="Before it is installed you see what it adds and what it may reach (plugin preview)" submit="Install" onClose={() => setMaking(null)} onMade={() => toast("Plugin installed, off until you turn it on")} command={(v) => `journal plugin install ${v.from || "…"}`}
      fields={[{key: "from", label: "File or address", required: true, placeholder: "https://github.com/team/status-band or ~/plugins/band.zip"}, {key: "preview", label: "What it adds", kind: "select", options: [["band", "A band over the chat · 1 service · reads the build state · no secret"]], help: "Read from the plugin's manifest once the address is filled in"}]} />}
    {making === "make" && <CreateDialog title="Make a plugin" sub="main writes it in your project, following the plugin guide" submit="Hand it to main" onClose={() => setMaking(null)} onMade={() => toast("Task 9701 made: main writes the plugin")} command={() => "journal task make …"}
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
    <SettingsLayout tabs={[{key: "settings", label: "Settings"}, {key: "services", label: "Services", count: plugin.services}]} tab={tab} onTab={setTab} draft={d.changed.length} onCancel={d.cancel} onSave={() => { d.save(); toast(`${plugin.title} saved (plugin configure)`); }}>
      {tab === "settings" && <SettingSection title="Settings" help="Settings this plugin declares."><SettingRow label="Read the build state every" help="Seconds" changed={ch("interval")}><input type="number" aria-label="Seconds" value={d.v.interval} style={{width: 90}} onChange={(e) => d.set("interval", Number(e.target.value))} /></SettingRow><SettingRow label="Where the band shows" changed={ch("place")}><select aria-label="Where the band shows" value={d.v.place} onChange={(e) => d.set("place", e.target.value)}><option>Over the chat</option><option>Under the top bar</option></select></SettingRow>{plugin.fault && <div className="notice bad" style={{marginTop: 12}}>{plugin.fault}. Add the credential on the Secrets page.</div>}</SettingSection>}
      {tab === "services" && <SettingSection title="Services" help="What the plugin runs beside the journal.">{services.length ? services.map((s) => <React.Fragment key={s}><SettingRow label={<span className="mono">{s}</span>} help="Running · restarted 2 h ago"><span className="row" style={{gap: 6, justifyContent: "flex-end"}}><Btn small onClick={() => setOutput(output === s ? null : s)}>{output === s ? "Hide its output" : "Show its output"}</Btn><Btn small onClick={() => toast(`${s} restarted (plugin service)`)}>Restart</Btn></span></SettingRow>{output === s && <pre className="r7-term" aria-label={`What ${s} printed`}>{"14:02:11 build state read: passing\n14:01:11 build state read: passing\n14:00:11 band drawn"}</pre>}</React.Fragment>) : <p className="muted">This plugin runs no service.</p>}</SettingSection>}
    </SettingsLayout>
  </Dialog>;
}

/* ---------- Integrations: mcp add, install, check, key, remove. No switch and no log: the journal has neither for a server ---------- */
const R7_SERVERS = [
  {id: "github", title: "github", target: "npx @modelcontextprotocol/server-github", state: "connected", tools: 26, secret: 3, profiles: ["journal-main", "journal-worker"], desc: "npx @modelcontextprotocol/server-github"},
  {id: "blender", title: "blender", target: "uvx blender-mcp", state: "failed", reason: "Failed to connect: nothing listens on port 9876. Start Blender with its add-on, then check again.", profiles: [], desc: "uvx blender-mcp"},
  {id: "claude-design", title: "claude-design", target: "https://claude.ai/design/mcp", state: "connected", tools: 24, profiles: ["journal-designer"], desc: "https://claude.ai/design/mcp"},
  {id: "linear", title: "linear", target: "https://mcp.linear.app/sse", state: "suggested", why: "Linear is named in 3 tasks", profiles: [], desc: "https://mcp.linear.app/sse"},
];
const R7_SERVER_WORDS = {connected: "Connected", failed: "Failed to connect", suggested: "Suggested"};
function IntegrationsPage() {
  const [making, setMaking] = useState(null);
  const toast = useToast();
  return <><R6CardPage title="Integrations" line="MCP servers the agents may use" items={R7_SERVERS.map((s) => ({...s, fault: s.reason}))} icon="link" groupOf={(s) => (s.state === "suggested" ? "Suggested" : "Installed")}
    fields={[{key: "state", label: "State", options: Object.entries(R7_SERVER_WORDS), get: (s) => s.state}, {key: "profile", label: "Profile", options: R6_OPTS(R7_SERVERS, (s) => s.profiles), get: (s) => s.profiles}]}
    header={<Btn variant="primary" small onClick={() => setMaking({})}>Add a server</Btn>}
    renderState={(s) => <><Badge state={s.state === "failed" ? "failed" : s.state === "suggested" ? "draft" : "open"}>{R7_SERVER_WORDS[s.state]}</Badge>{s.tools && <span>{plural(s.tools, "tool")}</span>}{s.why && <span>{s.why}</span>}</>}
    renderLine={(s) => <span className="mono" style={{fontSize: 11.5}}>{s.target}</span>}
    foot={(s) => s.state === "suggested" ? <Btn small variant="primary" title="mcp install" onClick={() => toast(`${s.title} installed; checking it`)}>Install</Btn> : s.state === "failed" ? <Btn small title="mcp check" onClick={() => toast(`Checking ${s.title}`)}>Check again</Btn> : <Btn small onClick={() => setMaking({edit: s})}>Settings</Btn>}
    actions={(s) => s.state === "suggested" ? [] : [{group: "Server", label: "Settings", icon: "gear", run: () => { setMaking({edit: s}); return false; }}, {group: "Server", label: "Check again", icon: "back", desc: "mcp check"}, {group: "Server", label: "Give it a secret", icon: "key", desc: "mcp key", field: {label: "Secret", options: R7_SECRETS.filter((x) => !x.deleted).map((x) => [String(x.id), x.title])}, confirm: "Give it"}, {group: "Danger", label: "Remove the server", icon: "trash", danger: true, desc: "mcp remove", field: {label: "Why is it removed?"}, confirm: "Remove"}]}
    empty={{title: "No servers yet", line: "An MCP server gives agents more tools", action: <Btn small variant="primary" onClick={() => setMaking({})}>Add a server</Btn>}} />
    {making && (making.edit ? <R7ServerDialog s={making.edit} onClose={() => setMaking(null)} />
      : <CreateDialog title="Add a server" sub="An MCP server the agents may call; it is checked once it is added" submit="Add the server" onClose={() => setMaking(null)} onMade={(v) => toast(`${v.name} added; checking it`)} command={(v) => `journal mcp add ${v.name || "…"} ${v.target || "…"}`}
        check={(v) => (R7_SERVERS.some((s) => s.id === v.name) ? {name: `A server is already called ${v.name}.`} : {})}
        fields={[{key: "name", label: "Name", required: true, placeholder: "sentry"}, {key: "target", label: "Command or address", required: true, placeholder: "npx @sentry/mcp-server", help: "Each profile's Tools tab says which profiles may call it"}]} />)}
  </>;
}
// a server's own dialog: what it runs, its state, its secret, who may call it. The command is fixed: remove the server and add it again to change it
function R7ServerDialog({s, onClose}) {
  const toast = useToast();
  const sec = R7_SECRETS.find((x) => x.id === s.secret);
  return <Dialog narrow title={s.title} sub={R7_SERVER_WORDS[s.state]} onClose={onClose} foot={<div className="foot"><span className="note" /><Btn onClick={() => toast(`Checking ${s.title}`)}>Check again</Btn><Btn variant="primary" onClick={onClose}>Done</Btn></div>}>
    <div className="dialog-body">
      <Fields rows={[["Runs", <span className="mono">{s.target}</span>], ["State", s.state === "connected" ? `Connected · ${plural(s.tools, "tool")}` : R7_SERVER_WORDS[s.state]], ["Secret", sec ? <RowLink term="secret" id={sec.id}>{sec.title}</RowLink> : "None: give it one in Actions"], ["May be called by", s.profiles.length ? <span className="row" style={{gap: 6}}>{s.profiles.map((n, k) => <React.Fragment key={n}>{k > 0 && ", "}<RowLink term="profile" id={n}>{n}</RowLink></React.Fragment>)}</span> : "No profile yet: allow it in a profile's Tools tab"]]} />
    </div>
  </Dialog>;
}

/* ---------- Secrets as today: values, allowed programs, helpers, a note, proposals to approve, requests to fill, delete and restore ----------
   Commands: secret make, fill, allow (a program, or --helpers), update (title, note, fields), delete, restore. */
const R7_SECRETS = [
  {id: 3, title: "GitHub token", type: "api key", fields: [{name: "key", hidden: true, filled: true}], programs: ["gh", "curl"], proposed: [{program: "git", by: "worker-4"}], helpers: false, note: "For gh and the GitHub API", deleted: false},
  {id: 5, title: "Tunler login", type: "login", fields: [{name: "username", hidden: false, filled: true}, {name: "password", hidden: true, filled: true}], programs: ["tunler"], proposed: [], helpers: true, note: "", deleted: false},
  {id: 7, title: "Sentry token", type: "api key", fields: [{name: "key", hidden: true, filled: false}], programs: [], proposed: [], helpers: false, note: "", waiting: {by: "worker-7", why: "To read the error behind task 9683"}, deleted: false},
  {id: 2, title: "Old Linear key", type: "custom", fields: [{name: "token", hidden: true, filled: true}, {name: "workspace", hidden: false, filled: true}], programs: ["curl"], proposed: [], helpers: false, note: "", deleted: true},
];
const R7_SECRET_TYPES = {"api key": ["API key", "key"], login: ["Login", "user"], custom: ["Fields you name", "grid"]};
const r7SecretState = (x) => (x.deleted ? "deleted" : x.waiting ? "waiting" : x.proposed.length ? "proposal" : "ready");
function SecretsPage() {
  const [open, setOpen] = useState(null);
  const [making, setMaking] = useState(false);
  const toast = useToast();
  const items = R7_SECRETS.map((x) => ({...x, desc: x.programs.length ? `Programs: ${x.programs.join(", ")}` : "No program may use it yet"}));
  return <><R6CardPage title="Secrets" line="Keys and logins an agent uses through a program, never shown to it" items={items} iconOf={(x) => R7_SECRET_TYPES[x.type][1]} groupOf={(x) => (x.deleted ? "Deleted: their values are kept" : "")}
    fields={[{key: "state", label: "State", options: [["ready", "Ready"], ["waiting", "Waiting for its value"], ["proposal", "A program waits for you"], ["deleted", "Deleted"]], get: r7SecretState}, {key: "type", label: "Kind", options: Object.entries(R7_SECRET_TYPES).map(([k, [l]]) => [k, l]), get: (x) => x.type}]}
    header={<Btn variant="primary" small onClick={() => setMaking(true)}>New secret</Btn>}
    renderState={(x) => <><span>Secret {x.id}</span><span className="sep">·</span><span>{R7_SECRET_TYPES[x.type][0]}</span>{x.helpers && <><span className="sep">·</span><span>helpers may use it</span></>}</>}
    renderLine={(x) => x.programs.length ? <><span>Programs:</span>{x.programs.map((p) => <span key={p} className="mono">{p}</span>)}</> : <span>No program may use it yet</span>}
    renderExtra={(x) => <>{x.waiting && <div className="r7-prop"><span><AgentLink name={x.waiting.by} /> asks for it: {x.waiting.why}</span><Btn small variant="primary" onClick={() => setOpen(x)}>Fill it in</Btn></div>}
      {x.proposed.map((p) => <div key={p.program} className="r7-prop"><span><AgentLink name={p.by} /> proposes <code className="mono">{p.program}</code></span><Btn small variant="primary" title={`secret allow ${x.id} ${p.program}`} onClick={() => toast(`${p.program} may use ${x.title}`)}>Allow {p.program}</Btn></div>)}</>}
    foot={(x) => x.deleted ? <Btn small title={`secret restore ${x.id}`} onClick={() => toast(`${x.title} is back`)}>Restore</Btn> : <Btn small onClick={() => setOpen(x)}>Edit</Btn>}
    actions={(x) => x.deleted ? [] : [{group: "Secret", label: "Copy its number", icon: "copy", desc: `secret ${x.id}`, done: "Number copied"}, {group: "Danger", label: "Delete the secret", icon: "trash", danger: true, desc: "secret delete: its values are kept, and it can be restored", field: {label: "Why is it deleted?"}, confirm: "Delete"}]}
    empty={{title: "No secrets yet", line: "A key or login an agent needs for a program", action: <Btn small variant="primary" onClick={() => setMaking(true)}>New secret</Btn>}} />
    {open && <R7SecretDialog x={open} onClose={() => setOpen(null)} />}
    {making && <CreateDialog title="New secret" sub="Its values are kept out of every agent's view; an agent uses it through the programs you allow" submit="Keep the secret" onClose={() => setMaking(false)} onMade={(v) => toast(`Secret 8 kept: ${v.title}`)}
      command={(v) => `journal secret make "${v.title || "…"}" --type "${v.type}"${v.note ? ' --brief "…"' : ""}, then secret fill 8 … and secret allow 8 ${v.program || "…"}`}
      fields={[{key: "type", label: "Kind", kind: "select", options: Object.entries(R7_SECRET_TYPES).map(([k, [l]]) => [k, l]), required: true, half: true}, {key: "title", label: "Title", required: true, placeholder: "Sentry token", half: true}, {key: "value", label: "Key", kind: "password", required: true, when: (v) => v.type === "api key"}, {key: "user", label: "Username", required: true, half: true, when: (v) => v.type === "login"}, {key: "password", label: "Password", kind: "password", required: true, half: true, when: (v) => v.type === "login"}, {key: "fields", label: "Fields and their values", kind: "steps", placeholder: "token: …", required: true, when: (v) => v.type === "custom"}, {key: "program", label: "Program that may use it", placeholder: "curl"}, {key: "note", label: "Note for the agent", placeholder: "For the Sentry API"}]} />}
  </>;
}
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
  return <Dialog narrow title={x.title} sub={x.waiting ? <span><AgentLink name={x.waiting.by} /> asked for it: {x.waiting.why}. Fill it in, then save.</span> : `Secret ${x.id} · ${R7_SECRET_TYPES[x.type][0]}`} onClose={close}
    foot={<div className="foot"><span className="note">{changes.length ? `${plural(changes.length, "change")} to save` : "No changes"}</span><Btn onClick={close}>Cancel</Btn><Btn variant="primary" disabled={!changes.length || !title.trim()} onClick={save}>Save</Btn></div>}>
    <div className="dialog-body">
      <div className="r7-sec"><span className="lab">Credentials</span>
        {fields.map((f) => <label key={f.name} className="r7-field"><span>{f.name}</span><span className="r7-line"><input type={f.hidden ? "password" : "text"} autoComplete="off" aria-label={f.name} value={values[f.name] || ""} placeholder={f.filled ? "Kept · type to replace it" : "Not filled in yet"} onChange={(e) => setValues({...values, [f.name]: e.target.value})} />{x.type === "custom" ? <Btn small variant="ghost" onClick={() => setFields(fields.filter((g) => g !== f))}>Remove</Btn> : <span />}</span></label>)}
        {x.type === "custom" && <span className="r7-line"><input type="text" aria-label="Add a field" placeholder="Add a field" value={newField} onChange={(e) => setNewField(e.target.value)} /><Btn small disabled={!newField.trim()} onClick={() => { setFields([...fields, {name: newField.trim(), hidden: true, filled: false}]); setNewField(""); }}>Add</Btn></span>}
      </div>
      <div className="r7-sec"><span className="lab">Allowed programs</span>
        {programs.length ? <div className="r7-chips">{programs.map((p) => <span key={p} className="chip mono">{p}</span>)}</div> : <span className="muted">No program may use it yet.</span>}
        {proposed.map((p) => <div key={p.program} className="r7-prop"><span><AgentLink name={p.by} /> proposes <code className="mono">{p.program}</code></span><Btn small variant="primary" onClick={() => allow(p.program)}>Allow {p.program}</Btn></div>)}
        <span className="r7-line"><input type="text" aria-label="Allow a program" placeholder="Allow a program, such as curl" value={newProgram} onChange={(e) => setNewProgram(e.target.value)} /><Btn small disabled={!newProgram.trim()} onClick={() => allow(newProgram.trim())}>Allow</Btn></span>
      </div>
      <div className="r7-sec"><span className="lab">Helpers</span>{helpers ? <span className="muted">Helpers may use it too.</span> : <div className="r7-line"><span className="muted">Helpers may not use it.</span><Btn small onClick={() => setHelpers(true)}>Allow helpers</Btn></div>}</div>
      <div className="r7-sec"><span className="lab">Title and note</span><label className="r7-field"><span>Title</span><input type="text" value={title} onChange={(e) => setTitle(e.target.value)} /></label><label className="r7-field"><span>Note for the agent</span><input type="text" value={note} placeholder="What it is for" onChange={(e) => setNote(e.target.value)} /></label></div>
    </div>
    {asking && <LeaveDialog count={changes.length} onStay={() => setAsking(false)} onDiscard={onClose} onSave={save} />}
  </Dialog>;
}

/* ---------- plan focus: the menu closes on a pick; "and n more" is a plain line ---------- */
function FocusFact() {
  const {plan, source, ended, choose} = useFocus();
  const toast = useToast();
  const {open} = useOpen();
  const [hover, setHover] = useState(null);
  if (!plan) return <span className="now-focus default" title="No plan is started or approved, so the agent has no plan focus"><Icon name="target" size={12} /><span className="word">No plan focus</span></span>;
  const {total, done} = planProgress(plan);
  const choosable = PLANS.filter(FOCUSABLE).sort((a, b) => (a.id === plan.id ? -1 : b.id === plan.id ? 1 : a.id - b.id));
  const waiting = PLANS.filter((p) => !FOCUSABLE(p) && !R6_ENDED(p));
  const closed = PLANS.filter(R6_ENDED).length;
  const shown = choosable.slice(0, R6_MENU_MAX);
  const cmd = hover === "default" ? "journal plan focus --clear" : `journal plan focus ${hover ?? plan.id}`;
  return <Menu align="left" width={460} button={({toggle, open: isOpen}) => <button type="button" className={"now-focus" + (source === "default" ? " default" : "") + (isOpen ? " on" : "")} title={`${source === "default" ? "The default focus: the oldest started plan with work" : "The plan main works on first"}: plan ${plan.id}, ${done} of ${total} tasks done. Change it`} aria-haspopup="menu" aria-expanded={isOpen} onClick={toggle}>
      <Icon name="target" size={12} /><span className="word">Focus</span>{plan.id !== TASKS.find((x) => x.id === AGENTS[0].task)?.plan && <b>Plan {plan.id}</b>}<FocusBar plan={plan} /><span>{done} of {total}</span>
    </button>}>{(close) => { const row = (p, can) => { const pr = planProgress(p); const on = plan.id === p.id;
      return <button key={p.id} type="button" role="menuitemradio" aria-checked={on} aria-disabled={!can} className="focus-row" title={can ? p.title : `${p.title}: only a started or approved plan can be the focus`}
        onMouseEnter={() => can && setHover(p.id)} onFocus={() => can && setHover(p.id)} onClick={() => { if (!can) return; choose(p.id); toast(`Plan ${p.id} is main's focus`); close(); }}>
        <span className="tick">{on && <Icon name="tick" size={12} />}</span><span>Plan</span><span className="n">{p.id}</span><span>{p.title}</span><span className="st">{STATE_WORDS[p.state]}</span><FocusBar plan={p} /><span className="num">{pr.done} of {pr.total}</span>
      </button>; };
      return <div onMouseLeave={() => setHover(null)}>
      <div className="dd-head"><span>Plan focus of main</span><span className="grow" /><span className="faint" style={{fontSize: 11}}>{source === "default" ? "the default" : "named"}</span></div>
      <div className="dd-sub">{ended ? `Plan ${ended.id} was ${ended.state === "completed" ? "completed" : "cancelled"}, so main is back on the default focus.` : "The plan main works on first. Its tasks are handed out before the others."}</div>
      <div className="focus-group">Started or approved</div>
      {shown.map((p) => row(p, true))}
      {choosable.length > shown.length && <div className="focus-more">and {choosable.length - shown.length} more, in the Plans window</div>}
      {waiting.length > 0 && <><div className="focus-group">Not started or approved yet</div>{waiting.slice(0, 3).map((p) => row(p, false))}</>}
      <div className="focus-more">{plural(closed, "completed or cancelled plan")} left out.</div>
      <div className="menu-sep" />
      <div onMouseEnter={() => setHover("default")}><MenuItem icon="back" desc={`Now plan ${defaultFocus()?.id ?? "none"}: the oldest started plan with work`} onClick={() => { choose(null); toast("main is back on the default focus"); close(); }}>Use the default</MenuItem></div>
      <MenuItem icon="plan" onClick={() => { open("plan", plan.id); close(); }}>Open plan {plan.id}</MenuItem>
      <div className="dd-foot mono">{cmd}</div>
    </div>; }}</Menu>;
}

Object.assign(window, {SourceBadge, R7_PAGE_OF, R7_PICK, ListReaderLayout, ListPage, R6CardPage, SkillsPage, MemoriesPage, RulesPage, TemplatesPage, SequencesPage, RemindersPage, TeamsPage, GitPage, PluginsPage, PluginSettingsDialog, IntegrationsPage, R7ServerDialog, SecretsPage, R7SecretDialog, FocusFact, R7_SECRETS, R7_REMINDERS, R7_TEMPLATES});
