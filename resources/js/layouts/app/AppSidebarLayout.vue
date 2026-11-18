<script setup lang="ts">
import { usePage } from '@inertiajs/vue3';
import { computed } from 'vue';
import AppSidebar from '@/components/shell/AppSidebar.vue';
import AppTopbar from '@/components/shell/AppTopbar.vue';
import { useLiveConnection } from '@/composables/useLiveConnection';
import { usePresenceHeartbeat } from '@/composables/usePresenceHeartbeat';

/**
 * The persistent shell every signed-in page sits in: it stays mounted across visits, only the page inside changes, and
 * it holds the tab's one live connection and its one presence heartbeat.
 */
const page = usePage();

useLiveConnection();
usePresenceHeartbeat();
const title = computed(() => page.component);
</script>

<template>
    <div class="flex h-dvh w-full overflow-hidden bg-bg text-text">
        <AppSidebar />
        <div class="flex min-w-0 flex-1 flex-col">
            <AppTopbar :title="title" />
            <main class="min-h-0 flex-1 overflow-hidden"><slot /></main>
        </div>
    </div>
</template>
