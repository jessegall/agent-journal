import {api} from "../api/client.js";
import {store} from "../state/store.js";

const viewer = () => (store.settings && store.settings.viewer) || {};

export const viewerSetting = (key, fallback) => viewer()[key] ?? fallback;

export const settingsLoaded = () => Boolean(store.settings);

export async function saveViewerSetting(key, value) {
    const next = {...viewer(), [key]: value};
    if (store.settings) store.settings = {...store.settings, viewer: next};
    await api.saveSettings({viewer: next});
}
