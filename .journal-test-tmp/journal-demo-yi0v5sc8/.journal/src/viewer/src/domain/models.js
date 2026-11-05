export const MODELS = {
    claude: [
        {key: "haiku", label: "haiku", note: "fast, for mechanical work"},
        {key: "sonnet", label: "sonnet", note: "careful work without invention"},
        {key: "opus", label: "opus", note: "judgement"},
        {key: "fable", label: "fable", note: "the most demanding work, for rare occasions"},
    ],
    codex: [
        {key: "gpt-6-luna", label: "gpt-6-luna", note: "fast, for mechanical work"},
        {key: "gpt-6.1-terra", label: "gpt-6.1-terra", note: "careful work without invention"},
        {key: "gpt-6.1-sol", label: "gpt-6.1-sol", note: "judgement"},
        {key: "gpt-6-astra", label: "gpt-6-astra", note: "the most demanding work, for rare occasions"},
    ],
};

export const PROVIDER_TITLES = {claude: "Claude Code", codex: "Codex"};
