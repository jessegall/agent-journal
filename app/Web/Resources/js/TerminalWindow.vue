<script setup lang="ts">
import { Head, router } from '@inertiajs/vue3';
import AgentTerminal from '@kit/AgentTerminal';
import Button from '@kit/Button';
import TerminalHeader from '@kit/TerminalHeader';
import { useTerminalController } from '@kit/terminalController';
import type { TerminalWindowData } from '@/types/generated';
import { home } from '@/routes/web';
import { ref, toRef } from 'vue';

/**
 * An agent's terminal on its own page, read only: the page builds the terminal's controller, which reads through the
 * terminal's JSON actions, hands its state to the shared terminal drawing, and always offers the way back to the
 * agent's chat, even when the page was opened directly.
 */
const props = defineProps<{ data: TerminalWindowData }>();

const { presentation, retry } = useTerminalController(toRef(() => props.data.agentId), ref(true));

const backToChat = {
    key: 'back',
    label: 'Back to agent chat',
    run: () => router.visit(home.url({ query: { agent: props.data.agentId } })),
};
</script>

<template>
    <Head title="Terminal" />
    <div class="flex flex-col gap-3 p-6">
        <TerminalHeader
            agent-name="Terminal"
            :driver="null"
            owner="Watching"
            placement="Own page"
            :main="backToChat"
            :secondary="[]"
        />
        <AgentTerminal :presentation="presentation">
            <template #actions="{ state }">
                <template v-if="state === 'not_reporting'">
                    <Button variant="bordered" size="sm" @click="retry">Retry</Button>
                </template>
            </template>
        </AgentTerminal>
    </div>
</template>
