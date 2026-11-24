<script setup lang="ts">
/**
 * What a dialog says after it sent a change: the journal's refusal as an alert, or, when no answer came, that the
 * outcome is unknown, in the dialog's own words for what may or may not have happened.
 */
defineProps<{ refusal: string; isUnknown: boolean; unknown: string }>();
</script>

<template>
    <template v-if="refusal !== ''">
        <p role="alert" class="text-small text-danger">{{ refusal }}</p>
    </template>
    <template v-if="isUnknown">
        <p role="status" class="text-small text-text-2">Outcome unknown: {{ unknown }}</p>
    </template>
</template>
