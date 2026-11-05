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
    exports: false,
    labels: {},
    filters: [],
    ...more,
});

export const TABLES = {
    messages: kind("Message", "mail", "Messages between you and the agent", {in_sidebar: true, listed_under: "environment", takes_comments: true}),
    questions: kind("Question", "help", "A question from the agent with suggested answers", {needs_attention: true, takes_comments: true, labels: {answer: "Answer"}}),
    plans: kind("Plan", "flag", "A series of phases and tasks for you to approve before work begins", {
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
    tasks: kind("Task", "ring", "A unit of work tracked from creation to completion", {
        in_sidebar: true,
        listed_under: "sidebar",
        takes_comments: true,
        created_in_viewer: true,
        start_as_count: true,
        labels: {outcome: "How"},
        filters: OPEN_AND_CLOSED,
    }),
    reports: kind("Report", "report", "A record of what was checked and found", {
        view: "document",
        in_sidebar: true,
        listed_under: "environment",
        needs_attention: true,
        takes_comments: true,
        closed_first: true,
        exports: true,
    }),
    collections: kind("Collection", "folder", "Related items grouped under a name", {
        in_sidebar: true,
        listed_under: "sidebar",
        listed_as_cards: true,
        created_in_viewer: true,
        typed_as_title: true,
        labels: {abstract: "What belongs in it"},
    }),
    docs: kind("Document", "file", "What stays true about the project, catalogued for every session", {
        view: "document",
        scope: "project",
        in_sidebar: true,
        listed_under: "sidebar",
        needs_attention: true,
        takes_comments: true,
        created_in_viewer: true,
        exports: true,
        start_as_count: true,
    }),
    memories: kind("Memory", "pin", "What the agent keeps in mind here, with a weight from 1 to 10 that every compaction lowers by one", {
        in_sidebar: true,
        listed_under: "environment",
        takes_comments: true,
        created_in_viewer: true,
        labels: {weight: "A weight from 1 to 10"},
    }),
    rules: kind("Rule", "list", "An instruction that applies to every environment in the project", {
        scope: "project",
        in_sidebar: true,
        listed_under: "project",
        takes_comments: true,
        created_in_viewer: true,
        labels: {reason: "Reasoning"},
    }),
    reminders: kind("Reminder", "clock", "An instruction repeated until it is removed", {
        in_sidebar: true,
        listed_under: "environment",
        takes_comments: true,
        created_in_viewer: true,
    }),
    pins: kind("Pin", "band", "One line pinned to the chat while it matters", {filters: OPEN_AND_CLOSED}),
    reactions: kind("Reaction", "smile", "A face on a message", {nested: true, typed_as_title: true}),
    plugins: kind("Plugin", "plug", "An installed extension that responds to events and can run background services", {scope: "project"}),
    environments: kind("Environment", "branch", "A separate workspace with messages, tasks, memories, plans and settings", {scope: "project"}),
    agents: kind("Agent", "bot", "A session of Claude or Codex, and what it is doing right now"),
    nudges: kind("Agent instruction", "arrow", "A short instruction the journal sends the agent by itself; you never see it in the chat.", {nested: true, typed_as_title: true}),
    workers: kind("Worker", "bot", "An agent assigned a task in a separate working copy"),
    verifiers: kind("Verifier", "verifier", "An agent that checks whether an output reader report was correctly closed"),
    test_turns: kind("Test turn", "terminal", "A worker's turn to run the tests it named, under the test budget"),
    reviewers: kind("Reviewer", "reviewer", "An agent that tests and reviews worker changes and reports the results to the main agent"),
    subagents: kind("Subagent", "bot", "A helper started by the agent for a specific job", {nested: true}),
    sequences: kind("Sequence", "list", "Steps the agent follows in order, one at a time, started by hand or by its triggers", {
        view: "document",
        scope: "project",
        in_sidebar: true,
        listed_under: "sidebar",
        created_in_viewer: true,
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
    triggers: kind("Trigger", "bolt", "Words to watch for and the action to take when they appear", {
        scope: "project",
        in_sidebar: true,
        listed_under: "sidebar",
        created_in_viewer: true,
        labels: {words: "Words", action: "What it does", text: "What it sends"},
    }),
    checks: kind("Check", "checkbox", "A script that says pass or fail about the project, run by hand, by its button, or every so many minutes", {
        view: "check",
        filters: [
            {key: "open", title: "Checks", shows: "open"},
            {key: "closed", title: "Waits", shows: "closed", empty: "No wait has a check."},
        ],
        scope: "project",
        in_sidebar: true,
        listed_under: "sidebar",
        created_in_viewer: true,
    }),
    dumps: kind("Dump", "inbox", "Text and files you submit for the agent to sort by subject", {
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
// what a phone may not read: a secret's fields and the plugins stay on the computer
const DESK_ONLY = ["secrets", "plugins"];
const ORDER = Object.keys(TABLES).filter((name) => !(onPhone && DESK_ONLY.includes(name)));

export const tables = computed(() => ORDER.map((name) => ({name, ...TABLES[name]})));
export const meta = (table) => TABLES[table];
// The table a word names: its own name, the name without its s, or its title, as "tasks", "task" or "Document".
const WORDS = new Map(ORDER.flatMap((name) => [name, name.replace(/s$/, ""), TABLES[name].title.toLowerCase()].map((word) => [word, name])));
export const tableOfWord = (word) => WORDS.get(String(word).toLowerCase()) || "";
export const WORD_PATTERN = [...WORDS.keys()].sort((a, b) => b.length - a.length).join("|");

export const SHARED = ["docs", "reports", "plans"];
export const MENUED = ["rules", "memories", "triggers"];
export const DELETE_NOTE = "It leaves every list. Its history stays in Activity.";
