<script setup lang="ts">
import AgentTerminal from '@kit/AgentTerminal';
import Button from '@kit/Button';
import TerminalControlBar from '@kit/TerminalControlBar';
import { useTerminalController } from '@kit/terminalController';
import { toRef } from 'vue';

/**
 * The terminal the chat shows beside it: one controller for the agent, which reads only while the terminal is shown,
 * and the shared terminal drawing, with the control bar, Retry for a host that stopped reporting and Back to chat
 * when the agent's terminal does not run. Unmounting it closes its read and drops its control.
 */
const props = defineProps<{ agentId: string; isShown: boolean }>();

const emit = defineEmits<{ backToChat: []; owner: [label: string] }>();

const { presentation, retry, control } = useTerminalController(
    toRef(() => props.agentId),
    toRef(() => props.isShown),
);

/**
 * Whether closing must wait for the writer: a held grant with an unfinished line shows its choices instead.
 */
function holdsCloseForDraft(): boolean {
    if (!control.holdsGrant() || control.view.value.unsentLine === '') {
        return false;
    }

    void control.giveBack();

    return true;
}

defineExpose({ holdsCloseForDraft });
</script>

<template>
    <AgentTerminal :presentation="presentation">
        <template #actions="{ state }">
            <TerminalControlBar
                :control="control"
                :other-view-controls="presentation.screen.frame?.inputOwner === 'browser' && !control.holdsGrant()"
                @owner="(label: string) => emit('owner', label)"
            />
            <template v-if="state === 'not_reporting'">
                <Button variant="bordered" size="sm" @click="retry">Retry</Button>
            </template>
            <template v-if="presentation.screen.frame?.noTerminal">
                <Button variant="bordered" size="sm" @click="emit('backToChat')">Back to chat</Button>
            </template>
        </template>
    </AgentTerminal>
</template>
