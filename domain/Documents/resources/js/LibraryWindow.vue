<script setup lang="ts">
import type { LibraryData } from '@generated/types/documents';
import RecordSection from './RecordSection.vue';

/**
 * The library: the newest documents and reports by number, the forms that file new ones, and why a fresh library
 * is empty.
 */
defineProps<{ data: LibraryData }>();
</script>

<template>
    <div class="flex flex-col gap-6 p-6">
        <p class="text-small text-text-3">{{ data.sharingNotice }}</p>
        <template v-if="data.documents.rows.length === 0 && data.reports.rows.length === 0">
            <p class="text-empty text-text-3">
                No documents or reports yet. A document is lasting knowledge kept
                as revisions; a report says what was checked or found, once.
            </p>
        </template>
        <RecordSection heading="Documents" kind="doc" path="docs" :rows="data.documents.rows" create-label="File document" />
        <RecordSection heading="Reports" kind="report" path="reports" :rows="data.reports.rows" create-label="File report" />
    </div>
</template>
