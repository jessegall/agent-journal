// the sections of the Settings page in the design's groups and order, each with its icon, and what draws it: the declared settings of some modules, one of the page's own bodies,
// or another window. A declared module no section names goes under Advanced. A suite adds its own sections, or fills one of these out, through suite sections.
export const GROUPS = [
    {key: "viewer", title: "Viewer", sections: ["look", "sidebar"]},
    {key: "agents", title: "Agents", sections: ["reviews", "tools", "commands", "hooks", "advanced"]},
    {key: "connections", title: "Connections", sections: ["tunnel", "tunler", "phones"]},
    {key: "project", title: "Project", sections: ["environments", "developer"]},
];

export const SECTIONS = {
    look: {label: "Look", icon: "style", modules: ["journal.core.viewer", "journal.core.voices", "journal.core.chat", "journal.core.messages", "journal.core.overview"]},
    sidebar: {label: "Sidebar", icon: "sidepanel", modules: ["journal.core.docking"]},
    reviews: {label: "Reviews", icon: "eye", modules: ["journal.core.reviews", "journal.core.plan_reviews"]},
    tools: {label: "Program tools", icon: "tools", modules: ["journal.core.claude_code", "journal.core.codex"]},
    commands: {label: "Command classification", icon: "terminal", body: "commands"},
    hooks: {label: "Hooks", icon: "hook", window: "settings.project-hooks"},
    advanced: {label: "Advanced", icon: "layout"},
    tunnel: {label: "Tunnel", icon: "broadcast", modules: ["journal.core.tunnel"]},
    tunler: {label: "Tunler", icon: "plug", modules: ["journal.tunnels.tunler"]},
    phones: {label: "Phones", icon: "phone", modules: ["journal.core.phone"]},
    environments: {label: "Environments", icon: "folder", body: "environments"},
    developer: {label: "Developer", icon: "code", modules: ["journal.core.developer"]},
};

// the page's groups and sections with the sections of the environment's suite: a section of a key the page has fills it out, a new one stands in front of the
// section it names in its group, or at the group's end; the modules a suite's window draws are listed by no section
export function withSuiteSections(suiteSections) {
    const groups = GROUPS.map((group) => ({...group, sections: [...group.sections]}));
    const sections = {...SECTIONS};
    for (const added of suiteSections) {
        const own = {label: added.label, icon: added.icon, window: added.window, tabs: added.tabs};
        if (sections[added.key]) {
            sections[added.key] = {...sections[added.key], ...own};
            continue;
        }
        sections[added.key] = own;
        const group = groups.find((candidate) => candidate.key === added.group) ?? groups[groups.length - 1];
        const place = group.sections.indexOf(added.next_section);
        group.sections.splice(place === -1 ? group.sections.length : place, 0, added.key);
    }
    return {groups, sections, drawnElsewhere: suiteSections.flatMap((added) => added.draws_modules)};
}

// the section a module's declared settings are in
export function sectionOf(module, sections, drawnElsewhere) {
    if (drawnElsewhere.includes(module)) return null;
    return Object.entries(sections).find(([, section]) => section.modules?.includes(module))?.[0] ?? "advanced";
}
