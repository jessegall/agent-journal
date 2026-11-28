<script setup lang="ts">
import { computed } from 'vue';

/**
 * How far a message got, as ticks right under its bubble: one tick sent, two arrived, two heavier ticks in the text
 * colour read. The words come from `label`, shown on hover and read to a screen reader. 16 × 10 px, a 1.6 px line, 2.2
 * px when read.
 */
const props = defineProps<{ state: 'sent' | 'arrived' | 'read'; label: string }>();

const isRead = computed(() => props.state === 'read');
</script>

<template>
    <span
        role="img"
        :aria-label="label"
        :title="label"
        :data-ticks="state"
        class="inline-flex items-center"
        :class="isRead ? 'text-text' : 'text-text-4'"
    >
        <svg width="16" height="10" viewBox="0 0 16 10" fill="none" aria-hidden="true">
            <path
                d="M1 5.2 3.8 8 9.6 2"
                stroke="currentColor"
                :stroke-width="isRead ? 2.2 : 1.6"
                stroke-linecap="round"
                stroke-linejoin="round"
            />
            <template v-if="state !== 'sent'">
                <path
                    d="M7.4 7.2 8.2 8 14 2"
                    stroke="currentColor"
                    :stroke-width="isRead ? 2.2 : 1.6"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                />
            </template>
        </svg>
    </span>
</template>
