<script setup>
import {computed, nextTick, onUnmounted, ref, watch} from "vue";
import {gists, gistTokens} from "../gist.js";
import {spoken} from "../spoken.js";
import {agent, types} from "../store.js";

const STEP = 700;
const HOLD_EDITS = 1000;
const SHOW_CLOCK_AFTER = 10;
const WRITE_TOOLS = ["Edit", "Write", "MultiEdit", "NotebookEdit"];
const CHANGING = ["writes", "deletes"];
const sentence = (words) => spoken(words, types.value);
const EFFECTS = {
    tests: [
        {value: "running", kind: "command"},
        {value: "tests", kind: "argument"},
    ],
    deletes: [
        {value: "deleting", kind: "command"},
        {value: "files", kind: "argument"},
    ],
    writes: [
        {value: "editing", kind: "command"},
        {value: "files", kind: "argument"},
    ],
    reads: [
        {value: "reading", kind: "command"},
        {value: "files", kind: "argument"},
    ],
};
const said = (c) =>
    c.effect ? [EFFECTS[c.effect].map((t) => t.value).join(" ")] : c.tool && c.tool !== "Bash" ? [c.what] : gists(c.what, sentence);
const tokensOf = (c, text) => (c.effect ? EFFECTS[c.effect] : gistTokens(text));
const data = computed(() => (agent.value && ["working", "compacting"].includes(agent.value.data.status) ? agent.value.data : null));
const ticks = ref(0);
const timer = setInterval(() => (ticks.value += 1), 1000);
const seen = {at: 0};
const pending = [];
const rolling = ref(null);
const counts = ref({added: 0, removed: 0});
const showDelta = ref(false);
const frames = {added: 0, removed: 0};
const tally = new Map();
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
            if (!first) {
                const shown = said(c).slice(0, 1);
                shown.forEach((text) => pending.push({key: text, text, tokens: tokensOf(c, text), delta: []}));
            }
        }
        if (first && !seen.at) seen.at = 1;
        if (pending.length && !rolls) roll();
    },
    {immediate: true}
);
onUnmounted(() => {
    clearTimeout(resetting);
    clearInterval(timer);
    if (rolls) clearTimeout(rolls);
    Object.values(frames).forEach(cancelAnimationFrame);
});

function clock(secs) {
    return secs < SHOW_CLOCK_AFTER ? "" : secs < 60 ? `${secs}s` : `${Math.floor(secs / 60)}m ${secs % 60}s`;
}

const stay = ref(null);
let resetting = 0;
let streakEnd = "";

function outcome(result) {
    return result.failed ? {value: `${result.failed} failed`, kind: "failed"} : {value: "passed", kind: "passed"};
}

function lineFor(run) {
    if (!run || !run.what) return null;
    const step = run.step && !run.done ? {what: run.step, tool: "Bash", effect: run.step_effect} : null;
    const now = step && said(step).length ? step : run;
    const parts = said(now);
    if (!parts.length) return null;
    const secs = Math.floor((run.done || Date.now() / 1000) - run.at);
    const text = parts[0];
    const result = run.done && run.result ? outcome(run.result) : null;
    return {
        key: text,
        text,
        tokens: [...tokensOf(now, text), ...(result ? [result] : [])],
        clock: clock(secs),
        done: !!run.done,
    };
}

const line = computed(() => {
    ticks.value;
    if (stay.value) return stay.value;
    if (rolling.value) return rolling.value;
    return lineFor(data.value && data.value.running);
});

const text = ref(null);
const width = ref("");
const fresh = ref(new Set());
let settling = 0;

function pinned(el) {
    const box = el.parentElement.getBoundingClientRect();
    const own = el.getBoundingClientRect();
    Object.assign(el.style, {position: "absolute", top: `${own.top - box.top}px`, right: `${box.right - own.right}px`});
}

function settledWidth() {
    clearTimeout(settling);
    width.value = "";
    fresh.value = new Set();
}

watch(
    () => (line.value ? line.value.tokens.map((t, i) => `${i}-${t.value}`) : []),
    async (now, before) => {
        const el = text.value && text.value.$el;
        if (!el || !now.length || !before.length) return;
        fresh.value = new Set(now.filter((k) => !before.includes(k)));
        const from = el.getBoundingClientRect().width;
        width.value = `${from}px`;
        await nextTick();
        el.style.width = "auto";
        const to = el.getBoundingClientRect().width;
        el.style.width = `${from}px`;
        el.getBoundingClientRect();
        width.value = `${to}px`;
        clearTimeout(settling);
        settling = setTimeout(settledWidth, Math.abs(to - from) < 1 ? 20 : 300);
    }
);

function editing(run) {
    return CHANGING.includes(run.effect) || WRITE_TOOLS.includes(run.tool);
}

function total() {
    const sum = {added: 0, removed: 0};
    tally.forEach((c) => {
        sum.added += c.added || 0;
        sum.removed += c.removed || 0;
    });
    return sum;
}

function endStreak() {
    clearTimeout(resetting);
    resetting = setTimeout(() => {
        stay.value = null;
        tally.clear();
        apply(total());
    }, HOLD_EDITS);
}

watch(
    () => data.value && data.value.running,
    (run) => {
        if (!run) return;
        const before = run.before;
        [before, run].forEach((r) => r && r.at && r.changed && tally.set(r.at, r.changed));
        const end = `${run.at}-${!!(before && before.changed)}`;
        if (run.what && !editing(run) && tally.size && end !== streakEnd) {
            streakEnd = end;
            stay.value = before && before.changed ? lineFor(before) : null;
            endStreak();
        }
        apply(total());
    },
    {immediate: true}
);

const delta = computed(() => {
    return [
        {kind: "added", text: counts.value.added ? `+${counts.value.added}` : ""},
        {kind: "removed", text: counts.value.removed ? `−${counts.value.removed}` : ""},
    ].filter((d) => d.text);
});

function count(kind, to) {
    cancelAnimationFrame(frames[kind]);
    const from = counts.value[kind];
    if (to <= from) {
        counts.value = {...counts.value, [kind]: to};
        return;
    }
    const started = performance.now();
    const step = (now) => {
        const at = Math.min(1, (now - started) / 360);
        const eased = 1 - (1 - at) ** 3;
        counts.value = {...counts.value, [kind]: Math.round(from + (to - from) * eased)};
        if (at < 1) frames[kind] = requestAnimationFrame(step);
    };
    frames[kind] = requestAnimationFrame(step);
}

function apply(sum) {
    count("added", sum.added);
    count("removed", sum.removed);
    showDelta.value = !!(sum.added || sum.removed);
}
</script>

<template>
    <span :class="['statusbar-running', {ending: !data}]">
        <Transition name="roll">
            <span v-if="line" :class="['statusbar-run-line', {done: line.done}]">
                <TransitionGroup
                    ref="text"
                    tag="span"
                    name="token"
                    class="statusbar-run-text"
                    :style="{width}"
                    :title="line.text"
                    @transitionend.self="settledWidth"
                    @before-leave="pinned"
                >
                    <span
                        v-for="(token, i) in line.tokens"
                        :key="`${i}-${token.value}`"
                        :class="['statusbar-run-token', token.kind, {fresh: fresh.has(`${i}-${token.value}`)}]"
                    >
                        {{ token.value }}
                    </span>
                </TransitionGroup>
                <span class="statusbar-running-slot">
                    <Transition name="clock">
                        <span v-if="line.clock" class="statusbar-running-for">{{ line.clock }}</span>
                    </Transition>
                </span>
            </span>
        </Transition>
        <Transition name="delta">
            <TransitionGroup v-if="showDelta && delta.length" tag="span" name="count" class="statusbar-run-delta">
                <span v-for="d in delta" :key="d.kind" :class="['statusbar-run-count', d.kind]">{{ d.text }}</span>
            </TransitionGroup>
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
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    align-items: center;
    max-width: 44ch;
    margin-left: auto;
    font-size: 10.5px;
    color: var(--text-3);
    pointer-events: none;
}

.statusbar-running > .statusbar-run-line {
    grid-area: 1 / 1;
    justify-self: end;
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
    transition: width var(--command-in) cubic-bezier(0.22, 0.7, 0.3, 1);
    display: inline-flex;
    align-items: baseline;
    overflow: hidden;
    white-space: nowrap;
}

.statusbar-run-token {
    flex: none;
}

.statusbar-run-token {
    transition:
        opacity var(--command-in) ease,
        transform var(--command-in) cubic-bezier(0.22, 0.7, 0.3, 1);
}

.statusbar-run-token.fresh {
    opacity: 0;
    transform: translateY(10px);
    transition: none;
}

.token-leave-active {
    transition:
        opacity var(--command-out) ease,
        transform var(--command-out) cubic-bezier(0.22, 0.7, 0.3, 1);
}

.token-leave-to {
    opacity: 0;
    transform: translateY(-10px);
}

.statusbar-run-token.command {
    color: var(--text-2);
    font-weight: 500;
}

.statusbar-run-token.argument {
    flex: 0 1 auto;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    color: color-mix(in srgb, var(--text-3) 76%, transparent);
    font-size: 0.88em;
}

.statusbar-run-delta {
    grid-area: 1 / 2;
    display: inline-flex;
    align-items: center;
    justify-content: flex-end;
    max-width: 11ch;
    margin-left: 7px;
    overflow: hidden;
    white-space: nowrap;
    font-size: 8px;
    letter-spacing: 0.02em;
    line-height: normal;
}

.statusbar-run-count.added {
    color: var(--created);
}

.statusbar-run-count.removed {
    color: var(--danger);
}

.statusbar-run-count {
    display: inline-block;
    max-width: 5ch;
    overflow: hidden;
    text-align: right;
    font-variant-numeric: tabular-nums;
}

.statusbar-run-count + .statusbar-run-count {
    margin-left: 5px;
}

.delta-enter-active {
    transition:
        max-width 0.24s cubic-bezier(0.22, 0.7, 0.3, 1),
        margin-left 0.24s cubic-bezier(0.22, 0.7, 0.3, 1),
        opacity 0.14s ease;
}

.delta-leave-active {
    transition:
        max-width 0.18s ease,
        margin-left 0.18s ease,
        opacity 0.09s ease;
}

.delta-enter-from,
.delta-leave-to {
    max-width: 0;
    margin-left: 0;
    opacity: 0;
}

.count-enter-active,
.count-leave-active {
    transition:
        max-width 0.22s cubic-bezier(0.22, 0.7, 0.3, 1),
        margin-left 0.22s cubic-bezier(0.22, 0.7, 0.3, 1),
        opacity 0.14s ease;
}

.count-enter-from,
.count-leave-to {
    max-width: 0;
    margin-left: 0;
    opacity: 0;
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

.statusbar-run-token.passed {
    color: var(--created);
}

.statusbar-run-token.failed {
    color: var(--danger);
}
</style>
