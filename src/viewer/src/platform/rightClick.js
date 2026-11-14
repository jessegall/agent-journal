import {placeUnder} from "../../kit/vContext.js";
import {fieldItems, pageItems, selectionItems, short} from "../domain/contextItems.js";
import {onMac} from "./keys.js";

const TEXT_FIELD = "input:not([type=checkbox]):not([type=radio]):not([type=range]):not([type=button]):not([type=submit]), textarea, [contenteditable=true]";
const MENU = ".context-menu";
const LONG_PRESS_MS = 500;
const MOVED_PX = 10;
// a long press on a phone may be followed by the browser's own contextmenu event; that one is the same press
const SAME_PRESS_MS = 800;

const chosenText = () => String(getSelection()).trim();
const onChosenText = (target) => {
    const field = target.closest?.(TEXT_FIELD);
    if (field && field.selectionStart != null) return field.selectionStart !== field.selectionEnd;
    const selection = getSelection();
    return Boolean(chosenText() && selection.rangeCount && selection.getRangeAt(0).intersectsNode(target));
};

// every item runs with the way to tell the person what it did
const withSay = (items, say) => items.map((item) => ({...item, run: item.run && (() => item.run({say})), children: item.children && withSay(item.children, say)}));

// what the menu shows for the element under the pointer: a text field, chosen text, the most particular place a window declares, or the page itself
function menuFor(target, say) {
    const field = target.closest?.(TEXT_FIELD);
    const place = placeUnder(target);
    const found = field
        ? {head: "Text", items: fieldItems(field), el: field}
        : onChosenText(target)
            ? {head: `“${short(chosenText(), 34)}”`, items: selectionItems(chosenText(), place?.quote), el: null}
            : place ?? {head: document.title, items: pageItems(), el: null};
    return {...found, items: withSay(found.items, say)};
}

// The one place the browser's menu is cancelled and the journal's opened. A component that opened a menu of its own cancelled the event first and is left alone.
// show(at, head, items, target, returnTo) opens the menu; say(text) tells the person what an item did.
export function watchRightClicks({show, say, root = window}) {
    let touchOpenedAt = -SAME_PRESS_MS;
    const openAt = (target, at, returnTo = null) => {
        const found = menuFor(target, say);
        show(at, found.head, found.items, found.el, returnTo ?? (document.activeElement !== document.body ? document.activeElement : found.el));
    };

    // the right press and Ctrl+click on a Mac would select a word and move focus before the menu opens; a press on text that is already chosen is let through
    const onPress = (event) => {
        const right = event.button === 2 || (onMac && event.button === 0 && event.ctrlKey);
        if (right && !onChosenText(event.target)) event.preventDefault();
    };

    const onMenu = (event) => {
        const handled = event.defaultPrevented;
        event.preventDefault();
        if (handled || event.target.closest?.(MENU) || performance.now() - touchOpenedAt < SAME_PRESS_MS) return;
        openAt(event.target, {x: event.clientX, y: event.clientY});
    };

    // Shift+F10 or the Menu key: the menu of the focused element, under it
    const onKey = (event) => {
        if (event.defaultPrevented || (event.key !== "ContextMenu" && !(event.shiftKey && event.key === "F10"))) return;
        event.preventDefault();
        const element = document.activeElement ?? document.body;
        const box = element.getBoundingClientRect();
        openAt(element, {x: Math.max(8, box.left + 8), y: Math.min(window.innerHeight - 8, box.bottom + 2)}, element);
    };

    // a long press with a finger opens the same menu
    let held = 0;
    let from = null;
    const endPress = () => clearTimeout(held);
    const onTouch = (event) => {
        if (event.pointerType !== "touch") return;
        from = {x: event.clientX, y: event.clientY};
        clearTimeout(held);
        held = setTimeout(() => {
            touchOpenedAt = performance.now();
            openAt(event.target, from);
        }, LONG_PRESS_MS);
    };
    const onMove = (event) => from && Math.hypot(event.clientX - from.x, event.clientY - from.y) > MOVED_PX && endPress();

    root.addEventListener("mousedown", onPress, true);
    root.addEventListener("contextmenu", onMenu);
    root.addEventListener("keydown", onKey);
    root.addEventListener("pointerdown", onTouch);
    root.addEventListener("pointermove", onMove);
    root.addEventListener("pointerup", endPress);
    root.addEventListener("pointercancel", endPress);
    return () => {
        endPress();
        root.removeEventListener("mousedown", onPress, true);
        root.removeEventListener("contextmenu", onMenu);
        root.removeEventListener("keydown", onKey);
        root.removeEventListener("pointerdown", onTouch);
        root.removeEventListener("pointermove", onMove);
        root.removeEventListener("pointerup", endPress);
        root.removeEventListener("pointercancel", endPress);
    };
}
