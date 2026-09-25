import {ref} from "vue";
import {api} from "../api/client.js";
import {route} from "../route.js";
import {usePoll} from "../poll.js";
import {agent} from "../state/store.js";

const EVERY = 2000;

export function useTerminal(level, shown = () => agent.value, client = api) {
    const lines = ref([]);
    usePoll(
        `terminal:${client.env() || route.value.env}:${level}`,
        () => (shown() ? client.terminal(shown().n, level) : Promise.resolve({lines: []})),
        EVERY,
        (got) => (lines.value = got.lines)
    );
    return lines;
}
