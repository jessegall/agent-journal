// A paste into a field is done by the page with the words the paste event carries, not left to the browser's second read of the
// clipboard: a dictation tool restores the clipboard a moment after its paste, and the browser's own insertion then finds it empty.
const FIELDS = "input, textarea";

function insert(field, text) {
    field.focus();
    if (typeof document.execCommand === "function" && document.execCommand("insertText", false, text)) return;
    const start = field.selectionStart ?? field.value.length;
    const end = field.selectionEnd ?? field.value.length;
    field.setRangeText(text, start, end, "end");
    field.dispatchEvent(new InputEvent("input", {bubbles: true, inputType: "insertFromPaste", data: text}));
}

function pasted(event) {
    const field = event.target && event.target.closest && event.target.closest(FIELDS);
    if (!field || field.readOnly || field.disabled || event.defaultPrevented || !event.clipboardData) return;
    const text = event.clipboardData.getData("text/plain");
    if (!text) return;
    event.preventDefault();
    insert(field, text);
}

export function pasteByHand(win = window) {
    win.addEventListener("paste", pasted);
}
