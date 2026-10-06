import {rows} from "../sync/rows.js";
import {eventWords} from "./moments.js";

const USER = "user";
const START = "start";
const TRIGGERED = /^trigger:(\d+)$/;

export const WHERE = [
    {value: USER, label: "Your messages only", hint: "Only what you write to the agent."},
    {value: "text", label: "What is written", hint: "Your messages, the agent's chat messages and the files it writes."},
    {value: "commands", label: "Commands the agent runs", hint: "Only commands in the agent's terminal."},
    {
        value: "both",
        label: "Written and run",
        hint: "Your messages, the agent's chat messages, the files it writes and the commands it runs.",
    },
    {
        value: "everything",
        label: "Everything",
        hint: "All of that, plus files the agent opens, what it searches for and web addresses it visits.",
    },
];

export const KEYWORD_WHERE = [
    {value: "text", label: "What is written", hint: "The agent's chat messages and the files it writes."},
    {value: "commands", label: "Commands the agent runs", hint: "Only commands in the agent's terminal."},
    {value: "both", label: "Written and run", hint: "The agent's chat messages, the files it writes and the commands it runs."},
    {
        value: "everything",
        label: "Everything",
        hint: "All of that, plus files the agent opens, what it searches for and web addresses it visits.",
    },
];

export const DOES = [
    {
        value: "message",
        label: "Send a message from you",
        short: "It sends a message from you.",
        hint: "A message from you appears in the chat, and the agent answers it.",
        ask: "The message, as you would write it",
        example: "Please run the full test suite before you push.",
    },
    {
        value: "nudge",
        label: "Remind the agent",
        short: "It reminds the agent.",
        hint: "A short note only the agent sees. It carries on with its work.",
        ask: "What to remind the agent of",
        example: "Add the change to src/CHANGELOG.md in plain words.",
    },
    {
        value: "instruct",
        label: "Tell the agent to do something now",
        short: "It tells the agent to do something now.",
        hint: "The agent sees “Do this now:” followed by your text.",
        ask: "What the agent should do",
        example: "Stop and ask me before you touch the database.",
    },
    {
        value: "deny",
        label: "Block it",
        short: "It blocks the command.",
        hint: "The command or file change is refused, and the agent is given your reason. If the words are in the agent's chat message, it can't be unsaid, so the agent is told instead.",
        ask: "Reason the agent is given",
        example: "Never force-push. Ask me first.",
    },
    {
        value: START,
        label: "Start a sequence",
        short: "It starts a sequence.",
        hint: "Starts the sequence you pick below. Nothing is sent.",
        ask: "",
        example: "",
    },
];

export const EXAMPLES = [
    {
        name: "Block a command",
        title: "No force push",
        words: ["push --force"],
        words_in: "commands",
        does: "deny",
        text: "Never force-push. Ask me first.",
    },
    {
        name: "Remind the agent when a word comes up",
        title: "Mention the changelog",
        words: ["CHANGELOG"],
        words_in: "both",
        does: "nudge",
        text: "Add the change to src/CHANGELOG.md in plain words.",
    },
    {
        name: "Start a sequence when you say something",
        title: "Release checklist",
        words: ["ready to release"],
        words_in: USER,
        does: START,
        text: "",
    },
    {
        name: "Send a message from you",
        title: "Ask for tests",
        words: ["git push"],
        words_in: "commands",
        does: "message",
        text: "Please run the full test suite before you push.",
    },
];

export const doesOf = (value) => DOES.find((option) => option.value === value) || DOES[1];

export const startedBy = (n) => rows("sequence").filter((s) => !s.deleted && s.data.starts_on === `trigger:${n}`);

export const whereReason = (trigger) =>
    trigger.does === "deny" ? {[USER]: "A trigger that blocks can't watch your messages: they are never blocked."} : {};

export const doesReason = (trigger) =>
    trigger.words_in === USER ? {deny: "Your messages are never blocked, so this can't be picked while the words count only there."} : {};

const quoted = (word) => `“${word}”`;

export function wordsText(words) {
    if (!words.length) return "";
    const shown = words.slice(0, 3).map(quoted);
    const more = words.length - 3;
    if (more > 0) return `${shown.join(", ")} or ${more} other ${more === 1 ? "phrase" : "phrases"}`;
    return shown.length > 1 ? `${shown.slice(0, -1).join(", ")} or ${shown.at(-1)}` : shown[0];
}

const watching = (words, where) =>
    ({
        [USER]: `When you write ${words}`,
        text: `When ${words} comes up in what you or the agent write`,
        commands: `When the agent runs a command with ${words}`,
        both: `When ${words} comes up in what is written or run`,
        everything: `When ${words} comes up anywhere in the agent's work or your messages`,
    })[where] || `When ${words} comes up`;

function doing(trigger, sequences) {
    const text = trigger.text ? [{text: quoted(trigger.text)}] : [{text: "no text yet", muted: true}];
    const titles = sequences.flatMap((s, i) => [...(i ? [{text: " and "}] : []), {text: s.title, bold: true}]);
    return {
        message: [{text: "send a message from you, "}, ...text],
        nudge: [{text: "remind the agent "}, ...text],
        instruct: [{text: "tell the agent to do this now: "}, ...text],
        deny: [{text: "block it and tell the agent "}, ...text],
        start: sequences.length
            ? [{text: "start the sequence "}, ...titles]
            : [{text: "start a sequence. "}, {text: "None is picked yet, so nothing happens", muted: true, stop: true}],
    }[trigger.does];
}

const keyed = (parts) => parts.map((part, i) => ({...part, key: `part-${i}`}));
const EMPTY = "Add the words to watch for and choose what happens, and this sentence will say what the trigger does.";

export function sentence(trigger, sequences) {
    if (!trigger.words.length) return keyed([{text: EMPTY, muted: true}]);
    const parts = [{text: `${watching(wordsText(trigger.words), trigger.words_in)}, `}, ...doing(trigger, sequences)];
    const last = parts.at(-1);
    return keyed(last.stop || /[.!?]”?$/.test(last.text) ? parts : [...parts, {text: "."}]);
}

export const plain = (parts) => parts.map((part) => part.text).join("");

export function startWords(sequence) {
    const start = sequence.data.starts_on;
    if (!start) return "Only when you or the agent start it";
    const [, n] = TRIGGERED.exec(start) || [];
    if (!n) return `When ${eventWords(start)}`;
    const trigger = rows("trigger").find((t) => t.n === Number(n));
    return trigger ? `When the trigger ${trigger.title} matches (${wordsText(trigger.data.words)})` : `When trigger ${n} matches`;
}

export const startsOnTrigger = (sequence) => TRIGGERED.test(sequence.data.starts_on || "");
