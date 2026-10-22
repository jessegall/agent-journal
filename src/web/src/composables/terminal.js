import {agent} from "./leadAgent.js";
import {ref} from "vue";
import {api} from "../api/client.js";
import {pollKey, usePoll} from "./poll.js";

const EVERY = 2000;
const MARKS = {Bash: "$", Journal: "#"};
const KEPT = 200;

export const commandMark = (tool) => MARKS[tool] || "›";

export function useTerminal(agentOf = () => agent.value, client = api) {
    const lines = ref([]);
    let showing = 0;

    function ask() {
        const id = agentOf() ? agentOf().id : 0;
        if (id !== showing) {
            showing = id;
            lines.value = [];
        }
        const after = lines.value.length ? lines.value[lines.value.length - 1].time : 0;
        return id ? client.terminal(id, after).then((got) => ({id, lines: got})) : Promise.resolve({id, lines: []});
    }

    function take(got) {
        if (got.id !== showing || !got.lines.length) return;
        lines.value = [...lines.value, ...got.lines].slice(-KEPT);
    }

    usePoll(pollKey(), ask, EVERY, take);
    return lines;
}
