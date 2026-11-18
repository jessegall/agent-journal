<script setup lang="ts">
import type { DocumentCard, ReportCard } from '@generated/types/documents';
import CreateRecordForm from './CreateRecordForm.vue';

/**
 * One type of record in the library: its cards by number, linked to their pages, and the form that files a new one.
 */
defineProps<{
    heading: string;
    type: 'doc' | 'report';
    path: string;
    rows: (DocumentCard | ReportCard)[];
    createLabel: string;
}>();
</script>

<template>
    <section class="flex flex-col gap-2">
        <h2 class="text-heading">{{ heading }}</h2>
        <template v-for="row in rows" :key="row.id">
            <a class="flex gap-2" :href="`/documents/${path}/${row.number}`">
                <span class="font-mono tabular-nums">{{ type }} {{ row.number }}</span>
                <span>{{ row.title }}</span>
                <span class="text-text-3">{{ row.abstract }}</span>
            </a>
            <template v-if="row.snippet">
                <p class="text-small text-text-3">{{ row.foundIn }}: {{ row.snippet }}</p>
            </template>
        </template>
        <CreateRecordForm :action="`/documents/${path}`" :label="createLabel" />
    </section>
</template>
