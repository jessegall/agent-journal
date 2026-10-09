import {computed, ref} from "vue";
import {saveSettings} from "../actions/settings.js";
import {api} from "../api/client.js";
import {isAct, isBlink, placeOf, placedAt} from "../domain/mascots.js";
import {store} from "../state/store.js";
import {animations, loadAnimations, scheduleOf, urlOf} from "./voiceAnimations.js";
import {voiceOfArt} from "./voiceRigs.js";

export const profiles = ref([]);
export const profilesLoaded = ref(false);
export const callings = ref({});
export const samples = ref({});
export const namings = ref([]);

const form = () => (store.settings && store.settings.form_of_address) || {};

export const profileInUse = computed(() => Number(form().profile) || 0);
export const profileChosen = computed(() => Boolean(store.settings) && profileInUse.value > 0);
export const unchosen = computed(() => Boolean(store.settings) && !profileInUse.value);
export const butler = computed(() => profiles.value.find((row) => row.data.system && row.title === "Butler") || null);
export const firstChoice = computed(() => unchosen.value && butler.value !== null);
export const standing = computed(() => profiles.value.find((row) => row.n === profileInUse.value) || butler.value);

export const person = computed(() => `${form().title}|${form().first_name}`);

export const artOf = (row) => (row.data.art ? api.publicUrl(`voices/${row.data.art}`) : "");

export const mascotOn = computed(() => form().mascot !== false);

export const mascotOf = computed(() => {
    const row = standing.value;
    if (!mascotOn.value || !row?.data.art) return null;
    const all = animations.value[row.n] || [];
    const sheet = (animation) => ({url: urlOf(row.n, animation), edit: animation.edit, path: animation.path});
    const blink = all.find(isBlink);
    return {voice: voiceOfArt(row.data.art), blink: blink ? sheet(blink) : null, acts: all.filter(isAct).map(sheet), schedule: scheduleOf(row.n), place: placedAt(placeOf(row.data.art), scheduleOf(row.n).place)};
});

export const calls =(row) => callings.value[row.data.calling] || row.data.address || "";

export const sampleOf = (row) => samples.value[row.n] ?? row.data.sample;

export const introductionOf = (row) => row.data.introduction || sampleOf(row);

export async function loadProfiles() {
    const [rows, names, lines, styles] = await Promise.all([api.profiles(), api.profileCallings(), api.profileSamples(), api.profileNamings(), loadAnimations()]);
    profiles.value = rows.filter((row) => !row.deleted);
    profilesLoaded.value = true;
    callings.value = names;
    samples.value = lines;
    namings.value = styles;
}

export async function useProfile(row) {
    store.settings ||= await api.settings();
    return saveSettings({form_of_address: {...form(), profile: row.n}});
}

export const deleteReason = (row) => {
    if (row.data.system) return "Built in, so it can't be deleted.";
    return row.n === profileInUse.value ? "It is in use. Use another profile first." : "";
};
