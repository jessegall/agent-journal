import {computed} from "vue";
import {api} from "../api/client.js";
import {store} from "../state/store.js";
import {COUNTED, EVENTS} from "./cadence.js";

const saved = (key) => (store.settings && store.settings[key]) || {};
const triggerOf = (name, declared) => saved("triggers")[name] || declared;
const spoken = (trigger) => trigger && Object.keys(trigger).length;

export const features = computed(() =>
    Object.values(store.spec.features).map((f) => ({
        ...f,
        when: spoken(f.trigger) ? triggerOf(f.name, f.trigger) : null,
        parts: Object.entries(f.behaviours || {}).map(([key, b]) => ({
            ...b,
            name: `${f.name}.${key}`,
            when: spoken(b.trigger) ? triggerOf(`${f.name}.${key}`, b.trigger) : null,
        })),
        lines: Object.entries(f.lines || {}).map(([key, line]) => ({key, ...line})),
    }))
);

export function on(name, fallback = false) {
    const set = saved("features");
    return name in set ? !!set[name] : fallback;
}

export async function flip(name, value) {
    await api.saveSettings({features: {...saved("features"), [name]: value}});
}

async function setTrigger(f, next) {
    await api.saveSettings({triggers: {...saved("triggers"), [f.name]: next}});
}

export function every(f, value) {
    const n = Number(value);
    if (n > 0) setTrigger(f, {every: n, unit: COUNTED.includes(f.when.unit) ? f.when.unit : "percent"});
}

export function unit(f, u) {
    setTrigger(f, EVENTS.includes(u) ? {on: u} : {every: f.when.every || (u === "minutes" ? 5 : 10), unit: u});
}

export function marks(f, value) {
    const at = String(value)
        .split(/[\s,]+/)
        .map(Number)
        .filter((n) => n > 0 && n <= 100);
    if (at.length) setTrigger(f, {unit: "percent", at});
}
