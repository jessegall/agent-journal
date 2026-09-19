const PROVIDERS = {claude: "Claude Code", codex: "Codex"};
const FAMILY = /opus|sonnet|haiku|fable|gpt[-\w.]*/i;

export function providerName(provider, fallback = "agent") {
    return PROVIDERS[provider] || fallback;
}

export function modelFamily(model) {
    const found = String(model || "").match(FAMILY);
    return found ? found[0].toLowerCase() : "";
}
