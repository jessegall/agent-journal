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

const UNIT_WORDS = {percent: "% of the context window", uses: "tool calls", minutes: "minutes"};
const EVENT_WORDS = {
    idle: "each time the agent comes to rest",
    worked: "when the agent comes to rest after working",
    start: "when a session starts",
};

const listed = (numbers) => (numbers.length > 1 ? `${numbers.slice(0, -1).join(", ")} and ${numbers.at(-1)}` : String(numbers[0]));

export function whenWords(when) {
    if (!when) return "";
    if (when.on) return EVENT_WORDS[when.on] || when.on;
    if (when.at) return `at ${listed(when.at)}${UNIT_WORDS.percent}`;
    return when.unit === "percent"
        ? `every ${when.every}${UNIT_WORDS.percent}`
        : `every ${when.every} ${UNIT_WORDS[when.unit] || when.unit}`;
}

const sameTrigger = (a, b) => JSON.stringify(a, Object.keys(a).sort()) === JSON.stringify(b, Object.keys(b).sort());

function cadenceChanged(name, declared) {
    const set = saved("triggers");
    return name in set && !sameTrigger(set[name], declared || {});
}

function settingChanged(f, setting) {
    const set = saved(f.name);
    return setting.name in set && JSON.stringify(set[setting.name]) !== JSON.stringify(setting.default);
}

export function changed(f) {
    if (!f.fixed && on(f.name, f.default) !== f.default) return true;
    if (cadenceChanged(f.name, f.trigger)) return true;
    if (f.parts.some((part) => on(part.name, part.default) !== part.default || cadenceChanged(part.name, part.trigger))) return true;
    return (f.settings || []).some((setting) => settingChanged(f, setting));
}

export const isOn = (f) => f.fixed || on(f.name, f.default);

export function haystack(f) {
    return [
        f.title,
        f.abstract,
        f.help,
        ...(f.keywords || []),
        ...f.parts.map((part) => `${part.title} ${part.abstract || ""}`),
        ...(f.settings || []).map((setting) => setting.title),
    ]
        .join(" ")
        .toLowerCase();
}

export const matches = (text, query) =>
    query
        .toLowerCase()
        .split(/\s+/)
        .filter(Boolean)
        .every((word) => text.toLowerCase().includes(word));
