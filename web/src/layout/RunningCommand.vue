<script setup>
import {computed, nextTick, onUnmounted, ref, watch} from "vue";
import {agent, store} from "../store.js";

const STEP = 700;
const HOLD_EDITS = 1000;
const DELTA_LEAVE = 240;
const SHOW_CLOCK_AFTER = 10;
const COUNT_UP = 360;
const told = computed(() => {
    const run = data.value && data.value.running;
    const words = store.bar && store.bar.line;
    return run && words && words.at === run.at && words.tokens && words.tokens.length ? words : null;
});

function ownWords() {
    return null;
}
const data = computed(() => (agent.value && ["working", "compacting"].includes(agent.value.data.status) ? agent.value.data : null));
const ticks = ref(0);
const timer = setInterval(() => (ticks.value += 1), 500);
const seen = {at: 0};
const pending = [];
const rolling = ref(null);
const counts = ref({added: 0, removed: 0});
const showDelta = ref(false);
const frames = {added: 0, removed: 0};
const tally = new Map();
const retired = new Set();
let rolls = null;

function roll() {
    rolling.value = pending.shift() || null;
    rolls = rolling.value ? setTimeout(roll, STEP) : null;
}

watch(
    () => store.bar && store.bar.commands,
    (ring) => {
        if (!ring) return;
        const first = !seen.at;
        for (const c of ring) {
            if (c.at <= seen.at) continue;
            seen.at = c.at;
            if (!first) pending.push({key: c.key, text: c.key, parts: (c.parts || []).map(shownPart)});
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
let started = 0;
let heldAt = 0;

function shownPart(part) {
    const values = Array.isArray(part.value) ? part.value : [part.value];
    const at = values.length > 1 ? Math.floor(Date.now() / ((part.duration || 0.5) * 1000)) % values.length : 0;
    return {values, at, value: values[at], color: part.color || "muted", align: part.align || "left"};
}

function fromJournal(run, words) {
    const secs = Math.floor((run.done || Date.now() / 1000) - run.at);
    const parts = (words.parts || []).map(shownPart);
    return {
        key: words.key,
        text: parts.map((p) => p.value).join(" "),
        parts,
        clock: words.clock ? clock(secs) : "",
        done: words.done,
    };
}

function lineFor(run, words = null) {
    return run && run.what && words ? fromJournal(run, words) : null;
}

const LINGERS = 10;
const last = {line: null, at: 0, lingers: 0};

const line = computed(() => {
    ticks.value;
    if (stay.value) return stay.value;
    if (rolling.value) return rolling.value;
    const now = lineFor(data.value && data.value.running, told.value);
    if (now) {
        last.line = now;
        last.at = Date.now();
        const lingers = told.value ? told.value.lingers : LINGERS;
        last.lingers = lingers === true ? Infinity : (lingers === undefined ? LINGERS : lingers) * 1000;
        return now;
    }
    return last.line && Date.now() - last.at < last.lingers ? {...last.line, done: true} : null;
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
    () => (line.value ? line.value.parts.map((p, i) => `${i}-${p.value}`) : []),
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

const holds = {at: 0, ms: 0, line: null};

watch(told, (words) => {
    if (!words || !words.hold) return;
    holds.at = words.at;
    holds.ms = words.hold * 1000;
    holds.line = fromJournal(data.value.running, words);
});

function held(run) {
    return run && holds.at === run.at && holds.ms > 0;
}

function total() {
    const sum = {added: 0, removed: 0};
    tally.forEach((c) => {
        sum.added += c.added || 0;
        sum.removed += c.removed || 0;
    });
    return sum;
}

function retire() {
    tally.forEach((_, at) => retired.add(at));
    retired.add(heldAt);
    tally.clear();
}

function endStreak() {
    clearTimeout(resetting);
    resetting = setTimeout(() => {
        retire();
        apply(total());
        resetting = setTimeout(() => (stay.value = null), DELTA_LEAVE);
    }, holds.ms || HOLD_EDITS);
}

function counted(run) {
    if (!run || !run.at || !run.changed || retired.has(run.at)) return false;
    const was = tally.get(run.at);
    if (was && was.added === run.changed.added && was.removed === run.changed.removed) return false;
    tally.set(run.at, run.changed);
    return true;
}

watch(
    () => data.value && data.value.running,
    (run) => {
        if (!run || !run.what) {
            if (!stay.value) retire();
            apply(total());
            return;
        }
        const before = run.before;
        const late = counted(before);
        counted(run);
        if (run.at !== started) {
            started = run.at;
            clearTimeout(resetting);
            stay.value = null;
            if (!held(run) && held(before)) {
                heldAt = before.at;
                stay.value = holds.line;
                endStreak();
            } else if (!held(run)) {
                retire();
            }
        } else if (late && stay.value && before.at === heldAt) {
            endStreak();
        }
        apply(total());
    },
    {immediate: true, deep: true}
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
    const began = performance.now();
    const frame = (now) => {
        const at = Math.min(1, (now - began) / COUNT_UP);
        const eased = 1 - (1 - at) ** 3;
        counts.value = {...counts.value, [kind]: Math.round(from + (to - from) * eased)};
        if (at < 1) frames[kind] = requestAnimationFrame(frame);
    };
    frames[kind] = requestAnimationFrame(frame);
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
                        v-for="(part, i) in line.parts"
                        :key="`${i}-${part.value}`"
                        :class="['statusbar-run-token', part.color, {fresh: fresh.has(`${i}-${part.value}`)}]"
                    >
                        <template v-if="part.values.length > 1">
                            <span :class="['statusbar-run-roll', part.align]">
                                <template v-for="(one, j) in part.values" :key="one">
                                    <span :class="['statusbar-run-item', {on: j === part.at}]">{{ one }}</span>
                                </template>
                            </span>
                        </template>
                        <template v-else>{{ part.value }}</template>
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

.statusbar-run-roll {
    display: inline-grid;
    min-width: 0;
}

.statusbar-run-roll.right {
    justify-items: end;
}

.statusbar-run-item {
    grid-area: 1 / 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    visibility: hidden;
    opacity: 0;
    transition: opacity 160ms ease;
}

.statusbar-run-item.on {
    visibility: visible;
    opacity: 1;
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

.statusbar-run-token.green {
    color: var(--created);
}

.statusbar-run-token.red {
    color: var(--danger);
}
</style>
