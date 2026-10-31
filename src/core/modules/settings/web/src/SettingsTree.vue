<script setup>
import {computed} from "vue";
import {useRows} from "@journal/window-kit";
import SettingNode from "./SettingNode.vue";

const {rows, failure, loaded, load, context} = useRows("setting tree", ["setting.*"]);
const shown = computed(() => rows.value.filter((row) => !row.key.endsWith(".*")));
const tops = computed(() => shown.value.filter((row) => row.parent === null));
const readOnly = context.face === "phone";

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
        <template v-for="row in tops" :key="row.key">
            <SettingNode :row="row" :rows="shown" :read-only="readOnly" :save="saved" />
        </template>
    </div>
</template>

<style scoped>
.settings {
    display: flex;
    flex-direction: column;
    gap: 18px;
}

.settings-failure,
.settings-empty {
    margin: 0;
    color: var(--text-2);
}
</style>
