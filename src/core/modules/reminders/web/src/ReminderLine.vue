<script setup>
import {AgentBadge} from "@journal/window-kit";
import {AGENT, holdsAgent, repeatWords} from "./reminderWords.js";

// the second line of a reminder's row: how it repeats, the amber Holds mark when it holds the agent, and the agent at the right end, never cut
defineProps({row: {type: Object, required: true}});
</script>

<template>
    <span class="rule" data-reminder-rule>{{ repeatWords(row) }}</span>
    <template v-if="holdsAgent(row)">
        <span class="holds" data-reminder-holds>Holds</span>
    </template>
    <AgentBadge class="agent" :name="AGENT" main chip data-reminder-agent />
</template>

<style scoped>
.rule {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.holds {
    flex: none;
    padding: 0 6px;
    border: 1px solid var(--warn);
    border-radius: 999px;
    color: var(--warn);
    font-size: 11px;
}

.agent {
    flex: none;
    margin-left: auto;
}
</style>
