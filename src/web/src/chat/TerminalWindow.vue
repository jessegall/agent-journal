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
const input = ref(null);

function focusInput(e) {
    if (!input.value || String(window.getSelection())) return;
    if (e.target.closest("button, a, input, textarea, summary, [role=button]")) return;
    input.value.$el.focus();
}
const refusal = ref("");

async function send(line, now) {
    if (!agent.value || !line.trim()) return;
    refusal.value = "";
    try {
        await api.runShell(agent.value.title, line, now);
        if (line === command.value) command.value = "";
    } catch (e) {
        refusal.value = e.message;
    }
}
</script>

<template>
    <section class="terminal" @click="focusInput">
        <div class="terminal-body">
            <CommandLog :commands="commands" :queued="queued" :outputs="outputs" @now="(line) => send(line, true)" />
        </div>
        <template v-if="agent">
            <form class="terminal-run" @submit.prevent="send(command, false)">
                <span class="terminal-prompt">$</span>
                <span class="terminal-line">
                    <TextInput
                        ref="input"
                        :value="command"
                        class="terminal-input"
                        aria-label="A command to run in the agent's terminal"
                        @input="command = $event.target.value"
                        @keydown.enter.ctrl.prevent="send(command, true)"
                        @keydown.enter.meta.prevent="send(command, true)"
                    />
                    <span class="terminal-cursor" aria-hidden="true">
                        <span class="terminal-typed">{{ command }}</span>
                        <span class="terminal-block" />
                    </span>
                </span>
            </form>
            <p class="terminal-hint">↵ queue · ⌃↵ run now</p>
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
    background: var(--code-bg);
    cursor: text;
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
    padding: 4px 18px 14px;
    font-family: ui-monospace, "SF Mono", Menlo, monospace;
    font-size: 11.5px;
}

.terminal-prompt {
    color: var(--text-4);
}

.terminal-line {
    position: relative;
    display: flex;
    flex: 1;
    min-width: 0;
}

.terminal-run .terminal-input {
    flex: 1;
    padding: 0;
    border: 0;
    border-radius: 0;
    background: none;
    caret-color: transparent;
    font-size: inherit;
}

.terminal-cursor {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    overflow: hidden;
    pointer-events: none;
    white-space: pre;
}

.terminal-typed {
    color: transparent;
}

.terminal-block {
    flex: none;
    width: 2px;
    height: 1.25em;
    background: var(--text-2);
}

.terminal-line:focus-within .terminal-block {
    width: 0.6em;
    animation: terminal-blink 1.1s steps(1) infinite;
}

@keyframes terminal-blink {
    50% {
        opacity: 0;
    }
}

@media (prefers-reduced-motion: reduce) {
    .terminal-block {
        animation: none;
    }
}

.terminal-run .terminal-input:focus {
    border: 0;
}

.terminal-hint {
    margin: -8px 18px 10px;
    color: var(--text-4);
    font-size: 10.5px;
}

.terminal-refusal {
    margin: 0 12px 8px;
    color: var(--danger);
    font-size: 12px;
}
</style>
