<script setup>
import {computed} from "vue";
import Icon from "../kit/Icon.vue";

// the plan allowance used, as the status bar and an agent's inspector both show it: a bar and its percent for the first window the program reports
const props = defineProps({windows: {type: Array, default: () => []}, disabled: Boolean});
const emit = defineEmits(["open"]);
const allowance = computed(() => props.windows[0] ?? null);
const used = computed(() => (allowance.value && Number.isFinite(allowance.value.used_percent) ? Math.max(0, Math.min(100, Math.round(allowance.value.used_percent))) : null));
const atLimit = computed(() => used.value !== null && used.value >= 100);
const resetsAt = computed(() => (allowance.value?.reset_epoch_seconds ? new Date(allowance.value.reset_epoch_seconds * 1000).toLocaleString() : ""));
const title = computed(() => (atLimit.value ? `At usage limit: the plan's ${allowance.value.title} allowance is used up${resetsAt.value ? `, starts again ${resetsAt.value}` : ""}` : `${used.value}% of the plan's ${allowance.value.title} allowance used${resetsAt.value ? `, starts again ${resetsAt.value}` : ""}`));
</script>

<template>
    <button v-if="used !== null" type="button" class="fact" :disabled="disabled" data-fact="usage" :title="title" @click="emit('open', $event.currentTarget)">
        <Icon name="allowance" :size="12" /> <span class="gauge usage"><span :style="{width: `${used}%`}" /></span> {{ atLimit ? "At usage limit" : `${used}%` }}
    </button>
</template>

<style scoped>
.fact {
    display: inline-flex;
    flex: none;
    gap: 5px;
    align-items: center;
    padding: 0 4px;
    margin: 0 -4px;
    border: 0;
    border-radius: 6px;
    background: none;
    color: inherit;
    font: inherit;
    font-variant-numeric: tabular-nums;
    white-space: nowrap;
    cursor: pointer;
}

.fact:disabled {
    cursor: default;
}

.fact:not(:disabled):hover {
    background: var(--hover);
    color: var(--text);
}

.gauge {
    display: inline-block;
    width: 20px;
    height: 4px;
    overflow: hidden;
    border-radius: 2px;
    background: var(--line, var(--border));
}

.gauge > span {
    display: block;
    height: 100%;
    border-radius: inherit;
    background: var(--accent-text);
}
</style>
