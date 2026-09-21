import {computed} from "vue";
import {route} from "./route.js";
import {store} from "./state/store.js";

export const project = computed(() => (store.identity && store.identity.project) || route.value.env);
export const tint = computed(() => (store.identity && store.identity.color) || "#2a2c33");
export const negative = computed(() => {
    const hex = tint.value.replace("#", "");
    const full = hex.length === 3 ? [...hex].map((c) => c + c).join("") : hex;
    return `#${(0xffffff ^ parseInt(full, 16)).toString(16).padStart(6, "0")}`;
});
