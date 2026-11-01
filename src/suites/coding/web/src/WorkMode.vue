<script setup>
import {onUnmounted, ref} from "vue";
import {Icon, Segmented, Switch, useWindow} from "@journal/window-kit";

// the coding suite's part of the top bar, as version 4's status bar drew it: the auto switch, the two work modes and the settings behind them
const AUTO_MODE = "journal.suites.coding.auto-mode";
const DISPATCHES = "journal.suites.coding.workers.builder-dispatches-workers";
const WORKER_LIMIT = "journal.suites.coding.workers.worker-limit";
const MODES = [
    {key: "coding.builder", label: "Builder", tip: {title: "Builder", line: "The agent builds it itself, and sends workers when a job is better done beside it."}},
    {key: "coding.orchestrator", label: "Orchestrator", tip: {title: "Orchestrator", line: "The agent plans, hands the work to workers, then reviews and merges it; it writes code itself only where no worker can."}},
];
const context = useWindow();
const mode = ref(MODES[0].key);
const auto = ref(true);
const dispatches = ref(true);
const limit = ref(2);
const open = ref(false);
const failure = ref("");

const settingValue = async (key) => {
    const answer = await context.read(`setting show ${key} --environment ${context.environment}`);
    return answer.ok ? answer.value?.value : undefined;
};

async function load() {
    const current = await context.read(`suite current ${context.environment}`);
    const driver = current.ok ? MODES.find((one) => String(current.value?.drivers ?? "").includes(one.key)) : null;
    if (driver) mode.value = driver.key;
    auto.value = (await settingValue(AUTO_MODE)) !== false;
    dispatches.value = (await settingValue(DISPATCHES)) !== false;
    limit.value = Number((await settingValue(WORKER_LIMIT)) ?? 2);
}

async function run(words) {
    const answer = await context.run(words);
    failure.value = answer.ok ? "" : answer.error;
    return answer.ok;
}

async function pickMode(key) {
    if (key !== mode.value && (await run(`driver choose ${key} --environment ${context.environment}`))) mode.value = key;
}

const setSetting = (key, value) => run(`setting set ${key} ${value} --environment ${context.environment}`);

async function toggleAuto() {
    if (await setSetting(AUTO_MODE, !auto.value)) auto.value = !auto.value;
}

async function toggleDispatches() {
    if (await setSetting(DISPATCHES, !dispatches.value)) dispatches.value = !dispatches.value;
}

async function changeLimit(event) {
    const value = Number(event.target.value);
    if (await setSetting(WORKER_LIMIT, value)) limit.value = value;
}

const closeOnEscape = (event) => event.key === "Escape" && (open.value = false);
window.addEventListener("keydown", closeOnEscape);
onUnmounted(() => window.removeEventListener("keydown", closeOnEscape));
load();
</script>

<template>
    <span class="agentset" data-work-mode>
        <Switch :on="auto" word="Auto" title="Auto mode: the agent is given the next open task when it stops or leaves its task" data-auto-toggle @change="toggleAuto" />
        <Segmented class="agentset-mode" :options="MODES" :value="mode" @pick="pickMode" />
        <button type="button" class="agentset-settings" data-work-settings title="Work mode settings" :aria-expanded="open" @click.stop="open = !open">
            <Icon name="caret" :size="12" />
        </button>
        <template v-if="open">
            <div class="agentset-menu" role="dialog" aria-label="Work mode settings" data-work-menu>
                <label class="agentset-row">
                    <span>Builder sends workers</span>
                    <Switch :on="dispatches" @change="toggleDispatches" />
                </label>
                <label class="agentset-row">
                    <span>Worker limit</span>
                    <input class="agentset-number" type="number" min="0" :value="limit" @change="changeLimit" />
                </label>
                <template v-if="failure">
                    <p class="agentset-failure" role="alert">{{ failure }}</p>
                </template>
            </div>
        </template>
    </span>
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

.agentset-number {
    width: 56px;
    padding: 3px 6px;
    border: 1px solid var(--border-2);
    border-radius: 5px;
    background: var(--bg);
    color: var(--text);
    font: inherit;
}

.agentset-failure {
    margin: 0;
    color: var(--danger);
    font-size: 12px;
}
</style>
