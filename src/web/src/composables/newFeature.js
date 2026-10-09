import {computed, ref} from "vue";
import {api} from "../api/client.js";
import {loadProfiles, profiles, profilesLoaded, useProfile} from "./profiles.js";

const queue = ref([]);

export const newFeature = computed(() => queue.value[0] || null);

export async function loadNewFeatures() {
    const found = await api.newFeatures().catch(() => []);
    queue.value = Array.isArray(found) ? found : [];
}

export function dismissNewFeature() {
    const [shown, ...later] = queue.value;
    if (!shown) return;
    queue.value = later;
    api.markNewFeatureSeen(shown.id).catch(() => {});
}

export async function useNewFeature() {
    const found = newFeature.value;
    if (found.profile) {
        if (!profilesLoaded.value) await loadProfiles();
        const row = profiles.value.find((one) => one.title === found.profile);
        if (row) await useProfile(row);
    }
    dismissNewFeature();
}
