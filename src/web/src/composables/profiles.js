import {computed, ref} from "vue";
import {saveSettings} from "../actions/settings.js";
import {api} from "../api/client.js";
import {store} from "../state/store.js";

export const profiles = ref([]);
export const profilesLoaded = ref(false);
export const callings = ref({});
export const samples = ref({});
export const namings = ref([]);

// the voice settings: the profile is a voice's name, butler unless chosen, so a voice is always in use
const voices = () => (store.settings && store.settings.voices) || {};
const voiceInUse = () => voices().profile || "butler";

export const profileInUse = computed(() => (profiles.value.find((row) => row.data.voice === voiceInUse()) || {n: 0}).n);
export const profileChosen = computed(() => Boolean(store.settings));
export const unchosen = computed(() => false);
export const butler = computed(() => profiles.value.find((row) => row.data.system && row.title === "Butler") || null);
export const firstChoice = computed(() => false);
export const standing = computed(() => profiles.value.find((row) => row.n === profileInUse.value) || butler.value);

export const person = computed(() => `${voices().title}|${voices().name}`);

export const voiceOf = (row) => row.data.voice;

export const avatarOn = computed(() => Boolean(store.settings?.features?.avatar));

// the voice whose figure stands on the chat, or none while the avatar is off or the profile names no voice
export const figureVoice = computed(() => (avatarOn.value && standing.value?.data.voice) || "");

export const calls = (row) => callings.value[row.data.calling] || row.data.address || "";

export const sampleOf = (row) => samples.value[row.n] ?? row.data.sample;

export const introductionOf = (row) => row.data.introduction || sampleOf(row);

let loading = null;

export function loadProfiles() {
    loading ||= fetchProfiles().finally(() => {
        loading = null;
    });
    return loading;
}

// how long to wait before trying the profiles again after a failed load, doubling up to the last; a server restart is normal here
const RETRY_MS = [1000, 2000, 4000, 8000, 15000, 30000];

// Loads the profiles and, when the load fails, tries again until it succeeds, so the voice's figure comes back after a restart
export function loadProfilesUntilLoaded(tries = 0) {
    return loadProfiles().catch(() => setTimeout(() => loadProfilesUntilLoaded(tries + 1), RETRY_MS[Math.min(tries, RETRY_MS.length - 1)]));
}

async function fetchProfiles() {
    const [rows, names, lines, styles] = await Promise.all([
        api.profiles(),
        api.profileCallings(),
        api.profileSamples(),
        api.profileNamings(),
    ]);
    profiles.value = rows.filter((row) => !row.deleted);
    profilesLoaded.value = true;
    callings.value = names;
    samples.value = lines;
    namings.value = styles;
}

export async function useProfile(row) {
    store.settings ||= await api.settings();
    return saveSettings({voices: {...voices(), profile: row.data.voice}});
}

export const deleteReason = (row) => {
    if (row.data.system) return "Built in, so it can't be deleted.";
    return row.n === profileInUse.value ? "It is in use. Use another profile first." : "";
};
