import {computed} from "vue";
import {saveSettings} from "../actions/settings.js";
import {DEFAULT_MODE} from "../domain/modes.js";
import {store} from "../state/store.js";

export const feedOn = computed(() => !store.settings || store.settings.features.file_feed !== false);
export const boardOn = computed(() => !store.settings || store.settings.features.kanban !== false);
export const barOn = computed(() => !store.settings || store.settings.features.status_bar !== false);
export const familyOn = computed(() => !store.settings || store.settings.features.family_tree !== false);
export const steered = computed(() => (store.settings && store.settings.work_tracking && store.settings.work_tracking.steered) || "");
export const autoOn = computed(() => !!(store.settings && store.settings.features["work_tracking.auto"]) || !!steered.value);
export const workMode = computed(() => (store.settings && store.settings.work_modes && store.settings.work_modes.mode) || DEFAULT_MODE);
export const sharingOn = computed(() => !store.settings || store.settings.features.sharing !== false);
export const hostedOn = computed(() => Boolean(store.settings && store.settings.features.hosted_journal));
export const connectionOn = computed(() => Boolean(store.settings && store.settings.features.connection));
export const membersOn = computed(() => hostedOn.value && Boolean(store.settings.features.members));

const viewer = () => (store.settings && store.settings.viewer) || {};

export const viewerSetting = (key, fallback) => viewer()[key] ?? fallback;

export const settingsLoaded = () => Boolean(store.settings);

export async function saveViewerSetting(key, value) {
    await saveSettings({viewer: {[key]: value}});
}

export const agentRunningIn = (name) => store.online.some((agent) => agent.environment === name);
