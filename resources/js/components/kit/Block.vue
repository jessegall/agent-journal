<script setup lang="ts">
import { isPlainKey } from '@/kit/keyboard';
import { computed } from 'vue';

/**
 * One block of a document a reader comments on: a paragraph, heading, list item or code block, washed when selected and
 * barred in the margin when commented. Its line number is on data-line; a click picks it, Up and Down move the cursor
 * and C asks to comment. Measures: docs/designs/kit-components.md.
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

    if (isPlainKey(event, 'c')) {
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
