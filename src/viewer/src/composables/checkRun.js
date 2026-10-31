import {ref} from "vue";
import {api} from "../api/client.js";

export function useCheckRun(check) {
    const asked = ref(false);
    const stopping = ref(false);

    async function run() {
        asked.value = true;
        try {
            await api.act("checks", check().id, "run");
        } finally {
            asked.value = false;
        }
    }

    async function stop() {
        stopping.value = true;
        try {
            await api.act("checks", check().id, "stop");
        } finally {
            stopping.value = false;
        }
    }

    return {asked, run, stopping, stop};
}
