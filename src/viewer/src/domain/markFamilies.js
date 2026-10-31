// Show in chat: one switch per mark family on the chat window, kept on the pane as the window's other options are

export const familyKey = (family) => `show-${family}`;

// a toggle per family the modules declare, shown until the person hides it
export function familyOptions(declarations) {
    const families = new Map(declarations.map((declaration) => [declaration.family, declaration.family_title]));
    return [...families].map(([family, title]) => ({control: "toggle", key: familyKey(family), label: title, default: true}));
}

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

// the presets of version 4's menu, each the pane options it sets: Only chat hides every family, Chat with context shows those shown by default
export const familyPresets = (declarations) => [
    {key: "chat", label: "Only chat", icon: "chat", options: options(families(declarations), () => false)},
    {key: "context", label: "Chat with context", icon: "list", options: options(families(declarations), (family) => family.shown)},
];

// the preset a pane's options match, or ""
export const presetOfOptions = (declarations, option) =>
    familyPresets(declarations).find((preset) => Object.entries(preset.options).every(([key, shown]) => (option(key) ?? true) === shown))?.key ?? "";

// main only for a group: its families that have no main mark are switched off, the others on; flipping it again switches them all on
export function mainOnlyOptions(declarations, group, option) {
    const own = families(declarations).filter((family) => family.group === group);
    const already = own.every((family) => (option(familyKey(family.key)) ?? true) === family.main);
    return options(own, (family) => (already ? true : family.main));
}

// a version 4 pane's saved list of hidden kinds as family switches: a family is off when every one of its marks is among them, a kind being
// named by a mark's type or by its family's short name; any family not named stays on
export function optionsFromHidden(hidden, declarations) {
    const named = (family, declaration) => hidden.includes(declaration.type) || hidden.includes(family.key.split(".").at(-1));
    return options(families(declarations), (family) => !family.declarations.every((declaration) => named(family, declaration)));
}
