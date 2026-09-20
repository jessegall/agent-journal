<script setup>
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
        <div v-for="p in plans" :key="p.n" :class="['planbar', `planbar-${p.data.status}`]">
            <a class="planbar-link" :href="`#/${route.env}/plan/${p.n}`" :title="`Plan ${p.n}: ${p.title}`">
                <span class="planbar-n">Plan</span>
                <span class="planbar-dot">·</span>
                <span class="planbar-title">{{ p.title }}</span>
                <template v-if="phaseOf(p)">
                    <span class="planbar-dot">·</span>
                    <span class="planbar-phase">{{ phaseOf(p) }}</span>
                </template>
                <span class="planbar-step">{{ p.data.current || 1 }}/{{ p.data.phases.length }}</span>
                <span class="planbar-track" role="progressbar">
                    <span :style="{width: `${(100 * done(p)) / Math.max(1, rowsOf(p).length)}%`}" />
                </span>
            </a>
            <template v-if="planButton(p)">
                <button type="button" :class="['planbar-act', {ack: p.data.status === 'done'}]" @click="runBar(p)">
                    {{ planButton(p)[1] }}
                    <Icon name="arrow" />
                </button>
            </template>
            <template v-if="error">
                <span class="planbar-error">{{ error }}</span>
            </template>
        </div>
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

.planbar {
    display: flex;
    align-items: center;
    gap: 10px;
    height: 30px;
    padding: 0 8px 0 0;
    border-bottom: 1px solid var(--line);
    background: var(--bg-2);
    color: var(--text-2);
    font-size: 11.5px;
}

.planbar-link {
    flex: 1;
    min-width: 0;
    display: flex;
    align-items: center;
    gap: 10px;
    height: 100%;
    padding: 0 14px 0 20px;
    color: inherit;
}

.planbar-link:hover {
    background: rgba(255, 255, 255, 0.03);
    color: var(--text);
}

.planbar-n {
    flex: none;
    font-weight: 600;
    color: var(--text);
}

.planbar-title {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.planbar-dot {
    flex: none;
    color: var(--text-3);
}

.planbar-phase {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: var(--text-3);
    font-size: 11px;
}

.planbar-step {
    flex: none;
    margin-left: auto;
    color: var(--text-3);
    font-size: 11px;
    font-variant-numeric: tabular-nums;
}

.planbar-track {
    flex: none;
    width: 120px;
    height: 4px;
    border-radius: 3px;
    overflow: hidden;
    background: var(--line);
}

.planbar-track > span {
    display: block;
    height: 100%;
    border-radius: 3px;
    background: var(--accent);
    transition: width 0.3s ease;
}

.planbar-act {
    flex: none;
    display: inline-flex;
    align-items: center;
    gap: 5px;
    height: 22px;
    padding: 0 10px;
    border: 1px solid color-mix(in srgb, var(--accent) 55%, transparent);
    border-radius: 6px;
    background: color-mix(in srgb, var(--accent) 22%, transparent);
    color: var(--text);
    font-size: 11px;
    cursor: pointer;
}

.planbar-act:hover {
    background: color-mix(in srgb, var(--accent) 34%, transparent);
}

.planbar-act .ico {
    width: 11px;
    height: 11px;
    color: inherit;
}

.planbar-act.ack {
    border-color: var(--border-2);
    background: var(--raised);
}

.planbar-error {
    flex: none;
    color: var(--danger);
    font-size: 11px;
}

.planbar-enter-active,
.planbar-leave-active {
    overflow: hidden;
    transition:
        height 0.22s ease,
        opacity 0.18s ease;
}

.planbar-enter-from,
.planbar-leave-to {
    height: 0;
    opacity: 0;
    border-bottom-width: 0;
}
</style>
