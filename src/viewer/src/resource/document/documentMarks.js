// A comment's selection is found and drawn by its place in the text a reader sees, the text nodes of the document without its buttons.
const NOT_TEXT = "button, [data-comment-number]";
const BLOCKS = "p, li, h3, h4, h5, h6, blockquote, table, .chat-code-block";

function textNodes(root) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) {
        if (!walker.currentNode.parentElement.closest(NOT_TEXT)) nodes.push(walker.currentNode);
    }
    return nodes;
}

function placeOf(nodes, container, offset) {
    const point = document.createRange();
    point.setStart(container, offset);
    point.collapse(true);
    let passed = 0;
    for (const node of nodes) {
        if (node === container) return passed + offset;
        if (point.comparePoint(node, 0) >= 0) return passed;
        passed += node.data.length;
    }
    return passed;
}

const typeOf = (element) => (element.closest("pre") ? "code" : element.closest("tr") ? "row" : "text");

// what is selected inside the document: its words, where they start and whether they are text, code or a table row; null when nothing is
export function selectionIn(root) {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed || !selection.rangeCount) return null;
    const range = selection.getRangeAt(0);
    if (!root.contains(range.commonAncestorContainer)) return null;
    const nodes = textNodes(root);
    const text = nodes.map((node) => node.data).join("");
    const start = placeOf(nodes, range.startContainer, range.startOffset);
    const picked = text.slice(start, placeOf(nodes, range.endContainer, range.endOffset));
    const quote = picked.trim();
    if (!quote) return null;
    const ancestor = range.commonAncestorContainer;
    return {quote, position: start + picked.indexOf(quote), selection_type: typeOf(ancestor.nodeType === Node.TEXT_NODE ? ancestor.parentElement : ancestor)};
}

// where a selection is now: its own place, or the nearest place its words appear if the text has changed; -1 when they are gone
function startOf(text, {quote, position}) {
    if (text.startsWith(quote, position ?? 0)) return position ?? 0;
    let nearest = -1;
    for (let found = text.indexOf(quote); found >= 0; found = text.indexOf(quote, found + 1)) {
        if (nearest < 0 || Math.abs(found - position) < Math.abs(nearest - position)) nearest = found;
    }
    return nearest;
}

// the text nodes a stretch of the text falls in, each with the part of it that does
function stretches(nodes, start, end) {
    const parts = [];
    let passed = 0;
    for (const node of nodes) {
        const from = Math.max(start - passed, 0);
        const to = Math.min(end - passed, node.data.length);
        if (from < to) parts.push({node, from, to});
        passed += node.data.length;
    }
    return parts;
}

function numberButton(number, id, label = "Comment") {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "comment-number";
    button.dataset.commentNumber = id;
    button.setAttribute("aria-label", `${label} ${number}`);
    button.textContent = number;
    return button;
}

function wrapped({node, from, to}) {
    const range = document.createRange();
    range.setStart(node, from);
    range.setEnd(node, to);
    const mark = document.createElement("mark");
    range.surroundContents(mark);
    return mark;
}

// a line of code or a table row is tinted whole; anything else is tinted word by word
function drawn(root, mark) {
    const nodes = textNodes(root);
    const start = startOf(nodes.map((node) => node.data).join(""), mark);
    if (start < 0) return false;
    const parts = stretches(nodes, start, start + mark.quote.length);
    const lineOf = (part) => part.node.parentElement.closest(mark.selection_type === "code" ? ".code-line" : "tr");
    const elements = mark.selection_type === "text" ? parts.reverse().map(wrapped).reverse() : [...new Set(parts.map(lineOf).filter(Boolean))];
    for (const element of elements) {
        element.classList.add(mark.pending ? "selection-pending" : "selection-comment");
        if (mark.hot) element.classList.add("hot");
        if (mark.id) element.dataset.comment = mark.id;
    }
    if (!mark.number || !elements.length) return true;
    if (mark.selection_type === "row") elements.at(-1).lastElementChild.append(numberButton(mark.number, mark.id, mark.label));
    else if (mark.selection_type === "code") elements[0].prepend(numberButton(mark.number, mark.id, mark.label));
    else elements.at(-1).append(numberButton(mark.number, mark.id, mark.label));
    return true;
}

// draws the marks last place first, so what one wraps does not move the places of those before it; gives back the ids it could not place
export function drawMarks(root, marks) {
    const lost = [];
    for (const mark of [...marks].sort((one, other) => (other.position ?? 0) - (one.position ?? 0))) {
        if (!drawn(root, mark) && mark.id) lost.push(mark.id);
    }
    return lost;
}

export const blockOf = (element) => element.closest(BLOCKS) ?? element;

// the comments in the order of their selections in the text, each selection with its number; one on the whole document has none
export function numbered(comments) {
    let number = 0;
    const onText = comments.filter((comment) => comment.quote).sort((one, other) => (one.position ?? 0) - (other.position ?? 0)).map((comment) => ({...comment, number: ++number}));
    return [...comments.filter((comment) => !comment.quote), ...onText];
}
