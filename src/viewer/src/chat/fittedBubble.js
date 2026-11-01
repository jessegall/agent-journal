import {onMounted, onUnmounted, watch} from "vue";

// how wide a bubble needs to be: its longest line and its padding, none when nothing was measured
export function fittedWidth(lines, padding) {
    if (!lines.length) return 0;
    return Math.ceil(Math.max(...lines.map((line) => line.right)) - Math.min(...lines.map((line) => line.left)) + padding);
}

// a bubble not laid out yet, in a hidden tab, is measured when the watcher sees its chat take a width
function fit(bubble) {
    bubble.style.width = "";
    if (!bubble.offsetWidth) return;
    const range = document.createRange();
    range.selectNodeContents(bubble);
    const style = getComputedStyle(bubble);
    const padding = parseFloat(style.paddingLeft) + parseFloat(style.paddingRight) + parseFloat(style.borderLeftWidth) + parseFloat(style.borderRightWidth);
    const width = fittedWidth([...range.getClientRects()], padding || 0);
    if (width && width < bubble.offsetWidth) bubble.style.width = `${width}px`;
}

// a bubble as wide as its longest line, measured again when its text or the width of the chat changes
export function useFittedBubble(bubble, text) {
    let watcher = null;
    const refit = () => bubble.value && fit(bubble.value);
    onMounted(() => {
        refit();
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
