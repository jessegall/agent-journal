<script setup lang="ts">
import type { IconName } from './Icon.vue';
import IconButton from './IconButton.vue';
import ItemCard from './ItemCard.vue';

/**
 * An ItemCard pinned to a chat: padding 8 8 8 12, focusable and labelled "<title>, docked"; Enter on the card opens
 * the item. The trail slot holds what the kind shows (a Status for a task or plan, Answer for a question) and Open and
 * Undock sit at the end. It enters from 8px below over 240 ms, and without motion under reduced motion.
 */
defineProps<{
    icon: IconName;
    title: string;
    subline?: string;
    meter?: { value: number; label: string };
}>();

defineEmits<{ open: []; undock: [] }>();
</script>

<template>
    <ItemCard
        role="group"
        :aria-label="`${title}, docked`"
        :icon="icon"
        :title="title"
        :subline="subline"
        :meter="meter"
        padding="sm"
        interactive
        class="docked-card-enter"
        @keydown.enter.self="$emit('open')"
    >
        <template #trail><slot name="trail" /></template>
        <template #actions>
            <IconButton icon="arrow" label="Open" size="sm" @click="$emit('open')" />
            <IconButton icon="dock" label="Undock" size="sm" @click="$emit('undock')" />
        </template>
    </ItemCard>
</template>

<style scoped>
@keyframes docked-card-enter {
    from {
        opacity: 0;
        transform: translateY(8px);
    }
}

.docked-card-enter {
    animation: docked-card-enter var(--duration-view) var(--ease-journal);
}

@media (prefers-reduced-motion: reduce) {
    .docked-card-enter {
        animation: none;
    }
}
</style>
