import {computed, ref} from "vue";
import {api} from "../../api/client.js";
import {leadOf, runningData} from "../../domain/agents.js";
import {pollKey, usePoll} from "../../composables/poll.js";

const EVERY = 3000;
const LISTED = 10;

export function useLeadAgent() {
    const agent = ref(null);
    const loaded = ref(false);
    const refresh = usePoll(pollKey(), () => api.agents(LISTED), EVERY, (rows) => {
        agent.value = leadOf(rows);
        loaded.value = true;
    });
    return {agent, data: computed(() => runningData(agent.value)), loaded, refresh};
}
