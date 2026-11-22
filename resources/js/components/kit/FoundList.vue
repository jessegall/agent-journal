<script setup lang="ts">
/**
 * What an activity item or a sources line found, one line each, as a list under it: indented 69 with a --line rule on
 * its left, in --text-badge --text-3. A line is plain text unless the slot draws it.
 */
defineProps<{ lines: string[]; label: string }>();
</script>

<template>
    <ul
        :aria-label="label"
        class="m-0 ml-[calc(var(--spacing)*17.25)] list-none border-l border-line py-1 pl-2.5 text-badge text-text-3"
    >
        <li v-for="line in lines" :key="line" class="py-0.5 [overflow-wrap:anywhere]">
            <slot :line="line">{{ line }}</slot>
        </li>
    </ul>
</template>
