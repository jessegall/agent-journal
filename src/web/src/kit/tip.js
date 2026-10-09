import {nextTick, reactive} from "vue";

export const TIP_ID = "kit-tooltip";
export const HIDE_AFTER = 100;
export const LEAVE_FOR = 80;
export const HOLD_FOR = 450;
export const TOUCH_STAYS = 1500;

const OBVIOUS = /^(close|dismiss|remove|delete|hide|clear|cancel|more|menu|pane menu)\b[^,.;]*$/i;

const GAP = 9;
const EDGE = 8;
const CORNER = 10;
const NO_WORDS = {title: "", line: "", keys: ""};

const known = new Map();
const layer = {el: null};
let hideTimer = 0;
let touchTimer = 0;
let touched = false;
let hushed = null;
let pointed = null;
let pointer = null;
let spare = 0;

export const shown = reactive({key: null, words: NO_WORDS, side: "below", arrow: 0, x: 0, y: 0, leaving: false, entering: false, sliding: false, prefer: "below"});

export const obvious = (el, words) => !words.line && !words.keys && !/[\p{L}\p{N}]/u.test(el.textContent) && OBVIOUS.test(words.title);

export const wordsOf = (value) => (value ? {...NO_WORDS, ...(typeof value === "string" ? {title: value} : value)} : null);

export function place(target, size, bounds, prefer) {
    const noRoomBelow = target.bottom + GAP + size.height > bounds.bottom - EDGE;
    const noRoomAbove = target.top - GAP - size.height < bounds.top + EDGE;
    const side = (prefer === "below" ? noRoomBelow : !noRoomAbove) ? "above" : "below";
    const centre = target.left + target.width / 2;
    const x = Math.min(Math.max(centre - size.width / 2, bounds.left + EDGE), bounds.right - EDGE - size.width);
    const y = side === "below" ? target.bottom + GAP : target.top - GAP - size.height;
    return {x, y, side, arrow: Math.min(Math.max(centre - x, CORNER), size.width - CORNER)};
}

function measure() {
    const el = known.get(shown.key)?.el;
    if (!el?.isConnected || !layer.el) return hide(true);
    const spot = place(
        el.getBoundingClientRect(),
        {width: layer.el.offsetWidth, height: layer.el.offsetHeight},
        {top: 0, left: 0, right: window.innerWidth, bottom: window.innerHeight},
        shown.prefer
    );
    Object.assign(shown, spot);
    el.setAttribute("aria-describedby", TIP_ID);
}

export function show(key, prefer = "below") {
    clearTimeout(hideTimer);
    if (hushed === key) return;
    hushed = null;
    const target = known.get(key);
    if (!target) return;
    if (target.cut && target.el.scrollWidth <= target.el.clientWidth) return hide();
    const open = shown.key !== null && !shown.leaving;
    Object.assign(shown, {key, words: target.words, prefer, leaving: false, entering: !open, sliding: open && shown.key !== key});
    nextTick(measure);
}

function keep() {
    clearTimeout(hideTimer);
    shown.leaving = false;
}

export function hide(now = false) {
    clearTimeout(hideTimer);
    if (shown.key === null) return;
    if (!now) {
        shown.leaving = true;
        hideTimer = setTimeout(() => hide(true), LEAVE_FOR);
        return;
    }
    known.get(shown.key)?.el.removeAttribute("aria-describedby");
    Object.assign(shown, {key: null, leaving: false, entering: false, sliding: false});
}

function later() {
    clearTimeout(hideTimer);
    hideTimer = setTimeout(() => hide(), HIDE_AFTER);
}

const targetKey = (event) => (event.target instanceof Element ? event.target.closest("[data-tip-key]")?.dataset.tipKey : undefined);
const onBubble = (event) => event.target instanceof Element && layer.el?.contains(event.target);

function isKeyboardFocus(el) {
    try {
        return el.matches(":focus-visible");
    } catch {
        return true;
    }
}

export function setLayer(el) {
    layer.el = el;
}

export function listen(doc = document) {
    const on = (type, handler, options) => {
        doc.addEventListener(type, handler, options);
        return () => doc.removeEventListener(type, handler, options);
    };
    const stops = [
        on("pointerover", (e) => {
            if (e.pointerType === "touch") return;
            const key = targetKey(e);
            pointed = key ?? null;
            pointer = {x: e.clientX, y: e.clientY};
            if (key) return show(key);
            if (onBubble(e)) return keep();
            if (shown.key !== null) later();
        }),
        on("focusin", (e) => {
            const key = targetKey(e);
            if (key && isKeyboardFocus(e.target)) show(key);
        }),
        on("focusout", (e) => {
            const key = targetKey(e);
            if (!key) return;
            hushed = null;
            if (key !== pointed) later();
        }),
        on("keydown", (e) => {
            if (e.key !== "Escape" || shown.key === null) return;
            hushed = shown.key;
            hide(true);
        }),
        on("scroll", (e) => (!(e.target instanceof Node) || e.target.contains(known.get(shown.key)?.el)) && hide(true), true),
        on("click", (e) => {
            if (touched) {
                touched = false;
                e.preventDefault();
                e.stopPropagation();
                return;
            }
            if (e.target instanceof Element && e.target.closest("[data-tip-key][aria-expanded]")) hide(true);
        }, true),
        on("pointerdown", (e) => {
            const key = targetKey(e);
            if (e.pointerType !== "touch" || !key) return;
            touched = false;
            touchTimer = setTimeout(() => {
                touched = true;
                show(key, "above");
            }, HOLD_FOR);
        }),
        on("pointerup", (e) => {
            if (e.pointerType !== "touch") return;
            clearTimeout(touchTimer);
            if (touched) hideTimer = setTimeout(() => hide(), TOUCH_STAYS);
        }),
        on("pointercancel", () => clearTimeout(touchTimer)),
        on("contextmenu", (e) => touched && e.preventDefault()),
    ];
    const resize = () => hide(true);
    window.addEventListener("resize", resize);
    return () => {
        stops.forEach((stop) => stop());
        window.removeEventListener("resize", resize);
        clearTimeout(hideTimer);
        clearTimeout(touchTimer);
    };
}

function enlist(el, binding) {
    const words = wordsOf(binding.value);
    const key = el.dataset.tipKey || binding.arg || `tip-${(spare += 1)}`;
    if (!words) return delist(el);
    if (obvious(el, words)) {
        if (!el.hasAttribute("aria-label")) el.setAttribute("aria-label", words.title);
        return delist(el);
    }
    el.dataset.tipKey = key;
    known.set(key, {el, words, cut: binding.modifiers.cut});
    if (key === shown.key) nextTick(measure);
    if (!el.textContent.trim() && !el.hasAttribute("aria-label")) el.setAttribute("aria-label", words.title);
    return key;
}

function delist(el) {
    const key = el.dataset.tipKey;
    if (!key) return;
    delete el.dataset.tipKey;
    if (known.get(key)?.el === el) known.delete(key);
    if (shown.key === key) nextTick(() => known.has(key) || hide(true));
}

function underPointer(el) {
    return pointer !== null && el.contains(document.elementFromPoint(pointer.x, pointer.y));
}

export const tip = {
    mounted(el, binding) {
        const key = enlist(el, binding);
        if (key && underPointer(el)) show(key);
    },
    updated(el, binding) {
        const key = enlist(el, binding);
        if (key !== shown.key) return;
        shown.words = known.get(key).words;
        nextTick(measure);
    },
    unmounted: delist,
};
