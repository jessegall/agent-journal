// What a trigger does when its words appear, in the user's words.
export const DOES = [
    {key: "nudge", value: "nudge", label: "Remind the agent", hint: "A short note only the agent sees. It carries on with its work.", ask: "What to remind the agent of", example: "Add the change to src/CHANGELOG.md in plain words."},
    {key: "instruct", value: "instruct", label: "Tell the agent to do something now", hint: "The agent sees “Do this now:” followed by your text.", ask: "What the agent should do", example: "Stop and ask me before you touch the database."},
    {key: "deny", value: "deny", label: "Block a command or file change", hint: "The command or file change is refused, and the agent is given your reason.", ask: "Reason the agent is given", example: "Never force-push. Ask me first."},
    {key: "skill", value: "skill", label: "Make the agent read a skill", hint: "The agent must read the skill before it continues.", ask: "Which skill the agent must read", example: "journal-plans"},
];

export const TIME_DOES = DOES.filter((option) => !["deny", "skill"].includes(option.value));

export const EXAMPLES = [
    {name: "Block a command", phrases: ["push --force"], action: "deny", text: "Never force-push. Ask me first."},
    {name: "Remind the agent when a word appears", phrases: ["CHANGELOG"], action: "nudge", text: "Add the change to src/CHANGELOG.md in plain words."},
    {name: "Tell the agent to stop and ask", phrases: ["migration"], action: "instruct", text: "Stop and ask me before you touch the database."},
];

export const WHEN_TYPES = [
    {key: "words", label: "Words appear", hint: "In what you write or what the agent runs"},
    {key: "time", label: "A scheduled time arrives", hint: "Once, or again and again"},
];

export const TIMES = [
    {key: "every", label: "Repeat", hint: "At a fixed interval"},
    {key: "once", label: "Once", hint: "On one day, at one time"},
    {key: "cron", label: "By a cron line", hint: "Such as every weekday at nine"},
];

export const PLACES = [
    {key: "messages", label: "What you write to the agent"},
    {key: "commands", label: "Commands the agent runs"},
    {key: "files", label: "Files the agent changes"},
];

export const MATCHES = [
    {key: "part", label: "Part of the text", hint: "Capitals ignored"},
    {key: "word", label: "Whole word", hint: "Not part of another word"},
    {key: "pattern", label: "Pattern", hint: "A regular expression"},
];

const AGENT_CHOICES = [
    {key: "main", value: "main", label: "The main agent"},
    {key: "helper", value: "helper", label: "An agent or helper"},
];

export const CONDITION_TYPES = [
    {key: "agent", value: "agent", label: "Agent", note: "The main agent or a helper", choices: AGENT_CHOICES},
    {key: "environment", value: "environment", label: "Environment", note: "Only in one environment", example: "main"},
    {key: "fired", value: "fired", label: "How often it has fired", note: "Only the first few times", example: "3"},
    {key: "hours", value: "hours", label: "Hours of the day", note: "From one hour until another", example: "9-17"},
];

export const EXTRA_ACTIONS = [
    {key: "run", value: "run", label: "Run a command", note: "On the computer running the journal", ask: "Command line", example: "npm run lint"},
    {key: "web", value: "web", label: "Call a web address", note: "Send a request when it fires", ask: "Web address", example: "https://example.com/notify"},
];

export const doesOf = (value) => DOES.find((option) => option.value === value) || DOES[0];

export function localTimeInput(text) {
    const time = new Date(text);
    return new Date(time - time.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
}

const quoted = (word) => `“${word}”`;

function wordsText(words) {
    const quotes = words.slice(0, 3).map(quoted);
    const more = words.length - 3;
    if (more > 0) return `${quotes.join(", ")} or ${more} other ${more === 1 ? "phrase" : "phrases"}`;
    return quotes.length > 1 ? `${quotes.slice(0, -1).join(", ")} or ${quotes.at(-1)}` : quotes[0];
}

const DOING = {
    skill: (text) => `make the agent read ${text}`,
    nudge: (text) => `remind the agent ${text}`,
    instruct: (text) => `tell the agent to do this now: ${text}`,
    deny: (text) => `block it and tell the agent ${text}`,
};

const TIME_OPENINGS = {
    every: (trigger) => `Every ${trigger.every || "few"} minutes`,
    once: () => "At the time you choose",
    cron: () => "At the scheduled times",
};

export function sentence(trigger) {
    const doing = DOING[trigger.action](trigger.action === "skill" ? quoted(trigger.skill || "the skill") : trigger.text ? quoted(trigger.text) : "(no text yet)");
    if (trigger.type === "time") return `${TIME_OPENINGS[trigger.time](trigger)}, ${doing}.`;
    if (!trigger.phrases.length) return "Add the words to watch for and choose what happens.";
    return `When ${wordsText(trigger.phrases)} appears, ${doing}.`;
}
