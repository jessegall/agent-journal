<script setup>
import {computed, onUnmounted, ref, watch} from "vue";
import {gists} from "../gist.js";
import {spoken} from "../spoken.js";
import {agent, types} from "../store.js";

const STEP = 700;
const sentence = (words) => spoken(words, types.value);
const data = computed(() => (agent.value && agent.value.data.status === "working" ? agent.value.data : null));
const ticks = ref(0);
const timer = setInterval(() => (ticks.value += 1), 1000);
const seen = {at: 0};
const pending = [];
const rolling = ref(null);
let rolls = null;

function roll() {
    rolling.value = pending.shift() || null;
    rolls = rolling.value ? setTimeout(roll, STEP) : null;
}

watch(
    () => data.value && data.value.commands,
    (ring) => {
        if (!ring) return;
        const first = !seen.at;
        for (const c of ring) {
            if (c.at <= seen.at) continue;
            seen.at = c.at;
            if (!first) gists(c.what, sentence).forEach((text) => pending.push({key: text, text, what: c.what}));
        }
        if (first && !seen.at) seen.at = 1;
        if (pending.length && !rolls) roll();
    },
    {immediate: true}
);
onUnmounted(() => {
    clearInterval(timer);
    if (rolls) clearTimeout(rolls);
});

function clock(secs) {
    return secs < 5 ? "" : secs < 60 ? `${secs}s` : `${Math.floor(secs / 60)}m ${secs % 60}s`;
}

const line = computed(() => {
    ticks.value;
    if (rolling.value) return rolling.value;
    const run = data.value && data.value.running;
    if (!run || !run.what) return null;
    const parts = gists(run.what, sentence);
    if (!parts.length) return null;
    const secs = Math.floor((run.done || Date.now() / 1000) - run.at);
    return {key: parts[parts.length - 1], text: parts[parts.length - 1], what: run.what, clock: clock(secs), done: !!run.done};
});
</script>

<template>
    <span class="statusbar-running">
        <Transition name="roll">
            <span v-if="line" :key="line.key" :class="['statusbar-run-line', {done: line.done}]" :title="line.what">
                <span class="statusbar-run-text">{{ line.text }}</span>
                <span class="statusbar-running-slot">
                    <Transition name="clock">
                        <span v-if="line.clock" class="statusbar-running-for">{{ line.clock }}</span>
                    </Transition>
                </span>
            </span>
        </Transition>
    </span>
</template>

<style scoped>
.statusbar-running {
    flex: 0 1 auto;
    min-width: 0;
    position: relative;
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    align-items: center;
    margin-left: auto;
    padding-left: 14px;
    overflow: hidden;
    font-size: 10.5px;
    color: var(--text-3);
}

.statusbar-running > * {
    grid-area: 1 / 1;
    justify-self: end;
}

.statusbar-run-line {
    display: inline-flex;
    align-items: center;
    max-width: 44ch;
    min-width: 0;
    font-family: ui-monospace, "SF Mono", Menlo, monospace;
    opacity: 0.75;
}

.statusbar-run-text {
    flex: 0 1 auto;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
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
        opacity 240ms ease,
        transform 240ms cubic-bezier(0.22, 0.7, 0.3, 1);
}

.roll-leave-active {
    transition:
        opacity 200ms ease,
        transform 200ms cubic-bezier(0.22, 0.7, 0.3, 1);
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
