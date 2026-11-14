// The question asked before a page with unsaved changes is left. The Settings page is round-six-focus.jsx's,
// the plugin dialog round-seven.jsx's.

function LeaveDialog({count, onStay, onDiscard, onSave}) {
  return <Dialog narrow title={plural(count, "unsaved change")} onClose={onStay}
    foot={<div className="foot"><span className="grow" /><Btn onClick={onStay}>Stay</Btn><Btn className="danger" onClick={onDiscard}>Discard</Btn><Btn variant="primary" onClick={onSave}>Save</Btn></div>} />;
}

Object.assign(window, {LeaveDialog});
