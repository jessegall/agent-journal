<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3';
import AgentTerminal from '@kit/AgentTerminal';
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

const { presentation } = useTerminalController(toRef(() => props.data.agentId), ref(true));
</script>

<template>
    <Head title="Terminal" />
    <div class="flex flex-col gap-4 p-6">
        <div class="flex items-center gap-3">
            <h1 class="text-lg font-semibold">Terminal</h1>
            <Link
                :href="home.url({ query: { agent: data.agentId } })"
                class="text-small text-text-2 underline hover:text-text"
                >Back to agent chat</Link
            >
        </div>
        <AgentTerminal :presentation="presentation" />
    </div>
</template>
