<script setup lang="ts">
/**
 * A turning ring in the current text colour, for work that is under way: small beside a line of text, large alone
 * in the middle of a step.
 */
withDefaults(defineProps<{ large?: boolean }>(), { large: false });
</script>

<template>
    <span
        aria-hidden="true"
        class="inline-block shrink-0 animate-spin rounded-full border-current border-r-transparent"
        :class="large ? 'size-7 border-[2.5px]' : 'size-[9px] border'"
    />
</template>
