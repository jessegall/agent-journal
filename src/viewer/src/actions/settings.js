import {api} from "../api/client.js";
import {settingChanges} from "../domain/settingsCatalog.js";
import {store} from "../state/store.js";

let latest = 0;

// the settings with the changes laid over them: a key sent as null is one going back to its default, so it leaves
function merged(settings, changes) {
    const next = {...settings};
    for (const [key, value] of Object.entries(changes)) {
        const plain = value && typeof value === "object" && !Array.isArray(value);
        next[key] = plain ? Object.fromEntries(Object.entries({...(settings[key] || {}), ...value}).filter(([, v]) => v !== null)) : value;
    }
    return next;
}

// the settings with what a refused save changed put back as it was before it, leaving whatever saved since
function undone(settings, before, changes) {
    const next = {...settings};
    for (const [key, value] of Object.entries(changes)) {
        const plain = value && typeof value === "object" && !Array.isArray(value);
        const changed = plain ? Object.keys(value).filter((name) => value[name] !== before[key]?.[name]) : [];
        next[key] = plain ? {...(settings[key] || {}), ...Object.fromEntries(changed.map((name) => [name, before[key]?.[name]]))} : before[key];
    }
    return next;
}

export async function saveSettings(changes, client = api) {
    if (client !== api || !store.settings) return client.saveSettings(changes);
    const before = store.settings;
    const mine = ++latest;
    store.settings = merged(before, changes);
    try {
        const saved = await client.saveSettings(changes);
        if (saved && mine === latest) store.settings = saved;
        return saved;
    } catch (error) {
        store.settings = undone(store.settings, before, changes);
        throw error;
    }
}

export function saveSetting(target, value) {
    return saveSettings(settingChanges(target, value, store.settings || {}));
}
