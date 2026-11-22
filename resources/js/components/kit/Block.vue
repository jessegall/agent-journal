<script setup lang="ts">
import { computed } from 'vue';

/**
 * One block of a document a reader can comment on: a paragraph, a heading, a list item or a code block, with radius
 * 6. Code is mono 12 on --code-bg with a 1px --line border, radius 8 and padding 10 12. A selected block takes a 9%
 * --brand wash; a block with a comment shows a 2px --border-3 bar in the margin to its left, so its text does not move.
 * The line number goes on data-line for the LineCommentable that selects it.
 */
const props = defineProps<{
    kind: 'paragraph' | 'heading' | 'item' | 'code';
    line: number;
    selected?: boolean;
    commented?: boolean;
}>();

const tag = computed(() => ({ paragraph: 'p', heading: 'h3', item: 'li', code: 'pre' })[props.kind]);
</script>

<template>
    <component
        :is="tag"
        :data-line="line"
        class="relative m-0 rounded-control"
        :class="[
            selected && 'bg-brand/9',
            commented &&
                'before:absolute before:inset-y-0 before:-left-3 before:w-0.5 before:rounded-full before:bg-border-3',
            kind === 'heading' && 'font-semibold text-text',
            kind === 'code' &&
                'overflow-x-auto rounded-field border border-line bg-code-bg px-3 py-2.5 font-mono text-small whitespace-pre',
        ]"
    >
        <slot />
    </component>
</template>
