import {agent} from "./leadAgent.js";
import {ref} from "vue";
import {api} from "../api/client.js";
import {usePoll} from "./poll.js";

const MARKS = {Bash: "$", Journal: "#"};
const KEPT = 200;

export const commandMark = (tool) => MARKS[tool] || "›";

export function useTerminal(agentOf = () => agent.value, client = api) {
    const lines = ref([]);
    let showing = 0;

    function params() {
        const id = agentOf() ? agentOf().id : 0;
        if (id !== showing) {
            showing = id;
            lines.value = [];
        }
        return {client, agent: id, after: lines.value.length ? lines.value[lines.value.length - 1].time : 0};
    }

    function take(got) {
        if (!got.length) return;
        lines.value = [...lines.value, ...got].slice(-KEPT);
    }

    usePoll("agent.terminal", {params, take, active: () => Boolean(agentOf())});
    return lines;
}
