import {ref} from "vue";
import {useWindow} from "./windowContextKey.js";

// runs a command the window declares and keeps justification it was refused; `after` is called when the command worked, to read what it changed
export function useRunLine(after) {
    const context = useWindow();
    const refusal = ref("");

    async function run(line) {
        const answer = await context.run(line);
        refusal.value = answer.ok ? "" : answer.error;
        if (answer.ok) await after();
        return answer;
    }

    return {refusal, run};
}
