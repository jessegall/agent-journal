<script setup lang="ts">
import type { IconName } from '@/components/kit/Icon.vue';
import Icon from '@/components/kit/Icon.vue';

/**
 * What a list shows when it holds nothing yet: a title, a line of text, and the slot for the action that starts it
 * (a bordered small button 12 px below). `fill` covers its parent, for an empty desk. An icon is optional.
 */
defineProps<{ title: string; text?: string; icon?: IconName; fill?: boolean }>();
</script>

<template>
    <div
        class="flex flex-col items-center justify-center px-6 py-12 text-center text-empty text-text-3"
        :class="fill && 'absolute inset-0'"
    >
        <template v-if="icon">
            <Icon :name="icon" :size="20" class="mb-2" />
        </template>
        <p class="font-medium text-text-2">{{ title }}</p>
        <template v-if="text">
            <p class="mt-1 max-w-[42ch]">{{ text }}</p>
        </template>
        <template v-if="$slots.default">
            <div class="mt-3"><slot /></div>
        </template>
    </div>
</template>
