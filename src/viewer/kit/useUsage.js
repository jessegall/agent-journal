import {ref} from "vue";
import {useWindow} from "./windowContextKey.js";

const asked = new Map();

// the one read of `usage show`: whoever asks while a read of that environment is on its way gets that answer
export function usageRead(environment, read) {
    if (asked.has(environment)) return asked.get(environment);
    const answer = read().finally(() => asked.delete(environment));
    asked.set(environment, answer);
    return answer;
}

// what `usage show` answers to a window: its value, kept when a later read fails, and justification it failed
export function useUsage() {
    const context = useWindow();
    const value = ref(null);
    const failure = ref("");

    async function load() {
        const answer = await usageRead(context.environment, () => context.read("usage show"));
        failure.value = answer.ok ? "" : answer.error;
        if (answer.ok) value.value = answer.value;
    }

    return {value, failure, load};
}
