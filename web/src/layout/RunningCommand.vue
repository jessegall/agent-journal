<script setup>
import {computed, onUnmounted, ref, watch} from "vue";
import {store} from "../store.js";
import {TICK, line, shown} from "./bar.js";

const COUNT_UP = 360;
const state = ref({at: 0, since: 0});
const message = ref(null);
const elapsed = ref(0);
const counted = ref({});
const frames = {};

function step() {
    const queue = (store.bar && store.bar.queue) || [];
    const now = Date.now() / 1000;
    const got = shown(queue, state.value, now);
    state.value = {at: got.at, since: got.since};
    message.value = got.message;
    elapsed.value = got.message ? Math.max(0, now - got.since) : 0;
}

const ticking = setInterval(step, TICK);
watch(() => store.bar && store.bar.queue, step, {immediate: true});
onUnmounted(() => {
    clearInterval(ticking);
    Object.values(frames).forEach(cancelAnimationFrame);
});

const shownLine = computed(() => line(message.value, elapsed.value));

function countTo(sign, to) {
    cancelAnimationFrame(frames[sign]);
    const from = counted.value[sign] || 0;
    if (to <= from) {
        counted.value = {...counted.value, [sign]: to};
        return;
    }
    const began = performance.now();
    const frame = (now) => {
        const at = Math.min(1, (now - began) / COUNT_UP);
        counted.value = {...counted.value, [sign]: Math.round(from + (to - from) * (1 - (1 - at) ** 3))};
        if (at < 1) frames[sign] = requestAnimationFrame(frame);
    };
    frames[sign] = requestAnimationFrame(frame);
}

function amount(part) {
    return `${part.prefix}${counted.value[part.prefix] ?? part.value}`;
}

watch(
    () => state.value.at,
    () => (counted.value = {})
);
watch(shownLine, (now) => {
    for (const part of (now && now.parts) || []) if (part.increments) countTo(part.prefix, part.value);
});
</script>

<template>
    <span :class="['statusbar-running', {ending: !shownLine}]">
        <Transition name="roll">
            <span v-if="shownLine" :key="shownLine.key" :class="['statusbar-run-line', {done: shownLine.done}]">
                <TransitionGroup tag="span" name="token" class="statusbar-run-text" :title="shownLine.text">
                    <span v-for="(part, i) in shownLine.parts" :key="`${i}-${part.value}`" :class="['statusbar-run-token', part.color]">
                        <template v-if="part.increments">{{ amount(part) }}</template>
                        <template v-else>{{ part.value }}</template>
                    </span>
                </TransitionGroup>
                <span class="statusbar-running-slot">
                    <Transition name="clock">
                        <span v-if="shownLine.clock" class="statusbar-running-for">{{ shownLine.clock }}</span>
                    </Transition>
                </span>
            </span>
        </Transition>
    </span>
</template>

<style scoped>
.statusbar-running {
    --command-in: 180ms;
    --command-out: 150ms;
    flex: 0 1 auto;
    min-width: 0;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    max-width: 44ch;
    margin-left: auto;
    font-size: 10.5px;
    color: var(--text-3);
    pointer-events: none;
}

.statusbar-run-line {
    position: relative;
    display: inline-flex;
    align-items: center;
    max-width: 44ch;
    min-width: 0;
    font-family: ui-monospace, "SF Mono", Menlo, monospace;
    opacity: 0.75;
}

.statusbar-run-text {
    position: relative;
    flex: 0 1 auto;
    min-width: 0;
    gap: 0.55em;
    display: inline-flex;
    align-items: baseline;
    overflow: hidden;
    white-space: nowrap;
}

.statusbar-run-token {
    flex: none;
    transition:
        opacity var(--command-in) ease,
        transform var(--command-in) cubic-bezier(0.22, 0.7, 0.3, 1);
}

.token-enter-from {
    opacity: 0;
    transform: translateY(10px);
}

.token-leave-active {
    position: absolute;
    transition:
        opacity var(--command-out) ease,
        transform var(--command-out) cubic-bezier(0.22, 0.7, 0.3, 1);
}

.token-leave-to {
    opacity: 0;
    transform: translateY(-10px);
}

.statusbar-run-token.gray {
    color: var(--text-2);
    font-weight: 500;
}

.statusbar-run-token.muted {
    flex: 0 1 auto;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    color: color-mix(in srgb, var(--text-3) 76%, transparent);
    font-size: 0.88em;
}

.statusbar-run-token.green {
    color: var(--created);
    font-variant-numeric: tabular-nums;
}

.statusbar-run-token.red {
    color: var(--danger);
    font-variant-numeric: tabular-nums;
}

.statusbar-running-slot {
    flex: none;
    display: inline-flex;
}

.statusbar-running-for {
    display: inline-block;
    overflow: hidden;
    white-space: nowrap;
    max-width: 6ch;
    margin-left: 8px;
    font-variant-numeric: tabular-nums;
}

.statusbar-run-line.done .statusbar-running-for {
    opacity: 0.55;
}

.roll-enter-active {
    transition:
        opacity var(--command-in) ease,
        transform var(--command-in) cubic-bezier(0.22, 0.7, 0.3, 1);
}

.roll-leave-active {
    position: absolute;
    right: 0;
    transition:
        opacity var(--command-out) ease,
        transform var(--command-out) cubic-bezier(0.22, 0.7, 0.3, 1);
}

.statusbar-running.ending .roll-leave-active {
    transition:
        opacity var(--command-out) ease 90ms,
        transform var(--command-out) cubic-bezier(0.22, 0.7, 0.3, 1) 90ms;
}

.roll-enter-from {
    opacity: 0;
    transform: translateY(10px);
}

.roll-leave-to {
    opacity: 0;
    transform: translateY(-10px);
}

.clock-enter-active {
    transition:
        max-width 260ms cubic-bezier(0.22, 0.7, 0.3, 1),
        margin-left 260ms cubic-bezier(0.22, 0.7, 0.3, 1),
        opacity 200ms ease 60ms;
}

.clock-leave-active {
    transition:
        max-width 160ms ease,
        margin-left 160ms ease,
        opacity 120ms ease;
}

.clock-enter-from,
.clock-leave-to {
    max-width: 0;
    margin-left: 0;
    opacity: 0;
}
</style>
