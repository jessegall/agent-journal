// The sidebar as the v5 design lays it out: each page's window in its group, in the design's order, under the design's name for it.
// [window name, name in the sidebar and on the top bar]
export const NAV = [
    {key: "pages", title: "", pages: [["search.search", "Search"]]},
    {key: "work", title: "Work", pages: [["documents.page", "Documents"], ["coding.files", "Files"], ["coding.git", "Git"], ["checks.checks", "Checks"], ["processes.outputs", "Output"], ["transcriptions.transcriptions", "Transcriptions"]]},
    {key: "agents", title: "Agents", pages: [["profiles.profiles", "Profiles"], ["skills.skills", "Skills"], ["memories.memories", "Memories"], ["project-rules.rules", "Rules"], ["templates.templates", "Templates"], ["sequences.sequences", "Sequences"], ["reminders.reminders", "Reminders"]]},
    {key: "connect", title: "Connect", pages: [["plugins.plugins", "Plugins"], ["mcp.integrations", "Integrations"], ["secrets.secrets", "Secrets"], ["library.teams", "Teams"]]},
];
const DEVELOPER = [["developer.numbers", "Numbers"], ["developer.hook-requests", "Request log"], ["developer.system-logs", "System logs"]];
const FOOT = [["settings.settings", "Settings"]];
// the change log opens from the version at the foot, not from a row of its own
const UPDATES = "updates.updates";
// pages the sidebar does not list: the one output a row opens (the Output page lists them all), the tunnel, the tunler account, the hooks and the program tools are sections of Settings
const NOT_LISTED = new Set(["processes.output", "tunnel.tunnel", "tunler.account", "settings.project-hooks", "tools.tools"]);
const TITLES = new Map([...NAV.flatMap((group) => group.pages), ...DEVELOPER, ...FOOT, [UPDATES, "Change log"]]);

// the title of a page on the top bar: the design's name for it, else what the window calls itself
export const pageTitle = (name, fallback = "") => TITLES.get(name) ?? fallback;

// the offered pages as the sidebar's sections: the design's groups, the developer pages when the journal offers them, any page the design does not place under More, and Settings at the foot
export function sidebarSections(windows) {
    const byName = new Map(windows.map((window) => [window.name, window]));
    const named = (pages) => pages.filter(([name]) => byName.has(name)).map(([name, title]) => ({...byName.get(name), title}));
    const placed = new Set([...TITLES.keys()]);
    const rank = (name) => DEVELOPER.findIndex(([known]) => known === name) + 1 || DEVELOPER.length + 1;
    const developer = windows.filter((window) => window.group === "developer").sort((one, two) => rank(one.name) - rank(two.name)).map((window) => ({...window, title: TITLES.get(window.name) ?? window.title}));
    const more = windows.filter((window) => !placed.has(window.name) && !NOT_LISTED.has(window.name) && window.group !== "developer");
    return [
        ...NAV.map((group) => ({key: group.key, title: group.title, windows: named(group.pages)})),
        {key: "developer", title: "Developer", windows: developer},
        {key: "more", title: "More", windows: more},
        {key: "foot", title: "", windows: named(FOOT)},
    ].filter((section) => section.windows.length || section.key === "pages");
}
