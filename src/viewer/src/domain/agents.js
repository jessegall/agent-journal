import {updatedAt} from "./row.js";

const PROVIDERS = {claude: "Claude Code", codex: "Codex"};
export const PROVIDER_CHOICES = Object.entries(PROVIDERS).map(([key, label]) => ({key, label}));
export function providerName(provider, fallback = "agent") {
    return PROVIDERS[provider] || fallback;
}

// Whether the agent's program reports what the viewer would show: its context, its thoughts, its model controls.
export const offers = (agent, capability) => Boolean(agent && (agent.capabilities || []).includes(capability));

const sessionRow = (rows, session) => rows.find((row) => row.session === session) || null;

// the environment's agent: the live one most lately busy, else the one most lately seen
const environmentAgent = (rows) => {
    const own = [...rows].sort((a, b) => updatedAt(b) - updatedAt(a));
    return own.find((row) => row.status !== "stopped") || own[0] || null;
};

export const agentOf = (rows, session, lent) => sessionRow(rows, session) || (lent ? environmentAgent(rows) : null);
