<script setup lang="ts">
import Icon from './Icon.vue';

/**
 * One quiet line that quotes another message: a reply arrow, who wrote it and one line of its text, cut off with an
 * ellipsis. Pressing it asks to show the quoted message.
 */
defineProps<{ name: string; text: string }>();

const emit = defineEmits<{ show: [] }>();
</script>

<template>
    <button
        type="button"
        class="group/quote mb-1 flex max-w-full min-w-0 items-center gap-[5px] text-left text-badge leading-4 text-text-3 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-focus"
        :title="text"
        :aria-label="`Answers ${name}: ${text}. Show it`"
        @click="emit('show')"
    >
        <Icon name="reply" :size="13" class="flex-none text-text-4" />
        <b class="flex-none font-medium text-text-2">{{ name }}</b>
        <span
            class="max-w-[280px] min-w-0 truncate group-hover/quote:text-text-2 group-hover/quote:underline group-hover/quote:decoration-border-3 group-hover/quote:underline-offset-2"
            >{{ text }}</span
        >
    </button>
</template>
