import {onUnmounted} from "vue";

const anchors = new WeakMap();

export const anchorTo = (panel, anchor) => anchors.set(panel, anchor);

export function within(node, target) {
    for (let at = target; at; at = anchors.get(at) ?? at.parentElement) if (at === node) return true;
    return false;
}

export function useOutside(el, close) {
    const away = (e) => {
        const node = el.value?.element || el.value?.$el || el.value;
        if (node && !within(node, e.target)) close(e);
    };
    window.addEventListener("click", away);
    onUnmounted(() => window.removeEventListener("click", away));
}
