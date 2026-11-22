<script setup lang="ts">
import type { PartOutputData } from '@generated/types/processes';

/**
 * The tail of one stream of a part, as escaped text: control bytes and invalid text arrive as escapes, so nothing in
 * the output can act as markup or a terminal instruction here.
 */
defineProps<{ output: PartOutputData }>();
</script>

<template>
    <details>
        <summary>{{ output.stream }}: bytes {{ output.startsAt }} to {{ output.size }} of {{ output.size }}</summary>
        <pre tabindex="0">{{ output.text }}</pre>
    </details>
</template>
