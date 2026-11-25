<script setup lang="ts">
import { computed, nextTick, ref, useTemplateRef } from 'vue';
import Button from './Button.vue';
import CommentButton from './CommentButton.vue';

/**
 * Lets a reader comment on lines of a document (Blocks) or of a file (CodeLines). It owns the numbered lines, the
 * selection and the line cursor, and draws, through slots, each line, the thread under a commented line and the
 * CommentBar under the last selected line. A click or drag of text, a click on a gutter (Shift extends), or Up and Down
 * from a gutter (Shift extends) select; C, the floating CommentButton or the whole-text button, when named, open the bar.
 * Escape clears the selection. The bar's slot gets close() to end the comment.
 */
// wholeLabel names the button that comments on the whole text, such as Comment on this document; none shows no button.
const props = defineProps<{ lineCount: number; commentedLines: number[]; wholeLabel?: string }>();

const emit = defineEmits<{ comment: [from: number, to: number] }>();

const root = useTemplateRef<HTMLElement>('root');
const range = ref<{ from: number; to: number } | undefined>();
const anchor = ref(1);
const cursor = ref(1);
const isComposing = ref(false);
const isButtonHidden = ref(false);
const buttonPlace = ref({ top: 0, left: 0 });
const lines = computed(() => Array.from({ length: props.lineCount }, (_, index) => index + 1));

function select(from: number, to: number): void {
    range.value = { from: Math.min(from, to), to: Math.max(from, to) };
    isButtonHidden.value = false;
    placeButton();
}

async function placeButton(): Promise<void> {
    await nextTick();

    const end = root.value?.querySelector<HTMLElement>(`[data-line="${range.value?.to}"]`);

    if (end) {
        buttonPlace.value = { top: end.offsetTop, left: end.offsetLeft + end.offsetWidth };
    }
}

function pick(line: number, extend: boolean): void {
    cursor.value = line;

    if (!extend) {
        anchor.value = line;
    }

    select(anchor.value, line);
}

async function step(line: number, direction: -1 | 1, extend: boolean): Promise<void> {
    const next = Math.min(props.lineCount, Math.max(1, line + direction));

    cursor.value = next;

    if (extend) {
        select(anchor.value, next);
    } else {
        anchor.value = next;
        range.value = undefined;
    }

    await nextTick();
    const holder = root.value?.querySelector<HTMLElement>(`[data-line="${next}"]`);
    (holder?.querySelector<HTMLElement>('button') ?? holder)?.focus();
}

function comment(): void {
    const chosen = range.value ?? { from: cursor.value, to: cursor.value };

    range.value = chosen;
    isComposing.value = true;
    emit('comment', chosen.from, chosen.to);
}

function commentOnAll(): void {
    select(1, props.lineCount);
    comment();
}

function close(): void {
    isComposing.value = false;
}

function lineOf(node: Node | null): number | undefined {
    const holder = (node instanceof Element ? node : node?.parentElement)?.closest<HTMLElement>('[data-line]');

    return holder ? Number(holder.dataset.line) : undefined;
}

function onTextSelected(): void {
    const chosen = window.getSelection();

    if (!chosen || chosen.isCollapsed) {
        return;
    }

    const first = lineOf(chosen.anchorNode);
    const last = lineOf(chosen.focusNode);

    if (first !== undefined && last !== undefined) {
        anchor.value = first;
        cursor.value = last;
        select(first, last);
    }
}

function clear(): void {
    range.value = undefined;
    isComposing.value = false;
}

defineSlots<{
    line(props: {
        line: number;
        selected: boolean;
        cursor: boolean;
        commented: boolean;
        pick: (extend: boolean) => void;
        step: (direction: -1 | 1, extend: boolean) => void;
        comment: () => void;
    }): unknown;
    thread(props: { line: number }): unknown;
    bar(props: { from: number; to: number; close: () => void }): unknown;
}>();
</script>

<template>
    <div ref="root" class="relative" @mouseup="onTextSelected" @keydown.esc="clear">
        <template v-if="wholeLabel !== undefined">
            <Button size="sm" class="mb-2" @click="commentOnAll">{{ wholeLabel }}</Button>
        </template>
        <template v-for="line in lines" :key="line">
            <slot
                name="line"
                :line="line"
                :selected="range !== undefined && line >= range.from && line <= range.to"
                :cursor="line === cursor"
                :commented="commentedLines.includes(line)"
                :pick="(extend: boolean) => pick(line, extend)"
                :step="(direction: -1 | 1, extend: boolean) => step(line, direction, extend)"
                :comment="comment"
            />
            <slot v-if="commentedLines.includes(line)" name="thread" :line="line" />
            <slot v-if="isComposing && range?.to === line" name="bar" :from="range.from" :to="range.to" :close="close" />
        </template>
        <template v-if="range && !isComposing && !isButtonHidden">
            <CommentButton
                :top="buttonPlace.top"
                :left="buttonPlace.left"
                @comment="comment"
                @dismiss="isButtonHidden = true"
            />
        </template>
    </div>
</template>
