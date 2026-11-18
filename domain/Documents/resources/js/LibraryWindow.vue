<script setup lang="ts">
import { router } from '@inertiajs/vue3';
import { ref } from 'vue';
import type { LibraryData } from '@generated/types/documents';
import RecordSection from './RecordSection.vue';

/**
 * The library: the newest documents and reports by number, the forms that file new ones, and why a fresh library
 * is empty.
 */
const props = defineProps<{ data: LibraryData }>();

const query = ref(props.data.query);
const attention = ref<string>(props.data.attention);
const type = ref<string>(new URLSearchParams(window.location.search).get('type') ?? 'all');

/**
 * Keeps the search, the type and the attention filter in the address, so Back from a record returns to the same list.
 */
function search(): void {
    const filters: Record<string, string> = { attention: attention.value, type: type.value };

    if (query.value !== '') {
        filters.query = query.value;
    }

    router.get(window.location.pathname, filters, { preserveState: true, preserveScroll: true });
}
</script>

<template>
    <div class="flex flex-col gap-6 p-4 sm:p-6">
        <p class="text-small text-text-3">{{ data.sharingNotice }}</p>
        <form class="flex flex-wrap gap-2" role="search" @submit.prevent="search">
            <input v-model="query" class="input min-w-0 flex-1" type="search" maxlength="200" aria-label="Search titles, abstracts and text" placeholder="Search titles, abstracts and text" />
            <select v-model="type" class="input" aria-label="Type" @change="search">
                <option value="all">Documents and reports</option>
                <option value="doc">Documents</option>
                <option value="report">Reports</option>
            </select>
            <select v-model="attention" class="input" aria-label="Attention" @change="search">
                <option value="active">Active</option>
                <option value="settled">Settled</option>
                <option value="all">All</option>
            </select>
        </form>
        <template v-if="data.documents.rows.length === 0 && data.reports.rows.length === 0">
            <p class="text-empty text-text-3">
                No documents or reports yet. A document is lasting knowledge kept
                as revisions; a report says what was checked or found, once.
            </p>
        </template>
        <template v-if="type !== 'report'">
            <RecordSection heading="Documents" type="doc" path="docs" :rows="data.documents.rows" create-label="File document" />
        </template>
        <template v-if="type !== 'doc'">
            <RecordSection heading="Reports" type="report" path="reports" :rows="data.reports.rows" create-label="File report" />
        </template>
    </div>
</template>
