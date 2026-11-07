<script setup>
import {onUnmounted, ref, watch} from "vue";
import {Icon, Segmented, Switch, WindowRoom, useOutside, useWindow} from "@journal/window-kit";

const AUTO_MODE = "journal.suites.coding.auto-mode";
const DISPATCHES = "journal.suites.coding.workers.builder-dispatches-workers";
const MERGER = "journal.suites.coding.workers.merger-on";
const MODES = [
    {key: "coding.builder", label: "Builder", tip: {title: "Builder", line: "The agent writes code and assigns work to workers when useful."}},
    {key: "coding.orchestrator", label: "Orchestrator", tip: {title: "Orchestrator", line: "The agent plans, hands the work to workers, then reviews and merges it; it writes code itself only where no worker can."}},
];
const window = useWindow();
window.state["mode.environment"] = window.environment;
const mode = ref(MODES[0].key);
const auto = ref(true);
const dispatches = ref(true);
const merger = ref(true);
const open = ref(false);
const root = ref(null);
useOutside(root, () => (open.value = false));
const failure = ref("");

watch(window.props.mode.data, (current) => {
    if (!current) return;
    const driver = MODES.find((one) => current.drivers.includes(one.key));
    if (driver) mode.value = driver.key;
}, {immediate: true});
for (const [key, held] of [["auto", auto], ["dispatches", dispatches], ["merger", merger]]) {
    watch(window.props[key].data, (answer) => { if (answer) held.value = answer.value; }, {immediate: true});
}
watch(open, (value) => (window.state.tab = value ? "settings" : ""));

async function run(words) {
    const answer = await window.run(words);
    failure.value = answer.ok ? "" : answer.error;
    return answer.ok;
}

const asking = ref(null);

async function switchMode(key) {
    asking.value = null;
    if (await run(`driver choose ${key} --environment ${window.environment}`)) mode.value = key;
}

// a switch while the agent works asks first, so a stray click never changes it; none while it is idle
async function pickMode(key) {
    if (key === mode.value) return;
    const refreshed = await window.reload("bars");
    const bars = window.props.bars;
    const label = MODES.find((one) => one.key === key).label;
    const busy = refreshed && !bars.failure.value ? bars.data.value : null;
    const question = !busy ? "" : busy.task_id ? `Switch to ${label}? The agent is working on task ${busy.task_id}.` : busy.helpers ? `Switch to ${label}? The agent has ${busy.helpers} helpers out.` : "";
    if (question) asking.value = {key, question};
    else await switchMode(key);
}

const setSetting = (key, value) => run(`setting set ${key} ${value} --environment ${window.environment}`);

async function toggleAuto() {
    if (await setSetting(AUTO_MODE, !auto.value)) auto.value = !auto.value;
}

globalThis.addEventListener("journal:toggle-auto", toggleAuto);
onUnmounted(() => globalThis.removeEventListener("journal:toggle-auto", toggleAuto));

async function toggleDispatches() {
    if (await setSetting(DISPATCHES, !dispatches.value)) dispatches.value = !dispatches.value;
}

async function toggleMerger() {
    if (await setSetting(MERGER, !merger.value)) merger.value = !merger.value;
}


function toggleMenu() {
    open.value = !open.value;
}

const closeOnEscape = (event) => event.key === "Escape" && (open.value = false);
globalThis.addEventListener("keydown", closeOnEscape);
onUnmounted(() => globalThis.removeEventListener("keydown", closeOnEscape));
</script>

<template>
    <WindowRoom>
        <span ref="root" class="agentset" data-work-mode>
            <Switch :on="auto" word="Auto" title="Auto mode: the agent is given the next open task when it stops or leaves its task" data-auto-toggle @change="toggleAuto" />
            <Segmented class="agentset-mode" :options="MODES" :value="mode" @pick="pickMode" />
            <template v-if="asking">
                <div class="agentset-menu" role="dialog" aria-label="Switch the work mode" data-mode-ask>
                    <p class="agentset-ask">{{ asking.question }}</p>
                    <div class="agentset-ask-buttons">
                        <button type="button" data-mode-keep @click="asking = null">Keep the mode</button>
                        <button type="button" data-mode-switch @click="switchMode(asking.key)">Switch</button>
                    </div>
                </div>
            </template>
            <button type="button" class="agentset-settings" data-work-settings title="Work mode settings" :aria-expanded="open" @click.stop="toggleMenu">
                <Icon name="caret" :size="12" />
            </button>
            <template v-if="open">
                <div class="agentset-menu" role="dialog" aria-label="Work mode settings" data-work-menu>
                    <label class="agentset-row">
                        <span>Builder sends workers</span>
                        <Switch :on="dispatches" @change="toggleDispatches" />
                    </label>
                    <template v-if="dispatches">
                        <label class="agentset-row" title="A helper merges workers whose tests passed and passes on what the main agent must judge">
                            <span>Merger takes in workers</span>
                            <Switch :on="merger" data-merger-toggle @change="toggleMerger" />
                        </label>
                    </template>
                    <template v-if="failure">
                        <p class="agentset-failure" role="alert">{{ failure }}</p>
                    </template>
                </div>
            </template>
        </span>
    </WindowRoom>
</template>

<style scoped>
.agentset {
    position: relative;
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 3px 4px 3px 8px;
    border: 1px solid var(--border-2);
    border-radius: 8px;
}

.agentset-settings {
    display: inline-flex;
    align-items: center;
    padding: 3px 5px;
    border: 0;
    border-radius: 5px;
    background: none;
    color: var(--text-2);
    cursor: pointer;
}

.agentset-settings:hover,
.agentset-settings[aria-expanded="true"] {
    background: var(--hover);
    color: var(--text);
}

.agentset-menu {
    position: absolute;
    top: calc(100% + 8px);
    right: 0;
    z-index: 40;
    display: flex;
    flex-direction: column;
    gap: 10px;
    width: 260px;
    padding: 12px;
    border: 1px solid var(--border-2);
    border-radius: 10px;
    background: var(--raised);
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.45);
}

.agentset-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    color: var(--text-2);
    font-size: 12.5px;
}

.agentset-failure {
    margin: 0;
    color: var(--danger);
    font-size: 12px;
}

.agentset-ask {
    margin: 0 0 8px;
    font-size: 13px;
}

.agentset-ask-buttons {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
}
</style>
