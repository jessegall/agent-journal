<script setup lang="ts">
import Icon from './Icon.vue';
import type { IconName } from './Icon.vue';

/**
 * One clickable line in the chat: an icon, its text and a chevron, in --text-badge --text-3 with no border or padding.
 * Bold parts of the text (b or strong) take --text-2 at 500. Hover takes --text-2 and focus draws the ring at
 * offset 2. A line that opens something says whether it is open: the chevron turns a quarter when it is, and stands
 * still under reduced motion.
 */
withDefaults(
    defineProps<{
        icon: IconName;
        expanded?: boolean;
        controls?: string;
    }>(),
    { expanded: undefined, controls: undefined },
);
</script>

<template>
    <button
        type="button"
        :aria-expanded="expanded"
        :aria-controls="controls"
        class="inline-flex w-fit cursor-pointer items-center gap-1.75 border-0 bg-transparent p-0 text-left text-badge text-text-3 transition-colors duration-(--duration-hover) hover:text-text-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus motion-reduce:transition-none [&_b]:font-medium [&_b]:text-text-2 [&_strong]:font-medium [&_strong]:text-text-2"
    >
        <Icon :name="icon" :size="14" />
        <span class="min-w-0"><slot /></span>
        <span
            aria-hidden="true"
            class="inline-flex shrink-0 transition-transform duration-(--duration-hover) motion-reduce:transition-none"
            :class="{ 'rotate-90': expanded }"
        >
            <Icon name="chevron" :size="12" />
        </span>
    </button>
</template>
