import {ref} from "vue";
import {api} from "../api/client.js";

export function useCheckRun(check) {
    const asked = ref(false);

    async function run() {
        asked.value = true;
        try {
            await api.runCheck(check().n);
        } finally {
            asked.value = false;
        }
    }

    return {asked, run};
}
