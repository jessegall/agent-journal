<script setup lang="ts">
import { computed } from 'vue';
import Icon, { type IconName } from './Icon.vue';

/**
 * The chip that follows the pointer while a tab, a window or a document is dragged: 28 high, --raised with a --border-3
 * border, radius --radius-button and --shadow-pop, a 13px Icon and the title. It sits 12 right and 10 below the pointer,
 * above everything, and never takes the pointer. It is hidden from assistive technology: the drag has a menu path.
 */
const props = defineProps<{ icon: IconName; title: string; x: number; y: number }>();

const GHOST_OFFSET_X = 12;
const GHOST_OFFSET_Y = 10;

const place = computed(() => ({ transform: `translate(${props.x + GHOST_OFFSET_X}px, ${props.y + GHOST_OFFSET_Y}px)` }));
</script>

<template>
    <div
        aria-hidden="true"
        class="pointer-events-none fixed top-0 left-0 z-(--z-drag-ghost) flex h-7 items-center gap-1.5 rounded-button border border-border-3 bg-raised px-2 text-small whitespace-nowrap text-text shadow-(--shadow-pop)"
        :style="place"
    >
        <Icon :name="icon" :size="13" />
        {{ title }}
    </div>
</template>
