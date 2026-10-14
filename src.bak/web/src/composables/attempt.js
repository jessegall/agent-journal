import {ref} from "vue";

export function useAttempt() {
    const busy = ref(false);
    const failure = ref("");

    async function attempt(work) {
        busy.value = true;
        failure.value = "";
        try {
            return {done: true, got: await work()};
        } catch (error) {
            failure.value = error.message;
            return {done: false, got: null};
        } finally {
            busy.value = false;
        }
    }

    return {busy, failure, attempt};
}
