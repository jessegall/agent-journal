import {watch} from "vue";

const ROWS_AT_REST = 3;
const MOST_ROWS = 16;

// the rows the box shows for a text of so many lines: its resting size up to two lines, then always one row more than the text fills
const composerRows = (lines) => Math.min(Math.max(ROWS_AT_REST, lines + 1), MOST_ROWS);

// the text's own height shows only in a box too small for it, so the box is emptied of its height for the measure, without a transition, in
// the same frame; the height it then gets runs through the stylesheet's transition, except a box emptied by a send, which takes its resting
// height at once so the chat above it is resized in the frame the sent message lands in, and does not follow the box down as it shrinks
function fitToText(box, atOnce) {
    const shownHeight = box.style.height || `${box.offsetHeight}px`;
    const lineHeight = parseFloat(getComputedStyle(box).lineHeight);
    box.style.transition = "none";
    box.style.height = "0px";
    const rows = composerRows(Math.round(box.scrollHeight / lineHeight));
    box.style.height = shownHeight;
    void box.offsetHeight;
    if (!atOnce) box.style.transition = "";
    box.style.overflowY = rows === MOST_ROWS ? "auto" : "hidden";
    box.style.height = `${rows * lineHeight}px`;
    if (!atOnce) return;
    void box.offsetHeight;
    box.style.transition = "";
}

export function useComposerHeight(box, text) {
    watch(text, (shown) => box.value && fitToText(box.value, shown === ""), {flush: "post"});
}
