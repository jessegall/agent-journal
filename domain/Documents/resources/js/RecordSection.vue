<script setup lang="ts">
import type { PublicationCard } from '@generated/types/documents';
import CreateRecordForm from './CreateRecordForm.vue';

/**
 * One type of record in the library: its cards by number, linked to their pages, and the form that files a new one.
 * With none to show it says so, naming the filter that hides them and offering to clear it when one is active.
 */
defineProps<{
    heading: string;
    type: 'doc' | 'report';
    path: string;
    rows: (PublicationCard | PublicationCard)[];
    createLabel: string;
    // The words of the active search or filter, or null when the list shows everything.
    filter: string | null;
}>();

const emit = defineEmits<{ clearFilter: [] }>();
</script>

<template>
    <section class="flex flex-col gap-2">
        <h2 class="text-heading">{{ heading }}</h2>
        <template v-if="rows.length === 0 && filter !== null">
            <p class="text-small text-text-3">
                No {{ heading.toLowerCase() }} match {{ filter }}.
                <button type="button" class="underline" @click="emit('clearFilter')">Clear filter</button>
            </p>
        </template>
        <template v-else-if="rows.length === 0">
            <p class="text-small text-text-3">No {{ heading.toLowerCase() }} yet.</p>
        </template>
        <template v-for="row in rows" :key="row.id">
            <a class="flex gap-2" :href="`/documents/${path}/${row.number}`">
                <span class="font-mono tabular-nums"
                    >{{ type }} {{ row.number }}</span
                >
                <span>{{ row.title }}</span>
                <span class="text-text-3">{{ row.abstract }}</span>
            </a>
            <template v-if="row.snippet">
                <p class="text-small text-text-3">
                    {{ row.foundIn }}: {{ row.snippet }}
                </p>
            </template>
        </template>
        <CreateRecordForm :action="`/documents/${path}`" :label="createLabel" />
    </section>
</template>
