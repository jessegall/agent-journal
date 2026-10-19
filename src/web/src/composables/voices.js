import {computed, ref} from "vue";
import {api} from "../api/client.js";
import {store} from "../state/store.js";

// The voices the agent can talk in, each with a sample in the words it calls the user by, and the one chosen.
export const voices = ref([]);
export const voicesLoaded = ref(false);
export const callings = ref({});
export const namings = ref([]);

export const voiceInUse = computed(() => voices.value.find((voice) => voice.chosen) || voices.value[0] || null);

export const person = computed(() => `${store.settings?.voices?.title}|${store.settings?.voices?.name}`);

export const avatarOn = computed(() => Boolean(store.settings) && store.settings.voices?.avatar !== false);

// the voice whose figure stands on the chat, or none while the avatar is off
export const figureVoice = computed(() => (avatarOn.value && voiceInUse.value?.name) || "");

export const voiceTitle = (voice) => voice.name.charAt(0).toUpperCase() + voice.name.slice(1);

export const calls = (voice) => callings.value[voice.calling] || voice.address || "";

let loading = null;

export function loadVoices() {
    loading ||= fetchVoices().finally(() => {
        loading = null;
    });
    return loading;
}

// how long to wait before trying the voices again after a failed load, doubling up to the last; a server restart is normal here
const RETRY_MS = [1000, 2000, 4000, 8000, 15000, 30000];

// Loads the voices and, when the load fails, tries again until it succeeds, so the voice's figure comes back after a restart
export function loadVoicesUntilLoaded(tries = 0) {
    return loadVoices().catch(() => setTimeout(() => loadVoicesUntilLoaded(tries + 1), RETRY_MS[Math.min(tries, RETRY_MS.length - 1)]));
}

function take(got) {
    voices.value = got.voices;
    callings.value = got.callings;
    namings.value = got.namings;
    voicesLoaded.value = true;
}

async function fetchVoices() {
    take(await api.voices());
}

export async function chooseVoice(voice) {
    take(await api.chooseVoice(voice.name));
}
