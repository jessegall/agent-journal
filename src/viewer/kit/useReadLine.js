import {ref} from "vue";
import {useWindow} from "./windowContextKey.js";

// what one read line answers: its value, kept when a later read fails, and justification it failed; the line is made from what load is called with
export function useReadLine(line, readOptions = {}) {
    const context = useWindow();
    const value = ref(null);
    const failure = ref("");

    async function load(...args) {
        const answer = await context.read(line(...args), readOptions);
        failure.value = answer.ok ? "" : answer.error;
        if (answer.ok) value.value = answer.value;
    }

    return {value, failure, load};
}
