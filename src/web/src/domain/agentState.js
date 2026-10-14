// The bar state the figure reads: stopped, compacting, paused, waiting, idle or working, from the agent's status as the store shapes it.
const HELD = new Set(["stopped", "compacting", "paused", "waiting", "idle"]);

export function stateOf(agent) {
    if (!agent) return "stopped";
    return HELD.has(agent.data.status) ? agent.data.status : "working";
}
