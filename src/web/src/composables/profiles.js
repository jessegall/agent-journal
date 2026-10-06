import {computed, ref} from "vue";
import {saveSettings} from "../actions/settings.js";
import {api} from "../api/client.js";
import {store} from "../state/store.js";
import {words} from "./helperWords.js";

export const profiles = ref([]);
export const callings = ref({});
export const samples = ref({});

const form = () => (store.settings && store.settings.form_of_address) || {};

export const profileInUse = computed(() => Number(form().profile) || 0);
export const profileChosen = computed(() => Boolean(store.settings) && profileInUse.value > 0);
export const unchosen = computed(() => Boolean(store.settings) && !profileInUse.value);
export const butler = computed(() => profiles.value.find((row) => row.data.system && row.title === "Butler") || null);
export const firstChoice = computed(() => unchosen.value && butler.value !== null);
export const standing = computed(() => profiles.value.find((row) => row.n === profileInUse.value) || butler.value);

export const person = computed(() => `${form().title}|${form().first_name}`);

export const calls = (row) => callings.value[row.data.calling] || "";

export const sampleOf = (row) => samples.value[row.n] ?? row.data.sample;

export const loadWords = async () => {
    words.value = await api.profileWords();
};

export async function loadProfiles() {
    const [rows, names, lines] = await Promise.all([api.profiles(), api.profileCallings(), api.profileSamples(), loadWords()]);
    profiles.value = rows.filter((row) => !row.deleted);
    callings.value = names;
    samples.value = lines;
}

export const useProfile = (row) => saveSettings({form_of_address: {...form(), profile: row.n}});

export const deleteReason = (row) => {
    if (row.data.system) return "Built in, so it can't be deleted.";
    return row.n === profileInUse.value ? "It is in use. Use another profile first." : "";
};
