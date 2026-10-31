import {ref} from "vue";
import {remember, remembered, rememberedInTab, rememberInTab} from "../platform/storage.js";

const KEY = "journal.environment";

// Each tab keeps its own environment, so two tabs can show two; a new tab opens on the last one chosen in any tab.
export const environment = ref(rememberedInTab(KEY, remembered(KEY, "")));

export function choose(name) {
    environment.value = name;
    rememberInTab(KEY, name);
    remember(KEY, name);
}
