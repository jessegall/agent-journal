import {agent} from "./leadAgent.js";
import {ref} from "vue";
import {api} from "../api/client.js";
import {pollKey, usePoll} from "./poll.js";

const EVERY = 2000;

export function useTerminal(level, shown = () => agent.value, client = api) {
    const lines = ref([]);
    usePoll(
        pollKey(),
        () => (shown() ? client.terminal(shown().n, level) : Promise.resolve({lines: []})),
        EVERY,
        (got) => (lines.value = got.lines)
    );
    return lines;
}
