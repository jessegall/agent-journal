import {copying} from "@journal/window-kit";

// what the Skills page says about a skill: where it comes from, who must read it, the filters, and the items of its menu
const SOURCES = [["journal", "From the journal"], ["plugin", "From a plugin"], ["project", "From this project"]];
export const SOURCE_WORDS = Object.fromEntries(SOURCES);
export const sourceOf = (skill) => (skill.module?.startsWith("plugin:") ? "plugin" : skill.shipped ? "journal" : "project");
export const requiredWords = (skill) => (skill.required ? (skill.agents === "main" ? "Main agent" : "Every agent") : "");

export const skillFilters = [
    {key: "required", label: "Required", options: [["required", "Required"], ["optional", "Not required"]], get: (skill) => (skill.required ? "required" : "optional")},
    {key: "read", label: "Read by the main agent", options: [["read", "Read"], ["unread", "Not read"]], get: (skill) => (skill.read ? "read" : "unread")},
    {key: "source", label: "Source", options: SOURCES, get: sourceOf},
];

// the list is grouped by where a skill comes from, in that order
export const skillItems = (skills) => [...skills].sort((one, two) => SOURCES.findIndex(([key]) => key === sourceOf(one)) - SOURCES.findIndex(([key]) => key === sourceOf(two)) || one.folder.localeCompare(two.folder))
    .map((skill) => ({id: skill.folder, title: skill.folder, desc: skill.description, group: SOURCE_WORDS[sourceOf(skill)], row: skill}));

// the profiles that give a skill to their agents, and the ones that make their agents read it at the start
export const profilesOffering = (profiles, folder) => profiles.filter((profile) => (profile.skills ?? []).includes(folder));
export const profilesRequiring = (profiles, folder) => profiles.filter((profile) => (profile.required_skills ?? []).includes(folder));

// the menu of a skill: turn it on or off (require it at the start for every agent, or no longer), and copy its name
export const skillMenu = (skill, {require}) => [
    {label: skill.required ? "Turn off" : "Turn on", group: "own", run: ({say}) => require(skill.folder, skill.required ? "none" : "all").then(() => say(skill.required ? `${skill.folder} is no longer required` : `${skill.folder} is required at the start`))},
    {label: "Copy name", group: "copy", run: ({say}) => copying(skill.folder, "", say)},
];
