<script setup>
import {computed} from "vue";
import Icon from "../kit/Icon.vue";

// the plan allowance used, as the status bar and an agent's inspector both show it: a bar and its percent for the first window the program reports
const props = defineProps({windows: {type: Array, default: () => []}, disabled: Boolean});
const emit = defineEmits(["open"]);
const allowance = computed(() => props.windows[0] ?? null);
const used = computed(() => (allowance.value ? Math.max(0, Math.min(100, Math.round(allowance.value.used_percent))) : null));
</script>

<template>
    <button v-if="used !== null" type="button" class="fact" :disabled="disabled" data-fact="usage" :title="`${used}% of the plan's ${allowance.title} allowance used`" @click="emit('open', $event.currentTarget)">
        <Icon name="allowance" :size="12" /> <span class="gauge usage"><span :style="{width: `${used}%`}" /></span> {{ used }}%
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
