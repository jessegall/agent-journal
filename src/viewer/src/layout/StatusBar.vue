<script setup>
import RollingWord from "../kit/RollingWord.vue";
import {agent} from "../composables/leadAgent.js";
import {autoOn, workMode} from "../composables/settings.js";
import {MODES, modeToggles, switchQuestion, toggleOn, toggleValue} from "../domain/modes.js";
import {api} from "../api/client.js";
import {saveSettings} from "../actions/settings.js";
import Segmented from "../kit/Segmented.vue";
import Spinner from "../kit/Spinner.vue";
import {relativeText} from "../format/relativeText.js";
import {store} from "../state/store.js";
import {heldTask, lineOf, named, queued, SILENT, silentIn, stateOf, wordOf} from "../domain/agentState.js";
import {FULLSCREEN_KEYS} from "../platform/fullscreen.js";

import {computed, ref, watch} from "vue";
import Dot from "../kit/Dot.vue";
import WaitMark from "../kit/WaitMark.vue";
import WaitingPanel from "../chat/WaitingPanel.vue";
import {useWaiting} from "../composables/waiting.js";
import Btn from "../kit/Btn.vue";
import Icon from "../kit/Icon.vue";
import Toast from "../kit/Toast.vue";
import {peek, route} from "../route.js";
import MenuPanel from "../kit/MenuPanel.vue";
import WorkerList from "../chat/WorkerList.vue";
import {useEveryWorker, useWorkerActivity, useWorkers} from "../composables/workers.js";
import {useEveryReviewer} from "../composables/reviewers.js";
import AgentDropdown from "../chat/AgentDropdown.vue";
import {newestFirst, reviewerEntry} from "../domain/agentEntries.js";
import FitnessTimeline from "./FitnessTimeline.vue";
import {isWorking} from "../domain/workers.js";
import {rows} from "../sync/rows.js";

const current = computed(() => heldTask(store.summary, route.value.env));
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
const {rows: workerMoments, loaded: workerMomentsLoaded, refresh: refreshWorkerMoments} = useWorkerActivity(workersOpen);
const workersAnchor = ref(null);

const fitness = computed(() => agent.value?.fitness || null);
const fitnessShown = computed(() => (fitness.value.is_measured ? fitness.value.score : "–"));
const modeOptions = computed(() =>
    MODES.map((one) => ({
        ...one,
        label: one.label,
        opens: "dialog",
        tip: {title: one.label, toggles: toggles(one.key), line: (one.key === "solo" && workersOut.value ? `${one.note} Workers already out keep going until they finish.` : one.note)},
    }))
);
// the score below which the fitness is shown as low
const LOW_FITNESS = 75;
const DANGER_FITNESS = 25;
const fitnessTip = computed(
    () =>
        fitness.value &&
        (fitness.value.is_measured
            ? {title: `Fitness ${fitness.value.score} of 100`, line: "Opens the measures furthest off this mode's ideal and the scores of the last hours."}
            : {title: "Fitness not measured yet", line: "The agent has not made enough tool uses in this mode to be scored. Opens the scores of the last hours."})
);
const fitnessOpen = ref(false);
const fitnessAnchor = ref(null);

function toggleFitness(e) {
    fitnessAnchor.value = e.currentTarget;
    fitnessOpen.value = !fitnessOpen.value;
}
// the load of the work mode the agent is in, arrivals over clearings, shown beside the fitness and never scored, none in solo, where it is still counted; toned by workers.load_warn and workers.load_critical, the builder's by workers.builder_load_ceiling
const load = computed(() => (workMode.value === "solo" ? null : agent.value?.load || null));
// the user's messages measured apart from the workers' items, arrivals over clearings
const loadLevel = computed(() => {
    const levels = store.settings?.workers || {};
    if (!load.value) return "";
    if (workMode.value === "builder") return load.value.rho >= (levels.builder_load_ceiling ?? 0.5) ? "warn" : "";
    if (load.value.rho >= (levels.load_critical ?? 0.9)) return "critical";
    return load.value.rho >= (levels.load_warn ?? 0.7) ? "warn" : "";
});
// the load is the work and the messages the agent clears, added as one server's load is; its tooltip names each part
const workLine = (work) =>
    work &&
    `Work ${work.rho.toFixed(2)}: ${Math.round(work.arrivals)} arrive and ${Math.round(work.clearings)} are cleared an hour, ${work.waiting} wait.${work.waiting_refs.length ? ` Oldest first: ${work.waiting_refs.slice(0, 4).map((ref) => ref.replace(/s:/, " ")).join(", ")}.` : ""}`;
const messagesLine = (messages) => messages && `Messages ${messages.rho.toFixed(2)}: ${messages.waiting} of your messages wait for an answer.`;
const loadTip = computed(
    () =>
        load.value && {
            title: `Load ${load.value.rho.toFixed(2)}`,
            line: [workLine(load.value.work), messagesLine(load.value.messages)].filter(Boolean).join(" "),
        }
);
const keepMode = (key) => (store.settings = {...store.settings, workers: {...store.settings.workers, mode: key}});

const modeAsk = ref(null);
const modeAnchor = ref(null);

function askMode(key) {
    const question = key === workMode.value ? "" : switchQuestion(key, {task: current.value, workersOut: workersOut.value, state: stateOf(agent.value)});
    if (!question) return pickMode(key);
    modeAsk.value = {key, question};
}

function confirmMode() {
    const key = modeAsk.value.key;
    modeAsk.value = null;
    pickMode(key);
}

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

// a mode's settings as toggles in its button's hover panel, each saved as the user's own
const toggles = (mode) =>
    modeToggles(mode).map((toggle) => ({
        key: toggle.name,
        label: toggle.label,
        note: toggle.note,
        on: toggleOn(toggle, store.settings),
        change: (on) => saveToggle(toggle, on),
        choices: toggle.children && toggleOn(toggle, store.settings) ? childChoices(toggle.children) : [],
        pick: (value) => saveToggle(toggle.children, value),
    }));
const childChoices = (children) => children.choices.map((choice) => ({...choice, current: choice.value === toggleValue(children, store.settings)}));

async function saveToggle(toggle, value) {
    try {
        await saveSettings({[toggle.feature]: {[toggle.name]: value}});
    } catch (e) {
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

const reviewersOpen = ref(false);
const reviewersAnchor = ref(null);
const {rows: everyReviewer, loaded: everyReviewerLoaded, refresh: refreshEveryReviewer} = useEveryReviewer(reviewersOpen);

function toggleReviewers(e) {
    reviewersAnchor.value = e.currentTarget;
    reviewersOpen.value = !reviewersOpen.value;
    if (reviewersOpen.value) refreshEveryReviewer();
}

const reviewerEntries = computed(() => newestFirst(everyReviewer.value.map(reviewerEntry)));
const reviewing = computed(() => everyReviewer.value.filter((row) => row.state === "reviewing").length);

function toggleWorkers(e) {
    workersAnchor.value = e.currentTarget;
    workersOpen.value = !workersOpen.value;
    if (workersOpen.value) refreshEveryWorker(), refreshWorkerMoments();
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
        <span class="statusbar-tools">
            <span class="statusbar-agentset">
                <template v-if="fitness">
                    <button
                        type="button"
                        :class="['statusbar-fitness', {low: fitness.is_measured && fitness.score < LOW_FITNESS, danger: fitness.is_measured && fitness.score < DANGER_FITNESS}]"
                        v-tip:fitness="fitnessTip"
                        :aria-expanded="fitnessOpen"
                        @click.stop="toggleFitness"
                    >
                        {{ fitnessShown }}
                    </button>
                </template>
                <template v-if="load">
                    <span :class="['statusbar-load', loadLevel]" v-tip:load="loadTip">{{ load.rho.toFixed(2) }}</span>
                </template>
                <span ref="modeAnchor" class="statusbar-mode-wrap">
                    <Segmented class="statusbar-mode" :options="modeOptions" :value="workMode" @pick="askMode" />
                </span>
                <template v-if="modeAsk">
                    <MenuPanel :anchor="modeAnchor" :gap="8" :max-width="320" @click.stop @close="modeAsk = null">
                        <div class="mode-ask">
                            <p>{{ modeAsk.question }}</p>
                            <div class="mode-ask-actions">
                                <Btn small @click="modeAsk = null">Keep the mode</Btn>
                                <Btn small kind="primary" @click="confirmMode">Switch</Btn>
                            </div>
                        </div>
                    </MenuPanel>
                </template>
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
                <button
                    type="button"
                    class="statusbar-helpers"
                    v-tip:reviewers="{title: 'Reviewers', line: 'Agents the journal sends to test and check each worker\'s work. Opens the list.'}"
                    :aria-expanded="reviewersOpen"
                    @click.stop="toggleReviewers"
                >
                    <Icon name="reviewer" />
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
                    <WorkerList :rows="everyWorker" :loading="!everyWorkerLoaded" :moments="workerMoments" :moments-loading="!workerMomentsLoaded" @changed="refreshEveryWorker(), refreshWorkers()" @close="workersOpen = false" />
                </MenuPanel>
            </template>
            <template v-if="fitnessOpen && fitness">
                <MenuPanel :anchor="fitnessAnchor" plain :min-width="340" :max-width="380" :max-height="workersHeight" :gap="12" @click.stop @close="fitnessOpen = false">
                    <FitnessTimeline :score="fitness.score" :points="fitness.timeline" :measures="fitness.measures || []" :band="fitness.band || 'none'" :band-changed-at="fitness.band_changed_at || 0" :hours="fitness.timeline_hours" :low="LOW_FITNESS" @close="fitnessOpen = false" />
                </MenuPanel>
            </template>
            <template v-if="reviewersOpen">
                <MenuPanel
                    :anchor="reviewersAnchor"
                    plain
                    :min-width="300"
                    :max-width="360"
                    :height="workersHeight"
                    :gap="12"
                    @click.stop
                    @close="reviewersOpen = false"
                >
                    <AgentDropdown
                        title="Reviewers"
                        :entries="reviewerEntries"
                        :counts="reviewing ? `${reviewing} reviewing` : ''"
                        none="No reviewer has been sent here yet. The journal sends one when a worker clocks out, in orchestrator mode with the reviewer on."
                        :loading="!everyReviewerLoaded"
                        @close="reviewersOpen = false"
                    />
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
    <Toast :toast="toast" @done="toast = null" />
</template>

<style scoped>
.mode-ask {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 12px;
}

.mode-ask p {
    margin: 0;
    font-size: 13px;
}

.mode-ask-actions {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
}

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

.statusbar-fitness {
    padding: 1px 6px;
    border-radius: 9px;
    background: color-mix(in srgb, var(--tone-good) 18%, transparent);
    color: var(--text-2);
    font-size: 11px;
    font-variant-numeric: tabular-nums;
    border: none;
    font-family: inherit;
    cursor: pointer;
}

.statusbar-fitness.low {
    background: color-mix(in srgb, var(--tone-warn) 22%, transparent);
}

.statusbar-fitness.danger {
    background: color-mix(in srgb, var(--tone-bad) 24%, transparent);
}

.statusbar-load {
    padding: 1px 6px;
    border-radius: 9px;
    background: color-mix(in srgb, var(--text-2) 12%, transparent);
    color: var(--text-2);
    font-size: 11px;
    font-variant-numeric: tabular-nums;
    cursor: default;
}

.statusbar-load.warn {
    background: color-mix(in srgb, var(--tone-warn) 22%, transparent);
}

.statusbar-load.critical {
    background: color-mix(in srgb, var(--tone-bad) 24%, transparent);
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
