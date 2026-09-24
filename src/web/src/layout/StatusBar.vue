<script setup>
import {FULLSCREEN_KEYS} from "../platform/fullscreen.js";
import PSection from "./PSection.vue";

import {computed, onMounted, onUnmounted, ref, watch} from "vue";
import {api} from "../api/client.js";
import Dot from "../kit/Dot.vue";
import Btn from "../kit/Btn.vue";
import Icon from "../kit/Icon.vue";
import Switch from "../kit/Switch.vue";
import Toast from "../kit/Toast.vue";
import Spinner from "../kit/Spinner.vue";
import {peek, route} from "../route.js";
import {agent, autoOn, store} from "../state/store.js";
import {polled} from "../sync/polled.js";
import {rows} from "../sync/rows.js";
import {barPlan, currentWork, lineOf, otherPlans, queued, stateOf, wordOf} from "./statusline.js";
import {usePoll} from "../poll.js";
import {runPlan, setAuto} from "../actions/work.js";

usePoll(...polled.bar);
usePoll(...polled.agents);

const current = computed(() => currentWork(rows("work")));
const state = computed(() => stateOf(agent.value, rows("work")));
const toast = ref(null);

const wanted = ref(null);
const paused = computed(() => wanted.value ?? state.value === "paused");
watch(
    () => state.value === "paused",
    (now) => wanted.value === now && (wanted.value = null)
);

async function pauseOrResume() {
    const next = !paused.value;
    wanted.value = next;
    try {
        await (next ? api.pauseAgent(agent.value.title) : api.resumeAgent(agent.value.title));
    } catch (e) {
        wanted.value = null;
        toast.value = {text: e.message};
    }
}
const waiting = computed(() => queued(rows("todo"), autoOn.value, rows("question")));
const line = computed(() => lineOf(agent.value, rows("work"), waiting.value));
const inspect = () => peek("work", current.value.n);
const was = ref("");
const sentence = computed(() => {
    const now = line.value;
    let i = 0;
    while (i < now.length && i < was.value.length && now[i] === was.value[i]) i += 1;
    const cut = i >= 6 && i < now.length ? now.lastIndexOf(" ", i) + 1 : 0;
    return {head: now.slice(0, cut), tail: now.slice(cut)};
});
watch(line, (now, before) => (was.value = before || ""));
const bar = computed(() => barPlan(rows("plan"), !route.value.page));
const others = computed(() => otherPlans(rows("plan")));
const error = ref("");

async function runBar(p) {
    error.value = "";
    try {
        await runPlan(p);
    } catch (e) {
        error.value = e.message;
    }
}
</script>

<template>
    <div class="statusbar">
        <Dot :class="['statusbar-dot', {live: state !== 'stopped'}]" kind="started" solid :size="8" />
        <span class="statusbar-text">
            <b>{{ wordOf(state) }}</b>
            <component
                :is="current ? 'button' : 'span'"
                :type="current ? 'button' : null"
                :class="['statusbar-roll', {link: current}]"
                :title="current ? 'Open this work' : null"
                @click="current && inspect()"
            >
                <template v-if="sentence.head">
                    <span class="statusbar-head">{{ sentence.head }}</span>
                </template>
                <span class="statusbar-tail">
                    <Transition name="roll">
                        <span :key="sentence.tail" class="statusbar-line">{{ sentence.tail }}</span>
                    </Transition>
                </span>
            </component>
        </span>
        <template v-if="state !== 'stopped'">
            <Btn
                kind="icon"
                :class="['statusbar-pause', {paused}]"
                :title="paused ? 'Resume: tell the agent to carry on' : 'Pause: stop the agent\'s turn and hold the journal\'s nudges'"
                @click="pauseOrResume"
            >
                <template v-if="wanted !== null">
                    <Spinner />
                </template>
                <template v-else>
                    <Icon :name="paused ? 'resume' : 'pause'" />
                </template>
            </Btn>
        </template>
        <span class="statusbar-tools">
            <Switch
                :on="autoOn"
                word="auto"
                labelled
                :title="
                    autoOn ? 'The agent works through the to-do list without asking' : 'The agent asks before picking up the next to-do'
                "
                @change="setAuto"
            />
            <Btn
                kind="icon"
                class="statusbar-wide"
                data-step="fullscreen"
                :title="`${store.wide ? 'Show the sidebar and the top bar' : 'Hide the sidebar and the top bar'} (${FULLSCREEN_KEYS})`"
                @click="store.wide = !store.wide"
            >
                <Icon :name="store.wide ? 'narrow' : 'wide'" />
            </Btn>
        </span>
    </div>
    <Transition name="planbar">
        <PSection
            v-if="bar"
            :key="bar.n"
            :p="bar"
            :data="bar.data"
            :others="others"
            :error="error"
            @run-bar="runBar"
            @failed="error = $event"
        />
    </Transition>
    <Toast :toast="toast" @done="toast = null" />
</template>

<style scoped>
.statusbar {
    height: 52px;
    flex: none;
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 0 14px;
    position: relative;
    border-bottom: 1px solid var(--border);
    background: #17181b;
    cursor: pointer;
}

.statusbar:hover {
    background: #1b1c20;
}

.statusbar-dot {
    --tone: var(--text-3);
}

.statusbar-dot.live {
    --tone: var(--accent);
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
    color: var(--text);
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

.statusbar-roll.link {
    margin: -2px -5px;
    padding: 2px 5px;
    border: 0;
    border-radius: 6px;
    background: none;
    font: inherit;
    font-size: 13px;
    text-align: left;
    cursor: pointer;
    transition:
        background 0.15s,
        color 0.15s,
        text-decoration-color 0.15s;
}

.statusbar-roll.link:hover {
    background: var(--hover);
    color: var(--text);
    text-decoration-color: var(--text-2);
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

.statusbar-pause.btn,
.statusbar-wide.btn {
    justify-content: center;
    width: 28px;
    height: 28px;
    padding: 0;
}

.statusbar-pause.btn :deep(.ico),
.statusbar-wide.btn :deep(.ico) {
    width: 15px;
    height: 15px;
}

.statusbar-pause {
    position: relative;
    flex: none;
    margin-right: 8px;
}

.statusbar-pause.paused {
    color: var(--accent-text);
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
