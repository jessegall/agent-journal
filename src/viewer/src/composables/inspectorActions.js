import {computed, ref} from "vue";
import {plainRefusal} from "../domain/agents.js";

// An inspector's actions: one that asks first waits for its answer, the others run at once, and a refusal reads in words.
export function useInspectorActions(actions, run) {
    const asking = ref("");
    const refusal = ref("");
    const actionOf = (key) => actions().find((action) => action.key === key);
    const question = computed(() => (asking.value ? actionOf(asking.value) : null));

    async function perform(key, answer = "") {
        refusal.value = "";
        asking.value = "";
        try {
            await run(key, answer);
        } catch (e) {
            refusal.value = plainRefusal(e.message, key);
        }
    }

    function choose(key) {
        if (actionOf(key).confirm) asking.value = key;
        else perform(key);
    }

    return {asking, refusal, question, actionOf, perform, choose};
}
