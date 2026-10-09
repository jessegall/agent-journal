import {computed, ref} from "vue";
import {api} from "../api/client.js";
import {report} from "../platform/faults.js";
import {remember, remembered} from "../platform/storage.js";
import {loadProfiles, profiles, profilesLoaded, useProfile} from "./profiles.js";

export const UNSENT_KEY = "journal.new-feature.unsent";

const queue = ref([]);

export const newFeature = computed(() => queue.value[0] || null);

async function told(id) {
    try {
        await api.markNewFeatureSeen(id);
    } catch (error) {
        remember(UNSENT_KEY, [...new Set([...remembered(UNSENT_KEY, []), id])]);
        report("threw", error.message, "POST /api/new-feature");
        return;
    }
    remember(UNSENT_KEY, remembered(UNSENT_KEY, []).filter((one) => one !== id));
}

export async function loadNewFeatures() {
    await Promise.all(remembered(UNSENT_KEY, []).map(told));
    const unsent = remembered(UNSENT_KEY, []);
    const found = await api.newFeatures().catch(() => []);
    queue.value = (Array.isArray(found) ? found : []).filter((one) => !unsent.includes(one.id)).map((one) => ({...one, art: one.art ? api.publicUrl(one.art) : ""}));
}

export function dismissNewFeature() {
    const [shown, ...later] = queue.value;
    if (!shown) return;
    queue.value = later;
    return told(shown.id);
}

export async function useNewFeature() {
    const found = newFeature.value;
    const noted = dismissNewFeature();
    if (found.profile) {
        if (!profilesLoaded.value) await loadProfiles();
        const row = profiles.value.find((one) => one.title === found.profile);
        if (row) await useProfile(row);
    }
    await noted;
}
