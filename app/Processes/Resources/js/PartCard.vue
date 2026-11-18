<script setup lang="ts">
import type { PartOutputData, PartSnapshotData, ProblemData } from '@generated/types/processes';
import { computed } from 'vue';
import PartOutput from './PartOutput.vue';
import ProblemList from './ProblemList.vue';

/**
 * One part of a run with its four observations as text: lifecycle with its own end, capture, the reader's reading
 * and the result. A pass, findings or allowed-empty label shows only with a receipt; otherwise the result is
 * unavailable with every problem. Progress is never a guessed percent.
 */
const props = defineProps<{
    part: PartSnapshotData;
    outputs: PartOutputData[];
    problems: ProblemData[];
    evidenceOnly: boolean;
}>();

const result = computed(() => {
    if (props.evidenceOnly) {
        return 'evidence only';
    }
    if (props.part.receiptId !== '') {
        return `${props.part.outcome} (receipt ${props.part.receiptId})`;
    }

    return props.part.assessmentId === '' ? 'result unavailable: not assessed' : 'result unavailable';
});
const exitText = computed(() => {
    if (props.part.receiptId !== '' || props.part.problems.length === 0) {
        return '';
    }

    return `Process ${props.part.end}. Output could not be interpreted.`;
});
</script>

<template>
    <article class="flex flex-col gap-1" :aria-label="`Part ${part.operation}`">
        <h3>{{ part.operation }}</h3>
        <p>Lifecycle: {{ part.lifecycle }}, end: {{ part.end }}</p>
        <p>Capture: {{ part.capture }}; {{ part.elapsedSeconds }} seconds; {{ JSON.stringify(part.bytes) }} bytes</p>
        <p>Reading: {{ part.reading }}</p>
        <p>Progress: indeterminate</p>
        <p>Result: {{ result }}</p>
        <template v-if="exitText !== ''">
            <p>{{ exitText }}</p>
        </template>
        <template v-if="problems.length > 0">
            <ProblemList :problems="problems" />
        </template>
        <template v-if="part.latestLine !== ''">
            <p>Latest: <code>{{ part.latestLine }}</code></p>
        </template>
        <template v-for="output in outputs" :key="output.stream">
            <PartOutput :output="output" />
        </template>
    </article>
</template>
