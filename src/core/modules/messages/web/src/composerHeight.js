import {watch} from "vue";

const ROWS_AT_REST = 3;
const MOST_ROWS = 16;

// the rows the box shows for a text of so many lines: its resting size up to two lines, then always one row more than the text fills
const composerRows = (lines) => Math.min(Math.max(ROWS_AT_REST, lines + 1), MOST_ROWS);

// the text's own height shows only in a box too small for it, so the box is emptied of its height for the measure, without a transition, in
// the same frame; the height it then gets runs through the stylesheet's transition
function fitToText(box) {
    const shownHeight = box.style.height || `${box.offsetHeight}px`;
    const lineHeight = parseFloat(getComputedStyle(box).lineHeight);
    box.style.transition = "none";
    box.style.height = "0px";
    const rows = composerRows(Math.round(box.scrollHeight / lineHeight));
    box.style.height = shownHeight;
    void box.offsetHeight;
    box.style.transition = "";
    box.style.overflowY = rows === MOST_ROWS ? "auto" : "hidden";
    box.style.height = `${rows * lineHeight}px`;
}

export function useComposerHeight(box, text) {
    watch(text, () => box.value && fitToText(box.value), {flush: "post"});
}
