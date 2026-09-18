<script setup>
import {computed, ref} from "vue";
import {act, saveSettings} from "../api.js";
import Btn from "../kit/Btn.vue";
import Toggle from "../kit/Toggle.vue";
import {route} from "../route.js";
import {load, reload, rows, store} from "../store.js";

const features = computed(() => Object.values(store.spec.features));
const on = (name) => !!(store.settings && store.settings.features[name]);
const keep = computed(() => (store.settings && store.settings.keep) || {});
const days = ref({});
const envs = computed(() => rows("environment").filter((e) => !e.completed));

async function flip(name, value) {
    await saveSettings(route.value.env, {features: {...store.settings.features, [name]: value}});
    await reload();
}

async function setKeep(type) {
    await saveSettings(route.value.env, {keep: {...keep.value, [type]: Number(days.value[type])}});
    await reload();
}

async function remove(e) {
    await act(route.value.env, "environment", e.n, "remove", {how: "removed from the viewer"});
    await load("environment");
}
</script>

<template>
    <section class="settings">
        <h2>Features on {{ route.env }}</h2>
        <p class="lead">Each is a switch; its trigger says when it speaks to the agent.</p>
        <div v-for="f in features" :key="f.name" class="feature">
            <Toggle :on="on(f.name)" @change="(v) => flip(f.name, v)" />
            <span class="ftext">
                <span class="ftitle">{{ f.title }}</span>
                <span class="fabs">{{ f.abstract }}</span>
                <span v-if="Object.keys(f.trigger).length" class="ftrig">
                    {{
                        f.trigger.on
                            ? `on ${f.trigger.on}`
                            : f.trigger.at
                              ? `at ${f.trigger.at.join(", ")} percent`
                              : `every ${f.trigger.every} ${f.trigger.unit}`
                    }}
                </span>
            </span>
        </div>
        <h2>Keep</h2>
        <div v-for="type in ['report', 'todo']" :key="type" class="keep">
            <span class="ktext">{{ type }}s are archived after</span>
            <input
                v-model="days[type]"
                type="number"
                min="0"
                :placeholder="String(keep[type] ?? (type === 'report' ? 14 : 7))"
                @change="setKeep(type)"
            />
            <span class="ktext">days; 0 keeps them listed</span>
        </div>
        <h2>Environments</h2>
        <div v-for="e in envs" :key="e.n" class="env">
            <span class="etitle">{{ e.title }}</span>
            <Btn kind="danger" small :disabled="e.title === route.env" @click="remove(e)">Remove</Btn>
        </div>
    </section>
</template>

<style scoped>
.settings {
    max-width: 720px;
    padding: 22px 28px 60px;
}

h2 {
    margin: 22px 0 4px;
    font-size: 15px;
    font-weight: 600;
}

.lead {
    margin: 0 0 12px;
    color: var(--text-3);
}

.feature {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    padding: 10px 0;
    border-bottom: 1px solid var(--border);
}

.ftext {
    display: flex;
    flex-direction: column;
}

.ftitle {
    font-weight: 500;
}

.fabs {
    color: var(--text-2);
}

.ftrig {
    color: var(--text-3);
    font-size: 12px;
}

.keep {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 6px 0;
    color: var(--text-2);
}

.keep input {
    width: 64px;
    padding: 4px 8px;
    border: 1px solid var(--border-2);
    border-radius: 6px;
    background: var(--raised);
}

.env {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 0;
    border-bottom: 1px solid var(--border);
}
</style>
