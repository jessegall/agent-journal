<script setup lang="ts">
/**
 * One line of a read-only file: a gutter 50 wide with the right-aligned number (padding-right 14, the theme's gutter
 * colour) and the code in the slot, mono --text-small at line height 20 with padding-right 80. A selected line takes
 * the theme's selection fill. A 6px dot at left 10, top 7 marks a comment (the theme's marker) or a draft (hollow).
 * The theme comes from the --code-gutter, --code-selection and --code-marker variables of the file around it.
 * The gutter is a button: a click picks the line (Shift extends), Up and Down move the line cursor (Shift extends the
 * selection) and C asks to comment. Only the cursor line is in the tab order.
 */
defineProps<{ line: number; selected?: boolean; cursor?: boolean; marker?: 'comment' | 'draft' }>();

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
</script>

<template>
    <div
        :data-line="line"
        class="relative flex font-mono text-small leading-5"
        :class="selected && 'bg-[var(--code-selection,color-mix(in_srgb,var(--brand)_10%,transparent))]'"
    >
        <span
            v-if="marker"
            aria-hidden="true"
            class="absolute top-1.75 left-2.5 size-1.5 rounded-full"
            :class="
                marker === 'comment'
                    ? 'bg-[var(--code-marker,var(--brand))]'
                    : 'border border-[var(--code-marker,var(--brand))]'
            "
        />
        <button
            type="button"
            :aria-label="`Line ${line}`"
            :aria-pressed="selected === true"
            :tabindex="cursor ? 0 : -1"
            class="w-12.5 shrink-0 cursor-pointer pr-3.5 text-right text-[var(--code-gutter,var(--text-4))] tabular-nums select-none focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-focus"
            @click="emit('pick', $event.shiftKey)"
            @keydown="onKey"
        >
            {{ line }}
        </button>
        <pre class="m-0 min-w-0 flex-1 pr-20 font-[inherit] whitespace-pre"><slot /></pre>
    </div>
</template>
