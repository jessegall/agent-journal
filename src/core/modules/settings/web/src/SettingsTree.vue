<script setup>
import {computed} from "vue";
import {useRows} from "@journal/window-kit";
import SettingNode from "./SettingNode.vue";

const {rows, failure, loaded, load, context} = useRows("setting tree", ["setting.*"]);
const shown = computed(() => rows.value.filter((row) => !row.key.endsWith(".*")));
const tops = computed(() => shown.value.filter((row) => row.parent === null));
const modules = computed(() => [...new Set(tops.value.map((row) => row.module))]);
const readOnly = context.face === "phone";

function heading(module) {
    const parts = module.split(".");
    const name = parts[parts.length - 1].replace(/[-_]/g, " ");
    return name.slice(0, 1).toUpperCase() + name.slice(1);
}

async function saved(words) {
    const result = await context.run(words);
    if (result.ok) load();
    return result;
}
</script>

<template>
    <div class="settings">
        <template v-if="failure">
            <p class="settings-failure">{{ failure }}</p>
        </template>
        <template v-else-if="loaded && !rows.length">
            <p class="settings-empty">No module declares a setting.</p>
        </template>
        <template v-for="module in modules" :key="module">
            <section class="settings-module" :data-module="module">
                <h3 class="settings-module-heading">{{ heading(module) }}</h3>
                <template v-for="row in tops.filter((top) => top.module === module)" :key="row.key">
                    <SettingNode :row="row" :rows="shown" :read-only="readOnly" :save="saved" />
                </template>
            </section>
        </template>
    </div>
</template>

<style scoped>
.settings {
    display: flex;
    flex-direction: column;
    gap: 18px;
}

.settings-module {
    display: flex;
    flex-direction: column;
    gap: 14px;
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
