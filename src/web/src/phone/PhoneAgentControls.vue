<script setup>
import {computed, inject, ref} from "vue";
import {phone, PhoneError} from "../api/phone.js";
import {resetLabel as resets, usedPercent as used} from "../format/usage.js";
import Spinner from "../kit/Spinner.vue";
import {announce} from "./announce.js";
import {ended} from "./outbox.js";

const props = defineProps({running: {type: Object, default: () => ({})}, environment: {type: String, required: true}});
const emit = defineEmits(["changed"]);
const failed = inject("phoneFailed");
const busy = ref("");
const confirming = ref(false);
const told = ref("");
const left = computed(() => (typeof props.running.context === "number" ? Math.max(0, Math.min(100, Math.round(100 - props.running.context))) : null));
const windows = computed(() => props.running.usage || []);
const NEEDS = {pause: "pause", resume: "resume", stop: "stop"};
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
        told.value = error instanceof PhoneError ? error.message : `You need a connection to ${NEEDS[what]} the agent.`;
        announce(told.value);
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
        <template v-if="told">
            <p class="controls-told" role="status">{{ told }}</p>
        </template>
        <template v-if="confirming">
            <p class="controls-ask">Stop the agent in {{ environment }}? It ends its session.</p>
            <div class="controls-row">
                <button type="button" class="controls-button danger" :disabled="Boolean(busy)" @click="act('stop')">
                    <template v-if="busy === 'stop'">
                        <Spinner />
                    </template>
                    Stop
                </button>
                <button type="button" class="controls-button" @click="confirming = false">Cancel</button>
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
