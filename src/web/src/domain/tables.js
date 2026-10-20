import {onPhone} from "../platform/phone.js";
import {computed} from "vue";

// How the viewer shows each of the journal's tables: its name in words, its icon, where it is listed and what it is for.
// The journal answers rows by their own fields; this is the viewer's own catalogue of how to draw them.
const OPEN_AND_CLOSED = [
    {key: "open", title: "Open", shows: "open"},
    {key: "closed", title: "Closed", shows: "closed"},
];

const kind = (title, icon, abstract, more = {}) => ({
    title,
    icon,
    abstract,
    view: "small",
    scope: "environment",
    in_sidebar: false,
    listed_under: "",
    needs_attention: false,
    lists_completed_unread: false,
    nested: false,
    takes_comments: false,
    closed_first: false,
    created_in_viewer: false,
    listed_as_cards: false,
    typed_as_title: false,
    start_as_count: false,
    labels: {},
    filters: [],
    ...more,
});

export const TABLES = {
    messages: kind("Message", "mail", "What the user left for the agent, or the agent for the user", {in_sidebar: true, listed_under: "environment", takes_comments: true}),
    questions: kind("Question", "help", "Something the agent asks the user, with choices to pick", {needs_attention: true, labels: {answer: "Answer"}}),
    comments: kind("Comment", "bubble", "What the user said about another row", {nested: true}),
    plans: kind("Plan", "flag", "Ordered phases of tasks with a goal, approved by the user before it runs", {
        view: "document",
        in_sidebar: true,
        listed_under: "sidebar",
        needs_attention: true,
        lists_completed_unread: true,
        takes_comments: true,
        created_in_viewer: true,
        labels: {brief: "What you want, in your own words; the agent builds the plan with you from here"},
        filters: OPEN_AND_CLOSED,
    }),
    tasks: kind("Task", "ring", "One unit of work with a life: open, started, done", {
        in_sidebar: true,
        listed_under: "sidebar",
        takes_comments: true,
        created_in_viewer: true,
        start_as_count: true,
        labels: {outcome: "How"},
        filters: OPEN_AND_CLOSED,
    }),
    reports: kind("Report", "report", "What was checked and what was found, written for the user", {
        view: "document",
        in_sidebar: true,
        listed_under: "environment",
        needs_attention: true,
        takes_comments: true,
        closed_first: true,
    }),
    docs: kind("Document", "file", "What stays true about the project, catalogued for every session", {
        view: "document",
        scope: "project",
        in_sidebar: true,
        listed_under: "sidebar",
        needs_attention: true,
        takes_comments: true,
        created_in_viewer: true,
        start_as_count: true,
    }),
    facts: kind("Fact", "pin", "Something true about this environment that a later session would get wrong without", {
        in_sidebar: true,
        listed_under: "environment",
        takes_comments: true,
        created_in_viewer: true,
    }),
    rules: kind("Rule", "list", "A ruling that binds every environment of the project", {
        scope: "project",
        in_sidebar: true,
        listed_under: "project",
        takes_comments: true,
        created_in_viewer: true,
        labels: {reason: "Reasoning"},
    }),
    reminders: kind("Reminder", "clock", "An instruction said again until it is retired", {
        in_sidebar: true,
        listed_under: "environment",
        takes_comments: true,
        created_in_viewer: true,
    }),
    notices: kind("Notice", "band", "One line pinned to the chat while it matters", {filters: OPEN_AND_CLOSED}),
    reactions: kind("Reaction", "smile", "A face on a message", {nested: true, typed_as_title: true}),
    plugins: kind("Plugin", "plug", "A repository installed into the journal: it hears the bus, answers, and may run services of its own", {scope: "project"}),
    environments: kind("Environment", "branch", "One line of work with its own record: messages, tasks, facts, plans, settings", {scope: "project"}),
    agents: kind("Agent", "bot", "A session of Claude or Codex, and what it is doing right now"),
    nudges: kind("Agent instruction", "arrow", "A short instruction the journal sends the agent by itself; you never see it in the chat.", {nested: true, typed_as_title: true}),
    workers: kind("Worker", "bot", "An agent sent to write one bounded job, in a working copy of its own"),
    sequences: kind("Sequence", "list", "Steps the agent follows in order, one at a time, started by hand or by a moment", {
        view: "document",
        scope: "project",
        in_sidebar: true,
        listed_under: "sidebar",
        listed_as_cards: true,
        takes_comments: true,
        labels: {brief: "What it is for"},
    }),
    templates: kind("Template", "docs", "Instructions put in front of anything made from it, with the parts it starts with", {
        view: "document",
        scope: "project",
        in_sidebar: true,
        listed_under: "project",
        labels: {brief: "Instructions"},
    }),
    triggers: kind("Trigger", "bolt", "Words that the user watches for, and what the journal does when they come up", {
        scope: "project",
        in_sidebar: true,
        listed_under: "sidebar",
        created_in_viewer: true,
        labels: {words: "Words", action: "What it does", text: "What it sends"},
    }),
    checks: kind("Check", "checkbox", "A script that says pass or fail about the project, run by hand, by its button, or every so many minutes", {
        view: "check",
        scope: "project",
        in_sidebar: true,
        listed_under: "sidebar",
        created_in_viewer: true,
    }),
    dumps: kind("Dump", "inbox", "A pile the user drops in one place, which the agent sorts by subject and files", {
        view: "document",
        needs_attention: true,
        takes_comments: true,
        created_in_viewer: true,
        labels: {brief: "What you dumped", outcome: "Filed"},
    }),
    shares: kind("Share", "share", "A link that lets someone outside the journal view one document, report or plan, and nothing else", {scope: "project"}),
    secrets: kind("Secret", "key", "A key or login the agent may use without ever seeing it", {scope: "project"}),
};

// the phone never reads a secret, so it never lists or counts them
const ORDER = Object.keys(TABLES).filter((name) => !(onPhone && name === "secrets"));

export const tables = computed(() => ORDER.map((name) => ({name, ...TABLES[name]})));
export const meta = (table) => TABLES[table];
// The table a word names: its own name, the name without its s, or its title, as "tasks", "task" or "Document".
const WORDS = new Map(ORDER.flatMap((name) => [name, name.replace(/s$/, ""), TABLES[name].title.toLowerCase()].map((word) => [word, name])));
export const tableOfWord = (word) => WORDS.get(String(word).toLowerCase()) || "";
export const WORD_PATTERN = [...WORDS.keys()].sort((a, b) => b.length - a.length).join("|");
export const label = (table, field, fallback) => (TABLES[table]?.labels || {})[field] || fallback;

const NAMED_CLOSES = {
    plugins: "Remove plugin",
    environments: "Remove environment",
    shares: "Stop sharing",
    questions: "Answer",
};
const STOPS = {triggers: "It stops running.", sequences: "It stops starting by itself.", rules: "The agent stops following it."};

export const closeWord = (table) => NAMED_CLOSES[table] || `Close the ${meta(table).title.toLowerCase()}`;
export const closeNote = (table) => `Moves it to Closed. ${STOPS[table] ? `${STOPS[table]} ` : ""}You can reopen it.`;
export const SHARED = ["docs", "reports", "plans"];
export const MENUED = ["rules", "facts", "triggers"];
export const DELETE_NOTE = "It leaves every list. Its history stays in Activity.";
