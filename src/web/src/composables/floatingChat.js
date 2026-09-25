import {computed} from "vue";
import {useDetached} from "./detached.js";

const CHAT_BOX = {w: 420, h: 560, top: 96, edge: 24};
const FAMILY_BOX = {w: 760, h: 520, top: 72, edge: 24};

export function useFloatingView(view, box) {
    const {floats, detach, close} = useDetached();
    const floating = computed(() => floats.value.find((f) => f.view === view));

    function toggle() {
        if (floating.value) return close(floating.value.id);
        const w = Math.min(box.w, window.innerWidth - 2 * box.edge);
        detach(view, {x: window.innerWidth - w - box.edge, y: box.top, w, h: box.h});
    }

    const show = () => floating.value || toggle();

    return {floating, toggle, show};
}

export function useFloatingChat() {
    const {floating, toggle, show} = useFloatingView("chat", CHAT_BOX);
    return {floatingChat: floating, toggleChat: toggle, openChat: show};
}

export const useFloatingFamily = () => useFloatingView("family", FAMILY_BOX);
