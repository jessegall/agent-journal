<script setup>
import PSection from "./PSection.vue";

import {computed, ref, watch} from "vue";
import {act, saveSettings} from "../api.js";
import Icon from "../kit/Icon.vue";
import RunningCommand from "./RunningCommand.vue";
import Switch from "../kit/Switch.vue";
import {go, peek, route} from "../route.js";
import {agent, autoOn, rows, store} from "../store.js";
import {currentWork, doneOf, lineOf, phaseOf, planButton, queued, rowsOf, shownPlans, stateOf, wordOf} from "./statusline.js";

const current = computed(() => currentWork(rows("work")));
const state = computed(() => stateOf(agent.value, rows("work")));
const waiting = computed(() => queued(rows("todo"), autoOn.value, rows("question")));
const doing = computed(() => {
    const queue = (store.bar && store.bar.queue) || [];
    const last = queue[queue.length - 1];
    return last && !last.done ? last.key : "";
});
const line = computed(() => lineOf(agent.value, rows("work"), waiting.value, doing.value));
function inspect() {
    if (current.value) peek("work", current.value.n);
    else go(route.value.env);
}
const was = ref("");
const sentence = computed(() => {
    const now = line.value;
    let i = 0;
    while (i < now.length && i < was.value.length && now[i] === was.value[i]) i += 1;
    const cut = i >= 6 && i < now.length ? now.lastIndexOf(" ", i) + 1 : 0;
    return {head: now.slice(0, cut), tail: now.slice(cut)};
});
watch(line, (now, before) => (was.value = before || ""));
const plans = computed(() => shownPlans(rows("plan")));
const error = ref("");
const done = (p) => doneOf(p, rows("todo"));

async function setAuto(on) {
    await saveSettings(route.value.env, {features: {auto: on}});
}

async function runBar(p) {
    error.value = "";
    try {
        await act(route.value.env, "plan", p.n, planButton(p)[0]);
    } catch (e) {
        error.value = e.message;
    }
}
</script>

<template>
    <div class="statusbar" @click.self="inspect">
        <span :class="['statusbar-dot', {live: state !== 'stopped'}]" />
        <button type="button" class="statusbar-text" @click="inspect">
            <b>{{ wordOf(state, waiting) }}</b>
            <span class="statusbar-roll">
                <template v-if="sentence.head">
                    <span class="statusbar-head">{{ sentence.head }}</span>
                </template>
                <span class="statusbar-tail">
                    <Transition name="roll">
                        <span :key="sentence.tail" class="statusbar-line">{{ sentence.tail }}</span>
                    </Transition>
                </span>
            </span>
        </button>
        <RunningCommand />
        <span class="statusbar-tools">
            <Switch
                :on="autoOn"
                word="auto"
                :title="
                    autoOn ? 'The agent works through the to-do list without asking' : 'The agent asks before picking up the next to-do'
                "
                @change="setAuto"
            />
            <button
                type="button"
                class="statusbar-wide"
                :title="store.wide ? 'Show the sidebar and the top bar' : 'Hide the sidebar and the top bar'"
                @click="store.wide = !store.wide"
            >
                <Icon :name="store.wide ? 'narrow' : 'wide'" />
            </button>
        </span>
    </div>
    <TransitionGroup name="planbar">
        <PSection v-for="p in plans" :key="p.n" :plans="plans" :error="error" :data="p.data" :p="p" @run-bar="runBar" />
    </TransitionGroup>
</template>

<style scoped>
.statusbar {
    height: 52px;
    flex: none;
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 0 16px 0 20px;
    position: relative;
    border-bottom: 1px solid var(--border);
    background: #17181b;
    cursor: pointer;
}

.statusbar:hover {
    background: #1b1c20;
}

.statusbar-dot {
    width: 8px;
    height: 8px;
    flex: none;
    border-radius: 50%;
    background: var(--text-3);
}

.statusbar-dot.live {
    background: var(--accent);
}

.statusbar-text {
    flex: 1 1 0%;
    min-width: 0;
    display: flex;
    align-items: center;
    overflow: hidden;
    white-space: nowrap;
    margin: 0 -7px;
    padding: 3px 7px;
    border: none;
    border-radius: 7px;
    background: transparent;
    color: var(--text);
    text-align: left;
    cursor: pointer;
}

.statusbar-text b {
    flex: none;
    font-weight: 500;
    font-size: 13.5px;
    margin-right: 8px;
}

.statusbar-roll {
    flex: 0 1 auto;
    min-width: 0;
    position: relative;
    display: flex;
    align-items: baseline;
    font-size: 13px;
    color: var(--text-2);
    text-decoration-line: underline;
    text-decoration-color: color-mix(in srgb, var(--text-3) 55%, transparent);
    text-decoration-thickness: 1px;
    text-underline-offset: 4px;
}

.statusbar-head {
    flex: none;
    white-space: pre;
}

.statusbar-tail {
    position: relative;
    flex: 0 1 auto;
    min-width: 0;
    display: flex;
    align-items: baseline;
}

.statusbar-line {
    flex: 0 1 auto;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.roll-enter-active {
    transition:
        opacity 180ms ease,
        transform 180ms cubic-bezier(0.22, 0.7, 0.3, 1);
}

.roll-leave-active {
    position: absolute;
    transition:
        opacity 140ms ease,
        transform 140ms cubic-bezier(0.22, 0.7, 0.3, 1);
}

.roll-enter-from {
    opacity: 0;
    transform: translateY(5px);
}

.roll-leave-to {
    opacity: 0;
    transform: translateY(-5px);
}

.statusbar-wide {
    display: inline-flex;
    align-items: center;
    padding: 2px;
    border: 0;
    border-radius: 6px;
    background: none;
    color: var(--text-3);
    cursor: pointer;
}

.statusbar-wide:hover {
    color: var(--text-1);
}

.statusbar-tools {
    flex: 0 1 auto;
    min-width: 0;
    display: flex;
    align-items: center;
    gap: 14px;
}

.statusbar-tools::before {
    content: "";
    align-self: stretch;
    width: 1px;
    margin: 3px 0;
    background: rgba(255, 255, 255, 0.14);
}

</style>
