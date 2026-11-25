<script setup lang="ts">
import { computed } from 'vue';

/**
 * One block of a document a reader can comment on: a paragraph, a heading, a list item or a code block, with radius
 * 6. Code is mono 12 on --code-bg with a 1px --line border, radius 8 and padding 10 12. A selected block takes a 9%
 * --brand wash; a block with a comment shows a 2px --border-3 bar in the margin to its left, so its text does not move.
 * The line number goes on data-line for the LineCommentable that selects it. A click picks the block (Shift extends),
 * Up and Down move the cursor (Shift extends the selection) and C asks to comment; only the cursor block is in the tab
 * order.
 */
const props = defineProps<{
    kind: 'paragraph' | 'heading' | 'item' | 'code';
    line: number;
    selected?: boolean;
    commented?: boolean;
    cursor?: boolean;
}>();

const emit = defineEmits<{ pick: [extend: boolean]; step: [direction: -1 | 1, extend: boolean]; comment: [] }>();

function onKey(event: KeyboardEvent): void {
    const direction = ({ ArrowUp: -1, ArrowDown: 1 } as const)[event.key as 'ArrowUp' | 'ArrowDown'];

    if (direction !== undefined) {
        event.preventDefault();
        emit('step', direction, event.shiftKey);

        return;
    }

    if (event.key.toLowerCase() === 'c' && !event.ctrlKey && !event.metaKey && !event.altKey) {
        event.preventDefault();
        emit('comment');
    }
}

const tag = computed(() => ({ paragraph: 'p', heading: 'h3', item: 'li', code: 'pre' })[props.kind]);
</script>

<template>
    <component
        :is="tag"
        :data-line="line"
        :tabindex="cursor ? 0 : -1"
        class="relative m-0 rounded-control focus-visible:outline-2 focus-visible:outline-focus"
        :class="[
            selected && 'bg-brand/9',
            commented &&
                'before:absolute before:inset-y-0 before:-left-3 before:w-0.5 before:rounded-full before:bg-border-3',
            kind === 'heading' && 'font-semibold text-text',
            kind === 'code' &&
                'overflow-x-auto rounded-field border border-line bg-code-bg px-3 py-2.5 font-mono text-small whitespace-pre',
        ]"
        @click="emit('pick', $event.shiftKey)"
        @keydown="onKey"
    >
        <slot />
    </component>
</template>
