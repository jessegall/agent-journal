// A setting's value as its control shows it: what is stored may be JSON, or the default as the plugin wrote it.
export function shownValue(setting) {
    const {value} = setting;
    const parsed = typeof value === "string" && /^[[{"]|^(true|false)$/.test(value) ? JSON.parse(value) : value;
    if (Array.isArray(parsed)) return parsed.join("\n");
    return parsed === null || parsed === undefined ? "" : String(parsed);
}

export const isOn = (setting) => shownValue(setting) === "true";

export const childrenOf = (settings, setting) => settings.filter((child) => child.parent === setting.key);

// the settings in their groups, in the order the plugin lists them, without the ones that show under another; flags counts every switch of the group
export function settingGroups(settings) {
    const groups = new Map();
    for (const setting of settings.filter((each) => !each.parent)) {
        groups.set(setting.group, [...(groups.get(setting.group) ?? []), setting]);
    }
    return [...groups].map(([name, listed]) => ({name, settings: listed, flags: listed.flatMap((setting) => [setting, ...childrenOf(settings, setting)]).filter((setting) => setting.type === "flag")}));
}
