<script setup>
import {computed, onBeforeUnmount, onMounted} from "vue";
import MarkIcon from "../kit/MarkIcon.vue";
import DockLeave from "./DockLeave.vue";
import {isLeaving, leaveSeconds} from "../domain/dockItems.js";
import {useWindow} from "../../kit/windowContextKey.js";

// one run in the compact row of several docked runs: where it stands as a ring or a sign, its name, a line of its progress,
// and, once it ended, the countdown to its leaving along its top edge as its card has
const TONES = {running: "var(--tone-work)", finished: "var(--tone-good)", failed: "var(--danger)"};
const ICONS = {finished: "tick", failed: "cross", stopped: "stop", orphaned: "stop"};
const props = defineProps({item: {type: Object, required: true}});
const view = useWindow();
const key = computed(() => `run.${props.item.target_id}`);
const card = computed(() => view.props[key.value].data.value);
const running = computed(() => !card.value || card.value.state === "running" || card.value.state === "background");
const name = computed(() => card.value?.title || card.value?.line || props.item.title || "");
const tone = computed(() => (running.value ? TONES.running : TONES[card.value.state] ?? "var(--text-3)"));

const load = () => view.reload(key.value);

// the card is read once and again whenever an event announces a change of this run
let stop = null;
onMounted(() => {
    load();
    stop = view.subscriptions?.follow(`run chip ${props.item.id}`, ["process.*"], (event) => {
        if (!event.row_id || event.row_id === props.item.target_id) load();
    });
});
onBeforeUnmount(() => stop?.());
</script>

<template>
    <button type="button" class="run-chip" data-run-chip :title="name" :aria-label="`${name}; show its card`" :style="{'--tone': tone}">
        <template v-if="isLeaving(item)">
            <DockLeave :ends-at="leaveSeconds(item)" />
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
    height: 24px;
    padding: 0;
    border: 1px solid var(--border);
    border-radius: 6px;
    background: var(--bg);
    font: inherit;
    cursor: pointer;
}

.run-chip:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }

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
    width: 10px;
    height: 10px;
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
