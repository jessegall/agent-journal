import {tabLine} from "../../domain/settingsCatalog.js";

const region = (key, title, icon, line, route = `region:${key}`) => ({key, title, icon, line, route});

export const REGIONS = [
    region("agent", "Agent", "bolt", tabLine("agent")),
    region("features", "Features", "bolt", tabLine("features")),
    region("notify", "Alerts on this phone", "bell", "When this phone gets an alert from your computer."),
    region("services", "Services", "play", tabLine("services")),
    region("phone", "Phone and share links", "phone", "Your phone, who it reaches this journal as, and share links."),
    region("pluginsettings", "Plugin settings", "plug", tabLine("plugins")),
    region("environments", "Environments", "branch", tabLine("environments"), "environments:"),
    region("system", "System", "settings", "Updates, the project folder and shutting down."),
    region("developer", "Developer", "terminal", tabLine("developer")),
    region("chatshows", "What the chat shows", "chat", "Choose what appears in the chat and what stays out of it."),
    region("scheme", "Colors", "palette", "Light, dark, or follow this phone."),
    region("voice", "Your title and name", "smile", "What the agent calls you, and how it talks to you."),
    region("tips", "Tour", "help", "Show the tour again."),
    region("about", "About this journal", "info", "Version and what changed."),
];

export const FILTERED = {
    changed: {title: "Changed", line: "Settings changed from the default. Switch one back to return to the default."},
    off: {title: "Off", line: "Everything that is switched off now."},
};

export const TAB_OF = {agent: "agent", features: "features", system: "system", developer: "developer"};

export const regionOf = (key) => REGIONS.find((one) => one.key === key) || {key, title: FILTERED[key]?.title || key, line: FILTERED[key]?.line || ""};
