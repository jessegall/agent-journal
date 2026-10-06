export const LESSONS = [
    {
        key: "bakery",
        title: "How to ask for a plan",
        teaches:
            "Ask for a plan for a bakery's website. The agent asks how thorough it should be, writes it phase by phase, and you approve it with its button and watch it run to the end.",
        load: () => import("./scenarios/bakery.json"),
    },
    {
        key: "ledgerly",
        title: "How to ask for a report",
        teaches:
            "Ask why an invoice is a cent off and for a report. The agent reproduces it, asks how VAT should round, and writes the report part by part before handing it to you as a card.",
        load: () => import("./scenarios/ledgerly.json"),
    },
    {
        key: "subagents",
        title: "How to start subagents",
        teaches:
            "Ask for two agents to review a project before it ships. The agent sends two read-only subagents, each named and on its own model; what they find comes back as to-dos, which you have fixed.",
        load: () => import("./scenarios/subagents.json"),
    },
    {
        key: "helpers",
        title: "How to work with helpers",
        teaches:
            "Ask for a plan and which parts could go to helpers. Hand the writing jobs to helpers on Codex and Claude, each in a place of its own, set one straight when it goes off track, and bring the work back.",
        load: () => import("./scenarios/helpers.json"),
    },
    {
        key: "docs",
        title: "How to keep a document",
        teaches:
            "Ask for a volunteer handbook page. The agent asks which source to use, writes the guide chapter by chapter from the field notes, and puts it in a collection you can open.",
        load: () => import("./scenarios/docs.json"),
    },
    {
        key: "memory",
        title: "How the agent remembers",
        teaches:
            "Ask the agent to remember one detail while it builds a theatre's home page. When you ask for the show schedule later, it still knows, because it kept what you said as a fact.",
        load: () => import("./scenarios/memory.json"),
    },
    {
        key: "dumps",
        title: "How to dump a pile of notes",
        teaches:
            "Drop a pasted note, a screenshot and a text file in one dump. The agent sorts them by subject into documents in a named collection, says what it is doing as it goes, and asks you one question in the dump.",
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
