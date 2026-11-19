<script setup lang="ts">
import type { IconName } from '@/components/kit/Icon.vue';
import Icon from '@/components/kit/Icon.vue';

/**
 * What a list shows when it holds nothing yet: an icon, a line saying so, a line on what to do, and the slot for the
 * action that starts it.
 */
defineProps<{ icon: IconName; title: string; text?: string }>();
</script>

<template>
    <div
        class="flex flex-col items-center gap-2 px-6 py-10 text-center text-text-3"
    >
        <Icon :name="icon" :size="20" />
        <p class="text-card text-text-2">{{ title }}</p>
        <p v-if="text" class="max-w-[42ch] text-small">{{ text }}</p>
        <div v-if="$slots.default" class="mt-2"><slot /></div>
    </div>
</template>
