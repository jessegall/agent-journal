<script setup lang="ts">
import { Head } from '@inertiajs/vue3';
import type { RuntimesData } from '@/types/generated';
import RuntimeCard from './RuntimeCard.vue';

/**
 * The read-only runtime status: each agent runtime's activity, hold, settings and latest requests, as stored. It
 * offers no action; changes go through the console commands.
 */
defineProps<{ data: RuntimesData }>();
</script>

<template>
    <Head title="Runtimes" />
    <div class="flex flex-col gap-6 p-6">
        <h1 class="text-lg font-semibold">Runtimes</h1>
        <p v-if="data.runtimes.length === 0" class="text-text-3">No agent runtime is open.</p>
        <RuntimeCard
            v-for="entry in data.runtimes"
            :key="entry.status.runtimeId"
            :status="entry.status"
            :requests="entry.requests"
        />
    </div>
</template>
