<script setup>
import {onUnmounted, ref, watch} from "vue";
import {Dialog, Icon, Switch, WindowRoom, useWindow} from "@journal/window-kit";
import AgentSettings from "./AgentSettings.vue";

const AUTO_MODE = "journal.suites.coding.auto-mode";
const view = useWindow();
const auto = ref(true);
const open = ref(false);
const failure = ref("");

watch(view.props.auto.data, (answer) => { if (answer) auto.value = answer.value; }, {immediate: true});

async function toggleAuto() {
    const answer = await view.run(`setting set ${AUTO_MODE} ${!auto.value} --environment ${view.environment}`);
    failure.value = answer.ok ? "" : answer.error;
    if (answer.ok) auto.value = !auto.value;
}

function closeSettings() {
    open.value = false;
    view.state.tab = "";
}

window.addEventListener("journal:toggle-auto", toggleAuto);
onUnmounted(() => window.removeEventListener("journal:toggle-auto", toggleAuto));
</script>

<template>
    <WindowRoom>
        <span class="agentset" data-work-mode>
            <Switch :on="auto" word="Auto" title="Auto mode: the journal hands the agent its next task, and it keeps going while tasks are left" data-auto-toggle @change="toggleAuto" />
            <button type="button" class="agentset-settings" title="Agent settings" aria-label="Agent settings" :aria-expanded="open" data-open-agent-settings @click="open = true">
                <Icon name="settings" :size="14" />
            </button>
            <template v-if="failure">
                <p class="agentset-failure" role="alert">{{ failure }}</p>
            </template>
        </span>
        <template v-if="open">
            <Dialog wide title="Agent settings" @close="closeSettings">
                <AgentSettings />
            </Dialog>
        </template>
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

.agentset-failure {
    margin: 0;
    color: var(--danger);
    font-size: 12px;
}
</style>
