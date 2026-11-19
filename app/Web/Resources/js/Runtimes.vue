<script setup lang="ts">
import { Head, usePage } from '@inertiajs/vue3';
import type { RuntimesData } from '@/types/generated';
import { computed } from 'vue';
import RuntimeCard from './RuntimeCard.vue';

/**
 * The runtime status: each agent runtime's activity, hold, settings and latest requests, as stored, with the owner's
 * recovery buttons. A refused action is shown above the runtimes.
 */
defineProps<{ data: RuntimesData }>();

const page = usePage<{ errors: Record<string, string> }>();
const refusal = computed(() => page.props.errors.review ?? '');
</script>

<template>
    <Head title="Runtimes" />
    <div class="flex flex-col gap-6 p-6">
        <h1 class="text-lg font-semibold">Runtimes</h1>
        <p v-if="refusal" role="alert" class="text-warn">{{ refusal }}</p>
        <template v-if="data.runtimes.length === 0">
          <p class="text-text-3">No agent runtime is open.</p>
        </template>
        <template v-for="entry in data.runtimes" :key="entry.status.runtimeId">
          <RuntimeCard
              :status="entry.status"
              :requests="entry.requests"
          />
        </template>
    </div>
</template>
