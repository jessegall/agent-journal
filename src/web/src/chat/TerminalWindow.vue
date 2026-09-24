<script setup>
import {computed, ref, watch} from "vue";
import {api} from "../api/client.js";
import TextInput from "../kit/TextInput.vue";
import {agent} from "../state/store.js";
import {useTerminal} from "../composables/terminal.js";
import CommandLog from "./CommandLog.vue";

const listed = computed(() => (agent.value && agent.value.data.queued_commands) || []);
const sending = ref([]);
const queued = computed(() => [...listed.value, ...sending.value.filter((s) => !listed.value.some((q) => q.command === s.command))]);
const drop = (at) => (sending.value = sending.value.filter((s) => s.at !== at));

watch(
    () => agent.value && agent.value.updated,
    () => (sending.value = sending.value.filter((s) => !s.sent))
);
const lines = useTerminal();
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
    const at = `sending-${Date.now()}`;
    if (line === command.value) command.value = "";
    if (!now) sending.value = [...sending.value, {at, command: line, sent: false}];
    try {
        await api.runShell(agent.value.title, line, now);
        sending.value = sending.value.map((s) => (s.at === at ? {...s, sent: true} : s));
    } catch (e) {
        drop(at);
        refusal.value = e.message;
    }
}
</script>

<template>
    <section class="terminal" @click="focusInput">
        <div class="terminal-body">
            <CommandLog :lines="lines" :queued="queued" @now="(line) => send(line, true)" />
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

.terminal-refusal {
    margin: 0 12px 8px;
    color: var(--danger);
    font-size: 12px;
}
</style>
