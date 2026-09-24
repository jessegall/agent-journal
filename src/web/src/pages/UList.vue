<script setup lang="ts">
import {COUNTED, EVENTS} from "./cadence.js";

const LABELS = {percent: "% of context", uses: "tool calls", minutes: "minutes", idle: "at rest", worked: "after work", start: "at start"};

defineProps<{f: unknown}>();
defineEmits<{marks: [unknown, unknown]; every: [unknown, unknown]; unit: [unknown, unknown]}>();
</script>

<template>
    <span class="cadence">
        <template v-if="f.when.at">
            <span class="word">at</span>
            <input class="field marks" :value="f.when.at.join(', ')" @change="$emit('marks', f, $event.target.value)" />
        </template>
        <template v-else-if="f.when.on">
            <span class="word">when</span>
        </template>
        <template v-else>
            <span class="word">every</span>
            <input class="field" type="number" min="1" :value="f.when.every" @change="$emit('every', f, $event.target.value)" />
        </template>
        <span class="segments" role="radiogroup">
            <template v-for="u in [...COUNTED, ...EVENTS]" :key="u">
                <button
                    type="button"
                    role="radio"
                    :aria-checked="f.when.on ? f.when.on === u : f.when.unit === u"
                    :class="['segment', {on: f.when.on ? f.when.on === u : f.when.unit === u}]"
                    @click="$emit('unit', f, u)"
                >
                    {{ LABELS[u] }}
                </button>
            </template>
        </span>
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

.segment {
    height: 22px;
    padding: 0 9px;
    border: 0;
    border-radius: 5px;
    background: none;
    color: var(--text-3);
    font: inherit;
    font-size: 11.5px;
    white-space: nowrap;
    cursor: pointer;
    transition:
        background 0.12s ease,
        color 0.12s ease;
}

.segment:hover {
    color: var(--text-2);
}

.segment.on {
    background: color-mix(in srgb, var(--accent) 22%, transparent);
    color: var(--text);
    box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--accent) 45%, transparent);
}
</style>
