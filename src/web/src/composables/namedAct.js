import {ref} from "vue";

// An action run under its name, so the button that started it shows busy, with its failure in words when it fails.
export function useNamedAct(failure = ref("")) {
    const busy = ref("");

    async function act(name, work) {
        busy.value = name;
        failure.value = "";
        try {
            await work();
        } catch (error) {
            failure.value = error.message;
        } finally {
            busy.value = "";
        }
    }

    return {busy, failure, act};
}
