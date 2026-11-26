<script setup lang="ts">
import { computed } from 'vue';
import Card from './Card.vue';
import Icon from './Icon.vue';

/**
 * A document in a chat: one draggable button with the docs icon, the title and a line with its revision and, until
 * handed over, Drag onto an agent. Enter opens it, and Shift+Enter or the Menu key asks to hand it to an agent.
 * Measures: docs/designs/kit-components.md.
 */
const props = defineProps<{
    number: number;
    title: string;
    detail: string;
    handedOver?: boolean;
    lifting?: boolean;
}>();

const emit = defineEmits<{ open: []; hand: [] }>();

const label = computed(
    () => `Doc ${props.number}: ${props.title}. Enter opens it; Shift+Enter hands it to an agent.`,
);

function onKey(event: KeyboardEvent): void {
    const asksToHand = event.key === 'ContextMenu' || (event.key === 'Enter' && event.shiftKey);

    if (!asksToHand) {
        return;
    }

    event.preventDefault();
    emit('hand');
}
</script>

<template>
    <Card
        tone="plain"
        radius="field"
        :lifting="lifting"
        draggable="true"
        class="mt-2 cursor-grab p-0! hover:border-border-3"
    >
        <button
            type="button"
            :aria-label="label"
            class="flex w-full cursor-grab items-center gap-2.5 rounded-field py-1.75 pr-2 pl-2.5 text-left focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-focus"
            @click="emit('open')"
            @keydown="onKey"
        >
            <Icon name="docs" :size="14" class="shrink-0 text-text-3" />
            <span class="min-w-0 flex-1">
                <span class="block truncate text-field text-text">Doc {{ number }} · {{ title }}</span>
                <span class="block truncate text-badge text-text-3">
                    {{ detail }}<template v-if="!handedOver"> · Drag onto an agent</template>
                </span>
            </span>
        </button>
    </Card>
</template>
