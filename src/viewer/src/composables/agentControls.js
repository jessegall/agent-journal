import {computed, ref} from "vue";
import {runChanged} from "../../kit/runChanged.js";

// what the agent bar does to the agent: each change shows in the client at once, the server is told after it, and a refusal undoes it
export function useAgentControls(agent, run, changed, {groups, programs}) {
    const chosen = ref({});
    const failure = ref("");
    const asking = ref(false);
    const running = computed(() => Boolean(agent.value) && !agent.value.ended_at);
    const paused = computed(() => running.value && Boolean(agent.value.paused_at));

    async function send(line, change = null) {
        failure.value = "";
        const answer = await runChanged(change, line, run);
        failure.value = answer.ok ? "" : answer.error;
        changed();
        return answer;
    }

    const choose = (key, choice) => {
        return send(["agent", "control", String(agent.value.id), key, choice.value], {target: chosen, fields: {value: {...chosen.value, [key]: choice.label}}});
    };

    const stop = () => {
        asking.value = false;
        return send(["agent", "stop", String(agent.value.id)], {target: agent.value, fields: {ended_at: new Date().toISOString()}});
    };

    const start = (program) => send(["agent", "launch", program.name]);

    return {groups, programs, chosen, failure, asking, running, paused, choose, stop, start};
}
