import {reactive, watch} from "vue";
import {remember, remembered} from "./remembered.js";
import {AGENT_VIEW} from "../domain/orchestra.js";

const KEY = "journal.agents.view";
const kept = remembered(KEY, {});

export const agentView = reactive({
    ...AGENT_VIEW,
    ...kept,
    states: {...AGENT_VIEW.states, ...(kept.states || {})},
    kinds: {...AGENT_VIEW.kinds, ...(kept.kinds || {})},
});
watch(agentView, (view) => remember(KEY, view), {deep: true});

export function resetAgentView() {
    Object.assign(agentView, {...AGENT_VIEW, states: {...AGENT_VIEW.states}, kinds: {...AGENT_VIEW.kinds}});
}
