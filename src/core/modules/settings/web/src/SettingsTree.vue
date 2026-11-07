<script setup>
import {computed, onMounted, onUnmounted, ref} from "vue";
import {SearchBar, Segmented, Skeleton, WindowRoom, matchesSearch, patchedWhere, useWindow} from "@journal/window-kit";
import CommandSettings from "./CommandSettings.vue";
import SettingNode from "./SettingNode.vue";
import SettingsEnvironments from "./SettingsEnvironments.vue";

const CHANGED_SOURCES = new Set(["environment", "project"]);
const TYPING = "input,textarea,select,[contenteditable]";
const context = useWindow();
const {rows, failure, loaded, act} = context.props.settings;
context.state.tab = "settings";
const TABS = [
    {key: "settings", label: "Settings"},
    {key: "environments", label: "Environments"},
];
const tab = computed({get: () => context.state.tab, set: (value) => (context.state.tab = value)});
const query = ref("");
const filter = ref("all");
const field = ref(null);
const listed = computed(() => rows.value.filter((row) => !row.key.endsWith(".*")));
const isChanged = (row) => row.type !== "group" && CHANGED_SOURCES.has(row.source);
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
    const hits = listed.value.filter((row) => FILTERS[filter.value](row) && matchesSearch(row, wanted, context.search?.fields));
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

const chosen = ref("");
const current = computed(() => (chosen.value === "commands" || modules.value.includes(chosen.value) ? chosen.value : (modules.value[0] ?? "")));

function slashFocus(event) {
    if (event.key !== "/" || event.target.closest?.(TYPING)) return;
    event.preventDefault();
    field.value?.focus();
}
onMounted(() => {
    globalThis.addEventListener("keydown", slashFocus);
});
onUnmounted(() => {
    globalThis.removeEventListener("keydown", slashFocus);
});

// a setting shows its new value at once, and is put back with the refusal when the server refuses it
function saved(words, change) {
    return act(words, change && patchedWhere((row) => row.key === change.key, {value: change.value}));
}
</script>

<template>
    <WindowRoom>
        <div class="settings">
            <Segmented :options="TABS" :value="tab" data-settings-tabs @pick="tab = $event" />
            <template v-if="tab === 'environments'">
                <SettingsEnvironments />
            </template>
            <template v-else>
            <SearchBar ref="field" v-model="query" class="settings-bar">
                <Segmented :options="filters" :value="filter" data-settings-filter @pick="filter = $event" />
                <span class="settings-saved">Changes are saved as you make them</span>
            </SearchBar>
            <template v-if="!loaded">
                <Skeleton shape="text" />
            </template>
            <template v-else-if="failure">
                <p class="settings-failure">{{ failure }}</p>
            </template>
            <template v-else-if="loaded && !rows.length">
                <p class="settings-empty">No settings available.</p>
            </template>
            <div class="settings-body">
                <nav class="settings-nav" aria-label="Modules">
                    <button type="button" :class="['settings-nav-item', {current: current === 'commands'}]" data-jump="commands" @click="chosen = 'commands'">Command classification</button>
                    <template v-for="module in modules" :key="module">
                        <button type="button" :class="['settings-nav-item', {current: module === current}]" :data-jump="module" @click="chosen = module">{{ heading(module) }}</button>
                    </template>
                </nav>
                <div class="settings-sections" data-settings-sections>
                    <template v-if="current === 'commands'"><CommandSettings /></template>
                    <template v-for="module in modules.filter((name) => name === current)" :key="module">
                        <section class="settings-module" :data-module="module">
                            <h3 class="settings-module-heading">{{ heading(module) }}</h3>
                            <template v-for="row in tops.filter((top) => top.module === module)" :key="row.key">
                                <SettingNode :row="row" :rows="shown" :read-only="readOnly" :save="saved" />
                            </template>
                        </section>
                    </template>
                </div>
            </div>
            </template>
        </div>
    </WindowRoom>
</template>

<style scoped>
.settings-nav-item.current {
    background: var(--hover);
    color: var(--text);
}

.settings {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.settings-bar {
    flex-wrap: wrap;
    gap: 12px;
}

.settings-saved {
    color: var(--text-3);
    font-size: 12px;
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
