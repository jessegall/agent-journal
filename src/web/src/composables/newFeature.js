import {ref} from "vue";
import {api} from "../api/client.js";
import {remember, remembered} from "../platform/storage.js";
import {loadProfiles, profiles, profilesLoaded, useProfile} from "./profiles.js";

export const SEEN_KEY = "journal.new-feature.seen";

export const newFeature = ref(null);

export async function loadNewFeature() {
    const found = await api.newFeature().catch(() => null);
    if (found && found.id && !remembered(SEEN_KEY, []).includes(found.id)) newFeature.value = found;
}

export function dismissNewFeature() {
    if (!newFeature.value) return;
    remember(SEEN_KEY, [...remembered(SEEN_KEY, []), newFeature.value.id]);
    newFeature.value = null;
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
