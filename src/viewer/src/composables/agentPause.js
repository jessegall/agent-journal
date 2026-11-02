import {computed, ref} from "vue";

// pausing and resuming an agent: it shows in the client at once, the server is told after, and a refusal puts it back
export function useAgentPause(agent, run, changed) {
    const failure = ref("");
    const paused = computed(() => Boolean(agent.value) && !agent.value.ended_at && Boolean(agent.value.paused_at));

    async function send(word, undo) {
        failure.value = "";
        const answer = await run(["agent", word, String(agent.value.id)]);
        if (!answer.ok) {
            undo();
            failure.value = answer.error;
        }
        changed();
    }

    function toggle() {
        const before = agent.value.paused_at;
        const row = agent.value;
        row.paused_at = before ? null : new Date().toISOString();
        return send(before ? "resume" : "pause", () => (row.paused_at = before));
    }

    return {failure, paused, toggle};
}
