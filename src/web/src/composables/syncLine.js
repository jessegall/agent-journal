import {ref} from "vue";
import {api} from "../api/client.js";
import {pollKey, usePoll} from "./poll.js";

const EVERY_MS = 5000;

// the status bar's line for a shared journal's sync with its team, empty in a journal in no team
export function useSyncLine() {
    const line = ref("");
    usePoll(
        pollKey(),
        () => api.syncLine(),
        EVERY_MS,
        (got) => {
            line.value = got.line || "";
        }
    );
    return line;
}
