<script setup>
import {computed, ref} from "vue";
import ProcessQueueBand from "../ProcessQueueBand.vue";

// what the agent was told to do, cut to four lines until it is asked for in full, and the points a worker has to prove with the proof it gave for each
const LONG_TEXT_CHARACTERS = 150;
const props = defineProps({label: {type: String, required: true}, text: {type: String, required: true}, points: {type: Array, default: () => []}});
const whole = ref(false);
const long = computed(() => props.text.length > LONG_TEXT_CHARACTERS);
const proofLine = (point) => (point.proof ? `${point.proof.state.slice(0, 1).toUpperCase()}${point.proof.state.slice(1)}: ${point.proof.text}` : "No proof yet");
</script>

<template>
    <template v-if="text">
        <ProcessQueueBand icon="file">{{ label }}</ProcessQueueBand>
        <div :class="['brief', {clamp: !whole}]" data-agent-brief>{{ text }}</div>
        <template v-if="long && !whole">
            <button type="button" class="more" data-agent-brief-more @click="whole = true">Show all</button>
        </template>
    </template>
    <template v-if="points.length">
        <ProcessQueueBand icon="points">Points to prove</ProcessQueueBand>
        <template v-for="point in points" :key="point.id">
            <p class="point" data-agent-point>
                <span class="number">{{ point.id }}</span>
                <span class="text">{{ point.text }}<span :class="['proof', {checked: point.proof?.state === 'checked'}]">{{ proofLine(point) }}</span></span>
            </p>
        </template>
    </template>
</template>

<style scoped>
.brief { padding: 10px 14px; border-bottom: 1px solid var(--border-inner); color: var(--text-2); font-size: 12.5px; line-height: 1.55; white-space: pre-wrap; overflow-wrap: anywhere; }
.brief.clamp { display: -webkit-box; overflow: hidden; -webkit-box-orient: vertical; -webkit-line-clamp: 4; }
.more { display: block; width: 100%; padding: 6px 14px; border: 0; border-bottom: 1px solid var(--border-inner); background: none; color: var(--accent-text); font: inherit; font-size: 12.5px; text-align: left; cursor: pointer; }
.more:hover { text-decoration: underline; }
.point { display: flex; align-items: flex-start; gap: 9px; margin: 0; padding: 8px 14px; border-bottom: 1px solid var(--border-inner); font-size: 12.5px; line-height: 1.5; }
.number { flex: none; width: 16px; color: var(--text-3); font-variant-numeric: tabular-nums; }
.text { flex: 1; min-width: 0; overflow-wrap: anywhere; }
.proof { display: block; color: var(--text-3); font-size: 12px; }
.proof.checked { color: var(--tone-good, var(--green)); }
</style>
