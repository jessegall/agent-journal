<script setup lang="ts">
import AgentTerminal from '@kit/AgentTerminal';
import Button from '@kit/Button';
import { useTerminalController } from '@kit/terminalController';
import { toRef } from 'vue';

/**
 * The terminal the chat shows beside it: one controller for the agent, which reads only while the terminal is shown,
 * and the shared terminal drawing, with Retry for a host that stopped reporting and Back to chat when the agent's
 * terminal does not run. Unmounting it closes its read.
 */
const props = defineProps<{ agentId: string; isShown: boolean }>();

const emit = defineEmits<{ backToChat: [] }>();

const { presentation, retry } = useTerminalController(
    toRef(() => props.agentId),
    toRef(() => props.isShown),
);
</script>

<template>
    <AgentTerminal :presentation="presentation">
        <template #actions="{ state }">
            <template v-if="state === 'not_reporting'">
                <Button variant="bordered" size="sm" @click="retry">Retry</Button>
            </template>
            <template v-if="presentation.screen.frame?.noTerminal">
                <Button variant="bordered" size="sm" @click="emit('backToChat')">Back to chat</Button>
            </template>
        </template>
    </AgentTerminal>
</template>
