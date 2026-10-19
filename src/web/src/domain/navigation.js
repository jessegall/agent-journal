export const SIDEBAR = "sidebar";

export const PAGES = {
    "": {title: "Home", icon: "home", text: ""},
    resources: {title: "Resources", icon: "tiles", text: "Every kind of row the journal keeps"},
    skills: {title: "Skills", icon: "book", text: "The instructions the agent loads for each kind of work"},
    profiles: {title: "Profiles", icon: "agents", text: "The subagents the agent can dispatch, each with its job, tools and model"},
    code: {title: "Code", icon: "file", text: "The project's files, as they are on disk"},
    secrets: {title: "Secrets", icon: "key", text: "Keys and logins the agent may use without ever seeing them"},
    mcp: {title: "MCP", icon: "share", text: "The MCP servers the agents are given"},
    chart: {title: "Workflows", icon: "bolt", text: "How the journal treats the agent, as flowcharts you edit"},
    plugins: {title: "Plugins", icon: "plug", text: "Installed plugins, with their dashboards and settings"},
    settings: {title: "Settings", icon: "settings", text: "Features, notifications and how the viewer behaves"},
};

export const RESOURCE_GROUPS = [
    {key: "environment", title: "This environment", pages: []},
    {key: "project", title: "Whole project", pages: ["skills", "profiles"]},
];

export const pluralTitle = (title) => `${title}s`;
