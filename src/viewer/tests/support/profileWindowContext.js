import {context, page} from "./windowContext.js";

export const PROGRAMS = [
    {name: "claude", title: "Claude Code", model_option: "--model", models: ["haiku", "sonnet", "opus", "fable"].map((name) => ({name, tier: "general"}))},
    {name: "codex", title: "Codex", model_option: "--codex-model", models: ["gpt-6-luna", "gpt-6.1-terra", "gpt-6.1-sol", "gpt-6-astra"].map((name) => ({name, tier: "general"}))},
];

export const profileWindowContext = (answers) => context({"agent programs": page(PROGRAMS), ...answers}, null, {
    programs: {line: "agent programs"},
    profiles: {line: "profile list"},
    availability: {line: "helper availability", loading: "requested"},
    skills: {line: "profile skills", loading: "requested"},
});
