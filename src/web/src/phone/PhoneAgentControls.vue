<script setup>
import {computed, inject, ref} from "vue";
import {phone, PhoneError} from "../api/phone.js";
import {resetLabel as resets, usedPercent as used} from "../format/usage.js";
import Spinner from "../kit/Spinner.vue";
import {announce, tell} from "./announce.js";
import {ended} from "./outbox.js";

const props = defineProps({running: {type: Object, default: () => ({})}, environment: {type: String, required: true}});
const emit = defineEmits(["changed"]);
const failed = inject("phoneFailed");
const busy = ref("");
const confirming = ref(false);
const told = ref("");
const left = computed(() => (typeof props.running.context === "number" ? Math.max(0, Math.min(100, Math.round(100 - props.running.context))) : null));
const windows = computed(() => props.running.usage || []);
const NEEDS = {pause: "pause", resume: "resume", stop: "stop", auto: "switch auto mode for"};
const autoOn = computed(() => Boolean(props.running.auto));

async function toggleAuto() {
    busy.value = "auto";
    told.value = "";
    try {
        await phone.auto(!autoOn.value);
        announce(autoOn.value ? "Auto mode off" : "Auto mode on");
        emit("changed");
    } catch (error) {
        if (ended(error)) return failed(error);
        tell(told, error instanceof PhoneError ? error.message : `You need a connection to ${NEEDS.auto} the agent.`);
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
        <template v-if="left !== null">
            <div class="controls-meter">
                <span class="controls-name">Context {{ left }}% left</span>
                <span class="controls-track" aria-hidden="true"><span :style="{width: `${left}%`}" /></span>
            </div>
        </template>
        <template v-for="window in windows" :key="window.key || window.label">
            <div class="controls-meter">
                <span class="controls-name">{{ window.label }} · {{ used(window) }}% used</span>
                <span class="controls-note">{{ resets(window) }}</span>
                <span class="controls-track" aria-hidden="true"><span :style="{width: `${used(window)}%`}" /></span>
            </div>
        </template>
        <button type="button" class="controls-auto" role="switch" :aria-checked="autoOn" :disabled="busy === 'auto'" @click="toggleAuto">
            <span class="controls-words">
                <span class="controls-name">Auto</span>
                <span class="controls-note">{{ autoOn ? "The agent works through the to-do list without asking" : "The agent asks before picking up the next to-do" }}</span>
            </span>
            <span :class="['controls-switch', {on: autoOn}]" aria-hidden="true"><span /></span>
        </button>
        <template v-if="told">
            <p class="controls-told">{{ told }}</p>
        </template>
        <template v-if="confirming">
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
        <template v-else>
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
