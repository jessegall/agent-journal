<script setup>
import {computed, onMounted, onUnmounted, ref} from "vue";
import {Segmented, Skeleton, useRows} from "@journal/window-kit";
import SettingNode from "./SettingNode.vue";

const DEFAULT_SOURCE = "default";
const TYPING = "input,textarea,select,[contenteditable]";
const {rows, failure, loaded, load, context} = useRows("setting tree", ["setting.*"]);
const query = ref("");
const filter = ref("all");
const field = ref(null);
const listed = computed(() => rows.value.filter((row) => !row.key.endsWith(".*")));
const isChanged = (row) => row.type !== "group" && row.source !== DEFAULT_SOURCE;
const isOff = (row) => row.value === false;
const FILTERS = {all: () => true, changed: isChanged, off: isOff};
const filters = computed(() => [
    {key: "all", label: "All"},
    {key: "changed", label: "Changed", title: "Settings you changed from their default", count: listed.value.filter(isChanged).length},
    {key: "off", label: "Off", count: listed.value.filter(isOff).length},
]);
// a search keeps each setting whose title, description or key has the words, and the groups above it
const shown = computed(() => {
    const wanted = query.value.trim().toLowerCase();
    if (!wanted && filter.value === "all") return listed.value;
    const hits = listed.value.filter((row) => FILTERS[filter.value](row) && [row.title, row.description, row.key].join(" ").toLowerCase().includes(wanted));
    const keys = new Set(hits.map((row) => row.key));
    for (const row of hits) {
        for (let up = listed.value.find((other) => other.key === row.parent); up; up = listed.value.find((other) => other.key === up.parent)) keys.add(up.key);
    }
    return listed.value.filter((row) => keys.has(row.key));
});
const tops = computed(() => shown.value.filter((row) => row.parent === null));
const modules = computed(() => [...new Set(tops.value.map((row) => row.module))]);
const readOnly = context.face === "phone";

function heading(module) {
    const parts = module.split(".");
    const name = parts[parts.length - 1].replace(/[-_]/g, " ");
    return name.slice(0, 1).toUpperCase() + name.slice(1);
}

function jump(module) {
    document.querySelector(`[data-module="${module}"]`)?.scrollIntoView({block: "start"});
}

function slashFocus(event) {
    if (event.key !== "/" || event.target.closest?.(TYPING)) return;
    event.preventDefault();
    field.value?.focus();
}
onMounted(() => window.addEventListener("keydown", slashFocus));
onUnmounted(() => window.removeEventListener("keydown", slashFocus));

async function saved(words) {
    const result = await context.run(words);
    if (result.ok) load();
    return result;
}
</script>

<template>
    <div class="settings">
        <div class="settings-bar">
            <label class="settings-search">
                <input ref="field" v-model="query" class="settings-search-field" type="search" placeholder="Find a setting" aria-label="Find a setting" @keydown.esc="query = ''" />
            </label>
            <Segmented :options="filters" :value="filter" data-settings-filter @pick="filter = $event" />
            <span class="settings-saved">Changes are saved as you make them</span>
        </div>
        <template v-if="!loaded">
            <Skeleton shape="text" />
        </template>
        <template v-else-if="failure">
            <p class="settings-failure">{{ failure }}</p>
        </template>
        <template v-else-if="loaded && !rows.length">
            <p class="settings-empty">No module declares a setting.</p>
        </template>
        <div class="settings-body">
            <nav class="settings-nav" aria-label="Modules">
                <template v-for="module in modules" :key="module">
                    <button type="button" class="settings-nav-item" :data-jump="module" @click="jump(module)">{{ heading(module) }}</button>
                </template>
            </nav>
            <div class="settings-sections">
                <template v-for="module in modules" :key="module">
                    <section class="settings-module" :data-module="module">
                        <h3 class="settings-module-heading">{{ heading(module) }}</h3>
                        <template v-for="row in tops.filter((top) => top.module === module)" :key="row.key">
                            <SettingNode :row="row" :rows="shown" :read-only="readOnly" :save="saved" />
                        </template>
                    </section>
                </template>
            </div>
        </div>
    </div>
</template>

<style scoped>
.settings {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.settings-bar {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    align-items: center;
}

.settings-search {
    flex: 1;
    min-width: 200px;
    max-width: 360px;
}

.settings-saved {
    color: var(--text-3);
    font-size: 12px;
}

.settings-search-field {
    width: 100%;
    max-width: 360px;
    padding: 7px 12px;
    border: 1px solid var(--border-2);
    border-radius: 8px;
    background: transparent;
    color: var(--text);
}

.settings-body {
    display: flex;
    gap: 28px;
    align-items: flex-start;
}

.settings-nav {
    display: flex;
    flex: none;
    flex-direction: column;
    gap: 2px;
    width: 150px;
    position: sticky;
    top: 0;
}

.settings-nav-item {
    padding: 5px 10px;
    border: 0;
    border-radius: 6px;
    background: none;
    color: var(--text-2);
    font: inherit;
    text-align: left;
    cursor: pointer;
}

.settings-nav-item:hover {
    background: var(--hover);
    color: var(--text);
}

.settings-sections {
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: 32px;
    min-width: 0;
}

.settings-module {
    display: flex;
    flex-direction: column;
    gap: 18px;
}

.settings-module-heading {
    margin: 0;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    color: var(--text-3);
}

.settings-failure,
.settings-empty {
    margin: 0;
    color: var(--text-2);
}
</style>
