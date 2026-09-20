<script setup>
import UList from "./UList.vue";

import Section from "./Section.vue";

import {computed, onMounted, ref} from "vue";
import {act, api, command, saveIdentity, saveSettings} from "../api.js";
import Btn from "../kit/Btn.vue";
import Switch from "../kit/Switch.vue";
import {route} from "../route.js";
import {load, rows, store} from "../store.js";

const COUNTED = ["percent", "uses", "minutes"];
const EVENTS = ["idle", "worked", "start"];
const triggerOf = (f) => (store.settings && store.settings.triggers && store.settings.triggers[f.name]) || f.trigger;
const features = computed(() =>
    Object.values(store.spec.features).map((f) => ({...f, when: f.trigger && Object.keys(f.trigger).length ? triggerOf(f) : null}))
);
const on = (name) => !!(store.settings && store.settings.features[name]);
const source = ref("");
const shown = ref("");
const busy = ref("");
const plugins = computed(() => rows("plugin").filter((p) => !p.completed));
const stopping = ref(false);

async function stop() {
    stopping.value = true;
    try {
        await api("POST", "/stop", {});
    } catch (e) {
        stopping.value = false;
    }
}

async function preview() {
    busy.value = "preview";
    shown.value = "";
    try {
        shown.value = await command(route.value.env, "plugin", "preview", {source: source.value});
    } catch (e) {
        shown.value = e.message;
    }
    busy.value = "";
}

async function install() {
    busy.value = "install";
    try {
        await command(route.value.env, "plugin", "install", {source: source.value, yes: true});
        source.value = "";
        shown.value = "";
        await load("plugin");
    } catch (e) {
        shown.value = e.message;
    }
    busy.value = "";
}

async function plugin(p, action, body = {}) {
    busy.value = `${p.n}`;
    try {
        await act(route.value.env, "plugin", p.n, action, body);
        await load("plugin");
    } catch (e) {
        shown.value = e.message;
    }
    busy.value = "";
}

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
    const text = String(value)
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

async function saveColor(color) {
    store.identity = await saveIdentity({color});
}

async function remove(e) {
    await act(route.value.env, "environment", e.n, "remove", {how: "removed from the viewer"});
}
</script>

<template>
    <section class="settings">
        <section class="group">
            <header class="group-head">
                <h2>Project identity</h2>
                <p class="lead">The band across the viewer distinguishes this project from other open journals.</p>
            </header>
            <div class="row">
                <span class="text">
                    <span class="title">Color</span>
                    <span class="help">Defaults to a stable color chosen from the project name.</span>
                </span>
                <Section @save-color="saveColor" />
            </div>
        </section>
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
                <template v-if="extension && extension.available">
                    <span class="control">
                        <template v-if="extension.store">
                            <a class="download" :href="extension.store" target="_blank" rel="noopener">Add to Chrome</a>
                        </template>
                        <a class="download" href="/extension.zip">Download</a>
                    </span>
                </template>
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
                            <UList :f="f" @marks="marks" @every="every" @unit="unit" />
                        </template>
                    </span>
                    <span class="control">
                        <template v-if="f.fixed">
                            <span class="note">Always on</span>
                        </template>
                        <template v-else>
                            <Switch :on="on(f.name)" @change="(v) => flip(f.name, v)" />
                        </template>
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
        <section class="group">
            <header class="group-head">
                <h2>Stop</h2>
                <p class="lead">
                    This closes the viewer, ends the engine and takes down every service a plugin runs. The agent's terminal stops with
                    them. Nothing on the record is touched; start it again with journal claude.
                </p>
            </header>
            <div class="row">
                <span class="text">
                    <span class="title">Stop the journal</span>
                </span>
                <span class="control">
                    <Btn kind="danger" small :disabled="stopping" @click="stop">{{ stopping ? "Stopping…" : "Stop" }}</Btn>
                </span>
            </div>
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
    font-size: 12px;
    text-align: right;
}

.unit {
    color: var(--text-3);
    font-size: 12.5px;
}

.source {
    width: 100%;
    padding: 7px 10px;
    border: 1px solid var(--border-2);
    border-radius: 7px;
    background: var(--bg);
    color: inherit;
    font: inherit;
}

.preview {
    margin: 0 0 8px;
    padding: 10px 12px;
    max-height: 320px;
    overflow: auto;
    border: 1px solid var(--border-2);
    border-radius: 9px;
    background: var(--code-bg);
    font-family: ui-monospace, "SF Mono", Menlo, monospace;
    font-size: 12px;
    white-space: pre-wrap;
}

.none {
    margin: 0;
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

.color-control {
    min-width: 116px;
}

.color {
    width: 34px;
    height: 28px;
    padding: 2px;
    border: 1px solid var(--border-2);
    border-radius: 6px;
    background: var(--raised);
    cursor: pointer;
}
</style>
