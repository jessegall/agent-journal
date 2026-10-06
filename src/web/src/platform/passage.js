const MARKS = "`*_";
const LONGEST = 160;

const squeeze = (text) =>
    [...text]
        .filter((ch) => !MARKS.includes(ch))
        .join("")
        .replace(/\s+/g, " ")
        .trim();

function spelled(root) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    let text = "";
    const at = [];
    while (walker.nextNode()) {
        const node = walker.currentNode;
        [...node.data].forEach((ch, i) => {
            if (MARKS.includes(ch)) return;
            if (/\s/.test(ch)) {
                if (!text || text.endsWith(" ")) return;
                text += " ";
            } else text += ch;
            at.push([node, i]);
        });
    }
    return {text, at};
}

export function passageIn(root, quote) {
    const needle = squeeze(quote).slice(0, LONGEST).trim();
    if (!root || !needle) return null;
    const {text, at} = spelled(root);
    const start = text.indexOf(needle);
    if (start < 0) return null;
    const range = document.createRange();
    range.setStart(...at[start]);
    const [node, offset] = at[start + needle.length - 1];
    range.setEnd(node, offset + 1);
    return range;
}

export function markPassage(name, range) {
    if (!window.CSS?.highlights) return;
    if (range) CSS.highlights.set(name, new Highlight(range));
    else CSS.highlights.delete(name);
}
