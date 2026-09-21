import {computed} from "vue";
import {route} from "./route.js";
import {store} from "./state/store.js";

export const project = computed(() => (store.identity && store.identity.project) || route.value.env);
export const tint = computed(() => (store.identity && store.identity.color) || "#2a2c33");
export const ink = computed(() => {
    const hex = tint.value.replace("#", "");
    const full = hex.length === 3 ? [...hex].map((c) => c + c).join("") : hex;
    const [r, g, b] = [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16));
    return 0.299 * r + 0.587 * g + 0.114 * b > 150 ? "#111318" : "#ffffff";
});
export const many = computed(
    () => new Set(store.online.map((a) => a.environment)).size > 1 || store.journals.filter((j) => j.running).length > 1
);
export const negative = computed(() => {
    const hex = tint.value.replace("#", "");
    const full = hex.length === 3 ? [...hex].map((c) => c + c).join("") : hex;
    return `#${(0xffffff ^ parseInt(full, 16)).toString(16).padStart(6, "0")}`;
});
