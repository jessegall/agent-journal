export const SIDEBAR = "sidebar";

export const PAGES = {
    "": {title: "Home", icon: "home", text: ""},
    kanban: {title: "Board", icon: "board", text: ""},
    resources: {title: "Resources", icon: "tiles", text: "Every type of item the journal keeps"},
    skills: {title: "Skills", icon: "book", text: "The instructions the agent loads for each kind of work"},
    organization: {title: "Organization", icon: "agents", text: "The project's domains and the roles under them"},
    secrets: {title: "Secrets", icon: "key", text: "Keys and logins the agent may use without ever seeing them"},
    integrations: {title: "Integrations", icon: "share", text: "Outside services the journal reads from, such as Linear"},
    plugins: {title: "Plugins", icon: "plug", text: "Installed plugins, with their pages and settings"},
    settings: {title: "Settings", icon: "settings", text: "Features, notifications and how the viewer behaves"},
};

export const RESOURCE_GROUPS = [
    {key: "results", title: "Results", pages: []},
    {key: "workings", title: "Agent", pages: ["skills"]},
    {key: "setup", title: "Project", pages: ["organization"]},
];

const UNCOUNTED = ["Work"];

export const pluralTitle = (title) => (UNCOUNTED.includes(title) ? title : `${title}s`);
