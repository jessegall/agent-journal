<script setup lang="ts">
import {COUNTED, EVENTS} from "./cadence.js";
import TextInput from "../kit/TextInput.vue";
import Segmented from "../kit/Segmented.vue";

const LABELS = {
    percent: "% of context",
    uses: "tool calls",
    minutes: "minutes",
    idle: "at rest",
    worked: "after work",
    start: "at start",
    notices: "journal lines",
};

defineProps<{f: unknown}>();
defineEmits<{marks: [unknown, unknown]; every: [unknown, unknown]; unit: [unknown, unknown]}>();
</script>

<template>
    <span class="cadence">
        <template v-if="f.when.at">
            <span class="word">at</span>
            <TextInput class="field marks" :value="f.when.at.join(', ')" @change="$emit('marks', f, $event.target.value)" />
        </template>
        <template v-else-if="f.when.on">
            <span class="word">when</span>
        </template>
        <template v-else>
            <span class="word">every</span>
            <TextInput class="field" type="number" min="1" :value="f.when.every" @change="$emit('every', f, $event.target.value)" />
        </template>
        <Segmented
            class="segments"
            :options="[...COUNTED, ...EVENTS].map((u) => ({key: u, label: LABELS[u]}))"
            :value="f.when.on || f.when.unit"
            @pick="$emit('unit', f, $event)"
        />
    </span>
</template>

<style scoped>
.cadence {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px;
    margin-top: 10px;
}

.word {
    color: var(--text-3);
    font-size: 12px;
}

.field {
    width: 58px;
    height: 26px;
    padding: 0 8px;
    border: 1px solid var(--border-2);
    border-radius: 6px;
    background: var(--bg-2);
    color: var(--text);
    font-size: 12px;
    font-variant-numeric: tabular-nums;
    text-align: right;
    transition:
        border-color 0.12s ease,
        background 0.12s ease;
}

.field:hover {
    border-color: var(--border);
}

.field:focus {
    outline: none;
    border-color: var(--progress);
    background: var(--raised);
}

.field.marks {
    width: 108px;
    text-align: left;
}

.segments {
    display: inline-flex;
    flex-wrap: wrap;
    max-width: 100%;
    padding: 2px;
    border: 1px solid var(--border-2);
    border-radius: 7px;
    background: var(--bg-2);
}
</style>
