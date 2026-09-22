<script setup>
import {computed} from "vue";
import {agent} from "../state/store.js";
import CommandLog from "./CommandLog.vue";

const commands = computed(() => (agent.value && agent.value.data.commands) || []);
</script>

<template>
    <section class="terminal">
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

.terminal-body {
    display: flex;
    flex: 1;
    flex-direction: column;
    min-height: 0;
}

.terminal-body :deep(.log) {
    flex: 1;
    min-height: 0;
    max-height: none;
    padding: 14px 18px;
    border-radius: 0;
}
</style>
