import {computed, onMounted, ref, watch} from "vue";

// what the agent bar does to the agent: each change shows in the client at once, the server is told after it, and a refusal undoes it
export function useAgentControls(agent, run, changed) {
    const groups = ref([]);
    const programs = ref([]);
    const chosen = ref({});
    const failure = ref("");
    const asking = ref(false);
    const running = computed(() => Boolean(agent.value) && !agent.value.ended_at);
    const paused = computed(() => running.value && Boolean(agent.value.paused_at));

    async function read() {
        if (running.value) {
            const answer = await run(["agent", "controls", String(agent.value.id)]);
            groups.value = answer.ok ? answer.value.groups : [];
            return;
        }
        const answer = await run(["agent", "programs"]);
        programs.value = answer.ok ? answer.value.rows : [];
    }

    async function send(line, undo = () => {}) {
        failure.value = "";
        const answer = await run(line);
        if (!answer.ok) {
            undo();
            failure.value = answer.error;
        }
        changed();
    }

    const choose = (key, choice) => {
        const before = chosen.value[key];
        chosen.value = {...chosen.value, [key]: choice.label};
        return send(["agent", "control", String(agent.value.id), key, choice.value], () => (chosen.value = {...chosen.value, [key]: before}));
    };

    const stop = () => {
        asking.value = false;
        agent.value.ended_at = new Date().toISOString();
        return send(["agent", "stop", String(agent.value.id)], () => (agent.value.ended_at = null));
    };

    const start = (program) => send(["agent", "launch", program.name]);

    onMounted(read);
    watch(running, read);
    return {groups, programs, chosen, failure, asking, running, paused, choose, stop, start};
}
