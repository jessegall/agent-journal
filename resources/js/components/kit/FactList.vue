<script setup lang="ts">
/**
 * A record's facts as a definition list: a grid of the term column and the value column, gap 4 16, in --text-field.
 * Its parts are FactItem, one per fact; a value is text, a TextLink or an xs ChipButton.
 */
</script>

<template>
    <dl class="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-field">
        <slot />
    </dl>
</template>
