<script setup>
import {computed, nextTick, ref, watch} from "vue";
import {FoldSign, Icon, useNow, usePoll, useWindow} from "@journal/window-kit";

// the card of a docked process, as version 4's watched output drew it: in the head a mark for where the run stands, its command, how far it has come
// and how long it has run; along the foot a thin bar; opened, its terminal output in a scrolling box that follows the end; while the run is going it is read every two seconds when opened and every five when closed,
// and at once when its row changes
const OPENED_MILLISECONDS = 2000;
const CLOSED_MILLISECONDS = 5000;
const TONES = {running: "var(--tone-work)", good: "var(--tone-good)", bad: "var(--tone-bad)", stopped: "var(--text-3)"};
const ICONS = {running: "terminal", good: "tick", bad: "cross", stopped: "stop"};
const STANDINGS = {running: "running", background: "running", finished: "good", failed: "bad", stopped: "stopped", orphaned: "stopped"};
const context = useWindow();
const item = context.option("row");
const head = context.option("head");
const run = ref(null);
const lines = ref([]);
const opened = ref(false);
const terminal = ref(null);
const FOLLOW_PIXELS = 24;
const now = useNow();

const standing = computed(() => STANDINGS[run.value?.state] ?? "running");
const isRunning = () => standing.value === "running";
const ended = computed(() => standing.value === "good" || standing.value === "bad");
const fraction = computed(() => Number(run.value?.progress ?? 0) / 100);
const width = computed(() => (ended.value ? "100%" : `${Math.round(fraction.value * 100)}%`));
// when the run began, in seconds, which tells the figure one bar's run from the next
const began = computed(() => (run.value?.created_at ? Date.parse(run.value.created_at) / 1000 : 0));
const steps = computed(() => {
    if (!run.value?.steps_passed && !run.value?.steps_failed) return "";
    return run.value.steps_failed ? `${run.value.steps_passed} passed, ${run.value.steps_failed} failed` : `${run.value.steps_passed} passed`;
});
const ranFor = computed(() => {
    if (!run.value?.created_at) return "";
    const until = run.value.ended_at ? Date.parse(run.value.ended_at) : now.value;
    const seconds = Math.max(0, Math.round((until - Date.parse(run.value.created_at)) / 1000));
    return seconds >= 60 ? `${Math.floor(seconds / 60)}m ${seconds % 60}s` : `${seconds}s`;
});

async function load() {
    const id = item.value?.target_id;
    if (!id) return;
    const shown = await context.read(`process card ${id}`);
    run.value = shown.ok ? shown.value : null;
    if (!opened.value) return;
    const box = terminal.value;
    const following = !box || box.scrollHeight - box.scrollTop - box.clientHeight < FOLLOW_PIXELS;
    const text = await context.read(`output peek ${id} --all`);
    lines.value = text.ok ? text.value.lines : [];
    await nextTick();
    if (following && terminal.value) terminal.value.scrollTop = terminal.value.scrollHeight;
}

watch(opened, (open) => open && load());

context.follow(["process.*"], (event) => event.row_id === item.value?.target_id && load());
usePoll(load, isRunning, () => (opened.value ? OPENED_MILLISECONDS : CLOSED_MILLISECONDS));
</script>

<template>
    <div class="output-dock" data-output-dock>
        <template v-if="head?.value ?? head">
            <Teleport :to="head?.value ?? head">
                <span class="output-dock-state" :data-state="standing" :style="{'--tone': TONES[standing]}"><Icon :name="ICONS[standing]" /></span>
                <button type="button" class="output-dock-label" data-output-toggle :aria-expanded="opened" :title="run?.title" @click="opened = !opened">
                    <span class="output-dock-title">{{ run?.title }}</span>
                    <FoldSign :open="opened" />
                </button>
                <template v-if="steps">
                    <span class="output-dock-figure" data-output-steps>{{ steps }}</span>
                </template>
                <template v-if="ranFor">
                    <span class="output-dock-figure">{{ ranFor }}</span>
                </template>
                <template v-if="fraction > 0 || ended">
                    <div class="output-dock-bar" :data-figure-bar="ended ? standing : ''" :data-figure-began="began"><div class="output-dock-fill" :style="{width, background: TONES[standing]}" :data-figure-progress="ended ? null : ''" /></div>
                </template>
            </Teleport>
        </template>
        <div :class="['output-dock-more', {open: opened}]">
            <div class="output-dock-inner">
                <pre ref="terminal" class="output-dock-terminal" data-output-terminal>{{ lines.join("\n") }}</pre>
            </div>
        </div>
    </div>
</template>

<style scoped>
.output-dock-more {
    display: grid;
    grid-template-rows: 0fr;
    opacity: 0;
    transition:
        grid-template-rows var(--move),
        opacity var(--fade);
}

.output-dock-more.open {
    grid-template-rows: 1fr;
    opacity: 1;
}

.output-dock-inner {
    min-height: 0;
    overflow: hidden;
}

.output-dock-state {
    display: flex;
    flex: none;
    justify-content: center;
    width: 16px;
    color: var(--tone);
}

.output-dock-label {
    display: flex;
    flex: 1 1 auto;
    align-items: center;
    gap: 9px;
    min-width: 0;
    padding: 0;
    border: none;
    background: none;
    color: var(--text);
    font: inherit;
    font-size: 12px;
    font-weight: 500;
    text-align: left;
    cursor: pointer;
}

.output-dock-title {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.output-dock-figure {
    flex: none;
    color: var(--text-3);
    font-size: 11px;
    font-variant-numeric: tabular-nums;
}

.output-dock-terminal {
    overflow: auto;
    max-height: 280px;
    margin: 0 12px 10px;
    padding: 8px 10px;
    border: 1px solid var(--border);
    border-radius: 6px;
    background: var(--bg);
    color: var(--text-2);
    font-family: var(--mono, monospace);
    font-size: 11px;
    line-height: 1.5;
    white-space: pre-wrap;
    overflow-wrap: anywhere;
}

.output-dock-bar {
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
    height: 2px;
    border-radius: 1px;
    background: var(--border);
    overflow: hidden;
}

.output-dock-fill {
    height: 100%;
    transition: width 0.4s ease;
}
</style>
