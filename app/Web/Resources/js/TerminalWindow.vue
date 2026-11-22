<script setup lang="ts">
import { Head } from '@inertiajs/vue3';
import type { TerminalWindowData } from '@/types/generated';
import { toRef } from 'vue';
import TerminalView from './TerminalView.vue';
import { useTerminalController } from './useTerminalController';

/**
 * An agent's terminal on its own page, read only: the page builds the terminal's controller, which reads through the
 * terminal's JSON actions, and hands its state to the view.
 */
const props = defineProps<{ data: TerminalWindowData }>();

const { presentation } = useTerminalController(toRef(() => props.data.agentId));
</script>

<template>
    <Head title="Terminal" />
    <div class="flex flex-col gap-4 p-6">
        <h1 class="text-lg font-semibold">Terminal</h1>
        <TerminalView :presentation="presentation" />
    </div>
</template>
