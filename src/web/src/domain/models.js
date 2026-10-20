export const MODELS = {
    claude: [
        {key: "haiku", label: "haiku", note: "fast, for mechanical work"},
        {key: "sonnet", label: "sonnet", note: "careful work without invention"},
        {key: "opus", label: "opus", note: "judgement"},
    ],
    codex: [
        {key: "gpt-6.1-sol", label: "gpt-6.1-sol", note: "the workhorse for coding, Codex's default"},
        {key: "gpt-6-astra", label: "gpt-6-astra", note: "frontier, for the most demanding work"},
        {key: "gpt-6-luna", label: "gpt-6-luna", note: "fast and affordable, for easier tasks"},
        {key: "gpt-5.6-sol", label: "gpt-5.6-sol", note: "the older workhorse"},
        {key: "gpt-5.6-terra", label: "gpt-5.6-terra", note: "older and balanced"},
        {key: "gpt-5.6-luna", label: "gpt-5.6-luna", note: "older and fast"},
    ],
};

export const PROVIDER_TITLES = {claude: "Claude Code", codex: "Codex"};
