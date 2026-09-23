<script setup>
import {computed, ref} from "vue";
import {api} from "../api/client.js";
import TextInput from "../kit/TextInput.vue";
import {agent} from "../state/store.js";
import {useCommandOutputs} from "../composables/commandOutputs.js";
import CommandLog from "./CommandLog.vue";

const commands = computed(() => (agent.value && agent.value.data.commands) || []);
const queued = computed(() => (agent.value && agent.value.data.queued_commands) || []);
const outputs = useCommandOutputs();
const command = ref("");
const refusal = ref("");

async function run() {
    if (!agent.value || !command.value.trim()) return;
    refusal.value = "";
    try {
        await api.runShell(agent.value.title, command.value);
        command.value = "";
    } catch (e) {
        refusal.value = e.message;
    }
}
</script>

<template>
    <section class="terminal">
        <div class="terminal-body">
            <CommandLog :commands="commands" :queued="queued" :outputs="outputs" />
        </div>
        <template v-if="agent">
            <form class="terminal-run" @submit.prevent="run">
                <span class="terminal-prompt">$</span>
                <TextInput
                    :value="command"
                    class="terminal-input"
                    placeholder="A command to run in the agent's terminal"
                    @input="command = $event.target.value"
                />
            </form>
            <template v-if="refusal">
                <p class="terminal-refusal">{{ refusal }}</p>
            </template>
        </template>
    </section>
</template>

<style scoped>
.terminal {
    display: flex;
    flex-direction: column;
    height: 100%;
    min-height: 0;
}

.terminal-body {
    display: flex;
    flex: 1;
    flex-direction: column;
    min-height: 0;
}

.terminal-body :deep(.console) {
    flex: 1;
    min-height: 0;
    max-height: none;
    padding: 14px 18px;
    border-radius: 0;
}

.terminal-run {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 12px;
    border-top: 1px solid var(--line);
}

.terminal-prompt {
    color: var(--text-4);
    font-family: ui-monospace, "SF Mono", Menlo, monospace;
}

.terminal-input {
    flex: 1;
    font-family: ui-monospace, "SF Mono", Menlo, monospace;
}

.terminal-refusal {
    margin: 0 12px 8px;
    color: var(--danger);
    font-size: 12px;
}
</style>
