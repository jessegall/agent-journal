const UNGROUPED = "";

export const visibleSettings = (p) => {
    const values = Object.fromEntries(p.settings.map((s) => [s.key, s.value]));
    return p.settings.filter((s) => !s.when.length || s.when.some((choice) => choice.every(([other, value]) => values[other] === value)));
};

export const childrenOf = (visible, s) => visible.filter((child) => child.parent === s.key);

export function settingGroups(p) {
    const visible = visibleSettings(p);
    const out = new Map();
    for (const s of visible.filter((setting) => !setting.parent)) {
        const name = s.group || UNGROUPED;
        out.set(name, [...(out.get(name) || []), s]);
    }
    return [...out].map(([name, settings]) => ({
        name,
        settings,
        visible,
        flags: settings.flatMap((s) => [s, ...childrenOf(visible, s)]).filter((s) => s.type === "flag"),
    }));
}
