import {DEFAULT_MODE} from "../domain/modes.js";
import {computed} from "vue";
import {store} from "../state/store.js";

export const feedOn = computed(() => !store.settings || store.settings.features.file_feed !== false);
export const barOn = computed(() => !store.settings || store.settings.features.status_bar !== false);
export const workMode = computed(() => (store.settings && store.settings.workers && store.settings.workers.mode) || DEFAULT_MODE);
export const autoOn = computed(() => !store.settings || !store.settings.tasks || store.settings.tasks.auto !== false);
export const reviewerOn = computed(() => Boolean(store.settings && store.settings.reviewing && store.settings.reviewing.reviewer));
export const sharingOn = computed(() => !store.settings || store.settings.features.sharing !== false);

const viewer = () => (store.settings && store.settings.viewer) || {};

export const viewerSetting = (key, fallback) => viewer()[key] ?? fallback;

export const settingsLoaded = () => Boolean(store.settings);

export const agentRunningIn = (name) => store.live.some((live) => live.environment === name);
