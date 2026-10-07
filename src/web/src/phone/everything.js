import {kindOf} from "./kinds.js";

const ROUTES = {plugin: "plugins", skill: "skills"};

const kind = (type) => ({
    key: type,
    label: kindOf(type).many,
    sub: kindOf(type).description,
    icon: kindOf(type).icon,
    route: ROUTES[type] || `list:${type}`,
    type,
});
const place = (key, label, sub, icon, route = `place:${key}`) => ({key, label, sub, icon, route});

export const GROUPS = [
    {
        key: "environment",
        head: (environment) => `Only in ${environment}`,
        line: "Only in this environment; each environment has its own.",
        places: ["plan", "suggestion", "question", "collection", "work", "agent"].map(kind),
    },
    {
        key: "project",
        head: () => "Project",
        line: "Shared by every environment.",
        places: [
            place("board", "Board", "To-dos in lanes, from To do to Done", "board", "tab:todos"),
            ...["doc", "ticket", "trigger", "sequence", "check"].map(kind),
        ],
    },
    {
        key: "notes",
        head: () => "Notes",
        line: "What the agent writes down and keeps.",
        places: ["message", "report", "fact", "reminder", "rule"].map(kind),
    },
    {
        key: "working",
        head: () => "How the agent works",
        line: "What the agent reads, runs and follows.",
        places: [
            ...["skill", "tool", "template", "profile"].map(kind),
            place("organization", "Organization", "Domains, their roles and who fills them", "family", "organization:"),
        ],
    },
    {
        key: "setup",
        head: () => "Setup",
        line: "Journals, plugins, files and settings.",
        places: [
            place("journals", "Journals", "Every journal on this computer and what needs you in each", "chapters", "journals:"),
            place("environments", "Environments", "Switch, start an agent, make a new one", "branch", "environments:"),
            kind("plugin"),
            kind("share"),
            place("files", "Project files", "Every file in the project, and what it is attached to", "folder", "files:"),
            place("settings", "Settings", "Features, services, alerts, your title and name", "settings", "settings"),
        ],
    },
];

export const PLACES = GROUPS.flatMap((group) => group.places);
export const KIND_PLACES = PLACES.filter((one) => one.type);

export const COMMANDS = [
    {key: "message", label: "Message the agent"},
    {key: "places", label: "Switch journal or environment"},
    {key: "agent", label: "Pause, resume or stop the agent"},
    {key: "needs", label: "See what needs you"},
    {key: "tour", label: "Show the tour again"},
];
