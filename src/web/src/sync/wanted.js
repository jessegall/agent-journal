import {onUnmounted, reactive, watch} from "vue";
import {pollNow} from "../composables/poll.js";

export const wanted = reactive({});

export function useWanted(key, when = () => true) {
    let on = false;
    const set = (now) => {
        if (now === on) return;
        on = now;
        wanted[key] = (wanted[key] || 0) + (now ? 1 : -1);
        if (now) pollNow(key);
    };
    watch(when, set, {immediate: true});
    onUnmounted(() => set(false));
}
