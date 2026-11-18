<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import type { TextPart } from '@/generated/types/core';
import { read } from '@/routes/text';
import Button from '@/components/kit/Button.vue';
import { describeRange, quoteIn, type TextRangeChoice } from './textRange';

/**
 * A window of a record's source text at one pinned version, with its real line numbers. The reader selects exact
 * text in it, or types a span of lines, and confirms the place before it is used; nothing is searched for.
 */
const props = defineProps<{ target: string; version: string; firstLine: number; lastLine: number }>();

const emit = defineEmits<{ choose: [range: TextRangeChoice]; close: [] }>();

const part = ref<TextPart | null>(null);
const failure = ref('');
const lines = computed(() => (part.value === null ? [] : part.value.text.split('\n')));
const pane = ref<HTMLElement | null>(null);
const chosen = ref<TextRangeChoice | null>(null);
const typedFirst = ref(props.firstLine);
const typedLast = ref(props.lastLine);
const hasMarkdown = computed(() => chosen.value?.type === 'quote' && /[*_`[\]]/.test(chosen.value.quote));

onMounted(async () => {
    const reply = await fetch(read.url({ query: { target: props.target, version: props.version, first_line: props.firstLine, last_line: props.lastLine } }), { headers: { Accept: 'application/json' } });

    if (reply.ok) {
        part.value = (await reply.json()) as TextPart;
    } else {
        failure.value = ((await reply.json()) as { message: string }).message;
    }
});

/**
 * The line and character a DOM position stands for, read from the line element it sits in.
 */
function positionOf(node: Node, offset: number): { line: number; character: number } | null {
    const element = node instanceof HTMLElement ? node : node.parentElement;
    const lineElement = element?.closest<HTMLElement>('[data-line]');

    return lineElement ? { line: Number(lineElement.dataset.line), character: offset } : null;
}

function takeSelection(): void {
    const selection = window.getSelection();

    if (part.value === null || selection === null || selection.isCollapsed || selection.anchorNode === null || selection.focusNode === null) {
        return;
    }

    const ends = [positionOf(selection.anchorNode, selection.anchorOffset), positionOf(selection.focusNode, selection.focusOffset)];

    if (ends[0] === null || ends[1] === null) {
        return;
    }

    const [start, end] = ends[0].line < ends[1].line || (ends[0].line === ends[1].line && ends[0].character <= ends[1].character) ? [ends[0], ends[1]] : [ends[1], ends[0]];
    chosen.value = quoteIn(lines.value, part.value.firstLine, start, end, props.version);
}

function takeLines(): void {
    chosen.value = { type: 'lines', version: props.version, firstLine: Math.min(typedFirst.value, typedLast.value), lastLine: Math.max(typedFirst.value, typedLast.value) };
}

function confirm(): void {
    if (chosen.value !== null) {
        emit('choose', chosen.value);
    }
}
</script>

<template>
    <section class="flex flex-col gap-2" aria-label="Source text">
        <p class="text-small text-text-3">Version {{ version }}, lines {{ firstLine }}–{{ lastLine }}</p>
        <template v-if="failure">
            <p class="text-small text-warn">{{ failure }} Choose fewer lines, or comment on the lines instead of a quote.</p>
        </template>
        <pre ref="pane" class="font-mono text-small overflow-x-auto" tabindex="0" @mouseup="takeSelection" @keyup="takeSelection"><template v-for="(line, index) in lines" :key="index"><span class="text-text-3 tabular-nums select-none">{{ String((part?.firstLine ?? 0) + index).padStart(4, ' ') }}  </span><span :data-line="(part?.firstLine ?? 0) + index">{{ line }}</span>
</template></pre>
        <div class="flex flex-wrap items-center gap-2">
            <label class="text-small">From line <input v-model.number="typedFirst" type="number" class="input w-20" :min="firstLine" :max="lastLine" /></label>
            <label class="text-small">to <input v-model.number="typedLast" type="number" class="input w-20" :min="firstLine" :max="lastLine" /></label>
            <Button @click="takeLines">Use these lines</Button>
            <Button variant="primary" :disabled="chosen === null" @click="confirm">Comment on this</Button>
            <Button @click="emit('close')">Cancel</Button>
        </div>
        <p class="text-small text-text-3" aria-live="polite">
            <template v-if="chosen">Chosen: {{ describeRange(chosen) }}.</template>
        </p>
        <template v-if="hasMarkdown">
            <p class="text-small text-text-3">The source holds Markdown marks (such as ** or a link) that the page shows as formatting.</p>
        </template>
    </section>
</template>
