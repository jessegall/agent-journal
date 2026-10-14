import {AGENT_VIEW} from "../domain/orchestra.js";
import {ui} from "../state/ui.js";

export function resetAgentView() {
    Object.assign(ui.agentView, {...AGENT_VIEW, states: {...AGENT_VIEW.states}, kinds: {...AGENT_VIEW.kinds}});
}
