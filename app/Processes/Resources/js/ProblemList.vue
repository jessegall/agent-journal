<script setup lang="ts">
import type { ProblemData } from '@generated/types/processes';

/**
 * Every problem of a part's output: its stable code, where in which stream, the reader revision, what it means and
 * what to do next.
 */
defineProps<{ problems: ProblemData[] }>();
</script>

<template>
    <ul aria-label="Problems">
        <template v-for="problem in problems" :key="`${problem.code}-${problem.stream}-${problem.start}`">
            <li>
                <strong>{{ problem.code }}</strong>
                <span> in {{ problem.stream }} bytes {{ problem.start }} to {{ problem.end }}:</span>
                <span> {{ problem.explanation }}</span>
                <span> Next: {{ problem.nextAction }}</span>
            </li>
        </template>
    </ul>
</template>
