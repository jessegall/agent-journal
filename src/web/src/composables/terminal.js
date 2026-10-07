import {agent} from "./leadAgent.js";
import {ref} from "vue";
import {api} from "../api/client.js";
import {pollKey, usePoll} from "./poll.js";

const EVERY = 2000;
const MARKS = {Bash: "$", Journal: "#"};
const KEPT = 200;

export const commandMark = (tool) => MARKS[tool] || "›";

export function useTerminal(level, agentOf = () => agent.value, client = api) {
    const lines = ref([]);
    let showing = 0;

    function ask() {
        const n = agentOf() ? agentOf().n : 0;
        if (n !== showing) {
            showing = n;
            lines.value = [];
        }
        const after = lines.value.length ? lines.value[lines.value.length - 1].at : 0;
        return n ? client.terminal(n, level, after).then((got) => ({n, lines: got.lines})) : Promise.resolve({n, lines: []});
    }

    function take(got) {
        if (got.n !== showing || !got.lines.length) return;
        lines.value = [...lines.value, ...got.lines].slice(-KEPT);
    }

    usePoll(pollKey(), ask, EVERY, take);
    return lines;
}
