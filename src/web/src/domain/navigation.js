export const SIDEBAR = "sidebar";

export const PAGES = {
    "": {title: "Home", icon: "home", text: ""},
    kanban: {title: "Board", icon: "board", text: ""},
    resources: {title: "Resources", icon: "tiles", text: "Every kind of record the journal keeps, and its setup"},
    skills: {title: "Skills", icon: "book", text: "The instructions the agent loads for each kind of work"},
    organization: {title: "Organization", icon: "agents", text: "The project's domains and the roles under them"},
    plugins: {title: "Plugins", icon: "plug", text: "Repositories installed into the journal, with their pages and settings"},
    settings: {title: "Settings", icon: "settings", text: "Features, notifications and how the viewer behaves"},
};

export const RESOURCE_GROUPS = [
    {key: "results", title: "Conversation and results", pages: []},
    {key: "workings", title: "How the agent works", pages: ["skills"]},
    {key: "setup", title: "Setup", pages: ["organization"]},
];
