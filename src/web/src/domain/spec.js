import {computed} from "vue";
import {store} from "../state/store.js";

export const types = computed(() => (store.spec ? store.spec.priority.map((t) => ({name: t, ...store.spec.types[t]})) : []));
export const meta = (type) => store.spec.types[type];
export const word = (type, method) => meta(type).command_names[method] || method;
export const label = (type, field, fallback) => meta(type).labels[field] || fallback;
