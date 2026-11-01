<script setup>
import {computed, ref} from "vue";
import {Skeleton, useRows} from "@journal/window-kit";
import SettingNode from "./SettingNode.vue";

const {rows, failure, loaded, load, context} = useRows("setting tree", ["setting.*"]);
const query = ref("");
const listed = computed(() => rows.value.filter((row) => !row.key.endsWith(".*")));
// a search keeps each setting whose title, description or key has the words, and the groups above it
const shown = computed(() => {
    const wanted = query.value.trim().toLowerCase();
    if (!wanted) return listed.value;
    const hits = listed.value.filter((row) => [row.title, row.description, row.key].join(" ").toLowerCase().includes(wanted));
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

async function saved(words) {
    const result = await context.run(words);
    if (result.ok) load();
    return result;
}
</script>

<template>
    <div class="settings">
        <label class="settings-search">
            <input v-model="query" class="settings-search-field" type="search" placeholder="Find a setting" aria-label="Find a setting" />
        </label>
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
