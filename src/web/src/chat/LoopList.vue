<script setup>
import {computed} from "vue";
import TextDisplay from "../kit/TextDisplay.vue";
import {span} from "../format/time.js";

const props = defineProps({loops: {type: Object, default: () => ({})}});
const listed = computed(() =>
    Object.entries(props.loops || {})
        .map(([id, loop]) => ({id, ...loop}))
        .sort((a, b) => (a.at || 0) - (b.at || 0))
);

const pad = (m) => `:${String(m).padStart(2, "0")}`;

function when(schedule) {
    const [minute, hour, day, month, week] = (schedule || "").trim().split(/\s+/);
    if ([hour, day, month, week].some((part) => part !== "*")) return schedule;
    if (/^\*\/\d+$/.test(minute)) return `every ${minute.slice(2)} minutes`;
    if (minute === "*") return "every minute";
    if (/^\d+(,\d+)*$/.test(minute)) return `each hour at ${minute.split(",").map(pad).join(", ")}`;
    return schedule;
}

const set = (at) => (at ? `set ${span(Date.now() / 1000 - at)} ago` : "");
</script>

<template>
    <h4 class="loop-heading">Scheduled loops</h4>
    <p class="loop-none">Prompts the agent set to run again on a schedule.</p>
    <template v-for="loop in listed" :key="loop.id">
        <div class="loop-row">
            <span class="loop-when" :title="loop.schedule">
                {{ when(loop.schedule) }}
                <small>{{ set(loop.at) }}</small>
            </span>
            <TextDisplay class="loop-prompt" :text="loop.prompt || ''" />
        </div>
    </template>
</template>

<style scoped>
.loop-heading {
    margin: 0;
    padding: 6px 8px 0;
    color: var(--text);
    font-size: 12px;
    font-weight: 600;
}

.loop-none {
    margin: 0;
    padding: 4px 8px 6px;
    color: var(--text-3);
    font-size: 12px;
}

.loop-row {
    display: flex;
    flex-direction: column;
    gap: 3px;
    padding: 7px 8px;
    border-top: 1px solid var(--border);
    font-size: 12px;
}

.loop-when {
    display: flex;
    align-items: baseline;
    gap: 8px;
    color: var(--text);
    font-weight: 500;
}

.loop-when small {
    color: var(--text-3);
    font-weight: 400;
}

.loop-prompt {
    display: -webkit-box;
    overflow: hidden;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
    color: var(--text-2);
}
</style>
