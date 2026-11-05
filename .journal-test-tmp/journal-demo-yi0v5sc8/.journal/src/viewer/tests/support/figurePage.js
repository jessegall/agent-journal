import {JSDOM} from "jsdom";

export const CHAT = {left: 200, top: 100, right: 900, bottom: 800};
export const VIEW = {left: 200, top: 100, right: 900, bottom: 600};
const HOME = {left: 300, right: 700, top: 600, bottom: 720};
const CONTROLS = "button, a[href], input, select, textarea, [role=tab], [role=button], [tabindex]:not([tabindex='-1'])";
const queries = new WeakMap();

// A full DOM rectangle, retaining caller-supplied coordinates for moving geometry fixtures.
function rectangle(box) {
    const left = box.left ?? box.x ?? 0;
    const top = box.top ?? box.y ?? 0;
    const right = box.right ?? left + (box.width ?? 0);
    const bottom = box.bottom ?? top + (box.height ?? 0);
    return {x: left, y: top, left, top, right, bottom, width: right - left, height: bottom - top};
}

export const boxed = (box) => ({isConnected: true, getBoundingClientRect: () => rectangle(box), querySelector: () => null, querySelectorAll: () => []});

// A real chat DOM with explicit geometry because JSDOM has no layout engine.
export function page(bubble) {
    const dom = new JSDOM('<main data-figure-world><section data-figure-scroll></section><div data-figure-home></div></main>');
    const {window} = dom;
    const {document} = window;
    Object.defineProperties(window, {innerWidth: {value: 1280, configurable: true}, innerHeight: {value: 800, configurable: true}});
    document.querySelector("[data-figure-world]").getBoundingClientRect = () => rectangle(CHAT);
    const scroll = document.querySelector("[data-figure-scroll]");
    scroll.getBoundingClientRect = () => rectangle(VIEW);
    const select = scroll.querySelectorAll.bind(scroll);
    scroll.querySelectorAll = (selector) => selector === "[data-figure-bubble]" ? (bubble ? [bubble] : []) : select(selector);
    const home = document.querySelector("[data-figure-home]");
    home.getBoundingClientRect = () => rectangle(HOME);
    globalThis.window = window;
    globalThis.document = document;
    globalThis.Node = window.Node;
    globalThis.CSS = {escape: (value) => String(value).replace(/[^a-zA-Z0-9_-]/g, (letter) => `\\${letter}`)};
    return home;
}

function parentFor(document, within) {
    const parent = document.createElement("span");
    if (within?.startsWith(".")) parent.className = within.slice(1).split(".").join(" ");
    const attribute = within?.match(/^\[([^=\]]+)(?:=["']?([^"'\]]+)["']?)?\]$/);
    if (attribute) parent.setAttribute(attribute[1], attribute[2] ?? "");
    document.body.append(parent);
    return parent;
}

// Text nodes, caret hits and glyph rectangles exercise the production word-occlusion path instead of stubbing its result.
export function write(words = [], buttons = []) {
    const dom = new JSDOM("<body></body>");
    const local = dom.window.document;
    const target = globalThis.document;
    globalThis.Node = dom.window.Node;
    const entries = words.map((box) => {
        const parent = parentFor(local, box.within);
        parent.checkVisibility = () => box.shown !== false;
        const text = local.createTextNode("word");
        parent.append(text);
        return {text, box: rectangle(box)};
    });
    const controls = buttons.map(({box, shown = true}) => {
        const button = local.createElement("button");
        button.getBoundingClientRect = () => rectangle(box);
        button.checkVisibility = () => shown;
        local.body.append(button);
        return button;
    });
    if (!queries.has(target)) queries.set(target, target.querySelectorAll.bind(target));
    const query = queries.get(target);
    target.querySelectorAll = (selector) => selector === CONTROLS ? controls : query(selector);
    target.caretRangeFromPoint = (x, y) => {
        const entry = entries.find(({box}) => x >= box.left && x <= box.right && y >= box.top && y <= box.bottom);
        if (!entry) return null;
        const offset = Math.min(entry.text.length - 1, Math.floor((x - entry.box.left) / entry.box.width * entry.text.length));
        const range = local.createRange();
        range.setStart(entry.text, offset);
        range.setEnd(entry.text, offset);
        return range;
    };
    target.createRange = () => {
        const range = local.createRange();
        range.getClientRects = () => {
            const entry = entries.find(({text}) => text === range.startContainer);
            if (!entry) return [];
            const width = entry.box.width / entry.text.length;
            return [rectangle({...entry.box, left: entry.box.left + range.startOffset * width, right: entry.box.left + range.endOffset * width})];
        };
        return range;
    };
}
