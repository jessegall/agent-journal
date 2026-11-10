const NO_MODEL = "Model not reported";

const dollars = (amount) => `$${Number(amount || 0).toFixed(2)}`;

// the cost of the sessions that report one, added up for each value `keyOf` names, the dearest first
function grouped(agents, keyOf) {
    const sums = new Map();
    for (const agent of agents.filter((row) => row.cost_dollars > 0)) sums.set(keyOf(agent), (sums.get(keyOf(agent)) ?? 0) + agent.cost_dollars);
    return [...sums].map(([label, cost]) => ({label, cost})).sort((first, second) => second.cost - first.cost);
}

export const byModel = (agents) => grouped(agents, (agent) => agent.model || NO_MODEL);
export const byAgent = (agents) => grouped(agents, (agent) => `${agent.role} ${agent.number}`);
export const byProfile = (agents) => grouped(agents.filter((agent) => agent.profile), (agent) => agent.profile);
export {dollars};
