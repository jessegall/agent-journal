<script setup lang="ts">
import { computed, onMounted, useTemplateRef } from 'vue';
import Button from './Button.vue';
import Card from './Card.vue';
import Textarea from './Textarea.vue';

/**
 * The bar where a comment on some lines is written: a caption naming the lines and quote, a borderless Textarea that
 * has the focus at once, and a footer with To, the recipient chooser, Cancel and Send. Command or Control with Enter
 * sends; Escape closes it and the draft is kept. Measures: docs/designs/kit-components.md.
 */
const props = defineProps<{ from: number; to: number; quote: string }>();

const emit = defineEmits<{ send: []; cancel: [] }>();
const text = defineModel<string>({ default: '' });

const box = useTemplateRef<HTMLElement>('box');
const range = computed(() => (props.from === props.to ? `line ${props.from}` : `lines ${props.from}–${props.to}`));
const canSend = computed(() => text.value.trim() !== '');

function onKey(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
        event.preventDefault();
        emit('cancel');

        return;
    }

    if (event.key === 'Enter' && (event.metaKey || event.ctrlKey) && canSend.value) {
        event.preventDefault();
        emit('send');
    }
}

onMounted(() => box.value?.querySelector('textarea')?.focus());
</script>

<template>
    <div ref="box" @keydown="onKey">
        <Card active role="group" :aria-label="`Comment on ${range}`" class="px-2.5! py-2!">
            <p class="mb-1.5 truncate text-badge text-text-3">Comment on {{ range }} · “{{ quote }}”</p>
            <Textarea v-model="text" bare :rows="2" aria-label="Your comment" class="min-h-13.5 w-full" />
            <div class="mt-1.5 flex items-center gap-2">
                <span class="text-badge text-text-3">To</span>
                <div class="min-w-0 flex-1"><slot /></div>
                <Button size="sm" @click="emit('cancel')">Cancel</Button>
                <Button variant="primary" size="sm" :disabled="!canSend" @click="emit('send')">Send</Button>
            </div>
        </Card>
    </div>
</template>
