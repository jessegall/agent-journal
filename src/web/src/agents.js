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
