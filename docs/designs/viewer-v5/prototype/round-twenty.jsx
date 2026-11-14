// Round twenty (user 122163): a right click never leaves the browser's highlight on what was clicked. Loaded after round-nineteen-menus.jsx.
// The browser acts on the right button's PRESS, before the contextmenu event that round-nineteen-menus.jsx cancels: on macOS the press
// selects the word under the pointer (the blue highlight), and in every browser it moves focus. Cancelling contextmenu does not undo either.
// So the press itself is cancelled, in the capture phase, before any component sees it:
// - everywhere: nothing is selected and focus does not move; the journal's menu then opens as before, with the accent ring of round nineteen;
// - Ctrl and a click on macOS is the same right click, so it is cancelled too;
// - on text the person already selected, the press is left alone, so the selection stays and the menu offers Copy for it;
// - in a text field the press is cancelled too, and the field takes focus with its caret and selection where they were.
// A side effect fixed with it: the word the browser selected used to make the menu think text was chosen (ajFind), so a message showed
// the text menu (Copy, Search for it, Quote) instead of its own.
const ajMac = /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);
const ajRightPress = (e) => e.button === 2 || (ajMac && e.button === 0 && e.ctrlKey);
// the pointer is on text the person selected before this click
const ajOnSelection = (e) => {
  const s = getSelection();
  if (!s || s.isCollapsed || !s.rangeCount) return false;
  return [...s.getRangeAt(0).getClientRects()].some((r) => e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom);
};
if (!window.__ajRightPress) {
  window.__ajRightPress = true;
  addEventListener("mousedown", (e) => {
    if (!ajRightPress(e) || ajOnSelection(e)) return;
    e.preventDefault();
    const field = e.target.closest?.("input, textarea, [contenteditable=true]");
    if (field && document.activeElement !== field) field.focus({preventScroll: true});
  }, true);
}
