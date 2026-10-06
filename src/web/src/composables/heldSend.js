import {computed, onMounted, onUnmounted, ref} from "vue";

const HOLD_SECONDS = 3;

export function useHeldSend({seconds = () => HOLD_SECONDS, send, sendOnUnmount = false, sendWhenHidden = false}) {
    const left = ref(0);
    const value = ref(null);
    const holding = computed(() => value.value !== null);
    const length = computed(() => Number(seconds() ?? HOLD_SECONDS));
    let timer = 0;

    function undo() {
        clearInterval(timer);
        value.value = null;
        left.value = 0;
    }

    function sendNow() {
        if (!holding.value) return;
        const held = value.value;
        undo();
        return send(held);
    }

    function start(held) {
        undo();
        value.value = held;
        left.value = length.value;
        timer = setInterval(() => (left.value -= 1) <= 0 && sendNow(), 1000);
    }

    const hidden = () => document.hidden && sendNow();
    if (sendWhenHidden) {
        onMounted(() => {
            window.addEventListener("pagehide", sendNow);
            document.addEventListener("visibilitychange", hidden);
        });
        onUnmounted(() => {
            window.removeEventListener("pagehide", sendNow);
            document.removeEventListener("visibilitychange", hidden);
        });
    }
    onUnmounted(() => (sendOnUnmount ? sendNow() : undo()));

    return {left, value, holding, length, start, undo, sendNow};
}
