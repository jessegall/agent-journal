import {onUnmounted, ref} from "vue";

export function useNow(every = 1000) {
    const now = ref(Date.now() / 1000);
    const timer = setInterval(() => (now.value = Date.now() / 1000), every);
    onUnmounted(() => clearInterval(timer));
    return now;
}
