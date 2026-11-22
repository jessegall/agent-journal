<script setup lang="ts">
import type { RevisionPageData } from '@generated/types/documents';
import { dateTime } from '@kit/format';
import Reader from '@kit/Reader';

/**
 * One revision of a document, read-only, with its number and the time it was saved: marked historical when a later
 * one exists, with a link back to the current text; an empty body says so.
 */
defineProps<{ data: RevisionPageData }>();
</script>

<template>
    <Reader :title="data.title">
        <template #meta>
            <span class="font-mono tabular-nums"
                >doc {{ data.documentNumber }}, revision {{ data.number }}</span
            >
            <span class="text-text-3">{{ dateTime(data.closedAt) }}</span>
            <template v-if="data.historical">
                <span class="text-warn">historical</span>
                <a :href="`/documents/docs/${data.documentNumber}`">Current</a>
            </template>
        </template>
        <p class="mt-2 text-text-3">{{ data.abstract }}</p>
        <template v-if="data.bodyHtml.trim() === ''">
            <p class="mt-4 text-text-3">This revision has no text.</p>
        </template>
        <template v-else>
            <div class="prose mt-4" v-html="data.bodyHtml" />
        </template>
    </Reader>
</template>
