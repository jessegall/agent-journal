export const LESSONS = [
    {
        key: "bakery",
        title: "How to ask for a plan",
        teaches: "Ask for a website and watch the journal walk the agent through writing a plan, phase by phase. You read the plan, approve it with its button and see it run; one question changes what gets built.",
        load: () => import("./scenarios/bakery.json"),
    },
    {
        key: "ledgerly",
        title: "How to ask for a report",
        teaches: "Ask why an invoice is a cent off. The agent reproduces it, asks you how VAT should round, and writes the report part by part before handing it to you as a card.",
        load: () => import("./scenarios/ledgerly.json"),
    },
    {
        key: "subagents",
        title: "How to start subagents",
        teaches: "Ask for a review before a release. The agent sends two read-only subagents, each named and on its own model; what they find comes back as to-dos, and you decide whether to fix it now.",
        load: () => import("./scenarios/subagents.json"),
    },
    {
        key: "helpers",
        title: "How to work with helpers",
        teaches: "Hand writing jobs to helpers on Codex and Claude, each in a place of its own. Follow them while they work, set one straight when it goes off track, and bring the work back.",
        load: () => import("./scenarios/helpers.json"),
    },
    {
        key: "docs",
        title: "How to keep a document",
        teaches: "Ask for a volunteer handbook page. The agent asks which source to use, then writes it chapter by chapter or files the approved draft whole, and puts it in a collection you can open.",
        load: () => import("./scenarios/docs.json"),
    },
    {
        key: "memory",
        title: "How the agent remembers",
        teaches: "Tell the agent something once while it builds a theatre's home page. When you ask for the show schedule later, it still knows, because it kept what you said as a fact.",
        load: () => import("./scenarios/memory.json"),
    },
    {
        key: "dumps",
        title: "How to dump a pile of notes",
        teaches: "Drop a pasted note, a screenshot and a text file in one dump. The agent sorts them by subject into documents in a named collection, says what it is doing as it goes, and asks you one question in the dump.",
        load: () => import("./scenarios/dumps.json"),
    },
];

const LESSON = "scenario";
const asked = new URLSearchParams(location.search).get(LESSON);

export const picked = LESSONS.find((one) => one.key === asked);

export const scenario = picked || LESSONS[0];

function opened(key) {
    const url = new URL(location.href);
    if (key) url.searchParams.set(LESSON, key);
    else url.searchParams.delete(LESSON);
    url.hash = "";
    location.assign(url.toString());
}

export const play = (key) => opened(key);

export const lessons = () => opened("");
