<script setup lang="ts">
import type { DocumentCard, ReportCard } from '@generated/types/documents';
import CreateRecordForm from './CreateRecordForm.vue';

/**
 * One kind of record in the library: its cards by number, linked to their pages, and the form that files a new one.
 */
defineProps<{
    heading: string;
    kind: 'doc' | 'report';
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
                <span class="font-mono tabular-nums">{{ kind }} {{ row.number }}</span>
                <span>{{ row.title }}</span>
                <span class="text-text-3">{{ row.abstract }}</span>
            </a>
        </template>
        <CreateRecordForm :action="`/documents/${path}`" :label="createLabel" />
    </section>
</template>
