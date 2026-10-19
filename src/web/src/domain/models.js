export const MODELS = {
    claude: [
        {key: "haiku", label: "haiku", note: "fast, for mechanical work"},
        {key: "sonnet", label: "sonnet", note: "careful work without invention"},
        {key: "opus", label: "opus", note: "judgement"},
    ],
    codex: [
        {key: "gpt-6-sol", label: "gpt-6-sol", note: "Codex's default"},
        {key: "gpt-6", label: "gpt-6", note: "the general model"},
        {key: "gpt-5.5", label: "gpt-5.5", note: "the earlier model"},
    ],
};

export const PROVIDER_TITLES = {claude: "Claude Code", codex: "Codex"};
