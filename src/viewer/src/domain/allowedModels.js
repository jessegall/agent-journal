// The models of each provider from the cheapest to the strongest, which the models each role may run on are chosen from.
export const RANKING = {
    claude: ["haiku", "sonnet", "opus"],
    codex: ["gpt-6-luna", "gpt-5.6-luna", "gpt-5.6-terra", "gpt-5.6-sol", "gpt-6.1-sol", "gpt-6-astra"],
};
export const FALLBACK_ROLE = "journal-medior";
export const FIXED_ROLES = ["reviewer", "verifier"];

// "claude journal-medior: sonnet, opus" as {"claude journal-medior": ["sonnet", "opus"]}
export function parseAllowed(lines) {
    const parsed = {};
    for (const line of lines || []) {
        const [head, models = ""] = line.split(":");
        parsed[head.trim()] = models
            .split(",")
            .map((model) => model.trim())
            .filter(Boolean);
    }
    return parsed;
}

export const allowedFor = (parsed, provider, role) => parsed[`${provider} ${role}`] || parsed[`${provider} ${FALLBACK_ROLE}`] || RANKING[provider];

// the lines to save once a model is ticked or unticked for a role; the last one ticked cannot be unticked
export function toggled(parsed, provider, role, model) {
    const now = allowedFor(parsed, provider, role);
    const next = now.includes(model) ? now.filter((one) => one !== model) : [...now, model];
    if (!next.length) return null;
    const ordered = RANKING[provider].filter((one) => next.includes(one));
    const lines = {...parsed, [`${provider} ${role}`]: ordered};
    return Object.entries(lines).map(([head, models]) => `${head}: ${models.join(", ")}`);
}
