import {ref} from "vue";

export function usePressing({failed = (error) => error.message} = {}) {
    const pressing = ref("");
    const failure = ref("");

    async function run(label, work) {
        if (pressing.value) return false;
        pressing.value = label;
        failure.value = "";
        try {
            await work();
            return true;
        } catch (error) {
            failure.value = failed(error) || "";
            return false;
        } finally {
            pressing.value = "";
        }
    }

    return {pressing, failure, run};
}
