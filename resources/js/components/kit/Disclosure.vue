<script setup lang="ts">
import Icon from './Icon.vue';

/**
 * The button that shows or hides a region: it says whether the region is open and names the region it controls; the
 * caller gives its words and decides what opening does.
 */
defineProps<{ expanded: boolean; controls: string }>();
defineEmits<{ toggle: [] }>();
</script>

<template>
    <button
        type="button"
        :aria-expanded="expanded"
        :aria-controls="controls"
        class="inline-flex min-w-0 items-center gap-1.5 rounded-button text-left text-text hover:text-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text"
        @click="$emit('toggle')"
    >
        <Icon
            name="chevron"
            :size="12"
            class="transition-transform duration-(--duration-hover) motion-reduce:transition-none"
            :class="{ 'rotate-90': expanded }"
        />
        <slot />
    </button>
</template>
