<script setup>
import {computed} from "vue";
import Btn from "../kit/Btn.vue";
import Icon from "../kit/Icon.vue";
import {agent, store} from "../state/store.js";
import CommandLog from "./CommandLog.vue";

const commands = computed(() => (agent.value && agent.value.data.commands) || []);
</script>

<template>
    <section class="terminal">
        <header class="terminal-head">
            <Icon name="terminal" :size="14" />
            <span class="terminal-title">Terminal</span>
            <span class="grow" />
            <Btn small @click="store.terminal = false">Back to chat</Btn>
        </header>
        <div class="terminal-body">
            <CommandLog :commands="commands" />
        </div>
    </section>
</template>

<style scoped>
.terminal {
    display: flex;
    flex-direction: column;
    height: 100%;
    min-height: 0;
}

.terminal-head {
    display: flex;
    flex: none;
    align-items: center;
    gap: 10px;
    padding: 12px 16px;
    border-bottom: 1px solid var(--border);
    color: var(--text-3);
}

.terminal-title {
    color: var(--text);
    font-size: 13px;
    font-weight: 500;
}

.grow {
    flex: 1;
}

.terminal-body {
    display: flex;
    flex: 1;
    flex-direction: column;
    min-height: 0;
    padding: 12px 16px;
}

.terminal-body :deep(.log) {
    flex: 1;
    max-height: none;
}
</style>
