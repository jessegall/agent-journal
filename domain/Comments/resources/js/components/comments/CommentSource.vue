<script setup lang="ts">
import { computed } from 'vue';
import type { TextCommentLocation } from '@/generated/types/comments';

/**
 * The source lines a text comment points at, from the version it was left on, numbered as in the whole text, with
 * the exact bytes of the quote marked.
 */
const props = defineProps<{ location: TextCommentLocation }>();

type LinePiece = { text: string; marked: boolean };

/** One source line by its number in the whole text, split into marked and plain pieces. */
type SourceLine = { number: number; pieces: LinePiece[] };

const encoder = new TextEncoder();
const decoder = new TextDecoder();

/**
 * Each line of the part split into marked and plain pieces by the anchor's byte range, counted from the anchor's
 * first line.
 */
const lines = computed<SourceLine[]>(() => {
    const anchor = props.location.anchor;
    const isQuote = anchor.quote !== '';
    let windowByte = 0;

    return props.location.part.text.split('\n').map((line, index): SourceLine => {
        const number = props.location.part.firstLine + index;
        const lineBytes = encoder.encode(line);
        const inWindow = number >= anchor.firstLine && number <= anchor.lastLine;

        if (!inWindow) {
            return { number, pieces: [{ text: line, marked: false }] };
        }

        const lineStart = windowByte;
        windowByte += lineBytes.length + 1;

        if (!isQuote) {
            return { number, pieces: [{ text: line, marked: true }] };
        }

        const from = Math.min(Math.max(anchor.startOffset - lineStart, 0), lineBytes.length);
        const to = Math.min(Math.max(anchor.endOffset - lineStart, 0), lineBytes.length);

        return {
            number,
            pieces: [
                { text: decoder.decode(lineBytes.slice(0, from)), marked: false },
                { text: decoder.decode(lineBytes.slice(from, to)), marked: true },
                { text: decoder.decode(lineBytes.slice(to)), marked: false },
            ],
        };
    });
});
</script>

<template>
    <section class="flex flex-col gap-2">
        <p class="text-small text-text-3">Version {{ location.anchor.versionLabel }}, lines {{ location.anchor.firstLine }}–{{ location.anchor.lastLine }}</p>
        <pre class="font-mono text-small overflow-x-auto"><template v-for="line in lines" :key="line.number"><span class="text-text-3 tabular-nums">{{ String(line.number).padStart(4, ' ') }}  </span><template v-for="(piece, at) in line.pieces" :key="at"><template v-if="piece.marked"><mark>{{ piece.text }}</mark></template><template v-else>{{ piece.text }}</template></template>
</template></pre>
    </section>
</template>
