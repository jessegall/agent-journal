import {onMounted, onUnmounted, watch} from "vue";

const WIDE_BLOCKS = "img,pre,table";
const NARROWEST_SHARE = 0.5;
const NARROWING_STEPS = 6;

// how wide a bubble needs to be: its longest line and its padding, none when nothing was measured
function fittedWidth(lines, padding) {
    if (!lines.length) return 0;
    return Math.ceil(Math.max(...lines.map((line) => line.right)) - Math.min(...lines.map((line) => line.left)) + padding);
}

// the boxes of the bubble's words alone: a range over the whole bubble would also give each paragraph's full-width box
function textLines(bubble) {
    const lines = [];
    const words = document.createTreeWalker(bubble, NodeFilter.SHOW_TEXT);
    const range = document.createRange();
    while (words.nextNode()) {
        if (words.currentNode.parentElement.closest(".message-quote")) continue;
        range.selectNodeContents(words.currentNode);
        lines.push(...range.getClientRects());
    }
    return lines;
}

// a bubble not laid out yet, in a hidden tab, is measured when the watcher sees its chat take a width
function fit(bubble) {
    bubble.style.width = "";
    if (!bubble.offsetWidth) return;
    if (bubble.querySelector(WIDE_BLOCKS)) return;
    const style = getComputedStyle(bubble);
    const padding = parseFloat(style.paddingLeft) + parseFloat(style.paddingRight) + parseFloat(style.borderLeftWidth) + parseFloat(style.borderRightWidth);
    const height = bubble.offsetHeight;
    const width = fittedWidth(textLines(bubble), padding || 0);
    if (!width) return;
    if (width < bubble.offsetWidth) setWidthKeepingLines(bubble, width, height, "");
    narrow(bubble, padding || 0, height);
}

// a width that adds a line, as a rounded one can, gives way to the width it replaces: text that fits one line stays on one
function setWidthKeepingLines(bubble, width, height, fallback) {
    bubble.style.width = `${width}px`;
    if (bubble.offsetHeight !== height) bubble.style.width = fallback;
}

// the narrowest width that keeps the bubble's number of lines, found by halving, so wrapped text stands compact and its lines end close together
function narrow(bubble, padding, height) {
    let fits = bubble.offsetWidth;
    let tooNarrow = fits * NARROWEST_SHARE;
    for (let step = 0; step < NARROWING_STEPS; step++) {
        const middle = (fits + tooNarrow) / 2;
        bubble.style.width = `${middle}px`;
        if (bubble.offsetHeight === height) fits = middle;
        else tooNarrow = middle;
    }
    bubble.style.width = `${fits}px`;
    const width = fittedWidth(textLines(bubble), padding);
    if (width && width < fits) setWidthKeepingLines(bubble, width, height, `${fits}px`);
}

// a bubble as wide as its longest line, measured again when its text or the width of the chat changes
export function useFittedBubble(bubble, text) {
    let watcher = null;
    const refit = () => bubble.value && fit(bubble.value);
    onMounted(() => {
        refit();
        document.fonts?.ready.then(refit);
        if (typeof ResizeObserver === "undefined" || !bubble.value?.parentElement) return;
        let width = 0;
        watcher = new ResizeObserver(([entry]) => {
            if (entry.contentRect.width === width) return;
            width = entry.contentRect.width;
            refit();
        });
        watcher.observe(bubble.value.parentElement);
    });
    onUnmounted(() => watcher?.disconnect());
    watch(text, refit, {flush: "post"});
}
