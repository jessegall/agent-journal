// Round six, part 4: the card shape all three card pages share, and Secrets on it. Replaces R6CardPage and SecretsPage of round-six-pages.jsx.
// A card: the kind's icon, the title, its state in words, one line of what it is (or, for a secret, who uses it, as links), the main button and Actions.

function R6CardPage({title, line, items, icon, fields, header, renderState, renderLine, switchable, foot, actions, empty}) {
  const [value, setValue] = useState(emptyFilter());
  const [words, setWords] = useState("");
  const [on, setOn] = useState(Object.fromEntries(items.map((i) => [i.id, i.on])));
  const toast = useToast();
  const shown = applyFilter(items, fields, value, words, (i) => `${i.title} ${i.desc || ""}`);
  return <div className="page" data-screen-label={title}>
    <PageHeader title={title} line={line}>{header}</PageHeader>
    <div className="r6-fbar"><FilterBar fields={fields} rows={items} value={value} onChange={setValue} words={words} onWords={setWords} shown={shown.length} placeholder={`Search ${title.toLowerCase()}`} /></div>
    <div style={{height: 12}} />
    <CardGridLayout items={shown} emptyTitle={items.length ? "Nothing matches the filters" : empty.title} emptyLine={items.length ? null : empty.line} emptyAction={items.length ? <Btn small onClick={() => { setValue(emptyFilter()); setWords(""); }}>Clear the filters</Btn> : empty.action}
      renderCard={(p) => <div key={p.id} className="card">
        <div className="row"><span className="tile-mark r6"><Icon name={icon} size={14} /></span><div className="grow" style={{minWidth: 0}}><h3 title={p.title}>{p.title}</h3><div className="r6-card-state">{renderState(p, on[p.id])}</div></div>{switchable && <Switch on={on[p.id]} onChange={(v) => { setOn({...on, [p.id]: v}); toast(`${p.title} is ${v ? "on" : "off"}`); }} title={`${on[p.id] ? "Turn off" : "Turn on"} ${p.title}`} />}</div>
        <p title={p.desc}>{renderLine ? renderLine(p) : p.desc}</p>
        {p.fault && <div className="notice bad" style={{padding: "6px 10px"}}>{p.fault}</div>}
        <div className="row" style={{marginTop: "auto"}}>{foot(p)}<span className="grow" /><ActionMenu actions={actions(p)} onDone={toast} /></div>
      </div>} />
  </div>;
}

// a secret: its masked value, who uses it as links, when it was last used, Replace the value. No on/off switch: a key is not a thing that runs.
function R6UsedBy({s}) {
  if (!s.usedBy.length) return "nothing yet";
  return s.usedBy.map(([t, id], k) => <React.Fragment key={id}>{k > 0 && ", "}{t === "setting" ? id : <RowLink term={t} id={id}>{t === "integration" ? R6_INTEGRATIONS.find((x) => x.id === id)?.title : id}</RowLink>}</React.Fragment>);
}
function SecretsPage() {
  const [making, setMaking] = useState(null);
  const toast = useToast();
  const items = R6_SECRETS.map((s) => ({...s, desc: `Used by ${s.usedBy.map(([, id]) => id).join(", ") || "nothing yet"}`}));
  return <><R6CardPage title="Secrets" line="Keys and logins, never shown to an agent in full" items={items} icon="key"
    fields={[{key: "state", label: "Use", options: [["used", "In use"], ["unused", "Not used"]], get: (s) => s.state}, {key: "kind", label: "Kind", options: [["Token", "Token"], ["Key", "Key"]], get: (s) => s.kind}]}
    header={<Btn variant="primary" small onClick={() => setMaking({})}>New secret</Btn>}
    renderState={(s) => <><span className="r6-mask">{s.mask}</span><span>·</span><span>{s.kind}</span></>}
    renderLine={(s) => <>Used by <R6UsedBy s={s} /></>}
    foot={(s) => <><Btn small onClick={() => setMaking({replace: s})}>Replace the value</Btn><span className="faint ellipsis" style={{fontSize: 11.5}}>last used {s.last}</span></>}
    actions={(s) => [{group: "Secret", label: "Copy its name", icon: "copy", desc: s.id, done: "Name copied"}, {group: "Danger", label: "Remove the secret", icon: "trash", danger: true, field: {label: "Why is it removed?"}, confirm: "Remove", run: () => (s.usedBy.length ? `${s.title} is used by ${s.usedBy.length === 1 ? "one row" : `${s.usedBy.length} rows`}. Give them another secret first.` : undefined)}]}
    empty={{title: "No secrets yet", line: "A key or login an integration or a plugin needs", action: <Btn small variant="primary" onClick={() => setMaking({})}>New secret</Btn>}} />
    {making?.replace && <CreateDialog title={`Replace ${making.replace.title}`} sub={<span>Used by <R6UsedBy s={making.replace} />. They use the new value from their next call.</span>} submit="Replace" onClose={() => setMaking(null)} onMade={() => toast(`${making.replace.title} replaced`)} command={() => `journal secret replace ${making.replace.id}`}
      fields={[{key: "value", label: "New value", kind: "password", required: true, help: "It is never shown again, here or to an agent"}]} />}
    {making && !making.replace && <CreateDialog title="New secret" sub="A key or login, kept out of every agent's view" submit="Keep the secret" onClose={() => setMaking(null)} onMade={(v) => toast(`${v.title} kept`)} command={(v) => `journal secret make ${v.name || "…"}`}
      check={(v) => (R6_SECRETS.some((s) => s.id === v.name) ? {name: `A secret is already called ${v.name}.`} : {})}
      fields={[{key: "title", label: "Title", required: true, placeholder: "Sentry token", half: true}, {key: "name", label: "Name", required: true, placeholder: "sentry", half: true}, {key: "value", label: "Value", kind: "password", required: true}, {key: "for", label: "For", kind: "select", options: [["", "Nothing yet"], ...R6_INTEGRATIONS.map((i) => [i.id, i.title])]}]} />}
  </>;
}

Object.assign(window, {R6CardPage, R6UsedBy, SecretsPage});
