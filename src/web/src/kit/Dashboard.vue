<script setup>
import {computed, ref, watch} from "vue";
import DashboardNode from "./DashboardNode.vue";
import EmptyState from "./EmptyState.vue";

const props = defineProps({document: {type: Object, required: true}});
const emit = defineEmits(["file"]);
const trail = ref([]);
const here = computed(() => trail.value.at(-1) || props.document.start);
const page = computed(() => (props.document.pages || {})[here.value] || null);
const title = (id) => ((props.document.pages || {})[id] || {}).title || id;
const open = (id) => (trail.value = [...trail.value, id]);
const back = (at) => (trail.value = trail.value.slice(0, at));
watch(
    () => props.document.start,
    () => (trail.value = [])
);
</script>

<template>
    <div class="dashboard">
        <template v-if="document.broken">
            <EmptyState title="This dashboard does not fit the format">{{ document.broken }}</EmptyState>
        </template>
        <template v-else-if="document.missing">
            <EmptyState title="Nothing to show yet">{{ document.missing }}</EmptyState>
        </template>
        <template v-else-if="page">
            <nav class="trail">
                <button type="button" :class="['step', {current: !trail.length}]" @click="back(0)">{{ title(document.start) }}</button>
                <template v-for="(id, at) in trail" :key="`${at}-${id}`">
                    <span class="sep">/</span>
                    <button type="button" :class="['step', {current: at === trail.length - 1}]" @click="back(at + 1)">
                        {{ title(id) }}
                    </button>
                </template>
            </nav>
            <Transition name="page" mode="out-in">
                <div :key="here" class="page">
                    <DashboardNode :node="page.view" @open="open" @file="emit('file', $event)" />
                </div>
            </Transition>
        </template>
    </div>
</template>

<style scoped>
.dashboard {
    display: flex;
    flex-direction: column;
    gap: 14px;
}

.trail {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 4px;
}

.step {
    padding: 2px 6px;
    border: 0;
    border-radius: 5px;
    background: none;
    color: var(--text-3);
    font: inherit;
    font-size: 12.5px;
    cursor: pointer;
}

.step:hover {
    background: var(--hover);
    color: var(--text);
}

.step.current {
    color: var(--text);
    font-weight: 600;
}

.sep {
    color: var(--text-3);
    font-size: 12px;
}

.page-enter-active,
.page-leave-active {
    transition:
        opacity 0.18s,
        transform 0.18s;
}

.page-enter-from {
    opacity: 0;
    transform: translateX(8px);
}

.page-leave-to {
    opacity: 0;
    transform: translateX(-8px);
}
</style>
