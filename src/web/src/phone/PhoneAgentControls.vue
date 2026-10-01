<script setup>
import {computed, inject, ref, watch} from "vue";
import {phone, PhoneError} from "../api/phone.js";
import {resetLabel as resets, usedPercent as used} from "../format/usage.js";
import Spinner from "../kit/Spinner.vue";
import Segmented from "../kit/Segmented.vue";
import {MODES, modeOf} from "../domain/modes.js";
import {announce, tell} from "./announce.js";
import {ended} from "./outbox.js";

const props = defineProps({
    running: {type: Object, default: () => ({})},
    alive: {type: Boolean, default: false},
    silent: {type: Boolean, default: false},
    environment: {type: String, required: true},
});
const helpers = computed(() => props.running.helpers || []);
const helpersOut = computed(() => helpers.value.filter((row) => !["finished", "stopped", "ended"].includes(row.state)).length);
const emit = defineEmits(["changed"]);
const failed = inject("phoneFailed");
const busy = ref("");
const confirming = ref(false);
const told = ref("");
const contextUsed = computed(() => (typeof props.running.context === "number" ? Math.max(0, Math.min(100, Math.round(props.running.context))) : null));
const windows = computed(() => props.running.usage || []);
const NEEDS = {pause: "pause", resume: "resume", stop: "stop"};
const wantedAuto = ref(null);
const autoOn = computed(() => wantedAuto.value ?? Boolean(props.running.auto));
const autoTold = ref("");
const modeTold = ref("");
const picked = ref("");
const mode = computed(() => modeOf(picked.value || props.running.mode));

watch(
    () => props.running.auto,
    (now) => wantedAuto.value !== null && Boolean(now) === wantedAuto.value && (wantedAuto.value = null),
);

const failedLine = (error, words, offline) => (error instanceof PhoneError ? words : offline);

async function toggleAuto() {
    const next = !autoOn.value;
    busy.value = "auto";
    autoTold.value = "";
    wantedAuto.value = next;
    try {
        await phone.auto(next);
        announce(next ? "Auto mode on" : "Auto mode off");
        emit("changed");
    } catch (error) {
        wantedAuto.value = null;
        if (ended(error)) return failed(error);
        tell(autoTold, failedLine(error, `Couldn't turn Auto ${next ? "on" : "off"}. Try again.`, "You need a connection to switch Auto."));
    } finally {
        busy.value = "";
    }
}

async function pickMode(key) {
    if (key === mode.value.key || busy.value) return;
    busy.value = "mode";
    modeTold.value = "";
    picked.value = key;
    try {
        await phone.mode(key);
        announce(`Work mode: ${modeOf(key).label}`);
        emit("changed");
    } catch (error) {
        picked.value = "";
        if (ended(error)) return failed(error);
        tell(modeTold, failedLine(error, "Couldn't change the work mode. Try again.", "You need a connection to change the work mode."));
    } finally {
        busy.value = "";
    }
}
const DONE = {pause: "Paused", resume: "Resumed", stop: "Stopped the agent"};

async function act(what) {
    busy.value = what;
    told.value = "";
    try {
        await phone[what]();
        announce(DONE[what]);
        confirming.value = false;
        emit("changed");
    } catch (error) {
        if (ended(error)) return failed(error);
        tell(told, error instanceof PhoneError ? error.message : `You need a connection to ${NEEDS[what]} the agent.`);
    } finally {
        busy.value = "";
    }
}
</script>

<template>
    <div class="controls">
        <div class="controls-mode">
            <span id="work-mode" class="controls-name">Work mode</span>
            <Segmented class="controls-segments" :options="MODES" :value="mode.key" fill aria-labelledby="work-mode" @pick="pickMode" />
            <span class="controls-note fixed">{{ mode.note }}</span>
            <template v-if="mode.key === 'solo' && helpersOut">
                <span class="controls-hint">Solo sends no new helpers; the {{ helpersOut }} already out keep going until they finish.</span>
            </template>
            <template v-if="modeTold">
                <span class="controls-failed">{{ modeTold }}</span>
            </template>
        </div>
        <div class="controls-box">
            <button type="button" class="controls-auto" role="switch" :aria-checked="autoOn" :disabled="busy === 'auto'" @click="toggleAuto">
                <span class="controls-words">
                    <span class="controls-name">Auto</span>
                    <span class="controls-note">{{ autoOn ? "The agent works through the to-do list without asking" : "The agent asks before picking up the next to-do" }}</span>
                </span>
                <span :class="['controls-switch', {on: autoOn}]" aria-hidden="true"><span /></span>
            </button>
            <template v-if="autoTold">
                <span class="controls-failed">{{ autoTold }}</span>
            </template>
        </div>
        <template v-if="alive && contextUsed !== null">
            <div class="controls-meter">
                <span class="controls-name">Context · {{ contextUsed }}% used</span>
                <span class="controls-track" aria-hidden="true"><span :style="{width: `${contextUsed}%`}" /></span>
            </div>
        </template>
        <template v-for="window in alive ? windows : []" :key="window.key || window.label">
            <div class="controls-meter">
                <span class="controls-name">{{ window.label }} · {{ used(window) }}% used</span>
                <span class="controls-note">{{ resets(window) }}</span>
                <span class="controls-track" aria-hidden="true"><span :style="{width: `${used(window)}%`}" /></span>
            </div>
        </template>
        <template v-if="told">
            <p class="controls-told">{{ told }}</p>
        </template>
        <template v-if="alive && confirming">
            <p class="controls-ask">Stop the agent in {{ environment }}? It ends its session.</p>
            <div class="controls-row">
                <button type="button" class="controls-button" @click="confirming = false">Cancel</button>
                <button type="button" class="controls-button danger" :disabled="Boolean(busy)" @click="act('stop')">
                    <template v-if="busy === 'stop'">
                        <Spinner />
                    </template>
                    Stop
                </button>
            </div>
        </template>
        <template v-else-if="silent">
            <p class="controls-silent" role="status">The agent was started but never reported in, so it is not working. Stop it, then start it again.</p>
            <div class="controls-row">
                <button type="button" class="controls-button danger" :disabled="Boolean(busy)" @click="confirming = true">Stop</button>
            </div>
        </template>
        <template v-else-if="alive">
            <div class="controls-row">
                <button type="button" class="controls-button" :disabled="Boolean(busy)" @click="act(running.paused ? 'resume' : 'pause')">
                    <template v-if="busy === 'pause' || busy === 'resume'">
                        <Spinner />
                    </template>
                    {{ running.paused ? "Resume" : "Pause" }}
                </button>
                <button type="button" class="controls-button danger-quiet" :disabled="Boolean(busy)" @click="confirming = true">Stop</button>
            </div>
        </template>
    </div>
</template>

<style scoped>
.controls-silent {
    margin: 0;
    padding: 10px 14px;
    border-radius: 12px;
    background: color-mix(in oklab, var(--tone-warn) 14%, transparent);
    color: var(--text);
    font-size: 0.882rem;
    line-height: 1.4;
}

.controls {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-bottom: 12px;
}

.controls-meter {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    justify-content: space-between;
    gap: 4px 12px;
    padding: 10px 16px;
    border-radius: 12px;
    background: var(--hover);
}

.controls-name {
    font-weight: 600;
}

.controls-note {
    color: var(--text-2);
    font-size: 0.765rem;
}

.controls-track {
    display: block;
    width: 100%;
    height: 4px;
    overflow: hidden;
    border-radius: 2px;
    background: var(--line);
}

.controls-track span {
    display: block;
    height: 100%;
    border-radius: 2px;
    background: var(--accent);
}

.controls-mode {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 12px 16px;
    border-radius: 12px;
    background: var(--hover);
}

.controls-segments {
    display: flex;
    width: 100%;
    align-items: center;
    padding: 3px;
    border-radius: 12px;
    background: var(--bg);
    container-type: inline-size;
}

.controls-segments :deep(.segmented-option) {
    flex: 1 1 auto;
    min-width: 0;
    height: 44px;
    padding: 0 6px;
    border-radius: 9px;
    color: var(--text-2);
    font-size: min(0.882rem, 4.9cqi);
    font-weight: 600;
    white-space: nowrap;
}

.controls-segments :deep(.segmented-option.on) {
    background: var(--accent);
    color: #fff;
}

.controls-note.fixed {
    min-height: calc(3 * 1.35em);
    line-height: 1.35;
}

.controls-hint {
    color: var(--text);
    font-size: 0.765rem;
}

.controls-box {
    display: flex;
    flex-direction: column;
    overflow: hidden;
    border-radius: 12px;
    background: var(--hover);
}

.controls-failed {
    display: block;
    padding: 0 16px 10px;
    color: var(--danger);
    font-size: 0.765rem;
}

.controls-mode .controls-failed {
    padding: 0;
}

.controls-auto {
    display: flex;
    align-items: center;
    gap: 12px;
    min-height: 56px;
    padding: 10px 16px;
    border: 0;
    border-radius: 12px;
    background: var(--hover);
    color: var(--text);
    font: inherit;
    text-align: left;
}

.controls-words {
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
}

.controls-switch {
    position: relative;
    flex: none;
    width: 51px;
    height: 31px;
    border-radius: 16px;
    background: var(--border-3);
    transition: background-color 200ms ease-out;
}

.controls-switch span {
    position: absolute;
    top: 2px;
    left: 2px;
    width: 27px;
    height: 27px;
    border-radius: 50%;
    background: #fff;
    box-shadow: 0 1px 3px rgb(0 0 0 / 30%);
    transition: transform 200ms var(--push);
}

.controls-switch.on {
    background: var(--tone-good);
}

.controls-switch.on span {
    transform: translateX(20px);
}

.controls-told,
.controls-ask {
    margin: 0;
    color: var(--text-2);
}

.controls-ask {
    color: var(--text);
    font-weight: 600;
}

.controls-row {
    display: flex;
    gap: 10px;
}

.controls-button {
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: center;
    gap: 8px;
    min-height: 50px;
    border: 0;
    border-radius: 12px;
    background: color-mix(in oklab, var(--accent) 14%, transparent);
    color: var(--accent-text);
    font: inherit;
    font-weight: 600;
}

.controls-button.danger {
    background: var(--danger);
    color: #fff;
}

.controls-button.danger-quiet {
    background: color-mix(in oklab, var(--danger) 14%, transparent);
    color: var(--danger);
}
</style>
