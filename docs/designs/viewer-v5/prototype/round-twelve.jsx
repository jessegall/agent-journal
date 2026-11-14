// Round twelve (messages 121169 and 121171): no sentence labels. Use an icon where an icon will do; where a label stays, it is a plain
// short word or noun phrase (Output, Logs, Retry), written where it is used. Nothing rewrites a label at run time (round seventeen):
// a button that only opens something is the open icon with its tooltip (<Btn icon="open" title="Output" />).
// Replaces by name: Btn, MenuButton, CommentBox. Adds R12Open.

function Btn({variant = "", small, icon, children, title, onClick, disabled, className = "", style, type = "button", ...rest}) {
  const iconOnly = !children && icon;
  const cls = ["btn", variant, small && "small", iconOnly && "icon", className].filter(Boolean).join(" ");
  const safe = Object.fromEntries(Object.entries(rest).filter(([k]) => k.startsWith("aria-") || k.startsWith("data-")));
  return <button type={type} className={cls} title={title} aria-label={title || (typeof children === "string" ? children : undefined)} onClick={onClick} disabled={disabled} style={style} {...safe}>{iconOnly ? <Icon name={icon} size={13} /> : children}</button>;
}
function MenuButton({label, open, onClick, title}) {
  return <button type="button" className={"btn small menu-btn" + (open ? " on" : "")} aria-haspopup="menu" aria-expanded={open} title={title} onClick={onClick}><span>{label}</span><Icon name="down" size={11} /></button>;
}

// the comment box: closed, it is the chat icon and the word Comment; its count is a number with the icon, shown only when there are comments
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
        <textarea ref={box} value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Comment" aria-label="Comment" />
        <div className="row"><span className="faint grow" style={{fontSize: 11}}><span className="kbd">⌘</span> <span className="kbd">Enter</span></span><Btn small onClick={() => setOpen(false)}>Cancel</Btn><Btn small variant="primary" disabled={!draft.trim()} onClick={send}>Send</Btn></div>
      </div>
      : <div className="cbox-closed">
        <button type="button" className="cbox-open-btn" onClick={() => setOpen(true)}><span className="cbox-mark"><Icon name={sent ? "tick" : "chat"} size={13} /></span><span>Comment</span>{draft && <span className="faint" style={{fontSize: 11, marginLeft: "auto"}}>Draft</span>}</button>
        {onShow && count > 0 && <button type="button" className="btn small ghost r12-count" title="Comments" aria-label={`Comments: ${count}`} onClick={onShow}><Icon name="chat" size={12} />{count}</button>}
      </div>}
  </div></div>;
}

/* ---------- an open icon in place of a text link ---------- */
function R12Open({title, onClick}) { return <button type="button" className="r12-open" title={title} aria-label={title} onClick={onClick}><Icon name="open" size={12} /></button>; }

Object.assign(window, {Btn, MenuButton, CommentBox, R12Open});
