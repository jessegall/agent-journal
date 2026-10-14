import {ref} from "vue";

export function useAnchoredAction() {
    const anchor = ref(null);
    const error = ref("");
    const busy = ref(false);

    function toggle(e) {
        error.value = "";
        anchor.value = anchor.value ? null : e.currentTarget;
    }

    async function run(call) {
        busy.value = true;
        error.value = "";
        try {
            await call();
            anchor.value = null;
            return true;
        } catch (e) {
            error.value = e.message;
            return false;
        } finally {
            busy.value = false;
        }
    }

    return {anchor, error, busy, toggle, run};
}
