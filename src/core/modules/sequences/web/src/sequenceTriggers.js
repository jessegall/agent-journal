// what starts a sequence on its own, each type with the fields it is written with and a plain sentence for it
export const TRIGGER_TYPES = [
    {value: "row", label: "A record is made", fields: [{name: "event", label: "Record and event", placeholder: "plan.create"}]},
    {value: "phrase", label: "You ask for it", fields: [{name: "text", label: "Words you write", placeholder: "an update please"}]},
    {value: "command", label: "A command runs", fields: [{name: "pattern", label: "Pattern on the command line", placeholder: "^git push"}]},
    {value: "file", label: "A file is edited", fields: [{name: "pattern", label: "Files, as a path glob", placeholder: "src/*.py"}]},
    {value: "file-text", label: "An edit adds text", fields: [{name: "pattern", label: "Files, as a path glob", placeholder: "src/*.py"}, {name: "text", label: "Text in the new content", placeholder: "TODO"}]},
    {value: "tool", label: "A tool is used", fields: [{name: "tool", label: "Tool name", placeholder: "Edit"}, {name: "pattern", label: "Pattern on its input, if any", placeholder: "migrations/"}]},
];

export const typeOf = (value) => TRIGGER_TYPES.find((type) => type.value === value) ?? TRIGGER_TYPES[0];

const WORDS = {
    row: (trigger) => `When ${trigger.event} happens`,
    phrase: (trigger) => `When you ask “${trigger.text}”`,
    command: (trigger) => `When a command matching “${trigger.pattern}” runs`,
    file: (trigger) => `When a file matching “${trigger.pattern}” is edited`,
    "file-text": (trigger) => `When an edit to “${trigger.pattern}” adds “${trigger.text}”`,
    tool: (trigger) => `When ${trigger.tool} is used${trigger.pattern ? ` with “${trigger.pattern}” in its input` : ""}`,
};

const triggerWords = (trigger) => WORDS[trigger.trigger_type](trigger);

export const startWords = (triggers) => (triggers.length ? triggers.map(triggerWords) : ["Only when you or the agent start it"]);

export const blankTrigger = () => ({trigger_type: "phrase", event: "", text: "", pattern: "", tool: ""});

// a trigger as the server takes it: only the fields its type reads, trimmed
export function triggerBody(trigger) {
    const named = typeOf(trigger.trigger_type).fields.map((field) => [field.name, (trigger[field.name] || "").trim()]);
    return {trigger_type: trigger.trigger_type, ...Object.fromEntries(named.filter(([, value]) => value))};
}

const OPTIONAL = {tool: ["pattern"]};

export function triggersProblem(triggers) {
    const lacking = triggers.find((trigger) => typeOf(trigger.trigger_type).fields.some((field) => !(OPTIONAL[trigger.trigger_type] ?? []).includes(field.name) && !(trigger[field.name] || "").trim()));
    return lacking ? `${typeOf(lacking.trigger_type).label}: complete every field.` : "";
}
