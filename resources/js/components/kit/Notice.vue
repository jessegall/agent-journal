<script setup lang="ts">
import Icon from './Icon.vue';

/**
 * A quiet line in the chat that is not a message, in --text-badge --text-3 with a gap of 7. Centred is a day or
 * system line, centred at most 86% wide; origin leads with the users icon and says who started the chat, for
 * example "Started by Agent 1 for plan 54 · 14:01". It is plain text with no action.
 */
withDefaults(defineProps<{ variant?: 'centred' | 'origin' }>(), { variant: 'centred' });
</script>

<template>
    <p
        class="flex items-center gap-1.75 text-badge text-text-3"
        :class="variant === 'centred' ? 'mx-auto max-w-[86%] justify-center text-center' : ''"
    >
        <template v-if="variant === 'origin'">
            <Icon name="users" :size="14" />
        </template>
        <span class="min-w-0"><slot /></span>
    </p>
</template>
