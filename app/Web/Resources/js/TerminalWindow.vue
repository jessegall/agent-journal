<script setup lang="ts">
import { Head } from '@inertiajs/vue3';
import type { TerminalWindowData } from '@/types/generated';
import TerminalView from './TerminalView.vue';

/**
 * An agent's terminal on its own page, read only: the page opens its view, renews it and reloads its frame itself.
 */
defineProps<{ data: TerminalWindowData }>();
</script>

<template>
    <Head title="Terminal" />
    <div class="flex flex-col gap-4 p-6">
        <h1 class="text-lg font-semibold">Terminal</h1>
        <TerminalView :data="data" />
    </div>
</template>
