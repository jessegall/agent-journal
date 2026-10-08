import {getCurrentScope, onScopeDispose, onUnmounted, ref, watch} from "vue";

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

const shared = ref(Date.now() / 1000);
let sharedTimer = 0;
let sharedUsers = 0;

export function useSharedNow() {
    if (!sharedUsers) {
        shared.value = Date.now() / 1000;
        sharedTimer = setInterval(() => (shared.value = Date.now() / 1000), 1000);
    }
    sharedUsers += 1;
    if (getCurrentScope())
        onScopeDispose(() => {
            sharedUsers -= 1;
            if (!sharedUsers) clearInterval(sharedTimer);
        });
    return shared;
}
