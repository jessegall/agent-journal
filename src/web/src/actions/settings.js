import {api} from "../api/client.js";
import {store} from "../state/store.js";

let latest = 0;

function merged(settings, changes) {
    const next = {...settings};
    for (const [key, value] of Object.entries(changes)) {
        const plain = value && typeof value === "object" && !Array.isArray(value);
        next[key] = plain ? {...(settings[key] || {}), ...value} : value;
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
        if (mine === latest) store.settings = before;
        throw error;
    }
}
