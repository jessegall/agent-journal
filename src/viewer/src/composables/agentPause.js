import {computed, ref} from "vue";
import {runChanged} from "../../kit/runChanged.js";

// pausing and resuming an agent: it shows in the client at once, the server is told after, and a refusal puts it back
export function useAgentPause(agent, run, changed) {
    const failure = ref("");
    const paused = computed(() => Boolean(agent.value) && !agent.value.ended_at && Boolean(agent.value.paused_at));

    async function toggle() {
        failure.value = "";
        const row = agent.value;
        const word = row.paused_at ? "resume" : "pause";
        const answer = await runChanged({target: row, fields: {paused_at: row.paused_at ? null : new Date().toISOString()}}, ["agent", word, String(row.id)], run);
        failure.value = answer.ok ? "" : answer.error;
        changed();
        return answer;
    }

    return {failure, paused, toggle};
}
