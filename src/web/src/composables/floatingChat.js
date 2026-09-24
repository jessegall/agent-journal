import {computed} from "vue";
import {useDetached} from "./detached.js";

const CHAT_BOX = {w: 420, h: 560, top: 96, edge: 24};

export function useFloatingChat() {
    const {floats, detach, close} = useDetached();
    const floatingChat = computed(() => floats.value.find((f) => f.view === "chat"));

    function toggleChat() {
        if (floatingChat.value) return close(floatingChat.value.id);
        detach("chat", {x: window.innerWidth - CHAT_BOX.w - CHAT_BOX.edge, y: CHAT_BOX.top, w: CHAT_BOX.w, h: CHAT_BOX.h});
    }

    return {floatingChat, toggleChat};
}
