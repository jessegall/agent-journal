<script setup>
import {computed, inject, ref} from "vue";
import MarkIcon from "../kit/MarkIcon.vue";
import DockLeave from "./DockLeave.vue";
import {isLeaving} from "../domain/dockItems.js";
import {usePoll} from "../../kit/usePoll.js";
import {WINDOW_CONTEXT, lineResult} from "../windows/windowContext.js";

// one run in the compact row of several docked runs: where it stands as a ring or a sign, its name, a line of its progress,
// and, once it ended, the countdown to its leaving along its top edge as its card has
const OUTPUT_WINDOW = "processes.output";
const CHIP_READ_MILLISECONDS = 5000;
const TONES = {running: "var(--tone-work)", finished: "var(--tone-good)", failed: "var(--tone-bad)"};
const ICONS = {finished: "tick", failed: "cross", stopped: "stop", orphaned: "stop"};
const props = defineProps({item: {type: Object, required: true}});
const environment = inject(WINDOW_CONTEXT, null)?.environment ?? "";
const card = ref(null);
const running = computed(() => !card.value || card.value.state === "running" || card.value.state === "background");
const name = computed(() => card.value?.title || card.value?.line || props.item.title || `Run ${props.item.target_id}`);
const tone = computed(() => (running.value ? TONES.running : TONES[card.value.state] ?? "var(--text-3)"));

async function load() {
    const answer = await lineResult(OUTPUT_WINDOW, ["process", "card", String(props.item.target_id)], environment);
    if (answer.ok) card.value = answer.value;
}

usePoll(load, () => running.value, CHIP_READ_MILLISECONDS);
</script>

<template>
    <button type="button" class="run-chip" data-run-chip :title="name" :aria-label="`${name}; show its card`" :style="{'--tone': tone}">
        <template v-if="isLeaving(item)">
            <DockLeave :ends-at="item.leaves_at" />
        </template>
        <span class="run-chip-in">
            <template v-if="running">
                <span class="run-chip-ring"></span>
            </template>
            <template v-else>
                <MarkIcon :name="ICONS[card.state] ?? 'stop'" />
            </template>
            <span class="run-chip-name">{{ name }}</span>
        </span>
        <span class="run-chip-bar"><i :style="{width: running ? `${card?.progress ?? 0}%` : '100%', background: tone}"></i></span>
    </button>
</template>

<style scoped>
.run-chip {
    position: relative;
    flex: 1 1 0;
    min-width: 0;
    max-width: 190px;
    height: 24px;
    padding: 0;
    border: 1px solid var(--border);
    border-radius: 6px;
    background: var(--bg);
    font: inherit;
    cursor: pointer;
}

.run-chip:hover {
    border-color: var(--border-2);
}

.run-chip-in {
    display: flex;
    align-items: center;
    gap: 6px;
    height: 100%;
    padding: 0 8px;
    color: var(--text-2);
    font-size: 11px;
    white-space: nowrap;
}

.run-chip-in :deep(svg) {
    width: 10px;
    height: 10px;
    color: var(--tone);
}

.run-chip-ring {
    flex: none;
    width: 8px;
    height: 8px;
    border: 1.5px solid color-mix(in srgb, var(--tone) 30%, transparent);
    border-top-color: var(--tone);
    border-radius: 50%;
    animation: run-chip-spin 0.9s linear infinite;
}

@keyframes run-chip-spin {
    to {
        transform: rotate(360deg);
    }
}

.run-chip-name {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
}

.run-chip-bar {
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
    height: 2px;
    overflow: hidden;
    border-radius: 0 0 5px 5px;
}

.run-chip-bar i {
    display: block;
    height: 100%;
    opacity: 0.85;
    transition: width 0.5s ease;
}
</style>
