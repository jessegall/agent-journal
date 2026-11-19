<script setup lang="ts">
import { Link } from '@inertiajs/vue3';
import type { DockData } from '@generated/types/documents';

/**
 * Suggested documents and reports for this conversation, newest first. Suggesting docks nothing.
 */
defineProps<{ data: DockData }>();
</script>

<template>
    <ul class="flex flex-wrap gap-1.5" aria-label="Suggested records">
        <template v-for="card in data.suggestions" :key="`${card.type}:${card.number}`">
            <li class="rounded-control border border-dashed border-border-2 px-2 py-1 text-small text-text-3">
                <Link :href="card.route">{{ card.title }}</Link>
            </li>
        </template>
    </ul>
</template>
