import {seconds, updatedAt} from "./row.js";

const PROVIDERS = {claude: "Claude Code", codex: "Codex"};
export const PROVIDER_CHOICES = Object.entries(PROVIDERS).map(([key, label]) => ({key, label}));
const FAMILY = /opus|sonnet|haiku|fable|gpt[-\w.]*/i;

export function providerName(provider, fallback = "agent") {
    return PROVIDERS[provider] || fallback;
}

export function modelFamily(model) {
    const found = String(model || "").match(FAMILY);
    return found ? found[0].toLowerCase() : "";
}

// The windows of the provider's usage the agent's context file reports, each with how much is used.
export const usageWindows = (agent) => (agent && agent.usage) || [];

// Whether the agent's program reports what the viewer would show: its context, its thoughts, its model controls.
export const offers = (agent, capability) => Boolean(agent && (agent.capabilities || []).includes(capability));

export const loadedSkills = (agent) => Object.keys((agent && agent.skills_loaded) || {});

const stopped = (a) => (a.status === "stopped" ? 1 : 0);

// The environment's agent: the live one most lately heard from, else the one most lately seen.
export const leadOf = (agents) => [...agents].sort((a, b) => stopped(a) - stopped(b) || seconds(b.heard_at) - seconds(a.heard_at))[0] || null;

export const runningAgent = (agent) => (agent && agent.status !== "stopped" ? agent : null);

const PAST = {stop: "stopped", remove: "removed"};

export function plainRefusal(message, action) {
    return /not online|isn't running|is not running/i.test(message)
        ? `Its agent isn't running, so it can't be ${PAST[action] || "changed"}.`
        : message;
}

const sessionRow = (rows, session) => rows.find((row) => row.session === session) || null;

// the environment's agent: the live one most lately busy, else the one most lately seen
const environmentAgent = (rows) => {
    const own = [...rows].sort((a, b) => updatedAt(b) - updatedAt(a));
    return own.find((row) => row.status !== "stopped") || own[0] || null;
};

export const agentOf = (rows, session, lent) => sessionRow(rows, session) || (lent ? environmentAgent(rows) : null);
