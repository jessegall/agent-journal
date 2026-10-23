<script setup>
import RollingWord from "../kit/RollingWord.vue";
import {agent} from "../composables/leadAgent.js";
import {autoOn, workMode} from "../composables/settings.js";
import {MODES} from "../domain/modes.js";
import {api} from "../api/client.js";
import Segmented from "../kit/Segmented.vue";
import Spinner from "../kit/Spinner.vue";
import {relativeText} from "../format/relativeText.js";
import {store} from "../state/store.js";
import {barPlans, foldedPlans} from "../domain/plans.js";
import {heldTask, lineOf, named, queued, SILENT, silentIn, stateOf, wordOf} from "../domain/agentState.js";
import {FULLSCREEN_KEYS} from "../platform/fullscreen.js";
import PlanMore from "./PlanMore.vue";
import PSection from "./PSection.vue";

import {computed, ref, watch} from "vue";
import Dot from "../kit/Dot.vue";
import WaitMark from "../kit/WaitMark.vue";
import WaitingPanel from "../chat/WaitingPanel.vue";
import {useWaiting} from "../composables/waiting.js";
import {useSyncLine} from "../composables/syncLine.js";
import Btn from "../kit/Btn.vue";
import Icon from "../kit/Icon.vue";
import Switch from "../kit/Switch.vue";
import Toast from "../kit/Toast.vue";
import {peek, route} from "../route.js";
import MenuPanel from "../kit/MenuPanel.vue";
import WorkerList from "../chat/WorkerList.vue";
import {useEveryWorker, useWorkers} from "../composables/workers.js";
import {isWorking} from "../domain/workers.js";
import {rows} from "../sync/rows.js";
import {runPlan, setAuto} from "../actions/work.js";

const current = computed(() => heldTask(store.summary, route.value.env));
const syncLine = useSyncLine();
const hosted = computed(() => Boolean(store.people && store.people.hosted));

// a hosted journal's browser signs out and goes back to the sign-in
async function signOut() {
    await api.signOut();
    window.location.assign("/sign-in");
}
const reported = computed(() => stateOf(agent.value));
const toast = ref(null);

const silent = computed(() => silentIn(store.summary, route.value.env));
const wanted = ref(null);
const paused = computed(() => wanted.value ?? agent.value?.state === "paused");
const state = computed(() => (paused.value ? "paused" : silent.value ? SILENT : reported.value));
watch(
    () => agent.value?.state === "paused",
    (now) => wanted.value === now && (wanted.value = null)
);
const running = computed(() => Boolean(agent.value) && agent.value.status !== "stopped");

const {rows: workers, refresh: refreshWorkers} = useWorkers();
const {waiting: waitingNow, open: waitingOpen, anchor: waitingAnchor, toggle: toggleWaiting} = useWaiting(workers);
const workersHeight = Math.min(520, Math.round(window.innerHeight * 0.7));
const workersOut = computed(() => workers.value.filter(isWorking).length);
const workersOpen = ref(false);
const {rows: everyWorker, loaded: everyWorkerLoaded, refresh: refreshEveryWorker} = useEveryWorker(workersOpen);
const workersAnchor = ref(null);

const modeOptions = computed(() =>
    MODES.map((one) => ({
        ...one,
        tip: {title: one.label, line: one.key === "solo" && workersOut.value ? `${one.note} Workers already out keep going until they finish.` : one.note},
    }))
);
const keepMode = (key) => (store.settings = {...store.settings, workers: {...store.settings.workers, mode: key}});

async function pickMode(key) {
    const was = workMode.value;
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
        await (next ? api.pauseAgent(agent.value.id) : api.resumeAgent(agent.value.id));
    } catch (e) {
        wanted.value = null;
        toast.value = {text: e.message};
    }
}

function toggleWorkers(e) {
    workersAnchor.value = e.currentTarget;
    workersOpen.value = !workersOpen.value;
    if (workersOpen.value) refreshEveryWorker();
}

const waiting = computed(() => queued(rows("tasks"), autoOn.value));
const line = computed(() => {
    if (paused.value) return "held until you resume it";
    if (silent.value) return "started, but it never reported in";
    if (waitingNow.value && current.value) return named(current.value);
    const text = lineOf(agent.value, current.value, waiting.value, workers.value);
    return text.startsWith("task ") ? text : relativeText(text, store.summary?.project);
});
const inspect = () => peek("tasks", current.value.id);
const roll = (event) => (waitingNow.value && !paused.value ? toggleWaiting(event) : current.value && inspect());
const was = ref("");
// What the line keeps from the line before it stands still while the rest rolls in. The kept part must be long enough to be a
// phrase on its own: a shorter one leaves the bar reading "task" by itself for the length of the roll, which says the wrong thing.
const KEEPS_STILL_FROM = 16;
const sentence = computed(() => {
    const now = line.value;
    let i = 0;
    while (i < now.length && i < was.value.length && now[i] === was.value[i]) i += 1;
    const cut = i >= KEEPS_STILL_FROM && i < now.length ? now.lastIndexOf(" ", i) + 1 : 0;
    return {head: now.slice(0, cut), tail: now.slice(cut)};
});
watch(line, (now, before) => (was.value = before || ""));
const bars = computed(() => barPlans(rows("plans")));
const others = computed(() => foldedPlans(rows("plans")));
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
            <b :class="{silent: state === SILENT}"><RollingWord :text="wordOf(state)" /></b>
            <component
                :is="current || waitingNow ? 'button' : 'span'"
                :type="current || waitingNow ? 'button' : null"
                :class="['statusbar-roll', {link: current || waitingNow}]"
                v-tip:roll="waitingNow ? {title: 'Show what the agent needs to go ahead'} : current ? {title: 'Open this task', line: 'Shows what the agent is doing now.'} : null"
                @click="roll"
            >
                <template v-if="sentence.head">
                    <span class="statusbar-head">{{ sentence.head }}</span>
                </template>
                <span class="statusbar-tail">
                    <RollingWord :text="sentence.tail" class="statusbar-line" />
                </span>
                <template v-if="current || waitingNow">
                    <Icon name="caret" :size="12" :class="['statusbar-chevron', {open: waitingOpen}]" />
                </template>
            </component>
        </span>
        <template v-if="running">
            <Btn
                kind="icon"
                :class="['statusbar-pause', {paused}]"
                v-tip:pause="
                    paused
                        ? {title: 'Resume', line: 'Tells the agent to carry on where it stopped.'}
                        : {title: 'Pause', line: 'The agent finishes the step it is on, then waits until you resume it or write to it.'}
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
        <template v-if="syncLine">
            <span class="statusbar-sync">{{ syncLine }}</span>
        </template>
        <template v-if="hosted">
            <Btn kind="ghost" class="statusbar-sign-out" v-tip="{title: 'Sign out', line: 'Ends this browser\'s session on the team\'s journal.'}" @click="signOut">Sign out</Btn>
        </template>
        <span class="statusbar-tools">
            <span class="statusbar-agentset">
                <Switch
                    :on="autoOn"
                    word="auto"
                    labelled
                    v-tip:auto="
                        autoOn
                            ? {title: 'Auto is on', line: 'The agent works through the task list without asking.'}
                            : {title: 'Auto is off', line: 'The agent asks before picking up the next task.'}
                    "
                    @change="setAuto"
                />
                <Segmented class="statusbar-mode" :options="modeOptions" :value="workMode" @pick="pickMode" />
                <button
                    type="button"
                    :class="['statusbar-helpers', {none: !workers.length}]"
                    v-tip:workers="
                        workersOut
                            ? {title: `${workersOut} workers out`, line: 'Opens the list of what they are doing.'}
                            : {title: 'Workers', line: 'Agents this environment sent to write a job each.'}
                    "
                    :aria-expanded="workersOpen"
                    @click.stop="toggleWorkers"
                >
                    <Icon name="family" />
                    {{ workersOut }}
                </button>
            </span>
            <template v-if="workersOpen">
                <MenuPanel
                    :anchor="workersAnchor"
                    plain
                    :min-width="320"
                    :max-width="380"
                    :height="workersHeight"
                    :gap="12"
                    @click.stop
                    @close="workersOpen = false"
                >
                    <WorkerList :rows="everyWorker" :loading="!everyWorkerLoaded" @changed="refreshEveryWorker(), refreshWorkers()" @close="workersOpen = false" />
                </MenuPanel>
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
            :key="bar.id"
            :p="bar"
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

.statusbar-pause {
    position: relative;
    flex: none;
    margin-right: 8px;
}

.statusbar-pause.paused {
    color: var(--accent-text);
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

.statusbar-chevron {
    flex: none;
    align-self: center;
    margin-left: 4px;
    color: var(--text-3);
    transition: transform 0.15s;
}

.statusbar-chevron.open {
    transform: rotate(180deg);
}

.statusbar-roll.link:hover .statusbar-chevron {
    color: var(--text-2);
}

.statusbar-head {
    flex: 0 1000 auto;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
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

.statusbar-sync {
    flex: none;
    margin-right: 12px;
    font-size: 11px;
    color: var(--text-3);
    white-space: nowrap;
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
        flex-wrap: wrap;
        row-gap: 8px;
        justify-content: space-between;
    }

    .statusbar-tools::before {
        display: none;
    }

    .statusbar-agentset {
        flex-wrap: wrap;
        row-gap: 8px;
        min-width: 0;
        max-width: 100%;
    }
}
</style>
