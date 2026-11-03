const PROVIDERS = {claude: "Claude Code", codex: "Codex"};
export const PROVIDER_CHOICES = Object.entries(PROVIDERS).map(([key, label]) => ({key, label}));
export function providerName(provider, fallback = "agent") {
    return PROVIDERS[provider] || fallback;
}
