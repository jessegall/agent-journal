// Show in chat: one switch per mark family on the chat window, kept on the pane as the window's other options are

const familyKey = (family) => `show-${family}`;

// the part of a window's menu that lists the marks one by one, which the menu keeps behind a fold
export const MARKS_SECTION = "marks";

// a toggle per family the modules declare, shown until the user hides it
function familyOptions(declarations) {
    const families = new Map(declarations.map((declaration) => [declaration.family, declaration.family_title]));
    return [...families].map(([family, title]) => ({control: "toggle", key: familyKey(family), label: title, default: true, section: MARKS_SECTION}));
}

// the names a group of marks goes by in the menu; a group not named here shows its own word with a capital
const GROUP_TITLES = {agent: "The agent", reminders: "Reminders", work: "Work", journal: "The journal"};
const groupTitle = (group) => GROUP_TITLES[group] ?? `${group.slice(0, 1).toUpperCase()}${group.slice(1)}`;

// the marks whose family the pane has not switched off; `option` reads a pane option by its key, undefined when never set
export const shownMarks = (marks, declarationOf, option) =>
    marks.filter((mark) => option(familyKey(declarationOf(mark.type)?.family)) !== false);

// the families as Show in chat lists them: each with its declarations, whether any is shown by default, and whether any is a main mark
function families(declarations) {
    const found = new Map();
    for (const declaration of declarations) {
        const family = found.get(declaration.family) || {key: declaration.family, title: declaration.family_title, group: declaration.group, declarations: []};
        family.declarations.push(declaration);
        found.set(declaration.family, family);
    }
    return [...found.values()].map((family) => ({
        ...family,
        shown: family.declarations.some((declaration) => declaration.shown),
        main: family.declarations.some((declaration) => declaration.main),
    }));
}

const options = (list, shown) => Object.fromEntries(list.map((family) => [familyKey(family.key), shown(family)]));

// the presets of version 4's menu, each the pane options it sets: Only chat hides every family, Chat with context shows those shown by default,
// All updates shows them all
export const familyPresets = (declarations) => [
    {key: "chat", label: "Only chat", icon: "chat", options: options(families(declarations), () => false)},
    {key: "context", label: "Chat with context", icon: "list", options: options(families(declarations), (family) => family.shown)},
    {key: "every", label: "All updates", icon: "list", options: options(families(declarations), () => true)},
];

const groupFamilies = (declarations, group) => families(declarations).filter((family) => family.group === group);

// whether a group shows only its main marks: its families with a main mark are on and the others off
export const isMainOnly = (declarations, group, option) => groupFamilies(declarations, group).every((family) => (option(familyKey(family.key)) ?? true) === family.main);

// main only for a group: its families that have no main mark are switched off, the others on; flipping it again switches them all on
export function mainOnlyOptions(declarations, group, option) {
    const already = isMainOnly(declarations, group, option);
    return options(groupFamilies(declarations, group), (family) => (already ? true : family.main));
}

// Show in chat below its presets, group by group: the group's name with Main updates only, then a switch for each family in it
export function groupOptions(declarations) {
    const groups = new Map();
    for (const declaration of declarations) groups.set(declaration.group, [...(groups.get(declaration.group) ?? []), declaration]);
    return [...groups].flatMap(([group, own]) => [
        {control: "main", key: `main-only-${group}`, label: "Main updates only", title: groupTitle(group), group, declarations: own, section: MARKS_SECTION},
        ...familyOptions(own),
    ]);
}

// a version 4 pane's saved list of hidden types as family switches: a family is off when every one of its marks is among them, a type being
// named by a mark's type or by its family's short name; any family not named stays on
export function optionsFromHidden(hidden, declarations) {
    const named = (family, declaration) => hidden.includes(declaration.type) || hidden.includes(family.key.split(".").at(-1));
    return options(families(declarations), (family) => !family.declarations.every((declaration) => named(family, declaration)));
}
