<script setup lang="ts">
import Reader from '@kit/Reader';
import type { RecordPageData } from '@generated/types/documents';

/**
 * One document or report: its label and title, its abstract, and its body as the server's safe HTML.
 */
defineProps<{ data: RecordPageData }>();
</script>

<template>
    <Reader :title="data.title">
        <template #meta>
            <span class="font-mono tabular-nums">{{ data.label }}</span>
            <template v-if="data.revision">
                <span>revision {{ data.revision }}</span>
            </template>
        </template>
        <p class="mt-2 text-text-3">{{ data.abstract }}</p>
        <div class="prose mt-4" v-html="data.bodyHtml" />
    </Reader>
</template>
