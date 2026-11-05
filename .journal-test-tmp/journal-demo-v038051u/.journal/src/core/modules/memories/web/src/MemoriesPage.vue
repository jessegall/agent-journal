<script setup>
import {computed, ref} from "vue";
import {Segmented, WindowRoom, useRows, useWindow} from "@journal/window-kit";
import MemoryRows from "./MemoryRows.vue";

const ALL = "";

// the project's memories: one tab per environment, and one for all of them
const context = useWindow();
const {rows: environments} = useRows("environment list", ["environment.*"]);
const tab = ref(context.environment);
const tabs = computed(() => [{key: ALL, label: "All"}, ...environments.value.map((row) => ({key: row.name, label: row.name}))]);
</script>

<template>
    <WindowRoom>
        <div class="memories-page">
            <Segmented :options="tabs" :value="tab" data-memory-tabs @pick="tab = $event" />
            <MemoryRows :key="tab" :environment="tab" />
        </div>
    </WindowRoom>
</template>

<style scoped>
.memories-page {
    display: flex;
    flex-direction: column;
    gap: 8px;
    align-items: flex-start;
}

.memories-page > :deep(.memories) {
    align-self: stretch;
}
</style>
