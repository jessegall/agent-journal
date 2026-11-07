// A field the user is in, with words in it, holds the page's own reloads: a newer viewer build, a new server version, an
// environment change. The reload comes once the field is left.
export function fieldBusy(doc = document) {
    const el = doc.activeElement;
    return !!el && (el.isContentEditable || (el.matches("input, textarea") && !!el.value));
}

export function reloadWhenFree(win = window) {
    if (!fieldBusy(win.document)) {
        win.location.reload();
        return;
    }
    const again = win.setInterval(() => {
        if (fieldBusy(win.document)) return;
        win.clearInterval(again);
        win.location.reload();
    }, 1000);
}
