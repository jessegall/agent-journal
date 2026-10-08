<script setup>
import {agent} from "../composables/leadAgent.js";
import {autoOn, steered, workMode} from "../composables/settings.js";
import {store} from "../state/store.js";
import {barPlans, foldedPlans} from "../domain/plans.js";
import {currentWork, lineOf, named, queued, SILENT, stateOf, wordOf} from "../domain/agentState.js";
import {silentIn} from "../domain/journals.js";
import {FULLSCREEN_KEYS} from "../platform/fullscreen.js";
import PlanMore from "./PlanMore.vue";
import PSection from "./PSection.vue";

import {computed, ref, watch} from "vue";
import {api} from "../api/client.js";
import Dot from "../kit/Dot.vue";
import WaitMark from "../kit/WaitMark.vue";
import WaitingPanel from "../chat/WaitingPanel.vue";
import {useWaiting} from "../composables/waiting.js";
import Btn from "../kit/Btn.vue";
import Icon from "../kit/Icon.vue";
import Switch from "../kit/Switch.vue";
import Toast from "../kit/Toast.vue";
import Spinner from "../kit/Spinner.vue";
import {peek, route} from "../route.js";
import Segmented from "../kit/Segmented.vue";
import MenuPanel from "../kit/MenuPanel.vue";
import HelperList from "../chat/HelperList.vue";
import {useHelpers} from "../composables/helpers.js";
import {isWorking} from "../domain/helpers.js";
import {MODES} from "../domain/modes.js";
import {rows} from "../sync/rows.js";
import {runPlan, setAuto} from "../actions/work.js";

const current = computed(() => currentWork(rows("work")));
const reported = computed(() => stateOf(agent.value, rows("work")));
const toast = ref(null);

const wanted = ref(null);
const paused = computed(() => wanted.value ?? reported.value === "paused");
const silent = computed(() => silentIn(store.summary, route.value.env));
const state = computed(() => (paused.value ? "paused" : silent.value ? SILENT : reported.value === "paused" ? "idle" : reported.value));
watch(
    () => reported.value === "paused",
    (now) => wanted.value === now && (wanted.value = null)
);

const mode = workMode;
const {rows: helpers, refresh: refreshHelpers} = useHelpers();
const {waiting: waitingNow, open: waitingOpen, anchor: waitingAnchor, toggle: toggleWaiting} = useWaiting(helpers);
const helpersHeight = Math.min(520, Math.round(window.innerHeight * 0.7));
const helpersOut = computed(() => helpers.value.filter(isWorking).length);
const helpersOpen = ref(false);
const helpersAnchor = ref(null);
const modeOptions = computed(() =>
    MODES.map((one) => ({
        ...one,
        tip: {title: one.label, line: one.key === "solo" && helpersOut.value ? `${one.note} Helpers already out keep going until they finish.` : one.note},
    }))
);

function toggleHelpers(e) {
    helpersAnchor.value = e.currentTarget;
    helpersOpen.value = !helpersOpen.value;
}
const keepMode = (key) => (store.settings = {...store.settings, work_modes: {...store.settings.work_modes, mode: key}});

async function pickMode(key) {
    const was = mode.value;
    keepMode(key);
    try {
        await api.saveMode(key);
    } catch (e) {
        keepMode(was);
        toast.value = {text: e.message};
    }
}

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
const line = computed(() => {
    if (paused.value) return "held until you resume it";
    if (silent.value) return "started, but it never reported in";
    if (waitingNow.value) return current.value ? named(current.value) : "";
    return lineOf(agent.value, rows("work"), waiting.value, helpers.value);
});
const inspect = () => peek("work", current.value.n);
const roll = (event) => (waitingNow.value && !paused.value ? toggleWaiting(event) : current.value && inspect());
const was = ref("");
const sentence = computed(() => {
    const now = line.value;
    let i = 0;
    while (i < now.length && i < was.value.length && now[i] === was.value[i]) i += 1;
    const cut = i >= 6 && i < now.length ? now.lastIndexOf(" ", i) + 1 : 0;
    return {head: now.slice(0, cut), tail: now.slice(cut)};
});
watch(line, (now, before) => (was.value = before || ""));
const bars = computed(() => barPlans(rows("plan")));
const others = computed(() => foldedPlans(rows("plan")));
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
        <template v-if="state === 'waiting'">
            <WaitMark class="statusbar-dot" />
        </template>
        <template v-else>
            <Dot :class="['statusbar-dot', {live: state !== 'stopped', paused, silent: state === SILENT}]" kind="started" solid :size="8" />
        </template>
        <span class="statusbar-text">
            <b :class="{silent: state === SILENT}">{{ wordOf(state) }}</b>
            <component
                :is="current || waitingNow ? 'button' : 'span'"
                :type="current || waitingNow ? 'button' : null"
                :class="['statusbar-roll', {link: current || waitingNow}]"
                v-tip:roll="waitingNow ? {title: 'See what the agent is waiting on'} : current ? {title: 'Open this work', line: 'Shows what the agent is doing now.'} : null"
                @click="roll"
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
                v-tip:pause="
                    paused
                        ? {title: 'Resume', line: 'Tells the agent to carry on.'}
                        : {title: 'Pause', line: 'Stops the agent\'s current turn and holds back the journal\'s reminders.'}
                "
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
            <template v-if="!steered">
                <span class="statusbar-agentset">
                    <Switch
                        :on="autoOn"
                        word="auto"
                        labelled
                        v-tip:auto="
                            autoOn
                                ? {title: 'Auto is on', line: 'The agent works through the to-do list without asking.'}
                                : {title: 'Auto is off', line: 'The agent asks before picking up the next to-do.'}
                        "
                        @change="setAuto"
                    />
                    <Segmented class="statusbar-mode" :options="modeOptions" :value="mode" @pick="pickMode" />
                    <button
                        type="button"
                        :class="['statusbar-helpers', {none: !helpers.length}]"
                        v-tip:helpers="
                            helpersOut
                                ? {title: `${helpersOut} helpers out`, line: 'Opens the list of what they are doing.'}
                                : {title: 'Helpers', line: 'Agents on other providers this environment dispatched.'}
                        "
                        :aria-expanded="helpersOpen"
                        @click.stop="toggleHelpers"
                    >
                        <Icon name="family" />
                        {{ helpersOut }}
                    </button>
                </span>
                <template v-if="helpersOpen">
                    <MenuPanel
                        :anchor="helpersAnchor"
                        plain
                        :min-width="320"
                        :max-width="380"
                        :height="helpersHeight"
                        :gap="12"
                        @click.stop
                        @close="helpersOpen = false"
                    >
                        <HelperList :rows="helpers" @changed="refreshHelpers" @close="helpersOpen = false" />
                    </MenuPanel>
                </template>
            </template>
            <Btn
                kind="icon"
                class="statusbar-square"
                data-step="fullscreen"
                v-tip:wide="{title: store.wide ? 'Show the sidebar and the top bar' : 'Hide the sidebar and the top bar', keys: FULLSCREEN_KEYS}"
                @click="store.wide = !store.wide"
            >
                <Icon :name="store.wide ? 'narrow' : 'wide'" />
            </Btn>
        </span>
    </div>
    <template v-if="waitingOpen && waitingNow">
        <WaitingPanel :waiting="waitingNow" :anchor="waitingAnchor" @close="waitingOpen = false" />
    </template>
    <TransitionGroup name="planbar">
        <PSection
            v-for="bar in bars"
            :key="bar.n"
            :p="bar"
            :data="bar.data"
            :error="error"
            @run-bar="runBar"
            @failed="error = $event"
        />
    </TransitionGroup>
    <PlanMore :plans="others" />
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

.statusbar-dot.paused {
    --tone: var(--danger);
}

.statusbar-dot.silent {
    --tone: var(--tone-warn);
}

.statusbar-text b.silent {
    color: var(--tone-warn);
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
.statusbar-square.btn {
    justify-content: center;
    width: 28px;
    height: 28px;
    padding: 0;
}

.statusbar-pause.btn :deep(.ico),
.statusbar-square.btn :deep(.ico) {
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

.statusbar-agentset {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 3px 4px 3px 8px;
    border: 1px solid var(--border-2);
    border-radius: 8px;
}

.statusbar-helpers {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 3px 7px;
    border: 0;
    border-radius: 5px;
    background: none;
    color: var(--text-2);
    font: inherit;
    font-size: 12px;
    cursor: pointer;
}

.statusbar-helpers:hover,
.statusbar-helpers[aria-expanded="true"] {
    background: var(--hover);
    color: var(--text);
}

.statusbar-helpers.none {
    color: var(--text-4);
}

.statusbar-tools::before {
    content: "";
    align-self: stretch;
    width: 1px;
    margin: 3px 0;
    background: rgba(255, 255, 255, 0.14);
}

@media (max-width: 640px) {
    .statusbar {
        flex-wrap: wrap;
        height: auto;
        row-gap: 8px;
        padding: 8px 14px;
    }

    .statusbar-tools {
        flex: 1 0 100%;
        justify-content: space-between;
    }

    .statusbar-tools::before {
        display: none;
    }
}
</style>
