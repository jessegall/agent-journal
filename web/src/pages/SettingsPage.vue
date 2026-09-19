<script setup>
import {computed, onMounted, ref} from "vue";
import {act, api, saveSettings} from "../api.js";
import Btn from "../kit/Btn.vue";
import Switch from "../kit/Switch.vue";
import {route} from "../route.js";
import {rows, store} from "../store.js";

const COUNTED = ["percent", "uses", "minutes"];
const EVENTS = ["idle", "worked", "start"];
const triggerOf = (f) => (store.settings && store.settings.triggers && store.settings.triggers[f.name]) || f.trigger;
const features = computed(() =>
    Object.values(store.spec.features).map((f) => ({...f, when: f.trigger && Object.keys(f.trigger).length ? triggerOf(f) : null}))
);
const on = (name) => !!(store.settings && store.settings.features[name]);

async function setTrigger(f, next) {
    await saveSettings(route.value.env, {triggers: {...((store.settings && store.settings.triggers) || {}), [f.name]: next}});
}

function every(f, value) {
    const t = triggerOf(f);
    const n = Number(value);
    if (n > 0) setTrigger(f, {every: n, unit: COUNTED.includes(t.unit) ? t.unit : "percent"});
}

function unit(f, u) {
    const t = triggerOf(f);
    setTrigger(f, EVENTS.includes(u) ? {on: u} : {every: t.every || (u === "minutes" ? 5 : 10), unit: u});
}

function marks(f, value) {
    const at = String(value)
        .split(/[\s,]+/)
        .map(Number)
        .filter((n) => n > 0 && n <= 100);
    if (at.length) setTrigger(f, {unit: "percent", at});
}
const retention = computed(() => (store.settings && store.settings.keep) || {});
const days = ref({});
const envs = computed(() => rows("environment").filter((e) => !e.completed));
const extension = ref(null);

onMounted(async () => {
    extension.value = await api("GET", "/extension");
});

async function flip(name, value) {
    await saveSettings(route.value.env, {features: {...store.settings.features, [name]: value}});
}

async function saveRetention(type) {
    await saveSettings(route.value.env, {keep: {...retention.value, [type]: Number(days.value[type])}});
}

async function remove(e) {
    await act(route.value.env, "environment", e.n, "remove", {how: "removed from the viewer"});
}
</script>

<template>
    <section class="settings">
        <section class="group">
            <header class="group-head">
                <h2>Chrome extension</h2>
                <p class="lead">Float the chat over any page, point at elements, send pictures, and let the agent drive the tab.</p>
            </header>
            <div class="row">
                <span class="text">
                    <span class="title">Agent journal for Chrome</span>
                    <span class="help">The unpacked extension is served from this exact journal version.</span>
                </span>
                <span v-if="extension && extension.available" class="control">
                    <a v-if="extension.store" class="download" :href="extension.store" target="_blank" rel="noopener">Add to Chrome</a>
                    <a class="download" href="/extension.zip">Download</a>
                </span>
            </div>
        </section>
        <section class="group">
            <header class="group-head">
                <h2>Features on {{ route.env }}</h2>
                <p class="lead">Each is a switch; its trigger says when it speaks to the agent.</p>
            </header>
            <template v-for="f in features" :key="f.name">
                <div class="row">
                    <span class="text">
                        <span class="title">{{ f.title }}</span>
                        <span class="help">{{ f.abstract }}</span>
                        <template v-if="f.when">
                            <span class="cadence">
                                <template v-if="f.when.at">
                                    <span class="note">at</span>
                                    <input class="days marks" :value="f.when.at.join(', ')" @change="marks(f, $event.target.value)" />
                                    <span class="note">percent</span>
                                </template>
                                <template v-else-if="f.when.on">
                                    <span class="note">on</span>
                                </template>
                                <template v-else>
                                    <span class="note">every</span>
                                    <input
                                        class="days"
                                        type="number"
                                        min="1"
                                        :value="f.when.every"
                                        @change="every(f, $event.target.value)"
                                    />
                                </template>
                                <span class="units">
                                    <template v-for="u in [...COUNTED, ...EVENTS]" :key="u">
                                        <button
                                            type="button"
                                            :class="['unit-pick', {on: f.when.on ? f.when.on === u : f.when.unit === u}]"
                                            @click="unit(f, u)"
                                        >
                                            {{ u }}
                                        </button>
                                    </template>
                                </span>
                            </span>
                        </template>
                    </span>
                    <span class="control">
                        <span v-if="f.fixed" class="note">Always on</span>
                        <Switch v-else :on="on(f.name)" @change="(v) => flip(f.name, v)" />
                    </span>
                </div>
            </template>
        </section>
        <section class="group">
            <header class="group-head">
                <h2>Keep</h2>
                <p class="lead">How long a finished row stays listed before it is archived; 0 keeps it.</p>
            </header>
            <template v-for="type in ['report', 'todo']" :key="type">
                <div class="row">
                    <span class="text">
                        <span class="title">{{ type }}s</span>
                        <span class="help">archived this many days after they are done</span>
                    </span>
                    <span class="control">
                        <input
                            v-model="days[type]"
                            class="days"
                            type="number"
                            min="0"
                            :placeholder="String(retention[type] ?? (type === 'report' ? 14 : 7))"
                            @change="saveRetention(type)"
                        />
                        <span class="unit">days</span>
                    </span>
                </div>
            </template>
        </section>
        <section class="group">
            <header class="group-head">
                <h2>Environments</h2>
                <p class="lead">Removing one keeps its record on disk; it leaves the sidebar.</p>
            </header>
            <template v-for="e in envs" :key="e.n">
                <div class="row">
                    <span class="text">
                        <span class="title">{{ e.title }}</span>
                    </span>
                    <span class="control">
                        <Btn kind="danger" small :disabled="e.title === route.env" @click="remove(e)">Remove</Btn>
                    </span>
                </div>
            </template>
        </section>
    </section>
</template>

<style scoped>
.settings {
    max-width: 720px;
    padding: 22px 28px 60px;
}

.group + .group {
    margin-top: 32px;
}

.group-head {
    margin-bottom: 4px;
}

h2 {
    margin: 0 0 3px;
    font-size: 15px;
    font-weight: 600;
}

.lead {
    margin: 0;
    color: var(--text-3);
    font-size: 12.5px;
}

.row {
    display: flex;
    align-items: center;
    gap: 16px;
    min-height: 52px;
    padding: 10px 0;
    border-bottom: 1px solid var(--border);
}

.text {
    flex: 1 1 auto;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 2px;
}

.title {
    font-weight: 500;
}

.help {
    color: var(--text-2);
    font-size: 12.5px;
}

.note {
    color: var(--text-3);
    font-size: 12px;
}

.control {
    flex: none;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 8px;
    min-width: 96px;
}

.cadence {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 6px;
    margin-top: 6px;
}

.cadence .days {
    height: 24px;
}

.marks {
    width: 96px;
}

.units {
    display: inline-flex;
    gap: 2px;
    margin-left: 4px;
}

.unit-pick {
    padding: 2px 7px;
    border: 1px solid var(--border-2);
    border-radius: 6px;
    background: none;
    color: var(--text-3);
    font-size: 11px;
    cursor: pointer;
}

.unit-pick.on {
    border-color: color-mix(in srgb, var(--accent) 55%, transparent);
    background: color-mix(in srgb, var(--accent) 18%, transparent);
    color: var(--text);
}

.days {
    width: 64px;
    height: 28px;
    padding: 0 8px;
    border: 1px solid var(--border-2);
    border-radius: 6px;
    background: var(--raised);
    color: var(--text);
    text-align: right;
}

.unit {
    color: var(--text-3);
    font-size: 12.5px;
}

.download {
    height: 28px;
    padding: 4px 10px;
    border: 1px solid var(--border-2);
    border-radius: 6px;
    color: var(--text);
    text-decoration: none;
}

.download:hover {
    background: var(--hover);
}
</style>
