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

const WAITS_FOR = 600;

export function pendingChoice(data, key) {
    const choice = data && data.pending && data.pending[key];
    return choice && Date.now() / 1000 - choice.at < WAITS_FOR ? choice.value : "";
}

export const usageWindows = (data) => (data && data.usage && data.usage.windows) || [];

export const loadedSkills = (data) => (data && data.skills) || [];

const stopped = (a) => (a.data.status === "stopped" ? 1 : 0);

export const leadOf = (agents) =>
    [...agents].filter((a) => !a.data.parent).sort((a, b) => stopped(a) - stopped(b) || (b.data.at || 0) - (a.data.at || 0))[0] || null;

export const runningData = (agent) => (agent && agent.data.status !== "stopped" ? agent.data : null);

const PAST = {pause: "paused", resume: "resumed", stop: "stopped", remove: "removed"};

export function plainRefusal(message, action) {
    return /not online|isn't running|is not running/i.test(message)
        ? `Its agent isn't running, so it can't be ${PAST[action] || "changed"}.`
        : message;
}

export const sessionRow = (rows, session) => rows.find((row) => row.title === session) || null;
