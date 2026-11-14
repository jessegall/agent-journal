// A setting's value as its control shows it: what is stored may be JSON, or the default as the plugin wrote it.
export function shownValue(setting) {
    const {value} = setting;
    const parsed = typeof value === "string" && /^[[{"]|^(true|false)$/.test(value) ? JSON.parse(value) : value;
    if (Array.isArray(parsed)) return parsed.join("\n");
    return parsed === null || parsed === undefined ? "" : String(parsed);
}

export const isOn = (setting) => shownValue(setting) === "true";
