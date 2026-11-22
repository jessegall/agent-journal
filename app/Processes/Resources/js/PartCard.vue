<script setup lang="ts">
import type {
    PartOutputData,
    PartSnapshotData,
    ProblemData,
} from '@generated/types/processes';
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
    if (props.part.receiptId !== null) {
        return `${props.part.outcome} (receipt ${props.part.receiptId})`;
    }

    return props.part.assessmentId === null
        ? 'result unavailable: not assessed'
        : 'result unavailable';
});
const exitText = computed(() => {
    if (props.part.receiptId !== null || props.part.problems.length === 0) {
        return '';
    }

    return `Process ${props.part.end}. Output could not be interpreted.`;
});
</script>

<template>
    <article class="flex flex-col gap-1" :aria-label="`Part ${part.operation}`">
        <h3>{{ part.operation }}</h3>
        <p>Status: {{ part.lifecycle }}, ended by {{ part.end }}</p>
        <template v-if="part.capture === 'removed'">
            <p>Output removed</p>
        </template>
        <p>
            Output {{ part.capture }}, after {{ part.elapsedSeconds }} seconds:
            {{ JSON.stringify(part.bytes) }} bytes
        </p>
        <p>Reading: {{ part.reading }}</p>
        <p>Result: {{ result }}</p>
        <template v-if="exitText !== ''">
            <p>{{ exitText }}</p>
        </template>
        <template v-if="problems.length > 0">
            <ProblemList :problems="problems" />
        </template>
        <template v-if="part.latestLine !== null">
            <p>
                Latest: <code>{{ part.latestLine }}</code>
            </p>
        </template>
        <template v-if="outputs.length === 0 && part.capture !== 'removed'">
            <p class="text-text-3">No output yet. Status {{ part.lifecycle }}, ended by {{ part.end }}.</p>
        </template>
        <template v-for="output in outputs" :key="output.stream">
            <PartOutput :output="output" />
        </template>
    </article>
</template>
