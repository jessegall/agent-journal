<script setup lang="ts">
import type { RevisionPageData } from '@generated/types/documents';
import Reader from '@kit/Reader';

/**
 * One revision of a document, read-only: marked historical when a later one exists, with a link back to the current
 * text.
 */
defineProps<{ data: RevisionPageData }>();

</script>

<template>
    <Reader :title="data.title">
        <template #meta>
            <span class="font-mono tabular-nums">doc {{ data.documentNumber }}, revision {{ data.number }}</span>
            <template v-if="data.historical">
                <span class="text-warn">historical</span>
                <a :href="`/documents/docs/${data.documentNumber}`">Current</a>
            </template>
        </template>
        <p class="mt-2 text-text-3">{{ data.abstract }}</p>
        <div class="prose mt-4" v-html="data.bodyHtml" />
    </Reader>
</template>
