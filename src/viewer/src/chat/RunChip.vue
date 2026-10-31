<script setup>
import {computed} from "vue";
import MarkIcon from "../kit/MarkIcon.vue";
import DockLeave from "./DockLeave.vue";
import {isLeaving} from "../domain/docks.js";
import {useWatchRun} from "../composables/watchRun.js";

// One run in the compact row of several docked runs: its state as a ring or a sign, its name, its figure and a line of its progress
const props = defineProps({message: {type: Object, required: true}});
const card = computed(() => props.message.data);
const {state, tone, icon, bar, width, ranFor} = useWatchRun(() => card.value);
const figure = computed(() => card.value.count || ranFor.value);
const tip = computed(() => [props.message.text, figure.value].filter(Boolean).join(" · "));
</script>

<template>
    <button
        type="button"
        class="run-chip"
        :data-state="state"
        :data-tip="tip"
        :aria-label="`${tip}; show its card`"
        :style="{'--tone': tone}"
    >
        <template v-if="isLeaving(message)">
            <DockLeave :ends-at="card.undock_at" />
        </template>
        <span class="run-chip-in">
            <template v-if="state === 'running'">
                <span class="run-chip-ring"></span>
            </template>
            <template v-else>
                <MarkIcon :name="icon" />
            </template>
            <span class="run-chip-name">{{ message.text }}</span>
            <template v-if="figure">
                <span class="run-chip-figure">{{ figure }}</span>
            </template>
        </span>
        <span class="run-chip-bar"><i :style="{width, background: bar}"></i></span>
    </button>
</template>

<style scoped>
.run-chip {
    position: relative;
    container-type: inline-size;
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
    transition:
        border-color 0.15s ease,
        opacity 0.3s ease;
}

.run-chip:hover {
    border-color: var(--border-3);
}

.run-chip:focus-visible {
    outline: 2px solid color-mix(in srgb, var(--accent-text) 70%, transparent);
    outline-offset: -2px;
}

.run-chip .dock-leave {
    right: 5px;
    left: 5px;
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
    stroke-width: 1.8;
}

.run-chip-ring {
    flex: none;
    width: 8px;
    height: 8px;
    border: 1.5px solid color-mix(in srgb, var(--tone) 30%, transparent);
    border-top-color: var(--tone);
    border-radius: 50%;
    animation: spin 0.9s linear infinite;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

.run-chip-name {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
}

.run-chip-figure {
    min-width: 0;
    margin-left: auto;
    padding-left: 2px;
    overflow: hidden;
    color: var(--text-4);
    font-size: 10.5px;
    font-variant-numeric: tabular-nums;
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

/* the tip names the run and its figure, above the row */
.run-chip::after {
    content: attr(data-tip);
    position: absolute;
    bottom: calc(100% + 7px);
    left: 0;
    z-index: 20;
    padding: 4px 9px 5px;
    border: 1px solid var(--tip-edge);
    border-radius: 7px;
    background: var(--tip-bg);
    box-shadow: var(--tip-shadow);
    color: var(--text);
    font-size: 12px;
    line-height: 1.4;
    white-space: nowrap;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.12s ease;
}

.run-chip:hover::after,
.run-chip:focus-visible::after {
    opacity: 1;
    transition-delay: 0.45s;
}

/* a narrow chip drops the name, then the figure */
@container (max-width: 100px) {
    .run-chip-name {
        display: none;
    }

    .run-chip-in {
        justify-content: center;
    }

    .run-chip-figure {
        margin-left: 0;
    }
}

@container (max-width: 64px) {
    .run-chip-figure {
        display: none;
    }
}

:global(html.phone .run-chip) {
    height: 30px;
}

:global(html.phone .run-chip::after) {
    display: none;
}

@media (hover: none) {
    .run-chip::after {
        display: none;
    }
}
</style>
