import {computed, ref} from "vue";
import {saveSettings} from "../actions/settings.js";
import {api} from "../api/client.js";
import {store} from "../state/store.js";

export const profiles = ref([]);
export const callings = ref({});

const form = () => (store.settings && store.settings.form_of_address) || {};

export const profileInUse = computed(() => Number(form().profile) || 0);
export const profileChosen = computed(() => Boolean(store.settings) && profileInUse.value > 0);
export const unchosen = computed(() => Boolean(store.settings) && !profileInUse.value);
export const butler = computed(() => profiles.value.find((row) => row.data.system && row.title === "Butler") || null);
export const firstChoice = computed(() => unchosen.value && butler.value !== null);
export const standing = computed(() => profiles.value.find((row) => row.n === profileInUse.value) || butler.value);

export const calls = (row) => callings.value[row.data.calling] || "";

export const sampleOf = (row) => row.data.sample.replaceAll("{you}", calls(row) || callings.value.name || "");

export async function loadProfiles() {
    const [rows, names] = await Promise.all([api.profiles(), api.profileCallings()]);
    profiles.value = rows.filter((row) => !row.deleted);
    callings.value = names;
}

export const useProfile = (row) => saveSettings({form_of_address: {...form(), profile: row.n}});

export const deleteReason = (row) => {
    if (row.data.system) return "Ships with the journal, so it can't be deleted.";
    return row.n === profileInUse.value ? "It is in use. Use another profile first." : "";
};
