<script setup lang="ts">
import { Link } from '@inertiajs/vue3';
import type { AskInboxPaneData } from '@/generated/types/core';

defineProps<AskInboxPaneData>();
</script>

<template>
    <div class="min-w-0 p-3 text-sm">
        <ul class="divide-y divide-border">
            <li v-for="ask in items" :key="ask.id" class="py-2">
                <p class="break-words">{{ ask.excerpt }}</p>
                <p class="text-xs text-muted-foreground">{{ ask.isOpen ? 'Open' : 'Closed' }}</p>
            </li>
        </ul>
        <Link :href="inboxUrl" class="mt-2 inline-flex text-xs font-medium underline">Open Asks</Link>
    </div>
</template>
