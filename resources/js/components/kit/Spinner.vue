<script setup lang="ts">
/**
 * A turning ring in the current text colour, for work that is under way: 11 px beside a line of text (28 px when
 * large, alone in the middle of a step). It turns once per 0.9 s, and per 3 s under reduced motion. It is hidden
 * from assistive technology; the Status word carries the meaning.
 */
withDefaults(defineProps<{ large?: boolean }>(), { large: false });
</script>

<template>
    <span
        aria-hidden="true"
        class="spinner inline-block shrink-0 rounded-full border-current/30 border-t-current"
        :class="large ? 'size-7 border-[2.5px]' : 'size-2.75 border-[1.5px]'"
    />
</template>
