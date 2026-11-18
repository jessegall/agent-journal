<script setup lang="ts">
import { nextTick, onMounted, ref } from 'vue';
import type { RevisionPageData } from '@generated/types/documents';
import Reader from '@kit/Reader';

/**
 * One revision of a document, read-only: marked historical when a later one exists, with a link back to the current
 * text, and the quote a comment points at highlighted in this revision only.
 */
const props = defineProps<{ data: RevisionPageData }>();

const body = ref<HTMLElement | null>(null);

function highlight(quote: string): void {
    const walker = document.createTreeWalker(body.value as HTMLElement, NodeFilter.SHOW_TEXT);

    for (let node = walker.nextNode(); node !== null; node = walker.nextNode()) {
        const at = node.textContent?.indexOf(quote) ?? -1;

        if (at !== -1) {
            const range = document.createRange();
            range.setStart(node, at);
            range.setEnd(node, at + quote.length);
            range.surroundContents(document.createElement('mark'));

            return;
        }
    }
}

onMounted(async () => {
    await nextTick();

    if (props.data.highlight) {
        highlight(props.data.highlight);
    }
});
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
        <div ref="body" class="prose mt-4" v-html="data.bodyHtml" />
    </Reader>
</template>
