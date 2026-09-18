<script setup>
import {computed, ref} from "vue";
import {act, saveSettings} from "../api.js";
import Btn from "../kit/Btn.vue";
import Switch from "../kit/Switch.vue";
import {route} from "../route.js";
import {rows, store} from "../store.js";

const triggerText = (t) => (t.on ? `on ${t.on}` : t.at ? `at ${t.at.join(", ")} percent` : t.every ? `every ${t.every} ${t.unit}` : "");
const features = computed(() => Object.values(store.spec.features).map((f) => ({...f, when: triggerText(f.trigger)})));
const on = (name) => !!(store.settings && store.settings.features[name]);
const retention = computed(() => (store.settings && store.settings.keep) || {});
const days = ref({});
const envs = computed(() => rows("environment").filter((e) => !e.completed));

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
                <h2>Features on {{ route.env }}</h2>
                <p class="lead">Each is a switch; its trigger says when it speaks to the agent.</p>
            </header>
            <template v-for="f in features" :key="f.name">
                <div class="row">
                    <span class="text">
                        <span class="title">{{ f.title }}</span>
                        <span class="help">{{ f.abstract }}</span>
                        <template v-if="f.when">
                            <span class="note">{{ f.when }}</span>
                        </template>
                    </span>
                    <span class="control">
                        <Switch :on="on(f.name)" @change="(v) => flip(f.name, v)" />
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
</style>
