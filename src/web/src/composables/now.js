import {onUnmounted, ref, watch} from "vue";

export function useNow(every = 1000, active = null) {
    const now = ref(Date.now() / 1000);
    let timer = 0;
    const tick = (on) => {
        clearInterval(timer);
        timer = on ? setInterval(() => (now.value = Date.now() / 1000), every) : 0;
    };
    if (active) watch(active, tick, {immediate: true});
    else tick(true);
    onUnmounted(() => clearInterval(timer));
    return now;
}
