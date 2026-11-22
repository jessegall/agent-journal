<script setup lang="ts">
import AgentTerminal from '@kit/AgentTerminal';
import { useTerminalController } from '@kit/terminalController';
import { toRef } from 'vue';

/**
 * The terminal the chat shows beside it: one controller for the agent, which reads only while the terminal is shown,
 * and the shared terminal drawing. Unmounting it closes its read.
 */
const props = defineProps<{ agentId: string; isShown: boolean }>();

const { presentation } = useTerminalController(
    toRef(() => props.agentId),
    toRef(() => props.isShown),
);
</script>

<template>
    <AgentTerminal :presentation="presentation" />
</template>
