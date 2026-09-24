import {ref} from "vue";
import {api} from "../api/client.js";
import {route} from "../route.js";
import {usePoll} from "../poll.js";
import {agent} from "../state/store.js";

const EVERY = 2000;

export function useTerminal() {
    const lines = ref([]);
    usePoll(
        `terminal:${route.value.env}`,
        () => (agent.value ? api.terminal(agent.value.n) : Promise.resolve({lines: []})),
        EVERY,
        (got) => (lines.value = got.lines)
    );
    return lines;
}
