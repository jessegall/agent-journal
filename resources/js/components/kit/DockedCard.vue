<script setup lang="ts">
import Icon from './Icon.vue';
import type { IconName } from './Icon.vue';
import IconButton from './IconButton.vue';

/**
 * A card pinned to a chat, focusable and labelled with its title, docked: Enter opens the item. It shows its icon,
 * title and subline or the default slot, the trail slot's state, and Open and Undock at the end; it enters with a short
 * rise, none under reduced motion. Measures: docs/designs/kit-components.md.
 */
withDefaults(defineProps<{ title: string; icon?: IconName; subline?: string; canOpen?: boolean }>(), {
    icon: undefined,
    subline: undefined,
    canOpen: true,
});

defineEmits<{ open: []; undock: [] }>();
</script>

<template>
    <div
        role="group"
        tabindex="0"
        :aria-label="`${title}, docked`"
        class="docked-card-enter relative flex items-center gap-2.5 overflow-hidden rounded-card border border-border-3 bg-raised py-2 pr-2 pl-3 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-focus"
        @keydown.enter.self="canOpen && $emit('open')"
    >
        <template v-if="icon">
            <Icon :name="icon" :size="16" class="flex-none text-text-3" />
        </template>
        <div class="min-w-0 flex-1">
            <slot>
                <b class="block truncate font-medium text-text">{{ title }}</b>
                <template v-if="subline">
                    <small class="block text-badge text-text-3">{{ subline }}</small>
                </template>
            </slot>
        </div>
        <slot name="trail" />
        <template v-if="canOpen">
            <IconButton icon="arrow" :label="`Open ${title}`" size="sm" @click="$emit('open')" />
        </template>
        <IconButton icon="close" :label="`Undock ${title}`" size="sm" @click="$emit('undock')" />
    </div>
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
